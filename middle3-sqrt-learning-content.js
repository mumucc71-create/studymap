(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_SQRT_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-sqrt-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const FUTURE_CURRICULUM_COMPATIBILITY = "2022_REVISED_MIDDLE_SCHOOL_MATH_EXTENSIBLE";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);

  const CONCEPTS = Object.freeze([
    Object.freeze({
      conceptId: "m3_sqrt_meaning",
      title: "제곱근의 뜻과 기호",
      order: 1,
      coreConcept: "a≥0일 때 제곱하여 a가 되는 수를 a의 제곱근이라 하고, √a는 그중 음이 아닌 값을 뜻한다. 따라서 √(x²)=|x|이다.",
      easyExample: "25의 제곱근은 -5와 5이고, √25의 값은 5이다.",
      commonMistakes: "√25를 ±5라고 쓰거나, x의 부호를 확인하지 않고 √(x²)=x라고 쓰는 실수가 많다.",
      procedure: "제곱근의 대상 확인 → √ 기호인지 두 제곱근인지 구분 → 문자 조건으로 절댓값의 부호 결정 → 원래 조건에 대입한다.",
      verification: "구한 값을 제곱해 처음 수가 되는지, √ 기호의 값이 음이 아닌지 확인한다.",
      prerequisites: Object.freeze(["자연수와 정수의 제곱", "절댓값", "부등호와 수의 대소"]),
      nextConnection: "제곱근의 뜻은 근호 값 계산, 무리수 판정, 근호식 정리의 출발점이 된다.",
    }),
    Object.freeze({
      conceptId: "m3_sqrt_value",
      title: "제곱근의 값",
      order: 2,
      coreConcept: "완전제곱수와 분수·소수의 제곱 구조를 찾아 음이 아닌 제곱근 값을 계산한다.",
      easyExample: "√144=12이고, √(9/16)=3/4이다.",
      commonMistakes: "소수점 자리나 분수의 분자·분모 중 한쪽에만 제곱근을 적용하는 실수가 많다.",
      procedure: "수를 소인수 또는 제곱 꼴로 바꾸기 → 분자와 분모를 각각 확인하기 → 음이 아닌 값을 선택하기 → 제곱으로 검산한다.",
      verification: "계산 결과를 제곱하여 원래 근호 안의 수와 정확히 같은지 확인한다.",
      prerequisites: Object.freeze(["제곱근의 뜻", "분수와 소수의 제곱", "완전제곱수"]),
      nextConnection: "정확한 제곱근 값 계산은 근호 간소화와 근호식 사칙연산에 사용된다.",
    }),
    Object.freeze({
      conceptId: "m3_irrational_number",
      title: "무리수와 실수",
      order: 3,
      coreConcept: "유리수는 두 정수의 비로 나타낼 수 있고, 무리수는 그렇게 나타낼 수 없는 실수이다. 근호가 있어도 계산 결과에 따라 유리수일 수 있다.",
      easyExample: "√2는 무리수지만 √8/√2=2는 유리수이다.",
      commonMistakes: "근호가 보이면 무조건 무리수라고 하거나, 무리수끼리 계산하면 언제나 무리수라고 단정한다.",
      procedure: "근호식 먼저 정리 → 완전제곱 여부 확인 → 소거·곱셈 결과 확인 → 유리수 정의로 최종 분류한다.",
      verification: "간소화한 결과가 정수·분수·유한소수·순환소수인지, 근호가 실제로 남는지 확인한다.",
      prerequisites: Object.freeze(["유리수", "순환소수", "제곱근의 값"]),
      nextConnection: "무리수 판정은 실수의 대소 비교와 근호식 계산 결과 검증에 연결된다.",
    }),
    Object.freeze({
      conceptId: "m3_radical_simplification",
      title: "근호식의 간단한 표현",
      order: 4,
      coreConcept: "근호 안의 수에서 완전제곱인 인수를 찾아 √(a²b)=|a|√b로 정리하고, 근호 안에는 제곱인 인수가 남지 않게 한다.",
      easyExample: "√12=√(4×3)=2√3이다.",
      commonMistakes: "√(a+b)=√a+√b로 나누거나, 음수인 문자를 근호 밖으로 꺼낼 때 절댓값을 빠뜨린다.",
      procedure: "소인수분해 → 지수가 짝인 묶음 찾기 → 한 쌍당 하나를 근호 밖으로 이동 → 근호 안 제곱 인수 재확인한다.",
      verification: "정리한 식을 제곱하거나 다시 근호 안으로 넣어 원래 수와 같은지 확인한다.",
      prerequisites: Object.freeze(["소인수분해", "제곱근의 뜻", "절댓값"]),
      nextConnection: "같은 근호를 만드는 과정은 근호식의 덧셈·뺄셈과 분모 유리화의 기반이 된다.",
    }),
    Object.freeze({
      conceptId: "m3_radical_operations",
      title: "근호식의 계산",
      order: 5,
      coreConcept: "같은 근호끼리 계수를 계산하고, 곱셈 공식과 켤레를 이용해 곱셈·나눗셈·분모 유리화를 정확히 수행한다.",
      easyExample: "3√2+5√2=8√2이고, (√7+1)(√7-1)=6이다.",
      commonMistakes: "서로 다른 근호를 더하거나, 분모를 유리화할 때 분자에는 같은 수를 곱하지 않는 실수가 많다.",
      procedure: "각 근호 간소화 → 같은 근호끼리 정리 → 곱셈 공식 또는 켤레 선택 → 분모 확인 → 원래 식과 수치 비교한다.",
      verification: "전개해 다시 묶거나 켤레의 곱을 확인하고, 양수 근삿값을 대입해 부호와 크기를 검산한다.",
      prerequisites: Object.freeze(["근호식 간소화", "분배법칙", "곱셈 공식", "분수의 계산"]),
      nextConnection: "근호식 계산은 이차방정식의 해와 좌표·도형에서 나타나는 정확한 길이 계산으로 이어진다.",
    }),
  ]);

  const STAGE_METHODS = Object.freeze({
    BASIC: Object.freeze({
      thinkingMethod: "정의와 기호를 구분하고 한 가지 성질을 바로 적용한다.",
      conditionFocus: "부호, 완전제곱 여부, 근호의 대상을 먼저 표시한다.",
      strategy: "대표 정의나 계산 절차를 한 번 적용한다.",
      validation: "결과를 제곱하거나 원래 식에 대입해 바로 확인한다.",
    }),
    A1: Object.freeze({
      thinkingMethod: "표현을 한 번 바꾸어 기본 성질을 정확히 적용한다.",
      conditionFocus: "분수·소수·부호 조건 중 결과를 바꾸는 조건을 찾는다.",
      strategy: "제곱 꼴이나 같은 근호 꼴로 바꾼 뒤 계산한다.",
      validation: "변형 전후 값을 제곱 또는 역변환으로 비교한다.",
    }),
    A2: Object.freeze({
      thinkingMethod: "두 기본 성질을 연결하고 흔한 오류와 올바른 계산을 구분한다.",
      conditionFocus: "먼저 간소화할 부분과 나중에 결합할 부분을 나눈다.",
      strategy: "각 부분을 독립적으로 정리한 뒤 공통 표현으로 연결한다.",
      validation: "부호·분모·제곱 인수가 빠지지 않았는지 단계별로 확인한다.",
    }),
    A3: Object.freeze({
      thinkingMethod: "여러 조건을 하나의 식 안에서 연결하고 최소 세 단계의 풀이를 구성한다.",
      conditionFocus: "정수·자연수·부호 조건이 어느 단계에서 필요한지 구분한다.",
      strategy: "조건을 식으로 변환하고, 계산 순서를 선택한 뒤 남은 조건으로 값을 결정한다.",
      validation: "구한 값이 모든 조건을 동시에 만족하는지 확인한다.",
    }),
    A4: Object.freeze({
      thinkingMethod: "숨은 조건과 역추론을 이용해 여러 표현을 오가며 경우를 분류한다.",
      conditionFocus: "완전제곱 조건, 범위, 부호, 유리수 조건을 먼저 고정한다.",
      strategy: "가능한 구조를 줄인 뒤 가장 정보가 많은 조건부터 역으로 사용한다.",
      validation: "누락된 경우가 없는지와 근삿값·원식 대입 결과를 함께 확인한다.",
    }),
    A5: Object.freeze({
      thinkingMethod: "전략을 선택하고 오류 가능성을 분석하며 풀이 근거와 검산을 설명한다.",
      conditionFocus: "숨은 절댓값, 정의역, 켤레, 완전제곱 구조를 모두 표시한다.",
      strategy: "여러 풀이 후보를 비교해 가장 안전한 경로를 선택하고 각 변형의 근거를 남긴다.",
      validation: "대안 풀이 또는 반례로 결론을 다시 검증한다.",
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
        whyEquation: "말로 주어진 조건을 근호식·제곱식·수의 분류 기준으로 정확히 바꾸기 위해서다.",
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
