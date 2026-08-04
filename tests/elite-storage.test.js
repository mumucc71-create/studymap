const test = require("node:test");
const assert = require("node:assert/strict");

const storageModule = require("../elite-storage.js");
const runtimeModule = require("../elite-runtime.js");

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    data,
  };
}

function cloudHarness(uid = "uid-1") {
  const remote = new Map();
  return {
    remote,
    cloud: {
      isConfigured: true,
      stateSyncEnabled: true,
      restoreSession: async () => uid ? { uid } : null,
      loadUserState: async (key) => remote.has(key) ? structuredClone(remote.get(key)) : null,
      saveUserState: async (key, value) => {
        remote.set(key, structuredClone(value));
        return true;
      },
    },
  };
}

function session(subject = "math", uid = "uid-1", baseRevision = 0) {
  return runtimeModule.createEngine({ now: () => 1000, random: () => 0.2 })
    .createSession(subject, { uid, baseRevision });
}

test("과목별 Firebase stateKey와 UID별 로컬 캐시 키를 분리한다", () => {
  assert.equal(storageModule.stateKey("math"), "eliteAssessment-math-middle3");
  assert.equal(storageModule.stateKey("english"), "eliteAssessment-english-middle3");
  assert.notEqual(
    storageModule.cacheKey("uid-a", "math"),
    storageModule.cacheKey("uid-b", "math")
  );
  assert.notEqual(
    storageModule.cacheKey("uid-a", "math"),
    storageModule.cacheKey("uid-a", "english")
  );
});

test("Firebase 원격 상태가 있으면 오래된 로컬 상태를 폐기한다", async () => {
  const memory = memoryStorage();
  const harness = cloudHarness();
  const remoteState = session("math", "uid-1", 5);
  remoteState.revision = 6;
  const localState = structuredClone(remoteState);
  localState.revision = 9;
  localState.currentProblemIndex = 4;
  localState.finalizedAttempts["local-stale-only"] = { attemptStatus: "FINAL" };
  harness.remote.set(storageModule.stateKey("math"), remoteState);
  memory.setItem(storageModule.cacheKey("uid-1", "math"), JSON.stringify(localState));
  const storage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memory });
  const hydrated = await storage.hydrate("math");
  assert.equal(hydrated.source, "REMOTE");
  assert.equal(hydrated.state.revision, 6);
  assert.equal(hydrated.state.currentProblemIndex, 0);
  assert.equal(hydrated.state.finalizedAttempts["local-stale-only"], undefined);
  assert.equal(storage.getConflicts()[0].type, "REMOTE_WINS");
});

test("Firebase에 상태가 없을 때만 로컬을 복구 후보로 반환한다", async () => {
  const memory = memoryStorage();
  const harness = cloudHarness();
  const localState = session("english");
  memory.setItem(storageModule.cacheKey("uid-1", "english"), JSON.stringify(localState));
  const storage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memory });
  const hydrated = await storage.hydrate("english");
  assert.equal(hydrated.source, "LOCAL_RECOVERY_CANDIDATE");
  assert.equal(hydrated.state.activeEliteSessionId, localState.activeEliteSessionId);
});

test("hydrate READY 전 저장을 차단하고 UID가 없으면 시작하지 않는다", async () => {
  const harness = cloudHarness();
  const storage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memoryStorage() });
  await assert.rejects(() => storage.save(session()), /ELITE_CLOUD_NOT_READY/);
  const noUser = cloudHarness(null);
  const noUserStorage = storageModule.createStorage({
    cloudAuth: noUser.cloud,
    localStorage: memoryStorage(),
  });
  await assert.rejects(() => noUserStorage.hydrate("math"), /ELITE_AUTH_REQUIRED/);
  assert.equal(noUserStorage.getStatus(), "FAILED");
});

test("직전 revision이 맞을 때만 Firebase에 이어 저장한다", async () => {
  const harness = cloudHarness();
  const storage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memoryStorage() });
  await storage.hydrate("math");
  const initial = session();
  const first = await storage.save(initial, { expectedBaseRevision: 0 });
  assert.equal(first.saved, true);
  const next = { ...initial, revision: 2, currentProblemIndex: 1 };
  const second = await storage.save(next, { expectedBaseRevision: 1 });
  assert.equal(second.saved, true);
  assert.equal(harness.remote.get(storageModule.stateKey("math")).currentProblemIndex, 1);
});

test("다른 브라우저의 최신 revision이 있으면 stale local 업로드를 차단한다", async () => {
  const harness = cloudHarness();
  const firstStorage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memoryStorage() });
  await firstStorage.hydrate("math");
  const initial = session();
  await firstStorage.save(initial, { expectedBaseRevision: 0 });

  const staleStorage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memoryStorage() });
  const staleHydration = await staleStorage.hydrate("math");
  const newer = { ...initial, revision: 2, currentProblemIndex: 1 };
  await firstStorage.save(newer, { expectedBaseRevision: 1 });
  const staleMutation = { ...staleHydration.state, revision: 2, currentProblemIndex: 5 };
  const result = await staleStorage.save(staleMutation, { expectedBaseRevision: 1 });
  assert.equal(result.saved, false);
  assert.equal(result.reason, "REMOTE_WINS");
  assert.equal(result.state.currentProblemIndex, 1);
  assert.equal(harness.remote.get(storageModule.stateKey("math")).currentProblemIndex, 1);
});

test("다른 계정의 로컬 Elite 상태를 읽지 않는다", async () => {
  const memory = memoryStorage();
  const first = cloudHarness("uid-1");
  const firstStorage = storageModule.createStorage({ cloudAuth: first.cloud, localStorage: memory });
  await firstStorage.hydrate("math");
  const firstState = session("math", "uid-1");
  firstStorage.writeLocal(firstState);

  const second = cloudHarness("uid-2");
  const secondStorage = storageModule.createStorage({ cloudAuth: second.cloud, localStorage: memory });
  const hydrated = await secondStorage.hydrate("math");
  assert.equal(hydrated.source, "EMPTY");
  assert.equal(hydrated.state, null);
});

test("FINAL·현재 위치·오류·결과 상태를 직렬화해 그대로 복원한다", async () => {
  const harness = cloudHarness();
  const memory = memoryStorage();
  const storage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memory });
  await storage.hydrate("math");
  const runtime = runtimeModule.createEngine({ now: () => 1000, random: () => 0.2 });
  let target = runtime.createSession("math", { uid: "uid-1" });
  const firstProblem = runtime.getCurrentProblem(target);
  const wrong = firstProblem.choices.find((choice) => choice !== firstProblem.correctAnswer);
  target = runtime.submitCurrent(target, wrong, { problemId: firstProblem.problemId, now: 2000 });
  await storage.save(target, { expectedBaseRevision: 0 });

  const restoredStorage = storageModule.createStorage({ cloudAuth: harness.cloud, localStorage: memoryStorage() });
  const restored = await restoredStorage.hydrate("math");
  assert.equal(restored.state.currentProblemIndex, target.currentProblemIndex);
  assert.equal(restored.state.finalizedAttempts[firstProblem.problemId].attemptStatus, "FINAL");
  assert.equal(restored.state.errorEvidence.length, 1);
  assert.deepEqual(restored.state.pendingRechecks, target.pendingRechecks);
});

test("Firebase currentUser가 늦거나 없어도 일반 앱 로그인 사용자는 로컬 Elite 세션을 시작한다", async () => {
  const memory = memoryStorage();
  memory.setItem("studyCoinCurrentUser", "student@example.com");
  memory.setItem("studyCoinAuth", JSON.stringify({
    "student@example.com": { id: "student@example.com", uid: "app-uid-1", provider: "password" },
  }));
  const cloud = {
    isConfigured: true,
    stateSyncEnabled: true,
    restoreSession: async () => null,
  };
  const storage = storageModule.createStorage({ cloudAuth: cloud, localStorage: memory });
  const hydrated = await storage.hydrate("math");
  assert.equal(hydrated.uid, "app-uid-1");
  assert.equal(storage.getAuthStatus(), "AUTHENTICATED");
  assert.equal(storage.isRemoteEnabled(), false);
  const saved = await storage.save(session("math", "app-uid-1"), { expectedBaseRevision: 0 });
  assert.equal(saved.saved, true);
  assert.equal(saved.source, "LOCAL");
});

test("기존 앱의 익명 사용자도 Elite 인증 사용자로 구분한다", async () => {
  const memory = memoryStorage();
  memory.setItem("studyCoinCurrentUser", "guest-1");
  memory.setItem("studyCoinAuth", JSON.stringify({
    "guest-1": { id: "guest-1", uid: "anonymous-uid", provider: "anonymous", isAnonymous: true },
  }));
  const storage = storageModule.createStorage({
    cloudAuth: { isConfigured: false, stateSyncEnabled: false },
    localStorage: memory,
  });
  const hydrated = await storage.hydrate("math");
  assert.equal(hydrated.uid, "anonymous-uid");
  assert.equal(storage.getAuthStatus(), "ANONYMOUS_AUTHENTICATED");
});

test("실제 앱 로그인과 Firebase 사용자 모두 없을 때만 미로그인으로 판정한다", async () => {
  const storage = storageModule.createStorage({
    cloudAuth: { isConfigured: true, stateSyncEnabled: true, restoreSession: async () => null },
    localStorage: memoryStorage(),
  });
  await assert.rejects(() => storage.hydrate("math"), /ELITE_AUTH_REQUIRED/);
  assert.equal(storage.getAuthStatus(), "UNAUTHENTICATED");
});
