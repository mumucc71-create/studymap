const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

global.window = global;
require("../question-generators.js");
const runtime = require("../math-adaptive-level-test-runtime.js");
const selector = require("../math-adaptive-level-test-question-selector.js");
const gates = require("../math-adaptive-level-test-grade-gates.js");
const gradeBanks = require("../math-level-test-grade-banks.js");
const graph = require("../math-concept-graph-data.js");

const ROOT = path.resolve(__dirname, "..");
const protectedFiles = [
  "middle3-sqrt-learning-model.js", "middle3-sqrt-learning-content.js",
  "middle3-factorization-learning-model.js", "middle3-factorization-learning-content.js",
  "middle3-quadratic-equation-learning-model.js", "middle3-quadratic-equation-learning-content.js",
  "middle3-quadratic-learning-model.js", "middle3-quadratic-learning-content.js",
  "middle3-trigonometric-ratio-learning-model.js", "middle3-trigonometric-ratio-learning-content.js",
  "middle3-circle-properties-learning-model.js", "middle3-circle-properties-learning-content.js",
  "middle3-statistics-learning-model.js", "middle3-statistics-learning-content.js",
  "math-concept-graph-data.js", "math-concept-alias-registry.js",
];

const fileHashes = () => Object.fromEntries(protectedFiles.map((file) => [
  file,
  crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex"),
]));

function gateQuestion(gradeGate, domain, index) {
  return {
    problemId: `adaptive-${gradeGate}-${domain.domainId}-${index}`,
    canonicalConceptId: domain.conceptIds[index % domain.conceptIds.length],
    structureSignature: `adaptive:${gradeGate}:${domain.domainId}:structure:${index}`,
    solutionPathSignature: `adaptive:${gradeGate}:${domain.domainId}:path:${index}`,
    difficulty: index === 0 ? "BASIC" : "A1",
    misconceptionTags: [],
    independentCheck: index === 1,
    estimatedSolveTime: 45,
  };
}

function passCurrentGrade(state) {
  const grade = state.currentGradeGate;
  for (const domain of gates.getGateDomains(grade)) {
    state = runtime.recordEvidence(state, gateQuestion(grade, domain, 0), { result: "CORRECT", finalSubmission: true, timestamp: state.revision + 1 });
    state = runtime.recordEvidence(state, gateQuestion(grade, domain, 1), { result: "CORRECT", finalSubmission: true, timestamp: state.revision + 1 });
  }
  return state;
}

test("기존 학년별 문제은행은 보조 모드로 그대로 호출할 수 있다", () => {
  for (const grade of ["G4", "G5", "G6", "M1", "M2", "M3"]) {
    const session = gradeBanks.buildGradeTestSession({ selectedGrade: grade, generatedConceptBanks: global.generatedConceptBanks });
    assert.equal(session.status, "READY", grade);
    assert.ok(session.questions.length > 0, grade);
    assert.ok(session.questions.every((item) => item.testGradeBand === grade), grade);
  }
});

test("기본 적응형 선택기는 실제 초4 은행에서 초4 문제만 고른다", () => {
  const g4 = gradeBanks.buildGradeTestSession({ selectedGrade: "G4", generatedConceptBanks: global.generatedConceptBanks });
  const catalog = selector.createQuestionCatalog({ G4: g4 });
  const selected = runtime.getNextQuestion(runtime.createInitialState(), catalog);
  assert.equal(selected.status, "QUESTION_SELECTED");
  assert.equal(selected.gradeGate, "G4");
  assert.equal(selected.question.testGradeBand, "G4");
});

test("초4부터 중3까지 각 영역을 독립 통과하면 정해진 순서로 빠르게 상승한다", () => {
  let state = runtime.createInitialState();
  for (const expectedNext of ["G5", "G6", "M1", "M2", "M3"]) {
    state = passCurrentGrade(state);
    assert.equal(state.currentGradeGate, expectedNext);
  }
  state = passCurrentGrade(state);
  assert.equal(state.phase, "CONCEPT_GRAPH");
  assert.ok(state.activeConceptId?.startsWith("m3_"));
  assert.ok(state.graphState);
});

test("중3 게이트 뒤에는 기존 canonical graph가 상·하위 경계를 결정한다", () => {
  let state = runtime.createInitialState({ overrides: { currentGradeGate: "M3", currentDomain: gates.GRADE_GATES.M3[0].domainId } });
  state = passCurrentGrade(state);
  assert.equal(state.phase, "CONCEPT_GRAPH");
  assert.equal(state.graphState.graphVersion, graph.VERSION);
  assert.ok(state.upperBoundaryConcepts.every((conceptId) => graph.conceptById[conceptId]));
  assert.ok(state.blockedNoContentConceptIds.every((conceptId) => graph.conceptById[conceptId].contentAvailability !== "COMPLETE_SPRING"));
});

test("오답 영역만 보충 대상으로 삼고 다른 영역 상태는 바꾸지 않는다", () => {
  let state = runtime.createInitialState({ overrides: { currentGradeGate: "M3", currentDomain: "QUADRATIC_EQUATION" } });
  const domain = gates.getDomain("M3", "QUADRATIC_EQUATION");
  const q1 = { ...gateQuestion("M3", domain, 0), canonicalConceptId: "m3_quadratic_factor_solve", misconceptionTags: ["FACTORIZATION_FAILURE"] };
  const q2 = { ...gateQuestion("M3", domain, 1), canonicalConceptId: "m3_quadratic_factor_solve", misconceptionTags: ["FACTORIZATION_FAILURE"] };
  state = runtime.recordEvidence(state, q1, { result: "INCORRECT", misconceptionTags: q1.misconceptionTags, timestamp: 1 });
  state = runtime.recordEvidence(state, q2, { result: "INCORRECT", misconceptionTags: q2.misconceptionTags, timestamp: 2 });
  assert.equal(state.currentGradeGate, "M3");
  assert.equal(state.domainStatusByGrade.M3.QUADRATIC_EQUATION, "REMEDIAL_REQUIRED");
  assert.equal(state.domainStatusByGrade.M3.SQRT, undefined);
  assert.deepEqual(state.passedGradeGates, []);
});

test("고3은 최고 경계이며 대학 수학으로 이어지는 간선이 없다", () => {
  assert.equal(gates.UPPER_BOUNDARY, "H3");
  const high3 = Object.values(graph.conceptById).filter((node) => node.internalGradeBand === "H3");
  assert.ok(high3.length > 0);
  assert.ok(high3.every((node) => node.nextConceptIds.length === 0));
  assert.ok(high3.every((node) => node.maximumGradeBand === "H3"));
});

test("본 학습 상태와 승인 콘텐츠 파일은 적응형 진단으로 변경되지 않는다", () => {
  const before = fileHashes();
  const externalLearningState = Object.freeze({ scopeId: "MIDDLE3_SQRT", revision: 7, progress: 12 });
  let adaptive = runtime.createInitialState();
  adaptive = passCurrentGrade(adaptive);
  assert.deepEqual(externalLearningState, { scopeId: "MIDDLE3_SQRT", revision: 7, progress: 12 });
  assert.deepEqual(fileHashes(), before);
});
