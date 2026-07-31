const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const algebra = require("../math-algebra-validator.js");
const learningSchema = require("../math-learning-schema.js");

test("근호식을 정확한 정규형으로 간소화한다", () => {
  const normalized = algebra.normalizeRadicalExpression("√12");
  assert.equal(normalized.status, "NORMALIZED");
  assert.equal(normalized.canonical, "2*sqrt(3)");
  assert.equal(algebra.compareExpressions("√12", "2√3").status, "EQUIVALENT");
});

test("근호식의 부호 오류를 비동치로 판정한다", () => {
  const result = algebra.compareExpressions("-√12", "2√3");
  assert.equal(result.status, "NOT_EQUIVALENT");
  assert.equal(result.equivalent, false);
});

test("분모 유리화 전후 표현을 정확히 동치로 판정한다", () => {
  const result = algebra.compareExpressions("1/√2", "√2/2");
  assert.equal(result.status, "EQUIVALENT");
  assert.equal(result.exact, true);
});

test("켤레를 이용한 분모 유리화도 지원한다", () => {
  assert.equal(
    algebra.compareExpressions("1/(1+√2)", "√2-1").status,
    "EQUIVALENT"
  );
});

test("다항식 전개식과 곱셈식을 정확히 동치로 판정한다", () => {
  const result = algebra.compareExpressions("x²+5x+6", "(x+2)(x+3)");
  assert.equal(result.status, "EQUIVALENT");
  assert.equal(result.equivalent, true);
});

test("다항식 계수 오류를 비동치로 판정한다", () => {
  assert.equal(
    algebra.compareExpressions("x²+5x+6", "(x+1)(x+6)").status,
    "NOT_EQUIVALENT"
  );
});

test("값 동치와 완전 인수분해 여부를 분리한다", () => {
  const complete = algebra.assessFactorization("(x+2)(x+3)", "x²+5x+6");
  assert.equal(complete.status, "FULLY_FACTORED");
  assert.equal(complete.equivalent, true);
  assert.equal(complete.fullyFactored, true);

  const incomplete = algebra.assessFactorization("x²+5x+6", "x²+5x+6");
  assert.equal(incomplete.status, "EQUIVALENT_NOT_FULLY_FACTORED");
  assert.equal(incomplete.equivalent, true);
  assert.equal(incomplete.fullyFactored, false);
});

test("공통 수치 인수가 남은 인수 구조를 미완료로 판정한다", () => {
  const incomplete = algebra.assessFactorization("(2x+2)(x+3)", "2x²+8x+6");
  assert.equal(incomplete.status, "EQUIVALENT_NOT_FULLY_FACTORED");
  assert.ok(incomplete.reasons.includes("COMMON_NUMERIC_FACTOR_REMAINS"));

  const complete = algebra.assessFactorization("2(x+1)(x+3)", "2x²+8x+6");
  assert.equal(complete.status, "FULLY_FACTORED");
});

test("다변수 인수분해의 완전성은 성급히 오답 처리하지 않는다", () => {
  const result = algebra.assessFactorization("(x+y)(x-y)", "x²-y²");
  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.equal(result.equivalent, true);
  assert.equal(result.fullyFactored, null);
});

test("이차방정식 해 집합은 순서와 무관하게 채점한다", () => {
  const result = algebra.compareSolutionSets("2,-3", "-3,2");
  assert.equal(result.status, "CORRECT");
  assert.equal(result.correct, true);
});

test("± 표현과 두 해 나열 표현을 같은 집합으로 판정한다", () => {
  const result = algebra.compareSolutionSets("x=1±√2", "{1-√2, 1+√2}");
  assert.equal(result.status, "CORRECT");
  assert.equal(result.correct, true);
});

test("중근은 한 원소 해 집합으로 채점한다", () => {
  const result = algebra.compareSolutionSets("x=3", "{3}");
  assert.equal(result.status, "CORRECT");
  assert.deepEqual(result.actual.canonicalRoots, ["3"]);
});

test("실수 범위에서 해 없음 표현을 빈 집합으로 채점한다", () => {
  assert.equal(algebra.compareSolutionSets("실근 없음", "∅").status, "CORRECT");
  assert.equal(algebra.compareSolutionSets("해 없음", "{}").status, "CORRECT");
  assert.equal(algebra.compareSolutionSets("해 없음", "").status, "INVALID_INPUT");
});

test("중복 해는 집합 정규화에서 제거하고 기록한다", () => {
  const result = algebra.compareSolutionSets("{3}", "3,3");
  assert.equal(result.status, "CORRECT");
  assert.deepEqual(result.actual.duplicates, ["3"]);

  const strict = algebra.compareSolutionSets("{3}", "3,3", { rejectDuplicates: true });
  assert.equal(strict.status, "INCORRECT");
  assert.equal(strict.reason, "DUPLICATE_ROOTS");
});

test("해 집합의 부호 오류를 오답으로 판정한다", () => {
  const result = algebra.compareSolutionSets("{2,-3}", "{2,3}");
  assert.equal(result.status, "INCORRECT");
  assert.equal(result.correct, false);
});

test("양수·자연수 조건에 맞지 않는 해를 제외한다", () => {
  const positive = algebra.compareSolutionSets("-3,3", "3", { domain: "POSITIVE" });
  assert.equal(positive.status, "CORRECT");
  assert.equal(positive.expected.excluded.length, 1);

  const natural = algebra.compareSolutionSets("-2,2,5/2", "2", { domain: "NATURAL" });
  assert.equal(natural.status, "CORRECT");
  assert.equal(natural.expected.excluded.length, 2);

  const invalidSubmission = algebra.compareSolutionSets("-3,3", "-3,3", { domain: "POSITIVE" });
  assert.equal(invalidSubmission.status, "INCORRECT");
  assert.equal(invalidSubmission.reason, "OUT_OF_DOMAIN_ROOT_INCLUDED");
});

test("길이 범위의 최소·최대 조건을 검사한다", () => {
  assert.equal(
    algebra.validateDomain("5", { kind: "POSITIVE", max: "10" }).status,
    "ALLOWED"
  );
  assert.equal(
    algebra.validateDomain("12", { kind: "POSITIVE", max: "10" }).status,
    "EXCLUDED"
  );
  assert.equal(
    algebra.validateDomain("0", { kind: "NON_NEGATIVE" }).status,
    "ALLOWED"
  );
});

test("정의역 계약이 다르면 수식이 같아도 별도로 판정한다", () => {
  const result = algebra.compareExpressions("x+1", "x+1", {
    leftDomain: { kind: "REAL", excludedValues: ["1"] },
    rightDomain: "REAL",
  });
  assert.equal(result.status, "DOMAIN_MISMATCH");
  assert.equal(result.equivalent, false);
});

test("변수식 분모는 표본 대입으로 추측하지 않고 미지원으로 돌린다", () => {
  const result = algebra.compareExpressions("(x²-1)/(x-1)", "x+1");
  assert.equal(result.status, "UNSUPPORTED_EXPRESSION");
  assert.equal(result.equivalent, null);
});

test("과정형 API가 동치인 이차방정식 변형을 확인한다", () => {
  const factorStep = algebra.compareEquationSteps(
    "x²-5x+6=0",
    "(x-2)(x-3)=0"
  );
  assert.equal(factorStep.status, "VALID_STEP");
  assert.equal(factorStep.equivalent, true);

  const scaleStep = algebra.compareEquationSteps("2x=2", "x=1");
  assert.equal(scaleStep.status, "VALID_STEP");
});

test("해 집합을 바꾸는 과정 단계는 동치 단계가 아니다", () => {
  const result = algebra.compareEquationSteps("x²=1", "x=1");
  assert.equal(result.status, "INVALID_STEP");
  assert.equal(result.equivalent, false);
});

test("여러 과정 단계를 전이별로 검증한다", () => {
  const result = algebra.validateProcessSteps([
    "x²-5x+6=0",
    "(x-2)(x-3)=0",
    "x²-5x=-6",
  ]);
  assert.equal(result.status, "VALID_STEP");
  assert.equal(result.transitions.length, 2);
});

test("악성·비정상 입력을 실행하지 않고 차단한다", () => {
  const blocked = [
    "globalThis.process.exit()",
    "x;1",
    "constructor(1)",
    "x[0]",
    "√(-1)",
    "1±2",
  ];
  blocked.forEach((value) => {
    const result = algebra.compareExpressions(value, "1");
    assert.ok(
      ["INVALID_INPUT", "UNSUPPORTED_EXPRESSION"].includes(result.status),
      `${value}: ${result.status}`
    );
  });
});

test("채점기 구현에는 동적 코드 실행 구문이 없다", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "math-algebra-validator.js"), "utf8");
  assert.equal(/\beval\s*\(/.test(source), false);
  assert.equal(/\bFunction\s*\(/.test(source), false);
});

test("기존 이차함수 수식 동치 채점 동작을 유지한다", () => {
  assert.equal(
    learningSchema.expressionsEquivalent("x^2+5x+6", "(x+2)(x+3)"),
    true
  );
  assert.equal(
    learningSchema.evaluateAnswer({
      answerType: "EXPRESSION_INPUT",
      correctAnswer: "2*(x-1)^2+3",
    }, "2*x^2-4*x+5").status,
    "CORRECT"
  );
});
