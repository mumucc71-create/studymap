(function () {
  const content = window.STUDY_SUBJECT_CONTENT;
  if (!content) return;

  const screenName = "subject-learning";
  const storageVersion = 2;
  const $ = (selector) => document.querySelector(selector);
  const main = $("#subjectLearningMain");
  const actions = $("#subjectLearningActions");
  let activeSubject = null;

  const authoredEnglishCycles = [1, 2, 3, 4, 5]
    .flatMap((level) => window[`STUDY_ENGLISH_LEVEL${level}_CONTENT`]?.cycles || []);
  const legacyEnglishCoreRoadmap = [
    { title: "Be동사", courseIds: ["EN-L04-C01"], mode: "course" },
    { title: "일반동사", courseIds: ["EN-L04-C04", "EN-L04-C05"], mode: "course" },
    { title: "형용사와 부사", courseIds: ["EN-L05-C10", "EN-L05-C12"], mode: "course" },
    { title: "전치사", courseIds: ["EN-L04-C12"], mode: "course" },
    { title: "의문문과 부정문", courseIds: ["EN-L04-C02", "EN-L04-C03", "EN-L04-C06", "EN-L04-C07"], mode: "course" },
    { title: "기본 문법 테스트", courseIds: ["EN-L04-C15"], mode: "checkpoint", reward: true },
    { title: "독해 연습", courseIds: ["EN-L05-C13"], mode: "reading" },
    { title: "영작 연습", courseIds: ["EN-L05-C13"], mode: "writing" },
    { title: "AI 회화 연습", courseIds: ["EN-L05-C13"], mode: "ai" },
  ];
  const englishCoreRoadmap = authoredEnglishCycles.length
    ? authoredEnglishCycles.map((cycle) => ({ title: cycle.title, courseIds: [cycle.cycleId], mode: "practice" }))
    : legacyEnglishCoreRoadmap;

  const hanjaCardVisuals = {
    "大": "🧍", "小": "🤏", "人": "🚶", "山": "⛰️", "水": "💧",
    "學": "📖", "校": "🏫", "父": "👨", "母": "👩", "友": "🫶",
    "日": "☀️", "月": "🌙", "木": "🌳", "火": "🔥", "金": "🪙",
    "東": "🌅", "西": "🌇", "南": "⬇️", "北": "⬆️", "中": "🎯",
    "國": "🏯", "民": "👥", "生": "🌱", "經": "🧵", "濟": "🌉",
    "歷": "📜", "史": "🏛️", "科": "🔬", "哲": "💡", "證": "📄",
    "識": "🧠", "究": "🔎", "論": "💬", "鑑": "🪞", "衡": "⚖️",
    "蘊": "📚", "躍": "🏃", "顯": "✨",
  };

  const englishWordVisuals = {
    analyze: "🔍", significant: "⭐", indicate: "👉", derive: "🧩", evidence: "🔎",
    suggest: "💡", verify: "✅", therefore: "➡️", although: "↔️", effective: "🎯",
    surface: "🏞️", surrounding: "🌐", interval: "⏱️", interpret: "🧠", conclusion: "🏁",
    abandoned: "🏚️", ordinary: "☕", beneath: "⬇️", curiosity: "❓", mysterious: "✨",
    lecture: "🎓", sequence: "🔢", contrast: "◐", emphasize: "❗", summarize: "📝",
    claim: "💬", support: "🤝", perspective: "👓", respond: "↩️", coherent: "🔗",
  };

  const scienceStageVisuals = {
    matter: {
      description: "고체 · 액체 · 기체가 어떻게 달라지는지 그림으로 살펴봐요.",
      items: [["🧊", "고체"], ["🥛", "액체"], ["☁️", "기체"]],
    },
    ecosystem: {
      description: "생산자 · 소비자 · 분해자가 어떻게 연결되는지 그림으로 살펴봐요.",
      items: [["🌱", "생산자"], ["🐇", "소비자"], ["🍄", "분해자"]],
    },
    physics: {
      description: "힘, 운동, 에너지와 파동의 관계를 관찰하고 설명해요.",
      items: [["⚙️", "힘·운동"], ["⚡", "에너지"], ["🌊", "파동"]],
    },
    chemistry: {
      description: "물질의 구조와 성질, 변화를 실험과 자료로 이해해요.",
      items: [["⚛️", "물질"], ["🧪", "변화"], ["📊", "성질"]],
    },
    life: {
      description: "생명체의 구조와 기능, 환경과의 관계를 살펴봐요.",
      items: [["🔬", "생물"], ["🌱", "생명"], ["🧬", "유전·환경"]],
    },
    earth: {
      description: "지구, 대기와 바다, 우주의 변화를 자료로 탐구해요.",
      items: [["🌍", "지구"], ["🌦️", "대기·해양"], ["🌌", "우주"]],
    },
    inquiry: {
      description: "관찰과 실험, 자료 분석으로 과학적 결론을 만들어요.",
      items: [["🔎", "관찰"], ["🧪", "실험"], ["📊", "자료"]],
    },
    environment: {
      description: "생태와 기후의 변화를 이해하고 지속가능한 해결책을 찾아요.",
      items: [["🌿", "생태"], ["🌡️", "기후"], ["♻️", "지속가능"]],
    },
  };

  const scienceCardVisuals = {
    "물질의 세 가지 상태": [["🧊", "고체"], ["🥛", "액체"], ["☁️", "기체"]],
    "상태 변화의 이름": [["🧊", "융해"], ["💧", "기화"], ["☁️", "액화"]],
    "입자의 움직임": [["🔵", "촘촘"], ["🔵↔️🔵", "이동"], ["🔵　🔵", "퍼짐"]],
    "공정한 실험": [["🧪", "같은 조건"], ["☀️", "한 조건"], ["📋", "비교"]],
    "고체의 특징": [["📘", "책"], ["🪨", "돌"], ["⬛", "모양 유지"]],
    "액체의 특징": [["🥛", "컵"], ["➡️", "옮기기"], ["🍶", "그릇 모양"]],
    "기체의 특징": [["💉", "주사기"], ["💨", "공기"], ["↘️", "압축"]],
    "증발": [["👕", "젖은 빨래"], ["☀️", "햇빛"], ["💨", "마름"]],
    "끓음": [["🔥", "가열"], ["🫧", "기포"], ["♨️", "수증기"]],
    "응결": [["🥤", "찬 컵"], ["❄️", "냉각"], ["💧", "물방울"]],
    "승화": [["🧊", "드라이아이스"], ["➡️", "바로 변화"], ["🌫️", "기체"]],
    "열과 상태 변화": [["🔥", "열 얻기"], ["🧊", "얼음"], ["💧", "물"]],
    "상태 변화 중 온도": [["🧊", "녹는 중"], ["🌡️", "온도 일정"], ["💧", "물"]],
    "질량은 보존돼요": [["⚖️", "처음"], ["🔒", "닫힌 병"], ["⚖️", "같은 질량"]],
    "부피는 달라질 수 있어요": [["💧", "작은 부피"], ["➡️", "기체 변화"], ["🎈", "큰 부피"]],
    "물의 특별한 성질": [["🧊", "얼음"], ["⬆️", "뜸"], ["🌊", "물"]],
    "확산": [["🌸", "향수"], ["💨", "퍼짐"], ["🏠", "방 전체"]],
    "온도와 확산": [["🥶", "찬물"], ["🎨", "색소"], ["♨️", "빠른 확산"]],
    "밀도": [["⚖️", "질량"], ["➗", "나누기"], ["📦", "부피"]],
    "뜨고 가라앉기": [["🪵", "가벼움"], ["🌊", "물"], ["🪨", "무거움"]],
    "압력과 기체": [["💉", "막힌 주사기"], ["👇", "누르기"], ["💨", "압력 증가"]],
    "기체의 온도와 부피": [["🎈", "풍선"], ["☀️", "따뜻함"], ["🔴", "부피 증가"]],
    "용해": [["🧂", "소금"], ["🥛", "물"], ["✨", "녹음"]],
    "용액의 구성": [["💧", "용매"], ["➕", "용질"], ["🥤", "용액"]],
    "관찰과 측정": [["👀", "관찰"], ["🌡️", "온도계"], ["📝", "기록"]],
    "생태계를 이루는 것": [["🐟", "생물"], ["💧", "물"], ["☀️", "햇빛"]],
    "생산자·소비자·분해자": [["🌱", "생산자"], ["🐇", "소비자"], ["🍄", "분해자"]],
    "먹이사슬과 먹이그물": [["🌿", "풀"], ["🐇", "토끼"], ["🦊", "여우"]],
    "생태계의 변화": [["🐇", "감소"], ["➡️", "영향"], ["🦊", "감소"]],
    "생물 요소": [["🌳", "식물"], ["🐾", "동물"], ["🦠", "미생물"]],
    "비생물 요소": [["☀️", "햇빛"], ["💧", "물"], ["🪨", "흙"]],
    "광합성": [["☀️", "빛"], ["🌿", "잎"], ["🍬", "양분"]],
    "에너지의 시작": [["☀️", "태양"], ["🌱", "식물"], ["🐸", "동물"]],
    "1차 소비자": [["🌿", "식물"], ["➡️", "먹기"], ["🐇", "1차 소비자"]],
    "상위 소비자": [["🐇", "먹이"], ["➡️", "포식"], ["🦊", "상위 소비자"]],
    "분해자의 중요성": [["🍂", "낙엽"], ["🍄", "분해"], ["🌱", "양분"]],
    "물질의 순환": [["🍂", "낙엽"], ["🌍", "흙"], ["🌿", "식물"]],
    "에너지의 이동": [["🌱", "많음"], ["🐇", "중간"], ["🦅", "적음"]],
    "개체": [["🐸", "한 마리"], ["1️⃣", "하나"], ["🌿", "한 개체"]],
    "개체군": [["🐟", "붕어"], ["🐟", "같은 종"], ["🐟", "한 무리"]],
    "군집": [["🐟", "붕어"], ["🐸", "개구리"], ["🌿", "수초"]],
    "서식지": [["🦀", "게"], ["🏖️", "갯벌"], ["🐚", "조개"]],
    "생태적 지위": [["🌸", "꽃"], ["🐝", "벌"], ["✨", "꽃가루받이"]],
    "경쟁": [["🌲", "나무"], ["☀️", "햇빛"], ["🌳", "경쟁"]],
    "공생": [["🌸", "꿀"], ["🤝", "도움"], ["🐝", "꽃가루받이"]],
    "포식과 피식": [["🦊", "포식자"], ["➡️", "사냥"], ["🐇", "피식자"]],
    "적응": [["🌵", "선인장"], ["☀️", "건조"], ["💧", "물 보존"]],
    "생물 다양성": [["🌳", "식물"], ["🦋", "곤충"], ["🐦", "동물"]],
    "외래종의 영향": [["🚢", "외래종"], ["📈", "급증"], ["🌿", "생태 영향"]],
    "환경오염과 생태계": [["🏭", "오염"], ["🌊", "물"], ["🐟", "생물 감소"]],
  };

  function scienceDiagram(title = "", stage = null) {
    const frame = (kind, body, caption) => `<figure class="science-diagram science-diagram-${kind}" role="img" aria-label="${escapeHtml(title)} 개념 그림">
      <svg viewBox="0 0 360 190" aria-hidden="true" focusable="false">${body}</svg>
      <figcaption>${escapeHtml(caption)}</figcaption>
    </figure>`;
    const dots = (points, color) => points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${color}"/>`).join("");
    const appliedQuestion = title.match(/문제 적용\s*(\d+)/);
    if (appliedQuestion && stage?.learningCards?.length) {
      const questionNumber = Math.max(1, Number(appliedQuestion[1])) - 1;
      const matterCardMap = [1, 2, 0, 7, 3, 4, 5, 9, 10, 8, 16, 17, 18, 19, 13, 15, 20, 23, 24, 12];
      const conceptIndex = stage.id === "matter" ? matterCardMap[questionNumber] : questionNumber;
      const conceptCard = stage.learningCards[conceptIndex];
      if (conceptCard && conceptCard.title !== title) return scienceDiagram(conceptCard.title, stage);
    }

    if (/세 가지 상태|고체의 특징|액체의 특징|기체의 특징/.test(title)) {
      return frame("particles", `
        <rect x="12" y="28" width="100" height="112" rx="14"/><rect x="130" y="28" width="100" height="112" rx="14"/><rect x="248" y="28" width="100" height="112" rx="14"/>
        ${dots([[34,64],[58,64],[82,64],[34,88],[58,88],[82,88],[34,112],[58,112],[82,112]], "#5f80d8")}
        ${dots([[150,108],[175,101],[200,111],[160,82],[190,78],[214,94],[145,124],[218,122]], "#38b887")}
        ${dots([[270,50],[322,65],[284,91],[330,118],[260,126],[306,101]], "#f09b55")}
        <text x="62" y="164">고체</text><text x="180" y="164">액체</text><text x="298" y="164">기체</text>`, "입자 사이 거리와 움직임을 비교하세요.");
    }
    if (/상태 변화의 이름|승화/.test(title)) {
      return frame("phase", `
        <circle cx="65" cy="96" r="38"/><circle cx="180" cy="48" r="38"/><circle cx="295" cy="96" r="38"/>
        <text x="65" y="102">고체</text><text x="180" y="54">액체</text><text x="295" y="102">기체</text>
        <path d="M99 78 L139 59"/><path d="M139 78 L99 94"/><path d="M220 60 L261 80"/><path d="M258 105 L218 85"/><path d="M105 119 Q180 160 255 119"/><path d="M252 133 Q180 180 106 133"/>
        <polygon points="139,59 130,58 135,67"/><polygon points="99,94 108,94 104,85"/><polygon points="261,80 252,71 251,81"/><polygon points="218,85 226,95 228,84"/>`, "화살표의 출발 상태와 도착 상태를 확인하세요.");
    }
    if (/입자의 움직임|확산|온도와 확산/.test(title)) {
      return frame("diffusion", `
        <rect x="18" y="38" width="324" height="108" rx="18"/>
        ${dots([[48,65],[62,91],[42,120],[80,72],[95,112],[120,82]], "#735fd2")}
        ${dots([[150,62],[178,112],[207,75],[238,124],[270,58],[316,101]], "#ed8b52")}
        <path d="M105 42 C150 12 210 12 255 42"/><polygon points="255,42 244,34 245,47"/>
        <text x="180" y="174">시간이 지나면 고르게 퍼짐</text>`, "입자는 스스로 움직이며 빈 공간으로 퍼집니다.");
    }
    if (/증발|끓음|응결/.test(title)) {
      return frame("boiling", `
        <path d="M92 38 L110 144 Q180 170 250 144 L268 38"/><path class="water" d="M106 99 Q180 88 254 99 L250 144 Q180 168 110 144 Z"/>
        <circle cx="145" cy="125" r="9"/><circle cx="188" cy="112" r="7"/><circle cx="223" cy="135" r="10"/>
        <path d="M142 91 L142 48"/><path d="M180 88 L180 36"/><path d="M220 91 L220 48"/>
        <polygon points="142,43 135,55 149,55"/><polygon points="180,31 173,43 187,43"/><polygon points="220,43 213,55 227,55"/>
        <text x="180" y="184">표면의 증발 · 내부의 끓음 · 기체의 응결</text>`, "입자가 어디에서 이동하는지 비교하세요.");
    }
    if (/열과 상태 변화|상태 변화 중 온도|온도와 열|열평형|비열|열량|열의 이동|열팽창/.test(title)) {
      return frame("heat", `
        <rect class="hot" x="28" y="56" width="92" height="82" rx="16"/><rect class="cold" x="240" y="56" width="92" height="82" rx="16"/>
        <text x="74" y="88">고온</text><text x="286" y="88">저온</text><text x="74" y="116">입자 빠름</text><text x="286" y="116">입자 느림</text>
        <path d="M126 96 L226 96"/><polygon points="231,96 216,87 216,105"/>
        <path class="graph" d="M42 166 L42 22 M42 166 L324 166 M62 146 L135 105 L205 105 L290 45"/>
        <circle cx="205" cy="105" r="5"/>`, "열은 고온에서 저온으로 이동하며, 상태 변화 중에는 온도가 일정할 수 있습니다.");
    }
    if (/질량은 보존|공정한 실험|관찰과 측정/.test(title)) {
      return frame("experiment", `
        <path d="M78 44 L54 139 Q88 160 122 139 L98 44"/><path class="water" d="M63 108 Q88 98 113 108 L122 139 Q88 159 54 139 Z"/>
        <path d="M242 44 L218 139 Q252 160 286 139 L262 44"/><path class="water" d="M227 92 Q252 82 277 92 L286 139 Q252 159 218 139 Z"/>
        <line x1="145" y1="91" x2="196" y2="91"/><text x="170" y="78">한 조건만 변화</text><text x="88" y="180">변화 전</text><text x="252" y="180">변화 후</text>`, "비교할 조건 하나만 바꾸고 나머지는 같게 유지하세요.");
    }
    if (/밀도|뜨고 가라앉|부피|압력|기체 법칙|대기압|물의 특별한 성질/.test(title)) {
      return frame("density", `
        <rect class="tank" x="24" y="40" width="142" height="112" rx="12"/><path class="water" d="M25 88 Q95 78 165 88 L165 151 L25 151 Z"/>
        <rect class="float" x="48" y="66" width="42" height="32" rx="5"/><rect class="sink" x="112" y="114" width="36" height="30" rx="5"/>
        <rect class="piston" x="220" y="36" width="102" height="116" rx="10"/><line x1="221" y1="72" x2="321" y2="72"/><path d="M271 18 L271 65"/><polygon points="271,70 263,57 279,57"/>
        ${dots([[242,96],[278,112],[303,91],[250,136],[302,134]], "#f09b55")}
        <text x="95" y="178">밀도 비교</text><text x="271" y="178">압력과 부피</text>`, "밀도는 뜨고 가라앉는 현상을, 입자 충돌은 기체 압력을 설명합니다.");
    }
    if (/용해|용액|녹는점|끓는점|혼합물|물질의 특성/.test(title)) {
      return frame("solution", `
        <path d="M84 34 L66 145 Q125 171 184 145 L166 34"/><path class="water" d="M75 86 Q125 76 175 86 L184 145 Q125 170 66 145 Z"/>
        ${dots([[94,112],[118,132],[144,102],[158,139],[130,151]], "#735fd2")}
        <path d="M235 42 L235 151 M235 151 L333 151"/><path class="graph" d="M244 136 Q270 115 284 92 T324 47"/>
        <text x="125" y="184">용질이 고르게 섞인 용액</text><text x="285" y="174">온도에 따른 변화</text>`, "물질마다 밀도·녹는점·끓는점·용해도가 다릅니다.");
    }
    if (/힘|중력|무게|탄성|마찰|부력/.test(title) || stage?.area === "physics") {
      return frame("force", `
        <rect class="object" x="140" y="72" width="80" height="54" rx="10"/>
        <path d="M132 99 L58 99"/><polygon points="52,99 67,90 67,108"/><path d="M228 99 L302 99"/><polygon points="308,99 293,90 293,108"/>
        <path d="M180 64 L180 23"/><polygon points="180,18 172,31 188,31"/><path d="M180 134 L180 174"/><polygon points="180,180 172,167 188,167"/>
        <text x="72" y="86">마찰력</text><text x="286" y="86">미는 힘</text><text x="198" y="31">부력</text><text x="205" y="176">중력</text>`, "힘은 크기와 방향을 가진 화살표로 나타냅니다.");
    }
    if (/태양|행성|지구|달|일식|월식|천체/.test(title) || stage?.area === "earth") {
      return frame("orbit", `
        <circle class="sun" cx="78" cy="95" r="34"/><ellipse cx="206" cy="95" rx="116" ry="65"/><circle class="earth" cx="206" cy="30" r="16"/><ellipse cx="206" cy="30" rx="31" ry="22"/><circle class="moon" cx="235" cy="37" r="7"/>
        <path d="M132 95 L172 95"/><polygon points="177,95 164,87 164,103"/>
        <text x="78" y="101">태양</text><text x="206" y="35">지구</text><text x="274" y="174">공전 궤도</text>`, "자전·공전 방향과 세 천체의 상대적 위치를 살펴보세요.");
    }
    if (/세포|생물|생태|환경|광합성|소비자|분해자/.test(title) || stage?.area === "life") {
      return frame("life", `
        <path class="cell" d="M36 55 Q75 22 120 49 Q149 81 123 126 Q75 157 37 126 Q14 91 36 55 Z"/><circle class="nucleus" cx="82" cy="91" r="20"/>
        <circle class="plant" cx="230" cy="49" r="25"/><circle class="animal" cx="302" cy="96" r="25"/><circle class="decomposer" cx="224" cy="145" r="25"/>
        <path d="M251 59 L279 81"/><path d="M282 113 L247 134"/><path d="M219 119 L224 79"/>
        <text x="82" y="176">세포</text><text x="230" y="54">생산</text><text x="302" y="101">소비</text><text x="224" y="150">분해</text>`, "구조와 기능, 생태계 구성 요소의 연결을 함께 보세요.");
    }
    return "";
  }

  function scienceVisualMarkup(stage, card = null) {
    const diagram = scienceDiagram(card?.title || stage?.title || "", stage);
    if (diagram) return diagram;
    const stageVisual = scienceStageVisuals[stage?.visualKey] || scienceStageVisuals[stage?.id] || scienceStageVisuals.matter;
    const visual = { items: scienceCardVisuals[card?.title] || stageVisual.items };
    return `<div class="science-concept-visual">
      ${visual.items.map(([icon, label], index) => `${index ? '<span class="science-visual-arrow" aria-hidden="true">→</span>' : ""}<div><i aria-hidden="true">${icon}</i><small>${label}</small></div>`).join("")}
    </div>`;
  }

  function paperDecorations() {
    return '<i class="study-paperclip" aria-hidden="true"></i><i class="study-doodle-star study-doodle-star-one" aria-hidden="true">✦</i><i class="study-doodle-star study-doodle-star-two" aria-hidden="true">✦</i>';
  }

  function currentUser() {
    return localStorage.getItem("studyCoinCurrentUser") || "guest";
  }

  function englishVocabularyStorageKey() {
    return `studyCoinEnglishVocabularyV1:${currentUser()}`;
  }

  function loadEnglishVocabularyState() {
    try {
      const saved = JSON.parse(localStorage.getItem(englishVocabularyStorageKey()));
      return saved?.version === 1 ? saved : { version: 1, courses: {} };
    } catch {
      return { version: 1, courses: {} };
    }
  }

  function englishVocabularyCourseState(courseId) {
    const vocabularyState = loadEnglishVocabularyState();
    if (!vocabularyState.courses[courseId]) vocabularyState.courses[courseId] = { memorizedIds: [], currentCardId: null };
    vocabularyState.courses[courseId].memorizedIds = [...new Set(vocabularyState.courses[courseId].memorizedIds || [])];
    return { vocabularyState, courseState: vocabularyState.courses[courseId] };
  }

  function saveEnglishVocabularyState(vocabularyState) {
    localStorage.setItem(englishVocabularyStorageKey(), JSON.stringify(vocabularyState));
  }

  function recordEnglishVocabularyAttempt(card, dimension, correct) {
    const model = window.STUDY_ENGLISH_LEARNING;
    if (!model || !card) return;
    const userId = currentUser();
    const subject = subjectState("english");
    const legacy = {
      completedStages: subject.completedStages,
      completedEnglishStageIds: subject.completedEnglishStageIds,
    };
    const learningState = model.loadState(localStorage, userId, legacy);
    const vocabulary = model.normalizeVocabulary(card, {
      levelId: currentStage()?.levelId,
      courseId: currentStage()?.id,
    });
    learningState.vocabularyResults[vocabulary.id] = model.updateVocabularyProgress(
      learningState.vocabularyResults[vocabulary.id],
      {
        wordId: vocabulary.id,
        stage: vocabulary.stage,
        dimension,
        correct,
        attemptedAt: new Date().toISOString(),
      }
    );
    model.saveState(localStorage, userId, learningState, window.STUDY_CLOUD_AUTH);
  }

  function storageKey() {
    return `studyCoinSubjectLearningV2:${currentUser()}`;
  }

  function defaultState() {
    return { version: storageVersion, activeSubject: null, subjects: {} };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()));
      return saved?.version === storageVersion ? { ...defaultState(), ...saved } : defaultState();
    } catch {
      return defaultState();
    }
  }

  let state = load();

  function save() {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  }

  function newSubjectState(subjectId) {
    return {
      subjectId,
      stageIndex: 0,
      completedStages: [],
      completedEnglishStageIds: [],
      englishAlphabetLevelRemovedV1: true,
      englishTwentyLevelRestoreV1: true,
      selectedEnglishLevelId: subjectId === "english" ? "EN-L01" : null,
      activeEnglishStageId: null,
      englishDefaultPathV1: false,
      englishFoundationMode: false,
      englishAiMessages: [],
      englishRemediationState: window.STUDY_ENGLISH_REMEDIATION?.createRemediationState?.() || null,
      mode: subjectId === "reading" ? "books" : "intro",
      queue: [],
      reviewQueue: [],
      wrongQuestionIds: [],
      mastered: [],
      answer: "",
      feedback: null,
      explanationOpen: false,
      previousQuestion: null,
      questionHistory: [],
      flashIndex: 0,
      flashQueue: [],
      cardReview: {},
      scienceCardIndex: 0,
      scienceUnderstood: {},
      scienceHintLevel: 0,
      scienceCurriculum2022ExpandedV1: true,
      selectedBookId: null,
      reflection: ["", "", "", ""],
      reflectionIndex: 0,
      report: "",
      reports: [],
      xp: 0,
      coins: 0,
      lastUpdatedAt: null,
    };
  }

  function subjectState(subjectId) {
    if (!state.subjects[subjectId]) state.subjects[subjectId] = newSubjectState(subjectId);
    const subject = state.subjects[subjectId];
    subject.queue = [...new Set(subject.queue || [])];
    subject.completedEnglishStageIds = [...new Set(subject.completedEnglishStageIds || [])];
    subject.reviewQueue = [...new Set(subject.reviewQueue || [])];
    subject.wrongQuestionIds = [...new Set(subject.wrongQuestionIds || [])];
    subject.mastered = [...new Set(subject.mastered || [])];
    subject.englishAiMessages = Array.isArray(subject.englishAiMessages) ? subject.englishAiMessages : [];
    subject.englishRemediationState = subject.englishRemediationState || window.STUDY_ENGLISH_REMEDIATION?.createRemediationState?.() || null;
    subject.flashQueue = Array.isArray(subject.flashQueue) ? subject.flashQueue : [];
    subject.cardReview = subject.cardReview || {};
    subject.scienceCardIndex = Number.isInteger(subject.scienceCardIndex) ? subject.scienceCardIndex : 0;
    subject.scienceUnderstood = subject.scienceUnderstood || {};
    subject.scienceHintLevel = Number(subject.scienceHintLevel) || 0;
    subject.explanationOpen = Boolean(subject.explanationOpen);
    if (subjectId === "english") {
      if (!subject.englishTwentyLevelRestoreV1 && subject.englishAlphabetLevelRemovedV1) {
        const restoreEnglishId = (value) => typeof value === "string" ? value.replace(/EN-L(\d{2})/g, (full, digits) => {
          const level = Number(digits);
          return level >= 1 && level <= 19 ? `EN-L${String(level + 1).padStart(2, "0")}` : full;
        }) : value;
        subject.completedStages = [...new Set((subject.completedStages || []).map(restoreEnglishId))];
        subject.completedEnglishStageIds = [...new Set((subject.completedEnglishStageIds || []).map(restoreEnglishId))];
        subject.selectedEnglishLevelId = restoreEnglishId(subject.selectedEnglishLevelId || "EN-L02");
        subject.activeEnglishStageId = restoreEnglishId(subject.activeEnglishStageId);
        subject.stageIndex = Number(subject.stageIndex || 0) + 15;
        subject.englishTwentyLevelRestoreV1 = true;
        save();
      }
      if (!subject.englishAlphabetLevelRemovedV1) {
        const shiftOldEnglishId = (value) => {
          if (typeof value !== "string") return value;
          return value.replace(/EN-L(\d{2})/g, (full, digits) => {
            const oldLevel = Number(digits);
            if (oldLevel < 2 || oldLevel > 20) return full;
            return `EN-L${String(oldLevel - 1).padStart(2, "0")}`;
          });
        };
        const shiftCompletedIds = (values) => [...new Set((values || [])
          .filter((id) => !String(id).includes("EN-L01"))
          .map(shiftOldEnglishId))];
        subject.completedStages = shiftCompletedIds(subject.completedStages);
        subject.completedEnglishStageIds = shiftCompletedIds(subject.completedEnglishStageIds);
        subject.selectedEnglishLevelId = subject.selectedEnglishLevelId === "EN-L01"
          ? "EN-L01"
          : shiftOldEnglishId(subject.selectedEnglishLevelId || "EN-L01");
        subject.activeEnglishStageId = String(subject.activeEnglishStageId || "").includes("EN-L01")
          ? null
          : shiftOldEnglishId(subject.activeEnglishStageId);
        subject.stageIndex = Math.max(0, Number(subject.stageIndex || 0) - 15);
        subject.queue = [];
        subject.reviewQueue = [];
        subject.answer = "";
        subject.feedback = null;
        subject.englishAlphabetLevelRemovedV1 = true;
        save();
      }
      if (!subject.selectedEnglishLevelId) subject.selectedEnglishLevelId = "EN-L01";
      if (!subject.englishNoImmediateReviewV1) {
        const completedOrWrong = new Set([...(subject.mastered || []), ...(subject.wrongQuestionIds || [])]);
        subject.queue = (subject.queue || []).filter((id) => !completedOrWrong.has(id));
        subject.reviewQueue = [];
        subject.englishNoImmediateReviewV1 = true;
        save();
      }
      if (!subject.englishDefaultPathV1 && content.english?.stages?.length) {
        const gradeFourStart = content.english.stages.findIndex((course) => course.id === "EN-L03-C01");
        const firstIncomplete = content.english.stages.findIndex((course, index) => index >= gradeFourStart && !subject.completedStages.includes(course.id));
        if (gradeFourStart >= 0 && subject.stageIndex < gradeFourStart) subject.stageIndex = firstIncomplete >= 0 ? firstIncomplete : gradeFourStart;
        subject.selectedEnglishLevelId = content.english.stages[subject.stageIndex]?.levelId || "EN-L03";
        subject.englishDefaultPathV1 = true;
        save();
      }
      if (!subject.englishBeVerbPathV1 && content.english?.stages?.length) {
        const beVerbStart = content.english.stages.findIndex((course) => course.id === "EN-L04-C01");
        const currentCourse = content.english.stages[subject.stageIndex];
        if (beVerbStart >= 0 && (!currentCourse || /^EN-L0[1-3]-/.test(currentCourse.id))) {
          subject.stageIndex = beVerbStart;
          subject.selectedEnglishLevelId = "EN-L04";
          subject.activeEnglishStageId = null;
          subject.mode = "tree";
          subject.resumeMode = "tree";
          subject.queue = [];
          subject.reviewQueue = [];
          subject.answer = "";
          subject.feedback = null;
        }
        subject.englishBeVerbPathV1 = true;
        save();
      }
      (subject.completedStages || []).forEach((courseId) => {
        const completedCourse = (content.english?.stages || []).find((course) => course.id === courseId);
        (completedCourse?.courseStages || []).forEach((stage) => {
          if (!subject.completedEnglishStageIds.includes(stage.stageId)) subject.completedEnglishStageIds.push(stage.stageId);
        });
      });
    }
    if (subjectId === "science" && !subject.scienceCurriculum2022ExpandedV1 && content.science?.stages?.length) {
      const oldStageIndex = Number(subject.stageIndex || 0);
      const hadOldActivity = Boolean(
        (subject.completedStages || []).length
        || Number(subject.xp || 0) > 0
        || subject.lastUpdatedAt
        || Object.values(subject.scienceUnderstood || {}).some((indexes) => Array.isArray(indexes) && indexes.length)
        || oldStageIndex > 0
      );
      if (hadOldActivity) {
        const oldCurrentId = oldStageIndex === 0 ? "matter" : oldStageIndex === 1 ? "ecosystem" : null;
        const oldCurrentIndex = oldCurrentId ? content.science.stages.findIndex((stage) => stage.id === oldCurrentId) : -1;
        const firstIncomplete = content.science.stages.findIndex((stage) => !subject.completedStages.includes(stage.id));
        subject.stageIndex = oldCurrentIndex >= 0 ? oldCurrentIndex : Math.max(0, firstIncomplete);
      } else {
        subject.stageIndex = 0;
      }
      subject.scienceCurriculum2022ExpandedV1 = true;
      subject.mode = "tree";
      subject.resumeMode = "tree";
      subject.queue = [];
      subject.reviewQueue = [];
      subject.answer = "";
      subject.feedback = null;
      save();
    }
    subject.questionHistory = Array.isArray(subject.questionHistory) ? subject.questionHistory : (subject.previousQuestion ? [subject.previousQuestion] : []);
    return subject;
  }

  function subjectInfo() {
    return content[activeSubject];
  }

  function currentStage() {
    const info = subjectInfo();
    const subject = subjectState(activeSubject);
    return info.stages?.[subject.stageIndex] || null;
  }

  function currentEnglishStage() {
    if (activeSubject !== "english") return null;
    const course = currentStage();
    const subject = subjectState("english");
    return (course?.courseStages || []).find((stage) => stage.stageId === subject.activeEnglishStageId) || null;
  }

  function currentEnglishCourseIndex(subject = subjectState("english")) {
    const courses = subjectInfo().stages || [];
    const gradeFourStart = subject.englishFoundationMode ? 0 : Math.max(0, courses.findIndex((course) => course.id === "EN-L04-C01"));
    const candidate = Math.max(gradeFourStart, Math.min(subject.stageIndex, courses.length - 1));
    if (!subject.completedStages.includes(courses[candidate]?.id)) return candidate;
    const next = courses.findIndex((course, index) => index > candidate && !subject.completedStages.includes(course.id));
    return next >= 0 ? next : candidate;
  }

  function englishCourseWindow(subject = subjectState("english")) {
    const courses = subjectInfo().stages || [];
    const start = currentEnglishCourseIndex(subject);
    return courses.slice(start, start + 4);
  }

  function englishDisplayCourseNumber(absoluteIndex, subject = subjectState("english")) {
    if (subject.englishFoundationMode) return absoluteIndex + 1;
    const defaultStart = Math.max(0, (subjectInfo().stages || []).findIndex((course) => course.id === "EN-L04-C01"));
    return absoluteIndex - defaultStart + 1;
  }

  function englishVocabularyCards(course = currentStage()) {
    const questionCards = (course?.courseStages || []).flatMap((stage) => stage.questions || []);
    const cards = new Map();
    questionCards.forEach((question) => {
      const word = String(question.vocabularyWord || "").trim();
      if (!word || word.length < 2 || !/^[A-Za-z][A-Za-z'-]*$/.test(word)) return;
      const cardIdValue = `${course.id}:${word.toLowerCase()}`;
      if (cards.has(cardIdValue)) return;
      cards.set(cardIdValue, {
        cardId: cardIdValue,
        word,
        meaning: question.koreanMeaning || question.answer || "뜻을 문장에서 확인해요",
        partOfSpeech: question.partOfSpeech || (/ing$/.test(word) ? "동사·형용사" : "핵심 어휘"),
        example: question.exampleSentence || `I use the word ${word}.`,
        translation: question.exampleTranslation || question.explanation || `${word}의 쓰임을 확인하는 예문입니다.`,
      });
    });
    if (cards.size) return [...cards.values()];
    const topicCards = (course?.vocabularyTopics || []).map((topic, index) => ({
      cardId: `${course.id}:topic-${index}`,
      word: topic,
      meaning: course.title,
      partOfSpeech: "핵심 표현",
      example: course.learningObjectives?.[0] || course.description,
      translation: course.description,
    }));
    if (topicCards.length) return topicCards;
    const fallbackWords = /be동사/i.test(course?.title || "")
      ? [
          ["I", "나", "I am a student.", "나는 학생입니다."],
          ["am", "~이다", "I am happy.", "나는 행복합니다."],
          ["you", "너·당신", "You are kind.", "당신은 친절합니다."],
          ["are", "~이다", "We are friends.", "우리는 친구입니다."],
          ["he", "그", "He is tall.", "그는 키가 큽니다."],
          ["she", "그녀", "She is a teacher.", "그녀는 선생님입니다."],
          ["is", "~이다", "It is a book.", "그것은 책입니다."],
          ["we", "우리", "We are ready.", "우리는 준비됐습니다."],
          ["they", "그들", "They are students.", "그들은 학생들입니다."],
          ["student", "학생", "I am a student.", "나는 학생입니다."],
        ]
      : [
          ["learn", "배우다", "I learn English.", "나는 영어를 배웁니다."],
          ["study", "공부하다", "We study together.", "우리는 함께 공부합니다."],
          ["read", "읽다", "I read a book.", "나는 책을 읽습니다."],
          ["write", "쓰다", "She writes a sentence.", "그녀는 문장을 씁니다."],
          ["listen", "듣다", "They listen carefully.", "그들은 주의 깊게 듣습니다."],
          ["speak", "말하다", "You speak clearly.", "당신은 또렷하게 말합니다."],
          ["question", "질문", "This is a question.", "이것은 질문입니다."],
          ["answer", "대답·정답", "I know the answer.", "나는 정답을 압니다."],
          ["sentence", "문장", "This sentence is short.", "이 문장은 짧습니다."],
          ["practice", "연습하다", "We practice every day.", "우리는 매일 연습합니다."],
        ];
    return fallbackWords.map(([word, meaning, example, translation]) => ({
      cardId: `${course.id}:fallback-${word.toLowerCase()}`,
      word,
      meaning,
      partOfSpeech: "핵심 어휘",
      example,
      translation,
    }));
  }

  function englishStageUnlocked(stage, subject = subjectState("english")) {
    return (stage.prerequisiteStageIds || []).every((id) => subject.completedEnglishStageIds.includes(id));
  }

  function englishStageProgress(stage, subject = subjectState("english")) {
    if (subject.completedEnglishStageIds.includes(stage.stageId)) return 100;
    const ids = (stage.questions || []).map((question) => question.id);
    if (!ids.length || subject.activeEnglishStageId !== stage.stageId) return 0;
    return Math.round((subject.mastered.filter((id) => ids.includes(id)).length / ids.length) * 100);
  }

  function englishLevelUnlocked(levelId, subject = subjectState("english")) {
    const levels = subjectInfo().levelSummaries || [];
    const levelIndex = levels.findIndex((level) => level.levelId === levelId);
    if (levelIndex <= 0) return levelIndex === 0;
    const previousId = levels[levelIndex - 1].levelId;
    return subjectInfo().stages
      .filter((stage) => stage.levelId === previousId)
      .every((stage) => subject.completedStages.includes(stage.id));
  }

  function englishCourseUnlocked(stage, subject = subjectState("english")) {
    if (!englishLevelUnlocked(stage.levelId, subject)) return false;
    return (stage.prerequisiteCourseIds || []).every((id) => subject.completedStages.includes(id));
  }

  function englishCourseProgress(stage, subject = subjectState("english")) {
    if (subject.completedStages.includes(stage.id)) return 100;
    const courseStages = stage.courseStages || [];
    if (!courseStages.length) return 0;
    return Math.round((courseStages.filter((item) => subject.completedEnglishStageIds.includes(item.stageId)).length / courseStages.length) * 100);
  }

  function stageQuestionIds(stage = currentStage()) {
    const source = activeSubject === "english" && currentEnglishStage() ? currentEnglishStage() : stage;
    return (source?.questions || []).map((question) => question.id);
  }

  function allSubjectQuestions() {
    if (activeSubject === "english") return (subjectInfo().stages || []).flatMap((course) => (course.courseStages || []).flatMap((stage) => stage.questions || []));
    return (subjectInfo().stages || []).flatMap((stage) => stage.questions || []);
  }

  function reviewQuestionsForStage() {
    if (activeSubject === "english") return [];
    const subject = subjectState(activeSubject);
    if (subject.stageIndex <= 0) return [];
    return (subjectInfo().stages || [])
      .slice(0, subject.stageIndex)
      .flatMap((stage) => stage.questions || [])
      .filter((question) => question.spacedReview)
      .slice(-2);
  }

  function currentLearningGrade() {
    const settings = window.getCurrentLearningSettings?.();
    return settings?.grade || "중등 2학년";
  }

  function cardId(stage, card, index) {
    return card.id || `${stage.id}:${index}:${card.word}`;
  }

  function flashcardsForStage(stage, stageIndex = subjectState(activeSubject).stageIndex) {
    const subject = subjectState(activeSubject);
    const sourceCards = activeSubject === "english"
      ? (window.STUDY_ENGLISH_VOCABULARY?.[stage.id] || [])
      : (stage.flashcards || []);
    const currentCards = sourceCards.map((card, index) => ({ ...card, cardId: cardId(stage, card, index) }));
    const now = Date.now();
    const previousCards = (subjectInfo().stages || [])
      .slice(0, stageIndex)
      .flatMap((previousStage) => {
        const cards = activeSubject === "english"
          ? (window.STUDY_ENGLISH_VOCABULARY?.[previousStage.id] || [])
          : (previousStage.flashcards || []);
        return cards.map((card, index) => ({ ...card, cardId: cardId(previousStage, card, index) }));
      });
    const dueReviews = previousCards
      .filter((card) => {
        const review = subject.cardReview[card.cardId];
        return !review || !review.dueAt || review.dueAt <= now;
      })
      .slice(0, 12);
    const carryOver = previousCards.filter((card) => !dueReviews.some((due) => due.cardId === card.cardId)).slice(-3);
    return [...new Map([...currentCards, ...dueReviews, ...carryOver].map((card) => [card.cardId, card])).values()];
  }

  function recordCardReview(card, remembered) {
    const subject = subjectState(activeSubject);
    const previous = subject.cardReview[card.cardId] || { repetitions: 0, intervalDays: 0, lapses: 0 };
    const repetitions = remembered ? previous.repetitions + 1 : 0;
    const intervalDays = remembered ? [1, 3, 7, 14, 30][Math.min(repetitions - 1, 4)] : 0;
    subject.cardReview[card.cardId] = {
      repetitions,
      intervalDays,
      lapses: remembered ? previous.lapses : previous.lapses + 1,
      lastReviewedAt: new Date().toISOString(),
      dueAt: Date.now() + (remembered ? intervalDays * 86400000 : 0),
    };
  }

  function syncScreens(name) {
    if (window.STUDY_NAV?.go) window.STUDY_NAV.go(name);
    else document.querySelectorAll("[data-screen]").forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });
    localStorage.setItem("studyCoinCurrentScreen", name);
    window.scrollTo?.(0, 0);
  }

  function normalized(value) {
    return String(value || "").trim().replace(/[.,!?"']/g, "").replace(/\s+/g, " ").toLowerCase();
  }

  function reportActivity(correct) {
    document.dispatchEvent(new CustomEvent("study:learning-answer", {
      detail: { subject: activeSubject, correct, minutes: 2, points: correct ? 14 : 2 },
    }));
  }

  function updateSubjectCards() {
    Object.entries(content).forEach(([subjectId, info]) => {
      const subject = subjectState(subjectId);
      const total = subjectId === "reading" ? 3 : info.stages.length;
      const complete = subject.completedStages.length;
      const progress = Math.round((complete / total) * 100);
      const card = document.querySelector(`[data-subject-learning="${subjectId}"].subject-learning-entry`);
      const percent = document.querySelector(`[data-subject-progress="${subjectId}"]`);
      if (card) {
        const detail = card.querySelector("p");
        const bar = card.querySelector("i");
        if (detail) detail.textContent = subjectId === "hanja" ? `급수별 · ${info.stages[subject.stageIndex]?.title || "완료"}` : `${info.stages?.[subject.stageIndex]?.title || "독후감 완성"} · 이어서 학습`;
        if (bar) bar.style.width = `${progress}%`;
      }
      if (percent) percent.textContent = `${progress}%`;
    });
  }

  function renderHeader() {
    const info = subjectInfo();
    const subject = subjectState(activeSubject);
    const stage = currentStage();
    const englishPhase = currentEnglishStage();
    const englishPhaseLabel = ({ grammar: "문법", practice: "문장 연습", reading: "독해", listening: "듣기", speaking: "말하기", writing: "쓰기", checkpoint: "과정 평가", boss: "과정 평가" })[englishPhase?.stageType] || "";
    const stageName = activeSubject === "reading"
      ? (subject.mode === "books" ? "책 추천" : subject.mode === "reflection" ? "생각 나누기" : subject.mode === "report" ? "독후감 완성" : "줄거리 이해 퀴즈")
      : activeSubject === "english" ? `${stage?.title || "학습 완료"}${englishPhaseLabel ? ` · ${englishPhaseLabel}` : ""}` : stage?.title || "학습 완료";
    const requiredIds = stageQuestionIds(stage);
    const total = activeSubject === "reading" ? 3 : requiredIds.length || 1;
    const done = activeSubject === "reading" ? subject.mastered.length : subject.mastered.filter((id) => requiredIds.includes(id)).length;
    $("#subjectLearningEyebrow").textContent = info.eyebrow;
    $("#subjectLearningTitle").textContent = info.name;
    $("#subjectLearningStage").textContent = stageName;
    $("#subjectLearningCount").textContent = `${Math.min(done + 1, total)} / ${total}`;
    $("#subjectLearningBar").style.width = `${Math.min(100, Math.round((done / total) * 100))}%`;
    $("#subjectLearningMastery").textContent = activeSubject === "reading"
      ? "내용을 이해한 뒤 내 생각을 모아 독후감을 완성해요."
      : activeSubject === "english" && subject.mode === "quiz"
        ? "현재 과정의 문제만 차례대로 풀어요."
      : "모든 문제를 한 번씩 맞혀야 다음 단계가 열려요.";
    renderSubjectTree();
  }

  function renderSubjectTree() {
    const tree = $("#subjectLearningTree");
    if (!tree) return;
    const subject = subjectState(activeSubject);
    const progressCard = tree.nextElementSibling;
    if (activeSubject === "hanja") {
      tree.innerHTML = "";
      tree.classList.add("is-hidden");
      progressCard?.classList.toggle("is-hidden", subject.mode === "tree");
      return;
    }
    if (activeSubject === "english" && subject.mode === "tree") {
      tree.innerHTML = "";
      tree.classList.add("is-hidden");
      progressCard?.classList.add("is-hidden");
      return;
    }
    progressCard?.classList.remove("is-hidden");
    if (activeSubject === "english" && subject.mode === "quiz") {
      tree.innerHTML = "";
      tree.classList.add("is-hidden");
      return;
    }
    tree.classList.remove("is-hidden");
    tree.classList.toggle("is-hanja-tree", activeSubject === "hanja");
    tree.classList.toggle("is-english-tree", activeSubject === "english");
    tree.classList.toggle("is-science-tree", activeSubject === "science");
    if (activeSubject === "english" && subjectInfo().levelSummaries) {
      const currentIndex = currentEnglishCourseIndex(subject);
      const windowCourses = englishCourseWindow(subject);
      const vocabularyReady = englishVocabularyStatus(currentStage()).complete;
      tree.innerHTML = `${windowCourses.map((course, offset) => {
        const absoluteIndex = currentIndex + offset;
        const complete = subject.completedStages.includes(course.id);
        const current = offset === 0 && !complete;
        const unlocked = englishCourseUnlocked(course, subject) || current || complete;
        return `<span class="${complete ? "is-complete" : current ? "is-current" : "is-locked"}" title="${escapeHtml(course.title)}"><b>${complete ? "✓" : unlocked && current ? englishDisplayCourseNumber(absoluteIndex, subject) : "🔒"}</b><em>${escapeHtml(course.title)}</em></span>`;
      }).join("")}
      <div class="subject-tree-guide-row english-study-menu english-study-menu-primary">
        <button class="subject-tree-guide" type="button" data-subject-action="open-word-cards">단어 암기</button>
        <button class="subject-tree-guide" type="button" data-subject-action="open-english-phase" data-english-phase="grammar" ${vocabularyReady ? "" : "disabled"}>문법</button>
        <button class="subject-tree-guide" type="button" data-subject-action="open-english-phase" data-english-phase="reading" ${vocabularyReady ? "" : "disabled"}>독해</button>
        <button class="subject-tree-guide" type="button" data-subject-action="open-english-ai-chat">AI 채팅</button>
      </div>
      <div class="subject-tree-guide-row english-study-menu english-study-menu-secondary">
        <button class="subject-tree-guide" type="button" data-subject-action="open-english-memorized">암기장</button>
        <button class="subject-tree-guide" type="button" data-subject-action="open-english-wrong-note">오답노트</button>
      </div>`;
      return;
    }
    if (activeSubject === "hanja" && subjectInfo().levelOrder) {
      const info = subjectInfo();
      const currentStageId = info.stages[subject.stageIndex]?.id;
      tree.innerHTML = `<button class="subject-tree-guide" type="button" data-subject-action="start-tree-stage">한자 급수 학습</button>` + info.levelOrder.map((level, levelIndex) => {
        const stages = info.stages.filter((stage) => stage.gradeLabel === level);
        const complete = stages.length > 0 && stages.every((stage) => subject.completedStages.includes(stage.id));
        const current = stages.some((stage) => stage.id === currentStageId) && !complete;
        const targetStage = stages.find((stage) => !subject.completedStages.includes(stage.id)) || stages.at(-1);
        const className = complete ? "is-complete" : current ? "is-current" : "is-open";
        return `<button class="subject-tree-step hanja-grade-node ${className}" type="button" data-subject-action="open-hanja-stage" data-subject-stage="${targetStage.id}" title="${escapeHtml(level)}">
          <b>${complete ? "✓" : levelIndex + 1}</b><em>${escapeHtml(level)}</em>
        </button>`;
      }).join("");
      return;
      tree.innerHTML = `<button class="subject-tree-guide" type="button" data-subject-action="start-tree-stage">한자 급수 학습</button>
      <div class="hanja-rank-tree">${info.levelOrder.map((level, levelIndex) => {
        const stages = info.stages.filter((stage) => stage.gradeLabel === level);
        const complete = stages.length > 0 && stages.every((stage) => subject.completedStages.includes(stage.id));
        const current = stages.some((stage) => stage.id === currentStageId) && !complete;
        const available = complete || current;
        const targetStage = current ? stages.find((stage) => stage.id === currentStageId) : stages[0];
        const completedSessions = stages.filter((stage) => subject.completedStages.includes(stage.id)).length;
        return `<div class="hanja-rank-node ${complete ? "is-complete" : current ? "is-current" : "is-locked"} ${levelIndex % 2 ? "is-right" : "is-left"}">
          <i aria-hidden="true"></i>
          <button type="button" data-subject-action="${available ? "open-hanja-stage" : ""}" data-subject-stage="${targetStage?.id || ""}" ${available ? "" : "disabled"}>
            <b>${complete ? "✓" : current ? levelIndex + 1 : "🔒"}</b>
            <strong>${escapeHtml(level)}</strong>
            <small>${complete ? "완료" : current ? `${completedSessions + 1} / ${stages.length}회차` : `${stages.length}회차`}</small>
          </button>
        </div>`;
      }).join("")}</div>`;
      return;
    }
    if (activeSubject === "science" && subjectInfo().gradeOrder) {
      const info = subjectInfo();
      const stages = info.stages || [];
      const safeIndex = Math.min(Math.max(Number(subject.stageIndex || 0), 0), Math.max(stages.length - 1, 0));
      const currentScienceStage = stages[safeIndex] || stages[0];
      const currentGrade = currentScienceStage?.gradeLabel || info.gradeOrder[0];
      const currentCourse = currentScienceStage?.courseTitle || `${currentGrade} 과학`;
      const courseStages = stages.filter((stage) => stage.gradeLabel === currentGrade && stage.courseTitle === currentCourse);
      const currentGradeIndex = Math.max(0, info.gradeOrder.indexOf(currentGrade));
      const gradeWindowStart = Math.min(
        Math.max(0, currentGradeIndex - 1),
        Math.max(0, info.gradeOrder.length - 3),
      );
      const visibleGrades = info.gradeOrder.slice(gradeWindowStart, gradeWindowStart + 3);
      const gradeRoadmap = visibleGrades.map((grade) => {
        const gradeStages = stages.filter((stage) => stage.gradeLabel === grade);
        const complete = gradeStages.length > 0 && gradeStages.every((stage) => subject.completedStages.includes(stage.id));
        const current = grade === currentGrade && !complete;
        return `<button class="science-grade-step ${complete ? "is-complete" : current ? "is-current" : "is-locked"}" type="button" data-subject-action="select-science-grade" data-science-grade="${escapeHtml(grade)}" title="${escapeHtml(grade)} 과학"><b>${complete ? "✓" : current ? "현재" : "이동"}</b><em>${escapeHtml(grade)}</em></button>`;
      }).join("");
      const courseMarkup = courseStages.map((stage) => {
        const globalIndex = stages.findIndex((candidate) => candidate.id === stage.id);
        const complete = subject.completedStages.includes(stage.id);
        const current = globalIndex === safeIndex && !complete;
        const locked = !complete && !current;
        return `<span class="science-unit-step ${complete ? "is-complete" : current ? "is-current" : locked ? "is-locked" : "is-open"}" title="${escapeHtml(stage.title)}"><b>${complete ? "✓" : locked ? "🔒" : courseStages.indexOf(stage) + 1}</b><em>${escapeHtml(stage.title)}</em></span>`;
      }).join("");
      tree.innerHTML = `<div class="science-grade-roadmap">${gradeRoadmap}</div>
        <div class="science-course-heading"><strong>${escapeHtml(currentGrade)} · ${escapeHtml(currentCourse)}</strong><small>${safeIndex + 1} / ${stages.length}단원 · 교육과정 전체 연결</small></div>
        ${courseMarkup}
        <div class="subject-tree-guide-row"><button class="subject-tree-guide" type="button" data-subject-action="open-science-cards">단원 학습</button><button class="subject-tree-guide" type="button" data-subject-action="open-science-wrong-note">오답노트</button></div>`;
      return;
    }
    const readingSteps = ["추천 도서", "이해 퀴즈", "생각 정리", "독후감"];
    const steps = activeSubject === "reading"
      ? readingSteps.map((title, index) => ({ id: `reading-${index}`, title }))
      : (subjectInfo().stages || []).map((stage) => ({ id: stage.id, title: stage.title }));
    const currentIndex = activeSubject === "reading"
      ? ({ books: 0, summary: 0, quiz: 1, reflection: 2, report: 3, complete: steps.length }[subject.mode] ?? 0)
      : subject.stageIndex;
    const guide = activeSubject === "english"
      ? '<button class="subject-tree-guide" type="button" data-subject-action="open-word-cards">단어 암기</button>'
      : activeSubject === "reading"
        ? '<button class="subject-tree-guide" type="button" data-subject-action="open-reading-books">추천 도서 목록</button>'
        : activeSubject === "hanja"
          ? '<button class="subject-tree-guide" type="button" data-subject-action="start-tree-stage">한자 급수 학습</button>'
          : activeSubject === "science"
            ? '<div class="subject-tree-guide-row"><button class="subject-tree-guide" type="button" data-subject-action="open-science-cards">단원 학습</button><button class="subject-tree-guide" type="button" data-subject-action="open-science-wrong-note">오답노트</button></div>'
            : '<button class="subject-tree-guide" type="button" data-subject-action="start-tree-stage">단원 학습</button>';
    const stepMarkup = steps.map((step, index) => {
      const allHanjaLevelsOpen = activeSubject === "hanja";
      const complete = activeSubject === "reading"
        ? index < currentIndex || subject.mode === "complete"
        : subject.completedStages.includes(step.id);
      const current = index === currentIndex && !complete;
      const locked = !allHanjaLevelsOpen && !complete && !current;
      const mark = complete ? "✓" : locked ? "🔒" : String(index + 1);
      const className = complete ? "is-complete" : current ? "is-current" : locked ? "is-locked" : "is-open";
      if (allHanjaLevelsOpen) {
        return `<button class="subject-tree-step ${className}" type="button" data-subject-action="open-hanja-stage" data-subject-stage="${step.id}" title="${escapeHtml(step.title)}"><b>${mark}</b><em>${escapeHtml(step.title)}</em></button>`;
      }
      return `<span class="${className}" title="${escapeHtml(step.title)}"><b>${mark}</b><em>${escapeHtml(step.title)}</em></span>`;
    }).join("");
    tree.innerHTML = activeSubject === "science" ? stepMarkup + guide : guide + stepMarkup;
  }

  function learningTreeSteps() {
    if (activeSubject === "reading") {
      return [
        { id: "reading-books", title: "추천 도서", subtitle: "책 고르기" },
        { id: "reading-quiz", title: "이해 퀴즈", subtitle: "내용 확인" },
        { id: "reading-reflection", title: "생각 정리", subtitle: "내 생각 쓰기" },
        { id: "reading-report", title: "독후감", subtitle: "글 완성" },
      ];
    }
    return (subjectInfo().stages || []).map((stage) => ({ id: stage.id, title: stage.title, subtitle: "학습 단계" }));
  }

  function treeCurrentIndex(subject, steps) {
    if (activeSubject !== "reading") return Math.min(subject.stageIndex, Math.max(steps.length - 1, 0));
    const mode = subject.resumeMode || "books";
    return Math.min(({ books: 0, summary: 0, quiz: 1, reflection: 2, report: 3, complete: steps.length }[mode] ?? 0), Math.max(steps.length - 1, 0));
  }

  function renderEnglishStages() {
    const subject = subjectState("english");
    const course = currentStage();
    const courseStages = course?.courseStages || [];
    main.innerHTML = `<section class="subject-path-card">
      <span>${escapeHtml(course.levelTitle)} · ${courseStages.length}개 스테이지</span>
      <h2>${escapeHtml(course.title)}</h2>
      <p>${escapeHtml(course.description)} · 앞 스테이지를 완료하면 다음 스테이지가 열려요.</p>
      <div class="subject-path-tree">${courseStages.map((stage, index) => {
        const complete = subject.completedEnglishStageIds.includes(stage.stageId);
        const unlocked = englishStageUnlocked(stage, subject) || complete;
        const progress = englishStageProgress(stage, subject);
        const typeLabel = stage.stageType === "boss" ? "레벨 보스" : stage.stageType === "checkpoint" ? "과정 평가" : stage.stageType;
        return `<div class="subject-path-node ${index % 2 ? "is-right" : "is-left"} ${complete ? "is-complete" : unlocked ? "is-current" : "is-locked"}">
          <i aria-hidden="true"></i><button type="button" data-subject-action="open-english-stage" data-english-stage="${stage.stageId}" ${unlocked ? "" : "disabled"}>
            <b>${complete ? "✓" : unlocked ? stage.stageOrder : "🔒"}</b>
            <strong>${escapeHtml(stage.stageTitle)}</strong>
            <small>${escapeHtml(typeLabel)} · ${stage.estimatedMinutes}분 · ${progress}%</small>
          </button>
        </div>`;
      }).join("")}</div>
    </section>`;
    actions.innerHTML = `<button class="secondary subject-hint" type="button" data-subject-action="back-english-courses">과정 목록</button>${endTodayControl()}`;
  }

  function englishCardVisual(word) {
    const visuals = {
      mother: "👩", father: "👨", sister: "👭", brother: "👬", girl: "👧", boy: "👦", friend: "🧑‍🤝‍🧑", family: "👨‍👩‍👧‍👦", baby: "👶", teacher: "🧑‍🏫", school: "🏫",
      book: "📘", pencil: "✏️", apple: "🍎", water: "💧", food: "🍽️", dog: "🐶", cat: "🐱", sun: "☀️", rain: "🌧️",
      happy: "😊", sad: "😢", big: "🐘", small: "🐭", run: "🏃", walk: "🚶", read: "📖", write: "✍️", play: "⚽",
    };
    return visuals[String(word).toLowerCase()] || englishWordVisuals[String(word).toLowerCase()] || "📘";
  }

  function englishVocabularyStatus(course = currentStage()) {
    const cards = englishVocabularyCards(course);
    const { vocabularyState, courseState } = englishVocabularyCourseState(course.id);
    const memorized = new Set(courseState.memorizedIds);
    const remaining = cards.filter((card) => !memorized.has(card.cardId));
    let currentCard = remaining.find((card) => card.cardId === courseState.currentCardId) || remaining[0] || cards[0] || null;
    if (currentCard && courseState.currentCardId !== currentCard.cardId) {
      courseState.currentCardId = currentCard.cardId;
      saveEnglishVocabularyState(vocabularyState);
    }
    return { cards, vocabularyState, courseState, memorized, remaining, currentCard, complete: cards.length > 0 && memorized.size >= cards.length };
  }

  function englishRoadmapCourse(item, subject = subjectState("english")) {
    const courses = subjectInfo().stages || [];
    const incompleteId = item.courseIds.find((id) => !subject.completedStages.includes(id));
    return courses.find((course) => course.id === (incompleteId || item.courseIds[0])) || null;
  }

  function englishRoadmapPhase(item) {
    const course = englishRoadmapCourse(item);
    if (!course || item.mode === "course" || item.mode === "ai") return null;
    const phaseType = item.mode === "checkpoint" ? ["checkpoint", "boss"] : [item.mode];
    return (course.courseStages || []).find((stage) => phaseType.includes(stage.stageType)) || null;
  }

  function englishRoadmapItemComplete(item, subject = subjectState("english")) {
    if (item.mode === "ai") return (subject.englishAiMessages || []).length > 0;
    if (item.mode === "course") return item.courseIds.every((id) => subject.completedStages.includes(id));
    if (item.mode === "checkpoint") return item.courseIds.every((id) => subject.completedStages.includes(id));
    const phase = englishRoadmapPhase(item);
    return Boolean(phase && subject.completedEnglishStageIds.includes(phase.stageId));
  }

  function englishRoadmapQuestionCount(item) {
    if (item.mode === "ai") return 15;
    if (item.mode !== "course") return englishRoadmapPhase(item)?.questions?.length || 15;
    const courses = subjectInfo().stages || [];
    return item.courseIds.reduce((sum, id) => sum + (courses.find((course) => course.id === id)?.courseStages || []).reduce((stageSum, stage) => stageSum + (stage.questions?.length || 0), 0), 0);
  }

  function renderEnglishCourseHome() {
    const subject = subjectState("english");
    const completedRoadmapItems = englishCoreRoadmap.filter((item) => englishRoadmapItemComplete(item, subject)).length;
    const firstIncompleteRoadmapIndex = englishCoreRoadmap.findIndex((item) => !englishRoadmapItemComplete(item, subject));
    const currentRoadmapIndex = firstIncompleteRoadmapIndex >= 0 ? firstIncompleteRoadmapIndex : englishCoreRoadmap.length - 1;
    const currentRoadmapItem = englishCoreRoadmap[currentRoadmapIndex] || englishCoreRoadmap[0];
    const roadmapCourse = englishRoadmapCourse(currentRoadmapItem, subject);
    const roadmapCourseIndex = (subjectInfo().stages || []).findIndex((course) => course.id === roadmapCourse?.id);
    if (roadmapCourseIndex >= 0 && roadmapCourseIndex !== subject.stageIndex) {
      subject.stageIndex = roadmapCourseIndex;
      subject.selectedEnglishLevelId = roadmapCourse.levelId;
      subject.activeEnglishStageId = null;
      save();
    }
    const course = currentStage();
    const status = englishVocabularyStatus(course);
    const percent = status.cards.length ? Math.round((status.memorized.size / status.cards.length) * 100) : 0;
    const roadmapPercent = Math.round((completedRoadmapItems / englishCoreRoadmap.length) * 100);
    const courseComplete = completedRoadmapItems === englishCoreRoadmap.length;
    main.innerHTML = `<section class="english-roadmap-home">
      <div class="english-roadmap-top">
        <div class="english-roadmap-summary">
          <div><span>현재 과정</span><h2>${escapeHtml(course?.levelTitle || "영어 1단계")}</h2><p>${escapeHtml(currentRoadmapItem.title)} · 진도 ${completedRoadmapItems} / ${englishCoreRoadmap.length} · 단어 암기 ${percent}%</p><i><em style="width:${roadmapPercent}%"></em></i></div>
        </div>
        <div class="english-roadmap-companion"><img src="assets/profile-avatar-reading-cutout.png" alt="영어 학습을 돕는 공부 친구" /><button type="button" data-subject-action="open-english-roadmap-item" data-roadmap-index="${currentRoadmapIndex}">▣ 단어 학습</button></div>
      </div>
      ${subject.englishEliteRecommended ? '<button class="primary subject-primary" type="button" data-subject-action="start-english-elite-recommendation">English Elite에 도전해 보기</button>' : ''}
      <div class="english-roadmap-list english-course-roadmap">${englishCoreRoadmap.map((item, index) => {
        const complete = englishRoadmapItemComplete(item, subject);
        const current = !complete && index === currentRoadmapIndex;
        const unlocked = complete || current;
        const questionCount = englishRoadmapQuestionCount(item);
        const reward = Boolean(item.reward);
        return `<article class="${complete ? "is-complete" : current ? "is-current" : "is-locked"} ${reward ? "is-reward" : ""}">
          <i aria-hidden="true"></i><button type="button" data-subject-action="${unlocked ? "open-english-roadmap-item" : ""}" data-roadmap-index="${index}" ${unlocked ? "" : "disabled"}>
            <b>${reward ? "🎁" : index + 1}</b>
            <span><strong>${escapeHtml(item.title)}</strong><small>${complete ? `${questionCount} / ${questionCount}` : `0 / ${questionCount}`}</small></span><em>›</em>
          </button>
        </article>`;
      }).join("")}<article class="english-roadmap-finish ${courseComplete ? "is-complete" : "is-locked"}">
        <i aria-hidden="true"></i><button type="button" ${courseComplete ? 'data-subject-action="open-english-article-path"' : "disabled"}><b>${courseComplete ? "🏆" : "🔒"}</b><span><strong>영어 5단계 완료!</strong><small>${courseComplete ? "영자신문·TOEFL형 선택 학습에 도전할 수 있어요." : `${completedRoadmapItems} / ${englishCoreRoadmap.length} · 모든 단계를 완료하면 열려요.`}</small></span><em>›</em></button>
      </article></div>
      <div class="english-roadmap-streak"><b>⚡</b><span><strong>오늘도 영어 학습을 이어가세요!</strong><small>한 단계씩 꾸준히 완료해 보세요.</small></span></div>
    </section>`;
    actions.innerHTML = "";
  }

  function renderEnglishVocabulary() {
    const course = currentStage();
    const status = englishVocabularyStatus(course);
    if (!status.currentCard) {
      main.innerHTML = `<section class="subject-tree-summary science-paper-card"><span>단어장</span><h2>${escapeHtml(course.title)}</h2><p>이 과정에서 사용할 단어카드를 준비 중입니다.</p></section>`;
      actions.innerHTML = endTodayControl();
      return;
    }
    const card = status.currentCard;
    const remainingIndex = Math.max(0, status.remaining.findIndex((item) => item.cardId === card.cardId));
    const percent = status.cards.length ? Math.round((status.memorized.size / status.cards.length) * 100) : 0;
    main.innerHTML = `<article class="subject-intro-card science-learning-card science-paper-card english-vocabulary-card">
      ${paperDecorations()}
      <span>${escapeHtml(course.title)} · 단어카드 ${status.complete ? status.cards.length : remainingIndex + 1} / ${status.cards.length}</span>
      <div class="science-card-progress"><i style="width:${percent}%"></i></div><strong>암기율 ${percent}%</strong>
      <div class="english-word-picture" aria-hidden="true">${englishCardVisual(card.word)}</div>
      <h2>${escapeHtml(card.word)}</h2><b>${escapeHtml(card.meaning)}</b>${card.partOfSpeech && !/^핵심\s*(어휘|표현)$/.test(card.partOfSpeech) ? `<small class="english-part-of-speech">${escapeHtml(card.partOfSpeech)}</small>` : ""}
      <button class="english-speak-button" type="button" data-subject-action="play-english-vocabulary-word">🔊 발음 듣기</button>
      <section class="english-card-explanation"><strong>예문</strong><p>${escapeHtml(card.example)}</p><small>${escapeHtml(card.translation)}</small><button type="button" data-subject-action="play-english-vocabulary-example">🔊 예문 듣기</button></section>
      <button class="science-understood-open" type="button" data-subject-action="open-english-memorized">암기함 ${status.memorized.size}장</button>
    </article>`;
    actions.innerHTML = `<div class="subject-session-nav english-vocabulary-nav"><button type="button" data-subject-action="previous-english-vocabulary">이전</button><button type="button" data-subject-action="next-english-vocabulary">다음</button><button type="button" data-subject-action="memorize-english-vocabulary">${status.memorized.has(card.cardId) ? "암기 완료" : "암기함"}</button></div><button class="primary subject-primary science-quiz-start english-vocabulary-quiz-start" type="button" data-subject-action="start-english-course-quiz" ${status.complete ? "" : "disabled"}>${status.complete ? "단어 학습 완료 · 문제풀기" : `단어 ${status.remaining.length}개 암기 후 문제풀기`}</button>${endTodayControl()}`;
  }

  function renderEnglishWrongNote() {
    const subject = subjectState("english");
    const questionMap = new Map(allSubjectQuestions().map((question) => [question.id, question]));
    const wrongQuestions = subject.wrongQuestionIds.map((id) => questionMap.get(id)).filter(Boolean);
    main.innerHTML = `<article class="subject-intro-card subject-wrong-note">
      <span>영어 오답노트</span>
      <h2>틀린 문제 다시 보기</h2>
      ${wrongQuestions.length ? `<div>${wrongQuestions.map((question, index) => `<section><b>${index + 1}. ${escapeHtml(cleanEnglishQuestionPrompt(question))}</b><p>정답: ${escapeHtml(question.answer)}</p><small>${escapeHtml(question.explanation)}</small></section>`).join("")}</div>` : '<p class="subject-wrong-note-empty">아직 틀린 문제가 없어요.</p>'}
    </article>`;
    actions.innerHTML = endTodayControl();
  }

  function renderEnglishAiChat() {
    const subject = subjectState("english");
    const course = currentStage();
    const messages = subject.englishAiMessages || [];
    main.innerHTML = `<section class="science-understood-library english-ai-chat">
      <span>AI 학습 채팅</span><h2>${escapeHtml(course.title)}</h2>
      <p>현재 과정의 단어와 문법을 질문할 수 있어요.</p>
      <div class="english-ai-chat-messages">${messages.map((message) => `<article class="${message.role === "user" ? "is-user" : "is-ai"}"><b>${message.role === "user" ? "나" : "AI 학습 도우미"}</b><p>${escapeHtml(message.text)}</p></article>`).join("") || '<p class="english-ai-chat-empty">아래 빠른 질문을 누르거나 직접 입력해 보세요.</p>'}</div>
      <div class="english-ai-chat-quick"><button type="button" data-subject-action="ask-english-ai" data-ai-prompt="현재 문법을 쉽게 설명해줘">문법 설명</button><button type="button" data-subject-action="ask-english-ai" data-ai-prompt="배운 단어로 예문을 만들어줘">예문 만들기</button></div>
      <label class="english-ai-chat-input"><input id="englishAiChatInput" type="text" placeholder="궁금한 내용을 입력하세요" /><button type="button" data-subject-action="send-english-ai">보내기</button></label>
    </section>`;
    actions.innerHTML = endTodayControl();
  }

  function answerEnglishAi(prompt) {
    const course = currentStage();
    const grammarStage = (course.courseStages || []).find((stage) => stage.stageType === "grammar");
    const cards = englishVocabularyCards(course).slice(0, 5);
    if (/단어|예문/.test(prompt)) return cards.length
      ? cards.map((card) => `${card.word}: ${card.example}`).join(" / ")
      : "현재 과정의 단어카드를 먼저 확인해 주세요.";
    if (/문법|grammar/i.test(prompt)) {
      const sample = grammarStage?.questions?.find((question) => question.question)?.question || course.learningObjectives?.[0] || course.description;
      return `${grammarStage?.stageTitle || course.title}에서 ${cleanEnglishQuestionPrompt({ question: sample })} 형태를 연습해요.`;
    }
    return `${course.title} 과정에서는 ${course.learningObjectives?.join(" ") || course.description}`;
  }

  function openEnglishPhase(stageType) {
    const subject = subjectState("english");
    if (!englishVocabularyStatus(currentStage()).complete) {
      subject.mode = "english-vocabulary";
      subject.resumeMode = "english-vocabulary";
      save();
      alert("단어 학습을 먼저 완료해 주세요.");
      return render();
    }
    const target = (currentStage()?.courseStages || []).find((stage) => stage.stageType === stageType);
    if (!target) return alert(`${stageType === "grammar" ? "문법" : "독해"} 학습을 준비 중입니다.`);
    subject.activeEnglishStageId = target.stageId;
    setQueueForStage();
    subject.mode = "quiz";
    subject.resumeMode = "quiz";
    save();
    render();
  }

  function renderEnglishMemorized() {
    const course = currentStage();
    const status = englishVocabularyStatus(course);
    const savedCards = status.cards.filter((card) => status.memorized.has(card.cardId));
    main.innerHTML = `<section class="science-understood-library english-memorized-library"><span>암기함</span><h2>암기한 단어 ${savedCards.length}장</h2><p>다시 학습을 누르면 미암기 단어 목록으로 돌아갑니다.</p><div>${savedCards.map((card) => `<article><small>${escapeHtml(card.partOfSpeech)}</small><b>${escapeHtml(card.word)} · ${escapeHtml(card.meaning)}</b><p>${escapeHtml(card.example)}</p><em>${escapeHtml(card.translation)}</em><button type="button" data-subject-action="relearn-english-vocabulary" data-card-id="${escapeHtml(card.cardId)}">다시 학습</button></article>`).join("") || "<p>아직 암기함에 넣은 단어가 없어요.</p>"}</div></section>`;
    actions.innerHTML = `<button class="primary subject-primary science-repeat-learning" type="button" data-subject-action="back-english-vocabulary">남은 단어 학습</button>${endTodayControl()}`;
  }

  function startEnglishCourseQuiz() {
    const course = currentStage();
    const subject = subjectState("english");
    if (!englishVocabularyStatus(course).complete) {
      subject.mode = "english-vocabulary";
      subject.resumeMode = "english-vocabulary";
      save();
      alert("단어 학습을 먼저 완료해 주세요.");
      return render();
    }
    const stages = course.courseStages || [];
    const grammarIndex = Math.max(0, stages.findIndex((stage) => stage.stageType === "grammar"));
    stages.slice(0, grammarIndex).forEach((stage) => {
      if (!subject.completedEnglishStageIds.includes(stage.stageId)) subject.completedEnglishStageIds.push(stage.stageId);
    });
    const target = stages.slice(grammarIndex).find((stage) => !subject.completedEnglishStageIds.includes(stage.stageId)) || stages.at(-1);
    if (!target) return alert("이 과정의 문제를 준비 중입니다.");
    subject.activeEnglishStageId = target.stageId;
    setQueueForStage();
    subject.mode = "quiz";
    subject.resumeMode = "quiz";
    save();
    render();
  }

  function cleanEnglishQuestionPrompt(question) {
    const prompt = String(question?.question || "");
    return prompt
      .replace(/^.*?·\s*(?:(?:\d+번|문항\s*\d+|과제\s*\d+)\s*:\s*)/u, "")
      .replace(/^\d+번:\s*/, "")
      .replace(/\s*(?:빈칸에 알맞은.*|의 뜻을 고르세요\.|의 핵심 의미를 고르세요\.|Task\s*\d+\.?)$/u, "")
      .trim();
  }

  function renderHanjaCourseHome() {
    const subject = subjectState("hanja");
    const info = subjectInfo();
    const levels = info.levelOrder || [];
    const currentStageId = info.stages[subject.stageIndex]?.id;
    const currentLevelIndex = Math.max(0, levels.findIndex((level) => info.stages.some((stage) => stage.gradeLabel === level && stage.id === currentStageId)));
    const currentLevel = levels[currentLevelIndex] || levels[0] || "8급";
    const currentLevelStages = info.stages.filter((stage) => stage.gradeLabel === currentLevel);
    const completedCurrentSessions = currentLevelStages.filter((stage) => subject.completedStages.includes(stage.id)).length;
    const levelPercent = currentLevelStages.length ? Math.round((completedCurrentSessions / currentLevelStages.length) * 100) : 0;
    const completedLevels = levels.filter((level) => {
      const stages = info.stages.filter((stage) => stage.gradeLabel === level);
      return stages.length > 0 && stages.every((stage) => subject.completedStages.includes(stage.id));
    }).length;
    const allComplete = levels.length > 0 && completedLevels === levels.length;
    main.innerHTML = `<section class="english-roadmap-home hanja-roadmap-home">
      <div class="english-roadmap-top">
        <div class="english-roadmap-summary">
          <div><span>현재 급수</span><h2>${escapeHtml(currentLevel)} 한자</h2><p>진도 ${completedCurrentSessions} / ${currentLevelStages.length}회차 · 배정 한자 ${Number(info.levelCounts?.[currentLevel] || 0).toLocaleString()}자</p><i><em style="width:${levelPercent}%"></em></i></div>
        </div>
        <div class="english-roadmap-companion"><img src="assets/profile-avatar-hanja-cutout.png" alt="한자 학습을 돕는 한자왕 공부 친구" /><button type="button" data-subject-action="start-tree-stage">▣ 암기 학습</button></div>
      </div>
      <div class="english-roadmap-list english-course-roadmap hanja-course-roadmap">${levels.map((level, levelIndex) => {
        const stages = info.stages.filter((stage) => stage.gradeLabel === level);
        const completedSessions = stages.filter((stage) => subject.completedStages.includes(stage.id)).length;
        const complete = stages.length > 0 && completedSessions === stages.length;
        const current = levelIndex === currentLevelIndex && !complete;
        const available = complete || current;
        const targetStage = stages.find((stage) => !subject.completedStages.includes(stage.id)) || stages.at(-1);
        return `<article class="${complete ? "is-complete" : current ? "is-current" : "is-locked"}">
          <i aria-hidden="true"></i><button type="button" data-subject-action="${available ? "open-hanja-stage" : ""}" data-subject-stage="${targetStage?.id || ""}" ${available ? "" : "disabled"}>
            <b>${levelIndex + 1}</b><span><strong>${escapeHtml(level)}</strong><small>${complete ? `${stages.length} / ${stages.length}회차 완료` : current ? `${completedSessions} / ${stages.length}회차 · ${Number(info.levelCounts?.[level] || 0).toLocaleString()}자` : `${stages.length}회차 · 이전 급수 완료 후 열림`}</small></span><em>›</em>
          </button>
        </article>`;
      }).join("")}<article class="english-roadmap-finish ${allComplete ? "is-complete" : "is-locked"}"><i aria-hidden="true"></i><button type="button" disabled><b>${allComplete ? "🏆" : "🔒"}</b><span><strong>1급 한자 과정 완료!</strong><small>${completedLevels} / ${levels.length}급수 · 모든 급수를 완료하면 열려요.</small></span><em>›</em></button></article></div>
      <div class="english-roadmap-streak"><b>⚡</b><span><strong>오늘도 한자 학습을 이어가세요!</strong><small>한 회차씩 꾸준히 익혀 보세요.</small></span></div>
    </section>`;
    actions.innerHTML = "";
  }

  function renderLearningTree() {
    const subject = subjectState(activeSubject);
    if (activeSubject === "english" && subjectInfo().levelSummaries) {
      return renderEnglishCourseHome();
    }
    if (activeSubject === "hanja" && subjectInfo().levelOrder) {
      return renderHanjaCourseHome();
    }
    const steps = learningTreeSteps();
    const currentIndex = treeCurrentIndex(subject, steps);
    const current = steps[currentIndex] || steps[0];
    const scienceCards = currentStage()?.learningCards || [];
    const scienceUnderstood = scienceCards.filter((_, index) => subject.scienceUnderstood?.[currentStage()?.id]?.includes(index)).length;
    const scienceReady = activeSubject !== "science" || (scienceCards.length > 0 && scienceUnderstood === scienceCards.length);
    const action = activeSubject === "reading" ? "open-reading-books" : activeSubject === "science" ? "start-science-quiz" : "start-tree-stage";
    const label = activeSubject === "reading" ? "추천 도서 목록" : activeSubject === "science" ? "문제풀이" : "단원 학습";
    if (activeSubject === "science") {
      const stage = currentStage();
      const visual = scienceStageVisuals[stage?.visualKey] || scienceStageVisuals[stage?.id] || scienceStageVisuals.matter;
      main.innerHTML = `<section class="subject-tree-summary science-paper-card">
        ${paperDecorations()}
        <span>현재 학습</span>
        <h2>${escapeHtml(current?.title || subjectInfo().name)}</h2>
        <p>${escapeHtml(stage?.intro?.body || visual.description)}</p>
        ${scienceVisualMarkup(stage)}
        <img class="science-card-avatar" src="assets/profile-avatar-fresh-cutout.png" alt="과학 학습을 돕는 파란 공부 친구" />
      </section>`;
      actions.innerHTML = `<button class="primary subject-primary science-tree-quiz-start" type="button" data-subject-action="${scienceReady ? "start-science-quiz" : "open-science-cards"}">${scienceReady ? "단원학습 완료 · 문제풀이" : `단원학습 먼저 (${scienceUnderstood}/${scienceCards.length})`}</button>${endTodayControl()}`;
      return;
    }
    main.innerHTML = `<section class="subject-tree-summary">
      <span>현재 학습</span>
      <h2>${escapeHtml(current?.title || subjectInfo().name)}</h2>
      <p>${activeSubject === "science" ? `단원 학습카드 이해도 ${scienceCards.length ? Math.round((scienceUnderstood / scienceCards.length) * 100) : 0}% · 100%가 되면 문제풀이가 열려요.` : "상단 단계에서 현재 위치와 다음 학습을 확인할 수 있어요."}</p>
      <button class="subject-tree-start" type="button" data-subject-action="${action}" ${scienceReady ? "" : "disabled"}>${label}</button>
    </section>`;
    actions.innerHTML = endTodayControl();
    return;
    const allDone = subject.resumeMode === "complete";
    const wordGuide = activeSubject === "english"
      ? '<button class="subject-word-guide" type="button" data-subject-action="open-word-cards">단어 암기</button>'
      : "";
    main.innerHTML = `<section class="subject-path-card">
      ${wordGuide}
      <span>학습 경로</span>
      <h2>${escapeHtml(subjectInfo().name)} 학습 트리</h2>
      <p>현재 열려 있는 단계부터 시작해요. 한 단계를 완료하면 다음 단계가 열립니다.</p>
      <div class="subject-path-tree">
        ${steps.map((step, index) => {
          const complete = allDone || index < currentIndex || (activeSubject !== "reading" && subject.completedStages.includes(step.id));
          const current = !complete && index === currentIndex;
          const locked = !complete && !current;
          const mark = complete ? "✓" : locked ? "🔒" : "★";
          return `<div class="subject-path-node ${complete ? "is-complete" : current ? "is-current" : "is-locked"} ${index % 2 ? "is-right" : "is-left"}">
            <i aria-hidden="true"></i>
            <button type="button" data-subject-action="${current ? "start-tree-stage" : ""}" ${current ? "" : "disabled"}>
              <b>${mark}</b>
              <strong>${escapeHtml(step.title)}</strong>
              <small>${complete ? "완료" : current ? "시작" : step.subtitle}</small>
            </button>
          </div>`;
        }).join("")}
      </div>
    </section>`;
    actions.innerHTML = endTodayControl();
  }

  function setQueueForStage() {
    const subject = subjectState(activeSubject);
    const stage = currentStage();
    const learningStage = activeSubject === "english" && currentEnglishStage() ? currentEnglishStage() : stage;
    subject.reviewQueue = [];
    subject.queue = [...new Set([
      ...(learningStage.questions || []).map((item) => item.id),
      ...reviewQuestionsForStage().map((item) => item.id),
    ])];
    subject.mastered = [];
    subject.answer = "";
    subject.feedback = null;
    subject.explanationOpen = false;
    subject.previousQuestion = null;
    subject.questionHistory = [];
    subject.flashIndex = 0;
    subject.flashQueue = flashcardsForStage(stage);
    subject.flashExplanationOpen = false;
  }

  function sessionControls({ canGoNext = false, canExplain = false, showExplain = true, forceEnabled = false, explainLabel = "설명" } = {}) {
    const subject = subjectState(activeSubject);
    const canGoPrevious = forceEnabled || Boolean(subject.questionHistory?.length || subject.previousQuestion);
    return `<div class="subject-session-nav ${showExplain ? "" : "is-two-button"}">
      <button type="button" data-subject-action="previous-question" ${canGoPrevious ? "" : "disabled"}>이전</button>
      <button type="button" data-subject-action="next-session-question" ${canGoNext ? "" : "disabled"}>다음</button>
      ${showExplain ? `<button type="button" data-subject-action="show-explanation" ${canExplain ? "" : "disabled"}>${explainLabel}</button>` : ""}
    </div>`;
  }

  function endTodayControl() {
    return '<button class="subject-end-control" type="button" data-subject-action="end-today">여기까지</button>';
  }

  function questionActionControls({ checkAction, disabled = false } = {}) {
    return `<div class="subject-question-tools">
      <button class="secondary subject-answer" type="button" data-subject-action="${checkAction}" ${disabled ? "disabled" : ""}>정답</button>
      ${endTodayControl()}
    </div>`;
  }

  function scienceQuestionControls(subject) {
    const answered = Boolean(subject.feedback);
    const canGoPrevious = Boolean(subject.questionHistory?.length || subject.previousQuestion);
    return `<div class="subject-science-question-nav">
      <button type="button" data-subject-action="previous-question" ${canGoPrevious ? "" : "disabled"}>이전</button>
      <button type="button" data-subject-action="${answered ? "next-question" : "check-answer"}">다음</button>
      <button type="button" data-subject-action="science-hint-1">힌트 1</button>
      <button type="button" data-subject-action="science-hint-2" ${subject.scienceHintLevel >= 1 ? "" : "disabled"}>힌트 2</button>
    </div>${endTodayControl()}`;
  }

  function questionForCurrent() {
    const subject = subjectState(activeSubject);
    return allSubjectQuestions().find((item) => item.id === subject.queue[0]);
  }

  function renderFlashcards() {
    const subject = subjectState(activeSubject);
    const cards = subject.flashQueue || [];
    if (!cards.length) {
      subject.mode = "quiz";
      save();
      return render();
    }
    const card = cards[subject.flashIndex];
    if (activeSubject === "hanja") {
      const stage = currentStage();
      const explanationOpen = Boolean(subject.flashExplanationOpen);
      const isFirst = subject.flashIndex === 0;
      const isLast = subject.flashIndex === cards.length - 1;
      const matchingQuestion = (stage.questions || []).find((question) => String(question.question || "").includes(card.word));
      const memoryTip = matchingQuestion?.hint || matchingQuestion?.explanation || `${card.word}의 모양과 뜻을 함께 떠올려보세요.`;
      main.innerHTML = `<article class="subject-intro-card subject-flashcard subject-flashcard-hanja">
        <span>${escapeHtml(stage.title)} · 한자 카드 ${subject.flashIndex + 1} / ${cards.length}</span>
        <section class="hanja-single-card">
          ${paperDecorations()}
          <span class="hanja-card-label">암기 학습</span>
          <div class="hanja-card-heading"><strong>${escapeHtml(card.word)}</strong><b>${escapeHtml(card.meaning)}</b></div>
          <div class="hanja-single-picture" aria-hidden="true">${hanjaCardVisuals[card.word] || "✦"}</div>
          <p class="hanja-memory-tip">${escapeHtml(memoryTip)}</p>
          <img class="hanja-card-avatar" src="assets/profile-avatar-hanja-cutout.png" alt="한자 학습을 돕는 한자왕 공부 친구" />
        </section>
        <section class="hanja-card-explanation" ${explanationOpen ? "" : "hidden"}>
          <strong>활용 예시</strong>
          <p>${escapeHtml(card.example)}</p>
          <small>${escapeHtml(card.note || `${card.word}의 모양과 뜻을 함께 떠올려보세요.`)}</small>
        </section>
      </article>`;
      actions.innerHTML = `<div class="subject-session-nav">
        <button type="button" data-subject-action="previous-flashcard" ${isFirst ? "disabled" : ""}>이전</button>
        <button type="button" data-subject-action="next-flashcard">${isLast ? "암기 확인" : "다음"}</button>
        <button type="button" data-subject-action="toggle-flashcard-explanation">${explanationOpen ? "설명 닫기" : "설명"}</button>
      </div><button class="secondary subject-hint" type="button" data-subject-action="flashcard-again">다시 보기</button><button class="primary subject-primary" type="button" data-subject-action="flashcard-known">${isLast ? "문제풀기 시작" : "기억했어요"}</button>${endTodayControl()}`;
      return;
    }
    if (activeSubject === "english") {
      const explanationOpen = Boolean(subject.flashExplanationOpen);
      const isFirst = subject.flashIndex === 0;
      const isLast = subject.flashIndex === cards.length - 1;
      main.innerHTML = `<article class="subject-intro-card subject-flashcard subject-flashcard-english">
        <span>단어 암기 카드 ${subject.flashIndex + 1} / ${cards.length}</span>
        <section class="english-word-card">
          ${paperDecorations()}
          <span class="english-card-label">오늘의 단어</span>
          <strong>${escapeHtml(card.word)}</strong>
          <button class="english-speak-button" type="button" data-subject-action="play-flashcard-word" aria-label="${escapeHtml(card.word)} 발음 듣기"><span aria-hidden="true">🔊</span> 발음 듣기</button>
          <b>${escapeHtml(card.meaning)}</b>
          <div class="english-word-picture" aria-hidden="true">${englishWordVisuals[String(card.word).toLowerCase()] || "📘"}</div>
          <p>단어를 소리 내어 읽고 뜻을 함께 기억해 보세요.</p>
          <img class="english-card-avatar" src="assets/profile-avatar-reading-cutout.png" alt="영어 단어 학습을 돕는 독서 공부 친구" />
        </section>
        <section class="english-card-explanation" ${explanationOpen ? "" : "hidden"}>
          <strong>예문</strong>
          <p>${escapeHtml(card.example)}</p>
          <button type="button" data-subject-action="play-flashcard-example"><span aria-hidden="true">🔊</span> 예문 듣기</button>
        </section>
      </article>`;
      actions.innerHTML = `<div class="subject-session-nav">
        <button type="button" data-subject-action="previous-flashcard" ${isFirst ? "disabled" : ""}>이전</button>
        <button type="button" data-subject-action="next-flashcard">${isLast ? "암기 확인" : "다음"}</button>
        <button type="button" data-subject-action="toggle-flashcard-explanation">${explanationOpen ? "설명 닫기" : "설명"}</button>
      </div><button class="secondary subject-hint" type="button" data-subject-action="flashcard-again">다시 보기</button><button class="primary subject-primary" type="button" data-subject-action="flashcard-known">${isLast ? "암기 확인 시작" : "기억했어요"}</button>${endTodayControl()}`;
      return;
    }
    main.innerHTML = `<article class="subject-intro-card subject-flashcard">
      <span>단어 암기 카드 ${subject.flashIndex + 1} / ${cards.length}</span>
      <strong>${escapeHtml(card.word)}</strong>
      <b>${escapeHtml(card.meaning)}</b>
      <p>${escapeHtml(card.example)}</p>
      <small>${escapeHtml(card.note || "소리 내어 읽고 예문을 내 문장으로 바꿔 보세요.")}</small>
    </article>`;
    actions.innerHTML = `${sessionControls()}<button class="secondary subject-hint" type="button" data-subject-action="flashcard-again">다시 보기</button><button class="primary subject-primary" type="button" data-subject-action="flashcard-known">${subject.flashIndex === cards.length - 1 ? "암기 확인 시작" : "기억했어요"}</button>${endTodayControl()}`;
  }

  function renderIntro() {
    const stage = currentStage();
    if (activeSubject === "hanja") {
      setQueueForStage();
      subjectState(activeSubject).mode = stage.isCumulativeTest ? "quiz" : "flashcards";
      save();
      return stage.isCumulativeTest ? renderQuestion() : renderFlashcards();
    }
    const englishStage = currentEnglishStage();
    const introTitle = englishStage?.stageTitle || stage.intro.title;
    const introBody = englishStage?.learningObjective || stage.intro.body;
    const introExample = englishStage
      ? `${englishStage.stageType} · 예상 ${englishStage.estimatedMinutes}분 · 목표 ${englishStage.questionCountTarget}문항`
      : stage.intro.example;
    main.innerHTML = `
      <article class="subject-intro-card">
        <span>개념 알아보기</span>
        <h2>${escapeHtml(introTitle)}</h2>
        <p>${escapeHtml(introBody)}</p>
        <div class="subject-formula">${escapeHtml(introExample)}</div>
        <small>이 단계의 문제를 모두 맞히면 다음 단계가 열립니다.</small>
      </article>`;
    const contentPending = activeSubject === "english" && !(englishStage?.questions || []).length;
    actions.innerHTML = `${sessionControls()}<button class="primary subject-primary" type="button" data-subject-action="start-stage" ${contentPending ? "disabled" : ""}>${contentPending ? "문제 콘텐츠 준비 중" : "문제 풀기"}</button>${endTodayControl()}`;
  }

  function renderScienceCards() {
    const subject = subjectState(activeSubject);
    const stage = currentStage();
    const cards = stage?.learningCards || [];
    if (!cards.length) {
      subject.mode = "intro";
      save();
      return renderIntro();
    }
    const understood = subject.scienceUnderstood[stage.id] || [];
    const remainingIndexes = cards.map((_, cardIndex) => cardIndex).filter((cardIndex) => !understood.includes(cardIndex));
    const index = remainingIndexes.includes(subject.scienceCardIndex) ? subject.scienceCardIndex : (remainingIndexes[0] ?? 0);
    subject.scienceCardIndex = index;
    const card = cards[index];
    const percent = Math.round((understood.length / cards.length) * 100);
    const isUnderstood = understood.includes(index);
    main.innerHTML = `<article class="subject-intro-card science-learning-card science-paper-card">
      ${paperDecorations()}
      <span>${escapeHtml(stage.title)} · 학습카드 ${index + 1} / ${cards.length}</span>
      <div class="science-card-progress"><i style="width:${percent}%"></i></div>
      <strong>이해도 ${percent}%</strong>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(card.body)}</p>
      ${scienceVisualMarkup(stage, card)}
      <div class="subject-formula science-card-example">${escapeHtml(card.example)}</div>
      <img class="science-card-avatar" src="assets/profile-avatar-fresh-cutout.png" alt="과학 학습을 돕는 파란 공부 친구" />
      <small>내용을 충분히 이해한 뒤 버튼을 눌러주세요.</small>
      <button class="science-understood-open" type="button" data-subject-action="open-science-understood">이해함 보관함 ${understood.length}장</button>
    </article>`;
    const scienceReady = understood.length === cards.length;
    actions.innerHTML = `<div class="subject-session-nav">
      <button type="button" data-subject-action="previous-science-card">이전</button>
      <button type="button" data-subject-action="next-science-card">다음</button>
      <button type="button" data-subject-action="understand-science-card">${isUnderstood ? "이해 완료" : "이해함"}</button>
    </div><button class="primary subject-primary science-quiz-start" type="button" data-subject-action="start-science-quiz" ${scienceReady ? "" : "disabled"}>${scienceReady ? "단원학습 완료 · 문제풀기" : `학습카드 ${cards.length - understood.length}장 완료 후 문제풀기`}</button>${endTodayControl()}`;
  }

  function renderScienceUnderstood() {
    const subject = subjectState(activeSubject);
    const stages = subjectInfo().stages || [];
    const savedCards = stages.flatMap((stage) => {
      const understood = subject.scienceUnderstood[stage.id] || [];
      return (stage.learningCards || []).map((card, index) => ({ stage, card, index })).filter(({ index }) => understood.includes(index));
    });
    main.innerHTML = `<section class="science-understood-library">
      <span>이해함 보관함</span>
      <h2>이해한 학습카드 ${savedCards.length}장</h2>
      <p>지금까지 이해함에 넣은 카드가 계속 보관됩니다.</p>
      <div>${savedCards.map(({ stage, card }) => `<article><small>${escapeHtml(stage.title)}</small><b>${escapeHtml(card.title)}</b><p>${escapeHtml(card.body)}</p><em>${escapeHtml(card.example)}</em></article>`).join("") || "<p>아직 이해함에 넣은 카드가 없어요.</p>"}</div>
    </section>`;
    actions.innerHTML = `<button class="primary subject-primary science-repeat-learning" type="button" data-subject-action="back-science-learning">남은 카드 반복학습</button>${endTodayControl()}`;
  }

  function renderScienceWrongNote() {
    const subject = subjectState(activeSubject);
    const questionMap = new Map(allSubjectQuestions().map((question) => [question.id, question]));
    const wrongQuestions = subject.wrongQuestionIds.map((id) => questionMap.get(id)).filter(Boolean);
    main.innerHTML = `<article class="subject-intro-card subject-wrong-note">
      <span>과학 오답노트</span>
      <h2>틀린 문제 다시 보기</h2>
      ${wrongQuestions.length ? `<div>${wrongQuestions.map((question, index) => `<section><b>${index + 1}. ${escapeHtml(question.question)}</b><p>정답: ${escapeHtml(question.answer)}</p><small>${escapeHtml(question.explanation)}</small></section>`).join("")}</div>` : '<p class="subject-wrong-note-empty">아직 틀린 문제가 없어요.</p>'}
    </article>`;
    actions.innerHTML = endTodayControl();
  }

  function renderStructuredEnglishQuestion(question, subject) {
    const model = window.STUDY_ENGLISH_LEARNING;
    const ui = window.STUDY_ENGLISH_UI;
    if (!model || !ui) return false;
    const normalizedQuestion = model.normalizeQuestion(question, {
      levelId: currentStage()?.levelId,
      courseId: currentStage()?.id,
      stageId: subject.activeEnglishStageId,
    });
    return ui.render({
      question: normalizedQuestion,
      main,
      actions,
      response: subject.answer,
      feedback: subject.feedback,
      onChange(value) {
        subject.answer = value;
      },
      onHint() {
        alert(normalizedQuestion.explanation || "문장의 핵심 단어와 앞뒤 흐름을 다시 확인해 보세요.");
      },
      onSubmit(response) {
        const userId = currentUser();
        const result = model.createQuestionResult({
          userId,
          question: normalizedQuestion,
          selectedAnswer: response,
          responseTime: 0,
        });
        subject.answer = ui.serializeResponse(response);
        subject.feedback = { correct: result.correct, errorTags: result.errorTags };
        subject.explanationOpen = true;
        subject.explanationQuestionId = question.id;
        if (result.correct) {
          if (!subject.mastered.includes(question.id)) subject.mastered.push(question.id);
          subject.xp += 10;
          subject.coins += 4;
          if (subject.englishRemediationState && window.STUDY_ENGLISH_REMEDIATION) {
            const remediation = window.STUDY_ENGLISH_REMEDIATION.recordRemediationAnswer(subject.englishRemediationState, question, true);
            subject.englishRemediationState = remediation.state;
          }
        } else {
          if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
          const remediationApi = window.STUDY_ENGLISH_REMEDIATION;
          if (remediationApi) {
            const remediation = remediationApi.recordEnglishError(subject.englishRemediationState, {
              problemId: question.id,
              misconceptionTag: result.errorTags?.[0] || "UNCLASSIFIED_ERROR",
              position: subject.queue.indexOf(question.id),
            }, allSubjectQuestions());
            subject.englishRemediationState = remediation.state;
            const remedialIds = (remediation.problems || [remediation.problem]).filter(Boolean).map((item) => item.id || item.problemId);
            remedialIds.forEach((id) => {
              if (id && id !== question.id && !subject.reviewQueue.includes(id)) subject.reviewQueue.push(id);
            });
          }
        }
        const legacy = {
          completedStages: subject.completedStages,
          completedEnglishStageIds: subject.completedEnglishStageIds,
        };
        const learningState = model.loadState(localStorage, userId, legacy);
        const recorded = model.recordQuestionAttempt(learningState, {
          userId,
          question: normalizedQuestion,
          selectedAnswer: response,
          responseTime: 0,
        });
        model.saveState(localStorage, userId, recorded.state, window.STUDY_CLOUD_AUTH);
        subject.lastUpdatedAt = new Date().toISOString();
        reportActivity(result.correct);
        save();
        render();
      },
      onNext() {
        subject.queue.shift();
        subject.answer = "";
        subject.feedback = null;
        subject.explanationOpen = false;
        subject.explanationQuestionId = null;
        if (!subject.queue.length && subject.reviewQueue.length) {
          subject.queue = [...subject.reviewQueue];
          subject.reviewQueue = [];
        }
        save();
        render();
      },
    });
  }

  function renderQuestion() {
    const subject = subjectState(activeSubject);
    const question = questionForCurrent();
    if (!question) return completeStage();
    if (question.type === "journal") return renderJournalQuestion(question, subject);
    if (activeSubject === "english" && renderStructuredEnglishQuestion(question, subject)) return;
    const feedback = subject.feedback;
    const passage = question.passage ? `<section class="subject-passage">${activeSubject === "english" ? "" : "<b>Reading passage</b>"}<p>${escapeHtml(question.passage)}</p></section>` : "";
    const englishBlankPicture = activeSubject === "english" && /_+/.test(question.question) && question.vocabularyWord
      ? `<div class="english-word-picture english-question-picture" aria-label="빈칸 단어 그림">${englishCardVisual(question.vocabularyWord)}</div>`
      : "";
    const answerLabel = question.type === "speaking" ? "말한 문장을 직접 입력하거나 말하기 버튼을 누르세요" : "빈칸에 들어갈 답을 영어로 입력하세요";
    const freeResponse = question.userInputRequired || question.recordingRequired;
    const responseGuide = freeResponse ? `<section class="subject-passage"><b>${question.recordingRequired ? "Speaking practice" : "Writing practice"}</b><p>${question.recordingRequired ? `준비 ${question.preparationSeconds}초 · 답변 ${question.responseSeconds}초 · 현재 자동 녹음·채점 없이 연습 답안을 저장합니다.` : `목표 ${question.minimumWordTarget}-${question.maximumWordTarget}단어 · 자동 채점 없이 체크리스트로 자기평가합니다.`}</p>${question.readingPassage ? `<p><strong>Reading</strong><br>${escapeHtml(question.readingPassage)}</p>` : ""}${question.listeningTranscript ? `<p><strong>Listening</strong><br>${escapeHtml(question.listeningTranscript)}</p>` : ""}${question.requiredPoints?.length ? `<p><strong>Required points</strong><br>${question.requiredPoints.map(escapeHtml).join(" · ")}</p>` : ""}${question.sampleResponse ? `<details><summary>예시 답안과 자기평가 기준</summary><p>${escapeHtml(question.sampleResponse)}</p><p>${Object.entries(question.scoringRubric || {}).map(([key, value]) => `${escapeHtml(key)}: ${escapeHtml(value)}`).join("<br>")}</p></details>` : ""}</section>` : "";
    const choices = freeResponse ? `${responseGuide}<label class="subject-answer-input"><span>${question.recordingRequired ? "말하기 답안 또는 연습 메모를 입력하세요." : "작성 답안을 입력하세요."}</span><textarea id="subjectLongAnswer" autocomplete="off" autocapitalize="sentences" spellcheck="true">${escapeHtml(subject.answer)}</textarea></label>` : question.choices ? `<div class="subject-choice-list">${question.choices.map((choice) => `<button type="button" class="${subject.answer === choice ? "is-selected" : ""}" data-subject-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join("")}</div>` : `<label class="subject-answer-input"><span>${answerLabel}</span><input id="subjectShortAnswer" value="${escapeHtml(subject.answer)}" autocomplete="off" autocapitalize="none" spellcheck="false" /></label>`;
    const learningCard = activeSubject === "science" ? scienceLearningCardForQuestion(question) : null;
    const englishVocabularyCard = activeSubject === "english"
      ? englishVocabularyCards(currentStage()).find((card) => card.word.toLowerCase() === String(question.vocabularyWord || "").toLowerCase())
      : null;
    const usefulEnglishHint = activeSubject === "english" && question.hint && !/학습 목표를 확인/.test(question.hint) ? question.hint : "";
    const englishHint = activeSubject === "english" && subject.explanationOpen && subject.explanationQuestionId === question.id
      ? usefulEnglishHint
        ? `<section class="subject-inline-explanation english-question-hint"><span>힌트</span><p>${escapeHtml(usefulEnglishHint)}</p></section>`
        : englishVocabularyCard
          ? `<section class="subject-inline-explanation english-question-hint english-hint-word-card"><span>단어카드</span><div class="english-word-picture" aria-hidden="true">${englishCardVisual(englishVocabularyCard.word)}</div><b>${escapeHtml(englishVocabularyCard.word)}</b><p>${escapeHtml(englishVocabularyCard.meaning)}</p><small>${escapeHtml(englishVocabularyCard.example)}</small></section>`
          : `<section class="subject-inline-explanation english-question-hint"><span>힌트</span><p>그림과 문장의 빈칸 앞뒤를 차례대로 살펴보세요.</p></section>`
      : "";
    const explanation = activeSubject !== "english" && !(activeSubject === "hanja" && feedback?.correct) && subject.explanationOpen && subject.explanationQuestionId === question.id
      ? activeSubject === "science" && !feedback
        ? `<section class="subject-inline-explanation"><span>힌트 ${subject.scienceHintLevel >= 2 ? "2" : "1"}</span><p>${escapeHtml(subject.scienceHintLevel >= 2 ? question.explanation : question.hint || "학습 카드의 핵심 개념을 다시 떠올려 보세요.")}</p></section>`
        : `<section class="subject-inline-explanation">
          <span>문제 설명</span>
          <b>정답: ${escapeHtml(question.answer)}</b>
          <p>${escapeHtml(question.explanation)}</p>
          ${learningCard ? `<div><small>${escapeHtml(currentStage().title)} 단원 학습내용</small><strong>${escapeHtml(learningCard.title)}</strong><p>${escapeHtml(learningCard.body)}</p><em>${escapeHtml(learningCard.example)}</em></div>` : ""}
        </section>`
      : "";
    main.innerHTML = `
      <article class="subject-question-card ${feedback ? (feedback.correct ? "is-correct" : "is-wrong") : ""}">
        <span class="subject-question-number">Q${subject.mastered.length + 1}</span>
        ${passage}
        ${englishBlankPicture}
        <h2>${escapeHtml(activeSubject === "english" ? cleanEnglishQuestionPrompt(question) : question.question)}</h2>
        ${question.audioText ? `<button class="english-speak-button" type="button" data-subject-action="play-audio">🔊 ${question.mediaRequired === "speechSynthesis" ? "기기 음성으로 듣기" : "음성 듣기"}</button>` : ""}
        ${question.segments?.length ? `<div>${question.segments.map((segment, index) => `<button class="english-speak-button" type="button" data-subject-action="play-audio-segment" data-segment-index="${index}">구간 ${index + 1} 듣기</button>`).join("")}</div>` : ""}
        ${choices}
        ${feedback && activeSubject !== "english" && !(activeSubject === "hanja" && feedback.correct) ? `<section class="subject-feedback"><b>${feedback.correct ? "정답이에요!" : "틀렸어요. 정답을 확인한 뒤 다음으로 넘어가세요."}</b><p>${escapeHtml(question.explanation)}</p>${!feedback.correct ? `<small>정답: ${escapeHtml(question.answer)}</small>` : ""}</section>` : ""}
        ${englishHint}
        ${explanation}
      </article>`;
    actions.innerHTML = activeSubject === "science"
      ? scienceQuestionControls(subject)
      : activeSubject === "english"
        ? `${sessionControls({ canGoNext: true, canExplain: true, forceEnabled: true, explainLabel: "힌트" })}<div class="subject-question-tools english-end-only">${endTodayControl()}</div>`
        : activeSubject === "hanja"
          ? `${sessionControls({ canGoNext: Boolean(feedback || subject.answer), canExplain: true })}${questionActionControls({ checkAction: "check-answer", disabled: Boolean(feedback) })}`
          : `${sessionControls({ canGoNext: Boolean(feedback), canExplain: true })}${questionActionControls({ checkAction: "check-answer", disabled: Boolean(feedback) })}`;
  }

  function scienceLearningCardForQuestion(question) {
    const stage = currentStage();
    const number = Number(String(question.id).split("-").at(-1));
    const cardMap = stage?.id === "matter"
      ? [1, 2, 0, 7, 3, 4, 5, 9, 10, 8, 16, 17, 18, 19, 13, 15, 20, 23, 24, 12]
      : [0, 3, 10, 0, 24, 5, 7, 8, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 10, 11];
    return stage?.learningCards?.[cardMap[number - 1] ?? 0] || stage?.learningCards?.[0] || null;
  }

  function renderJournalQuestion(question, subject) {
    const feedback = subject.feedback;
    const passage = question.passage ? `<section class="subject-passage"><b>Reading time</b><p>${escapeHtml(question.passage)}</p></section>` : "";
    main.innerHTML = `<article class="subject-question-card ${feedback ? (feedback.correct ? "is-correct" : "is-wrong") : ""}">
      <span class="subject-question-number">English journal</span>
      ${passage}
      <h2>${escapeHtml(question.question)}</h2>
      <label class="subject-answer-input"><span>영어로 ${question.minimumWords || 35}단어 이상 적어 보세요.</span><textarea id="subjectJournalAnswer" autocomplete="off" autocapitalize="sentences" spellcheck="true">${escapeHtml(subject.answer)}</textarea></label>
      ${feedback ? `<section class="subject-feedback"><b>${feedback.correct ? "좋아요. 영어로 생각한 내용을 남겼어요." : "조금 더 길게, 영어 문장으로 적어 보세요."}</b><p>${escapeHtml(question.explanation)}</p></section>` : ""}
    </article>`;
    actions.innerHTML = `${sessionControls({ canGoNext: Boolean(feedback), canExplain: true })}${questionActionControls({ checkAction: "check-answer", disabled: Boolean(feedback) })}`;
  }

  function renderBooks() {
    const info = subjectInfo();
    const grade = currentLearningGrade();
    const subject = subjectState(activeSubject);
    const books = info.books.filter((book) => book.englishChallenge || (book.grades || []).includes(grade));
    const koreanBooks = books.filter((book) => !book.englishChallenge);
    const originalBooks = books.filter((book) => book.englishChallenge);
    const bookList = (items) => items.map((book) => `<button type="button" data-book-id="${book.id}"><b>${book.title}</b><span>${book.author} · ${book.language} · ${book.days || 2}일 완독</span><small>${(book.tags || []).join(" · ")}</small><em>선택</em></button>`).join("");
    const baseCatalog = Array.isArray(window.STUDY_READING_RECOMMENDATIONS) ? window.STUDY_READING_RECOMMENDATIONS : [];
    const koreanCatalog = Array.isArray(window.STUDY_READING_KOREAN_RECOMMENDATIONS) ? window.STUDY_READING_KOREAN_RECOMMENDATIONS : [];
    const catalog = [...koreanCatalog, ...baseCatalog];
    const gradeMap = { "초등 4학년": "초4", "초등 5학년": "초5", "초등 6학년": "초6", "중등 1학년": "중1", "중등 2학년": "중2", "중등 3학년": "중3", "고등 1학년": "고1", "고등 2학년": "고2", "고등 3학년": "고3" };
    const catalogGrades = ["초4", "초5", "초6", "중1", "중2", "중3", "고1", "고2", "고3"];
    const selectedGrade = catalogGrades.includes(subject.readingCatalogGrade) ? subject.readingCatalogGrade : (gradeMap[grade] || "초4");
    subject.readingCatalogGrade = selectedGrade;
    const perPage = 10;
    const gradeBooks = catalog
      .filter((book) => book.primaryGrade === selectedGrade)
      .sort((a, b) => Number(b.language === "한국어") - Number(a.language === "한국어"));
    const pageCount = Math.max(1, Math.ceil(gradeBooks.length / perPage));
    const page = Math.min(Math.max(Number(subject.readingCatalogPage) || 1, 1), pageCount);
    subject.readingCatalogPage = page;
    const catalogCards = gradeBooks.slice((page - 1) * perPage, page * perPage).map((book) => `<article class="reading-catalog-card">
      <div><b>${escapeHtml(book.title)}</b><span>${escapeHtml(book.author)}</span></div>
      <small>${escapeHtml(book.category)} · ${escapeHtml(book.genre)} · 난이도 ${Number(book.difficulty) || 1}</small>
      <em>${escapeHtml((book.themes || []).slice(0, 3).join(" · "))}</em>
      <p>예상 ${Number(book.estimatedReadingMinutes) || 0}분 · ${book.language === "한국어" ? "한국어" : (book.editionType === "일반판" ? "판본 확인" : escapeHtml(book.editionType))}</p>
    </article>`).join("");
    const gradeButtons = catalogGrades.map((item) => `<button type="button" class="${item === selectedGrade ? "is-active" : ""}" data-reading-catalog-grade="${item}">${item}</button>`).join("");
    const pager = `<div class="reading-catalog-pager"><button type="button" data-reading-catalog-page="${page - 1}" ${page <= 1 ? "disabled" : ""}>이전</button><span>${page} / ${pageCount}</span><button type="button" data-reading-catalog-page="${page + 1}" ${page >= pageCount ? "disabled" : ""}>다음</button></div>`;
    main.innerHTML = `<section class="reading-book-list"><h2>${escapeHtml(grade)} 추천 독서</h2><p>퀴즈가 준비된 책을 먼저 읽고 이해 문제와 독후감으로 넘어가요. 책 전문은 도서관 대출·구매·합법 전자책으로 읽어 주세요.</p><h3>퀴즈가 준비된 추천도서</h3>${bookList(koreanBooks) || "<p>이 학년용 퀴즈 도서를 준비 중입니다.</p>"}<h3>영어 원서 도전</h3><p class="reading-original-note">영어 실력에 따라 학년과 관계없이 선택할 수 있어요.</p>${bookList(originalBooks)}<section class="reading-catalog"><h3>학년별 추천도서 ${catalog.length}권</h3><p>한국어 도서를 먼저 보여 주고, 다음 페이지부터 외국어 원서를 함께 탐색할 수 있어요.</p><div class="reading-catalog-grades">${gradeButtons}</div><div class="reading-catalog-grid">${catalogCards || "<p>추천도서를 준비 중입니다.</p>"}</div>${pager}</section></section>`;
    const gradeScroller = main.querySelector(".reading-catalog-grades");
    const activeGradeButton = gradeScroller?.querySelector(".is-active");
    if (gradeScroller && activeGradeButton) {
      gradeScroller.scrollLeft = Math.max(0, activeGradeButton.offsetLeft - (gradeScroller.clientWidth - activeGradeButton.offsetWidth) / 2);
      gradeScroller.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        gradeScroller.scrollLeft += event.deltaY;
      }, { passive: false });
    }
    actions.innerHTML = `${sessionControls()}${endTodayControl()}`;
  }

  function selectedBook() {
    const subject = subjectState(activeSubject);
    const book = subjectInfo().books.find((item) => item.id === subject.selectedBookId) || subjectInfo().books[0];
    if (book && subject.selectedBookId !== book.id) subject.selectedBookId = book.id;
    return book;
  }

  function renderBookSummary() {
    const book = selectedBook();
    main.innerHTML = `<article class="subject-intro-card reading-summary"><span>추천 도서 · ${escapeHtml(book.language)}</span><h2>${book.title}</h2><p>${book.summary}</p><small>책을 끝까지 읽은 뒤에만 이해 퀴즈를 시작해 주세요. 줄거리 몇 줄만 읽고 푸는 방식이 아닙니다.</small>${book.sourceUrl ? `<a class="reading-source-link" href="${book.sourceUrl}" target="_blank" rel="noreferrer">합법 전자책으로 읽기</a>` : ""}</article>`;
    actions.innerHTML = `${sessionControls()}<button class="primary subject-primary" type="button" data-subject-action="start-reading-quiz">책을 읽었어요 · 이해 퀴즈</button>${endTodayControl()}`;
  }

  function readingQuestion() {
    const subject = subjectState(activeSubject);
    const book = selectedBook();
    return book.questions.find((item) => item.id === subject.queue[0]);
  }

  function renderReadingQuestion() {
    const subject = subjectState(activeSubject);
    const question = readingQuestion();
    if (!question) return startReflection();
    const feedback = subject.feedback;
    const written = !question.choices?.length;
    const answerArea = written
      ? `<label class="subject-answer-input"><span>책의 내용에 근거해 3문장 이상으로 써 보세요.</span><textarea id="readingWrittenAnswer">${escapeHtml(subject.answer)}</textarea></label>`
      : `<div class="subject-choice-list">${question.choices.map((choice) => `<button type="button" class="${subject.answer === choice ? "is-selected" : ""}" data-reading-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join("")}</div>`;
    main.innerHTML = `<article class="subject-question-card ${feedback ? (feedback.correct ? "is-correct" : "is-wrong") : ""}"><span class="subject-question-number">이해 Q${subject.mastered.length + 1}</span><h2>${question.question}</h2>${answerArea}${feedback ? `<section class="subject-feedback"><b>${feedback.correct ? "정답이에요!" : "정답을 확인하고 다시 생각해봐요."}</b><p>${question.explanation}</p>${!feedback.correct && !written ? `<small>정답: ${question.answer}</small>` : ""}</section>` : ""}</article>`;
    actions.innerHTML = `${sessionControls({ canGoNext: Boolean(feedback), canExplain: true })}${questionActionControls({ checkAction: "check-reading-answer", disabled: Boolean(feedback) })}`;
  }

  const reflectionPrompts = [
    "가장 기억에 남는 장면은 무엇인가요? 그 까닭도 적어보세요.",
    "주인공에게 한마디를 해 준다면 무엇이라고 말하고 싶나요?",
    "이 이야기와 내 경험 또는 주변의 모습이 닮은 점은 무엇인가요?",
    "이 책을 읽고 새롭게 생각하거나 실천하고 싶은 것은 무엇인가요?",
  ];

  function renderReflection() {
    const subject = subjectState(activeSubject);
    const index = subject.reflectionIndex;
    main.innerHTML = `<article class="subject-reflection-card"><span>생각 나누기 ${index + 1} / ${reflectionPrompts.length}</span><h2>${reflectionPrompts[index]}</h2><textarea id="readingReflectionAnswer" placeholder="정답은 없어요. 내 생각을 편하게 적어보세요.">${escapeHtml(subject.reflection[index])}</textarea><small>적은 내용은 마지막 독후감 초안에 자연스럽게 담겨요.</small></article>`;
    actions.innerHTML = `${sessionControls()}<button class="primary subject-primary" type="button" data-subject-action="next-reflection">${index === reflectionPrompts.length - 1 ? "독후감 만들기" : "다음 질문"}</button>${endTodayControl()}`;
  }

  function makeReport() {
    const subject = subjectState(activeSubject);
    const book = selectedBook();
    const [scene, message, connection, learning] = subject.reflection.map((value) => value.trim() || "아직 생각을 정리하는 중이다.");
    return `${book.title}을 읽고\n\n가장 기억에 남는 장면은 ${scene}\n\n나는 주인공에게 '${message}'라고 말해 주고 싶다. 이 이야기와 내 경험을 연결해 보면 ${connection}\n\n이 책을 읽으며 ${learning}\n\n그래서 이 책은 작은 행동과 생각이 나와 주변을 바꿀 수 있다는 점을 알려 주었다.`;
  }

  function renderReport() {
    const subject = subjectState(activeSubject);
    if (!subject.report) subject.report = makeReport();
    main.innerHTML = `<article class="subject-report-card"><span>나의 독후감 초안</span><h2>${selectedBook().title}</h2><p>아래 글은 내가 답한 생각을 바탕으로 만든 초안이에요. 원하는 말로 자유롭게 고쳐보세요.</p><textarea id="readingReport" aria-label="독후감">${escapeHtml(subject.report)}</textarea></article>`;
    actions.innerHTML = `${sessionControls()}<button class="secondary subject-hint" type="button" data-subject-action="back-reflection">생각 다시 쓰기</button><button class="primary subject-primary" type="button" data-subject-action="save-report">독후감 저장</button>${endTodayControl()}`;
  }

  function renderComplete() {
    const info = subjectInfo();
    const subject = subjectState(activeSubject);
    main.innerHTML = `<article class="subject-complete-card"><span>완료</span><h2>${info.name} 학습을 마쳤어요!</h2><p>모든 문제를 맞혀 다음 단계까지 완전히 익혔습니다.</p><div><b>+${subject.xp || 50} XP</b><b>+${subject.coins || 20} 코인</b></div></article>`;
    actions.innerHTML = '<button class="primary subject-primary" type="button" data-go="study-empty">과목 선택으로</button>';
  }

  function render() {
    if (!activeSubject || !main) return;
    const subject = subjectState(activeSubject);
    renderHeader();
    if (subject.mode === "tree") return renderLearningTree();
    if (activeSubject === "english" && subject.mode === "english-stages") { subject.mode = "tree"; save(); return renderLearningTree(); }
    if (activeSubject === "english" && subject.mode === "english-vocabulary") return renderEnglishVocabulary();
    if (activeSubject === "english" && subject.mode === "english-memorized") return renderEnglishMemorized();
    if (activeSubject === "english" && subject.mode === "english-wrong-note") return renderEnglishWrongNote();
    if (activeSubject === "english" && subject.mode === "english-ai-chat") return renderEnglishAiChat();
    if (activeSubject === "reading") {
      if (subject.mode === "books") return renderBooks();
      if (subject.mode === "summary") return renderBookSummary();
      if (subject.mode === "quiz") return renderReadingQuestion();
      if (subject.mode === "reflection") return renderReflection();
      if (subject.mode === "report") return renderReport();
      return renderComplete();
    }
    if (subject.mode === "intro") return renderIntro();
    if (subject.mode === "science-cards") return renderScienceCards();
    if (subject.mode === "science-understood") return renderScienceUnderstood();
    if (subject.mode === "science-wrong-note") return renderScienceWrongNote();
    if (subject.mode === "flashcards") return renderFlashcards();
    if (subject.mode === "quiz") return renderQuestion();
    return renderComplete();
  }

  function openSubject(subjectId) {
    activeSubject = subjectId;
    state = load();
    state.activeSubject = subjectId;
    const subject = subjectState(subjectId);
    if (subjectId === "english" && window.STUDY_ENGLISH_LEARNING) {
      void window.STUDY_ENGLISH_LEARNING.hydrateState(
        localStorage,
        currentUser(),
        window.STUDY_CLOUD_AUTH,
        {
          completedStages: subject.completedStages,
          completedEnglishStageIds: subject.completedEnglishStageIds,
        }
      );
    }
    const resumeEnglishQuestion = subjectId === "english"
      && subject.mode === "quiz"
      && Boolean(subject.activeEnglishStageId)
      && Boolean(subject.queue?.length);
    if (subject.mode !== "tree") subject.resumeMode = subject.mode;
    if (!resumeEnglishQuestion) subject.mode = "tree";
    save();
    syncScreens(screenName);
    render();
  }

  function completeStage() {
    const subject = subjectState(activeSubject);
    const stage = currentStage();
    const englishStage = currentEnglishStage();
    if (activeSubject === "english" && englishStage) {
      if (!subject.completedEnglishStageIds.includes(englishStage.stageId)) subject.completedEnglishStageIds.push(englishStage.stageId);
      const englishStages = stage.courseStages || [];
      const englishStageIndex = englishStages.findIndex((item) => item.stageId === englishStage.stageId);
      if (englishStageIndex < englishStages.length - 1) {
        subject.activeEnglishStageId = englishStages[englishStageIndex + 1].stageId;
        subject.mode = "english-stages";
        subject.resumeMode = "english-stages";
        subject.queue = [];
        subject.mastered = [];
        subject.answer = "";
        subject.feedback = null;
        subject.lastUpdatedAt = new Date().toISOString();
        save();
        return render();
      }
      subject.activeEnglishStageId = null;
    }
    const firstCompletion = !subject.completedStages.includes(stage.id);
    if (firstCompletion) subject.completedStages.push(stage.id);
    subject.stageIndex += 1;
    if (activeSubject === "english" && stage.assessmentType === "boss-test" && subject.stageIndex < subjectInfo().stages.length) {
      subject.selectedEnglishLevelId = subjectInfo().stages[subject.stageIndex].levelId;
    }
    subject.xp += 50;
    if (firstCompletion) {
      subject.coins += 20;
      window.STUDY_REWARDS?.showCoinReward(20, `${stage.title} 완료 보상`);
      window.STUDY_SOCIAL?.addPoints?.(20, `${stage.title} 완료`);
    }
    subject.resumeMode = subject.stageIndex < subjectInfo().stages.length ? "intro" : "complete";
    subject.mode = "tree";
    subject.queue = [];
    subject.mastered = [];
    subject.answer = "";
    subject.feedback = null;
    subject.lastUpdatedAt = new Date().toISOString();
    save();
    updateSubjectCards();
    render();
  }

  function checkAnswer(reading = false, advanceAfter = false) {
    const subject = subjectState(activeSubject);
    const question = reading ? readingQuestion() : questionForCurrent();
    const writtenReading = reading && !question.choices?.length;
    const input = reading
      ? (writtenReading ? $("#readingWrittenAnswer")?.value || "" : subject.answer)
      : (question.userInputRequired || question.recordingRequired ? $("#subjectLongAnswer")?.value || "" : question.choices ? subject.answer : (question.type === "journal" ? $("#subjectJournalAnswer")?.value || "" : $("#subjectShortAnswer")?.value || ""));
    if (!input.trim()) return alert("답을 선택하거나 입력해주세요.");
    subject.answer = input;
    const snapshot = {
      queue: [...subject.queue],
      reviewQueue: [...subject.reviewQueue],
      mastered: [...subject.mastered],
      answer: subject.answer,
      feedback: null,
      xp: subject.xp,
      coins: subject.coins,
    };
    subject.questionHistory.push(snapshot);
    subject.previousQuestion = snapshot;
    const acceptedAnswers = [question.answer, ...(question.acceptedAnswers || [])].filter(Boolean);
    const freeResponse = question.userInputRequired || question.recordingRequired;
    const correct = writtenReading || question.type === "journal" || freeResponse
      ? input.trim().split(/\s+/).filter(Boolean).length >= (question.minimumWordTarget || (question.recordingRequired ? 10 : question.minimumWords || 35))
      : acceptedAnswers.some((answer) => normalized(input) === normalized(answer));
    subject.feedback = { correct };
    subject.explanationOpen = true;
    subject.explanationQuestionId = question.id;
    if (correct) {
      if (!subject.mastered.includes(question.id)) subject.mastered.push(question.id);
      subject.xp += 10;
      subject.coins += 4;
    } else {
      if (activeSubject !== "english" && !subject.reviewQueue.includes(question.id)) subject.reviewQueue.push(question.id);
      if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
    }
    subject.lastUpdatedAt = new Date().toISOString();
    reportActivity(correct);
    save();
    if (advanceAfter && (!reading && activeSubject === "english" ? correct : true)) return nextQuestion(reading);
    render();
  }

  function nextQuestion(reading = false) {
    const subject = subjectState(activeSubject);
    if (activeSubject === "english" && subject.feedback && !subject.feedback.correct) {
      return alert("오답입니다. 다시 선택해 주세요.");
    }
    if (activeSubject === "english" && !subject.feedback) {
      const question = questionForCurrent();
      const enteredAnswer = question?.choices
        ? subject.answer
        : (question?.userInputRequired || question?.recordingRequired ? $("#subjectLongAnswer")?.value : $("#subjectShortAnswer")?.value);
      if (!String(enteredAnswer || "").trim()) return alert("답을 먼저 선택하거나 입력해 주세요.");
      return checkAnswer(false, true);
    }
    if (subject.feedback) subject.queue.shift();
    subject.answer = "";
    subject.feedback = null;
    subject.explanationOpen = false;
    subject.explanationQuestionId = null;
    subject.scienceHintLevel = 0;
    save();
    if (!subject.queue.length && subject.reviewQueue.length) {
      subject.queue = [...subject.reviewQueue];
      subject.reviewQueue = [];
      subject.answer = "";
      subject.feedback = null;
      save();
      return render();
    }
    if (reading && !subject.queue.length) return startReflection();
    if (!reading && !subject.queue.length) return completeStage();
    render();
  }

  function markQuestionUnknown() {
    const subject = subjectState(activeSubject);
    const question = questionForCurrent();
    if (!question || subject.feedback) return;
    const snapshot = {
      queue: [...subject.queue], reviewQueue: [...subject.reviewQueue], mastered: [...subject.mastered],
      answer: "", feedback: null, xp: subject.xp, coins: subject.coins,
    };
    subject.questionHistory.push(snapshot);
    subject.previousQuestion = snapshot;
    if (!subject.reviewQueue.includes(question.id)) subject.reviewQueue.push(question.id);
    if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
    subject.answer = "";
    subject.feedback = { correct: false, unknown: true };
    subject.explanationOpen = true;
    subject.explanationQuestionId = question.id;
    subject.lastUpdatedAt = new Date().toISOString();
    reportActivity(false);
    save();
    render();
  }

  function previousQuestion() {
    const subject = subjectState(activeSubject);
    if (!subject.previousQuestion) return alert("이전 문제는 없어요.");
    const previous = subject.questionHistory?.pop() || subject.previousQuestion;
    subject.queue = [...previous.queue];
    subject.reviewQueue = [...(previous.reviewQueue || [])];
    subject.mastered = [...previous.mastered];
    subject.answer = previous.answer;
    subject.feedback = previous.feedback;
    subject.xp = previous.xp ?? subject.xp;
    subject.coins = previous.coins ?? subject.coins;
    subject.previousQuestion = subject.questionHistory?.at(-1) || null;
    save();
    render();
  }

  function showExplanation() {
    const question = activeSubject === "reading" ? readingQuestion() : questionForCurrent();
    if (!question) return;
    const subject = subjectState(activeSubject);
    if (activeSubject === "english") {
      if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
      subject.answer = "";
      subject.feedback = null;
      subject.explanationOpen = !subject.explanationOpen || subject.explanationQuestionId !== question.id;
      subject.explanationQuestionId = subject.explanationOpen ? question.id : null;
      subject.lastUpdatedAt = new Date().toISOString();
      save();
      return render();
    }
    subject.explanationOpen = !subject.explanationOpen;
    subject.explanationQuestionId = subject.explanationOpen ? question.id : null;
    save();
    render();
  }

  function showQuestionHint(level = 1) {
    const question = activeSubject === "reading" ? readingQuestion() : questionForCurrent();
    if (!question) return;
    if (activeSubject === "science") {
      const subject = subjectState(activeSubject);
      if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
      subject.scienceHintLevel = level;
      subject.explanationOpen = true;
      subject.explanationQuestionId = question.id;
      save();
      return render();
    }
    alert(question.hint || "이 문제의 핵심 문장과 개념을 다시 살펴보세요.");
  }

  function endToday() {
    const subject = subjectState(activeSubject);
    subject.mode = "tree";
    save();
    render();
  }

  function startReadingQuiz() {
    if (!window.confirm("책을 읽은 뒤에 시작하는 확인 문제입니다. 선택한 책을 읽었나요?")) return;
    const subject = subjectState(activeSubject);
    subject.mode = "quiz";
    subject.queue = selectedBook().questions.map((item) => item.id);
    subject.reviewQueue = [];
    subject.mastered = [];
    subject.answer = "";
    subject.feedback = null;
    save();
    render();
  }

  function startReflection() {
    const subject = subjectState(activeSubject);
    subject.mode = "reflection";
    subject.reflectionIndex = 0;
    subject.answer = "";
    subject.feedback = null;
    save();
    render();
  }

  function nextReflection() {
    const subject = subjectState(activeSubject);
    subject.reflection[subject.reflectionIndex] = $("#readingReflectionAnswer")?.value.trim() || "";
    if (!subject.reflection[subject.reflectionIndex]) return alert("짧게라도 내 생각을 적어보세요.");
    if (subject.reflectionIndex < reflectionPrompts.length - 1) {
      subject.reflectionIndex += 1;
    } else {
      subject.mode = "report";
      subject.report = makeReport();
    }
    save();
    render();
  }

  function saveReport() {
    const subject = subjectState(activeSubject);
    subject.report = $("#readingReport")?.value.trim() || subject.report;
    subject.reports.push({ bookId: subject.selectedBookId, body: subject.report, savedAt: new Date().toISOString() });
    subject.completedStages = ["reading-comprehension", "reflection", "report"];
    subject.resumeMode = "complete";
    subject.mode = "tree";
    subject.xp += 60;
    subject.coins += 25;
    reportActivity(true);
    save();
    updateSubjectCards();
    render();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function waitForSpeechVoices() {
    const synth = window.speechSynthesis;
    const available = synth?.getVoices?.() || [];
    if (available.length) return Promise.resolve(available);
    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        synth.removeEventListener?.("voiceschanged", finish);
        resolve(synth.getVoices());
      };
      synth.addEventListener?.("voiceschanged", finish, { once: true });
      setTimeout(finish, 1200);
    });
  }

  async function playEnglish(text) {
    if (!window.speechSynthesis) return alert("이 기기에서는 듣기 기능을 사용할 수 없습니다.");
    window.speechSynthesis.cancel();
    const voices = await waitForSpeechVoices();
    const englishVoices = voices.filter((voice) => /^en([_-]|$)/i.test(String(voice.lang || "")));
    const englishVoice = englishVoices.find((voice) => /^en-US$/i.test(voice.lang) && /Natural|Aria|Jenny|Guy|Zira|David/i.test(voice.name))
      || englishVoices.find((voice) => /^en-US$/i.test(voice.lang))
      || englishVoices.find((voice) => /^en-GB$/i.test(voice.lang))
      || englishVoices[0];
    if (!englishVoice) return alert("기기에 영어 음성이 설치되어 있지 않습니다. Windows 영어 음성을 추가한 뒤 다시 시도해 주세요.");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = englishVoice;
    utterance.lang = englishVoice.lang;
    utterance.rate = 0.82;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function startSpeakingRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("이 브라우저에서는 음성 인식을 지원하지 않습니다. 말한 문장을 직접 입력해 주세요.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = $("#subjectShortAnswer");
      if (input) input.value = transcript;
      subjectState(activeSubject).answer = transcript;
    };
    recognition.onerror = () => alert("음성을 인식하지 못했어요. 다시 말하거나 직접 입력해 주세요.");
    recognition.start();
  }

  document.addEventListener("click", (event) => {
    const subjectTrigger = event.target.closest("[data-subject-learning]");
    if (subjectTrigger) {
      event.preventDefault();
      return openSubject(subjectTrigger.dataset.subjectLearning);
    }
    if (!activeSubject || !document.querySelector(`[data-screen="${screenName}"].active`)) return;
    const choice = event.target.closest("[data-subject-choice]");
    if (choice) {
      const subject = subjectState(activeSubject);
      subject.answer = choice.dataset.subjectChoice;
      if (activeSubject === "english") {
        subject.feedback = null;
        const question = questionForCurrent();
        if (question && normalized(subject.answer) !== normalized(question.answer)) {
          if (!subject.wrongQuestionIds.includes(question.id)) subject.wrongQuestionIds.push(question.id);
          subject.lastUpdatedAt = new Date().toISOString();
          save();
        }
      }
      return render();
    }
    const readingChoice = event.target.closest("[data-reading-choice]");
    if (readingChoice) { subjectState(activeSubject).answer = readingChoice.dataset.readingChoice; return render(); }
    const catalogGrade = event.target.closest("[data-reading-catalog-grade]");
    if (catalogGrade) {
      const subject = subjectState(activeSubject);
      subject.readingCatalogGrade = catalogGrade.dataset.readingCatalogGrade;
      subject.readingCatalogPage = 1;
      save();
      return render();
    }
    const catalogPage = event.target.closest("[data-reading-catalog-page]");
    if (catalogPage && !catalogPage.disabled) {
      const subject = subjectState(activeSubject);
      subject.readingCatalogPage = Math.max(1, Number(catalogPage.dataset.readingCatalogPage) || 1);
      save();
      return render();
    }
    const book = event.target.closest("[data-book-id]");
    if (book) {
      const subject = subjectState(activeSubject);
      subject.selectedBookId = book.dataset.bookId;
      subject.mode = "summary";
      subject.mastered = [];
    subject.queue = [];
    subject.reviewQueue = [];
      subject.reflection = ["", "", "", ""];
      save();
      return render();
    }
    const actionTarget = event.target.closest("[data-subject-action]");
    const action = actionTarget?.dataset.subjectAction;
    if (!action) return;
    if (action === "start-tree-stage") {
      const subject = subjectState(activeSubject);
      subject.mode = subject.resumeMode || (activeSubject === "reading" ? "books" : "intro");
      delete subject.resumeMode;
      save();
      return render();
    }
    if (action === "select-science-grade") {
      const targetGrade = actionTarget.dataset.scienceGrade;
      const targetIndex = (subjectInfo().stages || []).findIndex((stage) => stage.gradeLabel === targetGrade);
      if (targetIndex < 0) return;
      const subject = subjectState(activeSubject);
      subject.stageIndex = targetIndex;
      subject.mode = "intro";
      subject.scienceCardIndex = 0;
      subject.answer = "";
      subject.feedback = null;
      save();
      return render();
    }
    if (action === "open-science-cards") {
      const subject = subjectState(activeSubject);
      const stage = currentStage();
      const understood = subject.scienceUnderstood[stage.id] || [];
      subject.scienceCardIndex = (stage.learningCards || []).findIndex((_, index) => !understood.includes(index));
      if (subject.scienceCardIndex < 0) subject.scienceCardIndex = 0;
      subject.mode = "science-cards";
      subject.resumeMode = "science-cards";
      save();
      return render();
    }
    if (action === "open-science-wrong-note") {
      const subject = subjectState(activeSubject);
      subject.mode = "science-wrong-note";
      subject.resumeMode = "science-wrong-note";
      save();
      return render();
    }
    if (action === "previous-science-card") {
      const subject = subjectState(activeSubject);
      const understood = subject.scienceUnderstood[currentStage().id] || [];
      const previous = currentStage().learningCards.map((_, index) => index).filter((index) => index < subject.scienceCardIndex && !understood.includes(index)).at(-1);
      if (previous !== undefined) subject.scienceCardIndex = previous;
      save();
      return render();
    }
    if (action === "next-science-card") {
      const subject = subjectState(activeSubject);
      const understood = subject.scienceUnderstood[currentStage().id] || [];
      const next = currentStage().learningCards.map((_, index) => index).find((index) => index > subject.scienceCardIndex && !understood.includes(index));
      if (next !== undefined) subject.scienceCardIndex = next;
      save();
      return render();
    }
    if (action === "understand-science-card") {
      const subject = subjectState(activeSubject);
      const stage = currentStage();
      const cards = stage.learningCards || [];
      const understood = subject.scienceUnderstood[stage.id] || [];
      if (!understood.includes(subject.scienceCardIndex)) understood.push(subject.scienceCardIndex);
      subject.scienceUnderstood[stage.id] = understood;
      if (understood.length === cards.length) {
        subject.scienceCardIndex = cards.length - 1;
        subject.resumeMode = "science-cards";
      } else {
        const next = cards.findIndex((_, index) => !understood.includes(index));
        subject.scienceCardIndex = next < 0 ? 0 : next;
      }
      save();
      return render();
    }
    if (action === "open-science-understood") {
      const subject = subjectState(activeSubject);
      subject.mode = "science-understood";
      save();
      return render();
    }
    if (action === "back-science-learning") {
      const subject = subjectState(activeSubject);
      const understood = subject.scienceUnderstood[currentStage().id] || [];
      subject.scienceCardIndex = currentStage().learningCards.findIndex((_, index) => !understood.includes(index));
      if (subject.scienceCardIndex < 0) subject.scienceCardIndex = 0;
      subject.mode = "science-cards";
      save();
      return render();
    }
    if (action === "start-science-quiz") {
      const subject = subjectState(activeSubject);
      const stage = currentStage();
      const cards = stage?.learningCards || [];
      const understood = subject.scienceUnderstood[stage.id] || [];
      if (cards.length && understood.length < cards.length) {
        subject.mode = "science-cards";
        subject.resumeMode = "science-cards";
        save();
        alert("단원학습을 먼저 완료해 주세요.");
        return render();
      }
      setQueueForStage();
      subject.mode = "quiz";
      subject.resumeMode = "quiz";
      save();
      return render();
    }
    if (action === "start-stage") { const subject = subjectState(activeSubject); setQueueForStage(); subject.mode = flashcardsForStage(currentStage()).length ? "flashcards" : "quiz"; save(); return render(); }
    if (action === "open-english-roadmap-item") {
      const subject = subjectState("english");
      const itemIndex = Number(actionTarget.dataset.roadmapIndex);
      const item = englishCoreRoadmap[itemIndex];
      const firstIncompleteIndex = englishCoreRoadmap.findIndex((entry) => !englishRoadmapItemComplete(entry, subject));
      const currentIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : englishCoreRoadmap.length - 1;
      if (!item || (itemIndex > currentIndex && !englishRoadmapItemComplete(item, subject))) return;
      const targetCourse = englishRoadmapCourse(item, subject);
      const targetIndex = (subjectInfo().stages || []).findIndex((course) => course.id === targetCourse?.id);
      if (targetIndex >= 0) {
        subject.stageIndex = targetIndex;
        subject.selectedEnglishLevelId = targetCourse.levelId;
        subject.activeEnglishStageId = null;
      }
      if (item.mode === "ai") {
        subject.mode = "english-ai-chat";
        subject.resumeMode = "english-ai-chat";
      } else if (item.mode !== "course") {
        const phase = englishRoadmapPhase(item);
        if (!phase) return alert(`${item.title} 문제를 준비 중입니다.`);
        subject.activeEnglishStageId = phase.stageId;
        setQueueForStage();
        subject.mode = "quiz";
        subject.resumeMode = "quiz";
      } else {
        subject.mode = "english-vocabulary";
        subject.resumeMode = "english-vocabulary";
      }
      save();
      return render();
    }
    if (action === "open-word-cards") {
      const subject = subjectState(activeSubject);
      if (activeSubject === "english") {
        subject.mode = "english-vocabulary";
        subject.resumeMode = "english-vocabulary";
        save();
        return render();
      }
      subject.flashIndex = 0;
      subject.flashQueue = flashcardsForStage(currentStage());
      subject.cardOnlyGuide = true;
      subject.mode = "flashcards";
      save();
      return render();
    }
    if (action === "open-english-wrong-note") {
      const subject = subjectState("english");
      subject.mode = "english-wrong-note";
      subject.resumeMode = "english-wrong-note";
      save();
      return render();
    }
    if (action === "open-english-phase") return openEnglishPhase(actionTarget.dataset.englishPhase);
    if (action === "start-english-elite-recommendation") {
      document.dispatchEvent(new CustomEvent("study:start-elite-test", { detail: { subject: "영어" } }));
      return;
    }
    if (action === "open-english-article-path") {
      const subject = subjectState("english");
      const targetIndex = (subjectInfo().stages || []).findIndex((course) => course.id === "EN-L5-CYCLE-05");
      const course = subjectInfo().stages?.[targetIndex];
      const phase = course?.courseStages?.[0];
      if (!phase) return alert("기사형 학습을 준비 중입니다.");
      subject.stageIndex = targetIndex;
      subject.selectedEnglishLevelId = course.levelId;
      subject.activeEnglishStageId = phase.stageId;
      subject.queue = phase.questions.filter((question) => question.toeflTaskType).map((question) => question.id);
      subject.mode = "quiz";
      subject.resumeMode = "quiz";
      subject.answer = "";
      subject.feedback = null;
      save();
      return render();
    }
    if (action === "open-english-ai-chat") {
      const subject = subjectState("english");
      subject.mode = "english-ai-chat";
      subject.resumeMode = "english-ai-chat";
      save();
      return render();
    }
    if (action === "ask-english-ai" || action === "send-english-ai") {
      const prompt = action === "ask-english-ai" ? actionTarget.dataset.aiPrompt : $("#englishAiChatInput")?.value.trim();
      if (!prompt) return alert("질문을 입력해 주세요.");
      const subject = subjectState("english");
      subject.englishAiMessages.push({ role: "user", text: prompt }, { role: "assistant", text: answerEnglishAi(prompt) });
      subject.englishAiMessages = subject.englishAiMessages.slice(-20);
      save();
      return renderEnglishAiChat();
    }
    if (action === "previous-english-vocabulary" || action === "next-english-vocabulary") {
      const course = currentStage();
      const status = englishVocabularyStatus(course);
      if (!status.remaining.length) return render();
      const currentIndex = Math.max(0, status.remaining.findIndex((card) => card.cardId === status.currentCard?.cardId));
      const direction = action === "previous-english-vocabulary" ? -1 : 1;
      const nextIndex = (currentIndex + direction + status.remaining.length) % status.remaining.length;
      status.courseState.currentCardId = status.remaining[nextIndex].cardId;
      saveEnglishVocabularyState(status.vocabularyState);
      return render();
    }
    if (action === "memorize-english-vocabulary") {
      const course = currentStage();
      const status = englishVocabularyStatus(course);
      if (!status.currentCard) return;
      if (!status.courseState.memorizedIds.includes(status.currentCard.cardId)) status.courseState.memorizedIds.push(status.currentCard.cardId);
      recordEnglishVocabularyAttempt(status.currentCard, "meaningRecognition", true);
      const next = status.cards.find((card) => !status.courseState.memorizedIds.includes(card.cardId));
      status.courseState.currentCardId = next?.cardId || status.currentCard.cardId;
      saveEnglishVocabularyState(status.vocabularyState);
      return render();
    }
    if (action === "open-english-memorized") {
      const subject = subjectState(activeSubject);
      subject.mode = "english-memorized";
      subject.resumeMode = "english-memorized";
      save();
      return render();
    }
    if (action === "back-english-vocabulary") {
      const subject = subjectState(activeSubject);
      subject.mode = "english-vocabulary";
      subject.resumeMode = "english-vocabulary";
      save();
      return render();
    }
    if (action === "relearn-english-vocabulary") {
      const cardIdValue = event.target.closest("[data-card-id]")?.dataset.cardId;
      const status = englishVocabularyStatus(currentStage());
      const relearnCard = status.cards.find((card) => card.cardId === cardIdValue);
      status.courseState.memorizedIds = status.courseState.memorizedIds.filter((id) => id !== cardIdValue);
      status.courseState.currentCardId = cardIdValue;
      recordEnglishVocabularyAttempt(relearnCard, "delayedRecall", false);
      saveEnglishVocabularyState(status.vocabularyState);
      return renderEnglishMemorized();
    }
    if (action === "start-english-course-quiz") return startEnglishCourseQuiz();
    if (action === "toggle-english-foundation") {
      const subject = subjectState("english");
      subject.englishFoundationMode = !subject.englishFoundationMode;
      const targetId = subject.englishFoundationMode ? "EN-L01-C01" : "EN-L04-C01";
      const targetIndex = subjectInfo().stages.findIndex((course) => course.id === targetId);
      if (targetIndex >= 0) subject.stageIndex = targetIndex;
      subject.selectedEnglishLevelId = subjectInfo().stages[subject.stageIndex]?.levelId || subject.selectedEnglishLevelId;
      subject.mode = "tree";
      save();
      return render();
    }
    if (action === "play-english-vocabulary-word" || action === "play-english-vocabulary-example") {
      const card = englishVocabularyStatus(currentStage()).currentCard;
      if (!card) return;
      return playEnglish(action === "play-english-vocabulary-example" ? card.example : card.word);
    }
    if (action === "open-reading-books") {
      const subject = subjectState(activeSubject);
      subject.mode = "books";
      subject.resumeMode = "books";
      save();
      return render();
    }
    if (action === "open-hanja-stage") {
      const subject = subjectState(activeSubject);
      const targetIndex = (subjectInfo().stages || []).findIndex((stage) => stage.id === event.target.closest("[data-subject-stage]")?.dataset.subjectStage);
      if (targetIndex < 0) return;
      subject.stageIndex = targetIndex;
      const targetStage = subjectInfo().stages[targetIndex];
      setQueueForStage();
      subject.mode = targetStage.isCumulativeTest ? "quiz" : "flashcards";
      subject.resumeMode = subject.mode;
      save();
      return render();
    }
    if (action === "open-english-level") {
      const subject = subjectState(activeSubject);
      const levelId = event.target.closest("[data-subject-level]")?.dataset.subjectLevel;
      if (!levelId || !englishLevelUnlocked(levelId, subject)) return;
      subject.selectedEnglishLevelId = levelId;
      subject.mode = "tree";
      save();
      return render();
    }
    if (action === "open-english-course") {
      const subject = subjectState(activeSubject);
      const targetId = event.target.closest("[data-subject-stage]")?.dataset.subjectStage;
      const targetIndex = (subjectInfo().stages || []).findIndex((stage) => stage.id === targetId);
      const target = subjectInfo().stages[targetIndex];
      if (targetIndex < 0 || !englishCourseUnlocked(target, subject)) return;
      subject.stageIndex = targetIndex;
      subject.activeEnglishStageId = (target.courseStages || []).find((stage) => !subject.completedEnglishStageIds.includes(stage.stageId))?.stageId || target.courseStages?.at(-1)?.stageId || null;
      subject.mode = "english-stages";
      subject.resumeMode = "english-stages";
      save();
      return render();
    }
    if (action === "open-english-stage") {
      const subject = subjectState(activeSubject);
      const stageId = event.target.closest("[data-english-stage]")?.dataset.englishStage;
      const target = (currentStage()?.courseStages || []).find((stage) => stage.stageId === stageId);
      if (!target || !englishStageUnlocked(target, subject)) return;
      if (!englishVocabularyStatus(currentStage()).complete) {
        subject.mode = "english-vocabulary";
        subject.resumeMode = "english-vocabulary";
        save();
        alert("단어 학습을 먼저 완료해 주세요.");
        return render();
      }
      subject.activeEnglishStageId = stageId;
      setQueueForStage();
      subject.mode = "intro";
      subject.resumeMode = "intro";
      save();
      return render();
    }
    if (action === "back-english-courses") {
      const subject = subjectState(activeSubject);
      subject.mode = "tree";
      subject.resumeMode = "tree";
      save();
      return render();
    }
    if (action === "previous-flashcard") {
      const subject = subjectState(activeSubject);
      if (subject.flashIndex > 0) subject.flashIndex -= 1;
      subject.flashExplanationOpen = false;
      save();
      return render();
    }
    if (action === "next-flashcard") {
      const subject = subjectState(activeSubject);
      subject.flashIndex += 1;
      subject.flashExplanationOpen = false;
      if (subject.flashIndex >= (subject.flashQueue || []).length) subject.mode = "quiz";
      save();
      return render();
    }
    if (action === "toggle-flashcard-explanation") {
      const subject = subjectState(activeSubject);
      subject.flashExplanationOpen = !subject.flashExplanationOpen;
      save();
      return render();
    }
    if (action === "flashcard-known" || action === "flashcard-again") {
      const subject = subjectState(activeSubject);
      const cards = subject.flashQueue || [];
      const card = cards[subject.flashIndex];
      if (card) recordCardReview(card, action !== "flashcard-again");
      subject.flashIndex += 1;
      subject.flashExplanationOpen = false;
      if (subject.flashIndex >= cards.length) {
        if (subject.cardOnlyGuide) {
          delete subject.cardOnlyGuide;
          subject.resumeMode = "intro";
          subject.mode = "tree";
        } else {
          subject.mode = "quiz";
        }
      }
      save();
      return render();
    }
    if (action === "check-answer") return checkAnswer(false);
    if (action === "unknown-question") return markQuestionUnknown();
    if (action === "next-question") return nextQuestion(false);
    if (action === "previous-question") return previousQuestion();
    if (action === "next-session-question") {
      if (activeSubject === "hanja" && !subjectState(activeSubject).feedback) return checkAnswer(false);
      return nextQuestion(activeSubject === "reading");
    }
    if (action === "show-explanation") return showExplanation();
    if (action === "end-today") return endToday();
    if (action === "hint") return showQuestionHint();
    if (action === "science-hint-1") return showQuestionHint(1);
    if (action === "science-hint-2") return showQuestionHint(2);
    if (action === "play-flashcard-word" || action === "play-flashcard-example") {
      const subject = subjectState(activeSubject);
      const card = (subject.flashQueue || [])[subject.flashIndex];
      if (!card) return;
      return playEnglish(action === "play-flashcard-example" ? card.example : card.word);
    }
    if (action === "play-audio") { const question = questionForCurrent(); return playEnglish(question.audioText); }
    if (action === "play-audio-segment") { const question = questionForCurrent(); const segment = question.segments?.[Number(actionTarget.dataset.segmentIndex)]; return segment ? playEnglish(segment.text) : undefined; }
    if (action === "start-speaking") return startSpeakingRecognition();
    if (action === "start-reading-quiz") return startReadingQuiz();
    if (action === "check-reading-answer") return checkAnswer(true);
    if (action === "next-reading-question") return nextQuestion(true);
    if (action === "reading-hint") return alert(readingQuestion().hint);
    if (action === "next-reflection") return nextReflection();
    if (action === "back-reflection") { const subject = subjectState(activeSubject); subject.mode = "reflection"; subject.reflectionIndex = 0; return render(); }
    if (action === "save-report") return saveReport();
  });

  document.addEventListener("input", (event) => {
    if (event.target?.id !== "subjectLongAnswer" || activeSubject !== "english") return;
    subjectState(activeSubject).answer = event.target.value;
    subjectState(activeSubject).lastUpdatedAt = new Date().toISOString();
    save();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target?.id === "subjectShortAnswer" && activeSubject && document.querySelector(`[data-screen="${screenName}"].active`)) {
      event.preventDefault();
      checkAnswer(false);
      return;
    }
    const card = event.target.closest?.("[data-subject-learning]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openSubject(card.dataset.subjectLearning);
    }
  });

  function restoreActiveSubject() {
    if (!document.querySelector(`[data-screen="${screenName}"].active`)) return;
    const savedSubject = state.activeSubject && content[state.activeSubject]
      ? state.activeSubject
      : Object.entries(state.subjects || {})
        .filter(([subjectId]) => content[subjectId])
        .sort((left, right) => String(right[1]?.lastUpdatedAt || "").localeCompare(String(left[1]?.lastUpdatedAt || "")))[0]?.[0];
    if (!savedSubject) return;
    activeSubject = savedSubject;
    state.activeSubject = savedSubject;
    save();
    render();
  }

  updateSubjectCards();
  restoreActiveSubject();
  document.addEventListener("study:english-placement-accepted", (event) => {
    const recommendation = event.detail || {};
    const targetIndex = content.english?.stages?.findIndex((stage) => stage.id === recommendation.recommendedCycleId) ?? -1;
    if (targetIndex < 0) return;
    const subject = subjectState("english");
    subject.stageIndex = targetIndex;
    subject.selectedEnglishLevelId = `EN-QUALITY-L${recommendation.recommendedLevel}`;
    subject.activeEnglishStageId = null;
    subject.pendingWeakGrammarIds = [...(recommendation.weakGrammarIds || [])];
    subject.pendingWeakVocabularyIds = [...(recommendation.weakVocabularyIds || [])];
    subject.englishEliteRecommended = Boolean(recommendation.recommendElite);
    subject.mode = "tree";
    subject.resumeMode = "intro";
    subject.queue = [];
    subject.answer = "";
    subject.feedback = null;
    subject.lastUpdatedAt = new Date().toISOString();
    save();
    updateSubjectCards();
    if (activeSubject === "english") render();
  });
  window.addEventListener("study:user-changed", () => {
    state = load();
    updateSubjectCards();
    restoreActiveSubject();
  });
})();
