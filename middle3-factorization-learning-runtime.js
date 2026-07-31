(function (root, factory) {
  const api = factory(
    root?.STUDY_M3_SPRING_UNIT_RUNTIME_FACTORY || (typeof require === "function" ? require("./middle3-spring-unit-runtime-factory.js") : null),
    root?.STUDY_MATH_SPRING_LEARNING_RUNTIME || (typeof require === "function" ? require("./math-spring-learning-runtime.js") : null),
    root?.STUDY_MATH_LEARNING_SCHEMA || (typeof require === "function" ? require("./math-learning-schema.js") : null),
    root?.STUDY_MATH_ALGEBRA_VALIDATOR || (typeof require === "function" ? require("./math-algebra-validator.js") : null),
    root?.STUDY_MIDDLE3_FACTORIZATION_LEARNING_MODEL || (typeof require === "function" ? require("./middle3-factorization-learning-model.js") : null),
    root?.STUDY_M3_FACTORIZATION_LEARNING_CONTENT || (typeof require === "function" ? require("./middle3-factorization-learning-content.js") : null)
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_FACTORIZATION_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (factory, runtimeFactory, schema, algebra, model, content) {
  "use strict";
  return factory.createUnitRuntime({ runtimeFactory, schema, algebraValidator: algebra, model, content,
    version: "middle3FactorizationLearningV1", scopeId: "MIDDLE3_FACTORIZATION", curriculumVersion: "MIDDLE3_2015_FACTORIZATION_V1",
    cloudKey: "middle3FactorizationLearningV1", localStorageKey: "studyCoinMiddle3FactorizationLearningV1", cyclePrefix: "m3factor-cycle", eventName: "study:m3-factorization-remote-wins" });
});
