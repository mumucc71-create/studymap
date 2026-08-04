(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_SPACED_REVIEW = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const REVIEW_OFFSETS = Object.freeze([0, 1, 3, 7]);

  function normalizeLevels(levels) {
    return levels.filter(Boolean).sort((a, b) => a.level - b.level);
  }

  function cycleAt(levels, flatIndex) {
    const all = normalizeLevels(levels).flatMap((level) => level.cycles);
    return all[Math.min(flatIndex, all.length - 1)] || null;
  }

  function wordExplanation(cycle, word) {
    const source = cycle.problems.find((problem) => problem.targetVocabularyIds.includes(word));
    return String(source?.explanation || `${word} is a useful word in this course.`).replace(/\s+/g, " ").trim();
  }

  function makeChoices(targetCycle, word) {
    const alternatives = (targetCycle.targetVocabularyIds || []).filter((id) => id !== word);
    const review = (targetCycle.reviewVocabularyIds || []).filter((id) => id !== word);
    return [word, ...new Set([...alternatives, ...review, "change", "result", "support"])].slice(0, 4);
  }

  function makeReviewProblem(originCycle, targetCycle, word, label, ordinal) {
    const choices = makeChoices(targetCycle, word);
    const originLevel = Number(originCycle.level || originCycle.problems?.[0]?.level || 1);
    const correctChoiceIndex = (originLevel + ordinal) % 4;
    const ordered = [...choices];
    const [correct] = ordered.splice(0, 1);
    ordered.splice(correctChoiceIndex, 0, correct);
    return Object.freeze({
      problemId: `${originCycle.cycleId}-REVIEW-${word}-${label}`,
      level: targetCycle.level,
      cycleId: targetCycle.cycleId,
      originCycleId: originCycle.cycleId,
      reviewCheckpoint: label,
      sentenceFamilyId: `${targetCycle.cycleId}-spaced-${word}-${label}`,
      questionType: "SPACED_VOCABULARY_REVIEW",
      prompt: `In a new ${String(targetCycle.theme || targetCycle.contextDomain || "learning").toLowerCase()} context, which word matches this meaning? ${wordExplanation(originCycle, word)}`,
      passageId: null,
      passage: "",
      choices: Object.freeze(ordered),
      correctChoiceIndex,
      choiceMisconceptionTags: Object.freeze(ordered.map((choice, index) => index === correctChoiceIndex ? "CORRECT" : "WORD_MEANING_CONFUSION")),
      targetVocabularyIds: Object.freeze([]),
      reviewVocabularyIds: Object.freeze([word]),
      targetGrammarIds: Object.freeze([]),
      reviewGrammarIds: Object.freeze([...(targetCycle.reviewGrammarIds || [])]),
      structureSignature: `${targetCycle.cycleId}:SPACED_REVIEW:${word}:${label}`,
      contextDomain: targetCycle.contextDomain,
      difficulty: targetCycle.level,
      difficultyEvidence: "Recalls a previously learned word after a scheduled delay in a different cycle theme.",
      explanation: wordExplanation(originCycle, word),
      independentCheck: label === "PLUS_7" || label === "NEXT_LEVEL",
      estimatedSolveTime: 35,
    });
  }

  function buildSpacedReviewPlan(levels) {
    const orderedLevels = normalizeLevels(levels);
    const allCycles = orderedLevels.flatMap((level) => level.cycles);
    const assignments = [];
    allCycles.forEach((originCycle, originIndex) => {
      originCycle.targetVocabularyIds.forEach((word, wordIndex) => {
        REVIEW_OFFSETS.forEach((offset) => {
          const targetIndex = Math.min(originIndex + offset, allCycles.length - 1);
          const targetCycle = cycleAt(orderedLevels, targetIndex);
          const label = offset === 0 ? "SAME_CYCLE_LATE" : `PLUS_${offset}`;
          assignments.push(makeReviewProblem(originCycle, targetCycle, word, label, wordIndex + offset));
        });
        const nextLevel = orderedLevels.find((level) => level.level === originCycle.level + 1);
        if (nextLevel) assignments.push(makeReviewProblem(originCycle, nextLevel.cycles[Math.min(wordIndex, 1)], word, "NEXT_LEVEL", wordIndex + 11));
      });
    });
    return Object.freeze(assignments);
  }

  function getReviewsForCycle(plan, cycleId) {
    return plan.filter((problem) => problem.cycleId === cycleId);
  }

  function summarizeWordExposure(levels, plan) {
    const summary = new Map();
    normalizeLevels(levels).flatMap((level) => level.problems).forEach((problem) => {
      [...problem.targetVocabularyIds, ...problem.reviewVocabularyIds].forEach((word) => {
        const item = summary.get(word) || { word, baseProblemIds: new Set(), reviewProblemIds: new Set(), contexts: new Set(), checkpoints: new Set() };
        item.baseProblemIds.add(problem.problemId);
        item.contexts.add(problem.contextDomain);
        summary.set(word, item);
      });
    });
    plan.forEach((problem) => {
      const word = problem.reviewVocabularyIds[0];
      const item = summary.get(word) || { word, baseProblemIds: new Set(), reviewProblemIds: new Set(), contexts: new Set(), checkpoints: new Set() };
      item.reviewProblemIds.add(problem.problemId);
      item.contexts.add(problem.contextDomain);
      item.checkpoints.add(problem.reviewCheckpoint);
      summary.set(word, item);
    });
    return [...summary.values()].map((item) => Object.freeze({
      word: item.word,
      baseExposureCount: item.baseProblemIds.size,
      reviewExposureCount: item.reviewProblemIds.size,
      distinctContextCount: item.contexts.size,
      checkpoints: Object.freeze([...item.checkpoints]),
    }));
  }

  return Object.freeze({ REVIEW_OFFSETS, buildSpacedReviewPlan, getReviewsForCycle, summarizeWordExposure });
});
