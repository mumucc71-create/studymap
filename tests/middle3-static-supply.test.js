const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

global.window = global;
global.addEventListener = () => {};
const element = {
  querySelector() { return element; },
  addEventListener() {},
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  style: {},
  dataset: {},
  disabled: false,
  hidden: false,
  title: "",
  textContent: "",
  innerHTML: "",
};
global.document = {
  readyState: "complete",
  querySelector() { return element; },
  querySelectorAll() { return []; },
  addEventListener() {},
  dispatchEvent() {},
};
global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
global.alert = () => {};
global.CustomEvent = function CustomEvent() {};

const originalLog = console.log;
console.log = () => {};
require("../question-generators.js");
const detailData = require("../middle3-concept-diagnostics.js");
const stageBank = require("../middle3-stage-question-bank.js");
require("../math-curriculum-data.js");
require("../elite-test.js");
const metadata = require("../math-problem-metadata.js");
const engine = require("../level-test-engine.js");
console.log = originalLog;

function createState(conceptId = "m3_sqrt_value") {
  const state = engine.createStudentState({
    mode: engine.MODE_STANDARD,
    targetConceptIds: [conceptId],
    concepts: [{ conceptId, title: conceptId, prerequisiteConceptIds: [] }],
  });
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  return state;
}

function problem(id, conceptId = "m3_sqrt_value", overrides = {}) {
  return {
    id,
    questionId: id,
    conceptId,
    concept: conceptId,
    problem: `${id}에서 답을 구하세요`,
    questionText: `${id}에서 답을 구하세요`,
    answer: "1",
    choices: ["1", "2", "3", "4"],
    adaptiveLevel: 1,
    difficulty: 1,
    reviewStatus: "AUTO_APPROVED",
    executionStatus: "EXECUTABLE",
    mode: "STANDARD",
    ...overrides,
  };
}

test("승인된 STANDARD 389개가 43개 세부 개념으로 엔진 형식에 연결된다", () => {
  const originalPool = metadata.createOriginalExecutableStandardProblemPool();
  const pool = metadata.createExecutableStandardProblemPool();
  const sourceCounts = pool.reduce((counts, item) => {
    counts[item.metadataSource] = (counts[item.metadataSource] || 0) + 1;
    return counts;
  }, {});

  assert.equal(originalPool.length, 389);
  assert.equal(pool.length, 998);
  assert.equal(new Set(pool.map((item) => item.id)).size, 998);
  assert.equal(new Set(pool.map((item) => item.conceptId)).size, 43);
  assert.deepEqual(sourceCounts, { DETAIL_CONCEPT: 172, LEGACY_GRADE9: 217, STAGE_EXPANSION: 609 });
  assert.ok(pool.every((item) => item.mode === "STANDARD"));
  assert.ok(pool.every((item) => item.reviewStatus === "AUTO_APPROVED"));
  assert.ok(pool.every((item) => item.executionStatus === "EXECUTABLE"));
  assert.ok(pool.every((item) => engine.validateProblem(item, {
    strictMathValidation: true,
    expectedGrade: 9,
    expectedConceptId: item.conceptId,
    expectedStageIndex: item.adaptiveLevel - 1,
  }).isValid));
  assert.ok(pool.every((item) => item.answerType === "MULTIPLE_CHOICE"));
  assert.ok(pool.every((item) => item.mathValidation?.conditionsComplete === true));
  assert.ok(!pool.some((item) => item.id.startsWith("elite-")));
});

test("검토 필요 9개·범위 밖 1개·Elite 문제는 STANDARD 공급망에 들어오지 않는다", () => {
  const ids = new Set(metadata.createExecutableStandardProblemPool().map((item) => item.id));
  const excluded = metadata.staticProblemMetadata.filter((item) => item.reviewStatus !== "AUTO_APPROVED");
  assert.equal(excluded.length, 10);
  assert.ok(excluded.every((item) => !ids.has(item.problemId)));
  assert.ok(![...ids].some((id) => id.startsWith("elite-")));
});

test("현재 문제 공급은 BASIC 43개념 모두 판정 가능하고 상위 단계 부족을 정확히 보고한다", () => {
  const pool = metadata.createExecutableStandardProblemPool();
  const conceptIds = detailData.concepts.map((item) => item.conceptId);
  const stageCounts = Object.fromEntries(engine.STAGES.map((stage, stageIndex) => [
    stage,
    pool.filter((item) => engine.problemStageIndex(item) === stageIndex).length,
  ]));
  const safeConceptCounts = Object.fromEntries(engine.STAGES.map((stage, stageIndex) => [
    stage,
    conceptIds.filter((conceptId) => engine.stageEvidenceSupply({ mode: engine.MODE_STANDARD }, pool, conceptId, stageIndex).sufficientForStageProof).length,
  ]));

  assert.deepEqual(stageCounts, {
    BASIC: 269,
    ADVANCED_1: 166,
    ADVANCED_2: 165,
    ADVANCED_3: 140,
    ADVANCED_4: 129,
    ADVANCED_5: 129,
  });
  assert.deepEqual(safeConceptCounts, {
    BASIC: 43,
    ADVANCED_1: 43,
    ADVANCED_2: 43,
    ADVANCED_3: 43,
    ADVANCED_4: 43,
    ADVANCED_5: 43,
  });
});

test("A1~A5 stage expansion adds only the 609 missing independent paths", () => {
  const pool = metadata.createExecutableStandardProblemPool();
  const expansion = metadata.stageExpansionMetadata;
  const addedByStage = expansion.reduce((counts, item) => {
    counts[item.stage] = (counts[item.stage] || 0) + 1;
    return counts;
  }, {});

  assert.equal(stageBank.candidates.length, 645);
  assert.equal(expansion.length, 609);
  assert.deepEqual(addedByStage, { A1: 114, A2: 113, A3: 124, A4: 129, A5: 129 });
  assert.equal(metadata.stageExpansionSupply.length, 215);
  assert.ok(metadata.stageExpansionSupply.every((item) => item.sufficient));
  assert.deepEqual(
    metadata.stageExpansionSupply.reduce((counts, item) => {
      counts[item.stage] = (counts[item.stage] || 0) + item.added;
      return counts;
    }, {}),
    { A1: 114, A2: 113, A3: 124, A4: 129, A5: 129 }
  );

  const selected = pool.filter((item) => item.metadataSource === "STAGE_EXPANSION");
  assert.equal(selected.length, 609);
  assert.ok(selected.every((item) => engine.validateProblem(item).isValid));
  assert.ok(selected.every((item) => item.reviewStatus === "AUTO_APPROVED" && item.executionStatus === "EXECUTABLE"));
  assert.ok(selected.every((item) => item.solutionPathSignature.includes(":stage-expansion:")));
  assert.ok(new Set(selected.map((item) => item.choices.indexOf(item.answer))).size > 1);
  assert.ok(selected.filter((item) => [5, 6].includes(item.adaptiveLevel)).every((item) => new Set(item.componentConceptIds).size >= 3));
  assert.ok(selected.filter((item) => item.adaptiveLevel === 5).every((item) => item.problem.includes("서로 다른 세 개념")));
  assert.ok(selected.filter((item) => item.adaptiveLevel === 6).every((item) => item.problem.includes("오류")));

  detailData.concepts.forEach((definition) => {
    [1, 2, 3, 4, 5].forEach((stageIndex) => {
      const supply = engine.stageEvidenceSupply({ mode: engine.MODE_STANDARD }, pool, definition.conceptId, stageIndex);
      assert.equal(supply.sufficientForStageProof, true, `${definition.conceptId} stage ${stageIndex}`);
      assert.ok(supply.distinctStructures >= 3);
      assert.ok(supply.distinctSolutionPaths >= 3);
    });
  });
});

test("the engine requires A5 proof before marking a concept mastered", () => {
  const pool = metadata.createExecutableStandardProblemPool();
  const state = createState("m3_sqrt_value");

  [1, 2, 3, 4, 5].forEach((stageIndex) => {
    state.conceptMastery.m3_sqrt_value.stageIndex = stageIndex;
    const cycle = engine.createCyclePlan(state);
    cycle.targetSize = 3;
    cycle.slots = Array(3).fill(engine.PURPOSES.CURRENT_STAGE_CHECK);
    const selectedPaths = [];

    for (let index = 0; index < 3; index += 1) {
      const selected = engine.selectNextProblem(state, pool);
      assert.ok(selected);
      assert.equal(engine.problemStageIndex(selected), stageIndex);
      assert.equal(selected.stageEvidenceEligible, true);
      selectedPaths.push(selected.solutionPathSignature);
      engine.recordOutcome(state, selected, "correct", 10);
    }

    assert.equal(new Set(selectedPaths).size, 3);
    assert.deepEqual(state.lastCycleSummary.insufficientStageSupplyConceptIds, []);
    assert.ok(state.lastCycleSummary.promotedConceptIds.includes("m3_sqrt_value"));
    assert.equal(state.conceptMastery.m3_sqrt_value.stageIndex, Math.min(stageIndex + 1, 5));
    assert.equal(
      state.conceptMastery.m3_sqrt_value.status,
      stageIndex === 5 ? "MASTERED" : "ACTIVE_STAGE"
    );
  });
});

test("엔진은 실행 제외 및 Elite 문제를 STANDARD 모드에서 선택하지 않는다", () => {
  const state = createState();
  const review = problem("review", undefined, { reviewStatus: "REVIEW_REQUIRED", executionStatus: "EXCLUDED_REVIEW" });
  const elite = problem("elite", undefined, { mode: "ELITE", executionStatus: "ELITE_ONLY" });
  const valid = problem("valid");
  const selected = engine.selectNextProblem(state, [review, elite, valid]);
  assert.equal(selected.id, "valid");
});

test("같은 풀이 경로를 반복한 재확인은 여러 독립 근거로 계산되지 않는다", () => {
  const state = createState();
  engine.createCyclePlan(state);
  engine.recordOutcome(state, problem("wrong", undefined, { solutionPathSignature: "same-path" }), "wrong", 5);

  for (let index = 1; index <= 3; index += 1) {
    engine.recordOutcome(state, problem(`retry-${index}`, undefined, {
      targetPurpose: engine.PURPOSES.ERROR_RECHECK,
      structureSignature: `different-structure-${index}`,
      solutionPathSignature: "same-path",
    }), "correct", 5);
  }

  const recheck = state.pendingRechecks.find((item) => item.conceptId === "m3_sqrt_value");
  assert.equal(recheck.remaining, 2);
  assert.equal(recheck.attemptedEvidenceSignatures.length, 1);
});

test("단계 증거가 부족한 문제를 모두 맞혀도 승급시키지 않는다", () => {
  const state = createState();
  state.conceptMastery.m3_sqrt_value.stageIndex = 1;
  const cycle = engine.createCyclePlan(state);
  cycle.targetSize = 3;
  cycle.slots = Array(3).fill(engine.PURPOSES.CURRENT_STAGE_CHECK);

  for (let index = 1; index <= 3; index += 1) {
    engine.recordOutcome(state, problem(`insufficient-${index}`, undefined, {
      adaptiveLevel: 2,
      difficulty: 2,
      stageIndex: 1,
      sourceStageIndex: 1,
      targetStageIndex: 1,
      stageEvidenceEligible: false,
      structureSignature: `insufficient-structure-${index}`,
      solutionPathSignature: `insufficient-path-${index}`,
    }), "correct", 5);
  }

  assert.equal(state.conceptMastery.m3_sqrt_value.stageIndex, 1);
  assert.deepEqual(state.lastCycleSummary.promotedConceptIds, []);
  assert.deepEqual(state.lastCycleSummary.insufficientStageSupplyConceptIds, ["m3_sqrt_value"]);
});

test("실제 앱의 연속 테스트 풀은 기존 중3 큰 단원 원본 대신 승인 어댑터를 사용한다", () => {
  const source = fs.readFileSync(require.resolve("../script.js"), "utf8");
  assert.match(source, /function buildMiddle3ApprovedStandardQuestionPool\(/);
  assert.match(source, /return \[\.\.\.prerequisitePool, \.\.\.buildMiddle3ApprovedStandardQuestionPool\(\)\]/);
  assert.doesNotMatch(source.match(/function buildMiddle3CycleQuestionPool\(\)[\s\S]*?function levelTestStateKey/)?.[0] || "", /\["g5", "g6", "m1", "m2", "m3"\]/);
  assert.match(source, /question\.code === "M3-STANDARD-APPROVED" && question\.executionStatus === "EXECUTABLE"/);
});
