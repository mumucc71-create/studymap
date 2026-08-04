const test=require("node:test");
const assert=require("node:assert/strict");
const adapter=require("../english-learning-placement-adapter.js");

function storage(){const data=new Map();return{setItem:(k,v)=>data.set(k,String(v)),getItem:(k)=>data.get(k)||null,removeItem:(k)=>data.delete(k)};}

test("legacy diagnostic ranks map to quality levels and real cycle ids",()=>{
  assert.equal(adapter.rankToQualityLevel(1),1);
  assert.equal(adapter.rankToQualityLevel(5),3);
  assert.equal(adapter.rankToQualityLevel(12),5);
  const result=adapter.createPlacementRecommendation({levelId:"EN-L08",weakGrammarIds:["relative_clause"],weakVocabularyIds:["source"],readingConfidence:72,timestamp:1});
  assert.equal(result.recommendedLevel,4);
  assert.equal(result.recommendedCycleId,"EN-L4-CYCLE-01");
  assert.deepEqual(result.weakGrammarIds,["relative_clause"]);
  assert.equal(result.status,"PENDING_STUDENT_ACCEPTANCE");
});

test("placement remains pending until the student accepts learning start",()=>{
  const store=storage();
  const result=adapter.createPlacementRecommendation({levelId:"EN-L11",readingConfidence:90,inferenceEvidenceCount:4,timestamp:1});
  adapter.savePending(store,result);
  assert.deepEqual(adapter.loadPending(store),result);
  adapter.clearPending(store);
  assert.equal(adapter.loadPending(store),null);
});

test("English Elite is optional and recommended only with stable upper-level evidence",()=>{
  assert.equal(adapter.createPlacementRecommendation({levelId:"EN-L12",readingConfidence:90,inferenceEvidenceCount:4}).recommendElite,true);
  assert.equal(adapter.createPlacementRecommendation({levelId:"EN-L12",readingConfidence:70,inferenceEvidenceCount:4}).recommendElite,false);
  assert.equal(adapter.createPlacementRecommendation({levelId:"EN-L12",readingConfidence:90,inferenceEvidenceCount:4,weakGrammarIds:["conditional"]}).recommendElite,false);
});
