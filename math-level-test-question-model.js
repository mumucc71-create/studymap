(function (root, factory) {
  const mapper = typeof module === "object" && module.exports
    ? require("./math-level-test-concept-mapper.js")
    : root.STUDY_MATH_LEVEL_TEST_CONCEPT_MAPPER;
  const api = factory(mapper);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_TEST_QUESTION_MODEL = api;
})(typeof window !== "undefined" ? window : globalThis, function (mapper) {
  "use strict";

  if (!mapper) throw new Error("MATH_LEVEL_TEST_QUESTION_MODEL_DEPENDENCY_MISSING");

  const ANSWER_TYPES = Object.freeze(["MULTIPLE_CHOICE", "SHORT_ANSWER", "EXPRESSION_INPUT", "STEP_ORDER", "WRITTEN_RESPONSE"]);
  const GRADE_BANDS = Object.freeze(["G4", "G5", "G6", "M1", "M2", "M3", "H1", "H2", "H3"]);
  const GRADE_RANK = Object.freeze({ G4: 4, G5: 5, G6: 6, M1: 7, M2: 8, M3: 9, H1: 10, H2: 11, H3: 12 });
  const text = (value) => String(value ?? "").trim();
  const list = (value) => Array.isArray(value) ? value.filter((item) => item != null) : value == null ? [] : [value];
  const unique = (value) => [...new Set(list(value).map(text).filter(Boolean))];

  function normalizeStructureText(value) {
    return text(value)
      .normalize("NFKC")
      .replace(/\d+(?:[.,]\d+)*/g, "#")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function inferAnswerType(source) {
    if (ANSWER_TYPES.includes(source.answerType)) return source.answerType;
    return list(source.choices).length ? "MULTIPLE_CHOICE" : "SHORT_ANSWER";
  }

  function createLevelTestQuestion(source = {}, options = {}) {
    const mapping = mapper.mapLevelTestQuestionToConceptIds({ ...source, canonicalConceptId: options.canonicalConceptId || source.canonicalConceptId });
    const canonicalConceptId = mapping.status === "MAPPED" ? mapping.canonicalConceptIds[0] : null;
    const unitAliasId = mapping.status === "UNIT_ALIAS_ONLY" ? mapping.unitAliasId : text(options.unitAliasId || source.unitAliasId) || null;
    const problemId = text(source.problemId || source.questionId || source.id);
    const prompt = text(source.prompt || source.questionText || source.problem);
    const expectedAnswer = source.expectedAnswer ?? source.correctAnswer ?? source.answer;
    const choices = list(source.choices).map(String);
    const testGradeBand = mapper.normalizeGradeBand(options.testGradeBand || source.testGradeBand || source.gradeBand || source.grade);
    const structureSignature = text(source.structureSignature)
      || `level-test:${canonicalConceptId || unitAliasId || "unknown"}:${normalizeStructureText(prompt)}`;
    const solutionPathSignature = text(source.solutionPathSignature)
      || `level-test-path:${canonicalConceptId || unitAliasId || "unknown"}:${text(source.validatorMode || source.answerType || "direct").toLowerCase()}:${normalizeStructureText(prompt)}:${normalizeStructureText(source.explanation || "direct")}`;
    const difficulty = text(source.difficulty || "BASIC");
    const acceptedAnswers = unique([expectedAnswer, ...list(source.acceptedAnswers)]);
    const question = {
      problemId,
      canonicalConceptId,
      unitAliasId,
      testGradeBand,
      answerType: inferAnswerType(source),
      difficulty,
      difficultyEvidence: list(source.difficultyEvidence).length ? [...source.difficultyEvidence] : [`${difficulty} 진단 문항`],
      structureSignature,
      solutionPathSignature,
      misconceptionTags: unique(source.misconceptionTags).length
        ? unique(source.misconceptionTags)
        : [`${canonicalConceptId || unitAliasId || "UNKNOWN"}_DIAGNOSTIC_ERROR`.toUpperCase()],
      prerequisiteConceptIds: unique(source.prerequisiteConceptIds || source.prerequisiteConcepts),
      independentCheck: options.independentCheck ?? source.independentCheck === true,
      prompt,
      choices,
      expectedAnswer,
      acceptedAnswers,
      validatorMode: text(source.validatorMode || source.answerContract?.validatorMode || source.validatorId || "TEXT_NORMALIZED"),
      curriculumScope: text(source.curriculumScope || source.curriculumVersion || "2015_REVISED_MATH"),
      estimatedSolveTime: Number(source.estimatedSolveTime || source.seconds || 45),
      evidenceScope: canonicalConceptId ? "CANONICAL_CONCEPT" : unitAliasId ? "UNIT_ENTRY" : "UNKNOWN",
      diagnosticRole: text(options.diagnosticRole || source.diagnosticRole || "ENTRY"),
      misconceptionTagsRequired: true,
      sourceProblemId: problemId,
      // Existing quiz UI compatibility aliases.
      id: problemId,
      questionId: problemId,
      conceptId: canonicalConceptId || unitAliasId,
      concept: text(source.conceptTitle || source.unit || source.unitName || canonicalConceptId || unitAliasId),
      unit: text(source.unit || source.unitName || source.conceptTitle),
      domain: text(source.domain || source.unit || source.unitName || source.conceptTitle || "수학"),
      problem: prompt,
      questionText: prompt,
      answer: String(expectedAnswer ?? ""),
      correctAnswer: String(expectedAnswer ?? ""),
      explanation: text(source.explanation || "정답과 풀이 과정을 다시 확인하세요."),
      adaptiveLevel: Math.max(1, Math.min(3, Number(source.adaptiveLevel || source.difficulty || 1) || 1)),
      isRepresentative: source.isRepresentative !== false,
      rank: Number(source.rank || GRADE_RANK[testGradeBand] || 0),
      levelLabel: text(source.levelLabel || source.grade || testGradeBand),
      stable: text(source.stable || source.unit || source.conceptTitle || canonicalConceptId),
      start: text(source.start || source.unit || source.conceptTitle || canonicalConceptId),
      code: text(source.code || `LEVEL-${testGradeBand}`),
    };
    return Object.freeze(question);
  }

  function validateLevelTestQuestion(question = {}) {
    const errors = [];
    const requiredText = ["problemId", "testGradeBand", "answerType", "difficulty", "structureSignature", "solutionPathSignature", "prompt", "validatorMode", "curriculumScope"];
    requiredText.forEach((field) => { if (!text(question[field])) errors.push(`MISSING_${field.toUpperCase()}`); });
    if (!GRADE_BANDS.includes(question.testGradeBand)) errors.push("INVALID_TEST_GRADE_BAND");
    if (!ANSWER_TYPES.includes(question.answerType)) errors.push("INVALID_ANSWER_TYPE");
    if (!question.canonicalConceptId && !question.unitAliasId) errors.push("UNKNOWN_CANONICAL_CONCEPT");
    if (question.canonicalConceptId && question.unitAliasId) errors.push("AMBIGUOUS_CONCEPT_SCOPE");
    if (question.answerType === "MULTIPLE_CHOICE" && (!Array.isArray(question.choices) || question.choices.length < 2)) errors.push("INVALID_CHOICES");
    if (question.answerType !== "WRITTEN_RESPONSE" && question.expectedAnswer == null) errors.push("MISSING_EXPECTED_ANSWER");
    if (!Array.isArray(question.difficultyEvidence) || !question.difficultyEvidence.length) errors.push("MISSING_DIFFICULTY_EVIDENCE");
    if (!Array.isArray(question.misconceptionTags)) errors.push("MISSING_MISCONCEPTION_TAGS");
    if (!Array.isArray(question.prerequisiteConceptIds)) errors.push("MISSING_PREREQUISITES");
    if (!(Number(question.estimatedSolveTime) > 0)) errors.push("INVALID_ESTIMATED_SOLVE_TIME");
    return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
  }

  function toCanonicalEvidence(question, submission = {}, options = {}) {
    const result = submission.result || (submission.correct === true ? "CORRECT" : "INCORRECT");
    return Object.freeze({
      canonicalConceptId: question.canonicalConceptId || null,
      unitAliasId: question.canonicalConceptId ? null : question.unitAliasId || null,
      evidenceScope: question.canonicalConceptId ? "CANONICAL_CONCEPT" : question.unitAliasId ? "UNIT_ENTRY" : "UNKNOWN",
      correct: result === "CORRECT",
      incorrect: result === "INCORRECT",
      result,
      misconceptionTags: unique(submission.misconceptionTags || question.misconceptionTags),
      structureSignature: question.structureSignature,
      solutionPathSignature: question.solutionPathSignature,
      difficulty: question.difficulty,
      independentCheck: question.independentCheck === true,
      timestamp: submission.timestamp ?? options.timestamp ?? 0,
      problemId: question.problemId,
      submissionId: text(submission.submissionId),
    });
  }

  function mergeCanonicalEvidence(existing = [], incoming = []) {
    const byKey = new Map();
    [...existing, ...incoming].forEach((item) => {
      if (!item) return;
      const scope = item.canonicalConceptId || item.unitAliasId || "UNKNOWN";
      const key = item.structureSignature ? `${scope}|${item.structureSignature}`
        : item.submissionId || `${scope}|${item.problemId}`;
      if (!byKey.has(key)) byKey.set(key, Object.freeze({ ...item }));
    });
    return Object.freeze([...byKey.values()]);
  }

  return Object.freeze({ ANSWER_TYPES, GRADE_BANDS, GRADE_RANK, normalizeStructureText, createLevelTestQuestion, validateLevelTestQuestion, toCanonicalEvidence, mergeCanonicalEvidence });
});
