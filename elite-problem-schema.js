(function initEliteProblemSchema(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_PROBLEM_SCHEMA = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteProblemSchema() {
  "use strict";

  const ELITE_LEVELS = Object.freeze(["HIGH", "TOP"]);
  const ANSWER_TYPES = Object.freeze([
    "MULTIPLE_CHOICE",
    "SHORT_ANSWER",
    "EXPRESSION",
    "PROCESS",
    "WRITTEN",
  ]);
  const CONTENT_ROLES = Object.freeze([
    "ELITE_PROBE",
    "ELITE_RECHECK",
    "ELITE_CEILING",
    "ELITE_WRITTEN",
  ]);
  const SUBJECTS = Object.freeze(["수학", "영어"]);

  const MATH_ERROR_CODES = Object.freeze([
    "CONDITION_OMISSION",
    "DOMAIN_NEGLECT",
    "SIGN_ERROR",
    "FORMULA_OVERUSE",
    "REPRESENTATION_ERROR",
    "EQUATION_SETUP_FAILURE",
    "CASE_SPLIT_FAILURE",
    "CONCEPT_SELECTION_FAILURE",
    "MULTI_CONCEPT_LINK_FAILURE",
    "STRATEGY_FAILURE",
    "VALIDATION_FAILURE",
    "CALCULATION_ERROR",
  ]);

  const ENGLISH_ERROR_CODES = Object.freeze([
    "VOCAB_CONTEXT_ERROR",
    "GRAMMAR_STRUCTURE_ERROR",
    "LONG_SENTENCE_PARSING_FAILURE",
    "LOGICAL_CONNECTOR_ERROR",
    "MAIN_IDEA_ERROR",
    "INFERENCE_ERROR",
    "SENTENCE_ORDER_ERROR",
    "SENTENCE_INSERTION_ERROR",
    "DISTRACTOR_OVERGENERALIZATION",
    "DISTRACTOR_SCOPE_ERROR",
    "EVIDENCE_SELECTION_FAILURE",
    "TIME_PRESSURE_ERROR",
  ]);

  const REQUIRED_FIELDS = Object.freeze([
    "problemId",
    "subject",
    "gradeOrLevel",
    "curriculumVersion",
    "domain",
    "conceptId",
    "eliteLevel",
    "answerType",
    "prompt",
    "choices",
    "correctAnswer",
    "explanation",
    "reasoningGoals",
    "trapTypes",
    "distractorErrorMap",
    "prerequisiteConceptIds",
    "structureSignature",
    "solutionPathSignature",
    "estimatedMeaningfulSteps",
    "expectedThinkingMinutes",
    "contentRole",
    "validatorId",
  ]);

  function normalizeText(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim();
  }

  function allowedErrorCodes(subject) {
    return subject === "수학" ? MATH_ERROR_CODES : ENGLISH_ERROR_CODES;
  }

  function validateEliteProblem(problem) {
    const errors = [];
    if (!problem || typeof problem !== "object") return ["문항 객체가 아닙니다."];

    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in problem)) errors.push(`${field} 필드가 없습니다.`);
    });
    if (errors.length) return errors;

    if (!SUBJECTS.includes(problem.subject)) errors.push("subject가 수학 또는 영어가 아닙니다.");
    if (!ELITE_LEVELS.includes(problem.eliteLevel)) errors.push("eliteLevel이 HIGH 또는 TOP이 아닙니다.");
    if (!ANSWER_TYPES.includes(problem.answerType)) errors.push("지원하지 않는 answerType입니다.");
    if (!CONTENT_ROLES.includes(problem.contentRole)) errors.push("지원하지 않는 contentRole입니다.");
    if (!normalizeText(problem.problemId)) errors.push("problemId가 비어 있습니다.");
    if (!normalizeText(problem.prompt)) errors.push("문제가 비어 있습니다.");
    if (!normalizeText(problem.correctAnswer)) errors.push("correctAnswer가 비어 있습니다.");
    if (!normalizeText(problem.explanation)) errors.push("explanation이 비어 있습니다.");
    if (!normalizeText(problem.structureSignature)) errors.push("structureSignature가 비어 있습니다.");
    if (!normalizeText(problem.solutionPathSignature)) errors.push("solutionPathSignature가 비어 있습니다.");
    if (!normalizeText(problem.validatorId)) errors.push("validatorId가 비어 있습니다.");
    if (!Array.isArray(problem.choices)) errors.push("choices가 배열이 아닙니다.");
    if (!Array.isArray(problem.reasoningGoals) || problem.reasoningGoals.length < 2) {
      errors.push("reasoningGoals가 두 개 이상이어야 합니다.");
    }
    if (!Array.isArray(problem.trapTypes) || problem.trapTypes.length < 1) {
      errors.push("trapTypes가 하나 이상이어야 합니다.");
    }
    if (!Array.isArray(problem.prerequisiteConceptIds)) {
      errors.push("prerequisiteConceptIds가 배열이 아닙니다.");
    }
    if (!problem.distractorErrorMap || typeof problem.distractorErrorMap !== "object") {
      errors.push("distractorErrorMap이 객체가 아닙니다.");
    }
    if (problem.directFormulaSubstitution !== false) {
      errors.push("directFormulaSubstitution은 false여야 합니다.");
    }

    const minimumSteps = problem.eliteLevel === "TOP" ? 5 : 4;
    const minimumMinutes = problem.eliteLevel === "TOP" ? 10 : 5;
    if (Number(problem.estimatedMeaningfulSteps) < minimumSteps) {
      errors.push(`${problem.eliteLevel} 최소 사고 단계 ${minimumSteps}를 충족하지 않습니다.`);
    }
    if (Number(problem.expectedThinkingMinutes) < minimumMinutes) {
      errors.push(`${problem.eliteLevel} 최소 사고시간 ${minimumMinutes}분을 충족하지 않습니다.`);
    }

    if (problem.answerType === "MULTIPLE_CHOICE") {
      if (problem.choices.length !== 4) errors.push("객관식 선택지는 정확히 네 개여야 합니다.");
      const normalizedAnswer = normalizeText(problem.correctAnswer);
      const answerCount = problem.choices.filter((choice) => normalizeText(choice) === normalizedAnswer).length;
      if (answerCount !== 1) errors.push("객관식 정답이 선택지에 정확히 한 번 있어야 합니다.");
      if (new Set(problem.choices.map(normalizeText)).size !== problem.choices.length) {
        errors.push("객관식 선택지가 중복됩니다.");
      }
      const wrongChoices = problem.choices.filter((choice) => normalizeText(choice) !== normalizedAnswer);
      const mappedChoices = Object.keys(problem.distractorErrorMap).map(normalizeText);
      wrongChoices.forEach((choice) => {
        if (!mappedChoices.includes(normalizeText(choice))) {
          errors.push(`오답 선택지 '${choice}'의 오류 코드가 없습니다.`);
        }
      });
      const allowed = new Set(allowedErrorCodes(problem.subject));
      Object.entries(problem.distractorErrorMap).forEach(([choice, detail]) => {
        if (!wrongChoices.some((item) => normalizeText(item) === normalizeText(choice))) {
          errors.push(`정답 또는 존재하지 않는 선택지 '${choice}'가 distractorErrorMap에 있습니다.`);
        }
        if (!detail || !allowed.has(detail.code)) {
          errors.push(`선택지 '${choice}'의 오류 코드가 허용 목록에 없습니다.`);
        }
        if (!normalizeText(detail?.explanation)) {
          errors.push(`선택지 '${choice}'의 실제 오류 설명이 없습니다.`);
        }
      });
    } else if (problem.choices.length !== 0) {
      errors.push("비객관식 문항의 choices는 빈 배열이어야 합니다.");
    }

    if (!normalizeText(problem.levelRationale)) errors.push("HIGH/TOP 판정 근거가 없습니다.");
    if (!normalizeText(problem.curriculumEvidence)) errors.push("교육과정 범위 근거가 없습니다.");
    if (!normalizeText(problem.answerRubric)) errors.push("답안 판정 기준이 없습니다.");
    if (problem.humanReviewStatus !== "APPROVED") errors.push("사람 검수 상태가 APPROVED가 아닙니다.");
    if (problem.duplicateVerdict !== "DISTINCT") errors.push("실질 중복 판정이 DISTINCT가 아닙니다.");

    if (problem.subject === "영어") {
      if (!Array.isArray(problem.evidenceSentences) || problem.evidenceSentences.length < 1) {
        errors.push("영어 문항에 정답 근거 문장이 없습니다.");
      }
    }

    return errors;
  }

  function compareProblemStructure(first, second) {
    if (first.problemId === second.problemId) return "EFFECTIVE_DUPLICATE";
    if (normalizeText(first.structureSignature) === normalizeText(second.structureSignature)) {
      return "EFFECTIVE_DUPLICATE";
    }
    if (normalizeText(first.solutionPathSignature) === normalizeText(second.solutionPathSignature)) {
      return "PARTIAL_DUPLICATE";
    }
    return "DISTINCT";
  }

  function auditProblemSet(problems) {
    const errors = [];
    const seenIds = new Set();
    problems.forEach((problem, index) => {
      validateEliteProblem(problem).forEach((error) => {
        errors.push(`${problem?.problemId || `index-${index}`}: ${error}`);
      });
      if (seenIds.has(problem.problemId)) errors.push(`${problem.problemId}: problemId가 중복됩니다.`);
      seenIds.add(problem.problemId);
    });
    for (let first = 0; first < problems.length; first += 1) {
      for (let second = first + 1; second < problems.length; second += 1) {
        const verdict = compareProblemStructure(problems[first], problems[second]);
        if (verdict !== "DISTINCT") {
          errors.push(`${problems[first].problemId}/${problems[second].problemId}: ${verdict}`);
        }
      }
    }
    return errors;
  }

  return Object.freeze({
    ELITE_LEVELS,
    ANSWER_TYPES,
    CONTENT_ROLES,
    SUBJECTS,
    MATH_ERROR_CODES,
    ENGLISH_ERROR_CODES,
    REQUIRED_FIELDS,
    normalizeText,
    validateEliteProblem,
    compareProblemStructure,
    auditProblemSet,
  });
});
