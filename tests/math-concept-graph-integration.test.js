const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const recommendations = require("../math-study-recommendations.js");
const runtime = require("../math-concept-graph-runtime.js");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("index는 그래프 데이터→런타임→매퍼→저장→UI 순서로 로드한다", () => {
  const html = read("index.html");
  const names = ["math-concept-graph-data.js", "math-concept-alias-registry.js", "math-concept-graph-runtime-state.js",
    "math-concept-graph-runtime.js", "math-level-test-concept-mapper.js", "math-concept-graph-storage.js", "math-concept-graph-ui.js"];
  const positions = names.map((name) => html.indexOf(name));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});
test("레벨테스트 엔진은 canonical evidence 공개 함수를 제공한다", () => {
  const engine = require("../level-test-engine.js");
  ["mapLevelTestQuestionToConceptIds", "convertLevelTestResultToEvidence", "mergeLevelTestEvidence",
    "calculateInitialConceptMastery", "selectInitialLearningConcept", "attachCanonicalConceptEvidence"]
    .forEach((name) => assert.equal(typeof engine[name], "function"));
});

test("레벨테스트 원본 selectedGrade를 보존하면서 그래프 완료 이벤트를 보낸다", () => {
  const source = read("script.js");
  assert.match(source, /study:math-level-test-completed/);
  assert.match(source, /selectedGrade: getSelectedGrade\(\)/);
  assert.doesNotMatch(source, /delete\s+.*selectedGrade/);
});

test("중3 7개 단원 UI는 FINAL 증거를 공통 그래프 이벤트로 전달한다", () => {
  ["middle3-spring-unit-ui-factory.js", "middle3-quadratic-learning-ui.js", "middle3-sqrt-learning-ui.js"].forEach((file) => {
    const source = read(file);
    assert.match(source, /study:math-concept-final/);
    assert.match(source, /submissionId/);
    assert.match(source, /finalSubmission:\s*true/);
  });
});

test("단원별 기존 저장 key는 그래프 저장 key와 공유되지 않는다", () => {
  const graphStorage = read("math-concept-graph-storage.js");
  assert.match(graphStorage, /studyCoinMathConceptGraphLearningV1/);
  ["middle3SqrtLearningV1", "middle3FactorizationLearningV1", "middle3QuadraticEquationLearningV1",
    "middle3TrigLearningV1", "middle3CircleLearningV1", "middle3StatisticsLearningV1"]
    .forEach((key) => assert.equal(graphStorage.includes(key), false));
});

test("그래프 추천이 우선이고 기존 추천은 fallback으로 유지된다", () => {
  const state = runtime.createInitialGraphState({ activeConceptId: "m3_quadratic_meaning", timestamp: 0 });
  const graphItems = recommendations.generateGraphRecommendations(state);
  assert.equal(graphItems[0].type, "ENTRY_CHECK");
  const legacy = recommendations.generateRecommendations({ bootstrap: { completed: false } }, { graphState: state });
  assert.ok(legacy.length > 0);
  assert.equal(legacy[0].source, "active-concept");
});

test("학생 화면용 HTML에는 개념 상태 컨테이너 두 곳이 있다", () => {
  const html = read("index.html");
  assert.equal((html.match(/id="mathConceptGraphLearningStatus"/g) || []).length, 1);
  assert.equal((html.match(/id="mathConceptGraphResult"/g) || []).length, 1);
});

test("학습 화면 문구는 학년 상승·하강 대신 개념 중심 표현을 사용한다", () => {
  const source = read("learning.js");
  assert.match(source, /현재 학습 ·/);
  assert.match(source, /원래 학습으로 돌아가기/);
  assert.doesNotMatch(source, /중3 수학 ·/);
});

test("기존 승인 중3 콘텐츠 파일의 현재 SHA-256을 전수 생성한다", () => {
  const files = [
    "middle3-sqrt-learning-model.js", "middle3-sqrt-learning-content.js",
    "middle3-factorization-learning-model.js", "middle3-factorization-learning-content.js",
    "middle3-quadratic-equation-learning-model.js", "middle3-quadratic-equation-learning-content.js",
    "middle3-quadratic-learning-model.js", "middle3-quadratic-learning-content.js",
    "middle3-trigonometric-ratio-learning-model.js", "middle3-trigonometric-ratio-learning-content.js",
    "middle3-circle-properties-learning-model.js", "middle3-circle-properties-learning-content.js",
    "middle3-statistics-learning-model.js", "middle3-statistics-learning-content.js",
  ];
  const hashes = files.map((file) => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex"));
  assert.equal(hashes.length, 14);
  assert.equal(new Set(hashes).size, 14);
});

test("기존 7개 World 데이터 파일은 이번 연결 코드에서 수정 대상으로 참조하지 않는다", () => {
  const changedModules = ["math-level-test-concept-mapper.js", "math-concept-graph-storage.js", "math-concept-graph-ui.js"]
    .map(read).join("\n");
  assert.doesNotMatch(changedModules, /WORLD_DATA\s*=|worlds\.push|mathCurriculum\.worlds/);
});
