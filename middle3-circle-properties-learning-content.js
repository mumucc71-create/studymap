(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_CIRCLE_PROPERTIES_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-circle-properties-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const concepts = Object.freeze([
    {
      conceptId: "m3_circle_foundations", title: "원의 기본 요소",
      coreConcept: "원은 한 점에서 같은 거리에 있는 점의 모임이며 그 한 점이 중심, 일정한 거리가 반지름이다. 지름은 중심을 지나는 현이다.",
      easyExample: "중심이 O이고 A가 원 위의 점이면 OA는 반지름이다. A와 C가 원 위에 있고 O가 AC 위에 있으면 AC는 지름이다.",
      commonMistakes: "모든 현을 지름이라고 하거나 원 밖의 점에서 원과 만나는 선분을 반지름이라고 한다.",
      procedure: "점의 위치 확인 → 중심과 원 위의 점 연결 → 끝점과 중심 통과 여부 확인 → 현·지름·호·접선 구분",
      verification: "반지름의 두 끝점 중 하나는 중심이고, 현의 두 끝점은 모두 원 위이며, 지름은 반드시 중심을 지나는지 확인한다.",
      prerequisites: ["점·선분·각", "원의 기초 용어"], nextConnection: "원의 요소를 정확히 구분하면 현과 접선의 성질을 도형에서 선택할 수 있다.",
    },
    {
      conceptId: "m3_circle_chord", title: "현과 중심",
      coreConcept: "원의 중심에서 현에 내린 수선은 그 현을 이등분하며, 같은 원에서 길이가 같은 현은 중심에서 같은 거리에 있다.",
      easyExample: "반지름이 5이고 중심에서 현까지 거리가 3이면 현의 절반은 4이므로 현의 길이는 8이다.",
      commonMistakes: "중심에서 현으로 그은 선분이면 수직 조건 없이 현을 이등분한다고 판단하거나 현의 절반을 전체 길이로 답한다.",
      procedure: "중심·현 확인 → 수직 여부 확인 → 현의 중점 결정 → 직각삼각형 구성 → 피타고라스 정리로 길이 계산",
      verification: "현의 두 끝점이 원 위인지, 반지름이 빗변인지, 계산한 반현을 두 배 했는지 확인한다.",
      prerequisites: ["원의 기본 요소", "피타고라스 정리"], nextConnection: "중심에서 현까지의 거리와 현의 길이를 비교하고 역으로 도형 조건을 판정한다.",
    },
    {
      conceptId: "m3_circle_tangent_radius", title: "접선과 반지름",
      coreConcept: "원의 접선은 접점에서 그은 반지름과 수직이다. 역으로 원 위의 점에서 반지름에 수직인 직선은 그 원의 접선이다.",
      easyExample: "접점 A에서 OA가 반지름이고 PA가 접선이면 ∠OAP=90°이다.",
      commonMistakes: "접점이 아닌 점에서 수직인 두 선을 접선과 반지름으로 판단하거나 원을 두 점에서 만나는 직선을 접선이라고 한다.",
      procedure: "접점 확인 → 중심과 접점 연결 → 수직 관계 확인 → 직각삼각형 구성 → 각도 또는 길이 계산",
      verification: "접점이 원 위에 있는지와 접선이 원과 한 점에서만 만나는지 확인한다.",
      prerequisites: ["원의 기본 요소", "직각삼각형"], nextConnection: "한 외부점에서 그은 두 접선의 합동과 길이 관계로 확장한다.",
    },
    {
      conceptId: "m3_circle_tangent_segments", title: "한 점에서 그은 두 접선",
      coreConcept: "원 밖의 한 점에서 원에 그은 두 접선의 길이는 같다.",
      easyExample: "외부점 P에서 접점 A, B로 접선을 그으면 PA=PB이다.",
      commonMistakes: "출발점이 다른 두 접선도 길이가 같다고 하거나 접점과 외부점을 잘못 대응한다.",
      procedure: "공통 외부점 확인 → 두 접점 확인 → 반지름 연결 → 두 직각삼각형의 합동 확인 → 길이 관계 적용",
      verification: "두 선분이 같은 외부점에서 출발하며 각각 실제 접점에서 끝나는지 확인한다.",
      prerequisites: ["접선과 반지름", "합동"], nextConnection: "접선 길이 관계를 둘레·대칭·미지수 문제에 적용한다.",
    },
    {
      conceptId: "m3_circle_central_inscribed", title: "중심각과 원주각",
      coreConcept: "같은 호에 대한 중심각의 크기는 원주각의 크기의 두 배이다.",
      easyExample: "호 AB에 대한 중심각 ∠AOB가 90°이면 같은 호에 대한 원주각 ∠ADB는 45°이다.",
      commonMistakes: "서로 다른 호를 보는 중심각과 원주각을 비교하거나 두 배 관계의 방향을 뒤집는다.",
      procedure: "각의 꼭짓점 확인 → 두 각이 가로막는 호 확인 → 같은 호인지 판정 → 중심각=2×원주각 적용 → 범위 검산",
      verification: "꼭짓점이 중심인지 원 위인지, 두 각의 양 끝점과 기준 호가 같은지 확인한다.",
      prerequisites: ["호와 현", "각의 크기"], nextConnection: "같은 호를 보는 여러 원주각과 반원에 대한 원주각으로 확장한다.",
    },
    {
      conceptId: "m3_circle_same_arc", title: "같은 호의 원주각",
      coreConcept: "같은 호에 대한 원주각의 크기는 같고, 지름이 이루는 반원에 대한 원주각은 90°이다.",
      easyExample: "∠ACB와 ∠ADB가 모두 호 AB를 보면 두 각의 크기는 같다.",
      commonMistakes: "각의 모양만 보고 같은 호라고 판단하거나 원주각의 꼭짓점이 기준 호 위에 있는 경우를 그대로 적용한다.",
      procedure: "각의 양 끝점 확인 → 가로막는 호 결정 → 같은 호 또는 반원 판정 → 각 관계 적용 → 삼각형의 각의 합으로 검산",
      verification: "원주각의 꼭짓점이 원 위에 있고 기준 호의 끝점과 각의 두 변 끝점이 일치하는지 확인한다.",
      prerequisites: ["중심각과 원주각", "삼각형의 각"], nextConnection: "여러 호와 접선 조건이 함께 주어진 복합 원 문제를 해결한다.",
    },
  ].map((item) => Object.freeze({ ...item, prerequisites: Object.freeze(item.prerequisites) })));

  const stageGuidance = Object.freeze({
    BASIC: { thinkingMethod: "도형 표시와 용어를 일대일로 대응한다.", conditionFocus: "중심·원 위의 점·접점·기준 호", strategy: "정의와 기본 관계를 한 번 정확히 적용한다.", validation: "점의 위치와 각·선분의 끝점을 다시 확인한다." },
    A1: { thinkingMethod: "한 성질을 선택하여 각도나 길이를 직접 구한다.", conditionFocus: "수직·이등분·두 배·같은 길이", strategy: "성질의 전제 조건을 먼저 확인하고 계산한다.", validation: "각도 범위와 길이의 양수 조건을 확인한다." },
    A2: { thinkingMethod: "두 성질을 순서대로 연결한다.", conditionFocus: "직각삼각형·각의 합·단위·범위", strategy: "도형 관계를 확정한 뒤 필요한 식을 세운다.", validation: "다른 도형 관계와 모순되지 않는지 검산한다." },
    A3: { thinkingMethod: "기준 호나 접점을 선택하고 후보를 조건으로 걸러낸다.", conditionFocus: "독립 조건 두 개 이상·역추론·검산", strategy: "가능한 관계를 나열한 뒤 직접 연결되는 성질을 선택한다.", validation: "선택하지 않은 후보가 왜 불가능한지도 확인한다." },
    A4: { thinkingMethod: "숨은 도형 조건을 복원하고 경우를 분류한다.", conditionFocus: "숨은 호·구조 선택·최소성·표현 변환", strategy: "먼저 사용할 성질을 비교하여 가장 강한 조건부터 적용한다.", validation: "모든 경우와 단위를 통일하여 결과를 비교한다." },
    A5: { thinkingMethod: "주장과 풀이를 필요충분조건·반례·일반화 관점에서 감사한다.", conditionFocus: "오류 분석·모든 경우·도형 조건 검증", strategy: "전제를 명시하고 성립 조건과 반례를 함께 제시한다.", validation: "점·선·호·각·길이의 관계를 독립적으로 검증한다." },
  });

  const lessons = Object.freeze(concepts.flatMap((concept) => stages.map((stage) => Object.freeze({
    lessonId: `${concept.conceptId}:${stage}`, conceptId: concept.conceptId, conceptTitle: concept.title, stage,
    curriculumVersion: CURRICULUM_VERSION, authoringScope: "MIDDLE3_CIRCLE_PROPERTIES_EXPLANATION_V1",
    coreConcept: concept.coreConcept, easyExample: concept.easyExample, commonMistakes: concept.commonMistakes,
    procedure: concept.procedure, verification: concept.verification, prerequisites: concept.prerequisites,
    nextConnection: concept.nextConnection, ...stageGuidance[stage],
  }))));

  return Object.freeze({
    VERSION, CURRICULUM_VERSION, stages, concepts, lessons,
    getLesson(conceptId, stage) { return lessons.find((lesson) => lesson.conceptId === conceptId && lesson.stage === stage) || null; },
  });
});
