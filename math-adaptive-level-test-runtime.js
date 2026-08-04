(function (root, factory) {
  const commonJs = typeof module === "object" && module.exports;
  const deps = commonJs ? {
    state: require("./math-adaptive-level-test-state.js"),
    gates: require("./math-adaptive-level-test-grade-gates.js"),
    selector: require("./math-adaptive-level-test-question-selector.js"),
    graph: require("./math-concept-graph-data.js"),
    graphRuntime: require("./math-concept-graph-runtime.js"),
  } : {
    state: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STATE,
    gates: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_GATES,
    selector: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_SELECTOR,
    graph: root.STUDY_MATH_CONCEPT_GRAPH,
    graphRuntime: root.STUDY_MATH_CONCEPT_GRAPH_RUNTIME,
  };
  const api = factory(deps);
  if (commonJs) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (deps) {
  "use strict";
  const { state: stateApi, gates, selector, graph, graphRuntime } = deps;
  if (!stateApi || !gates || !selector || !graph || !graphRuntime) throw new Error("MATH_ADAPTIVE_RUNTIME_DEPENDENCY_MISSING");

  const VERSION = "math-adaptive-level-test-runtime-v1";
  const MIN_QUESTIONS = 24;
  const MAX_QUESTIONS = 36;
  const MIN_DURATION = 20;
  const MAX_DURATION = 30;
  const unique = (values) => [...new Set((values || []).filter(Boolean))];
  const TERMINAL_DOMAIN_STATUSES = new Set(["PASSED", "FAILED", "BLOCKED_NO_CONTENT"]);
  const resultValue = (submission) => submission.result || (submission.correct === true ? "CORRECT" : "INCORRECT");

  function createInitialState(options = {}) {
    const overrides = { currentDomain: gates.getGateDomains("G4")[0]?.domainId || null, ...(options.overrides || {}) };
    return stateApi.createInitialAdaptiveState({ timestamp: options.timestamp ?? 0, overrides });
  }

  function currentDomain(state) {
    return gates.getDomain(state.currentGradeGate, state.currentDomain) || selector.unresolvedDomain(state);
  }

  function domainEvidence(state, gradeGate, domain) {
    return selector.evidenceForDomain(state, gradeGate, domain)
      .filter((item) => ["CORRECT", "INCORRECT", "GIVEUP"].includes(item.result));
  }

  function evaluateDomainEvidence(items) {
    const byStructure = [];
    const seen = new Set();
    items.forEach((item) => {
      if (!item.structureSignature || seen.has(item.structureSignature)) return;
      seen.add(item.structureSignature);
      byStructure.push(item);
    });
    const first = byStructure.slice(0, 2);
    const correct = byStructure.filter((item) => item.result === "CORRECT").length;
    const incorrect = byStructure.filter((item) => item.result === "INCORRECT" || item.result === "GIVEUP").length;
    if (byStructure.length < 2) return Object.freeze({ status: "NEED_MORE_EVIDENCE", correct, incorrect, evidenceCount: byStructure.length });
    if (first.every((item) => item.result === "CORRECT")) return Object.freeze({ status: "PASSED", correct, incorrect, evidenceCount: byStructure.length });
    if (first.every((item) => item.result !== "CORRECT")) return Object.freeze({ status: "REMEDIAL_REQUIRED", correct, incorrect, evidenceCount: byStructure.length });
    if (byStructure.length < 3) return Object.freeze({ status: "CONFIRMATION_REQUIRED", correct, incorrect, evidenceCount: byStructure.length });
    return Object.freeze({ status: correct >= 2 ? "PASSED" : "REMEDIAL_REQUIRED", correct, incorrect, evidenceCount: byStructure.length });
  }

  function directRemedialConcept(conceptId, misconceptionTags = []) {
    const node = graph.conceptById[conceptId];
    if (!node) return null;
    for (const tag of misconceptionTags) {
      const mapped = node.misconceptionRemediationMap?.[tag] || [];
      if (mapped.length) return mapped[0];
    }
    return node.remedialConceptIds?.[0] || node.prerequisiteConceptIds?.[0] || null;
  }

  function chooseStartConcept(state) {
    const candidates = Object.entries(state.evidenceByConcept)
      .filter(([conceptId]) => graph.conceptById[conceptId]?.internalGradeBand === "M3")
      .map(([conceptId, items]) => ({
        conceptId,
        correct: items.filter((item) => item.result === "CORRECT").length,
        wrong: items.filter((item) => item.result !== "CORRECT").length,
      }))
      .sort((a, b) => Number(a.wrong === 0) - Number(b.wrong === 0) || b.wrong - a.wrong || a.conceptId.localeCompare(b.conceptId));
    return candidates[0]?.conceptId || "m3_sqrt_meaning";
  }

  function updateConfidence(draft, gradeGate, domain) {
    const items = domain.conceptIds.flatMap((conceptId) => draft.evidenceByConcept[conceptId] || [])
      .filter((item) => item.gradeGate === gradeGate && item.finalSubmission !== false);
    const structures = new Set(items.map((item) => item.structureSignature).filter(Boolean));
    const correctStructures = new Set(items.filter((item) => item.result === "CORRECT").map((item) => item.structureSignature).filter(Boolean));
    const evidenceFactor = Math.min(1, structures.size / 3);
    const accuracy = structures.size ? correctStructures.size / structures.size : 0;
    draft.confidenceByDomain[`${gradeGate}:${domain.domainId}`] = Math.round((accuracy * 0.7 + evidenceFactor * 0.3) * 100);
  }

  function resolveDomain(previous, gradeGate, domain, status, timestamp, options = {}) {
    const projectedStatuses = {
      ...(previous.domainStatusByGrade[gradeGate] || {}),
      [domain.domainId]: status,
    };
    const gradeFinished = gates.getGateDomains(gradeGate).every((item) => TERMINAL_DOMAIN_STATUSES.has(projectedStatuses[item.domainId]));
    const nextGrade = gradeFinished ? gates.nextGradeGate(gradeGate) : gradeGate;
    return stateApi.commit(previous, (draft) => {
      draft.domainStatusByGrade[gradeGate] ||= {};
      draft.domainStatusByGrade[gradeGate][domain.domainId] = status;
      draft.pendingConfirmation = null;
      draft.pendingRemediation = null;
      if (status === "BLOCKED_NO_CONTENT") {
        draft.blockedNoContentConceptIds = unique([...draft.blockedNoContentConceptIds, ...domain.conceptIds]);
      }
      const nextDomain = gates.getGateDomains(gradeGate).find((item) => !TERMINAL_DOMAIN_STATUSES.has(draft.domainStatusByGrade[gradeGate][item.domainId]));
      if (nextDomain) {
        draft.currentDomain = nextDomain.domainId;
        return;
      }
      const gradeStatuses = gates.getGateDomains(gradeGate).map((item) => draft.domainStatusByGrade[gradeGate][item.domainId]);
      if (gradeStatuses.every((item) => item === "PASSED")) draft.passedGradeGates = unique([...draft.passedGradeGates, gradeGate]);
      const nextGrade = gates.nextGradeGate(gradeGate);
      if (nextGrade) {
        draft.currentGradeGate = nextGrade;
        draft.currentDomain = gates.getGateDomains(nextGrade)[0]?.domainId || null;
        return;
      }
      draft.phase = "CONCEPT_GRAPH";
      draft.currentDomain = null;
      draft.activeConceptId = chooseStartConcept(draft);
      draft.recommendedStartConceptIds = unique([draft.activeConceptId]);
      draft.graphState = graphRuntime.createInitialGraphState({ activeConceptId: draft.activeConceptId, timestamp });
      const activeNode = graph.conceptById[draft.activeConceptId];
      const upper = unique([...(activeNode?.nextConceptIds || []), ...(activeNode?.transferConceptIds || [])]);
      draft.upperBoundaryConcepts = upper;
      draft.blockedNoContentConceptIds = unique([
        ...draft.blockedNoContentConceptIds,
        ...upper.filter((conceptId) => graph.conceptById[conceptId]?.contentAvailability !== "COMPLETE_SPRING"),
      ]);
    }, {
      decision: options.decision || (gradeFinished ? (nextGrade ? "PROMOTE_GRADE_GATE" : "ENTER_CONCEPT_GRAPH") : "ADVANCE_DOMAIN"),
      fromGradeGate: gradeGate,
      toGradeGate: nextGrade,
      domainId: domain.domainId,
      domainStatus: status,
      reason: options.reason || null,
    }, timestamp);
  }

  function advancePassedDomain(previous, gradeGate, domain, timestamp) {
    return resolveDomain(previous, gradeGate, domain, "PASSED", timestamp);
  }

  function handleQuestionUnavailable(previous, details = {}) {
    if (previous.completed || previous.phase === "CONCEPT_GRAPH") return previous;
    const gradeGate = previous.currentGradeGate;
    const domain = currentDomain(previous);
    if (!domain) return previous;
    const wasRemediation = Boolean(previous.pendingRemediation);
    return resolveDomain(previous, gradeGate, domain, wasRemediation ? "FAILED" : "BLOCKED_NO_CONTENT", details.timestamp ?? previous.updatedAt, {
      decision: wasRemediation ? "REMEDIATION_CONTENT_EXHAUSTED" : "DOMAIN_CONTENT_UNAVAILABLE",
      reason: wasRemediation
        ? "보충 문제를 더 찾지 못해 취약 증거를 보존하고 다음 진단 가능한 영역을 확인합니다."
        : "서로 다른 구조의 문제를 더 찾지 못해 이 영역을 완료 처리하지 않고 다음 진단 가능한 영역을 확인합니다.",
    });
  }

  function beginDirectRemediation(previous, gradeGate, domain, evidence, timestamp) {
    const recentWrong = [...evidence].reverse().find((item) => item.result !== "CORRECT");
    const sourceConceptId = recentWrong?.canonicalConceptId || domain.conceptIds[0];
    let conceptId = directRemedialConcept(sourceConceptId, recentWrong?.misconceptionTags || []);
    if (!conceptId || !graph.conceptById[conceptId]) conceptId = sourceConceptId;
    const atLowerBoundary = graph.conceptById[sourceConceptId]?.internalGradeBand === gates.LOWER_BOUNDARY;
    if (atLowerBoundary) conceptId = sourceConceptId;
    return stateApi.commit(previous, (draft) => {
      draft.domainStatusByGrade[gradeGate] ||= {};
      draft.domainStatusByGrade[gradeGate][domain.domainId] = "REMEDIAL_REQUIRED";
      draft.failedGradeGates = unique([...draft.failedGradeGates, `${gradeGate}:${domain.domainId}`]);
      draft.prerequisiteGaps = unique([...draft.prerequisiteGaps, conceptId]);
      draft.lowerBoundaryConcepts = unique([...draft.lowerBoundaryConcepts, conceptId]);
      draft.pendingConfirmation = null;
      draft.pendingRemediation = { conceptId, returnGradeGate: gradeGate, returnDomainId: domain.domainId, sourceConceptId };
      draft.activeConceptId = conceptId;
    }, { decision: atLowerBoundary ? "FOUNDATION_SUPPORT" : "DIAGNOSE_PREREQUISITE", gradeGate, domainId: domain.domainId, fromConceptId: sourceConceptId, toConceptId: conceptId, reason: "반복 오류가 확인되어 학년 전체가 아닌 직접 선수 개념만 진단합니다." }, timestamp);
  }

  function recordGateEvidence(previous, question, submission = {}) {
    if (previous.completed) return previous;
    const submissionId = String(submission.submissionId || "").trim();
    if (submissionId && previous.answeredSubmissionIds?.includes(submissionId)) return previous;
    const problemId = String(question.problemId || question.id || "");
    const structureSignature = String(question.structureSignature || "");
    if (!problemId || previous.answeredProblemIds.includes(problemId) || (structureSignature && previous.seenStructureSignatures.includes(structureSignature))) return previous;
    const gradeGate = previous.currentGradeGate;
    const domain = currentDomain(previous);
    if (!domain) return previous;
    const result = resultValue(submission);
    const timestamp = submission.timestamp ?? previous.updatedAt ?? 0;
    const canonicalConceptId = question.canonicalConceptId || question.conceptId;
    const stored = Object.freeze({
      canonicalConceptId,
      problemId,
      structureSignature,
      solutionPathSignature: String(question.solutionPathSignature || ""),
      result,
      correct: result === "CORRECT",
      incorrect: result === "INCORRECT" || result === "GIVEUP",
      misconceptionTags: unique(submission.misconceptionTags || question.misconceptionTags || []),
      difficulty: question.difficulty || "BASIC",
      independentCheck: question.independentCheck === true,
      finalSubmission: submission.finalSubmission !== false,
      gradeGate,
      domainId: domain.domainId,
      timestamp,
    });
    let next = stateApi.commit(previous, (draft) => {
      draft.currentDomain = domain.domainId;
      draft.evidenceByConcept[canonicalConceptId] = [...(draft.evidenceByConcept[canonicalConceptId] || []), stored];
      draft.testedConceptIds = unique([...draft.testedConceptIds, canonicalConceptId]);
      draft.answeredProblemIds = [...draft.answeredProblemIds, problemId];
      if (submissionId) draft.answeredSubmissionIds = [...(draft.answeredSubmissionIds || []), submissionId];
      draft.seenStructureSignatures = structureSignature ? [...draft.seenStructureSignatures, structureSignature] : draft.seenStructureSignatures;
      draft.totalQuestions += 1;
      draft.estimatedDuration = Math.round((draft.estimatedDuration + Number(question.estimatedSolveTime || 45) / 60) * 10) / 10;
      updateConfidence(draft, gradeGate, domain);
    }, { decision: "EVIDENCE_RECORDED", gradeGate, domainId: domain.domainId, conceptId: canonicalConceptId, result }, timestamp);

    if (previous.pendingRemediation?.conceptId === canonicalConceptId) {
      const remedialEvidence = next.evidenceByConcept[canonicalConceptId].filter((item) => item.domainId === domain.domainId);
      const correctStructures = new Set(remedialEvidence.filter((item) => item.result === "CORRECT").map((item) => item.structureSignature));
      if (correctStructures.size >= 2) {
        next = stateApi.commit(next, (draft) => {
          const frame = draft.pendingRemediation;
          draft.pendingRemediation = null;
          draft.activeConceptId = null;
          draft.currentGradeGate = frame.returnGradeGate;
          draft.currentDomain = frame.returnDomainId;
          draft.domainStatusByGrade[frame.returnGradeGate][frame.returnDomainId] = "CONFIRMATION_REQUIRED";
          draft.pendingConfirmation = { gradeGate: frame.returnGradeGate, domainId: frame.returnDomainId };
        }, { decision: "RETURN_TO_GATE", conceptId: canonicalConceptId, reason: "직접 선수 개념 확인을 마치고 원래 영역으로 돌아갑니다." }, timestamp);
      }
      return next;
    }

    const evaluation = evaluateDomainEvidence(domainEvidence(next, gradeGate, domain));
    if (evaluation.status === "PASSED") return advancePassedDomain(next, gradeGate, domain, timestamp);
    if (evaluation.status === "CONFIRMATION_REQUIRED") {
      return stateApi.commit(next, (draft) => {
        draft.domainStatusByGrade[gradeGate] ||= {};
        draft.domainStatusByGrade[gradeGate][domain.domainId] = "CONFIRMATION_REQUIRED";
        draft.pendingConfirmation = { gradeGate, domainId: domain.domainId };
      }, { decision: "ASK_CONFIRMATION", gradeGate, domainId: domain.domainId, reason: "정답과 오답이 섞여 다른 구조의 제3 확인 문제를 냅니다." }, timestamp);
    }
    if (evaluation.status === "REMEDIAL_REQUIRED") return beginDirectRemediation(next, gradeGate, domain, domainEvidence(next, gradeGate, domain), timestamp);
    return next;
  }

  function recordGraphEvidence(previous, question, submission = {}) {
    if (previous.phase !== "CONCEPT_GRAPH" || !previous.graphState) return previous;
    const submissionId = String(submission.submissionId || "").trim();
    if (submissionId && previous.answeredSubmissionIds?.includes(submissionId)) return previous;
    const problemId = String(question.problemId || question.id || "");
    const structureSignature = String(question.structureSignature || "");
    if (!problemId || previous.answeredProblemIds.includes(problemId)
      || (structureSignature && previous.seenStructureSignatures.includes(structureSignature))) return previous;
    const timestamp = submission.timestamp ?? previous.updatedAt ?? 0;
    const evidence = {
      conceptId: question.canonicalConceptId || question.conceptId || previous.activeConceptId,
      problemId,
      structureSignature,
      solutionPathSignature: question.solutionPathSignature,
      stage: question.stage || "BASIC",
      result: resultValue(submission),
      misconceptionTags: submission.misconceptionTags || question.misconceptionTags || [],
      independentCheck: question.independentCheck === true,
      finalSubmission: submission.finalSubmission !== false,
      submissionId,
      timestamp,
    };
    const graphState = graphRuntime.recordEvidence(previous.graphState, evidence);
    const remedial = graphRuntime.selectRemedialConcept(graphState, evidence.conceptId);
    const boundaries = graphRuntime.getAvailableNextConcepts(graphState, evidence.conceptId);
    return stateApi.commit(previous, (draft) => {
      draft.graphState = graphState;
      draft.evidenceByConcept[evidence.conceptId] = [...(draft.evidenceByConcept[evidence.conceptId] || []), {
        canonicalConceptId: evidence.conceptId,
        ...evidence,
        correct: evidence.result === "CORRECT",
        incorrect: evidence.result === "INCORRECT" || evidence.result === "GIVEUP",
      }];
      draft.testedConceptIds = unique([...draft.testedConceptIds, evidence.conceptId]);
      draft.answeredProblemIds = [...draft.answeredProblemIds, problemId];
      if (submissionId) draft.answeredSubmissionIds = [...(draft.answeredSubmissionIds || []), submissionId];
      draft.seenStructureSignatures = structureSignature ? [...draft.seenStructureSignatures, structureSignature] : draft.seenStructureSignatures;
      draft.totalQuestions += 1;
      draft.estimatedDuration = Math.round((draft.estimatedDuration + Number(question.estimatedSolveTime || 60) / 60) * 10) / 10;
      draft.upperBoundaryConcepts = unique([...boundaries.available, ...boundaries.blocked].map((item) => item.conceptId));
      draft.blockedNoContentConceptIds = unique([...draft.blockedNoContentConceptIds, ...boundaries.blocked.map((item) => item.conceptId)]);
      if (remedial.decision === "DESCEND") {
        draft.prerequisiteGaps = unique([...draft.prerequisiteGaps, remedial.toConceptId]);
        draft.activeConceptId = remedial.toConceptId;
      }
    }, { decision: remedial.decision === "DESCEND" ? "GRAPH_REMEDIATION" : "GRAPH_BOUNDARY_UPDATED", activeConceptId: evidence.conceptId }, timestamp);
  }

  function recordEvidence(state, question, submission = {}) {
    return state.phase === "CONCEPT_GRAPH" ? recordGraphEvidence(state, question, submission) : recordGateEvidence(state, question, submission);
  }

  function shouldTerminate(state) {
    if (state.completed) return Object.freeze({ terminate: true, reason: state.completionReason });
    if (state.totalQuestions >= MAX_QUESTIONS || state.estimatedDuration >= MAX_DURATION) return Object.freeze({ terminate: true, reason: "SESSION_LIMIT_REACHED" });
    const boundaryConfirmed = state.lastDecision?.decision === "PROMOTE_GRADE_GATE" || state.lastDecision?.decision === "ENTER_CONCEPT_GRAPH";
    if (state.totalQuestions >= MIN_QUESTIONS && state.estimatedDuration >= MIN_DURATION && boundaryConfirmed) return Object.freeze({ terminate: true, reason: "CURRENT_BOUNDARY_CONFIRMED" });
    if (state.blockedNoContentConceptIds.length && state.phase === "CONCEPT_GRAPH" && state.totalQuestions >= MIN_QUESTIONS) return Object.freeze({ terminate: true, reason: "NO_ENTERABLE_DIAGNOSTIC_CONTENT" });
    return Object.freeze({ terminate: false, reason: null });
  }

  function completeSession(previous, reason, timestamp = previous.updatedAt) {
    return stateApi.commit(previous, (draft) => { draft.completed = true; draft.completionReason = reason; }, { decision: "COMPLETE_SESSION", reason }, timestamp);
  }

  function getNextQuestion(state, catalog) { return selector.selectNextAdaptiveQuestion(state, catalog); }
  function serializeState(state) { return stateApi.serializeAdaptiveState(state); }
  function hydrateState(value, options) { return stateApi.hydrateAdaptiveState(value, options); }

  return Object.freeze({ VERSION, MIN_QUESTIONS, MAX_QUESTIONS, MIN_DURATION, MAX_DURATION, createInitialState, evaluateDomainEvidence, directRemedialConcept, recordEvidence, recordGateEvidence, recordGraphEvidence, handleQuestionUnavailable, shouldTerminate, completeSession, getNextQuestion, serializeState, hydrateState });
});
