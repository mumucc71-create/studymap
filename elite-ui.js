(function initEliteUi(root, factory) {
  const dependencies = typeof module === "object" && module.exports
    ? {
      runtimeModule: require("./elite-runtime.js"),
      storageModule: require("./elite-storage.js"),
    }
    : {
      runtimeModule: root.STUDY_ELITE_RUNTIME,
      storageModule: root.STUDY_ELITE_STORAGE,
    };
  const api = factory(root, dependencies);
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_UI = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteUi(root, dependencies) {
  "use strict";

  const CURRENT_SCREEN_KEY = "studyCoinCurrentScreen";
  const LAST_SUBJECT_KEY = "studyEliteLastSubjectV1";
  const RESUME_REQUESTED_KEY = "studyEliteResumeRequestedV1";
  let mountedApi = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function levelLabel(level) {
    if (level === "TOP") return "최상";
    if (level === "HIGH") return "상";
    return "확인 중";
  }

  function subjectLabel(subject) {
    return subject === "english" ? "영어" : "수학";
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
  }

  function mount() {
    if (mountedApi) return mountedApi;
    if (!root.document || !dependencies.runtimeModule || !dependencies.storageModule) return null;
    const screen = root.document.querySelector('[data-screen="elite-quiz"]');
    if (!screen) return null;

    const elements = {
      progress: root.document.querySelector("#eliteProgress"),
      title: screen.querySelector(".topbar h2"),
      progressLabel: root.document.querySelector("#eliteProgressLabel"),
      route: root.document.querySelector("#eliteRoute"),
      currentConcept: root.document.querySelector("#eliteCurrentConcept"),
      timeLeft: root.document.querySelector("#eliteTimeLeft"),
      conceptSub: root.document.querySelector("#eliteConceptSub"),
      questionNumber: root.document.querySelector("#eliteQuestionNumber"),
      prompt: root.document.querySelector("#elitePrompt"),
      problem: root.document.querySelector("#eliteProblem"),
      answerList: root.document.querySelector("#eliteAnswerList"),
      selectionMessage: root.document.querySelector("#eliteSelectionMessage"),
      questionArea: root.document.querySelector("#eliteQuestionArea"),
      resultPanel: root.document.querySelector("#eliteResultPanel"),
      resultTitle: root.document.querySelector("#eliteResultTitle"),
      resultScore: root.document.querySelector("#eliteResultScore"),
      resultCount: root.document.querySelector("#eliteResultCount"),
      resultCopy: root.document.querySelector("#eliteResultCopy"),
      previous: root.document.querySelector("#elitePrevious"),
      unknown: root.document.querySelector("#eliteUnknown"),
      next: root.document.querySelector("#eliteNext"),
      quit: root.document.querySelector("#eliteQuit"),
      quitTop: root.document.querySelector("#eliteQuitTop"),
      restart: root.document.querySelector("#eliteRestart"),
      resultHome: root.document.querySelector("#eliteResultHome"),
    };
    const engine = dependencies.runtimeModule.createEngine();
    let storage = null;
    let state = null;
    let currentSubject = null;
    let viewIndex = 0;
    let draftAnswer = null;
    let busy = false;
    let timerId = null;
    let lastFeedback = "";
    let restoringScreen = false;

    function showScreen(name) {
      root.document.querySelectorAll("[data-screen]").forEach((item) => {
        item.classList.toggle("active", item.dataset.screen === name);
      });
      root.localStorage?.setItem(CURRENT_SCREEN_KEY, name);
      if (name === "elite-quiz") root.localStorage?.setItem(RESUME_REQUESTED_KEY, "1");
      else root.localStorage?.removeItem(RESUME_REQUESTED_KEY);
      root.scrollTo?.(0, 0);
    }

    function restoreEliteScreenIfOverridden() {
      if (restoringScreen || !state || storage?.getStatus() !== "READY") return;
      if (root.localStorage?.getItem(RESUME_REQUESTED_KEY) !== "1") return;
      if (screen.classList.contains("active")) return;
      restoringScreen = true;
      root.queueMicrotask?.(() => {
        try {
          if (state
            && storage?.getStatus() === "READY"
            && root.localStorage?.getItem(RESUME_REQUESTED_KEY) === "1"
            && !screen.classList.contains("active")) {
            showScreen("elite-quiz");
          }
        } finally {
          restoringScreen = false;
        }
      });
    }

    const screenObserver = typeof root.MutationObserver === "function"
      ? new root.MutationObserver(restoreEliteScreenIfOverridden)
      : null;
    screenObserver?.observe(root.document.body, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });

    function stopTimer() {
      if (timerId) root.clearInterval(timerId);
      timerId = null;
    }

    function showHome() {
      stopTimer();
      showScreen("home");
    }

    function setControlsDisabled(disabled) {
      [elements.previous, elements.unknown, elements.next].forEach((button) => {
        if (button) button.disabled = disabled;
      });
      elements.answerList?.querySelectorAll("button,input,textarea").forEach((control) => {
        control.disabled = disabled;
      });
    }

    function setLoading(message) {
      busy = true;
      showScreen("elite-quiz");
      elements.questionArea?.classList.remove("hidden");
      elements.resultPanel?.classList.add("hidden");
      if (elements.selectionMessage) elements.selectionMessage.textContent = message;
      setControlsDisabled(true);
    }

    function remainingSeconds() {
      if (!state) return 0;
      const elapsed = Math.max(0, Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 1000));
      return Math.max(0, Number(state.timeLimitSeconds) - elapsed);
    }

    function setDraft(value) {
      draftAnswer = value;
      renderProblem();
    }

    function renderChoiceAnswers(problem, attempt, locked) {
      elements.answerList.innerHTML = "";
      problem.choices.forEach((choice, index) => {
        const button = root.document.createElement("button");
        button.type = "button";
        button.dataset.answer = choice;
        button.innerHTML = `<b>${index + 1}</b><span>${escapeHtml(choice)}</span>`;
        const selected = attempt ? attempt.answer === choice : draftAnswer === choice;
        button.classList.toggle("selected", selected);
        button.disabled = locked;
        button.addEventListener("click", () => {
          if (!locked && !busy) setDraft(choice);
        });
        elements.answerList.appendChild(button);
      });
    }

    function renderTextAnswer(problem, attempt, locked) {
      const isLong = ["STEP_ORDER", "WRITTEN_RESPONSE"].includes(problem.answerType);
      const answer = attempt ? attempt.answer || "" : draftAnswer || "";
      const placeholder = problem.answerType === "EXPRESSION_INPUT"
        ? "동치인 수식도 정답으로 인정됩니다."
        : problem.answerType === "STEP_ORDER"
          ? "풀이 과정을 순서대로 작성하세요."
          : problem.answerType === "WRITTEN_RESPONSE"
            ? "주장과 근거를 연결해 작성하세요."
            : "정답을 입력하세요.";
      elements.answerList.innerHTML = isLong
        ? `<textarea class="learning-text-answer" id="eliteTextAnswer" rows="7" placeholder="${placeholder}" ${locked ? "disabled" : ""}>${escapeHtml(answer)}</textarea>`
        : `<input class="learning-text-answer" id="eliteTextAnswer" type="text" autocomplete="off" placeholder="${placeholder}" value="${escapeHtml(answer)}" ${locked ? "disabled" : ""} />`;
    }

    function renderProblem() {
      if (!state || state.sessionStatus === "COMPLETED") {
        if (state?.sessionStatus === "COMPLETED") renderResult();
        return;
      }
      const problemId = state.sessionProblemIds[viewIndex];
      const problem = engine.getProblem(problemId);
      if (!problem) return;
      const attempt = state.finalizedAttempts[problemId];
      const locked = busy || state.cloudHydrationStatus !== "READY" || attempt?.attemptStatus === "FINAL";
      const submitted = Object.keys(state.finalizedAttempts).length;
      const progressPercent = Math.min(95, Math.round((submitted / dependencies.runtimeModule.MIN_SESSION_ITEMS) * 90));

      elements.questionArea?.classList.remove("hidden");
      elements.resultPanel?.classList.add("hidden");
      if (elements.progress) elements.progress.style.width = `${progressPercent}%`;
      if (elements.title) elements.title.textContent = `${subjectLabel(state.subject)} Elite 레벨테스트`;
      if (elements.progressLabel) elements.progressLabel.textContent = `상위권 분석 ${progressPercent}%`;
      if (elements.route) {
        elements.route.textContent = `중등 3학년 ${subjectLabel(state.subject)} · 상에서 시작해 충분한 근거가 있을 때 최상을 확인합니다.`;
      }
      if (elements.currentConcept) elements.currentConcept.textContent = problem.domain;
      if (elements.conceptSub) elements.conceptSub.textContent = `${problem.domain} · ${levelLabel(problem.eliteLevel)}`;
      if (elements.timeLeft) elements.timeLeft.textContent = formatTime(remainingSeconds());
      if (elements.questionNumber) elements.questionNumber.textContent = `E.${viewIndex + 1}`;
      if (elements.prompt) elements.prompt.textContent = problem.answerType === "MULTIPLE_CHOICE"
        ? "문제를 읽고 가장 알맞은 답을 고르세요."
        : "문제를 읽고 답안을 작성하세요.";
      if (elements.problem) elements.problem.textContent = problem.prompt;

      if (problem.answerType === "MULTIPLE_CHOICE") renderChoiceAnswers(problem, attempt, locked);
      else renderTextAnswer(problem, attempt, locked);

      if (elements.selectionMessage) {
        elements.selectionMessage.classList.remove("error");
        elements.selectionMessage.textContent = lastFeedback || (
          attempt
            ? "제출한 답안은 잠겨 있습니다. 결과만 확인할 수 있습니다."
            : draftAnswer
              ? "답안을 제출하기 전까지 수정할 수 있습니다."
              : "답을 입력하거나 모르겠어요를 눌러주세요."
        );
      }
      lastFeedback = "";
      if (elements.previous) elements.previous.disabled = busy || viewIndex === 0;
      if (elements.unknown) elements.unknown.disabled = locked;
      if (elements.next) {
        elements.next.disabled = busy;
        elements.next.textContent = viewIndex < state.currentProblemIndex ? "다음 문제" : "답안 제출";
      }
    }

    function renderResult() {
      const summary = state?.resultSummary || {};
      const stable = levelLabel(summary.stableLevel);
      const challenge = levelLabel(summary.challengeLevel);
      const strengths = (summary.strengthAreas || []).map((item) => item.name).join(", ") || "추가 확인 필요";
      const traps = (summary.repeatedErrors || []).map((item) => item.domain).filter(Boolean).join(", ") || "반복 확인 중";
      const recommendations = (summary.recommendedLearningTargets || [])
        .map((item) => item.conceptId || item.domain || item.skillTarget)
        .filter(Boolean)
        .join(", ") || "현재 결과에 맞는 다음 확인 위치";
      elements.questionArea?.classList.add("hidden");
      elements.resultPanel?.classList.remove("hidden");
      if (elements.progress) elements.progress.style.width = "100%";
      if (elements.progressLabel) elements.progressLabel.textContent = "Elite 분석 완료";
      if (elements.resultTitle) elements.resultTitle.textContent = `${subjectLabel(state.subject)} 상위권 사고력 진단 결과`;
      if (elements.resultScore) elements.resultScore.textContent = `현재 실력: ${stable}`;
      if (elements.resultCount) {
        elements.resultCount.textContent = `${summary.submittedCount || 0}문제 제출 · 정답률 ${Math.round((summary.accuracy || 0) * 100)}%`;
      }
      if (elements.resultCopy) {
        elements.resultCopy.innerHTML = [
          `<strong>최고 도전 수준</strong> ${escapeHtml(challenge)}`,
          `<strong>강한 영역</strong> ${escapeHtml(strengths)}`,
          `<strong>자주 틀리는 함정</strong> ${escapeHtml(traps)}`,
          `<strong>다시 살펴볼 내용</strong> ${escapeHtml(recommendations)}`,
        ].join("<br />");
      }
      if (elements.timeLeft) elements.timeLeft.textContent = formatTime(remainingSeconds());
    }

    function render() {
      if (!state) return;
      busy = false;
      if (state.sessionStatus === "COMPLETED") renderResult();
      else renderProblem();
    }

    async function persist(nextState, previousRevision, options = {}) {
      state = nextState;
      storage.writeLocal(state);
      const result = await storage.save(state, {
        expectedBaseRevision: previousRevision,
        allowNewSession: Boolean(options.allowNewSession),
      });
      if (result.conflict) {
        state = engine.restoreState(result.state, storage.getUid());
        viewIndex = state.currentProblemIndex;
        draftAnswer = null;
        lastFeedback = "다른 브라우저의 최신 상태를 불러왔습니다.";
      }
      return result;
    }

    async function submit(unknown = false) {
      if (!state || busy || state.sessionStatus !== "IN_PROGRESS") return;
      if (viewIndex < state.currentProblemIndex) {
        viewIndex += 1;
        draftAnswer = null;
        renderProblem();
        return;
      }
      const problem = engine.getCurrentProblem(state);
      if (!problem) return;
      const answer = problem.answerType === "MULTIPLE_CHOICE"
        ? draftAnswer
        : root.document.querySelector("#eliteTextAnswer")?.value || "";
      if (!unknown && (answer === null || String(answer).trim() === "")) {
        elements.selectionMessage?.classList.add("error");
        if (elements.selectionMessage) elements.selectionMessage.textContent = "답을 입력하거나 모르겠어요를 눌러주세요.";
        return;
      }
      busy = true;
      setControlsDisabled(true);
      const previousRevision = Number(state.revision) || 0;
      try {
        const nextState = unknown
          ? engine.markUnknown(state, { problemId: problem.problemId })
          : engine.submitCurrent(state, answer, { problemId: problem.problemId });
        const attempt = nextState.finalizedAttempts[problem.problemId];
        await persist(nextState, previousRevision);
        viewIndex = state.currentProblemIndex;
        draftAnswer = null;
        lastFeedback = attempt?.evaluationStatus === "CORRECT"
          ? "답안을 저장했습니다. 다음 문제로 이어갑니다."
          : attempt?.evaluationStatus === "REVIEW_REQUIRED"
            ? "답안을 저장했습니다. 검토가 필요한 답안도 다음 문제로 이어갑니다."
            : unknown
              ? "모르겠어요로 저장했습니다. 다른 문제에서 다시 확인합니다."
              : "답이 달라요. 정답은 공개하지 않고 다른 문제에서 다시 확인합니다.";
        render();
      } catch (error) {
        busy = false;
        if (elements.selectionMessage) {
          elements.selectionMessage.classList.add("error");
          elements.selectionMessage.textContent = error?.message === "ELITE_ATTEMPT_ALREADY_FINAL"
            ? "이미 제출한 답안입니다."
            : "저장 상태를 다시 확인하고 있습니다. 잠시 후 다시 시도해 주세요.";
        }
        setControlsDisabled(false);
      }
    }

    async function startOrResume(subjectValue) {
      const subject = dependencies.runtimeModule.subjectKey(subjectValue);
      if (!dependencies.runtimeModule.ALLOWED_SUBJECTS.includes(subject)) {
        console.warn("[StudyMap] 수학과 영어만 Elite 테스트를 시작할 수 있습니다.");
        return { started: false, reason: "SUBJECT_NOT_ALLOWED" };
      }
      stopTimer();
      setLoading("로그인과 저장 상태를 확인하고 있습니다.");
      currentSubject = subject;
      root.localStorage?.setItem(LAST_SUBJECT_KEY, subject);
      storage = dependencies.storageModule.createStorage();
      try {
        const hydrated = await storage.hydrate(subject);
        if (hydrated.state) {
          state = engine.restoreState(hydrated.state, hydrated.uid);
        } else {
          state = engine.createSession(subject, {
            uid: hydrated.uid,
            baseRevision: storage.getLastRemoteRevision(),
            cloudHydrationStatus: "READY",
          });
          await persist(state, 0);
        }
        showScreen("elite-quiz");
        viewIndex = state.currentProblemIndex;
        draftAnswer = null;
        render();
        if (state.sessionStatus === "IN_PROGRESS") startTimer();
        return { started: true, source: hydrated.source, state };
      } catch (error) {
        busy = false;
        if (elements.selectionMessage) {
          elements.selectionMessage.classList.add("error");
          elements.selectionMessage.textContent = "Firebase 로그인을 확인한 뒤 다시 시작해 주세요.";
        }
        setControlsDisabled(true);
        return { started: false, reason: error?.message || "HYDRATION_FAILED" };
      }
    }

    async function restart() {
      if (!storage || !state) return;
      setLoading("새 진단을 준비하고 있습니다.");
      const previousRevision = Number(state.revision) || 0;
      const next = engine.createSession(currentSubject, {
        uid: storage.getUid(),
        baseRevision: previousRevision,
        cloudHydrationStatus: "READY",
      });
      await persist(next, previousRevision, { allowNewSession: true });
      viewIndex = 0;
      draftAnswer = null;
      render();
      startTimer();
    }

    async function finishForTimeout() {
      if (!state || busy || state.sessionStatus !== "IN_PROGRESS") return;
      busy = true;
      const previousRevision = Number(state.revision) || 0;
      try {
        await persist(engine.finishSession(state, "TIME_EXPIRED"), previousRevision);
        render();
      } catch {
        busy = false;
        renderProblem();
      }
    }

    function startTimer() {
      stopTimer();
      timerId = root.setInterval(() => {
        const remaining = remainingSeconds();
        if (elements.timeLeft) elements.timeLeft.textContent = formatTime(remaining);
        if (remaining <= 0) {
          stopTimer();
          finishForTimeout();
        }
      }, 1000);
    }

    elements.next?.addEventListener("click", () => submit(false));
    elements.unknown?.addEventListener("click", () => submit(true));
    elements.previous?.addEventListener("click", () => {
      if (!state || busy || viewIndex <= 0) return;
      viewIndex -= 1;
      draftAnswer = null;
      renderProblem();
    });
    elements.quit?.addEventListener("click", showHome);
    elements.quitTop?.addEventListener("click", showHome);
    elements.restart?.addEventListener("click", restart);
    elements.resultHome?.addEventListener("click", showHome);
    root.document.addEventListener("study:start-elite-test", (event) => {
      startOrResume(event.detail?.subject || "수학");
    });
    root.addEventListener("beforeunload", () => {
      if (state && storage) storage.writeLocal(state);
    });
    root.addEventListener("study:user-changed", (event) => {
      if (event.detail?.userId) return;
      stopTimer();
      state = null;
      storage?.resetIdentity();
      storage = null;
      showHome();
    });
    screen.addEventListener("click", (event) => {
      if (event.target.closest?.("[data-go]")) {
        root.localStorage?.removeItem(RESUME_REQUESTED_KEY);
      }
    });

    async function resumeIfNeeded() {
      const resumeRequested = root.localStorage?.getItem(RESUME_REQUESTED_KEY) === "1";
      if (!resumeRequested && root.localStorage?.getItem(CURRENT_SCREEN_KEY) !== "elite-quiz") return;
      const lastSubject = root.localStorage?.getItem(LAST_SUBJECT_KEY) || "math";
      await startOrResume(lastSubject);
    }

    mountedApi = Object.freeze({
      start: startOrResume,
      restart,
      resumeIfNeeded,
      getState: () => state ? JSON.parse(JSON.stringify(state)) : null,
      getViewIndex: () => viewIndex,
      getStorageConflicts: () => storage?.getConflicts() || [],
      getHydrationStatus: () => storage?.getStatus() || "NOT_STARTED",
      getEngine: () => engine,
    });
    root.STUDY_ELITE_APP = mountedApi;
    if (root.document.readyState === "loading") {
      root.addEventListener("DOMContentLoaded", resumeIfNeeded, { once: true });
    } else {
      resumeIfNeeded();
    }
    return mountedApi;
  }

  return Object.freeze({ mount, levelLabel, subjectLabel, formatTime });
});
