(function (root, factory) {
  const api = factory(root || globalThis);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_MATH_PROBLEM_METADATA = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";

  const METADATA_VERSION = "m3-static-metadata-v1";
  const RULE_VERSION = "m3-roadmap-rule-v1";
  const SNAPSHOT_VERSION = "m3-roadmap-attempt-v1";
  const STAGES = ["BASIC", "A1", "A2", "A3", "A4", "A5"];
  const PRACTICE_MODES = ["basic", "typePractice", "advanced", "written", "pastExam", "assessment"];
  const detailData = root.STUDY_MIDDLE3_CONCEPT_DIAGNOSTICS || {};
  const stageBank = root.STUDY_MIDDLE3_STAGE_QUESTION_BANK || {};
  const legacyProblems = root.generatedConceptBanks?.m3 || [];
  const eliteProblems = root.STUDY_ELITE_MATH_BANKS?.["중등 3학년"] || [];
  const roadmap = root.STUDY_MATH_ROADMAP_V2 || null;
  const conceptById = detailData.conceptById || {};

  const MODE_STAGE = {
    basic: { stage: "BASIC", candidates: ["BASIC"], confidence: 0.94 },
    typePractice: { stage: "A1", candidates: ["A1"], confidence: 0.9 },
    advanced: { stage: "A2", candidates: ["A2", "A3"], confidence: 0.86 },
    written: { stage: null, candidate: "A2", candidates: ["A2", "A3"], confidence: 0.82 },
    pastExam: { stage: "A2", candidates: ["A2", "A3"], confidence: 0.86 },
    assessment: { stage: "A2", candidates: ["A2", "A3"], confidence: 0.86 },
  };

  const ELITE_CLASSIFICATION = {
    "elite-m3-01": { conceptId: "m3_radical_operations", stage: "A1" },
    "elite-m3-02": { conceptId: "m3_polynomial_multiplication", stage: "A2" },
    "elite-m3-03": { conceptId: "m3_quadratic_factor_solve", stage: "A2" },
    "elite-m3-04": { conceptId: "m3_quadratic_max_min", stage: "A1" },
    "elite-m3-05": { conceptId: "m3_pythagorean_hypotenuse", stage: "BASIC" },
    "elite-m3-06": { conceptId: "m3_trig_length", stage: "A2" },
    "elite-m3-07": { conceptId: "m3_circle_central_inscribed", stage: "A1" },
    "elite-m3-08": { conceptId: "m3_statistics_variance", stage: "A2" },
    "elite-m3-09": {
      status: "OUT_OF_SCOPE",
      stageCandidate: "A3",
      reason: "중3 기본 진단 범위에 없는 근과 계수 관계 문제",
    },
    "elite-m3-10": {
      status: "REVIEW_REQUIRED",
      candidateConceptIds: ["m3_quadratic_graph_shape", "m3_quadratic_factor_solve"],
      stageCandidate: "A3",
      reason: "이차함수와 이차방정식이 결합되어 대표 개념을 수동 검토해야 함",
    },
  };

  const ROADMAP_NODE_CLASSIFICATION = {
    "equations-c09-n01": { conceptId: "m3_quadratic_meaning" },
    "equations-c09-n02": { conceptId: "m3_quadratic_factor_solve" },
    "equations-c09-n03": { conceptId: "m3_quadratic_sqrt_solve" },
    "equations-c09-n04": { candidates: ["m3_quadratic_sqrt_solve", "m3_factor_perfect_square"] },
    "equations-c09-n05": { conceptId: "m3_quadratic_formula" },
    "equations-c09-n06": { candidates: ["m3_quadratic_formula", "m3_quadratic_root_meaning"] },
    "equations-c09-n07": { conceptId: "m3_quadratic_word_setup" },
    "equations-c09-n08": { candidates: ["m3_quadratic_meaning", "m3_quadratic_factor_solve", "m3_quadratic_formula"] },

    "functions-c07-n01": { conceptId: "m3_quadratic_function_meaning" },
    "functions-c07-n02": { conceptId: "m3_quadratic_graph_shape" },
    "functions-c07-n03": { conceptId: "m3_quadratic_vertex_axis" },
    "functions-c07-n04": { conceptId: "m3_quadratic_vertex_axis" },
    "functions-c07-n05": { conceptId: "m3_quadratic_translation" },
    "functions-c07-n06": { conceptId: "m3_quadratic_max_min" },
    "functions-c07-n07": { candidates: ["m3_quadratic_graph_shape", "m3_quadratic_root_meaning"] },
    "functions-c07-n08": { candidates: ["m3_quadratic_find_formula", "m3_quadratic_max_min"] },
    "functions-c07-n09": { candidates: ["m3_quadratic_function_meaning", "m3_quadratic_vertex_axis", "m3_quadratic_max_min"] },

    "geometry-measurement-c10-n01": { candidates: ["m3_pythagorean_meaning"] },
    "geometry-measurement-c10-n02": { conceptId: "m3_pythagorean_meaning" },
    "geometry-measurement-c10-n03": { conceptId: "m3_pythagorean_converse" },
    "geometry-measurement-c10-n04": { candidates: ["m3_pythagorean_hypotenuse", "m3_pythagorean_leg", "m3_coordinate_distance"] },
    "geometry-measurement-c10-n05": { candidates: ["m3_pythagorean_hypotenuse", "m3_pythagorean_leg"] },
    "geometry-measurement-c10-n06": { candidates: ["m3_pythagorean_meaning", "m3_pythagorean_converse"] },

    "geometry-measurement-c11-n01": { conceptId: "m3_trig_sine" },
    "geometry-measurement-c11-n02": { conceptId: "m3_trig_cosine" },
    "geometry-measurement-c11-n03": { conceptId: "m3_trig_tangent" },
    "geometry-measurement-c11-n04": { conceptId: "m3_trig_meaning" },
    "geometry-measurement-c11-n05": { conceptId: "m3_trig_length" },
    "geometry-measurement-c11-n06": { status: "OUT_OF_SCOPE", reason: "중3 기본 진단 범위에 없는 사인법칙" },
    "geometry-measurement-c11-n07": { status: "OUT_OF_SCOPE", reason: "중3 기본 진단 범위에 없는 코사인법칙" },
    "geometry-measurement-c11-n08": { candidates: ["m3_trig_meaning", "m3_trig_sine", "m3_trig_cosine", "m3_trig_tangent", "m3_trig_length"] },

    "probability-statistics-c09-n01": { candidates: ["m3_statistics_mean", "m3_statistics_variance"] },
    "probability-statistics-c09-n02": { conceptId: "m3_statistics_variance" },
    "probability-statistics-c09-n03": { conceptId: "m3_statistics_standard_deviation" },
    "probability-statistics-c09-n04": { conceptId: "m3_statistics_standard_deviation" },
    "probability-statistics-c09-n05": { status: "OUT_OF_SCOPE", reason: "중3 기본 진단 범위에 없는 정규분포" },
    "probability-statistics-c09-n06": { candidates: ["m3_statistics_variance", "m3_statistics_standard_deviation"] },
  };

  function cloneArray(value) {
    return Array.isArray(value) ? value.map((item) => (item && typeof item === "object" ? { ...item } : item)) : [];
  }

  function normalizeSignatureText(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLowerCase()
      .replace(/<[^>]*>/g, " ")
      .replace(/[-+]?\d+(?:,\d{3})*(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?/g, "#")
      .replace(/(?:mm|cm|km|kg|ml|m|g|도|°|점|개|명|시간|분)(?=\s|$|[.,!?])/gi, "<unit>")
      .replace(/\s+/g, "")
      .replace(/[“”‘’'"`]/g, "");
  }

  function hashText(value) {
    let hash = 0x811c9dc5;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
  }

  function promptOf(problem) {
    return problem?.questionText || problem?.problemHtml || problem?.prompt || problem?.question || problem?.problem || "";
  }

  function solutionOf(problem) {
    return problem?.explanation || problem?.solution || "";
  }

  function structureSignatureFor(problem) {
    if (problem?.structureSignature) return String(problem.structureSignature);
    return `structure:${hashText(normalizeSignatureText(promptOf(problem)))}`;
  }

  function solutionPathSignatureFor(problem, conceptId, candidateConceptIds = []) {
    if (problem?.solutionPathSignature) return String(problem.solutionPathSignature);
    const conceptKey = conceptId || candidateConceptIds.join("+") || "unmapped";
    const solution = normalizeSignatureText(solutionOf(problem));
    const genericExplanation = /(?:기본)?개념을(?:다시)?확인|정답은#|문제입니다/.test(solution);
    const pathBasis = !solution || genericExplanation ? normalizeSignatureText(promptOf(problem)) : solution;
    return `solution:${hashText(`${conceptKey}|${pathBasis}`)}`;
  }

  function unitIdFor(conceptId, candidateConceptIds = []) {
    const target = conceptId || candidateConceptIds.find((id) => conceptById[id]);
    return conceptById[target]?.unitId || null;
  }

  function prerequisiteConceptIdsFor(conceptId, candidateConceptIds = [], fallback = []) {
    const ids = conceptId ? [conceptId] : candidateConceptIds;
    return [...new Set([
      ...cloneArray(fallback),
      ...ids.flatMap((id) => cloneArray(conceptById[id]?.prerequisiteConceptIds)),
    ])];
  }

  function answerTypeFor(problem) {
    return problem?.questionType === "writtenResponse" || !Array.isArray(problem?.choices) || problem.choices.length === 0
      ? "WRITTEN_RESPONSE"
      : "MULTIPLE_CHOICE";
  }

  function stageForDifficulty(difficulty) {
    const level = Number(difficulty) || 1;
    if (level <= 2) return "BASIC";
    if (level === 3) return "A1";
    if (level === 4) return "A2";
    return "A3";
  }

  function createMetadataRecord(problem, classification) {
    const problemId = String(problem.questionId || problem.id);
    const candidateConceptIds = [...new Set(classification.candidateConceptIds || [])];
    const conceptId = classification.conceptId || null;
    const reviewStatus = classification.reviewStatus || "AUTO_APPROVED";
    const structureSignature = structureSignatureFor(problem);
    const stageCandidate = classification.stageCandidate || classification.stage || null;
    const stageConfidence = Number(classification.stageClassificationConfidence ?? (classification.stage ? 0.94 : 0.78));
    const stage = reviewStatus === "AUTO_APPROVED" && stageConfidence >= 0.85 ? classification.stage : null;
    const executionStatus = reviewStatus === "OUT_OF_SCOPE"
      ? "OUT_OF_SCOPE"
      : reviewStatus === "REVIEW_REQUIRED"
        ? "EXCLUDED_REVIEW"
        : classification.mode === "ELITE"
          ? "ELITE_ONLY"
          : "EXECUTABLE";
    return Object.freeze({
      problemId,
      source: classification.source,
      mode: classification.mode || "STANDARD",
      grade: 9,
      unitId: classification.unitId || unitIdFor(conceptId, candidateConceptIds),
      conceptId,
      candidateConceptIds: Object.freeze(candidateConceptIds),
      prerequisiteConceptIds: Object.freeze(prerequisiteConceptIdsFor(
        conceptId,
        candidateConceptIds,
        problem.prerequisiteConcepts || classification.prerequisiteConceptIds
      )),
      stage,
      stageCandidate,
      answerType: answerTypeFor(problem),
      problemFamilyId: problem.problemFamilyId || `${classification.source.toLowerCase()}:${structureSignature}`,
      structureSignature,
      solutionPathSignature: solutionPathSignatureFor(problem, conceptId, candidateConceptIds),
      conceptMappingConfidence: Number(classification.conceptMappingConfidence ?? (reviewStatus === "AUTO_APPROVED" ? 0.96 : 0.78)),
      stageClassificationConfidence: stageConfidence,
      reviewStatus,
      executionStatus,
      exclusionReasons: Object.freeze(classification.exclusionReasons || []),
      metadataVersion: METADATA_VERSION,
    });
  }

  function classifyLegacyProblem(problem) {
    const text = String(problem.questionText || "").replace(/\s+/g, " ").trim();
    const approved = (conceptId) => ({
      source: "LEGACY_GRADE9",
      mode: "STANDARD",
      conceptId,
      stage: stageForDifficulty(problem.difficulty),
      conceptMappingConfidence: 0.96,
      stageClassificationConfidence: 0.92,
      reviewStatus: "AUTO_APPROVED",
    });
    const review = (candidateConceptIds, reason) => ({
      source: "LEGACY_GRADE9",
      mode: "STANDARD",
      candidateConceptIds,
      stageCandidate: stageForDifficulty(problem.difficulty),
      conceptMappingConfidence: 0.76,
      stageClassificationConfidence: 0.78,
      reviewStatus: "REVIEW_REQUIRED",
      exclusionReasons: [reason],
    });

    switch (problem.conceptId) {
      case "real_numbers":
        if (text.includes("무리수")) return approved("m3_irrational_number");
        if (/^√\d+\s*=/.test(text)) return approved("m3_sqrt_value");
        return approved("m3_radical_operations");
      case "factorization":
        if (!text.includes("인수분해")) {
          return approved(/^\(x[+-]\d+\)\(x[+-]\d+\)/.test(text) ? "m3_multiplication_formula" : "m3_polynomial_multiplication");
        }
        if (/^\d+x\+\d+/.test(text)) return approved("m3_common_factor");
        return approved("m3_factor_sum_product");
      case "quadratic_equation":
        if (text.startsWith("어떤 수 x와")) {
          return review(["m3_quadratic_meaning", "m3_quadratic_word_setup"], "문장이 실제 이차방정식을 만들지 않아 수동 검토가 필요함");
        }
        if (/^x²-\d+=0의 양의 해/.test(text)) return approved("m3_quadratic_sqrt_solve");
        return approved("m3_quadratic_factor_solve");
      case "quadratic_function":
        if (text.includes("꼭짓점") || text.includes("축은")) return approved("m3_quadratic_vertex_axis");
        if (text.includes("어떤 값을")) return approved("m3_quadratic_function_meaning");
        return approved("m3_quadratic_max_min");
      case "pythagorean":
        if (text.includes("좌표평면")) return approved("m3_coordinate_distance");
        if (text.includes("될 수 있나요")) return approved("m3_pythagorean_converse");
        if (text.startsWith("빗변이")) return approved("m3_pythagorean_leg");
        return approved("m3_pythagorean_hypotenuse");
      case "trigonometric_ratio":
        if (text.includes("sin은")) return approved("m3_trig_sine");
        if (text.includes("cos은")) return approved("m3_trig_cosine");
        if (text.includes("높이는")) return approved("m3_trig_length");
        return approved("m3_trig_tangent");
      case "circle":
        if (text.includes("접선")) return approved("m3_circle_tangent_radius");
        if (text.includes("현에 내린 수선")) return approved("m3_circle_chord");
        if (text.includes("같은 호에 대한 원주각들의")) return approved("m3_circle_same_arc");
        return approved("m3_circle_central_inscribed");
      case "statistics_probability":
        if (text.includes("확률")) return approved("m3_probability_basic");
        if (text.includes("표준편차")) return approved("m3_statistics_standard_deviation");
        if (text.includes("분산")) return approved("m3_statistics_variance");
        return approved("m3_statistics_mean");
      default:
        return review([], "중3 세부 개념 자동 매핑 규칙이 없음");
    }
  }

  function buildStaticProblemMetadata() {
    const detail = (detailData.problems || []).map((problem) => createMetadataRecord(problem, {
      source: "DETAIL_CONCEPT",
      mode: "STANDARD",
      unitId: problem.unitId,
      conceptId: problem.conceptId,
      stage: "BASIC",
      conceptMappingConfidence: 1,
      stageClassificationConfidence: 1,
      reviewStatus: "AUTO_APPROVED",
    }));
    const legacy = legacyProblems.map((problem) => createMetadataRecord(problem, classifyLegacyProblem(problem)));
    const elite = eliteProblems.map((problem) => {
      const config = ELITE_CLASSIFICATION[problem.id] || {
        status: "REVIEW_REQUIRED",
        candidateConceptIds: [],
        reason: "Elite 중3 문제 자동 매핑 규칙이 없음",
      };
      const reviewStatus = config.status || "AUTO_APPROVED";
      return createMetadataRecord(problem, {
        source: "ELITE_GRADE9",
        mode: "ELITE",
        conceptId: config.conceptId,
        candidateConceptIds: config.candidateConceptIds,
        stage: config.stage,
        stageCandidate: config.stageCandidate,
        conceptMappingConfidence: reviewStatus === "AUTO_APPROVED" ? 0.97 : reviewStatus === "OUT_OF_SCOPE" ? 0.99 : 0.78,
        stageClassificationConfidence: reviewStatus === "AUTO_APPROVED" ? 0.94 : 0.78,
        reviewStatus,
        exclusionReasons: config.reason ? [config.reason] : [],
      });
    });
    return Object.freeze([...detail, ...legacy, ...elite]);
  }

  const staticProblemMetadata = buildStaticProblemMetadata();
  const staticMetadataById = new Map(staticProblemMetadata.map((item) => [item.problemId, item]));
  const STAGE_LEVEL = Object.freeze({ BASIC: 1, A1: 2, A2: 3, A3: 4, A4: 5, A5: 6 });

  function selectStageExpansionProblems() {
    const selected = [];
    const shortages = [];
    const approved = staticProblemMetadata.filter((item) => (
      item.mode === "STANDARD"
      && item.reviewStatus === "AUTO_APPROVED"
      && item.executionStatus === "EXECUTABLE"
    ));

    (detailData.concepts || []).forEach((definition) => {
      ["A1", "A2", "A3", "A4", "A5"].forEach((stage) => {
        const original = approved.filter((item) => item.conceptId === definition.conceptId && item.stage === stage);
        const structures = new Set(original.map((item) => item.structureSignature));
        const solutionPaths = new Set(original.map((item) => item.solutionPathSignature));
        const before = Object.freeze({
          distinctStructures: structures.size,
          distinctSolutionPaths: solutionPaths.size,
        });
        const candidates = (stageBank.candidates || []).filter((problem) => (
          problem.conceptId === definition.conceptId && problem.stage === stage
        ));
        candidates.forEach((problem) => {
          if (structures.size >= 3 && solutionPaths.size >= 3) return;
          const structure = structureSignatureFor(problem);
          const solutionPath = solutionPathSignatureFor(problem, definition.conceptId);
          if (structures.has(structure) && solutionPaths.has(solutionPath)) return;
          structures.add(structure);
          solutionPaths.add(solutionPath);
          selected.push(problem);
        });
        shortages.push(Object.freeze({
          conceptId: definition.conceptId,
          stage,
          before,
          added: Math.max(structures.size - before.distinctStructures, solutionPaths.size - before.distinctSolutionPaths),
          after: Object.freeze({
            distinctStructures: structures.size,
            distinctSolutionPaths: solutionPaths.size,
          }),
          sufficient: structures.size >= 3 && solutionPaths.size >= 3,
        }));
      });
    });
    return {
      selected: Object.freeze(selected),
      shortages: Object.freeze(shortages),
    };
  }

  const stageExpansionSelection = selectStageExpansionProblems();
  const stageExpansionProblems = stageExpansionSelection.selected;
  const stageExpansionMetadata = Object.freeze(stageExpansionProblems.map((problem) => createMetadataRecord(problem, {
    source: "STAGE_EXPANSION",
    mode: "STANDARD",
    unitId: problem.unitId,
    conceptId: problem.conceptId,
    stage: problem.stage,
    conceptMappingConfidence: 1,
    stageClassificationConfidence: 1,
    reviewStatus: "AUTO_APPROVED",
  })));
  const stageExpansionMetadataById = new Map(stageExpansionMetadata.map((item) => [item.problemId, item]));
  const sourceProblemById = new Map([
    ...(detailData.problems || []),
    ...legacyProblems,
    ...eliteProblems,
    ...stageExpansionProblems,
  ].map((problem) => [String(problem.questionId || problem.id), problem]));

  function createMathValidationManifest(source, metadata) {
    return Object.freeze({
      validatorId: "STATIC_MANIFEST_V1",
      conditionsComplete: true,
      expectedPrompt: String(promptOf(source)),
      expectedAnswer: String(source?.answer ?? ""),
      expectedChoices: Object.freeze(cloneArray(source?.choices).map(String)),
      expectedAnswerType: metadata.answerType,
      expectedGrade: metadata.grade,
      expectedConceptId: metadata.conceptId,
      expectedStage: metadata.stage,
    });
  }

  function createOriginalExecutableStandardProblemPool() {
    const stageLevel = { BASIC: 1, A1: 2, A2: 3, A3: 4, A4: 5, A5: 6 };
    return executableStaticMetadata({ mode: "STANDARD" }).map((item) => {
      const source = sourceProblemById.get(item.problemId);
      const definition = conceptById[item.conceptId] || {};
      const adaptiveLevel = stageLevel[item.stage] || 1;
      const mathValidation = createMathValidationManifest(source, item);
      return {
        id: item.problemId,
        questionId: item.problemId,
        conceptId: item.conceptId,
        unitId: item.unitId,
        concept: definition.conceptName || definition.title || item.conceptId,
        unit: definition.unitTitle || source?.unit || "중3 수학",
        problem: promptOf(source),
        questionText: promptOf(source),
        answer: String(source?.answer ?? ""),
        correctAnswer: String(source?.answer ?? ""),
        choices: cloneArray(source?.choices).map(String),
        explanation: String(solutionOf(source) || `${definition.conceptName || "중3 수학"} 개념을 확인하는 문제입니다.`),
        prerequisiteConcepts: [...item.prerequisiteConceptIds],
        difficulty: adaptiveLevel,
        adaptiveLevel,
        estimatedSolveTime: Number(source?.estimatedSolveTime) || 45,
        problemType: "choice",
        questionType: "choice",
        answerType: item.answerType,
        gradeNumber: item.grade,
        stage: item.stage,
        mathValidation,
        problemFamilyId: item.problemFamilyId,
        structureSignature: item.structureSignature,
        solutionPathSignature: item.solutionPathSignature,
        metadataSource: item.source,
        metadataVersion: item.metadataVersion,
        mode: item.mode,
        reviewStatus: item.reviewStatus,
        executionStatus: item.executionStatus,
        bank: item.source === "DETAIL_CONCEPT" ? "m3-detail" : "m3-legacy-approved",
        grade: "중등 3학년",
        level: "middle",
        schoolLevel: "middle",
        levelLabel: "중등 3학년",
        rank: 9,
        domain: definition.unitTitle || source?.unit || "중3 수학",
        stable: definition.unitTitle || source?.unit || "중3 수학",
        start: definition.conceptName || definition.title || item.conceptId,
        code: "M3-STANDARD-APPROVED",
      };
    });
  }

  function createExecutableStandardProblemPool() {
    const expansion = stageExpansionMetadata.map((item) => {
      const source = sourceProblemById.get(item.problemId) || {};
      const mathValidation = createMathValidationManifest(source, item);
      return {
        ...source,
        id: item.problemId,
        questionId: item.problemId,
        conceptId: item.conceptId,
        unitId: item.unitId,
        problem: promptOf(source),
        questionText: promptOf(source),
        answer: String(source.answer ?? ""),
        correctAnswer: String(source.answer ?? ""),
        choices: cloneArray(source.choices).map(String),
        explanation: String(solutionOf(source)),
        prerequisiteConcepts: [...item.prerequisiteConceptIds],
        difficulty: STAGE_LEVEL[item.stage] || 1,
        adaptiveLevel: STAGE_LEVEL[item.stage] || 1,
        answerType: item.answerType,
        gradeNumber: item.grade,
        stage: item.stage,
        mathValidation,
        problemFamilyId: item.problemFamilyId,
        structureSignature: item.structureSignature,
        solutionPathSignature: item.solutionPathSignature,
        metadataSource: item.source,
        metadataVersion: item.metadataVersion,
        mode: item.mode,
        reviewStatus: item.reviewStatus,
        executionStatus: item.executionStatus,
        code: "M3-STANDARD-APPROVED",
      };
    });
    return [...createOriginalExecutableStandardProblemPool(), ...expansion];
  }

  function isMiddle3Node(node) {
    return node?.gradeLabel === "중3";
  }

  function buildRoadmapRuleIndex(rawCreatePracticeSet) {
    if (!roadmap || typeof rawCreatePracticeSet !== "function") return Object.freeze([]);
    const rules = roadmap.nodes
      .filter(isMiddle3Node)
      .flatMap((node) => PRACTICE_MODES
        .filter((mode) => node.lessonMenu?.[mode]?.enabled !== false)
        .map((mode) => {
          const sample = rawCreatePracticeSet(node.id, mode, 1, 1)[0];
          if (!sample) return null;
          const nodeConfig = ROADMAP_NODE_CLASSIFICATION[node.id] || { candidates: [] };
          const status = nodeConfig.status || (nodeConfig.conceptId ? "ACTIVE" : "REVIEW_REQUIRED");
          const candidateConceptIds = [...new Set(nodeConfig.candidates || [])];
          const conceptId = nodeConfig.conceptId || null;
          const modeStage = MODE_STAGE[mode] || MODE_STAGE.basic;
          const executionStatus = status === "OUT_OF_SCOPE"
            ? "OUT_OF_SCOPE"
            : status === "REVIEW_REQUIRED"
              ? "EXCLUDED_REVIEW"
              : mode === "written"
                ? "METADATA_ONLY"
                : "EXECUTABLE";
          return Object.freeze({
            ruleId: `roadmap-rule:${roadmap.version || "unknown"}:${node.id}:${sample.generatedFromTemplateId}:${mode}`,
            nodeId: node.id,
            generatedFromTemplateId: sample.generatedFromTemplateId,
            mode,
            grade: 9,
            unitId: unitIdFor(conceptId, candidateConceptIds),
            defaultConceptId: conceptId,
            candidateConceptIds: Object.freeze(candidateConceptIds),
            prerequisiteConceptIds: Object.freeze(prerequisiteConceptIdsFor(conceptId, candidateConceptIds, node.prerequisiteIds)),
            allowedStageCandidates: Object.freeze([...modeStage.candidates]),
            modeStageHint: modeStage.stage || modeStage.candidate || null,
            answerTypesAllowed: Object.freeze([answerTypeFor(sample)]),
            conceptMappingConfidence: status === "ACTIVE" ? 0.96 : status === "OUT_OF_SCOPE" ? 0.99 : 0.78,
            ruleConfidence: status === "ACTIVE" ? 0.94 : status === "OUT_OF_SCOPE" ? 0.99 : 0.76,
            status,
            executionStatus,
            exclusionReasons: Object.freeze(nodeConfig.reason
              ? [nodeConfig.reason]
              : status === "REVIEW_REQUIRED"
                ? ["로드맵 노드가 여러 세부 개념을 포함하여 수동 검토가 필요함"]
                : []),
            ruleVersion: RULE_VERSION,
            curriculumVersion: roadmap.version || "unknown",
          });
        })
        .filter(Boolean));
    return Object.freeze(rules);
  }

  const rawCreatePracticeSet = roadmap?.__studyRawCreatePracticeSet
    || (typeof roadmap?.createPracticeSet === "function" ? roadmap.createPracticeSet.bind(roadmap) : null);
  const roadmapGenerationRules = buildRoadmapRuleIndex(rawCreatePracticeSet);
  const roadmapRuleByKey = new Map(roadmapGenerationRules.map((rule) => [
    `${rule.nodeId}|${rule.generatedFromTemplateId}|${rule.mode}`,
    rule,
  ]));

  function runtimeStageFor(problem, mode) {
    const config = MODE_STAGE[mode] || MODE_STAGE.basic;
    if (mode === "advanced" && Number(problem.difficulty) >= 5) {
      return { stage: "A3", stageCandidate: "A3", confidence: 0.86 };
    }
    return {
      stage: config.confidence >= 0.85 ? config.stage : null,
      stageCandidate: config.stage || config.candidate || null,
      confidence: config.confidence,
    };
  }

  function resolveRoadmapProblem(problem, context = {}) {
    const nodeId = context.nodeId || problem?.nodeId;
    const mode = context.mode || problem?.mode;
    const templateId = context.generatedFromTemplateId || problem?.generatedFromTemplateId;
    const rule = roadmapRuleByKey.get(`${nodeId}|${templateId}|${mode}`) || null;
    if (!rule) return { ...problem };
    const stageResult = runtimeStageFor(problem, mode);
    const structureSignature = structureSignatureFor(problem);
    const solutionPathSignature = solutionPathSignatureFor(problem, rule.defaultConceptId, rule.candidateConceptIds);
    let executionStatus = rule.executionStatus;
    if (rule.status === "ACTIVE" && rule.conceptMappingConfidence < 0.9) executionStatus = "EXCLUDED_CONCEPT_REVIEW";
    if (rule.status === "ACTIVE" && mode !== "written" && stageResult.confidence < 0.85) executionStatus = "EXCLUDED_STAGE_REVIEW";
    const generationContext = Object.freeze({
      nodeId,
      templateId,
      mode,
      round: Number(context.round ?? context.attempt ?? 1),
      count: Number(context.count ?? 1),
      itemIndex: Number(context.itemIndex ?? 0),
      generationSeedKey: `${nodeId}:${mode}:${Number(context.round ?? context.attempt ?? 1)}:${Number(context.itemIndex ?? 0)}`,
      generatedProblemId: problem.id,
    });
    const runtimeMetadata = Object.freeze({
      source: "ROADMAP_RUNTIME",
      ruleId: rule.ruleId,
      unitId: rule.unitId,
      conceptId: rule.defaultConceptId,
      candidateConceptIds: rule.candidateConceptIds,
      prerequisiteConceptIds: rule.prerequisiteConceptIds,
      stage: stageResult.stage,
      stageCandidate: stageResult.stageCandidate,
      problemFamilyId: `roadmap:${nodeId}:${structureSignature}`,
      structureSignature,
      solutionPathSignature,
      conceptMappingConfidence: rule.conceptMappingConfidence,
      stageClassificationConfidence: stageResult.confidence,
      reviewStatus: rule.status === "OUT_OF_SCOPE" ? "OUT_OF_SCOPE" : rule.status === "REVIEW_REQUIRED" ? "REVIEW_REQUIRED" : "AUTO_APPROVED",
      executionStatus,
      exclusionReasons: rule.exclusionReasons,
      metadataVersion: METADATA_VERSION,
      generationContext,
    });
    return { ...problem, runtimeMetadata };
  }

  if (roadmap && rawCreatePracticeSet && !roadmap.__studyMetadataResolverInstalled) {
    Object.defineProperty(roadmap, "__studyRawCreatePracticeSet", { value: rawCreatePracticeSet, enumerable: false });
    Object.defineProperty(roadmap, "__studyMetadataResolverInstalled", { value: true, enumerable: false });
    roadmap.createPracticeSet = function createResolvedPracticeSet(nodeId, mode, round = 1, count = 5) {
      const generated = rawCreatePracticeSet(nodeId, mode, round, count);
      const node = roadmap.nodeById?.[nodeId];
      if (!isMiddle3Node(node)) return generated;
      return generated.map((problem, itemIndex) => resolveRoadmapProblem(problem, {
        nodeId,
        mode,
        round,
        count,
        itemIndex,
      }));
    };
  }

  function createExecutableRoadmapSet(options = {}) {
    if (!rawCreatePracticeSet) return [];
    const requestedNodeIds = Array.isArray(options.nodeIds) ? options.nodeIds : [options.nodeId].filter(Boolean);
    const nodeIds = requestedNodeIds.filter((nodeId) => isMiddle3Node(roadmap?.nodeById?.[nodeId]));
    const mode = options.mode || "basic";
    const count = Math.max(1, Number(options.count) || 1);
    const startingRound = Math.max(1, Number(options.round) || 1);
    const recent = new Set(options.recentEvidence || []);
    const accepted = [];
    for (let pass = 0; pass < 3 && accepted.length < count; pass += 1) {
      for (const nodeId of nodeIds) {
        const generated = rawCreatePracticeSet(nodeId, mode, startingRound + pass, count);
        generated.forEach((problem, itemIndex) => {
          if (accepted.length >= count) return;
          const resolved = resolveRoadmapProblem(problem, {
            nodeId,
            mode,
            round: startingRound + pass,
            count,
            itemIndex,
          });
          const metadata = resolved.runtimeMetadata;
          if (metadata?.executionStatus !== "EXECUTABLE") return;
          if (recent.has(metadata.structureSignature) || recent.has(metadata.solutionPathSignature) || recent.has(problem.id)) return;
          recent.add(metadata.structureSignature);
          recent.add(metadata.solutionPathSignature);
          recent.add(problem.id);
          accepted.push(resolved);
        });
      }
    }
    return accepted;
  }

  function createAttemptSnapshot(problem, options = {}) {
    const metadata = problem?.runtimeMetadata;
    if (!metadata || metadata.source !== "ROADMAP_RUNTIME") return null;
    const presentedAt = options.presentedAt || new Date().toISOString();
    const presentationId = options.presentationId || `${presentedAt}:${problem.id}`;
    return Object.freeze({
      snapshotVersion: SNAPSHOT_VERSION,
      presentationId,
      presentedAt,
      questionId: options.questionId || problem.id,
      generatedProblemId: problem.id,
      prompt: promptOf(problem),
      choices: Object.freeze(cloneArray(problem.choices).map(String)),
      answer: String(problem.answer ?? ""),
      solution: String(solutionOf(problem)),
      questionType: problem.questionType || "multipleChoice",
      difficulty: Number(problem.difficulty) || 1,
      runtimeMetadata: metadata,
    });
  }

  function rememberRecentEvidence(current, snapshot, limit = 60) {
    if (!snapshot?.runtimeMetadata) return cloneArray(current);
    const entry = Object.freeze({
      problemId: snapshot.generatedProblemId,
      structureSignature: snapshot.runtimeMetadata.structureSignature,
      solutionPathSignature: snapshot.runtimeMetadata.solutionPathSignature,
      presentedAt: snapshot.presentedAt,
    });
    const next = [entry, ...(Array.isArray(current) ? current : []).filter((item) => (
      item.problemId !== entry.problemId
      && item.structureSignature !== entry.structureSignature
      && item.solutionPathSignature !== entry.solutionPathSignature
    ))];
    return next.slice(0, Math.max(1, Number(limit) || 60));
  }

  function createRoadmapAuditFixture(round = 1, count = 3) {
    if (!rawCreatePracticeSet) return [];
    return roadmapGenerationRules.flatMap((rule) => rawCreatePracticeSet(rule.nodeId, rule.mode, round, count)
      .map((problem, itemIndex) => resolveRoadmapProblem(problem, {
        nodeId: rule.nodeId,
        mode: rule.mode,
        round,
        count,
        itemIndex,
      })));
  }

  function countBy(items, key) {
    return items.reduce((counts, item) => {
      const value = typeof key === "function" ? key(item) : item?.[key];
      counts[value || "UNSET"] = (counts[value || "UNSET"] || 0) + 1;
      return counts;
    }, {});
  }

  function createSupplyReport() {
    const approvedStatic = [
      ...staticProblemMetadata.filter((item) => item.reviewStatus === "AUTO_APPROVED"),
      ...stageExpansionMetadata,
    ];
    const activeRules = roadmapGenerationRules.filter((item) => item.status === "ACTIVE");
    const byConcept = {};
    (detailData.concepts || []).forEach((concept) => {
      const staticItems = approvedStatic.filter((item) => item.conceptId === concept.conceptId);
      const ruleItems = activeRules.filter((item) => item.defaultConceptId === concept.conceptId);
      const stageCounts = Object.fromEntries(STAGES.map((stage) => [stage, 0]));
      staticItems.forEach((item) => {
        if (item.stage) stageCounts[item.stage] += 1;
      });
      ruleItems.forEach((item) => {
        if (item.modeStageHint && stageCounts[item.modeStageHint] !== undefined) stageCounts[item.modeStageHint] += 1;
      });
      byConcept[concept.conceptId] = {
        staticProblems: staticItems.length,
        roadmapRules: ruleItems.length,
        stageCounts,
        missingStages: STAGES.filter((stage) => stageCounts[stage] === 0),
      };
    });
    return {
      byConcept,
      shortageConceptCount: Object.values(byConcept).filter((item) => item.missingStages.length).length,
    };
  }

  function createAuditReport(options = {}) {
    const fixture = options.includeRoadmapFixture === false ? [] : createRoadmapAuditFixture(1, 3);
    return {
      metadataVersion: METADATA_VERSION,
      staticProblemCount: staticProblemMetadata.length,
      staticBySource: countBy(staticProblemMetadata, "source"),
      staticByReviewStatus: countBy(staticProblemMetadata, "reviewStatus"),
      staticByExecutionStatus: countBy(staticProblemMetadata, "executionStatus"),
      stageExpansionProblemCount: stageExpansionMetadata.length,
      stageExpansionByStage: countBy(stageExpansionMetadata, "stage"),
      stageExpansionSupply: stageExpansionSelection.shortages,
      executableStandardProblemCount: createExecutableStandardProblemPool().length,
      roadmapRuleCount: roadmapGenerationRules.length,
      roadmapRulesByStatus: countBy(roadmapGenerationRules, "status"),
      roadmapRulesByExecutionStatus: countBy(roadmapGenerationRules, "executionStatus"),
      roadmapAuditFixtureCount: fixture.length,
      roadmapAuditByReviewStatus: countBy(fixture, (item) => item.runtimeMetadata?.reviewStatus),
      roadmapAuditByExecutionStatus: countBy(fixture, (item) => item.runtimeMetadata?.executionStatus),
      supply: createSupplyReport(),
      integrityErrors: [
        stageExpansionMetadata.length !== 609 ? `A1~A5 보충 문제가 609개가 아님: ${stageExpansionMetadata.length}` : null,
        stageExpansionSelection.shortages.some((item) => !item.sufficient) ? "A1~A5 독립 풀이 공급이 3개 미만인 세부 개념이 있음" : null,
        new Set(stageExpansionMetadata.map((item) => item.problemId)).size !== stageExpansionMetadata.length ? "A1~A5 보충 문제 ID 중복" : null,
        staticProblemMetadata.length !== 407 ? `정적 메타데이터가 407개가 아님: ${staticProblemMetadata.length}` : null,
        new Set(staticProblemMetadata.map((item) => item.problemId)).size !== staticProblemMetadata.length ? "정적 메타데이터 ID 중복" : null,
        new Set(roadmapGenerationRules.map((item) => item.ruleId)).size !== roadmapGenerationRules.length ? "로드맵 ruleId 중복" : null,
      ].filter(Boolean),
    };
  }

  function executableStaticMetadata(options = {}) {
    const mode = options.mode || "STANDARD";
    return staticProblemMetadata.filter((item) => (
      item.mode === mode
      && item.reviewStatus === "AUTO_APPROVED"
      && (item.executionStatus === "EXECUTABLE" || (mode === "ELITE" && item.executionStatus === "ELITE_ONLY"))
    ));
  }

  return Object.freeze({
    METADATA_VERSION,
    RULE_VERSION,
    SNAPSHOT_VERSION,
    STAGES: Object.freeze([...STAGES]),
    PRACTICE_MODES: Object.freeze([...PRACTICE_MODES]),
    staticProblemMetadata,
    staticMetadataById,
    stageExpansionProblems,
    stageExpansionMetadata,
    stageExpansionMetadataById,
    stageExpansionSupply: stageExpansionSelection.shortages,
    roadmapGenerationRules,
    getStaticMetadata(problemId) { return staticMetadataById.get(problemId) || stageExpansionMetadataById.get(problemId) || null; },
    executableStaticMetadata,
    createOriginalExecutableStandardProblemPool,
    createExecutableStandardProblemPool,
    resolveRoadmapProblem,
    createExecutableRoadmapSet,
    createAttemptSnapshot,
    rememberRecentEvidence,
    createRoadmapAuditFixture,
    createSupplyReport,
    createAuditReport,
    normalizeSignatureText,
    structureSignatureFor,
    solutionPathSignatureFor,
  });
});
