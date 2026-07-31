(function (root, factory) {
  const graph = typeof module === "object" && module.exports
    ? require("./math-concept-graph-data.js")
    : root.STUDY_MATH_CONCEPT_GRAPH;
  const aliases = typeof module === "object" && module.exports
    ? require("./math-concept-alias-registry.js")
    : root.STUDY_MATH_CONCEPT_ALIASES;
  const stateApi = typeof module === "object" && module.exports
    ? require("./math-concept-graph-runtime-state.js")
    : root.STUDY_MATH_CONCEPT_GRAPH_STATE;
  const api = factory(graph, aliases, stateApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_GRAPH_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (graph, aliases, stateApi) {
  "use strict";

  if (!graph || !aliases || !stateApi) throw new Error("MATH_CONCEPT_GRAPH_DEPENDENCY_MISSING");

  const VERSION = "math-concept-graph-runtime-v1";
  const MAX_RECOVERY_DEPTH = 5;
  const MAX_SAME_REMEDIATION_ATTEMPTS = 2;
  const VALID_RESULTS = new Set(["CORRECT", "INCORRECT", "REVIEW_REQUIRED", "GIVEUP"]);
  const AUTO_CONTENT = "COMPLETE_SPRING";
  const AUTO_RUNTIME = "DEDICATED_SPRING";
  const gradeIndex = Object.freeze(Object.fromEntries(graph.GRADE_BANDS.map((grade, index) => [grade, index])));

  const unique = (values) => [...new Set((values || []).filter(Boolean))];
  const remediationSourceRank = Object.freeze({ MISCONCEPTION_MAP: 0, REMEDIAL: 1, PREREQUISITE: 2 });
  const timestampFor = (state, explicitTimestamp) => explicitTimestamp ?? state?.updatedAt ?? 0;
  const nodeFor = (conceptId) => graph.conceptById[conceptId] || null;
  const isFinalEvidence = (evidence) => evidence.finalSubmission === true;
  const isCorrectEvidence = (evidence) => isFinalEvidence(evidence) && evidence.result === "CORRECT";
  const decision = (type, fields = {}) => Object.freeze({ decision: type, ...fields });

  function normalizeConceptId(externalConceptId, evidence = {}) {
    const inputConceptId = String(externalConceptId || "").trim();
    if (graph.conceptById[inputConceptId]) {
      return { status: "CANONICAL", inputConceptId, canonicalConceptId: inputConceptId, targetConceptIds: [inputConceptId] };
    }
    const alias = aliases.resolveAlias(inputConceptId);
    if (!alias) return { status: "UNKNOWN_CONCEPT", inputConceptId, canonicalConceptId: null, targetConceptIds: [] };
    if (alias.aliasType === "CONCEPT_ALIAS") {
      return {
        status: "CONCEPT_ALIAS",
        inputConceptId,
        canonicalConceptId: alias.canonicalConceptId,
        targetConceptIds: [...alias.targetConceptIds],
      };
    }
    const detailId = evidence.detailConceptId || evidence.canonicalConceptId || evidence.distributionConceptId || null;
    const distributed = detailId && alias.targetConceptIds.includes(detailId) ? detailId : null;
    return {
      status: distributed ? "UNIT_ALIAS_DISTRIBUTED" : "UNIT_ALIAS",
      inputConceptId,
      canonicalConceptId: distributed,
      unitAliasId: inputConceptId,
      targetConceptIds: [...alias.targetConceptIds],
    };
  }

  function createInitialGraphState(options = {}) {
    const normalized = normalizeConceptId(options.activeConceptId, options);
    const activeConceptId = normalized.canonicalConceptId;
    const activeNode = nodeFor(activeConceptId);
    const initial = stateApi.createState({
      graphVersion: graph.VERSION,
      activeConceptId,
      activeUnitName: activeNode?.unitName || null,
      activePath: activeConceptId ? [activeConceptId] : [],
      masteryByConcept: options.masteryByConcept || {},
      evidenceByConcept: options.evidenceByConcept || {},
      misconceptionEvidence: options.misconceptionEvidence || {},
      timestamp: options.timestamp ?? 0,
    });
    if (!options.activeConceptId || activeConceptId) return initial;
    const draft = stateApi.mutableCopy(initial);
    const firstDecision = normalized.status === "UNIT_ALIAS"
      ? decision("UNIT_ALIAS_REQUIRES_DETAIL", { aliasId: normalized.unitAliasId, targetConceptIds: normalized.targetConceptIds })
      : decision("UNKNOWN_CONCEPT", { conceptId: normalized.inputConceptId });
    return stateApi.commitState(initial, draft, firstDecision, options.timestamp ?? 0);
  }

  function evidenceFingerprint(conceptKey, evidence) {
    return [conceptKey, evidence.problemId, evidence.finalSubmission === true ? "FINAL" : "DRAFT"].join("|");
  }

  function recordEvidence(previousState, inputEvidence) {
    const evidence = { ...inputEvidence };
    const timestamp = timestampFor(previousState, evidence.timestamp);
    const submissionId = String(evidence.submissionId || "").trim();
    if (submissionId && Object.values(previousState.evidenceByConcept || {}).some((items) =>
      (items || []).some((item) => item.sourceSubmissionId === submissionId))) return previousState;
    const normalized = normalizeConceptId(evidence.conceptId, evidence);
    if (normalized.status === "UNKNOWN_CONCEPT") {
      const draft = stateApi.mutableCopy(previousState);
      return stateApi.commitState(previousState, draft, decision("UNKNOWN_CONCEPT", {
        conceptId: normalized.inputConceptId,
        reason: "등록되지 않은 conceptId이므로 현재 학습 상태를 유지했습니다.",
      }), timestamp);
    }
    const conceptKey = normalized.canonicalConceptId || `@unit:${normalized.unitAliasId}`;
    const existing = previousState.evidenceByConcept[conceptKey] || [];
    const fingerprint = evidenceFingerprint(conceptKey, evidence);
    if (existing.some((item) => item.evidenceFingerprint === fingerprint)) return previousState;
    if (!VALID_RESULTS.has(evidence.result)) {
      const draft = stateApi.mutableCopy(previousState);
      return stateApi.commitState(previousState, draft, decision("INVALID_EVIDENCE", {
        conceptId: normalized.inputConceptId,
        reason: "지원하지 않는 result 값입니다.",
      }), timestamp);
    }

    const stored = {
      conceptId: normalized.canonicalConceptId,
      sourceConceptId: normalized.inputConceptId,
      unitAliasId: normalized.unitAliasId || null,
      problemId: String(evidence.problemId || ""),
      structureSignature: String(evidence.structureSignature || ""),
      solutionPathSignature: String(evidence.solutionPathSignature || ""),
      stage: String(evidence.stage || "BASIC"),
      result: evidence.result,
      misconceptionTags: unique(evidence.misconceptionTags || []),
      independentCheck: evidence.independentCheck === true,
      finalSubmission: evidence.finalSubmission === true,
      timestamp,
      returnCheckpointPassed: evidence.returnCheckpointPassed === true,
      sourceSubmissionId: submissionId || null,
      evidenceFingerprint: fingerprint,
    };
    const draft = stateApi.mutableCopy(previousState);
    draft.evidenceByConcept[conceptKey] = [...existing, stored];

    if (!normalized.canonicalConceptId) {
      return stateApi.commitState(previousState, draft, decision("UNIT_ALIAS_EVIDENCE_RECORDED", {
        aliasId: normalized.unitAliasId,
        reason: "세부 개념 근거가 없어 광역 증거로만 저장했으며 세부 개념 숙달에는 반영하지 않았습니다.",
      }), timestamp);
    }

    const mastery = stateApi.ensureMasteryRecord(draft, normalized.canonicalConceptId);
    if (mastery.status === "NOT_STARTED" || mastery.status === "ENTRY_CHECK") mastery.status = "LEARNING";
    mastery.lastAttemptAt = timestamp;
    if (isCorrectEvidence(stored)) {
      if (stored.structureSignature) mastery.correctStructureIds = unique([...mastery.correctStructureIds, stored.structureSignature]);
      if (stored.solutionPathSignature) mastery.correctSolutionPathIds = unique([...mastery.correctSolutionPathIds, stored.solutionPathSignature]);
      if (stored.stage === "BASIC") mastery.basicProgress += 1;
      else mastery.advancedProgress += 1;
      if (stored.independentCheck) mastery.independentCheckPassed = true;
    } else if (isFinalEvidence(stored) && (stored.result === "INCORRECT" || stored.result === "GIVEUP")) {
      if (stored.structureSignature) mastery.wrongStructureIds = unique([...mastery.wrongStructureIds, stored.structureSignature]);
      if (stored.result === "GIVEUP") mastery.giveupCount += 1;
      stored.misconceptionTags.forEach((tag) => {
        mastery.misconceptionCounts[tag] = Number(mastery.misconceptionCounts[tag] || 0) + 1;
        draft.misconceptionEvidence[normalized.canonicalConceptId] ||= {};
        const current = draft.misconceptionEvidence[normalized.canonicalConceptId][tag] || {
          problemIds: [], structureSignatures: [], solutionPathSignatures: [], count: 0, lastAt: null,
        };
        current.problemIds = unique([...current.problemIds, stored.problemId]);
        current.structureSignatures = unique([...current.structureSignatures, stored.structureSignature]);
        current.solutionPathSignatures = unique([...current.solutionPathSignatures, stored.solutionPathSignature]);
        current.count += 1;
        current.lastAt = timestamp;
        draft.misconceptionEvidence[normalized.canonicalConceptId][tag] = current;
      });
    }
    return stateApi.commitState(previousState, draft, decision("EVIDENCE_RECORDED", {
      conceptId: normalized.canonicalConceptId,
      problemId: stored.problemId,
      result: stored.result,
      countedForMastery: isCorrectEvidence(stored),
    }), timestamp);
  }

  function conceptEvidence(state, conceptId, fromIndex = 0) {
    return (state.evidenceByConcept[conceptId] || []).slice(fromIndex).filter(isFinalEvidence);
  }

  function evaluateConceptStatus(state, externalConceptId) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return { status: normalized.status, conceptId: null };
    const conceptId = normalized.canonicalConceptId;
    const mastery = state.masteryByConcept[conceptId] || stateApi.createMasteryRecord();
    const evidence = conceptEvidence(state, conceptId);
    return {
      conceptId,
      status: mastery.status,
      finalEvidenceCount: evidence.length,
      correctCount: evidence.filter(isCorrectEvidence).length,
      distinctCorrectStructures: unique(evidence.filter(isCorrectEvidence).map((item) => item.structureSignature)).length,
      distinctCorrectSolutionPaths: unique(evidence.filter(isCorrectEvidence).map((item) => item.solutionPathSignature)).length,
      independentCheckPassed: mastery.independentCheckPassed === true,
      giveupCount: mastery.giveupCount || 0,
      repeatedMisconceptionTags: Object.entries(state.misconceptionEvidence[conceptId] || {})
        .filter(([, item]) => item.structureSignatures.length >= 2).map(([tag]) => tag),
    };
  }

  function masteryScore(state, conceptId) {
    const mastery = state.masteryByConcept[conceptId] || stateApi.createMasteryRecord();
    return (mastery.status === "MASTERED" ? 10000 : 0)
      + mastery.correctStructureIds.length * 100
      + mastery.correctSolutionPathIds.length * 50
      + mastery.basicProgress + mastery.advancedProgress;
  }

  function remediationTrigger(state, conceptId) {
    const evidence = conceptEvidence(state, conceptId);
    const tagEntries = Object.entries(state.misconceptionEvidence[conceptId] || {})
      .filter(([, item]) => item.structureSignatures.length >= 2)
      .sort((a, b) => b[1].structureSignatures.length - a[1].structureSignatures.length || a[0].localeCompare(b[0]));
    if (tagEntries.length) return { type: "REPEATED_MISCONCEPTION", tag: tagEntries[0][0], count: tagEntries[0][1].structureSignatures.length };
    const distinctPaths = [];
    for (let index = evidence.length - 1; index >= 0 && distinctPaths.length < 3; index -= 1) {
      const item = evidence[index];
      if (item.solutionPathSignature && !distinctPaths.some((entry) => entry.solutionPathSignature === item.solutionPathSignature)) distinctPaths.push(item);
    }
    if (distinctPaths.length === 3 && distinctPaths.filter(isCorrectEvidence).length <= 1) {
      return { type: "LOW_PATH_SUCCESS", tag: distinctPaths.flatMap((item) => item.misconceptionTags)[0] || null, count: 3 };
    }
    const giveup = [...evidence].reverse().find((item) => item.result === "GIVEUP");
    if (giveup) return { type: "GIVEUP", tag: giveup.misconceptionTags[0] || null, count: 1 };
    return null;
  }

  function remediationCandidates(state, conceptId, tag) {
    const node = nodeFor(conceptId);
    if (!node) return [];
    const mapped = tag ? node.misconceptionRemediationMap[tag] || [] : [];
    const ordered = unique([...mapped, ...node.remedialConceptIds, ...node.prerequisiteConceptIds]);
    return ordered.filter((id) => id !== conceptId).map((id) => {
      const candidate = nodeFor(id);
      const inStack = state.recoveryStack.some((frame) => frame.enteredRemedialConceptId === id && frame.phase === "REMEDIATION");
      const pairAttempts = state.decisionHistory.filter((item) => item.decision === "DESCEND" && item.fromConceptId === conceptId && item.toConceptId === id).length;
      let availability = "AVAILABLE";
      let reason = null;
      if (!candidate || candidate.contentAvailability === "NO_CONTENT" || candidate.runtimeAvailability === "NO_RUNTIME") {
        availability = "BLOCKED_NO_CONTENT";
        reason = "실행 가능한 콘텐츠가 없습니다.";
      } else if (inStack || pairAttempts >= MAX_SAME_REMEDIATION_ATTEMPTS) {
        availability = "BLOCKED_REPEAT";
        reason = "같은 보충 경로의 반복 한도를 적용했습니다.";
      } else if (gradeIndex[candidate.internalGradeBand] < gradeIndex[graph.MINIMUM_GRADE_BAND]) {
        availability = "BLOCKED_MINIMUM";
        reason = "초4 하한 아래로 내려갈 수 없습니다.";
      }
      return {
        conceptId: id,
        source: mapped.includes(id) ? "MISCONCEPTION_MAP" : node.remedialConceptIds.includes(id) ? "REMEDIAL" : "PREREQUISITE",
        availability,
        reason,
        completeSpring: candidate?.contentAvailability === AUTO_CONTENT && candidate?.runtimeAvailability === AUTO_RUNTIME,
        masteryScore: masteryScore(state, id),
      };
    });
  }

  function getAvailableRemedialConcepts(state, externalConceptId, misconceptionTag = null) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return [];
    return remediationCandidates(state, normalized.canonicalConceptId, misconceptionTag)
      .filter((item) => item.availability === "AVAILABLE")
      .sort((a, b) => remediationSourceRank[a.source] - remediationSourceRank[b.source]
        || Number(b.completeSpring) - Number(a.completeSpring)
        || a.masteryScore - b.masteryScore
        || a.conceptId.localeCompare(b.conceptId));
  }

  function selectRemedialConcept(state, externalConceptId = state.activeConceptId) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return decision("UNKNOWN_CONCEPT", { conceptId: normalized.inputConceptId });
    const conceptId = normalized.canonicalConceptId;
    const trigger = remediationTrigger(state, conceptId);
    if (!trigger) return decision("STAY", { conceptId, reason: "하강 기준을 충족하지 않았습니다." });
    const node = nodeFor(conceptId);
    const allCandidates = remediationCandidates(state, conceptId, trigger.tag);
    const candidates = allCandidates.filter((item) => item.availability === "AVAILABLE")
      .sort((a, b) => remediationSourceRank[a.source] - remediationSourceRank[b.source]
        || Number(b.completeSpring) - Number(a.completeSpring)
        || a.masteryScore - b.masteryScore
        || a.conceptId.localeCompare(b.conceptId));
    if (!candidates.length) {
      const atMinimum = node.internalGradeBand === graph.MINIMUM_GRADE_BAND;
      return decision(atMinimum ? "FOUNDATION_SUPPORT" : "REMEDIATE_IN_PLACE", {
        fromConceptId: conceptId,
        misconceptionTag: trigger.tag,
        evidenceCount: trigger.count,
        blockedCandidates: allCandidates,
        reason: atMinimum
          ? "초4 하한을 유지하고 현재 개념 안에서 기초 설명과 보조 문제를 제공합니다."
          : "진입 가능한 직접 보충 노드가 없어 현재 개념에서 다른 구조로 보충합니다.",
      });
    }
    return decision("DESCEND", {
      fromConceptId: conceptId,
      toConceptId: candidates[0].conceptId,
      misconceptionTag: trigger.tag,
      evidenceCount: trigger.count,
      trigger: trigger.type,
      candidateSource: candidates[0].source,
      entryMode: candidates[0].completeSpring ? "SPRING" : "LEGACY_REMEDIATION",
      blockedCandidates: allCandidates.filter((item) => item.availability !== "AVAILABLE"),
      reason: `${trigger.type} 증거에 가장 직접적이고 현재 숙달도가 낮은 진입 가능 보충 개념을 선택했습니다.`,
    });
  }

  function beginRemediation(previousState, selectedDecision = selectRemedialConcept(previousState), options = {}) {
    const timestamp = timestampFor(previousState, options.timestamp);
    if (selectedDecision.decision !== "DESCEND") {
      const draft = stateApi.mutableCopy(previousState);
      if (selectedDecision.blockedCandidates?.length) {
        draft.blockedCandidates = unique([...draft.blockedCandidates, ...selectedDecision.blockedCandidates.map((item) => item.conceptId)]);
      }
      return stateApi.commitState(previousState, draft, selectedDecision, timestamp);
    }
    if (previousState.recoveryStack.length >= (options.maxRecoveryDepth || MAX_RECOVERY_DEPTH)) {
      const draft = stateApi.mutableCopy(previousState);
      return stateApi.commitState(previousState, draft, decision("RECOVERY_DEPTH_BLOCKED", {
        fromConceptId: selectedDecision.fromConceptId,
        toConceptId: selectedDecision.toConceptId,
        reason: "보충 중첩 최대 깊이에 도달했습니다.",
      }), timestamp);
    }
    if (previousState.recoveryStack.at(-1)?.conceptId === selectedDecision.fromConceptId
      && previousState.recoveryStack.at(-1)?.enteredRemedialConceptId === selectedDecision.toConceptId) return previousState;

    const draft = stateApi.mutableCopy(previousState);
    const fromNode = nodeFor(selectedDecision.fromConceptId);
    const toNode = nodeFor(selectedDecision.toConceptId);
    const fromMastery = stateApi.ensureMasteryRecord(draft, selectedDecision.fromConceptId);
    const toMastery = stateApi.ensureMasteryRecord(draft, selectedDecision.toConceptId);
    fromMastery.status = "REMEDIAL_REQUIRED";
    toMastery.status = "REMEDIAL_ACTIVE";
    const frame = {
      conceptId: selectedDecision.fromConceptId,
      returnCondition: fromNode.returnCondition,
      savedCheckpoint: {
        evidenceCount: (previousState.evidenceByConcept[selectedDecision.fromConceptId] || []).length,
        remedialEvidenceCount: (previousState.evidenceByConcept[selectedDecision.toConceptId] || []).length,
        wrongStructureIds: [...fromMastery.wrongStructureIds],
        misconceptionTag: selectedDecision.misconceptionTag,
      },
      enteredRemedialConceptId: selectedDecision.toConceptId,
      reason: selectedDecision.reason,
      misconceptionTag: selectedDecision.misconceptionTag,
      phase: "REMEDIATION",
    };
    draft.recoveryStack.push(frame);
    draft.returnCheckpoint = frame.savedCheckpoint;
    draft.activeConceptId = selectedDecision.toConceptId;
    draft.activeUnitName = toNode.unitName;
    draft.activePath.push(selectedDecision.toConceptId);
    draft.pendingRemedialConceptIds = unique([...draft.pendingRemedialConceptIds, selectedDecision.toConceptId]);
    draft.blockedCandidates = unique([...draft.blockedCandidates, ...(selectedDecision.blockedCandidates || []).map((item) => item.conceptId)]);
    return stateApi.commitState(previousState, draft, selectedDecision, timestamp);
  }

  function evaluateRemediationCompletion(state) {
    const frame = state.recoveryStack.at(-1);
    if (!frame) return { complete: false, phase: null, reason: "활성 보충 경로가 없습니다." };
    if (frame.phase === "REMEDIATION") {
      if (state.activeConceptId !== frame.enteredRemedialConceptId) return { complete: false, phase: frame.phase, reason: "보충 대상이 활성 개념이 아닙니다." };
      const evidence = conceptEvidence(state, frame.enteredRemedialConceptId, frame.savedCheckpoint.remedialEvidenceCount);
      const correct = evidence.filter(isCorrectEvidence);
      const structures = unique(correct.map((item) => item.structureSignature));
      const paths = unique(correct.map((item) => item.solutionPathSignature));
      const independent = correct.some((item) => item.independentCheck);
      const noGiveup = !evidence.some((item) => item.result === "GIVEUP");
      return {
        complete: structures.length >= 3 && paths.length >= 2 && correct.length >= 2 && independent && noGiveup,
        phase: frame.phase,
        correctCount: correct.length,
        distinctStructures: structures.length,
        distinctSolutionPaths: paths.length,
        independentCheckPassed: independent,
        giveupFree: noGiveup,
      };
    }
    const evidence = conceptEvidence(state, frame.conceptId, frame.savedCheckpoint.evidenceCount);
    const correct = evidence.filter(isCorrectEvidence)
      .filter((item) => !frame.savedCheckpoint.wrongStructureIds.includes(item.structureSignature));
    const structures = unique(correct.map((item) => item.structureSignature));
    const repeatedTag = frame.misconceptionTag && evidence.some((item) =>
      (item.result === "INCORRECT" || item.result === "GIVEUP") && item.misconceptionTags.includes(frame.misconceptionTag));
    const checkPassed = correct.some((item) => item.independentCheck || item.returnCheckpointPassed);
    return {
      complete: structures.length >= 3 && correct.length >= 2 && !repeatedTag && checkPassed,
      phase: frame.phase,
      correctCount: correct.length,
      distinctStructures: structures.length,
      misconceptionRecurred: Boolean(repeatedTag),
      returnCheckpointPassed: checkPassed,
    };
  }

  function returnToCheckpoint(previousState, options = {}) {
    const timestamp = timestampFor(previousState, options.timestamp);
    const frame = previousState.recoveryStack.at(-1);
    const completion = evaluateRemediationCompletion(previousState);
    if (!frame || !completion.complete) {
      const draft = stateApi.mutableCopy(previousState);
      if (frame?.phase === "RETURN_CHECK" && completion.misconceptionRecurred) {
        const alternatives = getAvailableRemedialConcepts(previousState, frame.conceptId, frame.misconceptionTag)
          .filter((item) => item.conceptId !== frame.enteredRemedialConceptId)
          .map((item) => item.conceptId);
        return stateApi.commitState(previousState, draft, decision("RETURN_CHECK_FAILED", {
          conceptId: frame.conceptId,
          failedRemedialConceptId: frame.enteredRemedialConceptId,
          alternativeRemedialConceptIds: alternatives,
          fallback: alternatives.length ? "ALTERNATIVE_REMEDIAL" : "REMEDIATE_IN_PLACE",
          reason: "같은 오류가 재발해 직전 보충 개념으로 즉시 재진입하지 않습니다.",
        }), timestamp);
      }
      return stateApi.commitState(previousState, draft, decision("RETURN_NOT_READY", {
        conceptId: previousState.activeConceptId,
        phase: completion.phase,
        reason: "보충 또는 복귀 확인 조건이 아직 충족되지 않았습니다.",
      }), timestamp);
    }
    const draft = stateApi.mutableCopy(previousState);
    if (frame.phase === "REMEDIATION") {
      const returnFrame = { ...stateApi.clone(frame), phase: "RETURN_CHECK" };
      draft.recoveryStack[draft.recoveryStack.length - 1] = returnFrame;
      draft.activeConceptId = returnFrame.conceptId;
      draft.activeUnitName = nodeFor(returnFrame.conceptId).unitName;
      stateApi.ensureMasteryRecord(draft, returnFrame.enteredRemedialConceptId).status = "MASTERED";
      stateApi.ensureMasteryRecord(draft, returnFrame.conceptId).status = "RETURN_CHECK";
      draft.returnCheckpoint = returnFrame.savedCheckpoint;
      draft.completedRemedialConceptIds = unique([...draft.completedRemedialConceptIds, returnFrame.enteredRemedialConceptId]);
      draft.pendingRemedialConceptIds = draft.pendingRemedialConceptIds.filter((id) => id !== returnFrame.enteredRemedialConceptId);
      return stateApi.commitState(previousState, draft, decision("RETURN", {
        fromConceptId: returnFrame.enteredRemedialConceptId,
        toConceptId: returnFrame.conceptId,
        recoveredMisconceptionTags: unique([returnFrame.misconceptionTag]),
        remainingRecoveryDepth: draft.recoveryStack.length,
      }), timestamp);
    }

    draft.recoveryStack.pop();
    const parentMastery = stateApi.ensureMasteryRecord(draft, frame.conceptId);
    if (frame.misconceptionTag) {
      parentMastery.resolvedMisconceptionTags = unique([...parentMastery.resolvedMisconceptionTags, frame.misconceptionTag]);
      parentMastery.misconceptionCounts[frame.misconceptionTag] = 0;
      if (draft.misconceptionEvidence[frame.conceptId]) delete draft.misconceptionEvidence[frame.conceptId][frame.misconceptionTag];
    }
    parentMastery.status = "LEARNING";
    const outer = draft.recoveryStack.at(-1);
    let toConceptId = frame.conceptId;
    if (outer && outer.phase === "REMEDIATION" && outer.enteredRemedialConceptId === frame.conceptId) {
      outer.phase = "RETURN_CHECK";
      draft.recoveryStack[draft.recoveryStack.length - 1] = outer;
      toConceptId = outer.conceptId;
      draft.activeConceptId = outer.conceptId;
      draft.activeUnitName = nodeFor(outer.conceptId).unitName;
      stateApi.ensureMasteryRecord(draft, outer.conceptId).status = "RETURN_CHECK";
      draft.returnCheckpoint = outer.savedCheckpoint;
    } else {
      draft.activeConceptId = frame.conceptId;
      draft.activeUnitName = nodeFor(frame.conceptId).unitName;
      draft.returnCheckpoint = outer?.savedCheckpoint || null;
    }
    return stateApi.commitState(previousState, draft, decision("RETURN", {
      fromConceptId: frame.enteredRemedialConceptId,
      toConceptId,
      recoveredMisconceptionTags: unique([frame.misconceptionTag]),
      remainingRecoveryDepth: draft.recoveryStack.length,
    }), timestamp);
  }

  function evaluateMastery(state, externalConceptId = state.activeConceptId) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return { mastered: false, status: normalized.status, reasons: ["UNKNOWN_CONCEPT"] };
    const conceptId = normalized.canonicalConceptId;
    const evidence = conceptEvidence(state, conceptId);
    const correct = evidence.filter(isCorrectEvidence);
    const structures = unique(correct.map((item) => item.structureSignature));
    const paths = unique(correct.map((item) => item.solutionPathSignature));
    const independent = correct.some((item) => item.independentCheck);
    const mastery = state.masteryByConcept[conceptId] || stateApi.createMasteryRecord();
    const unresolvedTags = Object.entries(state.misconceptionEvidence[conceptId] || {})
      .filter(([tag, item]) => item.structureSignatures.length >= 2 && !mastery.resolvedMisconceptionTags.includes(tag))
      .map(([tag]) => tag);
    const pending = state.recoveryStack.some((frame) => frame.conceptId === conceptId || frame.enteredRemedialConceptId === conceptId);
    const giveup = evidence.some((item) => item.result === "GIVEUP");
    const reasons = [];
    if (structures.length < 3) reasons.push("STRUCTURES_REQUIRED");
    if (paths.length < 3) reasons.push("SOLUTION_PATHS_REQUIRED");
    if (!independent) reasons.push("INDEPENDENT_CHECK_REQUIRED");
    if (giveup) reasons.push("GIVEUP_PRESENT");
    if (unresolvedTags.length) reasons.push("MISCONCEPTION_UNRESOLVED");
    if (pending) reasons.push("RECOVERY_PENDING");
    return { mastered: reasons.length === 0, conceptId, reasons, distinctStructures: structures.length, distinctSolutionPaths: paths.length, independentCheckPassed: independent };
  }

  function markMastered(previousState, conceptId, timestamp) {
    const result = evaluateMastery(previousState, conceptId);
    if (!result.mastered) return previousState;
    const draft = stateApi.mutableCopy(previousState);
    stateApi.ensureMasteryRecord(draft, conceptId).status = "MASTERED";
    return stateApi.commitState(previousState, draft, decision("MASTERED", { conceptId, reason: "숙달 증거 계약을 충족했습니다." }), timestampFor(previousState, timestamp));
  }

  function prerequisiteSatisfied(state, prerequisiteId, currentConceptId) {
    if (prerequisiteId === currentConceptId) return true;
    const status = state.masteryByConcept[prerequisiteId]?.status;
    return status === "MASTERED" || status === "MAXIMUM_REACHED";
  }

  function classifyPromotionCandidate(state, currentConceptId, targetId, source) {
    const target = nodeFor(targetId);
    if (!target) return { conceptId: targetId, source, available: false, reason: "UNKNOWN_CONCEPT" };
    if (target.contentAvailability !== AUTO_CONTENT || target.runtimeAvailability !== AUTO_RUNTIME) {
      const missingPrerequisites = target.prerequisiteConceptIds.filter((id) => !prerequisiteSatisfied(state, id, currentConceptId));
      const entryCheckRequiredConceptIds = missingPrerequisites.filter((id) => {
        const prerequisite = nodeFor(id);
        return prerequisite && (prerequisite.contentAvailability !== AUTO_CONTENT || prerequisite.runtimeAvailability !== AUTO_RUNTIME);
      });
      return {
        conceptId: targetId,
        source,
        available: false,
        reason: "AUTO_ENTRY_BLOCKED",
        contentAvailability: target.contentAvailability,
        runtimeAvailability: target.runtimeAvailability,
        missingPrerequisites,
        entryCheckRequiredConceptIds,
      };
    }
    const missingPrerequisites = target.prerequisiteConceptIds.filter((id) => !prerequisiteSatisfied(state, id, currentConceptId));
    if (missingPrerequisites.length) {
      const entryCheckRequiredConceptIds = missingPrerequisites.filter((id) => {
        const prerequisite = nodeFor(id);
        return prerequisite && (prerequisite.contentAvailability !== AUTO_CONTENT || prerequisite.runtimeAvailability !== AUTO_RUNTIME);
      });
      return {
        conceptId: targetId,
        source,
        available: false,
        reason: "PREREQUISITE_UNMASTERED",
        missingPrerequisites,
        entryCheckRequiredConceptIds,
      };
    }
    return { conceptId: targetId, source, available: true, reason: null };
  }

  function getAvailableNextConcepts(state, externalConceptId = state.activeConceptId) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return { available: [], blocked: [] };
    const node = nodeFor(normalized.canonicalConceptId);
    const candidates = [
      ...node.nextConceptIds.map((id) => classifyPromotionCandidate(state, node.conceptId, id, "NEXT")),
      ...node.transferConceptIds.filter((id) => !node.nextConceptIds.includes(id)).map((id) => classifyPromotionCandidate(state, node.conceptId, id, "TRANSFER")),
    ];
    return {
      available: candidates.filter((item) => item.available).sort((a, b) => a.source.localeCompare(b.source) || a.conceptId.localeCompare(b.conceptId)),
      blocked: candidates.filter((item) => !item.available),
    };
  }

  function selectPromotionConcept(state, externalConceptId = state.activeConceptId) {
    const normalized = normalizeConceptId(externalConceptId);
    if (!normalized.canonicalConceptId) return decision("UNKNOWN_CONCEPT", { conceptId: normalized.inputConceptId });
    const node = nodeFor(normalized.canonicalConceptId);
    const mastery = evaluateMastery(state, node.conceptId);
    if (!mastery.mastered && state.masteryByConcept[node.conceptId]?.status !== "MASTERED") {
      return decision("PROMOTION_NOT_READY", { conceptId: node.conceptId, reasons: mastery.reasons });
    }
    if (node.internalGradeBand === graph.MAXIMUM_GRADE_BAND) {
      return decision("MAXIMUM_REACHED", { conceptId: node.conceptId, reason: "고3 상한에서 더 높은 개념으로 자동 상승하지 않습니다." });
    }
    const candidates = getAvailableNextConcepts(state, node.conceptId);
    if (!candidates.available.length) {
      return decision("PROMOTION_BLOCKED", {
        fromConceptId: node.conceptId,
        blockedCandidates: candidates.blocked,
        reason: "직접 연결된 후보 중 자동 진입 가능한 콘텐츠와 선수 조건을 모두 충족한 노드가 없습니다.",
      });
    }
    const selected = candidates.available[0];
    return decision("PROMOTE", {
      fromConceptId: node.conceptId,
      toConceptId: selected.conceptId,
      source: selected.source,
      reason: "직접 연결·콘텐츠·런타임·선수 숙달 조건을 충족한 후보를 선택했습니다.",
    });
  }

  function promoteConcept(previousState, selectedDecision = selectPromotionConcept(previousState), options = {}) {
    const timestamp = timestampFor(previousState, options.timestamp);
    const draft = stateApi.mutableCopy(previousState);
    if (selectedDecision.decision === "MAXIMUM_REACHED") {
      stateApi.ensureMasteryRecord(draft, selectedDecision.conceptId).status = "MAXIMUM_REACHED";
      return stateApi.commitState(previousState, draft, selectedDecision, timestamp);
    }
    if (selectedDecision.decision !== "PROMOTE") {
      draft.blockedCandidates = unique([...draft.blockedCandidates, ...(selectedDecision.blockedCandidates || []).map((item) => item.conceptId)]);
      (selectedDecision.blockedCandidates || []).forEach((item) => {
        if (item.reason === "AUTO_ENTRY_BLOCKED") stateApi.ensureMasteryRecord(draft, item.conceptId).status = "BLOCKED_NO_CONTENT";
      });
      return stateApi.commitState(previousState, draft, selectedDecision, timestamp);
    }
    const target = nodeFor(selectedDecision.toConceptId);
    draft.activeConceptId = target.conceptId;
    draft.activeUnitName = target.unitName;
    draft.activePath.push(target.conceptId);
    draft.promotionCandidates = getAvailableNextConcepts(previousState, selectedDecision.fromConceptId).available.map((item) => item.conceptId);
    draft.blockedCandidates = unique([...draft.blockedCandidates, ...getAvailableNextConcepts(previousState, selectedDecision.fromConceptId).blocked.map((item) => item.conceptId)]);
    stateApi.ensureMasteryRecord(draft, selectedDecision.fromConceptId).status = "MASTERED";
    stateApi.ensureMasteryRecord(draft, target.conceptId).status = "ENTRY_CHECK";
    return stateApi.commitState(previousState, draft, selectedDecision, timestamp);
  }

  function getStudentFacingStatus(state) {
    const active = nodeFor(state.activeConceptId);
    const frame = state.recoveryStack.at(-1);
    const availableNext = active ? getAvailableNextConcepts(state, active.conceptId).available[0] : null;
    const pending = state.pendingRemedialConceptIds.map(nodeFor).filter(Boolean);
    return Object.freeze({
      "현재 학습": active?.displayName || null,
      "먼저 복습할 개념": pending[0]?.displayName || null,
      "기초 보충": frame ? nodeFor(frame.enteredRemedialConceptId)?.displayName || null : null,
      "다음 도전": availableNext ? nodeFor(availableNext.conceptId)?.displayName || null : null,
      "원래 학습으로 돌아가기": frame ? nodeFor(frame.conceptId)?.displayName || null : null,
    });
  }

  function serializeGraphState(state) {
    if (!stateApi.validateStateShape(state)) throw new Error("INVALID_GRAPH_STATE");
    return JSON.stringify(state);
  }

  function hydrateGraphState(serialized, options = {}) {
    let parsed;
    try { parsed = typeof serialized === "string" ? JSON.parse(serialized) : stateApi.clone(serialized); }
    catch { return createInitialGraphState(options); }
    if (!stateApi.validateStateShape(parsed) || parsed.graphVersion !== graph.VERSION) return createInitialGraphState(options);
    const active = nodeFor(parsed.activeConceptId);
    if (parsed.activeConceptId && !active) return createInitialGraphState(options);
    return stateApi.deepFreeze(parsed);
  }

  return Object.freeze({
    VERSION,
    MAX_RECOVERY_DEPTH,
    createInitialGraphState,
    normalizeConceptId,
    recordEvidence,
    evaluateConceptStatus,
    selectRemedialConcept,
    beginRemediation,
    evaluateRemediationCompletion,
    returnToCheckpoint,
    evaluateMastery,
    selectPromotionConcept,
    promoteConcept,
    getAvailableNextConcepts,
    getAvailableRemedialConcepts,
    getStudentFacingStatus,
    serializeGraphState,
    hydrateGraphState,
    markMastered,
  });
});
