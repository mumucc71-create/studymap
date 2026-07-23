(function (root, factory) {
  const api = factory(root || globalThis);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MIDDLE3_STAGE_QUESTION_BANK = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const VERSION = "m3-stage-bank-v2";
  const detailData = root.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS || {};
  const STAGE_LEVEL = Object.freeze({ A1: 2, A2: 3, A3: 4, A4: 5, A5: 6 });

  function normalized(value) {
    return String(value ?? "").trim().replace(/\s+/g, " ");
  }

  function promptOf(problem) {
    return String(problem?.questionText || problem?.problem || "").trim();
  }

  function distinctChoices(correct, candidates) {
    const answer = normalized(correct);
    const values = [answer, ...candidates.map(normalized)].filter(Boolean);
    const unique = [];
    values.forEach((value) => {
      if (!unique.includes(value)) unique.push(value);
    });
    [
      "계산 과정에 오류가 있어 판단할 수 없다",
      "주어진 조건만으로 정할 수 없다",
      "위의 어느 것도 아니다",
      "모든 경우가 가능하다",
    ].forEach((fallback) => {
      if (unique.length < 4 && !unique.includes(fallback)) unique.push(fallback);
    });
    return unique.slice(0, 4);
  }

  function wrongChoice(problem, offset = 0) {
    const answer = normalized(problem?.answer);
    const wrong = (problem?.choices || []).map(normalized).filter((choice) => choice && choice !== answer);
    return wrong[offset % Math.max(1, wrong.length)] || "다른 값";
  }

  function makeProblem(definition, stage, family, index, config) {
    const stageToken = stage.toLowerCase();
    const id = `m3-stage-${definition.conceptId}-${stageToken}-${family}-${index + 1}`;
    const rawChoices = distinctChoices(config.answer, config.choices || []);
    const rotation = (Number(definition.order || 0) + STAGE_LEVEL[stage] + index) % rawChoices.length;
    const choices = [...rawChoices.slice(rotation), ...rawChoices.slice(0, rotation)];
    const componentConceptIds = [...new Set(config.componentConceptIds || [definition.conceptId])];
    const prerequisiteConcepts = [...new Set([
      ...(definition.prerequisiteConceptIds || []),
      ...componentConceptIds.filter((conceptId) => conceptId !== definition.conceptId),
    ])];
    const solveTimeByStage = { A1: 70, A2: 100, A3: 135, A4: 170, A5: 190 };
    return Object.freeze({
      id,
      questionId: id,
      conceptId: definition.conceptId,
      unitId: definition.unitId,
      unit: definition.unitTitle,
      concept: definition.conceptName,
      questionText: config.prompt,
      problem: config.prompt,
      answer: normalized(config.answer),
      choices: Object.freeze(choices),
      explanation: config.explanation,
      difficulty: STAGE_LEVEL[stage],
      adaptiveLevel: STAGE_LEVEL[stage],
      stage,
      problemType: "choice",
      questionType: "choice",
      problemFamilyId: `${definition.conceptId}:${stage}:${family}:${index + 1}`,
      structureSignature: `structure:stage-expansion:${definition.conceptId}:${stage}:${family}:${index + 1}`,
      solutionPathSignature: `solution:stage-expansion:${definition.conceptId}:${stage}:${family}:${config.pathKey}`,
      prerequisiteConcepts: Object.freeze(prerequisiteConcepts),
      componentConceptIds: Object.freeze(componentConceptIds),
      estimatedSolveTime: solveTimeByStage[stage] || 135,
      sourceSeedIds: Object.freeze(config.seeds.map((seed) => seed.questionId || seed.id)),
      reviewStatus: "AUTO_APPROVED",
      executionStatus: "EXECUTABLE",
      mode: "STANDARD",
      grade: "중등 3학년",
      bank: "m3-stage-expansion",
      code: "M3-STANDARD-APPROVED",
    });
  }

  function createA1(definition, seed, index) {
    const answer = normalized(seed.answer);
    const wrong = wrongChoice(seed, index);
    return makeProblem(definition, "A1", "verification", index, {
      seeds: [seed],
      pathKey: `verify-${seed.problemFamilyId || index + 1}`,
      prompt: [
        "다음 문제를 푼 뒤 답을 원래 조건으로 검산하려고 합니다.",
        `[문제] ${promptOf(seed)}`,
        `학생이 고른 답: ${answer}`,
        "검산 결과로 알맞은 것은?",
      ].join("\n"),
      answer: `${answer}: 원래 조건을 만족하므로 옳다`,
      choices: [
        `${wrong}: 원래 조건을 만족하므로 옳다`,
        `${answer}: 원래 조건을 만족하지 않으므로 틀리다`,
        `${wrong}: 원래 조건을 만족하지 않으므로 틀리다`,
      ],
      explanation: `문제를 직접 풀어 ${answer}를 얻은 뒤 정의, 식 또는 주어진 조건에 다시 대입하면 조건을 만족합니다.`,
    });
  }

  function pairText(first, second, separator) {
    return `${normalized(first)}${separator}${normalized(second)}`;
  }

  function createA2(definition, seeds, index) {
    const [first, second] = seeds;
    const firstAnswer = normalized(first.answer);
    const secondAnswer = normalized(second.answer);
    const firstWrong = wrongChoice(first, index);
    const secondWrong = wrongChoice(second, index + 1);
    const answer = pairText(firstAnswer, secondAnswer, " → ");
    return makeProblem(definition, "A2", "two-step", index, {
      seeds,
      pathKey: `pair-${first.problemFamilyId || index + 1}-${second.problemFamilyId || index + 2}`,
      prompt: [
        "(가)와 (나)를 차례로 해결해야 합니다.",
        `(가) ${promptOf(first)}`,
        `(나) ${promptOf(second)}`,
        "두 결과를 (가) → (나)의 순서로 바르게 나타낸 것은?",
      ].join("\n"),
      answer,
      choices: [
        pairText(firstWrong, secondAnswer, " → "),
        pairText(firstAnswer, secondWrong, " → "),
        pairText(firstWrong, secondWrong, " → "),
      ],
      explanation: `(가)를 풀면 ${firstAnswer}, (나)를 풀면 ${secondAnswer}입니다. 두 단계를 순서대로 정리하면 ${answer}입니다.`,
    });
  }

  function tripleText(first, second, third) {
    return `${normalized(first)} → ${normalized(second)} → ${normalized(third)}`;
  }

  function createA3(definition, seeds, index) {
    const [first, second, third] = seeds;
    const answers = seeds.map((seed) => normalized(seed.answer));
    const wrong = seeds.map((seed, seedIndex) => wrongChoice(seed, index + seedIndex));
    const answer = tripleText(...answers);
    return makeProblem(definition, "A3", "three-condition", index, {
      seeds,
      pathKey: `chain-${seeds.map((seed) => seed.problemFamilyId || seed.questionId).join("-")}`,
      prompt: [
        "세 조건을 모두 처리하여 결과 묶음을 완성해야 합니다.",
        `(가) ${promptOf(first)}`,
        `(나) ${promptOf(second)}`,
        `(다) ${promptOf(third)}`,
        "(가) → (나) → (다)의 순서로 바르게 나타낸 것은?",
      ].join("\n"),
      answer,
      choices: [
        tripleText(wrong[0], answers[1], answers[2]),
        tripleText(answers[0], wrong[1], answers[2]),
        tripleText(answers[0], answers[1], wrong[2]),
      ],
      explanation: `(가), (나), (다)를 각각 해결하면 ${answers[0]}, ${answers[1]}, ${answers[2]}입니다. 따라서 결과 묶음은 ${answer}입니다.`,
    });
  }

  function createA4(definition, seeds, index) {
    const answers = seeds.map((seed) => normalized(seed.answer));
    const wrong = seeds.map((seed, seedIndex) => wrongChoice(seed, index + seedIndex));
    const componentConceptIds = seeds.map((seed) => seed.conceptId);
    const answer = tripleText(...answers);
    return makeProblem(definition, "A4", "cross-concept-integration", index, {
      seeds,
      componentConceptIds,
      pathKey: `integrate-${componentConceptIds.join("-")}-${seeds.map((seed) => seed.problemFamilyId || seed.questionId).join("-")}`,
      prompt: [
        "서로 다른 세 개념을 연결하여 결과를 완성해야 합니다.",
        `(가) ${promptOf(seeds[0])}`,
        `(나) ${promptOf(seeds[1])}`,
        `(다) ${promptOf(seeds[2])}`,
        "세 결과를 (가) → (나) → (다)의 순서로 바르게 나타낸 것은?",
      ].join("\n"),
      answer,
      choices: [
        tripleText(wrong[0], answers[1], answers[2]),
        tripleText(answers[0], wrong[1], answers[2]),
        tripleText(answers[0], answers[1], wrong[2]),
      ],
      explanation: `세 개념을 각각 적용하면 (가) ${answers[0]}, (나) ${answers[1]}, (다) ${answers[2]}입니다. 따라서 종합 결과는 ${answer}입니다.`,
    });
  }

  function correctionText(label, answer) {
    return `${label}가 틀렸고, 바른 답은 ${normalized(answer)}이다`;
  }

  function createA5(definition, seeds, index) {
    const labels = ["(가)", "(나)", "(다)"];
    const answers = seeds.map((seed) => normalized(seed.answer));
    const wrongAnswers = seeds.map((seed, seedIndex) => wrongChoice(seed, index + seedIndex));
    const errorIndex = index % seeds.length;
    const studentAnswers = answers.map((answer, seedIndex) => (
      seedIndex === errorIndex ? wrongAnswers[seedIndex] : answer
    ));
    const componentConceptIds = seeds.map((seed) => seed.conceptId);
    const answer = correctionText(labels[errorIndex], answers[errorIndex]);
    return makeProblem(definition, "A5", "error-analysis", index, {
      seeds,
      componentConceptIds,
      pathKey: `error-${errorIndex}-${componentConceptIds.join("-")}-${seeds.map((seed) => seed.problemFamilyId || seed.questionId).join("-")}`,
      prompt: [
        "학생이 서로 다른 세 개념의 문제를 풀었습니다. 세 풀이를 검산하여 오류를 찾으세요.",
        `${labels[0]} ${promptOf(seeds[0])}  |  학생 답: ${studentAnswers[0]}`,
        `${labels[1]} ${promptOf(seeds[1])}  |  학생 답: ${studentAnswers[1]}`,
        `${labels[2]} ${promptOf(seeds[2])}  |  학생 답: ${studentAnswers[2]}`,
        "틀린 답과 바르게 고친 결과를 함께 고른 것은?",
      ].join("\n"),
      answer,
      choices: [
        correctionText(labels[(errorIndex + 1) % 3], answers[(errorIndex + 1) % 3]),
        correctionText(labels[(errorIndex + 2) % 3], answers[(errorIndex + 2) % 3]),
        "세 학생 답이 모두 옳다",
      ],
      explanation: `(가), (나), (다)의 바른 답은 차례로 ${answers[0]}, ${answers[1]}, ${answers[2]}입니다. 학생 답과 비교하면 ${answer}.`,
    });
  }

  function buildCandidates() {
    const problemsByConcept = new Map();
    (detailData.problems || []).forEach((problem) => {
      if (!problemsByConcept.has(problem.conceptId)) problemsByConcept.set(problem.conceptId, []);
      problemsByConcept.get(problem.conceptId).push(problem);
    });

    const definitions = detailData.concepts || [];
    const definitionById = new Map(definitions.map((definition) => [definition.conceptId, definition]));
    const relatedDefinitions = (definition) => {
      const directPrerequisites = (definition.prerequisiteConceptIds || [])
        .map((conceptId) => definitionById.get(conceptId))
        .filter(Boolean);
      const sameUnit = definitions.filter((candidate) => (
        candidate.unitId === definition.unitId && candidate.conceptId !== definition.conceptId
      ));
      const nearby = definitions.filter((candidate) => candidate.conceptId !== definition.conceptId);
      const unique = [];
      [...directPrerequisites, ...sameUnit, ...nearby].forEach((candidate) => {
        if (!unique.some((item) => item.conceptId === candidate.conceptId)) unique.push(candidate);
      });
      return unique;
    };

    const candidates = [];
    definitions.forEach((definition) => {
      const seeds = problemsByConcept.get(definition.conceptId) || [];
      if (seeds.length < 4) return;
      seeds.slice(0, 3).forEach((seed, index) => candidates.push(createA1(definition, seed, index)));
      [[0, 1], [1, 2], [2, 3]].forEach((indexes, index) => {
        candidates.push(createA2(definition, indexes.map((seedIndex) => seeds[seedIndex]), index));
      });
      [[0, 1, 2], [1, 2, 3], [2, 3, 0]].forEach((indexes, index) => {
        candidates.push(createA3(definition, indexes.map((seedIndex) => seeds[seedIndex]), index));
      });
      const related = relatedDefinitions(definition);
      if (related.length < 2) return;
      for (let index = 0; index < 3; index += 1) {
        const firstRelated = related[index % related.length];
        let secondRelated = related[(index + 1) % related.length];
        if (secondRelated.conceptId === firstRelated.conceptId) {
          secondRelated = related[(index + 2) % related.length];
        }
        const firstRelatedSeeds = problemsByConcept.get(firstRelated.conceptId) || [];
        const secondRelatedSeeds = problemsByConcept.get(secondRelated.conceptId) || [];
        if (firstRelatedSeeds.length < 4 || secondRelatedSeeds.length < 4) continue;
        const a4Seeds = [
          seeds[index],
          firstRelatedSeeds[index],
          secondRelatedSeeds[(index + 1) % 4],
        ];
        const a5Seeds = [
          seeds[(index + 1) % 4],
          firstRelatedSeeds[(index + 2) % 4],
          secondRelatedSeeds[index],
        ];
        candidates.push(createA4(definition, a4Seeds, index));
        candidates.push(createA5(definition, a5Seeds, index));
      }
    });
    return Object.freeze(candidates);
  }

  const candidates = buildCandidates();

  return Object.freeze({
    VERSION,
    STAGE_LEVEL,
    candidates,
  });
});
