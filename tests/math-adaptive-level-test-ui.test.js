const test = require("node:test");
const assert = require("node:assert/strict");

const ui = require("../math-adaptive-level-test-ui.js");
const storage = require("../math-adaptive-level-test-storage.js");

function node() { return { textContent: "", innerHTML: "", style: {}, querySelector: () => null }; }
function elements() {
  return {
    quizTitle: node(), quizConcept: node(), quizPrompt: node(), quizProblem: node(), answerList: node(),
    quizCount: node(), quizProgress: node(), quizRoute: node(), currentAnalysis: node(), checkedAnalysis: node(), nextAnalysis: node(),
    resultLevel: node(), resultStartCopy: node(), strongDomains: node(), weakDomains: node(), confidenceDomains: node(), masteryDomains: node(), learningPath: node(),
    selectedAnswer: () => "4",
  };
}

const question = (changes = {}) => ({
  problemId: "g4-large-1", canonicalConceptId: "large_numbers", answerType: "MULTIPLE_CHOICE",
  prompt: "2+2는?", choices: ["3", "4"], expectedAnswer: "4", acceptedAnswers: ["4"],
  structureSignature: "large:add:1", solutionPathSignature: "large:add:path:1", estimatedSolveTime: 30,
  ...changes,
});

test("다섯 answerType을 모두 렌더링한다", () => {
  assert.match(ui.renderAnswerInput(question()), /data-answer/);
  assert.match(ui.renderAnswerInput(question({ answerType: "SHORT_ANSWER", choices: undefined })), /data-adaptive-answer="SHORT_ANSWER"/);
  assert.match(ui.renderAnswerInput(question({ answerType: "EXPRESSION_INPUT", choices: undefined })), /data-adaptive-answer="EXPRESSION_INPUT"/);
  assert.match(ui.renderAnswerInput(question({ answerType: "STEP_ORDER", choices: undefined })), /textarea/);
  assert.match(ui.renderAnswerInput(question({ answerType: "WRITTEN_RESPONSE", choices: undefined })), /풀이 과정/);
});

test("객관식·단답형·수식형 정답을 판정한다", () => {
  assert.equal(ui.evaluateAnswer(question(), "4").result, "CORRECT");
  assert.equal(ui.evaluateAnswer(question({ answerType: "SHORT_ANSWER" }), " 4 ").result, "CORRECT");
  assert.equal(ui.evaluateAnswer(question({ answerType: "EXPRESSION_INPUT", expectedAnswer: "x+1" }), "x+1").result, "CORRECT");
});

test("과정형은 실제 단계 순서를 검증한다", () => {
  const q = question({ answerType: "STEP_ORDER", expectedAnswer: ["식 세우기", "계산", "검산"] });
  assert.equal(ui.evaluateAnswer(q, ["식 세우기", "계산", "검산"]).result, "CORRECT");
  assert.equal(ui.evaluateAnswer(q, ["계산", "식 세우기", "검산"]).result, "INCORRECT");
});

test("서술형은 자동 승급 증거가 아닌 REVIEW_REQUIRED다", () => {
  assert.equal(ui.evaluateAnswer(question({ answerType: "WRITTEN_RESPONSE" }), "풀이").result, "REVIEW_REQUIRED");
});

test("문제 화면에 내부 ID나 학년 이동 문구를 노출하지 않는다", () => {
  const el = elements();
  const session = storage.createSession({ graphState: require("../math-adaptive-level-test-runtime.js").createInitialState(), currentQuestion: question() });
  ui.renderQuestion(el, session);
  const visible = Object.values(el).map((item) => item?.textContent || "").join(" ");
  assert.doesNotMatch(visible, /canonical|gradeGate|scopeId|초5로|중2로|고1/);
  assert.match(visible, /큰 수|현재 확인/);
});

test("결과 화면은 요구한 개념 중심 항목만 표시한다", () => {
  const el = elements();
  ui.renderResult(el, { student: {
    "잘 이해한 개념": ["큰 수"], "지금 시작할 학습": ["분수"], "먼저 보충할 개념": ["나눗셈"],
    "다음에 도전할 개념": ["비와 비율"], "영역별 진단 신뢰도": [{ area: "수와 연산", confidence: 80 }],
  } });
  const visible = Object.values(el).map((item) => item?.textContent || "").join(" ");
  assert.match(visible, /큰 수/);
  assert.match(visible, /나눗셈/);
  assert.match(visible, /수와 연산 80%/);
  assert.doesNotMatch(visible, /internalGradeBand|canonicalConceptId|scopeId/);
});

test("동일 submissionId 재제출은 중복 반영하지 않는다", async () => {
  const catalog = { byGrade: { G4: [question(), question({ problemId: "g4-large-2", structureSignature: "large:add:2", solutionPathSignature: "large:add:path:2" })] } };
  const controller = ui.createController({ catalog });
  controller.start({ sessionId: "s", timestamp: 1 });
  const first = await controller.submit("4", { submissionId: "submission-1", timestamp: 2 });
  const count = first.session.totalQuestions;
  const duplicate = await controller.submit("4", { submissionId: "submission-1", timestamp: 3 });
  assert.equal(duplicate.accepted, false);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.session.totalQuestions, count);
});

test("학습 시작 concept는 COMPLETE_SPRING 전용 런타임만 선택한다", () => {
  const selected = ui.selectLearningStart({
    recommendedStartConceptIds: ["large_numbers", "m3_sqrt_meaning"], prerequisiteGaps: [], developingConcepts: [], nextChallengeConceptIds: [],
  });
  assert.equal(selected, "m3_sqrt_meaning");
});

test("학생 안내 문구는 허용된 자연스러운 한국어만 사용한다", () => {
  const all = Object.values(ui.ALLOWED_MESSAGES).join(" ");
  assert.match(all, /현재 확인 중인 개념/);
  assert.match(all, /원래 개념으로 돌아갈게요/);
  assert.doesNotMatch(all, /올라갑니다|내려갑니다|gradeGate|scopeId/);
});

test("저장 중 최신 원격 상태가 확인되면 controller도 remote-wins 상태로 전환한다", async () => {
  const catalog = { byGrade: { G4: [question(), question({ problemId: "g4-large-2", structureSignature: "large:add:2", solutionPathSignature: "large:add:path:2" })] } };
  let remote = null;
  const controller = ui.createController({
    catalog,
    persist: async (localSession) => {
      remote ||= storage.createSession({
        graphState: localSession.graphState,
        sessionId: "remote-session",
        currentQuestion: question({ problemId: "remote-current" }),
        revision: localSession.revision + 5,
        timestamp: 20,
      });
      return { saved: false, reason: "REMOTE_REVISION_CONFLICT", state: remote };
    },
  });
  controller.start({ sessionId: "local-session", timestamp: 1 });
  const submitted = await controller.submit("4", { submissionId: "remote-win", timestamp: 2 });
  assert.equal(submitted.session.sessionId, "remote-session");
  assert.equal(controller.getSession().sessionId, "remote-session");
});
