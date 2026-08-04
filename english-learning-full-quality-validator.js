(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_FULL_QUALITY = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const REQUIRED = ["problemId","level","cycleId","sentenceFamilyId","questionType","prompt","choices","correctChoiceIndex","choiceMisconceptionTags","targetVocabularyIds","reviewVocabularyIds","targetGrammarIds","reviewGrammarIds","structureSignature","contextDomain","difficulty","difficultyEvidence","explanation","independentCheck"];
  const BAD_ADJACENT = /\b([A-Za-z]+)\s+\1\b/i;
  const MIXED_PARTICLE = /[A-Za-z][A-Za-z' -]*(?:을|를|은|는|이|가|과|와|으로|에서|에게|의)(?=\s|[.,!?]|$)/u;
  const TERMINAL_PUNCTUATION_ONLY = (a, b) => a.replace(/[.!?]/g, "") === b.replace(/[.!?]/g, "") && a !== b;

  function duplicateValues(values) {
    const seen = new Set(); const duplicate = new Set();
    values.forEach((value) => seen.has(value) ? duplicate.add(value) : seen.add(value));
    return [...duplicate];
  }

  function validateProblem(problem, issues) {
    REQUIRED.forEach((field) => {
      if (problem[field] === undefined || problem[field] === null || problem[field] === "") issues.push(`${problem.problemId || "UNKNOWN"}:MISSING_${field}`);
    });
    if (!Array.isArray(problem.choices) || problem.choices.length !== 4) issues.push(`${problem.problemId}:CHOICE_COUNT`);
    if (new Set(problem.choices).size !== 4) issues.push(`${problem.problemId}:DUPLICATE_CHOICE`);
    if (!Number.isInteger(problem.correctChoiceIndex) || problem.correctChoiceIndex < 0 || problem.correctChoiceIndex > 3) issues.push(`${problem.problemId}:ANSWER_INDEX`);
    if (problem.choiceMisconceptionTags?.length !== 4) issues.push(`${problem.problemId}:TAG_COUNT`);
    problem.choiceMisconceptionTags?.forEach((tag, index) => {
      if (index === problem.correctChoiceIndex ? tag !== "CORRECT" : !tag || tag === "CORRECT") issues.push(`${problem.problemId}:TAG_${index}`);
    });
    const strings = [problem.prompt, ...problem.choices];
    strings.forEach((text) => {
      if (BAD_ADJACENT.test(text)) issues.push(`${problem.problemId}:ADJACENT_DUPLICATE`);
      if (MIXED_PARTICLE.test(text)) issues.push(`${problem.problemId}:MIXED_PARTICLE`);
    });
    const answer = problem.choices[problem.correctChoiceIndex] || "";
    problem.choices.forEach((choice, index) => {
      if (index !== problem.correctChoiceIndex && TERMINAL_PUNCTUATION_ONLY(answer, choice)) issues.push(`${problem.problemId}:PUNCTUATION_ONLY_DISTRACTOR`);
    });
    if ((problem.passageId || problem.questionType.startsWith("READING") || problem.questionType === "TOEFL_READING") && !problem.passage) issues.push(`${problem.problemId}:MISSING_PASSAGE`);
  }

  function validateCourse(levels, options = {}) {
    const ordered = levels.filter(Boolean).sort((a,b)=>a.level-b.level);
    const cycles = ordered.flatMap((level)=>level.cycles);
    const problems = ordered.flatMap((level)=>level.problems);
    const issues = [];
    if (cycles.length < 50) issues.push(`COURSE:CYCLE_COUNT_${cycles.length}`);
    if (problems.length < 600) issues.push(`COURSE:PROBLEM_COUNT_${problems.length}`);
    ordered.forEach((level) => {
      if (level.cycles.length < 10) issues.push(`LEVEL_${level.level}:CYCLE_COUNT`);
      if (level.problems.length < 120) issues.push(`LEVEL_${level.level}:PROBLEM_COUNT`);
    });
    cycles.forEach((cycle, cycleIndex) => {
      if (!cycle.targetVocabularyIds.length) issues.push(`${cycle.cycleId}:NO_VOCABULARY`);
      if (!cycle.targetGrammarIds.length) issues.push(`${cycle.cycleId}:NO_GRAMMAR`);
      if (!(cycle.passageIds?.length || cycle.problems?.some((problem) => problem.passage))) issues.push(`${cycle.cycleId}:NO_READING`);
      if (!(cycle.independentProblemIds?.length || cycle.problems?.some((problem) => problem.independentCheck))) issues.push(`${cycle.cycleId}:NO_INDEPENDENT`);
      if (!(cycle.nextCycleIds?.length || cycleIndex < cycles.length - 1)) issues.push(`${cycle.cycleId}:NO_NEXT`);
    });
    problems.forEach((problem)=>validateProblem(problem,issues));
    duplicateValues(problems.map((p)=>p.problemId)).forEach((id)=>issues.push(`DUPLICATE_ID:${id}`));
    duplicateValues(problems.map((p)=>p.structureSignature)).forEach((id)=>issues.push(`DUPLICATE_STRUCTURE:${id}`));
    const answerDistribution = [0,1,2,3].map((index)=>problems.filter((p)=>p.correctChoiceIndex===index).length);
    if (Math.max(...answerDistribution)-Math.min(...answerDistribution)>Math.ceil(problems.length*0.08)) issues.push("COURSE:ANSWER_POSITION_BIAS");
    const articles = ordered.find((level)=>level.level===5)?.cycles.filter((cycle)=>cycle.problems.some((p)=>p.articleTitle)) || [];
    const toefl = problems.filter((p)=>p.questionType==="TOEFL_READING");
    if (articles.length<10) issues.push(`LEVEL_5:ARTICLE_COUNT_${articles.length}`);
    if (toefl.length<30) issues.push(`LEVEL_5:TOEFL_COUNT_${toefl.length}`);
    const reviewPlan = options.reviewPlan || [];
    const reviewLabels = new Map();
    reviewPlan.forEach((p)=>{
      const word=p.reviewVocabularyIds[0]; const labels=reviewLabels.get(word)||new Set(); labels.add(p.reviewCheckpoint); reviewLabels.set(word,labels);
    });
    cycles.flatMap((cycle)=>cycle.targetVocabularyIds).forEach((word)=>{
      const labels=reviewLabels.get(word)||new Set();
      ["SAME_CYCLE_LATE","PLUS_1","PLUS_3","PLUS_7"].forEach((label)=>{ if(!labels.has(label)) issues.push(`${word}:NO_${label}`); });
    });
    return Object.freeze({
      ok:issues.length===0, issues:Object.freeze(issues), cycleCount:cycles.length, problemCount:problems.length,
      answerDistribution:Object.freeze(answerDistribution), articleCount:articles.length, toeflCount:toefl.length,
      distractorCount:problems.length*3,
      taggedDistractorCount:problems.reduce((sum,p)=>sum+p.choiceMisconceptionTags.filter((tag)=>tag!=="CORRECT").length,0),
      questionTypeDistribution:Object.freeze(Object.fromEntries([...new Set(problems.map((p)=>p.questionType))].map((type)=>[type,problems.filter((p)=>p.questionType===type).length]))),
    });
  }
  return Object.freeze({ REQUIRED, validateCourse });
});
