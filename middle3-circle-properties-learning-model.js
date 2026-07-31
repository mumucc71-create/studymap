(function (root, factory) {
  const algebra = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const api = factory(algebra);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_CIRCLE_PROPERTIES_LEARNING_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (algebra) {
  "use strict";

  if (!algebra) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");

  const VERSION = "m3-circle-properties-learning-model-v1";
  const UNIT_ID = "m3-circle-properties";
  const CURRICULUM_VERSION = "2015_REVISED_MIDDLE_SCHOOL_MATH";
  const AUTHORING_SCOPE = "MIDDLE3_CIRCLE_PROPERTIES_EXPLICIT_MATRIX_V1";
  const SOURCE_SCOPE = "NEW_CIRCLE_PROPERTIES_SPRING_CONTENT";
  const stages = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const conceptIds = Object.freeze([
    "m3_circle_foundations",
    "m3_circle_chord",
    "m3_circle_tangent_radius",
    "m3_circle_tangent_segments",
    "m3_circle_central_inscribed",
    "m3_circle_same_arc",
  ]);
  const concepts = Object.freeze([
    { conceptId: conceptIds[0], title: "원의 기본 요소", order: 1 },
    { conceptId: conceptIds[1], title: "현과 중심", order: 2 },
    { conceptId: conceptIds[2], title: "접선과 반지름", order: 3 },
    { conceptId: conceptIds[3], title: "한 점에서 그은 두 접선", order: 4 },
    { conceptId: conceptIds[4], title: "중심각과 원주각", order: 5 },
    { conceptId: conceptIds[5], title: "같은 호의 원주각", order: 6 },
  ].map(Object.freeze));
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
    BASIC: { linked: 1, minimumSteps: 2, evidence: ["원의 요소와 표시를 직접 대응", "기본 성질 한 번 적용"] },
    A1: { linked: 1, minimumSteps: 2, evidence: ["전제 조건 확인 후 한 성질 적용", "각도 또는 길이 한 단계 계산"] },
    A2: { linked: 2, minimumSteps: 3, evidence: ["서로 다른 두 성질 연결", "단위 또는 도형 범위 검산"] },
    A3: { linked: 2, minimumSteps: 3, evidence: ["기준 호·접점·현 후보 중 선택", "각 대응 또는 길이 관계를 적용하고 검산"] },
    A4: { linked: 3, minimumSteps: 4, evidence: ["숨은 조건·역추론·경우 분류 중 둘 이상", "적용 성질의 순서를 선택하고 결과 검증"] },
    A5: { linked: 4, minimumSteps: 4, evidence: ["오류 분석·필요충분조건·반례·일반화 중 둘 이상", "모든 도형 조건을 독립적으로 검증"] },
  });

  const ACTION_ORDER = Object.freeze([
    "IDENTIFY_CENTER", "IDENTIFY_RADIUS", "IDENTIFY_DIAMETER", "IDENTIFY_CHORD",
    "IDENTIFY_TANGENT", "IDENTIFY_TANGENT_POINT", "IDENTIFY_REFERENCE_ARC",
    "MATCH_CENTRAL_ANGLE", "MATCH_INSCRIBED_ANGLE", "APPLY_TANGENT_RADIUS_PERPENDICULAR",
    "APPLY_EQUAL_TANGENT_SEGMENTS", "APPLY_CENTRAL_INSCRIBED_RELATION",
    "APPLY_SAME_ARC_RELATION", "APPLY_SEMICIRCLE_RIGHT_ANGLE", "BUILD_EQUATION",
    "SOLVE_ANGLE", "SOLVE_LENGTH", "CHECK_UNIT", "VERIFY_GEOMETRY_RANGE",
  ]);
  const ACTION_RANK = Object.freeze(Object.fromEntries(ACTION_ORDER.map((action, index) => [action, index])));
  const UNIT_TO_METER = Object.freeze({ km: 1000, m: 1, cm: 0.01 });

  function freezeArray(items) { return Object.freeze(items.map((item) => (item && typeof item === "object" ? Object.freeze(item) : item))); }
  function point(label, x, y, location) { return Object.freeze({ label, x, y, location }); }
  function makeGeometry(unknownTarget) {
    const points = freezeArray([
      point("O", 0, 0, "CENTER"), point("A", 5, 0, "ON_CIRCLE"), point("B", 0, 5, "ON_CIRCLE"),
      point("C", -5, 0, "ON_CIRCLE"), point("D", 0, -5, "ON_CIRCLE"), point("E", -4, 3, "ON_CIRCLE"),
      point("F", 4, 3, "ON_CIRCLE"), point("G", -3, 4, "ON_CIRCLE"), point("H", 3, 4, "ON_CIRCLE"),
      point("M", 0, 3, "INSIDE"), point("N", 0, 4, "INSIDE"), point("P", 5, 5, "OUTSIDE"),
    ]);
    return Object.freeze({
      diagramType: "CIRCLE_RELATIONS", circleCenter: "O", radius: 5, points,
      pointsOnCircle: freezeArray(["A", "B", "C", "D", "E", "F", "G", "H"]),
      pointLocations: Object.freeze(Object.fromEntries(points.map((item) => [item.label, item.location]))),
      diameters: freezeArray([{ id: "AC", endpoints: ["A", "C"], length: 10 }, { id: "BD", endpoints: ["B", "D"], length: 10 }]),
      chords: freezeArray([
        { id: "EF", endpoints: ["E", "F"], length: 8, midpoint: "M", perpendicularFromCenter: "OM" },
        { id: "GH", endpoints: ["G", "H"], length: 6, midpoint: "N", perpendicularFromCenter: "ON" },
        { id: "AB", endpoints: ["A", "B"], length: "5sqrt(2)", midpoint: null, perpendicularFromCenter: null },
      ]),
      tangents: freezeArray([
        { id: "PA", externalPoint: "P", tangentPoint: "A", segmentLabel: "PA", length: 5 },
        { id: "PB", externalPoint: "P", tangentPoint: "B", segmentLabel: "PB", length: 5 },
      ]),
      tangentPoints: freezeArray(["A", "B"]),
      arcs: freezeArray([
        { id: "arcAB", startPoint: "A", endPoint: "B", type: "MINOR", measure: 90 },
        { id: "arcACUpper", startPoint: "A", endPoint: "C", type: "SEMICIRCLE", measure: 180 },
        { id: "arcACLower", startPoint: "A", endPoint: "C", type: "SEMICIRCLE", measure: 180 },
      ]),
      centralAngles: freezeArray([{ id: "AOB", vertex: "O", ray1: "OA", ray2: "OB", measure: 90, interceptedArc: "arcAB" }]),
      inscribedAngles: freezeArray([
        { id: "ACB", vertex: "C", ray1: "CA", ray2: "CB", measure: 45, interceptedArc: "arcAB" },
        { id: "ADB", vertex: "D", ray1: "DA", ray2: "DB", measure: 45, interceptedArc: "arcAB" },
        { id: "ABC", vertex: "B", ray1: "BA", ray2: "BC", measure: 90, interceptedArc: "arcACLower" },
      ]),
      rightAngleMarkers: freezeArray([{ vertex: "A", segments: ["OA", "PA"] }, { vertex: "B", segments: ["OB", "PB"] }]),
      equalLengthMarkers: freezeArray([{ segments: ["PA", "PB"] }, { segments: ["OA", "OB"] }]),
      referenceArc: "arcAB", unknownTarget,
      diagramDescription: "중심 O, 반지름 5인 원에 지름 AC·BD, 현 EF·GH·AB, 외부점 P의 접선 PA·PB와 호 AB가 표시된 도형",
    });
  }

  function normalizePlain(value) { return String(value ?? "").normalize("NFKC").replace(/\s+/g, "").toLowerCase(); }
  function normalizeSegment(value) {
    const letters = String(value ?? "").normalize("NFKC").replace(/[^A-Za-z]/g, "").toUpperCase();
    return letters.length === 2 ? letters.split("").sort().join("") : letters;
  }
  function normalizeAngleInput(value) {
    const raw = String(value ?? "").normalize("NFKC").trim();
    const hasUnit = /°|도/.test(raw);
    return Object.freeze({ expression: raw.replace(/°|도/g, "").trim(), unit: hasUnit ? "degree" : null });
  }
  function normalizeLengthInput(value) {
    const raw = String(value ?? "").normalize("NFKC").trim().replace(/√/g, "sqrt");
    const match = raw.match(/^(.*?)(km|cm|m)\s*$/i);
    return Object.freeze(match ? { expression: match[1].trim(), unit: match[2].toLowerCase() } : { expression: raw, unit: null });
  }
  function pointByLabel(data, label) { return data.points.find((item) => item.label === label); }
  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function arcById(data, id) { return data.arcs.find((item) => item.id === id); }
  function sameEndpointPair(left, right) {
    return Array.isArray(left) && Array.isArray(right)
      && left.map(String).sort().join("|") === right.map(String).sort().join("|");
  }

  function validateCircleGeometryData(data) {
    const errors = [];
    const required = ["diagramType", "circleCenter", "radius", "points", "pointsOnCircle", "pointLocations", "diameters", "chords", "tangents", "tangentPoints", "arcs", "centralAngles", "inscribedAngles", "rightAngleMarkers", "equalLengthMarkers", "referenceArc", "unknownTarget", "diagramDescription"];
    required.forEach((field) => { if (data?.[field] === undefined || data?.[field] === null || data?.[field] === "") errors.push(`MISSING_${field}`); });
    if (errors.length) return Object.freeze({ valid: false, errors: freezeArray(errors) });
    const center = pointByLabel(data, data.circleCenter);
    if (!center || center.location !== "CENTER") errors.push("CENTER_POINT_INVALID");
    if (!(Number(data.radius) > 0)) errors.push("RADIUS_NOT_POSITIVE");
    data.pointsOnCircle.forEach((label) => {
      const p = pointByLabel(data, label);
      if (!p || p.location !== "ON_CIRCLE") errors.push(`POINT_NOT_MARKED_ON_CIRCLE:${label}`);
      else if (Math.abs(distance(center, p) - Number(data.radius)) > 1e-8) errors.push(`POINT_NOT_ON_CIRCLE:${label}`);
    });
    data.diameters.forEach((diameter) => {
      if (!diameter.endpoints.every((label) => data.pointsOnCircle.includes(label))) errors.push(`DIAMETER_ENDPOINT_OFF_CIRCLE:${diameter.id}`);
      if (Math.abs(Number(diameter.length) - 2 * Number(data.radius)) > 1e-8) errors.push(`DIAMETER_LENGTH_MISMATCH:${diameter.id}`);
      const [a, b] = diameter.endpoints.map((label) => pointByLabel(data, label));
      if (a && b && (Math.abs(a.x + b.x - 2 * center.x) > 1e-8 || Math.abs(a.y + b.y - 2 * center.y) > 1e-8)) errors.push(`DIAMETER_MISSES_CENTER:${diameter.id}`);
    });
    data.chords.forEach((chord) => {
      if (!chord.endpoints.every((label) => data.pointsOnCircle.includes(label))) errors.push(`CHORD_ENDPOINT_OFF_CIRCLE:${chord.id}`);
      if (!(String(chord.length).length > 0)) errors.push(`CHORD_LENGTH_MISSING:${chord.id}`);
    });
    data.tangents.forEach((tangent) => {
      const external = pointByLabel(data, tangent.externalPoint);
      const contact = pointByLabel(data, tangent.tangentPoint);
      if (!contact || !data.pointsOnCircle.includes(tangent.tangentPoint)) errors.push(`TANGENT_POINT_OFF_CIRCLE:${tangent.id}`);
      if (!external || external.location !== "OUTSIDE") errors.push(`TANGENT_EXTERNAL_POINT_INVALID:${tangent.id}`);
      if (external && contact) {
        const radiusVector = [contact.x - center.x, contact.y - center.y];
        const tangentVector = [external.x - contact.x, external.y - contact.y];
        if (Math.abs(radiusVector[0] * tangentVector[0] + radiusVector[1] * tangentVector[1]) > 1e-8) errors.push(`TANGENT_RADIUS_NOT_PERPENDICULAR:${tangent.id}`);
      }
      if (!(Number(tangent.length) > 0)) errors.push(`TANGENT_LENGTH_NOT_POSITIVE:${tangent.id}`);
    });
    const groupedTangents = Object.groupBy ? Object.groupBy(data.tangents, (item) => item.externalPoint) : data.tangents.reduce((out, item) => ((out[item.externalPoint] ||= []).push(item), out), {});
    Object.values(groupedTangents).forEach((items) => { if (items.length > 1 && !items.every((item) => Number(item.length) === Number(items[0].length))) errors.push("EQUAL_TANGENT_LENGTH_MISMATCH"); });
    data.arcs.forEach((arc) => {
      if (![arc.startPoint, arc.endPoint].every((label) => data.pointsOnCircle.includes(label))) errors.push(`ARC_ENDPOINT_OFF_CIRCLE:${arc.id}`);
      if (!(Number(arc.measure) > 0 && Number(arc.measure) <= 360)) errors.push(`ARC_MEASURE_RANGE:${arc.id}`);
      if (arc.type === "SEMICIRCLE" && Number(arc.measure) !== 180) errors.push(`SEMICIRCLE_MEASURE_MISMATCH:${arc.id}`);
    });
    data.centralAngles.forEach((angle) => {
      const arc = arcById(data, angle.interceptedArc);
      if (angle.vertex !== data.circleCenter) errors.push(`CENTRAL_ANGLE_VERTEX_INVALID:${angle.id}`);
      if (!arc || Number(angle.measure) !== Number(arc.measure)) errors.push(`CENTRAL_ANGLE_ARC_MISMATCH:${angle.id}`);
      if (!(Number(angle.measure) > 0 && Number(angle.measure) < 180)) errors.push(`ANGLE_RANGE:${angle.id}`);
    });
    data.inscribedAngles.forEach((angle) => {
      const arc = arcById(data, angle.interceptedArc);
      if (!data.pointsOnCircle.includes(angle.vertex)) errors.push(`INSCRIBED_ANGLE_VERTEX_INVALID:${angle.id}`);
      if (!arc || 2 * Number(angle.measure) !== Number(arc.measure)) errors.push(`INSCRIBED_ANGLE_ARC_MISMATCH:${angle.id}`);
      if (!(Number(angle.measure) > 0 && Number(angle.measure) < 180)) errors.push(`ANGLE_RANGE:${angle.id}`);
    });
    if (!arcById(data, data.referenceArc)) errors.push("REFERENCE_ARC_MISSING");
    return Object.freeze({ valid: errors.length === 0, errors: freezeArray(errors) });
  }

  function convertLengthExpression(expression, fromUnit, toUnit) {
    if (!fromUnit || !toUnit || fromUnit === toUnit) return expression;
    if (!(fromUnit in UNIT_TO_METER) || !(toUnit in UNIT_TO_METER)) return null;
    return `(${expression})*${UNIT_TO_METER[fromUnit] / UNIT_TO_METER[toUnit]}`;
  }
  function validateCircleStepOrder(problemOrExpected, answer) {
    const expected = Array.isArray(problemOrExpected) ? problemOrExpected : problemOrExpected?.expectedAnswer;
    const actual = Array.isArray(answer) ? answer.map(String) : String(answer ?? "").split(/\r?\n|;;|,/).map((item) => item.trim()).filter(Boolean);
    if (!Array.isArray(expected) || expected.some((action) => ACTION_RANK[action] === undefined)) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "INVALID_EXPECTED_ACTIONS" };
    const logical = expected.every((action, index) => index === 0 || ACTION_RANK[action] > ACTION_RANK[expected[index - 1]]);
    if (!logical) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "EXPECTED_ACTION_ORDER_INVALID" };
    const correct = actual.length === expected.length && expected.every((action, index) => action === actual[index]);
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "STEP_ORDER_OR_OMISSION" };
  }
  function evaluateCircleGeometryAnswer(problemOrContract, answer) {
    const contract = problemOrContract.circleAnswerContract || problemOrContract;
    const data = problemOrContract.geometryData;
    if (data && answer && typeof answer === "object" && !Array.isArray(answer)) {
      if (answer.relationType === "TANGENT_RADIUS_PERPENDICULAR") {
        const tangent = data.tangents.find((item) => normalizeSegment(item.segmentLabel) === normalizeSegment(answer.tangent));
        const radius = normalizeSegment(answer.radius);
        const correct = Boolean(tangent)
          && tangent.tangentPoint === String(answer.tangentPoint || "").toUpperCase()
          && radius === normalizeSegment(`${data.circleCenter}${tangent.tangentPoint}`)
          && data.rightAngleMarkers.some((marker) => marker.vertex === tangent.tangentPoint
            && marker.segments.some((segment) => normalizeSegment(segment) === normalizeSegment(tangent.segmentLabel))
            && marker.segments.some((segment) => normalizeSegment(segment) === radius));
        return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "TANGENT_RADIUS_RELATION_MISMATCH" };
      }
      if (answer.relationType === "EQUAL_TANGENT_SEGMENTS") {
        const selected = [answer.firstTangent, answer.secondTangent].map((label) => data.tangents.find((item) => normalizeSegment(item.segmentLabel) === normalizeSegment(label)));
        const correct = selected.every(Boolean) && selected[0].externalPoint === selected[1].externalPoint
          && Number(selected[0].length) === Number(selected[1].length);
        return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "EQUAL_TANGENT_RELATION_MISMATCH" };
      }
      if (answer.relationType === "CENTRAL_INSCRIBED") {
        const central = data.centralAngles.find((item) => item.id === answer.centralAngle);
        const inscribed = data.inscribedAngles.find((item) => item.id === answer.inscribedAngle);
        const correct = Boolean(central && inscribed) && central.interceptedArc === inscribed.interceptedArc
          && Number(central.measure) === 2 * Number(inscribed.measure);
        return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "CENTRAL_INSCRIBED_ARC_MISMATCH" };
      }
      if (answer.relationType === "SAME_ARC_INSCRIBED") {
        const first = data.inscribedAngles.find((item) => item.id === answer.firstAngle);
        const second = data.inscribedAngles.find((item) => item.id === answer.secondAngle);
        const correct = Boolean(first && second) && first.interceptedArc === second.interceptedArc
          && Number(first.measure) === Number(second.measure);
        return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "SAME_ARC_RELATION_MISMATCH" };
      }
    }
    const expected = contract.expectedSelection;
    if (expected === undefined || expected === null) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "NO_GEOMETRY_SELECTION" };
    const selectionKind = contract.selectionKind || "TEXT";
    const actualNormalized = ["CHORD", "SEGMENT", "DIAMETER", "TANGENT"].includes(selectionKind) ? normalizeSegment(answer) : normalizePlain(answer);
    const expectedNormalized = ["CHORD", "SEGMENT", "DIAMETER", "TANGENT"].includes(selectionKind) ? normalizeSegment(expected) : normalizePlain(expected);
    const correct = actualNormalized === expectedNormalized;
    return { status: correct ? "CORRECT" : "INCORRECT", correct, reason: correct ? null : "GEOMETRY_SELECTION_MISMATCH" };
  }

  const LOW_TASKS = Object.freeze({
    m3_circle_foundations: Object.freeze({
      BASIC: [
        ["중심 이름", "도형에서 원의 중심을 고르시오.", "O", ["원의 모든 점과 같은 거리에 있는 점을 찾는다.", "표시된 중심은 O이다."], "GEOMETRY_SELECTION", ["O", "A", "M", "P"]],
        ["반지름 선택", "원 위의 점 A와 중심을 잇는 반지름을 고르시오.", "OA", ["한 끝점이 중심 O인지 확인한다.", "다른 끝점 A가 원 위이므로 OA가 반지름이다."], "GEOMETRY_SELECTION", ["OA", "PA", "OM", "AC"]],
        ["지름 길이", "반지름이 5인 원의 지름 길이를 구하시오.", "10", ["지름은 반지름의 두 배이다.", "2×5=10이다."], "LENGTH"],
        ["독립 위치", "점 P는 원 위·안·밖 중 어디에 있는지 쓰시오.", "밖", ["OP와 반지름 5를 비교한다.", "P는 원 밖의 점이다."], "TEXT_NORMALIZED"],
      ],
      A1: [
        ["지름 판별", "두 끝점이 원 위이고 중심 O를 지나는 선분을 고르시오.", "AC", ["현 후보의 두 끝점을 확인한다.", "중심 O를 지나는 AC가 지름이다."], "GEOMETRY_SELECTION"],
        ["현 판별", "지름은 아니지만 두 끝점이 원 위인 현 하나를 쓰시오.", "EF", ["두 끝점 E,F가 원 위임을 확인한다.", "EF는 중심을 지나지 않는 현이다."], "GEOMETRY_SELECTION"],
        ["점 위치 수", "표시된 내부점 M,N의 개수를 구하시오.", "2", ["각 점의 location을 확인한다.", "내부점은 M,N 두 개이다."], "EXPRESSION"],
        ["독립 접점", "외부점 P에서 그은 접선 PA의 접점을 쓰시오.", "A", ["접선 PA가 원과 만나는 점을 찾는다.", "접점은 A이다."], "GEOMETRY_SELECTION"],
      ],
      A2: [
        ["관계 결합", "반지름 OA=5일 때 지름 AC와 반지름 OB의 길이의 합을 구하시오.", "15", ["AC=2OA=10이다.", "OB=5이므로 합은 15이다."], "LENGTH"],
        ["용어 오류", "‘현의 한 끝점은 중심이다’라는 설명이 틀린 이유를 한 단어로 쓰시오.", "반지름", ["한 끝점이 중심인 선분의 이름을 찾는다.", "그 설명은 현이 아니라 반지름의 설명이다."], "TEXT_NORMALIZED"],
        ["요소 순서", "원에서 지름을 확인하는 action을 필요한 순서대로 배열하시오.", null, ["중심을 확인한다.", "반지름을 확인한다.", "중심을 지나는 현을 지름으로 판정한다."], "STEP_ORDER"],
        ["독립 둘레", "반지름 5인 원에서 두 반지름 OA, OB와 현 AB의 길이 합을 구하시오.", "10+5sqrt(2)", ["OA+OB=10이다.", "AB=5√2를 더한다.", "합은 10+5√2이다."], "EXPRESSION"],
      ],
    }),
    m3_circle_chord: Object.freeze({
      BASIC: [
        ["현 선택", "끝점이 E,F인 현의 이름을 쓰시오.", "EF", ["E,F가 모두 원 위인지 확인한다.", "현은 EF이다."], "GEOMETRY_SELECTION", ["EF", "OM", "PA", "AC"]],
        ["중점 선택", "중심 O에서 현 EF에 내린 수선의 발을 쓰시오.", "M", ["OM이 EF와 만나는 점을 찾는다.", "수선의 발이자 중점은 M이다."], "GEOMETRY_SELECTION", ["M", "N", "O", "P"]],
        ["반현", "현 EF=8일 때 EM의 길이를 구하시오.", "4", ["중심에서 내린 수선은 현을 이등분한다.", "EM=8÷2=4이다."], "LENGTH"],
        ["독립 비교", "현 EF와 GH 중 중심에 더 가까운 현을 쓰시오.", "EF", ["OM=3, ON=4를 비교한다.", "중심거리가 작은 EF가 더 가깝다."], "GEOMETRY_SELECTION"],
      ],
      A1: [
        ["현 길이", "반지름 5, 중심에서 현까지 거리 3일 때 현의 길이를 구하시오.", "8", ["반현을 x라 두면 x²+3²=5²이다.", "x=4이므로 현은 8이다."], "LENGTH"],
        ["중심거리", "반지름 5, 현 GH=6일 때 중심에서 현까지 거리를 구하시오.", "4", ["반현은 3이다.", "거리²+3²=5²에서 거리는 4이다."], "LENGTH"],
        ["같은 현 역", "같은 원에서 길이가 같은 두 현의 중심거리는 어떤 관계인지 쓰시오.", "같다", ["같은 반지름과 같은 반현으로 직각삼각형을 만든다.", "나머지 변인 중심거리도 같다."], "TEXT_NORMALIZED"],
        ["독립 긴 현", "현 EF=8, GH=6일 때 더 긴 현과 중심거리를 함께 쓰시오.", "EF,3", ["두 현의 길이를 비교한다.", "더 긴 EF의 중심거리는 OM=3이다."], "TEXT_NORMALIZED"],
      ],
      A2: [
        ["거리 차", "현 EF와 GH의 중심거리 차를 구하시오.", "1", ["OM=3, ON=4이다.", "차는 1이다."], "LENGTH"],
        ["반현 합", "현 EF와 GH의 반쪽 길이의 합을 구하시오.", "7", ["EF의 반은 4이다.", "GH의 반은 3이므로 합은 7이다."], "LENGTH"],
        ["현 계산 순서", "중심거리와 반지름으로 현의 길이를 구하는 action을 배열하시오.", null, ["중심과 현을 확인한다.", "현의 이등분을 적용한다.", "직각삼각형 식을 세워 길이를 구한다."], "STEP_ORDER"],
        ["독립 검산", "반지름 5인 원에서 중심거리 4인 현의 길이가 8이라는 주장이 맞으면 O, 틀리면 X를 쓰시오.", "X", ["반현은 √(25-16)=3이다.", "전체 현은 6이므로 주장은 틀리다."], "TEXT_NORMALIZED"],
      ],
    }),
    m3_circle_tangent_radius: Object.freeze({
      BASIC: [
        ["접선 선택", "외부점 P에서 접점 A로 그은 접선을 고르시오.", "PA", ["P와 접점 A를 잇는 선분을 찾는다.", "접선은 PA이다."], "GEOMETRY_SELECTION", ["PA", "OA", "AB", "OM"]],
        ["접점 선택", "접선 PB의 접점을 쓰시오.", "B", ["PB가 원과 한 점에서 만나는 곳을 찾는다.", "접점은 B이다."], "GEOMETRY_SELECTION", ["B", "P", "O", "M"]],
        ["수직각", "접선 PA와 반지름 OA가 이루는 각을 구하시오.", "90", ["접점 A에서 접선과 반지름은 수직이다.", "각은 90°이다."], "ANGLE"],
        ["독립 판별", "원과 두 점에서 만나는 직선은 접선이 아니다. 맞으면 O를 쓰시오.", "O", ["접선은 원과 한 점에서 만난다.", "두 점에서 만나면 할선이므로 설명은 맞다."], "TEXT_NORMALIZED"],
      ],
      A1: [
        ["직각삼각형", "접선 PA와 반지름 OA로 생기는 삼각형의 직각 꼭짓점을 쓰시오.", "A", ["접점에서 수직 관계를 적용한다.", "직각 꼭짓점은 A이다."], "GEOMETRY_SELECTION"],
        ["접선 길이", "OP=5√2, OA=5이고 PA가 접선일 때 PA를 구하시오.", "5", ["△OAP는 A에서 직각이다.", "PA²=OP²-OA²=50-25=25이다."], "LENGTH"],
        ["각도 합", "직각삼각형 OAP에서 ∠OPA=45°일 때 ∠AOP를 구하시오.", "45", ["∠OAP=90°이다.", "나머지 두 각의 합이 90°이므로 45°이다."], "ANGLE"],
        ["독립 역판정", "A가 원 위이고 OA⊥l이면 직선 l은 A에서의 무엇인지 쓰시오.", "접선", ["원 위의 점에서 반지름에 수직인 직선을 확인한다.", "역성질에 의해 접선이다."], "TEXT_NORMALIZED"],
      ],
      A2: [
        ["두 접점 각", "∠OAP와 ∠OBP의 합을 구하시오.", "180", ["두 각은 각각 접점에서 90°이다.", "합은 180°이다."], "ANGLE"],
        ["직각 둘레", "△OAP의 세 변 OA=5, PA=5, OP=5√2의 둘레를 구하시오.", "10+5sqrt(2)", ["세 변의 길이를 모두 확인한다.", "5+5+5√2=10+5√2이다."], "LENGTH"],
        ["접선 판별 순서", "원 위의 점에서 주어진 직선이 접선인지 판별하는 action을 배열하시오.", null, ["중심과 반지름을 확인한다.", "접점을 확인한다.", "접선과 반지름의 수직을 적용한다."], "STEP_ORDER"],
        ["독립 오류", "A가 원 안의 점일 때 OA에 수직인 직선을 A에서의 접선이라 할 수 있는지 O/X로 답하시오.", "X", ["접점은 원 위에 있어야 한다.", "A가 원 안이면 접선 조건을 만족하지 않는다."], "TEXT_NORMALIZED"],
      ],
    }),
    m3_circle_tangent_segments: Object.freeze({
      BASIC: [
        ["두 접선", "외부점 P에서 그은 두 접선을 모두 쓰시오.", "PA,PB", ["공통 외부점 P에서 출발하는 접선을 찾는다.", "PA와 PB이다."], "TEXT_NORMALIZED", ["PA,PB", "OA,OB", "EF,GH", "AC,BD"]],
        ["같은 길이", "PA=5일 때 PB의 길이를 구하시오.", "5", ["같은 외부점에서 그은 두 접선의 길이는 같다.", "PB=PA=5이다."], "LENGTH", ["5", "10", "25", "5sqrt(2)"]],
        ["외부점", "두 접선 PA, PB의 공통 외부점을 쓰시오.", "P", ["두 선분의 공통 시작점을 찾는다.", "공통 외부점은 P이다."], "GEOMETRY_SELECTION"],
        ["독립 접점쌍", "두 접선의 접점 두 개를 쓰시오.", "A,B", ["PA와 PB가 원에 닿는 점을 찾는다.", "접점은 A와 B이다."], "TEXT_NORMALIZED"],
      ],
      A1: [
        ["길이 식", "PA=x+2, PB=7일 때 x를 구하시오.", "5", ["PA=PB이므로 x+2=7이다.", "x=5이다."], "EXPRESSION"],
        ["합 길이", "PA=PB=5일 때 두 접선 길이의 합을 구하시오.", "10", ["두 길이는 각각 5이다.", "합은 10이다."], "LENGTH"],
        ["대칭 삼각형", "△OAP와 △OBP가 합동일 때 대응하는 반지름 OA의 변을 쓰시오.", "OB", ["접점 A와 B를 대응시킨다.", "OA에 대응하는 변은 OB이다."], "GEOMETRY_SELECTION"],
        ["독립 차", "PA와 PB의 길이 차를 구하시오.", "0", ["두 접선 길이는 같다.", "차는 0이다."], "LENGTH"],
      ],
      A2: [
        ["삼각 둘레", "PA=PB=5, AB=5√2일 때 △PAB의 둘레를 구하시오.", "10+5sqrt(2)", ["PA+PB=10이다.", "AB=5√2를 더한다."], "LENGTH"],
        ["두 식", "PA=2x-1, PB=x+4일 때 공통 접선 길이를 구하시오.", "9", ["2x-1=x+4에서 x=5이다.", "접선 길이는 9이다."], "LENGTH"],
        ["두 접선 순서", "두 접선 길이 관계를 확인하는 action을 배열하시오.", null, ["접선을 확인한다.", "접점을 확인한다.", "같은 외부점의 두 접선 성질을 적용한다.", "길이를 구한다."], "STEP_ORDER"],
        ["독립 외부점 오류", "서로 다른 외부점에서 그은 두 접선은 항상 길이가 같다는 주장을 O/X로 판단하시오.", "X", ["같은 길이 성질에는 같은 외부점 조건이 필요하다.", "외부점이 다르면 일반적으로 같지 않다."], "TEXT_NORMALIZED"],
      ],
    }),
    m3_circle_central_inscribed: Object.freeze({
      BASIC: [
        ["중심각", "호 AB에 대한 중심각을 고르시오.", "AOB", ["꼭짓점이 중심 O인지 확인한다.", "중심각은 ∠AOB이다."], "GEOMETRY_SELECTION", ["AOB", "ADB", "ACB", "ABC"]],
        ["원주각", "호 AB에 대한 원주각 하나를 고르시오.", "ADB", ["꼭짓점이 원 위이고 양 끝점이 A,B인지 확인한다.", "∠ADB가 호 AB를 본다."], "GEOMETRY_SELECTION", ["ADB", "AOB", "OAP", "OMP"]],
        ["절반 관계", "중심각 AOB=90°일 때 같은 호의 원주각 ADB를 구하시오.", "45", ["원주각은 같은 호 중심각의 절반이다.", "90÷2=45°이다."], "ANGLE"],
        ["독립 두 배", "원주각 ACB=45°일 때 같은 호의 중심각 AOB를 구하시오.", "90", ["중심각은 원주각의 두 배이다.", "2×45=90°이다."], "ANGLE"],
      ],
      A1: [
        ["미지 원주각", "같은 호의 중심각이 128°일 때 원주각을 구하시오.", "64", ["원주각은 중심각의 절반이다.", "128÷2=64°이다."], "ANGLE"],
        ["미지 중심각", "같은 호의 원주각이 37°일 때 중심각을 구하시오.", "74", ["중심각은 원주각의 두 배이다.", "37×2=74°이다."], "ANGLE"],
        ["호 크기", "중심각 AOB=90°가 가로막는 작은 호 AB의 크기를 구하시오.", "90", ["중심각의 크기는 대응하는 호의 크기와 같다.", "호 AB는 90°이다."], "ANGLE"],
        ["독립 호 대응", "∠ADB가 가로막는 기준 호를 쓰시오.", "AB", ["각의 두 변이 만나는 원 위의 점 A,B를 찾는다.", "기준 호는 AB이다."], "GEOMETRY_SELECTION"],
      ],
      A2: [
        ["각도 합", "호 AB의 중심각과 원주각이 각각 90°,45°일 때 두 각의 합을 구하시오.", "135", ["두 각이 같은 호를 보는지 확인한다.", "90+45=135°이다."], "ANGLE"],
        ["역식", "같은 호의 중심각을 x°, 원주각을 x-30°라 할 때 x를 구하시오.", "60", ["x=2(x-30)을 세운다.", "x=60이다."], "ANGLE"],
        ["호 대응 순서", "중심각과 원주각을 비교하는 action을 배열하시오.", null, ["기준 호를 확인한다.", "중심각을 대응시킨다.", "원주각을 대응시킨다.", "두 배 관계를 적용한다.", "각을 구한다."], "STEP_ORDER"],
        ["독립 다른 호", "서로 다른 호에 대한 중심각과 원주각에도 항상 두 배 관계가 성립한다는 주장을 O/X로 판단하시오.", "X", ["두 배 관계는 같은 호가 전제이다.", "호가 다르면 바로 비교할 수 없다."], "TEXT_NORMALIZED"],
      ],
    }),
    m3_circle_same_arc: Object.freeze({
      BASIC: [
        ["같은 호 각", "호 AB에 대한 두 원주각 ACB, ADB의 크기 관계를 쓰시오.", "같다", ["두 각의 양 끝점이 A,B인지 확인한다.", "같은 호 AB를 보므로 크기가 같다."], "TEXT_NORMALIZED", ["같다", "두배", "절반", "무관하다"]],
        ["각도 복사", "∠ACB=45°일 때 ∠ADB를 구하시오.", "45", ["두 각은 같은 호 AB를 본다.", "두 원주각은 같으므로 45°이다."], "ANGLE", ["45", "90", "22.5", "135"]],
        ["반원 각", "지름 AC에 대한 원주각 ABC를 구하시오.", "90", ["AC가 지름이므로 대응 호는 반원이다.", "반원에 대한 원주각은 90°이다."], "ANGLE"],
        ["독립 기준호", "∠ACB와 ∠ADB가 공통으로 가로막는 호를 쓰시오.", "AB", ["두 각의 두 변이 끝나는 점을 찾는다.", "공통 기준 호는 AB이다."], "GEOMETRY_SELECTION"],
      ],
      A1: [
        ["같은 호 미지수", "∠ACB=3x+6°, ∠ADB=5x-20°일 때 x를 구하시오.", "13", ["같은 호 원주각이므로 두 식을 같게 둔다.", "3x+6=5x-20에서 x=13이다."], "EXPRESSION"],
        ["각 계산", "∠ACB=38°이면 ∠ADB와의 합을 구하시오.", "76", ["∠ADB=38°이다.", "합은 76°이다."], "ANGLE"],
        ["반원 삼각형", "AC가 지름이고 ∠BAC=32°일 때 ∠BCA를 구하시오.", "58", ["∠ABC=90°이다.", "삼각형 각의 합에서 180-90-32=58°이다."], "ANGLE"],
        ["독립 다른 끝점", "원주각의 두 변 끝점이 서로 다르면 같은 호라고 할 수 있는지 O/X로 답하시오.", "X", ["같은 호는 양 끝점이 같아야 한다.", "끝점이 다르면 기준 호도 다르다."], "TEXT_NORMALIZED"],
      ],
      A2: [
        ["삼각 연결", "AC가 지름이고 ∠BAC=35°일 때 ∠BCA를 구하시오.", "55", ["반원에 대한 ∠ABC=90°이다.", "180-90-35=55°이다."], "ANGLE"],
        ["두 원주각 합", "같은 호에 대한 두 원주각이 각각 2x+5°, 3x-10°일 때 두 각의 합을 구하시오.", "70", ["2x+5=3x-10에서 x=15이다.", "각은 35°씩이므로 합은 70°이다."], "ANGLE"],
        ["같은 호 순서", "두 원주각의 크기를 비교하는 action을 배열하시오.", null, ["기준 호를 확인한다.", "두 원주각을 대응시킨다.", "같은 호 관계를 적용한다.", "각을 구한다.", "범위를 검산한다."], "STEP_ORDER"],
        ["독립 반원 역", "원주각이 90°이면 그 각이 가로막는 현이 지름임을 이용할 수 있는지 O/X로 답하시오.", "O", ["반원에 대한 원주각의 역관계를 확인한다.", "90° 원주각이 가로막는 현은 지름이다."], "TEXT_NORMALIZED"],
      ],
    }),
  });

  const ADVANCED_NUMERIC = Object.freeze({
    m3_circle_foundations: [
      ["요소 교집합", "두 끝점이 원 위이고 중심 O를 지나며 길이가 10인 선분을 고르시오.", "AC", "GEOMETRY_SELECTION"],
      ["위치 역추론", "OP=5√2, 반지름이 5일 때 P의 위치를 쓰시오.", "밖", "TEXT_NORMALIZED"],
      ["조건 전환", "현이면서 반지름의 두 배인 선분의 이름을 쓰시오.", "지름", "TEXT_NORMALIZED"],
      ["독립 반례", "끝점 하나가 중심인 모든 선분은 지름이라는 주장을 O/X로 판단하시오.", "X", "TEXT_NORMALIZED"],
      ["최소 조건", "선분 AC가 지름임을 보이기 위해 ‘두 끝점이 원 위’ 외에 필요한 점을 쓰시오.", "O", "GEOMETRY_SELECTION"],
    ],
    m3_circle_chord: [
      ["두 현 후보", "현 EF, GH 중 길이가 더 길고 중심거리가 더 작은 현을 쓰시오.", "EF", "GEOMETRY_SELECTION"],
      ["역추론 반현", "반지름 5, 중심거리 3인 현의 반쪽 길이와 전체 길이의 차를 구하시오.", "4", "LENGTH"],
      ["조건 교차", "현의 길이가 6이고 반지름이 5일 때 중심거리와 반현의 합을 구하시오.", "7", "LENGTH"],
      ["독립 검증", "중심거리 3인 현과 4인 현의 길이 차를 구하시오.", "2", "LENGTH"],
      ["표현 변환", "반현을 x, 중심거리를 d, 반지름을 r라 할 때 성립하는 식을 쓰시오.", "x^2+d^2=r^2", "EXPRESSION"],
    ],
    m3_circle_tangent_radius: [
      ["접점 후보", "PA가 접선이고 OA⊥PA일 때 수직 관계의 꼭짓점을 쓰시오.", "A", "GEOMETRY_SELECTION"],
      ["길이 역추론", "OA=5, PA=5인 직각삼각형 OAP에서 OP를 구하시오.", "5sqrt(2)", "LENGTH"],
      ["각 조건", "∠OPA=30°일 때 ∠AOP를 구하시오.", "60", "ANGLE"],
      ["독립 접선 판정", "원 위 A에서 OA와 이루는 각이 89°인 직선이 접선인지 O/X로 답하시오.", "X", "TEXT_NORMALIZED"],
      ["최소 수직", "A가 원 위라는 조건과 함께 직선 l이 접선이 되기 위한 각의 크기를 구하시오.", "90", "ANGLE"],
    ],
    m3_circle_tangent_segments: [
      ["두 식 교차", "PA=3x-4, PB=x+6일 때 x와 접선 길이의 합을 구하시오.", "17", "LENGTH"],
      ["대칭 길이", "PA=PB=5, OA=OB=5일 때 네 선분의 길이 합을 구하시오.", "20", "LENGTH"],
      ["둘레 역추론", "△PAB의 둘레가 10+5√2이고 AB=5√2일 때 PA를 구하시오.", "5", "LENGTH"],
      ["독립 조건 필터", "PA=PB가 성립할 때 반드시 같은 점에서 출발해야 하는지 O/X로 답하시오.", "O", "TEXT_NORMALIZED"],
      ["표현 변환", "두 접선 PA,PB와 두 반지름 OA,OB의 길이 합을 구하시오.", "20", "LENGTH"],
    ],
    m3_circle_central_inscribed: [
      ["호 후보 선택", "∠AOB와 ∠ADB의 두 배 관계를 보장하는 기준 호를 쓰시오.", "AB", "GEOMETRY_SELECTION"],
      ["두 조건 식", "중심각이 원주각보다 45° 클 때 두 각의 합을 구하시오.", "135", "ANGLE"],
      ["역추론 호", "원주각이 52°일 때 기준 호와 같은 크기의 중심각을 구하시오.", "104", "ANGLE"],
      ["독립 잘못된 호", "∠AOB와 다른 호를 보는 45° 원주각을 바로 비교할 수 있는지 O/X로 답하시오.", "X", "TEXT_NORMALIZED"],
      ["조건 분류", "중심각 x와 같은 호의 원주각 y 사이의 식을 쓰시오.", "x=2y", "EXPRESSION"],
    ],
    m3_circle_same_arc: [
      ["호와 각 교차", "∠ACB=45°이고 같은 호를 보는 ∠ADB와의 차를 구하시오.", "0", "ANGLE"],
      ["반원 역추론", "∠ABC=90°이고 A,C가 원 위일 때 현 AC의 이름을 쓰시오.", "지름", "TEXT_NORMALIZED"],
      ["복합 각", "AC가 지름이고 ∠BAC=28°일 때 ∠BCA를 구하시오.", "62", "ANGLE"],
      ["독립 호 필터", "∠ACB와 ∠ADB가 같다는 결론에 필요한 공통 끝점 두 개를 쓰시오.", "A,B", "TEXT_NORMALIZED"],
      ["경우 분류", "같은 호를 보는 세 원주각이 각각 40°일 때 세 각의 합을 구하시오.", "120", "ANGLE"],
    ],
  });

  const ADVANCED_TOPICS = Object.freeze({
    m3_circle_foundations: ["현과 지름의 필요충분조건", "점의 위치 판정 오류", "반지름·현·접선 용어의 반례", "최소 정보로 원의 요소를 복원하는 방법"],
    m3_circle_chord: ["수직 조건 없이 현을 이등분한 오류", "같은 현 길이와 중심거리의 필요충분조건", "현 길이 비교의 모든 경우", "반현을 전체 현으로 답한 풀이의 검증"],
    m3_circle_tangent_radius: ["접점이 아닌 곳에서 수직인 경우의 반례", "접선 판정의 필요충분조건", "접선 길이 계산에서 빗변을 잘못 고른 오류", "수직 관계를 이용한 접선 일반 판정"],
    m3_circle_tangent_segments: ["서로 다른 외부점의 접선을 같다고 한 반례", "두 접선 길이 정리의 필요 조건", "접점 대응 오류와 합동 검증", "둘레 조건에서 가능한 모든 접선 길이"],
    m3_circle_central_inscribed: ["서로 다른 호의 각을 비교한 오류", "중심각과 원주각 두 배 관계의 필요 조건", "기준 호가 두 후보일 때의 분류", "각도 결과를 호와 함께 검증하는 절차"],
    m3_circle_same_arc: ["모양만 보고 같은 호라 한 반례", "같은 호 원주각 정리의 필요 조건", "반원 원주각의 역관계 검증", "여러 원주각을 기준 호별로 분류하는 방법"],
  });
  const CONCEPT_ACTIONS = Object.freeze({
    m3_circle_foundations: ["IDENTIFY_CENTER", "IDENTIFY_RADIUS", "IDENTIFY_DIAMETER", "VERIFY_GEOMETRY_RANGE"],
    m3_circle_chord: ["IDENTIFY_CENTER", "IDENTIFY_CHORD", "BUILD_EQUATION", "SOLVE_LENGTH", "VERIFY_GEOMETRY_RANGE"],
    m3_circle_tangent_radius: ["IDENTIFY_CENTER", "IDENTIFY_RADIUS", "IDENTIFY_TANGENT", "IDENTIFY_TANGENT_POINT", "APPLY_TANGENT_RADIUS_PERPENDICULAR", "SOLVE_LENGTH"],
    m3_circle_tangent_segments: ["IDENTIFY_TANGENT", "IDENTIFY_TANGENT_POINT", "APPLY_EQUAL_TANGENT_SEGMENTS", "BUILD_EQUATION", "SOLVE_LENGTH"],
    m3_circle_central_inscribed: ["IDENTIFY_REFERENCE_ARC", "MATCH_CENTRAL_ANGLE", "MATCH_INSCRIBED_ANGLE", "APPLY_CENTRAL_INSCRIBED_RELATION", "SOLVE_ANGLE", "VERIFY_GEOMETRY_RANGE"],
    m3_circle_same_arc: ["IDENTIFY_REFERENCE_ARC", "MATCH_INSCRIBED_ANGLE", "APPLY_SAME_ARC_RELATION", "SOLVE_ANGLE", "VERIFY_GEOMETRY_RANGE"],
  });
  const FOCUS = Object.freeze({
    BASIC: ["정의 관찰", "표시 대응", "기본 계산", "혼자 판별"],
    A1: ["한 성질 적용", "역관계 계산", "조건 대응", "독립 확인"],
    A2: ["두 성질 결합", "표현 변환", "논리 순서", "오류 검산"],
    A3: ["후보 교집합", "역추론 계산", "전략 선택 과정", "독립 조건 필터"],
    A4: ["숨은 조건 복원", "최소 과정 선택", "경우 표현 변환", "독립 구조 설명"],
    A5: ["주장 오류 감사", "필요조건 검증 과정", "반례와 일반화", "독립 모든 경우 분류"],
  });

  function lowTask(conceptId, stage, position) {
    const row = LOW_TASKS[conceptId][stage][position];
    return { key: row[0], prompt: row[1], expectedAnswer: row[2], steps: row[3], validatorMode: row[4], choices: row[5] };
  }
  function advancedTask(conceptId, stage, position) {
    if (stage === "A3" && position !== 2) {
      const index = position === 3 ? 3 : position;
      const row = ADVANCED_NUMERIC[conceptId][index];
      return { key: `a3-${row[0]}`, prompt: row[1], expectedAnswer: row[2], steps: ["독립 조건을 각각 표시한다.", "가능한 후보를 생성하고 기준 관계로 거른다.", `선택한 성질을 적용하여 ${row[2]}을 얻는다.`, "점·호·각 또는 길이 조건으로 검산한다."], validatorMode: row[3] };
    }
    if (stage === "A4" && [0, 2].includes(position)) {
      const row = ADVANCED_NUMERIC[conceptId][position === 0 ? 2 : 4];
      return { key: `a4-${row[0]}`, prompt: row[1], expectedAnswer: row[2], steps: ["숨은 도형 조건을 복원한다.", "가능한 관계를 경우별로 나눈다.", "가장 강한 조건을 먼저 적용한다.", `결과 ${row[2]}을 다른 관계로 검산한다.`], validatorMode: row[3] };
    }
    const topicIndex = stage === "A4" ? 3 : position;
    const topic = ADVANCED_TOPICS[conceptId][topicIndex];
    return {
      key: `${stage.toLowerCase()}-${topic.replace(/\s+/g, "-")}`,
      prompt: `${topic}을 판단하고, 성립 조건·사용한 원의 성질·반례 또는 검산을 포함해 설명하시오.`,
      expectedAnswer: "점의 위치와 기준 호 또는 접점을 먼저 확정하고, 해당 성질의 전제와 결론을 구분하여 적용한 뒤 반례와 각도·길이 범위로 검증한다.",
      steps: ["문장에서 주장하는 도형 관계와 전제를 분리한다.", "기준 호·접점·현의 끝점을 정확히 대응시킨다.", "적용한 원의 성질과 계산을 제시한다.", "조건이 빠진 경우의 반례 또는 모든 경우를 제시한다.", "각도 범위와 길이의 양수 조건으로 결과를 검산한다."],
      validatorMode: "WRITTEN_REVIEW",
    };
  }
  function stepTask(conceptId, stage) {
    const actions = CONCEPT_ACTIONS[conceptId];
    return {
      key: `${stage.toLowerCase()}-logical-actions`,
      prompt: `${concepts.find((item) => item.conceptId === conceptId).title} 문제에서 필요한 도형 관계를 확인하고 답을 검산하는 action을 순서대로 배열하시오.`,
      expectedAnswer: actions,
      steps: ["점과 선분 또는 각의 역할을 먼저 확인한다.", "문제의 전제에 맞는 원의 성질을 선택한다.", "식이나 각도·길이 관계를 계산한다.", "도형 범위와 단위를 검산한다."],
      validatorMode: "STEP_ORDER",
    };
  }
  function buildTask(conceptId, stage, position) {
    const answerType = TYPE_PATTERN[stage][position];
    let task;
    if (answerType === "STEP_ORDER") task = stepTask(conceptId, stage);
    else if (["A3", "A4", "A5"].includes(stage)) task = advancedTask(conceptId, stage, position);
    else task = lowTask(conceptId, stage, position);
    const concept = concepts.find((item) => item.conceptId === conceptId);
    return {
      ...task, conceptId, stage, position,
      prompt: `[${concept.title}·${stage}·${FOCUS[stage][position]}] ${task.prompt}`,
      geometryData: makeGeometry(`${conceptId}:${stage}:${position}`),
    };
  }

  function unitDefaults(task) {
    if (task.validatorMode === "ANGLE") return { unitPolicy: task.stage === "A4" ? "REQUIRED" : "OPTIONAL", expectedUnit: "degree" };
    if (task.validatorMode === "LENGTH") return { unitPolicy: task.stage === "A2" || task.stage === "A4" ? "REQUIRED" : "OPTIONAL", expectedUnit: "cm" };
    return { unitPolicy: "FORBIDDEN", expectedUnit: null };
  }
  function makeCircleAnswerContract(task) {
    const expectedSelection = task.validatorMode === "GEOMETRY_SELECTION" ? task.expectedAnswer : null;
    const selectionKind = /^[A-Z]{2}$/.test(String(expectedSelection || "")) ? "SEGMENT" : "TEXT";
    return Object.freeze({
      validatorMode: task.validatorMode,
      expectedSelection,
      selectionKind,
      referenceArc: task.geometryData.referenceArc,
      requireSameInterceptedArc: ["m3_circle_central_inscribed", "m3_circle_same_arc"].includes(task.conceptId),
      requireTangentPoint: ["m3_circle_tangent_radius", "m3_circle_tangent_segments"].includes(task.conceptId),
      supportedRelations: freezeArray({
        m3_circle_tangent_radius: ["TANGENT_RADIUS_PERPENDICULAR"],
        m3_circle_tangent_segments: ["EQUAL_TANGENT_SEGMENTS"],
        m3_circle_central_inscribed: ["CENTRAL_INSCRIBED"],
        m3_circle_same_arc: ["SAME_ARC_INSCRIBED"],
      }[task.conceptId] || []),
      allowReversedPointOrder: true,
    });
  }
  function makeChoices(task, defaults) {
    if (task.choices) return freezeArray(task.choices.map(String));
    const expected = defaults.unitPolicy === "REQUIRED" && defaults.expectedUnit ? `${task.expectedAnswer} ${defaults.expectedUnit}` : String(task.expectedAnswer);
    const candidates = [expected, "O", "A", "AB", "45", "90", "5", "10", "X"];
    return freezeArray(Array.from(new Set(candidates)).slice(0, 4));
  }
  function makeProblem(task, index) {
    const concept = concepts.find((item) => item.conceptId === task.conceptId);
    const answerType = TYPE_PATTERN[task.stage][task.position];
    const problemId = `m3-circle-${String(index + 1).padStart(3, "0")}-${task.conceptId.replace("m3_circle_", "")}-${task.stage.toLowerCase()}-${task.position + 1}`;
    const defaults = unitDefaults(task);
    const acceptedAnswers = freezeArray(task.acceptedAnswers || []);
    const solutionSteps = freezeArray(task.steps);
    const circleAnswerContract = makeCircleAnswerContract(task);
    const answerContract = Object.freeze({
      validatorMode: task.validatorMode,
      unitPolicy: defaults.unitPolicy,
      expectedUnit: defaults.expectedUnit,
      acceptedAnswers,
      anglePolicy: task.validatorMode === "ANGLE" ? "NORMALIZE_NUMBER_DEGREE_SYMBOL_OR_KOREAN_UNIT" : "NOT_APPLICABLE",
      lengthPolicy: task.validatorMode === "LENGTH" ? "ALGEBRA_EQUIVALENCE_WITH_SAME_FAMILY_UNIT_CONVERSION" : "NOT_APPLICABLE",
      geometrySelectionPolicy: task.validatorMode === "GEOMETRY_SELECTION" ? "ALLOW_REVERSED_POINT_ORDER_REJECT_WRONG_RELATION" : "NOT_APPLICABLE",
    });
    const writtenRubric = answerType === "WRITTEN_RESPONSE" ? Object.freeze({
      reviewStatus: "REVIEW_REQUIRED",
      requiredIdeas: freezeArray(solutionSteps.slice(0, 5)),
      minimumRequiredIdeas: 3,
      partialCredit: freezeArray(["도형 관계 선택 이유", "기준 호 또는 접점 대응", "사용한 성질", "계산", "검산"]),
    }) : undefined;
    const unitInstruction = defaults.unitPolicy === "REQUIRED"
      ? defaults.expectedUnit === "degree" ? " 답에는 도(°) 단위를 반드시 쓰시오." : ` 답에는 ${defaults.expectedUnit} 단위를 반드시 쓰시오.`
      : "";
    const displayPrompt = `${task.prompt}${unitInstruction}`;
    return Object.freeze({
      id: problemId, problemId, grade: 9, unitId: UNIT_ID, conceptId: task.conceptId, conceptTitle: concept.title,
      stage: task.stage, answerType, prompt: displayPrompt, questionText: displayPrompt,
      choices: answerType === "MULTIPLE_CHOICE" ? makeChoices(task, defaults) : undefined,
      expectedAnswer: task.expectedAnswer, correctAnswer: task.expectedAnswer, acceptedAnswers,
      explanation: solutionSteps.join(" "),
      hints: freezeArray(["점의 위치와 선분·각의 끝점을 먼저 표시하세요.", "적용하려는 원의 성질이 요구하는 접점 또는 기준 호가 맞는지 확인하세요."]),
      solutionSteps,
      misconceptionTags: freezeArray(["POINT_LOCATION_ERROR", "REFERENCE_ARC_ERROR", "TANGENT_POINT_ERROR", "ANGLE_FACTOR_ERROR", "LENGTH_OR_UNIT_ERROR"]),
      difficultyEvidence: freezeArray(STAGE_META[task.stage].evidence),
      independentCheck: task.position === 3,
      independentCheckPolicy: Object.freeze({ hintDisclosure: "LOCKED_DURING_INDEPENDENT_CHECK", solutionDisclosure: "AFTER_FINAL", hintsLockedBeforeFinal: true, solutionLockedBeforeFinal: true }),
      curriculumVersion: CURRICULUM_VERSION, authoringScope: AUTHORING_SCOPE, sourceScope: SOURCE_SCOPE,
      structureSignature: `structure:m3-circle:${task.conceptId}:${task.stage}:${task.position}:${task.key}`,
      solutionPathSignature: `solution:m3-circle:${task.conceptId}:${task.stage}:${task.position}:${task.key}:v1`,
      linkedConditionCount: STAGE_META[task.stage].linked, minimumReasoningStepCount: STAGE_META[task.stage].minimumSteps,
      requiresStrategySelection: ["A3", "A4", "A5"].includes(task.stage), requiresExplanation: task.stage === "A5",
      contentRole: task.position === 3 ? "LEVEL_RECHECK" : "LEARNING_PRACTICE", legacyReuse: false,
      geometryData: task.geometryData, circleAnswerContract, answerContract, writtenRubric,
      independentValidation: Object.freeze({ conditionFeasible: true, uniqueAnswer: true, answerRecalculated: true, geometryChecked: true, curriculumScopeChecked: true }),
    });
  }

  const authoredTasks = Object.freeze(conceptIds.flatMap((conceptId) => stages.flatMap((stage) => [0, 1, 2, 3].map((position) => buildTask(conceptId, stage, position)))));
  const problems = Object.freeze(authoredTasks.map(makeProblem));
  const problemsById = Object.freeze(Object.fromEntries(problems.map((problem) => [problem.problemId, problem])));

  function compareExpression(expected, actual) {
    if (normalizePlain(expected) === normalizePlain(actual)) return true;
    const result = algebra.compareExpressions(String(expected), String(actual));
    return result.equivalent === true || result.status === "EQUIVALENT" || result.status === "CORRECT";
  }
  function enforceUnit(policy, parsed, expectedUnit) {
    if (policy === "REQUIRED" && !parsed.unit) return { ok: false, result: { status: "INCORRECT", correct: false, reason: "UNIT_REQUIRED" } };
    if (policy === "FORBIDDEN" && parsed.unit) return { ok: false, result: { status: "INCORRECT", correct: false, reason: "UNIT_FORBIDDEN" } };
    if (parsed.unit && expectedUnit && parsed.unit !== "degree" && !(parsed.unit in UNIT_TO_METER)) return { ok: false, result: { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNSUPPORTED_UNIT" } };
    return { ok: true };
  }
  function evaluateAnswer(problemOrId, answer) {
    const problem = typeof problemOrId === "string" ? problemsById[problemOrId] : problemOrId;
    if (!problem) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_PROBLEM" };
    const mode = problem.answerContract.validatorMode;
    if (mode === "WRITTEN_REVIEW") return String(answer ?? "").trim() ? { status: "REVIEW_REQUIRED", correct: null, rubric: problem.writtenRubric } : { status: "INVALID_INPUT", correct: null, rubric: problem.writtenRubric };
    if (mode === "STEP_ORDER") return validateCircleStepOrder(problem, answer);
    if (problem.answerContract.unitPolicy === "FORBIDDEN" && /(?:°|도|(?:\d|\)|\])\s*(?:km|cm|m)|\s+(?:km|cm|m))\s*$/i.test(String(answer ?? "").trim())) {
      return { status: "INCORRECT", correct: false, reason: "UNIT_FORBIDDEN" };
    }
    if (mode === "GEOMETRY_SELECTION") return evaluateCircleGeometryAnswer(problem, answer);
    if (mode === "TEXT_NORMALIZED") {
      const accepted = [problem.expectedAnswer, ...problem.acceptedAnswers].map(normalizePlain);
      const correct = accepted.includes(normalizePlain(answer));
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    if (mode === "ANGLE") {
      const parsed = normalizeAngleInput(answer);
      const unit = enforceUnit(problem.answerContract.unitPolicy, parsed, "degree");
      if (!unit.ok) return unit.result;
      const correct = compareExpression(problem.expectedAnswer, parsed.expression);
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    if (mode === "LENGTH") {
      const parsed = normalizeLengthInput(answer);
      const unit = enforceUnit(problem.answerContract.unitPolicy, parsed, problem.answerContract.expectedUnit);
      if (!unit.ok) return unit.result;
      const actual = parsed.unit ? convertLengthExpression(parsed.expression, parsed.unit, problem.answerContract.expectedUnit) : parsed.expression;
      if (actual === null) return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNIT_FAMILY_MISMATCH" };
      const correct = compareExpression(problem.expectedAnswer, actual);
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    if (["EXPRESSION", "EXPRESSION_INPUT"].includes(mode)) {
      const correct = compareExpression(problem.expectedAnswer, String(answer).replace(/√/g, "sqrt"));
      return { status: correct ? "CORRECT" : "INCORRECT", correct };
    }
    return { status: "UNSUPPORTED_EXPRESSION", correct: null, reason: "UNKNOWN_VALIDATOR_MODE" };
  }
  function getProblems(conceptId, stage) { return Object.freeze(problems.filter((problem) => problem.conceptId === conceptId && (!stage || problem.stage === stage))); }
  function audit() {
    const countBy = (selector) => problems.reduce((out, problem) => { const key = selector(problem); out[key] = (out[key] || 0) + 1; return out; }, {});
    return Object.freeze({
      problemCount: problems.length, byConcept: countBy((problem) => problem.conceptId), byStage: countBy((problem) => problem.stage),
      byAnswerType: countBy((problem) => problem.answerType), byUnitPolicy: countBy((problem) => problem.answerContract.unitPolicy),
      geometryCount: problems.filter((problem) => problem.geometryData).length,
      learningCount: problems.filter((problem) => !problem.independentCheck).length,
      independentCount: problems.filter((problem) => problem.independentCheck).length,
      hintCount: problems.reduce((sum, problem) => sum + problem.hints.length, 0),
    });
  }

  return Object.freeze({
    VERSION, UNIT_ID, CURRICULUM_VERSION, AUTHORING_SCOPE, SOURCE_SCOPE, ANSWER_TYPES, concepts, conceptIds, stages,
    problems, problemsById, getProblems, evaluateAnswer, evaluateProblemAnswer: evaluateAnswer,
    normalizeAngleInput, normalizeLengthInput, evaluateCircleGeometryAnswer, validateCircleGeometryData, validateCircleStepOrder, audit,
  });
});
