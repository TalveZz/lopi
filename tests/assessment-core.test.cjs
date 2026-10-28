'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const modulePath = path.join(__dirname, '../assets/js/nextgen-assessment-core.js');
const core = () => require(modulePath);
const correctAnswers = course => Object.fromEntries(course.tasks.map(task => [task.id, String(task.expected)]));
const wrongAnswer = task => task.type === 'choice' ? String((task.expected + 1) % task.options.length) : task.type === 'number' ? String(task.expected + 1) : 'formato_incorreto';

test('nove cursos recebem 100 com respostas corretas e zero com respostas incorretas válidas', () => {
  const { courses, evaluate } = core();
  assert.equal(typeof evaluate, 'function');
  for (const course of courses) {
    const answers = correctAnswers(course);
    const before = JSON.stringify(answers);
    const result = evaluate(course.id, answers);
    assert.equal(result.score, 100, course.id);
    assert.equal(result.passed, true);
    assert.equal(result.maxScore, 100);
    assert.equal(result.breakdown.length, 3);
    assert.equal(JSON.stringify(answers), before);
    for (const [index, item] of result.breakdown.entries()) {
      const task = course.tasks[index];
      assert.deepEqual(item, { id: task.id, label: task.label, points: task.points, maxPoints: task.points, correct: true, response: answers[task.id], expected: task.expected, feedback: task.feedback });
    }
    const wrong = Object.fromEntries(course.tasks.map(task => [task.id, wrongAnswer(task)]));
    const failed = evaluate(course.id, wrong);
    assert.equal(failed.score, 0, course.id);
    assert.equal(failed.passed, false);
    assert.ok(failed.breakdown.every(item => !item.correct && item.points === 0 && item.maxPoints > 0));
    const partial = { ...answers, [course.tasks[0].id]: wrongAnswer(course.tasks[0]) };
    assert.equal(evaluate(course.id, partial).score, 70);
    assert.equal(evaluate(course.id, partial).passed, false);
    const middleWrong = { ...answers, [course.tasks[1].id]: wrongAnswer(course.tasks[1]) };
    assert.equal(evaluate(course.id, middleWrong).score, 60);
  }
});

test('curso desconhecido e mapa ausente geram erros localizados', () => {
  const { evaluate } = core();
  for (const id of ['inexistente', '__proto__', undefined, null, {}, 0]) assert.throws(() => evaluate(id, {}), /Curso não encontrado/);
  for (const answers of [undefined, null, [], true, 'respostas', 42]) assert.throws(() => evaluate('excel', answers), /respostas.*mapa/i);
});

test('toda tarefa objetiva exige resposta própria, não vazia e com tipo válido', () => {
  const { courses, evaluate } = core();
  for (const course of courses) {
    for (const task of course.tasks) {
      const correct = correctAnswers(course);
      const missing = { ...correct };
      delete missing[task.id];
      assert.throws(() => evaluate(course.id, missing), /Responda.*obrigatória/i);
      assert.throws(() => evaluate(course.id, Object.assign(Object.create({ [task.id]: task.expected }), missing)), /Responda.*obrigatória/i);
      for (const bad of [undefined, null, '', ' \n\t ', true, false, [], {}, () => 1, NaN, Infinity, -Infinity]) {
        assert.throws(() => evaluate(course.id, { ...correct, [task.id]: bad }), /responda|resposta|número|opção/i, `${course.id}/${task.id}: ${String(bad)}`);
      }
      if (task.type === 'text') assert.throws(() => evaluate(course.id, { ...correct, [task.id]: 123 }), /texto/i);
    }
  }
});

test('escolhas aceitam índice inteiro number ou string, nunca índice fora da lista', () => {
  const { courses, evaluate } = core();
  for (const course of courses) for (const task of course.tasks.filter(t => t.type === 'choice')) {
    const answers = correctAnswers(course);
    for (const value of [task.expected, ` ${task.expected} `]) assert.equal(evaluate(course.id, { ...answers, [task.id]: value }).score, 100);
    for (const value of [-1, task.options.length, 0.5, '1.0', '1abc', '0x1', '1e0', 'NaN', 'Infinity']) {
      assert.throws(() => evaluate(course.id, { ...answers, [task.id]: value }), /opção/i);
    }
  }
});

test('números aceitam decimal brasileiro e tolerância de arredondamento, sem conversão permissiva', () => {
  const { courses, evaluate } = core();
  for (const course of courses) for (const task of course.tasks.filter(t => t.type === 'number')) {
    const answers = correctAnswers(course);
    for (const value of [task.expected, ` ${String(task.expected).replace('.', ',')} `, `+${task.expected}`, task.expected + Number.EPSILON * task.expected]) {
      assert.equal(evaluate(course.id, { ...answers, [task.id]: value }).score, 100);
    }
    for (const value of ['12abc', 'Infinity', 'NaN', '0x20', '1e2', '1/2', '1+2', '1.234,56', '1,2.3', 'R$ 49,50', '--12', '2 0', '9'.repeat(400)]) {
      assert.throws(() => evaluate(course.id, { ...answers, [task.id]: value }), /número/i, value);
    }
    assert.equal(evaluate(course.id, { ...answers, [task.id]: String(task.expected + 0.001) }).score, 100 - task.points);
    assert.equal(evaluate(course.id, { ...answers, [task.id]: '-12,50' }).score, 100 - task.points);
  }
});

test('nomes e fórmulas exigem formato literal: palavras-chave não dão pontos', () => {
  const { courses, evaluate } = core();
  for (const course of courses) for (const task of course.tasks.filter(t => t.type === 'text')) {
    const answers = correctAnswers(course);
    assert.equal(evaluate(course.id, { ...answers, [task.id]: `  ${task.expected}  ` }).score, 100);
    for (const value of [task.expected.toLowerCase(), `Use ${task.expected} com segurança`, task.expected + '.txt', 'organização segurança inclusão soma atendimento']) {
      assert.equal(evaluate(course.id, { ...answers, [task.id]: value }).score, 100 - task.points);
    }
  }
});

test('evidência valida somente tamanho após trim: de 60 a 4000 caracteres', () => {
  const { validateEvidence } = core();
  assert.equal(typeof validateEvidence, 'function');
  for (const value of [undefined, null, 60, true, {}, []]) assert.match(validateEvidence(value), /texto/i);
  for (const value of ['', '   ', 'a'.repeat(59), `  ${'b'.repeat(59)}  `]) assert.match(validateEvidence(value), /60/);
  for (const value of ['a'.repeat(60), 'b'.repeat(4000), ` \n${'c'.repeat(60)}\n `]) assert.equal(validateEvidence(value), '');
  assert.match(validateEvidence('d'.repeat(4001)), /4000/);
});

test('evidência não recebe nota, não depende de palavras-chave e não altera resultado objetivo', () => {
  const { courses, evaluate, validateEvidence } = core();
  const neutral = 'Relato independente para revisão de uma pessoa, sem termos esperados pelo sistema.';
  const keywordRich = 'segurança inclusão organização habilidade competência autonomia soma estoque comunicação '.repeat(2);
  assert.equal(validateEvidence(neutral), '');
  assert.equal(validateEvidence(keywordRich), '');
  assert.match(validateEvidence('segurança inclusão habilidade'), /60/);
  for (const course of courses) {
    const answers = correctAnswers(course);
    const result = evaluate(course.id, answers);
    assert.deepEqual(evaluate(course.id, { ...answers, evidence: neutral }), result);
    assert.deepEqual(evaluate(course.id, { ...answers, evidence: keywordRich }), result);
    assert.equal(Object.hasOwn(result, 'evidenceScore'), false);
    assert.equal(Object.hasOwn(result, 'humanReviewed'), false);
  }
});

test('exportação funciona como CommonJS e window.NextGenAssessment sem DOM ou rede', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(modulePath, 'utf8'), context);
  const browserCore = context.window.NextGenAssessment;
  assert.deepEqual(Object.keys(browserCore).sort(), ['courses', 'evaluate', 'validateEvidence']);
  assert.equal(browserCore.courses.length, core().courses.length);
  const course = browserCore.courses.find(item => item.id === 'excel');
  assert.equal(browserCore.evaluate(course.id, correctAnswers(course)).score, 100);
  assert.equal(browserCore.validateEvidence('x'.repeat(60)), '');
});

test('catálogo contém nove práticas originais com preparação e critérios observáveis', () => {
  assert.ok(fs.existsSync(modulePath), 'módulo de avaliação prática ainda não implementado');
  const { courses } = require(modulePath);
  assert.deepEqual(courses.map(c => c.id), ['aprendiz', 'informatica', 'excel', 'atendimento', 'logistica', 'acessibilidade', 'suporte', 'caixa', 'comunicacao']);
  for (const course of courses) {
    for (const field of ['title', 'skill', 'brief', 'evidencePrompt']) assert.equal(typeof course[field], 'string');
    assert.equal(course.learn.length, 3);
    assert.equal(course.rubric.length, 3);
    assert.equal(course.tasks.length, 3);
    assert.deepEqual(course.tasks.map(t => t.points), [30, 40, 30]);
    assert.equal(course.tasks.reduce((sum, task) => sum + task.points, 0), 100);
    assert.equal(new Set(course.tasks.map(t => t.id)).size, 3);
    for (const text of [...course.learn, ...course.rubric]) assert.ok(typeof text === 'string' && text.length > 30);
    assert.match(course.evidencePrompt, /revisão humana/i);
    assert.doesNotMatch(course.title, /certificad|verificad/i);
    for (const task of course.tasks) {
      assert.ok(['number', 'choice', 'text'].includes(task.type));
      assert.ok(task.label.length > 25);
      assert.ok(task.feedback.length > 25);
      assert.ok(Object.hasOwn(task, 'expected'));
      if (task.type === 'choice') {
        assert.ok(task.options.length >= 3);
        assert.ok(task.options.every(option => typeof option === 'string'));
        assert.ok(Number.isInteger(task.expected) && task.expected >= 0 && task.expected < task.options.length);
      }
    }
  }
  for (const id of ['informatica', 'excel', 'logistica', 'suporte', 'caixa']) {
    assert.ok(courses.find(c => c.id === id).tasks.some(t => ['number', 'text'].includes(t.type)), id);
  }
});
