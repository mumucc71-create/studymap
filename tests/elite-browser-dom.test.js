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
  let brokenMathModel = false;
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    if (brokenMathModel && relative === "middle3-elite-math-model.js") {
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
      response.end("window.STUDY_MIDDLE3_ELITE_MATH={problems:[]};");
      return;
    }
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
  return {
    server,
    port: server.address().port,
    setBrokenMathModel(value) { brokenMathModel = Boolean(value); },
  };
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

async function waitFor(evaluate, expression, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out waiting for DOM condition: ${expression}`);
}

test("실제 Elite 카드부터 인증·문제·제출·복원·오류 상태까지 DOM에서 동작한다", { timeout: 90000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync);
  assert.ok(chromePath, "Chrome 또는 Edge 실행 파일이 필요합니다.");
  const app = await startStaticServer();
  const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-elite-dom-"));
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
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => { Math.random=()=>0.2; const original=EventTarget.prototype.addEventListener; window.__eliteListenerRecords=[]; EventTarget.prototype.addEventListener=function(type,listener,options){ if(this?.id==="startEliteTestButton") window.__eliteListenerRecords.push(type); return original.call(this,type,listener,options); }; })();` });
    await waitFor(cdp.evaluate, `location.origin === "http://127.0.0.1:${app.port}" && document.readyState === "complete"`);

    await cdp.evaluate(`localStorage.clear(); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP && typeof window.STUDY_NAV?.go === "function"`);
    const eliteClickListeners = await cdp.evaluate(`window.__eliteListenerRecords.filter((item)=>item==="click").length`);
    const runtimeErrors = cdp.events.filter((item) => item.method === "Runtime.exceptionThrown").map((item) => item.params?.exceptionDetails?.exception?.description || item.params?.exceptionDetails?.text);
    const scriptProgress = await cdp.evaluate(`({pending:typeof pendingTestMode,modal:typeof testSubjectModal,sync:typeof syncLevelTestSubjectPicker,nav:Object.keys(window.STUDY_NAV||{})})`);
    assert.ok(eliteClickListeners > 0, `Elite 카드 클릭 핸들러가 실제 index/script 경로에서 등록되어야 합니다. ${JSON.stringify(scriptProgress)} ${runtimeErrors.join(" | ")}`);
    await cdp.evaluate(`window.STUDY_NAV.go("home"); document.querySelector("#startEliteTestButton").click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal").classList.contains("hidden")`);
    await cdp.evaluate(`localStorage.setItem("studyCoinCurrentUser","student@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"student@example.com":{id:"student@example.com",uid:"elite-dom-user",provider:"password",onboardingComplete:true}})); if(window.STUDY_CLOUD_AUTH) window.STUDY_CLOUD_AUTH.restoreSession=()=>new Promise((resolve)=>setTimeout(()=>resolve(null),250)); true`);
    await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    assert.equal(await cdp.evaluate(`document.querySelector("#eliteSelectionMessage").textContent`), "학습 정보를 불러오는 중입니다.");
    assert.equal(await cdp.evaluate(`document.querySelector("#eliteSelectionMessage").textContent.includes("Firebase 로그인")`), false);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="elite-quiz"]').classList.contains("active") && document.querySelector("#eliteProblem").textContent.trim().length > 0 && document.querySelectorAll("#eliteAnswerList [data-answer]").length >= 2`);

    const first = await cdp.evaluate(`({prompt:document.querySelector("#eliteProblem").textContent.trim(),choices:[...document.querySelectorAll("#eliteAnswerList [data-answer]")].map((item)=>item.dataset.answer),index:window.STUDY_ELITE_APP.getState().currentProblemIndex,status:window.STUDY_ELITE_APP.getAuthStatus()})`);
    assert.equal(first.prompt, "직각삼각형 ABC에서 ∠C=90°, tan A=3/4입니다. C에서 빗변 AB에 내린 높이의 발을 D라 할 때 AD-BD=7입니다. 삼각형 ABC의 넓이는?");
    assert.deepEqual(first.choices, ["75", "125", "150", "300"]);
    assert.equal(first.status, "AUTHENTICATED");
    assert.equal(await cdp.evaluate(`document.querySelector("#eliteGeometry svg")?.getAttribute("role")`), "img");

    await cdp.evaluate(`document.querySelector("#eliteNext").click(); true`);
    assert.equal(await cdp.evaluate(`window.STUDY_ELITE_APP.getState().currentProblemIndex`), first.index);
    await cdp.evaluate(`document.querySelector("#eliteAnswerList [data-answer]").click(); document.querySelector("#eliteNext").click(); true`);
    await waitFor(cdp.evaluate, `window.STUDY_ELITE_APP.getState().currentProblemIndex > ${first.index}`);
    const advanced = await cdp.evaluate(`({id:window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState()).problemId,index:window.STUDY_ELITE_APP.getState().currentProblemIndex,prompt:document.querySelector("#eliteProblem").textContent.trim()})`);
    assert.ok(advanced.prompt.length > 10);

    await cdp.evaluate(`window.STUDY_NAV.go("home", {silent:true}); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="elite-quiz"]').classList.contains("active")`);

    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && window.STUDY_ELITE_APP?.getState()?.currentProblemIndex === ${advanced.index} && document.querySelector("#eliteProblem").textContent.trim().length > 0`);
    assert.equal(await cdp.evaluate(`window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState()).problemId`), advanced.id);

    await cdp.evaluate(`(() => { const key=Object.keys(localStorage).find((item)=>item.startsWith("studyEliteAssessmentV1:elite-dom-user:math")); const state=JSON.parse(localStorage.getItem(key)); state.sessionProblemIds[state.currentProblemIndex]="missing-elite-problem"; localStorage.setItem(key,JSON.stringify(state)); return true; })()`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && document.querySelector("#eliteProblem").textContent.trim().length > 0`);
    assert.notEqual(await cdp.evaluate(`window.STUDY_ELITE_APP.getEngine().getCurrentProblem(window.STUDY_ELITE_APP.getState())?.problemId`), "missing-elite-problem");

    await cdp.evaluate(`localStorage.clear(); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP`);
    await cdp.evaluate(`document.dispatchEvent(new CustomEvent("study:start-elite-test",{detail:{subject:"수학"}})); true`);
    await waitFor(cdp.evaluate, `document.querySelector("#eliteSelectionMessage").textContent === "로그인이 필요합니다."`);
    assert.equal(await cdp.evaluate(`window.STUDY_ELITE_APP.getUiStatus()`), "UNAUTHENTICATED");

    app.setBrokenMathModel(true);
    await cdp.evaluate(`localStorage.setItem("studyCoinCurrentUser","student@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"student@example.com":{id:"student@example.com",uid:"elite-dom-user",provider:"password"}})); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!window.STUDY_ELITE_APP`);
    await cdp.evaluate(`document.dispatchEvent(new CustomEvent("study:start-elite-test",{detail:{subject:"수학"}})); true`);
    await waitFor(cdp.evaluate, `document.querySelector("#eliteSelectionMessage").textContent === "문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."`);
    assert.equal(await cdp.evaluate(`window.STUDY_ELITE_APP.getUiStatus()`), "ELITE_CONTENT_ERROR");
    assert.equal(await cdp.evaluate(`document.querySelector("#eliteSelectionMessage").textContent.includes("Firebase")`), false);
  } finally {
    cdp?.socket?.close();
    chrome.kill();
    await Promise.race([
      new Promise((resolve) => chrome.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    await new Promise((resolve) => app.server.close(resolve));
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (error) {
      if (error?.code !== "EPERM" && error?.code !== "EBUSY") throw error;
    }
  }
});
