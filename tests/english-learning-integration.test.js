const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const subjectLearning = fs.readFileSync(path.join(root, "subject-learning.js"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const ui = fs.readFileSync(path.join(root, "english-learning-ui.js"), "utf8");

test("영어 모델과 UI는 기존 과목 학습 런타임보다 먼저 로드된다", () => {
  const modelIndex = index.indexOf('src="english-learning-model.js');
  const sampleIndex = index.indexOf('src="data/english-learning-samples.js');
  const uiIndex = index.indexOf('src="english-learning-ui.js');
  const qualityContentIndex = index.indexOf('src="english-learning-content-level1.js');
  const qualityValidatorIndex = index.indexOf('src="english-learning-quality-validator.js');
  const curriculumIndex = index.indexOf('src="english-master-curriculum.js');
  const runtimeIndex = index.indexOf('src="subject-learning.js');
  assert.ok(modelIndex > 0);
  assert.ok(modelIndex < sampleIndex && sampleIndex < uiIndex && uiIndex < runtimeIndex);
  assert.ok(uiIndex < qualityContentIndex && qualityContentIndex < qualityValidatorIndex);
  assert.ok(qualityValidatorIndex < curriculumIndex && curriculumIndex < runtimeIndex);
});

test("기존 영어 화면은 구조화 렌더러와 별도 영어 저장 모델을 사용한다", () => {
  assert.match(subjectLearning, /renderStructuredEnglishQuestion/);
  assert.match(subjectLearning, /STUDY_ENGLISH_LEARNING/);
  assert.match(subjectLearning, /STUDY_ENGLISH_UI/);
  assert.match(subjectLearning, /model\.recordQuestionAttempt/);
  assert.match(subjectLearning, /model\.saveState\(localStorage, userId, recorded\.state, window\.STUDY_CLOUD_AUTH\)/);
  assert.match(subjectLearning, /STUDY_ENGLISH_LEARNING\.hydrateState/);
  assert.match(subjectLearning, /completedEnglishStageIds/);
});

test("필수 다섯 UI 유형과 모바일 선택형 스타일이 구현되어 있다", () => {
  for (const answerType of ["multipleChoice", "fillBlank", "matching", "wordOrder", "errorFinding"]) {
    assert.match(ui, new RegExp(answerType));
  }
  for (const selector of ["english-word-order", "english-matching", "english-error-tokens", "english-structured-question"]) {
    assert.match(styles, new RegExp(`\\.${selector}`));
  }
  assert.doesNotMatch(ui, /dragstart|drop\(/);
});
