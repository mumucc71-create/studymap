(function (root, factory) {
  const commonJs = typeof module === "object" && module.exports;
  const deps = commonJs ? {
    runtime: require("./math-adaptive-level-test-runtime.js"),
    gates: require("./math-adaptive-level-test-grade-gates.js"),
    result: require("./math-adaptive-level-test-result.js"),
    graph: require("./math-concept-graph-data.js"),
    storage: require("./math-adaptive-level-test-storage.js"),
  } : {
    runtime: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_RUNTIME,
    gates: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_GATES,
    result: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_RESULT,
    graph: root.STUDY_MATH_CONCEPT_GRAPH,
    storage: root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE,
  };
  const api = factory(deps);
  if (commonJs) module.exports = api;
  if (root) root.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI = api;
})(typeof window !== "undefined" ? window : globalThis, function (deps) {
  "use strict";
  const { runtime, gates, result: resultApi, graph, storage } = deps;
  if (!runtime || !gates || !resultApi || !graph || !storage) throw new Error("MATH_ADAPTIVE_UI_DEPENDENCY_MISSING");

  const ALLOWED_MESSAGES = Object.freeze({
    EVIDENCE_RECORDED: "현재 확인 중인 개념을 계속 살펴볼게요.",
    ASK_CONFIRMATION: "한 문제 더 확인할게요.",
    DIAGNOSE_PREREQUISITE: "기초 개념을 먼저 확인할게요.",
    FOUNDATION_SUPPORT: "기초 개념을 먼저 확인할게요.",
    RETURN_TO_GATE: "원래 개념으로 돌아갈게요.",
    PROMOTE_GRADE_GATE: "다음 개념에 도전할게요.",
    ENTER_CONCEPT_GRAPH: "다음 개념에 도전할게요.",
    GRAPH_BOUNDARY_UPDATED: "진단이 거의 끝났어요.",
    GRAPH_REMEDIATION: "기초 개념을 먼저 확인할게요.",
  });
  const text = (value) => String(value ?? "").trim();
  const normalized = (value) => text(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
  const escapeHtml = (value) => text(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

  function evaluateAnswer(question, answer, evaluator) {
    if (question.answerType === "WRITTEN_RESPONSE") return Object.freeze({ result: "REVIEW_REQUIRED", correct: false });
    if (typeof evaluator === "function") {
      const evaluated = evaluator(question, answer);
      if (typeof evaluated === "boolean") return Object.freeze({ result: evaluated ? "CORRECT" : "INCORRECT", correct: evaluated });
      if (evaluated?.result) return Object.freeze({ ...evaluated, correct: evaluated.result === "CORRECT" });
    }
    const expected = question.expectedAnswer ?? question.correctAnswer ?? question.answer;
    if (question.answerType === "STEP_ORDER") {
      const actualSteps = Array.isArray(answer) ? answer.map(text) : text(answer).split(/\r?\n|\s*→\s*/).filter(Boolean);
      const expectedSteps = Array.isArray(expected) ? expected.map(text) : text(expected).split(/\r?\n|\s*→\s*/).filter(Boolean);
      const correct = JSON.stringify(actualSteps) === JSON.stringify(expectedSteps);
      return Object.freeze({ result: correct ? "CORRECT" : "INCORRECT", correct });
    }
    const accepted = [...new Set([expected, ...(question.acceptedAnswers || [])].map(normalized).filter(Boolean))];
    const correct = accepted.includes(normalized(answer));
    return Object.freeze({ result: correct ? "CORRECT" : "INCORRECT", correct });
  }

  function questionPrompt(question) { return text(question.prompt || question.questionText || question.problem); }
  function conceptDisplayName(question, session) {
    const id = question?.canonicalConceptId || question?.conceptId || session?.activeConceptId;
    return graph.conceptById[id]?.displayName || text(question?.concept || question?.unit || "현재 개념");
  }

  function renderAnswerInput(question) {
    const type = question.answerType || (question.choices?.length ? "MULTIPLE_CHOICE" : "SHORT_ANSWER");
    if (type === "MULTIPLE_CHOICE") return (question.choices || []).map((choice, index) => `<button type="button" data-answer="${escapeHtml(choice)}"><b>${index + 1}</b><span>${escapeHtml(choice)}</span></button>`).join("");
    if (type === "STEP_ORDER") return '<textarea data-adaptive-answer="STEP_ORDER" rows="5" placeholder="풀이 순서를 한 줄씩 입력하세요."></textarea>';
    if (type === "WRITTEN_RESPONSE") return '<textarea data-adaptive-answer="WRITTEN_RESPONSE" rows="6" placeholder="풀이 과정과 이유를 적어주세요."></textarea>';
    const placeholder = type === "EXPRESSION_INPUT" ? "수식을 입력하세요." : "답을 입력하세요.";
    return `<input type="text" data-adaptive-answer="${type}" placeholder="${placeholder}" autocomplete="off" />`;
  }

  function readAnswer(elements, question) {
    if ((question.answerType || "MULTIPLE_CHOICE") === "MULTIPLE_CHOICE") return elements.selectedAnswer?.() || "";
    return elements.answerList?.querySelector?.("[data-adaptive-answer]")?.value || "";
  }

  function renderQuestion(elements, session) {
    const question = session.currentQuestion;
    if (!question) return false;
    if (elements.quizTitle) elements.quizTitle.textContent = "맞춤형 수학 진단";
    if (elements.quizConcept) elements.quizConcept.textContent = `Q.${Number(session.totalQuestions || 0) + 1}`;
    if (elements.quizPrompt) elements.quizPrompt.textContent = "문제를 읽고 답해보세요.";
    if (elements.quizProblem) elements.quizProblem.textContent = questionPrompt(question);
    if (elements.answerList) elements.answerList.innerHTML = renderAnswerInput(question);
    if (elements.quizCount) elements.quizCount.textContent = `${Number(session.totalQuestions || 0) + 1}문제 진행`;
    if (elements.quizProgress) elements.quizProgress.style.width = `${Math.min(100, Math.round((Number(session.totalQuestions || 0) / 24) * 100))}%`;
    if (elements.quizRoute) elements.quizRoute.textContent = ALLOWED_MESSAGES[session.graphState?.lastDecision?.decision] || "현재 확인 중인 개념";
    if (elements.currentAnalysis) elements.currentAnalysis.textContent = conceptDisplayName(question, session);
    if (elements.checkedAnalysis) elements.checkedAnalysis.textContent = session.testedConceptIds?.length ? `${session.testedConceptIds.length}개 개념 확인` : "진단 시작";
    if (elements.nextAnalysis) elements.nextAnalysis.textContent = session.graphState?.pendingRemediation ? "기초 개념 확인" : "다음 개념 확인";
    return true;
  }

  function resultLists(session) {
    const student = resultApi.buildStudentResult(session.graphState);
    const evidence = session.evidenceByConcept || {};
    const developing = Object.entries(evidence).filter(([, items]) => items.some((item) => item.result === "CORRECT") && items.some((item) => item.result !== "CORRECT")).map(([id]) => id);
    return Object.freeze({
      student,
      recommendedStartConceptIds: Object.freeze([...(session.recommendedStartConceptIds || [])]),
      prerequisiteGaps: Object.freeze([...(session.prerequisiteGaps || [])]),
      strongestConcepts: Object.freeze(resultApi.wellUnderstoodConceptIds(session.graphState)),
      developingConcepts: Object.freeze(developing),
      nextChallengeConceptIds: Object.freeze([...(session.upperBoundaryConcepts || [])]),
    });
  }

  function renderResult(elements, result) {
    const student = result.student;
    if (elements.resultLevel) elements.resultLevel.textContent = "개념 진단";
    if (elements.resultStartCopy) elements.resultStartCopy.textContent = "확인한 개념을 바탕으로 지금 필요한 학습을 정리했어요.";
    if (elements.strongDomains) elements.strongDomains.textContent = student["잘 이해한 개념"].join(", ") || "확인 중";
    if (elements.weakDomains) elements.weakDomains.textContent = student["먼저 보충할 개념"].join(", ") || "추가 보충 없음";
    if (elements.confidenceDomains) elements.confidenceDomains.textContent = student["영역별 진단 신뢰도"].map((item) => `${item.area} ${item.confidence}%`).join(" · ") || "진단 완료";
    if (elements.masteryDomains) elements.masteryDomains.textContent = student["지금 시작할 학습"].join(", ") || "가능한 학습을 찾고 있어요.";
    if (elements.learningPath) elements.learningPath.textContent = student["다음에 도전할 개념"].join(" → ") || "현재 개념부터 연습해요.";
  }

  function selectLearningStart(result) {
    const ordered = [...result.recommendedStartConceptIds, ...result.prerequisiteGaps, ...result.developingConcepts, ...result.nextChallengeConceptIds];
    return [...new Set(ordered)].find((id) => graph.conceptById[id]?.contentAvailability === "COMPLETE_SPRING" && graph.conceptById[id]?.runtimeAvailability === "DEDICATED_SPRING") || null;
  }

  function createController(options = {}) {
    let session = null;
    let catalog = options.catalog || { byGrade: {} };
    const persist = async () => {
      const outcome = options.persist ? await options.persist(session) : { saved: true };
      if (outcome?.state && outcome.saved === false && storage.isValidSession(outcome.state)) session = outcome.state;
      return outcome;
    };
    function start(startOptions = {}) {
      const firstDomain = gates.getGateDomains("G4")[0]?.domainId || null;
      const graphState = runtime.createInitialState({ timestamp: startOptions.timestamp ?? 0, overrides: { currentDomain: firstDomain } });
      session = storage.startNewSession(startOptions.previousSession, { graphState, sessionId: startOptions.sessionId, timestamp: startOptions.timestamp, status: "IN_PROGRESS" });
      return selectNext();
    }
    function restore(value) { session = storage.isValidSession(value) ? value : null; return session; }
    function selectNext() {
      const selected = runtime.getNextQuestion(session.graphState, catalog);
      if (selected.status !== "QUESTION_SELECTED") {
        const status = session.graphState.phase === "CONCEPT_GRAPH" ? "BLOCKED_NO_CONTENT" : "TEST_BANK_NOT_READY";
        session = storage.updateSession(session, { status, currentQuestion: null }, session.updatedAt);
        return Object.freeze({ status, session });
      }
      session = storage.updateSession(session, { currentQuestion: selected.question, remainingPath: [selected.purpose] }, session.updatedAt);
      return Object.freeze({ status: "QUESTION_SELECTED", question: selected.question, session });
    }
    async function submit(answer, submission = {}) {
      if (!session?.currentQuestion || session.status !== "IN_PROGRESS") return Object.freeze({ accepted: false, reason: "NO_ACTIVE_QUESTION", session });
      const submissionId = text(submission.submissionId);
      if (!submissionId || session.answeredSubmissionIds.includes(submissionId)) return Object.freeze({ accepted: false, duplicate: Boolean(submissionId), reason: submissionId ? "DUPLICATE_SUBMISSION" : "MISSING_SUBMISSION_ID", session });
      const evaluation = submission.result ? { result: submission.result, correct: submission.result === "CORRECT" } : evaluateAnswer(session.currentQuestion, answer, options.answerEvaluator);
      const graphState = runtime.recordEvidence(session.graphState, session.currentQuestion, { ...submission, result: evaluation.result, misconceptionTags: evaluation.correct ? [] : submission.misconceptionTags || session.currentQuestion.misconceptionTags || [], finalSubmission: true });
      session = storage.updateSession(session, { graphState, currentQuestion: null, answeredSubmissionIds: [...session.answeredSubmissionIds, submissionId] }, submission.timestamp ?? session.updatedAt);
      const termination = runtime.shouldTerminate(graphState);
      if (termination.terminate) {
        const result = resultLists(session);
        const completedGraph = runtime.completeSession(graphState, termination.reason, submission.timestamp);
        session = storage.updateSession(session, { graphState: completedGraph, status: "COMPLETED", result }, submission.timestamp);
        await persist();
        return Object.freeze({ accepted: true, completed: true, evaluation, result, session });
      }
      const next = selectNext();
      await persist();
      const effectiveNext = session.currentQuestion
        ? Object.freeze({ status: "QUESTION_SELECTED", question: session.currentQuestion, session })
        : next;
      return Object.freeze({ accepted: true, completed: session.status === "COMPLETED", evaluation, next: effectiveNext, session });
    }
    async function pause(timestamp) { if (!session || session.status !== "IN_PROGRESS") return session; session = storage.updateSession(session, { status: "PAUSED" }, timestamp); await persist(); return session; }
    function resume(timestamp) { if (!session || session.status === "COMPLETED") return session; session = storage.updateSession(session, { status: "IN_PROGRESS" }, timestamp); if (!session.currentQuestion) selectNext(); return session; }
    function getSession() { return session; }
    function setCatalog(value) { catalog = value || { byGrade: {} }; }
    return Object.freeze({ start, restore, selectNext, submit, pause, resume, getSession, setCatalog });
  }

  return Object.freeze({ ALLOWED_MESSAGES, evaluateAnswer, renderAnswerInput, readAnswer, renderQuestion, resultLists, renderResult, selectLearningStart, createController });
});
