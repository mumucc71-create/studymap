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
const signupKakaoButton = document.querySelector(".signup-kakao");
const signupNaverButton = document.querySelector(".signup-naver");
const roleButtons = document.querySelectorAll("[data-role]");
const loginUser = document.querySelector("#loginUser");
const loginPassword = document.querySelector("#loginPassword");
const loginButton = document.querySelector("#loginButton");
const loginError = document.querySelector("#loginError");
const recoverLoginButton = document.querySelector("#recoverLoginButton");
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
const levelTestMemoryStoragePrefix = "studyCoinLevelTestMemoryV1";
const levelTestCloudQueuePrefix = "studyCoinLevelTestCloudQueueV1";
const middle3CloudStateKey = "middle3-math-level-test-v1";
const middle3LevelUpRewardCoins = 20;
const recoverableStoragePrefixes = [
  "studyCoinProfile:",
  "studyCoinLevelTest:",
  "studyCoinMathLearningV3:",
  "studyCoinSubjectLearningV2:",
  "studyCoinSocialV2:",
  "studyCoinEnglishVocabularyV1:",
  "studyCoinCurrentScreen:",
];
const accountScopedStoragePrefixes = [
  ...recoverableStoragePrefixes,
  "studyCoinNotificationSettingsV1:",
  "studyCoinSupportDraftV1:",
  "studyCoinLastAvatarUnlockLevel:",
  `${levelTestMemoryStoragePrefix}:`,
  `${levelTestCloudQueuePrefix}:`,
];
const levelTestEngineVersion = "middle3-cycle-engine-v1";
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
const middle3BasicUnitOrder = [
  "실수와 제곱근",
  "다항식의 곱셈과 인수분해",
  "이차방정식",
  "이차함수",
  "피타고라스 정리",
  "삼각비",
  "원의 성질",
  "통계와 확률",
];
const middle3BasicQuestionsPerUnit = 4;
const middle3BasicTestMode = "middle3-bootstrap";
const middle3CycleTestMode = "middle3-continuous-cycle";
const gradeRangeDiagnosisMode = "GRADE_RANGE_DIAGNOSIS";
const legacyMathGradePlacementTestMode = "math-grade-placement";
const adaptiveConceptDiagnosisMode = "ADAPTIVE_CONCEPT_DIAGNOSIS";
const prerequisiteConceptMap = {};

const settingsPopoverMarkup = `
  <button type="button" data-settings-view="notifications"><span>알림 설정</span><b>›</b></button>
  <button type="button" data-settings-view="account"><span>내 계정 설정</span><b>›</b></button>
  <button type="button" data-settings-view="support"><span>고객센터</span><b>›</b></button>
  <button type="button" data-settings-logout><span>로그아웃</span><b>›</b></button>
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
  "초등 1학년": [{ bank: "g1", count: 12 }],
  "초등 2학년": [{ bank: "g1", count: 6 }, { bank: "g2", count: 6 }],
  "초등 3학년": [{ bank: "g1", count: 3 }, { bank: "g2", count: 3 }, { bank: "g3", count: 6 }],
  "초등 4학년": [{ bank: "g1", count: 2 }, { bank: "g2", count: 2 }, { bank: "g3", count: 2 }, { bank: "g4", count: 6 }],
  "초등 5학년": [{ bank: "g1", count: 2 }, { bank: "g2", count: 2 }, { bank: "g3", count: 3 }, { bank: "g4", count: 3 }, { bank: "g5", count: 6 }],
  "초등 6학년": [{ bank: "g1", count: 1 }, { bank: "g2", count: 2 }, { bank: "g3", count: 3 }, { bank: "g4", count: 3 }, { bank: "g5", count: 3 }, { bank: "g6", count: 6 }],
  "중등 1학년": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 2 }, { bank: "g4", count: 2 }, { bank: "g5", count: 3 }, { bank: "g6", count: 3 }, { bank: "m1", count: 12 }],
  "중등 2학년": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 1 }, { bank: "g4", count: 2 }, { bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 6 }, { bank: "m2", count: 12 }],
  "중등 3학년": [{ bank: "g1", count: 1 }, { bank: "g2", count: 1 }, { bank: "g3", count: 1 }, { bank: "g4", count: 1 }, { bank: "g5", count: 2 }, { bank: "g6", count: 2 }, { bank: "m1", count: 4 }, { bank: "m2", count: 6 }, { bank: "m3", count: 12 }],
  "고등 1학년": [{ bank: "g3", count: 2 }, { bank: "g4", count: 2 }, { bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }],
  "고등 2학년": [{ bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }, { bank: "h2", count: 6 }],
  "고등 3학년": [{ bank: "g5", count: 2 }, { bank: "g6", count: 3 }, { bank: "m1", count: 3 }, { bank: "m2", count: 4 }, { bank: "m3", count: 6 }, { bank: "h1", count: 6 }, { bank: "h2", count: 6 }, { bank: "h3", count: 6 }],
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
let timedOutQuestions = [];
let unknownQuestions = [];
let wrongQuestions = [];
let reviewMode = false;
let adaptiveQuestionPool = [];
let answeredQuestionIds = new Set();
let adaptiveState = null;
let adaptiveLevelTestController = null;
let adaptiveLevelTestResumeState = null;
let adaptiveLevelTestResultPending = null;
let questionStartedAt = 0;
let middle3LevelTestMemory = null;
let middle3LevelTestMemoryAccountKey = "";
let middle3CloudSyncTimer = null;
let middle3CloudHydrationPromise = null;
let middle3CloudHydratedAccountKey = "";
let middle3CloudHydrationStatus = "READY";
let middle3CloudRemoteRevision = "";
let middle3SubmissionCommitInProgress = false;
let queuedLevelTestNotice = null;
let levelTestNoticeTimer = null;
const testableLevelTestSubjects = new Set(["수학", "영어"]);
const savedLevelTestSubject = localStorage.getItem("studyCoinLevelTestSubject");
let levelTestSubject = testableLevelTestSubjects.has(savedLevelTestSubject) ? savedLevelTestSubject : "수학";

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

function resolveStoredAccount(identifier) {
  const normalizedIdentifier = normalizeAuthIdentifier(identifier);
  if (!normalizedIdentifier) return null;

  const users = getAuthUsers();
  let userId = normalizedIdentifier;
  let user = users[userId];

  if (!user && isValidEmail(normalizedIdentifier)) {
    const matched = Object.entries(users).find(([, candidate]) => (
      normalizeAuthIdentifier(candidate?.email) === normalizedIdentifier
    ));
    if (matched) [userId, user] = matched;
  }

  if (user?.migratedTo && users[user.migratedTo]) {
    userId = user.migratedTo;
    user = users[userId];
  }

  return user ? { userId, user } : null;
}

function hasRecoverableAccountData(userId) {
  if (!userId) return false;
  const resolved = resolveStoredAccount(userId);
  if (resolved?.user) return true;
  const candidateIds = new Set([userId, resolved?.userId].filter(Boolean));
  return [...candidateIds].some((candidateId) => (
    recoverableStoragePrefixes.some((prefix) => localStorage.getItem(`${prefix}${candidateId}`) !== null)
  ));
}

function readRecoverableProfile(userId) {
  try {
    return JSON.parse(localStorage.getItem(`${profileStoragePrefix}:${userId}`) || "null") || {};
  } catch {
    return {};
  }
}

function hideLoginRecovery() {
  recoverLoginButton?.classList.add("hidden");
  if (recoverLoginButton) recoverLoginButton.textContent = "기존 학습 기록으로 계정 복구";
}

function normalizeAuthIdentifier(value) {
  const identifier = String(value || "").trim();
  return identifier.includes("@") ? identifier.toLowerCase() : identifier;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeAuthIdentifier(value));
}

function copyAccountScopedStorage(sourceUserId, targetUserId) {
  if (!sourceUserId || !targetUserId || sourceUserId === targetUserId) return;
  const keys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter(Boolean);

  keys.forEach((key) => {
    const prefix = accountScopedStoragePrefixes.find((candidate) => key.startsWith(`${candidate}${sourceUserId}`));
    if (!prefix) return;

    const sourceMarker = `${prefix}${sourceUserId}`;
    const targetKey = `${prefix}${targetUserId}${key.slice(sourceMarker.length)}`;
    if (localStorage.getItem(targetKey) === null) {
      localStorage.setItem(targetKey, localStorage.getItem(key));
    }
  });
}

async function migrateAccountToEmail(sourceUserId, nextEmail, currentPassword) {
  const normalizedEmail = normalizeAuthIdentifier(nextEmail);
  if (!isValidEmail(normalizedEmail)) {
    const error = new Error("invalid-email");
    error.code = "auth/invalid-email";
    throw error;
  }

  const users = getAuthUsers();
  const sourceUser = users[sourceUserId];
  if (!sourceUser) throw new Error("missing-account");

  const existingTarget = users[normalizedEmail];
  if (existingTarget && normalizedEmail !== sourceUserId && existingTarget.legacyId !== sourceUserId) {
    const error = new Error("email-already-in-use");
    error.code = "auth/email-already-in-use";
    throw error;
  }

  if (sourceUser.password && sourceUser.password !== currentPassword) {
    const error = new Error("wrong-current-password");
    error.code = "auth/wrong-password";
    throw error;
  }

  let cloudAccount = null;
  if (window.STUDY_CLOUD_AUTH?.isConfigured) {
    if (sourceUser.uid) {
      cloudAccount = await window.STUDY_CLOUD_AUTH.changeEmail(normalizedEmail, currentPassword);
    } else {
      try {
        cloudAccount = await window.STUDY_CLOUD_AUTH.signUpWithEmail(normalizedEmail, currentPassword, {
          name: sourceUser.name || "학생",
          role: sourceUser.role || "student",
          onboardingComplete: sourceUser.onboardingComplete ?? true,
        });
      } catch (error) {
        if (!String(error?.code || "").includes("email-already-in-use")) throw error;
        cloudAccount = await window.STUDY_CLOUD_AUTH.signInWithEmail(normalizedEmail, currentPassword);
      }
    }
  }

  const targetUserId = cloudAccount?.id || normalizedEmail;
  copyAccountScopedStorage(sourceUserId, targetUserId);

  const latestUsers = getAuthUsers();
  const latestSource = latestUsers[sourceUserId] || sourceUser;
  latestUsers[targetUserId] = {
    ...latestSource,
    ...(cloudAccount || {}),
    id: targetUserId,
    email: normalizedEmail,
    legacyId: latestSource.legacyId || (sourceUserId.includes("@") ? "" : sourceUserId),
    password: cloudAccount ? "" : latestSource.password,
    migratedAt: new Date().toISOString(),
  };

  if (sourceUserId !== targetUserId) {
    latestUsers[sourceUserId] = {
      ...latestSource,
      email: normalizedEmail,
      migratedTo: targetUserId,
    };
  }

  saveAuthUsers(latestUsers);
  setCurrentUser(targetUserId);
  return latestUsers[targetUserId];
}

function authErrorMessage(error, action = "로그인") {
  const code = String(error?.code || "");
  if (code.includes("email-already-in-use")) return "이미 가입된 이메일이에요. 로그인해 주세요.";
  if (code.includes("invalid-email")) return "이메일 형식을 확인해 주세요.";
  if (code.includes("weak-password")) {
    return action === "이메일 변경"
      ? "기존 비밀번호가 6자리 미만이면 아래에서 새 비밀번호를 6자리 이상으로 먼저 변경해 주세요."
      : "비밀번호는 6자리 이상 입력해 주세요.";
  }
  if (code.includes("unauthorized-domain")) return "현재 주소가 Firebase 승인 도메인에 등록되지 않았어요.";
  if (code.includes("operation-not-allowed")) return "Firebase에서 해당 로그인 방식을 먼저 활성화해 주세요.";
  if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "로그인 창이 닫혔어요. 다시 시도해 주세요.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }
  return `${action} 처리 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.`;
}

function storeAuthenticatedAccount(account, fallback = {}) {
  if (!account?.id) return null;
  const users = getAuthUsers();
  const existing = users[account.id] || {};
  users[account.id] = {
    ...existing,
    id: account.id,
    uid: account.uid || existing.uid || "",
    email: account.email || fallback.email || existing.email || "",
    name: account.name || fallback.name || existing.name || "학생",
    role: account.role || fallback.role || existing.role || "student",
    password: fallback.persistPassword ? String(fallback.password || "") : "",
    provider: account.provider || fallback.provider || existing.provider || "password",
    onboardingComplete: account.onboardingComplete ?? existing.onboardingComplete ?? false,
    learningSettings: account.learningSettings || fallback.learningSettings || existing.learningSettings,
    updatedAt: new Date().toISOString(),
  };
  saveAuthUsers(users);
  return users[account.id];
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

function escapeSettingText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function notificationSettingsKey() {
  return `studyCoinNotificationSettingsV1:${getCurrentUser() || "guest"}`;
}

function getNotificationSettings() {
  try {
    return {
      dailyReminder: true,
      progressNotice: true,
      ...(JSON.parse(localStorage.getItem(notificationSettingsKey())) || {}),
    };
  } catch {
    return { dailyReminder: true, progressNotice: true };
  }
}

function closeAppSettings() {
  const modal = document.querySelector("#appSettingsModal");
  if (modal) modal.hidden = true;
}

function openAppSettings(view) {
  const modal = document.querySelector("#appSettingsModal");
  const title = document.querySelector("#appSettingsTitle");
  const content = document.querySelector("#appSettingsContent");
  if (!modal || !title || !content) return;

  if (view === "notifications") {
    const settings = getNotificationSettings();
    title.textContent = "알림 설정";
    content.innerHTML = `<section class="settings-form-section">
      <p>받고 싶은 학습 알림을 선택하세요. 변경 내용은 이 기기에 바로 저장됩니다.</p>
      <label class="settings-toggle-row"><span><b>매일 학습 알림</b><small>오늘의 목표를 시작할 수 있도록 알려줘요.</small></span><input type="checkbox" data-notification-setting="dailyReminder" ${settings.dailyReminder ? "checked" : ""}><i></i></label>
      <label class="settings-toggle-row"><span><b>학습 진행 알림</b><small>목표 달성 및 학습 진행 상황을 알려줘요.</small></span><input type="checkbox" data-notification-setting="progressNotice" ${settings.progressNotice ? "checked" : ""}><i></i></label>
      <em class="settings-save-status" id="settingsSaveStatus">변경하면 자동으로 저장됩니다.</em>
    </section>`;
  } else if (view === "account") {
    const userId = getCurrentUser();
    const user = getUserRecord(userId) || {};
    const accountEmail = user.email || (String(userId || "").includes("@") ? userId : "이메일 미등록");
    title.textContent = "내 계정 설정";
    content.innerHTML = `<section class="settings-form-section">
      <p>현재 로그인한 계정 정보입니다.</p>
      <dl class="settings-account-summary"><div><dt>이름</dt><dd>${escapeSettingText(user.name || "학생")}</dd></div><div><dt>이메일</dt><dd>${escapeSettingText(accountEmail)}</dd></div></dl>
      <label class="settings-text-field"><span>로그인 이메일</span><input id="settingsAccountEmail" type="email" autocomplete="email" value="${escapeSettingText(accountEmail === "이메일 미등록" ? "" : accountEmail)}" placeholder="email@example.com"></label>
      <label class="settings-text-field"><span>현재 비밀번호</span><input id="settingsCurrentPassword" type="password" autocomplete="current-password" placeholder="이메일 등록·변경 확인용"></label>
      <button class="settings-primary-action" type="button" data-settings-save-email ${userId ? "" : "disabled"}>이메일 등록·변경</button>
      <small>${window.STUDY_CLOUD_AUTH?.isConfigured ? "변경한 이메일이 다음 로그인 아이디가 됩니다." : "현재는 이 브라우저의 계정만 변경됩니다. 다른 브라우저 로그인은 Firebase 연결 후 가능합니다."}</small>
      <label class="settings-text-field"><span>새 비밀번호</span><input id="settingsNewPassword" type="password" minlength="6" autocomplete="new-password" placeholder="6자리 이상 입력"></label>
      <button class="settings-primary-action" type="button" data-settings-save-password ${userId ? "" : "disabled"}>비밀번호 변경</button>
      <em class="settings-save-status" id="settingsAccountStatus"></em>
    </section>`;
  } else {
    const supportKey = `studyCoinSupportDraftV1:${getCurrentUser() || "guest"}`;
    const draft = localStorage.getItem(supportKey) || "";
    title.textContent = "고객센터";
    content.innerHTML = `<section class="settings-form-section settings-support-section">
      <details><summary>로그인이 되지 않아요</summary><p>로그인 화면의 계정 복구 또는 비밀번호 재설정 버튼을 이용해 주세요. 기존 학습 기록은 유지됩니다.</p></details>
      <details><summary>학습 기록이 보이지 않아요</summary><p>가입할 때 사용한 이메일로 로그인했는지 확인해 주세요. Firebase 연결 전 기록은 브라우저별로 따로 저장됩니다.</p></details>
      <details><summary>화면이나 글자가 깨져 보여요</summary><p>먼저 Ctrl+F5로 새로고침한 뒤에도 동일하면 해당 화면을 캡처해 주세요.</p></details>
      <label class="settings-text-field"><span>문의 내용</span><textarea id="settingsSupportDraft" placeholder="불편한 점을 적어 주세요.">${escapeSettingText(draft)}</textarea></label>
      <button class="settings-primary-action" type="button" data-settings-save-support>문의 내용 저장</button>
      <em class="settings-save-status" id="settingsSupportStatus">작성 내용은 이 기기에만 저장됩니다.</em>
    </section>`;
  }

  modal.hidden = false;
}

function getProfileStorageKey(userId = getCurrentUser()) {
  return `${profileStoragePrefix}:${userId || "guest"}`;
}

function updateUserRecord(userId, updater) {
  const users = getAuthUsers();
  if (!users[userId]) return;
  users[userId] = updater(users[userId]) || users[userId];
  saveAuthUsers(users);
  if (window.STUDY_CLOUD_AUTH?.isConfigured && users[userId].uid) {
    window.STUDY_CLOUD_AUTH.syncUserRecord(users[userId]).catch(() => {});
  }
}

function completeOnboarding() {
  const userId = getCurrentUser();
  if (!userId) return Promise.resolve(false);
  const users = getAuthUsers();
  if (!users[userId]) return Promise.resolve(false);
  users[userId] = { ...users[userId], onboardingComplete: true };
  saveAuthUsers(users);
  if (window.STUDY_CLOUD_AUTH?.isConfigured && users[userId].uid) {
    return window.STUDY_CLOUD_AUTH.syncUserRecord(users[userId])
      .then(() => true)
      .catch(() => false);
  }
  return Promise.resolve(true);
}

function routeAfterLogin({ restoreScreen = true } = {}) {
  const user = getUserRecord();
  loadLearningSettings();

  let savedScreen = restoreScreen
    ? history.state?.studyScreen
      || sessionStorage.getItem(currentSessionScreenKey)
      || localStorage.getItem(screenStorageKeyForUser())
      || localStorage.getItem(currentScreenStorageKey)
    : "home";
  const savedTest = restoreScreen ? getSavedLevelTest() : null;
  if (!user?.onboardingComplete && savedTest && savedScreen === "profile-setup") {
    savedScreen = "quiz";
  }

  if (!user?.onboardingComplete && !savedTest) {
    showScreen("profile-setup", { silent: true });
    return;
  }

  if (!user?.onboardingComplete && savedTest) completeOnboarding();
  const savedScreenExists = savedScreen
    && document.querySelector(`[data-screen="${savedScreen}"]`);

  if (savedScreen === "quiz") {
    if (savedTest) {
      showScreen("quiz", { silent: true });
      restoreLevelTestState(savedTest);
      return;
    }
  }

  showScreen(savedScreenExists && savedScreen !== "login" && savedScreen !== "signup"
    ? savedScreen
    : "home", { silent: true });
}

function initializeAuthScreen() {
  if (getCurrentUser() && getUserRecord()) {
    routeAfterLogin({ restoreScreen: true });
    return;
  }

  showScreen("login", { silent: true });
}

function logout() {
  if (window.STUDY_CLOUD_AUTH?.isConfigured) {
    window.STUDY_CLOUD_AUTH.signOut().catch(() => {});
  }
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
  document.dispatchEvent(new CustomEvent("study:learning-settings-changed", {
    detail: getCurrentLearningSettings(),
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
    || "초등 4학년";
}

function getConfiguredGradeForRangeDiagnosis() {
  return String(getUserRecord()?.learningSettings?.grade || "").trim();
}

function isGradeRangeDiagnosisMode(value = adaptiveState?.testMode) {
  return value === gradeRangeDiagnosisMode || value === legacyMathGradePlacementTestMode;
}

function updateRoleCopy() {
  const role = getSelectedRole();
  const copy = {
    student: {
      title: "나에게 맞게<br />공부를 준비할게요",
      grade: "학년",
      gender: "성별",
      dream: "장래희망",
      subject: "원하는 과목",
      subjectCopy: "하나만 골라도 되고, 여러 과목을 함께 선택할 수 있어요.",
    },
    parent: {
      title: "자녀에게 맞게<br />공부를 준비할게요",
      grade: "자녀 학년",
      gender: "자녀 성별",
      dream: "자녀 장래희망",
      subject: "자녀가 공부할 과목",
      subjectCopy: "자녀에게 필요한 과목을 여러 개 선택할 수 있어요.",
    },
    teacher: {
      title: "학생에게 맞게<br />수업을 준비할게요",
      grade: "해당 학생 학년",
      gender: "학생 성별",
      dream: "학생 목표",
      subject: "지도할 과목",
      subjectCopy: "지도할 과목을 여러 개 선택할 수 있어요.",
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
    if (getCurrentUser()) return { name: registeredName || "학생" };
    const legacy = JSON.parse(localStorage.getItem(legacyProfileStorageKey)) || {};
    return {
      ...legacy,
      name: registeredName || legacy.name || "학생",
    };
  } catch {
    return { name: getUserRecord()?.name?.trim() || "학생" };
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
  const nextEmail = (getUserRecord()?.email || saved.email || "").trim();
  localStorage.setItem(getProfileStorageKey(), JSON.stringify({
    name: nextName,
    message: profileMessage.value.trim(),
    email: nextEmail,
    avatar: selectedAvatar,
  }));

  const userId = getCurrentUser();
  if (userId && nextName) {
    updateUserRecord(userId, (user) => ({ ...user, name: nextName }));
  }
}

function updateHomeProfile() {
  const name = profileName.value.trim() || getUserRecord()?.name?.trim() || "학생";
  const message = profileMessage.value.trim() || "오늘도 함께 공부해봐요";
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

      // 학습 기록은 social-system.js가 localStorage를 기반으로 관리합니다.
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

  testSubjects.textContent = subjectText === "수학"
    ? "초4 핵심 개념부터 시작해 필요한 수학 개념을 맞춤형으로 확인할게요."
    : `${subjectText} 과목을 개념 단위로 차분하게 확인할게요.`;
  testDream.textContent = subjectText === "수학"
    ? "잘 이해한 개념과 먼저 보충할 개념을 찾아드릴게요."
    : `${dream}에 가까워지도록 학습 계획을 맞춰볼게요.`;
  if (joinSummary) {
    joinSummary.textContent = { student: "학생", parent: "학부모", teacher: "선생님" }[getSelectedRole()] || "학생";
  }
  if (progressSummary) progressSummary.textContent = subjectText;
  startPoint.textContent = subjectText === "수학" ? "기초 개념부터 맞춤 진단" : `${grade}에서 시작`;
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

function middle3DiagnosisProgressText(question) {
  const memory = ensureMiddle3LevelTestMemory();
  const diagnosis = memory?.conceptDiagnosisMap?.[question.conceptId];
  const coverage = diagnosis?.unitId ? memory?.unitConceptCoverage?.[diagnosis.unitId] : null;
  if (!diagnosis || !coverage) return `${question.levelLabel || "중3"} · ${question.stageLabel || "기본"}`;
  return `${question.unit || question.domain || "중3 수학"} · 기본 진단 ${coverage.checkedConcepts}/${coverage.totalConcepts}`;
}

function renderQuestion() {
  if (isAdaptiveConceptDiagnosis()) {
    renderAdaptiveLevelTestQuestion();
    return;
  }
  const question = activeQuestions[currentQuestion];
  if (!question) return;

  const hydrationReady = mathCloudHydrationReady();
  const finalizedAttempt = hydrationReady ? startMathAttempt(question) : null;
  selectedAnswer = finalizedAttempt?.selectedAnswer || selectedAnswers[currentQuestion] || "";
  if (finalizedAttempt?.selectedAnswer) selectedAnswers[currentQuestion] = finalizedAttempt.selectedAnswer;
  isChecking = false;
  questionStartedAt = Date.now();

  if (isMiddle3CycleLevelTest()) {
    const memory = ensureMiddle3LevelTestMemory();
    const cycle = memory?.activeCycle;
    const cycleQuestionNumber = (cycle?.answers?.length || 0) + 1;
    quizConcept.textContent = `사이클 ${cycle?.number || memory?.cycleNumber || 1} · Q.${cycleQuestionNumber}`;
  } else {
    quizConcept.textContent = `Q.${currentQuestion + 1}`;
  }
  const quizPrompt = document.querySelector("#quizPrompt");
  if (quizPrompt) quizPrompt.textContent = "문제를 읽고 알맞은 답을 고르세요.";
  const quizConceptSub = document.querySelector("#quizConceptSub");
  if (quizConceptSub) {
    const subject = adaptiveState?.selectedSubject || levelTestSubject || "수학";
    quizConceptSub.textContent = isMiddle3CycleLevelTest()
      ? question.targetPurpose === window.STUDY_LEVEL_TEST_ENGINE?.PURPOSES?.INDEPENDENT_LEARNING_CHECK
        ? `${question.levelLabel || "중3"} · 새 문제 확인`
        : middle3DiagnosisProgressText(question)
      : isMiddle3BasicLevelTest()
      ? `${question.stage}/${question.stageTotal}단계 · ${question.domain}`
      : subject === "수학"
      ? `${subject} · ${question.domain}`
      : question.concept;
  }
  quizProblem.innerHTML = renderMathText(question.problem);
  updateAdaptiveDisplay(question);
  if (!isMiddle3CycleLevelTest()) {
    quizCount.textContent = `${currentQuestion + 1}문제 진행`;
  }
  timeLabel.textContent = isContinuousMiddle3LevelTest() ? "학습 시간" : "전체 남은 시간";
  answerList.innerHTML = question.choices
    .map((choice, index) => `<button class="${choice === selectedAnswer ? "selected" : ""}" data-answer="${escapeMathText(choice)}"><b>${index + 1}</b><span>${renderMathText(choice)}</span></button>`)
    .join("");
  if (finalizedAttempt?.attemptStatus === window.STUDY_LEVEL_TEST_ENGINE?.ATTEMPT_STATUS?.FINAL) {
    answerList.querySelectorAll("button").forEach((item) => { item.disabled = true; });
  }
  if (!hydrationReady) {
    answerList.querySelectorAll("button").forEach((item) => { item.disabled = true; });
  }
  quizToast.classList.add("hidden");
  reviewExplanation.classList.add("hidden");
  quizActions.classList.toggle("hidden", reviewMode);
  reviewActions.classList.toggle("hidden", !reviewMode);
  pauseTest.classList.toggle("hidden", reviewMode);
  nextQuestion.textContent = "다음 문제";
  nextQuestion.disabled = !hydrationReady;
  stopTest.disabled = currentQuestion === 0;
  stopTestTop.disabled = currentQuestion === 0;
  unknownQuestion.disabled = !hydrationReady
    || Boolean(finalizedAttempt?.attemptStatus === window.STUDY_LEVEL_TEST_ENGINE?.ATTEMPT_STATUS?.FINAL);

  if (reviewMode) {
    timeLabel.textContent = "오답 리뷰";
    timeLeft.textContent = "정답 확인";
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
  showQueuedLevelTestNotice();
}

function getRouteLabel(level) {
  return "AI가 현재 실력을 분석하고 있습니다.";
}

function createAdaptiveState(grade = getSelectedGrade(), domains = adaptiveDomains) {
  const scores = {};
  domains.forEach((domain) => {
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

  const focusDomain = domains.includes(startProfile.focusDomain) ? startProfile.focusDomain : domains[0];
  const nextDomain = domains.includes(startProfile.nextDomain) ? startProfile.nextDomain : domains[1] || focusDomain;

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
    focusDomain,
    nextDomain,
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
      explanation: `${concept} 문제입니다. 선택지 중 정답은 ${answer}입니다. 이 문항이 어렵다면 먼저 ${getStableFromBank(bank)} 개념을 다시 확인하세요.`,
      };
    });
  });
}

function buildMiddle3BasicQuestionPool() {
  const routed = window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS?.buildGradeTestSession({ selectedGrade: "M3" });
  if (routed?.status === "READY" && routed.questions?.length === 32) return [...routed.questions];
  const normalizedMiddle3Questions = (conceptBanks.m3 || []).map((item, index) => {
    return Array.isArray(item)
      ? normalizeQuestion({
          questionId: `m3-basic-source-${index}`,
          unit: item[0],
          answer: item[2],
          difficulty: (index % 3) + 1,
          estimatedSolveTime: getSecondsFromBank("m3"),
          questionText: item[1],
          choices: item[3],
          explanation: `${item[0]}의 기본 개념을 확인하는 문제입니다.`,
          conceptId: createConceptId(item[0]),
          isRepresentative: true,
          prerequisiteConcepts: [],
        }, "m3", index)
      : normalizeQuestion(item, "m3", index);
  });

  return middle3BasicUnitOrder.flatMap((unit, unitIndex) => {
    return normalizedMiddle3Questions
      .filter((question) => question.concept === unit && question.adaptiveLevel <= 2)
      .slice(0, middle3BasicQuestionsPerUnit)
      .map((question, questionIndex) => {
        const choices = question.choices.map(String);
        const answer = String(question.answer);
        return {
          ...question,
          id: `middle3-basic-${unitIndex + 1}-${questionIndex + 1}-${question.id}`,
          bank: "m3",
          grade: "중등 3학년",
          gradeNumber: 9,
          level: "중등 3학년",
          levelLabel: "중등 3학년",
          rank: 9,
          domain: unit,
          concept: unit,
          answer,
          correctAnswer: answer,
          choices,
          answerType: "MULTIPLE_CHOICE",
          difficulty: 1,
          adaptiveLevel: 1,
          isRepresentative: true,
          stage: unitIndex + 1,
          diagnosticStage: "BASIC",
          stageTotal: middle3BasicUnitOrder.length,
          questionInStage: questionIndex + 1,
          questionTotalInStage: middle3BasicQuestionsPerUnit,
          stable: unit,
          start: unit,
          code: "M3-BASIC",
          reviewStatus: "AUTO_APPROVED",
          executionStatus: "EXECUTABLE",
          mathValidation: {
            validatorId: "STATIC_MANIFEST_V1",
            conditionsComplete: true,
            expectedPrompt: String(question.problem),
            expectedAnswer: answer,
            expectedChoices: choices,
            expectedAnswerType: "MULTIPLE_CHOICE",
            expectedGrade: 9,
            expectedConceptId: question.conceptId,
            expectedStage: "BASIC",
          },
        };
      });
  });
}

function isMiddle3BasicLevelTest() {
  return adaptiveState?.testMode === middle3BasicTestMode;
}

function getMiddle3BasicUnitSummaries() {
  return middle3BasicUnitOrder.map((unit, index) => {
    const questions = activeQuestions
      .map((question, questionIndex) => ({ question, answer: selectedAnswers[questionIndex] }))
      .filter(({ question }) => question.concept === unit);
    const correct = questions.filter(({ question, answer }) => answer === question.answer).length;
    const unknown = questions.filter(({ answer }) => isGiveUpAnswer(answer) || !answer).length;
    return {
      unit,
      stage: index + 1,
      attempts: questions.length,
      correct,
      unknown,
      passed: questions.length === middle3BasicQuestionsPerUnit && correct === questions.length,
    };
  });
}

function isGiveUpAnswer(answer) {
  return answer === "포기" || answer === "모름";
}

function mathAttemptCycleId(question) {
  const memory = ensureMiddle3LevelTestMemory();
  return String(question?.cycleId || memory?.activeCycle?.id || `bootstrap:${memory?.session?.id || "unknown"}`);
}

function mathAttemptFor(question) {
  if (levelTestSubject !== "수학" || !question) return null;
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  return engine?.getAttempt(memory, question, mathAttemptCycleId(question)) || null;
}

function startMathAttempt(question) {
  if (reviewMode || !isContinuousMiddle3LevelTest() || !question) return mathAttemptFor(question);
  if (!mathCloudHydrationReady()) return null;
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  if (!engine || !memory) return null;
  const result = engine.startAttempt(memory, question, { cycleId: mathAttemptCycleId(question) });
  if (result.created) saveMiddle3LevelTestMemory("attempt-started");
  return result.attempt;
}

function isMathAttemptFinal(question) {
  return mathAttemptFor(question)?.attemptStatus === window.STUDY_LEVEL_TEST_ENGINE?.ATTEMPT_STATUS?.FINAL;
}

function createSubmissionId() {
  if (globalThis.crypto?.randomUUID) return `submission-${globalThis.crypto.randomUUID()}`;
  return `submission-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function finalizeBootstrapAttempt(question, answer, solveSeconds, submissionId) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  if (!engine || !memory) return { created: false, reason: "MISSING_ENGINE" };
  const outcome = isGiveUpAnswer(answer) ? "giveup" : answer === question.answer ? "correct" : "wrong";
  const result = engine.finalizeAttempt(memory, question, {
    cycleId: mathAttemptCycleId(question),
    submissionId,
    selectedAnswer: answer,
    outcome,
    solveSeconds,
  });
  if (result.created) saveMiddle3LevelTestMemory("bootstrap-attempt-final");
  return result;
}

function isMiddle3CycleLevelTest() {
  return adaptiveState?.testMode === middle3CycleTestMode;
}

function isContinuousMiddle3LevelTest() {
  return isMiddle3BasicLevelTest() || isMiddle3CycleLevelTest();
}

function buildMiddle3DetailedQuestionPool() {
  const data = window.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS;
  return (data?.problems || []).map((question) => ({
    ...question,
    id: question.id || question.questionId,
    questionId: question.questionId || question.id,
    bank: "m3-detail",
    grade: "중등 3학년",
    level: "middle",
    schoolLevel: "middle",
    levelLabel: "중등 3학년",
    rank: 9,
    domain: question.unit,
    stable: question.unit,
    start: question.concept,
    code: "M3-DETAIL-BASIC",
  }));
}

function buildMiddle3ApprovedStandardQuestionPool() {
  const metadataService = window.STUDY_MATH_PROBLEM_METADATA;
  const approved = metadataService?.createExecutableStandardProblemPool?.() || [];
  if (approved.length) return approved;
  return buildMiddle3DetailedQuestionPool();
}

function buildMiddle3CycleQuestionPool() {
  const prerequisitePool = ["g5", "g6", "m1", "m2"].flatMap((bank) => {
    return (conceptBanks[bank] || []).map((item, index) => {
      if (!Array.isArray(item)) {
        const normalized = normalizeQuestion(item, bank, index);
        return { ...normalized, bank };
      }
      const [concept, problem, answer, choices] = item;
      return {
        id: `${bank}-${index}-${createConceptId(concept)}`,
        questionId: `${bank}-${index}-${createConceptId(concept)}`,
        conceptId: createConceptId(concept),
        prerequisiteConcepts: [],
        bank,
        grade: getAdaptiveMeta(bank).levelLabel,
        level: getLevelFromBank(bank),
        levelLabel: getAdaptiveMeta(bank).levelLabel,
        rank: getAdaptiveMeta(bank).rank,
        difficulty: (index % 5) + 1,
        adaptiveLevel: (index % 5) + 1,
        seconds: getSecondsFromBank(bank),
        domain: inferAdaptiveDomain(concept, bank),
        concept,
        problem,
        answer: String(answer),
        choices: choices.map(String),
        stable: getStableFromBank(bank),
        start: concept,
        code: bank.toUpperCase(),
        explanation: `${concept} 개념을 확인하는 문제입니다.`,
      };
    });
  });
  return [...prerequisitePool, ...buildMiddle3ApprovedStandardQuestionPool()];
}

function levelTestStateKey() {
  return `${levelTestStorageKey}:${getCurrentUser() || "guest"}`;
}

function middle3LevelTestMemoryKey() {
  return `${levelTestMemoryStoragePrefix}:${getCurrentUser() || "guest"}`;
}

function middle3CloudQueueKey() {
  return `${levelTestCloudQueuePrefix}:${getCurrentUser() || "guest"}`;
}

function middle3RemoteWinsLogKey() {
  return `${middle3CloudQueueKey()}:remoteWins`;
}

function mathCloudSyncRequired() {
  return Boolean(window.STUDY_CLOUD_AUTH?.stateSyncEnabled && getCurrentUser());
}

function mathCloudHydrationReady() {
  if (!isMiddle3BasicLevelTest() && !isMiddle3CycleLevelTest()) return true;
  return !mathCloudSyncRequired()
    || window.STUDY_MATH_CLOUD_SYNC?.canSubmitMathState(middle3CloudHydrationStatus) === true;
}

function recordMiddle3RemoteWinsConflict(resolution) {
  if (!resolution?.conflict) return;
  const existing = parseStoredJson(middle3RemoteWinsLogKey());
  const entries = Array.isArray(existing) ? existing : [];
  entries.push({
    type: "remoteWins",
    recordedAt: new Date().toISOString(),
    remote: resolution.remoteSummary,
    local: resolution.localSummary,
    discardedLocalAnswerCount: resolution.discardedLocalAnswerCount || 0,
  });
  localStorage.setItem(middle3RemoteWinsLogKey(), JSON.stringify(entries.slice(-20)));
}

function parseStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function latestTimestamp(...values) {
  return values.reduce((latest, value) => {
    const time = new Date(value || 0).getTime();
    return Number.isFinite(time) && time > latest ? time : latest;
  }, 0);
}

function buildMiddle3LongTermState(memory, resumeState) {
  if (!memory && !resumeState) return null;
  const conceptMastery = memory?.conceptMastery || {};
  const conceptStageMap = Object.fromEntries(Object.entries(conceptMastery).map(([conceptId, concept]) => [
    conceptId,
    window.STUDY_LEVEL_TEST_ENGINE?.STAGES?.[Number(concept?.stageIndex) || 0] || "BASIC",
  ]));
  const spacedReviewQueue = Object.values(conceptMastery)
    .filter((concept) => Number(concept?.nextReviewCycle) > 0)
    .map((concept) => ({
      conceptId: concept.conceptId,
      nextReviewCycle: concept.nextReviewCycle,
      reviewMilestoneIndex: concept.reviewMilestoneIndex || 0,
      lastReviewCycle: concept.lastReviewCycle || 0,
    }));
  return {
    bootstrap: memory?.bootstrap || null,
    activeSession: memory?.session || null,
    activeCycle: memory?.activeCycle || null,
    resumeState: resumeState || null,
    conceptStageMap,
    conceptMastery,
    pendingRechecks: memory?.pendingRechecks || [],
    recoveryStack: memory?.recoveryStack || [],
    returnCheckpoint: memory?.returnCheckpoint || null,
    spacedReviewQueue,
    recommendations: memory?.studyMapRecommendations || [],
    learningCompletionEvidence: memory?.learningCompletionEvidence || [],
    pendingIndependentChecks: memory?.pendingIndependentChecks || [],
    answeredProblemIds: [...new Set([
      ...(memory?.bootstrap?.answeredProblemIds || []),
      ...(resumeState?.answeredQuestionIds || []),
      ...(memory?.recentProblemIds || []),
    ])],
    recentFingerprints: memory?.recentFingerprints || [],
    attemptsByKey: memory?.attemptsByKey || {},
    problemValidationFailures: memory?.problemValidationFailures || [],
    studyCoinWallet: memory?.studyCoinWallet || { balance: 0, updatedAt: "" },
    studyCoinTransactions: memory?.studyCoinTransactions || [],
    processedRewardEventIds: memory?.processedRewardEventIds || [],
  };
}

function backfillFinalAttemptsFromSavedAnswers(memory, resumeState) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const cycle = memory?.activeCycle;
  if (!engine || !cycle?.id || !cycle.answers?.length) return 0;
  memory.attemptsByKey = memory.attemptsByKey || {};
  const questions = resumeState?.activeQuestions || [];
  const selectedAnswers = resumeState?.selectedAnswers || [];
  let migrated = 0;
  cycle.answers.forEach((answer) => {
    const problemId = String(answer?.problemId || "");
    if (!problemId) return;
    const key = `${cycle.id}:${problemId}`;
    if (memory.attemptsByKey[key]?.attemptStatus === engine.ATTEMPT_STATUS.FINAL) return;
    const questionIndex = questions.findIndex((question) => String(question?.id || question?.questionId || "") === problemId);
    const selectedAnswer = answer.selectedAnswer ?? (questionIndex >= 0 ? selectedAnswers[questionIndex] : undefined);
    const finalizedAt = String(answer.finalizedAt || answer.answeredAt || memory.updatedAt || new Date().toISOString());
    memory.attemptsByKey[key] = {
      problemId,
      activeCycleId: cycle.id,
      attemptStatus: engine.ATTEMPT_STATUS.FINAL,
      startedAt: finalizedAt,
      finalizedAt,
      submissionId: String(answer.submissionId || `legacy-${cycle.id}-${problemId}`),
      selectedAnswer: selectedAnswer == null ? undefined : String(selectedAnswer),
      outcome: answer.outcome,
      solveSeconds: Math.max(0, Number(answer.solveSeconds) || 0),
      migratedFromLegacyAnswer: true,
    };
    migrated += 1;
  });
  if (migrated) memory.p0AttemptMigrationAt = new Date().toISOString();
  return migrated;
}

function restoreMiddle3MemoryFromRemote(remote, accountKey) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const longTerm = remote?.longTermState || {};
  let restored = remote?.memory?.version === engine?.VERSION
    ? JSON.parse(JSON.stringify(remote.memory))
    : null;
  if (!restored && longTerm.conceptMastery && engine) {
    const concepts = Object.values(longTerm.conceptMastery).map((concept) => ({
      conceptId: concept.conceptId,
      title: concept.title,
      prerequisiteConceptIds: concept.prerequisiteConceptIds || [],
    }));
    restored = engine.createStudentState({
      userId: getCurrentUser() || "guest",
      selectedGrade: "중등 3학년",
      targetConceptIds: concepts.map((concept) => concept.conceptId),
      concepts,
    });
  }
  if (!restored) return null;
  if (longTerm.bootstrap) restored.bootstrap = JSON.parse(JSON.stringify(longTerm.bootstrap));
  if (longTerm.activeSession) restored.session = JSON.parse(JSON.stringify(longTerm.activeSession));
  if (Object.prototype.hasOwnProperty.call(longTerm, "activeCycle")) {
    restored.activeCycle = longTerm.activeCycle ? JSON.parse(JSON.stringify(longTerm.activeCycle)) : null;
  }
  if (longTerm.conceptMastery) restored.conceptMastery = JSON.parse(JSON.stringify(longTerm.conceptMastery));
  restored.pendingRechecks = JSON.parse(JSON.stringify(longTerm.pendingRechecks || restored.pendingRechecks || []));
  restored.recoveryStack = JSON.parse(JSON.stringify(longTerm.recoveryStack || restored.recoveryStack || []));
  restored.returnCheckpoint = longTerm.returnCheckpoint ? JSON.parse(JSON.stringify(longTerm.returnCheckpoint)) : null;
  restored.studyMapRecommendations = JSON.parse(JSON.stringify(longTerm.recommendations || restored.studyMapRecommendations || []));
  restored.learningCompletionEvidence = JSON.parse(JSON.stringify(longTerm.learningCompletionEvidence || restored.learningCompletionEvidence || []));
  restored.pendingIndependentChecks = JSON.parse(JSON.stringify(longTerm.pendingIndependentChecks || restored.pendingIndependentChecks || []));
  restored.recentFingerprints = JSON.parse(JSON.stringify(longTerm.recentFingerprints || restored.recentFingerprints || []));
  restored.attemptsByKey = JSON.parse(JSON.stringify(longTerm.attemptsByKey || restored.attemptsByKey || {}));
  restored.problemValidationFailures = JSON.parse(JSON.stringify(longTerm.problemValidationFailures || restored.problemValidationFailures || []));
  restored.studyCoinWallet = JSON.parse(JSON.stringify(remote.studyCoinWallet || longTerm.studyCoinWallet || restored.studyCoinWallet || { balance: 0, updatedAt: "" }));
  restored.studyCoinTransactions = JSON.parse(JSON.stringify(remote.studyCoinTransactions || longTerm.studyCoinTransactions || restored.studyCoinTransactions || []));
  restored.processedRewardEventIds = JSON.parse(JSON.stringify(remote.processedRewardEventIds || longTerm.processedRewardEventIds || restored.processedRewardEventIds || []));
  if (longTerm.answeredProblemIds?.length) {
    restored.bootstrap = restored.bootstrap || {};
    restored.bootstrap.answeredProblemIds = [...new Set(longTerm.answeredProblemIds.map(String))];
  }
  const migratedAttempts = backfillFinalAttemptsFromSavedAnswers(restored, remote.resumeState || longTerm.resumeState);
  middle3LevelTestMemory = restored;
  middle3LevelTestMemoryAccountKey = accountKey;
  configureMiddle3ConceptDiagnostics(restored);
  refreshMiddle3StudyRecommendations("cloud-restore");
  localStorage.setItem(accountKey, JSON.stringify(restored));
  if (migratedAttempts) scheduleMiddle3CloudSync();
  return restored;
}

function buildMiddle3CloudPayload() {
  const memory = middle3LevelTestMemory || loadMiddle3LevelTestMemory();
  const resumeState = parseStoredJson(levelTestStateKey());
  if (!memory && !resumeState) return null;
  const updatedTime = latestTimestamp(memory?.updatedAt, resumeState?.savedAt, new Date().toISOString());
  return {
    schemaVersion: 2,
    updatedAt: new Date(updatedTime).toISOString(),
    memory: memory ? JSON.parse(JSON.stringify(memory)) : null,
    resumeState: resumeState ? JSON.parse(JSON.stringify(resumeState)) : null,
    longTermState: JSON.parse(JSON.stringify(buildMiddle3LongTermState(memory, resumeState))),
  };
}

async function syncMiddle3LevelTestToCloud({ allowDuringHydration = false } = {}) {
  clearTimeout(middle3CloudSyncTimer);
  middle3CloudSyncTimer = null;
  const cloud = window.STUDY_CLOUD_AUTH;
  if (!cloud?.stateSyncEnabled || typeof cloud.saveUserState !== "function") return false;
  if (!allowDuringHydration && (!mathCloudHydrationReady() || middle3SubmissionCommitInProgress)) return false;
  const payload = parseStoredJson(middle3CloudQueueKey()) || buildMiddle3CloudPayload();
  if (!payload) return false;
  try {
    const saved = await cloud.saveUserState(middle3CloudStateKey, payload);
    if (!saved) throw new Error("cloud-save-unavailable");
    localStorage.removeItem(middle3CloudQueueKey());
    middle3CloudRemoteRevision = String(payload.updatedAt || middle3CloudRemoteRevision);
    return true;
  } catch {
    localStorage.setItem(middle3CloudQueueKey(), JSON.stringify(payload));
    return false;
  }
}

function scheduleMiddle3CloudSync() {
  const cloud = window.STUDY_CLOUD_AUTH;
  if (!cloud?.stateSyncEnabled || typeof cloud.saveUserState !== "function") return;
  if (!mathCloudHydrationReady() || middle3SubmissionCommitInProgress) return;
  const pendingPayload = buildMiddle3CloudPayload();
  if (pendingPayload) localStorage.setItem(middle3CloudQueueKey(), JSON.stringify(pendingPayload));
  clearTimeout(middle3CloudSyncTimer);
  middle3CloudSyncTimer = setTimeout(() => {
    syncMiddle3LevelTestToCloud().catch(() => {});
  }, 500);
}

function applyStudyCoinLedgerToMemory(result) {
  if (!middle3LevelTestMemory || !result) return;
  middle3LevelTestMemory.studyCoinWallet = result.studyCoinWallet || middle3LevelTestMemory.studyCoinWallet || { balance: 0, updatedAt: "" };
  middle3LevelTestMemory.studyCoinTransactions = result.studyCoinTransactions || middle3LevelTestMemory.studyCoinTransactions || [];
  middle3LevelTestMemory.processedRewardEventIds = result.processedRewardEventIds || middle3LevelTestMemory.processedRewardEventIds || [];
}

async function processMiddle3LevelUpRewards(cycleSummary) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const cloud = window.STUDY_CLOUD_AUTH;
  const memory = ensureMiddle3LevelTestMemory();
  const promotionEvents = cycleSummary?.promotionEvents || [];
  if (!engine || !memory || !promotionEvents.length) return [];
  memory.pendingRewardEvents = memory.pendingRewardEvents || [];
  const queuedById = new Map(memory.pendingRewardEvents.map((event) => [event.rewardEventId, {
    ...event,
    userId: event.userId || getCurrentUser() || memory.userId,
  }]));
  promotionEvents.forEach((promotion) => {
    const userId = getCurrentUser() || memory.userId;
    const rewardEventId = engine.createRewardEventId({
      userId,
      conceptId: promotion.conceptId,
      fromStage: promotion.fromStage,
      toStage: promotion.toStage,
      cycleId: promotion.cycleId,
    });
    if (!rewardEventId
      || memory.processedRewardEventIds?.includes(rewardEventId)
      || queuedById.has(rewardEventId)) return;
    queuedById.set(rewardEventId, {
      rewardEventId,
      userId,
      amount: middle3LevelUpRewardCoins,
      conceptId: promotion.conceptId,
      fromStage: promotion.fromStage,
      toStage: promotion.toStage,
      cycleId: promotion.cycleId,
      createdAt: new Date().toISOString(),
    });
  });
  memory.pendingRewardEvents = [...queuedById.values()];
  saveMiddle3LevelTestMemory("level-up-reward-pending");
  if (!cloud?.stateSyncEnabled || typeof cloud.grantStudyCoinReward !== "function") return [];

  await syncMiddle3LevelTestToCloud();
  const results = [];
  for (const event of [...memory.pendingRewardEvents]) {
    try {
      const result = await cloud.grantStudyCoinReward(middle3CloudStateKey, event);
      applyStudyCoinLedgerToMemory(result);
      memory.pendingRewardEvents = memory.pendingRewardEvents.filter((item) => item.rewardEventId !== event.rewardEventId);
      results.push({ rewardEventId: event.rewardEventId, ...result });
      if (result.awarded) window.STUDY_REWARDS?.showCoinReward(event.amount, "레벨 완료 보상");
    } catch {
      results.push({ rewardEventId: event.rewardEventId, awarded: false, reason: "FIREBASE_RETRY_PENDING" });
    }
  }
  saveMiddle3LevelTestMemory("level-up-reward-settled");
  return results;
}

async function retryPendingMiddle3LevelUpRewards() {
  const memory = ensureMiddle3LevelTestMemory();
  if (!memory?.pendingRewardEvents?.length) return [];
  return processMiddle3LevelUpRewards({ promotionEvents: memory.pendingRewardEvents.map((event) => ({
    conceptId: event.conceptId,
    fromStage: event.fromStage,
    toStage: event.toStage,
    cycleId: event.cycleId,
  })) });
}

async function hydrateMiddle3LevelTestFromCloud({ force = false } = {}) {
  const cloud = window.STUDY_CLOUD_AUTH;
  const accountKey = middle3LevelTestMemoryKey();
  if (!cloud?.stateSyncEnabled || typeof cloud.loadUserState !== "function") return false;
  if (!force && middle3CloudHydratedAccountKey === accountKey && middle3CloudHydrationStatus === "READY") return true;
  if (middle3CloudHydrationPromise) return middle3CloudHydrationPromise;
  middle3CloudHydrationStatus = "LOADING";

  middle3CloudHydrationPromise = (async () => {
    try {
      const queued = parseStoredJson(middle3CloudQueueKey());
      const localMemory = loadMiddle3LevelTestMemory();
      const localResume = parseStoredJson(levelTestStateKey());
      let remote = await cloud.loadUserState(middle3CloudStateKey);
      if (!remote && (queued || localMemory || localResume)) {
        const localCandidate = queued || buildMiddle3CloudPayload();
        if (!localCandidate) throw new Error("cloud-local-candidate-missing");
        const uploaded = await cloud.saveUserState(middle3CloudStateKey, localCandidate);
        if (!uploaded) throw new Error("cloud-local-candidate-upload-failed");
        remote = await cloud.loadUserState(middle3CloudStateKey);
      }

      if (remote) {
        const resolution = window.STUDY_MATH_CLOUD_SYNC?.resolveMathHydrationState(remote, localMemory, localResume)
          || { source: "REMOTE", state: remote, conflict: false };
        recordMiddle3RemoteWinsConflict(resolution);
        const remoteState = resolution.state || remote;
        restoreMiddle3MemoryFromRemote(remoteState, accountKey);
        if (remoteState.resumeState && !remoteState.resumeState.completed) {
          localStorage.setItem(levelTestStateKey(), JSON.stringify(remoteState.resumeState));
        } else {
          localStorage.removeItem(levelTestStateKey());
        }
        localStorage.removeItem(middle3CloudQueueKey());
        middle3CloudRemoteRevision = String(remoteState.updatedAt || "");
      }
      middle3CloudHydratedAccountKey = accountKey;
      middle3CloudHydrationStatus = "READY";
      await retryPendingMiddle3LevelUpRewards();
      return true;
    } catch {
      middle3CloudHydrationStatus = "FAILED";
      return false;
    } finally {
      middle3CloudHydrationPromise = null;
    }
  })();

  return middle3CloudHydrationPromise;
}

function loadMiddle3LevelTestMemory() {
  const accountKey = middle3LevelTestMemoryKey();
  if (middle3LevelTestMemory && middle3LevelTestMemoryAccountKey === accountKey) return middle3LevelTestMemory;
  middle3LevelTestMemory = null;
  middle3LevelTestMemoryAccountKey = accountKey;
  try {
    const saved = JSON.parse(localStorage.getItem(accountKey));
    if (saved?.version === window.STUDY_LEVEL_TEST_ENGINE?.VERSION) {
      configureMiddle3ConceptDiagnostics(saved);
      backfillFinalAttemptsFromSavedAnswers(saved, parseStoredJson(levelTestStateKey()));
      middle3LevelTestMemory = saved;
      refreshMiddle3StudyRecommendations("local-restore");
      localStorage.setItem(accountKey, JSON.stringify(middle3LevelTestMemory));
    }
  } catch {
    middle3LevelTestMemory = null;
  }
  return middle3LevelTestMemory;
}

function configureMiddle3ConceptDiagnostics(memory) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const data = window.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS;
  if (!memory || !engine || typeof engine.configureConceptDiagnostics !== "function" || !data?.concepts?.length) return memory;
  const bootstrapPool = buildMiddle3BasicQuestionPool();
  const definitions = data.concepts.map((definition) => ({
    ...definition,
    bootstrapProblemIds: bootstrapPool
      .filter((question) => question.conceptId === definition.bootstrapConceptId)
      .map((question) => question.id),
  }));
  engine.configureConceptDiagnostics(memory, definitions, { replaceTargets: true });
  if (memory.bootstrap?.completed) {
    engine.prioritizeConceptDiagnosticsFromBootstrap?.(memory, memory.bootstrap.results || []);
  }
  return memory;
}

function createMiddle3LevelTestMemory() {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  if (!engine) return null;
  const pool = buildMiddle3CycleQuestionPool();
  const conceptMap = new Map();
  pool.forEach((question) => {
    if (!question.conceptId || conceptMap.has(question.conceptId)) return;
    conceptMap.set(question.conceptId, {
      conceptId: question.conceptId,
      title: question.concept,
      prerequisiteConceptIds: question.prerequisiteConcepts || [],
    });
  });
  middle3LevelTestMemory = engine.createStudentState({
    userId: getCurrentUser() || "guest",
    selectedGrade: "중등 3학년",
    mode: engine.MODE_STANDARD,
    concepts: [...conceptMap.values()],
    targetConceptIds: [...new Set(pool
      .filter((question) => question.code === "M3-STANDARD-APPROVED" && question.executionStatus === "EXECUTABLE")
      .map((question) => question.conceptId))],
  });
  configureMiddle3ConceptDiagnostics(middle3LevelTestMemory);
  middle3LevelTestMemory.studyMapRecommendations = [];
  middle3LevelTestMemory.lastRecommendationGeneratedCycle = 0;
  middle3LevelTestMemory.studyCoinWallet = { balance: 0, updatedAt: "" };
  middle3LevelTestMemory.studyCoinTransactions = [];
  middle3LevelTestMemory.processedRewardEventIds = [];
  middle3LevelTestMemory.pendingRewardEvents = [];
  middle3LevelTestMemoryAccountKey = middle3LevelTestMemoryKey();
  return middle3LevelTestMemory;
}

function ensureMiddle3LevelTestMemory() {
  return loadMiddle3LevelTestMemory() || createMiddle3LevelTestMemory();
}

function refreshMiddle3StudyRecommendations(reason = "state-update") {
  const service = window.STUDY_MATH_STUDY_RECOMMENDATIONS;
  if (!middle3LevelTestMemory || typeof service?.refreshRecommendations !== "function") return false;
  return Boolean(service.refreshRecommendations(middle3LevelTestMemory, {
    reason,
    graphState: window.STUDY_MATH_CONCEPT_GRAPH_UI?.getState?.() || null,
  })?.changed);
}

function refreshMiddle3LevelReport(reason = "state-update") {
  const service = window.STUDY_MATH_LEVEL_REPORT;
  const detailData = window.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS;
  if (!middle3LevelTestMemory || typeof service?.createReport !== "function" || !detailData?.concepts?.length) return null;
  const report = service.createReport(middle3LevelTestMemory, detailData);
  middle3LevelTestMemory.latestLevelReport = report;
  middle3LevelTestMemory.latestLevelReportReason = reason;
  middle3LevelTestMemory.latestLevelReportUpdatedAt = report.generatedAt;
  return report;
}

function saveMiddle3LevelTestMemory(reason = "state-update") {
  if (!middle3LevelTestMemory) return;
  if (middle3LevelTestMemory.session) middle3LevelTestMemory.session.elapsedSeconds = Math.max(0, remainingSeconds || 0);
  middle3LevelTestMemory.updatedAt = new Date().toISOString();
  refreshMiddle3StudyRecommendations(reason);
  refreshMiddle3LevelReport(reason);
  localStorage.setItem(middle3LevelTestMemoryKey(), JSON.stringify(middle3LevelTestMemory));
  scheduleMiddle3CloudSync();
}

window.addEventListener("study:math-recommendations-updated", (event) => {
  const incoming = event.detail?.memory;
  if (!incoming || incoming.version !== window.STUDY_LEVEL_TEST_ENGINE?.VERSION) return;
  middle3LevelTestMemory = incoming;
  middle3LevelTestMemoryAccountKey = middle3LevelTestMemoryKey();
  configureMiddle3ConceptDiagnostics(middle3LevelTestMemory);
  saveMiddle3LevelTestMemory(event.detail?.reason || "learning-map-update");
});

function bootstrapOutcomeFor(question, answer) {
  if (isGiveUpAnswer(answer)) return "giveup";
  return answer === question.answer ? "correct" : "wrong";
}

function completeMiddle3Bootstrap() {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  if (!engine || !memory) return false;
  const results = activeQuestions.map((question, index) => ({
    problemId: question.id,
    conceptId: question.conceptId,
    concept: question.concept,
    prerequisiteConceptIds: question.prerequisiteConcepts || [],
    outcome: bootstrapOutcomeFor(question, selectedAnswers[index]),
    fingerprint: engine.problemFingerprint(question),
    generationFingerprint: engine.problemFingerprint(question),
    structureSignature: engine.structureSignature(question),
    solutionPathSignature: engine.solutionPathSignature(question),
    misconceptionTags: question.misconceptionTags || [],
    independentCheck: question.independentCheck === true,
    finalSubmission: true,
  }));
  engine.attachCanonicalConceptEvidence?.(memory, results, {
    testGradeBand: "M3",
    selectedGrade: memory.selectedGrade,
    timestamp: Date.now(),
  });
  engine.applyBootstrapResults(memory, results);
  configureMiddle3ConceptDiagnostics(memory);
  engine.prioritizeConceptDiagnosticsFromBootstrap?.(memory, results);
  saveMiddle3LevelTestMemory("bootstrap-complete");
  window.dispatchEvent(new CustomEvent("study:math-level-test-completed", {
    detail: { results, testGradeBand: "M3", selectedGrade: memory.selectedGrade, timestamp: Date.now() },
  }));
  queueLevelTestNotice({
    icon: "✓",
    title: "기본 진단이 완료되었습니다.",
    copy: "이제 세부 개념을 계속 확인합니다.",
    duration: 1800,
  });
  startMiddle3Cycle({ bootstrapCompleted: true });
  return true;
}

function cycleCompletionMessage(summary) {
  if (!summary) return "다음 사이클을 이어서 확인합니다.";
  if (summary.recoveryConceptIds?.length) return "필요한 기본 개념을 다음 문제에서 차분히 확인할게요.";
  if (summary.promotedConceptIds?.length) return "한 단계 성장했어요. 다음 문제를 계속 확인할게요.";
  return "현재 단계를 유지하며 다음 문제를 계속 확인할게요.";
}

function cycleCompletionNotice(summary) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  if (summary?.recoveryCompleted) {
    return {
      icon: "✓",
      title: "기초 연결이 안정되었습니다.",
      copy: "이전 학습 위치를 다시 확인합니다.",
    };
  }
  if (summary?.recoveryConceptIds?.length) {
    return {
      icon: "🧭",
      title: "사이클 완료",
      copy: "다음 사이클에서 필요한 개념을 보완합니다.",
    };
  }
  if (summary?.promotedConceptIds?.length) {
    const concept = memory?.conceptMastery?.[summary.promotedConceptIds[0]];
    const stage = engine?.stageLabel(concept?.stageIndex || 0) || "다음";
    return {
      icon: "🏆",
      title: "레벨업!",
      copy: `${concept?.title || "확인한 개념"} · ${stage} 단계로 성장했습니다.`,
    };
  }
  return {
    icon: "✓",
    title: "사이클 완료",
    copy: "현재 단계를 계속 확인합니다.",
  };
}

function independentLearningCheckNotice(outcome) {
  if (outcome === "correct") {
    return { icon: "✓", title: "잘 적용했어요.", copy: "다음 문제를 계속 확인합니다." };
  }
  if (outcome === "giveup") {
    return { icon: "→", title: "다음 문제로 넘어갑니다.", copy: "새로운 문제에서 다시 확인할게요." };
  }
  return { icon: "→", title: "다른 문제에서 다시 확인합니다.", copy: "현재 단계에서 새로운 문제를 준비할게요." };
}

function queueLevelTestNotice(notice) {
  queuedLevelTestNotice = notice ? { duration: 2200, ...notice } : null;
}

function showQueuedLevelTestNotice() {
  if (!queuedLevelTestNotice || reviewMode) return;
  const notice = queuedLevelTestNotice;
  queuedLevelTestNotice = null;
  clearTimeout(levelTestNoticeTimer);
  toastIcon.textContent = notice.icon;
  toastTitle.textContent = notice.title;
  toastCopy.textContent = notice.copy;
  quizToast.classList.remove("hidden");
  levelTestNoticeTimer = setTimeout(() => {
    quizToast.classList.add("hidden");
  }, notice.duration);
}

function startMiddle3Cycle({ bootstrapCompleted = false } = {}) {
  const engine = window.STUDY_LEVEL_TEST_ENGINE;
  const memory = ensureMiddle3LevelTestMemory();
  if (!engine || !memory) return false;
  engine.resumeSession(memory);
  adaptiveQuestionPool = buildMiddle3CycleQuestionPool();
  adaptiveState = createAdaptiveState("중등 3학년");
  adaptiveState.selectedSubject = "수학";
  adaptiveState.selectedGrade = "중등 3학년";
  adaptiveState.testMode = middle3CycleTestMode;
  adaptiveState.representativeQueue = [];
  adaptiveState.prerequisiteQueue = [];
  adaptiveState.feedback = bootstrapCompleted
    ? "기본 진단이 완료되었습니다. 이제 세부 개념을 계속 확인합니다."
    : "저장된 위치에서 실력 확인을 이어갑니다.";
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  quizScreen?.setAttribute("data-test-mode", middle3CycleTestMode);
  quizScreen?.classList.remove("elite-mode");
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
  reviewMode = false;
  const quizTitle = document.querySelector("#quizTitle");
  if (quizTitle) quizTitle.textContent = "중3 수학 연속 레벨테스트";
  if (!addNextAdaptiveQuestion()) return false;
  startTimer(memory.session?.elapsedSeconds || 0);
  renderQuestion();
  saveLevelTestState();
  return true;
}

function normalizeQuestion(item, bank, index) {
  const concept = item.unit;
  const answer = String(item.answer);

  return {
    id: item.questionId,
    questionId: item.questionId,
    conceptId: item.conceptId,
    unitId: item.unitId,
    problemFamilyId: item.problemFamilyId,
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

function englishDiagnosticLevelNumber(grade = getSelectedGrade()) {
  const normalized = String(grade || "").replace(/\s+/g, "");
  const gradeLevelMap = {
    "초등4학년": 3, "초4": 3,
    "초등5학년": 4, "초5": 4,
    "초등6학년": 5, "초6": 5,
    "중등1학년": 6, "중1": 6,
    "중등2학년": 7, "중2": 7,
    "중등3학년": 8, "중3": 8,
    "고등1학년": 9, "고1": 9,
    "고등2학년": 10, "고2": 10,
    "고등3학년": 11, "고3": 11,
  };
  return gradeLevelMap[normalized] || 3;
}

function buildSubjectDiagnosticPool(subjectName, options = {}) {
  const contentKey = { "영어": "english", "독서": "reading", "과학": "science", "한자": "hanja" }[subjectName];
  const subjectContent = window.STUDY_SUBJECT_CONTENT?.[contentKey];
  const englishMode = options.mode === "grade" ? "grade" : "adaptive";
  const selectedGrade = options.selectedGrade || getSelectedGrade();
  const targetEnglishLevel = englishDiagnosticLevelNumber(selectedGrade);
  const stages = (subjectContent?.stages || []).filter((stage) => contentKey !== "english"
    || englishMode !== "grade"
    || Number(String(stage.levelId || "").match(/EN-L(\d{2})/)?.[1]) === targetEnglishLevel);
  const stageQuestions = stages.flatMap((stage) => {
    const questionStages = contentKey === "english" && stage.courseStages?.length
      ? stage.courseStages.map((courseStage) => ({
          ...courseStage,
          levelId: stage.levelId,
          levelTitle: stage.levelTitle,
          title: `${stage.title} · ${courseStage.stageTitle}`,
        }))
      : [stage];
    return questionStages.flatMap((questionStage) => (questionStage.questions || [])
      .filter((question) => question.answer && question.type !== "journal"
        && (contentKey !== "english" || question.choices?.length >= 4))
      .map((question) => ({ question, stage: questionStage })));
  });
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
    while (uniqueChoices.length < 4) uniqueChoices.push(contentKey === "english" ? ["always", "never", "today", "tomorrow"][uniqueChoices.length] : `다른 표현 ${uniqueChoices.length + 1}`);
    const englishRank = Number(String(stage.levelId || question.id || "").match(/EN-L(\d{2})/)?.[1] || rank);
    const questionRank = contentKey === "english" ? Math.max(1, Math.min(12, englishRank)) : rank;
    const englishDomain = ({
      vocabulary: "어휘",
      grammar: "문법",
      practice: "문장 연습",
      reading: "독해",
      listening: "듣기",
      speaking: "말하기",
      writing: "쓰기",
      checkpoint: "종합",
      boss: "종합",
      concept: "기초 개념",
    })[stage.stageType] || "종합";
    return {
      id: `subject-diagnostic-${contentKey}-${question.id}`,
      conceptId: `${contentKey}-${stage.id}`,
      bank: contentKey,
      grade: selectedGrade,
      level: selectedGrade,
      difficulty: question.difficulty || (index % 3) + 1,
      seconds: 50,
      domain: contentKey === "english" ? englishDomain : adaptiveDomains[index % adaptiveDomains.length],
      adaptiveLevel: (index % 3) + 1,
      isRepresentative: index % 2 === 0,
      rank: questionRank,
      levelLabel: contentKey === "english" ? stage.levelTitle : getSelectedGrade(),
      concept: contentKey === "english" ? `${subjectName} · ${englishDomain}` : `${subjectName} · ${stage.title}`,
      problem: contentKey === "english" && question.passage
        ? `${question.question}\n${question.passage}`
        : question.question,
      answer: String(question.answer),
      choices: uniqueChoices,
      stable: stage.title,
      start: stage.title,
      code: contentKey.toUpperCase(),
      explanation: question.explanation || "선택한 과목의 핵심 개념을 다시 확인해보세요.",
    };
  });
}

function isAdaptiveConceptDiagnosis() {
  return adaptiveState?.mode === adaptiveConceptDiagnosisMode;
}

function adaptiveLevelTestUserId() {
  return getCurrentUser() || "guest";
}

function adaptiveLevelTestCloud() {
  const cloud = window.STUDY_CLOUD_AUTH;
  return cloud?.stateSyncEnabled !== false && getCurrentUser() ? cloud : null;
}

function buildAdaptiveLevelTestCatalog() {
  const gradeBanks = window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS;
  const selector = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_SELECTOR;
  if (!gradeBanks || !selector) return { byGrade: {} };
  const sessions = {};
  ["G4", "G5", "G6", "M1", "M2", "M3"].forEach((gradeBand) => {
    const route = gradeBanks.buildGradeTestSession({
      selectedGrade: gradeBand,
      generatedConceptBanks: window.generatedConceptBanks,
    });
    if (route?.status === gradeBanks.STATUS.READY) sessions[gradeBand] = route;
  });
  return selector.createQuestionCatalog({ sessions });
}

function adaptiveLevelTestElements() {
  return {
    quizTitle: document.querySelector("#quizTitle"),
    quizConcept,
    quizConceptSub: document.querySelector("#quizConceptSub"),
    quizPrompt: document.querySelector("#quizPrompt"),
    quizProblem,
    answerList,
    quizCount,
    quizProgress,
    quizRoute,
    currentAnalysis,
    checkedAnalysis,
    nextAnalysis,
    resultLevel,
    resultStartCopy,
    strongDomains,
    weakDomains,
    confidenceDomains,
    masteryDomains,
    learningPath,
    selectedAnswer: () => selectedAnswer,
  };
}

async function persistAdaptiveLevelTestSession(session) {
  const storage = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE;
  if (!storage?.isValidSession(session)) return { saved: false, reason: "INVALID_STATE" };
  const userId = adaptiveLevelTestUserId();
  storage.saveLocal(localStorage, userId, session);
  const cloud = adaptiveLevelTestCloud();
  if (cloud) storage.persist({
    storage: localStorage,
    userId,
    cloud,
    session,
  }).catch(() => {});
  return { saved: true, remoteSaved: false, reason: "LOCAL_FIRST", state: session };
}

function hydrateAdaptiveLevelTestFromCloud(baselineSession, controller) {
  const storage = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE;
  const cloud = adaptiveLevelTestCloud();
  if (!storage || !cloud?.loadUserState || !baselineSession || !controller) return;
  const baselineSessionId = baselineSession.sessionId;
  const baselineRevision = Number(baselineSession.revision || 0);
  Promise.resolve(cloud.loadUserState(storage.CLOUD_KEY)).then((remote) => {
    if (!storage.isValidSession(remote)) return;
    const current = controller.getSession();
    if (!current
      || current.sessionId !== baselineSessionId
      || Number(current.revision || 0) !== baselineRevision) return;
    storage.saveLocal(localStorage, adaptiveLevelTestUserId(), remote);
    controller.restore(remote);
    if (["IN_PROGRESS", "PAUSED"].includes(remote.status)) showAdaptiveLevelTestResume(remote);
    else if (remote.status === "COMPLETED") renderAdaptiveLevelTestResult(remote);
  }).catch(() => {});
}

function syncAdaptiveLevelTestView(session) {
  adaptiveState = session;
  activeQuestions = session?.currentQuestion ? [session.currentQuestion] : [];
  selectedAnswers = [""];
  selectedAnswer = "";
  currentQuestion = 0;
  answeredQuestionIds = new Set(session?.graphState?.answeredProblemIds || []);
  adaptiveLevelTestResumeState = null;
}

function createAdaptiveLevelTestController() {
  const ui = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI;
  if (!ui) return null;
  return ui.createController({
    catalog: buildAdaptiveLevelTestCatalog(),
    persist: persistAdaptiveLevelTestSession,
  });
}

function renderAdaptiveLevelTestQuestion() {
  const ui = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI;
  const session = adaptiveLevelTestController?.getSession();
  if (!ui || !session?.currentQuestion) return false;
  syncAdaptiveLevelTestView(session);
  questionStartedAt = Date.now();
  reviewMode = false;
  quizToast.classList.add("hidden");
  reviewExplanation.classList.add("hidden");
  quizActions.classList.remove("hidden");
  reviewActions.classList.add("hidden");
  pauseTest.classList.remove("hidden");
  nextQuestion.textContent = "답 제출";
  nextQuestion.disabled = false;
  unknownQuestion.disabled = false;
  stopTest.disabled = true;
  stopTestTop.disabled = true;
  timeLabel.textContent = "진단 시간";
  ui.renderQuestion(adaptiveLevelTestElements(), session);
  return true;
}

function adaptiveEvidenceResults(session) {
  return Object.values(session?.evidenceByConcept || {}).flat().map((item) => ({
    ...item,
    conceptId: item.conceptId || item.canonicalConceptId,
    finalSubmission: item.finalSubmission !== false,
  }));
}

function renderAdaptiveLevelTestResult(session) {
  const ui = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI;
  const result = session.result || ui.resultLists(session);
  adaptiveLevelTestResultPending = { session, result };
  ui.renderResult(adaptiveLevelTestElements(), result);
  resultTotal.textContent = `${session.totalQuestions || 0}문제 완료`;
  wrongCount.textContent = `${adaptiveEvidenceResults(session).filter((item) => item.result === "INCORRECT" || item.result === "GIVEUP").length}개`;
  startLevel.textContent = result.student["지금 시작할 학습"].join(", ") || "가까운 학습 준비 중";
  stableZone.textContent = result.student["잘 이해한 개념"].join(", ") || "진단 완료";
  clearInterval(timerId);
  showScreen("result");
}

function showAdaptiveLevelTestUnavailable(session) {
  const message = session.status === "BLOCKED_NO_CONTENT"
    ? "준비 중인 개념입니다. 현재 가능한 가장 가까운 학습으로 안내합니다."
    : "현재 확인할 문제 범위를 준비하고 있습니다.";
  adaptiveLevelTestResultPending = { session, result: window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI.resultLists(session) };
  showScreen("quiz");
  document.querySelector("#quizTitle").textContent = "맞춤형 수학 진단";
  quizRoute.textContent = message;
  quizConcept.textContent = "진단 대기";
  document.querySelector("#quizPrompt").textContent = "다른 문제로 임의 전환하지 않았어요.";
  quizProblem.textContent = session.status === "BLOCKED_NO_CONTENT"
    ? "현재 가능한 가장 가까운 학습을 준비하고 있습니다."
    : "선택한 범위의 문제은행을 준비하고 있습니다.";
  answerList.innerHTML = "";
  quizActions.classList.remove("hidden");
  nextQuestion.textContent = session.status;
  nextQuestion.disabled = true;
  unknownQuestion.disabled = true;
  stopTest.disabled = true;
  stopTestTop.disabled = true;
  clearInterval(timerId);
}

function showAdaptiveLevelTestResume(session) {
  adaptiveLevelTestResumeState = session;
  const percent = Math.min(100, Math.round((Number(session.totalQuestions || 0) / 24) * 100));
  resumeProgress.style.width = `${percent}%`;
  resumePercent.textContent = `${percent}%`;
  resumeChecked.textContent = `${session.totalQuestions || 0}문제 확인`;
  resumeFocus.textContent = window.STUDY_MATH_CONCEPT_GRAPH?.conceptById?.[session.activeConceptId]?.displayName || "현재 확인 중인 개념";
  resumeSavedAt.textContent = session.updatedAt ? new Date(session.updatedAt).toLocaleString("ko-KR") : "저장됨";
  showScreen("resume-test");
}

async function startAdaptiveMathDiagnosis({ forceNew = false } = {}) {
  const storage = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE;
  if (!storage || !window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI) return false;
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  quizScreen?.setAttribute("data-test-mode", adaptiveConceptDiagnosisMode);
  quizScreen?.removeAttribute("data-grade-band");
  quizScreen?.removeAttribute("data-grade-bank-id");
  levelTestSubject = "수학";
  localStorage.setItem("studyCoinLevelTestSubject", levelTestSubject);
  const previous = storage.loadLocal(localStorage, adaptiveLevelTestUserId());
  adaptiveLevelTestController = createAdaptiveLevelTestController();
  if (!forceNew && ["IN_PROGRESS", "PAUSED"].includes(previous?.status)) {
    adaptiveLevelTestController.restore(previous);
    showAdaptiveLevelTestResume(previous);
    hydrateAdaptiveLevelTestFromCloud(previous, adaptiveLevelTestController);
    return true;
  }
  const started = adaptiveLevelTestController.start({
    previousSession: previous,
    sessionId: globalThis.crypto?.randomUUID ? `adaptive-${globalThis.crypto.randomUUID()}` : `adaptive-${Date.now()}`,
    timestamp: Date.now(),
  });
  const session = started.session;
  syncAdaptiveLevelTestView(session);
  await persistAdaptiveLevelTestSession(session);
  if (started.status !== "QUESTION_SELECTED") {
    showAdaptiveLevelTestUnavailable(session);
    return true;
  }
  showScreen("quiz");
  startTimer(0);
  renderAdaptiveLevelTestQuestion();
  hydrateAdaptiveLevelTestFromCloud(session, adaptiveLevelTestController);
  return true;
}

async function restoreAdaptiveMathDiagnosisRoute() {
  const savedScreen = localStorage.getItem("studyCoinCurrentScreen");
  if (!["quiz", "resume-test"].includes(savedScreen) || adaptiveLevelTestController) return false;
  const storage = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE;
  const local = storage?.loadLocal?.(localStorage, adaptiveLevelTestUserId());
  if (!local || !["IN_PROGRESS", "PAUSED"].includes(local.status)) return false;
  await startAdaptiveMathDiagnosis();
  return true;
}

async function submitAdaptiveLevelTestAnswer({ giveup = false } = {}) {
  const ui = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI;
  const question = adaptiveLevelTestController?.getSession()?.currentQuestion;
  if (!ui || !question || isChecking) return;
  const answer = giveup ? "" : ui.readAnswer(adaptiveLevelTestElements(), question);
  if (!giveup && !String(answer).trim()) return;
  isChecking = true;
  const outcome = await adaptiveLevelTestController.submit(answer, {
    submissionId: createSubmissionId(),
    result: giveup ? "GIVEUP" : undefined,
    misconceptionTags: giveup ? question.misconceptionTags || [] : undefined,
    independentCheck: question.independentCheck === true,
    timestamp: Date.now(),
  });
  isChecking = false;
  if (!outcome.accepted) return;
  syncAdaptiveLevelTestView(outcome.session);
  if (outcome.completed) {
    renderAdaptiveLevelTestResult(outcome.session);
    return;
  }
  if (outcome.next?.status !== "QUESTION_SELECTED") {
    showAdaptiveLevelTestUnavailable(outcome.session);
    return;
  }
  renderAdaptiveLevelTestQuestion();
}

async function startSubjectLevelTest(subjectName, mathMode = "adaptive") {
  if (!testableLevelTestSubjects.has(subjectName)) return;
  if (subjectName === "수학") {
    if (mathMode !== "grade") {
      saveLearningSettings();
      completeOnboarding().catch(() => {});
      await startAdaptiveMathDiagnosis();
      return;
    }
    const configuredGrade = getConfiguredGradeForRangeDiagnosis();
    if (!configuredGrade) {
      showScreen("profile-setup");
      return;
    }
    saveLearningSettings();
    completeOnboarding().catch(() => {});
    levelTestSubject = subjectName;
    localStorage.setItem("studyCoinLevelTestSubject", subjectName);
    const selectedMathGradeBand = window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS?.normalizeGradeBand(configuredGrade);
    if (!selectedMathGradeBand) {
      showScreen("profile-setup");
      return;
    }
    if (selectedMathGradeBand === "M3") {
      const hydrated = await hydrateMiddle3LevelTestFromCloud();
      if (mathCloudSyncRequired() && !hydrated) {
        window.alert("수학 학습 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
    }
    const saved = getSavedLevelTest();
    if (saved?.adaptiveState?.selectedSubject === "수학" && isGradeRangeDiagnosisMode(saved?.adaptiveState?.testMode)) {
      showResumeScreen(saved);
      return;
    }
    showScreen("quiz");
    resetLevelTest(configuredGrade);
    return;
  }
  saveLearningSettings();
  await completeOnboarding();
  levelTestSubject = subjectName;
  localStorage.setItem("studyCoinLevelTestSubject", subjectName);
  const quizTitle = document.querySelector("#quizTitle");
  const subjectTestMode = subjectName === "영어" && mathMode === "grade" ? "grade" : "adaptive";
  adaptiveQuestionPool = buildSubjectDiagnosticPool(subjectName, { mode: subjectTestMode, selectedGrade: getSelectedGrade() });
  if (adaptiveQuestionPool.length < 5) {
    alert(`${subjectName} 레벨테스트 문항은 준비 중입니다.`);
    return;
  }
  answeredQuestionIds = new Set();
  const subjectDomains = subjectName === "영어"
    ? [...new Set(adaptiveQuestionPool.map((question) => question.domain))]
    : adaptiveDomains;
  adaptiveState = createAdaptiveState(getSelectedGrade(), subjectDomains);
  adaptiveState.selectedSubject = subjectName;
  adaptiveState.testMode = subjectName === "영어" ? `english-${subjectTestMode}` : mathMode;
  if (subjectName === "영어") {
    adaptiveState.startRank = subjectTestMode === "adaptive" ? 3 : englishDiagnosticLevelNumber(getSelectedGrade());
    adaptiveState.currentRank = adaptiveState.startRank;
  }
  const placementQuestions = subjectName === "영어"
    ? adaptiveQuestionPool.filter((question) => subjectTestMode === "grade"
      ? question.rank === adaptiveState.startRank
      : question.rank === adaptiveState.startRank)
    : adaptiveQuestionPool;
  adaptiveState.representativeQueue = [...new Set(placementQuestions.map((question) => question.concept))];
  adaptiveState.prerequisiteQueue = [];
  adaptiveState.focusDomain = placementQuestions[0]?.domain || adaptiveQuestionPool[0].domain;
  adaptiveState.nextDomain = placementQuestions.find((question) => question.domain !== adaptiveState.focusDomain)?.domain || adaptiveState.focusDomain;
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
  if (isMiddle3CycleLevelTest()) {
    const engine = window.STUDY_LEVEL_TEST_ENGINE;
    const memory = ensureMiddle3LevelTestMemory();
    return engine?.selectNextProblem(memory, adaptiveQuestionPool) || null;
  }

  const unanswered = adaptiveQuestionPool.filter((question) => !answeredQuestionIds.has(question.id));
  if (!unanswered.length) return null;

  if (isGradeRangeDiagnosisMode()) return unanswered[0];

  if (isMiddle3BasicLevelTest()) {
    const engine = window.STUDY_LEVEL_TEST_ENGINE;
    const memory = ensureMiddle3LevelTestMemory();
    for (const question of unanswered) {
      const validation = engine?.validateProblem(question, {
        strictMathValidation: true,
        expectedGrade: 9,
        expectedConceptId: question.conceptId,
        expectedStageIndex: 0,
      });
      if (validation?.isValid) return question;
      if (memory) {
        memory.problemValidationFailures = memory.problemValidationFailures || [];
        memory.problemValidationFailures.push({
          problemId: question.id,
          conceptId: question.conceptId,
          purpose: "BOOTSTRAP",
          errors: validation?.errors || ["VALIDATOR_UNAVAILABLE"],
          rejectedAt: new Date().toISOString(),
        });
        memory.problemValidationFailures = memory.problemValidationFailures.slice(-200);
      }
    }
    return null;
  }

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

function updateAdaptiveState(question, answer, solveSeconds, submission = {}) {
  if (isMiddle3CycleLevelTest()) {
    const engine = window.STUDY_LEVEL_TEST_ENGINE;
    const memory = ensureMiddle3LevelTestMemory();
    if (!engine || !memory) return;
    const outcome = isGiveUpAnswer(answer) ? "giveup" : answer === question.answer ? "correct" : "wrong";
    const result = engine.recordOutcome(memory, question, outcome, solveSeconds, {
      cycleId: question.cycleId,
      submissionId: submission.submissionId,
      selectedAnswer: answer,
      finalizedAt: submission.finalizedAt,
    });
    if (result.duplicate || result.rejected) return result;
    if (result.cycleCompleted) {
      adaptiveState.feedback = cycleCompletionMessage(result.cycleSummary);
      queueLevelTestNotice(cycleCompletionNotice(result.cycleSummary));
    }
    if (question.targetPurpose === engine.PURPOSES.INDEPENDENT_LEARNING_CHECK) {
      queueLevelTestNotice(independentLearningCheckNotice(outcome));
    }
    saveMiddle3LevelTestMemory(result.cycleCompleted ? "cycle-complete" : "recovery-status-check");
    if (result.cycleCompleted && result.cycleSummary?.promotionEvents?.length) {
      processMiddle3LevelUpRewards(result.cycleSummary).catch(() => {});
    }
    return result;
  }

  const stats = adaptiveState.scores[question.domain];
  const isUnknown = isGiveUpAnswer(answer);
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
    adaptiveState.feedback = "괜찮아요. 실력을 찾아가는 과정이에요. 조금 더 쉬운 문제부터 시작해볼게요.";
  } else if (adaptiveState.streakCorrect >= 5) {
    adaptiveState.feedback = "좋아요! 생각보다 잘하고 있어요. 조금 더 어려운 문제를 드릴게요.";
  } else if (isUnknown) {
    adaptiveState.feedback = "좋아요. 모르는 개념이면 더 쉬운 문제로 다시 확인해볼게요.";
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
  const availableDomains = Object.keys(adaptiveState?.scores || {});
  const currentIndex = availableDomains.indexOf(currentDomain);
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
  const ordered = [...availableDomains.slice(startIndex), ...availableDomains.slice(0, startIndex)];
  const uncertain = ordered.find((domain) => {
    const stats = adaptiveState.scores[domain];
    return stats.attempts > 0 && stats.confidence < 82;
  });
  if (uncertain) return uncertain;

  const next = ordered.find((domain) => adaptiveState.scores[domain].attempts < 3);
  return next || ordered[0] || currentDomain;
}

function shouldFinishAdaptiveTest() {
  const attempts = activeQuestions.length;
  if (isMiddle3CycleLevelTest()) return false;
  if (isGradeRangeDiagnosisMode()) return attempts >= adaptiveQuestionPool.length;
  if (isMiddle3BasicLevelTest()) return attempts >= adaptiveQuestionPool.length;
  if (attempts >= aiScoringRules.maxAdaptiveQuestions) return true;
  if (attempts < aiScoringRules.minAdaptiveQuestions) return false;

  const testedDomainCount = Object.values(adaptiveState.scores).filter((stats) => stats.attempts > 0).length;
  const uncertainDomains = Object.values(adaptiveState.scores).filter((stats) => stats.attempts > 0 && stats.confidence < 70).length;
  const exitDomains = adaptiveState.selectedSubject === "영어"
    ? Object.keys(adaptiveState.scores).slice(0, 4)
    : requiredExitDomains;
  const coreDomainsReady = exitDomains.every((domain) => {
    const stats = adaptiveState.scores[domain];
    return stats && stats.attempts >= 3 && stats.confidence >= aiScoringRules.targetConfidence;
  });
  const weakClear = adaptiveState.weakDomains.length > 0 && attempts >= 9 && uncertainDomains <= 2;
  const enoughEvidence = adaptiveState.confidence >= 82 && testedDomainCount >= 5;
  const highPerformerClear = attempts >= 18 && testedDomainCount >= 6 && adaptiveState.weakDomains.length === 0 && uncertainDomains <= 1;

  return coreDomainsReady || (weakClear && enoughEvidence) || highPerformerClear;
}

function updateAdaptiveDisplay(question) {
  if (isMiddle3CycleLevelTest()) {
    const memory = ensureMiddle3LevelTestMemory();
    const cycle = memory?.activeCycle;
    const answered = cycle?.answers?.length || 0;
    const target = cycle?.targetSize || window.STUDY_LEVEL_TEST_ENGINE?.DEFAULT_CYCLE_SIZE || 24;
    quizCount.textContent = `사이클 ${cycle?.number || memory?.cycleNumber || 1} · ${answered + 1}/${target}`;
    quizProgress.style.width = `${Math.round((answered / target) * 100)}%`;
    quizRoute.textContent = adaptiveState.feedback || "문제가 자연스럽게 이어집니다.";
    currentAnalysis.textContent = question?.concept || "현재 개념";
    checkedAnalysis.textContent = question?.stageLabel || "기본";
    nextAnalysis.textContent = "다음 개념 확인";
    return;
  }

  if (isMiddle3BasicLevelTest()) {
    const completedUnits = [...new Set(adaptiveState.history.map((item) => item.concept))];
    const nextQuestion = adaptiveQuestionPool.find((item) => !answeredQuestionIds.has(item.id));
    const completedQuestions = adaptiveState.history.length;
    const totalQuestions = adaptiveQuestionPool.length;
    quizCount.textContent = `${completedQuestions + 1}/${totalQuestions}문제`;
    quizProgress.style.width = `${Math.round((completedQuestions / totalQuestions) * 100)}%`;
    quizRoute.textContent = `중3 기본과정 ${question.stage}/${question.stageTotal}단계`;
    currentAnalysis.textContent = question.domain;
    checkedAnalysis.textContent = completedUnits.length ? completedUnits.join(" · ") : "1단계 시작";
    nextAnalysis.textContent = nextQuestion?.concept || "결과 확인";
    return;
  }

  const subject = adaptiveState?.selectedSubject || levelTestSubject || "수학";
  const checked = subject === "수학"
    ? Object.entries(adaptiveState.scores)
      .filter(([, stats]) => stats.attempts > 0)
      .map(([domain]) => `확인 ${domain}`)
      .slice(0, 4)
    : [...new Set(adaptiveState.history.map((item) => item.concept))]
      .map((concept) => `확인 ${concept}`)
      .slice(0, 4);

  quizCount.textContent = "AI 분석 중";
  quizProgress.style.width = `${adaptiveState.confidence}%`;
  quizRoute.textContent = adaptiveState.feedback || "AI가 현재 실력을 분석하고 있습니다.";
  currentAnalysis.textContent = subject === "수학"
    ? question?.domain || adaptiveState.focusDomain
    : question?.concept || subject;
  checkedAnalysis.textContent = checked.length ? checked.join(" · ") : "분석 시작";
  nextAnalysis.textContent = adaptiveState.prerequisiteQueue[0] || adaptiveState.representativeQueue[0] || adaptiveState.nextDomain;
}

function getSavedLevelTest() {
  try {
    const accountKey = levelTestStateKey();
    let raw = localStorage.getItem(accountKey);
    if (!raw) {
      raw = localStorage.getItem(levelTestStorageKey);
      if (raw) {
        localStorage.setItem(accountKey, raw);
        localStorage.removeItem(levelTestStorageKey);
      }
    }
    const saved = JSON.parse(raw);
    if (!saved || saved.completed) return null;
    if (saved.engineVersion !== levelTestEngineVersion) return null;
    if (!saved.selectedGrade || !saved.adaptiveState?.representativeQueue) return null;
    if (saved.adaptiveState?.selectedSubject === "영어" && !Object.keys(saved.adaptiveState.scores || {}).some((domain) => ["어휘", "문법", "독해", "듣기"].includes(domain))) return null;
    const currentGrade = isGradeRangeDiagnosisMode(saved.adaptiveState?.testMode)
      ? getConfiguredGradeForRangeDiagnosis()
      : getSelectedGrade();
    const normalizeGrade = window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS?.normalizeGradeBand;
    if (saved.selectedGrade && normalizeGrade?.(saved.selectedGrade) !== normalizeGrade?.(currentGrade)) return null;
    return saved;
  } catch {
    return null;
  }
}

function saveLevelTestState({ scheduleCloud = true } = {}) {
  if (isAdaptiveConceptDiagnosis()) {
    const session = adaptiveLevelTestController?.getSession() || adaptiveState;
    return window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_STORAGE?.saveLocal(localStorage, adaptiveLevelTestUserId(), session) || false;
  }
  if (!adaptiveState || !activeQuestions.length) return;
  const isMiddle3MathTest = levelTestSubject === "수학" && (isMiddle3BasicLevelTest() || isMiddle3CycleLevelTest());
  if (isMiddle3MathTest && !mathCloudHydrationReady()) return false;
  if (isMiddle3MathTest) saveMiddle3LevelTestMemory();

  const snapshot = {
    engineVersion: levelTestEngineVersion,
    mode: adaptiveState.testMode,
    savedAt: new Date().toISOString(),
    completed: false,
    selectedGrade: adaptiveState.selectedGrade || getSelectedGrade(),
    selectedGradeBand: adaptiveState.selectedGradeBand || adaptiveState.testGradeBand || null,
    selectedGradeBankId: adaptiveState.selectedGradeBankId || null,
    currentQuestionIndex: currentQuestion,
    answers: selectedAnswers,
    result: null,
    activeQuestions,
    selectedAnswers,
    currentQuestion,
    answeredQuestionIds: [...answeredQuestionIds],
    adaptiveState,
    timedOutQuestionIds: timedOutQuestions.map((question) => question.id),
    unknownQuestionIds: unknownQuestions.map((question) => question.id),
    wrongQuestionIds: wrongQuestions.map((question) => question.id),
    remainingSeconds,
  };
  localStorage.setItem(levelTestStateKey(), JSON.stringify(snapshot));
  if (isMiddle3MathTest && scheduleCloud) scheduleMiddle3CloudSync();
  return true;
}

function clearSavedLevelTest() {
  localStorage.removeItem(levelTestStateKey());
  localStorage.removeItem(levelTestStorageKey);
}

function restoreLevelTestState(saved) {
  levelTestSubject = saved.adaptiveState?.selectedSubject || "수학";
  const savedTestMode = saved.adaptiveState?.testMode;
  const savedGrade = saved.selectedGrade || saved.adaptiveState?.selectedGrade || getSelectedGrade();
  const savedGradeRoute = isGradeRangeDiagnosisMode(savedTestMode)
    ? window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS?.buildGradeTestSession({ selectedGrade: savedGrade, generatedConceptBanks: window.generatedConceptBanks })
    : null;
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  if (isGradeRangeDiagnosisMode(savedTestMode) && savedGradeRoute?.status === "READY") {
    quizScreen?.setAttribute("data-test-mode", gradeRangeDiagnosisMode);
    quizScreen?.setAttribute("data-grade-band", savedGradeRoute.gradeBand);
    quizScreen?.setAttribute("data-grade-bank-id", savedGradeRoute.bankId);
  }
  adaptiveQuestionPool = levelTestSubject === "수학"
    ? savedTestMode === middle3CycleTestMode
      ? buildMiddle3CycleQuestionPool()
      : isGradeRangeDiagnosisMode(savedTestMode) && savedGradeRoute?.status === "READY"
        ? [...savedGradeRoute.questions]
        : buildMiddle3BasicQuestionPool()
    : buildSubjectDiagnosticPool(levelTestSubject, {
        mode: savedTestMode === "english-grade" ? "grade" : "adaptive",
        selectedGrade: savedGrade,
      });
  const quizTitle = document.querySelector("#quizTitle");
  if (quizTitle) quizTitle.textContent = levelTestSubject === "수학"
    ? savedTestMode === middle3CycleTestMode ? "중3 수학 연속 레벨테스트"
      : isGradeRangeDiagnosisMode(savedTestMode) ? `${savedGrade} 수학 레벨테스트` : "중3 수학 세부 레벨테스트"
    : `${levelTestSubject} 레벨테스트`;
  activeQuestions = saved.activeQuestions || [];
  selectedAnswers = saved.answers || saved.selectedAnswers || [];
  let savedQuestionIndex = Number.isInteger(saved.currentQuestionIndex)
    ? saved.currentQuestionIndex
    : Number.isInteger(saved.currentQuestion) ? saved.currentQuestion : activeQuestions.length - 1;
  if (savedTestMode === middle3CycleTestMode) {
    const restoredMemory = ensureMiddle3LevelTestMemory();
    savedQuestionIndex = window.STUDY_MATH_CLOUD_SYNC?.calculateRemoteCurrentQuestion({
      memory: restoredMemory,
      resumeState: saved,
    }) ?? savedQuestionIndex;
    selectedAnswers = selectedAnswers.slice(0, savedQuestionIndex);
  }
  currentQuestion = Math.min(savedQuestionIndex, activeQuestions.length - 1);
  questionNumber = activeQuestions.length;
  answeredQuestionIds = new Set(saved.answeredQuestionIds || activeQuestions.map((question) => question.id));
  adaptiveState = saved.adaptiveState || createAdaptiveState();
  if (savedTestMode === middle3CycleTestMode) {
    middle3LevelTestMemory = ensureMiddle3LevelTestMemory();
    const engine = window.STUDY_LEVEL_TEST_ENGINE;
    if (middle3LevelTestMemory) {
      engine?.resumeSession(middle3LevelTestMemory);
      engine?.seedRecentHistoryFromBootstrap(middle3LevelTestMemory);
      const cycle = middle3LevelTestMemory.activeCycle;
      const current = activeQuestions[currentQuestion];
      const bootstrapResults = middle3LevelTestMemory.bootstrap?.results || [];
      const currentStructure = current ? engine?.structureSignature(current) : "";
      const repeatsBootstrap = current && bootstrapResults.some((result) => {
        const savedStructure = result.structureSignature || result.fingerprint;
        return result.problemId === current.id || (savedStructure && savedStructure === currentStructure);
      });
      if (cycle?.number === 1 && cycle.answers?.length === 0 && repeatsBootstrap) {
        const replacement = engine?.selectNextProblem(middle3LevelTestMemory, adaptiveQuestionPool);
        if (replacement) {
          answeredQuestionIds.delete(current.id);
          activeQuestions[currentQuestion] = replacement;
          selectedAnswers[currentQuestion] = "";
          answeredQuestionIds.add(replacement.id);
          saveLevelTestState();
        }
      }
    }
  }
  timedOutQuestions = activeQuestions.filter((question) => (saved.timedOutQuestionIds || []).includes(question.id));
  unknownQuestions = activeQuestions.filter((question) => (saved.unknownQuestionIds || []).includes(question.id));
  wrongQuestions = activeQuestions.filter((question) => (saved.wrongQuestionIds || []).includes(question.id));
  reviewMode = false;
  startTimer(saved.remainingSeconds || 20 * 60);
  renderQuestion();
}

function showResumeScreen(saved) {
  if (saved.adaptiveState?.testMode === middle3CycleTestMode) {
    const memory = ensureMiddle3LevelTestMemory();
    const cycle = memory?.activeCycle;
    const answered = cycle?.answers?.length || 0;
    const target = cycle?.targetSize || window.STUDY_LEVEL_TEST_ENGINE?.DEFAULT_CYCLE_SIZE || 24;
    const savedQuestion = saved.activeQuestions?.[saved.currentQuestion] || saved.activeQuestions?.at(-1);
    const savedAt = new Date(saved.savedAt);
    const ageDays = Math.floor((Date.now() - savedAt.getTime()) / 86400000);
    resumeProgress.style.width = `${Math.round((answered / target) * 100)}%`;
    resumePercent.textContent = `사이클 ${cycle?.number || memory?.cycleNumber || 1} · ${answered}/${target}`;
    resumeChecked.textContent = "중3 수학 전 과정";
    resumeFocus.textContent = savedQuestion?.concept || "저장된 문제부터 계속";
    resumeSavedAt.textContent = ageDays >= staleResumeDays
      ? "30일 이상 지나 현재 실력과 다를 수 있어요."
      : `${Math.max(0, ageDays)}일 전에 저장`;
    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === "resume-test");
    });
    return;
  }
  const checked = Object.entries(saved.adaptiveState?.scores || {})
    .filter(([, stats]) => stats.attempts > 0)
    .map(([domain]) => domain);
  const savedAt = new Date(saved.savedAt);
  const ageDays = Math.floor((Date.now() - savedAt.getTime()) / 86400000);
  const staleCopy = ageDays >= staleResumeDays ? "30일 이상 지나 현재 실력과 다를 수 있어요." : `${Math.max(0, ageDays)}일 전에 저장`;

  resumeProgress.style.width = `${saved.adaptiveState?.confidence || 0}%`;
  resumePercent.textContent = `AI 분석 ${saved.adaptiveState?.confidence || 0}%`;
  resumeChecked.textContent = checked.length ? checked.join(", ") : "분석 시작";
  resumeFocus.textContent = saved.adaptiveState?.focusDomain || "분수";
  resumeSavedAt.textContent = staleCopy;
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === "resume-test");
  });
}

function resetLevelTest(selectedGradeOverride = "") {
  levelTestSubject = "수학";
  localStorage.setItem("studyCoinLevelTestSubject", levelTestSubject);
  const selectedGrade = selectedGradeOverride || getConfiguredGradeForRangeDiagnosis();
  if (!selectedGrade) {
    showScreen("profile-setup");
    return { status: "GRADE_SELECTION_REQUIRED" };
  }
  const gradeBanks = window.STUDY_MATH_LEVEL_TEST_GRADE_BANKS;
  const gradeBand = gradeBanks?.normalizeGradeBand(selectedGrade);
  const elective = localStorage.getItem("studyCoinMathHighSchoolElective") || null;
  const route = gradeBanks?.buildGradeTestSession({ selectedGrade, elective, generatedConceptBanks: window.generatedConceptBanks });
  const quizScreen = document.querySelector('[data-screen="quiz"]');
  quizScreen?.classList.remove("elite-mode");
  if (!route || route.status !== "READY") {
    quizScreen?.setAttribute("data-test-mode", "test-bank-not-ready");
    adaptiveQuestionPool = [];
    answeredQuestionIds = new Set();
    adaptiveState = createAdaptiveState(selectedGrade, ["수학"]);
    adaptiveState.selectedSubject = "수학";
    adaptiveState.selectedGrade = selectedGrade;
    adaptiveState.testMode = "test-bank-not-ready";
    adaptiveState.bankStatus = "TEST_BANK_NOT_READY";
    adaptiveState.feedback = route?.message || "선택한 학년의 수학 레벨테스트를 준비하고 있습니다.";
    activeQuestions = [];
    selectedAnswers = [];
    currentQuestion = 0;
    questionNumber = 1;
    const quizTitle = document.querySelector("#quizTitle");
    const quizQuestionElement = document.querySelector("#quizProblem");
    const quizRouteElement = document.querySelector("#quizRoute");
    const quizChoicesElement = document.querySelector("#answerList");
    if (quizTitle) quizTitle.textContent = `${selectedGrade} 수학 레벨테스트`;
    if (quizQuestionElement) quizQuestionElement.textContent = route?.message || "선택한 학년의 수학 레벨테스트를 준비하고 있습니다.";
    if (quizRouteElement) quizRouteElement.textContent = "다른 학년 문제로 임의 전환하지 않습니다.";
    if (quizChoicesElement) quizChoicesElement.innerHTML = "";
    return route;
  }

  if (gradeBand === "M3") {
    const memory = ensureMiddle3LevelTestMemory();
    if (memory?.bootstrap?.completed) {
      startMiddle3Cycle();
      return route;
    }
    quizScreen?.setAttribute("data-test-mode", middle3BasicTestMode);
    adaptiveQuestionPool = [...route.questions];
    answeredQuestionIds = new Set();
    adaptiveState = createAdaptiveState(selectedGrade, middle3BasicUnitOrder);
    adaptiveState.selectedSubject = "수학";
    adaptiveState.selectedGrade = selectedGrade;
    adaptiveState.testMode = middle3BasicTestMode;
    adaptiveState.representativeQueue = [];
    adaptiveState.prerequisiteQueue = [];
    adaptiveState.totalQuestions = adaptiveQuestionPool.length;
    adaptiveState.feedback = "중3 8개 단원을 세부 개념별로 확인합니다.";
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
    if (quizTitle) quizTitle.textContent = "중3 수학 세부 레벨테스트";
    addNextAdaptiveQuestion();
    startTimer(memory?.session?.elapsedSeconds || 0);
    renderQuestion();
    return route;
  }

  quizScreen?.setAttribute("data-test-mode", gradeRangeDiagnosisMode);
  quizScreen?.setAttribute("data-grade-band", gradeBand);
  quizScreen?.setAttribute("data-grade-bank-id", route.bankId);
  adaptiveQuestionPool = [...route.questions];
  answeredQuestionIds = new Set();
  const gradeDomains = [...new Set(adaptiveQuestionPool.map((question) => question.domain))];
  adaptiveState = createAdaptiveState(selectedGrade, gradeDomains);
  adaptiveState.selectedSubject = "수학";
  adaptiveState.selectedGrade = selectedGrade;
  adaptiveState.selectedGradeBand = gradeBand;
  adaptiveState.selectedGradeBankId = route.bankId;
  adaptiveState.testGradeBand = gradeBand;
  adaptiveState.testMode = gradeRangeDiagnosisMode;
  adaptiveState.representativeQueue = [];
  adaptiveState.prerequisiteQueue = [];
  adaptiveState.totalQuestions = adaptiveQuestionPool.length;
  adaptiveState.feedback = `${selectedGrade} 문제은행에서 ${adaptiveQuestionPool.length}문항을 확인합니다.`;
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
  if (quizTitle) quizTitle.textContent = `${selectedGrade} 수학 레벨테스트`;
  addNextAdaptiveQuestion();
  startTimer(20 * 60);
  renderQuestion();
  return route;
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
    feedback: "상위권 심화 사고력을 확인하고 있습니다.",
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
    "초등 4학년": 4,
    "초등 5학년": 5,
    "초등 6학년": 6,
    "중등 1학년": 7,
    "중등 2학년": 8,
    "중등 3학년": 9,
    "고등 1학년": 10,
    "고등 2학년": 11,
    "고등 3학년": 12,
  };
  const selectedGrade = eliteAdvancedQuestionTemplates[grade] ? grade : "중등 2학년";
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
    explanation: `${concept} 심화 문제입니다. 정답은 ${answer}입니다.`,
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
  const isUnknown = answer === "모름";
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
  stats.masteryStage = stats.confidence >= 85 ? "최상위권 통과" : stats.confidence >= 60 ? "심화 도전" : "추가 확인";
  eliteState.confidence = stats.confidence;
  eliteState.history.push({ id: question.id, concept: question.concept, answer, correct: isCorrect, unknown: isUnknown, solveSeconds });
  eliteState.strongDomains = stats.confidence >= 75 ? ["엘리트 사고력"] : [];
  eliteState.weakDomains = !isCorrect ? [question.concept] : [];
  eliteState.weakDomain = eliteState.weakDomains[0] || "";
  eliteState.feedback = isCorrect
    ? "좋아요! 다음 심화 레벨로 올려볼게요."
    : "이 유형은 한 단계 낮춰 핵심 사고 과정을 다시 확인할게요.";
}

function shouldFinishEliteTest() {
  const stats = eliteState.scores["엘리트 사고력"];
  return stats.attempts >= 8 && (stats.confidence >= 85 || eliteQuestionPool.every((question) => answeredQuestionIds.has(question.id)));
}

function addNextAdaptiveQuestion() {
  const next = selectNextAdaptiveQuestion();
  if (!next) return false;

  const previous = activeQuestions[activeQuestions.length - 1];
  if (isMiddle3CycleLevelTest() && previous?.cycleNumber && next.cycleNumber !== previous.cycleNumber) {
    activeQuestions = [];
    selectedAnswers = [];
    answeredQuestionIds = new Set();
    timedOutQuestions = [];
    unknownQuestions = [];
    wrongQuestions = [];
  }

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
  const plan = gradePlans[grade] || gradePlans["초등 1학년"];

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
      explanation: `${concept} 문제입니다. 선택지 중 정답은 ${answer}입니다. 이 문항이 어렵다면 먼저 ${getStableFromBank(bank)} 개념을 다시 확인하세요.`,
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
    g1: "초등 1학년 수 개념·덧셈·뺄셈",
    g2: "초등 2학년 자릿값·곱셈구구",
    g3: "초등 3학년 나눗셈·분수와 소수",
    g4: "초등 4학년 큰 수·각도·분수와 소수 계산",
    g5: "초등 5학년 약수와 배수·약분과 통분·분수 곱셈",
    g6: "초등 6학년 비율·분수 나눗셈·입체도형",
    m1: "중등 1학년 핵심 개념",
    m2: "중등 2학년 핵심 개념",
    m3: "중등 3학년 핵심 개념",
    h1: "고등 공통수학",
    h2: "고등 수학 I·II",
    h3: "고등 미적분·확률과 통계",
  };

  return labels[bank] || "선수 개념";
}

function getWrongEntries() {
  return activeQuestions
    .map((question, index) => ({
      question,
      index,
      selected: selectedAnswers[index],
    }))
    .filter((entry) => entry.selected && !isGiveUpAnswer(entry.selected) && entry.selected !== entry.question.answer);
}

function getUnknownCount() {
  return selectedAnswers.filter((answer) => isGiveUpAnswer(answer)).length;
}

function renderWrongReview(entries) {
  wrongReviewSummary.textContent = `오답 ${entries.length}개`;

  if (!entries.length) {
    wrongReviewList.innerHTML = `<li class="empty">오답 문항이 없습니다. 모름이나 시간 부족 문항은 레벨 판단에만 반영했어요.</li>`;
    return;
  }

  wrongReviewList.innerHTML = entries.map(({ question, index, selected }) => `
    <li>
      <button type="button" data-review-index="${index}">
        <b>${index + 1}번 · ${question.concept}</b>
        <span>내 답: ${selected} / 정답: ${question.answer}</span>
        <span>${question.explanation}</span>
      </button>
    </li>
  `).join("");
}

function renderReviewExplanation(question, selected) {
  reviewExplanation.innerHTML = `
    <h3>${currentQuestion + 1}번 풀이</h3>
    <p><b>내 답:</b> ${selected || "선택 없음"}</p>
    <p><b>정답:</b> ${question.answer}</p>
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

function getEstimatedRank() {
  if (!activeQuestions.length) return null;
  const correctRanks = activeQuestions
    .map((question, index) => ({ question, answer: selectedAnswers[index] }))
    .filter(({ question, answer }) => answer === question.answer)
    .map(({ question }) => question.rank);
  const fallbackRank = activeQuestions[Math.max(0, activeQuestions.length - 1)].rank;
  return correctRanks.length ? Math.round(correctRanks.reduce((sum, value) => sum + value, 0) / correctRanks.length) : fallbackRank;
}

function getEstimatedLevel() {
  if (isMiddle3BasicLevelTest()) return "중3 기본과정";
  const rank = getEstimatedRank();
  if (!rank) return "분석 중";
  if (levelTestSubject === "영어") {
    const levelId = `EN-L${String(Math.max(1, Math.min(12, rank))).padStart(2, "0")}`;
    const level = window.ENGLISH_MASTER_LEVELS?.find((item) => item.levelId === levelId);
    return level ? `${level.levelTitle} · ${level.cefrApprox}` : levelId;
  }
  const closest = Object.values(bankAdaptiveMeta).reduce((best, meta) => {
    return Math.abs(meta.rank - rank) < Math.abs(best.rank - rank) ? meta : best;
  }, bankAdaptiveMeta.g4);

  return closest.levelLabel;
}

function getEnglishPlacementLevelId() {
  const rank = getEstimatedRank();
  return `EN-L${String(Math.max(1, Math.min(12, rank || 1))).padStart(2, "0")}`;
}

function getRecommendedPath() {
  if (isMiddle3BasicLevelTest()) {
    const reviewUnits = getMiddle3BasicUnitSummaries()
      .filter((summary) => !summary.passed)
      .map((summary) => `${summary.unit} 기본 복습`);
    return reviewUnits.length ? reviewUnits : ["중3 기본과정 완료", "중3 심화 과정 준비"];
  }
  if (levelTestSubject === "영어") {
    const levelId = getEnglishPlacementLevelId();
    const courses = window.STUDY_SUBJECT_CONTENT?.english?.stages || [];
    const titles = courses.filter((course) => course.levelId === levelId).slice(0, 3).map((course) => course.title);
    return titles.length ? titles : ["어휘", "문법", "독해"];
  }
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
  const start = wrongQuestion ? wrongQuestion.start : unansweredIndex >= 0 ? weakQuestion.start : hesitationQuestion ? hesitationQuestion.concept : "다음 단계 심화";
  const score = Math.max(0, Math.round(((activeQuestions.length - wrongEntries.length - unknownCount) / activeQuestions.length) * 100 - timedOutQuestions.length * 4 - (unansweredIndex >= 0 ? 8 : 0)));

  const estimatedLevel = getEstimatedLevel();
  const middle3Summaries = isMiddle3BasicLevelTest() ? getMiddle3BasicUnitSummaries() : [];
  const strong = isMiddle3BasicLevelTest()
    ? middle3Summaries.filter((summary) => summary.passed).map((summary) => summary.unit)
    : adaptiveState.strongDomains.length ? adaptiveState.strongDomains : [levelTestSubject === "영어" ? "기초 개념" : "계산"];
  const weak = isMiddle3BasicLevelTest()
    ? middle3Summaries.filter((summary) => !summary.passed).map((summary) => summary.unit)
    : adaptiveState.weakDomains.length ? adaptiveState.weakDomains : [weakQuestion.domain];
  const path = getRecommendedPath();

  resultLevel.textContent = estimatedLevel;
  resultStartCopy.textContent = wrongEntries.length
    ? `${wrongQuestion.concept}에서 오답이 있었어요. 이 개념부터 다시 확인하면 좋아요.`
    : unknownCount
    ? `${weakQuestion.concept}에서 포기를 선택했어요. 필요한 기본 개념부터 다시 확인하면 좋아요.`
    : unansweredIndex >= 0
      ? `${weakQuestion.concept}까지 풀지 못했어요. ${start}부터 다시 확인하면 좋아요.`
    : timedOutQuestions.length
      ? `${hesitationQuestion.concept}에서 시간이 오래 걸렸어요. 오답은 아니고, 헷갈리는 개념으로 기록할게요.`
      : `${weakQuestion.concept}까지 안정적으로 진단됐어요. 다음 단계부터 이어가면 좋아요.`;
  stableZone.textContent = stable;
  startLevel.textContent = start;
  blockedConcept.textContent = wrongQuestion?.concept || hesitationQuestion?.concept || weakQuestion.concept;
  resultTotal.textContent = isMiddle3BasicLevelTest() ? `${middle3BasicUnitOrder.length}단계 완료` : "AI 분석 완료";
  stableZone.textContent = `${score}점`;
  wrongCount.textContent = `${wrongEntries.length}개`;
  startLevel.textContent = `${unknownCount + timedOutQuestions.length}개`;
  strongDomains.textContent = strong.length ? strong.join(", ") : "통과 단원 없음";
  weakDomains.textContent = weak.length ? weak.join(", ") : "전 단원 기본 통과";
  confidenceDomains.textContent = isMiddle3BasicLevelTest()
    ? middle3Summaries.map((summary) => `${summary.stage}단계 ${summary.correct}/${middle3BasicQuestionsPerUnit}`).join(" · ")
    : Object.entries(adaptiveState.scores)
      .filter(([, stats]) => stats.attempts > 0)
      .sort((a, b) => b[1].confidence - a[1].confidence)
      .slice(0, 5)
      .map(([domain, stats]) => `${domain} ${stats.confidence}%`)
      .join(" · ");
  masteryDomains.textContent = isMiddle3BasicLevelTest()
    ? middle3Summaries.map((summary) => `${summary.unit}: ${summary.passed ? "기본 통과" : "보완 필요"}`).join(" · ")
    : Object.entries(adaptiveState.scores)
      .filter(([, stats]) => stats.attempts > 0)
      .sort((a, b) => b[1].attempts - a[1].attempts)
      .slice(0, 5)
      .map(([domain, stats]) => `${domain}: ${stats.masteryStage}`)
      .join(" · ");
  learningPath.textContent = path.join(" → ");
  if (levelTestSubject === "수학") {
    const conceptResults = activeQuestions.map((question, index) => ({
      question,
      problemId: question.problemId || question.id,
      conceptId: question.conceptId,
      concept: question.concept,
      correct: Boolean(selectedAnswers[index]) && selectedAnswers[index] === question.answer,
      result: isGiveUpAnswer(selectedAnswers[index]) ? "GIVEUP"
        : Boolean(selectedAnswers[index]) && selectedAnswers[index] === question.answer ? "CORRECT" : "INCORRECT",
      misconceptionTags: question.misconceptionTags || [],
      structureSignature: question.structureSignature || `level-test:${question.id}:structure`,
      solutionPathSignature: question.solutionPathSignature || `level-test:${question.id}:path`,
      difficulty: question.level || question.difficulty || "BASIC",
      independentCheck: question.independentCheck === true,
      submissionId: `level-test:${question.id}`,
      finalSubmission: true,
      timestamp: Date.now(),
    }));
    window.dispatchEvent(new CustomEvent("study:math-level-test-completed", {
      detail: { results: conceptResults, selectedGrade: getSelectedGrade(), testGradeBand: getSelectedGrade(), timestamp: Date.now() },
    }));
    resultLevel.textContent = "개념 진단";
  }
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
  if (levelTestSubject === "영어") {
    const weakGrammarIds = [...new Set(wrongQuestions.map((question) => question.grammarId || question.targetGrammarId).filter(Boolean))];
    const weakVocabularyIds = [...new Set(wrongQuestions.map((question) => question.vocabularyId || question.targetVocabularyId).filter(Boolean))];
    const readingAttempts = activeQuestions.filter((question) => /reading|comprehension/i.test(`${question.domain || ""} ${question.concept || ""}`));
    const readingCorrect = readingAttempts.filter((question) => !wrongQuestions.includes(question) && !unknownQuestions.includes(question)).length;
    document.dispatchEvent(new CustomEvent("study:english-placement", {
      detail: {
        levelId: getEnglishPlacementLevelId(),
        weakGrammarIds,
        weakVocabularyIds,
        readingConfidence: readingAttempts.length ? Math.round((readingCorrect / readingAttempts.length) * 100) : 50,
        inferenceEvidenceCount: activeQuestions.filter((question) => /inference|추론/i.test(`${question.concept || ""} ${question.prompt || ""}`) && !wrongQuestions.includes(question)).length,
        timestamp: Date.now(),
      },
    }));
  }
}

function renderConceptMap(weakQuestion) {
  if (isMiddle3BasicLevelTest()) {
    conceptMapList.innerHTML = getMiddle3BasicUnitSummaries().map((summary) => {
      const stateClass = summary.passed ? "ok" : "warn";
      const stateText = summary.passed ? "기본 통과" : `${summary.correct}/${middle3BasicQuestionsPerUnit} 정답`;
      return `<li class="${stateClass}"><b>${summary.stage}단계 · ${summary.unit}</b><span>${stateText}</span></li>`;
    }).join("");
    return;
  }

  const orderedBanks = [...new Set(activeQuestions.map((question) => question.bank))];
  const weakBankIndex = orderedBanks.indexOf(weakQuestion.bank);

  conceptMapList.innerHTML = orderedBanks.map((bank, index) => {
    const label = getStableFromBank(bank);

    if (index < weakBankIndex) {
      return `<li class="ok"><b>${label}</b><span>안정</span></li>`;
    }

    if (index === weakBankIndex) {
      return `<li class="warn"><b id="blockedConcept">${weakQuestion.concept}</b><span>헷갈린 개념</span></li>`;
    }

    return `<li><b>${label}</b><span>이후 진단 구간</span></li>`;
  }).join("");
}

function startTimer(seconds) {
  clearInterval(timerId);
  remainingSeconds = seconds;
  if (isContinuousMiddle3LevelTest() || isAdaptiveConceptDiagnosis()) {
    timeLabel.textContent = "학습 시간";
    timeLeft.textContent = formatTime(remainingSeconds);
    timerId = setInterval(() => {
      remainingSeconds += 1;
      timeLeft.textContent = formatTime(remainingSeconds);
    }, 1000);
    return;
  }
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
  toastTitle.textContent = "전체 시간이 끝났어요";
  toastCopy.textContent = "남은 문항은 풀지 못한 것으로 두고 결과를 정리할게요.";
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

setupLevelStart?.addEventListener("click", () => startSubjectLevelTest(levelTestSubject, levelTestSubject === "수학" || levelTestSubject === "영어" ? "adaptive" : "grade"));
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
    const adaptiveMathButton = testSubjectModal?.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]');
    const gradeMathButton = testSubjectModal?.querySelector('[data-test-subject="수학"][data-math-test-mode="grade"]');
    if (adaptiveMathButton) adaptiveMathButton.textContent = pendingTestMode === "elite" ? "수학" : "맞춤형 수학 진단";
    if (gradeMathButton) gradeMathButton.hidden = pendingTestMode === "elite";
    testSubjectModal?.classList.remove("hidden");
  });
});

document.querySelectorAll("[data-test-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    const subject = button.dataset.testSubject;
    const selectedTestMode = pendingTestMode;
    pendingTestMode = "standard";
    closeTestSubjectModal();
    if (selectedTestMode === "elite") {
      document.dispatchEvent(new CustomEvent("study:start-elite-test", { detail: { subject } }));
      return;
    }
    startSubjectLevelTest(subject, subject === "수학"
      ? button.dataset.mathTestMode || "adaptive"
      : subject === "영어"
        ? button.dataset.englishTestMode || "adaptive"
        : "grade");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest("#continueLearningAfterTest") || !adaptiveLevelTestResultPending) return;
  const { session, result } = adaptiveLevelTestResultPending;
  const startConceptId = window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI?.selectLearningStart(result) || null;
  window.dispatchEvent(new CustomEvent("study:math-level-test-completed", {
    detail: {
      results: adaptiveEvidenceResults(session),
      activeConceptId: startConceptId,
      testGradeBand: session.currentGradeGate,
      timestamp: Date.now(),
    },
  }));
  adaptiveLevelTestResultPending = null;
}, true);

testSubjectClose?.addEventListener("click", closeTestSubjectModal);
testSubjectModal?.addEventListener("click", (event) => {
  if (event.target === testSubjectModal) closeTestSubjectModal();
});

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => event.preventDefault());
});

async function handleSignup() {
  const name = studentName.value.trim() || "학생";
  const userId = normalizeAuthIdentifier(signupUser.value);
  const password = signupPassword.value.trim();
  const role = getSelectedRole();

  signupError.classList.add("hidden");
  signupSuccess.classList.add("hidden");

  if (!isValidEmail(userId) || password.length < 6) {
    signupError.textContent = "올바른 이메일과 6자리 이상 비밀번호를 입력해 주세요.";
    signupError.classList.remove("hidden");
    return;
  }

  const users = getAuthUsers();
  if (users[userId]) {
    signupError.textContent = "이미 가입된 이메일이에요. 로그인해 주세요.";
    signupError.classList.remove("hidden");
    return;
  }

  signupButton.disabled = true;
  try {
    if (window.STUDY_CLOUD_AUTH?.isConfigured) {
      const account = await window.STUDY_CLOUD_AUTH.signUpWithEmail(userId, password, { name, role });
      storeAuthenticatedAccount(account, { name, role, email: userId, provider: "password" });
    } else {
      users[userId] = {
        id: userId,
        email: userId,
        name,
        role,
        password,
        provider: "local",
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      };
      saveAuthUsers(users);
    }
  } catch (error) {
    signupError.textContent = authErrorMessage(error, "회원가입");
    signupError.classList.remove("hidden");
    return;
  } finally {
    signupButton.disabled = false;
  }

  const savedUser = getAuthUsers()[userId];
  if (!savedUser) {
    signupError.textContent = "회원가입 저장에 실패했어요. 다시 시도해 주세요.";
    signupError.classList.remove("hidden");
    return;
  }

  setCurrentUser(userId);
  saveLearningSettings();

  profileName.value = name;
  updateHomeProfile();
  loginUser.value = userId;
  loginPassword.value = password;
  signupSuccess.textContent = window.STUDY_CLOUD_AUTH?.isConfigured
    ? "회원가입이 완료됐어요. 다른 브라우저에서도 같은 이메일로 로그인할 수 있어요."
    : "임시 회원가입이 완료됐어요. Firebase 연결 전에는 이 브라우저에만 저장됩니다.";
  signupSuccess.classList.remove("hidden");
  setTimeout(() => showScreen("profile-setup"), 250);
}

signupButton.addEventListener("click", handleSignup);

async function handleSocialAuth(provider, button) {
  signupError.classList.add("hidden");
  signupSuccess.classList.add("hidden");

  if (typeof window.STUDY_CLOUD_AUTH?.signInWithProvider !== "function") {
    signupError.textContent = `${provider} 로그인 연동 설정이 아직 필요해요. Firebase 또는 인증 서버 설정을 연결한 뒤 사용할 수 있어요.`;
    signupError.classList.remove("hidden");
    return;
  }

  button.disabled = true;
  try {
    const account = await window.STUDY_CLOUD_AUTH.signInWithProvider(provider);
    if (!account?.id) throw new Error("missing-account");

    storeAuthenticatedAccount(account, { provider });
    setCurrentUser(account.id);
    await hydrateMiddle3LevelTestFromCloud();
    routeAfterLogin({ restoreScreen: false });
  } catch (error) {
    signupError.textContent = error?.message === "missing-account"
      ? `${provider}에서 계정 정보를 받지 못했어요. 다시 시도해 주세요.`
      : authErrorMessage(error, `${provider} 로그인`);
    signupError.classList.remove("hidden");
  } finally {
    button.disabled = false;
  }
}

signupKakaoButton?.addEventListener("click", () => handleSocialAuth("카카오", signupKakaoButton));
signupNaverButton?.addEventListener("click", () => handleSocialAuth("네이버", signupNaverButton));

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

loginButton.addEventListener("click", async () => {
  const userId = normalizeAuthIdentifier(loginUser.value);
  const password = loginPassword.value.trim();
  const resolvedAccount = resolveStoredAccount(userId);
  let localUserId = resolvedAccount?.userId || userId;
  let user = resolvedAccount?.user;

  hideLoginRecovery();

  if (isValidEmail(userId) && window.STUDY_CLOUD_AUTH?.isConfigured) {
    loginButton.disabled = true;
    try {
      let account;
      try {
        account = await window.STUDY_CLOUD_AUTH.signInWithEmail(userId, password);
      } catch (error) {
        if (!user || user.password !== password) throw error;
        account = await window.STUDY_CLOUD_AUTH.signUpWithEmail(userId, password, {
          name: user.name || "학생",
          role: user.role || "student",
        });
      }

      copyAccountScopedStorage(localUserId, account.id);
      user = storeAuthenticatedAccount(account, {
        name: user?.name,
        role: user?.role,
        email: userId,
        provider: "password",
      });
      if (localUserId !== account.id && getAuthUsers()[localUserId]) {
        const linkedUsers = getAuthUsers();
        linkedUsers[localUserId] = { ...linkedUsers[localUserId], email: account.id, migratedTo: account.id };
        saveAuthUsers(linkedUsers);
      }
      loginError.classList.add("hidden");
      setCurrentUser(account.id);
      await hydrateMiddle3LevelTestFromCloud();
      if (user?.name) {
        profileName.value = user.name;
        updateHomeProfile();
      }
      routeAfterLogin({ restoreScreen: false });
      return;
    } catch (error) {
      loginError.textContent = authErrorMessage(error);
      loginError.classList.remove("hidden");
      return;
    } finally {
      loginButton.disabled = false;
    }
  }

  if (!user) {
    loginError.textContent = hasRecoverableAccountData(userId)
      ? "계정 정보는 사라졌지만 이 브라우저에서 기존 학습 기록을 찾았어요. 아래 버튼으로 복구해 주세요."
      : "이 브라우저에 저장된 계정을 찾지 못했어요. 다른 브라우저의 계정은 클라우드 인증 연결 후 사용할 수 있어요.";
    if (hasRecoverableAccountData(userId)) recoverLoginButton?.classList.remove("hidden");
    loginError.classList.remove("hidden");
    return;
  }

  if (user.password !== password) {
    loginError.textContent = "비밀번호가 일치하지 않아요. 기존 학습 기록을 유지한 채 비밀번호를 재설정할 수 있어요.";
    if (recoverLoginButton) recoverLoginButton.textContent = "기존 기록 유지하고 비밀번호 재설정";
    recoverLoginButton?.classList.remove("hidden");
    loginError.classList.remove("hidden");
    return;
  }

  loginError.classList.add("hidden");
  setCurrentUser(localUserId);
  if (user.name) {
    profileName.value = user.name;
    updateHomeProfile();
  }
  routeAfterLogin({ restoreScreen: false });
});

recoverLoginButton?.addEventListener("click", () => {
  const userId = normalizeAuthIdentifier(loginUser.value);
  const password = loginPassword.value.trim();
  const resolvedAccount = resolveStoredAccount(userId);
  const recoveryUserId = resolvedAccount?.userId || userId;

  if (!userId || password.length < 4 || !hasRecoverableAccountData(userId)) {
    loginError.textContent = "아이디와 4자리 이상의 새 비밀번호를 입력한 뒤 다시 시도해 주세요.";
    loginError.classList.remove("hidden");
    return;
  }

  const users = getAuthUsers();
  const profile = readRecoverableProfile(recoveryUserId);
  users[recoveryUserId] = users[recoveryUserId] ? {
    ...users[recoveryUserId],
    password,
    recoveredAt: new Date().toISOString(),
  } : {
    id: recoveryUserId,
    name: String(profile.name || recoveryUserId),
    role: String(profile.role || "student"),
    password,
    onboardingComplete: true,
    recoveredAt: new Date().toISOString(),
  };

  saveAuthUsers(users);
  setCurrentUser(recoveryUserId);
  loginError.classList.add("hidden");
  hideLoginRecovery();
  routeAfterLogin({ restoreScreen: false });
});

[loginUser, loginPassword].forEach((input) => {
  input?.addEventListener("input", hideLoginRecovery);
});

window.STUDY_AUTH_PRIMARY_READY = true;

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

async function restoreMiddle3QuizFromRemote() {
  const hydrated = await hydrateMiddle3LevelTestFromCloud({ force: true });
  if (!hydrated) return false;
  const saved = getSavedLevelTest();
  if (saved?.adaptiveState?.selectedSubject === "수학") restoreLevelTestState(saved);
  return true;
}

async function prepareMiddle3CloudSubmission(question) {
  if (!isMiddle3CycleLevelTest() || !mathCloudSyncRequired()) {
    return { ready: true, requiresCloudCommit: false };
  }
  if (!mathCloudHydrationReady()) return { ready: false, reason: "HYDRATION_NOT_READY" };
  const cloud = window.STUDY_CLOUD_AUTH;
  const remote = await cloud.loadUserState(middle3CloudStateKey).catch(() => null);
  if (!remote) {
    middle3CloudHydrationStatus = "FAILED";
    return { ready: false, reason: "REMOTE_STATE_MISSING" };
  }
  const normalizedRemote = window.STUDY_MATH_CLOUD_SYNC?.normalizeRemoteMathState(remote) || remote;
  const remoteSummary = window.STUDY_MATH_CLOUD_SYNC?.describeMathState(normalizedRemote);
  const localCycle = middle3LevelTestMemory?.activeCycle;
  const remoteResume = normalizedRemote.resumeState || normalizedRemote.longTermState?.resumeState || {};
  const remoteQuestion = remoteResume.activeQuestions?.[remoteSummary?.currentQuestion];
  const matchesRemote = remoteSummary
    && remoteSummary.cycleId === String(localCycle?.id || "")
    && remoteSummary.answersCount === (localCycle?.answers?.length || 0)
    && remoteSummary.currentQuestion === currentQuestion
    && String(remoteQuestion?.id || remoteQuestion?.questionId || "") === String(question?.id || question?.questionId || "")
    && (!middle3CloudRemoteRevision || remoteSummary.updatedAt === middle3CloudRemoteRevision);
  if (!matchesRemote) {
    await restoreMiddle3QuizFromRemote();
    return { ready: false, reason: "REMOTE_REVISION_MISMATCH" };
  }
  return {
    ready: true,
    requiresCloudCommit: true,
    expectedAnswerCount: remoteSummary.answersCount,
    expectedCurrentQuestion: remoteSummary.currentQuestion,
    expectedUpdatedAt: remoteSummary.updatedAt,
    cycleId: remoteSummary.cycleId,
  };
}

async function commitMiddle3CloudSubmission(question, submissionId, base) {
  if (!base?.requiresCloudCommit) return true;
  const cloud = window.STUDY_CLOUD_AUTH;
  const nextState = buildMiddle3CloudPayload();
  if (!nextState || typeof cloud?.commitMathLevelTestAttempt !== "function") return false;
  const result = await cloud.commitMathLevelTestAttempt(middle3CloudStateKey, {
    nextState,
    cycleId: base.cycleId,
    problemId: String(question?.id || question?.questionId || ""),
    submissionId,
    expectedAnswerCount: base.expectedAnswerCount,
    expectedCurrentQuestion: base.expectedCurrentQuestion,
    expectedUpdatedAt: base.expectedUpdatedAt,
  }).catch(() => ({ committed: false, reason: "TRANSACTION_FAILED" }));
  if (!result?.committed) {
    await restoreMiddle3QuizFromRemote();
    return false;
  }
  middle3CloudRemoteRevision = String(result.updatedAt || nextState.updatedAt || "");
  localStorage.removeItem(middle3CloudQueueKey());
  return true;
}

function continueAfterQuestionSubmission() {
  if (!mathCloudHydrationReady()) return;
  if (currentQuestion < activeQuestions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  const testFinished = shouldFinishAdaptiveTest();
  const hasNextQuestion = testFinished ? false : addNextAdaptiveQuestion();
  if (testFinished && isMiddle3BasicLevelTest() && completeMiddle3Bootstrap()) return;
  if (!hasNextQuestion && isMiddle3CycleLevelTest()) {
    saveLevelTestState();
    isChecking = false;
    quizRoute.textContent = "새 문제를 준비하지 못했습니다. 현재 위치를 저장했어요.";
    return;
  }
  if (testFinished || !hasNextQuestion) {
    updateResultFromTest();
    clearSavedLevelTest();
    showScreen("result");
    return;
  }
  saveLevelTestState();
  renderQuestion();
}

answerList.addEventListener("click", (event) => {
  if (reviewMode) return;
  if (isAdaptiveConceptDiagnosis()) {
    const button = event.target.closest("[data-answer]");
    if (!button) return;
    selectedAnswer = button.dataset.answer;
    selectedAnswers[0] = selectedAnswer;
    answerList.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === button));
    quizToast.classList.add("hidden");
    return;
  }
  if (!mathCloudHydrationReady()) return;

  const button = event.target.closest("[data-answer]");
  if (!button) return;
  const question = activeQuestions[currentQuestion];
  if (isMathAttemptFinal(question)) return;

  selectedAnswer = button.dataset.answer;
  selectedAnswers[currentQuestion] = selectedAnswer;
  wrongQuestions = wrongQuestions.filter((item) => item !== question);
  unknownQuestions = unknownQuestions.filter((item) => item !== question);

  answerList.querySelectorAll("button").forEach((item) => {
    item.classList.remove("selected", "correct", "wrong");
  });

  button.classList.add("selected");
  quizToast.classList.add("hidden");
  nextQuestion.textContent = "다음 문제";
});

nextQuestion.addEventListener("click", async () => {
  if (reviewMode) return;
  if (isAdaptiveConceptDiagnosis()) {
    await submitAdaptiveLevelTestAnswer();
    return;
  }
  if (!mathCloudHydrationReady()) return;
  const question = activeQuestions[currentQuestion];
  if (isMathAttemptFinal(question)) {
    if (isChecking) return;
    isChecking = true;
    continueAfterQuestionSubmission();
    return;
  }
  if (!selectedAnswer || isChecking) return;

  isChecking = true;
  const submissionBase = await prepareMiddle3CloudSubmission(question);
  if (!submissionBase.ready) {
    isChecking = false;
    return;
  }
  middle3SubmissionCommitInProgress = Boolean(submissionBase.requiresCloudCommit);
  lastAnsweredQuestion = question;

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
  const submissionId = createSubmissionId();
  if (isMiddle3BasicLevelTest()) {
    const finalized = finalizeBootstrapAttempt(question, selectedAnswer, solveSeconds, submissionId);
    if (!finalized.created) {
      middle3SubmissionCommitInProgress = false;
      isChecking = false;
      continueAfterQuestionSubmission();
      return;
    }
  }
  const updateResult = updateAdaptiveState(question, selectedAnswer, solveSeconds, { submissionId });
  if (updateResult?.duplicate || updateResult?.rejected) {
    middle3SubmissionCommitInProgress = false;
    isChecking = false;
    continueAfterQuestionSubmission();
    return;
  }
  saveLevelTestState({ scheduleCloud: !submissionBase.requiresCloudCommit });
  const committed = await commitMiddle3CloudSubmission(question, submissionId, submissionBase);
  middle3SubmissionCommitInProgress = false;
  if (!committed) {
    isChecking = false;
    return;
  }
  continueAfterQuestionSubmission();
});

unknownQuestion.addEventListener("click", async () => {
  if (reviewMode) return;
  if (isAdaptiveConceptDiagnosis()) {
    await submitAdaptiveLevelTestAnswer({ giveup: true });
    return;
  }
  if (!mathCloudHydrationReady()) return;
  if (isChecking) return;

  const question = activeQuestions[currentQuestion];
  if (isMathAttemptFinal(question)) return;
  if (levelTestSubject === "수학") isChecking = true;
  const submissionBase = await prepareMiddle3CloudSubmission(question);
  if (!submissionBase.ready) {
    isChecking = false;
    return;
  }
  middle3SubmissionCommitInProgress = Boolean(submissionBase.requiresCloudCommit);
  wrongQuestions = wrongQuestions.filter((item) => item !== question);
  unknownQuestions = unknownQuestions.filter((item) => item !== question);
  unknownQuestions.push(question);
  selectedAnswers[currentQuestion] = "포기";
  selectedAnswer = "포기";

  const solveSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
  const submissionId = createSubmissionId();
  if (isMiddle3BasicLevelTest()) {
    const finalized = finalizeBootstrapAttempt(question, selectedAnswer, solveSeconds, submissionId);
    if (!finalized.created) {
      middle3SubmissionCommitInProgress = false;
      isChecking = false;
      continueAfterQuestionSubmission();
      return;
    }
  }
  const updateResult = updateAdaptiveState(question, selectedAnswer, solveSeconds, { submissionId });
  if (updateResult?.duplicate || updateResult?.rejected) {
    middle3SubmissionCommitInProgress = false;
    isChecking = false;
    continueAfterQuestionSubmission();
    return;
  }
  saveLevelTestState({ scheduleCloud: !submissionBase.requiresCloudCommit });
  const committed = await commitMiddle3CloudSubmission(question, submissionId, submissionBase);
  middle3SubmissionCommitInProgress = false;
  if (!committed) {
    isChecking = false;
    return;
  }
  continueAfterQuestionSubmission();
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

async function saveAndCloseLevelTest({ confirmStop = false } = {}) {
  if (isAdaptiveConceptDiagnosis()) {
    if (confirmStop && !window.confirm("현재 진단 위치를 저장하고 종료할까요?")) return;
    await adaptiveLevelTestController?.pause(Date.now());
    syncAdaptiveLevelTestView(adaptiveLevelTestController?.getSession());
    stopTimer();
    showScreen("home");
    return;
  }
  if (confirmStop && isContinuousMiddle3LevelTest()) {
    const shouldStop = window.confirm("현재 학습 위치를 저장하고 종료할까요?");
    if (!shouldStop) return;
  }
  if (isContinuousMiddle3LevelTest() && middle3LevelTestMemory) {
    window.STUDY_LEVEL_TEST_ENGINE?.markStopped(middle3LevelTestMemory, remainingSeconds);
    saveMiddle3LevelTestMemory();
  }
  saveLevelTestState();
  await Promise.race([
    syncMiddle3LevelTestToCloud().catch(() => false),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);
  stopTimer();
  showScreen("home");
}

pauseTest.addEventListener("click", () => saveAndCloseLevelTest({ confirmStop: true }));

quitTest?.addEventListener("click", () => {
  saveAndCloseLevelTest({ confirmStop: isContinuousMiddle3LevelTest() });
});

resumeTest.addEventListener("click", () => {
  if (adaptiveLevelTestResumeState) {
    adaptiveLevelTestController = createAdaptiveLevelTestController();
    adaptiveLevelTestController.restore(adaptiveLevelTestResumeState);
    adaptiveLevelTestController.resume(Date.now());
    syncAdaptiveLevelTestView(adaptiveLevelTestController.getSession());
    showScreen("quiz");
    startTimer(Math.round(Number(adaptiveState?.estimatedDuration || 0) * 60));
    renderAdaptiveLevelTestQuestion();
    return;
  }
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

restartTest.addEventListener("click", async () => {
  if (adaptiveLevelTestResumeState || isAdaptiveConceptDiagnosis()) {
    await startAdaptiveMathDiagnosis({ forceNew: true });
    return;
  }
  clearSavedLevelTest();
  localStorage.removeItem(middle3LevelTestMemoryKey());
  localStorage.removeItem(middle3CloudQueueKey());
  middle3LevelTestMemory = null;
  middle3LevelTestMemoryAccountKey = "";
  middle3CloudHydratedAccountKey = "";
  if (window.STUDY_CLOUD_AUTH?.stateSyncEnabled && typeof window.STUDY_CLOUD_AUTH.deleteUserState === "function") {
    await window.STUDY_CLOUD_AUTH.deleteUserState(middle3CloudStateKey).catch(() => false);
  }
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
  profileBasicToggle.textContent = open ? "기본정보 닫기" : "기본정보 수정";
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
    alert("공부방 이름, 과목, 학년 또는 수준을 입력해 주세요.");
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
document.addEventListener("click", async (event) => {
  const settingsButton = event.target.closest(".settings-trigger");
  const settingsPanel = event.target.closest(".settings-popover");
  const settingsLogout = event.target.closest("[data-settings-logout]");
  const settingsView = event.target.closest("[data-settings-view]");
  const settingsClose = event.target.closest("[data-settings-close]");
  const saveEmail = event.target.closest("[data-settings-save-email]");
  const savePassword = event.target.closest("[data-settings-save-password]");
  const saveSupport = event.target.closest("[data-settings-save-support]");

  if (settingsClose || event.target === document.querySelector("#appSettingsModal")) {
    closeAppSettings();
    return;
  }

  if (saveEmail) {
    const userId = getCurrentUser();
    const email = document.querySelector("#settingsAccountEmail")?.value || "";
    const currentPassword = document.querySelector("#settingsCurrentPassword")?.value || "";
    const status = document.querySelector("#settingsAccountStatus");

    if (!userId || !getAuthUsers()[userId]) {
      if (status) status.textContent = "로그인된 계정을 찾지 못했습니다.";
      return;
    }

    saveEmail.disabled = true;
    try {
      await migrateAccountToEmail(userId, email, currentPassword);
      if (profileEditEmail) profileEditEmail.value = normalizeAuthIdentifier(email);
      loadHomeProfile();
      openAppSettings("account");
      const nextStatus = document.querySelector("#settingsAccountStatus");
      if (nextStatus) nextStatus.textContent = window.STUDY_CLOUD_AUTH?.isConfigured
        ? "로그인 이메일이 변경되었습니다."
        : "이 브라우저의 로그인 이메일이 변경되었습니다.";
    } catch (error) {
      if (status) status.textContent = authErrorMessage(error, "이메일 변경");
    } finally {
      saveEmail.disabled = false;
    }
    return;
  }

  if (savePassword) {
    const userId = getCurrentUser();
    const password = document.querySelector("#settingsNewPassword")?.value.trim() || "";
    const status = document.querySelector("#settingsAccountStatus");
    const users = getAuthUsers();
    if (!userId || !users[userId]) {
      if (status) status.textContent = "로그인된 계정을 찾지 못했습니다.";
      return;
    }
    if (password.length < 6) {
      if (status) status.textContent = "비밀번호를 6자리 이상 입력해 주세요.";
      return;
    }
    try {
      if (window.STUDY_CLOUD_AUTH?.isConfigured && users[userId].uid) {
        await window.STUDY_CLOUD_AUTH.changePassword(password);
        users[userId] = { ...users[userId], password: "" };
      } else {
        users[userId] = { ...users[userId], password };
      }
      saveAuthUsers(users);
      document.querySelector("#settingsNewPassword").value = "";
      if (status) status.textContent = "비밀번호가 변경되었습니다.";
    } catch (error) {
      if (status) status.textContent = authErrorMessage(error, "비밀번호 변경");
    }
    return;
  }

  if (saveSupport) {
    const draft = document.querySelector("#settingsSupportDraft")?.value.trim() || "";
    localStorage.setItem(`studyCoinSupportDraftV1:${getCurrentUser() || "guest"}`, draft);
    const status = document.querySelector("#settingsSupportStatus");
    if (status) status.textContent = "문의 내용을 이 기기에 저장했습니다.";
    return;
  }

  if (settingsView) {
    document.querySelectorAll(".settings-popover").forEach((panel) => {
      panel.classList.add("hidden");
      panel.closest("[data-screen]")?.classList.remove("settings-open");
    });
    openAppSettings(settingsView.dataset.settingsView);
    return;
  }

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

document.addEventListener("change", (event) => {
  const control = event.target.closest("[data-notification-setting]");
  if (!control) return;
  const settings = getNotificationSettings();
  settings[control.dataset.notificationSetting] = control.checked;
  localStorage.setItem(notificationSettingsKey(), JSON.stringify(settings));
  const status = document.querySelector("#settingsSaveStatus");
  if (status) status.textContent = "알림 설정이 저장되었습니다.";
});
window.addEventListener("beforeunload", () => {
  saveCurrentScreen(activeScreenName());
  if (document.querySelector('[data-screen="quiz"]').classList.contains("active") && !reviewMode) {
    saveLevelTestState();
  }
});

window.addEventListener("pagehide", () => saveCurrentScreen(activeScreenName()));

initializeAuthScreen();
if (window.STUDY_CLOUD_AUTH?.isConfigured) {
  window.STUDY_CLOUD_AUTH.restoreSession()
    .then(async (account) => {
      if (!account?.id) return;
      const restoredUser = storeAuthenticatedAccount(account);
      setCurrentUser(account.id);
      if (restoredUser?.learningSettings) {
        await window.STUDY_CLOUD_AUTH.syncUserRecord(restoredUser).catch(() => false);
      }
      await hydrateMiddle3LevelTestFromCloud();
      routeAfterLogin({ restoreScreen: true });
    })
    .catch(() => {});
}
if (document.readyState === "complete") {
  queueMicrotask(() => restoreAdaptiveMathDiagnosisRoute());
} else {
  window.addEventListener("load", () => restoreAdaptiveMathDiagnosisRoute(), { once: true });
}
ensureGlobalSettingsButtons();
loadHomeProfile();
activateInAppControls();
updateAvatarUnlocks();
updateRoleCopy();
updateLevelTestCopy();
