"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const model = require("../middle3-statistics-learning-model.js");
const content = require("../middle3-statistics-learning-content.js");

const expectedConcepts = [
  "m3_statistics_mean", "m3_statistics_median_mode", "m3_statistics_representative_range",
  "m3_statistics_frequency_graphs", "m3_statistics_variance", "m3_statistics_standard_deviation",
];
const expectedStages = ["BASIC", "A1", "A2", "A3", "A4", "A5"];
const stripNumbers = (text) => String(text).normalize("NFKC").replace(/[+-]?\d+(?:\.\d+)?/g, "#").replace(/\s+/g, " ").trim();
const countBy = (items, selector) => items.reduce((out, item) => { const key = selector(item); out[key] = (out[key] || 0) + 1; return out; }, {});
const assertUnique = (values, label) => assert.equal(new Set(values).size, values.length, `${label} duplicate`);
const answerWithUnit = (problem) => {
  if (problem.statisticsAnswerContract.validatorMode === "STEP_ORDER") return problem.expectedAnswer;
  if (problem.statisticsAnswerContract.validatorMode === "WRITTEN_REVIEW") return "자료 구조, 통계량 선택, 계산, 단위와 결과 해석을 각각 검증했다.";
  if (problem.statisticsAnswerContract.validatorMode === "FREQUENCY_TABLE") return problem.statisticsData.frequencies;
  if (problem.statisticsAnswerContract.validatorMode === "HISTOGRAM") return problem.statisticsData.histogramBins.map((bin) => bin.frequency);
  const unit = problem.statisticsAnswerContract.unitPolicy === "REQUIRED" ? ` ${problem.statisticsAnswerContract.expectedUnit}` : "";
  return `${problem.expectedAnswer}${unit}`;
};

test("공개 모델 계약과 개념·단계 순서", () => {
  ["problems", "problemsById", "getProblems", "evaluateAnswer", "validateStatisticsData", "evaluateStatisticsAnswer", "normalizeStatisticInput", "normalizeModeSet", "evaluateFrequencyTableAnswer", "evaluateHistogramAnswer", "validateStatisticsStepOrder", "calculateMean", "calculateMedian", "calculateModes", "calculateRange", "calculateDeviations", "calculateVariance", "calculateStandardDeviation"].forEach((key) => assert.ok(model[key], key));
  assert.deepEqual(model.conceptIds, expectedConcepts);
  assert.deepEqual(model.stages, expectedStages);
});

test("총 144문항·개념별 24·단계별 24", () => {
  assert.equal(model.problems.length, 144);
  assert.deepEqual(countBy(model.problems, (p) => p.conceptId), Object.fromEntries(expectedConcepts.map((id) => [id, 24])));
  assert.deepEqual(countBy(model.problems, (p) => p.stage), Object.fromEntries(expectedStages.map((stage) => [stage, 24])));
  expectedConcepts.forEach((conceptId) => expectedStages.forEach((stage) => assert.equal(model.getProblems(conceptId, stage).length, 4)));
});

test("학습 108문항과 혼자 풀기 36문항", () => {
  assert.equal(model.problems.filter((p) => !p.independentCheck).length, 108);
  assert.equal(model.problems.filter((p) => p.independentCheck).length, 36);
  expectedConcepts.forEach((conceptId) => expectedStages.forEach((stage) => {
    const group = model.getProblems(conceptId, stage);
    assert.equal(group.filter((p) => !p.independentCheck).length, 3);
    assert.equal(group.filter((p) => p.independentCheck).length, 1);
  }));
});

test("다섯 답안형과 권장 비객관식 분포", () => {
  assert.deepEqual(countBy(model.problems, (p) => p.answerType), { MULTIPLE_CHOICE: 12, SHORT_ANSWER: 48, EXPRESSION_INPUT: 36, STEP_ORDER: 24, WRITTEN_RESPONSE: 24 });
});

test("필수 문제 필드·힌트·설명·풀이 존재", () => {
  const required = ["id", "problemId", "conceptId", "stage", "answerType", "prompt", "expectedAnswer", "explanation", "hints", "solutionSteps", "misconceptionTags", "difficultyEvidence", "independentCheck", "curriculumVersion", "authoringScope", "structureSignature", "solutionPathSignature", "statisticsData", "statisticsAnswerContract"];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.notEqual(problem[field], undefined, `${problem.problemId}:${field}`));
    assert.ok(problem.explanation.length > 0);
    assert.ok(problem.hints.length >= 2);
    assert.ok(problem.solutionSteps.length >= 2);
    assert.equal(problem.legacyReuse, false);
  });
});

test("ID·prompt·숫자 제거 구조·구조 서명·풀이 서명 중복 0", () => {
  assertUnique(model.problems.map((p) => p.id), "id");
  assertUnique(model.problems.map((p) => p.problemId), "problemId");
  assertUnique(model.problems.map((p) => p.prompt), "prompt");
  assertUnique(model.problems.map((p) => stripNumbers(p.prompt)), "number-stripped prompt");
  assertUnique(model.problems.map((p) => p.structureSignature), "structureSignature");
  assertUnique(model.problems.map((p) => p.solutionPathSignature), "solutionPathSignature");
});

test("statisticsData 필수 계약 전수 검사", () => {
  assert.equal(model.problems.filter((p) => p.statisticsData).length, 144);
  model.problems.forEach((problem) => {
    const result = model.validateStatisticsData(problem.statisticsData);
    assert.equal(result.valid, true, `${problem.problemId}: ${result.errors.join(",")}`);
    assert.equal(Object.hasOwn(problem.statisticsData, "statisticsAnswerContract"), false);
    assert.ok(problem.statisticsAnswerContract);
  });
});

test("자료 정렬·개수·평균·중앙값·범위 독립 재계산", () => {
  model.problems.forEach(({ statisticsData: data }) => {
    assert.deepEqual(Array.from(data.sortedData), Array.from(data.dataSet).sort((a, b) => a - b));
    assert.equal(data.sampleSize, data.dataSet.length);
    assert.ok(Math.abs(model.calculateMean(data.dataSet) - data.mean) <= 1e-9);
    assert.ok(Math.abs(model.calculateMedian(data.dataSet) - data.median) <= 1e-9);
    assert.ok(Math.abs(model.calculateRange(data.dataSet) - data.range) <= 1e-9);
  });
});

test("단일·복수·없음 최빈값과 순서 없는 집합 채점", () => {
  assert.deepEqual(model.normalizeModeSet("4,2"), [2, 4]);
  assert.deepEqual(model.normalizeModeSet("최빈값 없음"), []);
  const multiple = model.problems.find((p) => p.statisticsAnswerContract.validatorMode === "MODE_SET" && p.statisticsData.mode.length === 2);
  assert.equal(model.evaluateAnswer(multiple, Array.from(multiple.statisticsData.mode).reverse().join(",")).correct, true);
  assert.equal(model.evaluateAnswer(multiple, String(multiple.statisticsData.mode[0])).correct, false);
  const none = model.problems.find((p) => p.statisticsAnswerContract.validatorMode === "MODE_SET" && p.statisticsData.mode.length === 0);
  assert.equal(model.evaluateAnswer(none, "없음").correct, true);
});

test("편차 합 0·분산은 n으로 나눔·표준편차 양수", () => {
  model.problems.forEach(({ statisticsData: data }) => {
    assert.ok(Math.abs(data.deviations.reduce((a, b) => a + b, 0)) <= 1e-9);
    const variance = data.squaredDeviations.reduce((a, b) => a + b, 0) / data.sampleSize;
    assert.ok(Math.abs(variance - data.variance) <= 1e-9);
    assert.ok(data.standardDeviation >= 0);
    assert.ok(Math.abs(data.standardDeviation ** 2 - data.variance) <= 1e-8);
    assert.equal(data.varianceConvention, "DIVIDE_BY_N");
  });
});

test("n-1 분산·음수 표준편차·잘못된 값 차단", () => {
  const varianceProblem = model.problems.find((p) => p.conceptId === "m3_statistics_variance" && p.statisticsAnswerContract.validatorMode === "NUMERIC_EQUIVALENCE" && p.statisticsAnswerContract.unitPolicy === "OPTIONAL" && p.expectedAnswer !== 0);
  const data = varianceProblem.statisticsData;
  const nMinusOne = data.squaredDeviations.reduce((a, b) => a + b, 0) / (data.sampleSize - 1);
  assert.equal(model.evaluateAnswer(varianceProblem, nMinusOne).correct, false);
  const sdProblem = model.problems.find((p) => p.conceptId === "m3_statistics_standard_deviation" && p.statisticsAnswerContract.validatorMode === "NUMERIC_EQUIVALENCE" && p.statisticsAnswerContract.unitPolicy === "OPTIONAL");
  assert.equal(model.evaluateAnswer(sdProblem, -Number(sdProblem.expectedAnswer)).correct, false);
});

test("도수 합·상대도수 합·히스토그램 bin 대응", () => {
  model.problems.forEach(({ statisticsData: data }) => {
    assert.equal(data.frequencies.reduce((a, b) => a + b, 0), data.totalFrequency);
    assert.ok(Math.abs(data.relativeFrequencies.reduce((a, b) => a + b, 0) - 1) <= 1e-8);
    assert.deepEqual(data.histogramBins.map((bin) => bin.frequency), Array.from(data.frequencies));
  });
});

test("도수표·히스토그램 정답과 잘못된 막대 차단", () => {
  const table = model.problems.find((p) => p.statisticsAnswerContract.validatorMode === "FREQUENCY_TABLE");
  assert.equal(model.evaluateAnswer(table, table.statisticsData.frequencies).correct, true);
  assert.equal(model.evaluateAnswer(table, Array.from(table.statisticsData.frequencies).reverse()).correct, false);
  const histogram = model.problems.find((p) => p.statisticsAnswerContract.validatorMode === "HISTOGRAM");
  assert.equal(model.evaluateAnswer(histogram, histogram.statisticsData.histogramBins.map((bin) => bin.frequency)).correct, true);
  assert.equal(model.evaluateAnswer(histogram, [99]).correct, false);
});

test("숫자·분수·소수 동치와 허용 오차", () => {
  const problem = model.problems.find((p) => p.statisticsAnswerContract.validatorMode === "NUMERIC_EQUIVALENCE" && p.expectedAnswer === 6);
  assert.equal(model.evaluateAnswer(problem, "6.0").correct, true);
  assert.equal(model.evaluateAnswer(problem, "12/2").correct, true);
});

test("반올림 정책과 표시 정밀도", () => {
  const rounded = model.problems.find((p) => p.statisticsAnswerContract.roundingPolicy === "DECIMAL_PLACES_2" && p.statisticsAnswerContract.validatorMode === "NUMERIC_EQUIVALENCE");
  const suffix = rounded.statisticsAnswerContract.unitPolicy === "REQUIRED" ? ` ${rounded.statisticsAnswerContract.expectedUnit}` : "";
  assert.equal(model.evaluateAnswer(rounded, `${rounded.expectedAnswer}${suffix}`).correct, true);
  assert.equal(model.evaluateAnswer(rounded, `${Number(rounded.expectedAnswer) + 0.02}${suffix}`).correct, false);
});

test("단위 REQUIRED·OPTIONAL·FORBIDDEN 계약", () => {
  const required = model.problems.find((p) => p.statisticsAnswerContract.unitPolicy === "REQUIRED" && p.statisticsAnswerContract.validatorMode === "NUMERIC_EQUIVALENCE");
  assert.equal(model.evaluateAnswer(required, String(required.expectedAnswer)).reason, "UNIT_REQUIRED");
  assert.equal(model.evaluateAnswer(required, `${required.expectedAnswer} ${required.statisticsAnswerContract.expectedUnit}`).correct, true);
  assert.equal(model.evaluateAnswer(required, `${required.expectedAnswer} cm`).reason, "UNIT_MISMATCH");
  const forbidden = model.problems.find((p) => p.statisticsAnswerContract.unitPolicy === "FORBIDDEN");
  assert.equal(model.evaluateAnswer(forbidden, `${forbidden.expectedAnswer}%`).reason, "UNIT_FORBIDDEN");
  assert.equal(model.evaluateAnswer(forbidden, String(forbidden.expectedAnswer)).correct, true);
});

test("객관식 정답 유일성과 선택지 중복 0", () => {
  model.problems.filter((p) => p.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    assert.equal(new Set(problem.choices).size, problem.choices.length, problem.problemId);
    const correct = problem.choices.filter((choice) => model.evaluateAnswer(problem, choice).correct === true);
    assert.equal(correct.length, 1, problem.problemId);
  });
});

test("과정형 실제 순서·누락·역순 검증", () => {
  model.problems.filter((p) => p.answerType === "STEP_ORDER").forEach((problem) => {
    assert.equal(model.evaluateAnswer(problem, problem.expectedAnswer).correct, true, problem.problemId);
    assert.equal(model.evaluateAnswer(problem, Array.from(problem.expectedAnswer).reverse()).correct, false, problem.problemId);
    assert.equal(model.evaluateAnswer(problem, problem.expectedAnswer.slice(1)).correct, false, problem.problemId);
  });
});

test("서술형 REVIEW_REQUIRED·rubric 3개 이상", () => {
  model.problems.filter((p) => p.answerType === "WRITTEN_RESPONSE").forEach((problem) => {
    assert.equal(problem.writtenRubric.reviewStatus, "REVIEW_REQUIRED");
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3);
    assert.ok(problem.writtenRubric.minimumRequiredIdeas >= 3);
    assert.equal(model.evaluateAnswer(problem, "조건, 계산, 검산과 해석을 제시한다.").status, "REVIEW_REQUIRED");
  });
});

test("혼자 풀기 힌트·풀이 잠금과 전략 서명 독립", () => {
  model.problems.filter((p) => p.independentCheck).forEach((problem) => {
    assert.equal(problem.independentCheckPolicy.hintsLockedBeforeFinal, true);
    assert.equal(problem.independentCheckPolicy.solutionLockedBeforeFinal, true);
    const peers = model.problems.filter((p) => p.conceptId === problem.conceptId && p.stage === problem.stage && !p.independentCheck);
    assert.ok(peers.every((peer) => peer.structureSignature !== problem.structureSignature && peer.solutionPathSignature !== problem.solutionPathSignature));
  });
});

test("A3~A5 연결 조건·추론 단계·전략 선택 기준", () => {
  model.problems.filter((p) => ["A3", "A4", "A5"].includes(p.stage)).forEach((problem) => {
    assert.ok(problem.linkedConditionCount >= (problem.stage === "A3" ? 2 : problem.stage === "A4" ? 3 : 4));
    assert.ok(problem.minimumReasoningStepCount >= 3);
    assert.equal(problem.requiresStrategySelection, true);
    if (problem.stage === "A5") assert.equal(problem.requiresExplanation, true);
  });
  const keywordGroups = {
    A3: [/보존|복원|추가|변화/, /검산|비교|확인/],
    A4: [/수정안|변환|원안/, /판별|분류|선택|고른/],
    A5: [/주장을 감사/, /반례/, /필요충분조건|필요조건|수정 조건|검증|검산/],
  };
  model.problems.filter((p) => ["A3", "A4", "A5"].includes(p.stage)).forEach((problem) => {
    keywordGroups[problem.stage].forEach((pattern) => assert.match(problem.prompt, pattern, `${problem.problemId}:${pattern}`));
  });
});

test("2015 개정 범위와 금지 주제 0", () => {
  const forbidden = /확률분포|정규분포|상관계수|회귀분석|표본평균의 분포|추정|검정|미적분/;
  model.problems.forEach((problem) => {
    assert.equal(problem.curriculumVersion, "2015_REVISED_MIDDLE_SCHOOL_MATH");
    assert.equal(forbidden.test(`${problem.prompt} ${problem.explanation}`), false, problem.problemId);
  });
});

test("개념 설명 6개·단계별 수업 36개", () => {
  assert.equal(content.concepts.length, 6);
  assert.equal(content.lessons.length, 36);
  expectedConcepts.forEach((conceptId) => expectedStages.forEach((stage) => {
    const lesson = content.getLesson(conceptId, stage);
    assert.ok(lesson);
    ["coreConcept", "easyExample", "commonMistakes", "procedure", "verification", "thinkingMethod", "conditionFocus", "strategy", "validation"].forEach((field) => assert.ok(lesson[field], `${conceptId}:${stage}:${field}`));
  }));
});

test("모든 자동 채점 문항의 모델 정답 수용", () => {
  model.problems.forEach((problem) => {
    const result = model.evaluateAnswer(problem, answerWithUnit(problem));
    if (problem.answerType === "WRITTEN_RESPONSE") assert.equal(result.status, "REVIEW_REQUIRED", problem.problemId);
    else assert.equal(result.correct, true, `${problem.problemId}: ${JSON.stringify(result)}`);
  });
});

test("감사 집계가 원본 배열과 일치", () => {
  const audit = model.audit();
  assert.equal(audit.problemCount, 144);
  assert.equal(audit.statisticsDataCount, 144);
  assert.equal(audit.learningCount, 108);
  assert.equal(audit.independentCount, 36);
  assert.equal(audit.hintCount, 288);
});
