(() => {
  'use strict';
  const imageRoot = 'assets/img/pages/home/';
  const courses = [
    {id:'aprendiz', title:'Primeiros passos no trabalho', area:'Carreira', image:'primeiro-emprego.jpg', alt:'Jovem sorrindo diante de um notebook em uma mesa de trabalho.', summary:'Organize sua rotina e prepare uma apresentação para o primeiro emprego.', topics:['Apresentação profissional','Organização da rotina','Como pedir orientação']},
    {id:'informatica', title:'Informática essencial', area:'Tecnologia', image:'dicas-melhorar-curriculo-e-se-destacar.jpg', alt:'Mulher usando um notebook em uma mesa com uma xícara.', summary:'Arquivos, internet e e-mail: uma base para usar o computador com autonomia.', topics:['Pastas e nomes de arquivos','E-mail profissional','Cuidados com links e anexos']},
    {id:'excel', title:'Excel para o trabalho', area:'Tecnologia', image:'cartao-empresas.jpg', alt:'Duas pessoas analisando documentos sobre uma mesa de escritório.', summary:'Transforme registros do dia a dia em uma planilha simples e organizada.', topics:['Linhas, colunas e células','Soma de valores','Conferência de registros']},
    {id:'atendimento', title:'Atendimento e varejo', area:'Atendimento', image:'estrategias-para-conseguir-vaga.jpg', alt:'Pessoas conversando em grupo, com uma mulher sorrindo em primeiro plano.', summary:'Escute uma necessidade, confirme o pedido e proponha o próximo passo.', topics:['Escuta e confirmação','Comunicação clara','Encaminhamento de solicitações']},
    {id:'logistica', title:'Logística e estoque', area:'Logística', image:'como-montar-plano-de-carreira.jpg', alt:'Profissional com uma prancheta diante de prateleiras de produtos.', summary:'Pratique a conferência e o registro de entrada e saída de produtos.', topics:['Recebimento e conferência','Endereçamento de produtos','Registro de movimentações']},
    {id:'acessibilidade', title:'Trabalho e acessibilidade', area:'Carreira', image:'cartao-vagas.jpg', alt:'Três profissionais conversando em um escritório com mesas compartilhadas.', summary:'Reconheça barreiras na comunicação e combine formas de colaborar.', topics:['Barreiras na comunicação','Preferências de apoio','Documentos mais acessíveis']},
    {id:'suporte', title:'Suporte de TI básico', area:'Tecnologia', image:'cartao-candidatos.jpg', alt:'Mulher sentada à mesa em um escritório com plantas ao fundo.', summary:'Descreva um problema técnico e teste soluções simples com segurança.', topics:['Descrição do problema','Testes iniciais','Registro e encaminhamento']},
    {id:'caixa', title:'Operador de caixa: introdução', area:'Atendimento', image:'como-montar-plano-de-carreira.jpg', alt:'Profissional segurando uma prancheta em um ambiente com produtos nas prateleiras.', summary:'Confira um pedido e pratique uma rotina básica de fechamento.', topics:['Conferência de itens','Registro de pagamento','Fechamento e divergências']},
    {id:'comunicacao', title:'Comunicação no trabalho', area:'Carreira', image:'inteligencia-emocional.jpg', alt:'Mulher apresentando uma ideia a colegas em uma reunião de trabalho.', summary:'Escreva mensagens objetivas e compartilhe informações úteis com a equipe.', topics:['Contexto e objetivo','Pedidos claros','Confirmação de entendimento']}
  ];
  // Each lesson is an original short reading and practice exercise, not a full course.
  const lessons = {
    aprendiz: {title:'Uma apresentação com contexto', text:'Uma apresentação profissional curta explica quem você é, o que já praticou e o que gostaria de aprender. Não é necessário inventar experiência: atividades escolares, projetos e trabalhos voluntários também podem mostrar organização e colaboração.', steps:['Diga seu nome e o tipo de oportunidade que procura.','Escolha uma atividade real e conte qual foi sua participação.','Conecte esse aprendizado à rotina da área.'], example:'“Busco minha primeira oportunidade em atendimento. Em um projeto da escola, organizei os pedidos de materiais da equipe. Quero desenvolver minha comunicação com clientes.”', question:'O que torna uma apresentação mais útil?', options:['Inventar uma experiência para impressionar.','Contar uma atividade real e explicar o que aprendeu.','Listar qualidades sem nenhum exemplo.'], correct:1, explanation:'Um exemplo real mostra o que você fez e permite conversar sobre o aprendizado, sem prometer uma experiência que você não tem.'},
    informatica: {title:'Arquivos que você encontra depois', text:'Uma pasta reúne arquivos relacionados. Um nome descritivo ajuda a reconhecer o conteúdo sem abrir cada documento. A extensão, como .pdf ou .docx, indica o formato; trocar apenas a extensão não converte o arquivo.', steps:['Crie uma pasta com um assunto claro, como Currículos.','Nomeie cada versão pelo conteúdo e pela área.','Confira destinatário e anexo antes de enviar por e-mail.'], example:'Currículos / Ana_Silva_Atendimento.pdf é mais fácil de identificar do que novo_final_2.pdf. Para gerar um PDF, use a opção de exportar ou salvar como PDF do editor.', question:'Como organizar um currículo para encontrá-lo depois?', options:['Salvar com nome descritivo em uma pasta de currículos.','Trocar .docx por .pdf no nome para converter.','Usar o mesmo nome para qualquer documento.'], correct:0, explanation:'Pasta e nome descritivos ajudam na busca. A conversão de formato deve ser feita no editor, não renomeando a extensão.'},
    excel: {title:'Some valores com uma fórmula', text:'Uma planilha organiza dados em linhas e colunas. A célula B2 fica na coluna B, linha 2. Uma fórmula começa com o sinal de igual. Um intervalo reúne células: B2:B4 inclui B2, B3 e B4.', steps:['Registre um valor numérico em cada célula de B2 até B4.','Em B5, digite =SOMA(B2:B4) para calcular o total.','Confira o intervalo e os valores antes de usar o resultado.'], example:'Se B2 contém 10, B3 contém 15 e B4 contém 5, =SOMA(B2:B4) retorna 30. Se o Excel estiver em inglês, a função equivalente é SUM. A soma não substitui a conferência dos dados.', question:'Qual ação calcula o total dos três valores?', options:['Usar apenas o valor de B2.','Somar o intervalo B2:B4.','Somar somente B2 e B4.'], correct:1, explanation:'O intervalo B2:B4 inclui as três células, inclusive B3. Somar só as extremidades deixa um valor de fora.'},
    atendimento: {title:'Escutar antes de responder', text:'Um atendimento começa por entender a necessidade. Faça uma pergunta por vez, escute sem interromper e confirme o que entendeu. Se a solução depende de outra equipe, explique o encaminhamento sem prometer um prazo que você não conhece.', steps:['Pergunte qual é a necessidade da pessoa.','Resuma o pedido e confirme os detalhes.','Explique o próximo passo e o canal de acompanhamento.'], example:'“Você recebeu um item diferente do pedido, certo? Vou conferir o número do pedido e verificar com a equipe responsável quais são as opções.”', question:'Você ainda não sabe o prazo de solução. O que dizer?', options:['Prometer resolver em cinco minutos.','Encerrar sem explicar o que será feito.','Explicar que vai verificar o prazo com a equipe.'], correct:2, explanation:'Um próximo passo verdadeiro é mais útil do que uma promessa sem confirmação.'},
    logistica: {title:'Conferir antes de registrar', text:'No recebimento de produtos, o registro deve refletir o que foi conferido. Compare identificação e quantidade com o documento de referência. Separe divergências para seguir o procedimento da empresa, em vez de alterar números para fazer o saldo coincidir.', steps:['Identifique o produto pelo código e pela descrição.','Conte as unidades e confira a condição da embalagem.','Registre a quantidade conferida e comunique divergências.'], example:'O documento informa 12 unidades, mas chegaram 10. Registre a ocorrência e encaminhe a divergência ao responsável; não marque 12 unidades como recebidas sem conferência.', question:'Chegaram 10 unidades, mas o documento indica 12. Qual é o próximo passo?', options:['Registrar a divergência e informar o responsável.','Registrar 12 para coincidir com o documento.','Ignorar a diferença.'], correct:0, explanation:'O estoque precisa de um registro confiável. A divergência deve ser tratada pelo procedimento da empresa.'},
    acessibilidade: {title:'Comunicação que inclui', text:'Uma barreira pode estar na forma como uma informação é apresentada. Uma imagem sem descrição, por exemplo, pode excluir quem usa leitor de tela. Pergunte diretamente à pessoa qual formato ou apoio funciona para ela, sem presumir necessidades pela deficiência.', steps:['Compartilhe a informação importante também em texto.','Use títulos claros e descreva imagens relevantes.','Pergunte sobre preferências de comunicação e combine o apoio.'], example:'Em vez de enviar só a foto de uma escala, envie também os dias e horários em texto. A descrição deve transmitir a informação da escala, não apenas dizer “foto de tabela”.', question:'Como compartilhar uma escala que veio como imagem?', options:['Enviar somente a imagem.','Incluir os dias e horários em texto acessível.','Decidir que outra pessoa deve ler por quem precisa.'], correct:1, explanation:'O conteúdo em texto permite consultar a escala de forma mais autônoma. Preferências devem ser combinadas com a própria pessoa.'},
    suporte: {title:'Relatar um problema técnico', text:'Um relato útil separa o que você observou do que imagina ser a causa. Anote a mensagem de erro e o que estava fazendo. Nunca envie senhas ao suporte. Antes de reiniciar um equipamento, salve seu trabalho quando possível e siga as orientações da organização.', steps:['Descreva a tarefa e o que aconteceu.','Anote a mensagem de erro sem incluir dados sensíveis.','Informe os testes que já fez e procure o canal oficial.'], example:'“Ao abrir o sistema de pedidos, apareceu ‘conexão indisponível’. A internet funciona em outros sites. O problema começou após o almoço.” Isso ajuda mais que “o computador estragou”.', question:'Qual informação deve ficar fora do chamado?', options:['A mensagem de erro.','Os testes já realizados.','Sua senha de acesso.'], correct:2, explanation:'Senhas são pessoais e não devem ser compartilhadas. O suporte pode investigar sem recebê-las.'},
    caixa: {title:'Conferência no fechamento', text:'No fechamento, compare os registros do sistema com os valores efetivamente recebidos, separados por forma de pagamento. Uma diferença pede nova conferência e comunicação ao responsável, não uma alteração sem justificativa. Este exercício não substitui treinamento no sistema da empresa.', steps:['Confira os totais por forma de pagamento.','Considere o valor inicial do caixa conforme o procedimento local.','Documente diferenças e peça orientação antes de ajustar.'], example:'Há um valor de R$ 200 em vendas em dinheiro e R$ 100 de fundo inicial, sem retiradas. O esperado é R$ 300. Se a contagem não coincidir, confira os registros e comunique a diferença.', question:'O valor contado difere do esperado. O que fazer?', options:['Conferir os registros e comunicar a diferença.','Alterar uma venda sem justificativa.','Ignorar o fechamento.'], correct:0, explanation:'Uma diferença precisa ser investigada e documentada. Alterações sem justificativa prejudicam a conferência.'},
    comunicacao: {title:'Escrever um pedido claro', text:'Uma mensagem profissional funciona melhor quando apresenta contexto, pedido e prazo desejado. Prefira frases diretas e confirme se o prazo é viável. Evite termos vagos, como “aquilo” ou “urgente”, sem explicar do que você precisa.', steps:['Explique a situação em uma frase.','Diga qual ação ou informação precisa.','Indique o prazo e abra espaço para combinar outra possibilidade.'], example:'“Estou organizando os materiais da reunião de quinta. Você pode revisar a lista até quarta às 15h? Se não for possível, me avise para combinarmos outra forma.”', question:'Qual mensagem deixa o pedido claro?', options:['“Preciso daquilo urgente.”','“Pode revisar a lista até quarta às 15h? Se precisar, combinamos outro prazo.”','“Resolva quando der.”'], correct:1, explanation:'A mensagem identifica a tarefa e o prazo, além de permitir um acordo sobre a entrega.'}
  };
  const grid = document.querySelector('#course-grid');
  if (!grid) return;
  const search = document.querySelector('#course-search');
  const area = document.querySelector('#course-area');
  const empty = document.querySelector('#course-empty');
  const normal = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  grid.innerHTML = courses.map(course => `<article class="course-card" data-course="${course.id}" data-area="${course.area}">
    <div class="course-cover"><img src="${imageRoot}${course.image}" alt="${course.alt}" width="640" height="420"><span>Aula aberta · grátis</span></div>
    <div class="course-card-body"><p class="course-area">${course.area}</p><h3>${course.title}</h3><p class="course-summary">${course.summary}</p><p class="course-meta">Iniciante <span aria-hidden="true">/</span> Leitura + exercício</p><button class="course-open" data-open="${course.id}" type="button" aria-label="Explorar ${course.title}">Explorar curso <span aria-hidden="true">↗</span></button><a class="course-assessment-link" href="avaliacao.html?curso=${course.id}">Demonstrar habilidades <span aria-hidden="true">→</span></a></div></article>`).join('');
  function filter() {
    const query = normal(search.value);
    let count = 0;
    grid.querySelectorAll('.course-card').forEach((card, index) => {
      const course = courses[index];
      card.hidden = !(normal([course.title, course.summary, ...course.topics].join(' ')).includes(query) && (!area.value || area.value === course.area));
      if (!card.hidden) count++;
    });
    empty.hidden = count !== 0;
    document.querySelector('#course-results').textContent = `${count} ${count === 1 ? 'curso encontrado' : 'cursos encontrados'}`;
  }
  search.addEventListener('input', filter);
  area.addEventListener('change', filter);
  document.querySelector('#course-filter').addEventListener('submit', event => {event.preventDefault(); filter();});
  document.querySelector('#course-reset').addEventListener('click', () => {search.value = ''; area.value = ''; filter(); search.focus();});
  filter();
  const dialog = document.createElement('dialog');
  dialog.className = 'course-dialog';
  dialog.setAttribute('aria-labelledby', 'course-dialog-title');
  dialog.setAttribute('aria-describedby', 'course-dialog-note');
  document.body.append(dialog);
  let activeCourse, opener, passed = false;
  const completions = new Set();
  const temporaryCompletions = new Set();
  const key = id => `nextgen-course-demo-v1-${id}`;
  function completed(id) {
    try { return completions.has(id) || localStorage.getItem(key(id)) === 'complete'; } catch { return completions.has(id); }
  }
  function shell(title, content) {
    dialog.innerHTML = `<div class="course-dialog-inner"><div class="course-dialog-bar"><p>AULA ABERTA · DEMONSTRAÇÃO</p><button class="course-close" type="button" data-action="close">Fechar</button></div><h2 id="course-dialog-title" tabindex="-1">${title}</h2><p id="course-dialog-note" class="course-dialog-note">Amostra gratuita, sem matrícula. A conclusão é apenas local: não é um certificado nem comprovação profissional.</p>${content}</div>`;
    dialog.scrollTop = 0;
    if (dialog.open) dialog.querySelector('h2').focus();
  }
  function completionMarkup(storageMessage = '') {
    if (!storageMessage && temporaryCompletions.has(activeCourse.id)) storageMessage = 'Armazenamento indisponível: conclusão mantida somente nesta aba até recarregar.';
    return `<div id="course-completion" class="course-done" role="status"><strong>Aula demo concluída</strong><p>Este registro não é um certificado e não é enviado a empresas. ${storageMessage || 'Conclusão salva apenas neste navegador.'}</p><a class="course-assessment-link" href="avaliacao.html?curso=${activeCourse.id}">Registrar minhas habilidades na avaliação prática →</a><button type="button" class="course-secondary" data-action="erase">Apagar conclusão demo</button></div>`;
  }
  function details() {
    const c = activeCourse;
    shell(c.title, `<p>${c.summary}</p><h3>O que você vai conhecer</h3><ul>${c.topics.map(topic => `<li>${topic}</li>`).join('')}</ul><h3>Uma primeira experiência, sem barreiras de entrada</h3><p>Para quem está começando ou quer revisar fundamentos. A aula é em texto, com exemplo e uma questão comentada, sem vídeo obrigatório e sem cronômetro.</p>${completed(c.id) ? completionMarkup() : ''}<button type="button" class="courses-button" data-action="lesson">Experimentar aula demo</button><a class="course-assessment-link" href="avaliacao.html?curso=${c.id}">Ir direto à avaliação prática →</a>`);
  }
  function lesson() {
    passed = false;
    const l = lessons[activeCourse.id];
    shell(l.title, `<p class="course-area">${activeCourse.title}</p><h3>Entenda o essencial</h3><p>${l.text}</p><ol>${l.steps.map(step => `<li>${step}</li>`).join('')}</ol><div class="course-example"><strong>Na prática</strong><p>${l.example}</p></div><form id="course-quiz"><fieldset><legend>${l.question}</legend>${l.options.map((option, index) => `<label class="course-answer"><input type="radio" name="answer" value="${index}" required><span>${option}</span></label>`).join('')}</fieldset><button class="courses-button" type="submit">Conferir resposta</button></form><p id="course-feedback" class="course-feedback" role="status" aria-live="polite"></p><button type="button" class="courses-button" data-action="complete" hidden>Concluir aula demo</button><div id="course-done-slot">${completed(activeCourse.id) ? completionMarkup() : ''}</div><div class="course-actions"><button type="button" class="course-secondary" data-action="details">Voltar ao curso</button><a class="courses-text-link" href="jornada.html">Seguir para minha jornada →</a></div>`);
  }
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-open]');
    if (!button) return;
    activeCourse = courses.find(course => course.id === button.dataset.open);
    opener = button;
    details();
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    dialog.querySelector('h2').focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')].filter(el => !el.hidden && !el.disabled && el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {event.preventDefault(); last?.focus();}
    else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {event.preventDefault(); first?.focus();}
  });
  dialog.addEventListener('close', () => {document.documentElement.style.overflow = ''; opener?.focus();});
  dialog.addEventListener('submit', event => {
    if (event.target.id !== 'course-quiz') return;
    event.preventDefault();
    const answer = new FormData(event.target).get('answer');
    if (answer === null) return;
    const l = lessons[activeCourse.id];
    passed = Number(answer) === l.correct;
    dialog.querySelector('#course-feedback').textContent = `${passed ? 'Isso mesmo!' : 'Tente novamente.'} ${l.explanation}`;
    dialog.querySelector('[data-action="complete"]').hidden = !passed;
  });
  dialog.addEventListener('change', event => {
    if (event.target.name !== 'answer') return;
    passed = false;
    dialog.querySelector('[data-action="complete"]').hidden = true;
    dialog.querySelector('#course-feedback').textContent = '';
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    switch (button.dataset.action) {
      case 'close': dialog.close(); break;
      case 'lesson': lesson(); break;
      case 'details': details(); break;
      case 'complete': {
        if (!passed) return;
        completions.add(activeCourse.id);
        let message = '';
        try { localStorage.setItem(key(activeCourse.id), 'complete'); temporaryCompletions.delete(activeCourse.id); } catch { temporaryCompletions.add(activeCourse.id); message = 'Armazenamento indisponível: conclusão mantida somente nesta aba até recarregar.'; }
        dialog.querySelector('#course-done-slot').innerHTML = completionMarkup(message);
        button.hidden = true;
        const done = dialog.querySelector('#course-completion');
        done.tabIndex = -1; done.focus();
        break;
      }
      case 'erase': {
        try { localStorage.removeItem(key(activeCourse.id)); } catch { /* In-memory completion can still be erased. */ }
        completions.delete(activeCourse.id);
        temporaryCompletions.delete(activeCourse.id);
        details();
        break;
      }
    }
  });
  const requested=new URLSearchParams(location.search).get('curso');
  if(courses.some(c=>c.id===requested))grid.querySelector('[data-open="'+requested+'"]').click();
})();
