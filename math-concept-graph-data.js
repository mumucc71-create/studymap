(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_GRAPH = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "math-concept-graph-v1";
  const MINIMUM_GRADE_BAND = "G4";
  const MAXIMUM_GRADE_BAND = "H3";
  const GRADE_BANDS = Object.freeze(["G4", "G5", "G6", "M1", "M2", "M3", "H1", "H2", "H3"]);
  const DOMAINS = Object.freeze([
    "NUMBER_OPERATIONS",
    "ALGEBRA",
    "FUNCTIONS",
    "GEOMETRY",
    "STATISTICS_PROBABILITY",
    "CALCULUS",
  ]);
  const CONTENT_AVAILABILITY = Object.freeze([
    "COMPLETE_SPRING",
    "LEGACY_ONLY",
    "WORLD_CONTENT_ONLY",
    "LEVEL_TEST_ONLY",
    "NO_CONTENT",
  ]);
  const RUNTIME_AVAILABILITY = Object.freeze([
    "DEDICATED_SPRING",
    "LEGACY_RUNTIME",
    "WORLD_RUNTIME",
    "NO_RUNTIME",
  ]);

  const route = (worldIndex, topicIndex, worldId, chapterId, unitTitle, extra = {}) => Object.freeze({
    worldIndex,
    topicIndex,
    worldId,
    chapterId,
    unitTitle,
    ...extra,
  });

  const ROUTES = Object.freeze({
    large: route(0, 0, "numbers-operations", "numbers-operations-c01", "큰 수"),
    arithmetic: route(0, 2, "numbers-operations", "numbers-operations-c03", "곱셈과 나눗셈"),
    mixed: route(0, 4, "numbers-operations", "numbers-operations-c05", "혼합계산"),
    factors: route(0, 5, "numbers-operations", "numbers-operations-c06", "약수와 배수"),
    fractions: route(0, 6, "numbers-operations", "numbers-operations-c07", "분수"),
    decimals: route(0, 7, "numbers-operations", "numbers-operations-c08", "소수"),
    equationFoundation: route(1, 3, "equations", "equations-c04", "문자의 이해"),
    linearEquation: route(1, 5, "equations", "equations-c06", "일차방정식"),
    systems: route(1, 7, "equations", "equations-c08", "연립방정식"),
    quadraticEquation: route(1, 8, "equations", "equations-c09", "이차방정식", { mapView: "middle3-quadratic-equation" }),
    highEquation: route(1, 9, "equations", "equations-c10", "고등 방정식"),
    pattern: route(2, 0, "functions", "functions-c01", "규칙 찾기"),
    coordinate: route(2, 2, "functions", "functions-c03", "좌표"),
    proportion: route(2, 3, "functions", "functions-c04", "정비례"),
    linearFunction: route(2, 5, "functions", "functions-c06", "일차함수"),
    quadraticFunction: route(2, 6, "functions", "functions-c07", "이차함수", { mapView: "middle3-quadratic" }),
    highFunction: route(2, 7, "functions", "functions-c08", "여러 가지 함수"),
    angle: route(3, 0, "geometry-measurement", "geometry-measurement-c01", "점·선·각"),
    triangle: route(3, 1, "geometry-measurement", "geometry-measurement-c02", "삼각형"),
    circle: route(3, 3, "geometry-measurement", "geometry-measurement-c04", "원", { mapView: "middle3-circle-properties" }),
    area: route(3, 4, "geometry-measurement", "geometry-measurement-c05", "둘레와 넓이"),
    solid: route(3, 6, "geometry-measurement", "geometry-measurement-c07", "겉넓이와 부피"),
    congruence: route(3, 8, "geometry-measurement", "geometry-measurement-c08", "합동"),
    similarity: route(3, 9, "geometry-measurement", "geometry-measurement-c09", "닮음"),
    pythagorean: route(3, 10, "geometry-measurement", "geometry-measurement-c10", "피타고라스 정리"),
    trig: route(3, 11, "geometry-measurement", "geometry-measurement-c11", "삼각비", { mapView: "middle3-trigonometric-ratio" }),
    analytic: route(3, 11, "geometry-measurement", "geometry-measurement-c12", "좌표기하와 벡터"),
    data: route(4, 0, "probability-statistics", "probability-statistics-c01", "자료 정리"),
    graphs: route(4, 0, "probability-statistics", "probability-statistics-c02", "표와 그래프"),
    average: route(4, 1, "probability-statistics", "probability-statistics-c03", "평균·중앙값·최빈값"),
    counting: route(4, 4, "probability-statistics", "probability-statistics-c04", "경우의 수"),
    permutation: route(4, 5, "probability-statistics", "probability-statistics-c05", "순열과 조합"),
    probability: route(4, 7, "probability-statistics", "probability-statistics-c07", "확률"),
    statistics: route(4, 9, "probability-statistics", "probability-statistics-c09", "분산과 표준편차", { mapView: "middle3-statistics" }),
    inference: route(4, 9, "probability-statistics", "probability-statistics-c10", "통계적 추정"),
    sequence: route(5, 1, "sequences", "sequences-c02", "수열"),
    limit: route(6, 0, "calculus", "calculus-c01", "함수의 극한"),
    differentiation: route(6, 4, "calculus", "calculus-c05", "도함수와 미분"),
    integration: route(6, 7, "calculus", "calculus-c08", "적분"),
    calculusApplication: route(6, 8, "calculus", "calculus-c10", "미적분 활용"),
    sqrt: route(0, 8, "numbers-operations", "numbers-operations-c09", "제곱근과 실수", { mapView: "middle3-sqrt" }),
    factorization: route(1, 4, "equations", "equations-c05", "다항식의 곱셈과 인수분해", { mapView: "middle3-factorization" }),
  });

  const specs = [];
  const add = (conceptId, displayName, unitName, domain, internalGradeBand, routeKeys, contentAvailability, runtimeAvailability) => {
    specs.push({ conceptId, displayName, unitName, domain, internalGradeBand, routeKeys, contentAvailability, runtimeAvailability });
  };

  // Existing G4-M2 bank IDs are retained as canonical IDs. A repeated bank ID
  // (counting) is one concept with multiple source periods, not two identities.
  add("large_numbers", "큰 수와 자릿값", "큰 수", "NUMBER_OPERATIONS", "G4", ["large"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("multi_digit_multiplication_division", "큰 수의 곱셈과 나눗셈", "곱셈과 나눗셈", "NUMBER_OPERATIONS", "G4", ["arithmetic"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("fraction_add_sub", "분수의 덧셈과 뺄셈 기초", "분수", "NUMBER_OPERATIONS", "G4", ["fractions"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("decimal_add_sub", "소수의 덧셈과 뺄셈", "소수", "NUMBER_OPERATIONS", "G4", ["decimals"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("angle_basic", "각과 수직·평행", "점·선·각", "GEOMETRY", "G4", ["angle"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("shape_transformation", "도형의 이동과 규칙", "규칙 찾기", "GEOMETRY", "G4", ["pattern"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("bar_graph", "표와 그래프 읽기", "표와 그래프", "STATISTICS_PROBABILITY", "G4", ["graphs"], "LEGACY_ONLY", "LEGACY_RUNTIME");

  add("mixed_calculation", "자연수의 혼합 계산", "혼합계산", "NUMBER_OPERATIONS", "G5", ["mixed"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("factor_multiple", "약수와 배수", "약수와 배수", "NUMBER_OPERATIONS", "G5", ["factors"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("reduction_common_denominator", "약분과 통분", "분수", "NUMBER_OPERATIONS", "G5", ["fractions"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("fraction_add_sub_advanced", "분모가 다른 분수의 덧셈과 뺄셈", "분수", "NUMBER_OPERATIONS", "G5", ["fractions"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("fraction_multiplication", "분수의 곱셈", "분수", "NUMBER_OPERATIONS", "G5", ["fractions"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("polygon_area_perimeter", "다각형의 둘레와 넓이", "둘레와 넓이", "GEOMETRY", "G5", ["area"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("rounding_range", "수의 범위와 어림", "큰 수", "NUMBER_OPERATIONS", "G5", ["large"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("average_probability_intro", "평균과 가능성 기초", "평균", "STATISTICS_PROBABILITY", "G5", ["average"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("congruence_symmetry", "합동과 대칭", "합동", "GEOMETRY", "G5", ["congruence"], "LEGACY_ONLY", "LEGACY_RUNTIME");

  add("fraction_division", "분수의 나눗셈", "분수", "NUMBER_OPERATIONS", "G6", ["fractions"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("decimal_division", "소수의 나눗셈", "소수", "NUMBER_OPERATIONS", "G6", ["decimals"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("ratio", "비와 비율", "정비례", "NUMBER_OPERATIONS", "G6", ["proportion"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("proportion", "비례식", "정비례", "NUMBER_OPERATIONS", "G6", ["proportion"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("circle_area", "원의 넓이", "원", "GEOMETRY", "G6", ["circle"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("prism_cylinder", "각기둥과 원기둥", "입체도형", "GEOMETRY", "G6", ["solid"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("counting", "경우의 수", "경우의 수", "STATISTICS_PROBABILITY", "G6", ["counting"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("average_data", "평균과 자료 해석", "평균", "STATISTICS_PROBABILITY", "G6", ["average"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("proportional_relationship", "정비례 관계", "정비례", "FUNCTIONS", "G6", ["proportion"], "LEGACY_ONLY", "LEGACY_RUNTIME");

  add("prime_factorization", "소인수분해", "약수와 배수", "NUMBER_OPERATIONS", "M1", ["factors"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("integers_rationals", "정수와 유리수", "수와 연산", "NUMBER_OPERATIONS", "M1", ["mixed"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("algebra_expression", "문자와 식", "문자의 이해", "ALGEBRA", "M1", ["equationFoundation"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("linear_equation", "일차방정식", "일차방정식", "ALGEBRA", "M1", ["linearEquation"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("coordinate_plane", "좌표평면", "좌표", "FUNCTIONS", "M1", ["coordinate"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("direct_inverse", "정비례와 반비례", "정비례·반비례", "FUNCTIONS", "M1", ["proportion"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("basic_geometry", "기본 도형", "점·선·각", "GEOMETRY", "M1", ["angle"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("plane_geometry", "평면도형", "삼각형과 사각형", "GEOMETRY", "M1", ["triangle", "area"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("solid_geometry", "입체도형", "입체도형", "GEOMETRY", "M1", ["solid"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("statistics_intro", "자료의 정리와 해석", "자료 정리", "STATISTICS_PROBABILITY", "M1", ["data", "graphs"], "LEGACY_ONLY", "LEGACY_RUNTIME");

  add("expression", "식의 계산", "식의 계산", "ALGEBRA", "M2", ["equationFoundation"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("system_equation", "연립일차방정식", "연립방정식", "ALGEBRA", "M2", ["systems"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("linear_function", "일차함수", "일차함수", "FUNCTIONS", "M2", ["linearFunction"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("probability", "확률", "확률", "STATISTICS_PROBABILITY", "M2", ["probability"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  add("triangle", "삼각형의 성질과 닮음", "삼각형과 닮음", "GEOMETRY", "M2", ["triangle", "similarity"], "LEGACY_ONLY", "LEGACY_RUNTIME");

  const spring = (id, name, unit, domain, routeKey) => add(id, name, unit, domain, "M3", [routeKey], "COMPLETE_SPRING", "DEDICATED_SPRING");
  spring("m3_sqrt_meaning", "제곱근의 뜻과 기호", "제곱근과 실수", "NUMBER_OPERATIONS", "sqrt");
  spring("m3_sqrt_value", "제곱근의 값", "제곱근과 실수", "NUMBER_OPERATIONS", "sqrt");
  spring("m3_irrational_number", "무리수와 실수", "제곱근과 실수", "NUMBER_OPERATIONS", "sqrt");
  spring("m3_radical_simplification", "근호 간소화", "제곱근과 실수", "NUMBER_OPERATIONS", "sqrt");
  spring("m3_radical_operations", "근호식의 계산", "제곱근과 실수", "NUMBER_OPERATIONS", "sqrt");
  spring("m3_polynomial_multiplication", "다항식의 곱셈", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_multiplication_formula", "곱셈 공식", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_common_factor", "공통인수로 묶기", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_factor_perfect_square", "완전제곱식 인수분해", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_factor_difference_squares", "제곱의 차 인수분해", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_factor_sum_product", "합과 곱을 이용한 인수분해", "다항식의 곱셈과 인수분해", "ALGEBRA", "factorization");
  spring("m3_quadratic_meaning", "이차방정식의 뜻과 해", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_factor_solve", "인수분해를 이용한 풀이", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_sqrt_solve", "제곱근을 이용한 풀이", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_formula", "근의 공식", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_root_meaning", "해의 의미와 검산", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_word_setup", "활용 문제의 식 세우기", "이차방정식", "ALGEBRA", "quadraticEquation");
  spring("m3_quadratic_function_meaning", "이차함수의 뜻", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_quadratic_graph_shape", "이차함수 그래프의 모양", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_quadratic_vertex_axis", "꼭짓점과 축", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_quadratic_translation", "이차함수 그래프의 이동", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_quadratic_find_formula", "이차함수 식 구하기", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_quadratic_max_min", "이차함수의 최대와 최소", "이차함수", "FUNCTIONS", "quadraticFunction");
  spring("m3_trig_meaning", "삼각비의 뜻과 변의 역할", "삼각비", "GEOMETRY", "trig");
  spring("m3_trig_sine", "사인", "삼각비", "GEOMETRY", "trig");
  spring("m3_trig_cosine", "코사인", "삼각비", "GEOMETRY", "trig");
  spring("m3_trig_tangent", "탄젠트", "삼각비", "GEOMETRY", "trig");
  spring("m3_trig_special_angles", "특수각의 삼각비", "삼각비", "GEOMETRY", "trig");
  spring("m3_trig_length", "삼각비로 길이 구하기", "삼각비", "GEOMETRY", "trig");
  spring("m3_circle_foundations", "원의 기본 요소", "원의 성질", "GEOMETRY", "circle");
  spring("m3_circle_chord", "현과 중심", "원의 성질", "GEOMETRY", "circle");
  spring("m3_circle_tangent_radius", "접선과 반지름", "원의 성질", "GEOMETRY", "circle");
  spring("m3_circle_tangent_segments", "한 점에서 그은 두 접선", "원의 성질", "GEOMETRY", "circle");
  spring("m3_circle_central_inscribed", "중심각과 원주각", "원의 성질", "GEOMETRY", "circle");
  spring("m3_circle_same_arc", "같은 호와 반원의 원주각", "원의 성질", "GEOMETRY", "circle");
  spring("m3_statistics_mean", "평균", "통계", "STATISTICS_PROBABILITY", "statistics");
  spring("m3_statistics_median_mode", "중앙값과 최빈값", "통계", "STATISTICS_PROBABILITY", "statistics");
  spring("m3_statistics_representative_range", "대푯값 선택과 자료의 범위", "통계", "STATISTICS_PROBABILITY", "statistics");
  spring("m3_statistics_frequency_graphs", "도수분포표와 히스토그램", "통계", "STATISTICS_PROBABILITY", "statistics");
  spring("m3_statistics_variance", "편차와 분산", "통계", "STATISTICS_PROBABILITY", "statistics");
  spring("m3_statistics_standard_deviation", "표준편차와 두 집단 비교", "통계", "STATISTICS_PROBABILITY", "statistics");

  const support = (id, name) => add(id, name, "피타고라스 정리", "GEOMETRY", "M3", ["pythagorean"], "LEGACY_ONLY", "LEGACY_RUNTIME");
  support("m3_pythagorean_meaning", "피타고라스 정리의 뜻");
  support("m3_pythagorean_hypotenuse", "빗변의 길이 구하기");
  support("m3_pythagorean_leg", "직각변의 길이 구하기");
  support("m3_pythagorean_converse", "피타고라스 정리의 역");
  support("m3_coordinate_distance", "좌표평면의 두 점 사이 거리");

  add("polynomial_high", "고등 다항식", "고등 방정식", "ALGEBRA", "H1", ["highEquation"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("rational_expression", "유리식", "고등 함수", "ALGEBRA", "H1", ["highFunction"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("high_equation", "고등 방정식", "고등 방정식", "ALGEBRA", "H1", ["highEquation"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("function_basic", "고등 함수의 기초", "여러 가지 함수", "FUNCTIONS", "H1", ["highFunction"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("analytic_geometry", "좌표기하", "좌표기하와 벡터", "GEOMETRY", "H1", ["analytic"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("permutation_combination", "순열과 조합", "순열과 조합", "STATISTICS_PROBABILITY", "H1", ["permutation"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");

  add("exponential_function", "지수함수", "여러 가지 함수", "FUNCTIONS", "H2", ["highFunction"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("logarithmic_function", "로그함수", "여러 가지 함수", "FUNCTIONS", "H2", ["highFunction"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("trigonometric_function", "고등 삼각함수", "삼각함수", "FUNCTIONS", "H2", [], "NO_CONTENT", "NO_RUNTIME");
  add("sequence_basic", "수열", "수열", "FUNCTIONS", "H2", ["sequence"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("limit_basic", "함수의 극한", "함수의 극한", "CALCULUS", "H2", ["limit"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("differentiation_basic", "미분", "미분", "CALCULUS", "H2", ["differentiation"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("integration_basic", "적분", "적분", "CALCULUS", "H2", ["integration"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("probability_distribution", "확률분포", "확률과 통계", "STATISTICS_PROBABILITY", "H2", [], "NO_CONTENT", "NO_RUNTIME");
  add("advanced_statistics", "고등 통계", "확률과 통계", "STATISTICS_PROBABILITY", "H2", ["statistics"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("vector_basic", "벡터", "좌표기하와 벡터", "GEOMETRY", "H2", ["analytic"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");

  add("statistical_inference", "통계적 추정", "통계적 추정", "STATISTICS_PROBABILITY", "H3", ["inference"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");
  add("calculus_applications", "미적분 종합 활용", "미적분 활용", "CALCULUS", "H3", ["calculusApplication"], "WORLD_CONTENT_ONLY", "WORLD_RUNTIME");

  const prerequisiteEdges = [];
  const edge = (from, to) => prerequisiteEdges.push([from, to]);
  [
    ["large_numbers", "mixed_calculation"],
    ["multi_digit_multiplication_division", "mixed_calculation"],
    ["fraction_add_sub", "reduction_common_denominator"],
    ["reduction_common_denominator", "fraction_add_sub_advanced"],
    ["fraction_add_sub_advanced", "fraction_multiplication"],
    ["fraction_multiplication", "fraction_division"],
    ["decimal_add_sub", "decimal_division"],
    ["fraction_division", "ratio"],
    ["decimal_division", "ratio"],
    ["ratio", "proportion"],
    ["ratio", "proportional_relationship"],
    ["mixed_calculation", "integers_rationals"],
    ["factor_multiple", "prime_factorization"],
    ["integers_rationals", "algebra_expression"],
    ["algebra_expression", "linear_equation"],
    ["algebra_expression", "expression"],
    ["linear_equation", "system_equation"],
    ["coordinate_plane", "direct_inverse"],
    ["proportional_relationship", "direct_inverse"],
    ["direct_inverse", "linear_function"],
    ["linear_equation", "linear_function"],
    ["angle_basic", "basic_geometry"],
    ["shape_transformation", "coordinate_plane"],
    ["polygon_area_perimeter", "plane_geometry"],
    ["congruence_symmetry", "triangle"],
    ["basic_geometry", "triangle"],
    ["plane_geometry", "triangle"],
    ["prism_cylinder", "solid_geometry"],
    ["bar_graph", "statistics_intro"],
    ["average_probability_intro", "average_data"],
    ["statistics_intro", "average_data"],
    ["counting", "probability"],
  ].forEach(([from, to]) => edge(from, to));

  [
    ["integers_rationals", "m3_sqrt_meaning"],
    ["m3_sqrt_meaning", "m3_sqrt_value"],
    ["m3_sqrt_meaning", "m3_irrational_number"],
    ["prime_factorization", "m3_sqrt_value"],
    ["m3_sqrt_value", "m3_radical_simplification"],
    ["m3_irrational_number", "m3_radical_simplification"],
    ["m3_radical_simplification", "m3_radical_operations"],
    ["expression", "m3_radical_operations"],
    ["expression", "m3_polynomial_multiplication"],
    ["m3_polynomial_multiplication", "m3_multiplication_formula"],
    ["expression", "m3_common_factor"],
    ["factor_multiple", "m3_common_factor"],
    ["m3_multiplication_formula", "m3_factor_perfect_square"],
    ["m3_multiplication_formula", "m3_factor_difference_squares"],
    ["m3_multiplication_formula", "m3_factor_sum_product"],
    ["m3_common_factor", "m3_factor_sum_product"],
    ["linear_equation", "m3_quadratic_meaning"],
    ["expression", "m3_quadratic_meaning"],
    ["m3_quadratic_meaning", "m3_quadratic_factor_solve"],
    ["m3_factor_perfect_square", "m3_quadratic_factor_solve"],
    ["m3_factor_difference_squares", "m3_quadratic_factor_solve"],
    ["m3_factor_sum_product", "m3_quadratic_factor_solve"],
    ["m3_quadratic_meaning", "m3_quadratic_sqrt_solve"],
    ["m3_sqrt_value", "m3_quadratic_sqrt_solve"],
    ["m3_quadratic_meaning", "m3_quadratic_formula"],
    ["m3_radical_simplification", "m3_quadratic_formula"],
    ["m3_quadratic_factor_solve", "m3_quadratic_root_meaning"],
    ["m3_quadratic_sqrt_solve", "m3_quadratic_root_meaning"],
    ["m3_quadratic_formula", "m3_quadratic_root_meaning"],
    ["m3_quadratic_root_meaning", "m3_quadratic_word_setup"],
    ["linear_equation", "m3_quadratic_word_setup"],
    ["m3_quadratic_root_meaning", "m3_quadratic_function_meaning"],
    ["coordinate_plane", "m3_quadratic_graph_shape"],
    ["linear_function", "m3_quadratic_graph_shape"],
    ["m3_quadratic_function_meaning", "m3_quadratic_graph_shape"],
    ["m3_quadratic_graph_shape", "m3_quadratic_vertex_axis"],
    ["m3_quadratic_vertex_axis", "m3_quadratic_translation"],
    ["m3_quadratic_translation", "m3_quadratic_find_formula"],
    ["m3_quadratic_vertex_axis", "m3_quadratic_max_min"],
    ["m3_quadratic_find_formula", "m3_quadratic_max_min"],
  ].forEach(([from, to]) => edge(from, to));

  [
    ["triangle", "m3_pythagorean_meaning"],
    ["m3_sqrt_value", "m3_pythagorean_meaning"],
    ["m3_pythagorean_meaning", "m3_pythagorean_hypotenuse"],
    ["m3_pythagorean_meaning", "m3_pythagorean_leg"],
    ["m3_pythagorean_meaning", "m3_pythagorean_converse"],
    ["coordinate_plane", "m3_coordinate_distance"],
    ["m3_pythagorean_meaning", "m3_coordinate_distance"],
    ["ratio", "m3_trig_meaning"],
    ["proportion", "m3_trig_meaning"],
    ["m3_pythagorean_meaning", "m3_trig_meaning"],
    ["m3_trig_meaning", "m3_trig_sine"],
    ["m3_trig_meaning", "m3_trig_cosine"],
    ["m3_trig_meaning", "m3_trig_tangent"],
    ["m3_trig_sine", "m3_trig_special_angles"],
    ["m3_trig_cosine", "m3_trig_special_angles"],
    ["m3_trig_tangent", "m3_trig_special_angles"],
    ["m3_trig_special_angles", "m3_trig_length"],
    ["basic_geometry", "m3_circle_foundations"],
    ["m3_circle_foundations", "m3_circle_chord"],
    ["m3_circle_foundations", "m3_circle_tangent_radius"],
    ["m3_circle_foundations", "m3_circle_central_inscribed"],
    ["m3_circle_tangent_radius", "m3_circle_tangent_segments"],
    ["m3_circle_central_inscribed", "m3_circle_same_arc"],
  ].forEach(([from, to]) => edge(from, to));

  [
    ["average_data", "m3_statistics_mean"],
    ["statistics_intro", "m3_statistics_median_mode"],
    ["m3_statistics_mean", "m3_statistics_median_mode"],
    ["m3_statistics_median_mode", "m3_statistics_representative_range"],
    ["bar_graph", "m3_statistics_frequency_graphs"],
    ["statistics_intro", "m3_statistics_frequency_graphs"],
    ["m3_statistics_mean", "m3_statistics_variance"],
    ["m3_statistics_variance", "m3_statistics_standard_deviation"],
    ["m3_sqrt_value", "m3_statistics_standard_deviation"],
  ].forEach(([from, to]) => edge(from, to));

  [
    ["m3_radical_operations", "polynomial_high"],
    ["m3_factor_sum_product", "polynomial_high"],
    ["m3_radical_operations", "rational_expression"],
    ["m3_factor_difference_squares", "rational_expression"],
    ["m3_quadratic_formula", "high_equation"],
    ["polynomial_high", "high_equation"],
    ["m3_quadratic_find_formula", "function_basic"],
    ["linear_function", "function_basic"],
    ["coordinate_plane", "analytic_geometry"],
    ["linear_function", "analytic_geometry"],
    ["m3_coordinate_distance", "analytic_geometry"],
    ["counting", "permutation_combination"],
    ["function_basic", "exponential_function"],
    ["exponential_function", "logarithmic_function"],
    ["function_basic", "trigonometric_function"],
    ["m3_trig_special_angles", "trigonometric_function"],
    ["algebra_expression", "sequence_basic"],
    ["function_basic", "sequence_basic"],
    ["function_basic", "limit_basic"],
    ["rational_expression", "limit_basic"],
    ["limit_basic", "differentiation_basic"],
    ["differentiation_basic", "integration_basic"],
    ["probability", "probability_distribution"],
    ["permutation_combination", "probability_distribution"],
    ["m3_statistics_standard_deviation", "advanced_statistics"],
    ["probability_distribution", "advanced_statistics"],
    ["analytic_geometry", "vector_basic"],
    ["m3_trig_length", "vector_basic"],
    ["advanced_statistics", "statistical_inference"],
    ["integration_basic", "calculus_applications"],
  ].forEach(([from, to]) => edge(from, to));

  const parallelPairs = [
    ["fraction_add_sub", "decimal_add_sub"],
    ["polygon_area_perimeter", "circle_area"],
    ["m3_factor_perfect_square", "m3_factor_difference_squares"],
    ["m3_factor_perfect_square", "m3_factor_sum_product"],
    ["m3_factor_difference_squares", "m3_factor_sum_product"],
    ["m3_quadratic_factor_solve", "m3_quadratic_sqrt_solve"],
    ["m3_quadratic_factor_solve", "m3_quadratic_formula"],
    ["m3_quadratic_sqrt_solve", "m3_quadratic_formula"],
    ["m3_pythagorean_hypotenuse", "m3_pythagorean_leg"],
    ["m3_pythagorean_hypotenuse", "m3_pythagorean_converse"],
    ["m3_pythagorean_leg", "m3_pythagorean_converse"],
    ["m3_trig_sine", "m3_trig_cosine"],
    ["m3_trig_sine", "m3_trig_tangent"],
    ["m3_trig_cosine", "m3_trig_tangent"],
    ["m3_circle_chord", "m3_circle_tangent_radius"],
    ["m3_circle_chord", "m3_circle_central_inscribed"],
    ["m3_circle_tangent_radius", "m3_circle_central_inscribed"],
    ["m3_statistics_representative_range", "m3_statistics_frequency_graphs"],
    ["polynomial_high", "rational_expression"],
  ];

  const transferEdges = [
    ["rounding_range", "m3_statistics_representative_range"],
    ["circle_area", "m3_circle_foundations"],
    ["solid_geometry", "m3_pythagorean_meaning"],
    ["m3_radical_operations", "m3_quadratic_formula"],
    ["m3_radical_operations", "m3_trig_special_angles"],
    ["m3_radical_operations", "m3_statistics_standard_deviation"],
    ["m3_factor_sum_product", "m3_quadratic_factor_solve"],
    ["m3_quadratic_word_setup", "m3_quadratic_function_meaning"],
    ["m3_quadratic_max_min", "limit_basic"],
    ["m3_pythagorean_converse", "m3_trig_meaning"],
    ["m3_trig_length", "analytic_geometry"],
    ["m3_circle_tangent_segments", "analytic_geometry"],
    ["m3_circle_same_arc", "analytic_geometry"],
    ["m3_statistics_representative_range", "advanced_statistics"],
    ["m3_statistics_frequency_graphs", "advanced_statistics"],
  ];

  const aliasesByCanonical = {
    integers_rationals: ["integer_rational"],
    algebra_expression: ["algebraic_expression"],
    system_equation: ["simultaneous_equation"],
    ratio: ["ratio_basic"],
    counting: ["counting_cases"],
    probability: ["probability_basic", "m3_probability_basic"],
    large_numbers: ["place_value"],
    fraction_add_sub_advanced: ["fraction_operations"],
    decimal_add_sub: ["decimal_basic"],
    expression: ["polynomial_operation"],
  };

  function remediationMapFor(conceptId) {
    if (conceptId.startsWith("m3_quadratic_")) {
      const map = {
        FACTORIZATION_FAILURE: ["m3_factor_sum_product", "m3_factor_difference_squares"],
        SIGN_ERROR: ["integers_rationals", "expression"],
        RADICAL_SIMPLIFICATION_FAILURE: ["m3_radical_simplification"],
        LINEAR_EQUATION_TRANSFORMATION_FAILURE: ["linear_equation"],
        DOMAIN_FILTER_FAILURE: ["m3_quadratic_meaning"],
      };
      if (conceptId === "m3_quadratic_meaning") delete map.DOMAIN_FILTER_FAILURE;
      return map;
    }
    if (conceptId.startsWith("m3_trig_")) {
      const map = {
        SIDE_ROLE_CONFUSION: ["m3_trig_meaning"],
        RATIO_SETUP_FAILURE: ["ratio", "proportion"],
        PYTHAGOREAN_FAILURE: ["m3_pythagorean_meaning"],
        RADICAL_ERROR: ["m3_radical_operations"],
        SPECIAL_ANGLE_FAILURE: ["m3_trig_special_angles"],
      };
      if (conceptId === "m3_trig_meaning") map.SIDE_ROLE_CONFUSION = ["basic_geometry", "triangle"];
      if (conceptId === "m3_trig_special_angles") map.SPECIAL_ANGLE_FAILURE = ["m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent"];
      return map;
    }
    if (conceptId.startsWith("m3_circle_")) {
      const map = {
        ANGLE_RELATION_FAILURE: ["angle_basic", "triangle"],
        TANGENT_POINT_CONFUSION: ["m3_circle_foundations"],
        SAME_ARC_CONFUSION: ["m3_circle_central_inscribed"],
        RIGHT_TRIANGLE_FAILURE: ["m3_pythagorean_meaning"],
      };
      if (conceptId === "m3_circle_foundations") map.TANGENT_POINT_CONFUSION = ["basic_geometry"];
      if (conceptId === "m3_circle_central_inscribed") map.SAME_ARC_CONFUSION = ["m3_circle_foundations", "angle_basic"];
      return map;
    }
    if (conceptId.startsWith("m3_statistics_")) {
      const map = {
        ARITHMETIC_ERROR: ["fraction_division", "decimal_division"],
        MEAN_FAILURE: ["m3_statistics_mean"],
        SORTING_FAILURE: ["statistics_intro"],
        VARIANCE_PROCESS_FAILURE: ["m3_statistics_variance"],
        RADICAL_ERROR: ["m3_sqrt_value"],
        GRAPH_READING_FAILURE: ["m3_statistics_frequency_graphs"],
      };
      if (conceptId === "m3_statistics_mean") map.MEAN_FAILURE = ["average_data"];
      if (conceptId === "m3_statistics_variance") map.VARIANCE_PROCESS_FAILURE = ["m3_statistics_mean"];
      if (conceptId === "m3_statistics_frequency_graphs") map.GRAPH_READING_FAILURE = ["bar_graph", "statistics_intro"];
      return map;
    }
    if (conceptId.startsWith("m3_factor_") || conceptId === "m3_common_factor" || conceptId.startsWith("m3_multi") || conceptId === "m3_polynomial_multiplication") {
      const map = {
        SIGN_ERROR: ["integers_rationals"],
        DISTRIBUTIVE_PROPERTY_FAILURE: ["expression", "algebra_expression"],
        COMMON_FACTOR_FAILURE: ["factor_multiple", "m3_common_factor"].filter((id) => id !== conceptId),
        FORMULA_SELECTION_FAILURE: ["m3_multiplication_formula"].filter((id) => id !== conceptId),
      };
      return Object.fromEntries(Object.entries(map).filter(([, targets]) => targets.length > 0));
    }
    if (conceptId.startsWith("m3_sqrt_") || conceptId.startsWith("m3_radical_") || conceptId === "m3_irrational_number") {
      return {
        SIGN_ERROR: ["integers_rationals"],
        PERFECT_SQUARE_FAILURE: ["prime_factorization"],
        FRACTION_DECIMAL_FAILURE: ["fraction_division", "decimal_division"],
      };
    }
    if (conceptId.startsWith("m3_quadratic_function_")) {
      return {
        COORDINATE_READING_FAILURE: ["coordinate_plane", "linear_function"],
        EQUATION_CONNECTION_FAILURE: ["m3_quadratic_root_meaning"],
        EXPRESSION_TRANSFORMATION_FAILURE: ["expression", "m3_polynomial_multiplication"],
      };
    }
    if (conceptId.startsWith("m3_pythagorean_") || conceptId === "m3_coordinate_distance") {
      return {
        RIGHT_TRIANGLE_FAILURE: ["triangle", "basic_geometry"],
        RADICAL_ERROR: ["m3_sqrt_value"],
        COORDINATE_READING_FAILURE: ["coordinate_plane"],
      };
    }
    return {};
  }

  const mutableById = Object.fromEntries(specs.map((spec) => [spec.conceptId, {
    conceptId: spec.conceptId,
    displayName: spec.displayName,
    unitName: spec.unitName,
    domain: spec.domain,
    internalGradeBand: spec.internalGradeBand,
    sourceRoutes: spec.routeKeys.map((key) => ROUTES[key]).filter(Boolean),
    aliasIds: [...(aliasesByCanonical[spec.conceptId] || [])],
    prerequisiteConceptIds: [],
    nextConceptIds: [],
    remedialConceptIds: [],
    parallelConceptIds: [],
    transferConceptIds: [],
    minimumGradeBand: MINIMUM_GRADE_BAND,
    maximumGradeBand: MAXIMUM_GRADE_BAND,
    entryEvidence: {
      startNode: spec.internalGradeBand === "G4",
      acceptedSources: ["LEVEL_TEST", "LEARNING", "MIGRATED_LEGACY"],
      prerequisiteStatus: "BASIC_CONFIRMED",
    },
    masteryEvidence: {
      minimumDistinctStructures: 3,
      minimumDistinctSolutionPaths: 3,
      independentCheckRequired: true,
      allowGiveUp: false,
    },
    failureEvidence: {
      repeatedMisconceptionStructures: 2,
      giveUpTriggersReview: true,
      minimumEvidenceBeforeRemediation: 2,
    },
    returnCondition: {
      minimumCorrect: 2,
      evidenceWindow: 3,
      distinctStructureRequired: true,
      independentCheckRequired: true,
    },
    promotionCondition: {
      requireMasteryEvidence: true,
      requireAvailableTargetRuntime: true,
      ignoreGradeCompletion: true,
    },
    misconceptionRemediationMap: remediationMapFor(spec.conceptId),
    contentAvailability: spec.contentAvailability,
    runtimeAvailability: spec.runtimeAvailability,
    isAssessmentNode: false,
    isMasterNode: false,
  }]));

  prerequisiteEdges.forEach(([from, to]) => {
    if (!mutableById[from] || !mutableById[to]) return;
    mutableById[to].prerequisiteConceptIds.push(from);
    mutableById[from].nextConceptIds.push(to);
  });
  parallelPairs.forEach(([left, right]) => {
    if (!mutableById[left] || !mutableById[right]) return;
    mutableById[left].parallelConceptIds.push(right);
    mutableById[right].parallelConceptIds.push(left);
  });
  transferEdges.forEach(([from, to]) => {
    if (mutableById[from] && mutableById[to]) mutableById[from].transferConceptIds.push(to);
  });
  Object.values(mutableById).forEach((node) => {
    node.remedialConceptIds = [...new Set(Object.values(node.misconceptionRemediationMap).flat())];
    ["prerequisiteConceptIds", "nextConceptIds", "remedialConceptIds", "parallelConceptIds", "transferConceptIds", "aliasIds"]
      .forEach((field) => { node[field] = [...new Set(node[field])]; });
  });

  const conceptNodes = Object.freeze(Object.values(mutableById).map((node) => Object.freeze({
    ...node,
    sourceRoutes: Object.freeze([...node.sourceRoutes]),
    aliasIds: Object.freeze([...node.aliasIds]),
    prerequisiteConceptIds: Object.freeze([...node.prerequisiteConceptIds]),
    nextConceptIds: Object.freeze([...node.nextConceptIds]),
    remedialConceptIds: Object.freeze([...node.remedialConceptIds]),
    parallelConceptIds: Object.freeze([...node.parallelConceptIds]),
    transferConceptIds: Object.freeze([...node.transferConceptIds]),
    entryEvidence: Object.freeze({ ...node.entryEvidence, acceptedSources: Object.freeze([...node.entryEvidence.acceptedSources]) }),
    masteryEvidence: Object.freeze({ ...node.masteryEvidence }),
    failureEvidence: Object.freeze({ ...node.failureEvidence }),
    returnCondition: Object.freeze({ ...node.returnCondition }),
    promotionCondition: Object.freeze({ ...node.promotionCondition }),
    misconceptionRemediationMap: Object.freeze(Object.fromEntries(Object.entries(node.misconceptionRemediationMap)
      .map(([tag, targets]) => [tag, Object.freeze([...targets])]))),
  })));
  const conceptById = Object.freeze(Object.fromEntries(conceptNodes.map((node) => [node.conceptId, node])));

  const MIDDLE3_APPROVED_CONCEPT_IDS = Object.freeze([
    "m3_sqrt_meaning", "m3_sqrt_value", "m3_irrational_number", "m3_radical_simplification", "m3_radical_operations",
    "m3_polynomial_multiplication", "m3_multiplication_formula", "m3_common_factor", "m3_factor_perfect_square", "m3_factor_difference_squares", "m3_factor_sum_product",
    "m3_quadratic_meaning", "m3_quadratic_factor_solve", "m3_quadratic_sqrt_solve", "m3_quadratic_formula", "m3_quadratic_root_meaning", "m3_quadratic_word_setup",
    "m3_quadratic_function_meaning", "m3_quadratic_graph_shape", "m3_quadratic_vertex_axis", "m3_quadratic_translation", "m3_quadratic_find_formula", "m3_quadratic_max_min",
    "m3_trig_meaning", "m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent", "m3_trig_special_angles", "m3_trig_length",
    "m3_circle_foundations", "m3_circle_chord", "m3_circle_tangent_radius", "m3_circle_tangent_segments", "m3_circle_central_inscribed", "m3_circle_same_arc",
    "m3_statistics_mean", "m3_statistics_median_mode", "m3_statistics_representative_range", "m3_statistics_frequency_graphs", "m3_statistics_variance", "m3_statistics_standard_deviation",
  ]);

  return Object.freeze({
    VERSION,
    MINIMUM_GRADE_BAND,
    MAXIMUM_GRADE_BAND,
    GRADE_BANDS,
    DOMAINS,
    CONTENT_AVAILABILITY,
    RUNTIME_AVAILABILITY,
    ROUTES,
    conceptNodes,
    conceptById,
    prerequisiteEdges: Object.freeze(prerequisiteEdges.map((item) => Object.freeze([...item]))),
    parallelPairs: Object.freeze(parallelPairs.map((item) => Object.freeze([...item]))),
    transferEdges: Object.freeze(transferEdges.map((item) => Object.freeze([...item]))),
    MIDDLE3_APPROVED_CONCEPT_IDS,
  });
});
