(function (root, factory) {
  const api = factory(
    root?.STUDY_MATH_SPRING_LEARNING_RUNTIME
      || (typeof require === "function" ? require("./math-spring-learning-runtime.js") : null),
    root?.STUDY_MATH_LEARNING_SCHEMA
      || (typeof require === "function" ? require("./math-learning-schema.js") : null),
    root?.STUDY_MIDDLE3_QUADRATIC_LEARNING_MODEL
      || (typeof require === "function" ? require("./middle3-quadratic-learning-model.js") : null),
    root?.STUDY_M3_QUADRATIC_LEARNING_CONTENT
      || (typeof require === "function" ? require("./middle3-quadratic-learning-content.js") : null)
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_QUADRATIC_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (
  runtimeFactory,
  schema,
  model,
  learningContent
) {
  "use strict";

  if (!runtimeFactory?.createRuntime || !schema || !model || !learningContent) {
    throw new Error("Middle3 quadratic learning runtime dependencies are required");
  }

  const runtime = runtimeFactory.createRuntime({
    version: "middle3QuadraticLearningV1",
    scopeId: "MIDDLE3_QUADRATIC",
    curriculumVersion: "MIDDLE3_QUADRATIC_V1",
    conceptIds: learningContent.CONCEPTS.map((concept) => concept.conceptId),
    model,
    learningContent,
    schema,
    cloudKey: "middle3QuadraticLearningV1",
    localStorageKey: "studyCoinMiddle3QuadraticLearningV1",
    cyclePrefix: "m3q-cycle",
    submissionPrefix: "m3q-submit",
    eventName: "study:m3-quadratic-remote-wins",
  });

  const PUBLIC_API_KEYS = Object.freeze([
    "VERSION",
    "CLOUD_STATE_KEY",
    "STAGES",
    "STAGE_STATUSES",
    "CYCLE_STATUSES",
    "PURPOSES",
    "CONCEPT_IDS",
    "createDefaultState",
    "normalizeState",
    "describeState",
    "resolveHydrationState",
    "contentSlides",
    "recommendedStageFor",
    "stageStatus",
    "getStageMap",
    "buildSpringCycle",
    "startCycle",
    "currentItem",
    "currentProblem",
    "attemptKey",
    "getFinalizedAttempt",
    "getDraftAnswer",
    "getHintCount",
    "getFeedback",
    "shouldShowContent",
    "markContentViewed",
    "setDraftAnswer",
    "useHint",
    "submitAnswer",
    "revealSolution",
    "advance",
    "previous",
    "pauseCycle",
    "resumeCycle",
    "finishCycle",
    "serializeState",
    "cycleExample",
  ]);

  return Object.freeze(Object.fromEntries(
    PUBLIC_API_KEYS.map((key) => [key, runtime[key]])
  ));
});
