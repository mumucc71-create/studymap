(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_SPRING_UNIT_UI_FACTORY = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const units = new Map();
  const legacyUnits = Object.freeze([
    { order: 0, title: "제곱근과 실수", mapView: "middle3-sqrt", ui: () => root.STUDY_M3_SQRT_LEARNING_UI },
    { order: 3, title: "이차함수", mapView: "middle3-quadratic", ui: () => root.STUDY_M3_QUADRATIC_LEARNING_UI },
  ]);
  function allUnits() {
    return [...legacyUnits, ...Array.from(units.values())].sort((a, b) => a.order - b.order);
  }
  function deactivateExcept(selected) {
    allUnits().forEach((entry) => { const ui = entry.ui(); if (ui && ui !== selected) ui.deactivate?.(true); });
  }
  function switchUnit(order) {
    const entry = allUnits().find((item) => item.order === Number(order));
    const ui = entry?.ui();
    if (!ui) return false;
    deactivateExcept(ui);
    root.dispatchEvent?.(new CustomEvent("study:m3-unit-selected", { detail: { order: entry.order, mapView: entry.mapView, title: entry.title } }));
    return ui.openMap?.() || false;
  }
  const registry = Object.freeze({ register(entry) { units.set(entry.order, entry); }, allUnits, deactivateExcept, switchUnit, findByConcept(conceptId) { return allUnits().find((entry) => entry.ui()?.isConceptId?.(conceptId)) || null; } });
  if (root) root.STUDY_M3_LEARNING_UNIT_REGISTRY = registry;

  function createUnitUI(config) {
    if (!root?.document) return Object.freeze({ unavailable: true, config });
    const { runtime, model, content, slug, title, mapView, order, publicName } = config;
    if (!runtime || !model || !content) throw new Error(`${slug}: UI dependencies are required`);
    let state = null;
    let hydrationStatus = "IDLE";
    let hydratedUserId = null;
    let remoteRevision = 0;
    let remoteUpdatedAt = null;
    let savePromise = Promise.resolve();
    let actionPromise = Promise.resolve();
    let active = false;
    let submissionInProgress = false;
    const action = (name) => `${slug}-${name}`;
    const defaultActions = Object.freeze({
      "next-concept": action("next-content"), "previous-concept": action("previous-content"), "previous-question": action("previous-problem"),
      "show-hint": action("hint"), "reveal-answer": action("reveal"), "pause-to-map": action("pause"),
      "result-to-map": action("result-map"), "next-stage": action("next-cycle"), "submit-answer": action("submit"),
    });
    const reverseActions = Object.freeze(Object.fromEntries(Object.entries(defaultActions).map(([key, value]) => [value, key])));
    const currentUserId = () => localStorage.getItem("studyCoinCurrentUser") || "guest";
    const localStateKey = (userId = currentUserId()) => `${runtime.LOCAL_STORAGE_KEY}:${userId}`;
    const markerKey = (userId = currentUserId()) => `${runtime.LOCAL_STORAGE_KEY}:surface:${userId}`;
    function currentGrade() {
      try { const users = JSON.parse(localStorage.getItem("studyCoinAuth") || "{}"); return String(users[currentUserId()]?.learningSettings?.grade || ""); } catch (_) { return ""; }
    }
    const isMiddle3Grade = () => /중(?:등)?3|중학교3/.test(currentGrade().replace(/\s+/g, ""));
    function readLocal(userId) { try { return JSON.parse(localStorage.getItem(localStateKey(userId)) || "null"); } catch (_) { return null; } }
    function writeLocal(next) { localStorage.setItem(localStateKey(next.userId), JSON.stringify(runtime.serializeState(next))); }
    const cloudRequired = () => Boolean(currentUserId() !== "guest" && root.STUDY_CLOUD_AUTH?.stateSyncEnabled && typeof root.STUDY_CLOUD_AUTH?.loadUserState === "function" && typeof root.STUDY_CLOUD_AUTH?.saveUserState === "function");
    async function hydrate(force = false) {
      const userId = currentUserId();
      if (!force && state && hydratedUserId === userId && hydrationStatus === "READY") return true;
      hydrationStatus = "LOADING";
      const local = readLocal(userId);
      try {
        if (!cloudRequired()) state = runtime.resolveHydrationState(null, local, userId).state;
        else {
          let remote = await root.STUDY_CLOUD_AUTH.loadUserState(runtime.CLOUD_STATE_KEY);
          if (!remote) {
            const initial = runtime.resolveHydrationState(null, local, userId).state;
            await root.STUDY_CLOUD_AUTH.saveUserState(runtime.CLOUD_STATE_KEY, runtime.serializeState(initial));
            remote = await root.STUDY_CLOUD_AUTH.loadUserState(runtime.CLOUD_STATE_KEY);
          }
          const resolved = runtime.resolveHydrationState(remote, local, userId);
          state = resolved.state;
          remoteRevision = Number(state.revision) || 0;
          remoteUpdatedAt = state.updatedAt || null;
          if (resolved.conflict === "remoteWins") root.dispatchEvent(new CustomEvent(config.eventName, { detail: runtime.describeState(state) }));
        }
        hydratedUserId = userId; hydrationStatus = "READY"; writeLocal(state); return true;
      } catch (error) { hydrationStatus = "FAILED"; console.error(`[${slug}] hydrate failed`, error); return false; }
    }
    async function saveCloud() {
      if (!state || hydrationStatus !== "READY" || !cloudRequired()) return true;
      const remote = await root.STUDY_CLOUD_AUTH.loadUserState(runtime.CLOUD_STATE_KEY);
      const changed = remote?.learningVersion === runtime.VERSION && (Number(remote.revision || 0) > remoteRevision || (Number(remote.revision || 0) === remoteRevision && remote.updatedAt && remote.updatedAt !== remoteUpdatedAt));
      if (changed) {
        state = runtime.resolveHydrationState(remote, state, currentUserId()).state;
        remoteRevision = Number(state.revision) || 0; remoteUpdatedAt = state.updatedAt || null; writeLocal(state);
        root.dispatchEvent(new CustomEvent(config.eventName, { detail: runtime.describeState(state) })); return false;
      }
      const saved = await root.STUDY_CLOUD_AUTH.saveUserState(runtime.CLOUD_STATE_KEY, runtime.serializeState(state));
      if (!saved) throw new Error(`${runtime.SCOPE_ID}_CLOUD_SAVE_FAILED`);
      remoteRevision = Number(state.revision) || 0; remoteUpdatedAt = state.updatedAt || null; return true;
    }
    function persist() { if (!state) return Promise.resolve(false); writeLocal(state); savePromise = savePromise.catch(() => false).then(saveCloud); return savePromise; }
    function showScreen(name) { root.STUDY_NAV?.go ? root.STUDY_NAV.go(name) : document.querySelectorAll("[data-screen]").forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === name)); localStorage.setItem("studyCoinCurrentScreen", name); root.scrollTo?.(0, 0); }
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    function activate() { active = true; localStorage.setItem(markerKey(), "1"); registry.deactivateExcept(api); }
    function deactivate(force = false) { active = false; if (force) localStorage.removeItem(markerKey()); return true; }
    function surfaceActive() { return active; }
    function bindDefaultActions() {
      Object.entries(defaultActions).forEach(([base, scoped]) => document.querySelectorAll(`[data-learning-action="${base}"], [data-learning-action="${scoped}"]`).forEach((el) => { el.dataset.learningAction = scoped; }));
    }
    function progressSummary() {
      const verified = Object.values(state.masteryDepthByConcept || {}).filter((item) => item.verifiedStage === "A5").length;
      return { verified, percent: Math.round((verified / runtime.CONCEPT_IDS.length) * 100) };
    }
    function unitNavigation() {
      const list = registry.allUnits(); const previous = list.find((item) => item.order === order - 1); const next = list.find((item) => item.order === order + 1);
      return `<nav class="learning-unit-navigation" aria-label="중3 수학 단원 이동"><button type="button" data-learning-action="${action("switch-unit")}" data-unit-order="${order - 1}" ${previous ? "" : "disabled"}>이전 단원${previous ? ` · ${esc(previous.title)}` : ""}</button><strong>${order + 1} / 7 · ${esc(title)}</strong><button type="button" data-learning-action="${action("switch-unit")}" data-unit-order="${order + 1}" ${next ? "" : "disabled"}>다음 단원${next ? ` · ${esc(next.title)}` : ""}</button></nav>`;
    }
    function renderMap() {
      if (!state) return;
      bindDefaultActions(); const summary = progressSummary();
      setText("learningMapCourseTitle", `중3 수학 · ${title}`); setText("learningMapHeading", `${title} 학습`);
      setText("learningMapProgress", `${summary.percent}%`); setText("learningMapStatus", "BASIC부터 A5까지 스프링 학습으로 진행해요.");
      setText("learningCompletedStages", `${summary.verified} / ${runtime.CONCEPT_IDS.length} 완료`);
      const bar = document.getElementById("learningMapProgressBar"); if (bar) bar.style.width = `${summary.percent}%`;
      const start = document.getElementById("learningMapStartButton"); if (start) { start.hidden = false; start.textContent = "현재 학습 시작"; start.dataset.learningAction = action("start-recommended"); }
      const map = document.getElementById("learningStageMap"); if (!map) return;
      map.innerHTML = unitNavigation() + runtime.getStageMap(state).map((concept, index) => {
        const stage = runtime.recommendedStageFor(state, concept.conceptId); const mastery = state.masteryDepthByConcept[concept.conceptId];
        const complete = mastery?.verifiedStage === "A5";
        return `<article class="${complete ? "is-complete" : concept.conceptId === state.currentConceptId ? "is-current" : "is-open"}"><i aria-hidden="true"></i><button type="button" data-learning-action="${action("open-stage")}" data-concept-id="${esc(concept.conceptId)}" data-stage="${stage}"><b>${complete ? "✓" : index + 1}</b><span><strong>${esc(concept.title)}</strong><small>${complete ? "A5 확인 완료" : `${stage} 학습 가능`}</small></span><em>›</em></button></article>`;
      }).join("");
    }
    function renderContent() {
      const item = runtime.currentItem(state); const slides = runtime.contentSlides(item.conceptId, item.stage); const slide = slides[state.currentContentSlideIndex] || slides[0];
      if (!slide) return renderQuestion();
      document.getElementById("learningConceptCard").hidden = false; document.getElementById("learningQuestionWrap").hidden = true;
      setText("learningLessonUnit", `중3 수학 · ${title}`); setText("learningLessonTitle", `${item.stage} 개념 학습`);
      setText("learningConceptEyebrow", `${state.currentContentSlideIndex + 1} / ${slides.length}`); setText("learningConceptTitle", slide.title); setText("learningConceptBody", slide.body); setText("learningConceptFormula", slide.formula); setText("learningConceptExample", slide.example);
    }
    function renderAnswerArea(problem, attempt) {
      const area = document.getElementById("learningAnswerArea"); if (!area) return; const finalized = Boolean(attempt); const draft = runtime.getDraftAnswer(state, problem.problemId);
      if (problem.answerType === "MULTIPLE_CHOICE") area.innerHTML = (problem.choices || []).map((choice) => `<button type="button" class="learning-choice ${String(draft) === String(choice) ? "is-selected" : ""}" data-learning-action="${action("select-choice")}" data-answer="${esc(choice)}" ${finalized ? "disabled" : ""}>${esc(choice)}</button>`).join("");
      else if (problem.answerType === "STEP_ORDER") {
        const chosen = Array.isArray(draft) ? draft : []; const steps = problem.correctAnswer || problem.expectedAnswer || [];
        area.innerHTML = `<div class="learning-step-answer"><div>${chosen.map((step) => `<button type="button" data-learning-action="${action("remove-step")}" data-step="${esc(step)}" ${finalized ? "disabled" : ""}>${esc(step)}</button>`).join(" ") || "풀이 단계를 순서대로 선택하세요."}</div>${steps.filter((step) => !chosen.includes(step)).map((step) => `<button type="button" data-learning-action="${action("add-step")}" data-step="${esc(step)}" ${finalized ? "disabled" : ""}>${esc(step)}</button>`).join(" ")}</div>`;
      } else {
        const tag = problem.answerType === "WRITTEN_RESPONSE" ? "textarea" : "input"; const close = tag === "textarea" ? `>${esc(draft || "")}</textarea>` : ` value="${esc(draft || "")}" />`;
        area.innerHTML = `<${tag} id="${slug}LearningAnswer" class="learning-expression-input" ${finalized ? "disabled" : ""} placeholder="${problem.answerType === "WRITTEN_RESPONSE" ? "풀이 근거를 문장으로 작성하세요." : "답을 입력하세요."}"${tag === "textarea" ? "" : " type=\"text\""}${close}`;
      }
    }
    function renderQuestion() {
      const problem = runtime.currentProblem(state); if (!problem) return;
      document.getElementById("learningConceptCard").hidden = true; document.getElementById("learningQuestionWrap").hidden = false;
      const item = runtime.currentItem(state); const attempt = runtime.getFinalizedAttempt(state, problem.problemId); const feedback = runtime.getFeedback(state);
      setText("learningLessonUnit", `중3 수학 · ${title}`); setText("learningLessonTitle", `${problem.conceptTitle || problem.conceptId} · ${problem.stage}`);
      setText("learningQuestionNumber", `${state.currentProblemIndex + 1} / ${state.cycleItems.length}`); setText("learningQuestionDifficulty", problem.stage); setText("learningQuestionConcept", problem.conceptTitle || problem.conceptId); setText("learningQuestionText", problem.questionText || problem.prompt);
      const percent = Math.round(((state.currentProblemIndex + (attempt ? 1 : 0)) / Math.max(1, state.cycleItems.length)) * 100); setText("learningLessonProgressText", `${percent}%`); const bar = document.getElementById("learningLessonProgressBar"); if (bar) bar.style.width = `${percent}%`;
      renderAnswerArea(problem, attempt); const feedbackBox = document.getElementById("learningFeedback"); if (feedbackBox) { feedbackBox.hidden = !feedback; if (feedback) { setText("learningFeedbackTitle", feedback.title || (feedback.type === "CORRECT" ? "정답입니다" : "다시 확인해 보세요")); setText("learningFeedbackText", feedback.text || ""); } }
      const hint = document.querySelector(`[data-learning-action="${action("hint")}"]`); if (hint) hint.disabled = Boolean(attempt) || (item.purpose === runtime.PURPOSES.INDEPENDENT_CHECK);
      const reveal = document.querySelector(`[data-learning-action="${action("reveal")}"]`); if (reveal) reveal.disabled = !attempt && runtime.getHintCount(state, problem.problemId) === 0;
      const submit = document.getElementById("learningSubmitButton"); if (submit) submit.textContent = attempt ? (state.currentProblemIndex === state.cycleItems.length - 1 ? "결과 보기" : "다음 문제") : "정답 확인";
    }
    function renderLesson() { bindDefaultActions(); showScreen("learning-lesson"); runtime.shouldShowContent(state) ? renderContent() : renderQuestion(); }
    function renderResult() { bindDefaultActions(); const history = state.cycleHistory.at(-1) || {}; setText("learningResultStageTitle", `${title} 스프링 사이클`); setText("learningResultTitle", "이번 학습을 완료했어요!"); setText("learningResultMessage", "진도와 심화도가 단원별로 저장되었습니다."); setText("learningResultCorrect", `${history.correctCount || 0} / ${history.totalCount || state.cycleItems.length}`); setText("learningResultAccuracy", `${history.accuracy || 0}%`); setText("learningResultWeak", state.currentConceptId); setText("learningResultRecommendation", "다음 스프링 사이클에서 새 개념과 심화를 이어갑니다."); showScreen("learning-stage-result"); }
    async function applyState(next) { state = next; writeLocal(state); await persist(); return state; }
    async function openMap(options = {}) { activate(); if (!await hydrate(Boolean(options.forceHydrate))) return false; if (state.cycleStatus === "ACTIVE") state = runtime.pauseCycle(state); renderMap(); showScreen("learning-map"); return true; }
    async function startDirect(conceptId, stage = "BASIC") { activate(); if (!await hydrate()) return false; state = runtime.startCycle(state, { resume: false, conceptId, stage }); await applyState(state); renderLesson(); return true; }
    async function startRecommended() { activate(); if (!await hydrate()) return false; state = runtime.startCycle(state, { resume: false }); await applyState(state); renderLesson(); return true; }
    async function startFromRecommendation(rec) { return startDirect(rec.conceptId, rec.recoveryStage || rec.recommendedStage || rec.savedCurrentStage || "BASIC"); }
    function dispatchGraphFinal(problem, result, fallbackResult) {
      if (!problem || (!result?.finalized && !result?.revealed) || typeof root.CustomEvent !== "function") return;
      const attempt = runtime.getFinalizedAttempt(result.state, problem.problemId);
      root.dispatchEvent(new root.CustomEvent("study:math-concept-final", { detail: {
        conceptId: problem.conceptId, problemId: problem.problemId,
        structureSignature: problem.structureSignature, solutionPathSignature: problem.solutionPathSignature,
        stage: problem.stage, result: result.result?.status || fallbackResult,
        misconceptionTags: problem.misconceptionTags || [], independentCheck: problem.independentCheck === true,
        finalSubmission: true, submissionId: result.submissionId || attempt?.submissionId,
        timestamp: attempt?.finalizedAt || Date.now(),
      } }));
    }
    async function submit() {
      if (submissionInProgress) return false; const problem = runtime.currentProblem(state); const attempt = runtime.getFinalizedAttempt(state, problem.problemId);
      if (attempt) { state = runtime.advance(state); await applyState(state); if (state.cycleStatus === "COMPLETED") renderResult(); else renderLesson(); return true; }
      const draft = runtime.getDraftAnswer(state, problem.problemId); if (!(Array.isArray(draft) ? draft.length : String(draft ?? "").trim())) return false;
      submissionInProgress = true; try { const result = runtime.submitAnswer(state, draft); if (!result.accepted) return false; await applyState(result.state); dispatchGraphFinal(problem, result, "CORRECT"); renderQuestion(); return true; } finally { submissionInProgress = false; }
    }
    async function handleAction(target) {
      const requested = target?.dataset?.learningAction; const scoped = requested?.startsWith(`${slug}-`) ? requested : defaultActions[requested]; if (!scoped) return false;
      if (!state && !await hydrate()) return false;
      if (scoped === action("start-recommended")) return startRecommended();
      if (scoped === action("open-stage")) return startDirect(target.dataset.conceptId, target.dataset.stage);
      if (scoped === action("switch-unit")) return registry.switchUnit(Number(target.dataset.unitOrder));
      if (scoped === action("select-choice")) state = runtime.setDraftAnswer(state, runtime.currentProblem(state).problemId, target.dataset.answer);
      else if (scoped === action("add-step")) { const problem = runtime.currentProblem(state); const draft = runtime.getDraftAnswer(state, problem.problemId); state = runtime.setDraftAnswer(state, problem.problemId, [...(Array.isArray(draft) ? draft : []), target.dataset.step]); }
      else if (scoped === action("remove-step")) { const problem = runtime.currentProblem(state); const draft = [...(Array.isArray(runtime.getDraftAnswer(state, problem.problemId)) ? runtime.getDraftAnswer(state, problem.problemId) : [])]; const index = draft.indexOf(target.dataset.step); if (index >= 0) draft.splice(index, 1); state = runtime.setDraftAnswer(state, problem.problemId, draft); }
      else if (scoped === action("next-content")) { const item = runtime.currentItem(state); const slides = runtime.contentSlides(item.conceptId, item.stage); if (state.currentContentSlideIndex < slides.length - 1) state.currentContentSlideIndex += 1; else { state = runtime.markContentViewed(state, item.conceptId, item.stage); state.currentContentSlideIndex = 0; } }
      else if (scoped === action("previous-content")) state.currentContentSlideIndex = Math.max(0, state.currentContentSlideIndex - 1);
      else if (scoped === action("submit")) return submit();
      else if (scoped === action("hint")) state = runtime.useHint(state).state;
      else if (scoped === action("reveal")) { const problem = runtime.currentProblem(state); const result = runtime.revealSolution(state); if (result.revealed) { state = result.state; dispatchGraphFinal(problem, result, "GIVEUP"); } }
      else if (scoped === action("previous-problem")) state = runtime.previous(state);
      else if (scoped === action("pause") || scoped === action("result-map")) return openMap();
      else if (scoped === action("next-cycle")) return startRecommended();
      await applyState(state); runtime.shouldShowContent(state) ? renderContent() : renderQuestion(); return true;
    }
    document.addEventListener("click", (event) => { const target = event.target.closest?.("[data-learning-action]"); const requested = target?.dataset?.learningAction; if (!target || !active || (!String(requested).startsWith(`${slug}-`) && !defaultActions[requested])) return; event.preventDefault(); event.stopImmediatePropagation(); actionPromise = actionPromise.catch(() => false).then(() => handleAction(target)); }, true);
    document.addEventListener("input", (event) => { if (!active || event.target?.id !== `${slug}LearningAnswer` || !state) return; const problem = runtime.currentProblem(state); if (!problem || runtime.getFinalizedAttempt(state, problem.problemId)) return; state = runtime.setDraftAnswer(state, problem.problemId, event.target.value); writeLocal(state); });
    root.addEventListener("beforeunload", () => { if (state) writeLocal(state); });
    root.addEventListener("study:user-changed", () => { deactivate(true); state = null; hydrationStatus = "IDLE"; hydratedUserId = null; remoteRevision = 0; remoteUpdatedAt = null; });
    root.addEventListener(config.eventName, () => { if (active) document.querySelector('[data-screen="learning-lesson"]')?.classList.contains("active") ? renderLesson() : renderMap(); });
    const api = Object.freeze({ isMiddle3Grade, isActive: surfaceActive, handlesAction: (name) => String(name || "").startsWith(`${slug}-`) || Boolean(defaultActions[name]), isConceptId: (conceptId) => runtime.CONCEPT_IDS.includes(conceptId), deactivate, hydrate, openMap, renderMap, startRecommended, startDirect, startFromRecommendation, handleAction, getState: () => runtime.serializeState(state || runtime.createDefaultState(currentUserId())), getHydrationStatus: () => hydrationStatus, getStorageKey: () => localStateKey(), flush: () => savePromise, config: Object.freeze({ title, mapView, order, scopeId: runtime.SCOPE_ID }) });
    root[publicName] = api; registry.register({ order, title, mapView, ui: () => api }); return api;
  }

  return Object.freeze({ VERSION: "middle3SpringUnitUIFactoryV1", registry, createUnitUI });
});
