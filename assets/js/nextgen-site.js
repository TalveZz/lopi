/* Shared navigation enhancement; the complete navigation also works without JS. */
(function(){'use strict';
 function init(){
  document.querySelectorAll('.site-account,.site-mobile-menu').forEach(menu=>{
   const summary=menu.querySelector('summary');
   menu.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;summary.focus();event.preventDefault();}});
   document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
