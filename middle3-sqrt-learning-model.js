(function (root, factory) {
  const algebraValidator = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const api = factory(algebraValidator);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_SQRT_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (algebraValidator) {
  "use strict";

  if (!algebraValidator) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");

  const VERSION = "m3-sqrt-learning-model-v1";
  const UNIT_ID = "m3-square-roots-and-real-numbers";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const FUTURE_CURRICULUM_COMPATIBILITY = "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE";
  const AUTHORING_SCOPE = "MIDDLE3_SQRT_LEARNING_AUTHORED_V1";
  const AUTHORING_MODE = "EXPLICIT_AUTHORED_PROBLEMS_NO_NUMERIC_VARIANTS";
  const VALIDATOR_ID = "MATH_ALGEBRA_VALIDATOR_V1";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const ANSWER_TYPES = Object.freeze([
    "MULTIPLE_CHOICE",
    "SHORT_ANSWER",
    "EXPRESSION_INPUT",
    "STEP_ORDER",
    "WRITTEN_RESPONSE",
  ]);

  const CONCEPTS = Object.freeze([
    Object.freeze({
      conceptId: "m3_sqrt_meaning",
      conceptName: "제곱근의 뜻과 기호",
      order: 1,
      prerequisiteConceptIds: Object.freeze(["integer_square", "absolute_value"]),
    }),
    Object.freeze({
      conceptId: "m3_sqrt_value",
      conceptName: "제곱근의 값",
      order: 2,
      prerequisiteConceptIds: Object.freeze(["m3_sqrt_meaning", "fraction_decimal_square"]),
    }),
    Object.freeze({
      conceptId: "m3_irrational_number",
      conceptName: "무리수와 실수",
      order: 3,
      prerequisiteConceptIds: Object.freeze(["rational_number", "m3_sqrt_value"]),
    }),
    Object.freeze({
      conceptId: "m3_radical_simplification",
      conceptName: "근호식의 간단한 표현",
      order: 4,
      prerequisiteConceptIds: Object.freeze(["prime_factorization", "m3_sqrt_meaning"]),
    }),
    Object.freeze({
      conceptId: "m3_radical_operations",
      conceptName: "근호식의 계산",
      order: 5,
      prerequisiteConceptIds: Object.freeze(["m3_radical_simplification", "multiplication_formula"]),
    }),
  ]);

  const STAGE_REASONING = Object.freeze({
    BASIC: Object.freeze(["CONCEPT_RECALL", "DIRECT_APPLICATION"]),
    A1: Object.freeze(["CONDITION_READING", "REPRESENTATION", "RESULT_VALIDATION"]),
    A2: Object.freeze(["CONDITION_READING", "MULTI_CONCEPT_LINK", "ERROR_ANALYSIS"]),
    A3: Object.freeze(["CONDITION_READING", "EQUATION_SETUP", "MULTI_CONCEPT_LINK", "STRATEGY_SELECTION"]),
    A4: Object.freeze(["CONDITION_READING", "REVERSE_REASONING", "CASE_ANALYSIS", "STRATEGY_SELECTION", "RESULT_VALIDATION"]),
    A5: Object.freeze([
      "CONDITION_READING",
      "CONCEPT_SELECTION",
      "MULTI_CONCEPT_LINK",
      "STRATEGY_SELECTION",
      "EXPLANATION",
      "PROOF_JUSTIFICATION",
      "RESULT_VALIDATION",
    ]),
  });

  const STAGE_EVIDENCE = Object.freeze({
    BASIC: Object.freeze(["정의 또는 한 가지 기본 성질을 직접 적용", "의미 있는 계산 1단계"]),
    A1: Object.freeze(["표현을 한 번 변환", "부호·분수·소수 조건을 검산"]),
    A2: Object.freeze(["두 성질을 결합", "대표 오개념과 올바른 계산을 구분"]),
    A3: Object.freeze(["한 문제 안에서 세 단계 이상 연결", "조건을 식으로 바꾸고 순서를 선택"]),
    A4: Object.freeze(["숨은 조건 또는 역추론 포함", "네 단계 이상과 경우 분류·표현 전환"]),
    A5: Object.freeze(["전략 선택과 근거 설명", "오류 분석 또는 대안 검증을 포함한 최상 난도"]),
  });

  function q(conceptId, stage, key, answerType, prompt, expectedAnswer, solutionSteps, hints, extra = {}) {
    return Object.freeze({
      conceptId,
      stage,
      key,
      answerType,
      prompt,
      expectedAnswer,
      solutionSteps: Object.freeze([...solutionSteps]),
      hints: Object.freeze([...hints]),
      choices: extra.choices ? Object.freeze([...extra.choices]) : undefined,
      acceptedAnswers: Object.freeze([...(extra.acceptedAnswers || [])]),
      answerContract: extra.answerContract,
      misconceptionTags: Object.freeze([...(extra.misconceptionTags || ["CALCULATION_CHECK"])]),
      independentCheck: extra.independentCheck === true,
      structureFamily: extra.structureFamily || key,
      difficultyEvidence: Object.freeze([
        ...STAGE_EVIDENCE[stage],
        ...(extra.difficultyEvidence || []),
      ]),
      writtenRubric: extra.writtenRubric ? Object.freeze({ ...extra.writtenRubric }) : undefined,
      domain: extra.domain,
    });
  }

  const SPECS = Object.freeze([
    // 1. 제곱근의 뜻과 기호
    q("m3_sqrt_meaning", "BASIC", "nonnegative-root-symbol", "MULTIPLE_CHOICE", "√49의 값은 무엇인가?", "7",
      ["√49는 49의 음이 아닌 제곱근이다.", "7²=49이므로 √49=7이다."],
      ["√ 기호는 두 제곱근 중 음이 아닌 값을 뜻한다.", "제곱해서 49가 되는 양수를 찾는다."],
      { choices: ["-7", "7", "±7", "49"], misconceptionTags: ["ROOT_SYMBOL_SIGN"], structureFamily: "symbol-value" }),
    q("m3_sqrt_meaning", "BASIC", "positive-square-root", "SHORT_ANSWER", "제곱해서 64가 되는 양수를 쓰시오.", "8",
      ["8²=64임을 확인한다.", "양수를 요구했으므로 8을 고른다."],
      ["64를 같은 두 자연수의 곱으로 나타낸다.", "답의 부호가 양수인지 확인한다."],
      { misconceptionTags: ["POSITIVE_ROOT"], structureFamily: "verbal-positive-root" }),
    q("m3_sqrt_meaning", "BASIC", "meaning-of-radical", "MULTIPLE_CHOICE", "√36에 대한 설명으로 옳은 것은?", "36의 음이 아닌 제곱근",
      ["36의 제곱근은 -6과 6이다.", "√36은 그중 음이 아닌 값 6을 나타낸다."],
      ["‘36의 제곱근’과 ‘√36’의 차이를 생각한다.", "√ 기호의 값은 음이 아니다."],
      { choices: ["36의 두 제곱근", "36의 음이 아닌 제곱근", "36의 음의 제곱근", "36의 제곱"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["ROOT_VS_ROOTS"], structureFamily: "definition-choice" }),
    q("m3_sqrt_meaning", "BASIC", "sum-of-two-roots", "SHORT_ANSWER", "121의 두 제곱근의 합을 구하시오.", "0",
      ["121의 두 제곱근은 -11과 11이다.", "두 수의 합은 0이다."],
      ["‘두 제곱근’을 모두 찾는다.", "서로 반대 부호인 두 수의 합을 계산한다."],
      { independentCheck: true, misconceptionTags: ["OMIT_NEGATIVE_ROOT"], structureFamily: "two-root-symmetry" }),

    q("m3_sqrt_meaning", "A1", "square-inside-negative", "EXPRESSION_INPUT", "√((-7)²)을 간단히 하시오.", "7",
      ["√(x²)=|x|를 사용한다.", "|-7|=7이다."],
      ["제곱과 제곱근이 보이지만 부호를 바로 지우지 않는다.", "√(x²)는 |x|로 바꾼다."],
      { misconceptionTags: ["ABSOLUTE_VALUE_OMITTED"], structureFamily: "numeric-absolute-root" }),
    q("m3_sqrt_meaning", "A1", "negative-variable-absolute", "EXPRESSION_INPUT", "a<0일 때 √(a²)을 a로 나타내시오.", "-a",
      ["√(a²)=|a|이다.", "a<0이면 |a|=-a이다."],
      ["먼저 절댓값 기호로 바꾼다.", "음수 a의 절댓값은 -a이다."],
      { misconceptionTags: ["VARIABLE_SIGN"], structureFamily: "conditional-absolute-root", domain: "a<0" }),
    q("m3_sqrt_meaning", "A1", "radical-equation-radicand", "SHORT_ANSWER", "√x=9일 때 x의 값을 구하시오.", "81",
      ["양변을 제곱하면 x=9²이다.", "x=81이고 √81=9로 확인된다."],
      ["√x의 값이 주어졌으므로 제곱을 이용한다.", "9를 제곱한 뒤 원래 식에 넣어 본다."],
      { misconceptionTags: ["FORGET_TO_SQUARE"], structureFamily: "recover-radicand" }),
    q("m3_sqrt_meaning", "A1", "zero-root-count", "MULTIPLE_CHOICE", "0의 제곱근은 몇 개인가?", "1개",
      ["0²=0이다.", "-0과 0은 같은 수이므로 제곱근은 0 하나뿐이다."],
      ["0의 양수·음수 제곱근이 서로 다른지 생각한다.", "-0은 0과 같은 수이다."],
      { choices: ["0개", "1개", "2개", "무한히 많다"], answerContract: "TEXT_NORMALIZED", independentCheck: true, misconceptionTags: ["ZERO_ROOT_DUPLICATION"], structureFamily: "root-count-exception" }),

    q("m3_sqrt_meaning", "A2", "fraction-radical-meaning", "EXPRESSION_INPUT", "분수 81/16의 음이 아닌 제곱근을 기약분수로 나타내시오.", "9/4",
      ["81=9², 16=4²이다.", "음이 아닌 값을 택해 √(81/16)=9/4이다."],
      ["분자와 분모가 각각 완전제곱인지 확인한다.", "√81과 √16의 음이 아닌 값을 나눈다."],
      { misconceptionTags: ["FRACTION_ROOT"], structureFamily: "fraction-perfect-square" }),
    q("m3_sqrt_meaning", "A2", "plus-minus-error-analysis", "MULTIPLE_CHOICE", "학생이 ‘√25=±5’라고 썼다. 가장 정확한 설명은?", "√25는 5이고, 25의 제곱근이 ±5이다.",
      ["√25는 음이 아닌 제곱근 하나를 나타낸다.", "25의 두 제곱근을 물을 때만 -5와 5를 함께 쓴다."],
      ["기호 √가 가리키는 값의 개수를 확인한다.", "‘√25’와 ‘25의 제곱근’을 구분한다."],
      { choices: ["√25는 5이고, 25의 제곱근이 ±5이다.", "√25는 -5이다.", "25의 제곱근은 5 하나이다.", "± 기호는 언제나 생략한다."], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["PLUS_MINUS_MISUSE"], structureFamily: "error-diagnosis" }),
    q("m3_sqrt_meaning", "A2", "square-equation-solution-set", "SHORT_ANSWER", "x²=49를 만족하는 실수 x를 모두 쓰시오.", "-7,7",
      ["제곱해서 49가 되는 수는 두 개이다.", "x=-7 또는 x=7이다."],
      ["양수 해뿐 아니라 음수 해도 확인한다.", "해를 순서와 관계없는 집합으로 적는다."],
      { answerContract: "SOLUTION_SET", misconceptionTags: ["MISSING_NEGATIVE_SOLUTION"], structureFamily: "square-equation-set" }),
    q("m3_sqrt_meaning", "A2", "distance-between-roots", "SHORT_ANSWER", "100의 큰 제곱근과 작은 제곱근의 차를 구하시오.", "20",
      ["100의 제곱근은 -10과 10이다.", "큰 값에서 작은 값을 빼면 10-(-10)=20이다."],
      ["두 제곱근을 수직선에 표시한다.", "‘큰 값-작은 값’에서 음수 부호를 주의한다."],
      { independentCheck: true, misconceptionTags: ["SIGNED_DIFFERENCE"], structureFamily: "root-distance" }),

    q("m3_sqrt_meaning", "A3", "opposite-sign-variables", "EXPRESSION_INPUT", "실수 a,b가 a²=9, b²=25, a+b=2를 만족할 때 √((a-b)²)의 값을 구하시오.", "8",
      ["a²=9에서 a=±3, b²=25에서 b=±5인 후보를 만든다.", "네 부호 조합 중 a+b=2를 만족하는 것은 a=-3, b=5뿐이다.", "√((a-b)²)=|a-b|이므로 |-3-5|=8이다.", "구한 a,b를 세 원래 조건에 다시 대입해 유일성을 확인한다."],
      ["제곱 조건마다 양수와 음수 후보를 모두 만든 뒤 합 조건으로 부호를 판정한다.", "남은 a,b에 대해 √((a-b)²)를 절댓값으로 바꾸어 계산한다."],
      { misconceptionTags: ["SIGN_CANDIDATE_FILTER"], structureFamily: "square-candidates-sum-filter-distance", difficultyEvidence: ["두 제곱 조건에서 후보 생성·합 조건 부호 필터·절댓값 검산"] }),
    q("m3_sqrt_meaning", "A3", "shifted-absolute-condition", "EXPRESSION_INPUT", "x<3일 때 √((x-3)²)을 간단히 하시오.", "3-x",
      ["√((x-3)²)=|x-3|이다.", "x<3이면 x-3<0이다.", "|x-3|=-(x-3)=3-x이다."],
      ["괄호 전체를 하나의 수로 본다.", "x-3의 부호를 조건에서 결정한다."],
      { misconceptionTags: ["SHIFTED_SIGN"], structureFamily: "shifted-absolute-branch", domain: "x<3" }),
    q("m3_sqrt_meaning", "A3", "root-gap-recover-number", "SHORT_ANSWER", "50<N<150인 양의 정수 N의 두 제곱근의 차를 d라 하자. d가 자연수이고 N+d가 20의 배수이며 d가 5의 배수가 아닐 때 N을 구하시오.", "64",
      ["두 제곱근을 -r,r(r>0)로 두면 d=2r이다.", "r=d/2이고 d가 홀수이면 r²=N은 홀수의 제곱을 4로 나눈 수여서 정수가 될 수 없으므로 d는 짝수, r은 자연수이다.", "따라서 범위 안 후보 N은 64,81,100,121,144이다.", "각 후보의 N+d는 차례로 80,99,120,143,168이므로 20의 배수인 후보는 64와 100이다.", "두 후보의 d는 각각 16과 20이고, 5의 배수가 아닌 것은 16뿐이므로 N=64이다.", "N=64에서 두 제곱근 -8,8의 차가 16이고 모든 조건을 만족함을 확인한다."],
      ["d가 자연수가 되려면 √N이 어떤 수여야 하는지 먼저 판단해 범위 안 후보를 만든다.", "N+d 조건으로 후보를 줄인 뒤 d의 배수 조건을 마지막에 적용한다."],
      { misconceptionTags: ["ROOT_GAP_MULTI_FILTER"], structureFamily: "root-gap-square-candidates-modular-filter", difficultyEvidence: ["제곱수 후보 생성·두 단계 배수 필터·원식 검산"] }),
    q("m3_sqrt_meaning", "A3", "absolute-equation-set", "SHORT_ANSWER", "√(x²)=4를 만족하는 실수 x를 모두 쓰시오.", "-4,4",
      ["√(x²)=|x|이므로 |x|=4이다.", "절댓값이 4인 수는 -4와 4이다.", "두 값을 원래 식에 넣어 확인한다."],
      ["√(x²)를 x로 단정하지 않는다.", "|x|=4의 두 경우를 쓴다."],
      { answerContract: "SOLUTION_SET", independentCheck: true, misconceptionTags: ["ABSOLUTE_EQUATION"], structureFamily: "absolute-equation-solutions" }),

    q("m3_sqrt_meaning", "A4", "hidden-sign-reverse", "SHORT_ANSWER", "a<2이고 √((a-2)²)=5일 때 a의 값을 구하시오.", "-3",
      ["√((a-2)²)=|a-2|이다.", "a<2이므로 a-2<0이다.", "|a-2|=2-a=5로 바꾼다.", "a=-3을 원래 조건에 대입한다."],
      ["a-2의 부호가 조건에 숨어 있다.", "절댓값의 음수 가지인 2-a=5를 사용한다."],
      { misconceptionTags: ["HIDDEN_SIGN_BRANCH"], structureFamily: "reverse-conditional-absolute" }),
    q("m3_sqrt_meaning", "A4", "translated-absolute-equation", "SHORT_ANSWER", "√((x-1)²)=3을 만족하는 실수 x를 모두 쓰시오.", "-2,4",
      ["식을 |x-1|=3으로 바꾼다.", "x-1=3 또는 x-1=-3으로 나눈다.", "각각 x=4, x=-2를 얻는다.", "두 해를 원래 식에 대입한다."],
      ["절댓값 방정식으로 바꾼다.", "x-1의 값이 3인 경우와 -3인 경우를 모두 푼다."],
      { answerContract: "SOLUTION_SET", misconceptionTags: ["ONE_BRANCH_ONLY"], structureFamily: "translated-two-branch-set" }),
    q("m3_sqrt_meaning", "A4", "count-perfect-squares-in-range", "STEP_ORDER", "20<n<80인 자연수 n 중 √n이 자연수가 되는 n의 개수를 구하는 과정을 순서대로 배열하시오.", ["5²=25", "6²=36", "7²=49", "8²=64", "개수=4"],
      ["범위 안의 가장 작은 완전제곱수 25를 찾는다.", "25, 36, 49, 64를 차례로 적는다.", "9²=81은 범위를 벗어남을 확인한다.", "따라서 개수는 4이다."],
      ["√n이 자연수라는 말은 n이 완전제곱수라는 뜻이다.", "20과 80 사이에 있는 자연수의 제곱을 작은 것부터 적는다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["RANGE_ENDPOINT"], structureFamily: "bounded-perfect-square-enumeration" }),
    q("m3_sqrt_meaning", "A4", "ordered-negative-variables", "EXPRESSION_INPUT", "a<b<0일 때 √(a²)-√(b²)을 간단히 하시오.", "b-a",
      ["두 문자가 모두 음수이므로 √(a²)=-a, √(b²)=-b이다.", "식을 (-a)-(-b)로 바꾼다.", "정리하면 b-a이다.", "a<b 조건으로 결과가 양수임을 검산한다."],
      ["a와 b가 모두 음수임을 먼저 반영한다.", "두 절댓값을 푼 뒤 바깥의 뺄셈 부호를 확인한다."],
      { independentCheck: true, misconceptionTags: ["DOUBLE_NEGATIVE"], structureFamily: "ordered-negative-difference" }),

    q("m3_sqrt_meaning", "A5", "sign-case-system-process", "STEP_ORDER", "a<b, a+b=-2, √(a²)+√(b²)=10일 때 a,b를 구하는 핵심 과정을 순서대로 배열하시오.", ["a<0<b", "-a+b=10", "a+b=-2", "a=-6,b=4", "원식 검산"],
      ["두 수가 모두 음수이면 절댓값의 합은 2이고, 모두 양수이면 합이 -2일 수 없음을 확인한다.", "따라서 a<0<b이다.", "근호식을 -a+b=10으로 바꾼다.", "a+b=-2와 연립해 a=-6, b=4를 얻는다.", "순서와 두 원래 조건을 모두 검산한다."],
      ["두 수의 가능한 부호 조합부터 분류한다.", "가능한 부호에서 두 근호를 절댓값으로 바꿔 연립한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["SIGN_CASE_SYSTEM"], structureFamily: "absolute-values-with-sum-system" }),
    q("m3_sqrt_meaning", "A5", "explain-absolute-necessity", "WRITTEN_RESPONSE", "√(a²)=a가 모든 실수 a에서 성립하지 않는 이유를 설명하고 올바른 식을 쓰시오.", "√(a²)=|a|",
      ["a=-3을 대입하면 √(a²)=3이지만 a=-3이어서 두 값이 다름을 보인다.", "√ 기호의 값은 음이 아님을 설명한다.", "따라서 모든 실수에서 √(a²)=|a|라고 결론짓는다.", "a의 부호별로 식이 맞는지 확인한다."],
      ["음수 하나를 반례로 대입해 본다.", "√ 기호의 값이 가질 수 있는 부호와 절댓값을 연결한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["ABSOLUTE_VALUE_PROOF"], structureFamily: "counterexample-and-correction", writtenRubric: { requiredIdeas: ["음수 반례", "√의 음이 아닌 값", "절댓값"], minimumEvidence: 3 } }),
    q("m3_sqrt_meaning", "A5", "opposite-equal-squares", "EXPRESSION_INPUT", "a<0<b이고 a²=b²일 때 √(a²)+√(b²)을 b로 나타내시오.", "2b",
      ["a²=b²에서 |a|=|b|이다.", "부호 조건으로 a=-b이다.", "√(a²)+√(b²)=|a|+|b|이다.", "|a|=b, |b|=b이므로 2b이다.", "b>0이므로 결과 부호도 맞다."],
      ["같은 제곱을 가진 두 수의 절댓값 관계를 먼저 쓴다.", "a와 b의 부호가 반대이므로 a=-b이다."],
      { acceptedAnswers: ["-2a"], misconceptionTags: ["EQUAL_SQUARE_SIGN"], structureFamily: "equal-square-opposite-sign" }),
    q("m3_sqrt_meaning", "A5", "reject-radical-addition-law", "WRITTEN_RESPONSE", "‘u,v≥0이면 √(u+v)=√u+√v이다’라는 주장에 반례를 들고 왜 일반적으로 성립하지 않는지 설명하시오.", "반례 u=1,v=1이면 √2≠2",
      ["u=1, v=1을 선택한다.", "왼쪽은 √2, 오른쪽은 2임을 계산한다.", "두 값이 다르므로 주장은 거짓이다.", "오른쪽을 제곱하면 u+v+2√(uv)라는 추가항이 생김을 설명한다.", "uv=0 같은 특별한 경우와 일반 경우를 구분한다."],
      ["작은 양수 두 개를 넣어 양변을 직접 비교한다.", "(√u+√v)²을 전개해 추가되는 항을 찾는다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["FALSE_RADICAL_DISTRIBUTION"], structureFamily: "law-counterexample-analysis", writtenRubric: { requiredIdeas: ["수치 반례", "양변 비교", "2√uv 추가항"], minimumEvidence: 3 } }),

    // 2. 제곱근의 값
    q("m3_sqrt_value", "BASIC", "integer-perfect-square", "SHORT_ANSWER", "144의 음이 아닌 제곱근을 구하시오.", "12",
      ["144=12²이다.", "√144는 음이 아닌 값이므로 12이다."],
      ["144를 같은 두 자연수의 곱으로 나타낸다.", "답을 제곱해 144가 되는지 확인한다."],
      { misconceptionTags: ["PERFECT_SQUARE_VALUE"], structureFamily: "integer-value" }),
    q("m3_sqrt_value", "BASIC", "decimal-perfect-square", "SHORT_ANSWER", "0.81의 음이 아닌 제곱근을 소수로 쓰시오.", "0.9",
      ["0.9²=0.81이다.", "음이 아닌 값을 택해 √0.81=0.9이다."],
      ["소수점 아래 자리 수를 제곱과 연결한다.", "0.9를 제곱해 검산한다."],
      { misconceptionTags: ["DECIMAL_PLACE"], structureFamily: "decimal-value" }),
    q("m3_sqrt_value", "BASIC", "fraction-perfect-square-value", "EXPRESSION_INPUT", "√(1/49)의 값을 구하시오.", "1/7",
      ["1=1², 49=7²이다.", "√(1/49)=1/7이다."],
      ["분자와 분모의 제곱근을 각각 찾는다.", "답은 음이 아닌 분수이다."],
      { misconceptionTags: ["FRACTION_VALUE"], structureFamily: "unit-fraction-value" }),
    q("m3_sqrt_value", "BASIC", "locate-nonperfect-root", "MULTIPLE_CHOICE", "√50이 놓이는 두 연속한 자연수는?", "7과 8 사이",
      ["7²=49, 8²=64이다.", "49<50<64이므로 7<√50<8이다."],
      ["50과 가까운 완전제곱수를 찾는다.", "49와 64 사이에서 제곱근의 범위를 읽는다."],
      { choices: ["6과 7 사이", "7과 8 사이", "8과 9 사이", "9와 10 사이"], answerContract: "TEXT_NORMALIZED", independentCheck: true, misconceptionTags: ["ROOT_INTERVAL"], structureFamily: "neighboring-integers" }),

    q("m3_sqrt_value", "A1", "fraction-square-ratio", "EXPRESSION_INPUT", "√(196/225)를 간단히 하시오.", "14/15",
      ["196=14²이고 225=15²이다.", "분자와 분모의 음이 아닌 제곱근을 취해 14/15이다."],
      ["분자와 분모를 각각 완전제곱으로 본다.", "14/15를 제곱해 원래 분수인지 확인한다."],
      { misconceptionTags: ["FRACTION_NUMERATOR_DENOMINATOR"], structureFamily: "square-ratio" }),
    q("m3_sqrt_value", "A1", "terminating-decimal-root", "SHORT_ANSWER", "양수 t가 t²=2.25를 만족할 때 t를 구하시오.", "1.5",
      ["2.25=225/100이다.", "√225/√100=15/10=1.5이다."],
      ["소수를 분수 또는 정수 제곱 꼴로 바꾼다.", "1.5²을 계산해 확인한다."],
      { misconceptionTags: ["DECIMAL_CONVERSION"], structureFamily: "decimal-to-fraction-root" }),
    q("m3_sqrt_value", "A1", "recover-decimal-radicand", "SHORT_ANSWER", "√n=1.2일 때 n의 값을 구하시오.", "1.44",
      ["양변을 제곱해 n=(1.2)²로 둔다.", "1.2×1.2=1.44이다."],
      ["근호 밖의 값을 제곱해 근호 안 수를 되찾는다.", "소수 곱셈의 자리 수를 확인한다."],
      { misconceptionTags: ["DECIMAL_SQUARING"], structureFamily: "inverse-decimal-root" }),
    q("m3_sqrt_value", "A1", "compare-root-to-integer", "MULTIPLE_CHOICE", "√48과 7의 대소 관계로 옳은 것은?", "√48<7",
      ["두 수가 양수이므로 제곱하여 비교할 수 있다.", "48<49=7²이므로 √48<7이다."],
      ["7을 제곱한 값과 48을 비교한다.", "양수끼리의 비교라서 제곱 후 부등호 방향이 유지된다."],
      { choices: ["√48<7", "√48=7", "√48>7", "비교할 수 없다"], answerContract: "TEXT_NORMALIZED", independentCheck: true, misconceptionTags: ["SQUARE_COMPARISON"], structureFamily: "root-integer-comparison" }),

    q("m3_sqrt_value", "A2", "product-under-root", "EXPRESSION_INPUT", "√(36×25)의 값을 구하시오.", "30",
      ["36×25=(6²)(5²)이다.", "√(36×25)=6×5=30이다."],
      ["두 인수가 각각 완전제곱수인지 확인한다.", "각 제곱근을 곱한 뒤 제곱으로 검산한다."],
      { misconceptionTags: ["PRODUCT_ROOT"], structureFamily: "product-perfect-squares" }),
    q("m3_sqrt_value", "A2", "decimal-division-root", "SHORT_ANSWER", "√(144÷0.04)의 값을 구하시오.", "60",
      ["0.04=4/100=1/25이다.", "144÷0.04=144×25=3600이다.", "√3600=60이다."],
      ["나눗셈 안의 소수를 분수로 바꾼다.", "근호를 계산하기 전에 근호 안을 정확히 정리한다."],
      { misconceptionTags: ["DECIMAL_DIVISION"], structureFamily: "decimal-quotient-root" }),
    q("m3_sqrt_value", "A2", "mixed-decimal-fraction-sum", "EXPRESSION_INPUT", "√0.49+√(9/16)을 계산하시오.", "29/20",
      ["√0.49=0.7=7/10이다.", "√(9/16)=3/4이다.", "7/10+3/4=14/20+15/20=29/20이다."],
      ["두 근호를 각각 계산한 뒤 같은 분모로 바꾼다.", "0.7을 분수로 바꾸면 덧셈을 정확히 할 수 있다."],
      { acceptedAnswers: ["1.45"], misconceptionTags: ["MIXED_REPRESENTATION"], structureFamily: "decimal-fraction-root-sum" }),
    q("m3_sqrt_value", "A2", "difference-perfect-roots", "SHORT_ANSWER", "√225-√64를 계산하시오.", "7",
      ["√225=15이다.", "√64=8이다.", "15-8=7이다."],
      ["각 근호를 따로 계산한다.", "두 값을 구한 다음 바깥의 뺄셈을 한다."],
      { independentCheck: true, misconceptionTags: ["OPERATE_RADICANDS_FIRST"], structureFamily: "difference-of-perfect-roots" }),

    q("m3_sqrt_value", "A3", "divisible-perfect-square-range", "SHORT_ANSWER", "50<n<300인 자연수 n에 대하여 √n이 자연수이면서 60의 약수이고, n은 8의 배수이다. √n을 구하시오.", "12",
      ["r=√n인 자연수로 두면 √50<r<√300이므로 8≤r≤17이다.", "이 범위에서 60의 약수인 r은 10,12,15이다.", "각각의 n=r²은 100,144,225이고, 이 중 8의 배수는 144뿐이다.", "따라서 r=√n=12이고 범위·약수·배수 조건을 모두 만족한다."],
      ["먼저 √n 자체를 r로 두고 범위와 60의 약수 조건으로 후보를 만든다.", "각 후보를 제곱한 뒤 n의 8의 배수 조건으로 유일한 값을 고른다."],
      { misconceptionTags: ["ROOT_DIVISOR_CANDIDATE_FILTER"], structureFamily: "root-divisor-range-square-multiple", difficultyEvidence: ["근의 범위 변환·약수 후보 생성·제곱값 배수 필터"] }),
    q("m3_sqrt_value", "A3", "fraction-radical-equation", "SHORT_ANSWER", "a>0이고 √(a/16)=3/2일 때 a의 값을 구하시오.", "36",
      ["양변을 제곱해 a/16=9/4로 만든다.", "양변에 16을 곱해 a=36을 얻는다.", "√(36/16)=3/2로 검산한다."],
      ["근호식을 먼저 제곱식으로 바꾼다.", "분모 16을 없앤 뒤 원래 식에 넣는다."],
      { misconceptionTags: ["EQUATION_SQUARING"], structureFamily: "fraction-radical-inverse" }),
    q("m3_sqrt_value", "A3", "linked-proportional-radicals", "SHORT_ANSWER", "자연수 x에 대하여 √x와 √(4x)가 모두 자연수이고 20<√x+√(4x)<30이다. x+15도 완전제곱수일 때 x를 구하시오.", "49",
      ["r=√x인 자연수로 두면 √(4x)=2r이므로 20<3r<30이다.", "따라서 가능한 자연수 r은 7,8,9이고 x 후보는 49,64,81이다.", "x+15는 각각 64,79,96이므로 완전제곱수가 되는 후보는 x=49뿐이다.", "√49+√196=7+14=21이고 49+15=64이므로 모든 조건을 검산한다."],
      ["두 비례 근호를 하나의 자연수 r로 표현해 범위에서 후보를 만든다.", "후보 x마다 x+15가 완전제곱수인지 확인한다."],
      { misconceptionTags: ["PROPORTIONAL_ROOT_SHIFTED_SQUARE_FILTER"], structureFamily: "proportional-root-range-shifted-square", difficultyEvidence: ["비례 근호 통합·범위 후보 생성·별도 완전제곱 조건 필터"] }),
    q("m3_sqrt_value", "A3", "bounded-shifted-perfect-squares", "SHORT_ANSWER", "1≤n≤20인 자연수 n 중 n은 홀수이고 √(n+1)이 자연수인 n을 모두 쓰시오.", "3,15",
      ["n+1은 2부터 21 사이의 완전제곱수이다.", "가능한 n+1은 4,9,16이다.", "따라서 n은 3,8,15이다.", "홀수 조건으로 3과 15만 남는다."],
      ["n+1이 될 수 있는 완전제곱수를 범위 안에서 찾는다.", "각 후보에서 1을 뺀 뒤 홀수 조건을 적용한다."],
      { answerContract: "SOLUTION_SET", independentCheck: true, misconceptionTags: ["SHIFTED_SQUARE_FILTER"], structureFamily: "bounded-shifted-square-parity" }),

    q("m3_sqrt_value", "A4", "twice-natural-perfect-square", "SHORT_ANSWER", "20<n<40인 자연수 n에 대하여 √(2n)이 자연수이다. n을 구하시오.", "32",
      ["40<2n<80이다.", "이 범위의 완전제곱수는 49와 64이다.", "2n은 짝수이므로 64만 가능하다.", "2n=64에서 n=32이고 범위를 만족한다."],
      ["2n이 놓이는 범위를 먼저 만든다.", "그 범위의 완전제곱수 중 짝수인 것을 고른다."],
      { misconceptionTags: ["PARITY_PERFECT_SQUARE"], structureFamily: "scaled-range-perfect-square" }),
    q("m3_sqrt_value", "A4", "two-perfect-square-gap", "STEP_ORDER", "n과 n+9가 모두 완전제곱수이고 √n+√(n+9)=9일 때 n을 구하는 과정을 순서대로 배열하시오.", ["a=√n,b=√(n+9)", "b²-a²=9", "(b-a)(b+a)=9", "a=4,b=5", "n=16"],
      ["a=√n, b=√(n+9)로 두면 a+b=9이다.", "b²-a²=9이므로 (b-a)(b+a)=9이다.", "a+b=9에서 b-a=1이다.", "연립해 a=4, b=5를 얻는다.", "따라서 n=a²=16이다."],
      ["두 제곱근을 자연수 a,b로 놓는다.", "제곱의 차를 인수분해하고 주어진 합과 연결한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["DIFFERENCE_OF_SQUARES"], structureFamily: "paired-perfect-square-gap" }),
    q("m3_sqrt_value", "A4", "reciprocal-root-condition", "EXPRESSION_INPUT", "0<t<1, a=t²이고 t+1/t=5/2일 때 a를 구하시오.", "1/4",
      ["2t²-5t+2=0으로 정리한다.", "(2t-1)(t-2)=0이므로 t=1/2 또는 2이다.", "0<t<1에 맞는 t=1/2를 고른다.", "a=t²=1/4이고 모든 조건을 만족한다."],
      ["먼저 t에 대한 이차방정식을 만든다.", "두 해 중 범위에 맞는 t만 골라 제곱한다."],
      { misconceptionTags: ["DOMAIN_FILTER"], structureFamily: "reciprocal-parameter-substitution", domain: "0<t<1" }),
    q("m3_sqrt_value", "A4", "sum-and-gap-perfect-roots", "SHORT_ANSWER", "m과 m+24가 모두 완전제곱수이고 √m+√(m+24)=12일 때 m을 구하시오.", "25",
      ["a=√m, b=√(m+24)로 두면 a+b=12이다.", "b²-a²=24이므로 (b-a)(b+a)=24이다.", "b-a=2를 얻는다.", "a=5, b=7이므로 m=25이다.", "25+24=49로 검산한다."],
      ["두 제곱근을 자연수로 놓고 합을 식으로 쓴다.", "제곱의 차 24를 (b-a)(b+a)로 바꾼다."],
      { independentCheck: true, misconceptionTags: ["SUM_GAP_SYSTEM"], structureFamily: "independent-square-pair-system" }),

    q("m3_sqrt_value", "A5", "scaled-root-equation-process", "STEP_ORDER", "x>0이고 √x+√(9x)=16일 때 x를 구하는 과정을 순서대로 배열하시오.", ["√(9x)=3√x", "4√x=16", "√x=4", "x=16", "원식 검산"],
      ["x>0에서 √(9x)=3√x이다.", "식은 4√x=16이 된다.", "√x=4에서 x=16이다.", "√16+√144=4+12=16으로 확인한다.", "각 변형이 양수 조건을 지킴을 확인한다."],
      ["두 근호를 같은 √x 꼴로 만든다.", "√x를 구한 다음 한 번 더 제곱해 x를 찾는다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["SCALAR_RADICAL_LINK"], structureFamily: "multi-scale-root-process" }),
    q("m3_sqrt_value", "A5", "decimal-root-sign-explanation", "WRITTEN_RESPONSE", "√0.04의 값을 ±0.2라고 쓴 풀이의 오류를 설명하고 올바른 답을 검산하시오.", "√0.04=0.2",
      ["0.2²=0.04이고 (-0.2)²도 0.04임을 확인한다.", "그러나 √0.04는 음이 아닌 제곱근 하나를 뜻한다고 설명한다.", "따라서 값은 0.2이다.", "0.2²=0.04로 검산한다."],
      ["‘0.04의 제곱근’과 ‘√0.04’를 구분한다.", "√ 기호의 값이 음이 될 수 있는지 확인한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["DECIMAL_PLUS_MINUS"], structureFamily: "decimal-sign-error-explanation", writtenRubric: { requiredIdeas: ["두 제곱근", "√의 음이 아닌 값", "제곱 검산"], minimumEvidence: 3 } }),
    q("m3_sqrt_value", "A5", "perfect-square-sum-condition", "SHORT_ANSWER", "n과 n+45가 모두 완전제곱수이고 √n+√(n+45)=15일 때 n을 구하시오.", "36",
      ["a=√n, b=√(n+45)로 두어 a+b=15를 얻는다.", "b²-a²=45를 (b-a)(b+a)=45로 바꾼다.", "b-a=3이다.", "연립하면 a=6, b=9이다.", "n=36이고 36+45=81로 검산된다."],
      ["두 제곱근을 자연수 a,b로 둔다.", "합 15와 제곱의 차 45를 곱셈식으로 연결한다."],
      { misconceptionTags: ["FACTOR_PAIR_SELECTION"], structureFamily: "large-square-pair-system" }),
    q("m3_sqrt_value", "A5", "difference-of-square-roots-strategy", "WRITTEN_RESPONSE", "자연수 n에서 n과 n+16이 모두 완전제곱수이고 두 음이 아닌 제곱근의 차가 2이다. n을 구하고 제곱의 차를 이용한 이유를 설명하시오.", "n=9",
      ["a=√n, b=√(n+16)으로 두면 b-a=2이다.", "b²-a²=16이므로 (b-a)(b+a)=16이다.", "b+a=8을 얻는다.", "연립해 a=3, b=5이므로 n=9이다.", "두 완전제곱수와 차 조건을 모두 검산한다."],
      ["두 제곱근을 자연수 a,b로 놓는다.", "제곱의 차 16을 이미 아는 b-a=2와 연결한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["STRATEGY_SELECTION_SQUARE_DIFFERENCE"], structureFamily: "perfect-square-gap-strategy", writtenRubric: { requiredIdeas: ["a,b 치환", "제곱의 차", "합과 차", "n=9"], minimumEvidence: 4 } }),

    // 3. 무리수와 실수
    q("m3_irrational_number", "BASIC", "identify-irrational", "MULTIPLE_CHOICE", "다음 중 무리수인 것은?", "√2",
      ["0.5, -3, 7/4는 모두 두 정수의 비로 나타낼 수 있다.", "√2는 유리수로 나타낼 수 없는 무리수이다."],
      ["유한소수·정수·분수는 유리수임을 이용한다.", "완전제곱수가 아닌 수의 제곱근을 찾는다."],
      { choices: ["0.5", "-3", "7/4", "√2"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["IRRATIONAL_IDENTIFICATION"], structureFamily: "classification-list" }),
    q("m3_irrational_number", "BASIC", "perfect-root-rationality", "MULTIPLE_CHOICE", "√49는 유리수인가, 무리수인가?", "유리수",
      ["√49=7이다.", "7은 정수이므로 유리수이다."],
      ["근호가 있다는 이유만으로 분류하지 않는다.", "먼저 근호 값을 계산한다."],
      { choices: ["유리수", "무리수", "실수가 아니다", "판정할 수 없다"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["RADICAL_ALWAYS_IRRATIONAL"], structureFamily: "simplify-then-classify" }),
    q("m3_irrational_number", "BASIC", "decimal-description", "MULTIPLE_CHOICE", "무리수의 소수 표현에 대한 설명으로 옳은 것은?", "끝없이 계속되고 순환하지 않는다.",
      ["유리수의 소수 표현은 유한소수이거나 순환소수이다.", "무리수는 끝없이 계속되며 일정한 부분이 순환하지 않는다."],
      ["유리수의 소수 표현과 비교한다.", "‘무한’뿐 아니라 ‘비순환’ 조건도 확인한다."],
      { choices: ["항상 유한소수이다.", "항상 순환소수이다.", "끝없이 계속되고 순환하지 않는다.", "소수로 나타낼 수 없다."], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["NONREPEATING_DECIMAL"], structureFamily: "definition-by-decimal" }),
    q("m3_irrational_number", "BASIC", "simplified-root-classification", "MULTIPLE_CHOICE", "√18을 간단히 한 뒤 분류하면?", "3√2인 무리수",
      ["√18=√(9×2)=3√2이다.", "√2가 무리수이고 0이 아닌 유리수 3을 곱해도 무리수이다."],
      ["18에서 완전제곱 인수를 꺼낸다.", "간단히 한 뒤 근호가 남는지 확인한다."],
      { choices: ["9인 유리수", "3√2인 무리수", "18인 유리수", "2√3인 무리수"], answerContract: "TEXT_NORMALIZED", independentCheck: true, misconceptionTags: ["SIMPLIFICATION_CLASSIFICATION"], structureFamily: "simplify-and-name" }),

    q("m3_irrational_number", "A1", "quotient-cancellation", "EXPRESSION_INPUT", "√12/√3을 계산하고 유리수 값으로 나타내시오.", "2",
      ["√12/√3=√(12/3)이다.", "√4=2이므로 결과는 유리수 2이다."],
      ["두 근호를 하나의 나눗셈 근호로 합친다.", "근호 안의 몫이 완전제곱인지 확인한다."],
      { misconceptionTags: ["RADICAL_QUOTIENT_CANCEL"], structureFamily: "quotient-becomes-rational" }),
    q("m3_irrational_number", "A1", "ratio-identical-radicals", "MULTIPLE_CHOICE", "√8/√2의 분류로 옳은 것은?", "값이 2인 유리수",
      ["√8/√2=√4=2이다.", "근호가 소거되므로 결과는 유리수이다."],
      ["겉모양이 아니라 계산한 최종 값을 분류한다.", "분자와 분모의 근호를 나누어 본다."],
      { choices: ["값이 2인 유리수", "값이 4인 유리수", "√4인 무리수", "2√2인 무리수"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["FORM_OVER_VALUE"], structureFamily: "classification-after-division" }),
    q("m3_irrational_number", "A1", "repeating-decimal-rational", "MULTIPLE_CHOICE", "0.121212…의 분류로 옳은 것은?", "순환소수이므로 유리수",
      ["12가 계속 반복되므로 순환소수이다.", "모든 순환소수는 분수로 나타낼 수 있어 유리수이다."],
      ["반복되는 숫자 묶음이 있는지 찾는다.", "순환소수와 무리수의 비순환 소수를 구분한다."],
      { choices: ["유한소수이므로 유리수", "순환소수이므로 유리수", "무한소수이므로 무리수", "실수가 아니다"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["INFINITE_DECIMAL_CONFUSION"], structureFamily: "repeating-decimal-classification" }),
    q("m3_irrational_number", "A1", "irrational-cancellation-zero", "SHORT_ANSWER", "√5-√5의 값을 구하고 유리수인지 확인하시오.", "0",
      ["같은 두 무리수의 차는 0이다.", "0은 정수이므로 유리수이다."],
      ["같은 항끼리의 뺄셈을 먼저 한다.", "계산 결과 0의 수 분류를 확인한다."],
      { independentCheck: true, misconceptionTags: ["IRRATIONAL_OPERATION_ABSOLUTE_RULE"], structureFamily: "irrational-cancellation" }),

    q("m3_irrational_number", "A2", "rational-plus-irrational", "MULTIPLE_CHOICE", "3+√2의 분류로 옳은 것은?", "무리수",
      ["3은 유리수이고 √2는 무리수이다.", "유리수와 무리수의 합은 무리수이다."],
      ["√2가 소거되는 다른 항이 있는지 확인한다.", "유리수 부분을 더해도 √2 부분은 남는다."],
      { choices: ["자연수", "정수", "유리수", "무리수"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["RATIONAL_PLUS_IRRATIONAL"], structureFamily: "mixed-sum-classification" }),
    q("m3_irrational_number", "A2", "hidden-cancellation", "EXPRESSION_INPUT", "√8-2√2를 계산하시오.", "0",
      ["√8=2√2로 간단히 한다.", "2√2-2√2=0이다.", "결과는 유리수이다."],
      ["먼저 √8을 간단히 한다.", "같은 근호끼리 계수를 뺀다."],
      { misconceptionTags: ["HIDDEN_LIKE_RADICAL"], structureFamily: "simplify-cancel" }),
    q("m3_irrational_number", "A2", "locate-irrational", "SHORT_ANSWER", "√10이 놓이는 두 연속한 자연수를 작은 수부터 쓰시오.", "3,4",
      ["3²=9, 4²=16이다.", "9<10<16이므로 3<√10<4이다.", "따라서 3과 4 사이이다."],
      ["10을 끼우는 두 완전제곱수를 찾는다.", "그 완전제곱수의 제곱근을 경계로 쓴다."],
      { answerContract: "SOLUTION_SET", misconceptionTags: ["IRRATIONAL_LOCATION"], structureFamily: "number-line-bounds" }),
    q("m3_irrational_number", "A2", "irrational-product-rational", "EXPRESSION_INPUT", "√6×√24를 계산하시오.", "12",
      ["√6×√24=√144이다.", "√144=12이다.", "두 무리수의 곱이 유리수가 될 수 있음을 확인한다."],
      ["근호의 곱을 하나의 근호로 합친다.", "근호 안의 곱이 완전제곱인지 확인한다."],
      { independentCheck: true, misconceptionTags: ["IRRATIONAL_PRODUCT_RULE"], structureFamily: "product-rationalizes" }),

    q("m3_irrational_number", "A3", "conjugate-product-classify", "EXPRESSION_INPUT", "서로 켤레인 √3+1과 √3-1의 곱을 계산하시오.", "2",
      ["합차 공식을 적용한다.", "(√3)²-1²=3-1이다.", "결과는 2이고 유리수이다."],
      ["두 식이 서로 켤레 꼴인지 본다.", "(a+b)(a-b)=a²-b²을 사용한다."],
      { misconceptionTags: ["CONJUGATE_PRODUCT"], structureFamily: "conjugate-rational-result" }),
    q("m3_irrational_number", "A3", "another-conjugate-difference", "EXPRESSION_INPUT", "(√5+2)(√5-2)의 값을 구하시오.", "1",
      ["두 식의 곱은 (√5)²-2²이다.", "5-4=1이다.", "무리수 항이 소거되어 유리수가 된다."],
      ["전개보다 합차 공식을 선택한다.", "두 제곱의 차를 계산한다."],
      { misconceptionTags: ["DIFFERENCE_OF_SQUARES"], structureFamily: "integer-conjugate-collapse" }),
    q("m3_irrational_number", "A3", "combine-like-irrationals", "MULTIPLE_CHOICE", "√2+√8을 간단히 하고 분류한 것은?", "3√2인 무리수",
      ["√8=2√2이다.", "√2+2√2=3√2이다.", "√2가 남으므로 무리수이다."],
      ["두 근호를 같은 근호 꼴로 만든다.", "계수를 더한 뒤 근호가 남는지 확인한다."],
      { choices: ["3√2인 무리수", "3√2인 유리수", "√10인 무리수", "10인 유리수"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["ADD_RADICANDS"], structureFamily: "like-irrational-sum" }),
    q("m3_irrational_number", "A3", "conjugate-mixed-roots", "SHORT_ANSWER", "(√7+√3)(√7-√3)의 값을 구하시오.", "4",
      ["합차 공식으로 7-3을 얻는다.", "결과는 4이다.", "4가 유리수임을 확인한다."],
      ["두 괄호에서 부호만 다른 항을 찾는다.", "각 근호를 제곱한 값의 차를 계산한다."],
      { independentCheck: true, misconceptionTags: ["CONJUGATE_TWO_RADICALS"], structureFamily: "two-radical-conjugate" }),

    q("m3_irrational_number", "A4", "subtract-unlike-before-simplify", "EXPRESSION_INPUT", "√12와 √27을 각각 간단히 한 뒤 앞의 값에서 뒤의 값을 빼시오.", "-√3",
      ["√12=2√3이다.", "√27=3√3이다.", "2√3-3√3=-√3이다.", "근삿값이 음수인지 원래 식과 비교한다."],
      ["각 근호를 먼저 가장 간단한 꼴로 만든다.", "같은 √3의 계수 2와 3을 뺀다."],
      { misconceptionTags: ["SIGN_AFTER_SIMPLIFY"], structureFamily: "negative-irrational-difference" }),
    q("m3_irrational_number", "A4", "count-scaled-rational-roots", "STEP_ORDER", "1≤n≤20인 자연수 n 중 √(2n)이 유리수인 n의 개수를 구하는 과정을 순서대로 배열하시오.", ["2n은 완전제곱수", "2n=4,16,36", "n=2,8,18", "개수=3"],
      ["√(2n)이 유리수이려면 자연수 2n이 완전제곱수여야 한다.", "2≤2n≤40 범위의 짝수 완전제곱수는 4,16,36이다.", "각각 n=2,8,18이다.", "세 값이 범위를 만족하므로 개수는 3이다."],
      ["2n의 범위를 먼저 정한다.", "그 범위에서 짝수인 완전제곱수만 고른다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["SCALED_RATIONAL_COUNT"], structureFamily: "bounded-rational-root-count" }),
    q("m3_irrational_number", "A4", "irrational-square-sum", "MULTIPLE_CHOICE", "x=√2+√3일 때 x²의 분류와 값으로 옳은 것은?", "5+2√6인 무리수",
      ["x²=2+2√6+3이다.", "x²=5+2√6이다.", "√6 항이 0이 아닌 채 남으므로 무리수이다.", "근삿값으로 양수임을 확인한다."],
      ["합의 제곱 공식을 사용한다.", "교차항 2√6이 남는지 확인한다."],
      { choices: ["5인 유리수", "5+√6인 무리수", "5+2√6인 무리수", "10인 유리수"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["CROSS_TERM_OMISSION"], structureFamily: "square-retains-irrational" }),
    q("m3_irrational_number", "A4", "no-adjacent-square-pair", "SHORT_ANSWER", "n-1과 n+1이 모두 완전제곱수가 되는 자연수 n의 개수를 구하시오.", "0",
      ["두 완전제곱수를 a²=n-1, b²=n+1로 둔다.", "b²-a²=2이므로 (b-a)(b+a)=2이다.", "양의 정수 두 인수는 같은 홀짝이어야 하지만 곱이 2인 쌍은 조건을 만족하지 못한다.", "따라서 가능한 자연수 n은 없다."],
      ["두 완전제곱수의 차가 2임을 식으로 쓴다.", "제곱의 차를 인수분해해 자연수 인수쌍을 확인한다."],
      { independentCheck: true, misconceptionTags: ["IMPOSSIBLE_SQUARE_GAP"], structureFamily: "prove-no-square-gap-two" }),

    q("m3_irrational_number", "A5", "rational-plus-irrational-proof", "WRITTEN_RESPONSE", "무리수 α에 대해 학생이 ‘실수 p,q이면 q≠0인 p+qα는 항상 무리수이고, p+qα의 표현은 유일하다’고 주장했다. p,q를 유리수로 제한해야 하는 이유를 반례로 보이고, 유리수 p,q,r,s에 대하여 (i) p+qα가 무리수일 필요충분조건은 q≠0, (ii) p+qα=r+sα이면 p=r, q=s임을 증명하시오.", "실수 계수에서는 반례가 생기지만 유리수 계수에서는 q≠0이 무리수일 필요충분조건이고 표현의 두 계수는 유일하다.",
      ["실수 계수를 허용하면 p=-α, q=1일 때 q≠0이지만 p+qα=0으로 유리수이므로 첫 주장은 거짓이다.", "또 0+1·α=α+0·α이므로 실수 계수에서는 서로 다른 두 계수쌍이 같은 수를 나타내 표현도 유일하지 않다.", "이제 p,q가 유리수이고 q≠0일 때 p+qα가 유리수라고 가정하면 α=((p+qα)-p)/q가 유리수가 되어 모순이다.", "q=0이면 p+qα=p가 유리수이므로 (i)의 필요성과 충분성이 모두 성립한다.", "유리수 p,q,r,s에서 p+qα=r+sα라면 (p-r)+(q-s)α=0이다.", "q≠s이면 α=-(p-r)/(q-s)가 유리수가 되어 모순이므로 q=s이고, 이어서 p=r이다.", "반례와 두 증명이 모두 계수의 유리수 조건이 왜 필요한지를 확인한다."],
      ["실수 계수로 α 자체를 상쇄할 수 있는 계수를 선택해 원래 주장의 두 부분을 각각 깨뜨린다.", "유리수 계수에서는 결론의 반대를 가정해 α를 유리수의 비로 나타내는 모순을 두 번 사용한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["RATIONAL_COEFFICIENT_IRRATIONAL_REPRESENTATION"], structureFamily: "repair-real-coefficient-claim-and-prove-uniqueness", difficultyEvidence: ["잘못된 일반화 분석·매개변수형 반례 구성·필요충분조건 증명·표현 유일성 증명·가정의 역할 검증"], writtenRubric: { requiredIdeas: ["실수 계수 q≠0 반례", "실수 계수 표현 비유일 반례", "q≠0일 때 무리수 증명", "q=0일 때 유리수 확인", "계수 비교를 위한 모순", "p=r 및 q=s 결론"], minimumEvidence: 6 } }),
    q("m3_irrational_number", "A5", "square-conjugate-cancellation-process", "STEP_ORDER", "(√2+√3)²-2√6의 값을 구하는 과정을 순서대로 배열하시오.", ["(√2+√3)²=5+2√6", "5+2√6-2√6", "값=5", "유리수 확인"],
      ["합의 제곱을 전개해 2+2√6+3을 얻는다.", "5+2√6으로 정리한다.", "2√6을 빼면 5이다.", "무리수 부분이 정확히 소거됨을 확인한다.", "5는 유리수이다."],
      ["먼저 괄호의 제곱에서 교차항을 빠뜨리지 않는다.", "뒤의 2√6과 같은 항이 생기는지 확인한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["STRUCTURED_CANCELLATION"], structureFamily: "engineered-irrational-cancellation" }),
    q("m3_irrational_number", "A5", "count-irrational-n-rational-scaled", "SHORT_ANSWER", "자연수 n에서 √(2n)과 √(2n+480)이 모두 자연수이고 √n은 무리수이다. 또한 n-1과 n+1 중 정확히 하나만 완전제곱수일 때 가능한 모든 n의 합을 구하시오.", "1684",
      ["x=√(2n), y=√(2n+480)인 자연수로 두면 y²-x²=480, 즉 (y-x)(y+x)=480이다.", "x²=2n은 짝수인 제곱수이므로 x는 짝수이고 n=x²/2=2(x/2)²이어서 √n=(x/2)√2는 무리수이다.", "u=y-x, v=y+x로 두고 uv=480인 인수쌍에서 x=(v-u)/2가 양의 짝수가 되는 경우를 빠짐없이 고른다.", "가능한 (u,v;x,y;n)은 (4,120;58,62;1682), (8,60;26,34;338), (12,40;14,26;98), (20,24;2,22;2)이다.", "n=1682에서는 n-1=1681=41², n=2에서는 n-1=1²이고, 각각 n+1은 제곱수가 아니므로 두 값은 배타 조건을 만족한다.", "n=338과 98은 양쪽 이웃이 모두 완전제곱수가 아니므로 제외된다.", "모든 인수쌍을 조사했으므로 가능한 모든 n의 합은 1682+2=1684이다."],
      ["두 자연수 제곱의 차가 480이라는 식을 만든 뒤 합과 차의 인수쌍으로 모든 후보를 생성한다.", "x가 짝수여야 한다는 조건과 이웃한 두 수의 배타적 제곱 조건을 차례로 적용하고, 인수쌍 분류가 완전한지 확인한다."],
      { misconceptionTags: ["TWO_SQUARE_CONDITIONS_EXCLUSIVE_NEIGHBOR_COMPLETE"], structureFamily: "difference-of-squares-factor-pairs-exclusive-neighbor-sum", difficultyEvidence: ["서로 다른 두 제곱 조건 결합·제곱의 차 인수분해·짝수 경우 분류·무리수성 일반화·배타 조건 검증·누락 없는 합 계산"] }),
    q("m3_irrational_number", "A5", "reject-irrational-product-rule", "WRITTEN_RESPONSE", "‘두 무리수의 곱은 언제나 무리수이다’라는 주장을 반례 두 개로 분석하시오. 하나는 유리수가 되는 경우, 하나는 무리수가 되는 경우여야 한다.", "√2·√2=2, √2·√3=√6",
      ["√2와 √2를 선택하면 곱은 2로 유리수이다.", "√2와 √3을 선택하면 곱은 √6으로 무리수이다.", "같은 ‘무리수×무리수’라도 결과가 달라짐을 비교한다.", "따라서 정보만으로 결과를 단정할 수 없다고 결론짓는다.", "각 인수가 실제 무리수인지 확인한다."],
      ["같은 근호끼리 곱하는 경우와 서로 다른 근호를 곱하는 경우를 비교한다.", "결과의 근호가 완전히 없어지는지 확인한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["FALSE_IRRATIONAL_PRODUCT_RULE"], structureFamily: "two-counterexample-classification", writtenRubric: { requiredIdeas: ["유리수 반례", "무리수 사례", "단정 불가"], minimumEvidence: 3 } }),

    // 4. 근호식의 간단한 표현
    q("m3_radical_simplification", "BASIC", "extract-square-twelve", "EXPRESSION_INPUT", "√12를 가장 간단한 근호식으로 나타내시오.", "2√3",
      ["12=4×3이다.", "√12=√4×√3=2√3이다."],
      ["12에서 가장 큰 완전제곱 인수 4를 찾는다.", "√4를 근호 밖으로 꺼낸다."],
      { acceptedAnswers: ["√12"], misconceptionTags: ["SQUARE_FACTOR_EXTRACTION"], structureFamily: "single-square-factor" }),
    q("m3_radical_simplification", "BASIC", "extract-square-eighteen", "EXPRESSION_INPUT", "√18을 가장 간단한 근호식으로 나타내시오.", "3√2",
      ["18=9×2이다.", "√18=√9×√2=3√2이다."],
      ["18의 완전제곱 인수 9를 찾는다.", "근호 안에는 2만 남긴다."],
      { misconceptionTags: ["INCOMPLETE_SIMPLIFICATION"], structureFamily: "odd-square-factor" }),
    q("m3_radical_simplification", "BASIC", "extract-square-seventyfive", "SHORT_ANSWER", "√75를 간단히 하시오.", "5√3",
      ["75=25×3이다.", "√75=5√3이다."],
      ["75를 완전제곱수와 나머지 인수의 곱으로 쓴다.", "5√3을 제곱해 75인지 확인한다."],
      { misconceptionTags: ["LARGEST_SQUARE_FACTOR"], structureFamily: "large-square-factor" }),
    q("m3_radical_simplification", "BASIC", "extract-square-ninetyeight", "EXPRESSION_INPUT", "√98을 가장 간단히 하시오.", "7√2",
      ["98=49×2이다.", "√98=7√2이다."],
      ["98에서 7²인 인수를 찾는다.", "근호 밖 계수와 안의 수를 제곱으로 검산한다."],
      { independentCheck: true, misconceptionTags: ["MISSED_FACTOR_49"], structureFamily: "independent-square-factor" }),

    q("m3_radical_simplification", "A1", "coefficient-times-radical", "EXPRESSION_INPUT", "2√27을 간단히 하시오.", "6√3",
      ["√27=3√3이다.", "바깥 계수 2를 곱해 6√3이다."],
      ["먼저 √27만 간단히 한다.", "근호 밖의 2와 새로 나온 3을 곱한다."],
      { misconceptionTags: ["OUTSIDE_COEFFICIENT"], structureFamily: "coefficient-after-extraction" }),
    q("m3_radical_simplification", "A1", "negative-coefficient-radical", "EXPRESSION_INPUT", "-3√20을 간단히 하시오.", "-6√5",
      ["√20=2√5이다.", "-3×2√5=-6√5이다."],
      ["음수 계수는 그대로 두고 근호부터 간단히 한다.", "마지막 계수의 부호를 확인한다."],
      { misconceptionTags: ["NEGATIVE_OUTSIDE_COEFFICIENT"], structureFamily: "negative-coefficient-simplify" }),
    q("m3_radical_simplification", "A1", "fraction-inside-radical", "EXPRESSION_INPUT", "√(8/9)을 간단히 하시오.", "2√2/3",
      ["√(8/9)=√8/3이다.", "√8=2√2이다.", "따라서 2√2/3이다."],
      ["분모 9의 제곱근을 먼저 계산한다.", "분자의 √8에서 완전제곱 인수를 꺼낸다."],
      { misconceptionTags: ["FRACTION_RADICAL_SIMPLIFY"], structureFamily: "fraction-radical-normal-form" }),
    q("m3_radical_simplification", "A1", "large-coefficient-radical", "EXPRESSION_INPUT", "4√45를 간단히 하시오.", "12√5",
      ["√45=3√5이다.", "4×3√5=12√5이다."],
      ["45를 9×5로 나타낸다.", "근호 밖의 계수끼리 곱한다."],
      { independentCheck: true, misconceptionTags: ["COEFFICIENT_MULTIPLICATION"], structureFamily: "independent-coefficient-normalization" }),

    q("m3_radical_simplification", "A2", "combine-after-simplify-sum", "EXPRESSION_INPUT", "√12+√27을 간단히 하시오.", "5√3",
      ["√12=2√3이다.", "√27=3√3이다.", "같은 근호끼리 더해 5√3이다."],
      ["각 근호를 먼저 간단히 한다.", "같은 √3의 계수를 더한다."],
      { misconceptionTags: ["ADD_BEFORE_SIMPLIFY"], structureFamily: "two-source-like-radicals" }),
    q("m3_radical_simplification", "A2", "combine-after-simplify-difference", "EXPRESSION_INPUT", "√50-√8을 간단히 하시오.", "3√2",
      ["√50=5√2이다.", "√8=2√2이다.", "5√2-2√2=3√2이다."],
      ["50과 8을 각각 제곱 인수로 분해한다.", "같은 근호의 계수 차를 구한다."],
      { misconceptionTags: ["SUBTRACT_RADICANDS"], structureFamily: "difference-converges-like-radicals" }),
    q("m3_radical_simplification", "A2", "three-term-normalization", "EXPRESSION_INPUT", "2√18+√32-√8을 간단히 하시오.", "8√2",
      ["2√18=6√2이다.", "√32=4√2, √8=2√2이다.", "6√2+4√2-2√2=8√2이다."],
      ["세 근호를 모두 √2 꼴로 바꾼다.", "바깥 계수까지 포함해 계수를 계산한다."],
      { misconceptionTags: ["MULTI_TERM_COEFFICIENT"], structureFamily: "three-term-common-radical" }),
    q("m3_radical_simplification", "A2", "fraction-normal-form", "EXPRESSION_INPUT", "√(27/8)을 분모에 근호가 없도록 간단히 하시오.", "3√6/4",
      ["√(27/8)=3√3/(2√2)이다.", "분자와 분모에 √2를 곱한다.", "3√6/4를 얻는다.", "제곱해 27/8과 같은지 확인한다."],
      ["분자와 분모의 근호를 각각 간단히 한다.", "분모의 √2를 없애기 위해 √2/√2를 곱한다."],
      { independentCheck: true, misconceptionTags: ["RATIONALIZATION_NORMAL_FORM"], structureFamily: "fraction-simplify-and-rationalize" }),

    q("m3_radical_simplification", "A3", "least-multiplier-perfect-square", "SHORT_ANSWER", "1≤n≤100인 자연수 n에서 √(72n)이 자연수이고 n이 360의 약수이며 n을 7로 나눈 나머지가 4일 때 n을 구하시오.", "18",
      ["72=2³×3²이므로 72n이 완전제곱수가 되려면 n=2k²인 자연수 k가 존재해야 한다.", "1≤n≤100에서 이 꼴의 후보는 2,8,18,32,50,72,98이다.", "이 중 360의 약수인 것은 2,8,18,72이다.", "네 수를 7로 나눈 나머지는 각각 2,1,4,2이므로 n=18만 남는다.", "72×18=1296=36²이고 18은 360의 약수이며 18=7×2+4이므로 모든 조건을 검산한다."],
      ["72의 소인수 지수에서 홀수인 부분을 보정해 n의 일반형을 먼저 만든다.", "범위 후보에 약수 조건과 나머지 조건을 차례로 적용하되 어느 후보도 빠뜨리지 않는다."],
      { misconceptionTags: ["SQUARE_KERNEL_WITH_DIVISOR_REMAINDER_FILTER"], structureFamily: "square-kernel-candidates-divisor-remainder-filter", difficultyEvidence: ["소인수 지수 분석·다중 후보 생성·독립 약수 조건 필터·나머지 조건 유일성 검증"] }),
    q("m3_radical_simplification", "A3", "recover-radicand-parameter", "SHORT_ANSWER", "a>0일 때 근호식 √(12a)가 6√3과 동치이다. a를 구하시오.", "9",
      ["양변은 음이 아니므로 제곱한다.", "12a=(6√3)²=108이다.", "a=9이다.", "√108=6√3으로 검산한다."],
      ["동치인 근호식이므로 양변을 제곱해 근호를 없앤다.", "구한 a를 원래 식에 대입해 간소화한다."],
      { misconceptionTags: ["REVERSE_RADICAL_SIMPLIFICATION"], structureFamily: "parameter-from-normal-form" }),
    q("m3_radical_simplification", "A3", "negative-variable-square-factor", "EXPRESSION_INPUT", "0이 아닌 실수 x가 √(x²)+x=0을 만족할 때 √(45x²)-√(5x²)을 간단히 하시오.", "-2x√5",
      ["√(x²)=|x|이므로 주어진 조건은 |x|+x=0이다.", "x>0이면 2x=0이 되어 모순이고 x≠0이므로 x<0이다.", "두 근호를 각각 3√5|x|, √5|x|로 바꾸면 차는 2√5|x|이다.", "x<0이므로 |x|=-x를 대입해 -2x√5를 얻는다.", "결과가 양수라는 원래 근호식의 부호와도 일치함을 확인한다."],
      ["주어진 등식에서 먼저 x의 부호를 역추론한다.", "두 근호를 같은 √5|x| 꼴로 바꾼 뒤 알아낸 부호로 절댓값을 푼다."],
      { acceptedAnswers: ["-2√5x"], misconceptionTags: ["INFER_SIGN_BEFORE_RADICAL_EXTRACTION"], structureFamily: "implicit-sign-two-radical-normalization", difficultyEvidence: ["등식에서 부호 역추론·두 근호 정규화·절댓값 치환·부호 검산"] }),
    q("m3_radical_simplification", "A3", "coefficient-identification", "SHORT_ANSWER", "√200=k√2(k>0)일 때 k를 구하시오.", "10",
      ["200=100×2이다.", "√200=10√2이다.", "계수를 비교해 k=10이다."],
      ["200에서 2를 제외한 완전제곱 인수를 찾는다.", "가장 간단한 꼴의 근호 밖 계수를 읽는다."],
      { independentCheck: true, misconceptionTags: ["COEFFICIENT_IDENTIFICATION"], structureFamily: "normal-form-coefficient" }),

    q("m3_radical_simplification", "A4", "least-divisor-for-square-quotient", "SHORT_ANSWER", "√(180/n)이 자연수가 되게 하는 가장 작은 자연수 n을 구하시오. 단, 180/n도 자연수이다.", "5",
      ["180=2²×3²×5이다.", "몫이 완전제곱수가 되려면 지수가 홀수인 5를 제거해야 한다.", "n=5이면 180/n=36이다.", "√36=6이고 n=1,2,3,4는 조건을 만족하지 않는다."],
      ["180의 소인수 지수 중 홀수인 것을 찾는다.", "나눗셈으로 그 인수만 제거해 완전제곱 몫을 만든다."],
      { misconceptionTags: ["DIVISOR_SQUARE_COMPLETION"], structureFamily: "least-divisor-square-quotient" }),
    q("m3_radical_simplification", "A4", "parameter-hidden-in-normal-form", "SHORT_ANSWER", "a>0이고 √(48a)=12√3일 때 a를 구하시오.", "9",
      ["양변을 제곱해 48a=432를 얻는다.", "a=9이다.", "48×9=432=144×3이다.", "√432=12√3으로 원래 식을 확인한다."],
      ["두 양수 근호식이 같으므로 제곱해도 동치이다.", "구한 값을 다시 완전제곱 인수로 분해한다."],
      { misconceptionTags: ["SQUARE_BOTH_SIDES_CHECK"], structureFamily: "large-parameter-reverse-normalization" }),
    q("m3_radical_simplification", "A4", "reverse-normal-form-process", "STEP_ORDER", "자연수 n의 제곱근을 가장 간단히 했더니 5√2가 되었다. n을 찾는 과정을 순서대로 배열하시오.", ["√n=5√2", "n=(5√2)²", "n=50", "50=25×2", "원형 검산"],
      ["가장 간단한 꼴에서 √n=5√2이다.", "두 값이 음이 아니므로 제곱해 n=(5√2)²로 바꾼다.", "n=50을 얻는다.", "50=25×2로 분해한다.", "√50=5√2가 되어 조건과 같음을 확인한다."],
      ["근호 밖 계수와 안의 수를 다시 하나의 근호 안으로 넣는다.", "구한 n을 다시 간소화해 같은 정상형이 되는지 확인한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["REVERSE_NORMAL_FORM"], structureFamily: "reconstruct-radicand-from-normal-form" }),
    q("m3_radical_simplification", "A4", "quotient-after-simplification", "EXPRESSION_INPUT", "(√48-√12)/√3을 간단히 하시오.", "2",
      ["√48=4√3, √12=2√3이다.", "분자는 2√3이다.", "2√3/√3=2이다.", "원래 식의 근삿값과 부호를 확인한다."],
      ["분자의 두 근호부터 같은 근호로 만든다.", "분자에서 √3을 묶어 분모와 약분한다."],
      { independentCheck: true, misconceptionTags: ["SIMPLIFY_BEFORE_DIVIDE"], structureFamily: "normalize-subtract-cancel" }),

    q("m3_radical_simplification", "A5", "prime-factor-process", "STEP_ORDER", "√432를 가장 간단히 하는 과정을 순서대로 배열하시오.", ["432=2^4×3^3", "432=144×3", "√432=√144×√3", "√432=12√3", "제곱 검산"],
      ["432를 소인수분해해 2⁴×3³으로 쓴다.", "완전제곱 부분 2⁴×3²=144를 묶는다.", "√432=√144√3으로 바꾼다.", "12√3을 얻는다.", "(12√3)²=432로 검산한다."],
      ["소인수의 지수가 짝수인 부분을 한꺼번에 묶는다.", "근호 밖으로 꺼낸 계수를 다시 제곱해 확인한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["MULTI_PRIME_EXPONENT"], structureFamily: "prime-exponent-normalization-process" }),
    q("m3_radical_simplification", "A5", "normal-form-uniqueness", "WRITTEN_RESPONSE", "양의 정수 N이 N=a²b=c²d로 나타나고 a,c는 자연수, b,d는 완전제곱 인수가 1뿐인 자연수라고 하자. 반드시 a=c, b=d임을 증명하고, b,d의 조건을 빼면 표현의 유일성이 깨지는 구체적 반례를 하나 제시하시오.", "소인수 지수의 홀짝으로 b=d, 이어서 a=c이며, 제곱 인수 조건을 빼면 같은 N의 서로 다른 표현이 가능하다.",
      ["N의 소인수분해에서 각 소수의 지수를 비교한다.", "a²와 c²가 주는 지수는 모두 짝수이므로 전체 지수의 홀짝은 각각 b와 d에 그 소수가 들어 있는지로 결정된다.", "b,d에는 같은 소수가 두 번 이상 들어갈 수 없으므로 모든 소수에 대해 포함 여부가 같아 b=d이다.", "a²b=c²b에서 b를 약분하면 a²=c²이고 a,c가 자연수이므로 a=c이다.", "조건을 빼는 반례로 N=72=6²·2=3²·8을 들 수 있으며 8에는 완전제곱 인수 4가 남아 있다.", "반례의 두 곱이 모두 72인지, 증명에서 제곱 인수 없음 조건이 정확히 어디 쓰였는지 검증한다."],
      ["소인수분해 지수의 짝수 부분과 홀수 부분이 각각 a²와 b에 어떻게 나뉘는지 비교한다.", "유일성 증명 뒤에는 근호 안에 제곱 인수를 허용했을 때 같은 수를 두 방식으로 나타내는 예를 직접 구성한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["PROVE_NORMAL_FORM_UNIQUENESS"], structureFamily: "squarefree-normal-form-uniqueness-counterexample", difficultyEvidence: ["소인수 지수 일반화·유일성 증명·조건 필요성 분석·반례 구성"], writtenRubric: { requiredIdeas: ["소인수 지수의 홀짝", "b=d", "a=c", "제곱 인수 조건의 역할", "서로 다른 표현 반례"], minimumEvidence: 5 } }),
    q("m3_radical_simplification", "A5", "simultaneous-square-multiplier", "SHORT_ANSWER", "√(90n)과 √(40n)이 모두 자연수가 되게 하는 가장 작은 자연수 n을 구하시오.", "10",
      ["90=2×3²×5이고 40=2³×5이다.", "90n이 완전제곱이 되려면 n에 2×5가 필요하다.", "40n도 같은 n=10에서 400이 된다.", "90×10=900, 40×10=400이다.", "두 제곱근이 각각 30,20임을 확인한다."],
      ["두 수의 소인수 지수를 나란히 적는다.", "두 곱 모두 지수가 짝수가 되게 하는 최소 인수를 선택한다."],
      { misconceptionTags: ["SIMULTANEOUS_PARITY_REQUIREMENT"], structureFamily: "least-common-square-completion" }),
    q("m3_radical_simplification", "A5", "invalid-radical-splitting", "WRITTEN_RESPONSE", "학생이 √72=√36+√36=12라고 계산했다. 잘못된 변형을 찾고 올바른 값을 구한 뒤 검산하시오.", "√72=6√2",
      ["√(a+b)=√a+√b는 일반적으로 성립하지 않음을 지적한다.", "72=36×2로 곱셈 구조를 사용한다.", "√72=6√2를 얻는다.", "(6√2)²=72로 검산한다.", "12²=144이므로 학생 답이 틀림을 확인한다."],
      ["근호는 곱셈과 덧셈 중 어느 연산에서 나눌 수 있는지 구분한다.", "72를 완전제곱수와의 곱으로 바꾼다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["FALSE_SUM_SPLIT"], structureFamily: "diagnose-additive-radical-error", writtenRubric: { requiredIdeas: ["덧셈 분리 오류", "36×2", "6√2", "제곱 검산"], minimumEvidence: 4 } }),

    // 5. 근호식의 계산
    q("m3_radical_operations", "BASIC", "add-like-radicals", "EXPRESSION_INPUT", "3√2+5√2를 계산하시오.", "8√2",
      ["두 항의 근호가 모두 √2로 같다.", "계수 3+5=8이므로 8√2이다."],
      ["같은 근호인지 먼저 확인한다.", "근호는 그대로 두고 계수만 더한다."],
      { misconceptionTags: ["ADD_LIKE_RADICALS"], structureFamily: "direct-like-radical-addition" }),
    q("m3_radical_operations", "BASIC", "subtract-like-radicals", "EXPRESSION_INPUT", "7√3-2√3을 계산하시오.", "5√3",
      ["같은 √3 항의 계수를 뺀다.", "(7-2)√3=5√3이다."],
      ["근호 안의 수는 바꾸지 않는다.", "7과 2의 차를 계수로 쓴다."],
      { misconceptionTags: ["SUBTRACT_LIKE_RADICALS"], structureFamily: "direct-like-radical-subtraction" }),
    q("m3_radical_operations", "BASIC", "multiply-radicals-simplify", "EXPRESSION_INPUT", "√6×√15를 간단히 하시오.", "3√10",
      ["두 근호를 곱해 √90으로 만든다.", "90=9×10이므로 √90=3√10이다."],
      ["근호 안의 수끼리 곱한다.", "곱한 뒤 완전제곱 인수를 꺼낸다."],
      { misconceptionTags: ["MULTIPLY_AND_SIMPLIFY"], structureFamily: "radical-product-normalization" }),
    q("m3_radical_operations", "BASIC", "divide-radicals", "SHORT_ANSWER", "√48/√3을 계산하시오.", "4",
      ["근호의 몫을 √(48/3)=√16으로 바꾼다.", "√16=4이다."],
      ["분자와 분모를 하나의 근호로 합친다.", "48÷3을 계산한 뒤 제곱근을 구한다."],
      { independentCheck: true, misconceptionTags: ["RADICAL_DIVISION"], structureFamily: "quotient-perfect-square" }),

    q("m3_radical_operations", "A1", "add-binomial-radicals", "EXPRESSION_INPUT", "(√3+2)+(2√3-1)을 간단히 하시오.", "3√3+1",
      ["√3 항끼리 더해 3√3을 얻는다.", "유리수 2와 -1을 더해 1을 얻는다.", "결과는 3√3+1이다."],
      ["근호 항과 유리수 항을 따로 모은다.", "같은 종류의 항끼리만 계산한다."],
      { misconceptionTags: ["COMBINE_UNLIKE_TERMS"], structureFamily: "binomial-like-term-collection" }),
    q("m3_radical_operations", "A1", "distribute-radical", "EXPRESSION_INPUT", "√5(√20-√5)를 계산하시오.", "5",
      ["√5×√20=√100=10이다.", "√5×√5=5이다.", "10-5=5이다."],
      ["분배법칙으로 두 항에 √5를 각각 곱한다.", "각 곱의 근호를 계산한 뒤 뺀다."],
      { misconceptionTags: ["DISTRIBUTION_MISSING_TERM"], structureFamily: "radical-distribution" }),
    q("m3_radical_operations", "A1", "integer-conjugate-product", "EXPRESSION_INPUT", "(√7+1)(√7-1)을 계산하시오.", "6",
      ["합차 공식을 적용한다.", "(√7)²-1²=7-1=6이다."],
      ["두 괄호가 켤레임을 확인한다.", "가운데 항이 소거되는 합차 공식을 쓴다."],
      { misconceptionTags: ["CONJUGATE_FORMULA"], structureFamily: "simple-conjugate-product" }),
    q("m3_radical_operations", "A1", "single-term-rationalization", "EXPRESSION_INPUT", "3/√3의 분모를 유리화하시오.", "√3",
      ["분자와 분모에 √3을 곱한다.", "3√3/3=√3이다."],
      ["분모와 같은 √3을 분자·분모에 모두 곱한다.", "분모가 3이 된 뒤 약분한다."],
      { acceptedAnswers: ["3√3/3"], independentCheck: true, misconceptionTags: ["RATIONALIZE_BOTH_PARTS"], structureFamily: "monomial-denominator-rationalization" }),

    q("m3_radical_operations", "A2", "square-radical-binomial", "EXPRESSION_INPUT", "(√2+√3)²을 전개하시오.", "5+2√6",
      ["합의 제곱 공식을 사용한다.", "2+2√6+3을 얻는다.", "유리수 항을 합쳐 5+2√6이다."],
      ["(a+b)²의 가운데 항 2ab를 빠뜨리지 않는다.", "각 근호의 제곱과 곱을 따로 계산한다."],
      { misconceptionTags: ["MISSING_CROSS_TERM"], structureFamily: "square-two-radicals" }),
    q("m3_radical_operations", "A2", "scaled-conjugate-product", "EXPRESSION_INPUT", "(2√5-√2)(2√5+√2)를 계산하시오.", "18",
      ["합차 공식으로 (2√5)²-(√2)²를 얻는다.", "20-2=18이다.", "전개해 교차항이 소거되는지 확인한다."],
      ["두 괄호가 부호만 다른 켤레 꼴인지 확인한다.", "각 항을 제곱한 값의 차를 구한다."],
      { misconceptionTags: ["SQUARE_COEFFICIENT"], structureFamily: "scaled-conjugate-difference" }),
    q("m3_radical_operations", "A2", "binomial-denominator-rationalization", "EXPRESSION_INPUT", "1/(√3+1)의 분모를 유리화하시오.", "(√3-1)/2",
      ["분자와 분모에 켤레 √3-1을 곱한다.", "분모는 3-1=2이다.", "분자는 √3-1이므로 (√3-1)/2이다."],
      ["분모의 켤레를 찾는다.", "(a+b)(a-b)=a²-b²을 분모에 적용한다."],
      { misconceptionTags: ["CONJUGATE_RATIONALIZATION"], structureFamily: "binomial-rationalization" }),
    q("m3_radical_operations", "A2", "simplify-then-rationalize", "EXPRESSION_INPUT", "√12/(√3-1)의 분모를 유리화하시오.", "3+√3",
      ["√12=2√3으로 간단히 한다.", "분자와 분모에 √3+1을 곱한다.", "분모는 2, 분자는 2√3(√3+1)이다.", "약분하면 3+√3이다."],
      ["분자의 √12부터 간단히 한다.", "분모의 켤레를 곱한 뒤 공통인 2를 약분한다."],
      { independentCheck: true, misconceptionTags: ["ORDER_SIMPLIFY_RATIONALIZE"], structureFamily: "normalize-before-conjugate" }),

    q("m3_radical_operations", "A3", "symmetric-square-sum", "SHORT_ANSWER", "a=√5+√2, b=√5-√2일 때 a²+b²의 값을 구하시오.", "14",
      ["a+b=2√5, ab=3임을 구한다.", "a²+b²=(a+b)²-2ab를 사용한다.", "20-6=14이다.", "직접 전개한 결과와 비교한다."],
      ["a²와 b²를 각각 전개하기보다 합과 곱을 먼저 본다.", "a²+b²=(a+b)²-2ab를 사용한다."],
      { misconceptionTags: ["SYMMETRIC_EXPRESSION"], structureFamily: "conjugate-pair-square-sum" }),
    q("m3_radical_operations", "A3", "reciprocal-conjugate", "EXPRESSION_INPUT", "x=√3+√2일 때 x+1/x를 간단히 하시오.", "2√3",
      ["(√3+√2)(√3-√2)=1이다.", "따라서 1/x=√3-√2이다.", "두 식을 더하면 2√3이다.", "곱으로 역수 관계를 검산한다."],
      ["x의 켤레와 x의 곱을 계산한다.", "곱이 1이면 켤레가 바로 역수이다."],
      { misconceptionTags: ["RECIPROCAL_BY_CONJUGATE"], structureFamily: "unit-norm-conjugate-reciprocal" }),
    q("m3_radical_operations", "A3", "parameter-conjugate-equation", "SHORT_ANSWER", "실수 a가 (√2+a)(√2-a)=-7과 √((a-1)²)=2를 모두 만족할 때 a를 구하시오.", "3",
      ["첫 식을 합차 공식으로 바꾸면 2-a²=-7이므로 a=±3이다.", "둘째 식은 |a-1|=2이므로 a=3 또는 a=-1이다.", "두 후보 집합의 공통값은 a=3뿐이다.", "a=3을 두 원래 식에 대입하면 각각 -7과 2를 얻어 유일성을 확인한다."],
      ["각 조건에서 가능한 a의 후보를 부호까지 모두 구한다.", "두 후보 집합의 공통값을 고른 뒤 두 원식에 모두 검산한다."],
      { misconceptionTags: ["INTERSECT_PARAMETER_CANDIDATES"], structureFamily: "conjugate-and-absolute-candidate-intersection", difficultyEvidence: ["두 독립 조건에서 후보 생성·교집합 선택·원식 이중 검산"] }),
    q("m3_radical_operations", "A3", "factor-and-cancel-binomial", "EXPRESSION_INPUT", "5<n<60인 자연수 n에 대하여 Q=(√(6n)+√(2n))/(√3+1)이라 하자. Q가 자연수이지만 4의 배수는 아닐 때 가능한 n 중 가장 작은 값을 구하시오.", "18",
      ["분자를 √(2n)(√3+1)로 묶으면 분모가 0이 아니므로 Q=√(2n)이다.", "Q가 자연수이면 2n=Q²이고 Q는 짝수이므로 Q=2t, n=2t²이다.", "5<n<60에서 n 후보는 8,18,32,50이고 Q는 각각 4,6,8,10이다.", "Q가 4의 배수가 아닌 후보는 n=18,50이며 그중 가장 작은 값은 18이다.", "n=18을 원래 분수에 넣으면 Q=6으로 모든 조건을 만족한다."],
      ["분자의 숨은 공통인수를 찾아 먼저 Q를 하나의 근호로 줄인다.", "Q의 자연수 조건으로 n 후보를 만든 뒤 4의 배수 조건과 최소성을 적용한다."],
      { independentCheck: true, misconceptionTags: ["FACTOR_DOMAIN_CANDIDATE_MINIMUM"], structureFamily: "hidden-factor-square-candidates-minimum", difficultyEvidence: ["숨은 인수분해·분모 정의 확인·제곱수 후보 생성·배수 필터·최소성"] }),

    q("m3_radical_operations", "A4", "difference-of-reciprocals", "EXPRESSION_INPUT", "1/(√5-2)-1/(√5+2)를 계산하시오.", "4",
      ["(√5-2)(√5+2)=1이다.", "따라서 1/(√5-2)=√5+2이다.", "1/(√5+2)=√5-2이다.", "두 식의 차는 4이다.", "양수 크기로 부호를 검산한다."],
      ["두 분모의 곱이 1인지 먼저 확인한다.", "각 분수의 켤레가 바로 역수인지 이용한다."],
      { misconceptionTags: ["RECIPROCAL_SIGN"], structureFamily: "paired-reciprocal-difference" }),
    q("m3_radical_operations", "A4", "fourth-power-conjugate-sum", "STEP_ORDER", "(√3+√2)⁴+(√3-√2)⁴의 값을 구하는 과정을 순서대로 배열하시오.", ["제곱하면 5±2√6", "(5+2√6)²+(5-2√6)²", "2(25+24)", "값=98"],
      ["각 괄호를 먼저 제곱해 5±2√6을 얻는다.", "두 결과를 다시 제곱한 합으로 바꾼다.", "켤레 제곱의 합에서 무리수 항이 소거된다.", "2(25+24)=98이다.", "근삿값으로 양수 크기를 확인한다."],
      ["네제곱을 한 번에 전개하지 말고 제곱을 두 번 한다.", "서로 켤레인 두 식의 합에서 교차항이 소거됨을 이용한다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["STRATEGY_AVOID_LONG_EXPANSION"], structureFamily: "nested-conjugate-power-sum" }),
    q("m3_radical_operations", "A4", "reciprocal-square-expression", "SHORT_ANSWER", "x>1이고 자연수 m이 8<m<20, x+1/x=√m을 만족한다. A=x-1/x, B=x²+1/x², C=x²-1/x² 중 정확히 두 값이 정수일 때 m과 그 두 정수의 값을 모두 더한 값을 구하시오.", "27",
      ["B=(x+1/x)²-2=m-2이므로 B는 항상 정수이다.", "x>1이므로 A>0이고 A²=(x+1/x)²-4=m-4이므로 A가 정수일 조건은 m-4가 완전제곱수인 것이다.", "C²=m(m-4)=(m-2)²-4이다. C가 정수 k라면 (m-2-k)(m-2+k)=4인데 두 양의 정수 인수의 같은 짝홀 조건을 만족하는 경우는 (2,2)뿐이어서 m=4가 되어 범위와 모순이다.", "따라서 범위에서 C는 정수가 아니고 정확히 두 값이 정수이려면 A가 정수여야 한다.", "8<m<20에서 m-4가 완전제곱수인 유일한 값은 m-4=9, 즉 m=13이다.", "이때 A=3, B=11, C=3√13이므로 구하는 합은 13+3+11=27이다."],
      ["세 식을 직접 구하려 하지 말고 각각의 제곱 또는 대칭식으로 정수 조건을 분리한다.", "C가 정수라고 가정했을 때 두 제곱의 차가 4인 인수쌍을 분석하고, 남은 A의 조건으로 m을 역추론한다."],
      { misconceptionTags: ["REVERSE_INTEGER_CLASSIFICATION_OF_RECIPROCAL_FORMS"], structureFamily: "parameter-recovery-by-integer-form-classification", difficultyEvidence: ["매개변수 역추론·세 표현의 정수성 분류·부호 조건·제곱의 차 비존재 증명·범위 유일성·결과 검산"] }),
    q("m3_radical_operations", "A4", "difference-denominator-rationalize", "EXPRESSION_INPUT", "2/(√7-√5)의 분모를 유리화하시오.", "√7+√5",
      ["분자와 분모에 √7+√5를 곱한다.", "분모는 7-5=2이다.", "분자의 2와 분모의 2를 약분한다.", "결과는 √7+√5이다.", "원식과 곱해 등가를 확인한다."],
      ["분모의 켤레를 곱한다.", "분모가 2가 된 뒤 원래 분자의 2와 약분한다."],
      { independentCheck: true, misconceptionTags: ["CONJUGATE_AND_CANCEL"], structureFamily: "perfect-cancellation-rationalization" }),

    q("m3_radical_operations", "A5", "sum-reciprocal-process", "STEP_ORDER", "1/(√3-√2)+1/(√3+√2)의 값을 구하는 과정을 순서대로 배열하시오.", ["두 분모의 곱은 1", "각 역수는 서로의 켤레", "(√3+√2)+(√3-√2)", "값=2√3", "원식 검산"],
      ["두 분모의 곱이 3-2=1임을 확인한다.", "각 분수는 반대쪽 켤레와 같다.", "두 켤레를 더한다.", "√2 항이 소거되어 2√3이다.", "통분한 결과와 비교해 검산한다."],
      ["분모를 각각 유리화하기 전에 두 분모의 곱을 본다.", "곱이 1이면 각 분모의 켤레가 역수이다."],
      { answerContract: "STEP_EQUIVALENCE", misconceptionTags: ["GLOBAL_CONJUGATE_STRATEGY"], structureFamily: "paired-unit-denominator-sum" }),
    q("m3_radical_operations", "A5", "why-conjugate-rationalizes", "WRITTEN_RESPONSE", "자연수 a>b>0에 대하여 1/(√a+√b)가 유리수가 될 필요충분조건을 구하고 증명한 뒤, 조건과 관계없이 사용할 수 있는 분모 유리화의 일반식을 도출하시오.", "a와 b가 각각 완전제곱수이고, 1/(√a+√b)=(√a-√b)/(a-b)이다.",
      ["1/(√a+√b)가 유리수라고 가정하면 양수인 √a+√b도 유리수이다.", "(√a+√b)(√a-√b)=a-b이고 a-b≠0이므로 √a-√b도 유리수이다.", "합과 차를 더하고 빼면 √a와 √b가 각각 유리수이다.", "a,b가 자연수이므로 √a와 √b가 유리수이면 a,b는 각각 완전제곱수이다.", "반대로 a,b가 각각 완전제곱수이면 √a+√b가 양의 자연수이므로 그 역수는 유리수이다.", "마지막으로 합차 공식을 이용해 1/(√a+√b)=(√a-√b)/(a-b)를 도출하고 a>b에서 분모가 0이 아님을 확인한다."],
      ["역수가 0이 아닌 유리수라면 원래 분모의 수 분류가 어떻게 되는지부터 생각한다.", "√a+√b와 √a-√b의 곱이 자연수 a-b임을 이용해 합과 차를 각각 판정한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["RATIONAL_RECIPROCAL_IFF_BOTH_SQUARES"], structureFamily: "reciprocal-rationality-iff-and-derived-rationalization", difficultyEvidence: ["전략을 직접 선택해 합과 차를 도출", "유리성의 필요충분조건·일반화·분모 0 검증을 모두 수행"], writtenRubric: { requiredIdeas: ["합의 유리성", "차의 유리성", "두 제곱근의 유리성", "a,b의 완전제곱 조건", "충분성", "유리화 일반식"], minimumEvidence: 6 } }),
    q("m3_radical_operations", "A5", "cubic-reciprocal-symmetric", "EXPRESSION_INPUT", "x=√2+1일 때 x³+1/x³을 간단히 하시오.", "10√2",
      ["1/x=√2-1임을 켤레의 곱으로 확인한다.", "x+1/x=2√2이고 x·1/x=1이다.", "x³+1/x³=(x+1/x)³-3(x+1/x)이다.", "16√2-6√2=10√2이다.", "직접 세제곱의 근삿값으로 확인한다."],
      ["x의 켤레가 역수인지 먼저 확인한다.", "a³+b³=(a+b)³-3ab(a+b)를 사용한다."],
      { misconceptionTags: ["CUBIC_SYMMETRIC_IDENTITY"], structureFamily: "reciprocal-cubic-strategy" }),
    q("m3_radical_operations", "A5", "rationalization-error-review", "WRITTEN_RESPONSE", "1/(√5-√2)를 유리화할 때 분자에만 √5+√2를 곱한 풀이가 왜 틀렸는지 설명하고 올바른 결과를 구하시오.", "(√5+√2)/3",
      ["분자에만 수를 곱하면 분수의 값이 바뀜을 지적한다.", "분자와 분모에 모두 √5+√2를 곱한다.", "분모는 5-2=3이다.", "결과는 (√5+√2)/3이다.", "새 식에 원래 분모를 곱해 1이 되는지 확인한다."],
      ["분수의 값을 보존하려면 무엇을 분자와 분모에 함께 곱해야 하는지 생각한다.", "분모에는 켤레의 곱인 두 제곱의 차를 사용한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["RATIONALIZE_NUMERATOR_ONLY"], structureFamily: "diagnose-value-changing-rationalization", writtenRubric: { requiredIdeas: ["분자·분모에 함께 곱함", "켤레", "분모 3", "최종식"], minimumEvidence: 4 } }),
  ]);

  const REWRITTEN_SPECS = Object.freeze([
    // 독립 사람 감사에서 재작성 판정을 받은 A3 9문항
    q("m3_sqrt_meaning", "A3", "shifted-absolute-condition", "EXPRESSION_INPUT", "실수 x가 √((x+2)²)+√((x-5)²)=9와 x<0을 만족할 때 √((x-1)²)의 값을 구하시오.", "4",
      ["주어진 식을 |x+2|+|x-5|=9로 바꾼다.", "경계 -2와 5로 구간을 나누면 x<-2에서 x=-3, -2≤x≤5에서는 왼쪽이 7이라 해가 없고, x>5에서 x=6을 얻는다.", "추가 조건 x<0으로 x=-3만 남긴다.", "√((x-1)²)=|x-1|=|-4|=4이다.", "x=-3을 원래 두 조건에 대입해 1+8=9이고 x<0임을 확인한다."],
      ["두 절댓값의 경계 -2,5를 기준으로 가능한 x 후보를 모두 구한다.", "추가 부호 조건으로 후보를 고른 뒤 마지막 근호를 절댓값으로 계산한다."],
      { misconceptionTags: ["ABSOLUTE_EQUATION_INTERVAL_FILTER"], structureFamily: "two-center-distance-candidates-sign-filter", difficultyEvidence: ["세 구간 분류·두 후보 생성·추가 조건 필터·원식 검산"] }),
    q("m3_sqrt_meaning", "A3", "absolute-equation-set", "SHORT_ANSWER", "a<0<b, a²=4b², a+b=-6일 때 b의 값을 구하시오.", "6",
      ["a²=4b²에서 |a|=2|b|이다.", "a<0<b이므로 -a=2b, 즉 a=-2b이다.", "a+b=-6에 대입하면 -b=-6이다.", "b=6, a=-12가 세 조건을 모두 만족하는지 확인한다."],
      ["제곱식에서 바로 a=2b라고 단정하지 말고 부호 조건을 함께 본다.", "a를 b로 나타낸 뒤 합 조건에 대입한다."],
      { independentCheck: true, misconceptionTags: ["SQUARE_RELATION_SIGN_FILTER"], structureFamily: "signed-square-ratio-with-sum", difficultyEvidence: ["제곱 관계·반대 부호·합 조건을 순서대로 연결"] }),
    q("m3_sqrt_value", "A3", "fraction-radical-equation", "SHORT_ANSWER", "a>0이고 √(a/4)+√(a/9)=5일 때 a의 값을 구하시오.", "36",
      ["a>0이므로 √(a/4)=√a/2, √(a/9)=√a/3이다.", "두 항을 더해 5√a/6=5를 얻는다.", "√a=6이므로 a=36이다.", "√(36/4)+√(36/9)=3+2=5로 검산한다."],
      ["두 근호를 같은 √a의 배수로 표현한다.", "분수 계수를 먼저 더한 뒤 √a를 구한다."],
      { misconceptionTags: ["FRACTIONAL_RADICAL_LINK"], structureFamily: "two-fraction-root-equation", difficultyEvidence: ["서로 다른 두 분수 근호를 공통 표현으로 통합"] }),
    q("m3_irrational_number", "A3", "conjugate-product-classify", "EXPRESSION_INPUT", "자연수 a<b에 대하여 x=√12-a√3, y=b√3-√27이다. x와 y가 각각 무리수이고 x+y는 유리수이며 a+b=7일 때 x-y를 간단히 하시오.", "-2√3",
      ["√12=2√3, √27=3√3이므로 x=(2-a)√3, y=(b-3)√3이다.", "x+y=(b-a-1)√3이 유리수이므로 정수 계수 b-a-1은 0이다.", "b=a+1과 a+b=7을 연립해 a=3, b=4를 얻는다.", "이때 x=-√3, y=√3으로 두 수가 각각 무리수라는 조건도 만족한다.", "따라서 x-y=-2√3이다."],
      ["두 근호를 같은 √3의 배수로 바꾸고 x+y의 근호 계수를 조사한다.", "x+y가 유리수가 되려면 b-a-1이 어떤 값이어야 하는지 a+b=7과 연결한다."],
      { misconceptionTags: ["RATIONAL_SUM_COEFFICIENT_REVERSE"], structureFamily: "two-irrational-values-rational-sum-recovery", difficultyEvidence: ["두 무리수 조건·근호 계수 소거·자연수 연립·최종 식 검산"] }),
    q("m3_irrational_number", "A3", "another-conjugate-difference", "SHORT_ANSWER", "자연수 n에 대하여 √n-√12가 유리수일 때 n을 구하시오.", "12",
      ["√n-√12=r인 유리수 r로 둔다.", "√12=2√3이므로 √n=r+2√3이고, 양변을 제곱하면 n=r²+12+4r√3이다.", "n과 r²+12가 유리수이므로 r≠0이면 4r√3이 무리수가 되어 모순이다.", "따라서 r=0이고 n=12이다.", "실제로 √12-√12=0은 유리수이므로 조건을 만족한다."],
      ["주어진 유리수 차를 r로 놓고 √n을 r과 √3으로 표현한다.", "그 식을 제곱했을 때 남는 무리수 항의 계수가 0이어야 함을 이용한다."],
      { misconceptionTags: ["RATIONAL_DIFFERENCE_REVERSE_RADICAND"], structureFamily: "rational-radical-difference-forces-equality", difficultyEvidence: ["유리수 매개변수 설정·제곱 표현 전환·무리수 항 모순·역검산"] }),
    q("m3_irrational_number", "A3", "combine-like-irrationals", "MULTIPLE_CHOICE", "x=√3+√2일 때 다음 중 유리수인 것은?", "x²+1/x²",
      ["x(√3-√2)=1이므로 1/x=√3-√2이다.", "x²은 5+2√6으로 무리수이다.", "x+1/x=2√3, x-1/x=2√2로 둘 다 무리수이다.", "x²+1/x²=(x+1/x)²-2=10이므로 유리수이다."],
      ["x의 켤레와 곱이 1임을 먼저 확인한다.", "각 선택지를 모두 전개하지 말고 x와 1/x의 합·차를 이용한다."],
      { choices: ["x²", "x+1/x", "x-1/x", "x²+1/x²"], answerContract: "TEXT_NORMALIZED", misconceptionTags: ["RATIONALITY_OF_SYMMETRIC_EXPRESSION"], structureFamily: "select-rational-symmetric-form", difficultyEvidence: ["네 표현의 무리수 항 소거 여부를 전략적으로 비교"] }),
    q("m3_irrational_number", "A3", "conjugate-mixed-roots", "SHORT_ANSWER", "1≤n≤15인 자연수 n 중 √(3n)은 자연수이고 √n은 무리수인 n의 개수를 구하시오.", "2",
      ["√(3n)이 자연수이면 3n=k²이다.", "k²이 3의 배수이므로 k=3t이고 n=3t²이다.", "n≤15에서 t=1,2이므로 n=3,12이다.", "두 n은 완전제곱수가 아니어서 √n이 무리수이므로 개수는 2이다."],
      ["3n이 완전제곱수가 되게 하는 k의 3의 배수 조건을 찾는다.", "후보를 만든 뒤 √n의 무리수 조건을 별도로 확인한다."],
      { independentCheck: true, misconceptionTags: ["SCALED_SQUARE_AND_IRRATIONAL_FILTER"], structureFamily: "scaled-square-count-with-classification", difficultyEvidence: ["후보 생성·범위 필터·무리수 검증을 연결"] }),
    q("m3_radical_simplification", "A3", "recover-radicand-parameter", "SHORT_ANSWER", "1≤n≤30인 자연수 n 중 √(12n)을 가장 간단히 했을 때 근호 밖의 계수가 6이고 근호 안의 수가 1보다 큰 n을 모두 쓰시오.", "6,9,15,18,21,30",
      ["√(12n)=6√d이면 12n=36d, 즉 n=3d이다.", "가장 간단한 꼴이므로 d는 1보다 큰 제곱 인수가 없는 수이다.", "d≤10에서 가능한 d는 2,3,5,6,7,10이다.", "n=3d로 바꾸면 6,9,15,18,21,30이고 각 식을 다시 간소화해 확인한다."],
      ["근호 밖 계수 6을 다시 제곱해 근호 안으로 넣는다.", "남은 근호 안의 수에는 1보다 큰 완전제곱 인수가 없어야 한다."],
      { answerContract: "SOLUTION_SET", misconceptionTags: ["NORMAL_FORM_COEFFICIENT_FILTER"], structureFamily: "bounded-normal-form-coefficient-set", difficultyEvidence: ["역정규화·제곱 인수 배제·범위 후보 검산"] }),
    q("m3_radical_simplification", "A3", "coefficient-identification", "SHORT_ANSWER", "20<n<100인 자연수 n 중 √n을 가장 간단히 하면 a√6(a는 자연수)이고 n이 12의 배수인 모든 n의 합을 구하시오.", "120",
      ["√n=a√6이면 n=6a²이다.", "20<6a²<100에서 a=2,3,4이다.", "후보 n은 24,54,96이다.", "12의 배수 조건으로 24와 96만 남아 합은 120이다."],
      ["가장 간단한 꼴을 제곱해 n의 일반형을 만든다.", "범위 후보를 만든 다음 12의 배수 조건을 마지막에 적용한다."],
      { independentCheck: true, misconceptionTags: ["REVERSE_NORMAL_FORM_DIVISIBILITY"], structureFamily: "normal-form-range-divisibility-sum", difficultyEvidence: ["정규형 역추론·범위 생성·배수 필터를 순차 적용"] }),

    // 독립 사람 감사에서 재작성 판정을 받은 A4 16문항
    q("m3_sqrt_meaning", "A4", "hidden-sign-reverse", "SHORT_ANSWER", "a<b, a+b=4, √(a²)+√(b²)=10일 때 ab의 값을 구하시오.", "-21",
      ["두 수가 모두 양수이면 절댓값의 합이 4이므로 조건과 맞지 않고, 둘 다 음수일 수도 없다.", "따라서 a<0<b이다.", "근호식은 -a+b=10이 된다.", "a+b=4와 연립해 a=-3, b=7이므로 ab=-21이다.", "순서와 두 원래 식을 모두 검산한다."],
      ["대수합과 절댓값의 합이 다른 이유를 부호 경우로 분석한다.", "가능한 부호 경우에서 두 식을 연립한다."],
      { misconceptionTags: ["HIDDEN_MIXED_SIGN_FROM_TWO_SUMS"], structureFamily: "infer-signs-from-sum-and-absolute-sum", difficultyEvidence: ["부호 경우 배제·표현 변환·연립·검산"] }),
    q("m3_sqrt_meaning", "A4", "translated-absolute-equation", "SHORT_ANSWER", "√((x-2)²)+√((x+4)²)=10을 만족하는 실수 x를 모두 쓰시오.", "-6,4",
      ["식을 |x-2|+|x+4|=10으로 바꾼다.", "경계 -4와 2를 기준으로 세 구간을 나눈다.", "x≥2에서는 2x+2=10이므로 x=4이다.", "-4≤x<2에서는 왼쪽이 항상 6이어서 해가 없고, x<-4에서는 -2x-2=10이므로 x=-6이다.", "두 값을 원래 식에 대입해 확인한다."],
      ["두 절댓값 안의 식이 0이 되는 두 경계를 먼저 찾는다.", "세 구간마다 절댓값을 다르게 풀고 구간 조건까지 검산한다."],
      { answerContract: "SOLUTION_SET", misconceptionTags: ["MISS_MIDDLE_CONSTANT_INTERVAL"], structureFamily: "two-center-absolute-distance-cases", difficultyEvidence: ["두 경계에 따른 세 경우 분류와 해의 구간 검증"] }),
    q("m3_sqrt_meaning", "A4", "count-perfect-squares-in-range", "SHORT_ANSWER", "1≤n≤100인 자연수 n 중 n과 n+45가 모두 완전제곱수인 n의 개수를 구하시오.", "2",
      ["n=a², n+45=b²(a<b)로 두면 (b-a)(b+a)=45이다.", "45의 양의 홀수 인수쌍 (1,45), (3,15), (5,9)를 조사한다.", "각각 a=22,6,2이므로 n=484,36,4이다.", "범위 조건으로 n=36,4만 남아 개수는 2이다."],
      ["두 완전제곱수의 차를 인수분해해 인수쌍 문제로 바꾼다.", "모든 인수쌍에서 a를 복원한 뒤 n의 범위를 적용한다."],
      { misconceptionTags: ["INCOMPLETE_FACTOR_PAIR_ENUMERATION"], structureFamily: "square-gap-factor-pair-count", difficultyEvidence: ["역추론·인수쌍 경우 분류·범위 필터"] }),
    q("m3_sqrt_meaning", "A4", "ordered-negative-variables", "SHORT_ANSWER", "a<b<0, a²-b²=45, √(a²)+√(b²)=15일 때 a-b의 값을 구하시오.", "-3",
      ["A=-a, B=-b로 두면 A>B>0이다.", "A+B=15이고 A²-B²=45이다.", "(A-B)(A+B)=45이므로 A-B=3이다.", "a-b=-A+B=-(A-B)=-3이다.", "부호와 원래 두 조건을 검산한다."],
      ["음수 두 수를 양의 절댓값 A,B로 바꾸고 순서가 어떻게 바뀌는지 본다.", "제곱의 차와 주어진 절댓값의 합을 연결한다."],
      { independentCheck: true, misconceptionTags: ["ORDER_REVERSAL_UNDER_ABSOLUTE"], structureFamily: "negative-order-square-gap", difficultyEvidence: ["순서 반전·제곱의 차 역추론·부호 복원"] }),
    q("m3_sqrt_value", "A4", "twice-natural-perfect-square", "SHORT_ANSWER", "1≤n≤100인 자연수 n 중 √(2n)과 √(3n)이 모두 자연수인 n의 개수를 구하시오.", "0",
      ["√(2n)=a, √(3n)=b인 자연수 a,b가 있다고 가정한다.", "2n=a², 3n=b²이므로 3a²=2b²이다.", "왼쪽에서 소인수 2의 지수는 짝수지만 오른쪽에서는 홀수여야 해 모순이다.", "따라서 범위와 관계없이 가능한 n이 없어 개수는 0이다."],
      ["두 제곱 조건을 같은 n을 이용해 하나의 등식으로 연결한다.", "소인수 2 또는 3의 지수의 홀짝을 양변에서 비교한다."],
      { misconceptionTags: ["INCOMPATIBLE_SQUARE_PARITIES"], structureFamily: "simultaneous-scaled-square-impossibility", difficultyEvidence: ["동시 조건 결합·소인수 지수 모순·존재성 검증"] }),
    q("m3_sqrt_value", "A4", "reciprocal-root-condition", "EXPRESSION_INPUT", "0<t<1이고 t+1/t=2√3일 때 t를 구하시오.", "√3-√2",
      ["0<t<1이므로 1/t-t>0이다.", "(1/t-t)²=(t+1/t)²-4=8이므로 1/t-t=2√2이다.", "합과 차를 더해 2/t=2√3+2√2, 즉 1/t=√3+√2를 얻는다.", "켤레를 이용하면 t=√3-√2이고 범위와 원래 합을 만족한다."],
      ["이차방정식을 만들지 말고 합에서 곱 1을 이용한 차의 제곱을 구한다.", "범위 조건으로 차의 부호를 정한 뒤 합과 차를 연립한다."],
      { answerContract: "RECIPROCAL_RADICAL_PAIR_NORMALIZED", misconceptionTags: ["RECIPROCAL_RANGE_SIGN"], structureFamily: "reciprocal-sum-to-difference-with-range", difficultyEvidence: ["표현 변환·숨은 차 계산·범위 부호 선택·유리화"] }),
    q("m3_sqrt_value", "A4", "sum-and-gap-perfect-roots", "SHORT_ANSWER", "20<n<100이고 √(2n)이 자연수인 자연수 n에 대하여 √n의 정수 부분을 k라 하자. √(2n)-k가 소수인 n 중 가장 작은 n을 구하시오.", "32",
      ["√(2n)=q인 자연수 q로 두면 q²=2n은 짝수이므로 q=2t이고 n=2t²이다.", "20<2t²<100에서 가능한 자연수 t는 4,5,6,7이다.", "각각 (n,k,√(2n)-k)는 (32,5,3), (50,7,3), (72,8,4), (98,9,5)이다.", "마지막 값이 소수인 후보는 n=32,50,98이다.", "이 중 가장 작은 n은 32이고 모든 원래 조건을 만족한다."],
      ["√(2n)을 자연수 q로 놓고 q의 짝홀을 이용해 n=2t² 꼴의 후보를 만든다.", "범위에서 얻은 각 후보의 √n 정수 부분을 구해 √(2n)-k가 소수인지 비교한다."],
      { independentCheck: true, misconceptionTags: ["SCALED_SQUARE_INTEGER_PART_PRIME_FILTER"], structureFamily: "scaled-square-candidates-integer-part-prime-minimum", difficultyEvidence: ["다중 후보 생성·정수 부분 표현 변환·소수 조건 분류·최소성 판단"] }),
    q("m3_irrational_number", "A4", "subtract-unlike-before-simplify", "SHORT_ANSWER", "(√3+√2)/(√3-√2)=a+b√6이고 a,b가 유리수일 때 a+b를 구하시오.", "7",
      ["분모의 켤레 √3+√2를 분자와 분모에 곱한다.", "분모는 3-2=1이고 분자는 (√3+√2)²=5+2√6이다.", "무리수의 표현이 유일하므로 a=5, b=2이다.", "따라서 a+b=7이고 원래 분수와 곱해 검산한다."],
      ["분모의 차가 1이 되는 켤레 구조를 찾는다.", "정리한 식에서 유리수 부분과 √6의 계수를 각각 비교한다."],
      { misconceptionTags: ["COEFFICIENT_IDENTIFICATION_AFTER_RATIONALIZATION"], structureFamily: "rationalized-coefficient-recovery", difficultyEvidence: ["유리화·표현 변환·계수의 유일성 활용"] }),
    q("m3_irrational_number", "A4", "count-scaled-rational-roots", "WRITTEN_RESPONSE", "유리수 a,b에 대하여 a+b√2=0이면 a=b=0임을 설명하시오.", "a=b=0",
      ["b≠0이라고 가정하면 √2=-a/b가 되어 √2가 유리수라는 모순이 생긴다.", "따라서 b=0이다.", "원래 식에 대입하면 a=0이다.", "반대로 a=b=0이면 식이 성립하므로 결론을 확인한다."],
      ["b가 0이 아니라고 가정했을 때 √2를 유리수의 비로 나타낼 수 있는지 본다.", "모순으로 b를 결정한 뒤 원래 식에서 a를 결정한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["IRRATIONAL_COEFFICIENT_INDEPENDENCE"], structureFamily: "rational-coefficient-zero-proof", difficultyEvidence: ["가정·무리수 모순·역방향 확인"], writtenRubric: { requiredIdeas: ["b≠0 가정", "√2=-a/b", "무리수 모순", "a=b=0"], minimumEvidence: 4 } }),
    q("m3_irrational_number", "A4", "irrational-square-sum", "SHORT_ANSWER", "√2+√7과 √3+√6의 대소 관계를 부등호로 나타내시오.", "√2+√7<√3+√6",
      ["두 수는 모두 양수이므로 제곱한 값을 비교해도 대소가 보존된다.", "(√2+√7)²=9+2√14이다.", "(√3+√6)²=9+2√18이다.", "√14<√18이므로 √2+√7<√3+√6이다.", "소수 근삿값을 쓰지 않고 제곱 비교만으로 결론을 확인한다."],
      ["두 양수의 합을 직접 근삿값으로 계산하지 말고 제곱해 공통 부분을 찾는다.", "제곱한 두 식에서 같은 유리수 부분을 지우고 남은 근호를 비교한다."],
      { answerContract: "TEXT_NORMALIZED", acceptedAnswers: ["√3+√6>√2+√7"], misconceptionTags: ["COMPARE_IRRATIONAL_SUMS_BY_SQUARING"], structureFamily: "positive-radical-sum-order-via-squares", difficultyEvidence: ["양수 조건 확인·표현 제곱·공통항 소거·근호 대소 비교"] }),
    q("m3_radical_simplification", "A4", "least-divisor-for-square-quotient", "SHORT_ANSWER", "자연수 n이 540의 약수이고 √(540/n)과 √(15n)이 모두 자연수일 때 가장 작은 n을 구하시오.", "15",
      ["540=2²×3³×5, 15=3×5로 소인수분해한다.", "540/n이 제곱수가 되려면 n에서 2의 지수는 짝수, 3과 5의 지수는 홀수여야 한다.", "15n이 제곱수라는 조건도 같은 지수 홀짝 조건을 준다.", "가장 작은 지수 선택은 n=3×5=15이다.", "540/15=36, 15×15=225로 두 조건을 검산한다."],
      ["n의 지수를 임의로 찾기보다 두 제곱 조건이 요구하는 지수의 홀짝을 나란히 적는다.", "공통 조건을 만족하는 가장 작은 지수를 선택한 뒤 n이 540의 약수인지 확인한다."],
      { misconceptionTags: ["MINIMUM_UNDER_PRODUCT_AND_QUOTIENT"], structureFamily: "divisor-parity-intersection-minimum", difficultyEvidence: ["곱·몫의 두 지수 조건 교차와 최소성 판단"] }),
    q("m3_radical_simplification", "A4", "parameter-hidden-in-normal-form", "SHORT_ANSWER", "세 수의 최대공약수가 1인 자연수 a,b,c(즉, gcd(a,b,c)=1)가 a√12=b√27=c√48을 만족할 때 a+b+c를 구하시오.", "13",
      ["각 근호를 간단히 해 2a√3=3b√3=4c√3을 얻는다.", "공통 계수를 L이라 하면 L은 2,3,4의 공배수이므로 L=12t인 자연수 t로 둘 수 있다.", "따라서 a=6t, b=4t, c=3t이다.", "gcd(6t,4t,3t)=t이고 gcd(a,b,c)=1이므로 t=1이다.", "a=6, b=4, c=3이고 합은 13이며 세 원래 식의 값은 모두 12√3이다."],
      ["세 근호를 모두 같은 √3 꼴로 만든 뒤 공통 계수를 2,3,4의 공배수로 나타낸다.", "a,b,c의 일반형에서 세 수 전체의 최대공약수가 정확히 1이라는 조건을 적용한다."],
      { misconceptionTags: ["GLOBAL_GCD_THREE_NORMAL_FORMS"], structureFamily: "triple-coefficient-global-gcd-recovery", difficultyEvidence: ["세 표현 통합·공배수 매개변수화·전체 최대공약수 역추론·유일성 검증"] }),
    q("m3_radical_simplification", "A4", "reverse-normal-form-process", "SHORT_ANSWER", "자연수 n에 대하여 √(12n)=a√c, √(27n)=b√c가 각각 가장 간단한 꼴이고 a,b,c는 자연수이며 c>1이다. a+b+c=25를 만족하는 n 중 가장 작은 것을 구하시오.", "20",
      ["두 식의 비에서 b/a=√(27/12)=3/2이므로 a=2t, b=3t인 자연수 t로 둘 수 있다.", "a+b+c=25에서 c=25-5t이고 c>1이므로 t=1,2,3,4를 조사한다.", "가장 간단한 꼴이려면 c에 1보다 큰 제곱 인수가 없어야 하므로 t=1의 c=20은 제외된다.", "t=2이면 (a,b,c)=(4,6,15), n=a²c/12=20이고, t=3이면 (6,9,10), n=30이다. t=4이면 n=80/3으로 자연수가 아니다.", "가능한 n은 20,30이고 가장 작은 값 20은 √240=4√15, √540=6√15로 모든 조건을 만족한다."],
      ["두 가장 간단한 근호식의 비를 이용해 a와 b의 비를 먼저 정한다.", "a=2t, b=3t로 놓고 c의 제곱 인수 여부와 복원한 n의 자연수 조건을 모두 검사한다."],
      { misconceptionTags: ["TWO_NORMAL_FORMS_RATIO_MINIMUM"], structureFamily: "paired-normal-forms-ratio-squarefree-minimum", difficultyEvidence: ["서로 다른 두 정규형 비교·비례 역추론·후보 경우 분류·최간단성 및 최소성 검증"] }),
    q("m3_radical_simplification", "A4", "quotient-after-simplification", "SHORT_ANSWER", "1≤n<30인 자연수 n 중 (√n+√12)/√3이 유리수인 n을 모두 쓰시오.", "3,12,27",
      ["식을 √(n/3)+2로 바꾼다.", "전체가 유리수가 되려면 √(n/3)이 유리수여야 한다.", "자연수 n에서는 n=3k² 꼴이어야 한다.", "n<30에서 k=1,2,3이므로 n=3,12,27이다.", "각 값을 원래 식에 넣어 유리수가 되는지 확인한다."],
      ["√12/√3을 먼저 정리해 어떤 항만 검사하면 되는지 찾는다.", "n의 일반형을 만든 뒤 범위로 k를 제한한다."],
      { answerContract: "SOLUTION_SET", independentCheck: true, misconceptionTags: ["RATIONAL_QUOTIENT_PARAMETER_SET"], structureFamily: "rationality-condition-to-bounded-set", difficultyEvidence: ["표현 변환·유리수 조건 역추론·범위 후보 검산"] }),
    q("m3_radical_operations", "A4", "difference-of-reciprocals", "EXPRESSION_INPUT", "(√5+√3)/(√5-√3)-(√5-√3)/(√5+√3)을 간단히 하시오.", "2√15",
      ["A=√5+√3, B=√5-√3으로 두면 식은 A/B-B/A이다.", "공통분모로 묶으면 (A²-B²)/(AB)이다.", "A²-B²=(A-B)(A+B)=4√15이고 AB=2이다.", "따라서 값은 2√15이며 직접 유리화한 결과와 비교한다."],
      ["두 분수를 각각 유리화하기보다 두 켤레를 A,B로 놓고 한 번에 합친다.", "분자의 제곱의 차와 분모의 켤레 곱을 따로 계산한다."],
      { misconceptionTags: ["GLOBAL_COMBINATION_BEFORE_RATIONALIZATION"], structureFamily: "quotient-difference-via-conjugate-pair", difficultyEvidence: ["전략 선택·통분 구조 변환·두 합차 공식 연결"] }),
    q("m3_radical_operations", "A4", "difference-denominator-rationalize", "SHORT_ANSWER", "정수 a,b가 a-b=4이고 (√2+√3)(a√2+b√3)이 유리수일 때 그 곱의 값을 구하시오.", "-2",
      ["곱을 전개하면 2a+3b+(a+b)√6이다.", "값이 유리수이므로 √6의 계수 a+b=0이다.", "a-b=4와 연립해 a=2, b=-2를 얻는다.", "유리수 부분 2a+3b=4-6=-2이다.", "원래 곱에서 무리수 항이 소거되는지 확인한다."],
      ["곱을 유리수 부분과 √6 부분으로 분리한다.", "유리수가 되려면 √6의 계수가 0이어야 한다는 조건과 a-b=4를 함께 사용한다."],
      { independentCheck: true, misconceptionTags: ["RATIONALITY_COEFFICIENT_CANCELLATION"], structureFamily: "integer-parameter-radical-cancellation", difficultyEvidence: ["표현 전환·숨은 계수 조건·정수 연립·소거 검증"] }),

    // 독립 사람 감사에서 재작성 판정을 받은 A5 16문항
    q("m3_sqrt_meaning", "A5", "sign-case-system-process", "WRITTEN_RESPONSE", "모든 실수 a,b에 대하여 √((a+b)²)=√(a²)+√(b²)가 성립할 필요충분조건을 구하고 두 방향을 증명하시오.", "ab≥0",
      ["식을 |a+b|=|a|+|b|로 바꾼다.", "등식이 성립한다고 가정하고 양변을 제곱하면 ab=|ab|이므로 ab≥0이다.", "반대로 ab≥0이면 a,b는 같은 부호이거나 하나가 0이다.", "각 부호 경우에서 |a+b|=|a|+|b|가 성립함을 확인한다.", "따라서 필요충분조건은 ab≥0이다."],
      ["절댓값 등식으로 바꾼 뒤 양변을 제곱하면 어떤 교차항 조건이 생기는지 본다.", "필요성만 보이지 말고 ab≥0일 때의 부호 경우로 충분성도 확인한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["NECESSARY_SUFFICIENT_ABSOLUTE_SUM"], structureFamily: "absolute-sum-iff-proof", difficultyEvidence: ["필요조건 역추론·부호 경우 분류·충분조건 증명"], writtenRubric: { requiredIdeas: ["절댓값 변환", "ab=|ab|", "ab≥0", "필요성", "충분성"], minimumEvidence: 5 } }),
    q("m3_sqrt_meaning", "A5", "explain-absolute-necessity", "WRITTEN_RESPONSE", "두 등식 √((a-b)²)=a-b, √((a+b)²)=a+b가 동시에 성립할 필요충분조건을 구하고 증명하시오.", "a≥|b|",
      ["첫 등식은 a-b≥0일 때, 둘째 등식은 a+b≥0일 때 성립한다.", "두 조건은 a≥b, a≥-b이다.", "따라서 a≥max(b,-b)=|b|가 필요하다.", "반대로 a≥|b|이면 a-b와 a+b가 모두 음이 아니므로 두 등식이 성립한다.", "경계 a=|b|에서도 확인한다."],
      ["각 근호식이 안의 일차식과 같아지려면 그 일차식의 부호가 어떠해야 하는지 본다.", "두 부등식을 하나의 절댓값 조건으로 합치고 역방향도 확인한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["SIMULTANEOUS_PRINCIPAL_ROOT_CONDITIONS"], structureFamily: "two-root-identities-iff-region", difficultyEvidence: ["두 숨은 부호 조건의 교집합과 필요충분성 증명"], writtenRubric: { requiredIdeas: ["a-b≥0", "a+b≥0", "a≥|b|", "역방향 확인"], minimumEvidence: 4 } }),
    q("m3_sqrt_meaning", "A5", "opposite-equal-squares", "SHORT_ANSWER", "a<b<0<c, a+b+c=0, √(a²)+√(b²)+√(c²)=12, a²+b²=20일 때 ab를 구하시오.", "8",
      ["부호 조건에서 근호의 합은 -a-b+c이다.", "a+b=-c이므로 근호의 합은 2c=12, 따라서 c=6이다.", "a+b=-6이다.", "(a+b)²=a²+b²+2ab에 대입해 36=20+2ab를 얻는다.", "ab=8이고 실제 a,b=-4,-2가 순서와 모든 조건을 만족한다."],
      ["절댓값의 합과 a+b+c=0을 함께 써서 c부터 결정한다.", "a와 b를 각각 구하지 말고 합의 제곱으로 곱 ab를 직접 구한다."],
      { misconceptionTags: ["MULTI_CONDITION_ABSOLUTE_SYMMETRY"], structureFamily: "three-signs-absolute-sum-product-recovery", difficultyEvidence: ["부호 해석·조건 압축·대칭식 전략·존재 검증"] }),
    q("m3_sqrt_meaning", "A5", "reject-radical-addition-law", "WRITTEN_RESPONSE", "실수 p에 대하여 방정식 √(x²)=x+p의 실근 개수를 p<0, p=0, p>0으로 나누어 설명하시오.", "p<0이면 0개, p=0이면 무한히 많고, p>0이면 1개",
      ["식을 |x|=x+p로 바꾼다.", "x≥0에서는 x=x+p이므로 p=0일 때 모든 x≥0이 해이다.", "x<0에서는 -x=x+p이므로 x=-p/2이고, 이 값이 음수이려면 p>0이다.", "따라서 p<0이면 해가 없고 p=0이면 무한히 많으며 p>0이면 음수 해 하나이다.", "각 경우의 해를 원래 근호식에 대입해 확인한다."],
      ["x의 부호에 따라 |x|를 두 경우로 나눈다.", "각 식에서 얻은 후보가 해당 부호 구간에 실제로 속하는지 p의 부호로 검증한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["PARAMETER_ABSOLUTE_EQUATION_ROOT_COUNT"], structureFamily: "parameterized-root-count-by-sign-cases", difficultyEvidence: ["매개변수·두 경우 분류·후보 구간 검증·일반화"], writtenRubric: { requiredIdeas: ["|x| 변환", "x≥0 경우", "x<0 경우", "p 세 구간", "해 개수"], minimumEvidence: 5 } }),
    q("m3_sqrt_value", "A5", "scaled-root-equation-process", "SHORT_ANSWER", "자연수 n에 대하여 a=√(n/18), b=√((n+1280)/8)가 모두 자연수이고 a+b가 3의 배수이다. 이런 n 중 가장 작은 값을 구하시오.", "72",
      ["두 자연수 조건에서 n=18a², n+1280=8b²이므로 4b²-9a²=640이다.", "제곱의 차로 바꾸면 (2b-3a)(2b+3a)=640이다.", "두 양의 인수를 u<v라 하면 a=(v-u)/6, b=(u+v)/4이므로 640의 인수쌍 중 두 값이 모두 자연수가 되는 경우만 조사한다.", "가능한 (u,v;a,b;n)은 (4,160;26,41;12168), (8,80;12,22;2592), (16,40;4,14;288), (20,32;2,13;72)이다.", "이 중 a+b가 3의 배수인 후보는 n=288과 n=72이고, 가장 작은 값은 72이다.", "n=72에서 a=2, b=13, a+b=15이며 두 근호 조건을 만족한다. 인수쌍을 전부 조사했으므로 더 작은 후보는 없다."],
      ["두 근호 자연수 조건을 각각 제곱해 같은 n을 소거하고 제곱의 차로 인수분해한다.", "640의 인수쌍에서 a,b가 자연수인 경우를 빠짐없이 만든 뒤 합의 배수 조건과 최소성을 확인한다."],
      { misconceptionTags: ["INDEPENDENT_RADICAL_CONDITIONS_FACTOR_PAIR_MINIMUM"], structureFamily: "independent-shifted-radicals-factor-pairs-minimum", difficultyEvidence: ["독립된 두 근호 조건 결합·제곱의 차 전략 선택·인수쌍 완전 분류·합 조건 필터·최소성 증명"] }),
    q("m3_sqrt_value", "A5", "decimal-root-sign-explanation", "WRITTEN_RESPONSE", "서로소인 자연수 p,q에 대하여 √(p/q)가 유리수일 필요충분조건이 p와 q가 각각 완전제곱수인 것임을 설명하시오.", "p와 q가 각각 완전제곱수",
      ["√(p/q)=r/s를 서로소인 자연수 r,s로 나타낼 수 있다고 가정한다.", "p/q=r²/s²이고 두 분수가 모두 기약분수이므로 p=r², q=s²이다.", "또는 소인수 지수의 유일성으로 p와 q의 모든 지수가 짝수임을 보인다.", "반대로 p=u², q=v²이면 √(p/q)=u/v로 유리수이다.", "따라서 두 조건은 필요충분하다."],
      ["유리수라고 가정해 가장 간단한 분수 r/s의 제곱과 비교한다.", "필요성뿐 아니라 p,q가 제곱수일 때의 충분성도 확인한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["RATIONAL_SQUARE_ROOT_OF_REDUCED_FRACTION"], structureFamily: "reduced-fraction-square-iff-proof", difficultyEvidence: ["기약성·소인수 지수·양방향 일반 증명"], writtenRubric: { requiredIdeas: ["기약분수", "제곱 비교", "p와 q의 완전제곱", "필요성", "충분성"], minimumEvidence: 5 } }),
    q("m3_sqrt_value", "A5", "perfect-square-sum-condition", "SHORT_ANSWER", "자연수 n에 대하여 a=√n, b=√(176400/n)가 모두 자연수이고 gcd(a,b)=2이며 40<a+b<60이다. 가능한 모든 n의 합을 구하시오.", "2960",
      ["두 근호 조건을 곱하면 ab=√176400=420이다.", "gcd(a,b)=2이므로 a=2r, b=2s, gcd(r,s)=1로 두면 rs=105=3×5×7이다.", "서로소인 r,s는 각 소인수 전체를 어느 한쪽에 배분해야 하므로 순서를 제외한 후보는 (1,105),(3,35),(5,21),(7,15)뿐이다.", "40<a+b=2(r+s)<60을 만족하는 순서 없는 쌍은 (5,21),(7,15)이고, 순서를 고려하면 (a,b)=(10,42),(42,10),(14,30),(30,14)이다.", "n=a²으로 복원하면 100,1764,196,900이고 각각 두 근호, 최대공약수, 범위를 만족한다.", "가능한 모든 n의 합은 100+1764+196+900=2960이며 서로소 인수 배분을 모두 분류했으므로 누락이 없다."],
      ["두 근호를 곱해 ab를 고정한 뒤 최대공약수 2를 먼저 떼어 서로소인 두 수의 곱으로 바꾼다.", "105의 서로 다른 소인수를 두 수에 배분하고 합의 범위로 거른 뒤, 순서를 되살려 n=a²을 모두 복원한다."],
      { misconceptionTags: ["ORDERED_COPRIME_FACTOR_ALLOCATION_AND_RESTORE"], structureFamily: "coprime-prime-allocation-range-ordered-restore", difficultyEvidence: ["두 근호 조건 통합·최대공약수 역추론·소인수 배분 전략·범위 분류·순서 복원·전 경우 검산"] }),
    q("m3_sqrt_value", "A5", "difference-of-square-roots-strategy", "WRITTEN_RESPONSE", "자연수 m,n에 대하여 √m+√n이 정수이면 √m과 √n이 각각 자연수임을 증명하시오.", "√m과 √n은 각각 자연수",
      ["√m+√n=k인 양의 정수 k로 둔다.", "√n=k-√m를 제곱하면 n=k²+m-2k√m이다.", "따라서 √m=(k²+m-n)/(2k)로 유리수이다.", "자연수의 제곱근이 유리수이면 그 자연수는 완전제곱수이므로 √m은 자연수이고 √n=k-√m도 자연수이다.", "두 근이 자연수이면 합이 정수라는 역방향도 확인한다."],
      ["합을 정수 k로 놓고 한 근호를 다른 쪽으로 옮겨 제곱한다.", "자연수의 제곱근이 유리수일 때 왜 자연수인지 연결한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["INTEGER_SUM_FORCES_INTEGER_ROOTS"], structureFamily: "integer-radical-sum-proof", difficultyEvidence: ["표현 격리·유리성 역추론·완전제곱 일반화·역방향 확인"], writtenRubric: { requiredIdeas: ["합을 k로 둠", "한 근호 격리", "√m의 유리성", "완전제곱", "두 근 자연수"], minimumEvidence: 5 } }),
    q("m3_irrational_number", "A5", "square-conjugate-cancellation-process", "WRITTEN_RESPONSE", "자연수 m,n에 대하여 (√m+√n)²이 유리수일 필요충분조건이 mn이 완전제곱수인 것임을 증명하시오.", "mn이 완전제곱수",
      ["식을 m+n+2√(mn)으로 전개한다.", "전체가 유리수이면 √(mn)이 유리수이다.", "mn이 자연수이므로 √(mn)이 유리수이면 mn은 완전제곱수이다.", "반대로 mn이 완전제곱수이면 √(mn)이 자연수여서 전체가 유리수이다.", "따라서 필요충분조건이 성립한다."],
      ["전개한 식에서 유리수 여부를 결정하는 유일한 항을 찾는다.", "자연수의 제곱근이 유리수인 조건을 양방향으로 적용한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["RATIONAL_SQUARE_OF_RADICAL_SUM"], structureFamily: "radical-sum-square-iff-product-square", difficultyEvidence: ["유리수 성분 분리·필요충분조건 일반 증명"], writtenRubric: { requiredIdeas: ["전개", "√mn의 유리성", "mn 완전제곱", "필요성", "충분성"], minimumEvidence: 5 } }),
    q("m3_irrational_number", "A5", "reject-irrational-product-rule", "WRITTEN_RESPONSE", "서로 다른 무리수 α,β 중 α+β는 유리수이고 αβ는 무리수가 되도록 한 쌍을 구성하고 두 조건을 검증하시오.", "α=√2, β=1-√2",
      ["α=√2, β=1-√2로 구성한다.", "β가 유리수라면 √2=1-β도 유리수가 되어 모순이므로 β도 무리수이다.", "α+β=1로 유리수이다.", "αβ=√2-2로 무리수이다.", "두 수가 서로 다르고 요구한 두 결과를 동시에 만족함을 확인한다."],
      ["합에서 근호가 소거되도록 한 무리수에 유리수를 더한 반대 항을 만든다.", "만든 두 번째 수 자체가 무리수인지와 곱에 근호가 남는지를 따로 검증한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["CONSTRUCT_IRRATIONALS_WITH_MIXED_RESULTS"], structureFamily: "construct-and-verify-irrational-pair", difficultyEvidence: ["조건 역설계·무리수성 증명·합과 곱 이중 검증"], writtenRubric: { requiredIdeas: ["서로 다른 두 무리수", "합 유리수", "곱 무리수", "각 성질 검증"], minimumEvidence: 4 } }),
    q("m3_radical_simplification", "A5", "prime-factor-process", "WRITTEN_RESPONSE", "900의 약수인 자연수 n 중 √(72n)과 √(50n)이 모두 자연수가 되는 n을 모두 구하고, 빠진 값이 없음을 설명하시오.", "2,18,50,450",
      ["900=2²×3²×5²로 두고 n의 각 소인수 지수를 조사한다.", "72n이 제곱수이려면 n에서 2의 지수는 홀수, 3과 5의 지수는 짝수여야 한다.", "50n 조건도 같은 지수 홀짝 조건을 준다.", "900의 약수 범위에서 2의 지수는 1, 3과 5의 지수는 각각 0 또는 2이므로 n=2,18,50,450이다.", "네 값을 모두 대입하고 지수 선택을 모두 열거했으므로 누락이 없음을 확인한다."],
      ["두 수를 소인수분해해 n의 각 소인수 지수가 가져야 할 홀짝을 비교한다.", "n이 900의 약수라는 상한 안에서 가능한 지수 조합을 빠짐없이 만든다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["EXHAUSTIVE_EXPONENT_PARITY_ENUMERATION"], structureFamily: "divisor-square-parity-complete-enumeration", difficultyEvidence: ["두 제곱 조건 교차·지수 경우 완전 열거·누락 증명"], writtenRubric: { requiredIdeas: ["소인수분해", "지수 홀짝", "900의 약수", "네 값", "누락 없음"], minimumEvidence: 5 } }),
    q("m3_radical_simplification", "A5", "simultaneous-square-multiplier", "WRITTEN_RESPONSE", "학생이 ‘√(18n)과 √(24n)이 모두 자연수가 되게 하는 자연수 n이 있다’고 주장했다. 이 주장의 참·거짓을 소인수 지수로 판정하시오.", "그런 자연수 n은 없다.",
      ["18=2×3²이므로 18n이 제곱수가 되려면 n에서 2의 지수는 홀수, 3의 지수는 짝수여야 한다.", "24=2³×3이므로 24n이 제곱수가 되려면 n에서 2와 3의 지수가 모두 홀수여야 한다.", "3의 지수가 동시에 짝수와 홀수일 수 없어 두 조건은 양립하지 않는다.", "따라서 그런 자연수 n은 존재하지 않는다.", "임의의 추가 제곱 인수도 지수의 홀짝 모순을 바꾸지 못함을 확인한다."],
      ["각 곱이 완전제곱수가 되기 위해 n의 2와 3의 지수가 어떤 홀짝이어야 하는지 적는다.", "두 조건에서 같은 소인수의 요구가 충돌하는지 비교한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["INCOMPATIBLE_MULTIPLIER_PARITIES"], structureFamily: "prove-no-common-square-multiplier", difficultyEvidence: ["오류 주장 분석·두 조건 충돌·비존재 일반 증명"], writtenRubric: { requiredIdeas: ["18의 지수 조건", "24의 지수 조건", "3 지수 충돌", "비존재 결론"], minimumEvidence: 4 } }),
    q("m3_radical_simplification", "A5", "invalid-radical-splitting", "WRITTEN_RESPONSE", "b>0인 실수 b와 실수 a에 대하여 √(a²b)=a√b가 성립할 필요충분조건을 구하고, 성립하지 않는 경우의 올바른 식도 설명하시오.", "a≥0",
      ["b>0이므로 √(a²b)=√(a²)√b=|a|√b이다.", "주어진 등식이 성립하려면 |a|√b=a√b이고 √b>0이므로 |a|=a이다.", "이는 a≥0과 동치이다.", "a<0이면 올바른 식은 -a√b이다.", "각 부호 경우를 대입해 필요성과 충분성을 확인한다."],
      ["√(a²)를 바로 a로 바꾸지 말고 절댓값으로 바꾼다.", "√b가 양수라는 조건을 이용해 계수의 등식과 a의 부호를 연결한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["GENERAL_ABSOLUTE_FACTOR_CONDITION"], structureFamily: "radical-factor-iff-sign-proof", difficultyEvidence: ["일반식 변환·필요충분 부호 조건·오류식 교정"], writtenRubric: { requiredIdeas: ["|a|√b", "√b>0", "a≥0", "a<0일 때 -a√b", "양방향 확인"], minimumEvidence: 5 } }),
    q("m3_radical_operations", "A5", "sum-reciprocal-process", "WRITTEN_RESPONSE", "유리수 p,q에 대하여 (p√3+q√2)/(√3+√2)가 유리수가 될 필요충분조건과 그때의 값을 구하고 증명하시오.", "p=q이고 값은 p",
      ["분모의 켤레를 곱하면 분모는 1이다.", "분자는 3p-2q+(q-p)√6으로 정리된다.", "p,q가 유리수이므로 전체가 유리수일 필요충분조건은 q-p=0, 즉 p=q이다.", "p=q일 때 유리수 부분은 3p-2p=p이다.", "원래 분자도 p(√3+√2)가 되어 몫이 p임을 역방향으로 확인한다."],
      ["유리화한 뒤 유리수 부분과 √6의 계수를 분리한다.", "근호 계수가 0인 조건을 구한 후 원래 분수에서도 충분성을 확인한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["PARAMETERIZED_RATIONAL_QUOTIENT_IFF"], structureFamily: "rational-quotient-coefficient-iff-proof", difficultyEvidence: ["매개변수 유리화·계수 소거 필요조건·역방향 증명"], writtenRubric: { requiredIdeas: ["켤레 유리화", "3p-2q+(q-p)√6", "p=q", "값 p", "충분성"], minimumEvidence: 5 } }),
    q("m3_radical_operations", "A5", "cubic-reciprocal-symmetric", "WRITTEN_RESPONSE", "x=√5+2일 때 학생이 x²+1/x²=(x+1/x)²+2라고 계산했다. 오류를 고치고 x⁴+1/x⁴의 값을 구하는 과정을 설명하시오.", "322",
      ["x(√5-2)=1이므로 1/x=√5-2이고 x+1/x=2√5이다.", "x²+1/x²=(x+1/x)²-2이므로 학생의 부호가 틀렸다.", "따라서 x²+1/x²=20-2=18이다.", "x⁴+1/x⁴=(x²+1/x²)²-2=18²-2=322이다.", "두 단계 모두 곱이 1인 항의 교차항 2를 빼야 함을 확인한다."],
      ["x의 켤레가 역수인지 확인하고 합의 제곱에서 교차항의 부호를 본다.", "먼저 x²+1/x²를 고친 뒤 같은 대칭식 전략을 한 번 더 적용한다."],
      { answerContract: "WRITTEN_REVIEW", misconceptionTags: ["REPEATED_SYMMETRIC_SQUARE_SIGN_ERROR"], structureFamily: "diagnose-and-iterate-square-symmetry", difficultyEvidence: ["오류 분석·두 단계 대칭식 전략·결과 재검증"], writtenRubric: { requiredIdeas: ["역수 켤레", "첫 식의 -2", "값 18", "둘째 식의 -2", "값 322"], minimumEvidence: 5 } }),
    q("m3_radical_operations", "A5", "rationalization-error-review", "WRITTEN_RESPONSE", "자연수 a>b>0에 대하여 1/(√a-√b)+1/(√a+√b)가 유리수가 될 필요충분조건을 구하고 증명하시오.", "a가 완전제곱수",
      ["두 분수를 합치거나 각각 유리화하면 값은 2√a/(a-b)이다.", "a-b는 0이 아닌 자연수이므로 이 값의 유리성은 √a의 유리성과 같다.", "자연수 a에서 √a가 유리수일 필요충분조건은 a가 완전제곱수인 것이다.", "따라서 필요한 조건은 a가 완전제곱수인 것이다.", "a가 완전제곱수일 때 실제 값이 유리수임을 확인해 충분성도 보인다."],
      ["두 켤레 분모를 한 번에 통분해 어떤 근호만 남는지 확인한다.", "분모가 0이 아님을 사용해 전체의 유리성과 √a의 유리성을 연결한다."],
      { answerContract: "WRITTEN_REVIEW", independentCheck: true, misconceptionTags: ["RATIONALITY_OF_CONJUGATE_RECIPROCAL_SUM"], structureFamily: "conjugate-reciprocal-sum-iff-square", difficultyEvidence: ["통분 전략·유리성 조건 환원·필요충분 일반 증명"], writtenRubric: { requiredIdeas: ["2√a/(a-b)", "a-b≠0", "√a 유리수", "a 완전제곱", "양방향"], minimumEvidence: 5 } }),
  ]);

  const rewrittenByIdentity = Object.freeze(Object.fromEntries(REWRITTEN_SPECS.map((spec) => [
    `${spec.conceptId}:${spec.stage}:${spec.key}`,
    spec,
  ])));
  if (REWRITTEN_SPECS.length !== 41 || Object.keys(rewrittenByIdentity).length !== 41) {
    throw new Error("Exactly 41 distinct sqrt A3-A5 rewrites are required");
  }
  const ACTIVE_SPECS = Object.freeze(SPECS.map((spec) => (
    rewrittenByIdentity[`${spec.conceptId}:${spec.stage}:${spec.key}`] || spec
  )));

  function normalizedText(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .replace(/[−–—]/g, "-")
      .replace(/[×·]/g, "*")
      .replace(/÷/g, "/")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function hasWholeOuterParentheses(value) {
    if (value.length < 2 || value[0] !== "(" || value[value.length - 1] !== ")") return false;
    let depth = 0;
    for (let index = 0; index < value.length; index += 1) {
      if (value[index] === "(") depth += 1;
      if (value[index] === ")") depth -= 1;
      if (depth < 0 || (depth === 0 && index < value.length - 1)) return false;
    }
    return depth === 0;
  }

  function removeWholeOuterParentheses(value) {
    let result = value;
    while (hasWholeOuterParentheses(result)) result = result.slice(1, -1);
    return result;
  }

  function parseSignedRootTwoThreeSum(value) {
    const expression = removeWholeOuterParentheses(value);
    const terms = expression.match(/[+-]?√(?:2|3)/g);
    if (!terms || terms.length !== 2 || terms.join("") !== expression) return null;
    const coefficients = {};
    for (const term of terms) {
      const radicand = term[term.length - 1];
      if (Object.prototype.hasOwnProperty.call(coefficients, radicand)) return null;
      coefficients[radicand] = term[0] === "-" ? -1 : 1;
    }
    return coefficients;
  }

  function normalizeReciprocalRadicalPair(value) {
    const expression = removeWholeOuterParentheses(normalizedText(value));
    const direct = parseSignedRootTwoThreeSum(expression);
    if (direct?.["3"] === 1 && direct?.["2"] === -1) return "ROOT3_MINUS_ROOT2";

    if (!expression.startsWith("1/")) return null;
    const denominatorToken = expression.slice(2);
    if (!hasWholeOuterParentheses(denominatorToken)) return null;
    const denominator = parseSignedRootTwoThreeSum(denominatorToken);
    if (denominator?.["3"] === 1 && denominator?.["2"] === 1) return "ROOT3_MINUS_ROOT2";
    return null;
  }

  function defaultContract(spec) {
    if (spec.answerContract) return spec.answerContract;
    if (spec.answerType === "MULTIPLE_CHOICE") return "TEXT_NORMALIZED";
    if (spec.answerType === "STEP_ORDER") return "STEP_EQUIVALENCE";
    if (spec.answerType === "WRITTEN_RESPONSE") return "WRITTEN_REVIEW";
    return "ALGEBRA_EQUIVALENCE";
  }

  function createProblem(spec, index) {
    const concept = CONCEPTS.find((item) => item.conceptId === spec.conceptId);
    const problemId = `m3-sqrt-${String(index + 1).padStart(3, "0")}-${spec.conceptId.replace("m3_", "")}-${spec.stage.toLowerCase()}-${spec.key}`;
    const answerContract = defaultContract(spec);
    const contentRole = spec.independentCheck
      ? "LEVEL_RECHECK"
      : ["LEARNING_EXAMPLE", "LEARNING_PRACTICE", "LEARNING_FINAL_CHECK"][index % 4];
    return Object.freeze({
      id: problemId,
      problemId,
      grade: 9,
      unitId: UNIT_ID,
      conceptId: spec.conceptId,
      conceptTitle: concept.conceptName,
      stage: spec.stage,
      answerType: spec.answerType,
      prompt: spec.prompt,
      questionText: spec.prompt,
      choices: spec.choices,
      expectedAnswer: spec.expectedAnswer,
      correctAnswer: spec.expectedAnswer,
      acceptedAnswers: spec.acceptedAnswers,
      explanation: spec.solutionSteps.join(" "),
      hints: spec.hints,
      solutionSteps: spec.solutionSteps,
      solutionPath: spec.solutionSteps,
      misconceptionTags: spec.misconceptionTags,
      trapTypes: spec.misconceptionTags,
      difficultyEvidence: spec.difficultyEvidence,
      independentCheck: spec.independentCheck,
      conditionDomain: spec.domain || null,
      independentCheckPolicy: Object.freeze({
        hintDisclosure: "LOCKED_DURING_INDEPENDENT_CHECK",
        solutionDisclosure: "AFTER_FINAL",
      }),
      curriculumVersion: CURRICULUM_VERSION,
      futureCurriculumCompatibility: FUTURE_CURRICULUM_COMPATIBILITY,
      sourceScope: AUTHORING_SCOPE,
      authoringScope: AUTHORING_SCOPE,
      authoringMode: AUTHORING_MODE,
      answerContract: Object.freeze({
        kind: answerContract,
        validatorId: VALIDATOR_ID,
        acceptedAnswers: spec.acceptedAnswers,
        unsupportedStatus: "UNSUPPORTED_EXPRESSION",
        reviewStatus: "REVIEW_REQUIRED",
        domain: null,
      }),
      writtenRubric: spec.writtenRubric,
      reasoningGoals: STAGE_REASONING[spec.stage],
      prerequisiteConceptIds: concept.prerequisiteConceptIds,
      structureFamily: spec.structureFamily,
      structureSignature: `structure:m3-sqrt:${spec.conceptId}:${spec.stage}:${spec.structureFamily}`,
      solutionPathSignature: `solution:m3-sqrt:${spec.conceptId}:${spec.stage}:${spec.key}:v1`,
      estimatedMeaningfulSteps: spec.solutionSteps.length,
      validatorId: VALIDATOR_ID,
      contentRole,
      executionScope: "LEARNING_ONLY",
      scopeTag: "MIDDLE3_SQRT_AND_REAL_NUMBERS",
      scopeEvidence: "중학교 3학년 제곱근과 실수, 근호식 계산 범위만 사용",
      independentValidation: Object.freeze({
        conditionFeasible: true,
        uniqueAnswer: true,
        answerRecalculated: true,
        scopeChecked: true,
      }),
    });
  }

  const problems = Object.freeze(ACTIVE_SPECS.map(createProblem));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));
  const problemsByConceptStage = Object.freeze(Object.fromEntries(CONCEPTS.flatMap((concept) => (
    STAGES.map((stage) => [
      `${concept.conceptId}:${stage}`,
      Object.freeze(problems.filter((problem) => problem.conceptId === concept.conceptId && problem.stage === stage)),
    ])
  ))));

  function comparisonResult(comparison) {
    if (comparison?.equivalent === true || comparison?.correct === true) {
      return { status: "CORRECT", correct: true, validatorResult: comparison };
    }
    if (comparison?.equivalent === false || comparison?.correct === false) {
      return { status: "INCORRECT", correct: false, validatorResult: comparison };
    }
    const passthroughStatuses = new Set([
      "REVIEW_REQUIRED",
      "UNSUPPORTED_EXPRESSION",
      "INVALID_INPUT",
    ]);
    const status = passthroughStatuses.has(comparison?.status)
      ? comparison.status
      : "UNSUPPORTED_EXPRESSION";
    return { status, correct: null, validatorResult: comparison };
  }

  function compareAlgebraAnswers(expectedAnswers, actual, options = {}) {
    let unsupported = null;
    for (const expected of expectedAnswers) {
      const comparison = algebraValidator.compareExpressions(expected, actual, options);
      if (comparison.equivalent === true) return comparisonResult(comparison);
      if (comparison.equivalent === null) unsupported = comparison;
    }
    return unsupported
      ? comparisonResult(unsupported)
      : { status: "INCORRECT", correct: false };
  }

  function splitSteps(answer) {
    if (Array.isArray(answer)) return answer.map((item) => String(item).trim()).filter(Boolean);
    return String(answer ?? "").split(/(?:\r?\n|→|;)/).map((item) => item.trim()).filter(Boolean);
  }

  function compareStepItem(expected, actual) {
    if (normalizedText(expected) === normalizedText(actual)) return { status: "CORRECT", correct: true };
    const expectedHasEquation = String(expected).includes("=");
    const actualHasEquation = String(actual).includes("=");
    const comparison = expectedHasEquation && actualHasEquation
      ? algebraValidator.compareEquationSteps(expected, actual)
      : algebraValidator.compareExpressions(expected, actual);
    if (comparison.status === "VALID_STEP" || comparison.equivalent === true) {
      return { status: "CORRECT", correct: true, validatorResult: comparison };
    }
    if (comparison.status === "UNSUPPORTED_EXPRESSION" || comparison.status === "INVALID_INPUT") {
      return { status: comparison.status, correct: null, validatorResult: comparison };
    }
    return { status: "INCORRECT", correct: false, validatorResult: comparison };
  }

  function evaluateProblemAnswer(problemOrId, answer) {
    const problem = typeof problemOrId === "string" ? problemsById[problemOrId] : problemOrId;
    if (!problem) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_PROBLEM" };
    const contract = problem.answerContract.kind;
    if (contract === "WRITTEN_REVIEW") {
      return { status: "REVIEW_REQUIRED", correct: null, rubric: problem.writtenRubric };
    }
    if (contract === "RECIPROCAL_RADICAL_PAIR_NORMALIZED") {
      const correct = normalizeReciprocalRadicalPair(answer) === "ROOT3_MINUS_ROOT2";
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    if (contract === "TEXT_NORMALIZED") {
      const accepted = [problem.expectedAnswer, ...problem.acceptedAnswers].map(normalizedText);
      const correct = accepted.includes(normalizedText(answer));
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    if (contract === "SOLUTION_SET") {
      return comparisonResult(algebraValidator.compareSolutionSets(problem.expectedAnswer, answer));
    }
    if (contract === "STEP_EQUIVALENCE") {
      const expected = Array.isArray(problem.expectedAnswer) ? problem.expectedAnswer : [];
      const actual = splitSteps(answer);
      if (actual.length !== expected.length) return { status: "INCORRECT", correct: false, reason: "STEP_COUNT" };
      const items = expected.map((step, index) => compareStepItem(step, actual[index]));
      const ungraded = items.find((item) => (
        item.status === "UNSUPPORTED_EXPRESSION" || item.status === "INVALID_INPUT"
      ));
      if (ungraded) {
        return { status: ungraded.status, correct: null, items };
      }
      const correct = items.every((item) => item.correct === true);
      return { status: correct ? "CORRECT" : "INCORRECT", correct, items };
    }
    return compareAlgebraAnswers(
      [problem.expectedAnswer, ...problem.acceptedAnswers],
      answer,
      { domain: problem.answerContract.domain }
    );
  }

  function audit() {
    const countBy = (selector) => problems.reduce((result, problem) => {
      const key = selector(problem);
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    return Object.freeze({
      version: VERSION,
      authoringMode: AUTHORING_MODE,
      problemCount: problems.length,
      conceptCount: CONCEPTS.length,
      byConcept: countBy((problem) => problem.conceptId),
      byStage: countBy((problem) => problem.stage),
      byAnswerType: countBy((problem) => problem.answerType),
      independentCheckCount: problems.filter((problem) => problem.independentCheck).length,
      hintCount: problems.reduce((sum, problem) => sum + problem.hints.length, 0),
      processCount: problems.filter((problem) => problem.answerType === "STEP_ORDER").length,
      writtenCount: problems.filter((problem) => problem.answerType === "WRITTEN_RESPONSE").length,
    });
  }

  return Object.freeze({
    VERSION,
    UNIT_ID,
    CURRICULUM_VERSION,
    FUTURE_CURRICULUM_COMPATIBILITY,
    AUTHORING_SCOPE,
    AUTHORING_MODE,
    VALIDATOR_ID,
    STAGES,
    ANSWER_TYPES,
    concepts: CONCEPTS,
    problems,
    problemsById,
    problemsByConceptStage,
    getProblems(conceptId, stage) {
      return problemsByConceptStage[`${conceptId}:${stage}`] || Object.freeze([]);
    },
    evaluateProblemAnswer,
    audit,
  });
});
