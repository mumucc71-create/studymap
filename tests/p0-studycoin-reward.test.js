const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = global;
global.STUDY_AUTH_CONFIG = {};
require("../cloud-auth.js");

const root = path.resolve(__dirname, "..");
const cloudAuthSource = fs.readFileSync(path.join(root, "cloud-auth.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
const ledger = global.STUDY_CLOUD_REWARD_LEDGER;

function levelUpEvent() {
  return {
    rewardEventId: "LEVEL_UP:student@example.com:quadratic:BASIC:ADVANCED_1:cycle-7",
    userId: "student@example.com",
    conceptId: "quadratic",
    fromStage: "BASIC",
    toStage: "ADVANCED_1",
    cycleId: "cycle-7",
    amount: 20,
    createdAt: "2026-07-23T00:00:00.000Z",
  };
}

test("the same rewardEventId changes the wallet and transaction ledger once", () => {
  const first = ledger.applyStudyCoinRewardSnapshot({}, levelUpEvent());
  const second = ledger.applyStudyCoinRewardSnapshot(first, levelUpEvent());

  assert.equal(first.awarded, true);
  assert.equal(first.studyCoinWallet.balance, 20);
  assert.equal(first.studyCoinTransactions.length, 1);
  assert.deepEqual(first.processedRewardEventIds, [levelUpEvent().rewardEventId]);
  assert.equal(second.awarded, false);
  assert.equal(second.reason, "ALREADY_PROCESSED");
  assert.equal(second.studyCoinWallet.balance, 20);
  assert.equal(second.studyCoinTransactions.length, 1);
  assert.equal(second.processedRewardEventIds.length, 1);
});

test("a malformed or non-promotion reward event is rejected", () => {
  const malformed = ledger.applyStudyCoinRewardSnapshot({}, {
    ...levelUpEvent(),
    rewardEventId: "LEVEL_UP:student@example.com:quadratic:BASIC:ADVANCED_1:other-cycle",
  });
  const unchangedStage = ledger.applyStudyCoinRewardSnapshot({}, {
    ...levelUpEvent(),
    rewardEventId: "LEVEL_UP:student@example.com:quadratic:BASIC:BASIC:cycle-7",
    toStage: "BASIC",
  });
  const skippedStage = ledger.applyStudyCoinRewardSnapshot({}, {
    ...levelUpEvent(),
    rewardEventId: "LEVEL_UP:student@example.com:quadratic:BASIC:ADVANCED_2:cycle-7",
    toStage: "ADVANCED_2",
  });

  assert.equal(malformed.awarded, false);
  assert.equal(malformed.reason, "INVALID_REWARD_EVENT");
  assert.equal(unchangedStage.awarded, false);
  assert.equal(unchangedStage.reason, "INVALID_REWARD_EVENT");
  assert.equal(skippedStage.reason, "INVALID_REWARD_EVENT");
});

test("Firestore awards run in a transaction and animation runs only after a new award", () => {
  assert.match(cloudAuthSource, /runTransaction\(deps\.db, async \(transaction\) =>/);
  assert.match(cloudAuthSource, /const snapshot = await transaction\.get\(reference\)/);
  assert.match(cloudAuthSource, /if \(!result\.awarded\) return result/);
  assert.match(cloudAuthSource, /throw new Error\("REWARD_USER_MISMATCH"\)/);
  assert.match(cloudAuthSource, /processedRewardEventIds: result\.processedRewardEventIds/);
  assert.match(cloudAuthSource, /studyCoinTransactions: result\.studyCoinTransactions/);
  assert.match(appSource, /if \(result\.awarded\) window\.STUDY_REWARDS\?\.showCoinReward/);
  assert.match(appSource, /memory\.processedRewardEventIds\?\.includes\(rewardEventId\)/);
});
