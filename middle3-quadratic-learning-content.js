(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_QUADRATIC_LEARNING_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "m3-quadratic-learning-content-v1";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const CONCEPTS = Object.freeze([
    {
      conceptId: "m3_quadratic_function_meaning",
      title: "이차함수의 뜻",
      order: 1,
      concept: "y를 x의 식으로 정리했을 때 x²의 계수가 0이 아닌지 확인한다.",
      firstCondition: "종속변수가 무엇인지, 식의 최고차항이 무엇인지 먼저 본다.",
      equationReason: "겉모양이 아니라 y= 꼴의 최고차항으로 함수의 차수를 판정하기 위해서다.",
      connection: "표의 2차 차이, 도형의 넓이, 매개변수 조건을 같은 이차식으로 연결한다.",
      mistake: "x²이 보인다는 이유만으로 이차함수라고 판단하거나 이차항 계수가 0이 되는 경우를 놓친다.",
      validation: "식을 전개하고 이차항 계수가 0이 아닌지, 주어진 표·도형 조건을 다시 만족하는지 확인한다.",
    },
    {
      conceptId: "m3_quadratic_graph_shape",
      title: "그래프의 모양과 방향",
      order: 2,
      concept: "y=ax² 또는 y=a(x-p)²+q에서 a의 부호와 절댓값으로 방향과 폭을 판단한다.",
      firstCondition: "계수 a의 부호, |a|의 크기, 비교 대상 그래프를 먼저 표시한다.",
      equationReason: "같은 높이의 x좌표나 수평 현의 길이를 계수와 연결해 모양을 수치로 비교하기 위해서다.",
      connection: "함수값·좌표·대칭점·도형 넓이를 계수 a와 연결한다.",
      mistake: "음수 계수의 대소와 절댓값의 대소를 혼동하거나 함수값의 부호를 폭으로 착각한다.",
      validation: "열린 방향, 같은 높이에서의 두 x좌표, 한 개 이상의 주어진 점을 모두 대입해 확인한다.",
    },
    {
      conceptId: "m3_quadratic_vertex_axis",
      title: "꼭짓점과 대칭축",
      order: 3,
      concept: "같은 함수값의 두 x좌표 중점과 꼭짓점형을 이용해 축과 꼭짓점을 찾는다.",
      firstCondition: "같은 y값을 갖는 점의 쌍, 축 위의 점, 최댓값·최솟값 조건을 먼저 찾는다.",
      equationReason: "대칭축을 먼저 고정하면 꼭짓점형의 미지수를 줄여 조건을 독립적으로 사용할 수 있다.",
      connection: "대칭점의 중점, 일반형의 계수, 꼭짓점형, 함수값 조건을 차례로 연결한다.",
      mistake: "같은 함수값만 보고 그 높이를 꼭짓점의 y좌표로 정하거나 축의 부호를 반대로 읽는다.",
      validation: "구한 축을 기준으로 대칭 함수값이 같은지와 꼭짓점 좌표가 식을 만족하는지 확인한다.",
    },
    {
      conceptId: "m3_quadratic_translation",
      title: "그래프의 평행이동",
      order: 4,
      concept: "꼭짓점과 그래프 위 모든 점에 같은 이동 벡터를 적용하고 이차항 계수는 보존한다.",
      firstCondition: "원래 점과 이동한 점의 대응, 두 꼭짓점, 가로·세로 이동 방향을 먼저 확인한다.",
      equationReason: "이동 벡터를 식과 좌표에 동일하게 적용해 그래프 전체의 이동을 한 번에 나타내기 위해서다.",
      connection: "완전제곱, 대응점의 좌표 차, 꼭짓점 이동, 계수 보존을 연결한다.",
      mistake: "오른쪽 이동에서 x+h를 쓰거나 서로 대응하지 않는 점을 빼 이동 벡터를 만든다.",
      validation: "원래 점에 이동 벡터를 더한 점이 새 식을 만족하는지와 계수가 같은지 확인한다.",
    },
    {
      conceptId: "m3_quadratic_find_formula",
      title: "조건으로 식 구하기",
      order: 5,
      concept: "주어진 조건에 따라 꼭짓점형·인수형·일반형 중 미지수가 가장 적은 표현을 선택한다.",
      firstCondition: "축·꼭짓점·영점·서로 같은 함수값 중 어떤 정보가 있는지 먼저 분류한다.",
      equationReason: "알맞은 식의 꼴을 선택하면 불필요한 연립을 줄이고 각 조건의 역할을 분리할 수 있다.",
      connection: "표현 선택, 독립 조건 식 세우기, 계수 계산, 사용하지 않은 조건의 검산을 연결한다.",
      mistake: "서로 같은 정보를 주는 대칭점 두 개를 독립 조건 두 개로 세거나 표현을 중간에 섞는다.",
      validation: "구한 식에 모든 점·축·영점·방향 조건을 각각 다시 대입한다.",
    },
    {
      conceptId: "m3_quadratic_max_min",
      title: "최댓값과 최솟값",
      order: 6,
      concept: "정의역 안의 꼭짓점과 양 끝점을 후보로 정하고 조건에 맞는 함수값을 비교한다.",
      firstCondition: "정의역, 정수·자연수 조건, 축의 위치, 실제 길이 조건을 먼저 표시한다.",
      equationReason: "최적화 대상을 이차함수로 나타내고 허용되는 후보만 비교하기 위해서다.",
      connection: "상황의 조건을 정의역으로 바꾸고 꼭짓점·끝점·정수 후보를 차례로 비교한다.",
      mistake: "정의역 밖 꼭짓점을 답으로 쓰거나 정수 조건에서 연속 최댓값을 그대로 사용한다.",
      validation: "후보 함수값을 모두 비교하고 길이·정수·구간 조건을 원래 상황에 다시 대입한다.",
    },
  ]);

  const STAGE_METHODS = Object.freeze({
    BASIC: {
      thinking: "핵심 개념을 식과 그래프에서 바로 찾아 직접 적용한다.",
      conditionFocus: "한 개의 핵심 조건을 정확히 읽는다.",
      strategy: "정의 또는 대표 공식을 한 번 적용하고 결과를 원조건으로 확인한다.",
      commonMistake: "기호의 부호와 꼭짓점형 괄호 안의 부호를 서둘러 읽지 않는다.",
    },
    A1: {
      thinking: "표현을 한 번 바꾸어 기본 유형의 숨은 정보를 찾는다.",
      conditionFocus: "식 정리, 완전제곱, 좌표 대입 중 필요한 변환을 고른다.",
      strategy: "대표 유형을 알맞은 식의 꼴로 바꾼 뒤 계산한다.",
      commonMistake: "식을 바꾼 뒤 원래 조건 하나를 빠뜨리지 않는다.",
    },
    A2: {
      thinking: "두 조건을 식으로 바꾸고 순서를 정해 연결한다.",
      conditionFocus: "서로 독립인 조건과 검산에 쓸 조건을 구분한다.",
      strategy: "첫 조건으로 미지수를 줄이고 두 번째 조건으로 값을 결정한다.",
      commonMistake: "같은 정보를 반복해서 식으로 세우지 않는다.",
    },
    A3: {
      thinking: "조건을 연결하고 첫 식을 스스로 선택해 최소 세 단계로 해결한다.",
      conditionFocus: "어떤 조건이 축·계수·정의역·함수값을 결정하는지 구분한다.",
      strategy: "가능한 표현 중 미지수가 가장 적은 방법을 선택하고, 남은 조건으로 검증한다.",
      commonMistake: "숫자를 바로 대입하기 전에 조건 사이의 관계를 먼저 식으로 나타낸다.",
    },
    A4: {
      thinking: "복합 조건을 분리하고 그래프·좌표·대수를 연결해 경우를 나누거나 역추론한다.",
      conditionFocus: "세 개 이상의 조건 중 먼저 고정할 정보와 마지막에 검증할 정보를 정한다.",
      strategy: "여러 경로를 비교해 계산이 짧고 모든 조건을 사용하는 경로를 선택한다.",
      commonMistake: "한 경우만 확인하거나 풀이 경로가 보인다는 이유로 나머지 조건을 생략하지 않는다.",
    },
    A5: {
      thinking: "처음 보는 구조를 분석하고 전략 후보를 비교해 선택 이유까지 설명한다.",
      conditionFocus: "조건 사용 순서, 숨은 자유도, 정수·정의역·대칭의 제한을 모두 표시한다.",
      strategy: "중간 결과마다 조건을 검증하고 다른 표현이나 독립 조건으로 최종 결론을 정당화한다.",
      commonMistake: "계산이 길다는 이유만으로 어려운 전략을 고르거나 검증 없는 결론을 쓰지 않는다.",
    },
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
        thinkingMethod: method.thinking,
        firstCondition: `${method.conditionFocus} ${concept.firstCondition}`,
        conceptToUse: concept.concept,
        whyEquation: concept.equationReason,
        solutionConnection: `${method.strategy} ${concept.connection}`,
        commonMistake: `${method.commonMistake} ${concept.mistake}`,
        validationMethod: concept.validation,
      })];
    }))),
  ])));

  return Object.freeze({
    VERSION,
    STAGES,
    CONCEPTS,
    CONTENT,
    get(conceptId, stage) {
      return CONTENT[conceptId]?.[stage] || null;
    },
  });
});
