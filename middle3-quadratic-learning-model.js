(function (root, factory) {
  const schema = root?.STUDY_MATH_LEARNING_SCHEMA
    || (typeof require === "function" ? require("./math-learning-schema.js") : null);
  const api = factory(schema);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (schema) {
  "use strict";

  if (!schema) throw new Error("STUDY_MATH_LEARNING_SCHEMA is required");

  const VERSION = "m3-quadratic-learning-model-v2";
  const UNIT_ID = "m3-quadratic-function";
  const VALIDATOR_ID = "M3_QUADRATIC_LEARNING_STATIC_V2";
  const STAGES = schema.STAGES;
  const CONCEPTS = Object.freeze([
    Object.freeze({
      conceptId: "m3_quadratic_function_meaning",
      conceptName: "이차함수의 뜻",
      order: 1,
      prerequisiteConceptIds: Object.freeze(["m3_quadratic_root_meaning"]),
    }),
    Object.freeze({
      conceptId: "m3_quadratic_graph_shape",
      conceptName: "그래프의 모양과 방향",
      order: 2,
      prerequisiteConceptIds: Object.freeze(["coordinate_plane", "m3_quadratic_function_meaning"]),
    }),
    Object.freeze({
      conceptId: "m3_quadratic_vertex_axis",
      conceptName: "꼭짓점과 축",
      order: 3,
      prerequisiteConceptIds: Object.freeze(["m3_quadratic_graph_shape"]),
    }),
    Object.freeze({
      conceptId: "m3_quadratic_translation",
      conceptName: "이차함수 그래프의 평행이동",
      order: 4,
      prerequisiteConceptIds: Object.freeze(["m3_quadratic_vertex_axis"]),
    }),
    Object.freeze({
      conceptId: "m3_quadratic_find_formula",
      conceptName: "조건으로 식 구하기",
      order: 5,
      prerequisiteConceptIds: Object.freeze(["m3_quadratic_translation"]),
    }),
    Object.freeze({
      conceptId: "m3_quadratic_max_min",
      conceptName: "최댓값과 최솟값",
      order: 6,
      prerequisiteConceptIds: Object.freeze(["m3_quadratic_vertex_axis"]),
    }),
  ]);

  function item(answerType, key, prompt, correctAnswer, steps, extra = {}) {
    return { answerType, key, prompt, correctAnswer, steps, ...extra };
  }

  function mc(key, prompt, correctAnswer, choices, steps, extra) {
    return item("MULTIPLE_CHOICE", key, prompt, correctAnswer, steps, { choices, ...extra });
  }

  function short(key, prompt, correctAnswer, steps, extra) {
    return item("SHORT_ANSWER", key, prompt, correctAnswer, steps, extra);
  }

  function expression(key, prompt, correctAnswer, steps, extra) {
    return item("EXPRESSION_INPUT", key, prompt, correctAnswer, steps, extra);
  }

  function stepOrder(key, prompt, requiredSteps, steps, extra) {
    return item("STEP_ORDER", key, prompt, requiredSteps, steps, { requiredSteps, ...extra });
  }

  function written(key, prompt, modelAnswer, steps, writtenRubric, extra) {
    return item("WRITTEN_RESPONSE", key, prompt, modelAnswer, steps, { writtenRubric, ...extra });
  }

  function rubricStep(id, description, points, evidence, required = true) {
    return Object.freeze({ id, description, points, evidence: Object.freeze([...evidence]), required });
  }

  function processExtra(rubricSteps, extra = {}) {
    return {
      rubricSteps: Object.freeze([...rubricSteps]),
      forbiddenLogicalErrors: Object.freeze([...(extra.forbiddenLogicalErrors || [])]),
      ...extra,
    };
  }

  function writtenRubric({
    requiredClaims,
    requiredRelations,
    requiredCalculations,
    requiredConclusion,
    forbiddenLogicalErrors,
    reviewThreshold = 0.58,
    correctThreshold = 0.82,
  }) {
    return Object.freeze({
      requiredClaims: Object.freeze([...requiredClaims]),
      requiredRelations: Object.freeze([...requiredRelations]),
      requiredCalculations: Object.freeze([...(requiredCalculations || [])]),
      requiredConclusion: Object.freeze({ ...requiredConclusion }),
      forbiddenLogicalErrors: Object.freeze([...forbiddenLogicalErrors]),
      reviewThreshold,
      correctThreshold,
    });
  }

  function qualityMeta({
    action = "REPLACE",
    replaces,
    conditions,
    domain = "x∈ℝ",
    requiresDomain = false,
    firstEquationFamily,
    coreStrategy,
    conditionTransform,
    graphStructure,
    targetKind,
    linked,
    traps = [],
    archetype,
    scopeEvidence = "중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용",
  }) {
    return {
      revisionAction: action,
      replacesProblemId: replaces,
      linkedConditionCount: conditions,
      domain,
      requiresDomain,
      structureFingerprint: Object.freeze({
        firstEquationFamily,
        coreStrategy,
        conditionTransform,
        graphStructure,
        targetKind,
      }),
      scopeTag: "MIDDLE3_QUADRATIC",
      scopeEvidence,
      linked,
      traps,
      archetype,
      independentValidation: Object.freeze({
        conditionFeasible: true,
        uniqueAnswer: true,
        answerRecalculated: true,
        scopeChecked: true,
      }),
    };
  }

  const DEFAULT_REASONING = Object.freeze({
    BASIC: Object.freeze(["CONCEPT_RECALL", "DIRECT_APPLICATION"]),
    A1: Object.freeze(["CONDITION_READING", "DIRECT_APPLICATION", "RESULT_VALIDATION"]),
    A2: Object.freeze(["CONDITION_READING", "EQUATION_SETUP", "REVERSE_REASONING"]),
    A3: Object.freeze(["CONDITION_READING", "CONCEPT_SELECTION", "EQUATION_SETUP", "STRATEGY_SELECTION"]),
    A4: Object.freeze(["CONDITION_READING", "CONCEPT_SELECTION", "MULTI_CONCEPT_LINK", "STRATEGY_SELECTION", "REPRESENTATION"]),
    A5: Object.freeze([
      "CONDITION_READING",
      "CONCEPT_SELECTION",
      "MULTI_CONCEPT_LINK",
      "STRATEGY_SELECTION",
      "EXPLANATION",
      "REPRESENTATION",
      "EQUATION_SETUP",
      "RESULT_VALIDATION",
    ]),
  });

  const BANK = {};

  BANK.m3_quadratic_function_meaning = {
    BASIC: [
      mc("classification", "다음 중 y가 x의 이차함수인 것은?", "y=3x²-2", ["y=3x²-2", "y=3x-2", "y=3/x", "x²+y²=2"], ["x에 대한 식인지 확인한다.", "최고차항이 x²이고 그 계수가 0이 아닌 식을 고른다."], { memorizationOnly: true, traps: ["DEFINITION_CONFUSION"] }),
      short("coefficient-condition", "y=(k-4)x²+2가 이차함수가 되도록 하는 k의 조건을 쓰세요.", "k≠4", ["x²의 계수는 k-4이다.", "이차함수이려면 k-4≠0이므로 k≠4이다."], { acceptedAnswers: ["k != 4", "k≠4"], traps: ["ZERO_LEADING_COEFFICIENT"] }),
      mc("second-difference", "x가 0,1,2,3일 때 y가 1,4,9,16인 표가 나타내는 관계로 알맞은 것은?", "이차함수", ["일차함수", "이차함수", "반비례", "상수함수"], ["y의 1차 차이는 3,5,7이다.", "2차 차이가 2로 일정하므로 이차함수이다."], { linked: ["m3_quadratic_function_meaning", "statistics_intro"], traps: ["FIRST_DIFFERENCE_ONLY"] }),
    ],
    A1: [
      mc("rearranged-relation", "x²-y+2=0을 y에 대하여 정리했을 때 y가 x의 이차함수인지 판단한 것은?", "y=x²+2이므로 이차함수이다", ["y=x²+2이므로 이차함수이다", "y=x+2이므로 일차함수이다", "x와 y가 섞여 있어 함수가 아니다", "x²의 계수가 1이므로 상수함수이다"], ["식을 y= 꼴로 정리한다.", "y=x²+2의 최고차항을 확인한다."], { traps: ["FORM_NOT_REARRANGED"] }),
      short("table-missing-value", "y=-2x²+3에서 x=-2일 때 y의 값을 구하세요.", "-5", ["(-2)²=4를 계산한다.", "-2×4+3=-5를 계산한다."], { traps: ["NEGATIVE_SQUARE_SIGN"] }),
      expression("point-to-coefficient", "이차함수 y=ax²이 점 (3,18)을 지날 때 a의 값을 식으로 구하세요.", "a=2", ["점의 좌표를 y=ax²에 대입한다.", "18=9a에서 a=2를 구한다."], { acceptedAnswers: ["2", "a=2"], traps: ["COORDINATE_SWAP"] }),
    ],
    A2: [
      short("parameter-exclusion", "y=(m²-9)x²+mx+1이 이차함수가 되지 않는 m의 값을 모두 쓰세요.", "-3,3", ["이차항의 계수 m²-9를 찾는다.", "m²-9=0을 풀어 m=-3,3을 구한다."], { acceptedAnswers: ["3,-3", "-3,3"], traps: ["LINEAR_TERM_DISTRACTOR"] }),
      mc("compare-two-tables", "표 A의 y값은 2,5,10,17이고 표 B의 y값은 2,6,10,14이다. x가 0,1,2,3일 때 이차함수를 나타내는 표는?", "표 A", ["표 A", "표 B", "둘 다", "둘 다 아니다"], ["각 표의 1차 차이를 구한다.", "표 A만 2차 차이가 일정함을 확인한다."], { linked: ["m3_quadratic_function_meaning", "statistics_intro"], traps: ["CONSTANT_FIRST_DIFFERENCE"] }),
      expression("area-model", "한 변의 길이가 x+2인 정사각형에서 둘레 4를 뺀 값을 y라 할 때 y를 x의 식으로 나타내세요.", "y=(x+2)^2-4", ["정사각형의 넓이를 (x+2)²으로 나타낸다.", "조건대로 4를 빼서 y=(x+2)²-4를 세운다."], { acceptedAnswers: ["y=x^2+4x", "x^2+4x"], linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"], traps: ["PERIMETER_AREA_CONFUSION"] }),
    ],
    A3: [
      expression("sequence-formula", "x=0,1,2일 때 y=2,5,12이다. y=ax²+bx+2 꼴에서 a,b를 구해 식을 완성하세요.", "y=2x^2+x+2", ["x=1을 대입해 a+b=3을 얻는다.", "x=2를 대입해 4a+2b=10을 얻는다.", "연립하여 a=2,b=1을 구하고 식을 완성한다."], { linked: ["m3_quadratic_function_meaning", "system_equation"], traps: ["INSUFFICIENT_CONDITION_USE"] }),
      expression("geometric-model", "밑변이 x+1, 높이가 2x-1인 삼각형의 넓이를 y라 할 때 y를 x의 식으로 나타내세요.", "y=((x+1)*(2x-1))/2", ["삼각형의 넓이 공식을 선택한다.", "밑변과 높이를 대입한다.", "y=(x+1)(2x-1)/2로 정리한다."], { acceptedAnswers: ["y=(2x^2+x-1)/2"], linked: ["m3_quadratic_function_meaning", "basic_geometry"], traps: ["MISSING_HALF"] }),
      mc("parameter-and-point", "y=(a-1)x²+(2-a)x+3이 이차함수이고 점 (1,4)를 지날 때 옳은 것은?", "a는 1이 아닌 모든 실수이다", ["a는 1이 아닌 모든 실수이다", "a=1", "a=2", "조건을 만족하는 a는 없다"], ["x=1,y=4를 대입하면 항등적으로 4가 됨을 확인한다.", "이차함수 조건 a-1≠0을 적용한다.", "따라서 a≠1을 결론낸다."], { traps: ["REDUNDANT_POINT_CONDITION"] }),
    ],
    A4: [
      expression("finite-difference-reconstruction", "x가 -1,0,1,2일 때 y가 6,1,0,3이다. y=ax²+bx+c의 식을 구하세요.", "y=2x^2-3x+1", ["x=0에서 c=1을 얻는다.", "x=1,-1 조건으로 a+b=-1, a-b=5를 세운다.", "a=2,b=-3을 구한다.", "x=2에서 y=3으로 검산한다."], { linked: ["m3_quadratic_function_meaning", "system_equation"], traps: ["TABLE_SIGN_ERROR"] }),
      stepOrder("model-selection-process", "가로가 세로보다 3 긴 직사각형의 넀이 40이다. 세로 x에 따른 넓이 y를 이차함수로 모델링하는 순서를 배열하세요.", ["세로를x,가로를x+3으로둔다", "넓이관계y=x(x+3)을세운다", "식을y=x²+3x로정리한다", "x>0인정의역을확인한다"], ["두 길이를 하나의 변수로 나타낸다.", "넓이 공식을 적용한다.", "이차식으로 정리한다.", "길이의 범위를 검증한다."], { linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"], traps: ["DOMAIN_OMISSION"] }),
      written("quadratic-justification", "정사각형 모양의 화단 한 변을 x m 늘렸더니 넓이 증가량이 x²+8x가 되었다. 이 증가량이 x의 이차함수인 이유를 설명하세요.", "최고차항 x²의 계수가 1로 0이 아니므로 x²+8x는 x의 이차함수이다.", ["변화 전후 넓이 차를 식으로 본다.", "식의 최고차항과 계수를 확인한다.", "계수가 0이 아님을 근거로 이차함수임을 설명한다.", "x가 길이이므로 x≥0을 덧붙인다."], { requiredConcepts: [["최고차항", "이차항"], ["계수", "0이아님"]], requiredRelations: [["x²", "제곱"]], expectedResults: ["이차함수"], minimumScore: 0.75 }, { linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"], traps: ["DEFINITION_WITHOUT_EVIDENCE"] }),
    ],
    A5: [
      mc("noisy-data-strategy", "센서가 x=-2,-1,0,1,2에서 y=9,4,1,0,1을 기록했다. 이 자료가 이차함수임을 가장 설득력 있게 확인하는 전략은?", "2차 차이가 일정한지 확인하고 y=(x-1)²과 대조한다", ["2차 차이가 일정한지 확인하고 y=(x-1)²과 대조한다", "가운데 값 하나만 보고 판단한다", "모든 y값이 양수인지 확인한다", "x와 y의 합이 일정한지 확인한다"], ["자료를 x의 순서로 배열한다.", "1차 차이와 2차 차이를 계산한다.", "2차 차이가 일정함을 확인한다.", "꼭짓점 후보를 찾아 y=(x-1)²과 대조한다.", "모든 자료점이 식을 만족하는지 검증한다."], { archetype: "HIGH_DIFFICULTY_MULTIPLE_CHOICE", linked: ["m3_quadratic_function_meaning", "m3_quadratic_vertex_axis"], traps: ["SINGLE_POINT_JUDGMENT"] }),
      short("parameter-family-count", "y=(k²-5k+6)x²+(k-2)x+1이 일차함수가 되는 k의 값을 쓰세요.", "3", ["일차함수이려면 이차항 계수가 0이어야 한다.", "k²-5k+6=(k-2)(k-3)=0에서 k=2,3을 얻는다.", "일차항 계수 k-2가 0이면 안 된다.", "k=2를 제외하고 k=3을 남긴다.", "k=3을 원래 식에 넣어 y=x+1인지 검증한다."], { archetype: "SHORT_ANSWER", acceptedAnswers: ["k=3", "3"], linked: ["m3_quadratic_function_meaning", "m3_factor_sum_product"], traps: ["LEADING_TERM_ONLY"] }),
      written("transfer-proof", "홀수 1,3,5,7,…을 차례로 더한 합을 y, 더한 홀수의 개수를 x라 하자. y가 x의 이차함수임을 식과 규칙으로 설명하세요.", "앞의 x개 홀수의 합은 x²이므로 y=x²이며, 2차 차이가 일정하고 x²의 계수가 1이어서 이차함수이다.", ["홀수의 누적합을 몇 항 계산해 표로 나타낸다.", "1,4,9,16에서 y=x²의 규칙을 추측한다.", "연속한 제곱수의 차가 다음 홀수임을 이용해 규칙을 설명한다.", "y=x²으로 식을 세운다.", "이차항 계수와 2차 차이로 이차함수임을 검증한다."], { requiredConcepts: [["홀수", "1,3,5"], ["x²", "제곱"], ["이차함수"]], requiredRelations: [["합", "누적"], ["2차차이", "계수"]], expectedResults: ["y=x²", "y=x^2"], minimumScore: 0.75 }, { archetype: "WRITTEN", linked: ["m3_quadratic_function_meaning", "sequence_pattern"], traps: ["PATTERN_WITHOUT_JUSTIFICATION"] }),
    ],
  };

  BANK.m3_quadratic_graph_shape = {
    BASIC: [
      mc("opening-direction", "y=-3x²의 그래프가 열리는 방향은?", "아래쪽", ["위쪽", "아래쪽", "오른쪽", "왼쪽"], ["x²의 계수 -3의 부호를 확인한다.", "계수가 음수이므로 아래쪽으로 열린다."], { memorizationOnly: true, traps: ["SIGN_DIRECTION"] }),
      mc("width-comparison", "y=4x²과 y=x² 중 폭이 더 좁은 그래프는?", "y=4x²", ["y=4x²", "y=x²", "두 그래프가 같다", "판단할 수 없다"], ["두 이차항 계수의 절댓값을 비교한다.", "절댓값이 큰 4x²의 그래프가 더 좁다."], { memorizationOnly: true, traps: ["COEFFICIENT_WIDTH"] }),
      short("symmetric-value", "y=2x²에서 x=-3일 때 y의 값을 구하세요.", "18", ["(-3)²=9를 계산한다.", "2×9=18을 구한다."], { traps: ["NEGATIVE_SQUARE_SIGN"] }),
    ],
    A1: [
      mc("sign-and-width", "다음 중 아래쪽으로 열리고 y=-x²보다 폭이 좁은 그래프는?", "y=-5x²", ["y=-5x²", "y=-0.5x²", "y=5x²", "y=x²"], ["아래쪽 조건에서 계수가 음수인 식만 남긴다.", "폭이 좁으려면 계수 절댓값이 1보다 커야 한다."], { traps: ["TWO_CONDITION_FILTER"] }),
      short("point-membership", "점 (2,k)가 y=-3x²의 그래프 위에 있을 때 k를 구하세요.", "-12", ["x=2를 식에 대입한다.", "k=-3×4=-12를 구한다."], { traps: ["COORDINATE_SUBSTITUTION"] }),
      mc("quadrant-pattern", "x≠0일 때 y=2x²의 그래프 위의 점이 놓일 수 있는 사분면은?", "제1,2사분면", ["제1,2사분면", "제3,4사분면", "제1,4사분면", "모든 사분면"], ["x≠0이면 x²>0임을 확인한다.", "y=2x²>0이므로 위쪽 두 사분면만 가능하다."], { linked: ["m3_quadratic_graph_shape", "coordinate_plane"], traps: ["QUADRANT_SIGN"] }),
    ],
    A2: [
      short("coefficient-from-width", "y=ax²의 그래프가 아래쪽으로 열리고 y=-2x²보다 폭이 좁다. a가 정수이고 -5<a<0일 때 가능한 a의 개수를 구하세요.", "2", ["아래쪽이므로 a<0이다.", "폭이 더 좁으므로 |a|>2이다.", "범위에서 a=-4,-3 두 개를 센다."], { traps: ["INEQUALITY_WITH_ABSOLUTE_VALUE"] }),
      mc("ordered-values", "x=2에서 함수값의 크기가 큰 것부터 나열한 것은? (가) y=-3x², (나) y=2x², (다) y=0.5x²", "가,나,다", ["가,나,다", "나,가,다", "다,나,가", "가,다,나"], ["x=2를 각 식에 대입한다.", "함수값은 -12,8,2이다.", "크기를 절댓값으로 비교해 가,나,다를 얻는다."], { traps: ["VALUE_VS_MAGNITUDE"] }),
      expression("same-point-parameter", "y=ax²과 y=-2x²의 그래프가 x=3에서 같은 점을 지나도록 하는 a를 구하세요.", "a=-2", ["두 함수의 x=3에서의 값을 같게 둔다.", "9a=-18을 풀어 a=-2를 구한다."], { acceptedAnswers: ["-2", "a=-2"], traps: ["SAME_POINT_CONDITION"] }),
    ],
    A3: [
      expression("two-points-coefficient", "y=ax²의 그래프 위 두 점 P(-2,12), Q(3,k)가 있다. a와 k를 구해 a+k를 계산하세요.", "30", ["P를 대입해 12=4a에서 a=3을 구한다.", "Q를 대입해 k=3×9=27을 구한다.", "a+k=30을 계산한다."], { acceptedAnswers: ["30", "a+k=30"], linked: ["m3_quadratic_graph_shape", "coordinate_plane"], traps: ["POINT_ORDER"] }),
      mc("intersection-count", "y=x²과 y=-2x²+c가 서로 다른 두 점에서 만나도록 하는 c의 조건은?", "c>0", ["c>0", "c=0", "c<0", "모든 실수"], ["교점에서 x²=-2x²+c를 세운다.", "3x²=c로 정리한다.", "서로 다른 두 실근이 있으려면 c>0이다."], { linked: ["m3_quadratic_graph_shape", "m3_quadratic_root_meaning"], traps: ["INTERSECTION_ROOT_COUNT"] }),
      stepOrder("shape-inference-order", "점 (2,-8)을 지나는 y=ax²의 그래프 모양을 판단하는 순서를 배열하세요.", ["점의좌표를y=ax²에대입한다", "-8=4a에서a=-2를구한다", "a의부호로아래쪽을판단한다", "|a|=2로y=-x²보다좁음을판단한다"], ["좌표를 식에 대입한다.", "계수 a를 구한다.", "부호로 방향을 판단한다.", "절댓값으로 폭을 판단한다."], { traps: ["WIDTH_BEFORE_COEFFICIENT"] }),
    ],
    A4: [
      expression("three-graph-order", "x>0에서 세 그래프 y=ax², y=bx², y=cx²가 위에서부터 a,b,c 순이고 a+b+c=2이다. a=3, c=-2일 때 b와 x=2에서 세 함수값의 합을 구하세요.", "8", ["a+b+c=2에서 b=1을 구한다.", "x=2에서 함수값 합은 4(a+b+c)임을 세운다.", "4×2=8을 계산한다.", "개별 값 12,4,-8의 합으로 검산한다."], { linked: ["m3_quadratic_graph_shape", "algebra_expression"], traps: ["UNNECESSARY_INDIVIDUAL_CALCULATION"] }),
      mc("moving-line-intersections", "y=x²과 직선 y=2x+k의 교점이 하나가 되도록 하는 k는?", "-1", ["-1", "0", "1", "2"], ["교점 식 x²=2x+k를 세운다.", "x²-2x-k=0으로 정리한다.", "완전제곱식 (x-1)²=1+k를 만든다.", "교점 하나 조건에서 1+k=0이므로 k=-1이다."], { linked: ["m3_quadratic_graph_shape", "m3_quadratic_factor_solve"], traps: ["TANGENCY_CONDITION"] }),
      written("coefficient-geometry-proof", "a>0일 때 y=ax²에서 |a|가 커질수록 그래프 폭이 좁아지는 이유를 같은 y값에서의 x좌표를 이용해 설명하세요.", "같은 y>0에서 x²=y/a이므로 a가 커지면 |x|=√(y/a)가 작아져 두 점이 y축에 가까워지고 그래프 폭이 좁아진다.", ["같은 양의 y값을 고정한다.", "ax²=y에서 x²=y/a로 정리한다.", "a가 커지면 |x|가 작아짐을 설명한다.", "좌우 점이 y축에 가까워져 폭이 좁아짐을 결론낸다."], { requiredConcepts: [["같은y", "y값고정"], ["x²=y/a", "y/a"], ["y축", "폭"]], requiredRelations: [["a가커", "x가작"], ["가까", "좁"]], expectedResults: ["폭이좁"], minimumScore: 0.75 }, { linked: ["m3_quadratic_graph_shape", "m3_sqrt_meaning"], traps: ["RULE_WITHOUT_JUSTIFICATION"] }),
    ],
    A5: [
      mc("strategy-from-partial-data", "서로 다른 세 점 (-2,8), (1,2), (3,18)을 지나는 y=ax²의 후보를 검토하려 한다. 가장 먼저 해야 할 전략은?", "각 점에서 y/x²의 값이 같은지 비교한다", ["각 점에서 y/x²의 값이 같은지 비교한다", "세 y값의 평균을 구한다", "x좌표의 합만 확인한다", "가장 큰 y값만 식에 대입한다"], ["y=ax²에서는 x≠0일 때 y/x²=a임을 찾는다.", "세 점 각각에서 비를 계산한다.", "비가 모두 2인지 확인한다.", "a=2인 후보식 y=2x²을 세운다.", "세 점을 다시 대입해 검증한다."], { archetype: "STRATEGY_SELECTION", linked: ["m3_quadratic_graph_shape", "ratio"], traps: ["PARTIAL_POINT_CHECK"] }),
      stepOrder("intersection-error-analysis", "y=-x²+4와 x축의 위치 관계를 판단하는 풀이 단계를 배열하세요.", ["x축에서는y=0으로둔다", "-x²+4=0을세운다", "x²=4에서x=-2,2를구한다", "서로다른두교점(-2,0),(2,0)을확인한다", "아래로열리는그래프와결과가일치함을검증한다"], ["좌표축 조건을 식으로 바꾼다.", "교점 방정식을 세운다.", "두 해를 구한다.", "교점 좌표를 구성한다.", "그래프 방향과 결과를 검산한다."], { archetype: "PROCESS", linked: ["m3_quadratic_graph_shape", "m3_quadratic_root_meaning"], traps: ["ONE_ROOT_ONLY"] }),
      written("integrated-shape-argument", "y=ax²이 점 (2,-12)을 지나고 y=bx²은 점 (-3,9)을 지난다. 두 그래프의 방향과 폭을 비교하고 근거를 설명하세요.", "a=-3, b=1이므로 첫 그래프는 아래쪽, 둘째는 위쪽으로 열린다. |a|=3>|b|=1이어서 첫 그래프의 폭이 더 좁다.", ["각 점을 해당 식에 대입한다.", "a=-3과 b=1을 구한다.", "부호로 열린 방향을 비교한다.", "절댓값으로 폭을 비교한다.", "두 점을 재대입하여 계수와 결론을 검증한다."], { requiredConcepts: [["a=-3"], ["b=1"], ["아래", "위"], ["절댓값", "|a|"]], requiredRelations: [["3", "1", "좁"]], expectedResults: ["첫그래프의폭이더좁", "y=-3x²"], minimumScore: 0.7 }, { archetype: "INTEGRATED", linked: ["m3_quadratic_graph_shape", "coordinate_plane"], traps: ["SIGN_AND_WIDTH_MIXUP"] }),
    ],
  };

  BANK.m3_quadratic_vertex_axis = {
    BASIC: [
      short("read-vertex", "y=2(x-3)²+1의 꼭짓점을 쓰세요.", "(3,1)", ["y=a(x-p)²+q 꼴에서 p,q를 찾는다.", "꼭짓점은 (3,1)이다."], { acceptedAnswers: ["(3, 1)"], traps: ["INNER_SIGN"] }),
      expression("read-axis", "y=-(x+4)²+2의 축의 방정식을 쓰세요.", "x=-4", ["x+4=x-(-4)로 본다.", "꼭짓점 x좌표가 -4이므로 축은 x=-4이다."], { acceptedAnswers: ["-4", "x=-4"], traps: ["INNER_SIGN"] }),
      mc("origin-vertex", "y=-5x²의 꼭짓점과 축을 바르게 짝지은 것은?", "(0,0), x=0", ["(0,0), x=0", "(0,-5), x=-5", "(-5,0), x=0", "(0,5), x=5"], ["y=-5(x-0)²+0으로 본다.", "꼭짓점 (0,0), 축 x=0을 읽는다."], { memorizationOnly: true, traps: ["COEFFICIENT_AS_VERTEX"] }),
    ],
    A1: [
      short("complete-square-simple", "y=x²-6x+11의 꼭짓점을 구하세요.", "(3,2)", ["x²-6x=(x-3)²-9로 바꾼다.", "y=(x-3)²+2에서 꼭짓점 (3,2)를 읽는다."], { acceptedAnswers: ["(3, 2)"], traps: ["COMPLETING_SQUARE_CONSTANT"] }),
      short("symmetric-point", "축이 x=2인 포물선 위의 점 (5,7)과 y좌표가 같은 다른 점의 x좌표는?", "-1", ["5는 축 2에서 오른쪽으로 3만큼 떨어져 있다.", "왼쪽으로 3만큼인 x=-1을 구한다."], { traps: ["SYMMETRY_DISTANCE"] }),
      expression("axis-from-pair", "포물선 위 두 점 (-1,4), (5,4)가 서로 대칭일 때 축의 방정식을 쓰세요.", "x=2", ["같은 y값을 갖는 두 x좌표의 중점을 구한다.", "(-1+5)/2=2이므로 축은 x=2이다."], { acceptedAnswers: ["2", "x=2"], traps: ["SUM_WITHOUT_HALF"] }),
    ],
    A2: [
      short("parameter-axis", "y=x²+2kx+5의 축이 x=3일 때 k를 구하세요.", "-3", ["x²+2kx=(x+k)²-k²로 본다.", "축은 x=-k이므로 -k=3에서 k=-3이다."], { traps: ["AXIS_SIGN"] }),
      expression("vertex-form-conversion", "y=2x²-8x+5를 꼭짓점형으로 나타내세요.", "y=2(x-2)^2-3", ["2(x²-4x)+5로 묶는다.", "x²-4x=(x-2)²-4로 바꾼다.", "y=2(x-2)²-3으로 정리한다."], { acceptedAnswers: ["2(x-2)^2-3"], traps: ["OUTSIDE_COEFFICIENT"] }),
      mc("vertex-from-three-coefficients", "y=-x²+4x-1의 꼭짓점은?", "(2,3)", ["(2,3)", "(-2,3)", "(4,-1)", "(2,-3)"], ["-x²+4x=-(x²-4x)로 묶는다.", "x²-4x=(x-2)²-4를 사용한다.", "y=-(x-2)²+3에서 꼭짓점을 읽는다."], { traps: ["NEGATIVE_COMPLETING_SQUARE"] }),
    ],
    A3: [
      short("equal-values-axis", "y=x²+bx+3에서 f(-1)=f(5)일 때 축의 x좌표를 구하세요.", "2", ["같은 함수값을 갖는 -1과 5는 축에 대칭이다.", "두 x좌표의 중점 2를 구한다.", "축의 x좌표가 2임을 결론낸다."], { traps: ["UNNECESSARY_COEFFICIENT_SOLVE"] }),
      expression("vertex-and-point-parameter", "y=a(x-1)²+q의 꼭짓점 y좌표가 -2이고 점 (3,6)을 지날 때 a,q를 구하세요.", "a=2,q=-2", ["꼭짓점 조건에서 q=-2를 얻는다.", "점 (3,6)을 대입해 6=4a-2를 세운다.", "a=2를 구해 답을 정리한다."], { acceptedAnswers: ["q=-2,a=2", "a=2,q=-2"], traps: ["VERTEX_Y_MISREAD"] }),
      stepOrder("complete-square-process", "y=3x²+12x+7의 꼭짓점과 축을 구하는 순서를 배열하세요.", ["3(x²+4x)+7로묶는다", "x²+4x=(x+2)²-4로바꾼다", "y=3(x+2)²-5로정리한다", "꼭짓점(-2,-5),축x=-2를읽는다"], ["이차항 계수를 묶는다.", "괄호 안을 완전제곱식으로 만든다.", "상수항을 정리한다.", "꼭짓점과 축을 읽는다."], { traps: ["FACTOR_THREE_CONSTANT"] }),
    ],
    A4: [
      expression("symmetric-points-and-vertex", "축이 x=1인 포물선이 점 (-1,8), (2,-1)을 지난다. y=a(x-1)²+q의 a,q를 구하세요.", "a=3,q=-4", ["두 점을 꼭짓점형에 대입해 8=4a+q, -1=a+q를 세운다.", "두 식을 빼 9=3a에서 a=3을 구한다.", "q=-4를 구한다.", "두 점과 축 조건으로 검산한다."], { acceptedAnswers: ["q=-4,a=3", "a=3,q=-4"], linked: ["m3_quadratic_vertex_axis", "system_equation"], traps: ["DISTANCE_SQUARED"] }),
      mc("vertex-from-root-symmetry", "포물선 y=x²+bx+c가 x축과 x=-2, x=6에서 만나고 점 (0,-12)을 지날 때 꼭짓점은?", "(2,-16)", ["(2,-16)", "(-2,-12)", "(4,-16)", "(2,16)"], ["두 x절편의 중점 2가 축임을 찾는다.", "식은 (x+2)(x-6)임을 점 (0,-12)로 확인한다.", "x=2를 대입해 y=-16을 구한다.", "꼭짓점 (2,-16)을 결론낸다."], { linked: ["m3_quadratic_vertex_axis", "m3_quadratic_factor_solve"], traps: ["ROOT_SUM_AS_AXIS"] }),
      written("axis-symmetry-explanation", "포물선 위 점 A(-3,5)와 B(7,5)가 있을 때 축이 x=2인 이유를 거리와 대칭을 이용해 설명하세요.", "같은 y값을 갖는 두 점은 축에 대칭이고, -3과 7의 중점은 2이며 두 점은 x=2에서 각각 5만큼 떨어져 있으므로 축은 x=2이다.", ["두 점의 y좌표가 같음을 확인한다.", "같은 높이의 두 점이 축에 대칭임을 사용한다.", "x좌표 중점 (-3+7)/2=2를 구한다.", "두 수평 거리가 모두 5임을 검증한다."], { requiredConcepts: [["같은y", "같은높이"], ["대칭"], ["중점", "평균"]], requiredRelations: [["-3", "7", "2"], ["거리", "5"]], expectedResults: ["x=2"], minimumScore: 0.75 }, { linked: ["m3_quadratic_vertex_axis", "coordinate_plane"], traps: ["MIDPOINT_WITHOUT_REASON"] }),
    ],
    A5: [
      expression("vertex-from-three-values", "이차함수 f(x)=ax²+bx+c가 f(-1)=6, f(1)=2, f(3)=6을 만족한다. 꼭짓점을 구하세요.", "(1,2)", ["f(-1)=f(3)에서 축이 두 x좌표의 중점 x=1임을 찾는다.", "f(1)=2가 축 위의 함수값임을 확인한다.", "꼭짓점 후보 (1,2)를 세운다.", "세 조건으로 a=1,b=-2,c=3을 구할 수 있음을 확인한다.", "f(x)=(x-1)²+2로 검산한다."], { archetype: "EXPRESSION", acceptedAnswers: ["(1, 2)"], linked: ["m3_quadratic_vertex_axis", "system_equation"], traps: ["SOLVE_ALL_BEFORE_SYMMETRY"] }),
      stepOrder("error-correction-process", "학생이 y=-2x²+8x-3의 축을 x=-2라고 했다. 오류를 고치는 과정을 배열하세요.", ["-2(x²-4x)-3으로묶는다", "x²-4x=(x-2)²-4로바꾼다", "y=-2(x-2)²+5로정리한다", "괄호안부호를확인해축x=2를얻는다", "원식의x=1,3함수값이같은지검산한다"], ["이차항 계수를 정확히 묶는다.", "완전제곱식을 만든다.", "꼭짓점형으로 정리한다.", "축의 부호를 바로잡는다.", "대칭 함수값으로 검증한다."], { archetype: "PROCESS", linked: ["m3_quadratic_vertex_axis", "m3_multiplication_formula"], traps: ["DOUBLE_SIGN_ERROR"] }),
      written("integrated-vertex-proof", "이차함수 y=a(x-p)²+q가 점 (p-2,9), (p+2,9), (p,1)을 지난다. p의 값을 정할 수 있는지와 a,q를 설명하세요.", "q=1이고 9=4a+1이므로 a=2이다. 세 점의 x좌표는 p를 기준으로 대칭이지만 절대 위치 정보가 없으므로 p의 값은 정할 수 없다.", ["점 (p,1)이 꼭짓점이므로 q=1임을 찾는다.", "대칭인 두 점의 가로 거리가 2임을 확인한다.", "9=4a+1에서 a=2를 구한다.", "조건이 모든 p에 대해 평행이동된 같은 모양을 허용함을 분석한다.", "p는 미정, a=2,q=1이라는 결론을 검증한다."], { requiredConcepts: [["q=1"], ["a=2"], ["대칭"], ["p", "정할수없"]], requiredRelations: [["거리2", "4a"], ["평행이동", "위치정보"]], expectedResults: ["p는정할수없", "a=2", "q=1"], minimumScore: 0.7 }, { archetype: "WRITTEN", linked: ["m3_quadratic_vertex_axis", "m3_quadratic_translation"], traps: ["ASSUME_VERTEX_X_ZERO"] }),
    ],
  };

  BANK.m3_quadratic_translation = {
    BASIC: [
      expression("horizontal-shift", "y=x²을 오른쪽으로 4만큼 평행이동한 식을 쓰세요.", "y=(x-4)^2", ["오른쪽 이동은 x를 x-4로 바꾼다.", "y=(x-4)²을 쓴다."], { acceptedAnswers: ["(x-4)^2"], traps: ["HORIZONTAL_SIGN"] }),
      expression("vertical-shift", "y=-2x²을 위로 3만큼 평행이동한 식을 쓰세요.", "y=-2x^2+3", ["위쪽 이동은 함수값에 3을 더한다.", "y=-2x²+3을 쓴다."], { acceptedAnswers: ["-2x^2+3"], traps: ["VERTICAL_SIGN"] }),
      mc("combined-shift", "y=x²을 왼쪽으로 2, 아래로 1만큼 옮긴 식은?", "y=(x+2)²-1", ["y=(x+2)²-1", "y=(x-2)²-1", "y=(x+2)²+1", "y=x²+1"], ["왼쪽 이동에서 x를 x+2로 바꾼다.", "아래 이동에서 1을 빼 y=(x+2)²-1을 얻는다."], { traps: ["TWO_AXIS_SIGN"] }),
    ],
    A1: [
      mc("identify-shift", "y=(x-5)²+2는 y=x²을 어떻게 옮긴 그래프인가?", "오른쪽 5, 위 2", ["오른쪽 5, 위 2", "왼쪽 5, 위 2", "오른쪽 2, 위 5", "왼쪽 5, 아래 2"], ["괄호 안 x-5에서 가로 이동을 읽는다.", "+2에서 세로 이동을 읽는다."], { traps: ["INNER_SIGN"] }),
      expression("shift-existing-vertex", "y=2(x-1)²-3을 왼쪽으로 4만큼 옮긴 식을 쓰세요.", "y=2(x+3)^2-3", ["기존 꼭짓점 x좌표 1을 확인한다.", "왼쪽 4 이동 후 x좌표가 -3이므로 y=2(x+3)²-3이다."], { acceptedAnswers: ["2(x+3)^2-3"], traps: ["SHIFT_RELATIVE_TO_ORIGIN"] }),
      short("moved-vertex", "꼭짓점이 (-2,4)인 그래프를 오른쪽으로 5, 아래로 3만큼 옮겼을 때 새 꼭짓점을 쓰세요.", "(3,1)", ["x좌표 -2+5=3을 구한다.", "y좌표 4-3=1을 구한다."], { acceptedAnswers: ["(3, 1)"], traps: ["COORDINATE_DIRECTION"] }),
    ],
    A2: [
      expression("reverse-shift", "y=(x+1)²-4를 오른쪽으로 3, 위로 2만큼 옮긴 결과를 쓰세요.", "y=(x-2)^2-2", ["기존 꼭짓점 (-1,-4)을 찾는다.", "이동 후 꼭짓점 (2,-2)를 구한다.", "y=(x-2)²-2를 쓴다."], { acceptedAnswers: ["(x-2)^2-2"], traps: ["COMPOSED_SHIFT"] }),
      stepOrder("two-successive-shifts", "y=-x²을 오른쪽 2, 위 5, 다시 왼쪽 1만큼 옮기는 과정을 배열하세요.", ["오른쪽2이동후y=-(x-2)²", "위5이동후y=-(x-2)²+5", "왼쪽1이동후꼭짓점x좌표가1", "최종식y=-(x-1)²+5"], ["첫 가로 이동을 반영한다.", "세로 이동을 반영한다.", "두 번째 가로 이동을 꼭짓점에 합친다.", "최종식을 확인한다."], { traps: ["SHIFT_ORDER_SIGN"] }),
      mc("point-mapping", "y=x²의 점 (-2,4)는 그래프를 오른쪽 3, 아래 1만큼 옮기면 어느 점으로 이동하는가?", "(1,3)", ["(1,3)", "(-5,3)", "(1,5)", "(-2,3)"], ["점의 x좌표에 3을 더한다.", "y좌표에서 1을 뺀다.", "새 점 (1,3)을 얻는다."], { linked: ["m3_quadratic_translation", "coordinate_plane"], traps: ["MOVE_EQUATION_NOT_POINT"] }),
    ],
    A3: [
      expression("derive-from-mapped-points", "y=ax²을 평행이동한 그래프의 꼭짓점이 (2,-1)이고 점 (4,7)을 지난다. 식을 구하세요.", "y=2(x-2)^2-1", ["꼭짓점으로 y=a(x-2)²-1을 세운다.", "점 (4,7)을 대입해 7=4a-1을 얻는다.", "a=2를 구해 식을 완성한다."], { acceptedAnswers: ["2(x-2)^2-1"], linked: ["m3_quadratic_translation", "m3_quadratic_find_formula"], traps: ["VERTEX_ONLY"] }),
      short("recover-original-vertex", "어떤 포물선을 왼쪽 4, 위로 3만큼 옮겼더니 꼭짓점이 (-1,5)가 되었다. 원래 꼭짓점을 구하세요.", "(3,2)", ["이동의 반대 방향을 적용한다.", "x좌표 -1+4=3을 구한다.", "y좌표 5-3=2를 구한다."], { acceptedAnswers: ["(3, 2)"], traps: ["REVERSE_TRANSLATION"] }),
      stepOrder("standard-to-shift", "y=x²-6x+5가 y=x²을 어떻게 평행이동한 것인지 찾는 순서를 배열하세요.", ["x²-6x+5=(x-3)²-4로완전제곱한다", "꼭짓점(3,-4)를읽는다", "원래꼭짓점(0,0)과비교한다", "오른쪽3,아래4이동으로결론낸다"], ["표준형을 꼭짓점형으로 바꾼다.", "새 꼭짓점을 읽는다.", "원래 꼭짓점과 비교한다.", "가로·세로 이동을 말한다."], { linked: ["m3_quadratic_translation", "m3_multiplication_formula"], traps: ["READ_STANDARD_FORM_DIRECTLY"] }),
    ],
    A4: [
      expression("translate-through-fixed-point", "y=2x²의 그래프를 평행이동했더니 원래 점 (1,2)가 (4,-2)로 옮겨졌다. 새 그래프의 식을 구하세요.", "y=2(x-3)^2-4", ["점 이동 벡터가 (3,-4)임을 구한다.", "원래 꼭짓점 (0,0)을 같은 벡터로 옮겨 (3,-4)를 얻는다.", "계수 2는 변하지 않으므로 y=2(x-3)²-4를 세운다.", "옮겨진 점 (4,-2)를 대입해 식을 검증한다."], { acceptedAnswers: ["2(x-3)^2-4"], linked: ["m3_quadratic_translation", "coordinate_plane"], traps: ["MOVE_POINT_AND_GRAPH_DIFFERENTLY"] }),
      mc("two-graphs-translation", "y=(x-1)²+4를 평행이동하여 y=(x+3)²-2로 만들 때 이동 벡터는?", "왼쪽 4, 아래 6", ["왼쪽 4, 아래 6", "오른쪽 4, 아래 6", "왼쪽 2, 아래 4", "오른쪽 2, 위 6"], ["첫 꼭짓점 (1,4)를 찾는다.", "둘째 꼭짓점 (-3,-2)를 찾는다.", "x변화 -4, y변화 -6을 계산한다.", "왼쪽 4, 아래 6으로 해석한다."], { linked: ["m3_quadratic_translation", "coordinate_plane"], traps: ["VECTOR_DIRECTION"] }),
      written("translation-invariant", "포물선을 평행이동해도 폭과 열린 방향이 변하지 않는 이유를 식 y=a(x-p)²+q의 각 요소로 설명하세요.", "평행이동은 p와 q만 바꾸고 계수 a는 바꾸지 않는다. 방향은 a의 부호, 폭은 |a|로 정해지므로 방향과 폭은 유지된다.", ["평행이동 전후 식을 꼭짓점형으로 비교한다.", "이동은 p,q를 바꾼다는 점을 확인한다.", "계수 a가 그대로임을 설명한다.", "a의 부호와 절댓값이 방향과 폭을 정함을 연결한다."], { requiredConcepts: [["p", "q"], ["a", "계수"], ["부호", "방향"], ["절댓값", "폭"]], requiredRelations: [["a", "변하지"], ["방향", "폭", "유지"]], expectedResults: ["변하지", "유지"], minimumScore: 0.75 }, { linked: ["m3_quadratic_translation", "m3_quadratic_graph_shape"], traps: ["SHAPE_CHANGE_ASSUMPTION"] }),
    ],
    A5: [
      expression("unknown-vector-from-two-conditions", "y=x²을 (u,v)만큼 평행이동한 그래프가 점 (1,0), (5,0)을 지난다. 아래쪽으로 이동했다면 새 식을 구하세요.", "y=(x-3)^2-4", ["두 x절편의 중점 3이 축임을 찾는다.", "원래 축 x=0에서 u=3임을 구한다.", "점 (1,0)을 y=(x-3)²+v에 대입한다.", "0=4+v에서 v=-4를 구한다.", "점 (5,0)과 아래 이동 조건으로 검증한다."], { archetype: "EXPRESSION", acceptedAnswers: ["(x-3)^2-4"], linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis", "m3_quadratic_root_meaning"], traps: ["USE_ONE_ROOT_ONLY"] }),
      stepOrder("route-comparison-process", "y=x²-4x+1을 y=x²에서의 평행이동으로 해석하는 두 풀이를 검증하는 순서를 배열하세요.", ["완전제곱해y=(x-2)²-3을얻는다", "꼭짓점이(2,-3)임을읽는다", "이동벡터(2,-3)을구한다", "후보식에x=0,2를대입해원식과비교한다", "오른쪽2,아래3이동을확정한다"], ["표준형을 꼭짓점형으로 바꾼다.", "꼭짓점을 해석한다.", "이동 벡터를 만든다.", "대표 좌표로 두 식의 일치를 검증한다.", "이동을 결론낸다."], { archetype: "PROCESS", linked: ["m3_quadratic_translation", "m3_multiplication_formula"], traps: ["ALGEBRA_WITHOUT_GEOMETRY_CHECK"] }),
      written("integrated-translation-proof", "그래프 G:y=2x²을 평행이동한 H가 점 A(1,3), B(3,3)을 지난다. H의 식이 하나로 정해지는지 설명하고, 정해지지 않으면 추가로 필요한 조건을 제시하세요.", "A와 B는 같은 높이에서 축에 대칭이므로 축은 x=2이다. 평행이동에서는 계수 2가 유지되므로 H는 y=2(x-2)²+q이다. A를 대입하면 q=1이어서 H는 y=2(x-2)²+1로 하나로 정해진다.", ["같은 y값의 두 점에서 축 x=2를 찾는다.", "평행이동이므로 계수 2가 유지됨을 사용한다.", "H:y=2(x-2)²+q를 세운다.", "A를 대입해 q=1을 구한다.", "B도 만족하는지 검증하고 유일성을 설명한다."], { requiredConcepts: [["축", "x=2"], ["계수2", "폭"], ["q=1"]], requiredRelations: [["같은높이", "대칭"], ["평행이동", "계수유지"]], expectedResults: ["y=2(x-2)²+1", "y=2(x-2)^2+1"], minimumScore: 0.7 }, { archetype: "WRITTEN", linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis"], traps: ["CLAIM_UNDERDETERMINED"] }),
    ],
  };

  BANK.m3_quadratic_find_formula = {
    BASIC: [
      expression("vertex-and-point", "꼭짓점이 (1,2)이고 점 (2,5)를 지나는 이차함수 y=a(x-1)²+2의 식을 구하세요.", "y=3(x-1)^2+2", ["점 (2,5)를 식에 대입한다.", "5=a+2에서 a=3을 구해 식을 쓴다."], { acceptedAnswers: ["3(x-1)^2+2"], traps: ["VERTEX_COEFFICIENT"] }),
      expression("origin-and-point", "꼭짓점이 원점이고 점 (-2,8)을 지나는 이차함수의 식을 구하세요.", "y=2x^2", ["꼭짓점이 원점이므로 y=ax²으로 둔다.", "8=4a에서 a=2를 구한다."], { acceptedAnswers: ["2x^2"], traps: ["NEGATIVE_X_SQUARE"] }),
      mc("choose-vertex-form", "꼭짓점이 (-3,1)인 이차함수의 식으로 가능한 것은?", "y=2(x+3)²+1", ["y=2(x+3)²+1", "y=2(x-3)²+1", "y=2(x+1)²+3", "y=2x²-3"], ["꼭짓점형 y=a(x-p)²+q를 떠올린다.", "p=-3,q=1인 식을 고른다."], { traps: ["INNER_SIGN"] }),
    ],
    A1: [
      short("find-coefficient", "y=a(x+2)²-1이 점 (0,7)을 지날 때 a를 구하세요.", "2", ["점 (0,7)을 식에 대입한다.", "7=4a-1에서 a=2를 구한다."], { traps: ["SUBSTITUTION_CONSTANT"] }),
      expression("axis-point-vertex", "축이 x=3이고 최솟값이 -2이며 점 (4,1)을 지나는 이차함수의 식을 구하세요.", "y=3(x-3)^2-2", ["축과 최솟값으로 꼭짓점 (3,-2)를 찾는다.", "y=a(x-3)²-2에 점 (4,1)을 대입해 a=3을 구한다."], { acceptedAnswers: ["3(x-3)^2-2"], traps: ["MINIMUM_AS_COEFFICIENT"] }),
      mc("match-three-properties", "아래쪽으로 열리고 꼭짓점이 (2,4)이며 점 (1,2)를 지나는 식은?", "y=-2(x-2)²+4", ["y=-2(x-2)²+4", "y=2(x-2)²+4", "y=-2(x+2)²+4", "y=-(x-2)²+4"], ["꼭짓점형 y=a(x-2)²+4를 세운다.", "점 (1,2)를 대입해 a=-2를 구한다."], { traps: ["OPENING_DIRECTION"] }),
    ],
    A2: [
      expression("two-symmetric-points", "축이 x=1인 이차함수가 점 (-1,5), (2,-1)을 지난다. 식을 구하세요.", "y=2(x-1)^2-3", ["y=a(x-1)²+q로 둔다.", "5=4a+q, -1=a+q를 세운다.", "a=2,q=-3을 구해 식을 쓴다."], { acceptedAnswers: ["2(x-1)^2-3"], linked: ["m3_quadratic_find_formula", "system_equation"], traps: ["DISTANCE_NOT_SQUARED"] }),
      expression("three-table-values", "f(0)=3, f(1)=0, f(2)=3이고 축이 x=1인 이차함수의 식을 구하세요.", "y=3(x-1)^2", ["축과 f(1)=0에서 꼭짓점 (1,0)을 찾는다.", "f(0)=3을 y=a(x-1)²에 대입한다.", "a=3을 구하고 f(2)=3으로 검산한다."], { acceptedAnswers: ["3(x-1)^2"], traps: ["IGNORE_SYMMETRY"] }),
      stepOrder("formula-selection-order", "꼭짓점 (p,q)와 꼭짓점이 아닌 한 점이 주어졌을 때 식을 구하는 순서를 배열하세요.", ["y=a(x-p)²+q로둔다", "주어진점의좌표를대입한다", "계수a를구한다", "완성한식에꼭짓점과점을다시대입한다"], ["꼭짓점형을 선택한다.", "추가 점 조건을 사용한다.", "계수를 결정한다.", "모든 조건을 검증한다."], { traps: ["FORM_SELECTION"] }),
    ],
    A3: [
      expression("axis-and-two-values", "축이 x=-1이고 f(0)=2, f(2)=18인 이차함수의 식을 구하세요.", "y=2(x+1)^2", ["y=a(x+1)²+q로 둔다.", "a+q=2, 9a+q=18을 세운다.", "a=2,q=0을 구해 식을 완성한다."], { acceptedAnswers: ["2(x+1)^2"], linked: ["m3_quadratic_find_formula", "system_equation"], traps: ["AXIS_SIGN"] }),
      short("unknown-vertex-height", "y=a(x-2)²+q가 점 (1,5), (4,14)를 지날 때 q를 구하세요.", "2", ["a+q=5, 4a+q=14를 세운다.", "두 식의 차에서 3a=9, a=3을 구한다.", "q=2를 구한다."], { traps: ["EQUATION_SUBTRACTION"] }),
      mc("minimum-and-intercept", "최솟값이 -4이고 축이 x=1이며 y절편이 -1인 이차함수는?", "y=3(x-1)²-4", ["y=3(x-1)²-4", "y=-3(x-1)²-4", "y=3(x+1)²-4", "y=(x-1)²-4"], ["꼭짓점 (1,-4)에서 y=a(x-1)²-4로 둔다.", "y절편 조건 -1=a-4를 세운다.", "a=3을 구한다."], { traps: ["Y_INTERCEPT_SUBSTITUTION"] }),
    ],
    A4: [
      expression("three-general-points", "점 (-1,6), (1,2), (3,6)을 지나는 이차함수의 식을 구하세요.", "y=(x-1)^2+2", ["첫째와 셋째 점의 같은 y값에서 축 x=1을 찾는다.", "y=a(x-1)²+q로 둔다.", "점 (1,2)에서 q=2를 얻는다.", "점 (-1,6)에서 6=4a+2, a=1을 구한다."], { acceptedAnswers: ["(x-1)^2+2"], linked: ["m3_quadratic_find_formula", "m3_quadratic_vertex_axis"], traps: ["SOLVE_GENERAL_SYSTEM"] }),
      stepOrder("mixed-condition-process", "x절편이 -1,5이고 점 (1,-12)을 지나는 이차함수의 식을 구하는 순서를 배열하세요.", ["y=a(x+1)(x-5)로둔다", "점(1,-12)를대입한다", "-12=-8a에서a=3/2를구한다", "식y=3/2(x+1)(x-5)를완성한다", "두x절편과점을검산한다"], ["x절편에 맞는 인수형을 선택한다.", "추가 점을 대입한다.", "계수를 구한다.", "식을 완성한다.", "모든 조건을 검증한다."], { linked: ["m3_quadratic_find_formula", "m3_quadratic_factor_solve"], traps: ["ROOT_SIGN"] }),
      written("uniqueness-condition", "꼭짓점이 (2,-3)이라는 조건만으로 이차함수의 식이 하나로 정해지지 않는 이유와, 식을 하나로 정하기 위해 필요한 추가 조건을 설명하세요.", "y=a(x-2)²-3에서 a가 정해지지 않았으므로 식이 여러 개이다. 꼭짓점이 아닌 한 점 또는 그래프의 폭을 정하는 계수 a가 추가로 필요하다.", ["꼭짓점 조건으로 y=a(x-2)²-3을 세운다.", "미정인 계수 a를 확인한다.", "a에 따라 폭과 방향이 달라짐을 설명한다.", "꼭짓점 아닌 한 점이나 a값이 추가로 필요함을 제시한다."], { requiredConcepts: [["a", "계수"], ["정해지지", "여러개"], ["추가", "한점", "폭"]], requiredRelations: [["a", "폭", "방향"]], expectedResults: ["y=a(x-2)²-3", "y=a(x-2)^2-3"], minimumScore: 0.7 }, { linked: ["m3_quadratic_find_formula", "m3_quadratic_graph_shape"], traps: ["ASSUME_A_ONE"] }),
    ],
    A5: [
      expression("four-condition-transfer", "이차함수 f의 축은 x=2이고 f(0)=f(4)=5, f(1)=2이다. f(x)를 구하세요.", "f(x)=(x-2)^2+1", ["대칭 조건으로 꼭짓점형 f(x)=a(x-2)²+q를 선택한다.", "f(0)=5에서 4a+q=5를 세운다.", "f(1)=2에서 a+q=2를 세운다.", "두 식을 풀어 a=1,q=1을 구한다.", "f(4)=5로 식 f(x)=(x-2)²+1을 검증한다."], { archetype: "EXPRESSION", acceptedAnswers: ["f(x)=(x-2)^2+1", "y=(x-2)^2+1"], linked: ["m3_quadratic_find_formula", "system_equation"], traps: ["INCONSISTENT_KEY_CHECK"] }),
      stepOrder("integrated-form-choice", "x절편이 1,5이고 최솟값이 -8인 이차함수의 식을 구하는 과정을 배열하세요.", ["두x절편의중점3을축으로찾는다", "y=a(x-1)(x-5)로둔다", "x=3에서최솟값-8을대입한다", "-8=-4a에서a=2를구한다", "y=2(x-1)(x-5)를완성하고꼭짓점을검산한다"], ["x절편에서 축을 찾는다.", "인수형을 선택한다.", "최솟값 조건을 적용한다.", "계수를 결정한다.", "식과 꼭짓점을 검증한다."], { archetype: "INTEGRATED", linked: ["m3_quadratic_find_formula", "m3_quadratic_max_min", "m3_quadratic_factor_solve"], traps: ["VERTEX_VALUE_SIGN"] }),
      written("strategy-and-uniqueness", "표에서 f(-1)=9, f(1)=1, f(3)=1, f(5)=9임을 알았다. 최소 계산으로 f(x)를 구하는 전략과 유일성을 설명하세요.", "같은 함수값을 갖는 두 점은 축에 대칭이고, -1과 5 및 1과 3의 중점이 모두 2이므로 축은 x=2이다. 꼭짓점형 f(x)=a(x-2)²+q로 두고 두 식 a+q=1, 9a+q=9를 풀면 a=1,q=0이다. 따라서 f(x)=(x-2)²으로 유일하다.", ["같은 함수값 쌍에서 공통 중점 2를 찾아 축을 정한다.", "꼭짓점형 f(x)=a(x-2)²+q를 선택한다.", "거리 1과 3인 점 조건으로 두 식을 세운다.", "a=1,q=0을 구한다.", "네 점을 모두 대입해 식의 유일성을 검증한다."], { requiredConcepts: [["중점", "축x=2"], ["꼭짓점형"], ["a=1"], ["q=0"]], requiredRelations: [["같은함수값", "대칭"], ["두식", "유일"]], expectedResults: ["f(x)=(x-2)²", "f(x)=(x-2)^2"], minimumScore: 0.7 }, { archetype: "WRITTEN", linked: ["m3_quadratic_find_formula", "m3_quadratic_vertex_axis"], traps: ["USE_ALL_POINTS_BRUTE_FORCE"] }),
    ],
  };

  BANK.m3_quadratic_max_min = {
    BASIC: [
      short("read-minimum", "y=2(x-3)²-5의 최솟값을 구하세요.", "-5", ["계수 2가 양수라 위로 열린다.", "(x-3)²=0일 때 최솟값 -5이다."], { traps: ["VERTEX_X_AS_VALUE"] }),
      short("read-maximum", "y=-(x+1)²+7의 최댓값을 구하세요.", "7", ["계수가 음수라 아래로 열린다.", "(x+1)²=0일 때 최댓값 7이다."], { traps: ["OPENING_DIRECTION"] }),
      mc("no-opposite-extreme", "y=3x²+2의 최댓값과 최솟값에 대한 설명은?", "최솟값 2, 최댓값 없음", ["최솟값 2, 최댓값 없음", "최댓값 2, 최솟값 없음", "최댓값과 최솟값 모두 2", "둘 다 없음"], ["계수 3이 양수라 위로 열린다.", "꼭짓점 y값 2가 최솟값이고 위로는 제한이 없다."], { memorizationOnly: true, traps: ["ASSUME_BOTH_EXTREMA"] }),
    ],
    A1: [
      short("complete-square-minimum", "y=x²-4x+9의 최솟값을 구하세요.", "5", ["y=(x-2)²+5로 완전제곱한다.", "제곱항이 0일 때 최솟값 5를 얻는다."], { traps: ["COMPLETING_SQUARE_CONSTANT"] }),
      short("interval-endpoints", "-1≤x≤2에서 y=x²의 최댓값을 구하세요.", "4", ["꼭짓점 x=0과 양 끝점을 확인한다.", "함수값 1,0,4 중 최댓값 4를 고른다."], { traps: ["CHECK_ONLY_VERTEX"] }),
      mc("maximum-location", "y=-2(x-4)²+3이 최댓값을 갖는 x와 최댓값은?", "x=4, 최댓값 3", ["x=4, 최댓값 3", "x=-4, 최댓값 3", "x=3, 최댓값 4", "x=4, 최솟값 3"], ["꼭짓점 (4,3)을 읽는다.", "아래로 열리므로 그 점에서 최댓값 3이다."], { traps: ["EXTREME_TYPE"] }),
    ],
    A2: [
      short("restricted-shifted-domain", "0≤x≤5에서 y=(x-2)²-1의 최댓값을 구하세요.", "8", ["꼭짓점 x=2가 구간 안에 있음을 확인한다.", "양 끝점 x=0,5의 함수값 3,8을 구한다.", "최댓값 8을 선택한다."], { traps: ["FARTHEST_ENDPOINT"] }),
      expression("parameter-minimum", "y=x²-2kx+k²+3의 최솟값과 그때 x를 k로 나타내세요.", "x=k,최솟값3", ["식을 (x-k)²+3으로 본다.", "제곱항이 0인 x=k를 찾는다.", "최솟값 3을 구한다."], { acceptedAnswers: ["x=k,3", "최솟값3,x=k"], traps: ["PARAMETER_AS_VALUE"] }),
      mc("compare-two-extrema", "f(x)=2(x-1)²-3, g(x)=-(x+2)²+5에 대한 설명으로 옳은 것은?", "f의 최솟값은 -3, g의 최댓값은 5", ["f의 최솟값은 -3, g의 최댓값은 5", "f의 최댓값은 -3, g의 최솟값은 5", "두 함수 모두 최댓값만 있다", "두 극값의 차는 3이다"], ["f의 방향과 꼭짓점을 확인한다.", "g의 방향과 꼭짓점을 확인한다.", "각각 최솟값 -3, 최댓값 5를 결론낸다."], { traps: ["COMPARE_DIFFERENT_EXTREMA"] }),
    ],
    A3: [
      short("interval-with-parameter", "-2≤x≤3에서 y=(x-1)²+2의 최댓값과 최솟값의 차를 구하세요.", "9", ["꼭짓점 x=1에서 최솟값 2를 구한다.", "끝점 x=-2,3에서 11,6을 구한다.", "최댓값 11과 최솟값 2의 차 9를 구한다."], { traps: ["ENDPOINT_DISTANCE"] }),
      expression("projectile-maximum", "높이 h=-t²+6t+1일 때 최고 높이와 그때의 t를 구하세요.", "t=3,h=10", ["h=-(t-3)²+10으로 완전제곱한다.", "아래로 열림을 확인한다.", "t=3에서 최고 높이 10을 얻는다."], { acceptedAnswers: ["h=10,t=3", "3,10"], linked: ["m3_quadratic_max_min", "m3_quadratic_vertex_axis"], traps: ["TIME_HEIGHT_SWAP"] }),
      stepOrder("optimization-process", "합이 12인 두 양수의 곱을 가장 크게 하는 과정을 배열하세요.", ["한수를x,다른수를12-x로둔다", "곱P=x(12-x)를세운다", "P=-(x-6)²+36으로정리한다", "x=6일때최댓값36을얻는다"], ["두 수를 한 변수로 나타낸다.", "곱을 이차함수로 만든다.", "꼭짓점형으로 바꾼다.", "최댓값과 조건을 확인한다."], { linked: ["m3_quadratic_max_min", "algebra_expression"], traps: ["SUM_PRODUCT_CONFUSION"] }),
    ],
    A4: [
      expression("moving-rectangle", "둘레가 20인 직사각형의 한 변을 x라 할 때 넓이의 최댓값과 그때 두 변의 길이를 구하세요.", "최댓값25,5와5", ["다른 변을 10-x로 나타낸다.", "넓이 A=x(10-x)를 세운다.", "A=-(x-5)²+25로 정리한다.", "x=5에서 넓이 25, 두 변 5와 5를 얻는다."], { acceptedAnswers: ["25,5,5", "5와5,25"], linked: ["m3_quadratic_max_min", "polygon_area_perimeter"], traps: ["USE_FULL_PERIMETER"] }),
      mc("parameter-extreme-comparison", "f(x)=a(x-2)²+1의 최솟값이 존재하고 f(0)=9일 때 a와 최솟값은?", "a=2, 최솟값 1", ["a=2, 최솟값 1", "a=-2, 최댓값 1", "a=8, 최솟값 1", "a=2, 최솟값 9"], ["최솟값 존재에서 a>0을 확인한다.", "f(0)=4a+1=9를 세운다.", "a=2를 구한다.", "꼭짓점 y값 1이 최솟값임을 확인한다."], { linked: ["m3_quadratic_max_min", "m3_quadratic_graph_shape"], traps: ["EXTREME_CONDITION_UNUSED"] }),
      written("endpoint-and-vertex-proof", "닫힌 구간에서 이차함수의 최댓값·최솟값을 구할 때 꼭짓점과 양 끝점을 모두 확인해야 하는 이유를 설명하세요.", "구간 안의 꼭짓점은 방향이 바뀌는 극값 후보이고, 구간에서는 양 끝점도 가장 큰 값이나 작은 값을 만들 수 있으므로 세 후보의 함수값을 비교해야 한다.", ["이차함수의 방향 전환점이 꼭짓점임을 설명한다.", "구간이 그래프 일부만 남긴다는 점을 확인한다.", "양 끝점도 극값 후보가 됨을 설명한다.", "꼭짓점과 끝점 함수값을 비교해야 함을 결론낸다."], { requiredConcepts: [["꼭짓점"], ["양끝점", "끝점"], ["구간"]], requiredRelations: [["후보", "비교"], ["최댓값", "최솟값"]], expectedResults: ["모두확인", "비교"], minimumScore: 0.75 }, { linked: ["m3_quadratic_max_min", "m3_quadratic_vertex_axis"], traps: ["VERTEX_ONLY_RULE"] }),
    ],
    A5: [
      short("integer-domain-optimization", "정수 x가 -2≤x≤5를 만족할 때 y=-2(x-1.5)²+20.5의 최댓값을 구하세요.", "20", ["연속 범위의 꼭짓점 x=1.5를 찾는다.", "x가 정수이므로 가까운 x=1,2를 후보로 고른다.", "두 함수값이 모두 20임을 계산한다.", "끝점 함수값과 비교한다.", "정수 조건에서 최댓값 20을 확정한다."], { archetype: "SHORT_ANSWER", linked: ["m3_quadratic_max_min", "integers_rationals"], traps: ["USE_NONINTEGER_VERTEX"] }),
      mc("strategy-choice-optimization", "길이 12m의 울타리로 벽을 한 변으로 하는 직사각형 세 변을 둘러 넓이를 최대로 하려 한다. 가장 적절한 첫 전략은?", "벽에 수직인 변을 x로 두고 넓이 A=x(12-2x)를 세운다", ["벽에 수직인 변을 x로 두고 넓이 A=x(12-2x)를 세운다", "세 변을 모두 x로 둔다", "둘레가 24라고 두고 정사각형을 만든다", "넓이와 둘레를 더한다"], ["울타리가 사용되는 세 변을 구분한다.", "수직인 두 변을 각각 x로 둔다.", "나머지 변을 12-2x로 나타낸다.", "넓이 A=x(12-2x)를 세운다.", "꼭짓점과 정의역으로 최대를 검증한다."], { archetype: "STRATEGY_SELECTION", linked: ["m3_quadratic_max_min", "polygon_area_perimeter"], traps: ["FOUR_SIDE_PERIMETER"] }),
      written("integrated-profit-model", "공연 입장료가 10천 원일 때 100명이 오고, 1천 원 올릴 때마다 5명씩 줄어든다. 입장료 수입을 최대로 하는 가격과 최대 수입을 식, 정의역, 검산을 포함해 설명하세요.", "가격 인상 횟수를 x라 하면 수입은 R=(10+x)(100-5x)=-5(x-5)²+1125이다. 0≤x≤20에서 x=5일 때 최대이므로 가격은 15천 원, 최대 수입은 1125천 원이다.", ["가격 인상 횟수를 x로 정한다.", "가격 10+x와 인원 100-5x를 나타낸다.", "수입 R=(10+x)(100-5x)를 세운다.", "R=-5(x-5)²+1125로 정리해 x=5를 찾는다.", "정의역과 주변 정수값을 확인해 15천 원·1125천 원을 검증한다."], { requiredConcepts: [["10+x"], ["100-5x"], ["수입", "곱"], ["x=5"], ["15", "1125"]], requiredRelations: [["정의역", "0≤x≤20"], ["최대", "꼭짓점"], ["검산", "주변"]], expectedResults: ["15천원", "1125천원"], minimumScore: 0.7 }, { archetype: "INTEGRATED", linked: ["m3_quadratic_max_min", "linear_equation", "data_interpretation"], traps: ["PRICE_ONLY_MAXIMIZATION"] }),
    ],
  };

  // QUALITY_REWRITE_ENTRIES

  BANK.m3_quadratic_function_meaning.A2 = [
    short("parameter-exclusion", "y=(m²-9)x²+mx+1이 이차함수가 되지 않는 m의 값을 모두 쓰세요.", "-3,3", [
      "이차항의 계수 m²-9가 0일 때를 찾는다.",
      "(m-3)(m+3)=0에서 m=-3,3을 구한다.",
      "두 값에서 실제로 최고차항이 x 이하가 되는지 확인한다.",
    ], {
      acceptedAnswers: ["3,-3", "-3,3"],
      ...qualityMeta({
        action: "KEEP", conditions: 2,
        firstEquationFamily: "leading-coefficient-zero",
        coreStrategy: "차수 저하 조건을 인수분해로 역추론",
        conditionTransform: "m²-9=0",
        graphStructure: "degree-classification",
        targetKind: "excluded-parameters",
      }),
    }),
    mc("compare-two-tables", "x가 0,1,2,3일 때 표 A의 y값은 2,5,10,17이고 표 B의 y값은 2,6,10,14이다. 이차함수를 나타내는 표는?", "표 A", ["표 A", "표 B", "둘 다", "둘 다 아니다"], [
      "두 표의 1차 차이를 각각 구한다.",
      "1차 차이의 차이가 일정한 표를 찾는다.",
      "표 A의 2차 차이만 2로 일정함을 확인한다.",
    ], {
      linked: ["m3_quadratic_function_meaning", "statistics_intro"],
      ...qualityMeta({
        action: "KEEP", conditions: 2,
        firstEquationFamily: "finite-difference-table",
        coreStrategy: "두 표의 2차 차이를 비교",
        conditionTransform: "표→1차 차이→2차 차이",
        graphStructure: "discrete-table",
        targetKind: "quadratic-table-selection",
      }),
    }),
    expression("area-model", "한 변의 길이가 x+2인 정사각형의 넓이에서 4를 뺀 값을 y라 한다. y를 x의 식으로 나타내고, 이 관계가 이차함수가 되는 x의 범위를 쓰세요.", "y=x^2+4x, x>-2", [
      "정사각형의 넓이를 (x+2)²으로 나타낸다.",
      "넓이에서 4를 빼 y=(x+2)²-4=x²+4x로 정리한다.",
      "한 변의 길이가 양수이므로 x+2>0, 즉 x>-2를 확인한다.",
    ], {
      acceptedAnswers: ["y=(x+2)^2-4, x>-2", "x^2+4x, x>-2"],
      requiresDomain: true,
      ...qualityMeta({
        action: "MODIFY",
        replaces: "m3-qf-learning-1-a2-3-area-model",
        conditions: 2,
        domain: "x>-2",
        requiresDomain: true,
        firstEquationFamily: "area-minus-constant",
        coreStrategy: "도형 조건을 이차식과 길이 정의역으로 변환",
        conditionTransform: "넓이→전개→양의 길이",
        graphStructure: "geometric-model",
        targetKind: "formula-and-domain",
        linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"],
      }),
    }),
  ];

  BANK.m3_quadratic_graph_shape.A2 = [
    short("coefficient-from-width", "y=ax²의 그래프가 아래쪽으로 열리고 y=-2x²보다 폭이 좁다. a가 정수이고 -5<a<0일 때 가능한 a의 개수를 구하세요.", "2", [
      "아래쪽으로 열리므로 a<0이다.",
      "폭이 더 좁으므로 |a|>2이다.",
      "-5<a<0인 정수 중 a=-4,-3을 센다.",
    ], {
      ...qualityMeta({
        action: "KEEP", conditions: 3,
        firstEquationFamily: "coefficient-inequality",
        coreStrategy: "방향·폭·정수 범위를 동시에 교집합",
        conditionTransform: "방향→부호, 폭→절댓값 부등식",
        graphStructure: "origin-vertex-parabola",
        targetKind: "integer-count",
      }),
    }),
    mc("ordered-values", "x=2에서 다음 세 함수값의 절댓값을 큰 것부터 나열한 것은? (가) y=-3x², (나) y=2x², (다) y=0.5x²", "가,나,다", ["가,나,다", "나,가,다", "다,나,가", "나,다,가"], [
      "x=2를 각 식에 대입해 함수값 -12,8,2를 구한다.",
      "각 함수값의 절댓값 12,8,2를 비교한다.",
      "가, 나, 다 순으로 결론낸다.",
    ], {
      ...qualityMeta({
        action: "MODIFY",
        replaces: "m3-qf-learning-2-a2-2-ordered-values",
        conditions: 2,
        firstEquationFamily: "three-function-values",
        coreStrategy: "함수값 계산 후 절댓값 순서 비교",
        conditionTransform: "함수값→절댓값",
        graphStructure: "three-origin-parabolas",
        targetKind: "magnitude-order",
      }),
    }),
    expression("opposite-direction-width", "y=ax²의 그래프는 점 (2,-12)을 지나고, y=bx²의 그래프는 y=ax²과 폭이 같지만 반대 방향으로 열린다. a,b와 x=3에서 두 함수값의 차를 구하세요.", "a=-3,b=3,차=54", [
      "점 (2,-12)를 대입해 -12=4a에서 a=-3을 구한다.",
      "폭이 같으므로 |b|=|a|이고 반대 방향이므로 b=3이다.",
      "x=3에서 두 함수값은 -27,27이므로 차는 54이다.",
    ], {
      acceptedAnswers: ["a=-3,b=3,54", "-3,3,54"],
      ...qualityMeta({
        action: "REPLACE",
        replaces: "m3-qf-learning-2-a2-3-same-point-parameter",
        conditions: 3,
        firstEquationFamily: "point-coefficient-and-width",
        coreStrategy: "한 그래프의 계수에서 반대 방향·동일 폭 계수 복원",
        conditionTransform: "점→계수→부호 반전",
        graphStructure: "paired-origin-parabolas",
        targetKind: "coefficients-and-value-gap",
      }),
    }),
  ];

  BANK.m3_quadratic_translation.A2 = [
    expression("reverse-shift", "y=(x+1)²-4를 오른쪽으로 3, 위로 2만큼 평행이동한 결과를 쓰세요.", "y=(x-2)^2-2", [
      "기존 꼭짓점 (-1,-4)을 찾는다.",
      "이동 후 꼭짓점 (2,-2)를 구한다.",
      "계수는 유지되므로 y=(x-2)²-2를 쓴다.",
    ], {
      acceptedAnswers: ["(x-2)^2-2"],
      ...qualityMeta({
        action: "KEEP", conditions: 2,
        firstEquationFamily: "vertex-vector-shift",
        coreStrategy: "꼭짓점 좌표에 이동 벡터 적용",
        conditionTransform: "식→꼭짓점→새 식",
        graphStructure: "translated-unit-parabola",
        targetKind: "translated-formula",
      }),
    }),
    stepOrder("two-successive-shifts", "y=-x²을 오른쪽 2, 위 5, 다시 왼쪽 1만큼 옮겼다. 이동을 합성해 최종식을 얻는 풀이 과정을 순서대로 배열하세요.", [
      "각 이동을 벡터 (2,0), (0,5), (-1,0)으로 바꾼다",
      "세 벡터를 더해 전체 이동 벡터 (1,5)를 구한다",
      "원래 꼭짓점 (0,0)을 (1,5)로 옮긴다",
      "계수 -1이 유지됨을 확인한다",
      "최종식 y=-(x-1)²+5를 쓴다",
    ], [
      "각 이동을 좌표 벡터로 바꾼다.",
      "벡터를 합성해 전체 이동을 구한다.",
      "꼭짓점에 전체 이동을 적용한다.",
      "평행이동에서 계수가 보존됨을 확인한다.",
      "최종식을 쓰고 이동 방향을 역검산한다.",
    ], processExtra([
      rubricStep("translate", "각 이동을 벡터로 변환", 2, ["(2,0)", "(0,5)", "(-1,0)"]),
      rubricStep("compose", "이동 벡터 합성", 2, ["전체 이동 벡터 (1,5)", "오른쪽 1, 위 5"]),
      rubricStep("vertex", "꼭짓점 이동", 2, ["꼭짓점 (1,5)"]),
      rubricStep("invariant", "계수 보존 확인", 1, ["계수 -1", "폭과 방향 유지"]),
      rubricStep("conclusion", "최종식과 검산", 3, ["y=-(x-1)²+5", "y=-(x-1)^2+5"]),
    ], {
      ...qualityMeta({
        action: "MODIFY",
        conditions: 3,
        firstEquationFamily: "vector-composition",
        coreStrategy: "연속 평행이동을 벡터 합으로 단순화",
        conditionTransform: "세 이동→합성 벡터→꼭짓점",
        graphStructure: "successive-translations",
        targetKind: "process-and-formula",
      }),
    })),
    mc("inverse-point-map", "어떤 평행이동으로 y=x²의 점 P(-2,4)가 Q(1,1)로 옮겨졌다. 같은 이동에서 새 그래프의 꼭짓점은?", "(3,-3)", ["(3,-3)", "(-3,3)", "(1,1)", "(3,3)"], [
      "P에서 Q로의 이동 벡터를 (3,-3)으로 구한다.",
      "원래 꼭짓점 (0,0)에 같은 벡터를 적용한다.",
      "새 꼭짓점이 (3,-3)임을 확인한다.",
    ], {
      ...qualityMeta({
        action: "REPLACE",
        replaces: "m3-qf-learning-4-a2-3-point-mapping",
        conditions: 2,
        firstEquationFamily: "point-correspondence",
        coreStrategy: "대응점에서 이동 벡터를 역추출해 꼭짓점에 적용",
        conditionTransform: "두 점의 차→꼭짓점 이동",
        graphStructure: "mapped-point-parabola",
        targetKind: "new-vertex",
      }),
    }),
  ];

  BANK.m3_quadratic_find_formula.A2 = [
    expression("axis-two-values", "축이 x=1인 이차함수가 점 (-1,5), (2,-1)을 지난다. 식을 구하세요.", "y=2(x-1)^2-3", [
      "y=a(x-1)²+q로 둔다.",
      "두 점을 대입해 4a+q=5, a+q=-1을 세운다.",
      "a=2,q=-3을 구하고 두 점으로 검산한다.",
    ], {
      acceptedAnswers: ["2(x-1)^2-3"],
      ...qualityMeta({
        action: "KEEP", conditions: 3,
        firstEquationFamily: "vertex-form-two-equations",
        coreStrategy: "축을 꼭짓점형에 반영하고 두 점 연립",
        conditionTransform: "축→꼭짓점형→두 좌표식",
        graphStructure: "axis-known-parabola",
        targetKind: "quadratic-formula",
      }),
    }),
    expression("symmetric-table-formula", "f(-1)=12, f(1)=4, f(3)=4, f(5)=12인 이차함수 f(x)를 구하세요.", "f(x)=(x-2)^2+3", [
      "같은 함수값을 갖는 두 쌍의 중점에서 축 x=2를 찾는다.",
      "f(x)=a(x-2)²+q로 둔다.",
      "a+q=4, 9a+q=12를 풀어 a=1,q=3을 구한다.",
    ], {
      acceptedAnswers: ["y=(x-2)^2+3", "(x-2)^2+3"],
      ...qualityMeta({
        action: "REPLACE",
        replaces: "m3-qf-learning-5-a2-2-three-table-values",
        conditions: 4,
        firstEquationFamily: "paired-equal-values",
        coreStrategy: "두 대칭쌍의 공통 중점으로 축을 찾은 뒤 계수 결정",
        conditionTransform: "표의 같은 값→축→거리별 함수값",
        graphStructure: "symmetric-value-table",
        targetKind: "formula-from-table",
      }),
    }),
    stepOrder("representation-choice-process", "꼭짓점이 (2,-1)이고 점 (0,7), (3,1)을 지나는 이차함수의 식을 구한다. 불필요한 연립을 피하는 풀이 과정을 순서대로 배열하세요.", [
      "꼭짓점 조건으로 y=a(x-2)²-1을 선택한다",
      "점 (3,1)을 대입해 1=a-1을 세운다",
      "a=2를 구해 y=2(x-2)²-1을 완성한다",
      "점 (0,7)을 대입해 7=8-1인지 확인한다",
      "세 조건을 모두 만족하므로 식을 확정한다",
    ], [
      "주어진 조건에 가장 효율적인 식의 꼴을 선택한다.",
      "꼭짓점과 가까운 점을 이용해 계수를 구한다.",
      "식을 완성한다.",
      "사용하지 않은 점으로 독립 검산한다.",
      "모든 조건 충족을 확인해 결론낸다.",
    ], processExtra([
      rubricStep("representation", "꼭짓점형 선택", 2, ["y=a(x-2)²-1", "y=a(x-2)^2-1"]),
      rubricStep("equation", "가까운 점으로 계수식 설정", 2, ["1=a-1"]),
      rubricStep("solve", "계수와 식 계산", 2, ["a=2", "y=2(x-2)²-1"]),
      rubricStep("verify", "남은 점 독립 검산", 2, ["(0,7)", "7=8-1"]),
      rubricStep("conclusion", "모든 조건 충족 결론", 2, ["세 조건", "식을 확정"]),
    ], {
      ...qualityMeta({
        action: "REPLACE",
        replaces: "m3-qf-learning-5-a2-3-formula-selection-order",
        conditions: 3,
        firstEquationFamily: "representation-selection",
        coreStrategy: "가장 가까운 점을 먼저 써 계산을 줄이고 남은 점으로 검산",
        conditionTransform: "꼭짓점→꼭짓점형→근거리 점→독립 검산",
        graphStructure: "vertex-plus-two-points",
        targetKind: "scored-process",
      }),
    })),
  ];

  BANK.m3_quadratic_max_min.A2 = [
    short("restricted-shifted-domain", "0≤x≤5에서 y=(x-2)²-1의 최댓값을 구하세요.", "8", [
      "꼭짓점 x=2가 구간 안에 있음을 확인한다.",
      "양 끝점 x=0,5의 함수값 3,8을 구한다.",
      "세 후보 중 최댓값 8을 선택한다.",
    ], {
      requiresDomain: true,
      ...qualityMeta({
        action: "KEEP", conditions: 2, domain: "0≤x≤5", requiresDomain: true,
        firstEquationFamily: "closed-interval-extrema",
        coreStrategy: "꼭짓점과 양 끝점 비교",
        conditionTransform: "구간→후보점 세 개",
        graphStructure: "upward-shifted-parabola",
        targetKind: "maximum-value",
      }),
    }),
    expression("parameter-minimum", "y=x²-2kx+k²+3의 최솟값과 그때의 x를 k로 나타내세요.", "x=k,최솟값3", [
      "식을 (x-k)²+3으로 묶는다.",
      "제곱항이 0이 되는 x=k를 찾는다.",
      "그때 최솟값이 3임을 확인한다.",
    ], {
      acceptedAnswers: ["x=k,3", "최솟값3,x=k"],
      ...qualityMeta({
        action: "KEEP", conditions: 2,
        firstEquationFamily: "parameter-perfect-square",
        coreStrategy: "매개변수 완전제곱 구조에서 극값 위치 분리",
        conditionTransform: "일반식→완전제곱",
        graphStructure: "moving-vertex-family",
        targetKind: "parameterized-minimum",
      }),
    }),
    mc("endpoint-switch", "구간 -1≤x≤3에서 f(x)=(x-k)²의 최댓값을 만드는 끝점이 x=-1 하나뿐이 되도록 하는 k의 조건은?", "k>1", ["k>1", "k=1", "k<1", "모든 실수"], [
      "위로 열린 그래프이므로 최댓값은 두 끝점 중 하나에서 생긴다.",
      "f(-1)>f(3), 즉 (-1-k)²>(3-k)²을 세운다.",
      "두 제곱의 차를 정리해 8(k-1)>0에서 k>1을 얻는다.",
    ], {
      requiresDomain: true,
      ...qualityMeta({
        action: "REPLACE",
        replaces: "m3-qf-learning-6-a2-3-compare-two-extrema",
        conditions: 3, domain: "-1≤x≤3", requiresDomain: true,
        firstEquationFamily: "endpoint-distance-comparison",
        coreStrategy: "두 끝점과 축의 거리 비교를 매개변수 부등식으로 변환",
        conditionTransform: "최댓값 끝점→제곱값 부등식",
        graphStructure: "parameter-axis-on-interval",
        targetKind: "parameter-condition",
      }),
    }),
  ];

  BANK.m3_quadratic_function_meaning.A3 = [
    expression("table-reconstruction", "x=-1,0,1,2일 때 이차함수 y=ax²+bx+c의 함수값이 차례로 6,1,0,k이다. k와 함수의 식을 구하세요.", "k=3,y=2x^2-3x+1", [
      "x=0에서 c=1을 얻는다.",
      "x=-1,1 조건으로 a-b=5, a+b=-1을 세운다.",
      "두 식을 풀어 a=2,b=-3을 구한다.",
      "x=2를 대입해 k=3을 구하고 네 값을 검산한다.",
    ], {
      acceptedAnswers: ["y=2x^2-3x+1,k=3", "k=3,2x^2-3x+1"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a3-1-sequence-formula",
        conditions: 4,
        firstEquationFamily: "quadratic-table-coefficients",
        coreStrategy: "가장 단순한 x=0을 먼저 사용하고 대칭 위치 두 식을 연립",
        conditionTransform: "표→세 계수식→미지 함수값",
        graphStructure: "four-value-table",
        targetKind: "formula-and-missing-value",
        linked: ["m3_quadratic_function_meaning", "system_equation"],
      }),
    }),
    expression("geometric-domain-model", "가로가 x+2, 세로가 9-x인 직사각형에서 가로 길이 1만큼을 세로 전체에 걸쳐 잘라 냈다. 남은 넓이를 y라 할 때 y를 x의 식으로 나타내고 실제 직사각형이 되는 x의 범위를 쓰세요.", "y=-x^2+8x+9, -1<x<9", [
      "잘라 낸 뒤 남은 가로 길이가 x+1임을 찾는다.",
      "남은 넓이를 y=(x+1)(9-x)로 세운다.",
      "전개해 y=-x²+8x+9를 얻는다.",
      "원래 두 변과 남은 가로가 양수여야 하므로 -1<x<9를 확인한다.",
    ], {
      acceptedAnswers: ["y=(x+1)(9-x), -1<x<9", "y=-x^2+8x+9,-1<x<9"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a3-2-geometric-model",
        conditions: 3,
        domain: "-1<x<9",
        requiresDomain: true,
        firstEquationFamily: "remaining-rectangle-area",
        coreStrategy: "절단 후 실제 길이를 다시 정의해 넓이와 정의역을 함께 모델링",
        conditionTransform: "도형 설명→남은 변→곱→양의 길이",
        graphStructure: "cut-rectangle-model",
        targetKind: "quadratic-model-and-domain",
        linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"],
      }),
    }),
    short("parameter-equal-values", "f(x)=(k-1)x²+(2k+1)x+3이 이차함수이고 f(-1)=f(2)일 때 k와 f(0)+f(1)의 값을 차례로 구하세요.", "k=0,합=6", [
      "f(-1)=1-k, f(2)=8k+1로 나타낸다.",
      "1-k=8k+1을 풀어 k=0을 구한다.",
      "k=0에서 이차항 계수 -1이 0이 아님을 확인한다.",
      "f(0)=3, f(1)=3을 계산해 합 6을 얻는다.",
    ], {
      acceptedAnswers: ["0,6", "k=0,6", "k=0,합=6"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a3-3-parameter-and-point",
        conditions: 3,
        firstEquationFamily: "parameterized-equal-values",
        coreStrategy: "두 함수값을 매개변수 식으로 바꾸고 차수 조건을 후검증",
        conditionTransform: "같은 함수값→k 방정식→이차항 확인",
        graphStructure: "parameter-family",
        targetKind: "parameter-and-value-sum",
        linked: ["m3_quadratic_function_meaning", "algebra_expression"],
      }),
    }),
  ];

  BANK.m3_quadratic_function_meaning.A4 = [
    short("single-error-table", "x=-2,-1,0,1,2에서 어떤 이차함수의 값을 측정했더니 11,6,3,2,4였다. 정확한 자료는 2차 차이가 일정하고 측정값 하나만 1만큼 크게 기록되었다. 잘못 기록된 x와 올바른 값을 구하세요.", "x=2,3", [
      "다섯 값의 1차 차이와 2차 차이를 계산해 불일치 위치를 좁힌다.",
      "마지막 값 4를 1 줄인 3으로 두고 1차 차이 -5,-3,-1,1을 다시 계산한다.",
      "2차 차이가 모두 2가 됨을 확인한다.",
      "다른 한 값을 1 줄이는 경우에는 세 2차 차이가 일치하지 않으므로 x=2만 가능함을 검증한다.",
    ], {
      acceptedAnswers: ["x=2의 값을 3", "2,3"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a4-1-finite-difference-reconstruction",
        conditions: 5,
        firstEquationFamily: "one-error-finite-difference",
        coreStrategy: "오류 위치를 가정별로 바꾸어 2차 차이 일관성을 역검증",
        conditionTransform: "자료→차분→오류 후보별 재계산",
        graphStructure: "corrupted-data-table",
        targetKind: "impossibility-diagnosis",
        linked: ["m3_quadratic_function_meaning", "statistics_intro"],
      }),
    }),
    stepOrder("model-selection-process", "한 변이 x+3인 정사각형에서 가로 x, 세로 x+1인 직사각형을 잘라 냈다. 남은 넓이 y가 이차함수인지 판정하는 풀이 과정을 배열하세요.", [
      "전체 넓이 (x+3)²과 잘라 낸 넓이 x(x+1)을 세운다",
      "남은 넓이 y=(x+3)²-x(x+1)을 세운다",
      "두 식을 전개해 y=5x+9로 정리한다",
      "x²항이 소거되어 최고차항이 일차임을 확인한다",
      "길이 조건 x>0에서 y는 이차함수가 아니라 일차함수라고 결론낸다",
    ], [
      "두 도형의 넓이를 각각 식으로 변환한다.",
      "남은 넓이를 차로 나타낸다.",
      "전개 과정에서 이차항이 소거되는지 계산한다.",
      "최고차항으로 함수의 차수를 판정한다.",
      "길이 정의역과 최종 결론을 함께 확인한다.",
    ], processExtra([
      rubricStep("models", "두 넓이 모델 설정", 2, ["(x+3)²", "x(x+1)"]),
      rubricStep("difference", "남은 넓이 관계식", 2, ["y=(x+3)²-x(x+1)", "y=(x+3)^2-x(x+1)"]),
      rubricStep("expand", "전개와 소거 계산", 2, ["y=5x+9", "x²항이 소거"]),
      rubricStep("classify", "최고차항으로 차수 판정", 2, ["일차함수", "이차함수가 아니다"]),
      rubricStep("domain", "길이 조건과 결론 검증", 2, ["x>0"]),
    ], {
      forbiddenLogicalErrors: ["각 넓이가 이차식이므로 차도 항상 이차함수이다"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a4-2-model-selection-process",
        conditions: 4,
        domain: "x>0",
        requiresDomain: true,
        firstEquationFamily: "difference-of-areas",
        coreStrategy: "두 이차식의 차에서 최고차항 소거 여부를 직접 확인",
        conditionTransform: "도형 두 개→넓이 차→차수 판정",
        graphStructure: "composite-area-model",
        targetKind: "scored-classification-process",
        linked: ["m3_quadratic_function_meaning", "polygon_area_perimeter"],
      }),
    })),
    written("second-difference-proof", "차수가 2 이하인 다항식 f가 모든 실수 x에 대하여 f(x+1)-2f(x)+f(x-1)=6을 만족한다. f가 반드시 이차함수인 이유와 x²의 계수를 설명하세요.", "f(x)=ax²+bx+c로 두고 전개하면 두 번째 차 f(x+1)-2f(x)+f(x-1)=2a이다. 따라서 2a=6에서 a=3이고 a가 0이 아니므로 f는 반드시 이차함수이며 x²의 계수는 3이다.", [
      "차수 2 이하이므로 f(x)=ax²+bx+c로 놓는다.",
      "f(x+1)-2f(x)+f(x-1)을 전개한다.",
      "일차항과 상수항이 소거되어 2a만 남음을 보인다.",
      "2a=6에서 a=3을 구한다.",
      "a가 0이 아니므로 이차함수라는 결론을 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "form", alternatives: ["f(x)=ax²+bx+c", "f(x)=ax^2+bx+c"], points: 2 },
        { id: "nonzero", alternatives: ["a=3", "이차항의 계수는 3"], points: 2 },
      ],
      requiredRelations: [
        { id: "difference", left: ["두 번째 차", "주어진 차"], right: ["2a"], connectors: ["같", "된다", "="], points: 2 },
        { id: "degree", left: ["a=3", "a가 0이 아님"], right: ["이차함수"], connectors: ["따라서", "이므로"], points: 2 },
      ],
      requiredCalculations: [
        { id: "expand", alternatives: ["f(x+1)-2f(x)+f(x-1)=2a", "2a=6"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["반드시 이차함수", "이차함수이고 x²의 계수는 3"], points: 2 },
      forbiddenLogicalErrors: ["2차 차이가 6이므로 계수는 6", "일차함수도 가능하다"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a4-3-quadratic-justification",
        conditions: 3,
        firstEquationFamily: "symbolic-second-difference",
        coreStrategy: "일반 이차식의 대칭 차분을 전개해 최고차항 계수 복원",
        conditionTransform: "함수 조건→일반식→소거 구조",
        graphStructure: "algebraic-function-criterion",
        targetKind: "proof-and-leading-coefficient",
        linked: ["m3_quadratic_function_meaning", "algebra_expression"],
      }),
    }),
  ];

  BANK.m3_quadratic_function_meaning.A5 = [
    short("parameter-cancellation-symmetry", "F_t(x)=(t+1)(x-2)²-t(x+1)²+x²이다. F_t(0)=F_t(4)를 만족하도록 하는 t와 그때 F_t(x)를 구하세요.", "t=2/3,F_t(x)=2x^2-8x+6", [
      "세 항의 x²계수를 합해 t와 관계없이 2임을 확인한다.",
      "식을 2x²+(-6t-4)x+(3t+4)로 정리한다.",
      "F_t(0)=F_t(4)를 함수값 식으로 바꾸거나 축이 x=2임을 이용한다.",
      "t=2/3을 구해 식 2x²-8x+6을 완성한다.",
      "x=0,4에서 함수값이 모두 6인지 검산한다.",
    ], {
      acceptedAnswers: ["2/3,2x^2-8x+6", "t=2/3,y=2x^2-8x+6"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a5-1-noisy-data-strategy",
        conditions: 4,
        firstEquationFamily: "parameterized-composite-quadratic",
        coreStrategy: "계수 소거 구조를 먼저 분석하고 같은 함수값을 축 조건으로 역변환",
        conditionTransform: "복합식→계수 정리→대칭 조건→매개변수",
        graphStructure: "parameter-family-with-fixed-leading-term",
        targetKind: "parameter-and-expanded-form",
        linked: ["m3_quadratic_function_meaning", "m3_quadratic_vertex_axis"],
        archetype: "SHORT_ANSWER",
      }),
    }),
    expression("corrupted-symmetric-data", "축이 x=0인 이차함수의 측정표가 x=-2,-1,0,1,2에서 11,5,3,5,12로 기록되었다. 정확히 한 값만 잘못되었다. 잘못된 항목을 고치고 함수식을 구하세요.", "x=2의 12를 11로 고치고 y=2x^2+3", [
      "축이 x=0이므로 f(-x)=f(x)여야 함을 사용한다.",
      "f(-1)=f(1)=5와 f(0)=3에서 y=ax²+3으로 놓고 a=2를 구한다.",
      "후보식 y=2x²+3에서 f(-2)=f(2)=11을 계산한다.",
      "따라서 x=2의 12만 11로 고쳐야 함을 찾는다.",
      "다섯 점과 '오류 한 개' 조건을 모두 다시 검증한다.",
    ], {
      acceptedAnswers: ["y=2x^2+3,x=2:11", "x=2의 값을 11, y=2x^2+3"],
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a5-2-parameter-family-count",
        conditions: 6,
        firstEquationFamily: "one-error-symmetric-table",
        coreStrategy: "정상 대칭쌍으로 식을 먼저 복원한 뒤 남은 쌍의 오류를 판별",
        conditionTransform: "축→대칭쌍→계수→오류 위치",
        graphStructure: "corrupted-symmetric-table",
        targetKind: "repair-and-formula",
        linked: ["m3_quadratic_function_meaning", "m3_quadratic_vertex_axis"],
        archetype: "STRATEGY_SELECTION",
      }),
    }),
    written("difference-of-squares-family", "m은 2보다 큰 자연수이다. 한 변의 길이가 각각 x+m, x-m인 두 정사각형의 넓이 차에 (m-2)x²을 더해 G_m(x)=(x+m)²-(x-m)²+(m-2)x²을 만들었다. 두 정사각형의 변은 모두 양수이다. G_m의 축이 x=-6일 때 m, 함수식, 가능한 x의 범위를 구하고 G_m이 이차함수인 이유를 설명하세요.", "전개하면 G_m(x)=(m-2)x²+4mx이다. m>2이므로 이차항의 계수가 0이 아니다. 따라서 G_m은 이차함수이다. 축이 -2m/(m-2)=-6이므로 m=3이다. 길이 x-m이 양수여야 하므로 x>3이다. 결론은 m=3, G_3(x)=x²+12x, x>3이다.", [
      "넓이 차를 전개해 G_m(x)=(m-2)x²+4mx로 정리한다.",
      "m>2이므로 이차항 계수가 0이 아니어서 이차함수임을 확인한다.",
      "축의 식 -2m/(m-2)=-6을 세운다.",
      "m=3을 구하고 G_3(x)=x²+12x를 얻는다.",
      "x-m>0에서 x>3을 찾고 축·식·정의역을 각각 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "expanded", alternatives: ["(m-2)x²+4mx", "(m-2)x^2+4mx"], points: 2 },
        { id: "quadratic", alternatives: ["m>2이므로 m-2는 0이 아니다", "이차항의 계수가 0이 아니다"], points: 2 },
      ],
      requiredRelations: [
        { id: "axis", left: ["축", "-2m/(m-2)"], right: ["-6"], connectors: ["=", "같"], points: 2 },
        { id: "domain", left: ["x-m", "x-3"], right: ["양수", "x>3"], connectors: ["따라서", "이므로", ">"], points: 2 },
      ],
      requiredCalculations: [
        { id: "parameter", alternatives: ["m=3"], points: 2 },
        { id: "formula", alternatives: ["G_3(x)=x²+12x", "G3(x)=x^2+12x"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["m=3, G_3(x)=x²+12x, x>3", "m=3이고 함수식은 x²+12x이며 x>3"], points: 2 },
      forbiddenLogicalErrors: ["두 제곱의 차이므로 이차항은 항상 남는다", "x>-3", "m=2"],
    }), {
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-1-a5-3-transfer-proof",
        conditions: 5,
        domain: "x>3",
        requiresDomain: true,
        firstEquationFamily: "parameterized-area-difference",
        coreStrategy: "도형식의 최고차항을 분석한 뒤 축 조건을 매개변수 방정식으로 역추론",
        conditionTransform: "넓이 차→계수→축→자연수→정의역",
        graphStructure: "geometric-parameter-family",
        targetKind: "proof-parameter-formula-domain",
        linked: ["m3_quadratic_function_meaning", "m3_quadratic_vertex_axis", "polygon_area_perimeter"],
        archetype: "WRITTEN",
      }),
    }),
  ];

  BANK.m3_quadratic_graph_shape.A3 = [
    expression("difference-determines-shape", "f(x)=ax²에서 f(3)-f(1)=16이다. a, f(2)를 구하고 그래프의 폭을 y=3x²과 비교하세요.", "a=2,f(2)=8,y=3x^2보다 넓다", [
      "f(3)-f(1)=9a-a=8a로 바꾼다.",
      "8a=16에서 a=2를 구하고 f(2)=8을 계산한다.",
      "두 계수가 모두 양수이고 |2|<|3|이므로 f의 그래프가 더 넓다고 판단한다.",
    ], {
      acceptedAnswers: ["2,8,더 넓다", "a=2,f(2)=8,넓다"],
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a3-1-two-points-coefficient",
        conditions: 3,
        firstEquationFamily: "function-value-difference",
        coreStrategy: "두 함수값의 차에서 계수를 분리한 뒤 폭으로 해석",
        conditionTransform: "함수값 차→계수→그래프 폭",
        graphStructure: "origin-parabola-comparison",
        targetKind: "coefficient-value-width",
        linked: ["m3_quadratic_graph_shape", "algebra_expression"],
      }),
    }),
    mc("integer-coefficient-window", "y=ax²의 그래프는 아래쪽으로 열리고 y=-x²보다 폭이 좁다. 점 (2,k)가 그래프 위에 있고 -20<k<-8이며 a는 정수이다. 가능한 a의 개수는?", "2", ["1", "2", "3", "4"], [
      "점 조건에서 k=4a로 바꾼다.",
      "-20<4a<-8을 풀어 -5<a<-2를 얻는다.",
      "아래 방향과 좁은 폭 조건을 함께 확인해 a=-4,-3 두 개를 남긴다.",
    ], {
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a3-2-intersection-count",
        conditions: 4,
        firstEquationFamily: "lattice-point-coefficient-window",
        coreStrategy: "좌표 범위를 계수 부등식으로 바꾸고 그래프 조건과 교집합",
        conditionTransform: "점의 y범위→a범위→정수 필터",
        graphStructure: "downward-origin-parabola",
        targetKind: "number-of-coefficients",
        linked: ["m3_quadratic_graph_shape", "integer_inequality"],
      }),
    }),
    stepOrder("paired-graph-inference", "G:y=ax²은 점 (2,-8)을 지난다. H는 G와 폭이 같고 반대 방향으로 열리며 꼭짓점이 (1,3)이다. H의 식과 x=3에서 두 함수값의 대소를 판단하는 과정을 배열하세요.", [
      "G의 점을 대입해 -8=4a에서 a=-2를 구한다",
      "같은 폭과 반대 방향에서 H의 이차항 계수가 2임을 찾는다",
      "꼭짓점 (1,3)을 사용해 H:y=2(x-1)²+3을 세운다",
      "x=3에서 G(3)=-18, H(3)=11을 계산한다",
      "H(3)>G(3)이고 두 그래프 조건이 모두 맞는지 검증한다",
    ], [
      "G의 좌표 조건으로 계수를 구한다.",
      "폭과 방향 조건을 H의 계수로 변환한다.",
      "꼭짓점과 계수를 결합해 H의 식을 세운다.",
      "같은 x에서 두 함수값을 계산한다.",
      "대소와 모든 그래프 조건을 검증한다.",
    ], processExtra([
      rubricStep("g-coefficient", "G의 계수 계산", 2, ["-8=4a", "a=-2"]),
      rubricStep("h-coefficient", "폭·방향으로 H 계수 결정", 2, ["계수 2", "반대 방향"]),
      rubricStep("h-formula", "H의 꼭짓점형", 2, ["H:y=2(x-1)²+3", "H=2(x-1)^2+3"]),
      rubricStep("values", "x=3 함수값 계산", 2, ["G(3)=-18", "H(3)=11"]),
      rubricStep("verify", "대소와 조건 검증", 2, ["H(3)>G(3)", "폭이 같다"]),
    ], {
      forbiddenLogicalErrors: ["폭이 같으므로 계수도 -2이다"],
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a3-3-shape-inference-order",
        conditions: 4,
        firstEquationFamily: "paired-parabola-transfer",
        coreStrategy: "한 그래프의 좌표에서 계수를 구해 폭·방향 조건으로 다른 그래프 구성",
        conditionTransform: "점→계수→절댓값·부호→꼭짓점형",
        graphStructure: "opposite-direction-pair",
        targetKind: "scored-comparison-process",
        linked: ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis"],
      }),
    })),
  ];

  BANK.m3_quadratic_graph_shape.A4 = [
    expression("symmetric-chord-area", "y=ax²의 그래프 위 점 P(-2,4a), Q(2,4a)와 원점 O가 만드는 삼각형 OPQ의 넓이가 16이다. 그래프가 아래쪽으로 열릴 때 a를 구하고 y=-3x²과 폭을 비교하세요.", "a=-2,y=-3x^2보다 넓다", [
      "PQ가 수평이고 길이가 4임을 확인한다.",
      "원점에서 PQ까지의 높이가 |4a|이므로 넓이가 8|a|임을 세운다.",
      "8|a|=16에서 |a|=2를 구하고 아래 방향에서 a=-2를 고른다.",
      "|-2|<|-3|이므로 주어진 그래프가 y=-3x²보다 넓다고 결론낸다.",
      "P,Q의 위치가 아래쪽 그래프와 일치하는지 검증한다.",
    ], {
      acceptedAnswers: ["-2,더 넓다", "a=-2,넓다"],
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a4-1-three-graph-order",
        conditions: 4,
        firstEquationFamily: "symmetric-chord-triangle-area",
        coreStrategy: "그래프 위 대칭점의 현을 삼각형 밑변으로 해석해 |a| 복원",
        conditionTransform: "좌표→길이·높이→넓이→부호",
        graphStructure: "origin-parabola-with-chord",
        targetKind: "coefficient-and-width",
        linked: ["m3_quadratic_graph_shape", "triangle_area", "coordinate_plane"],
      }),
    }),
    short("integer-height-cases", "y=a(x-1)²-3에서 a는 양의 정수이고 그래프는 y=2x²보다 폭이 좁다. y=5인 그래프 위 점의 x좌표가 정수일 때 a와 가능한 x를 모두 구하세요.", "a=8,x=0,2", [
      "y=5를 대입해 a(x-1)²=8을 세운다.",
      "폭 조건에서 a>2이고 a가 8의 양의 약수임을 찾는다.",
      "(x-1)²이 정수의 제곱이어야 하므로 a=8 또는 2를 경우 나눈다.",
      "a=2는 폭 조건을 만족하지 않아 제외하고 a=8을 남긴다.",
      "(x-1)²=1에서 x=0,2를 구하고 두 점을 검산한다.",
    ], {
      acceptedAnswers: ["8,0,2", "a=8,x=0 또는 2"],
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a4-2-moving-line-intersections",
        conditions: 4,
        firstEquationFamily: "integer-horizontal-section",
        coreStrategy: "정수 계수와 정수 좌표를 약수·제곱수 경우로 분류",
        conditionTransform: "높이 조건→곱 8→약수 경우→폭 필터",
        graphStructure: "shifted-parabola-horizontal-level",
        targetKind: "integer-coefficient-and-points",
        linked: ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis", "integer_factor"],
      }),
    }),
    written("coefficient-geometry-proof", "a>b>0일 때 두 그래프 G:y=ax², H:y=bx²을 생각하자. 같은 양의 높이 y=r에서 각 그래프 위 두 점 사이의 거리를 비교하여 G의 폭이 H보다 좁은 이유를 설명하세요.", "G에서는 |x|=√(r/a), H에서는 |x|=√(r/b)이다. a>b>0이므로 r/a<r/b이다. 따라서 G의 현의 길이 2√(r/a)는 H의 현의 길이 2√(r/b)보다 짧고, G의 폭이 더 좁다. 즉 G의 폭이 H보다 좁다.", [
      "같은 높이 r>0을 고정한다.",
      "G와 H에서 x²=r/a, x²=r/b를 각각 얻는다.",
      "a>b>0에서 r/a<r/b임을 비교한다.",
      "각 수평 현의 길이가 2√(r/a), 2√(r/b)임을 나타낸다.",
      "G의 현이 더 짧으므로 폭이 더 좁다고 결론낸다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "coordinates", alternatives: ["|x|=√(r/a)", "x²=r/a", "x^2=r/a"], points: 2 },
        { id: "other-coordinates", alternatives: ["|x|=√(r/b)", "x²=r/b", "x^2=r/b"], points: 2 },
      ],
      requiredRelations: [
        { id: "fraction-order", left: ["a>b"], right: ["r/a<r/b"], connectors: ["따라서", "이므로"], points: 2 },
        { id: "width-relation", left: ["현의 길이", "두 점 사이 거리"], right: ["G가 더 짧", "G의 폭이 더 좁"], connectors: ["따라서", "이므로"], points: 2 },
      ],
      requiredCalculations: [
        { id: "chord-lengths", alternatives: ["2√(r/a)", "2sqrt(r/a)"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["G의 폭이 H보다 좁다", "y=ax²이 더 좁다"], points: 2 },
      forbiddenLogicalErrors: ["a가 크면 x좌표도 커진다", "부호가 다르기 때문에 좁다"],
    }), {
      revisionAction: "MODIFY",
      ...qualityMeta({
        action: "MODIFY",
        replaces: "m3-qf-learning-2-a4-3-coefficient-geometry-proof",
        conditions: 3,
        firstEquationFamily: "fixed-height-chord-comparison",
        coreStrategy: "같은 높이의 수평 현 길이를 계수 부등식으로 비교",
        conditionTransform: "함수식→x좌표 거리→폭",
        graphStructure: "two-origin-parabolas-at-fixed-height",
        targetKind: "geometric-proof",
        linked: ["m3_quadratic_graph_shape", "m3_sqrt_meaning"],
      }),
    }),
  ];

  BANK.m3_quadratic_graph_shape.A5 = [
    mc("integrated-two-parabolas", "G:y=ax²는 아래쪽으로 열리고, 그래프 위 P(-2,4a), Q(2,4a)와 원점이 만드는 삼각형의 넓이가 16이다. H는 G와 폭이 같고 반대 방향으로 열리며 H(1)=H(5)=5이다. H의 식은?", "y=2(x-3)²-3", ["y=2(x-3)²-3", "y=-2(x-3)²+13", "y=2(x+3)²-3", "y=(x-3)²+1"], [
      "삼각형 넓이 8|a|=16에서 |a|=2를 얻고 G의 방향으로 a=-2를 정한다.",
      "H는 같은 폭·반대 방향이므로 이차항 계수가 2임을 찾는다.",
      "H(1)=H(5)에서 축이 두 x좌표의 중점 x=3임을 찾는다.",
      "H:y=2(x-3)²+q에 (1,5)를 대입해 q=-3을 구한다.",
      "두 점, 방향, 폭을 모두 재검증해 첫 번째 식을 고른다.",
    ], {
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a5-1-strategy-from-partial-data",
        conditions: 6,
        firstEquationFamily: "area-to-width-to-symmetry",
        coreStrategy: "첫 그래프의 기하 정보로 폭을 복원해 대칭 자료가 있는 둘째 그래프로 전달",
        conditionTransform: "삼각형 넓이→|a|·부호→H 계수→축→q",
        graphStructure: "coupled-parabolas",
        targetKind: "formula-selection",
        linked: ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis", "triangle_area"],
        archetype: "HIGH_DIFFICULTY_MULTIPLE_CHOICE",
      }),
    }),
    stepOrder("cross-section-reconstruction", "위로 열린 포물선의 최솟값은 -4이다. 높이 y=5인 두 점의 x좌표가 -1,7이고, 그래프는 y=x²보다 폭이 넓다. 함수식을 복원하고 모든 조건을 검증하는 과정을 배열하세요.", [
      "같은 높이의 두 x좌표 중점에서 축 x=3을 찾는다",
      "최솟값 -4를 이용해 꼭짓점 (3,-4)를 정한다",
      "y=a(x-3)²-4에 점 (-1,5)를 대입한다",
      "9=16a에서 a=9/16을 구한다",
      "|a|<1과 점 (7,5)를 확인해 폭과 대칭 조건을 검증한다",
    ], [
      "수평 단면의 중점으로 축을 구한다.",
      "축과 최솟값으로 꼭짓점을 정한다.",
      "한 점을 식에 대입해 계수 방정식을 세운다.",
      "계수를 계산해 식을 완성한다.",
      "다른 점과 폭 조건으로 독립 검산한다.",
    ], processExtra([
      rubricStep("axis", "두 x좌표의 중점으로 축 계산", 2, ["축 x=3", "(-1+7)/2=3"]),
      rubricStep("vertex", "최솟값으로 꼭짓점 결정", 2, ["꼭짓점 (3,-4)"]),
      rubricStep("equation", "점 대입 계수식", 2, ["9=16a"]),
      rubricStep("solve", "계수와 함수식 계산", 2, ["a=9/16", "y=9/16(x-3)²-4"]),
      rubricStep("verify", "폭·대칭점 검산", 2, ["9/16<1", "(7,5)"]),
    ], {
      forbiddenLogicalErrors: ["두 점의 차 8이 축이다", "a=16/9"],
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a5-2-intersection-error-analysis",
        conditions: 5,
        firstEquationFamily: "horizontal-cross-section-reconstruction",
        coreStrategy: "수평 단면 중점과 최솟값을 결합하고 남은 단면점으로 검산",
        conditionTransform: "같은 높이→축→꼭짓점→계수→폭",
        graphStructure: "horizontal-section-parabola",
        targetKind: "scored-reconstruction-process",
        linked: ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis"],
        archetype: "PROCESS",
      }),
    })),
    written("paired-values-uniqueness", "위로 열린 이차함수 f가 f(-2)=f(4)=15, f(-1)=5를 만족하고 최솟값을 갖는다. f의 식이 하나로 정해지는 과정을 설명하고 그래프의 방향과 폭을 y=x²과 비교하세요.", "f(-2)=f(4)인 같은 함수값의 두 x좌표 중점이 1이므로 축 x=1이다. f=a(x-1)²+q로 두면 9a+q=15, 4a+q=5이고 a=2,q=-3이다. 따라서 f(x)=2(x-1)²-3이며 a=2이므로 위로 열리고 y=x²보다 좁다.", [
      "같은 함수값 쌍에서 축 x=1을 찾는다.",
      "f=a(x-1)²+q로 표현한다.",
      "두 거리 조건으로 9a+q=15, 4a+q=5를 세운다.",
      "a=2,q=-3을 구한다.",
      "세 점, 최솟값, 방향과 폭을 모두 검증하고 유일성을 설명한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "axis", alternatives: ["축은 x=1", "중점이 1"], points: 2 },
        { id: "form", alternatives: ["f=a(x-1)²+q", "f=a(x-1)^2+q"], points: 2 },
      ],
      requiredRelations: [
        { id: "symmetry", left: ["f(-2)=f(4)", "같은 함수값"], right: ["축 x=1", "중점 1"], connectors: ["따라서", "이므로"], points: 2 },
        { id: "shape", left: ["a=2"], right: ["위로", "y=x²보다 좁"], connectors: ["따라서", "이므로"], points: 2 },
      ],
      requiredCalculations: [
        { id: "equations", alternatives: ["9a+q=15", "4a+q=5"], points: 2 },
        { id: "parameters", alternatives: ["a=2", "q=-3"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["f(x)=2(x-1)²-3", "y=2(x-1)^2-3"], points: 2 },
      forbiddenLogicalErrors: ["축은 x=-1", "폭이 y=x²보다 넓다", "최댓값"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-2-a5-3-integrated-shape-argument",
        conditions: 5,
        firstEquationFamily: "paired-values-vertex-form",
        coreStrategy: "대칭쌍으로 축을 먼저 고정하고 서로 다른 거리의 값으로 모양을 유일화",
        conditionTransform: "같은 값→축→두 거리식→계수·폭",
        graphStructure: "paired-levels-shifted-parabola",
        targetKind: "uniqueness-and-shape-proof",
        linked: ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis"],
        archetype: "WRITTEN",
      }),
    }),
  ];

  BANK.m3_quadratic_vertex_axis.A3 = [
    expression("equal-values-and-sum", "f(x)=x²+bx+c에서 f(-1)=f(5)이고 f(0)+f(4)=10이다. f의 식과 꼭짓점을 구하세요.", "f(x)=x^2-4x+5,꼭짓점(2,1)", [
      "f(-1)=f(5)에서 -1과 5의 중점 2가 축임을 찾는다.",
      "계수가 1인 일반식의 축 -b/2=2에서 b=-4를 구한다.",
      "축 대칭으로 f(0)=f(4)이므로 각 값이 5이고 c=5이다.",
      "f(x)=(x-2)²+1로 바꾸어 꼭짓점 (2,1)을 검산한다.",
    ], {
      acceptedAnswers: ["y=x^2-4x+5,(2,1)", "f=(x-2)^2+1,꼭짓점(2,1)"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a3-1-equal-values-axis",
        conditions: 3,
        firstEquationFamily: "equal-values-plus-sum",
        coreStrategy: "같은 함수값으로 축을 찾고 대칭쌍의 합을 개별 값으로 환원",
        conditionTransform: "같은 값→축→b, 대칭합→c",
        graphStructure: "monic-general-parabola",
        targetKind: "formula-and-vertex",
        linked: ["m3_quadratic_vertex_axis", "algebra_expression"],
      }),
    }),
    expression("two-level-symmetry", "위로 열린 이차함수 f가 f(1)=f(7)=14, f(3)=2를 만족한다. 꼭짓점과 f(5)를 구하세요.", "꼭짓점(4,1/2),f(5)=2", [
      "같은 함수값을 갖는 1과 7의 중점에서 축 x=4를 찾는다.",
      "f(x)=a(x-4)²+q로 둔다.",
      "9a+q=14, a+q=2를 풀어 a=3/2,q=1/2를 구한다.",
      "꼭짓점 (4,1/2)을 쓰고 대칭으로 f(5)=f(3)=2를 확인한다.",
    ], {
      acceptedAnswers: ["(4,1/2),2", "vertex(4,0.5),f(5)=2"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a3-2-vertex-and-point-parameter",
        conditions: 4,
        firstEquationFamily: "two-height-symmetric-data",
        coreStrategy: "한 대칭쌍으로 축을 고정하고 서로 다른 거리의 높이로 꼭짓점 결정",
        conditionTransform: "대칭쌍→축→거리별 연립→반대편 값",
        graphStructure: "two-horizontal-levels",
        targetKind: "vertex-and-symmetric-value",
        linked: ["m3_quadratic_vertex_axis", "system_equation"],
      }),
    }),
    stepOrder("general-form-vertex-process", "f(x)=2x²+bx+c가 f(0)=f(6), f(2)=-1을 만족한다. 꼭짓점과 함수식을 구하는 과정을 배열하세요.", [
      "f(0)=f(6)에서 축이 x=3임을 찾는다",
      "축 -b/4=3에서 b=-12를 구한다",
      "f(2)=-1을 대입해 8-24+c=-1을 세운다",
      "c=15를 구하고 f(x)=2x²-12x+15로 완성한다",
      "f(x)=2(x-3)²-3으로 바꾸어 꼭짓점 (3,-3)과 두 조건을 검증한다",
    ], [
      "같은 함수값에서 축을 찾는다.",
      "일반식의 계수와 축을 연결한다.",
      "추가 함수값으로 상수항 방정식을 세운다.",
      "함수식을 완성한다.",
      "꼭짓점형 변환과 원조건 검산을 한다.",
    ], processExtra([
      rubricStep("axis", "같은 값의 중점으로 축 계산", 2, ["축 x=3"]),
      rubricStep("b", "축과 b의 관계", 2, ["-b/4=3", "b=-12"]),
      rubricStep("c-equation", "함수값으로 c 방정식", 2, ["8-24+c=-1"]),
      rubricStep("formula", "c와 일반식 계산", 2, ["c=15", "2x²-12x+15"]),
      rubricStep("verify", "꼭짓점형과 조건 검증", 2, ["2(x-3)²-3", "꼭짓점 (3,-3)"]),
    ], {
      forbiddenLogicalErrors: ["f(0)=f(6)이므로 꼭짓점은 (3,0)"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a3-3-complete-square-process",
        conditions: 3,
        firstEquationFamily: "general-form-from-axis-and-value",
        coreStrategy: "대칭으로 축을 먼저 복원해 일반식의 두 계수를 순차 결정",
        conditionTransform: "같은 값→축→b→c→꼭짓점형",
        graphStructure: "general-form-parabola",
        targetKind: "scored-formula-vertex-process",
        linked: ["m3_quadratic_vertex_axis", "algebra_expression"],
      }),
    })),
  ];

  BANK.m3_quadratic_vertex_axis.A4 = [
    expression("two-paired-levels", "이차함수 f가 f(-1)=f(5)=11, f(0)=f(4)=3을 만족한다. f의 꼭짓점과 f(3)을 구하세요.", "꼭짓점(2,-17/5),f(3)=-9/5", [
      "두 대칭쌍의 공통 중점에서 축 x=2를 찾는다.",
      "f(x)=a(x-2)²+q로 둔다.",
      "거리 3과 2인 값에서 9a+q=11, 4a+q=3을 세운다.",
      "a=8/5,q=-17/5를 구해 꼭짓점을 정한다.",
      "f(3)=a+q=-9/5를 계산하고 네 자료로 검산한다.",
    ], {
      acceptedAnswers: ["(2,-17/5),-9/5", "vertex(2,-3.4),f(3)=-1.8"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a4-1-symmetric-points-and-vertex",
        conditions: 5,
        firstEquationFamily: "two-paired-heights",
        coreStrategy: "서로 다른 두 대칭쌍의 거리 차로 a와 꼭짓점 높이를 분리",
        conditionTransform: "두 쌍→공통 축→거리 제곱 연립",
        graphStructure: "four-point-symmetric-table",
        targetKind: "vertex-and-new-value",
        linked: ["m3_quadratic_vertex_axis", "system_equation"],
      }),
    }),
    short("vertex-on-relation", "이차함수 y=a(x-p)²+q의 꼭짓점 (p,q)는 q=2p-3을 만족한다. 그래프가 점 (-1,12), (5,12)를 지날 때 p,q,a를 구하세요.", "p=2,q=1,a=11/9", [
      "같은 높이의 두 점에서 축의 x좌표 p=2를 찾는다.",
      "꼭짓점 관계 q=2p-3에 대입해 q=1을 구한다.",
      "점 (-1,12)를 대입해 12=9a+1을 세운다.",
      "a=11/9를 구해 식을 완성한다.",
      "점 (5,12), 꼭짓점 관계, 열린 방향을 모두 검증한다.",
    ], {
      acceptedAnswers: ["2,1,11/9", "p=2,q=1,a=11/9"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a4-2-vertex-from-root-symmetry",
        conditions: 4,
        firstEquationFamily: "vertex-coordinate-relation",
        coreStrategy: "대칭점으로 p를 고정한 뒤 꼭짓점 좌표 관계와 한 점을 연쇄 사용",
        conditionTransform: "같은 높이→p→q 관계→a",
        graphStructure: "vertex-constrained-parabola",
        targetKind: "three-parameters",
        linked: ["m3_quadratic_vertex_axis", "coordinate_relation"],
      }),
    }),
    written("axis-midpoint-proof", "이차함수 f(x)=ax²+bx+c에서 r≠s이고 f(r)=f(s)라고 하자. 축이 x=(r+s)/2임을 식으로 증명하고, f(-3)=f(7)일 때 축을 구하세요.", "f(r)=f(s)이므로 f(r)-f(s)=(r-s)(a(r+s)+b)=0이다. r≠s이므로 a(r+s)+b=0, 따라서 -b/(2a)=(r+s)/2이다. 즉 축은 x=(r+s)/2이다. r=-3,s=7이면 (-3+7)/2=2이므로 축은 x=2이다.", [
      "f(r)=f(s)를 두 식의 차가 0인 식으로 바꾼다.",
      "a(r²-s²)+b(r-s)=(r-s)(a(r+s)+b)=0으로 인수분해한다.",
      "r≠s를 사용해 a(r+s)+b=0을 얻는다.",
      "축 -b/(2a)가 (r+s)/2와 같음을 보인다.",
      "r=-3,s=7에 적용해 축 x=2를 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "difference", alternatives: ["f(r)-f(s)=0", "f(r)=f(s)"], points: 1 },
        { id: "factor", alternatives: ["(r-s)(a(r+s)+b)=0"], points: 3 },
      ],
      requiredRelations: [
        { id: "distinct", left: ["r≠s", "r과 s가 다르"], right: ["a(r+s)+b=0"], connectors: ["따라서", "이므로"], points: 2 },
        { id: "axis", left: ["-b/(2a)"], right: ["(r+s)/2"], connectors: ["=", "같"], points: 2 },
      ],
      requiredCalculations: [
        { id: "application", alternatives: ["(-3+7)/2=2", "축 x=2"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["축은 x=(r+s)/2", "축 x=2"], points: 2 },
      forbiddenLogicalErrors: ["r=s여도 나눌 수 있다", "축은 r+s", "축은 x=4"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a4-3-axis-symmetry-explanation",
        conditions: 3,
        firstEquationFamily: "general-axis-proof",
        coreStrategy: "같은 함수값 식의 차를 인수분해해 축 공식을 유도",
        conditionTransform: "함수값 등식→차→인수분해→축",
        graphStructure: "general-quadratic-symmetry",
        targetKind: "algebraic-proof-and-application",
        linked: ["m3_quadratic_vertex_axis", "m3_factor_sum_product"],
      }),
    }),
  ];

  BANK.m3_quadratic_vertex_axis.A5 = [
    mc("sum-of-symmetric-values", "위로 열린 이차함수 f는 f(-1)=f(5)=10이고 f(0)+f(4)=8이다. f의 꼭짓점은?", "(2,-4/5)", ["(2,-4/5)", "(2,4/5)", "(-2,-4/5)", "(3,-4/5)"], [
      "첫 같은 함수값 쌍에서 축 x=2를 찾는다.",
      "축 대칭으로 f(0)=f(4)이므로 두 값이 각각 4임을 찾는다.",
      "f(x)=a(x-2)²+q로 두고 9a+q=10, 4a+q=4를 세운다.",
      "a=6/5,q=-4/5를 구한다.",
      "위로 열린 조건과 세 함수값 조건을 검증해 꼭짓점 (2,-4/5)를 고른다.",
    ], {
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a5-1-vertex-from-three-values",
        conditions: 5,
        firstEquationFamily: "symmetric-pair-plus-sum",
        coreStrategy: "대칭을 이용해 합 조건을 개별 높이로 바꾼 뒤 거리별 연립",
        conditionTransform: "같은 값→축→합의 반분→a,q",
        graphStructure: "mixed-symmetric-data",
        targetKind: "vertex-choice",
        linked: ["m3_quadratic_vertex_axis", "system_equation"],
        archetype: "HIGH_DIFFICULTY_MULTIPLE_CHOICE",
      }),
    }),
    stepOrder("vertex-error-correction", "표에 f(-2)=14, f(0)=2, f(2)=-2, f(4)=2, f(6)=14가 주어졌다. 학생이 f(0)=f(4)이므로 꼭짓점이 (2,2)라고 했다. 오류를 고치고 함수식을 구하는 과정을 배열하세요.", [
      "f(0)=f(4)와 f(-2)=f(6)의 공통 중점에서 축 x=2를 확인한다",
      "같은 함수값은 축만 정할 뿐 꼭짓점의 y좌표를 바로 주지 않음을 지적한다",
      "표에 x=2의 값 -2가 있으므로 꼭짓점 후보 (2,-2)를 세운다",
      "f(x)=a(x-2)²-2에 (0,2)를 대입해 a=1을 구한다",
      "f(x)=(x-2)²-2가 다섯 값을 모두 만족하는지 검증한다",
    ], [
      "두 대칭쌍으로 축을 확정한다.",
      "학생의 논리 오류를 정확히 분리한다.",
      "축 위 실제 함수값으로 꼭짓점을 정한다.",
      "한 점으로 계수를 계산한다.",
      "전체 표로 식과 결론을 검증한다.",
    ], processExtra([
      rubricStep("axis", "두 대칭쌍의 공통 중점", 2, ["축 x=2", "공통 중점 2"]),
      rubricStep("error", "같은 값은 축만 결정함을 설명", 2, ["꼭짓점 y좌표는 정해지지 않는다", "축만 정한다"]),
      rubricStep("vertex", "축 위 값으로 꼭짓점 결정", 2, ["꼭짓점 (2,-2)"]),
      rubricStep("coefficient", "계수 계산", 2, ["2=4a-2", "a=1"]),
      rubricStep("verify", "다섯 점 전체 검증", 2, ["f(x)=(x-2)²-2", "다섯 값을 만족"]),
    ], {
      forbiddenLogicalErrors: ["꼭짓점은 (2,2)", "같은 함수값이 꼭짓점이다"],
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a5-2-error-correction-process",
        conditions: 6,
        firstEquationFamily: "multi-pair-error-correction",
        coreStrategy: "대칭이 주는 정보와 주지 않는 정보를 분리한 뒤 축 위 자료로 꼭짓점 복원",
        conditionTransform: "두 대칭쌍→축→오류 분석→꼭짓점→계수",
        graphStructure: "five-value-symmetric-table",
        targetKind: "scored-error-analysis",
        linked: ["m3_quadratic_vertex_axis", "m3_quadratic_find_formula"],
        archetype: "PROCESS",
      }),
    })),
    written("parameterized-vertex-family", "이차함수 f(x)=a(x-p)²+q가 (p-2,9), (p+2,9), (p,1)을 지난다. 먼저 p가 이 세 조건만으로 정해지지 않는 이유를 설명하라. 추가로 f(0)=3이고 꼭짓점이 y축 오른쪽에 있을 때 p,a,q를 구하세요.", "점 (p,1)이 꼭짓점이므로 q=1이고 9=4a+1에서 a=2이다. 세 점이 p를 기준으로 함께 평행이동할 수 있기 때문에 p는 처음 세 조건만으로 정해지지 않는다. f(0)=2p²+1=3에서 p=±1이고, 꼭짓점이 y축 오른쪽이므로 p>0인 p=1을 택한다. 따라서 p=1, a=2, q=1이다.", [
      "점 (p,1)에서 q=1을 찾는다.",
      "거리 2인 점에서 9=4a+1로 a=2를 구한다.",
      "세 점이 p와 함께 평행이동하므로 처음 조건만으로 p가 자유임을 설명한다.",
      "f(0)=3을 2p²+1=3으로 바꾸어 p=±1을 구한다.",
      "꼭짓점이 y축 오른쪽이라는 조건으로 p=1을 선택하고 모든 점을 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "parameters", alternatives: ["q=1", "a=2"], points: 2 },
        { id: "underdetermined", alternatives: ["p는 처음 세 조건만으로 정해지지 않는다", "p는 자유"], points: 2 },
      ],
      requiredRelations: [
        { id: "translation", left: ["세 점", "그래프"], right: ["함께 평행이동", "절대 위치가 없다"], connectors: ["때문", "이므로"], points: 2 },
        { id: "side-condition", left: ["p=±1", "p=1 또는 -1"], right: ["y축 오른쪽", "p>0"], connectors: ["따라서", "이므로"], points: 2 },
      ],
      requiredCalculations: [
        { id: "a", alternatives: ["9=4a+1", "a=2"], points: 2 },
        { id: "p", alternatives: ["2p²+1=3", "p=±1"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["p=1,a=2,q=1", "p=1, a=2, q=1"], points: 2 },
      forbiddenLogicalErrors: ["대칭이므로 p=0", "f(0)=3에서 p=1만 나온다", "a=4"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-3-a5-3-integrated-vertex-proof",
        conditions: 6,
        firstEquationFamily: "translated-parameter-family-with-side-condition",
        coreStrategy: "자유 매개변수를 먼저 식별하고 추가 함수값에서 나온 두 경우를 위치 조건으로 걸러냄",
        conditionTransform: "상대좌표→a,q→자유도→p² 방정식→부호 선택",
        graphStructure: "movable-vertex-family",
        targetKind: "underdetermination-and-case-proof",
        linked: ["m3_quadratic_vertex_axis", "m3_quadratic_translation"],
        archetype: "WRITTEN",
      }),
    }),
  ];

  BANK.m3_quadratic_translation.A3 = [
    expression("mapped-point-and-extra-point", "G:y=ax²의 점 P(-1,a)를 평행이동한 점이 H 위의 Q(2,4)이다. 같은 평행이동으로 얻은 H가 점 R(5,13)을 지날 때 a와 H의 식을 구하세요.", "a=3,H:y=3(x-3)^2+1", [
      "P에서 Q로의 이동 벡터를 (3,4-a)로 나타낸다.",
      "G의 꼭짓점 (0,0)이 H의 꼭짓점 (3,4-a)로 이동하므로 H:y=a(x-3)²+4-a로 둔다.",
      "R(5,13)을 대입해 13=4a+4-a를 세운다.",
      "a=3을 구해 H:y=3(x-3)²+1을 완성하고 P→Q를 검산한다.",
    ], {
      acceptedAnswers: ["a=3,y=3(x-3)^2+1", "3,3(x-3)^2+1"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a3-1-derive-from-mapped-points",
        conditions: 4,
        firstEquationFamily: "mapped-point-with-unknown-height-shift",
        coreStrategy: "대응점의 이동 벡터를 a로 표현해 꼭짓점형에 넣고 추가 점으로 a 결정",
        conditionTransform: "대응점→매개 이동 벡터→H 식→추가 점",
        graphStructure: "translated-origin-parabola",
        targetKind: "coefficient-and-translated-formula",
        linked: ["m3_quadratic_translation", "m3_quadratic_find_formula"],
      }),
    }),
    expression("recover-original-function", "이차함수 G를 오른쪽으로 3, 아래로 4만큼 평행이동했더니 H:y=-2(x+1)²+5가 되었다. G의 식과 G 위 점 중 H의 꼭짓점으로 이동한 점을 구하세요.", "G:y=-2(x+4)^2+9,점(-4,9)", [
      "H의 꼭짓점 (-1,5)을 읽는다.",
      "이동의 반대 벡터 (-3,4)를 적용해 G의 꼭짓점 (-4,9)를 구한다.",
      "평행이동에서 계수 -2가 유지되므로 G:y=-2(x+4)²+9를 쓴다.",
      "G의 꼭짓점이 이동 후 H의 꼭짓점이 되는지 좌표로 검증한다.",
    ], {
      acceptedAnswers: ["y=-2(x+4)^2+9,(-4,9)", "-2(x+4)^2+9"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a3-2-recover-original-vertex",
        conditions: 3,
        firstEquationFamily: "inverse-function-translation",
        coreStrategy: "결과 함수의 꼭짓점에 역벡터를 적용해 원함수 전체 복원",
        conditionTransform: "결과식→꼭짓점→역이동→원식",
        graphStructure: "inverse-translated-parabola",
        targetKind: "original-formula-and-point",
        linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis"],
      }),
    }),
    stepOrder("general-form-shift-process", "H:y=2x²-8x+1을 G:y=2x²의 평행이동으로 해석하고, G의 점 (-1,2)가 H에서 어느 점으로 옮겨지는지 구하는 과정을 배열하세요.", [
      "H를 y=2(x-2)²-7로 완전제곱한다",
      "G와 H의 꼭짓점을 비교해 이동 벡터 (2,-7)을 구한다",
      "계수 2가 같아 실제 평행이동 관계임을 확인한다",
      "점 (-1,2)에 벡터 (2,-7)을 더해 (1,-5)를 구한다",
      "점 (1,-5)가 H의 식을 만족하는지 검증한다",
    ], [
      "일반형을 꼭짓점형으로 바꾼다.",
      "두 꼭짓점으로 이동 벡터를 구한다.",
      "계수 보존을 확인한다.",
      "같은 벡터를 그래프 위 점에 적용한다.",
      "새 점을 식에 대입해 검증한다.",
    ], processExtra([
      rubricStep("complete-square", "H의 꼭짓점형 변환", 2, ["2(x-2)²-7", "2(x-2)^2-7"]),
      rubricStep("vector", "이동 벡터 계산", 2, ["(2,-7)", "오른쪽 2, 아래 7"]),
      rubricStep("coefficient", "계수 보존 확인", 1, ["계수 2가 같다"]),
      rubricStep("point-map", "점 좌표 이동", 2, ["(1,-5)"]),
      rubricStep("verify", "새 점의 식 검산", 3, ["H(1)=-5", "2-8+1=-5"]),
    ], {
      forbiddenLogicalErrors: ["이동 벡터 (-2,-7)", "점 (1,9)"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a3-3-standard-to-shift",
        conditions: 4,
        firstEquationFamily: "general-form-to-vector-and-point",
        coreStrategy: "완전제곱으로 이동 벡터를 찾고 그래프의 한 점에 동일 벡터 적용",
        conditionTransform: "일반식→꼭짓점형→벡터→점",
        graphStructure: "formula-and-point-translation",
        targetKind: "scored-vector-process",
        linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis"],
      }),
    })),
  ];

  BANK.m3_quadratic_translation.A4 = [
    expression("unlabeled-corresponding-points", "G:y=2x²의 두 점 P(1,2), Q(2,8)가 평행이동 후 H의 두 점 A(4,-1), B(5,5)가 되었다. P,Q와 A,B의 대응을 결정하고 이동 벡터와 H의 식을 구하세요.", "P→A,Q→B,벡터(3,-3),H:y=2(x-3)^2-3", [
      "평행이동은 두 점 사이의 벡터를 보존하므로 Q-P=(1,6)을 계산한다.",
      "B-A=(1,6)이 같고 A-B는 다르므로 P→A, Q→B임을 정한다.",
      "A-P=(3,-3)에서 이동 벡터를 구한다.",
      "원래 꼭짓점에 벡터를 적용해 H:y=2(x-3)²-3을 세운다.",
      "A와 B를 모두 H에 대입해 대응과 식을 검증한다.",
    ], {
      acceptedAnswers: ["P-A,Q-B,(3,-3),y=2(x-3)^2-3", "(3,-3),2(x-3)^2-3"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a4-1-translate-through-fixed-point",
        conditions: 5,
        firstEquationFamily: "unlabeled-point-correspondence",
        coreStrategy: "점 사이 상대 벡터 보존으로 대응을 먼저 판별한 뒤 이동 벡터 계산",
        conditionTransform: "두 점쌍→상대벡터 비교→대응→이동",
        graphStructure: "translated-point-pairs",
        targetKind: "correspondence-vector-formula",
        linked: ["m3_quadratic_translation", "coordinate_plane"],
      }),
    }),
    short("parameter-vector-recovery", "G:y=ax²을 (u,v)만큼 평행이동해 H를 만들었다. G의 점 (1,a)는 H의 점 (4,5)로 옮겨졌고 H의 꼭짓점 (u,v)는 u+v=1을 만족한다. H가 점 (5,26)을 지날 때 a,u,v를 구하세요.", "a=7,u=3,v=-2", [
      "대응점의 x좌표에서 u=4-1=3을 구한다.",
      "u+v=1에서 v=-2를 구한다.",
      "대응점의 y이동 5-a=v에 대입해 a=7을 구한다.",
      "H:y=7(x-3)²-2를 세운다.",
      "H(5)=26과 대응점 조건을 모두 검증한다.",
    ], {
      acceptedAnswers: ["7,3,-2", "a=7,u=3,v=-2"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a4-2-two-graphs-translation",
        conditions: 5,
        firstEquationFamily: "parameterized-translation-vector",
        coreStrategy: "대응점의 두 좌표와 꼭짓점 좌표 관계를 연쇄해 a,u,v 복원",
        conditionTransform: "x이동→u→꼭짓점 관계→v→y이동→a",
        graphStructure: "unknown-vector-family",
        targetKind: "three-parameter-recovery",
        linked: ["m3_quadratic_translation", "m3_quadratic_find_formula"],
      }),
    }),
    written("translation-invariant", "두 포물선 G:y=a(x-p)²+q와 H:y=b(x-r)²+s가 서로 평행이동 관계일 필요충분조건이 a=b임을 설명하세요. a=b일 때 이동 벡터도 구하세요.", "평행이동은 그래프의 모양, 즉 열린 방향과 폭을 보존하므로 계수 a와 b가 같아야 한다. 따라서 a=b가 필요하다. 반대로 a=b이면 꼭짓점 (p,q)를 (r,s)로 보내는 벡터 (r-p,s-q)만큼 G를 이동한다. 식에서 x를 x-(r-p)로 바꾸고 s-q만큼 올리면 H가 되므로 충분하다. 결론적으로 필요충분조건은 a=b이다.", [
      "평행이동이 꼭짓점 위치만 바꾸고 모양은 보존함을 설명한다.",
      "방향과 폭을 정하는 계수가 보존되어 a=b가 필요함을 보인다.",
      "a=b라고 가정하고 G의 꼭짓점 (p,q)와 H의 꼭짓점 (r,s)을 비교한다.",
      "이동 벡터 (r-p,s-q)를 G의 식에 적용한다.",
      "결과가 H와 일치하므로 충분성까지 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "necessary", alternatives: ["평행이동이면 a=b", "계수 a와 b가 같아야"], points: 2 },
        { id: "sufficient", alternatives: ["a=b이면 평행이동할 수 있다", "충분"], points: 2 },
      ],
      requiredRelations: [
        { id: "shape", left: ["평행이동"], right: ["방향과 폭", "모양"], connectors: ["보존", "변하지"], points: 2 },
        { id: "vertex-vector", left: ["(p,q)", "(r,s)"], right: ["(r-p,s-q)"], connectors: ["벡터", "차"], points: 2 },
      ],
      requiredCalculations: [
        { id: "substitution", alternatives: ["x를 x-(r-p)로", "G를 (r-p,s-q)만큼 이동"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["필요충분조건은 a=b", "a=b가 필요충분"], points: 2 },
      forbiddenLogicalErrors: ["꼭짓점이 같아야만 평행이동", "|a|=|b|이면 항상 평행이동", "a=-b도 가능"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a4-3-translation-invariant",
        conditions: 4,
        firstEquationFamily: "translation-equivalence-proof",
        coreStrategy: "계수 보존의 필요성과 꼭짓점 벡터 구성의 충분성을 분리해 증명",
        conditionTransform: "평행이동→계수 보존, 같은 계수→벡터 구성",
        graphStructure: "two-vertex-form-parabolas",
        targetKind: "iff-proof-and-vector",
        linked: ["m3_quadratic_translation", "m3_quadratic_graph_shape"],
      }),
    }),
  ];

  BANK.m3_quadratic_translation.A5 = [
    expression("unknown-correspondence-vector", "G:y=ax²(a>0)의 점 P(-1,a), Q(2,4a)가 평행이동되어 H 위의 두 점 A(2,1), B(5,13)가 되었다. 어느 점끼리 대응하는지 밝히고 a, 이동 벡터, H의 식을 구하세요.", "P→A,Q→B,a=4,벡터(3,-3),H:y=4(x-3)^2-3", [
      "Q-P=(3,3a)이고 B-A=(3,12)임을 비교해 P→A, Q→B만 가능함을 찾는다.",
      "3a=12에서 a=4를 구한다.",
      "A-P=(3,1-a)=(3,-3)으로 이동 벡터를 구한다.",
      "꼭짓점 이동과 계수 보존으로 H:y=4(x-3)²-3을 세운다.",
      "A,B 두 점과 a>0 조건을 모두 검증한다.",
    ], {
      acceptedAnswers: ["P-A,Q-B,4,(3,-3),4(x-3)^2-3", "a=4,벡터(3,-3),y=4(x-3)^2-3"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a5-1-unknown-vector-from-two-conditions",
        conditions: 6,
        firstEquationFamily: "parameterized-unlabeled-correspondence",
        coreStrategy: "상대 벡터의 두 성분을 비교해 대응과 계수를 동시에 결정",
        conditionTransform: "점쌍 상대벡터→대응→a→이동벡터→식",
        graphStructure: "unknown-correspondence-translation",
        targetKind: "full-translation-reconstruction",
        linked: ["m3_quadratic_translation", "coordinate_plane", "m3_quadratic_find_formula"],
        archetype: "EXPRESSION",
      }),
    }),
    stepOrder("two-route-consistency", "H:y=x²-4x+1을 y=x²의 평행이동으로 해석한다. 완전제곱 경로와 대칭 자료 경로를 각각 사용해 같은 이동 벡터를 얻고, 학생의 주장 '왼쪽 2, 아래 3'을 반박하는 과정을 배열하세요.", [
      "완전제곱해 H:y=(x-2)²-3에서 벡터 (2,-3)을 얻는다",
      "H(0)=H(4)=1에서 축 x=2를 찾는다",
      "H(2)=-3을 계산해 대칭 자료 경로에서도 꼭짓점 (2,-3)을 얻는다",
      "원점이 (2,-3)으로 이동하므로 오른쪽 2, 아래 3임을 확인한다",
      "원래 점 (1,1)의 이동점 (3,-2)가 H 위에 있음을 검산해 학생 주장을 반박한다",
    ], [
      "대수 경로로 이동 벡터를 구한다.",
      "함수값 대칭 경로로 축을 구한다.",
      "축 위 함수값으로 같은 꼭짓점을 복원한다.",
      "두 경로의 결론을 비교한다.",
      "대응점 검산으로 잘못된 방향을 반박한다.",
    ], processExtra([
      rubricStep("algebra-route", "완전제곱 경로", 2, ["(x-2)²-3", "벡터 (2,-3)"]),
      rubricStep("symmetry-route", "같은 함수값으로 축 계산", 2, ["H(0)=H(4)", "축 x=2"]),
      rubricStep("vertex", "축 위 값으로 꼭짓점 계산", 2, ["H(2)=-3", "꼭짓점 (2,-3)"]),
      rubricStep("compare", "두 경로 일치와 방향 판정", 2, ["오른쪽 2, 아래 3"]),
      rubricStep("refute", "대응점으로 학생 주장 반박", 2, ["(3,-2)", "H(3)=-2"]),
    ], {
      forbiddenLogicalErrors: ["왼쪽 2, 아래 3", "벡터 (-2,-3)"],
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a5-2-route-comparison-process",
        conditions: 6,
        firstEquationFamily: "dual-route-translation-proof",
        coreStrategy: "완전제곱과 대칭 함수값이라는 독립 경로를 교차 검증",
        conditionTransform: "일반식→꼭짓점형 / 함수값쌍→축→꼭짓점",
        graphStructure: "two-proof-paths-one-translation",
        targetKind: "scored-route-comparison",
        linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis"],
        archetype: "PROCESS",
      }),
    })),
    written("uniqueness-and-consistency", "G:y=2x²을 평행이동한 H가 A(1,3), B(3,3)을 지나고 H(0)=9를 만족한다고 한다. A,B만으로 H가 유일하게 정해지는 이유를 설명하고 H의 식을 구한 뒤 H(0)=9 조건의 일관성을 검증하세요.", "A와 B는 같은 높이이므로 두 x좌표의 중점이 2이다. 따라서 축은 x=2, 즉 축 x=2이다. 평행이동에서는 계수 2가 유지되어 H=2(x-2)²+q이고, 3=2(1-2)²+q에서 q=1이다. 축, 계수, q가 모두 정해져 H:y=2(x-2)²+1로 유일하다. H(0)=2(0-2)²+1=9이므로 추가 조건도 일치한다.", [
      "같은 높이 A,B의 중점에서 축 x=2를 찾는다.",
      "평행이동으로 계수 2가 유지됨을 사용한다.",
      "H=2(x-2)²+q에 A를 대입해 q=1을 구한다.",
      "축과 계수가 고정된 뒤 q도 하나여서 유일함을 설명한다.",
      "B와 H(0)=9를 각각 대입해 모든 조건의 일관성을 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "axis", alternatives: ["축은 x=2", "A와 B의 중점은 2"], points: 2 },
        { id: "invariant", alternatives: ["계수 2가 유지", "평행이동이므로 a=2"], points: 2 },
      ],
      requiredRelations: [
        { id: "symmetry", left: ["같은 높이", "y좌표가 같다"], right: ["축 x=2"], connectors: ["따라서", "이므로"], points: 2 },
        { id: "uniqueness", left: ["축", "계수", "q"], right: ["하나", "유일"], connectors: ["모두 정해", "이므로"], points: 2 },
      ],
      requiredCalculations: [
        { id: "q", alternatives: ["3=2(1-2)²+q", "q=1"], points: 2 },
        { id: "consistency", alternatives: ["H(0)=9", "2(0-2)²+1=9"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["H:y=2(x-2)²+1", "H=2(x-2)^2+1"], points: 2 },
      forbiddenLogicalErrors: ["점 두 개만으로 모든 이차함수는 유일하다", "계수는 점에서 새로 정한다", "H(0)=8"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-4-a5-3-integrated-translation-proof",
        conditions: 5,
        firstEquationFamily: "translation-uniqueness-consistency",
        coreStrategy: "평행이동 불변량과 대칭점을 결합해 자유도를 하나씩 제거하고 추가 조건 검증",
        conditionTransform: "같은 높이→축, 불변 계수→q→독립 조건",
        graphStructure: "translated-parabola-with-redundant-check",
        targetKind: "uniqueness-and-consistency-proof",
        linked: ["m3_quadratic_translation", "m3_quadratic_vertex_axis"],
        archetype: "WRITTEN",
      }),
    }),
  ];

  BANK.m3_quadratic_find_formula.A3 = [
    expression("axis-and-two-values", "축이 x=-1이고 f(0)=2, f(2)=18인 이차함수의 식을 구하고 꼭짓점의 y좌표를 쓰세요.", "f(x)=2(x+1)^2,꼭짓점y=0", [
      "축 조건으로 f(x)=a(x+1)²+q로 둔다.",
      "f(0)=2, f(2)=18에서 a+q=2, 9a+q=18을 세운다.",
      "두 식을 풀어 a=2,q=0을 구한다.",
      "두 함수값을 다시 대입해 식과 꼭짓점 높이를 검증한다.",
    ], {
      acceptedAnswers: ["y=2(x+1)^2,q=0", "2(x+1)^2,0"],
      revisionAction: "KEEP",
      ...qualityMeta({
        action: "KEEP",
        conditions: 3,
        firstEquationFamily: "axis-plus-two-values",
        coreStrategy: "축을 꼭짓점형에 고정하고 거리 다른 두 함수값을 연립",
        conditionTransform: "축→꼭짓점형→두 값 연립",
        graphStructure: "axis-known-two-point-parabola",
        targetKind: "formula-and-vertex-height",
        linked: ["m3_quadratic_find_formula", "system_equation"],
      }),
    }),
    short("unknown-vertex-height", "f(x)=a(x-2)²+q가 점 (1,5), (4,14)를 지나고 위로 열린다. q와 f(0)을 구하세요.", "q=2,f(0)=14", [
      "두 점에서 a+q=5, 4a+q=14를 세운다.",
      "두 식의 차로 3a=9, a=3을 구한다.",
      "q=2를 구하고 a>0이 방향 조건과 맞는지 확인한다.",
      "f(0)=3·4+2=14를 계산한다.",
    ], {
      acceptedAnswers: ["2,14", "q=2,f(0)=14"],
      revisionAction: "KEEP",
      ...qualityMeta({
        action: "KEEP",
        conditions: 3,
        firstEquationFamily: "known-axis-two-points",
        coreStrategy: "거리 제곱이 다른 두 점의 식을 빼 계수와 높이를 순차 결정",
        conditionTransform: "두 좌표→두 식의 차→q→새 함수값",
        graphStructure: "known-axis-point-pair",
        targetKind: "vertex-height-and-new-value",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_vertex_axis"],
      }),
    }),
    mc("minimum-symmetric-sum", "최솟값이 -4이고 축이 x=1인 이차함수 f에서 f(0)+f(2)=4이다. f(x)는?", "f(x)=6(x-1)²-4", ["f(x)=4(x-1)²-4", "f(x)=2(x-1)²-4", "f(x)=6(x-1)²-4", "f(x)=4(x+1)²-4"], [
      "최솟값과 축으로 f(x)=a(x-1)²-4, a>0으로 둔다.",
      "축 대칭으로 f(0)=f(2)임을 이용해 각 함수값이 2임을 찾는다.",
      "2=a-4에서 a=6을 계산한다.",
      "따라서 f(x)=6(x-1)²-4를 고르고 두 함수값을 검산한다.",
    ], {
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a3-3-minimum-and-intercept",
        conditions: 4,
        firstEquationFamily: "extreme-plus-symmetric-sum",
        coreStrategy: "대칭합을 같은 두 값으로 나눈 뒤 꼭짓점형 계수 결정",
        conditionTransform: "극값·축→꼭짓점형, 대칭합→개별 값→a",
        graphStructure: "minimum-with-symmetric-pair",
        targetKind: "formula-selection",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_max_min"],
      }),
    }),
  ];

  BANK.m3_quadratic_find_formula.A4 = [
    expression("vertex-root-mixed", "이차함수 f의 축은 x=1이고 f(-1)=8, f(0)=2이다. f의 식을 구한 뒤 x축과 만나는 점을 모두 구하세요.", "f(x)=2(x-1)^2,교점(1,0)", [
      "축 조건으로 f(x)=a(x-1)²+q로 둔다.",
      "f(-1)=8, f(0)=2에서 4a+q=8, a+q=2를 세운다.",
      "a=2,q=0을 구해 f(x)=2(x-1)²을 얻는다.",
      "f(x)=0을 풀어 x=1 하나를 구한다.",
      "꼭짓점이 x축 위이고 두 함수값을 만족하는지 검증한다.",
    ], {
      acceptedAnswers: ["y=2(x-1)^2,(1,0)", "2(x-1)^2,x=1"],
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a4-1-three-general-points",
        conditions: 4,
        firstEquationFamily: "axis-values-then-root",
        coreStrategy: "축에 맞는 표현으로 식을 복원한 뒤 완전제곱 구조에서 x절편을 해석",
        conditionTransform: "축→두 값 연립→식→x축 조건",
        graphStructure: "vertex-on-x-axis",
        targetKind: "formula-and-axis-intersection",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_root_meaning"],
      }),
    }),
    stepOrder("mixed-condition-process", "이차함수 f는 f(-1)=f(5)=0이고 f(1)=-12이며 아래로 열리지 않는다. f의 식과 최솟값을 구하는 과정을 배열하세요.", [
      "두 영점으로 f(x)=a(x+1)(x-5)로 둔다",
      "f(1)=-12를 대입해 -8a=-12를 세운다",
      "a=3/2를 구하고 위로 열리는 조건과 일치함을 확인한다",
      "두 영점의 중점 x=2에서 최솟값을 구한다",
      "f(2)=-27/2를 계산하고 세 조건을 검증한다",
    ], [
      "영점에 적합한 인수형을 선택한다.",
      "추가 점으로 계수 방정식을 세운다.",
      "계수와 열린 방향을 검증한다.",
      "대칭축 위치를 구한다.",
      "최솟값과 원조건을 최종 검산한다.",
    ], processExtra([
      rubricStep("factor-form", "두 영점으로 인수형 설정", 2, ["a(x+1)(x-5)"]),
      rubricStep("point", "추가 점 대입", 2, ["-8a=-12"]),
      rubricStep("coefficient", "계수와 방향", 2, ["a=3/2", "위로 열린다"]),
      rubricStep("axis", "영점 중점으로 축 계산", 2, ["축 x=2", "(-1+5)/2=2"]),
      rubricStep("minimum", "최솟값 계산과 검산", 2, ["-27/2", "f(2)=-27/2"]),
    ], {
      forbiddenLogicalErrors: ["a=-3/2", "최댓값 -27/2"],
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a4-2-mixed-condition-process",
        conditions: 5,
        firstEquationFamily: "root-form-point-extreme",
        coreStrategy: "두 영점으로 인수형을 선택한 뒤 계수·축·극값을 서로 다른 조건으로 검증",
        conditionTransform: "영점→인수형→점→a→축→최솟값",
        graphStructure: "two-root-upward-parabola",
        targetKind: "scored-formula-extreme-process",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_max_min"],
      }),
    })),
    written("uniqueness-from-axis-and-levels", "이차함수의 축 x=p와 서로 다른 두 높이의 그래프 위 점 하나씩이 주어지면 식이 항상 하나로 정해지는 것은 아니다. 언제 유일하게 정해지는지 꼭짓점형을 이용해 조건을 설명하세요.", "f(x)=a(x-p)²+q로 두고 두 점의 축까지 거리 제곱이 d1²,d2², 함수값이 y1,y2라 하면 ad1²+q=y1, ad2²+q=y2이다. d1²≠d2²이면 두 식이 독립이므로 a,q가 유일하게 정해진다. 반대로 거리가 같으면 두 식이 같은 정보를 주므로 유일하지 않다. 따라서 축까지 거리가 다른 두 점이면 유일하다.", [
      "축 조건으로 f(x)=a(x-p)²+q를 선택한다.",
      "두 점을 축까지의 거리 d1,d2와 높이 y1,y2로 나타낸다.",
      "ad1²+q=y1, ad2²+q=y2를 세운다.",
      "d1²≠d2²일 때 두 식이 독립이라 a,q가 유일함을 설명한다.",
      "d1²=d2²이면 같은 높이여야 하고 새 정보가 없어 유일하지 않음을 반례로 검증한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "form", alternatives: ["f(x)=a(x-p)²+q", "f(x)=a(x-p)^2+q"], points: 2 },
        { id: "distance-condition", alternatives: ["d1²≠d2²", "축까지의 거리의 제곱이 달라야"], points: 2 },
      ],
      requiredRelations: [
        { id: "independence", left: ["거리의 제곱이 다르", "d1²≠d2²"], right: ["a,q가 유일", "두 식이 독립"], connectors: ["따라서", "이면"], points: 2 },
        { id: "failure", left: ["거리가 같", "d1²=d2²"], right: ["유일하지 않", "같은 정보"], connectors: ["이면", "때문"], points: 2 },
      ],
      requiredCalculations: [
        { id: "equations", alternatives: ["ad1²+q=y1", "ad2²+q=y2"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["축까지 거리가 다른 두 점이면 유일", "d1²≠d2²일 때 유일"], points: 2 },
      forbiddenLogicalErrors: ["축과 아무 두 점이면 항상 유일", "같은 거리에 다른 높이도 가능"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a4-3-uniqueness-condition",
        conditions: 4,
        firstEquationFamily: "general-uniqueness-condition",
        coreStrategy: "점의 좌표를 축까지 거리로 추상화해 두 계수식의 독립성 판정",
        conditionTransform: "좌표→거리 제곱→연립 독립성",
        graphStructure: "axis-known-general-point-pair",
        targetKind: "necessary-sufficient-uniqueness-proof",
        linked: ["m3_quadratic_find_formula", "system_equation"],
      }),
    }),
  ];

  BANK.m3_quadratic_find_formula.A5 = [
    expression("symmetric-sum-reconstruction", "이차함수 f는 f(0)+f(6)=20, f(1)=f(5)=2를 만족하고 축의 x좌표는 정수이며 1<x<5이다. f의 식과 최솟값을 구하세요.", "f(x)=8/5(x-3)^2-22/5,최솟값-22/5", [
      "f(1)=f(5)에서 축이 두 x좌표의 중점 x=3임을 찾고 정수 범위 조건과 확인한다.",
      "축 대칭으로 f(0)=f(6)이므로 합 20에서 두 값이 각각 10임을 찾는다.",
      "f(x)=a(x-3)²+q로 두고 4a+q=2, 9a+q=10을 세운다.",
      "a=8/5,q=-22/5를 구한다.",
      "a>0이므로 최솟값이 q임을 확인하고 네 함수값을 검산한다.",
    ], {
      acceptedAnswers: ["y=8/5(x-3)^2-22/5,min=-22/5", "8/5(x-3)^2-22/5,-22/5"],
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a5-1-four-condition-transfer",
        conditions: 6,
        firstEquationFamily: "sum-and-equal-value-reconstruction",
        coreStrategy: "같은 값으로 축을 찾은 뒤 대칭을 이용해 합 조건을 개별 조건으로 분해",
        conditionTransform: "같은 값→축→대칭합 반분→거리별 연립→극값",
        graphStructure: "mixed-sum-symmetry-data",
        targetKind: "formula-and-minimum",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_vertex_axis", "m3_quadratic_max_min"],
        archetype: "INTEGRATED",
      }),
    }),
    stepOrder("multi-representation-verification", "f(1)=f(5)=0, f(2)=f(4)=-6인 이차함수 f의 식과 최솟값을 인수형과 꼭짓점형 두 표현으로 교차 검증하는 과정을 배열하세요.", [
      "두 영점에서 f(x)=a(x-1)(x-5)로 둔다",
      "f(2)=-6을 대입해 -3a=-6에서 a=2를 구한다",
      "f(x)=2(x-1)(x-5)를 완성한다",
      "영점의 중점 3을 축으로 잡아 f(3)=-8을 계산하고 f(x)=2(x-3)²-8로 바꾼다",
      "f(4)=-6과 두 표현의 전개 결과가 같은지 검증한다",
    ], [
      "영점 조건에 맞는 표현을 선택한다.",
      "다른 높이의 점으로 계수를 구한다.",
      "인수형을 완성한다.",
      "축과 극값을 이용해 꼭짓점형으로 변환한다.",
      "남은 점과 두 표현의 동치성을 검증한다.",
    ], processExtra([
      rubricStep("root-form", "영점으로 인수형 설정", 2, ["a(x-1)(x-5)"]),
      rubricStep("coefficient", "추가 높이로 a 계산", 2, ["-3a=-6", "a=2"]),
      rubricStep("factor-result", "인수형 완성", 1, ["2(x-1)(x-5)"]),
      rubricStep("vertex-form", "축·최솟값과 꼭짓점형", 3, ["축 x=3", "f(3)=-8", "2(x-3)²-8"]),
      rubricStep("cross-check", "남은 점과 표현 동치 검증", 2, ["f(4)=-6", "두 식이 같다"]),
    ], {
      forbiddenLogicalErrors: ["최솟값 -6", "축 x=2"],
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a5-2-integrated-form-choice",
        conditions: 6,
        firstEquationFamily: "root-form-to-vertex-form",
        coreStrategy: "인수형으로 계수를 정한 뒤 대칭축을 통해 꼭짓점형을 독립 구성해 교차 검증",
        conditionTransform: "영점→인수형→a→축·극값→꼭짓점형",
        graphStructure: "two-roots-two-levels",
        targetKind: "scored-dual-representation-process",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_max_min"],
        archetype: "PROCESS",
      }),
    })),
    written("minimal-data-strategy", "표에서 f(-1)=9, f(1)=1, f(3)=1, f(5)=9이고, 이 중 어느 값도 중복 측정이 아니다. 최소 계산으로 f(x)를 구하는 전략, 식의 유일성, 사용하지 않은 자료의 검산 역할을 설명하세요.", "같은 함수값 쌍의 공통 중점이 2이므로 축은 x=2이다. 축에서 거리 1과 3인 점 하나씩, 즉 대표점 (1,1)과 (-1,9) 두 개만 골라 f=a(x-2)²+q에 대입하면 a+q=1, 9a+q=9이다. 이를 풀어 a=1,q=0을 얻으므로 축과 서로 다른 두 거리 조건으로 식이 유일하게 정해진다. 따라서 f(x)=(x-2)²이다. 사용하지 않은 점 (3,1),(5,9)은 남은 자료로서 대칭과 식을 독립 검산하는 역할을 한다.", [
      "두 같은 값 쌍의 공통 중점에서 축 x=2를 찾는다.",
      "거리가 1과 3인 대표점 하나씩만 선택한다.",
      "a+q=1, 9a+q=9를 세워 a=1,q=0을 구한다.",
      "축과 두 독립 거리 조건이 a,q를 하나로 정하므로 유일함을 설명한다.",
      "사용하지 않은 짝점들을 대입해 대칭과 식을 독립 검산한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "axis", alternatives: ["축은 x=2", "공통 중점 2"], points: 2 },
        { id: "minimal-selection", alternatives: ["거리 1과 3인 점 하나씩", "대표점 두 개만"], points: 2 },
      ],
      requiredRelations: [
        { id: "uniqueness", left: ["축", "두 거리 조건", "a,q"], right: ["유일", "하나로 정"], connectors: ["따라서", "이므로"], points: 2 },
        { id: "verification", left: ["사용하지 않은 점", "남은 자료"], right: ["검산", "대칭 확인"], connectors: ["역할", "사용"], points: 2 },
      ],
      requiredCalculations: [
        { id: "equations", alternatives: ["a+q=1", "9a+q=9"], points: 2 },
        { id: "parameters", alternatives: ["a=1", "q=0"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["f(x)=(x-2)²", "f(x)=(x-2)^2"], points: 2 },
      forbiddenLogicalErrors: ["네 점을 모두 써야만 유일", "축은 x=1", "q=1로 확정한다"],
    }), {
      ...qualityMeta({
        replaces: "m3-qf-learning-5-a5-3-strategy-and-uniqueness",
        conditions: 6,
        firstEquationFamily: "minimal-symmetric-data-strategy",
        coreStrategy: "중복 대칭 자료에서 독립 정보만 선별하고 나머지를 검산용으로 분리",
        conditionTransform: "두 대칭쌍→축→독립 거리 선택→유일성→잔여 검산",
        graphStructure: "redundant-symmetric-table",
        targetKind: "strategy-uniqueness-verification-proof",
        linked: ["m3_quadratic_find_formula", "m3_quadratic_vertex_axis"],
        archetype: "WRITTEN",
      }),
    }),
  ];

  BANK.m3_quadratic_max_min.A3 = [
    short("parameter-from-equal-endpoint-maxima", "-2≤x≤4에서 f(x)=(x-k)²+2의 최솟값이 2이고 최댓값 11을 양 끝점에서 모두 갖는다. k와 최댓값·최솟값의 차를 구하세요.", "k=1,차=9", [
      "양 끝점의 함수값이 같으므로 (-2-k)²=(4-k)²을 세운다.",
      "두 끝점의 중점에서 k=1을 구한다.",
      "k=1이 구간 안이므로 최솟값 2를 갖는지 확인한다.",
      "끝점 함수값 11과 최솟값 2의 차 9를 구한다.",
    ], {
      acceptedAnswers: ["1,9", "k=1,9"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a3-1-interval-with-parameter",
        conditions: 4,
        domain: "-2≤x≤4",
        requiresDomain: true,
        firstEquationFamily: "equal-endpoint-extrema",
        coreStrategy: "두 끝점 최대가 같다는 조건을 축의 위치로 역추론",
        conditionTransform: "끝점 극값→거리 등식→k→범위",
        graphStructure: "moving-axis-on-closed-interval",
        targetKind: "parameter-and-range",
        linked: ["m3_quadratic_max_min", "m3_quadratic_vertex_axis"],
      }),
    }),
    expression("height-threshold-and-maximum", "0≤t≤6에서 물체의 높이는 h(t)=-t²+6t+1이다. 최고 높이와 그때의 t를 구하고, 높이가 9 이상인 t의 범위를 구하세요.", "최고10,t=3,2≤t≤4", [
      "h(t)=-(t-3)²+10으로 완전제곱한다.",
      "구간 안 꼭짓점 t=3에서 최고 높이 10을 얻는다.",
      "h(t)≥9를 -(t-3)²+10≥9로 바꾼다.",
      "(t-3)²≤1을 풀어 2≤t≤4를 얻고 원래 정의역과 교집합을 확인한다.",
    ], {
      acceptedAnswers: ["t=3,h=10,2<=t<=4", "10,3,[2,4]"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a3-2-projectile-maximum",
        conditions: 3,
        domain: "0≤t≤6",
        requiresDomain: true,
        firstEquationFamily: "maximum-plus-threshold-interval",
        coreStrategy: "꼭짓점형 하나로 최고점과 높이 기준 구간을 함께 해석",
        conditionTransform: "일반식→꼭짓점형→극값·제곱부등식",
        graphStructure: "bounded-downward-height-model",
        targetKind: "maximum-and-threshold-domain",
        linked: ["m3_quadratic_max_min", "inequality"],
      }),
    }),
    stepOrder("optimization-process", "합이 12인 두 양수의 차이가 2 이하일 때 곱의 최댓값을 구하는 과정을 배열하세요.", [
      "작은 수를 x, 큰 수를 12-x로 두고 0<x≤6으로 정한다",
      "차 조건 (12-x)-x≤2에서 x≥5를 얻는다",
      "정의역을 5≤x≤6으로 확정한다",
      "곱 P=x(12-x)=-(x-6)²+36으로 정리한다",
      "x=6이 정의역에 있으므로 두 수 6,6에서 최댓값 36임을 검증한다",
    ], [
      "두 양수를 한 변수로 나타낸다.",
      "차이 조건을 부등식으로 변환한다.",
      "실제 정의역을 확정한다.",
      "곱을 꼭짓점형 이차함수로 바꾼다.",
      "꼭짓점과 조건을 함께 검증한다.",
    ], processExtra([
      rubricStep("variables", "두 수와 기본 범위 설정", 2, ["x", "12-x", "0<x≤6"]),
      rubricStep("difference", "차이 조건 부등식", 2, ["12-2x≤2", "x≥5"]),
      rubricStep("domain", "최종 정의역", 2, ["5≤x≤6"]),
      rubricStep("quadratic", "곱의 꼭짓점형", 2, ["P=-(x-6)²+36", "P=-(x-6)^2+36"]),
      rubricStep("verify", "최대와 두 수 검증", 2, ["6,6", "최댓값 36"]),
    ], {
      forbiddenLogicalErrors: ["두 수의 차가 정확히 2", "정의역 0<x<12만 사용"],
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a3-3-optimization-process",
        conditions: 4,
        domain: "5≤x≤6",
        requiresDomain: true,
        firstEquationFamily: "sum-product-with-difference-bound",
        coreStrategy: "상황의 추가 부등식으로 최적화 정의역을 좁힌 뒤 꼭짓점 확인",
        conditionTransform: "합→한 변수, 차이→부등식, 곱→이차함수",
        graphStructure: "restricted-product-parabola",
        targetKind: "scored-constrained-optimization",
        linked: ["m3_quadratic_max_min", "inequality"],
      }),
    })),
  ];

  BANK.m3_quadratic_max_min.A4 = [
    expression("rectangle-with-side-gap", "둘레가 20인 직사각형에서 긴 변은 짧은 변보다 적어도 2 길다. 가능한 직사각형의 넓이의 최댓값과 그때 두 변을 구하세요.", "최댓값24,변4와6", [
      "짧은 변을 x, 긴 변을 10-x로 두고 0<x≤5로 정한다.",
      "10-x≥x+2에서 x≤4를 얻어 정의역을 0<x≤4로 좁힌다.",
      "넓이 A=x(10-x)=-(x-5)²+25로 나타낸다.",
      "꼭짓점 x=5는 정의역 밖이고 0<x≤4에서 A가 증가하므로 끝점 x=4를 선택한다.",
      "두 변 4,6과 넓이 24가 둘레·차이 조건을 만족하는지 검증한다.",
    ], {
      acceptedAnswers: ["24,4,6", "4와6,넓이24"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a4-1-moving-rectangle",
        conditions: 4,
        domain: "0<x≤4",
        requiresDomain: true,
        firstEquationFamily: "perimeter-area-with-gap",
        coreStrategy: "변 길이 차 조건으로 꼭짓점을 정의역 밖으로 밀어 경계 최적값 선택",
        conditionTransform: "둘레→한 변수, 차이→제한, 넓이→꼭짓점형",
        graphStructure: "truncated-area-parabola",
        targetKind: "constrained-maximum-dimensions",
        linked: ["m3_quadratic_max_min", "polygon_area_perimeter", "inequality"],
      }),
    }),
    short("parameter-equal-endpoints", "-1≤x≤5에서 f_k(x)=(x-k)²+k의 최댓값이 양 끝점에서 같고 최솟값이 구간 안에서 생긴다. k와 최댓값, 최솟값을 구하세요.", "k=2,최댓값11,최솟값2", [
      "양 끝점의 함수값이 같다는 식 (-1-k)²+k=(5-k)²+k를 세운다.",
      "두 끝점의 중점에서 k=2를 구한다.",
      "축 x=2가 구간 안에 있어 최솟값 f(2)=2를 구한다.",
      "끝점 함수값 f(-1)=f(5)=11을 계산한다.",
      "구간과 두 극값 조건을 모두 검증한다.",
    ], {
      acceptedAnswers: ["2,11,2", "k=2,max=11,min=2"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a4-2-parameter-extreme-comparison",
        conditions: 4,
        domain: "-1≤x≤5",
        requiresDomain: true,
        firstEquationFamily: "parameterized-equal-endpoint-extrema",
        coreStrategy: "끝점 동률로 이동 축을 결정하고 내부 꼭짓점과 양끝 극값을 분리",
        conditionTransform: "끝점 동률→k→내부 최소→끝점 최대",
        graphStructure: "parameter-shifted-interval-parabola",
        targetKind: "parameter-max-min",
        linked: ["m3_quadratic_max_min", "m3_quadratic_vertex_axis"],
      }),
    }),
    written("interval-extrema-cases", "닫힌 구간 [r,s]에서 이차함수의 최댓값·최솟값을 구할 때 양 끝점은 항상 확인하고 꼭짓점은 구간 안에 있을 때만 확인해야 하는 이유를, 축이 구간의 왼쪽·안쪽·오른쪽에 있는 세 경우로 나누어 설명하세요.", "축이 왼쪽, 즉 축<r이면 구간에서 함수가 한 방향으로 변하므로 끝점 r,s에서 극값이 결정된다. 축이 구간 안, 즉 r≤축≤s이면 방향이 바뀌므로 꼭짓점도 후보가 된다. 축이 오른쪽, 즉 축>s이면 다시 구간에서 한 방향으로 변하므로 끝점에서 결정된다. 따라서 양 끝점은 항상 확인하고 꼭짓점은 구간 안에 있을 때 확인한다. 즉 끝점은 항상, 꼭짓점은 구간 안일 때 비교한다.", [
      "이차함수는 축을 기준으로 증가·감소 방향이 바뀜을 사용한다.",
      "축이 r보다 왼쪽인 경우 구간 전체에서 한 방향으로 변함을 설명한다.",
      "축이 [r,s] 안인 경우 꼭짓점이 내부 극값 후보임을 설명한다.",
      "축이 s보다 오른쪽인 경우도 구간 전체에서 한 방향으로 변함을 설명한다.",
      "세 경우를 종합해 끝점과 꼭짓점 후보 규칙을 결론낸다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "endpoints", alternatives: ["양 끝점은 항상 확인", "r과 s의 함수값은 항상 비교"], points: 2 },
        { id: "vertex", alternatives: ["꼭짓점은 구간 안에 있을 때", "축이 구간 안이면 꼭짓점"], points: 2 },
      ],
      requiredRelations: [
        { id: "left-case", left: ["축이 왼쪽", "축<r"], right: ["한 방향", "단조"], connectors: ["이면", "때문"], points: 2 },
        { id: "inside-case", left: ["축이 구간 안", "r≤축≤s"], right: ["방향이 바뀌", "꼭짓점도 후보"], connectors: ["이면", "때문"], points: 2 },
        { id: "right-case", left: ["축이 오른쪽", "축>s"], right: ["한 방향", "단조"], connectors: ["이면", "때문"], points: 2 },
      ],
      requiredCalculations: [],
      requiredConclusion: { alternatives: ["끝점은 항상, 꼭짓점은 구간 안일 때 비교", "세 후보의 함수값을 비교"], points: 2 },
      forbiddenLogicalErrors: ["꼭짓점은 항상 확인해야 한다", "끝점은 확인할 필요가 없다"],
    }), {
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a4-3-endpoint-and-vertex-proof",
        conditions: 4,
        domain: "r≤x≤s",
        requiresDomain: true,
        firstEquationFamily: "interval-axis-case-proof",
        coreStrategy: "축의 위치를 세 경우로 나눠 극값 후보 규칙을 정당화",
        conditionTransform: "축 위치→구간 내 증감→후보점",
        graphStructure: "three-axis-position-cases",
        targetKind: "case-based-extrema-proof",
        linked: ["m3_quadratic_max_min", "m3_quadratic_vertex_axis"],
      }),
    }),
  ];

  BANK.m3_quadratic_max_min.A5 = [
    short("integer-parameter-optimization", "m은 자연수이고 정수 x가 0≤x≤2m+1일 때 y=-x²+(2m+1)x의 최댓값이 72이다. m과 최댓값을 만드는 모든 x를 구하세요.", "m=8,x=8,9", [
      "연속 범위에서 축이 x=m+1/2임을 찾는다.",
      "x가 정수이므로 축에서 같은 거리인 x=m,m+1이 최대 후보임을 정한다.",
      "두 점의 함수값이 m(m+1)임을 계산한다.",
      "m(m+1)=72를 풀어 자연수 m=8을 구한다.",
      "정의역과 이웃 정수값을 확인해 x=8,9만 최대임을 검증한다.",
    ], {
      acceptedAnswers: ["8,8,9", "m=8,x=8 또는 9"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a5-1-integer-domain-optimization",
        conditions: 5,
        domain: "m∈ℕ, x∈ℤ, 0≤x≤2m+1",
        requiresDomain: true,
        firstEquationFamily: "reverse-integer-vertex-optimization",
        coreStrategy: "반정수 축의 두 정수 최대 후보를 일반식으로 만든 뒤 최대값에서 매개변수 역산",
        conditionTransform: "연속 축→정수 후보쌍→최대식→m 방정식",
        graphStructure: "integer-lattice-parameter-parabola",
        targetKind: "parameter-and-all-maximizers",
        linked: ["m3_quadratic_max_min", "integer_domain", "m3_factor_sum_product"],
        archetype: "SHORT_ANSWER",
      }),
    }),
    expression("modular-fence-optimization", "길이 24m의 울타리로 벽을 한 변으로 하는 직사각형의 나머지 세 변을 두른다. 벽과 나란한 변에는 폭 2m의 출입구를 두어 그 부분에는 울타리를 쓰지 않는다. 두 변의 길이는 자연수이고 벽과 나란한 변은 4의 배수이다. 최대 넓이와 두 변을 구하세요.", "최대84m^2,수직7m,평행12m", [
      "벽에 수직인 변을 x, 평행한 변을 y로 두고 2x+(y-2)=24를 세운다.",
      "y=26-2x, 넓이 A=x(26-2x)=-2(x-6.5)²+84.5로 나타낸다.",
      "x,y가 자연수이고 y가 4의 배수이므로 x는 홀수임을 찾는다.",
      "축 6.5에 가까운 허용 홀수 x=5,7을 비교한다.",
      "A(5)=80, A(7)=84이므로 x=7,y=12를 고르고 울타리 길이와 배수 조건을 검증한다.",
    ], {
      acceptedAnswers: ["84,7,12", "수직7,평행12,넓이84"],
      requiresDomain: true,
      ...qualityMeta({
        replaces: "m3-qf-learning-6-a5-2-strategy-choice-optimization",
        conditions: 6,
        domain: "x,y∈ℕ, y≡0 (mod 4), 2x+y-2=24",
        requiresDomain: true,
        firstEquationFamily: "fence-with-gap-and-divisibility",
        coreStrategy: "연속 꼭짓점 근처 후보를 자연수·배수 조건으로 걸러 이산 최적화",
        conditionTransform: "울타리→관계식→이차함수→합동 조건→후보 비교",
        graphStructure: "discrete-constrained-area-parabola",
        targetKind: "integer-dimensions-and-maximum",
        linked: ["m3_quadratic_max_min", "polygon_area_perimeter", "integer_domain"],
        archetype: "STRATEGY_SELECTION",
      }),
    }),
    written("piecewise-profit-model", "공연 입장료가 10천 원일 때 100명이 온다. 가격을 1천 원씩 올릴 때, 5회 인상까지는 매회 5명씩 줄고 6회부터 10회까지는 5회 인상 때의 인원에서 추가 인상 1회마다 8명씩 줄어든다. 인상 횟수는 0부터 10까지의 정수이다. 수입을 최대로 하는 가격과 최대 수입을 두 구간으로 나누어 설명하세요.", "x는 0부터 10까지의 정수이다. 0≤x≤5에서는 R1=(10+x)(100-5x)=-5(x-5)²+1125이므로 첫 구간의 최대는 x=5에서 1125이다. 6≤x≤10에서는 인원이 75-8(x-5)=115-8x이고 R2=(10+x)(115-8x)이므로 둘째 구간의 최대는 x=6에서 1072이다. 1125가 1072보다 더 크므로 가격은 15천 원, 최대 수입은 1125천 원이다.", [
      "인상 횟수 x의 정수 정의역을 두 구간 0≤x≤5, 6≤x≤10으로 나눈다.",
      "첫 구간의 인원과 수입 R1=(10+x)(100-5x)를 세워 x=5에서 1125를 얻는다.",
      "둘째 구간의 인원 75-8(x-5)=115-8x와 수입 R2를 세운다.",
      "R2의 축이 둘째 구간 왼쪽에 있어 이 구간에서는 x=6이 최대 후보임을 판단하고 1072를 계산한다.",
      "두 구간 최대를 비교해 가격 15천 원·수입 1125천 원을 결론내고 정수 이웃값을 검산한다.",
    ], writtenRubric({
      requiredClaims: [
        { id: "domain", alternatives: ["x는 0부터 10까지의 정수", "x∈{0,1,…,10}", "두 구간 0≤x≤5, 6≤x≤10"], points: 2 },
        { id: "piecewise", alternatives: ["두 구간으로 나눈다", "R1", "R2"], points: 2 },
      ],
      requiredRelations: [
        { id: "first-max", left: ["R1", "첫 구간"], right: ["x=5", "1125"], connectors: ["최대", "에서"], points: 2 },
        { id: "second-max", left: ["R2", "둘째 구간"], right: ["x=6", "1072"], connectors: ["최대", "에서"], points: 2 },
        { id: "global", left: ["1125", "1072"], right: ["1125", "15천 원"], connectors: ["비교", "더 크"], points: 2 },
      ],
      requiredCalculations: [
        { id: "r1", alternatives: ["(10+x)(100-5x)", "-5(x-5)²+1125"], points: 2 },
        { id: "r2", alternatives: ["75-8(x-5)", "115-8x", "(10+x)(115-8x)"], points: 2 },
      ],
      requiredConclusion: { alternatives: ["가격은 15천 원, 최대 수입은 1125천 원", "15천원,1125천원"], points: 2 },
      forbiddenLogicalErrors: ["x는 모든 실수", "둘째 구간도 100-5x", "가격 16천 원이 전체 최대"],
    }), {
      requiresDomain: true,
      ...qualityMeta({
        action: "MODIFY",
        replaces: "m3-qf-learning-6-a5-3-integrated-profit-model",
        conditions: 7,
        domain: "x∈{0,1,2,...,10}; 0≤x≤5 또는 6≤x≤10",
        requiresDomain: true,
        firstEquationFamily: "piecewise-integer-profit",
        coreStrategy: "변화율이 바뀌는 두 이차수입 모델을 별도 최적화한 뒤 전역 비교",
        conditionTransform: "가격 정책→두 인원식→두 수입함수→구간별 최대→전역 최대",
        graphStructure: "piecewise-discrete-downward-parabolas",
        targetKind: "written-global-optimization",
        linked: ["m3_quadratic_max_min", "integer_domain", "piecewise_model"],
        archetype: "INTEGRATED",
      }),
    }),
  ];

  // BANK_ENTRIES

  function stageDefaults(stage) {
    const stageIndex = STAGES.indexOf(stage);
    return {
      reasoningGoals: DEFAULT_REASONING[stage],
      structureNovelty: stage === "A5" ? "HIGH" : stageIndex >= 3 ? "MEDIUM" : "LOW",
      requiresStrategySelection: stageIndex >= 3,
      requiresExplanation: stageIndex >= 4,
      directFormulaSubstitution: stageIndex <= 1,
      memorizationOnly: false,
    };
  }

  function createProblem(concept, stage, spec, index) {
    const defaults = stageDefaults(stage);
    const linked = [...new Set(spec.linked || (
      STAGES.indexOf(stage) >= 4
        ? [concept.conceptId, ...concept.prerequisiteConceptIds]
        : [concept.conceptId]
    ))];
    const problemId = `m3-qf-learning-${concept.order}-${stage.toLowerCase()}-${index + 1}-${spec.key}`;
    const contentRole = index === 2 ? "LEARNING_FINAL_CHECK" : index === 0 ? "LEARNING_EXAMPLE" : "LEARNING_PRACTICE";
    const structureFingerprint = spec.structureFingerprint || {
      firstEquationFamily: spec.firstEquationFamily || spec.steps[0],
      coreStrategy: spec.coreStrategy || `${spec.answerType}:${spec.steps.slice(0, 2).join("|")}`,
      conditionTransform: spec.conditionTransform || spec.steps[1] || spec.steps[0],
      graphStructure: spec.graphStructure || concept.conceptId,
      targetKind: spec.targetKind || spec.key,
    };
    return Object.freeze({
      problemId,
      questionId: problemId,
      grade: 9,
      gradeLabel: "중3",
      unitId: UNIT_ID,
      unitTitle: "이차함수",
      conceptId: concept.conceptId,
      conceptTitle: concept.conceptName,
      stage,
      answerType: spec.answerType,
      questionText: spec.prompt,
      problem: spec.prompt,
      correctAnswer: spec.correctAnswer,
      answer: spec.correctAnswer,
      acceptedAnswers: Object.freeze([...(spec.acceptedAnswers || [])]),
      choices: spec.choices ? Object.freeze([...spec.choices]) : undefined,
      requiredSteps: spec.requiredSteps ? Object.freeze([...spec.requiredSteps]) : undefined,
      rubricSteps: spec.rubricSteps ? Object.freeze(spec.rubricSteps.map((step) => Object.freeze({ ...step }))) : undefined,
      forbiddenLogicalErrors: spec.forbiddenLogicalErrors ? Object.freeze([...spec.forbiddenLogicalErrors]) : undefined,
      writtenRubric: spec.writtenRubric ? Object.freeze({ ...spec.writtenRubric }) : undefined,
      tolerance: spec.tolerance,
      reasoningGoals: Object.freeze([...(spec.reasoningGoals || defaults.reasoningGoals)]),
      prerequisiteConceptIds: Object.freeze([...concept.prerequisiteConceptIds]),
      linkedConceptIds: Object.freeze(linked),
      linkedConceptCount: linked.length,
      linkedConditionCount: Number(spec.linkedConditionCount) || (
        stage === "A5" ? 3 : stage === "A4" ? 3 : stage === "A3" ? 2 : stage === "A2" ? 2 : 1
      ),
      domain: spec.domain || "x∈ℝ",
      requiresDomain: spec.requiresDomain === true,
      solutionPath: Object.freeze([...spec.steps]),
      structureSignature: `structure:m3-qf:${concept.conceptId}:${stage}:${spec.key}`,
      solutionPathSignature: `solution:m3-qf:${concept.conceptId}:${stage}:${spec.key}:v1`,
      estimatedMeaningfulSteps: spec.steps.length,
      trapTypes: Object.freeze([...(spec.traps || [])]),
      structureFingerprint: Object.freeze({ ...structureFingerprint }),
      scopeTag: spec.scopeTag || "MIDDLE3_QUADRATIC",
      scopeEvidence: spec.scopeEvidence || "중3 이차함수와 중학교 대수 범위에서 해결",
      independentValidation: Object.freeze({
        conditionFeasible: spec.independentValidation?.conditionFeasible !== false,
        uniqueAnswer: spec.independentValidation?.uniqueAnswer !== false,
        answerRecalculated: spec.independentValidation?.answerRecalculated !== false,
        scopeChecked: spec.independentValidation?.scopeChecked !== false,
      }),
      revisionAction: spec.revisionAction || "KEEP",
      replacesProblemId: spec.replacesProblemId,
      validatorId: VALIDATOR_ID,
      contentRole,
      problemArchetype: spec.archetype || ({
        MULTIPLE_CHOICE: "HIGH_DIFFICULTY_MULTIPLE_CHOICE",
        SHORT_ANSWER: "SHORT_ANSWER",
        EXPRESSION_INPUT: "EXPRESSION",
        STEP_ORDER: "PROCESS",
        WRITTEN_RESPONSE: "WRITTEN",
      }[spec.answerType]),
      learningFlow: Object.freeze({
        orientationQuestion: "이 문제에서 먼저 구해야 할 것은 무엇인가요?",
        keyConditionHint: spec.steps[0],
        firstStepHint: spec.steps[1] || spec.steps[0],
        connectionHint: spec.steps[2] || spec.steps.at(-1),
        fullSolution: spec.steps.join(" → "),
      }),
      structureNovelty: spec.structureNovelty || defaults.structureNovelty,
      requiresStrategySelection: spec.requiresStrategySelection ?? defaults.requiresStrategySelection,
      requiresExplanation: spec.requiresExplanation ?? defaults.requiresExplanation,
      directFormulaSubstitution: spec.directFormulaSubstitution ?? defaults.directFormulaSubstitution,
      memorizationOnly: spec.memorizationOnly ?? defaults.memorizationOnly,
      executionScope: "LEARNING_ONLY",
      source: VERSION,
    });
  }

  const problems = Object.freeze(CONCEPTS.flatMap((concept) => (
    STAGES.flatMap((stage) => (BANK[concept.conceptId]?.[stage] || []).map((spec, index) => createProblem(concept, stage, spec, index)))
  )));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));
  const problemsByConceptStage = Object.freeze(Object.fromEntries(CONCEPTS.flatMap((concept) => (
    STAGES.map((stage) => [
      `${concept.conceptId}:${stage}`,
      Object.freeze(problems.filter((problem) => problem.conceptId === concept.conceptId && problem.stage === stage)),
    ])
  ))));

  function audit() {
    const validation = schema.validateProblemSet(problems);
    const countBy = (selector) => problems.reduce((result, problem) => {
      const key = selector(problem);
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
    return {
      version: VERSION,
      conceptCount: CONCEPTS.length,
      problemCount: problems.length,
      byStage: countBy((problem) => problem.stage),
      byAnswerType: countBy((problem) => problem.answerType),
      byReasoningGoal: problems.flatMap((problem) => problem.reasoningGoals).reduce((result, goal) => {
        result[goal] = (result[goal] || 0) + 1;
        return result;
      }, {}),
      byMeaningfulSteps: countBy((problem) => String(problem.estimatedMeaningfulSteps)),
      structureCount: validation.structureCount,
      solutionPathCount: validation.solutionPathCount,
      validationErrors: validation.errors,
      valid: validation.valid,
    };
  }

  return Object.freeze({
    VERSION,
    UNIT_ID,
    VALIDATOR_ID,
    concepts: CONCEPTS,
    problems,
    problemsById,
    problemsByConceptStage,
    getProblems(conceptId, stage) {
      return problemsByConceptStage[`${conceptId}:${stage}`] || Object.freeze([]);
    },
    audit,
  });
});
