(function initEliteDiagnosis(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_DIAGNOSIS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteDiagnosis() {
  "use strict";

  const CRITICAL_ERRORS = new Set([
    "CONCEPT_SELECTION_FAILURE",
    "MULTI_CONCEPT_LINK_FAILURE",
    "STRATEGY_FAILURE",
    "EVIDENCE_SELECTION_FAILURE",
    "LONG_SENTENCE_PARSING_FAILURE",
  ]);

  function subjectKey(value) {
    if (["math", "수학"].includes(value)) return "math";
    if (["english", "영어"].includes(value)) return "english";
    return null;
  }

  function groupName(problem) {
    return String(problem?.domain || problem?.englishTaskType || problem?.conceptId || "미분류");
  }

  function defaultErrorCode(subject, unknown = false) {
    if (subjectKey(subject) === "math") return unknown ? "STRATEGY_FAILURE" : "VALIDATION_FAILURE";
    return unknown ? "EVIDENCE_SELECTION_FAILURE" : "INFERENCE_ERROR";
  }

  function inferErrorCode(problem, response, evaluation = {}, options = {}) {
    if (options.unknown) return defaultErrorCode(problem?.subject, true);
    const selected = String(response ?? "");
    const mapped = problem?.distractorErrorMap?.[selected];
    if (mapped?.code) return mapped.code;
    if (Array.isArray(evaluation.errorCodes) && evaluation.errorCodes[0]) return evaluation.errorCodes[0];
    if (Array.isArray(evaluation.logicalErrors) && evaluation.logicalErrors[0]) {
      return evaluation.logicalErrors[0];
    }
    return problem?.trapTypes?.[0] || defaultErrorCode(problem?.subject, false);
  }

  function evidenceKey(problem, errorCode) {
    return [subjectKey(problem?.subject), errorCode, problem?.eliteLevel, groupName(problem)].join(":");
  }

  function confidenceFor(evidence) {
    const distinct = Number(evidence.distinctStructureCount) || 0;
    const weighted = Number(evidence.weightedEvidenceCount) || Number(evidence.evidenceCount) || 0;
    return Math.min(0.97, Number((0.2 + distinct * 0.22 + Math.max(0, weighted - distinct) * 0.05).toFixed(2)));
  }

  function recordErrorEvidence(state, problem, errorCode, options = {}) {
    const entries = Array.isArray(state.errorEvidence) ? state.errorEvidence : (state.errorEvidence = []);
    const key = evidenceKey(problem, errorCode);
    let evidence = entries.find((item) => item.key === key);
    if (!evidence) {
      evidence = {
        key,
        errorCode,
        subject: subjectKey(problem.subject),
        conceptId: problem.conceptId || null,
        domain: groupName(problem),
        eliteLevel: problem.eliteLevel,
        problemId: problem.problemId,
        evidenceProblemIds: [],
        structureSignatures: [],
        evidenceCount: 0,
        weightedEvidenceCount: 0,
        distinctStructureCount: 0,
        lastSeenAt: null,
        confidence: 0,
      };
      entries.push(evidence);
    }

    if (!evidence.evidenceProblemIds.includes(problem.problemId)) {
      evidence.evidenceProblemIds.push(problem.problemId);
      evidence.evidenceCount += 1;
    }
    if (!evidence.structureSignatures.includes(problem.structureSignature)) {
      evidence.structureSignatures.push(problem.structureSignature);
    }
    evidence.distinctStructureCount = evidence.structureSignatures.length;
    evidence.weightedEvidenceCount += Number(options.weight) || 1;
    evidence.problemId = problem.problemId;
    evidence.lastSeenAt = options.at || new Date().toISOString();
    evidence.confidence = confidenceFor(evidence);
    rebuildConfirmedWeaknesses(state);
    return evidence;
  }

  function rebuildConfirmedWeaknesses(state) {
    state.confirmedWeaknesses = (state.errorEvidence || [])
      .filter((item) => Number(item.distinctStructureCount) >= 3)
      .map((item) => ({
        errorCode: item.errorCode,
        subject: item.subject,
        conceptId: item.conceptId,
        domain: item.domain,
        eliteLevel: item.eliteLevel,
        evidenceProblemIds: [...item.evidenceProblemIds],
        distinctStructureCount: item.distinctStructureCount,
        confidence: item.confidence,
        recommendedLearningTarget: item.conceptId || item.domain,
      }));
    return state.confirmedWeaknesses;
  }

  function rebuildStrengthAreas(state) {
    const grouped = new Map();
    Object.values(state.finalizedAttempts || {}).forEach((attempt) => {
      if (attempt.evaluationStatus !== "CORRECT") return;
      const name = attempt.domain || attempt.conceptId || "미분류";
      const record = grouped.get(name) || { name, correctCount: 0, problemIds: [] };
      if (!record.problemIds.includes(attempt.problemId)) {
        record.problemIds.push(attempt.problemId);
        record.correctCount += 1;
      }
      grouped.set(name, record);
    });
    state.strengthAreas = [...grouped.values()]
      .sort((left, right) => right.correctCount - left.correctCount || left.name.localeCompare(right.name))
      .slice(0, 5);
    return state.strengthAreas;
  }

  function levelAttempts(state, level) {
    return Object.values(state.finalizedAttempts || {})
      .filter((attempt) => attempt.eliteLevel === level && attempt.evaluationStatus !== "REVIEW_REQUIRED");
  }

  function levelEvidence(state, level) {
    const attempts = levelAttempts(state, level);
    const graded = attempts.filter((item) => ["CORRECT", "INCORRECT", "UNKNOWN"].includes(item.evaluationStatus));
    const correct = graded.filter((item) => item.evaluationStatus === "CORRECT");
    const groups = new Set(graded.map((item) => item.domain || item.englishTaskType || item.conceptId));
    return {
      submitted: graded.length,
      correct: correct.length,
      accuracy: graded.length ? correct.length / graded.length : 0,
      distinctGroups: groups.size,
    };
  }

  function hasRepeatedCriticalFailure(state, level) {
    return (state.errorEvidence || []).some((item) => (
      item.eliteLevel === level
      && CRITICAL_ERRORS.has(item.errorCode)
      && Number(item.distinctStructureCount) >= 2
    ));
  }

  function canMoveHighToTop(state) {
    const evidence = levelEvidence(state, "HIGH");
    return evidence.submitted >= 5
      && evidence.distinctGroups >= 3
      && evidence.accuracy >= 0.7
      && !hasRepeatedCriticalFailure(state, "HIGH");
  }

  function canStabilizeTop(state) {
    const evidence = levelEvidence(state, "TOP");
    return evidence.submitted >= 4
      && evidence.distinctGroups >= 3
      && evidence.accuracy >= 0.75
      && !hasRepeatedCriticalFailure(state, "TOP");
  }

  function updateLevels(state) {
    const high = levelEvidence(state, "HIGH");
    const top = levelEvidence(state, "TOP");
    if (canMoveHighToTop(state)) state.stableLevel = "HIGH";
    if (top.submitted > 0 || state.currentEliteLevel === "TOP") state.challengeLevel = "TOP";
    if (canStabilizeTop(state)) state.stableLevel = "TOP";
    if (!state.challengeLevel) state.challengeLevel = high.submitted > 0 ? "HIGH" : "NOT_CONFIRMED";
    return { stableLevel: state.stableLevel, challengeLevel: state.challengeLevel };
  }

  function learningRecommendation(state, weakness) {
    if (state.subject === "math") {
      const quadratic = String(weakness?.conceptId || "").includes("quadratic")
        || String(weakness?.domain || "").includes("이차함수");
      return {
        subject: "math",
        grade: 9,
        conceptId: weakness?.conceptId || null,
        targetLevel: state.stableLevel === "TOP" ? "A5" : "A4",
        errorCode: weakness?.errorCode || null,
        reasoningGoal: weakness?.recommendedLearningTarget || weakness?.domain || null,
        availableLearningRoute: quadratic ? "middle3-quadratic" : null,
      };
    }
    return {
      subject: "english",
      gradeOrLevel: "middle3",
      domain: weakness?.domain || null,
      targetLevel: state.stableLevel === "TOP" ? "TOP" : "HIGH",
      errorCode: weakness?.errorCode || null,
      skillTarget: weakness?.recommendedLearningTarget || weakness?.domain || null,
      availableLearningRoute: null,
    };
  }

  function buildRecommendations(state) {
    const source = state.confirmedWeaknesses?.length
      ? state.confirmedWeaknesses
      : (state.errorEvidence || []).filter((item) => item.distinctStructureCount >= 1).slice(0, 3);
    state.recommendedLearningTargets = source.map((item) => learningRecommendation(state, item));
    state.recommendedLevelTestStart = {
      recommendedLevelTestSubject: state.subject,
      recommendedGradeStart: "middle3",
      recommendedLevelStart: state.stableLevel === "TOP" ? "TOP" : "HIGH",
      confirmedWeaknesses: state.confirmedWeaknesses || [],
      stableLevel: state.stableLevel,
      challengeLevel: state.challengeLevel,
    };
    return {
      recommendedLearningTargets: state.recommendedLearningTargets,
      recommendedLevelTestStart: state.recommendedLevelTestStart,
    };
  }

  function buildResultSummary(state) {
    rebuildConfirmedWeaknesses(state);
    rebuildStrengthAreas(state);
    updateLevels(state);
    buildRecommendations(state);
    const attempts = Object.values(state.finalizedAttempts || {})
      .filter((attempt) => attempt.evaluationStatus !== "REVIEW_REQUIRED");
    const correct = attempts.filter((attempt) => attempt.evaluationStatus === "CORRECT").length;
    const reviewRequired = Object.values(state.finalizedAttempts || {})
      .filter((attempt) => attempt.evaluationStatus === "REVIEW_REQUIRED").length;
    state.resultSummary = {
      subject: state.subject,
      gradeOrLevel: "middle3",
      stableLevel: state.stableLevel,
      challengeLevel: state.challengeLevel,
      submittedCount: Object.keys(state.finalizedAttempts || {}).length,
      gradedCount: attempts.length,
      correctCount: correct,
      accuracy: attempts.length ? Number((correct / attempts.length).toFixed(3)) : 0,
      reviewRequiredCount: reviewRequired,
      strengthAreas: state.strengthAreas,
      repeatedErrors: (state.errorEvidence || []).filter((item) => item.distinctStructureCount >= 2),
      confirmedWeaknesses: state.confirmedWeaknesses,
      recommendedLearningTargets: state.recommendedLearningTargets,
      recommendedLevelTestStart: state.recommendedLevelTestStart,
    };
    return state.resultSummary;
  }

  return Object.freeze({
    CRITICAL_ERRORS,
    subjectKey,
    groupName,
    inferErrorCode,
    recordErrorEvidence,
    rebuildConfirmedWeaknesses,
    rebuildStrengthAreas,
    levelEvidence,
    hasRepeatedCriticalFailure,
    canMoveHighToTop,
    canStabilizeTop,
    updateLevels,
    buildRecommendations,
    buildResultSummary,
  });
});
