const test = require("node:test");
const assert = require("node:assert/strict");

const runtimeModule = require("../elite-runtime.js");

function engine() {
  let now = 1_800_000_000_000;
  return runtimeModule.createEngine({
    now: () => (now += 1000),
    random: () => 0.1234,
  });
}

function answerCurrentCorrect(runtime, state) {
  const problem = runtime.getCurrentProblem(state);
  return runtime.submitCurrent(state, problem.correctAnswer, { problemId: problem.problemId });
}

test("승인된 수학 42문항과 영어 40문항만 로딩한다", () => {
  const runtime = engine();
  assert.equal(runtime.getProblems("math").length, 42);
  assert.equal(runtime.getProblems("english").length, 40);
  assert.equal(runtime.getProblems("math").filter((item) => item.eliteLevel === "HIGH").length, 21);
  assert.equal(runtime.getProblems("english").filter((item) => item.eliteLevel === "TOP").length, 20);
});

test("source answerType 별칭을 표준형으로 정규화한다", () => {
  const runtime = engine();
  const mathTypes = new Set(runtime.getProblems("math").map((item) => item.answerType));
  assert.deepEqual([...mathTypes].sort(), [
    "EXPRESSION_INPUT",
    "MULTIPLE_CHOICE",
    "SHORT_ANSWER",
    "STEP_ORDER",
    "WRITTEN_RESPONSE",
  ]);
  assert.throws(() => runtimeModule.normalizeAnswerType("FREE_TEXT"), /UNSUPPORTED_ELITE_ANSWER_TYPE/);
});

test("과학·한자·독서는 직접 호출로도 시작할 수 없다", () => {
  const runtime = engine();
  ["science", "과학", "hanja", "한자", "reading", "독서"].forEach((subject) => {
    assert.throws(() => runtime.createSession(subject, { uid: "student-1" }), /ELITE_SUBJECT_NOT_ALLOWED/);
  });
});

test("UID가 있어야 middle3 HIGH 세션을 시작한다", () => {
  const runtime = engine();
  assert.throws(() => runtime.createSession("math", {}), /ELITE_AUTH_REQUIRED/);
  const state = runtime.createSession("수학", { uid: "student-1" });
  assert.equal(state.gradeOrLevel, "middle3");
  assert.equal(state.currentEliteLevel, "HIGH");
  assert.equal(state.challengeLevel, "HIGH");
  assert.equal(state.sessionProblemIds.length, 7);
  assert.ok(state.sessionProblemIds.every((id) => runtime.getProblem(id).eliteLevel === "HIGH"));
});

test("HIGH 증거가 부족하면 TOP으로 이동하지 않는다", () => {
  const runtime = engine();
  let state = runtime.createSession("math", { uid: "student-1" });
  for (let index = 0; index < 4; index += 1) state = answerCurrentCorrect(runtime, state);
  assert.equal(state.currentEliteLevel, "HIGH");
  assert.equal(state.sessionProblemIds.filter((id) => runtime.getProblem(id).eliteLevel === "TOP").length, 0);
});

test("서로 다른 영역의 HIGH 5문항을 안정적으로 해결하면 TOP 문항을 추가한다", () => {
  const runtime = engine();
  let state = runtime.createSession("math", { uid: "student-1" });
  for (let index = 0; index < 5; index += 1) state = answerCurrentCorrect(runtime, state);
  assert.equal(state.currentEliteLevel, "TOP");
  assert.equal(state.stableLevel, "HIGH");
  assert.equal(state.challengeLevel, "TOP");
  assert.equal(state.sessionProblemIds.filter((id) => runtime.getProblem(id).eliteLevel === "TOP").length, 5);
});

test("오답은 같은 오류의 다른 구조 재확인을 예약한다", () => {
  const runtime = engine();
  let state = runtime.createSession("math", { uid: "student-1" });
  const problem = runtime.getCurrentProblem(state);
  const wrong = problem.choices.find((choice) => choice !== problem.correctAnswer);
  state = runtime.submitCurrent(state, wrong, { problemId: problem.problemId });
  assert.equal(state.pendingRechecks.length, 1);
  const recheck = state.pendingRechecks[0];
  assert.notEqual(recheck.targetProblemId, problem.problemId);
  if (recheck.targetProblemId) {
    assert.notEqual(runtime.getProblem(recheck.targetProblemId).structureSignature, problem.structureSignature);
  }
  assert.equal(state.errorEvidence[0].errorCode, problem.distractorErrorMap[wrong].code);
});

test("비객관식 재확인 실패도 원래 목표 오류코드로 누적한다", () => {
  const runtime = engine();
  let state = runtime.createSession("math", { uid: "student-1" });
  const source = runtime.getCurrentProblem(state);
  const wrong = source.choices.find((choice) => (
    choice !== source.correctAnswer
    && source.distractorErrorMap[choice].code === "CALCULATION_ERROR"
  ));
  state = runtime.submitCurrent(state, wrong, { problemId: source.problemId });
  const recheck = state.pendingRechecks[0];
  const target = runtime.getProblem(recheck.targetProblemId);
  state.currentProblemIndex = state.sessionProblemIds.indexOf(target.problemId);
  state = runtime.submitCurrent(state, "틀린 답", { problemId: target.problemId });
  const targetAttempt = state.finalizedAttempts[target.problemId];
  assert.equal(targetAttempt.errorCode, "CALCULATION_ERROR");
});

test("세션 문항은 problemId·구조·풀이경로를 중복하지 않는다", () => {
  const runtime = engine();
  let state = runtime.createSession("english", { uid: "student-1" });
  for (let index = 0; index < 5; index += 1) state = answerCurrentCorrect(runtime, state);
  const problems = state.sessionProblemIds.map((id) => runtime.getProblem(id));
  assert.equal(new Set(problems.map((item) => item.problemId)).size, problems.length);
  assert.equal(new Set(problems.map((item) => item.structureSignature)).size, problems.length);
  assert.equal(new Set(problems.map((item) => item.solutionPathSignature)).size, problems.length);
});

test("제출 답안은 FINAL로 잠기고 같은 문제를 다시 제출할 수 없다", () => {
  const runtime = engine();
  const initial = runtime.createSession("math", { uid: "student-1" });
  const problem = runtime.getCurrentProblem(initial);
  const state = answerCurrentCorrect(runtime, initial);
  assert.equal(state.finalizedAttempts[problem.problemId].attemptStatus, "FINAL");
  assert.ok(state.finalizedAttempts[problem.problemId].submissionId);
  const rewound = { ...state, currentProblemIndex: 0 };
  assert.throws(
    () => runtime.submitCurrent(rewound, problem.correctAnswer, { problemId: problem.problemId }),
    /ELITE_ATTEMPT_ALREADY_FINAL/
  );
});

test("Firebase READY 전에는 제출과 모름 처리를 차단한다", () => {
  const runtime = engine();
  const state = runtime.createSession("math", {
    uid: "student-1",
    cloudHydrationStatus: "LOADING",
  });
  const problem = runtime.getCurrentProblem(state);
  assert.throws(() => runtime.submitCurrent(state, problem.correctAnswer), /ELITE_CLOUD_NOT_READY/);
  assert.throws(() => runtime.markUnknown(state), /ELITE_CLOUD_NOT_READY/);
});

test("모르겠어요는 FINAL 접근 실패 증거와 재확인을 만든다", () => {
  const runtime = engine();
  const initial = runtime.createSession("english", { uid: "student-1" });
  const problem = runtime.getCurrentProblem(initial);
  const state = runtime.markUnknown(initial, { problemId: problem.problemId });
  const attempt = state.finalizedAttempts[problem.problemId];
  assert.equal(attempt.evaluationStatus, "UNKNOWN");
  assert.equal(attempt.unknown, true);
  assert.equal(attempt.attemptStatus, "FINAL");
  assert.equal(state.pendingRechecks.length, 1);
  assert.equal(state.confirmedWeaknesses.length, 0);
});

test("과정형·서술형의 비정형 답안은 검토 대기로 저장하고 상승 증거에서 제외한다", () => {
  const runtime = engine();
  const processProblem = runtime.getProblems("math").find((item) => item.answerType === "STEP_ORDER");
  const base = runtime.createSession("math", { uid: "student-1" });
  const state = {
    ...base,
    sessionProblemIds: [processProblem.problemId],
    currentProblemIndex: 0,
    usedProblemIds: [processProblem.problemId],
  };
  const submitted = runtime.submitCurrent(state, "조건을 식으로 바꾸고 가능한 경우를 모두 확인했습니다.", {
    problemId: processProblem.problemId,
  });
  assert.equal(submitted.finalizedAttempts[processProblem.problemId].evaluationStatus, "REVIEW_REQUIRED");
  assert.equal(submitted.errorEvidence.length, 0);
});

test("시간 종료는 미제출 문제를 오답으로 만들지 않고 결과를 생성한다", () => {
  const runtime = engine();
  let state = runtime.createSession("math", { uid: "student-1" });
  state = answerCurrentCorrect(runtime, state);
  const before = Object.keys(state.finalizedAttempts).length;
  state = runtime.finishSession(state, "TIME_EXPIRED");
  assert.equal(state.sessionStatus, "COMPLETED");
  assert.equal(state.completionReason, "TIME_EXPIRED");
  assert.equal(Object.keys(state.finalizedAttempts).length, before);
  assert.ok(state.resultSummary);
});
