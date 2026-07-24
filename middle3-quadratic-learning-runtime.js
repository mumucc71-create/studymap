(function (root, factory) {
  const api = factory(
    root?.STUDY_MATH_LEARNING_SCHEMA || (typeof require === "function" ? require("./math-learning-schema.js") : null),
    root?.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL || (typeof require === "function" ? require("./middle3-quadratic-learning-model.js") : null),
    root?.STUDY_M3_QUADRATIC_LEARNING_CONTENT || (typeof require === "function" ? require("./middle3-quadratic-learning-content.js") : null)
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_QUADRATIC_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (schema, model, learningContent) {
  "use strict";

  if (!schema || !model || !learningContent) {
    throw new Error("Middle3 quadratic learning dependencies are required");
  }

  const VERSION = "middle3QuadraticLearningV1";
  const CLOUD_STATE_KEY = "middle3QuadraticLearningV1";
  const STAGES = Object.freeze(["BASIC", "A1", "A2", "A3", "A4", "A5"]);
  const STAGE_STATUSES = Object.freeze([
    "NOT_STARTED",
    "IN_PROGRESS",
    "LEARNING_COMPLETED",
    "INDEPENDENT_CHECK_PENDING",
    "VERIFIED",
  ]);
  const CYCLE_STATUSES = Object.freeze(["IDLE", "ACTIVE", "PAUSED", "COMPLETED"]);
  const PURPOSES = Object.freeze({
    LEARNING: "LEARNING",
    PREVIEW: "PREVIEW",
    REVIEW: "REVIEW",
    INDEPENDENT_CHECK: "INDEPENDENT_CHECK",
    RE_PRACTICE: "RE_PRACTICE",
  });
  const CONCEPT_IDS = Object.freeze(learningContent.CONCEPTS.map((concept) => concept.conceptId));

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function unique(values) {
    return [...new Set((Array.isArray(values) ? values : []).filter(Boolean))];
  }

  function stageIndex(stage) {
    return STAGES.indexOf(stage);
  }

  function nextStage(stage) {
    const index = stageIndex(stage);
    return STAGES[Math.min(STAGES.length - 1, Math.max(0, index + 1))];
  }

  function previousStage(stage) {
    const index = stageIndex(stage);
    return STAGES[Math.max(0, index - 1)];
  }

  function timestamp(now) {
    return new Date(typeof now === "function" ? now() : Date.now()).toISOString();
  }

  function emptyMastery(conceptId) {
    return {
      conceptId,
      learningCompletedStage: null,
      verifiedStage: null,
      recommendedStage: "BASIC",
      stageStatus: Object.fromEntries(STAGES.map((stage) => [stage, "NOT_STARTED"])),
      hintsUsed: {},
      solutionsViewed: [],
      lastStudiedAt: null,
    };
  }

  function createDefaultState(userId = "guest", now = Date.now) {
    return {
      learningVersion: VERSION,
      userId,
      activeLearningCycleId: null,
      activeCycleNumber: 0,
      cycleStatus: "IDLE",
      cycleProblemIds: [],
      cycleItems: [],
      cycleTargets: {},
      currentProblemIndex: 0,
      submittedAnswers: {},
      finalizedAttempts: {},
      draftAnswers: {},
      currentConceptId: CONCEPT_IDS[0],
      currentStage: "BASIC",
      curriculumProgress: {
        completedBasicConceptIds: [],
        nextBasicConceptId: CONCEPT_IDS[0],
      },
      masteryDepthByConcept: Object.fromEntries(CONCEPT_IDS.map((conceptId) => [conceptId, emptyMastery(conceptId)])),
      viewedStages: Object.fromEntries(CONCEPT_IDS.map((conceptId) => [conceptId, []])),
      lessonContentViewed: {},
      completedLessons: [],
      hintsUsed: {},
      solutionsViewed: [],
      independentPracticeResults: [],
      pendingIndependentChecks: [],
      lastLearningPosition: null,
      returnCheckpoint: null,
      recentProblemIds: [],
      recentStructureSignatures: [],
      recentSolutionPathSignatures: [],
      cycleHistory: [],
      currentContentSlideIndex: 0,
      feedbackByProblemId: {},
      revision: 0,
      updatedAt: timestamp(now),
    };
  }

  function normalizeState(input, userId = "guest", now = Date.now) {
    const base = createDefaultState(userId, now);
    const source = input && typeof input === "object" ? clone(input) : {};
    const state = { ...base, ...source };
    state.learningVersion = VERSION;
    state.userId = userId || source.userId || "guest";
    state.cycleStatus = CYCLE_STATUSES.includes(state.cycleStatus) ? state.cycleStatus : "IDLE";
    [
      "cycleProblemIds",
      "cycleItems",
      "completedLessons",
      "solutionsViewed",
      "independentPracticeResults",
      "pendingIndependentChecks",
      "recentProblemIds",
      "recentStructureSignatures",
      "recentSolutionPathSignatures",
      "cycleHistory",
    ].forEach((field) => {
      state[field] = Array.isArray(state[field]) ? state[field] : [];
    });
    [
      "cycleTargets",
      "submittedAnswers",
      "finalizedAttempts",
      "draftAnswers",
      "viewedStages",
      "lessonContentViewed",
      "hintsUsed",
      "feedbackByProblemId",
    ].forEach((field) => {
      state[field] = state[field] && typeof state[field] === "object" ? state[field] : {};
    });
    state.masteryDepthByConcept = state.masteryDepthByConcept && typeof state.masteryDepthByConcept === "object"
      ? state.masteryDepthByConcept
      : {};
    CONCEPT_IDS.forEach((conceptId) => {
      state.viewedStages[conceptId] = unique(state.viewedStages[conceptId]);
      const saved = state.masteryDepthByConcept[conceptId] || {};
      const mastery = { ...emptyMastery(conceptId), ...saved };
      mastery.stageStatus = { ...emptyMastery(conceptId).stageStatus, ...(saved.stageStatus || {}) };
      mastery.hintsUsed = saved.hintsUsed && typeof saved.hintsUsed === "object" ? saved.hintsUsed : {};
      mastery.solutionsViewed = unique(saved.solutionsViewed);
      state.masteryDepthByConcept[conceptId] = mastery;
    });
    state.curriculumProgress = {
      ...base.curriculumProgress,
      ...(state.curriculumProgress || {}),
      completedBasicConceptIds: unique(state.curriculumProgress?.completedBasicConceptIds)
        .filter((conceptId) => CONCEPT_IDS.includes(conceptId)),
    };
    state.curriculumProgress.nextBasicConceptId = CONCEPT_IDS.find((conceptId) => (
      !state.curriculumProgress.completedBasicConceptIds.includes(conceptId)
    )) || null;
    state.currentProblemIndex = Math.max(
      0,
      Math.min(Number(state.currentProblemIndex) || 0, Math.max(0, state.cycleItems.length - 1))
    );
    return state;
  }

  function describeState(state) {
    const normalized = normalizeState(state, state?.userId || "guest");
    return {
      learningVersion: normalized.learningVersion,
      activeLearningCycleId: normalized.activeLearningCycleId,
      activeCycleNumber: normalized.activeCycleNumber,
      cycleStatus: normalized.cycleStatus,
      problemCount: normalized.cycleItems.length,
      currentProblemIndex: normalized.currentProblemIndex,
      currentProblemId: normalized.cycleItems[normalized.currentProblemIndex]?.problemId || null,
      finalizedAttemptCount: Object.keys(normalized.finalizedAttempts).length,
      pendingIndependentCheckCount: normalized.pendingIndependentChecks.length,
      curriculumProgress: clone(normalized.curriculumProgress),
      masteryDepthByConcept: clone(normalized.masteryDepthByConcept),
      revision: Number(normalized.revision) || 0,
      updatedAt: normalized.updatedAt,
    };
  }

  function resolveHydrationState(remote, local, userId = "guest") {
    const validRemote = remote
      && typeof remote === "object"
      && remote.learningVersion === VERSION;
    if (validRemote) {
      return {
        state: normalizeState(remote, userId),
        source: "REMOTE",
        conflict: local && JSON.stringify(local) !== JSON.stringify(remote) ? "remoteWins" : null,
      };
    }
    const validLocal = local
      && typeof local === "object"
      && local.learningVersion === VERSION;
    return {
      state: normalizeState(validLocal ? local : null, userId),
      source: validLocal ? "LOCAL_FALLBACK" : "NEW",
      conflict: null,
    };
  }

  function contentSlides(conceptId, stage) {
    const content = learningContent.get(conceptId, stage);
    if (!content) return [];
    return [
      {
        title: "이 단계에서 배울 사고법",
        body: content.thinkingMethod,
        formula: content.firstCondition,
        example: "문제에서 먼저 볼 조건",
      },
      {
        title: "사용할 개념과 식",
        body: content.conceptToUse,
        formula: content.whyEquation,
        example: "식을 세우는 이유",
      },
      {
        title: "풀이 연결 방식",
        body: content.solutionConnection,
        formula: content.validationMethod,
        example: "중간 결과와 답 검증",
      },
      {
        title: "자주 하는 실수",
        body: content.commonMistake,
        formula: content.validationMethod,
        example: "마지막에는 모든 조건을 다시 확인해요.",
      },
    ];
  }

  function recommendedStageFor(state, conceptId) {
    const mastery = state.masteryDepthByConcept[conceptId] || emptyMastery(conceptId);
    if (!mastery.learningCompletedStage) return "BASIC";
    return nextStage(mastery.learningCompletedStage);
  }

  function stageStatus(state, conceptId, stage) {
    return state.masteryDepthByConcept?.[conceptId]?.stageStatus?.[stage] || "NOT_STARTED";
  }

  function problemUsedInCurrentCycle(items, problem, usedIds, usedStructures, usedSolutions) {
    return usedIds.has(problem.problemId)
      || usedStructures.has(problem.structureSignature)
      || usedSolutions.has(problem.solutionPathSignature)
      || items.some((item) => item.problemId === problem.problemId);
  }

  function addProblemItem(items, problem, purpose, usedIds, usedStructures, usedSolutions, extra = {}) {
    if (!problem || problemUsedInCurrentCycle(items, problem, usedIds, usedStructures, usedSolutions)) return false;
    items.push({
      problemId: problem.problemId,
      conceptId: problem.conceptId,
      stage: problem.stage,
      purpose,
      contentRole: problem.contentRole,
      reasoningGoals: [...problem.reasoningGoals],
      structureSignature: problem.structureSignature,
      solutionPathSignature: problem.solutionPathSignature,
      ...extra,
    });
    usedIds.add(problem.problemId);
    usedStructures.add(problem.structureSignature);
    usedSolutions.add(problem.solutionPathSignature);
    return true;
  }

  function chooseProblem(state, conceptId, stage, usedIds, usedStructures, usedSolutions, options = {}) {
    const pool = model.getProblems(conceptId, stage);
    const avoidIds = new Set(options.avoidProblemIds || []);
    const avoidStructures = new Set(options.avoidStructureSignatures || []);
    const avoidSolutions = new Set(options.avoidSolutionPathSignatures || []);
    return pool.find((problem) => (
      !problemUsedInCurrentCycle([], problem, usedIds, usedStructures, usedSolutions)
      && !avoidIds.has(problem.problemId)
      && !avoidStructures.has(problem.structureSignature)
      && !avoidSolutions.has(problem.solutionPathSignature)
    )) || null;
  }

  function buildSpringCycle(stateInput, options = {}) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest");
    const items = [];
    const usedIds = new Set();
    const usedStructures = new Set();
    const usedSolutions = new Set();
    const targets = {};
    const recentIds = new Set(state.recentProblemIds.slice(-36));
    const recentStructures = new Set(state.recentStructureSignatures.slice(-24));
    const recentSolutions = new Set(state.recentSolutionPathSignatures.slice(-24));
    const directConceptId = CONCEPT_IDS.includes(options.conceptId) ? options.conceptId : null;
    const directStage = STAGES.includes(options.stage) ? options.stage : null;

    const selectedTargets = [];
    if (directConceptId && directStage) {
      selectedTargets.push({ conceptId: directConceptId, stage: directStage });
    } else {
      const unfinishedBasics = CONCEPT_IDS.filter((conceptId) => (
        !state.curriculumProgress.completedBasicConceptIds.includes(conceptId)
      ));
      const basicLimit = state.activeCycleNumber === 0 ? 3 : 2;
      unfinishedBasics.slice(0, basicLimit).forEach((conceptId) => {
        selectedTargets.push({ conceptId, stage: "BASIC" });
      });
      const targetLimit = selectedTargets.length === 1 ? 3 : 4;
      const depthCandidates = CONCEPT_IDS
        .filter((conceptId) => !selectedTargets.some((target) => target.conceptId === conceptId))
        .map((conceptId, order) => ({
          conceptId,
          order,
          mastery: state.masteryDepthByConcept[conceptId],
        }))
        .filter(({ mastery }) => (
          mastery.learningCompletedStage
          && stageIndex(mastery.learningCompletedStage) < STAGES.length - 1
        ))
        .sort((left, right) => (
          stageIndex(left.mastery.learningCompletedStage) - stageIndex(right.mastery.learningCompletedStage)
          || String(left.mastery.lastStudiedAt || "").localeCompare(String(right.mastery.lastStudiedAt || ""))
          || left.order - right.order
        ));
      depthCandidates.slice(0, Math.max(0, targetLimit - selectedTargets.length)).forEach(({ conceptId }) => {
        selectedTargets.push({ conceptId, stage: recommendedStageFor(state, conceptId) });
      });
    }

    const targetStageKeys = new Set(selectedTargets.map(({ conceptId, stage }) => `${conceptId}:${stage}`));
    state.pendingIndependentChecks.forEach((check) => {
      const checkStage = check.checkStage || nextStage(check.stage);
      if (targetStageKeys.has(`${check.conceptId}:${checkStage}`)) return;
      const learningProblemIds = check.learningProblemIds || [];
      const learningStructureSignatures = check.learningStructureSignatures || [];
      const learningSolutionPathSignatures = check.learningSolutionPathSignatures || [];
      let problem = chooseProblem(
        state,
        check.conceptId,
        checkStage,
        usedIds,
        usedStructures,
        usedSolutions,
        {
          avoidProblemIds: [...learningProblemIds, ...recentIds],
          avoidStructureSignatures: [...learningStructureSignatures, ...recentStructures],
          avoidSolutionPathSignatures: [...learningSolutionPathSignatures, ...recentSolutions],
        }
      );
      if (!problem) {
        problem = chooseProblem(
          state,
          check.conceptId,
          checkStage,
          usedIds,
          usedStructures,
          usedSolutions,
          {
            avoidProblemIds: learningProblemIds,
            avoidStructureSignatures: learningStructureSignatures,
            avoidSolutionPathSignatures: learningSolutionPathSignatures,
          }
        );
      }
      addProblemItem(items, problem, PURPOSES.INDEPENDENT_CHECK, usedIds, usedStructures, usedSolutions, {
        checkId: check.checkId,
        verifiesStage: check.stage,
      });
    });

    selectedTargets.forEach(({ conceptId, stage }) => {
      targets[conceptId] = stage;
      const pool = model.getProblems(conceptId, stage);
      const preferred = pool.filter((problem) => (
        !recentIds.has(problem.problemId)
        && !recentStructures.has(problem.structureSignature)
        && !recentSolutions.has(problem.solutionPathSignature)
      ));
      const source = preferred.length === pool.length ? preferred : pool;
      source.forEach((problem) => {
        addProblemItem(items, problem, PURPOSES.LEARNING, usedIds, usedStructures, usedSolutions, {
          targetStage: stage,
        });
      });
    });

    const orderedConcepts = [
      ...selectedTargets.map((target) => target.conceptId),
      ...CONCEPT_IDS.filter((conceptId) => !selectedTargets.some((target) => target.conceptId === conceptId)),
    ];
    orderedConcepts.forEach((conceptId) => {
      const completedStage = state.masteryDepthByConcept[conceptId].learningCompletedStage;
      if (!completedStage) return;
      const review = chooseProblem(state, conceptId, completedStage, usedIds, usedStructures, usedSolutions, {
        avoidProblemIds: recentIds,
        avoidStructureSignatures: recentStructures,
        avoidSolutionPathSignatures: recentSolutions,
      });
      addProblemItem(items, review, PURPOSES.REVIEW, usedIds, usedStructures, usedSolutions);
    });

    selectedTargets.forEach(({ conceptId, stage }) => {
      if (items.length >= 20) return;
      const previewStage = nextStage(stage);
      if (previewStage === stage) return;
      const preview = chooseProblem(state, conceptId, previewStage, usedIds, usedStructures, usedSolutions, {
        avoidProblemIds: recentIds,
        avoidStructureSignatures: recentStructures,
        avoidSolutionPathSignatures: recentSolutions,
      });
      addProblemItem(items, preview, PURPOSES.PREVIEW, usedIds, usedStructures, usedSolutions);
    });

    const fillFromApprovedPool = (avoidRecent) => {
      for (const stage of STAGES) {
        for (const conceptId of orderedConcepts) {
          if (items.length >= 20) return;
          const problem = chooseProblem(state, conceptId, stage, usedIds, usedStructures, usedSolutions, avoidRecent ? {
            avoidProblemIds: recentIds,
            avoidStructureSignatures: recentStructures,
            avoidSolutionPathSignatures: recentSolutions,
          } : {});
          if (!problem) continue;
          const completedIndex = stageIndex(state.masteryDepthByConcept[conceptId].learningCompletedStage);
          const purpose = stageIndex(stage) <= completedIndex ? PURPOSES.REVIEW : PURPOSES.PREVIEW;
          addProblemItem(items, problem, purpose, usedIds, usedStructures, usedSolutions);
        }
      }
    };
    fillFromApprovedPool(true);
    if (items.length < 20) fillFromApprovedPool(false);

    return {
      items: items.slice(0, 35),
      targets,
    };
  }

  function startCycle(stateInput, options = {}) {
    const now = options.now || Date.now;
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (state.cycleStatus === "ACTIVE" && state.cycleItems.length && options.resume !== false) return state;
    const built = buildSpringCycle(state, options);
    const idFactory = options.idFactory || (() => Math.random().toString(36).slice(2, 10));
    state.activeCycleNumber = (Number(state.activeCycleNumber) || 0) + 1;
    state.activeLearningCycleId = `m3q-cycle-${state.activeCycleNumber}-${idFactory()}`;
    state.cycleStatus = "ACTIVE";
    state.cycleItems = built.items;
    state.cycleProblemIds = built.items.map((item) => item.problemId);
    state.cycleTargets = built.targets;
    state.currentProblemIndex = 0;
    state.currentContentSlideIndex = 0;
    const first = built.items[0];
    state.currentConceptId = first?.conceptId || options.conceptId || CONCEPT_IDS[0];
    state.currentStage = first?.stage || options.stage || "BASIC";
    state.lastLearningPosition = {
      cycleId: state.activeLearningCycleId,
      problemIndex: 0,
      problemId: first?.problemId || null,
      conceptId: state.currentConceptId,
      stage: state.currentStage,
    };
    if (options.conceptId && options.stage) {
      state.viewedStages[options.conceptId] = unique([...state.viewedStages[options.conceptId], options.stage]);
    }
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function currentItem(state) {
    return state?.cycleItems?.[Number(state.currentProblemIndex) || 0] || null;
  }

  function currentProblem(state) {
    const item = currentItem(state);
    return item ? model.problemsById[item.problemId] || null : null;
  }

  function attemptKey(state, problemId) {
    return `${state?.activeLearningCycleId || "no-cycle"}:${problemId}`;
  }

  function getFinalizedAttempt(state, problemId) {
    const key = attemptKey(state, problemId);
    const current = state?.finalizedAttempts?.[key];
    if (current) return current;
    const legacy = state?.finalizedAttempts?.[problemId];
    return legacy?.cycleId === state?.activeLearningCycleId ? legacy : null;
  }

  function getDraftAnswer(state, problemId) {
    return state?.draftAnswers?.[attemptKey(state, problemId)];
  }

  function getHintCount(state, problemId) {
    return Number(state?.hintsUsed?.[attemptKey(state, problemId)]) || 0;
  }

  function getFeedback(state, problemId) {
    return state?.feedbackByProblemId?.[attemptKey(state, problemId)] || null;
  }

  function contentKey(conceptId, stage) {
    return `${conceptId}:${stage}`;
  }

  function shouldShowContent(state) {
    const item = currentItem(state);
    if (!item || item.purpose !== PURPOSES.LEARNING) return false;
    return !state.lessonContentViewed[contentKey(item.conceptId, item.stage)];
  }

  function markContentViewed(stateInput, conceptId, stage, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    state.lessonContentViewed[contentKey(conceptId, stage)] = timestamp(now);
    state.viewedStages[conceptId] = unique([...state.viewedStages[conceptId], stage]);
    const mastery = state.masteryDepthByConcept[conceptId];
    if (mastery.stageStatus[stage] === "NOT_STARTED") mastery.stageStatus[stage] = "IN_PROGRESS";
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function setDraftAnswer(stateInput, problemId, answer, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (getFinalizedAttempt(state, problemId)?.attemptStatus === "FINAL") return state;
    state.draftAnswers[attemptKey(state, problemId)] = clone(answer);
    state.updatedAt = timestamp(now);
    return state;
  }

  function hintFor(problem, content, level) {
    const hints = [
      `무엇을 구해야 하는지 질문의 마지막 문장을 다시 확인해 보세요: ${problem.questionText}`,
      `핵심 조건: ${content?.firstCondition || problem.learningFlow?.keyConditionHint || problem.solutionPath[0]}`,
      `사용할 개념: ${content?.conceptToUse || problem.conceptTitle}`,
      `첫 식 또는 첫 표현: ${problem.solutionPath[0]}`,
      `다음 연결: ${problem.solutionPath[1] || problem.solutionPath[0]}`,
    ];
    return hints[Math.max(0, Math.min(hints.length - 1, level - 1))];
  }

  function useHint(stateInput, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    const problem = currentProblem(state);
    if (!problem || getFinalizedAttempt(state, problem.problemId)) return { state, hint: null, level: 0 };
    const key = attemptKey(state, problem.problemId);
    const level = Math.min(5, getHintCount(state, problem.problemId) + 1);
    state.hintsUsed[key] = level;
    const mastery = state.masteryDepthByConcept[problem.conceptId];
    mastery.hintsUsed[problem.stage] = Math.max(Number(mastery.hintsUsed[problem.stage]) || 0, level);
    state.feedbackByProblemId[key] = {
      type: "HINT",
      title: `힌트 ${level}`,
      text: hintFor(problem, learningContent.get(problem.conceptId, problem.stage), level),
    };
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return {
      state,
      hint: state.feedbackByProblemId[key].text,
      level,
    };
  }

  function submissionId(problemId, now, idFactory) {
    return `m3q-submit-${problemId}-${typeof now === "function" ? now() : Date.now()}-${idFactory()}`;
  }

  function appendSubmission(state, problemId, record) {
    const key = attemptKey(state, problemId);
    state.submittedAnswers[key] = Array.isArray(state.submittedAnswers[key])
      ? state.submittedAnswers[key]
      : [];
    state.submittedAnswers[key].push(record);
  }

  function queueAlternatePractice(state, problem) {
    const item = currentItem(state);
    const currentIndex = Math.max(0, Number(state.currentProblemIndex) || 0);
    const existingAlternate = state.cycleItems.find((candidate, index) => (
      index > currentIndex
      && candidate.problemId !== problem.problemId
      && candidate.conceptId === problem.conceptId
      && candidate.stage === problem.stage
      && candidate.reasoningGoals.some((goal) => problem.reasoningGoals.includes(goal))
      && candidate.structureSignature !== problem.structureSignature
      && candidate.solutionPathSignature !== problem.solutionPathSignature
    ));
    if (existingAlternate) {
      existingAlternate.rePracticeForProblemIds = unique([
        ...(existingAlternate.rePracticeForProblemIds || []),
        item?.problemId || problem.problemId,
      ]);
      return existingAlternate.problemId;
    }
    const usedIds = new Set(state.cycleItems.map((entry) => entry.problemId));
    const usedStructures = new Set(state.cycleItems.map((entry) => entry.structureSignature));
    const usedSolutions = new Set(state.cycleItems.map((entry) => entry.solutionPathSignature));
    const alternative = model.getProblems(problem.conceptId, problem.stage).find((candidate) => (
      candidate.problemId !== problem.problemId
      && candidate.reasoningGoals.some((goal) => problem.reasoningGoals.includes(goal))
      && !usedIds.has(candidate.problemId)
      && !usedStructures.has(candidate.structureSignature)
      && !usedSolutions.has(candidate.solutionPathSignature)
    ));
    if (!alternative || state.cycleItems.length >= 35) return null;
    state.cycleItems.push({
      problemId: alternative.problemId,
      conceptId: alternative.conceptId,
      stage: alternative.stage,
      purpose: PURPOSES.RE_PRACTICE,
      contentRole: alternative.contentRole,
      reasoningGoals: [...alternative.reasoningGoals],
      structureSignature: alternative.structureSignature,
      solutionPathSignature: alternative.solutionPathSignature,
      sourceProblemId: item?.problemId || problem.problemId,
    });
    state.cycleProblemIds.push(alternative.problemId);
    return alternative.problemId;
  }

  function submitAnswer(stateInput, answer, options = {}) {
    const now = options.now || Date.now;
    const idFactory = options.idFactory || (() => Math.random().toString(36).slice(2, 9));
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    const problem = currentProblem(state);
    const item = currentItem(state);
    if (!problem || !item || state.cycleStatus !== "ACTIVE") {
      return { state, accepted: false, reason: "NO_ACTIVE_PROBLEM" };
    }
    const key = attemptKey(state, problem.problemId);
    const existing = getFinalizedAttempt(state, problem.problemId);
    if (existing?.attemptStatus === "FINAL") {
      return { state, accepted: false, reason: "FINAL_LOCKED", result: clone(existing.result) };
    }
    const result = schema.evaluateAnswer(problem, answer);
    const record = {
      submissionId: submissionId(problem.problemId, now, idFactory),
      cycleId: state.activeLearningCycleId,
      problemId: problem.problemId,
      conceptId: problem.conceptId,
      stage: problem.stage,
      answer: clone(answer),
      result: clone(result),
      submittedAt: timestamp(now),
    };
    appendSubmission(state, problem.problemId, record);
    state.draftAnswers[key] = clone(answer);
    const final = result.status === "CORRECT" || result.status === "REVIEW_REQUIRED";
    if (final) {
      const finalized = {
        ...record,
        attemptStatus: "FINAL",
        finalizedAt: timestamp(now),
        hintsUsed: getHintCount(state, problem.problemId),
        solutionViewed: state.solutionsViewed.includes(key),
      };
      state.finalizedAttempts[key] = finalized;
      state.feedbackByProblemId[key] = result.status === "CORRECT"
        ? { type: "CORRECT", title: "정답입니다", text: "조건과 풀이 연결이 맞았습니다." }
        : { type: "REVIEW_REQUIRED", title: "검토가 필요한 답안입니다", text: "학습은 계속 진행하고 답안은 검토 대기로 저장합니다." };
      if (item.purpose === PURPOSES.INDEPENDENT_CHECK) {
        const passed = result.status === "CORRECT"
          && finalized.hintsUsed === 0
          && finalized.solutionViewed === false;
        state.independentPracticeResults.push({
          checkId: item.checkId,
          problemId: problem.problemId,
          conceptId: problem.conceptId,
          checkedStage: item.verifiesStage || problem.stage,
          passed,
          resultStatus: result.status,
          completedAt: timestamp(now),
        });
      }
    } else {
      const priorWrongCount = state.submittedAnswers[key]
        .filter((submission) => submission.result?.status === "INCORRECT").length;
      state.feedbackByProblemId[key] = {
        type: "INCORRECT",
        title: "답이 달라요",
        text: priorWrongCount >= 2
          ? "다시 시도하거나 힌트를 사용하세요. 필요하면 마지막에 풀이를 확인할 수 있어요."
          : "정답은 아직 공개하지 않습니다. 조건을 다시 확인하고 답을 고쳐 보세요.",
      };
      queueAlternatePractice(state, problem);
    }
    state.currentConceptId = problem.conceptId;
    state.currentStage = problem.stage;
    state.masteryDepthByConcept[problem.conceptId].lastStudiedAt = timestamp(now);
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return {
      state,
      accepted: true,
      finalized: final,
      result,
      submissionId: record.submissionId,
    };
  }

  function revealSolution(stateInput, options = {}) {
    const now = options.now || Date.now;
    const idFactory = options.idFactory || (() => Math.random().toString(36).slice(2, 9));
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    const problem = currentProblem(state);
    if (!problem || getFinalizedAttempt(state, problem.problemId)) {
      return { state, revealed: false, reason: "FINAL_LOCKED_OR_MISSING" };
    }
    const key = attemptKey(state, problem.problemId);
    const wrongAttempts = (state.submittedAnswers[key] || [])
      .filter((submission) => submission.result?.status === "INCORRECT").length;
    if (wrongAttempts < 1 && getHintCount(state, problem.problemId) < 1) {
      return { state, revealed: false, reason: "TRY_OR_HINT_FIRST" };
    }
    state.solutionsViewed = unique([...state.solutionsViewed, key]);
    state.masteryDepthByConcept[problem.conceptId].solutionsViewed = unique([
      ...state.masteryDepthByConcept[problem.conceptId].solutionsViewed,
      problem.stage,
    ]);
    const record = {
      submissionId: submissionId(problem.problemId, now, idFactory),
      cycleId: state.activeLearningCycleId,
      problemId: problem.problemId,
      conceptId: problem.conceptId,
      stage: problem.stage,
      answer: null,
      result: { status: "SOLUTION_VIEWED", correct: false },
      submittedAt: timestamp(now),
      attemptStatus: "FINAL",
      finalizedAt: timestamp(now),
      hintsUsed: getHintCount(state, problem.problemId),
      solutionViewed: true,
    };
    appendSubmission(state, problem.problemId, record);
    state.finalizedAttempts[key] = record;
    state.feedbackByProblemId[key] = {
      type: "SOLUTION_VIEWED",
      title: `정답 · ${Array.isArray(problem.correctAnswer) ? problem.correctAnswer.join(" → ") : problem.correctAnswer}`,
      text: problem.solutionPath.join(" → "),
    };
    queueAlternatePractice(state, problem);
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return { state, revealed: true, problem: clone(problem) };
  }

  function completeLearningTargets(state, now) {
    Object.entries(state.cycleTargets || {}).forEach(([conceptId, targetStage]) => {
      const targetItems = state.cycleItems.filter((item) => (
        item.purpose === PURPOSES.LEARNING
        && item.conceptId === conceptId
        && item.stage === targetStage
      ));
      const requiredLearningItems = model.getProblems(conceptId, targetStage).length;
      if (!targetItems.length || targetItems.length < requiredLearningItems) return;
      const allFinal = targetItems.every((item) => (
        getFinalizedAttempt(state, item.problemId)?.attemptStatus === "FINAL"
      ));
      const contentViewed = Boolean(state.lessonContentViewed[contentKey(conceptId, targetStage)]);
      if (!allFinal || !contentViewed) return;
      const mastery = state.masteryDepthByConcept[conceptId];
      const previousCompletedIndex = stageIndex(mastery.learningCompletedStage);
      const targetIndex = stageIndex(targetStage);
      const maxAllowedIndex = Math.max(0, previousCompletedIndex + 1);
      if (targetIndex > maxAllowedIndex) return;
      mastery.learningCompletedStage = targetStage;
      mastery.recommendedStage = nextStage(targetStage);
      mastery.stageStatus[targetStage] = "INDEPENDENT_CHECK_PENDING";
      const lessonId = `${state.activeLearningCycleId}:${conceptId}:${targetStage}`;
      if (!state.completedLessons.some((lesson) => lesson.lessonId === lessonId)) {
        state.completedLessons.push({
          lessonId,
          cycleId: state.activeLearningCycleId,
          conceptId,
          stage: targetStage,
          problemIds: targetItems.map((item) => item.problemId),
          completedAt: timestamp(now),
          status: "LEARNING_COMPLETED",
        });
      }
      const checkId = `check:${conceptId}:${targetStage}:${state.activeLearningCycleId}`;
      if (!state.pendingIndependentChecks.some((check) => check.checkId === checkId)) {
        state.pendingIndependentChecks.push({
          checkId,
          conceptId,
          stage: targetStage,
          checkStage: nextStage(targetStage),
          status: "PENDING",
          learningProblemIds: targetItems.map((item) => item.problemId),
          learningStructureSignatures: targetItems.map((item) => item.structureSignature),
          learningSolutionPathSignatures: targetItems.map((item) => item.solutionPathSignature),
          scheduledAt: timestamp(now),
        });
      }
      if (targetStage === "BASIC") {
        state.curriculumProgress.completedBasicConceptIds = unique([
          ...state.curriculumProgress.completedBasicConceptIds,
          conceptId,
        ]);
      }
    });
    state.curriculumProgress.nextBasicConceptId = CONCEPT_IDS.find((conceptId) => (
      !state.curriculumProgress.completedBasicConceptIds.includes(conceptId)
    )) || null;
  }

  function applyIndependentResults(state) {
    state.independentPracticeResults.forEach((result) => {
      const check = state.pendingIndependentChecks.find((item) => item.checkId === result.checkId);
      if (!check || check.status !== "PENDING") return;
      check.status = result.passed ? "VERIFIED" : "RETRY_REQUIRED";
      check.completedAt = result.completedAt;
      const mastery = state.masteryDepthByConcept[check.conceptId];
      if (result.passed) {
        mastery.verifiedStage = check.stage;
        mastery.stageStatus[check.stage] = "VERIFIED";
      } else {
        mastery.stageStatus[check.stage] = "INDEPENDENT_CHECK_PENDING";
      }
    });
    state.pendingIndependentChecks = state.pendingIndependentChecks.filter((check) => check.status !== "VERIFIED");
  }

  function finishCycle(stateInput, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (!state.activeLearningCycleId) return state;
    completeLearningTargets(state, now);
    applyIndependentResults(state);
    const finalizedCount = state.cycleItems.filter((item) => (
      getFinalizedAttempt(state, item.problemId)?.attemptStatus === "FINAL"
    )).length;
    state.cycleHistory.push({
      cycleId: state.activeLearningCycleId,
      number: state.activeCycleNumber,
      problemIds: [...state.cycleProblemIds],
      finalizedCount,
      completedAt: timestamp(now),
      targets: clone(state.cycleTargets),
    });
    state.recentProblemIds = unique([
      ...state.recentProblemIds,
      ...state.cycleItems.map((item) => item.problemId),
    ]).slice(-120);
    state.recentStructureSignatures = unique([
      ...state.recentStructureSignatures,
      ...state.cycleItems.map((item) => item.structureSignature),
    ]).slice(-72);
    state.recentSolutionPathSignatures = unique([
      ...state.recentSolutionPathSignatures,
      ...state.cycleItems.map((item) => item.solutionPathSignature),
    ]).slice(-72);
    state.cycleStatus = "COMPLETED";
    state.returnCheckpoint = clone(state.lastLearningPosition);
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function advance(stateInput, now = Date.now) {
    let state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    const item = currentItem(state);
    if (!item) return state;
    const attempt = getFinalizedAttempt(state, item.problemId);
    if (!attempt || attempt.attemptStatus !== "FINAL") return state;
    if (state.currentProblemIndex >= state.cycleItems.length - 1) return finishCycle(state, now);
    state.currentProblemIndex += 1;
    state.currentContentSlideIndex = 0;
    const next = currentItem(state);
    state.currentConceptId = next.conceptId;
    state.currentStage = next.stage;
    state.lastLearningPosition = {
      cycleId: state.activeLearningCycleId,
      problemIndex: state.currentProblemIndex,
      problemId: next.problemId,
      conceptId: next.conceptId,
      stage: next.stage,
    };
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function previous(stateInput, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (state.currentProblemIndex <= 0) return state;
    state.currentProblemIndex -= 1;
    const item = currentItem(state);
    state.currentConceptId = item.conceptId;
    state.currentStage = item.stage;
    state.updatedAt = timestamp(now);
    return state;
  }

  function pauseCycle(stateInput, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (state.cycleStatus === "ACTIVE") state.cycleStatus = "PAUSED";
    state.returnCheckpoint = clone(state.lastLearningPosition);
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function resumeCycle(stateInput, now = Date.now) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest", now);
    if (state.cycleStatus === "PAUSED" && state.cycleItems.length) state.cycleStatus = "ACTIVE";
    state.revision += 1;
    state.updatedAt = timestamp(now);
    return state;
  }

  function serializeState(stateInput) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest");
    return clone({
      learningVersion: state.learningVersion,
      userId: state.userId,
      activeLearningCycleId: state.activeLearningCycleId,
      activeCycleNumber: state.activeCycleNumber,
      cycleStatus: state.cycleStatus,
      cycleProblemIds: state.cycleProblemIds,
      cycleItems: state.cycleItems,
      cycleTargets: state.cycleTargets,
      currentProblemIndex: state.currentProblemIndex,
      submittedAnswers: state.submittedAnswers,
      finalizedAttempts: state.finalizedAttempts,
      draftAnswers: state.draftAnswers,
      currentConceptId: state.currentConceptId,
      currentStage: state.currentStage,
      curriculumProgress: state.curriculumProgress,
      masteryDepthByConcept: state.masteryDepthByConcept,
      viewedStages: state.viewedStages,
      lessonContentViewed: state.lessonContentViewed,
      completedLessons: state.completedLessons,
      hintsUsed: state.hintsUsed,
      solutionsViewed: state.solutionsViewed,
      independentPracticeResults: state.independentPracticeResults,
      pendingIndependentChecks: state.pendingIndependentChecks,
      lastLearningPosition: state.lastLearningPosition,
      returnCheckpoint: state.returnCheckpoint,
      recentProblemIds: state.recentProblemIds,
      recentStructureSignatures: state.recentStructureSignatures,
      recentSolutionPathSignatures: state.recentSolutionPathSignatures,
      cycleHistory: state.cycleHistory,
      currentContentSlideIndex: state.currentContentSlideIndex,
      feedbackByProblemId: state.feedbackByProblemId,
      revision: state.revision,
      updatedAt: state.updatedAt,
    });
  }

  function getStageMap(stateInput) {
    const state = normalizeState(stateInput, stateInput?.userId || "guest");
    return learningContent.CONCEPTS.map((concept) => ({
      ...concept,
      stages: STAGES.map((stage) => ({
        stage,
        status: stageStatus(state, concept.conceptId, stage),
        viewed: state.viewedStages[concept.conceptId].includes(stage),
        completed: ["LEARNING_COMPLETED", "INDEPENDENT_CHECK_PENDING", "VERIFIED"]
          .includes(stageStatus(state, concept.conceptId, stage)),
      })),
    }));
  }

  function cycleExample(stateInput, options = {}) {
    const state = startCycle(stateInput, {
      ...options,
      resume: false,
      idFactory: () => options.id || "example",
    });
    return state.cycleItems.map((item) => ({
      conceptId: item.conceptId,
      stage: item.stage,
      purpose: item.purpose,
      problemId: item.problemId,
    }));
  }

  return Object.freeze({
    VERSION,
    CLOUD_STATE_KEY,
    STAGES,
    STAGE_STATUSES,
    CYCLE_STATUSES,
    PURPOSES,
    CONCEPT_IDS,
    createDefaultState,
    normalizeState,
    describeState,
    resolveHydrationState,
    contentSlides,
    recommendedStageFor,
    stageStatus,
    getStageMap,
    buildSpringCycle,
    startCycle,
    currentItem,
    currentProblem,
    attemptKey,
    getFinalizedAttempt,
    getDraftAnswer,
    getHintCount,
    getFeedback,
    shouldShowContent,
    markContentViewed,
    setDraftAnswer,
    useHint,
    submitAnswer,
    revealSolution,
    advance,
    previous,
    pauseCycle,
    resumeCycle,
    finishCycle,
    serializeState,
    cycleExample,
  });
});
