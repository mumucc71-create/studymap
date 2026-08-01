(function (root, factory) {
  const model = typeof module === "object" && module.exports
    ? require("./math-level-test-question-model.js")
    : root.STUDY_MATH_LEVEL_TEST_QUESTION_MODEL;
  const banks = typeof module === "object" && module.exports
    ? require("./math-level-test-grade-banks.js")
    : root.STUDY_MATH_LEVEL_TEST_GRADE_BANKS;
  const api = factory(model, banks);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_TEST_QUALITY_VALIDATOR = api;
})(typeof window !== "undefined" ? window : globalThis, function (model, banks) {
  "use strict";
  if (!model || !banks) throw new Error("MATH_LEVEL_TEST_QUALITY_VALIDATOR_DEPENDENCY_MISSING");

  function validateSession(session = {}) {
    const errors = [];
    if (session.status === banks.STATUS.NOT_READY) return Object.freeze({ valid: true, errors: Object.freeze([]), unknownCanonicalCount: 0 });
    const contract = banks.SESSION_CONTRACTS[session.gradeBand];
    if (!contract) errors.push("UNKNOWN_GRADE_CONTRACT");
    if (!Array.isArray(session.questions)) errors.push("QUESTIONS_NOT_ARRAY");
    const questions = session.questions || [];
    if (contract && (questions.length < contract.min || questions.length > contract.max)) errors.push("INVALID_SESSION_LENGTH");
    const ids = new Set();
    questions.forEach((question) => {
      model.validateLevelTestQuestion(question).errors.forEach((error) => errors.push(`${question.problemId}:${error}`));
      if (ids.has(question.id)) errors.push(`${question.id}:DUPLICATE_ID`);
      ids.add(question.id);
      if (banks.EXCLUDED_IDS.has(question.sourceProblemId || question.problemId)) errors.push(`${question.problemId}:EXCLUDED_PROBLEM`);
      if (question.testGradeBand !== session.gradeBand) errors.push(`${question.problemId}:GRADE_ROUTE_MISMATCH`);
    });
    const unknownCanonicalCount = questions.filter((question) => !question.canonicalConceptId && !question.unitAliasId).length;
    if (unknownCanonicalCount) errors.push(`UNKNOWN_CANONICAL:${unknownCanonicalCount}`);
    if (session.gradeBand === "M3") {
      banks.MIDDLE3_UNIT_CONTRACTS.forEach((unit) => {
        const unitQuestions = questions.filter((question) => question.unit === unit.unitName || question.domain === unit.unitName);
        if (unitQuestions.length !== 4) errors.push(`${unit.unitName}:INVALID_UNIT_COUNT`);
        if (new Set(unitQuestions.map((question) => question.structureSignature)).size !== 4) errors.push(`${unit.unitName}:DUPLICATE_STRUCTURE`);
        if (new Set(unitQuestions.map((question) => question.solutionPathSignature)).size !== 4) errors.push(`${unit.unitName}:DUPLICATE_SOLUTION_PATH`);
        if (unitQuestions.filter((question) => question.independentCheck).length !== 1) errors.push(`${unit.unitName}:INVALID_INDEPENDENT_COUNT`);
      });
    }
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors), unknownCanonicalCount });
  }

  return Object.freeze({ validateSession });
});
