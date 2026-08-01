const test = require("node:test");
const assert = require("node:assert/strict");

const stateApi = require("../math-adaptive-level-test-state.js");
const storageApi = require("../math-adaptive-level-test-storage.js");

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function session(revision = 1, changes = {}) {
  const graphState = stateApi.createInitialAdaptiveState({ timestamp: revision, overrides: { revision, totalQuestions: revision } });
  return storageApi.createSession({ graphState, sessionId: "session-a", revision, timestamp: revision, ...changes });
}

test("사용자별 localStorage 키를 분리한다", () => {
  assert.equal(storageApi.localStorageKey("a"), "studyCoinMathAdaptiveLevelTestV1:a");
  assert.notEqual(storageApi.localStorageKey("a"), storageApi.localStorageKey("b"));
});

test("현재 문제와 게이트·영역·누적 증거·남은 경로를 저장하고 복원한다", () => {
  const local = memoryStorage();
  const saved = session(3, { currentQuestion: { problemId: "g4-q1" }, remainingPath: ["GRADE_GATE"] });
  assert.equal(storageApi.saveLocal(local, "student", saved), true);
  assert.deepEqual(storageApi.loadLocal(local, "student"), saved);
});

test("remote-wins로 원격 상태를 로컬에 복원한다", async () => {
  const local = memoryStorage();
  storageApi.saveLocal(local, "student", session(2));
  const remote = session(8, { sessionId: "remote" });
  const hydrated = await storageApi.hydrate({ storage: local, userId: "student", cloud: { loadUserState: async () => remote } });
  assert.equal(hydrated.source, "REMOTE");
  assert.equal(hydrated.state.revision, 8);
  assert.equal(storageApi.loadLocal(local, "student").sessionId, "remote");
});

test("원격이 없으면 로컬 상태로 재개한다", async () => {
  const local = memoryStorage();
  storageApi.saveLocal(local, "student", session(4));
  const hydrated = await storageApi.hydrate({ storage: local, userId: "student", cloud: { loadUserState: async () => null } });
  assert.equal(hydrated.source, "LOCAL");
  assert.equal(hydrated.state.revision, 4);
});

test("더 최신 로컬 revision 위에 과거 상태를 쓰지 않는다", async () => {
  const local = memoryStorage();
  storageApi.saveLocal(local, "student", session(7));
  const result = await storageApi.persist({ storage: local, userId: "student", session: session(5) });
  assert.equal(result.saved, false);
  assert.equal(result.reason, "LOCAL_REVISION_CONFLICT");
});

test("더 최신 원격 revision은 저장 전에 충돌로 보호한다", async () => {
  const local = memoryStorage();
  const remote = session(9, { sessionId: "remote" });
  const result = await storageApi.persist({
    storage: local,
    userId: "student",
    session: session(6),
    cloud: { loadUserState: async () => remote, saveUserState: async () => true },
  });
  assert.equal(result.saved, false);
  assert.equal(result.reason, "REMOTE_REVISION_CONFLICT");
  assert.equal(storageApi.loadLocal(local, "student").revision, 9);
});

test("빈 초기 상태가 의미 있는 원격 상태를 덮어쓰지 않는다", async () => {
  const empty = storageApi.createSession({ graphState: stateApi.createInitialAdaptiveState(), status: "NOT_STARTED" });
  const remote = session(4);
  const result = await storageApi.persist({
    storage: memoryStorage(), userId: "student", session: empty,
    cloud: { loadUserState: async () => remote, saveUserState: async () => true },
  });
  assert.equal(result.saved, false);
});

test("완료 세션 뒤 새 진단을 시작하면 이전 결과를 history에 보존한다", () => {
  const completed = session(4, { status: "COMPLETED", result: { strongestConcepts: ["large_numbers"] } });
  const next = storageApi.startNewSession(completed, { graphState: stateApi.createInitialAdaptiveState({ timestamp: 10 }), sessionId: "next", timestamp: 10 });
  assert.equal(next.history.length, 1);
  assert.equal(next.history[0].sessionId, completed.sessionId);
});

test("본 학습 저장 키와 적응형 진단 저장 키가 다르다", () => {
  assert.equal(storageApi.CLOUD_KEY, "mathAdaptiveLevelTestV1");
  assert.notEqual(storageApi.CLOUD_KEY, "mathConceptGraphLearningV1");
  assert.notEqual(storageApi.LOCAL_PREFIX, "studyCoinMathConceptGraphLearningV1");
});
