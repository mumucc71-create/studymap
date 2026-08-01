const test = require("node:test");
const assert = require("node:assert/strict");

const runtime = require("../math-adaptive-level-test-runtime.js");
const gates = require("../math-adaptive-level-test-grade-gates.js");
const resultApi = require("../math-adaptive-level-test-result.js");

function question(gradeGate, domainId, conceptId, suffix, options = {}) {
  return {
    problemId: `${gradeGate}-${domainId}-${suffix}`,
    canonicalConceptId: conceptId,
    structureSignature: `${gradeGate}:${domainId}:structure:${suffix}`,
    solutionPathSignature: `${gradeGate}:${domainId}:path:${suffix}`,
    misconceptionTags: options.misconceptionTags || [],
    difficulty: options.difficulty || "BASIC",
    independentCheck: options.independentCheck === true,
    estimatedSolveTime: options.estimatedSolveTime || 60,
  };
}

function record(state, q, result, misconceptionTags = q.misconceptionTags) {
  return runtime.recordEvidence(state, q, { result, misconceptionTags, finalSubmission: true, timestamp: state.revision + 1 });
}

test("기본 적응형 진단은 모든 학생에게 초4 게이트에서 시작한다", () => {
  const state = runtime.createInitialState({ timestamp: 1 });
  assert.equal(state.mode, "ADAPTIVE_FROM_G4");
  assert.equal(state.currentGradeGate, "G4");
  assert.equal(state.phase, "GRADE_GATE");
});

test("서로 다른 구조 2개를 맞히면 현재 영역만 통과한다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "a"), "CORRECT");
  assert.equal(state.currentDomain, domain.domainId);
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "b"), "CORRECT");
  assert.equal(state.domainStatusByGrade.G4[domain.domainId], "PASSED");
  assert.equal(state.currentDomain, gates.GRADE_GATES.G4[1].domainId);
  assert.equal(state.currentGradeGate, "G4");
});

test("정답과 오답이 섞이면 제3 확인 문제를 요구한다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "a"), "CORRECT");
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "b"), "INCORRECT");
  assert.equal(state.lastDecision.decision, "ASK_CONFIRMATION");
  assert.equal(state.pendingConfirmation.domainId, domain.domainId);
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "c"), "CORRECT");
  assert.equal(state.domainStatusByGrade.G4[domain.domainId], "PASSED");
});

test("한 번의 오답만으로 보충 진단이나 학년 하강을 확정하지 않는다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "a"), "INCORRECT");
  assert.equal(state.pendingRemediation, null);
  assert.equal(state.currentGradeGate, "G4");
  assert.equal(state.lastDecision.decision, "EVIDENCE_RECORDED");
});

test("반복 오류는 학년 전체가 아니라 직접 선수 개념만 선택한다", () => {
  let state = runtime.createInitialState({ overrides: { currentGradeGate: "M3", currentDomain: "QUADRATIC_EQUATION" } });
  const conceptId = "m3_quadratic_factor_solve";
  state = record(state, question("M3", "QUADRATIC_EQUATION", conceptId, "a", { misconceptionTags: ["FACTORIZATION_FAILURE"] }), "INCORRECT");
  state = record(state, question("M3", "QUADRATIC_EQUATION", conceptId, "b", { misconceptionTags: ["FACTORIZATION_FAILURE"] }), "INCORRECT");
  assert.equal(state.lastDecision.decision, "DIAGNOSE_PREREQUISITE");
  assert.equal(state.pendingRemediation.conceptId, "m3_factor_sum_product");
  assert.equal(state.currentGradeGate, "M3");
});

test("초4 하한에서는 더 낮은 학년으로 내리지 않고 내부 기초 확인을 유지한다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "a"), "INCORRECT");
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "b"), "INCORRECT");
  assert.equal(state.lastDecision.decision, "FOUNDATION_SUPPORT");
  assert.equal(state.pendingRemediation.conceptId, "large_numbers");
  assert.equal(state.currentGradeGate, "G4");
});

test("직접 선수 확인 2문항을 통과하면 원래 영역으로 복귀한다", () => {
  let state = runtime.createInitialState({ overrides: { currentGradeGate: "M3", currentDomain: "QUADRATIC_EQUATION" } });
  const source = "m3_quadratic_factor_solve";
  state = record(state, question("M3", "QUADRATIC_EQUATION", source, "a", { misconceptionTags: ["FACTORIZATION_FAILURE"] }), "INCORRECT");
  state = record(state, question("M3", "QUADRATIC_EQUATION", source, "b", { misconceptionTags: ["FACTORIZATION_FAILURE"] }), "INCORRECT");
  const remedial = state.pendingRemediation.conceptId;
  state = record(state, question("M3", "QUADRATIC_EQUATION", remedial, "r1"), "CORRECT");
  state = record(state, question("M3", "QUADRATIC_EQUATION", remedial, "r2"), "CORRECT");
  assert.equal(state.lastDecision.decision, "RETURN_TO_GATE");
  assert.equal(state.currentDomain, "QUADRATIC_EQUATION");
  assert.equal(state.pendingRemediation, null);
});

test("동일 문제 또는 동일 구조는 증거와 질문 수에 중복 계산하지 않는다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  const q = question("G4", domain.domainId, domain.conceptIds[0], "a");
  state = record(state, q, "CORRECT");
  const duplicateProblem = record(state, q, "CORRECT");
  const duplicateStructure = record(state, { ...q, problemId: `${q.problemId}-other` }, "CORRECT");
  assert.strictEqual(duplicateProblem, state);
  assert.strictEqual(duplicateStructure, state);
  assert.equal(state.totalQuestions, 1);
});

test("영역별 진단 신뢰도는 서로 독립적으로 저장된다", () => {
  let state = runtime.createInitialState();
  const first = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", first.domainId, first.conceptIds[0], "a"), "CORRECT");
  assert.ok(Object.hasOwn(state.confidenceByDomain, "G4:NUMBER_PLACE_VALUE"));
  assert.equal(Object.hasOwn(state.confidenceByDomain, "G4:MULTIPLICATION_DIVISION"), false);
});

test("24~36문항 및 20~30분 세션 종료 계약을 판정한다", () => {
  const minimum = runtime.createInitialState({ overrides: { totalQuestions: 24, estimatedDuration: 20, lastDecision: { decision: "PROMOTE_GRADE_GATE" } } });
  const maximum = runtime.createInitialState({ overrides: { totalQuestions: 36, estimatedDuration: 18 } });
  assert.deepEqual(runtime.shouldTerminate(minimum), { terminate: true, reason: "CURRENT_BOUNDARY_CONFIRMED" });
  assert.deepEqual(runtime.shouldTerminate(maximum), { terminate: true, reason: "SESSION_LIMIT_REACHED" });
});

test("직렬화와 복원은 상태를 보존하고 이전 상태를 직접 변경하지 않는다", () => {
  const initial = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  const next = record(initial, question("G4", domain.domainId, domain.conceptIds[0], "a"), "CORRECT");
  const hydrated = runtime.hydrateState(runtime.serializeState(next));
  assert.deepEqual(hydrated, next);
  assert.equal(initial.totalQuestions, 0);
  assert.equal(next.revision, 1);
});

test("학생용 결과에는 개념명과 요구된 다섯 항목만 노출한다", () => {
  let state = runtime.createInitialState();
  const domain = gates.GRADE_GATES.G4[0];
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "a"), "CORRECT");
  state = record(state, question("G4", domain.domainId, domain.conceptIds[0], "b"), "CORRECT");
  const result = resultApi.buildStudentResult(state);
  assert.deepEqual(Object.keys(result), ["잘 이해한 개념", "지금 시작할 학습", "먼저 보충할 개념", "다음에 도전할 개념", "영역별 진단 신뢰도"]);
  const serialized = JSON.stringify(result);
  assert.doesNotMatch(serialized, /internalGradeBand|scopeId|canonicalConceptId|currentGradeGate/);
});
