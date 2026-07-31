(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_GRAPH_STATE = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STATE_VERSION = "math-concept-graph-runtime-state-v1";
  const CONCEPT_STATUSES = Object.freeze([
    "NOT_STARTED",
    "ENTRY_CHECK",
    "LEARNING",
    "REMEDIAL_REQUIRED",
    "REMEDIAL_ACTIVE",
    "RETURN_CHECK",
    "MASTERED",
    "BLOCKED_NO_CONTENT",
    "MAXIMUM_REACHED",
  ]);

  const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  function createMasteryRecord(overrides = {}) {
    return {
      status: "NOT_STARTED",
      basicProgress: 0,
      advancedProgress: 0,
      independentCheckPassed: false,
      correctStructureIds: [],
      correctSolutionPathIds: [],
      wrongStructureIds: [],
      misconceptionCounts: {},
      resolvedMisconceptionTags: [],
      giveupCount: 0,
      lastAttemptAt: null,
      ...clone(overrides),
    };
  }

  function createState(options = {}) {
    const timestamp = options.timestamp ?? 0;
    const activeConceptId = options.activeConceptId || null;
    const activeUnitName = options.activeUnitName || null;
    const masteryByConcept = clone(options.masteryByConcept || {});
    if (activeConceptId && !masteryByConcept[activeConceptId]) {
      masteryByConcept[activeConceptId] = createMasteryRecord({ status: "ENTRY_CHECK" });
    }
    return deepFreeze({
      graphVersion: options.graphVersion || null,
      stateVersion: STATE_VERSION,
      activeConceptId,
      activeUnitName,
      activePath: clone(options.activePath || (activeConceptId ? [activeConceptId] : [])),
      masteryByConcept,
      evidenceByConcept: clone(options.evidenceByConcept || {}),
      misconceptionEvidence: clone(options.misconceptionEvidence || {}),
      recoveryStack: clone(options.recoveryStack || []),
      returnCheckpoint: clone(options.returnCheckpoint || null),
      pendingRemedialConceptIds: clone(options.pendingRemedialConceptIds || []),
      completedRemedialConceptIds: clone(options.completedRemedialConceptIds || []),
      promotionCandidates: clone(options.promotionCandidates || []),
      blockedCandidates: clone(options.blockedCandidates || []),
      lastDecision: clone(options.lastDecision || null),
      decisionHistory: clone(options.decisionHistory || []),
      revision: Number.isInteger(options.revision) ? options.revision : 0,
      updatedAt: timestamp,
    });
  }

  function mutableCopy(state) {
    return clone(state);
  }

  function ensureMasteryRecord(draft, conceptId) {
    if (!draft.masteryByConcept[conceptId]) draft.masteryByConcept[conceptId] = createMasteryRecord();
    return draft.masteryByConcept[conceptId];
  }

  function commitState(previousState, draft, decision, timestamp) {
    const next = draft || mutableCopy(previousState);
    if (decision) {
      next.lastDecision = clone(decision);
      next.decisionHistory = [...(next.decisionHistory || []), clone(decision)].slice(-200);
    }
    next.revision = Number(previousState?.revision || 0) + 1;
    next.updatedAt = timestamp ?? previousState?.updatedAt ?? 0;
    next.stateVersion = STATE_VERSION;
    return deepFreeze(next);
  }

  function validateStateShape(state) {
    if (!state || typeof state !== "object") return false;
    const arrayFields = [
      "activePath", "recoveryStack", "pendingRemedialConceptIds",
      "completedRemedialConceptIds", "promotionCandidates", "blockedCandidates", "decisionHistory",
    ];
    if (arrayFields.some((field) => !Array.isArray(state[field]))) return false;
    if (!state.masteryByConcept || !state.evidenceByConcept || !state.misconceptionEvidence) return false;
    return Number.isInteger(state.revision) && state.revision >= 0;
  }

  return Object.freeze({
    STATE_VERSION,
    CONCEPT_STATUSES,
    clone,
    deepFreeze,
    createMasteryRecord,
    createState,
    mutableCopy,
    ensureMasteryRecord,
    commitState,
    validateStateShape,
  });
});
