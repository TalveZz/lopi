const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sourcePath = path.join(__dirname, '../assets/js/nextgen-experience.js');
let JSDOM;
try { ({ JSDOM } = require('jsdom')); } catch {
  try { ({ JSDOM } = require(path.join(process.env.LOCALAPPDATA || '', 'hermes/cache/scratch/ng-experience-test/node_modules/jsdom'))); } catch {}
}
function browser(html = '', denied = false, legacy = false, stored) {
  const dom = new JSDOM('<!doctype html><html><body><main>Conteúdo</main>' + html + '</body></html>', { url: 'https://nextgen.test/', runScripts: 'outside-only' });
  const w = dom.window;
  if (stored !== undefined) w.localStorage.setItem('ng-experience-preferences', stored);
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); this.querySelector('button').focus(); };
  w.HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  if (denied) Object.defineProperty(w, 'localStorage', { get() { throw new Error('storage denied'); } });
  if (legacy) {
    w.setInterval = () => 1;
    w.setTimeout = () => 1;
    w.eval(fs.readFileSync(path.join(__dirname, '../assets/js/nextgen-custom.js'), 'utf8'));
  }
  w.eval(fs.readFileSync(sourcePath, 'utf8'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  return dom;
}
test('shared helper opens a labelled native dialog and restores focus on Escape', { skip: !JSDOM }, () => {
  const dom = browser('<button data-ng-help>Ajuda contextual</button>');
  const d = dom.window.document;
  const launcher = d.querySelector('[data-ng-help]');
  launcher.focus(); launcher.click();
  const dialog = d.querySelector('#ng-experience-help');
  assert.equal(dialog.tagName, 'DIALOG');
  assert.ok(dialog.open);
  assert.ok(d.getElementById(dialog.getAttribute('aria-labelledby')));
  assert.match(dialog.textContent, /Respostas predefinidas\. Não é IA generativa\./);
  dialog.querySelector('[data-ng-topic="cv"]').click();
  assert.equal(dialog.querySelector('[data-ng-answer] a').getAttribute('href'), 'jornada.html');
  dialog.querySelector('input').value = '<script>malicioso</script>';
  dialog.querySelector('form').dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
  assert.equal(dialog.querySelector('[data-ng-answer] script'), null);
  dialog.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(dialog.open, false);
  assert.equal(d.activeElement, launcher);
  dom.window.close();
});
test('switching from help to accessibility does not let queued close events steal focus', { skip: !JSDOM }, () => {
  const dom = browser();
  const d = dom.window.document;
  d.querySelector('[data-ng-help]').click();
  const help = d.querySelector('#ng-experience-help');
  help.querySelector('[data-ng-topic="acessibilidade"]').click();
  help.querySelector('[data-ng-answer] button').click();
  const panel = d.querySelector('#ng-experience-accessibility');
  assert.ok(panel.open);
  help.dispatchEvent(new dom.window.Event('close'));
  assert.ok(panel.contains(d.activeElement));
  panel.querySelector('[data-ng-close]').click();
  assert.equal(d.activeElement, d.querySelector('[data-ng-help]'));
  dom.window.close();
});
test('preferences persist, reflect aria-pressed, and tolerate denied storage', { skip: !JSDOM }, () => {
  const dom = browser();
  const d = dom.window.document;
  d.querySelector('[data-ng-accessibility]').click();
  for (const key of ['largerText', 'highContrast', 'reducedMotion', 'underlinedLinks']) {
    const button = d.querySelector('[data-ng-preference="' + key + '"]');
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    button.click();
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.ok(d.documentElement.classList.contains('ng-x-' + key));
  }
  assert.equal(JSON.parse(dom.window.localStorage.getItem('ng-experience-preferences')).largerText, true);
  dom.window.eval(fs.readFileSync(sourcePath, 'utf8'));
  assert.equal(d.querySelectorAll('#ng-experience-launchers').length, 1);
  dom.window.close();
  const denied = browser('', true, true);
  denied.window.document.querySelector('[data-ng-accessibility]').click();
  denied.window.document.querySelector('[data-ng-preference="largerText"]').click();
  assert.ok(denied.window.document.documentElement.classList.contains('ng-x-largerText'));
  assert.equal(denied.window.document.querySelector('#ngA11yBtn'), null);
  denied.window.close();
});
test('saved preferences restore and reset; malformed data does not break initialization', { skip: !JSDOM }, () => {
  const dom = browser('', false, false, '{"largerText":true,"highContrast":true,"reducedMotion":"invalid"}');
  const d = dom.window.document;
  assert.ok(d.documentElement.classList.contains('ng-x-largerText'));
  assert.ok(d.documentElement.classList.contains('ng-x-highContrast'));
  assert.equal(d.querySelector('[data-ng-preference="reducedMotion"]').getAttribute('aria-pressed'), 'false');
  d.querySelector('[data-ng-reset]').click();
  assert.equal(d.documentElement.classList.contains('ng-x-largerText'), false);
  assert.equal(JSON.parse(dom.window.localStorage.getItem('ng-experience-preferences')).highContrast, false);
  dom.window.close();
  for (const invalid of ['{invalid', 'null']) {
    const malformed = browser('', false, false, invalid);
    assert.ok(malformed.window.document.querySelector('#ng-experience-help'));
    malformed.window.close();
  }
});
test('legacy modals trap keyboard focus, label themselves, and restore the opener', { skip: !JSDOM }, () => {
  const dom = browser('<button id="ngQuizBtn">Ver como funciona</button>', false, true);
  const d = dom.window.document;
  const opener = d.querySelector('#ngQuizBtn');
  opener.focus(); opener.click();
  const modal = d.querySelector('.ng-popup[role="dialog"]');
  assert.ok(modal.getAttribute('aria-label') || d.getElementById(modal.getAttribute('aria-labelledby')));
  assert.ok(modal.contains(d.activeElement));
  const buttons = modal.querySelectorAll('button');
  const first = buttons[0], last = buttons[buttons.length - 1];
  last.focus();
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  assert.equal(d.activeElement, first);
  first.focus();
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
  assert.equal(d.activeElement, last);
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(d.querySelector('.ng-popup-backdrop'), null);
  assert.equal(d.activeElement, opener);
  opener.click();
  d.querySelector('.ng-popup__chip').click();
  assert.ok(d.querySelector('.ng-popup').contains(d.activeElement));
  d.querySelector('.ng-popup__chip').click();
  assert.match(d.querySelector('.ng-quiz').textContent, /pular os cursos/i);
  assert.ok(d.querySelector('.ng-quiz a[href="jornada.html"]'));
  dom.window.close();
});
test('no automatic quiz; preference styles define real global effects and focus indication', () => {
  const legacy = fs.readFileSync(path.join(__dirname, '../assets/js/nextgen-custom.js'), 'utf8');
  assert.doesNotMatch(legacy, /ng_quiz_visto/);
  const cssPath = path.join(__dirname, '../assets/css/nextgen-experience.css');
  assert.ok(fs.existsSync(cssPath), 'shared accessible styles must exist');
  const css = fs.readFileSync(cssPath, 'utf8');
  for (const value of ['ng-x-largerText', 'ng-x-highContrast', 'ng-x-reducedMotion', 'ng-x-underlinedLinks', ':focus-visible', 'prefers-reduced-motion']) assert.ok(css.includes(value), value);
});
test('predefined guidance separates an existing CV from creating a first CV', () => {
  assert.ok(fs.existsSync(sourcePath), 'shared experience script must exist');
  const { answerFor } = require(sourcePath);
  assert.equal(answerFor('Já tenho currículo').href, 'jornada.html');
  assert.equal(answerFor('Quero criar meu primeiro currículo').href, 'jornada.html?rota=criar');
  assert.match(answerFor('Já tenho currículo').text, /pular os cursos/i);
  assert.equal(answerFor('competências').href, 'avaliacao.html');
  assert.equal(answerFor('falar com uma pessoa').href, 'fale-conosco.html');
  assert.match(answerFor('falar com uma pessoa').text, /não.*online/i);
  assert.match(answerFor('acessibilidade').text, /contraste/i);
  assert.match(answerFor('filtrar vagas').text, /filtros/i);
  assert.match(answerFor('xyz sem correspondência').text, /escolha um dos assuntos/i);
});
