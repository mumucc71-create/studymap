const test = require("node:test");
const assert = require("node:assert/strict");

global.window = global;
require("../question-generators.js");
const banks = require("../math-level-test-grade-banks.js");
const quality = require("../math-level-test-quality-validator.js");

const expectedLengths = { G4: 24, G5: 27, G6: 27, M1: 30, M2: 30 };

test("초4~중2 선택은 선택한 학년 은행만 사용하고 지정 길이를 지킨다", () => {
  for (const [gradeBand, target] of Object.entries(expectedLengths)) {
    const session = banks.buildGradeTestSession({ selectedGrade: gradeBand, generatedConceptBanks: global.generatedConceptBanks });
    assert.equal(session.status, "READY", gradeBand);
    assert.equal(session.questions.length, target, gradeBand);
    assert.ok(session.questions.every((question) => question.testGradeBand === gradeBand), gradeBand);
    assert.equal(quality.validateSession(session).valid, true, gradeBand);
  }
});

test("지원하지 않는 학년은 중3으로 대체하지 않고 TEST_BANK_NOT_READY를 반환한다", () => {
  const session = banks.buildGradeTestSession({ selectedGrade: "초등 3학년", generatedConceptBanks: global.generatedConceptBanks });
  assert.equal(session.status, "TEST_BANK_NOT_READY");
  assert.equal(session.questions.length, 0);
  assert.doesNotMatch(session.bankId, /M3_CANONICAL/);
});

test("중3 초기 진단은 8단원 각 4문항의 세부 canonical 32문항이다", () => {
  const session = banks.buildGradeTestSession({ selectedGrade: "중등 3학년" });
  assert.equal(session.status, "READY");
  assert.equal(session.bankId, "M3_CANONICAL_INITIAL_32");
  assert.equal(session.questions.length, 32);
  assert.equal(new Set(session.questions.map((question) => question.unit)).size, 8);
  assert.ok(session.questions.every((question) => question.canonicalConceptId?.startsWith("m3_")));
  assert.ok(session.questions.every((question) => question.unitAliasId === null));
  assert.equal(quality.validateSession(session).valid, true);
});

test("중3 단원마다 기본·적용·오류 진단·독립 확인 역할이 하나씩 있다", () => {
  const session = banks.buildMiddle3InitialDiagnostic();
  for (const unit of banks.MIDDLE3_UNIT_CONTRACTS) {
    const roles = session.questions.filter((question) => question.unit === unit.unitName).map((question) => question.diagnosticRole).sort();
    assert.deepEqual(roles, [...banks.DIAGNOSTIC_ROLES].sort(), unit.unitName);
  }
});

test("중3 연속 진단 계약은 기존 998문항과 누락 4개 canonical 보완을 명시한다", () => {
  const contract = banks.getMiddle3ContinuousPoolContract();
  assert.equal(contract.expectedLegacyPoolSize, 998);
  assert.deepEqual(contract.supplementalConceptIds, [
    "m3_trig_special_angles", "m3_circle_foundations", "m3_statistics_representative_range", "m3_statistics_frequency_graphs",
  ]);
  assert.ok(contract.supplementalConceptIds.every((conceptId) => contract.supplementalProblems.some((problem) => problem.conceptId === conceptId)));
});

test("고등 공통과 선택과목 경로는 분리되고 기존 1문항 은행을 사용하지 않는다", () => {
  const h1 = banks.buildGradeTestSession({ selectedGrade: "고등 1학년" });
  const h2 = banks.buildGradeTestSession({ selectedGrade: "고등 2학년" });
  const h2Elective = banks.buildGradeTestSession({ selectedGrade: "고등 2학년", elective: "PROBABILITY_STATISTICS" });
  const h3NoElective = banks.buildGradeTestSession({ selectedGrade: "고등 3학년" });
  const h3Geometry = banks.buildGradeTestSession({ selectedGrade: "고등 3학년", elective: "GEOMETRY" });
  assert.equal(h1.bankId, "H1_COMMON");
  assert.equal(h2.bankId, "H2_COMMON");
  assert.equal(h2Elective.bankId, "H2_PROBABILITY_STATISTICS");
  assert.equal(h3NoElective.status, "TEST_BANK_NOT_READY");
  assert.equal(h3Geometry.bankId, "H3_GEOMETRY");
  for (const session of [h1, h2, h2Elective, h3NoElective, h3Geometry]) assert.equal(session.questions.length, 0);
});

test("출제 금지 registry 문항은 실제 세션에서 제외된다", () => {
  for (const gradeBand of ["G5", "M2"]) {
    const session = banks.buildGradeTestSession({ selectedGrade: gradeBand, generatedConceptBanks: global.generatedConceptBanks });
    assert.ok(session.questions.every((question) => !banks.EXCLUDED_IDS.has(question.sourceProblemId)));
  }
  assert.equal(banks.EXCLUDED_IDS.size, 19);
});

test("준비된 학년 세션의 unknown canonical ID는 0이다", () => {
  for (const gradeBand of ["G4", "G5", "G6", "M1", "M2", "M3"]) {
    const session = banks.buildGradeTestSession({ selectedGrade: gradeBand, generatedConceptBanks: global.generatedConceptBanks });
    assert.equal(quality.validateSession(session).unknownCanonicalCount, 0, gradeBand);
  }
});

test("script 라우팅은 선택 학년을 읽고 중3 고정 fallback을 만들지 않는다", () => {
  const fs = require("node:fs");
  const script = fs.readFileSync(require("node:path").join(__dirname, "..", "script.js"), "utf8");
  assert.match(script, /const configuredGrade = getConfiguredGradeForRangeDiagnosis\(\)/);
  assert.match(script, /gradeRangeDiagnosisMode = "GRADE_RANGE_DIAGNOSIS"/);
  assert.match(script, /buildGradeTestSession\(\{ selectedGrade/);
  assert.match(script, /TEST_BANK_NOT_READY/);
  assert.doesNotMatch(script, /adaptiveState = createAdaptiveState\("중등 3학년", middle3BasicUnitOrder\)/);
});
