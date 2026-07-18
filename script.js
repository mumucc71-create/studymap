const screens = document.querySelectorAll("[data-screen]");
const buttons = document.querySelectorAll("[data-go]");
const choiceGroups = document.querySelectorAll("[data-choice-group]");
const subjectButtons = document.querySelectorAll("[data-subject]");
const schoolTabs = document.querySelectorAll("[data-school-tab]");
const gradePanels = document.querySelectorAll("[data-grade-panel]");
const testGrade = document.querySelector("#testGrade");
const testSubjects = document.querySelector("#testSubjects");
const dreamJob = document.querySelector("#dreamJob");
const studentName = document.querySelector("#studentName");
const signupUser = document.querySelector("#signupUser");
const signupPassword = document.querySelector("#signupPassword");
const signupButton = document.querySelector("#signupButton");
const signupError = document.querySelector("#signupError");
const signupSuccess = document.querySelector("#signupSuccess");
const roleButtons = document.querySelectorAll("[data-role]");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginButton = document.querySelector("#loginButton");
const loginError = document.querySelector("#loginError");
const testDream = document.querySelector("#testDream");
const joinSummary = document.querySelector("#joinSummary");
const progressSummary = document.querySelector("#progressSummary");
const startPoint = document.querySelector("#startPoint");
const setupTitle = document.querySelector("#setupTitle");
const gradeSetupTitle = document.querySelector("#gradeSetupTitle");
const genderSetupTitle = document.querySelector("#genderSetupTitle");
const dreamSetupTitle = document.querySelector("#dreamSetupTitle");
const subjectSetupTitle = document.querySelector("#subjectSetupTitle");
const subjectSetupCopy = document.querySelector("#subjectSetupCopy");
const resultLevel = document.querySelector("#resultLevel");
const resultStartCopy = document.querySelector("#resultStartCopy");
const stableZone = document.querySelector("#stableZone");
const startLevel = document.querySelector("#startLevel");
const resultTotal = document.querySelector("#resultTotal");
const wrongCount = document.querySelector("#wrongCount");
const wrongReviewSummary = document.querySelector("#wrongReviewSummary");
const wrongReviewList = document.querySelector("#wrongReviewList");
const blockedConcept = document.querySelector("#blockedConcept");
const conceptMapList = document.querySelector("#conceptMapList");
const quizConcept = document.querySelector("#quizConcept");
const quizProblem = document.querySelector("#quizProblem");
const quizProgress = document.querySelector("#quizProgress");
const quizCount = document.querySelector("#quizCount");
const currentAnalysis = document.querySelector("#currentAnalysis");
const checkedAnalysis = document.querySelector("#checkedAnalysis");
const nextAnalysis = document.querySelector("#nextAnalysis");
const answerList = document.querySelector("#answerList");
const quizToast = document.querySelector("#quizToast");
const reviewExplanation = document.querySelector("#reviewExplanation");
const quizActions = document.querySelector("#quizActions");
const reviewActions = document.querySelector("#reviewActions");
const backToResult = document.querySelector("#backToResult");
const toastIcon = document.querySelector("#toastIcon");
const toastTitle = document.querySelector("#toastTitle");
const toastCopy = document.querySelector("#toastCopy");
const nextQuestion = document.querySelector("#nextQuestion");
const stopTest = document.querySelector("#stopTest");
const stopTestTop = document.querySelector("#stopTestTop");
const quitTest = document.querySelector("#quitTest");
const unknownQuestion = document.querySelector("#unknownQuestion");
const timeLabel = document.querySelector("#timeLabel");
const timeLeft = document.querySelector("#timeLeft");
const quizRoute = document.querySelector("#quizRoute");
const strongDomains = document.querySelector("#strongDomains");
const weakDomains = document.querySelector("#weakDomains");
const confidenceDomains = document.querySelector("#confidenceDomains");
const masteryDomains = document.querySelector("#masteryDomains");
const learningPath = document.querySelector("#learningPath");
const resumeProgress = document.querySelector("#resumeProgress");
const resumePercent = document.querySelector("#resumePercent");
const resumeChecked = document.querySelector("#resumeChecked");
const resumeFocus = document.querySelector("#resumeFocus");
const resumeSavedAt = document.querySelector("#resumeSavedAt");
const resumeTest = document.querySelector("#resumeTest");
const restartTest = document.querySelector("#restartTest");
const pauseTest = document.querySelector("#pauseTest");
const homeAvatar = document.querySelector("#homeAvatar");
const homeGreeting = document.querySelector("#homeGreeting");
const homeMessage = document.querySelector("#homeMessage");
const profileName = document.querySelector("#profileName");
const profileMessage = document.querySelector("#profileMessage");
const avatarPicker = document.querySelector("#avatarPicker");
const profileChangePicker = document.querySelector("#profileChangePicker");
const profileNameEditButton = document.querySelector(".profile-name-edit");
const profileEditName = document.querySelector("#profileEditName");
const profileEditEmail = document.querySelector("#profileEditEmail");
const profileBasicToggle = document.querySelector("#profileBasicToggle");
const profileBasicFields = document.querySelector("#profileBasicFields");
const profileBasicClose = document.querySelector("#profileBasicClose");
const profileBasicSave = document.querySelector("#profileBasicSave");
const profileNameDisplays = document.querySelectorAll("[data-profile-name-text]");
const profileEmailDisplays = document.querySelectorAll("[data-profile-email-text]");
const avatarLevelLabel = document.querySelector("#avatarLevelLabel");
const avatarItemButtons = document.querySelectorAll("[data-unlock-level]");
const profileAvatarImages = document.querySelectorAll("[data-profile-avatar]");
const homeMenuButton = document.querySelector("#homeMenuButton");
const homeMenu = document.querySelector("#homeMenu");
const closeHomeMenu = document.querySelector("#closeHomeMenu");
const logoutButton = document.querySelector("#logoutButton");
const menuLogoutButton = document.querySelector("#menuLogoutButton");
const settingsMenuButton = document.querySelector("#settingsMenuButton");
const settingsPopover = document.querySelector("#settingsPopover");
const avatarUnlockNoticeKey = "studyCoinLastAvatarUnlockLevel";
const authStorageKey = "studyCoinAuth";
const currentUserStorageKey = "studyCoinCurrentUser";
const currentScreenStorageKey = "studyCoinCurrentScreen";
const currentSessionScreenKey = "studyCoinCurrentSessionScreen";
const profileStoragePrefix = "studyCoinProfile";
const legacyProfileStorageKey = "studyCoinProfile";
const levelTestStorageKey = "studyCoinLevelTest";
const staleResumeDays = 30;
const aiScoringRules = {
  minAdaptiveQuestions: 10,
  maxAdaptiveQuestions: 30,
  maxConceptChecks: 3,
  targetConfidence: 82,
  difficultyWeight: { 1: 0.8, 2: 1, 3: 1.2 },
  response: { unknown: -10, wrong: -7, correctFast: 9, correctNormal: 7, correctSlow: 5 },
};
const bankAdaptiveMeta = {
  g1: { domain: "계산", rank: 1, levelLabel: "초등 1학년" },
  e12: { domain: "계산", rank: 2, levelLabel: "초등 2학년" },
  e34: { domain: "계산", rank: 4, levelLabel: "초등 4학년" },
  g4: { domain: "분수", rank: 4, levelLabel: "초등 4학년" },
  g5: { domain: "분수", rank: 5, levelLabel: "초등 5학년" },
  e56: { domain: "비율", rank: 6, levelLabel: "초등 6학년" },
  g6: { domain: "비율", rank: 6, levelLabel: "초등 6학년" },
  m1: { domain: "문자식", rank: 7, levelLabel: "중등 1학년" },
  m2: { domain: "함수", rank: 8, levelLabel: "중등 2학년" },
  m3: { domain: "방정식", rank: 9, levelLabel: "중등 3학년" },
  h1: { domain: "방정식", rank: 10, levelLabel: "고등 1학년" },
  h2: { domain: "함수", rank: 11, levelLabel: "고등 2학년" },
  h3: { domain: "함수", rank: 12, levelLabel: "고등 3학년" },
};
const representativeConceptsByGrade = {
  "초등 4학년": ["큰 수", "각도", "곱셈", "분수", "소수"],
  "초등 5학년": ["약수와 배수", "분수 계산", "평균", "도형"],
  "초등 6학년": ["비와 비율", "비례식", "원의 넓이"],
  "중등 1학년": ["정수의 계산", "문자식", "일차방정식"],
  "중등 2학년": ["식의 계산", "연립방정식", "일차함수"],
  "중등 3학년": ["제곱근", "인수분해", "이차방정식"],
};
const prerequisiteConceptMap = {};

const settingsPopoverMarkup = `
  <button type="button"><span>???뚮┝ ?ㅼ젙</span><b>??/b></button>
  <button type="button"><span>??怨꾩젙 ?ㅼ젙</span><b>??/b></button>
  <button type="button"><span>? 怨좉컼?쇳꽣</span><b>??/b></button>
  <button type="button" data-settings-logout><span>??濡쒓렇?꾩썐</span><b>??/b></button>
`;

/* Corrupted legacy question bank retained temporarily for recovery reference.
const conceptBanks = {
  g1: [
    ["수 세기", "8은 5보다 몇 큰 수인가요?", "3", ["2", "3", "4", "5"]],
    ["덧셈", "3 + 4 = ?", "7", ["6", "7", "8", "9"]],
    ["뺄셈", "9 - 5 = ?", "4", ["3", "4", "5", "6"]],
  ],
  g2: [
    ["세 자리 수", "342에서 백의 자리 숫자는?", "3", ["2", "3", "4", "342"]],
    ["곱셈구구", "7 x 6 = ?", "42", ["36", "40", "42", "48"]],
    ["시각과 시간", "2시 30분에서 30분 뒤는?", "3시", ["2시", "2시 30분", "3시", "3시 30분"]],
  ],
  g3: [
    ["곱셈", "23 x 4 = ?", "92", ["82", "88", "92", "96"]],
    ["나눗셈", "24 ÷ 6 = ?", "4", ["3", "4", "5", "6"]],
    ["분수", "1/2 + 1/4 = ?", "3/4", ["1/4", "2/4", "3/4", "4/4"]],
  ],
  g4: [
    ["큰 수", "12,000은 1,000이 몇 개인가요?", "12", ["10", "11", "12", "120"]],
    ["각도", "직각은 몇 도인가요?", "90도", ["45도", "60도", "90도", "180도"]],
    ["소수", "0.3 + 0.4 = ?", "0.7", ["0.6", "0.7", "0.8", "0.9"]],
  ],
  g5: [
    ["약수와 배수", "18의 약수가 아닌 것은?", "5", ["1", "2", "3", "5"]],
    ["분수 계산", "2/3 + 1/6 = ?", "5/6", ["3/9", "1/2", "5/6", "2/6"]],
    ["평균", "4, 6, 8의 평균은?", "6", ["5", "6", "7", "8"]],
  ],
  g6: [
    ["비와 비율", "3:5에서 전체가 40이면 3에 해당하는 값은?", "15", ["12", "15", "20", "24"]],
    ["비례식", "2:3 = x:12일 때 x는?", "8", ["6", "8", "9", "10"]],
    ["원의 넓이", "반지름 3cm인 원의 넓이는? (π=3.14)", "28.26", ["18.84", "28.26", "31.4", "56.52"]],
  ],
  m1: [
    ["정수와 유리수", "-3 + 7 = ?", "4", ["-10", "-4", "4", "10"]],
    ["문자식", "3x + 2x = ?", "5x", ["5", "5x", "6x", "x"]],
    ["일차방정식", "2x + 3 = 11일 때 x는?", "4", ["3", "4", "5", "7"]],
  ],
  m2: [
    ["식의 계산", "3x + 5x - 2x = ?", "6x", ["5x", "6x", "8x", "10x"]],
    ["연립방정식", "x+y=9, x-y=3일 때 x는?", "6", ["3", "4", "6", "9"]],
    ["일차함수", "y=3x+2의 기울기는?", "3", ["2", "3", "5", "-3"]],
  ],
  m3: [
    ["제곱근", "√81 = ?", "9", ["3", "8", "9", "81"]],
    ["인수분해", "x²+5x+6을 인수분해하면?", "(x+2)(x+3)", ["(x+1)(x+6)", "(x+2)(x+3)", "(x-2)(x-3)", "(x+5)(x+1)"]],
    ["이차방정식", "x²-9=0의 해는?", "±3", ["3", "-3", "±3", "9"]],
  ],
  h1: [
    ["다항식", "(x+2)(x+3)을 전개하면?", "x²+5x+6", ["x²+6x+5", "x²+5x+6", "x²+5", "2x+5"]],
    ["방정식", "x²-5x+6=0의 두 근은?", "2, 3", ["1, 6", "2, 3", "-2, -3", "3, 5"]],
    ["함수", "f(x)=2x+1일 때 f(3)은?", "7", ["5", "6", "7", "8"]],
  ],
  h2: [
    ["수열", "2, 5, 8, ...의 공차는?", "3", ["2", "3", "5", "8"]],
    ["지수", "2³ x 2² = ?", "32", ["16", "24", "32", "64"]],
    ["로그", "log₂8 = ?", "3", ["2", "3", "4", "8"]],
  ],
  h3: [
    ["미분", "f(x)=x²의 도함수는?", "2x", ["x", "2x", "x²", "2"]],
    ["적분", "∫2x dx = ?", "x²+C", ["2x+C", "x²+C", "x³+C", "x+C"]],
    ["확률", "동전을 두 번 던져 앞면이 두 번 나올 확률은?", "1/4", ["1/2", "1/3", "1/4", "3/4"]],
  ],
};
if (window.generatedConceptBanks) {
  Object.assign(conceptBanks, window.generatedConceptBanks);
}

const gradePlans = {
  "珥덈벑 1?숇뀈": [{ bank: "g1", count: 12 }],
  "珥덈벑 2?숇뀈": [{ bank: "g1", count: 6 }, { bank: "g2", count: 6 }],
  "珥덈벑 3?숇뀈": [{ bank: "g1", count: 3 }, { bank: "g2", count: 3 }, { bank: "g3", count: 6 }],
  "珥덈벑 4?숇뀈": [{ bank: "g1", count: 2 }, { bank: "g2", count: 2 }, { bank: "g3", count: 2 }, { bank: "g4", count: 6 }],
  "珥덈벑 5?숇뀈": [{ bank: "g1", count: 2 }, { bank: "g2", count: 2 }, { bank: "g3", count: 3 }, { bank: "g4", count: 3 }, { bank: "g5", count: 6 }],
  "珥덈벑 6?숇뀈": [{ bank: "g1", count: 1 }, { bank: "g2", count: 2 }, { bank: "g3", count: 3 }, { bank: "g4", count: 3 }, { bank: "g5", count: 3 }, { bank: "g6", count: 6 }],
  "以묐벑 1?숇뀈": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 2 }, { bank: "g4", count: 2 }, { bank: "g5", count: 3 }, { bank: "g6", count: 3 }, { bank: "m1", count: 12 }],
  "以묐벑 2?숇뀈": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 1 }, { bank: "g4", count: 2 }, { bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 6 }, { bank: "m2", count: 12 }],
  "以묐벑 3?숇뀈": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 1 }, { bank: "g4", count: 1 }, { bank: "g5", count: 2 }, { bank: "g6", count: 2 }, { bank: "m1", count: 4 }, { bank: "m2", count: 6 }, { bank: "m3", count: 12 }],
  "怨좊벑 1?숇뀈": [{ bank: "g3", count: 2 }, { bank: "g4", count: 2 }, { bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }],
  "怨좊벑 2?숇뀈": [{ bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }, { bank: "h2", count: 6 }],
  "怨좊벑 3?숇뀈": [{ bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }, { bank: "h2", count: 6 }, { bank: "h3", count: 6 }],
};

let currentQuestion = 0;
let questionNumber = 1;
let selectedAnswer = "";
let firstWrongQuestion = null;
let activeQuestions = [];
let selectedAnswers = [];
let timerId = null;
let remainingSeconds = 0;
let isChecking = false;
let lastAnsweredQuestion = null;
*/

const conceptBanks = {
  e12: [["덧셈", "6 + 3 =", "9", ["7", "8", "9", "10"]]],
  e34: [["곱셈", "7 × 6 =", "42", ["36", "40", "42", "48"]]],
  e56: [["약수", "12의 약수가 아닌 것은?", "5", ["1", "3", "4", "5"]]],
  m1: [["정수의 계산", "-3 + 8 =", "5", ["-11", "-5", "5", "11"]]],
  m2: [["일차함수", "y = 2x + 1에서 x = 3이면 y는?", "7", ["5", "6", "7", "8"]]],
  m3: [["인수분해", "x² + 5x + 6을 인수분해하면?", "(x+2)(x+3)", ["(x+1)(x+6)", "(x+2)(x+3)", "(x-2)(x-3)", "(x+3)²"]]],
  h1: [["복소수", "i²의 값은?", "-1", ["-1", "0", "1", "i"]]],
  h2: [["삼각함수", "sin 30°의 값은?", "1/2", ["1/3", "1/2", "√2/2", "1"]]],
  h3: [["미분", "x²을 미분하면?", "2x", ["x", "2x", "x²", "2"]]],
  g1: [["덧셈", "6 + 3 =", "9", ["7", "8", "9", "10"]]],
};
if (window.generatedConceptBanks) Object.assign(conceptBanks, window.generatedConceptBanks);

let timedOutQuestions = [];
let unknownQuestions = [];
let wrongQuestions = [];
let reviewMode = false;
let adaptiveQuestionPool = [];
let answeredQuestionIds = new Set();
let adaptiveState = null;
let questionStartedAt = 0;
let levelTestSubject = localStorage.getItem("studyCoinLevelTestSubject") || "수학";

const eliteQuestionTemplates = {};
const eliteAdvancedQuestionTemplates = {};
const eliteExtensionQuestionTemplates = {};
const adaptiveDomains = ["계산", "수 감각", "분수", "소수", "비율", "문자식", "방정식", "함수", "도형", "논리"];
const requiredExitDomains = ["분수", "소수", "비율", "도형"];
const conceptPrerequisites = new Map();
const highSchoolLevelTestStructure = {
  "고등 1학년": { mode: "integrated", subjects: [{ subject: "공통수학", bank: "h1", ratio: 0.6 }, { subject: "수학Ⅰ", bank: "h2", ratio: 0.4 }], fallbackOrder: ["공통수학", "수학Ⅰ"] },
  "고등 2학년": { mode: "integrated", subjects: [{ subject: "공통수학", bank: "h1", ratio: 0.3 }, { subject: "수학Ⅰ", bank: "h2", ratio: 0.35 }, { subject: "수학Ⅱ", bank: "h3", ratio: 0.35 }], fallbackOrder: ["수학Ⅱ", "수학Ⅰ", "공통수학"] },
  "고등 3학년": { mode: "elective", electives: { "미적분": { start: "미적분", fallbackOrder: ["미적분", "수학Ⅱ", "수학Ⅰ", "공통수학"] }, "확률과 통계": { start: "확률과 통계", fallbackOrder: ["확률과 통계", "수학Ⅰ", "공통수학"] }, "기하": { start: "기하", fallbackOrder: ["기하", "수학Ⅰ", "공통수학"] } } },
};
const highSchoolRepresentativeQueues = {
  "고등 1학년": ["다항식", "방정식", "경우의 수", "함수", "지수", "로그", "삼각함수"],
  "고등 2학년": ["수열", "극한", "미분", "적분", "함수", "방정식"],
  "고등 3학년": ["미분", "적분", "확률", "통계", "벡터", "공간도형"],
};
const generatedStartProfiles = {
  "초등 4학년": { rank: 4, focusDomain: "분수", nextDomain: "소수" },
  "초등 5학년": { rank: 5, focusDomain: "분수", nextDomain: "비율" },
  "초등 6학년": { rank: 6, focusDomain: "비율", nextDomain: "문자식" },
  "중등 1학년": { rank: 7, focusDomain: "문자식", nextDomain: "방정식" },
  "중등 2학년": { rank: 8, focusDomain: "방정식", nextDomain: "함수" },
  "중등 3학년": { rank: 9, focusDomain: "방정식", nextDomain: "함수" },
  "고등 1학년": { rank: 10, focusDomain: "방정식", nextDomain: "함수" },
  "고등 2학년": { rank: 11, focusDomain: "함수", nextDomain: "미적분" },
  "고등 3학년": { rank: 12, focusDomain: "미적분", nextDomain: "함수" },
};
const screenHistory = [];

function activeScreenName() {
  return document.querySelector("[data-screen].active")?.dataset.screen || null;
}

function screenStorageKeyForUser(userId = getCurrentUser()) {
  return `${currentScreenStorageKey}:${userId || "guest"}`;
}

function saveCurrentScreen(name) {
  if (!name) return;
  sessionStorage.setItem(currentSessionScreenKey, name);
  localStorage.setItem(currentScreenStorageKey, name);
  if (getCurrentUser()) localStorage.setItem(screenStorageKeyForUser(), name);
  try {
    history.replaceState({ ...(history.state || {}), studyScreen: name }, "", location.href);
  } catch (_) {
    // The local file still keeps the sessionStorage fallback.
  }
}

function showScreen(name, options = {}) {
  const current = activeScreenName();
  if (!options.fromBack && !options.silent && current && current !== name) {
    screenHistory.push(current);
    if (screenHistory.length > 40) screenHistory.shift();
  }

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  saveCurrentScreen(name);

}

function goBack(fallback = "home") {
  const current = activeScreenName();
  let previous = null;

  while (screenHistory.length && !previous) {
    const candidate = screenHistory.pop();
    if (candidate !== current && document.querySelector(`[data-screen="${candidate}"]`)) {
      previous = candidate;
    }
  }

  showScreen(previous || fallback, { fromBack: true });
}

window.STUDY_NAV = {
  go: (name, options) => showScreen(name, options),
  back: (fallback) => goBack(fallback),
  current: activeScreenName,
};

function ensureGlobalSettingsButtons() {
  const excludedScreens = new Set([
    "login", "signup", "profile-setup",
    "study-room", "study-room-create", "study-room-find", "study-room-detail",
  ]);

  screens.forEach((screen) => {
    if (excludedScreens.has(screen.dataset.screen)) {
      screen.querySelectorAll(".global-settings-button, .settings-popover").forEach((element) => element.remove());
      return;
    }

    if (!screen.querySelector(".settings-trigger")) {
      const button = document.createElement("button");
      button.className = "settings-button settings-trigger global-settings-button";
      button.type = "button";
      button.textContent = "⚙";
      screen.appendChild(button);
    }

    if (!screen.querySelector(".settings-popover")) {
      const popover = document.createElement("section");
      popover.className = "settings-popover hidden";
      popover.innerHTML = settingsPopoverMarkup;
      screen.appendChild(popover);
    }
  });
}

function getAuthUsers() {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey)) || {};
  } catch {
    return {};
  }
}

function saveAuthUsers(users) {
  localStorage.setItem(authStorageKey, JSON.stringify(users));
}

function getCurrentUser() {
  return localStorage.getItem(currentUserStorageKey);
}

function setCurrentUser(userId) {
  localStorage.setItem(currentUserStorageKey, userId);
  window.dispatchEvent(new CustomEvent("study:user-changed", { detail: { userId } }));
}

function clearCurrentUser() {
  localStorage.removeItem(currentUserStorageKey);
  window.dispatchEvent(new CustomEvent("study:user-changed", { detail: { userId: null } }));
}

function getUserRecord(userId = getCurrentUser()) {
  const users = getAuthUsers();
  return userId ? users[userId] : null;
}

function getProfileStorageKey(userId = getCurrentUser()) {
  return `${profileStoragePrefix}:${userId || "guest"}`;
}

function updateUserRecord(userId, updater) {
  const users = getAuthUsers();
  if (!users[userId]) return;
  users[userId] = updater(users[userId]) || users[userId];
  saveAuthUsers(users);
}

function completeOnboarding() {
  const userId = getCurrentUser();
  if (!userId) return;
  updateUserRecord(userId, (user) => ({ ...user, onboardingComplete: true }));
}

function routeAfterLogin({ restoreScreen = true } = {}) {
  const user = getUserRecord();

  if (!user?.onboardingComplete) {
    showScreen("profile-setup", { silent: true });
    loadLearningSettings();
    return;
  }

  const savedScreen = restoreScreen
    ? history.state?.studyScreen
    : "home";
  const savedScreenExists = savedScreen
    && document.querySelector(`[data-screen="${savedScreen}"]`);

  if (savedScreen === "quiz") {
    const savedTest = getSavedLevelTest();
    if (savedTest) {
      showScreen("quiz", { silent: true });
      restoreLevelTestState(savedTest);
      loadLearningSettings();
      return;
    }
  }

  showScreen(savedScreenExists && savedScreen !== "login" && savedScreen !== "signup"
    ? savedScreen
    : "home", { silent: true });
  loadLearningSettings();
}

function initializeAuthScreen() {
  if (getCurrentUser() && getUserRecord()) {
    routeAfterLogin({ restoreScreen: true });
    return;
  }

  showScreen("login", { silent: true });
}

function logout() {
  clearCurrentUser();
  homeMenu.classList.add("hidden");
  loginPassword.value = "";
  showScreen("login", { silent: true });
}

function getCurrentLearningSettings() {
  return {
    role: getSelectedRole(),
    grade: getSelectedGrade(),
    school: getSelectedSchool(),
    gender: document.querySelector('[data-choice-group="gender"] .selected')?.textContent.trim() || "학생",
    subjects: [...document.querySelectorAll("[data-subject].selected")].map((button) => button.dataset.subject),
    dream: dreamJob.value,
  };
}

function saveLearningSettings() {
  const userId = getCurrentUser();
  if (!userId) return;

  updateUserRecord(userId, (user) => ({
    ...user,
    learningSettings: getCurrentLearningSettings(),
  }));
}

function loadLearningSettings() {
  const settings = getUserRecord()?.learningSettings;
  if (!settings) return;

  if (settings.role) {
    roleButtons.forEach((button) => button.classList.toggle("selected", button.dataset.role === settings.role));
    updateRoleCopy();
  }

  if (settings.school) {
    schoolTabs.forEach((tab) => tab.classList.toggle("selected", tab.dataset.schoolTab === settings.school));
    gradePanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.gradePanel === settings.school));
  }

  if (settings.grade) {
    document.querySelectorAll("[data-grade]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.grade === settings.grade);
    });
  }

  if (settings.gender) {
    document.querySelectorAll('[data-choice-group="gender"] button').forEach((button) => {
      button.classList.toggle("selected", button.textContent.trim() === settings.gender);
    });
  }

  if (settings.subjects?.length) {
    subjectButtons.forEach((button) => {
      button.classList.toggle("selected", settings.subjects.includes(button.dataset.subject));
    });
  }

  if (settings.dream) dreamJob.value = settings.dream;
  updateLevelTestCopy();
}

function getSelectedRole() {
  return document.querySelector("[data-role].selected")?.dataset.role || "student";
}

function getSelectedSchool() {
  return document.querySelector("[data-school-tab].selected")?.dataset.schoolTab || "elementary";
}

function getSelectedGrade() {
  const activePanel = document.querySelector("[data-grade-panel].active");
  return activePanel?.querySelector("[data-grade].selected")?.dataset.grade
    || document.querySelector("[data-grade].selected")?.dataset.grade
    || "珥덈벑 4?숇뀈";
}

function updateRoleCopy() {
  const role = getSelectedRole();
  const copy = {
    student: {
      title: "?섏뿉寃?留욊쾶<br />怨듬?瑜?以鍮꾪븷寃뚯슂",
      grade: "?숇뀈",
      gender: "성별",
      dream: "?λ옒?щ쭩",
      subject: "?먰븯??怨쇰ぉ",
      subjectCopy: "?섎굹留?怨⑤씪???섍퀬, ?щ윭 怨쇰ぉ???④퍡 ?좏깮?????덉뼱??",
    },
    parent: {
      title: "?먮??먭쾶 留욊쾶<br />怨듬?瑜?以鍮꾪븷寃뚯슂",
      grade: "?먮? ?숇뀈",
      gender: "자녀 성별",
      dream: "?먮? ?λ옒?щ쭩",
      subject: "?먮?媛 怨듬???怨쇰ぉ",
      subjectCopy: "?먮??먭쾶 ?꾩슂??怨쇰ぉ???щ윭 媛??좏깮?????덉뼱??",
    },
    teacher: {
      title: "?숈깮?먭쾶 留욊쾶<br />?섏뾽??以鍮꾪븷寃뚯슂",
      grade: "?대떦 ?숈깮 ?숇뀈",
      gender: "학생 성별",
      dream: "?숈깮 紐⑺몴",
      subject: "吏?꾪븷 怨쇰ぉ",
      subjectCopy: "吏?꾪븷 怨쇰ぉ???щ윭 媛??좏깮?????덉뼱??",
    },
  }[role];

  if (setupTitle) setupTitle.innerHTML = copy.title;
  if (gradeSetupTitle) gradeSetupTitle.textContent = copy.grade;
  if (genderSetupTitle) genderSetupTitle.textContent = copy.gender;
  if (dreamSetupTitle) dreamSetupTitle.textContent = copy.dream;
  if (subjectSetupTitle) subjectSetupTitle.textContent = copy.subject;
  if (subjectSetupCopy) subjectSetupCopy.textContent = copy.subjectCopy;
}

function getSavedProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(getProfileStorageKey()));
    if (saved) return saved;

    const registeredName = getUserRecord()?.name?.trim();
    if (getCurrentUser()) return { name: registeredName || "?숈깮" };
    const legacy = JSON.parse(localStorage.getItem(legacyProfileStorageKey)) || {};
    return {
      ...legacy,
      name: registeredName || legacy.name || "?숈깮",
    };
  } catch {
    return { name: getUserRecord()?.name?.trim() || "?숈깮" };
  }
}

function normalizeProfileAvatar(avatar) {
  return avatar?.startsWith("assets/profile-avatar-") && avatar.endsWith("-cutout.png")
    ? avatar
    : "assets/profile-avatar-main-cutout.png";
}

function getSelectedProfileAvatar() {
  return normalizeProfileAvatar(
    profileChangePicker?.querySelector(".selected")?.dataset.avatar
      || getSavedProfile().avatar
  );
}

function getProfileEmail() {
  return getSavedProfile().email || getUserRecord()?.email || "";
}

function applyProfileText(name, email) {
  const displayName = (name || getUserRecord()?.name || profileName.value || "학생").trim();
  const displayEmail = (email || getProfileEmail()).trim();

  if (profileEditName && profileEditName.value !== displayName) profileEditName.value = displayName;
  if (profileEditEmail && profileEditEmail.value !== displayEmail) profileEditEmail.value = displayEmail;
  profileNameDisplays.forEach((element) => {
    element.textContent = displayName;
  });
  profileEmailDisplays.forEach((element) => {
    element.textContent = displayEmail;
  });
}

function applyProfileAvatar(avatar) {
  const selectedAvatar = normalizeProfileAvatar(avatar);
  const profileOwnerName = getSavedProfile().name || getUserRecord()?.name || "학생";
  profileAvatarImages.forEach((image) => {
    image.src = selectedAvatar;
    image.alt = `${profileOwnerName} 프로필`;
  });
  document.documentElement.style.setProperty("--profile-avatar-image", `url("${selectedAvatar}")`);
  profileChangePicker?.querySelectorAll("[data-avatar]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.avatar === selectedAvatar);
  });
  avatarPicker?.querySelectorAll("[data-avatar]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.avatar === selectedAvatar);
  });
}

function saveProfile() {
  const selectedAvatar = getSelectedProfileAvatar();
  const saved = getSavedProfile();
  const nextName = (profileEditName?.value || profileName.value || saved.name || "").trim();
  const nextEmail = (profileEditEmail?.value || saved.email || getUserRecord()?.email || "").trim();
  localStorage.setItem(getProfileStorageKey(), JSON.stringify({
    name: nextName,
    message: profileMessage.value.trim(),
    email: nextEmail,
    avatar: selectedAvatar,
  }));

  const userId = getCurrentUser();
  if (userId && nextName) {
    updateUserRecord(userId, (user) => ({ ...user, name: nextName, email: nextEmail || user.email }));
  }
}

function updateHomeProfile() {
  const name = profileName.value.trim() || getUserRecord()?.name?.trim() || "학생";
  const message = (profileMessage.value.trim() || "?ㅻ뒛??硫뗭?寃?怨듬??대낫??").replace("?뮞", "").trim();
  const selectedAvatar = getSelectedProfileAvatar();

  homeGreeting.textContent = `안녕하세요, ${name}님`;
  homeMessage.textContent = message;
  applyProfileText(name, getProfileEmail());
  applyProfileAvatar(selectedAvatar);
  saveProfile();
}

function loadHomeProfile() {
  const saved = getSavedProfile();
  const registeredName = getUserRecord()?.name?.trim();
  profileName.value = saved.name || registeredName || "학생";
  if (saved.message) profileMessage.value = saved.message;
  applyProfileAvatar(saved.avatar || "assets/login-friend.png");
  applyProfileText(profileName.value, saved.email || getUserRecord()?.email || "");

  updateHomeProfile();
}

function getCurrentAvatarLevel() {
  const points = window.STUDY_SOCIAL?.getState?.().points || 0;
  return window.STUDY_SOCIAL?.levelFromPoints?.(points) || 1;
}

function avatarUnlockStorageKey() {
  return `${avatarUnlockNoticeKey}:${getCurrentUser() || "guest"}`;
}

const celebrationQueue = [];
let celebrationPlaying = false;

function enqueueCelebration(renderCelebration) {
  celebrationQueue.push(renderCelebration);
  if (celebrationPlaying) return;

  const playNext = () => {
    const render = celebrationQueue.shift();
    if (!render) {
      celebrationPlaying = false;
      return;
    }
    celebrationPlaying = true;
    render(() => {
      celebrationPlaying = false;
      playNext();
    });
  };

  playNext();
}

function showCoinReward(amount, label = "레벨 완료 보상") {
  const coins = Math.max(0, Number(amount) || 0);
  if (!coins) return;

  enqueueCelebration((done) => {
    const notice = document.createElement("div");
    notice.className = "reward-celebration coin-reward-celebration";
    notice.innerHTML = `
      <section class="reward-celebration-card" role="dialog" aria-modal="true" aria-label="${label}">
        <p class="reward-kicker">${label}</p>
        <div class="treasure-stage" aria-hidden="true">
          <i class="reward-spark spark-one"></i><i class="reward-spark spark-two"></i><i class="reward-spark spark-three"></i>
          <div class="coin-burst"><b>●</b><b>●</b><b>●</b><b>●</b><b>●</b></div>
          <div class="treasure-chest"><span class="chest-lid"></span><span class="chest-body"><i></i></span></div>
        </div>
        <h2>보물상자를 열었어요!</h2>
        <strong class="reward-coin-count">+${coins} 코인</strong>
        <button class="reward-confirm" type="button">코인 받기</button>
      </section>
    `;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add("is-playing"));

    const close = () => {
      notice.classList.add("is-leaving");
      setTimeout(() => {
        notice.remove();
        done();
      }, 220);
    };
    notice.querySelector(".reward-confirm")?.addEventListener("click", close, { once: true });
  });
}

function showAvatarUnlockNotice(unlockedButton) {
  const name = unlockedButton?.querySelector("span")?.textContent?.trim() || "새 아바타";
  const avatar = unlockedButton?.dataset.avatar || unlockedButton?.querySelector("img")?.getAttribute("src") || "assets/profile-avatar-main-cutout.png";

  enqueueCelebration((done) => {
    const notice = document.createElement("div");
    notice.className = "reward-celebration avatar-unlock-celebration";
    notice.innerHTML = `
      <section class="reward-celebration-card" role="dialog" aria-modal="true" aria-label="새 아바타 해금">
        <button class="avatar-unlock-close" type="button" aria-label="닫기">×</button>
        <p class="reward-kicker">NEW AVATAR</p>
        <div class="avatar-unlock-stage" aria-hidden="true">
          <i class="unlock-ray ray-one"></i><i class="unlock-ray ray-two"></i><i class="unlock-ray ray-three"></i><i class="unlock-ray ray-four"></i>
          <div class="unlock-lock"><span></span></div>
          <img src="${avatar}" alt="" />
        </div>
        <h2>축하해요!</h2>
        <p>${name} 아바타가 열렸어요.</p>
        <button class="avatar-unlock-go" type="button">구경하러가기</button>
      </section>
    `;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add("is-playing"));

    const close = (goToAvatar = false) => {
      notice.classList.add("is-leaving");
      setTimeout(() => {
        notice.remove();
        if (goToAvatar) showScreen("profile-change");
        done();
      }, 220);
    };
    notice.querySelector(".avatar-unlock-close")?.addEventListener("click", () => close(false), { once: true });
    notice.querySelector(".avatar-unlock-go")?.addEventListener("click", () => close(true), { once: true });
  });
}

window.STUDY_REWARDS = { showCoinReward };

function updateAvatarUnlocks() {
  const currentLevel = getCurrentAvatarLevel();
  if (avatarLevelLabel) avatarLevelLabel.textContent = `현재 Lv.${currentLevel}`;
  let newestUnlockedButton = null;

  avatarItemButtons.forEach((button) => {
    const requiredLevel = Number(button.dataset.unlockLevel || 0);
    const locked = requiredLevel > currentLevel;
    const status = button.querySelector("small");

    button.classList.toggle("locked", locked);
    button.classList.toggle("is-locked", locked);
    button.disabled = locked;

    if (button.hasAttribute("data-avatar")) {
      button.toggleAttribute("data-locked-avatar", locked);
      button.setAttribute("aria-disabled", String(locked));
    }

    if (!locked && button.hasAttribute("data-avatar") && requiredLevel > 1 && (!newestUnlockedButton || requiredLevel > Number(newestUnlockedButton.dataset.unlockLevel || 0))) {
      newestUnlockedButton = button;
    }

    if (status) {
      if (locked) {
        status.textContent = `Lv.${requiredLevel} 잠금`;
      } else if (button.classList.contains("selected")) {
        status.textContent = "착용중";
      } else {
        status.textContent = "획득 완료";
      }
    }
  });

  const storageKey = avatarUnlockStorageKey();
  const lastAnnouncedLevel = Number(localStorage.getItem(storageKey) || 0);
  if (!lastAnnouncedLevel) {
    localStorage.setItem(storageKey, String(currentLevel));
    return;
  }
  if (currentLevel > lastAnnouncedLevel) {
    localStorage.setItem(storageKey, String(currentLevel));
    const newlyUnlocked = [...avatarItemButtons]
      .filter((button) => {
        const requiredLevel = Number(button.dataset.unlockLevel || 0);
        return button.hasAttribute("data-avatar") && requiredLevel > lastAnnouncedLevel && requiredLevel <= currentLevel;
      })
      .sort((a, b) => Number(a.dataset.unlockLevel || 0) - Number(b.dataset.unlockLevel || 0))
      .at(-1);
    if (newlyUnlocked || newestUnlockedButton) showAvatarUnlockNotice(newlyUnlocked || newestUnlockedButton);
  }
}
function activateInAppControls() {
  document.querySelectorAll(".bell").forEach((button) => {
    button.addEventListener("click", () => showScreen("coins"));
  });

  const growthStats = {
    weekly: {
      title: "이번 주 집중도",
      percent: "85%",
      time: "12시간 30분",
      timeDelta: "+2시간",
      goals: "8 / 10개",
      goalsDelta: "+2개",
      subjects: ["5시간 20분", "3시간 10분", "2시간 40분", "1시간 20분"],
      widths: ["92%", "68%", "55%", "38%"],
    },
    monthly: {
      title: "이번 달 집중도",
      percent: "78%",
      time: "48시간 10분",
      timeDelta: "+6시간",
      goals: "32 / 40개",
      goalsDelta: "+7개",
      subjects: ["19시간 40분", "12시간 30분", "9시간 20분", "6시간 40분"],
      widths: ["88%", "64%", "54%", "42%"],
    },
    yearly: {
      title: "올해 집중도",
      percent: "91%",
      time: "426시간",
      timeDelta: "+58시간",
      goals: "284 / 310개",
      goalsDelta: "+41개",
      subjects: ["168시간", "104시간", "86시간", "68시간"],
      widths: ["95%", "74%", "62%", "48%"],
    },
  };

  document.querySelectorAll(".growth-period-tabs").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      // ?ㅼ궗??湲곕줉? social-system.js媛 localStorage 湲곕컲?쇰줈 洹몃┰?덈떎.
      if (window.STUDY_SOCIAL) return;

      event.preventDefault();
      event.stopPropagation();

      const period = button.dataset.period;
      const data = growthStats[period];
      if (!data) return;

      group.querySelectorAll("button").forEach((item) => item.classList.remove("on"));
      button.classList.add("on");

      const screen = group.closest("[data-screen]");
      screen.querySelector(".focus-card h2").textContent = data.title;
      screen.querySelector(".focus-card strong").textContent = data.percent;

      const metricCards = screen.querySelectorAll(".growth-metrics article");
      metricCards[0].querySelector("strong").textContent = data.time;
      metricCards[0].querySelector("b").textContent = data.timeDelta;
      metricCards[1].querySelector("strong").textContent = data.goals;
      metricCards[1].querySelector("b").textContent = data.goalsDelta;

      screen.querySelectorAll(".subject-time article").forEach((item, index) => {
        item.querySelector("span").textContent = data.subjects[index];
        item.querySelector("em").style.width = data.widths[index];
      });
    });
  });

  document.querySelectorAll(".seg").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      group.querySelectorAll("button").forEach((item) => item.classList.remove("on"));
      button.classList.add("on");
    });
  });

  document.querySelectorAll(".expression-row").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      group.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
    });
  });

  document.querySelectorAll(".item-grid").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-unlock-level]");
      if (!button || button.disabled || button.classList.contains("locked")) return;

      group.querySelectorAll("[data-unlock-level]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      updateAvatarUnlocks();
    });
  });

  document.querySelectorAll(".friend-collection").forEach((group) => {
    group.addEventListener("click", (event) => {
      const button = event.target.closest("[data-unlock-level]");
      if (!button || button.disabled || button.classList.contains("locked")) return;

      group.querySelectorAll("[data-unlock-level]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      updateAvatarUnlocks();
    });
  });

  document.querySelectorAll(".approve-card .approve").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "승인 완료";
      button.disabled = true;
    });
  });

  document.querySelectorAll(".approve-card button:not(.approve)").forEach((button) => {
    button.addEventListener("click", () => {
      button.textContent = "거절 완료";
      button.disabled = true;
    });
  });

}

function updateLevelTestCopy() {
  const grade = getSelectedGrade();
  const subjectText = levelTestSubject || "수학";
  const dream = dreamJob.value.trim() || "멋진 꿈";
  const school = getSelectedSchool();
  const progress = "middle";
  const fallbackDiagnosis = {
    code: "AI 진단 준비",
    block: "대표 개념",
    stable: "진단 전",
    start: "레벨테스트 시작",
  };
  const diagnosis = typeof diagnosisMap !== "undefined"
    ? diagnosisMap?.[school]?.[progress] || fallbackDiagnosis
    : fallbackDiagnosis;

  testSubjects.textContent = `${subjectText} 과목을 개념 단위로 차분하게 확인할게요.`;
  testDream.textContent = `${dream}에 가까워지도록 학습 계획을 맞춰볼게요.`;
  if (joinSummary) {
    joinSummary.textContent = { student: "학생", parent: "학부모", teacher: "선생님" }[getSelectedRole()] || "학생";
  }
  if (progressSummary) progressSummary.textContent = subjectText;
  startPoint.textContent = `${grade}에서 시작`;
  resultLevel.textContent = diagnosis.code;
  resultStartCopy.textContent = `${diagnosis.block}에서 막힘이 보여요. 여기부터 다시 시작하면 좋아요.`;
  stableZone.textContent = diagnosis.stable;
  startLevel.textContent = diagnosis.start;
}

function escapeMathText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMathText(value) {
  return escapeMathText(value).replace(/(\d+)\s*\/\s*(\d+)/g, '<span class="math-frac"><span>$1</span><span>$2</span></span>');
}

function renderQuestion() {
  const question = activeQuestions[currentQuestion];
  if (!question) return;

  selectedAnswer = selectedAnswers[currentQuestion] || "";
  isChecking = false;
  questionStartedAt = Date.now();

  quizConcept.textContent = `Q.${currentQuestion + 1}`;
  const quizConceptSub = document.querySelector("#quizConceptSub");
  if (quizConceptSub) {
    quizConceptSub.textContent = `${adaptiveState?.selectedSubject || levelTestSubject || "?섑븰"} 쨌 ${question.domain}`;
  }
  quizProblem.innerHTML = renderMathText(question.problem);
  updateAdaptiveDisplay(question);
  quizCount.textContent = `${currentQuestion + 1} / 10`;
  timeLabel.textContent = "?꾩껜 ?⑥? ?쒓컙";
  answerList.innerHTML = question.choices
    .map((choice, index) => `<button class="${choice === selectedAnswer ? "selected" : ""}" data-answer="${escapeMathText(choice)}"><b>${index + 1}</b><span>${renderMathText(choice)}</span></button>`)
    .join("");
  quizToast.classList.add("hidden");
  reviewExplanation.classList.add("hidden");
  quizActions.classList.toggle("hidden", reviewMode);
  reviewActions.classList.toggle("hidden", !reviewMode);
  pauseTest.classList.toggle("hidden", reviewMode);
  nextQuestion.textContent = "?ㅼ쓬 臾몄젣";
  stopTest.disabled = currentQuestion === 0;
  stopTestTop.disabled = currentQuestion === 0;

  if (reviewMode) {
    timeLabel.textContent = "?ㅻ떟 由щ럭";
    timeLeft.textContent = "????뺤씤";
    stopTestTop.disabled = true;
    answerList.querySelectorAll("button").forEach((item) => {
      item.disabled = true;
      item.classList.remove("selected", "correct", "wrong");

      if (item.dataset.answer === question.answer) item.classList.add("correct");
      if (selectedAnswer && selectedAnswer !== question.answer && item.dataset.answer === selectedAnswer) {
        item.classList.add("wrong");
      }
    });
    renderReviewExplanation(question, selectedAnswer);
  }
}

function getRouteLabel(level) {
  return "AI媛 ?꾩옱 ?ㅻ젰??遺꾩꽍?섍퀬 ?덉뒿?덈떎.";
}

function createAdaptiveState(grade = getSelectedGrade()) {
  const scores = {};
  adaptiveDomains.forEach((domain) => {
    scores[domain] = {
      score: 50,
      confidence: 0,
      masteryStage: "미학습",
      attempts: 0,
      correct: 0,
      wrong: 0,
      unknown: 0,
      totalTime: 0,
      levels: {
        1: { attempts: 0, correct: 0 },
        2: { attempts: 0, correct: 0 },
        3: { attempts: 0, correct: 0 },
      },
    };
  });

  const startProfile = generatedStartProfiles[grade] || getAdaptiveStartProfile(grade);

  return {
    scores,
    history: [],
    selectedGrade: grade,
    startRank: startProfile.rank,
    representativeQueue: [...(highSchoolRepresentativeQueues[grade] || representativeConceptsByGrade[grade] || [])],
    prerequisiteQueue: [],
    streakCorrect: 0,
    streakWrong: 0,
    feedback: "",
    focusDomain: startProfile.focusDomain,
    nextDomain: startProfile.nextDomain,
    currentRank: startProfile.rank,
    confidence: 12,
    weakDomain: "",
    strongDomains: [],
    weakDomains: [],
  };
}

function getAdaptiveStartProfile(grade) {
  const profiles = {
    "초등 1학년": { rank: 1, focusDomain: "수 감각", nextDomain: "계산" },
    "초등 2학년": { rank: 2, focusDomain: "계산", nextDomain: "수 감각" },
    "초등 3학년": { rank: 3, focusDomain: "계산", nextDomain: "분수" },
    "초등 4학년": { rank: 4, focusDomain: "분수", nextDomain: "소수" },
    "초등 5학년": { rank: 5, focusDomain: "분수", nextDomain: "비율" },
    "초등 6학년": { rank: 6, focusDomain: "비율", nextDomain: "문자식" },
    "중등 1학년": { rank: 7, focusDomain: "문자식", nextDomain: "방정식" },
    "중등 2학년": { rank: 8, focusDomain: "함수", nextDomain: "방정식" },
    "중등 3학년": { rank: 9, focusDomain: "방정식", nextDomain: "함수" },
    "고등 1학년": { rank: 10, focusDomain: "방정식", nextDomain: "함수" },
    "고등 2학년": { rank: 11, focusDomain: "함수", nextDomain: "미적분" },
    "고등 3학년": { rank: 12, focusDomain: "미적분", nextDomain: "함수" },
  };

  return profiles[grade] || profiles["초등 4학년"];
}

function buildAdaptiveQuestionPool() {
  const banks = ["g4", "g5", "g6", "m1", "m2", "m3", "h1", "h2", "h3", "g3", "g2", "g1"];

  return banks.flatMap((bank) => {
    return conceptBanks[bank].map((item, index) => {
      if (!Array.isArray(item)) return normalizeQuestion(item, bank, index);
      const [concept, problem, answer, choices] = item;
      return {
      id: `${bank}-${index}-${concept}`,
      conceptId: createConceptId(concept),
      bank,
      grade: getAdaptiveMeta(bank).levelLabel,
      level: getLevelFromBank(bank),
      difficulty: getDifficultyFromBank(bank),
      seconds: getSecondsFromBank(bank),
      domain: inferAdaptiveDomain(concept, bank),
      adaptiveLevel: (index % 3) + 1,
      isRepresentative: isRepresentativeConcept(concept),
      rank: getAdaptiveMeta(bank).rank,
      levelLabel: getAdaptiveMeta(bank).levelLabel,
      concept,
      problem,
      answer,
      choices,
      stable: getStableFromBank(bank),
      start: concept,
      code: bank.toUpperCase(),
      explanation: `${concept} 臾몄젣?낅땲?? ?좏깮吏 以??뺣떟? ${answer}?낅땲?? ??臾명빆????몃떎硫?癒쇱? ${getStableFromBank(bank)} 媛쒕뀗???ㅼ떆 ?뺤씤?섏꽭??`,
      };
    });
  });
}

function normalizeQuestion(item, bank, index) {
  const concept = item.unit;
  const answer = String(item.answer);

  return {
    id: item.questionId,
    questionId: item.questionId,
    conceptId: item.conceptId,
    bank,
    grade: getAdaptiveMeta(bank).levelLabel,
    schoolLevel: getLevelFromBank(bank),
    unit: concept,
    level: getLevelFromBank(bank),
    difficulty: item.difficulty,
    questionType: "adaptive-generated",
    seconds: item.estimatedSolveTime,
    estimatedSolveTime: item.estimatedSolveTime,
    domain: inferAdaptiveDomain(concept, bank),
    adaptiveLevel: item.difficulty,
    isRepresentative: item.isRepresentative,
    prerequisiteConcepts: item.prerequisiteConcepts,
    nextConcepts: [],
    commonMistakes: [],
    diagnosisRule: "",
    rank: getAdaptiveMeta(bank).rank,
    levelLabel: getAdaptiveMeta(bank).levelLabel,
    concept,
    problem: item.questionText,
    answer,
    choices: item.choices.map(String),
    stable: getStableFromBank(bank),
    start: concept,
    code: bank.toUpperCase(),
    explanation: item.explanation,
  };
}

function buildSubjectDiagnosticPool(subjectName) {
  const contentKey = { "?곸뼱": "english", "?낆꽌": "reading", "怨쇳븰": "science", "?쒖옄": "hanja" }[subjectName];
  const subjectContent = window.STUDY_SUBJECT_CONTENT?.[contentKey];
  const stages = subjectContent?.stages || [];
  const stageQuestions = stages.flatMap((stage) => (stage.questions || [])
    .filter((question) => question.answer && question.type !== "journal")
    .map((question) => ({ question, stage })));
  const bookQuestions = (subjectContent?.books || []).flatMap((book) => (book.questions || [])
    .filter((question) => question.answer)
    .map((question) => ({ question, stage: { id: book.id, title: book.title } })));
  const rawQuestions = stageQuestions.length ? stageQuestions : bookQuestions;
  const answers = [...new Set(rawQuestions.map(({ question }) => String(question.answer)))];
  const rank = (generatedStartProfiles[getSelectedGrade()] || getAdaptiveStartProfile(getSelectedGrade())).rank;

  return rawQuestions.map(({ question, stage }, index) => {
    const choices = question.choices?.map(String) || [
      String(question.answer),
      ...answers.filter((answer) => answer !== String(question.answer)).slice(index % Math.max(1, answers.length - 1), (index % Math.max(1, answers.length - 1)) + 3),
    ];
    const uniqueChoices = [...new Set(choices)].slice(0, 4);
    while (uniqueChoices.length < 4) uniqueChoices.push(`?ㅻⅨ ?쒗쁽 ${uniqueChoices.length + 1}`);
    return {
      id: `subject-diagnostic-${contentKey}-${question.id}`,
      conceptId: `${contentKey}-${stage.id}`,
      bank: contentKey,
      grade: getSelectedGrade(),
      level: getSelectedGrade(),
      difficulty: question.difficulty || (index % 3) + 1,
      seconds: 50,
      domain: adaptiveDomains[index % adaptiveDomains.length],
      adaptiveLevel: (index % 3) + 1,
      isRepresentative: index % 2 === 0,
      rank,
      levelLabel: getSelectedGrade(),
      concept: `${subjectName} 쨌 ${stage.title}`,
      problem: question.question,
      answer: String(question.answer),
      choices: uniqueChoices,
      stable: stage.title,
      start: stage.title,
      code: contentKey.toUpperCase(),
      explanation: question.explanation || "?좏깮??怨쇰ぉ???듭떖 媛쒕뀗???ㅼ떆 ?뺤씤??蹂댁꽭??",
    };
  });
}

function startSubjectLevelTest(subjectName) {
  levelTestSubject = subjectName;
  localStorage.setItem("studyCoinLevelTestSubject", subjectName);
  const quizTitle = document.querySelector("#quizTitle");
  if (subjectName === "수학") {
    showScreen("quiz");
    resetLevelTest();
    return;
  }

  adaptiveQuestionPool = buildSubjectDiagnosticPool(subjectName);
  if (adaptiveQuestionPool.length < 5) {
    alert(`${subjectName} ?덈꺼?뚯뒪??臾명빆??以鍮?以묒엯?덈떎.`);
    return;
  }
  answeredQuestionIds = new Set();
  adaptiveState = createAdaptiveState(getSelectedGrade());
  adaptiveState.selectedSubject = subjectName;
  adaptiveState.representativeQueue = [...new Set(adaptiveQuestionPool.map((question) => question.concept))];
  adaptiveState.prerequisiteQueue = [];
  adaptiveState.focusDomain = adaptiveQuestionPool[0].domain;
  adaptiveState.nextDomain = adaptiveQuestionPool[1]?.domain || adaptiveQuestionPool[0].domain;
  activeQuestions = [];
  selectedAnswers = [];
  currentQuestion = 0;
  questionNumber = 1;
  timedOutQuestions = [];
  unknownQuestions = [];
  wrongQuestions = [];
  if (quizTitle) quizTitle.textContent = `${subjectName} 레벨테스트`;
  showScreen("quiz");
  addNextAdaptiveQuestion();
  startTimer(20 * 60);
  renderQuestion();
}

function selectNextAdaptiveQuestion() {
  const unanswered = adaptiveQuestionPool.filter((question) => !answeredQuestionIds.has(question.id));
  if (!unanswered.length) return null;

  const queuedPick = selectQueuedConceptQuestion(unanswered);
  if (queuedPick) return queuedPick;

  const domainStats = adaptiveState.scores[adaptiveState.focusDomain];
  const needsSameConcept = domainStats.confidence < 82 || domainStats.attempts < 3;
  const targetRank = adaptiveState.currentRank;
  const preferredDomain = needsSameConcept ? adaptiveState.focusDomain : adaptiveState.nextDomain;
  const neededLevel = getNeededAdaptiveLevel(adaptiveState.scores[preferredDomain]);

  const ranked = unanswered
    .map((question) => {
      const domainGap = question.domain === preferredDomain ? 0 : question.domain === adaptiveState.focusDomain ? 1 : 2;
      const rankGap = Math.abs(question.rank - targetRank);
      const levelGap = Math.abs(question.adaptiveLevel - neededLevel);
      const representativeBonus = Math.abs(targetRank - question.rank) <= 1 ? -0.6 : 0;
      const conceptAttempts = getConceptAttemptCount(question.concept);
      const repeatPenalty = conceptAttempts >= aiScoringRules.maxConceptChecks ? 999 : conceptAttempts * 14;
      return { question, weight: domainGap * 10 + levelGap * 3 + rankGap + representativeBonus + repeatPenalty };
    })
    .sort((a, b) => a.weight - b.weight);

  return ranked[0].question;
}

function selectQueuedConceptQuestion(unanswered) {
  dropOverCheckedQueueHeads("representativeQueue");
  dropOverCheckedQueueHeads("prerequisiteQueue");

  const hasRepresentativeCheck = adaptiveState.representativeQueue.length > 0;
  const isPrerequisiteCheck = !hasRepresentativeCheck && adaptiveState.prerequisiteQueue.length > 0;
  const nextConcept = hasRepresentativeCheck ? adaptiveState.representativeQueue[0] : adaptiveState.prerequisiteQueue[0];
  if (!nextConcept) return null;
  const targetRank = isPrerequisiteCheck ? null : adaptiveState.currentRank;

  return unanswered
    .filter((question) => {
      if (question.concept !== nextConcept) return false;
      if (!isPrerequisiteCheck) {
        const sameRankExists = unanswered.some((item) => item.concept === nextConcept && item.rank === targetRank);
        if (sameRankExists && question.rank !== targetRank) return false;
      }
      return true;
    })
    .map((question) => {
      const rankGap = Math.abs(question.rank - adaptiveState.currentRank);
      const levelGap = Math.abs(question.adaptiveLevel - 2);
      const representativeBonus = question.isRepresentative ? -2 : 0;
      return { question, weight: rankGap * 2 + levelGap + representativeBonus };
    })
    .sort((a, b) => a.weight - b.weight)[0]?.question || null;
}

function getConceptAttemptCount(concept) {
  return adaptiveState?.history.filter((item) => item.concept === concept).length || 0;
}

function dropOverCheckedQueueHeads(queueName) {
  while (
    adaptiveState?.[queueName]?.length
    && getConceptAttemptCount(adaptiveState[queueName][0]) >= aiScoringRules.maxConceptChecks
  ) {
    adaptiveState[queueName].shift();
  }
}

function selectInitialQuestion(unanswered) {
  const targetRank = adaptiveState.currentRank;
  const sameRank = unanswered.filter((question) => question.rank === targetRank);
  const nearRank = unanswered.filter((question) => Math.abs(question.rank - targetRank) <= 1);
  const candidates = sameRank.length ? sameRank : nearRank;

  return candidates
    .map((question) => {
      const domainGap = question.domain === adaptiveState.focusDomain ? 0 : question.domain === adaptiveState.nextDomain ? 1 : 2;
      const levelGap = Math.abs(question.adaptiveLevel - 2);
      return { question, weight: domainGap * 10 + levelGap * 2 };
    })
    .sort((a, b) => a.weight - b.weight)[0]?.question;
}

function getNeededAdaptiveLevel(stats) {
  if (!stats) return 1;
  if (stats.levels[1].attempts === 0) return 1;
  if (stats.levels[1].correct > 0 && stats.levels[2].attempts === 0) return 2;
  if (stats.levels[2].correct > 0 && stats.levels[3].attempts === 0) return 3;
  if (stats.levels[2].attempts > stats.levels[2].correct) return 2;
  if (stats.levels[3].attempts > stats.levels[3].correct) return 3;
  return Math.min(3, Math.max(1, Object.values(stats.levels).sort((a, b) => a.attempts - b.attempts)[0].attempts + 1));
}

function updateAdaptiveState(question, answer, solveSeconds) {
  const stats = adaptiveState.scores[question.domain];
  const isUnknown = answer === "紐⑤쫫";
  const isCorrect = answer === question.answer;
  const isBaselineRepresentative = question.isRepresentative && question.rank === adaptiveState.startRank;
  const responseImpact = calculateResponseImpact(question, isCorrect, isUnknown, solveSeconds);

  stats.attempts += 1;
  stats.totalTime += solveSeconds;
  stats.levels[question.adaptiveLevel].attempts += 1;

  if (isUnknown) {
    stats.unknown += 1;
    adaptiveState.streakCorrect = 0;
    adaptiveState.streakWrong += 1;
  } else if (isCorrect) {
    stats.correct += 1;
    stats.levels[question.adaptiveLevel].correct += 1;
    adaptiveState.streakCorrect += 1;
    adaptiveState.streakWrong = 0;
  } else {
    stats.wrong += 1;
    adaptiveState.streakCorrect = 0;
    adaptiveState.streakWrong += 1;
  }

  stats.score += responseImpact;
  stats.score = Math.max(0, Math.min(100, Math.round(stats.score)));
  stats.confidence = calculateConceptConfidence(stats);
  stats.masteryStage = calculateMasteryStage(stats);
  adaptiveState.history.push({
    id: question.id,
    domain: question.domain,
    concept: question.concept,
    level: question.adaptiveLevel,
    answer,
    correct: isCorrect,
    unknown: isUnknown,
    solveSeconds,
    savedAt: new Date().toISOString(),
  });
  updateConceptQueues(question, isCorrect, isUnknown);

  const testedDomains = Object.entries(adaptiveState.scores).filter(([, value]) => value.attempts > 0);
  adaptiveState.strongDomains = testedDomains.filter(([, value]) => value.confidence >= 82 && (value.masteryStage === "숙련" || value.masteryStage === "완전 숙달")).map(([domain]) => domain);
  adaptiveState.weakDomains = testedDomains.filter(([, value]) => value.confidence >= 45 && (value.masteryStage === "미학습" || value.masteryStage === "기초 이해" || value.wrong + value.unknown >= 2)).map(([domain]) => domain);
  adaptiveState.weakDomain = adaptiveState.weakDomains[0] || "";

  if (adaptiveState.streakWrong >= 5) {
    adaptiveState.feedback = "愿쒖갖?꾩슂. ?ㅻ젰???뚯븘媛??怨쇱젙?댁뿉?? 議곌툑 ???ъ슫 臾몄젣遺???쒖옉?대낵寃뚯슂.";
  } else if (adaptiveState.streakCorrect >= 5) {
    adaptiveState.feedback = "醫뗭븘?? ?앷컖蹂대떎 ?섑븯怨??덉뼱?? 議곌툑 ???대젮??臾몄젣瑜??쒕┫寃뚯슂.";
  } else if (isUnknown) {
    adaptiveState.feedback = "醫뗭븘?? 紐⑤Ⅴ??媛쒕뀗?대㈃ ???ъ슫 臾몄젣濡??ㅼ떆 ?뺤씤?대낵寃뚯슂.";
  } else {
    adaptiveState.feedback = "";
  }

  if (isCorrect && stats.confidence >= 82 && (stats.masteryStage === "숙련" || stats.masteryStage === "완전 숙달")) {
    adaptiveState.currentRank = Math.min(12, question.rank + 1);
    adaptiveState.focusDomain = pickNextDomain(question.domain);
  } else if ((!isCorrect || isUnknown) && !isBaselineRepresentative) {
    adaptiveState.currentRank = Math.max(1, question.rank - 1);
    adaptiveState.focusDomain = question.domain;
  } else if (!isCorrect || isUnknown) {
    adaptiveState.currentRank = adaptiveState.startRank;
    adaptiveState.focusDomain = question.domain;
  }

  adaptiveState.nextDomain = pickNextDomain(adaptiveState.focusDomain);
  adaptiveState.confidence = calculateOverallConfidence();
}

function updateConceptQueues(question, isCorrect, isUnknown) {
  adaptiveState.representativeQueue = adaptiveState.representativeQueue.filter((concept) => concept !== question.concept);
  adaptiveState.prerequisiteQueue = adaptiveState.prerequisiteQueue.filter((concept) => concept !== question.concept);

  if (isCorrect && !isUnknown) return;

  const prerequisites = prerequisiteConceptMap[question.concept] || [];
  const answeredConcepts = new Set(adaptiveState.history.map((item) => item.concept));
  const newPrerequisites = prerequisites.filter((concept) => {
    return !answeredConcepts.has(concept)
      && !adaptiveState.prerequisiteQueue.includes(concept)
      && !adaptiveState.representativeQueue.includes(concept);
  });

  adaptiveState.prerequisiteQueue.unshift(...newPrerequisites);
}

function calculateConceptConfidence(stats) {
  const evidence = Math.min(1, stats.attempts / 5);
  const levelCoverage = Object.values(stats.levels).filter((level) => level.attempts > 0).length / 3;
  const consistency = stats.attempts ? Math.max(0, 1 - (stats.wrong + stats.unknown) / stats.attempts) : 0;
  const averageTime = stats.attempts ? stats.totalTime / stats.attempts : 999;
  const timeStability = averageTime <= 12 ? 1 : averageTime <= 30 ? 0.75 : 0.45;
  return Math.round((evidence * 0.35 + levelCoverage * 0.3 + consistency * 0.25 + timeStability * 0.1) * 100);
}

function calculateResponseImpact(question, isCorrect, isUnknown, solveSeconds) {
  const expectedTime = Math.max(1, question.seconds);
  const timeRatio = solveSeconds / expectedTime;
  const difficultyWeight = aiScoringRules.difficultyWeight[question.adaptiveLevel] || 1;

  if (isUnknown) return aiScoringRules.response.unknown * difficultyWeight;
  if (!isCorrect) return aiScoringRules.response.wrong * difficultyWeight;
  if (timeRatio <= 0.45) return aiScoringRules.response.correctFast * difficultyWeight;
  if (timeRatio <= 0.9) return aiScoringRules.response.correctNormal * difficultyWeight;
  return aiScoringRules.response.correctSlow * difficultyWeight;
}

function calculateMasteryStage(stats) {
  if (stats.attempts === 0 || stats.confidence < 25) return "미학습";

  const level1 = stats.levels[1];
  const level2 = stats.levels[2];
  const level3 = stats.levels[3];
  const level1Ok = level1.correct > 0;
  const level2Ok = level2.correct > 0 && level2.correct >= level2.attempts * 0.6;
  const level3Ok = level3.correct > 0 && level3.correct >= level3.attempts * 0.6;

  if (stats.confidence >= 90 && level1Ok && level2Ok && level3Ok && stats.score >= 72) return "완전 숙달";
  if (stats.confidence >= 70 && level1Ok && level2Ok && stats.score >= 62) return "숙련";
  if (level1Ok || stats.score >= 45) return "기초 이해";
  return "미학습";
}

function calculateOverallConfidence() {
  const tested = Object.values(adaptiveState.scores).filter((stats) => stats.attempts > 0);
  if (!tested.length) return 12;
  const average = tested.reduce((sum, stats) => sum + stats.confidence, 0) / tested.length;
  const breadth = Math.min(1, tested.length / 7) * 20;
  return Math.min(98, Math.round(average * 0.8 + breadth));
}

function pickNextDomain(currentDomain) {
  const currentIndex = adaptiveDomains.indexOf(currentDomain);
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
  const ordered = [...adaptiveDomains.slice(startIndex), ...adaptiveDomains.slice(0, startIndex)];
  const uncertain = ordered.find((domain) => {
    const stats = adaptiveState.scores[domain];
    return stats.attempts > 0 && stats.confidence < 82;
  });
  if (uncertain) return uncertain;

  const next = ordered.find((domain) => adaptiveState.scores[domain].attempts < 3);
  return next || ordered[0] || "분수";
}

function shouldFinishAdaptiveTest() {
  const attempts = activeQuestions.length;
  if (attempts >= aiScoringRules.maxAdaptiveQuestions) return true;
  if (attempts < aiScoringRules.minAdaptiveQuestions) return false;

  const testedDomainCount = Object.values(adaptiveState.scores).filter((stats) => stats.attempts > 0).length;
  const uncertainDomains = Object.values(adaptiveState.scores).filter((stats) => stats.attempts > 0 && stats.confidence < 70).length;
  const coreDomainsReady = requiredExitDomains.every((domain) => {
    const stats = adaptiveState.scores[domain];
    return stats.attempts >= 3 && stats.confidence >= aiScoringRules.targetConfidence;
  });
  const weakClear = adaptiveState.weakDomains.length > 0 && attempts >= 9 && uncertainDomains <= 2;
  const enoughEvidence = adaptiveState.confidence >= 82 && testedDomainCount >= 5;
  const highPerformerClear = attempts >= 18 && testedDomainCount >= 6 && adaptiveState.weakDomains.length === 0 && uncertainDomains <= 1;

  return coreDomainsReady || (weakClear && enoughEvidence) || highPerformerClear;
}

function updateAdaptiveDisplay(question) {
  const checked = Object.entries(adaptiveState.scores)
    .filter(([, stats]) => stats.attempts > 0)
    .map(([domain]) => `확인 ${domain}`)
    .slice(0, 4);

  quizCount.textContent = "AI 분석 중";
  quizProgress.style.width = `${adaptiveState.confidence}%`;
  quizRoute.textContent = adaptiveState.feedback || "AI가 현재 실력을 분석하고 있습니다.";
  currentAnalysis.textContent = question?.domain || adaptiveState.focusDomain;
  checkedAnalysis.textContent = checked.length ? checked.join(" · ") : "분석 시작";
  nextAnalysis.textContent = adaptiveState.prerequisiteQueue[0] || adaptiveState.representativeQueue[0] || adaptiveState.nextDomain;
}

function getSavedLevelTest() {
  try {
    const saved = JSON.parse(localStorage.getItem(levelTestStorageKey));
    if (!saved || saved.completed) return null;
    if (saved.engineVersion !== levelTestEngineVersion) return null;
    if (!saved.selectedGrade || !saved.adaptiveState?.representativeQueue) return null;
    if (saved.selectedGrade && saved.selectedGrade !== getSelectedGrade()) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveLevelTestState() {
  if (!adaptiveState || !activeQuestions.length) return;

  localStorage.setItem(levelTestStorageKey, JSON.stringify({
    engineVersion: levelTestEngineVersion,
    savedAt: new Date().toISOString(),
    completed: false,
    selectedGrade: getSelectedGrade(),
    activeQuestions,
    selectedAnswers,
    currentQuestion,
    answeredQuestionIds: [...answeredQuestionIds],
    adaptiveState,
    timedOutQuestionIds: timedOutQuestions.map((question) => question.id),
    unknownQuestionIds: unknownQuestions.map((question) => question.id),
    wrongQuestionIds: wrongQuestions.map((question) => question.id),
    remainingSeconds,
  }));
}

function clearSavedLevelTest() {
  localStorage.removeItem(levelTestStorageKey);
}

function restoreLevelTestState(saved) {
  levelTestSubject = saved.adaptiveState?.selectedSubject || "?섑븰";
  adaptiveQuestionPool = levelTestSubject === "?섑븰" ? buildAdaptiveQuestionPool() : buildSubjectDiagnosticPool(levelTestSubject);
  const quizTitle = document.querySelector("#quizTitle");
  if (quizTitle) quizTitle.textContent = `${levelTestSubject} 레벨테스트`;
  activeQuestions = saved.activeQuestions || [];
  selectedAnswers = saved.selectedAnswers || [];
  currentQuestion = Math.min(saved.currentQuestion || activeQuestions.length - 1, activeQuestions.length - 1);
  questionNumber = activeQuestions.length;
  answeredQuestionIds = new Set(saved.answeredQuestionIds || activeQuestions.map((question) => question.id));
  adaptiveState = saved.adaptiveState || createAdaptiveState();
  timedOutQuestions = activeQuestions.filter((question) => (saved.timedOutQuestionIds || []).includes(question.id));
  unknownQuestions = activeQuestions.filter((question) => (saved.unknownQuestionIds || []).includes(question.id));
  wrongQuestions = activeQuestions.filter((question) => (saved.wrongQuestionIds || []).includes(question.id));
  reviewMode = false;
  startTimer(saved.remainingSeconds || 20 * 60);
  renderQuestion();
}

function showResumeScreen(saved) {
  const checked = Object.entries(saved.adaptiveState?.scores || {})
    .filter(([, stats]) => stats.attempts > 0)
    .map(([domain]) => domain);
  const savedAt = new Date(saved.savedAt);
  const ageDays = Math.floor((Date.now() - savedAt.getTime()) / 86400000);
  const staleCopy = ageDays >= staleResumeDays ? "30일 이상 지나 현재 실력과 다를 수 있어요." : `${Math.max(0, ageDays)}일 전에 저장`;

  resumeProgress.style.width = `${saved.adaptiveState?.confidence || 0}%`;
  resumePercent.textContent = `AI 遺꾩꽍 ${saved.adaptiveState?.confidence || 0}%`;
  resumeChecked.textContent = checked.length ? checked.join(", ") : "遺꾩꽍 ?쒖옉";
  resumeFocus.textContent = saved.adaptiveState?.focusDomain || "遺꾩닔";
  resumeSavedAt.textContent = staleCopy;
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === "resume-test");
  });
}

function resetLevelTest() {
  levelTestSubject = "수학";
  localStorage.setItem("studyCoinLevelTestSubject", levelTestSubject);
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  quizScreen?.removeAttribute("data-test-mode");
  adaptiveQuestionPool = buildAdaptiveQuestionPool();
  quizScreen?.classList.remove("elite-mode");
  answeredQuestionIds = new Set();
  adaptiveState = createAdaptiveState(getSelectedGrade());
  adaptiveState.selectedSubject = "수학";
  activeQuestions = [];
  selectedAnswers = [];
  currentQuestion = 0;
  questionNumber = 1;
  firstWrongQuestion = null;
  lastAnsweredQuestion = null;
  timedOutQuestions = [];
  unknownQuestions = [];
  wrongQuestions = [];
  const quizTitle = document.querySelector("#quizTitle");
  if (quizTitle) quizTitle.textContent = "수학 레벨테스트";
  addNextAdaptiveQuestion();
  startTimer(20 * 60);
  renderQuestion();
}

function createEliteState(grade = getSelectedGrade()) {
  const rank = buildEliteQuestionPool(grade)[0]?.rank || 8;
  const stats = {
    score: 50,
    confidence: 0,
    masteryStage: "확인 중",
    attempts: 0,
    correct: 0,
    wrong: 0,
    unknown: 0,
    totalTime: 0,
    levels: {
      1: { attempts: 0, correct: 0 },
      2: { attempts: 0, correct: 0 },
      3: { attempts: 0, correct: 0 },
    },
  };

  return {
    testType: "elite",
    selectedGrade: grade,
    startRank: rank,
    currentRank: rank,
    focusDomain: "엘리트 사고력",
    nextDomain: "엘리트 사고력",
  targetDifficulty: 4,
    scores: { "엘리트 사고력": stats },
    history: [],
    strongDomains: [],
    weakDomains: [],
    weakDomain: "",
    confidence: 0,
    feedback: "?곸쐞沅??ы솕 ?ш퀬?μ쓣 ?뺤씤?섍퀬 ?덉뒿?덈떎.",
    representativeQueue: [],
    prerequisiteQueue: [],
  };
}

function resetEliteTest() {
  initializeEliteTest();
  startTimer(20 * 60);
  renderQuestion();
}

function initializeEliteTest() {
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  eliteQuestionPool = buildEliteQuestionPool(getSelectedGrade());
  adaptiveQuestionPool = [];
  eliteState = createEliteState(getSelectedGrade());
  adaptiveState = eliteState;
  quizScreen?.classList.add("elite-mode");
  answeredQuestionIds = new Set();
  activeQuestions = [];
  selectedAnswers = [];
  currentQuestion = 0;
  questionNumber = 1;
  firstWrongQuestion = null;
  lastAnsweredQuestion = null;
  timedOutQuestions = [];
  unknownQuestions = [];
  wrongQuestions = [];
  const quizTitle = document.querySelector("#quizTitle");
  if (quizTitle) quizTitle.textContent = "Elite 레벨테스트";
  addNextEliteQuestion();
}

function buildEliteQuestionPool(grade) {
  const rankByGrade = {
    "珥덈벑 4?숇뀈": 4,
    "珥덈벑 5?숇뀈": 5,
    "珥덈벑 6?숇뀈": 6,
    "以묐벑 1?숇뀈": 7,
    "以묐벑 2?숇뀈": 8,
    "以묐벑 3?숇뀈": 9,
    "怨좊벑 1?숇뀈": 10,
    "怨좊벑 2?숇뀈": 11,
    "怨좊벑 3?숇뀈": 12,
  };
  const selectedGrade = eliteAdvancedQuestionTemplates[grade] ? grade : "以묐벑 2?숇뀈";
  const rank = rankByGrade[selectedGrade];

  const templates = [
    ...eliteAdvancedQuestionTemplates[selectedGrade],
    ...(eliteExtensionQuestionTemplates[selectedGrade] || []),
  ];

  return templates.map(([concept, problem, answer, choices], index) => ({
    id: `elite-${rank}-${index}`,
    conceptId: `elite_${rank}_${index}`,
    bank: `elite${rank}`,
    grade: selectedGrade,
    level: rank >= 10 ? "high" : rank >= 7 ? "middle" : "elementary",
    difficulty: "elite",
    seconds: rank >= 10 ? 120 : rank >= 7 ? 90 : 75,
    domain: "엘리트 사고력",
    adaptiveLevel: 3,
    eliteDifficulty: Math.min(7, index + 3),
    isRepresentative: true,
    rank,
    levelLabel: selectedGrade,
    concept,
    problem,
    answer,
    choices,
    stable: selectedGrade,
    start: concept,
    code: `ELITE-${rank}`,
    explanation: `${concept} ?ы솕 臾몄젣?낅땲?? ?뺣떟? ${answer}?낅땲??`,
  }));
}

function selectNextEliteQuestion() {
  const unanswered = eliteQuestionPool.filter((question) => !answeredQuestionIds.has(question.id));
  if (!unanswered.length) return null;

  return unanswered
    .map((question) => {
      const difficultyGap = Math.abs(question.eliteDifficulty - eliteState.targetDifficulty);
      const slowPenalty = eliteState.history.some((item) => item.concept === question.concept) ? 100 : 0;
      return { question, weight: difficultyGap * 10 + slowPenalty };
    })
    .sort((a, b) => a.weight - b.weight)[0].question;
}

function addNextEliteQuestion() {
  const next = activeQuestions.length === 0
    ? eliteQuestionPool[0]
    : selectNextEliteQuestion();
  if (!next) return false;
  answeredQuestionIds.add(next.id);
  activeQuestions.push(next);
  selectedAnswers.push("");
  currentQuestion = activeQuestions.length - 1;
  questionNumber = activeQuestions.length;
  return true;
}

function updateEliteState(question, answer, solveSeconds) {
  const stats = eliteState.scores["엘리트 사고력"];
  const isUnknown = answer === "紐⑤쫫";
  const isCorrect = answer === question.answer;
  const expectedTime = Math.max(1, question.seconds);
  const quickSolve = solveSeconds <= expectedTime * 0.75;

  stats.attempts += 1;
  stats.totalTime += solveSeconds;
  stats.levels[3].attempts += 1;
  if (isCorrect) {
    stats.correct += 1;
    stats.levels[3].correct += 1;
    stats.score = Math.min(100, stats.score + (quickSolve ? 20 : 14));
    eliteState.targetDifficulty = Math.min(7, eliteState.targetDifficulty + 1);
  } else if (isUnknown) {
    stats.unknown += 1;
    stats.score = Math.max(0, stats.score - 20);
    eliteState.targetDifficulty = Math.max(3, eliteState.targetDifficulty - 1);
  } else {
    stats.wrong += 1;
    stats.score = Math.max(0, stats.score - 14);
    eliteState.targetDifficulty = Math.max(3, eliteState.targetDifficulty - 1);
  }

  const accuracy = stats.correct / stats.attempts;
  const evidence = Math.min(1, stats.attempts / 8);
  stats.confidence = Math.round((accuracy * 70 + evidence * 30));
  stats.masteryStage = stats.confidence >= 85 ? "?섎━???듦낵" : stats.confidence >= 60 ? "?ы솕 ?꾩쟾" : "異붽? ?뺤씤";
  eliteState.confidence = stats.confidence;
  eliteState.history.push({ id: question.id, concept: question.concept, answer, correct: isCorrect, unknown: isUnknown, solveSeconds });
  eliteState.strongDomains = stats.confidence >= 75 ? ["엘리트 사고력"] : [];
  eliteState.weakDomains = !isCorrect ? [question.concept] : [];
  eliteState.weakDomain = eliteState.weakDomains[0] || "";
  eliteState.feedback = isCorrect
    ? "醫뗭븘?? ?ㅼ쓬 ?ы솕 ?쒖씠?꾨줈 ?щ젮蹂쇨쾶??"
    : "???좏삎? ???④퀎 ??떠 ?듭떖 ?ш퀬 怨쇱젙???ㅼ떆 ?뺤씤?좉쾶??";
}

function shouldFinishEliteTest() {
  const stats = eliteState.scores["엘리트 사고력"];
  return stats.attempts >= 8 && (stats.confidence >= 85 || eliteQuestionPool.every((question) => answeredQuestionIds.has(question.id)));
}

function addNextAdaptiveQuestion() {
  const next = selectNextAdaptiveQuestion();
  if (!next) return false;

  answeredQuestionIds.add(next.id);
  activeQuestions.push(next);
  selectedAnswers.push("");
  currentQuestion = activeQuestions.length - 1;
  questionNumber = activeQuestions.length;
  return true;
}

function getTotalSeconds() {
  return activeQuestions.reduce((sum, question) => sum + question.seconds, 0);
}

function buildQuestionsForGrade(grade) {
  const plan = gradePlans[grade] || gradePlans["珥덈벑 1?숇뀈"];

  return plan.flatMap(({ bank, count }) => {
    const concepts = conceptBanks[bank].slice(0, count);

    return concepts.map((item, index) => {
      if (!Array.isArray(item)) return normalizeQuestion(item, bank, index);
      const [concept, problem, answer, choices] = item;
      return {
      id: `${bank}-${index}-${concept}`,
      conceptId: createConceptId(concept),
      bank,
      grade: getAdaptiveMeta(bank).levelLabel,
      level: getLevelFromBank(bank),
      difficulty: getDifficultyFromBank(bank),
      seconds: getSecondsFromBank(bank),
      domain: inferAdaptiveDomain(concept, bank),
      adaptiveLevel: (index % 3) + 1,
      isRepresentative: isRepresentativeConcept(concept),
      rank: getAdaptiveMeta(bank).rank,
      levelLabel: getAdaptiveMeta(bank).levelLabel,
      concept,
      problem,
      answer,
      choices,
      stable: getStableFromBank(bank),
      start: concept,
      code: bank.toUpperCase(),
      explanation: `${concept} 臾몄젣?낅땲?? ?좏깮吏 以??뺣떟? ${answer}?낅땲?? ??臾명빆????몃떎硫?癒쇱? ${getStableFromBank(bank)} 媛쒕뀗???ㅼ떆 ?뺤씤?섏꽭??`,
      };
    });
  });
}

function getLevelFromBank(bank) {
  if (bank.startsWith("h")) return "high";
  if (bank.startsWith("m")) return "middle";
  return "elementary";
}

function getAdaptiveMeta(bank) {
  return bankAdaptiveMeta[bank] || { domain: "계산", rank: 1, levelLabel: "기초" };
}

function createConceptId(concept) {
  return concept.replace(/\s+/g, "_").toLowerCase();
}

function isRepresentativeConcept(concept) {
  return Object.values(representativeConceptsByGrade).some((concepts) => concepts.includes(concept));
}

function inferAdaptiveDomain(concept, bank) {
  if (/분수|약분|통분/.test(concept)) return "분수";
  if (/소수/.test(concept)) return "소수";
  if (/비율|비례|백분율|속력/.test(concept)) return "비율";
  if (/문자|방정식|부등식|인수분해/.test(concept)) return bank === "m2" || bank === "m3" || bank.startsWith("h") ? "방정식" : "문자식";
  if (/함수|좌표|그래프|정비례|반비례/.test(concept)) return "함수";
  if (/도형|각도|삼각|사각|넓이|부피|합동|닮음|피타고라스/.test(concept)) return "도형";
  if (/확률|경우|통계|평균|자료|가능성/.test(concept)) return "논리";
  if (/수|비교|규칙/.test(concept)) return "수 감각";
  return getAdaptiveMeta(bank).domain;
}

function getDifficultyFromBank(bank) {
  return bank === "g1" || bank === "g2" ? "easy" : "hard";
}

function getSecondsFromBank(bank) {
  const seconds = {
    g1: 5,
    g2: 5,
    g3: 12,
    g4: 18,
    g5: 25,
    g6: 30,
    m1: 35,
    m2: 40,
    m3: 45,
    h1: 50,
    h2: 60,
    h3: 60,
  };

  return seconds[bank] || 30;
}

function getStableFromBank(bank) {
  const labels = {
    g1: "珥? ??媛쒕뀗/?㏃뀍/類꾩뀍",
    g2: "珥? ???먮━ ??怨깆뀍援ш뎄",
    g3: "珥? ?섎닓??怨깆뀍/遺꾩닔? ?뚯닔",
    g4: "珥? ????媛곷룄/遺꾩닔? ?뚯닔 怨꾩궛",
    g5: "珥? ?쎌닔? 諛곗닔/?쎈텇怨??듬텇/遺꾩닔 怨깆뀍",
    g6: "珥? 鍮꾩쑉/遺꾩닔 ?섎닓???낆껜?꾪삎",
    m1: "以? ?꾩닔 媛쒕뀗",
    m2: "以? ?꾩닔 媛쒕뀗",
    m3: "以? ?꾩닔 媛쒕뀗",
    h1: "怨? 怨듯넻?섑븰",
    h2: "怨? ?섑븰 I/II",
    h3: "怨? 誘몄쟻遺??뺥넻",
  };

  return labels[bank] || "?꾩닔 媛쒕뀗";
}

function getWrongEntries() {
  return activeQuestions
    .map((question, index) => ({
      question,
      index,
      selected: selectedAnswers[index],
    }))
    .filter((entry) => entry.selected && entry.selected !== "紐⑤쫫" && entry.selected !== entry.question.answer);
}

function getUnknownCount() {
  return selectedAnswers.filter((answer) => answer === "紐⑤쫫").length;
}

function renderWrongReview(entries) {
  wrongReviewSummary.textContent = `오답 ${entries.length}개`;

  if (!entries.length) {
    wrongReviewList.innerHTML = `<li class="empty">?ㅻ떟 臾명빆???놁뒿?덈떎. 紐⑤쫫?대굹 ?쒓컙 遺議?臾명빆? ?룰컝由쇱쑝濡쒕쭔 ?먯닔??諛섏쁺?덉뼱??</li>`;
    return;
  }

  wrongReviewList.innerHTML = entries.map(({ question, index, selected }) => `
    <li>
      <button type="button" data-review-index="${index}">
        <b>${index + 1}踰?쨌 ${question.concept}</b>
        <span>???? ${selected} / ?뺣떟: ${question.answer}</span>
        <span>${question.explanation}</span>
      </button>
    </li>
  `).join("");
}

function renderReviewExplanation(question, selected) {
  reviewExplanation.innerHTML = `
    <h3>${currentQuestion + 1}踰????/h3>
    <p><b>????</b> ${selected || "?좏깮 ?놁쓬"}</p>
    <p><b>?뺣떟:</b> ${question.answer}</p>
    <p>${question.explanation}</p>
  `;
  reviewExplanation.classList.remove("hidden");
}

function openReviewQuestion(index) {
  reviewMode = true;
  stopTimer();
  currentQuestion = index;
  selectedAnswer = selectedAnswers[index] || "";
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === "quiz");
  });
  renderQuestion();
}

function getEstimatedLevel() {
  if (!activeQuestions.length) return "분석 중";

  const correctRanks = activeQuestions
    .map((question, index) => ({ question, answer: selectedAnswers[index] }))
    .filter(({ question, answer }) => answer === question.answer)
    .map(({ question }) => question.rank);
  const fallbackRank = activeQuestions[Math.max(0, activeQuestions.length - 1)].rank;
  const rank = correctRanks.length ? Math.round(correctRanks.reduce((sum, value) => sum + value, 0) / correctRanks.length) : fallbackRank;
  const closest = Object.values(bankAdaptiveMeta).reduce((best, meta) => {
    return Math.abs(meta.rank - rank) < Math.abs(best.rank - rank) ? meta : best;
  }, bankAdaptiveMeta.g4);

  return closest.levelLabel;
}

function getRecommendedPath() {
  const weak = adaptiveState?.weakDomains[0] || "비율";
  const paths = {
    "수 감각": ["수 감각", "수의 성질", "규칙 찾기"],
    계산: ["수의 자리와 계산", "곱셈", "나눗셈"],
    분수: ["약분과 통분", "분수의 성질", "분수의 계산"],
    소수: ["소수의 성질", "소수의 계산", "소수와 나눗셈"],
    비율: ["비와 비율", "비례식", "문자식", "일차방정식"],
    문자식: ["문자식 계산", "등식의 성질", "일차방정식"],
    방정식: ["일차방정식", "연립방정식", "이차방정식"],
    함수: ["좌표평면", "정비례와 반비례", "일차함수", "이차함수"],
    도형: ["각도와 평면도형", "합동과 닮음", "피타고라스 정리"],
    논리: ["경우의 수", "확률", "자료 해석"],
  };

  return paths[weak] || paths.비율;
}

function updateResultFromTest() {
  clearInterval(timerId);
  completeOnboarding();
  const wrongEntries = getWrongEntries();
  const unknownCount = getUnknownCount();
  const unansweredIndex = selectedAnswers.findIndex((answer) => !answer);
  const weakQuestion = wrongEntries[0]?.question ?? unknownQuestions[0] ?? (unansweredIndex >= 0
    ? activeQuestions[unansweredIndex]
    : lastAnsweredQuestion ?? timedOutQuestions[0] ?? activeQuestions[activeQuestions.length - 1]);
  const hesitationQuestion = timedOutQuestions[0];
  const wrongQuestion = wrongEntries[0]?.question;
  const stable = weakQuestion.concept;
  const start = wrongQuestion ? wrongQuestion.start : unansweredIndex >= 0 ? weakQuestion.start : hesitationQuestion ? hesitationQuestion.concept : "?ㅼ쓬 ?④퀎 ?ы솕";
  const score = Math.max(0, Math.round(((activeQuestions.length - wrongEntries.length - unknownCount) / activeQuestions.length) * 100 - timedOutQuestions.length * 4 - (unansweredIndex >= 0 ? 8 : 0)));

  const estimatedLevel = getEstimatedLevel();
  const strong = adaptiveState.strongDomains.length ? adaptiveState.strongDomains : ["계산"];
  const weak = adaptiveState.weakDomains.length ? adaptiveState.weakDomains : [weakQuestion.domain];
  const path = getRecommendedPath();

  resultLevel.textContent = estimatedLevel;
  resultStartCopy.textContent = wrongEntries.length
    ? `${wrongQuestion.concept}?먯꽌 ?ㅻ떟???덉뿀?댁슂. ??媛쒕뀗遺???ㅼ떆 ?뺤씤?섎㈃ 醫뗭븘??`
    : unknownCount
    ? `${weakQuestion.concept}??紐⑤Ⅸ?ㅺ퀬 ?쒖떆?덉뼱?? ??媛쒕뀗遺???ㅼ떆 ?뺤씤?섎㈃ 醫뗭븘??`
    : unansweredIndex >= 0
      ? `${weakQuestion.concept}源뚯? ?듯븯吏 紐삵뻽?댁슂. ${start}遺???ㅼ떆 ?뺤씤?섎㈃ 醫뗭븘??`
    : timedOutQuestions.length
      ? `${hesitationQuestion.concept}?먯꽌 ?쒓컙???ㅻ옒 嫄몃졇?댁슂. ?ㅻ떟? ?꾨땲怨??룰컝由щ뒗 媛쒕뀗?쇰줈 湲곕줉?좉쾶??`
      : `${weakQuestion.concept}源뚯? ?덉젙?곸쑝濡?吏꾨떒?덉뼱?? ?ㅼ쓬 ?④퀎遺???댁뼱媛硫?醫뗭븘??`;
  stableZone.textContent = stable;
  startLevel.textContent = start;
  blockedConcept.textContent = wrongQuestion?.concept || hesitationQuestion?.concept || weakQuestion.concept;
  resultTotal.textContent = "AI 遺꾩꽍 ?꾨즺";
  stableZone.textContent = `${score}점`;
  wrongCount.textContent = `${wrongEntries.length}개`;
  startLevel.textContent = `${unknownCount + timedOutQuestions.length}개`;
  strongDomains.textContent = strong.join(", ");
  weakDomains.textContent = weak.join(", ");
  confidenceDomains.textContent = Object.entries(adaptiveState.scores)
    .filter(([, stats]) => stats.attempts > 0)
    .sort((a, b) => b[1].confidence - a[1].confidence)
    .slice(0, 5)
    .map(([domain, stats]) => `${domain} ${stats.confidence}%`)
    .join(" 쨌 ");
  masteryDomains.textContent = Object.entries(adaptiveState.scores)
    .filter(([, stats]) => stats.attempts > 0)
    .sort((a, b) => b[1].attempts - a[1].attempts)
    .slice(0, 5)
    .map(([domain, stats]) => `${domain}: ${stats.masteryStage}`)
    .join(" 쨌 ");
  learningPath.textContent = path.join(" ??");
  renderWrongReview(wrongEntries);
  renderConceptMap(weakQuestion);
  window.STUDY_LEARNING_ENGINE?.recordPlacementResult({
    estimatedLevel,
    score,
    strongDomains: strong,
    weakDomains: weak,
    recommendedPath: path,
    completedAt: new Date().toISOString(),
  });
}

function renderConceptMap(weakQuestion) {
  const orderedBanks = [...new Set(activeQuestions.map((question) => question.bank))];
  const weakBankIndex = orderedBanks.indexOf(weakQuestion.bank);

  conceptMapList.innerHTML = orderedBanks.map((bank, index) => {
    const label = getStableFromBank(bank);

    if (index < weakBankIndex) {
      return `<li class="ok"><b>${label}</b><span>?덉젙</span></li>`;
    }

    if (index === weakBankIndex) {
      return `<li class="warn"><b id="blockedConcept">${weakQuestion.concept}</b><span>?룰컝由?媛쒕뀗</span></li>`;
    }

    return `<li><b>${label}</b><span>?댄썑 吏꾨떒 援ш컙</span></li>`;
  }).join("");
}

function startTimer(seconds) {
  clearInterval(timerId);
  remainingSeconds = seconds;
  timeLeft.textContent = formatTime(remainingSeconds);

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    timeLeft.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function handleTimeout() {
  stopTimer();
  const question = activeQuestions[currentQuestion];
  if (!timedOutQuestions.includes(question)) timedOutQuestions.push(question);
  toastIcon.textContent = "⏱";
  toastTitle.textContent = "?꾩껜 ?쒓컙???앸궗?댁슂";
  toastCopy.textContent = "?⑥? 臾명빆? ?듯븯吏 紐삵븳 寃껋쑝濡??먭퀬 寃곌낵瑜??뺣━?좉쾶??";
  quizToast.classList.remove("hidden");
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const isBackButton = button.textContent.trim() === "‹";
    if (isBackButton) {
      goBack(button.dataset.go || "home");
      return;
    }

    reviewMode = false;
    if (button.dataset.go === "level-test" || button.dataset.go === "quiz") updateLevelTestCopy();

    if (button.dataset.go === "quiz") {
      document.querySelector('[data-screen="quiz"]')?.removeAttribute("data-test-mode");
    }

    if (button.dataset.go === "level-test" && button.id !== "setupLevelStart") {
      const saved = getSavedLevelTest();
      if (saved) {
        showResumeScreen(saved);
        return;
      }
    }

    if (button.dataset.go === "quiz" && button.id !== "setupLevelStart") {
      const saved = getSavedLevelTest();
      if (saved) {
        showResumeScreen(saved);
        return;
      }
    }

    if (document.querySelector('[data-screen="quiz"]').classList.contains("active") && button.dataset.go !== "result") {
      saveLevelTestState();
    }

    showScreen(button.dataset.go);
  });
});

const levelTestSubjectButtons = document.querySelectorAll("[data-level-test-subject]");
const setupLevelStart = document.querySelector("#setupLevelStart");

function syncLevelTestSubjectPicker() {
  levelTestSubjectButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.levelTestSubject === levelTestSubject);
  });
}

levelTestSubjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    levelTestSubject = button.dataset.levelTestSubject;
    localStorage.setItem("studyCoinLevelTestSubject", levelTestSubject);
    syncLevelTestSubjectPicker();
    updateLevelTestCopy();
  });
});

setupLevelStart?.addEventListener("click", () => startSubjectLevelTest(levelTestSubject));
syncLevelTestSubjectPicker();

const testSubjectModal = document.querySelector("#testSubjectModal");
const testSubjectEyebrow = document.querySelector("#testSubjectEyebrow");
const testSubjectClose = document.querySelector("#testSubjectClose");
let pendingTestMode = "standard";

function closeTestSubjectModal() {
  testSubjectModal?.classList.add("hidden");
}

document.querySelectorAll("[data-open-test-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    pendingTestMode = button.dataset.openTestSubject || "standard";
    if (testSubjectEyebrow) testSubjectEyebrow.textContent = pendingTestMode === "elite" ? "Elite Test" : "레벨테스트";
    testSubjectModal?.classList.remove("hidden");
  });
});

document.querySelectorAll("[data-test-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    const subject = button.dataset.testSubject;
    closeTestSubjectModal();
    if (pendingTestMode === "elite") {
      document.dispatchEvent(new CustomEvent("study:start-elite-test", { detail: { subject } }));
      return;
    }
    startSubjectLevelTest(subject);
  });
});

testSubjectClose?.addEventListener("click", closeTestSubjectModal);
testSubjectModal?.addEventListener("click", (event) => {
  if (event.target === testSubjectModal) closeTestSubjectModal();
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
});

function handleSignup() {
  const name = studentName.value.trim() || "?숈깮";
  const userId = signupUser.value.trim();
  const password = signupPassword.value.trim();
  const role = getSelectedRole();

  signupError.classList.add("hidden");
  signupSuccess.classList.add("hidden");

  if (!userId || password.length < 4) {
    signupError.textContent = "?꾩씠?붿? 4?먮━ ?댁긽 鍮꾨?踰덊샇瑜??낅젰??二쇱꽭??";
    signupError.classList.remove("hidden");
    return;
  }

  const users = getAuthUsers();
  if (users[userId]) {
    signupError.textContent = "?대? 媛?낅맂 ?꾩씠?붿삁?? ?ㅻⅨ ?꾩씠?붾? ?낅젰??二쇱꽭??";
    signupError.classList.remove("hidden");
    return;
  }

  try {
    users[userId] = {
      id: userId,
      name,
      role,
      password,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
    };
    saveAuthUsers(users);
  } catch (error) {
    signupError.textContent = "?뚯썝媛????μ뿉 ?ㅽ뙣?덉뼱?? ?ㅼ떆 ?쒕룄??二쇱꽭??";
    signupError.classList.remove("hidden");
    return;
  }

  const savedUser = getAuthUsers()[userId];
  if (!savedUser) {
    signupError.textContent = "?뚯썝媛????μ뿉 ?ㅽ뙣?덉뼱?? ?ㅼ떆 ?쒕룄??二쇱꽭??";
    signupError.classList.remove("hidden");
    return;
  }

  setCurrentUser(userId);
  saveLearningSettings();

  profileName.value = name;
  updateHomeProfile();
  loginUser.value = userId;
  loginPassword.value = password;
  signupSuccess.classList.remove("hidden");
  setTimeout(() => showScreen("profile-setup"), 250);
}

signupButton.addEventListener("click", handleSignup);

document.querySelector('[data-screen="signup"] form')?.addEventListener("submit", (event) => {
  event.preventDefault();
  handleSignup();
});

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    updateRoleCopy();
    saveLearningSettings();
  });
});

loginButton.addEventListener("click", () => {
  const userId = loginUser.value.trim();
  const password = loginPassword.value.trim();
  const user = getAuthUsers()[userId];

  if (!user || user.password !== password) {
    loginError.classList.remove("hidden");
    return;
  }

  loginError.classList.add("hidden");
  setCurrentUser(userId);
  if (user.name) {
    profileName.value = user.name;
    updateHomeProfile();
  }
  routeAfterLogin({ restoreScreen: false });
});

choiceGroups.forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.grade) {
      document.querySelectorAll("[data-grade]").forEach((item) => item.classList.remove("selected"));
      clearSavedLevelTest();
    } else {
      group.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
    }

    button.classList.add("selected");
    updateLevelTestCopy();
    saveLearningSettings();
  });
});

schoolTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelName = tab.dataset.schoolTab;
    schoolTabs.forEach((item) => item.classList.remove("selected"));
    gradePanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.gradePanel === panelName));
    tab.classList.add("selected");

    const activePanel = document.querySelector(`[data-grade-panel="${panelName}"]`);
    const selectedGrade = activePanel.querySelector("[data-grade].selected") || activePanel.querySelector("[data-grade]");
    document.querySelectorAll("[data-grade]").forEach((item) => item.classList.remove("selected"));
    selectedGrade.classList.add("selected");
    clearSavedLevelTest();
    updateLevelTestCopy();
    saveLearningSettings();
  });
});

subjectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("selected");

    if (![...subjectButtons].some((item) => item.classList.contains("selected"))) {
      button.classList.add("selected");
    }

    updateLevelTestCopy();
    saveLearningSettings();
  });
});

answerList.addEventListener("click", (event) => {
  if (reviewMode) return;

  const button = event.target.closest("[data-answer]");
  if (!button) return;

  selectedAnswer = button.dataset.answer;
  selectedAnswers[currentQuestion] = selectedAnswer;
  const question = activeQuestions[currentQuestion];
  wrongQuestions = wrongQuestions.filter((item) => item !== question);
  unknownQuestions = unknownQuestions.filter((item) => item !== question);

  answerList.querySelectorAll("button").forEach((item) => {
    item.classList.remove("selected", "correct", "wrong");
  });

  button.classList.add("selected");
  quizToast.classList.add("hidden");
  nextQuestion.textContent = "?ㅼ쓬 臾몄젣";
});

nextQuestion.addEventListener("click", () => {
  if (reviewMode) return;
  if (!selectedAnswer || isChecking) return;

  const question = activeQuestions[currentQuestion];
  isChecking = true;
  lastAnsweredQuestion = question;

  if (currentQuestion < activeQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  if (selectedAnswer !== "timeout") {
    if (selectedAnswer !== question.answer && !wrongQuestions.includes(question)) {
      wrongQuestions.push(question);
    }

    answerList.querySelectorAll("button").forEach((item) => {
      item.disabled = true;
      item.classList.remove("correct", "wrong");
    });
  }

  const solveSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
  updateAdaptiveState(question, selectedAnswer, solveSeconds);
  saveLevelTestState();

  const testFinished = shouldFinishAdaptiveTest();
  const hasNextQuestion = testFinished
    ? false
    : addNextAdaptiveQuestion();

  if (testFinished || !hasNextQuestion) {
    updateResultFromTest();
    clearSavedLevelTest();
    showScreen("result");
    return;
  }

  saveLevelTestState();
  renderQuestion();
});

unknownQuestion.addEventListener("click", () => {
  if (reviewMode) return;
  if (isChecking) return;

  const question = activeQuestions[currentQuestion];
  wrongQuestions = wrongQuestions.filter((item) => item !== question);
  unknownQuestions = unknownQuestions.filter((item) => item !== question);
  unknownQuestions.push(question);
  selectedAnswers[currentQuestion] = "紐⑤쫫";
  selectedAnswer = "紐⑤쫫";

  const solveSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
  updateAdaptiveState(question, selectedAnswer, solveSeconds);
  saveLevelTestState();

  const testFinished = shouldFinishAdaptiveTest();
  const hasNextQuestion = testFinished
    ? false
    : addNextAdaptiveQuestion();

  if (testFinished || !hasNextQuestion) {
    updateResultFromTest();
    clearSavedLevelTest();
    showScreen("result");
    return;
  }

  saveLevelTestState();
  renderQuestion();
});

function stopLevelTest() {
  if (reviewMode) return;
  if (isChecking) return;

  if (currentQuestion === 0) return;

  currentQuestion -= 1;
  questionNumber = Math.max(1, questionNumber - 1);
  renderQuestion();
}

stopTest.addEventListener("click", stopLevelTest);
stopTestTop.addEventListener("click", stopLevelTest);

pauseTest.addEventListener("click", () => {
  saveLevelTestState();
  stopTimer();
  showScreen("home");
});

quitTest?.addEventListener("click", () => {
  saveLevelTestState();
  stopTimer();
  showScreen("home");
});

resumeTest.addEventListener("click", () => {
  const saved = getSavedLevelTest();
  if (!saved) {
    resetLevelTest();
    showScreen("quiz");
    return;
  }

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === "quiz");
  });
  restoreLevelTestState(saved);
});

restartTest.addEventListener("click", () => {
  clearSavedLevelTest();
  showScreen("quiz");
  resetLevelTest();
});

wrongReviewList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-review-index]");
  if (!button) return;

  openReviewQuestion(Number(button.dataset.reviewIndex));
});

backToResult.addEventListener("click", () => {
  reviewMode = false;
  showScreen("result");
});

dreamJob.addEventListener("input", () => {
  updateLevelTestCopy();
  saveLearningSettings();
});
profileName.addEventListener("input", updateHomeProfile);
profileMessage.addEventListener("input", updateHomeProfile);
avatarPicker.addEventListener("click", (event) => {
  const button = event.target.closest("[data-avatar]");
  if (!button) return;

  avatarPicker.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  updateHomeProfile();
});
profileChangePicker?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-avatar]");
  if (!button || button.hasAttribute("data-locked-avatar")) return;

  profileChangePicker.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");
  applyProfileAvatar(button.dataset.avatar);
  saveProfile();
  document.dispatchEvent(new CustomEvent("study:avatar-changed"));
});
profileEditName?.addEventListener("input", () => {
  const nextName = profileEditName.value.trim();
  if (!nextName) {
    profileName.value = "";
    return;
  }
  profileName.value = nextName;
  applyProfileText(nextName, profileEditEmail?.value || getProfileEmail());
  updateHomeProfile();
});
profileEditEmail?.addEventListener("input", () => {
  applyProfileText(profileEditName?.value || profileName.value, profileEditEmail.value);
  saveProfile();
});
function setProfileBasicOpen(open) {
  if (!profileBasicFields || !profileBasicToggle) return;
  profileBasicFields.hidden = !open;
  profileBasicToggle.setAttribute("aria-expanded", String(open));
  profileBasicToggle.textContent = open ? "湲곕낯?뺣낫 ?リ린" : "湲곕낯?뺣낫 ?섏젙";
}
profileBasicToggle?.addEventListener("click", () => {
  setProfileBasicOpen(profileBasicFields?.hidden ?? true);
});
profileBasicClose?.addEventListener("click", () => setProfileBasicOpen(false));
profileBasicSave?.addEventListener("click", () => {
  saveProfile();
  setProfileBasicOpen(false);
});
document.addEventListener("study:social-updated", updateAvatarUnlocks);

document.querySelector("#roomCreateSubmit")?.addEventListener("click", () => {
  const name = document.querySelector("#roomCreateName")?.value.trim();
  const subject = document.querySelector("#roomCreateSubject")?.value;
  const level = document.querySelector("#roomCreateLevel")?.value;
  const description = document.querySelector("#roomCreateDescription")?.value.trim();
  if (!name || !subject || subject === "과목을 선택하세요" || !level || level === "학년 또는 수준을 선택하세요") {
    alert("怨듬?諛??대쫫, 怨쇰ぉ, ?숇뀈/?섏????낅젰??二쇱꽭??");
    return;
  }
  window.STUDY_SOCIAL?.createRoom({ name, subject, level, description });
  showScreen("study-room-detail");
});
homeMenuButton.addEventListener("click", () => {
  homeMenu.classList.toggle("hidden");
});
closeHomeMenu.addEventListener("click", () => {
  homeMenu.classList.add("hidden");
});
logoutButton.addEventListener("click", logout);
menuLogoutButton?.addEventListener("click", logout);
document.addEventListener("click", (event) => {
  const settingsButton = event.target.closest(".settings-trigger");
  const settingsPanel = event.target.closest(".settings-popover");
  const settingsLogout = event.target.closest("[data-settings-logout]");

  if (settingsLogout) {
    logout();
    return;
  }

  if (settingsButton) {
    event.stopPropagation();
    const screen = settingsButton.closest("[data-screen]");
    const popover = screen?.querySelector(".settings-popover");
    document.querySelectorAll(".settings-popover").forEach((panel) => {
      if (panel !== popover) {
        panel.classList.add("hidden");
        panel.closest("[data-screen]")?.classList.remove("settings-open");
      }
    });
    popover?.classList.toggle("hidden");
    screen?.classList.toggle("settings-open", !popover?.classList.contains("hidden"));
    return;
  }

  if (settingsPanel) {
    event.stopPropagation();
    return;
  }

  document.querySelectorAll(".settings-popover").forEach((panel) => {
    panel.classList.add("hidden");
    panel.closest("[data-screen]")?.classList.remove("settings-open");
  });
});
window.addEventListener("beforeunload", () => {
  saveCurrentScreen(activeScreenName());
  if (document.querySelector('[data-screen="quiz"]').classList.contains("active") && !reviewMode) {
    saveLevelTestState();
  }
});

window.addEventListener("pagehide", () => saveCurrentScreen(activeScreenName()));

initializeAuthScreen();
ensureGlobalSettingsButtons();
loadHomeProfile();
activateInAppControls();
updateAvatarUnlocks();
updateRoleCopy();
updateLevelTestCopy();
