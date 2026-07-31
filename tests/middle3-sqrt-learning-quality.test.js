const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const algebra = require("../math-algebra-validator.js");
const model = require("../middle3-sqrt-learning-model.js");
const content = require("../middle3-sqrt-learning-content.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const EXPECTED_CONCEPT_IDS = [
  "m3_sqrt_meaning",
  "m3_sqrt_value",
  "m3_irrational_number",
  "m3_radical_simplification",
  "m3_radical_operations",
];
const HISTORICAL_APPROVED_HIGH_STAGE_IDS = [
  "m3-sqrt-013-sqrt_meaning-a3-opposite-sign-variables",
  "m3-sqrt-015-sqrt_meaning-a3-root-gap-recover-number",
  "m3-sqrt-037-sqrt_value-a3-divisible-perfect-square-range",
  "m3-sqrt-039-sqrt_value-a3-linked-proportional-radicals",
  "m3-sqrt-040-sqrt_value-a3-bounded-shifted-perfect-squares",
  "m3-sqrt-042-sqrt_value-a4-two-perfect-square-gap",
  "m3-sqrt-068-irrational_number-a4-no-adjacent-square-pair",
  "m3-sqrt-069-irrational_number-a5-rational-plus-irrational-proof",
  "m3-sqrt-071-irrational_number-a5-count-irrational-n-rational-scaled",
  "m3-sqrt-085-radical_simplification-a3-least-multiplier-perfect-square",
  "m3-sqrt-087-radical_simplification-a3-negative-variable-square-factor",
  "m3-sqrt-094-radical_simplification-a5-normal-form-uniqueness",
  "m3-sqrt-109-radical_operations-a3-symmetric-square-sum",
  "m3-sqrt-110-radical_operations-a3-reciprocal-conjugate",
  "m3-sqrt-111-radical_operations-a3-parameter-conjugate-equation",
  "m3-sqrt-112-radical_operations-a3-factor-and-cancel-binomial",
  "m3-sqrt-114-radical_operations-a4-fourth-power-conjugate-sum",
  "m3-sqrt-115-radical_operations-a4-reciprocal-square-expression",
  "m3-sqrt-118-radical_operations-a5-why-conjugate-rationalizes",
];
const HISTORICAL_APPROVED_HIGH_STAGE_SHA256 = "fbf58c9a864809ee2512b82c642b6d5f1b67ce6109645bf37e786fd275a753e6";
const FINAL_REWRITE_TARGET_IDS = [
  "m3-sqrt-061-irrational_number-a3-conjugate-product-classify",
  "m3-sqrt-062-irrational_number-a3-another-conjugate-difference",
  "m3-sqrt-044-sqrt_value-a4-sum-and-gap-perfect-roots",
  "m3-sqrt-091-radical_simplification-a4-reverse-normal-form-process",
  "m3-sqrt-118-radical_operations-a5-why-conjugate-rationalizes",
  "m3-sqrt-090-radical_simplification-a4-parameter-hidden-in-normal-form",
  "m3-sqrt-067-irrational_number-a4-irrational-square-sum",
];
const FROZEN_HIGH_STAGE_SHA256 = "1034efd0fda9c93cf73f2aabb7d6b61dfd9abdb33f7c1421cfa11697cdb83096";
const FINAL_HIGH_STAGE_SHA256 = "f8e5efc3d5170f1594c24eef14e01841679334bc4ef2c3c94fa34fcbc5806c9a";
const CURRENT_REWRITE_TARGET_IDS = [
  "m3-sqrt-013-sqrt_meaning-a3-opposite-sign-variables",
  "m3-sqrt-014-sqrt_meaning-a3-shifted-absolute-condition",
  "m3-sqrt-015-sqrt_meaning-a3-root-gap-recover-number",
  "m3-sqrt-037-sqrt_value-a3-divisible-perfect-square-range",
  "m3-sqrt-039-sqrt_value-a3-linked-proportional-radicals",
  "m3-sqrt-085-radical_simplification-a3-least-multiplier-perfect-square",
  "m3-sqrt-087-radical_simplification-a3-negative-variable-square-factor",
  "m3-sqrt-111-radical_operations-a3-parameter-conjugate-equation",
  "m3-sqrt-112-radical_operations-a3-factor-and-cancel-binomial",
  "m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition",
  "m3-sqrt-115-radical_operations-a4-reciprocal-square-expression",
  "m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process",
  "m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition",
  "m3-sqrt-069-irrational_number-a5-rational-plus-irrational-proof",
  "m3-sqrt-071-irrational_number-a5-count-irrational-n-rational-scaled",
  "m3-sqrt-094-radical_simplification-a5-normal-form-uniqueness",
];
const CURRENT_FROZEN_HIGH_STAGE_SHA256 = "83e3f6c5187ff63c07b6979efa416c9e0fb0de10e160229ffdcf9e379004bd69";
const CURRENT_FINAL_HIGH_STAGE_SHA256 = "878257afc805a5e5927240f921fb2ef7f074434a5febf8a3b6d16d1a8ecd324b";
const FINAL_SEVEN_REWRITE_TARGET_IDS = [
  "m3-sqrt-085-radical_simplification-a3-least-multiplier-perfect-square",
  "m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition",
  "m3-sqrt-115-radical_operations-a4-reciprocal-square-expression",
  "m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process",
  "m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition",
  "m3-sqrt-069-irrational_number-a5-rational-plus-irrational-proof",
  "m3-sqrt-071-irrational_number-a5-count-irrational-n-rational-scaled",
];
const FINAL_FROZEN_53_SHA256 = "a375c2904f9132ea6941f240fcf67a881a33573dea7122a10de5da2f95a3e302";
const FINAL_REWRITTEN_HIGH_STAGE_SHA256 = "a6f3961591d8a65da7ecdf527038cfe8b475d3dc5d28460eea0578c3d569ac39";
const REWRITTEN_HIGH_STAGE_IDS = [
  "m3-sqrt-014-sqrt_meaning-a3-shifted-absolute-condition",
  "m3-sqrt-016-sqrt_meaning-a3-absolute-equation-set",
  "m3-sqrt-017-sqrt_meaning-a4-hidden-sign-reverse",
  "m3-sqrt-018-sqrt_meaning-a4-translated-absolute-equation",
  "m3-sqrt-019-sqrt_meaning-a4-count-perfect-squares-in-range",
  "m3-sqrt-020-sqrt_meaning-a4-ordered-negative-variables",
  "m3-sqrt-021-sqrt_meaning-a5-sign-case-system-process",
  "m3-sqrt-022-sqrt_meaning-a5-explain-absolute-necessity",
  "m3-sqrt-023-sqrt_meaning-a5-opposite-equal-squares",
  "m3-sqrt-024-sqrt_meaning-a5-reject-radical-addition-law",
  "m3-sqrt-038-sqrt_value-a3-fraction-radical-equation",
  "m3-sqrt-041-sqrt_value-a4-twice-natural-perfect-square",
  "m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition",
  "m3-sqrt-044-sqrt_value-a4-sum-and-gap-perfect-roots",
  "m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process",
  "m3-sqrt-046-sqrt_value-a5-decimal-root-sign-explanation",
  "m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition",
  "m3-sqrt-048-sqrt_value-a5-difference-of-square-roots-strategy",
  "m3-sqrt-061-irrational_number-a3-conjugate-product-classify",
  "m3-sqrt-062-irrational_number-a3-another-conjugate-difference",
  "m3-sqrt-063-irrational_number-a3-combine-like-irrationals",
  "m3-sqrt-064-irrational_number-a3-conjugate-mixed-roots",
  "m3-sqrt-065-irrational_number-a4-subtract-unlike-before-simplify",
  "m3-sqrt-066-irrational_number-a4-count-scaled-rational-roots",
  "m3-sqrt-067-irrational_number-a4-irrational-square-sum",
  "m3-sqrt-070-irrational_number-a5-square-conjugate-cancellation-process",
  "m3-sqrt-072-irrational_number-a5-reject-irrational-product-rule",
  "m3-sqrt-086-radical_simplification-a3-recover-radicand-parameter",
  "m3-sqrt-088-radical_simplification-a3-coefficient-identification",
  "m3-sqrt-089-radical_simplification-a4-least-divisor-for-square-quotient",
  "m3-sqrt-090-radical_simplification-a4-parameter-hidden-in-normal-form",
  "m3-sqrt-091-radical_simplification-a4-reverse-normal-form-process",
  "m3-sqrt-092-radical_simplification-a4-quotient-after-simplification",
  "m3-sqrt-093-radical_simplification-a5-prime-factor-process",
  "m3-sqrt-095-radical_simplification-a5-simultaneous-square-multiplier",
  "m3-sqrt-096-radical_simplification-a5-invalid-radical-splitting",
  "m3-sqrt-113-radical_operations-a4-difference-of-reciprocals",
  "m3-sqrt-116-radical_operations-a4-difference-denominator-rationalize",
  "m3-sqrt-117-radical_operations-a5-sum-reciprocal-process",
  "m3-sqrt-119-radical_operations-a5-cubic-reciprocal-symmetric",
  "m3-sqrt-120-radical_operations-a5-rationalization-error-review",
];
const INDEPENDENTLY_RECALCULATED_ANSWERS = {
  "m3-sqrt-014-sqrt_meaning-a3-shifted-absolute-condition": "4",
  "m3-sqrt-016-sqrt_meaning-a3-absolute-equation-set": "6",
  "m3-sqrt-017-sqrt_meaning-a4-hidden-sign-reverse": "-21",
  "m3-sqrt-018-sqrt_meaning-a4-translated-absolute-equation": "-6,4",
  "m3-sqrt-019-sqrt_meaning-a4-count-perfect-squares-in-range": "2",
  "m3-sqrt-020-sqrt_meaning-a4-ordered-negative-variables": "-3",
  "m3-sqrt-021-sqrt_meaning-a5-sign-case-system-process": "ab≥0",
  "m3-sqrt-022-sqrt_meaning-a5-explain-absolute-necessity": "a≥|b|",
  "m3-sqrt-023-sqrt_meaning-a5-opposite-equal-squares": "8",
  "m3-sqrt-024-sqrt_meaning-a5-reject-radical-addition-law": "p<0이면 0개, p=0이면 무한히 많고, p>0이면 1개",
  "m3-sqrt-038-sqrt_value-a3-fraction-radical-equation": "36",
  "m3-sqrt-041-sqrt_value-a4-twice-natural-perfect-square": "0",
  "m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition": "√3-√2",
  "m3-sqrt-044-sqrt_value-a4-sum-and-gap-perfect-roots": "32",
  "m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process": "72",
  "m3-sqrt-046-sqrt_value-a5-decimal-root-sign-explanation": "p와 q가 각각 완전제곱수",
  "m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition": "2960",
  "m3-sqrt-048-sqrt_value-a5-difference-of-square-roots-strategy": "√m과 √n은 각각 자연수",
  "m3-sqrt-061-irrational_number-a3-conjugate-product-classify": "-2√3",
  "m3-sqrt-062-irrational_number-a3-another-conjugate-difference": "12",
  "m3-sqrt-063-irrational_number-a3-combine-like-irrationals": "x²+1/x²",
  "m3-sqrt-064-irrational_number-a3-conjugate-mixed-roots": "2",
  "m3-sqrt-065-irrational_number-a4-subtract-unlike-before-simplify": "7",
  "m3-sqrt-066-irrational_number-a4-count-scaled-rational-roots": "a=b=0",
  "m3-sqrt-067-irrational_number-a4-irrational-square-sum": "√2+√7<√3+√6",
  "m3-sqrt-070-irrational_number-a5-square-conjugate-cancellation-process": "mn이 완전제곱수",
  "m3-sqrt-072-irrational_number-a5-reject-irrational-product-rule": "α=√2, β=1-√2",
  "m3-sqrt-086-radical_simplification-a3-recover-radicand-parameter": "6,9,15,18,21,30",
  "m3-sqrt-088-radical_simplification-a3-coefficient-identification": "120",
  "m3-sqrt-089-radical_simplification-a4-least-divisor-for-square-quotient": "15",
  "m3-sqrt-090-radical_simplification-a4-parameter-hidden-in-normal-form": "13",
  "m3-sqrt-091-radical_simplification-a4-reverse-normal-form-process": "20",
  "m3-sqrt-092-radical_simplification-a4-quotient-after-simplification": "3,12,27",
  "m3-sqrt-093-radical_simplification-a5-prime-factor-process": "2,18,50,450",
  "m3-sqrt-095-radical_simplification-a5-simultaneous-square-multiplier": "그런 자연수 n은 없다.",
  "m3-sqrt-096-radical_simplification-a5-invalid-radical-splitting": "a≥0",
  "m3-sqrt-113-radical_operations-a4-difference-of-reciprocals": "2√15",
  "m3-sqrt-116-radical_operations-a4-difference-denominator-rationalize": "-2",
  "m3-sqrt-117-radical_operations-a5-sum-reciprocal-process": "p=q이고 값은 p",
  "m3-sqrt-119-radical_operations-a5-cubic-reciprocal-symmetric": "322",
  "m3-sqrt-120-radical_operations-a5-rationalization-error-review": "a가 완전제곱수",
};
const CURRENT_RECALCULATED_ANSWERS = {
  "m3-sqrt-013-sqrt_meaning-a3-opposite-sign-variables": "8",
  "m3-sqrt-014-sqrt_meaning-a3-shifted-absolute-condition": "4",
  "m3-sqrt-015-sqrt_meaning-a3-root-gap-recover-number": "64",
  "m3-sqrt-037-sqrt_value-a3-divisible-perfect-square-range": "12",
  "m3-sqrt-039-sqrt_value-a3-linked-proportional-radicals": "49",
  "m3-sqrt-085-radical_simplification-a3-least-multiplier-perfect-square": "18",
  "m3-sqrt-087-radical_simplification-a3-negative-variable-square-factor": "-2x√5",
  "m3-sqrt-111-radical_operations-a3-parameter-conjugate-equation": "3",
  "m3-sqrt-112-radical_operations-a3-factor-and-cancel-binomial": "18",
  "m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition": "√3-√2",
  "m3-sqrt-115-radical_operations-a4-reciprocal-square-expression": "27",
  "m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process": "72",
  "m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition": "2960",
  "m3-sqrt-069-irrational_number-a5-rational-plus-irrational-proof": "실수 계수에서는 반례가 생기지만 유리수 계수에서는 q≠0이 무리수일 필요충분조건이고 표현의 두 계수는 유일하다.",
  "m3-sqrt-071-irrational_number-a5-count-irrational-n-rational-scaled": "1684",
  "m3-sqrt-094-radical_simplification-a5-normal-form-uniqueness": "소인수 지수의 홀짝으로 b=d, 이어서 a=c이며, 제곱 인수 조건을 빼면 같은 N의 서로 다른 표현이 가능하다.",
};

function countBy(values, selector) {
  return values.reduce((result, value) => {
    const key = selector(value);
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}

function normalizedPrompt(value) {
  return String(value)
    .normalize("NFKC")
    .replace(/[−–—]/g, "-")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function numericStructure(value) {
  return normalizedPrompt(value)
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/#+/g, "#");
}

function problemByKey(key) {
  const problem = model.problems.find((item) => item.problemId.endsWith(key));
  assert.ok(problem, key);
  return problem;
}

test("명시적으로 저작한 120문항을 5개 concept와 6단계에 정확히 배치한다", () => {
  assert.equal(model.AUTHORING_MODE, "EXPLICIT_AUTHORED_PROBLEMS_NO_NUMERIC_VARIANTS");
  assert.equal(model.problems.length, 120);
  assert.deepEqual(model.concepts.map((concept) => concept.conceptId), EXPECTED_CONCEPT_IDS);
  assert.deepEqual(countBy(model.problems, (problem) => problem.conceptId), Object.fromEntries(
    EXPECTED_CONCEPT_IDS.map((conceptId) => [conceptId, 24])
  ));
  assert.deepEqual(countBy(model.problems, (problem) => problem.stage), {
    BASIC: 20,
    A1: 20,
    A2: 20,
    A3: 20,
    A4: 20,
    A5: 20,
  });
  EXPECTED_CONCEPT_IDS.forEach((conceptId) => {
    model.STAGES.forEach((stage) => {
      const problems = model.getProblems(conceptId, stage);
      assert.equal(problems.length, 4, `${conceptId}:${stage}`);
      assert.equal(problems.filter((problem) => problem.independentCheck).length, 1, `${conceptId}:${stage}:independent`);
      assert.equal(problems.filter((problem) => !problem.independentCheck).length, 3, `${conceptId}:${stage}:learning`);
    });
  });
});

test("모든 문항이 필수 데이터와 두 단계 힌트·풀이·감사 메타데이터를 가진다", () => {
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
  ];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.ok(Object.hasOwn(problem, field), `${problem.id}:${field}`));
    assert.equal(problem.id, problem.problemId);
    assert.ok(problem.prompt.length >= 12, problem.id);
    assert.ok(problem.explanation.length >= 20, problem.id);
    assert.ok(problem.hints.length >= 2, problem.id);
    assert.ok(problem.hints.every((hint) => hint.length >= 10), problem.id);
    assert.ok(problem.solutionSteps.length >= 2, problem.id);
    assert.ok(problem.misconceptionTags.length >= 1, problem.id);
    assert.ok(problem.difficultyEvidence.length >= 2, problem.id);
    assert.equal(problem.curriculumVersion, "2015_REVISED_MIDDLE_SCHOOL_MATH");
    assert.equal(problem.futureCurriculumCompatibility, "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE");
    assert.equal(problem.authoringScope, "MIDDLE3_SQRT_LEARNING_AUTHORED_V1");
    assert.equal(problem.executionScope, "LEARNING_ONLY");
    if (problem.answerType === "MULTIPLE_CHOICE") {
      assert.ok(Array.isArray(problem.choices), problem.id);
      assert.equal(problem.choices.length, 4, problem.id);
    }
  });
});

test("혼자 풀기 30문항은 같은 단계 학습 문항과 구조가 다르고 공개 정책이 잠겨 있다", () => {
  const independent = model.problems.filter((problem) => problem.independentCheck);
  assert.equal(independent.length, 30);
  independent.forEach((problem) => {
    const learning = model.getProblems(problem.conceptId, problem.stage)
      .filter((candidate) => !candidate.independentCheck);
    assert.ok(learning.every((candidate) => candidate.structureFamily !== problem.structureFamily), problem.id);
    assert.ok(learning.every((candidate) => numericStructure(candidate.prompt) !== numericStructure(problem.prompt)), problem.id);
    assert.equal(problem.independentCheckPolicy.hintDisclosure, "LOCKED_DURING_INDEPENDENT_CHECK");
    assert.equal(problem.independentCheckPolicy.solutionDisclosure, "AFTER_FINAL");
  });
});

test("다섯 answerType이 고르게 존재하고 A4·A5는 과정형·서술형을 포함한다", () => {
  const distribution = countBy(model.problems, (problem) => problem.answerType);
  assert.deepEqual(distribution, {
    MULTIPLE_CHOICE: 14,
    SHORT_ANSWER: 47,
    EXPRESSION_INPUT: 40,
    STEP_ORDER: 2,
    WRITTEN_RESPONSE: 17,
  });
  assert.ok(distribution.MULTIPLE_CHOICE < model.problems.length / 2);
  model.ANSWER_TYPES.forEach((answerType) => assert.ok(distribution[answerType] > 0, answerType));
  const a4 = model.problems.filter((problem) => problem.stage === "A4");
  const a5 = model.problems.filter((problem) => problem.stage === "A5");
  assert.ok(a4.some((problem) => problem.answerType === "STEP_ORDER"));
  assert.ok(a4.some((problem) => problem.answerType === "WRITTEN_RESPONSE"));
  assert.ok(a5.some((problem) => problem.answerType === "WRITTEN_RESPONSE"));
  const processProblems = model.problems.filter((problem) => problem.answerType === "STEP_ORDER");
  assert.deepEqual(processProblems.map((problem) => problem.problemId), [
    "m3-sqrt-042-sqrt_value-a4-two-perfect-square-gap",
    "m3-sqrt-114-radical_operations-a4-fourth-power-conjugate-sum",
  ]);
  processProblems.forEach((problem) => {
    assert.ok(problem.expectedAnswer.length >= 4, problem.id);
    assert.ok(problem.solutionSteps.length >= problem.expectedAnswer.length, problem.id);
  });
});

test("동결 과정형 2문항은 논리 순서·누락·역순을 엄격히 구분한다", () => {
  const processProblems = model.problems.filter((problem) => problem.answerType === "STEP_ORDER");
  const expectedById = {
    "m3-sqrt-042-sqrt_value-a4-two-perfect-square-gap": [
      "a=√n,b=√(n+9)",
      "b²-a²=9",
      "(b-a)(b+a)=9",
      "a=4,b=5",
      "n=16",
    ],
    "m3-sqrt-114-radical_operations-a4-fourth-power-conjugate-sum": [
      "제곱하면 5±2√6",
      "(5+2√6)²+(5-2√6)²",
      "2(25+24)",
      "값=98",
    ],
  };
  const solutionAnchorsById = {
    "m3-sqrt-042-sqrt_value-a4-two-perfect-square-gap": [
      "a=√n",
      "b²-a²=9",
      "b-a=1",
      "a=4",
      "n=a²=16",
    ],
    "m3-sqrt-114-radical_operations-a4-fourth-power-conjugate-sum": [
      "5±2√6",
      "다시 제곱",
      "소거",
      "98",
    ],
  };
  processProblems.forEach((problem) => {
    assert.deepEqual(problem.expectedAnswer, expectedById[problem.problemId], problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "CORRECT", problem.problemId);
    assert.notEqual(model.evaluateProblemAnswer(problem, [...problem.expectedAnswer].reverse()).status, "CORRECT", problem.problemId);
    assert.notEqual(model.evaluateProblemAnswer(problem, problem.expectedAnswer.slice(0, -1)).status, "CORRECT", problem.problemId);
    assert.equal(new Set(problem.expectedAnswer.map(normalizedPrompt)).size, problem.expectedAnswer.length, problem.problemId);
    assert.ok(problem.solutionSteps.length >= problem.expectedAnswer.length, problem.problemId);
    solutionAnchorsById[problem.problemId].forEach((anchor, index) => {
      assert.ok(normalizedPrompt(problem.solutionSteps[index]).includes(normalizedPrompt(anchor)), `${problem.problemId}:${index}`);
    });
  });
});

test("서술형 17문항은 근거 중심 rubric과 REVIEW_REQUIRED 계약을 유지한다", () => {
  const written = model.problems.filter((problem) => problem.answerType === "WRITTEN_RESPONSE");
  assert.equal(written.length, 17);
  written.forEach((problem) => {
    assert.equal(problem.answerContract.kind, "WRITTEN_REVIEW", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "REVIEW_REQUIRED", problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, "결과만 쓴 일부 답안").status, "REVIEW_REQUIRED", problem.problemId);
    assert.ok(/설명|증명|판정|구성/.test(problem.prompt), problem.problemId);
    assert.ok(problem.solutionSteps.length >= 4, problem.problemId);
    assert.ok(problem.writtenRubric, problem.problemId);
    assert.ok(Array.isArray(problem.writtenRubric.requiredIdeas), problem.problemId);
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.minimumEvidence >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.minimumEvidence <= problem.writtenRubric.requiredIdeas.length, problem.problemId);
  });
});

test("m3-sqrt-045는 독립된 두 근호 조건을 인수쌍으로 완전 분류해 최소성을 검증한다", () => {
  const problem = model.problemsById["m3-sqrt-045-sqrt_value-a5-scaled-root-equation-process"];
  assert.equal(problem.answerType, "SHORT_ANSWER");
  assert.equal(problem.answerContract.kind, "ALGEBRA_EQUIVALENCE");
  assert.equal(problem.expectedAnswer, "72");
  const candidates = Array.from({ length: 639 }, (_, index) => index + 1)
    .filter((u) => 640 % u === 0 && u < 640 / u)
    .map((u) => {
      const v = 640 / u;
      return { u, v, a: (v - u) / 6, b: (u + v) / 4 };
    })
    .filter(({ a, b }) => Number.isInteger(a) && a > 0 && Number.isInteger(b) && b > 0)
    .map(({ u, v, a, b }) => ({ u, v, a, b, n: 18 * a * a }))
    .sort((left, right) => left.n - right.n);
  assert.deepEqual(candidates.map(({ n }) => n), [72, 288, 2592, 12168]);
  assert.deepEqual(candidates.filter(({ a, b }) => (a + b) % 3 === 0).map(({ n }) => n), [72, 288]);
  assert.equal(model.evaluateProblemAnswer(problem, "72").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(problem, "288").status, "INCORRECT");
  assert.ok(problem.solutionSteps.some((step) => step.includes("가장 작은")), problem.problemId);
  assert.ok(problem.solutionSteps.some((step) => step.includes("더 작은")), problem.problemId);
});

test("과거 해시는 기록으로 보존하고 현재 수정 대상 밖 승인 44문항을 새 해시로 동결한다", () => {
  assert.equal(new Set(HISTORICAL_APPROVED_HIGH_STAGE_IDS).size, 19);
  assert.equal(HISTORICAL_APPROVED_HIGH_STAGE_SHA256, "fbf58c9a864809ee2512b82c642b6d5f1b67ce6109645bf37e786fd275a753e6");
  assert.ok(HISTORICAL_APPROVED_HIGH_STAGE_IDS.includes("m3-sqrt-118-radical_operations-a5-why-conjugate-rationalizes"));
  assert.equal(new Set(FINAL_REWRITE_TARGET_IDS).size, 7);
  assert.equal(FROZEN_HIGH_STAGE_SHA256, "1034efd0fda9c93cf73f2aabb7d6b61dfd9abdb33f7c1421cfa11697cdb83096");
  assert.equal(FINAL_HIGH_STAGE_SHA256, "f8e5efc3d5170f1594c24eef14e01841679334bc4ef2c3c94fa34fcbc5806c9a");
  assert.equal(new Set(CURRENT_REWRITE_TARGET_IDS).size, 16);
  assert.equal(new Set(REWRITTEN_HIGH_STAGE_IDS).size, 41);
  const highStage = model.problems.filter((problem) => ["A3", "A4", "A5"].includes(problem.stage));
  const frozen = highStage.filter((problem) => !CURRENT_REWRITE_TARGET_IDS.includes(problem.problemId));
  const currentTargets = highStage.filter((problem) => CURRENT_REWRITE_TARGET_IDS.includes(problem.problemId));
  const rewritten = model.problems.filter((problem) => REWRITTEN_HIGH_STAGE_IDS.includes(problem.problemId));
  assert.equal(highStage.length, 60);
  assert.equal(frozen.length, 44);
  assert.equal(currentTargets.length, 16);
  assert.equal(rewritten.length, 41);
  assert.equal(crypto.createHash("sha256").update(JSON.stringify(frozen)).digest("hex"), CURRENT_FROZEN_HIGH_STAGE_SHA256);
  assert.equal(CURRENT_FINAL_HIGH_STAGE_SHA256, "878257afc805a5e5927240f921fb2ef7f074434a5febf8a3b6d16d1a8ecd324b");
  assert.deepEqual(countBy(rewritten, (problem) => problem.stage), { A3: 9, A4: 16, A5: 16 });
  currentTargets.forEach((problem) => {
    assert.ok(problem.difficultyEvidence.length >= 3, problem.problemId);
    assert.equal(problem.independentValidation.conditionFeasible, true, problem.problemId);
    assert.equal(problem.independentValidation.uniqueAnswer, true, problem.problemId);
  });
});

test("최종 수정 7문항 밖 승인 53문항은 새 해시로 동결되고 변경되지 않는다", () => {
  const highStage = model.problems.filter((problem) => ["A3", "A4", "A5"].includes(problem.stage));
  const frozen = highStage.filter((problem) => !FINAL_SEVEN_REWRITE_TARGET_IDS.includes(problem.problemId));
  const targets = highStage.filter((problem) => FINAL_SEVEN_REWRITE_TARGET_IDS.includes(problem.problemId));
  assert.equal(new Set(FINAL_SEVEN_REWRITE_TARGET_IDS).size, 7);
  assert.equal(highStage.length, 60);
  assert.equal(frozen.length, 53);
  assert.equal(targets.length, 7);
  assert.deepEqual(countBy(targets, (problem) => problem.stage), { A3: 1, A4: 2, A5: 4 });
  assert.equal(
    crypto.createHash("sha256").update(JSON.stringify(frozen)).digest("hex"),
    FINAL_FROZEN_53_SHA256
  );
  assert.equal(
    crypto.createHash("sha256").update(JSON.stringify(highStage)).digest("hex"),
    FINAL_REWRITTEN_HIGH_STAGE_SHA256
  );
});

test("최종 재작성 7문항은 직접 검산·유일성·동치 답안·대표 오답 계약을 만족한다", () => {
  const byId = Object.fromEntries(FINAL_REWRITE_TARGET_IDS.map((problemId) => [
    problemId,
    model.problemsById[problemId],
  ]));
  Object.entries(byId).forEach(([problemId, problem]) => assert.ok(problem, problemId));

  const p061 = byId["m3-sqrt-061-irrational_number-a3-conjugate-product-classify"];
  assert.equal(p061.expectedAnswer, "-2√3");
  assert.equal(model.evaluateProblemAnswer(p061, "-2√3").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p061, "2√3").status, "INCORRECT");
  assert.ok(p061.solutionSteps.some((step) => step.includes("b-a-1")));
  assert.ok(p061.solutionSteps.some((step) => step.includes("a=3, b=4")));

  const p062 = byId["m3-sqrt-062-irrational_number-a3-another-conjugate-difference"];
  assert.equal(p062.expectedAnswer, "12");
  assert.equal(model.evaluateProblemAnswer(p062, "12").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p062, "6").status, "INCORRECT");
  assert.ok(p062.solutionSteps.some((step) => step.includes("4r√3")));
  assert.ok(p062.solutionSteps.some((step) => step.includes("r=0")));

  const p044 = byId["m3-sqrt-044-sqrt_value-a4-sum-and-gap-perfect-roots"];
  const isPrime = (value) => value >= 2
    && Array.from({ length: Math.floor(Math.sqrt(value)) - 1 }, (_, index) => index + 2)
      .every((divisor) => value % divisor !== 0);
  const p044Candidates = Array.from({ length: 79 }, (_, index) => index + 21)
    .filter((n) => Number.isInteger(Math.sqrt(2 * n)))
    .filter((n) => isPrime(Math.sqrt(2 * n) - Math.floor(Math.sqrt(n))));
  assert.deepEqual(p044Candidates, [32, 50, 98]);
  assert.equal(Math.min(...p044Candidates), 32);
  assert.equal(model.evaluateProblemAnswer(p044, "32").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p044, "50").status, "INCORRECT");

  const p067 = byId["m3-sqrt-067-irrational_number-a4-irrational-square-sum"];
  assert.deepEqual(p067.acceptedAnswers, ["√3+√6>√2+√7"]);
  [
    "√2+√7<√3+√6",
    "√3+√6>√2+√7",
  ].forEach((answer) => assert.equal(model.evaluateProblemAnswer(p067, answer).status, "CORRECT", answer));
  [
    "√2+√7>√3+√6",
    "√2+√7=√3+√6",
    "√2<√3+√6",
  ].forEach((answer) => assert.equal(model.evaluateProblemAnswer(p067, answer).status, "INCORRECT", answer));

  const p090 = byId["m3-sqrt-090-radical_simplification-a4-parameter-hidden-in-normal-form"];
  assert.match(p090.prompt, /최대공약수가 1/);
  assert.match(p090.prompt, /gcd\(a,b,c\)=1/);
  const gcd = (left, right) => {
    let a = Math.abs(left);
    let b = Math.abs(right);
    while (b) [a, b] = [b, a % b];
    return a;
  };
  const p090Candidates = Array.from({ length: 20 }, (_, index) => index + 1)
    .map((t) => [6 * t, 4 * t, 3 * t])
    .filter(([a, b, c]) => gcd(gcd(a, b), c) === 1);
  assert.deepEqual(p090Candidates, [[6, 4, 3]]);
  assert.equal(p090Candidates[0].reduce((sum, value) => sum + value, 0), 13);
  assert.equal(model.evaluateProblemAnswer(p090, "13").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p090, "12").status, "INCORRECT");

  const p091 = byId["m3-sqrt-091-radical_simplification-a4-reverse-normal-form-process"];
  const isSquareFree = (value) => (
    Array.from({ length: Math.floor(Math.sqrt(value)) - 1 }, (_, index) => index + 2)
      .every((divisor) => value % (divisor * divisor) !== 0)
  );
  const p091Candidates = Array.from({ length: 4 }, (_, index) => index + 1)
    .map((t) => {
      const a = 2 * t;
      const b = 3 * t;
      const c = 25 - 5 * t;
      const n = (a * a * c) / 12;
      return { a, b, c, n };
    })
    .filter(({ c, n }) => c > 1 && isSquareFree(c) && Number.isInteger(n))
    .map(({ n }) => n);
  assert.deepEqual(p091Candidates, [20, 30]);
  assert.equal(Math.min(...p091Candidates), 20);
  assert.ok(Math.abs(Math.sqrt(12 * 20) - 4 * Math.sqrt(15)) < 1e-12);
  assert.ok(Math.abs(Math.sqrt(27 * 20) - 6 * Math.sqrt(15)) < 1e-12);
  assert.equal(model.evaluateProblemAnswer(p091, "20").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p091, "30").status, "INCORRECT");

  const p118 = byId["m3-sqrt-118-radical_operations-a5-why-conjugate-rationalizes"];
  assert.equal(p118.answerType, "WRITTEN_RESPONSE");
  assert.equal(p118.answerContract.kind, "WRITTEN_REVIEW");
  assert.equal(model.evaluateProblemAnswer(p118, p118.expectedAnswer).status, "REVIEW_REQUIRED");
  assert.deepEqual(p118.writtenRubric.requiredIdeas, [
    "합의 유리성",
    "차의 유리성",
    "두 제곱근의 유리성",
    "a,b의 완전제곱 조건",
    "충분성",
    "유리화 일반식",
  ]);
  assert.equal(p118.writtenRubric.minimumEvidence, 6);
  [[9, 4], [25, 1], [16, 9]].forEach(([a, b]) => {
    const original = 1 / (Math.sqrt(a) + Math.sqrt(b));
    const rationalized = (Math.sqrt(a) - Math.sqrt(b)) / (a - b);
    assert.ok(Math.abs(original - rationalized) < 1e-12);
  });
});

test("현재 수정 16문항은 직접 계산·유일성·범위·대표 오답 계약을 만족한다", () => {
  assert.deepEqual(Object.keys(CURRENT_RECALCULATED_ANSWERS).sort(), [...CURRENT_REWRITE_TARGET_IDS].sort());
  Object.entries(CURRENT_RECALCULATED_ANSWERS).forEach(([problemId, answer]) => {
    assert.equal(model.problemsById[problemId].expectedAnswer, answer, problemId);
  });
  assert.deepEqual(countBy(
    CURRENT_REWRITE_TARGET_IDS.map((problemId) => model.problemsById[problemId]),
    (problem) => problem.stage
  ), { A3: 9, A4: 2, A5: 5 });

  const p013 = model.problemsById["m3-sqrt-013-sqrt_meaning-a3-opposite-sign-variables"];
  const p013Candidates = [-3, 3].flatMap((a) => [-5, 5].map((b) => ({ a, b })))
    .filter(({ a, b }) => a + b === 2);
  assert.deepEqual(p013Candidates, [{ a: -3, b: 5 }]);
  assert.equal(Math.abs(p013Candidates[0].a - p013Candidates[0].b), 8);
  assert.equal(model.evaluateProblemAnswer(p013, "8").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p013, "2").status, "INCORRECT");

  const p014 = model.problemsById["m3-sqrt-014-sqrt_meaning-a3-shifted-absolute-condition"];
  const p014Candidates = [-3, 6].filter((x) => Math.abs(x + 2) + Math.abs(x - 5) === 9);
  assert.deepEqual(p014Candidates, [-3, 6]);
  assert.deepEqual(p014Candidates.filter((x) => x < 0), [-3]);
  assert.equal(Math.abs(-3 - 1), 4);
  assert.equal(model.evaluateProblemAnswer(p014, "4").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p014, "5").status, "INCORRECT");

  const p015 = model.problemsById["m3-sqrt-015-sqrt_meaning-a3-root-gap-recover-number"];
  const p015Candidates = Array.from({ length: 99 }, (_, index) => index + 51)
    .filter((n) => Number.isInteger(Math.sqrt(n)))
    .map((n) => ({ n, d: 2 * Math.sqrt(n) }))
    .filter(({ n, d }) => (n + d) % 20 === 0 && d % 5 !== 0);
  assert.deepEqual(p015Candidates, [{ n: 64, d: 16 }]);
  assert.equal(model.evaluateProblemAnswer(p015, "64").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p015, "100").status, "INCORRECT");

  const p037 = model.problemsById["m3-sqrt-037-sqrt_value-a3-divisible-perfect-square-range"];
  const p037Candidates = Array.from({ length: 249 }, (_, index) => index + 51)
    .filter((n) => Number.isInteger(Math.sqrt(n)))
    .filter((n) => 60 % Math.sqrt(n) === 0 && n % 8 === 0);
  assert.deepEqual(p037Candidates, [144]);
  assert.equal(model.evaluateProblemAnswer(p037, "12").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p037, "15").status, "INCORRECT");

  const p039 = model.problemsById["m3-sqrt-039-sqrt_value-a3-linked-proportional-radicals"];
  const p039Candidates = Array.from({ length: 200 }, (_, index) => index + 1)
    .filter((x) => Number.isInteger(Math.sqrt(x)) && Number.isInteger(Math.sqrt(4 * x)))
    .filter((x) => 20 < Math.sqrt(x) + Math.sqrt(4 * x) && Math.sqrt(x) + Math.sqrt(4 * x) < 30)
    .filter((x) => Number.isInteger(Math.sqrt(x + 15)));
  assert.deepEqual(p039Candidates, [49]);
  assert.equal(model.evaluateProblemAnswer(p039, "49").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p039, "64").status, "INCORRECT");

  const p085 = model.problemsById["m3-sqrt-085-radical_simplification-a3-least-multiplier-perfect-square"];
  const p085Candidates = Array.from({ length: 100 }, (_, index) => index + 1)
    .filter((n) => Number.isInteger(Math.sqrt(72 * n)))
    .filter((n) => 360 % n === 0)
    .filter((n) => n % 7 === 4);
  assert.deepEqual(p085Candidates, [18]);
  assert.equal(model.evaluateProblemAnswer(p085, "18").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p085, "8").status, "INCORRECT");

  const p087 = model.problemsById["m3-sqrt-087-radical_simplification-a3-negative-variable-square-factor"];
  assert.equal(model.evaluateProblemAnswer(p087, "-2√5x").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p087, "2x√5").status, "INCORRECT");
  [-1, -4, -9].forEach((x) => {
    const original = Math.sqrt(45 * x * x) - Math.sqrt(5 * x * x);
    assert.ok(Math.abs(original - (-2 * x * Math.sqrt(5))) < 1e-12);
  });

  const p111 = model.problemsById["m3-sqrt-111-radical_operations-a3-parameter-conjugate-equation"];
  const p111Candidates = [-3, -1, 3].filter((a) => (
    Math.abs((Math.sqrt(2) + a) * (Math.sqrt(2) - a) + 7) < 1e-12
    && Math.abs(Math.abs(a - 1) - 2) < 1e-12
  ));
  assert.deepEqual(p111Candidates, [3]);
  assert.equal(model.evaluateProblemAnswer(p111, "3").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p111, "-3").status, "INCORRECT");

  const p112 = model.problemsById["m3-sqrt-112-radical_operations-a3-factor-and-cancel-binomial"];
  const p112Candidates = Array.from({ length: 54 }, (_, index) => index + 6)
    .map((n) => ({ n, q: Math.sqrt(2 * n) }))
    .filter(({ q }) => Number.isInteger(q) && q % 4 !== 0);
  assert.deepEqual(p112Candidates.map(({ n }) => n), [18, 50]);
  assert.equal(Math.min(...p112Candidates.map(({ n }) => n)), 18);
  assert.equal(model.evaluateProblemAnswer(p112, "18").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p112, "50").status, "INCORRECT");

  const p043 = model.problemsById["m3-sqrt-043-sqrt_value-a4-reciprocal-root-condition"];
  assert.equal(p043.answerContract.kind, "RECIPROCAL_RADICAL_PAIR_NORMALIZED");
  assert.deepEqual(p043.acceptedAnswers, []);
  [
    "√3-√2",
    "-√2+√3",
    "1/(√3+√2)",
    "1/(√2+√3)",
    " ( √3 - √2 ) ",
    "((1/(√2+√3)))",
  ].forEach((answer) => {
    assert.equal(model.evaluateProblemAnswer(p043, answer).status, "CORRECT", answer);
  });
  [
    "√2-√3",
    "1/(√3-√2)",
    "1/(√2-√3)",
    "√3",
    "√3-√2=0",
    "1/√3+√2",
  ].forEach((answer) => {
    assert.equal(model.evaluateProblemAnswer(p043, answer).status, "INCORRECT", answer);
  });

  const p115 = model.problemsById["m3-sqrt-115-radical_operations-a4-reciprocal-square-expression"];
  const p115Candidates = Array.from({ length: 11 }, (_, index) => index + 9)
    .map((m) => ({
      m,
      values: [Math.sqrt(m - 4), m - 2, Math.sqrt(m * (m - 4))],
    }))
    .filter(({ values }) => values.filter(Number.isInteger).length === 2);
  assert.deepEqual(p115Candidates, [{ m: 13, values: [3, 11, Math.sqrt(117)] }]);
  assert.equal(13 + 3 + 11, 27);
  assert.equal(model.evaluateProblemAnswer(p115, "27").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p115, "24").status, "INCORRECT");

  const p047 = model.problemsById["m3-sqrt-047-sqrt_value-a5-perfect-square-sum-condition"];
  const gcd = (left, right) => (right === 0 ? left : gcd(right, left % right));
  const p047Values = Array.from({ length: 420 }, (_, index) => index + 1)
    .filter((a) => 420 % a === 0)
    .map((a) => ({ a, b: 420 / a, n: a * a }))
    .filter(({ a, b }) => gcd(a, b) === 2 && 40 < a + b && a + b < 60);
  assert.deepEqual(p047Values.map(({ n }) => n), [100, 196, 900, 1764]);
  assert.equal(p047Values.reduce((sum, { n }) => sum + n, 0), 2960);
  assert.equal(model.evaluateProblemAnswer(p047, "2960").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p047, "1480").status, "INCORRECT");

  const p069 = model.problemsById["m3-sqrt-069-irrational_number-a5-rational-plus-irrational-proof"];
  assert.equal(p069.answerContract.kind, "WRITTEN_REVIEW");
  assert.equal(model.evaluateProblemAnswer(p069, p069.expectedAnswer).status, "REVIEW_REQUIRED");
  assert.deepEqual(p069.writtenRubric.requiredIdeas, [
    "실수 계수 q≠0 반례",
    "실수 계수 표현 비유일 반례",
    "q≠0일 때 무리수 증명",
    "q=0일 때 유리수 확인",
    "계수 비교를 위한 모순",
    "p=r 및 q=s 결론",
  ]);
  const alpha = Math.sqrt(2);
  assert.equal(-alpha + alpha, 0);
  assert.equal(0 + alpha, alpha + 0);
  const p072 = model.problemsById["m3-sqrt-072-irrational_number-a5-reject-irrational-product-rule"];
  assert.equal(p069.prompt.includes("β=1-√2"), false);
  assert.equal(p069.explanation.includes("β=1-√2"), false);
  assert.notEqual(p069.structureFamily, p072.structureFamily);
  assert.notEqual(p069.solutionPathSignature, p072.solutionPathSignature);

  const p071 = model.problemsById["m3-sqrt-071-irrational_number-a5-count-irrational-n-rational-scaled"];
  const p071Candidates = Array.from({ length: 479 }, (_, index) => index + 1)
    .filter((u) => 480 % u === 0 && u < 480 / u)
    .map((u) => {
      const v = 480 / u;
      return { u, v, x: (v - u) / 2, y: (u + v) / 2 };
    })
    .filter(({ x, y }) => Number.isInteger(x) && x > 0 && x % 2 === 0 && Number.isInteger(y))
    .map(({ u, v, x, y }) => ({ u, v, x, y, n: x * x / 2 }))
    .sort((left, right) => left.n - right.n);
  assert.deepEqual(p071Candidates.map(({ n }) => n), [2, 98, 338, 1682]);
  const p071Accepted = p071Candidates.filter(({ n }) => (
    [n - 1, n + 1].filter((value) => Number.isInteger(Math.sqrt(value))).length === 1
  ));
  assert.deepEqual(p071Accepted.map(({ n }) => n), [2, 1682]);
  assert.equal(p071Accepted.reduce((sum, { n }) => sum + n, 0), 1684);
  assert.equal(model.evaluateProblemAnswer(p071, "1684").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(p071, "2").status, "INCORRECT");

  const p094 = model.problemsById["m3-sqrt-094-radical_simplification-a5-normal-form-uniqueness"];
  assert.equal(p094.answerContract.kind, "WRITTEN_REVIEW");
  assert.equal(model.evaluateProblemAnswer(p094, p094.expectedAnswer).status, "REVIEW_REQUIRED");
  assert.deepEqual(p094.writtenRubric.requiredIdeas, [
    "소인수 지수의 홀짝",
    "b=d",
    "a=c",
    "제곱 인수 조건의 역할",
    "서로 다른 표현 반례",
  ]);
  assert.equal(6 ** 2 * 2, 72);
  assert.equal(3 ** 2 * 8, 72);
});

test("재작성 41문항의 모델 정답은 독립 전수 계산표와 모두 일치한다", () => {
  assert.equal(Object.keys(INDEPENDENTLY_RECALCULATED_ANSWERS).length, 41);
  assert.deepEqual(Object.keys(INDEPENDENTLY_RECALCULATED_ANSWERS).sort(), [...REWRITTEN_HIGH_STAGE_IDS].sort());
  Object.entries(INDEPENDENTLY_RECALCULATED_ANSWERS).forEach(([problemId, recalculatedAnswer]) => {
    assert.equal(model.problemsById[problemId].expectedAnswer, recalculatedAnswer, problemId);
  });
});

test("A3~A5는 자동 묶음이 아니라 단계별 통합 사고 기준을 만족한다", () => {
  const a3 = model.problems.filter((problem) => problem.stage === "A3");
  const a4 = model.problems.filter((problem) => problem.stage === "A4");
  const a5 = model.problems.filter((problem) => problem.stage === "A5");
  a3.forEach((problem) => {
    assert.ok(problem.solutionSteps.length >= 3, problem.id);
    assert.ok(problem.reasoningGoals.includes("MULTI_CONCEPT_LINK"), problem.id);
    assert.ok(problem.reasoningGoals.includes("STRATEGY_SELECTION"), problem.id);
  });
  a4.forEach((problem) => {
    assert.ok(problem.solutionSteps.length >= 4, problem.id);
    assert.ok(problem.reasoningGoals.includes("REVERSE_REASONING"), problem.id);
    assert.ok(problem.reasoningGoals.includes("CASE_ANALYSIS"), problem.id);
    assert.ok(problem.reasoningGoals.includes("RESULT_VALIDATION"), problem.id);
  });
  a5.forEach((problem) => {
    assert.ok(problem.solutionSteps.length >= 4, problem.id);
    assert.ok(problem.reasoningGoals.includes("STRATEGY_SELECTION"), problem.id);
    assert.ok(problem.reasoningGoals.includes("EXPLANATION"), problem.id);
    assert.ok(problem.reasoningGoals.includes("RESULT_VALIDATION"), problem.id);
  });
  const combined = model.problems.map((problem) => problem.prompt).join("\n");
  ["다음 3문제", "세 문제를 각각", "문제 1", "문제 2", "문제 3"].forEach((needle) => {
    assert.equal(combined.includes(needle), false, needle);
  });
});

test("ID·prompt·숫자 치환 구조·풀이 구조가 중복되지 않는다", () => {
  assert.equal(new Set(model.problems.map((problem) => problem.id)).size, 120);
  assert.equal(new Set(model.problems.map((problem) => normalizedPrompt(problem.prompt))).size, 120);
  assert.equal(new Set(model.problems.map((problem) => numericStructure(problem.prompt))).size, 120);
  assert.equal(new Set(model.problems.map((problem) => problem.structureSignature)).size, 120);
  assert.equal(new Set(model.problems.map((problem) => problem.solutionPathSignature)).size, 120);
});

test("120문항의 정답 계약이 채점되고 객관식 정답은 보기에서 유일하다", () => {
  model.problems.forEach((problem) => {
    const result = model.evaluateProblemAnswer(problem, problem.expectedAnswer);
    if (problem.answerType === "WRITTEN_RESPONSE") {
      assert.equal(result.status, "REVIEW_REQUIRED", problem.id);
      return;
    }
    assert.equal(result.status, "CORRECT", problem.id);
    assert.equal(result.correct, true, problem.id);
    if (problem.answerType === "MULTIPLE_CHOICE") {
      const normalizedChoices = problem.choices.map(normalizedPrompt);
      assert.equal(new Set(normalizedChoices).size, problem.choices.length, problem.id);
      assert.equal(normalizedChoices.filter((choice) => choice === normalizedPrompt(problem.expectedAnswer)).length, 1, problem.id);
      const gradedCorrect = problem.choices.filter((choice) => (
        model.evaluateProblemAnswer(problem, choice).status === "CORRECT"
      ));
      assert.deepEqual(gradedCorrect, [problem.expectedAnswer], problem.id);
    }
  });
});

test("재작성 객관식·단답형·수식형·과정형의 대표 오답을 정답으로 처리하지 않는다", () => {
  const wrongByKey = {
    "shifted-absolute-condition": "-2x+3",
    "absolute-equation-set": "-6",
    "fraction-radical-equation": "25",
    "conjugate-product-classify": "2√3",
    "another-conjugate-difference": "6",
    "combine-like-irrationals": "x+1/x",
    "conjugate-mixed-roots": "1",
    "recover-radicand-parameter": "6,9,15",
    "coefficient-identification": "174",
    "hidden-sign-reverse": "21",
    "translated-absolute-equation": "-6",
    "count-perfect-squares-in-range": "3",
    "ordered-negative-variables": "3",
    "twice-natural-perfect-square": "1",
    "reciprocal-root-condition": "√3+√2",
    "sum-and-gap-perfect-roots": "8",
    "subtract-unlike-before-simplify": "5",
    "irrational-square-sum": "√2+√7=√3+√6",
    "least-divisor-for-square-quotient": "45",
    "parameter-hidden-in-normal-form": "12",
    "reverse-normal-form-process": "30",
    "quotient-after-simplification": "3,12",
    "difference-of-reciprocals": "-2√15",
    "difference-denominator-rationalize": "2",
    "opposite-equal-squares": "-8",
    "scaled-root-equation-process": "225",
    "perfect-square-sum-condition": "12",
  };
  Object.entries(wrongByKey).forEach(([key, answer]) => {
    const problem = problemByKey(key);
    const result = model.evaluateProblemAnswer(problem, answer);
    assert.notEqual(result.status, "CORRECT", problem.problemId);
    assert.notEqual(result.correct, true, problem.problemId);
  });
});

test("근호 정규화와 유리화 동치 표현을 문자열 일치 없이 허용한다", () => {
  const simplify = problemByKey("extract-square-twelve");
  assert.equal(model.evaluateProblemAnswer(simplify, "\u221a12").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(simplify, "2\u221a3").status, "CORRECT");

  const rationalize = problemByKey("binomial-denominator-rationalization");
  assert.equal(model.evaluateProblemAnswer(rationalize, "1/(\u221a3+1)").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(rationalize, "(\u221a3-1)/2").status, "CORRECT");

  const directComparison = algebra.compareExpressions("1/(\u221a2)", "\u221a2/2");
  assert.equal(directComparison.status, "EQUIVALENT");
});

test("REVIEW_REQUIRED·UNSUPPORTED_EXPRESSION·INVALID_INPUT을 변경하지 않고 전달한다", () => {
  const written = model.problems.find((problem) => problem.answerType === "WRITTEN_RESPONSE");
  const expression = model.problems.find((problem) => problem.answerType === "EXPRESSION_INPUT");
  assert.equal(model.evaluateProblemAnswer(written, "학생 서술 답안").status, "REVIEW_REQUIRED");
  assert.equal(model.evaluateProblemAnswer(expression, "1/(x+1)").status, "UNSUPPORTED_EXPRESSION");
  assert.equal(model.evaluateProblemAnswer(expression, "(()").status, "INVALID_INPUT");
});

test("고위험 정답은 독립 계산과 완전탐색으로 다시 검증한다", () => {
  assert.equal(problemByKey("hidden-sign-reverse").expectedAnswer, "-21");
  assert.equal(problemByKey("sign-case-system-process").expectedAnswer, "ab≥0");
  assert.equal(problemByKey("two-perfect-square-gap").expectedAnswer.at(-1), "n=16");
  assert.equal(problemByKey("sum-and-gap-perfect-roots").expectedAnswer, "32");
  assert.equal(problemByKey("reverse-normal-form-process").expectedAnswer, "20");
  assert.equal(problemByKey("perfect-square-sum-condition").expectedAnswer, "2960");
  assert.equal(problemByKey("simultaneous-square-multiplier").expectedAnswer, "그런 자연수 n은 없다.");
  assert.equal(problemByKey("fourth-power-conjugate-sum").expectedAnswer.at(-1), "값=98");
  assert.equal(problemByKey("reciprocal-square-expression").expectedAnswer, "27");
  assert.equal(problemByKey("cubic-reciprocal-symmetric").expectedAnswer, "322");

  const squareGapCandidates = Array.from({ length: 100 }, (_, index) => index + 1)
    .filter((n) => Number.isInteger(Math.sqrt(n)) && Number.isInteger(Math.sqrt(n + 45)));
  assert.deepEqual(squareGapCandidates, [4, 36]);

  const irrationalButScaledNatural = Array.from({ length: 200 }, (_, index) => index + 1)
    .filter((n) => !Number.isInteger(Math.sqrt(n)) && Number.isInteger(Math.sqrt(2 * n)))
    .filter((n) => [n - 1, n + 1].filter((value) => Number.isInteger(Math.sqrt(value))).length === 1);
  assert.deepEqual(irrationalButScaledNatural, [2, 8, 50]);

  const commonQuotientMinimum = Array.from({ length: 13000 }, (_, index) => index + 1)
    .find((n) => {
      const a = Math.sqrt(n / 18);
      const b = Math.sqrt((n + 1280) / 8);
      return Number.isInteger(a)
        && Number.isInteger(b)
        && (a + b) % 3 === 0;
    });
  assert.equal(commonQuotientMinimum, 72);

  const rationalQuotientParameters = Array.from({ length: 29 }, (_, index) => index + 1)
    .filter((n) => Number.isInteger(Math.sqrt(n / 3)));
  assert.deepEqual(rationalQuotientParameters, [3, 12, 27]);

  const divisorParityCandidates = Array.from({ length: 900 }, (_, index) => index + 1)
    .filter((n) => 900 % n === 0
      && Number.isInteger(Math.sqrt(72 * n))
      && Number.isInteger(Math.sqrt(50 * n)));
  assert.deepEqual(divisorParityCandidates, [2, 18, 50, 450]);

  const impossibleCommonMultiplier = Array.from({ length: 5000 }, (_, index) => index + 1)
    .some((n) => Number.isInteger(Math.sqrt(18 * n)) && Number.isInteger(Math.sqrt(24 * n)));
  assert.equal(impossibleCommonMultiplier, false);
});

test("2015 개정 중3 범위로 고정하고 2022 확장 필드만 별도로 유지한다", () => {
  assert.equal(model.CURRICULUM_VERSION, "2015_REVISED_MIDDLE_SCHOOL_MATH");
  assert.equal(content.CURRICULUM_VERSION, "2015_REVISED_MIDDLE_SCHOOL_MATH");
  assert.equal(model.FUTURE_CURRICULUM_COMPATIBILITY, "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE");
  assert.equal(content.FUTURE_CURRICULUM_COMPATIBILITY, "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE");
  const studentText = model.problems.map((problem) => [
    problem.prompt,
    problem.explanation,
    ...problem.hints,
    ...problem.solutionSteps,
  ].join(" ")).join("\n");
  [
    "복소수",
    "허수",
    "지수함수",
    "로그",
    "무리함수",
    "미분",
    "적분",
    "일반 무리방정식",
    "a³+b³",
    "세제곱 항등식",
  ].forEach((forbidden) => assert.equal(studentText.includes(forbidden), false, forbidden));
});

test("5개 concept 설명은 핵심 개념부터 다음 연결까지 6단계 모두 제공한다", () => {
  assert.equal(content.CONCEPTS.length, 5);
  assert.deepEqual(content.CONCEPTS.map((concept) => concept.conceptId), EXPECTED_CONCEPT_IDS);
  const required = [
    "coreConcept",
    "easyExample",
    "commonMistakes",
    "procedure",
    "verification",
    "prerequisites",
    "nextConnection",
  ];
  content.CONCEPTS.forEach((concept) => {
    required.forEach((field) => assert.ok(concept[field]?.length, `${concept.conceptId}:${field}`));
    model.STAGES.forEach((stage) => {
      const lesson = content.get(concept.conceptId, stage);
      assert.ok(lesson, `${concept.conceptId}:${stage}`);
      required.forEach((field) => assert.ok(lesson[field]?.length, `${concept.conceptId}:${stage}:${field}`));
      assert.equal(lesson.curriculumVersion, "2015_REVISED_MIDDLE_SCHOOL_MATH");
    });
  });
});

test("감사 문서는 5개 concept의 단계 근거·독립 구조·검산·재작성 이유를 공개한다", () => {
  const audit = read("docs/middle3-sqrt-learning-audit.md");
  EXPECTED_CONCEPT_IDS.forEach((conceptId) => assert.ok(audit.includes(conceptId), conceptId));
  [
    "BASIC 목표",
    "A1 목표",
    "A2 목표",
    "A3 통합 사고 근거",
    "A4 상 수준 근거",
    "A5 최상 수준 근거",
    "혼자 풀기 구조 차이",
    "주요 오개념",
    "수학적 검산",
    "재작성 문항과 이유",
    "2015 개정",
  ].forEach((heading) => assert.ok(audit.includes(heading), heading));
});
