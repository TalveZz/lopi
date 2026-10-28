const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('@playwright/test');
const { before, after } = require('node:test');
let browser, server, base;
before(async () => {
  const root = path.resolve(__dirname, '..');
  server = http.createServer((req,res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error,data) => {
      if (error) {res.writeHead(404).end(); return;}
      res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.woff2':'font/woff2'})[path.extname(file)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({headless:true, ...(fs.existsSync(chromium.executablePath()) ? {} : {channel:'chrome'})});
});
after(async () => {if(browser) await browser.close(); if(server) await new Promise(resolve => server.close(resolve));});

test('browser renders honest examples, honors query filters and offers a recoverable empty state', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(base+'/vagas-de-emprego.html?q=administrativo&cidade=Niter%C3%B3i&estado=RJ&area=Administra%C3%A7%C3%A3o');
    await page.locator('[data-job-card]').first().waitFor({timeout:5000});
    assert.equal(await page.locator('[data-job-card]').count(),2);
    assert.match(await page.locator('main').innerText(),/Vagas demonstrativas — não são anúncios ativos/);
    assert.equal(await page.getByLabel('Palavra-chave').inputValue(),'administrativo');
    await page.getByLabel('Palavra-chave').fill('inexistente');
    await page.getByRole('button',{name:'Buscar vagas',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),0);
    assert.equal(await page.getByText('Nenhum exemplo com esses filtros.').isVisible(),true);
    await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),15);
    assert.equal(await page.getByText('Acessibilidade não informada',{exact:true}).count(),15);
    await page.getByLabel('Somente com indicação PCD no anúncio original').check();
    assert.equal(await page.locator('[data-job-card]').count(),9);
  } finally {await page.close();}
});

test('job details use a named native modal with keyboard dismissal, focus return and contextual preparation link', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(base+'/vagas-de-emprego.html');
    const opener = page.locator('[data-job-card="10119109"]').getByRole('button',{name:'Ver detalhes'});
    await opener.click({timeout:3000});
    const dialog = page.getByRole('dialog',{name:'Jovem Aprendiz — Administração',exact:true});
    assert.equal(await dialog.isVisible(),true);
    assert.match(await dialog.innerText(),/Acessibilidade não informada/);
    assert.match(await dialog.innerText(),/Requisitos e atividades não informados no acervo original/);
    const href = await dialog.getByRole('link',{name:'Preparar meu currículo para este exemplo'}).getAttribute('href');
    assert.equal(new URL(href,base).pathname,'/jornada.html');
    assert.equal(new URL(href,base).searchParams.get('vaga'),'10119109');
    await page.keyboard.press('Escape');
    assert.equal(await dialog.isVisible(),false);
    assert.equal(await opener.evaluate(node => node === document.activeElement),true);
    await opener.press('Enter');
    await dialog.getByRole('button',{name:'Fechar detalhes'}).click();
    assert.equal(await opener.evaluate(node => node === document.activeElement),true);
  } finally {await page.close();}
});

test('saved examples persist locally, toggle back, and survive malformed or blocked storage safely', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(base+'/vagas-de-emprego.html');
    const first = page.locator('[data-job-card="10119109"]');
    await first.getByRole('button',{name:'Salvar Jovem Aprendiz — Administração',exact:true}).click({timeout:3000});
    assert.equal(await first.getByRole('button',{name:'Remover Jovem Aprendiz — Administração das salvas',exact:true}).getAttribute('aria-pressed'),'true');
    await page.reload();
    await page.getByRole('button',{name:'Salvas 1',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),1);
    await first.getByRole('button',{name:'Remover Jovem Aprendiz — Administração das salvas',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),0);
    assert.equal(await page.locator('#saved-filter').evaluate(n=>n===document.activeElement),true);
    await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),15,'clearing filters also exits saved-only mode');
    assert.equal(await page.locator('#saved-filter').getAttribute('aria-pressed'),'false');
    await page.evaluate(()=>localStorage.setItem('ng-saved-jobs','{broken'));
    await page.reload();
    assert.equal(await page.locator('[data-job-card]').count(),15);
    await page.evaluate(()=>localStorage.setItem('ng-saved-jobs',JSON.stringify(['10119109','unknown',{},'10119109'])));
    await page.reload();
    assert.equal(await page.locator('#saved-count').innerText(),'1');
    await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
    await page.reload();
    await first.getByRole('button',{name:'Salvar Jovem Aprendiz — Administração',exact:true}).click();
    assert.match(await page.locator('#jobs-status').innerText(),/somente nesta aba/);
    await page.getByRole('button',{name:'Salvas 1',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),1);
  } finally {await page.close();}
});

test('URL aliases and combined homepage locations preserve intent rather than silently showing all jobs', async () => {
  const page = await browser.newPage();
  try {
    for (const query of ['q=aprendiz&city=Niteroi&state=RJ','q=aprendiz&local=Niter%C3%B3i%2C%20RJ','q=aprendiz&local=Niter%C3%B3i%2FRJ']) {
      await page.goto(base+'/vagas-de-emprego.html?'+query);
      assert.equal(await page.locator('[data-job-card]').count(),3,query);
    }
    await page.goto(base+'/vagas-de-emprego.html?local=SP');
    assert.equal(await page.locator('[data-job-card]').count(),0);
    await page.goto(base+'/vagas-de-emprego.html?area=Unknown&estado=XX');
    assert.equal(await page.locator('[data-job-card]').count(),0);
    assert.equal(await page.getByLabel('Área de interesse').inputValue(),'Unknown');
    assert.equal(await page.getByLabel('Estado',{exact:true}).inputValue(),'XX');
    await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
    assert.equal(await page.locator('[data-job-card]').count(),15);
  } finally {await page.close();}
});

test('desktop, narrow mobile, empty state and job dialog have no WCAG A/AA axe violations or horizontal overflow', async () => {
  const AxeBuilder = require('@axe-core/playwright').default;
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage();
  const errors = [], failed = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {if(response.status()>=400) failed.push(response.url());});
  page.on('request', request => {if(!request.url().startsWith(base)) external.push(request.url());});
  const audit = async () => {
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    assert.deepEqual(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true, JSON.stringify(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,elements:Array.from(document.querySelectorAll('body *')).filter(n=>n.scrollWidth>n.clientWidth+1).map(n=>({tag:n.tagName,class:n.className,text:n.textContent.slice(0,60),scroll:n.scrollWidth,client:n.clientWidth}))}))));
  };
  try {
    await page.goto(base+'/vagas-de-emprego.html');
    await audit();
    if(process.env.JOBS_SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.JOBS_SCREENSHOT_DIR,'nextgen-jobs-desktop.png')});
    await page.locator('[data-job-card]').first().getByRole('button',{name:'Ver detalhes'}).click();
    await audit();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#job-details').evaluate(n=>n.contains(document.activeElement)),true);
    await page.keyboard.press('Escape');
    for(const width of [390,320]) {await page.setViewportSize({width,height:844}); await audit();}
    if(process.env.JOBS_SCREENSHOT_DIR) {await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(process.env.JOBS_SCREENSHOT_DIR,'nextgen-jobs-mobile.png'),fullPage:true});}
    await page.locator('#saved-filter').click();
    await audit();
    await page.locator('#saved-filter').click();
    await page.locator('#ng-experience-launchers [data-ng-accessibility]').first().click();
    await page.getByRole('button',{name:'Texto maior',exact:true}).click();
    await page.getByRole('button',{name:'Fechar Acessibilidade',exact:true}).click();
    const overflowing = await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(n=>n.getBoundingClientRect().right>innerWidth+1).map(n=>({tag:n.tagName,class:n.className,text:n.textContent.slice(0,90),right:n.getBoundingClientRect().right})));
    assert.deepEqual(overflowing,[],'larger text must not cause horizontal scrolling');
    await page.setViewportSize({width:320,height:844});
    if(process.env.JOBS_SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.JOBS_SCREENSHOT_DIR,'nextgen-jobs-enlarged.png')});
    await audit();
    await page.getByRole('button',{name:'Ver detalhes'}).first().click();
    await audit();
    await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);
    assert.deepEqual(failed,[]);
    assert.deepEqual(external,[]);
  } finally {await page.close();}
});

test('homepage city form navigates to genuinely filtered local results', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(base+'/index.html');
    const search = page.getByRole('search',{name:'Buscar vagas demonstrativas por cidade'});
    await search.getByLabel('Cidade da oportunidade').selectOption('São Gonçalo');
    await Promise.all([page.waitForURL('**/vagas-de-emprego.html?cidade=*'),search.getByRole('button',{name:'Explorar vagas'}).click()]);
    await page.locator('[data-job-card]').first().waitFor();
    assert.equal(await page.locator('[data-job-card]').count(),1);
    assert.equal(await page.getByRole('heading',{name:'Auxiliar de Logística',exact:true}).count(),1);
    assert.equal(await page.getByLabel('Cidade',{exact:true}).inputValue(),'São Gonçalo');
  } finally {await page.close();}
});

test('filters intersect keyword, city, state and title-derived area without accent sensitivity', () => {
  const { jobs, filterJobs } = require('../assets/js/nextgen-jobs.js');
  assert.equal(filterJobs(jobs, { q: 'administracao', cidade: 'niteroi', estado: 'rj', area: 'Administração' }).length, 1);
  assert.equal(filterJobs(jobs, { q: 'Tecnova', city: 'Rio de Janeiro', state: 'RJ', area: 'Tecnologia' })[0].id, '13720204');
  assert.equal(filterJobs(jobs, { estado: 'SP' }).length, 0);
  assert.equal(filterJobs(jobs, { cidade: 'cidade inexistente' }).length, 0);
  assert.equal(filterJobs(jobs, { pcd: true }).length, supplied.filter(j => j[6]).length);
  assert.equal(filterJobs(jobs, { accessible: true }).length, 0);
  assert.equal(filterJobs(jobs, { savedOnly: true, saved: ['10129790'] })[0].id, '10129790');
});

// Source transcription captured BEFORE replacing vagas-de-emprego.html.
const supplied = [
  ['10119109','Jovem Aprendiz — Administração','Padaria e Confeitaria Litoral','R$ 1.212,00 por mês','Niterói','RJ',true],
  ['10129790','Auxiliar Administrativo','Clínica Vida Plena','R$ 1.950,00 por mês','Niterói','RJ',true],
  ['10150998','Atendente Comercial','Mercado Central de Niterói','R$ 1.800,00 por mês','Niterói','RJ',true],
  ['13720264','Assistente de Vendas','Ótica Visão Clara','R$ 2.100,00 por mês','Rio de Janeiro','RJ',false],
  ['4313516','Recepcionista','Colégio Horizontes','R$ 2.020,00 por mês','Rio de Janeiro','RJ',true],
  ['13720262','Operador de Caixa','Supermercado Atlântico','R$ 1.745,00 por mês','Rio de Janeiro','RJ',false],
  ['13720255','Motorista de Entrega — vaga PCD','Vivaz Distribuição','R$ 2.300,00 por mês','Rio de Janeiro','RJ',true],
  ['13719513','Monitor de Capacitação de Jovens','Instituto Caminho Certo','R$ 1.620,00 por mês','Niterói','RJ',false],
  ['13720204','Estágio em TI — Suporte','Tecnova Sistemas','R$ 1.500,00 por mês','Rio de Janeiro','RJ',true],
  ['13720169','Auxiliar de Logística','Distribuidora Ilha Verde','R$ 1.980,00 por mês','São Gonçalo','RJ',false],
  ['13720159','Jovem Aprendiz — Varejo','Shopping Litoral Plaza','R$ 1.260,00 por mês','Niterói','RJ',true],
  ['13720157','Auxiliar de Loja','Loja Maré Azul','R$ 1.750,00 por mês','Rio de Janeiro','RJ',false],
  ['13720154','Auxiliar Administrativo — Turno Tarde','Estacionamento Portão 10','R$ 1.850,00 por mês','Niterói','RJ',true],
  ['13720153','Assistente de Exposição','Casa & Cia Móveis','R$ 1.700,00 por mês','Rio de Janeiro','RJ',false],
  ['13720173','Jovem Aprendiz — Atendimento','Café Panorama','R$ 1.230,00 por mês','Niterói','RJ',true]
];

test('preserves all supplied titles, companies, salaries, cities and actual PCD evidence', () => {
  const { jobs } = require('../assets/js/nextgen-jobs.js');
  assert.deepEqual(jobs.map(j => [j.id,j.title,j.company,j.salary,j.city,j.state,j.pcd]), supplied);
  assert.ok(jobs.every(j => j.accessibility === 'Acessibilidade não informada'));
});
