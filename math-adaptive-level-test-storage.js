(function (root, factory) {
  const stateApi = typeof module === "object" && module.exports
    ? require("./math-adaptive-level-test-state.js")
    : root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STATE;
  const api = factory(stateApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE = api;
})(typeof window !== "undefined" ? window : globalThis, function (stateApi) {
  "use strict";

  const VERSION = "math-adaptive-level-test-storage-v1";
  const MODE = "ADAPTIVE_CONCEPT_DIAGNOSIS";
  const CLOUD_KEY = "mathAdaptiveLevelTestV1";
  const LOCAL_PREFIX = "studyCoinMathAdaptiveLevelTestV1";
  const STATUS = Object.freeze(["NOT_STARTED", "IN_PROGRESS", "PAUSED", "COMPLETED", "TEST_BANK_NOT_READY", "BLOCKED_NO_CONTENT"]);
  const clone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
  const freeze = (value) => stateApi.deepFreeze(value);
  const localStorageKey = (userId) => `${LOCAL_PREFIX}:${String(userId || "guest").trim() || "guest"}`;

  function graphFields(graphState) {
    const keys = ["currentGradeGate", "currentDomain", "activeConceptId", "testedConceptIds", "evidenceByConcept", "passedGradeGates", "failedGradeGates", "prerequisiteGaps", "upperBoundaryConcepts", "lowerBoundaryConcepts", "recommendedStartConceptIds", "blockedNoContentConceptIds", "totalQuestions", "estimatedDuration", "confidenceByDomain", "decisionHistory"];
    return Object.fromEntries(keys.map((key) => [key, clone(graphState?.[key]) ?? null]));
  }

  function createSession(options = {}) {
    const graphState = options.graphState || stateApi.createInitialAdaptiveState({ timestamp: options.timestamp ?? 0 });
    const timestamp = options.timestamp ?? graphState.updatedAt ?? 0;
    return freeze({
      storageVersion: VERSION,
      sessionId: String(options.sessionId || `adaptive-${timestamp}`),
      mode: MODE,
      graphState: clone(graphState),
      ...graphFields(graphState),
      currentQuestion: clone(options.currentQuestion || null),
      answeredSubmissionIds: [...new Set(options.answeredSubmissionIds || [])],
      remainingPath: clone(options.remainingPath || []),
      result: clone(options.result || null),
      history: clone(options.history || []),
      status: STATUS.includes(options.status) ? options.status : "IN_PROGRESS",
      revision: Number(options.revision ?? graphState.revision ?? 0),
      remoteRevision: Number(options.remoteRevision ?? 0),
      updatedAt: timestamp,
    });
  }

  function updateSession(previous, changes = {}, timestamp = previous.updatedAt) {
    const graphState = changes.graphState || previous.graphState;
    return createSession({
      ...clone(previous),
      ...clone(changes),
      graphState,
      revision: Number(previous.revision || 0) + 1,
      updatedAt: timestamp,
    });
  }

  function isValidSession(value) {
    return Boolean(value && value.storageVersion === VERSION && value.mode === MODE && STATUS.includes(value.status)
      && value.sessionId && value.graphState && Number.isFinite(Number(value.revision)));
  }

  function isMeaningfulSession(value) {
    return isValidSession(value) && (value.status !== "NOT_STARTED" || Number(value.totalQuestions) > 0 || value.currentQuestion || value.history?.length);
  }

  function parse(value) {
    try { return typeof value === "string" ? JSON.parse(value) : clone(value); } catch { return null; }
  }

  function loadLocal(storage, userId) {
    const parsed = parse(storage?.getItem?.(localStorageKey(userId)));
    return isValidSession(parsed) ? freeze(parsed) : null;
  }

  function saveLocal(storage, userId, session) {
    if (!isValidSession(session)) return false;
    storage?.setItem?.(localStorageKey(userId), JSON.stringify(session));
    return true;
  }

  function removeLocal(storage, userId) { storage?.removeItem?.(localStorageKey(userId)); }

  function resolveRemoteWins(local, remote) {
    const validLocal = isValidSession(local) ? local : null;
    const validRemote = isValidSession(remote) ? remote : null;
    if (validRemote) return Object.freeze({ source: "REMOTE", state: freeze(clone(validRemote)) });
    if (validLocal) return Object.freeze({ source: "LOCAL", state: freeze(clone(validLocal)) });
    return Object.freeze({ source: "EMPTY", state: null });
  }

  async function hydrate(options = {}) {
    const local = loadLocal(options.storage, options.userId);
    let remote = null;
    if (options.cloud?.loadUserState) {
      try { remote = await options.cloud.loadUserState(CLOUD_KEY); } catch { remote = null; }
    }
    const resolved = resolveRemoteWins(local, remote);
    if (resolved.state) saveLocal(options.storage, options.userId, resolved.state);
    return resolved;
  }

  async function persist(options = {}) {
    const session = options.session;
    if (!isValidSession(session)) return Object.freeze({ saved: false, reason: "INVALID_STATE" });
    const existingLocal = loadLocal(options.storage, options.userId);
    if (existingLocal && Number(existingLocal.revision) > Number(session.revision)) {
      return Object.freeze({ saved: false, reason: "LOCAL_REVISION_CONFLICT", state: existingLocal });
    }
    if (options.cloud?.loadUserState && options.cloud?.saveUserState) {
      let remote = null;
      try { remote = await options.cloud.loadUserState(CLOUD_KEY); } catch { remote = null; }
      if (isMeaningfulSession(remote) && Number(remote.revision) > Number(session.revision)) {
        saveLocal(options.storage, options.userId, remote);
        return Object.freeze({ saved: false, reason: "REMOTE_REVISION_CONFLICT", state: freeze(clone(remote)) });
      }
      if (!isMeaningfulSession(session) && isMeaningfulSession(remote)) {
        return Object.freeze({ saved: false, reason: "EMPTY_STATE_BLOCKED", state: freeze(clone(remote)) });
      }
      try {
        const saved = await options.cloud.saveUserState(CLOUD_KEY, session);
        if (saved === false) return Object.freeze({ saved: false, reason: "REMOTE_SAVE_FAILED" });
      } catch {
        saveLocal(options.storage, options.userId, session);
        return Object.freeze({ saved: true, remoteSaved: false, reason: "LOCAL_FALLBACK", state: session });
      }
    }
    saveLocal(options.storage, options.userId, session);
    return Object.freeze({ saved: true, remoteSaved: Boolean(options.cloud?.saveUserState), reason: "SAVED", state: session });
  }

  function startNewSession(previous, options = {}) {
    const history = [...(previous?.history || [])];
    if (previous?.status === "COMPLETED") history.push({ sessionId: previous.sessionId, result: clone(previous.result), completedAt: previous.updatedAt });
    return createSession({ ...options, history });
  }

  return Object.freeze({ VERSION, MODE, CLOUD_KEY, LOCAL_PREFIX, STATUS, localStorageKey, graphFields, createSession, updateSession, isValidSession, isMeaningfulSession, loadLocal, saveLocal, removeLocal, resolveRemoteWins, hydrate, persist, startNewSession });
});
