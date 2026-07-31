(function (root, factory) {
  const runtimeFactory = root?.STUDY_MATH_SPRING_LEARNING_RUNTIME
    || (typeof require === "function" ? require("./math-spring-learning-runtime.js") : null);
  const schema = root?.STUDY_MATH_LEARNING_SCHEMA
    || (typeof require === "function" ? require("./math-learning-schema.js") : null);
  const algebraValidator = root?.STUDY_MATH_ALGEBRA_VALIDATOR
    || (typeof require === "function" ? require("./math-algebra-validator.js") : null);
  const model = root?.STUDY_MIDDLE3_SQRT_LEARNING_MODEL
    || (typeof require === "function" ? require("./middle3-sqrt-learning-model.js") : null);
  const learningContent = root?.STUDY_M3_SQRT_LEARNING_CONTENT
    || (typeof require === "function" ? require("./middle3-sqrt-learning-content.js") : null);
  const api = factory(runtimeFactory, schema, algebraValidator, model, learningContent);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_SQRT_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (
  runtimeFactory,
  schema,
  algebraValidator,
  model,
  learningContent
) {
  "use strict";

  if (!runtimeFactory?.createRuntime) throw new Error("STUDY_MATH_SPRING_LEARNING_RUNTIME is required");
  if (!schema) throw new Error("STUDY_MATH_LEARNING_SCHEMA is required");
  if (!algebraValidator) throw new Error("STUDY_MATH_ALGEBRA_VALIDATOR is required");
  if (!model) throw new Error("STUDY_MIDDLE3_SQRT_LEARNING_MODEL is required");
  if (!learningContent) throw new Error("STUDY_M3_SQRT_LEARNING_CONTENT is required");

  const CONCEPT_IDS = Object.freeze([
    "m3_sqrt_meaning",
    "m3_sqrt_value",
    "m3_irrational_number",
    "m3_radical_simplification",
    "m3_radical_operations",
  ]);

  const learningModel = Object.freeze({
    problemsById: model.problemsById,
    getProblems(conceptId, stage) {
      return model.getProblems(conceptId, stage).filter((problem) => !problem.independentCheck);
    },
  });

  const independentCheckPool = Object.freeze({
    problemsById: model.problemsById,
    getProblems(conceptId, stage) {
      return model.getProblems(conceptId, stage).filter((problem) => problem.independentCheck);
    },
  });

  const injectedValidator = Object.freeze({
    ...algebraValidator,
    evaluateAnswer(problem, answer) {
      return model.evaluateProblemAnswer(problem, answer);
    },
  });

  function stepOrderHandler(problem, answer) {
    const evaluated = model.evaluateProblemAnswer(problem, answer);
    if (evaluated.status !== "CORRECT") return evaluated;
    const actual = Array.isArray(answer)
      ? answer.map((step) => String(step).replace(/\s+/g, ""))
      : String(answer ?? "")
        .split(/(?:\r?\n|→|;)/)
        .map((step) => step.replace(/\s+/g, ""))
        .filter(Boolean);
    const expected = problem.correctAnswer.map((step) => String(step).replace(/\s+/g, ""));
    const correct = expected.length === actual.length
      && expected.every((step, index) => step === actual[index]);
    return {
      ...evaluated,
      status: correct ? "CORRECT" : "INCORRECT",
      correct,
      reason: correct ? undefined : "STEP_ORDER_MISMATCH",
    };
  }

  return runtimeFactory.createRuntime({
    version: "middle3SqrtLearningV1",
    scopeId: "MIDDLE3_SQRT",
    curriculumVersion: "MIDDLE3_2015_SQRT_V1",
    conceptIds: CONCEPT_IDS,
    model: learningModel,
    learningContent,
    schema,
    validator: injectedValidator,
    cloudKey: "middle3SqrtLearningV1",
    localStorageKey: "studyCoinMiddle3SqrtLearningV1",
    cyclePrefix: "m3sqrt-cycle",
    submissionPrefix: "m3sqrt-submit",
    eventName: "study:m3-sqrt-remote-wins",
    independentCheckPool,
    answerTypeHandlers: {
      STEP_ORDER: stepOrderHandler,
    },
    completionRules: {
      requiredLearningItems() {
        return 3;
      },
    },
  });
});
