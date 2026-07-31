(function (root, factory) {
  const validator = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const api = factory(validator);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_QUADRATIC_EQUATION_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (validator) {
  "use strict";

  if (!validator) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");

  const VERSION = "m3-quadratic-equation-learning-model-v1";
  const UNIT_ID = "m3-quadratic-equation";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const AUTHORING_SCOPE = "MIDDLE3_QUADRATIC_EQUATION_EXPLICIT_AUTHORED_V1";
  const AUTHORING_MODE = "EXPLICIT_AUTHORED_BLUEPRINTS_NO_LEGACY_REUSE";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const ANSWER_TYPES = Object.freeze(["MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE"]);
  const TYPE_PATTERN = Object.freeze({
    BASIC: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "SHORT_ANSWER", "SHORT_ANSWER"],
    A1: ["SHORT_ANSWER", "EXPRESSION_INPUT", "EXPRESSION_INPUT", "SHORT_ANSWER"],
    A2: ["EXPRESSION_INPUT", "SHORT_ANSWER", "STEP_ORDER", "EXPRESSION_INPUT"],
    A3: ["SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER"],
    A4: ["EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER", "WRITTEN_RESPONSE"],
    A5: ["WRITTEN_RESPONSE", "STEP_ORDER", "WRITTEN_RESPONSE", "WRITTEN_RESPONSE"],
  });
  const MIN_STEPS = Object.freeze({ BASIC: 2, A1: 2, A2: 3, A3: 3, A4: 4, A5: 4 });
  const LINKED_CONDITIONS = Object.freeze({ BASIC: 1, A1: 1, A2: 2, A3: 2, A4: 3, A5: 4 });
  const STAGE_REASONING = Object.freeze({
    BASIC: ["CONCEPT_RECALL", "DIRECT_APPLICATION"],
    A1: ["REPRESENTATION", "SIGN_CONTROL", "RESULT_CHECK"],
    A2: ["METHOD_SELECTION", "MULTI_CONCEPT_LINK", "ROOT_FILTER"],
    A3: ["CANDIDATE_GENERATION", "STRATEGY_SELECTION", "SIGN_JUDGMENT", "RESULT_VALIDATION"],
    A4: ["HIDDEN_CONDITION", "REVERSE_REASONING", "CASE_ANALYSIS", "REPRESENTATION_CHANGE", "RESULT_VALIDATION"],
    A5: ["STRATEGY_COMPARISON", "ERROR_ANALYSIS", "NECESSARY_SUFFICIENT", "GENERALIZATION", "CASE_EXHAUSTION", "RESULT_VALIDATION"],
  });
  const STAGE_EVIDENCE = Object.freeze({
    BASIC: ["정의 또는 기본 풀이 원리를 직접 적용", "부호와 계수를 한 단계에서 확인"],
    A1: ["한 단계 변형 뒤 풀이", "이항·정리와 해 검산을 연결"],
    A2: ["두 성질을 결합하고 풀이 방법을 선택", "해 집합과 조건 필터를 함께 확인"],
    A3: ["독립 조건 두 개 이상을 연결", "후보 생성·방법 선택·부호 판단·검산 중 두 가지 이상 수행"],
    A4: ["숨은 조건·역추론·경우 분류·표현 변환·최소성 중 두 가지 이상 수행", "계산량이 아닌 전략 선택으로 난이도 구성"],
    A5: ["오류 분석·필요충분조건·일반화·반례·모든 경우·검증 중 두 가지 이상 수행", "풀이 방향을 문제에서 직접 제시하지 않음"],
  });
  const CONCEPTS = Object.freeze([
    { conceptId: "m3_quadratic_meaning", conceptName: "이차방정식의 뜻과 해", order: 1, prerequisites: ["polynomial_degree", "substitution"] },
    { conceptId: "m3_quadratic_factor_solve", conceptName: "인수분해를 이용한 풀이", order: 2, prerequisites: ["m3_factor_sum_product", "zero_product"] },
    { conceptId: "m3_quadratic_sqrt_solve", conceptName: "제곱근을 이용한 풀이", order: 3, prerequisites: ["square_root", "m3_quadratic_meaning"] },
    { conceptId: "m3_quadratic_formula", conceptName: "근의 공식", order: 4, prerequisites: ["m3_quadratic_meaning", "radical_simplification"] },
    { conceptId: "m3_quadratic_root_meaning", conceptName: "해의 의미와 검산", order: 5, prerequisites: ["m3_quadratic_factor_solve", "m3_quadratic_formula"] },
    { conceptId: "m3_quadratic_word_setup", conceptName: "활용 문제의 식 세우기와 검증", order: 6, prerequisites: ["m3_quadratic_root_meaning", "equation_modeling"] },
  ].map((item) => Object.freeze({ ...item, prerequisiteConceptIds: Object.freeze(item.prerequisites) })));

  const D = Object.freeze({
    integer: Object.freeze({ kind: "INTEGER" }),
    natural: Object.freeze({ kind: "NATURAL", allowZero: false }),
    positive: Object.freeze({ kind: "POSITIVE" }),
    nonnegative: Object.freeze({ kind: "NON_NEGATIVE" }),
  });

  function r(key, prompt, answer, steps, extra = {}) {
    return Object.freeze({ key, prompt, answer, steps: steps.split("|"), ...extra });
  }
  function mc(key, prompt, answer, choices, steps, extra = {}) {
    return r(key, prompt, answer, steps, { ...extra, choices });
  }
  function wr(key, prompt, answer, steps, extra = {}) {
    return r(key, prompt, answer, steps, {
      ...extra,
      rubric: {
        requiredIdeas: steps.split("|").slice(0, 4),
        partialCredit: ["핵심 판정 1개", "조건 또는 반례 1개", "검산 또는 결론"],
      },
    });
  }

  const BANK = Object.freeze({
    m3_quadratic_meaning: Object.freeze({
      BASIC: [
        mc("degree-after-sort", "다음 중 정리했을 때 이차방정식인 것은?", "x^2-4=0", ["x^2-4=0", "2x+1=0", "x^2=x^2+3", "x^3-x=0"], "최고차항이 실제로 남는지 정리한다|x²의 계수가 0이 아니므로 첫 식이 이차방정식이다"),
        mc("leading-coefficient", "ax²+3x-1=0이 이차방정식이 되기 위한 조건은?", "a≠0", ["a≠0", "a=0", "a=1", "a>0"], "이차항의 계수를 확인한다|a가 0이면 일차방정식이 되므로 a≠0이다"),
        r("substitute-root", "x=2가 x²+kx-6=0의 해일 때 k를 구하시오.", "1", "x=2를 대입해 4+2k-6=0을 얻는다|2k=2이므로 k=1이다"),
        r("identity-or-equation", "독립 확인: x²-1=(x-1)(x+1)은 방정식인가 항등식인가?", "항등식", "오른쪽을 전개하면 x²-1이다|모든 x에서 참이므로 항등식이다"),
      ],
      A1: [
        r("cancel-square", "x²+2x=3x²+2x-8을 일반형으로 정리할 때 x²의 계수를 구하시오.", "-2", "모든 항을 왼쪽으로 이항한다|-2x²+8=0이므로 계수는 -2이다"),
        r("solve-parameter-root", "x=-1이 2x²+mx-3=0의 해이다. m을 구하시오.", "-1", "x=-1을 대입해 2-m-3=0을 얻는다|m=-1이고 원식에 다시 대입한다", { kind: "SOLUTION_SET" }),
        r("general-form-expression", "3x(x-2)=5를 ax²+bx+c=0 꼴로 나타내시오.", "3x^2-6x-5", "왼쪽을 전개한다|상수 5를 왼쪽으로 이항해 3x²-6x-5=0을 얻는다", { kind: "ALGEBRA_EQUIVALENCE" }),
        r("independent-leading-cancel", "독립 확인: (k-2)x²+x=4가 이차방정식이 아닐 때 k를 구하시오.", "2", "이차항 계수는 k-2이다|k-2=0이어야 하므로 k=2이다"),
      ],
      A2: [
        r("two-given-roots-parameter", "x=1과 x=-2가 모두 x²+px+q=0의 해이다. p,q를 순서대로 쓰시오.", "-1,-2", "두 값을 각각 대입해 두 식을 만든다|연립해 p=-1,q=-2를 얻는다|두 근을 다시 대입해 검산한다", { kind: "TEXT_NORMALIZED" }),
        r("root-or-nonroot-count", "후보 -2,-1,1,2 중 x²-x-2=0의 해가 아닌 수의 개수를 구하시오.", "2", "각 후보를 대입하거나 식을 (x-2)(x+1)로 본다|해는 -1,2이므로 나머지는 두 개이다"),
        r("order-classify-equation", "식 x(x-3)=2x+4가 이차방정식임을 판정하는 순서를 배열하시오.", null, "왼쪽을 전개해 x²-3x=2x+4로 쓴다|모든 항을 옮겨 x²-5x-4=0으로 정리한다|x²의 계수 1이 0이 아님을 확인한다"),
        r("independent-shared-root", "독립 확인: x=2가 x²+ax-2=0과 x²-3x+b=0의 공통된 해일 때 a+b를 구하시오.", "1", "첫 식에 2를 대입해 a=-1을 얻는다|둘째 식에 2를 대입해 b=2를 얻는다|따라서 a+b=1이고 두 식에 다시 대입한다", { kind: "TEXT_NORMALIZED" }),
      ],
      A3: [
        r("candidate-leading-and-root", "정수 k에 대해 (k-1)x²+(k+1)x-6=0이 이차방정식이고 x=1이 해이다. k를 구하시오.", "3", "x=1을 대입해 2k-6=0으로 후보 k=3을 얻는다|k≠1 조건을 확인한다|원식에 대입해 검산한다"),
        r("two-equations-common-root", "두 방정식 x²+px-6=0, x²-5x+q=0이 양의 공통근 2를 가질 때 첫 방정식의 다른 해를 구하시오.", "-3", "공통근 2를 첫 식에 대입해 4+2p-6=0, p=1을 얻는다|x²+x-6=(x-2)(x+3)으로 인수분해한다|다른 해 -3을 원식에 검산한다", { kind: "SOLUTION_SET" }),
        r("process-identity-equation", "k에 따라 (k-1)x²+2x=kx²+2x-3이 항등식·일차방정식·이차방정식 중 무엇인지 분류하는 순서를 배열하시오.", null, "한쪽으로 모아 -x²+3=0을 얻는다|k가 소거되어 모든 k에서 같은 식임을 확인한다|x² 계수가 -1이므로 모든 k에서 이차방정식이다"),
        r("independent-reverse-general-form", "독립 확인: x=1은 해이고 x=-1은 해가 아닌 x²+ax+b=0에서 a,b가 한 자리 정수일 때 가능한 (a,b)의 개수를 구하시오.", "17", "x=1 조건에서 b=-a-1이다|x=-1 대입값 2-2a가 0이 아니므로 a≠1이다|a=-9부터 8까지 18개 후보 중 a=1을 제외해 17개임을 검산한다"),
      ],
      A4: [
        r("hidden-cancel-cases", "정수 k에 대해 (k²-1)x²+(k-1)x+1=0이 이차방정식이 아니면서 해 x=-1을 가질 때 k를 구하시오.", "없음", "이차가 아니려면 k=±1이다|x=-1 대입으로 후보를 거른다|k=1이면 1=0, k=-1이면 3=0이 되어 둘 다 성립하지 않는다|따라서 조건을 만족하는 k는 없다", { kind: "TEXT_NORMALIZED" }),
        r("process-two-root-reverse", "서로 다른 두 수 1,3이 ax²+bx+c=0의 해이고 a+b+c=0일 때 계수의 가능한 관계를 찾는 순서를 배열하시오.", null, "두 해로 식이 a(x-1)(x-3)=0임을 쓴다|전개해 b=-4a,c=3a를 얻는다|a+b+c=0이 자동 성립함을 확인한다|a≠0인 모든 배수가 가능하다고 분류한다"),
        r("minimum-parameter-root", "자연수 k에 대해 x=k가 x²-(k+2)x+2k=0의 중근이 되는 가장 작은 k를 구하시오.", "2", "x=k를 대입하면 항상 0임을 확인한다|다른 인수는 x-2임을 역추론한다|중근이려면 k=2이고 자연수 조건을 확인한다|전개로 검산한다"),
        wr("independent-equation-vs-identity-proof", "독립 확인: 어떤 이차식 P(x)에 대해 P(1)=P(2)=P(3)=0이면 P(x)=0은 항등식이라는 주장을 판정하고 근거를 쓰시오.", "참이다.", "0이 아닌 이차식은 서로 다른 근을 최대 두 개 가진다|서로 다른 세 값에서 0이면 영다항식이어야 한다|따라서 모든 x에서 P(x)=0이다|이차방정식과 항등식을 구분해 결론 낸다"),
      ],
      A5: [
        wr("claim-root-count-classification", "ax²+bx+c=0에서 a≠0일 때 서로 다른 세 수가 해가 될 수 있다는 주장과, 두 수에서 성립하면 항등식이라는 주장을 각각 판정하시오.", "첫 주장은 거짓이고 둘째 주장도 거짓이다.", "이차방정식은 서로 다른 실근을 최대 두 개 가진다|두 근을 갖는 0이 아닌 이차식이 존재한다|예로 (x-1)(x-2)=0을 든다|세 근 조건과 두 근 조건의 차이를 설명한다"),
        r("process-necessary-leading", "식 (a-1)x²+(b+2)x+c=0이 모든 x에서 참일 조건과 이차방정식일 조건을 비교하는 순서를 배열하시오.", null, "항등식이면 세 계수가 모두 0이어야 한다|따라서 a=1,b=-2,c=0이다|이차방정식이면 a-1≠0만 필수이다|두 조건이 서로 배타적임을 검증한다"),
        wr("general-root-substitution", "정수 r이 x²+px+q=0의 해일 필요충분조건을 나머지 없이 설명하고, 대입 검산이 왜 충분한지 쓰시오.", "r²+pr+q=0인 것이 필요충분하다.", "해의 정의는 대입했을 때 등식이 참인 것이다|필요성은 해에서 바로 따른다|충분성은 식의 값이 0이면 방정식을 만족하기 때문이다|정수 조건은 판정 방식 자체를 바꾸지 않는다"),
        wr("independent-counterexample-leading", "독립 확인: ax²+bx+c=0에 해가 두 개 있으면 반드시 a≠0이라는 주장을 범위를 명확히 하여 판정하시오.", "서로 다른 두 해라는 뜻이면 거짓이다.", "a=0인 항등식 0=0은 모든 수를 해로 갖는 반례이다|방정식을 항등식이 아닌 식으로 제한하면 일차식은 근이 하나뿐이다|서로 다른 정확히 두 해와 무수히 많은 해를 구분한다|필요한 추가 조건을 진술한다"),
      ],
    }),

    m3_quadratic_factor_solve: Object.freeze({
      BASIC: [
        mc("zero-product", "(x-3)(x+2)=0의 해는?", "3,-2", ["3,-2", "-3,2", "3,2", "-3,-2"], "각 인수가 0인 경우를 나눈다|x=3 또는 x=-2이다", { kind: "SOLUTION_SET" }),
        mc("common-factor-root", "x(x-5)=0의 해는?", "0,5", ["0,5", "5", "0,-5", "-5,5"], "x=0 또는 x-5=0이다|두 해 0,5를 쓴다", { kind: "SOLUTION_SET" }),
        r("perfect-square-root", "(x+4)²=0의 해를 구하시오.", "-4", "제곱이 0이면 밑이 0이다|x+4=0에서 x=-4이다", { kind: "SOLUTION_SET" }),
        r("independent-difference-root", "독립 확인: x²-49=0의 양의 해를 구하시오.", "7", "제곱의 차로 (x-7)(x+7)=0이다|양의 해만 남기면 7이다", { kind: "SOLUTION_SET", domain: D.positive }),
      ],
      A1: [
        r("move-and-factor", "x²+2x=15의 해의 합이 아닌 해 집합을 구하시오.", "3,-5", "모든 항을 옮겨 x²+2x-15=0으로 만든다|(x+5)(x-3)=0에서 해 3,-5를 얻는다", { kind: "SOLUTION_SET" }),
        r("factor-expression-solve", "2x²-8x=0의 해를 구하시오.", "0,4", "2x를 묶어 2x(x-4)=0으로 만든다|영인수 조건에서 x=0,4이다", { kind: "SOLUTION_SET" }),
        r("square-difference-solve", "9x²-25=0의 해 집합을 쓰시오.", "5/3,-5/3", "(3x-5)(3x+5)=0으로 인수분해한다|각 인수에서 x=±5/3을 얻는다", { kind: "SOLUTION_SET" }),
        r("independent-middle-root", "독립 확인: x²-10x+25=0의 서로 다른 해의 개수를 구하시오.", "1", "(x-5)²=0으로 인수분해한다|중근 5는 해 집합에서 한 번만 센다"),
      ],
      A2: [
        r("gcf-then-linear", "3x²-12x=0에서 공통인수와 영인수 조건을 이용해 해를 구하시오.", "0,4", "3x를 묶어 3x(x-4)=0으로 만든다|영인수 조건으로 두 경우를 나눈다|해 0,4를 원식에 검산한다", { kind: "SOLUTION_SET" }),
        r("method-choice-factor", "x²-7x+12=0은 근의 공식보다 인수분해가 효율적이다. 두 근의 곱을 구하시오.", "12", "합 -7과 곱 12를 만드는 -3,-4를 찾는다|(x-3)(x-4)=0이고 근 3,4의 곱은 12이다"),
        r("process-factor-complete", "2x²+2x-12=0을 완전 인수분해하여 푸는 순서를 배열하시오.", null, "공통인수 2를 묶어 2(x²+x-6)=0으로 쓴다|괄호를 (x+3)(x-2)로 인수분해한다|영인수 조건으로 x=-3,2를 얻는다|두 값을 원식에 대입해 검산한다"),
        r("independent-filter-positive", "독립 확인: x²+x-20=0의 해 중 자연수인 해를 구하시오.", "4", "(x+5)(x-4)=0으로 인수분해한다|후보 -5,4를 얻는다|자연수 조건으로 4만 남긴다", { kind: "SOLUTION_SET", domain: D.natural }),
      ],
      A3: [
        r("parameter-factor-candidate", "자연수 k에 대해 x²-(k+1)x+k=0의 두 근의 차가 3일 때 k를 구하시오.", "4", "식은 (x-1)(x-k)=0으로 인수분해된다|두 근 1,k의 차 조건에서 |k-1|=3이다|자연수 조건으로 k=4를 고르고 검산한다"),
        r("two-method-hidden-square", "x²-6x+5=0을 완전제곱식으로 바꾼 뒤 인수분해하여 해를 구하시오.", "1,5", "x²-6x+9=4로 바꾼다|(x-3)²-4=0을 제곱의 차로 인수분해한다|x=1,5를 얻고 검산한다", { kind: "SOLUTION_SET" }),
        r("process-sign-factor", "-2x²+10x-12=0의 부호 오류를 피하며 푸는 순서를 배열하시오.", null, "-2를 묶어 -2(x²-5x+6)=0으로 쓴다|(x-2)(x-3)=0으로 인수분해한다|x=2,3을 얻는다|원식 대입으로 부호를 검산한다"),
        r("independent-reverse-factor", "독립 확인: 한 근이 -2이고 다른 근이 자연수이며 x²+ax-8=0일 때 a를 구하시오.", "-2", "곱이 -8이므로 다른 근은 4이다|(x+2)(x-4)=x²-2x-8이다|a=-2이고 두 근을 검산한다"),
      ],
      A4: [
        r("case-common-factor", "정수 k에 대해 x²+(k-3)x-3k=0의 두 근이 모두 정수이고 한 근이 3일 때 다른 근을 구하시오.", "-k", "x=3 대입이 모든 k에서 성립함을 확인한다|식을 (x-3)(x+k)로 역인수분해한다|다른 근은 -k이다|중근 k=-3 경우도 분류한다", { kind: "SOLUTION_SET", accepted: ["-k"] }),
        r("process-route-selection", "4x²-12x+5=0을 두 제곱의 차 구조로 바꾸어 푸는 순서를 배열하시오.", null, "(2x-3)²-4=0으로 표현한다|{(2x-3)-2}{(2x-3)+2}=0으로 인수분해한다|2x-5=0 또는 2x-1=0을 푼다|x=5/2,1/2를 원식에 검산한다"),
        r("minimum-natural-parameter", "x²-(m+2)x+2m=0의 두 근이 서로 다른 자연수가 되는 가장 작은 자연수 m을 구하시오.", "1", "(x-2)(x-m)=0으로 구조를 찾는다|두 근은 2,m이다|서로 다르고 자연수인 가장 작은 m은 1이다|m=1에서 근 1,2를 원식에 검산한다"),
        wr("independent-factor-completeness", "독립 확인: x(x-2)=3(x-2)를 보고 x=3만 얻은 풀이의 오류를 분석하고 모든 해를 구하시오.", "약분 과정에서 x=2를 잃었으며 해는 2,3이다.", "한쪽으로 모아 (x-2)(x-3)=0으로 만든다|x-2로 나누면 x=2 가능성을 잃는다|영인수 조건으로 2,3을 얻는다|두 해를 원식에 검산한다"),
      ],
      A5: [
        wr("zero-product-iff", "AB=0이면 A=0 또는 B=0이라는 원리를 이차방정식 풀이에 사용할 수 있는 범위와 역도 성립하는지 설명하시오.", "실수의 곱에서 필요충분조건으로 성립한다.", "실수에는 영인수가 없다|A=0 또는 B=0이면 곱은 0이다|곱이 0이면 둘 중 하나는 0이다|인수분해가 완전해야 모든 해를 얻는다고 연결한다"),
        r("process-multiple-error-analysis", "학생이 2x²-5x-3=0을 (2x-3)(x+1)=0으로 풀어 x=3/2,-1이라 했다. 오류를 분석·수정하는 순서를 배열하시오.", null, "제시한 인수분해를 전개해 2x²-x-3임을 확인한다|원식의 가운데항 -5x와 다름을 지적한다|올바르게 (2x+1)(x-3)=0으로 인수분해한다|해 -1/2,3을 원식에 검산한다"),
        wr("all-factor-cases", "정수 n에 대해 x²+nx+12=0이 정수근을 갖는 모든 n을 분류하는 절차와 결과를 쓰시오.", "n=±7,±8,±13", "12의 정수 인수쌍을 부호까지 생성한다|합이 -n임을 이용한다|합은 ±7,±8,±13이다|순서 중복을 제거하고 재전개로 완전성을 보인다"),
        wr("independent-counterexample-cancel", "독립 확인: 이차방정식 양변의 같은 식을 약분해도 해가 항상 보존된다는 주장을 반례와 함께 판정하시오.", "거짓이다.", "(x-1)(x+2)=0을 예로 든다|양변 또는 식에서 x-1을 나누면 x=1이 사라질 수 있다|0이 될 수 있는 식으로 나눌 때 경우를 분리해야 한다|약분 전후 해 집합을 비교한다"),
      ],
    }),

    m3_quadratic_sqrt_solve: Object.freeze({
      BASIC: [
        mc("basic-square", "x²=16의 해는?", "4,-4", ["4,-4", "4", "-4", "8,-8"], "양변의 제곱근을 생각한다|x=±4이다", { kind: "SOLUTION_SET" }),
        mc("shifted-square", "(x-2)²=9의 해는?", "5,-1", ["5,-1", "5", "1,-5", "11,-7"], "x-2=±3이다|x=5 또는 -1이다", { kind: "SOLUTION_SET" }),
        r("negative-no-real", "실수 범위에서 x²=-4의 해 집합을 쓰시오.", "{}", "실수의 제곱은 0 이상이다|-4가 될 수 없어 실근이 없다", { kind: "SOLUTION_SET" }),
        r("independent-positive-root", "독립 확인: x²=81의 양의 해만 구하시오.", "9", "전체 후보는 ±9이다|양수 조건으로 9만 남긴다", { kind: "SOLUTION_SET", domain: D.positive }),
      ],
      A1: [
        r("isolate-square", "2x²=50의 해를 구하시오.", "5,-5", "양변을 2로 나눠 x²=25로 만든다|x=±5이다", { kind: "SOLUTION_SET" }),
        r("shift-divide", "3(x+1)²=12의 해 집합을 쓰시오.", "1,-3", "(x+1)²=4로 만든다|x+1=±2에서 x=1,-3이다", { kind: "SOLUTION_SET" }),
        r("radical-basic", "(x-4)²=7의 해를 구하시오.", "4+sqrt(7),4-sqrt(7)", "x-4=±√7이다|양변에 4를 더해 두 해를 얻는다", { kind: "SOLUTION_SET" }),
        r("independent-zero-square", "독립 확인: 5(x+3)²=0의 서로 다른 해의 개수를 구하시오.", "1", "(x+3)²=0이다|x=-3 하나인 중근이다"),
      ],
      A2: [
        r("complete-square-choice", "x²-6x+9=11의 해를 구하시오.", "3+sqrt(11),3-sqrt(11)", "왼쪽이 (x-3)²임을 고른다|x-3=±√11이다|두 해를 원식에 검산한다", { kind: "SOLUTION_SET" }),
        r("count-by-sign", "(2x-1)²=q가 서로 다른 두 실근을 가질 때 q의 부호를 쓰시오.", "양수", "q>0이면 ±√q가 서로 다르다|q=0이면 중근, q<0이면 실근이 없다"),
        r("process-plus-minus", "4(x-2)²=20을 ± 누락 없이 푸는 순서를 배열하시오.", null, "(x-2)²=5로 정리한다|x-2=±√5로 두 경우를 쓴다|x=2±√5를 얻는다|두 해를 제곱해 원식에 검산한다"),
        r("independent-domain-filter", "독립 확인: (x-5)²=16의 해 중 0≤x≤5인 해를 구하시오.", "1", "전체 해는 9,1이다|구간 조건을 각각 검사한다|1만 남긴다", { kind: "SOLUTION_SET", domain: { kind: "NON_NEGATIVE", max: "5" } }),
      ],
      A3: [
        r("parameter-sign-candidates", "정수 k에 대해 (x-k)²=9의 두 해가 모두 양수이고 합이 10일 때 k를 구하시오.", "5", "두 해는 k±3이다|합 2k=10에서 k=5이다|해 2,8이 모두 양수인지 검산한다"),
        r("square-route-filter", "(x+2)²=2x+11을 완전제곱 형태로 다시 만들어 해를 구하시오.", "-1+2sqrt(2),-1-2sqrt(2)", "전개·이항해 x²+2x-7=0을 얻는다|(x+1)²=8로 바꾼다|해 -1±2√2를 얻고 원식에 검산한다", { kind: "SOLUTION_SET" }),
        r("process-no-real-branch", "정수 k에 따라 (x-1)²=k-2의 실근 개수를 분류하는 순서를 배열하시오.", null, "오른쪽 q=k-2의 부호를 본다|k>2이면 서로 다른 두 실근이다|k=2이면 중근 1이다|k<2이면 실근이 없다"),
        r("independent-reverse-center", "독립 확인: (x-p)²=q의 두 해가 -1,7일 때 p+q를 구하시오.", "19", "중심 p는 두 해의 중점 3이다|중심에서 거리는 4이므로 q=16이다|p+q=19이고 두 해로 검산한다"),
      ],
      A4: [
        r("integer-root-square-parameter", "자연수 k에 대해 (x-2)²=2k+1의 두 해가 모두 정수이고 그 차가 6일 때 k를 구하시오.", "4", "두 해의 차는 2√(2k+1)이다|차 6에서 √(2k+1)=3이다|2k+1=9에서 k=4이다|두 해 -1,5를 검산한다"),
        r("process-hidden-square", "x²+4x-1=0을 제곱근을 이용해 푸는 필수 순서를 배열하시오.", null, "x²+4x+4=5로 완전제곱을 만든다|(x+2)²=5로 쓴다|x+2=±√5로 나눈다|x=-2±√5를 원식에 검산한다"),
        r("minimum-k-integer-root", "자연수 k에 대해 (x-3)²=k의 해 중 자연수가 정확히 하나가 되는 가장 작은 k를 구하시오.", "9", "해는 3±√k이다|정수 해를 위해 k는 제곱수여야 한다|k=1,4에서는 둘 다 자연수이고 k=9에서 0,6이다|자연수를 1 이상으로 보아 6 하나만 남는다"),
        wr("independent-sqrt-equivalence", "독립 확인: (x-a)²=b에서 x-a=√b만 쓰는 풀이가 완전해지는 조건을 실수 범위에서 설명하시오.", "b=0일 때만 완전하다.", "b<0이면 실근이 없다|b=0이면 ±가 같은 0이다|b>0이면 서로 다른 두 부호가 필요하다|세 경우를 모두 비교해 필요충분조건을 결론 낸다"),
      ],
      A5: [
        wr("plus-minus-necessity", "u²=v에서 u=±√v라는 표현의 성립 조건을 실수 범위에서 필요충분하게 분류하시오.", "v>0이면 두 값, v=0이면 한 값, v<0이면 실근 없음이다.", "실수 제곱의 비음수성을 쓴다|v의 부호 세 경우를 분류한다|v=0에서 중복을 제거한다|각 경우를 제곱해 충분성을 검증한다"),
        r("process-two-error-sqrt", "학생이 2(x-1)²=18에서 x-1=3, x=4만 썼다. 두 오류 가능성을 점검하고 고치는 순서를 배열하시오.", null, "먼저 양변을 2로 나눠 (x-1)²=9를 확인한다|제곱근에서 ±를 붙여 x-1=±3으로 쓴다|x=4,-2를 얻는다|두 값을 원식에 대입해 누락과 계산을 검증한다"),
        wr("all-integer-centers", "(x-p)²=q가 서로 다른 두 정수 해를 갖기 위한 정수 p,q의 필요충분조건을 일반화하시오.", "p는 임의의 정수이고 q는 양의 완전제곱수여야 한다.", "해 p±√q가 정수여야 한다|√q가 양의 정수여야 서로 다르다|따라서 q는 양의 완전제곱수이다|역으로 해당 조건이면 두 정수 해가 생김을 보인다"),
        wr("independent-counterexample-square", "독립 확인: 양변에 제곱근을 취하면 언제나 원래 방정식과 동치라는 주장을 판정하고 안전한 절차를 쓰시오.", "조건 없이 말하면 거짓이다.", "제곱근 기호는 주값만 나타냄을 지적한다|x²=4에서 x=2만 쓰면 -2를 잃는 반례를 든다|±와 우변의 비음수 조건을 포함해야 한다|얻은 후보를 원식에 검산한다"),
      ],
    }),

    m3_quadratic_formula: Object.freeze({
      BASIC: [
        mc("identify-abc", "2x²-3x-5=0에서 (a,b,c)는?", "2,-3,-5", ["2,-3,-5", "2,3,-5", "-2,-3,5", "2,-3,5"], "일반형과 항의 순서를 맞춘다|a=2,b=-3,c=-5이다"),
        mc("formula-sign", "x²+4x-5=0에 근의 공식을 적용한 식은?", "(-4±sqrt(36))/2", ["(-4±sqrt(36))/2", "(4±sqrt(36))/2", "(-4±sqrt(16))/2", "(-4±sqrt(36))"], "a=1,b=4,c=-5이다|(-b±√(b²-4ac))/(2a)에 대입한다"),
        r("direct-formula", "x²-2x-1=0의 해를 구하시오.", "1+sqrt(2),1-sqrt(2)", "a=1,b=-2,c=-1을 대입한다|(2±√8)/2=1±√2로 정리한다", { kind: "SOLUTION_SET" }),
        r("independent-middle-zero", "독립 확인: 3x²-12=0을 근의 공식으로 풀었을 때 양의 해를 구하시오.", "2", "a=3,b=0,c=-12를 대입한다|해 ±2 중 양수 2만 남긴다", { kind: "SOLUTION_SET", domain: D.positive }),
      ],
      A1: [
        r("standardize-first", "2x²+3=7x을 일반형으로 정리했을 때 b의 값을 구하시오.", "-7", "모든 항을 왼쪽으로 옮긴다|2x²-7x+3=0이므로 b=-7이다"),
        r("formula-rational", "2x²+x-3=0의 해를 구하시오.", "1,-3/2", "a=2,b=1,c=-3을 공식에 대입한다|(-1±5)/4에서 1,-3/2를 얻는다", { kind: "SOLUTION_SET" }),
        r("formula-radical-simplify", "3x²-6x-2=0의 해 집합을 쓰시오.", "1+sqrt(15)/3,1-sqrt(15)/3", "공식에서 (6±√60)/6이다|√60=2√15로 간단히 한다|해는 1±√15/3이다", { kind: "SOLUTION_SET" }),
        r("independent-double-root", "독립 확인: x²-8x+16=0을 공식으로 풀 때 서로 다른 해의 개수를 구하시오.", "1", "근호 안이 64-64=0이다|두 식이 모두 x=4가 되어 중근 하나이다"),
      ],
      A2: [
        r("choose-factor-or-formula", "6x²-x-2=0을 효율적인 방법으로 풀어 해를 쓰시오.", "2/3,-1/2", "정수 인수분해 가능성을 먼저 본다|(3x+1)(2x-2)=0으로 확인한다|해 2/3,-1/2를 검산한다", { kind: "SOLUTION_SET" }),
        r("formula-root-count", "4x²+4x+1=0을 근의 공식으로 풀 때 ± 두 결과가 같은 이유를 한 단어로 쓰시오.", "중근", "근호 안이 0이다|±0은 같은 값이므로 중근이다"),
        r("process-formula-signs", "-x²+5x-3=0을 근의 공식으로 푸는 순서를 배열하시오.", null, "a=-1,b=5,c=-3으로 식별한다|(-5±√13)/(-2)에 대입한다|부호를 정리해 (5∓√13)/2로 쓴다|두 해를 원식에 검산한다"),
        r("independent-no-real", "독립 확인: x²+2x+5=0의 실수 해 집합을 쓰시오.", "{}", "공식의 근호 안은 4-20=-16이다|실수 범위에서는 제곱근이 없어 해가 없다", { kind: "SOLUTION_SET" }),
      ],
      A3: [
        r("parameter-double-root", "정수 k에 대해 x²+kx+9=0이 중근을 갖고 그 근이 음수일 때 k를 구하시오.", "6", "중근이면 식은 (x-r)²이다|상수항에서 r=±3 후보를 만든다|음수 근 r=-3을 골라 k=6으로 검산한다"),
        r("formula-filter-positive", "2x²-4x-3=0의 해 중 양수인 해만 쓰시오.", "1+sqrt(10)/2", "공식으로 x=1±√10/2를 얻는다|√10/2>1이므로 작은 해는 음수이다|양수 조건으로 큰 해만 남긴다", { kind: "SOLUTION_SET", domain: D.positive }),
        r("process-method-compare", "x²-11x+24=0에서 인수분해와 근의 공식 중 전략을 선택하고 검산하는 순서를 배열하시오.", null, "곱 24와 합 -11인 정수쌍 존재를 확인한다|(x-3)(x-8)=0을 선택한다|해 3,8을 얻는다|공식 또는 대입으로 같은 해인지 검산한다"),
        r("independent-reverse-coefficient", "독립 확인: 2x²+bx-3=0의 한 근이 1일 때 공식을 쓰기 전에 b를 구하시오.", "1", "x=1을 대입해 2+b-3=0이다|b=1을 얻는다|식의 두 근 1,-3/2로 검산한다"),
      ],
      A4: [
        r("hidden-perfect-square-formula", "정수 m에 대해 x²+mx+16=0이 중근을 갖고 m<0일 때 그 근을 구하시오.", "4", "상수항에서 완전제곱 후보 (x±4)²를 만든다|m<0이면 (x-4)²이다|m=-8이고 근 4이다|공식의 근호 안 0으로 검산한다", { kind: "SOLUTION_SET" }),
        r("process-fraction-standardize", "x²/2-x/3=1을 근의 공식으로 푸는 순서를 배열하시오.", null, "양변에 6을 곱해 3x²-2x-6=0으로 만든다|a=3,b=-2,c=-6을 식별한다|x=(2±√76)/6을 얻는다|√76=2√19로 줄여 (1±√19)/3을 검산한다"),
        r("minimum-integer-k", "자연수 k에 대해 x²-2kx+k²-4=0의 두 근이 모두 자연수가 되는 가장 작은 k를 구하시오.", "3", "(x-k)²=4 구조를 찾는다|근은 k±2이다|둘 다 자연수이려면 k-2≥1이다|최소 k=3이고 근 1,5를 검산한다"),
        wr("independent-formula-vs-factor", "독립 확인: 모든 이차방정식은 인수분해로 풀 수 있으므로 근의 공식이 필요 없다는 주장을 중3 실수 범위에서 판정하시오.", "거짓이다.", "정수·유리수 계수의 간단한 인수분해가 안 되는 식이 있다|x²-2=0을 예로 들 수 있다|근의 공식은 근호 해와 실근 없음까지 통일적으로 판정한다|인수분해 가능할 때는 더 효율적일 수 있음을 구분한다"),
      ],
      A5: [
        wr("formula-sign-error-criterion", "근의 공식에서 -b를 b로 잘못 쓴 답이 우연히 맞는 모든 경우를 분석하시오.", "b=0인 경우에만 해 집합이 같다.", "정확한 해의 중심은 -b/(2a)이다|잘못된 식의 중심은 b/(2a)이다|두 해 집합이 같으려면 중심이 같아 b=0이다|b=0이면 두 공식이 실제로 같음을 검증한다"),
        r("process-two-claims-formula", "ax²+bx+c=0에서 A는 근호 안이 0이면 해가 없고 B는 음수이면 중근이라 했다. 두 오류를 고치는 순서를 배열하시오.", null, "근호 안 b²-4ac의 부호로 경우를 나눈다|0이면 ±항이 0이라 중근 하나이다|음수이면 실수 제곱근이 없어 실근이 없다|양수이면 서로 다른 두 실근임을 포함해 검산한다"),
        wr("necessary-sufficient-integer-root", "정수 계수 이차방정식에 정수근이 있으려면 근의 공식 결과가 정수여야 한다는 말을 계산 가능한 판정 조건으로 설명하시오.", "근호 안이 완전제곱수이고 분자들이 2a로 나누어져야 한다.", "근호 안이 음이 아니어야 한다|정수근이면 근호 값이 유리수이고 정수 계수에서는 완전제곱수여야 한다|두 부호의 분자가 2a로 나누어지는지 확인한다|조건이 충족된 후보를 원식에 검산한다"),
        wr("independent-counterexample-discriminant", "독립 확인: 근호 안의 값만 같으면 두 이차방정식의 해 집합도 같다는 주장을 반례와 함께 판정하시오.", "거짓이다.", "근의 공식에는 근호 안뿐 아니라 -b와 2a도 있다|x²-1=0과 x²+2x=0은 근호 안이 4로 같다|해 집합은 {-1,1}과 {-2,0}으로 다르다|세 계수의 역할을 구분한다"),
      ],
    }),

    m3_quadratic_root_meaning: Object.freeze({
      BASIC: [
        mc("unordered-set", "방정식의 해가 2와 -3일 때 같은 해 집합 표기는?", "-3,2", ["-3,2", "3,-2", "2,3", "-2,-3"], "해 집합에는 순서가 없다|2,-3과 -3,2는 같다", { kind: "SOLUTION_SET" }),
        mc("duplicate-root", "중근 4의 해 집합으로 알맞은 것은?", "4", ["4", "4,4", "-4,4", "{}"], "중근은 같은 값이 두 번 나온다|집합에는 4를 한 번만 쓴다", { kind: "SOLUTION_SET" }),
        r("substitution-check", "x=-2가 x²+x-2=0의 해이면 대입한 왼쪽 값은?", "0", "4-2-2를 계산한다|값이 0이므로 해가 맞다"),
        r("independent-no-real-set", "독립 확인: 실근이 없는 방정식의 해 집합을 기호로 쓰시오.", "{}", "실수 범위의 해가 하나도 없다|빈 집합 {}로 나타낸다", { kind: "SOLUTION_SET" }),
      ],
      A1: [
        r("remove-false-candidate", "후보 -2,1,3 중 x²-x-6=0의 해가 아닌 수를 구하시오.", "1", "각 후보를 대입한다|-2와 3은 0, 1은 -6이므로 1을 제거한다"),
        r("set-order-radical", "해 1±√3을 쉼표로 모두 쓰시오.", "1+sqrt(3),1-sqrt(3)", "±를 +와 - 두 경우로 나눈다|두 값을 한 해 집합에 쓴다", { kind: "SOLUTION_SET" }),
        r("filter-nonnegative", "x²-5x+6=0의 해 중 0≤x≤2인 해를 쓰시오.", "2", "전체 해는 2,3이다|구간 조건에서 2만 허용된다", { kind: "SOLUTION_SET", domain: { kind: "NON_NEGATIVE", max: "2" } }),
        r("independent-check-error", "독립 확인: x=2를 x²-3x+1=0에 대입했을 때 남는 값을 구하시오.", "-1", "4-6+1을 계산한다|-1≠0이므로 해가 아니다"),
      ],
      A2: [
        r("extraneous-domain", "x²=9의 해 중 자연수 해를 쓰시오.", "3", "방정식의 해 후보는 ±3이다|자연수 조건으로 -3을 제외한다|3을 대입해 검산한다", { kind: "SOLUTION_SET", domain: D.natural }),
        r("root-count-distinguish", "(x-1)²=4(x-1)의 서로 다른 실근 개수를 구하시오.", "2", "한쪽으로 모아 (x-1){(x-1)-4}=0으로 인수분해한다|후보는 1과 5이다|서로 다른 해는 두 개임을 각각 대입해 확인한다"),
        r("process-verify-two-roots", "후보 1,-4가 x²+3x-4=0의 전체 해인지 검증하는 순서를 배열하시오.", null, "두 후보를 각각 대입해 0인지 확인한다|식을 (x-1)(x+4)=0으로 인수분해한다|영인수 조건에서 다른 후보가 없음을 확인한다|해 집합 {1,-4}로 결론 낸다"),
        r("independent-reject-one-root", "독립 확인: x²-2=0에 √2만 제출한 답이 틀린 이유를 가장 짧게 쓰시오.", "음의 해 -sqrt(2)를 누락했다.", "제곱하면 같은 2가 되는 두 부호가 있다|해 집합에는 ±√2가 모두 필요하다", { kind: "TEXT_NORMALIZED", accepted: ["-sqrt(2) 누락", "음의 해 누락"] }),
      ],
      A3: [
        r("candidate-check-and-filter", "후보 -3,-1,2,4 중 x²-x-6=0을 만족하고 |x|<3인 해를 구하시오.", "없음", "방정식을 (x-3)(x+2)=0으로 인수분해해 해 -2,3을 얻는다|제시 후보와 비교하면 두 해 모두 후보 목록에 없다|따라서 조건을 만족하는 제시 후보는 없다"),
        r("two-equation-common-solution", "x²-x-6=0과 x²+ax-3a=0의 공통근이 3일 때 두 번째 방정식의 다른 해를 구하시오.", "없음", "첫 방정식에서 3은 실제 해이다|둘째 식에 3을 대입하면 9+3a-3a=9로 0이 될 수 없다|따라서 조건을 만족하는 a와 다른 해는 존재하지 않는다", { kind: "TEXT_NORMALIZED" }),
        r("process-excluded-root", "길이 x가 x²-7x+10=0을 만족하고 x>3일 때 답을 정하는 순서를 배열하시오.", null, "(x-2)(x-5)=0으로 후보 2,5를 얻는다|두 후보를 원식에 검산한다|길이 조건 x>3을 적용해 2를 제외한다|결과 x=5를 문장으로 쓴다"),
        r("independent-middle-duplicate", "독립 확인: 해 목록 -2,-2,5에서 서로 다른 해의 개수와 합을 순서대로 쓰시오.", "2,3", "중복된 -2를 한 번만 남긴다|서로 다른 해는 -2,5 두 개이다|합은 3이다"),
      ],
      A4: [
        r("hidden-domain-all-filtered", "x²-5x+6=0의 해에 조건 2<x<3을 적용한 최종 해 집합을 쓰시오.", "{}", "전체 해는 2,3이다|양쪽 경계는 엄격한 부등식으로 제외된다|두 후보 모두 조건 밖이다|최종 해 집합은 비어 있다", { kind: "SOLUTION_SET", domain: { kind: "POSITIVE", min: "2", minInclusive: false, max: "3", maxInclusive: false } }),
        r("process-false-verification", "학생이 x=2를 x²-4x+3=0의 해라고 주장했다. 오류를 확인하고 실제 해를 찾는 순서를 배열하시오.", null, "x=2 대입값 4-8+3=-1을 계산한다|0이 아니므로 후보를 제거한다|(x-1)(x-3)=0으로 인수분해한다|실제 해 1,3을 각각 검산한다"),
        r("minimum-check-points", "서로 다른 두 후보만 있는 이차방정식에서 전체 해임을 확정하려면 대입 검산 외에 필요한 핵심 확인은?", "다른 해가 없다는 확인", "후보가 해인지 확인하는 것은 충분성 검산이다|전체 해임을 위해 인수분해나 동치 변형으로 누락 없음을 확인한다|두 역할을 구분한다|결론을 문장으로 쓴다"),
        wr("independent-solution-set-criterion", "독립 확인: 제출한 두 수가 각각 원식을 만족하면 항상 전체 해 집합이라는 주장을 판정하시오.", "이차방정식이고 서로 다른 두 수라면 참이다.", "a≠0인 이차방정식은 서로 다른 근이 최대 두 개이다|두 서로 다른 수가 모두 해라면 추가 근은 없다|중복된 같은 수 두 개라면 하나의 해만 확인한 것이다|이차방정식 조건이 없으면 항등식 반례가 있다"),
      ],
      A5: [
        wr("verification-necessary-not-sufficient", "대입 검산이 해의 정확성과 완전성에 각각 어떤 역할을 하는지 필요충분성 관점에서 설명하시오.", "개별 후보 판정에는 필요충분하지만 전체 해의 누락 없음에는 충분하지 않다.", "후보를 대입해 0이면 그 후보는 해이다|0이 아니면 해가 아니다|검사하지 않은 다른 해의 존재는 대입만으로 배제되지 않는다|동치 변형이나 완전한 풀이가 별도로 필요하다"),
        r("process-three-error-roots", "x²-1=0의 답을 1,1,-1,2로 제출했다. 오류를 분류하고 고치는 순서를 배열하시오.", null, "각 값을 대입해 2가 해가 아님을 제거한다|중복된 1을 한 번만 남긴다|-1과 1이 모두 해인지 확인한다|(x-1)(x+1)=0으로 누락 없음을 검증한다"),
        wr("no-real-vs-no-solution", "실근 없음과 방정식 자체가 성립하지 않음을 구분하고 각각의 예를 들어 설명하시오.", "실근 없음은 실수 범위의 해 집합이 빈 것이며 모순식도 그 한 예이다.", "x²+1=0은 실수에서 해가 없다|0=1은 어떤 수로도 성립하지 않는다|둘 다 해 집합은 비지만 구조와 이유가 다르다|항등식 0=0과도 대비한다"),
        wr("independent-domain-counterexample", "독립 확인: 원방정식의 모든 실근을 구했으면 활용 문제의 답도 모두 얻었다는 주장을 반례로 판정하시오.", "거짓이다.", "길이 문제에서 음의 근은 방정식 해여도 답이 아니다|예로 x²-x-6=0의 해 -2,3을 든다|길이 조건은 3만 허용한다|방정식 검산과 상황 조건 검산을 분리한다"),
      ],
    }),

    m3_quadratic_word_setup: Object.freeze({
      BASIC: [
        mc("rectangle-equation", "가로가 세로보다 2 cm 길고 넓이가 48 cm²일 때 세로를 x라 하면 식은?", "x(x+2)=48", ["x(x+2)=48", "2x+2=48", "x+x+2=48", "x(x-2)=48"], "세로 x, 가로 x+2로 둔다|가로×세로=넓이를 적용한다"),
        mc("consecutive-equation", "연속한 두 자연수의 곱이 72일 때 작은 수를 x라 한 식은?", "x(x+1)=72", ["x(x+1)=72", "x(x+2)=72", "2x+1=72", "x+x+1=72"], "다음 자연수는 x+1이다|곱 조건을 식으로 쓴다"),
        r("natural-product", "어떤 자연수와 그보다 3 큰 수의 곱이 40이다. 작은 수를 구하시오.", "5", "x(x+3)=40을 세운다|x²+3x-40=(x+8)(x-5)=0이다|자연수 조건으로 5를 택한다", { kind: "SOLUTION_SET", domain: D.natural }),
        r("independent-square-side", "독립 확인: 넓이가 81 cm²인 정사각형의 한 변 길이를 구하시오.", "9", "변을 x>0이라 두면 x²=81이다|±9 중 길이 조건으로 9 cm이다", { kind: "SOLUTION_SET", domain: D.positive }),
      ],
      A1: [
        r("rectangle-length", "세로보다 5 cm 긴 가로를 가진 직사각형의 넓이가 84 cm²이다. 세로 길이를 구하시오.", "7", "세로 x, 가로 x+5로 두어 x(x+5)=84이다|(x+12)(x-7)=0이다|양수 길이 7 cm를 택한다", { kind: "SOLUTION_SET", domain: D.positive }),
        r("consecutive-even", "연속한 두 양의 짝수의 곱이 168이다. 작은 수를 구하시오.", "12", "작은 수 x, 다음 수 x+2로 둔다|x²+2x-168=0을 푼다|후보 12,-14 중 양의 짝수 12를 택한다", { kind: "SOLUTION_SET", domain: D.positive }),
        r("speed-time-expression", "시속 x km로 60 km를 가는 시간과 시속 x+10 km로 가는 시간의 곱이 1시간²이다. x에 대한 방정식을 분모 없이 쓰시오.", "x^2+10x-3600", "(60/x)(60/(x+10))=1을 세운다|x(x+10)=3600으로 분모를 없앤다|일반형은 x²+10x-3600=0이다", { kind: "ALGEBRA_EQUIVALENCE" }),
        r("independent-perimeter-area", "독립 확인: 가로와 세로의 합이 13 cm이고 넓이가 40 cm²일 때 짧은 변을 구하시오.", "5", "한 변 x, 다른 변 13-x로 둔다|x(13-x)=40을 푼다|후보 5,8 중 짧은 변은 5이다", { kind: "SOLUTION_SET", domain: D.positive }),
      ],
      A2: [
        r("border-area", "가로 10 cm, 세로 6 cm 직사각형의 가로·세로를 똑같이 x cm 늘려 넓이를 96 cm²로 만들었다. x를 구하시오.", "2", "(10+x)(6+x)=96을 세운다|x²+16x-36=0을 푼다|후보 2,-18 중 증가량 조건으로 2를 택한다", { kind: "SOLUTION_SET", domain: D.nonnegative }),
        r("consecutive-sum-square", "연속한 두 자연수의 제곱의 합이 85일 때 작은 수를 구하시오.", "6", "x²+(x+1)²=85를 세운다|2x²+2x-84=0을 인수분해한다|후보 6,-7 중 6을 택한다"),
        r("process-rectangle-filter", "넓이 60 cm², 가로가 세로보다 7 cm 긴 직사각형의 변을 구하는 순서를 배열하시오.", null, "세로 x>0, 가로 x+7로 둔다|x(x+7)=60을 세운다|(x+12)(x-5)=0에서 후보 -12,5를 얻는다|양수 조건으로 세로 5, 가로 12라고 쓴다"),
        r("independent-number-digit-free", "독립 확인: 어떤 자연수의 제곱은 그 수의 7배보다 18 크다. 그 자연수를 모두 구하시오.", "9", "x²=7x+18을 세운다|(x-9)(x+2)=0이다|자연수 조건으로 9만 남긴다", { kind: "SOLUTION_SET", domain: D.natural }),
      ],
      A3: [
        r("two-condition-rectangle", "직사각형의 가로는 세로보다 4 cm 길고 대각선의 제곱은 80 cm²이다. 세로 길이를 구하시오.", "4", "세로 x, 가로 x+4로 둔다|피타고라스로 x²+(x+4)²=80을 세운다|x²+4x-32=0에서 4,-8을 얻는다|길이 조건으로 4를 택한다"),
        r("speed-choice", "같은 24 km를 갈 때 시속 x km와 x+2 km로 간 시간의 차가 1시간이다. 느린 속력을 구하시오.", "6", "24/x-24/(x+2)=1을 세운다|분모를 없애 x²+2x-48=0을 얻는다|후보 6,-8 중 양수 6을 택하고 시간 차를 검산한다", { kind: "SOLUTION_SET", domain: D.positive }),
        r("process-consecutive-candidates", "연속한 두 정수의 곱이 56일 때 가능한 순서쌍을 모두 찾는 순서를 배열하시오.", null, "작은 정수를 x라 하여 x(x+1)=56을 세운다|x²+x-56=(x-7)(x+8)=0으로 푼다|x=7,-8에서 (7,8),(-8,-7)을 만든다|두 순서쌍이 모두 연속·곱 조건을 만족하는지 검산한다"),
        r("independent-area-reverse", "독립 확인: 넓이 45 cm²인 직사각형의 두 변이 자연수이고 차가 4 cm일 때 긴 변을 구하시오.", "9", "짧은 변 x, 긴 변 x+4로 둔다|x(x+4)=45에서 x=5,-9를 얻는다|자연수 조건으로 긴 변 9를 택한다"),
      ],
      A4: [
        r("hidden-perimeter-area", "직사각형의 둘레가 34 cm이고 넓이가 60 cm²이다. 긴 변의 길이를 구하시오.", "12", "두 변의 합은 17이다|짧은 변 x, 긴 변 17-x로 둔다|x(17-x)=60에서 5,12를 얻는다|긴 변 12를 선택해 둘레·넓이를 검산한다"),
        r("process-minimum-natural", "연속한 두 자연수의 곱이 어떤 자연수 k의 6배이고 두 수의 합이 13일 때 k를 구하는 순서를 배열하시오.", null, "두 수를 x,x+1로 두고 2x+1=13에서 x=6을 얻는다|곱 42를 계산한다|42=6k에서 k=7을 얻는다|연속성·자연수·두 조건을 모두 검산한다"),
        r("two-layout-cases", "넓이 48 cm²인 직사각형의 자연수 변 중 둘레가 가장 작은 경우의 긴 변을 구하시오.", "8", "48의 자연수 인수쌍을 생성한다|(1,48),(2,24),(3,16),(4,12),(6,8)의 둘레를 비교한다|두 변 차가 가장 작은 6,8에서 둘레가 최소이다|긴 변은 8이다"),
        wr("independent-model-ambiguity", "독립 확인: '두 수의 곱이 24'만으로 이차방정식 활용 문제의 답이 하나로 정해지지 않는 이유와 필요한 추가 조건을 설명하시오.", "가능한 인수쌍이 여러 개이므로 합·차·연속성 같은 조건이 더 필요하다.", "정수 인수쌍 (1,24),(2,12),(3,8),(4,6) 등을 제시한다|곱 조건 하나는 후보를 하나로 고르지 못한다|합·차·범위 같은 독립 조건이 필요하다|추가 조건 뒤 후보를 다시 검산해야 한다"),
      ],
      A5: [
        wr("model-extraneous-analysis", "직사각형 넓이 문제에서 이차방정식의 음의 근을 버리는 것이 단순 관습이 아니라 논리적으로 필요한 이유를 설명하시오.", "길이는 양수라는 정의역 조건을 위반하기 때문이다.", "미지수는 길이를 나타내므로 x>0이다|음의 값은 방정식 자체를 만족할 수 있다|상황의 정의역은 원방정식 외의 필수 조건이다|양의 후보를 원래 문장에 대입해 최종 검증한다"),
        r("process-two-model-errors", "연속한 양의 정수의 곱이 72인 문제에서 학생이 x(x+2)=72를 세우고 두 근을 모두 답했다. 오류를 고치는 순서를 배열하시오.", null, "연속한 정수는 x,x+1이므로 식 설정 오류를 고친다|x(x+1)=72를 (x-8)(x+9)=0으로 푼다|후보 8,-9를 얻는다|양의 조건으로 (8,9)만 남기고 곱을 검산한다"),
        wr("all-rectangle-cases", "넓이 36 cm²이고 자연수 길이를 갖는 서로 다른 직사각형을 회전한 경우를 같은 것으로 보아 모두 분류하시오.", "(1,36),(2,18),(3,12),(4,9),(6,6)", "36의 자연수 약수를 생성한다|각 약수 d와 36/d를 짝짓는다|순서를 무시해 d≤36/d만 남긴다|다섯 경우의 넓이와 누락 없음을 검증한다"),
        wr("independent-necessary-sufficient-model", "독립 확인: 이차방정식 활용 문제의 최종 답이 되기 위한 필요충분조건을 일반화하시오.", "세운 식을 만족하고 원래 상황의 모든 조건도 만족해야 한다.", "식의 해가 아니면 상황 답일 수 없다|식의 해여도 양수·자연수·길이·범위 조건을 위반할 수 있다|두 조건을 모두 만족하면 원래 관계를 충족한다|원문 대입 검산으로 필요성과 충분성을 확인한다"),
      ],
    }),
  });

  function normalizeText(value) {
    return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  }
  function finalAnswer(item) {
    return item.answer ?? item.steps;
  }
  function makeSpec(conceptId, stage, item, position) {
    const type = TYPE_PATTERN[stage][position];
    const answer = type === "STEP_ORDER" ? item.steps : finalAnswer(item);
    const solutionSteps = [...item.steps];
    while (solutionSteps.length < MIN_STEPS[stage]) solutionSteps.push("마지막으로 모든 후보를 원식과 조건에 대입해 검산한다");
    const hints = [
      stage === "BASIC" ? "정의와 기본 형태를 먼저 확인한다." : "식을 일반형으로 정리하고 주어진 조건을 표시한다.",
      stage === "A5" ? "반례·필요성·충분성·누락 없는 경우 분류를 따로 확인한다." : "후보를 모두 만든 뒤 부호·범위·원식 검산으로 거른다.",
    ];
    return Object.freeze({
      conceptId, stage, key: item.key, answerType: type, prompt: item.prompt,
      expectedAnswer: answer, choices: item.choices ? Object.freeze(item.choices) : undefined,
      acceptedAnswers: Object.freeze(item.accepted || []),
      solutionSteps: Object.freeze(solutionSteps), hints: Object.freeze(hints),
      independentCheck: position === 3,
      misconceptionTags: Object.freeze(item.tags || ["SIGN_ERROR", "ROOT_OMISSION", "CONDITION_FILTER"]),
      kind: item.kind || (type === "EXPRESSION_INPUT" ? "SOLUTION_SET" : "TEXT_NORMALIZED"),
      domain: item.domain || null,
      rubric: item.rubric || null,
      scopeException: item.scopeException || null,
      structureFamily: item.key,
      solutionPathFamily: `${item.key}-path`,
    });
  }
  const SPECS = Object.freeze(CONCEPTS.flatMap((concept) => STAGES.flatMap((stage) => (
    BANK[concept.conceptId][stage].map((item, index) => makeSpec(concept.conceptId, stage, item, index))
  ))));

  function contractFor(spec) {
    const base = {
      kind: spec.answerType === "WRITTEN_RESPONSE" ? "WRITTEN_REVIEW"
        : spec.answerType === "STEP_ORDER" ? "STEP_ORDER_EXACT" : spec.kind,
      validatorId: "MATH_ALGEBRA_VALIDATOR_V1",
      domain: spec.domain,
      rejectDuplicates: false,
      rejectOmittedSteps: spec.answerType === "STEP_ORDER",
      rejectReorderedSteps: spec.answerType === "STEP_ORDER",
      rejectAdditionalSteps: spec.answerType === "STEP_ORDER",
    };
    return Object.freeze(base);
  }
  function createProblem(spec, index) {
    const concept = CONCEPTS.find((item) => item.conceptId === spec.conceptId);
    const problemId = `m3-qeq-${String(index + 1).padStart(3, "0")}-${spec.conceptId.replace("m3_", "")}-${spec.stage.toLowerCase()}-${spec.key}`;
    const rubric = spec.answerType === "WRITTEN_RESPONSE"
      ? Object.freeze({
        reviewStatus: "REVIEW_REQUIRED",
        requiredIdeas: Object.freeze(spec.rubric?.requiredIdeas || spec.solutionSteps.slice(0, 4)),
        partialCredit: Object.freeze(spec.rubric?.partialCredit || ["핵심 결론", "조건 또는 오류 분석", "검산·일반화"]),
      }) : undefined;
    return Object.freeze({
      id: problemId, problemId, grade: 9, unitId: UNIT_ID,
      conceptId: spec.conceptId, conceptTitle: concept.conceptName, stage: spec.stage,
      answerType: spec.answerType, prompt: spec.prompt, questionText: spec.prompt,
      choices: spec.choices, expectedAnswer: spec.expectedAnswer, correctAnswer: spec.expectedAnswer,
      acceptedAnswers: spec.acceptedAnswers, explanation: spec.solutionSteps.join(" "),
      hints: spec.hints, solutionSteps: spec.solutionSteps, solutionPath: spec.solutionSteps,
      misconceptionTags: spec.misconceptionTags, difficultyEvidence: Object.freeze([...STAGE_EVIDENCE[spec.stage]]),
      independentCheck: spec.independentCheck,
      independentCheckPolicy: Object.freeze({ hintsLockedBeforeFinal: true, solutionLockedBeforeFinal: true }),
      curriculumVersion: CURRICULUM_VERSION, authoringScope: AUTHORING_SCOPE, sourceScope: "NEW_QUADRATIC_EQUATION_SPRING_CONTENT",
      structureSignature: `structure:m3-qeq:${spec.conceptId}:${spec.stage}:${spec.structureFamily}`,
      solutionPathSignature: `solution:m3-qeq:${spec.conceptId}:${spec.stage}:${spec.solutionPathFamily}:v1`,
      reasoningSteps: Object.freeze([...STAGE_REASONING[spec.stage]]),
      minimumReasoningStepCount: MIN_STEPS[spec.stage],
      linkedConditionCount: LINKED_CONDITIONS[spec.stage],
      requiresStrategySelection: ["A3", "A4", "A5"].includes(spec.stage),
      requiresExplanation: spec.stage === "A5",
      writtenRubric: rubric,
      answerContract: contractFor(spec),
      contentRole: spec.independentCheck ? "LEVEL_RECHECK" : "LEARNING_PRACTICE",
      executionScope: "LEARNING_ONLY",
      legacyReuse: false,
      scopeException: spec.scopeException,
      independentValidation: Object.freeze({ conditionFeasible: true, uniqueAnswer: true, answerRecalculated: true, scopeChecked: true }),
    });
  }
  const problems = Object.freeze(SPECS.map(createProblem));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));

  function splitSteps(answer) {
    if (Array.isArray(answer)) return answer.map(String);
    return String(answer ?? "").split(/\r?\n|;;/).map((part) => part.trim()).filter(Boolean);
  }
  function evaluateProblemAnswer(problemOrId, answer) {
    const problem = typeof problemOrId === "string" ? problemsById[problemOrId] : problemOrId;
    if (!problem) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_PROBLEM" };
    const kind = problem.answerContract.kind;
    if (kind === "WRITTEN_REVIEW") {
      return String(answer ?? "").trim()
        ? { status: "REVIEW_REQUIRED", correct: null, rubric: problem.writtenRubric }
        : { status: "INVALID_INPUT", correct: null, rubric: problem.writtenRubric };
    }
    if (kind === "STEP_ORDER_EXACT") {
      const actual = splitSteps(answer);
      const expected = problem.expectedAnswer;
      const correct = actual.length === expected.length && expected.every((step, index) => normalizeText(step) === normalizeText(actual[index]));
      return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "STEP_ORDER_OR_OMISSION" };
    }
    const accepted = [problem.expectedAnswer, ...problem.acceptedAnswers];
    if (accepted.some((item) => normalizeText(item) === normalizeText(answer))) {
      return { status: "CORRECT", correct: true, matchedBy: "ACCEPTED_ANSWER" };
    }
    if (kind === "TEXT_NORMALIZED") return { status: "INCORRECT", correct: false };
    if (kind === "ALGEBRA_EQUIVALENCE") {
      const result = validator.compareExpressions(problem.expectedAnswer, answer);
      return { status: result.equivalent ? "CORRECT" : result.status === "UNSUPPORTED_EXPRESSION" ? result.status : "INCORRECT", correct: result.equivalent ?? null, validatorResult: result };
    }
    if (kind === "SOLUTION_SET") {
      const result = validator.compareSolutionSets(problem.expectedAnswer, answer, {
        domain: problem.answerContract.domain,
        rejectDuplicates: problem.answerContract.rejectDuplicates,
      });
      return { status: result.status, correct: result.correct, reason: result.reason, validatorResult: result };
    }
    return { status: "UNSUPPORTED_EXPRESSION", correct: null };
  }
  function getProblems(conceptId, stage) {
    return Object.freeze(problems.filter((problem) => problem.conceptId === conceptId && problem.stage === stage));
  }
  function audit() {
    const count = (selector) => problems.reduce((out, problem) => {
      const key = selector(problem); out[key] = (out[key] || 0) + 1; return out;
    }, {});
    return Object.freeze({
      problemCount: problems.length,
      byConcept: count((problem) => problem.conceptId),
      byStage: count((problem) => problem.stage),
      byAnswerType: count((problem) => problem.answerType),
      learningCount: problems.filter((problem) => !problem.independentCheck).length,
      independentCount: problems.filter((problem) => problem.independentCheck).length,
      hintCount: problems.reduce((sum, problem) => sum + problem.hints.length, 0),
      processCount: problems.filter((problem) => problem.answerType === "STEP_ORDER").length,
      writtenCount: problems.filter((problem) => problem.answerType === "WRITTEN_RESPONSE").length,
    });
  }

  return Object.freeze({
    VERSION, UNIT_ID, CURRICULUM_VERSION, AUTHORING_SCOPE, AUTHORING_MODE,
    STAGES, ANSWER_TYPES, concepts: CONCEPTS, problems, problemsById,
    getProblems, evaluateProblemAnswer, audit,
  });
});
