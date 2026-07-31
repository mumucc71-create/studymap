(function (root, factory) {
  const graph = typeof module === "object" && module.exports
    ? require("./math-concept-graph-data.js") : root.STUDY_MATH_CONCEPT_GRAPH;
  const aliases = typeof module === "object" && module.exports
    ? require("./math-concept-alias-registry.js") : root.STUDY_MATH_CONCEPT_ALIASES;
  const runtime = typeof module === "object" && module.exports
    ? require("./math-concept-graph-runtime.js") : root.STUDY_MATH_CONCEPT_GRAPH_RUNTIME;
  const api = factory(graph, aliases, runtime);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_TEST_CONCEPT_MAPPER = api;
})(typeof window !== "undefined" ? window : globalThis, function (graph, aliases, runtime) {
  "use strict";

  if (!graph || !aliases || !runtime) throw new Error("MATH_LEVEL_TEST_MAPPER_DEPENDENCY_MISSING");

  const LABEL_TO_ID = Object.freeze({
    "큰 수": "large_numbers", "큰 수와 자릿값": "large_numbers", "곱셈과 나눗셈": "multi_digit_multiplication_division",
    "분수의 덧셈과 뺄셈": "fraction_add_sub", "소수의 덧셈과 뺄셈": "decimal_add_sub", "각도": "angle_basic",
    "도형의 이동": "shape_transformation", "막대그래프": "bar_graph", "혼합 계산": "mixed_calculation",
    "약수와 배수": "factor_multiple", "약분과 통분": "reduction_common_denominator", "분수의 곱셈": "fraction_multiplication",
    "분수의 나눗셈": "fraction_division", "소수의 나눗셈": "decimal_division", "비와 비율": "ratio",
    "비례식": "proportion", "소인수분해": "prime_factorization", "정수와 유리수": "integers_rationals",
    "문자와 식": "algebra_expression", "문자식": "algebra_expression", "일차방정식": "linear_equation",
    "좌표평면": "coordinate_plane", "정비례와 반비례": "direct_inverse", "식의 계산": "expression",
    "연립일차방정식": "system_equation", "일차함수": "linear_function", "확률": "probability",
    "삼각형의 성질": "triangle", "제곱근과 실수": "real_numbers", "다항식의 곱셈과 인수분해": "factorization",
    "인수분해": "factorization", "이차방정식": "quadratic_equation", "이차함수": "quadratic_function",
    "삼각비": "trigonometric_ratio", "원의 성질": "circle", "통계": "statistics_basic",
    "표와 그래프": "bar_graph", "평균": "m3_statistics_mean", "중앙값과 최빈값": "m3_statistics_median_mode",
    "분산": "m3_statistics_variance", "표준편차": "m3_statistics_standard_deviation",
  });

  const asArray = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
  const unique = (values) => [...new Set(values.filter(Boolean))];
  const normalizedText = (value) => String(value || "").trim();
  const GRADE_BAND_BY_LABEL = Object.freeze({
    "초등 4학년": "G4", "초등 5학년": "G5", "초등 6학년": "G6",
    "중등 1학년": "M1", "중등 2학년": "M2", "중등 3학년": "M3",
    "고등 1학년": "H1", "고등 2학년": "H2", "고등 3학년": "H3",
  });
  const normalizeGradeBand = (value) => GRADE_BAND_BY_LABEL[normalizedText(value)] || normalizedText(value);

  function candidateIds(question = {}) {
    return unique([
      question.canonicalConceptId, question.detailConceptId, question.conceptId,
      question.concept, question.unitName, question.unit, question.topic, question.title,
    ].map((value) => LABEL_TO_ID[normalizedText(value)] || normalizedText(value)));
  }

  function mapLevelTestQuestionToConceptIds(question = {}) {
    const candidates = candidateIds(question);
    for (const candidate of candidates) {
      const detail = runtime.normalizeConceptId(candidate, question);
      if (detail.canonicalConceptId) {
        return Object.freeze({
          status: "MAPPED", sourceConceptId: candidate,
          canonicalConceptIds: Object.freeze([detail.canonicalConceptId]), unitAliasId: null,
        });
      }
      if (detail.status === "UNIT_ALIAS") {
        return Object.freeze({
          status: "UNIT_ALIAS_ONLY", sourceConceptId: candidate, canonicalConceptIds: Object.freeze([]),
          unitAliasId: detail.unitAliasId, targetConceptIds: Object.freeze([...detail.targetConceptIds]),
        });
      }
    }
    return Object.freeze({ status: "UNKNOWN_CONCEPT", sourceConceptId: candidates[0] || null, canonicalConceptIds: Object.freeze([]), unitAliasId: null });
  }

  function resultValue(result = {}) {
    if (result.result) return result.result;
    if (result.correct === true || result.outcome === "CORRECT" || result.outcome === "correct") return "CORRECT";
    if (result.reviewRequired === true || result.outcome === "REVIEW_REQUIRED") return "REVIEW_REQUIRED";
    if (result.giveup === true || result.outcome === "GIVEUP" || result.outcome === "giveup" || result.outcome === "SOLUTION_VIEWED") return "GIVEUP";
    return "INCORRECT";
  }

  function convertLevelTestResultToEvidence(result = {}, options = {}) {
    const question = result.question || result;
    const mapping = mapLevelTestQuestionToConceptIds(question);
    const shared = {
      correct: resultValue(result) === "CORRECT", incorrect: resultValue(result) === "INCORRECT",
      result: resultValue(result), misconceptionTags: unique(asArray(result.misconceptionTags || question.misconceptionTags)),
      problemId: normalizedText(result.problemId || question.problemId || question.id),
      structureSignature: normalizedText(result.structureSignature || question.structureSignature || `level-test:${result.problemId || question.id || "unknown"}:structure`),
      solutionPathSignature: normalizedText(result.solutionPathSignature || question.solutionPathSignature || `level-test:${result.problemId || question.id || "unknown"}:path`),
      testGradeBand: normalizeGradeBand(options.testGradeBand || result.testGradeBand || result.selectedGrade || question.gradeBand),
      difficulty: normalizedText(result.difficulty || question.difficulty || question.level || "BASIC"),
      timestamp: result.timestamp ?? options.timestamp ?? 0,
      independentCheck: result.independentCheck === true || question.independentCheck === true,
      finalSubmission: result.finalSubmission !== false,
      submissionId: normalizedText(result.submissionId || `level-test:${result.problemId || question.id || "unknown"}`),
    };
    if (mapping.status === "MAPPED") {
      return mapping.canonicalConceptIds.map((canonicalConceptId) => Object.freeze({ ...shared, canonicalConceptId, conceptId: canonicalConceptId, unitAliasId: null }));
    }
    if (mapping.status === "UNIT_ALIAS_ONLY") {
      return [Object.freeze({ ...shared, canonicalConceptId: null, conceptId: mapping.unitAliasId, unitAliasId: mapping.unitAliasId })];
    }
    return [Object.freeze({ ...shared, canonicalConceptId: null, conceptId: mapping.sourceConceptId, unitAliasId: null, status: "UNKNOWN_CONCEPT" })];
  }

  function evidenceKey(item) {
    return item.submissionId || [item.problemId, item.canonicalConceptId || item.unitAliasId || item.conceptId, item.structureSignature].join("|");
  }

  function mergeLevelTestEvidence(existing = [], incoming = []) {
    const output = [];
    const seen = new Set();
    [...existing, ...incoming].forEach((item) => {
      const key = evidenceKey(item || {});
      if (!item || seen.has(key)) return;
      seen.add(key);
      output.push(Object.freeze({ ...item }));
    });
    return Object.freeze(output);
  }

  function calculateInitialConceptMastery(evidence = []) {
    const grouped = {};
    evidence.filter((item) => item?.canonicalConceptId).forEach((item) => {
      (grouped[item.canonicalConceptId] ||= []).push(item);
    });
    return Object.freeze(Object.fromEntries(Object.entries(grouped).map(([conceptId, items]) => {
      const valid = items.filter((item) => item.result !== "REVIEW_REQUIRED");
      const correct = valid.filter((item) => item.result === "CORRECT");
      const wrong = valid.filter((item) => item.result === "INCORRECT" || item.result === "GIVEUP");
      const structures = unique(correct.map((item) => item.structureSignature));
      const paths = unique(correct.map((item) => item.solutionPathSignature));
      const independent = correct.some((item) => item.independentCheck);
      const status = structures.length >= 3 && paths.length >= 3 && independent && wrong.length === 0 ? "MASTERED"
        : correct.length > 0 || wrong.length > 0 ? "LEARNING" : "ENTRY_CHECK";
      return [conceptId, Object.freeze({ conceptId, status, evidenceCount: items.length, correctCount: correct.length, incorrectCount: wrong.length,
        accuracy: valid.length ? correct.length / valid.length : 0, correctStructureIds: Object.freeze(structures), correctSolutionPathIds: Object.freeze(paths), independentCheckPassed: independent })];
    })));
  }

  const autoAvailable = (node) => node?.contentAvailability === "COMPLETE_SPRING" && node?.runtimeAvailability === "DEDICATED_SPRING";

  function graphDistanceToMiddle3(conceptId) {
    const start = graph.conceptById[conceptId];
    if (!start) return 999;
    if (start.internalGradeBand === "M3") return 0;
    const order = graph.GRADE_BANDS;
    return Math.abs(order.indexOf(start.internalGradeBand) - order.indexOf("M3"));
  }

  function closestAvailableConcept(startIds) {
    const queue = unique(startIds).map((conceptId) => [conceptId, 0]);
    const seen = new Set();
    const available = [];
    while (queue.length) {
      const [conceptId, distance] = queue.shift();
      if (seen.has(conceptId) || distance > 8) continue;
      seen.add(conceptId);
      const node = graph.conceptById[conceptId];
      if (!node) continue;
      if (autoAvailable(node)) available.push({ conceptId, distance });
      [...node.prerequisiteConceptIds, ...node.nextConceptIds, ...node.remedialConceptIds]
        .forEach((next) => { if (!seen.has(next)) queue.push([next, distance + 1]); });
    }
    return available.sort((a, b) => a.distance - b.distance || graphDistanceToMiddle3(a.conceptId) - graphDistanceToMiddle3(b.conceptId) || a.conceptId.localeCompare(b.conceptId))[0]?.conceptId || null;
  }

  function selectInitialLearningConcept(evidence = [], options = {}) {
    const mastery = options.masteryByConcept || calculateInitialConceptMastery(evidence);
    const candidates = Object.values(mastery).sort((a, b) => {
      const aPartial = a.correctCount > 0 && a.incorrectCount > 0 ? 0 : a.status === "LEARNING" ? 1 : 2;
      const bPartial = b.correctCount > 0 && b.incorrectCount > 0 ? 0 : b.status === "LEARNING" ? 1 : 2;
      const aNode = graph.conceptById[a.conceptId], bNode = graph.conceptById[b.conceptId];
      return aPartial - bPartial || Number(autoAvailable(bNode)) - Number(autoAvailable(aNode))
        || graphDistanceToMiddle3(a.conceptId) - graphDistanceToMiddle3(b.conceptId) || b.evidenceCount - a.evidenceCount;
    });
    const blockedCandidates = [];
    let activeConceptId = candidates.find((item) => autoAvailable(graph.conceptById[item.conceptId]))?.conceptId || null;
    if (!activeConceptId && candidates.length) {
      blockedCandidates.push(...candidates.map((item) => item.conceptId));
      activeConceptId = closestAvailableConcept(candidates.map((item) => item.conceptId));
    }
    if (!activeConceptId) activeConceptId = "m3_sqrt_meaning";
    const active = graph.conceptById[activeConceptId];
    const weakest = candidates.filter((item) => item.incorrectCount > 0).sort((a, b) => a.accuracy - b.accuracy)[0];
    const reviewConceptId = weakest?.conceptId || active?.prerequisiteConceptIds.find((id) => autoAvailable(graph.conceptById[id])) || null;
    const foundationConceptId = reviewConceptId ? graph.conceptById[reviewConceptId]?.remedialConceptIds.find((id) => autoAvailable(graph.conceptById[id])) || null : null;
    const nextConceptId = active?.nextConceptIds.find((id) => autoAvailable(graph.conceptById[id])) || null;
    return Object.freeze({
      activeConceptId, reviewConceptId, foundationConceptId, nextConceptId,
      blockedCandidates: Object.freeze(unique(blockedCandidates)), selectedGrade: options.selectedGrade || null,
    });
  }

  return Object.freeze({
    LABEL_TO_ID, GRADE_BAND_BY_LABEL, normalizeGradeBand, mapLevelTestQuestionToConceptIds, convertLevelTestResultToEvidence,
    mergeLevelTestEvidence, calculateInitialConceptMastery, selectInitialLearningConcept,
  });
});
