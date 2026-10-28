/* Original listing data transcribed from the supplied static page. Not active ads.
   Areas are navigation categories assigned from titles, not employer requirements.
   PCD means only that the supplied listing included a PCD indication; no physical,
   communication or recruitment accommodation was described in that source. */
(function (root) {
  'use strict';
  const records = [
    ['10119109','Jovem Aprendiz — Administração','Padaria e Confeitaria Litoral','R$ 1.212,00 por mês','Niterói','RJ',true,'Administração','Presencial','Aprendiz'],
    ['10129790','Auxiliar Administrativo','Clínica Vida Plena','R$ 1.950,00 por mês','Niterói','RJ',true,'Administração','Híbrido','Efetivo/CLT'],
    ['10150998','Atendente Comercial','Mercado Central de Niterói','R$ 1.800,00 por mês','Niterói','RJ',true,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['13720264','Assistente de Vendas','Ótica Visão Clara','R$ 2.100,00 por mês','Rio de Janeiro','RJ',false,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['4313516','Recepcionista','Colégio Horizontes','R$ 2.020,00 por mês','Rio de Janeiro','RJ',true,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['13720262','Operador de Caixa','Supermercado Atlântico','R$ 1.745,00 por mês','Rio de Janeiro','RJ',false,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['13720255','Motorista de Entrega — vaga PCD','Vivaz Distribuição','R$ 2.300,00 por mês','Rio de Janeiro','RJ',true,'Logística','Presencial','Efetivo/CLT'],
    ['13719513','Monitor de Capacitação de Jovens','Instituto Caminho Certo','R$ 1.620,00 por mês','Niterói','RJ',false,'Educação','Presencial','Estágio'],
    ['13720204','Estágio em TI — Suporte','Tecnova Sistemas','R$ 1.500,00 por mês','Rio de Janeiro','RJ',true,'Tecnologia','Híbrido','Estágio'],
    ['13720169','Auxiliar de Logística','Distribuidora Ilha Verde','R$ 1.980,00 por mês','São Gonçalo','RJ',false,'Logística','Presencial','Efetivo/CLT'],
    ['13720159','Jovem Aprendiz — Varejo','Shopping Litoral Plaza','R$ 1.260,00 por mês','Niterói','RJ',true,'Atendimento e vendas','Presencial','Aprendiz'],
    ['13720157','Auxiliar de Loja','Loja Maré Azul','R$ 1.750,00 por mês','Rio de Janeiro','RJ',false,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['13720154','Auxiliar Administrativo — Turno Tarde','Estacionamento Portão 10','R$ 1.850,00 por mês','Niterói','RJ',true,'Administração','Presencial','Efetivo/CLT'],
    ['13720153','Assistente de Exposição','Casa & Cia Móveis','R$ 1.700,00 por mês','Rio de Janeiro','RJ',false,'Atendimento e vendas','Presencial','Efetivo/CLT'],
    ['13720173','Jovem Aprendiz — Atendimento','Café Panorama','R$ 1.230,00 por mês','Niterói','RJ',true,'Atendimento e vendas','Presencial','Aprendiz']
  ];
  const jobs = records.map(([id,title,company,salary,city,state,pcd,area,workplace,employment]) => ({id,title,company,salary,city,state,pcd,area,workplace,employment,accessibility:'Acessibilidade não informada'}));
  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  }
  function filterJobs(list, filters = {}) {
    const q = normalize(filters.q);
    const city = normalize(filters.cidade || filters.city);
    const state = normalize(filters.estado || filters.state);
    const area = normalize(filters.area);
    return list.filter(job =>
      (!q || q.split(/\s+/).every(word => normalize(job.title + ' ' + job.company + ' ' + job.employment).includes(word))) &&
      (!city || normalize(job.city).includes(city)) &&
      (!state || normalize(job.state) === state || (state === 'rio de janeiro' && job.state === 'RJ')) &&
      (!area || normalize(job.area).includes(area)) &&
      (!filters.pcd || job.pcd) &&
      (!filters.accessible || job.accessibilityConfirmed === true) &&
      (!filters.savedOnly || (Array.isArray(filters.saved) && filters.saved.includes(job.id)))
    );
  }
  const api = { jobs, filterJobs };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root.document) return;
  const document = root.document;
  const scriptURL = document.currentScript && document.currentScript.src;
  const siteBase = scriptURL ? new URL('../../', scriptURL) : null;
  function init() {
    const form = document.getElementById('job-filters');
    if (!form) return;
    const list = document.getElementById('job-list');
    const savedFilter = document.getElementById('saved-filter');
    const storageKey = 'ng-saved-jobs';
    let saved = [];
    let savedOnly = false;
    let storageAvailable = true;
    try {
      const stored = JSON.parse(root.localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(stored)) saved = [...new Set(stored.filter(id => typeof id === 'string' && jobs.some(job => job.id === id)))];
    } catch (ignore) { storageAvailable = false; }
    function toggleSaved(job) {
      const removing = saved.includes(job.id);
      saved = removing ? saved.filter(id => id !== job.id) : [...saved, job.id];
      try { root.localStorage.setItem(storageKey, JSON.stringify(saved)); storageAvailable = true; }
      catch (ignore) { storageAvailable = false; }
      render();
      const nextFocus = list.querySelector('[data-job-card="' + job.id + '"] .jobs-card-save') || savedFilter;
      nextFocus.focus();
      document.getElementById('jobs-status').textContent = (removing ? 'Exemplo removido das salvas. ' : 'Exemplo salvo. ') + (storageAvailable ? 'Salvo somente neste navegador; nenhuma candidatura foi enviada.' : 'Armazenamento indisponível: suas alterações ficam somente nesta aba. Nenhuma candidatura foi enviada.');
    }
    savedFilter.addEventListener('click', () => { savedOnly = !savedOnly; render(); });
    const fields = { q: form.elements.q, cidade: form.elements.cidade, estado: form.elements.estado, area: form.elements.area, pcd: form.elements.pcd };
    function selectValue(field, value) {
      if (value && !Array.from(field.options).some(option => option.value === value)) {
        field.add(new Option(value, value));
      }
      field.value = value || '';
    }
    function readQuery() {
      const params = new URLSearchParams(root.location.search);
      fields.q.value = params.get('q') || '';
      let city = params.get('cidade') ?? params.get('city') ?? params.get('local') ?? form.dataset.defaultCity ?? '';
      let state = params.get('estado') ?? params.get('state') ?? form.dataset.defaultState ?? '';
      const combined = city.match(/^(.+?)\s*[,\/-]\s*([a-z]{2})\s*$/i);
      if (combined) { city = combined[1].trim(); state = state || combined[2].toUpperCase(); }
      else if (/^[a-z]{2}$/i.test(city)) { state = state || city.toUpperCase(); city = ''; }
      fields.cidade.value = city;
      selectValue(fields.estado, state);
      selectValue(fields.area, params.get('area') || '');
      fields.pcd.checked = ['1', 'true'].includes(params.get('pcd'));
    }
    function filters() {
      return { q:fields.q.value, cidade:fields.cidade.value, estado:fields.estado.value, area:fields.area.value, pcd:fields.pcd.checked };
    }
    function updateQuery() {
      const params = new URLSearchParams();
      Object.entries(filters()).forEach(([key,value]) => { if (value) params.set(key, value === true ? '1' : value); });
      try { root.history.replaceState(null, '', root.location.pathname + (params.size ? '?' + params : '') + root.location.hash); } catch (ignore) {}
    }
    function el(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    const dialog = document.getElementById('job-details');
    let dialogOpener;
    document.getElementById('job-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (dialogOpener && dialogOpener.isConnected) dialogOpener.focus(); });
    function openDetails(job, opener) {
      dialogOpener = opener;
      document.getElementById('job-dialog-title').textContent = job.title;
      document.getElementById('job-dialog-company').textContent = job.company;
      const facts = document.getElementById('job-dialog-facts');
      facts.replaceChildren();
      [['Local', job.city + '/' + job.state],['Remuneração no original',job.salary],['Formato',job.workplace],['Vínculo',job.employment],['Área organizada pelo protótipo',job.area]].forEach(([label,value]) => {
        const group = el('div'); group.append(el('dt','',label),el('dd','',value)); facts.append(group);
      });
      document.getElementById('job-dialog-pcd').textContent = job.pcd ? 'O anúncio original contém indicação PCD. Essa indicação não confirma adaptações nem compatibilidade individual.' : 'O anúncio original não informa indicação PCD. Isso não permite concluir se a vaga aceita ou não pessoas com deficiência.';
      const query = new URLSearchParams({ vaga:job.id, cargo:job.title, area:job.area, origem:'vagas' });
      document.getElementById('job-dialog-prepare').href = (siteBase ? new URL('jornada.html', siteBase).href : 'jornada.html') + '?' + query;
      dialog.showModal();
      document.getElementById('job-dialog-close').focus();
    }
    function card(job) {
      const article = el('article','jobs-card');
      article.dataset.jobCard = job.id;
      const top = el('div','jobs-card-top');
      const heading = el('div');
      heading.append(el('p','jobs-card-category',job.employment + ' · ' + job.area), el('h3','',job.title), el('p','jobs-card-company',job.company));
      const save = el('button','jobs-card-save');
      save.type = 'button';
      const isSaved = saved.includes(job.id);
      save.setAttribute('aria-pressed', String(isSaved));
      save.setAttribute('aria-label', isSaved ? 'Remover ' + job.title + ' das salvas' : 'Salvar ' + job.title);
      save.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
      save.addEventListener('click', () => toggleSaved(job));
      top.append(heading, save);
      const facts = el('p','jobs-card-facts');
      [job.city + '/' + job.state, job.workplace].forEach(text => facts.append(el('span','',text)));
      const bottom = el('div','jobs-card-bottom');
      bottom.append(el('p','jobs-salary',job.salary));
      const detail = el('button','jobs-card-detail','Ver detalhes');
      detail.type = 'button';
      detail.append(el('span','','↗'));
      detail.lastChild.setAttribute('aria-hidden','true');
      detail.addEventListener('click', () => openDetails(job, detail));
      bottom.append(detail);
      const accessibility = el('p','jobs-accessibility');
      if (job.pcd) accessibility.append(el('span','jobs-pcd','Indicação PCD no original'));
      accessibility.append(el('span','',job.accessibility));
      article.append(top, facts, bottom, accessibility);
      return article;
    }
    function render() {
      const matches = filterJobs(jobs, { ...filters(), savedOnly, saved });
      savedFilter.setAttribute('aria-pressed',String(savedOnly));
      document.getElementById('saved-count').textContent = saved.length;
      list.replaceChildren(...matches.map(card));
      document.getElementById('results-count').textContent = matches.length + (matches.length === 1 ? ' exemplo encontrado' : ' exemplos encontrados');
      document.getElementById('jobs-empty').hidden = matches.length !== 0;
    }
    form.addEventListener('submit', event => { event.preventDefault(); updateQuery(); render(); });
    form.addEventListener('change', () => { updateQuery(); render(); });
    document.getElementById('clear-filters').addEventListener('click', () => { form.reset(); savedOnly = false; updateQuery(); render(); });
    root.addEventListener('popstate', () => { readQuery(); render(); });
    readQuery(); render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(typeof window !== 'undefined' ? window : globalThis);
