const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const runtimeModule = require("../elite-runtime.js");
const storageModule = require("../elite-storage.js");

function makeRuntime() {
  let now = 1_900_000_000_000;
  return runtimeModule.createEngine({
    now: () => (now += 1000),
    random: () => 0.3,
  });
}

function completeCorrectSession(subject) {
  const runtime = makeRuntime();
  let state = runtime.createSession(subject, { uid: "integration-user" });
  let guard = 0;
  while (state.sessionStatus === "IN_PROGRESS" && guard < 20) {
    const problem = runtime.getCurrentProblem(state);
    state = runtime.submitCurrent(state, problem.correctAnswer, { problemId: problem.problemId });
    guard += 1;
  }
  return { runtime, state };
}

test("수학 실제 엔진 흐름은 HIGH에서 TOP으로 올라가 결과를 생성한다", () => {
  const { state } = completeCorrectSession("math");
  assert.equal(state.sessionStatus, "COMPLETED");
  assert.equal(state.stableLevel, "TOP");
  assert.equal(state.challengeLevel, "TOP");
  assert.equal(state.resultSummary.subject, "math");
  assert.ok(state.resultSummary.submittedCount >= 12);
  assert.equal(state.resultSummary.accuracy, 1);
});

test("영어 실제 엔진 흐름은 여러 유형을 거쳐 TOP 결과를 생성한다", () => {
  const { state } = completeCorrectSession("english");
  assert.equal(state.sessionStatus, "COMPLETED");
  assert.equal(state.stableLevel, "TOP");
  assert.equal(state.resultSummary.subject, "english");
  assert.ok(state.resultSummary.strengthAreas.length >= 3);
});

test("오답 한 번은 약점으로 확정하지 않고 다른 구조 재확인을 세션에 넣는다", () => {
  const runtime = makeRuntime();
  let state = runtime.createSession("math", { uid: "integration-user" });
  const problem = runtime.getCurrentProblem(state);
  const wrong = problem.choices.find((choice) => choice !== problem.correctAnswer);
  state = runtime.submitCurrent(state, wrong, { problemId: problem.problemId });
  assert.equal(state.confirmedWeaknesses.length, 0);
  assert.equal(state.pendingRechecks.length, 1);
  assert.ok(state.sessionProblemIds.includes(state.pendingRechecks[0].targetProblemId));
});

test("Chrome 역할의 최신 저장이 Edge 역할의 stale 상태 업로드보다 우선한다", async () => {
  const remote = new Map();
  const cloud = {
    isConfigured: true,
    stateSyncEnabled: true,
    restoreSession: async () => ({ uid: "same-user" }),
    loadUserState: async (key) => remote.has(key) ? structuredClone(remote.get(key)) : null,
    saveUserState: async (key, value) => {
      remote.set(key, structuredClone(value));
      return true;
    },
  };
  const localFactory = () => {
    const data = new Map();
    return {
      getItem: (key) => data.get(key) || null,
      setItem: (key, value) => data.set(key, value),
    };
  };
  const runtime = makeRuntime();
  const chrome = storageModule.createStorage({ cloudAuth: cloud, localStorage: localFactory() });
  await chrome.hydrate("math");
  const initial = runtime.createSession("math", { uid: "same-user" });
  await chrome.save(initial, { expectedBaseRevision: 0 });

  const edge = storageModule.createStorage({ cloudAuth: cloud, localStorage: localFactory() });
  const edgeBase = await edge.hydrate("math");
  const chromeProblem = runtime.getCurrentProblem(initial);
  const chromeNext = runtime.submitCurrent(initial, chromeProblem.correctAnswer, {
    problemId: chromeProblem.problemId,
  });
  await chrome.save(chromeNext, { expectedBaseRevision: initial.revision });

  const edgeProblem = runtime.getCurrentProblem(edgeBase.state);
  const staleEdgeNext = runtime.submitCurrent(edgeBase.state, edgeProblem.correctAnswer, {
    problemId: edgeProblem.problemId,
  });
  const edgeSave = await edge.save(staleEdgeNext, { expectedBaseRevision: edgeBase.state.revision });
  assert.equal(edgeSave.reason, "REMOTE_WINS");
  assert.equal(
    Object.keys(remote.get(storageModule.stateKey("math")).finalizedAttempts).length,
    1
  );
});

test("index와 elite-test는 새 엔진을 최소 hunk로 연결하고 전역 CSS를 요구하지 않는다", () => {
  const root = path.join(__dirname, "..");
  const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const bridge = fs.readFileSync(path.join(root, "elite-test.js"), "utf8");
  const ui = fs.readFileSync(path.join(root, "elite-ui.js"), "utf8");
  [
    "middle3-elite-math-model.js",
    "middle3-elite-english-model.js",
    "elite-diagnosis.js",
    "elite-runtime.js",
    "elite-storage.js",
    "elite-geometry-renderer.js",
    "elite-ui.js",
  ].forEach((file) => assert.match(index, new RegExp(file.replaceAll(".", "\\.")), file));
  assert.match(bridge, /STUDY_ELITE_UI\?\.mount/);
  assert.match(ui, /learning-text-answer/);
  assert.match(ui, /studyEliteResumeRequestedV1/);
  assert.doesNotMatch(ui, /styles\.css/);
});
