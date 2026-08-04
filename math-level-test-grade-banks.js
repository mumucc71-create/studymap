(function (root, factory) {
  const commonJs = typeof module === "object" && module.exports;
  const deps = commonJs ? {
    model: require("./math-level-test-question-model.js"),
    mapper: require("./math-level-test-concept-mapper.js"),
    high: require("./math-level-test-highschool-banks.js"),
    diagnostics: require("./middle3-concept-diagnostics.js"),
    sqrt: require("./middle3-sqrt-learning-model.js"),
    factor: require("./middle3-factorization-learning-model.js"),
    equation: require("./middle3-quadratic-equation-learning-model.js"),
    quadratic: require("./middle3-quadratic-learning-model.js"),
    trig: require("./middle3-trigonometric-ratio-learning-model.js"),
    circle: require("./middle3-circle-properties-learning-model.js"),
    statistics: require("./middle3-statistics-learning-model.js"),
  } : {
    model: root.STUDY_MATH_LEVEL_TEST_QUESTION_MODEL,
    mapper: root.STUDY_MATH_LEVEL_TEST_CONCEPT_MAPPER,
    high: root.STUDY_MATH_LEVEL_TEST_HIGHSCHOOL_BANKS,
    diagnostics: root.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS,
    sqrt: root.STUDY_MIDDLE3_SQRT_LEARNING_MODEL,
    factor: root.STUDY_MIDDLE3_FACTORIZATION_LEARNING_MODEL,
    equation: root.STUDY_MIDDLE3_QUADRATIC_EQUATION_LEARNING_MODEL,
    quadratic: root.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL,
    trig: root.STUDY_MIDDLE3_TRIGONOMETRIC_RATIO_LEARNING_MODEL,
    circle: root.STUDY_MIDDLE3_CIRCLE_PROPERTIES_LEARNING_MODEL,
    statistics: root.STUDY_MIDDLE3_STATISTICS_LEARNING_MODEL,
  };
  const api = factory(deps, root);
  if (commonJs) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_TEST_GRADE_BANKS = api;
})(typeof window !== "undefined" ? window : globalThis, function (deps, root) {
  "use strict";

  if (!deps.model || !deps.mapper || !deps.high) throw new Error("MATH_LEVEL_TEST_GRADE_BANK_DEPENDENCY_MISSING");

  const STATUS = Object.freeze({ READY: "READY", NOT_READY: "TEST_BANK_NOT_READY" });
  const GRADE_LABELS = Object.freeze({
    "초4": "G4", "초등 4학년": "G4", G4: "G4",
    "초5": "G5", "초등 5학년": "G5", G5: "G5",
    "초6": "G6", "초등 6학년": "G6", G6: "G6",
    "중1": "M1", "중등 1학년": "M1", M1: "M1",
    "중2": "M2", "중등 2학년": "M2", middle2: "M2", "8": "M2", M2: "M2",
    "중3": "M3", "중등 3학년": "M3", M3: "M3",
    "고1": "H1", "고등 1학년": "H1", H1: "H1",
    "고2": "H2", "고등 2학년": "H2", H2: "H2",
    "고3": "H3", "고등 3학년": "H3", H3: "H3",
  });
  const BANK_KEY_BY_GRADE = Object.freeze({ G4: "g4", G5: "g5", G6: "g6", M1: "m1", M2: "m2" });
  const SESSION_CONTRACTS = Object.freeze({
    G4: Object.freeze({ min: 21, max: 24, target: 24 }),
    G5: Object.freeze({ min: 24, max: 27, target: 27 }),
    G6: Object.freeze({ min: 24, max: 27, target: 27 }),
    M1: Object.freeze({ min: 27, max: 30, target: 30 }),
    M2: Object.freeze({ min: 27, max: 30, target: 30 }),
    M3: Object.freeze({ min: 32, max: 32, target: 32, continuousPoolContract: 998 }),
    H1: Object.freeze({ min: 30, max: 30, target: 30 }),
    H2: Object.freeze({ min: 30, max: 30, target: 30 }),
    H3: Object.freeze({ min: 24, max: 30, target: 27 }),
  });
  const EXCLUSION_REGISTRY = Object.freeze({
    MULTIPLE_ANSWERS: Object.freeze([
      "초5-factor_multiple-002", "초5-factor_multiple-038", "초5-factor_multiple-056", "초5-factor_multiple-092", "초5-factor_multiple-106",
      "초5-factor_multiple-133", "초5-factor_multiple-145", "초5-factor_multiple-166", "초5-factor_multiple-176",
    ]),
    MATH_ERROR: Object.freeze([
      "중2-system_equation-026", "중2-system_equation-056", "중2-system_equation-086", "중2-system_equation-116",
      "중2-system_equation-142", "중2-system_equation-167", "중2-system_equation-184", "중2-system_equation-199",
    ]),
    INSUFFICIENT_CONDITIONS: Object.freeze(["중2-system_equation-014", "중2-system_equation-132"]),
  });
  const EXCLUDED_IDS = new Set(Object.values(EXCLUSION_REGISTRY).flat());

  const MIDDLE3_UNIT_CONTRACTS = Object.freeze([
    Object.freeze({ unitName: "제곱근과 실수", models: ["sqrt"], conceptIds: Object.freeze(["m3_sqrt_meaning", "m3_sqrt_value", "m3_irrational_number", "m3_radical_simplification", "m3_radical_operations"]) }),
    Object.freeze({ unitName: "다항식의 곱셈과 인수분해", models: ["factor"], conceptIds: Object.freeze(["m3_polynomial_multiplication", "m3_multiplication_formula", "m3_common_factor", "m3_factor_perfect_square", "m3_factor_difference_squares", "m3_factor_sum_product"]) }),
    Object.freeze({ unitName: "이차방정식", models: ["equation"], conceptIds: Object.freeze(["m3_quadratic_meaning", "m3_quadratic_factor_solve", "m3_quadratic_sqrt_solve", "m3_quadratic_formula", "m3_quadratic_root_meaning", "m3_quadratic_word_setup"]) }),
    Object.freeze({ unitName: "이차함수", models: ["quadratic"], conceptIds: Object.freeze(["m3_quadratic_function_meaning", "m3_quadratic_graph_shape", "m3_quadratic_vertex_axis", "m3_quadratic_translation", "m3_quadratic_find_formula", "m3_quadratic_max_min"]) }),
    Object.freeze({ unitName: "피타고라스 정리", models: ["diagnostics"], conceptIds: Object.freeze(["m3_pythagorean_meaning", "m3_pythagorean_hypotenuse", "m3_pythagorean_leg", "m3_pythagorean_converse", "m3_coordinate_distance"]) }),
    Object.freeze({ unitName: "삼각비", models: ["trig"], conceptIds: Object.freeze(["m3_trig_meaning", "m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent", "m3_trig_special_angles", "m3_trig_length"]) }),
    Object.freeze({ unitName: "원의 성질", models: ["circle"], conceptIds: Object.freeze(["m3_circle_foundations", "m3_circle_chord", "m3_circle_tangent_radius", "m3_circle_tangent_segments", "m3_circle_central_inscribed", "m3_circle_same_arc"]) }),
    Object.freeze({ unitName: "통계", models: ["statistics"], conceptIds: Object.freeze(["m3_statistics_mean", "m3_statistics_median_mode", "m3_statistics_representative_range", "m3_statistics_frequency_graphs", "m3_statistics_variance", "m3_statistics_standard_deviation"]) }),
  ]);
  const MIDDLE3_REQUIRED_SUPPLEMENTAL_CONCEPT_IDS = Object.freeze(["m3_trig_special_angles", "m3_circle_foundations", "m3_statistics_representative_range", "m3_statistics_frequency_graphs"]);
  const DIAGNOSTIC_ROLES = Object.freeze(["BASIC_CONCEPT", "APPLICATION", "ERROR_DIAGNOSIS", "INDEPENDENT_CHECK"]);

  const normalizeGradeBand = (value) => GRADE_LABELS[String(value || "").trim()] || null;
  const generatedBanks = (options) => options?.generatedConceptBanks || root?.generatedConceptBanks || {};
  const sourceProblems = (name) => Array.isArray(deps[name]?.problems) ? deps[name].problems : [];

  function roundRobinSelect(items, target) {
    const groups = new Map();
    items.forEach((item) => {
      const key = item.canonicalConceptId || item.unitAliasId;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });
    const output = [];
    const seenStructures = new Set();
    let progress = true;
    while (output.length < target && progress) {
      progress = false;
      for (const queue of groups.values()) {
        let index = queue.findIndex((item) => !seenStructures.has(item.structureSignature));
        if (index < 0) index = queue.length ? 0 : -1;
        if (index < 0) continue;
        const [item] = queue.splice(index, 1);
        output.push(item);
        seenStructures.add(item.structureSignature);
        progress = true;
        if (output.length >= target) break;
      }
    }
    return output;
  }

  function buildExistingGradeSession(gradeBand, options = {}) {
    const source = generatedBanks(options)[BANK_KEY_BY_GRADE[gradeBand]] || [];
    const normalized = source
      .filter((item) => !EXCLUDED_IDS.has(item.problemId || item.questionId || item.id))
      .map((item) => deps.model.createLevelTestQuestion(item, { testGradeBand: gradeBand }))
      .filter((item) => item.canonicalConceptId && deps.model.validateLevelTestQuestion(item).valid);
    const target = SESSION_CONTRACTS[gradeBand].target;
    const questions = roundRobinSelect(normalized, target);
    if (questions.length !== target) return notReady(gradeBand, `선택한 학년의 진단 문제 구성을 준비하고 있습니다. (${questions.length}/${target})`);
    return Object.freeze({ status: STATUS.READY, gradeBand, bankId: `${gradeBand}_GENERATED`, targetLength: target, questions: Object.freeze(questions), sourcePoolSize: source.length, excludedCount: source.length - source.filter((item) => !EXCLUDED_IDS.has(item.problemId || item.questionId || item.id)).length });
  }

  function collectUnitCandidates(unit) {
    const allCandidates = unit.models.flatMap(sourceProblems).filter((problem) => unit.conceptIds.includes(problem.conceptId));
    const multipleChoice = allCandidates.filter((problem) => Array.isArray(problem.choices) && problem.choices.length >= 2);
    const candidates = multipleChoice.length >= 4 ? multipleChoice : allCandidates;
    const roleMatches = [
      (problem) => problem.stage === "BASIC" || Number(problem.difficulty) <= 1,
      (problem) => ["A1", "A2"].includes(problem.stage) || Number(problem.difficulty) === 2,
      (problem) => ["A2", "A3"].includes(problem.stage) || Number(problem.difficulty) >= 3,
      (problem) => problem.independentCheck === true,
    ];
    const seenConcept = new Set(), seenStructure = new Set();
    const selected = [];
    for (const matches of roleMatches) {
      let problem = candidates.find((item) => matches(item)
        && !seenConcept.has(item.conceptId)
        && !seenStructure.has(item.structureSignature || deps.model.normalizeStructureText(item.prompt || item.questionText || item.problem)));
      if (!problem) problem = candidates.find((item) => matches(item)
        && !seenStructure.has(item.structureSignature || deps.model.normalizeStructureText(item.prompt || item.questionText || item.problem)));
      if (!problem) continue;
      selected.push(problem);
      seenConcept.add(problem.conceptId);
      seenStructure.add(problem.structureSignature || deps.model.normalizeStructureText(problem.prompt || problem.questionText || problem.problem));
    }
    for (const problem of candidates) {
      if (selected.length === 4) break;
      const structure = problem.structureSignature || deps.model.normalizeStructureText(problem.prompt || problem.questionText || problem.problem);
      if (seenStructure.has(structure)) continue;
      selected.push(problem);
      seenConcept.add(problem.conceptId);
      seenStructure.add(structure);
    }
    return selected;
  }

  function buildMiddle3InitialDiagnostic() {
    const questions = [];
    for (const [unitIndex, unit] of MIDDLE3_UNIT_CONTRACTS.entries()) {
      const selected = collectUnitCandidates(unit);
      if (selected.length !== 4) return notReady("M3", `${unit.unitName} 세부 진단 문항을 준비하고 있습니다.`);
      selected.forEach((problem, questionIndex) => {
        const role = DIAGNOSTIC_ROLES[questionIndex];
        const normalized = deps.model.createLevelTestQuestion({ ...problem, unit: unit.unitName, domain: unit.unitName }, {
          testGradeBand: "M3", canonicalConceptId: problem.conceptId, independentCheck: questionIndex === 3, diagnosticRole: role,
        });
        questions.push(Object.freeze({
          ...normalized,
          id: `m3-initial-${unitIndex + 1}-${questionIndex + 1}-${normalized.problemId}`,
          questionId: normalized.problemId,
          grade: 9,
          stage: unitIndex + 1,
          diagnosticStage: "BASIC",
          stageTotal: 8,
          questionInStage: questionIndex + 1,
          questionTotalInStage: 4,
          diagnosticRole: role,
          independentCheck: questionIndex === 3,
          reviewStatus: "AUTO_APPROVED",
          executionStatus: "EXECUTABLE",
          mathValidation: Object.freeze({
            validatorId: "STATIC_MANIFEST_V1",
            conditionsComplete: true,
            expectedPrompt: normalized.prompt,
            expectedAnswer: normalized.answer,
            expectedChoices: normalized.choices,
            expectedAnswerType: normalized.answerType,
            expectedGrade: 9,
            expectedConceptId: normalized.conceptId,
            expectedStage: "BASIC",
          }),
        }));
      });
    }
    return Object.freeze({ status: STATUS.READY, gradeBand: "M3", bankId: "M3_CANONICAL_INITIAL_32", targetLength: 32, questions: Object.freeze(questions), unitContracts: MIDDLE3_UNIT_CONTRACTS, continuousPoolContract: 998, supplementalConceptIds: MIDDLE3_REQUIRED_SUPPLEMENTAL_CONCEPT_IDS });
  }

  function getMiddle3ContinuousPoolContract() {
    const supplementalProblems = [deps.trig, deps.circle, deps.statistics]
      .flatMap((model) => model?.problems || [])
      .filter((problem) => MIDDLE3_REQUIRED_SUPPLEMENTAL_CONCEPT_IDS.includes(problem.conceptId));
    return Object.freeze({ expectedLegacyPoolSize: 998, preserveCanonicalConceptIds: true, duplicateStructurePolicy: "COUNT_ONCE", requireMisconceptionTags: true, supplementalConceptIds: MIDDLE3_REQUIRED_SUPPLEMENTAL_CONCEPT_IDS, supplementalProblems: Object.freeze(supplementalProblems) });
  }

  function notReady(gradeBand, message) {
    return Object.freeze({ status: STATUS.NOT_READY, gradeBand, bankId: `${gradeBand || "UNKNOWN"}_NOT_READY`, targetLength: SESSION_CONTRACTS[gradeBand]?.target || 0, questions: Object.freeze([]), message });
  }

  function buildGradeTestSession(options = {}) {
    const gradeBand = normalizeGradeBand(options.selectedGrade || options.gradeBand);
    if (!gradeBand) return notReady(null, "선택한 학년의 수학 레벨테스트를 준비하고 있습니다.");
    if (BANK_KEY_BY_GRADE[gradeBand]) return buildExistingGradeSession(gradeBand, options);
    if (gradeBand === "M3") return buildMiddle3InitialDiagnostic();
    const high = deps.high.selectHighSchoolRoute(gradeBand, options.elective || null);
    return Object.freeze({ ...high, status: STATUS.NOT_READY });
  }

  return Object.freeze({ STATUS, GRADE_LABELS, BANK_KEY_BY_GRADE, SESSION_CONTRACTS, EXCLUSION_REGISTRY, EXCLUDED_IDS, MIDDLE3_UNIT_CONTRACTS, MIDDLE3_REQUIRED_SUPPLEMENTAL_CONCEPT_IDS, DIAGNOSTIC_ROLES, normalizeGradeBand, buildExistingGradeSession, buildMiddle3InitialDiagnostic, getMiddle3ContinuousPoolContract, buildGradeTestSession });
});
