const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
test('homepage offers direct CV-to-skill-test route without required courses', () => {
  assert.match(html, /<a[^>]+href="jornada\.html"[^>]*>\s*Já tenho currículo/);
  assert.match(html, /teste de habilidades/i);
  assert.match(html, /sem (?:precisar fazer|passar pelos) cursos/i);
});
test('city exploration submits to the local vacancy listing without JavaScript', () => {
  assert.match(html, /<form[^>]*action="vagas-de-emprego\.html"[^>]*method="get"/);
  assert.match(html, /<label for="cidade">/);
  assert.match(html, /<select id="cidade" name="cidade">/);
  assert.doesNotMatch(html, /onsubmit="return false/);
});
test('semantic navigation and shared accessibility integrations are available', () => {
  assert.match(html, /<html\b[^>]*\blang="pt-BR"/);
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /href="#conteudo"/);
  assert.match(html, /<button[^>]*data-ng-help/);
  assert.match(html, /<button[^>]*data-ng-accessibility/);
  assert.match(html, /<script src="assets\/js\/nextgen-experience\.js(?:\?v=[a-f0-9]+)?" defer(?:="")?>/);
  assert.match(html, /href="assets\/css\/nextgen-experience\.css(?:\?v=[a-f0-9]+)?"/);
  assert.doesNotMatch(html, /nextgen-custom\.js|cdn\.|mixpanel/);
});
test('editorial image is local, descriptive, and has intrinsic dimensions', () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)];
  assert.ok(images.length > 0);
  for (const [img] of images) {
    const src = img.match(/src="([^"]+)"/)[1];
    assert.ok(fs.existsSync(path.join(root, src)), src);
    assert.match(img, /alt="[^"]+"/);
    assert.match(img, /width="\d+"/);
    assert.match(img, /height="\d+"/);
    assert.doesNotMatch(src, /^https?:/);
  }
});
test('demo limitations and predefined assistant are disclosed', () => {
  assert.match(html, /anúncios são exemplos, não vagas em tempo real/);
  assert.match(html, /respostas predefinidas/);
  assert.match(html, /Não há envio de candidaturas a empresas/);
});
