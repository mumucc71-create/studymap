const test = require("node:test");
const assert = require("node:assert/strict");

const content = require("../english-learning-content-level1.js");
const validator = require("../english-learning-quality-validator.js");

test("영어 1단계는 10개 사이클과 120개 수동 저작 문항을 제공한다", () => {
  assert.equal(content.cycles.length, 10);
  assert.equal(content.problems.length, 120);
  content.cycles.forEach((cycle) => assert.equal(cycle.problems.length, 12));
});

test("영어 1단계 품질 계약 20개 항목을 모두 통과한다", () => {
  const report = validator.validateEnglishLevel1Content(content);
  assert.equal(report.valid, true, report.errors.join("\n"));
  assert.deepEqual(report.errors, []);
  assert.equal(report.stats.uniqueProblemIds, 120);
  assert.equal(report.stats.uniqueStructures, 120);
  assert.deepEqual(report.stats.correctIndexCounts, [30, 30, 30, 30]);
  assert.equal(report.stats.hintFreeIndependentChecks, 10);
  assert.ok(report.stats.misconceptionTagCount >= 50);
});

test("각 사이클은 어휘·문법·문장·독해·혼자 풀기를 연결한다", () => {
  for (const cycle of content.cycles) {
    const types = new Set(cycle.problems.map((problem) => problem.questionType));
    assert.ok(types.has("VOCABULARY_MEANING"));
    assert.ok(types.has("CONTEXT_VOCABULARY"));
    assert.ok(types.has("GRAMMAR_FORM"));
    assert.ok(types.has("SENTENCE_CHOICE"));
    assert.ok(types.has("SENTENCE_CONNECTION"));
    assert.ok(types.has("READING_DETAIL"));
    assert.ok(types.has("READING_REASON"));
    assert.ok(types.has("INDEPENDENT_CHECK"));
    for (const word of cycle.targetVocabularyIds) {
      const families = new Set(cycle.problems.filter((problem) => problem.targetVocabularyIds.includes(word)).map((problem) => problem.sentenceFamilyId));
      assert.ok(families.size >= 3, `${cycle.cycleId} ${word} 문맥 노출 부족`);
    }
  }
});

test("기계식 중복·역순 및 영어+한국어 조사 선택지는 없다", () => {
  const badAdjacent = /\b([A-Za-z]+)\s+\1\b/i;
  const mixedParticle = /[A-Za-z]+(?:을|를|은|는|이|가|와|과|에게|에서|으로|로)(?:\s|[.,!?]|$)/u;
  for (const problem of content.problems) {
    const surfaces = [problem.prompt, problem.passage, ...problem.choices];
    surfaces.forEach((surface) => {
      assert.doesNotMatch(surface, badAdjacent, problem.problemId);
      assert.doesNotMatch(surface, mixedParticle, problem.problemId);
    });
    assert.equal(problem.choices.filter((_, index) => index === problem.correctChoiceIndex).length, 1);
    problem.choiceMisconceptionTags.forEach((tag, index) => {
      if (index !== problem.correctChoiceIndex) assert.notEqual(tag, "CORRECT");
    });
  }
});
