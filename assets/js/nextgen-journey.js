/* Jornada demonstrativa inteiramente local. Nenhum arquivo ou resultado é enviado. */
(function(){'use strict';
 const core=window.NextGenJourney;
 const $=id=>document.getElementById(id);
 let route='existing',activeArea='administracao',draftReady=false;
 const names={administracao:'Administração',atendimento:'Atendimento',tecnologia:'Tecnologia'};
 const params=new URLSearchParams(location.search);
 const requestedArea=(params.get('area')||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const mappedArea=requestedArea.includes('administra')?'administracao':requestedArea.includes('atendimento')?'atendimento':requestedArea.includes('tecnolog')?'tecnologia':null;
 if(mappedArea)$('area').value=mappedArea;
 if(params.get('origem')==='vagas'&&params.get('cargo')){
  const context=document.createElement('p');context.id='job-context';context.className='result-warning';context.textContent='Sua preparação para o exemplo “'+params.get('cargo').slice(0,180)+'”. Isto não é uma candidatura.';document.querySelector('.intro').append(context);
 }
 function stage(name){
  ['setup','assessment','result'].forEach(id=>$(id).hidden=id!==name);
  const n={setup:1,assessment:2,result:3}[name];
  for(let i=1;i<=3;i++){const el=$('step-'+i);if(i===n)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');}
  $(name==='setup'?'workspace-title':name==='assessment'?'assessment-title':'result-title').focus();
 }
 function choose(next){route=next; $('existing-fields').hidden=next!=='existing';$('create-fields').hidden=next!=='create';$('route-existing').setAttribute('aria-pressed',String(next==='existing'));$('route-create').setAttribute('aria-pressed',String(next==='create'));$('setup-error').textContent='';}
 $('route-existing').addEventListener('click',()=>choose('existing'));
 $('route-create').addEventListener('click',()=>choose('create'));
 if(new URLSearchParams(location.search).get('rota')==='criar')choose('create');
 $('resume').addEventListener('change',()=>{const file=$('resume').files[0];const error=core.validateResume(file);$('file-status').textContent=error||'Currículo selecionado nesta aba. Você pode ir direto ao teste.';$('file-status').classList.toggle('error',!!error);});
 ['full-name','contact','education','skills'].forEach(id=>$(id).addEventListener('input',()=>{draftReady=false;$('draft-status').textContent='';}));
 function draftError(){if(!$('full-name').value.trim()||!$('contact').value.trim())return 'Preencha seu nome e uma forma de contato para criar o rascunho.';return '';}
 $('download-resume').addEventListener('click',()=>{
  const error=draftError();if(error){$('setup-error').textContent=error;return;}
  const text=[$('full-name').value.trim(),$('contact').value.trim(),'','OBJETIVO',names[$('area').value],'','FORMAÇÃO E CURSOS',$('education').value.trim()||'A preencher.','','HABILIDADES, PROJETOS E EXPERIÊNCIAS',$('skills').value.trim()||'A preencher.'].join('\n');
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='curriculo-nextgen.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);draftReady=true;$('setup-error').textContent='';$('draft-status').textContent='Rascunho baixado. Revise o conteúdo antes de compartilhar com empresas.';
 });
 $('setup-form').addEventListener('submit',event=>{
  event.preventDefault();let error=route==='existing'?core.validateResume($('resume').files[0]):draftError();
  if(route==='create'&&!error&&!draftReady)error='Baixe o rascunho do seu currículo antes de continuar.';
  $('setup-error').textContent=error;if(error)return;
  activeArea=$('area').value;$('assessment-title').textContent='Habilidades em '+names[activeArea];$('assessment-intro').textContent='Responda às 5 situações abaixo. Você pode revisar suas escolhas antes de conferir o resultado.';
  $('questions').replaceChildren();$('assessment-error').textContent='';
  core.questions[activeArea].forEach((q,i)=>{const field=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=(i+1)+'. '+q.text;field.append(legend);q.options.forEach((text,j)=>{const label=document.createElement('label');label.className='question-option';const radio=document.createElement('input');radio.type='radio';radio.name='question-'+i;radio.value=j;label.append(radio,document.createTextNode(text));field.append(label);});$('questions').append(field);});stage('assessment');
 });
 $('back-setup').addEventListener('click',()=>stage('setup'));
 $('retry').addEventListener('click',()=>stage('setup'));
 $('assessment-form').addEventListener('submit',event=>{
  event.preventDefault();const answers=core.questions[activeArea].map((q,i)=>{const el=document.querySelector('input[name="question-'+i+'"]:checked');return el?Number(el.value):null;});
  let outcome;try{outcome=core.evaluate(activeArea,answers);}catch(error){$('assessment-error').textContent=error.message;const first=answers.indexOf(null);if(first>=0)document.querySelector('input[name="question-'+first+'"]').focus();return;}
  $('result-score').textContent=outcome.score+'% de acertos';$('result-title').textContent=outcome.passed?'Selo NextGen demonstrativo':'Você já sabe onde pode avançar.';
  $('result-summary').textContent=outcome.passed?'Você acertou '+outcome.correct+' de '+outcome.total+' situações introdutórias em '+names[activeArea]+'. Não precisa fazer um curso para explorar as vagas.':'Você acertou '+outcome.correct+' de '+outcome.total+' situações. Revise as explicações, explore os cursos se quiser e tente novamente. As vagas continuam disponíveis para você.';
  $('review').replaceChildren();core.questions[activeArea].forEach((q,i)=>{const article=document.createElement('div');article.className='review-item';const title=document.createElement('strong');title.textContent=(i+1)+'. '+q.text;const choice=document.createElement('p');choice.textContent='Sua resposta: '+q.options[answers[i]];const answer=document.createElement('p');answer.textContent='Resposta indicada: '+q.options[q.correct]+'. '+q.explanation;article.append(title,choice,answer);$('review').append(article);});stage('result');
 });
})();
