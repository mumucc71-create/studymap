(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_REMEDIATION = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const idOf = (problem) => problem?.problemId || problem?.id;
  function createRemediationState() {
    return { misconceptionFamilies: {}, active: null, completed: [], returnCheckpoint: null };
  }

  function commonTarget(a, b) {
    const aTargets = [...(a.targetVocabularyIds || []), ...(a.targetGrammarIds || [])];
    const bTargets = new Set([...(b.targetVocabularyIds || []), ...(b.targetGrammarIds || [])]);
    return aTargets.some((target) => bTargets.has(target));
  }

  function findDifferentFamilyProblems(problems, failedProblem, count = 2) {
    return problems
      .filter((problem) => idOf(problem) !== idOf(failedProblem))
      .filter((problem) => problem.sentenceFamilyId !== failedProblem.sentenceFamilyId)
      .filter((problem) => commonTarget(problem, failedProblem))
      .sort((a, b) => Number(b.cycleId === failedProblem.cycleId) - Number(a.cycleId === failedProblem.cycleId))
      .slice(0, count);
  }

  function recordEnglishError(state, evidence, problems) {
    const next = clone(state || createRemediationState());
    const failed = problems.find((problem) => idOf(problem) === evidence.problemId);
    if (!failed) return { state: next, decision: "UNKNOWN_PROBLEM" };
    const tag = String(evidence.misconceptionTag || "UNCLASSIFIED_ERROR");
    const families = new Set(next.misconceptionFamilies[tag] || []);
    families.add(failed.sentenceFamilyId);
    next.misconceptionFamilies[tag] = [...families];
    if (families.size < 2) {
      const check = findDifferentFamilyProblems(problems, failed, 1)[0] || null;
      return { state: next, decision: "RECHECK", problem: check };
    }
    const candidates = findDifferentFamilyProblems(problems, failed, 2);
    if (candidates.length < 2) return { state: next, decision: "EXTRA_EXPLANATION", problem: candidates[0] || null };
    next.returnCheckpoint = { cycleId: failed.cycleId, problemId: idOf(failed), position: evidence.position ?? null };
    next.active = { misconceptionTag: tag, sourceProblemId: idOf(failed), problemIds: candidates.map(idOf), passedFamilyIds: [] };
    return { state: next, decision: "START_REMEDIATION", problems: candidates };
  }

  function recordRemediationAnswer(state, problem, correct) {
    const next = clone(state);
    if (!next.active || !next.active.problemIds.includes(idOf(problem))) return { state: next, decision: "NOT_REMEDIATION" };
    if (!correct) return { state: next, decision: "CONTINUE_REMEDIATION" };
    const families = new Set(next.active.passedFamilyIds || []);
    families.add(problem.sentenceFamilyId);
    next.active.passedFamilyIds = [...families];
    if (families.size < 2) return { state: next, decision: "CONTINUE_REMEDIATION" };
    const checkpoint = next.returnCheckpoint;
    next.completed.push({ misconceptionTag: next.active.misconceptionTag, problemIds: [...next.active.problemIds] });
    next.active = null;
    next.returnCheckpoint = null;
    return { state: next, decision: "RETURN_TO_CYCLE", checkpoint };
  }

  function buildRemediationIndex(levels) {
    const problems = levels.filter(Boolean).flatMap((level) => level.problems);
    return Object.fromEntries(problems.map((problem) => [problem.problemId, Object.freeze(
      findDifferentFamilyProblems(problems.filter((candidate) => candidate.level === problem.level), problem, 2).map(idOf)
    )]));
  }

  return Object.freeze({ createRemediationState, findDifferentFamilyProblems, recordEnglishError, recordRemediationAnswer, buildRemediationIndex });
});
