(function () {
  const content = window.STUDY_LEARNING_CONTENT;
  if (!content?.subjects?.mathematics) return;

  const track = content.subjects.mathematics.tracks.middle2_semester1;
  const unit = track.units.find((item) => item.id === "unit1");
  const questionById = new Map(unit.questions.map((question) => [question.id, question]));
  const mathWorlds = [
    { title: "수와 연산", master: "수와 연산 Master", topics: ["큰 수", "덧셈과 뺄셈", "곱셈", "나눗셈", "혼합계산", "약수와 배수", "분수", "소수", "응용 계산"] },
    { title: "방정식", master: "방정식 Master", topics: ["X 찾기", "등식", "역연산", "문자의 이해", "식 만들기", "일차방정식", "방정식 활용", "연립방정식", "이차방정식", "고등 방정식"] },
    { title: "함수", master: "함수 Master", topics: ["규칙 찾기", "대응", "좌표", "정비례", "반비례", "일차함수", "이차함수", "함수 활용"] },
    { title: "도형과 측정", master: "도형 Master", topics: ["점·선·각", "삼각형", "사각형", "원", "둘레", "넓이", "겉넓이", "부피", "합동", "닮음", "피타고라스", "삼각비"] },
    { title: "확률과 통계", master: "확률·통계 Master", topics: ["표와 그래프", "평균", "중앙값", "최빈값", "경우의 수", "순열", "조합", "확률", "조건부확률", "통계 활용"] },
    { title: "수열", master: "수열 Master", topics: ["규칙 찾기", "수열", "일반항", "등차수열", "등차수열의 합", "등비수열", "등비수열의 합", "점화식", "수학적 귀납법"] },
    { title: "미적분", master: "미적분 Master", topics: ["함수의 극한", "연속", "변화율", "미분", "도함수", "최대·최소", "적분", "정적분", "미적분 활용"] },
  ];
  const largeNumberSteps = [
    { code: "1-1", title: "만 단위 알아보기", body: "천이 10개 모이면 1만입니다. 만 단위는 네 자리씩 끊어 읽는 큰 수의 첫 단위예요.", example: "10,000 = 1만 · 35,000 = 3만 5천" },
    { code: "1-2", title: "십만·백만·천만", body: "만이 10개면 십만, 100개면 백만, 1,000개면 천만입니다.", example: "100,000 = 10만 · 1,000,000 = 100만" },
    { code: "1-3", title: "억과 조", body: "천만의 10배는 1억이고, 1억이 10,000개 모이면 1조입니다.", example: "100,000,000 = 1억 · 1,000,000,000,000 = 1조" },
    { code: "1-4", title: "자릿값", body: "숫자가 놓인 자리에 따라 값이 달라집니다. 같은 5라도 만의 자리에서는 5만을 뜻합니다.", example: "352,000에서 5의 자릿값 = 50,000" },
    { code: "1-5", title: "큰 수 읽기와 쓰기", body: "오른쪽부터 네 자리씩 끊어 일·만·억·조 단위로 읽고 씁니다.", example: "12|3456|7890 = 12억 3456만 7890" },
    { code: "1-6", title: "큰 수 비교하기", body: "자릿수가 많은 수가 더 큽니다. 자릿수가 같으면 가장 높은 자리부터 비교합니다.", example: "530,000 > 529,999" },
    { code: "1-7", title: "수직선에 나타내기", body: "수직선에서는 오른쪽에 있는 수가 더 큽니다. 눈금 한 칸의 크기를 먼저 확인합니다.", example: "10만씩 증가하는 눈금: 20만 → 30만 → 40만" },
    { code: "1-8", title: "큰 수 어림하기", body: "필요한 자리 아래의 숫자를 보고 반올림·올림·버림하여 간단한 수로 나타냅니다.", example: "487,000을 십만의 자리까지 반올림하면 500,000" },
    { code: "1-9", title: "큰 수 활용 문제", body: "인구, 거리, 예산처럼 생활 속 큰 수를 읽고 비교하며 계산합니다.", example: "125만 명과 98만 명의 차이는 27만 명" },
    { code: "1-10", title: "큰 수 테스트", body: "앞에서 배운 큰 수의 단위, 자릿값, 비교와 어림을 문제로 확인합니다.", example: "10문제를 모두 맞히면 큰 수 단원을 완료합니다." },
  ];
  const mathLessonModes = [
    { icon: "📖", title: "단원학습", kind: "lesson", description: "핵심 원리와 예시를 학습카드로 먼저 이해합니다." },
    { icon: "✏️", title: "기본", kind: "explain-quiz", description: "핵심 설명을 확인한 뒤 기본 문제풀이로 이어집니다." },
    { icon: "📚", title: "유형", kind: "quiz", repeatable: true, description: "여러 유형의 문제를 이어서 반복합니다." },
    { icon: "🔥", title: "심화", kind: "quiz", repeatable: true, description: "응용력과 사고력을 키우는 심화 문제를 풉니다." },
    { icon: "📝", title: "서술형", kind: "quiz", repeatable: true, description: "식과 풀이 과정을 직접 설명하는 문제를 풉니다." },
    { icon: "🎯", title: "기출", kind: "quiz", repeatable: true, description: "실전 기출 유형 문제로 학습 내용을 확인합니다." },
    { icon: "🏆", title: "단원평가", kind: "test", description: "모든 학습을 마친 뒤 단원 전체 문제를 평가합니다." },
  ];
  const currentScreenKey = "studyCoinCurrentScreen";
  const learningVersion = 3;
  function dailyQuestionGoal() {
    try {
      const userId = localStorage.getItem("studyCoinCurrentUser");
      const users = JSON.parse(localStorage.getItem("studyCoinAuth") || "{}");
      const grade = String(users[userId]?.learningSettings?.grade || "");
      if (grade.includes("\uACE0\uB4F1")) return 30;
      if (grade.includes("\uC911\uB4F1")) return 20;
      if (grade.includes("\uCD08\uB4F1")) return 10;
    } catch (_) { /* Use the middle-school default. */ }
    return 20;
  }

  function progressKeyForCurrentUser() {
    const userId = localStorage.getItem("studyCoinCurrentUser") || "guest";
    return `studyCoinMathLearningV3:${userId}`;
  }

  let progressKey = progressKeyForCurrentUser();

  const defaultState = () => ({
    version: learningVersion,
    selectedSubject: "mathematics",
    currentUnit: "unit1",
    currentStage: "concept",
    completedStages: [],
    stageScores: {},
    wrongAnswers: [],
    xp: 0,
    coins: 0,
    activeSession: null,
    latestResult: null,
    dailyActivity: {},
    notes: {},
    placementResult: null,
    mapView: "domains",
    selectedDomainIndex: null,
    selectedNumberTopicIndex: 0,
    numberOperationCompletedTopics: [],
    selectedMathTopicIndex: 0,
    completedMathWorldTopics: {},
    largeNumberCompletedSteps: [],
    largeNumberStepIndex: 0,
    largeNumberTestIndex: 0,
    largeNumberTestSelected: "",
    largeNumberTestFeedback: null,
    largeNumberTestHintVisible: false,
    largeNumberTestExplanationVisible: false,
    largeNumberModeIndex: 0,
    lastLocation: { screen: "study-empty", unit: "unit1", stage: "concept", questionIndex: 0 },
    lastSavedAt: null,
  });

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey));
      return saved && saved.version === learningVersion ? { ...defaultState(), ...saved } : defaultState();
    } catch {
      return defaultState();
    }
  }

  let state = loadState();
  let latestResult = state.latestResult || null;

  function syncCurrentUserState() {
    const nextKey = progressKeyForCurrentUser();
    if (nextKey === progressKey) return;
    progressKey = nextKey;
    state = loadState();
    latestResult = state.latestResult || null;
  }

  function saveState() {
    state.lastSavedAt = new Date().toISOString();
    localStorage.setItem(progressKey, JSON.stringify(state));
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function recordDailyAnswer(question, correct) {
    const dateKey = localDateKey();
    const activity = state.dailyActivity[dateKey] || {
      answeredQuestionIds: [],
      correctQuestionIds: [],
      lastStudiedAt: null,
    };
    if (!activity.answeredQuestionIds.includes(question.id)) activity.answeredQuestionIds.push(question.id);
    if (correct && !activity.correctQuestionIds.includes(question.id)) activity.correctQuestionIds.push(question.id);
    activity.lastStudiedAt = new Date().toISOString();
    state.dailyActivity[dateKey] = activity;
    renderProgressSurfaces();
  }

  function weeklyAnsweredCount() {
    const today = new Date();
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return Object.entries(state.dailyActivity).reduce((sum, [dateKey, activity]) => {
      const date = new Date(`${dateKey}T00:00:00`);
      return date >= monday ? sum + (activity.answeredQuestionIds?.length || 0) : sum;
    }, 0);
  }

  function renderProgressSurfaces() {
    const todayCount = state.dailyActivity[localDateKey()]?.answeredQuestionIds?.length || 0;
    const dailyProgress = Math.min(100, Math.round((todayCount / dailyQuestionGoal()) * 100));
    const homeText = document.getElementById("homeDailyProgressText");
    const homeBar = document.getElementById("homeDailyProgressBar");
    const studyText = document.getElementById("studyDailyProgressText");
    const studyBar = document.getElementById("studyDailyProgressBar");
    const weeklyCount = document.getElementById("studyWeeklyGoalCount");
    if (homeText) homeText.textContent = `${dailyProgress}%`;
    if (homeBar) homeBar.style.width = `${dailyProgress}%`;
    if (studyText) studyText.innerHTML = `${dailyProgress}<em>%</em>`;
    if (studyBar) studyBar.style.width = `${dailyProgress}%`;
    if (weeklyCount) weeklyCount.textContent = String(Math.min(10, weeklyAnsweredCount()));
  }

  function renderHomeMissionProgress(socialState) {
    const questions = Number(socialState?.activities?.[localDateKey()]?.questions || 0);
    const progress = Math.min(100, Math.round((questions / dailyQuestionGoal()) * 100));
    const homeText = document.getElementById("homeDailyProgressText");
    const homeBar = document.getElementById("homeDailyProgressBar");
    if (homeText) homeText.textContent = `${progress}%`;
    if (homeBar) homeBar.style.width = `${progress}%`;
  }

  function showLearningScreen(name) {
    if (window.STUDY_NAV?.go) window.STUDY_NAV.go(name);
    else document.querySelectorAll("[data-screen]").forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });
    localStorage.setItem(currentScreenKey, name);
    state.lastLocation = {
      screen: name,
      unit: state.currentUnit,
      stage: state.currentStage,
      questionIndex: state.activeSession?.index || 0,
    };
    saveState();
    window.scrollTo?.(0, 0);
  }

  function stageIndex(stageId) {
    return unit.stages.findIndex((stage) => stage.id === stageId);
  }

  function isStageUnlocked(stageId) {
    const index = stageIndex(stageId);
    return index === 0 || state.completedStages.includes(unit.stages[index - 1].id);
  }

  function currentUnlockedStage() {
    return unit.stages.find((stage) => isStageUnlocked(stage.id) && !state.completedStages.includes(stage.id)) || unit.stages[unit.stages.length - 1];
  }

  function renderSubjectCard() {
    const card = document.querySelector('[data-learning-subject="mathematics"].learning-subject-entry');
    if (!card) return;
    const stage = currentUnlockedStage();
    const progress = Math.round((state.completedStages.length / unit.stages.length) * 100);
    const completedUnits = state.completedStages.includes("final") ? 1 : 0;
    const description = card.querySelector("p");
    const bar = document.getElementById("mathLearningProgressBar");
    const percent = document.getElementById("mathLearningProgressText");
    if (description) description.textContent = `중2-상 · ${stage.title} · 완료 ${completedUnits}/1단원`;
    if (bar) bar.style.width = `${progress}%`;
    if (percent) percent.textContent = `${progress}%`;
  }

  function largeNumberTestQuestions() {
    return (window.generatedConceptBanks?.g4 || []).filter((question) => question.unit === "큰 수").slice(0, 10);
  }

  function recordLargeNumberWrong(question, selectedAnswer) {
    if (!question) return;
    recordWrong({
      id: question.questionId,
      subject: "수학",
      grade: question.grade,
      semester: "",
      unit: question.unit,
      concept: question.conceptId,
      stage: "large-number-test",
      question: question.questionText,
      answer: question.answer,
      explanation: question.explanation,
    }, selectedAnswer);
  }

  function renderLearningMap() {
    const progress = Math.round((state.completedStages.length / unit.stages.length) * 100);
    const current = currentUnlockedStage();
    const status = document.getElementById("learningMapStatus");
    const progressText = document.getElementById("learningMapProgress");
    const progressBar = document.getElementById("learningMapProgressBar");
    const completed = document.getElementById("learningCompletedStages");
    const map = document.getElementById("learningStageMap");
    const title = document.getElementById("learningMapCourseTitle");
    const heading = document.getElementById("learningMapHeading");
    const startButton = document.getElementById("learningMapStartButton");

    if (!map) return;

    const previousStepTree = map.querySelector(".math-horizontal-step-tree");
    const previousStepTreeScrollLeft = previousStepTree ? previousStepTree.scrollLeft : null;
    const previousPageX = window.scrollX || 0;
    const previousPageY = window.scrollY || 0;
    const restoreLargeNumberPosition = (selectedIndex) => {
      requestAnimationFrame(() => {
        const nextStepTree = map.querySelector(".math-horizontal-step-tree");
        if (nextStepTree) {
          if (previousStepTreeScrollLeft !== null) {
            nextStepTree.scrollLeft = previousStepTreeScrollLeft;
          } else {
            const selectedButton = nextStepTree.querySelector(`[data-large-number-step="${selectedIndex}"]`);
            if (selectedButton) {
              nextStepTree.scrollLeft = Math.max(0, selectedButton.offsetLeft - ((nextStepTree.clientWidth - selectedButton.offsetWidth) / 2));
            }
          }
        }
        window.scrollTo(previousPageX, previousPageY);
      });
    };

    map.className = "english-roadmap-list math-roadmap-list";
    if (state.mapView === "large-number") {
      const completedSteps = [...new Set(state.largeNumberCompletedSteps || [])].filter((index) => index >= 0 && index < largeNumberSteps.length);
      const currentStepIndex = Math.min(completedSteps.length, largeNumberSteps.length - 1);
      const selectedStepIndex = Math.min(Number(state.largeNumberStepIndex) || 0, currentStepIndex);
      const selectedStep = largeNumberSteps[selectedStepIndex];
      const testQuestions = largeNumberTestQuestions();
      const testQuestion = testQuestions[Math.min(Number(state.largeNumberTestIndex) || 0, Math.max(testQuestions.length - 1, 0))];
      const stepPercent = Math.round((completedSteps.length / largeNumberSteps.length) * 100);
      if (title) title.textContent = "큰 수";
      if (heading) heading.textContent = "큰 수 10단계 학습";
      if (status) status.textContent = `${selectedStep.code}. ${selectedStep.title}`;
      if (progressText) progressText.textContent = `${stepPercent}%`;
      if (progressBar) progressBar.style.width = `${stepPercent}%`;
      if (completed) completed.textContent = `${completedSteps.length} / ${largeNumberSteps.length} 완료`;
      if (startButton) startButton.hidden = true;
      const stepTree = `<nav class="math-horizontal-step-tree" aria-label="큰 수 학습 단계">${largeNumberSteps.map((step, index) => {
        const complete = completedSteps.includes(index);
        const currentStep = !complete && index === currentStepIndex;
        const available = complete || currentStep;
        return `<button type="button" class="${complete ? "is-complete" : currentStep ? "is-current" : "is-locked"}" data-learning-action="${available ? "open-large-number-step" : ""}" data-large-number-step="${index}" ${available ? "" : "disabled"}><b>${complete ? "✓" : available ? step.code : "🔒"}</b><span>${step.title}</span></button>`;
      }).join("")}</nav>`;
      if (selectedStepIndex === largeNumberSteps.length - 1 && testQuestion) {
        const answered = ["correct", "revealed"].includes(state.largeNumberTestFeedback);
        const answeredCorrectly = state.largeNumberTestFeedback === "correct";
        const hint = "자릿값과 단위를 먼저 확인한 뒤, 필요한 계산을 한 단계씩 나누어 보세요.";
        const explanation = testQuestion.explanation || `정답은 ${testQuestion.answer}입니다.`;
        map.className = "math-large-number-study";
        map.innerHTML = `${stepTree}<article class="math-large-number-card math-large-number-test"><span>${selectedStep.code} · 문제 ${Number(state.largeNumberTestIndex || 0) + 1} / ${testQuestions.length}</span><h2>${escapeHtml(testQuestion.questionText)}</h2><div class="math-large-number-choices">${testQuestion.choices.map((choice) => `<button type="button" class="${state.largeNumberTestSelected === choice ? answeredCorrectly ? "is-correct" : state.largeNumberTestFeedback === "wrong" ? "is-wrong" : "is-selected" : ""}" data-learning-action="answer-large-number-test" data-large-number-answer="${escapeHtml(choice)}" ${answered ? "disabled" : ""}>${escapeHtml(choice)}</button>`).join("")}</div>${state.largeNumberTestFeedback ? `<p class="math-large-number-feedback ${answeredCorrectly ? "is-correct" : "is-wrong"}">${answeredCorrectly ? "정답입니다." : state.largeNumberTestFeedback === "revealed" ? `정답은 ${escapeHtml(testQuestion.answer)}입니다. ${escapeHtml(explanation)}` : "정답이 아닙니다. 다시 선택해 보세요."}</p>` : state.largeNumberTestHintVisible ? `<p class="math-large-number-feedback">힌트 · ${escapeHtml(hint)}</p>` : ""}</article><div class="learning-question-actions math-large-number-test-actions"><button type="button" class="learning-secondary-button" data-learning-action="previous-large-number-question">이전</button><button type="button" class="learning-secondary-button" data-learning-action="show-large-number-hint">힌트</button><button type="button" class="learning-secondary-button" data-learning-action="show-large-number-explanation">풀이 보기</button><button type="button" class="learning-secondary-button" data-learning-action="open-large-number-notebook">계산 노트</button><button type="button" class="learning-secondary-button math-large-number-end-button" data-learning-action="end-large-number-test">여기까지</button><button type="button" class="learning-primary-button" data-learning-action="submit-large-number-answer">${answered ? Number(state.largeNumberTestIndex || 0) === testQuestions.length - 1 ? "결과 보기" : "다음 문제" : "정답 확인"}</button></div><section class="learning-notebook" id="largeNumberNotebook" hidden><div><b>계산 노트</b><button type="button" data-learning-action="clear-large-number-notebook">지우기</button><button type="button" data-learning-action="close-large-number-notebook">닫기</button></div><canvas id="largeNumberNotebookCanvas" aria-label="손글씨 계산 노트"></canvas></section>`;
        restoreLargeNumberPosition(selectedStepIndex);
        return;
      }
      map.className = "math-large-number-study";
      const continuousModes = mathLessonModes.slice(0, -1);
      const selectedModeIndex = Math.max(0, Math.min(Number(state.largeNumberModeIndex) || 0, continuousModes.length - 1));
      const selectedMode = continuousModes[selectedModeIndex];
      const nextMode = continuousModes[selectedModeIndex + 1];
      const modeFlow = `<section class="math-continuous-learning"><header><strong>단원학습부터 시작해요</strong><small>개념과 예시를 먼저 익힌 뒤 문제풀이가 순서대로 열립니다.</small></header><nav class="math-lesson-mode-flow" aria-label="수학 연속 학습 순서">${continuousModes.map((mode, index) => {
        const isFutureMode = index > selectedModeIndex;
        return `<button type="button" class="${index < selectedModeIndex ? "is-passed" : index === selectedModeIndex ? "is-current" : "is-upcoming"}" data-learning-action="${isFutureMode ? "" : "select-large-number-mode"}" data-math-mode="${index}" aria-current="${index === selectedModeIndex ? "step" : "false"}" ${isFutureMode ? "disabled" : ""}><b>${index < selectedModeIndex ? "✓" : isFutureMode ? "🔒" : mode.icon}</b><span><strong>${mode.title}</strong><small>${mode.repeatable ? "계속 연습 가능" : index === 0 ? "개념과 예시" : "필수 연습"}</small></span><em>${index === selectedModeIndex ? "학습 중" : index < selectedModeIndex ? "다시 보기" : index === 1 ? "단원학습 후" : "앞 학습 후"}</em></button>`;
      }).join("")}</nav></section>`;
      const primaryActionText = selectedModeIndex === 0 ? "단원학습 완료 · 기본 시작" : nextMode ? `다음: ${nextMode.title}` : selectedStepIndex === largeNumberSteps.length - 2 ? "단원평가로 이동" : "다음 소단원으로";
      map.innerHTML = `${stepTree}${modeFlow}<article class="math-large-number-card"><span>${selectedStep.code} · ${selectedMode.icon} ${selectedMode.title}</span><h2>${selectedStep.title}</h2><p>${selectedStep.body}</p><strong>${selectedStep.example}</strong></article><div class="math-large-number-actions"><button type="button" data-learning-action="previous-large-number-mode" ${selectedModeIndex > 0 ? "" : "disabled"}>이전 학습</button><button type="button" data-learning-action="advance-large-number-mode">${primaryActionText}</button></div>`;
      restoreLargeNumberPosition(selectedStepIndex);
      return;
    }
    if (state.mapView === "world") {
      const worldIndex = Math.max(0, Math.min(Number(state.selectedDomainIndex) || 0, mathWorlds.length - 1));
      const world = mathWorlds[worldIndex];
      const savedWorldTopics = state.completedMathWorldTopics?.[worldIndex];
      const completedTopics = [...new Set(Array.isArray(savedWorldTopics) ? savedWorldTopics : worldIndex === 0 ? state.numberOperationCompletedTopics || [] : [])];
      const currentTopicIndex = Math.min(completedTopics.length, world.topics.length - 1);
      const topicPercent = Math.round((completedTopics.length / world.topics.length) * 100);
      if (title) title.textContent = `World ${worldIndex + 1}. ${world.title}`;
      if (heading) heading.textContent = `${world.title} 학습 트리`;
      if (status) status.textContent = `${world.topics[currentTopicIndex]}부터 순서대로 학습해요.`;
      if (progressText) progressText.textContent = `${topicPercent}%`;
      if (progressBar) progressBar.style.width = `${topicPercent}%`;
      if (completed) completed.textContent = `${completedTopics.length} / ${world.topics.length} 완료`;
      if (startButton) startButton.hidden = true;
      map.innerHTML = world.topics.map((topic, index) => {
        const complete = completedTopics.includes(index);
        const currentTopic = !complete && index === currentTopicIndex;
        const available = complete || currentTopic;
        return `<article class="${complete ? "is-complete" : currentTopic ? "is-current" : "is-locked"}">
          <i aria-hidden="true"></i><button type="button" ${available ? `data-learning-action="open-math-world-topic" data-math-topic="${index}"` : "disabled"}>
            <b>${index + 1}</b><span><strong>${topic}</strong><small>${complete ? "학습 완료" : currentTopic ? "현재 학습" : "앞 단원 완료 후 열림"}</small></span><em>›</em>
          </button>
        </article>`;
      }).join("") + `<article class="english-roadmap-finish ${completedTopics.length === world.topics.length ? "is-complete" : "is-locked"}"><i aria-hidden="true"></i><button type="button" disabled><b>${completedTopics.length === world.topics.length ? "🏆" : "🔒"}</b><span><strong>${world.master}</strong><small>${completedTopics.length} / ${world.topics.length} · 모든 단원을 완료하면 열려요.</small></span><em>›</em></button></article>`;
      return;
    }

    const selectedDomain = Number.isInteger(state.selectedDomainIndex) ? state.selectedDomainIndex : null;
    if (title) title.textContent = selectedDomain === null ? "수학 전체 과정" : mathWorlds[selectedDomain]?.title || "수학 전체 과정";
    if (heading) heading.textContent = "수학 학습 로드맵";
    if (status) status.textContent = "모든 영역이 열려 있어요. 학습할 영역을 선택하세요.";
    if (progressText) progressText.textContent = "전체 해금";
    if (progressBar) progressBar.style.width = "100%";
    if (completed) completed.textContent = "7개 World 모두 선택 가능";
    if (startButton) startButton.hidden = true;
    map.innerHTML = mathWorlds.map((world, index) => {
      return `<article class="is-open">
        <i aria-hidden="true"></i><button type="button" data-learning-action="open-math-domain" data-math-domain="${index}">
          <b>${index + 1}</b>
          <span><strong>World ${index + 1}. ${world.title}</strong><small>${world.topics.length}개 단원 · 학습 가능</small></span><em>›</em>
        </button>
      </article>`;
    }).join("");
  }

  function shuffledQuestionIds(stage) {
    const stageIndex = unit.stages.findIndex((item) => item.id === stage.id);
    const previousStages = unit.stages.slice(0, Math.max(0, stageIndex));
    const cumulativeReviewTarget = stage.id === "final" ? 6 : 4;
    const previousIds = [];
    let round = 0;

    while (previousIds.length < cumulativeReviewTarget && previousStages.length) {
      let added = false;
      [...previousStages].reverse().forEach((previousStage, offset) => {
        if (previousIds.length >= cumulativeReviewTarget || !previousStage.questionIds.length) return;
        const questionId = previousStage.questionIds[(stageIndex + round + offset) % previousStage.questionIds.length];
        if (!previousIds.includes(questionId)) {
          previousIds.push(questionId);
          added = true;
        }
      });
      if (!added) break;
      round += 1;
    }

    const reviewIds = stage.id === "repeat" ? state.wrongAnswers
      .filter((item) => item.unit === unit.id && questionById.has(item.id))
      .sort((a, b) => new Date(b.lastSolvedAt) - new Date(a.lastSolvedAt))
      .map((item) => item.id) : [];
    return [...new Set([...reviewIds, ...stage.questionIds, ...previousIds])];
  }

  function newSession(stage, questionIds) {
    const ids = questionIds || shuffledQuestionIds(stage);
    return {
      stageId: stage.id,
      questionIds: ids,
      initialQuestionIds: [...ids],
      index: 0,
      slideIndex: 0,
      conceptSlidesComplete: stage.type !== "concept",
      firstAttemptCorrect: 0,
      countedCorrectIds: [],
      mistakeQuestionIds: [],
      reviewQueue: [],
      isReviewRound: false,
      questionStates: {},
      selectedAnswer: "",
      answeredCurrent: false,
      currentAnswerWasCorrect: false,
      streak: 0,
      maxStreak: 0,
      startedAt: Date.now(),
    };
  }

  function openMathLearning() {
    syncCurrentUserState();
    state.mapView = "domains";
    state.selectedDomainIndex = null;
    saveState();
    renderSubjectCard();
    renderProgressSurfaces();
    renderLearningMap();
    showLearningScreen("learning-map");
  }

  function startStage(stageId, options = {}) {
    const stage = unit.stages.find((item) => item.id === stageId);
    if (!stage || (!isStageUnlocked(stageId) && !options.force)) return;
    state.currentStage = stageId;
    state.activeSession = options.resume && state.activeSession?.stageId === stageId
      ? state.activeSession
      : newSession(stage, options.questionIds);
    const session = state.activeSession;
    session.initialQuestionIds = session.initialQuestionIds || [...session.questionIds];
    session.countedCorrectIds = Array.isArray(session.countedCorrectIds)
      ? session.countedCorrectIds
      : [...session.questionIds.slice(0, session.firstAttemptCorrect || 0)];
    session.reviewQueue = Array.isArray(session.reviewQueue) ? session.reviewQueue : [];
    session.questionStates = session.questionStates && typeof session.questionStates === "object"
      ? session.questionStates
      : {};
    session.isReviewRound = Boolean(session.isReviewRound);
    if (session.isReviewRound && session.reviewStateVersion !== 1) {
      session.questionIds.forEach((questionId) => {
        delete session.questionStates[questionId];
      });
      session.reviewStateVersion = 1;
    }
    if (options.skipSlides && stage.type === "concept") {
      state.activeSession.conceptSlidesComplete = true;
    }
    saveState();
    showLearningScreen("learning-lesson");
    renderLesson();
  }

  function renderLesson() {
    const session = state.activeSession;
    const stage = unit.stages.find((item) => item.id === session?.stageId);
    if (!session || !stage) {
      renderLearningMap();
      showLearningScreen("learning-map");
      return;
    }

    document.getElementById("learningLessonTitle").textContent = stage.title;
    const conceptCard = document.getElementById("learningConceptCard");
    const questionWrap = document.getElementById("learningQuestionWrap");
    const showingSlides = stage.type === "concept" && !session.conceptSlidesComplete;

    conceptCard.hidden = !showingSlides;
    questionWrap.hidden = showingSlides;
    if (showingSlides) renderConceptSlide();
    else renderQuestion();
  }

  function renderConceptSlide() {
    const session = state.activeSession;
    const slide = unit.slides[session.slideIndex];
    const total = unit.slides.length;
    document.getElementById("learningConceptEyebrow").textContent = `핵심 개념 ${session.slideIndex + 1} / ${total}`;
    document.getElementById("learningConceptTitle").textContent = slide.title;
    document.getElementById("learningConceptBody").textContent = slide.body;
  document.getElementById("learningConceptFormula").innerHTML = formatMathText(slide.formula);
  document.getElementById("learningConceptExample").innerHTML = `예시 · ${formatMathText(slide.example)}`;
    const progress = ((session.slideIndex + 1) / (total + session.questionIds.length)) * 100;
    document.getElementById("learningLessonProgressBar").style.width = `${progress}%`;
    document.getElementById("learningLessonProgressText").textContent = `개념 ${session.slideIndex + 1}/${total}`;
    const button = document.querySelector('[data-learning-action="next-concept"]');
    if (button) button.textContent = session.slideIndex === total - 1 ? "예제 문제 풀기" : "다음";
    const previous = document.querySelector('[data-learning-action="previous-concept"]');
    if (previous) previous.disabled = session.slideIndex === 0;
  }

  function difficultyLabel(level) {
    if (level <= 2) return "하";
    if (level === 3) return "중";
    return "상";
  }

  function renderQuestion() {
    const session = state.activeSession;
    const stage = unit.stages.find((item) => item.id === session.stageId);
    const question = questionById.get(session.questionIds[session.index]);
    if (!question) {
      finishStage();
      return;
    }

    const total = session.questionIds.length;
    const slideOffset = stage.type === "concept" ? unit.slides.length : 0;
    const progress = ((slideOffset + session.index + 1) / (slideOffset + total)) * 100;
    document.getElementById("learningLessonProgressBar").style.width = `${progress}%`;
    document.getElementById("learningLessonProgressText").textContent = session.isReviewRound
      ? `오답 복습 ${session.index + 1} / ${total}`
      : `${session.index + 1} / ${total}`;
    document.getElementById("learningQuestionNumber").textContent = session.isReviewRound ? `오답 복습 ${session.index + 1}` : `문제 ${session.index + 1}`;
    document.getElementById("learningQuestionDifficulty").textContent = `난이도 ${difficultyLabel(question.difficulty)}`;
    document.getElementById("learningQuestionConcept").textContent = question.concept;
    document.getElementById("learningQuestionText").innerHTML = formatMathText(question.question);
    const savedQuestionState = session.questionStates?.[question.id];
    session.selectedAnswer = savedQuestionState?.selectedAnswer || "";
    session.answeredCurrent = Boolean(savedQuestionState?.answeredCurrent);
    session.currentAnswerWasCorrect = Boolean(savedQuestionState?.currentAnswerWasCorrect);
    document.getElementById("learningConceptReturn").hidden = wrongCountForConcept(question.concept) < 2;
    renderAnswerArea(question);
    renderRestoredFeedback(question);
  }

  function renderAnswerArea(question) {
    const area = document.getElementById("learningAnswerArea");
    const session = state.activeSession;
    const choices = Array.isArray(question.choices) ? question.choices : multipleChoiceOptions(question);
    if (choices.length) {
      area.innerHTML = choices.map((choice, index) => `
        <button class="learning-choice ${session.selectedAnswer === choice ? "is-selected" : ""}" type="button" data-learning-choice="${escapeHtml(choice)}" ${session.answeredCurrent ? "disabled" : ""}>
          <i>${index + 1}</i><span>${formatMathText(choice)}</span>
        </button>`).join("");
      return;
    }
    area.innerHTML = `<input class="learning-text-answer" id="learningTextAnswer" type="text" inputmode="text" autocomplete="off" placeholder="정답을 입력하세요" value="${escapeHtml(session.selectedAnswer || "")}" ${session.answeredCurrent ? "disabled" : ""} />`;
  }

  function renderRestoredFeedback(question) {
    const session = state.activeSession;
    const feedback = document.getElementById("learningFeedback");
    const title = document.getElementById("learningFeedbackTitle");
    const text = document.getElementById("learningFeedbackText");
    const submit = document.getElementById("learningSubmitButton");
    if (!session.answeredCurrent) {
      feedback.hidden = true;
      feedback.classList.remove("is-wrong");
      submit.textContent = "정답 확인";
      return;
    }
    feedback.hidden = false;
    feedback.classList.toggle("is-wrong", !session.currentAnswerWasCorrect);
    title.textContent = session.currentAnswerWasCorrect ? "정답입니다" : `정답은 ${question.answer}입니다`;
    text.textContent = question.explanation;
    submit.textContent = session.index === session.questionIds.length - 1 ? "결과 보기" : "다음 문제";
  }

  function normalizeAnswer(value) {
    return String(value ?? "")
      .trim()
      .replace(/\s+/g, "")
      .replace(/[−–]/g, "-")
      .replace(/\.\.\./g, "…")
      .toLowerCase();
  }

  function getCurrentAnswer() {
    const session = state.activeSession;
    const textInput = document.getElementById("learningTextAnswer");
    return textInput ? textInput.value : session.selectedAnswer;
  }

  function recordWrong(question, selectedAnswer) {
    const existing = state.wrongAnswers.find((item) => item.id === question.id);
    if (existing) {
      existing.selectedAnswer = selectedAnswer;
      existing.wrongCount += 1;
      existing.lastSolvedAt = new Date().toISOString();
      return;
    }
    state.wrongAnswers.push({
      id: question.id,
      subject: question.subject,
      grade: question.grade,
      semester: question.semester,
      unit: question.unit,
      concept: question.concept,
      stage: question.stage,
      problem: question.question,
      selectedAnswer,
      answer: question.answer,
      explanation: question.explanation,
      wrongCount: 1,
      lastSolvedAt: new Date().toISOString(),
    });
  }

  function wrongCountForConcept(concept) {
    return state.wrongAnswers
      .filter((item) => item.unit === unit.id && item.concept === concept)
      .reduce((sum, item) => sum + item.wrongCount, 0);
  }

  function submitCurrentAnswer() {
    const session = state.activeSession;
    const question = questionById.get(session?.questionIds[session.index]);
    if (!session || !question) return;
    if (session.answeredCurrent) {
      goToNextQuestion();
      return;
    }

    const answer = getCurrentAnswer();
    if (!String(answer || "").trim()) {
      showFeedback(false, "정답을 먼저 선택하거나 입력해 주세요.", "답을 확인한 뒤 다음 문제로 이동할 수 있어요.");
      return;
    }

    session.selectedAnswer = String(answer).trim();
    const correct = normalizeAnswer(answer) === normalizeAnswer(question.answer);
    recordDailyAnswer(question, correct);
    document.dispatchEvent(new CustomEvent("study:learning-answer", { detail: { questionId: question.id, correct, subject: question.subject } }));
    if (correct) {
      if (!session.countedCorrectIds.includes(question.id)) {
        session.countedCorrectIds.push(question.id);
        session.firstAttemptCorrect += 1;
        session.streak += 1;
        session.maxStreak = Math.max(session.maxStreak, session.streak);
      }
      session.answeredCurrent = true;
      session.currentAnswerWasCorrect = true;
      session.questionStates[question.id] = {
        selectedAnswer: session.selectedAnswer,
        answeredCurrent: true,
        currentAnswerWasCorrect: true,
      };
      showFeedback(true, "정답입니다", question.explanation);
      document.getElementById("learningSubmitButton").textContent = session.index === session.questionIds.length - 1 ? "결과 보기" : "다음 문제";
      renderAnswerArea(question);
    } else {
      if (!session.mistakeQuestionIds.includes(question.id)) session.mistakeQuestionIds.push(question.id);
      if (!session.reviewQueue.includes(question.id)) session.reviewQueue.push(question.id);
      session.streak = 0;
      recordWrong(question, session.selectedAnswer);
      session.answeredCurrent = true;
      session.currentAnswerWasCorrect = false;
      session.questionStates[question.id] = {
        selectedAnswer: session.selectedAnswer,
        answeredCurrent: true,
        currentAnswerWasCorrect: false,
      };
      showFeedback(false, `정답은 ${question.answer}입니다`, question.explanation);
      renderAnswerArea(question);
      document.getElementById("learningSubmitButton").textContent = session.index === session.questionIds.length - 1 ? "결과 보기" : "다음 문제";
      document.getElementById("learningConceptReturn").hidden = wrongCountForConcept(question.concept) < 2;
    }
    saveState();
    if (!correct) openMathWrongNote();
  }

  function showFeedback(correct, titleText, bodyText) {
    const feedback = document.getElementById("learningFeedback");
    feedback.hidden = false;
    feedback.classList.toggle("is-wrong", !correct);
    document.getElementById("learningFeedbackTitle").textContent = titleText;
    document.getElementById("learningFeedbackText").textContent = bodyText;
  }

  function showCurrentHint() {
    const session = state.activeSession;
    const question = questionById.get(session?.questionIds[session?.index]);
    if (!session || !question || session.answeredCurrent) return;
    showFeedback(true, "힌트", question.hint || "문제의 조건과 단위를 먼저 표시하고, 필요한 개념을 한 단계씩 적용해 보세요.");
  }

  function openMathWrongNote() {
    const modal = document.getElementById("mathWrongNoteModal");
    const list = document.getElementById("mathWrongNoteList");
    if (!modal || !list) return;
    const wrongAnswers = [...(state.wrongAnswers || [])].sort((a, b) => String(b.lastSolvedAt || "").localeCompare(String(a.lastSolvedAt || "")));
    list.innerHTML = wrongAnswers.length ? wrongAnswers.map((item, index) => `<article>
      <small>${escapeHtml(item.grade || "수학")} · ${escapeHtml(item.unit || "수학")} · ${Number(item.wrongCount || 1)}회</small>
      <strong>${index + 1}. ${escapeHtml(item.problem || "문제 내용")}</strong>
      <span>내 답: ${escapeHtml(item.selectedAnswer || "풀이 보기")}</span>
      <span>정답: ${escapeHtml(item.answer)}</span>
      <em>${escapeHtml(item.explanation || "해설을 확인하고 다시 풀어보세요.")}</em>
      <button type="button" data-learning-action="retry-wrong-item" data-wrong-question-id="${escapeHtml(item.id)}">이 문제 다시 풀기</button>
    </article>`).join("") : '<div class="math-wrong-note-empty">아직 저장된 오답이 없어요.</div>';
    modal.hidden = false;
  }

  function closeMathWrongNote() {
    const modal = document.getElementById("mathWrongNoteModal");
    if (modal) modal.hidden = true;
  }

  function retryMathWrongQuestion(questionId) {
    const regularQuestion = questionById.get(questionId);
    closeMathWrongNote();
    if (regularQuestion) return startStage(regularQuestion.stage, { questionIds: [regularQuestion.id], force: true, skipSlides: true });
    const largeNumberIndex = largeNumberTestQuestions().findIndex((question) => question.questionId === questionId);
    if (largeNumberIndex < 0) return;
    state.mapView = "large-number";
    state.largeNumberStepIndex = largeNumberSteps.length - 1;
    state.largeNumberTestIndex = largeNumberIndex;
    state.largeNumberTestSelected = "";
    state.largeNumberTestFeedback = null;
    state.largeNumberTestHintVisible = false;
    state.largeNumberTestExplanationVisible = false;
    saveState();
    renderLearningMap();
    showLearningScreen("learning-map");
  }

  function revealCurrentAnswer() {
    const session = state.activeSession;
    const question = questionById.get(session?.questionIds[session.index]);
    if (!session || !question || session.answeredCurrent) return;
    if (!session.mistakeQuestionIds.includes(question.id)) session.mistakeQuestionIds.push(question.id);
    recordWrong(question, "풀이 보기");
    recordDailyAnswer(question, false);
    document.dispatchEvent(new CustomEvent("study:learning-answer", { detail: { questionId: question.id, correct: false, subject: question.subject } }));
    session.selectedAnswer = "";
    session.answeredCurrent = true;
    session.currentAnswerWasCorrect = false;
    session.questionStates[question.id] = {
      selectedAnswer: "",
      answeredCurrent: true,
      currentAnswerWasCorrect: false,
    };
    session.streak = 0;
    showFeedback(false, `정답은 ${question.answer}입니다`, question.explanation);
    document.getElementById("learningSubmitButton").textContent = session.index === session.questionIds.length - 1 ? "결과 보기" : "다음 문제";
    renderAnswerArea(question);
    saveState();
  }

  let notebookDrawing = false;
  let notebookLastPoint = null;
  function notebookQuestionId() {
    return state.activeSession?.questionIds[state.activeSession?.index] || "";
  }
  function notebookCanvas() { return document.getElementById("learningNotebookCanvas"); }
  function saveNotebook() {
    const canvas = notebookCanvas();
    const id = notebookQuestionId();
    if (!canvas || !id) return;
    state.notes[id] = canvas.toDataURL("image/png");
    saveState();
  }
  function paintNotebook(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    const context = canvas.getContext("2d");
    context.scale(ratio, ratio);
    context.fillStyle = "#fffdf8";
    context.fillRect(0, 0, rect.width, rect.height);
    const saved = state.notes[notebookQuestionId()];
    if (saved) {
      const image = new Image();
      image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
      image.src = saved;
    }
  }
  function openNotebook() {
    const wrap = document.getElementById("learningNotebook");
    const canvas = notebookCanvas();
    if (!wrap || !canvas) return;
    wrap.hidden = false;
    paintNotebook(canvas);
    if (canvas.dataset.ready) return;
    canvas.dataset.ready = "true";
    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    canvas.addEventListener("pointerdown", (event) => {
      notebookDrawing = true;
      notebookLastPoint = point(event);
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!notebookDrawing) return;
      const next = point(event);
      const context = canvas.getContext("2d");
      context.strokeStyle = "#26343a";
      context.lineWidth = 2.4;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(notebookLastPoint.x, notebookLastPoint.y);
      context.lineTo(next.x, next.y);
      context.stroke();
      notebookLastPoint = next;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((name) => canvas.addEventListener(name, () => {
      if (notebookDrawing) saveNotebook();
      notebookDrawing = false;
    }));
  }
  function clearNotebook() {
    delete state.notes[notebookQuestionId()];
    saveState();
    const canvas = notebookCanvas();
    if (canvas) paintNotebook(canvas);
  }

  function largeNumberNotebookKey() {
    return `large-number-test-${Number(state.largeNumberTestIndex || 0)}`;
  }

  function paintLargeNumberNotebook() {
    const canvas = document.getElementById("largeNumberNotebookCanvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    const context = canvas.getContext("2d");
    context.scale(ratio, ratio);
    context.fillStyle = "#fffdf8";
    context.fillRect(0, 0, rect.width, rect.height);
    const saved = state.notes[largeNumberNotebookKey()];
    if (saved) {
      const image = new Image();
      image.onload = () => context.drawImage(image, 0, 0, rect.width, rect.height);
      image.src = saved;
    }
  }

  function openLargeNumberNotebook() {
    const wrap = document.getElementById("largeNumberNotebook");
    const canvas = document.getElementById("largeNumberNotebookCanvas");
    if (!wrap || !canvas) return;
    wrap.hidden = false;
    paintLargeNumberNotebook();
    if (canvas.dataset.ready) return;
    canvas.dataset.ready = "true";
    let drawing = false;
    let lastPoint = null;
    const point = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    canvas.addEventListener("pointerdown", (event) => {
      drawing = true;
      lastPoint = point(event);
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const next = point(event);
      const context = canvas.getContext("2d");
      context.strokeStyle = "#26343a";
      context.lineWidth = 2.4;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(next.x, next.y);
      context.stroke();
      lastPoint = next;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((name) => canvas.addEventListener(name, () => {
      if (drawing) {
        state.notes[largeNumberNotebookKey()] = canvas.toDataURL("image/png");
        saveState();
      }
      drawing = false;
    }));
  }

  function clearLargeNumberNotebook() {
    delete state.notes[largeNumberNotebookKey()];
    saveState();
    paintLargeNumberNotebook();
  }

  function advanceLargeNumberTest() {
    if (!state.largeNumberTestFeedback) return;
    const questions = largeNumberTestQuestions();
    const testIndex = Number(state.largeNumberTestIndex || 0);
    if (testIndex < questions.length - 1) {
      state.largeNumberTestIndex = testIndex + 1;
      state.largeNumberTestSelected = "";
      state.largeNumberTestFeedback = null;
      state.largeNumberTestHintVisible = false;
      state.largeNumberTestExplanationVisible = false;
      saveState();
      return renderLearningMap();
    }
    state.largeNumberCompletedSteps = [...new Set([...(state.largeNumberCompletedSteps || []), largeNumberSteps.length - 1])].sort((a, b) => a - b);
    state.completedMathWorldTopics = state.completedMathWorldTopics || {};
    state.completedMathWorldTopics[0] = [...new Set([...(state.completedMathWorldTopics[0] || []), 0])].sort((a, b) => a - b);
    state.numberOperationCompletedTopics = [...new Set([...(state.numberOperationCompletedTopics || []), 0])];
    state.largeNumberTestIndex = 0;
    state.largeNumberTestSelected = "";
    state.largeNumberTestFeedback = null;
    state.largeNumberTestHintVisible = false;
    state.largeNumberTestExplanationVisible = false;
    state.mapView = "world";
    saveState();
    return renderLearningMap();
  }

  function goToNextQuestion() {
    const session = state.activeSession;
    if (session.index >= session.questionIds.length - 1) {
      if (session.reviewQueue.length) {
        const reviewQuestionIds = [...session.reviewQueue];
        reviewQuestionIds.forEach((questionId) => {
          delete session.questionStates[questionId];
        });
        session.questionIds = reviewQuestionIds;
        session.reviewQueue = [];
        session.index = 0;
        session.isReviewRound = true;
        session.reviewStateVersion = 1;
        session.selectedAnswer = "";
        session.answeredCurrent = false;
        session.currentAnswerWasCorrect = false;
        saveState();
        renderQuestion();
        window.scrollTo?.(0, 0);
        return;
      }
      finishStage();
      return;
    }
    session.index += 1;
    session.selectedAnswer = "";
    session.answeredCurrent = false;
    session.currentAnswerWasCorrect = false;
    saveState();
    renderQuestion();
    window.scrollTo?.(0, 0);
  }

  function goToPreviousQuestion() {
    const session = state.activeSession;
    const stage = unit.stages.find((item) => item.id === session?.stageId);
    if (!session || !stage) return;

    if (session.index > 0) {
      session.index -= 1;
      saveState();
      renderQuestion();
      window.scrollTo?.(0, 0);
      return;
    }

    if (stage.type === "concept" && session.conceptSlidesComplete) {
      session.conceptSlidesComplete = false;
      session.slideIndex = Math.max(0, unit.slides.length - 1);
      saveState();
      renderLesson();
      window.scrollTo?.(0, 0);
    }
  }

  function weakConceptFromSession(session) {
    const counts = {};
    session.mistakeQuestionIds.forEach((id) => {
      const concept = questionById.get(id)?.concept;
      if (concept) counts[concept] = (counts[concept] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "없음";
  }

  function playStageCoinJingle() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    if (context.state === "suspended") context.resume?.();
    const start = context.currentTime;
    const notes = [
      [880, 0.7, 0.11], [1175, 0.82, 0.1], [1480, 0.94, 0.11],
      [1047, 1.06, 0.08], [1760, 1.18, 0.12], [1320, 1.31, 0.09],
    ];
    notes.forEach(([frequency, offset, volume], index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index % 2 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start + offset);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, start + offset + 0.12);
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(volume, start + offset + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.25);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.27);
    });
    setTimeout(() => context.close(), 2100);
  }

  function playStageRewardAnimation() {
    const scene = document.getElementById("learningRewardChest");
    if (!scene || !latestResult?.passed) return;
    scene.hidden = false;
    scene.classList.remove("is-playing");
    void scene.offsetWidth;
    scene.classList.add("is-playing");
    playStageCoinJingle();
  }

  function finishStage() {
    const session = state.activeSession;
    const stage = unit.stages.find((item) => item.id === session.stageId);
    const total = session.initialQuestionIds?.length || session.questionIds.length;
    const accuracy = Math.round((session.firstAttemptCorrect / total) * 100);
    const passed = accuracy >= stage.passScore;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
    const wrongCount = session.mistakeQuestionIds.length;
    const weakConcept = weakConceptFromSession(session);
    const earnedXp = session.firstAttemptCorrect * 10;
    const firstCompletion = passed && !state.completedStages.includes(stage.id);
    const completionBonus = firstCompletion ? 20 : 0;
    const earnedCoins = session.firstAttemptCorrect * 2 + completionBonus;

    state.stageScores[stage.id] = {
      correct: session.firstAttemptCorrect,
      total,
      accuracy,
      elapsedSeconds,
      passed,
      maxStreak: session.maxStreak,
      weakConcept,
      completedAt: new Date().toISOString(),
    };
    if (firstCompletion) state.completedStages.push(stage.id);
    state.xp += earnedXp;
    state.coins += earnedCoins;
    if (firstCompletion) {
      window.STUDY_REWARDS?.showCoinReward(completionBonus, `${stage.title} 완료 보상`);
      window.STUDY_SOCIAL?.addPoints?.(completionBonus, `${stage.title} 완료`);
    }
    latestResult = {
      stageId: stage.id,
      questionIds: [...(session.initialQuestionIds || session.questionIds)],
      wrongQuestionIds: [...session.mistakeQuestionIds],
      correct: session.firstAttemptCorrect,
      total,
      accuracy,
      passed,
      earnedXp,
      earnedCoins,
      maxStreak: session.maxStreak,
      wrongCount,
      weakConcept,
      elapsedSeconds,
    };
    state.latestResult = latestResult;
    state.activeSession = null;
    saveState();
    renderStageResult();
    showLearningScreen("learning-stage-result");
    playStageRewardAnimation();
  }

  function renderStageResult() {
    if (!latestResult) return;
    const stage = unit.stages.find((item) => item.id === latestResult.stageId);
    const next = unit.stages[stageIndex(stage.id) + 1];
    document.getElementById("learningResultStageTitle").textContent = stage.title;
    document.getElementById("learningResultBadge").textContent = latestResult.passed ? (stage.id === "final" ? "★" : "✓") : "↻";
    document.getElementById("learningResultTitle").textContent = latestResult.passed ? "단계를 완료했어요!" : "조금 더 연습해볼까요?";
    document.getElementById("learningResultMessage").textContent = latestResult.passed ? (next ? "다음 단계가 열렸어요." : "1단원 학습을 모두 마쳤어요.") : `통과 기준은 ${stage.passScore}%예요.`;
    document.getElementById("learningResultCorrect").textContent = `${latestResult.correct} / ${latestResult.total}`;
    document.getElementById("learningResultAccuracy").textContent = `${latestResult.accuracy}%`;
    document.getElementById("learningResultXp").textContent = `+${latestResult.earnedXp} XP`;
    document.getElementById("learningResultCoins").textContent = `+${latestResult.earnedCoins}`;
    document.getElementById("learningResultStreak").textContent = `${latestResult.maxStreak}`;
    document.getElementById("learningResultWrong").textContent = `${latestResult.wrongCount}`;
    document.getElementById("learningResultTime").textContent = `${Math.floor(latestResult.elapsedSeconds / 60)}분 ${latestResult.elapsedSeconds % 60}초`;
    document.getElementById("learningResultWeak").textContent = latestResult.weakConcept;
    document.getElementById("learningResultRecommendation").textContent = latestResult.weakConcept === "없음" ? "안정적으로 이해하고 있어요." : `${latestResult.weakConcept} 설명과 반복 문제를 다시 확인해보세요.`;
    const rewardChest = document.getElementById("learningRewardChest");
    if (rewardChest) rewardChest.hidden = !latestResult.passed;

    const nextButton = document.getElementById("learningNextStageButton");
    nextButton.hidden = !next;
    nextButton.disabled = !latestResult.passed;
    nextButton.textContent = latestResult.passed ? "다음 단계" : "통과 후 다음 단계가 열려요";
    const retryButton = document.getElementById("learningRetryButton");
    retryButton.disabled = latestResult.wrongQuestionIds.length === 0;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMathText(value) {
    return escapeHtml(value).replace(/(-?\d+)\s*\/\s*(\d+)/g, (_, numerator, denominator) => (
      `<span class="math-fraction" aria-label="${denominator}분의 ${numerator}"><span>${numerator}</span><i></i><span>${denominator}</span></span>`
    ));
  }

  function multipleChoiceOptions(question) {
    const answer = String(question.answer);
    const numeric = Number(answer);
    let options;
    if (answer.includes("/")) {
      const [numerator, denominator] = answer.split("/").map(Number);
      options = [answer, `${numerator + 1}/${denominator}`, `${numerator}/${denominator + 1}`, `${Math.max(1, numerator - 1)}/${denominator}`];
    } else if (Number.isFinite(numeric)) {
      const decimalPlaces = (answer.split(".")[1] || "").length;
      const delta = Number.isInteger(numeric) ? 1 : Math.pow(10, -Math.min(2, decimalPlaces || 1));
      options = [answer, String(numeric + delta), String(numeric - delta), String(numeric + delta * 2)];
    } else {
      options = [answer, "0", "1", "2"];
    }
    return [...new Set(options)].slice(0, 4).sort((left, right) => left === answer ? -1 : right === answer ? 1 : left.localeCompare(right));
  }

  function validateContent() {
    const required = ["id", "subject", "grade", "semester", "unit", "concept", "stage", "type", "difficulty", "question", "choices", "answer", "explanation", "hint"];
    const errors = [];
    const ids = new Set();
    unit.stages.forEach((stage) => {
      if (stage.questionIds.length < 5) errors.push(`${stage.id}: 문제 수 부족`);
      stage.questionIds.forEach((id) => {
        const question = questionById.get(id);
        if (!question) errors.push(`${stage.id}: 없는 문제 ${id}`);
        if (ids.has(id)) errors.push(`중복 문제 ID: ${id}`);
        ids.add(id);
        required.forEach((field) => {
          if (question && !Object.prototype.hasOwnProperty.call(question, field)) errors.push(`${id}: ${field} 누락`);
        });
      });
    });
    return { valid: errors.length === 0, errors, questionCount: ids.size };
  }

  function recordPlacementResult(result) {
    syncCurrentUserState();
    state.placementResult = { ...result };
    state.currentUnit = state.currentUnit || "unit1";
    state.currentStage = state.activeSession?.stageId || currentUnlockedStage().id;
    saveState();
    renderSubjectCard();
    renderProgressSurfaces();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest('[data-go="study-empty"]')) {
      syncCurrentUserState();
      renderSubjectCard();
    }

    const subjectTarget = event.target.closest('[data-learning-subject="mathematics"]');
    if (subjectTarget) {
      event.preventDefault();
      openMathLearning();
      return;
    }

    if (event.target.closest("#continueLearningAfterTest")) {
      event.preventDefault();
      openMathLearning();
      return;
    }

    const stageTarget = event.target.closest("[data-learning-stage]");
    if (stageTarget && !stageTarget.disabled) {
      const stageId = stageTarget.dataset.learningStage;
      startStage(stageId, { resume: state.activeSession?.stageId === stageId });
      return;
    }

    const choice = event.target.closest("[data-learning-choice]");
    if (choice && state.activeSession && !state.activeSession.answeredCurrent) {
      state.activeSession.selectedAnswer = choice.dataset.learningChoice;
      document.querySelectorAll(".learning-choice").forEach((button) => button.classList.toggle("is-selected", button === choice));
      saveState();
      return;
    }

    const actionTarget = event.target.closest("[data-learning-action]");
    if (!actionTarget) return;
    const action = actionTarget.dataset.learningAction;
    if (action === "next-concept") {
      const session = state.activeSession;
      if (session.slideIndex < unit.slides.length - 1) session.slideIndex += 1;
      else session.conceptSlidesComplete = true;
      saveState();
      renderLesson();
    } else if (action === "previous-concept") {
      const session = state.activeSession;
      if (session.slideIndex > 0) session.slideIndex -= 1;
      saveState();
      renderLesson();
    } else if (action === "previous-question") {
      goToPreviousQuestion();
    } else if (action === "show-hint") {
      showCurrentHint();
    } else if (action === "show-explanation") {
      const question = questionById.get(state.activeSession?.questionIds[state.activeSession?.index]);
      if (question) showFeedback(false, "풀이", question.explanation);
    } else if (action === "reveal-answer") {
      revealCurrentAnswer();
    } else if (action === "open-math-wrong-note") {
      openMathWrongNote();
    } else if (action === "close-math-wrong-note") {
      closeMathWrongNote();
    } else if (action === "retry-wrong-item") {
      retryMathWrongQuestion(actionTarget.dataset.wrongQuestionId);
    } else if (action === "open-notebook") {
      openNotebook();
    } else if (action === "close-notebook") {
      saveNotebook();
      document.getElementById("learningNotebook").hidden = true;
    } else if (action === "clear-notebook") {
      clearNotebook();
    } else if (action === "submit-answer") {
      submitCurrentAnswer();
    } else if (action === "pause-to-map") {
      renderLearningMap();
      renderSubjectCard();
      showLearningScreen("learning-map");
    } else if (action === "open-math-preview") {
      startStage("concept", { force: true });
    } else if (action === "open-current-math-stage") {
      const active = state.activeSession;
      if (active?.stageId && unit.stages.some((stage) => stage.id === active.stageId)) startStage(active.stageId, { resume: true });
      else startStage(currentUnlockedStage().id, { skipSlides: true });
    } else if (action === "open-math-domain") {
      const domainIndex = Number(actionTarget.dataset.mathDomain);
      state.selectedDomainIndex = domainIndex;
      state.mapView = "world";
      saveState();
      return renderLearningMap();
    } else if (action === "open-math-world-topic") {
      const topicIndex = Number(actionTarget.dataset.mathTopic);
      const worldIndex = Math.max(0, Math.min(Number(state.selectedDomainIndex) || 0, mathWorlds.length - 1));
      const savedWorldTopics = state.completedMathWorldTopics?.[worldIndex];
      const completedTopics = [...new Set(Array.isArray(savedWorldTopics) ? savedWorldTopics : worldIndex === 0 ? state.numberOperationCompletedTopics || [] : [])];
      if (topicIndex > completedTopics.length) return;
      state.selectedMathTopicIndex = topicIndex;
      state.selectedNumberTopicIndex = topicIndex;
      saveState();
      if (worldIndex === 0 && topicIndex === 0) {
        state.mapView = "large-number";
        state.largeNumberStepIndex = Math.min((state.largeNumberCompletedSteps || []).length, largeNumberSteps.length - 1);
        saveState();
        return renderLearningMap();
      }
      const active = state.activeSession;
      if (active?.stageId && unit.stages.some((stage) => stage.id === active.stageId)) startStage(active.stageId, { resume: true });
      else startStage(currentUnlockedStage().id, { skipSlides: true });
    } else if (action === "open-large-number-step") {
      const stepIndex = Number(actionTarget.dataset.largeNumberStep);
      const currentStepIndex = Math.min((state.largeNumberCompletedSteps || []).length, largeNumberSteps.length - 1);
      if (stepIndex > currentStepIndex) return;
      state.largeNumberStepIndex = stepIndex;
      state.largeNumberModeIndex = 0;
      if (stepIndex !== largeNumberSteps.length - 1) {
        state.largeNumberTestSelected = "";
        state.largeNumberTestFeedback = null;
        state.largeNumberTestHintVisible = false;
        state.largeNumberTestExplanationVisible = false;
      }
      saveState();
      return renderLearningMap();
    } else if (action === "previous-large-number-step") {
      state.largeNumberStepIndex = Math.max(0, Number(state.largeNumberStepIndex || 0) - 1);
      state.largeNumberModeIndex = 0;
      saveState();
      return renderLearningMap();
    } else if (action === "previous-large-number-mode") {
      state.largeNumberModeIndex = Math.max(0, Number(state.largeNumberModeIndex || 0) - 1);
      saveState();
      return renderLearningMap();
    } else if (action === "select-large-number-mode") {
      const modeIndex = Number(actionTarget.dataset.mathMode);
      if (modeIndex > Number(state.largeNumberModeIndex || 0)) return;
      state.largeNumberModeIndex = Math.max(0, Math.min(modeIndex, mathLessonModes.length - 2));
      saveState();
      return renderLearningMap();
    } else if (action === "advance-large-number-mode") {
      const lastLearningModeIndex = mathLessonModes.length - 2;
      const modeIndex = Math.max(0, Math.min(Number(state.largeNumberModeIndex) || 0, lastLearningModeIndex));
      if (modeIndex < lastLearningModeIndex) {
        state.largeNumberModeIndex = modeIndex + 1;
        saveState();
        return renderLearningMap();
      }
      const stepIndex = Number(state.largeNumberStepIndex || 0);
      const completedSteps = [...new Set(state.largeNumberCompletedSteps || [])];
      if (stepIndex <= completedSteps.length && !completedSteps.includes(stepIndex)) completedSteps.push(stepIndex);
      state.largeNumberCompletedSteps = completedSteps.sort((a, b) => a - b);
      state.largeNumberStepIndex = Math.min(completedSteps.length, largeNumberSteps.length - 1);
      state.largeNumberModeIndex = 0;
      saveState();
      return renderLearningMap();
    } else if (action === "complete-large-number-step") {
      const stepIndex = Number(state.largeNumberStepIndex || 0);
      const completedSteps = [...new Set(state.largeNumberCompletedSteps || [])];
      if (stepIndex <= completedSteps.length && !completedSteps.includes(stepIndex)) completedSteps.push(stepIndex);
      state.largeNumberCompletedSteps = completedSteps.sort((a, b) => a - b);
      state.largeNumberStepIndex = Math.min(completedSteps.length, largeNumberSteps.length - 1);
      state.largeNumberModeIndex = 0;
      saveState();
      return renderLearningMap();
    } else if (action === "answer-large-number-test") {
      if (["correct", "revealed"].includes(state.largeNumberTestFeedback)) return;
      state.largeNumberTestSelected = actionTarget.dataset.largeNumberAnswer;
      state.largeNumberTestFeedback = null;
      state.largeNumberTestHintVisible = false;
      state.largeNumberTestExplanationVisible = false;
      saveState();
      return renderLearningMap();
    } else if (action === "submit-large-number-answer") {
      if (["correct", "revealed"].includes(state.largeNumberTestFeedback)) return advanceLargeNumberTest();
      if (!state.largeNumberTestSelected) return;
      const questions = largeNumberTestQuestions();
      const question = questions[Math.min(Number(state.largeNumberTestIndex) || 0, Math.max(questions.length - 1, 0))];
      if (!question) return;
      state.largeNumberTestFeedback = String(state.largeNumberTestSelected) === String(question.answer) ? "correct" : "wrong";
      if (state.largeNumberTestFeedback === "wrong") recordLargeNumberWrong(question, state.largeNumberTestSelected);
      state.largeNumberTestHintVisible = false;
      state.largeNumberTestExplanationVisible = false;
      saveState();
      renderLearningMap();
      if (state.largeNumberTestFeedback === "wrong") openMathWrongNote();
      return;
    } else if (action === "show-large-number-hint") {
      if (["correct", "revealed"].includes(state.largeNumberTestFeedback)) return;
      state.largeNumberTestHintVisible = true;
      state.largeNumberTestExplanationVisible = false;
      saveState();
      return renderLearningMap();
    } else if (action === "show-large-number-explanation") {
      const questions = largeNumberTestQuestions();
      const question = questions[Math.min(Number(state.largeNumberTestIndex || 0), Math.max(questions.length - 1, 0))];
      if (!question || ["correct", "revealed"].includes(state.largeNumberTestFeedback)) return;
      recordLargeNumberWrong(question, "풀이 보기");
      state.largeNumberTestFeedback = "revealed";
      state.largeNumberTestHintVisible = false;
      state.largeNumberTestExplanationVisible = true;
      saveState();
      return renderLearningMap();
    } else if (action === "end-large-number-test") {
      state.mapView = "domains";
      state.selectedDomainIndex = null;
      saveState();
      return renderLearningMap();
    } else if (action === "previous-large-number-question") {
      if (Number(state.largeNumberTestIndex || 0) > 0) {
        state.largeNumberTestIndex -= 1;
        state.largeNumberTestSelected = "";
        state.largeNumberTestFeedback = null;
        state.largeNumberTestHintVisible = false;
        state.largeNumberTestExplanationVisible = false;
        saveState();
        return renderLearningMap();
      }
      state.largeNumberStepIndex = Math.max(0, largeNumberSteps.length - 2);
      saveState();
      return renderLearningMap();
    } else if (action === "open-large-number-notebook") {
      return openLargeNumberNotebook();
    } else if (action === "close-large-number-notebook") {
      const notebook = document.getElementById("largeNumberNotebook");
      if (notebook) notebook.hidden = true;
    } else if (action === "clear-large-number-notebook") {
      clearLargeNumberNotebook();
    } else if (action === "next-large-number-test") {
      return advanceLargeNumberTest();
    } else if (action === "math-map-back") {
      if (state.mapView === "large-number") {
        state.mapView = "world";
        saveState();
        return renderLearningMap();
      }
      if (state.mapView !== "domains") {
        state.mapView = "domains";
        state.selectedDomainIndex = null;
        saveState();
        return renderLearningMap();
      }
      showLearningScreen("study-empty");
    } else if (action === "result-to-map") {
      renderLearningMap();
      renderSubjectCard();
      showLearningScreen("learning-map");
    } else if (action === "retry-wrong" && latestResult?.wrongQuestionIds.length) {
      startStage(latestResult.stageId, { questionIds: latestResult.wrongQuestionIds, force: true });
    } else if (action === "next-stage" && latestResult?.passed) {
      const next = unit.stages[stageIndex(latestResult.stageId) + 1];
      if (next) startStage(next.id);
    } else if (action === "return-to-concept") {
      startStage("concept", { force: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    const card = event.target.closest?.('.learning-subject-entry[data-learning-subject="mathematics"]');
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openMathLearning();
    }
  });

  window.addEventListener("beforeunload", saveState);
  window.addEventListener("study:user-changed", () => {
    syncCurrentUserState();
    renderSubjectCard();
    renderProgressSurfaces();
  });
  document.addEventListener("study:social-updated", (event) => {
    renderHomeMissionProgress(event.detail?.state);
  });

  renderSubjectCard();
  renderProgressSurfaces();
  renderLearningMap();
  if (document.querySelector('[data-screen="learning-stage-result"]')?.classList.contains("active") && latestResult) {
    renderStageResult();
    playStageRewardAnimation();
  }
  if (document.querySelector('[data-screen="learning-lesson"]')?.classList.contains("active") && state.activeSession) {
    renderLesson();
  }
  window.STUDY_LEARNING_ENGINE = {
    validateContent,
    getState: () => JSON.parse(JSON.stringify(state)),
    getStorageKey: () => progressKey,
    openMathLearning,
    recordPlacementResult,
  };
})();
