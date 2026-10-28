# Avaliações práticas de habilidades

## Papel no produto

A NextGen é uma plataforma de vagas. Os cursos e as avaliações ajudam o candidato a apresentar evidências do que sabe fazer e ajudam empresas a discutir competências, em vez de presumir capacidade a partir da deficiência.

A aprendizagem é opcional: cada curso permite estudar ou entrar diretamente no desafio. Não há cronômetro, vídeo obrigatório, diagnóstico, laudo, teste motor ou critério diferente para candidatos PCD. Adaptações necessárias em uma contratação real devem ser combinadas com a própria pessoa.

## Fluxo implementado

1. Cursos oferece “Demonstrar habilidades” em cada um dos nove temas.
2. `avaliacao.html?curso=excel` (ou outro ID) abre o contexto e os critérios do desafio.
3. O candidato pode estudar primeiro ou começar as tarefas diretamente.
4. As tarefas objetivas têm pontuação e correção explícitas. Uma resposta escrita registra o raciocínio para revisão humana.
5. O relatório reúne atividade, respostas, referências, pontos, entrega escrita e critérios de revisão. Pode ser baixado em TXT.
6. O painel da empresa permite examinar relatórios feitos **no mesmo navegador**. Isso não envia uma candidatura ou compartilha dados entre dispositivos.

## O que o relatório afirma — e o que não afirma

- Registra respostas a situações introdutórias específicas.
- Identifica a pontuação **apenas** da parte objetiva.
- Mantém a entrega escrita como **revisão humana pendente**. O tamanho mínimo de texto não mede qualidade e palavras-chave não produzem nota.
- Não verifica identidade, autoria, experiência, aptidão geral ou desempenho futuro.
- Não emite certificado profissional reconhecido ou um selo com validação independente.
- O código e as respostas de referência estão no JavaScript público. Dados locais e relatórios TXT podem ser alterados. A pontuação demonstrativa não deve ser usada como única decisão de contratação.

## Persistência e privacidade

Os relatórios usam a chave local `nextgen.skill-reports.v1`, limitados às 50 tentativas mais recentes. Não pedem nome, CPF, diagnóstico ou dados de clientes. Cada relatório pode ser apagado pelo candidato. Se o armazenamento estiver indisponível, o resultado permanece somente na aba e o download continua disponível, sem anunciar que foi salvo.

Um link de relatório usa seu identificador local e só funciona onde esse registro existe. Para mostrar a outra pessoa, baixe o TXT; ele continua sendo um documento não verificado.

## Para uma comprovação confiável em produção

São necessários avaliação validada com profissionais da área, revisão humana acessível, autenticação e consentimento, critérios de adaptação, correção protegida no servidor, controle de versões, política de retenção, contestação/revisão e validação da autenticidade dos registros. Esses controles não são simulados pelo protótipo.

## Arquivos

- `assets/js/nextgen-assessment-core.js`: situações, critérios e correção objetiva.
- `assets/js/nextgen-assessment.js`: execução das tarefas, resultados, histórico e download.
- `assets/css/nextgen-assessment.css`: interface de trabalho e relatório.
- `assets/js/nextgen-evidence-preview.js`: lista local para a empresa.
- `tests/assessment-core.test.cjs` e `tests/assessment-flow.test.cjs`: testes de correção e do caminho no navegador.
