const test = require("node:test");
const assert = require("node:assert/strict");

const schema = require("../math-learning-schema.js");
const model = require("../middle3-quadratic-learning-model.js");

test("중3 이차함수 6개 conceptId에 BASIC~A5 세 구조씩 제공한다", () => {
  assert.equal(model.concepts.length, 6);
  assert.equal(model.problems.length, 108);
  model.concepts.forEach((concept) => {
    schema.STAGES.forEach((stage) => {
      const problems = model.getProblems(concept.conceptId, stage);
      assert.equal(problems.length, 3, `${concept.conceptId}:${stage}`);
      assert.equal(new Set(problems.map((problem) => problem.structureSignature)).size, 3);
      assert.equal(new Set(problems.map((problem) => problem.solutionPathSignature)).size, 3);
    });
  });
});

test("모든 문제는 공통 메타데이터와 학습 전용 범위를 지킨다", () => {
  model.problems.forEach((problem) => {
    const validation = schema.validateProblem(problem);
    assert.equal(validation.valid, true, `${problem.problemId}: ${validation.errors.join(", ")}`);
    assert.equal(problem.grade, 9);
    assert.equal(problem.unitId, "m3-quadratic-function");
    assert.equal(problem.executionScope, "LEARNING_ONLY");
    assert.ok(problem.learningFlow.keyConditionHint);
    assert.ok(problem.learningFlow.fullSolution);
  });
});

test("전체 구조·풀이 경로·problemId가 중복되지 않는다", () => {
  const audit = model.audit();
  assert.equal(audit.valid, true, audit.validationErrors.join("\n"));
  assert.equal(audit.structureCount, model.problems.length);
  assert.equal(audit.solutionPathCount, model.problems.length);
  assert.equal(new Set(model.problems.map((problem) => problem.problemId)).size, model.problems.length);
});

test("A5는 절대 기준과 일곱 대표 유형을 모두 충족한다", () => {
  const a5 = model.problems.filter((problem) => problem.stage === "A5");
  assert.equal(a5.length, 18);
  a5.forEach((problem) => {
    assert.ok(problem.estimatedMeaningfulSteps >= 4, problem.problemId);
    assert.ok(problem.linkedConceptCount >= 2, problem.problemId);
    assert.equal(problem.structureNovelty, "HIGH");
    assert.equal(problem.requiresStrategySelection, true);
    assert.equal(problem.requiresExplanation, true);
    assert.equal(problem.directFormulaSubstitution, false);
    assert.equal(problem.memorizationOnly, false);
    schema.A5_REQUIRED_REASONING_GOALS.forEach((goal) => assert.ok(problem.reasoningGoals.includes(goal), `${problem.problemId}:${goal}`));
    const additional = schema.A5_ADDITIONAL_REASONING_GOALS.filter((goal) => problem.reasoningGoals.includes(goal));
    assert.ok(additional.length >= 2, problem.problemId);
  });
  const archetypes = new Set(a5.map((problem) => problem.problemArchetype));
  schema.A5_REQUIRED_ARCHETYPES.forEach((archetype) => assert.ok(archetypes.has(archetype), archetype));
  assert.ok(a5.some((problem) => problem.answerType === "STEP_ORDER"));
  assert.ok(a5.some((problem) => problem.answerType === "WRITTEN_RESPONSE"));
});

test("객관식·단답형·수식형·과정형·서술형을 모두 포함한다", () => {
  const types = new Set(model.problems.map((problem) => problem.answerType));
  schema.ANSWER_TYPES.forEach((type) => assert.ok(types.has(type), type));
  const audit = model.audit();
  assert.deepEqual(audit.byAnswerType, {
    MULTIPLE_CHOICE: 23,
    SHORT_ANSWER: 27,
    EXPRESSION_INPUT: 34,
    STEP_ORDER: 12,
    WRITTEN_RESPONSE: 12,
  });
});

test("모든 정답 키는 해당 답안 판정기를 통과한다", () => {
  model.problems.forEach((problem) => {
    const result = schema.evaluateAnswer(problem, problem.correctAnswer);
    assert.equal(result.status, "CORRECT", `${problem.problemId}: ${JSON.stringify(result)}`);
  });
});

test("대표 계산 문제의 정답을 독립 계산으로 확인한다", () => {
  const find = (key) => model.problems.find((problem) => problem.problemId.endsWith(key));
  assert.equal(find("table-reconstruction").correctAnswer, "k=3,y=2x^2-3x+1");
  assert.equal(find("mapped-point-and-extra-point").correctAnswer, "a=3,H:y=3(x-3)^2+1");
  assert.equal(find("symmetric-sum-reconstruction").correctAnswer, "f(x)=8/5(x-3)^2-22/5,최솟값-22/5");
  assert.equal(find("integer-parameter-optimization").correctAnswer, "m=8,x=8,9");
  assert.equal(find("piecewise-profit-model").correctAnswer.includes("가격은 15천 원"), true);

  assert.equal(schema.expressionsEquivalent("2x^2-3x+1", "2(x-1)^2+x-1"), true);
  assert.equal(schema.expressionsEquivalent("3(x-3)^2+1", "3x^2-18x+28"), true);
  assert.equal(schema.expressionsEquivalent("8/5(x-3)^2-22/5", "8/5x^2-48/5x+10"), true);
});

test("기존 레벨테스트 문제와 섞이지 않도록 contentRole과 실행 범위를 분리한다", () => {
  assert.ok(model.problems.every((problem) => problem.contentRole.startsWith("LEARNING_")));
  assert.ok(model.problems.every((problem) => problem.executionScope === "LEARNING_ONLY"));
  assert.ok(model.problems.every((problem) => !["LEVEL_TEST", "LEVEL_RECHECK", "DIAGNOSIS"].includes(problem.contentRole)));
});
