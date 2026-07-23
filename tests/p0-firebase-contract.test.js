const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");

test("Firebase payload contains every P0 cross-browser recovery field", () => {
  const start = script.indexOf("function buildMiddle3LongTermState(");
  const end = script.indexOf("function restoreMiddle3MemoryFromRemote(", start);
  const builder = script.slice(start, end);
  const requiredFields = [
    "bootstrap", "activeSession", "activeCycle", "resumeState", "conceptStageMap", "conceptMastery",
    "pendingRechecks", "recoveryStack", "returnCheckpoint", "spacedReviewQueue", "recommendations",
    "learningCompletionEvidence", "pendingIndependentChecks", "answeredProblemIds", "recentFingerprints",
    "studyCoinWallet", "studyCoinTransactions", "processedRewardEventIds",
  ];
  requiredFields.forEach((field) => assert.match(builder, new RegExp(`${field}(?:\\s*:|\\s*,)`), field));
});

test("remote state always wins over a local queue for a signed-in math test", () => {
  const hydrate = script.match(/async function hydrateMiddle3LevelTestFromCloud\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(hydrate, /let remote = await cloud\.loadUserState/);
  assert.doesNotMatch(hydrate, /queuedUpdatedAt > remoteUpdatedAt/);
  assert.match(hydrate, /resolveMathHydrationState\(remote, localMemory, localResume\)/);
  assert.match(hydrate, /recordMiddle3RemoteWinsConflict\(resolution\)/);
  assert.match(hydrate, /restoreMiddle3MemoryFromRemote\(remoteState, accountKey\)/);
  assert.match(hydrate, /localStorage\.removeItem\(levelTestStateKey\(\)\)/);
  assert.match(hydrate, /await retryPendingMiddle3LevelUpRewards\(\)/);
});

test("FINAL attempts and StudyCoin ledger are restored from the Firebase document", () => {
  const restore = script.match(/function restoreMiddle3MemoryFromRemote\([\s\S]*?\n\}/)?.[0] || "";
  assert.match(restore, /restored\.attemptsByKey/);
  assert.match(restore, /remote\.studyCoinWallet \|\| longTerm\.studyCoinWallet/);
  assert.match(restore, /remote\.studyCoinTransactions \|\| longTerm\.studyCoinTransactions/);
  assert.match(restore, /remote\.processedRewardEventIds \|\| longTerm\.processedRewardEventIds/);
  assert.match(restore, /localStorage\.setItem\(accountKey, JSON\.stringify\(restored\)\)/);
});
