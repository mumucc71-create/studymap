const test = require("node:test");
const assert = require("node:assert/strict");

const diagnosis = require("../elite-diagnosis.js");

function state(subject = "math") {
  return {
    subject,
    currentEliteLevel: "HIGH",
    stableLevel: "NOT_CONFIRMED",
    challengeLevel: "HIGH",
    errorEvidence: [],
    confirmedWeaknesses: [],
    finalizedAttempts: {},
  };
}

function problem(index, overrides = {}) {
  return {
    problemId: `p-${index}`,
    subject: "math",
    domain: "이차함수",
    conceptId: "m3_quadratic_graph",
    eliteLevel: "HIGH",
    structureSignature: `structure-${index}`,
    trapTypes: ["REPRESENTATION_ERROR"],
    reasoningGoals: ["조건을 식으로 바꾼다"],
    ...overrides,
  };
}

function finalAttempt(index, status, domain = `영역-${index}`) {
  return {
    problemId: `a-${index}`,
    evaluationStatus: status,
    eliteLevel: "HIGH",
    domain,
    conceptId: domain,
  };
}

test("같은 오류는 서로 다른 구조 1회 후보·2회 반복·3회 확정으로 누적한다", () => {
  const target = state();
  diagnosis.recordErrorEvidence(target, problem(1), "REPRESENTATION_ERROR");
  assert.equal(target.errorEvidence[0].distinctStructureCount, 1);
  assert.equal(target.confirmedWeaknesses.length, 0);
  diagnosis.recordErrorEvidence(target, problem(2), "REPRESENTATION_ERROR");
  assert.equal(target.errorEvidence[0].distinctStructureCount, 2);
  assert.equal(target.confirmedWeaknesses.length, 0);
  diagnosis.recordErrorEvidence(target, problem(3), "REPRESENTATION_ERROR");
  assert.equal(target.errorEvidence[0].distinctStructureCount, 3);
  assert.equal(target.confirmedWeaknesses.length, 1);
  assert.deepEqual(target.confirmedWeaknesses[0].evidenceProblemIds, ["p-1", "p-2", "p-3"]);
});

test("같은 문제 반복 실패는 서로 다른 증거로 세지 않는다", () => {
  const target = state();
  diagnosis.recordErrorEvidence(target, problem(1), "REPRESENTATION_ERROR");
  diagnosis.recordErrorEvidence(target, problem(1), "REPRESENTATION_ERROR");
  diagnosis.recordErrorEvidence(target, problem(1), "REPRESENTATION_ERROR");
  assert.equal(target.errorEvidence[0].evidenceCount, 1);
  assert.equal(target.errorEvidence[0].distinctStructureCount, 1);
  assert.equal(target.confirmedWeaknesses.length, 0);
});

test("HIGH 통과는 최소 5개·서로 다른 3영역·70% 정확도를 모두 요구한다", () => {
  const target = state();
  target.finalizedAttempts = {
    a1: finalAttempt(1, "CORRECT", "영역A"),
    a2: finalAttempt(2, "CORRECT", "영역B"),
    a3: finalAttempt(3, "CORRECT", "영역C"),
    a4: finalAttempt(4, "CORRECT", "영역D"),
    a5: finalAttempt(5, "INCORRECT", "영역E"),
  };
  assert.equal(diagnosis.canMoveHighToTop(target), true);
  target.finalizedAttempts.a4.domain = "영역A";
  target.finalizedAttempts.a5.domain = "영역A";
  assert.equal(diagnosis.canMoveHighToTop(target), true);
  target.finalizedAttempts.a2.domain = "영역A";
  target.finalizedAttempts.a3.domain = "영역A";
  assert.equal(diagnosis.canMoveHighToTop(target), false);
});

test("반복 핵심 전략 실패가 있으면 정답률만으로 TOP에 오르지 않는다", () => {
  const target = state();
  for (let index = 1; index <= 5; index += 1) {
    target.finalizedAttempts[`a${index}`] = finalAttempt(index, "CORRECT");
  }
  target.errorEvidence = [{
    eliteLevel: "HIGH",
    errorCode: "STRATEGY_FAILURE",
    distinctStructureCount: 2,
  }];
  assert.equal(diagnosis.canMoveHighToTop(target), false);
});

test("stableLevel과 challengeLevel을 분리한다", () => {
  const target = state();
  for (let index = 1; index <= 5; index += 1) {
    target.finalizedAttempts[`h${index}`] = finalAttempt(index, "CORRECT");
  }
  diagnosis.updateLevels(target);
  assert.equal(target.stableLevel, "HIGH");
  target.currentEliteLevel = "TOP";
  diagnosis.updateLevels(target);
  assert.equal(target.stableLevel, "HIGH");
  assert.equal(target.challengeLevel, "TOP");
});

test("수학·영어 결과와 학습·일반 레벨테스트 추천 계약을 만든다", () => {
  const math = state("math");
  math.finalizedAttempts.a1 = finalAttempt(1, "CORRECT", "이차함수");
  diagnosis.recordErrorEvidence(math, problem(1), "REPRESENTATION_ERROR");
  const mathResult = diagnosis.buildResultSummary(math);
  assert.equal(mathResult.subject, "math");
  assert.equal(mathResult.recommendedLearningTargets[0].subject, "math");
  assert.equal(mathResult.recommendedLearningTargets[0].availableLearningRoute, "middle3-quadratic");
  assert.equal(mathResult.recommendedLevelTestStart.recommendedGradeStart, "middle3");

  const english = state("english");
  english.finalizedAttempts.e1 = {
    ...finalAttempt(1, "INCORRECT", "긴 문장"),
    eliteLevel: "HIGH",
  };
  diagnosis.recordErrorEvidence(english, problem(1, {
    subject: "english",
    domain: "긴 문장",
    conceptId: "m3_eng_long_sentence",
  }), "LONG_SENTENCE_PARSING_FAILURE");
  const englishResult = diagnosis.buildResultSummary(english);
  assert.equal(englishResult.recommendedLearningTargets[0].subject, "english");
  assert.equal(englishResult.recommendedLearningTargets[0].availableLearningRoute, null);
});
