(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_FACTORIZATION_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-factorization-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const FUTURE_CURRICULUM_COMPATIBILITY = "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);

  const CONCEPTS = Object.freeze([
    Object.freeze({
      conceptId: "m3_polynomial_multiplication",
      title: "다항식의 곱셈",
      order: 1,
      coreConcept: "분배법칙을 반복하여 각 항을 빠짐없이 곱한 뒤, 같은 문자와 같은 차수를 가진 동류항끼리 모아 정리한다.",
      easyExample: "(x+2)(x+3)=x²+3x+2x+6=x²+5x+6이다.",
      commonMistakes: "한 항에만 곱하거나, 음수를 괄호 전체에 분배하지 않거나, 3x와 2x를 5x²로 잘못 합치는 경우가 많다.",
      procedure: "각 항의 곱 표시 → 계수와 문자 계산 → 부호 확인 → 동류항 분류 → 내림차순 정리의 순서로 계산한다.",
      verification: "간단한 x 값을 원래 식과 전개식에 각각 대입하여 값이 같은지 확인하고, 최고차항과 상수항도 따로 비교한다.",
      prerequisites: Object.freeze(["분배법칙", "단항식의 곱셈", "동류항", "정수의 부호 계산"]),
      nextConnection: "다항식의 곱셈은 곱셈 공식을 이해하고 인수분해 결과를 다시 전개해 검산하는 바탕이 된다.",
    }),
    Object.freeze({
      conceptId: "m3_multiplication_formula",
      title: "곱셈 공식",
      order: 2,
      coreConcept: "(a+b)², (a-b)², (a+b)(a-b), (x+a)(x+b)의 구조를 식의 모양에 맞게 선택하여 전개한다.",
      easyExample: "(x-4)²=x²-8x+16이고, (x+4)(x-4)=x²-16이다.",
      commonMistakes: "차의 제곱과 제곱의 차를 혼동하거나, 완전제곱식의 가운데항 2ab를 빠뜨리거나 부호를 틀린다.",
      procedure: "두 항의 구조 확인 → 알맞은 공식 선택 → 각 자리에 항 전체 대입 → 가운데항과 부호 확인 → 동류항 정리 순서로 진행한다.",
      verification: "선택한 공식의 결과를 분배법칙으로 다시 전개해 같은지 확인하고, 가운데항과 상수항을 우선 비교한다.",
      prerequisites: Object.freeze(["다항식의 곱셈", "제곱수", "분배법칙", "부호 계산"]),
      nextConnection: "곱셈 공식의 전개 방향을 거꾸로 읽으면 완전제곱식과 제곱의 차 인수분해가 된다.",
    }),
    Object.freeze({
      conceptId: "m3_common_factor",
      title: "공통인수로 인수분해",
      order: 3,
      coreConcept: "모든 항에 공통으로 들어 있는 숫자와 문자의 최대 공통인수를 괄호 밖으로 묶고, 괄호 안에 공통인수가 남지 않게 한다.",
      easyExample: "12x²+18x=6x(2x+3)이다.",
      commonMistakes: "값이 같은 식을 만들었다는 이유만으로 괄호 안에 2나 x가 남은 불완전한 인수분해를 끝이라고 판단하기 쉽다.",
      procedure: "계수의 최대공약수 → 공통 문자의 최소 지수 → 필요하면 음수 부호 선택 → 각 항을 나눈 몫 작성 → 괄호 안 완전성 확인 순서로 묶는다.",
      verification: "괄호 안 계수들의 최대공약수가 1인지, 모든 항에 공통인 문자가 없는지 확인한 뒤 다시 전개한다.",
      prerequisites: Object.freeze(["최대공약수", "문자의 지수", "분배법칙", "다항식의 항"]),
      nextConnection: "공통인수는 다른 인수분해 공식을 적용하기 전에 가장 먼저 확인해야 하는 공통 전략이다.",
    }),
    Object.freeze({
      conceptId: "m3_factor_perfect_square",
      title: "완전제곱식의 인수분해",
      order: 4,
      coreConcept: "첫째항과 끝항이 각각 제곱이고 가운데항이 두 제곱근의 곱의 ±2배이면 (A±B)²로 인수분해된다.",
      easyExample: "x²-10x+25=(x-5)²이다.",
      commonMistakes: "양 끝이 제곱이라는 사실만 보고 가운데항을 확인하지 않거나, 가운데항은 음수인데 괄호 안을 +로 쓴다.",
      procedure: "양 끝 항의 제곱근 찾기 → 가운데항이 ±2AB인지 확인 → 부호 결정 → (A±B)² 작성 → 재전개 순서로 판정한다.",
      verification: "인수분해 결과를 제곱 공식으로 전개하여 첫째항·가운데항·끝항 세 계수를 모두 비교한다.",
      prerequisites: Object.freeze(["곱셈 공식", "제곱수", "공통인수", "계수 비교"]),
      nextConnection: "완전제곱식 판별은 이차방정식의 인수분해와 식의 구조 분석으로 이어진다.",
    }),
    Object.freeze({
      conceptId: "m3_factor_difference_squares",
      title: "제곱의 차의 인수분해",
      order: 5,
      coreConcept: "A²-B²는 (A+B)(A-B)로 인수분해되며, 제곱의 합에는 이 공식을 적용하지 않는다.",
      easyExample: "9x²-16=(3x+4)(3x-4)이다.",
      commonMistakes: "A²+B²에도 합차 공식을 적용하거나, 공통인수를 먼저 묶지 않거나, 복합식 A 전체를 제곱의 밑으로 보지 못한다.",
      procedure: "최대 공통인수 확인 → 두 항이 제곱인지 확인 → 두 항 사이가 빼기인지 확인 → 합과 차 인수 작성 → 각 괄호 정리 순서로 계산한다.",
      verification: "두 일차인수를 곱해 가운데항이 소거되고 원래 두 제곱의 부호가 그대로 나오는지 확인한다.",
      prerequisites: Object.freeze(["곱셈 공식", "공통인수", "완전제곱수", "부호 계산"]),
      nextConnection: "제곱의 차는 합과 곱 인수분해와 함께 이차식의 구조를 빠르게 분류하는 기준이 된다.",
    }),
    Object.freeze({
      conceptId: "m3_factor_sum_product",
      title: "합과 곱을 이용한 인수분해",
      order: 6,
      coreConcept: "x²+mx+n에서 합이 m이고 곱이 n인 두 정수 a,b를 찾으면 (x+a)(x+b)로 인수분해된다.",
      easyExample: "x²+x-12는 합이 1, 곱이 -12인 4와 -3을 찾아 (x+4)(x-3)으로 인수분해한다.",
      commonMistakes: "곱만 맞는 인수쌍을 선택하거나, 상수항과 가운데항의 부호로 두 수의 부호를 먼저 판단하지 않는다.",
      procedure: "공통인수 확인 → 상수항의 인수쌍 생성 → 부호 분류 → 합 조건으로 필터 → 인수 작성 → 전개 검산 순서로 진행한다.",
      verification: "선택한 두 수의 합과 곱을 각각 확인하고, 두 일차식을 다시 곱해 세 항이 원식과 일치하는지 본다.",
      prerequisites: Object.freeze(["정수의 인수쌍", "부호 계산", "다항식의 곱셈", "공통인수"]),
      nextConnection: "합과 곱 인수분해는 이차방정식을 곱이 0인 식으로 바꾸는 직접적인 선수 개념이다.",
    }),
  ]);

  const STAGE_METHODS = Object.freeze({
    BASIC: Object.freeze({
      thinkingMethod: "정의와 한 가지 기본 성질을 정확히 적용한다.",
      conditionFocus: "계수, 부호, 공통인수, 공식의 모양 중 바로 보이는 핵심 조건을 표시한다.",
      strategy: "한 단계 계산 뒤 식의 모양을 확인한다.",
      validation: "한 번 재전개하거나 대응 계수 한 곳을 확인한다.",
    }),
    A1: Object.freeze({
      thinkingMethod: "한 단계 변형 후 부호·계수·동류항을 함께 처리한다.",
      conditionFocus: "직접 보이지 않는 계수나 인수를 한 번의 변형으로 찾는다.",
      strategy: "기본 공식을 선택한 뒤 누락 없이 계산한다.",
      validation: "가운데항과 상수항을 독립적으로 비교한다.",
    }),
    A2: Object.freeze({
      thinkingMethod: "두 성질을 연결하고, 값의 동치와 완전한 형태를 구분한다.",
      conditionFocus: "공통인수와 공식, 전개와 인수분해, 합과 곱 조건을 두 단계로 나눈다.",
      strategy: "먼저 구조를 단순화하고 두 번째 성질을 적용한다.",
      validation: "대표 오류와 자신의 결과를 재전개하여 차이를 확인한다.",
    }),
    A3: Object.freeze({
      thinkingMethod: "한 문제 안의 둘 이상의 조건을 연결해 후보를 만들고 거른다.",
      conditionFocus: "역추론, 부호, 범위, 정수 조건 중 실제로 답을 제한하는 조건을 찾는다.",
      strategy: "후보 생성 → 조건 필터 → 원식 검산의 흐름을 구성한다.",
      validation: "남은 후보가 유일하고 모든 원래 조건을 만족하는지 확인한다.",
    }),
    A4: Object.freeze({
      thinkingMethod: "숨은 조건과 여러 경우를 드러내고 가장 효율적인 공식을 선택한다.",
      conditionFocus: "역조건, 범위, 최소성, 부호 분기와 완전성 조건을 동시에 추적한다.",
      strategy: "가능한 구조를 분류한 뒤 불가능한 경우를 근거로 제거한다.",
      validation: "누락된 경우가 없는지와 원식의 값 동치를 모두 확인한다.",
    }),
    A5: Object.freeze({
      thinkingMethod: "필요충분조건, 반례, 오류 분석, 완전 분류 가운데 둘 이상을 사용해 전략을 스스로 구성한다.",
      conditionFocus: "단순 계산 결과가 아니라 주장이 성립하는 정확한 조건과 예외를 찾는다.",
      strategy: "일반형 설정 → 조건 도출 → 반례 또는 모든 경우 검토 → 충분성 검증 순서로 논증한다.",
      validation: "결론의 역이 성립하는지, 반례가 실제로 주장을 깨는지, 모든 경우를 다루었는지 확인한다.",
    }),
  });

  const CONTENT = Object.freeze(Object.fromEntries(CONCEPTS.map((concept) => [
    concept.conceptId,
    Object.freeze(Object.fromEntries(STAGES.map((stage) => {
      const method = STAGE_METHODS[stage];
      return [stage, Object.freeze({
        conceptId: concept.conceptId,
        conceptTitle: concept.title,
        stage,
        title: `${concept.title} · ${stage}`,
        coreConcept: concept.coreConcept,
        easyExample: concept.easyExample,
        commonMistakes: concept.commonMistakes,
        procedure: concept.procedure,
        verification: concept.verification,
        prerequisites: concept.prerequisites,
        nextConnection: concept.nextConnection,
        thinkingMethod: method.thinkingMethod,
        firstCondition: `${method.conditionFocus} ${concept.procedure}`,
        conceptToUse: concept.coreConcept,
        whyEquation: "문장 조건을 계수 관계, 인수 관계, 부호 조건 또는 항등식으로 정확히 바꾸기 위해 식을 세운다.",
        solutionConnection: `${method.strategy} ${concept.nextConnection}`,
        commonMistake: concept.commonMistakes,
        validationMethod: `${method.validation} ${concept.verification}`,
        curriculumVersion: CURRICULUM_VERSION,
        futureCurriculumCompatibility: FUTURE_CURRICULUM_COMPATIBILITY,
      })];
    }))),
  ])));

  return Object.freeze({
    VERSION,
    CURRICULUM_VERSION,
    FUTURE_CURRICULUM_COMPATIBILITY,
    STAGES,
    CONCEPTS,
    CONTENT,
    get(conceptId, stage) {
      return CONTENT[conceptId]?.[stage] || null;
    },
  });
});
