(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STATE = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "math-adaptive-level-test-state-v1";
  const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  function createInitialAdaptiveState(options = {}) {
    const timestamp = options.timestamp ?? 0;
    return deepFreeze({
      stateVersion: VERSION,
      mode: "ADAPTIVE_FROM_G4",
      phase: "GRADE_GATE",
      currentGradeGate: "G4",
      currentDomain: null,
      activeConceptId: null,
      testedConceptIds: [],
      evidenceByConcept: {},
      passedGradeGates: [],
      failedGradeGates: [],
      prerequisiteGaps: [],
      upperBoundaryConcepts: [],
      lowerBoundaryConcepts: [],
      recommendedStartConceptIds: [],
      blockedNoContentConceptIds: [],
      totalQuestions: 0,
      estimatedDuration: 0,
      confidenceByDomain: {},
      domainStatusByGrade: {},
      answeredProblemIds: [],
      answeredSubmissionIds: [],
      seenStructureSignatures: [],
      pendingConfirmation: null,
      pendingRemediation: null,
      graphState: null,
      lastDecision: null,
      decisionHistory: [],
      completed: false,
      completionReason: null,
      revision: 0,
      updatedAt: timestamp,
      ...clone(options.overrides || {}),
    });
  }

  function commit(previous, mutator, decision, timestamp) {
    const next = clone(previous);
    mutator?.(next);
    if (decision) {
      next.lastDecision = clone(decision);
      next.decisionHistory = [...next.decisionHistory, clone(decision)].slice(-200);
    }
    next.revision = Number(previous.revision || 0) + 1;
    next.updatedAt = timestamp ?? previous.updatedAt ?? 0;
    return deepFreeze(next);
  }

  function serializeAdaptiveState(state) {
    return JSON.stringify(state);
  }

  function hydrateAdaptiveState(serialized, options = {}) {
    try {
      const parsed = typeof serialized === "string" ? JSON.parse(serialized) : clone(serialized);
      if (!parsed || parsed.stateVersion !== VERSION || parsed.mode !== "ADAPTIVE_FROM_G4") return createInitialAdaptiveState(options);
      return deepFreeze(parsed);
    } catch {
      return createInitialAdaptiveState(options);
    }
  }

  return Object.freeze({ VERSION, clone, deepFreeze, createInitialAdaptiveState, commit, serializeAdaptiveState, hydrateAdaptiveState });
});
