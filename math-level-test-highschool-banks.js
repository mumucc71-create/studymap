(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_TEST_HIGHSCHOOL_BANKS = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STATUS = Object.freeze({ READY: "READY", NOT_READY: "TEST_BANK_NOT_READY" });
  const ELECTIVES = Object.freeze(["PROBABILITY_STATISTICS", "CALCULUS", "GEOMETRY"]);
  const ROUTES = Object.freeze({
    H1: Object.freeze({ bankId: "H1_COMMON", kind: "COMMON", targetLength: 30, conceptIds: Object.freeze(["polynomial_high", "high_equation", "permutation_combination", "function_basic", "analytic_geometry"]) }),
    H2: Object.freeze({ bankId: "H2_COMMON", kind: "COMMON", targetLength: 30, conceptIds: Object.freeze(["exponential_function", "logarithmic_function", "trigonometric_function", "sequence_basic", "limit_basic", "differentiation_basic", "integration_basic"]) }),
  });
  const ELECTIVE_ROUTES = Object.freeze({
    PROBABILITY_STATISTICS: Object.freeze({ conceptIds: Object.freeze(["probability_distribution", "advanced_statistics", "statistical_inference"]) }),
    CALCULUS: Object.freeze({ conceptIds: Object.freeze(["limit_basic", "differentiation_basic", "integration_basic", "calculus_applications"]) }),
    GEOMETRY: Object.freeze({ conceptIds: Object.freeze(["analytic_geometry", "vector_basic"]) }),
  });

  function selectHighSchoolRoute(gradeBand, elective = null) {
    if (gradeBand === "H1") return Object.freeze({ ...ROUTES.H1, gradeBand, status: STATUS.NOT_READY, questions: Object.freeze([]), message: "고등 1학년 공통 수학 레벨테스트를 준비하고 있습니다." });
    if (gradeBand === "H2" && !elective) return Object.freeze({ ...ROUTES.H2, gradeBand, status: STATUS.NOT_READY, questions: Object.freeze([]), availableElectives: ELECTIVES, message: "고등 2학년 공통 수학 레벨테스트를 준비하고 있습니다." });
    if ((gradeBand === "H2" || gradeBand === "H3") && ELECTIVE_ROUTES[elective]) {
      const targetLength = gradeBand === "H3" ? 27 : 24;
      return Object.freeze({ bankId: `${gradeBand}_${elective}`, kind: "ELECTIVE", gradeBand, elective, targetLength, conceptIds: ELECTIVE_ROUTES[elective].conceptIds, status: STATUS.NOT_READY, questions: Object.freeze([]), message: `${gradeBand === "H2" ? "고등 2학년" : "고등 3학년"} 선택과목 레벨테스트를 준비하고 있습니다.` });
    }
    return Object.freeze({ bankId: `${gradeBand || "HIGH"}_UNSELECTED`, kind: "ELECTIVE", gradeBand, elective: null, targetLength: gradeBand === "H3" ? 27 : 24, status: STATUS.NOT_READY, questions: Object.freeze([]), availableElectives: ELECTIVES, message: gradeBand === "H3" ? "응시할 선택과목을 먼저 선택해 주세요." : "해당 고등 수학 레벨테스트를 준비하고 있습니다." });
  }

  return Object.freeze({ STATUS, ELECTIVES, ROUTES, ELECTIVE_ROUTES, selectHighSchoolRoute });
});
