const test = require("node:test");
const assert = require("node:assert/strict");

const content = require("../middle3-quadratic-learning-content.js");
const model = require("../middle3-quadratic-learning-model.js");
const runtime = require("../middle3-quadratic-learning-runtime.js");

function singleProblemState(problem, cycleId = "cycle-single") {
  const state = runtime.createDefaultState("student@example.com");
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
  return runtime.normalizeState(state, state.userId);
}

function completeCycle(input) {
  let state = input;
  let guard = 0;
  while (state.cycleStatus === "ACTIVE" && guard < 40) {
    guard += 1;
    const item = runtime.currentItem(state);
    const problem = runtime.currentProblem(state);
    if (runtime.shouldShowContent(state)) {
      state = runtime.markContentViewed(state, item.conceptId, item.stage, () => 1000 + guard);
    }
    const submitted = runtime.submitAnswer(state, problem.correctAnswer, {
      now: () => 2000 + guard,
      idFactory: () => `answer-${guard}`,
    });
    assert.equal(submitted.accepted, true, `${problem.problemId}: ${submitted.reason || submitted.result?.status}`);
    assert.equal(submitted.finalized, true, problem.problemId);
    state = runtime.advance(submitted.state, () => 3000 + guard);
  }
  assert.ok(guard < 40, "cycle did not finish");
  assert.equal(state.cycleStatus, "COMPLETED");
  return state;
}

test("승인된 108문항과 6×6 설명 콘텐츠를 런타임에서 모두 읽는다", () => {
  assert.equal(model.problems.length, 108);
  assert.equal(content.CONCEPTS.length, 6);
  content.CONCEPTS.forEach(({ conceptId }) => {
    runtime.STAGES.forEach((stage) => {
      assert.equal(model.getProblems(conceptId, stage).length, 3, `${conceptId}:${stage}`);
      const lesson = content.get(conceptId, stage);
      assert.ok(lesson.thinkingMethod);
      assert.ok(lesson.firstCondition);
      assert.ok(lesson.conceptToUse);
      assert.ok(lesson.whyEquation);
      assert.ok(lesson.solutionConnection);
      assert.ok(lesson.commonMistake);
      assert.ok(lesson.validationMethod);
    });
  });
});

test("첫 스프링 사이클은 세 BASIC 진도로 시작하고 20~35문항을 만든다", () => {
  const state = runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "cycle-1",
  });
  assert.ok(state.cycleItems.length >= 20 && state.cycleItems.length <= 35);
  assert.deepEqual(state.cycleTargets, {
    m3_quadratic_function_meaning: "BASIC",
    m3_quadratic_graph_shape: "BASIC",
    m3_quadratic_vertex_axis: "BASIC",
  });
  Object.entries(state.cycleTargets).forEach(([conceptId, stage]) => {
    const roles = state.cycleItems
      .filter((item) => item.purpose === "LEARNING" && item.conceptId === conceptId && item.stage === stage)
      .map((item) => item.contentRole);
    assert.deepEqual(roles, ["LEARNING_EXAMPLE", "LEARNING_PRACTICE", "LEARNING_FINAL_CHECK"]);
  });
});

test("한 사이클은 problemId·structureSignature·solutionPathSignature를 중복하지 않는다", () => {
  const state = runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "unique-cycle",
  });
  assert.equal(new Set(state.cycleProblemIds).size, state.cycleProblemIds.length);
  assert.equal(new Set(state.cycleItems.map((item) => item.structureSignature)).size, state.cycleItems.length);
  assert.equal(new Set(state.cycleItems.map((item) => item.solutionPathSignature)).size, state.cycleItems.length);
  state.cycleItems.forEach((item) => {
    const problem = model.problemsById[item.problemId];
    assert.ok(problem);
    assert.equal(item.contentRole, problem.contentRole);
    assert.deepEqual(item.reasoningGoals, problem.reasoningGoals);
  });
});

test("직접 A5를 열면 viewed만 기록되고 completed는 올라가지 않는다", () => {
  const conceptId = "m3_quadratic_graph_shape";
  const state = runtime.startCycle(runtime.createDefaultState("student"), {
    conceptId,
    stage: "A5",
    resume: false,
    idFactory: () => "direct-a5",
  });
  assert.ok(state.viewedStages[conceptId].includes("A5"));
  assert.equal(state.masteryDepthByConcept[conceptId].learningCompletedStage, null);
  assert.equal(state.masteryDepthByConcept[conceptId].stageStatus.A5, "NOT_STARTED");
});

test("오답은 정답과 전체 풀이를 공개하지 않고 힌트 상태를 저장한다", () => {
  const problem = model.problems.find((item) => item.answerType === "MULTIPLE_CHOICE");
  let state = singleProblemState(problem);
  const wrong = problem.choices.find((choice) => choice !== problem.correctAnswer);
  const submitted = runtime.submitAnswer(state, wrong, {
    now: () => 10,
    idFactory: () => "wrong",
  });
  assert.equal(submitted.result.status, "INCORRECT");
  assert.equal(submitted.finalized, false);
  state = submitted.state;
  const feedback = runtime.getFeedback(state, problem.problemId);
  assert.equal(feedback.type, "INCORRECT");
  assert.equal(feedback.text.includes(String(problem.correctAnswer)), false);
  assert.equal(feedback.text.includes(problem.solutionPath.join(" → ")), false);
  const hinted = runtime.useHint(state, () => 20);
  assert.equal(hinted.level, 1);
  assert.ok(hinted.hint);
  assert.equal(runtime.getHintCount(hinted.state, problem.problemId), 1);
});

test("풀이 보기는 시도 또는 힌트 뒤에만 열리고 FINAL 및 재연습으로 저장된다", () => {
  const problem = model.problems.find((item) => item.answerType === "MULTIPLE_CHOICE");
  let state = singleProblemState(problem);
  assert.equal(runtime.revealSolution(state).revealed, false);
  state = runtime.useHint(state, () => 10).state;
  const revealed = runtime.revealSolution(state, {
    now: () => 20,
    idFactory: () => "solution",
  });
  assert.equal(revealed.revealed, true);
  state = revealed.state;
  assert.equal(runtime.getFinalizedAttempt(state, problem.problemId).result.status, "SOLUTION_VIEWED");
  assert.equal(runtime.getFeedback(state, problem.problemId).text, problem.solutionPath.join(" → "));
  const alternate = state.cycleItems.find((item) => item.purpose === "RE_PRACTICE");
  assert.ok(alternate);
  assert.notEqual(alternate.problemId, problem.problemId);
  assert.notEqual(alternate.structureSignature, problem.structureSignature);
  assert.notEqual(alternate.solutionPathSignature, problem.solutionPathSignature);
});

test("이미 사이클에 있는 같은 사고 목표의 다른 구조 문제를 재연습으로 연결한다", () => {
  let state = runtime.createDefaultState("re-practice-user", () => 1);
  state = runtime.startCycle(state, { now: () => 2, idFactory: () => "cycle" });
  const problem = runtime.currentProblem(state);
  const wrong = problem.choices.find((choice) => choice !== problem.correctAnswer);
  const submitted = runtime.submitAnswer(state, wrong, {
    now: () => 3,
    idFactory: () => "wrong",
  });
  const linked = submitted.state.cycleItems.find((item) => (
    Array.isArray(item.rePracticeForProblemIds)
    && item.rePracticeForProblemIds.includes(problem.problemId)
  ));
  assert.ok(linked);
  assert.notEqual(linked.problemId, problem.problemId);
  assert.notEqual(linked.structureSignature, problem.structureSignature);
  assert.notEqual(linked.solutionPathSignature, problem.solutionPathSignature);
  assert.equal(submitted.state.cycleItems.length, 20);
});

test("다섯 answerType 모두 실제 제출·채점·FINAL 잠금이 작동한다", () => {
  const types = ["MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE"];
  types.forEach((answerType, index) => {
    const problem = model.problems.find((item) => item.answerType === answerType);
    let state = singleProblemState(problem, `cycle-${answerType}`);
    const submitted = runtime.submitAnswer(state, problem.correctAnswer, {
      now: () => 100 + index,
      idFactory: () => answerType.toLowerCase(),
    });
    assert.equal(submitted.accepted, true, answerType);
    assert.equal(submitted.finalized, true, answerType);
    assert.ok(["CORRECT", "REVIEW_REQUIRED"].includes(submitted.result.status), answerType);
    state = submitted.state;
    const duplicate = runtime.submitAnswer(state, problem.correctAnswer);
    assert.equal(duplicate.accepted, false, answerType);
    assert.equal(duplicate.reason, "FINAL_LOCKED", answerType);
  });
});

test("FINAL 잠금은 같은 사이클에 적용되고 뒤 사이클의 재사용 답안을 오염시키지 않는다", () => {
  const problem = model.problems[0];
  let state = singleProblemState(problem, "cycle-a");
  state = runtime.submitAnswer(state, problem.correctAnswer, {
    now: () => 1,
    idFactory: () => "a",
  }).state;
  assert.ok(runtime.getFinalizedAttempt(state, problem.problemId));
  state.activeLearningCycleId = "cycle-b";
  state.cycleStatus = "ACTIVE";
  state = runtime.normalizeState(state, state.userId);
  assert.equal(runtime.getFinalizedAttempt(state, problem.problemId), null);
  const next = runtime.submitAnswer(state, problem.correctAnswer, {
    now: () => 2,
    idFactory: () => "b",
  });
  assert.equal(next.accepted, true);
  assert.equal(Object.keys(next.state.finalizedAttempts).length, 2);
});

test("중단·직렬화·원격 hydrate 후 문제 위치와 답안·힌트·FINAL을 복원한다", () => {
  let state = runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "restore",
  });
  const first = runtime.currentProblem(state);
  state = runtime.markContentViewed(state, first.conceptId, first.stage, () => 1);
  state = runtime.useHint(state, () => 2).state;
  state = runtime.submitAnswer(state, first.correctAnswer, {
    now: () => 3,
    idFactory: () => "restore-answer",
  }).state;
  state = runtime.advance(state, () => 4);
  const second = runtime.currentProblem(state);
  state = runtime.setDraftAnswer(state, second.problemId, "임시 답안", () => 5);
  state = runtime.pauseCycle(state, () => 6);
  const remote = runtime.serializeState(state);
  const restored = runtime.resolveHydrationState(remote, null, "student").state;
  assert.equal(restored.currentProblemIndex, 1);
  assert.equal(restored.cycleStatus, "PAUSED");
  assert.equal(runtime.getFinalizedAttempt(restored, first.problemId).attemptStatus, "FINAL");
  assert.equal(runtime.getHintCount(restored, first.problemId), 1);
  assert.equal(runtime.getDraftAnswer(restored, second.problemId), "임시 답안");
});

test("Firebase 원격 상태가 오래된 로컬 캐시보다 항상 우선한다", () => {
  let remote = runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "remote",
  });
  remote.currentProblemIndex = 4;
  remote.revision = 9;
  remote.updatedAt = "2026-07-23T01:00:00.000Z";
  const local = runtime.serializeState(remote);
  local.currentProblemIndex = 8;
  local.revision = 12;
  local.updatedAt = "2026-07-23T02:00:00.000Z";
  const resolved = runtime.resolveHydrationState(remote, local, "student");
  assert.equal(resolved.source, "REMOTE");
  assert.equal(resolved.conflict, "remoteWins");
  assert.equal(resolved.state.currentProblemIndex, 4);
  assert.equal(resolved.state.revision, 9);
});

test("BASIC 진도와 concept별 심화 깊이는 서로 분리된다", () => {
  let state = runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "progress-1",
  });
  state = completeCycle(state);
  assert.deepEqual(state.curriculumProgress.completedBasicConceptIds, [
    "m3_quadratic_function_meaning",
    "m3_quadratic_graph_shape",
    "m3_quadratic_vertex_axis",
  ]);
  assert.equal(state.curriculumProgress.nextBasicConceptId, "m3_quadratic_translation");
  assert.equal(state.masteryDepthByConcept.m3_quadratic_function_meaning.learningCompletedStage, "BASIC");
  assert.equal(state.masteryDepthByConcept.m3_quadratic_translation.learningCompletedStage, null);
});

test("한 conceptId의 공식 학습 완료 단계는 한 사이클에 최대 한 단계 상승한다", () => {
  let state = runtime.createDefaultState("student");
  const before = Object.fromEntries(runtime.CONCEPT_IDS.map((conceptId) => [
    conceptId,
    runtime.STAGES.indexOf(state.masteryDepthByConcept[conceptId].learningCompletedStage),
  ]));
  state = completeCycle(runtime.startCycle(state, { idFactory: () => "one-rise" }));
  runtime.CONCEPT_IDS.forEach((conceptId) => {
    const after = runtime.STAGES.indexOf(state.masteryDepthByConcept[conceptId].learningCompletedStage);
    assert.ok(after - before[conceptId] <= 1, conceptId);
  });
});

test("두 번째와 세 번째 사이클은 새 BASIC과 이전 concept 심화를 스프링형으로 섞는다", () => {
  let state = completeCycle(runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "spring-1",
  }));
  state = runtime.startCycle(state, { resume: false, idFactory: () => "spring-2" });
  assert.deepEqual(state.cycleTargets, {
    m3_quadratic_translation: "BASIC",
    m3_quadratic_find_formula: "BASIC",
    m3_quadratic_function_meaning: "A1",
    m3_quadratic_graph_shape: "A1",
  });
  state = completeCycle(state);
  state = runtime.startCycle(state, { resume: false, idFactory: () => "spring-3" });
  assert.deepEqual(state.cycleTargets, {
    m3_quadratic_max_min: "BASIC",
    m3_quadratic_vertex_axis: "A1",
    m3_quadratic_translation: "A1",
  });
});

test("BASIC 진도 뒤에는 A1과 A2가 서로 다른 conceptId에서 누적된다", () => {
  let state = runtime.createDefaultState("student");
  for (let cycle = 1; cycle <= 3; cycle += 1) {
    state = completeCycle(runtime.startCycle(state, {
      resume: false,
      idFactory: () => `accumulate-${cycle}`,
    }));
  }
  state = runtime.startCycle(state, {
    resume: false,
    idFactory: () => "accumulate-4",
  });
  const targetStages = Object.values(state.cycleTargets);
  assert.ok(targetStages.includes("A1"));
  assert.ok(targetStages.includes("A2"));
  assert.ok(new Set(Object.keys(state.cycleTargets)).size >= 3);
});

test("독립 확인 문제는 학습 문제·구조·풀이 경로와 분리된다", () => {
  let state = completeCycle(runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "learn",
  }));
  const checks = state.pendingIndependentChecks.map((check) => ({ ...check }));
  state = runtime.startCycle(state, { resume: false, idFactory: () => "verify" });
  const independentItems = state.cycleItems.filter((item) => item.purpose === "INDEPENDENT_CHECK");
  assert.ok(independentItems.length > 0);
  independentItems.forEach((item) => {
    const check = checks.find((candidate) => candidate.checkId === item.checkId);
    assert.ok(check);
    assert.equal(check.learningProblemIds.includes(item.problemId), false);
    assert.equal(check.learningStructureSignatures.includes(item.structureSignature), false);
    assert.equal(check.learningSolutionPathSignatures.includes(item.solutionPathSignature), false);
  });
});

test("최근 사용 목록이 후보를 모두 막아도 학습 문제와 다른 독립 확인은 배치된다", () => {
  const conceptId = "m3_quadratic_function_meaning";
  const basicProblems = model.getProblems(conceptId, "BASIC");
  const checkProblems = model.getProblems(conceptId, "A1");
  let state = runtime.createDefaultState("independent-fallback-user", () => 1);
  state.activeCycleNumber = 4;
  state.pendingIndependentChecks = [{
    checkId: "check:recent-fallback",
    conceptId,
    stage: "BASIC",
    checkStage: "A1",
    status: "PENDING",
    learningProblemIds: basicProblems.map((problem) => problem.problemId),
    learningStructureSignatures: basicProblems.map((problem) => problem.structureSignature),
    learningSolutionPathSignatures: basicProblems.map((problem) => problem.solutionPathSignature),
  }];
  state.recentProblemIds = checkProblems.map((problem) => problem.problemId);
  state.recentStructureSignatures = checkProblems.map((problem) => problem.structureSignature);
  state.recentSolutionPathSignatures = checkProblems.map((problem) => problem.solutionPathSignature);
  state = runtime.startCycle(state, { now: () => 2, idFactory: () => "fallback" });
  const check = state.cycleItems.find((item) => item.purpose === "INDEPENDENT_CHECK");
  assert.ok(check);
  assert.equal(check.checkId, "check:recent-fallback");
  assert.equal(basicProblems.some((problem) => problem.problemId === check.problemId), false);
  assert.equal(basicProblems.some((problem) => problem.structureSignature === check.structureSignature), false);
  assert.equal(basicProblems.some((problem) => problem.solutionPathSignature === check.solutionPathSignature), false);
});

test("독립 확인과 정규 학습 목표가 같은 concept-stage면 독립 확인만 다음 사이클로 미룬다", () => {
  const conceptId = "m3_quadratic_function_meaning";
  const basicProblems = model.getProblems(conceptId, "BASIC");
  let state = runtime.createDefaultState("independent-target-collision-user", () => 1);
  state.activeCycleNumber = 4;
  state.curriculumProgress.completedBasicConceptIds = [...runtime.CONCEPT_IDS];
  state.curriculumProgress.nextBasicConceptId = null;
  state.masteryDepthByConcept[conceptId].learningCompletedStage = "BASIC";
  state.masteryDepthByConcept[conceptId].stageStatus.BASIC = "INDEPENDENT_CHECK_PENDING";
  state.pendingIndependentChecks = [{
    checkId: "check:no-target-collision",
    conceptId,
    stage: "BASIC",
    checkStage: "A1",
    status: "PENDING",
    learningProblemIds: basicProblems.map((problem) => problem.problemId),
    learningStructureSignatures: basicProblems.map((problem) => problem.structureSignature),
    learningSolutionPathSignatures: basicProblems.map((problem) => problem.solutionPathSignature),
  }];
  state = runtime.startCycle(state, { now: () => 2, idFactory: () => "collision" });
  assert.equal(state.cycleItems.some((item) => (
    item.purpose === "INDEPENDENT_CHECK"
    && item.conceptId === conceptId
    && item.stage === "A1"
  )), false);
  assert.ok(state.cycleItems.some((item) => (
    item.purpose === "LEARNING"
    && item.conceptId === conceptId
    && item.stage === "A1"
  )));
  assert.equal(state.cycleTargets[conceptId], "A1");
  assert.ok(state.pendingIndependentChecks.some((check) => check.checkId === "check:no-target-collision"));
});

test("Firebase 직렬화에는 필수 학습·복원 필드가 모두 포함된다", () => {
  const payload = runtime.serializeState(runtime.startCycle(runtime.createDefaultState("student"), {
    idFactory: () => "payload",
  }));
  [
    "learningVersion",
    "activeLearningCycleId",
    "cycleStatus",
    "cycleProblemIds",
    "currentProblemIndex",
    "submittedAnswers",
    "finalizedAttempts",
    "currentConceptId",
    "currentStage",
    "curriculumProgress",
    "masteryDepthByConcept",
    "viewedStages",
    "completedLessons",
    "hintsUsed",
    "solutionsViewed",
    "independentPracticeResults",
    "pendingIndependentChecks",
    "lastLearningPosition",
    "returnCheckpoint",
    "updatedAt",
  ].forEach((field) => assert.ok(Object.hasOwn(payload, field), field));
  assert.doesNotThrow(() => JSON.stringify(payload));
});
