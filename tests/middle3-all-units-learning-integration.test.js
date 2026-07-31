"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const schema = require("../math-learning-schema.js");

const ROOT = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex").toUpperCase();
const unit = (name, title, runtimeFile, modelFile, expected) => ({ name, title, runtime: require(path.join(ROOT, runtimeFile)), model: require(path.join(ROOT, modelFile)), ...expected });
const units = [
  unit("sqrt", "제곱근과 실수", "middle3-sqrt-learning-runtime.js", "middle3-sqrt-learning-model.js", { scopeId: "MIDDLE3_SQRT", cloudKey: "middle3SqrtLearningV1", localStorageKey: "studyCoinMiddle3SqrtLearningV1", cyclePrefix: "m3sqrt-cycle" }),
  unit("factorization", "다항식의 곱셈과 인수분해", "middle3-factorization-learning-runtime.js", "middle3-factorization-learning-model.js", { scopeId: "MIDDLE3_FACTORIZATION", cloudKey: "middle3FactorizationLearningV1", localStorageKey: "studyCoinMiddle3FactorizationLearningV1", cyclePrefix: "m3factor-cycle" }),
  unit("quadratic-equation", "이차방정식", "middle3-quadratic-equation-learning-runtime.js", "middle3-quadratic-equation-learning-model.js", { scopeId: "MIDDLE3_QUADRATIC_EQUATION", cloudKey: "middle3QuadraticEquationLearningV1", localStorageKey: "studyCoinMiddle3QuadraticEquationLearningV1", cyclePrefix: "m3qe-cycle" }),
  unit("quadratic", "이차함수", "middle3-quadratic-learning-runtime.js", "middle3-quadratic-learning-model.js", { scopeId: "MIDDLE3_QUADRATIC", cloudKey: "middle3QuadraticLearningV1", localStorageKey: "studyCoinMiddle3QuadraticLearningV1", cyclePrefix: "m3q-cycle" }),
  unit("trigonometric-ratio", "삼각비", "middle3-trigonometric-ratio-learning-runtime.js", "middle3-trigonometric-ratio-learning-model.js", { scopeId: "MIDDLE3_TRIGONOMETRIC_RATIO", cloudKey: "middle3TrigLearningV1", localStorageKey: "studyCoinMiddle3TrigLearningV1", cyclePrefix: "m3trig-cycle" }),
  unit("circle-properties", "원의 성질", "middle3-circle-properties-learning-runtime.js", "middle3-circle-properties-learning-model.js", { scopeId: "MIDDLE3_CIRCLE_PROPERTIES", cloudKey: "middle3CircleLearningV1", localStorageKey: "studyCoinMiddle3CircleLearningV1", cyclePrefix: "m3circle-cycle" }),
  unit("statistics", "통계", "middle3-statistics-learning-runtime.js", "middle3-statistics-learning-model.js", { scopeId: "MIDDLE3_STATISTICS", cloudKey: "middle3StatisticsLearningV1", localStorageKey: "studyCoinMiddle3StatisticsLearningV1", cyclePrefix: "m3stats-cycle" }),
];
const modelProblems = (model) => model.problems || model.PROBLEMS || Object.values(model.problemsById || {});
const evaluateModel = (model, problem, answer) => {
  const evaluator = model.evaluateProblemAnswer || model.evaluateAnswer;
  return evaluator ? evaluator.call(model, problem, answer) : schema.evaluateAnswer(problem, answer);
};
function answerFor(problem) {
  if (problem.answerType === "WRITTEN_RESPONSE") return problem.expectedAnswer || problem.correctAnswer || "조건, 계산, 검산을 모두 설명한다.";
  const expected = problem.expectedAnswer ?? problem.correctAnswer;
  if (problem.answerType === "STEP_ORDER") return expected;
  const contract = problem.answerContract || problem.statisticsAnswerContract || {};
  if (contract.unitPolicy === "REQUIRED") return contract.expectedUnit === "degree" ? `${expected}°` : `${expected} ${contract.expectedUnit}`;
  return expected;
}

test("7개 중3 단원 runtime이 모두 첫 스프링 사이클을 생성한다", () => {
  units.forEach((entry) => {
    const state = entry.runtime.createDefaultState("integration-user", () => 1);
    const started = entry.runtime.startCycle(state, { resume: false, idFactory: () => entry.name, now: () => 2 });
    assert.equal(started.cycleStatus, "ACTIVE", entry.name);
    assert.ok(started.cycleItems.length >= 3, entry.name);
    assert.ok(started.activeLearningCycleId.includes(entry.name), entry.name);
  });
});

test("단원별 scope·cloud·localStorage·cycle prefix가 서로 분리된다", () => {
  const runtimeSource = Object.fromEntries(units.map((entry) => [entry.name, read(`middle3-${entry.name}-learning-runtime.js`)]));
  units.forEach((entry) => {
    if (entry.name !== "quadratic") {
      assert.equal(entry.runtime.SCOPE_ID, entry.scopeId);
      assert.equal(entry.runtime.CLOUD_STATE_KEY, entry.cloudKey);
      assert.equal(entry.runtime.LOCAL_STORAGE_KEY, entry.localStorageKey);
      assert.equal(entry.runtime.CYCLE_PREFIX, entry.cyclePrefix);
    } else {
      assert.match(runtimeSource[entry.name], new RegExp(entry.cloudKey));
      assert.match(runtimeSource[entry.name], new RegExp(entry.localStorageKey));
      assert.match(runtimeSource[entry.name], new RegExp(entry.cyclePrefix));
    }
  });
  ["scopeId", "cloudKey", "localStorageKey", "cyclePrefix"].forEach((field) => assert.equal(new Set(units.map((entry) => entry[field])).size, 7, field));
});

test("각 단원 conceptId를 직접 지정한 사이클이 해당 개념 문제로 시작한다", () => {
  units.forEach((entry) => entry.runtime.CONCEPT_IDS.forEach((conceptId) => {
    const state = entry.runtime.createDefaultState("concept-user");
    const started = entry.runtime.startCycle(state, { resume: false, conceptId, stage: "BASIC", idFactory: () => `${entry.name}-${conceptId}` });
    assert.equal(started.cycleItems[0].conceptId, conceptId, `${entry.name}:${conceptId}`);
    assert.equal(started.cycleItems[0].stage, "BASIC", `${entry.name}:${conceptId}`);
  }));
});

test("한 사이클 안에서 problemId·구조·풀이 경로 중복이 없다", () => {
  units.forEach((entry) => {
    const started = entry.runtime.startCycle(entry.runtime.createDefaultState("duplicate-user"), { resume: false, idFactory: () => entry.name });
    ["problemId", "structureSignature", "solutionPathSignature"].forEach((field) => assert.equal(new Set(started.cycleItems.map((item) => item[field])).size, started.cycleItems.length, `${entry.name}:${field}`));
  });
});

test("신규 5개 단원은 각 concept-stage의 학습 3문항과 혼자 풀기 1문항을 분리한다", () => {
  units.filter((entry) => !["sqrt", "quadratic"].includes(entry.name)).forEach((entry) => {
    entry.runtime.CONCEPT_IDS.forEach((conceptId) => entry.runtime.STAGES.forEach((stage) => {
      const group = modelProblems(entry.model).filter((problem) => problem.conceptId === conceptId && problem.stage === stage);
      assert.equal(group.filter((problem) => !problem.independentCheck).length, 3, `${entry.name}:${conceptId}:${stage}`);
      assert.equal(group.filter((problem) => problem.independentCheck).length, 1, `${entry.name}:${conceptId}:${stage}`);
    }));
  });
});

test("힌트 뒤 풀이가 열리고 FINAL 답안은 재제출되지 않는다", () => {
  units.forEach((entry) => {
    let state = entry.runtime.startCycle(entry.runtime.createDefaultState("lock-user"), { resume: false, idFactory: () => entry.name });
    const problem = entry.runtime.currentProblem(state);
    assert.equal(entry.runtime.revealSolution(state).revealed, false, `${entry.name}:solution-before-attempt`);
    const hinted = entry.runtime.useHint(state);
    assert.equal(hinted.level, 1, `${entry.name}:hint-level`);
    assert.ok(hinted.hint, `${entry.name}:hint-text`);
    state = hinted.state;
    assert.equal(entry.runtime.revealSolution(state).revealed, true, `${entry.name}:solution-after-hint`);
    const answer = answerFor(problem);
    state = entry.runtime.setDraftAnswer(state, problem.problemId, answer);
    const submitted = entry.runtime.submitAnswer(state, answer);
    assert.equal(submitted.accepted, true, `${entry.name}:first-submit`);
    assert.equal(entry.runtime.submitAnswer(submitted.state, answer).accepted, false, `${entry.name}:duplicate-submit`);
  });
});

test("다섯 answerType은 각 단원 전용 모델 handler가 정상 답을 수용한다", () => {
  const types = ["MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE"];
  units.forEach((entry) => {
    const problems = modelProblems(entry.model);
    types.forEach((answerType) => {
      const problem = problems.find((item) => item.answerType === answerType);
      assert.ok(problem, `${entry.name}:${answerType}`);
      const result = evaluateModel(entry.model, problem, answerFor(problem));
      if (answerType === "WRITTEN_RESPONSE") assert.ok(["REVIEW_REQUIRED", "CORRECT"].includes(result.status), `${entry.name}:${answerType}:${JSON.stringify(result)}`);
      else assert.ok(result.correct === true || result.status === "CORRECT", `${entry.name}:${answerType}:${JSON.stringify(result)}`);
    });
  });
});

test("전용 validator 계약 필드가 단원별로 보존된다", () => {
  const factor = modelProblems(units[1].model); assert.ok(factor.some((p) => p.answerContract?.kind === "FACTORIZATION"));
  const equation = modelProblems(units[2].model); assert.ok(equation.some((p) => p.answerContract?.kind === "SOLUTION_SET"));
  const trig = modelProblems(units[4].model); assert.ok(trig.every((p) => p.geometryData && p.geometryAnswerContract));
  const circle = modelProblems(units[5].model); assert.ok(circle.every((p) => p.geometryData && p.circleAnswerContract));
  const statistics = modelProblems(units[6].model); assert.ok(statistics.every((p) => p.statisticsData && p.statisticsAnswerContract));
});

test("새로고침 직렬화와 revision이 각 runtime에서 보존된다", () => {
  units.forEach((entry) => {
    let state = entry.runtime.createDefaultState("restore-user", () => 1);
    state = entry.runtime.startCycle(state, { resume: false, idFactory: () => entry.name, now: () => 2 });
    const problem = entry.runtime.currentProblem(state);
    state = entry.runtime.setDraftAnswer(state, problem.problemId, answerFor(problem), () => 3);
    const serialized = entry.runtime.serializeState(state);
    const restored = entry.runtime.normalizeState(serialized, "restore-user", () => 4);
    assert.deepEqual(restored.draftAnswers, state.draftAnswers, entry.name);
    assert.equal(restored.activeLearningCycleId, state.activeLearningCycleId, entry.name);
    assert.equal(restored.revision, state.revision, entry.name);
  });
});

test("Firebase hydrate는 remote-wins이며 단원 상태가 서로 섞이지 않는다", () => {
  units.forEach((entry) => {
    const local = entry.runtime.createDefaultState("remote-user", () => 1); local.revision = 9; local.updatedAt = "2026-01-02T00:00:00.000Z";
    const remote = entry.runtime.createDefaultState("remote-user", () => 1); remote.revision = 2; remote.updatedAt = "2026-01-01T00:00:00.000Z"; remote.currentConceptId = entry.runtime.CONCEPT_IDS.at(-1);
    const resolved = entry.runtime.resolveHydrationState(remote, local, "remote-user", () => 3);
    assert.equal(resolved.source, "REMOTE", entry.name);
    assert.equal(resolved.state.currentConceptId, remote.currentConceptId, entry.name);
    assert.ok(resolved.state.currentConceptId.startsWith(entry.runtime.CONCEPT_IDS[0].split("_").slice(0, 2).join("_")) || entry.runtime.CONCEPT_IDS.includes(resolved.state.currentConceptId));
  });
});

test("학습맵·이전/다음 단원·추천 conceptId가 7개 전용 UI로 연결된다", () => {
  const learning = read("learning.js"); const uiFactory = read("middle3-spring-unit-ui-factory.js"); const recommendation = require(path.join(ROOT, "math-study-recommendations.js"));
  units.forEach((entry) => {
    assert.match(learning, new RegExp(entry.name === "quadratic" ? "middle3-quadratic" : `middle3-${entry.name}`));
    entry.runtime.CONCEPT_IDS.forEach((conceptId) => assert.ok(recommendation.CONCEPT_ROUTES[conceptId], conceptId));
  });
  assert.match(uiFactory, /이전 단원/); assert.match(uiFactory, /다음 단원/); assert.match(uiFactory, /study:m3-unit-selected/);
  assert.doesNotMatch(uiFactory, /cloudKey.*textContent|scopeId.*textContent/);
});

test("브라우저 스크립트는 모델·설명→공통 runtime→adapter→UI 순서다", () => {
  const html = read("index.html");
  ["factorization", "quadratic-equation", "trigonometric-ratio", "circle-properties", "statistics"].forEach((name) => {
    const modelAt = html.indexOf(`middle3-${name}-learning-model.js`); const contentAt = html.indexOf(`middle3-${name}-learning-content.js`); const runtimeAt = html.indexOf(`middle3-${name}-learning-runtime.js`); const uiAt = html.indexOf(`middle3-${name}-learning-ui.js`);
    assert.ok(modelAt > 0 && contentAt > modelAt && runtimeAt > contentAt && uiAt > runtimeAt, name);
  });
  assert.ok(html.indexOf("middle3-spring-unit-runtime-factory.js") < html.indexOf("middle3-factorization-learning-runtime.js"));
  assert.ok(html.indexOf("middle3-spring-unit-ui-factory.js") < html.indexOf("middle3-factorization-learning-ui.js"));
});

test("기존 이차함수·제곱근 저장 계약 문자열은 변경되지 않는다", () => {
  assert.match(read("middle3-quadratic-learning-runtime.js"), /middle3QuadraticLearningV1/);
  assert.match(read("middle3-quadratic-learning-runtime.js"), /studyCoinMiddle3QuadraticLearningV1/);
  assert.match(read("middle3-quadratic-learning-runtime.js"), /m3q-cycle/);
  assert.equal(units[0].runtime.CLOUD_STATE_KEY, "middle3SqrtLearningV1");
  assert.equal(units[0].runtime.LOCAL_STORAGE_KEY, "studyCoinMiddle3SqrtLearningV1");
  assert.equal(units[0].runtime.CYCLE_PREFIX, "m3sqrt-cycle");
});

test("승인된 7개 단원 모델·설명 SHA-256은 연결 전 해시와 같다", () => {
  const expected = {
    "middle3-sqrt-learning-model.js": "54A7CE5F72EDD390A98E9EEC84BA42E7BF6A2BDD9915FF3A6CB1C5DA193C91FC",
    "middle3-sqrt-learning-content.js": "8AE603B4122594817D1023208E7166EF65727E7064B8A7F25A0BC2CFD3F95157",
    "middle3-factorization-learning-model.js": "210BBB05458CC4BFF7D8D09FCC2D3CDC434181A4B342FDDD5735BE78379EE6D9",
    "middle3-factorization-learning-content.js": "46AB4DB20B1890DE59A6C3E33B99FCA7BD4CC27C650C8B4CAC3FE1BBCD45C88B",
    "middle3-quadratic-equation-learning-model.js": "8253C4BE9F3E22505D5BC71D50806620AA6FF20D2927883902D62F2D22DE518A",
    "middle3-quadratic-equation-learning-content.js": "1AB473F9C73F90D253EE3128B05394E82A04E65CD9D4D1CD2C9ACC57E4E86A5A",
    "middle3-quadratic-learning-model.js": "68F1E71E58EC71EFCD399D26D8F22A8ADAF532B915CF0BA5C1FB27F7124681AE",
    "middle3-quadratic-learning-content.js": "69CA29B7AF7EED204B1611FD2FB80FEA306C37EEA22AA498F24F1AA1E874DA8D",
    "middle3-trigonometric-ratio-learning-model.js": "0B5FD56D3BBC5BFF5F0D605115FA9075CEFF523E1C5B7FCEF1E21A464A49F6AF",
    "middle3-trigonometric-ratio-learning-content.js": "B0BD4F0CCDC3DA78488F1D31654E33010C810FE5146914CCB0A2641465F8CC0A",
    "middle3-circle-properties-learning-model.js": "1A20C41727CDC3553DE9C513656D7479D1E69FF73BB568877FBD5AEA2219F054",
    "middle3-circle-properties-learning-content.js": "48A0033281084E32AFC37DEB75F4FE827E59DE80EF5B163E36C6FFF06670E527",
    "middle3-statistics-learning-model.js": "261FDDD09AB0406870D71AAC7F3E62D896D5DB5FDCEE83D7717FC0AB31D57839",
    "middle3-statistics-learning-content.js": "42324A3B762F7FC6517ABB5E45CD33022F5ACF3996606D5CC0724270CD4833F2",
  };
  Object.entries(expected).forEach(([file, hash]) => assert.equal(sha256(file), hash, file));
});
