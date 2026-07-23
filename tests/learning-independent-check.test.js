const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../level-test-engine.js");

function createState(stageIndex = 1) {
  const state = engine.createStudentState({
    userId: "student@example.com",
    targetConceptIds: ["quadratic"],
    concepts: [
      { conceptId: "quadratic", title: "이차방정식", prerequisiteConceptIds: ["factorization"] },
      { conceptId: "factorization", title: "인수분해", prerequisiteConceptIds: [] },
    ],
  });
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  state.conceptMastery.quadratic.stageIndex = stageIndex;
  return state;
}

function createProblem(id, prompt, adaptiveLevel = 3) {
  return {
    id,
    questionId: id,
    conceptId: "quadratic",
    concept: "이차방정식",
    problem: prompt,
    questionText: prompt,
    answer: "1",
    choices: ["1", "2", "3", "4"],
    adaptiveLevel,
    difficulty: adaptiveLevel,
    problemType: "choice",
    prerequisiteConcepts: ["factorization"],
  };
}

function recordCompletion(state, sourceProblem, overrides = {}) {
  return engine.recordLearningCompletion(state, {
    conceptId: "quadratic",
    learnedStage: "ADVANCED_2",
    lessonId: "math-world-2-topic-3",
    recommendationId: "recommendation-1",
    practiceCorrectRate: 80,
    sourceProblems: [sourceProblem],
    ...overrides,
  });
}

test("learning completion is recorded once without changing the concept stage", () => {
  const state = createState(1);
  const source = createProblem("learned-source", "Solve x + 1 = 3.");
  const stageBefore = state.conceptMastery.quadratic.stageIndex;

  const first = recordCompletion(state, source);
  const duplicate = recordCompletion(state, source);

  assert.equal(first.created, true);
  assert.equal(duplicate.created, false);
  assert.equal(state.learningCompletionEvidence.length, 1);
  assert.deepEqual(state.pendingIndependentChecks, [first.evidence.evidenceId]);
  assert.equal(first.evidence.independentCheckStatus, "PENDING");
  assert.equal(first.evidence.learnedStage, "ADVANCED_2");
  assert.equal(state.conceptMastery.quadratic.stageIndex, stageBefore);
  assert.ok(first.evidence.sourceProblemFingerprints.includes(engine.problemFingerprint(source)));
  assert.ok(state.recentProblemIds.includes(source.id));
  assert.ok(state.recentStructureSignatures.includes(engine.structureSignature(source)));
});

test("the next cycle checks the learned stage with a new structure and one correct answer does not promote", () => {
  const state = createState(1);
  const source = createProblem("learned-source", "Solve x + 1 = 3.");
  const numericVariant = createProblem("numeric-variant", "Solve x + 2 = 5.");
  const newStructure = createProblem("new-structure", "Choose the graph that has two x-intercepts.");
  const completion = recordCompletion(state, source);
  const stageBefore = state.conceptMastery.quadratic.stageIndex;

  const selected = engine.selectNextProblem(state, [source, numericVariant, newStructure]);

  assert.equal(selected.id, newStructure.id);
  assert.equal(selected.targetPurpose, engine.PURPOSES.INDEPENDENT_LEARNING_CHECK);
  assert.equal(selected.learningEvidenceId, completion.evidence.evidenceId);
  assert.equal(selected.stageName, "ADVANCED_2");
  assert.notEqual(selected.generationFingerprint, engine.problemFingerprint(source));
  assert.notEqual(selected.structureSignature, engine.structureSignature(source));

  engine.recordOutcome(state, selected, "correct", 9);

  assert.equal(completion.evidence.independentCheckStatus, "PASSED");
  assert.equal(state.pendingIndependentChecks.includes(completion.evidence.evidenceId), false);
  assert.equal(state.conceptMastery.quadratic.stageIndex, stageBefore);
  assert.equal(state.conceptMastery.quadratic.lastPromotedCycle, 0);
});

test("a wrong independent check keeps the stage and schedules another new structure", () => {
  const state = createState(3);
  const source = createProblem("learned-source", "Solve x + 1 = 3.");
  const firstCheck = createProblem("first-check", "Choose the graph that has two x-intercepts.");
  const secondCheck = createProblem("second-check", "Which ordered pair satisfies the equation?");
  const completion = recordCompletion(state, source);
  const stageBefore = state.conceptMastery.quadratic.stageIndex;

  const selected = engine.selectNextProblem(state, [firstCheck]);
  engine.recordOutcome(state, selected, "wrong", 12);

  assert.equal(completion.evidence.independentCheckStatus, "FAILED");
  assert.ok(state.pendingIndependentChecks.includes(completion.evidence.evidenceId));
  assert.equal(state.conceptMastery.quadratic.stageIndex, stageBefore);
  assert.ok(state.pendingRechecks.some((item) => item.conceptId === "quadratic"));

  engine.completeCycle(state);
  const retry = engine.selectNextProblem(state, [firstCheck, secondCheck]);

  assert.equal(retry.id, secondCheck.id);
  assert.equal(retry.targetPurpose, engine.PURPOSES.INDEPENDENT_LEARNING_CHECK);
  assert.notEqual(retry.structureSignature, selected.structureSignature);
});

test("giving up fails the independent check and starts prerequisite rediagnosis without lowering the stage", () => {
  const state = createState(2);
  const source = createProblem("learned-source", "Solve x + 1 = 3.");
  const check = createProblem("giveup-check", "Choose the graph that has two x-intercepts.");
  const completion = recordCompletion(state, source);
  const stageBefore = state.conceptMastery.quadratic.stageIndex;
  const selected = engine.selectNextProblem(state, [check]);

  engine.recordOutcome(state, selected, "giveup", 6);

  assert.equal(completion.evidence.independentCheckStatus, "FAILED");
  assert.ok(state.pendingIndependentChecks.includes(completion.evidence.evidenceId));
  assert.equal(state.conceptMastery.quadratic.stageIndex, stageBefore);
  assert.equal(state.conceptMastery.quadratic.status, "RECOVERY_REQUIRED");
  assert.equal(state.recoveryStack.at(-1).recoveryConceptId, "factorization");
});

test("student messages and the Firebase-synced memory connection remain visible in the app", () => {
  const root = path.resolve(__dirname, "..");
  const learning = fs.readFileSync(path.join(root, "learning.js"), "utf8");
  const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

  assert.match(learning, /학습을 마쳤어요\. 다음 레벨테스트에서 새 문제로 다시 확인합니다\./);
  assert.match(script, /잘 적용했어요\./);
  assert.match(script, /다른 문제에서 다시 확인합니다\./);
  assert.match(script, /다음 문제로 넘어갑니다\./);
  assert.match(learning, /persistMiddle3RecommendationMemory\(memory, "learning-completion-evidence"\)/);
  assert.match(script, /memory: memory \? JSON\.parse\(JSON\.stringify\(memory\)\) : null/);
  assert.match(html, /level-test-engine\.js\?v=middle3-p0-stability-v2/);
});
