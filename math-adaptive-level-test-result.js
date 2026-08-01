(function (root, factory) {
  const graph = typeof module === "object" && module.exports
    ? require("./math-concept-graph-data.js")
    : root.STUDY_MATH_CONCEPT_GRAPH;
  const gates = typeof module === "object" && module.exports
    ? require("./math-adaptive-level-test-grade-gates.js")
    : root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_GATES;
  const api = factory(graph, gates);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_RESULT = api;
})(typeof window !== "undefined" ? window : globalThis, function (graph, gates) {
  "use strict";

  const unique = (values) => [...new Set((values || []).filter(Boolean))];
  const displayName = (conceptId) => graph.conceptById[conceptId]?.displayName || null;
  const names = (conceptIds) => unique(conceptIds.map(displayName)).filter(Boolean);

  function wellUnderstoodConceptIds(state) {
    return Object.entries(state.evidenceByConcept || {})
      .filter(([, evidence]) => {
        const structures = new Set(evidence.filter((item) => item.result === "CORRECT").map((item) => item.structureSignature).filter(Boolean));
        const wrong = evidence.some((item) => item.result === "INCORRECT" || item.result === "GIVEUP");
        return structures.size >= 2 && !wrong;
      })
      .map(([conceptId]) => conceptId);
  }

  function nextChallengeIds(state) {
    if (state.upperBoundaryConcepts?.length) return state.upperBoundaryConcepts;
    const active = graph.conceptById[state.activeConceptId];
    return active ? [...active.nextConceptIds, ...active.transferConceptIds] : [];
  }

  function confidenceRows(state) {
    return Object.entries(state.confidenceByDomain || {}).map(([key, confidence]) => {
      const [gradeGate, domainId] = key.split(":");
      const domain = gates.getDomain(gradeGate, domainId);
      return Object.freeze({ area: domain?.displayName || "수학 개념", confidence });
    });
  }

  function buildStudentResult(state) {
    const startIds = state.recommendedStartConceptIds?.length
      ? state.recommendedStartConceptIds
      : state.activeConceptId ? [state.activeConceptId] : [];
    return Object.freeze({
      "잘 이해한 개념": Object.freeze(names(wellUnderstoodConceptIds(state))),
      "지금 시작할 학습": Object.freeze(names(startIds)),
      "먼저 보충할 개념": Object.freeze(names(state.prerequisiteGaps || [])),
      "다음에 도전할 개념": Object.freeze(names(nextChallengeIds(state))),
      "영역별 진단 신뢰도": Object.freeze(confidenceRows(state)),
    });
  }

  return Object.freeze({ wellUnderstoodConceptIds, buildStudentResult });
});
