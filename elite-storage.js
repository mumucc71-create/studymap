(function initEliteStorage(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_STORAGE = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteStorageModule() {
  "use strict";

  const CACHE_PREFIX = "studyEliteAssessmentV1";
  const STATE_KEYS = Object.freeze({
    math: "eliteAssessment-math-middle3",
    english: "eliteAssessment-english-middle3",
  });
  const AUTH_STATES = Object.freeze({
    AUTH_CHECKING: "AUTH_CHECKING",
    AUTHENTICATED: "AUTHENTICATED",
    ANONYMOUS_AUTHENTICATED: "ANONYMOUS_AUTHENTICATED",
    UNAUTHENTICATED: "UNAUTHENTICATED",
    AUTH_ERROR: "AUTH_ERROR",
  });

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function subjectKey(value) {
    if (["math", "수학"].includes(value)) return "math";
    if (["english", "영어"].includes(value)) return "english";
    return null;
  }

  function stateKey(subject) {
    const normalized = subjectKey(subject);
    if (!normalized) throw new Error(`ELITE_SUBJECT_NOT_ALLOWED:${subject}`);
    return STATE_KEYS[normalized];
  }

  function cacheKey(uid, subject) {
    if (!uid) throw new Error("ELITE_AUTH_REQUIRED");
    return `${CACHE_PREFIX}:${uid}:${subjectKey(subject)}:middle3`;
  }

  function sanitizeRemote(value) {
    if (Array.isArray(value)) return value.map(sanitizeRemote);
    if (!value || typeof value !== "object") return value;
    if (typeof value.toDate === "function") return value.toDate().toISOString();
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !["syncedAt"].includes(key))
      .map(([key, item]) => [key, sanitizeRemote(item)]));
  }

  function validState(value, subject) {
    return Boolean(
      value
      && typeof value === "object"
      && value.eliteVersion
      && subjectKey(value.subject) === subjectKey(subject)
      && value.gradeOrLevel === "middle3"
    );
  }

  function readAppAccount(local) {
    if (!local) return null;
    try {
      const userId = String(local.getItem("studyCoinCurrentUser") || "").trim();
      if (!userId) return null;
      const users = JSON.parse(local.getItem("studyCoinAuth") || "{}") || {};
      const record = users[userId] || {};
      const provider = String(record.provider || "local");
      return {
        id: userId,
        uid: String(record.uid || userId),
        provider,
        isAnonymous: Boolean(record.isAnonymous) || provider === "anonymous",
        source: "APP_SESSION",
      };
    } catch {
      return null;
    }
  }

  function createStorage(options = {}) {
    const cloud = options.cloudAuth || (typeof window !== "undefined" ? window.STUDY_CLOUD_AUTH : null);
    const local = options.localStorage || (typeof localStorage !== "undefined" ? localStorage : null);
    const getAccount = options.getAccount || (async () => cloud?.restoreSession?.());
    let hydrationStatus = "NOT_STARTED";
    let authStatus = AUTH_STATES.AUTH_CHECKING;
    let currentUid = null;
    let currentSubject = null;
    let remoteEnabled = false;
    let lastError = null;
    let lastRemoteRevision = 0;
    const conflicts = [];

    function readLocal(uid, subject) {
      if (!local) return null;
      try {
        const parsed = JSON.parse(local.getItem(cacheKey(uid, subject)) || "null");
        return validState(parsed, subject) ? parsed : null;
      } catch {
        return null;
      }
    }

    function writeLocal(state) {
      if (!local || !currentUid || !validState(state, currentSubject)) return false;
      local.setItem(cacheKey(currentUid, currentSubject), JSON.stringify(state));
      return true;
    }

    async function authenticatedAccount() {
      authStatus = AUTH_STATES.AUTH_CHECKING;
      lastError = null;
      let cloudAccount = null;
      let cloudError = null;
      if (cloud?.isConfigured && cloud?.stateSyncEnabled) {
        try {
          cloudAccount = await getAccount();
        } catch (error) {
          cloudError = error;
        }
      }
      const account = cloudAccount?.uid ? cloudAccount : readAppAccount(local);
      if (!account?.uid) {
        if (cloudError) {
          authStatus = AUTH_STATES.AUTH_ERROR;
          lastError = cloudError;
          throw new Error("ELITE_AUTH_CHECK_FAILED", { cause: cloudError });
        }
        authStatus = AUTH_STATES.UNAUTHENTICATED;
        throw new Error("ELITE_AUTH_REQUIRED");
      }
      remoteEnabled = Boolean(cloudAccount?.uid && cloud?.isConfigured && cloud?.stateSyncEnabled);
      authStatus = account.isAnonymous || account.provider === "anonymous"
        ? AUTH_STATES.ANONYMOUS_AUTHENTICATED
        : AUTH_STATES.AUTHENTICATED;
      return account;
    }

    async function hydrate(subjectValue) {
      const subject = subjectKey(subjectValue);
      if (!subject) throw new Error(`ELITE_SUBJECT_NOT_ALLOWED:${subjectValue}`);
      hydrationStatus = "LOADING";
      try {
        const account = await authenticatedAccount();
        currentUid = account.uid;
        currentSubject = subject;
        const localState = readLocal(currentUid, subject);
        const remoteRaw = remoteEnabled ? await cloud.loadUserState(stateKey(subject)) : null;
        const remoteState = sanitizeRemote(remoteRaw);
        if (validState(remoteState, subject)) {
          lastRemoteRevision = Number(remoteState.revision) || 0;
          if (localState && JSON.stringify(localState) !== JSON.stringify(remoteState)) {
            conflicts.push({
              type: "REMOTE_WINS",
              subject,
              uid: currentUid,
              localRevision: Number(localState.revision) || 0,
              remoteRevision: lastRemoteRevision,
              discardedLocalSessionId: localState.activeEliteSessionId || null,
              at: new Date().toISOString(),
            });
          }
          writeLocal(remoteState);
          hydrationStatus = "READY";
          return {
            status: "READY",
            source: "REMOTE",
            state: remoteState,
            uid: currentUid,
            remoteWins: Boolean(localState),
          };
        }
        hydrationStatus = "READY";
        lastRemoteRevision = 0;
        return {
          status: "READY",
          source: localState ? "LOCAL_RECOVERY_CANDIDATE" : "EMPTY",
          state: localState,
          uid: currentUid,
          remoteWins: false,
        };
      } catch (error) {
        hydrationStatus = "FAILED";
        lastError = error;
        throw error;
      }
    }

    async function save(state, saveOptions = {}) {
      if (hydrationStatus !== "READY") throw new Error("ELITE_CLOUD_NOT_READY");
      if (!currentUid || !currentSubject) throw new Error("ELITE_AUTH_REQUIRED");
      if (!validState(state, currentSubject)) throw new Error("INVALID_ELITE_STATE");
      if (state.ownerUid && state.ownerUid !== currentUid) throw new Error("ELITE_STATE_OWNER_MISMATCH");

      if (!remoteEnabled) {
        const payload = clone({ ...state, ownerUid: currentUid });
        writeLocal(payload);
        lastRemoteRevision = Number(payload.revision) || lastRemoteRevision;
        return { saved: true, conflict: false, state: payload, source: "LOCAL" };
      }

      const remoteRaw = await cloud.loadUserState(stateKey(currentSubject));
      const remoteState = sanitizeRemote(remoteRaw);
      const remoteRevision = validState(remoteState, currentSubject) ? Number(remoteState.revision) || 0 : 0;
      const expectedBaseRevision = Number(
        saveOptions.expectedBaseRevision ?? Math.max(0, Number(state.revision || 0) - 1)
      );
      const sessionConflict = validState(remoteState, currentSubject)
        && remoteState.activeEliteSessionId !== state.activeEliteSessionId
        && !saveOptions.allowNewSession;
      if (remoteRevision > expectedBaseRevision || sessionConflict) {
        conflicts.push({
          type: "REMOTE_WINS",
          subject: currentSubject,
          uid: currentUid,
          localRevision: Number(state.revision) || 0,
          remoteRevision,
          discardedLocalSessionId: state.activeEliteSessionId || null,
          at: new Date().toISOString(),
        });
        writeLocal(remoteState);
        lastRemoteRevision = remoteRevision;
        return { saved: false, conflict: true, reason: "REMOTE_WINS", state: remoteState };
      }

      const payload = clone({ ...state, ownerUid: currentUid });
      const saved = await cloud.saveUserState(stateKey(currentSubject), payload);
      if (!saved) throw new Error("ELITE_FIREBASE_SAVE_FAILED");
      writeLocal(payload);
      lastRemoteRevision = Number(payload.revision) || remoteRevision;
      return { saved: true, conflict: false, state: payload };
    }

    function resetIdentity() {
      currentUid = null;
      currentSubject = null;
      lastRemoteRevision = 0;
      hydrationStatus = "NOT_STARTED";
      authStatus = AUTH_STATES.AUTH_CHECKING;
      remoteEnabled = false;
      lastError = null;
    }

    return Object.freeze({
      hydrate,
      save,
      writeLocal,
      readLocal,
      resetIdentity,
      getStatus: () => hydrationStatus,
      getAuthStatus: () => authStatus,
      getLastError: () => lastError,
      isRemoteEnabled: () => remoteEnabled,
      getUid: () => currentUid,
      getSubject: () => currentSubject,
      getLastRemoteRevision: () => lastRemoteRevision,
      getConflicts: () => clone(conflicts),
    });
  }

  return Object.freeze({
    CACHE_PREFIX,
    STATE_KEYS,
    subjectKey,
    stateKey,
    cacheKey,
    sanitizeRemote,
    validState,
    AUTH_STATES,
    readAppAccount,
    createStorage,
  });
});
