/* Práticas locais de aprendizagem: não são certificação ou validação profissional.
 * Evidência aberta exige revisão humana; não participa da pontuação automática.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NextGenAssessment = factory();
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const courses = [
    {
      id: 'aprendiz', title: 'Primeiros passos no trabalho', skill: 'Organizar entregas e pedir orientação com contexto',
      brief: 'Você apoia uma reunião. A lista de materiais precisa estar pronta antes de separar os kits. Resolva dependências e combine uma entrega possível, sem inventar experiência.',
      learn: [
        'Uma atividade que depende de outra vem depois dela: primeiro confirme a lista, depois separe os materiais. Se houver conflito de prioridades, confirme com a pessoa responsável antes de alterar a entrega.',
        'Ao pedir orientação, diga a tarefa, a dúvida específica e o que já conferiu. Uma pergunta objetiva evita que a equipe precise adivinhar o problema e não exige revelar informações pessoais.',
        'Uma apresentação profissional pode usar um projeto escolar ou voluntário real. Descreva sua ação e o resultado observado, sem transformar uma participação em experiência que você não teve.'
      ],
      tasks: [
        {id: 'prioridade', label: 'A lista ainda não foi confirmada e os kits dependem dela. Qual ação vem primeiro?', type: 'choice', options: ['Separar kits com base em uma suposição.', 'Confirmar a lista com a pessoa responsável.', 'Marcar os kits como entregues.'], expected: 1, feedback: 'Confirmar a lista resolve a dependência e reduz retrabalho antes da separação dos kits.', points: 30},
        {id: 'orientacao', label: 'Há duas quantidades diferentes na lista. Qual pedido de orientação permite decidir com segurança?', type: 'choice', options: ['A lista mostra 12 kits no cabeçalho e 10 no detalhe. Qual quantidade devo usar?', 'Não entendi nada; faça por mim.', 'Vou escolher qualquer quantidade e não registrar.'], expected: 0, feedback: 'Indicar as duas quantidades e a decisão necessária torna a dúvida verificável pela equipe.', points: 40},
        {id: 'apresentacao', label: 'Você organizou materiais em um projeto escolar. Qual apresentação descreve essa experiência sem exagerar?', type: 'choice', options: ['Já gerenciei o estoque de uma empresa.', 'Sou especialista em todas as rotinas.', 'No projeto escolar, conferi a lista e separei os materiais para a equipe.'], expected: 2, feedback: 'O exemplo delimita o contexto e a ação realizada, sem inventar cargo ou responsabilidade.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, escreva sua sequência de preparação dos kits, um pedido de orientação sobre a quantidade divergente e uma apresentação baseada em uma atividade real. Não inclua dados pessoais.',
      rubric: ['Ordena a confirmação da lista antes da separação dos kits.', 'Explicita a divergência e formula uma pergunta que permita resolvê-la.', 'Relaciona uma atividade real à própria contribuição, sem atribuir experiência não realizada.']
    },
    {
      id: 'informatica', title: 'Informática essencial', skill: 'Organizar arquivos e enviar documentos com segurança',
      brief: 'Prepare um currículo de exemplo para uma candidatura fictícia. Organize a versão em PDF e confira o envio, sem usar dados reais.',
      learn: [
        'Use uma pasta temática e um nome que identifique o documento. Nesta prática, o padrão combinado é Curriculo_Ana_Atendimento.pdf, com maiúsculas, sublinhados e extensão exatamente como mostrados.',
        'Renomear um arquivo .docx para .pdf não converte o conteúdo. No editor, use Exportar ou Salvar como PDF e confira se o documento exportado abre corretamente.',
        'Antes de enviar, confira endereço do destinatário, assunto e anexo. Um link que pede sua senha fora do canal oficial deve ser confirmado por outro canal, não preenchido por pressa.'
      ],
      tasks: [
        {id: 'arquivo', label: 'Digite o nome do arquivo no padrão exato combinado: Curriculo_Ana_Atendimento.pdf', type: 'text', expected: 'Curriculo_Ana_Atendimento.pdf', feedback: 'O nome combinado identifica o currículo e a área; escrever a extensão não substitui a exportação para PDF.', points: 30},
        {id: 'pdf', label: 'O currículo está no editor como DOCX. Como produzir um PDF que preserve o documento?', type: 'choice', options: ['Trocar somente a extensão no nome.', 'Exportar como PDF no editor e conferir o arquivo gerado.', 'Apagar a extensão antes de enviar.'], expected: 1, feedback: 'Exportar pelo editor gera o formato PDF; conferir o resultado evita enviar um documento incorreto.', points: 40},
        {id: 'envio', label: 'A mensagem está pronta, mas há dois currículos na pasta. O que conferir antes de enviar?', type: 'choice', options: ['Somente a cor do ícone do arquivo.', 'Enviar os dois, sem abrir nenhum.', 'Destinatário, assunto e se o anexo é a versão solicitada.'], expected: 2, feedback: 'A conferência do destinatário e da versão do anexo evita exposição indevida e envio do documento errado.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, descreva a pasta escolhida, como exportaria o currículo fictício para PDF e sua conferência final do e-mail. Não envie currículo ou endereço reais.',
      rubric: ['Identifica pasta e nome que permitam localizar a versão solicitada.', 'Descreve exportação para PDF em vez de simples troca de extensão.', 'Confere destinatário e versão do anexo antes do envio.']
    },
    {
      id: 'excel', title: 'Excel para o trabalho', skill: 'Somar e conferir valores em uma planilha',
      brief: 'Uma planilha de materiais tem B2 = 18,50; B3 = 24,75; B4 = 6,25. Calcule o total e registre a fórmula para o intervalo completo.',
      learn: [
        'B2:B4 inclui B2, B3 e B4. Some todos os valores: 18,50 + 24,75 + 6,25 = 49,50. Nesta prática, digite apenas o número, usando vírgula ou ponto decimal, sem símbolo de moeda.',
        'No Excel em português, a fórmula =SOMA(B2:B4) soma o intervalo completo. Para o exercício de formato, digite exatamente essa fórmula em maiúsculas; não é necessário abrir uma planilha.',
        'Um total correto depende dos registros de origem. Se B3 estiver vazia por falta de uma nota, confirme o valor antes de tratá-la como zero. A fórmula não comprova que os dados estão completos.'
      ],
      tasks: [
        {id: 'total', label: 'B2 contém 18,50; B3 contém 24,75; B4 contém 6,25. Digite o total, sem moeda.', type: 'number', expected: 49.5, feedback: 'A soma das três células é 49,50; o intervalo inclui também a célula B3.', points: 30},
        {id: 'formula', label: 'Digite exatamente a fórmula em português que soma B2 até B4: =SOMA(B2:B4)', type: 'text', expected: '=SOMA(B2:B4)', feedback: 'O sinal de igual inicia a fórmula e B2:B4 inclui todas as três células do intervalo.', points: 40},
        {id: 'conferencia', label: 'B3 ficou vazia porque a nota ainda não chegou. Como proceder antes de divulgar o total?', type: 'choice', options: ['Confirmar o valor ausente e sinalizar que o total está incompleto.', 'Considerar a nota inexistente e informar o total como definitivo.', 'Copiar B2 para B3 sem consultar a nota.'], expected: 0, feedback: 'Um dado ausente precisa ser conferido; não deve virar zero ou um valor inventado silenciosamente.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, explique como organizaria os três registros, qual intervalo conferiria e como avisaria sobre uma nota ausente. A resposta aberta não altera a pontuação objetiva.',
      rubric: ['Relaciona os três valores às células e ao intervalo completo.', 'Explica a conferência do total com os registros de origem.', 'Identifica dado ausente e comunica a limitação sem inventar valor.']
    },
    {
      id: 'atendimento', title: 'Atendimento e varejo', skill: 'Confirmar uma solicitação e encaminhar sem promessa indevida',
      brief: 'Uma pessoa recebeu uma camiseta azul, mas pediu verde. Você pode consultar o pedido, mas não conhece o prazo de troca. Pratique a confirmação e o encaminhamento.',
      learn: [
        'Comece confirmando o ocorrido sem atribuir culpa: a pessoa pediu uma camiseta verde e recebeu azul. Peça somente o identificador necessário para consultar o pedido no canal apropriado.',
        'Se a troca depende de outra equipe, explique que verificará as opções e o prazo. Não transforme uma estimativa desconhecida em promessa de solução imediata.',
        'Um encaminhamento útil registra o item pedido, o recebido, a solicitação e o canal de acompanhamento. Compartilhe apenas os dados necessários com a equipe responsável.'
      ],
      tasks: [
        {id: 'confirmacao', label: 'Qual resposta confirma a necessidade antes de propor uma solução para a camiseta?', type: 'choice', options: ['Você pediu verde e recebeu azul, certo? Posso consultar o identificador do pedido?', 'A culpa deve ser sua.', 'Todas as camisetas são iguais.'], expected: 0, feedback: 'Resumir item pedido e recebido confirma o problema e permite consultar o pedido sem culpar a pessoa.', points: 30},
        {id: 'prazo', label: 'A equipe de trocas ainda não confirmou prazo. Qual informação você pode oferecer agora?', type: 'choice', options: ['A troca estará pronta em cinco minutos.', 'Vou consultar as opções e o prazo com a equipe e informar pelo canal combinado.', 'Não existe prazo e não haverá acompanhamento.'], expected: 1, feedback: 'O encaminhamento descreve uma ação possível sem prometer um prazo que ainda não foi confirmado.', points: 40},
        {id: 'registro', label: 'Qual registro permite que a equipe de trocas dê continuidade ao atendimento?', type: 'choice', options: ['Cliente reclamou de algo.', 'Senha da conta e opinião sobre a pessoa.', 'Pedido consultado, camiseta verde solicitada, azul recebida e retorno pelo canal combinado.'], expected: 2, feedback: 'Registrar fatos, solicitação e acompanhamento permite continuidade sem dados sensíveis desnecessários.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, escreva uma resposta inicial para a troca e um registro de encaminhamento com fatos, próximo passo e acompanhamento. Use somente os dados fictícios do cenário.',
      rubric: ['Confirma a diferença entre item solicitado e recebido sem atribuir culpa.', 'Explica o próximo passo sem prometer prazo não confirmado.', 'Registra informações necessárias e um canal de acompanhamento sem dados sensíveis.']
    },
    {
      id: 'logistica', title: 'Logística e estoque', skill: 'Calcular saldo e registrar divergências de estoque',
      brief: 'O item CX-04 tem saldo inicial de 48 unidades. Entraram 12 e saíram 17, todas conferidas. Em outra entrega, o documento indica 12, mas a contagem física é 10.',
      learn: [
        'O saldo resulta de estoque inicial mais entradas menos saídas: 48 + 12 − 17 = 43 unidades. Registre cada movimento conferido para que o saldo possa ser reconstituído.',
        'No recebimento, compare código, quantidade e condição com o documento. Se constam 12 unidades e chegam 10, registre a contagem e a divergência pelo procedimento local; não declare 12 recebidas.',
        'Um endereço de estoque indica onde encontrar o item. Use o endereço informado para o código correto e mantenha a identificação no registro, sem misturar produtos por terem embalagens semelhantes.'
      ],
      tasks: [
        {id: 'saldo', label: 'Saldo inicial 48, entrada conferida 12 e saída conferida 17. Digite o saldo final em unidades.', type: 'number', expected: 43, feedback: 'O saldo final é 43 unidades: 48 mais 12 recebidas menos 17 retiradas.', points: 30},
        {id: 'divergencia', label: 'Em outra entrega, o documento indica 12 unidades e chegaram 10. Qual registro é fiel à conferência?', type: 'choice', options: ['Registrar 12 recebidas para coincidir com o documento.', 'Registrar a contagem de 10 e comunicar a divergência conforme o procedimento.', 'Não registrar nada e guardar o produto.'], expected: 1, feedback: 'O registro precisa refletir a quantidade conferida e permitir tratar a diferença de duas unidades.', points: 40},
        {id: 'endereco', label: 'CX-04 pertence ao endereço A-02 e CX-40 ao B-01. Onde guardar as unidades de CX-04?', type: 'choice', options: ['Em B-01, pois os códigos parecem semelhantes.', 'Em qualquer local sem identificação.', 'Em A-02, conferindo o código CX-04.'], expected: 2, feedback: 'Conferir código e endereço evita misturar itens diferentes e permite localizar o estoque depois.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, descreva o registro dos movimentos de CX-04 e como comunicaria o recebimento de 10 unidades diante de um documento com 12. Inclua a conferência de endereço.',
      rubric: ['Mostra entradas e saídas que permitem reconstituir o saldo de 43.', 'Registra a contagem física e encaminha a divergência sem alterar números para coincidir.', 'Relaciona o código CX-04 ao endereço A-02 e descreve a conferência de identificação.']
    },
    {
      id: 'acessibilidade', title: 'Trabalho e acessibilidade', skill: 'Remover barreiras de informação sem presumir necessidades',
      brief: 'Uma escala foi enviada apenas como imagem. A equipe precisa consultá-la com autonomia. Proponha um formato acessível e combine preferências com cada pessoa.',
      learn: [
        'Transmitir a escala também em texto permite consultar dias, horários e responsáveis sem depender da imagem. Escrever somente “foto da escala” não informa o conteúdo necessário.',
        'Pergunte diretamente qual formato de comunicação funciona para a pessoa. Não deduza capacidade, necessidade ou preferência a partir de uma deficiência e não escolha um intermediário sem consentimento.',
        'Use títulos que indiquem o assunto e links com destino descritivo, como “Consultar escala da semana”. O critério é conseguir localizar e compreender a mesma informação, sem exigir diagnóstico ou rapidez.'
      ],
      tasks: [
        {id: 'escala', label: 'A imagem contém segunda: Ana, 9h às 13h. Qual complemento transmite a informação da escala?', type: 'choice', options: ['Foto bonita de uma escala.', 'Escala de segunda: Ana, das 9h às 13h.', 'Peça para alguém ler a imagem por você.'], expected: 1, feedback: 'O texto transmite dia, responsável e horário, em vez de apenas descrever a existência da imagem.', points: 30},
        {id: 'preferencia', label: 'Uma pessoa relata dificuldade com o formato da escala. Qual pergunta evita presumir suas necessidades?', type: 'choice', options: ['Qual formato funciona melhor para você consultar os dias e horários?', 'Qual é seu diagnóstico para provar que precisa?', 'Vou decidir com outra pessoa sem falar com você.'], expected: 0, feedback: 'Perguntar à própria pessoa permite combinar um formato útil sem exigir diagnóstico ou presumir apoio.', points: 40},
        {id: 'link', label: 'Qual texto de link permite reconhecer o destino sem depender do restante da mensagem?', type: 'choice', options: ['Clique aqui.', 'Veja isto.', 'Consultar escala da semana.'], expected: 2, feedback: 'Um destino descritivo ajuda a identificar a função do link, inclusive ao navegar por uma lista de links.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, reescreva a escala de segunda em texto, formule uma pergunta sobre preferência de formato e explique como compartilhar a mesma informação com autonomia. Não solicite diagnóstico.',
      rubric: ['Preserva dia, responsável e horário no conteúdo textual da escala.', 'Consulta preferências diretamente, sem presumir capacidade ou exigir diagnóstico.', 'Propõe uma forma de localizar a informação sem impor ajuda de terceiros.']
    },
    {
      id: 'suporte', title: 'Suporte de TI básico', skill: 'Registrar um incidente e escolher testes seguros',
      brief: 'O sistema de pedidos mostra “conexão indisponível”, mas outros sites abrem. Registre o incidente fictício INC-204 sem incluir senha e escolha um encaminhamento seguro.',
      learn: [
        'Um chamado útil registra a tarefa, a mensagem observada e os testes feitos. Para vincular as anotações, use o identificador exato INC-204; isso não é um diagnóstico da causa do problema.',
        'Se outros sites abrem, registre essa observação. Ela não prova que o sistema está funcionando nem autoriza desativar proteções. Testes devem seguir as orientações da organização e preservar o trabalho.',
        'Encaminhe pelo canal oficial o identificador, a mensagem e os testes. Nunca compartilhe senhas; suporte deve investigar sem recebê-las. Evite anexos com dados de clientes.'
      ],
      tasks: [
        {id: 'protocolo', label: 'Digite o identificador do incidente no formato exato informado: INC-204', type: 'text', expected: 'INC-204', feedback: 'O identificador INC-204 vincula o relato ao incidente correto; ele não descreve nem comprova a causa.', points: 30},
        {id: 'teste', label: 'O sistema de pedidos falha, mas outros sites abrem. Qual é o próximo passo seguro?', type: 'choice', options: ['Desativar as proteções do computador.', 'Registrar a mensagem e o teste realizado e consultar o canal oficial.', 'Declarar que o computador quebrou sem investigar.'], expected: 1, feedback: 'Registrar o teste e a mensagem separa observação de hipótese e permite encaminhar sem remover proteções.', points: 40},
        {id: 'sigilo', label: 'Qual conteúdo pode integrar o chamado sem compartilhar credenciais?', type: 'choice', options: ['Sua senha para que a equipe entre na conta.', 'Uma lista completa dos dados dos clientes.', 'INC-204, mensagem de erro e informação de que outros sites abrem.'], expected: 2, feedback: 'Identificador, mensagem e testes ajudam a investigar sem expor senhas ou dados de clientes.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, escreva o chamado INC-204 com tarefa, mensagem observada, teste já feito e encaminhamento. Separe fatos de hipóteses e não inclua senha nem dados reais.',
      rubric: ['Identifica o incidente, a tarefa e a mensagem observada sem inventar causa.', 'Registra o teste de outros sites e escolhe encaminhamento seguro.', 'Mantém senhas e dados de clientes fora do relato.']
    },
    {
      id: 'caixa', title: 'Operador de caixa: introdução', skill: 'Conferir troco e saldo de fechamento',
      brief: 'Uma compra custa 67,40 e foi paga com 100,00 em dinheiro. No fechamento há fundo inicial de 120,00, vendas em dinheiro de 267,40 e retirada registrada de 50,00.',
      learn: [
        'Troco é o valor recebido menos o valor da compra: 100,00 − 67,40 = 32,60. Confira valor da venda e forma de pagamento antes de concluir. Digite números sem símbolo de moeda.',
        'No cenário, o saldo esperado em dinheiro é fundo inicial mais vendas em dinheiro menos retirada registrada: 120,00 + 267,40 − 50,00 = 337,40. Não some pagamentos de cartão ao dinheiro físico.',
        'Se a contagem divergir do esperado, confira os registros e a retirada, documente a diferença e comunique o responsável. Não altere vendas nem complete valores para esconder a divergência.'
      ],
      tasks: [
        {id: 'troco', label: 'Uma compra de 67,40 foi paga com 100,00 em dinheiro. Digite o troco, sem moeda.', type: 'number', expected: 32.6, feedback: 'O troco é 32,60: valor recebido de 100,00 menos o total da compra de 67,40.', points: 30},
        {id: 'fechamento', label: 'Fundo 120,00 + vendas em dinheiro 267,40 − retirada registrada 50,00. Digite o saldo esperado.', type: 'number', expected: 337.4, feedback: 'O esperado é 337,40 em dinheiro, considerando o fundo inicial e descontando a retirada registrada.', points: 40},
        {id: 'diferenca', label: 'Foram contados 327,40, mas o esperado é 337,40. Como tratar a diferença?', type: 'choice', options: ['Conferir os registros e documentar a falta de 10,00 para o responsável.', 'Alterar uma venda para eliminar a diferença sem justificativa.', 'Ignorar a retirada e informar que fechou corretamente.'], expected: 0, feedback: 'A falta de 10,00 precisa ser conferida, documentada e comunicada; não se corrige ocultando registros.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, descreva sua conferência de troco e fechamento e o registro da diferença entre 327,40 contados e 337,40 esperados. Não use dados de transações reais.',
      rubric: ['Relaciona valor recebido, valor da compra e troco de 32,60.', 'Distingue fundo, vendas em dinheiro e retirada no saldo de 337,40.', 'Documenta a falta de 10,00 e encaminha a conferência sem ocultar diferenças.']
    },
    {
      id: 'comunicacao', title: 'Comunicação no trabalho', skill: 'Escrever um pedido acionável e confirmar entendimento',
      brief: 'Você organiza materiais para uma reunião de quinta. Precisa de revisão da lista até quarta às 15h, mas deve combinar outro prazo se necessário.',
      learn: [
        'Um pedido acionável traz contexto, ação e prazo desejado: a lista de materiais da reunião de quinta precisa de revisão até quarta às 15h. Evite referências vagas como “aquilo” sem indicar o documento.',
        'Informe o prazo e permita negociar se ele não for viável. Se a outra pessoa só puder revisar quinta, explique a dependência da reunião e combine alternativa, sem atribuir intenção ao atraso.',
        'Confirme o acordo resumindo ação e prazo combinados. O registro permite consultar o que foi decidido e deve atualizar o prazo anterior quando houver mudança.'
      ],
      tasks: [
        {id: 'pedido', label: 'Qual mensagem permite agir sobre a lista de materiais sem adivinhar contexto ou prazo?', type: 'choice', options: ['Preciso daquilo urgente.', 'Você pode revisar a lista de materiais da reunião de quinta até quarta às 15h? Se não for possível, combinamos outro prazo.', 'Veja quando der, você sabe o que é.'], expected: 1, feedback: 'A mensagem identifica o documento, a ação e o prazo desejado, permitindo negociar a entrega.', points: 30},
        {id: 'negociacao', label: 'A pessoa só consegue revisar quinta, depois do início da reunião. Como responder?', type: 'choice', options: ['A reunião precisa da lista antes de começar. Podemos dividir a revisão ou combinar outra pessoa?', 'Você nunca colabora; vou divulgar isso.', 'Aceitar sem avisar que a lista ficará pendente na reunião.'], expected: 0, feedback: 'Explicar a dependência e propor alternativas ajuda a negociar sem ocultar o impacto ou atacar a pessoa.', points: 40},
        {id: 'acordo', label: 'Foi combinado revisar apenas os itens prioritários na quarta às 14h. Qual confirmação registra o novo acordo?', type: 'choice', options: ['Combinado aquilo.', 'Continuo aguardando tudo na quinta.', 'Confirmando: revisão dos itens prioritários da lista na quarta às 14h; os demais serão combinados depois.'], expected: 2, feedback: 'A confirmação registra escopo e prazo atualizados, deixando claro o que ainda precisa ser combinado.', points: 30}
      ],
      evidencePrompt: 'Para revisão humana, escreva o pedido inicial de revisão e a confirmação do acordo: itens prioritários na quarta às 14h, demais itens a combinar. Mostre como explicaria a dependência da reunião.',
      rubric: ['Apresenta contexto, ação solicitada e prazo de forma identificável.', 'Propõe negociação que considera a dependência da reunião sem atribuir culpa.', 'Registra o escopo e o prazo atualizados e explicita o que segue pendente.']
    }
  ];

  // No expressions, exponent notation, currency symbols or thousands separators.
  // A comma or a point is a decimal separator; ordinary surrounding space is ignored.
  function numericResponse(value, label) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && /^[+-]?\d+(?:[.,]\d+)?$/.test(value.trim())) {
      const number = Number(value.trim().replace(',', '.'));
      if (Number.isFinite(number)) return number;
    }
    throw new Error(`Informe um número válido, sem moeda, para: ${label}`);
  }

  function objectiveResponse(task, answers) {
    if (!Object.prototype.hasOwnProperty.call(answers, task.id) || answers[task.id] == null ||
        (typeof answers[task.id] === 'string' && !answers[task.id].trim())) {
      throw new Error(`Responda à tarefa obrigatória: ${task.label}`);
    }
    const value = answers[task.id];
    if (task.type === 'number') return numericResponse(value, task.label);
    if (task.type === 'text') {
      if (typeof value !== 'string') throw new Error(`A resposta deve ser um texto para: ${task.label}`);
      return value.trim();
    }
    const index = typeof value === 'number' ? value :
      (typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value.trim()) : NaN);
    if (!Number.isInteger(index) || index < 0 || index >= task.options.length) {
      throw new Error(`Selecione uma opção válida para: ${task.label}`);
    }
    return index;
  }

  function evaluate(courseId, answers) {
    const course = courses.find(item => item.id === courseId);
    if (!course) throw new Error('Curso não encontrado. Escolha uma prática disponível.');
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      throw new Error('Informe as respostas em um mapa de tarefas e valores.');
    }
    const breakdown = course.tasks.map(task => {
      const value = objectiveResponse(task, answers);
      // Floating-point tolerance only: not a rounding allowance for incorrect amounts.
      const correct = task.type === 'number' ? Math.abs(value - task.expected) <= 1e-9 : value === task.expected;
      return { id: task.id, label: task.label, points: correct ? task.points : 0,
        maxPoints: task.points, correct, response: answers[task.id], expected: task.expected, feedback: task.feedback };
    });
    const score = breakdown.reduce((sum, item) => sum + item.points, 0);
    // With three 30/40/30 tasks, only 100 meets 80; a single error yields at most 70.
    return { score, passed: score >= 80, breakdown, maxScore: 100 };
  }

  function validateEvidence(text) {
    if (typeof text !== 'string') return 'Escreva a evidência em texto para revisão humana.';
    const length = text.trim().length;
    if (length < 60) return 'Escreva pelo menos 60 caracteres, sem contar espaços no início e no fim.';
    if (length > 4000) return 'Use no máximo 4000 caracteres, sem contar espaços no início e no fim.';
    // Length is a form requirement, not a judgment of quality, skill or capacity.
    return '';
  }

  return { courses, evaluate, validateEvidence };
}));
