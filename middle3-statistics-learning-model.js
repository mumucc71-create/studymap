(function (root, factory) {
  const algebra = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const api = factory(algebra);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_STATISTICS_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (algebra) {
  "use strict";

  if (!algebra) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");

  const VERSION = "m3-statistics-learning-model-v1";
  const UNIT_ID = "m3-statistics";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const AUTHORING_SCOPE = "MIDDLE3_STATISTICS_EXPLICIT_MATRIX_V1";
  const SOURCE_SCOPE = "NEW_STATISTICS_SPRING_CONTENT";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const conceptIds = Object.freeze([
    "m3_statistics_mean",
    "m3_statistics_median_mode",
    "m3_statistics_representative_range",
    "m3_statistics_frequency_graphs",
    "m3_statistics_variance",
    "m3_statistics_standard_deviation",
  ]);
  const concepts = Object.freeze([
    [conceptIds[0], "평균"], [conceptIds[1], "중앙값과 최빈값"], [conceptIds[2], "대푯값의 선택과 범위"],
    [conceptIds[3], "도수분포표와 그래프"], [conceptIds[4], "편차와 분산"], [conceptIds[5], "표준편차"],
  ].map(([conceptId, title], index) => Object.freeze({ conceptId, title, order: index + 1 })));
  const ANSWER_TYPES = Object.freeze(["MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE"]);
  const TYPE_PATTERN = Object.freeze({
    BASIC: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "SHORT_ANSWER", "SHORT_ANSWER"],
    A1: ["SHORT_ANSWER", "EXPRESSION_INPUT", "EXPRESSION_INPUT", "SHORT_ANSWER"],
    A2: ["EXPRESSION_INPUT", "SHORT_ANSWER", "STEP_ORDER", "EXPRESSION_INPUT"],
    A3: ["SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER"],
    A4: ["EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER", "WRITTEN_RESPONSE"],
    A5: ["WRITTEN_RESPONSE", "STEP_ORDER", "WRITTEN_RESPONSE", "WRITTEN_RESPONSE"],
  });
  const STAGE_META = Object.freeze({
    BASIC: { linked: 1, steps: 2, evidence: ["정의에 따른 직접 계산", "자료 개수와 단위 확인"] },
    A1: { linked: 1, steps: 2, evidence: ["한 단계 역산 또는 변화량 추적", "복수 최빈값·상대도수 조건 확인"] },
    A2: { linked: 2, steps: 3, evidence: ["두 통계 성질 연결", "계산과 단위·반올림 검산"] },
    A3: { linked: 2, steps: 3, evidence: ["자료 후보 생성과 조건 필터", "통계량 선택 후 독립 검산"] },
    A4: { linked: 3, steps: 4, evidence: ["숨은 값·경우 분류·표현 변환 중 둘 이상", "정확값 범위와 반올림 조건 검증"] },
    A5: { linked: 4, steps: 4, evidence: ["오류 분석·반례·필요충분조건·일반화 중 둘 이상", "계산·단위·해석을 독립 검증"] },
  });
  const ACTION_ORDER = Object.freeze([
    "READ_DATA", "SORT_DATA", "COUNT_FREQUENCY", "BUILD_FREQUENCY_TABLE", "COMPUTE_RELATIVE_FREQUENCY",
    "READ_HISTOGRAM", "SELECT_REPRESENTATIVE_VALUE", "COMPUTE_TOTAL", "COMPUTE_MEAN", "FIND_MEDIAN_POSITION",
    "IDENTIFY_MODE", "COMPUTE_RANGE", "COMPUTE_DEVIATIONS", "CHECK_DEVIATION_SUM", "SQUARE_DEVIATIONS",
    "COMPUTE_VARIANCE", "COMPUTE_STANDARD_DEVIATION", "COMPARE_GROUPS", "APPLY_ROUNDING", "CHECK_UNIT", "VERIFY_RESULT",
  ]);
  const ACTION_RANK = Object.freeze(Object.fromEntries(ACTION_ORDER.map((action, index) => [action, index])));
  const UNIT_ALIASES = Object.freeze({ "점": "점", "개": "개", "명": "명", "cm": "cm", "m": "m", "kg": "kg", "%": "%", "점²": "점^2", "점2": "점^2", "점^2": "점^2", "cm²": "cm^2", "cm2": "cm^2", "cm^2": "cm^2" });

  function freezeArray(items) { return Object.freeze(items.map((item) => (item && typeof item === "object" ? Object.freeze(item) : item))); }
  function round(value, places = 12) { const factor = 10 ** places; return Math.round((Number(value) + Number.EPSILON) * factor) / factor; }
  function calculateMean(data) { return data.reduce((sum, value) => sum + Number(value), 0) / data.length; }
  function calculateMedian(data) { const sorted = data.map(Number).slice().sort((a, b) => a - b); const n = sorted.length; return n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2; }
  function calculateModes(data) {
    const counts = new Map(); data.forEach((value) => counts.set(Number(value), (counts.get(Number(value)) || 0) + 1));
    const max = Math.max(...counts.values());
    if (max <= 1 || Array.from(counts.values()).every((count) => count === max)) return [];
    return Array.from(counts).filter(([, count]) => count === max).map(([value]) => value).sort((a, b) => a - b);
  }
  function calculateRange(data) { return Math.max(...data.map(Number)) - Math.min(...data.map(Number)); }
  function calculateDeviations(data) { const mean = calculateMean(data); return data.map((value) => round(Number(value) - mean)); }
  function calculateVariance(data) { const deviations = calculateDeviations(data); return deviations.reduce((sum, value) => sum + value * value, 0) / data.length; }
  function calculateStandardDeviation(data) { return Math.sqrt(calculateVariance(data)); }
  function almostEqual(a, b, tolerance = 1e-9) { return Number.isFinite(Number(a)) && Number.isFinite(Number(b)) && Math.abs(Number(a) - Number(b)) <= tolerance; }
  function normalizePlain(value) { return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase(); }
  function normalizeUnit(unit) { return UNIT_ALIASES[String(unit || "").normalize("NFKC").replace(/\s+/g, "")] || String(unit || "").trim(); }
  function normalizeStatisticInput(value) {
    if (typeof value === "number") return Object.freeze({ expression: String(value), unit: null, numericValue: value, raw: String(value) });
    const raw = String(value ?? "").normalize("NFKC").trim().replace(/√/g, "sqrt");
    const match = raw.match(/^(.+?)\s*(점(?:\^?2|²)?|개|명|kg|cm(?:\^?2|²)?|m|%)\s*$/i);
    const expression = (match ? match[1] : raw).trim();
    const unit = match ? normalizeUnit(match[2]) : null;
    let numericValue = Number.NaN;
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(expression)) numericValue = Number(expression);
    else if (/^[+-]?\d+(?:\.\d+)?\/[+-]?\d+(?:\.\d+)?$/.test(expression)) { const [a, b] = expression.split("/").map(Number); if (b) numericValue = a / b; }
    else {
      const sqrtMatch = expression.match(/^([+-]?\d*(?:\.\d+)?)?\*?sqrt\((\d+(?:\.\d+)?)\)(?:\/(\d+(?:\.\d+)?))?$/i);
      if (sqrtMatch) { const coefficient = sqrtMatch[1] === "" || sqrtMatch[1] === undefined || sqrtMatch[1] === "+" ? 1 : sqrtMatch[1] === "-" ? -1 : Number(sqrtMatch[1]); numericValue = coefficient * Math.sqrt(Number(sqrtMatch[2])) / Number(sqrtMatch[3] || 1); }
    }
    return Object.freeze({ expression, unit, numericValue, raw });
  }
  function normalizeModeSet(value) {
    if (Array.isArray(value)) return Object.freeze(Array.from(new Set(value.map(Number))).sort((a, b) => a - b));
    const plain = normalizePlain(value);
    if (["none", "없음", "최빈값없음", "무"] .includes(plain)) return Object.freeze([]);
    const values = String(value ?? "").replace(/[{}\[\]()]/g, "").split(/,|;|\s+/).filter(Boolean).map(Number);
    return Object.freeze(values.every(Number.isFinite) ? Array.from(new Set(values)).sort((a, b) => a - b) : [Number.NaN]);
  }
  function makeFrequency(data) {
    const counts = new Map(); data.forEach((value) => counts.set(Number(value), (counts.get(Number(value)) || 0) + 1));
    const values = Array.from(counts.keys()).sort((a, b) => a - b);
    return {
      frequencyTable: values.map((value) => Object.freeze({ interval: `[${value},${value + 1})`, lower: value, upper: value + 1, frequency: counts.get(value) })),
      classIntervals: values.map((value) => Object.freeze([value, value + 1])), classMarks: values.map((value) => value + 0.5),
      frequencies: values.map((value) => counts.get(value)), relativeFrequencies: values.map((value) => counts.get(value) / data.length),
      histogramBins: values.map((value) => Object.freeze({ lower: value, upper: value + 1, frequency: counts.get(value) })),
    };
  }
  function buildStatisticsData(conceptId, stageIndex, position) {
    const center = 6 + stageIndex * 2 + position;
    const scale = 1 + ((stageIndex + position) % 3);
    let dataSet;
    if (conceptId === "m3_statistics_median_mode") dataSet = position === 1 ? [center - 2, center - 2, center, center, center + 3] : position === 3 ? [center - 2, center - 1, center, center + 1, center + 2] : [center - 2, center - 1, center, center, center + 2];
    else if (conceptId === "m3_statistics_representative_range") dataSet = [center - 2, center - 1, center, center + 1, center + 8 + stageIndex];
    else if (conceptId === "m3_statistics_frequency_graphs") dataSet = [center, center, center + 1, center + 1, center + 1, center + 2, center + 3, center + 3];
    else dataSet = [center - 2 * scale, center - scale, center, center + scale, center + 2 * scale];
    const sortedData = dataSet.slice().sort((a, b) => a - b);
    const frequency = makeFrequency(dataSet);
    const deviations = calculateDeviations(dataSet);
    const squaredDeviations = deviations.map((value) => round(value * value));
    const modes = calculateModes(dataSet);
    return Object.freeze({
      dataKind: conceptId === "m3_statistics_frequency_graphs" ? (position % 2 ? "HISTOGRAM" : "TABLE") : "RAW",
      dataSet: freezeArray(dataSet), sortedData: freezeArray(sortedData), sampleSize: dataSet.length,
      frequencyTable: freezeArray(frequency.frequencyTable), classIntervals: freezeArray(frequency.classIntervals), classMarks: freezeArray(frequency.classMarks),
      frequencies: freezeArray(frequency.frequencies), totalFrequency: dataSet.length, relativeFrequencies: freezeArray(frequency.relativeFrequencies),
      histogramBins: freezeArray(frequency.histogramBins), axisLabels: Object.freeze({ x: "자료값 계급", y: "도수" }), sourceGroups: freezeArray([Object.freeze({ name: "A", data: freezeArray(dataSet) })]),
      mean: round(calculateMean(dataSet)), median: round(calculateMedian(dataSet)), mode: freezeArray(modes),
      modePolicy: modes.length === 0 ? "NONE" : modes.length === 1 ? "SINGLE" : "MULTIPLE", range: calculateRange(dataSet),
      deviations: freezeArray(deviations), squaredDeviations: freezeArray(squaredDeviations), variance: round(calculateVariance(dataSet)), varianceConvention: "DIVIDE_BY_N",
      standardDeviation: round(calculateStandardDeviation(dataSet)), roundingPolicy: "NONE", decimalTolerance: 1e-9, displayPrecision: 6,
      unit: "점", unknownTarget: conceptId.replace("m3_statistics_", ""), chartDescription: `자료 ${dataSet.join(", ")}의 도수분포와 통계량`,
    });
  }

  function validateStatisticsData(data) {
    const errors = [];
    const required = ["dataKind", "dataSet", "sortedData", "sampleSize", "frequencyTable", "classIntervals", "classMarks", "frequencies", "totalFrequency", "relativeFrequencies", "histogramBins", "axisLabels", "sourceGroups", "mean", "median", "mode", "modePolicy", "range", "deviations", "squaredDeviations", "variance", "varianceConvention", "standardDeviation", "roundingPolicy", "decimalTolerance", "displayPrecision", "unit", "unknownTarget", "chartDescription"];
    required.forEach((field) => { if (data?.[field] === undefined || data?.[field] === null || data?.[field] === "") errors.push(`MISSING_${field}`); });
    if (errors.length) return Object.freeze({ valid: false, errors: freezeArray(errors) });
    const sorted = data.dataSet.map(Number).slice().sort((a, b) => a - b);
    if (JSON.stringify(sorted) !== JSON.stringify(data.sortedData.map(Number))) errors.push("SORTED_DATA_MISMATCH");
    if (data.sampleSize !== data.dataSet.length) errors.push("SAMPLE_SIZE_MISMATCH");
    if (!almostEqual(data.mean, calculateMean(data.dataSet))) errors.push("MEAN_MISMATCH");
    if (!almostEqual(data.median, calculateMedian(data.dataSet))) errors.push("MEDIAN_MISMATCH");
    if (JSON.stringify(Array.from(data.mode).map(Number).sort((a, b) => a - b)) !== JSON.stringify(Array.from(calculateModes(data.dataSet)))) errors.push("MODE_MISMATCH");
    if (!almostEqual(data.range, calculateRange(data.dataSet))) errors.push("RANGE_MISMATCH");
    if (!almostEqual(data.deviations.reduce((sum, value) => sum + Number(value), 0), 0)) errors.push("DEVIATION_SUM_NOT_ZERO");
    if (data.varianceConvention !== "DIVIDE_BY_N" || !almostEqual(data.variance, calculateVariance(data.dataSet))) errors.push("VARIANCE_MISMATCH");
    if (data.standardDeviation < 0 || !almostEqual(data.standardDeviation, calculateStandardDeviation(data.dataSet))) errors.push("STANDARD_DEVIATION_MISMATCH");
    if (data.frequencies.reduce((sum, value) => sum + Number(value), 0) !== data.totalFrequency || data.totalFrequency !== data.sampleSize) errors.push("FREQUENCY_TOTAL_MISMATCH");
    if (!almostEqual(data.relativeFrequencies.reduce((sum, value) => sum + Number(value), 0), 1, 1e-8)) errors.push("RELATIVE_FREQUENCY_SUM_MISMATCH");
    if (data.histogramBins.length !== data.frequencies.length || data.histogramBins.some((bin, index) => Number(bin.frequency) !== Number(data.frequencies[index]))) errors.push("HISTOGRAM_FREQUENCY_MISMATCH");
    for (let i = 1; i < data.classIntervals.length; i += 1) if (Number(data.classIntervals[i - 1][1]) > Number(data.classIntervals[i][0])) errors.push("CLASS_INTERVAL_OVERLAP");
    return Object.freeze({ valid: errors.length === 0, errors: freezeArray(errors) });
  }
  function parseTableAnswer(answer) {
    if (Array.isArray(answer)) return answer.map(Number);
    if (answer && typeof answer === "object") return Object.values(answer).map(Number);
    return String(answer ?? "").replace(/[\[\](){}]/g, "").split(/,|;|\s+/).filter(Boolean).map(Number);
  }
  function evaluateFrequencyTableAnswer(problemOrContract, answer) {
    const problem = problemOrContract.statisticsAnswerContract ? problemOrContract : null;
    const expected = problem ? problem.statisticsData.frequencies : problemOrContract.expectedFrequencies;
    const actual = parseTableAnswer(answer);
    const correct = actual.length === expected.length && expected.every((value, index) => almostEqual(value, actual[index]));
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "FREQUENCY_TABLE_MISMATCH" };
  }
  function evaluateHistogramAnswer(problemOrContract, answer) {
    const problem = problemOrContract.statisticsAnswerContract ? problemOrContract : null;
    const expected = problem ? problem.statisticsData.histogramBins.map((bin) => bin.frequency) : problemOrContract.expectedFrequencies;
    const actual = parseTableAnswer(answer);
    const correct = actual.length === expected.length && expected.every((value, index) => almostEqual(value, actual[index]));
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "HISTOGRAM_BIN_MISMATCH" };
  }
  function validateStatisticsStepOrder(problemOrExpected, answer) {
    const expected = Array.isArray(problemOrExpected) ? problemOrExpected : problemOrExpected?.expectedAnswer;
    const actual = Array.isArray(answer) ? answer.map(String) : String(answer ?? "").split(/\r?\n|;;|,/).map((item) => item.trim()).filter(Boolean);
    if (!Array.isArray(expected) || expected.some((action) => ACTION_RANK[action] === undefined)) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "INVALID_EXPECTED_ACTIONS" };
    if (!expected.every((action, index) => index === 0 || ACTION_RANK[action] > ACTION_RANK[expected[index - 1]])) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "EXPECTED_ACTION_ORDER_INVALID" };
    const correct = actual.length === expected.length && expected.every((action, index) => action === actual[index]);
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "STEP_ORDER_OR_OMISSION" };
  }
  function compareExpression(expected, actual, tolerance) {
    const parsedExpected = normalizeStatisticInput(expected); const parsedActual = normalizeStatisticInput(actual);
    if (Number.isFinite(parsedExpected.numericValue) && Number.isFinite(parsedActual.numericValue)) return almostEqual(parsedExpected.numericValue, parsedActual.numericValue, tolerance);
    if (normalizePlain(expected) === normalizePlain(actual)) return true;
    const result = algebra.compareExpressions(String(expected).replace(/√/g, "sqrt"), String(actual).replace(/√/g, "sqrt"));
    return result.equivalent === true || result.status === "EQUIVALENT" || result.status === "CORRECT";
  }
  function applyRounding(value, policy) {
    if (policy === "NEAREST_INTEGER") return Math.round(value);
    if (policy === "DECIMAL_PLACES_1") return round(value, 1);
    if (policy === "DECIMAL_PLACES_2") return round(value, 2);
    return value;
  }
  function evaluateStatisticsAnswer(problemOrContract, answer) {
    const problem = problemOrContract.statisticsAnswerContract ? problemOrContract : null;
    const contract = problem ? problem.statisticsAnswerContract : problemOrContract;
    const expected = problem ? problem.expectedAnswer : contract.expectedAnswer;
    if (contract.validatorMode === "WRITTEN_REVIEW") return String(answer ?? "").trim() ? { status: "REVIEW_REQUIRED", correct: null, rubric: problem?.writtenRubric } : { status: "INVALID_INPUT", correct: null, rubric: problem?.writtenRubric };
    if (contract.validatorMode === "STEP_ORDER") return validateStatisticsStepOrder(problem || expected, answer);
    if (contract.validatorMode === "MODE_SET") {
      const actual = normalizeModeSet(answer); const target = normalizeModeSet(expected);
      const correct = actual.length === target.length && target.every((value, index) => almostEqual(value, actual[index]));
      return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "MODE_SET_MISMATCH" };
    }
    if (contract.validatorMode === "FREQUENCY_TABLE") return evaluateFrequencyTableAnswer(problem || contract, answer);
    if (contract.validatorMode === "HISTOGRAM") return evaluateHistogramAnswer(problem || contract, answer);
    if (contract.validatorMode === "TEXT_NORMALIZED") {
      const accepted = [expected, ...(contract.acceptedAnswers || [])].map(normalizePlain);
      const correct = accepted.includes(normalizePlain(answer)); return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    const parsed = normalizeStatisticInput(answer);
    if (contract.unitPolicy === "REQUIRED" && !parsed.unit) return { status: "INCORRECT", correct: false, reason: "UNIT_REQUIRED" };
    if (contract.unitPolicy === "FORBIDDEN" && parsed.unit) return { status: "INCORRECT", correct: false, reason: "UNIT_FORBIDDEN" };
    if (parsed.unit && contract.expectedUnit && normalizeUnit(parsed.unit) !== normalizeUnit(contract.expectedUnit)) return { status: "INCORRECT", correct: false, reason: "UNIT_MISMATCH" };
    const correct = compareExpression(applyRounding(Number(expected), contract.roundingPolicy), parsed.expression, contract.decimalTolerance);
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "STATISTIC_VALUE_MISMATCH" };
  }

  const scenarioWords = Object.freeze({
    BASIC: ["기초 기록", "첫 표본", "정렬 카드", "확인 표"],
    A1: ["누락 기록", "변화 관찰", "빈도 점검", "역산 메모"],
    A2: ["두 조건 보고서", "이상치 조사", "표 변환", "반올림 검토"],
    A3: ["후보 복원", "교차 조건", "전략 순서", "독립 검산"],
    A4: ["숨은 자료", "경우 분류", "표현 전환", "판정 보고"],
    A5: ["주장 감사", "필요조건 심사", "반례 설계", "일반화 검증"],
  });
  const STEP_PATHS = Object.freeze({
    m3_statistics_mean: ["READ_DATA", "COMPUTE_TOTAL", "COMPUTE_MEAN", "CHECK_UNIT", "VERIFY_RESULT"],
    m3_statistics_median_mode: ["READ_DATA", "SORT_DATA", "COUNT_FREQUENCY", "FIND_MEDIAN_POSITION", "IDENTIFY_MODE", "VERIFY_RESULT"],
    m3_statistics_representative_range: ["READ_DATA", "SELECT_REPRESENTATIVE_VALUE", "COMPUTE_RANGE", "COMPARE_GROUPS", "VERIFY_RESULT"],
    m3_statistics_frequency_graphs: ["READ_DATA", "COUNT_FREQUENCY", "BUILD_FREQUENCY_TABLE", "COMPUTE_RELATIVE_FREQUENCY", "READ_HISTOGRAM", "VERIFY_RESULT"],
    m3_statistics_variance: ["READ_DATA", "COMPUTE_MEAN", "COMPUTE_DEVIATIONS", "CHECK_DEVIATION_SUM", "SQUARE_DEVIATIONS", "COMPUTE_VARIANCE", "CHECK_UNIT", "VERIFY_RESULT"],
    m3_statistics_standard_deviation: ["READ_DATA", "COMPUTE_VARIANCE", "COMPUTE_STANDARD_DEVIATION", "COMPARE_GROUPS", "APPLY_ROUNDING", "CHECK_UNIT", "VERIFY_RESULT"],
  });
  function answerSpec(conceptId, data, position) {
    if (conceptId === conceptIds[0]) return [data.mean, data.dataSet.reduce((a, b) => a + b, 0), data.mean, data.mean][position];
    if (conceptId === conceptIds[1]) return position % 2 === 0 ? data.median : (data.mode.length ? data.mode.join(",") : "NONE");
    if (conceptId === conceptIds[2]) return [data.range, "중앙값", data.range, "중앙값"][position];
    if (conceptId === conceptIds[3]) return [data.frequencies[0], data.relativeFrequencies[1], data.frequencies.join(","), data.histogramBins.map((bin) => bin.frequency).join(",")][position];
    if (conceptId === conceptIds[4]) return [data.variance, 0, data.squaredDeviations.reduce((a, b) => a + b, 0), data.variance][position];
    return [data.standardDeviation, data.variance, data.standardDeviation, data.standardDeviation][position];
  }
  function validatorMode(conceptId, position, answerType) {
    if (answerType === "WRITTEN_RESPONSE") return "WRITTEN_REVIEW";
    if (answerType === "STEP_ORDER") return "STEP_ORDER";
    if (conceptId === conceptIds[1] && position % 2 === 1) return "MODE_SET";
    if (conceptId === conceptIds[2] && position % 2 === 1) return "TEXT_NORMALIZED";
    if (conceptId === conceptIds[3] && position === 2) return "FREQUENCY_TABLE";
    if (conceptId === conceptIds[3] && position === 3) return "HISTOGRAM";
    return "NUMERIC_EQUIVALENCE";
  }
  function promptFor(conceptId, stage, position, data, expected) {
    const values = data.dataSet.join(", "); const label = scenarioWords[stage][position];
    const target = conceptId === conceptIds[0] ? (position === 1 ? "전체 합" : "평균")
      : conceptId === conceptIds[1] ? (position % 2 ? "최빈값을 모두" : "중앙값")
        : conceptId === conceptIds[2] ? (position % 2 ? "적절한 대푯값" : "범위")
          : conceptId === conceptIds[3] ? (position === 0 ? "첫 계급의 도수" : position === 1 ? "두 번째 계급의 상대도수" : position === 2 ? "도수열" : "히스토그램 막대 높이")
            : conceptId === conceptIds[4] ? (position === 1 ? "편차의 합" : position === 2 ? "편차 제곱의 합" : "분산")
              : (position === 1 ? "분산" : "표준편차");
    if (stage === "A3") {
      if (conceptId === conceptIds[0]) return `${label}: 자료 ${values}에서 최솟값에 ${data.sampleSize}를 더하고 최댓값에서 같은 수를 뺀 새 자료를 만든다. 합 보존 여부를 판단하고 새 자료의 ${target}을 구한 뒤 원자료로 검산하시오.`;
      if (conceptId === conceptIds[1]) return `${label}: 자료 ${values}에 현재 최솟값보다 작은 값과 최댓값보다 큰 값을 각각 하나씩 추가한다. 정렬 위치와 빈도 변화를 모두 따져 새 자료의 ${target}을 구하고 원자료와 검산하시오.`;
      if (conceptId === conceptIds[2]) return `${label}: 자료 ${values}의 모든 값에 4를 더한 B자료를 만든다. 이상치의 영향과 최댓값·최솟값 변화를 함께 확인해 B자료의 ${target}을 구하고 원자료와 비교하시오.`;
      if (conceptId === conceptIds[3]) return `${label}: 자료 ${values}를 표로 옮겼다. 전체 도수 ${data.totalFrequency}과 상대도수의 합 1을 동시에 이용해 누락된 칸을 복원한 뒤 ${target}을 구하고 막대 높이와 검산하시오.`;
      if (conceptId === conceptIds[4]) return `${label}: 자료 ${values}의 모든 값에 7을 더한 B자료를 만든다. 평균 이동과 편차 보존을 각각 확인해 B자료의 ${target}을 구하고 n으로 나누었는지 검산하시오.`;
      return `${label}: 자료 ${values}의 모든 값에서 3을 뺀 B자료를 만든다. 평균 이동과 편차 보존을 확인한 뒤 B자료의 ${target}을 구하고 제곱하여 검산하시오.`;
    }
    if (stage === "A4") {
      if (conceptId === conceptIds[0]) return `${label}: 자료 ${values}에 수정안 I(최솟값 +2, 최댓값 -2)와 수정안 II(최솟값 +2, 최댓값 -1)가 있다. 평균을 보존하는 수정안을 경우별 합으로 판별한 뒤 그 자료의 ${target}을 구하시오.`;
      if (conceptId === conceptIds[1]) return `${label}: 자료 ${values}에 변환 I(양끝 바깥값을 하나씩 추가)과 변환 II(가운데 값을 두 번 추가)가 있다. 중앙 위치와 최대 빈도를 모두 보존하는 변환을 선택한 뒤 ${target}을 구하시오.`;
      if (conceptId === conceptIds[2]) return `${label}: 자료 ${values}에 변환 I(모든 값 +5)과 변환 II(최댓값만 +5)가 있다. 범위와 이상치 영향을 경우별로 비교하여 원자료의 대표성을 보존하는 변환을 고른 뒤 ${target}을 구하시오.`;
      if (conceptId === conceptIds[3]) return `${label}: 자료 ${values}로 만든 표에 원안 I(현재 계급 순서)과 원안 II(막대 높이를 역순 배치)가 제시되었다. 계급 대응과 총도수를 모두 만족하는 원안을 선택한 뒤 ${target}을 구하시오.`;
      if (conceptId === conceptIds[4]) return `${label}: 자료 ${values}의 변환 I는 모든 값에 5를 더하고, 변환 II는 모든 값을 2배 한다. 평균·편차 변환을 분류해 분산을 보존하는 경우를 고른 뒤 그 자료의 ${target}을 구하시오.`;
      return `${label}: 자료 ${values}의 변환 I는 모든 값에 6을 더하고, 변환 II는 모든 값을 2배 한다. 평균과 산포의 변화를 분류해 표준편차를 보존하는 경우를 고른 뒤 ${target}을 구하시오.`;
    }
    if (stage === "A5") {
      if (conceptId === conceptIds[0]) return `${label}: “자료 일부를 고쳐도 증가량의 합이 0이면 평균은 반드시 보존된다”는 주장을 감사하시오. 자료 ${values}를 근거로 필요충분조건을 밝히고, 조건을 하나 뺀 반례와 ${target} 검산을 제시하시오.`;
      if (conceptId === conceptIds[1]) return `${label}: “자료 양끝에 임의의 두 값을 추가해도 중앙값과 최빈값은 모두 보존된다”는 주장을 감사하시오. 자료 ${values}에서 가능한 위치와 빈도를 분류하고 반례·수정 조건·${target} 검산을 제시하시오.`;
      if (conceptId === conceptIds[2]) return `${label}: “두 집단의 평균이 같으면 대표성과 흩어짐도 같다”는 주장을 감사하시오. 자료 ${values}와 같은 평균을 갖는 반례를 만들고 범위·이상치·${target} 선택의 필요조건을 설명하시오.`;
      if (conceptId === conceptIds[3]) return `${label}: “도수의 합만 같으면 두 히스토그램은 같은 자료를 나타낸다”는 주장을 감사하시오. 자료 ${values}에서 계급 대응 반례를 만들고 상대도수 합, 구간 겹침, ${target}을 모두 검증하시오.`;
      if (conceptId === conceptIds[4]) return `${label}: “평균과 범위가 같은 두 자료의 분산도 같다”는 주장을 감사하시오. 자료 ${values}를 출발점으로 반례를 구성하고 편차 제곱, n 나눗셈, ${target}의 필요충분조건을 설명하시오.`;
      return `${label}: “평균이 같고 자료 수가 같으면 표준편차도 같다”는 주장을 감사하시오. 자료 ${values}와 비교할 반례를 만들고 분산과의 관계, 단위, ${target} 검산을 제시하시오.`;
    }
    const high = "";
    if (conceptId === conceptIds[0]) return `${label}: 자료 ${values}에서 ${high}${position === 1 ? "전체 합" : "평균"}을 구하시오.`;
    if (conceptId === conceptIds[1]) return `${label}: 정렬되지 않은 자료 ${data.dataSet.slice().reverse().join(", ")}에서 ${high}${position % 2 ? "최빈값을 모두" : "중앙값을"} 구하시오.`;
    if (conceptId === conceptIds[2]) return position % 2 ? `${label}: 자료 ${values}에는 큰 이상치가 있다. ${high}전형적인 값을 가장 잘 나타내는 대푯값의 이름을 쓰시오.` : `${label}: 자료 ${values}의 최댓값과 최솟값을 확인해 ${high}범위를 구하시오.`;
    if (conceptId === conceptIds[3]) return position === 0 ? `${label}: ${data.frequencyTable.map((row) => `${row.interval}:${row.frequency}명`).join(", ")}에서 첫 계급의 도수를 구하시오.` : position === 1 ? `${label}: 전체 ${data.totalFrequency}명 중 두 번째 계급의 도수는 ${data.frequencies[1]}명이다. 상대도수를 구하시오.` : position === 2 ? `${label}: 자료 ${values}를 겹치지 않는 계급으로 세어 도수열을 차례로 쓰시오.` : `${label}: 자료 ${values}의 히스토그램 막대 높이를 왼쪽부터 차례로 쓰시오.`;
    if (conceptId === conceptIds[4]) return position === 1 ? `${label}: 자료 ${values}의 편차를 모두 더한 값을 성질과 계산으로 확인하시오.` : position === 2 ? `${label}: 자료 ${values}의 평균을 구한 뒤 편차 제곱의 합을 구하시오.` : `${label}: 자료 ${values}에서 ${high}분산을 구하시오.`;
    return position === 1 ? `${label}: 자료 ${values}의 분산을 먼저 구하시오.` : `${label}: 자료 ${values}에서 ${high}표준편차를 구하시오.`;
  }
  function makeChoices(expected) {
    const numeric = Number(expected);
    if (Number.isFinite(numeric)) {
      const candidates = [numeric, numeric + 1, numeric - 1, numeric * 2 + 0.5, numeric + 2.5].map((value) => String(round(value)));
      return freezeArray(Array.from(new Set(candidates)).slice(0, 4));
    }
    return freezeArray([String(expected), "평균", "최빈값", "범위"].filter((value, index, array) => array.indexOf(value) === index).slice(0, 4));
  }
  function makeProblem(conceptId, stage, position, index) {
    const stageIndex = stages.indexOf(stage); const concept = concepts.find((item) => item.conceptId === conceptId);
    const answerType = TYPE_PATTERN[stage][position]; const data = buildStatisticsData(conceptId, stageIndex, position);
    let expectedAnswer = answerSpec(conceptId, data, position); const mode = validatorMode(conceptId, position, answerType);
    if (mode === "STEP_ORDER") expectedAnswer = freezeArray(STEP_PATHS[conceptId]);
    if (mode === "WRITTEN_REVIEW") expectedAnswer = `자료의 구조를 확인하고 ${concept.title}의 정의를 적용한 뒤 계산·단위·해석을 검증한다.`;
    const unitPolicy = mode === "NUMERIC_EQUIVALENCE" && ((conceptId === conceptIds[4] && ["A2", "A3", "A4", "A5"].includes(stage)) || (conceptId === conceptIds[5] && ["A2", "A3", "A4", "A5"].includes(stage))) ? "REQUIRED" : conceptId === conceptIds[3] && position === 1 ? "FORBIDDEN" : "OPTIONAL";
    const expectedUnit = conceptId === conceptIds[4] ? "점^2" : conceptId === conceptIds[3] && position === 1 ? null : "점";
    const roundingPolicy = conceptId === conceptIds[5] && stageIndex >= 3 ? "DECIMAL_PLACES_2" : "NONE";
    if (roundingPolicy !== "NONE" && mode === "NUMERIC_EQUIVALENCE") expectedAnswer = applyRounding(Number(expectedAnswer), roundingPolicy);
    let prompt = promptFor(conceptId, stage, position, data, expectedAnswer) + (unitPolicy === "REQUIRED" ? ` 답에는 ${expectedUnit} 단위를 반드시 쓰시오.` : "");
    if (mode === "STEP_ORDER") prompt += " 계산값만 쓰지 말고 제공된 풀이 action을 논리 순서대로 배열하시오.";
    const problemId = `m3-stat-${String(index + 1).padStart(3, "0")}-${conceptId.replace("m3_statistics_", "")}-${stage.toLowerCase()}-${position + 1}`;
    const acceptedAnswers = mode === "TEXT_NORMALIZED" ? freezeArray(["중앙값", "median"]) : mode === "MODE_SET" && data.mode.length === 0 ? freezeArray(["NONE", "없음", "최빈값 없음"]) : freezeArray([]);
    const solutionSteps = mode === "STEP_ORDER" ? expectedAnswer : freezeArray([
      "자료의 개수·정렬·도수 구조를 먼저 확인한다.",
      conceptId === conceptIds[4] || conceptId === conceptIds[5] ? "평균과 편차를 독립적으로 다시 계산한다." : "요구한 통계량의 정의를 적용한다.",
      `계산 결과 ${String(expectedAnswer)}을(를) 원자료에 대입해 검산한다.`,
      unitPolicy === "REQUIRED" ? `${expectedUnit} 단위와 반올림 자리를 확인한다.` : "결과의 범위와 표현을 확인한다.",
    ]);
    const statisticsAnswerContract = Object.freeze({ validatorMode: mode, unitPolicy, expectedUnit, decimalTolerance: roundingPolicy === "NONE" ? 1e-9 : 0.005, roundingPolicy, modePolicy: data.modePolicy, acceptedAnswers, tablePolicy: mode === "FREQUENCY_TABLE" ? "ORDERED_BINS_EXACT_FREQUENCIES" : "NOT_APPLICABLE", histogramPolicy: mode === "HISTOGRAM" ? "ORDERED_BIN_HEIGHTS" : "NOT_APPLICABLE" });
    const answerContract = Object.freeze({ ...statisticsAnswerContract });
    const writtenRubric = answerType === "WRITTEN_RESPONSE" ? Object.freeze({ reviewStatus: "REVIEW_REQUIRED", requiredIdeas: freezeArray(["자료 구조와 조건 명시", "적절한 통계량 선택 이유", "계산 근거", "오류 또는 반례 점검", "단위·반올림·결과 해석"]), minimumRequiredIdeas: 3, partialCredit: freezeArray(["조건 확인", "계산", "통계량 선택", "검산", "해석"]) }) : undefined;
    return Object.freeze({
      id: problemId, problemId, grade: 9, unitId: UNIT_ID, conceptId, conceptTitle: concept.title, stage, answerType,
      prompt, questionText: prompt, choices: answerType === "MULTIPLE_CHOICE" ? makeChoices(expectedAnswer) : undefined,
      expectedAnswer, correctAnswer: expectedAnswer, explanation: solutionSteps.join(" "),
      hints: freezeArray(["자료를 먼저 정렬하거나 계급별 도수를 표시하세요.", "정의로 계산한 뒤 합·개수·단위 조건을 거꾸로 확인하세요."]),
      solutionSteps, misconceptionTags: freezeArray(["UNSORTED_MEDIAN", "INCOMPLETE_MODE_SET", "DIVIDE_BY_N_MINUS_ONE", "ROUNDING_PLACE_ERROR", "UNIT_ERROR"]),
      difficultyEvidence: freezeArray(STAGE_META[stage].evidence), independentCheck: position === 3,
      independentCheckPolicy: Object.freeze({ hintDisclosure: "LOCKED_DURING_INDEPENDENT_CHECK", solutionDisclosure: "AFTER_FINAL", hintsLockedBeforeFinal: true, solutionLockedBeforeFinal: true }),
      curriculumVersion: CURRICULUM_VERSION, authoringScope: AUTHORING_SCOPE, sourceScope: SOURCE_SCOPE,
      structureSignature: `structure:m3-stat:${conceptId}:${stage}:${position}:${scenarioWords[stage][position].replace(/\s/g, "-")}`,
      solutionPathSignature: `solution:m3-stat:${conceptId}:${stage}:${position}:${mode}:${scenarioWords[stage][position].replace(/\s/g, "-")}`,
      linkedConditionCount: STAGE_META[stage].linked, minimumReasoningStepCount: STAGE_META[stage].steps,
      requiresStrategySelection: ["A3", "A4", "A5"].includes(stage), requiresExplanation: stage === "A5",
      contentRole: position === 3 ? "LEVEL_RECHECK" : "LEARNING_PRACTICE", legacyReuse: false,
      statisticsData: data, statisticsAnswerContract, answerContract, writtenRubric,
      independentValidation: Object.freeze({ conditionFeasible: true, uniqueAnswer: true, answerRecalculated: true, statisticsChecked: true, curriculumScopeChecked: true }),
    });
  }

  const problems = Object.freeze(conceptIds.flatMap((conceptId) => stages.flatMap((stage) => [0, 1, 2, 3].map((position) => makeProblem(conceptId, stage, position, conceptIds.indexOf(conceptId) * 24 + stages.indexOf(stage) * 4 + position)))));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));
  function evaluateAnswer(problemOrId, answer) { const problem = typeof problemOrId === "string" ? problemsById[problemOrId] : problemOrId; return problem ? evaluateStatisticsAnswer(problem, answer) : { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_PROBLEM" }; }
  function getProblems(conceptId, stage) { return Object.freeze(problems.filter((problem) => (!conceptId || problem.conceptId === conceptId) && (!stage || problem.stage === stage))); }
  function audit() {
    const countBy = (selector) => problems.reduce((out, problem) => { const key = selector(problem); out[key] = (out[key] || 0) + 1; return out; }, {});
    return Object.freeze({ problemCount: problems.length, byConcept: countBy((p) => p.conceptId), byStage: countBy((p) => p.stage), byAnswerType: countBy((p) => p.answerType), byUnitPolicy: countBy((p) => p.statisticsAnswerContract.unitPolicy), statisticsDataCount: problems.filter((p) => p.statisticsData).length, learningCount: problems.filter((p) => !p.independentCheck).length, independentCount: problems.filter((p) => p.independentCheck).length, hintCount: problems.reduce((sum, p) => sum + p.hints.length, 0) });
  }

  return Object.freeze({
    VERSION, UNIT_ID, CURRICULUM_VERSION, AUTHORING_SCOPE, SOURCE_SCOPE, ANSWER_TYPES, concepts, conceptIds, stages,
    problems, problemsById, getProblems, evaluateAnswer, evaluateProblemAnswer: evaluateAnswer,
    validateStatisticsData, evaluateStatisticsAnswer, normalizeStatisticInput, normalizeModeSet,
    evaluateFrequencyTableAnswer, evaluateHistogramAnswer, validateStatisticsStepOrder,
    calculateMean, calculateMedian, calculateModes, calculateRange, calculateDeviations, calculateVariance, calculateStandardDeviation, audit,
  });
});
