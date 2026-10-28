/* NextGen — script customizado:
   1) remove o verificação (captcha) do Cloudflare das buscas
   2) login "Continuar com Google" que entra numa conta de teste
   3) modais legados com teclado; acessibilidade em nextgen-experience.js
*/
(function () {
  "use strict";

  /* ---------- 1) captcha/verify do Cloudflare fora ---------- */
  try {
    document.cookie = "captcha_verified=1; path=/; max-age=1800";
  } catch (e) {}
  var limpezaRodando = setInterval(function () {
    var w = document.querySelectorAll("#turnstile-widget, [id^='turnstile']");
    for (var i = 0; i < w.length; i++) w[i].remove();
  }, 700);
  setTimeout(function () { clearInterval(limpezaRodando); }, 20000);

  /* expõe um stub de turnstile por segurança (caso algum script peça) */
  try {
    window.turnstile = window.turnstile || {
      render: function () { return "ng-stub"; },
      getResponse: function () { return "ng-verificado"; },
      reset: function () {}, remove: function () {}
    };
  } catch (e) {}

  /* ---------- 2) login com a conta de teste via Google ---------- */
  function entrarContaTeste() {
    try {
      localStorage.setItem("logged", "true");
      localStorage.setItem("idUser", "700001");
      localStorage.setItem("IdTipoPerfil", "Candidato");
      localStorage.setItem("ng_conta_teste", "Candidato Teste");
      document.cookie = "logged=1; path=/; max-age=86400";
      document.cookie = "captcha_verified=1; path=/; max-age=1800";
    } catch (e) {}
    window.location.href = "index.html?entrar=test";
  }
  var googleBtn = document.getElementById("btnGoogleNextgen");
  if (googleBtn) googleBtn.addEventListener("click", function (ev) {
    ev.preventDefault();
    entrarContaTeste();
  });

  /* abre no painel do login automaticamente quando vem do drawer "entrar como candidato" */
  document.addEventListener("DOMContentLoaded", function () {
    /* header mostra a conta de teste quando o login foi efetivo */
    var contaAtiva = false;
    try { contaAtiva = localStorage.getItem("logged") === "true"; } catch (ex) {}
    if (contaAtiva) {
      var toggle = document.querySelector(".header__dropdown-toggle--entrar");
      if (toggle) {
        toggle.classList.add("ng-logged");
        toggle.textContent = "Ol\u00e1, Candidato Teste";
      }
      var mobiles = document.querySelectorAll(".header__mobile-btn");
      for (var j = 0; j < mobiles.length; j++) {
        if (/Entrar/.test(mobiles[j].textContent)) {
          mobiles[j].textContent = "Conta de teste ativa \u2014 Candidato";
          mobiles[j].href = "index.html";
        }
      }
    }

    /* Acessibilidade: painel compartilhado em nextgen-experience.js. */
  });

  /* ---------- stub reCaptcha (scripts internos podem pedir) ---------- */
  try {
    window.grecaptcha = window.grecaptcha || {
      ready: function (cb) { if (cb) cb(); },
      render: function () { return 1; },
      reset: function () {},
      execute: function () { return Promise.resolve("ng-verificado"); },
      getResponse: function () { return "ng-verificado"; }
    };
  } catch (e0) {}

  /* ---------- 4) popups interativos (mesmo estilo dos modais do site) ---------- */
  function ngPopAbrir(interno) {
    var anterior = document.activeElement;
    var overflow = document.body.style.getPropertyValue('overflow');
    var prioridade = document.body.style.getPropertyPriority('overflow');
    var fundo = document.createElement('div');
    fundo.className = 'ng-popup-backdrop';
    fundo.innerHTML = '<div class="ng-popup" role="dialog" aria-modal="true" aria-label="Detalhes NextGen" tabindex="-1">' +
      '<button type="button" class="ng-popup__close" aria-label="Fechar">&#10005;</button>' + interno + '</div>';
    document.body.appendChild(fundo);
    var modal = fundo.querySelector('.ng-popup');
    var titulo = modal.querySelector('h2');
    if (titulo) {
      titulo.id = 'ng-popup-title-' + (++ngPopAbrir.sequencia);
      modal.setAttribute('aria-labelledby', titulo.id);
    }
    document.body.style.setProperty('overflow', 'hidden', 'important');
    var isolados = [];
    Array.prototype.forEach.call(document.body.children, function (elemento) {
      if (elemento !== fundo && !elemento.inert) { elemento.inert = true; isolados.push(elemento); }
    });
    function fechar() {
      if (!fundo.parentNode) return;
      fundo.remove();
      isolados.forEach(function (elemento) { elemento.inert = false; });
      if (overflow) document.body.style.setProperty('overflow', overflow, prioridade);
      else document.body.style.removeProperty('overflow');
      document.removeEventListener('keydown', teclado);
      document.removeEventListener('focusin', guardarFoco);
      if (anterior && anterior.isConnected) anterior.focus();
    }
    function guardarFoco(ev) { if (!modal.contains(ev.target)) modal.querySelector('.ng-popup__close').focus(); }
    function teclado(ev) {
      if (document.querySelector('.ng-popup-backdrop:last-of-type') !== fundo) return;
      if (ev.key === 'Escape') { ev.preventDefault(); fechar(); return; }
      if (ev.key !== 'Tab') return;
      var alvos = Array.prototype.filter.call(modal.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'), function (el) {
        return !el.disabled && el.tabIndex >= 0 && !el.hidden && !el.closest('[hidden]');
      });
      var primeiro = alvos[0], ultimo = alvos[alvos.length - 1];
      if (!primeiro) { ev.preventDefault(); modal.focus(); }
      else if (ev.shiftKey && (document.activeElement === primeiro || !modal.contains(document.activeElement))) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && (document.activeElement === ultimo || !modal.contains(document.activeElement))) { ev.preventDefault(); primeiro.focus(); }
    }
    fundo.addEventListener('click', function (ev) { if (ev.target === fundo) fechar(); });
    modal.querySelector('.ng-popup__close').addEventListener('click', fechar);
    document.addEventListener('keydown', teclado);
    document.addEventListener('focusin', guardarFoco);
    modal.querySelector('.ng-popup__close').focus();
    return { no: fundo, fechar: fechar };
  }
  ngPopAbrir.sequencia = 0;

  /* popup A: detalhe da vaga (abre ao clicar no card; captura antes dos handlers do site) */
  document.addEventListener("click", function (ev) {
    if (ev.target && ev.target.closest && ev.target.closest(".ng-popup-backdrop")) return;
    var link = ev.target && ev.target.closest ? ev.target.closest("a.job-link") : null;
    if (!link) return;
    var artigo = link.closest("article.job-card");
    if (!artigo) return;
    ev.preventDefault();
    ev.stopPropagation();
    var pega = function (sel) { var el = artigo.querySelector(sel); return el ? el.textContent.trim() : ""; };
    var tit = pega(".job-title"), emp = pega(".job-company") || "Empresa parceira",
        loc = pega(".job-location") || "Rio de Janeiro", sal = pega(".salary"),
        wp = pega(".workplace"), et = pega(".employment-type"), pub = pega(".posted");
    var idv = artigo.getAttribute("data-job-id") || tit;
    var chave = "ng_fav_" + idv;
    var fav = false;
    try { fav = localStorage.getItem(chave) === "1"; } catch (ex) {}
    var desc =
      "A " + emp + " é empresa parceira da rede NextGen em " + loc + ". Não é exigida experiência prévia: " +
      "quem faz nossa capacitação gratuita entra na fila de encaminhamento preferencial para as vagas parceiras. " +
      "O tipo dessa vaga conversa com nossos cursos de Administra\u00e7\u00e3o, Varejo e Log\u00edstica \u2014 voc\u00ea pode come\u00e7ar o curso depois de se candidatar.";
    var pop = ngPopAbrir(
      '<p class="ng-popup__kicker">Vaga parceira NextGen</p>' +
      '<h2 class="ng-popup__title"></h2>' +
      '<div class="ng-popup__meta">' +
        '<span><strong>Empresa:</strong> ' + emp + '</span>' +
        '<span><strong>Onde:</strong> ' + loc + '</span>' +
        '<span><strong>Salário:</strong> ' + sal + '</span>' +
        '<span><strong>Ritmo:</strong> ' + wp + ' · ' + et + '</span>' +
        '<span><strong>Publicação:</strong> ' + pub + '</span>' +
      '</div>' +
      '<p class="ng-popup__text">' + desc + '</p>' +
      '<div class="ng-popup__actions">' +
        '<a class="ng-popup__btn ng-popup__btn--prim" href="cadastro-inicial.html">Candidatar-se</a>' +
        '<a class="ng-popup__btn ng-popup__btn--ghost" href="cursos.html">Ver cursos gratuitos</a>' +
        '<button type="button" class="ng-popup__btn ng-popup__btn--ghost ng-popup__fav" data-chave="' + chave + '">Favoritar</button>' +
      '</div>'
    );
    pop.no.querySelector(".ng-popup__title").textContent = tit;
    var favB = pop.no.querySelector(".ng-popup__fav");
    function pintaFav() {
      favB.textContent = fav ? "Favoritada" : "Favoritar";
      favB.classList.toggle("on", fav);
    }
    pintaFav();
    favB.addEventListener("click", function () {
      fav = !fav;
      try {
        if (fav) localStorage.setItem(chave, "1"); else localStorage.removeItem(chave);
      } catch (ex) {}
      pintaFav();
    });
  }, true);

  /* popup B: quiz interativo de capacitação (2 passos + resultado) */
  function ngPopQuiz() {
    var escolhaPerfil = null, escolhaArea = null;
    var pop = ngPopAbrir('<div class="ng-quiz"></div>');
    var caixa = pop.no.querySelector(".ng-quiz");
    function focarPasso() {
      var titulo = caixa.querySelector('h2');
      titulo.id = 'ng-quiz-title';
      titulo.tabIndex = -1;
      pop.no.querySelector('.ng-popup').setAttribute('aria-labelledby', titulo.id);
      titulo.focus();
    }
    function passo(passoNum, pergunta, opcoes, aoEscolher) {
      caixa.innerHTML =
        '<p class="ng-popup__kicker">Capacitação gratuita</p>' +
        '<p class="ng-popup__steps">Passo ' + passoNum + ' de 2</p>' +
        '<h2 class="ng-popup__title"></h2>' +
        '<div class="ng-popup__chips"></div>' +
        '<div class="ng-popup__actions"><button type="button" class="ng-popup__btn ng-popup__btn--ghost" data-sair>Fechar</button></div>';
      caixa.querySelector(".ng-popup__title").textContent = pergunta;
      var onde = caixa.querySelector(".ng-popup__chips");
      for (var i = 0; i < opcoes.length; i++) (function (op) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "ng-popup__chip";
        chip.textContent = op;
        chip.addEventListener("click", function () { aoEscolher(op); });
        onde.appendChild(chip);
      })(opcoes[i]);
      var sair = caixa.querySelector("[data-sair]");
      if (sair) sair.addEventListener("click", pop.fechar);
      focarPasso();
    }
    function resultado() {
      var composicao =
        "Você pode explorar o curso de " + escolhaArea + " se quiser se desenvolver nessa área. " +
        "Se já tem currículo, pode pular os cursos e fazer o teste de competências na Jornada NextGen. " +
        "Cursos são opcionais e não garantem contratação ou prioridade em vagas.";
      caixa.innerHTML =
        '<p class="ng-popup__kicker">Capacitação gratuita</p>' +
        '<h2 class="ng-popup__title">Curso recomendado pra você</h2>' +
        '<p class="ng-popup__text">' + composicao + '</p>' +
        '<div class="ng-popup__actions">' +
          '<a class="ng-popup__btn ng-popup__btn--prim" href="jornada.html">Testar minhas competências</a>' +
          '<a class="ng-popup__btn ng-popup__btn--ghost" href="cursos.html">Explorar cursos opcionais</a>' +
          '<a class="ng-popup__btn ng-popup__btn--ghost" href="vagas-de-emprego.html">Ver vagas de Niterói e RJ</a>' +
        '</div>';
      focarPasso();
    }
    passo(1, "Como você se qualifica?",
      ["Jovem no começo de carreira", "Candidato PCD", "Em recolocação"],
      function (v) { escolhaPerfil = v;
        passo(2, "Qual área te chama mais?",
          ["Administração", "Varejo e Atendimento", "Logística", "Tecnologia"],
          function (a) { escolhaArea = a; resultado(); });
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* botão "Ver como funciona": agora é estático (sem injeção tardia),
       o JS só liga o comportamento do quiz — zero chacoalho de layout */
    var quizBtn = document.getElementById("ngQuizBtn");
    if (quizBtn && !quizBtn.getAttribute("data-ng-quiz-bound")) {
      quizBtn.setAttribute("data-ng-quiz-bound", "1");
      quizBtn.addEventListener("click", ngPopQuiz);
    }

    /* Quiz apenas por solicitação: nunca interrompe a navegação automaticamente. */
  });

  /* popup vagas PCD */
  (function () {
    var btn = document.getElementById("btn-pcd");
    var fundo = document.getElementById("popup-pcd");
    var fechar = fundo && fundo.querySelector(".ng-popup__close");
    if (!btn || !fundo) return;
    btn.addEventListener("click", function () { fundo.style.display = "flex"; });
    if (fechar) fechar.addEventListener("click", function () { fundo.style.display = "none"; });
    fundo.addEventListener("click", function (ev) { if (ev.target === fundo) fundo.style.display = "none"; });
  })();

  /* ---------- link de acessibilidade: pular para o conteúdo ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".ng-skip")) return;
    var areaP = document.querySelector("main, [role='main'], #conteudo") || document.querySelector("div.container-lg") || document.querySelector("section");
    if (!areaP) return;
    if (!areaP.id) areaP.id = "ng-area-principal";
    var skip = document.createElement("a");
    skip.className = "ng-skip";
    skip.href = "#" + areaP.id;
    skip.textContent = "Pular para o conte\u00fado";
    document.body.insertBefore(skip, document.body.firstChild);
  });
})();

/* tooltip leve do "Gratuito" (cursos): classe por evento, funciona com toque/teclado */
(function () {
  if (window.__ngGratTip) return;
  window.__ngGratTip = true;
  function ache(e) {
    var alvo = e.target;
    while (alvo && alvo !== document) {
      if (alvo.classList && alvo.classList.contains("ng-grat-w")) return alvo;
      alvo = alvo.parentNode;
    }
    return null;
  }
  function liga(e) { var el = ache(e); if (el) el.classList.add("ng-grat-aberto"); }
  function desliga(e) {
    if (ache(e)) { ache(e).classList.remove("ng-grat-aberto"); return; }
    if (e.type === "focusout") {
      var w = document.querySelector(".ng-grat-aberto");
      if (w) w.classList.remove("ng-grat-aberto");
    }
  }
  document.addEventListener("mouseover", liga);
  document.addEventListener("mouseout", desliga);
  document.addEventListener("focusin", liga);
  document.addEventListener("focusout", desliga);
})();


/* Filtro de região nas listagens de vagas (cidades próximas).
   Os chips ng-regiao-chips apontavam todos para a mesma URL (link morto).
   Agora clicar filtra os cards por localização, atualiza o título e o chip ativo.
   Só roda em páginas que tenham .ng-regiao-chips. Idempotente. */
(function () {
  if (window.__ngRegiao) return;
  window.__ngRegiao = true;

  var chips = document.querySelectorAll('.ng-regiao-chips a.ng-chip');
  if (!chips.length) return;

  var secao = document.querySelector('.ng-regiao');
  var h2 = secao ? secao.querySelector('h2') : null;
  var lista = document.querySelector('.jobs-list');
  var cards = lista ? Array.prototype.filter.call(lista.children, function (el) {
    return el.classList && el.classList.contains('job-card');
  }) : [];

  function cidadeDoChip(el) {
    var txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return txt.replace(/\s*— você está aqui\s*$/i, '');
  }

  function mostrar(cidade) {
    chips.forEach(function (c) { c.classList.remove('ng-chip--voce'); });
    Array.prototype.forEach.call(chips, function (c) {
      if (cidadeDoChip(c) === cidade) c.classList.add('ng-chip--voce');
    });
    if (h2) h2.textContent = 'Vagas na região — você está em ' + cidade + '/RJ';

    var vazio = document.querySelector('.ng-regiao-vazio');
    var cont = 0;
    cards.forEach(function (card) {
      var loc = card.querySelector('.job-location span');
      var locTxt = loc ? (loc.textContent || '').trim() : '';
      var ok = (cidade === 'Niterói') || locTxt.indexOf(cidade) !== -1;
      if (ok) {
        card.style.display = '';
        cont++;
      } else {
        card.style.display = 'none';
      }
    });

    if (cont === 0) {
      if (!vazio) {
        vazio = document.createElement('p');
        vazio.className = 'ng-regiao-vazio';
        vazio.style.textAlign = 'center';
        vazio.style.color = '#667085';
        vazio.style.margin = '24px 0';
        lista.appendChild(vazio);
      }
      vazio.textContent = 'Nenhuma vaga encontrada para ' + cidade + ' no momento.';
    } else if (vazio) {
      vazio.remove();
    }
  }

  Array.prototype.forEach.call(chips, function (c) {
    c.addEventListener('click', function (e) {
      e.preventDefault();
      mostrar(cidadeDoChip(c));
    });
  });

  // estado inicial: filtra pela cidade da URL (?cidade=X) ou mostra todas (Niterói)
  var params = new URLSearchParams(location.search);
  var cidadeInicial = params.get("cidade");
  var valida = Array.prototype.some.call(chips, function (c) {
    return cidadeDoChip(c) === cidadeInicial;
  });
  mostrar(valida && cidadeInicial ? cidadeInicial : "Niterói");
})();

/* guarda: nunca deixa o body travado sem popup aberto */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (!document.querySelector(".ng-popup-backdrop")) {
      try { document.body.style.removeProperty("overflow"); } catch (ex) {}
    }
  }, 300);
});
