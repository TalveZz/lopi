const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const corePath=path.join(__dirname,'../assets/js/nextgen-journey-core.js');
test('teste por área exige todas as respostas e aprova somente com 80%',()=>{
 assert.ok(fs.existsSync(corePath),'módulo de avaliação deve existir');
 const core=require(corePath);
 for(const area of ['administracao','atendimento','tecnologia']){
  const questions=core.questions[area]; assert.equal(questions.length,5);
  const correct=questions.map(q=>q.correct);
  assert.throws(()=>core.evaluate(area,[0]),/todas/i);
  assert.deepEqual(core.evaluate(area,correct),{score:100,passed:true,total:5,correct:5});
  const wrong=correct.map((x,i)=>i<2?(x+1)%questions[i].options.length:x);
  assert.equal(core.evaluate(area,wrong).passed,false);
  const four=correct.map((x,i)=>i===0?(x+1)%questions[i].options.length:x);
  assert.equal(core.evaluate(area,four).score,80);
  assert.equal(core.evaluate(area,four).passed,true);
  assert.throws(()=>core.evaluate(area,[99,0,0,0,0]),/inválida/i);
 }
 assert.throws(()=>core.evaluate('unknown',[]),/área/i);
});
