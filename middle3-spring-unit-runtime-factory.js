(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_SPRING_UNIT_RUNTIME_FACTORY = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function adaptContent(content) {
    const concepts = content.CONCEPTS || content.concepts || [];
    const stages = content.STAGES || content.stages || ["BASIC", "A1", "A2", "A3", "A4", "A5"];
    function source(conceptId, stage) {
      if (typeof content.get === "function") return content.get(conceptId, stage);
      if (typeof content.getLesson === "function") return content.getLesson(conceptId, stage);
      return (content.lessons || []).find((lesson) => lesson.conceptId === conceptId && lesson.stage === stage) || null;
    }
    return Object.freeze({
      VERSION: content.VERSION,
      CONCEPTS: Object.freeze(concepts),
      STAGES: Object.freeze(stages),
      get(conceptId, stage) {
        const lesson = source(conceptId, stage);
        if (!lesson) return null;
        return Object.freeze({
          ...lesson,
          conceptTitle: lesson.conceptTitle || concepts.find((item) => item.conceptId === conceptId)?.title || conceptId,
          thinkingMethod: lesson.thinkingMethod || lesson.coreConcept,
          firstCondition: lesson.firstCondition || lesson.conditionFocus || lesson.procedure,
          conceptToUse: lesson.conceptToUse || lesson.coreConcept,
          whyEquation: lesson.whyEquation || "자료와 조건을 수학적으로 정확히 표현하기 위해 사용한다.",
          solutionConnection: lesson.solutionConnection || lesson.strategy || lesson.procedure,
          commonMistake: lesson.commonMistake || lesson.commonMistakes,
          validationMethod: lesson.validationMethod || lesson.validation || lesson.verification,
        });
      },
    });
  }

  function createUnitRuntime(config) {
    const { runtimeFactory, schema, algebraValidator, model, content } = config;
    if (!runtimeFactory?.createRuntime || !schema || !model || !content) throw new Error(`${config.scopeId}: runtime dependencies are required`);
    const learningContent = adaptContent(content);
    const evaluate = (problem, answer) => {
      if (typeof config.evaluateAnswer === "function") return config.evaluateAnswer(model, problem, answer);
      if (typeof model.evaluateProblemAnswer === "function") return model.evaluateProblemAnswer(problem, answer);
      if (typeof model.evaluateAnswer === "function") return model.evaluateAnswer(problem, answer);
      return schema.evaluateAnswer(problem, answer);
    };
    function adaptProblem(problem) {
      if (!problem) return problem;
      return Object.freeze({
        ...problem,
        questionText: problem.questionText || problem.prompt,
        correctAnswer: problem.correctAnswer ?? problem.expectedAnswer,
        contentRole: problem.contentRole || (problem.independentCheck ? "LEVEL_RECHECK" : "LEARNING_PRACTICE"),
        reasoningGoals: Object.freeze([...(problem.reasoningGoals || problem.difficultyEvidence || [problem.conceptTitle || problem.conceptId])]),
        solutionPath: Object.freeze([...(problem.solutionPath || problem.solutionSteps || [problem.explanation])]),
        independentCheckPolicy: problem.independentCheckPolicy || Object.freeze({
          hintDisclosure: problem.independentCheck ? "LOCKED_DURING_INDEPENDENT_CHECK" : "AFTER_ATTEMPT",
          solutionDisclosure: "AFTER_FINAL",
          hintsLockedBeforeFinal: Boolean(problem.independentCheck),
          solutionLockedBeforeFinal: true,
        }),
      });
    }
    const adaptedProblems = Object.freeze((model.problems || Object.values(model.problemsById || {})).map(adaptProblem));
    const adaptedProblemsById = Object.freeze(Object.fromEntries(adaptedProblems.map((problem) => [problem.problemId, problem])));
    const learningModel = Object.freeze({
      problemsById: adaptedProblemsById,
      getProblems(conceptId, stage) { return adaptedProblems.filter((problem) => problem.conceptId === conceptId && problem.stage === stage && !problem.independentCheck); },
    });
    const independentCheckPool = Object.freeze({
      problemsById: adaptedProblemsById,
      getProblems(conceptId, stage) { return adaptedProblems.filter((problem) => problem.conceptId === conceptId && problem.stage === stage && problem.independentCheck); },
    });
    const validator = Object.freeze({ ...(algebraValidator || schema), evaluateAnswer: evaluate });
    const stepOrderHandler = (problem, answer) => evaluate(problem, answer);
    return runtimeFactory.createRuntime({
      version: config.version,
      scopeId: config.scopeId,
      curriculumVersion: config.curriculumVersion || "MIDDLE3_2015_V1",
      conceptIds: model.conceptIds || learningContent.CONCEPTS.map((item) => item.conceptId),
      model: learningModel,
      learningContent,
      schema,
      validator,
      cloudKey: config.cloudKey,
      localStorageKey: config.localStorageKey,
      cyclePrefix: config.cyclePrefix,
      submissionPrefix: config.submissionPrefix || config.cyclePrefix.replace(/-cycle$/, "-submit"),
      eventName: config.eventName,
      independentCheckPool,
      answerTypeHandlers: { STEP_ORDER: stepOrderHandler },
      completionRules: { requiredLearningItems: () => 3 },
    });
  }

  return Object.freeze({ VERSION: "middle3SpringUnitRuntimeFactoryV1", adaptContent, createUnitRuntime });
});
