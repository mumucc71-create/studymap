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
      if (error) {
        response.writeHead(404).end("Not found");
        return;
      }
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
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Runtime.evaluate failed");
    return result.result.value;
  };
  return { socket, send, evaluate };
}

async function waitFor(evaluate, expression, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return true;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`Timed out waiting for DOM condition: ${expression}`);
}

const sessionExpression = `(() => { const key=Object.keys(localStorage).find((item)=>item.startsWith("studyCoinMathAdaptiveLevelTestV1:")); return JSON.parse(localStorage.getItem(key) || "null"); })()`;

test("실제 index.html·script.js DOM 흐름은 3문제 조기 종료를 막고 G5 및 Elite로 이동한다", { timeout: 60000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync);
  assert.ok(chromePath, "Chrome 또는 Edge 실행 파일이 필요합니다.");
  const { server, port: appPort } = await startStaticServer();
  const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-math-dom-"));
  const chrome = spawn(chromePath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDir}`,
    `http://127.0.0.1:${appPort}/index.html`,
  ], { stdio: "ignore", windowsHide: true });

  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${appPort}`));
    assert.ok(page?.webSocketDebuggerUrl, "브라우저 페이지 대상이 필요합니다.");
    cdp = await connectCdp(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await waitFor(cdp.evaluate, `location.origin === "http://127.0.0.1:${appPort}" && document.readyState === "complete"`);
    await cdp.evaluate(`localStorage.clear(); true`);
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!document.querySelector("#setupLevelStart")`);

    await cdp.evaluate(`document.querySelector('[data-level-test-subject="수학"]').click(); document.querySelector("#setupLevelStart").click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="quiz"]')?.classList.contains("active") && document.querySelectorAll("#answerList [data-answer]").length > 0`);
    const firstProblem = await cdp.evaluate(`document.querySelector("#quizProblem").textContent`);
    const firstConcept = await cdp.evaluate(`document.querySelector("#quizConceptSub").textContent`);
    assert.match(firstProblem, /10,000|큰 수|자릿값/);
    assert.match(firstConcept, /큰 수/);

    const submitWith = async (correct) => {
      const before = await cdp.evaluate(`(${sessionExpression}).totalQuestions`);
      await cdp.evaluate(`(() => { const s=${sessionExpression}; const q=s.currentQuestion; const expected=String(q.expectedAnswer ?? q.correctAnswer ?? q.answer); const choices=(q.choices || []).map(String); const buttons=[...document.querySelectorAll("#answerList [data-answer]")]; if (buttons.length) { const correctIndex=Math.max(0, choices.findIndex((item)=>item===expected)); const index=${correct ? "correctIndex" : "buttons.findIndex((_, item)=>item!==correctIndex)"}; buttons[index].click(); } else { const input=document.querySelector("#answerList [data-adaptive-answer]"); if (!input) throw new Error("Adaptive answer input is missing"); input.value=${correct ? "expected" : '"__wrong__"'}; input.dispatchEvent(new Event("input", { bubbles:true })); } document.querySelector("#nextQuestion").click(); return true; })()`);
      await waitFor(cdp.evaluate, `(${sessionExpression}).totalQuestions > ${before} || (${sessionExpression}).status !== "IN_PROGRESS"`);
      return cdp.evaluate(sessionExpression);
    };

    await submitWith(true);
    await submitWith(false);
    let session = await submitWith(false);
    assert.equal(session.totalQuestions, 3);
    assert.notEqual(session.status, "COMPLETED");
    assert.equal(await cdp.evaluate(`document.querySelector('[data-screen="result"]')?.classList.contains("active")`), false);
    assert.equal(await cdp.evaluate(`document.querySelector('[data-screen="quiz"]')?.classList.contains("active")`), true);
    assert.ok(session.currentQuestion, "세 번째 제출 뒤 네 번째 문제가 있어야 합니다.");
    assert.equal(session.remainingPath[0], "PREREQUISITE_CHECK");
    assert.match(await cdp.evaluate(`document.querySelector("#quizCount").textContent`), /4문제/);

    session = await submitWith(true);
    assert.equal(session.totalQuestions, 4);
    assert.notEqual(session.status, "COMPLETED");
    assert.ok(session.currentQuestion, "네 번째 제출 뒤에도 다음 문제가 있어야 합니다.");

    const seenG4Domains = new Set();
    while (session.currentGradeGate === "G4" && session.totalQuestions < 23) {
      Object.values(session.evidenceByConcept || {}).flat().filter((item) => item.gradeGate === "G4").forEach((item) => seenG4Domains.add(item.domainId));
      session = await submitWith(true);
    }
    assert.ok(seenG4Domains.size >= 4, `G4 여러 영역이 필요합니다: ${[...seenG4Domains].join(",")}`);
    assert.equal(session.currentGradeGate, "G5");
    assert.equal(session.currentQuestion.testGradeBand, "G5");
    assert.equal(await cdp.evaluate(`document.querySelector('[data-screen="result"]')?.classList.contains("active")`), false);

    while (session.totalQuestions < 23 && session.status === "IN_PROGRESS") session = await submitWith(true);
    assert.equal(session.totalQuestions, 23);
    assert.notEqual(session.status, "COMPLETED");

    const savedQuestionId = session.currentQuestion.problemId;
    const savedTotal = session.totalQuestions;
    await cdp.send("Page.reload", { ignoreCache: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await waitFor(cdp.evaluate, `document.readyState === "complete" && !!document.querySelector("#setupLevelStart")`);
    session = await cdp.evaluate(sessionExpression);
    assert.equal(session.totalQuestions, savedTotal);
    assert.equal(session.currentQuestion.problemId, savedQuestionId);

    await cdp.evaluate(`window.STUDY_NAV.go("home"); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="home"]')?.classList.contains("active")`);
    const eliteVisible = await cdp.evaluate(`(() => { const b=document.querySelector("#startEliteTestButton"); const r=b.getBoundingClientRect(); const s=getComputedStyle(b); return !b.hidden && s.display!=="none" && s.visibility!=="hidden" && r.width>0 && r.height>0; })()`);
    assert.equal(eliteVisible, true);
    await cdp.evaluate(`document.querySelector("#startEliteTestButton").click(); true`);
    await waitFor(cdp.evaluate, `!document.querySelector("#testSubjectModal")?.classList.contains("hidden")`);
    assert.equal(await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').textContent`), "수학");
    assert.equal(await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="grade"]').hidden`), true);
    await cdp.evaluate(`document.querySelector('[data-test-subject="수학"][data-math-test-mode="adaptive"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="elite-quiz"]')?.classList.contains("active")`);
    assert.equal(await cdp.evaluate(`document.querySelector('[data-screen="elite-quiz"]')?.classList.contains("active")`), true);

    const visibleAdaptiveText = await cdp.evaluate(`document.querySelector('[data-screen="quiz"]').textContent`);
    assert.doesNotMatch(visibleAdaptiveText, /canonicalConceptId|currentGradeGate|internalGradeBand|scopeId|초5로 올라|중2로 내려|고1 수준/);
  } finally {
    cdp?.socket?.close();
    chrome.kill();
    await Promise.race([
      new Promise((resolve) => chrome.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
    await new Promise((resolve) => server.close(resolve));
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch (error) {
      if (error?.code !== "EPERM" && error?.code !== "EBUSY") throw error;
    }
  }
});
