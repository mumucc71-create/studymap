const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const runtime = require("../math-concept-graph-runtime.js");
const stateApi = require("../math-concept-graph-runtime-state.js");
const graph = require("../math-concept-graph-data.js");

const root = path.resolve(__dirname, "..");
let sequence = 0;

function evidence(conceptId, result, tag, suffix, overrides = {}) {
  sequence += 1;
  return {
    conceptId,
    problemId: `${conceptId}-${suffix}-${sequence}`,
    structureSignature: `${conceptId}-structure-${suffix}`,
    solutionPathSignature: `${conceptId}-path-${suffix}`,
    stage: "A3",
    result,
    misconceptionTags: tag ? [tag] : [],
    independentCheck: false,
    finalSubmission: true,
    timestamp: sequence,
    ...overrides,
  };
}

function add(state, item) {
  return runtime.recordEvidence(state, item);
}

function addWrongPair(state, conceptId, tag, prefix = "wrong") {
  state = add(state, evidence(conceptId, "INCORRECT", tag, `${prefix}-1`));
  return add(state, evidence(conceptId, "INCORRECT", tag, `${prefix}-2`));
}

function addCorrectSet(state, conceptId, prefix = "correct", options = {}) {
  for (let index = 1; index <= 3; index += 1) {
    state = add(state, evidence(conceptId, "CORRECT", null, `${prefix}-${index}`, {
      independentCheck: index === 3,
      returnCheckpointPassed: options.returnCheckpointPassed === true && index === 3,
    }));
  }
  return state;
}

function seedMastery(ids) {
  return Object.fromEntries(ids.map((id) => [id, stateApi.createMasteryRecord({ status: "MASTERED" })]));
}

test("공개 함수와 상태 스키마가 오케스트레이터 계약을 제공한다", () => {
  const required = [
    "createInitialGraphState", "normalizeConceptId", "recordEvidence", "evaluateConceptStatus",
    "selectRemedialConcept", "beginRemediation", "evaluateRemediationCompletion", "returnToCheckpoint",
    "evaluateMastery", "selectPromotionConcept", "promoteConcept", "getAvailableNextConcepts",
    "getAvailableRemedialConcepts", "getStudentFacingStatus", "serializeGraphState", "hydrateGraphState",
  ];
  required.forEach((name) => assert.equal(typeof runtime[name], "function", name));
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve", timestamp: 10 });
  [
    "graphVersion", "activeConceptId", "activeUnitName", "activePath", "masteryByConcept",
    "evidenceByConcept", "misconceptionEvidence", "recoveryStack", "returnCheckpoint",
    "pendingRemedialConceptIds", "completedRemedialConceptIds", "promotionCandidates",
    "blockedCandidates", "lastDecision", "decisionHistory", "revision", "updatedAt",
  ].forEach((field) => assert.ok(Object.hasOwn(state, field), field));
});

test("이차방정식 인수분해 오류 1회로는 하강하지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = add(state, evidence(state.activeConceptId, "INCORRECT", "FACTORIZATION_FAILURE", "once"));
  assert.equal(runtime.selectRemedialConcept(state).decision, "STAY");
});

test("서로 다른 구조의 인수분해 오류 2회는 직접 인수분해 개념으로 하강한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = addWrongPair(state, state.activeConceptId, "FACTORIZATION_FAILURE");
  const selected = runtime.selectRemedialConcept(state);
  assert.equal(selected.decision, "DESCEND");
  assert.ok(["m3_factor_sum_product", "m3_factor_difference_squares"].includes(selected.toConceptId));
  const descended = runtime.beginRemediation(state, selected);
  assert.equal(descended.recoveryStack.length, 1);
  assert.equal(descended.activeConceptId, selected.toConceptId);
});

test("이차방정식 부호 오류 반복은 직접 지정된 정수·유리수 또는 문자식으로 보충한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_formula" });
  state = addWrongPair(state, state.activeConceptId, "SIGN_ERROR");
  const selected = runtime.selectRemedialConcept(state);
  assert.equal(selected.decision, "DESCEND");
  assert.ok(["integers_rationals", "expression"].includes(selected.toConceptId));
  assert.equal(selected.entryMode, "LEGACY_REMEDIATION");
});

test("이차방정식→인수분해→문자식 계산의 중첩 보충은 LIFO 순서를 유지한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = addWrongPair(state, state.activeConceptId, "FACTORIZATION_FAILURE", "quadratic");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  const factorId = state.activeConceptId;
  state = addWrongPair(state, factorId, "DISTRIBUTIVE_PROPERTY_FAILURE", "factor");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  assert.equal(state.recoveryStack.length, 2);
  assert.equal(state.recoveryStack[0].conceptId, "m3_quadratic_factor_solve");
  assert.equal(state.recoveryStack[1].conceptId, factorId);
  assert.ok(["expression", "algebra_expression"].includes(state.activeConceptId));
});

test("문자식 보충 완료 후 인수분해로 복귀한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_factor_sum_product" });
  state = addWrongPair(state, state.activeConceptId, "DISTRIBUTIVE_PROPERTY_FAILURE");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  const expressionId = state.activeConceptId;
  state = addCorrectSet(state, expressionId, "remedial");
  assert.equal(runtime.evaluateRemediationCompletion(state).complete, true);
  state = runtime.returnToCheckpoint(state);
  assert.equal(state.activeConceptId, "m3_factor_sum_product");
  assert.equal(state.masteryByConcept.m3_factor_sum_product.status, "RETURN_CHECK");
});

test("인수분해 복귀 확인 통과 후 외부 이차방정식 checkpoint로 복귀한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = addWrongPair(state, state.activeConceptId, "FACTORIZATION_FAILURE", "outer");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  const factorId = state.activeConceptId;
  state = addWrongPair(state, factorId, "DISTRIBUTIVE_PROPERTY_FAILURE", "inner");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  state = addCorrectSet(state, state.activeConceptId, "inner-remedial");
  state = runtime.returnToCheckpoint(state);
  state = addCorrectSet(state, factorId, "factor-return", { returnCheckpointPassed: true });
  state = runtime.returnToCheckpoint(state);
  assert.equal(state.activeConceptId, "m3_quadratic_factor_solve");
  assert.equal(state.recoveryStack.length, 1);
  assert.equal(state.recoveryStack[0].phase, "RETURN_CHECK");
});

test("원래 이차방정식 복귀 확인을 통과하면 recoveryStack을 비운다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = addWrongPair(state, state.activeConceptId, "FACTORIZATION_FAILURE");
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  state = addCorrectSet(state, state.activeConceptId, "factor-remedial");
  state = runtime.returnToCheckpoint(state);
  state = addCorrectSet(state, "m3_quadratic_factor_solve", "quadratic-return", { returnCheckpointPassed: true });
  state = runtime.returnToCheckpoint(state);
  assert.equal(state.recoveryStack.length, 0);
  assert.equal(state.activeConceptId, "m3_quadratic_factor_solve");
  assert.equal(state.masteryByConcept.m3_quadratic_factor_solve.misconceptionCounts.FACTORIZATION_FAILURE, 0);
});

test("복귀 확인에서 같은 오류가 재발하면 직전 보충으로 즉시 재진입하지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_factor_solve" });
  state = addWrongPair(state, state.activeConceptId, "FACTORIZATION_FAILURE", "initial");
  const originalRemedialId = runtime.selectRemedialConcept(state).toConceptId;
  state = runtime.beginRemediation(state, runtime.selectRemedialConcept(state));
  state = addCorrectSet(state, state.activeConceptId, "remedial-complete");
  state = runtime.returnToCheckpoint(state);
  state = add(state, evidence("m3_quadratic_factor_solve", "INCORRECT", "FACTORIZATION_FAILURE", "return-failure"));
  state = runtime.returnToCheckpoint(state);
  assert.equal(state.lastDecision.decision, "RETURN_CHECK_FAILED");
  assert.ok(!state.lastDecision.alternativeRemedialConceptIds.includes(originalRemedialId));
  assert.equal(state.activeConceptId, "m3_quadratic_factor_solve");
});

test("이차방정식 숙달 뒤 이차함수 전이 개념을 추천하고 승급한다", () => {
  const masteryByConcept = seedMastery(["m3_quadratic_root_meaning", "linear_equation"]);
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_word_setup", masteryByConcept });
  state = addCorrectSet(state, state.activeConceptId, "mastery");
  assert.equal(runtime.evaluateMastery(state).mastered, true);
  const selected = runtime.selectPromotionConcept(state);
  assert.equal(selected.decision, "PROMOTE");
  assert.equal(selected.toConceptId, "m3_quadratic_function_meaning");
  state = runtime.promoteConcept(state, selected);
  assert.equal(state.activeConceptId, "m3_quadratic_function_meaning");
});

test("삼각비 변 대응 오류 반복은 삼각비의 뜻으로 보충한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_length" });
  state = addWrongPair(state, state.activeConceptId, "SIDE_ROLE_CONFUSION");
  assert.equal(runtime.selectRemedialConcept(state).toConceptId, "m3_trig_meaning");
});

test("삼각비 피타고라스 오류 반복은 피타고라스 정리로 보충한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_length" });
  state = addWrongPair(state, state.activeConceptId, "PYTHAGOREAN_FAILURE");
  assert.equal(runtime.selectRemedialConcept(state).toConceptId, "m3_pythagorean_meaning");
});

test("표준편차의 분산 과정 오류는 편차·분산 개념으로 보충한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_statistics_standard_deviation" });
  state = addWrongPair(state, state.activeConceptId, "VARIANCE_PROCESS_FAILURE");
  assert.equal(runtime.selectRemedialConcept(state).toConceptId, "m3_statistics_variance");
});

test("통계의 근호 오류는 제곱근 개념으로 보충한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_statistics_standard_deviation" });
  state = addWrongPair(state, state.activeConceptId, "RADICAL_ERROR");
  assert.equal(runtime.selectRemedialConcept(state).toConceptId, "m3_sqrt_value");
});

test("NO_CONTENT 고등 노드는 자동 진입 후보에서 차단한다", () => {
  const masteryByConcept = seedMastery(["probability", "permutation_combination"]);
  let state = runtime.createInitialGraphState({ activeConceptId: "probability", masteryByConcept });
  const candidates = runtime.getAvailableNextConcepts(state);
  assert.ok(candidates.blocked.some((item) => item.conceptId === "probability_distribution" && item.reason === "AUTO_ENTRY_BLOCKED"));
  assert.ok(!candidates.available.some((item) => item.conceptId === "probability_distribution"));
});

test("콘텐츠 없는 미숙달 선수는 건너뛰지 않고 현재 개념의 진입 확인 대상으로 표시한다", () => {
  const masteryByConcept = seedMastery(["m3_statistics_standard_deviation"]);
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_statistics_standard_deviation", masteryByConcept });
  const candidates = runtime.getAvailableNextConcepts(state);
  const advanced = candidates.blocked.find((item) => item.conceptId === "advanced_statistics");
  assert.ok(advanced);
  assert.equal(advanced.reason, "AUTO_ENTRY_BLOCKED");
  assert.ok(advanced.entryCheckRequiredConceptIds.includes("probability_distribution"));
});

test("LEGACY_ONLY 노드는 자동 상승 진입을 기본 차단한다", () => {
  const masteryByConcept = seedMastery(["large_numbers"]);
  const state = runtime.createInitialGraphState({ activeConceptId: "large_numbers", masteryByConcept });
  const candidates = runtime.getAvailableNextConcepts(state);
  assert.ok(candidates.blocked.some((item) => item.contentAvailability === "LEGACY_ONLY"));
  assert.equal(candidates.available.length, 0);
});

test("초4 시작 노드에서 추가 하강 조건은 현재 개념 내부 기초 보충으로 처리한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "large_numbers" });
  state = add(state, evidence("large_numbers", "INCORRECT", "UNKNOWN_FOUNDATION", "g4-1"));
  state = add(state, evidence("large_numbers", "INCORRECT", "UNKNOWN_FOUNDATION", "g4-2"));
  const selected = runtime.selectRemedialConcept(state);
  assert.equal(selected.decision, "FOUNDATION_SUPPORT");
  assert.equal(selected.fromConceptId, "large_numbers");
});

test("고3 상한 노드 숙달 후 MAXIMUM_REACHED로 고정한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "calculus_applications" });
  state = addCorrectSet(state, state.activeConceptId, "h3");
  const selected = runtime.selectPromotionConcept(state);
  assert.equal(selected.decision, "MAXIMUM_REACHED");
  state = runtime.promoteConcept(state, selected);
  assert.equal(state.masteryByConcept.calculus_applications.status, "MAXIMUM_REACHED");
  assert.equal(state.activeConceptId, "calculus_applications");
});

test("동일 문제 FINAL 증거를 중복 제출해도 중복 계산하거나 revision을 올리지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning" });
  const item = evidence(state.activeConceptId, "CORRECT", null, "duplicate", { independentCheck: true });
  state = add(state, item);
  const revision = state.revision;
  const same = add(state, item);
  assert.equal(same, state);
  assert.equal(same.revision, revision);
  assert.equal(same.evidenceByConcept.m3_trig_meaning.length, 1);
});

test("REVIEW_REQUIRED는 숙달·승급 정답 증거로 사용하지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning" });
  for (let index = 1; index <= 4; index += 1) state = add(state, evidence(state.activeConceptId, "REVIEW_REQUIRED", null, `review-${index}`, { independentCheck: true }));
  const result = runtime.evaluateMastery(state);
  assert.equal(result.mastered, false);
  assert.equal(result.distinctStructures, 0);
});

test("직접 alias는 canonical ID로, 광역 alias는 세부 근거가 있을 때만 분배한다", () => {
  assert.equal(runtime.normalizeConceptId("integer_rational").canonicalConceptId, "integers_rationals");
  assert.equal(runtime.normalizeConceptId("quadratic_equation").status, "UNIT_ALIAS");
  assert.equal(runtime.normalizeConceptId("quadratic_equation", { detailConceptId: "m3_quadratic_formula" }).canonicalConceptId, "m3_quadratic_formula");
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_formula" });
  state = add(state, evidence("quadratic_equation", "CORRECT", null, "unit", { detailConceptId: undefined }));
  assert.equal(state.evidenceByConcept["@unit:quadratic_equation"].length, 1);
  assert.equal(state.masteryByConcept.m3_quadratic_formula.correctStructureIds.length, 0);
});

test("알 수 없는 ID 증거는 현재 개념과 기존 증거를 손상하지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning" });
  const before = state;
  state = add(state, evidence("not-a-concept", "CORRECT", null, "unknown"));
  assert.equal(state.activeConceptId, before.activeConceptId);
  assert.deepEqual(state.evidenceByConcept, before.evidenceByConcept);
  assert.equal(state.lastDecision.decision, "UNKNOWN_CONCEPT");
});

test("연속 상승은 prerequisite 순환 없이 activePath를 확장한다", () => {
  const masteryByConcept = seedMastery(["m3_trig_meaning", "ratio", "proportion", "m3_pythagorean_meaning"]);
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning", masteryByConcept });
  const selected = runtime.selectPromotionConcept(state);
  assert.equal(selected.decision, "PROMOTE");
  state = runtime.promoteConcept(state, selected);
  assert.equal(new Set(state.activePath).size, state.activePath.length);
  assert.notEqual(state.activeConceptId, "m3_trig_meaning");
});

test("같은 보충 pair는 반복 한도를 넘어 무한 재진입하지 않는다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_formula" });
  state = addWrongPair(state, state.activeConceptId, "SIGN_ERROR");
  const first = runtime.selectRemedialConcept(state);
  const fakeHistory = stateApi.mutableCopy(state);
  fakeHistory.decisionHistory.push(first, first);
  const guarded = stateApi.deepFreeze(fakeHistory);
  const selected = runtime.selectRemedialConcept(guarded);
  assert.notEqual(selected.toConceptId, first.toConceptId);
});

test("serialize 후 hydrate는 상태를 동일하게 복원한다", () => {
  let state = runtime.createInitialGraphState({ activeConceptId: "m3_statistics_mean", timestamp: 100 });
  state = addCorrectSet(state, state.activeConceptId, "roundtrip");
  const hydrated = runtime.hydrateGraphState(runtime.serializeGraphState(state));
  assert.deepEqual(hydrated, state);
  assert.ok(Object.isFrozen(hydrated));
});

test("모든 상태 변경은 revision을 증가시키고 이전 상태를 직접 변경하지 않는다", () => {
  const before = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning", timestamp: 1 });
  const snapshot = JSON.stringify(before);
  const after = add(before, evidence(before.activeConceptId, "CORRECT", null, "immutable"));
  assert.equal(JSON.stringify(before), snapshot);
  assert.equal(after.revision, before.revision + 1);
  assert.ok(Object.isFrozen(after));
});

test("학생 상태에는 지정된 한국어 정보만 있고 내부 학년대·scopeId를 노출하지 않는다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_trig_meaning" });
  const visible = runtime.getStudentFacingStatus(state);
  assert.deepEqual(Object.keys(visible), ["현재 학습", "먼저 복습할 개념", "기초 보충", "다음 도전", "원래 학습으로 돌아가기"]);
  assert.doesNotMatch(JSON.stringify(visible), /M3|gradeBand|scopeId/);
});

test("기존 중3 단원 런타임과 승인 콘텐츠 해시는 변경되지 않았다", () => {
  const expected = {
    "middle3-sqrt-learning-model.js": "54A7CE5F72EDD390A98E9EEC84BA42E7BF6A2BDD9915FF3A6CB1C5DA193C91FC",
    "middle3-factorization-learning-model.js": "210BBB05458CC4BFF7D8D09FCC2D3CDC434181A4B342FDDD5735BE78379EE6D9",
    "middle3-quadratic-equation-learning-model.js": "8253C4BE9F3E22505D5BC71D50806620AA6FF20D2927883902D62F2D22DE518A",
    "middle3-quadratic-learning-model.js": "68F1E71E58EC71EFCD399D26D8F22A8ADAF532B915CF0BA5C1FB27F7124681AE",
    "middle3-trigonometric-ratio-learning-model.js": "0B5FD56D3BBC5BFF5F0D605115FA9075CEFF523E1C5B7FCEF1E21A464A49F6AF",
    "middle3-circle-properties-learning-model.js": "1A20C41727CDC3553DE9C513656D7479D1E69FF73BB568877FBD5AEA2219F054",
    "middle3-statistics-learning-model.js": "261FDDD09AB0406870D71AAC7F3E62D896D5DB5FDCEE83D7717FC0AB31D57839",
  };
  Object.entries(expected).forEach(([file, hash]) => {
    const actual = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex").toUpperCase();
    assert.equal(actual, hash, file);
  });
  const existingRuntimeFiles = [
    "middle3-sqrt-learning-runtime.js", "middle3-factorization-learning-runtime.js",
    "middle3-quadratic-equation-learning-runtime.js", "middle3-quadratic-learning-runtime.js",
    "middle3-trigonometric-ratio-learning-runtime.js", "middle3-circle-properties-learning-runtime.js",
    "middle3-statistics-learning-runtime.js",
  ];
  existingRuntimeFiles.forEach((file) => assert.ok(fs.existsSync(path.join(root, file)), file));
});
