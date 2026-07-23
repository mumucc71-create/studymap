const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("../level-test-engine.js");

function createState() {
  return engine.createStudentState({
    userId: "student@example.com",
    targetConceptIds: ["quadratic"],
    concepts: [
      { conceptId: "quadratic", title: "이차방정식", prerequisiteConceptIds: ["factorization"] },
      { conceptId: "factorization", title: "인수분해", prerequisiteConceptIds: ["expression"] },
      { conceptId: "expression", title: "문자식", prerequisiteConceptIds: [] },
    ],
  });
}

function createProblem(index, conceptId = "quadratic", overrides = {}) {
  const structureMarker = String.fromCharCode(0xac00 + index);
  return {
    id: `${conceptId}-${index}`,
    questionId: `${conceptId}-${index}`,
    conceptId,
    concept: conceptId,
    problem: `서로 다른 구조 ${structureMarker}에서 답을 구하세요`,
    questionText: `서로 다른 구조 ${structureMarker}에서 답을 구하세요`,
    answer: "1",
    choices: ["1", "2", "3", "4"],
    difficulty: 1,
    adaptiveLevel: 1,
    prerequisiteConcepts: conceptId === "quadratic" ? ["factorization"] : [],
    ...overrides,
  };
}

test("bootstrap results seed candidates, unstable concepts, and recovery", () => {
  const state = createState();
  engine.applyBootstrapResults(state, [
    { problemId: "q1", conceptId: "quadratic", concept: "이차방정식", outcome: "correct", fingerprint: "q-a" },
    { problemId: "q2", conceptId: "quadratic", concept: "이차방정식", outcome: "correct", fingerprint: "q-b" },
    { problemId: "f1", conceptId: "factorization", concept: "인수분해", outcome: "correct", fingerprint: "f-a" },
    { problemId: "f2", conceptId: "factorization", concept: "인수분해", outcome: "wrong", fingerprint: "f-b" },
    { problemId: "e1", conceptId: "expression", concept: "문자식", outcome: "giveup", fingerprint: "e-a" },
  ]);

  assert.equal(state.bootstrap.completed, true);
  assert.equal(state.phase, engine.PHASE_CYCLING);
  assert.equal(state.conceptMastery.quadratic.status, "STAGE_CANDIDATE");
  assert.equal(state.conceptMastery.factorization.status, "UNSTABLE");
  assert.equal(state.conceptMastery.expression.status, "RECOVERY_REQUIRED");
  assert.ok(state.pendingRechecks.some((item) => item.conceptId === "factorization"));
  assert.deepEqual(state.recentProblemIds, ["q1", "q2", "f1", "f2", "e1"]);
  assert.ok(state.recentFingerprints.includes("q-a"));
});

test("cycle selection does not repeat a bootstrap problem or its numeric structure", () => {
  const state = createState();
  const bootstrapProblem = createProblem(1, "quadratic", { problem: "x + 1 = 3의 해는?" });
  const numericVariant = createProblem(2, "quadratic", { problem: "x + 2 = 5의 해는?" });
  const differentStructure = createProblem(3, "quadratic", { problem: "두 수의 곱을 이용해 근을 찾으세요" });
  engine.applyBootstrapResults(state, [{
    problemId: bootstrapProblem.id,
    conceptId: bootstrapProblem.conceptId,
    concept: bootstrapProblem.concept,
    outcome: "correct",
    generationFingerprint: engine.problemFingerprint(bootstrapProblem),
    structureSignature: engine.structureSignature(bootstrapProblem),
    solutionPathSignature: engine.solutionPathSignature(bootstrapProblem),
  }]);

  const selected = engine.selectNextProblem(state, [bootstrapProblem, numericVariant, differentStructure]);
  assert.equal(selected.id, differentStructure.id);
});

test("a completed cycle starts another cycle instead of ending the session", () => {
  const state = createState();
  engine.applyBootstrapResults(state, [
    { problemId: "q1", conceptId: "quadratic", outcome: "correct", fingerprint: "q-a" },
    { problemId: "q2", conceptId: "quadratic", outcome: "correct", fingerprint: "q-b" },
  ]);
  const pool = Array.from({ length: 60 }, (_, index) => createProblem(index + 1));

  for (let index = 0; index < engine.DEFAULT_CYCLE_SIZE; index += 1) {
    const problem = engine.selectNextProblem(state, pool);
    assert.ok(problem, `사이클 ${index + 1}번 문항이 있어야 합니다.`);
    engine.recordOutcome(state, problem, "correct", 8);
  }

  assert.equal(state.activeCycle, null);
  assert.equal(state.session.active, true);
  assert.equal(state.cycleNumber, 1);
  assert.equal(state.conceptMastery.quadratic.stageIndex, 1);

  const nextCycleProblem = engine.selectNextProblem(state, pool);
  assert.ok(nextCycleProblem);
  assert.equal(state.cycleNumber, 2);
});

test("one wrong answer schedules rechecks without lowering the stage", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  state.conceptMastery.quadratic.stageIndex = 3;
  const problem = createProblem(1);
  engine.createCyclePlan(state);
  engine.recordOutcome(state, problem, "wrong", 20);

  assert.equal(state.conceptMastery.quadratic.stageIndex, 3);
  assert.ok(state.pendingRechecks.some((item) => item.conceptId === "quadratic" && item.remaining === 3));
});

test("give up creates a prerequisite recovery path and never counts as a wrong answer", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const problem = createProblem(1);
  engine.createCyclePlan(state);
  engine.recordOutcome(state, problem, "giveup", 5);

  assert.equal(state.totals.giveUp, 1);
  assert.equal(state.totals.wrong, 0);
  assert.equal(state.conceptMastery.quadratic.status, "RECOVERY_REQUIRED");
  assert.equal(state.recoveryStack.at(-1).recoveryConceptId, "factorization");
});

test("numeric variants share a structure signature and are not immediately repeated", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const first = createProblem(1, "quadratic", { problem: "x + 1 = 3의 해는?" });
  const numericVariant = createProblem(2, "quadratic", { problem: "x + 2 = 5의 해는?" });
  const differentStructure = createProblem(3, "quadratic", { problem: "두 수의 곱을 이용해 근을 찾으세요" });
  const pool = [first, numericVariant, differentStructure];

  const selected = engine.selectNextProblem(state, pool);
  engine.recordOutcome(state, selected, "correct", 4);
  const next = engine.selectNextProblem(state, pool);

  assert.notEqual(engine.problemFingerprint(first), engine.problemFingerprint(numericVariant));
  assert.equal(engine.structureSignature(first), engine.structureSignature(numericVariant));
  assert.equal(next.id, differentStructure.id);
});

test("lower-grade prerequisites are selected only for an active recovery path", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const pool = [createProblem(1, "factorization"), createProblem(2, "quadratic")];

  const regular = engine.selectNextProblem(state, pool);
  assert.equal(regular.conceptId, "quadratic");

  engine.recordOutcome(state, regular, "giveup", 4);
  state.activeCycle = null;
  engine.createCyclePlan(state);
  const recovery = engine.selectNextProblem(state, pool);
  assert.equal(recovery.conceptId, "factorization");
  assert.equal(recovery.targetPurpose, engine.PURPOSES.RECOVERY_LEARNING);
});

test("three successful prerequisite checks return to the original checkpoint", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  engine.createCyclePlan(state);
  engine.recordOutcome(state, createProblem(1), "giveup", 4);

  for (let index = 1; index <= 3; index += 1) {
    engine.recordOutcome(state, createProblem(index, "factorization", {
      targetPurpose: engine.PURPOSES.RECOVERY_LEARNING,
    }), "correct", 5);
  }

  assert.equal(state.recoveryStack.length, 0);
  assert.equal(state.returnCheckpoint, null);
  assert.equal(state.conceptMastery.quadratic.status, "CHECKPOINT_REQUIRED");
  assert.ok(state.pendingRechecks.some((item) => item.conceptId === "quadratic" && item.remaining === 3));
});

test("three distinct rechecks classify a one-off mistake without lowering stage", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  state.conceptMastery.quadratic.stageIndex = 2;
  engine.createCyclePlan(state);
  engine.recordOutcome(state, createProblem(1), "wrong", 8);

  for (let index = 2; index <= 4; index += 1) {
    engine.recordOutcome(state, createProblem(index, "quadratic", {
      targetPurpose: engine.PURPOSES.ERROR_RECHECK,
    }), "correct", 8);
  }

  const recheck = state.pendingRechecks.find((item) => item.conceptId === "quadratic");
  assert.equal(recheck.remaining, 0);
  assert.equal(state.conceptMastery.quadratic.status, "LIKELY_SLIP");
  assert.equal(state.conceptMastery.quadratic.stageIndex, 2);
});

test("spaced review follows the 3, 7, 14, 30 cycle sequence", () => {
  const state = createState();
  engine.applyBootstrapResults(state, [
    { problemId: "q1", conceptId: "quadratic", outcome: "correct", fingerprint: "q-a" },
    { problemId: "q2", conceptId: "quadratic", outcome: "correct", fingerprint: "q-b" },
  ]);
  assert.equal(state.conceptMastery.quadratic.nextReviewCycle, 3);

  state.cycleNumber = 2;
  const cycle = engine.createCyclePlan(state);
  cycle.slots[0] = engine.PURPOSES.SPACED_REVIEW;
  const reviewProblem = engine.selectNextProblem(state, [createProblem(10)]);
  assert.equal(reviewProblem.targetPurpose, engine.PURPOSES.SPACED_REVIEW);
  engine.recordOutcome(state, reviewProblem, "correct", 9);

  assert.equal(state.conceptMastery.quadratic.lastReviewCycle, 3);
  assert.equal(state.conceptMastery.quadratic.reviewMilestoneIndex, 1);
  assert.equal(state.conceptMastery.quadratic.nextReviewCycle, 10);
});

test("invalid choices are rejected before a problem can be selected", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const invalid = createProblem(1, "quadratic", {
    choices: ["1", "1", "2", "3"],
  });
  const valid = createProblem(2);
  const validation = engine.validateProblem(invalid);

  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.includes("DUPLICATE_CHOICES"));
  assert.equal(engine.selectNextProblem(state, [invalid, valid]).id, valid.id);
});

test("selected problems carry validation and structural signatures", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const selected = engine.selectNextProblem(state, [createProblem(20)]);

  assert.equal(selected.validationStatus, "VALID");
  assert.ok(selected.generationFingerprint);
  assert.ok(selected.structureSignature);
  assert.ok(selected.solutionPathSignature);
});

test("the engine retains 300 exact identities and short structural windows for repeat prevention", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;

  for (let index = 0; index < 310; index += 1) {
    const problem = createProblem(index, "quadratic", {
      generationFingerprint: `fingerprint-${index}`,
      structureSignature: `structure-${index}`,
      solutionPathSignature: `solution-${index}`,
      targetPurpose: engine.PURPOSES.CURRENT_STAGE_CHECK,
    });
    engine.recordOutcome(state, problem, "correct", 5);
  }

  assert.equal(state.recentProblemIds.length, 300);
  assert.equal(state.recentFingerprints.length, 300);
  assert.equal(state.recentStructureSignatures.length, 48);
  assert.equal(state.recentSolutionPathSignatures.length, 12);
  assert.equal(state.recentFingerprints[0], "fingerprint-10");
  assert.equal(state.recentFingerprints.at(-1), "fingerprint-309");
  assert.equal(state.recentStructureSignatures[0], "structure-262");
  assert.equal(state.recentSolutionPathSignatures[0], "solution-298");
});

test("cycle summaries distinguish completed prerequisite recovery", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  state.recoveryStack.push({ recoveryConceptId: "factorization" });
  engine.createCyclePlan(state);
  state.recoveryStack = [];

  const summary = engine.completeCycle(state);
  assert.equal(summary.recoveryCompleted, true);
});

test("an IN_PROGRESS attempt becomes FINAL once and duplicate grading is blocked", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const cycle = engine.createCyclePlan(state);
  const problem = createProblem(501, "quadratic", { cycleId: cycle.id });

  const started = engine.startAttempt(state, problem, { cycleId: cycle.id, startedAt: "2026-07-23T00:00:00.000Z" });
  assert.equal(started.created, true);
  assert.equal(started.attempt.attemptStatus, engine.ATTEMPT_STATUS.IN_PROGRESS);

  const first = engine.recordOutcome(state, problem, "correct", 7, {
    cycleId: cycle.id,
    submissionId: "submission-one",
    selectedAnswer: "1",
    finalizedAt: "2026-07-23T00:00:07.000Z",
  });
  const duplicate = engine.recordOutcome(state, problem, "wrong", 8, {
    cycleId: cycle.id,
    submissionId: "submission-two",
    selectedAnswer: "2",
  });

  assert.equal(first.duplicate, false);
  assert.equal(first.attempt.attemptStatus, engine.ATTEMPT_STATUS.FINAL);
  assert.equal(first.attempt.submissionId, "submission-one");
  assert.equal(first.attempt.selectedAnswer, "1");
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.attempt.submissionId, "submission-one");
  assert.equal(state.activeCycle.answers.length, 1);
  assert.deepEqual(state.totals, { solved: 1, correct: 1, wrong: 0, giveUp: 0 });
});

test("a give-up attempt is FINAL and cannot be answered afterward", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const cycle = engine.createCyclePlan(state);
  const problem = createProblem(502, "quadratic", { cycleId: cycle.id });
  const first = engine.recordOutcome(state, problem, "giveup", 4, {
    cycleId: cycle.id,
    submissionId: "giveup-one",
    selectedAnswer: "포기",
  });
  const duplicate = engine.recordOutcome(state, problem, "correct", 6, {
    cycleId: cycle.id,
    submissionId: "late-answer",
    selectedAnswer: "1",
  });

  assert.equal(first.attempt.attemptStatus, engine.ATTEMPT_STATUS.FINAL);
  assert.equal(first.attempt.outcome, "giveup");
  assert.equal(duplicate.duplicate, true);
  assert.deepEqual(state.totals, { solved: 1, correct: 0, wrong: 0, giveUp: 1 });
});

test("level-up rewardEventId is deterministic and cycle-scoped", () => {
  const rewardEventId = engine.createRewardEventId({
    userId: "student@example.com",
    conceptId: "quadratic",
    fromStage: "BASIC",
    toStage: "ADVANCED_1",
    cycleId: "cycle-7",
  });
  assert.equal(rewardEventId, "LEVEL_UP:student@example.com:quadratic:BASIC:ADVANCED_1:cycle-7");
  assert.equal(engine.createRewardEventId({ userId: "student@example.com" }), "");
});

test("strict math validation recalculates supported answers and rejects unsafe problems", () => {
  const manifest = (answer = "3", conditionsComplete = true) => ({
    validatorId: "STATIC_MANIFEST_V1",
    conditionsComplete,
    expectedPrompt: "√9 = ?",
    expectedAnswer: answer,
    expectedChoices: ["2", "3", "4", "9"],
    expectedAnswerType: "MULTIPLE_CHOICE",
    expectedGrade: 9,
    expectedConceptId: "quadratic",
    expectedStage: "BASIC",
  });
  const valid = createProblem(601, "quadratic", {
    problem: "√9 = ?",
    questionText: "√9 = ?",
    answer: "3",
    correctAnswer: "3",
    choices: ["2", "3", "4", "9"],
    gradeNumber: 9,
    answerType: "MULTIPLE_CHOICE",
    reviewStatus: "AUTO_APPROVED",
    executionStatus: "EXECUTABLE",
    mathValidation: manifest(),
  });
  const wrongCalculation = {
    ...valid,
    id: "wrong-calculation",
    questionId: "wrong-calculation",
    answer: "4",
    correctAnswer: "4",
    mathValidation: manifest("4"),
  };
  const insufficient = {
    ...valid,
    id: "insufficient",
    questionId: "insufficient",
    mathValidation: manifest("3", false),
  };
  const wrongGrade = { ...valid, id: "wrong-grade", questionId: "wrong-grade", gradeNumber: 8 };
  const wrongConcept = { ...valid, id: "wrong-concept", questionId: "wrong-concept", conceptId: "other" };
  const wrongStage = { ...valid, id: "wrong-stage", questionId: "wrong-stage", adaptiveLevel: 2, difficulty: 2 };
  const noValidator = createProblem(602, "quadratic", {
    problem: "x의 값을 고르세요.",
    questionText: "x의 값을 고르세요.",
    gradeNumber: 9,
    answerType: "MULTIPLE_CHOICE",
  });
  const context = {
    strictMathValidation: true,
    expectedGrade: 9,
    expectedConceptId: "quadratic",
    expectedStageIndex: 0,
  };

  assert.equal(engine.validateProblem(valid, context).isValid, true);
  assert.ok(engine.validateProblem(wrongCalculation, context).errors.includes("CALCULATED_ANSWER_MISMATCH"));
  assert.ok(engine.validateProblem(insufficient, context).errors.includes("INSUFFICIENT_CONDITIONS"));
  assert.ok(engine.validateProblem(wrongGrade, context).errors.includes("GRADE_MISMATCH"));
  assert.ok(engine.validateProblem(wrongConcept, context).errors.includes("CONCEPT_MISMATCH"));
  assert.ok(engine.validateProblem(wrongStage, context).errors.includes("STAGE_MISMATCH"));
  assert.ok(engine.validateProblem(noValidator, context).errors.includes("MISSING_MATH_VALIDATOR"));
});

test("selection records a rejected calculation and shows a valid alternative", () => {
  const state = createState();
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const base = {
    conceptId: "quadratic",
    concept: "quadratic",
    choices: ["2", "3", "4", "9"],
    gradeNumber: 9,
    answerType: "MULTIPLE_CHOICE",
    adaptiveLevel: 1,
    difficulty: 1,
    reviewStatus: "AUTO_APPROVED",
    executionStatus: "EXECUTABLE",
    code: "M3-STANDARD-APPROVED",
  };
  const makeManifest = (prompt, answer) => ({
    validatorId: "STATIC_MANIFEST_V1",
    conditionsComplete: true,
    expectedPrompt: prompt,
    expectedAnswer: answer,
    expectedChoices: base.choices,
    expectedAnswerType: "MULTIPLE_CHOICE",
    expectedGrade: 9,
    expectedConceptId: "quadratic",
    expectedStage: "BASIC",
  });
  const invalid = {
    ...base,
    id: "invalid-sqrt",
    questionId: "invalid-sqrt",
    problem: "√9 = ?",
    questionText: "√9 = ?",
    answer: "4",
    correctAnswer: "4",
    mathValidation: makeManifest("√9 = ?", "4"),
  };
  const valid = {
    ...base,
    id: "valid-sqrt",
    questionId: "valid-sqrt",
    problem: "√16 = ?",
    questionText: "√16 = ?",
    answer: "4",
    correctAnswer: "4",
    mathValidation: makeManifest("√16 = ?", "4"),
  };

  const selected = engine.selectNextProblem(state, [invalid, valid]);
  assert.equal(selected.id, "valid-sqrt");
  assert.ok(state.problemValidationFailures.some((failure) => (
    failure.problemId === "invalid-sqrt" && failure.errors.includes("CALCULATED_ANSWER_MISMATCH")
  )));
});
