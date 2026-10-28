/* Arithmetic only; no market data, legal entitlements, taxes or payroll rules. */
(function(root){
  'use strict';
  function compare(current, proposed) {
    return {difference: proposed-current, percent: current === 0 ? null : (proposed-current)/current*100};
  }
  function total(components, deductions) {
    var gross = components.reduce(function(sum,value){return sum + Math.round(value*100);},0)/100;
    return {gross:gross,deductions:deductions,net:Math.round((gross-deductions)*100)/100};
  }
  if (typeof module === 'object' && module.exports) module.exports = {compare:compare,total:total};
  if (!root.document) return;
  var document = root.document;
  var money = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  var percent = new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2});
  function initialize(){
    var form=document.querySelector('form[data-tool]');
    var help=document.querySelector('[data-tools-help]');
    if(help && !help.dataset.toolsReady){
      help.dataset.toolsReady='true';
      help.addEventListener('click',function(){
        var opener=document.querySelector('#ng-experience-launchers [data-ng-help]');
        if(opener) opener.click();
        else root.location.href='jornada.html';
      });
    }
    if(!form || form.dataset.toolsReady) return;
    form.dataset.toolsReady='true';
    var kind=form.dataset.tool;
    var result=document.querySelector('[data-result]');
    var initial=result ? result.textContent : '';
    var preview=document.querySelector('[data-message-preview]');
    var status=document.querySelector('[data-status]');
    var download=document.querySelector('[data-download]');
    var message='';
    function invalidate(){
      if(result) result.textContent=initial;
      if(download){download.hidden=true;message='';preview.textContent='Seu rascunho aparecerá aqui.';status.textContent='Nenhuma mensagem foi enviada. Prepare o rascunho para revisar e baixar.';}
    }
    form.addEventListener('reset',invalidate);
    form.addEventListener('input',invalidate);
    form.addEventListener('change',invalidate);
    function read(name){return Number(form.elements.namedItem(name).value);}
    function line(label,value){
      var row=document.createElement('div');var term=document.createElement('dt');var detail=document.createElement('dd');
      term.textContent=label;detail.textContent=value;row.append(term,detail);return row;
    }
    form.addEventListener('submit',function(event){
      event.preventDefault();
      if(!form.reportValidity()) return;
      if(kind==='contact'){
        var subject=form.elements.namedItem('subject').value.trim();
        var body=form.elements.namedItem('message').value.trim();
        if(!subject || !body){status.textContent='Escreva um assunto e uma mensagem antes de preparar o texto.';return;}
        message='Rascunho local — Gen\nPerfil: '+form.elements.namedItem('profile').value+'\nAssunto: '+subject+'\n\n'+body+'\n\nEste arquivo não foi enviado.\n';
        preview.textContent=message;status.textContent='Rascunho pronto para revisar. A mensagem não foi enviada.';download.hidden=false;return;
      }
      var numbers=Array.from(form.querySelectorAll('input[type=number]')).map(function(input){return Number(input.value);});
      if(numbers.some(function(value){return !Number.isFinite(value)||value<0||value>1000000000;})){
        result.textContent='Use valores de 0 a 1.000.000.000, com no máximo duas casas decimais.';return;
      }
      result.replaceChildren();var list=document.createElement('dl');var note=document.createElement('p');var prominent=document.createElement('strong');prominent.className='tools-total';
      if(kind==='salary'){
        var comparison=compare(read('current'),read('proposed'));
        list.append(line('Valor atual',money.format(read('current'))),line('Valor para comparar',money.format(read('proposed'))));
        prominent.textContent=money.format(comparison.difference);
        note.textContent=comparison.percent===null ? 'Percentual não definido: o valor atual é zero.' : percent.format(comparison.percent)+'% em relação ao valor atual. '+(comparison.difference>0?'O valor comparado é maior.':comparison.difference<0?'O valor comparado é menor.':'Os valores são iguais.');
      }else{
        var summary=total([read('component1'),read('component2'),read('component3')],read('deductions'));
        list.append(line('Créditos informados',money.format(summary.gross)),line('Descontos informados',money.format(summary.deductions)));
        prominent.textContent=money.format(summary.net);note.textContent='Saldo estimado dos valores informados. '+(summary.net<0?'Os descontos superam os créditos. ':'')+'Nenhum direito ou desconto legal foi calculado.';
      }
      result.append(list,prominent,note);
    });
    if(download) download.addEventListener('click',function(){
      if(!message)return;
      var blob=new Blob([message],{type:'text/plain;charset=utf-8'});var url=root.URL.createObjectURL(blob);var link=document.createElement('a');link.href=url;link.download='mensagem-gen.txt';document.body.appendChild(link);link.click();link.remove();root.setTimeout(function(){root.URL.revokeObjectURL(url);},1000);
      status.textContent='Download solicitado. A mensagem continua sem ser enviada.';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})(typeof window !== 'undefined' ? window : globalThis);
