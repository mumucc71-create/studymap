const test = require("node:test");
const assert = require("node:assert/strict");
const mapper = require("../math-level-test-concept-mapper.js");

test("학년별 레벨테스트 문제를 세부 canonical conceptId로 매핑한다", () => {
  assert.deepEqual(mapper.mapLevelTestQuestionToConceptIds({ conceptId: "m3_quadratic_formula" }).canonicalConceptIds, ["m3_quadratic_formula"]);
  assert.deepEqual(mapper.mapLevelTestQuestionToConceptIds({ concept: "정수와 유리수" }).canonicalConceptIds, ["integers_rationals"]);
});
test("광역 단원 ID는 세부 개념 전체 숙달로 확장하지 않는다", () => {
  const mapped = mapper.mapLevelTestQuestionToConceptIds({ conceptId: "quadratic_equation" });
  assert.equal(mapped.status, "UNIT_ALIAS_ONLY");
  assert.equal(mapped.canonicalConceptIds.length, 0);
  assert.equal(mapped.targetConceptIds.length, 6);
  const evidence = mapper.convertLevelTestResultToEvidence({ problemId: "broad-1", conceptId: "quadratic_equation", correct: true });
  assert.equal(evidence[0].canonicalConceptId, null);
  assert.equal(evidence[0].unitAliasId, "quadratic_equation");
});

test("직접 alias는 canonical ID로 변환한다", () => {
  const mapped = mapper.mapLevelTestQuestionToConceptIds({ conceptId: "integer_rational" });
  assert.deepEqual(mapped.canonicalConceptIds, ["integers_rationals"]);
});

test("unknown ID는 안전한 증거로 남고 세부 숙달을 만들지 않는다", () => {
  const evidence = mapper.convertLevelTestResultToEvidence({ problemId: "unknown-1", conceptId: "not_registered", correct: true });
  assert.equal(evidence[0].status, "UNKNOWN_CONCEPT");
  assert.equal(evidence[0].canonicalConceptId, null);
  assert.deepEqual(mapper.calculateInitialConceptMastery(evidence), {});
});

test("동일 submissionId는 레벨테스트 증거에 한 번만 반영한다", () => {
  const item = mapper.convertLevelTestResultToEvidence({ problemId: "same", conceptId: "m3_sqrt_meaning", correct: true, submissionId: "submission-1" })[0];
  assert.equal(mapper.mergeLevelTestEvidence([item], [item]).length, 1);
});

test("REVIEW_REQUIRED는 최초 숙달 증거로 사용하지 않는다", () => {
  const evidence = mapper.convertLevelTestResultToEvidence({ problemId: "review", conceptId: "m3_sqrt_meaning", result: "REVIEW_REQUIRED" });
  const mastery = mapper.calculateInitialConceptMastery(evidence);
  assert.equal(mastery.m3_sqrt_meaning.correctCount, 0);
  assert.equal(mastery.m3_sqrt_meaning.status, "ENTRY_CHECK");
});

test("최초 위치는 증거가 있는 COMPLETE_SPRING의 부분 학습 개념을 우선한다", () => {
  const results = [
    { problemId: "legacy", conceptId: "linear_equation", correct: false },
    { problemId: "spring-a", conceptId: "m3_quadratic_meaning", correct: true },
    { problemId: "spring-b", conceptId: "m3_quadratic_meaning", correct: false },
  ];
  const evidence = results.flatMap((result) => mapper.convertLevelTestResultToEvidence(result));
  const selection = mapper.selectInitialLearningConcept(evidence, { selectedGrade: "중등 3학년" });
  assert.equal(selection.activeConceptId, "m3_quadratic_meaning");
  assert.equal(selection.selectedGrade, "중등 3학년");
});

test("콘텐츠 없는 최초 후보는 자동 진입하지 않고 가장 가까운 스프링 노드를 선택한다", () => {
  const evidence = mapper.convertLevelTestResultToEvidence({ problemId: "high", conceptId: "trigonometric_function", correct: false });
  const selection = mapper.selectInitialLearningConcept(evidence);
  assert.notEqual(selection.activeConceptId, "trigonometric_function");
  assert.ok(selection.blockedCandidates.includes("trigonometric_function"));
});
