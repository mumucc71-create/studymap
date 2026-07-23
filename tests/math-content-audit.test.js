const assert = require("node:assert/strict");
const fs = require("node:fs");

global.window = global;
require("../question-generators.js");
require("../learning-content.js");
require("../math-curriculum-data.js");
require("../math-question-mapping.js");

const banks = global.generatedConceptBanks;
const roadmap = global.STUDY_MATH_ROADMAP_V2;
const mapping = global.STUDY_MATH_QUESTION_MAPPING;
const questions = Object.values(banks).flat();

const comparableValue = (value) => {
  const text = String(value).trim();
  const fraction = text.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
  return text;
};

assert.equal(questions.length, 1140, "초4~중3 문제은행 문항 수가 달라졌습니다.");
assert.equal(new Set(questions.map((question) => question.questionId)).size, questions.length, "중복 문제 ID가 있습니다.");

questions.forEach((question) => {
  assert.ok(question.questionText.trim(), `${question.questionId}: 문제 문장이 없습니다.`);
  assert.ok(question.answer.trim(), `${question.questionId}: 정답이 없습니다.`);
  assert.equal(question.choices.length, 4, `${question.questionId}: 보기가 4개가 아닙니다.`);
  assert.equal(new Set(question.choices).size, 4, `${question.questionId}: 같은 보기가 중복됩니다.`);
  assert.ok(question.choices.includes(question.answer), `${question.questionId}: 보기에 정답이 없습니다.`);
  assert.doesNotMatch(JSON.stringify(question), /NaN|undefined|null/, `${question.questionId}: 잘못된 데이터 값이 있습니다.`);
  const answerValue = comparableValue(question.answer);
  assert.equal(question.choices.filter((choice) => comparableValue(choice) === answerValue).length, 1, `${question.questionId}: 값이 같은 정답 보기가 여러 개입니다.`);
});

assert.equal(roadmap.worlds.length, 7, "수학 World 수가 달라졌습니다.");
assert.equal(roadmap.chapters.length, 77, "수학 단원 수가 달라졌습니다.");
assert.equal(roadmap.nodes.length, 511, "수학 세부 노드 수가 달라졌습니다.");
assert.equal(new Set(roadmap.nodes.map((node) => node.id)).size, roadmap.nodes.length, "중복 수학 노드 ID가 있습니다.");

roadmap.nodes.forEach((node) => {
  assert.ok(roadmap.worldById[node.worldId], `${node.id}: 연결된 World가 없습니다.`);
  assert.ok(roadmap.chapterById[node.chapterId], `${node.id}: 연결된 단원이 없습니다.`);
  assert.ok(roadmap.chapterById[node.chapterId].nodeIds.includes(node.id), `${node.id}: 단원의 노드 목록과 서로 맞지 않습니다.`);
});

const practiceModes = ["basic", "typePractice", "advanced", "written", "pastExam", "assessment"];
const generatedRoadmapQuestions = roadmap.nodes.flatMap((node) => practiceModes.flatMap((mode) => roadmap.createPracticeSet(node.id, mode, 1, 3)));
generatedRoadmapQuestions.forEach((question) => {
  assert.ok(question.prompt.trim(), `${question.id}: 문제 문장이 없습니다.`);
  assert.ok(question.solution.trim(), `${question.id}: 풀이가 없습니다.`);
  assert.doesNotMatch(JSON.stringify(question), /NaN|undefined/, `${question.id}: 잘못된 데이터 값이 있습니다.`);
  if (question.questionType === "writtenResponse") {
    assert.equal(question.choices.length, 0, `${question.id}: 서술형에 객관식 보기가 있습니다.`);
  } else {
    assert.equal(question.choices.length, 4, `${question.id}: 보기가 4개가 아닙니다.`);
    assert.equal(new Set(question.choices).size, 4, `${question.id}: 중복 보기가 있습니다.`);
    assert.ok(question.choices.includes(question.answer), `${question.id}: 보기에 정답이 없습니다.`);
  }
});

roadmap.nodes.forEach((node) => {
  const basic = roadmap.createPracticeSet(node.id, "basic", 1, 1)[0];
  const typePractice = roadmap.createPracticeSet(node.id, "typePractice", 1, 1)[0];
  const advanced = roadmap.createPracticeSet(node.id, "advanced", 1, 1)[0];
  assert.ok(basic.difficulty < typePractice.difficulty, `${node.id}: 기본과 유형 난이도가 구분되지 않습니다.`);
  assert.ok(typePractice.difficulty < advanced.difficulty, `${node.id}: 유형과 심화 난이도가 구분되지 않습니다.`);
});

assert.equal(mapping.mappings.length, 40, "기존 중2 문제 연결 수가 달라졌습니다.");
assert.equal(mapping.unmapped.length, 0, "대상 노드를 찾지 못한 기존 문제가 있습니다.");
assert.equal(mapping.activeMappings.length, mapping.mappings.length, "검토 상태로 남아 실제 연결되지 않은 기존 문제가 있습니다.");

const learningSource = fs.readFileSync(require.resolve("../learning.js"), "utf8");
assert.match(learningSource, /return startMathRoadmapTopic\(worldIndex, topicIndex\);/, "일반 수학 단원이 로드맵 문제로 연결되지 않습니다.");
assert.match(learningSource, /function registerLargeNumberModeQuestions\(/, "큰 수 단계별 문제 연결 함수가 없습니다.");
assert.match(learningSource, /return startLargeNumberModePractice\(Number\(state\.largeNumberStepIndex/, "큰 수 기본·유형·심화 단계가 실제 문제풀이로 연결되지 않습니다.");
assert.doesNotMatch(learningSource.match(/action === "open-math-world-topic"[\s\S]*?action === "open-large-number-step"/)?.[0] || "", /currentUnlockedStage/, "수학 단원 선택이 기존 중2 과정으로 되돌아갑니다.");

const visibleWorldTopics = [
  ["큰 수", "덧셈과 뺄셈", "곱셈", "나눗셈", "혼합계산", "약수와 배수", "분수", "소수", "응용 계산"],
  ["X 찾기", "등식", "역연산", "문자의 이해", "식 만들기", "일차방정식", "방정식 활용", "연립방정식", "이차방정식", "고등 방정식"],
  ["규칙 찾기", "대응", "좌표", "정비례", "반비례", "일차함수", "이차함수", "함수 활용"],
  ["점·선·각", "삼각형", "사각형", "원", "둘레", "넓이", "겉넓이", "부피", "합동", "닮음", "피타고라스", "삼각비"],
  ["표와 그래프", "평균", "중앙값", "최빈값", "경우의 수", "순열", "조합", "확률", "조건부확률", "통계 활용"],
  ["규칙 찾기", "수열", "일반항", "등차수열", "등차수열의 합", "등비수열", "등비수열의 합", "점화식", "수학적 귀납법"],
  ["함수의 극한", "연속", "변화율", "미분", "도함수", "최대·최소", "적분", "정적분", "미적분 활용"],
];
const topicAliases = {
  "수열": "수열의 뜻", "둘레": "둘레와 넓이", "넓이": "둘레와 넓이", "겉넓이": "겉넓이와 부피", "부피": "겉넓이와 부피",
  "평균": "평균·중앙값·최빈값", "중앙값": "평균·중앙값·최빈값", "최빈값": "평균·중앙값·최빈값", "변화율": "평균변화율",
  "미분": "미분계수", "최대·최소": "미분 활용", "적분": "부정적분", "미적분 활용": "적분 활용", "통계 활용": "통계적 추정",
};
const normalizeTitle = (value) => String(value).replace(/[·\s]/g, "");
let visibleTopicCount = 0;
visibleWorldTopics.forEach((topics, worldIndex) => {
  const world = roadmap.worlds[worldIndex];
  const chapterList = world.chapterIds.map((chapterId) => roadmap.chapterById[chapterId]).filter(Boolean);
  topics.forEach((topic) => {
    visibleTopicCount += 1;
    const target = topicAliases[topic] || topic;
    const chapter = chapterList.find((item) => item.title === target)
      || chapterList.find((item) => normalizeTitle(item.title).includes(normalizeTitle(target)) || normalizeTitle(target).includes(normalizeTitle(item.title)));
    assert.ok(chapter, `${world.title} > ${topic}: 연결할 로드맵 단원이 없습니다.`);
    const nodeQuestions = chapter.nodeIds.filter((nodeId) => !roadmap.nodeById[nodeId].isMasteryNode).map((nodeId) => roadmap.createPracticeSet(nodeId, "basic", 1, 1)[0]);
    assert.ok(nodeQuestions.length > 0, `${world.title} > ${topic}: 연결된 문제가 없습니다.`);
  });
});
assert.equal(visibleTopicCount, 67, "화면의 수학 단원 수가 달라졌습니다.");

console.log(JSON.stringify({
  questions: questions.length,
  worlds: roadmap.worlds.length,
  chapters: roadmap.chapters.length,
  nodes: roadmap.nodes.length,
  generatedRoadmapQuestions: generatedRoadmapQuestions.length,
  legacyMappings: mapping.mappings.length,
  visibleTopics: visibleTopicCount,
  invalidChoices: 0,
}, null, 2));
