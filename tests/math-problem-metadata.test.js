const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

global.window = global;
global.addEventListener = () => {};
const element = {
  querySelector() { return element; },
  addEventListener() {},
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  style: {},
  dataset: {},
  disabled: false,
  hidden: false,
  title: "",
  textContent: "",
  innerHTML: "",
};
global.document = {
  querySelector() { return element; },
  querySelectorAll() { return []; },
  addEventListener() {},
  dispatchEvent() {},
};
global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
global.alert = () => {};
global.CustomEvent = function CustomEvent() {};

require("../question-generators.js");
const detailData = require("../middle3-concept-diagnostics.js");
require("../middle3-stage-question-bank.js");
require("../math-curriculum-data.js");
require("../elite-test.js");

const legacyProblems = global.generatedConceptBanks.m3;
const eliteProblems = global.STUDY_ELITE_MATH_BANKS["중등 3학년"];
const roadmap = global.STUDY_MATH_ROADMAP_V2;
const originalCreatePracticeSet = roadmap.createPracticeSet;
const originalStaticContent = JSON.stringify({
  detail: detailData.problems,
  legacy: legacyProblems,
  elite: eliteProblems,
});
const originalRoadmapSample = originalCreatePracticeSet("equations-c09-n01", "basic", 2, 4);
const metadata = require("../math-problem-metadata.js");

test("중3 정적 메타데이터는 원문을 복제·수정하지 않고 407개만 색인한다", () => {
  assert.equal(metadata.staticProblemMetadata.length, 407);
  assert.equal(new Set(metadata.staticProblemMetadata.map((item) => item.problemId)).size, 407);
  assert.equal(JSON.stringify({ detail: detailData.problems, legacy: legacyProblems, elite: eliteProblems }), originalStaticContent);

  const report = metadata.createAuditReport({ includeRoadmapFixture: false });
  assert.deepEqual(report.staticBySource, {
    DETAIL_CONCEPT: 172,
    LEGACY_GRADE9: 225,
    ELITE_GRADE9: 10,
  });
  assert.deepEqual(report.staticByReviewStatus, {
    AUTO_APPROVED: 397,
    REVIEW_REQUIRED: 9,
    OUT_OF_SCOPE: 1,
  });
  assert.deepEqual(report.integrityErrors, []);
});

test("검토 필요·범위 밖 정적 문제는 STANDARD 및 ELITE 실행 목록에서 제외한다", () => {
  const legacyReview = metadata.staticProblemMetadata.filter((item) => item.source === "LEGACY_GRADE9" && item.reviewStatus === "REVIEW_REQUIRED");
  const eliteApproved = metadata.staticProblemMetadata.filter((item) => item.source === "ELITE_GRADE9" && item.reviewStatus === "AUTO_APPROVED");
  const eliteReview = metadata.staticProblemMetadata.filter((item) => item.source === "ELITE_GRADE9" && item.reviewStatus === "REVIEW_REQUIRED");
  const eliteOutOfScope = metadata.staticProblemMetadata.filter((item) => item.source === "ELITE_GRADE9" && item.reviewStatus === "OUT_OF_SCOPE");

  assert.equal(legacyReview.length, 8);
  assert.equal(eliteApproved.length, 8);
  assert.equal(eliteReview.length, 1);
  assert.equal(eliteOutOfScope.length, 1);
  assert.ok(legacyReview.every((item) => item.executionStatus === "EXCLUDED_REVIEW" && item.stage === null));
  assert.equal(metadata.executableStaticMetadata({ mode: "STANDARD" }).length, 389);
  assert.equal(metadata.executableStaticMetadata({ mode: "ELITE" }).length, 8);
  assert.ok(!metadata.executableStaticMetadata({ mode: "ELITE" }).some((item) => item.problemId === "elite-m3-09"));
});

test("로드맵은 666개 스냅샷을 저장하지 않고 222개 안정 규칙으로 색인한다", () => {
  const rules = metadata.roadmapGenerationRules;
  assert.equal(rules.length, 222);
  assert.equal(new Set(rules.map((item) => item.ruleId)).size, 222);
  assert.ok(rules.every((item) => !Object.hasOwn(item, "round") && !Object.hasOwn(item, "count")));

  const report = metadata.createAuditReport({ includeRoadmapFixture: false });
  assert.deepEqual(report.roadmapRulesByStatus, {
    ACTIVE: 126,
    REVIEW_REQUIRED: 78,
    OUT_OF_SCOPE: 18,
  });
  assert.deepEqual(report.roadmapRulesByExecutionStatus, {
    EXECUTABLE: 105,
    METADATA_ONLY: 21,
    EXCLUDED_REVIEW: 78,
    OUT_OF_SCOPE: 18,
  });
});

test("resolver는 round와 count가 달라도 같은 규칙을 사용하고 생성 문항 원문을 보존한다", () => {
  const first = roadmap.createPracticeSet("equations-c09-n01", "basic", 1, 1)[0];
  const changed = roadmap.createPracticeSet("equations-c09-n01", "basic", 4, 7);
  assert.equal(changed.length, 7);
  assert.ok(changed.every((item) => item.runtimeMetadata.ruleId === first.runtimeMetadata.ruleId));
  assert.equal(changed[0].runtimeMetadata.generationContext.round, 4);
  assert.equal(changed[0].runtimeMetadata.generationContext.count, 7);

  const resolvedOriginalSample = roadmap.createPracticeSet("equations-c09-n01", "basic", 2, 4)
    .map(({ runtimeMetadata, ...problem }) => problem);
  assert.deepEqual(resolvedOriginalSample, originalRoadmapSample);
});

test("검토 필요·범위 밖 로드맵 규칙과 서술형을 일반 객관식 실행에서 분리한다", () => {
  const review = roadmap.createPracticeSet("equations-c09-n04", "basic", 1, 1)[0];
  const outOfScope = roadmap.createPracticeSet("geometry-measurement-c11-n06", "basic", 1, 1)[0];
  const written = roadmap.createPracticeSet("equations-c09-n01", "written", 1, 1)[0];

  assert.equal(review.runtimeMetadata.reviewStatus, "REVIEW_REQUIRED");
  assert.equal(review.runtimeMetadata.executionStatus, "EXCLUDED_REVIEW");
  assert.equal(outOfScope.runtimeMetadata.reviewStatus, "OUT_OF_SCOPE");
  assert.equal(outOfScope.runtimeMetadata.executionStatus, "OUT_OF_SCOPE");
  assert.equal(written.runtimeMetadata.executionStatus, "METADATA_ONLY");
  assert.equal(written.runtimeMetadata.stage, null);
  assert.equal(written.runtimeMetadata.stageCandidate, "A2");

  const executable = metadata.createExecutableRoadmapSet({
    nodeIds: ["equations-c09-n04", "equations-c09-n01", "equations-c09-n02", "equations-c09-n03"],
    mode: "basic",
    round: 1,
    count: 3,
  });
  assert.ok(executable.length > 0);
  assert.ok(executable.every((item) => item.runtimeMetadata.executionStatus === "EXECUTABLE"));
  assert.ok(executable.every((item) => item.nodeId !== "equations-c09-n04"));
  assert.equal(new Set(executable.map((item) => item.runtimeMetadata.solutionPathSignature)).size, executable.length);
});

test("666개 재현 감사 fixture가 합의된 분류를 실제 생성 결과로 검증한다", () => {
  const fixture = metadata.createRoadmapAuditFixture(1, 3);
  assert.equal(fixture.length, 666);
  const report = metadata.createAuditReport();
  assert.equal(report.roadmapAuditFixtureCount, 666);
  assert.deepEqual(report.roadmapAuditByReviewStatus, {
    AUTO_APPROVED: 378,
    REVIEW_REQUIRED: 234,
    OUT_OF_SCOPE: 54,
  });
  assert.deepEqual(report.roadmapAuditByExecutionStatus, {
    EXECUTABLE: 315,
    METADATA_ONLY: 63,
    EXCLUDED_REVIEW: 234,
    OUT_OF_SCOPE: 54,
  });
  assert.equal(report.supply.shortageConceptCount, 0);
});

test("실제 제시된 로드맵 문제만 불변 시도 스냅샷과 최근 중복 방지 증거로 남긴다", () => {
  const generated = roadmap.createPracticeSet("equations-c09-n01", "basic", 3, 1)[0];
  const snapshot = metadata.createAttemptSnapshot(generated, {
    presentationId: "session-1:initial:q1",
    questionId: "q1",
    presentedAt: "2026-07-23T00:00:00.000Z",
  });
  assert.equal(snapshot.runtimeMetadata.source, "ROADMAP_RUNTIME");
  assert.equal(snapshot.runtimeMetadata.generationContext.round, 3);
  assert.ok(Object.isFrozen(snapshot));
  assert.ok(Object.isFrozen(snapshot.choices));

  const recent = metadata.rememberRecentEvidence([], snapshot, 60);
  assert.equal(recent.length, 1);
  assert.equal(recent[0].problemId, generated.id);
  assert.equal(recent[0].structureSignature, generated.runtimeMetadata.structureSignature);
  assert.equal(metadata.createAttemptSnapshot({ id: "static-only" }), null);
});

test("브라우저 로드 순서와 학습 화면의 제시 시점 저장 연결이 유지된다", () => {
  const indexSource = fs.readFileSync(require.resolve("../index.html"), "utf8");
  const learningSource = fs.readFileSync(require.resolve("../learning.js"), "utf8");
  assert.match(indexSource, /elite-test\.js[^]*math-problem-metadata\.js[^]*learning\.js/);
  assert.match(learningSource, /function recordRoadmapProblemPresentation\(/);
  assert.match(learningSource, /state\.roadmapAttemptHistory\.push\(snapshot\)/);
  assert.match(learningSource, /recordRoadmapProblemPresentation\(question, session\)/);
});
