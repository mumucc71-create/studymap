(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_ALIASES = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "math-concept-aliases-v1";

  // A concept alias resolves to one canonical learning node. Broad unit IDs are
  // intentionally kept in UNIT_ALIASES so evidence is never collapsed into one
  // arbitrary detail concept.
  const DIRECT_ALIASES = Object.freeze({
    integer_rational: "integers_rationals",
    algebraic_expression: "algebra_expression",
    simultaneous_equation: "system_equation",
    ratio_basic: "ratio",
    counting_cases: "counting",
    probability_basic: "probability",
    m3_probability_basic: "probability",
    place_value: "large_numbers",
    fraction_operations: "fraction_add_sub_advanced",
    decimal_basic: "decimal_add_sub",
    polynomial_operation: "expression",
  });

  const UNIT_ALIASES = Object.freeze({
    real_numbers: Object.freeze([
      "m3_sqrt_meaning",
      "m3_sqrt_value",
      "m3_irrational_number",
      "m3_radical_simplification",
      "m3_radical_operations",
    ]),
    factorization: Object.freeze([
      "m3_polynomial_multiplication",
      "m3_multiplication_formula",
      "m3_common_factor",
      "m3_factor_perfect_square",
      "m3_factor_difference_squares",
      "m3_factor_sum_product",
    ]),
    quadratic_equation: Object.freeze([
      "m3_quadratic_meaning",
      "m3_quadratic_factor_solve",
      "m3_quadratic_sqrt_solve",
      "m3_quadratic_formula",
      "m3_quadratic_root_meaning",
      "m3_quadratic_word_setup",
    ]),
    quadratic_function: Object.freeze([
      "m3_quadratic_function_meaning",
      "m3_quadratic_graph_shape",
      "m3_quadratic_vertex_axis",
      "m3_quadratic_translation",
      "m3_quadratic_find_formula",
      "m3_quadratic_max_min",
    ]),
    pythagorean: Object.freeze([
      "m3_pythagorean_meaning",
      "m3_pythagorean_hypotenuse",
      "m3_pythagorean_leg",
      "m3_pythagorean_converse",
      "m3_coordinate_distance",
    ]),
    trigonometric_ratio: Object.freeze([
      "m3_trig_meaning",
      "m3_trig_sine",
      "m3_trig_cosine",
      "m3_trig_tangent",
      "m3_trig_special_angles",
      "m3_trig_length",
    ]),
    "m3-trigonometric-ratio": Object.freeze([
      "m3_trig_meaning",
      "m3_trig_sine",
      "m3_trig_cosine",
      "m3_trig_tangent",
      "m3_trig_special_angles",
      "m3_trig_length",
    ]),
    m3_trigonometric_ratio: Object.freeze([
      "m3_trig_meaning",
      "m3_trig_sine",
      "m3_trig_cosine",
      "m3_trig_tangent",
      "m3_trig_special_angles",
      "m3_trig_length",
    ]),
    circle: Object.freeze([
      "m3_circle_foundations",
      "m3_circle_chord",
      "m3_circle_tangent_radius",
      "m3_circle_tangent_segments",
      "m3_circle_central_inscribed",
      "m3_circle_same_arc",
    ]),
    statistics_basic: Object.freeze([
      "m3_statistics_mean",
      "m3_statistics_median_mode",
      "m3_statistics_representative_range",
      "m3_statistics_frequency_graphs",
      "m3_statistics_variance",
      "m3_statistics_standard_deviation",
    ]),
    statistics_probability: Object.freeze([
      "m3_statistics_mean",
      "m3_statistics_median_mode",
      "m3_statistics_representative_range",
      "m3_statistics_frequency_graphs",
      "m3_statistics_variance",
      "m3_statistics_standard_deviation",
      "probability",
    ]),
  });

  const aliasEntries = Object.freeze([
    ...Object.entries(DIRECT_ALIASES).map(([aliasId, canonicalConceptId]) => Object.freeze({
      aliasId,
      aliasType: "CONCEPT_ALIAS",
      canonicalConceptId,
      targetConceptIds: Object.freeze([canonicalConceptId]),
    })),
    ...Object.entries(UNIT_ALIASES).map(([aliasId, targetConceptIds]) => Object.freeze({
      aliasId,
      aliasType: "UNIT_ALIAS",
      canonicalConceptId: null,
      targetConceptIds,
    })),
  ]);

  const aliasById = Object.freeze(Object.fromEntries(aliasEntries.map((entry) => [entry.aliasId, entry])));

  function resolveAlias(aliasId) {
    return aliasById[String(aliasId || "")] || null;
  }

  function canonicalConceptIdFor(aliasId) {
    return resolveAlias(aliasId)?.canonicalConceptId || null;
  }

  function targetConceptIdsFor(aliasId) {
    return [...(resolveAlias(aliasId)?.targetConceptIds || [])];
  }

  return Object.freeze({
    VERSION,
    DIRECT_ALIASES,
    UNIT_ALIASES,
    aliasEntries,
    aliasById,
    resolveAlias,
    canonicalConceptIdFor,
    targetConceptIdsFor,
  });
});
