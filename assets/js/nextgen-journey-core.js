/* Avaliação introdutória demonstrativa; não substitui avaliação profissional. */
(function(root,factory){ const api=factory(); if(typeof module==='object'&&module.exports) module.exports=api; else root.NextGenJourney=api; })(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const questions={
 administracao:[
 {text:'Você precisa organizar documentos de vários clientes. Qual é a melhor prática?',options:['Misturar todos em uma pasta','Separar por cliente e data, com nomes claros','Guardar apenas os mais recentes'],correct:1,explanation:'Uma classificação consistente facilita encontrar informações e evita confusões.'},
 {text:'Uma planilha tem valores nas células A1 até A5. Qual fórmula soma esses valores?',options:['=SOMA(A1:A5)','=A1+A5','=MEDIA(A1:A5)'],correct:0,explanation:'SOMA(A1:A5) inclui todas as células do intervalo.'},
 {text:'Duas tarefas têm o mesmo prazo, mas uma impede o trabalho da equipe. O que fazer?',options:['Ignorar o prazo','Escolher a mais fácil sem avisar','Priorizar a que bloqueia a equipe e alinhar os prazos'],correct:2,explanation:'Considere urgência e impacto, comunicando a prioridade à equipe.'},
 {text:'Você recebeu dados pessoais de um candidato. Como proceder?',options:['Compartilhar no grupo público','Restringir o acesso às pessoas autorizadas','Usar os dados para qualquer finalidade'],correct:1,explanation:'Dados pessoais devem ser acessados apenas por quem precisa deles para a finalidade informada.'},
 {text:'Você percebe um erro em um relatório enviado. Qual atitude é mais adequada?',options:['Comunicar e enviar uma versão corrigida','Esperar alguém perceber','Apagar o arquivo sem avisar'],correct:0,explanation:'Transparência e correção rápida ajudam a equipe a trabalhar com informações confiáveis.'}
 ],
 atendimento:[
 {text:'Um cliente está insatisfeito. Qual é o primeiro passo?',options:['Interromper para defender a empresa','Ouvir e confirmar que entendeu o problema','Encerrar o atendimento'],correct:1,explanation:'Escuta ativa ajuda a compreender a necessidade antes de propor uma solução.'},
 {text:'Você não sabe a resposta para uma dúvida. O que deve fazer?',options:['Inventar uma resposta','Dizer apenas que não sabe','Consultar a informação correta e combinar um retorno'],correct:2,explanation:'É melhor verificar do que transmitir uma orientação incorreta.'},
 {text:'Uma pessoa pede uma forma diferente de atendimento por acessibilidade. Como agir?',options:['Perguntar qual forma funciona melhor e buscar a adaptação','Pedir que outra pessoa fale por ela','Recusar por não ser o padrão'],correct:0,explanation:'A própria pessoa pode informar a adaptação de que precisa. Respeite sua autonomia.'},
 {text:'Como confirmar que a demanda foi resolvida?',options:['Presumir que o silêncio é aprovação','Confirmar com a pessoa e registrar o encaminhamento','Encerrar sem explicar'],correct:1,explanation:'Confirmar e registrar reduz dúvidas e permite acompanhar pendências.'},
 {text:'Você precisa explicar uma orientação complexa. Qual abordagem é melhor?',options:['Usar o máximo de siglas','Enviar uma mensagem sem contexto','Usar linguagem simples e explicar uma etapa por vez'],correct:2,explanation:'Linguagem clara e etapas curtas tornam a orientação mais fácil de acompanhar.'}
 ],
 tecnologia:[
 {text:'Um e-mail pede sua senha por um link desconhecido. O que fazer?',options:['Enviar a senha','Não abrir o link e verificar pelo canal oficial','Encaminhar a todos'],correct:1,explanation:'Pedidos inesperados de senha podem ser tentativas de fraude.'},
 {text:'Um programa parou de funcionar depois de uma mudança. Qual é o melhor início?',options:['Reinstalar todo o computador','Apagar os arquivos pessoais','Reproduzir o erro e examinar a mudança recente'],correct:2,explanation:'Reproduzir o problema e isolar a mudança ajuda a encontrar sua causa.'},
 {text:'Para que serve um backup?',options:['Recuperar dados em caso de perda','Acelerar qualquer conexão','Substituir todas as senhas'],correct:0,explanation:'Uma cópia de segurança permite recuperar dados perdidos ou danificados.'},
 {text:'Qual alternativa ajuda a tornar um site acessível?',options:['Usar apenas cores para informar erros','Permitir navegação por teclado e identificar os campos','Remover todos os textos das imagens'],correct:1,explanation:'Teclado e rótulos claros permitem utilizar os controles de diferentes formas.'},
 {text:'Como registrar um problema para a equipe de suporte?',options:['Dizer somente que não funciona','Enviar uma senha de acesso','Descrever passos, resultado esperado e mensagem de erro sem dados sensíveis'],correct:2,explanation:'Um relato reproduzível ajuda a investigar sem expor informações sensíveis.'}
 ]};
 function evaluate(area,answers){
  const items=questions[area]; if(!items) throw Error('Área inválida.');
  if(!Array.isArray(answers)||answers.length!==items.length||answers.some(a=>a===null||a===undefined)) throw Error('Responda todas as perguntas.');
  if(answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=items[i].options.length)) throw Error('Resposta inválida.');
  const correct=answers.filter((a,i)=>a===items[i].correct).length;
  const score=Math.round(correct/items.length*100);
  return {score,passed:score>=80,total:items.length,correct};
 }
 function validateResume(file){
  if(!file) return 'Selecione seu currículo.';
  if(!/\.(pdf|docx)$/i.test(file.name||'')) return 'Escolha um arquivo PDF ou DOCX.';
  if(!Number.isFinite(file.size)||file.size<=0) return 'O arquivo está vazio.';
  if(file.size>5*1024*1024) return 'O arquivo deve ter no máximo 5 MB.';
  return '';
 }
 return {questions,evaluate,validateResume};
});
