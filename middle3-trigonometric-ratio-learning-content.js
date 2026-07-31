(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_TRIGONOMETRIC_RATIO_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-trigonometric-ratio-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const concepts = Object.freeze([
    {
      conceptId: "m3_trig_meaning",
      title: "삼각비의 뜻과 세 변의 역할",
      coreConcept: "직각삼각형에서 빗변은 직각의 맞은편 변이다. 기준각을 정하면 나머지 두 변은 맞은편 변과 이웃한 변으로 나뉜다.",
      easyExample: "직각이 A이고 기준각이 B인 △ABC에서는 BC가 빗변, AC가 맞은편 변, AB가 이웃한 변이다.",
      commonMistakes: "그림에서 가로로 보이는 변을 무조건 이웃한 변으로 정하거나, 기준각을 바꾸고도 맞은편 변과 이웃한 변을 바꾸지 않는다.",
      procedure: "직각점 확인 → 기준각 확인 → 직각의 맞은편인 빗변 고정 → 기준각에 닿지 않는 직각변을 맞은편 변으로 지정 → 남은 직각변을 이웃한 변으로 지정",
      verification: "기준각을 다른 예각으로 바꾸었을 때 빗변은 유지되고 맞은편 변과 이웃한 변만 서로 바뀌는지 확인한다.",
      prerequisites: ["직각삼각형", "각과 변", "분수와 비"],
      nextConnection: "세 변의 역할을 정확히 구분하면 sin·cos·tan의 정의를 같은 기준각에서 사용할 수 있다.",
    },
    {
      conceptId: "m3_trig_sine",
      title: "사인",
      coreConcept: "sin θ는 기준각 θ의 맞은편 변의 길이를 빗변의 길이로 나눈 값이다.",
      easyExample: "빗변이 5, θ의 맞은편 변이 3이면 sin θ=3/5이다.",
      commonMistakes: "맞은편 변과 이웃한 변을 바꾸거나 빗변이 아닌 변을 분모로 둔다.",
      procedure: "기준각 확인 → 빗변과 맞은편 변 표시 → sin θ=맞은편 변/빗변 작성 → 길이 대입 → 약분",
      verification: "예각의 sin값은 0보다 크고 1보다 작으며, 분모가 반드시 빗변인지 확인한다.",
      prerequisites: ["삼각비의 뜻", "분수의 약분", "직각삼각형"],
      nextConnection: "같은 방식으로 이웃한 변과 빗변의 비인 cos를 학습한다.",
    },
    {
      conceptId: "m3_trig_cosine",
      title: "코사인",
      coreConcept: "cos θ는 기준각 θ의 이웃한 변의 길이를 빗변의 길이로 나눈 값이다.",
      easyExample: "빗변이 13, θ의 이웃한 변이 12이면 cos θ=12/13이다.",
      commonMistakes: "그림의 가로 방향만 보고 이웃한 변을 정하거나, 기준각과 무관한 직각변을 분자로 고른다.",
      procedure: "기준각 확인 → 빗변 고정 → 기준각에 닿는 직각변 표시 → cos θ=이웃한 변/빗변 작성 → 계산",
      verification: "분자가 기준각에 닿는 직각변인지, 결과가 0과 1 사이인지 확인한다.",
      prerequisites: ["삼각비의 뜻", "사인", "직각삼각형"],
      nextConnection: "맞은편 변과 이웃한 변만 비교하는 tan와 연결된다.",
    },
    {
      conceptId: "m3_trig_tangent",
      title: "탄젠트",
      coreConcept: "tan θ는 기준각 θ의 맞은편 변의 길이를 이웃한 변의 길이로 나눈 값이다.",
      easyExample: "θ의 맞은편 변이 3, 이웃한 변이 4이면 tan θ=3/4이다.",
      commonMistakes: "빗변을 사용하거나 분자와 분모를 뒤집는다. tan값은 항상 1보다 작다고 오해하기도 한다.",
      procedure: "기준각 확인 → 맞은편 변과 이웃한 변 표시 → tan θ=맞은편 변/이웃한 변 작성 → 계산",
      verification: "빗변이 식에 들어가지 않았는지 확인하고, 기준각이 45°보다 크면 tan값이 1보다 클 수 있음을 점검한다.",
      prerequisites: ["삼각비의 뜻", "비례식", "사인과 코사인"],
      nextConnection: "30°·45°·60°에서 tan값을 정확한 근호 형태로 구할 수 있다.",
    },
    {
      conceptId: "m3_trig_special_angles",
      title: "30°·45°·60°의 삼각비",
      coreConcept: "30°-60°-90° 삼각형의 변의 비는 1:√3:2, 45°-45°-90° 삼각형의 변의 비는 1:1:√2이다.",
      easyExample: "sin30°=1/2, cos60°=1/2, tan45°=1이다.",
      commonMistakes: "30°와 60°의 값을 바꾸거나 tan30°를 √3으로 쓴다. √3/3과 1/√3이 같은 값임을 놓친다.",
      procedure: "특수각 삼각형 선택 → 기준각에 따른 변 역할 표시 → sin·cos·tan 정의 적용 → 근호와 분수 간단히 하기",
      verification: "sin30°=cos60°, sin60°=cos30°, tan45°=1 관계와 값의 크기를 확인한다.",
      prerequisites: ["제곱근", "삼각비의 정의", "닮은 직각삼각형"],
      nextConnection: "특수각 값을 이용하면 길이·높이·거리 문제를 정확한 값으로 계산할 수 있다.",
    },
    {
      conceptId: "m3_trig_length",
      title: "삼각비로 길이·높이·거리 구하기",
      coreConcept: "주어진 기준각과 두 변의 관계를 보고 sin·cos·tan 중 필요한 비를 선택해 비례식을 세운다.",
      easyExample: "수평거리 4 m에서 꼭대기를 본 각이 60°이면 높이는 4tan60°=4√3 m이다.",
      commonMistakes: "관측점이 아닌 곳을 기준각으로 잡거나, cm와 m를 섞고, 음수 또는 빗변보다 긴 직각변을 그대로 답으로 쓴다.",
      procedure: "상황을 직각삼각형으로 나타내기 → 기준각·주어진 변·목표 변 표시 → 삼각비 선택 → 비례식 계산 → 단위 통일 → 결과 검산",
      verification: "길이는 양수인지, 빗변은 각 직각변보다 긴지, 단위가 문제와 일치하는지 확인한다.",
      prerequisites: ["sin·cos·tan", "특수각", "비례식과 단위 변환"],
      nextConnection: "삼각비를 이용한 측정 결과의 타당성을 설명하고 다른 풀이의 오류를 분석할 수 있다.",
    },
  ].map((item) => Object.freeze({ ...item, prerequisites: Object.freeze(item.prerequisites) })));

  const stageGuidance = Object.freeze({
    BASIC: {
      thinkingMethod: "정의와 그림의 표시를 일대일로 연결한다.",
      conditionFocus: "직각점, 기준각, 세 변의 이름",
      strategy: "필요한 정의를 한 번 정확히 적용한다.",
      validation: "기준각과 분자·분모를 다시 확인한다.",
    },
    A1: {
      thinkingMethod: "기준각이 달라질 때 변의 역할 변화를 추적한다.",
      conditionFocus: "기준각 변경, 분수·근호, 한 단계 길이",
      strategy: "변의 역할을 먼저 정한 뒤 식을 세운다.",
      validation: "삼각비 값의 범위와 근호 표현을 확인한다.",
    },
    A2: {
      thinkingMethod: "변 대응과 삼각비 선택을 연결한다.",
      conditionFocus: "두 성질 결합, 단위, 결과 범위",
      strategy: "목표 변과 주어진 변을 직접 연결하는 비를 선택한다.",
      validation: "계산값과 단위·기하적 크기를 함께 점검한다.",
    },
    A3: {
      thinkingMethod: "기준각 후보를 결정하고 여러 정보 중 필요한 것을 고른다.",
      conditionFocus: "기준각 판단, 비 선택, 비례식, 검산",
      strategy: "후보 생성과 전략 선택을 분리한 뒤 계산한다.",
      validation: "다른 삼각비로도 모순이 없는지 확인한다.",
    },
    A4: {
      thinkingMethod: "숨은 기준각을 복원하고 경우를 나누어 역추론한다.",
      conditionFocus: "경우 분류, 표현 변환, 단위 변환, 범위",
      strategy: "가능한 비 가운데 조건을 가장 직접 연결하는 것을 고른다.",
      validation: "모든 경우와 단위를 통일해 비교한다.",
    },
    A5: {
      thinkingMethod: "주장과 풀이를 필요충분조건·반례·일반화 관점에서 감사한다.",
      conditionFocus: "오류 분석, 모든 경우, 측정 결과 검증",
      strategy: "전제를 명시하고 성립 조건과 반례를 함께 제시한다.",
      validation: "변 역할·삼각비·계산·단위의 네 층을 독립적으로 검증한다.",
    },
  });

  const lessons = Object.freeze(concepts.flatMap((concept) => stages.map((stage) => Object.freeze({
    lessonId: `${concept.conceptId}:${stage}`,
    conceptId: concept.conceptId,
    conceptTitle: concept.title,
    stage,
    curriculumVersion: CURRICULUM_VERSION,
    authoringScope: "MIDDLE3_TRIGONOMETRIC_RATIO_EXPLANATION_V1",
    coreConcept: concept.coreConcept,
    easyExample: concept.easyExample,
    commonMistakes: concept.commonMistakes,
    procedure: concept.procedure,
    verification: concept.verification,
    prerequisites: concept.prerequisites,
    nextConnection: concept.nextConnection,
    ...stageGuidance[stage],
  }))));

  return Object.freeze({
    VERSION,
    CURRICULUM_VERSION,
    stages,
    concepts,
    lessons,
    getLesson(conceptId, stage) {
      return lessons.find((lesson) => lesson.conceptId === conceptId && lesson.stage === stage) || null;
    },
  });
});
