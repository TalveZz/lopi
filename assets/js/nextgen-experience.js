/* NextGen: orientação local, sem IA generativa e sem envio de mensagens. */
(function (root) {
  'use strict';
  var topics = {
    boasvindas: { label: 'Como funciona a ajuda?', text: 'Oi! Como posso te ajudar hoje? Você busca uma oportunidade ou representa uma empresa? Toque em uma das respostas rápidas para continuarmos. Sou uma assistente automática, não uma atendente humana.' },
    candidato: { label: 'Sou candidato', text: 'Vamos encontrar seu próximo passo. Se já tem currículo, você pode ir direto ao teste. Se está começando, pode criar um rascunho ou experimentar uma aula gratuita. Qual dessas opções faz mais sentido para você?', href: 'jornada.html', action: 'Começar minha jornada' },
    cursos: { label: 'Quero aprender', text: 'Você encontra aulas demonstrativas gratuitas de carreira, tecnologia, atendimento e logística. Escolha um tema, faça a atividade e acompanhe sua conclusão local. Cursos são opcionais e não emitem certificado profissional.', href: 'cursos.html', action: 'Explorar aulas gratuitas' },
    empresa: { label: 'Quero contratar', text: 'A NextGen também atende empresas. Conheça o caminho de recrutamento por competências e explore o painel demonstrativo. Não há contratação ou acesso a candidatos reais neste protótipo.', href: 'paraempresas.html', action: 'Conhecer a NextGen para empresas' },
    anunciar: { label: 'Anunciar uma vaga', text: 'No painel da empresa você pode criar, editar e encerrar um rascunho local de vaga. Ele não será publicado para candidatos reais nem enviado a empresas.', href: 'empresa-painel.html', action: 'Abrir painel da empresa' },
    cv: { label: 'Já tenho currículo', text: 'Você pode pular os cursos e fazer o teste de competências na Jornada NextGen para identificar seus próximos passos.', href: 'jornada.html', action: 'Testar minhas competências' },
    criar: { label: 'Meu primeiro currículo', text: 'Comece pela criação do seu primeiro currículo na Jornada NextGen. Você pode explorar suas competências no seu ritmo.', href: 'jornada.html?rota=criar', action: 'Criar meu currículo' },
    skills: { label: 'Demonstrar habilidades', text: 'Escolha uma habilidade e resolva um desafio prático. Você pode estudar antes ou ir direto às tarefas. O relatório registra a correção objetiva e sua entrega escrita, que permanece com revisão humana pendente. O registro local não é certificação profissional.', href: 'avaliacao.html', action: 'Fazer uma avaliação prática' },
    acessibilidade: { label: 'Acessibilidade', text: 'Abra Acessibilidade para aumentar o texto, ativar alto contraste, reduzir movimentos ou sublinhar links. As preferências ficam neste navegador.', accessibility: true, action: 'Abrir acessibilidade' },
    vagas: { label: 'Filtros de vagas', text: 'Na página de vagas, use os filtros disponíveis para refinar sua busca e os controles de região para escolher a cidade. Confira os requisitos de cada oportunidade.', href: 'vagas-de-emprego.html', action: 'Explorar vagas' },
    humano: { label: 'Falar com uma pessoa', text: 'Entendi. Este protótipo não oferece atendimento humano online. Na página de contato você pode preparar e baixar uma mensagem para compartilhar por um canal da sua escolha; nada é enviado automaticamente.', href: 'fale-conosco.html', action: 'Preparar uma mensagem' }
  };
  function answerFor(value) {
    var text = String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (topics[text]) return topics[text];
    if (/^(oi|ola|bom dia|boa tarde|boa noite|inicio|voltar|menu)[!.?\s]*$/.test(text)) return topics.boasvindas;
    if (/sou candidato|primeiro emprego|oportunidade/.test(text)) return topics.candidato;
    if (/anunci|publicar vaga|criar vaga|cadastrar vaga/.test(text)) return topics.anunciar;
    if (/empresa|contratar|recrutad|\brh\b/.test(text)) return topics.empresa;
    if (/primeir|criar|montar|nao tenho|sem curriculo/.test(text)) return topics.criar;
    if (/ja (?:tenho|tem|tiver|possuo)|possuo|meu curriculo|\bcv\b/.test(text)) return topics.cv;
    if (/competen|habilidad|skills|teste/.test(text)) return topics.skills;
    if (/curso|aprender|aula|estudar|capacit/.test(text)) return topics.cursos;
    if (/sou candidato|primeiro emprego|oportunidade/.test(text)) return topics.candidato;
    if (/acess|contraste|fonte|texto maior|movimento/.test(text)) return topics.acessibilidade;
    if (/vaga|filtro|emprego/.test(text)) return topics.vagas;
    if (/human|pessoa|contato|suporte|atend/.test(text)) return topics.humano;
    return { text: 'Não encontrei uma resposta predefinida para essa pergunta. Escolha um dos assuntos acima ou consulte os canais de contato.', href: 'fale-conosco.html', action: 'Ver canais de contato' };
  }
  if (typeof module === 'object' && module.exports) module.exports = { answerFor: answerFor };
  if (!root.document) return;
  var document = root.document;
  var ownScript = document.currentScript;
  var siteBase = ownScript && ownScript.src ? new URL('../../', ownScript.src) : null;
  var avatarURL = siteBase ? new URL('assets/img/nextgen-assistant.svg', siteBase).href : 'assets/img/nextgen-assistant.svg';
  function init() {
    if (document.getElementById('ng-experience-launchers')) return;
    var defaults = { largerText: false, highContrast: false, reducedMotion: false, underlinedLinks: false };
    var preferences = Object.assign({}, defaults);
    try {
      var saved = JSON.parse(root.localStorage.getItem('ng-experience-preferences') || '{}');
      Object.keys(defaults).forEach(function (key) { preferences[key] = !!(saved && saved[key] === true); });
    } catch (ignore) {}
    var launchers = document.createElement('div');
    launchers.id = 'ng-experience-launchers';
    launchers.className = 'ng-experience-launchers';
    launchers.innerHTML = '<button type="button" class="ng-experience-orb" data-ng-help aria-label="Ajuda NextGen" title="Conversar com o assistente NextGen" aria-haspopup="dialog" aria-controls="ng-experience-help"><img class="ng-chat-orb-avatar" src="' + avatarURL + '" alt="" width="60" height="60"><svg class="ng-chat-orb-badge" viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true"><path d="M6 7h20v14H15l-6 5v-5H6V7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m16 10 1.5 3.5L21 15l-3.5 1.5L16 20l-1.5-3.5L11 15l3.5-1.5L16 10Z" fill="currentColor"/></svg><span class="ng-experience-sr">Ajuda NextGen</span></button><button type="button" class="ng-experience-access-orb" data-ng-accessibility aria-label="Acessibilidade" title="Acessibilidade" aria-haspopup="dialog" aria-controls="ng-experience-accessibility"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M4 8h16M12 8v6m0 0-4 7m4-7 4 7" stroke-linecap="round"/></svg><span class="ng-experience-sr">Acessibilidade</span></button>';
    document.body.appendChild(launchers);
    // Keep help above the existing consent banner, not underneath it.
    var consent = document.querySelector('.cookies');
    if (consent) {
      function avoidConsent() {
        var box = consent.getBoundingClientRect();
        var visible = root.getComputedStyle(consent).display !== 'none' && box.height > 0 && box.top < root.innerHeight && box.bottom > 0;
        launchers.style.bottom = visible ? (root.innerHeight - Math.max(0, box.top) + 16) + 'px' : '';
      }
      avoidConsent();
      root.addEventListener('resize', avoidConsent);
      if (root.ResizeObserver) new root.ResizeObserver(avoidConsent).observe(consent);
      if (root.MutationObserver) new root.MutationObserver(avoidConsent).observe(consent, { attributes: true });
    }
    function makeDialog(id, title, body) {
      var dialog = document.createElement('dialog');
      dialog.id = id;
      dialog.className = 'ng-experience-dialog';
      dialog.setAttribute('aria-labelledby', id + '-title');
      dialog.innerHTML = '<div class="ng-experience-heading"><h2 id="' + id + '-title">' + title + '</h2><button type="button" data-ng-close aria-label="Fechar ' + title + '">Fechar</button></div>' + body;
      document.body.appendChild(dialog);
      dialog.querySelector('[data-ng-close]').addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
      });
      dialog.addEventListener('close', function () {
        if (!document.querySelector('.ng-experience-dialog[open]') && dialog.ngOpener && dialog.ngOpener.isConnected) dialog.ngOpener.focus();
      });
      return dialog;
    }
    var primaryTopics = ['candidato', 'empresa', 'cv', 'cursos'];
    function chipsFor(keys) { return keys.map(function(key){return '<button type="button" data-ng-topic="'+key+'">'+topics[key].label+'</button>';}).join(''); }
    var help = makeDialog('ng-experience-help', 'Ajuda NextGen', '<p class="ng-chat-notice">Conversa automática · nenhuma mensagem é enviada.</p><div class="ng-chat-log" role="log" aria-label="Conversa com a Lia" aria-live="polite" aria-relevant="additions" aria-atomic="false"></div><div class="ng-experience-chips ng-chat-shortcuts" aria-label="Respostas rápidas">'+chipsFor(primaryTopics)+'</div><details class="ng-chat-more"><summary>Outros assuntos</summary><div class="ng-experience-chips">'+chipsFor(Object.keys(topics).filter(function(key){return !primaryTopics.includes(key);}))+'</div></details><form class="ng-experience-form ng-chat-composer"><label class="ng-experience-sr" for="ng-experience-question">Sua mensagem para o assistente</label><input id="ng-experience-question" type="text" maxlength="250" autocomplete="off" placeholder="Escreva sua mensagem…"><button type="submit" aria-label="Enviar mensagem">Enviar <span aria-hidden="true">↑</span></button></form><div class="ng-chat-footer"><p>Respostas predefinidas. Não é IA generativa.</p><button type="button" data-ng-clear-chat>Limpar conversa</button></div>');
    var helpTitle=help.querySelector('.ng-experience-heading h2');
    helpTitle.outerHTML='<div class="ng-chat-agent"><img src="'+avatarURL+'" width="48" height="48" alt="Rosto ilustrado da Lia, assistente virtual"><div><h2 id="ng-experience-help-title">Ajuda NextGen</h2><p>Lia · assistente virtual</p></div></div>';
    var labels = { largerText: 'Texto maior', highContrast: 'Alto contraste', reducedMotion: 'Reduzir movimentos', underlinedLinks: 'Sublinhar links' };
    var controls = Object.keys(labels).map(function (key) { return '<button type="button" data-ng-preference="' + key + '" aria-pressed="false">' + labels[key] + '</button>'; }).join('');
    var accessibility = makeDialog('ng-experience-accessibility', 'Acessibilidade', '<p>Ative ou desative cada opção. As preferências são salvas somente neste navegador, quando permitido.</p><div class="ng-experience-preferences">' + controls + '</div><button type="button" data-ng-reset>Restaurar preferências</button>');
    function apply() {
      Object.keys(preferences).forEach(function (key) {
        document.documentElement.classList.toggle('ng-x-' + key, preferences[key]);
        accessibility.querySelector('[data-ng-preference="' + key + '"]').setAttribute('aria-pressed', String(preferences[key]));
      });
      try { root.localStorage.setItem('ng-experience-preferences', JSON.stringify(preferences)); } catch (ignore) {}
    }
    function open(dialog, opener) {
      if (dialog.open) return;
      [help, accessibility].forEach(function (other) { if (other.open) other.close(); });
      dialog.ngOpener = opener;
      dialog.showModal();
      dialog.querySelector('[data-ng-close]').focus();
    }
    var chatLog=help.querySelector('.ng-chat-log');
    function message(role,text){
      var bubble=document.createElement('div');bubble.className='ng-chat-message ng-chat-message--'+role;
      var who=document.createElement('span');who.className='ng-chat-speaker';who.textContent=role==='user'?'Você':'Lia · resposta automática';
      var paragraph=document.createElement('p');paragraph.textContent=text;bubble.append(who,paragraph);chatLog.append(bubble);
      return bubble;
    }
    function showNextSteps(result){
      var keys=result===topics.candidato?['cv','criar','vagas','cursos']:
        result===topics.empresa||result===topics.anunciar?['anunciar','skills','acessibilidade','candidato']:
        result===topics.cv||result===topics.criar||result===topics.skills?['skills','vagas','cursos','humano']:primaryTopics;
      help.querySelector('.ng-chat-shortcuts').innerHTML=chipsFor(keys);
      help.querySelector('.ng-chat-more .ng-experience-chips').innerHTML=chipsFor(Object.keys(topics).filter(function(key){return !keys.includes(key);}));
      help.querySelector('.ng-chat-more').open=false;
    }
    function startConversation(){
      chatLog.replaceChildren();message('assistant','Oi! Eu sou a Lia, assistente virtual da NextGen. Você está buscando uma oportunidade ou quer contratar? Escolha uma resposta abaixo ou me conte sua dúvida. A conversa fica somente nesta aba.');
      showNextSteps(topics.boasvindas);
    }
    function answer(value,label) {
      var text=String(value||'').trim().slice(0,250);if(!text)return;
      message('user',label||text);
      var result=answerFor(text);
      chatLog.querySelectorAll('[data-ng-answer]').forEach(function(previous){previous.removeAttribute('data-ng-answer');});
      var output=message('assistant',result.text);output.setAttribute('data-ng-answer','');
      if(result.action){
        var action=document.createElement(result.accessibility?'button':'a');action.textContent=result.action;
        if(result.accessibility){action.type='button';action.addEventListener('click',function(){open(accessibility,help.ngOpener);});}
        else action.href=siteBase?new URL(result.href,siteBase).href:result.href;
        output.append(action);
      }
      showNextSteps(result);
      chatLog.scrollTop=chatLog.scrollHeight;
    }
    startConversation();
    help.querySelector('[data-ng-clear-chat]').addEventListener('click',function(){startConversation();help.querySelector('input').value='';help.querySelector('input').focus();});
    help.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-ng-topic]');
      if (chip) {var key=chip.getAttribute('data-ng-topic');answer(key,topics[key].label);}
    });
    help.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();var input=help.querySelector('input');answer(input.value);input.value='';input.focus();
    });
    accessibility.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-ng-preference]');
      if (toggle) {
        var key = toggle.getAttribute('data-ng-preference');
        preferences[key] = !preferences[key]; apply();
      }
      if (event.target.closest('[data-ng-reset]')) { preferences = Object.assign({}, defaults); apply(); }
    });
    document.addEventListener('click', function (event) {
      var helpButton = event.target.closest('[data-ng-help]');
      var accessibilityButton = event.target.closest('[data-ng-accessibility]');
      if (helpButton || accessibilityButton) {
        event.preventDefault(); open(helpButton ? help : accessibility, helpButton || accessibilityButton);
      }
    });
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(typeof window !== 'undefined' ? window : globalThis);
