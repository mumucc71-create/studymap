const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const algebra = require("../math-algebra-validator.js");
const model = require("../middle3-quadratic-equation-learning-model.js");
const content = require("../middle3-quadratic-equation-learning-content.js");

const root = path.resolve(__dirname, "..");
const CONCEPT_IDS = [
  "m3_quadratic_meaning",
  "m3_quadratic_factor_solve",
  "m3_quadratic_sqrt_solve",
  "m3_quadratic_formula",
  "m3_quadratic_root_meaning",
  "m3_quadratic_word_setup",
];
const STAGES = ["BASIC", "A1", "A2", "A3", "A4", "A5"];

function countBy(values, selector) {
  return values.reduce((out, value) => {
    const key = selector(value); out[key] = (out[key] || 0) + 1; return out;
  }, {});
}
function normalized(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}
function numericStructure(value) {
  return normalized(value).replace(/-?\d+(?:\.\d+)?/g, "#").replace(/#+/g, "#");
}
function byKey(key) {
  const problem = model.problems.find((item) => item.problemId.endsWith(`-${key}`));
  assert.ok(problem, key);
  return problem;
}

test("144개 신규 문항이 6개 concept와 BASIC~A5에 정확히 배치된다", () => {
  assert.equal(model.AUTHORING_MODE, "EXPLICIT_AUTHORED_BLUEPRINTS_NO_LEGACY_REUSE");
  assert.equal(model.problems.length, 144);
  assert.deepEqual(model.concepts.map((item) => item.conceptId), CONCEPT_IDS);
  assert.deepEqual(countBy(model.problems, (item) => item.conceptId), Object.fromEntries(CONCEPT_IDS.map((id) => [id, 24])));
  assert.deepEqual(countBy(model.problems, (item) => item.stage), { BASIC: 24, A1: 24, A2: 24, A3: 24, A4: 24, A5: 24 });
});

test("각 concept-stage는 학습 3문항과 혼자 풀기 1문항이다", () => {
  CONCEPT_IDS.forEach((conceptId) => STAGES.forEach((stage) => {
    const items = model.getProblems(conceptId, stage);
    assert.equal(items.length, 4, `${conceptId}:${stage}`);
    assert.equal(items.filter((item) => item.independentCheck).length, 1);
    assert.equal(items.filter((item) => !item.independentCheck).length, 3);
  }));
  assert.equal(model.audit().learningCount, 108);
  assert.equal(model.audit().independentCount, 36);
});

test("ID·prompt·숫자 제거 구조·두 signature는 모두 고유하다", () => {
  const unique = (values, label) => assert.equal(new Set(values).size, values.length, label);
  unique(model.problems.map((item) => item.id), "id");
  unique(model.problems.map((item) => item.problemId), "problemId");
  unique(model.problems.map((item) => normalized(item.prompt)), "prompt");
  unique(model.problems.map((item) => numericStructure(item.prompt)), "numeric prompt");
  unique(model.problems.map((item) => item.structureSignature), "structure");
  unique(model.problems.map((item) => item.solutionPathSignature), "solution path");
});

test("모든 문항은 필수 필드·설명·힌트 2개·풀이를 가진다", () => {
  const required = [
    "id", "problemId", "conceptId", "stage", "answerType", "prompt", "expectedAnswer",
    "explanation", "hints", "solutionSteps", "misconceptionTags", "difficultyEvidence",
    "independentCheck", "curriculumVersion", "authoringScope", "structureSignature", "solutionPathSignature",
  ];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.notEqual(problem[field], undefined, `${problem.problemId}:${field}`));
    assert.ok(problem.explanation.trim(), problem.problemId);
    assert.ok(problem.hints.length >= 2, problem.problemId);
    assert.ok(problem.solutionSteps.length >= 2, problem.problemId);
    assert.equal(problem.legacyReuse, false);
  });
});

test("다섯 answerType 분포와 과정형·서술형 수를 고정한다", () => {
  assert.deepEqual(model.audit().byAnswerType, {
    MULTIPLE_CHOICE: 12,
    SHORT_ANSWER: 48,
    EXPRESSION_INPUT: 36,
    STEP_ORDER: 24,
    WRITTEN_RESPONSE: 24,
  });
  assert.equal(model.audit().processCount, 24);
  assert.equal(model.audit().writtenCount, 24);
});

test("객관식은 정답이 보기 안에 정확히 하나다", () => {
  model.problems.filter((item) => item.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    assert.equal(new Set(problem.choices.map(normalized)).size, problem.choices.length, problem.problemId);
    assert.equal(problem.choices.filter((choice) => normalized(choice) === normalized(problem.expectedAnswer)).length, 1, problem.problemId);
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "CORRECT");
  });
});

test("모든 자동 채점형 모델 정답이 answer contract를 통과한다", () => {
  model.problems.filter((item) => item.answerType !== "WRITTEN_RESPONSE").forEach((problem) => {
    const result = model.evaluateProblemAnswer(problem, problem.expectedAnswer);
    assert.equal(result.status, "CORRECT", `${problem.problemId}:${result.reason || ""}`);
  });
});

test("해 집합은 순서와 무관하고 근호 ± 표현을 동치 처리한다", () => {
  assert.equal(algebra.compareSolutionSets("2,-3", "-3,2").status, "CORRECT");
  assert.equal(algebra.compareSolutionSets("1+sqrt(2),1-sqrt(2)", "1±sqrt(2)").status, "CORRECT");
  const problem = byKey("basic-square");
  assert.equal(model.evaluateProblemAnswer(problem, "-4,4").status, "CORRECT");
});

test("중근은 중복을 제거하고 실근 없음은 빈 집합으로 처리한다", () => {
  assert.equal(algebra.compareSolutionSets("4", "4,4").status, "CORRECT");
  assert.equal(algebra.compareSolutionSets("{}", "no solution").status, "CORRECT");
  assert.equal(model.evaluateProblemAnswer(byKey("negative-no-real"), "0").status, "INCORRECT");
});

test("± 누락과 한 근만 제출한 답을 차단한다", () => {
  assert.equal(model.evaluateProblemAnswer(byKey("basic-square"), "4").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(byKey("shifted-square"), "5").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(byKey("radical-basic"), "4+sqrt(7)").status, "INCORRECT");
});

test("자연수·양수·구간 조건 밖 해를 포함하면 오답이다", () => {
  assert.equal(model.evaluateProblemAnswer(byKey("extraneous-domain"), "3,-3").reason, "OUT_OF_DOMAIN_ROOT_INCLUDED");
  assert.equal(model.evaluateProblemAnswer(byKey("independent-positive-root"), "9,-9").reason, "OUT_OF_DOMAIN_ROOT_INCLUDED");
  assert.equal(model.evaluateProblemAnswer(byKey("independent-domain-filter"), "1,9").reason, "OUT_OF_DOMAIN_ROOT_INCLUDED");
});

test("대표 부호·계수 오류를 차단한다", () => {
  assert.equal(model.evaluateProblemAnswer(byKey("formula-rational"), "-1,3/2").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(byKey("formula-radical-simplify"), "-1+sqrt(15)/3,-1-sqrt(15)/3").status, "INCORRECT");
  assert.equal(model.evaluateProblemAnswer(byKey("move-and-factor"), "-3,5").status, "INCORRECT");
});

test("인수분해식·근호식의 수학적 동치가 validator에서 유지된다", () => {
  assert.equal(algebra.compareExpressions("(x-3)(x+2)", "x^2-x-6").status, "EQUIVALENT");
  assert.equal(algebra.compareExpressions("sqrt(8)", "2sqrt(2)").status, "EQUIVALENT");
});

test("과정형은 정확한 순서만 허용하고 역순·누락·추가를 차단한다", () => {
  model.problems.filter((item) => item.answerType === "STEP_ORDER").forEach((problem) => {
    const expected = problem.expectedAnswer;
    assert.equal(model.evaluateProblemAnswer(problem, expected).status, "CORRECT");
    assert.equal(model.evaluateProblemAnswer(problem, [...expected].reverse()).status, "INCORRECT");
    assert.equal(model.evaluateProblemAnswer(problem, expected.slice(1)).status, "INCORRECT");
    assert.equal(model.evaluateProblemAnswer(problem, [...expected, "불필요한 단계"]).status, "INCORRECT");
  });
});

test("서술형은 REVIEW_REQUIRED와 3개 이상 필수 논점을 가진다", () => {
  model.problems.filter((item) => item.answerType === "WRITTEN_RESPONSE").forEach((problem) => {
    assert.equal(model.evaluateProblemAnswer(problem, problem.expectedAnswer).status, "REVIEW_REQUIRED");
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.partialCredit.length >= 3, problem.problemId);
  });
});

test("혼자 풀기는 같은 단계 학습 문제와 전략이 겹치지 않고 공개가 잠긴다", () => {
  model.problems.filter((item) => item.independentCheck).forEach((problem) => {
    const peers = model.getProblems(problem.conceptId, problem.stage).filter((item) => !item.independentCheck);
    assert.ok(peers.every((peer) => peer.structureSignature !== problem.structureSignature), problem.problemId);
    assert.ok(peers.every((peer) => peer.solutionPathSignature !== problem.solutionPathSignature), problem.problemId);
    assert.equal(problem.independentCheckPolicy.hintsLockedBeforeFinal, true);
    assert.equal(problem.independentCheckPolicy.solutionLockedBeforeFinal, true);
  });
});

test("A3~A5는 단계별 사고·연결 조건 계약을 충족한다", () => {
  model.problems.filter((item) => ["A3", "A4", "A5"].includes(item.stage)).forEach((problem) => {
    assert.ok(problem.solutionSteps.length >= problem.minimumReasoningStepCount, problem.problemId);
    assert.ok(problem.linkedConditionCount >= ({ A3: 2, A4: 3, A5: 4 })[problem.stage], problem.problemId);
    assert.equal(problem.requiresStrategySelection, true);
    if (problem.stage === "A5") assert.equal(problem.requiresExplanation, true);
  });
});

test("직접 검산한 고위험 조건형 정답이 일치한다", () => {
  const expected = {
    "independent-reverse-general-form": "17",
    "parameter-factor-candidate": "4",
    "integer-root-square-parameter": "4",
    "minimum-k-integer-root": "9",
    "minimum-integer-k": "3",
    "two-layout-cases": "8",
    "hidden-perimeter-area": "12",
  };
  Object.entries(expected).forEach(([key, answer]) => assert.equal(byKey(key).expectedAnswer, answer, key));
});

test("설명 콘텐츠는 6 concept × 6 stage이며 필수 학습 요소를 제공한다", () => {
  assert.equal(content.lessons.length, 36);
  CONCEPT_IDS.forEach((conceptId) => STAGES.forEach((stage) => {
    const lesson = content.getLesson(conceptId, stage);
    assert.ok(lesson, `${conceptId}:${stage}`);
    ["coreConcept", "easyExample", "commonMistakes", "procedure", "verification", "prerequisites", "nextConnection"].forEach(
      (field) => assert.ok(lesson[field]?.length || lesson[field]?.trim?.(), `${lesson.lessonId}:${field}`)
    );
  }));
});

test("2015 개정 중3 제외 범위와 레거시 직접 재사용이 없다", () => {
  const source = [
    fs.readFileSync(path.join(root, "middle3-quadratic-equation-learning-model.js"), "utf8"),
    fs.readFileSync(path.join(root, "middle3-quadratic-equation-learning-content.js"), "utf8"),
  ].join("\n");
  [
    /근과\s*계수의\s*관계/,
    /복소수/,
    /고차방정식/,
    /나머지정리/,
    /인수정리/,
    /이차함수.{0,20}(최댓값|최솟값)/,
    /legacy.*require/i,
  ].forEach((pattern) => assert.doesNotMatch(source, pattern));
  assert.ok(model.problems.every((problem) => problem.sourceScope === "NEW_QUADRATIC_EQUATION_SPRING_CONTENT"));
});

test("audit 집계가 실제 문제·힌트 수와 일치한다", () => {
  const audit = model.audit();
  assert.equal(audit.problemCount, 144);
  assert.equal(audit.hintCount, 288);
  assert.equal(audit.learningCount + audit.independentCount, audit.problemCount);
});
