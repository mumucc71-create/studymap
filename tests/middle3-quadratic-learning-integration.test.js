const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("브라우저는 승인 모델→설명→런타임→UI 순서로 로드한다", () => {
  const html = read("index.html");
  const files = [
    "math-learning-schema.js",
    "middle3-quadratic-learning-model.js",
    "middle3-quadratic-learning-content.js",
    "middle3-quadratic-learning-runtime.js",
    "middle3-quadratic-learning-ui.js",
    "learning.js",
  ];
  const positions = files.map((file) => html.indexOf(`src="${file}`));
  positions.forEach((position, index) => assert.ok(position >= 0, files[index]));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(read("middle3-quadratic-learning-model.js"), /STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL = api/);
  assert.match(read("middle3-quadratic-learning-runtime.js"), /root\?\.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL/);
  assert.match(read("middle3-quadratic-learning-ui.js"), /window\.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL/);
});

test("기존 7개 World와 함수 World의 이차함수 진입점을 그대로 사용한다", () => {
  const learning = read("learning.js");
  assert.match(learning, /const mathWorlds = \[/);
  assert.equal((learning.match(/\{ title: "/g) || []).length >= 7, true);
  assert.match(learning, /topics: \["규칙 찾기", "대응", "좌표", "정비례", "반비례", "일차함수", "이차함수", "함수 활용"\]/);
  assert.match(learning, /worldIndex === 2[\s\S]*topicIndex === 6[\s\S]*quadraticLearning\.openMap\(\)/);
  assert.match(learning, /openMathStudyRecommendation[\s\S]*quadraticLearning\.startFromRecommendation/);
  const worldTopicBranch = learning.slice(learning.indexOf('action === "open-math-world-topic"'), learning.indexOf('action === "open-large-number-step"'));
  assert.ok(worldTopicBranch.indexOf("quadraticLearning.openMap()") < worldTopicBranch.indexOf("topicIndex > completedTopics.length"));
});

test("다섯 답안형은 기존 learningAnswerArea 안에서 입력되고 기존 버튼을 재사용한다", () => {
  const ui = read("middle3-quadratic-learning-ui.js");
  assert.match(ui, /problem\.answerType === "MULTIPLE_CHOICE"/);
  assert.match(ui, /problem\.answerType === "STEP_ORDER"/);
  assert.match(ui, /problem\.answerType === "WRITTEN_RESPONSE"/);
  assert.match(ui, /problem\.answerType === "EXPRESSION_INPUT"/);
  assert.match(ui, /id="quadraticLearningAnswer"/);
  assert.match(ui, /document\.getElementById\("learningAnswerArea"\)/);
  assert.match(ui, /document\.getElementById\("learningSubmitButton"\)/);
  assert.match(ui, /await applyState\(submitted\.state, false\);\s+submissionInProgress = false;\s+renderQuestion\(\)/);
  assert.match(ui, /quadraticActionsByDefault\[requestedAction\]/);
  assert.match(ui, /function bindQuadraticAction\(element, action\)[\s\S]*element\.onclick[\s\S]*handleAction\(element\)/);
  assert.match(ui, /element\.onclick = null/);
  assert.match(ui, /window\.addEventListener\("click"[\s\S]*event\.stopImmediatePropagation\(\)[\s\S]*handleAction\(target\)[\s\S]*true\)/);
  assert.match(ui, /function quadraticDomSurfaceActive\(\)[\s\S]*learningLessonUnit[\s\S]*중3 수학 · 이차함수/);
  assert.match(ui, /function deactivate\(force = false\)[\s\S]*!force && quadraticDomSurfaceActive\(\)/);
  assert.match(ui, /if \(force\) localStorage\.removeItem\(surfaceMarkerKey\(\)\)/);
  assert.match(ui, /!state && quadraticDomSurfaceActive\(\) && !await hydrate\(\)/);
  assert.match(ui, /quadraticDomSurfaceActive\(\)[\s\S]*localStorage\.setItem\(surfaceMarkerKey\(\), "1"\)/);
  assert.match(ui, /studyCoinMiddle3QuadraticSurfaceV1/);
  assert.match(ui, /function restoreSavedSurface\(\)[\s\S]*await hydrate\(\)[\s\S]*renderLesson\(\)/);
  assert.match(ui, /DOMContentLoaded", restoreSavedSurface/);
  assert.equal(ui.includes("[m3-quadratic-learning-click]"), false);
  assert.equal(ui.includes("[m3-quadratic-handle]"), false);
  assert.match(read("learning.js"), /deactivate\(true\)/);
  assert.match(read("learning.js"), /quadraticLearning\?\.handlesAction\(action\)/);
  assert.match(read("learning.js"), /quadraticLearning\?\.isActive\(\)[\s\S]*quadraticLearning\?\.handlesAction\(action\)/);
  assert.equal(ui.includes("document.createElement(\"style\")"), false);
  assert.equal(ui.includes("styles.css"), false);
});

test("Firebase hydrate는 원격을 먼저 읽고 FAILED 동안 로컬을 원본으로 확정하지 않는다", () => {
  const ui = read("middle3-quadratic-learning-ui.js");
  const remoteLoad = ui.indexOf("loadUserState(runtime.CLOUD_STATE_KEY)");
  const resolution = ui.indexOf("runtime.resolveHydrationState(remote, local, userId)");
  assert.ok(remoteLoad >= 0);
  assert.ok(resolution > remoteLoad);
  assert.match(ui, /hydrationStatus = "LOADING"/);
  assert.match(ui, /hydrationStatus = "READY"/);
  assert.match(ui, /hydrationStatus = "FAILED"/);
  assert.match(ui, /if \(submissionInProgress \|\| hydrationStatus !== "READY"\) return/);
  assert.match(ui, /if \(remoteChanged\)[\s\S]*runtime\.resolveHydrationState\(remote, state/);
  assert.match(ui, /options\.restoreSavedScreen[\s\S]*studyCoinCurrentScreen[\s\S]*renderLesson\(\)/);
  assert.match(read("learning.js"), /quadraticLearning\.openMap\(\{ restoreSavedScreen: true \}\)/);
});

test("학습 전용 연결은 다른 과목 모듈과 전역 CSS를 참조하지 않는다", () => {
  const combined = [
    read("middle3-quadratic-learning-content.js"),
    read("middle3-quadratic-learning-runtime.js"),
    read("middle3-quadratic-learning-ui.js"),
  ].join("\n");
  ["english", "science", "hanja", "reading", "subject-learning.js", "styles.css"].forEach((needle) => {
    assert.equal(combined.toLowerCase().includes(needle), false, needle);
  });
  assert.equal(combined.includes("rewardEventId"), false);
  assert.equal(combined.includes("grantStudyCoinReward"), false);
});

test("답안 제출은 진행 중인 초안 저장을 기다리고 예약 저장과 충돌하지 않는다", () => {
  const ui = read("middle3-quadratic-learning-ui.js");
  assert.match(ui, /clearTimeout\(draftSaveTimer\);[\s\S]*draftSaveTimer = null;[\s\S]*await savePromise\.catch/);
  assert.match(ui, /if \(submissionInProgress \|\| hydrationStatus !== "READY"\) return;[\s\S]*submissionInProgress = true;/);
});

test("학습지도 재진입과 사이클 계속하기는 메모리 캐시보다 Firebase를 다시 확인한다", () => {
  const ui = read("middle3-quadratic-learning-ui.js");
  assert.match(ui, /async function startRecommended\(\)[\s\S]*if \(!await hydrate\(true\)\)/);
  assert.match(ui, /async function startDirect\(conceptId, stage\)[\s\S]*if \(!await hydrate\(true\)\) return false/);
  assert.match(ui, /async function openMap\(options = \{\}\)[\s\S]*if \(!await hydrate\(true\)\)/);
});
