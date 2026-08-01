const test = require("node:test");
const assert = require("node:assert/strict");

const model = require("../math-level-test-question-model.js");
const mapper = require("../math-level-test-concept-mapper.js");

test("공통 레벨테스트 문제는 필수 스키마와 기존 퀴즈 UI 호환 필드를 가진다", () => {
  const question = model.createLevelTestQuestion({
    questionId: "schema-1",
    conceptId: "large_numbers",
    grade: "초4",
    unit: "큰 수",
    difficulty: 2,
    questionText: "십만보다 1 큰 수는?",
    choices: ["100001", "10001", "99999", "110000"],
    answer: "100001",
    misconceptionTags: ["PLACE_VALUE_ERROR"],
    prerequisiteConcepts: ["place_value"],
    estimatedSolveTime: 30,
  }, { testGradeBand: "G4" });
  assert.equal(question.canonicalConceptId, "large_numbers");
  assert.equal(question.answerType, "MULTIPLE_CHOICE");
  assert.equal(question.problem, question.prompt);
  assert.equal(question.answer, "100001");
  assert.equal(model.validateLevelTestQuestion(question).valid, true);
});

test("숫자만 바뀐 동일 구조는 숙달 증거로 한 번만 합친다", () => {
  const base = {
    canonicalConceptId: "large_numbers",
    unitAliasId: null,
    evidenceScope: "CANONICAL_CONCEPT",
    result: "CORRECT",
    structureSignature: "large-number-place-value",
    solutionPathSignature: "place-value-read",
  };
  const merged = model.mergeCanonicalEvidence([], [
    { ...base, problemId: "a", submissionId: "submission-a" },
    { ...base, problemId: "b", submissionId: "submission-b" },
  ]);
  assert.equal(merged.length, 1);
});

test("광역 alias는 세부 숙달이 아닌 unit entry evidence로만 변환한다", () => {
  const question = model.createLevelTestQuestion({
    questionId: "broad-qe",
    conceptId: "quadratic_equation",
    grade: "중3",
    questionText: "이차방정식의 뜻은?",
    choices: ["A", "B"],
    answer: "A",
  }, { testGradeBand: "M3" });
  const evidence = model.toCanonicalEvidence(question, { result: "CORRECT", timestamp: 1 });
  assert.equal(question.canonicalConceptId, null);
  assert.equal(evidence.evidenceScope, "UNIT_ENTRY");
  assert.equal(evidence.unitAliasId, "quadratic_equation");
});

test("mapper도 동일 canonical 구조의 숫자 치환 제출을 중복 집계하지 않는다", () => {
  const first = mapper.convertLevelTestResultToEvidence({ problemId: "n1", conceptId: "large_numbers", correct: true, structureSignature: "same-structure", submissionId: "s1" }, { testGradeBand: "G4" });
  const second = mapper.convertLevelTestResultToEvidence({ problemId: "n2", conceptId: "large_numbers", correct: true, structureSignature: "same-structure", submissionId: "s2" }, { testGradeBand: "G4" });
  assert.equal(mapper.mergeLevelTestEvidence(first, second).length, 1);
});

test("세부 canonical 증거가 없으면 임의로 중3 제곱근을 activeConceptId로 만들지 않는다", () => {
  const lower = mapper.convertLevelTestResultToEvidence({ problemId: "g4", conceptId: "large_numbers", correct: false }, { testGradeBand: "G4" });
  const selection = mapper.selectInitialLearningConcept(lower, { selectedGrade: "초등 4학년" });
  assert.equal(selection.activeConceptId, null);
  assert.equal(selection.status, "BLOCKED_NO_CONTENT");
  assert.notEqual(selection.recommendedConceptId, "m3_sqrt_meaning");
});
