const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

const model = require("../middle3-sqrt-learning-model.js");
const content = require("../middle3-sqrt-learning-content.js");
const runtime = require("../middle3-sqrt-learning-runtime.js");
const quadraticRuntime = require("../middle3-quadratic-learning-runtime.js");

const modelHash = () => crypto
  .createHash("sha256")
  .update(JSON.stringify(model.problems))
  .digest("hex");

function singleProblemState(problem, purpose = runtime.PURPOSES.LEARNING, cycleId = "sqrt-single") {
  const state = runtime.createDefaultState("sqrt-student");
  state.activeLearningCycleId = cycleId;
  state.activeCycleNumber = 1;
  state.cycleStatus = "ACTIVE";
  state.cycleItems = [{
    problemId: problem.problemId,
    conceptId: problem.conceptId,
    stage: problem.stage,
    purpose,
    contentRole: problem.contentRole,
    reasoningGoals: [...problem.reasoningGoals],
    structureSignature: problem.structureSignature,
    solutionPathSignature: problem.solutionPathSignature,
    ...(purpose === runtime.PURPOSES.INDEPENDENT_CHECK ? {
      checkId: `check:${problem.problemId}`,
      verifiesStage: problem.stage,
    } : {}),
  }];
  state.cycleProblemIds = [problem.problemId];
  state.cycleTargets = purpose === runtime.PURPOSES.LEARNING
    ? { [problem.conceptId]: problem.stage }
    : {};
  state.currentConceptId = problem.conceptId;
  state.currentStage = problem.stage;
  return runtime.normalizeState(state, state.userId);
}

test("제곱근 adapter 설정과 저장 namespace는 이차함수와 완전히 분리된다", () => {
  assert.equal(runtime.VERSION, "middle3SqrtLearningV1");
  assert.equal(runtime.SCOPE_ID, "MIDDLE3_SQRT");
  assert.equal(runtime.CURRICULUM_VERSION, "MIDDLE3_2015_SQRT_V1");
  assert.equal(runtime.CLOUD_STATE_KEY, "middle3SqrtLearningV1");
  assert.equal(runtime.LOCAL_STORAGE_KEY, "studyCoinMiddle3SqrtLearningV1");
  assert.equal(runtime.CYCLE_PREFIX, "m3sqrt-cycle");
  assert.notEqual(runtime.CLOUD_STATE_KEY, quadraticRuntime.CLOUD_STATE_KEY);
  assert.notEqual(runtime.LOCAL_STORAGE_KEY, quadraticRuntime.LOCAL_STORAGE_KEY);
  assert.notEqual(runtime.CYCLE_PREFIX, quadraticRuntime.CYCLE_PREFIX);
});

test("승인된 120문항과 설명 5×6을 변경 없이 연결한다", () => {
  assert.equal(modelHash(), "7b3506337f6bd9912fef44f312313a0028d11c82270303fcecd4f2a0203bc827");
  assert.equal(model.problems.length, 120);
  assert.equal(content.CONCEPTS.length, 5);
  content.CONCEPTS.forEach(({ conceptId }) => {
    runtime.STAGES.forEach((stage) => {
      const problems = model.getProblems(conceptId, stage);
      assert.equal(problems.length, 4, `${conceptId}:${stage}`);
      assert.equal(problems.filter((problem) => !problem.independentCheck).length, 3);
      assert.equal(problems.filter((problem) => problem.independentCheck).length, 1);
      assert.ok(content.get(conceptId, stage));
    });
  });
});

test("첫 스프링 사이클은 세 BASIC concept와 각 학습 3문항을 구성한다", () => {
  const state = runtime.startCycle(runtime.createDefaultState("sqrt-student"), {
    idFactory: () => "basic-one",
  });
  assert.equal(state.activeLearningCycleId, "m3sqrt-cycle-1-basic-one");
  assert.ok(state.cycleItems.length >= 20 && state.cycleItems.length <= 35);
  assert.deepEqual(state.cycleTargets, {
    m3_sqrt_meaning: "BASIC",
    m3_sqrt_value: "BASIC",
    m3_irrational_number: "BASIC",
  });
  Object.entries(state.cycleTargets).forEach(([conceptId, stage]) => {
    const targetItems = state.cycleItems.filter((item) => (
      item.purpose === runtime.PURPOSES.LEARNING
      && item.conceptId === conceptId
      && item.stage === stage
    ));
    assert.equal(targetItems.length, 3);
    assert.deepEqual(
      targetItems.map((item) => item.contentRole),
      ["LEARNING_EXAMPLE", "LEARNING_PRACTICE", "LEARNING_FINAL_CHECK"]
    );
  });
  assert.equal(state.cycleItems.some((item) => model.problemsById[item.problemId].independentCheck), false);
});

test("한 사이클은 problem·구조·풀이 경로를 중복하지 않는다", () => {
  const state = runtime.startCycle(runtime.createDefaultState("sqrt-unique"), {
    idFactory: () => "unique",
  });
  assert.equal(new Set(state.cycleProblemIds).size, state.cycleProblemIds.length);
  assert.equal(new Set(state.cycleItems.map((item) => item.structureSignature)).size, state.cycleItems.length);
  assert.equal(new Set(state.cycleItems.map((item) => item.solutionPathSignature)).size, state.cycleItems.length);
});

test("다섯 answerType은 adapter의 대수 validator 계약으로 FINAL 처리된다", () => {
  model.ANSWER_TYPES.forEach((answerType, index) => {
    const problem = model.problems.find((item) => item.answerType === answerType);
    const submitted = runtime.submitAnswer(singleProblemState(problem), problem.correctAnswer, {
      now: () => 100 + index,
      idFactory: () => answerType.toLowerCase(),
    });
    assert.equal(submitted.accepted, true, answerType);
    assert.equal(submitted.finalized, true, answerType);
    assert.ok(["CORRECT", "REVIEW_REQUIRED"].includes(submitted.result.status), answerType);
    assert.match(submitted.submissionId, /^m3sqrt-submit-/);
  });
});

test("근호 간소화와 분모 유리화 동치식을 정답으로 인정한다", () => {
  const radical = model.problems.find((problem) => (
    problem.answerType === "EXPRESSION_INPUT"
    && problem.expectedAnswer === "2√3"
  ));
  assert.ok(radical);
  assert.equal(model.evaluateProblemAnswer(radical, "√12").status, "CORRECT");
  const rationalized = model.problemsById["m3-sqrt-107-radical_operations-a2-binomial-denominator-rationalization"];
  assert.equal(model.evaluateProblemAnswer(rationalized, "1/(√3+1)").status, "CORRECT");
});

test("043 문항은 네 정상 동치식만 안전하게 수용한다", () => {
  const problem = model.problemsById["m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition"];
  ["√3-√2", "-√2+√3", "1/(√3+√2)", "1/(√2+√3)"].forEach((answer) => {
    assert.equal(model.evaluateProblemAnswer(problem, answer).status, "CORRECT", answer);
  });
  ["√2-√3", "1/(√3-√2)", "1/(√2-√3)", "√3", "√3-√2=0", "1/√3+√2"].forEach((answer) => {
    assert.equal(model.evaluateProblemAnswer(problem, answer).status, "INCORRECT", answer);
  });
});

test("과정형은 정확한 순서만 허용하고 순서 변경·누락을 차단한다", () => {
  const problem = model.problemsById["m3-sqrt-042-sqrt_value-a4-two-perfect-square-gap"];
  const state = singleProblemState(problem);
  assert.equal(runtime.submitAnswer(state, problem.correctAnswer).result.status, "CORRECT");
  const reordered = [...problem.correctAnswer];
  [reordered[1], reordered[2]] = [reordered[2], reordered[1]];
  assert.equal(runtime.submitAnswer(state, reordered).result.status, "INCORRECT");
  assert.equal(runtime.submitAnswer(state, problem.correctAnswer.slice(0, -1)).result.status, "INCORRECT");
});

test("서술형은 자동 오답으로 만들지 않고 REVIEW_REQUIRED로 FINAL 저장한다", () => {
  const problem = model.problems.find((item) => item.answerType === "WRITTEN_RESPONSE");
  const submitted = runtime.submitAnswer(singleProblemState(problem), "근거와 검산을 포함한 학생 답안", {
    now: () => 200,
    idFactory: () => "written",
  });
  assert.equal(submitted.result.status, "REVIEW_REQUIRED");
  assert.equal(submitted.finalized, true);
  assert.deepEqual(submitted.result.rubric, problem.writtenRubric);
});

test("FINAL 답안은 같은 사이클에서 재제출되지 않는다", () => {
  const problem = model.problems.find((item) => item.answerType === "MULTIPLE_CHOICE");
  const first = runtime.submitAnswer(singleProblemState(problem), problem.correctAnswer, {
    now: () => 1,
    idFactory: () => "first",
  });
  const duplicate = runtime.submitAnswer(first.state, problem.correctAnswer, {
    now: () => 2,
    idFactory: () => "duplicate",
  });
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.reason, "FINAL_LOCKED");
  assert.equal(first.state.submittedAnswers[runtime.attemptKey(first.state, problem.problemId)].length, 1);
});

test("혼자 풀기에서는 힌트와 풀이를 FINAL 전 차단하고 FINAL 뒤 풀이만 연다", () => {
  const problem = model.problems.find((item) => item.independentCheck);
  let state = singleProblemState(problem, runtime.PURPOSES.INDEPENDENT_CHECK, "sqrt-independent");
  const hinted = runtime.useHint(state, () => 1);
  assert.equal(hinted.reason, "INDEPENDENT_CHECK_LOCKED");
  assert.equal(hinted.level, 0);
  assert.equal(runtime.getHintCount(hinted.state, problem.problemId), 0);
  const earlySolution = runtime.revealSolution(state);
  assert.equal(earlySolution.revealed, false);
  assert.equal(earlySolution.reason, "INDEPENDENT_CHECK_LOCKED");
  const submitted = runtime.submitAnswer(state, problem.correctAnswer, {
    now: () => 2,
    idFactory: () => "independent",
  });
  assert.equal(submitted.finalized, true);
  assert.equal(submitted.state.independentPracticeResults.length, 1);
  assert.equal(submitted.state.independentPracticeResults[0].passed, true);
  const postFinal = runtime.revealSolution(submitted.state, { now: () => 3 });
  assert.equal(postFinal.revealed, true);
  assert.equal(postFinal.postFinal, true);
  assert.equal(postFinal.state.independentPracticeResults[0].passed, true);
});

test("serialize·새로고침·로그인 복원 계약은 현재 위치와 FINAL을 보존한다", () => {
  let state = runtime.startCycle(runtime.createDefaultState("sqrt-restore"), {
    idFactory: () => "restore",
  });
  const first = runtime.currentProblem(state);
  state = runtime.markContentViewed(state, first.conceptId, first.stage, () => 1);
  state = runtime.submitAnswer(state, first.correctAnswer, {
    now: () => 2,
    idFactory: () => "answer",
  }).state;
  state = runtime.advance(state, () => 3);
  state = runtime.pauseCycle(state, () => 4);
  const serialized = runtime.serializeState(state);
  const restored = runtime.resolveHydrationState(serialized, null, "sqrt-restore").state;
  assert.equal(restored.activeLearningCycleId, state.activeLearningCycleId);
  assert.equal(restored.currentProblemIndex, 1);
  assert.equal(restored.cycleStatus, "PAUSED");
  assert.equal(runtime.getFinalizedAttempt(restored, first.problemId).attemptStatus, "FINAL");
});

test("Firebase remote-wins는 더 높은 local revision도 폐기한다", () => {
  const remote = runtime.startCycle(runtime.createDefaultState("sqrt-sync"), {
    idFactory: () => "remote",
  });
  remote.currentProblemIndex = 2;
  remote.revision = 5;
  remote.updatedAt = "2026-07-27T01:00:00.000Z";
  const local = runtime.serializeState(remote);
  local.currentProblemIndex = 7;
  local.revision = 99;
  local.updatedAt = "2026-07-27T02:00:00.000Z";
  const resolved = runtime.resolveHydrationState(remote, local, "sqrt-sync");
  assert.equal(resolved.source, "REMOTE");
  assert.equal(resolved.conflict, "remoteWins");
  assert.equal(resolved.state.currentProblemIndex, 2);
  assert.equal(resolved.state.revision, 5);
});

test("상태 변경은 revision을 증가시키고 저장 필드는 제곱근 namespace 안에 유지된다", () => {
  let state = runtime.createDefaultState("sqrt-revision", () => 1);
  const initialRevision = state.revision;
  state = runtime.startCycle(state, { idFactory: () => "revision", now: () => 2 });
  assert.ok(state.revision > initialRevision);
  const serialized = runtime.serializeState(state);
  assert.equal(serialized.learningVersion, runtime.VERSION);
  assert.equal(JSON.stringify(serialized).includes(quadraticRuntime.CLOUD_STATE_KEY), false);
  assert.equal(JSON.stringify(serialized).includes(quadraticRuntime.LOCAL_STORAGE_KEY), false);
});
