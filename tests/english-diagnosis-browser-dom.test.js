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
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const contentType = (file) => ({
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
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
    if (!file.startsWith(`${ROOT}${path.sep}`) && file !== path.join(ROOT, "index.html")) return response.writeHead(403).end("Forbidden");
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
    try { const response = await fetch(url); if (response.ok) return response.json(); } catch {}
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
    if (!message.id) return events.push(message);
    const callbacks = pending.get(message.id);
    if (!callbacks) return;
    pending.delete(message.id);
    message.error ? callbacks.reject(new Error(message.error.message)) : callbacks.resolve(message.result);
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
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out waiting for DOM condition: ${expression}`);
}

test("영어 맞춤형·학년별 진단이 실제 DOM에서 분리되어 진행된다", { timeout: 60000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync);
  assert.ok(chromePath, "Chrome 또는 Edge 실행 파일이 필요합니다.");
  const app = await startStaticServer();
  const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-english-diagnosis-dom-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDir}`,
    `http://127.0.0.1:${app.port}/index.html`,
  ], { stdio: "ignore", windowsHide: true });

  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${app.port}`));
    cdp = await connectCdp(page.webSocketDebuggerUrl);
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
      Math.random=()=>0.2; window.__englishErrors=[];
      addEventListener("error",event=>window.__englishErrors.push(String(event.error?.stack||event.message)));
      addEventListener("unhandledrejection",event=>window.__englishErrors.push(String(event.reason?.stack||event.reason)));
    })();` });
    await waitFor(cdp.evaluate, `document.readyState==="complete" && !!window.STUDY_SUBJECT_CONTENT?.english && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`localStorage.clear(); localStorage.setItem("studyCoinCurrentUser","english@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"english@example.com":{id:"english@example.com",uid:"english-dom-user",provider:"password",onboardingComplete:true}})); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 400));
    await waitFor(cdp.evaluate, `document.readyState==="complete" && !!window.STUDY_SUBJECT_CONTENT?.english && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`window.__englishErrors=[]; addEventListener("error",event=>window.__englishErrors.push(String(event.error?.stack||event.message))); addEventListener("unhandledrejection",event=>window.__englishErrors.push(String(event.reason?.stack||event.reason))); true`);
    await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:false,stateSyncEnabled:false}; true`);

    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector('[data-open-test-subject="standard"]').click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
    const buttons = await cdp.evaluate(`[...document.querySelectorAll('[data-test-subject="영어"]')].map(b=>({mode:b.dataset.englishTestMode,text:b.textContent.trim(),visible:!b.hidden&&getComputedStyle(b).display!=="none"}))`);
    assert.deepEqual(buttons, [
      { mode: "adaptive", text: "맞춤형 영어 진단", visible: true },
      { mode: "grade", text: "학년별 영어 진단", visible: true },
    ]);

    await cdp.evaluate(`document.querySelector('[data-test-subject="영어"][data-english-test-mode="adaptive"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelectorAll("#answerList [data-answer]").length===4`);
    const first = await cdp.evaluate(`({mode:adaptiveState.testMode,rank:adaptiveState.currentRank,id:activeQuestions[currentQuestion].id,prompt:document.querySelector("#quizProblem").textContent.trim(),choices:[...document.querySelectorAll("#answerList [data-answer] span")].map(n=>n.textContent.trim())})`);
    assert.equal(first.mode, "english-adaptive");
    assert.equal(first.rank, 3);
    assert.ok(first.prompt.length > 0);
    assert.doesNotMatch(first.prompt, /[A-Za-z].*(을|를|은|는|이|가)/u);
    first.choices.forEach((choice) => assert.doesNotMatch(choice, /[가-힣]/u));

    await cdp.evaluate(`(() => { const q=activeQuestions[currentQuestion]; [...document.querySelectorAll("#answerList [data-answer]")].find(b=>b.dataset.answer===q.answer).click(); document.querySelector("#nextQuestion").click(); return true; })()`);
    await waitFor(cdp.evaluate, `activeQuestions[currentQuestion]?.id!==${JSON.stringify(first.id)} && document.querySelectorAll("#answerList [data-answer]").length===4`);

    await cdp.evaluate(`window.STUDY_NAV.go("study-empty"); document.querySelector('[data-subject-learning="english"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="subject-learning"]')?.classList.contains("active")`);
    await cdp.evaluate(`(() => {
      const key="studyCoinSubjectLearningV2:english@example.com";
      const saved=JSON.parse(localStorage.getItem(key));
      const courseIndex=window.STUDY_SUBJECT_CONTENT.english.stages.findIndex(course=>course.id==="EN-L07-C01");
      Object.assign(saved.subjects.english,{stageIndex:courseIndex,activeEnglishStageId:"EN-L07-C01-S01",mode:"quiz",resumeMode:"quiz",queue:["EN-L07-C01-S01-Q04"],answer:"",feedback:null});
      localStorage.setItem(key,JSON.stringify(saved));
      window.dispatchEvent(new CustomEvent("study:user-changed",{detail:{userId:"english@example.com"}}));
      return true;
    })()`);
    await waitFor(cdp.evaluate, `document.querySelector("#subjectLearningMain")?.textContent.includes("Choose the correct sentence.") && document.querySelectorAll("#subjectLearningMain [data-english-choice]").length===4`);
    const learningSurface = await cdp.evaluate(`({text:document.querySelector("#subjectLearningMain").textContent,choices:[...document.querySelectorAll("#subjectLearningMain [data-english-choice]")].map(button=>button.textContent.trim())})`);
    assert.doesNotMatch(learningSurface.text, /[A-Za-z].*(을|를|은|는|이|가)/u);
    assert.deepEqual(learningSurface.choices, ["She has eaten lunch.", "She have eaten lunch.", "She has eat lunch.", "She eats lunch."]);

    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelectorAll("[data-grade]").forEach(b=>b.classList.remove("selected")); document.querySelector('[data-grade="중등 2학년"]').classList.add("selected"); document.querySelector('[data-open-test-subject="standard"]').click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
    await cdp.evaluate(`document.querySelector('[data-test-subject="영어"][data-english-test-mode="grade"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && adaptiveState?.testMode==="english-grade" && document.querySelectorAll("#answerList [data-answer]").length===4`);
    const grade = await cdp.evaluate(`({mode:adaptiveState.testMode,rank:adaptiveState.currentRank,allRanks:adaptiveQuestionPool.every(q=>q.rank===7),label:activeQuestions[currentQuestion].levelLabel,prompt:document.querySelector("#quizProblem").textContent.trim()})`);
    assert.equal(grade.mode, "english-grade");
    assert.equal(grade.rank, 7);
    assert.equal(grade.allRanks, true);
    assert.ok(grade.prompt.length > 0);

    const runtimeErrors = cdp.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert.deepEqual(await cdp.evaluate(`window.__englishErrors`), []);
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
