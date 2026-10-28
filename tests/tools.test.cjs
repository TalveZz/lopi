const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.resolve(__dirname, '..');
function page(name) { const dom = new JSDOM(fs.readFileSync(path.join(root,name),'utf8'), {runScripts:'outside-only', url:'http://localhost/'+name}); dom.window.eval(fs.readFileSync(path.join(root,'assets/js/nextgen-tools.js'),'utf8')); dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded')); return dom; }
function submit(dom) {dom.window.document.querySelector('form[data-tool]').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));}
function set(dom,name,value) {dom.window.document.querySelector('[name="'+name+'"]').value=value;}

test('owned routes are rewritten, local, accessible and use the shared shell', () => {
  for (const name of files) {
    const doc = new JSDOM(fs.readFileSync(path.join(root,name),'utf8')).window.document;
    assert.equal(doc.querySelectorAll('h1').length,1,name);
    assert.ok(doc.querySelector('main#main'),name+' main');
    assert.ok(doc.querySelector('link[href^="assets/css/nextgen-tools.css"]'),name+' stylesheet');
    assert.ok(doc.querySelector('link[href^="assets/css/nextgen-site.css"]'),name+' shared stylesheet');
    for(const script of doc.querySelectorAll('script[src]')) assert.match(script.getAttribute('src'), /^assets\/js\/nextgen-(tools|site|experience)\.js(?:\?v=[a-f0-9]+)?$/);
    assert.equal(doc.querySelectorAll('input[type=password], input[name=cpf]').length,0);
  }
});
test('candidate entry and callback explain local access with real journey links',()=>{
  for(const name of files.slice(0,3)) {
    const doc=page(name).window.document;
    assert.ok(doc.querySelector('a[href="jornada.html"]'),name);
    assert.match(doc.body.textContent,/sem (senha|autenticação)|não.*autenticação/i);
  }
});
test('salary UI compares user figures without invented market averages',()=>{
  const dom=page('media-salarial.html'); set(dom,'current','3000');set(dom,'proposed','3600');submit(dom);
  assert.match(dom.window.document.querySelector('[data-result]').textContent,/600,00/);
  assert.match(dom.window.document.querySelector('[data-result]').textContent,/20/);
});
test('vacation and termination sum only entered components minus deductions, including negatives',()=>{
  const tools=require('../assets/js/nextgen-tools.js');
  assert.deepEqual(tools.total([1000,200,50],150),{gross:1250,deductions:150,net:1100});
  for (const file of ['calculadora-ferias.html','calculadora-rescisao.html']) {
    const dom=page(file); ['component1','component2','component3','deductions'].forEach((name,i)=>set(dom,name,['1000','200','50','150'][i]));submit(dom);
    assert.match(dom.window.document.querySelector('[data-result]').textContent,/1\.100,00/);
    set(dom,'deductions','2000'); submit(dom); assert.match(dom.window.document.querySelector('[data-result]').textContent,/-.*750,00/);
    dom.window.document.querySelector('form').reset(); assert.match(dom.window.document.querySelector('[data-result]').textContent,/Preencha/);
  }
});
test('contact composes text locally and offers a download without pretending to send',()=>{
  const dom=page('fale-conosco.html'); set(dom,'profile','empresa');set(dom,'subject','Minha dúvida');set(dom,'message','Como organizar minha busca?');submit(dom);
  assert.match(dom.window.document.querySelector('[data-message-preview]').textContent,/Minha dúvida/);
  assert.match(dom.window.document.querySelector('[data-message-preview]').textContent,/empresa/);
  assert.equal(dom.window.document.querySelector('[data-download]').hidden,false);
  assert.match(dom.window.document.querySelector('[data-status]').textContent,/não.*enviad/i);
  set(dom,'message','Mudou');dom.window.document.querySelector('[name=message]').dispatchEvent(new dom.window.Event('input',{bubbles:true}));assert.equal(dom.window.document.querySelector('[data-download]').hidden,true);
});
test('real Chrome: seven mobile pages, axe, local flows and a real text download', async () => {
  const http=require('node:http');
  const {chromium}=require('@playwright/test');
  const AxeBuilder=require('@axe-core/playwright').default;
  const server=http.createServer((req,res)=>{
    let file;try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));}catch{res.writeHead(400).end();return;}
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2'};
    fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
    const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
    const page=await context.newPage();const errors=[];page.on('pageerror',err=>errors.push(err.message));
    const base='http://127.0.0.1:'+server.address().port+'/';
    for(const file of files){
      await page.goto(base+encodeURI(file));await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('h1').count(),1,file);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,file+' no overflow');
      const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],file+' axe');
    }
    for(const file of ['cadastro-inicial.html','Login@tipoPerfil=Candidato.html','signin-oidc.html']){
      await page.goto(base+encodeURI(file));await page.locator('main a[href="jornada.html"]').first().click();await page.waitForURL('**/jornada.html');assert.ok(await page.locator('main').count());
    }
    await page.goto(base+'media-salarial.html');await page.locator('[name=current]').fill('3000');await page.locator('[name=proposed]').fill('3600');await page.getByRole('button',{name:'Comparar valores'}).click();assert.match(await page.locator('[data-result]').innerText(),/600,00/);
    await page.locator('[name=current]').fill('0');await page.getByRole('button',{name:'Comparar valores'}).click();assert.match(await page.locator('[data-result]').innerText(),/não definido/);
    for(const file of ['calculadora-ferias.html','calculadora-rescisao.html']){
      await page.goto(base+file);for(const [name,value] of Object.entries({component1:'1000',component2:'200',component3:'50',deductions:'150'}))await page.locator('[name='+name+']').fill(value);
      await page.getByRole('button',{name:'Organizar valores'}).click();assert.match(await page.locator('[data-result]').innerText(),/1\.100,00/);await page.getByRole('button',{name:'Limpar',exact:true}).click();assert.match(await page.locator('[data-result]').innerText(),/Preencha/);
    }
    await page.goto(base+'fale-conosco.html');await page.locator('[name=profile]').selectOption('empresa');await page.locator('[name=subject]').fill('Dúvida de teste');await page.locator('[name=message]').fill('Texto local, sem envio.');await page.getByRole('button',{name:'Preparar meu texto'}).click();
    const downloaded=page.waitForEvent('download');await page.locator('[data-download]').click();const download=await downloaded;assert.equal(download.suggestedFilename(),'mensagem-gen.txt');const text=fs.readFileSync(await download.path(),'utf8');assert.match(text,/Dúvida de teste/);assert.match(text,/Perfil: empresa/);assert.match(text,/não foi enviado/);
    await page.locator('[data-tools-help]').click();assert.equal(await page.locator('#ng-experience-help').evaluate(el=>el.open),true);await page.keyboard.press('Escape');
    await page.setViewportSize({width:320,height:740});await page.goto(base+'calculadora-ferias.html');
    for(const name of ['component1','component2','component3'])await page.locator('[name='+name+']').fill('1000000000');await page.locator('[name=deductions]').fill('0');await page.getByRole('button',{name:'Organizar valores'}).click();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'maximum entered totals fit narrow mobile');
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+'media-salarial.html');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    assert.deepEqual(errors,[],'no browser runtime errors');
    await context.close();
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
});

const files = ['cadastro-inicial.html','Login@tipoPerfil=Candidato.html','signin-oidc.html','fale-conosco.html','media-salarial.html','calculadora-ferias.html','calculadora-rescisao.html'];
test('salary compares only entered monthly figures and handles a zero baseline', () => {
  assert.ok(fs.existsSync(path.join(root,'assets/js/nextgen-tools.js')), 'new local tools implementation exists');
  const tools = require('../assets/js/nextgen-tools.js');
  assert.deepEqual(tools.compare(3000,3600), {difference:600,percent:20});
  assert.deepEqual(tools.compare(0,2000), {difference:2000,percent:null});
  assert.deepEqual(tools.compare(4000,3000), {difference:-1000,percent:-25});
});
