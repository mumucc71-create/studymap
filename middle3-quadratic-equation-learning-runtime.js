(function (root, factory) {
  const api = factory(
    root?.STUDY_M3_SPRING_UNIT_RUNTIME_FACTORY || (typeof require === "function" ? require("./middle3-spring-unit-runtime-factory.js") : null),
    root?.STUDY_MATH_SPRING_LEARNING_RUNTIME || (typeof require === "function" ? require("./math-spring-learning-runtime.js") : null),
    root?.STUDY_MATH_LEARNING_SCHEMA || (typeof require === "function" ? require("./math-learning-schema.js") : null),
    root?.STUDY_MATH_ALGEBRA_VALIDATOR || (typeof require === "function" ? require("./math-algebra-validator.js") : null),
    root?.STUDY_MIDDLE3_QUADRATIC_EQUATION_LEARNING_MODEL || (typeof require === "function" ? require("./middle3-quadratic-equation-learning-model.js") : null),
    root?.STUDY_MIDDLE3_QUADRATIC_EQUATION_LEARNING_CONTENT || (typeof require === "function" ? require("./middle3-quadratic-equation-learning-content.js") : null)
  );
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_M3_QUADRATIC_EQUATION_LEARNING_RUNTIME = api;
})(typeof window !== "undefined" ? window : globalThis, function (factory, runtimeFactory, schema, algebra, model, content) {
  "use strict";
  return factory.createUnitRuntime({ runtimeFactory, schema, algebraValidator: algebra, model, content,
    version: "middle3QuadraticEquationLearningV1", scopeId: "MIDDLE3_QUADRATIC_EQUATION", curriculumVersion: "MIDDLE3_2015_QUADRATIC_EQUATION_V1",
    cloudKey: "middle3QuadraticEquationLearningV1", localStorageKey: "studyCoinMiddle3QuadraticEquationLearningV1", cyclePrefix: "m3qe-cycle", eventName: "study:m3-quadratic-equation-remote-wins" });
});
