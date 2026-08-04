(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_PLACEMENT_ADAPTER = api;
})(typeof window !== "undefined" ? window : globalThis, function (root) {
  "use strict";
  const PENDING_KEY = "studyCoinEnglishPlacementPendingV1";
  const rankToQualityLevel = (rank) => Math.max(1, Math.min(5, Math.ceil(Math.max(1, Math.min(12, Number(rank) || 1)) / 2.4)));
  const levelIdRank = (levelId) => Number(String(levelId || "").match(/EN-L(\d+)/)?.[1] || 1);

  function createPlacementRecommendation(detail = {}) {
    const recommendedLevel = detail.recommendedLevel || rankToQualityLevel(levelIdRank(detail.levelId));
    const recommendedCycleNumber = Math.max(1, Math.min(10, Number(detail.recommendedCycleNumber || 1)));
    const recommendedCycleId = detail.recommendedCycleId || `EN-L${recommendedLevel}-CYCLE-${String(recommendedCycleNumber).padStart(2,"0")}`;
    const weakGrammarIds = [...new Set(detail.weakGrammarIds || [])];
    const weakVocabularyIds = [...new Set(detail.weakVocabularyIds || [])];
    const readingConfidence = Math.max(0, Math.min(100, Number(detail.readingConfidence ?? 50)));
    const recommendElite = recommendedLevel === 5 && readingConfidence >= 85
      && !weakGrammarIds.length && !weakVocabularyIds.length && Number(detail.inferenceEvidenceCount || 0) >= 3;
    return Object.freeze({
      recommendedLevel, recommendedCycleId, weakGrammarIds:Object.freeze(weakGrammarIds),
      weakVocabularyIds:Object.freeze(weakVocabularyIds), readingConfidence, recommendElite,
      createdAt:Number(detail.timestamp || Date.now()), status:"PENDING_STUDENT_ACCEPTANCE",
    });
  }

  function savePending(storage, recommendation) {
    storage?.setItem?.(PENDING_KEY, JSON.stringify(recommendation));
    return recommendation;
  }
  function loadPending(storage) {
    try { return JSON.parse(storage?.getItem?.(PENDING_KEY) || "null"); } catch { return null; }
  }
  function clearPending(storage) { storage?.removeItem?.(PENDING_KEY); }

  function install({ document = root?.document, storage = root?.localStorage } = {}) {
    if (!document || document.documentElement?.dataset.englishPlacementAdapterInstalled === "true") return;
    document.documentElement.dataset.englishPlacementAdapterInstalled = "true";
    document.addEventListener("study:english-placement", (event) => savePending(storage, createPlacementRecommendation(event.detail)));
    document.addEventListener("click", (event) => {
      if (!event.target?.closest?.("#continueLearningAfterTest")) return;
      const recommendation = loadPending(storage);
      if (!recommendation) return;
      document.dispatchEvent(new CustomEvent("study:english-placement-accepted", { detail: recommendation }));
      clearPending(storage);
    }, true);
  }
  if (root?.document) install();
  return Object.freeze({ PENDING_KEY, rankToQualityLevel, createPlacementRecommendation, savePending, loadPending, clearPending, install });
});
