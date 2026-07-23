(function (root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) module.exports = engine;
  if (root) root.STUDY_LEVEL_TEST_ENGINE = engine;
})(typeof window !== "undefined" ? window : globalThis, function () {
  const VERSION = 1;
  const MODE_STANDARD = "STANDARD";
  const MODE_ELITE = "ELITE";
  const PHASE_BOOTSTRAP = "BOOTSTRAP";
  const PHASE_CYCLING = "CYCLING";
  const ATTEMPT_STATUS = Object.freeze({ IN_PROGRESS: "IN_PROGRESS", FINAL: "FINAL" });
  const STAGES = ["BASIC", "ADVANCED_1", "ADVANCED_2", "ADVANCED_3", "ADVANCED_4", "ADVANCED_5"];
  const STAGE_LABELS = ["기본", "심화 1", "심화 2", "심화 3", "심화 4", "심화 5"];
  const PURPOSES = {
    CURRENT_STAGE_CHECK: "CURRENT_STAGE_CHECK",
    PAST_CONCEPT_ADVANCE: "PAST_CONCEPT_ADVANCE",
    ERROR_RECHECK: "ERROR_RECHECK",
    RECOVERY_LEARNING: "RECOVERY_LEARNING",
    SPACED_REVIEW: "SPACED_REVIEW",
    INTEGRATED_THINKING: "INTEGRATED_THINKING",
    INDEPENDENT_LEARNING_CHECK: "INDEPENDENT_LEARNING_CHECK",
  };
  const DEFAULT_CYCLE_SIZE = 24;
  const MIN_CYCLE_SIZE = 20;
  const MAX_CYCLE_SIZE = 30;
  const DEFAULT_PURPOSE_COUNTS = {
    [PURPOSES.CURRENT_STAGE_CHECK]: 6,
    [PURPOSES.PAST_CONCEPT_ADVANCE]: 5,
    [PURPOSES.ERROR_RECHECK]: 4,
    [PURPOSES.RECOVERY_LEARNING]: 4,
    [PURPOSES.SPACED_REVIEW]: 2,
    [PURPOSES.INTEGRATED_THINKING]: 3,
  };
  const RECOVERY_PURPOSE_COUNTS = {
    [PURPOSES.RECOVERY_LEARNING]: 12,
    [PURPOSES.CURRENT_STAGE_CHECK]: 4,
    [PURPOSES.ERROR_RECHECK]: 3,
    [PURPOSES.SPACED_REVIEW]: 2,
    [PURPOSES.INTEGRATED_THINKING]: 3,
  };
  const SPACED_REVIEW_CYCLES = [3, 7, 14, 30];
  const RECENT_PROBLEM_ID_LIMIT = 300;
  const RECENT_FINGERPRINT_LIMIT = 300;
  const RECENT_STRUCTURE_LIMIT = 48;
  const RECENT_SOLUTION_PATH_LIMIT = 12;

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number(value) || 0));
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function nowIso(now) {
    return new Date(now || Date.now()).toISOString();
  }

  function stageLabel(stageIndex) {
    return STAGE_LABELS[clamp(stageIndex, 0, STAGE_LABELS.length - 1)];
  }

  function normalizeExactProblemText(problem) {
    return String(problem?.problem || problem?.questionText || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeProblemStructure(problem) {
    return String(problem?.problem || problem?.questionText || "")
      .toLowerCase()
      .replace(/[+-]?\d+(?:\.\d+)?/g, "#")
      .replace(/\s+/g, "")
      .replace(/[(){}\[\],.?]/g, "");
  }

  function problemFingerprint(problem) {
    const conceptId = String(problem?.conceptId || problem?.concept || "unknown");
    const problemType = String(problem?.problemType || problem?.questionType || "choice");
    return `${conceptId}|${problemType}|${normalizeExactProblemText(problem)}`;
  }

  function structureSignature(problem) {
    if (problem?.structureSignature) return String(problem.structureSignature);
    const conceptId = String(problem?.conceptId || problem?.concept || "unknown");
    const problemType = String(problem?.problemType || problem?.questionType || "choice");
    return `${conceptId}|${problemType}|${normalizeProblemStructure(problem)}`;
  }

  function solutionPathSignature(problem) {
    if (problem?.solutionPathSignature) return String(problem.solutionPathSignature);
    const conceptId = String(problem?.conceptId || problem?.concept || "unknown");
    const problemType = String(problem?.problemType || problem?.questionType || "choice");
    const stage = problemStageIndex(problem);
    return `${conceptId}|${problemType}|stage-${stage}|${normalizeProblemStructure(problem)}`;
  }

  function normalizedChoice(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function normalizedGradeNumber(problem) {
    const direct = Number(problem?.gradeNumber ?? problem?.grade);
    if (Number.isFinite(direct) && direct > 0) return direct;
    const text = String(problem?.grade || problem?.levelLabel || "").replace(/\s+/g, "");
    if (/중(?:등)?3학년|중3/.test(text)) return 9;
    if (/중(?:등)?2학년|중2/.test(text)) return 8;
    if (/중(?:등)?1학년|중1/.test(text)) return 7;
    const rank = Number(problem?.rank);
    return Number.isFinite(rank) ? rank : null;
  }

  function normalizedStageName(problem) {
    const direct = String(problem?.mathValidation?.expectedStage || problem?.stage || "").toUpperCase();
    const aliases = { A1: "ADVANCED_1", A2: "ADVANCED_2", A3: "ADVANCED_3", A4: "ADVANCED_4", A5: "ADVANCED_5" };
    if (STAGES.includes(direct)) return direct;
    if (aliases[direct]) return aliases[direct];
    return STAGES[problemStageIndex(problem)];
  }

  function formatCalculatedNumber(value) {
    if (!Number.isFinite(value)) return "";
    const rounded = Math.round(value * 1000000000) / 1000000000;
    return String(Object.is(rounded, -0) ? 0 : rounded);
  }

  function recalculateKnownAnswer(problem) {
    const prompt = String(problem?.problem || problem?.questionText || "").normalize("NFKC").trim();
    let match = prompt.match(/^√\s*([0-9]+(?:\.[0-9]+)?)\s*=\s*\?$/);
    if (match) {
      const result = Math.sqrt(Number(match[1]));
      return { handled: Number.isFinite(result), answer: formatCalculatedNumber(result), validatorId: "PRINCIPAL_SQUARE_ROOT" };
    }
    match = prompt.match(/^제곱해서\s*([0-9]+(?:\.[0-9]+)?)가\s*되는\s*양수는\?$/);
    if (match) {
      const result = Math.sqrt(Number(match[1]));
      return { handled: Number.isFinite(result), answer: formatCalculatedNumber(result), validatorId: "POSITIVE_SQUARE_ROOT" };
    }
    match = prompt.match(/^제곱근이\s*([0-9]+(?:\.[0-9]+)?)와\s*-\1인\s*수는\?$/);
    if (match) {
      const root = Number(match[1]);
      return { handled: Number.isFinite(root), answer: formatCalculatedNumber(root * root), validatorId: "REVERSE_SQUARE_ROOT" };
    }
    match = prompt.match(/^([0-9]+(?:\.[0-9]+)?)의\s*제곱근을\s*모두\s*고르면\?$/);
    if (match) {
      const root = Math.sqrt(Number(match[1]));
      const value = formatCalculatedNumber(root);
      return { handled: Number.isFinite(root), answer: `${value}과 -${value}`, validatorId: "SIGNED_SQUARE_ROOTS" };
    }
    match = prompt.match(/^(-?[0-9]+(?:\.[0-9]+)?)\s*([+\-×÷])\s*(-?[0-9]+(?:\.[0-9]+)?)\s*=\s*\?$/);
    if (match) {
      const left = Number(match[1]);
      const right = Number(match[3]);
      const operator = match[2];
      const value = operator === "+" ? left + right
        : operator === "-" ? left - right
          : operator === "×" ? left * right
            : right === 0 ? NaN : left / right;
      return { handled: Number.isFinite(value), answer: formatCalculatedNumber(value), validatorId: "BASIC_ARITHMETIC" };
    }
    return { handled: false, answer: "", validatorId: "" };
  }

  function validateProblem(problem, context = {}) {
    const errors = [];
    const id = problemId(problem);
    const conceptId = String(problem?.conceptId || "").trim();
    const prompt = String(problem?.problem || problem?.questionText || "").trim();
    const answer = normalizedChoice(problem?.answer ?? problem?.correctAnswer);
    const choices = Array.isArray(problem?.choices) ? problem.choices.map(normalizedChoice) : [];
    const uniqueChoices = new Set(choices);
    const mathValidation = problem?.mathValidation || null;
    const strictMathValidation = Boolean(context.strictMathValidation || mathValidation || problem?.code === "M3-STANDARD-APPROVED");
    const answerType = String(problem?.answerType || mathValidation?.expectedAnswerType || (choices.length ? "MULTIPLE_CHOICE" : "")).toUpperCase();
    if (!id) errors.push("MISSING_ID");
    if (!conceptId) errors.push("MISSING_CONCEPT_ID");
    if (!prompt) errors.push("MISSING_PROMPT");
    if (!answer) errors.push("MISSING_ANSWER");
    if (choices.length < 2 || choices.length > 6) errors.push("INVALID_CHOICE_COUNT");
    if (choices.some((choice) => !choice)) errors.push("EMPTY_CHOICE");
    if (uniqueChoices.size !== choices.length) errors.push("DUPLICATE_CHOICES");
    if (answer && choices.filter((choice) => choice === answer).length !== 1) errors.push("ANSWER_NOT_UNIQUE");
    if (problem?.reviewStatus === "REVIEW_REQUIRED") errors.push("REVIEW_REQUIRED");
    if (problem?.reviewStatus === "OUT_OF_SCOPE" || problem?.executionStatus === "OUT_OF_SCOPE") errors.push("OUT_OF_SCOPE");
    if (strictMathValidation && answerType !== "MULTIPLE_CHOICE") errors.push("INVALID_ANSWER_TYPE");

    const expectedGrade = Number(context.expectedGrade);
    const actualGrade = normalizedGradeNumber(problem);
    if (strictMathValidation && Number.isFinite(expectedGrade) && actualGrade !== expectedGrade) errors.push("GRADE_MISMATCH");
    if (context.allowedConceptIds && !new Set(context.allowedConceptIds).has(conceptId)) errors.push("CONCEPT_MISMATCH");
    if (context.expectedConceptId && conceptId !== String(context.expectedConceptId)) errors.push("CONCEPT_MISMATCH");
    if (Number.isFinite(context.expectedStageIndex) && problemStageIndex(problem) !== context.expectedStageIndex) errors.push("STAGE_MISMATCH");

    const calculated = recalculateKnownAnswer(problem);
    if (calculated.handled && normalizedChoice(calculated.answer) !== answer) errors.push("CALCULATED_ANSWER_MISMATCH");
    if (strictMathValidation && !calculated.handled && !mathValidation?.validatorId) errors.push("MISSING_MATH_VALIDATOR");
    if (mathValidation) {
      if (mathValidation.validatorId !== "STATIC_MANIFEST_V1" && !calculated.handled) errors.push("UNKNOWN_MATH_VALIDATOR");
      if (mathValidation.conditionsComplete !== true) errors.push("INSUFFICIENT_CONDITIONS");
      if (mathValidation.expectedAnswer != null && normalizedChoice(mathValidation.expectedAnswer) !== answer) errors.push("MANIFEST_ANSWER_MISMATCH");
      if (mathValidation.expectedPrompt != null
        && String(mathValidation.expectedPrompt).normalize("NFKC").trim() !== prompt.normalize("NFKC").trim()) errors.push("MANIFEST_PROMPT_MISMATCH");
      if (mathValidation.expectedConceptId && String(mathValidation.expectedConceptId) !== conceptId) errors.push("MANIFEST_CONCEPT_MISMATCH");
      if (mathValidation.expectedStage && normalizedStageName(problem) !== String(mathValidation.expectedStage).replace(/^A([1-5])$/, "ADVANCED_$1")) errors.push("MANIFEST_STAGE_MISMATCH");
      if (Number.isFinite(Number(mathValidation.expectedGrade)) && actualGrade !== Number(mathValidation.expectedGrade)) errors.push("MANIFEST_GRADE_MISMATCH");
      if (Array.isArray(mathValidation.expectedChoices)) {
        const expectedChoices = mathValidation.expectedChoices.map(normalizedChoice);
        if (JSON.stringify(expectedChoices) !== JSON.stringify(choices)) errors.push("MANIFEST_CHOICES_MISMATCH");
      }
    }
    return {
      isValid: errors.length === 0,
      errors,
      validationStatus: errors.length === 0 ? "VALID" : "REJECTED",
      generationFingerprint: problemFingerprint(problem),
      structureSignature: structureSignature(problem),
      solutionPathSignature: solutionPathSignature(problem),
      calculatedAnswer: calculated.handled ? calculated.answer : undefined,
      mathValidatorId: calculated.validatorId || mathValidation?.validatorId || undefined,
    };
  }

  function problemId(problem) {
    return String(problem?.id || problem?.questionId || "");
  }

  function problemStageIndex(problem) {
    return clamp(Number(problem?.adaptiveLevel || problem?.difficulty || 1) - 1, 0, STAGES.length - 1);
  }

  function isProblemExecutableForMode(state, problem) {
    if (problem?.reviewStatus && problem.reviewStatus !== "AUTO_APPROVED") return false;
    if (problem?.mode === MODE_ELITE && state?.mode !== MODE_ELITE) return false;
    if (!problem?.executionStatus) return true;
    if (problem.executionStatus === "EXECUTABLE") return true;
    return state?.mode === MODE_ELITE && problem.executionStatus === "ELITE_ONLY";
  }

  function recordProblemValidationFailure(state, problem, validation, purpose) {
    if (!state || validation?.isValid) return;
    state.problemValidationFailures = state.problemValidationFailures || [];
    const entry = {
      problemId: problemId(problem),
      conceptId: String(problem?.conceptId || ""),
      purpose,
      errors: [...new Set(validation.errors || [])],
      rejectedAt: nowIso(),
    };
    const duplicate = state.problemValidationFailures.some((item) => (
      item.problemId === entry.problemId && JSON.stringify(item.errors) === JSON.stringify(entry.errors)
    ));
    if (!duplicate) state.problemValidationFailures.push(entry);
    if (state.problemValidationFailures.length > 200) state.problemValidationFailures.splice(0, state.problemValidationFailures.length - 200);
  }

  function stageEvidenceSupply(state, pool, conceptId, stageIndex) {
    const structures = new Set();
    const solutionPaths = new Set();
    pool.forEach((problem) => {
      const problemConceptId = String(problem?.conceptId || problem?.concept || "unknown");
      if (problemConceptId !== conceptId || problemStageIndex(problem) !== stageIndex) return;
      if (!isProblemExecutableForMode(state, problem)) return;
      const validation = validateProblem(problem);
      if (!validation.isValid) return;
      structures.add(validation.structureSignature);
      solutionPaths.add(validation.solutionPathSignature);
    });
    return {
      distinctStructures: structures.size,
      distinctSolutionPaths: solutionPaths.size,
      sufficientForStageProof: structures.size >= 3 && solutionPaths.size >= 3,
    };
  }

  function defaultConceptState(definition) {
    return {
      conceptId: definition.conceptId,
      title: definition.title || definition.conceptId,
      unitId: definition.unitId || "",
      unitTitle: definition.unitTitle || "",
      routeConceptId: definition.routeConceptId || definition.conceptId,
      order: Number(definition.order) || 0,
      diagnosisPriority: Number.isFinite(Number(definition.diagnosisPriority))
        ? Number(definition.diagnosisPriority)
        : 9999,
      stageIndex: clamp(definition.stageIndex || 0, 0, STAGES.length - 1),
      status: "UNSEEN",
      prerequisiteConceptIds: [...new Set(definition.prerequisiteConceptIds || [])],
      attempts: 0,
      correct: 0,
      wrong: 0,
      giveUp: 0,
      distinctFingerprints: [],
      lastSeenCycle: 0,
      lastPromotedCycle: 0,
      stageCandidate: false,
      reviewMilestoneIndex: 0,
      nextReviewCycle: 0,
      lastReviewCycle: 0,
    };
  }

  function createStudentState(options = {}) {
    const concepts = {};
    (options.concepts || []).forEach((definition) => {
      if (!definition?.conceptId || concepts[definition.conceptId]) return;
      concepts[definition.conceptId] = defaultConceptState(definition);
    });
    return {
      version: VERSION,
      userId: String(options.userId || "guest"),
      mode: options.mode === MODE_ELITE ? MODE_ELITE : MODE_STANDARD,
      selectedGrade: options.selectedGrade || "중등 3학년",
      targetConceptIds: [...new Set(options.targetConceptIds || [])],
      phase: PHASE_BOOTSTRAP,
      bootstrap: {
        completed: false,
        completedAt: "",
        answeredProblemIds: [],
        results: [],
      },
      session: {
        id: makeId("session"),
        active: true,
        startedAt: nowIso(),
        lastStoppedAt: "",
        elapsedSeconds: 0,
      },
      cycleNumber: 0,
      activeCycle: null,
      lastCycleSummary: null,
      cycleHistory: [],
      conceptMastery: concepts,
      pendingRechecks: [],
      recoveryStack: [],
      returnCheckpoint: null,
      conceptDiagnosisMap: {},
      unitConceptCoverage: {},
      learningCompletionEvidence: [],
      pendingIndependentChecks: [],
      attemptsByKey: {},
      problemValidationFailures: [],
      recentProblemIds: [],
      recentFingerprints: [],
      recentStructureSignatures: [],
      recentSolutionPathSignatures: [],
      totals: { solved: 0, correct: 0, wrong: 0, giveUp: 0 },
      updatedAt: nowIso(),
    };
  }

  function ensureConcept(state, definition) {
    const conceptId = String(definition?.conceptId || "unknown");
    if (!state.conceptMastery[conceptId]) {
      state.conceptMastery[conceptId] = defaultConceptState({
        conceptId,
        title: definition?.title || definition?.concept || conceptId,
        prerequisiteConceptIds: definition?.prerequisiteConceptIds || definition?.prerequisiteConcepts || [],
      });
    } else if (definition?.prerequisiteConceptIds?.length || definition?.prerequisiteConcepts?.length) {
      state.conceptMastery[conceptId].prerequisiteConceptIds = [...new Set([
        ...(state.conceptMastery[conceptId].prerequisiteConceptIds || []),
        ...(definition.prerequisiteConceptIds || definition.prerequisiteConcepts || []),
      ])];
    }
    const concept = state.conceptMastery[conceptId];
    if (definition?.unitId) concept.unitId = definition.unitId;
    if (definition?.unitTitle) concept.unitTitle = definition.unitTitle;
    if (definition?.routeConceptId) concept.routeConceptId = definition.routeConceptId;
    if (Number.isFinite(Number(definition?.order))) concept.order = Number(definition.order);
    if (!Number.isFinite(concept.reviewMilestoneIndex)) concept.reviewMilestoneIndex = 0;
    if (!Number.isFinite(concept.nextReviewCycle)) concept.nextReviewCycle = 0;
    if (!Number.isFinite(concept.lastReviewCycle)) concept.lastReviewCycle = 0;
    return concept;
  }

  function recalculateUnitConceptCoverage(state) {
    state.conceptDiagnosisMap = state.conceptDiagnosisMap || {};
    state.unitConceptCoverage = state.unitConceptCoverage || {};
    const unitIds = new Set(Object.values(state.conceptDiagnosisMap).map((item) => item.unitId).filter(Boolean));
    unitIds.forEach((unitId) => {
      const items = Object.values(state.conceptDiagnosisMap).filter((item) => item.unitId === unitId);
      state.unitConceptCoverage[unitId] = {
        totalConcepts: items.length,
        checkedConcepts: items.filter((item) => (item.distinctProblemFamiliesChecked || []).length > 0).length,
        confirmedConcepts: items.filter((item) => item.status === "BASIC_CONFIRMED").length,
      };
    });
    return state.unitConceptCoverage;
  }

  function configureConceptDiagnostics(state, definitions = [], options = {}) {
    state.conceptDiagnosisMap = state.conceptDiagnosisMap || {};
    state.unitConceptCoverage = state.unitConceptCoverage || {};
    const enabledConceptIds = [];
    definitions.filter((definition) => definition?.enabled !== false).forEach((definition) => {
      if (!definition?.conceptId) return;
      const concept = ensureConcept(state, definition);
      concept.unitId = definition.unitId || concept.unitId || "";
      concept.unitTitle = definition.unitTitle || concept.unitTitle || "";
      concept.routeConceptId = definition.routeConceptId || concept.routeConceptId || concept.conceptId;
      concept.order = Number(definition.order) || concept.order || 0;
      enabledConceptIds.push(concept.conceptId);
      const existing = state.conceptDiagnosisMap[concept.conceptId] || {};
      state.conceptDiagnosisMap[concept.conceptId] = {
        conceptId: concept.conceptId,
        unitId: concept.unitId,
        status: existing.status || "UNSEEN",
        basicCorrectCount: Math.max(0, Number(existing.basicCorrectCount) || 0),
        basicWrongCount: Math.max(0, Number(existing.basicWrongCount) || 0),
        basicGiveUpCount: Math.max(0, Number(existing.basicGiveUpCount) || 0),
        distinctProblemFamiliesChecked: [...new Set(existing.distinctProblemFamiliesChecked || [])],
        priority: Number.isFinite(Number(existing.priority)) ? Number(existing.priority) : concept.order,
        lastCheckedCycle: existing.lastCheckedCycle,
        updatedAt: existing.updatedAt || nowIso(),
      };
    });
    if (options.replaceTargets) state.targetConceptIds = [...new Set(enabledConceptIds)];
    recalculateUnitConceptCoverage(state);
    state.updatedAt = nowIso();
    return state;
  }

  function prioritizeConceptDiagnosticsFromBootstrap(state, bootstrapResults = []) {
    state.conceptDiagnosisMap = state.conceptDiagnosisMap || {};
    const resultsByConcept = new Map();
    bootstrapResults.forEach((result) => {
      const conceptId = String(result.conceptId || "");
      if (!resultsByConcept.has(conceptId)) resultsByConcept.set(conceptId, []);
      resultsByConcept.get(conceptId).push(normalizeOutcome(result.outcome));
    });
    Object.values(state.conceptDiagnosisMap).forEach((diagnosis) => {
      const concept = state.conceptMastery?.[diagnosis.conceptId];
      const outcomes = resultsByConcept.get(concept?.routeConceptId) || [];
      const hasGiveUp = outcomes.includes("giveup");
      const hasWrong = outcomes.includes("wrong");
      const allCorrect = outcomes.length > 0 && outcomes.every((outcome) => outcome === "correct");
      const priorityBand = hasGiveUp ? 0 : hasWrong ? 100 : allCorrect ? 1000 : 500;
      diagnosis.status = diagnosis.status === "UNSEEN" ? "PENDING" : diagnosis.status;
      diagnosis.priority = priorityBand + (Number(concept?.order) || 0);
      diagnosis.updatedAt = nowIso();
      if (concept) concept.diagnosisPriority = diagnosis.priority;
    });
    recalculateUnitConceptCoverage(state);
    state.updatedAt = nowIso();
    return state;
  }

  function ensureLearningCompletionState(state) {
    state.learningCompletionEvidence = Array.isArray(state.learningCompletionEvidence)
      ? state.learningCompletionEvidence
      : [];
    state.pendingIndependentChecks = Array.isArray(state.pendingIndependentChecks)
      ? [...new Set(state.pendingIndependentChecks)]
      : [];
    return state;
  }

  function normalizeLearningStage(stage) {
    if (STAGES.includes(stage)) return stage;
    return STAGES[clamp(stage, 0, STAGES.length - 1)];
  }

  function recordLearningCompletion(state, completion = {}) {
    ensureLearningCompletionState(state);
    const conceptId = String(completion.conceptId || "").trim();
    if (!conceptId || !state.conceptMastery?.[conceptId]) return { created: false, evidence: null };
    const learnedStage = normalizeLearningStage(completion.learnedStage);
    const lessonId = String(completion.lessonId || "").trim();
    const existing = state.learningCompletionEvidence.find((evidence) => (
      evidence.conceptId === conceptId
      && evidence.learnedStage === learnedStage
      && String(evidence.lessonId || "") === lessonId
    ));
    if (existing) return { created: false, evidence: existing };

    state.recentProblemIds = state.recentProblemIds || [];
    state.recentFingerprints = state.recentFingerprints || [];
    state.recentStructureSignatures = state.recentStructureSignatures || [];
    state.recentSolutionPathSignatures = state.recentSolutionPathSignatures || [];
    const sourceProblemFingerprints = [];
    (completion.sourceProblems || []).forEach((problem) => {
      const adapted = { ...problem, conceptId };
      const id = problemId(adapted);
      const fingerprint = adapted.generationFingerprint || problemFingerprint(adapted);
      const problemStructure = adapted.structureSignature || structureSignature(adapted);
      const solutionPath = adapted.solutionPathSignature || solutionPathSignature(adapted);
      if (id && !state.recentProblemIds.includes(id)) state.recentProblemIds.push(id);
      if (fingerprint && !state.recentFingerprints.includes(fingerprint)) state.recentFingerprints.push(fingerprint);
      if (fingerprint && !sourceProblemFingerprints.includes(fingerprint)) sourceProblemFingerprints.push(fingerprint);
      if (problemStructure && !state.recentStructureSignatures.includes(problemStructure)) {
        state.recentStructureSignatures.push(problemStructure);
      }
      if (solutionPath && !state.recentSolutionPathSignatures.includes(solutionPath)) {
        state.recentSolutionPathSignatures.push(solutionPath);
      }
    });
    trimRecent(state.recentProblemIds, RECENT_PROBLEM_ID_LIMIT);
    trimRecent(state.recentFingerprints, RECENT_FINGERPRINT_LIMIT);
    trimRecent(state.recentStructureSignatures, RECENT_STRUCTURE_LIMIT);
    trimRecent(state.recentSolutionPathSignatures, RECENT_SOLUTION_PATH_LIMIT);

    const now = nowIso(completion.completedAt);
    const evidence = {
      evidenceId: makeId("learning-evidence"),
      conceptId,
      learnedStage,
      lessonId: lessonId || undefined,
      recommendationId: completion.recommendationId || undefined,
      completedAt: now,
      practiceCorrectRate: Number.isFinite(Number(completion.practiceCorrectRate))
        ? Math.max(0, Math.min(100, Number(completion.practiceCorrectRate)))
        : undefined,
      giveUpCount: Math.max(0, Number(completion.giveUpCount) || 0),
      explanationViewed: Boolean(completion.explanationViewed),
      workedExampleViewed: Boolean(completion.workedExampleViewed),
      independentCheckRequired: true,
      independentCheckStatus: "PENDING",
      scheduledCycleId: undefined,
      sourceProblemFingerprints,
      createdAt: now,
      updatedAt: now,
    };
    state.learningCompletionEvidence.push(evidence);
    state.pendingIndependentChecks.push(evidence.evidenceId);
    state.updatedAt = nowIso();
    return { created: true, evidence };
  }

  function scheduleSpacedReview(concept, currentCycle, { reset = false } = {}) {
    if (reset) concept.reviewMilestoneIndex = 0;
    const index = clamp(concept.reviewMilestoneIndex || 0, 0, SPACED_REVIEW_CYCLES.length - 1);
    concept.nextReviewCycle = Math.max(0, Number(currentCycle) || 0) + SPACED_REVIEW_CYCLES[index];
    return concept.nextReviewCycle;
  }

  function normalizeOutcome(outcome) {
    if (outcome === "correct") return "correct";
    if (outcome === "giveup" || outcome === "포기" || outcome === "모름") return "giveup";
    return "wrong";
  }

  function attemptKey(cycleId, id) {
    return `${String(cycleId || "")}:${String(id || "")}`;
  }

  function getAttempt(state, problem, cycleId) {
    const id = problemId(problem);
    const activeCycleId = String(cycleId || problem?.cycleId || state?.activeCycle?.id || "");
    if (!id || !activeCycleId) return null;
    state.attemptsByKey = state.attemptsByKey || {};
    return state.attemptsByKey[attemptKey(activeCycleId, id)] || null;
  }

  function startAttempt(state, problem, details = {}) {
    const id = problemId(problem);
    const cycleId = String(details.cycleId || problem?.cycleId || state?.activeCycle?.id || "");
    if (!id || !cycleId) return { created: false, reason: "MISSING_ATTEMPT_IDENTITY", attempt: null };
    state.attemptsByKey = state.attemptsByKey || {};
    const key = attemptKey(cycleId, id);
    const existing = state.attemptsByKey[key];
    if (existing) return { created: false, reason: "ATTEMPT_ALREADY_EXISTS", attempt: existing };
    const startedAt = nowIso(details.startedAt);
    const attempt = {
      problemId: id,
      activeCycleId: cycleId,
      attemptStatus: ATTEMPT_STATUS.IN_PROGRESS,
      startedAt,
      finalizedAt: "",
      submissionId: "",
    };
    state.attemptsByKey[key] = attempt;
    state.updatedAt = startedAt;
    return { created: true, reason: "STARTED", attempt };
  }

  function finalizeAttempt(state, problem, details = {}) {
    const id = problemId(problem);
    const cycleId = String(details.cycleId || problem?.cycleId || state?.activeCycle?.id || "");
    if (!id || !cycleId) return { created: false, reason: "MISSING_ATTEMPT_IDENTITY", attempt: null };
    state.attemptsByKey = state.attemptsByKey || {};
    const key = attemptKey(cycleId, id);
    const existing = state.attemptsByKey[key];
    if (existing?.attemptStatus === ATTEMPT_STATUS.FINAL) {
      return { created: false, reason: "ATTEMPT_ALREADY_FINAL", attempt: existing };
    }
    const finalizedAt = nowIso(details.finalizedAt);
    const attempt = {
      ...(existing || {}),
      problemId: id,
      activeCycleId: cycleId,
      attemptStatus: ATTEMPT_STATUS.FINAL,
      finalizedAt,
      submissionId: String(details.submissionId || makeId("submission")),
      selectedAnswer: details.selectedAnswer == null ? undefined : String(details.selectedAnswer),
      outcome: normalizeOutcome(details.outcome),
      solveSeconds: Math.max(0, Number(details.solveSeconds) || 0),
    };
    state.attemptsByKey[key] = attempt;
    state.updatedAt = finalizedAt;
    return { created: true, reason: "FINALIZED", attempt };
  }

  function createRewardEventId({ userId, conceptId, fromStage, toStage, cycleId } = {}) {
    const parts = [userId, conceptId, fromStage, toStage, cycleId].map((value) => String(value || "").trim());
    if (parts.some((value) => !value)) return "";
    return `LEVEL_UP:${parts.join(":")}`;
  }

  function enqueueRecheck(state, conceptId, count = 3) {
    const existing = state.pendingRechecks.find((item) => item.conceptId === conceptId);
    if (existing) {
      existing.remaining = Math.max(existing.remaining, count);
      return existing;
    }
    const item = {
      conceptId,
      remaining: count,
      attemptedFingerprints: [],
      attemptedEvidenceSignatures: [],
      outcomes: [],
      createdCycle: state.cycleNumber,
    };
    state.pendingRechecks.push(item);
    return item;
  }

  function enqueueRecovery(state, concept, sourceConceptId, checkpoint = null) {
    const existing = state.recoveryStack.find((item) => item.originalConceptId === (sourceConceptId || concept.conceptId));
    if (existing) return existing;
    const prerequisites = concept.prerequisiteConceptIds || [];
    const recoveryConceptId = prerequisites.find((id) => !state.recoveryStack.some((item) => item.recoveryConceptId === id));
    if (!recoveryConceptId) return null;
    const item = {
      recoveryConceptId,
      originalConceptId: sourceConceptId || concept.conceptId,
      originalStageIndex: checkpoint?.originalStageIndex ?? concept.stageIndex,
      recoveryStageIndex: 0,
      returnCheckpoint: checkpoint?.returnStageIndex ?? Math.max(0, concept.stageIndex - 1),
      evidence: [],
      attemptCount: 0,
      createdCycle: state.cycleNumber,
    };
    state.recoveryStack.push(item);
    state.returnCheckpoint = {
      originalConceptId: item.originalConceptId,
      originalStageIndex: item.originalStageIndex,
      returnStageIndex: item.returnCheckpoint,
    };
    return item;
  }

  function seedRecentHistoryFromBootstrap(state) {
    if (!state?.bootstrap?.completed || state.bootstrap.recentHistorySeeded) return state;
    state.recentProblemIds = state.recentProblemIds || [];
    state.recentFingerprints = state.recentFingerprints || [];
    state.recentStructureSignatures = state.recentStructureSignatures || [];
    state.recentSolutionPathSignatures = state.recentSolutionPathSignatures || [];
    (state.bootstrap.results || []).forEach((result) => {
      const problemIdValue = String(result.problemId || "");
      const fingerprint = String(result.generationFingerprint || result.fingerprint || "");
      const problemStructure = String(result.structureSignature || result.fingerprint || "");
      const solutionPath = String(result.solutionPathSignature || "");
      if (problemIdValue && !state.recentProblemIds.includes(problemIdValue)) state.recentProblemIds.push(problemIdValue);
      if (fingerprint && !state.recentFingerprints.includes(fingerprint)) state.recentFingerprints.push(fingerprint);
      if (problemStructure && !state.recentStructureSignatures.includes(problemStructure)) {
        state.recentStructureSignatures.push(problemStructure);
      }
      if (solutionPath && !state.recentSolutionPathSignatures.includes(solutionPath)) {
        state.recentSolutionPathSignatures.push(solutionPath);
      }
    });
    trimRecent(state.recentProblemIds, RECENT_PROBLEM_ID_LIMIT);
    trimRecent(state.recentFingerprints, RECENT_FINGERPRINT_LIMIT);
    trimRecent(state.recentStructureSignatures, RECENT_STRUCTURE_LIMIT);
    trimRecent(state.recentSolutionPathSignatures, RECENT_SOLUTION_PATH_LIMIT);
    state.bootstrap.recentHistorySeeded = true;
    return state;
  }

  function applyBootstrapResults(state, results = []) {
    const grouped = new Map();
    results.forEach((result) => {
      const conceptId = String(result.conceptId || result.concept || "unknown");
      if (!grouped.has(conceptId)) grouped.set(conceptId, []);
      grouped.get(conceptId).push({ ...result, outcome: normalizeOutcome(result.outcome) });
      if (result.problemId) state.bootstrap.answeredProblemIds.push(String(result.problemId));
    });

    grouped.forEach((entries, conceptId) => {
      const concept = ensureConcept(state, {
        conceptId,
        title: entries[0]?.concept || conceptId,
        prerequisiteConceptIds: entries[0]?.prerequisiteConceptIds || [],
      });
      const correct = entries.filter((entry) => entry.outcome === "correct").length;
      const giveUp = entries.filter((entry) => entry.outcome === "giveup").length;
      concept.attempts += entries.length;
      concept.correct += correct;
      concept.wrong += entries.filter((entry) => entry.outcome === "wrong").length;
      concept.giveUp += giveUp;
      entries.forEach((entry) => {
        if (entry.fingerprint && !concept.distinctFingerprints.includes(entry.fingerprint)) {
          concept.distinctFingerprints.push(entry.fingerprint);
        }
      });

      if (giveUp > 0) {
        concept.status = "RECOVERY_REQUIRED";
        enqueueRecovery(state, concept, conceptId);
      } else if (correct === entries.length && entries.length >= 2) {
        concept.status = "STAGE_CANDIDATE";
        concept.stageCandidate = true;
        scheduleSpacedReview(concept, state.cycleNumber, { reset: true });
      } else if (correct === 1) {
        concept.status = "UNSTABLE";
        enqueueRecheck(state, conceptId, 3);
      } else {
        concept.status = "DIAGNOSIS_REQUIRED";
        enqueueRecheck(state, conceptId, 3);
      }
    });

    state.bootstrap.results = results.map((result) => ({ ...result }));
    state.bootstrap.completed = true;
    state.bootstrap.completedAt = nowIso();
    state.phase = PHASE_CYCLING;
    state.bootstrap.recentHistorySeeded = false;
    seedRecentHistoryFromBootstrap(state);
    state.updatedAt = nowIso();
    return state;
  }

  function interleavePurposeCounts(counts) {
    const remaining = { ...counts };
    const order = Object.keys(remaining);
    const slots = [];
    while (slots.length < Object.values(counts).reduce((sum, count) => sum + count, 0)) {
      let added = false;
      order.forEach((purpose) => {
        if (remaining[purpose] > 0) {
          slots.push(purpose);
          remaining[purpose] -= 1;
          added = true;
        }
      });
      if (!added) break;
    }
    return slots;
  }

  function independentEvidencePriority(state, evidence) {
    const recommendation = (state.studyMapRecommendations || []).find((item) => item.id === evidence.recommendationId);
    const typeOrder = {
      RECOVERY_FOUNDATION: 1,
      RETURN_PREPARATION: 2,
      ERROR_REPAIR: 3,
      CURRENT_PROGRESS: 4,
      ADVANCED_CONTINUE: 5,
      SPACED_REVIEW: 6,
    };
    return typeOrder[recommendation?.type] || 7;
  }

  function scheduleIndependentChecks(state, cycle) {
    ensureLearningCompletionState(state);
    const pendingIds = new Set(state.pendingIndependentChecks);
    const pending = state.learningCompletionEvidence
      .filter((evidence) => pendingIds.has(evidence.evidenceId))
      .filter((evidence) => ["PENDING", "FAILED"].includes(evidence.independentCheckStatus))
      .sort((left, right) => (
        independentEvidencePriority(state, left) - independentEvidencePriority(state, right)
        || new Date(left.completedAt || 0) - new Date(right.completedAt || 0)
      ));
    const replaceableIndexes = cycle.slots
      .map((purpose, index) => ({ purpose, index }))
      .filter(({ purpose }) => [
        PURPOSES.CURRENT_STAGE_CHECK,
        PURPOSES.PAST_CONCEPT_ADVANCE,
        PURPOSES.SPACED_REVIEW,
        PURPOSES.INTEGRATED_THINKING,
      ].includes(purpose))
      .map(({ index }) => index);
    cycle.independentCheckEvidenceIds = [];
    pending.slice(0, replaceableIndexes.length).forEach((evidence, index) => {
      cycle.slots[replaceableIndexes[index]] = PURPOSES.INDEPENDENT_LEARNING_CHECK;
      cycle.independentCheckEvidenceIds.push(evidence.evidenceId);
      evidence.independentCheckStatus = "SCHEDULED";
      evidence.scheduledCycleId = cycle.id;
      evidence.updatedAt = nowIso();
    });
    return cycle.independentCheckEvidenceIds;
  }

  function scheduledIndependentEvidence(state) {
    ensureLearningCompletionState(state);
    const scheduledIds = state.activeCycle?.independentCheckEvidenceIds || [];
    return scheduledIds
      .map((evidenceId) => state.learningCompletionEvidence.find((item) => item.evidenceId === evidenceId))
      .find((evidence) => evidence?.independentCheckStatus === "SCHEDULED" && evidence.scheduledCycleId === state.activeCycle?.id)
      || null;
  }

  function diagnosisCandidateRank(state, concept) {
    const status = state.conceptDiagnosisMap?.[concept.conceptId]?.status;
    const ranks = {
      BASIC_PASS_CANDIDATE: 0,
      IN_PROGRESS: 1,
      PENDING: 2,
      UNSEEN: 3,
      UNSTABLE: 4,
      RECOVERY_REQUIRED: 5,
      BASIC_CONFIRMED: 9,
    };
    return ranks[status] ?? 6;
  }

  function createCyclePlan(state, options = {}) {
    const requestedSize = clamp(options.targetSize || DEFAULT_CYCLE_SIZE, MIN_CYCLE_SIZE, MAX_CYCLE_SIZE);
    const recoveryActive = state.recoveryStack.length > 0;
    const baseCounts = recoveryActive ? RECOVERY_PURPOSE_COUNTS : DEFAULT_PURPOSE_COUNTS;
    const slots = interleavePurposeCounts(baseCounts).slice(0, requestedSize);
    while (slots.length < requestedSize) slots.push(PURPOSES.CURRENT_STAGE_CHECK);
    state.cycleNumber += 1;
    state.activeCycle = {
      id: makeId(`cycle-${state.cycleNumber}`),
      number: state.cycleNumber,
      targetSize: requestedSize,
      slots,
      answers: [],
      startedAt: nowIso(),
      promotedConceptIds: [],
      recoveryActiveAtStart: recoveryActive,
    };
    scheduleIndependentChecks(state, state.activeCycle);
    state.updatedAt = nowIso();
    return state.activeCycle;
  }

  function conceptCandidates(state, purpose) {
    const concepts = Object.values(state.conceptMastery);
    const targetConceptIds = new Set(state.targetConceptIds || []);
    const targetConcepts = targetConceptIds.size
      ? concepts.filter((concept) => targetConceptIds.has(concept.conceptId))
      : concepts;
    const pending = state.pendingRechecks.filter((item) => item.remaining > 0).map((item) => item.conceptId);
    const recovery = state.recoveryStack[state.recoveryStack.length - 1];
    if (purpose === PURPOSES.INDEPENDENT_LEARNING_CHECK) {
      const evidence = scheduledIndependentEvidence(state);
      return evidence ? [evidence.conceptId] : [];
    }
    if (purpose === PURPOSES.ERROR_RECHECK) return pending;
    if (purpose === PURPOSES.RECOVERY_LEARNING) return recovery ? [recovery.recoveryConceptId] : [];
    if (purpose === PURPOSES.PAST_CONCEPT_ADVANCE) {
      return targetConcepts
        .filter((concept) => concept.attempts > 0 && concept.status !== "RECOVERY_REQUIRED")
        .sort((a, b) => b.stageIndex - a.stageIndex || a.lastSeenCycle - b.lastSeenCycle)
        .map((concept) => concept.conceptId);
    }
    if (purpose === PURPOSES.SPACED_REVIEW) {
      return targetConcepts
        .filter((concept) => concept.attempts > 0 && concept.nextReviewCycle > 0 && concept.nextReviewCycle <= state.cycleNumber)
        .sort((a, b) => a.nextReviewCycle - b.nextReviewCycle || a.lastReviewCycle - b.lastReviewCycle)
        .map((concept) => concept.conceptId);
    }
    return targetConcepts
      .sort((a, b) => {
        const diagnosisRankDifference = diagnosisCandidateRank(state, a) - diagnosisCandidateRank(state, b);
        const diagnosisPriorityDifference = (
          Number(state.conceptDiagnosisMap?.[a.conceptId]?.priority ?? a.diagnosisPriority ?? 9999)
          - Number(state.conceptDiagnosisMap?.[b.conceptId]?.priority ?? b.diagnosisPriority ?? 9999)
        );
        const aNeedsEvidence = a.status === "UNSEEN" || a.status === "UNSTABLE" || a.status === "DIAGNOSIS_REQUIRED" ? -1 : 0;
        const bNeedsEvidence = b.status === "UNSEEN" || b.status === "UNSTABLE" || b.status === "DIAGNOSIS_REQUIRED" ? -1 : 0;
        return diagnosisRankDifference
          || diagnosisPriorityDifference
          || aNeedsEvidence - bNeedsEvidence
          || a.attempts - b.attempts
          || a.lastSeenCycle - b.lastSeenCycle;
      })
      .map((concept) => concept.conceptId);
  }

  function targetStageForPurpose(state, concept, purpose) {
    if (!concept) return 0;
    if (purpose === PURPOSES.INDEPENDENT_LEARNING_CHECK) {
      const evidence = scheduledIndependentEvidence(state);
      return clamp(STAGES.indexOf(evidence?.learnedStage), 0, STAGES.length - 1);
    }
    const diagnosisStatus = state.conceptDiagnosisMap?.[concept.conceptId]?.status;
    if (diagnosisStatus && diagnosisStatus !== "BASIC_CONFIRMED") return 0;
    if (purpose === PURPOSES.PAST_CONCEPT_ADVANCE) return clamp(concept.stageIndex + 1, 0, STAGES.length - 1);
    if (purpose === PURPOSES.RECOVERY_LEARNING) return 0;
    if (purpose === PURPOSES.INTEGRATED_THINKING) return clamp(Math.max(2, concept.stageIndex), 0, STAGES.length - 1);
    return concept.stageIndex;
  }

  function fallbackPurposes(purpose) {
    const map = {
      [PURPOSES.INDEPENDENT_LEARNING_CHECK]: [PURPOSES.CURRENT_STAGE_CHECK, PURPOSES.PAST_CONCEPT_ADVANCE],
      [PURPOSES.ERROR_RECHECK]: [PURPOSES.CURRENT_STAGE_CHECK, PURPOSES.PAST_CONCEPT_ADVANCE],
      [PURPOSES.RECOVERY_LEARNING]: [PURPOSES.CURRENT_STAGE_CHECK, PURPOSES.SPACED_REVIEW],
      [PURPOSES.SPACED_REVIEW]: [PURPOSES.PAST_CONCEPT_ADVANCE, PURPOSES.CURRENT_STAGE_CHECK],
      [PURPOSES.INTEGRATED_THINKING]: [PURPOSES.PAST_CONCEPT_ADVANCE, PURPOSES.CURRENT_STAGE_CHECK],
      [PURPOSES.PAST_CONCEPT_ADVANCE]: [PURPOSES.CURRENT_STAGE_CHECK, PURPOSES.SPACED_REVIEW],
      [PURPOSES.CURRENT_STAGE_CHECK]: [PURPOSES.PAST_CONCEPT_ADVANCE, PURPOSES.SPACED_REVIEW],
    };
    return [purpose, ...(map[purpose] || [])];
  }

  function selectFromPool(state, pool, purpose) {
    state.recentProblemIds = state.recentProblemIds || [];
    state.recentFingerprints = state.recentFingerprints || [];
    state.recentStructureSignatures = state.recentStructureSignatures || [];
    state.recentSolutionPathSignatures = state.recentSolutionPathSignatures || [];
    const recentIds = new Set(state.recentProblemIds);
    const recentFingerprints = new Set(state.recentFingerprints);
    const recentStructures = new Set(state.recentStructureSignatures);
    const recentSolutionPaths = new Set(state.recentSolutionPathSignatures.slice(-4));
    const requiresNewSolutionPath = [
      PURPOSES.INDEPENDENT_LEARNING_CHECK,
      PURPOSES.ERROR_RECHECK,
      PURPOSES.RECOVERY_LEARNING,
    ].includes(purpose);
    const conceptIds = conceptCandidates(state, purpose);
    if (!conceptIds.length) return null;
    const conceptIndex = new Map(conceptIds.map((conceptId, index) => [conceptId, index]));
    const supplyCache = new Map();
    const candidates = pool
      .filter((problem) => isProblemExecutableForMode(state, problem))
      .map((problem) => {
        const conceptId = String(problem.conceptId || problem.concept || "unknown");
        const concept = ensureConcept(state, {
          conceptId,
          title: problem.concept,
          prerequisiteConceptIds: problem.prerequisiteConcepts || [],
        });
        const targetStageIndex = targetStageForPurpose(state, concept, purpose);
        const strictProductionProblem = Boolean(problem?.mathValidation || problem?.code === "M3-STANDARD-APPROVED");
        const validation = validateProblem(problem, {
          strictMathValidation: strictProductionProblem,
          expectedGrade: strictProductionProblem ? 9 : undefined,
          allowedConceptIds: conceptIds,
          expectedStageIndex: strictProductionProblem ? targetStageIndex : undefined,
        });
        recordProblemValidationFailure(state, problem, validation, purpose);
        const fingerprint = validation.generationFingerprint;
        const problemStructure = validation.structureSignature;
        const solutionPath = validation.solutionPathSignature;
        const id = problemId(problem);
        const sourceStageIndex = problemStageIndex(problem);
        const stageGap = Math.abs(sourceStageIndex - targetStageIndex);
        const supplyKey = `${conceptId}|${targetStageIndex}`;
        if (!supplyCache.has(supplyKey)) {
          supplyCache.set(supplyKey, stageEvidenceSupply(state, pool, conceptId, targetStageIndex));
        }
        const supply = supplyCache.get(supplyKey);
        const conceptRank = conceptIndex.has(conceptId) ? conceptIndex.get(conceptId) : conceptIds.length + 10;
        const integratedPenalty = purpose === PURPOSES.INTEGRATED_THINKING && problemStageIndex(problem) < 2 ? 25 : 0;
        const solutionPathPenalty = recentSolutionPaths.has(solutionPath) ? 2 : 0;
        return {
          problem,
          conceptId,
          fingerprint,
          structureSignature: problemStructure,
          solutionPathSignature: solutionPath,
          validation,
          id,
          sourceStageIndex,
          targetStageIndex,
          stageEvidenceSupply: supply,
          weight: conceptRank * 20 + stageGap * 4 + integratedPenalty + solutionPathPenalty,
        };
      })
      .filter((item) => item.validation.isValid)
      .filter((item) => item.id && !recentIds.has(item.id) && !recentFingerprints.has(item.fingerprint))
      .filter((item) => !recentStructures.has(item.structureSignature))
      .filter((item) => !requiresNewSolutionPath || !recentSolutionPaths.has(item.solutionPathSignature))
      .filter((item) => conceptIndex.has(item.conceptId))
      .sort((a, b) => a.weight - b.weight || a.id.localeCompare(b.id));
    return candidates[0] || null;
  }

  function selectNextProblem(state, pool = []) {
    if (!state.bootstrap.completed) return null;
    seedRecentHistoryFromBootstrap(state);
    if (!state.activeCycle) createCyclePlan(state);
    const slotIndex = state.activeCycle.answers.length;
    const requestedPurpose = state.activeCycle.slots[slotIndex] || PURPOSES.CURRENT_STAGE_CHECK;
    let selected = null;
    let actualPurpose = requestedPurpose;
    for (const purpose of fallbackPurposes(requestedPurpose)) {
      selected = selectFromPool(state, pool, purpose);
      if (selected) {
        actualPurpose = purpose;
        break;
      }
    }
    if (!selected) return null;

    const concept = ensureConcept(state, {
      conceptId: selected.conceptId,
      title: selected.problem.concept,
      prerequisiteConceptIds: selected.problem.prerequisiteConcepts || [],
    });
    const independentEvidence = actualPurpose === PURPOSES.INDEPENDENT_LEARNING_CHECK
      ? scheduledIndependentEvidence(state)
      : null;
    if (independentEvidence) {
      independentEvidence.independentCheckStatus = "IN_PROGRESS";
      independentEvidence.updatedAt = nowIso();
    }
    const diagnosis = state.conceptDiagnosisMap?.[concept.conceptId];
    if (diagnosis && ["UNSEEN", "PENDING"].includes(diagnosis.status)) {
      diagnosis.status = "IN_PROGRESS";
      diagnosis.updatedAt = nowIso();
    }
    const targetStageIndex = independentEvidence
      ? clamp(STAGES.indexOf(independentEvidence.learnedStage), 0, STAGES.length - 1)
      : targetStageForPurpose(state, concept, actualPurpose);
    state.updatedAt = nowIso();
    return {
      ...selected.problem,
      generationFingerprint: selected.fingerprint,
      structureSignature: selected.structureSignature,
      solutionPathSignature: selected.solutionPathSignature,
      validationStatus: selected.validation.validationStatus,
      targetPurpose: actualPurpose,
      learningEvidenceId: independentEvidence?.evidenceId,
      sourceStageIndex: selected.sourceStageIndex,
      targetStageIndex,
      stageEvidenceEligible: selected.sourceStageIndex === targetStageIndex
        && selected.stageEvidenceSupply.sufficientForStageProof,
      stageEvidenceSupply: selected.stageEvidenceSupply,
      stageIndex: targetStageIndex,
      stageName: STAGES[targetStageIndex],
      stageLabel: stageLabel(targetStageIndex),
      cycleId: state.activeCycle.id,
      cycleNumber: state.activeCycle.number,
    };
  }

  function trimRecent(list, limit) {
    if (list.length > limit) list.splice(0, list.length - limit);
  }

  function completeCycle(state) {
    const cycle = state.activeCycle;
    if (!cycle) return null;
    const grouped = new Map();
    cycle.answers
      .filter((answer) => [
        PURPOSES.CURRENT_STAGE_CHECK,
        PURPOSES.PAST_CONCEPT_ADVANCE,
        PURPOSES.INTEGRATED_THINKING,
        PURPOSES.INDEPENDENT_LEARNING_CHECK,
      ].includes(answer.purpose))
      .forEach((answer) => {
      if (!grouped.has(answer.conceptId)) grouped.set(answer.conceptId, []);
      grouped.get(answer.conceptId).push(answer);
    });
    const promoted = [];
    const promotionEvents = [];
    const unstable = [];
    const recovery = [];
    const insufficientStageSupply = [];

    grouped.forEach((answers, conceptId) => {
      const concept = ensureConcept(state, { conceptId });
      const eligibleAnswers = answers.filter((answer) => answer.stageEvidenceEligible !== false);
      const correctEvidence = eligibleAnswers.filter((answer) => answer.outcome === "correct");
      const distinctStructures = new Set(correctEvidence.map((answer) => answer.structureSignature));
      const distinctSolutionPaths = new Set(correctEvidence.map((answer) => answer.solutionPathSignature));
      const correct = correctEvidence.length;
      const giveUp = answers.filter((answer) => answer.outcome === "giveup").length;
      if (correct >= 3
        && distinctStructures.size >= 3
        && distinctSolutionPaths.size >= 3
        && giveUp === 0
        && concept.lastPromotedCycle !== cycle.number) {
        const fromStageIndex = concept.stageIndex;
        const completedFinalStage = concept.stageIndex === STAGES.length - 1;
        if (!completedFinalStage) concept.stageIndex += 1;
        concept.status = completedFinalStage ? "MASTERED" : "ACTIVE_STAGE";
        concept.stageCandidate = false;
        concept.lastPromotedCycle = cycle.number;
        scheduleSpacedReview(concept, cycle.number, { reset: true });
        promoted.push(conceptId);
        if (!completedFinalStage && concept.stageIndex !== fromStageIndex) {
          promotionEvents.push({
            conceptId,
            fromStage: STAGES[fromStageIndex],
            toStage: STAGES[concept.stageIndex],
            fromStageIndex,
            toStageIndex: concept.stageIndex,
            cycleId: cycle.id,
            cycleNumber: cycle.number,
          });
        }
      } else if (giveUp > 0 || (distinctSolutionPaths.size >= 3 && correct <= 1)) {
        concept.status = "RECOVERY_REQUIRED";
        enqueueRecovery(state, concept, conceptId);
        recovery.push(conceptId);
      } else if (answers.some((answer) => answer.purpose === PURPOSES.INDEPENDENT_LEARNING_CHECK)
        && answers.every((answer) => answer.outcome === "correct")) {
        concept.status = "STAGE_CANDIDATE";
        concept.stageCandidate = true;
      } else if (answers.length > 0) {
        concept.status = "UNSTABLE";
        unstable.push(conceptId);
        if (answers.some((answer) => answer.stageEvidenceEligible === false)) insufficientStageSupply.push(conceptId);
      }
    });

    ensureLearningCompletionState(state);
    state.learningCompletionEvidence.forEach((evidence) => {
      if (evidence.scheduledCycleId !== cycle.id || evidence.independentCheckStatus !== "SCHEDULED") return;
      evidence.independentCheckStatus = "PENDING";
      evidence.scheduledCycleId = undefined;
      evidence.updatedAt = nowIso();
    });

    const summary = {
      cycleId: cycle.id,
      cycleNumber: cycle.number,
      answered: cycle.answers.length,
      promotedConceptIds: promoted,
      promotionEvents,
      unstableConceptIds: unstable,
      recoveryConceptIds: recovery,
      insufficientStageSupplyConceptIds: [...new Set(insufficientStageSupply)],
      recoveryCompleted: Boolean(cycle.recoveryActiveAtStart && state.recoveryStack.length === 0),
      completedAt: nowIso(),
    };
    state.lastCycleSummary = summary;
    state.cycleHistory.push(summary);
    if (state.cycleHistory.length > 100) state.cycleHistory.shift();
    state.activeCycle = null;
    state.updatedAt = nowIso();
    return summary;
  }

  function updateRecheckProgress(state, concept, evidenceSignature, outcome) {
    const pending = state.pendingRechecks.find((item) => item.conceptId === concept.conceptId && item.remaining > 0);
    if (!pending) return;
    pending.outcomes = pending.outcomes || [];
    pending.attemptedFingerprints = pending.attemptedFingerprints || [];
    pending.attemptedEvidenceSignatures = pending.attemptedEvidenceSignatures || [];
    if (!pending.attemptedEvidenceSignatures.includes(evidenceSignature)) {
      pending.attemptedEvidenceSignatures.push(evidenceSignature);
      pending.attemptedFingerprints.push(evidenceSignature);
      pending.outcomes.push(outcome);
      pending.remaining = Math.max(0, pending.remaining - 1);
    }
    if (pending.remaining > 0) return;

    const recentOutcomes = pending.outcomes.slice(-3);
    const correct = recentOutcomes.filter((item) => item === "correct").length;
    if (correct === 3) {
      concept.status = "LIKELY_SLIP";
    } else if (correct === 2) {
      concept.status = "UNSTABLE";
    } else {
      concept.status = "RECOVERY_REQUIRED";
      enqueueRecovery(state, concept, concept.conceptId);
    }
  }

  function updateRecoveryProgress(state, concept, evidenceSignature, outcome) {
    const recoveryIndex = state.recoveryStack.findIndex((item) => item.recoveryConceptId === concept.conceptId);
    if (recoveryIndex < 0) return;
    const recovery = state.recoveryStack[recoveryIndex];
    if (!recovery.evidence.some((item) => (item.evidenceSignature || item.fingerprint) === evidenceSignature)) {
      recovery.evidence.push({ evidenceSignature, fingerprint: evidenceSignature, outcome });
      recovery.attemptCount += 1;
    }
    if (recovery.evidence.length < 3) return;

    const correct = recovery.evidence.filter((item) => item.outcome === "correct").length;
    state.recoveryStack.splice(recoveryIndex, 1);
    if (correct >= 2) {
      scheduleSpacedReview(concept, state.cycleNumber, { reset: true });
      const original = ensureConcept(state, { conceptId: recovery.originalConceptId });
      original.status = "CHECKPOINT_REQUIRED";
      enqueueRecheck(state, recovery.originalConceptId, 3);
    } else {
      enqueueRecovery(state, concept, recovery.originalConceptId, {
        originalStageIndex: recovery.originalStageIndex,
        returnStageIndex: recovery.returnCheckpoint,
      });
    }
    const activeRecovery = state.recoveryStack[state.recoveryStack.length - 1];
    state.returnCheckpoint = activeRecovery
      ? {
          originalConceptId: activeRecovery.originalConceptId,
          originalStageIndex: activeRecovery.originalStageIndex,
          returnStageIndex: activeRecovery.returnCheckpoint,
        }
      : null;
  }

  function updateIndependentLearningCheck(state, problem, outcome) {
    ensureLearningCompletionState(state);
    const evidenceId = String(problem.learningEvidenceId || "");
    const evidence = state.learningCompletionEvidence.find((item) => item.evidenceId === evidenceId);
    if (!evidence) return null;
    evidence.independentCheckStatus = outcome === "correct" ? "PASSED" : "FAILED";
    evidence.scheduledCycleId = state.activeCycle?.id || evidence.scheduledCycleId;
    evidence.updatedAt = nowIso();
    if (outcome === "correct") {
      state.pendingIndependentChecks = state.pendingIndependentChecks.filter((item) => item !== evidence.evidenceId);
    } else if (!state.pendingIndependentChecks.includes(evidence.evidenceId)) {
      state.pendingIndependentChecks.push(evidence.evidenceId);
    }
    return evidence;
  }

  function updateConceptDiagnosis(state, concept, problem, outcome, problemStructure) {
    const diagnosis = state.conceptDiagnosisMap?.[concept.conceptId];
    if (!diagnosis) return null;
    diagnosis.distinctProblemFamiliesChecked = diagnosis.distinctProblemFamiliesChecked || [];
    const familyId = String(problem.problemFamilyId || problemStructure || "").trim();
    if (familyId && !diagnosis.distinctProblemFamiliesChecked.includes(familyId)) {
      diagnosis.distinctProblemFamiliesChecked.push(familyId);
    }
    if (outcome === "correct") diagnosis.basicCorrectCount = (diagnosis.basicCorrectCount || 0) + 1;
    if (outcome === "wrong") diagnosis.basicWrongCount = (diagnosis.basicWrongCount || 0) + 1;
    if (outcome === "giveup") diagnosis.basicGiveUpCount = (diagnosis.basicGiveUpCount || 0) + 1;
    if (outcome === "giveup") {
      diagnosis.status = "RECOVERY_REQUIRED";
    } else if ((diagnosis.basicCorrectCount || 0) >= 2 && diagnosis.distinctProblemFamiliesChecked.length >= 2) {
      diagnosis.status = "BASIC_CONFIRMED";
    } else if (outcome === "correct") {
      diagnosis.status = "BASIC_PASS_CANDIDATE";
    } else {
      diagnosis.status = "UNSTABLE";
    }
    diagnosis.lastCheckedCycle = state.activeCycle?.number || state.cycleNumber;
    diagnosis.updatedAt = nowIso();
    recalculateUnitConceptCoverage(state);
    return diagnosis;
  }

  function recordOutcome(state, problem, outcome, solveSeconds = 0, options = {}) {
    const requestedCycleId = String(options.cycleId || problem?.cycleId || state.activeCycle?.id || "");
    const existingAttempt = requestedCycleId ? getAttempt(state, problem, requestedCycleId) : null;
    if (existingAttempt?.attemptStatus === ATTEMPT_STATUS.FINAL) {
      return { state, cycleCompleted: false, cycleSummary: null, duplicate: true, attempt: existingAttempt };
    }
    if (!state.activeCycle) createCyclePlan(state);
    if (requestedCycleId && requestedCycleId !== state.activeCycle.id) {
      return { state, cycleCompleted: false, cycleSummary: null, rejected: true, reason: "STALE_ACTIVE_CYCLE" };
    }
    const normalizedOutcome = normalizeOutcome(outcome);
    const conceptId = String(problem.conceptId || problem.concept || "unknown");
    const concept = ensureConcept(state, {
      conceptId,
      title: problem.concept,
      prerequisiteConceptIds: problem.prerequisiteConcepts || [],
    });
    const fingerprint = problem.generationFingerprint || problemFingerprint(problem);
    const problemStructure = problem.structureSignature || structureSignature(problem);
    const solutionPath = problem.solutionPathSignature || solutionPathSignature(problem);
    const id = problemId(problem);
    const finalized = finalizeAttempt(state, problem, {
      cycleId: state.activeCycle.id,
      submissionId: options.submissionId,
      selectedAnswer: options.selectedAnswer,
      outcome: normalizedOutcome,
      solveSeconds,
      finalizedAt: options.finalizedAt,
    });
    if (!finalized.created) {
      return { state, cycleCompleted: false, cycleSummary: null, duplicate: true, attempt: finalized.attempt };
    }
    const answerRecord = {
      problemId: id,
      conceptId,
      fingerprint,
      structureSignature: problemStructure,
      solutionPathSignature: solutionPath,
      sourceStageIndex: Number.isFinite(problem.sourceStageIndex) ? problem.sourceStageIndex : problemStageIndex(problem),
      targetStageIndex: Number.isFinite(problem.targetStageIndex) ? problem.targetStageIndex : problem.stageIndex,
      stageEvidenceEligible: problem.stageEvidenceEligible !== false,
      purpose: problem.targetPurpose || PURPOSES.CURRENT_STAGE_CHECK,
      learningEvidenceId: problem.learningEvidenceId || undefined,
      stageIndex: Number.isFinite(problem.stageIndex) ? problem.stageIndex : problemStageIndex(problem),
      outcome: normalizedOutcome,
      selectedAnswer: finalized.attempt.selectedAnswer,
      solveSeconds: Math.max(0, Number(solveSeconds) || 0),
      answeredAt: nowIso(),
      submissionId: finalized.attempt.submissionId,
      attemptStatus: ATTEMPT_STATUS.FINAL,
      finalizedAt: finalized.attempt.finalizedAt,
    };
    state.activeCycle.answers.push(answerRecord);
    state.totals.solved += 1;
    const totalKey = normalizedOutcome === "giveup" ? "giveUp" : normalizedOutcome;
    state.totals[totalKey] += 1;
    concept.attempts += 1;
    concept[normalizedOutcome === "giveup" ? "giveUp" : normalizedOutcome] += 1;
    concept.lastSeenCycle = state.activeCycle.number;
    if (!concept.distinctFingerprints.includes(fingerprint)) concept.distinctFingerprints.push(fingerprint);
    state.recentProblemIds.push(id);
    state.recentFingerprints.push(fingerprint);
    state.recentStructureSignatures = state.recentStructureSignatures || [];
    state.recentSolutionPathSignatures = state.recentSolutionPathSignatures || [];
    state.recentStructureSignatures.push(problemStructure);
    state.recentSolutionPathSignatures.push(solutionPath);
    trimRecent(state.recentProblemIds, RECENT_PROBLEM_ID_LIMIT);
    trimRecent(state.recentFingerprints, RECENT_FINGERPRINT_LIMIT);
    trimRecent(state.recentStructureSignatures, RECENT_STRUCTURE_LIMIT);
    trimRecent(state.recentSolutionPathSignatures, RECENT_SOLUTION_PATH_LIMIT);

    if (normalizedOutcome === "wrong" && problem.targetPurpose !== PURPOSES.ERROR_RECHECK) {
      enqueueRecheck(state, conceptId, 3);
    }
    if (normalizedOutcome === "giveup") {
      concept.status = "RECOVERY_REQUIRED";
      enqueueRecovery(state, concept, conceptId);
    }
    if (problem.targetPurpose === PURPOSES.ERROR_RECHECK) {
      updateRecheckProgress(state, concept, solutionPath || problemStructure, normalizedOutcome);
    }
    if (problem.targetPurpose === PURPOSES.RECOVERY_LEARNING) {
      updateRecoveryProgress(state, concept, solutionPath || problemStructure, normalizedOutcome);
    }
    if (problem.targetPurpose === PURPOSES.SPACED_REVIEW) {
      concept.lastReviewCycle = state.activeCycle.number;
      if (normalizedOutcome === "correct") {
        concept.reviewMilestoneIndex = Math.min(
          SPACED_REVIEW_CYCLES.length - 1,
          (concept.reviewMilestoneIndex || 0) + 1
        );
        scheduleSpacedReview(concept, state.activeCycle.number);
      } else {
        scheduleSpacedReview(concept, state.activeCycle.number, { reset: true });
      }
    }
    if (problem.targetPurpose === PURPOSES.INDEPENDENT_LEARNING_CHECK) {
      updateIndependentLearningCheck(state, problem, normalizedOutcome);
    }
    updateConceptDiagnosis(state, concept, problem, normalizedOutcome, problemStructure);

    state.updatedAt = nowIso();
    const cycleCompleted = state.activeCycle.answers.length >= state.activeCycle.targetSize;
    const cycleSummary = cycleCompleted ? completeCycle(state) : null;
    return { state, cycleCompleted, cycleSummary, duplicate: false, attempt: finalized.attempt };
  }

  function markStopped(state, elapsedSeconds = 0) {
    state.session.active = false;
    state.session.elapsedSeconds = Math.max(state.session.elapsedSeconds || 0, Number(elapsedSeconds) || 0);
    state.session.lastStoppedAt = nowIso();
    state.updatedAt = nowIso();
    return state;
  }

  function resumeSession(state) {
    state.session.active = true;
    state.session.id = state.session.id || makeId("session");
    state.updatedAt = nowIso();
    return state;
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  return {
    VERSION,
    MODE_STANDARD,
    MODE_ELITE,
    PHASE_BOOTSTRAP,
    PHASE_CYCLING,
    ATTEMPT_STATUS,
    STAGES,
    STAGE_LABELS,
    PURPOSES,
    DEFAULT_CYCLE_SIZE,
    MIN_CYCLE_SIZE,
    MAX_CYCLE_SIZE,
    SPACED_REVIEW_CYCLES,
    createStudentState,
    configureConceptDiagnostics,
    prioritizeConceptDiagnosticsFromBootstrap,
    recalculateUnitConceptCoverage,
    recordLearningCompletion,
    getAttempt,
    startAttempt,
    finalizeAttempt,
    createRewardEventId,
    applyBootstrapResults,
    seedRecentHistoryFromBootstrap,
    createCyclePlan,
    selectNextProblem,
    recordOutcome,
    completeCycle,
    markStopped,
    resumeSession,
    problemFingerprint,
    structureSignature,
    solutionPathSignature,
    validateProblem,
    isProblemExecutableForMode,
    stageEvidenceSupply,
    problemStageIndex,
    stageLabel,
    cloneState,
  };
});
