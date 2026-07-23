(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_LEVEL_REPORT = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = 1;
  const STAGES = Object.freeze(["BASIC", "ADVANCED_1", "ADVANCED_2", "ADVANCED_3", "ADVANCED_4", "ADVANCED_5"]);
  const STAGE_LABELS = Object.freeze({
    BASIC: "기본",
    ADVANCED_1: "A1",
    ADVANCED_2: "A2",
    ADVANCED_3: "A3",
    ADVANCED_4: "A4",
    ADVANCED_5: "A5",
  });
  const RECOMMENDATION_REASONS = Object.freeze({
    RECOVERY_FOUNDATION: "선행 개념 회복이 먼저 필요해요.",
    RETURN_PREPARATION: "원래 진단 단계로 돌아가기 전에 한 번 더 확인해요.",
    ERROR_REPAIR: "반복해서 헷갈린 개념을 먼저 바로잡아요.",
    CURRENT_PROGRESS: "현재 확인 중인 단계부터 이어가요.",
    ADVANCED_CONTINUE: "확인된 기본 위에 다음 단계를 이어가요.",
    SPACED_REVIEW: "잊지 않도록 지금 다시 확인할 때예요.",
  });

  function clampStageIndex(value) {
    return Math.max(0, Math.min(STAGES.length - 1, Number(value) || 0));
  }

  function stageLabel(stageIndex) {
    return STAGE_LABELS[STAGES[clampStageIndex(stageIndex)]];
  }

  function conceptOutcome(definition, memory) {
    const mastery = memory?.conceptMastery?.[definition.conceptId] || {};
    const diagnosis = memory?.conceptDiagnosisMap?.[definition.conceptId] || {};
    const diagnosisAttempts = (Number(diagnosis.basicCorrectCount) || 0)
      + (Number(diagnosis.basicWrongCount) || 0)
      + (Number(diagnosis.basicGiveUpCount) || 0);
    const attempts = Math.max(Number(mastery.attempts) || 0, diagnosisAttempts);
    const correct = Math.max(Number(mastery.correct) || 0, Number(diagnosis.basicCorrectCount) || 0);
    const wrong = Math.max(Number(mastery.wrong) || 0, Number(diagnosis.basicWrongCount) || 0);
    const giveUp = Math.max(Number(mastery.giveUp) || 0, Number(diagnosis.basicGiveUpCount) || 0);
    const currentStageIndex = clampStageIndex(mastery.stageIndex);
    const mastered = mastery.status === "MASTERED";
    const recovery = mastery.status === "RECOVERY_REQUIRED" || diagnosis.status === "RECOVERY_REQUIRED" || giveUp > 0;
    const weak = recovery
      || wrong > 0
      || ["UNSTABLE", "DIAGNOSIS_REQUIRED"].includes(mastery.status)
      || diagnosis.status === "UNSTABLE";
    const assessed = attempts > 0 || (diagnosis.distinctProblemFamiliesChecked || []).length > 0;
    const securedStageIndex = mastered ? STAGES.length - 1 : currentStageIndex > 0 ? currentStageIndex - 1 : -1;
    const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    const state = mastered ? "MASTERED" : recovery ? "RECOVERY" : weak ? "WEAK" : assessed ? "PROGRESSING" : "PENDING";
    const stateLabel = {
      MASTERED: "A5 숙달",
      RECOVERY: "선행 개념 회복",
      WEAK: "보완 필요",
      PROGRESSING: `${stageLabel(currentStageIndex)} 확인 중`,
      PENDING: "미진단",
    }[state];
    const severity = (recovery ? 20 : 0) + giveUp * 6 + wrong * 4 + (weak ? 3 : 0) + (assessed && securedStageIndex < 0 ? 2 : 0);

    return {
      conceptId: definition.conceptId,
      title: definition.conceptName || definition.title || mastery.title || definition.conceptId,
      unitId: definition.unitId,
      unitTitle: definition.unitTitle,
      order: Number(definition.order) || 0,
      diagnosisPriority: Number(diagnosis.priority ?? mastery.diagnosisPriority ?? definition.order) || 9999,
      attempts,
      correct,
      wrong,
      giveUp,
      accuracy,
      assessed,
      mastered,
      recovery,
      weak,
      currentStageIndex,
      currentStage: STAGES[currentStageIndex],
      currentStageLabel: stageLabel(currentStageIndex),
      securedStageIndex,
      securedStage: securedStageIndex >= 0 ? STAGES[securedStageIndex] : null,
      securedStageLabel: securedStageIndex >= 0 ? stageLabel(securedStageIndex) : "기본 보완",
      state,
      stateLabel,
      severity,
      prerequisiteConceptIds: [...new Set(mastery.prerequisiteConceptIds || definition.prerequisiteConceptIds || [])],
    };
  }

  function unitOutcome(unit, concepts) {
    const assessed = concepts.filter((concept) => concept.assessed);
    const mastered = concepts.filter((concept) => concept.mastered);
    const weak = concepts.filter((concept) => concept.weak);
    const recovery = concepts.filter((concept) => concept.recovery);
    const attempts = concepts.reduce((sum, concept) => sum + concept.attempts, 0);
    const correct = concepts.reduce((sum, concept) => sum + concept.correct, 0);
    const verifiedStages = assessed.map((concept) => concept.securedStageIndex);
    const securedStageIndex = verifiedStages.length ? Math.min(...verifiedStages) : -1;
    const status = mastered.length === concepts.length && concepts.length
      ? "MASTERED"
      : recovery.length
        ? "RECOVERY"
        : weak.length
          ? "WEAK"
          : assessed.length === concepts.length
            ? "STABLE"
            : assessed.length
              ? "IN_PROGRESS"
              : "PENDING";
    return {
      unitId: unit.unitId,
      unitTitle: unit.unitTitle,
      routeConceptId: unit.routeConceptId,
      totalConcepts: concepts.length,
      assessedConcepts: assessed.length,
      masteredConcepts: mastered.length,
      weakConcepts: weak.length,
      recoveryConcepts: recovery.length,
      attempts,
      correct,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      coveragePercent: concepts.length ? Math.round((assessed.length / concepts.length) * 100) : 0,
      securedStageIndex,
      securedStage: securedStageIndex >= 0 ? STAGES[securedStageIndex] : null,
      securedStageLabel: securedStageIndex >= 0 ? stageLabel(securedStageIndex) : assessed.length ? "기본 보완" : "미진단",
      status,
      concepts,
    };
  }

  function fallbackRecommendation(memory, concepts) {
    const activeRecovery = (memory?.recoveryStack || []).at(-1);
    if (activeRecovery?.recoveryConceptId) {
      const concept = concepts.find((item) => item.conceptId === activeRecovery.recoveryConceptId);
      const saved = memory?.conceptMastery?.[activeRecovery.recoveryConceptId];
      return {
        recommendationId: null,
        conceptId: activeRecovery.recoveryConceptId,
        title: concept?.title || saved?.title || "선행 개념",
        unitTitle: concept?.unitTitle || saved?.unitTitle || "기초 연결",
        stage: STAGES[clampStageIndex(activeRecovery.recoveryStageIndex)],
        stageLabel: stageLabel(activeRecovery.recoveryStageIndex),
        reason: RECOMMENDATION_REASONS.RECOVERY_FOUNDATION,
        type: "RECOVERY_FOUNDATION",
      };
    }

    if (concepts.length > 0 && concepts.every((concept) => concept.mastered)) return null;

    const sorted = [...concepts].sort((left, right) => (
      Number(right.recovery) - Number(left.recovery)
      || right.severity - left.severity
      || Number(left.assessed) - Number(right.assessed)
      || left.currentStageIndex - right.currentStageIndex
      || left.diagnosisPriority - right.diagnosisPriority
      || left.order - right.order
    ));
    const concept = sorted.find((item) => !item.mastered) || sorted[0];
    if (!concept) return null;
    const type = concept.recovery ? "RECOVERY_FOUNDATION" : concept.weak ? "ERROR_REPAIR" : "CURRENT_PROGRESS";
    return {
      recommendationId: null,
      conceptId: concept.conceptId,
      title: concept.title,
      unitTitle: concept.unitTitle,
      stage: concept.currentStage,
      stageLabel: concept.currentStageLabel,
      reason: RECOMMENDATION_REASONS[type],
      type,
    };
  }

  function recommendationOutcome(memory, concepts) {
    if (concepts.length > 0 && concepts.every((concept) => concept.mastered)) return null;
    const recommendation = (memory?.studyMapRecommendations || []).find((item) => (
      !["COMPLETED", "DISMISSED"].includes(item.status)
    ));
    if (!recommendation) return fallbackRecommendation(memory, concepts);
    const concept = concepts.find((item) => item.conceptId === recommendation.conceptId);
    const saved = memory?.conceptMastery?.[recommendation.conceptId];
    const stage = recommendation.recoveryStage
      || recommendation.recommendedStage
      || recommendation.savedCurrentStage
      || concept?.currentStage
      || "BASIC";
    return {
      recommendationId: recommendation.id,
      conceptId: recommendation.conceptId,
      title: recommendation.title || concept?.title || saved?.title || "추천 개념",
      unitTitle: recommendation.unitTitle || concept?.unitTitle || saved?.unitTitle || "수학",
      stage,
      stageLabel: STAGE_LABELS[stage] || "기본",
      reason: RECOMMENDATION_REASONS[recommendation.type] || recommendation.description || "이 개념부터 이어서 확인해요.",
      type: recommendation.type || "CURRENT_PROGRESS",
    };
  }

  function median(values) {
    if (!values.length) return -1;
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor((sorted.length - 1) / 2)];
  }

  function createReport(memory, detailData, options = {}) {
    const definitions = (detailData?.concepts || []).filter((definition) => definition.enabled !== false);
    const concepts = definitions.map((definition) => conceptOutcome(definition, memory));
    const units = (detailData?.units || []).map((unit) => unitOutcome(
      unit,
      concepts.filter((concept) => concept.unitId === unit.unitId)
    ));
    const assessed = concepts.filter((concept) => concept.assessed);
    const mastered = concepts.filter((concept) => concept.mastered);
    const allWeakConcepts = concepts.filter((concept) => concept.weak);
    const weakConcepts = allWeakConcepts
      .sort((left, right) => right.severity - left.severity || left.diagnosisPriority - right.diagnosisPriority || left.order - right.order)
      .slice(0, 8);
    const securedStageIndex = median(assessed.map((concept) => concept.securedStageIndex));
    const coveragePercent = concepts.length ? Math.round((assessed.length / concepts.length) * 100) : 0;
    const totalAttempts = concepts.reduce((sum, concept) => sum + concept.attempts, 0);
    const totalCorrect = concepts.reduce((sum, concept) => sum + concept.correct, 0);
    const currentStageLabel = securedStageIndex >= 0 ? stageLabel(securedStageIndex) : assessed.length ? "기본 보완" : "진단 시작 전";
    const completedUnits = units.filter((unit) => unit.assessedConcepts === unit.totalConcepts && unit.totalConcepts > 0).length;

    return {
      version: VERSION,
      generatedAt: options.now || new Date().toISOString(),
      sourceUpdatedAt: memory?.updatedAt || null,
      bootstrapCompleted: Boolean(memory?.bootstrap?.completed),
      selectedGrade: memory?.selectedGrade || "중등 3학년",
      overall: {
        totalConcepts: concepts.length,
        assessedConcepts: assessed.length,
        masteredConcepts: mastered.length,
        weakConcepts: allWeakConcepts.length,
        totalUnits: units.length,
        completedUnits,
        coveragePercent,
        totalAttempts,
        totalCorrect,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
        securedStageIndex,
        securedStage: securedStageIndex >= 0 ? STAGES[securedStageIndex] : null,
        securedStageLabel: currentStageLabel,
        cycleNumber: Number(memory?.cycleNumber) || 0,
      },
      units,
      concepts,
      weakConcepts,
      startRecommendation: recommendationOutcome(memory, concepts),
    };
  }

  return Object.freeze({
    VERSION,
    STAGES,
    STAGE_LABELS,
    createReport,
    stageLabel,
  });
});
