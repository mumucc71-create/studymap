(function (root, factory) {
  const runtime = typeof module === "object" && module.exports
    ? require("./math-concept-graph-runtime.js") : root.STUDY_MATH_CONCEPT_GRAPH_RUNTIME;
  const api = factory(runtime, root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_GRAPH_STORAGE = api;
})(typeof window !== "undefined" ? window : globalThis, function (runtime, root) {
  "use strict";

  if (!runtime) throw new Error("MATH_CONCEPT_GRAPH_STORAGE_DEPENDENCY_MISSING");
  const CLOUD_KEY = "mathConceptGraphLearningV1";
  const LOCAL_STORAGE_KEY = "studyCoinMathConceptGraphLearningV1";

  const safeClone = (value) => value == null ? value : JSON.parse(JSON.stringify(value));
  const meaningfulState = (state) => Boolean(state && typeof state === "object" && (
    state.activeConceptId || Object.keys(state.evidenceByConcept || {}).length || Number(state.revision || 0) > 0
  ));

  function createGraphStorage(options = {}) {
    const local = options.localStorage || root?.localStorage || null;
    const cloud = options.cloudAuth || root?.STUDY_CLOUD_AUTH || null;
    const now = options.now || (() => Date.now());
    const userIdProvider = options.userIdProvider || (() => null);
    let knownRemoteRevision = null;
    let lastHydration = "NOT_STARTED";

    const localKey = () => {
      const userId = String(userIdProvider() || "guest").trim() || "guest";
      return `${LOCAL_STORAGE_KEY}:${userId}`;
    };
    const shouldUseCloud = () => Boolean(cloud?.loadUserState && cloud?.saveUserState
      && String(userIdProvider() || "guest") !== "guest" && cloud.stateSyncEnabled !== false);

    function readLocal() {
      if (!local) return null;
      try {
        const raw = local.getItem(localKey());
        return raw ? runtime.hydrateGraphState(raw) : null;
      } catch { return null; }
    }

    function writeLocal(state) {
      if (!local || !meaningfulState(state)) return false;
      local.setItem(localKey(), runtime.serializeGraphState(state));
      return true;
    }

    async function hydrate(optionsForHydrate = {}) {
      const localState = readLocal();
      if (!shouldUseCloud()) {
        lastHydration = localState ? "LOCAL_ONLY" : "EMPTY";
        return localState || runtime.createInitialGraphState({ timestamp: optionsForHydrate.timestamp ?? now() });
      }
      try {
        const remoteRaw = await cloud.loadUserState(CLOUD_KEY);
        const remoteState = remoteRaw && meaningfulState(remoteRaw)
          ? runtime.hydrateGraphState(remoteRaw) : null;
        if (remoteState) {
          knownRemoteRevision = remoteState.revision;
          writeLocal(remoteState);
          lastHydration = "REMOTE_WINS";
          return remoteState;
        }
        knownRemoteRevision = localState?.revision ?? 0;
        lastHydration = localState ? "LOCAL_FALLBACK" : "EMPTY";
        return localState || runtime.createInitialGraphState({ timestamp: optionsForHydrate.timestamp ?? now() });
      } catch {
        lastHydration = localState ? "REMOTE_FAILED_LOCAL_FALLBACK" : "REMOTE_FAILED_EMPTY";
        return localState || runtime.createInitialGraphState({ timestamp: optionsForHydrate.timestamp ?? now() });
      }
    }

    async function save(state, saveOptions = {}) {
      if (!meaningfulState(state)) return { saved: false, status: "EMPTY_STATE_BLOCKED", state };
      const expected = saveOptions.expectedRevision;
      if (Number.isInteger(expected) && Number.isInteger(knownRemoteRevision) && expected !== knownRemoteRevision) {
        return { saved: false, status: "REVISION_CONFLICT", remoteRevision: knownRemoteRevision, state };
      }
      writeLocal(state);
      if (!shouldUseCloud()) return { saved: true, status: "LOCAL_ONLY", state };
      const cloudSaved = await cloud.saveUserState(CLOUD_KEY, safeClone(state));
      if (cloudSaved === false) return { saved: false, status: "CLOUD_SAVE_FAILED", state };
      knownRemoteRevision = state.revision;
      return { saved: true, status: "SAVED", state };
    }

    return Object.freeze({
      CLOUD_KEY, LOCAL_STORAGE_KEY, localKey, readLocal, writeLocal, hydrate, save,
      getHydrationStatus: () => lastHydration,
      getKnownRemoteRevision: () => knownRemoteRevision,
    });
  }

  return Object.freeze({ CLOUD_KEY, LOCAL_STORAGE_KEY, meaningfulState, createGraphStorage });
});
