(function () {
  function normalizeStudyCoinLedger(data = {}) {
    return {
      studyCoinWallet: {
        balance: Math.max(0, Number(data.studyCoinWallet?.balance) || 0),
        updatedAt: String(data.studyCoinWallet?.updatedAt || ""),
      },
      studyCoinTransactions: Array.isArray(data.studyCoinTransactions) ? data.studyCoinTransactions.map((item) => ({ ...item })) : [],
      processedRewardEventIds: Array.isArray(data.processedRewardEventIds) ? [...new Set(data.processedRewardEventIds.map(String))] : [],
    };
  }

  function applyStudyCoinRewardSnapshot(data = {}, event = {}) {
    const ledger = normalizeStudyCoinLedger(data);
    const rewardEventId = String(event.rewardEventId || "").trim();
    const amount = Math.max(0, Number(event.amount) || 0);
    const expectedRewardEventId = `LEVEL_UP:${[
      event.userId,
      event.conceptId,
      event.fromStage,
      event.toStage,
      event.cycleId,
    ].map((value) => String(value || "").trim()).join(":")}`;
    const stageOrder = ["BASIC", "ADVANCED_1", "ADVANCED_2", "ADVANCED_3", "ADVANCED_4", "ADVANCED_5"];
    const fromStageIndex = stageOrder.indexOf(String(event.fromStage || ""));
    const toStageIndex = stageOrder.indexOf(String(event.toStage || ""));
    if (!rewardEventId.startsWith("LEVEL_UP:")
      || rewardEventId !== expectedRewardEventId
      || !amount
      || fromStageIndex < 0
      || toStageIndex !== fromStageIndex + 1) {
      return { awarded: false, reason: "INVALID_REWARD_EVENT", ...ledger };
    }
    if (ledger.processedRewardEventIds.includes(rewardEventId)) {
      return { awarded: false, reason: "ALREADY_PROCESSED", ...ledger };
    }
    const createdAt = String(event.createdAt || new Date().toISOString());
    const transaction = {
      transactionId: rewardEventId,
      rewardEventId,
      type: "LEVEL_UP",
      amount,
      balanceBefore: ledger.studyCoinWallet.balance,
      balanceAfter: ledger.studyCoinWallet.balance + amount,
      conceptId: String(event.conceptId || ""),
      fromStage: String(event.fromStage || ""),
      toStage: String(event.toStage || ""),
      cycleId: String(event.cycleId || ""),
      createdAt,
    };
    return {
      awarded: true,
      reason: "AWARDED",
      studyCoinWallet: { balance: transaction.balanceAfter, updatedAt: createdAt },
      studyCoinTransactions: [...ledger.studyCoinTransactions, transaction],
      processedRewardEventIds: [...ledger.processedRewardEventIds, rewardEventId],
      transaction,
    };
  }

  window.STUDY_CLOUD_REWARD_LEDGER = { normalizeStudyCoinLedger, applyStudyCoinRewardSnapshot };

  function cloneMathState(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function mathStateParts(state = {}) {
    const longTerm = state.longTermState || {};
    const memory = state.memory || {};
    const activeCycle = longTerm.activeCycle || memory.activeCycle || state.activeCycle || null;
    const resumeState = state.resumeState || longTerm.resumeState || {};
    const attemptsByKey = longTerm.attemptsByKey || memory.attemptsByKey || state.attemptsByKey || {};
    return { activeCycle, resumeState, attemptsByKey };
  }

  function countConsecutiveFinalAttempts(state = {}) {
    const { activeCycle, resumeState, attemptsByKey } = mathStateParts(state);
    if (!activeCycle?.id) return 0;
    const questions = Array.isArray(resumeState.activeQuestions) ? resumeState.activeQuestions : [];
    let count = 0;
    for (const question of questions) {
      const problemId = String(question?.id || question?.questionId || "");
      if (!problemId || attemptsByKey[`${activeCycle.id}:${problemId}`]?.attemptStatus !== "FINAL") break;
      count += 1;
    }
    return count;
  }

  function describeMathState(state = {}) {
    const { activeCycle, resumeState, attemptsByKey } = mathStateParts(state);
    return {
      cycleId: String(activeCycle?.id || ""),
      cycleNumber: Number(activeCycle?.number) || 0,
      answersCount: Array.isArray(activeCycle?.answers) ? activeCycle.answers.length : 0,
      currentQuestion: Number.isInteger(resumeState.currentQuestion) ? resumeState.currentQuestion : 0,
      finalAttemptCount: Object.values(attemptsByKey).filter((attempt) => attempt?.attemptStatus === "FINAL").length,
      updatedAt: String(state.updatedAt || ""),
    };
  }

  function calculateRemoteCurrentQuestion(state = {}) {
    const { activeCycle, resumeState, attemptsByKey } = mathStateParts(state);
    const answerCount = Array.isArray(activeCycle?.answers) ? activeCycle.answers.length : 0;
    const hasFinalAttempts = Object.values(attemptsByKey).some((attempt) => attempt?.attemptStatus === "FINAL");
    const confirmedFinalCount = hasFinalAttempts ? countConsecutiveFinalAttempts(state) : answerCount;
    const questions = Array.isArray(resumeState.activeQuestions) ? resumeState.activeQuestions : [];
    const lastAvailableIndex = questions.length ? questions.length - 1 : Math.min(answerCount, confirmedFinalCount);
    return Math.max(0, Math.min(answerCount, confirmedFinalCount, lastAvailableIndex));
  }

  function normalizeRemoteMathState(remote) {
    const normalized = cloneMathState(remote);
    if (!normalized) return null;
    const currentQuestion = calculateRemoteCurrentQuestion(normalized);
    const sourceResume = normalized.resumeState || normalized.longTermState?.resumeState || {};
    const resumeState = {
      ...cloneMathState(sourceResume),
      currentQuestion,
      selectedAnswers: Array.isArray(sourceResume.selectedAnswers)
        ? sourceResume.selectedAnswers.slice(0, currentQuestion)
        : [],
    };
    normalized.resumeState = resumeState;
    normalized.longTermState = normalized.longTermState || {};
    normalized.longTermState.resumeState = cloneMathState(resumeState);
    return normalized;
  }

  function resolveMathHydrationState(remote, localMemory, localResume) {
    if (!remote) {
      return {
        source: "LOCAL_CANDIDATE",
        state: null,
        conflict: false,
        discardedLocalAnswerCount: 0,
      };
    }
    const normalizedRemote = normalizeRemoteMathState(remote);
    const remoteSummary = describeMathState(normalizedRemote);
    const localSummary = describeMathState({ memory: localMemory || {}, resumeState: localResume || {} });
    const conflict = Boolean(localSummary.cycleId) && (
      localSummary.cycleId !== remoteSummary.cycleId
      || localSummary.answersCount !== remoteSummary.answersCount
      || localSummary.currentQuestion !== remoteSummary.currentQuestion
      || localSummary.finalAttemptCount !== remoteSummary.finalAttemptCount
    );
    return {
      source: "REMOTE",
      state: normalizedRemote,
      conflict,
      remoteSummary,
      localSummary,
      discardedLocalAnswerCount: Math.max(0, localSummary.answersCount - remoteSummary.answersCount),
    };
  }

  function validateMathAttemptCommit(currentState, nextState, request = {}) {
    const current = describeMathState(currentState);
    const next = describeMathState(nextState);
    const cycleId = String(request.cycleId || "");
    const problemId = String(request.problemId || "");
    const submissionId = String(request.submissionId || "");
    const expectedAnswerCount = Number(request.expectedAnswerCount);
    const expectedCurrentQuestion = Number(request.expectedCurrentQuestion);
    if (!cycleId || !problemId || !submissionId) return { ok: false, reason: "INVALID_ATTEMPT" };
    if (current.cycleId !== cycleId) return { ok: false, reason: "CYCLE_MISMATCH" };
    if (current.answersCount !== expectedAnswerCount) return { ok: false, reason: "ANSWER_COUNT_MISMATCH" };
    if (calculateRemoteCurrentQuestion(currentState) !== expectedCurrentQuestion) return { ok: false, reason: "QUESTION_MISMATCH" };
    if (request.expectedUpdatedAt && current.updatedAt !== String(request.expectedUpdatedAt)) {
      return { ok: false, reason: "REVISION_MISMATCH" };
    }
    const currentAttempts = mathStateParts(currentState).attemptsByKey;
    const attemptKey = `${cycleId}:${problemId}`;
    if (currentAttempts[attemptKey]?.attemptStatus === "FINAL") return { ok: false, reason: "FINAL_EXISTS" };
    if (Object.values(currentAttempts).some((attempt) => attempt?.submissionId === submissionId)) {
      return { ok: false, reason: "SUBMISSION_EXISTS" };
    }
    const nextAttempts = mathStateParts(nextState).attemptsByKey;
    if (next.cycleId !== cycleId || next.answersCount !== expectedAnswerCount + 1) {
      return { ok: false, reason: "INVALID_NEXT_STATE" };
    }
    if (nextAttempts[attemptKey]?.attemptStatus !== "FINAL"
      || nextAttempts[attemptKey]?.submissionId !== submissionId) {
      return { ok: false, reason: "FINAL_ATTEMPT_MISSING" };
    }
    return { ok: true, reason: "READY" };
  }

  function canSubmitMathState(cloudHydrationStatus) {
    return cloudHydrationStatus === "READY";
  }

  window.STUDY_MATH_CLOUD_SYNC = {
    mathStateParts,
    describeMathState,
    calculateRemoteCurrentQuestion,
    normalizeRemoteMathState,
    resolveMathHydrationState,
    validateMathAttemptCommit,
    canSubmitMathState,
  };

  const config = window.STUDY_AUTH_CONFIG || {};
  const firebaseConfig = config.firebase || {};
  const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"];
  const isConfigured = requiredConfigKeys.every((key) => String(firebaseConfig[key] || "").trim());

  if (!isConfigured) {
    window.STUDY_CLOUD_AUTH = {
      isConfigured: false,
      configurationMessage: "Firebase 웹 앱 설정이 필요합니다.",
    };
    return;
  }

  const sdkVersion = "12.16.0";
  const ready = Promise.all([
    import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-auth.js`),
    config.useFirestore
      ? import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-firestore.js`)
      : Promise.resolve(null),
  ]).then(async ([appSdk, authSdk, firestoreSdk]) => {
    const app = appSdk.initializeApp(firebaseConfig);
    const auth = authSdk.getAuth(app);
    await authSdk.setPersistence(auth, authSdk.browserLocalPersistence);
    const db = firestoreSdk ? firestoreSdk.getFirestore(app) : null;
    return { app, auth, authSdk, db, firestoreSdk };
  });

  const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

  function normalizeLearningSettings(settings) {
    if (!settings || typeof settings !== "object") return null;
    return {
      role: String(settings.role || "student"),
      grade: String(settings.grade || ""),
      school: String(settings.school || ""),
      gender: String(settings.gender || ""),
      subjects: Array.isArray(settings.subjects) ? settings.subjects.map(String).slice(0, 10) : [],
      dream: String(settings.dream || ""),
    };
  }

  async function readProfile(deps, user) {
    if (!deps.db || !deps.firestoreSdk || !user) return {};
    try {
      const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid);
      const snapshot = await deps.firestoreSdk.getDoc(reference);
      return snapshot.exists() ? snapshot.data() : {};
    } catch (error) {
      console.warn("[StudyMap] Firebase 프로필을 불러오지 못해 로컬 정보로 계속합니다.", error?.code || error?.message || error);
      return {};
    }
  }

  async function writeProfile(deps, user, record) {
    if (!deps.db || !deps.firestoreSdk || !user) return false;
    try {
      const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid);
      const profileRecord = {
        uid: user.uid,
        email: normalizeEmail(user.email || record.email),
        name: record.name || user.displayName || "학생",
        role: record.role || "student",
        onboardingComplete: Boolean(record.onboardingComplete),
        provider: record.provider || user.providerData?.[0]?.providerId || "password",
        updatedAt: new Date().toISOString(),
      };
      const learningSettings = normalizeLearningSettings(record.learningSettings);
      if (learningSettings) profileRecord.learningSettings = learningSettings;
      await deps.firestoreSdk.setDoc(reference, profileRecord, { merge: true });
      return true;
    } catch (error) {
      console.warn("[StudyMap] Firebase 프로필 저장을 보류하고 로컬 정보로 계속합니다.", error?.code || error?.message || error);
      return false;
    }
  }

  function normalizeStateKey(stateKey) {
    return String(stateKey || "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 120);
  }

  async function loadUserState(deps, stateKey) {
    const user = deps.auth.currentUser;
    if (!deps.db || !deps.firestoreSdk || !user) return null;
    const normalizedKey = normalizeStateKey(stateKey);
    if (!normalizedKey) return null;
    const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid, "appState", normalizedKey);
    const snapshot = await deps.firestoreSdk.getDoc(reference);
    return snapshot.exists() ? snapshot.data() : null;
  }

  async function saveUserState(deps, stateKey, state) {
    const user = deps.auth.currentUser;
    if (!deps.db || !deps.firestoreSdk || !user) return false;
    const normalizedKey = normalizeStateKey(stateKey);
    if (!normalizedKey) return false;
    const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid, "appState", normalizedKey);
    await deps.firestoreSdk.setDoc(reference, {
      ...state,
      ownerUid: user.uid,
      syncedAt: deps.firestoreSdk.serverTimestamp(),
    }, { merge: true });
    return true;
  }

  async function commitMathLevelTestAttempt(deps, stateKey, request) {
    const user = deps.auth.currentUser;
    if (!deps.db || !deps.firestoreSdk || !user) throw new Error("FIREBASE_MATH_SYNC_UNAVAILABLE");
    const normalizedKey = normalizeStateKey(stateKey);
    if (!normalizedKey) throw new Error("INVALID_STATE_KEY");
    const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid, "appState", normalizedKey);
    return deps.firestoreSdk.runTransaction(deps.db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      const currentState = snapshot.exists() ? snapshot.data() : null;
      if (!currentState) return { committed: false, reason: "REMOTE_STATE_MISSING" };
      const validation = validateMathAttemptCommit(currentState, request.nextState, request);
      if (!validation.ok) return { committed: false, reason: validation.reason };
      transaction.set(reference, {
        ...request.nextState,
        ownerUid: user.uid,
        syncedAt: deps.firestoreSdk.serverTimestamp(),
      }, { merge: true });
      return { committed: true, reason: "COMMITTED", updatedAt: request.nextState.updatedAt };
    });
  }

  async function deleteUserState(deps, stateKey) {
    const user = deps.auth.currentUser;
    if (!deps.db || !deps.firestoreSdk || !user) return false;
    const normalizedKey = normalizeStateKey(stateKey);
    if (!normalizedKey) return false;
    const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid, "appState", normalizedKey);
    await deps.firestoreSdk.deleteDoc(reference);
    return true;
  }

  async function grantStudyCoinReward(deps, stateKey, event) {
    const user = deps.auth.currentUser;
    if (!deps.db || !deps.firestoreSdk || !user) throw new Error("FIREBASE_REWARD_UNAVAILABLE");
    const eventUserId = String(event?.userId || "").trim().toLowerCase();
    const authenticatedUserIds = [String(user.uid || "").toLowerCase(), normalizeEmail(user.email)];
    if (!authenticatedUserIds.includes(eventUserId)) throw new Error("REWARD_USER_MISMATCH");
    const normalizedKey = normalizeStateKey(stateKey);
    if (!normalizedKey) throw new Error("INVALID_STATE_KEY");
    const reference = deps.firestoreSdk.doc(deps.db, "users", user.uid, "appState", normalizedKey);
    return deps.firestoreSdk.runTransaction(deps.db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      const current = snapshot.exists() ? snapshot.data() : {};
      const result = applyStudyCoinRewardSnapshot(current, event);
      if (!result.awarded) return result;
      transaction.set(reference, {
        ownerUid: user.uid,
        studyCoinWallet: result.studyCoinWallet,
        studyCoinTransactions: result.studyCoinTransactions,
        processedRewardEventIds: result.processedRewardEventIds,
        updatedAt: result.studyCoinWallet.updatedAt,
        syncedAt: deps.firestoreSdk.serverTimestamp(),
      }, { merge: true });
      return result;
    });
  }

  function toAccount(user, profile = {}, provider) {
    const email = normalizeEmail(user?.email || profile.email);
    const isAnonymous = Boolean(user?.isAnonymous);
    const providerKey = provider || profile.provider || user?.providerData?.[0]?.providerId || (isAnonymous ? "anonymous" : "password");
    return {
      id: email || `${providerKey}:${user.uid}`,
      uid: user.uid,
      email,
      name: profile.name || user.displayName || "학생",
      role: profile.role || "student",
      provider: providerKey,
      isAnonymous,
      onboardingComplete: Boolean(profile.onboardingComplete),
      learningSettings: normalizeLearningSettings(profile.learningSettings),
    };
  }

  window.STUDY_CLOUD_AUTH = {
    isConfigured: true,
    stateSyncEnabled: Boolean(config.useFirestore),
    ready,

    async signUpWithEmail(email, password, profile = {}) {
      const deps = await ready;
      const normalizedEmail = normalizeEmail(email);
      const credential = await deps.authSdk.createUserWithEmailAndPassword(deps.auth, normalizedEmail, password);
      if (profile.name) await deps.authSdk.updateProfile(credential.user, { displayName: profile.name });
      const record = {
        ...profile,
        email: normalizedEmail,
        provider: "password",
        onboardingComplete: Boolean(profile.onboardingComplete),
      };
      await writeProfile(deps, credential.user, record);
      return toAccount(credential.user, record, "password");
    },

    async signInWithEmail(email, password) {
      const deps = await ready;
      const credential = await deps.authSdk.signInWithEmailAndPassword(deps.auth, normalizeEmail(email), password);
      const profile = await readProfile(deps, credential.user);
      return toAccount(credential.user, profile, "password");
    },

    async signInWithProvider(provider) {
      const deps = await ready;
      if (provider === "카카오") {
        const kakao = new deps.authSdk.OAuthProvider(config.kakaoProviderId || "oidc.kakao");
        const credential = await deps.authSdk.signInWithPopup(deps.auth, kakao);
        const savedProfile = await readProfile(deps, credential.user);
        const account = toAccount(credential.user, savedProfile, "kakao");
        await writeProfile(deps, credential.user, account);
        return account;
      }

      if (provider === "네이버" && config.naver?.signInUrl) {
        window.location.assign(config.naver.signInUrl);
        return new Promise(() => {});
      }

      throw new Error(`${provider} 인증 서버 설정이 필요합니다.`);
    },

    async restoreSession() {
      const deps = await ready;
      if (typeof deps.auth.authStateReady === "function") await deps.auth.authStateReady();
      if (!deps.auth.currentUser) return null;
      const profile = await readProfile(deps, deps.auth.currentUser);
      return toAccount(deps.auth.currentUser, profile);
    },

    async syncUserRecord(record) {
      const deps = await ready;
      if (!deps.auth.currentUser) return;
      await writeProfile(deps, deps.auth.currentUser, record || {});
    },

    async loadUserState(stateKey) {
      const deps = await ready;
      return loadUserState(deps, stateKey);
    },

    async saveUserState(stateKey, state) {
      const deps = await ready;
      return saveUserState(deps, stateKey, state || {});
    },

    async commitMathLevelTestAttempt(stateKey, request) {
      const deps = await ready;
      return commitMathLevelTestAttempt(deps, stateKey, request || {});
    },

    async deleteUserState(stateKey) {
      const deps = await ready;
      return deleteUserState(deps, stateKey);
    },

    async grantStudyCoinReward(stateKey, event) {
      const deps = await ready;
      return grantStudyCoinReward(deps, stateKey, event || {});
    },

    async changePassword(password) {
      const deps = await ready;
      if (!deps.auth.currentUser) throw new Error("로그인이 필요합니다.");
      await deps.authSdk.updatePassword(deps.auth.currentUser, password);
    },

    async changeEmail(email, currentPassword) {
      const deps = await ready;
      const user = deps.auth.currentUser;
      if (!user) throw new Error("로그인이 필요합니다.");
      const normalizedEmail = normalizeEmail(email);
      if (user.email && currentPassword) {
        const credential = deps.authSdk.EmailAuthProvider.credential(user.email, currentPassword);
        await deps.authSdk.reauthenticateWithCredential(user, credential);
      }
      await deps.authSdk.updateEmail(user, normalizedEmail);
      const profile = await readProfile(deps, user);
      await writeProfile(deps, user, { ...profile, email: normalizedEmail });
      return toAccount(user, { ...profile, email: normalizedEmail });
    },

    async signOut() {
      const deps = await ready;
      await deps.authSdk.signOut(deps.auth);
    },
  };
})();
