(function (root, factory) {
  const api = factory(root?.STUDY_ENGLISH_LEARNING);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_UI = api;
})(typeof window !== "undefined" ? window : globalThis, function (model) {
  "use strict";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[character]));

  const parseResponse = (value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  const serializeResponse = (value) => typeof value === "string" ? value : JSON.stringify(value);

  function answerMarkup(question, response) {
    const selected = parseResponse(response);
    if (["multipleChoice", "contextChoice", "shortReading", "sentenceInsertion", "mainIdea", "logicalBlank", "evidenceFinding", "summaryChoice", "sentenceConnection"].includes(question.answerType)) {
      return `<div class="subject-choice-list english-structured-choices">${question.choices.map((choice) => (
        `<button type="button" class="${selected === choice ? "is-selected" : ""}" data-english-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`
      )).join("")}</div>`;
    }
    if (question.answerType === "fillBlank" || question.answerType === "textInput") {
      return `<label class="subject-answer-input"><span>답을 영어로 입력하세요.</span><input id="englishStructuredInput" value="${escapeHtml(selected || "")}" autocomplete="off" autocapitalize="none" spellcheck="false"></label>`;
    }
    if (question.answerType === "wordOrder" || question.answerType === "paragraphOrder") {
      const tokens = question.metadata.tokens.length ? question.metadata.tokens : question.choices;
      const ordered = Array.isArray(selected) ? selected : [];
      const remaining = tokens.filter((token, index) => !ordered.some((item, selectedIndex) => item === token && selectedIndex === tokens.indexOf(token, index)));
      return `<section class="english-word-order">
        <div class="english-order-answer">${ordered.length ? ordered.map((token, index) => `<button type="button" data-english-remove-token="${index}">${escapeHtml(token)}</button>`).join("") : "<span>단어를 순서대로 선택하세요.</span>"}</div>
        <div class="english-order-bank">${remaining.map((token) => `<button type="button" data-english-add-token="${escapeHtml(token)}">${escapeHtml(token)}</button>`).join("")}</div>
        <button type="button" class="learning-text-button" data-english-reset-order>전체 초기화</button>
      </section>`;
    }
    if (question.answerType === "errorFinding") {
      const tokens = question.metadata.tokens.length ? question.metadata.tokens : question.question.split(/\s+/);
      return `<div class="english-error-tokens">${tokens.map((token, index) => (
        `<button type="button" class="${selected === token || selected === String(index) ? "is-selected" : ""}" data-english-error-token="${escapeHtml(token)}" data-english-error-index="${index}">${escapeHtml(token)}</button>`
      )).join("")}</div>`;
    }
    if (question.answerType === "matching") {
      const pairs = question.metadata.matchingPairs.length
        ? question.metadata.matchingPairs
        : (question.correctAnswer && typeof question.correctAnswer === "object" ? Object.entries(question.correctAnswer).map(([left, right]) => ({ left, right })) : []);
      const matches = selected && typeof selected === "object" && !Array.isArray(selected) ? selected : {};
      return `<section class="english-matching" data-english-matching>
        <div>${pairs.map((pair) => `<button type="button" class="${matches[pair.left] ? "is-linked" : ""}" data-english-match-left="${escapeHtml(pair.left)}">${escapeHtml(pair.left)}</button>`).join("")}</div>
        <div>${pairs.slice().reverse().map((pair) => `<button type="button" data-english-match-right="${escapeHtml(pair.right)}">${escapeHtml(pair.right)}</button>`).join("")}</div>
        <p>${Object.entries(matches).map(([left, right]) => `${escapeHtml(left)} ↔ ${escapeHtml(right)}`).join(" · ") || "왼쪽 항목과 오른쪽 항목을 차례로 선택하세요."}</p>
      </section>`;
    }
    return `<section class="subject-inline-explanation english-safe-fallback"><span>안전 입력 모드</span><p>이 문제 유형은 기본 텍스트 입력으로 표시됩니다.</p><label class="subject-answer-input"><input id="englishStructuredInput" value="${escapeHtml(selected || "")}"></label></section>`;
  }

  function render(options = {}) {
    if (!model || !options.main || !options.actions) return false;
    const question = model.normalizeQuestion(options.question || {});
    let response = parseResponse(options.response);
    let pendingLeft = null;
    const feedback = options.feedback || null;
    const stage = model.getStage(question.stage);
    const fallback = question.metadata.answerTypeFallback
      ? `<p class="english-answer-fallback">기존 문제 유형 '${escapeHtml(question.metadata.originalAnswerType)}'을 안전 입력 방식으로 변환했습니다.</p>`
      : "";
    const repaint = () => render({ ...options, question, response: serializeResponse(response) });

    options.main.innerHTML = `<article class="subject-question-card english-structured-question ${feedback ? (feedback.correct ? "is-correct" : "is-wrong") : ""}">
      <span class="subject-question-number">${escapeHtml(stage.displayName)} · ${escapeHtml(question.category)}</span>
      ${question.instruction ? `<p class="english-question-instruction">${escapeHtml(question.instruction)}</p>` : ""}
      ${question.passage ? `<section class="subject-passage"><p>${escapeHtml(question.passage)}</p></section>` : ""}
      <h2>${escapeHtml(question.question)}</h2>
      ${fallback}
      ${answerMarkup(question, response)}
      ${feedback ? `<section class="subject-feedback"><b>${feedback.correct ? "정답이에요." : "복습 목록에 추가했어요."}</b><p>${escapeHtml(question.explanation)}</p>${feedback.errorTags?.length ? `<small>${feedback.errorTags.map((tag) => escapeHtml(ERROR_LABELS[tag] || tag)).join(" · ")}</small>` : ""}</section>` : ""}
    </article>`;
    options.actions.innerHTML = feedback
      ? `<button class="primary subject-primary" type="button" data-english-next>다음 문제</button>`
      : `<button class="secondary subject-hint" type="button" data-english-hint>힌트</button><button class="primary subject-primary" type="button" data-english-submit>정답 확인</button>`;

    const update = (next) => {
      response = next;
      options.onChange?.(serializeResponse(next));
    };

    options.main.querySelectorAll("[data-english-choice]").forEach((button) => {
      button.addEventListener("click", () => { update(button.dataset.englishChoice); repaint(); });
    });
    options.main.querySelector("#englishStructuredInput")?.addEventListener("input", (event) => update(event.target.value));
    options.main.querySelectorAll("[data-english-add-token]").forEach((button) => {
      button.addEventListener("click", () => { update([...(Array.isArray(response) ? response : []), button.dataset.englishAddToken]); repaint(); });
    });
    options.main.querySelectorAll("[data-english-remove-token]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = [...(Array.isArray(response) ? response : [])];
        next.splice(Number(button.dataset.englishRemoveToken), 1);
        update(next);
        repaint();
      });
    });
    options.main.querySelector("[data-english-reset-order]")?.addEventListener("click", () => { update([]); repaint(); });
    options.main.querySelectorAll("[data-english-error-token]").forEach((button) => {
      button.addEventListener("click", () => { update(button.dataset.englishErrorToken); repaint(); });
    });
    options.main.querySelectorAll("[data-english-match-left]").forEach((button) => {
      button.addEventListener("click", () => {
        pendingLeft = button.dataset.englishMatchLeft;
        options.main.querySelectorAll("[data-english-match-left]").forEach((item) => item.classList.toggle("is-selected", item === button));
      });
    });
    options.main.querySelectorAll("[data-english-match-right]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!pendingLeft) return;
        update({ ...(response && typeof response === "object" ? response : {}), [pendingLeft]: button.dataset.englishMatchRight });
        repaint();
      });
    });
    options.actions.querySelector("[data-english-submit]")?.addEventListener("click", () => {
      const input = options.main.querySelector("#englishStructuredInput");
      if (input) update(input.value);
      if (response == null || response === "" || (Array.isArray(response) && !response.length) || (typeof response === "object" && !Array.isArray(response) && !Object.keys(response).length)) {
        return rootAlert("답을 먼저 선택하거나 입력해 주세요.");
      }
      options.onSubmit?.(response, question);
    });
    options.actions.querySelector("[data-english-next]")?.addEventListener("click", () => options.onNext?.());
    options.actions.querySelector("[data-english-hint]")?.addEventListener("click", () => options.onHint?.(question));
    return true;
  }

  const ERROR_LABELS = Object.freeze({
    unknownWordMeaning: "단어 뜻 미확인",
    contextMeaningFailure: "문맥 의미 판단",
    wordOrderError: "어순 오류",
    tenseError: "시제 오류",
    subjectVerbAgreementError: "주어·동사 수 일치",
    conjunctionConfusion: "접속 표현 혼동",
    complexSentenceParsingFailure: "복문 구조 해석",
    referenceTargetConfusion: "지시 대상 혼동",
    unsupportedInference: "근거 없는 추론",
    optionScopeExaggeration: "선택지 범위 과장",
    reversedCausality: "인과관계 역전",
    changedSubject: "주체 변경",
    partiallyCorrectOptionTrap: "부분 정답 함정",
  });

  function rootAlert(message) {
    if (typeof alert === "function") alert(message);
  }

  return { render, answerMarkup, parseResponse, serializeResponse, ERROR_LABELS };
});
