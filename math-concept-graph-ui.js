(function (root, factory) {
  const graph = typeof module === "object" && module.exports
    ? require("./math-concept-graph-data.js") : root.STUDY_MATH_CONCEPT_GRAPH;
  const runtime = typeof module === "object" && module.exports
    ? require("./math-concept-graph-runtime.js") : root.STUDY_MATH_CONCEPT_GRAPH_RUNTIME;
  const mapper = typeof module === "object" && module.exports
    ? require("./math-level-test-concept-mapper.js") : root.STUDY_MATH_LEVEL_TEST_CONCEPT_MAPPER;
  const storageApi = typeof module === "object" && module.exports
    ? require("./math-concept-graph-storage.js") : root.STUDY_MATH_CONCEPT_GRAPH_STORAGE;
  const api = factory(graph, runtime, mapper, storageApi, root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_CONCEPT_GRAPH_UI = api;
})(typeof window !== "undefined" ? window : globalThis, function (graph, runtime, mapper, storageApi, root) {
  "use strict";

  if (!graph || !runtime || !mapper || !storageApi) throw new Error("MATH_CONCEPT_GRAPH_UI_DEPENDENCY_MISSING");
  const LABELS = Object.freeze({
    current: "현재 학습", review: "먼저 복습할 개념", foundation: "기초 보충",
    next: "다음 도전", returnTo: "원래 학습으로 돌아가기",
  });
  const displayName = (conceptId) => graph.conceptById[conceptId]?.displayName || null;

  function recommendationFor(state) {
    const last = state?.lastDecision?.decision;
    if (last === "DESCEND") return "START_REMEDIAL";
    if (last === "RETURN") return "RETURN_TO_ORIGINAL";
    if (last === "MAXIMUM_REACHED") return "MAXIMUM_REACHED";
    if (last === "PROMOTION_BLOCKED" || last === "BLOCKED_NO_CONTENT") return "BLOCKED_NO_CONTENT";
    if (state?.recoveryStack?.length) return "START_REMEDIAL";
    if (state?.pendingRemedialConceptIds?.length) return "REVIEW_PREREQUISITE";
    const promotion = state?.activeConceptId ? runtime.selectPromotionConcept(state) : null;
    if (promotion?.decision === "PROMOTE") return "PROMOTE_TO_NEXT";
    if (state?.masteryByConcept?.[state.activeConceptId]?.status === "ENTRY_CHECK") return "ENTRY_CHECK";
    return "CONTINUE_CURRENT";
  }

  function buildStudentViewModel(state, initialSelection = null) {
    const activeId = state?.activeConceptId || initialSelection?.activeConceptId || null;
    const frame = state?.recoveryStack?.at?.(-1) || null;
    const pendingId = state?.pendingRemedialConceptIds?.[0] || initialSelection?.reviewConceptId || null;
    const promotion = activeId ? runtime.selectPromotionConcept(state) : null;
    const nextId = promotion?.decision === "PROMOTE" ? promotion.toConceptId : initialSelection?.nextConceptId || null;
    const activeNode = graph.conceptById[activeId];
    const unavailable = activeNode && (activeNode.contentAvailability !== "COMPLETE_SPRING" || activeNode.runtimeAvailability !== "DEDICATED_SPRING");
    return Object.freeze({
      recommendationType: recommendationFor(state),
      items: Object.freeze([
        { key: "current", label: LABELS.current, value: displayName(activeId) },
        { key: "review", label: LABELS.review, value: displayName(pendingId) },
        { key: "foundation", label: LABELS.foundation, value: displayName(frame?.enteredRemedialConceptId || initialSelection?.foundationConceptId) },
        { key: "next", label: LABELS.next, value: displayName(nextId) },
        { key: "returnTo", label: LABELS.returnTo, value: displayName(frame?.conceptId) },
      ]),
      notice: unavailable ? "준비 중인 개념입니다. 현재 가능한 가장 가까운 학습으로 안내합니다." : null,
    });
  }

  function renderStudentStatus(container, state, initialSelection = null) {
    if (!container || !container.ownerDocument) return buildStudentViewModel(state, initialSelection);
    const view = buildStudentViewModel(state, initialSelection);
    container.replaceChildren();
    const list = container.ownerDocument.createElement("dl");
    list.className = "math-concept-status-list";
    view.items.filter((item) => item.value).forEach((item) => {
      const row = container.ownerDocument.createElement("div");
      row.className = `math-concept-status-row math-concept-status-${item.key}`;
      const term = container.ownerDocument.createElement("dt");
      const value = container.ownerDocument.createElement("dd");
      term.textContent = item.label;
      value.textContent = item.value;
      row.append(term, value);
      list.append(row);
    });
    container.append(list);
    if (view.notice) {
      const notice = container.ownerDocument.createElement("p");
      notice.className = "math-concept-status-notice";
      notice.textContent = view.notice;
      container.append(notice);
    }
    container.hidden = false;
    return view;
  }

  function normalizeFinalResult(detail = {}) {
    const value = detail.result?.status || detail.result || detail.status;
    if (value === "CORRECT") return "CORRECT";
    if (value === "REVIEW_REQUIRED") return "REVIEW_REQUIRED";
    if (value === "GIVEUP" || value === "SOLUTION_VIEWED") return "GIVEUP";
    return "INCORRECT";
  }

  function applyFinalSubmission(state, detail = {}) {
    if (!detail.finalSubmission || !detail.conceptId) return state;
    let next = runtime.recordEvidence(state, {
      conceptId: detail.conceptId, problemId: detail.problemId,
      structureSignature: detail.structureSignature, solutionPathSignature: detail.solutionPathSignature,
      stage: detail.stage, result: normalizeFinalResult(detail), misconceptionTags: detail.misconceptionTags || [],
      independentCheck: detail.independentCheck === true, finalSubmission: true,
      returnCheckpointPassed: detail.returnCheckpointPassed === true,
      submissionId: detail.submissionId, timestamp: detail.timestamp,
    });
    if (next === state) return state;
    if (next.recoveryStack.length) {
      const completion = runtime.evaluateRemediationCompletion(next);
      if (completion.decision === "REMEDIATION_COMPLETE") next = runtime.returnToCheckpoint(next, completion, { timestamp: detail.timestamp });
      return next;
    }
    const remedial = runtime.selectRemedialConcept(next, detail.conceptId);
    if (remedial.decision === "DESCEND") return runtime.beginRemediation(next, remedial, { timestamp: detail.timestamp });
    return next;
  }

  function createController(options = {}) {
    const storage = options.storage || storageApi.createGraphStorage({
      userIdProvider: () => root?.localStorage?.getItem?.("studyCoinCurrentUser") || "guest",
      ...(options.storageOptions || {}),
    });
    let state = runtime.createInitialGraphState({ timestamp: options.timestamp ?? 0 });
    let lastInitialSelection = null;
    let hydrationPromise = Promise.resolve(state);

    function render() {
      if (!root?.document) return;
      ["mathConceptGraphLearningStatus", "mathConceptGraphResult"].forEach((id) => {
        const container = root.document.getElementById(id);
        if (container) renderStudentStatus(container, state, lastInitialSelection);
      });
    }

    async function hydrate() {
      state = await storage.hydrate();
      render();
      return state;
    }

    async function recordFinal(detail) {
      const previousRevision = state.revision;
      const next = applyFinalSubmission(state, detail);
      if (next === state) return state;
      state = next;
      await storage.save(state, { expectedRevision: previousRevision });
      render();
      if (typeof root?.CustomEvent === "function") root.dispatchEvent(new root.CustomEvent("study:math-concept-graph-updated", { detail: { state } }));
      return state;
    }

    async function ingestLevelTest(results = [], optionsForTest = {}) {
      const evidence = mapper.mergeLevelTestEvidence([], results.flatMap((result) => mapper.convertLevelTestResultToEvidence(result, optionsForTest)));
      const mastery = mapper.calculateInitialConceptMastery(evidence);
      lastInitialSelection = mapper.selectInitialLearningConcept(evidence, { masteryByConcept: mastery, selectedGrade: optionsForTest.selectedGrade });
      let next = runtime.createInitialGraphState({ activeConceptId: lastInitialSelection.activeConceptId, timestamp: optionsForTest.timestamp ?? 0 });
      evidence.forEach((item) => {
        if (!item.conceptId) return;
        next = runtime.recordEvidence(next, item);
      });
      state = next;
      await storage.save(state);
      render();
      return { state, evidence, mastery, selection: lastInitialSelection };
    }

    function start() {
      hydrationPromise = hydrate();
      root?.addEventListener?.("study:math-concept-final", (event) => { void hydrationPromise.then(() => recordFinal(event.detail || {})); });
      root?.addEventListener?.("study:math-level-test-completed", (event) => {
        const detail = event.detail || {};
        void hydrationPromise.then(() => ingestLevelTest(detail.results || [], detail));
      });
      root?.addEventListener?.("study:user-changed", () => { hydrationPromise = hydrate(); });
      return hydrationPromise;
    }

    return Object.freeze({ start, hydrate, recordFinal, ingestLevelTest, render, getState: () => state, getInitialSelection: () => lastInitialSelection, storage });
  }

  let defaultController = null;
  function startDefaultController(options = {}) {
    if (!defaultController) defaultController = createController(options);
    return defaultController.start();
  }

  const api = { LABELS, recommendationFor, buildStudentViewModel, renderStudentStatus, applyFinalSubmission, createController, startDefaultController,
    getState: () => defaultController?.getState?.() || null };
  if (root?.document) {
    const begin = () => { void startDefaultController(); };
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", begin, { once: true });
    else begin();
  }
  return Object.freeze(api);
});
