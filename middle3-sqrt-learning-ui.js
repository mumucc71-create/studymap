(function () {
  "use strict";

  const runtime = window.STUDY_M3_SQRT_LEARNING_RUNTIME;
  const model = window.STUDY_MIDDLE3_SQRT_LEARNING_MODEL;
  const content = window.STUDY_M3_SQRT_LEARNING_CONTENT;
  if (!runtime || !model || !content) return;

  const statusLabels = {
    NOT_STARTED: "미학습",
    AVAILABLE: "학습 가능",
    RECOMMENDED: "현재 추천",
    IN_PROGRESS: "학습 중",
    LEARNING_COMPLETED: "학습 완료",
    INDEPENDENT_CHECK_PENDING: "독립 확인 대기",
    VERIFIED: "독립 확인 완료",
  };
  const purposeLabels = {
    LEARNING: "새 학습",
    PREVIEW: "미리 보기",
    REVIEW: "복습",
    INDEPENDENT_CHECK: "독립 확인",
    RE_PRACTICE: "다른 구조 재연습",
  };
  let state = null;
  let hydrationStatus = "IDLE";
  let hydratedUserId = null;
  let remoteRevision = 0;
  let remoteUpdatedAt = null;
  let savePromise = Promise.resolve();
  let actionPromise = Promise.resolve();
  let userRestorePromise = null;
  let pendingUserRestoreId = null;
  let userRestoreGeneration = 0;
  let submissionInProgress = false;
  let active = false;
  let draftSaveTimer = null;

  const defaultActions = Object.freeze({
    "sqrt-next-content": "next-concept",
    "sqrt-previous-content": "previous-concept",
    "sqrt-previous-problem": "previous-question",
    "sqrt-hint": "show-hint",
    "sqrt-reveal": "reveal-answer",
    "sqrt-pause": "pause-to-map",
    "sqrt-result-map": "result-to-map",
    "sqrt-next-cycle": "next-stage",
    "sqrt-submit": "submit-answer",
  });
  const sqrtActionsByDefault = Object.freeze(Object.fromEntries(
    Object.entries(defaultActions).map(([sqrtAction, defaultAction]) => [defaultAction, sqrtAction])
  ));

  function actionElement(defaultAction, sqrtAction) {
    return document.querySelector(
      `[data-learning-action="${defaultAction}"], [data-learning-action="${sqrtAction}"]`
    );
  }

  function actionElements(defaultAction, sqrtAction) {
    return document.querySelectorAll(
      `[data-learning-action="${defaultAction}"], [data-learning-action="${sqrtAction}"]`
    );
  }

  function restoreDefaultActions() {
    Object.entries(defaultActions).forEach(([sqrtAction, defaultAction]) => {
      document.querySelectorAll(
        `[data-learning-action="${sqrtAction}"], [data-learning-action="${defaultAction}"]`
      ).forEach((element) => {
        element.dataset.learningAction = defaultAction;
        element.onclick = null;
      });
    });
  }

  function bindSqrtAction(element, action) {
    if (!element) return;
    element.dataset.learningAction = action;
    element.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      handleAction(element);
    };
  }

  function sqrtDomSurfaceActive() {
    const lessonActive = document.querySelector('[data-screen="learning-lesson"]')?.classList.contains("active")
      && document.getElementById("learningLessonUnit")?.textContent === "중3 수학 · 제곱근과 실수";
    const mapActive = document.querySelector('[data-screen="learning-map"]')?.classList.contains("active")
      && document.getElementById("learningMapCourseTitle")?.textContent === "중3 수학 · 제곱근과 실수";
    const resultActive = document.querySelector('[data-screen="learning-stage-result"]')?.classList.contains("active")
      && document.getElementById("learningResultStageTitle")?.textContent?.includes("제곱근과 실수 스프링 사이클");
    return Boolean(lessonActive || mapActive || resultActive);
  }

  function sqrtSurfaceActive() {
    return active || sqrtDomSurfaceActive();
  }

  function deactivate(force = false) {
    if (!force && sqrtDomSurfaceActive()) return false;
    active = false;
    restoreDefaultActions();
    if (force) localStorage.removeItem(surfaceMarkerKey());
    return true;
  }

  function currentUserId() {
    return localStorage.getItem("studyCoinCurrentUser") || "guest";
  }

  function currentGrade() {
    try {
      const userId = currentUserId();
      const users = JSON.parse(localStorage.getItem("studyCoinAuth") || "{}");
      return String(users[userId]?.learningSettings?.grade || "");
    } catch (_) {
      return "";
    }
  }

  function isMiddle3Grade() {
    const grade = currentGrade().replace(/\s+/g, "");
    return /중(?:등)?3|중학교3/.test(grade);
  }

  function localStateKey(userId = currentUserId()) {
    return `studyCoinMiddle3SqrtLearningV1:${userId}`;
  }

  function surfaceMarkerKey(userId = currentUserId()) {
    return `studyCoinMiddle3SqrtSurfaceV1:${userId}`;
  }

  function readLocal(userId) {
    try {
      return JSON.parse(localStorage.getItem(localStateKey(userId)) || "null");
    } catch (_) {
      return null;
    }
  }

  function writeLocal(nextState) {
    localStorage.setItem(localStateKey(nextState.userId), JSON.stringify(runtime.serializeState(nextState)));
  }

  function cloudRequired() {
    return Boolean(
      currentUserId() !== "guest"
      && window.STUDY_CLOUD_AUTH?.stateSyncEnabled
      && typeof window.STUDY_CLOUD_AUTH?.loadUserState === "function"
      && typeof window.STUDY_CLOUD_AUTH?.saveUserState === "function"
    );
  }

  async function hydrate(force = false) {
    const userId = currentUserId();
    if (!force && hydratedUserId === userId && hydrationStatus === "READY" && state) return true;
    hydrationStatus = "LOADING";
    const local = readLocal(userId);
    if (!cloudRequired()) {
      const resolved = runtime.resolveHydrationState(null, local, userId);
      state = resolved.state;
      hydratedUserId = userId;
      hydrationStatus = "READY";
      writeLocal(state);
      return true;
    }
    try {
      let remote = await window.STUDY_CLOUD_AUTH.loadUserState(runtime.CLOUD_STATE_KEY);
      if (!remote) {
        const initial = runtime.resolveHydrationState(null, local, userId).state;
        await window.STUDY_CLOUD_AUTH.saveUserState(runtime.CLOUD_STATE_KEY, runtime.serializeState(initial));
        remote = await window.STUDY_CLOUD_AUTH.loadUserState(runtime.CLOUD_STATE_KEY);
      }
      const resolved = runtime.resolveHydrationState(remote, local, userId);
      state = resolved.state;
      remoteRevision = Number(state.revision) || 0;
      remoteUpdatedAt = state.updatedAt || null;
      hydratedUserId = userId;
      hydrationStatus = "READY";
      writeLocal(state);
      if (resolved.conflict === "remoteWins") {
        window.dispatchEvent(new CustomEvent("study:m3-sqrt-remote-wins", {
          detail: runtime.describeState(state),
        }));
      }
      return true;
    } catch (error) {
      hydrationStatus = "FAILED";
      console.error("[m3-sqrt-learning] hydrate failed", error);
      return false;
    }
  }

  async function saveCloud() {
    if (!state || hydrationStatus !== "READY" || !cloudRequired()) return true;
    const cloud = window.STUDY_CLOUD_AUTH;
    const remote = await cloud.loadUserState(runtime.CLOUD_STATE_KEY);
    const nextRevision = Number(state.revision) || 0;
    const remoteStateRevision = Number(remote?.revision) || 0;
    const remoteChanged = remote?.learningVersion === runtime.VERSION && (
      remoteStateRevision > remoteRevision
      || (remoteStateRevision === remoteRevision && remote?.updatedAt && remote.updatedAt !== remoteUpdatedAt)
    );
    if (remoteChanged) {
      state = runtime.resolveHydrationState(remote, state, currentUserId()).state;
      remoteRevision = remoteStateRevision;
      remoteUpdatedAt = state.updatedAt || null;
      writeLocal(state);
      window.dispatchEvent(new CustomEvent("study:m3-sqrt-remote-wins", {
        detail: runtime.describeState(state),
      }));
      return false;
    }
    const saved = await cloud.saveUserState(runtime.CLOUD_STATE_KEY, runtime.serializeState(state));
    if (!saved) throw new Error("M3_SQRT_CLOUD_SAVE_FAILED");
    remoteRevision = nextRevision;
    remoteUpdatedAt = state.updatedAt || null;
    return true;
  }

  function persist() {
    if (!state) return Promise.resolve(false);
    writeLocal(state);
    savePromise = savePromise
      .catch(() => false)
      .then(() => saveCloud())
      .catch((error) => {
        console.error("[m3-sqrt-learning] save failed", error);
        return false;
      });
    return savePromise;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showScreen(name) {
    if (window.STUDY_NAV?.go) window.STUDY_NAV.go(name);
    else {
      document.querySelectorAll("[data-screen]").forEach((screen) => {
        screen.classList.toggle("active", screen.dataset.screen === name);
      });
    }
    localStorage.setItem("studyCoinCurrentScreen", name);
    localStorage.setItem(surfaceMarkerKey(), "1");
    window.scrollTo?.(0, 0);
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function stageDisplayStatus(conceptId, stage) {
    const saved = runtime.stageStatus(state, conceptId, stage);
    const mastery = state.masteryDepthByConcept[conceptId];
    const active = runtime.currentItem(state);
    if (active?.conceptId === conceptId && active.stage === stage && ["ACTIVE", "PAUSED"].includes(state.cycleStatus)) {
      return "IN_PROGRESS";
    }
    if (saved !== "NOT_STARTED") return saved;
    if (mastery.recommendedStage === stage) return "RECOMMENDED";
    const completedIndex = runtime.STAGES.indexOf(mastery.learningCompletedStage);
    if (runtime.STAGES.indexOf(stage) <= Math.max(0, completedIndex + 1)) return "AVAILABLE";
    return "NOT_STARTED";
  }

  function renderMap() {
    if (!state) return false;
    active = true;
    const map = document.getElementById("learningStageMap");
    if (!map) return false;
    const current = runtime.currentItem(state);
    const completedCount = Object.values(state.masteryDepthByConcept)
      .reduce((sum, mastery) => sum + runtime.STAGES.filter((stage) => (
        ["LEARNING_COMPLETED", "INDEPENDENT_CHECK_PENDING", "VERIFIED"].includes(mastery.stageStatus[stage])
      )).length, 0);
    const verifiedCount = Object.values(state.masteryDepthByConcept)
      .reduce((sum, mastery) => sum + runtime.STAGES.filter((stage) => mastery.stageStatus[stage] === "VERIFIED").length, 0);
    const stageTotal = runtime.CONCEPT_IDS.length * runtime.STAGES.length * 2;
    const percent = Math.round(((completedCount + verifiedCount) / stageTotal) * 100);
    const summaryLabel = document.querySelector(".math-roadmap-summary > div > span");
    if (summaryLabel) summaryLabel.textContent = "현재 학습";
    setText("learningMapCourseTitle", "중3 수학 · 제곱근과 실수");
    setText("learningMapHeading", "제곱근과 실수 학습지도");
    setText("learningMapStatus", current
      ? `${content.CONTENT[current.conceptId]?.[current.stage]?.conceptTitle || "제곱근과 실수"} · ${current.stage} · ${purposeLabels[current.purpose]}`
      : "추천 학습을 시작해 보세요.");
    setText("learningMapProgress", `${percent}%`);
    const bar = document.getElementById("learningMapProgressBar");
    if (bar) bar.style.width = `${percent}%`;
    setText("learningCompletedStages", `학습 ${completedCount} · 독립 확인 ${verifiedCount}`);
    const startButton = document.getElementById("learningMapStartButton");
    if (startButton) {
      startButton.hidden = false;
      startButton.textContent = ["ACTIVE", "PAUSED"].includes(state.cycleStatus)
        ? "추천 학습 계속하기"
        : "추천 학습 시작";
      bindSqrtAction(startButton, "sqrt-start-recommended");
    }
    map.className = "math-large-number-study";
    map.innerHTML = runtime.getStageMap(state).map((concept) => `
      <article class="math-large-number-card">
        <span>${concept.order}. 중3 제곱근과 실수</span>
        <h2>${escapeHtml(concept.title)}</h2>
        <div class="learning-answer-area">
          ${concept.stages.map((stage) => {
            const displayStatus = stageDisplayStatus(concept.conceptId, stage.stage);
            const viewed = stage.viewed && !stage.completed ? " · 열어봄" : "";
            return `<button type="button" class="learning-choice ${displayStatus === "IN_PROGRESS" ? "is-selected" : displayStatus === "VERIFIED" ? "is-correct" : ""}" data-learning-action="sqrt-open-stage" data-concept-id="${escapeHtml(concept.conceptId)}" data-stage="${stage.stage}">
              <i>${stage.stage}</i><span>${statusLabels[displayStatus]}${viewed}</span>
            </button>`;
          }).join("")}
        </div>
      </article>
    `).join("");
    return true;
  }

  function deterministicSteps(problem) {
    const steps = [...(problem.correctAnswer || [])];
    return steps
      .map((step, index) => ({ step, key: `${problem.problemId}:${index}` }))
      .sort((left, right) => right.key.localeCompare(left.key))
      .map((item) => item.step);
  }

  function renderAnswerArea(problem, attempt) {
    const area = document.getElementById("learningAnswerArea");
    if (!area) return;
    const draft = runtime.getDraftAnswer(state, problem.problemId);
    const locked = attempt?.attemptStatus === "FINAL";
    if (problem.answerType === "MULTIPLE_CHOICE") {
      area.innerHTML = problem.choices.map((choice, index) => `
        <button class="learning-choice ${draft === choice ? "is-selected" : ""}" type="button" data-learning-action="sqrt-select-choice" data-answer="${escapeHtml(choice)}" ${locked ? "disabled" : ""}>
          <i>${index + 1}</i><span>${escapeHtml(choice)}</span>
        </button>
      `).join("");
      return;
    }
    if (problem.answerType === "STEP_ORDER") {
      const selected = Array.isArray(draft) ? draft : [];
      const available = deterministicSteps(problem).filter((step) => !selected.includes(step));
      area.innerHTML = `
        <div>
          ${selected.map((step, index) => `<button class="learning-choice is-selected" type="button" data-learning-action="sqrt-remove-step" data-step="${escapeHtml(step)}" ${locked ? "disabled" : ""}><i>${index + 1}</i><span>${escapeHtml(step)}</span></button>`).join("")}
        </div>
        <div>
          ${available.map((step) => `<button class="learning-choice" type="button" data-learning-action="sqrt-add-step" data-step="${escapeHtml(step)}" ${locked ? "disabled" : ""}><i>+</i><span>${escapeHtml(step)}</span></button>`).join("")}
        </div>`;
      return;
    }
    if (problem.answerType === "WRITTEN_RESPONSE") {
      area.innerHTML = `<textarea class="learning-text-answer" id="sqrtLearningAnswer" rows="7" placeholder="주장, 관계식, 계산, 결론을 순서대로 작성하세요." ${locked ? "disabled" : ""}>${escapeHtml(draft || "")}</textarea>`;
      return;
    }
    area.innerHTML = `<input class="learning-text-answer" id="sqrtLearningAnswer" type="text" inputmode="text" autocomplete="off" placeholder="${problem.answerType === "EXPRESSION_INPUT" ? "동치인 수식도 정답으로 인정됩니다." : "정답을 입력하세요."}" value="${escapeHtml(draft || "")}" ${locked ? "disabled" : ""} />`;
  }

  function renderFeedback(problem) {
    const feedback = document.getElementById("learningFeedback");
    const saved = runtime.getFeedback(state, problem.problemId);
    if (!feedback || !saved) {
      if (feedback) feedback.hidden = true;
      return;
    }
    feedback.hidden = false;
    feedback.classList.toggle("is-wrong", ["INCORRECT", "SOLUTION_VIEWED"].includes(saved.type));
    setText("learningFeedbackTitle", saved.title);
    setText("learningFeedbackText", saved.text);
  }

  function renderContent() {
    active = true;
    const item = runtime.currentItem(state);
    const slides = runtime.contentSlides(item.conceptId, item.stage);
    const index = Math.max(0, Math.min(Number(state.currentContentSlideIndex) || 0, slides.length - 1));
    const slide = slides[index];
    document.getElementById("learningConceptCard").hidden = false;
    document.getElementById("learningQuestionWrap").hidden = true;
    setText("learningConceptEyebrow", `학습 설명 ${index + 1} / ${slides.length}`);
    setText("learningConceptTitle", slide.title);
    setText("learningConceptBody", slide.body);
    setText("learningConceptFormula", slide.formula);
    setText("learningConceptExample", slide.example);
    const next = actionElement("next-concept", "sqrt-next-content");
    const previous = actionElement("previous-concept", "sqrt-previous-content");
    if (next) {
      bindSqrtAction(next, "sqrt-next-content");
      next.textContent = index === slides.length - 1 ? "문제 풀기" : "다음";
    }
    if (previous) {
      bindSqrtAction(previous, "sqrt-previous-content");
      previous.disabled = index === 0;
    }
    const progress = ((state.currentProblemIndex + ((index + 1) / slides.length)) / Math.max(1, state.cycleItems.length)) * 100;
    document.getElementById("learningLessonProgressBar").style.width = `${progress}%`;
    setText("learningLessonProgressText", `설명 ${index + 1}/${slides.length}`);
  }

  function renderQuestion() {
    active = true;
    const item = runtime.currentItem(state);
    const problem = runtime.currentProblem(state);
    if (!item || !problem) return renderCycleResult();
    document.getElementById("learningConceptCard").hidden = true;
    document.getElementById("learningQuestionWrap").hidden = false;
    const total = state.cycleItems.length;
    document.getElementById("learningLessonProgressBar").style.width = `${Math.round(((state.currentProblemIndex + 1) / total) * 100)}%`;
    setText("learningLessonProgressText", `${state.currentProblemIndex + 1} / ${total}`);
    setText("learningQuestionNumber", `문제 ${state.currentProblemIndex + 1}`);
    const purposeLabel = item.rePracticeForProblemIds?.length
      ? purposeLabels.RE_PRACTICE
      : purposeLabels[item.purpose];
    setText("learningQuestionDifficulty", `${item.stage} · ${purposeLabel}`);
    setText("learningQuestionConcept", problem.conceptTitle);
    setText("learningQuestionText", problem.questionText);
    const attempt = runtime.getFinalizedAttempt(state, problem.problemId);
    renderAnswerArea(problem, attempt);
    renderFeedback(problem);
    const submit = document.getElementById("learningSubmitButton");
    if (submit) {
      bindSqrtAction(submit, "sqrt-submit");
      submit.disabled = hydrationStatus !== "READY" || submissionInProgress;
      submit.textContent = attempt?.attemptStatus === "FINAL"
        ? state.currentProblemIndex === state.cycleItems.length - 1 ? "결과 보기" : "다음 문제"
        : "정답 확인";
    }
    const previous = actionElement("previous-question", "sqrt-previous-problem");
    if (previous) {
      bindSqrtAction(previous, "sqrt-previous-problem");
      previous.disabled = state.currentProblemIndex === 0;
    }
    const hint = actionElement("show-hint", "sqrt-hint");
    bindSqrtAction(hint, "sqrt-hint");
    if (hint) hint.disabled = item.purpose === runtime.PURPOSES.INDEPENDENT_CHECK;
    const reveal = actionElement("reveal-answer", "sqrt-reveal");
    bindSqrtAction(reveal, "sqrt-reveal");
    if (reveal) {
      reveal.disabled = item.purpose === runtime.PURPOSES.INDEPENDENT_CHECK
        && attempt?.attemptStatus !== "FINAL";
    }
    const pauseButtons = actionElements("pause-to-map", "sqrt-pause");
    pauseButtons.forEach((button) => { bindSqrtAction(button, "sqrt-pause"); });
    const conceptReturn = document.getElementById("learningConceptReturn");
    if (conceptReturn) conceptReturn.hidden = true;
  }

  function renderLesson() {
    if (!state || !runtime.currentItem(state)) return renderCycleResult();
    const item = runtime.currentItem(state);
    const problem = runtime.currentProblem(state);
    setText("learningLessonUnit", "중3 수학 · 제곱근과 실수");
    setText("learningLessonTitle", `${problem.conceptTitle} · ${item.stage}`);
    if (runtime.shouldShowContent(state)) renderContent();
    else renderQuestion();
    showScreen("learning-lesson");
  }

  function renderCycleResult() {
    active = true;
    const history = state.cycleHistory.at(-1);
    const cycleItems = history
      ? history.problemIds.map((problemId) => model.problemsById[problemId]).filter(Boolean)
      : state.cycleItems.map((item) => model.problemsById[item.problemId]).filter(Boolean);
    const correct = cycleItems.filter((problem) => runtime.getFinalizedAttempt(state, problem.problemId)?.result?.status === "CORRECT").length;
    const total = cycleItems.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    setText("learningResultStageTitle", `제곱근과 실수 스프링 사이클 ${history?.number || state.activeCycleNumber}`);
    setText("learningResultBadge", "✓");
    setText("learningResultTitle", "이번 학습 사이클을 마쳤어요!");
    setText("learningResultMessage", `${state.pendingIndependentChecks.length}개 단계가 독립 확인을 기다리고 있어요.`);
    setText("learningResultCorrect", `${correct} / ${total}`);
    setText("learningResultAccuracy", `${accuracy}%`);
    setText("learningResultXp", "+0 XP");
    setText("learningResultCoins", "+0");
    setText("learningResultStreak", "0");
    setText("learningResultWrong", `${Math.max(0, total - correct)}`);
    setText("learningResultTime", "저장 완료");
    setText("learningResultWeak", state.curriculumProgress.nextBasicConceptId
      ? content.CONCEPTS.find((concept) => concept.conceptId === state.curriculumProgress.nextBasicConceptId)?.title
      : "BASIC 진도 완료");
    setText("learningResultRecommendation", "다음 사이클에서 새 진도·심화·복습·독립 확인을 섞어 학습합니다.");
    const reward = document.getElementById("learningRewardChest");
    if (reward) reward.hidden = true;
    const next = document.getElementById("learningNextStageButton");
    if (next) {
      next.hidden = false;
      next.disabled = false;
      next.textContent = "다음 사이클";
      bindSqrtAction(next, "sqrt-next-cycle");
    }
    const retry = document.getElementById("learningRetryButton");
    if (retry) retry.disabled = true;
    const mapButtons = actionElements("result-to-map", "sqrt-result-map");
    mapButtons.forEach((button) => { bindSqrtAction(button, "sqrt-result-map"); });
    showScreen("learning-stage-result");
  }

  function getDraft(problem) {
    if (problem.answerType === "MULTIPLE_CHOICE" || problem.answerType === "STEP_ORDER") {
      return runtime.getDraftAnswer(state, problem.problemId);
    }
    return document.getElementById("sqrtLearningAnswer")?.value || runtime.getDraftAnswer(state, problem.problemId) || "";
  }

  async function applyState(nextState, render = true) {
    state = runtime.normalizeState(nextState, currentUserId());
    writeLocal(state);
    await persist();
    if (render) {
      if (state.cycleStatus === "COMPLETED") renderCycleResult();
      else renderLesson();
    }
    return state;
  }

  async function startRecommended() {
    if (!await hydrate(true)) {
      alert("Firebase 학습 상태를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.");
      return false;
    }
    if (state.cycleStatus === "PAUSED") state = runtime.resumeCycle(state);
    else if (state.cycleStatus !== "ACTIVE" || !state.cycleItems.length) state = runtime.startCycle(state, { resume: false });
    await applyState(state, false);
    renderLesson();
    return true;
  }

  async function startDirect(conceptId, stage) {
    if (!runtime.CONCEPT_IDS.includes(conceptId) || !runtime.STAGES.includes(stage)) return false;
    if (!await hydrate(true)) return false;
    state = runtime.startCycle(state, { conceptId, stage, resume: false });
    await applyState(state, false);
    renderLesson();
    return true;
  }

  async function openMap(options = {}) {
    if (!await hydrate(true)) {
      alert("Firebase 학습 상태를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.");
      return false;
    }
    if (
      options.restoreSavedScreen
      && localStorage.getItem("studyCoinCurrentScreen") === "learning-lesson"
      && ["ACTIVE", "PAUSED"].includes(state.cycleStatus)
      && runtime.currentItem(state)
    ) {
      if (state.cycleStatus === "PAUSED") state = runtime.resumeCycle(state);
      renderLesson();
      return true;
    }
    renderMap();
    showScreen("learning-map");
    return true;
  }

  async function startFromRecommendation(recommendation) {
    const conceptId = recommendation?.conceptId;
    if (!runtime.CONCEPT_IDS.includes(conceptId)) return false;
    const stage = runtime.STAGES.includes(recommendation.recoveryStage)
      ? recommendation.recoveryStage
      : runtime.STAGES.includes(recommendation.recommendedStage)
        ? recommendation.recommendedStage
        : null;
    if (stage) return startDirect(conceptId, stage);
    return startRecommended();
  }

  function dispatchGraphFinal(problem, result, fallbackResult) {
    if (!problem || (!result?.finalized && !result?.revealed) || typeof window.CustomEvent !== "function") return;
    const attempt = runtime.getFinalizedAttempt(result.state, problem.problemId);
    window.dispatchEvent(new CustomEvent("study:math-concept-final", { detail: {
      conceptId: problem.conceptId, problemId: problem.problemId,
      structureSignature: problem.structureSignature, solutionPathSignature: problem.solutionPathSignature,
      stage: problem.stage, result: result.result?.status || fallbackResult,
      misconceptionTags: problem.misconceptionTags || [], independentCheck: problem.independentCheck === true,
      finalSubmission: true, submissionId: result.submissionId || attempt?.submissionId,
      timestamp: attempt?.finalizedAt || Date.now(),
    } }));
  }

  async function submit() {
    if (submissionInProgress || hydrationStatus !== "READY") return;
    submissionInProgress = true;
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    try {
      await savePromise.catch(() => false);
    } finally {
      submissionInProgress = false;
    }
    const problem = runtime.currentProblem(state);
    if (!problem) return;
    const finalized = runtime.getFinalizedAttempt(state, problem.problemId);
    if (finalized?.attemptStatus === "FINAL") {
      submissionInProgress = true;
      try {
        state = runtime.advance(state);
        await applyState(state, false);
        submissionInProgress = false;
        if (state.cycleStatus === "COMPLETED") renderCycleResult();
        else renderLesson();
      } finally {
        submissionInProgress = false;
      }
      return;
    }
    const answer = getDraft(problem);
    const hasAnswer = Array.isArray(answer) ? answer.length > 0 : String(answer || "").trim();
    if (!hasAnswer) {
      state.feedbackByProblemId[runtime.attemptKey(state, problem.problemId)] = {
        type: "INCORRECT",
        title: "답을 먼저 입력해 주세요",
        text: "답을 작성한 뒤 정답 확인을 눌러 주세요.",
      };
      return renderQuestion();
    }
    submissionInProgress = true;
    try {
      const submitted = runtime.submitAnswer(state, answer);
      if (!submitted.accepted) return;
      await applyState(submitted.state, false);
      submissionInProgress = false;
      renderQuestion();
      dispatchGraphFinal(problem, submitted, "CORRECT");
    } finally {
      submissionInProgress = false;
    }
  }

  async function handleAction(target) {
    const requestedAction = target?.dataset?.learningAction;
    const action = requestedAction?.startsWith("sqrt-")
      ? requestedAction
      : sqrtActionsByDefault[requestedAction];
    if (!action?.startsWith("sqrt-")) return false;
    if (sqrtDomSurfaceActive()) {
      active = true;
      localStorage.setItem(surfaceMarkerKey(), "1");
    }
    if (!state && sqrtDomSurfaceActive() && !await hydrate()) return false;
    if (action === "sqrt-start-recommended") await startRecommended();
    else if (action === "sqrt-open-stage") await startDirect(target.dataset.conceptId, target.dataset.stage);
    else if (action === "sqrt-select-choice") {
      const problem = runtime.currentProblem(state);
      state = runtime.setDraftAnswer(state, problem.problemId, target.dataset.answer);
      await applyState(state, false);
      renderQuestion();
    } else if (action === "sqrt-add-step") {
      const problem = runtime.currentProblem(state);
      const savedDraft = runtime.getDraftAnswer(state, problem.problemId);
      const draft = Array.isArray(savedDraft) ? savedDraft : [];
      state = runtime.setDraftAnswer(state, problem.problemId, [...draft, target.dataset.step]);
      await applyState(state, false);
      renderQuestion();
    } else if (action === "sqrt-remove-step") {
      const problem = runtime.currentProblem(state);
      const savedDraft = runtime.getDraftAnswer(state, problem.problemId);
      const draft = Array.isArray(savedDraft) ? savedDraft : [];
      const index = draft.indexOf(target.dataset.step);
      if (index >= 0) draft.splice(index, 1);
      state = runtime.setDraftAnswer(state, problem.problemId, draft);
      await applyState(state, false);
      renderQuestion();
    } else if (action === "sqrt-next-content") {
      const item = runtime.currentItem(state);
      const slides = runtime.contentSlides(item.conceptId, item.stage);
      if (state.currentContentSlideIndex < slides.length - 1) {
        state.currentContentSlideIndex += 1;
      } else {
        state = runtime.markContentViewed(state, item.conceptId, item.stage);
        state.currentContentSlideIndex = 0;
      }
      await applyState(state, false);
      if (runtime.shouldShowContent(state)) renderContent();
      else renderQuestion();
    } else if (action === "sqrt-previous-content") {
      state.currentContentSlideIndex = Math.max(0, Number(state.currentContentSlideIndex) - 1);
      await applyState(state, false);
      renderContent();
    } else if (action === "sqrt-submit") await submit();
    else if (action === "sqrt-hint") {
      const hinted = runtime.useHint(state);
      await applyState(hinted.state, false);
      renderQuestion();
    } else if (action === "sqrt-reveal") {
      const revealed = runtime.revealSolution(state);
      if (!revealed.revealed) {
        const problem = runtime.currentProblem(state);
        state.feedbackByProblemId[runtime.attemptKey(state, problem.problemId)] = {
          type: "INCORRECT",
          title: "먼저 다시 시도해 보세요",
          text: "답을 한 번 제출하거나 힌트를 사용한 뒤 마지막에 풀이를 확인할 수 있어요.",
        };
        return renderQuestion();
      }
      const problem = runtime.currentProblem(state);
      await applyState(revealed.state, false);
      dispatchGraphFinal(problem, revealed, "GIVEUP");
      renderQuestion();
    } else if (action === "sqrt-previous-problem") {
      state = runtime.previous(state);
      await applyState(state, false);
      renderLesson();
    } else if (action === "sqrt-pause") {
      const input = document.getElementById("sqrtLearningAnswer");
      const problem = runtime.currentProblem(state);
      if (input && problem && !runtime.getFinalizedAttempt(state, problem.problemId)) {
        state = runtime.setDraftAnswer(state, problem.problemId, input.value);
      }
      state = runtime.pauseCycle(state);
      await applyState(state, false);
      renderMap();
      showScreen("learning-map");
    } else if (action === "sqrt-result-map") {
      renderMap();
      showScreen("learning-map");
    } else if (action === "sqrt-next-cycle") {
      state = runtime.startCycle(state, { resume: false });
      await applyState(state, false);
      renderLesson();
    }
    return true;
  }

  window.addEventListener("beforeunload", () => {
    if (state) writeLocal(state);
  });
  window.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-learning-action]");
    const requestedAction = target?.dataset?.learningAction;
    if (
      !target
      || !sqrtSurfaceActive()
      || (
        !String(requestedAction || "").startsWith("sqrt-")
        && !sqrtActionsByDefault[requestedAction]
      )
    ) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    actionPromise = actionPromise
      .catch(() => false)
      .then(() => handleAction(target))
      .catch((error) => {
        console.error("[m3-sqrt-learning] action failed", error);
        return false;
      });
  }, true);
  async function restoreSavedSurface() {
    const savedScreen = localStorage.getItem("studyCoinCurrentScreen");
    const local = readLocal(currentUserId());
    if (
      localStorage.getItem(surfaceMarkerKey()) !== "1"
      || !["learning-map", "learning-lesson", "learning-stage-result"].includes(savedScreen)
      || local?.learningVersion !== runtime.VERSION
    ) return false;
    if (!await hydrate()) return false;
    if (savedScreen === "learning-lesson" && ["ACTIVE", "PAUSED"].includes(state.cycleStatus) && runtime.currentItem(state)) {
      if (state.cycleStatus === "PAUSED") state = runtime.resumeCycle(state);
      renderLesson();
      return true;
    }
    if (savedScreen === "learning-stage-result" && state.cycleStatus === "COMPLETED") {
      renderCycleResult();
      return true;
    }
    renderMap();
    showScreen("learning-map");
    return true;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreSavedSurface, { once: true });
  } else {
    restoreSavedSurface();
  }
  document.addEventListener("input", async (event) => {
    if (!sqrtSurfaceActive() || event.target?.id !== "sqrtLearningAnswer") return;
    active = true;
    localStorage.setItem(surfaceMarkerKey(), "1");
    if (!state && !await hydrate()) return;
    const problem = runtime.currentProblem(state);
    if (!problem || runtime.getFinalizedAttempt(state, problem.problemId)) return;
    state = runtime.setDraftAnswer(state, problem.problemId, event.target.value);
    writeLocal(state);
    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(() => {
      persist();
    }, 500);
  });
  function resetUserHydrationState() {
    deactivate(true);
    state = null;
    hydrationStatus = "IDLE";
    hydratedUserId = null;
    remoteRevision = 0;
    remoteUpdatedAt = null;
  }

  function restoreSignedInUser(userId) {
    if (
      !userId
      || (pendingUserRestoreId === userId && userRestorePromise)
      || (hydratedUserId === userId && hydrationStatus === "READY" && state)
    ) return userRestorePromise || Promise.resolve(false);

    const generation = ++userRestoreGeneration;
    pendingUserRestoreId = userId;
    userRestorePromise = Promise.resolve()
      .then(async () => {
        if (
          generation !== userRestoreGeneration
          || currentUserId() !== userId
          || window.STUDY_LEARNING_ENGINE?.getState?.().mapView !== "middle3-sqrt"
        ) return false;
        return openMap({ restoreSavedScreen: true });
      })
      .catch((error) => {
        console.error("[m3-sqrt-learning] user restore failed", error);
        return false;
      })
      .finally(() => {
        if (pendingUserRestoreId === userId) {
          pendingUserRestoreId = null;
          userRestorePromise = null;
        }
      });
    return userRestorePromise;
  }

  window.addEventListener("study:user-changed", (event) => {
    const userId = String(event.detail?.userId || "").trim();
    if (!userId) {
      userRestoreGeneration += 1;
      pendingUserRestoreId = null;
      userRestorePromise = null;
      resetUserHydrationState();
      return;
    }
    if (
      (pendingUserRestoreId === userId && userRestorePromise)
      || (hydratedUserId === userId && hydrationStatus === "READY" && state)
    ) return;
    resetUserHydrationState();
    restoreSignedInUser(userId);
  });
  window.addEventListener("study:m3-sqrt-remote-wins", () => {
    if (document.querySelector('[data-screen="learning-lesson"]')?.classList.contains("active")) renderLesson();
    else if (document.querySelector('[data-screen="learning-map"]')?.classList.contains("active")) renderMap();
  });

  window.STUDY_M3_SQRT_LEARNING_UI = {
    isMiddle3Grade,
    isActive: sqrtSurfaceActive,
    handlesAction: (action) => Boolean(
      String(action || "").startsWith("sqrt-")
      || sqrtActionsByDefault[action]
    ),
    isConceptId: (conceptId) => runtime.CONCEPT_IDS.includes(conceptId),
    deactivate,
    hydrate,
    openMap,
    renderMap,
    startRecommended,
    startDirect,
    startFromRecommendation,
    handleAction,
    getState: () => runtime.serializeState(state || runtime.createDefaultState(currentUserId())),
    getHydrationStatus: () => hydrationStatus,
    getStorageKey: () => localStateKey(),
    flush: () => savePromise,
  };
})();
