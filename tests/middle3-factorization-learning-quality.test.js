const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const algebra = require("../math-algebra-validator.js");
const schema = require("../math-learning-schema.js");
const model = require("../middle3-factorization-learning-model.js");
const content = require("../middle3-factorization-learning-content.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const CONCEPT_IDS = [
  "m3_polynomial_multiplication",
  "m3_multiplication_formula",
  "m3_common_factor",
  "m3_factor_perfect_square",
  "m3_factor_difference_squares",
  "m3_factor_sum_product",
];
const STAGES = ["BASIC", "A1", "A2", "A3", "A4", "A5"];
const REWRITTEN_PROBLEM_IDS = [
  "m3-factor-014-polynomial_multiplication-a3-two-polynomial-comparison",
  "m3-factor-015-polynomial_multiplication-a3-symmetric-parameter-transfer",
  "m3-factor-021-polynomial_multiplication-a5-general-coefficient-proof",
  "m3-factor-022-polynomial_multiplication-a5-same-polynomial-parameter-process",
  "m3-factor-024-polynomial_multiplication-a5-independent-sign-symmetry",
  "m3-factor-038-multiplication_formula-a3-compare-hidden-formulas",
  "m3-factor-043-multiplication_formula-a4-case-by-middle-sign",
  "m3-factor-047-multiplication_formula-a5-middle-term-generalization",
  "m3-factor-064-common_factor-a3-independent-gcf-reverse",
  "m3-factor-065-common_factor-a4-exact-gcf-case-classification",
  "m3-factor-067-common_factor-a4-reverse-divisibility-parameter",
  "m3-factor-069-common_factor-a5-complete-factor-criterion",
  "m3-factor-072-common_factor-a5-independent-sign-convention",
  "m3-factor-088-factor_perfect_square-a3-independent-hidden-center",
  "m3-factor-091-factor_perfect_square-a4-case-classify-two-signs",
  "m3-factor-094-factor_perfect_square-a5-two-errors-process",
  "m3-factor-111-factor_difference_squares-a3-two-route-comparison",
  "m3-factor-113-factor_difference_squares-a4-two-branch-with-range",
  "m3-factor-115-factor_difference_squares-a4-minimal-k-difference-square",
  "m3-factor-116-factor_difference_squares-a4-independent-two-representations",
  "m3-factor-135-factor_sum_product-a3-factor-pair-transform",
  "m3-factor-136-factor_sum_product-a3-independent-two-condition-recovery",
  "m3-factor-141-factor_sum_product-a5-integer-factorization-iff",
];
const FROZEN_49_SHA256 = "28827b0c0e561cc54b7baeadbb5e382dcf60c94f841245213a38c86270384a3c";

function countBy(values, selector) {
  return values.reduce((result, value) => {
    const key = selector(value);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}

function normalized(value) {
  return String(value)
    .normalize("NFKC")
    .replace(/[−–—]/g, "-")
    .replace(/²/g, "^2")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function numericStructure(value) {
  return normalized(value)
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/#+/g, "#");
}

test("승인된 A3~A5 49문항은 보호 SHA-256과 일치한다", () => {
  const rewritten = new Set(REWRITTEN_PROBLEM_IDS);
  const frozen = model.problems.filter((problem) => (
    ["A3", "A4", "A5"].includes(problem.stage)
    && !rewritten.has(problem.problemId)
  ));
  const hash = crypto.createHash("sha256").update(JSON.stringify(frozen)).digest("hex");
  assert.equal(frozen.length, 49);
  assert.equal(hash, FROZEN_49_SHA256);
});

test("재작성 범위는 지정된 23문항과 정확히 일치하고 직접 계산 답을 보존한다", () => {
  const expectedAnswers = {
    "m3-factor-014-polynomial_multiplication-a3-two-polynomial-comparison": "-13",
    "m3-factor-015-polynomial_multiplication-a3-symmetric-parameter-transfer": "(x+4)(x-3)",
    "m3-factor-021-polynomial_multiplication-a5-general-coefficient-proof": "A는 거짓, B는 참이며 두 식이 같을 모든 경우는 a=b=c이다.",
    "m3-factor-022-polynomial_multiplication-a5-same-polynomial-parameter-process": [
      "D=2(a+b)x로 전개하여 A는 모든 a,b에서 참임을 확인",
      "D=2ab가 항등식이려면 a+b=0과 ab=0이 동시에 필요",
      "두 조건에서 a=b=0이므로 B는 이 한 경우에만 성립",
      "D=2(a-b)x와 계수를 비교하면 b=0이므로 C는 b=0인 모든 경우에 성립",
      "각 분류를 원식에 대입해 필요성·충분성과 누락 없음을 검증",
    ],
    "m3-factor-024-polynomial_multiplication-a5-independent-sign-symmetry": "서로 다른 두 x값이면 충분하고 한 x값만으로는 부족하다.",
    "m3-factor-038-multiplication_formula-a3-compare-hidden-formulas": "-8",
    "m3-factor-043-multiplication_formula-a4-case-by-middle-sign": "2x^2+7x+5",
    "m3-factor-047-multiplication_formula-a5-middle-term-generalization": "A는 일반적으로 거짓이고 B가 참이며 필요충분조건은 ab=0이다.",
    "m3-factor-064-common_factor-a3-independent-gcf-reverse": "24",
    "m3-factor-065-common_factor-a4-exact-gcf-case-classification": "20",
    "m3-factor-067-common_factor-a4-reverse-divisibility-parameter": "6(3x-2)(x+1)",
    "m3-factor-069-common_factor-a5-complete-factor-criterion": "cd=a, ce=b, |c|=g, sign(c)=sign(a), gcd(|d|,|e|)=1이 필요충분하다.",
    "m3-factor-072-common_factor-a5-independent-sign-convention": "세 계수 전체의 최대공약수가 1이면 충분하며 쌍별 서로소일 필요는 없다.",
    "m3-factor-088-factor_perfect_square-a3-independent-hidden-center": "-9",
    "m3-factor-091-factor_perfect_square-a4-case-classify-two-signs": "(x^2-9)^2",
    "m3-factor-094-factor_perfect_square-a5-two-errors-process": [
      "(2x+q)^2=4x^2+4qx+q^2로 놓아 m=4q, n=q^2를 얻음",
      "A는 4x^2+2x+1이 반례이므로 거짓",
      "필요조건 m^2=16n을 도출",
      "정수 m,n에서 m^2=16n이면 m은 4의 배수이고 q=m/4인 정수이므로 충분",
      "n=0을 포함해 m=±4sqrt(n)인 모든 경우를 전개하여 B의 필요충분성과 누락 없음을 검증",
    ],
    "m3-factor-111-factor_difference_squares-a3-two-route-comparison": "3(x+6)(x-2)",
    "m3-factor-113-factor_difference_squares-a4-two-branch-with-range": "(x+3)(x-3)",
    "m3-factor-115-factor_difference_squares-a4-minimal-k-difference-square": "10",
    "m3-factor-116-factor_difference_squares-a4-independent-two-representations": [
      "P=12(x^2+2x-3)",
      "x^2+2x-3=(x+1)^2-4",
      "(x+1)^2-2^2=(x+3)(x-1)",
      "P=12(x+3)(x-1)",
      "재전개와 각 일차인수의 공통인수 확인으로 값·주어진 인수·완전성을 모두 검산",
    ],
    "m3-factor-135-factor_sum_product-a3-factor-pair-transform": "(x+6)(x-2)",
    "m3-factor-136-factor_sum_product-a3-independent-two-condition-recovery": "x=1, A",
    "m3-factor-141-factor_sum_product-a5-integer-factorization-iff": "m=-4,-1,1,4이며 각각 (x+2)(x-6), (x+3)(x-4), (x-3)(x+4), (x-2)(x+6)이다.",
  };
  assert.deepEqual(Object.keys(expectedAnswers), REWRITTEN_PROBLEM_IDS);
  REWRITTEN_PROBLEM_IDS.forEach((problemId) => {
    const problem = model.problemsById[problemId];
    assert.ok(problem, problemId);
    assert.deepEqual(problem.expectedAnswer, expectedAnswers[problemId], problemId);
    const result = model.evaluateProblemAnswer(problem, problem.expectedAnswer);
    const expectedStatus = problem.answerType === "WRITTEN_RESPONSE" ? "REVIEW_REQUIRED" : "CORRECT";
    assert.equal(result.status, expectedStatus, problemId);
  });
  assert.match(
    model.problemsById["m3-factor-136-factor_sum_product-a3-independent-two-condition-recovery"].prompt,
    /0 이상의 정수 x/
  );
});

test("재작성 23문항의 구조·풀이 경로와 혼자 풀기 전략은 승인 문항과 겹치지 않는다", () => {
  const rewritten = new Set(REWRITTEN_PROBLEM_IDS);
  REWRITTEN_PROBLEM_IDS.forEach((problemId) => {
    const problem = model.problemsById[problemId];
    const peers = model.getProblems(problem.conceptId, problem.stage).filter((peer) => peer.problemId !== problemId);
    assert.ok(peers.every((peer) => peer.structureSignature !== problem.structureSignature), `${problemId}:structure`);
    assert.ok(peers.every((peer) => peer.solutionPathSignature !== problem.solutionPathSignature), `${problemId}:path`);
    if (problem.independentCheck) {
      const learningPeers = peers.filter((peer) => !peer.independentCheck);
      assert.ok(learningPeers.every((peer) => peer.solutionPathSignature !== problem.solutionPathSignature), `${problemId}:independent`);
    }
  });
  assert.equal(model.problems.filter((problem) => rewritten.has(problem.problemId)).length, 23);
});

test("재작성 인수분해 문항은 완전 인수분해만 수용하고 대표 오류를 차단한다", () => {
  const factorIds = [
    "m3-factor-015-polynomial_multiplication-a3-symmetric-parameter-transfer",
    "m3-factor-067-common_factor-a4-reverse-divisibility-parameter",
    "m3-factor-111-factor_difference_squares-a3-two-route-comparison",
    "m3-factor-113-factor_difference_squares-a4-two-branch-with-range",
    "m3-factor-135-factor_sum_product-a3-factor-pair-transform",
  ];
  factorIds.forEach((problemId) => {
    const problem = model.problemsById[problemId];
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "CORRECT", problemId);
    assert.equal(
      model.evaluateProblemAnswer(problem, problem.answerContract.originalExpression).reason,
      "NOT_FULLY_FACTORED",
      `${problemId}:expanded-answer`
    );
  });
  assert.equal(model.evaluateProblemAnswer(factorIds[0], "(x-4)(x+3)").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(factorIds[1], "(3x-2)(x+1)").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(factorIds[1], "6(3x+2)(x-1)").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(factorIds[2], "3((x+2)^2-16)").reason, "NOT_FULLY_FACTORED");
});

test("144개 명시 저작 문항이 6개 concept와 BASIC~A5에 정확히 배치된다", () => {
  assert.equal(model.AUTHORING_MODE, "EXPLICIT_AUTHORED_PROBLEMS_NO_LEGACY_REUSE");
  assert.equal(model.problems.length, 144);
  assert.deepEqual(model.concepts.map((concept) => concept.conceptId), CONCEPT_IDS);
  assert.deepEqual(countBy(model.problems, (problem) => problem.conceptId), Object.fromEntries(
    CONCEPT_IDS.map((conceptId) => [conceptId, 24])
  ));
  assert.deepEqual(countBy(model.problems, (problem) => problem.stage), {
    BASIC: 24,
    A1: 24,
    A2: 24,
    A3: 24,
    A4: 24,
    A5: 24,
  });
  CONCEPT_IDS.forEach((conceptId) => {
    STAGES.forEach((stage) => {
      const items = model.getProblems(conceptId, stage);
      assert.equal(items.length, 4, `${conceptId}:${stage}`);
      assert.equal(items.filter((problem) => problem.independentCheck).length, 1);
      assert.equal(items.filter((problem) => !problem.independentCheck).length, 3);
    });
  });
});

test("문제 ID, prompt, 숫자 제거 prompt와 두 signature는 모두 고유하다", () => {
  const unique = (values, label) => assert.equal(new Set(values).size, values.length, label);
  unique(model.problems.map((problem) => problem.id), "id");
  unique(model.problems.map((problem) => problem.problemId), "problemId");
  unique(model.problems.map((problem) => normalized(problem.prompt)), "prompt");
  unique(model.problems.map((problem) => numericStructure(problem.prompt)), "numeric prompt structure");
  unique(model.problems.map((problem) => problem.structureSignature), "structureSignature");
  unique(model.problems.map((problem) => problem.solutionPathSignature), "solutionPathSignature");
});

test("모든 문항은 필수 데이터·설명·2단계 힌트·풀이 단계를 가진다", () => {
  const required = [
    "id",
    "problemId",
    "conceptId",
    "stage",
    "answerType",
    "prompt",
    "expectedAnswer",
    "explanation",
    "hints",
    "solutionSteps",
    "misconceptionTags",
    "difficultyEvidence",
    "independentCheck",
    "curriculumVersion",
    "authoringScope",
    "sourceScope",
    "structureSignature",
    "solutionPathSignature",
  ];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.notEqual(problem[field], undefined, `${problem.problemId}:${field}`));
    assert.ok(problem.explanation.trim(), `${problem.problemId}:explanation`);
    assert.ok(problem.hints.length >= 2, `${problem.problemId}:hints`);
    assert.ok(problem.solutionSteps.length >= 2, `${problem.problemId}:solutionSteps`);
    assert.ok(problem.misconceptionTags.length >= 1, `${problem.problemId}:misconceptionTags`);
    assert.ok(problem.difficultyEvidence.length >= 2, `${problem.problemId}:difficultyEvidence`);
    assert.equal(problem.curriculumVersion, "2015_REVISED_MIDDLE_SCHOOL_MATH");
    assert.deepEqual(schema.validateProblem(problem).errors, [], problem.problemId);
  });
});

test("학습 108문항과 혼자 풀기 36문항이 분리되고 선공개 금지 계약을 가진다", () => {
  assert.equal(model.problems.filter((problem) => !problem.independentCheck).length, 108);
  const independent = model.problems.filter((problem) => problem.independentCheck);
  assert.equal(independent.length, 36);
  independent.forEach((problem) => {
    assert.equal(problem.contentRole, "LEVEL_RECHECK");
    assert.equal(problem.independentCheckPolicy.hintDisclosure, "LOCKED_DURING_INDEPENDENT_CHECK");
    assert.equal(problem.independentCheckPolicy.solutionDisclosure, "AFTER_FINAL");
    const peers = model.getProblems(problem.conceptId, problem.stage).filter((item) => !item.independentCheck);
    assert.ok(peers.every((peer) => peer.structureSignature !== problem.structureSignature));
    assert.ok(peers.every((peer) => peer.solutionPathSignature !== problem.solutionPathSignature));
  });
});

test("다섯 answerType이 편중 없이 배치되고 A4·A5에 실제 과정형·서술형이 있다", () => {
  assert.deepEqual(model.audit().byAnswerType, {
    MULTIPLE_CHOICE: 18,
    SHORT_ANSWER: 46,
    EXPRESSION_INPUT: 44,
    STEP_ORDER: 18,
    WRITTEN_RESPONSE: 18,
  });
  assert.equal(model.audit().processCount, 18);
  assert.equal(model.audit().writtenCount, 18);
  CONCEPT_IDS.forEach((conceptId) => {
    assert.ok(model.getProblems(conceptId, "A4").some((problem) => problem.answerType === "STEP_ORDER"));
    assert.ok(model.getProblems(conceptId, "A5").some((problem) => problem.answerType === "STEP_ORDER"));
    assert.ok(model.getProblems(conceptId, "A5").some((problem) => problem.answerType === "WRITTEN_RESPONSE"));
  });
});

test("객관식은 중복 선택지 없이 정답이 정확히 하나다", () => {
  model.problems.filter((problem) => problem.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    const choices = problem.choices.map(normalized);
    assert.equal(new Set(choices).size, choices.length, problem.problemId);
    assert.equal(choices.filter((choice) => choice === normalized(problem.correctAnswer)).length, 1, problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, problem.correctAnswer).status, "CORRECT");
    const wrong = problem.choices.find((choice) => normalized(choice) !== normalized(problem.correctAnswer));
    assert.equal(model.evaluateProblemAnswer(problem, wrong).status, "INCORRECT");
  });
});

test("수식 입력형은 validator가 정답과 동치식을 수용하고 대표 부호 오류를 막는다", () => {
  const expansion = algebra.compareExpressions("(x+2)(x+3)", "x^2+5x+6");
  assert.equal(expansion.equivalent, true);
  assert.equal(algebra.compareExpressions("(x+2)(x+3)", "x^2-5x+6").equivalent, false);

  const equivalenceProblems = model.problems.filter((problem) => (
    problem.answerType === "EXPRESSION_INPUT"
    && problem.answerContract.kind === "ALGEBRA_EQUIVALENCE"
  ));
  assert.equal(equivalenceProblems.length, 20);
  equivalenceProblems.forEach((problem) => {
    const equivalentSubmission = `(${problem.expectedAnswer})+0`;
    assert.notEqual(normalized(equivalentSubmission), normalized(problem.expectedAnswer), problem.problemId);
    assert.equal(
      algebra.compareExpressions(problem.expectedAnswer, equivalentSubmission).status,
      "EQUIVALENT",
      problem.problemId
    );
    const result = model.evaluateProblemAnswer(problem, equivalentSubmission);
    assert.equal(result.status, "CORRECT", problem.problemId);
    assert.equal(result.matchedBy, undefined, `${problem.problemId}:validator-bypass`);
  });
});

test("단답형은 정답을 수용하고 임의 오답을 정답 처리하지 않는다", () => {
  model.problems.filter((problem) => problem.answerType === "SHORT_ANSWER").forEach((problem) => {
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "CORRECT", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, "__대표_오답__").status, "INCORRECT", problem.problemId);
  });
});

test("완전 인수분해는 값 동치와 완전성을 분리하고 미완성 답을 막는다", () => {
  const full = algebra.assessFactorization("(x+2)(x+3)", "x^2+5x+6");
  const expanded = algebra.assessFactorization("x^2+5x+6", "x^2+5x+6");
  const numericLeft = algebra.assessFactorization("2(3x+6)", "6x+12");
  assert.equal(full.status, "FULLY_FACTORED");
  assert.equal(expanded.status, "EQUIVALENT_NOT_FULLY_FACTORED");
  assert.equal(numericLeft.status, "EQUIVALENT_NOT_FULLY_FACTORED");

  model.problems.filter((problem) => problem.answerContract.kind === "FACTORIZATION").forEach((problem) => {
    const result = algebra.assessFactorization(problem.expectedAnswer, problem.answerContract.originalExpression);
    assert.equal(result.status, "FULLY_FACTORED", problem.problemId);
    problem.acceptedAnswers.forEach((acceptedAnswer) => {
      assert.equal(
        algebra.assessFactorization(acceptedAnswer, problem.answerContract.originalExpression).status,
        "FULLY_FACTORED",
        `${problem.problemId}:${acceptedAnswer}`
      );
    });
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "CORRECT", problem.problemId);
    const unprocessed = model.evaluateProblemAnswer(problem, problem.answerContract.originalExpression);
    assert.equal(unprocessed.status, "INCORRECT", problem.problemId);
    assert.equal(unprocessed.reason, "NOT_FULLY_FACTORED", problem.problemId);
  });
});

test("공통 숫자·문자인수 누락과 부호 오류를 별도로 차단한다", () => {
  const commonNumeric = model.problems.find((problem) => problem.problemId.includes("numeric-common-factor"));
  const commonVariable = model.problems.find((problem) => problem.problemId.includes("variable-common-factor"));
  const negative = model.problems.find((problem) => problem.problemId.includes("negative-leading-factorization"));
  assert.equal(model.evaluateProblemAnswer(commonNumeric, "3(2x+4)").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(commonVariable, "x^2+5x").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(negative, "9x(x-3)").status, "INCORRECT");
});

test("완전제곱식·제곱의 차·단변수 이차식 인수분해가 각각 검증된다", () => {
  const square = algebra.assessFactorization("(2x-5)^2", "4x^2-20x+25");
  const difference = algebra.assessFactorization("(3x+7)(3x-7)", "9x^2-49");
  const sumProduct = algebra.assessFactorization("(x-6)(x+3)", "x^2-3x-18");
  assert.equal(square.status, "FULLY_FACTORED");
  assert.equal(difference.status, "FULLY_FACTORED");
  assert.equal(sumProduct.status, "FULLY_FACTORED");
  assert.equal(algebra.assessFactorization("(x+4)^2", "x^2-16").equivalent, false);
});

test("과정형은 정확한 순서만 허용하고 역순·누락·불필요한 단계가 모두 차단된다", () => {
  model.problems.filter((problem) => problem.answerType === "STEP_ORDER").forEach((problem) => {
    const steps = problem.requiredSteps;
    assert.ok(steps.length >= 3, problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, steps).status, "CORRECT", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, [...steps].reverse()).status, "INCORRECT", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, steps.slice(0, -1)).status, "INCORRECT", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, [...steps, "불필요한 단계"]).status, "INCORRECT", problem.problemId);
    assert.equal(problem.solutionSteps.length, steps.length, `${problem.problemId}:logical-step-count`);
    assert.equal(problem.answerContract.stepValidationMode, "PREVALIDATED_ORDERED_LOGICAL_STEPS");
    assert.equal(problem.answerContract.rejectOmittedSteps, true);
    assert.equal(problem.answerContract.rejectReorderedSteps, true);
    assert.equal(problem.answerContract.rejectAdditionalSteps, true);
  });
});

test("서술형은 REVIEW_REQUIRED와 3개 이상 필수 논점·부분답안 기준을 가진다", () => {
  model.problems.filter((problem) => problem.answerType === "WRITTEN_RESPONSE").forEach((problem) => {
    assert.equal(model.evaluateProblemAnswer(problem, "근거를 포함한 학생 답안").status, "REVIEW_REQUIRED");
    assert.equal(model.evaluateProblemAnswer(problem, "").status, "INVALID_INPUT");
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.partialCredit.length >= 2, problem.problemId);
    assert.deepEqual(problem.writtenRubric.requiredConcepts, problem.writtenRubric.requiredIdeas);
  });
});

test("A3~A5는 단계별 최소 사고 단계와 연결 조건 계약을 충족한다", () => {
  model.problems.filter((problem) => ["A3", "A4", "A5"].includes(problem.stage)).forEach((problem) => {
    assert.ok(problem.estimatedMeaningfulSteps >= { A3: 3, A4: 4, A5: 4 }[problem.stage], problem.problemId);
    assert.ok(problem.linkedConditionCount >= { A3: 2, A4: 3, A5: 4 }[problem.stage], problem.problemId);
    assert.equal(problem.directFormulaSubstitution, false, problem.problemId);
    assert.equal(problem.requiresStrategySelection, true, problem.problemId);
  });
  model.problems.filter((problem) => problem.stage === "A5").forEach((problem) => {
    assert.equal(problem.structureNovelty, "HIGH");
    assert.equal(problem.requiresExplanation, true);
    assert.ok(problem.reasoningGoals.includes("PROOF_JUSTIFICATION"));
    assert.ok(problem.reasoningGoals.includes("ERROR_ANALYSIS"));
  });
});

test("각 concept의 BASIC~A5 설명 콘텐츠 36개가 일곱 학습 요소를 모두 제공한다", () => {
  assert.equal(content.CONCEPTS.length, 6);
  CONCEPT_IDS.forEach((conceptId) => {
    STAGES.forEach((stage) => {
      const item = content.get(conceptId, stage);
      assert.ok(item, `${conceptId}:${stage}`);
      [
        "coreConcept",
        "easyExample",
        "commonMistakes",
        "procedure",
        "verification",
        "prerequisites",
        "nextConnection",
        "thinkingMethod",
        "validationMethod",
      ].forEach((field) => assert.ok(item[field]?.length, `${conceptId}:${stage}:${field}`));
      assert.equal(item.curriculumVersion, "2015_REVISED_MIDDLE_SCHOOL_MATH");
    });
  });
});

test("레거시 114문항을 import·재사용하지 않고 신규 콘텐츠 파일만 독립 구성한다", () => {
  const source = read("middle3-factorization-learning-model.js");
  assert.doesNotMatch(source, /middle3-concept-diagnostics/);
  assert.doesNotMatch(source, /middle3-stage-question-bank/);
  assert.doesNotMatch(source, /LEGACY_PROBLEM/);
  assert.match(source, /EXPLICIT_AUTHORED_PROBLEMS_NO_LEGACY_REUSE/);
});

test("2015 개정 중3 범위를 벗어나는 금지 개념이 신규 모델·설명에 없다", () => {
  const source = `${read("middle3-factorization-learning-model.js")}\n${read("middle3-factorization-learning-content.js")}`;
  [
    /나머지정리/,
    /인수정리/,
    /복소수/,
    /대칭다항식/,
    /다항식\s*나눗셈/,
    /일반\s*3차\s*인수분해/,
  ].forEach((pattern) => assert.doesNotMatch(source, pattern));
  assert.doesNotMatch(source, /\bx\^3\b|\bx³\b/);
  assert.doesNotMatch(source, /\bx\^4\b|\bx⁴\b/);
});

test("audit 집계는 문제·힌트·과정형·서술형 수와 일치한다", () => {
  const audit = model.audit();
  assert.equal(audit.problemCount, 144);
  assert.equal(audit.conceptCount, 6);
  assert.equal(audit.independentCheckCount, 36);
  assert.equal(audit.hintCount, 288);
  assert.equal(audit.processCount, 18);
  assert.equal(audit.writtenCount, 18);
});
