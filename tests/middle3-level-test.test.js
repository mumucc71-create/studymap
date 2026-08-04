const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const engineSource = fs.readFileSync(path.join(root, "level-test-engine.js"), "utf8");
const levelTestEngine = require("../level-test-engine.js");
const generatorSource = fs.readFileSync(path.join(root, "question-generators.js"), "utf8");

const middle3Units = [
  "실수와 제곱근",
  "다항식의 곱셈과 인수분해",
  "이차방정식",
  "이차함수",
  "피타고라스 정리",
  "삼각비",
  "원의 성질",
  "통계와 확률",
];

test("level-test subject selectors expose only math and English", () => {
  const setupPicker = html.match(/id="levelTestSubjectPicker"[\s\S]*?<\/div>/)?.[0] || "";
  const modalPicker = html.match(/class="test-subject-options"[\s\S]*?<\/div>/)?.[0] || "";

  for (const picker of [setupPicker, modalPicker]) {
    assert.match(picker, /수학/);
    assert.match(picker, /영어/);
    assert.doesNotMatch(picker, /과학|한자|독서/);
  }
});

test("middle-school grade 3 bank covers all eight units with basic questions", () => {
  const context = { window: {}, console: { log() {} } };
  vm.createContext(context);
  vm.runInContext(generatorSource, context);
  const bank = context.window.generatedConceptBanks.m3;

  assert.equal(bank.length, 225);
  middle3Units.forEach((unit) => {
    const basicQuestions = bank.filter((question) => question.unit === unit && question.difficulty <= 2);
    assert.ok(basicQuestions.length >= 2, `${unit} 기본 문항이 2개 이상이어야 합니다.`);
  });
});

test("math placement bootstraps with 32 canonical middle3 questions and continues in cycles", () => {
  assert.match(script, /middle3BasicTestMode = "middle3-bootstrap"/);
  assert.match(script, /middle3CycleTestMode = "middle3-continuous-cycle"/);
  assert.match(script, /middle3BasicQuestionsPerUnit = 4/);
  assert.match(script, /function buildMiddle3BasicQuestionPool\(/);
  assert.match(script, /buildGradeTestSession\(\{ selectedGrade: "M3" \}\)/);
  assert.match(script, /routed\.questions\?\.length === 32/);
  assert.match(script, /createAdaptiveState\(selectedGrade, middle3BasicUnitOrder\)/);
  assert.match(script, /if \(isMiddle3BasicLevelTest\(\)\) \{/);
  assert.match(script, /engine\?\.validateProblem\(question, \{/);
  assert.match(script, /strictMathValidation: true/);
  assert.match(script, /return attempts >= adaptiveQuestionPool\.length/);
  assert.match(script, /completeMiddle3Bootstrap\(\)/);
  assert.match(script, /if \(isMiddle3CycleLevelTest\(\)\) return false/);
  assert.match(script, /markStopped\(middle3LevelTestMemory, remainingSeconds\)/);
  assert.match(engineSource, /DEFAULT_CYCLE_SIZE = 24/);
  assert.match(engineSource, /ADVANCED_5/);
});

test("continuous math UI uses give-up and loads the cycle engine before the app", () => {
  assert.match(html, /id="unknownQuestion">포기<\/button>/);
  const engineIndex = html.indexOf('src="level-test-engine.js');
  const appIndex = html.indexOf('src="script.js');
  assert.ok(engineIndex >= 0 && appIndex > engineIndex);
  assert.match(script, /timeLabel\.textContent = isContinuousMiddle3LevelTest\(\) \? "학습 시간"/);
  assert.match(script, /title: "기본 진단이 완료되었습니다\."/);
  assert.match(script, /title: "레벨업!"/);
  assert.match(script, /title: "사이클 완료"/);
  assert.match(script, /title: "기초 연결이 안정되었습니다\."/);
  assert.match(script, /queueLevelTestNotice\(cycleCompletionNotice\(result\.cycleSummary\)\)/);
  assert.match(script, /`사이클 \$\{cycle\?\.number/);
  assert.match(script, /seedRecentHistoryFromBootstrap\(middle3LevelTestMemory\)/);
});

test("re-entering the math test resumes saved progress before resetting", () => {
  const startOffset = script.indexOf('async function startSubjectLevelTest(subjectName, mathMode = "adaptive")');
  const endOffset = script.indexOf("\nfunction ", startOffset);
  const startFunction = startOffset >= 0 ? script.slice(startOffset, endOffset) : "";
  const savedCheck = startFunction.indexOf("const saved = getSavedLevelTest()");
  const resetCall = startFunction.indexOf("resetLevelTest(");
  assert.ok(savedCheck >= 0, "수학 시작 전에 저장 기록을 확인해야 합니다.");
  assert.ok(resetCall > savedCheck, "저장 확인이 초기화보다 먼저 실행되어야 합니다.");
  assert.ok(startFunction.indexOf("await hydrateMiddle3LevelTestFromCloud()") < savedCheck);
  assert.match(startFunction, /showResumeScreen\(saved\)/);
});

test("middle3 structural rotation supplies at least four continuous cycles", () => {
  const context = { window: {}, console: { log() {} } };
  vm.createContext(context);
  vm.runInContext(generatorSource, context);
  const pool = context.window.generatedConceptBanks.m3.map((question) => ({
    ...question,
    id: question.questionId,
    concept: question.unit,
    problem: question.questionText,
    adaptiveLevel: question.difficulty,
  }));
  const concepts = [...new Map(pool.map((question) => [question.conceptId, {
    conceptId: question.conceptId,
    title: question.unit,
    prerequisiteConceptIds: question.prerequisiteConcepts,
  }])).values()];
  const state = levelTestEngine.createStudentState({
    userId: "rotation@example.com",
    concepts,
    targetConceptIds: concepts.map((concept) => concept.conceptId),
  });
  state.bootstrap.completed = true;
  state.phase = levelTestEngine.PHASE_CYCLING;

  for (let index = 0; index < levelTestEngine.DEFAULT_CYCLE_SIZE * 4; index += 1) {
    const question = levelTestEngine.selectNextProblem(state, pool);
    assert.ok(question, `${index + 1}번째 연속 문항이 있어야 합니다.`);
    levelTestEngine.recordOutcome(state, question, "correct", 10);
  }
  assert.equal(state.cycleNumber, 4);
  assert.equal(state.session.active, true);
});
