const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../assets/js/nextgen-journey-core.js');
test('currículo aceita PDF e DOCX até 5 MiB e rejeita arquivos vazios ou diferentes',()=>{
 assert.equal(typeof core.validateResume,'function','validador de currículo deve existir');
 assert.equal(core.validateResume({name:'curriculo.pdf',size:400,type:'application/pdf'}),'');
 assert.equal(core.validateResume({name:'curriculo.DOCX',size:400,type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),'');
 assert.match(core.validateResume(null),/selecione/i);
 assert.match(core.validateResume({name:'vazio.pdf',size:0}),/vazio/i);
 assert.match(core.validateResume({name:'cv.pdf',size:5*1024*1024+1}),/5 MB/i);
 assert.match(core.validateResume({name:'cv.exe',size:20}),/PDF ou DOCX/i);
});
