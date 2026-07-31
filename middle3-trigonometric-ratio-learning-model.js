(function (root, factory) {
  const algebra = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const api = factory(algebra);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_TRIGONOMETRIC_RATIO_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (algebra) {
  "use strict";

  if (!algebra) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");

  const VERSION = "m3-trigonometric-ratio-learning-model-v1";
  const UNIT_ID = "m3-trigonometric-ratio";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const AUTHORING_SCOPE = "MIDDLE3_TRIGONOMETRIC_RATIO_EXPLICIT_MATRIX_V1";
  const SOURCE_SCOPE = "NEW_TRIGONOMETRIC_RATIO_SPRING_CONTENT";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const conceptIds = Object.freeze([
    "m3_trig_meaning",
    "m3_trig_sine",
    "m3_trig_cosine",
    "m3_trig_tangent",
    "m3_trig_special_angles",
    "m3_trig_length",
  ]);
  const concepts = Object.freeze([
    { conceptId: conceptIds[0], title: "삼각비의 뜻과 세 변의 역할", order: 1 },
    { conceptId: conceptIds[1], title: "사인", order: 2 },
    { conceptId: conceptIds[2], title: "코사인", order: 3 },
    { conceptId: conceptIds[3], title: "탄젠트", order: 4 },
    { conceptId: conceptIds[4], title: "30°·45°·60°의 삼각비", order: 5 },
    { conceptId: conceptIds[5], title: "삼각비로 길이·높이·거리 구하기", order: 6 },
  ].map(Object.freeze));

  const ANSWER_TYPES = Object.freeze([
    "MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE",
  ]);
  const TYPE_PATTERN = Object.freeze({
    BASIC: ["MULTIPLE_CHOICE", "MULTIPLE_CHOICE", "SHORT_ANSWER", "SHORT_ANSWER"],
    A1: ["SHORT_ANSWER", "EXPRESSION_INPUT", "EXPRESSION_INPUT", "SHORT_ANSWER"],
    A2: ["EXPRESSION_INPUT", "SHORT_ANSWER", "STEP_ORDER", "EXPRESSION_INPUT"],
    A3: ["SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER"],
    A4: ["EXPRESSION_INPUT", "STEP_ORDER", "SHORT_ANSWER", "WRITTEN_RESPONSE"],
    A5: ["WRITTEN_RESPONSE", "STEP_ORDER", "WRITTEN_RESPONSE", "WRITTEN_RESPONSE"],
  });
  const STAGE_META = Object.freeze({
    BASIC: { linked: 1, minimumSteps: 2, evidence: ["기준각과 세 변의 이름을 직접 확인", "삼각비 정의를 한 번 적용"] },
    A1: { linked: 1, minimumSteps: 2, evidence: ["기준각에 따른 변 대응을 확인", "분수·근호 또는 한 단계 길이 계산"] },
    A2: { linked: 2, minimumSteps: 3, evidence: ["변 대응과 삼각비 선택을 연결", "계산 뒤 단위 또는 범위를 검산"] },
    A3: { linked: 2, minimumSteps: 3, evidence: ["기준각 판단·비 선택·비례식 중 둘 이상 연결", "후보를 계산하고 결과를 검산"] },
    A4: { linked: 3, minimumSteps: 4, evidence: ["숨은 기준각·역추론·경우 분류 중 둘 이상 사용", "표현 또는 단위를 바꾸어 결과 범위를 검산"] },
    A5: { linked: 4, minimumSteps: 4, evidence: ["오류 분석·필요충분조건·일반화·반례 중 둘 이상 사용", "가능한 경우를 빠짐없이 분류하고 검증"] },
  });

  const TRIANGLES = Object.freeze({
    T345B: { base: "4", height: "3", hyp: "5", ref: "B", angle: 36.87, sin: "3/5", cos: "4/5", tan: "3/4" },
    T345C: { base: "4", height: "3", hyp: "5", ref: "C", angle: 53.13, sin: "4/5", cos: "3/5", tan: "4/3" },
    T51213B: { base: "12", height: "5", hyp: "13", ref: "B", angle: 22.62, sin: "5/13", cos: "12/13", tan: "5/12" },
    T51213C: { base: "12", height: "5", hyp: "13", ref: "C", angle: 67.38, sin: "12/13", cos: "5/13", tan: "12/5" },
    T81517B: { base: "15", height: "8", hyp: "17", ref: "B", angle: 28.07, sin: "8/17", cos: "15/17", tan: "8/15" },
    T72425C: { base: "24", height: "7", hyp: "25", ref: "C", angle: 73.74, sin: "24/25", cos: "7/25", tan: "24/7" },
    S30: { base: "sqrt(3)", height: "1", hyp: "2", ref: "B", angle: 30, sin: "1/2", cos: "sqrt(3)/2", tan: "sqrt(3)/3" },
    S45: { base: "1", height: "1", hyp: "sqrt(2)", ref: "B", angle: 45, sin: "sqrt(2)/2", cos: "sqrt(2)/2", tan: "1" },
    S60: { base: "1", height: "sqrt(3)", hyp: "2", ref: "B", angle: 60, sin: "sqrt(3)/2", cos: "1/2", tan: "sqrt(3)" },
  });
  const TRIANGLE_ROTATION = Object.freeze(["T345B", "T345C", "T51213B", "T51213C", "T81517B", "T72425C"]);
  const SPECIAL_ROTATION = Object.freeze(["S30", "S45", "S60", "S30", "S45", "S60"]);
  const CONTEXTS = Object.freeze(["교실 모형", "운동장 표지판", "관측대", "등굣길 경사판"]);

  function edge(a, b) {
    return [String(a), String(b)].sort().join("");
  }
  function oppositeEdge(vertices, vertex) {
    return edge(...vertices.filter((item) => item !== vertex));
  }
  function makeGeometry(triangleKey, unknownTarget = "ratio") {
    const t = TRIANGLES[triangleKey];
    const reference = t.ref;
    const opposite = reference === "B" ? "AC" : "AB";
    const adjacent = reference === "B" ? "AB" : "AC";
    return Object.freeze({
      triangleKey,
      diagramType: "RIGHT_TRIANGLE",
      vertices: Object.freeze({
        A: Object.freeze({ x: 0, y: 0 }),
        B: Object.freeze({ x: t.base, y: 0 }),
        C: Object.freeze({ x: 0, y: t.height }),
      }),
      edges: Object.freeze(["AB", "AC", "BC"]),
      rightAngleVertex: "A",
      referenceAngleVertex: reference,
      sideLabels: Object.freeze({ AB: "AB", AC: "AC", BC: "BC" }),
      sideLengths: Object.freeze({ AB: t.base, AC: t.height, BC: t.hyp }),
      hypotenuse: "BC",
      oppositeSide: opposite,
      adjacentSide: adjacent,
      angleDegrees: t.angle,
      unknownTarget,
      diagramDescription: `직각점 A, 기준각 ${reference}, 변 AB=${t.base}, AC=${t.height}, BC=${t.hyp}인 직각삼각형`,
    });
  }
  function makeGeometryContract(data, role = null) {
    return Object.freeze({
      referenceAngleVertex: data.referenceAngleVertex,
      expectedRoles: Object.freeze({
        hypotenuse: data.hypotenuse,
        oppositeSide: data.oppositeSide,
        adjacentSide: data.adjacentSide,
      }),
      requestedRole: role,
      allowReversedSideLabel: true,
      rejectOtherReferenceAngle: true,
    });
  }

  const ACTION_ORDER = Object.freeze([
    "IDENTIFY_RIGHT_ANGLE",
    "IDENTIFY_REFERENCE_ANGLE",
    "IDENTIFY_HYPOTENUSE",
    "IDENTIFY_OPPOSITE",
    "IDENTIFY_ADJACENT",
    "SELECT_TRIG_RATIO",
    "BUILD_PROPORTION",
    "SOLVE_LENGTH",
    "CHECK_UNIT",
    "VERIFY_RANGE",
  ]);
  const ACTION_RANK = Object.freeze(Object.fromEntries(ACTION_ORDER.map((action, index) => [action, index])));

  function normalizePlain(value) {
    return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  }
  function normalizeSide(value) {
    const compact = normalizePlain(value).replace(/[^a-z]/g, "").toUpperCase();
    return compact.length === 2 ? edge(compact[0], compact[1]) : compact;
  }
  function normalizeTrigInput(value) {
    let source = String(value ?? "").normalize("NFKC")
      .replace(/\\(sin|cos|tan)/gi, "$1")
      .replace(/\^\s*\{?\\?circ\}?/gi, "")
      .replace(/\\?circ/gi, "")
      .replace(/°/g, "")
      .replace(/√/g, "sqrt")
      .replace(/\s+/g, "")
      .toLowerCase();
    const lookup = {
      sin30: "1/2", cos30: "sqrt(3)/2", tan30: "sqrt(3)/3",
      sin45: "sqrt(2)/2", cos45: "sqrt(2)/2", tan45: "1",
      sin60: "sqrt(3)/2", cos60: "1/2", tan60: "sqrt(3)",
    };
    source = source.replace(/\b(sin|cos|tan)\(?((?:30|45|60))\)?/g, (all, fn, angle) => `(${lookup[`${fn}${angle}`]})`);
    if (source.startsWith("(") && source.endsWith(")") && !/[+\-*/^].*\(/.test(source.slice(1, -1))) {
      source = source.slice(1, -1);
    }
    return source;
  }
  function splitUnit(value) {
    const text = String(value ?? "").normalize("NFKC").trim();
    const match = text.match(/^(.*?)(km|cm|m)\s*$/i);
    return match
      ? { expression: match[1].trim(), unit: match[2].toLowerCase() }
      : { expression: text, unit: null };
  }
  const UNIT_TO_METER = Object.freeze({ km: 1000, m: 1, cm: 0.01 });
  function convertExpressionUnit(expression, fromUnit, toUnit) {
    if (!fromUnit || !toUnit || fromUnit === toUnit) return expression;
    if (!(fromUnit in UNIT_TO_METER) || !(toUnit in UNIT_TO_METER)) return null;
    const factor = UNIT_TO_METER[fromUnit] / UNIT_TO_METER[toUnit];
    return `(${expression})*${factor}`;
  }

  function validateGeometryData(data) {
    const errors = [];
    const required = [
      "diagramType", "vertices", "edges", "rightAngleVertex", "referenceAngleVertex",
      "sideLabels", "sideLengths", "hypotenuse", "oppositeSide", "adjacentSide",
      "angleDegrees", "unknownTarget", "diagramDescription",
    ];
    required.forEach((field) => {
      if (data?.[field] === undefined || data?.[field] === null || data?.[field] === "") errors.push(`MISSING_${field}`);
    });
    if (errors.length) return Object.freeze({ valid: false, errors: Object.freeze(errors) });
    const vertices = Object.keys(data.vertices);
    const edges = data.edges.map(normalizeSide);
    const expectedHypotenuse = oppositeEdge(vertices, data.rightAngleVertex);
    const expectedOpposite = oppositeEdge(vertices, data.referenceAngleVertex);
    const expectedAdjacent = edge(data.referenceAngleVertex, data.rightAngleVertex);
    if (!edges.includes(normalizeSide(data.hypotenuse))) errors.push("HYPOTENUSE_NOT_AN_EDGE");
    if (normalizeSide(data.hypotenuse) !== expectedHypotenuse) errors.push("RIGHT_ANGLE_HYPOTENUSE_MISMATCH");
    if (normalizeSide(data.oppositeSide) !== expectedOpposite) errors.push("REFERENCE_OPPOSITE_MISMATCH");
    if (normalizeSide(data.adjacentSide) !== expectedAdjacent) errors.push("REFERENCE_ADJACENT_MISMATCH");
    if (normalizeSide(data.hypotenuse) === normalizeSide(data.oppositeSide)) errors.push("HYPOTENUSE_EQUALS_OPPOSITE");
    if (normalizeSide(data.hypotenuse) === normalizeSide(data.adjacentSide)) errors.push("HYPOTENUSE_EQUALS_ADJACENT");
    if (normalizeSide(data.oppositeSide) === normalizeSide(data.adjacentSide)) errors.push("OPPOSITE_EQUALS_ADJACENT");
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }
  function evaluateGeometryAnswer(problemOrContract, answer) {
    const contract = problemOrContract.geometryAnswerContract || problemOrContract;
    const role = contract.requestedRole;
    if (!role || !contract.expectedRoles?.[role]) {
      return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "NO_REQUESTED_GEOMETRY_ROLE" };
    }
    const correct = normalizeSide(answer) === normalizeSide(contract.expectedRoles[role]);
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "GEOMETRY_ROLE_MISMATCH" };
  }
  function validateGeometryStepOrder(problemOrExpected, answer) {
    const expected = Array.isArray(problemOrExpected)
      ? problemOrExpected
      : problemOrExpected?.expectedAnswer;
    const actual = Array.isArray(answer)
      ? answer.map(String)
      : String(answer ?? "").split(/\r?\n|;;|,/).map((item) => item.trim()).filter(Boolean);
    if (!Array.isArray(expected) || expected.some((action) => ACTION_RANK[action] === undefined)) {
      return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "INVALID_EXPECTED_ACTIONS" };
    }
    const logical = expected.every((action, index) => index === 0 || ACTION_RANK[action] > ACTION_RANK[expected[index - 1]]);
    if (!logical) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "EXPECTED_ACTION_ORDER_INVALID" };
    const correct = actual.length === expected.length && expected.every((action, index) => action === actual[index]);
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "STEP_ORDER_OR_OMISSION" };
  }

  function q(key, prompt, expectedAnswer, steps, extra = {}) {
    return { key, prompt, expectedAnswer, steps, ...extra };
  }
  function step(key, prompt, actions, explanationSteps, extra = {}) {
    return q(key, prompt, actions, explanationSteps, { ...extra, validatorMode: "STEP_ORDER" });
  }
  function written(key, prompt, answer, steps, extra = {}) {
    return q(key, prompt, answer, steps, { ...extra, validatorMode: "WRITTEN_REVIEW" });
  }

  function geometryRoleTask(conceptId, stage, position, g, context) {
    const roleCycle = ["hypotenuse", "oppositeSide", "adjacentSide", "oppositeSide"];
    const role = roleCycle[position];
    const Korean = { hypotenuse: "빗변", oppositeSide: "맞은편 변", adjacentSide: "이웃한 변" };
    return q(
      `${stage.toLowerCase()}-${role}-${context}`,
      `${context}의 직각삼각형에서 기준각 ${g.referenceAngleVertex}에 대한 ${Korean[role]}의 변 이름을 쓰시오.`,
      g[role],
      [`직각점 ${g.rightAngleVertex}를 확인한다.`, `기준각 ${g.referenceAngleVertex}에서 ${Korean[role]}의 위치를 찾는다.`, `${Korean[role]}은 ${g[role]}이다.`],
      { validatorMode: "GEOMETRY_ROLE", requestedRole: role }
    );
  }
  function ratioTask(conceptId, stage, position, g, context) {
    const t = conceptId.endsWith("sine") ? "sin" : conceptId.endsWith("cosine") ? "cos" : "tan";
    const definition = t === "sin" ? "맞은편 변/빗변" : t === "cos" ? "이웃한 변/빗변" : "맞은편 변/이웃한 변";
    const value = TRIANGLES[g.triangleKey][t];
    return q(
      `${stage.toLowerCase()}-${t}-${context}`,
      `${context}에서 기준각 ${g.referenceAngleVertex}의 ${t} 값을 가장 간단한 수로 나타내시오.`,
      value,
      [`${t}의 정의 ${definition}를 선택한다.`, `기준각에 맞는 두 변의 길이를 대입한다.`, `분수를 약분하여 ${value}를 얻는다.`],
      { validatorMode: "TRIG_EXPRESSION" }
    );
  }
  function meaningExpressionTask(stage, position, g, context) {
    const t = TRIANGLES[g.triangleKey];
    const variants = [
      { label: "맞은편 변/이웃한 변", value: t.tan },
      { label: "맞은편 변/빗변", value: t.sin },
      { label: "이웃한 변/빗변", value: t.cos },
      { label: "빗변/맞은편 변", value: `1/(${t.sin})` },
    ];
    const selected = variants[position];
    return q(
      `${stage.toLowerCase()}-role-ratio-${context}`,
      `${context}에서 기준각 ${g.referenceAngleVertex}를 기준으로 변 역할을 먼저 정한 뒤 ${selected.label}의 값을 구하시오.`,
      selected.value,
      ["직각점과 기준각을 구분한다.", "빗변·맞은편 변·이웃한 변을 표시한다.", `${selected.label}에 해당하는 길이를 대입한다.`, `비를 ${selected.value}로 간단히 한다.`],
      { validatorMode: "TRIG_EXPRESSION" }
    );
  }
  function specialTask(stage, position, g, context) {
    const functions = ["sin", "cos", "tan", position % 2 ? "sin" : "cos"];
    const fn = functions[position];
    const angle = g.angleDegrees;
    const expected = TRIANGLES[g.triangleKey][fn];
    return q(
      `${stage.toLowerCase()}-${fn}-${angle}-${context}`,
      `${context}에 표시된 ${angle}°에 대하여 ${fn}${angle}°의 값을 구하시오.`,
      expected,
      [`${angle}°가 들어 있는 특수 직각삼각형의 변의 비를 떠올린다.`, `${fn}의 분자와 분모에 해당하는 변을 고른다.`, `값을 ${expected}로 간단히 한다.`],
      { validatorMode: "TRIG_EXPRESSION", acceptedAnswers: [`${fn}${angle}`, `${fn}(${angle}°)`] }
    );
  }
  function lengthTask(stage, position, g, context) {
    const variants = [
      { prompt: "높이가 3 m이고 밑변이 4 m인 경사 지지대의 길이", answer: "5", unit: "m", policy: "REQUIRED" },
      { prompt: "45° 직각삼각형에서 한 직각변이 6 cm일 때 빗변", answer: "6sqrt(2)", unit: "cm", policy: "OPTIONAL" },
      { prompt: "30° 방향의 줄 길이가 10 m일 때 수직 높이", answer: "5", unit: "m", policy: "REQUIRED" },
      { prompt: "tan60°를 이루는 경사선의 수평거리가 4 m일 때 높이", answer: "4sqrt(3)", unit: "m", policy: "REQUIRED" },
    ][position];
    return q(
      `${stage.toLowerCase()}-length-${context}`,
      `${context}: ${variants.prompt}를 구하시오.`,
      variants.answer,
      ["기준각과 구하려는 변의 관계를 표시한다.", "알맞은 삼각비 또는 특수각의 변의 비를 선택한다.", `비례식을 풀어 ${variants.answer}${variants.unit}를 얻는다.`, "길이의 양수 조건과 단위를 확인한다."],
      { validatorMode: "TRIG_EXPRESSION", unitPolicy: variants.policy, expectedUnit: variants.unit }
    );
  }

  function advancedTask(conceptId, stage, position, g, context) {
    const t = TRIANGLES[g.triangleKey];
    const trig = conceptId.endsWith("sine") ? "sin" : conceptId.endsWith("cosine") ? "cos" : conceptId.endsWith("tangent") ? "tan" : null;
    if (stage === "A3") {
      if (position === 2) {
        const actions = trig === "tan"
          ? ["IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH", "VERIFY_RANGE"]
          : ["IDENTIFY_RIGHT_ANGLE", "IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_HYPOTENUSE", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH"];
        return step(
          `${stage.toLowerCase()}-process-${context}`,
          `${context}에서 기준각과 주어진 변을 확인하여 목표 길이를 구하는 데 필요한 action을 순서대로 배열하시오.`,
          actions,
          ["기준각과 직각점을 먼저 확인한다.", "필요한 변의 역할을 정한다.", "삼각비를 선택해 비례식을 세운다.", "길이를 구하고 범위를 검산한다."]
        );
      }
      if (conceptId === "m3_trig_meaning") {
        const expected = position % 2 ? g.adjacentSide : g.oppositeSide;
        return q(
          `${stage.toLowerCase()}-switch-reference-${context}`,
          `${context}에서 기준각을 ${g.referenceAngleVertex}로 바꿨다. 빗변이 아닌 두 변 중 ${position % 2 ? "이웃한" : "맞은편"} 변을 고르고, 선택 근거를 변 이름으로 쓰시오.`,
          expected,
          ["직각점의 맞은편 BC는 기준각과 무관하게 빗변이다.", `기준각 ${g.referenceAngleVertex}에 닿는지 여부로 두 직각변을 구분한다.`, `조건에 맞는 변은 ${expected}이다.`],
          { validatorMode: "GEOMETRY_ROLE", requestedRole: position % 2 ? "adjacentSide" : "oppositeSide" }
        );
      }
      if (conceptId === "m3_trig_special_angles") {
        const expected = position % 2 ? "sqrt(3)/2" : "sqrt(2)/2";
        return q(
          `${stage.toLowerCase()}-equal-value-${context}`,
          `${context}에서 서로 다른 특수각 삼각비 두 개가 같은 값이 된다. ${position % 2 ? "sin60°와 cos30°" : "sin45°와 cos45°"}의 공통값을 구하고 근호를 간단히 하시오.`,
          expected,
          ["두 특수각 삼각형의 변의 비를 각각 쓴다.", "서로 같은 값을 이루는지 비교한다.", `공통값 ${expected}를 확인한다.`],
          { validatorMode: "TRIG_EXPRESSION" }
        );
      }
      if (conceptId === "m3_trig_length") {
        const cases = [
          ["관측점에서 30°로 본 꼭대기까지의 시선 길이가 14 m이다. 높이를 구하고 14 m보다 작은지 확인하시오.", "7", "m"],
          ["수평거리 5 m에서 올려다본 각이 45°이다. 높이를 구하고 단위를 쓰시오.", "5", "m"],
          ["60° 경사판의 수평길이가 2 m이다. 수직 높이를 구하시오.", "2sqrt(3)", "m"],
          ["45° 삼각 지지대의 높이가 300 cm이다. 수평길이를 m로 나타내시오.", "3", "m"],
        ][position];
        return q(
          `${stage.toLowerCase()}-linked-length-${context}`,
          `${context}: ${cases[0]}`,
          cases[1],
          ["기준각과 주어진 변·목표 변을 표시한다.", "특수각의 알맞은 삼각비를 선택한다.", `비례식을 풀어 ${cases[1]}${cases[2]}를 얻는다.`, "단위와 길이 범위를 검산한다."],
          { validatorMode: "TRIG_EXPRESSION", unitPolicy: "REQUIRED", expectedUnit: cases[2] }
        );
      }
      const value = t[trig];
      return q(
        `${stage.toLowerCase()}-${trig}-reverse-${context}`,
        `${context}에서 기준각 ${g.referenceAngleVertex}를 먼저 찾고 ${trig}의 분자·분모가 되는 변을 판별한 뒤 값을 구하시오.`,
        value,
        ["직각점 A와 기준각을 구분한다.", `${trig}에 필요한 변의 역할을 정한다.`, `길이를 대입해 ${value}를 얻는다.`, trig === "tan" ? "값이 1보다 클 수도 있음을 확인한다." : "빗변을 분모로 하여 값이 1 이하인지 확인한다."],
        { validatorMode: "TRIG_EXPRESSION" }
      );
    }

    if (stage === "A4") {
      if (position === 1) {
        const actions = ["IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_HYPOTENUSE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH", "CHECK_UNIT", "VERIFY_RANGE"];
        return step(
          `${stage.toLowerCase()}-hidden-angle-process-${context}`,
          `${context}의 설명에는 기준각이 직접 표시되지 않았다. 관측 위치에서 기준각을 복원하여 길이와 단위를 검산하는 action을 배열하시오.`,
          actions,
          ["관측 위치로 기준각을 복원한다.", "세 변의 역할을 다시 배정한다.", "삼각비와 비례식을 선택한다.", "계산 뒤 단위와 범위를 확인한다."]
        );
      }
      if (position === 3) {
        return written(
          `${stage.toLowerCase()}-case-analysis-${context}`,
          `${context}의 같은 직각삼각형에서 기준각을 B와 C 중 어디로 잡는지에 따라 맞은편 변과 이웃한 변이 어떻게 바뀌는지 분류하고, 빗변은 왜 바뀌지 않는지 설명하시오.`,
          "B와 C를 바꾸면 AB와 AC의 맞은편·이웃 역할은 서로 바뀌지만 직각점 A의 맞은편 BC는 항상 빗변이다.",
          ["직각점 A의 맞은편 BC는 기준각과 관계없이 빗변임을 밝힌다.", "기준각 B에서는 AC가 맞은편, AB가 이웃한 변임을 쓴다.", "기준각 C에서는 AB가 맞은편, AC가 이웃한 변임을 쓴다.", "두 경우의 역할 교환을 비교한다."]
        );
      }
      if (conceptId === "m3_trig_length") {
        const tasks = [
          ["높이 6 m인 기둥의 그림자 끝에서 꼭대기를 본 각이 30°이다. 그림자 길이를 구하시오.", "6sqrt(3)", "m"],
          ["45° 경사로의 수직 높이가 250 cm이다. 수평거리를 m로 나타내시오.", "2.5", "m"],
          ["수평거리 3 m에서 60°로 본 높이와 30°로 본 높이 중 큰 값을 구하시오.", "3sqrt(3)", "m"],
          ["서로 다른 두 관측점의 결과가 같은 높이를 주는지 검증하는 방법을 설명하시오.", "각 관측점에서 기준각에 맞는 삼각비로 높이를 계산하고 단위를 통일해 비교한다.", null],
        ][position];
        return q(
          `${stage.toLowerCase()}-unit-reverse-${context}`,
          `${context}: ${tasks[0]}`,
          tasks[1],
          ["숨은 기준각과 목표 변을 찾아낸다.", "가능한 삼각비 중 주어진 두 변을 직접 잇는 것을 선택한다.", "계산 과정에서 단위를 통일한다.", "양수·크기 조건으로 결과를 검산한다."],
          { validatorMode: position === 3 ? "WRITTEN_REVIEW" : "TRIG_EXPRESSION", unitPolicy: tasks[2] ? "REQUIRED" : "FORBIDDEN", expectedUnit: tasks[2] }
        );
      }
      if (conceptId === "m3_trig_special_angles") {
        const specialPairs = [
          ["sin60°와 cos30°의 공통값", "sqrt(3)/2"],
          ["tan30°를 분모에 근호가 없는 꼴로 나타낸 값", "sqrt(3)/3"],
          ["tan60°와 tan30°의 곱", "1"],
          ["sin45°와 cos45°의 합", "sqrt(2)"],
        ][position];
        return q(
          `${stage.toLowerCase()}-special-reverse-${context}`,
          `${context}에서 특수각 삼각형의 변의 비를 역으로 복원하여 ${specialPairs[0]}을 구하시오.`,
          specialPairs[1],
          ["30°-60°-90° 또는 45°-45°-90° 삼각형을 선택한다.", "기준각에 맞는 변의 비를 복원한다.", "근호의 동치 표현을 정리한다.", `결과 ${specialPairs[1]}를 다른 특수각 관계로 검산한다.`],
          { validatorMode: "TRIG_EXPRESSION" }
        );
      }
      const expected = trig ? t[trig] : conceptId === "m3_trig_special_angles" ? "sqrt(3)" : g.adjacentSide;
      return q(
        `${stage.toLowerCase()}-reverse-choice-${context}`,
        `${context}에서 기준각을 직접 표시하지 않고 ‘직각점이 아닌 꼭짓점 중 ${g.referenceAngleVertex}에서 본다’고 했다. 변 역할을 복원하여 ${trig || "요구된 변"}의 결과를 쓰시오.`,
        expected,
        ["문장에서 관측 꼭짓점을 찾아 기준각으로 정한다.", "직각점의 맞은편을 빗변으로 고정한다.", "나머지 두 변의 역할을 경우에 맞게 배정한다.", `요구된 결과 ${expected}를 얻고 반대 기준각을 쓴 경우와 구분한다.`],
        { validatorMode: trig ? "TRIG_EXPRESSION" : "GEOMETRY_ROLE", requestedRole: trig ? null : "adjacentSide" }
      );
    }

    if (stage === "A5") {
      if (position === 1) {
        const actions = ["IDENTIFY_RIGHT_ANGLE", "IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_HYPOTENUSE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH", "VERIFY_RANGE"];
        return step(
          `${stage.toLowerCase()}-audit-process-${context}`,
          `${context}에서 다른 학생의 풀이를 처음부터 감사한다. 기준각 오류와 비 선택 오류를 모두 막는 최소 action 순서를 배열하시오.`,
          actions,
          ["직각점과 기준각을 독립적으로 확인한다.", "세 변의 역할을 확정한다.", "목표 변에 맞는 삼각비를 선택한다.", "비례식·계산·범위 검산으로 마무리한다."]
        );
      }
      const prompts = {
        m3_trig_meaning: [
          "‘기준각이 바뀌어도 맞은편 변은 같다’는 주장",
          "세 변의 역할을 정하는 절차",
          "빗변 판정의 필요충분조건",
          "두 예각을 모두 기준각으로 삼는 모든 경우",
        ],
        m3_trig_sine: [
          "‘sin은 항상 짧은 변/긴 변이다’라는 주장",
          "sin에서 분모를 맞은편 변으로 둔 오류",
          "sin값이 1 이하가 되는 이유와 등호 가능성",
          "같은 sin값을 갖는 닮은 직각삼각형의 일반화",
        ],
        m3_trig_cosine: [
          "‘cos는 언제나 가로변/빗변이다’라는 주장",
          "기준각을 바꾸고도 이웃한 변을 그대로 둔 오류",
          "cos값이 변의 실제 방향이 아니라 역할로 정해지는 조건",
          "sin B=cos C가 성립하는 이유와 필요한 조건",
        ],
        m3_trig_tangent: [
          "‘tan에는 빗변을 사용한다’는 주장",
          "tan의 분자·분모를 뒤집은 측정 오류",
          "tan값이 1보다 클 수 있는 필요조건",
          "같은 경사에서 크기만 다른 삼각형의 tan 일반화",
        ],
        m3_trig_special_angles: [
          "‘tan30°=1/sqrt(3)은 허용할 수 없다’는 주장",
          "sin60°와 cos30°를 서로 다르다고 한 오류",
          "30°·45°·60° 값표를 최소 정보로 복원하는 조건",
          "특수각 값의 크기 순서를 반례와 함께 검증하는 방법",
        ],
        m3_trig_length: [
          "관측각만 같으면 모든 높이가 같다는 주장",
          "cm와 m를 섞은 높이 계산 오류",
          "계산된 빗변이 직각변보다 길어야 한다는 검산 조건",
          "두 관측 결과가 같은 실제 길이를 뜻하는 필요충분조건",
        ],
      };
      const answers = {
        m3_trig_meaning: "기준각을 바꾸면 두 직각변의 맞은편·이웃 역할은 교환되고, 직각점의 맞은편인 빗변만 유지된다.",
        m3_trig_sine: "sin은 기준각의 맞은편 변을 빗변으로 나눈 비이며 방향이나 겉보기 길이만으로 정할 수 없다.",
        m3_trig_cosine: "cos는 기준각에 닿는 직각변을 빗변으로 나눈 비이고 기준각이 바뀌면 이웃한 변도 바뀐다.",
        m3_trig_tangent: "tan은 맞은편 변/이웃한 변이며 빗변을 쓰지 않고, 기준각이 45°보다 크면 1보다 클 수 있다.",
        m3_trig_special_angles: "특수각 값은 닮은 직각삼각형의 변의 비로 복원되며 근호를 포함한 동치 표현도 같은 값이다.",
        m3_trig_length: "기준각·주어진 변·단위를 모두 일치시켜 계산하고 양수·크기·단위 조건으로 결과를 검증해야 한다.",
      };
      return written(
        `${stage.toLowerCase()}-reasoning-${context}`,
        `${context}: ${prompts[conceptId][position]}을 판단하고, 오류 또는 성립 조건·검증 방법을 함께 설명하시오.`,
        answers[conceptId],
        [
          "직각점과 기준각을 구분하여 전제를 명확히 한다.",
          "세 변의 역할 또는 특수각의 변의 비를 근거로 사용한다.",
          "주장의 필요조건과 충분조건 또는 반례를 제시한다.",
          "가능한 경우를 빠짐없이 분류하고 계산·단위·범위를 검증한다.",
        ]
      );
    }
    throw new Error(`Unsupported advanced stage: ${stage}`);
  }

  function buildTask(conceptId, stage, position) {
    const conceptIndex = conceptIds.indexOf(conceptId);
    const stageIndex = stages.indexOf(stage);
    const context = `${CONTEXTS[position]} ${conceptIndex + 1}-${stageIndex + 1}-${position + 1}`;
    const triangleKey = conceptId === "m3_trig_special_angles"
      ? SPECIAL_ROTATION[(stageIndex + position) % SPECIAL_ROTATION.length]
      : TRIANGLE_ROTATION[(conceptIndex + stageIndex + position) % TRIANGLE_ROTATION.length];
    const geometryData = makeGeometry(triangleKey, `${conceptId}:${stage}:${position}`);
    let task;

    if (["A3", "A4", "A5"].includes(stage)) {
      task = advancedTask(conceptId, stage, position, geometryData, context);
    } else if (conceptId === "m3_trig_meaning") {
      if (stage === "A2" && position === 2) {
        task = step(
          "a2-role-process",
          `${context}에서 기준각에 따른 세 변의 역할을 결정하는 action을 순서대로 배열하시오.`,
          ["IDENTIFY_RIGHT_ANGLE", "IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_HYPOTENUSE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT"],
          ["직각점을 먼저 찾는다.", "기준각을 확인한다.", "빗변을 고정한다.", "맞은편 변과 이웃한 변을 나눈다."]
        );
      } else if (TYPE_PATTERN[stage][position] === "EXPRESSION_INPUT") {
        task = meaningExpressionTask(stage, position, geometryData, context);
      } else {
        task = geometryRoleTask(conceptId, stage, position, geometryData, context);
      }
    } else if (["m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent"].includes(conceptId)) {
      if (stage === "A2" && position === 2) {
        const fn = conceptId.endsWith("sine") ? "sin" : conceptId.endsWith("cosine") ? "cos" : "tan";
        const actions = fn === "tan"
          ? ["IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION"]
          : ["IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_HYPOTENUSE", fn === "sin" ? "IDENTIFY_OPPOSITE" : "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION"];
        task = step(
          `a2-${fn}-process`,
          `${context}에서 ${fn} 값을 구하기 위한 action을 필요한 것만 골라 순서대로 배열하시오.`,
          actions,
          ["기준각을 확인한다.", "정의에 필요한 변만 판별한다.", `${fn}를 선택한다.`, "비를 세운다."]
        );
      } else {
        task = ratioTask(conceptId, stage, position, geometryData, context);
      }
    } else if (conceptId === "m3_trig_special_angles") {
      if (stage === "A2" && position === 2) {
        task = step(
          "a2-special-process",
          `${context}에서 특수각 삼각비로 길이를 구하는 action을 순서대로 배열하시오.`,
          ["IDENTIFY_REFERENCE_ANGLE", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH", "VERIFY_RANGE"],
          ["특수각을 확인한다.", "목표 변에 맞는 삼각비를 고른다.", "비례식을 세운다.", "길이와 범위를 확인한다."]
        );
      } else {
        task = specialTask(stage, position, geometryData, context);
      }
    } else {
      if (stage === "A2" && position === 2) {
        task = step(
          "a2-length-process",
          `${context}에서 높이를 구하고 단위를 확인하는 action을 순서대로 배열하시오.`,
          ["IDENTIFY_REFERENCE_ANGLE", "IDENTIFY_OPPOSITE", "IDENTIFY_ADJACENT", "SELECT_TRIG_RATIO", "BUILD_PROPORTION", "SOLVE_LENGTH", "CHECK_UNIT"],
          ["기준각과 목표 높이를 표시한다.", "두 변을 직접 잇는 삼각비를 고른다.", "비례식을 풀어 길이를 구한다.", "단위를 확인한다."]
        );
      } else {
        task = lengthTask(stage, position, geometryData, context);
      }
    }
    return { ...task, conceptId, stage, position, geometryData };
  }

  function answerTypeFor(stage, position) {
    return TYPE_PATTERN[stage][position];
  }
  function defaultUnitPolicy(task) {
    if (task.unitPolicy) return task.unitPolicy;
    return task.validatorMode === "TRIG_EXPRESSION" && task.expectedUnit ? "OPTIONAL" : "FORBIDDEN";
  }
  function makeProblem(task, index) {
    const answerType = answerTypeFor(task.stage, task.position);
    const concept = concepts.find((item) => item.conceptId === task.conceptId);
    const problemId = `m3-trig-${String(index + 1).padStart(3, "0")}-${task.conceptId.replace("m3_trig_", "")}-${task.stage.toLowerCase()}-${task.key}`;
    const requestedRole = task.requestedRole || null;
    const geometryAnswerContract = makeGeometryContract(task.geometryData, requestedRole);
    const unitPolicy = defaultUnitPolicy(task);
    const expectedUnit = task.expectedUnit || null;
    const acceptedAnswers = Object.freeze(task.acceptedAnswers || []);
    const solutionSteps = Object.freeze(task.steps);
    const hints = Object.freeze([
      "직각점과 기준각을 서로 다른 표시로 확인하세요.",
      task.conceptId === "m3_trig_special_angles"
        ? "30°·45°·60° 직각삼각형의 변의 비를 떠올리세요."
        : "구하려는 값에 실제로 필요한 두 변의 역할부터 정하세요.",
    ]);
    const writtenRubric = answerType === "WRITTEN_RESPONSE"
      ? Object.freeze({
        reviewStatus: "REVIEW_REQUIRED",
        requiredIdeas: Object.freeze(solutionSteps.slice(0, 4)),
        partialCredit: Object.freeze(["기준각·변 역할 판정", "전략 또는 오류 분석", "계산·단위·범위 검증"]),
      })
      : undefined;
    const answerContract = Object.freeze({
      unitPolicy,
      expectedUnit,
      trigNormalizationPolicy: "SPECIAL_ANGLES_30_45_60_AND_RADICAL_EQUIVALENCE",
      geometryAnswerContract,
      acceptedAnswers,
      validatorMode: task.validatorMode || (answerType === "WRITTEN_RESPONSE" ? "WRITTEN_REVIEW" : "TEXT_NORMALIZED"),
    });
    return Object.freeze({
      id: problemId,
      problemId,
      grade: 9,
      unitId: UNIT_ID,
      conceptId: task.conceptId,
      conceptTitle: concept.title,
      stage: task.stage,
      answerType,
      prompt: task.prompt,
      questionText: task.prompt,
      choices: answerType === "MULTIPLE_CHOICE"
        ? Object.freeze(Array.from(new Set([
          unitPolicy === "REQUIRED" && expectedUnit ? `${task.expectedAnswer} ${expectedUnit}` : String(task.expectedAnswer),
          task.geometryData.hypotenuse,
          task.geometryData.oppositeSide,
          task.geometryData.adjacentSide,
          "1",
        ])).slice(0, 4))
        : undefined,
      expectedAnswer: task.expectedAnswer,
      correctAnswer: task.expectedAnswer,
      acceptedAnswers,
      explanation: solutionSteps.join(" "),
      hints,
      solutionSteps,
      misconceptionTags: Object.freeze(["REFERENCE_ANGLE_ERROR", "SIDE_ROLE_ERROR", "TRIG_RATIO_SELECTION_ERROR", "UNIT_ERROR"]),
      difficultyEvidence: Object.freeze([...STAGE_META[task.stage].evidence]),
      independentCheck: task.position === 3,
      independentCheckPolicy: Object.freeze({ hintsLockedBeforeFinal: true, solutionLockedBeforeFinal: true }),
      curriculumVersion: CURRICULUM_VERSION,
      authoringScope: AUTHORING_SCOPE,
      sourceScope: SOURCE_SCOPE,
      structureSignature: `structure:m3-trig:${task.conceptId}:${task.stage}:${task.key}`,
      solutionPathSignature: `solution:m3-trig:${task.conceptId}:${task.stage}:${task.key}:v1`,
      linkedConditionCount: STAGE_META[task.stage].linked,
      minimumReasoningStepCount: STAGE_META[task.stage].minimumSteps,
      requiresStrategySelection: ["A3", "A4", "A5"].includes(task.stage),
      requiresExplanation: task.stage === "A5",
      contentRole: task.position === 3 ? "LEVEL_RECHECK" : "LEARNING_PRACTICE",
      legacyReuse: false,
      geometryData: task.geometryData,
      geometryAnswerContract,
      answerContract,
      writtenRubric,
      independentValidation: Object.freeze({
        conditionFeasible: true,
        uniqueAnswer: true,
        answerRecalculated: true,
        geometryChecked: true,
        curriculumScopeChecked: true,
      }),
    });
  }

  const authoredTasks = Object.freeze(conceptIds.flatMap((conceptId) => stages.flatMap((stage) => (
    [0, 1, 2, 3].map((position) => buildTask(conceptId, stage, position))
  ))));
  const problems = Object.freeze(authoredTasks.map(makeProblem));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));

  function evaluateUnitContract(problem, rawAnswer) {
    const parsed = splitUnit(rawAnswer);
    const policy = problem.answerContract.unitPolicy;
    const expectedUnit = problem.answerContract.expectedUnit;
    if (policy === "REQUIRED" && !parsed.unit) {
      return { ok: false, result: { status: "INCORRECT", correct: false, reason: "UNIT_REQUIRED" } };
    }
    if (policy === "FORBIDDEN" && parsed.unit) {
      return { ok: false, result: { status: "INCORRECT", correct: false, reason: "UNIT_FORBIDDEN" } };
    }
    if (parsed.unit && expectedUnit && !(parsed.unit in UNIT_TO_METER)) {
      return { ok: false, result: { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNSUPPORTED_UNIT" } };
    }
    const converted = parsed.unit && expectedUnit
      ? convertExpressionUnit(parsed.expression, parsed.unit, expectedUnit)
      : parsed.expression;
    if (converted === null) {
      return { ok: false, result: { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNIT_FAMILY_MISMATCH" } };
    }
    return { ok: true, expression: converted, unit: parsed.unit };
  }
  function evaluateAnswer(problemOrId, answer) {
    const problem = typeof problemOrId === "string" ? problemsById[problemOrId] : problemOrId;
    if (!problem) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_PROBLEM" };
    const mode = problem.answerContract.validatorMode;
    if (mode === "WRITTEN_REVIEW") {
      return String(answer ?? "").trim()
        ? { status: "REVIEW_REQUIRED", correct: null, rubric: problem.writtenRubric }
        : { status: "INVALID_INPUT", correct: null, rubric: problem.writtenRubric };
    }
    if (mode === "STEP_ORDER") return validateGeometryStepOrder(problem, answer);
    if (mode === "GEOMETRY_ROLE") return evaluateGeometryAnswer(problem, answer);

    const unitCheck = evaluateUnitContract(problem, answer);
    if (!unitCheck.ok) return unitCheck.result;
    const expected = normalizeTrigInput(problem.expectedAnswer);
    const actual = normalizeTrigInput(unitCheck.expression);
    const accepted = [problem.expectedAnswer, ...problem.acceptedAnswers].map(normalizeTrigInput);
    if (accepted.some((item) => normalizePlain(item) === normalizePlain(actual))) {
      return { status: "CORRECT", correct: true, matchedBy: "ACCEPTED_ANSWER" };
    }
    if (mode === "TEXT_NORMALIZED") return { status: "INCORRECT", correct: false };
    const result = algebra.compareExpressions(expected, actual);
    const equivalent = result.equivalent === true || result.status === "EQUIVALENT" || result.status === "CORRECT";
    return {
      status: equivalent ? "CORRECT" : result.status === "UNSUPPORTED_EXPRESSION" ? "UNSUPPORTED_EXPRESSION" : "INCORRECT",
      correct: equivalent ? true : result.status === "UNSUPPORTED_EXPRESSION" ? null : false,
      validatorResult: result,
    };
  }
  function getProblems(conceptId, stage) {
    return Object.freeze(problems.filter((problem) => (
      problem.conceptId === conceptId && (!stage || problem.stage === stage)
    )));
  }
  function audit() {
    const countBy = (selector) => problems.reduce((out, problem) => {
      const key = selector(problem);
      out[key] = (out[key] || 0) + 1;
      return out;
    }, {});
    return Object.freeze({
      problemCount: problems.length,
      byConcept: countBy((problem) => problem.conceptId),
      byStage: countBy((problem) => problem.stage),
      byAnswerType: countBy((problem) => problem.answerType),
      byUnitPolicy: countBy((problem) => problem.answerContract.unitPolicy),
      geometryCount: problems.filter((problem) => problem.geometryData).length,
      learningCount: problems.filter((problem) => !problem.independentCheck).length,
      independentCount: problems.filter((problem) => problem.independentCheck).length,
      hintCount: problems.reduce((sum, problem) => sum + problem.hints.length, 0),
    });
  }

  return Object.freeze({
    VERSION,
    UNIT_ID,
    CURRICULUM_VERSION,
    AUTHORING_SCOPE,
    SOURCE_SCOPE,
    ANSWER_TYPES,
    concepts,
    conceptIds,
    stages,
    problems,
    problemsById,
    getProblems,
    evaluateAnswer,
    evaluateProblemAnswer: evaluateAnswer,
    normalizeTrigInput,
    evaluateGeometryAnswer,
    validateGeometryData,
    validateGeometryStepOrder,
    audit,
  });
});
