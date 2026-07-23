const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const engine = require("../level-test-engine.js");
const diagnostics = require("../middle3-concept-diagnostics.js");
const recommendations = require("../math-study-recommendations.js");

const root = path.resolve(__dirname, "..");

test("all eight middle3 units are split into enabled detailed concepts", () => {
  assert.equal(diagnostics.units.length, 8);
  assert.equal(diagnostics.concepts.length, 43);
  assert.equal(diagnostics.problems.length, 172);
  assert.equal(new Set(diagnostics.units.map((unit) => unit.unitId)).size, 8);
  assert.equal(new Set(diagnostics.concepts.map((concept) => concept.conceptId)).size, diagnostics.concepts.length);
  assert.equal(new Set(diagnostics.problems.map((problem) => problem.id)).size, diagnostics.problems.length);

  diagnostics.concepts.forEach((concept) => {
    assert.ok(concept.conceptId);
    assert.ok(concept.unitId);
    assert.ok(concept.conceptName);
    assert.equal(concept.grade, 9);
    assert.ok(Number.isInteger(concept.order) && concept.order > 0);
    assert.ok(Array.isArray(concept.prerequisiteConceptIds));
    assert.ok(Array.isArray(concept.nextConceptIds));
    assert.ok(Array.isArray(concept.bootstrapProblemIds));
    assert.ok(Array.isArray(concept.basicProblemFamilyIds));
    assert.equal(concept.enabled, true);
    assert.ok(diagnostics.units.some((unit) => unit.unitId === concept.unitId));
  });
});

test("every detailed concept has four valid and structurally different BASIC/check problem families", () => {
  diagnostics.concepts.forEach((concept) => {
    const problems = diagnostics.problems.filter((problem) => problem.conceptId === concept.conceptId);
    assert.ok(problems.length >= 4, `${concept.conceptId}: 기본·독립 확인 문제가 4개 이상이어야 합니다.`);
    assert.ok(new Set(problems.map((problem) => problem.problemFamilyId)).size >= 4);
    assert.ok(new Set(problems.map((problem) => engine.structureSignature(problem))).size >= 4);
    problems.forEach((problem) => {
      const validation = engine.validateProblem(problem);
      assert.equal(validation.isValid, true, `${problem.id}: ${validation.errors.join(",")}`);
      assert.equal(problem.adaptiveLevel, 1);
      assert.equal(problem.difficulty, 1);
    });
  });
});

test("real detailed data still has new structures for an independent check and its retry", () => {
  const state = engine.createStudentState({ userId: "independent-detail@example.com", concepts: [] });
  const definition = diagnostics.conceptById.m3_sqrt_meaning;
  const pool = diagnostics.problems.filter((problem) => problem.conceptId === definition.conceptId);
  engine.configureConceptDiagnostics(state, [definition], { replaceTargets: true });
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  engine.prioritizeConceptDiagnosticsFromBootstrap(state, [
    { conceptId: definition.routeConceptId, outcome: "correct" },
    { conceptId: definition.routeConceptId, outcome: "correct" },
  ]);

  const first = engine.selectNextProblem(state, pool);
  engine.recordOutcome(state, first, "correct", 7);
  const second = engine.selectNextProblem(state, pool);
  engine.recordOutcome(state, second, "correct", 8);
  engine.completeCycle(state);

  const learningSource = {
    id: "learning-source-sqrt",
    questionId: "learning-source-sqrt",
    conceptId: definition.conceptId,
    problem: "학습 화면에서 제곱근의 뜻을 확인한 별도 예제",
    questionText: "학습 화면에서 제곱근의 뜻을 확인한 별도 예제",
    answer: "1",
    choices: ["1", "2", "3", "4"],
  };
  const completion = engine.recordLearningCompletion(state, {
    conceptId: definition.conceptId,
    learnedStage: "BASIC",
    lessonId: "sqrt-learning",
    sourceProblems: [learningSource],
  });
  const independent = engine.selectNextProblem(state, pool);

  assert.ok(independent);
  assert.equal(independent.targetPurpose, engine.PURPOSES.INDEPENDENT_LEARNING_CHECK);
  assert.notEqual(independent.id, first.id);
  assert.notEqual(independent.id, second.id);
  engine.recordOutcome(state, independent, "wrong", 9);
  assert.equal(completion.evidence.independentCheckStatus, "FAILED");

  engine.completeCycle(state);
  const retry = engine.selectNextProblem(state, pool);
  assert.ok(retry);
  assert.equal(retry.targetPurpose, engine.PURPOSES.INDEPENDENT_LEARNING_CHECK);
  assert.notEqual(retry.structureSignature, independent.structureSignature);
});

test("all prerequisite concept ids resolve to a detailed or existing lower-grade concept", () => {
  const generatorSource = fs.readFileSync(path.join(root, "question-generators.js"), "utf8");
  const context = { window: {}, console: { log() {} } };
  vm.createContext(context);
  vm.runInContext(generatorSource, context);
  const available = new Set(diagnostics.concepts.map((concept) => concept.conceptId));
  ["g5", "g6", "m1", "m2"].forEach((bank) => {
    context.window.generatedConceptBanks[bank].forEach((problem) => available.add(problem.conceptId));
  });
  diagnostics.concepts.forEach((concept) => {
    concept.prerequisiteConceptIds.forEach((prerequisiteId) => {
      assert.ok(available.has(prerequisiteId), `${concept.conceptId}: ${prerequisiteId}가 문제은행에 없습니다.`);
    });
  });
});

test("bootstrap mistakes prioritize that unit and two different correct families confirm BASIC", () => {
  const state = engine.createStudentState({ userId: "middle3-detail@example.com", concepts: [] });
  engine.configureConceptDiagnostics(state, diagnostics.concepts, { replaceTargets: true });
  state.bootstrap.completed = true;
  state.phase = engine.PHASE_CYCLING;
  const bootstrapResults = diagnostics.units.flatMap((unit, unitIndex) => [0, 1].map((questionIndex) => ({
    conceptId: unit.routeConceptId,
    outcome: unitIndex === 2 && questionIndex === 0 ? "wrong" : "correct",
  })));
  engine.prioritizeConceptDiagnosticsFromBootstrap(state, bootstrapResults);

  const first = engine.selectNextProblem(state, diagnostics.problems);
  assert.equal(first.conceptId, "m3_quadratic_meaning");
  const stageBefore = state.conceptMastery[first.conceptId].stageIndex;
  engine.recordOutcome(state, first, "correct", 8);
  assert.equal(state.conceptDiagnosisMap[first.conceptId].status, "BASIC_PASS_CANDIDATE");
  assert.notEqual(state.conceptDiagnosisMap[first.conceptId].status, "BASIC_CONFIRMED");

  const second = engine.selectNextProblem(state, diagnostics.problems);
  assert.equal(second.conceptId, first.conceptId);
  assert.equal(second.stageName, "BASIC");
  assert.notEqual(second.problemFamilyId, first.problemFamilyId);
  assert.notEqual(second.structureSignature, first.structureSignature);
  engine.recordOutcome(state, second, "correct", 9);

  assert.equal(state.conceptDiagnosisMap[first.conceptId].status, "BASIC_CONFIRMED");
  assert.equal(state.conceptMastery[first.conceptId].stageIndex, stageBefore);
  assert.equal(state.unitConceptCoverage["m3-quadratic-equation"].checkedConcepts, 1);
  assert.equal(state.unitConceptCoverage["m3-quadratic-equation"].confirmedConcepts, 1);
});

test("detailed concepts reuse existing World routes and diagnosis priority feeds recommendations", () => {
  const state = engine.createStudentState({ userId: "route@example.com", concepts: [] });
  engine.configureConceptDiagnostics(state, diagnostics.concepts, { replaceTargets: true });
  state.bootstrap.completed = true;
  const results = diagnostics.units.flatMap((unit) => [
    { conceptId: unit.routeConceptId, outcome: unit.routeConceptId === "circle" ? "giveup" : "correct" },
    { conceptId: unit.routeConceptId, outcome: "correct" },
  ]);
  engine.prioritizeConceptDiagnosticsFromBootstrap(state, results);

  const unmapped = diagnostics.concepts.filter((concept) => !recommendations.resolveConceptRoute(state, concept.conceptId));
  assert.deepEqual(unmapped, []);
  const cards = recommendations.generateRecommendations(state);
  assert.ok(cards.length > 0 && cards.length <= 6);
  assert.equal(cards[0].conceptId, "m3_circle_chord");
  assert.equal(cards[0].worldId, "geometry-measurement");
});

test("the app keeps the 16-question bootstrap and then enters detailed diagnosis", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
  const diagnosticIndex = html.indexOf('src="middle3-concept-diagnostics.js');
  const engineIndex = html.indexOf('src="level-test-engine.js');

  assert.match(script, /middle3BasicQuestionsPerUnit = 2/);
  assert.match(script, /function buildMiddle3DetailedQuestionPool\(/);
  assert.match(script, /configureMiddle3ConceptDiagnostics\(memory\)/);
  assert.match(script, /prioritizeConceptDiagnosticsFromBootstrap\?\.\(memory, results\)/);
  assert.match(script, /기본 진단이 완료되었습니다\. 이제 세부 개념을 계속 확인합니다\./);
  assert.match(script, /기본 진단 \$\{coverage\.checkedConcepts\}\/\$\{coverage\.totalConcepts\}/);
  assert.ok(diagnosticIndex >= 0 && diagnosticIndex < engineIndex);
});
