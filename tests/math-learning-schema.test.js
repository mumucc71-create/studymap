const test = require("node:test");
const assert = require("node:assert/strict");

const schema = require("../math-learning-schema.js");

function baseProblem(overrides = {}) {
  return {
    problemId: "schema-test-1",
    grade: 9,
    unitId: "m3-quadratic-function",
    conceptId: "m3_quadratic_vertex_axis",
    stage: "BASIC",
    answerType: "MULTIPLE_CHOICE",
    questionText: "y=(x-2)²+1의 꼭짓점은?",
    correctAnswer: "(2,1)",
    choices: ["(2,1)", "(-2,1)", "(2,-1)", "(0,1)"],
    reasoningGoals: ["CONCEPT_RECALL", "DIRECT_APPLICATION"],
    prerequisiteConceptIds: ["m3_quadratic_graph_shape"],
    linkedConceptIds: ["m3_quadratic_vertex_axis"],
    solutionPath: ["꼭짓점형에서 좌표를 읽는다."],
    structureSignature: "schema-test-structure-1",
    solutionPathSignature: "schema-test-solution-1",
    estimatedMeaningfulSteps: 1,
    trapTypes: ["INNER_SIGN"],
    validatorId: "TEST",
    contentRole: "LEARNING_PRACTICE",
    memorizationOnly: false,
    ...overrides,
  };
}

test("공통 수학 메타데이터의 필수 필드를 검증한다", () => {
  const valid = schema.validateProblem(baseProblem());
  assert.equal(valid.valid, true, valid.errors.join(", "));

  const invalid = schema.validateProblem(baseProblem({ conceptId: "", answerType: "UNKNOWN" }));
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("MISSING_CONCEPTID"));
  assert.ok(invalid.errors.includes("INVALID_ANSWER_TYPE"));
});

test("A5 절대 기준 누락을 차단한다", () => {
  const invalid = schema.validateProblem(baseProblem({
    stage: "A5",
    reasoningGoals: ["CONDITION_READING"],
    estimatedMeaningfulSteps: 3,
    linkedConceptIds: ["m3_quadratic_vertex_axis"],
    structureNovelty: "LOW",
    requiresStrategySelection: false,
    requiresExplanation: false,
    directFormulaSubstitution: true,
    memorizationOnly: true,
  }));
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("INSUFFICIENT_MEANINGFUL_STEPS"));
  assert.ok(invalid.errors.includes("INSUFFICIENT_LINKED_CONCEPTS"));
  assert.ok(invalid.errors.includes("A5_STRUCTURE_NOVELTY_NOT_HIGH"));
  assert.ok(invalid.errors.includes("A5_STRATEGY_SELECTION_REQUIRED"));
  assert.ok(invalid.errors.includes("A5_EXPLANATION_REQUIRED"));
});

test("객관식과 단답형을 정규화하여 채점한다", () => {
  assert.equal(schema.evaluateAnswer(baseProblem(), "(2,1)").status, "CORRECT");
  assert.equal(schema.evaluateAnswer(baseProblem(), "(-2,1)").status, "INCORRECT");

  const short = baseProblem({
    answerType: "SHORT_ANSWER",
    correctAnswer: "2.5cm",
    choices: undefined,
    tolerance: 0.01,
  });
  assert.equal(schema.evaluateAnswer(short, "2.50 cm").status, "CORRECT");
  assert.equal(schema.evaluateAnswer(short, "2.7cm").status, "INCORRECT");
});

test("수식형은 전개형과 꼭짓점형의 수학적 동치를 판정한다", () => {
  const problem = baseProblem({
    answerType: "EXPRESSION_INPUT",
    correctAnswer: "y=(x-1)^2+2",
    choices: undefined,
  });
  assert.equal(schema.evaluateAnswer(problem, "y=x^2-2x+3").status, "CORRECT");
  assert.equal(schema.evaluateAnswer(problem, "y=x^2-2x+4").status, "INCORRECT");
});

test("과정형은 필수 단계의 순서를 판정한다", () => {
  const problem = baseProblem({
    answerType: "STEP_ORDER",
    correctAnswer: ["식을세운다", "완전제곱한다", "꼭짓점을읽는다"],
    choices: undefined,
    requiredSteps: ["식을세운다", "완전제곱한다", "꼭짓점을읽는다"],
  });
  assert.equal(schema.evaluateAnswer(problem, "식을 세운다 → 완전제곱한다 → 꼭짓점을 읽는다").status, "CORRECT");
  assert.equal(schema.evaluateAnswer(problem, "완전제곱한다 → 식을 세운다 → 꼭짓점을 읽는다").status, "INCORRECT");
});

test("서술형은 핵심 개념·관계·결과로 채점하고 경계 답안은 검토 상태로 둔다", () => {
  const problem = baseProblem({
    answerType: "WRITTEN_RESPONSE",
    correctAnswer: "계수 a가 양수이고 꼭짓점이 (2,1)이므로 최솟값은 1이다.",
    choices: undefined,
    writtenRubric: {
      requiredConcepts: [["계수", "a"], ["꼭짓점"], ["최솟값"]],
      requiredRelations: [["양수", "위로"]],
      expectedResults: ["1"],
      minimumScore: 0.8,
    },
  });
  const correct = schema.evaluateAnswer(problem, "계수 a가 양수라 위로 열리고 꼭짓점의 y좌표가 1이므로 최솟값은 1이다.");
  assert.equal(correct.status, "CORRECT");
  const review = schema.evaluateAnswer(problem, "꼭짓점에서 최솟값은 1이다.");
  assert.equal(review.status, "REVIEW_REQUIRED");
});

test("문제 세트에서 구조와 풀이 경로 중복을 차단한다", () => {
  const first = baseProblem();
  const second = baseProblem({ problemId: "schema-test-2" });
  const validation = schema.validateProblemSet([first, second], {
    minimumStructuresPerConceptStage: 1,
    requireA5ArchetypeCoverage: false,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.includes("DUPLICATE_STRUCTURE_SIGNATURE")));
  assert.ok(validation.errors.some((error) => error.includes("DUPLICATE_SOLUTION_PATH_SIGNATURE")));
});
