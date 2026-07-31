(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_STATISTICS_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-statistics-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const concepts = Object.freeze([
    {
      conceptId: "m3_statistics_mean", title: "평균",
      coreConcept: "평균은 자료의 합을 자료의 개수로 나눈 값이다. 평균과 개수를 알면 자료의 합을 역산할 수 있다.",
      easyExample: "4, 6, 8의 평균은 (4+6+8)÷3=6이다.",
      commonMistakes: "자료의 합을 잘못 세거나, 자료 하나가 바뀌었는데 전체 합의 변화만큼 평균이 변한다고 생각한다.",
      procedure: "자료 개수 확인 → 합 계산 → 개수로 나눔 → 단위·반올림 확인 → 합으로 역검산",
      verification: "평균×자료 개수가 원래 자료의 합과 같은지 확인한다.",
      prerequisites: ["사칙계산", "분수와 소수"], nextConnection: "평균과 중앙값·최빈값을 비교해 자료를 잘 나타내는 값을 선택한다.",
    },
    {
      conceptId: "m3_statistics_median_mode", title: "중앙값과 최빈값",
      coreConcept: "중앙값은 자료를 크기순으로 놓았을 때 가운데 값이고, 최빈값은 가장 자주 나타나는 값이다.",
      easyExample: "2, 3, 3, 7, 9의 중앙값과 최빈값은 모두 3이다.",
      commonMistakes: "자료를 정렬하지 않고 가운데 위치를 고르거나, 최빈값이 여러 개인 경우 하나만 답한다.",
      procedure: "자료 정렬 → 자료 개수 판정 → 중앙 위치 계산 → 각 값의 빈도 계산 → 복수·없음 여부 확인",
      verification: "짝수 개 자료는 가운데 두 값의 평균인지, 최대 빈도가 같은 값이 모두 포함됐는지 확인한다.",
      prerequisites: ["자료 정렬", "평균"], nextConnection: "이상치가 있을 때 어떤 대푯값이 적절한지 판단한다.",
    },
    {
      conceptId: "m3_statistics_representative_range", title: "대푯값의 선택과 범위",
      coreConcept: "대푯값은 자료의 특성에 맞게 선택해야 하며, 범위는 최댓값과 최솟값의 차로 간단한 산포를 나타낸다.",
      easyExample: "2, 3, 4, 5, 50처럼 이상치가 크면 평균보다 중앙값이 전형적인 값을 더 잘 나타낼 수 있다.",
      commonMistakes: "항상 평균이 가장 좋은 대푯값이라고 생각하거나 범위를 자료의 개수로 계산한다.",
      procedure: "자료 목적 확인 → 이상치·반복값 확인 → 대푯값 후보 비교 → 범위 계산 → 선택 이유 검산",
      verification: "선택한 통계량이 이상치와 자료의 분포를 왜곡하지 않는지 확인한다.",
      prerequisites: ["평균", "중앙값", "최빈값"], nextConnection: "범위보다 정교한 산포도인 분산과 표준편차로 확장한다.",
    },
    {
      conceptId: "m3_statistics_frequency_graphs", title: "도수분포표와 그래프",
      coreConcept: "도수분포표는 자료를 겹치지 않는 계급으로 나누어 도수를 나타내며, 상대도수는 도수를 전체 도수로 나눈 값이다.",
      easyExample: "전체 20명 중 한 계급이 5명이면 상대도수는 5/20=0.25이다.",
      commonMistakes: "계급 경계를 겹치게 세거나 상대도수의 분모를 해당 계급의 도수로 둔다.",
      procedure: "계급 구간 확인 → 도수 합 확인 → 상대도수 계산 → 히스토그램 막대와 대응 → 축·단위 검산",
      verification: "도수의 합이 전체 도수이고 상대도수의 합이 1인지 확인한다.",
      prerequisites: ["분수와 소수", "표와 그래프"], nextConnection: "표와 그래프에서 읽은 자료를 대푯값과 산포도로 비교한다.",
    },
    {
      conceptId: "m3_statistics_variance", title: "편차와 분산",
      coreConcept: "편차는 각 자료값에서 평균을 뺀 값이고, 분산은 편차 제곱의 평균이다. 중학교에서는 자료 개수 n으로 나눈다.",
      easyExample: "1, 3, 5의 평균은 3, 편차는 -2, 0, 2, 분산은 (4+0+4)÷3=8/3이다.",
      commonMistakes: "편차를 그대로 평균 내거나 n-1로 나누며, 분산의 단위를 원래 단위로 쓴다.",
      procedure: "평균 계산 → 편차 계산 → 편차 합 0 확인 → 제곱 → n으로 나눔 → 제곱 단위 확인",
      verification: "분산이 음수가 아닌지와 편차 제곱합÷n이 맞는지 확인한다.",
      prerequisites: ["평균", "제곱"], nextConnection: "분산의 양의 제곱근인 표준편차로 원래 단위의 산포를 해석한다.",
    },
    {
      conceptId: "m3_statistics_standard_deviation", title: "표준편차",
      coreConcept: "표준편차는 분산의 양의 제곱근이며 원래 자료와 같은 단위를 사용한다. 값이 작을수록 자료가 평균 가까이에 모여 있다.",
      easyExample: "분산이 9이면 표준편차는 3이다.",
      commonMistakes: "분산을 그대로 표준편차로 답하거나 음의 제곱근도 답에 포함하고 제곱 단위를 쓴다.",
      procedure: "분산 확인 → 양의 제곱근 계산 → 필요하면 반올림 → 단위 확인 → 집단의 흩어짐 비교",
      verification: "표준편차를 제곱하면 분산이 되는지와 단위가 원자료와 같은지 확인한다.",
      prerequisites: ["분산", "제곱근"], nextConnection: "평균과 표준편차를 함께 사용해 두 집단의 수준과 안정성을 비교한다.",
    },
  ].map((item) => Object.freeze({ ...item, prerequisites: Object.freeze(item.prerequisites) })));

  const stageGuidance = Object.freeze({
    BASIC: { thinkingMethod: "정의에 따라 한 통계량을 정확히 계산한다.", conditionFocus: "자료 개수·정렬·단위", strategy: "계산 순서를 표준화한다.", validation: "원자료로 다시 계산한다." },
    A1: { thinkingMethod: "합이나 빠진 값을 한 단계 역산한다.", conditionFocus: "복수 최빈값·상대도수·변화량", strategy: "알려진 통계량에서 필요한 총량을 먼저 복원한다.", validation: "복원한 값을 원조건에 대입한다." },
    A2: { thinkingMethod: "두 통계 성질을 연결해 계산과 해석을 함께 한다.", conditionFocus: "이상치·표와 그래프·편차·반올림", strategy: "자료 구조를 먼저 정한 뒤 통계량을 선택한다.", validation: "단위와 허용 오차를 확인한다." },
    A3: { thinkingMethod: "후보 자료를 복원하고 두 독립 조건으로 걸러낸다.", conditionFocus: "자료 복원·대푯값 선택·검산", strategy: "가능한 후보를 만든 뒤 합·순서·빈도로 교차 검증한다.", validation: "선택하지 않은 후보가 조건을 어기는 이유도 확인한다." },
    A4: { thinkingMethod: "숨은 값과 표·그래프 표현을 변환하며 경우를 분류한다.", conditionFocus: "역추론·경우 분류·최소성·반올림", strategy: "정확한 값 범위를 먼저 구한 뒤 통계량을 선택한다.", validation: "모든 경우가 표와 원자료 양쪽에서 일치하는지 확인한다." },
    A5: { thinkingMethod: "주장과 계산을 반례·필요충분조건·일반화 관점에서 감사한다.", conditionFocus: "오류 분석·모든 경우·두 집단 비교", strategy: "전제를 명시하고 성립 조건과 실패 사례를 함께 제시한다.", validation: "계산·단위·해석을 독립적으로 검증한다." },
  });

  const lessons = Object.freeze(concepts.flatMap((concept) => stages.map((stage) => Object.freeze({
    lessonId: `${concept.conceptId}:${stage}`, conceptId: concept.conceptId, conceptTitle: concept.title, stage,
    curriculumVersion: CURRICULUM_VERSION, authoringScope: "MIDDLE3_STATISTICS_EXPLANATION_V1",
    coreConcept: concept.coreConcept, easyExample: concept.easyExample, commonMistakes: concept.commonMistakes,
    procedure: concept.procedure, verification: concept.verification, prerequisites: concept.prerequisites,
    nextConnection: concept.nextConnection, ...stageGuidance[stage],
  }))));

  return Object.freeze({
    VERSION, CURRICULUM_VERSION, stages, concepts, lessons,
    getLesson(conceptId, stage) { return lessons.find((lesson) => lesson.conceptId === conceptId && lesson.stage === stage) || null; },
  });
});
