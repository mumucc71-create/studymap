const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const reportService = require("../math-level-report.js");
const detailData = require("../middle3-concept-diagnostics.js");
const root = path.resolve(__dirname, "..");

function conceptState(definition, overrides = {}) {
  return {
    conceptId: definition.conceptId,
    title: definition.conceptName,
    unitId: definition.unitId,
    unitTitle: definition.unitTitle,
    stageIndex: 0,
    status: "UNSEEN",
    attempts: 0,
    correct: 0,
    wrong: 0,
    giveUp: 0,
    diagnosisPriority: definition.order,
    prerequisiteConceptIds: definition.prerequisiteConceptIds,
    ...overrides,
  };
}

function memoryFixture() {
  return {
    version: 1,
    selectedGrade: "중등 3학년",
    bootstrap: { completed: true },
    cycleNumber: 4,
    conceptMastery: Object.fromEntries(detailData.concepts.map((definition) => [
      definition.conceptId,
      conceptState(definition),
    ])),
    conceptDiagnosisMap: Object.fromEntries(detailData.concepts.map((definition) => [
      definition.conceptId,
      {
        conceptId: definition.conceptId,
        unitId: definition.unitId,
        status: "PENDING",
        basicCorrectCount: 0,
        basicWrongCount: 0,
        basicGiveUpCount: 0,
        distinctProblemFamiliesChecked: [],
        priority: definition.order,
      },
    ])),
    recoveryStack: [],
    studyMapRecommendations: [],
    updatedAt: "2026-07-23T01:00:00.000Z",
  };
}

test("an untouched middle3 memory produces eight pending units and a deterministic start", () => {
  const memory = memoryFixture();
  const report = reportService.createReport(memory, detailData, { now: "2026-07-23T02:00:00.000Z" });

  assert.equal(report.units.length, 8);
  assert.equal(report.overall.totalConcepts, 43);
  assert.equal(report.overall.assessedConcepts, 0);
  assert.equal(report.overall.securedStageLabel, "진단 시작 전");
  assert.ok(report.units.every((unit) => unit.status === "PENDING"));
  assert.equal(report.startRecommendation.conceptId, detailData.concepts[0].conceptId);
  assert.equal(report.generatedAt, "2026-07-23T02:00:00.000Z");
});

test("unit and concept summaries preserve verified stage, weakness, and mastery evidence", () => {
  const memory = memoryFixture();
  memory.conceptMastery.m3_sqrt_meaning = conceptState(detailData.conceptById.m3_sqrt_meaning, {
    stageIndex: 2,
    status: "ACTIVE_STAGE",
    attempts: 3,
    correct: 2,
    wrong: 1,
  });
  memory.conceptMastery.m3_sqrt_value = conceptState(detailData.conceptById.m3_sqrt_value, {
    stageIndex: 1,
    status: "ACTIVE_STAGE",
    attempts: 3,
    correct: 3,
  });
  memory.conceptMastery.m3_irrational_number = conceptState(detailData.conceptById.m3_irrational_number, {
    stageIndex: 5,
    status: "MASTERED",
    attempts: 18,
    correct: 18,
  });
  memory.conceptMastery.m3_radical_simplification = conceptState(detailData.conceptById.m3_radical_simplification, {
    stageIndex: 0,
    status: "RECOVERY_REQUIRED",
    attempts: 1,
    giveUp: 1,
  });
  const report = reportService.createReport(memory, detailData, { now: "2026-07-23T02:00:00.000Z" });
  const realNumbers = report.units.find((unit) => unit.unitId === "m3-real-numbers");
  const sqrtMeaning = report.concepts.find((concept) => concept.conceptId === "m3_sqrt_meaning");

  assert.equal(report.overall.assessedConcepts, 4);
  assert.equal(report.overall.masteredConcepts, 1);
  assert.equal(report.overall.weakConcepts, 2);
  assert.equal(realNumbers.status, "RECOVERY");
  assert.equal(realNumbers.assessedConcepts, 4);
  assert.equal(realNumbers.securedStageLabel, "기본 보완");
  assert.equal(sqrtMeaning.currentStageLabel, "A2");
  assert.equal(sqrtMeaning.securedStageLabel, "A1");
  assert.equal(sqrtMeaning.accuracy, 67);
  assert.equal(report.weakConcepts[0].conceptId, "m3_radical_simplification");
});

test("the saved study-map recommendation becomes the report start button target", () => {
  const memory = memoryFixture();
  memory.studyMapRecommendations = [{
    id: "ERROR_REPAIR:m3_quadratic_formula",
    conceptId: "m3_quadratic_formula",
    type: "ERROR_REPAIR",
    title: "근의 공식",
    unitTitle: "이차방정식",
    recommendedStage: "ADVANCED_2",
    status: "ACTIVE",
  }];
  const report = reportService.createReport(memory, detailData, { now: "2026-07-23T02:00:00.000Z" });

  assert.equal(report.startRecommendation.recommendationId, "ERROR_REPAIR:m3_quadratic_formula");
  assert.equal(report.startRecommendation.conceptId, "m3_quadratic_formula");
  assert.equal(report.startRecommendation.stageLabel, "A2");
  assert.match(report.startRecommendation.reason, /바로잡/);
});

test("the report snapshot is JSON-safe for local and Firebase persistence", () => {
  const report = reportService.createReport(memoryFixture(), detailData, { now: "2026-07-23T02:00:00.000Z" });
  const restored = JSON.parse(JSON.stringify(report));

  assert.deepEqual(restored, report);
  assert.equal(restored.version, 1);
  assert.equal(restored.sourceUpdatedAt, "2026-07-23T01:00:00.000Z");
});

test("a fully mastered curriculum has no unnecessary start recommendation", () => {
  const memory = memoryFixture();
  detailData.concepts.forEach((definition) => {
    memory.conceptMastery[definition.conceptId] = conceptState(definition, {
      stageIndex: 5,
      status: "MASTERED",
      attempts: 18,
      correct: 18,
    });
  });
  const report = reportService.createReport(memory, detailData, { now: "2026-07-23T02:00:00.000Z" });

  assert.equal(report.overall.masteredConcepts, 43);
  assert.equal(report.overall.securedStageLabel, "A5");
  assert.equal(report.startRecommendation, null);
});

test("the report persists without replacing the frozen student record UI", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
  const learning = fs.readFileSync(path.join(root, "learning.js"), "utf8");
  const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

  assert.match(html, /class="growth-stats-ui"/);
  assert.doesNotMatch(html, /id="middle3LevelReport"/);
  assert.doesNotMatch(html, /id="middle3ReportUnits"/);
  assert.match(html, /math-level-report\.js[^]*elite-test\.js[^]*math-problem-metadata\.js[^]*script\.js/);
  assert.match(script, /middle3LevelTestMemory\.latestLevelReport = report/);
  assert.doesNotMatch(script, /renderMiddle3LevelReport/);
  assert.match(learning, /window\.STUDY_LEARNING_ENGINE = \{[^]*openMathStudyRecommendation/);
  assert.doesNotMatch(styles, /has-middle3-report \.growth-stats-ui/);
  assert.doesNotMatch(styles, /\.middle3-level-report/);
});
