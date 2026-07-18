(() => {
  "use strict";

  const USER_KEY = "studyCoinCurrentUser";
  const STORAGE_PREFIX = "studyCoinSocialV2:";
  const SOCIAL_VERSION = 3;
  const avatars = [
    "assets/profile-avatar-main-cutout.png", "assets/profile-avatar-yellow-cutout.png",
    "assets/profile-avatar-joy-cutout.png", "assets/profile-avatar-calm-cutout.png",
    "assets/profile-avatar-sad-cutout.png", "assets/profile-avatar-tired-cutout.png",
    "assets/profile-avatar-angry-cutout.png", "assets/profile-avatar-anxious-cutout.png",
    "assets/profile-avatar-warm-cutout.png", "assets/profile-avatar-fresh-cutout.png",
    "assets/profile-avatar-hanja-cutout.png", "assets/profile-avatar-reading-cutout.png",
  ];
  const firstNames = ["별이", "하늘", "아윤", "유나", "서우", "시아", "민지", "지우", "하린", "준서", "예린", "시오", "도윤", "건우", "채원", "이든", "다온", "주원", "가온", "로아"];

  function currentUserId() {
    return localStorage.getItem(USER_KEY) || "guest";
  }
  function storageKey() { return `${STORAGE_PREFIX}${currentUserId()}`; }
  function openScreen(name) {
    if (window.STUDY_NAV?.go) window.STUDY_NAV.go(name);
    else document.querySelectorAll("[data-screen]").forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });
    localStorage.setItem("studyCoinCurrentScreen", name);
    window.scrollTo?.(0, 0);
  }
  function levelFromPoints(points) { return Math.max(1, Math.floor((points || 0) / 300) + 1); }
  function formatMinutes(minutes) {
    const value = Math.max(0, Math.round(minutes || 0));
    return value >= 60 ? `${Math.floor(value / 60)}시간 ${value % 60}분` : `${value}분`;
  }  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function makeAiLearners() {
    return Array.from({ length: 100 }, (_, index) => {
      const points = 60 + ((index * 83) % 1900);
      return {
        id: `ai-${index + 1}`,
        name: firstNames[index % firstNames.length],
        avatar: avatars[index % avatars.length],
        points,
        level: levelFromPoints(points),
        studyMinutes: 10 + ((index * 17) % 140),
      };
    });
  }
  function defaultRooms(aiFriends) {
    const subjects = ["수학", "영어", "독서", "과학", "한자"];
    return Array.from({ length: 20 }, (_, index) => ({
      id: `ai-room-${index + 1}`,
      name: `${subjects[index % subjects.length]} 집중 공부방 ${Math.floor(index / 5) + 1}`,
      description: "함께 오늘의 목표를 달성해요.",
      subject: subjects[index % subjects.length],
      level: `${Math.floor(index / 2) + 1}~${Math.floor(index / 2) + 5}`,
      createdBy: "ai",
      aiMembers: [aiFriends[(index * 3) % aiFriends.length].id, aiFriends[(index * 3 + 1) % aiFriends.length].id],
      joinedAt: null,
    }));
  }
  function defaultState() {
    const aiFriends = makeAiLearners();
    return {
      version: SOCIAL_VERSION,
      points: 0,
      studyMinutes: 0,
      roomMinutes: 0,
      roomReaction: null,
      avatarChanged: false,
      joinedRoomId: null,
      roomStartedAt: null,
      activities: {},
      planGoal: { id: "mathematics", title: "수학 학습 변경", subject: "mathematics", target: 10 },
      aiFriends,
      rooms: defaultRooms(aiFriends),
      missions: [
        { id: "math", title: "수학 문제 10개 풀기", target: 10, value: 0, type: "questions" },
        { id: "room", title: "공부방에서 1시간 공부", target: 60, value: 0, type: "roomMinutes" },
        { id: "avatar", title: "아바타 바꾸기", target: 1, value: 0, type: "avatar" },
      ],
    };
  }
  function hasRecordedActivity(state) {
    return Object.values(state?.activities || {}).some(isActiveStudyDay)
      || Number(state?.points || 0) > 0
      || Number(state?.studyMinutes || 0) > 0
      || Number(state?.roomMinutes || 0) > 0;
  }
  function recoverStateFromExistingLearning() {
    const userId = currentUserId();
    if (userId !== "guest") {
      try {
        const guestState = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}guest`) || "null");
        if (guestState?.version === SOCIAL_VERSION && Array.isArray(guestState.aiFriends) && hasRecordedActivity(guestState)) {
          return { ...guestState, recoveredFrom: "guest" };
        }
      } catch (_) { /* Continue with learning history recovery. */ }
    }

    try {
      const learning = JSON.parse(localStorage.getItem(`studyCoinMathLearningV3:${userId}`) || "null");
      const dailyActivity = learning?.dailyActivity || {};
      if (!Object.keys(dailyActivity).length) return null;
      const recovered = defaultState();
      Object.entries(dailyActivity).forEach(([key, activity]) => {
        const questions = activity?.answeredQuestionIds?.length || 0;
        const correct = activity?.correctQuestionIds?.length || 0;
        if (!questions) return;
        const points = (correct * 10) + ((questions - correct) * 2);
        recovered.activities[key] = {
          questions,
          correct,
          minutes: questions,
          roomMinutes: 0,
          points,
          missions: 0,
          subjects: { mathematics: questions },
        };
        recovered.points += points;
        recovered.studyMinutes += questions;
      });
      return hasRecordedActivity(recovered) ? { ...recovered, recoveredFrom: "math-learning" } : null;
    } catch (_) {
      return null;
    }
  }
  function restoreSubjectTotals(state) {
    let changed = false;
    try {
      const userId = currentUserId();
      const math = JSON.parse(localStorage.getItem(`studyCoinMathLearningV3:${userId}`) || "null");
      Object.entries(math?.dailyActivity || {}).forEach(([key, activity]) => {
        const questions = activity?.answeredQuestionIds?.length || 0;
        const correct = activity?.correctQuestionIds?.length || 0;
        if (!questions) return;
        const target = getActivity(state, key);
        target.subjects ||= {};
        const existing = Number(target.subjects?.mathematics || 0);
        const missing = Math.max(0, questions - existing);
        if (!missing) return;
        target.questions += missing;
        target.correct += Math.max(0, correct - Number(target.correct || 0));
        target.minutes += missing;
        target.subjects.mathematics = existing + missing;
        state.studyMinutes += missing;
        changed = true;
      });

      let saved = JSON.parse(localStorage.getItem(`studyCoinSubjectLearningV2:${userId}`) || "null");
      if (!Object.keys(saved?.subjects || {}).length && userId !== "guest") {
        saved = JSON.parse(localStorage.getItem("studyCoinSubjectLearningV2:guest") || "null");
      }
      Object.entries(saved?.subjects || {}).forEach(([subjectId, subject]) => {
        if (subjectId === "mathematics") return;
        const questions = Array.isArray(subject?.questionHistory) ? subject.questionHistory.length : 0;
        if (!questions) return;
        const existing = Object.values(state.activities || {}).reduce(
          (sum, activity) => sum + Number(activity?.subjects?.[subjectId] || 0),
          0,
        );
        const missing = Math.max(0, questions - existing);
        if (!missing) return;
        const updatedAt = new Date(subject.lastUpdatedAt || Date.now());
        const key = Number.isNaN(updatedAt.getTime()) ? dateKey() : dateKey(updatedAt);
        const activity = getActivity(state, key);
        activity.subjects ||= {};
        activity.questions += missing;
        activity.minutes += missing;
        activity.subjects[subjectId] = (activity.subjects[subjectId] || 0) + missing;
        state.studyMinutes += missing;
        changed = true;
      });
    } catch (_) { /* Keep only records that can be read safely. */ }
    if (changed) saveState(state);
    return state;
  }
  function getState() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey()) || "null");
      if (stored?.version === SOCIAL_VERSION && Array.isArray(stored.aiFriends)) {
        const restored = restoreSubjectTotals(stored);
        if (hasRecordedActivity(restored)) return restored;
        const recovered = recoverStateFromExistingLearning();
        if (recovered) {
          saveState(recovered);
          return restoreSubjectTotals(recovered);
        }
        return restored;
      }
    } catch (_) { /* Start clean on invalid local data. */ }
    const state = recoverStateFromExistingLearning() || defaultState();
    saveState(state);
    return restoreSubjectTotals(state);
  }
  function saveState(state) { localStorage.setItem(storageKey(), JSON.stringify(state)); }
  function userName() {
    try {
      const users = JSON.parse(localStorage.getItem("studyCoinAuth") || "{}");
      return users[currentUserId()]?.name || "학생";
    } catch (_) { return "학생"; }
  }
  function dailyQuestionTarget() {
    try {
      const users = JSON.parse(localStorage.getItem("studyCoinAuth") || "{}");
      const grade = String(users[currentUserId()]?.learningSettings?.grade || "");
      if (grade.includes("\uACE0\uB4F1")) return 30;
      if (grade.includes("\uC911\uB4F1")) return 20;
      if (grade.includes("\uCD08\uB4F1")) return 10;
    } catch (_) { /* Use the middle-school default. */ }
    return 20;
  }
  function getActivity(state, key = dateKey()) {
    state.activities[key] ||= { questions: 0, correct: 0, minutes: 0, roomMinutes: 0, points: 0, missions: 0, subjects: {}, subjectMinutes: {} };
    state.activities[key].subjects ||= {};
    state.activities[key].subjectMinutes ||= {};
    return state.activities[key];
  }
  function isActiveStudyDay(activity) {
    return !!activity && ((activity.questions || 0) > 0 || (activity.minutes || 0) > 0 || (activity.roomMinutes || 0) > 0);
  }
  function currentStudyStreak(state) {
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = dateKey(cursor);
      if (!isActiveStudyDay(state.activities?.[key])) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  function missionValues(state) {
    const today = getActivity(state);
    const goal = state.planGoal || defaultState().planGoal;
    const goalMission = state.missions.find((mission) => mission.id === "math");
    if (goalMission) {
      goalMission.title = goal.title;
      goalMission.target = goal.target;
      goalMission.subject = goal.subject;
      goalMission.type = "subjectQuestions";
      goalMission.value = goal.metric === "minutes"
        ? (goal.subject ? (today.subjectMinutes?.[goal.subject] || 0) : today.minutes)
        : (goal.subject ? (today.subjects?.[goal.subject] || 0) : today.questions);
    }
    state.missions.forEach((mission) => {
      if (mission.type === "subjectQuestions") return;
      if (mission.type === "questions") mission.value = today.questions;
      if (mission.type === "roomMinutes") mission.value = Math.min(today.roomMinutes || 0, mission.target);
      if (mission.type === "avatar") mission.value = state.avatarChanged ? 1 : 0;
    });
  }
  function refresh() {
    const state = getState();
    missionValues(state);
    saveState(state);
    renderMissions(state);
    renderRooms(state);
    renderRanking(state);
    renderFriends(state);
    renderRecords(state);
    renderProfileSummary(state);
    renderPlanGoal(state);
    document.dispatchEvent(new CustomEvent("study:social-updated", { detail: { state } }));
  }
  function addPoints(amount, reason = "?숈뒿") {
    const state = getState();
    const value = Math.max(0, Number(amount) || 0);
    state.points += value;
    const today = getActivity(state);
    today.points += value;
    today.lastReason = reason;
    saveState(state);
    refresh();
  }
  function recordLearning(detail = {}) {
    const state = getState();
    const today = getActivity(state);
    today.questions += 1;
    const subjectId = detail.subject || "mathematics";
    const learningMinutes = Math.max(1, Number(detail.minutes) || 1);
    today.subjects ||= {};
    today.subjects[subjectId] = (today.subjects[subjectId] || 0) + 1;
    today.subjectMinutes ||= {};
    today.subjectMinutes[subjectId] = (today.subjectMinutes[subjectId] || 0) + learningMinutes;
    if (detail.correct) today.correct += 1;
    state.points += detail.correct ? 10 : 2;
    today.points += detail.correct ? 10 : 2;
    state.studyMinutes += learningMinutes;
    today.minutes += learningMinutes;
    state.aiFriends.slice(0, 3).forEach((friend, index) => {
      friend.points += detail.correct ? 3 + index : 1;
      friend.level = levelFromPoints(friend.points);
      friend.studyMinutes += learningMinutes;
    });
    saveState(state);
    refresh();
  }
  function selectRoom(roomId) {
    const state = getState();
    const room = state.rooms.find((item) => item.id === roomId);
    if (!room) return;
    state.joinedRoomId = room.id;
    state.roomStartedAt ||= Date.now();
    room.joinedAt = new Date().toISOString();
    saveState(state);
    refresh();
  }
  function updateRoomTime() {
    const state = getState();
    if (!state.joinedRoomId || !state.roomStartedAt) return;
    const elapsedWholeMinutes = Math.floor((Date.now() - state.roomStartedAt) / 60000);
    if (elapsedWholeMinutes <= 0) return;
    state.roomStartedAt += elapsedWholeMinutes * 60000;
    state.roomMinutes += elapsedWholeMinutes;
    const today = getActivity(state);
    today.roomMinutes += elapsedWholeMinutes;
    today.minutes += elapsedWholeMinutes;
    state.points += elapsedWholeMinutes * 3;
    today.points += elapsedWholeMinutes * 3;
    const room = state.rooms.find((item) => item.id === state.joinedRoomId);
    room?.aiMembers.forEach((id, index) => {
      const friend = state.aiFriends.find((item) => item.id === id);
      if (friend) {
        friend.studyMinutes += elapsedWholeMinutes + index;
        friend.points += elapsedWholeMinutes * 2;
        friend.level = levelFromPoints(friend.points);
      }
    });
    saveState(state);
    refresh();
  }
  function setPlanGoal(goalId, title, target = 10, metric = "questions") {
    const state = getState();
    state.planGoal = {
      id: goalId,
      title,
      subject: goalId === "custom" ? null : goalId,
      target: Math.min(300, Math.max(1, Number(target) || 1)),
      metric: metric === "minutes" ? "minutes" : "questions",
      repeat: "daily",
    };
    saveState(state);
    refresh();
  }
  function renderPlanGoal(state) {
    const goal = state.planGoal || defaultState().planGoal;
    const metric = goal.metric || "questions";
    document.querySelectorAll("[data-plan-goal]").forEach((button) => {
      button.classList.toggle("on", button.dataset.planGoal === goal.id);
    });
    const metricSelect = document.querySelector("#planGoalMetric");
    const targetInput = document.querySelector("#planGoalTarget");
    const unit = document.querySelector("#planGoalUnit");
    const customField = document.querySelector("#planCustomTitleField");
    const customInput = document.querySelector("#planCustomTitle");
    if (metricSelect) metricSelect.value = metric;
    if (targetInput) targetInput.value = String(goal.target || 10);
    if (unit) unit.textContent = metric === "minutes" ? "분" : "문제";
    customField?.classList.toggle("hidden", goal.id !== "custom");
    if (customInput && goal.id === "custom") customInput.value = goal.title || "";
    const dailyText = document.querySelector("#studyDailyGoalText");
    if (dailyText) dailyText.textContent = `${goal.title} · 매일 ${goal.target}${metric === "minutes" ? "분" : "문제"}`;
  }
  function createRoom(payload) {
    const state = getState();
    const level = levelFromPoints(state.points);
    const candidates = state.aiFriends.filter((friend) => Math.abs(friend.level - level) <= 2).slice(0, 2);
    const room = {
      id: `user-room-${Date.now()}`,
      name: payload.name,
      description: payload.description || "?④퍡 吏묒쨷?댁꽌 怨듬??댁슂.",
      subject: payload.subject || "수학",
      level: payload.level || `Lv.${level}`,
      createdBy: currentUserId(),
      aiMembers: candidates.map((friend) => friend.id),
      joinedAt: new Date().toISOString(),
    };
    state.rooms.unshift(room);
    state.joinedRoomId = room.id;
    state.roomStartedAt = Date.now();
    saveState(state);
    refresh();
    return room;
  }
  function renderMissions(state) {
    const todayQuestions = Number(getActivity(state).questions || 0);
    const missionProgress = Math.min(100, Math.round((todayQuestions / dailyQuestionTarget()) * 100));
    const homeProgressText = document.getElementById("homeDailyProgressText");
    const homeProgressBar = document.getElementById("homeDailyProgressBar");
    if (homeProgressText) homeProgressText.textContent = `${missionProgress}%`;
    if (homeProgressBar) homeProgressBar.style.width = `${missionProgress}%`;

    document.querySelectorAll(".missions").forEach((list) => {
      list.innerHTML = state.missions.map((mission) => {
        const done = mission.value >= mission.target;
        const progress = mission.type === "avatar" ? (done ? "완료" : "아바타 꾸미기") : `${Math.min(mission.value, mission.target)} / ${mission.target}`;
        return `<li class="${done ? "is-complete" : ""}"><b>${done ? "✓" : "•"}</b>${mission.title}<span>${progress}</span></li>`;
      }).join("");
    });
  }  function roomCard(room, state, compact = false) {
    const members = room.aiMembers.map((id) => state.aiFriends.find((item) => item.id === id)).filter(Boolean);
    const img = members[0]?.avatar || avatars[0];
    const action = room.id === state.joinedRoomId ? "입장 중" : "입장하기";
    return `<article class="social-room-card" data-room-id="${room.id}"><img src="${img}" alt="" /><div><h3>${room.name}</h3><p>#${room.subject} · ${room.level}</p>${compact ? "" : `<em>${room.description}</em>`}<small>멤버 ${members.map((item) => item.name.replace(" AI", "")).join(", ")} · 학습 시간 확인</small></div><span><b>${members.length + 1}명</b><button type="button" data-room-enter="${room.id}">${action}</button></span></article>`;
  }  function renderRooms(state) {
    const rooms = state.rooms || [];
    const active = rooms.find((room) => room.id === state.joinedRoomId) || rooms[0];
    document.querySelectorAll(".social-room-list").forEach((list) => {
      const compact = list.dataset.compact === "true";
      list.innerHTML = rooms.map((room) => roomCard(room, state, compact)).join("");
    });
    const detail = document.querySelector('[data-screen="study-room-detail"]');
    if (!detail || !active) return;
    const members = active.aiMembers.map((id) => state.aiFriends.find((item) => item.id === id)).filter(Boolean);
    detail.querySelectorAll("[data-room-name]").forEach((item) => { item.textContent = active.name; });
    detail.querySelectorAll("[data-room-subject]").forEach((item) => { item.textContent = active.subject; });
    const memberGrid = detail.querySelector(".room-member-grid");
    if (memberGrid) {
      const allMembers = [{ id: "me", name: userName(), avatar: document.querySelector("[data-profile-avatar]")?.getAttribute("src") || avatars[0], studyMinutes: state.roomMinutes, studying: true }, ...members.map((item) => ({ ...item, studying: true }))];
      memberGrid.innerHTML = allMembers.map((member) => `<article><img src="${member.avatar}" alt="" /><b>${member.name.replace(" AI", "")}</b><span>${member.studying ? "공부 중" : "자리 비움"}</span><small>${formatMinutes(member.studyMinutes || 0)} 공부</small></article>`).join("");
      let reactionTray = detail.querySelector(".room-reaction-tray");
      if (!reactionTray) {
        reactionTray = document.createElement("section");
        reactionTray.className = "room-reaction-tray";
        memberGrid.after(reactionTray);
      }
      const reaction = state.roomReaction;
      const reactionVisual = reaction?.icon
        ? `<img class="room-reaction-status-icon" src="${reaction.icon}" alt="" />`
        : (reaction?.emoji || "");
      const reactionStatus = reaction?.roomId === active.id
        ? `<p class="room-reaction-status" aria-live="polite"><b>${reaction.name}</b>님이 ${reactionVisual} ${reaction.label} 기분을 보냈어요</p>`
        : '<p class="room-reaction-status">채팅 없이 이모티콘으로만 기분을 전해요.</p>';
      const emotions = [
        ["assets/reaction-happy.png", "좋음", "happy"], ["assets/reaction-calm.png", "편안", "calm"], ["assets/reaction-sleepy.png", "졸림", "sleepy"],
        ["assets/reaction-bored.png", "지루", "bored"], ["assets/reaction-angry.png", "화남", "angry"], ["assets/reaction-sad.png", "슬픔", "sad"],
      ];
      reactionTray.innerHTML = `<div><h3>이모티콘으로 기분 보내기</h3>${reactionStatus}</div><div class="room-reaction-buttons">${emotions.map(([icon, label, sound]) => `<button type="button" data-room-reaction="${sound}" data-room-reaction-icon="${icon}" data-room-reaction-label="${label}" aria-label="${label} 기분 보내기"><img src="${icon}" alt="" />${label}</button>`).join("")}</div>`;
    }
    detail.querySelectorAll("[data-room-time]").forEach((element) => { element.textContent = `함께 공부 ${formatMinutes(state.roomMinutes)}`; });
  }  function rankingRows(state) {
    const me = { id: "me", name: userName(), avatar: document.querySelector("[data-profile-avatar]")?.getAttribute("src") || avatars[0], points: state.points, level: levelFromPoints(state.points) };
    const groupStart = Math.max(1, Math.floor((me.level - 1) / 5) * 5 + 1);
    const peers = state.aiFriends.filter((friend) => friend.level >= groupStart && friend.level < groupStart + 5);
    return [...peers, me].sort((a, b) => b.points - a.points).slice(0, 10);
  }
  function renderRanking(state) {
    const rows = rankingRows(state);
    document.querySelectorAll(".ranking-list").forEach((list) => {
      list.innerHTML = rows.map((friend, index) => `<article class="${friend.id === "me" ? "me" : ""}"><b>${index + 1}</b><img src="${friend.avatar}" alt="" /><span>${friend.id === "me" ? "나" : friend.name.replace(" AI", "")}</span><em>${friend.points.toLocaleString()} 코인</em></article>`).join("");
    });
  }  function renderFriends(state) {
    const friends = state.aiFriends.slice(0, 12);
    document.querySelectorAll(".friend-list").forEach((list) => {
      list.innerHTML = friends.map((friend) => `<article><img src="${friend.avatar}" alt="" /><div><b>${friend.name.replace(" AI", "")}</b><span>Lv.${friend.level} · ${friend.points.toLocaleString()} 코인</span></div><em>공부 중</em></article>`).join("");
    });
  }
  function renderRecords(state) {
    const recordScreen = document.querySelector('[data-screen="result"]');
    if (!recordScreen) return;
    const tabs = recordScreen.querySelectorAll(".growth-period-tabs button");
    const active = recordScreen.querySelector(".growth-period-tabs .on")?.dataset.period || "weekly";
    const days = active === "daily" ? 1 : active === "weekly" ? 7 : 30;
    const now = new Date();
    let questions = 0;
    let minutes = 0;
    let activeDays = 0;
    const subjectTotals = { mathematics: 0, english: 0, reading: 0, science: 0, hanja: 0 };
    for (let index = 0; index < days; index += 1) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - index);
      const item = state.activities[dateKey(date)] || {};
      questions += Number(item.questions || 0);
      minutes += Number(item.minutes || 0) + Number(item.roomMinutes || 0);
      if (isActiveStudyDay(item)) activeDays += 1;
    }
    const todayActivity = state.activities[dateKey(now)] || {};
    const todaySubjectMinutes = Object.keys(todayActivity.subjectMinutes || {}).length
      ? todayActivity.subjectMinutes
      : (todayActivity.subjects || {});
    Object.entries(todaySubjectMinutes).forEach(([subjectId, value]) => {
      subjectTotals[subjectId] = (subjectTotals[subjectId] || 0) + Number(value || 0);
    });
    const dailyQuestionGoal = 10;
    const rate = active === "daily"
      ? Math.min(100, Math.round((questions / dailyQuestionGoal) * 100))
      : (days ? Math.round((activeDays / days) * 100) : 0);
    const title = active === "daily" ? "오늘 집중도" : active === "weekly" ? "이번 주 집중도" : "이번 달 집중도";
    const focus = recordScreen.querySelector(".focus-card");
    if (focus) {
      const heading = focus.querySelector("h2");
      const strong = focus.querySelector("strong");
      if (heading) heading.textContent = title;
      if (strong) strong.textContent = `${rate}%`;
      let standard = focus.querySelector(".focus-standard");
      if (!standard) {
        standard = document.createElement("small");
        standard.className = "focus-standard";
        strong?.after(standard);
      }
      if (standard) {
        standard.textContent = active === "daily"
          ? `오늘 ${questions} / ${dailyQuestionGoal}문제 · 10문제 완료 시 100%`
          : active === "weekly"
            ? "최근 7일 중 학습한 날짜 비율"
            : "최근 30일 중 학습한 날짜 비율";
      }
    }
    const graphValues = [];
    const graphLabels = [];
    const pointCount = 7;
    for (let index = 0; index < pointCount; index += 1) {
      const offset = pointCount - 1 - index;
      let bucketDays = 1;
      let bucketEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
      if (active === "weekly") {
        bucketDays = 7;
        bucketEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (offset * 7));
        graphLabels.push(index === pointCount - 1 ? "이번주" : `${offset}주`);
      } else if (active === "monthly") {
        bucketEnd = offset === 0
          ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
          : new Date(now.getFullYear(), now.getMonth() - offset + 1, 0);
        bucketDays = offset === 0
          ? now.getDate()
          : new Date(bucketEnd.getFullYear(), bucketEnd.getMonth() + 1, 0).getDate();
        graphLabels.push(`${bucketEnd.getMonth() + 1}월`);
      } else {
        graphLabels.push(["일", "월", "화", "수", "목", "금", "토"][bucketEnd.getDay()]);
      }
      let bucketScore = 0;
      for (let day = 0; day < bucketDays; day += 1) {
        const date = new Date(bucketEnd.getFullYear(), bucketEnd.getMonth(), bucketEnd.getDate() - day);
        const item = state.activities[dateKey(date)] || {};
        bucketScore += active === "daily"
          ? Math.min(100, (item.questions || 0) * 10)
          : ((item.questions || 0) * 10) + (((item.minutes || 0) + (item.roomMinutes || 0)) * 2);
      }
      graphValues.push(Math.min(100, Math.round(bucketScore / bucketDays)));
    }
    const graph = recordScreen.querySelector(".focus-card svg");
    if (graph) {
      const coords = graphValues.map((value, index) => ({ x: 24 + index * (232 / 6), y: 132 - value }));
      const line = coords.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
      const linePath = graph.querySelector("path.line");
      const areaPath = graph.querySelector("path.area");
      if (linePath) linePath.setAttribute("d", line);
      if (areaPath) areaPath.setAttribute("d", `${line} L256 132 L24 132 Z`);
      graph.querySelectorAll("text").forEach((label, index) => {
        if (index >= 2 && graphLabels[index - 2]) label.textContent = graphLabels[index - 2];
      });
    }
    const metrics = recordScreen.querySelectorAll(".growth-metrics article strong");
    if (metrics[0]) metrics[0].textContent = formatMinutes(minutes);
    if (metrics[1]) metrics[1].textContent = `${activeDays}일`;
    const subjectKeys = { "수학": "mathematics", "영어": "english", "국어": "reading", "독서": "reading", "과학": "science", "한자": "hanja" };
    const subjectHeading = recordScreen.querySelector(".subject-time .section-row h2");
    if (subjectHeading) subjectHeading.textContent = "오늘 과목별 학습 시간";
    const maxSubject = Math.max(1, ...Object.values(subjectTotals));
    recordScreen.querySelectorAll(".subject-time article").forEach((article) => {
      const key = subjectKeys[article.querySelector("b")?.textContent.trim()] || "mathematics";
      const value = subjectTotals[key] || 0;
      const label = article.querySelector("span");
      const bar = article.querySelector("em");
      if (label) label.textContent = formatMinutes(value);
      if (bar) bar.style.width = `${Math.round((value / maxSubject) * 100)}%`;
    });
    tabs.forEach((button) => {
      button.onclick = () => {
        tabs.forEach((tab) => tab.classList.remove("on"));
        button.classList.add("on");
        renderRecords(state);
      };
    });
  }  function renderProfileSummary(state) {
    const level = levelFromPoints(state.points);
    const streak = currentStudyStreak(state);
    const currentExp = state.points % 300;

    document.querySelectorAll(".profile-badges span:first-child").forEach((element) => { element.textContent = `Lv. ${level}`; });
    document.querySelectorAll(".profile-badges span:nth-child(2)").forEach((element) => {
      element.textContent = streak > 0 ? `🔥 ${streak}일 연속` : "0일 연속";
    });
    document.querySelectorAll(".menu-level-card h2").forEach((element) => { element.textContent = `레벨 ${level}`; });
    document.querySelectorAll(".menu-level-card span").forEach((element) => { element.textContent = `EXP ${currentExp.toLocaleString()} / 300`; });
    document.querySelectorAll(".menu-exp-bar em").forEach((element) => { element.style.width = `${Math.max(4, Math.round((currentExp / 300) * 100))}%`; });

    document.querySelectorAll(".profile-side-card dd, .menu-activity-summary dd").forEach((element) => {
      const label = element.previousElementSibling?.textContent || "";
      if (label.includes("시간")) element.textContent = formatMinutes(state.studyMinutes);
      if (label.includes("코인")) element.textContent = state.points.toLocaleString();
      if (label.includes("미션")) element.textContent = `${state.missions.filter((mission) => (mission.value || 0) >= (mission.target || 1)).length}개`;
      if (label.includes("연속")) element.textContent = `${streak}일`;
    });

    const unlockLevels = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    document.querySelectorAll("#profileChangePicker [data-avatar]").forEach((button, index) => {
      const required = Number(button.dataset.unlockLevel || unlockLevels[index] || 55);
      const unlocked = level >= required;
      button.dataset.unlockLevel = String(required);
      button.toggleAttribute("data-locked-avatar", !unlocked);
      button.setAttribute("aria-disabled", String(!unlocked));
      button.disabled = !unlocked;
      button.classList.toggle("is-locked", !unlocked);
      if (!unlocked) button.title = `Lv.${required}에서 열려요`;
      else button.removeAttribute("title");
    });
  }  function playCuteReaction(kind) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const voice = new SpeechSynthesisUtterance("에잇!");
      voice.lang = "ko-KR";
      voice.rate = 1.65;
      voice.pitch = 1.7;
      voice.volume = 0.65;
      window.speechSynthesis.speak(voice);
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const patterns = {
      happy: [[640, 0], [880, 0.09]], calm: [[520, 0], [760, 0.12]], sleepy: [[280, 0], [235, 0.14]],
      bored: [[360, 0], [300, 0.12]], angry: [[260, 0], [190, 0.09]], sad: [[480, 0], [340, 0.15]],
    };
    (patterns[kind] || patterns.happy).forEach(([frequency, offset]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "angry" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + offset);
      gain.gain.setValueAtTime(0.0001, context.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + offset + 0.16);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(context.currentTime + offset);
      oscillator.stop(context.currentTime + offset + 0.18);
    });
    const inflate = context.createOscillator();
    const inflateGain = context.createGain();
    inflate.type = "sine";
    inflate.frequency.setValueAtTime(300, context.currentTime + 0.18);
    inflate.frequency.exponentialRampToValueAtTime(760, context.currentTime + 0.7);
    inflateGain.gain.setValueAtTime(0.0001, context.currentTime + 0.18);
    inflateGain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.28);
    inflateGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.72);
    inflate.connect(inflateGain).connect(context.destination);
    inflate.start(context.currentTime + 0.18);
    inflate.stop(context.currentTime + 0.74);

    const popAt = context.currentTime + 0.94;
    const popBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.07), context.sampleRate);
    const popData = popBuffer.getChannelData(0);
    for (let index = 0; index < popData.length; index += 1) popData[index] = (Math.random() * 2 - 1) * (1 - index / popData.length);
    const pop = context.createBufferSource();
    const popGain = context.createGain();
    pop.buffer = popBuffer;
    popGain.gain.setValueAtTime(0.22, popAt);
    popGain.gain.exponentialRampToValueAtTime(0.0001, popAt + 0.08);
    pop.connect(popGain).connect(context.destination);
    pop.start(popAt);

    const squeak = context.createOscillator();
    const squeakGain = context.createGain();
    squeak.type = "triangle";
    squeak.frequency.setValueAtTime(260, popAt);
    squeak.frequency.exponentialRampToValueAtTime(90, popAt + 0.09);
    squeakGain.gain.setValueAtTime(0.13, popAt);
    squeakGain.gain.exponentialRampToValueAtTime(0.0001, popAt + 0.1);
    squeak.connect(squeakGain).connect(context.destination);
    squeak.start(popAt);
    squeak.stop(popAt + 0.11);
    setTimeout(() => context.close(), 1500);
  }
  function animateRoomReaction(button) {
    document.querySelector(".room-reaction-bubble")?.remove();
    const bubble = document.createElement("div");
    bubble.className = "room-reaction-bubble";
    bubble.setAttribute("aria-hidden", "true");
    bubble.innerHTML = `<img src="${button.dataset.roomReactionIcon}" alt="" /><i></i>`;
    document.body.appendChild(bubble);

    const buttonRect = button.getBoundingClientRect();
    const activeScreen = document.querySelector('.phone[data-screen="study-room-detail"].active') || document.querySelector('.phone.active');
    const screenRect = activeScreen?.getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;
    const endX = screenRect ? screenRect.left + screenRect.width / 2 : window.innerWidth / 2;
    const endY = screenRect ? screenRect.top + Math.min(screenRect.height * 0.46, 390) : window.innerHeight * 0.45;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    bubble.style.setProperty("--reaction-start-x", `${startX}px`);
    bubble.style.setProperty("--reaction-start-y", `${startY}px`);
    bubble.style.setProperty("--reaction-end-x", `${endX}px`);
    bubble.style.setProperty("--reaction-end-y", `${endY}px`);
    if (reduceMotion) bubble.classList.add("is-reduced");
    requestAnimationFrame(() => bubble.classList.add("is-active"));
    setTimeout(() => bubble.classList.add("is-popping"), reduceMotion ? 300 : 930);
    bubble.addEventListener("animationend", (event) => {
      if (event.animationName === "room-reaction-balloon") bubble.remove();
    });
    setTimeout(() => bubble.remove(), reduceMotion ? 700 : 1500);
  }
  function sendRoomReaction(button) {
    playCuteReaction(button.dataset.roomReaction);
    animateRoomReaction(button);
    const state = getState();
    const roomId = state.joinedRoomId || state.rooms?.[0]?.id;
    if (!roomId) return;
    state.roomReaction = {
      roomId,
      name: userName(),
      icon: button.dataset.roomReactionIcon,
      label: button.dataset.roomReactionLabel,
      at: new Date().toISOString(),
    };
    saveState(state);
    refresh();
  }
  document.addEventListener("click", (event) => {
    const enter = event.target.closest("[data-room-enter]");
    if (enter) { selectRoom(enter.dataset.roomEnter); openScreen("study-room-detail"); }
    const reaction = event.target.closest("[data-room-reaction]");
    if (reaction) sendRoomReaction(reaction);
    const planGoal = event.target.closest("[data-plan-goal]");
    if (planGoal) {
      document.querySelectorAll("[data-plan-goal]").forEach((button) => button.classList.toggle("on", button === planGoal));
      localStorage.setItem("studyCoinPendingPlanGoal", JSON.stringify({ id: planGoal.dataset.planGoal, title: planGoal.textContent.trim() }));
      document.querySelector("#planCustomTitleField")?.classList.toggle("hidden", planGoal.dataset.planGoal !== "custom");
    }
    const metricSelect = event.target.closest("#planGoalMetric");
    if (metricSelect) {
      const unit = document.querySelector("#planGoalUnit");
      if (unit) unit.textContent = metricSelect.value === "minutes" ? "분" : "문제";
    }
    const applyPlan = event.target.closest(".plan-next");
    if (applyPlan) {
      const state = getState();
      const pending = JSON.parse(localStorage.getItem("studyCoinPendingPlanGoal") || "null") || {
        id: state.planGoal?.id || "mathematics",
        title: state.planGoal?.title || "수학 학습",
      };
      const metric = document.querySelector("#planGoalMetric")?.value || "questions";
      const target = document.querySelector("#planGoalTarget")?.value || 10;
      const customTitle = document.querySelector("#planCustomTitle")?.value.trim();
      const title = pending.id === "custom" ? (customTitle || "직접 설정 목표") : pending.title.replace(/\s*변경\s*$/, "");
      setPlanGoal(pending.id, title, target, metric);
      localStorage.removeItem("studyCoinPendingPlanGoal");
      openScreen("home");
    }
  });
  document.addEventListener("study:learning-answer", (event) => recordLearning(event.detail));
  document.addEventListener("change", (event) => {
    if (event.target.id !== "planGoalMetric") return;
    const unit = document.querySelector("#planGoalUnit");
    if (unit) unit.textContent = event.target.value === "minutes" ? "분" : "문제";
  });
  document.addEventListener("study:avatar-changed", () => { const state = getState(); state.avatarChanged = true; saveState(state); refresh(); });
  window.addEventListener("study:user-changed", refresh);
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey()) refresh();
  });
  setInterval(updateRoomTime, 30000);
  window.STUDY_SOCIAL = { getState, refresh, addPoints, recordLearning, selectRoom, createRoom, formatMinutes, levelFromPoints, setPlanGoal };
  document.addEventListener("DOMContentLoaded", refresh);
})();
