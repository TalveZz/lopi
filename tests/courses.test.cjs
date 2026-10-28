const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const BASE = process.env.NEXTGEN_BASE_URL || 'http://127.0.0.1:4173';
async function visit(fn, pageName = 'cursos.html') {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try { const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${BASE}/${pageName}`); await fn(page); } finally { await browser.close(); }
}
test('courses: detail, keyboard escape/focus, lesson correction, persistent demo completion and reset', async () => visit(async page => {
  const open = page.getByRole('button', {name:'Explorar Excel para o trabalho', exact:true});
  await open.focus(); await page.keyboard.press('Enter');
  await page.getByRole('dialog').waitFor();
  assert.match(await page.getByRole('dialog').innerText(), /Soma de valores/);
  await page.keyboard.press('Escape');
  assert.equal(await open.evaluate(el => el === document.activeElement), true);
  await open.click();
  await page.getByRole('button', {name:'Experimentar aula demo'}).click();
  assert.match(await page.getByRole('dialog').innerText(), /SOMA\(B2:B4\)/);
  await page.getByLabel('Usar apenas o valor de B2.', {exact:true}).check();
  await page.getByRole('button', {name:'Conferir resposta'}).click();
  assert.match(await page.locator('#course-feedback').innerText(), /Tente novamente/);
  assert.equal(await page.getByRole('button', {name:'Concluir aula demo'}).isVisible(), false);
  await page.getByLabel('Somar o intervalo B2:B4.', {exact:true}).check();
  await page.getByRole('button', {name:'Conferir resposta'}).click();
  await page.getByRole('button', {name:'Concluir aula demo'}).click();
  assert.match(await page.locator('#course-completion').innerText(), /Aula demo concluída/);
  assert.match(await page.locator('#course-completion').innerText(), /não é um certificado/);
  await page.reload(); await open.click();
  assert.match(await page.getByRole('dialog').innerText(), /Aula demo concluída/);
  await page.getByRole('button', {name:'Apagar conclusão demo'}).click();
  assert.equal(await page.getByText('Aula demo concluída', {exact:true}).count(), 0);
}));
test('courses: all nine lessons have specific reading, examples and working exercises', async () => visit(async page => {
  const answers = [1,0,1,2,0,1,2,0,1];
  for (let i = 0; i < 9; i++) {
    await page.locator('.course-open').nth(i).click();
    await page.getByRole('button', {name:'Experimentar aula demo'}).click();
    assert.ok((await page.locator('.course-example').innerText()).length > 80);
    await page.locator(`input[name="answer"][value="${answers[i]}"]`).check();
    await page.getByRole('button', {name:'Conferir resposta'}).click();
    assert.match(await page.locator('#course-feedback').innerText(), /Isso mesmo!/);
    await page.getByRole('button', {name:'Concluir aula demo'}).click();
    assert.equal(await page.locator('#course-completion').isVisible(), true);
    await page.keyboard.press('Escape');
  }
}));
test('courses: mobile reflow, keyboard focus containment and axe catalog/detail/lesson', async () => visit(async page => {
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width, height:900});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow at ${width}`);
  }
  const catalog = await new AxeBuilder({page}).analyze();
  assert.deepEqual(catalog.violations.map(v => ({id:v.id, nodes:v.nodes.map(n => n.target)})), []);
  await page.locator('.course-open').first().click();
  for (let i=0;i<10;i++) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => !!document.activeElement.closest('dialog')), true); }
  const details = await new AxeBuilder({page}).analyze();
  assert.deepEqual(details.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})), []);
  await page.getByRole('button', {name:'Experimentar aula demo'}).click();
  const lesson = await new AxeBuilder({page}).analyze();
  assert.deepEqual(lesson.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})), []);
  assert.equal(await page.locator('.course-dialog').evaluate(el => el.scrollWidth <= el.clientWidth), true);
  await page.keyboard.press('Escape');
  if (process.env.COURSES_SCREENSHOT) { await page.setViewportSize({width:1440,height:1000}); await page.screenshot({path:process.env.COURSES_SCREENSHOT,fullPage:true}); }
}));
test('courses: denied localStorage keeps lesson usable and states temporary completion honestly', async () => visit(async page => {
  await page.addInitScript(() => { Storage.prototype.setItem = function(){ throw new Error('blocked'); }; });
  await page.reload();
  await page.locator('.course-open').first().click();
  await page.getByRole('button', {name:'Experimentar aula demo'}).click();
  await page.locator('input[name="answer"][value="1"]').check();
  await page.getByRole('button', {name:'Conferir resposta'}).click();
  await page.getByRole('button', {name:'Concluir aula demo'}).click();
  assert.match(await page.locator('#course-completion').innerText(), /somente nesta aba/);
  await page.keyboard.press('Escape');
  await page.locator('.course-open').first().click();
  assert.match(await page.locator('#course-completion').innerText(), /somente nesta aba/);
}));
test('courses: catalog photographs, combined accent-insensitive search, empty state and reset on both routes', async () => {
  for (const route of ['cursos.html', 'cursos-antigo-backup.html']) await visit(async page => {
    assert.equal(await page.locator('.course-card:visible').count(), 9);
    assert.equal(await page.locator('.course-card img').evaluateAll(imgs => imgs.filter(i => i.complete && i.naturalWidth > 0 && i.alt && i.width && i.height).length), 9);
    await page.getByLabel('Buscar curso').fill('INFORMATICA');
    assert.equal(await page.locator('.course-card:visible').count(), 1);
    await page.getByLabel('Área de interesse').selectOption('Logística');
    assert.equal(await page.locator('.course-card:visible').count(), 0);
    assert.equal(await page.getByText('Nenhum curso encontrado.').isVisible(), true);
    await page.getByRole('button', {name:'Limpar filtros'}).click();
    assert.equal(await page.locator('.course-card:visible').count(), 9);
    assert.match(await page.locator('#course-results').innerText(), /9 cursos/);
  }, route);
});
