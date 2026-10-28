# NextGen — vagas, preparação e acessibilidade

Site estático em HTML, CSS e JavaScript, com arquivos já gerados para servir diretamente. A NextGen atende candidatos e empresas: preparação gratuita, inclusão e recrutamento por competências. Todas as rotas usam o mesmo cabeçalho e rodapé, com Gen verde-claro sobre azul-marinho.

## Executar

Na pasta do projeto:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Abra `http://127.0.0.1:4173/` para a prévia local. A hospedagem usa GitHub Pages a partir da branch `main`, na raiz, com o domínio configurado em `CNAME`. O arquivo `.nojekyll` permite servir os arquivos estáticos gerados sem processamento Jekyll.

## Implementado

- Início responsivo com imagem local, fontes locais e caminhos distintos para quem já tem currículo ou prefere se preparar.
- Vagas com filtros combinados por palavra-chave, cidade, estado, área e indicação PCD do anúncio original; detalhes em diálogo, exemplos salvos localmente e estado vazio recuperável. Os 15 exemplos foram preservados do acervo existente, sem inventar requisitos ou adaptações.
- `jornada.html`: currículo existente em PDF/DOCX (até 5 MB), escolha da área e teste direto sem curso obrigatório. O arquivo fica apenas na aba: não é enviado, lido por IA ou salvo após recarregar.
- Alternativa para montar e baixar um rascunho de currículo em TXT. Nenhum dado é enviado para servidor.
- Avaliações introdutórias de Administração, Atendimento e Tecnologia, com cinco questões por área, explicações, correção e nova tentativa. Sem cronômetro; limiar demonstrativo de 80%.
- Chat de suporte com avatar ilustrado da Lia, histórico de mensagens dos dois lados, respostas rápidas contextuais para candidatos e empresas e limpeza de conversa. As mensagens ficam apenas na memória da aba. O assistente é explicitamente automático: não utiliza IA generativa, serviços externos ou chaves de API.
- Preferências de texto maior, alto contraste, links sublinhados e redução de movimento, salvas localmente quando permitido. Diálogos com rótulos, Escape e retorno de foco.
- Catálogo renovado de nove aulas introdutórias, com fotos locais, filtros, detalhes, exercício corrigido e conclusão demonstrativa local. Cursos continuam opcionais.
- Avaliações práticas por curso em `avaliacao.html`: tarefas objetivas, entrega escrita e critérios de revisão humana. Quem já domina o assunto pode ir direto ao desafio. O relatório pode ser baixado em TXT e examinado na visão da empresa no mesmo navegador; não há verificação de identidade ou certificação profissional. Consulte `docs/avaliacoes.md` para os limites e controles necessários em produção.
- Área de empresas com apresentação própria, painel de rascunhos de vagas (criar, editar, encerrar e excluir) e três perfis explicitamente fictícios. Nada é publicado externamente.
- Contato permite preparar e baixar uma mensagem; ferramentas de remuneração usam valores fornecidos pelo usuário, sem determinar direitos trabalhistas.
- Todas as páginas carregam CSS/JS versionados por hash, evitando mistura com versões antigas em cache.

## Limites importantes

Este é um **protótipo funcional de apresentação**, não um serviço de recrutamento em produção. As vagas da demonstração não são anúncios ativos. Não há candidatura enviada a empresas, autenticação Google real, matrícula em cursos, emissão de certificado profissional, verificação antifraude ou atendimento humano online. O selo exibido no teste é demonstrativo e não comprova capacidade profissional de forma independente.

As telas antigas foram substituídas. Cadastro e entrada demonstrativos não pedem CPF, CNPJ ou senha e não simulam autenticação Google real. Não insira dados pessoais reais no protótipo.

Para produção será necessário backend com autenticação real, gestão segura de currículos e consentimento, anúncios verificados, avaliações validadas por área, histórico de tentativas e processo acessível de revisão humana. As respostas certas estão no JavaScript público e o resultado local não pode ser usado como certificação confiável.

## Testes

Requer Node.js e dependências de desenvolvimento:

```sh
npm ci
npm run build
npm test
```

Para os testes de navegador, mantenha o servidor acima rodando e execute:

```sh
npm run test:e2e
npm run test:audit
```

Mantenha o servidor da porta 4173 ativo também para a suíte completa. `npm run build` regenera as páginas regionais, normaliza os componentes compartilhados e atualiza os hashes de CSS/JS. Execute após editar esses recursos. A suíte roda os arquivos em sequência para evitar concorrência excessiva entre instâncias de Chrome.

Os scripts procuram Chrome em `C:/Program Files/Google/Chrome/Application/chrome.exe`. Para outro ambiente defina `CHROME_PATH` com o executável do Chrome/Chromium instalado.

Testes incluem pontuação e limites do currículo, fluxo completo de currículo → teste → resultado, criação e download de rascunho, assistente, diálogos, preferências, larguras responsivas e auditoria automatizada axe nas novas telas. Auditoria automatizada não equivale a certificação WCAG; ainda é necessária validação manual com leitores de tela e pessoas com deficiência. As telas legadas não têm conformidade integral atestada.

## Organização

- `index.html`, `assets/css/nextgen-home.css`: novo início.
- `jornada.html`, `assets/js/nextgen-journey*.js`, `assets/css/nextgen-journey.css`: currículo e teste.
- `assets/js/nextgen-experience.js`, `assets/css/nextgen-experience.css`: assistente e preferências globais.
- `assets/css/nextgen-site.css`, `assets/js/nextgen-site.js`: identidade e navegação comuns.
- `tools/build-site.cjs`, `site-manifest.json`: geração estática e inventário de todas as rotas.
- `assets/*/nextgen-company.*`: painel e fluxos de empresas.
- `assets/*/nextgen-courses.*`: catálogo e aulas.
- `assets/img/nextgen-assistant.svg`: avatar ilustrado da Lia.
- `artifacts/`: auditorias e capturas das verificações em navegador.
- `assets/js/nextgen-custom.js`: arquivo legado preservado no acervo, não carregado nas páginas novas.
- `tests/`: testes automatizados reproduzíveis.

A imagem da página inicial já existia no repositório (`assets/img/pages/home/cartao-vagas.jpg`). Não foram acrescentados depoimentos, métricas de contratação ou parceiros fictícios.
