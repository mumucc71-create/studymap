(function (root, factory) {
  const gates = typeof module === "object" && module.exports
    ? require("./math-adaptive-level-test-grade-gates.js")
    : root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_GATES;
  const api = factory(gates);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_SELECTOR = api;
})(typeof window !== "undefined" ? window : globalThis, function (gates) {
  "use strict";
  if (!gates) throw new Error("MATH_ADAPTIVE_SELECTOR_GATE_MISSING");
  const TERMINAL_DOMAIN_STATUSES = new Set(["PASSED", "FAILED", "BLOCKED_NO_CONTENT"]);

  function createQuestionCatalog(input = {}) {
    const sessions = input.sessions || input;
    const byGrade = {};
    Object.entries(sessions || {}).forEach(([gradeBand, session]) => {
      const questions = Array.isArray(session) ? session : session?.questions || [];
      byGrade[gradeBand] = Object.freeze(questions.filter((question) => question?.problemId || question?.id));
    });
    return Object.freeze({ byGrade: Object.freeze(byGrade) });
  }

  function evidenceForDomain(state, gradeGate, domain) {
    const evidence = domain.conceptIds.flatMap((conceptId) => state.evidenceByConcept[conceptId] || []);
    return evidence.filter((item) => item.gradeGate === gradeGate && item.finalSubmission !== false);
  }

  function unresolvedDomain(state) {
    const statuses = state.domainStatusByGrade[state.currentGradeGate] || {};
    return gates.getGateDomains(state.currentGradeGate).find((domain) => !TERMINAL_DOMAIN_STATUSES.has(statuses[domain.domainId])) || null;
  }

  function selectFromCandidates(state, candidates, purpose) {
    const answered = new Set(state.answeredProblemIds);
    const structures = new Set(state.seenStructureSignatures);
    const available = candidates.filter((question) => !answered.has(question.problemId || question.id)
      && !structures.has(question.structureSignature));
    if (!available.length) return Object.freeze({ status: "NO_AVAILABLE_QUESTION", purpose, question: null });
    const sorted = [...available].sort((a, b) => Number(a.difficulty || 1) - Number(b.difficulty || 1)
      || String(a.problemId || a.id).localeCompare(String(b.problemId || b.id)));
    return Object.freeze({ status: "QUESTION_SELECTED", purpose, question: sorted[0] });
  }

  function selectNextAdaptiveQuestion(state, catalog) {
    if (state.completed) return Object.freeze({ status: "TEST_COMPLETED", question: null });
    const allQuestions = Object.values(catalog?.byGrade || {}).flat();
    if (state.pendingRemediation?.conceptId) {
      return selectFromCandidates(state, allQuestions.filter((question) => question.canonicalConceptId === state.pendingRemediation.conceptId), "PREREQUISITE_CHECK");
    }
    if (state.phase === "CONCEPT_GRAPH" && state.activeConceptId) {
      return selectFromCandidates(state, allQuestions.filter((question) => question.canonicalConceptId === state.activeConceptId), "GRAPH_BOUNDARY_CHECK");
    }
    const domain = gates.getDomain(state.currentGradeGate, state.currentDomain) || unresolvedDomain(state);
    if (!domain) return Object.freeze({ status: "GRADE_GATE_COMPLETE", question: null });
    const gradeQuestions = catalog?.byGrade?.[state.currentGradeGate] || [];
    const candidates = gradeQuestions.filter((question) => domain.conceptIds.includes(question.canonicalConceptId));
    const evidence = evidenceForDomain(state, state.currentGradeGate, domain);
    const purpose = state.pendingConfirmation?.domainId === domain.domainId || evidence.length >= 2 ? "CONFIRMATION" : "GRADE_GATE";
    const selected = selectFromCandidates(state, candidates, purpose);
    return Object.freeze({ ...selected, gradeGate: state.currentGradeGate, domainId: domain.domainId, conceptIds: domain.conceptIds });
  }

  return Object.freeze({ createQuestionCatalog, evidenceForDomain, unresolvedDomain, selectNextAdaptiveQuestion });
});
