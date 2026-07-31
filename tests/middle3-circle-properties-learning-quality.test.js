const test = require("node:test");
const assert = require("node:assert/strict");

const model = require("../middle3-circle-properties-learning-model.js");
const content = require("../middle3-circle-properties-learning-content.js");

const CONCEPT_IDS = [
  "m3_circle_foundations", "m3_circle_chord", "m3_circle_tangent_radius",
  "m3_circle_tangent_segments", "m3_circle_central_inscribed", "m3_circle_same_arc",
];
const STAGES = ["BASIC", "A1", "A2", "A3", "A4", "A5"];

function countBy(items, selector) {
  return items.reduce((out, item) => {
    const key = selector(item);
    out[key] = (out[key] || 0) + 1;
    return out;
  }, {});
}
function unique(values, label) { assert.equal(new Set(values).size, values.length, label); }
function normalizedStructure(value) {
  return String(value).normalize("NFKC").toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/\s+/g, " ").trim();
}
function answerFor(problem) {
  if (problem.answerType === "STEP_ORDER") return problem.expectedAnswer;
  if (problem.answerType === "WRITTEN_RESPONSE") return problem.expectedAnswer;
  if (problem.answerContract.unitPolicy === "REQUIRED") {
    return problem.answerContract.expectedUnit === "degree"
      ? `${problem.expectedAnswer}°`
      : `${problem.expectedAnswer} ${problem.answerContract.expectedUnit}`;
  }
  return problem.expectedAnswer;
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
    MULTIPLE_CHOICE: 12, SHORT_ANSWER: 48, EXPRESSION_INPUT: 36, STEP_ORDER: 24, WRITTEN_RESPONSE: 24,
  });
});

test("모든 문항이 필수 학습·도형·채점 필드를 가진다", () => {
  const required = [
    "id", "problemId", "conceptId", "stage", "answerType", "prompt", "expectedAnswer",
    "explanation", "hints", "solutionSteps", "misconceptionTags", "difficultyEvidence",
    "independentCheck", "curriculumVersion", "authoringScope", "sourceScope",
    "structureSignature", "solutionPathSignature", "geometryData", "circleAnswerContract", "answerContract",
  ];
  const answerFields = ["validatorMode", "unitPolicy", "expectedUnit", "acceptedAnswers", "anglePolicy", "lengthPolicy", "geometrySelectionPolicy"];
  model.problems.forEach((problem) => {
    required.forEach((field) => assert.notEqual(problem[field], undefined, `${problem.problemId}:${field}`));
    answerFields.forEach((field) => assert.notEqual(problem.answerContract[field], undefined, `${problem.problemId}:answerContract.${field}`));
    assert.ok(problem.explanation.trim(), problem.problemId);
    assert.ok(problem.hints.length >= 2, problem.problemId);
    assert.ok(problem.solutionSteps.length >= 2, problem.problemId);
    assert.equal(problem.legacyReuse, false, problem.problemId);
    assert.equal(Object.hasOwn(problem.geometryData, "circleAnswerContract"), false, problem.problemId);
    assert.ok(["REQUIRED", "OPTIONAL", "FORBIDDEN"].includes(problem.answerContract.unitPolicy));
  });
});

test("144개 geometryData의 중심·반지름·지름·현·접선·호·각이 모두 일관된다", () => {
  assert.equal(model.audit().geometryCount, 144);
  model.problems.forEach((problem) => {
    const result = model.validateCircleGeometryData(problem.geometryData);
    assert.equal(result.valid, true, `${problem.problemId}:${result.errors.join(",")}`);
  });
});

test("원의 중심·지름·현 끝점과 점 위치 오류를 차단한다", () => {
  const base = model.problems[0].geometryData;
  const badCenter = { ...base, circleCenter: "M" };
  const badDiameter = { ...base, diameters: [{ ...base.diameters[0], length: 9 }, base.diameters[1]] };
  const badChord = { ...base, chords: [{ ...base.chords[0], endpoints: ["E", "P"] }, ...base.chords.slice(1)] };
  assert.ok(model.validateCircleGeometryData(badCenter).errors.includes("CENTER_POINT_INVALID"));
  assert.ok(model.validateCircleGeometryData(badDiameter).errors.includes("DIAMETER_LENGTH_MISMATCH:AC"));
  assert.ok(model.validateCircleGeometryData(badChord).errors.includes("CHORD_ENDPOINT_OFF_CIRCLE:EF"));
});

test("접점이 원 위에 있고 접선과 반지름이 수직인지 검사한다", () => {
  const base = model.problems[0].geometryData;
  const movedP = { ...base, points: base.points.map((p) => p.label === "P" ? { ...p, x: 6 } : p) };
  const badPoint = { ...base, tangents: [{ ...base.tangents[0], tangentPoint: "M" }, base.tangents[1]] };
  assert.ok(model.validateCircleGeometryData(movedP).errors.includes("TANGENT_RADIUS_NOT_PERPENDICULAR:PA"));
  assert.ok(model.validateCircleGeometryData(badPoint).errors.includes("TANGENT_POINT_OFF_CIRCLE:PA"));
});

test("같은 외부점에서 그은 두 접선의 길이 관계를 검사한다", () => {
  const base = model.problems[0].geometryData;
  const bad = { ...base, tangents: [base.tangents[0], { ...base.tangents[1], length: 6 }] };
  assert.ok(model.validateCircleGeometryData(bad).errors.includes("EQUAL_TANGENT_LENGTH_MISMATCH"));
  const problem = model.problems.find((p) => p.conceptId === "m3_circle_tangent_segments");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "EQUAL_TANGENT_SEGMENTS", firstTangent: "PA", secondTangent: "PB" }).status, "CORRECT");
});

test("접선·반지름 의미 채점은 접점과 선분 대응을 함께 확인한다", () => {
  const problem = model.problems.find((p) => p.conceptId === "m3_circle_tangent_radius");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "TANGENT_RADIUS_PERPENDICULAR", tangent: "PA", radius: "AO", tangentPoint: "A" }).status, "CORRECT");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "TANGENT_RADIUS_PERPENDICULAR", tangent: "PA", radius: "OB", tangentPoint: "A" }).status, "INCORRECT");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "TANGENT_RADIUS_PERPENDICULAR", tangent: "PA", radius: "OA", tangentPoint: "B" }).status, "INCORRECT");
});

test("중심각·원주각은 같은 referenceArc와 두 배 관계를 검사한다", () => {
  const problem = model.problems.find((p) => p.conceptId === "m3_circle_central_inscribed");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "CENTRAL_INSCRIBED", centralAngle: "AOB", inscribedAngle: "ADB" }).status, "CORRECT");
  const base = problem.geometryData;
  const bad = { ...base, centralAngles: [{ ...base.centralAngles[0], interceptedArc: "arcACUpper" }] };
  assert.ok(model.validateCircleGeometryData(bad).errors.includes("CENTRAL_ANGLE_ARC_MISMATCH:AOB"));
});

test("같은 호의 원주각과 반원에 대한 90° 관계를 검사한다", () => {
  const problem = model.problems.find((p) => p.conceptId === "m3_circle_same_arc");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "SAME_ARC_INSCRIBED", firstAngle: "ACB", secondAngle: "ADB" }).status, "CORRECT");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, { relationType: "SAME_ARC_INSCRIBED", firstAngle: "ACB", secondAngle: "ABC" }).status, "INCORRECT");
  const semicircle = problem.geometryData.arcs.find((arc) => arc.id === "arcACLower");
  const rightAngle = problem.geometryData.inscribedAngles.find((angle) => angle.id === "ABC");
  assert.equal(semicircle.type, "SEMICIRCLE");
  assert.equal(semicircle.measure, 180);
  assert.equal(rightAngle.measure, 90);
  assert.equal(rightAngle.interceptedArc, semicircle.id);
});

test("각도 입력 45·45°·45도를 정규화하고 단위 정책을 지킨다", () => {
  assert.deepEqual(model.normalizeAngleInput("45"), { expression: "45", unit: null });
  assert.deepEqual(model.normalizeAngleInput("45°"), { expression: "45", unit: "degree" });
  assert.deepEqual(model.normalizeAngleInput("45도"), { expression: "45", unit: "degree" });
  const optional = model.problems.find((p) => p.answerContract.validatorMode === "ANGLE" && p.answerContract.unitPolicy === "OPTIONAL");
  const required = model.problems.find((p) => p.answerContract.validatorMode === "ANGLE" && p.answerContract.unitPolicy === "REQUIRED");
  assert.ok(optional && required);
  assert.equal(model.evaluateAnswer(optional, String(optional.expectedAnswer)).status, "CORRECT");
  assert.equal(model.evaluateAnswer(optional, `${optional.expectedAnswer}도`).status, "CORRECT");
  assert.equal(model.evaluateAnswer(required, String(required.expectedAnswer)).reason, "UNIT_REQUIRED");
  assert.equal(model.evaluateAnswer(required, `${required.expectedAnswer}°`).status, "CORRECT");
});

test("길이 입력의 cm·m 변환과 REQUIRED·OPTIONAL·FORBIDDEN 정책을 지킨다", () => {
  const required = model.problems.find((p) => p.answerContract.validatorMode === "LENGTH" && p.answerContract.unitPolicy === "REQUIRED" && p.expectedAnswer === "1");
  const optional = model.problems.find((p) => p.answerContract.validatorMode === "LENGTH" && p.answerContract.unitPolicy === "OPTIONAL");
  const forbidden = model.problems.find((p) => p.answerContract.unitPolicy === "FORBIDDEN" && p.answerContract.validatorMode === "GEOMETRY_SELECTION");
  assert.ok(required && optional && forbidden);
  assert.equal(model.evaluateAnswer(required, "1").reason, "UNIT_REQUIRED");
  assert.equal(model.evaluateAnswer(required, "1cm").status, "CORRECT");
  assert.equal(model.evaluateAnswer(required, "0.01m").status, "CORRECT");
  assert.equal(model.evaluateAnswer(optional, optional.expectedAnswer).status, "CORRECT");
  assert.equal(model.evaluateAnswer(forbidden, `${forbidden.expectedAnswer} cm`).reason, "UNIT_FORBIDDEN");
});

test("현·지름·접선 라벨은 역순을 허용하고 다른 선분은 차단한다", () => {
  const problem = model.problems.find((p) => p.circleAnswerContract.selectionKind === "SEGMENT" && p.expectedAnswer === "OA");
  assert.ok(problem);
  assert.equal(model.evaluateCircleGeometryAnswer(problem, "OA").status, "CORRECT");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, "AO").status, "CORRECT");
  assert.equal(model.evaluateCircleGeometryAnswer(problem, "PA").status, "INCORRECT");
});

test("모든 자동 채점형 문항이 모델 정답을 수용한다", () => {
  model.problems.forEach((problem) => {
    const result = model.evaluateAnswer(problem, answerFor(problem));
    if (problem.answerType === "WRITTEN_RESPONSE") assert.equal(result.status, "REVIEW_REQUIRED", problem.problemId);
    else assert.equal(result.status, "CORRECT", `${problem.problemId}:${JSON.stringify(result)}`);
  });
});

test("STEP_ORDER는 실제 action만 허용하고 누락·역순을 차단한다", () => {
  const items = model.problems.filter((p) => p.answerType === "STEP_ORDER");
  assert.equal(items.length, 24);
  items.forEach((problem) => {
    assert.equal(model.validateCircleStepOrder(problem, problem.expectedAnswer).status, "CORRECT", problem.problemId);
    assert.equal(model.validateCircleStepOrder(problem, [...problem.expectedAnswer].reverse()).status, "INCORRECT", problem.problemId);
    assert.equal(model.validateCircleStepOrder(problem, problem.expectedAnswer.slice(1)).status, "INCORRECT", problem.problemId);
  });
});

test("서술형은 REVIEW_REQUIRED와 3개 이상의 필수 논점을 가진다", () => {
  const items = model.problems.filter((p) => p.answerType === "WRITTEN_RESPONSE");
  assert.equal(items.length, 24);
  items.forEach((problem) => {
    assert.equal(problem.writtenRubric.reviewStatus, "REVIEW_REQUIRED");
    assert.ok(problem.writtenRubric.requiredIdeas.length >= 3, problem.problemId);
    assert.ok(problem.writtenRubric.minimumRequiredIdeas >= 3, problem.problemId);
    assert.equal(model.evaluateAnswer(problem, "조건과 성질, 검산을 설명한다.").status, "REVIEW_REQUIRED");
  });
});

test("ID·prompt·숫자 제거 구조·structureSignature·solutionPathSignature 중복이 없다", () => {
  unique(model.problems.map((p) => p.id), "id");
  unique(model.problems.map((p) => p.prompt), "prompt");
  unique(model.problems.map((p) => normalizedStructure(p.prompt)), "numberless prompt structure");
  unique(model.problems.map((p) => p.structureSignature), "structureSignature");
  unique(model.problems.map((p) => p.solutionPathSignature), "solutionPathSignature");
});

test("혼자 풀기는 같은 conceptId·stage 학습 문제와 구조·전략이 겹치지 않는다", () => {
  for (const conceptId of CONCEPT_IDS) {
    for (const stage of STAGES) {
      const items = model.getProblems(conceptId, stage);
      const independent = items.find((p) => p.independentCheck);
      const learning = items.filter((p) => !p.independentCheck);
      assert.ok(independent.independentCheckPolicy.hintsLockedBeforeFinal);
      assert.ok(independent.independentCheckPolicy.solutionLockedBeforeFinal);
      assert.ok(learning.every((p) => p.structureSignature !== independent.structureSignature));
      assert.ok(learning.every((p) => p.solutionPathSignature !== independent.solutionPathSignature));
    }
  }
});

test("A3~A5 난이도 증거와 연결 조건 수가 단계 기준을 충족한다", () => {
  model.problems.filter((p) => ["A3", "A4", "A5"].includes(p.stage)).forEach((problem) => {
    assert.ok(problem.requiresStrategySelection, problem.problemId);
    assert.ok(problem.linkedConditionCount >= (problem.stage === "A3" ? 2 : problem.stage === "A4" ? 3 : 4));
    assert.ok(problem.minimumReasoningStepCount >= 3);
    if (problem.stage === "A5") assert.ok(problem.requiresExplanation);
  });
});

test("설명 콘텐츠는 6개 conceptId × 6단계이며 필수 설명 요소를 가진다", () => {
  assert.equal(content.lessons.length, 36);
  assert.deepEqual(content.concepts.map((item) => item.conceptId), CONCEPT_IDS);
  content.lessons.forEach((lesson) => {
    ["coreConcept", "easyExample", "commonMistakes", "procedure", "verification", "thinkingMethod", "strategy", "validation"].forEach((field) => assert.ok(lesson[field], `${lesson.lessonId}:${field}`));
  });
});

test("각도·길이 범위와 2015 개정 제외 키워드를 전수 검사한다", () => {
  const forbidden = ["원의 방정식", "접선의 방정식", "좌표기하", "호도법", "라디안", "벡터", "미적분", "사인법칙", "코사인법칙"];
  model.problems.forEach((problem) => {
    problem.geometryData.centralAngles.concat(problem.geometryData.inscribedAngles).forEach((angle) => {
      assert.ok(angle.measure > 0 && angle.measure < 180, `${problem.problemId}:${angle.id}`);
    });
    problem.geometryData.chords.forEach((chord) => assert.ok(Number(chord.length) > 0 || /sqrt/.test(String(chord.length))));
    problem.geometryData.tangents.forEach((tangent) => assert.ok(tangent.length > 0));
    forbidden.forEach((term) => assert.equal(problem.prompt.includes(term), false, `${problem.problemId}:${term}`));
  });
});

test("객관식 정답은 보기에서 정확히 한 번만 존재한다", () => {
  model.problems.filter((p) => p.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    assert.equal(problem.choices.filter((choice) => String(choice) === String(problem.correctAnswer)).length, 1, problem.problemId);
    unique(problem.choices, `${problem.problemId}:choices`);
  });
});
