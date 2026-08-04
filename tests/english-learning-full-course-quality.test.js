const test = require("node:test");
const assert = require("node:assert/strict");

const levels = [1,2,3,4,5].map((level)=>require(`../english-learning-content-level${level}.js`));
const spaced = require("../english-learning-spaced-review.js");
const remediation = require("../english-learning-remediation.js");
const validator = require("../english-learning-full-quality-validator.js");

test("English quality course contains 50 cycles and 600 balanced questions",()=>{
  levels.forEach((level)=>{
    assert.equal(level.cycles.length,10);
    assert.equal(level.problems.length,120);
    level.cycles.forEach((cycle)=>assert.equal(cycle.problems.length,12));
  });
  const plan=spaced.buildSpacedReviewPlan(levels);
  const report=validator.validateCourse(levels,{reviewPlan:plan});
  assert.equal(report.ok,true,report.issues.join("\n"));
  assert.equal(report.cycleCount,50);
  assert.equal(report.problemCount,600);
  assert.deepEqual(report.answerDistribution,[150,150,150,150]);
  assert.equal(report.distractorCount,1800);
  assert.equal(report.taggedDistractorCount,1800);
});

test("every cycle connects vocabulary, grammar, reading, transfer, and an independent check",()=>{
  for(const level of levels) for(const cycle of level.cycles){
    const types=new Set(cycle.problems.map((problem)=>problem.questionType));
    assert.ok(types.has("VOCABULARY_MEANING"),cycle.cycleId);
    assert.ok(types.has("CONTEXT_VOCABULARY"),cycle.cycleId);
    assert.ok(types.has("GRAMMAR_FORM"),cycle.cycleId);
    assert.ok(types.has("SENTENCE_EXPANSION"),cycle.cycleId);
    assert.ok(types.has("SENTENCE_CONNECTION"),cycle.cycleId);
    assert.ok(cycle.problems.some((problem)=>problem.passage),cycle.cycleId);
    assert.equal(cycle.problems.filter((problem)=>problem.independentCheck).length,1,cycle.cycleId);
  }
});

test("spaced review supplies same-cycle, +1, +3, +7, and next-level checkpoints",()=>{
  const plan=spaced.buildSpacedReviewPlan(levels);
  const summary=spaced.summarizeWordExposure(levels,plan);
  const targetWords=new Set(levels.flatMap((level)=>level.cycles.flatMap((cycle)=>cycle.targetVocabularyIds)));
  const labelsFor=(word)=>new Set(plan.filter((problem)=>problem.reviewVocabularyIds.includes(word)).map((problem)=>problem.reviewCheckpoint));
  for(const level of levels) for(const cycle of level.cycles) for(const word of cycle.targetVocabularyIds){
    const labels=labelsFor(word);
    ["SAME_CYCLE_LATE","PLUS_1","PLUS_3","PLUS_7"].forEach((label)=>assert.ok(labels.has(label),`${word}:${label}`));
  }
  assert.ok(summary.filter((item)=>targetWords.has(item.word)).every((item)=>item.reviewExposureCount>=4));
  ["lunch","trip","arrive"].forEach((word)=>assert.ok(labelsFor(word).size>=4,word));
});

test("remediation never repeats the failed problem and returns after two different families",()=>{
  const problems=levels[1].problems;
  const source=problems.find((problem)=>problem.questionType==="GRAMMAR_FORM");
  let state=remediation.createRemediationState();
  let result=remediation.recordEnglishError(state,{problemId:source.problemId,misconceptionTag:"TENSE_ERROR"},problems);
  assert.equal(result.decision,"RECHECK");
  assert.notEqual(result.problem.problemId,source.problemId);
  state=result.state;
  const second=problems.find((problem)=>problem.problemId===result.problem.problemId);
  result=remediation.recordEnglishError(state,{problemId:second.problemId,misconceptionTag:"TENSE_ERROR"},problems);
  assert.equal(result.decision,"START_REMEDIATION");
  assert.equal(new Set(result.problems.map((problem)=>problem.sentenceFamilyId)).size,2);
  state=result.state;
  for(const problem of result.problems){
    const answered=remediation.recordRemediationAnswer(state,problem,true);
    state=answered.state;
    if(answered.decision==="RETURN_TO_CYCLE") assert.equal(answered.checkpoint.problemId,second.problemId);
  }
  assert.equal(state.active,null);
});

test("level 5 has ten original articles and at least thirty TOEFL-style tasks",()=>{
  const level5=levels[4];
  assert.equal(level5.cycles.filter((cycle)=>cycle.problems.some((problem)=>problem.articleTitle)).length,10);
  assert.ok(level5.problems.filter((problem)=>problem.questionType==="TOEFL_READING").length>=30);
  assert.ok(level5.cycles.slice(4).every((cycle)=>cycle.problems.find((problem)=>problem.passage).passage.split(/\s+/).length>=180));
});
