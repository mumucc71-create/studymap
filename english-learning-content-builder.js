(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_CONTENT_BUILDER = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const TYPE_EVIDENCE = Object.freeze({
    VOCABULARY_MEANING: "Recognizes a target word from a precise English definition.",
    CONTEXT_VOCABULARY: "Uses sentence meaning to distinguish related words.",
    GRAMMAR_FORM: "Applies the cycle grammar to familiar vocabulary.",
    SENTENCE_CHOICE: "Rejects authentic learner errors in a shared context.",
    SENTENCE_EXPANSION: "Adds exactly one requested meaning element.",
    SENTENCE_CONNECTION: "Selects a connector that preserves the stated relationship.",
    READING_DETAIL: "Finds an explicitly stated detail in the passage.",
    READING_RELATION: "Connects cause, sequence, reference, contrast, or purpose across sentences.",
    READING_VOCABULARY: "Infers a word meaning from its passage context.",
    TRANSFER: "Transfers a learned word or grammar pattern to a different setting.",
    INDEPENDENT_CHECK: "Combines vocabulary, grammar, and context without a leading hint.",
    TOEFL_READING: "Applies a named TOEFL reading operation to an original article-style passage.",
  });

  function tags(correctIndex, wrongTags) {
    let wrongIndex = 0;
    return Object.freeze(Array.from({ length: 4 }, (_, index) => (
      index === correctIndex ? "CORRECT" : wrongTags[wrongIndex++]
    )));
  }

  function rotateProblem(entry, context) {
    const desired = (context.globalIndex + context.questionIndex) % 4;
    const rotation = (desired - entry.correctChoiceIndex + 4) % 4;
    const rotate = (items) => rotation ? [...items.slice(-rotation), ...items.slice(0, -rotation)] : [...items];
    const choices = rotate(entry.choices);
    const choiceTags = rotate(tags(entry.correctChoiceIndex, entry.wrongTags));
    const type = entry.questionType;
    return Object.freeze({
      problemId: `${context.cycle.cycleId}-Q${String(context.questionIndex + 1).padStart(2, "0")}`,
      level: context.level,
      cycleId: context.cycle.cycleId,
      sentenceFamilyId: `${context.cycle.cycleId}-${entry.family}`,
      questionType: type,
      prompt: entry.prompt,
      passageId: entry.passage ? `${context.cycle.cycleId}-PASSAGE` : null,
      passage: entry.passage || "",
      articleTitle: entry.articleTitle || "",
      articleStructure: Object.freeze([...(entry.articleStructure || [])]),
      toeflTaskType: entry.toeflTaskType || null,
      choices: Object.freeze(choices),
      correctChoiceIndex: desired,
      choiceMisconceptionTags: choiceTags,
      targetVocabularyIds: Object.freeze([...(entry.vocabulary || [])]),
      reviewVocabularyIds: Object.freeze([...(context.cycle.reviewVocabularyIds || [])]),
      targetGrammarIds: Object.freeze([...(entry.grammar || [])]),
      reviewGrammarIds: Object.freeze([...(context.cycle.reviewGrammarIds || [])]),
      structureSignature: `${context.cycle.cycleId}:${type}:${entry.family}`,
      contextDomain: context.cycle.contextDomain,
      difficulty: entry.difficulty || context.level,
      difficultyEvidence: entry.difficultyEvidence || TYPE_EVIDENCE[type],
      explanation: entry.explanation,
      independentCheck: type === "INDEPENDENT_CHECK",
      estimatedSolveTime: entry.estimatedSolveTime || (entry.passage ? 90 : 45),
    });
  }

  function validateCycleSource(cycle) {
    if (!cycle?.cycleId || !cycle?.title || !cycle?.theme) throw new Error("INVALID_CYCLE_IDENTITY");
    if (!Array.isArray(cycle.entries) || cycle.entries.length !== 12) throw new Error(`${cycle.cycleId}:ENTRY_COUNT`);
    if (!cycle.targetVocabularyIds?.length || !cycle.targetGrammarIds?.length) throw new Error(`${cycle.cycleId}:TARGETS`);
  }

  function makeEntry(questionType, source) {
    return Object.freeze({ ...source, questionType });
  }

  function buildLessonEntries(lesson) {
    const words = lesson.vocabulary.map((item) => item.id);
    const wordChoices = (correctId) => [correctId, ...words.filter((word) => word !== correctId)].slice(0, 4);
    const wordEntry = (index, type) => {
      const item = lesson.vocabulary[index];
      const choices = type === "VOCABULARY_MEANING" ? [item.id, ...(item.meaningDistractors || words.filter((word) => word !== item.id)).slice(0, 3)] : wordChoices(item.id);
      return makeEntry(type, {
        prompt: type === "VOCABULARY_MEANING" ? item.meaningPrompt : item.contextPrompt,
        choices,
        correctChoiceIndex: choices.indexOf(item.id),
        wrongTags: item.wrongTags || ["WORD_MEANING_CONFUSION", "CONTEXT_MEANING_FAILURE", "CONTEXT_MEANING_FAILURE"],
        vocabulary: [item.id],
        grammar: item.grammar || lesson.targetGrammarIds.slice(0, 1),
        family: item.family,
        explanation: item.explanation,
      });
    };
    return Object.freeze([
      wordEntry(0, "VOCABULARY_MEANING"),
      wordEntry(1, "CONTEXT_VOCABULARY"),
      wordEntry(2, "CONTEXT_VOCABULARY"),
      makeEntry("GRAMMAR_FORM", lesson.grammar),
      makeEntry("SENTENCE_CHOICE", lesson.sentence),
      makeEntry("SENTENCE_EXPANSION", lesson.expansion),
      makeEntry("SENTENCE_CONNECTION", lesson.connection),
      makeEntry(lesson.reading.detail.questionType || "READING_DETAIL", { ...lesson.reading.detail, passage: lesson.passage }),
      makeEntry(lesson.reading.relation.questionType || "READING_RELATION", { ...lesson.reading.relation, passage: lesson.passage }),
      makeEntry(lesson.reading.vocabulary.questionType || "READING_VOCABULARY", { ...lesson.reading.vocabulary, passage: lesson.passage }),
      makeEntry(lesson.transfer.questionType || "TRANSFER", lesson.transfer.questionType === "TOEFL_READING" ? { ...lesson.transfer, passage: lesson.passage } : lesson.transfer),
      makeEntry("INDEPENDENT_CHECK", lesson.independent),
    ]);
  }

  function buildCompactLesson(source) {
    const wordObjects = source.words.map(([id, meaningPrompt, contextPrompt, explanation, meaningDistractors = null, grammar = null], index) => ({
      id, meaningPrompt: index === 0 ? meaningPrompt : "", contextPrompt, explanation,
      family: `${id}-${index === 0 ? "meaning" : "context"}`,
      meaningDistractors: meaningDistractors || source.words.map((word) => word[0]).filter((word) => word !== id).slice(0, 3),
      grammar: grammar || source.targetGrammarIds.slice(0, 1),
    }));
    const names = ["grammar", "sentence", "expansion", "connection", "detail", "relation", "readingVocabulary", "transfer", "independent"];
    const unpack = (value, fallbackFamily) => {
      const [prompt, choices, correctChoiceIndex, explanation, vocabulary, grammar, wrongTags, extra = {}] = value;
      return {
        prompt, choices, correctChoiceIndex, explanation, vocabulary, grammar,
        wrongTags: wrongTags || ["CONTEXT_MEANING_FAILURE", "GRAMMAR_FORM_ERROR", "DETAIL_CONFUSION"],
        family: extra.family || fallbackFamily,
        difficulty: extra.difficulty,
        articleTitle: extra.articleTitle,
        articleStructure: extra.articleStructure,
        toeflTaskType: extra.toeflTaskType,
        questionType: extra.questionType,
      };
    };
    const tasks = Object.fromEntries(names.map((name) => [name, unpack(source.tasks[name], name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`))]));
    const lesson = {
      ...source,
      vocabulary: wordObjects,
      grammar: tasks.grammar,
      sentence: tasks.sentence,
      expansion: tasks.expansion,
      connection: tasks.connection,
      passage: source.passage,
      reading: { detail: tasks.detail, relation: tasks.relation, vocabulary: tasks.readingVocabulary },
      transfer: tasks.transfer,
      independent: tasks.independent,
    };
    return { ...lesson, entries: buildLessonEntries(lesson) };
  }

  function buildLevel(definition) {
    const level = Number(definition.level);
    const cycles = Object.freeze(definition.cycles.map((cycle, cycleIndex) => {
      validateCycleSource(cycle);
      const problems = Object.freeze(cycle.entries.map((entry, questionIndex) => rotateProblem(entry, {
        level,
        cycle,
        questionIndex,
        globalIndex: (level - 1) * 120 + cycleIndex * 12,
      })));
      return Object.freeze({
        cycleId: cycle.cycleId,
        level,
        title: cycle.title,
        theme: cycle.theme,
        contextDomain: cycle.contextDomain,
        targetVocabularyIds: Object.freeze([...cycle.targetVocabularyIds]),
        reviewVocabularyIds: Object.freeze([...(cycle.reviewVocabularyIds || [])]),
        targetGrammarIds: Object.freeze([...cycle.targetGrammarIds]),
        reviewGrammarIds: Object.freeze([...(cycle.reviewGrammarIds || [])]),
        sentenceFamilyIds: Object.freeze(problems.map((problem) => problem.sentenceFamilyId)),
        passageIds: Object.freeze([...new Set(problems.map((problem) => problem.passageId).filter(Boolean))]),
        problemIds: Object.freeze(problems.map((problem) => problem.problemId)),
        remedialProblemIds: Object.freeze([]),
        independentProblemIds: Object.freeze(problems.filter((problem) => problem.independentCheck).map((problem) => problem.problemId)),
        prerequisiteCycleIds: Object.freeze([...(cycle.prerequisiteCycleIds || [])]),
        nextCycleIds: Object.freeze([...(cycle.nextCycleIds || [])]),
        estimatedDuration: cycle.estimatedDuration || 14,
        problems,
      });
    }));
    return Object.freeze({
      version: definition.version,
      level,
      cycles,
      problems: Object.freeze(cycles.flatMap((cycle) => cycle.problems)),
    });
  }

  return Object.freeze({ TYPE_EVIDENCE, buildLevel, buildLessonEntries, buildCompactLesson });
});
