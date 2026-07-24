(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEARNING_SCHEMA = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "math-learning-schema-v2";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const ANSWER_TYPES = Object.freeze([
    "MULTIPLE_CHOICE",
    "SHORT_ANSWER",
    "EXPRESSION_INPUT",
    "STEP_ORDER",
    "WRITTEN_RESPONSE",
  ]);
  const CONTENT_ROLES = Object.freeze([
    "LEARNING_EXAMPLE",
    "LEARNING_PRACTICE",
    "LEARNING_FINAL_CHECK",
    "LEVEL_TEST",
    "LEVEL_RECHECK",
    "DIAGNOSIS",
  ]);
  const REQUIRED_FIELDS = Object.freeze([
    "problemId",
    "grade",
    "unitId",
    "conceptId",
    "stage",
    "answerType",
    "reasoningGoals",
    "prerequisiteConceptIds",
    "solutionPath",
    "structureSignature",
    "solutionPathSignature",
    "estimatedMeaningfulSteps",
    "trapTypes",
    "validatorId",
    "contentRole",
  ]);
  const A5_REQUIRED_REASONING_GOALS = Object.freeze([
    "CONDITION_READING",
    "CONCEPT_SELECTION",
    "MULTI_CONCEPT_LINK",
    "STRATEGY_SELECTION",
    "EXPLANATION",
  ]);
  const A5_ADDITIONAL_REASONING_GOALS = Object.freeze([
    "REPRESENTATION",
    "EQUATION_SETUP",
    "REVERSE_REASONING",
    "PROOF_JUSTIFICATION",
    "CASE_ANALYSIS",
    "RESULT_VALIDATION",
  ]);
  const A5_REQUIRED_ARCHETYPES = Object.freeze([
    "HIGH_DIFFICULTY_MULTIPLE_CHOICE",
    "SHORT_ANSWER",
    "EXPRESSION",
    "PROCESS",
    "WRITTEN",
    "STRATEGY_SELECTION",
    "INTEGRATED",
  ]);

  const STAGE_CRITERIA = Object.freeze({
    BASIC: Object.freeze({ minimumSteps: 1, minimumLinkedConcepts: 1, memorizationAllowed: true }),
    A1: Object.freeze({ minimumSteps: 2, minimumLinkedConcepts: 1, memorizationAllowed: false }),
    A2: Object.freeze({ minimumSteps: 2, minimumLinkedConcepts: 1, memorizationAllowed: false }),
    A3: Object.freeze({ minimumSteps: 3, minimumLinkedConcepts: 1, memorizationAllowed: false }),
    A4: Object.freeze({ minimumSteps: 4, minimumLinkedConcepts: 2, minimumLinkedConditions: 3, memorizationAllowed: false }),
    A5: Object.freeze({ minimumSteps: 4, minimumLinkedConcepts: 2, minimumLinkedConditions: 2, memorizationAllowed: false }),
  });

  function normalizedText(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .replace(/[−–—]/g, "-")
      .replace(/[×·]/g, "*")
      .replace(/÷/g, "/")
      .replace(/²/g, "^2")
      .replace(/³/g, "^3")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function normalizedStructuralText(value) {
    return normalizedText(value)
      .replace(/[+-]?\d+(?:\.\d+)?(?:\/\d+)?/g, "#")
      .replace(/#+/g, "#");
  }

  function uniqueStrings(values) {
    return [...new Set((Array.isArray(values) ? values : []).map((value) => String(value)).filter(Boolean))];
  }

  function normalizedAnswer(value) {
    return normalizedText(value)
      .replace(/원|개|cm|㎠|cm2|초|m(?![a-z])/g, "")
      .replace(/,/g, "");
  }

  function numericValue(value) {
    const text = normalizedAnswer(value);
    const fraction = text.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
    if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
    const number = Number(text);
    return Number.isFinite(number) ? number : null;
  }

  function acceptedAnswers(problem) {
    return uniqueStrings([
      problem?.correctAnswer,
      problem?.answer,
      ...(problem?.acceptedAnswers || []),
    ]);
  }

  function canonicalExpression(value) {
    let text = normalizedText(value)
      .replace(/^y=/, "")
      .replace(/^f\(x\)=/, "")
      .replace(/\^/g, "**");
    text = text
      .replace(/(\d|\))(?=[a-z(])/g, "$1*")
      .replace(/([a-z]|\))(?=\d|\()/g, "$1*")
      .replace(/\)(?=\()/g, ")*");
    return text;
  }

  function expressionVariables(expression) {
    return uniqueStrings(String(expression).match(/[a-z]+/g) || []);
  }

  function safeExpressionValue(expression, values) {
    const canonical = canonicalExpression(expression);
    const variables = expressionVariables(canonical);
    const allowed = new Set(["x", "y", "a", "b", "c", "h", "k", "t"]);
    if (variables.some((variable) => !allowed.has(variable))) return null;
    let substituted = canonical;
    variables.sort((left, right) => right.length - left.length).forEach((variable) => {
      const value = Number(values[variable]);
      substituted = substituted.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${Number.isFinite(value) ? value : 0})`);
    });
    if (!/^[0-9+\-*/().]+$/.test(substituted)) return null;
    try {
      const result = Function(`"use strict"; return (${substituted});`)();
      return Number.isFinite(result) ? result : null;
    } catch (_) {
      return null;
    }
  }

  function expressionsEquivalent(left, right, tolerance = 1e-8) {
    if (canonicalExpression(left) === canonicalExpression(right)) return true;
    const samples = [
      { x: -3, y: 2, a: 2, b: -1, c: 3, h: 1, k: -2, t: 0 },
      { x: -1, y: 5, a: -2, b: 3, c: -4, h: -2, k: 4, t: 1 },
      { x: 0, y: -2, a: 3, b: 2, c: 1, h: 3, k: 2, t: 2 },
      { x: 2, y: 7, a: 1, b: -3, c: 2, h: -1, k: 5, t: 3 },
      { x: 5, y: -4, a: -1, b: 4, c: -2, h: 2, k: 1, t: 4 },
    ];
    let compared = 0;
    for (const sample of samples) {
      const leftValue = safeExpressionValue(left, sample);
      const rightValue = safeExpressionValue(right, sample);
      if (leftValue === null || rightValue === null) return false;
      compared += 1;
      if (Math.abs(leftValue - rightValue) > tolerance * Math.max(1, Math.abs(rightValue))) return false;
    }
    return compared === samples.length;
  }

  function splitStepResponse(response) {
    if (Array.isArray(response)) return response.map(normalizedText).filter(Boolean);
    return String(response ?? "")
      .split(/(?:\r?\n|→|>|;)/)
      .map(normalizedText)
      .filter(Boolean);
  }

  function includesAny(text, alternatives) {
    const normalized = normalizedText(text);
    return (Array.isArray(alternatives) ? alternatives : [alternatives])
      .some((alternative) => normalized.includes(normalizedText(alternative)));
  }

  function rubricAlternatives(item) {
    if (Array.isArray(item)) return item;
    if (item && Array.isArray(item.alternatives)) return item.alternatives;
    if (item && Array.isArray(item.evidence)) return item.evidence;
    if (item && item.text) return [item.text];
    return [item];
  }

  function rubricPoints(item, fallback = 1) {
    const points = Number(item?.points);
    return Number.isFinite(points) && points > 0 ? points : fallback;
  }

  function rubricItemMatches(text, item) {
    if (item && !Array.isArray(item) && (item.left || item.right || item.connectors)) {
      const leftHit = !item.left || includesAny(text, item.left);
      const rightHit = !item.right || includesAny(text, item.right);
      const connectorHit = !item.connectors || includesAny(text, item.connectors);
      return leftHit && rightHit && connectorHit;
    }
    return includesAny(text, rubricAlternatives(item));
  }

  function forbiddenErrors(text, patterns) {
    return (Array.isArray(patterns) ? patterns : [])
      .filter((pattern) => includesAny(text, rubricAlternatives(pattern)))
      .map((pattern) => pattern?.id || rubricAlternatives(pattern)[0]);
  }

  function evaluateMultipleChoice(problem, response) {
    const correct = normalizedText(problem.correctAnswer ?? problem.answer);
    const actual = normalizedText(response);
    return {
      status: actual && actual === correct ? "CORRECT" : "INCORRECT",
      correct: Boolean(actual && actual === correct),
      confidence: 1,
    };
  }

  function evaluateShortAnswer(problem, response) {
    const actual = normalizedAnswer(response);
    const tolerance = Number(problem.tolerance) || 0;
    const matched = acceptedAnswers(problem).some((expected) => {
      if (actual === normalizedAnswer(expected)) return true;
      const actualNumber = numericValue(actual);
      const expectedNumber = numericValue(expected);
      return actualNumber !== null && expectedNumber !== null && Math.abs(actualNumber - expectedNumber) <= tolerance;
    });
    return { status: matched ? "CORRECT" : "INCORRECT", correct: matched, confidence: 0.99 };
  }

  function evaluateExpression(problem, response) {
    const matched = acceptedAnswers(problem).some((expected) => expressionsEquivalent(response, expected, Number(problem.tolerance) || 1e-8));
    return { status: matched ? "CORRECT" : "INCORRECT", correct: matched, confidence: matched ? 0.98 : 0.94 };
  }

  function evaluateStepOrder(problem, response) {
    const responseSteps = response && typeof response === "object" && !Array.isArray(response)
      ? response.steps
      : response;
    const actual = splitStepResponse(responseSteps);
    const expected = (problem.requiredSteps || problem.correctAnswer || []).map(normalizedText);
    const hasDetailedRubric = Array.isArray(problem.rubricSteps) && problem.rubricSteps.length > 0;
    if (!hasDetailedRubric) {
      const correct = expected.length > 0
        && actual.length === expected.length
        && expected.every((step, index) => actual[index] === step);
      return {
        status: correct ? "CORRECT" : "INCORRECT",
        correct,
        confidence: 0.98,
        rubricScore: correct ? 1 : 0,
      };
    }
    const exactAnswerKey = expected.length > 0
      && actual.length === expected.length
      && expected.every((step, index) => actual[index] === step);
    if (exactAnswerKey) {
      const maxPoints = problem.rubricSteps.reduce((sum, item) => sum + rubricPoints(item), 0);
      return {
        status: "CORRECT",
        correct: true,
        confidence: 0.99,
        rubricScore: 1,
        earnedPoints: maxPoints,
        maxPoints,
        stepResults: problem.rubricSteps.map((item, index) => ({
          id: item.id || `step-${index + 1}`,
          matched: true,
          required: item.required !== false,
          points: rubricPoints(item),
        })),
        logicalErrors: [],
        orderBroken: false,
      };
    }
    const rubricSteps = Array.isArray(problem.rubricSteps) && problem.rubricSteps.length
      ? problem.rubricSteps
      : expected.map((step, index) => ({
        id: `step-${index + 1}`,
        description: step,
        evidence: [step],
        points: 1,
        required: true,
      }));
    const workText = response && typeof response === "object" && !Array.isArray(response)
      ? Object.values(response.work || {}).join(" ")
      : "";
    let cursor = 0;
    let orderBroken = false;
    const stepResults = rubricSteps.map((rubricStep, index) => {
      const alternatives = rubricAlternatives(rubricStep);
      const found = actual.findIndex((candidate, candidateIndex) => (
        candidateIndex >= cursor && alternatives.some((alternative) => (
          candidate.includes(normalizedText(alternative))
          || normalizedText(alternative).includes(candidate)
        ))
      ));
      const workMatched = rubricItemMatches(workText, rubricStep);
      const matched = found >= 0 || workMatched;
      // 한 문장에 연속된 두 채점 요소가 함께 들어갈 수 있으므로 같은 응답
      // 단계의 재사용은 허용하되, 앞 단계로 되돌아가지는 않는다.
      if (found >= 0) cursor = found;
      if (found < 0 && matched && index > 0) orderBroken = true;
      return {
        id: rubricStep.id || `step-${index + 1}`,
        matched,
        required: rubricStep.required !== false,
        points: rubricPoints(rubricStep),
      };
    });
    const errors = forbiddenErrors(
      `${actual.join(" ")} ${workText}`,
      problem.forbiddenLogicalErrors || problem.processRubric?.forbiddenLogicalErrors
    );
    const maxPoints = stepResults.reduce((sum, item) => sum + item.points, 0);
    const earnedPoints = stepResults.reduce((sum, item) => sum + (item.matched ? item.points : 0), 0);
    const requiredComplete = stepResults.every((item) => !item.required || item.matched);
    const correct = expected.length > 0 && requiredComplete && !orderBroken && errors.length === 0;
    const score = maxPoints ? earnedPoints / maxPoints : 0;
    return {
      status: correct ? "CORRECT" : score > 0 ? "PARTIAL" : "INCORRECT",
      correct,
      confidence: correct ? 0.97 : 0.9,
      rubricScore: score,
      earnedPoints,
      maxPoints,
      stepResults,
      logicalErrors: errors,
      orderBroken,
    };
  }

  function evaluateStructuredWritten(problem, response) {
    const rubric = problem.writtenRubric || {};
    const text = String(response ?? "");
    const groups = [
      ["claim", rubric.requiredClaims || []],
      ["relation", rubric.requiredRelations || []],
      ["calculation", rubric.requiredCalculations || []],
    ];
    const itemResults = [];
    groups.forEach(([kind, items]) => {
      items.forEach((item, index) => {
        itemResults.push({
          id: item?.id || `${kind}-${index + 1}`,
          kind,
          matched: rubricItemMatches(text, item),
          required: item?.required !== false,
          points: rubricPoints(item),
        });
      });
    });
    const conclusion = rubric.requiredConclusion;
    if (conclusion) {
      itemResults.push({
        id: conclusion.id || "conclusion",
        kind: "conclusion",
        matched: rubricItemMatches(text, conclusion),
        required: conclusion.required !== false,
        points: rubricPoints(conclusion, 2),
      });
    }
    const logicalErrors = forbiddenErrors(text, rubric.forbiddenLogicalErrors);
    const maxPoints = itemResults.reduce((sum, item) => sum + item.points, 0);
    const earnedPoints = itemResults.reduce((sum, item) => sum + (item.matched ? item.points : 0), 0);
    const score = maxPoints ? earnedPoints / maxPoints : 0;
    const requiredComplete = itemResults.every((item) => !item.required || item.matched);
    const correctThreshold = Number(rubric.correctThreshold) || 0.8;
    const reviewThreshold = Number(rubric.reviewThreshold) || Math.max(0.45, correctThreshold - 0.25);
    const enough = score >= correctThreshold && requiredComplete && logicalErrors.length === 0;
    if (enough) {
      return {
        status: "CORRECT",
        correct: true,
        confidence: 0.9,
        rubricScore: score,
        earnedPoints,
        maxPoints,
        itemResults,
        logicalErrors,
      };
    }
    if (score >= reviewThreshold && logicalErrors.length === 0) {
      return {
        status: "REVIEW_REQUIRED",
        correct: null,
        confidence: 0.65,
        rubricScore: score,
        earnedPoints,
        maxPoints,
        itemResults,
        logicalErrors,
      };
    }
    return {
      status: "INCORRECT",
      correct: false,
      confidence: 0.9,
      rubricScore: score,
      earnedPoints,
      maxPoints,
      itemResults,
      logicalErrors,
    };
  }

  function evaluateWritten(problem, response) {
    const rubric = problem.writtenRubric || {};
    if (Array.isArray(rubric.requiredClaims) || Array.isArray(rubric.requiredCalculations)) {
      return evaluateStructuredWritten(problem, response);
    }
    const text = String(response ?? "");
    const concepts = rubric.requiredConcepts || [];
    const relations = rubric.requiredRelations || [];
    const results = rubric.expectedResults || acceptedAnswers(problem);
    const conceptHits = concepts.filter((item) => includesAny(text, item)).length;
    const relationHits = relations.filter((item) => includesAny(text, item)).length;
    const resultHit = results.length === 0 || results.some((item) => includesAny(text, item));
    const total = concepts.length + relations.length + (results.length ? 1 : 0);
    const score = total ? (conceptHits + relationHits + (resultHit ? 1 : 0)) / total : 0;
    const requiredScore = Number(rubric.minimumScore) || 0.8;
    const enough = score >= requiredScore && resultHit;
    if (enough) return { status: "CORRECT", correct: true, confidence: 0.85 + (score * 0.06), rubricScore: score };
    if (score >= Math.max(0.45, requiredScore - 0.25)) {
      return { status: "REVIEW_REQUIRED", correct: null, confidence: 0.65, rubricScore: score };
    }
    return { status: "INCORRECT", correct: false, confidence: 0.86, rubricScore: score };
  }

  function evaluateAnswer(problem, response) {
    switch (problem?.answerType) {
      case "MULTIPLE_CHOICE": return evaluateMultipleChoice(problem, response);
      case "SHORT_ANSWER": return evaluateShortAnswer(problem, response);
      case "EXPRESSION_INPUT": return evaluateExpression(problem, response);
      case "STEP_ORDER": return evaluateStepOrder(problem, response);
      case "WRITTEN_RESPONSE": return evaluateWritten(problem, response);
      default: return { status: "UNSUPPORTED", correct: null, confidence: 0 };
    }
  }

  function validateProblem(problem) {
    const errors = [];
    REQUIRED_FIELDS.forEach((field) => {
      if (problem?.[field] === undefined || problem?.[field] === null || problem?.[field] === "") errors.push(`MISSING_${field.toUpperCase()}`);
    });
    if (!STAGES.includes(problem?.stage)) errors.push("INVALID_STAGE");
    if (!ANSWER_TYPES.includes(problem?.answerType)) errors.push("INVALID_ANSWER_TYPE");
    if (!CONTENT_ROLES.includes(problem?.contentRole)) errors.push("INVALID_CONTENT_ROLE");
    if (Number(problem?.grade) !== 9) errors.push("INVALID_GRADE");
    if (!String(problem?.questionText || problem?.problem || "").trim()) errors.push("MISSING_PROMPT");
    if (!Array.isArray(problem?.reasoningGoals) || problem.reasoningGoals.length === 0) errors.push("MISSING_REASONING_GOALS");
    if (!Array.isArray(problem?.prerequisiteConceptIds)) errors.push("INVALID_PREREQUISITES");
    if (!Array.isArray(problem?.solutionPath) || problem.solutionPath.length === 0) errors.push("INVALID_SOLUTION_PATH");
    if (!Array.isArray(problem?.trapTypes)) errors.push("INVALID_TRAP_TYPES");

    const criteria = STAGE_CRITERIA[problem?.stage];
    const meaningfulSteps = Number(problem?.estimatedMeaningfulSteps) || 0;
    const linkedConcepts = uniqueStrings(problem?.linkedConceptIds || [problem?.conceptId]);
    const linkedConditionCount = Number(problem?.linkedConditionCount) || 0;
    if (criteria && meaningfulSteps < criteria.minimumSteps) errors.push("INSUFFICIENT_MEANINGFUL_STEPS");
    if (criteria && linkedConcepts.length < criteria.minimumLinkedConcepts) errors.push("INSUFFICIENT_LINKED_CONCEPTS");
    if (criteria?.minimumLinkedConditions && linkedConditionCount < criteria.minimumLinkedConditions) {
      errors.push("INSUFFICIENT_LINKED_CONDITIONS");
    }
    if (problem?.stage === "A3" && linkedConditionCount < 2) errors.push("A3_INSUFFICIENT_LINKED_CONDITIONS");
    if (criteria && !criteria.memorizationAllowed && problem?.memorizationOnly) errors.push("MEMORIZATION_ONLY_NOT_ALLOWED");
    if (problem?.requiresDomain === true && !String(problem?.domain || "").trim()) errors.push("MISSING_REQUIRED_DOMAIN");
    if (problem?.scopeTag && problem.scopeTag !== "MIDDLE3_QUADRATIC") errors.push("OUT_OF_CURRICULUM_SCOPE");

    if (problem?.answerType === "MULTIPLE_CHOICE") {
      const choices = (problem.choices || []).map(normalizedText);
      const correct = normalizedText(problem.correctAnswer ?? problem.answer);
      if (choices.length < 2) errors.push("MISSING_CHOICES");
      if (new Set(choices).size !== choices.length) errors.push("DUPLICATE_CHOICES");
      if (choices.filter((choice) => choice === correct).length !== 1) errors.push("CORRECT_CHOICE_NOT_UNIQUE");
    } else if (problem?.answerType === "STEP_ORDER") {
      if (!Array.isArray(problem.requiredSteps) || problem.requiredSteps.length < 2) errors.push("INVALID_REQUIRED_STEPS");
      if (problem.rubricSteps !== undefined) {
        if (!Array.isArray(problem.rubricSteps) || problem.rubricSteps.length < 3) errors.push("INVALID_PROCESS_RUBRIC_STEPS");
        else {
          problem.rubricSteps.forEach((step, index) => {
            if (!step?.id) errors.push(`PROCESS_RUBRIC_STEP_${index + 1}_MISSING_ID`);
            if (!step?.description) errors.push(`PROCESS_RUBRIC_STEP_${index + 1}_MISSING_DESCRIPTION`);
            if (!Array.isArray(step?.evidence) || step.evidence.length === 0) errors.push(`PROCESS_RUBRIC_STEP_${index + 1}_MISSING_EVIDENCE`);
            if (!(Number(step?.points) > 0)) errors.push(`PROCESS_RUBRIC_STEP_${index + 1}_INVALID_POINTS`);
          });
        }
      }
    } else if (problem?.answerType === "WRITTEN_RESPONSE") {
      const rubric = problem.writtenRubric;
      const legacyRubric = rubric && Array.isArray(rubric.requiredConcepts);
      const structuredRubric = rubric
        && Array.isArray(rubric.requiredClaims)
        && Array.isArray(rubric.requiredRelations)
        && rubric.requiredConclusion
        && Array.isArray(rubric.forbiddenLogicalErrors)
        && Number.isFinite(Number(rubric.reviewThreshold));
      if (!legacyRubric && !structuredRubric) errors.push("INVALID_WRITTEN_RUBRIC");
    } else if (!acceptedAnswers(problem).length) {
      errors.push("MISSING_CORRECT_ANSWER");
    }

    if (problem?.stage === "A5") {
      A5_REQUIRED_REASONING_GOALS.forEach((goal) => {
        if (!problem.reasoningGoals?.includes(goal)) errors.push(`A5_MISSING_${goal}`);
      });
      const additionalCount = A5_ADDITIONAL_REASONING_GOALS.filter((goal) => problem.reasoningGoals?.includes(goal)).length;
      if (additionalCount < 2) errors.push("A5_INSUFFICIENT_ADDITIONAL_REASONING");
      if (problem.structureNovelty !== "HIGH") errors.push("A5_STRUCTURE_NOVELTY_NOT_HIGH");
      if (problem.requiresStrategySelection !== true) errors.push("A5_STRATEGY_SELECTION_REQUIRED");
      if (problem.requiresExplanation !== true) errors.push("A5_EXPLANATION_REQUIRED");
      if (problem.directFormulaSubstitution !== false) errors.push("A5_DIRECT_SUBSTITUTION_NOT_ALLOWED");
      if (problem.memorizationOnly !== false) errors.push("A5_MEMORIZATION_NOT_ALLOWED");
    }
    if (problem?.stage === "A3" && problem?.memorizationOnly) errors.push("A3_MEMORIZATION_NOT_ALLOWED");
    if (problem?.stage === "A4" && problem?.directFormulaSubstitution === true) errors.push("A4_DIRECT_SUBSTITUTION_NOT_ALLOWED");
    if (problem?.scopeTag === "MIDDLE3_QUADRATIC") {
      const fingerprint = problem.structureFingerprint;
      ["firstEquationFamily", "coreStrategy", "conditionTransform", "graphStructure", "targetKind"].forEach((field) => {
        if (!String(fingerprint?.[field] || "").trim()) errors.push(`MISSING_STRUCTURE_FINGERPRINT_${field.toUpperCase()}`);
      });
      if (!["KEEP", "MODIFY", "REPLACE"].includes(problem.revisionAction)) errors.push("INVALID_REVISION_ACTION");
      if (!String(problem.scopeEvidence || "").trim()) errors.push("MISSING_SCOPE_EVIDENCE");
      const independent = problem.independentValidation || {};
      ["conditionFeasible", "uniqueAnswer", "answerRecalculated", "scopeChecked"].forEach((field) => {
        if (independent[field] !== true) errors.push(`INDEPENDENT_VALIDATION_${field.toUpperCase()}_NOT_CONFIRMED`);
      });
      if (problem.answerType === "STEP_ORDER" && !Array.isArray(problem.rubricSteps)) {
        errors.push("MISSING_PROCESS_RUBRIC");
      }
      if (problem.answerType === "WRITTEN_RESPONSE") {
        const rubric = problem.writtenRubric || {};
        if (!Array.isArray(rubric.requiredClaims)
          || !Array.isArray(rubric.requiredRelations)
          || !Array.isArray(rubric.requiredCalculations)
          || !rubric.requiredConclusion
          || !Array.isArray(rubric.forbiddenLogicalErrors)) {
          errors.push("MISSING_STRUCTURED_WRITTEN_RUBRIC");
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }

  function validateProblemSet(problems, options = {}) {
    const items = Array.isArray(problems) ? problems : [];
    const errors = [];
    const problemIds = new Set();
    const structures = new Set();
    const solutionPaths = new Set();
    const byConceptStage = {};
    items.forEach((problem) => {
      const validation = validateProblem(problem);
      validation.errors.forEach((error) => errors.push(`${problem?.problemId || "UNKNOWN"}:${error}`));
      if (problemIds.has(problem.problemId)) errors.push(`${problem.problemId}:DUPLICATE_PROBLEM_ID`);
      if (structures.has(problem.structureSignature)) errors.push(`${problem.problemId}:DUPLICATE_STRUCTURE_SIGNATURE`);
      if (solutionPaths.has(problem.solutionPathSignature)) errors.push(`${problem.problemId}:DUPLICATE_SOLUTION_PATH_SIGNATURE`);
      problemIds.add(problem.problemId);
      structures.add(problem.structureSignature);
      solutionPaths.add(problem.solutionPathSignature);
      const key = `${problem.conceptId}:${problem.stage}`;
      byConceptStage[key] = byConceptStage[key] || [];
      byConceptStage[key].push(problem);
    });
    const minimumStructures = Number(options.minimumStructuresPerConceptStage ?? 3);
    Object.entries(byConceptStage).forEach(([key, group]) => {
      if (new Set(group.map((problem) => problem.structureSignature)).size < minimumStructures) {
        errors.push(`${key}:INSUFFICIENT_DISTINCT_STRUCTURES`);
      }
      if (new Set(group.map((problem) => problem.solutionPathSignature)).size < minimumStructures) {
        errors.push(`${key}:INSUFFICIENT_DISTINCT_SOLUTION_PATHS`);
      }
      const fingerprints = group.map((problem) => problem.structureFingerprint).filter(Boolean);
      if (fingerprints.length === group.length) {
        const coreStrategies = fingerprints.map((fingerprint) => normalizedStructuralText(fingerprint.coreStrategy));
        if (new Set(coreStrategies).size < group.length) errors.push(`${key}:PRACTICAL_DUPLICATE_CORE_STRATEGY`);
        const practicalSignatures = fingerprints.map((fingerprint) => [
          fingerprint.firstEquationFamily,
          fingerprint.conditionTransform,
          fingerprint.graphStructure,
        ].map(normalizedStructuralText).join("|"));
        if (new Set(practicalSignatures).size < group.length) errors.push(`${key}:PRACTICAL_DUPLICATE_STRUCTURE`);
      }
    });
    if (options.requireA5ArchetypeCoverage !== false) {
      const archetypes = new Set(items.filter((problem) => problem.stage === "A5").map((problem) => problem.problemArchetype));
      A5_REQUIRED_ARCHETYPES.forEach((archetype) => {
        if (!archetypes.has(archetype)) errors.push(`A5_SET:MISSING_ARCHETYPE_${archetype}`);
      });
    }
    return {
      valid: errors.length === 0,
      errors,
      problemCount: items.length,
      structureCount: structures.size,
      solutionPathCount: solutionPaths.size,
      byConceptStage,
    };
  }

  return Object.freeze({
    VERSION,
    STAGES,
    ANSWER_TYPES,
    CONTENT_ROLES,
    REQUIRED_FIELDS,
    STAGE_CRITERIA,
    A5_REQUIRED_REASONING_GOALS,
    A5_ADDITIONAL_REASONING_GOALS,
    A5_REQUIRED_ARCHETYPES,
    normalizedText,
    normalizedStructuralText,
    normalizedAnswer,
    canonicalExpression,
    expressionsEquivalent,
    evaluateAnswer,
    validateProblem,
    validateProblemSet,
  });
});
