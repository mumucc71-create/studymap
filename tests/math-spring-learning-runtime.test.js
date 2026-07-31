const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const factory = require("../math-spring-learning-runtime.js");
const schema = require("../math-learning-schema.js");
const algebraValidator = require("../math-algebra-validator.js");
const model = require("../middle3-quadratic-learning-model.js");
const learningContent = require("../middle3-quadratic-learning-content.js");
const quadratic = require("../middle3-quadratic-learning-runtime.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const QUADRATIC_PUBLIC_API = [
  "VERSION",
  "CLOUD_STATE_KEY",
  "STAGES",
  "STAGE_STATUSES",
  "CYCLE_STATUSES",
  "PURPOSES",
  "CONCEPT_IDS",
  "createDefaultState",
  "normalizeState",
  "describeState",
  "resolveHydrationState",
  "contentSlides",
  "recommendedStageFor",
  "stageStatus",
  "getStageMap",
  "buildSpringCycle",
  "startCycle",
  "currentItem",
  "currentProblem",
  "attemptKey",
  "getFinalizedAttempt",
  "getDraftAnswer",
  "getHintCount",
  "getFeedback",
  "shouldShowContent",
  "markContentViewed",
  "setDraftAnswer",
  "useHint",
  "submitAnswer",
  "revealSolution",
  "advance",
  "previous",
  "pauseCycle",
  "resumeCycle",
  "finishCycle",
  "serializeState",
  "cycleExample",
];

const SERIALIZED_KEYS = [
  "learningVersion",
  "userId",
  "activeLearningCycleId",
  "activeCycleNumber",
  "cycleStatus",
  "cycleProblemIds",
  "cycleItems",
  "cycleTargets",
  "currentProblemIndex",
  "submittedAnswers",
  "finalizedAttempts",
  "draftAnswers",
  "currentConceptId",
  "currentStage",
  "curriculumProgress",
  "masteryDepthByConcept",
  "viewedStages",
  "lessonContentViewed",
  "completedLessons",
  "hintsUsed",
  "solutionsViewed",
  "independentPracticeResults",
  "pendingIndependentChecks",
  "lastLearningPosition",
  "returnCheckpoint",
  "recentProblemIds",
  "recentStructureSignatures",
  "recentSolutionPathSignatures",
  "cycleHistory",
  "currentContentSlideIndex",
  "feedbackByProblemId",
  "revision",
  "updatedAt",
];

const FIRST_CYCLE_PROBLEM_IDS = [
  "m3-qf-learning-1-basic-1-classification",
  "m3-qf-learning-1-basic-2-coefficient-condition",
  "m3-qf-learning-1-basic-3-second-difference",
  "m3-qf-learning-2-basic-1-opening-direction",
  "m3-qf-learning-2-basic-2-width-comparison",
  "m3-qf-learning-2-basic-3-symmetric-value",
  "m3-qf-learning-3-basic-1-read-vertex",
  "m3-qf-learning-3-basic-2-read-axis",
  "m3-qf-learning-3-basic-3-origin-vertex",
  "m3-qf-learning-1-a1-1-rearranged-relation",
  "m3-qf-learning-2-a1-1-sign-and-width",
  "m3-qf-learning-3-a1-1-complete-square-simple",
  "m3-qf-learning-4-basic-1-horizontal-shift",
  "m3-qf-learning-5-basic-1-vertex-and-point",
  "m3-qf-learning-6-basic-1-read-minimum",
  "m3-qf-learning-1-a1-2-table-missing-value",
  "m3-qf-learning-2-a1-2-point-membership",
  "m3-qf-learning-3-a1-2-symmetric-point",
  "m3-qf-learning-4-a1-1-identify-shift",
  "m3-qf-learning-5-a1-1-find-coefficient",
];

function createCommon(overrides = {}) {
  return factory.createRuntime({
    version: "factoryContractV1",
    scopeId: "TEST_SCOPE",
    curriculumVersion: "TEST_CURRICULUM",
    conceptIds: learningContent.CONCEPTS.map((concept) => concept.conceptId),
    model,
    learningContent,
    schema,
    cloudKey: "factoryCloudV1",
    localStorageKey: "factoryLocalV1",
    cyclePrefix: "factory-cycle",
    eventName: "study:factory-completed",
    ...overrides,
  });
}

function singleProblemState(runtime, problem, cycleId = "factory-cycle-1-test") {
  const state = runtime.createDefaultState("factory-student", () => 1);
  state.activeLearningCycleId = cycleId;
  state.activeCycleNumber = 1;
  state.cycleStatus = "ACTIVE";
  state.cycleItems = [{
    problemId: problem.problemId,
    conceptId: problem.conceptId,
    stage: problem.stage,
    purpose: runtime.PURPOSES.LEARNING,
    contentRole: problem.contentRole,
    reasoningGoals: [...problem.reasoningGoals],
    structureSignature: problem.structureSignature,
    solutionPathSignature: problem.solutionPathSignature,
  }];
  state.cycleProblemIds = [problem.problemId];
  state.cycleTargets = { [problem.conceptId]: problem.stage };
  state.currentConceptId = problem.conceptId;
  state.currentStage = problem.stage;
  return runtime.normalizeState(state, state.userId, () => 1);
}

test("공통 factory는 단원별 식별자·저장 키·cycle prefix를 주입받는다", () => {
  const runtime = createCommon();
  assert.equal(factory.VERSION, "mathSpringLearningRuntimeFactoryV1");
  assert.equal(runtime.VERSION, "factoryContractV1");
  assert.equal(runtime.SCOPE_ID, "TEST_SCOPE");
  assert.equal(runtime.CURRICULUM_VERSION, "TEST_CURRICULUM");
  assert.equal(runtime.CLOUD_STATE_KEY, "factoryCloudV1");
  assert.equal(runtime.LOCAL_STORAGE_KEY, "factoryLocalV1");
  assert.equal(runtime.CYCLE_PREFIX, "factory-cycle");
  assert.equal(runtime.EVENT_NAME, "study:factory-completed");
  const state = runtime.startCycle(runtime.createDefaultState("student", () => 1), {
    now: () => 2,
    idFactory: () => "injected",
  });
  assert.equal(state.activeLearningCycleId, "factory-cycle-1-injected");
});

test("answerType handler와 validator를 주입하고 미지정 시 기존 schema 채점을 유지한다", () => {
  const problem = model.problems.find((item) => item.answerType === "MULTIPLE_CHOICE");
  let validatorCalls = 0;
  const validatorRuntime = createCommon({
    validator: {
      evaluateAnswer(receivedProblem, answer) {
        validatorCalls += 1;
        assert.equal(receivedProblem.problemId, problem.problemId);
        return { status: answer === "validator-answer" ? "CORRECT" : "INCORRECT", correct: answer === "validator-answer" };
      },
    },
  });
  let state = singleProblemState(validatorRuntime, problem);
  const validated = validatorRuntime.submitAnswer(state, "validator-answer", {
    now: () => 2,
    idFactory: () => "validator",
  });
  assert.equal(validated.result.status, "CORRECT");
  assert.equal(validatorCalls, 1);

  const handlerRuntime = createCommon({
    validator: { evaluateAnswer: () => ({ status: "INCORRECT", correct: false }) },
    answerTypeHandlers: {
      MULTIPLE_CHOICE: () => ({ status: "REVIEW_REQUIRED", correct: null }),
    },
  });
  state = singleProblemState(handlerRuntime, problem);
  const handled = handlerRuntime.submitAnswer(state, "handler-answer", {
    now: () => 3,
    idFactory: () => "handler",
  });
  assert.equal(handled.result.status, "REVIEW_REQUIRED");

  const algebraRuntime = createCommon({
    validator: algebraValidator,
    answerTypeHandlers: {
      MULTIPLE_CHOICE(receivedProblem, answer, context) {
        assert.equal(context.validator, algebraValidator);
        const comparison = context.validator.compareExpressions("x^2+5x+6", answer);
        return {
          status: comparison.equivalent ? "CORRECT" : "INCORRECT",
          correct: comparison.equivalent,
        };
      },
    },
  });
  state = singleProblemState(algebraRuntime, problem);
  const algebraResult = algebraRuntime.submitAnswer(state, "(x+2)(x+3)", {
    now: () => 4,
    idFactory: () => "algebra",
  });
  assert.equal(algebraResult.result.status, "CORRECT");

  const fallbackRuntime = createCommon({ validator: undefined });
  state = singleProblemState(fallbackRuntime, problem);
  const fallback = fallbackRuntime.submitAnswer(state, problem.correctAnswer, {
    now: () => 5,
    idFactory: () => "fallback",
  });
  assert.equal(fallback.result.status, "CORRECT");
});

test("validator 오류는 입력 상태를 손상시키지 않고 미지원 판정은 그대로 전달한다", () => {
  const problem = model.problems.find((item) => item.answerType === "MULTIPLE_CHOICE");
  const throwingRuntime = createCommon({
    validator: {
      evaluateAnswer() {
        throw new Error("VALIDATOR_FAILURE");
      },
    },
  });
  const stableState = singleProblemState(throwingRuntime, problem);
  const before = JSON.stringify(stableState);
  assert.throws(
    () => throwingRuntime.submitAnswer(stableState, problem.correctAnswer),
    /VALIDATOR_FAILURE/
  );
  assert.equal(JSON.stringify(stableState), before);

  ["REVIEW_REQUIRED", "UNSUPPORTED_EXPRESSION"].forEach((status, index) => {
    const statusRuntime = createCommon({
      validator: {
        evaluateAnswer() {
          return { status, correct: null, reason: `TEST_${status}` };
        },
      },
    });
    const state = singleProblemState(statusRuntime, problem, `factory-status-${index}`);
    const submitted = statusRuntime.submitAnswer(state, "unsupported input", {
      now: () => 10 + index,
      idFactory: () => `status-${index}`,
    });
    assert.equal(submitted.result.status, status);
    assert.equal(submitted.result.reason, `TEST_${status}`);
    assert.equal(submitted.finalized, status === "REVIEW_REQUIRED");
  });
});

test("단계 진행·완료 이벤트·독립 확인 pool 계약을 주입할 수 있다", () => {
  const events = [];
  const independentProblem = {
    ...model.getProblems("m3_quadratic_function_meaning", "A1")[0],
    problemId: "factory-independent-problem",
    structureSignature: "factory-independent-structure",
    solutionPathSignature: "factory-independent-solution",
  };
  const runtime = createCommon({
    stageProgressionRules: {
      nextStage(stage) {
        return stage === "BASIC" ? "A2" : null;
      },
    },
    independentCheckPool: {
      problemsById: { [independentProblem.problemId]: independentProblem },
      getProblems(conceptId, stage) {
        return conceptId === independentProblem.conceptId && stage === independentProblem.stage
          ? [independentProblem]
          : [];
      },
    },
    onCycleCompleted(state, detail) {
      events.push({ state, detail });
    },
  });
  const recommendedState = runtime.createDefaultState("student", () => 1);
  recommendedState.masteryDepthByConcept.m3_quadratic_function_meaning.learningCompletedStage = "BASIC";
  assert.equal(runtime.recommendedStageFor(recommendedState, "m3_quadratic_function_meaning"), "A2");

  const state = runtime.createDefaultState("student", () => 1);
  state.activeCycleNumber = 4;
  state.pendingIndependentChecks = [{
    checkId: "factory-check",
    conceptId: independentProblem.conceptId,
    stage: "BASIC",
    checkStage: "A1",
    status: "PENDING",
    learningProblemIds: [],
    learningStructureSignatures: [],
    learningSolutionPathSignatures: [],
  }];
  const started = runtime.startCycle(state, {
    conceptId: "m3_quadratic_graph_shape",
    stage: "BASIC",
    now: () => 2,
    idFactory: () => "pool",
  });
  assert.equal(started.cycleItems[0].problemId, independentProblem.problemId);
  assert.equal(runtime.currentProblem(started).problemId, independentProblem.problemId);
  runtime.finishCycle(started, () => 3);
  assert.equal(events.length, 1);
  assert.equal(events[0].detail.eventName, "study:factory-completed");
  assert.equal(events[0].detail.scopeId, "TEST_SCOPE");

  const completionRuntime = createCommon({
    completionRules: {
      independentCheckPassed: () => true,
    },
  });
  const completionState = completionRuntime.createDefaultState("completion-student", () => 1);
  completionState.activeLearningCycleId = "factory-cycle-completion";
  completionState.cycleStatus = "ACTIVE";
  completionState.pendingIndependentChecks = [{
    checkId: "completion-check",
    conceptId: "m3_quadratic_function_meaning",
    stage: "BASIC",
    status: "PENDING",
  }];
  completionState.independentPracticeResults = [{
    checkId: "completion-check",
    passed: false,
    completedAt: "1970-01-01T00:00:02.000Z",
  }];
  const completed = completionRuntime.finishCycle(completionState, () => 3);
  assert.equal(completed.masteryDepthByConcept.m3_quadratic_function_meaning.verifiedStage, "BASIC");
  assert.equal(completed.pendingIndependentChecks.length, 0);
});

test("이차함수 adapter는 기존 공개 API·저장 키·cycle 및 submission prefix를 유지한다", () => {
  assert.deepEqual(Object.keys(quadratic), QUADRATIC_PUBLIC_API);
  assert.equal(quadratic.VERSION, "middle3QuadraticLearningV1");
  assert.equal(quadratic.CLOUD_STATE_KEY, "middle3QuadraticLearningV1");
  const adapter = read("middle3-quadratic-learning-runtime.js");
  assert.match(adapter, /localStorageKey: "studyCoinMiddle3QuadraticLearningV1"/);
  assert.match(adapter, /cyclePrefix: "m3q-cycle"/);
  assert.match(adapter, /submissionPrefix: "m3q-submit"/);
  const state = quadratic.startCycle(quadratic.createDefaultState("student", () => 1), {
    now: () => 2,
    idFactory: () => "contract",
  });
  assert.equal(state.activeLearningCycleId, "m3q-cycle-1-contract");
  const problem = quadratic.currentProblem(state);
  const submitted = quadratic.submitAnswer(state, problem.correctAnswer, {
    now: () => 3,
    idFactory: () => "contract",
  });
  assert.match(submitted.submissionId, /^m3q-submit-/);
});

test("adapter 전환 후 첫 사이클 문제 선택 순서가 기준값과 완전히 같다", () => {
  const state = quadratic.startCycle(quadratic.createDefaultState("contract-user", () => 1000), {
    now: () => 2000,
    idFactory: () => "contract",
  });
  assert.deepEqual(state.cycleItems.map((item) => item.problemId), FIRST_CYCLE_PROBLEM_IDS);
});

test("기존 저장 payload는 migration 없이 같은 shape로 hydrate·serialize된다", () => {
  const saved = quadratic.serializeState(quadratic.startCycle(
    quadratic.createDefaultState("saved-user", () => 1000),
    { now: () => 2000, idFactory: () => "saved" }
  ));
  const hydrated = quadratic.resolveHydrationState(saved, null, "saved-user");
  assert.equal(hydrated.source, "REMOTE");
  assert.equal(hydrated.state.activeLearningCycleId, "m3q-cycle-1-saved");
  assert.deepEqual(Object.keys(quadratic.serializeState(hydrated.state)), SERIALIZED_KEYS);
  assert.deepEqual(quadratic.serializeState(hydrated.state), saved);
});

test("FINAL 잠금과 Chrome↔Edge remote-wins·revision 계약이 adapter에서 유지된다", () => {
  let chrome = quadratic.startCycle(quadratic.createDefaultState("student", () => 1), {
    now: () => 2,
    idFactory: () => "browser",
  });
  const first = quadratic.currentProblem(chrome);
  chrome = quadratic.submitAnswer(chrome, first.correctAnswer, {
    now: () => 3,
    idFactory: () => "final",
  }).state;
  const edgeRemote = quadratic.serializeState(chrome);
  const staleChrome = quadratic.serializeState(chrome);
  staleChrome.currentProblemIndex = 5;
  staleChrome.revision = edgeRemote.revision + 10;
  staleChrome.updatedAt = "2099-01-01T00:00:00.000Z";
  const restored = quadratic.resolveHydrationState(edgeRemote, staleChrome, "student");
  assert.equal(restored.source, "REMOTE");
  assert.equal(restored.conflict, "remoteWins");
  assert.equal(restored.state.currentProblemIndex, edgeRemote.currentProblemIndex);
  assert.equal(restored.state.revision, edgeRemote.revision);
  const duplicate = quadratic.submitAnswer(restored.state, first.correctAnswer);
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.reason, "FINAL_LOCKED");
});

test("이차함수 UI의 원격 복원 event 이름과 detail payload 계약은 변경되지 않는다", () => {
  const ui = read("middle3-quadratic-learning-ui.js");
  assert.match(ui, /new CustomEvent\("study:m3-quadratic-remote-wins", \{\s*detail: runtime\.describeState\(state\)/);
  assert.match(ui, /return `studyCoinMiddle3QuadraticLearningV1:\$\{userId\}`/);
});
