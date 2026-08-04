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
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
}[path.extname(file).toLowerCase()] || "application/octet-stream");

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => { const port = server.address().port; server.close((error) => error ? reject(error) : resolve(port)); });
});
async function startStaticServer() {
  const server = http.createServer((request, response) => {
    const relative = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.resolve(ROOT, relative);
    if (!file.startsWith(`${ROOT}${path.sep}`) && file !== path.join(ROOT, "index.html")) return response.writeHead(403).end();
    fs.readFile(file, (error, body) => {
      if (error) return response.writeHead(404).end();
      response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" }); response.end(body);
    });
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { server, port: server.address().port };
}
async function waitForJson(url, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { try { const response = await fetch(url); if (response.ok) return response.json(); } catch {} await new Promise((resolve) => setTimeout(resolve, 50)); }
  throw new Error(`Timed out waiting for ${url}`);
}
async function connectCdp(url) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let sequence = 0; const pending = new Map(); const events = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data); if (!message.id) return events.push(message);
    const callback = pending.get(message.id); if (!callback) return; pending.delete(message.id);
    message.error ? callback.reject(new Error(message.error.message)) : callback.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => { const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text); return result.result.value; };
  return { socket, send, evaluate, events };
}
async function waitFor(evaluate, expression, timeout = 12000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { if (await evaluate(expression)) return; await new Promise((resolve) => setTimeout(resolve, 40)); }
  throw new Error(`Timed out waiting for DOM condition: ${expression}`);
}

test("영어 1단계 12문항과 다음 사이클이 실제 객관식 DOM에서 이어진다", { timeout: 90000 }, async () => {
  const chromePath = CHROME_PATHS.find(fs.existsSync); assert.ok(chromePath);
  const app = await startStaticServer(); const debugPort = await freePort();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "study-english-quality-dom-"));
  const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profileDir}`, `http://127.0.0.1:${app.port}/index.html`], { stdio: "ignore", windowsHide: true });
  let cdp;
  try {
    const targets = await waitForJson(`http://127.0.0.1:${debugPort}/json/list`);
    const page = targets.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${app.port}`));
    cdp = await connectCdp(page.webSocketDebuggerUrl); await cdp.send("Runtime.enable");
    await waitFor(cdp.evaluate, `document.readyState==="complete" && window.STUDY_ENGLISH_LEVEL1_CONTENT?.problems?.length===120 && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`localStorage.clear(); localStorage.setItem("studyCoinCurrentUser","quality@example.com"); localStorage.setItem("studyCoinAuth",JSON.stringify({"quality@example.com":{id:"quality@example.com",uid:"quality-dom",provider:"password",onboardingComplete:true}})); true`);
    await cdp.send("Page.reload", { ignoreCache: true }); await new Promise((resolve) => setTimeout(resolve, 400));
    await waitFor(cdp.evaluate, `document.readyState==="complete" && window.STUDY_ENGLISH_LEVEL1_CONTENT?.problems?.length===120 && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`window.__qualityErrors=[]; addEventListener("error",e=>window.__qualityErrors.push(String(e.error?.stack||e.message))); addEventListener("unhandledrejection",e=>window.__qualityErrors.push(String(e.reason?.stack||e.reason))); window.STUDY_CLOUD_AUTH={isConfigured:false,stateSyncEnabled:false}; true`);
    const fullCourseRender = await cdp.evaluate(`(() => {
      const failures=[]; const main=document.querySelector('#subjectLearningMain'); const actions=document.querySelector('#subjectLearningActions');
      const stages=window.STUDY_SUBJECT_CONTENT.english.stages.filter(stage=>/^EN-L[1-5]-CYCLE-/.test(stage.id));
      for(const stage of stages){
        const questions=stage.courseStages[0].questions;
        const samples=[questions[0],questions.find(q=>q.passage),questions.find(q=>q.independentCheck)].filter(Boolean);
        for(const question of samples){
          const normalized=window.STUDY_ENGLISH_LEARNING.normalizeQuestion(question,{levelId:stage.levelId,courseId:stage.id,stageId:stage.courseStages[0].stageId});
          window.STUDY_ENGLISH_UI.render({question:normalized,main,actions,response:'',feedback:null,onChange(){},onHint(){},onSubmit(){},onNext(){}});
          const text=main.textContent; const choices=main.querySelectorAll('[data-english-choice]').length;
          if(!normalized.question||choices!==4||/misconception|EN-L[1-5]-CYCLE/i.test(text)) failures.push({id:question.id,choices,text});
        }
      }
      return {stageCount:stages.length,failures};
    })()`);
    assert.equal(fullCourseRender.stageCount, 50);
    assert.deepEqual(fullCourseRender.failures, []);
    await cdp.evaluate(`window.STUDY_NAV.go("study-empty"); document.querySelector('[data-subject-learning="english"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('[data-screen="subject-learning"]')?.classList.contains("active") && document.querySelector('[data-roadmap-index="0"]')`);
    await cdp.evaluate(`document.querySelector('[data-roadmap-index="0"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelectorAll('#subjectLearningMain [data-english-choice]').length===4`);

    const rendered = [];
    for (let index = 0; index < 12; index += 1) {
      const expectedId = `EN-L1-CYCLE-01-Q${String(index + 1).padStart(2, "0")}`;
      await waitFor(cdp.evaluate, `document.querySelector('#subjectLearningMain h2')?.textContent.trim()===window.STUDY_ENGLISH_LEVEL1_CONTENT.problems.find(p=>p.problemId===${JSON.stringify(expectedId)}).prompt`);
      const surface = await cdp.evaluate(`(() => { const problem=window.STUDY_ENGLISH_LEVEL1_CONTENT.problems.find(p=>p.problemId===${JSON.stringify(expectedId)}); return {problemId:problem.problemId,prompt:document.querySelector('#subjectLearningMain h2').textContent.trim(),choices:[...document.querySelectorAll('#subjectLearningMain [data-english-choice]')].map(b=>b.textContent.trim()),text:document.querySelector('#subjectLearningMain').textContent}; })()`);
      assert.equal(surface.choices.length, 4); assert.doesNotMatch(surface.text, /\b([A-Za-z]+)\s+\1\b/i); assert.doesNotMatch(surface.text, /MISCONCEPTION|EN-L1-CYCLE/i);
      rendered.push({ prompt: surface.prompt, choices: surface.choices });
      await cdp.evaluate(`(() => { const p=window.STUDY_ENGLISH_LEVEL1_CONTENT.problems.find(x=>x.problemId===${JSON.stringify(expectedId)}); const answer=p.choices[p.correctChoiceIndex]; [...document.querySelectorAll('#subjectLearningMain [data-english-choice]')].find(b=>b.textContent.trim()===answer).click(); document.querySelector('#subjectLearningActions [data-english-submit]').click(); return true; })()`);
      await waitFor(cdp.evaluate, `!!document.querySelector('#subjectLearningActions [data-english-next]')`);
      await cdp.evaluate(`document.querySelector('#subjectLearningActions [data-english-next]').click(); true`);
      if (index < 11) await waitFor(cdp.evaluate, `document.querySelectorAll('#subjectLearningMain [data-english-choice]').length===4`);
    }
    assert.equal(new Set(rendered.map((item) => item.prompt)).size, 12);
    assert.ok(rendered.some((item) => item.prompt.includes("lesson")));
    assert.ok(rendered.some((item) => item.prompt.startsWith("Where")));
    assert.ok(rendered.some((item) => item.prompt.startsWith("Why")));

    const supplementalCount = await cdp.evaluate(`window.STUDY_SUBJECT_CONTENT.english.stages.find(stage=>stage.id==="EN-L1-CYCLE-01").courseStages[0].questions.length-12`);
    assert.ok(supplementalCount >= 0 && supplementalCount <= 4);
    for (let index = 0; index < supplementalCount; index += 1) {
      await waitFor(cdp.evaluate, `document.querySelectorAll('#subjectLearningMain [data-english-choice]').length===4`);
      await cdp.evaluate(`(() => { const questions=window.STUDY_SUBJECT_CONTENT.english.stages.find(stage=>stage.id==="EN-L1-CYCLE-01").courseStages[0].questions; const prompt=document.querySelector('#subjectLearningMain h2').textContent.trim(); const p=questions.find(item=>item.question===prompt); const normalized=window.STUDY_ENGLISH_LEARNING.normalizeQuestion(p,{levelId:'EN-QUALITY-L1',courseId:'EN-L1-CYCLE-01',stageId:'EN-L1-CYCLE-01-STAGE'}); const buttons=[...document.querySelectorAll('#subjectLearningMain [data-english-choice]')]; const button=buttons.find(item=>item.textContent.trim()===normalized.correctAnswer); if(!button) throw new Error(JSON.stringify({prompt,p,normalized,buttons:buttons.map(b=>b.textContent.trim())})); button.click(); document.querySelector('#subjectLearningActions [data-english-submit]').click(); return true; })()`);
      await waitFor(cdp.evaluate, `!!document.querySelector('#subjectLearningActions [data-english-next]')`);
      await cdp.evaluate(`document.querySelector('#subjectLearningActions [data-english-next]').click(); true`);
    }

    await waitFor(cdp.evaluate, `document.querySelector('[data-roadmap-index="1"]:not([disabled])')`);
    await cdp.evaluate(`document.querySelector('[data-roadmap-index="1"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('#subjectLearningMain h2')?.textContent.trim()===window.STUDY_ENGLISH_LEVEL1_CONTENT.problems.find(p=>p.problemId==="EN-L1-CYCLE-02-Q01").prompt`);

    const storageBefore = await cdp.evaluate(`localStorage.getItem("studyCoinSubjectLearningV2:quality@example.com")`);
    assert.ok(storageBefore?.includes("EN-L1-CYCLE-02"));
    await cdp.send("Page.reload", { ignoreCache: true }); await new Promise((resolve) => setTimeout(resolve, 400));
    await waitFor(cdp.evaluate, `document.readyState==="complete" && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:false,stateSyncEnabled:false}; window.STUDY_NAV.go("study-empty"); document.querySelector('[data-subject-learning="english"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('#subjectLearningMain h2')?.textContent.trim()===window.STUDY_ENGLISH_LEVEL1_CONTENT.problems.find(p=>p.problemId==="EN-L1-CYCLE-02-Q01").prompt`);
    for (const completedCount of [10, 20, 30, 40]) {
      await cdp.evaluate(`(() => { const key="studyCoinSubjectLearningV2:quality@example.com"; const saved=JSON.parse(localStorage.getItem(key)); const english=saved.subjects.english; const ids=window.STUDY_SUBJECT_CONTENT.english.stages.filter(s=>/^EN-L[1-5]-CYCLE-/.test(s.id)).slice(0,${completedCount}).map(s=>s.id); english.completedStages=[...new Set([...(english.completedStages||[]),...ids])]; english.completedEnglishStageIds=[...new Set([...(english.completedEnglishStageIds||[]),...ids.map(id=>id+'-STAGE')])]; english.stageIndex=${completedCount}; english.mode='tree'; english.resumeMode='tree'; english.queue=[]; english.activeEnglishStageId=null; localStorage.setItem(key,JSON.stringify(saved)); return true; })()`);
      await cdp.send("Page.reload", { ignoreCache: true }); await new Promise((resolve) => setTimeout(resolve, 350));
      await waitFor(cdp.evaluate, `document.readyState==="complete" && typeof window.STUDY_NAV?.go==="function"`);
      await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:false,stateSyncEnabled:false}; window.STUDY_NAV.go("study-empty"); document.querySelector('[data-subject-learning="english"]').click(); true`);
      await waitFor(cdp.evaluate, `document.querySelector('[data-roadmap-index="${completedCount}"]:not([disabled])')`);
      await cdp.evaluate(`document.querySelector('[data-roadmap-index="${completedCount}"]').click(); true`);
      const targetLevel = Math.floor(completedCount / 10) + 1;
      await waitFor(cdp.evaluate, `document.querySelector('#subjectLearningMain h2')?.textContent.trim()===window['STUDY_ENGLISH_LEVEL${targetLevel}_CONTENT'].problems[0].prompt`);
    }
    await cdp.evaluate(`(() => { const key="studyCoinSubjectLearningV2:quality@example.com"; const saved=JSON.parse(localStorage.getItem(key)); const english=saved.subjects.english; const stages=window.STUDY_SUBJECT_CONTENT.english.stages.filter(s=>/^EN-L[1-5]-CYCLE-/.test(s.id)); english.completedStages=[...new Set([...(english.completedStages||[]),...stages.map(s=>s.id)])]; english.completedEnglishStageIds=[...new Set([...(english.completedEnglishStageIds||[]),...stages.map(s=>s.id+'-STAGE')])]; english.mode='tree'; english.resumeMode='tree'; english.queue=[]; english.activeEnglishStageId=null; localStorage.setItem(key,JSON.stringify(saved)); return true; })()`);
    await cdp.send("Page.reload", { ignoreCache: true }); await new Promise((resolve) => setTimeout(resolve, 350));
    await waitFor(cdp.evaluate, `document.readyState==="complete" && typeof window.STUDY_NAV?.go==="function"`);
    await cdp.evaluate(`window.STUDY_CLOUD_AUTH={isConfigured:false,stateSyncEnabled:false}; window.STUDY_NAV.go("study-empty"); document.querySelector('[data-subject-learning="english"]').click(); true`);
    await waitFor(cdp.evaluate, `!!document.querySelector('[data-subject-action="open-english-article-path"]')`);
    await cdp.evaluate(`document.querySelector('[data-subject-action="open-english-article-path"]').click(); true`);
    await waitFor(cdp.evaluate, `document.querySelector('#subjectLearningMain h2')?.textContent.trim()===window.STUDY_ENGLISH_LEVEL5_CONTENT.problems.find(p=>p.cycleId==="EN-L5-CYCLE-05"&&p.questionType==="TOEFL_READING").prompt`);
    assert.deepEqual(await cdp.evaluate(`window.__qualityErrors || []`), []);
    assert.equal(cdp.events.filter((event) => event.method === "Runtime.exceptionThrown").length, 0);
  } finally {
    try { cdp?.socket.close(); } catch {}
    chrome.kill();
    await Promise.race([new Promise((resolve) => chrome.once("exit", resolve)), new Promise((resolve) => setTimeout(resolve, 1500))]);
    await new Promise((resolve) => app.server.close(resolve));
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
  }
});
