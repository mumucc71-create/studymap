(function initEliteRuntime(root, factory) {
  const dependencies = typeof module === "object" && module.exports
    ? {
      diagnosis: require("./elite-diagnosis.js"),
      mathSchema: require("./math-learning-schema.js"),
      mathModel: require("./middle3-elite-math-model.js"),
      englishModel: require("./middle3-elite-english-model.js"),
    }
    : {
      diagnosis: root.STUDY_ELITE_DIAGNOSIS,
      mathSchema: root.STUDY_MATH_LEARNING_SCHEMA,
      mathModel: root.STUDY_MIDDLE3_ELITE_MATH_MODEL,
      englishModel: root.STUDY_MIDDLE3_ELITE_ENGLISH_MODEL,
    };
  const api = factory(dependencies);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_RUNTIME = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteRuntimeModule(defaults) {
  "use strict";

  const ELITE_VERSION = "middle3-elite-runtime-v1";
  const ALLOWED_SUBJECTS = Object.freeze(["math", "english"]);
  const MIN_SESSION_ITEMS = 12;
  const MAX_SESSION_ITEMS = 20;
  const INITIAL_HIGH_ITEMS = 7;
  const INITIAL_TOP_ITEMS = 5;
  const ANSWER_TYPE_ALIASES = Object.freeze({
    MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
    SHORT_ANSWER: "SHORT_ANSWER",
    EXPRESSION: "EXPRESSION_INPUT",
    PROCESS: "STEP_ORDER",
    WRITTEN: "WRITTEN_RESPONSE",
    EXPRESSION_INPUT: "EXPRESSION_INPUT",
    STEP_ORDER: "STEP_ORDER",
    WRITTEN_RESPONSE: "WRITTEN_RESPONSE",
  });

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function iso(now) {
    return new Date(typeof now === "number" ? now : Date.now()).toISOString();
  }

  function subjectKey(value) {
    if (["math", "수학"].includes(value)) return "math";
    if (["english", "영어"].includes(value)) return "english";
    return null;
  }

  function normalizeAnswerType(value) {
    const normalized = ANSWER_TYPE_ALIASES[value];
    if (!normalized) throw new Error(`UNSUPPORTED_ELITE_ANSWER_TYPE:${value}`);
    return normalized;
  }

  function normalizeProblem(problem) {
    return Object.freeze({
      ...problem,
      subject: subjectKey(problem.subject),
      gradeOrLevel: "middle3",
      sourceAnswerType: problem.answerType,
      answerType: normalizeAnswerType(problem.answerType),
      choices: Object.freeze([...(problem.choices || [])]),
      reasoningGoals: Object.freeze([...(problem.reasoningGoals || [])]),
      trapTypes: Object.freeze([...(problem.trapTypes || [])]),
      prerequisiteConceptIds: Object.freeze([...(problem.prerequisiteConceptIds || [])]),
    });
  }

  function createIdentifier(prefix, now, random) {
    const suffix = Math.floor((random?.() ?? Math.random()) * 0x7fffffff).toString(36);
    return `${prefix}-${Number(now).toString(36)}-${suffix}`;
  }

  function problemGroup(problem) {
    return problem.domain || problem.englishTaskType || problem.conceptId;
  }

  function firstStrategy(problem) {
    return String(problem.solutionPathSignature || "").split(">")[0];
  }

  function problemIsUnique(problem, used, options = {}) {
    if (used.ids.has(problem.problemId)) return false;
    if (used.structures.has(problem.structureSignature)) return false;
    if (used.solutions.has(problem.solutionPathSignature)) return false;
    if (!options.relaxTrap && problem.trapTypes?.[0] && used.traps.has(problem.trapTypes[0])) return false;
    if (!options.relaxStrategy && firstStrategy(problem) && used.strategies.has(firstStrategy(problem))) return false;
    return true;
  }

  function registerProblem(problem, used) {
    used.ids.add(problem.problemId);
    used.structures.add(problem.structureSignature);
    used.solutions.add(problem.solutionPathSignature);
    if (problem.trapTypes?.[0]) used.traps.add(problem.trapTypes[0]);
    if (firstStrategy(problem)) used.strategies.add(firstStrategy(problem));
  }

  function usedSets(state, recentProblemIds = []) {
    const ids = new Set([...(state?.usedProblemIds || []), ...recentProblemIds]);
    return {
      ids,
      structures: new Set(state?.usedStructureSignatures || []),
      solutions: new Set(state?.usedSolutionPathSignatures || []),
      traps: new Set(state?.usedTrapTypes || []),
      strategies: new Set(state?.usedFirstStrategies || []),
    };
  }

  function selectBalancedProblems(source, count, used, options = {}) {
    const candidates = source
      .filter((problem) => !options.errorCode || problem.trapTypes.includes(options.errorCode))
      .filter((problem) => !options.excludeStructure || problem.structureSignature !== options.excludeStructure)
      .sort((left, right) => (
        String(problemGroup(left)).localeCompare(String(problemGroup(right)))
        || left.problemId.localeCompare(right.problemId)
      ));
    const groups = new Map();
    candidates.forEach((problem) => {
      const key = problemGroup(problem);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(problem);
    });
    const selected = [];
    const passes = [
      { relaxTrap: false, relaxStrategy: false },
      { relaxTrap: true, relaxStrategy: false },
      { relaxTrap: true, relaxStrategy: true },
    ];
    for (const pass of passes) {
      let advanced = true;
      while (selected.length < count && advanced) {
        advanced = false;
        for (const list of groups.values()) {
          const candidate = list.find((problem) => problemIsUnique(problem, used, pass));
          if (!candidate) continue;
          selected.push(candidate);
          registerProblem(candidate, used);
          advanced = true;
          if (selected.length >= count) break;
        }
      }
      if (selected.length >= count) break;
    }
    return selected;
  }

  function createEngine(options = {}) {
    const diagnosis = options.diagnosis || defaults.diagnosis;
    const mathSchema = options.mathSchema || defaults.mathSchema;
    const models = {
      math: options.mathModel || defaults.mathModel,
      english: options.englishModel || defaults.englishModel,
    };
    const nowFn = options.now || (() => Date.now());
    const randomFn = options.random || Math.random;
    const problemsBySubject = {};
    const problemById = new Map();

    ALLOWED_SUBJECTS.forEach((subject) => {
      const rawProblems = models[subject]?.problems;
      if (!Array.isArray(rawProblems) || !rawProblems.length) throw new Error(`ELITE_MODEL_MISSING:${subject}`);
      problemsBySubject[subject] = rawProblems.map(normalizeProblem);
      problemsBySubject[subject].forEach((problem) => problemById.set(problem.problemId, problem));
    });

    function assertSubject(subject) {
      const normalized = subjectKey(subject);
      if (!ALLOWED_SUBJECTS.includes(normalized)) throw new Error(`ELITE_SUBJECT_NOT_ALLOWED:${subject}`);
      return normalized;
    }

    function addProblems(state, level, count, selectionOptions = {}) {
      if (state.sessionProblemIds.length >= MAX_SESSION_ITEMS) return [];
      const availableCount = Math.min(count, MAX_SESSION_ITEMS - state.sessionProblemIds.length);
      const used = usedSets(state);
      const source = problemsBySubject[state.subject].filter((problem) => problem.eliteLevel === level);
      const selected = selectBalancedProblems(source, availableCount, used, selectionOptions);
      selected.forEach((problem) => {
        state.sessionProblemIds.push(problem.problemId);
        state.usedProblemIds.push(problem.problemId);
        state.usedStructureSignatures.push(problem.structureSignature);
        state.usedSolutionPathSignatures.push(problem.solutionPathSignature);
        if (problem.trapTypes?.[0]) state.usedTrapTypes.push(problem.trapTypes[0]);
        if (firstStrategy(problem)) state.usedFirstStrategies.push(firstStrategy(problem));
      });
      return selected;
    }

    function createSession(subjectValue, sessionOptions = {}) {
      const subject = assertSubject(subjectValue);
      if (!sessionOptions.uid) throw new Error("ELITE_AUTH_REQUIRED");
      const now = Number(sessionOptions.now ?? nowFn());
      const state = {
        eliteVersion: ELITE_VERSION,
        subject,
        gradeOrLevel: "middle3",
        activeEliteSessionId: createIdentifier(`elite-${subject}-middle3`, now, randomFn),
        sessionStatus: "IN_PROGRESS",
        cloudHydrationStatus: sessionOptions.cloudHydrationStatus || "READY",
        startedAt: iso(now),
        updatedAt: iso(now),
        completedAt: null,
        completionReason: null,
        timeLimitSeconds: Number(sessionOptions.timeLimitSeconds) || 20 * 60,
        currentProblemIndex: 0,
        sessionProblemIds: [],
        responses: {},
        finalizedAttempts: {},
        usedProblemIds: [],
        usedStructureSignatures: [],
        usedSolutionPathSignatures: [],
        usedTrapTypes: [],
        usedFirstStrategies: [],
        currentEliteLevel: "HIGH",
        stableLevel: "NOT_CONFIRMED",
        challengeLevel: "HIGH",
        pendingRechecks: [],
        errorEvidence: [],
        confirmedWeaknesses: [],
        strengthAreas: [],
        recommendedLearningTargets: [],
        recommendedLevelTestStart: null,
        resultSummary: null,
        returnCheckpoint: sessionOptions.returnCheckpoint || null,
        revision: Number(sessionOptions.baseRevision) + 1 || 1,
        ownerUid: sessionOptions.uid,
      };
      addProblems(state, "HIGH", INITIAL_HIGH_ITEMS);
      return state;
    }

    function restoreState(rawState, uid) {
      const state = clone(rawState);
      if (!state || state.eliteVersion !== ELITE_VERSION) throw new Error("INVALID_ELITE_STATE_VERSION");
      assertSubject(state.subject);
      if (uid && state.ownerUid && state.ownerUid !== uid) throw new Error("ELITE_STATE_OWNER_MISMATCH");
      state.gradeOrLevel = "middle3";
      if (!["LOADING", "READY", "FAILED"].includes(state.cloudHydrationStatus)) {
        state.cloudHydrationStatus = "READY";
      }
      state.sessionProblemIds = (state.sessionProblemIds || []).filter((id) => problemById.has(id));
      state.usedProblemIds = [...new Set(state.usedProblemIds || state.sessionProblemIds)];
      state.usedStructureSignatures = [...new Set(state.usedStructureSignatures || [])];
      state.usedSolutionPathSignatures = [...new Set(state.usedSolutionPathSignatures || [])];
      state.usedTrapTypes = [...new Set(state.usedTrapTypes || [])];
      state.usedFirstStrategies = [...new Set(state.usedFirstStrategies || [])];
      state.responses = state.responses || {};
      state.finalizedAttempts = state.finalizedAttempts || {};
      state.pendingRechecks = state.pendingRechecks || [];
      state.errorEvidence = state.errorEvidence || [];
      state.confirmedWeaknesses = state.confirmedWeaknesses || [];
      state.strengthAreas = state.strengthAreas || [];
      state.currentProblemIndex = Math.max(0, Math.min(
        Number(state.currentProblemIndex) || 0,
        Math.max(0, state.sessionProblemIds.length - 1)
      ));
      return state;
    }

    function getProblem(problemId) {
      return problemById.get(problemId) || null;
    }

    function getCurrentProblem(state) {
      return getProblem(state?.sessionProblemIds?.[state.currentProblemIndex]);
    }

    function normalizeComparable(value) {
      return String(value ?? "")
        .normalize("NFKC")
        .replace(/[−–—]/g, "-")
        .replace(/[×·]/g, "*")
        .replace(/÷/g, "/")
        .replace(/\s+/g, "")
        .toLowerCase();
    }

    function evaluateAnswer(problem, answer) {
      if (problem.answerType === "MULTIPLE_CHOICE") {
        return mathSchema.evaluateAnswer(problem, answer);
      }
      if (problem.answerType === "SHORT_ANSWER" || problem.answerType === "EXPRESSION_INPUT") {
        return mathSchema.evaluateAnswer(problem, answer);
      }
      const actual = normalizeComparable(answer);
      const expected = normalizeComparable(problem.correctAnswer);
      if (actual && actual === expected) {
        return { status: "CORRECT", correct: true, confidence: 0.99, rubricScore: 1 };
      }
      if (String(answer ?? "").trim().length >= 12) {
        return {
          status: "REVIEW_REQUIRED",
          correct: null,
          confidence: 0.5,
          rubricScore: null,
          rubric: problem.answerRubric,
        };
      }
      return {
        status: "INCORRECT",
        correct: false,
        confidence: 0.9,
        rubricScore: 0,
        errorCodes: [problem.subject === "math" ? "STRATEGY_FAILURE" : "EVIDENCE_SELECTION_FAILURE"],
      };
    }

    function scheduleRecheck(state, problem, errorCode) {
      const target = {
        recheckId: createIdentifier("elite-recheck", nowFn(), randomFn),
        subject: state.subject,
        eliteLevel: problem.eliteLevel,
        errorCode,
        reasoningGoal: problem.reasoningGoals?.[0] || null,
        prerequisiteConceptIds: [...(problem.prerequisiteConceptIds || [])],
        sourceProblemId: problem.problemId,
        sourceStructureSignature: problem.structureSignature,
        targetProblemId: null,
        status: "PENDING",
        createdAt: iso(nowFn()),
      };
      const selected = addProblems(state, problem.eliteLevel, 1, {
        errorCode,
        excludeStructure: problem.structureSignature,
      });
      if (!selected.length) {
        const fallback = addProblems(state, problem.eliteLevel, 1, {
          excludeStructure: problem.structureSignature,
        });
        if (fallback[0]) target.targetProblemId = fallback[0].problemId;
        else target.status = "DEFERRED";
      } else {
        target.targetProblemId = selected[0].problemId;
      }
      state.pendingRechecks.push(target);
      return target;
    }

    function maybeExpandSession(state) {
      const highPassed = diagnosis.canMoveHighToTop(state);
      if (state.currentEliteLevel === "HIGH" && highPassed) {
        state.currentEliteLevel = "TOP";
        state.stableLevel = "HIGH";
        state.challengeLevel = "TOP";
        addProblems(state, "TOP", INITIAL_TOP_ITEMS);
      }
      diagnosis.updateLevels(state);
    }

    function completeState(state, reason, now) {
      state.sessionStatus = "COMPLETED";
      state.completedAt = iso(now);
      state.updatedAt = iso(now);
      state.completionReason = reason;
      diagnosis.buildResultSummary(state);
      return state;
    }

    function advanceAfterSubmission(state, now) {
      maybeExpandSession(state);
      if (state.currentProblemIndex < state.sessionProblemIds.length - 1) {
        state.currentProblemIndex += 1;
        return state;
      }
      if (Object.keys(state.finalizedAttempts).length >= MIN_SESSION_ITEMS
        || state.sessionProblemIds.length >= MAX_SESSION_ITEMS) {
        return completeState(state, "EVIDENCE_COMPLETE", now);
      }
      const added = addProblems(
        state,
        state.currentEliteLevel,
        Math.max(1, MIN_SESSION_ITEMS - state.sessionProblemIds.length)
      );
      if (added.length) {
        state.currentProblemIndex += 1;
        return state;
      }
      return completeState(state, "NO_DISTINCT_PROBLEMS", now);
    }

    function submitCurrent(rawState, answer, submitOptions = {}) {
      const state = restoreState(rawState, rawState.ownerUid);
      const now = Number(submitOptions.now ?? nowFn());
      if (state.cloudHydrationStatus !== "READY") throw new Error("ELITE_CLOUD_NOT_READY");
      if (state.sessionStatus !== "IN_PROGRESS") throw new Error("ELITE_SESSION_NOT_IN_PROGRESS");
      const problem = getCurrentProblem(state);
      if (!problem) throw new Error("ELITE_CURRENT_PROBLEM_MISSING");
      if (submitOptions.problemId && submitOptions.problemId !== problem.problemId) {
        throw new Error("ELITE_PROBLEM_INDEX_CONFLICT");
      }
      if (state.finalizedAttempts[problem.problemId]?.attemptStatus === "FINAL") {
        throw new Error("ELITE_ATTEMPT_ALREADY_FINAL");
      }
      const submissionId = submitOptions.submissionId || createIdentifier("elite-submission", now, randomFn);
      if (Object.values(state.finalizedAttempts).some((attempt) => attempt.submissionId === submissionId)) {
        throw new Error("ELITE_SUBMISSION_DUPLICATE");
      }
      const unknown = Boolean(submitOptions.unknown);
      const evaluation = unknown
        ? { status: "UNKNOWN", correct: false, confidence: 1 }
        : evaluateAnswer(problem, answer);
      const activeRecheck = state.pendingRechecks.find((item) => (
        item.targetProblemId === problem.problemId && item.status === "PENDING"
      ));
      const errorCode = ["INCORRECT", "UNKNOWN"].includes(evaluation.status)
        ? (activeRecheck?.errorCode || diagnosis.inferErrorCode(problem, answer, evaluation, { unknown }))
        : null;
      const attempt = {
        problemId: problem.problemId,
        subject: state.subject,
        domain: problem.domain,
        englishTaskType: problem.englishTaskType || null,
        conceptId: problem.conceptId,
        eliteLevel: problem.eliteLevel,
        answerType: problem.answerType,
        answer: unknown ? null : clone(answer),
        unknown,
        evaluationStatus: evaluation.status,
        correct: evaluation.correct,
        confidence: evaluation.confidence,
        rubricScore: evaluation.rubricScore ?? null,
        errorCode,
        attemptStatus: "FINAL",
        submissionId,
        finalizedAt: iso(now),
        structureSignature: problem.structureSignature,
        solutionPathSignature: problem.solutionPathSignature,
      };
      state.responses[problem.problemId] = {
        answer: attempt.answer,
        unknown,
        submissionId,
        savedAt: attempt.finalizedAt,
      };
      state.finalizedAttempts[problem.problemId] = attempt;
      if (errorCode) {
        const weight = unknown || problem.answerType === "WRITTEN_RESPONSE" ? 1.25 : 1;
        diagnosis.recordErrorEvidence(state, problem, errorCode, { weight, at: attempt.finalizedAt });
        scheduleRecheck(state, problem, errorCode);
      }
      if (activeRecheck) activeRecheck.status = "COMPLETED";
      diagnosis.rebuildStrengthAreas(state);
      diagnosis.updateLevels(state);
      state.updatedAt = iso(now);
      state.revision = Number(state.revision || 0) + 1;
      return advanceAfterSubmission(state, now);
    }

    function markUnknown(state, options = {}) {
      return submitCurrent(state, null, { ...options, unknown: true });
    }

    function finishSession(rawState, reason = "STUDENT_EXIT", finishOptions = {}) {
      const state = restoreState(rawState, rawState.ownerUid);
      if (state.sessionStatus === "COMPLETED") return state;
      const now = Number(finishOptions.now ?? nowFn());
      state.revision = Number(state.revision || 0) + 1;
      return completeState(state, reason, now);
    }

    function setHydrationStatus(rawState, status) {
      if (!["LOADING", "READY", "FAILED"].includes(status)) throw new Error("INVALID_ELITE_HYDRATION_STATUS");
      const state = clone(rawState);
      state.cloudHydrationStatus = status;
      return state;
    }

    return Object.freeze({
      createSession,
      restoreState,
      getProblem,
      getCurrentProblem,
      submitCurrent,
      markUnknown,
      finishSession,
      setHydrationStatus,
      getProblems(subject) {
        return problemsBySubject[assertSubject(subject)];
      },
      normalizeProblem,
      normalizeAnswerType,
      assertSubject,
    });
  }

  return Object.freeze({
    ELITE_VERSION,
    ALLOWED_SUBJECTS,
    MIN_SESSION_ITEMS,
    MAX_SESSION_ITEMS,
    INITIAL_HIGH_ITEMS,
    INITIAL_TOP_ITEMS,
    ANSWER_TYPE_ALIASES,
    subjectKey,
    normalizeAnswerType,
    normalizeProblem,
    createEngine,
  });
});
