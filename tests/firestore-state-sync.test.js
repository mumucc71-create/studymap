const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const cloudAuth = fs.readFileSync(path.join(root, "cloud-auth.js"), "utf8");
const firebaseConfig = fs.readFileSync(path.join(root, "firebase-config.js"), "utf8");
const firestoreRules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
const firebaseJson = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));

test("cloud auth exposes account-scoped app-state operations", () => {
  assert.match(cloudAuth, /stateSyncEnabled: Boolean\(config\.useFirestore\)/);
  assert.match(cloudAuth, /async loadUserState\(stateKey\)/);
  assert.match(cloudAuth, /async saveUserState\(stateKey, state\)/);
  assert.match(cloudAuth, /async deleteUserState\(stateKey\)/);
  assert.match(cloudAuth, /"users", user\.uid, "appState", normalizedKey/);
});

test("learning settings are stored in the Firebase profile for cross-browser grade restore", () => {
  assert.match(cloudAuth, /function normalizeLearningSettings\(settings\)/);
  assert.match(cloudAuth, /profileRecord\.learningSettings = learningSettings/);
  assert.match(cloudAuth, /learningSettings: normalizeLearningSettings\(profile\.learningSettings\)/);
  assert.match(script, /learningSettings: account\.learningSettings \|\| fallback\.learningSettings \|\| existing\.learningSettings/);
  assert.match(script, /STUDY_CLOUD_AUTH\.syncUserRecord\(restoredUser\)/);
});

test("math level-test state uses Firebase as the long-term source and local storage as a cache", () => {
  assert.match(script, /middle3CloudStateKey = "middle3-math-level-test-v1"/);
  assert.match(script, /function levelTestStateKey\(\)/);
  assert.match(script, /function scheduleMiddle3CloudSync\(\)/);
  assert.match(script, /async function syncMiddle3LevelTestToCloud\(/);
  assert.match(script, /async function hydrateMiddle3LevelTestFromCloud\(/);
  assert.match(script, /resolveMathHydrationState\(remote, localMemory, localResume\)/);
  assert.match(script, /recordMiddle3RemoteWinsConflict\(resolution\)/);
  assert.match(script, /middle3CloudHydrationStatus = "LOADING"/);
  assert.doesNotMatch(script, /queuedUpdatedAt > remoteUpdatedAt/);
  assert.match(script, /restoreMiddle3MemoryFromRemote\(remoteState, accountKey\)/);
  assert.match(script, /localStorage\.removeItem\(levelTestStateKey\(\)\)/);
  assert.match(script, /studyCoinLevelTestCloudQueueV1/);
  for (const field of [
    "bootstrap", "activeSession", "activeCycle", "resumeState", "conceptStageMap", "conceptMastery",
    "pendingRechecks", "recoveryStack", "returnCheckpoint", "spacedReviewQueue", "recommendations",
    "learningCompletionEvidence", "pendingIndependentChecks", "answeredProblemIds", "recentFingerprints",
    "studyCoinWallet", "studyCoinTransactions", "processedRewardEventIds",
  ]) {
    assert.match(script, new RegExp(`${field}(?:\\s*:|\\s*,)`), `${field} must be included in the Firebase payload`);
  }
  assert.match(script, /studyMapRecommendations/);
  assert.match(script, /lastRecommendationGeneratedCycle/);
  assert.match(script, /refreshMiddle3StudyRecommendations\("cloud-restore"\)/);
  const cycleStart = script.match(/function startMiddle3Cycle\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(cycleStart, /saveLevelTestState\(\)/);
});

test("Firestore state sync is enabled after database creation", () => {
  assert.match(firebaseConfig, /useFirestore: true/);
});

test("Firestore rules isolate profiles and app state by authenticated uid", () => {
  assert.equal(firebaseJson.firestore.rules, "firestore.rules");
  assert.match(firestoreRules, /request\.auth\.uid == userId/);
  assert.match(firestoreRules, /match \/appState\/\{stateId\}/);
  assert.match(firestoreRules, /request\.resource\.data\.ownerUid == userId/);
});
