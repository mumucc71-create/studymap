(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_QUADRATIC_EQUATION_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-quadratic-equation-learning-content-v1";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const CONCEPTS = Object.freeze([
    {
      conceptId: "m3_quadratic_meaning", title: "이차방정식의 뜻과 해", order: 1,
      coreConcept: "한쪽으로 정리한 식이 ax²+bx+c=0이고 a≠0이면 이차방정식이다. 특정 수를 대입해 등식이 참이면 그 수가 해이다.",
      easyExample: "x²-5x+6=0에 x=2를 대입하면 4-10+6=0이므로 2는 해이다.",
      commonMistakes: "정리 전에 차수를 판단하거나 a=0인 경우도 이차방정식이라 하고, 일부 x에서만 참인 방정식을 모든 x에서 참인 항등식과 혼동한다.",
      procedure: "모든 항을 한쪽으로 모은다 → 동류항을 정리한다 → x² 계수가 0이 아닌지 본다 → 후보를 대입해 해인지 확인한다.",
      verification: "일반형의 최고차항과 대입 결과 0을 각각 확인한다.",
      prerequisites: ["다항식의 차수", "이항", "대입 계산"],
      nextConnection: "해의 뜻은 인수분해·제곱근·근의 공식으로 얻은 후보를 검산하는 기준이 된다.",
    },
    {
      conceptId: "m3_quadratic_factor_solve", title: "인수분해를 이용한 풀이", order: 2,
      coreConcept: "이차식을 완전히 인수분해한 뒤 AB=0이면 A=0 또는 B=0이라는 영인수 조건으로 해를 구한다.",
      easyExample: "x²-x-6=(x-3)(x+2)이므로 해는 3,-2이다.",
      commonMistakes: "공통인수를 빠뜨리거나 0이 될 수 있는 인수로 약분하여 해를 잃고, 중근을 서로 다른 두 해로 센다.",
      procedure: "일반형 정리 → 공통인수 확인 → 완전 인수분해 → 각 인수=0 → 모든 해 대입 검산.",
      verification: "인수분해식을 재전개하고 얻은 모든 해를 원방정식에 대입한다.",
      prerequisites: ["인수분해", "영인수 조건", "해의 뜻"],
      nextConnection: "인수분해가 바로 보이지 않는 식은 제곱근이나 근의 공식을 선택한다.",
    },
    {
      conceptId: "m3_quadratic_sqrt_solve", title: "제곱근을 이용한 풀이", order: 3,
      coreConcept: "(x-p)²=q에서 q>0이면 x=p±√q, q=0이면 중근 p, q<0이면 실근이 없다.",
      easyExample: "(x-2)²=9에서 x-2=±3이므로 x=5,-1이다.",
      commonMistakes: "±를 빼거나 √(음수)를 실수로 처리하고, 상황 조건을 적용하기 전에 한 후보를 임의로 버린다.",
      procedure: "제곱 항을 고립한다 → 우변 부호를 확인한다 → ±를 포함해 제곱근을 취한다 → x를 구한다 → 조건과 원식으로 검산한다.",
      verification: "두 후보를 각각 제곱해 같은 q가 되는지 확인하고 정의역 조건을 적용한다.",
      prerequisites: ["제곱근", "완전제곱식", "실수의 제곱"],
      nextConnection: "완전제곱 구조는 근의 공식이 만들어지는 원리와 연결된다.",
    },
    {
      conceptId: "m3_quadratic_formula", title: "근의 공식", order: 4,
      coreConcept: "ax²+bx+c=0(a≠0)의 해는 x=(-b±√(b²-4ac))/(2a)이다.",
      easyExample: "x²-2x-1=0에서 x=(2±√8)/2=1±√2이다.",
      commonMistakes: "b의 부호를 잘못 읽거나 분모 2a를 한 항에만 적용하고, 근호 안이 0일 때 두 근이라고 센다.",
      procedure: "표준형 정리 → a,b,c 식별 → 부호를 괄호에 넣어 대입 → 근호 간단히 → 두 해·중근·실근 없음을 분류 → 검산.",
      verification: "공식 결과를 원식에 대입하거나 가능한 경우 인수분해 결과와 비교한다.",
      prerequisites: ["일반형", "근호식", "부호 계산"],
      nextConnection: "얻은 해 집합은 순서·중복·정의역을 고려해 최종 해석해야 한다.",
    },
    {
      conceptId: "m3_quadratic_root_meaning", title: "해의 의미와 검산", order: 5,
      coreConcept: "해 집합은 순서가 없고 중복을 제거한다. 방정식의 모든 후보를 구한 뒤 원식과 추가 조건을 모두 만족하는 값만 남긴다.",
      easyExample: "x²-x-6=0의 해 -2,3은 3,-2로 써도 같은 집합이다.",
      commonMistakes: "한 근만 제출하거나 중근을 두 번 쓰고, 방정식은 만족하지만 길이·자연수 조건을 어긴 값을 포함한다.",
      procedure: "전체 후보 생성 → 각 후보 대입 → 중복 제거 → 범위·자연수·양수 조건 필터 → 누락 없음 확인.",
      verification: "개별 후보의 정확성과 전체 후보의 완전성을 서로 다른 단계로 확인한다.",
      prerequisites: ["집합", "대입 검산", "부등식·수의 범위"],
      nextConnection: "활용 문제에서는 식의 해와 실제 상황의 답을 구분하는 핵심 절차가 된다.",
    },
    {
      conceptId: "m3_quadratic_word_setup", title: "활용 문제의 식 세우기와 결과 검증", order: 6,
      coreConcept: "미지수와 범위를 먼저 정하고 문장의 관계를 이차방정식으로 나타낸 뒤, 해 중 상황 조건을 만족하는 값만 문장으로 답한다.",
      easyExample: "세로 x, 가로 x+2인 직사각형의 넓이가 48이면 x(x+2)=48이고 x=6 cm이다.",
      commonMistakes: "연속한 수를 x,x+2로 두거나 음의 길이를 답으로 채택하고, 방정식만 검산한 뒤 원래 문장을 확인하지 않는다.",
      procedure: "미지수·단위·범위 선언 → 관계식 작성 → 일반형 정리 → 적절한 방법으로 풀이 → 조건 밖 해 제거 → 원문에 대입해 문장 답.",
      verification: "수치가 식뿐 아니라 길이·넓이·자연수·시간 관계와 단위까지 만족하는지 확인한다.",
      prerequisites: ["문자식", "이차방정식 풀이", "단위와 범위"],
      nextConnection: "식 세우기와 조건 검증은 이후 함수와 도형의 모델링 학습으로 이어진다.",
    },
  ].map((item) => Object.freeze({ ...item, prerequisites: Object.freeze(item.prerequisites) })));

  const METHODS = Object.freeze({
    BASIC: { thinkingMethod: "정의와 기본 꼴을 직접 확인한다.", conditionFocus: "이차항, 해 대입, 기본 부호", strategy: "한 가지 기본 원리를 정확히 적용한다.", validation: "원식에 한 번 대입한다." },
    A1: { thinkingMethod: "한 단계 정리 뒤 풀이한다.", conditionFocus: "이항, 계수 부호, 중근", strategy: "표준형을 만든 뒤 적절한 기본 방법을 쓴다.", validation: "변형 전후와 해를 확인한다." },
    A2: { thinkingMethod: "두 성질을 연결하고 방법을 선택한다.", conditionFocus: "해 집합, ±, 조건 필터", strategy: "인수분해·제곱근·공식 중 효율적인 방법을 고른다.", validation: "전체 후보와 허용 후보를 분리한다." },
    A3: { thinkingMethod: "후보를 만들고 독립 조건으로 거른다.", conditionFocus: "매개 조건, 부호, 검산", strategy: "역추론과 방법 선택을 함께 사용한다.", validation: "후보 생성과 원식 검산을 모두 한다." },
    A4: { thinkingMethod: "숨은 조건을 찾고 경우를 분류한다.", conditionFocus: "최소성, 표현 변환, 범위", strategy: "여러 표현 중 풀이를 단축하는 구조를 선택한다.", validation: "모든 경우와 최소성·완전성을 확인한다." },
    A5: { thinkingMethod: "주장과 오류를 필요충분조건으로 분석한다.", conditionFocus: "반례, 일반화, 모든 경우", strategy: "전략을 비교하고 논증 구조를 세운다.", validation: "필요성·충분성·반례·누락 없음을 각각 검증한다." },
  });

  const lessons = Object.freeze(CONCEPTS.flatMap((concept) => STAGES.map((stage) => Object.freeze({
    lessonId: `${concept.conceptId}:${stage}`,
    conceptId: concept.conceptId,
    conceptTitle: concept.title,
    stage,
    curriculumVersion: CURRICULUM_VERSION,
    authoringScope: "MIDDLE3_QUADRATIC_EQUATION_EXPLANATION_V1",
    coreConcept: concept.coreConcept,
    easyExample: concept.easyExample,
    commonMistakes: concept.commonMistakes,
    procedure: concept.procedure,
    verification: concept.verification,
    prerequisites: concept.prerequisites,
    nextConnection: concept.nextConnection,
    ...METHODS[stage],
  }))));

  return Object.freeze({
    VERSION, CURRICULUM_VERSION, STAGES, concepts: CONCEPTS, lessons,
    getLesson(conceptId, stage) {
      return lessons.find((lesson) => lesson.conceptId === conceptId && lesson.stage === stage) || null;
    },
  });
});
