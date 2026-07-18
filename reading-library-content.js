(function () {
  "use strict";

  const question = (id, prompt, choices, answer, explanation, hint) => ({
    id, question: prompt, choices, answer, explanation, hint,
  });

  // Metadata and questions only: full book texts are intentionally not copied into the app.
  // Students read through a library, purchase, or legitimate ebook source before starting a quiz.
  const books = [
    {
      id: "almond", title: "아몬드", author: "손원평", language: "한국어", grades: ["중등 1학년", "중등 2학년", "중등 3학년"],
      tags: ["성장", "공감", "소설"], days: 2,
      summary: "감정을 잘 느끼지 못하는 소년 윤재가 여러 사건과 사람들을 만나며 관계와 감정을 배워 가는 성장 소설입니다.",
      questions: [
        question("almond-1", "『아몬드』의 주인공 윤재가 가진 특징으로 가장 알맞은 것은?", ["감정을 잘 느끼거나 표현하지 못한다", "모든 운동에서 뛰어나다", "탐정이 되는 꿈을 꾼다", "해외에서만 살아왔다"], "감정을 잘 느끼거나 표현하지 못한다", "윤재는 감정을 인식하고 표현하는 데 어려움을 겪는 인물로 이야기가 시작됩니다.", "윤재가 세상을 받아들이는 방식에 주목해 보세요."),
        question("almond-2", "이 작품에서 인물 관계의 변화가 중요한 이유는 무엇인가요?", ["윤재가 타인과의 관계 속에서 성장하기 때문이다", "배경이 계속 바뀌기 때문이다", "수학 문제를 많이 풀기 때문이다", "범인을 찾는 것이 목적이기 때문이다"], "윤재가 타인과의 관계 속에서 성장하기 때문이다", "여러 인물과의 관계가 윤재의 변화와 성장을 이끄는 핵심 장치입니다.", "윤재가 혼자일 때와 다른 사람을 만난 뒤를 비교해 보세요."),
        question("almond-3", "책을 읽은 뒤 윤재의 변화가 가장 잘 드러나는 장면 하나를 골라 자신의 말로 설명해 보세요.", [], "서술형", "등장인물, 사건, 윤재의 변화가 함께 드러나도록 3문장 이상으로 정리해 보세요.", "'처음에는..., 하지만 ... 이후에는...'이라는 틀을 써 보세요."),
      ],
    },
    {
      id: "paint", title: "페인트", author: "이희영", language: "한국어", grades: ["중등 2학년", "중등 3학년", "고등 1학년"],
      tags: ["디스토피아", "가족", "토론"], days: 2,
      summary: "부모를 선택하는 제도가 있는 사회에서 청소년들이 가족과 책임의 의미를 질문하는 소설입니다.",
      questions: [
        question("paint-1", "『페인트』에서 청소년이 부모를 선택한다는 설정이 던지는 핵심 질문은 무엇인가요?", ["좋은 가족과 책임의 기준은 무엇인가", "어떤 음식이 가장 맛있는가", "어떤 운동이 가장 어려운가", "어떤 도시가 가장 큰가"], "좋은 가족과 책임의 기준은 무엇인가", "작품은 가족을 혈연만이 아니라 돌봄과 책임의 관계로 질문합니다.", "제도가 왜 만들어졌는지와 인물들이 무엇을 고민하는지 떠올려 보세요."),
        question("paint-2", "이 작품을 읽으며 토론해 볼 만한 주장으로 가장 적절한 것은?", ["부모가 될 자격은 누가 어떤 기준으로 판단해야 하는가", "모든 책의 결말은 같아야 한다", "청소년은 질문하면 안 된다", "가족은 대화할 필요가 없다"], "부모가 될 자격은 누가 어떤 기준으로 판단해야 하는가", "소설의 설정 자체가 부모 역할과 사회의 판단 기준에 대한 토론을 이끕니다.", "작품의 제도를 현실의 가족 문제와 연결해 보세요."),
        question("paint-3", "작품 속 제도에 대해 찬성 또는 반대 입장을 정하고 근거 두 가지를 써 보세요.", [], "서술형", "줄거리의 사건 하나와 자신의 생각 하나를 근거로 사용해 보세요.", "'나는 ___에 반대/찬성한다. 왜냐하면...'으로 시작해 보세요."),
      ],
    },
    {
      id: "cherry-shrimp", title: "체리새우: 비밀글입니다", author: "황영미", language: "한국어", grades: ["중등 1학년", "중등 2학년"],
      tags: ["학교", "우정", "자아"], days: 2,
      summary: "학교생활과 친구 관계 속에서 자신의 목소리를 찾으려는 청소년의 고민을 다룬 소설입니다.",
      questions: [
        question("cherry-1", "이 작품에서 학교 친구 관계를 통해 주로 드러나는 주제는 무엇인가요?", ["타인의 시선 속에서 자신의 목소리를 찾는 과정", "우주 탐사의 기술", "고대 전쟁의 승패", "요리 대회의 규칙"], "타인의 시선 속에서 자신의 목소리를 찾는 과정", "주인공은 친구 관계에서 흔들리면서도 자신이 원하는 관계와 태도를 고민합니다.", "주인공이 친구들 앞에서 어떤 선택을 하는지 떠올려 보세요."),
        question("cherry-2", "책을 읽고 난 뒤 '비밀글'이라는 표현이 상징하는 마음을 자신의 말로 적어 보세요.", [], "서술형", "작품의 제목과 등장인물의 관계를 연결해 3문장 이상으로 적어 보세요.", "숨기고 싶은 마음, 말하고 싶은 마음을 함께 생각해 보세요."),
      ],
    },
    {
      id: "wonder", title: "원더", author: "R. J. 팔라시오", language: "한국어 번역", grades: ["중등 1학년", "중등 2학년", "중등 3학년"],
      tags: ["공감", "학교", "다중 시점"], days: 2,
      summary: "얼굴이 다른 어기와 그의 가족, 친구들이 학교생활을 겪으며 친절과 용기를 배워 가는 이야기입니다.",
      questions: [
        question("wonder-1", "『원더』가 여러 인물의 시점으로 이야기를 보여 주는 효과는 무엇인가요?", ["한 사건을 여러 사람의 마음과 입장에서 이해하게 한다", "줄거리를 없애기 위해서", "정답을 하나만 만들기 위해서", "배경을 설명하지 않기 위해서"], "한 사건을 여러 사람의 마음과 입장에서 이해하게 한다", "여러 시점은 어기뿐 아니라 주변 인물의 고민과 변화도 이해하게 합니다.", "같은 사건을 본 인물들의 반응이 어떻게 다른지 생각해 보세요."),
        question("wonder-2", "작품이 말하는 친절의 의미를 책 속 사건 한 가지와 연결해 설명해 보세요.", [], "서술형", "인물, 사건, 그 사건이 보여 준 친절을 모두 포함해 보세요.", "'___가 ___했을 때, 나는 ___라고 생각했다'를 활용해 보세요."),
      ],
    },
    {
      id: "momo", title: "모모", author: "미하엘 엔데", language: "한국어 번역", grades: ["중등 2학년", "중등 3학년", "고등 1학년"],
      tags: ["시간", "철학", "고전"], days: 3,
      summary: "사람들의 시간을 빼앗는 회색 신사들과 맞서는 모모의 이야기를 통해 시간과 삶의 의미를 돌아보게 하는 작품입니다.",
      questions: [
        question("momo-1", "회색 신사들이 상징하는 대상으로 가장 알맞은 것은?", ["삶의 의미를 잃게 만드는 시간의 소비와 조급함", "자연을 보호하는 사람들", "학교의 선생님들", "여행 안내자들"], "삶의 의미를 잃게 만드는 시간의 소비와 조급함", "회색 신사들은 시간을 아낀다는 명목으로 사람들이 관계와 삶의 기쁨을 잃게 만듭니다.", "사람들이 시간을 저축한 뒤 무엇을 잃는지 떠올려 보세요."),
        question("momo-2", "『모모』를 읽고 '시간을 잘 쓴다'는 것이 무엇인지 자신의 기준으로 적어 보세요.", [], "서술형", "작품 속 인물의 변화와 자신의 하루를 비교해 4문장 이상으로 적어 보세요.", "속도와 관계, 몰입 중 하나를 꼭 포함해 보세요."),
      ],
    },
    {
      id: "holes", title: "Holes", author: "Louis Sachar", language: "English original", englishChallenge: true, grades: ["중등 2학년", "중등 3학년", "고등 1학년"],
      tags: ["영어 원서", "미스터리", "구조"], days: 3,
      summary: "Camp Green Lake에 보내진 Stanley가 매일 구멍을 파며 과거와 현재가 연결된 비밀을 발견하는 영어 원서입니다.",
      questions: [
        question("holes-1", "Why are the boys at Camp Green Lake required to dig holes?", ["The stated reason is character building, but the digging serves a hidden purpose.", "They are building a new lake for swimming.", "They are training for a sports contest.", "They are looking for water only."], "The stated reason is character building, but the digging serves a hidden purpose.", "The camp claims digging builds character, while the plot gradually reveals that the Warden is searching for something.", "Compare what the camp says with what the Warden does."),
        question("holes-2", "How does the novel connect the past and the present?", ["Events and choices from earlier generations explain current conflicts.", "It never refers to the past.", "Every chapter happens on one day.", "Only the setting changes."], "Events and choices from earlier generations explain current conflicts.", "The novel uses interwoven timelines so that earlier stories illuminate Stanley's present situation.", "Think about the separate family and town stories."),
        question("holes-3", "Write 4-5 English sentences: What does friendship change for Stanley at Camp Green Lake?", [], "서술형", "Use one concrete event from the book and at least one because-clause.", "Start with: 'Friendship changes Stanley because ...'"),
      ],
    },
    {
      id: "giver", title: "The Giver", author: "Lois Lowry", language: "English original", englishChallenge: true, grades: ["중등 2학년", "중등 3학년", "고등 1학년"],
      tags: ["영어 원서", "디스토피아", "토론"], days: 3,
      summary: "모두가 안전하고 동일하게 살아가는 공동체에서 Jonas가 기억의 수신자가 되며 선택과 감정의 의미를 깨닫는 영어 원서입니다.",
      questions: [
        question("giver-1", "What does Jonas begin to understand after receiving memories?", ["A safe society can still lose important human experiences.", "Rules are never useful.", "Memories make people physically stronger.", "Everyone should have the same job."], "A safe society can still lose important human experiences.", "The memories reveal color, pain, love, and choice that the community has removed in the name of sameness.", "Think about what the community gains and what it gives up."),
        question("giver-2", "Which question best fits the central conflict of The Giver?", ["Is safety worth giving up freedom, memory, and choice?", "Who can run fastest?", "Which food is healthiest?", "How can Jonas become famous?"], "Is safety worth giving up freedom, memory, and choice?", "Jonas's discovery forces the reader to weigh security against individuality and emotional life.", "Focus on the rules of the community."),
        question("giver-3", "Write an English response: Would you choose sameness or choice? Give two reasons from the novel.", [], "서술형", "State your choice, then support it with two details from the book.", "Use: 'I would choose ... because ...'"),
      ],
    },
    {
      id: "secret-garden", title: "The Secret Garden", author: "Frances Hodgson Burnett", language: "English original (public domain)", englishChallenge: true, grades: ["중등 1학년", "중등 2학년", "중등 3학년"],
      tags: ["영어 원서", "고전", "성장"], days: 3,
      sourceUrl: "https://www.gutenberg.org/ebooks/17396",
      summary: "Mary Lennox가 버려진 정원을 발견하고 Colin, Dickon과 함께 돌보며 서로의 삶을 변화시키는 고전 영어 원서입니다.",
      questions: [
        question("garden-1", "How does the garden affect Mary and Colin?", ["Caring for it supports their emotional and physical growth.", "It makes them want to leave school forever.", "It teaches them to avoid other people.", "It has no effect on them."], "Caring for it supports their emotional and physical growth.", "The garden becomes a place where Mary and Colin become healthier, more hopeful, and more connected to others.", "Think about their behavior before and after working in the garden."),
        question("garden-2", "Why is the garden described as 'secret' at the beginning?", ["It has been locked away and forgotten after a painful event.", "It belongs to a different country.", "It only appears at night.", "It is under the sea."], "It has been locked away and forgotten after a painful event.", "The garden was shut after Mrs. Craven's death, which gives the place both literal and emotional secrecy.", "Recall why the key and door were hidden."),
        question("garden-3", "Write an English diary entry from Mary's point of view after her first week in the garden.", [], "서술형", "Use one sensory detail and one sentence about a change in Mary.", "Try: 'Today I noticed ...' and 'I used to ..., but now ...'"),
      ],
    },
    {
      id: "animal-farm", title: "Animal Farm", author: "George Orwell", language: "English original", englishChallenge: true, grades: ["중등 3학년", "고등 1학년", "고등 2학년", "고등 3학년"],
      tags: ["영어 원서", "풍자", "정치"], days: 3,
      summary: "농장 동물들의 혁명이 권력의 집중과 언어 조작으로 변질되는 과정을 다룬 풍자 소설입니다. 고등 수준 원서 도전용입니다.",
      questions: [
        question("farm-1", "What is one major warning in Animal Farm?", ["Revolutions can fail when power is concentrated and language is manipulated.", "Animals should not live on farms.", "Work is always harmful.", "Rules are unnecessary."], "Revolutions can fail when power is concentrated and language is manipulated.", "The changing commandments and the pigs' rise show how ideals can be distorted by unchecked power.", "Track how the rules change over time."),
        question("farm-2", "Why are the changing commandments important to the novel's message?", ["They show how those in power rewrite truth to control others.", "They make the animals more athletic.", "They explain the weather.", "They create a mystery about food."], "They show how those in power rewrite truth to control others.", "The commandments visibly demonstrate the manipulation of memory and language.", "Think about who benefits when the wording changes."),
        question("farm-3", "Write an English paragraph explaining how one symbol in Animal Farm supports the novel's warning.", [], "서술형", "Name the symbol, explain what it represents, and connect it to one event.", "Use: 'The ___ symbolizes ... because ...'"),
      ],
    },
  ];

  window.STUDY_READING_LIBRARY = books;
  if (window.STUDY_SUBJECT_CONTENT?.reading) {
    window.STUDY_SUBJECT_CONTENT.reading.books = books;
  }
})();
