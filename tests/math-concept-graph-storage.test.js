const test = require("node:test");
const assert = require("node:assert/strict");
const runtime = require("../math-concept-graph-runtime.js");
const storageApi = require("../math-concept-graph-storage.js");

function fakeLocal() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), values };
}

test("그래프 저장 key는 단원별 상태와 분리된 고정 계약이다", () => {
  assert.equal(storageApi.CLOUD_KEY, "mathConceptGraphLearningV1");
  assert.equal(storageApi.LOCAL_STORAGE_KEY, "studyCoinMathConceptGraphLearningV1");
});

test("localStorage는 사용자별 key로 로그아웃·재로그인 상태를 분리한다", () => {
  const local = fakeLocal(); let user = "student-a";
  const storage = storageApi.createGraphStorage({ localStorage: local, userIdProvider: () => user });
  const stateA = runtime.createInitialGraphState({ activeConceptId: "m3_sqrt_meaning", timestamp: 1 });
  storage.writeLocal(stateA);
  user = "student-b";
  assert.equal(storage.readLocal(), null);
  user = "student-a";
  assert.equal(storage.readLocal().activeConceptId, "m3_sqrt_meaning");
});

test("원격 상태가 있으면 remote-wins로 local을 교체한다", async () => {
  const local = fakeLocal();
  const localState = runtime.createInitialGraphState({ activeConceptId: "m3_sqrt_meaning", timestamp: 1 });
  const remoteState = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 2 });
  const storage = storageApi.createGraphStorage({ localStorage: local, userIdProvider: () => "u", cloudAuth: {
    loadUserState: async () => remoteState, saveUserState: async () => {},
  } });
  storage.writeLocal(localState);
  const hydrated = await storage.hydrate();
  assert.equal(hydrated.activeConceptId, "m3_quadratic_meaning");
  assert.equal(storage.getHydrationStatus(), "REMOTE_WINS");
  assert.equal(storage.readLocal().activeConceptId, "m3_quadratic_meaning");
});

test("빈 원격 상태는 기존 local 상태를 덮어쓰지 않는다", async () => {
  const local = fakeLocal();
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_statistics_mean", timestamp: 1 });
  const storage = storageApi.createGraphStorage({ localStorage: local, userIdProvider: () => "u", cloudAuth: {
    loadUserState: async () => ({}), saveUserState: async () => { throw new Error("should not save while hydrating"); },
  } });
  storage.writeLocal(state);
  assert.equal((await storage.hydrate()).activeConceptId, "m3_statistics_mean");
});

test("원격 로드 실패 때 local 복원 계약을 유지한다", async () => {
  const local = fakeLocal();
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_circle_foundations", timestamp: 1 });
  const storage = storageApi.createGraphStorage({ localStorage: local, userIdProvider: () => "u", cloudAuth: {
    loadUserState: async () => { throw new Error("offline"); }, saveUserState: async () => true,
  } });
  storage.writeLocal(state);
  assert.equal((await storage.hydrate()).activeConceptId, "m3_circle_foundations");
  assert.equal(storage.getHydrationStatus(), "REMOTE_FAILED_LOCAL_FALLBACK");
});

test("revision 충돌은 원격 저장 전에 차단한다", async () => {
  let saved = 0;
  const remote = runtime.createInitialGraphState({ activeConceptId: "m3_sqrt_meaning", timestamp: 1 });
  const storage = storageApi.createGraphStorage({ localStorage: fakeLocal(), userIdProvider: () => "u", cloudAuth: {
    loadUserState: async () => remote, saveUserState: async () => { saved += 1; },
  } });
  await storage.hydrate();
  const result = await storage.save(remote, { expectedRevision: remote.revision + 1 });
  assert.equal(result.status, "REVISION_CONFLICT");
  assert.equal(saved, 0);
});

test("의미 없는 빈 초기 상태는 기존 원격 상태를 덮어쓰지 않는다", async () => {
  let saved = 0;
  const storage = storageApi.createGraphStorage({ localStorage: fakeLocal(), cloudAuth: { saveUserState: async () => { saved += 1; } } });
  const result = await storage.save(runtime.createInitialGraphState({ timestamp: 0 }));
  assert.equal(result.status, "EMPTY_STATE_BLOCKED");
  assert.equal(saved, 0);
});
