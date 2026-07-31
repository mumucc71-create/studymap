const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const hash = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

test("브라우저는 validator→승인 모델·설명→공통 런타임→sqrt adapter→UI 순서로 로드한다", () => {
  const html = read("index.html");
  const files = [
    "math-learning-schema.js",
    "math-algebra-validator.js",
    "middle3-sqrt-learning-model.js",
    "middle3-sqrt-learning-content.js",
    "math-spring-learning-runtime.js",
    "middle3-sqrt-learning-runtime.js",
    "middle3-sqrt-learning-ui.js",
    "learning.js",
  ];
  const positions = files.map((file) => html.indexOf(`src="${file}`));
  positions.forEach((position, index) => assert.ok(position >= 0, files[index]));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test("승인 콘텐츠 출력 해시를 UI 연결 전후 동일하게 보존한다", () => {
  const model = require("../middle3-sqrt-learning-model.js");
  const content = require("../middle3-sqrt-learning-content.js");
  assert.equal(hash(model.problems), "7b3506337f6bd9912fef44f312313a0028d11c82270303fcecd4f2a0203bc827");
  assert.equal(hash(content), "fe966bba8b9c0638dbc5633fb8d90bbae35873e94feb4eeaa52a5f2e5784adf3");
});

test("기존 7개 World를 유지하고 수와 연산의 기존 응용 계산 노드로 진입한다", () => {
  const learning = read("learning.js");
  assert.match(learning, /const mathWorlds = \[/);
  assert.equal((learning.match(/\{ title: "/g) || []).length >= 7, true);
  assert.match(learning, /worldIndex === 0[\s\S]*topicIndex === 8[\s\S]*sqrtLearning\.openMap\(\)/);
  assert.match(learning, /openMathStudyRecommendation[\s\S]*sqrtLearning\.startFromRecommendation/);
  assert.match(read("math-study-recommendations.js"), /m3_sqrt_meaning:[^\n]*route\(0, 8/);
  assert.match(read("math-study-recommendations.js"), /m3_radical_operations:[^\n]*route\(0, 8/);
});

test("sqrt UI는 기존 DOM과 버튼을 재사용하고 새 CSS를 만들지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  assert.match(ui, /document\.getElementById\("learningAnswerArea"\)/);
  assert.match(ui, /document\.getElementById\("learningSubmitButton"\)/);
  assert.match(ui, /id="sqrtLearningAnswer"/);
  assert.match(ui, /problem\.answerType === "MULTIPLE_CHOICE"/);
  assert.match(ui, /problem\.answerType === "STEP_ORDER"/);
  assert.match(ui, /problem\.answerType === "WRITTEN_RESPONSE"/);
  assert.match(ui, /problem\.answerType === "EXPRESSION_INPUT"/);
  assert.equal(ui.includes("document.createElement(\"style\")"), false);
  assert.equal(ui.includes("styles.css"), false);
});

test("sqrt UI의 local·Firebase key와 remote-wins event는 전용 namespace다", () => {
  const runtime = read("middle3-sqrt-learning-runtime.js");
  const ui = read("middle3-sqrt-learning-ui.js");
  assert.match(runtime, /cloudKey: "middle3SqrtLearningV1"/);
  assert.match(runtime, /localStorageKey: "studyCoinMiddle3SqrtLearningV1"/);
  assert.match(runtime, /cyclePrefix: "m3sqrt-cycle"/);
  assert.match(runtime, /submissionPrefix: "m3sqrt-submit"/);
  assert.match(ui, /studyCoinMiddle3SqrtLearningV1:\$\{userId\}/);
  assert.match(ui, /study:m3-sqrt-remote-wins/);
  assert.equal(runtime.includes("middle3QuadraticLearningV1"), false);
});

test("Firebase hydrate는 원격 우선이며 LOADING·FAILED 중 제출하지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  const remoteLoad = ui.indexOf("loadUserState(runtime.CLOUD_STATE_KEY)");
  const resolved = ui.indexOf("runtime.resolveHydrationState(remote, local, userId)");
  assert.ok(remoteLoad >= 0 && resolved > remoteLoad);
  assert.match(ui, /hydrationStatus = "LOADING"/);
  assert.match(ui, /hydrationStatus = "READY"/);
  assert.match(ui, /hydrationStatus = "FAILED"/);
  assert.match(ui, /if \(submissionInProgress \|\| hydrationStatus !== "READY"\) return/);
  assert.match(ui, /if \(remoteChanged\)[\s\S]*runtime\.resolveHydrationState\(remote, state/);
  assert.match(ui, /restoreSavedSurface[\s\S]*await hydrate\(\)[\s\S]*renderLesson\(\)/);
});

test("혼자 풀기 UI는 힌트를 잠그고 FINAL 전 풀이 버튼을 비활성화한다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  assert.match(ui, /hint\.disabled = item\.purpose === runtime\.PURPOSES\.INDEPENDENT_CHECK/);
  assert.match(ui, /reveal\.disabled = item\.purpose === runtime\.PURPOSES\.INDEPENDENT_CHECK[\s\S]*attempt\?\.attemptStatus !== "FINAL"/);
});

test("제곱근 연결 파일은 Elite·다른 과목·StudyCoin 보상을 건드리지 않는다", () => {
  const combined = [
    read("middle3-sqrt-learning-runtime.js"),
    read("middle3-sqrt-learning-ui.js"),
  ].join("\n").toLowerCase();
  ["elite", "english", "science", "hanja", "reading", "grantstudycoinreward", "rewardeventid"].forEach((needle) => {
    assert.equal(combined.includes(needle), false, needle);
  });
});

test("로그아웃 이벤트는 제곱근 화면을 다시 열거나 hydrate하지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  const listener = ui.slice(
    ui.indexOf('window.addEventListener("study:user-changed"'),
    ui.indexOf('window.addEventListener("study:m3-sqrt-remote-wins"'),
  );
  assert.match(listener, /if \(!userId\) \{[\s\S]*resetUserHydrationState\(\);[\s\S]*return;/);
  assert.doesNotMatch(listener.match(/if \(!userId\) \{[\s\S]*?return;/)?.[0] || "", /openMap|hydrate|restoreSignedInUser/);
});

test("로그인은 학습 사용자 상태 전환 뒤 제곱근 경로를 한 번만 hydrate한다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  const restore = ui.slice(
    ui.indexOf("function restoreSignedInUser"),
    ui.indexOf('window.addEventListener("study:user-changed"'),
  );
  assert.match(restore, /Promise\.resolve\(\)[\s\S]*\.then\(async \(\) => \{/);
  assert.match(
    restore,
    /currentUserId\(\) !== userId[\s\S]*mapView !== "middle3-sqrt"[\s\S]*openMap\(\{ restoreSavedScreen: true \}\)/,
  );
  assert.equal((restore.match(/openMap\(\{ restoreSavedScreen: true \}\)/g) || []).length, 1);
});

test("동일 UID의 연속 로그인 이벤트는 진행 중이거나 완료된 hydrate를 중복 실행하지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  assert.match(ui, /pendingUserRestoreId === userId && userRestorePromise/);
  assert.match(ui, /hydratedUserId === userId && hydrationStatus === "READY" && state/);
  assert.match(ui, /const generation = \+\+userRestoreGeneration/);
  assert.match(ui, /generation !== userRestoreGeneration/);
});

test("사용자 전환 실패 경로는 빈 상태를 저장하거나 Firebase를 덮어쓰지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  const transition = ui.slice(
    ui.indexOf("function resetUserHydrationState"),
    ui.indexOf('window.addEventListener("study:m3-sqrt-remote-wins"'),
  );
  assert.doesNotMatch(transition, /writeLocal\(|saveCloud\(|persist\(/);
  assert.match(transition, /console\.error\("\[m3-sqrt-learning\] user restore failed"/);
});

test("빠른 연속 학습 동작은 직렬화하여 revision과 힌트 상태를 잃지 않는다", () => {
  const ui = read("middle3-sqrt-learning-ui.js");
  assert.match(ui, /let actionPromise = Promise\.resolve\(\)/);
  assert.match(ui, /actionPromise = actionPromise[\s\S]*\.then\(\(\) => handleAction\(target\)\)/);
});
