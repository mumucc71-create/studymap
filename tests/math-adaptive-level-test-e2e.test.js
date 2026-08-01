const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = global;
require("../question-generators.js");
const banks = require("../math-level-test-grade-banks.js");
const selector = require("../math-adaptive-level-test-question-selector.js");
const ui = require("../math-adaptive-level-test-ui.js");
const storage = require("../math-adaptive-level-test-storage.js");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const script = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");

function realCatalog() {
  const sessions = {};
  for (const grade of ["G4", "G5", "G6", "M1", "M2", "M3"]) {
    sessions[grade] = banks.buildGradeTestSession({ selectedGrade: grade, generatedConceptBanks: global.generatedConceptBanks });
  }
  return selector.createQuestionCatalog({ sessions });
}

test("기본 수학 버튼은 맞춤형 진단이고 학년별 진단은 보조 버튼으로 남는다", () => {
  assert.match(html, /data-test-subject="수학" data-math-test-mode="adaptive">맞춤형 수학 진단/);
  assert.match(html, /data-test-subject="수학" data-math-test-mode="grade">학년별 범위 진단/);
  assert.match(script, /button\.dataset\.mathTestMode \|\| "adaptive"/);
});

test("적응형 신규 모듈은 script.js보다 먼저 로드된다", () => {
  for (const file of ["math-adaptive-level-test-storage.js", "math-adaptive-level-test-ui.js"]) {
    assert.ok(html.indexOf(file) > 0 && html.indexOf(file) < html.indexOf("script.js?v="), file);
  }
});

test("실제 기본 진단의 첫 문제는 초4 게이트 문제다", () => {
  const controller = ui.createController({ catalog: realCatalog() });
  const started = controller.start({ sessionId: "first", timestamp: 1 });
  assert.equal(started.status, "QUESTION_SELECTED");
  assert.equal(started.session.mode, "ADAPTIVE_CONCEPT_DIAGNOSIS");
  assert.equal(started.session.currentGradeGate, "G4");
  assert.equal(started.question.testGradeBand, "G4");
});

test("중단 상태는 같은 현재 문제에서 재개된다", async () => {
  const controller = ui.createController({ catalog: realCatalog() });
  controller.start({ sessionId: "pause", timestamp: 1 });
  const before = controller.getSession().currentQuestion.problemId;
  const paused = await controller.pause(2);
  const restored = ui.createController({ catalog: realCatalog() });
  restored.restore(paused);
  restored.resume(3);
  assert.equal(restored.getSession().currentQuestion.problemId, before);
  assert.equal(restored.getSession().status, "IN_PROGRESS");
});

test("적응형 저장과 본 학습 graph 저장은 별도 키다", () => {
  assert.equal(storage.CLOUD_KEY, "mathAdaptiveLevelTestV1");
  assert.equal(storage.localStorageKey("student"), "studyCoinMathAdaptiveLevelTestV1:student");
  assert.doesNotMatch(script, /studyCoinMathConceptGraphLearningV1\s*=\s*studyCoinMathAdaptiveLevelTestV1/);
});

test("테스트 완료 이벤트는 학습 시작 버튼에서만 전달한다", () => {
  const start = script.indexOf('closest("#continueLearningAfterTest")');
  const dispatch = script.indexOf('CustomEvent("study:math-level-test-completed"', start);
  assert.ok(start >= 0 && dispatch > start);
  const adaptiveSubmitStart = script.indexOf("async function submitAdaptiveLevelTestAnswer");
  const adaptiveSubmit = script.slice(adaptiveSubmitStart, script.indexOf("async function startSubjectLevelTest", adaptiveSubmitStart));
  assert.doesNotMatch(adaptiveSubmit, /study:math-level-test-completed/);
});

test("기존 학년별 resetLevelTest 경로를 삭제하지 않았다", () => {
  assert.match(script, /function resetLevelTest\(\)/);
  assert.match(script, /mathGradePlacementTestMode/);
  assert.match(script, /if \(mathMode !== "grade"\)/);
});

test("고등 미완성 은행을 중3 문제로 자동 대체하는 연결이 없다", () => {
  const adaptiveStart = script.slice(script.indexOf("function buildAdaptiveLevelTestCatalog"), script.indexOf("function adaptiveLevelTestElements"));
  assert.doesNotMatch(adaptiveStart, /H1|H2|H3|buildMiddle3BasicQuestionPool/);
});

test("학생 화면 문자열에 학년 상승·하강과 내부 ID를 쓰지 않는다", () => {
  const uiSource = fs.readFileSync(path.join(ROOT, "math-adaptive-level-test-ui.js"), "utf8");
  const messages = uiSource.slice(uiSource.indexOf("const ALLOWED_MESSAGES"), uiSource.indexOf("const text"));
  assert.doesNotMatch(messages, /초5로 올라|중2로 내려|고1 수준|internalGradeBand|scopeId/);
});

test("적응형 연결은 승인된 콘텐츠 파일을 쓰지 않는다", () => {
  for (const file of [
    "middle3-sqrt-learning-content.js", "middle3-factorization-learning-content.js",
    "middle3-quadratic-equation-learning-content.js", "middle3-trigonometric-ratio-learning-content.js",
    "middle3-circle-properties-learning-content.js", "middle3-statistics-learning-content.js",
  ]) assert.doesNotMatch(script, new RegExp(`${file.replaceAll(".", "\\.")}.*write`, "i"));
});
