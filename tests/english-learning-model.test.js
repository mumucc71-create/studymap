const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const model = require("../english-learning-model.js");
const samples = require("../data/english-learning-samples.js");

test("12개 영어 단계가 요구 필드를 모두 제공한다", () => {
  assert.equal(model.STAGES.length, 12);
  assert.deepEqual(model.STAGES.map((stage) => stage.id), [
    "elementary_basic", "elementary_upper", "middle_1", "middle_2", "middle_3",
    "high_1", "high_2", "high_3", "college_prep", "toefl_basic",
    "toefl_intermediate", "toefl_advanced",
  ]);
  for (const stage of model.STAGES) {
    for (const field of ["id", "displayName", "order", "schoolBand", "vocabularyDifficulty", "sentenceComplexity", "readingLength", "inferenceDepth"]) {
      assert.notEqual(stage[field], undefined, `${stage.id}.${field}`);
    }
  }
});

test("기존 EN-L 레벨은 ID를 바꾸지 않고 새 단계로 매핑된다", () => {
  assert.equal(model.resolveStage({ levelId: "EN-L01" }), "elementary_basic");
  assert.equal(model.resolveStage({ levelId: "EN-L07" }), "middle_3");
  assert.equal(model.resolveStage({ levelId: "EN-L20" }), "toefl_advanced");
});

test("기존 영어 문제를 공통 스키마로 읽고 미지원 유형은 안전하게 fallback한다", () => {
  const legacy = model.normalizeQuestion({
    questionId: "legacy-1",
    levelId: "EN-L05",
    type: "dragMagic",
    prompt: "Choose.",
    choices: ["A", "B"],
    answer: "A",
    acceptedAnswers: ["a"],
  });
  assert.equal(legacy.id, "legacy-1");
  assert.equal(legacy.stage, "middle_1");
  assert.equal(legacy.answerType, "multipleChoice");
  assert.equal(legacy.metadata.answerTypeFallback, true);
  assert.equal(model.evaluateAnswer(legacy, "a").correct, true);
});

test("대표 샘플 문제와 단어가 새 스키마로 직렬화된다", () => {
  assert.equal(samples.questions.length, 8);
  assert.equal(samples.vocabulary.length, 3);
  for (const question of samples.questions) {
    const normalized = model.normalizeQuestion(question);
    assert.ok(model.ANSWER_TYPES.includes(normalized.answerType));
    assert.doesNotThrow(() => JSON.stringify(normalized));
  }
  for (const word of samples.vocabulary) {
    const normalized = model.normalizeVocabulary(word);
    assert.ok(normalized.word);
    assert.ok(normalized.primaryMeaning);
    assert.doesNotThrow(() => JSON.stringify(normalized));
  }
});

test("answerType별 정답 인식이 동작한다", () => {
  const multipleChoice = samples.questions[0];
  const fillBlank = samples.questions[1];
  const wordOrder = samples.questions[2];
  const errorFinding = samples.questions[3];
  assert.equal(model.evaluateAnswer(multipleChoice, "행복한").correct, true);
  assert.equal(model.evaluateAnswer(fillBlank, "Goes.").correct, true);
  assert.equal(model.evaluateAnswer(wordOrder, ["I", "usually", "read", "before", "bed"]).correct, true);
  assert.equal(model.evaluateAnswer(errorFinding, "enjoy").correct, true);
});

test("오답 원인은 문제 태그를 우선 보존하고 기본 분류를 제공한다", () => {
  assert.deepEqual(model.diagnoseError(samples.questions[2], ["I", "read"]), ["wordOrderError"]);
  assert.deepEqual(model.diagnoseError({
    id: "fallback-error",
    answerType: "sentenceInsertion",
    question: "Where?",
    choices: ["A", "B"],
    correctAnswer: "B",
  }, "A"), ["referenceTargetConfusion"]);
});

test("복습 간격은 정답 시 증가하고 오답 시 즉시 복습으로 돌아간다", () => {
  const first = model.calculateReviewSchedule({}, true, "2026-07-01T00:00:00.000Z");
  const second = model.calculateReviewSchedule(first, true, "2026-07-02T00:00:00.000Z");
  const wrong = model.calculateReviewSchedule(second, false, "2026-07-03T00:00:00.000Z");
  assert.ok(second.intervalDays > first.intervalDays);
  assert.equal(wrong.intervalDays, 0);
  assert.equal(wrong.currentState, "immediateReview");
  assert.equal(wrong.correctStreak, 0);
});

test("단어 상태는 다차원 숙련도를 거쳐 mastered로 전환된다", () => {
  let progress = {};
  for (const dimension of model.MASTERY_DIMENSIONS) {
    for (let index = 0; index < 4; index += 1) {
      progress = model.updateVocabularyProgress(progress, {
        wordId: "word-1",
        stage: "middle_1",
        dimension,
        correct: true,
        attemptedAt: `2026-07-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
      });
    }
  }
  assert.equal(progress.vocabularyState, "mastered");
  assert.equal(progress.attempts, 20);
  assert.ok(Object.values(progress.masteryDimensions).every((score) => score >= .75));
});

test("문제·세션 결과가 분리된 구조로 저장된다", () => {
  const attempt = model.recordQuestionAttempt({}, {
    userId: "student@example.com",
    question: samples.questions[0],
    selectedAnswer: "행복한",
    responseTime: 1200,
  });
  assert.equal(attempt.state.questionResults.length, 1);
  assert.equal(attempt.result.correct, true);
  const session = model.createSessionResult({
    userId: "student@example.com",
    stage: "elementary_basic",
    questionResults: attempt.state.questionResults,
    newVocabularyCount: 1,
  });
  assert.equal(session.correctCount, 1);
  assert.equal(session.newVocabularyCount, 1);
  const vocabulary = model.createVocabularyResult({
    userId: "student@example.com",
    word: samples.vocabulary[0],
    dimension: "meaningRecognition",
    correct: true,
  });
  assert.equal(vocabulary.wordId, samples.vocabulary[0].id);
  assert.equal(vocabulary.vocabularyState, "learning");
});

test("기존 진행 필드를 보존하면서 로컬 상태를 왕복 저장한다", () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
  };
  const initial = model.createEnglishLearningState({
    completedStages: ["EN-L01-C01"],
    completedEnglishStageIds: ["EN-L01-C01-S01"],
  });
  model.saveState(storage, "student", initial);
  const loaded = model.loadState(storage, "student");
  assert.deepEqual(loaded.legacy.completedStages, ["EN-L01-C01"]);
  assert.deepEqual(loaded.legacy.completedEnglishStageIds, ["EN-L01-C01-S01"]);
});

test("Firebase appState가 있으면 같은 영어 전용 키로 안전하게 hydrate한다", async () => {
  const memory = new Map();
  const storage = {
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
  };
  const cloud = {
    stateSyncEnabled: true,
    loadUserState: async (key) => {
      assert.equal(key, model.CLOUD_STATE_KEY);
      return { schemaVersion: 1, questionResults: [{ questionId: "remote-q" }] };
    },
  };
  const hydrated = await model.hydrateState(storage, "student", cloud);
  assert.equal(hydrated.questionResults[0].questionId, "remote-q");
  assert.ok(memory.has(model.storageKey("student")));
});

test("구버전 영어 코퍼스 전체를 ID 손실 없이 새 스키마로 직렬화한다", () => {
  const root = path.resolve(__dirname, "..", "data", "english-questions");
  const files = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => fs.readdirSync(path.join(root, entry.name))
      .filter((name) => name.endsWith(".json"))
      .map((name) => path.join(root, entry.name, name)));
  let questionCount = 0;
  for (const file of files) {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const stage of document.stages || []) {
      for (const legacyQuestion of stage.questions || []) {
        const normalized = model.normalizeQuestion(legacyQuestion, {
          levelId: document.levelId,
          courseId: document.courseId,
          stageId: stage.stageId,
        });
        assert.equal(normalized.id, legacyQuestion.questionId);
        assert.doesNotThrow(() => JSON.stringify(normalized));
        questionCount += 1;
      }
    }
  }
  assert.ok(questionCount >= 22000, `normalized ${questionCount} questions`);
});

test("단계별 세션 비율의 합은 1이다", () => {
  for (const stage of model.STAGES) {
    const sum = Object.values(model.sessionRatios(stage.id)).reduce((total, value) => total + value, 0);
    assert.ok(Math.abs(sum - 1) < 0.000001, stage.id);
  }
});

test("영어 세션은 여섯 단계 순서를 유지하며 목표 문항 수를 정확히 배분한다", () => {
  const plan = model.buildSessionPlan("toefl_advanced", 20);
  assert.deepEqual(plan.map((item) => item.phase), model.SESSION_SEQUENCE);
  assert.equal(plan.reduce((sum, item) => sum + item.count, 0), 20);
  assert.ok(plan.find((item) => item.phase === "reading").count > plan.find((item) => item.phase === "newVocabulary").count);
});
