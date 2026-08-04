(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_LEARNING = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const CLOUD_STATE_KEY = "english-learning-v1";
  const ANSWER_TYPES = Object.freeze([
    "multipleChoice", "textInput", "fillBlank", "matching", "wordOrder",
    "errorFinding", "sentenceConnection", "contextChoice", "shortReading",
    "sentenceInsertion", "paragraphOrder", "mainIdea", "logicalBlank",
    "evidenceFinding", "summaryChoice",
  ]);
  const VOCABULARY_STATES = Object.freeze(["newWord", "learning", "sentencePractice", "review", "mastered"]);
  const VOCABULARY_STATE_LABELS = Object.freeze({
    newWord: "처음 배우는 단어",
    learning: "익히는 중",
    sentencePractice: "문장에서 연습",
    review: "다시 복습",
    mastered: "완전히 통과",
  });
  const MASTERY_DIMENSIONS = Object.freeze([
    "meaningRecognition", "contextRecognition", "blankProduction", "discrimination", "delayedRecall",
  ]);
  const ERROR_TAGS = Object.freeze([
    "unknownWordMeaning", "contextMeaningFailure", "wordOrderError", "tenseError",
    "subjectVerbAgreementError", "conjunctionConfusion", "complexSentenceParsingFailure",
    "referenceTargetConfusion", "unsupportedInference", "optionScopeExaggeration",
    "reversedCausality", "changedSubject", "partiallyCorrectOptionTrap",
  ]);

  const STAGES = Object.freeze([
    ["elementary_basic", "초등 기초", "elementary", 1, 1, 30, 1],
    ["elementary_upper", "초등 고학년", "elementary", 2, 2, 55, 2],
    ["middle_1", "중1", "middle", 3, 3, 80, 2],
    ["middle_2", "중2", "middle", 4, 4, 110, 3],
    ["middle_3", "중3", "middle", 5, 5, 140, 3],
    ["high_1", "고1", "high", 6, 6, 190, 4],
    ["high_2", "고2", "high", 7, 7, 240, 4],
    ["high_3", "고3", "high", 8, 8, 300, 5],
    ["college_prep", "대학 영어 준비", "college", 9, 9, 360, 5],
    ["toefl_basic", "TOEFL 기초", "toefl", 10, 10, 430, 6],
    ["toefl_intermediate", "TOEFL 중급", "toefl", 11, 11, 520, 7],
    ["toefl_advanced", "TOEFL 고급", "toefl", 12, 12, 650, 8],
  ].map(([id, displayName, schoolBand, order, vocabularyDifficulty, readingLength, inferenceDepth]) => Object.freeze({
    id,
    displayName,
    order,
    schoolBand,
    vocabularyDifficulty,
    sentenceComplexity: Math.min(8, Math.ceil(order / 1.5)),
    readingLength,
    inferenceDepth,
  })));

  const LEGACY_LEVEL_STAGE = Object.freeze({
    "EN-L01": "elementary_basic", "EN-L02": "elementary_basic",
    "EN-L03": "elementary_upper", "EN-L04": "elementary_upper",
    "EN-L05": "middle_1", "EN-L06": "middle_2", "EN-L07": "middle_3",
    "EN-L08": "high_1", "EN-L09": "high_2", "EN-L10": "high_3",
    "EN-L11": "college_prep", "EN-L12": "toefl_basic", "EN-L13": "toefl_basic",
    "EN-L14": "toefl_basic", "EN-L15": "toefl_intermediate", "EN-L16": "toefl_intermediate",
    "EN-L17": "toefl_intermediate", "EN-L18": "toefl_advanced",
    "EN-L19": "toefl_advanced", "EN-L20": "toefl_advanced",
  });

  const LEGACY_ANSWER_TYPES = Object.freeze({
    "multiple-choice": "multipleChoice",
    multiple_choice: "multipleChoice",
    trueFalse: "multipleChoice",
    shortAnswer: "textInput",
    "short-answer": "textInput",
    cloze: "fillBlank",
    ordering: "wordOrder",
    sentenceOrder: "wordOrder",
    grammarError: "errorFinding",
    reading: "shortReading",
  });

  const SESSION_RATIOS = Object.freeze({
    elementary: { newVocabularyRatio: .3, vocabularyContextRatio: .25, grammarRatio: .2, readingRatio: .15, inferenceRatio: .02, oldReviewRatio: .08 },
    middle: { newVocabularyRatio: .2, vocabularyContextRatio: .2, grammarRatio: .25, readingRatio: .2, inferenceRatio: .08, oldReviewRatio: .07 },
    high: { newVocabularyRatio: .12, vocabularyContextRatio: .14, grammarRatio: .22, readingRatio: .25, inferenceRatio: .2, oldReviewRatio: .07 },
    college: { newVocabularyRatio: .1, vocabularyContextRatio: .13, grammarRatio: .2, readingRatio: .27, inferenceRatio: .23, oldReviewRatio: .07 },
    toefl: { newVocabularyRatio: .08, vocabularyContextRatio: .12, grammarRatio: .18, readingRatio: .28, inferenceRatio: .27, oldReviewRatio: .07 },
  });
  const SESSION_SEQUENCE = Object.freeze([
    "newVocabulary", "vocabularyContext", "vocabularyDiscrimination",
    "grammar", "reading", "oldReview",
  ]);

  const array = (value) => Array.isArray(value) ? value.filter((item) => item != null) : [];
  const text = (value, fallback = "") => value == null ? fallback : String(value);
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0));
  const normalizeText = (value) => text(value).trim().toLowerCase().replace(/[.,!?;:'"()[\]{}]/g, "").replace(/\s+/g, " ");
  const dateString = (value, fallback = null) => {
    const parsed = value ? new Date(value) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : fallback;
  };

  function getStage(stageId) {
    return STAGES.find((stage) => stage.id === stageId) || STAGES[0];
  }

  function resolveStage(value = {}) {
    if (getStage(value.stage)?.id === value.stage) return value.stage;
    const levelId = text(value.levelId || value.level || value.metadata?.levelId).toUpperCase();
    if (LEGACY_LEVEL_STAGE[levelId]) return LEGACY_LEVEL_STAGE[levelId];
    const grade = text(value.grade || value.schoolGrade);
    if (/초등\s*[1-3]/.test(grade)) return "elementary_basic";
    if (/초등/.test(grade)) return "elementary_upper";
    if (/중등?\s*1/.test(grade)) return "middle_1";
    if (/중등?\s*2/.test(grade)) return "middle_2";
    if (/중등?\s*3/.test(grade)) return "middle_3";
    if (/고등?\s*1/.test(grade)) return "high_1";
    if (/고등?\s*2/.test(grade)) return "high_2";
    if (/고등?\s*3/.test(grade)) return "high_3";
    return "elementary_basic";
  }

  function normalizeAnswerType(value, question = {}) {
    const raw = text(value || question.answerType || question.type);
    const mapped = LEGACY_ANSWER_TYPES[raw] || raw;
    if (ANSWER_TYPES.includes(mapped)) return { answerType: mapped, fallback: false, originalAnswerType: raw };
    return {
      answerType: array(question.choices).length ? "multipleChoice" : "textInput",
      fallback: Boolean(raw),
      originalAnswerType: raw || null,
    };
  }

  function normalizeQuestion(source = {}, context = {}) {
    const type = normalizeAnswerType(source.answerType || source.type, source);
    const correctAnswer = source.correctAnswer ?? source.answer ?? "";
    return {
      id: text(source.id || source.questionId || context.id || `english-${Date.now()}`),
      subject: "english",
      stage: resolveStage({ ...context, ...source }),
      level: text(source.level || source.levelId || context.levelId),
      category: text(source.category || source.questionCategory || source.skill || "general"),
      answerType: type.answerType,
      instruction: text(source.instruction),
      passage: text(source.passage || source.readingPassage),
      question: text(source.question || source.prompt),
      choices: array(source.choices).map(String),
      correctAnswer,
      acceptableAnswers: array(source.acceptableAnswers || source.acceptedAnswers).map(String),
      explanation: text(source.explanation, "정답과 문장의 근거를 다시 확인해 보세요."),
      vocabularyTargets: array(source.vocabularyTargets || (source.vocabularyWord ? [source.vocabularyWord] : [])),
      grammarTargets: array(source.grammarTargets || (source.grammarFocus ? [source.grammarFocus] : [])),
      readingSkills: array(source.readingSkills || (source.readingSkill ? [source.readingSkill] : [])),
      inferenceSkills: array(source.inferenceSkills),
      errorTags: array(source.errorTags).filter((tag) => ERROR_TAGS.includes(tag)),
      difficulty: clamp(source.difficulty || 1, 1, 12),
      elite: Boolean(source.elite),
      metadata: {
        ...(source.metadata && typeof source.metadata === "object" ? source.metadata : {}),
        courseId: source.courseId || context.courseId || null,
        stageId: source.stageId || context.stageId || null,
        legacyQuestionId: source.questionId || null,
        originalAnswerType: source.metadata?.originalAnswerType || type.originalAnswerType,
        answerTypeFallback: Boolean(source.metadata?.answerTypeFallback || type.fallback),
        eliteTier: source.eliteTier || null,
        reasoningDifficulty: source.reasoningDifficulty || null,
        distractorComplexity: source.distractorComplexity || null,
        matchingPairs: array(source.matchingPairs || source.metadata?.matchingPairs),
        tokens: array(source.tokens || source.metadata?.tokens),
        errorIndex: Number.isInteger(source.errorIndex) ? source.errorIndex : source.metadata?.errorIndex,
      },
    };
  }

  function normalizeVocabulary(source = {}, context = {}) {
    const meanings = array(source.meanings).map(String);
    const primaryMeaning = text(source.primaryMeaning || source.meaning || meanings[0], "뜻을 준비 중이에요.");
    return {
      id: text(source.id || source.wordId || `${resolveStage({ ...context, ...source })}:${text(source.word).toLowerCase()}`),
      word: text(source.word),
      pronunciation: text(source.pronunciation),
      audioUrl: text(source.audioUrl),
      primaryMeaning,
      meanings: meanings.length ? meanings : [primaryMeaning],
      partOfSpeech: text(source.partOfSpeech, "unknown"),
      exampleSentence: text(source.exampleSentence || source.example),
      exampleTranslation: text(source.exampleTranslation),
      synonyms: array(source.synonyms).map(String),
      antonyms: array(source.antonyms).map(String),
      multipleMeanings: array(source.multipleMeanings),
      wordForms: array(source.wordForms),
      academicExamples: array(source.academicExamples),
      paraphrases: array(source.paraphrases),
      stage: resolveStage({ ...context, ...source }),
      difficulty: clamp(source.difficulty || 1, 1, 12),
      tags: array(source.tags).map(String),
    };
  }

  function emptyMastery() {
    return Object.fromEntries(MASTERY_DIMENSIONS.map((key) => [key, 0]));
  }

  function normalizeMastery(value = {}) {
    return Object.fromEntries(MASTERY_DIMENSIONS.map((key) => [key, clamp(value[key])]));
  }

  function nextVocabularyState(mastery, attempts = 0) {
    const scores = normalizeMastery(mastery);
    if (attempts <= 0) return "newWord";
    if (MASTERY_DIMENSIONS.every((key) => scores[key] >= .75) && scores.delayedRecall >= .75 && attempts >= 5) return "mastered";
    if (scores.meaningRecognition >= .65 && scores.contextRecognition >= .6 && scores.blankProduction >= .55) return "review";
    if (scores.meaningRecognition >= .55 && scores.contextRecognition >= .45) return "sentencePractice";
    return "learning";
  }

  function calculateReviewSchedule(previous = {}, correct, reviewedAt = new Date().toISOString()) {
    const reviewDate = new Date(dateString(reviewedAt, new Date().toISOString()));
    const streak = correct ? Math.max(1, Number(previous.correctStreak || 0) + 1) : 0;
    const previousInterval = Math.max(0, Number(previous.intervalDays || 0));
    const intervalDays = correct
      ? Math.max(1, Math.round(previousInterval ? previousInterval * Math.min(2.5, Number(previous.easeFactor || 2)) : 1))
      : 0;
    const easeFactor = clamp((Number(previous.easeFactor) || 2.2) + (correct ? .08 : -.25), 1.3, 2.6);
    reviewDate.setUTCDate(reviewDate.getUTCDate() + intervalDays);
    return {
      firstLearnedAt: dateString(previous.firstLearnedAt, dateString(reviewedAt, new Date().toISOString())),
      lastReviewedAt: dateString(reviewedAt, new Date().toISOString()),
      nextReviewAt: reviewDate.toISOString(),
      reviewCount: Math.max(0, Number(previous.reviewCount || 0)) + 1,
      correctStreak: streak,
      incorrectCount: Math.max(0, Number(previous.incorrectCount || 0)) + (correct ? 0 : 1),
      intervalDays,
      easeFactor,
      masteryScore: clamp((Number(previous.masteryScore) || 0) + (correct ? .12 : -.16)),
      currentState: correct ? "scheduled" : "immediateReview",
    };
  }

  function updateVocabularyProgress(previous = {}, attempt = {}) {
    const mastery = normalizeMastery(previous.masteryDimensions || emptyMastery());
    const dimension = MASTERY_DIMENSIONS.includes(attempt.dimension) ? attempt.dimension : "meaningRecognition";
    mastery[dimension] = clamp(mastery[dimension] + (attempt.correct ? .22 : -.18));
    const attempts = Math.max(0, Number(previous.attempts || 0)) + 1;
    const reviewSchedule = calculateReviewSchedule(previous.reviewSchedule, Boolean(attempt.correct), attempt.attemptedAt);
    return {
      ...previous,
      wordId: text(previous.wordId || attempt.wordId),
      stage: resolveStage({ stage: attempt.stage || previous.stage }),
      vocabularyState: nextVocabularyState(mastery, attempts),
      masteryDimensions: mastery,
      reviewSchedule: { ...reviewSchedule, masteryScore: Object.values(mastery).reduce((sum, score) => sum + score, 0) / MASTERY_DIMENSIONS.length },
      attempts,
      updatedAt: dateString(attempt.attemptedAt, new Date().toISOString()),
    };
  }

  function answerComparable(value, answerType) {
    if (answerType === "matching" && value && typeof value === "object") {
      return Object.keys(value).sort().map((key) => `${normalizeText(key)}:${normalizeText(value[key])}`).join("|");
    }
    if (Array.isArray(value)) return value.map(normalizeText).join(" ");
    return normalizeText(value);
  }

  function evaluateAnswer(questionSource, response) {
    const question = normalizeQuestion(questionSource);
    const candidates = [question.correctAnswer, ...question.acceptableAnswers];
    const actual = answerComparable(response, question.answerType);
    const correct = candidates.some((candidate) => answerComparable(candidate, question.answerType) === actual);
    return { correct, normalizedResponse: actual, accepted: candidates.map((candidate) => answerComparable(candidate, question.answerType)) };
  }

  function diagnoseError(questionSource, response) {
    const question = normalizeQuestion(questionSource);
    if (evaluateAnswer(question, response).correct) return [];
    if (question.errorTags.length) return question.errorTags;
    const byType = {
      matching: "contextMeaningFailure",
      wordOrder: "wordOrderError",
      errorFinding: question.grammarTargets.some((tag) => /tense/i.test(tag)) ? "tenseError" : "subjectVerbAgreementError",
      sentenceConnection: "conjunctionConfusion",
      shortReading: "complexSentenceParsingFailure",
      sentenceInsertion: "referenceTargetConfusion",
      paragraphOrder: "changedSubject",
      mainIdea: "optionScopeExaggeration",
      logicalBlank: "unsupportedInference",
      evidenceFinding: "unsupportedInference",
      summaryChoice: "partiallyCorrectOptionTrap",
    };
    return [byType[question.answerType] || (question.vocabularyTargets.length ? "unknownWordMeaning" : "contextMeaningFailure")];
  }

  function createEnglishLearningState(source = {}) {
    return {
      schemaVersion: SCHEMA_VERSION,
      vocabularyResults: source.vocabularyResults && typeof source.vocabularyResults === "object" ? source.vocabularyResults : {},
      questionResults: array(source.questionResults),
      sessionResults: array(source.sessionResults),
      legacy: {
        completedStages: array(source.completedStages || source.legacy?.completedStages),
        completedEnglishStageIds: array(source.completedEnglishStageIds || source.legacy?.completedEnglishStageIds),
      },
      updatedAt: dateString(source.updatedAt, null),
    };
  }

  function createQuestionResult(input = {}) {
    const question = normalizeQuestion(input.question || {});
    const evaluation = evaluateAnswer(question, input.selectedAnswer);
    return {
      userId: text(input.userId, "guest"),
      questionId: question.id,
      stage: question.stage,
      category: question.category,
      answerType: question.answerType,
      correct: evaluation.correct,
      selectedAnswer: input.selectedAnswer,
      responseTime: Math.max(0, Number(input.responseTime || 0)),
      errorTags: evaluation.correct ? [] : diagnoseError(question, input.selectedAnswer),
      vocabularyTargets: question.vocabularyTargets,
      grammarTargets: question.grammarTargets,
      readingSkills: question.readingSkills,
      inferenceSkills: question.inferenceSkills,
      attemptedAt: dateString(input.attemptedAt, new Date().toISOString()),
    };
  }

  function createVocabularyResult(input = {}) {
    const word = normalizeVocabulary(input.word || { id: input.wordId, word: input.wordId, stage: input.stage });
    const progress = updateVocabularyProgress(input.previous, {
      wordId: word.id,
      stage: word.stage,
      dimension: input.dimension,
      correct: input.correct,
      attemptedAt: input.attemptedAt,
    });
    return {
      userId: text(input.userId, "guest"),
      wordId: word.id,
      stage: word.stage,
      vocabularyState: progress.vocabularyState,
      masteryDimensions: progress.masteryDimensions,
      reviewSchedule: progress.reviewSchedule,
      attempts: progress.attempts,
      updatedAt: progress.updatedAt,
    };
  }

  function createSessionResult(input = {}) {
    const results = array(input.questionResults);
    return {
      userId: text(input.userId, "guest"),
      sessionId: text(input.sessionId, `english-session-${Date.now()}`),
      stage: resolveStage({ stage: input.stage }),
      startedAt: dateString(input.startedAt, new Date().toISOString()),
      completedAt: dateString(input.completedAt, null),
      newVocabularyCount: Math.max(0, Number(input.newVocabularyCount || 0)),
      reviewVocabularyCount: Math.max(0, Number(input.reviewVocabularyCount || 0)),
      grammarCount: results.filter((item) => array(item.grammarTargets).length).length,
      readingCount: results.filter((item) => array(item.readingSkills).length).length,
      correctCount: results.filter((item) => item.correct).length,
      errorTagSummary: results.flatMap((item) => array(item.errorTags)).reduce((summary, tag) => {
        summary[tag] = (summary[tag] || 0) + 1;
        return summary;
      }, {}),
    };
  }

  function recordQuestionAttempt(stateSource, input) {
    const state = createEnglishLearningState(stateSource);
    const result = createQuestionResult(input);
    state.questionResults = [...state.questionResults, result].slice(-2000);
    state.updatedAt = result.attemptedAt;
    return { state, result };
  }

  function sessionRatios(stageId) {
    const band = getStage(stageId).schoolBand;
    return { ...(SESSION_RATIOS[band] || SESSION_RATIOS.elementary) };
  }

  function buildSessionPlan(stageId, totalItems = 20) {
    const total = Math.max(6, Math.round(Number(totalItems) || 20));
    const ratios = sessionRatios(stageId);
    const weights = [
      ratios.newVocabularyRatio,
      ratios.vocabularyContextRatio,
      ratios.oldReviewRatio / 2,
      ratios.grammarRatio,
      ratios.readingRatio + ratios.inferenceRatio,
      ratios.oldReviewRatio / 2,
    ];
    const counts = weights.map((ratio) => Math.floor(total * ratio));
    let remaining = total - counts.reduce((sum, count) => sum + count, 0);
    for (let index = 0; remaining > 0; index = (index + 1) % counts.length) {
      counts[index] += 1;
      remaining -= 1;
    }
    return SESSION_SEQUENCE.map((phase, index) => ({
      order: index + 1,
      phase,
      count: counts[index],
      ratio: weights[index],
    }));
  }

  function storageKey(userId = "guest") {
    return `studyCoinEnglishLearningV1:${text(userId, "guest")}`;
  }

  function loadState(storage, userId = "guest", legacy = {}) {
    if (!storage?.getItem) return createEnglishLearningState(legacy);
    try {
      return createEnglishLearningState({ ...legacy, ...JSON.parse(storage.getItem(storageKey(userId))) });
    } catch {
      return createEnglishLearningState(legacy);
    }
  }

  function saveState(storage, userId, state, cloudAuth) {
    const normalized = createEnglishLearningState({ ...state, updatedAt: new Date().toISOString() });
    if (storage?.setItem) storage.setItem(storageKey(userId), JSON.stringify(normalized));
    if (cloudAuth?.stateSyncEnabled && typeof cloudAuth.saveUserState === "function") {
      Promise.resolve(cloudAuth.saveUserState(CLOUD_STATE_KEY, normalized)).catch(() => {});
    }
    return normalized;
  }

  async function hydrateState(storage, userId, cloudAuth, legacy = {}) {
    const local = loadState(storage, userId, legacy);
    if (!cloudAuth?.stateSyncEnabled || typeof cloudAuth.loadUserState !== "function") return local;
    try {
      const remote = await cloudAuth.loadUserState(CLOUD_STATE_KEY);
      if (!remote) return local;
      const normalized = createEnglishLearningState({ ...legacy, ...remote });
      if (storage?.setItem) storage.setItem(storageKey(userId), JSON.stringify(normalized));
      return normalized;
    } catch {
      return local;
    }
  }

  return {
    SCHEMA_VERSION, CLOUD_STATE_KEY, ANSWER_TYPES, VOCABULARY_STATES,
    VOCABULARY_STATE_LABELS, MASTERY_DIMENSIONS, ERROR_TAGS, STAGES,
    LEGACY_LEVEL_STAGE, SESSION_RATIOS, SESSION_SEQUENCE, getStage, resolveStage,
    normalizeAnswerType, normalizeQuestion, normalizeVocabulary,
    emptyMastery, normalizeMastery, nextVocabularyState,
    calculateReviewSchedule, updateVocabularyProgress, evaluateAnswer,
    diagnoseError, createEnglishLearningState, createQuestionResult,
    createVocabularyResult, createSessionResult, recordQuestionAttempt,
    sessionRatios, buildSessionPlan,
    storageKey, loadState, saveState, hydrateState,
  };
});
