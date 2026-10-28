const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
test('assistente flutuante é circular, rotulado e atende candidatos e empresas',()=>{
 const dom=new JSDOM('<!doctype html><html><body><main>NextGen</main></body></html>',{url:'https://example.test/lopi/index.html',runScripts:'outside-only'});const w=dom.window;w.eval(fs.readFileSync(path.join(root,'assets/js/nextgen-experience.js'),'utf8'));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const button=w.document.querySelector('#ng-experience-launchers [data-ng-help]');assert.ok(button.classList.contains('ng-experience-orb'),'assistente deve usar o botão circular');assert.equal(button.getAttribute('aria-label'),'Ajuda NextGen');assert.ok(button.querySelector('svg'));
 const {answerFor}=require('../assets/js/nextgen-experience.js');assert.equal(answerFor('Minha empresa quer contratar').href,'paraempresas.html');assert.equal(answerFor('Quero anunciar uma vaga').href,'empresa-painel.html');dom.window.close();});
test('todas as páginas usam identidade e navegação comum com Gen verde-claro',()=>{
 const pages=[];function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git'].includes(item.name))continue;const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else if(item.name.endsWith('.html'))pages.push(p);}}walk(root);
 assert.ok(pages.length>=44);
 for(const page of pages){const html=fs.readFileSync(page,'utf8');assert.match(html,/data-site-version="2"/,path.relative(root,page));assert.match(html,/class="site-gen"[^>]*>Gen</,path.relative(root,page));assert.match(html,/nextgen-site\.css/);assert.match(html,/paraempresas\.html/);assert.match(html,/jornada\.html/);assert.doesNotMatch(html,/nextgen-custom\.js|cdn\.|mixpanel|__RequestVerificationToken/,path.relative(root,page));}
 const css=fs.readFileSync(path.join(root,'assets/css/nextgen-site.css'),'utf8');assert.match(css,/--site-green:\s*#b6e38b/i);
});
test('recursos de todas as páginas têm versão de conteúdo para evitar mistura com CSS antigo em cache',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'site-manifest.json'),'utf8'));
 for(const entry of manifest.pages){const dom=new JSDOM(fs.readFileSync(path.join(root,entry.path),'utf8'));for(const node of dom.window.document.querySelectorAll('link[rel="stylesheet"],script[src]')){const value=node.getAttribute(node.tagName==='SCRIPT'?'src':'href');if(value.includes('assets/'))assert.match(value,/\?v=[a-f0-9]{12}$/,entry.path+': '+value);}dom.window.close();}
});
