(() => {
  "use strict";

  const STORAGE_KEY = "studyCoinEliteTestV1";
  const CURRENT_SCREEN_KEY = "studyCoinCurrentScreen";
  const ENGINE_VERSION = "elite-v1-independent";
  const TEST_SECONDS = 20 * 60;
  const MIN_QUESTIONS = 10;

  const startButton = document.querySelector("#startEliteTestButton");
  const screen = document.querySelector('[data-screen="elite-quiz"]');
  if (!startButton || !screen) return;

  const progress = document.querySelector("#eliteProgress");
  const eliteTitle = screen.querySelector(".elite-quiz-nav h2");
  const progressLabel = document.querySelector("#eliteProgressLabel");
  const route = document.querySelector("#eliteRoute");
  const currentConcept = document.querySelector("#eliteCurrentConcept");
  const timeLeft = document.querySelector("#eliteTimeLeft");
  const conceptSub = document.querySelector("#eliteConceptSub");
  const questionNumber = document.querySelector("#eliteQuestionNumber");
  const prompt = document.querySelector("#elitePrompt");
  const problem = document.querySelector("#eliteProblem");
  const answerList = document.querySelector("#eliteAnswerList");
  const selectionMessage = document.querySelector("#eliteSelectionMessage");
  const questionArea = document.querySelector("#eliteQuestionArea");
  const resultPanel = document.querySelector("#eliteResultPanel");
  const resultScore = document.querySelector("#eliteResultScore");
  const resultCount = document.querySelector("#eliteResultCount");
  const resultCopy = document.querySelector("#eliteResultCopy");
  const previousButton = document.querySelector("#elitePrevious");
  const unknownButton = document.querySelector("#eliteUnknown");
  const nextButton = document.querySelector("#eliteNext");
  const quitButton = document.querySelector("#eliteQuit");
  const quitTopButton = document.querySelector("#eliteQuitTop");
  const restartButton = document.querySelector("#eliteRestart");
  const resultHomeButton = document.querySelector("#eliteResultHome");

  let state = null;
  let timerId = null;
  const SUBJECT_KEYS = { "영어": "english", "독서": "reading", "과학": "science", "한자": "hanja" };

  function q(id, grade, concept, difficulty, problemHtml, choices, answer, explanation) {
    return {
      id: `elite-${id}`,
      grade,
      concept,
      difficulty,
      prompt: "여러 개념을 연결하여 답을 구하세요.",
      problemHtml,
      choices,
      answer,
      explanation,
    };
  }

  const BANKS = {
    "초등 4학년": [
      q("e4-01", "초등 4학년", "큰 수와 혼합 계산", 4, "5,847 + 2,968 - 1,739 = ?", ["6,976", "7,076", "7,176", "7,276"], "7,076", "5,847 + 2,968 = 8,815이고, 8,815 - 1,739 = 7,076입니다."),
      q("e4-02", "초등 4학년", "수의 규칙", 4, "연속한 세 자연수의 합이 276일 때 가운데 수는?", ["90", "91", "92", "93"], "92", "가운데 수를 기준으로 세 수의 합은 가운데 수의 3배이므로 276 ÷ 3 = 92입니다."),
      q("e4-03", "초등 4학년", "도형의 둘레", 4, "둘레가 54cm인 직사각형의 가로가 17cm일 때 세로는?", ["8cm", "9cm", "10cm", "11cm"], "10cm", "가로와 세로의 합은 27cm이므로 세로는 27 - 17 = 10cm입니다."),
      q("e4-04", "초등 4학년", "나눗셈 응용", 5, "한 상자에 24개씩 든 연필 8상자를 6명이 똑같이 나누면 한 명당 몇 개인가?", ["28개", "30개", "32개", "36개"], "32개", "전체는 24 × 8 = 192개이고, 192 ÷ 6 = 32개입니다."),
      q("e4-05", "초등 4학년", "분수의 의미", 4, "160의 3/8은 얼마인가?", ["40", "50", "60", "80"], "60", "160 ÷ 8 × 3 = 60입니다."),
      q("e4-06", "초등 4학년", "각도", 4, "한 점 둘레의 세 각 중 두 각이 95°, 125°일 때 나머지 각은?", ["130°", "135°", "140°", "145°"], "140°", "한 점 둘레의 각의 합은 360°이므로 360 - 95 - 125 = 140°입니다."),
      q("e4-07", "초등 4학년", "배수", 5, "1부터 100까지의 수 중 6의 배수이지만 9의 배수는 아닌 수는 몇 개인가?", ["9개", "10개", "11개", "12개"], "11개", "6의 배수는 16개이고, 6과 9의 공배수인 18의 배수는 5개이므로 11개입니다."),
      q("e4-08", "초등 4학년", "정사각형", 4, "둘레가 64cm인 정사각형의 넓이는?", ["128cm²", "196cm²", "256cm²", "324cm²"], "256cm²", "한 변은 64 ÷ 4 = 16cm이고 넓이는 16 × 16 = 256cm²입니다."),
      q("e4-09", "초등 4학년", "시간 계산", 4, "2시간 45분과 1시간 38분을 합하면?", ["4시간 13분", "4시간 23분", "4시간 33분", "4시간 43분"], "4시간 23분", "45분 + 38분 = 83분이므로 1시간 23분을 받아 올립니다."),
      q("e4-10", "초등 4학년", "자료 해석", 5, "네 수의 평균이 36입니다. 세 수가 28, 35, 41일 때 나머지 수는?", ["36", "38", "40", "42"], "40", "네 수의 합은 144이고 알려진 세 수의 합은 104이므로 나머지는 40입니다."),
    ],
    "초등 5학년": [
      q("e5-01", "초등 5학년", "혼합 계산", 4, "48 + 12 × (35 - 27) ÷ 6 = ?", ["56", "60", "64", "68"], "64", "괄호부터 계산하면 48 + 12 × 8 ÷ 6 = 48 + 16 = 64입니다."),
      q("e5-02", "초등 5학년", "최소공배수", 4, "18과 24의 최소공배수는?", ["48", "54", "72", "96"], "72", "18 = 2×3², 24 = 2³×3이므로 최소공배수는 2³×3² = 72입니다."),
      q("e5-03", "초등 5학년", "분수의 계산", 4, "3/4 + 5/6 - 7/12 = ?", ["5/6", "1", "13/12", "7/6"], "1", "12분의 9 + 10 - 7 = 12/12 = 1입니다."),
      q("e5-04", "초등 5학년", "넓이", 5, "가로 18cm, 세로 12cm인 직사각형에서 가로 6cm, 세로 4cm인 부분을 잘라냈습니다. 남은 넓이는?", ["180cm²", "192cm²", "198cm²", "204cm²"], "192cm²", "전체 216cm²에서 잘라낸 24cm²를 빼면 192cm²입니다."),
      q("e5-05", "초등 5학년", "평균", 4, "18, 23, 27, 31, □의 평균이 26일 때 □는?", ["29", "30", "31", "32"], "31", "전체 합 130에서 네 수의 합 99를 빼면 31입니다."),
      q("e5-06", "초등 5학년", "분수의 곱셈", 5, "7/9 × 27/14 = ?", ["1", "4/3", "3/2", "7/4"], "3/2", "약분하면 7×3/14 = 21/14 = 3/2입니다."),
      q("e5-07", "초등 5학년", "배수와 경우", 5, "1부터 60까지의 자연수 중 4의 배수 또는 6의 배수는 몇 개인가?", ["18개", "20개", "22개", "25개"], "20개", "4의 배수 15개와 6의 배수 10개에서 12의 배수 5개를 한 번 빼면 20개입니다."),
      q("e5-08", "초등 5학년", "도형의 확대", 5, "가로 12cm, 세로 8cm인 직사각형의 두 변을 각각 25% 늘리면 넓이는?", ["120cm²", "135cm²", "144cm²", "150cm²"], "150cm²", "새 가로는 15cm, 새 세로는 10cm이므로 넓이는 150cm²입니다."),
      q("e5-09", "초등 5학년", "나머지", 5, "8로 나누어도 6으로 나누어도 나머지가 3인 가장 작은 두 자리 수는?", ["21", "27", "33", "51"], "27", "8과 6의 최소공배수 24에 3을 더한 27입니다."),
      q("e5-10", "초등 5학년", "평균의 변화", 5, "네 번의 시험 평균이 78점입니다. 다섯 번째에 88점을 받으면 평균은?", ["79점", "80점", "81점", "82점"], "80점", "기존 총점 312점에 88점을 더한 400점을 5로 나누면 80점입니다."),
    ],
    "초등 6학년": [
      q("e6-01", "초등 6학년", "분수의 나눗셈", 4, "5/6 ÷ 10/9 = ?", ["2/3", "3/4", "4/5", "5/4"], "3/4", "5/6 × 9/10 = 45/60 = 3/4입니다."),
      q("e6-02", "초등 6학년", "비례배분", 4, "96을 3:5로 나눌 때 작은 수는?", ["32", "36", "40", "60"], "36", "전체 8부분 중 3부분이므로 96 ÷ 8 × 3 = 36입니다."),
      q("e6-03", "초등 6학년", "비례식", 5, "같은 일을 기계 6대가 8시간에 끝냅니다. 같은 성능의 기계 12대라면 몇 시간인가?", ["2시간", "3시간", "4시간", "6시간"], "4시간", "필요한 기계 시간은 6×8=48이므로 48÷12=4시간입니다."),
      q("e6-04", "초등 6학년", "원의 넓이", 4, "원주율을 3.14로 할 때 반지름이 7cm인 원의 넓이는?", ["43.96cm²", "87.92cm²", "153.86cm²", "307.72cm²"], "153.86cm²", "3.14 × 7 × 7 = 153.86cm²입니다."),
      q("e6-05", "초등 6학년", "직육면체의 부피", 4, "가로 12cm, 세로 8cm, 높이 5cm인 직육면체의 부피는?", ["320cm³", "400cm³", "480cm³", "520cm³"], "480cm³", "12 × 8 × 5 = 480cm³입니다."),
      q("e6-06", "초등 6학년", "연비례", 5, "빨간 구슬과 파란 구슬 수의 비가 4:7이고, 파란 구슬과 노란 구슬의 비가 14:15입니다. 세 색 구슬이 모두 74개라면 빨간 구슬은?", ["14개", "16개", "18개", "20개"], "16개", "세 수의 비는 8:14:15이고 합이 37입니다. 74는 2배이므로 빨간 구슬은 16개입니다."),
      q("e6-07", "초등 6학년", "경우의 수", 4, "셔츠 4벌, 바지 3벌, 신발 2켤레 중 하나씩 골라 입는 방법은?", ["9가지", "12가지", "18가지", "24가지"], "24가지", "4 × 3 × 2 = 24가지입니다."),
      q("e6-08", "초등 6학년", "백분율", 5, "소금 60g이 든 20% 소금물 300g에 물 100g을 더하면 농도는?", ["12%", "15%", "16%", "18%"], "15%", "소금은 60g 그대로이고 전체는 400g이므로 60/400=15%입니다."),
      q("e6-09", "초등 6학년", "축척", 5, "축척이 1:50,000인 지도에서 7.2cm인 실제 거리는?", ["2.6km", "3.2km", "3.6km", "36km"], "3.6km", "7.2×50,000=360,000cm=3.6km입니다."),
      q("e6-10", "초등 6학년", "분수와 비", 5, "어떤 수의 3/5이 42일 때 그 수의 2/7은?", ["16", "18", "20", "24"], "20", "어떤 수는 42×5/3=70이고, 70×2/7=20입니다."),
    ],
    "중등 1학년": [
      q("m1-01", "중등 1학년", "정수의 혼합 계산", 4, "-3{4 - 2(-5)} + 7 = ?", ["-49", "-42", "-35", "35"], "-35", "괄호 안은 14이고 -3×14+7=-35입니다."),
      q("m1-02", "중등 1학년", "최대공약수와 최소공배수", 5, "두 자연수의 최대공약수가 12, 최소공배수가 180입니다. 한 수가 36이면 다른 수는?", ["48", "54", "60", "72"], "60", "두 수의 곱은 최대공약수×최소공배수이므로 다른 수는 12×180÷36=60입니다."),
      q("m1-03", "중등 1학년", "일차방정식", 4, "3(2x - 5) - 2(x + 4) = 5일 때 x는?", ["5", "6", "7", "8"], "7", "정리하면 4x-23=5이므로 x=7입니다."),
      q("m1-04", "중등 1학년", "반비례", 4, "y가 x에 반비례하고 x=3일 때 y=8입니다. x=-6일 때 y는?", ["-8", "-4", "4", "8"], "-4", "xy=24이므로 x=-6일 때 y=-4입니다."),
      q("m1-05", "중등 1학년", "좌표와 넓이", 5, "세 점 (0,0), (6,0), (2,5)를 꼭짓점으로 하는 삼각형의 넓이는?", ["12", "15", "18", "30"], "15", "밑변 6, 높이 5이므로 넓이는 6×5÷2=15입니다."),
      q("m1-06", "중등 1학년", "약수의 개수", 4, "2³×3²의 양의 약수의 개수는?", ["10개", "12개", "15개", "18개"], "12개", "지수에 1씩 더해 (3+1)(2+1)=12개입니다."),
      q("m1-07", "중등 1학년", "문자와 식", 5, "두 자리 자연수의 각 자리 숫자의 합은 11이고, 숫자를 거꾸로 쓴 수는 원래 수보다 27 큽니다. 원래 수는?", ["38", "47", "56", "65"], "47", "십의 자리 a, 일의 자리 b라 하면 a+b=11, b-a=3이므로 a=4,b=7입니다."),
      q("m1-08", "중등 1학년", "삼각형의 외각", 4, "삼각형의 한 외각이 125°이고 이와 떨어진 두 내각의 비가 2:3일 때 작은 내각은?", ["45°", "50°", "55°", "75°"], "50°", "두 내각의 합이 125°이고 비가 2:3이므로 작은 각은 125×2/5=50°입니다."),
      q("m1-09", "중등 1학년", "절댓값 방정식", 5, "|2x - 3| = 7의 두 해의 합은?", ["-3", "0", "3", "7"], "3", "2x-3=7 또는 -7이므로 x=5,-2이고 합은 3입니다."),
      q("m1-10", "중등 1학년", "수열의 규칙", 5, "2, 6, 12, 20, 30, …의 규칙을 따를 때 10번째 수는?", ["90", "100", "110", "120"], "110", "n번째 수는 n(n+1)이므로 10×11=110입니다."),
    ],
    "중등 2학년": [
      q("m2-01", "중등 2학년", "연립방정식 심화", 5, "3x + 2y = 52, x - y = 4일 때 x² - y²의 값은?", ["64", "72", "80", "96"], "80", "x=12,y=8이고 x²-y²=(x-y)(x+y)=4×20=80입니다."),
      q("m2-02", "중등 2학년", "일차함수의 교점", 5, "두 직선 y=2x-4, y=-x+8의 교점이 (a,b)일 때 a²+b²은?", ["24", "28", "32", "36"], "32", "2x-4=-x+8에서 x=4,y=4이므로 a²+b²=32입니다."),
      q("m2-03", "중등 2학년", "경우의 수와 확률", 5, "1,2,3,4,5 중 서로 다른 세 숫자로 만든 세 자리 수를 하나 고릅니다. 300보다 큰 짝수일 확률은?", ["1/5", "1/4", "3/10", "1/3"], "1/4", "전체 60개 중 조건을 만족하는 수는 15개이므로 확률은 15/60=1/4입니다."),
      q("m2-04", "중등 2학년", "연립방정식 활용", 5, "A와 B의 가격이 3A+2B=24,000원입니다. A는 20% 할인, B는 10% 인상했더니 3A+2B가 22,800원이 되었습니다. A의 원래 가격은?", ["3,000원", "4,000원", "5,000원", "6,000원"], "4,000원", "두 식의 차를 이용하면 -0.6A+0.2B=-1,200이고 원래 식과 함께 풀어 A=4,000입니다."),
      q("m2-05", "중등 2학년", "좌표와 직선", 5, "A(2,5), B(-4,-7)를 지나는 직선의 x절편은?", ["-1", "-1/2", "1/2", "1"], "-1/2", "기울기는 2이고 직선은 y=2x+1입니다. y=0이면 x=-1/2입니다."),
      q("m2-06", "중등 2학년", "확률 심화", 5, "1부터 8까지 적힌 카드에서 두 장을 동시에 뽑습니다. 곱이 3의 배수이고 합이 홀수일 확률은?", ["3/14", "1/4", "2/7", "5/14"], "1/4", "전체 28가지 중 조건을 만족하는 조합은 7가지이므로 7/28=1/4입니다."),
      q("m2-07", "중등 2학년", "삼각형의 외각", 5, "삼각형의 한 외각이 132°이고 떨어진 두 내각 중 하나가 다른 하나의 2배입니다. 큰 내각은?", ["44°", "66°", "88°", "92°"], "88°", "두 내각의 합이 132°이고 비가 2:1이므로 큰 각은 88°입니다."),
      q("m2-08", "중등 2학년", "식의 계산 심화", 5, "x=5일 때 2(x-1)(x+1) - (x-1)² - (x+1)(x-3)의 값은?", ["16", "18", "20", "24"], "20", "대입하면 48-16-12=20입니다."),
      q("m2-09", "중등 2학년", "연립방정식", 5, "2x+3y=19, 4x-y=3일 때 2x-y의 값은?", ["-3", "-1", "1", "3"], "-1", "두 식을 풀면 x=2,y=5이므로 2x-y=-1입니다."),
      q("m2-10", "중등 2학년", "일차함수", 5, "점 (2,5)를 지나고 y=-3x+1과 평행한 직선의 y절편은?", ["7", "9", "11", "13"], "11", "기울기가 -3이므로 y=-3x+b에 (2,5)를 대입하면 b=11입니다."),
      q("m2-11", "중등 2학년", "확률과 방정식", 5, "두 주사위를 던져 나온 눈의 합이 8일 때, 두 눈의 차가 2일 조건부 확률은?", ["1/5", "2/5", "1/2", "3/5"], "2/5", "합이 8인 5가지 중 (3,5),(5,3) 두 가지가 조건을 만족합니다."),
      q("m2-12", "중등 2학년", "함수 활용", 5, "일차함수 f(x)=ax+b에서 f(2)=7, f(-1)=-2입니다. f(f(0))의 값은?", ["1", "4", "7", "10"], "4", "a=3,b=1이므로 f(0)=1이고 f(f(0))=f(1)=4입니다.")
    ],
    "중등 3학년": [
      q("m3-01", "중등 3학년", "제곱근 계산", 4, "√75 - √12 = ?", ["√3", "2√3", "3√3", "4√3"], "3√3", "√75=5√3, √12=2√3이므로 3√3입니다."),
      q("m3-02", "중등 3학년", "다항식의 계산", 5, "(x+2)(x-3) - (x-1)²을 간단히 하면?", ["x-7", "x-5", "2x-7", "2x-5"], "x-7", "전개하여 정리하면 x²-x-6-(x²-2x+1)=x-7입니다."),
      q("m3-03", "중등 3학년", "이차방정식", 5, "x²-7x+10=0의 두 근의 제곱의 합은?", ["25", "27", "29", "31"], "29", "두 근은 2,5이므로 제곱의 합은 4+25=29입니다."),
      q("m3-04", "중등 3학년", "이차함수", 5, "y=x²-6x+5의 최솟값은?", ["-5", "-4", "-3", "4"], "-4", "y=(x-3)²-4이므로 최솟값은 -4입니다."),
      q("m3-05", "중등 3학년", "피타고라스 정리", 4, "두 직각변의 길이가 9, 12인 직각삼각형의 빗변은?", ["13", "14", "15", "16"], "15", "√(9²+12²)=√225=15입니다."),
      q("m3-06", "중등 3학년", "삼각비", 5, "예각 θ에 대하여 tanθ=3/4일 때 sinθ는?", ["3/5", "4/5", "3/4", "4/3"], "3/5", "3:4:5 직각삼각형을 생각하면 sinθ=3/5입니다."),
      q("m3-07", "중등 3학년", "원의 성질", 4, "한 호에 대한 중심각이 110°일 때 같은 호에 대한 원주각은?", ["45°", "50°", "55°", "60°"], "55°", "원주각은 같은 호에 대한 중심각의 절반입니다."),
      q("m3-08", "중등 3학년", "분산", 5, "자료 2,4,4,6의 분산은?", ["1", "2", "3", "4"], "2", "평균은 4이고 편차 제곱의 합은 8이므로 분산은 8÷4=2입니다."),
      q("m3-09", "중등 3학년", "근과 계수", 5, "x²-4x-1=0의 두 근을 α,β라 할 때 α²+β²은?", ["14", "16", "18", "20"], "18", "(α+β)²-2αβ=4²-2(-1)=18입니다."),
      q("m3-10", "중등 3학년", "이차함수의 그래프", 5, "y=-2(x-1)²+8의 두 x절편 사이의 거리는?", ["2", "3", "4", "5"], "4", "x절편은 x=-1,3이므로 거리는 4입니다."),
    ],
    "고등 1학년": [
      q("h1-01", "고등 1학년", "다항식", 4, "P(x)=x⁴-3x²+5를 x-2로 나눈 나머지는?", ["5", "7", "9", "11"], "9", "나머지정리에 의해 P(2)=16-12+5=9입니다."),
      q("h1-02", "고등 1학년", "이차방정식의 근", 5, "x²-(m+1)x+m=0의 두 근의 차의 절댓값이 3일 때 가능한 모든 m의 합은?", ["-2", "0", "2", "4"], "2", "판별식은 (m-1)²이고 그 제곱근이 3이므로 m=4,-2, 합은 2입니다."),
      q("h1-03", "고등 1학년", "부등식", 4, "|2x-1|<5의 해를 a<x<b라 할 때 b-a는?", ["3", "4", "5", "6"], "5", "-5<2x-1<5에서 -2<x<3이므로 길이는 5입니다."),
      q("h1-04", "고등 1학년", "경우의 수", 5, "8명 중 서로 이웃하지 않게 3명을 한 줄의 자리에서 고르는 방법은?", ["16", "20", "24", "28"], "20", "이웃하지 않게 고르는 공식으로 C(8-3+1,3)=C(6,3)=20입니다."),
      q("h1-05", "고등 1학년", "행렬", 4, "행렬 [[3,2],[5,4]]의 행렬식은?", ["-2", "0", "2", "4"], "2", "3×4-2×5=2입니다."),
      q("h1-06", "고등 1학년", "지수방정식", 5, "2^(x+1)=8^(x-1)일 때 x는?", ["1", "2", "3", "4"], "2", "밑을 2로 통일하면 x+1=3x-3이므로 x=2입니다."),
      q("h1-07", "고등 1학년", "로그방정식", 5, "log₂(x-1)+log₂(x+1)=3일 때 x는?", ["2", "3", "4", "5"], "3", "정의역 x>1에서 x²-1=8이므로 x=3입니다."),
      q("h1-08", "고등 1학년", "삼각함수", 5, "sinθ=3/5이고 θ가 제2사분면의 각일 때 sin2θ는?", ["-24/25", "-12/25", "12/25", "24/25"], "-24/25", "cosθ=-4/5이므로 sin2θ=2sinθcosθ=-24/25입니다."),
      q("h1-09", "고등 1학년", "등차수열", 5, "등차수열에서 a₃=7, a₈=22일 때 첫 10항의 합은?", ["135", "140", "145", "150"], "145", "공차는 3, 첫항은 1, 열 번째 항은 28이므로 합은 145입니다."),
      q("h1-10", "고등 1학년", "등비수열", 5, "등비수열에서 a₂=6, a₅=162이고 공비가 양수일 때 첫 5항의 합은?", ["240", "242", "244", "246"], "242", "공비는 3, 첫항은 2이므로 합은 2(3⁵-1)/(3-1)=242입니다."),
    ],
    "고등 2학년": [
      q("h2-01", "고등 2학년", "함수의 극한", 4, "lim(x→3) (x²-9)/(x-3)의 값은?", ["3", "5", "6", "9"], "6", "약분하면 x+3이고 극한값은 6입니다."),
      q("h2-02", "고등 2학년", "미분", 4, "f(x)=x³-3x²+2일 때 f'(2)는?", ["-2", "0", "2", "4"], "0", "f'(x)=3x²-6x이므로 f'(2)=0입니다."),
      q("h2-03", "고등 2학년", "접선", 5, "곡선 y=x² 위의 x=2인 점에서의 접선의 y절편은?", ["-8", "-4", "0", "4"], "-4", "접선의 기울기는 4이고 y-4=4(x-2), 즉 y=4x-4입니다."),
      q("h2-04", "고등 2학년", "정적분", 4, "∫₀²(3x²+1)dx의 값은?", ["8", "9", "10", "12"], "10", "원시함수 x³+x에 0과 2를 대입하면 10입니다."),
      q("h2-05", "고등 2학년", "극대와 극소", 5, "f(x)=x³-6x²+9x의 극댓값과 극솟값의 차는?", ["2", "4", "6", "8"], "4", "극댓값은 f(1)=4, 극솟값은 f(3)=0이므로 차는 4입니다."),
      q("h2-06", "고등 2학년", "넓이와 적분", 5, "0≤x≤1에서 y=x와 y=x²로 둘러싸인 넓이는?", ["1/12", "1/6", "1/4", "1/3"], "1/6", "∫₀¹(x-x²)dx=1/2-1/3=1/6입니다."),
      q("h2-07", "고등 2학년", "수열의 극한", 5, "lim(n→∞) (3n²-1)/(n²+2)의 값은?", ["1", "2", "3", "∞"], "3", "최고차항의 계수비가 3입니다."),
      q("h2-08", "고등 2학년", "합성함수의 미분", 5, "f(x)=(x²+1)³일 때 f'(1)은?", ["12", "18", "24", "30"], "24", "f'(x)=6x(x²+1)²이므로 f'(1)=24입니다."),
      q("h2-09", "고등 2학년", "정적분의 성질", 5, "∫₋₁¹(x³+2x²+1)dx의 값은?", ["8/3", "3", "10/3", "4"], "10/3", "홀함수 부분은 0이고 2x²+1을 적분하면 4/3+2=10/3입니다."),
      q("h2-10", "고등 2학년", "속도와 거리", 5, "속도가 v(t)=3t²-6t+4일 때 t=0부터 t=2까지의 변위는?", ["2", "4", "6", "8"], "4", "속도를 0부터 2까지 적분하면 [t³-3t²+4t]₀²=4입니다."),
    ],
    "고등 3학년": [
      q("h3-01", "고등 3학년", "삼각함수의 극한", 5, "lim(x→0) sin(3x)/x의 값은?", ["1", "2", "3", "6"], "3", "sin(3x)/(3x)의 극한이 1이므로 전체 극한은 3입니다."),
      q("h3-02", "고등 3학년", "로그함수 미분", 5, "f(x)=ln(x²+1)일 때 f'(1)은?", ["1/2", "1", "2", "e"], "1", "f'(x)=2x/(x²+1)이므로 f'(1)=1입니다."),
      q("h3-03", "고등 3학년", "치환적분", 5, "∫₀¹ x·e^(x²) dx의 값은?", ["e-1", "(e-1)/2", "e/2", "1/2"], "(e-1)/2", "u=x²로 치환하면 1/2∫₀¹e^u du=(e-1)/2입니다."),
      q("h3-04", "고등 3학년", "조건부확률", 5, "두 주사위를 던질 때 첫째 눈이 4보다 크다는 조건에서 두 눈의 합이 짝수일 확률은?", ["1/3", "5/12", "1/2", "7/12"], "1/2", "조건에 맞는 12가지 중 합이 짝수인 경우는 6가지입니다."),
      q("h3-05", "고등 3학년", "이항정리", 5, "(1+x)⁸의 전개식에서 x³의 계수는?", ["28", "48", "56", "70"], "56", "계수는 8C3=56입니다."),
      q("h3-06", "고등 3학년", "평면벡터", 5, "a=(2,-1), b=(1,3)일 때 a·b는?", ["-1", "0", "1", "5"], "-1", "2×1+(-1)×3=-1입니다."),
      q("h3-07", "고등 3학년", "이차곡선", 5, "포물선 y²=8x의 초점 좌표는?", ["(1,0)", "(2,0)", "(4,0)", "(0,2)"], "(2,0)", "y²=4px에서 4p=8이므로 p=2입니다."),
      q("h3-08", "고등 3학년", "공간좌표", 5, "점 (1,2,3)과 원점 사이의 거리는?", ["√10", "√12", "√14", "4"], "√14", "거리 공식으로 √(1²+2²+3²)=√14입니다."),
      q("h3-09", "고등 3학년", "무한급수", 5, "Σ(n=1→∞) 1/[n(n+1)]의 합은?", ["1/2", "1", "3/2", "2"], "1", "1/[n(n+1)]=1/n-1/(n+1)이므로 부분합의 극한은 1입니다."),
      q("h3-10", "고등 3학년", "정규분포", 5, "정규분포 N(50, 4²)에서 Z=(X-50)/4입니다. X=58에 대응하는 Z는?", ["1", "1.5", "2", "2.5"], "2", "(58-50)/4=2입니다."),
    ],
  };

  // 6차-A 문제 메타데이터 인덱스가 원문을 복제하지 않고 참조할 수 있도록 공개합니다.
  window.STUDY_ELITE_MATH_BANKS = BANKS;

  // 승인된 중3 수학·영어 모델이 준비되면 기존 화면은 공통 Elite 엔진에만 위임합니다.
  // 아래의 기존 문제은행과 호환 런타임은 삭제하지 않고 구형 로딩의 fallback으로 보존합니다.
  if (window.STUDY_ELITE_UI?.mount) {
    window.STUDY_ELITE_UI.mount();
    return;
  }

  function validateBanks() {
    const ids = new Set();
    const errors = [];
    Object.entries(BANKS).forEach(([grade, questions]) => {
      if (questions.length < MIN_QUESTIONS) errors.push(`${grade}: 문항 수 부족`);
      questions.forEach((item) => {
        if (ids.has(item.id)) errors.push(`${item.id}: 중복 ID`);
        ids.add(item.id);
        if (item.grade !== grade) errors.push(`${item.id}: 학년 불일치`);
        if (item.choices.length !== 4) errors.push(`${item.id}: 보기는 4개여야 함`);
        if (!item.choices.includes(item.answer)) errors.push(`${item.id}: 정답이 보기에 없음`);
        if (item.difficulty < 4) errors.push(`${item.id}: Elite 난이도 미달`);
      });
    });
    return errors;
  }

  const bankErrors = validateBanks();
  if (bankErrors.length) {
    console.error("Elite question bank validation failed", bankErrors);
    startButton.disabled = true;
    startButton.title = "Elite 문제은행 검증에 실패했습니다.";
    return;
  }

  function getSelectedGrade() {
    return document.querySelector("[data-grade].selected")?.dataset.grade || "중등 2학년";
  }

  function subjectBank(subject, grade) {
    if (!subject || subject === "수학") return BANKS[grade] || BANKS["중등 2학년"];
    const content = window.STUDY_SUBJECT_CONTENT?.[SUBJECT_KEYS[subject]];
    const stageQuestions = (content?.stages || []).flatMap((stage) => (stage.questions || [])
      .filter((item) => item.answer && Array.isArray(item.choices) && item.choices.length >= 4)
      .map((item) => ({ item, concept: stage.title })));
    const bookQuestions = (content?.books || []).flatMap((book) => (book.questions || [])
      .filter((item) => item.answer && Array.isArray(item.choices) && item.choices.length >= 4)
      .map((item) => ({ item, concept: book.title })));
    return [...stageQuestions, ...bookQuestions].map(({ item, concept }, index) => ({
      id: `elite-${SUBJECT_KEYS[subject]}-${item.id || index}`,
      grade,
      subject,
      concept,
      difficulty: Math.max(4, Number(item.difficulty || 4)),
      prompt: `${subject} 개념을 연결해 문제를 해결해보세요.`,
      problemHtml: item.question,
      choices: item.choices.slice(0, 4).map(String),
      answer: String(item.answer),
      explanation: item.explanation || `${concept} 개념을 다시 확인해보세요.`,
    }));
  }

  function shuffledQuestions(grade, subject) {
    const source = subjectBank(subject, grade);
    return source
      .map((item) => ({ item, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item)
      .slice(0, Math.max(MIN_QUESTIONS, 12));
  }

  function createState(subject = "수학") {
    const grade = getSelectedGrade();
    return {
      version: ENGINE_VERSION,
      grade,
      subject,
      questionIds: shuffledQuestions(grade, subject).map((item) => item.id),
      currentIndex: 0,
      responses: {},
      remainingSeconds: TEST_SECONDS,
      startedAt: Date.now(),
      updatedAt: Date.now(),
      completed: false,
    };
  }

  function getBank() {
    return subjectBank(state?.subject || "수학", state?.grade);
  }

  function getQuestions() {
    const byId = new Map(getBank().map((item) => [item.id, item]));
    return (state?.questionIds || []).map((id) => byId.get(id)).filter(Boolean);
  }

  function getCurrentQuestion() {
    return getQuestions()[state.currentIndex];
  }

  function saveState() {
    if (!state) return;
    state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== ENGINE_VERSION || subjectBank(saved.subject || "수학", saved.grade).length < MIN_QUESTIONS) return null;
      return saved;
    } catch {
      return null;
    }
  }

  function showEliteScreen() {
    document.querySelectorAll("[data-screen]").forEach((item) => {
      item.classList.toggle("active", item.dataset.screen === "elite-quiz");
    });
    localStorage.setItem(CURRENT_SCREEN_KEY, "elite-quiz");
    window.scrollTo(0, 0);
  }

  function showHome() {
    stopTimer();
    document.querySelectorAll("[data-screen]").forEach((item) => {
      item.classList.toggle("active", item.dataset.screen === "home");
    });
    localStorage.setItem(CURRENT_SCREEN_KEY, "home");
    window.scrollTo(0, 0);
  }

  function formatTime(seconds) {
    const safe = Math.max(0, seconds);
    const minutes = Math.floor(safe / 60);
    const rest = safe % 60;
    return `${minutes}:${String(rest).padStart(2, "0")}`;
  }

  function render() {
    if (!state) return;
    if (state.completed) {
      renderResult();
      return;
    }

    const questions = getQuestions();
    const item = questions[state.currentIndex];
    if (!item) {
      finishTest();
      return;
    }

    questionArea.classList.remove("hidden");
    resultPanel.classList.add("hidden");
    const response = state.responses[item.id];
    const answeredCount = Object.keys(state.responses).length;
    const analysisPercent = Math.min(95, Math.round((answeredCount / MIN_QUESTIONS) * 90));

    progress.style.width = `${analysisPercent}%`;
    if (eliteTitle) eliteTitle.textContent = `${state.subject || "수학"} Elite 레벨테스트`;
    progressLabel.textContent = `Elite 분석 ${analysisPercent}%`;
    route.textContent = `${state.grade} ${state.subject || "수학"} 상위권 전용 · 일반 레벨테스트와 분리된 심화 진단`;
    currentConcept.textContent = item.concept;
    conceptSub.textContent = `${item.concept} · 난이도 ${item.difficulty}`;
    timeLeft.textContent = formatTime(state.remainingSeconds);
    questionNumber.textContent = `E.${state.currentIndex + 1}`;
    prompt.textContent = item.prompt;
    problem.innerHTML = item.problemHtml;
    answerList.innerHTML = "";

    item.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.answer = choice;
      button.innerHTML = `<b>${index + 1}</b><span>${choice}</span>`;
      button.classList.toggle("selected", response?.answer === choice && !response?.unknown);
      button.addEventListener("click", () => selectAnswer(choice));
      answerList.appendChild(button);
    });

    selectionMessage.classList.remove("error");
    selectionMessage.textContent = response?.unknown
      ? "모름으로 표시했습니다. 다음 문제에서 다른 개념을 확인합니다."
      : response?.answer
        ? "선택한 답은 다음 문제를 누르기 전까지 바꿀 수 있습니다."
        : "답을 선택한 뒤 다음 문제를 눌러주세요.";
    previousButton.disabled = state.currentIndex === 0;
    nextButton.textContent = state.currentIndex >= questions.length - 1 ? "결과 보기" : "다음 문제";
  }

  function selectAnswer(answer) {
    const item = getCurrentQuestion();
    if (!item) return;
    state.responses[item.id] = {
      answer,
      unknown: false,
      correct: answer === item.answer,
      answeredAt: Date.now(),
    };
    saveState();
    render();
  }

  function markUnknown() {
    const item = getCurrentQuestion();
    if (!item) return;
    state.responses[item.id] = {
      answer: null,
      unknown: true,
      correct: false,
      answeredAt: Date.now(),
    };
    saveState();
    goNext();
  }

  function goNext() {
    const item = getCurrentQuestion();
    if (!item || !state.responses[item.id]) {
      selectionMessage.classList.add("error");
      selectionMessage.textContent = "답을 선택하거나 모름을 눌러주세요.";
      return;
    }

    if (state.currentIndex >= getQuestions().length - 1) {
      finishTest();
      return;
    }
    state.currentIndex += 1;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrevious() {
    if (state.currentIndex <= 0) return;
    state.currentIndex -= 1;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishTest() {
    state.completed = true;
    saveState();
    stopTimer();
    renderResult();
  }

  function renderResult() {
    const questions = getQuestions();
    const responses = Object.values(state.responses);
    const correct = responses.filter((item) => item.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    const weakConcepts = questions
      .filter((item) => !state.responses[item.id]?.correct)
      .map((item) => item.concept)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 3);

    questionArea.classList.add("hidden");
    resultPanel.classList.remove("hidden");
    progress.style.width = "100%";
    progressLabel.textContent = "Elite 분석 완료";
    resultScore.textContent = `${score}점`;
    resultCount.textContent = `${questions.length}문제 중 ${correct}문제 정답`;
    resultCopy.textContent = weakConcepts.length
      ? `보완이 필요한 상위권 개념: ${weakConcepts.join(", ")}`
      : "모든 상위권 심화 개념을 안정적으로 해결했습니다.";
    timeLeft.textContent = formatTime(state.remainingSeconds);
  }

  function startTimer() {
    stopTimer();
    timerId = window.setInterval(() => {
      if (!state || state.completed) return;
      state.remainingSeconds = Math.max(0, state.remainingSeconds - 1);
      timeLeft.textContent = formatTime(state.remainingSeconds);
      if (state.remainingSeconds === 0) {
        saveState();
        finishTest();
      } else if (state.remainingSeconds % 5 === 0) {
        saveState();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function startNewTest(subject = "수학") {
    if (subjectBank(subject, getSelectedGrade()).length < MIN_QUESTIONS) {
      alert(`${subject} Elite Test 문제를 준비하지 못했습니다.`);
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    state = createState(subject);
    saveState();
    showEliteScreen();
    render();
    startTimer();
  }

  function resumeIfNeeded() {
    if (localStorage.getItem(CURRENT_SCREEN_KEY) !== "elite-quiz") return;
    state = loadState();
    if (!state) {
      showHome();
      return;
    }
    showEliteScreen();
    render();
    if (!state.completed) startTimer();
  }

  document.addEventListener("study:start-elite-test", (event) => startNewTest(event.detail?.subject || "수학"));
  nextButton.addEventListener("click", goNext);
  unknownButton.addEventListener("click", markUnknown);
  previousButton.addEventListener("click", goPrevious);
  quitButton.addEventListener("click", () => {
    saveState();
    showHome();
  });
  quitTopButton.addEventListener("click", () => {
    saveState();
    showHome();
  });
  restartButton.addEventListener("click", () => startNewTest(state?.subject || "수학"));
  resultHomeButton.addEventListener("click", showHome);
  window.addEventListener("beforeunload", saveState);

  resumeIfNeeded();
})();
