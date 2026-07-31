const test = require("node:test");
const assert = require("node:assert/strict");
const runtime = require("../math-concept-graph-runtime.js");
const ui = require("../math-concept-graph-ui.js");

function wrong(state, suffix, tag = "FACTORIZATION_FAILURE") {
  return ui.applyFinalSubmission(state, {
    conceptId: "m3_quadratic_factor_solve", problemId: `q-${suffix}`,
    structureSignature: `s-${suffix}`, solutionPathSignature: `p-${suffix}`, stage: "A2",
    result: "INCORRECT", misconceptionTags: [tag], finalSubmission: true,
    submissionId: `sub-${suffix}`, timestamp: suffix,
  });
}

test("학생 상태는 지정된 다섯 한국어 항목만 만든다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 0 });
  const view = ui.buildStudentViewModel(state);
  assert.deepEqual(view.items.map((item) => item.label), ["현재 학습", "먼저 복습할 개념", "기초 보충", "다음 도전", "원래 학습으로 돌아가기"]);
});

test("학생 상태에 internalGradeBand·scopeId·canonical ID·cloud key를 노출하지 않는다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 0 });
  const serialized = JSON.stringify(ui.buildStudentViewModel(state));
  ["internalGradeBand", "scopeId", "canonical", "cloudKey", "M3_QUADRATIC"].forEach((term) => assert.equal(serialized.includes(term), false));
});

test("한 번 오답으로는 하강하지 않는다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve", timestamp: 0 });
  const next = wrong(state, 1);
  assert.equal(next.activeConceptId, "m3_quadratic_factor_solve");
  assert.equal(next.recoveryStack.length, 0);
});

test("다른 구조에서 같은 오류가 반복되면 직접 보충 개념으로 하강한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve", timestamp: 0 });
  state = wrong(state, 1);
  state = wrong(state, 2);
  assert.ok(["m3_common_factor", "m3_factor_perfect_square", "m3_factor_difference_squares", "m3_factor_sum_product"].includes(state.activeConceptId));
  assert.equal(state.recoveryStack.length, 1);
  assert.equal(ui.recommendationFor(state), "START_REMEDIAL");
});

test("동일 submissionId의 FINAL은 중복 증거로 계산하지 않는다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve", timestamp: 0 });
  const detail = { conceptId: "m3_quadratic_factor_solve", problemId: "q", structureSignature: "s", solutionPathSignature: "p",
    stage: "BASIC", result: "CORRECT", finalSubmission: true, submissionId: "same", timestamp: 1 };
  const once = ui.applyFinalSubmission(state, detail);
  const twice = ui.applyFinalSubmission(once, detail);
  assert.equal(twice, once);
});

test("REVIEW_REQUIRED는 정답 숙달 증거로 계산하지 않는다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 0 });
  const next = ui.applyFinalSubmission(state, { conceptId: "m3_quadratic_meaning", problemId: "written", structureSignature: "ws", solutionPathSignature: "wp",
    result: "REVIEW_REQUIRED", finalSubmission: true, submissionId: "review", timestamp: 1 });
  assert.equal(next.masteryByConcept.m3_quadratic_meaning.correctStructureIds.length, 0);
});

test("콘텐츠가 없는 개념은 내부 오류 대신 자연스러운 안내를 표시한다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "trigonometric_function", timestamp: 0 });
  const view = ui.buildStudentViewModel(state);
  assert.match(view.notice, /준비 중인 개념/);
  assert.match(view.notice, /가장 가까운 학습/);
});

test("상승은 추천 상태만 만들며 activeConceptId를 강제로 바꾸지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 0 });
  state = runtime.markMastered(state, "m3_quadratic_meaning", { timestamp: 1 });
  const before = state.activeConceptId;
  ui.buildStudentViewModel(state);
  assert.equal(state.activeConceptId, before);
});
