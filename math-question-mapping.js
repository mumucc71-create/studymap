(function () {
  const roadmap = window.STUDY_MATH_ROADMAP_V2;
  const unit = window.STUDY_LEARNING_CONTENT?.subjects?.mathematics?.tracks?.middle2_semester1?.units?.[0];
  if (!roadmap || !unit) return;
  const modeByLegacyStage = {
    concept: "concept",
    basic: "basic",
    repeat: "typePractice",
    application: "advanced",
    advanced: "written",
    past: "pastExam",
    final: "assessment",
  };
  const targetTitleFor = (concept) => {
    if (String(concept).includes("대소 관계")) return "소수 크기 비교";
    if (String(concept).includes("계산")) return "소수 혼합계산";
    return "분수와 소수의 관계";
  };
  const mappings = unit.questions.map((question) => {
    const targetTitle = targetTitleFor(question.concept);
    const node = roadmap.nodes.find((item) => item.title === targetTitle);
    return {
      questionId: question.id,
      worldId: node?.worldId || null,
      chapterId: node?.chapterId || null,
      nodeId: node?.id || null,
      mode: modeByLegacyStage[question.stage] || null,
      legacyId: { courseId: "middle2_semester1", stageId: question.stage, skillId: question.concept },
      confidence: node ? 0.94 : 0,
      status: node ? "mapped" : "unmapped",
      reason: node ? `문제 개념 '${question.concept}'을(를) '${targetTitle}' 노드에 연결함` : "정확한 대상 노드를 찾지 못함",
    };
  });
  window.STUDY_MATH_QUESTION_MAPPING = {
    version: "1.0.0",
    mappings,
    activeMappings: mappings.filter((item) => item.status === "mapped"),
    reviewRequired: mappings.filter((item) => item.status === "reviewRequired"),
    unmapped: mappings.filter((item) => item.status === "unmapped"),
  };
})();
