(function (root, factory) {
  const api = factory(
    root?.STUDY_M3_SPRING_UNIT_RUNTIME_FACTORY || (typeof require === "function" ? require("./middle3-spring-unit-runtime-factory.js") : null),
    root?.STUDY_MATH_SPRING_LEARNING_RUNTIME || (typeof require === "function" ? require("./math-spring-learning-runtime.js") : null),
    root?.STUDY_MATH_LEARNING_SCHEMA || (typeof require === "function" ? require("./math-learning-schema.js") : null),
    root?.STUDY_MATH_ALGEBRA_VALIDATOR || (typeof require === "function" ? require("./math-algebra-validator.js") : null),
    root?.STUDY_MIDDLE3_TRIGONOMETRIC_RATIO_LEARNING_MODEL || (typeof require === "function" ? require("./middle3-trigonometric-ratio-learning-model.js") : null),
    root?.STUDY_MIDDLE3_TRIGONOMETRIC_RATIO_LEARNING_CONTENT || (typeof require === "function" ? require("./middle3-trigonometric-ratio-learning-content.js") : null)
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_TRIGONOMETRIC_RATIO_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (factory, runtimeFactory, schema, algebra, model, content) {
  "use strict";
  return factory.createUnitRuntime({ runtimeFactory, schema, algebraValidator: algebra, model, content,
    version: "middle3TrigLearningV1", scopeId: "MIDDLE3_TRIGONOMETRIC_RATIO", curriculumVersion: "MIDDLE3_2015_TRIGONOMETRY_V1",
    cloudKey: "middle3TrigLearningV1", localStorageKey: "studyCoinMiddle3TrigLearningV1", cyclePrefix: "m3trig-cycle", eventName: "study:m3-trig-remote-wins" });
});
