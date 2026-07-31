const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const algebra = require("../math-algebra-validator.js");
const model = require("../middle3-trigonometric-ratio-learning-model.js");
const content = require("../middle3-trigonometric-ratio-learning-content.js");

const root = path.resolve(__dirname, "..");
const CONCEPT_IDS = [
  "m3_trig_meaning",
  "m3_trig_sine",
  "m3_trig_cosine",
  "m3_trig_tangent",
  "m3_trig_special_angles",
  "m3_trig_length",
];
const STAGES = ["BASIC", "A1", "A2", "A3", "A4", "A5"];

function countBy(items, selector) {
  return items.reduce((out, item) => {
    const key = selector(item);
    out[key] = (out[key] || 0) + 1;
    return out;
  }, {});
}
function normalized(value) {
  return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}
function unique(values, label) {
  assert.equal(new Set(values).size, values.length, label);
}
function answerWithRequiredUnit(problem) {
  return problem.answerContract.unitPolicy === "REQUIRED"
    ? `${problem.expectedAnswer} ${problem.answerContract.expectedUnit}`
    : problem.expectedAnswer;
}

test("총 144문항이 6개 conceptId와 BASIC~A5에 정확히 배치된다", () => {
  assert.equal(model.problems.length, 144);
  assert.deepEqual(model.conceptIds, CONCEPT_IDS);
  assert.deepEqual(model.stages, STAGES);
  assert.deepEqual(countBy(model.problems, (p) => p.conceptId), Object.fromEntries(CONCEPT_IDS.map((id) => [id, 24])));
  assert.deepEqual(countBy(model.problems, (p) => p.stage), { BASIC: 24, A1: 24, A2: 24, A3: 24, A4: 24, A5: 24 });
});

test("각 conceptId·stage에는 학습 3문항과 혼자 풀기 1문항이 있다", () => {
  for (const conceptId of CONCEPT_IDS) {
    for (const stage of STAGES) {
      const items = model.getProblems(conceptId, stage);
      assert.equal(items.length, 4, `${conceptId}:${stage}`);
      assert.equal(items.filter((p) => !p.independentCheck).length, 3, `${conceptId}:${stage}:learning`);
      assert.equal(items.filter((p) => p.independentCheck).length, 1, `${conceptId}:${stage}:independent`);
    }
  }
  assert.equal(model.audit().learningCount, 108);
  assert.equal(model.audit().independentCount, 36);
});

test("다섯 answerType이 객관식 편중 없이 모두 존재한다", () => {
  assert.deepEqual(model.audit().byAnswerType, {
    MULTIPLE_CHOICE: 12,
    SHORT_ANSWER: 48,
    EXPRESSION_INPUT: 36,
    STEP_ORDER: 24,
    WRITTEN_RESPONSE: 24,
  });
});

test("모든 문항은 필수 학습·채점·도형 필드를 가진다", () => {
  const required = [
    "id", "problemId", "conceptId", "stage", "answerType", "prompt", "expectedAnswer",
    "explanation", "hints", "solutionSteps", "misconceptionTags", "difficultyEvidence",
    "independentCheck", "curriculumVersion", "authoringScope", "sourceScope",
    "structureSignature", "solutionPathSignature", "geometryData",
    "geometryAnswerContract", "answerContract",
  ];
  const answerFields = [
    "unitPolicy", "expectedUnit", "trigNormalizationPolicy",
    "geometryAnswerContract", "acceptedAnswers", "validatorMode",
  ];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.notEqual(problem[field], undefined, `${problem.problemId}:${field}`));
    answerFields.forEach((field) => assert.notEqual(problem.answerContract[field], undefined, `${problem.problemId}:answerContract.${field}`));
    assert.ok(problem.explanation.trim(), problem.problemId);
    assert.ok(problem.hints.length >= 2, problem.problemId);
    assert.ok(problem.solutionSteps.length >= 2, problem.problemId);
    assert.equal(problem.legacyReuse, false, problem.problemId);
    assert.equal(Object.hasOwn(problem.geometryData, "geometryAnswerContract"), false, problem.problemId);
    assert.ok(["REQUIRED", "OPTIONAL", "FORBIDDEN"].includes(problem.answerContract.unitPolicy), problem.problemId);
  });
});

test("144개 geometryData의 직각점·빗변·기준각 변 대응이 모두 일관된다", () => {
  assert.equal(model.audit().geometryCount, 144);
  model.problems.forEach((problem) => {
    const result = model.validateGeometryData(problem.geometryData);
    assert.equal(result.valid, true, `${problem.problemId}:${result.errors.join(",")}`);
    assert.equal(problem.geometryAnswerContract.referenceAngleVertex, problem.geometryData.referenceAngleVertex);
    assert.equal(problem.geometryAnswerContract.expectedRoles.hypotenuse, problem.geometryData.hypotenuse);
    assert.equal(problem.geometryAnswerContract.expectedRoles.oppositeSide, problem.geometryData.oppositeSide);
    assert.equal(problem.geometryAnswerContract.expectedRoles.adjacentSide, problem.geometryData.adjacentSide);
  });
});

test("잘못된 빗변·맞은편 변·이웃한 변 데이터는 각각 차단된다", () => {
  const base = model.problems[0].geometryData;
  const wrongHyp = { ...base, hypotenuse: "AB" };
  const wrongOpp = { ...base, oppositeSide: "AB" };
  const wrongAdj = { ...base, adjacentSide: "AC" };
  assert.ok(model.validateGeometryData(wrongHyp).errors.includes("RIGHT_ANGLE_HYPOTENUSE_MISMATCH"));
  assert.ok(model.validateGeometryData(wrongOpp).errors.includes("REFERENCE_OPPOSITE_MISMATCH"));
  assert.ok(model.validateGeometryData(wrongAdj).errors.includes("REFERENCE_ADJACENT_MISMATCH"));
});

test("같은 3-4-5 삼각형에서 기준각 B와 C를 바꾸면 두 직각변의 역할만 교환된다", () => {
  const b = model.problems.find((p) => p.geometryData.triangleKey === "T345B").geometryData;
  const c = model.problems.find((p) => p.geometryData.triangleKey === "T345C").geometryData;
  assert.equal(b.hypotenuse, c.hypotenuse);
  assert.equal(b.oppositeSide, c.adjacentSide);
  assert.equal(b.adjacentSide, c.oppositeSide);
});

test("geometryAnswerContract는 역순 변 라벨을 허용하고 다른 역할은 차단한다", () => {
  const problem = model.problems.find((p) => p.answerContract.validatorMode === "GEOMETRY_ROLE");
  const expected = problem.geometryAnswerContract.expectedRoles[problem.geometryAnswerContract.requestedRole];
  const reversed = expected.split("").reverse().join("");
  assert.equal(model.evaluateGeometryAnswer(problem, expected).status, "CORRECT");
  assert.equal(model.evaluateGeometryAnswer(problem, reversed).status, "CORRECT");
  const wrong = ["AB", "AC", "BC"].find((side) => normalized(side) !== normalized(expected));
  assert.equal(model.evaluateGeometryAnswer(problem, wrong).status, "INCORRECT");
});

test("sin·cos·tan의 허용 표기를 특수각 값으로 정규화한다", () => {
  const cases = {
    "sin30": "1/2",
    "sin 30": "1/2",
    "sin(30)": "1/2",
    "sin30°": "1/2",
    "sin(30°)": "1/2",
    "\\sin 30^\\circ": "1/2",
    "cos60": "1/2",
    "tan45": "1",
    "sin45": "sqrt(2)/2",
    "cos45": "sqrt(2)/2",
    "sin60": "sqrt(3)/2",
    "cos30": "sqrt(3)/2",
    "tan30": "sqrt(3)/3",
    "tan60": "sqrt(3)",
  };
  Object.entries(cases).forEach(([input, expected]) => {
    assert.equal(model.normalizeTrigInput(input), expected, input);
  });
});

test("특수각 입력과 분수·근호 동치가 기존 대수 validator를 통해 채점된다", () => {
  const sin30 = model.problems.find((p) => p.conceptId === "m3_trig_special_angles" && p.expectedAnswer === "1/2");
  const tan30 = model.problems.find((p) => p.conceptId === "m3_trig_special_angles" && p.expectedAnswer === "sqrt(3)/3");
  const sin45 = model.problems.find((p) => p.conceptId === "m3_trig_special_angles" && p.expectedAnswer === "sqrt(2)/2");
  assert.ok(sin30 && tan30 && sin45);
  assert.equal(model.evaluateAnswer(sin30, "sin(30°)").status, "CORRECT");
  assert.equal(model.evaluateAnswer(tan30, "1/sqrt(3)").status, "CORRECT");
  assert.equal(model.evaluateAnswer(sin45, "sqrt(8)/4").status, "CORRECT");
  assert.equal(algebra.compareExpressions("sqrt(3)/3", "1/sqrt(3)").status, "EQUIVALENT");
});

test("REQUIRED·OPTIONAL·FORBIDDEN 단위 정책과 m↔cm·km↔m 변환을 구분한다", () => {
  const required = model.problems.find((p) => p.answerContract.unitPolicy === "REQUIRED" && p.expectedAnswer === "5" && p.answerContract.expectedUnit === "m");
  const optional = model.problems.find((p) => p.answerContract.unitPolicy === "OPTIONAL");
  const forbidden = model.problems.find((p) => p.answerContract.unitPolicy === "FORBIDDEN" && p.answerContract.validatorMode === "TRIG_EXPRESSION");
  assert.ok(required && optional && forbidden);
  assert.equal(model.evaluateAnswer(required, "5").reason, "UNIT_REQUIRED");
  assert.equal(model.evaluateAnswer(required, "5m").status, "CORRECT");
  assert.equal(model.evaluateAnswer(required, "500 cm").status, "CORRECT");
  assert.equal(model.evaluateAnswer(required, "0.005 km").status, "CORRECT");
  assert.equal(model.evaluateAnswer(optional, optional.expectedAnswer).status, "CORRECT");
  assert.equal(model.evaluateAnswer(optional, `${optional.expectedAnswer} ${optional.answerContract.expectedUnit}`).status, "CORRECT");
  assert.equal(model.evaluateAnswer(forbidden, `${forbidden.expectedAnswer} m`).reason, "UNIT_FORBIDDEN");
});

test("모든 자동채점 문항의 모델 정답은 계약을 통과한다", () => {
  model.problems.filter((p) => p.answerType !== "WRITTEN_RESPONSE").forEach((problem) => {
    const answer = problem.answerType === "STEP_ORDER"
      ? problem.expectedAnswer
      : answerWithRequiredUnit(problem);
    const result = model.evaluateAnswer(problem, answer);
    assert.equal(result.status, "CORRECT", `${problem.problemId}:${result.reason || result.status}`);
  });
});

test("객관식은 보기 중 채점상 정답이 정확히 하나다", () => {
  model.problems.filter((p) => p.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    assert.ok(problem.choices.length >= 3, problem.problemId);
    unique(problem.choices.map(normalized), problem.problemId);
    const correctCount = problem.choices.filter((choice) => model.evaluateAnswer(problem, choice).status === "CORRECT").length;
    assert.equal(correctCount, 1, problem.problemId);
  });
});

test("STEP_ORDER는 필요한 action만 허용하고 역순·누락·추가를 차단한다", () => {
  model.problems.filter((p) => p.answerType === "STEP_ORDER").forEach((problem) => {
    const expected = problem.expectedAnswer;
    assert.equal(model.validateGeometryStepOrder(problem, expected).status, "CORRECT", problem.problemId);
    assert.equal(model.validateGeometryStepOrder(problem, [...expected].reverse()).status, "INCORRECT", problem.problemId);
    assert.equal(model.validateGeometryStepOrder(problem, expected.slice(1)).status, "INCORRECT", problem.problemId);
    assert.equal(model.validateGeometryStepOrder(problem, [...expected, "VERIFY_RANGE"]).status, "INCORRECT", problem.problemId);
  });
});

test("서술형은 REVIEW_REQUIRED와 3개 이상의 채점 논점을 가진다", () => {
  model.problems.filter((p) => p.answerType === "WRITTEN_RESPONSE").forEach((problem) => {
    assert.equal(model.evaluateAnswer(problem, problem.expectedAnswer).status, "REVIEW_REQUIRED");
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.partialCredit.length >= 3, problem.problemId);
  });
});

test("ID·prompt·structureSignature·solutionPathSignature 중복이 없다", () => {
  unique(model.problems.map((p) => p.id), "id");
  unique(model.problems.map((p) => p.problemId), "problemId");
  unique(model.problems.map((p) => normalized(p.prompt)), "prompt");
  unique(model.problems.map((p) => p.structureSignature), "structureSignature");
  unique(model.problems.map((p) => p.solutionPathSignature), "solutionPathSignature");
});

test("혼자 풀기 문항은 같은 conceptId·stage 학습 문제와 전략 signature가 겹치지 않는다", () => {
  model.problems.filter((p) => p.independentCheck).forEach((problem) => {
    const peers = model.getProblems(problem.conceptId, problem.stage).filter((p) => !p.independentCheck);
    assert.ok(peers.every((p) => p.structureSignature !== problem.structureSignature), problem.problemId);
    assert.ok(peers.every((p) => p.solutionPathSignature !== problem.solutionPathSignature), problem.problemId);
    assert.equal(problem.independentCheckPolicy.hintsLockedBeforeFinal, true);
    assert.equal(problem.independentCheckPolicy.solutionLockedBeforeFinal, true);
  });
});

test("A3~A5는 단계별 연결 조건과 풀이 단계 기준을 충족한다", () => {
  const minimumLinked = { A3: 2, A4: 3, A5: 4 };
  model.problems.filter((p) => ["A3", "A4", "A5"].includes(p.stage)).forEach((problem) => {
    assert.ok(problem.linkedConditionCount >= minimumLinked[problem.stage], problem.problemId);
    assert.ok(problem.solutionSteps.length >= problem.minimumReasoningStepCount, problem.problemId);
    assert.equal(problem.requiresStrategySelection, true, problem.problemId);
    if (problem.stage === "A5") assert.equal(problem.requiresExplanation, true, problem.problemId);
  });
});

test("직각삼각형 수치 데이터와 특수각 비는 수학적으로 일치한다", () => {
  const seen = new Set();
  model.problems.forEach((problem) => {
    const g = problem.geometryData;
    if (seen.has(g.triangleKey)) return;
    seen.add(g.triangleKey);
    const lhs = `(${g.sideLengths.AB})^2+(${g.sideLengths.AC})^2`;
    const rhs = `(${g.sideLengths.BC})^2`;
    assert.equal(algebra.compareExpressions(lhs, rhs).status, "EQUIVALENT", g.triangleKey);
  });
  assert.equal(model.normalizeTrigInput("sin30°"), "1/2");
  assert.equal(model.normalizeTrigInput("cos30°"), "sqrt(3)/2");
  assert.equal(model.normalizeTrigInput("tan60°"), "sqrt(3)");
});

test("설명 콘텐츠는 6개 concept × 6개 stage의 36개 수업을 제공한다", () => {
  assert.equal(content.lessons.length, 36);
  for (const conceptId of CONCEPT_IDS) {
    for (const stage of STAGES) {
      const lesson = content.getLesson(conceptId, stage);
      assert.ok(lesson, `${conceptId}:${stage}`);
      ["coreConcept", "easyExample", "commonMistakes", "procedure", "verification", "prerequisites", "nextConnection"].forEach((field) => {
        assert.ok(lesson[field]?.length || lesson[field]?.trim?.(), `${lesson.lessonId}:${field}`);
      });
    }
  }
});

test("2015 개정 중3 범위 밖의 고등 삼각함수 내용을 사용하지 않는다", () => {
  const source = [
    fs.readFileSync(path.join(root, "middle3-trigonometric-ratio-learning-model.js"), "utf8"),
    fs.readFileSync(path.join(root, "middle3-trigonometric-ratio-learning-content.js"), "utf8"),
  ].join("\n");
  [
    /사인법칙/, /코사인법칙/, /단위원/, /라디안/, /삼각함수\s*그래프/,
    /삼각방정식/, /벡터/, /미적분/, /일반각/,
  ].forEach((pattern) => assert.doesNotMatch(source, pattern));
  assert.ok(model.problems.every((p) => p.curriculumVersion === "2015_REVISED_MIDDLE_SCHOOL_MATH"));
  assert.ok(model.problems.every((p) => p.sourceScope === "NEW_TRIGONOMETRIC_RATIO_SPRING_CONTENT"));
});

test("공개 모델 계약을 모두 제공한다", () => {
  [
    "problems", "problemsById", "getProblems", "conceptIds", "stages",
    "evaluateAnswer", "normalizeTrigInput", "evaluateGeometryAnswer",
    "validateGeometryData", "validateGeometryStepOrder",
  ].forEach((field) => assert.notEqual(model[field], undefined, field));
});
