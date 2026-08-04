const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const contentType = (file) => ({
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
}[path.extname(file).toLowerCase()] || "application/octet-stream");

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function startStaticServer() {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(ROOT, relative);
    if (!file.startsWith(`${ROOT}${path.sep}`) && file !== path.join(ROOT, "index.html")) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(file, (error, body) => {
      if (error) return response.writeHead(404).end("Not found");
      response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
      response.end(body);
    });
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, port: server.address().port };
}

async function waitForJson(url, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function connectCdp(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const events = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) {
      events.push(message);
      return;
    }
    if (!pending.has(message.id)) return;
    const callbacks = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callbacks.reject(new Error(message.error.message));
    else callbacks.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  return { socket, send, evaluate, events };
}

async function waitFor(evaluate, expression, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return true;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out waiting for DOM condition: ${expression}`);
}

const adaptiveSession = `(() => { const key=Object.keys(localStorage).find((item)=>item.startsWith("studyCoinMathAdaptiveLevelTestV1:")); return JSON.parse(localStorage.getItem(key) || "null"); })()`;

test("실제 DOM에서 일반 진단과 Math Elite가 서로 오염 없이 왕복한다", { timeout: 60000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync);
  assert.ok(chromePath, "Chrome 또는 Edge 실행 파일이 필요합니다.");
  const app = await startStaticServer();
  const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-general-math-dom-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDir}`,
    `http://127.0.0.1:${app.port}/index.html`,
  ], { stdio: "ignore", windowsHide: true });

  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${app.port}`));
    assert.ok(page?.webSocketDebuggerUrl);
    cdp = await connectCdp(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
      Math.random=()=>0.2;
      window.__generalMathErrors=[];
      addEventListener("error", (event)=>window.__generalMathErrors.push(String(event.error?.stack || event.message)));
      addEventListener("unhandledrejection", (event)=>window.__generalMathErrors.push(String(event.reason?.stack || event.reason)));
    })();` });
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP && !!window.STUDY_MATH_ADAPTIVE_LEVEL_TEST_UI`);
    await cdp.evaluate(`localStorage.clear(); localStorage.setItem("studyCoinCurrentUser","student@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"student@example.com":{id:"student@example.com",uid:"general-dom-user",provider:"password",onboardingComplete:true}})); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP && typeof window.STUDY_NAV?.go === "function"`);

    // Firebase 인증/원격 상태가 끝나지 않아도 앱 로그인 사용자는 로컬 진단을 시작해야 한다.
    await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:true,stateSyncEnabled:true,syncUserRecord:()=>new Promise(()=>{}),loadUserState:()=>new Promise(()=>{}),saveUserState:()=>new Promise(()=>{})}; true`);

    const openGeneralDiagnosis = async () => {
      await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector('[data-open-test-subject="standard"]').click(); true`);
      await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
      const visible = await cdp.evaluate(`(() => { const b=document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]'); const s=getComputedStyle(b); const r=b.getBoundingClientRect(); return !b.hidden && s.display!=="none" && s.visibility!=="hidden" && r.width>0 && r.height>0; })()`);
      assert.equal(visible, true);
      await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    };

    await openGeneralDiagnosis();
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector("#quizProblem").textContent.trim().length>0 && (document.querySelectorAll("#answerList [data-answer]").length>0 || !!document.querySelector("#answerList [data-adaptive-answer]"))`, 3000);
    const first = await cdp.evaluate(`({prompt:document.querySelector("#quizProblem").textContent.trim(),mode:(${adaptiveSession}).mode,id:(${adaptiveSession}).currentQuestion.problemId})`);
    assert.equal(first.mode, "ADAPTIVE_CONCEPT_DIAGNOSIS");
    assert.match(first.prompt, /10,000|자릿값|큰 수/);

    await cdp.evaluate(`(() => { const s=${adaptiveSession}; const q=s.currentQuestion; const expected=String(q.expectedAnswer ?? q.correctAnswer ?? q.answer); const buttons=[...document.querySelectorAll("#answerList [data-answer]")]; if(buttons.length){ const choices=(q.choices||[]).map(String); buttons[Math.max(0,choices.indexOf(expected))].click(); } else { const input=document.querySelector("#answerList [data-adaptive-answer]"); input.value=expected; input.dispatchEvent(new Event("input",{bubbles:true})); } document.querySelector("#nextQuestion").click(); return true; })()`);
    await waitFor(cdp.evaluate, `(${adaptiveSession}).totalQuestions===1 && (${adaptiveSession}).currentQuestion.problemId!==${JSON.stringify(first.id)}`);
    const secondId = await cdp.evaluate(`(${adaptiveSession}).currentQuestion.problemId`);

    // 일반 진단에서 나간 뒤 Elite에 진입하고 실제 문제를 제출한다.
    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector("#startEliteTestButton").click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
    await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="elite-quiz"]')?.classList.contains("active") && document.querySelector("#eliteProblem").textContent.trim().length>0 && document.querySelectorAll("#eliteAnswerList [data-answer]").length>=2`);
    const eliteFirstId = await cdp.evaluate(`window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState()).problemId`);
    await cdp.evaluate(`document.querySelector("#eliteAnswerList [data-answer]").click(); document.querySelector("#eliteNext").click(); true`);
    await waitFor(cdp.evaluate, `window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState()).problemId!==${JSON.stringify(eliteFirstId)}`);

    // Elite가 일반 화면으로 돌아가는 전환을 다시 가로채면 안 된다.
    await openGeneralDiagnosis();
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="resume-test"]')?.classList.contains("active") || document.querySelector('[data-screen="quiz"]')?.classList.contains("active")`, 3000);
    if (await cdp.evaluate(`document.querySelector('[data-screen="resume-test"]')?.classList.contains("active")`)) {
      await cdp.evaluate(`document.querySelector("#resumeTest").click(); true`);
    }
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector("#quizProblem").textContent.trim().length>0`);
    assert.equal(await cdp.evaluate(`(${adaptiveSession}).currentQuestion.problemId`), secondId);

    const keys = await cdp.evaluate(`({adaptive:Object.keys(localStorage).filter((k)=>k.startsWith("studyCoinMathAdaptiveLevelTestV1:")),elite:Object.keys(localStorage).filter((k)=>k.startsWith("studyEliteAssessmentV1:")),adaptiveId:(${adaptiveSession}).currentQuestion.problemId,eliteId:window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState()).problemId})`);
    assert.equal(keys.adaptive.length, 1);
    assert.equal(keys.elite.length, 1);
    assert.notEqual(keys.adaptiveId, keys.eliteId);

    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && (${adaptiveSession})?.currentQuestion?.problemId===${JSON.stringify(secondId)}`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="resume-test"]')?.classList.contains("active") || document.querySelector('[data-screen="quiz"]')?.classList.contains("active")`);
    if (await cdp.evaluate(`document.querySelector('[data-screen="resume-test"]')?.classList.contains("active")`)) {
      await cdp.evaluate(`document.querySelector("#resumeTest").click(); true`);
    }
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector("#quizProblem").textContent.trim().length>0`);
    const runtimeErrors = cdp.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert.deepEqual(await cdp.evaluate(`window.__generalMathErrors`), []);
    assert.equal(runtimeErrors.length, 0);
  } finally {
    cdp?.socket?.close();
    chrome.kill();
    await Promise.race([new Promise((resolve) => chrome.once("exit", resolve)), new Promise((resolve) => setTimeout(resolve, 2000))]);
    await new Promise((resolve) => app.server.close(resolve));
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (error) {
      if (error?.code !== "EPERM" && error?.code !== "EBUSY") throw error;
    }
  }
});

test("실제 DOM에서 중2 학년별 범위 진단이 Elite와 맞춤형 진단과 분리된다", { timeout: 70000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync);
  assert.ok(chromePath, "Chrome 또는 Edge 실행 파일이 필요합니다.");
  const app = await startStaticServer();
  const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-grade-range-dom-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDir}`,
    `http://127.0.0.1:${app.port}/index.html`,
  ], { stdio: "ignore", windowsHide: true });

  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${app.port}`));
    assert.ok(page?.webSocketDebuggerUrl);
    cdp = await connectCdp(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
      Math.random=()=>0.2;
      window.__gradeRangeErrors=[];
      addEventListener("error", (event)=>window.__gradeRangeErrors.push(String(event.error?.stack || event.message)));
      addEventListener("unhandledrejection", (event)=>window.__gradeRangeErrors.push(String(event.reason?.stack || event.reason)));
    })();` });
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP && typeof window.STUDY_NAV?.go === "function"`);
    await cdp.evaluate(`localStorage.clear(); localStorage.setItem("studyCoinCurrentUser","m2@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"m2@example.com":{id:"m2@example.com",uid:"m2-dom-user",provider:"password",onboardingComplete:true,learningSettings:{role:"student",school:"middle",grade:"중등 2학년",subjects:["수학"]}}})); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP && typeof window.STUDY_NAV?.go === "function"`);

    await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:true,stateSyncEnabled:true,syncUserRecord:()=>new Promise(()=>{}),loadUserState:()=>new Promise(()=>{}),saveUserState:()=>new Promise(()=>{})}; true`);

    const openGradeRange = async () => {
      await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector('[data-open-test-subject="standard"]').click(); true`);
      await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
      const state = await cdp.evaluate(`(() => { const b=document.querySelector('[data-test-subject="수학"][data-math-test-mode="grade"]'); const s=getComputedStyle(b); const r=b.getBoundingClientRect(); return {visible:!b.hidden&&!b.disabled&&s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0}; })()`);
      assert.equal(state.visible, true);
      await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="grade"]').click(); true`);
    };

    await openGradeRange();
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector('[data-screen="quiz"]')?.dataset.testMode === "GRADE_RANGE_DIAGNOSIS" && document.querySelectorAll("#answerList [data-answer]").length === 4`, 3500);
    const first = await cdp.evaluate(`({prompt:document.querySelector("#quizProblem").textContent.trim(),mode:document.querySelector('[data-screen="quiz"]').dataset.testMode,gradeBand:document.querySelector('[data-screen="quiz"]').dataset.gradeBand,bankId:document.querySelector('[data-screen="quiz"]').dataset.gradeBankId,choices:[...document.querySelectorAll("#answerList [data-answer]")].map((item)=>item.dataset.answer)})`);
    assert.equal(first.mode, "GRADE_RANGE_DIAGNOSIS");
    assert.equal(first.gradeBand, "M2");
    assert.equal(first.bankId, "M2_GENERATED");
    assert.equal(first.prompt, "3x+4x-2x = ?");
    assert.equal(first.choices.length, 4);

    await cdp.evaluate(`document.querySelector('#answerList [data-answer="5x"]').click(); document.querySelector("#nextQuestion").click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector("#quizProblem").textContent.trim() === "x+y=5, x-y=-1일 때 x는?"`);
    const snapshot = await cdp.evaluate(`(() => { const key=Object.keys(localStorage).find((item)=>item.startsWith("studyCoinLevelTest:")); return JSON.parse(localStorage.getItem(key)||"null"); })()`);
    assert.equal(snapshot.mode, "GRADE_RANGE_DIAGNOSIS");
    assert.equal(snapshot.selectedGradeBand, "M2");
    assert.equal(snapshot.selectedGradeBankId, "M2_GENERATED");
    assert.equal(snapshot.activeQuestions.length, 2);
    assert.equal(snapshot.activeQuestions.filter((item)=>item.testGradeBand!=="M2").length, 0);
    assert.equal(await cdp.evaluate(`Object.keys(localStorage).filter((key)=>key.startsWith("studyCoinMathAdaptiveLevelTestV1:")).length`), 0);

    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector("#startEliteTestButton").click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
    await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="elite-quiz"]')?.classList.contains("active") && document.querySelector("#eliteProblem").textContent.trim().length>0`);

    await openGradeRange();
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="resume-test"]')?.classList.contains("active")`);
    await cdp.evaluate(`document.querySelector("#resumeTest").click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector("#quizProblem").textContent.trim() === "x+y=5, x-y=-1일 때 x는?"`);

    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && (document.querySelector('[data-screen="resume-test"]')?.classList.contains("active") || document.querySelector('[data-screen="quiz"]')?.classList.contains("active"))`);
    if (await cdp.evaluate(`document.querySelector('[data-screen="resume-test"]')?.classList.contains("active")`)) await cdp.evaluate(`document.querySelector("#resumeTest").click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector("#quizProblem").textContent.trim() === "x+y=5, x-y=-1일 때 x는?"`);

    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector('[data-open-test-subject="standard"]').click(); document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelector('[data-screen="quiz"]')?.dataset.testMode === "ADAPTIVE_CONCEPT_DIAGNOSIS"`);
    assert.equal(await cdp.evaluate(`Object.keys(localStorage).some((key)=>key.startsWith("studyCoinLevelTest:"))`), true);
    assert.equal(await cdp.evaluate(`Object.keys(localStorage).some((key)=>key.startsWith("studyCoinMathAdaptiveLevelTestV1:"))`), true);
    assert.deepEqual(await cdp.evaluate(`window.__gradeRangeErrors`), []);
    assert.equal(cdp.events.filter((event) => event.method === "Runtime.exceptionThrown").length, 0);
  } finally {
    cdp?.socket?.close();
    chrome.kill();
    await Promise.race([new Promise((resolve) => chrome.once("exit", resolve)), new Promise((resolve) => setTimeout(resolve, 2000))]);
    await new Promise((resolve) => app.server.close(resolve));
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (error) {
      if (error?.code !== "EPERM" && error?.code !== "EBUSY") throw error;
    }
  }
});
