const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const recommendations = require("../math-study-recommendations.js");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const learning = fs.readFileSync(path.join(root, "learning.js"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");

function concept(conceptId, title, overrides = {}) {
  return {
    conceptId,
    title,
    stageIndex: 0,
    status: "UNSEEN",
    attempts: 0,
    correct: 0,
    wrong: 0,
    giveUp: 0,
    lastSeenCycle: 0,
    stageCandidate: false,
    nextReviewCycle: 0,
    lastReviewCycle: 0,
    ...overrides,
  };
}

function memoryFixture() {
  const concepts = {
    real_numbers: concept("real_numbers", "실수와 제곱근", { attempts: 2, wrong: 2, status: "DIAGNOSIS_REQUIRED" }),
    factorization: concept("factorization", "다항식의 곱셈과 인수분해", { attempts: 2, stageCandidate: true, status: "STAGE_CANDIDATE" }),
    quadratic_equation: concept("quadratic_equation", "이차방정식", { attempts: 1, status: "UNSTABLE" }),
    quadratic_function: concept("quadratic_function", "이차함수"),
    pythagorean: concept("pythagorean", "피타고라스 정리"),
    trigonometric_ratio: concept("trigonometric_ratio", "삼각비"),
    circle: concept("circle", "원의 성질"),
    statistics_probability: concept("statistics_probability", "통계와 확률", { attempts: 3, nextReviewCycle: 2 }),
    integers_rationals: concept("integers_rationals", "정수와 유리수"),
  };
  return {
    version: 1,
    bootstrap: { completed: true },
    cycleNumber: 2,
    activeCycle: null,
    conceptMastery: concepts,
    targetConceptIds: [
      "real_numbers",
      "factorization",
      "quadratic_equation",
      "quadratic_function",
      "pythagorean",
      "trigonometric_ratio",
      "circle",
      "statistics_probability",
    ],
    recoveryStack: [{
      recoveryConceptId: "integers_rationals",
      originalConceptId: "real_numbers",
      recoveryStageIndex: 0,
      returnCheckpoint: 0,
    }],
    returnCheckpoint: { originalConceptId: "real_numbers", returnStageIndex: 0 },
    pendingRechecks: [{ conceptId: "real_numbers", remaining: 3, createdCycle: 1 }],
  };
}

test("recommendations start with active recovery, stay unique, mapped, and capped at six", () => {
  const memory = memoryFixture();
  const cards = recommendations.generateRecommendations(memory);

  assert.ok(cards.length > 0 && cards.length <= 6);
  assert.equal(cards[0].type, "RECOVERY_FOUNDATION");
  assert.equal(cards[0].conceptId, "integers_rationals");
  assert.equal(cards[0].worldId, "numbers-operations");
  assert.equal(new Set(cards.map((card) => card.conceptId)).size, cards.length);
  cards.forEach((card) => {
    assert.ok(recommendations.CONCEPT_ROUTES[card.conceptId]);
    assert.ok(Number.isInteger(card.worldIndex));
    assert.ok(Number.isInteger(card.topicIndex));
  });
});

test("recommendation labels are limited to the six student-safe labels", () => {
  const allowed = new Set(["지금 학습", "기초 연결", "다시 확인하기", "심화 이어하기", "복귀 준비", "장기 확인"]);
  assert.deepEqual(new Set(Object.values(recommendations.TYPE_LABELS)), allowed);
  const visibleCopy = JSON.stringify({ labels: recommendations.TYPE_LABELS });
  ["약점", "오답 복습", "하락", "초등 수준", "선수개념 진단"].forEach((phrase) => {
    assert.doesNotMatch(visibleCopy, new RegExp(phrase));
  });
});

test("recommendations are generated only after bootstrap and preserve status during the same cycle", () => {
  const memory = memoryFixture();
  memory.bootstrap.completed = false;
  assert.deepEqual(recommendations.generateRecommendations(memory), []);

  memory.bootstrap.completed = true;
  recommendations.refreshRecommendations(memory, { now: "2026-07-23T00:00:00.000Z" });
  const first = memory.studyMapRecommendations[0];
  recommendations.updateRecommendationStatus(memory, first.id, "COMPLETED", { now: "2026-07-23T00:01:00.000Z" });
  recommendations.refreshRecommendations(memory, { now: "2026-07-23T00:02:00.000Z" });
  assert.equal(memory.studyMapRecommendations.find((card) => card.id === first.id).status, "COMPLETED");
  assert.equal(memory.lastRecommendationGeneratedCycle, 2);

  memory.cycleNumber = 3;
  recommendations.refreshRecommendations(memory, { now: "2026-07-23T00:03:00.000Z" });
  assert.equal(memory.studyMapRecommendations.find((card) => card.id === first.id).status, "ACTIVE");
});

test("the first recommendation set can be created immediately after bootstrap at cycle zero", () => {
  const memory = memoryFixture();
  memory.cycleNumber = 0;
  memory.activeCycle = null;
  assert.doesNotThrow(() => recommendations.refreshRecommendations(memory, { now: "2026-07-23T00:00:00.000Z" }));
  assert.ok(memory.studyMapRecommendations.length > 0);
  assert.equal(memory.lastRecommendationGeneratedCycle, 0);
});

test("the learning tab restores current learning, recommendations, and the existing seven-World map", () => {
  assert.doesNotMatch(html, /class="math-map-view-tabs"/);
  assert.match(learning, /function resolveCurrentMathLearning\(memory\)/);
  assert.match(learning, /memory\.currentLearningTarget/);
  assert.match(learning, /state\.mathMapTab = resolveCurrentMathLearning\(memory\) \? "recommendations" : "all"/);
  assert.match(learning, /activeRecommendation\?\.recoveryStage,[\s\S]*activeRecommendation\?\.recommendedStage,[\s\S]*currentStage/);
  assert.match(learning, /data-learning-action="show-math-all-map"/);
  assert.match(learning, /action === "show-math-recommendations"/);
  assert.match(learning, /원래 학습으로 돌아가기 · \$\{context\.goalTitle\} \/ 기초 보충 · \$\{context\.activeTitle\}/);
  assert.match(learning, /mathWorlds\.map\(\(world, index\)/);
  assert.match(learning, /function openMathStudyRecommendation\(recommendationId\)/);
  assert.match(learning, /recommendation\.recoveryStage[\s\S]*recommendation\.recommendedStage[\s\S]*recommendation\.savedCurrentStage/);
  assert.match(learning, /recommendationConceptId: recommendation\.conceptId/);
  assert.match(learning, /recommendedStage,/);
});

test("recommendation state is stored in the level-test memory that is sent to Firebase", () => {
  assert.match(script, /middle3LevelTestMemory\.studyMapRecommendations = \[\]/);
  assert.match(script, /middle3LevelTestMemory\.lastRecommendationGeneratedCycle = 0/);
  assert.match(script, /memory: memory \? JSON\.parse\(JSON\.stringify\(memory\)\) : null/);
  assert.match(script, /refreshMiddle3StudyRecommendations\("cloud-restore"\)/);
  assert.match(script, /study:math-recommendations-updated/);
});
