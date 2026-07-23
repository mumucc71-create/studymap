(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  if (root) root.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS = data;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const UNIT_DEFINITIONS = [
    { unitId: "m3-real-numbers", unitTitle: "실수와 제곱근", routeConceptId: "real_numbers" },
    { unitId: "m3-factorization", unitTitle: "다항식의 곱셈과 인수분해", routeConceptId: "factorization" },
    { unitId: "m3-quadratic-equation", unitTitle: "이차방정식", routeConceptId: "quadratic_equation" },
    { unitId: "m3-quadratic-function", unitTitle: "이차함수", routeConceptId: "quadratic_function" },
    { unitId: "m3-pythagorean", unitTitle: "피타고라스 정리", routeConceptId: "pythagorean" },
    { unitId: "m3-trigonometric-ratio", unitTitle: "삼각비", routeConceptId: "trigonometric_ratio" },
    { unitId: "m3-circle", unitTitle: "원의 성질", routeConceptId: "circle" },
    { unitId: "m3-statistics-probability", unitTitle: "통계와 확률", routeConceptId: "statistics_probability" },
  ];

  const unitById = new Map(UNIT_DEFINITIONS.map((unit) => [unit.unitId, unit]));
  const definitions = [];

  function addConcept(unitId, conceptId, conceptName, prerequisiteConceptIds = []) {
    const unit = unitById.get(unitId);
    const unitConcepts = definitions.filter((item) => item.unitId === unitId);
    const previous = unitConcepts.at(-1);
    const definition = {
      conceptId,
      unitId,
      unitTitle: unit.unitTitle,
      conceptName,
      title: conceptName,
      grade: 9,
      order: definitions.length + 1,
      unitOrder: unitConcepts.length + 1,
      routeConceptId: unit.routeConceptId,
      bootstrapConceptId: unit.routeConceptId,
      prerequisiteConceptIds: [...new Set(prerequisiteConceptIds)],
      nextConceptIds: [],
      bootstrapProblemIds: [],
      basicProblemFamilyIds: [],
      enabled: true,
    };
    if (previous) previous.nextConceptIds.push(conceptId);
    definitions.push(definition);
    return definition;
  }

  addConcept("m3-real-numbers", "m3_sqrt_meaning", "제곱근의 뜻", ["integers_rationals"]);
  addConcept("m3-real-numbers", "m3_sqrt_value", "제곱근의 값", ["m3_sqrt_meaning"]);
  addConcept("m3-real-numbers", "m3_irrational_number", "무리수와 실수", ["m3_sqrt_meaning"]);
  addConcept("m3-real-numbers", "m3_radical_simplification", "근호 안의 수 정리", ["m3_sqrt_value"]);
  addConcept("m3-real-numbers", "m3_radical_operations", "근호를 포함한 식의 계산", ["m3_radical_simplification"]);

  addConcept("m3-factorization", "m3_polynomial_multiplication", "다항식의 곱셈", ["expression"]);
  addConcept("m3-factorization", "m3_multiplication_formula", "곱셈 공식", ["m3_polynomial_multiplication"]);
  addConcept("m3-factorization", "m3_common_factor", "공통인수로 묶기", ["expression"]);
  addConcept("m3-factorization", "m3_factor_sum_product", "합과 곱을 이용한 인수분해", ["m3_common_factor", "m3_multiplication_formula"]);
  addConcept("m3-factorization", "m3_factor_difference_squares", "제곱의 차 인수분해", ["m3_multiplication_formula"]);
  addConcept("m3-factorization", "m3_factor_perfect_square", "완전제곱식 인수분해", ["m3_multiplication_formula"]);

  addConcept("m3-quadratic-equation", "m3_quadratic_meaning", "이차방정식의 뜻", ["linear_equation"]);
  addConcept("m3-quadratic-equation", "m3_quadratic_factor_solve", "인수분해를 이용한 풀이", ["m3_factor_sum_product"]);
  addConcept("m3-quadratic-equation", "m3_quadratic_sqrt_solve", "제곱근을 이용한 풀이", ["m3_sqrt_value"]);
  addConcept("m3-quadratic-equation", "m3_quadratic_formula", "근의 공식", ["m3_quadratic_meaning", "m3_radical_simplification"]);
  addConcept("m3-quadratic-equation", "m3_quadratic_root_meaning", "이차방정식의 해 확인", ["m3_quadratic_factor_solve"]);
  addConcept("m3-quadratic-equation", "m3_quadratic_word_setup", "활용 문제의 식 세우기", ["m3_quadratic_meaning"]);

  addConcept("m3-quadratic-function", "m3_quadratic_function_meaning", "이차함수의 뜻", ["m3_quadratic_root_meaning"]);
  addConcept("m3-quadratic-function", "m3_quadratic_graph_shape", "그래프의 모양과 방향", ["coordinate_plane", "m3_quadratic_function_meaning"]);
  addConcept("m3-quadratic-function", "m3_quadratic_vertex_axis", "꼭짓점과 축", ["m3_quadratic_graph_shape"]);
  addConcept("m3-quadratic-function", "m3_quadratic_translation", "이차함수 그래프의 평행이동", ["m3_quadratic_vertex_axis"]);
  addConcept("m3-quadratic-function", "m3_quadratic_find_formula", "조건으로 식 구하기", ["m3_quadratic_translation"]);
  addConcept("m3-quadratic-function", "m3_quadratic_max_min", "최댓값과 최솟값", ["m3_quadratic_vertex_axis"]);

  addConcept("m3-pythagorean", "m3_pythagorean_meaning", "피타고라스 정리의 뜻", ["basic_geometry", "m3_sqrt_value"]);
  addConcept("m3-pythagorean", "m3_pythagorean_hypotenuse", "빗변의 길이 구하기", ["m3_pythagorean_meaning"]);
  addConcept("m3-pythagorean", "m3_pythagorean_leg", "직각변의 길이 구하기", ["m3_pythagorean_meaning"]);
  addConcept("m3-pythagorean", "m3_pythagorean_converse", "피타고라스 정리의 역", ["m3_pythagorean_meaning"]);
  addConcept("m3-pythagorean", "m3_coordinate_distance", "좌표평면에서 거리 구하기", ["coordinate_plane", "m3_pythagorean_meaning"]);

  addConcept("m3-trigonometric-ratio", "m3_trig_meaning", "삼각비의 뜻", ["ratio", "m3_pythagorean_meaning"]);
  addConcept("m3-trigonometric-ratio", "m3_trig_sine", "사인", ["m3_trig_meaning"]);
  addConcept("m3-trigonometric-ratio", "m3_trig_cosine", "코사인", ["m3_trig_meaning"]);
  addConcept("m3-trigonometric-ratio", "m3_trig_tangent", "탄젠트", ["m3_trig_meaning"]);
  addConcept("m3-trigonometric-ratio", "m3_trig_length", "삼각비로 길이 구하기", ["m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent"]);

  addConcept("m3-circle", "m3_circle_chord", "현과 중심의 거리", ["basic_geometry"]);
  addConcept("m3-circle", "m3_circle_tangent_radius", "접선과 반지름", ["basic_geometry"]);
  addConcept("m3-circle", "m3_circle_central_inscribed", "중심각과 원주각", ["basic_geometry"]);
  addConcept("m3-circle", "m3_circle_same_arc", "같은 호의 원주각", ["m3_circle_central_inscribed"]);
  addConcept("m3-circle", "m3_circle_tangent_segments", "원 밖의 한 점에서 그은 접선", ["m3_circle_tangent_radius"]);

  addConcept("m3-statistics-probability", "m3_statistics_mean", "평균", ["average_data"]);
  addConcept("m3-statistics-probability", "m3_statistics_median_mode", "중앙값과 최빈값", ["statistics_intro"]);
  addConcept("m3-statistics-probability", "m3_statistics_variance", "분산", ["m3_statistics_mean"]);
  addConcept("m3-statistics-probability", "m3_statistics_standard_deviation", "표준편차", ["m3_statistics_variance", "m3_sqrt_value"]);
  addConcept("m3-statistics-probability", "m3_probability_basic", "기본 확률", ["probability"]);

  const problems = [];

  function addProblem(conceptId, familySuffix, questionText, answer, choices) {
    const definition = definitions.find((item) => item.conceptId === conceptId);
    const familyId = `${conceptId}:${familySuffix}`;
    definition.basicProblemFamilyIds.push(familyId);
    problems.push({
      id: `m3-detail-${conceptId}-${familySuffix}`,
      questionId: `m3-detail-${conceptId}-${familySuffix}`,
      conceptId,
      unitId: definition.unitId,
      unit: definition.unitTitle,
      concept: definition.conceptName,
      problemFamilyId: familyId,
      problemType: "choice",
      questionType: "choice",
      questionText,
      problem: questionText,
      answer: String(answer),
      choices: choices.map(String),
      difficulty: 1,
      adaptiveLevel: 1,
      estimatedSolveTime: 45,
      prerequisiteConcepts: definition.prerequisiteConceptIds,
      explanation: `${definition.conceptName}의 기본 개념을 확인하는 문제입니다.`,
      isRepresentative: false,
      grade: "중등 3학년",
      bank: "m3-detail",
    });
  }

  addProblem("m3_sqrt_meaning", "definition", "제곱해서 25가 되는 양수는?", "5", ["3", "4", "5", "25"]);
  addProblem("m3_sqrt_meaning", "two-roots", "제곱근이 4와 -4인 수는?", "16", ["4", "8", "16", "-16"]);
  addProblem("m3_sqrt_value", "principal", "√81의 값은?", "9", ["-9", "8", "9", "81"]);
  addProblem("m3_sqrt_value", "negative-outside", "-√49의 값은?", "-7", ["-49", "-7", "7", "49"]);
  addProblem("m3_irrational_number", "identify", "다음 중 무리수는?", "√2", ["0.5", "1/3", "√2", "4"]);
  addProblem("m3_irrational_number", "classification", "√9에 대한 설명으로 알맞은 것은?", "유리수이다", ["무리수이다", "유리수이다", "실수가 아니다", "정수가 아니다"]);
  addProblem("m3_radical_simplification", "factor-square", "√12를 가장 간단히 나타내면?", "2√3", ["3√2", "4√3", "2√3", "6"]);
  addProblem("m3_radical_simplification", "divide-radical", "√50을 간단히 하면?", "5√2", ["2√5", "5√2", "10√5", "25√2"]);
  addProblem("m3_radical_operations", "addition", "2√3 + 5√3의 값은?", "7√3", ["7√6", "10√3", "7√3", "3√3"]);
  addProblem("m3_radical_operations", "multiplication", "√6 × √24의 값은?", "12", ["6", "12", "24", "30"]);

  addProblem("m3_polynomial_multiplication", "monomial", "3x(x + 2)를 전개하면?", "3x² + 6x", ["3x² + 2x", "3x² + 6x", "6x²", "3x + 6"]);
  addProblem("m3_polynomial_multiplication", "binomial", "(x + 2)(x + 3)을 전개하면?", "x² + 5x + 6", ["x² + 6x + 5", "x² + 5x + 6", "x² + 6", "2x² + 5x"]);
  addProblem("m3_multiplication_formula", "square-sum", "(x + 4)²을 전개하면?", "x² + 8x + 16", ["x² + 16", "x² + 4x + 16", "x² + 8x + 16", "x² - 8x + 16"]);
  addProblem("m3_multiplication_formula", "sum-difference", "(x + 5)(x - 5)를 전개하면?", "x² - 25", ["x² + 25", "x² - 10x - 25", "x² - 25", "x² + 10x - 25"]);
  addProblem("m3_common_factor", "number-factor", "6x + 12를 인수분해하면?", "6(x + 2)", ["2(3x + 12)", "6(x + 2)", "6x(x + 2)", "3(x + 4)"]);
  addProblem("m3_common_factor", "variable-factor", "x² + 3x를 인수분해하면?", "x(x + 3)", ["x(x² + 3)", "x(x + 3)", "(x + 1)(x + 3)", "3x(x + 1)"]);
  addProblem("m3_factor_sum_product", "positive-pair", "x² + 7x + 12를 인수분해하면?", "(x + 3)(x + 4)", ["(x + 2)(x + 6)", "(x + 3)(x + 4)", "(x - 3)(x - 4)", "(x + 1)(x + 12)"]);
  addProblem("m3_factor_sum_product", "mixed-sign", "x² - x - 6을 인수분해하면?", "(x - 3)(x + 2)", ["(x - 2)(x + 3)", "(x - 3)(x + 2)", "(x + 3)(x + 2)", "(x - 6)(x + 1)"]);
  addProblem("m3_factor_difference_squares", "numbers", "x² - 16을 인수분해하면?", "(x + 4)(x - 4)", ["(x - 4)²", "(x + 4)²", "(x + 4)(x - 4)", "x(x - 16)"]);
  addProblem("m3_factor_difference_squares", "coefficients", "9x² - 25를 인수분해하면?", "(3x + 5)(3x - 5)", ["(9x + 5)(x - 5)", "(3x + 5)(3x - 5)", "(3x - 5)²", "(9x + 25)(x - 1)"]);
  addProblem("m3_factor_perfect_square", "plus", "x² + 10x + 25를 인수분해하면?", "(x + 5)²", ["(x - 5)²", "(x + 5)²", "(x + 25)(x + 1)", "x(x + 10) + 25"]);
  addProblem("m3_factor_perfect_square", "minus", "4x² - 12x + 9를 인수분해하면?", "(2x - 3)²", ["(2x + 3)²", "(4x - 3)²", "(2x - 3)²", "(x - 3)(4x - 3)"]);

  addProblem("m3_quadratic_meaning", "identify", "다음 중 이차방정식은?", "x² - 3x + 2 = 0", ["2x + 1 = 0", "x² - 3x + 2 = 0", "1/x = 2", "y = x²"]);
  addProblem("m3_quadratic_meaning", "standard-form", "x² = 4x - 3을 우변이 0인 꼴로 나타내면?", "x² - 4x + 3 = 0", ["x² + 4x - 3 = 0", "x² - 4x + 3 = 0", "x² - 4x - 3 = 0", "x - 1 = 0"]);
  addProblem("m3_quadratic_factor_solve", "zero-product", "(x - 2)(x + 3) = 0의 해는?", "2, -3", ["-2, 3", "2, -3", "2, 3", "-2, -3"]);
  addProblem("m3_quadratic_factor_solve", "factor-first", "x² - 5x + 6 = 0의 해는?", "2, 3", ["-2, -3", "1, 6", "2, 3", "-1, -6"]);
  addProblem("m3_quadratic_sqrt_solve", "square-equals", "x² = 36의 해는?", "6, -6", ["6", "-6", "6, -6", "36, -36"]);
  addProblem("m3_quadratic_sqrt_solve", "shifted-square", "(x - 1)² = 9의 해는?", "4, -2", ["3, -3", "4, -2", "10, -8", "4"]);
  addProblem("m3_quadratic_formula", "formula-choice", "ax² + bx + c = 0의 근의 공식은?", "(-b ± √(b²-4ac))/(2a)", ["(b ± √(b²-4ac))/(2a)", "(-b ± √(b²-4ac))/(2a)", "(-b ± √(b²+4ac))/(2a)", "(-b ± √(b²-4ac))/a"]);
  addProblem("m3_quadratic_formula", "apply", "x² + x - 1 = 0의 해는?", "(-1 ± √5)/2", ["(1 ± √5)/2", "(-1 ± √5)/2", "(-1 ± √3)/2", "-1 ± √5"]);
  addProblem("m3_quadratic_root_meaning", "substitute", "x = 2가 x² - 3x + k = 0의 해일 때 k는?", "2", ["-2", "1", "2", "4"]);
  addProblem("m3_quadratic_root_meaning", "verify", "다음 중 x² - 4 = 0의 해가 아닌 것은?", "0", ["2", "-2", "0", "2와 -2"]);
  addProblem("m3_quadratic_word_setup", "rectangle", "가로가 x, 세로가 x + 2인 직사각형의 넓이가 48일 때 식은?", "x(x + 2) = 48", ["x + x + 2 = 48", "2x(x + 2) = 48", "x(x + 2) = 48", "x² + 2 = 48"]);
  addProblem("m3_quadratic_word_setup", "consecutive", "연속한 두 자연수의 곱이 72이다. 작은 수를 x라 할 때 식은?", "x(x + 1) = 72", ["x + x + 1 = 72", "x(x + 1) = 72", "2x + 1 = 72", "x² + 1 = 72"]);

  addProblem("m3_quadratic_function_meaning", "identify", "다음 중 y가 x의 이차함수인 것은?", "y = 2x² - 1", ["y = 2x + 1", "y = 2x² - 1", "y = 2/x", "x² + y² = 1"]);
  addProblem("m3_quadratic_function_meaning", "value", "y = x² + 1에서 x = 3일 때 y는?", "10", ["7", "9", "10", "16"]);
  addProblem("m3_quadratic_graph_shape", "direction", "y = -2x²의 그래프가 열린 방향은?", "아래쪽", ["위쪽", "아래쪽", "오른쪽", "왼쪽"]);
  addProblem("m3_quadratic_graph_shape", "width", "y = x²과 비교할 때 y = 3x²의 그래프는?", "폭이 더 좁다", ["폭이 더 넓다", "폭이 더 좁다", "모양이 직선이다", "아래쪽으로 열린다"]);
  addProblem("m3_quadratic_vertex_axis", "vertex", "y = (x - 2)² + 3의 꼭짓점은?", "(2, 3)", ["(-2, 3)", "(2, -3)", "(2, 3)", "(0, 3)"]);
  addProblem("m3_quadratic_vertex_axis", "axis", "y = (x + 4)² - 1의 축의 방정식은?", "x = -4", ["x = 4", "y = -4", "x = -4", "y = 4"]);
  addProblem("m3_quadratic_translation", "horizontal", "y = x²의 그래프를 오른쪽으로 3만큼 옮긴 식은?", "y = (x - 3)²", ["y = (x + 3)²", "y = (x - 3)²", "y = x² + 3", "y = x² - 3"]);
  addProblem("m3_quadratic_translation", "vertical", "y = x²의 그래프를 아래로 2만큼 옮긴 식은?", "y = x² - 2", ["y = x² + 2", "y = (x - 2)²", "y = x² - 2", "y = (x + 2)²"]);
  addProblem("m3_quadratic_find_formula", "vertex-point", "꼭짓점이 (1, 2)이고 점 (2, 3)을 지나는 이차함수는?", "y = (x - 1)² + 2", ["y = (x + 1)² + 2", "y = (x - 1)² + 2", "y = 2(x - 1)² + 2", "y = (x - 2)² + 1"]);
  addProblem("m3_quadratic_find_formula", "axis-intercept", "축이 x = 0이고 점 (1, 2)를 지나는 y = ax²의 식은?", "y = 2x²", ["y = x² + 2", "y = 2x²", "y = x² - 2", "y = -2x²"]);
  addProblem("m3_quadratic_max_min", "minimum", "y = (x - 3)² + 1의 최솟값은?", "1", ["-3", "0", "1", "3"]);
  addProblem("m3_quadratic_max_min", "maximum", "y = -(x + 2)² + 5의 최댓값은?", "5", ["-5", "-2", "2", "5"]);

  addProblem("m3_pythagorean_meaning", "formula", "직각삼각형의 두 직각변이 a, b이고 빗변이 c일 때 성립하는 식은?", "a² + b² = c²", ["a + b = c", "a² + b² = c²", "a² - b² = c²", "ab = c²"]);
  addProblem("m3_pythagorean_meaning", "identify-hypotenuse", "직각삼각형에서 빗변은 어느 변인가?", "직각의 맞은편 변", ["가장 짧은 변", "직각을 이루는 변", "직각의 맞은편 변", "밑변으로 그린 변"]);
  addProblem("m3_pythagorean_hypotenuse", "triple", "두 직각변의 길이가 3, 4일 때 빗변의 길이는?", "5", ["4", "5", "6", "7"]);
  addProblem("m3_pythagorean_hypotenuse", "square-diagonal", "한 변의 길이가 2인 정사각형의 대각선 길이는?", "2√2", ["2", "√2", "2√2", "4"]);
  addProblem("m3_pythagorean_leg", "subtract-squares", "빗변이 13이고 한 직각변이 5일 때 다른 직각변은?", "12", ["8", "10", "12", "18"]);
  addProblem("m3_pythagorean_leg", "isosceles-right", "빗변이 6√2인 직각이등변삼각형의 한 직각변은?", "6", ["3", "6", "6√2", "12"]);
  addProblem("m3_pythagorean_converse", "is-right", "세 변의 길이가 6, 8, 10인 삼각형은?", "직각삼각형", ["예각삼각형", "직각삼각형", "둔각삼각형", "정삼각형"]);
  addProblem("m3_pythagorean_converse", "not-right", "세 변의 길이가 2, 3, 4인 삼각형에 대한 설명은?", "직각삼각형이 아니다", ["직각삼각형이다", "직각삼각형이 아니다", "삼각형이 아니다", "정삼각형이다"]);
  addProblem("m3_coordinate_distance", "origin", "좌표평면에서 원점과 점 (3, 4) 사이의 거리는?", "5", ["4", "5", "6", "7"]);
  addProblem("m3_coordinate_distance", "two-points", "두 점 (1, 1), (4, 5) 사이의 거리는?", "5", ["4", "5", "6", "7"]);

  addProblem("m3_trig_meaning", "opposite", "직각삼각형에서 한 예각의 맞은편에 있는 변은?", "높이", ["밑변", "높이", "빗변", "중선"]);
  addProblem("m3_trig_meaning", "ratio-choice", "삼각비를 정할 때 기준이 되는 것은?", "선택한 예각", ["삼각형의 넓이", "선택한 예각", "빗변의 위치", "도형의 둘레"]);
  addProblem("m3_trig_sine", "definition", "직각삼각형에서 sin θ는?", "높이/빗변", ["밑변/빗변", "높이/빗변", "높이/밑변", "빗변/높이"]);
  addProblem("m3_trig_sine", "three-four-five", "빗변이 5이고 θ의 맞은편 변이 3일 때 sin θ는?", "3/5", ["3/4", "3/5", "4/5", "5/3"]);
  addProblem("m3_trig_cosine", "definition", "직각삼각형에서 cos θ는?", "밑변/빗변", ["밑변/빗변", "높이/빗변", "높이/밑변", "빗변/밑변"]);
  addProblem("m3_trig_cosine", "five-twelve-thirteen", "빗변이 13이고 θ에 이웃한 직각변이 12일 때 cos θ는?", "12/13", ["5/13", "12/13", "5/12", "13/12"]);
  addProblem("m3_trig_tangent", "definition", "직각삼각형에서 tan θ는?", "높이/밑변", ["밑변/빗변", "높이/빗변", "높이/밑변", "빗변/높이"]);
  addProblem("m3_trig_tangent", "ratio", "θ의 맞은편 변이 8, 이웃한 직각변이 6일 때 tan θ는?", "4/3", ["3/4", "4/3", "7/4", "8/7"]);
  addProblem("m3_trig_length", "use-tangent", "tan θ = 3/4이고 θ에 이웃한 직각변이 8일 때 맞은편 변의 길이는?", "6", ["4", "6", "8", "12"]);
  addProblem("m3_trig_length", "use-sine", "sin θ = 1/2이고 빗변이 10일 때 θ의 맞은편 변의 길이는?", "5", ["2", "5", "10", "20"]);

  addProblem("m3_circle_chord", "perpendicular", "원의 중심에서 현에 내린 수선은 그 현을 어떻게 나누는가?", "이등분한다", ["삼등분한다", "이등분한다", "나누지 않는다", "항상 1:2로 나눈다"]);
  addProblem("m3_circle_chord", "equal-chords", "한 원에서 길이가 같은 두 현은 중심에서의 거리가 어떠한가?", "같다", ["다르다", "같다", "두 배이다", "알 수 없다"]);
  addProblem("m3_circle_tangent_radius", "right-angle", "원의 접점에서 반지름과 접선이 이루는 각은?", "90°", ["30°", "45°", "90°", "180°"]);
  addProblem("m3_circle_tangent_radius", "identify", "직선 l이 원 O의 한 점 P에서 접할 때 OP와 l의 관계는?", "서로 수직", ["서로 평행", "서로 수직", "길이가 같다", "서로 만나지 않는다"]);
  addProblem("m3_circle_central_inscribed", "double", "같은 호에 대한 원주각이 35°일 때 중심각은?", "70°", ["35°", "55°", "70°", "105°"]);
  addProblem("m3_circle_central_inscribed", "half", "같은 호에 대한 중심각이 120°일 때 원주각은?", "60°", ["30°", "60°", "120°", "240°"]);
  addProblem("m3_circle_same_arc", "equal", "같은 원에서 같은 호에 대한 두 원주각의 크기는?", "같다", ["항상 다르다", "같다", "합이 90°이다", "합이 180°이다"]);
  addProblem("m3_circle_same_arc", "semicircle", "지름을 한 변으로 하는 원주각의 크기는?", "90°", ["45°", "60°", "90°", "180°"]);
  addProblem("m3_circle_tangent_segments", "equal-length", "원 밖의 한 점 P에서 그은 두 접선의 접점을 A, B라 할 때 옳은 것은?", "PA = PB", ["PA > PB", "PA < PB", "PA = PB", "PA + PB = 0"]);
  addProblem("m3_circle_tangent_segments", "find-length", "원 밖의 한 점에서 그은 두 접선의 길이가 각각 x + 2, 8일 때 x는?", "6", ["4", "6", "8", "10"]);

  addProblem("m3_statistics_mean", "calculate", "자료 2, 4, 6, 8의 평균은?", "5", ["4", "5", "6", "20"]);
  addProblem("m3_statistics_mean", "missing-value", "세 수 3, 5, x의 평균이 6일 때 x는?", "10", ["6", "8", "10", "18"]);
  addProblem("m3_statistics_median_mode", "median", "자료 1, 3, 4, 8, 9의 중앙값은?", "4", ["3", "4", "5", "8"]);
  addProblem("m3_statistics_median_mode", "mode", "자료 2, 3, 3, 4, 5의 최빈값은?", "3", ["2", "3", "4", "5"]);
  addProblem("m3_statistics_variance", "zero", "모든 자료의 값이 5로 같을 때 분산은?", "0", ["0", "1", "5", "25"]);
  addProblem("m3_statistics_variance", "compare", "평균이 같은 두 자료 중 값들이 평균에서 더 멀리 퍼진 자료의 분산은?", "더 크다", ["더 작다", "더 크다", "항상 같다", "0이다"]);
  addProblem("m3_statistics_standard_deviation", "root", "분산이 16일 때 표준편차는?", "4", ["2", "4", "8", "16"]);
  addProblem("m3_statistics_standard_deviation", "meaning", "표준편차가 작다는 뜻으로 알맞은 것은?", "자료가 평균 가까이에 모여 있다", ["자료가 평균 가까이에 모여 있다", "평균이 반드시 크다", "자료 수가 적다", "모든 값이 음수이다"]);
  addProblem("m3_probability_basic", "coin", "공정한 동전 한 개를 던질 때 앞면이 나올 확률은?", "1/2", ["0", "1/4", "1/2", "1"]);
  addProblem("m3_probability_basic", "die", "공정한 주사위 한 개를 던질 때 3의 배수가 나올 확률은?", "1/3", ["1/6", "1/3", "1/2", "2/3"]);

  addProblem("m3_sqrt_meaning", "signed-pair", "36의 제곱근을 모두 고르면?", "6과 -6", ["6", "-6", "6과 -6", "18과 -18"]);
  addProblem("m3_sqrt_meaning", "reverse-square", "제곱근이 7과 -7인 수를 구하면?", "49", ["7", "14", "49", "-49"]);
  addProblem("m3_sqrt_value", "decimal-root", "0.04의 양의 제곱근을 소수로 나타내면?", "0.2", ["0.02", "0.2", "0.4", "2"]);
  addProblem("m3_sqrt_value", "square-root-square", "(√13)²의 값은?", "13", ["√13", "6.5", "13", "169"]);
  addProblem("m3_irrational_number", "pi", "다음 수 중 유리수가 아닌 것은?", "π", ["-2", "0.25", "3/7", "π"]);
  addProblem("m3_irrational_number", "real-number-set", "실수 전체를 이루는 두 종류의 수는?", "유리수와 무리수", ["자연수와 정수", "양수와 자연수", "유리수와 무리수", "분수와 소수"]);
  addProblem("m3_radical_simplification", "extract-nine", "√27을 간단히 나타내면?", "3√3", ["3√3", "9√3", "√9", "27√3"]);
  addProblem("m3_radical_simplification", "extract-thirty-six", "√72를 근호 밖으로 정리하면?", "6√2", ["2√6", "6√2", "8√2", "36√2"]);
  addProblem("m3_radical_operations", "subtraction", "3√2 - √2를 계산하면?", "2√2", ["2", "2√2", "3", "4√2"]);
  addProblem("m3_radical_operations", "division", "√8 ÷ √2의 값은?", "2", ["√2", "2", "4", "√6"]);

  addProblem("m3_polynomial_multiplication", "distribution", "2x(3x - 1)을 전개한 식은?", "6x² - 2x", ["6x² - 2x", "5x²", "6x - 2", "6x² - x"]);
  addProblem("m3_polynomial_multiplication", "two-binomial", "(x - 1)(x + 4)를 전개하면?", "x² + 3x - 4", ["x² + 5x - 4", "x² + 3x - 4", "x² - 3x - 4", "x² + 4"]);
  addProblem("m3_multiplication_formula", "square-minus", "(x - 3)²을 전개한 결과는?", "x² - 6x + 9", ["x² - 9", "x² - 3x + 9", "x² - 6x + 9", "x² + 6x + 9"]);
  addProblem("m3_multiplication_formula", "coefficient-square", "(2x + 1)²을 전개하면?", "4x² + 4x + 1", ["4x² + 1", "4x² + 2x + 1", "4x² + 4x + 1", "2x² + 4x + 1"]);
  addProblem("m3_common_factor", "negative-term", "8x² - 4x를 공통인수로 묶으면?", "4x(2x - 1)", ["4(2x² - x)", "4x(2x - 1)", "8x(x - 1)", "2x(4x - 1)"]);
  addProblem("m3_common_factor", "three-terms", "3x² + 6x + 9의 공통인수를 묶으면?", "3(x² + 2x + 3)", ["3(x² + 2x + 3)", "3x(x + 2 + 3)", "6(x² + x + 3)", "9(x² + 2x + 1)"]);
  addProblem("m3_factor_sum_product", "negative-sum", "x² - 7x + 10의 인수분해는?", "(x - 5)(x - 2)", ["(x + 5)(x + 2)", "(x - 5)(x - 2)", "(x - 10)(x + 1)", "(x - 7)(x - 3)"]);
  addProblem("m3_factor_sum_product", "constant-negative", "x² + 2x - 15를 인수분해하면?", "(x + 5)(x - 3)", ["(x - 5)(x + 3)", "(x + 5)(x - 3)", "(x + 15)(x - 1)", "(x - 5)(x - 3)"]);
  addProblem("m3_factor_difference_squares", "variables", "a² - b²의 인수분해는?", "(a + b)(a - b)", ["(a - b)²", "(a + b)²", "(a + b)(a - b)", "a(a - b)"]);
  addProblem("m3_factor_difference_squares", "scaled", "25x² - 4와 같은 곱셈식은?", "(5x + 2)(5x - 2)", ["(5x - 2)²", "(25x + 2)(x - 2)", "(5x + 2)(5x - 2)", "(5x + 4)(5x - 1)"]);
  addProblem("m3_factor_perfect_square", "recognize", "x² + 6x + 9와 같은 식은?", "(x + 3)²", ["(x - 3)²", "(x + 3)²", "(x + 9)(x + 1)", "x(x + 6) + 3"]);
  addProblem("m3_factor_perfect_square", "leading-nine", "9x² + 12x + 4를 인수분해하면?", "(3x + 2)²", ["(3x - 2)²", "(9x + 2)²", "(3x + 2)²", "(x + 2)(9x + 2)"]);

  addProblem("m3_quadratic_meaning", "coefficient", "3x² - 2x + 1 = 0에서 이차항의 계수는?", "3", ["-2", "1", "2", "3"]);
  addProblem("m3_quadratic_meaning", "not-quadratic", "다음 중 이차방정식이 아닌 것은?", "x² + y = 3", ["x² - 1 = 0", "2x² + x = 5", "x² + y = 3", "(x - 1)(x + 2) = 0"]);
  addProblem("m3_quadratic_factor_solve", "common-x", "x² - 4x = 0의 해는?", "0, 4", ["-4, 0", "0, 4", "2, -2", "4"]);
  addProblem("m3_quadratic_factor_solve", "perfect-square-root", "x² + 6x + 9 = 0의 해는?", "-3", ["3", "-3", "3, -3", "-9"]);
  addProblem("m3_quadratic_sqrt_solve", "square-shift-plus", "(x + 2)² = 16의 해는?", "2, -6", ["4, -4", "2, -6", "6, -2", "2"]);
  addProblem("m3_quadratic_sqrt_solve", "coefficient-square", "4x² = 25의 해는?", "5/2, -5/2", ["5, -5", "5/2, -5/2", "25/4", "5/4, -5/4"]);
  addProblem("m3_quadratic_formula", "negative-b", "x² - 2x - 1 = 0을 근의 공식으로 풀면?", "1 ± √2", ["-1 ± √2", "1 ± √2", "2 ± √2", "1 ± 2√2"]);
  addProblem("m3_quadratic_formula", "two-a", "2x² + x - 1 = 0의 해는?", "1/2, -1", ["-1/2, 1", "1/2, -1", "1, -2", "2, -1"]);
  addProblem("m3_quadratic_root_meaning", "parameter", "x = -1이 x² + kx - 2 = 0의 해일 때 k는?", "-1", ["-3", "-1", "1", "3"]);
  addProblem("m3_quadratic_root_meaning", "solution-check", "x = 3을 대입했을 때 참이 되는 방정식은?", "x² - 9 = 0", ["x² - 3 = 0", "x² - 9 = 0", "x² + 9 = 0", "x² - x - 3 = 0"]);
  addProblem("m3_quadratic_word_setup", "square-area", "한 변의 길이가 x + 1인 정사각형의 넓이가 25일 때 식은?", "(x + 1)² = 25", ["2(x + 1) = 25", "4(x + 1) = 25", "(x + 1)² = 25", "x² + 1 = 25"]);
  addProblem("m3_quadratic_word_setup", "number-square", "어떤 양수 x의 제곱이 x의 6배보다 16만큼 클 때 식은?", "x² = 6x + 16", ["2x = 6x + 16", "x² = 6x + 16", "x² + 6x = 16", "x = 6x² + 16"]);

  addProblem("m3_quadratic_function_meaning", "coefficient-nonzero", "y = ax²이 이차함수가 되기 위한 a의 조건은?", "a ≠ 0", ["a = 0", "a > 0", "a < 0", "a ≠ 0"]);
  addProblem("m3_quadratic_function_meaning", "table-value", "y = -x²에서 x = -2일 때 y는?", "-4", ["-4", "-2", "2", "4"]);
  addProblem("m3_quadratic_graph_shape", "positive-a", "계수 a가 양수일 때 y = ax²의 그래프는 어느 방향으로 열리는가?", "위쪽", ["위쪽", "아래쪽", "오른쪽", "왼쪽"]);
  addProblem("m3_quadratic_graph_shape", "absolute-coefficient", "y = -4x²과 y = -x² 중 폭이 더 좁은 그래프는?", "y = -4x²", ["y = -4x²", "y = -x²", "두 그래프가 같다", "판단할 수 없다"]);
  addProblem("m3_quadratic_vertex_axis", "origin-vertex", "y = -3x²의 꼭짓점은?", "(0, 0)", ["(-3, 0)", "(0, -3)", "(0, 0)", "(3, 0)"]);
  addProblem("m3_quadratic_vertex_axis", "read-axis", "꼭짓점이 (-2, 5)인 이차함수 그래프의 축은?", "x = -2", ["x = 2", "x = -2", "y = 5", "y = -2"]);
  addProblem("m3_quadratic_translation", "left-up", "y = x²을 왼쪽으로 1, 위로 4만큼 옮긴 식은?", "y = (x + 1)² + 4", ["y = (x - 1)² + 4", "y = (x + 1)² + 4", "y = (x + 4)² + 1", "y = x² + 5"]);
  addProblem("m3_quadratic_translation", "identify-shift", "y = (x - 5)² - 2는 y = x²을 어떻게 옮긴 것인가?", "오른쪽 5, 아래 2", ["왼쪽 5, 아래 2", "오른쪽 5, 아래 2", "오른쪽 2, 아래 5", "왼쪽 2, 위 5"]);
  addProblem("m3_quadratic_find_formula", "vertex-coefficient", "y = ax²의 그래프가 점 (2, 8)을 지날 때 그 식은?", "y = 2x²", ["y = x²", "y = 2x²", "y = 4x²", "y = -2x²"]);
  addProblem("m3_quadratic_find_formula", "given-form", "y = a(x + 1)² - 2가 점 (0, 1)을 지날 때 a는?", "3", ["1", "2", "3", "-3"]);
  addProblem("m3_quadratic_max_min", "vertex-min", "y = 2(x + 1)² - 3의 최솟값은?", "-3", ["-3", "-1", "1", "3"]);
  addProblem("m3_quadratic_max_min", "vertex-max", "y = -3(x - 1)² + 7의 최댓값을 구하면?", "7", ["-7", "1", "3", "7"]);

  addProblem("m3_pythagorean_meaning", "area-relation", "직각삼각형에서 빗변을 한 변으로 하는 정사각형의 넓이는?", "두 직각변 위 정사각형 넓이의 합", ["두 직각변 길이의 합", "두 직각변 위 정사각형 넓이의 합", "삼각형 넓이의 두 배", "빗변 길이와 같다"]);
  addProblem("m3_pythagorean_meaning", "right-angle-condition", "a² + b² = c²이고 c가 가장 긴 변일 때 이 삼각형은?", "직각삼각형", ["정삼각형", "직각삼각형", "둔각삼각형", "이등변삼각형"]);
  addProblem("m3_pythagorean_hypotenuse", "ladder", "벽에서 6m 떨어진 곳에 사다리 밑을 두고 높이 8m 지점에 닿았다. 사다리 길이는?", "10m", ["8m", "10m", "12m", "14m"]);
  addProblem("m3_pythagorean_hypotenuse", "rectangle-diagonal", "가로 5, 세로 12인 직사각형의 대각선 길이는?", "13", ["7", "13", "17", "60"]);
  addProblem("m3_pythagorean_leg", "height", "빗변이 10이고 밑변이 8인 직각삼각형의 높이는?", "6", ["2", "6", "8", "18"]);
  addProblem("m3_pythagorean_leg", "unknown-side", "빗변이 17이고 한 직각변이 15일 때 나머지 변은?", "8", ["2", "8", "16", "32"]);
  addProblem("m3_pythagorean_converse", "obtuse-check", "가장 긴 변이 6인 삼각형의 다른 두 변이 2, 3일 때 2² + 3²과 6²의 관계는?", "2² + 3² < 6²", ["2² + 3² = 6²", "2² + 3² < 6²", "2² + 3² > 6²", "비교할 수 없다"]);
  addProblem("m3_pythagorean_converse", "right-set", "다음 중 직각삼각형을 이루는 세 변은?", "9, 12, 15", ["4, 5, 6", "5, 6, 7", "9, 12, 15", "10, 10, 10"]);
  addProblem("m3_coordinate_distance", "horizontal-vertical", "점 (2, -1)에서 오른쪽으로 3, 위로 4 이동한 점까지의 거리는?", "5", ["4", "5", "7", "12"]);
  addProblem("m3_coordinate_distance", "symmetric-points", "점 (-2, 0)에서 점 (2, 3)으로 이동할 때 가로 변화와 세로 변화를 이용해 구한 거리는?", "5", ["3", "4", "5", "7"]);

  addProblem("m3_trig_meaning", "fixed-angle", "닮은 직각삼각형에서 같은 예각에 대한 삼각비는?", "항상 같다", ["항상 같다", "크기에 따라 달라진다", "넓이에 따라 달라진다", "항상 1이다"]);
  addProblem("m3_trig_meaning", "three-ratios", "삼각비에 포함되는 세 비는?", "sin, cos, tan", ["sin, cos, tan", "sin, log, tan", "cos, 평균, tan", "넓이, 둘레, 높이"]);
  addProblem("m3_trig_sine", "thirty-degree", "sin 30°의 값은?", "1/2", ["1/3", "1/2", "√2/2", "√3/2"]);
  addProblem("m3_trig_sine", "opposite-find", "sin θ = 3/5이고 빗변이 20일 때 높이는?", "12", ["8", "12", "15", "20"]);
  addProblem("m3_trig_cosine", "sixty-degree", "cos 60°의 값은?", "1/2", ["1/3", "1/2", "√2/2", "√3/2"]);
  addProblem("m3_trig_cosine", "adjacent-find", "cos θ = 4/5이고 빗변이 15일 때 밑변은?", "12", ["3", "9", "12", "15"]);
  addProblem("m3_trig_tangent", "fortyfive", "tan 45°의 값은?", "1", ["0", "1/2", "1", "√2"]);
  addProblem("m3_trig_tangent", "height-base", "높이가 9, 밑변이 12인 직각삼각형에서 tan θ는?", "3/4", ["3/4", "4/3", "3/5", "4/5"]);
  addProblem("m3_trig_length", "shadow", "막대의 그림자가 4m이고 태양의 고도에 대한 tan 값이 3/2일 때 막대 높이는?", "6m", ["2m", "4m", "6m", "8m"]);
  addProblem("m3_trig_length", "cos-length", "cos θ = 3/5이고 빗변이 25일 때 밑변 길이는?", "15", ["10", "15", "20", "25"]);

  addProblem("m3_circle_chord", "closer-longer", "한 원에서 중심에 더 가까운 현은 다른 현보다 길이가 어떠한가?", "더 길다", ["더 짧다", "더 길다", "항상 같다", "알 수 없다"]);
  addProblem("m3_circle_chord", "half-chord", "중심에서 현 AB에 내린 수선의 발이 M이고 AB = 12일 때 AM은?", "6", ["3", "6", "12", "24"]);
  addProblem("m3_circle_tangent_radius", "tangent-test", "원의 점 P에서 OP와 수직인 직선은 원과 어떤 관계인가?", "P에서의 접선", ["P에서의 접선", "지름", "현", "할선"]);
  addProblem("m3_circle_tangent_radius", "angle-variable", "접점에서 반지름과 접선이 이루는 각을 x라 할 때 x는?", "90°", ["45°", "60°", "90°", "120°"]);
  addProblem("m3_circle_central_inscribed", "central-from-inscribed", "같은 호를 보는 원주각이 42°이면 중심각은?", "84°", ["21°", "42°", "84°", "138°"]);
  addProblem("m3_circle_central_inscribed", "inscribed-from-central", "중심각이 150°인 호를 보는 원주각은?", "75°", ["50°", "75°", "100°", "150°"]);
  addProblem("m3_circle_same_arc", "angle-copy", "같은 호 AB를 보는 원주각 하나가 28°일 때 다른 원주각은?", "28°", ["14°", "28°", "56°", "152°"]);
  addProblem("m3_circle_same_arc", "diameter-angle", "반원의 호를 보는 원주각은 몇 도인가?", "90°", ["45°", "60°", "90°", "180°"]);
  addProblem("m3_circle_tangent_segments", "algebra", "한 점에서 그은 두 접선의 길이가 2x - 1과 9일 때 x는?", "5", ["4", "5", "8", "10"]);
  addProblem("m3_circle_tangent_segments", "property-name", "원 밖의 한 점에서 같은 원에 그은 두 접선의 길이에 대한 성질은?", "서로 같다", ["서로 같다", "한쪽이 두 배이다", "합이 반지름이다", "항상 0이다"]);

  addProblem("m3_statistics_mean", "total-from-mean", "5개 자료의 평균이 8일 때 자료의 합은?", "40", ["13", "32", "40", "64"]);
  addProblem("m3_statistics_mean", "combined-total", "네 수의 합이 28일 때 평균은?", "7", ["4", "7", "24", "32"]);
  addProblem("m3_statistics_median_mode", "even-median", "자료 1, 2, 6, 9의 중앙값은?", "4", ["2", "4", "6", "9"]);
  addProblem("m3_statistics_median_mode", "no-mode", "자료 1, 2, 3, 4의 최빈값은?", "없다", ["1", "2", "4", "없다"]);
  addProblem("m3_statistics_variance", "definition", "분산은 각 자료와 평균의 편차를 어떻게 처리한 값인가?", "제곱한 값들의 평균", ["그대로 더한 값", "절댓값 중 최댓값", "제곱한 값들의 평균", "자료의 개수"]);
  addProblem("m3_statistics_variance", "shift", "모든 자료에 같은 수 3을 더하면 분산은 어떻게 되는가?", "변하지 않는다", ["3만큼 커진다", "9만큼 커진다", "변하지 않는다", "0이 된다"]);
  addProblem("m3_statistics_standard_deviation", "compare-spread", "두 자료의 평균이 같고 표준편차가 각각 2, 5일 때 더 고르게 모인 자료는?", "표준편차가 2인 자료", ["표준편차가 2인 자료", "표준편차가 5인 자료", "두 자료가 같다", "판단할 수 없다"]);
  addProblem("m3_statistics_standard_deviation", "variance-nine", "분산이 9인 자료의 표준편차는?", "3", ["1", "3", "9", "81"]);
  addProblem("m3_probability_basic", "cards", "1, 2, 3, 4가 적힌 카드 중 한 장을 뽑을 때 짝수가 나올 확률은?", "1/2", ["1/4", "1/2", "3/4", "1"]);
  addProblem("m3_probability_basic", "complement", "어떤 사건이 일어날 확률이 0.3일 때 일어나지 않을 확률은?", "0.7", ["0.3", "0.4", "0.7", "1.3"]);

  const conceptById = Object.fromEntries(definitions.map((definition) => [definition.conceptId, definition]));
  const conceptsByBootstrap = Object.fromEntries(UNIT_DEFINITIONS.map((unit) => [
    unit.routeConceptId,
    definitions.filter((definition) => definition.unitId === unit.unitId).map((definition) => definition.conceptId),
  ]));

  return {
    VERSION: 1,
    units: UNIT_DEFINITIONS,
    concepts: definitions,
    conceptById,
    conceptsByBootstrap,
    problems,
  };
});
