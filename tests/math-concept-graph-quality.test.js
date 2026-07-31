const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const graph = require(path.join(root, "math-concept-graph-data.js"));
const aliases = require(path.join(root, "math-concept-alias-registry.js"));
const nodes = graph.conceptNodes;
const byId = graph.conceptById;

const REQUIRED_FIELDS = [
  "conceptId", "displayName", "unitName", "domain", "internalGradeBand", "sourceRoutes", "aliasIds",
  "prerequisiteConceptIds", "nextConceptIds", "remedialConceptIds", "parallelConceptIds", "transferConceptIds",
  "minimumGradeBand", "maximumGradeBand", "entryEvidence", "masteryEvidence", "failureEvidence",
  "returnCondition", "promotionCondition", "misconceptionRemediationMap", "contentAvailability",
  "runtimeAvailability", "isAssessmentNode", "isMasterNode",
];
const REFERENCE_FIELDS = [
  "prerequisiteConceptIds", "nextConceptIds", "remedialConceptIds", "parallelConceptIds", "transferConceptIds",
];

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex").toUpperCase();
}

function loadWorldRoadmap() {
  const context = { window: {}, console: { log() {} } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, "math-curriculum-data.js"), "utf8"), context);
  return context.window.STUDY_MATH_ROADMAP_V2;
}

function prerequisiteCycles() {
  const visiting = new Set();
  const visited = new Set();
  const cycles = [];
  function visit(id, stack) {
    if (visiting.has(id)) {
      cycles.push([...stack.slice(stack.indexOf(id)), id]);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const prerequisiteId of byId[id].prerequisiteConceptIds) visit(prerequisiteId, [...stack, id]);
    visiting.delete(id);
    visited.add(id);
  }
  nodes.forEach((node) => visit(node.conceptId, []));
  return cycles;
}

test("canonical graph 공개 계약과 104개 고유 conceptId", () => {
  assert.equal(graph.VERSION, "math-concept-graph-v1");
  assert.equal(nodes.length, 104);
  assert.equal(new Set(nodes.map((node) => node.conceptId)).size, nodes.length);
  nodes.forEach((node) => REQUIRED_FIELDS.forEach((field) => assert.ok(Object.hasOwn(node, field), `${node.conceptId}: ${field}`)));
});

test("alias 22개는 중복 배정 없이 concept alias와 unit alias를 분리한다", () => {
  assert.equal(aliases.aliasEntries.length, 22);
  assert.equal(new Set(aliases.aliasEntries.map((entry) => entry.aliasId)).size, aliases.aliasEntries.length);
  aliases.aliasEntries.forEach((entry) => {
    assert.ok(["CONCEPT_ALIAS", "UNIT_ALIAS"].includes(entry.aliasType));
    assert.ok(entry.targetConceptIds.length > 0);
    assert.equal(new Set(entry.targetConceptIds).size, entry.targetConceptIds.length);
    entry.targetConceptIds.forEach((targetId) => assert.ok(byId[targetId], `${entry.aliasId}: ${targetId}`));
    if (entry.aliasType === "CONCEPT_ALIAS") {
      assert.equal(entry.targetConceptIds.length, 1);
      assert.equal(entry.canonicalConceptId, entry.targetConceptIds[0]);
    } else {
      assert.equal(entry.canonicalConceptId, null);
    }
  });
});

test("광역 ID는 세부 숙달 증거를 하나로 합치지 않는 unit alias다", () => {
  for (const id of ["factorization", "quadratic_equation", "quadratic_function", "trigonometric_ratio", "circle", "statistics_basic"]) {
    const entry = aliases.resolveAlias(id);
    assert.equal(entry.aliasType, "UNIT_ALIAS");
    assert.ok(entry.targetConceptIds.length >= 5);
  }
  assert.equal(aliases.resolveAlias("expression"), null, "중1 문자식과 중2 식의 계산은 별도 canonical 노드다.");
  assert.equal(byId.expression.internalGradeBand, "M2");
  assert.equal(aliases.canonicalConceptIdFor("algebraic_expression"), "algebra_expression");
});

test("모든 관계 참조가 실제 canonical 노드로 해석된다", () => {
  const dangling = [];
  nodes.forEach((node) => REFERENCE_FIELDS.forEach((field) => node[field].forEach((targetId) => {
    if (!byId[targetId]) dangling.push([node.conceptId, field, targetId]);
  })));
  assert.deepEqual(dangling, []);
});

test("자기 참조가 모든 관계와 오류 보충 맵에서 0개다", () => {
  nodes.forEach((node) => {
    REFERENCE_FIELDS.forEach((field) => assert.equal(node[field].includes(node.conceptId), false, `${node.conceptId}: ${field}`));
    Object.values(node.misconceptionRemediationMap).flat().forEach((targetId) => assert.notEqual(targetId, node.conceptId));
  });
});

test("prerequisite graph는 순환이 없다", () => {
  assert.deepEqual(prerequisiteCycles(), []);
});

test("134개 prerequisite 간선과 next 간선은 완전히 역방향 일치한다", () => {
  assert.equal(graph.prerequisiteEdges.length, 134);
  nodes.forEach((node) => {
    node.prerequisiteConceptIds.forEach((id) => assert.ok(byId[id].nextConceptIds.includes(node.conceptId), `${id} -> ${node.conceptId}`));
    node.nextConceptIds.forEach((id) => assert.ok(byId[id].prerequisiteConceptIds.includes(node.conceptId), `${node.conceptId} -> ${id}`));
  });
  assert.equal(nodes.reduce((sum, node) => sum + node.prerequisiteConceptIds.length, 0), graph.prerequisiteEdges.length);
  assert.equal(nodes.reduce((sum, node) => sum + node.nextConceptIds.length, 0), graph.prerequisiteEdges.length);
});

test("19개 parallel 관계는 양방향이며 선후 관계로 오용되지 않는다", () => {
  assert.equal(graph.parallelPairs.length, 19);
  nodes.forEach((node) => node.parallelConceptIds.forEach((id) => {
    assert.ok(byId[id].parallelConceptIds.includes(node.conceptId));
    assert.equal(node.prerequisiteConceptIds.includes(id), false);
    assert.equal(node.nextConceptIds.includes(id), false);
  }));
});

test("초4~고3 경계와 내부 학년대 분포를 고정한다", () => {
  assert.equal(graph.MINIMUM_GRADE_BAND, "G4");
  assert.equal(graph.MAXIMUM_GRADE_BAND, "H3");
  assert.deepEqual(Object.fromEntries(graph.GRADE_BANDS.map((grade) => [grade, nodes.filter((node) => node.internalGradeBand === grade).length])), {
    G4: 7, G5: 9, G6: 9, M1: 10, M2: 5, M3: 46, H1: 6, H2: 10, H3: 2,
  });
  nodes.forEach((node) => {
    assert.ok(graph.GRADE_BANDS.includes(node.internalGradeBand));
    assert.equal(node.minimumGradeBand, "G4");
    assert.equal(node.maximumGradeBand, "H3");
  });
});

test("평가·Master·안내 노드는 학습 graph에 포함되지 않는다", () => {
  nodes.forEach((node) => {
    assert.equal(node.isAssessmentNode, false);
    assert.equal(node.isMasterNode, false);
    assert.doesNotMatch(node.displayName, /평가|Master|안내/);
    assert.doesNotMatch(node.conceptId, /assessment|master/i);
  });
});

test("승인된 중3 41개 conceptId와 신규 4개 ID를 모두 COMPLETE_SPRING으로 포함한다", () => {
  const contentFiles = [
    "middle3-sqrt-learning-content.js",
    "middle3-factorization-learning-content.js",
    "middle3-quadratic-equation-learning-content.js",
    "middle3-quadratic-learning-content.js",
    "middle3-trigonometric-ratio-learning-content.js",
    "middle3-circle-properties-learning-content.js",
    "middle3-statistics-learning-content.js",
  ];
  const actual = contentFiles.flatMap((file) => {
    const content = require(path.join(root, file));
    return (content.CONCEPTS || content.concepts).map((concept) => concept.conceptId);
  });
  assert.equal(actual.length, 41);
  assert.deepEqual(new Set(graph.MIDDLE3_APPROVED_CONCEPT_IDS), new Set(actual));
  for (const id of ["m3_trig_special_angles", "m3_circle_foundations", "m3_statistics_representative_range", "m3_statistics_frequency_graphs"]) {
    assert.ok(byId[id]);
  }
  actual.forEach((id) => {
    assert.equal(byId[id].contentAvailability, "COMPLETE_SPRING");
    assert.equal(byId[id].runtimeAvailability, "DEDICATED_SPRING");
  });
});

test("각 중3 중심 노드는 선수와 후속·병렬·전이 중 하나 이상을 가진다", () => {
  graph.MIDDLE3_APPROVED_CONCEPT_IDS.forEach((id) => {
    const node = byId[id];
    assert.ok(node.prerequisiteConceptIds.length > 0 || node.entryEvidence.startNode, `${id}: entry`);
    assert.ok(node.nextConceptIds.length + node.parallelConceptIds.length + node.transferConceptIds.length > 0, `${id}: continuation`);
  });
});

test("오류별 보충은 실제 노드 1~3개만 가리키고 전체 학년 복습을 만들지 않는다", () => {
  nodes.filter((node) => node.internalGradeBand === "M3").forEach((node) => {
    assert.ok(Object.keys(node.misconceptionRemediationMap).length > 0, node.conceptId);
    Object.entries(node.misconceptionRemediationMap).forEach(([tag, targets]) => {
      assert.ok(tag && targets.length >= 1 && targets.length <= 3, `${node.conceptId}: ${tag}`);
      targets.forEach((targetId) => assert.ok(byId[targetId]));
    });
    assert.deepEqual(new Set(node.remedialConceptIds), new Set(Object.values(node.misconceptionRemediationMap).flat()));
  });
});

test("확률과 조건부확률은 중3 통계의 필수 선수로 연결되지 않는다", () => {
  const statisticsIds = graph.MIDDLE3_APPROVED_CONCEPT_IDS.filter((id) => id.startsWith("m3_statistics_"));
  statisticsIds.forEach((id) => {
    assert.equal(byId[id].prerequisiteConceptIds.includes("probability"), false);
    assert.equal(byId[id].prerequisiteConceptIds.includes("probability_distribution"), false);
  });
  assert.equal(byId.m3_statistics_variance.prerequisiteConceptIds.includes("m3_statistics_mean"), true);
  assert.equal(byId.m3_statistics_standard_deviation.prerequisiteConceptIds.includes("m3_statistics_variance"), true);
});

test("contentAvailability와 runtimeAvailability는 허용값만 사용한다", () => {
  nodes.forEach((node) => {
    assert.ok(graph.CONTENT_AVAILABILITY.includes(node.contentAvailability));
    assert.ok(graph.RUNTIME_AVAILABILITY.includes(node.runtimeAvailability));
    if (node.contentAvailability === "NO_CONTENT") assert.equal(node.runtimeAvailability, "NO_RUNTIME");
  });
  assert.deepEqual(Object.fromEntries(graph.CONTENT_AVAILABILITY.map((value) => [value, nodes.filter((node) => node.contentAvailability === value).length])), {
    COMPLETE_SPRING: 41, LEGACY_ONLY: 45, WORLD_CONTENT_ONLY: 16, LEVEL_TEST_ONLY: 0, NO_CONTENT: 2,
  });
});

test("sourceRoute는 기존 7개 World와 chapter ID에 호환된다", () => {
  const roadmap = loadWorldRoadmap();
  const worldById = new Map(roadmap.worlds.map((world) => [world.id, world]));
  const chapterById = new Map(roadmap.chapters.map((chapter) => [chapter.id, chapter]));
  nodes.forEach((node) => node.sourceRoutes.forEach((sourceRoute) => {
    const world = worldById.get(sourceRoute.worldId);
    const chapter = chapterById.get(sourceRoute.chapterId);
    assert.ok(world, `${node.conceptId}: ${sourceRoute.worldId}`);
    assert.ok(chapter, `${node.conceptId}: ${sourceRoute.chapterId}`);
    assert.equal(world.order - 1, sourceRoute.worldIndex);
    assert.equal(chapter.worldId, sourceRoute.worldId);
  }));
});

test("영역별 분포와 관계 간선 수를 고정한다", () => {
  assert.deepEqual(Object.fromEntries(graph.DOMAINS.map((domain) => [domain, nodes.filter((node) => node.domain === domain).length])), {
    NUMBER_OPERATIONS: 21,
    ALGEBRA: 19,
    FUNCTIONS: 15,
    GEOMETRY: 29,
    STATISTICS_PROBABILITY: 16,
    CALCULUS: 4,
  });
  assert.equal(nodes.reduce((sum, node) => sum + node.remedialConceptIds.length, 0), 266);
  assert.equal(graph.parallelPairs.length, 19);
  assert.equal(graph.transferEdges.length, 15);
});

test("기존 7개 World 데이터 SHA-256은 변경되지 않았다", () => {
  assert.equal(sha256("math-curriculum-data.js"), "C673DB7930BA865C64A7EC76CA4A4C24F0F57A13DE60A0F8824872DE771B6E85");
});

test("승인된 중3 모델·설명 14개 SHA-256은 변경되지 않았다", () => {
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
