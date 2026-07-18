(function () {
  const q = (id, question, options = {}) => ({ id, ...options, question });
  const english = {
    name: "영어",
    eyebrow: "TOEFL 기반 영어 학습",
    color: "#d9a91a",
    stages: [
      {
        id: "academic-vocabulary",
        title: "Academic Vocabulary",
        passMode: "perfect",
        intro: {
          title: "핵심 학술 단어부터 정확히 익혀요",
          body: "단어를 먼저 기억하고, 다음 단계에서 같은 단어를 문법과 독해 문장에 다시 사용합니다. 틀린 단어는 다른 문제를 푼 뒤 다시 나와요.",
          example: "analyze = 분석하다 / significant = 중요한, 상당한",
        },
        flashcards: [
          { word: "analyze", meaning: "분석하다", example: "Researchers analyze the evidence before they write a conclusion." },
          { word: "significant", meaning: "중요한, 상당한", example: "The experiment produced a significant result." },
          { word: "indicate", meaning: "나타내다, 시사하다", example: "The data indicate that the method was effective." },
          { word: "derive", meaning: "~에서 얻어 내다", example: "Scientists derive a conclusion from reliable evidence." },
          { word: "evidence", meaning: "증거", example: "A strong claim needs clear evidence." },
        ],
        questions: [
          q("toefl-v-1", "'analyze'의 가장 알맞은 뜻을 고르세요.", { choices: ["분석하다", "피하다", "암기하다", "발명하다"], answer: "분석하다", explanation: "analyze는 자료나 정보를 자세히 분석한다는 뜻입니다.", hint: "analysis(분석)와 같은 어근입니다." }),
          q("toefl-v-2", "'significant'의 뜻으로 가장 알맞은 것은 무엇인가요?", { choices: ["중요한", "잠깐의", "불확실한", "조용한"], answer: "중요한", explanation: "significant는 결과나 변화가 중요하거나 상당할 때 씁니다.", hint: "significance는 중요성이라는 뜻입니다." }),
          q("toefl-v-3", "빈칸에 들어갈 단어를 영어로 쓰세요. 'Researchers ___ evidence before reaching a conclusion.' (연구자들은 결론 전에 증거를 분석한다.)", { type: "fill-blank", answer: "analyze", explanation: "주어 Researchers가 복수이므로 현재형 analyze를 씁니다.", hint: "'분석하다'라는 뜻의 학술 단어입니다.", spacedReview: true }),
          q("toefl-v-4", "'derive A from B'의 의미로 가장 알맞은 것은 무엇인가요?", { choices: ["B로부터 A를 얻어 내다", "A를 B와 비교하다", "A를 B로 숨기다", "B를 A로 반복하다"], answer: "B로부터 A를 얻어 내다", explanation: "derive는 자료나 근거에서 결과를 얻어 내는 뜻으로 자주 쓰입니다.", hint: "source(근원)에서 결과가 나온다고 생각해 보세요." }),
          q("toefl-v-5", "빈칸에 들어갈 단어를 영어로 쓰세요. 'The data ___ that the policy was effective.' (그 자료는 정책이 효과적이었음을 나타낸다.)", { type: "fill-blank", answer: "indicate", explanation: "data는 여기서 복수 취급하므로 indicate를 씁니다.", hint: "'나타내다, 시사하다'라는 뜻입니다.", spacedReview: true }),
        ],
      },
      {
        id: "grammar-in-context",
        title: "Grammar in Context",
        passMode: "perfect",
        intro: {
          title: "단어를 문법 구조 안에서 사용해요",
          body: "TOEFL 문장은 길어도 핵심은 주어, 동사, 연결어입니다. 앞 단계의 학술 단어를 실제 문장에 적용합니다.",
          example: "The results indicate that the treatment was effective.",
        },
        questions: [
          q("toefl-g-1", "빈칸에 들어갈 표현을 고르세요. 'The professor suggested that each student ___ the article carefully.'", { choices: ["read", "reads", "reading", "to read"], answer: "read", explanation: "suggest that 뒤의 가정법 현재에서는 동사원형 read를 사용합니다.", hint: "suggest that + 주어 + 동사원형 구조입니다.", spacedReview: true }),
          q("toefl-g-2", "빈칸에 들어갈 단어를 영어로 쓰세요. 'The experiment was repeated ___ the results could be verified.'", { type: "fill-blank", answer: "so that", explanation: "목적을 나타낼 때 so that + 주어 + 동사를 씁니다.", hint: "'~할 수 있도록'이라는 목적 연결어입니다.", spacedReview: true }),
          q("toefl-g-3", "문법적으로 옳은 문장을 고르세요.", { choices: ["The data indicate a significant change.", "The data indicates a significant change.", "The data indicating a significant change.", "The data to indicate a significant change."], answer: "The data indicate a significant change.", explanation: "학술 영어에서 data는 보통 복수로 취급하므로 indicate가 맞습니다.", hint: "data는 datum의 복수형입니다." }),
          q("toefl-g-4", "빈칸에 들어갈 단어를 영어로 쓰세요. 'The theory was accepted ___ it explained the evidence clearly.'", { type: "fill-blank", answer: "because", explanation: "원인을 나타내는 접속사 because가 필요합니다.", hint: "'왜냐하면'이라는 뜻입니다." }),
          q("toefl-g-5", "빈칸에 들어갈 표현을 고르세요. '___ the weather was cold, the researchers continued the fieldwork.'", { choices: ["Although", "Because", "Unless", "Therefore"], answer: "Although", explanation: "추운 날씨와 조사를 계속했다는 대조 관계이므로 Although가 맞습니다.", hint: "'비록 ~이지만'이라는 양보 연결어입니다." }),
        ],
      },
      {
        id: "academic-reading",
        title: "Academic Reading",
        passMode: "perfect",
        intro: {
          title: "짧은 학술 지문에서 근거를 찾습니다",
          body: "단어 뜻만 고르는 것이 아니라, 문장 사이의 원인·대조·결론을 찾아 읽습니다.",
          example: "Claim → evidence → conclusion의 연결을 표시하며 읽어 보세요.",
        },
        questions: [
          q("toefl-r-1", "지문의 주된 목적은 무엇인가요?", { passage: "Urban trees can lower surface temperatures by providing shade. They also release water vapor, which cools the surrounding air. For this reason, cities with more tree cover may experience less intense heat during summer.", choices: ["도시 나무가 여름 더위를 줄이는 방법을 설명한다", "나무를 심는 비용을 비교한다", "여름 여행지를 추천한다", "나무의 종류를 분류한다"], answer: "도시 나무가 여름 더위를 줄이는 방법을 설명한다", explanation: "그늘과 수증기 방출이라는 두 근거로 도시 나무의 냉각 효과를 설명합니다.", hint: "첫 두 문장은 근거, 마지막 문장은 결론입니다." }),
          q("toefl-r-2", "'They'가 가리키는 것은 무엇인가요?", { passage: "Coral reefs support many marine species. They provide shelter and feeding areas for fish, which in turn attract larger animals.", choices: ["Coral reefs", "marine species", "fish", "larger animals"], answer: "Coral reefs", explanation: "They는 바로 앞 문장의 복수 명사 Coral reefs를 가리킵니다.", hint: "대명사는 보통 앞 문장의 가장 가까운 핵심 명사를 가리킵니다." }),
          q("toefl-r-3", "지문으로부터 추론할 수 있는 내용은 무엇인가요?", { passage: "Students who reviewed vocabulary at several intervals remembered more words than students who studied the same list only once. The total study time was similar for both groups.", choices: ["간격을 두고 복습하면 기억에 도움이 된다", "한 번에 오래 외우는 것이 항상 가장 좋다", "두 집단의 공부 시간은 크게 달랐다", "단어 학습은 기억과 관계없다"], answer: "간격을 두고 복습하면 기억에 도움이 된다", explanation: "전체 시간은 비슷했지만 여러 간격으로 복습한 집단의 기억이 더 좋았습니다.", hint: "비교 대상과 결과를 연결해 보세요." }),
          q("toefl-r-4", "빈칸에 들어갈 전환어를 영어로 쓰세요. 'The sample size was small. ___, the results should be interpreted cautiously.'", { type: "fill-blank", answer: "Therefore", explanation: "앞 문장의 이유로부터 결론을 이끌어 Therefore를 씁니다.", hint: "'따라서'라는 결론 연결어입니다." }),
          q("toefl-r-5", "'significant'가 지문에서 가장 가깝게 뜻하는 것은 무엇인가요?", { passage: "After the new method was introduced, the class showed a significant improvement in reading speed.", choices: ["noticeable and important", "temporary and minor", "impossible to measure", "unrelated to learning"], answer: "noticeable and important", explanation: "significant improvement는 눈에 띄고 중요한 향상을 뜻합니다.", hint: "학술 단어 단계에서 배운 뜻을 떠올려 보세요." }),
        ],
      },
      {
        id: "english-reading-time-1",
        title: "English Reading Time · Episode 1",
        passMode: "perfect",
        intro: {
          title: "원서형 연재 읽기: The Blue Lantern",
          body: "이 작품은 앱을 위해 새로 쓴 영어 연재입니다. 사전을 바로 찾기보다 문맥, 인물의 선택, 문장 구조를 먼저 따라가며 영어로 생각해 보세요.",
          example: "Read for meaning first. Then return to the sentence that proves your answer.",
        },
        questions: [
          q("reading-time-1", "Why did Mira return to the station after midnight?", {
            passage: "The Blue Lantern — Episode 1\n\nMira had promised herself that she would not return to the abandoned station. Yet, after midnight, the blue light appeared again beyond the river. It did not shine like an ordinary lamp. It pulsed slowly, as if it were waiting for someone to answer.\n\nInside the station, Mira found a small brass box beneath the ticket counter. A note on its lid read: 'For the person who chooses questions over fear.' She almost laughed, because fear was exactly what she felt. Still, she opened the box. There was no treasure inside—only a map with one street marked in blue. The street led to her grandfather's old library.\n\nMira folded the map carefully. She did not know what she would find there, but she knew one thing: the light had not brought her back to the station by accident.",
            choices: ["She wanted to investigate the mysterious blue light.", "She needed to buy a train ticket.", "She was looking for a lost pet.", "She had forgotten her school bag."],
            answer: "She wanted to investigate the mysterious blue light.",
            explanation: "Mira returns because the blue light appears again and seems to be waiting for someone. The station is a place of investigation, not a normal trip.",
            hint: "Look at the first paragraph: what appeared beyond the river?",
          }),
          q("reading-time-2", "What does the note on the brass box suggest about Mira?", {
            passage: "The note said, 'For the person who chooses questions over fear.' Mira felt afraid, but she opened the box anyway.",
            choices: ["She is willing to act even when she is afraid.", "She never feels fear.", "She dislikes asking questions.", "She knows exactly what is inside the box."],
            answer: "She is willing to act even when she is afraid.",
            explanation: "The contrast matters: Mira feels fear, yet chooses to open the box. Her curiosity is stronger than her fear.",
            hint: "Find the contrast word 'Still.'",
          }),
          q("reading-time-3", "빈칸에 들어갈 표현을 영어로 쓰세요. 'Mira opened the box ___ she was afraid.'", {
            type: "fill-blank",
            answer: "although",
            explanation: "두 절이 반대되는 내용일 때 although를 씁니다. 이 문법 패턴은 이후 독해에서도 계속 다시 나옵니다.",
            hint: "'비록 ~이지만'의 양보 연결어입니다.",
            spacedReview: true,
          }),
          q("reading-time-4", "Which place will Mira visit next?", {
            passage: "The map had one street marked in blue. The street led to her grandfather's old library.",
            choices: ["Her grandfather's old library", "The city museum", "A new train station", "Her classroom"],
            answer: "Her grandfather's old library",
            explanation: "The last sentence of the second paragraph directly identifies the next place.",
            hint: "The map tells Mira where the blue street leads.",
          }),
          q("reading-time-journal-1", "Write an English diary entry as Mira. Explain what you felt at the station and what you plan to do next.", {
            type: "journal",
            minimumWords: 35,
            explanation: "Use at least two details from the story. Try this pattern: 'I felt ___ because ___. Although ___, I decided to ___. Next, I will ___. '",
            hint: "Use first person (I) and include feeling + reason + next action.",
          }),
        ],
      },
      {
        id: "academic-listening",
        title: "Academic Listening",
        passMode: "perfect",
        intro: {
          title: "짧은 강의와 안내를 듣고 핵심을 잡아요",
          body: "듣기 버튼을 누른 뒤 메모 없이 핵심을 파악해 보세요. 필요하면 한 번 더 들을 수 있습니다.",
          example: "듣기에서는 원인, 예시, 결론 신호어를 먼저 잡습니다.",
        },
        questions: [
          q("toefl-l-1", "교수가 강조한 학습 방법은 무엇인가요?", { audioText: "Students should not memorize a long word list only once. Review the words briefly over several days, and use each word in a sentence. This method creates stronger memory connections.", choices: ["여러 날에 걸쳐 단어를 문장에서 복습한다", "단어를 한 번에 모두 암기한다", "문장을 외우지 않는다", "단어 학습을 미룬다"], answer: "여러 날에 걸쳐 단어를 문장에서 복습한다", explanation: "강의는 여러 날에 걸친 짧은 복습과 문장 활용을 권합니다.", hint: "not only once, over several days를 들어 보세요." }),
          q("toefl-l-2", "안내 방송의 목적은 무엇인가요?", { audioText: "Attention, students. The science library will close at six p.m. today for maintenance. Online journals will remain available, but the study rooms cannot be used until tomorrow morning.", choices: ["도서관 이용 제한을 알린다", "새 과학 수업을 소개한다", "온라인 저널을 폐쇄한다", "공부방을 예약받는다"], answer: "도서관 이용 제한을 알린다", explanation: "정비로 인해 도서관과 공부방 이용 시간이 제한된다는 안내입니다.", hint: "will close, cannot be used가 핵심입니다." }),
          q("toefl-l-3", "듣고 빈칸에 들어갈 숫자를 영어로 쓰세요. 'The field trip begins at ___ thirty.'", { type: "fill-blank", audioText: "Reminder: Our field trip begins at eight thirty. Please meet your group outside the main gate by eight fifteen.", answer: "eight", explanation: "field trip begins at eight thirty라고 말했습니다.", hint: "시작 시간만 다시 들어 보세요." }),
          q("toefl-l-4", "학생이 상담실에 가려는 이유는 무엇인가요?", { audioText: "Student: I am having trouble organizing my research sources. Advisor: Bring your notes tomorrow, and we can make an outline together. Student: That would help a lot.", choices: ["연구 자료를 정리하는 데 어려움이 있어서", "새 수업을 신청하려고", "여행 계획을 세우려고", "시험 시간을 바꾸려고"], answer: "연구 자료를 정리하는 데 어려움이 있어서", explanation: "organizing my research sources가 학생의 문제입니다.", hint: "학생의 첫 문장을 들어 보세요." }),
          q("toefl-l-5", "화자가 제시한 결과는 무엇인가요?", { audioText: "In our experiment, plants near the window grew faster than plants kept in the darker part of the room. This suggests that light was an important factor in their growth.", choices: ["창가 식물이 더 빨리 자랐다", "어두운 곳 식물이 더 빨리 자랐다", "모든 식물이 똑같이 자랐다", "빛은 성장과 관계없었다"], answer: "창가 식물이 더 빨리 자랐다", explanation: "near the window grew faster가 직접 제시된 결과입니다.", hint: "결과를 나타내는 grew faster를 찾아보세요." }),
        ],
      },
      {
        id: "academic-speaking",
        title: "Academic Speaking",
        passMode: "perfect",
        intro: {
          title: "학술 상황에서 짧고 정확하게 말해요",
          body: "문장을 먼저 듣고, 뜻을 생각한 뒤 직접 말해 보세요. 마이크가 지원되지 않으면 말한 문장을 입력할 수 있습니다.",
          example: "The evidence supports the conclusion.",
        },
        questions: [
          q("toefl-s-1", "다음 뜻을 영어 문장으로 말하거나 입력하세요. '그 증거는 결론을 뒷받침한다.'", { type: "speaking", audioText: "The evidence supports the conclusion.", answer: "The evidence supports the conclusion.", explanation: "evidence(증거), supports(뒷받침한다), conclusion(결론)의 기본 학술 문장입니다.", hint: "The evidence로 시작합니다." }),
          q("toefl-s-2", "다음 뜻을 영어 문장으로 말하거나 입력하세요. '그 결과는 중요하다.'", { type: "speaking", audioText: "The result is significant.", answer: "The result is significant.", explanation: "significant는 중요한, 상당한이라는 뜻입니다.", hint: "The result is로 시작합니다." }),
          q("toefl-s-3", "다음 뜻을 영어 문장으로 말하거나 입력하세요. '연구자들은 자료를 분석한다.'", { type: "speaking", audioText: "Researchers analyze the data.", answer: "Researchers analyze the data.", explanation: "Researchers가 복수이므로 analyze를 씁니다.", hint: "Researchers analyze로 시작합니다." }),
          q("toefl-s-4", "다음 뜻을 영어 문장으로 말하거나 입력하세요. '빛은 식물 성장에 영향을 준다.'", { type: "speaking", audioText: "Light affects plant growth.", answer: "Light affects plant growth.", explanation: "affect는 영향을 주다, growth는 성장이라는 뜻입니다.", hint: "Light affects로 시작합니다." }),
          q("toefl-s-5", "다음 뜻을 영어 문장으로 말하거나 입력하세요. '나는 내 의견을 근거로 뒷받침할 수 있다.'", { type: "speaking", audioText: "I can support my opinion with evidence.", answer: "I can support my opinion with evidence.", explanation: "support A with B는 B로 A를 뒷받침하다는 뜻입니다.", hint: "I can support로 시작합니다." }),
        ],
      },
    ],
  };

  if (window.STUDY_SUBJECT_CONTENT) {
    window.STUDY_SUBJECT_CONTENT.english = english;
  }
})();
