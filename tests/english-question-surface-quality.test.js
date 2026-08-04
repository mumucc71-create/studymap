const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");

function loadEnglishContent() {
  const context = { window: { STUDY_SUBJECT_CONTENT: {} } };
  vm.createContext(context);
  const files = [
    "data/english-curriculum.js",
    ...Array.from({ length: 20 }, (_, index) => `data/english-questions-lv${String(index + 1).padStart(2, "0")}.js`),
    "english-master-curriculum.js",
  ];
  files.forEach((file) => vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file }));
  return context.window.STUDY_SUBJECT_CONTENT.english;
}

test("영어 객관식 화면은 영어 중심이고 정답이 하나뿐이다", () => {
  const content = loadEnglishContent();
  const questions = content.stages.flatMap((course) => course.courseStages.flatMap((stage) => stage.questions));
  const multipleChoice = questions.filter((question) => question.choices?.length >= 4);
  const mixedParticle = /[A-Za-z][A-Za-z' -]*(?:을|를|은|는|이|가|에서|에게|으로|로)/u;

  assert.ok(multipleChoice.length > 19000);
  multipleChoice.forEach((question) => {
    assert.doesNotMatch(String(question.question || ""), mixedParticle, question.id);
    question.choices.forEach((choice) => {
      assert.doesNotMatch(String(choice), mixedParticle, question.id);
      assert.doesNotMatch(String(choice), /[가-힣]/u, question.id);
    });
    assert.equal(new Set(question.choices).size, question.choices.length, question.id);
    assert.equal(question.choices.filter((choice) => choice === question.answer).length, 1, question.id);
  });
});

test("현재완료 뜻 문제는 혼합 번역 대신 명확한 영어 문장 선택으로 표시된다", () => {
  const content = loadEnglishContent();
  const question = content.stages
    .flatMap((course) => course.courseStages.flatMap((stage) => stage.questions))
    .find((item) => item.id === "EN-L07-C01-S01-Q04");

  assert.equal(question.question, "Choose the correct sentence.");
  assert.equal(question.answer, "She has eaten lunch.");
  assert.deepEqual(Array.from(question.choices), [
    "She has eaten lunch.",
    "She have eaten lunch.",
    "She has eat lunch.",
    "She eats lunch.",
  ]);
});
