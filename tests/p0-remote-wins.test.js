const test = require("node:test");
const assert = require("node:assert/strict");

global.window = global;
global.STUDY_AUTH_CONFIG = {};
require("../cloud-auth.js");

const sync = global.STUDY_MATH_CLOUD_SYNC;

function makeState({
  cycleId = "cycle-2",
  answers = 4,
  currentQuestion = answers,
  finals = answers,
  updatedAt = "2026-07-23T00:00:00.000Z",
  submissionPrefix = "remote",
} = {}) {
  const activeQuestions = Array.from({ length: 8 }, (_, index) => ({ id: `q${index + 1}`, cycleId }));
  const cycleAnswers = Array.from({ length: answers }, (_, index) => ({
    problemId: `q${index + 1}`,
    submissionId: `${submissionPrefix}-${index + 1}`,
  }));
  const attemptsByKey = Object.fromEntries(Array.from({ length: finals }, (_, index) => [
    `${cycleId}:q${index + 1}`,
    {
      problemId: `q${index + 1}`,
      activeCycleId: cycleId,
      attemptStatus: "FINAL",
      submissionId: `${submissionPrefix}-${index + 1}`,
    },
  ]));
  const activeCycle = { id: cycleId, number: 2, answers: cycleAnswers, targetSize: 24 };
  const resumeState = {
    currentQuestion,
    activeQuestions,
    selectedAnswers: Array.from({ length: Math.max(answers, currentQuestion) }, (_, index) => `answer-${index + 1}`),
    completed: false,
  };
  return {
    updatedAt,
    memory: { version: "test", activeCycle, attemptsByKey },
    resumeState,
    longTermState: { activeCycle, attemptsByKey, resumeState },
  };
}

test("remote answers 4 discard a local fifth answer and keep Firebase unchanged", () => {
  const remote = makeState({ answers: 4, currentQuestion: 4, finals: 4 });
  const local = makeState({ answers: 5, currentQuestion: 5, finals: 5, submissionPrefix: "local" });
  const resolved = sync.resolveMathHydrationState(remote, local.memory, local.resumeState);

  assert.equal(resolved.source, "REMOTE");
  assert.equal(resolved.conflict, true);
  assert.equal(resolved.discardedLocalAnswerCount, 1);
  assert.equal(sync.describeMathState(resolved.state).answersCount, 4);
  assert.equal(remote.longTermState.activeCycle.answers.length, 4);
});

test("local currentQuestion 5 is restored to remote currentQuestion 4", () => {
  const remote = makeState({ answers: 4, currentQuestion: 4, finals: 4 });
  const local = makeState({ answers: 4, currentQuestion: 5, finals: 4 });
  const resolved = sync.resolveMathHydrationState(remote, local.memory, local.resumeState);

  assert.equal(resolved.state.resumeState.currentQuestion, 4);
  assert.equal(sync.calculateRemoteCurrentQuestion(resolved.state), 4);
});

test("a local-only FINAL Q5 is discarded and Q5 remains unsubmitted", () => {
  const remote = makeState({ answers: 4, currentQuestion: 5, finals: 4 });
  const local = makeState({ answers: 5, currentQuestion: 5, finals: 5, submissionPrefix: "local" });
  const resolved = sync.resolveMathHydrationState(remote, local.memory, local.resumeState);
  const remoteAttempts = sync.mathStateParts(resolved.state).attemptsByKey;

  assert.equal(resolved.state.resumeState.currentQuestion, 4);
  assert.equal(remoteAttempts["cycle-2:q5"], undefined);
  assert.equal(resolved.state.resumeState.selectedAnswers[4], undefined);
});

test("submitting Q5 advances Firebase answers only from 4 to 5", () => {
  const current = makeState({ answers: 4, currentQuestion: 4, finals: 4 });
  const next = makeState({ answers: 5, currentQuestion: 5, finals: 5 });
  next.longTermState.attemptsByKey["cycle-2:q5"].submissionId = "submission-q5";
  next.memory.attemptsByKey["cycle-2:q5"].submissionId = "submission-q5";
  const result = sync.validateMathAttemptCommit(current, next, {
    cycleId: "cycle-2",
    problemId: "q5",
    submissionId: "submission-q5",
    expectedAnswerCount: 4,
    expectedCurrentQuestion: 4,
    expectedUpdatedAt: current.updatedAt,
  });

  assert.equal(result.ok, true);
  assert.equal(sync.describeMathState(next).answersCount - sync.describeMathState(current).answersCount, 1);
});

test("submitting the following Q6 advances Firebase answers only from 5 to 6", () => {
  const current = makeState({ answers: 5, currentQuestion: 5, finals: 5 });
  const next = makeState({ answers: 6, currentQuestion: 6, finals: 6 });
  next.longTermState.attemptsByKey["cycle-2:q6"].submissionId = "submission-q6";
  next.memory.attemptsByKey["cycle-2:q6"].submissionId = "submission-q6";
  const result = sync.validateMathAttemptCommit(current, next, {
    cycleId: "cycle-2",
    problemId: "q6",
    submissionId: "submission-q6",
    expectedAnswerCount: 5,
    expectedCurrentQuestion: 5,
    expectedUpdatedAt: current.updatedAt,
  });

  assert.equal(result.ok, true);
  assert.equal(sync.describeMathState(next).answersCount, 6);
});

test("discarded local answers are not copied into the resolved upload state", () => {
  const remote = makeState({ answers: 4, currentQuestion: 4, finals: 4 });
  const local = makeState({ answers: 6, currentQuestion: 6, finals: 6, submissionPrefix: "local" });
  const resolved = sync.resolveMathHydrationState(remote, local.memory, local.resumeState);

  assert.deepEqual(
    sync.mathStateParts(resolved.state).activeCycle.answers.map((answer) => answer.problemId),
    ["q1", "q2", "q3", "q4"],
  );
  assert.equal(sync.mathStateParts(resolved.state).attemptsByKey["cycle-2:q5"], undefined);
  assert.equal(sync.mathStateParts(resolved.state).attemptsByKey["cycle-2:q6"], undefined);
});

test("hydrate LOADING blocks a fast submission", () => {
  assert.equal(sync.canSubmitMathState("LOADING"), false);
  assert.equal(sync.canSubmitMathState("FAILED"), false);
  assert.equal(sync.canSubmitMathState("READY"), true);
});

test("a different local cycleId cannot replace the remote cycle", () => {
  const remote = makeState({ cycleId: "remote-cycle", answers: 4, finals: 4 });
  const local = makeState({ cycleId: "local-cycle", answers: 5, finals: 5 });
  const resolved = sync.resolveMathHydrationState(remote, local.memory, local.resumeState);

  assert.equal(resolved.conflict, true);
  assert.equal(sync.describeMathState(resolved.state).cycleId, "remote-cycle");
});

test("a concurrent second submission is rejected without a duplicate attempt", () => {
  const alreadyCommitted = makeState({ answers: 5, currentQuestion: 5, finals: 5 });
  const staleNext = makeState({ answers: 5, currentQuestion: 5, finals: 5 });
  staleNext.longTermState.attemptsByKey["cycle-2:q5"].submissionId = "second-submission";
  staleNext.memory.attemptsByKey["cycle-2:q5"].submissionId = "second-submission";
  const result = sync.validateMathAttemptCommit(alreadyCommitted, staleNext, {
    cycleId: "cycle-2",
    problemId: "q5",
    submissionId: "second-submission",
    expectedAnswerCount: 4,
    expectedCurrentQuestion: 4,
    expectedUpdatedAt: alreadyCommitted.updatedAt,
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "ANSWER_COUNT_MISMATCH");
  assert.equal(sync.describeMathState(alreadyCommitted).answersCount, 5);
});
