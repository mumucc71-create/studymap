(function (root, factory) {
  const graph = typeof module === "object" && module.exports
    ? require("./math-concept-graph-data.js")
    : root.STUDY_MATH_CONCEPT_GRAPH;
  const api = factory(graph);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_GATES = api;
})(typeof window !== "undefined" ? window : globalThis, function (graph) {
  "use strict";
  if (!graph) throw new Error("MATH_ADAPTIVE_GATE_GRAPH_MISSING");

  const GRADE_SEQUENCE = Object.freeze(["G4", "G5", "G6", "M1", "M2", "M3"]);
  const LOWER_BOUNDARY = "G4";
  const UPPER_BOUNDARY = "H3";
  const domain = (domainId, displayName, conceptIds) => Object.freeze({ domainId, displayName, conceptIds: Object.freeze(conceptIds) });
  const GRADE_GATES = Object.freeze({
    G4: Object.freeze([
      domain("NUMBER_PLACE_VALUE", "큰 수와 자릿값", ["large_numbers"]),
      domain("MULTIPLICATION_DIVISION", "곱셈·나눗셈", ["multi_digit_multiplication_division"]),
      domain("FRACTION_DECIMAL", "분수·소수 계산", ["fraction_add_sub", "decimal_add_sub"]),
      domain("ANGLE_SHAPE", "각도·도형", ["angle_basic", "shape_transformation"]),
      domain("TABLE_GRAPH", "표·그래프", ["bar_graph"]),
    ]),
    G5: Object.freeze([
      domain("MIXED_CALCULATION", "혼합 계산", ["mixed_calculation"]),
      domain("FACTOR_MULTIPLE", "약수·배수", ["factor_multiple"]),
      domain("FRACTION_CALCULATION", "분수 계산", ["reduction_common_denominator", "fraction_add_sub_advanced", "fraction_multiplication"]),
      domain("AREA_SYMMETRY", "넓이·대칭", ["polygon_area_perimeter", "congruence_symmetry"]),
      domain("AVERAGE_DATA", "평균·자료", ["average_probability_intro", "rounding_range"]),
    ]),
    G6: Object.freeze([
      domain("DIVISION", "분수·소수 나눗셈", ["fraction_division", "decimal_division"]),
      domain("RATIO", "비와 비율", ["ratio"]),
      domain("PROPORTION", "비례식", ["proportion", "proportional_relationship"]),
      domain("CIRCLE_SOLID", "원·입체도형", ["circle_area", "prism_cylinder"]),
      domain("COUNTING_DATA", "경우의 수·자료", ["counting", "average_data"]),
    ]),
    M1: Object.freeze([
      domain("INTEGER_RATIONAL", "정수와 유리수", ["prime_factorization", "integers_rationals"]),
      domain("ALGEBRA_EXPRESSION", "문자와 식", ["algebra_expression"]),
      domain("LINEAR_EQUATION", "일차방정식", ["linear_equation"]),
      domain("COORDINATE_RATIO", "좌표·정비례·반비례", ["coordinate_plane", "direct_inverse"]),
      domain("GEOMETRY_STATISTICS", "기본도형·통계", ["basic_geometry", "plane_geometry", "solid_geometry", "statistics_intro"]),
    ]),
    M2: Object.freeze([
      domain("EXPRESSION", "식의 계산", ["expression"]),
      domain("SYSTEM_EQUATION", "연립방정식", ["system_equation"]),
      domain("LINEAR_FUNCTION", "일차함수", ["linear_function"]),
      domain("COUNTING_PROBABILITY", "경우의 수·확률", ["counting", "probability"]),
      domain("TRIANGLE_SIMILARITY", "삼각형·닮음", ["triangle"]),
    ]),
    M3: Object.freeze([
      domain("SQRT", "제곱근", ["m3_sqrt_meaning", "m3_sqrt_value", "m3_radical_simplification"]),
      domain("FACTORIZATION", "인수분해", ["m3_polynomial_multiplication", "m3_multiplication_formula", "m3_factor_sum_product"]),
      domain("QUADRATIC_EQUATION", "이차방정식", ["m3_quadratic_meaning", "m3_quadratic_factor_solve", "m3_quadratic_formula"]),
      domain("QUADRATIC_FUNCTION", "이차함수", ["m3_quadratic_function_meaning", "m3_quadratic_graph_shape", "m3_quadratic_vertex_axis"]),
      domain("PYTHAGOREAN_TRIG", "피타고라스·삼각비", ["m3_pythagorean_meaning", "m3_pythagorean_hypotenuse", "m3_trig_meaning", "m3_trig_length"]),
      domain("CIRCLE", "원의 성질", ["m3_circle_foundations", "m3_circle_tangent_radius", "m3_circle_central_inscribed"]),
      domain("STATISTICS", "통계", ["m3_statistics_mean", "m3_statistics_frequency_graphs", "m3_statistics_standard_deviation"]),
    ]),
  });

  const allGateConceptIds = Object.freeze([...new Set(Object.values(GRADE_GATES).flatMap((domains) => domains.flatMap((item) => item.conceptIds)))]);
  const missingConceptIds = Object.freeze(allGateConceptIds.filter((conceptId) => !graph.conceptById[conceptId]));
  if (missingConceptIds.length) throw new Error(`MATH_ADAPTIVE_GATE_UNKNOWN_CONCEPT:${missingConceptIds.join(",")}`);

  function getGateDomains(gradeGate) { return GRADE_GATES[gradeGate] || Object.freeze([]); }
  function getDomain(gradeGate, domainId) { return getGateDomains(gradeGate).find((item) => item.domainId === domainId) || null; }
  function nextGradeGate(gradeGate) {
    const index = GRADE_SEQUENCE.indexOf(gradeGate);
    return index >= 0 && index < GRADE_SEQUENCE.length - 1 ? GRADE_SEQUENCE[index + 1] : null;
  }

  return Object.freeze({ GRADE_SEQUENCE, LOWER_BOUNDARY, UPPER_BOUNDARY, GRADE_GATES, allGateConceptIds, missingConceptIds, getGateDomains, getDomain, nextGradeGate });
});
