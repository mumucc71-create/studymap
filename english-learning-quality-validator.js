(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_QUALITY_VALIDATOR = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const REQUIRED_FIELDS = Object.freeze([
    "problemId", "level", "cycleId", "sentenceFamilyId", "questionType", "prompt", "passageId",
    "choices", "correctChoiceIndex", "choiceMisconceptionTags", "targetVocabularyIds", "reviewVocabularyIds",
    "targetGrammarIds", "reviewGrammarIds", "structureSignature", "contextDomain", "difficulty",
    "difficultyEvidence", "explanation", "independentCheck",
  ]);
  const READING_TYPES = new Set(["READING_DETAIL", "READING_REASON", "READING_VOCABULARY"]);
  const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const words = (value) => normalize(value).split(/\s+/).filter(Boolean);
  const multisetKey = (value) => words(value).sort().join("|");
  const englishKoreanParticle = /[A-Za-z]+(?:을|를|은|는|이|가|와|과|에게|에서|으로|로|도|만)(?:\s|[.,!?]|$)/u;
  const adjacentDuplicate = /\b([A-Za-z]+)\s+\1\b/i;

  function validateProblem(problem) {
    const errors = [];
    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in problem) || problem[field] == null || (typeof problem[field] === "string" && !problem[field].trim())) {
        if (field !== "passageId" || problem.passage) errors.push(`MISSING_FIELD:${field}`);
      }
    });
    if (!Array.isArray(problem.choices) || problem.choices.length !== 4) errors.push("CHOICE_COUNT");
    if (!Number.isInteger(problem.correctChoiceIndex) || problem.correctChoiceIndex < 0 || problem.correctChoiceIndex > 3) errors.push("CORRECT_INDEX");
    if (new Set((problem.choices || []).map(normalize)).size !== (problem.choices || []).length) errors.push("DUPLICATE_CHOICE");
    if ((problem.choices || []).some((choice) => !String(choice).trim())) errors.push("EMPTY_CHOICE");
    if (!Array.isArray(problem.choiceMisconceptionTags) || problem.choiceMisconceptionTags.length !== 4) {
      errors.push("MISCONCEPTION_TAG_SHAPE");
    } else {
      problem.choiceMisconceptionTags.forEach((tag, index) => {
        if (index === problem.correctChoiceIndex && tag !== "CORRECT") errors.push("CORRECT_TAG");
        if (index !== problem.correctChoiceIndex && (!tag || tag === "CORRECT")) errors.push(`MISSING_DISTRACTOR_TAG:${index}`);
      });
    }
    const surfaces = [problem.prompt, problem.passage, ...(problem.choices || [])].filter(Boolean);
    if (surfaces.some((text) => englishKoreanParticle.test(String(text)))) errors.push("MIXED_KOREAN_PARTICLE");
    if ((problem.choices || []).some((choice) => adjacentDuplicate.test(choice))) errors.push("ADJACENT_WORD_DUPLICATION");
    const correct = problem.choices?.[problem.correctChoiceIndex] || "";
    (problem.choices || []).forEach((choice, index) => {
      if (index !== problem.correctChoiceIndex && multisetKey(choice) && multisetKey(choice) === multisetKey(correct)) {
        errors.push(`RANDOM_WORD_REVERSAL:${index}`);
      }
    });
    const lengths = (problem.choices || []).map((choice) => words(choice).length).filter(Boolean);
    if (lengths.length === 4 && Math.max(...lengths) > Math.max(6, Math.min(...lengths) * 4)) errors.push("CHOICE_LENGTH_IMBALANCE");
    if (!problem.targetVocabularyIds?.length && !problem.targetGrammarIds?.length) errors.push("MISSING_LEARNING_TARGET");
    if (READING_TYPES.has(problem.questionType) && (!problem.passageId || !problem.passage)) errors.push("READING_WITHOUT_PASSAGE");
    if (!problem.explanation || problem.explanation.length < 12) errors.push("WEAK_EXPLANATION");
    return errors;
  }

  function validateEnglishLevel1Content(content) {
    const cycles = Array.isArray(content?.cycles) ? content.cycles : [];
    const problems = Array.isArray(content?.problems) ? content.problems : cycles.flatMap((cycle) => cycle.problems || []);
    const errors = [];
    const ids = new Set();
    const structures = new Map();
    const correctIndexCounts = [0, 0, 0, 0];
    const typeCounts = {};
    const misconceptionTags = new Set();

    if (cycles.length < 10) errors.push("CYCLE_COUNT_BELOW_10");
    if (problems.length < 100) errors.push("PROBLEM_COUNT_BELOW_100");
    for (const problem of problems) {
      if (ids.has(problem.problemId)) errors.push(`DUPLICATE_ID:${problem.problemId}`);
      ids.add(problem.problemId);
      const problemErrors = validateProblem(problem);
      problemErrors.forEach((error) => errors.push(`${problem.problemId}:${error}`));
      structures.set(problem.structureSignature, (structures.get(problem.structureSignature) || 0) + 1);
      if (Number.isInteger(problem.correctChoiceIndex)) correctIndexCounts[problem.correctChoiceIndex] += 1;
      typeCounts[problem.questionType] = (typeCounts[problem.questionType] || 0) + 1;
      (problem.choiceMisconceptionTags || []).filter((tag) => tag !== "CORRECT").forEach((tag) => misconceptionTags.add(tag));
    }
    structures.forEach((count, signature) => { if (count > 1) errors.push(`DUPLICATE_STRUCTURE:${signature}`); });
    if (Math.max(...correctIndexCounts) > Math.ceil(problems.length * 0.4)) errors.push("CORRECT_INDEX_CONCENTRATION");

    for (const cycle of cycles) {
      const cycleProblems = cycle.problems || [];
      if (cycleProblems.length < 10 || cycleProblems.length > 14) errors.push(`${cycle.cycleId}:QUESTION_COUNT`);
      if (!cycleProblems.some((problem) => READING_TYPES.has(problem.questionType))) errors.push(`${cycle.cycleId}:MISSING_READING`);
      if (!cycleProblems.some((problem) => problem.independentCheck)) errors.push(`${cycle.cycleId}:MISSING_INDEPENDENT_CHECK`);
      for (const word of cycle.targetVocabularyIds || []) {
        const contexts = new Set(cycleProblems.filter((problem) => problem.targetVocabularyIds.includes(word)).map((problem) => problem.sentenceFamilyId));
        if (contexts.size < 3) errors.push(`${cycle.cycleId}:VOCAB_CONTEXT_BELOW_3:${word}`);
      }
      for (const grammar of cycle.targetGrammarIds || []) {
        if (!cycleProblems.some((problem) => problem.targetGrammarIds.includes(grammar))) errors.push(`${cycle.cycleId}:GRAMMAR_NOT_USED:${grammar}`);
      }
    }

    return Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      stats: Object.freeze({
        cycleCount: cycles.length,
        problemCount: problems.length,
        uniqueProblemIds: ids.size,
        uniqueStructures: structures.size,
        questionTypeCounts: Object.freeze(typeCounts),
        correctIndexCounts: Object.freeze(correctIndexCounts),
        misconceptionTagCount: misconceptionTags.size,
        hintFreeIndependentChecks: problems.filter((problem) => problem.independentCheck).length,
      }),
    });
  }

  return Object.freeze({ REQUIRED_FIELDS, validateProblem, validateEnglishLevel1Content });
});
