const {chromium}=require('@playwright/test');
const {default:AxeBuilder}=require('@axe-core/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();try{
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/index.html');
 await page.locator('#ng-experience-launchers [data-ng-help]').first().click();
 await page.locator('[data-ng-topic="cv"]').click();
 assert.match(await page.locator('[data-ng-answer]').innerText(),/pular os cursos/);
 await page.keyboard.press('Escape'); assert.equal(await page.locator('#ng-experience-help').isVisible(),false);
 await page.locator('#ng-experience-launchers [data-ng-accessibility]').first().click();
 await page.getByRole('button',{name:'Texto maior',exact:true}).click();
 await page.getByRole('button',{name:'Alto contraste',exact:true}).click();
 await page.keyboard.press('Escape');await page.reload();
 assert.ok(await page.locator('html').evaluate(el=>el.classList.contains('ng-x-largerText')&&el.classList.contains('ng-x-highContrast')));
 await page.locator('#ng-experience-launchers [data-ng-accessibility]').first().click();await page.getByRole('button',{name:'Restaurar preferências'}).click();await page.keyboard.press('Escape');
 const audits=[];
 for(const file of ['index.html','jornada.html']){
  await page.goto('http://127.0.0.1:4173/'+file);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  audits.push({file,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),file+' overflow '+width);}
 }
 console.log(JSON.stringify({audits,errors},null,2));
 assert.equal(audits.reduce((sum,a)=>sum+a.violations.length,0),0,'WCAG axe violations');assert.equal(errors.length,0,'new pages JS errors');
 await page.goto('http://127.0.0.1:4173/vagas-de-emprego-por-estado/rio-de-janeiro.html');
 await page.locator('#ng-experience-launchers [data-ng-help]').first().click();await page.locator('[data-ng-topic="cv"]').click();
 assert.equal(new URL(await page.locator('[data-ng-answer] a').getAttribute('href'),page.url()).pathname,'/jornada.html','nested pages resolve helper links to site root');
 console.log('PASS: real dialog keyboard, preferences persistence, responsive widths, WCAG axe and nested help link');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
