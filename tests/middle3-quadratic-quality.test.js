const test = require("node:test");
const assert = require("node:assert/strict");

const schema = require("../math-learning-schema.js");
const model = require("../middle3-quadratic-learning-model.js");

const bySuffix = (suffix) => model.problems.find((problem) => problem.problemId.endsWith(suffix));
const stages = ["BASIC", "A1", "A2", "A3", "A4", "A5"];

test("108문항은 단계별 18문항이며 모든 독립 검수 확인값을 갖는다", () => {
  assert.equal(model.problems.length, 108);
  stages.forEach((stage) => {
    assert.equal(model.problems.filter((problem) => problem.stage === stage).length, 18);
  });
  model.problems.forEach((problem) => {
    assert.deepEqual(problem.independentValidation, {
      conditionFeasible: true,
      uniqueAnswer: true,
      answerRecalculated: true,
      scopeChecked: true,
    }, problem.problemId);
    assert.equal(problem.scopeTag, "MIDDLE3_QUADRATIC", problem.problemId);
    assert.ok(problem.scopeEvidence, problem.problemId);
  });
});

test("A3 18문항은 세 단계 이상의 사고와 두 조건 연결을 만족한다", () => {
  const problems = model.problems.filter((problem) => problem.stage === "A3");
  assert.equal(problems.length, 18);
  problems.forEach((problem) => {
    assert.ok(problem.estimatedMeaningfulSteps >= 3, problem.problemId);
    assert.ok(problem.linkedConditionCount >= 2, problem.problemId);
    assert.equal(problem.memorizationOnly, false, problem.problemId);
    assert.equal(problem.directFormulaSubstitution, false, problem.problemId);
    assert.equal(problem.requiresStrategySelection, true, problem.problemId);
  });
});

test("A4 18문항은 네 단계 이상, 세 조건 이상, 직접 대입 금지를 만족한다", () => {
  const problems = model.problems.filter((problem) => problem.stage === "A4");
  assert.equal(problems.length, 18);
  problems.forEach((problem) => {
    assert.ok(problem.estimatedMeaningfulSteps >= 4, problem.problemId);
    assert.ok(problem.linkedConditionCount >= 3, problem.problemId);
    assert.ok(problem.linkedConceptCount >= 2, problem.problemId);
    assert.equal(problem.directFormulaSubstitution, false, problem.problemId);
    assert.equal(problem.requiresStrategySelection, true, problem.problemId);
    assert.equal(problem.requiresExplanation, true, problem.problemId);
  });
});

test("A5 18문항은 전략 선택, 설명, 다중 연결, 결과 검증을 만족한다", () => {
  const problems = model.problems.filter((problem) => problem.stage === "A5");
  assert.equal(problems.length, 18);
  problems.forEach((problem) => {
    assert.ok(problem.estimatedMeaningfulSteps >= 4, problem.problemId);
    assert.ok(problem.linkedConditionCount >= 2, problem.problemId);
    assert.ok(problem.linkedConceptCount >= 2, problem.problemId);
    assert.equal(problem.structureNovelty, "HIGH", problem.problemId);
    assert.equal(problem.requiresStrategySelection, true, problem.problemId);
    assert.equal(problem.requiresExplanation, true, problem.problemId);
    assert.equal(problem.directFormulaSubstitution, false, problem.problemId);
    assert.ok(problem.reasoningGoals.includes("RESULT_VALIDATION"), problem.problemId);
    assert.ok(problem.reasoningGoals.includes("STRATEGY_SELECTION"), problem.problemId);
  });
});

test("12개 과정형은 단계별 배점과 필수 근거를 가지며 순서 오류를 정답 처리하지 않는다", () => {
  const problems = model.problems.filter((problem) => problem.answerType === "STEP_ORDER");
  assert.equal(problems.length, 12);
  problems.forEach((problem) => {
    assert.ok(problem.rubricSteps.length >= 3, problem.problemId);
    problem.rubricSteps.forEach((step) => {
      assert.ok(step.id, problem.problemId);
      assert.ok(step.description, problem.problemId);
      assert.ok(step.evidence.length > 0, problem.problemId);
      assert.ok(step.points > 0, problem.problemId);
    });
    assert.equal(schema.evaluateAnswer(problem, problem.correctAnswer).status, "CORRECT", problem.problemId);
    const reversed = [...problem.correctAnswer].reverse();
    assert.notEqual(schema.evaluateAnswer(problem, reversed).status, "CORRECT", problem.problemId);
  });
});

test("12개 서술형은 구조화 rubric으로 완전 답안과 논리 오류 답안을 구분한다", () => {
  const problems = model.problems.filter((problem) => problem.answerType === "WRITTEN_RESPONSE");
  assert.equal(problems.length, 12);
  problems.forEach((problem) => {
    const rubric = problem.writtenRubric;
    assert.ok(rubric.requiredClaims.length > 0, problem.problemId);
    assert.ok(rubric.requiredRelations.length > 0, problem.problemId);
    assert.ok(Array.isArray(rubric.requiredCalculations), problem.problemId);
    assert.ok(rubric.requiredConclusion, problem.problemId);
    assert.ok(rubric.forbiddenLogicalErrors.length > 0, problem.problemId);
    assert.equal(schema.evaluateAnswer(problem, problem.correctAnswer).status, "CORRECT", problem.problemId);
    const conclusionOnly = rubric.requiredConclusion.alternatives[0];
    assert.notEqual(schema.evaluateAnswer(problem, conclusionOnly).status, "CORRECT", problem.problemId);
    const logicallyWrong = `${problem.correctAnswer} ${rubric.forbiddenLogicalErrors[0]}`;
    assert.equal(schema.evaluateAnswer(problem, logicallyWrong).status, "INCORRECT", problem.problemId);
  });
});

test("숫자만 바꾼 실질 중복은 signature가 달라도 차단한다", () => {
  const source = model.problems[0];
  const makeClone = (id, number) => ({
    ...source,
    problemId: id,
    questionId: id,
    structureSignature: `structure:${id}`,
    solutionPathSignature: `solution:${id}`,
    structureFingerprint: {
      firstEquationFamily: `y=${number}x²+1`,
      coreStrategy: `x=${number}를 대입해 계수를 구한다`,
      conditionTransform: `함수값 ${number}를 계수식으로 변환한다`,
      graphStructure: "same-parabola-shape",
      targetKind: `target-${id}`,
    },
  });
  const validation = schema.validateProblemSet([
    makeClone("number-only-a", 2),
    makeClone("number-only-b", 7),
  ], {
    minimumStructuresPerConceptStage: 1,
    requireA5ArchetypeCoverage: false,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.includes("PRACTICAL_DUPLICATE_CORE_STRATEGY")));
  assert.ok(validation.errors.some((error) => error.includes("PRACTICAL_DUPLICATE_STRUCTURE")));
});

test("각 concept-stage의 세 문항은 숫자를 지운 뒤에도 서로 다른 핵심 구조다", () => {
  model.concepts.forEach((concept) => {
    stages.forEach((stage) => {
      const problems = model.getProblems(concept.conceptId, stage);
      const strategies = problems.map((problem) => (
        schema.normalizedStructuralText(problem.structureFingerprint.coreStrategy)
      ));
      const structures = problems.map((problem) => (
        ["firstEquationFamily", "conditionTransform", "graphStructure"]
          .map((field) => schema.normalizedStructuralText(problem.structureFingerprint[field]))
          .join("|")
      ));
      assert.equal(new Set(strategies).size, 3, `${concept.conceptId}:${stage}:strategy`);
      assert.equal(new Set(structures).size, 3, `${concept.conceptId}:${stage}:structure`);
    });
  });
});

test("감사에서 지적된 오류 5건은 재발하지 않는다", () => {
  const area = bySuffix("area-model");
  assert.equal(area.correctAnswer, "y=x^2+4x, x>-2");
  assert.ok(area.questionText.includes("넓이에서 4를 뺀"));
  assert.ok(area.solutionPath.some((step) => step.includes("x+2>0")));

  const modelSelection = bySuffix("model-selection-process");
  assert.ok(modelSelection.questionText.includes("남은 넓이"));
  assert.ok(modelSelection.correctAnswer.some((step) => step.includes("y=5x+9")));
  assert.ok(modelSelection.correctAnswer.some((step) => step.includes("일차함수")));

  const ordered = bySuffix("ordered-values");
  assert.ok(ordered.questionText.includes("절댓값"));
  assert.equal(ordered.correctAnswer, "가,나,다");

  assert.equal(model.problems.some((problem) => problem.problemId.endsWith("moving-line-intersections")), false);

  const profit = bySuffix("piecewise-profit-model");
  assert.ok(profit.questionText.includes("0부터 10까지의 정수"));
  const firstRevenue = (10 + 5) * (100 - (5 * 5));
  const secondRevenue = (10 + 6) * (75 - (8 * (6 - 5)));
  assert.equal(firstRevenue, 1125);
  assert.equal(secondRevenue, 1072);
  assert.ok(profit.correctAnswer.includes("가격은 15천 원"));
});

test("대표 고난도 계산은 문제 문장과 독립 계산 결과가 일치한다", () => {
  assert.equal(8 * (2 / 3), 16 / 3);
  assert.equal(bySuffix("parameter-cancellation-symmetry").correctAnswer, "t=2/3,F_t(x)=2x^2-8x+6");

  const chordA = -16 / 8;
  assert.equal(chordA, -2);
  assert.ok(bySuffix("symmetric-chord-area").correctAnswer.includes("a=-2"));

  const vertexA = (11 - 3) / (9 - 4);
  const vertexQ = 3 - (4 * vertexA);
  assert.equal(vertexA, 8 / 5);
  assert.ok(Math.abs(vertexQ - (-17 / 5)) < 1e-12);
  assert.ok(bySuffix("two-paired-levels").correctAnswer.includes("-17/5"));

  const shiftedA = (13 - 4) / 3;
  assert.equal(shiftedA, 3);
  assert.ok(bySuffix("mapped-point-and-extra-point").correctAnswer.includes("a=3"));

  const formulaA = (10 - 2) / (9 - 4);
  const formulaQ = 2 - (4 * formulaA);
  assert.equal(formulaA, 8 / 5);
  assert.ok(Math.abs(formulaQ - (-22 / 5)) < 1e-12);

  const fenceCandidates = [5, 7].map((x) => ({ x, y: 26 - (2 * x), area: x * (26 - (2 * x)) }));
  assert.deepEqual(fenceCandidates, [
    { x: 5, y: 16, area: 80 },
    { x: 7, y: 12, area: 84 },
  ]);
  assert.ok(bySuffix("modular-fence-optimization").correctAnswer.includes("최대84"));
});

test("객관식 정답은 보기 안에 정확히 하나이며 모든 정답 키가 채점기를 통과한다", () => {
  model.problems.forEach((problem) => {
    if (problem.answerType === "MULTIPLE_CHOICE") {
      assert.equal(problem.choices.filter((choice) => (
        schema.normalizedText(choice) === schema.normalizedText(problem.correctAnswer)
      )).length, 1, problem.problemId);
      assert.equal(new Set(problem.choices.map(schema.normalizedText)).size, problem.choices.length, problem.problemId);
    }
    assert.equal(schema.evaluateAnswer(problem, problem.correctAnswer).status, "CORRECT", problem.problemId);
  });
});

test("수정 분류와 교체 이력은 전 문항에 기록된다", () => {
  const counts = model.problems.reduce((result, problem) => {
    result[problem.revisionAction] = (result[problem.revisionAction] || 0) + 1;
    if (problem.revisionAction === "REPLACE") assert.ok(problem.replacesProblemId, problem.problemId);
    return result;
  }, {});
  assert.deepEqual(counts, { KEEP: 48, MODIFY: 5, REPLACE: 55 });
});

test("범위 밖·모호·무효·실질 중복·수학 오류 검증 결과는 0건이다", () => {
  const audit = model.audit();
  assert.equal(audit.valid, true, audit.validationErrors.join("\n"));
  assert.deepEqual(audit.validationErrors, []);
  assert.equal(model.problems.filter((problem) => problem.scopeTag !== "MIDDLE3_QUADRATIC").length, 0);
  assert.equal(model.problems.filter((problem) => !problem.independentValidation.uniqueAnswer).length, 0);
  assert.equal(model.problems.filter((problem) => !problem.independentValidation.conditionFeasible).length, 0);
});
