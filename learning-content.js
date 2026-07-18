(function () {
  const base = {
    subject: "mathematics",
    grade: "중2",
    semester: "상",
    unit: "unit1",
  };

  const makeQuestion = (id, concept, stage, type, difficulty, question, choices, answer, explanation, hint) => ({
    id,
    ...base,
    concept,
    stage,
    type,
    difficulty,
    question,
    choices,
    answer,
    explanation,
    hint,
  });

  const questions = [
    makeQuestion("m2u1-concept-01", "유리수", "concept", "true-false", 1, "-0.3은 유리수이다.", ["O", "X"], "O", "-0.3 = -3/10이므로 두 정수의 비로 나타낼 수 있어 유리수입니다.", "유리수는 분수 꼴로 나타낼 수 있는 수예요."),
    makeQuestion("m2u1-concept-02", "유리수", "concept", "multiple-choice", 1, "다음 중 유리수의 설명으로 알맞은 것은?", ["두 정수의 비로 나타낼 수 있다", "항상 자연수이다", "소수로 나타낼 수 없다", "항상 양수이다"], "두 정수의 비로 나타낼 수 있다", "유리수는 a/b(a, b는 정수, b는 0이 아님) 꼴로 나타낼 수 있습니다.", "분수의 분자와 분모 조건을 떠올려보세요."),
    makeQuestion("m2u1-concept-03", "순환소수", "concept", "fill-blank", 2, "0.272727…을 기약분수로 나타내세요.", null, "3/11", "x = 0.272727…이라 하면 100x - x = 27이므로 99x = 27, x = 3/11입니다.", "반복되는 숫자가 2자리이므로 100을 곱해보세요."),
    makeQuestion("m2u1-concept-04", "유한소수", "concept", "multiple-choice", 2, "기약분수의 분모가 어떤 소인수만 가질 때 유한소수로 나타낼 수 있나요?", ["2와 5", "2와 3", "3과 5", "5와 7"], "2와 5", "기약분수의 분모가 2와 5만을 소인수로 가질 때 유한소수가 됩니다.", "10의 소인수분해를 생각해보세요."),
    makeQuestion("m2u1-concept-05", "순환소수", "concept", "multiple-choice", 2, "1/6을 소수로 나타낸 것은?", ["0.16", "0.1666…", "0.1616…", "0.6"], "0.1666…", "1 ÷ 6 = 0.1666…으로 6이 계속 반복됩니다.", "직접 나눗셈을 해보세요."),

    makeQuestion("m2u1-basic-01", "유한소수", "basic", "short-answer", 1, "7/20을 소수로 나타내세요.", null, "0.35", "7/20 = 35/100 = 0.35입니다.", "분모를 100으로 만들어보세요."),
    makeQuestion("m2u1-basic-02", "유한소수", "basic", "multiple-choice", 1, "0.125를 기약분수로 나타낸 것은?", ["1/4", "1/8", "1/10", "1/16"], "1/8", "0.125 = 125/1000 = 1/8입니다.", "125/1000을 약분하세요."),
    makeQuestion("m2u1-basic-03", "유한소수 판별", "basic", "true-false", 2, "5/12는 유한소수로 나타낼 수 있다.", ["O", "X"], "X", "12 = 2²×3이므로 분모에 2와 5 이외의 소인수 3이 있어 순환소수가 됩니다.", "기약분수의 분모를 소인수분해하세요."),
    makeQuestion("m2u1-basic-04", "순환소수", "basic", "multiple-choice", 1, "2/9를 소수로 나타낸 것은?", ["0.2", "0.222…", "0.29", "0.2929…"], "0.222…", "2 ÷ 9 = 0.222…입니다.", "9분의 1은 0.111…입니다."),
    makeQuestion("m2u1-basic-05", "유리수", "basic", "fill-blank", 2, "-1.75를 기약분수로 나타내세요.", null, "-7/4", "-1.75 = -175/100 = -7/4입니다.", "부호를 유지한 채 175/100을 약분하세요."),

    makeQuestion("m2u1-repeat-01", "순환소수", "repeat", "short-answer", 2, "0.454545…를 기약분수로 나타내세요.", null, "5/11", "100x - x = 45이므로 x = 45/99 = 5/11입니다.", "반복되는 숫자가 2자리입니다."),
    makeQuestion("m2u1-repeat-02", "유한소수", "repeat", "short-answer", 1, "7/8을 소수로 나타내세요.", null, "0.875", "7 ÷ 8 = 0.875입니다.", "분모 8에 125를 곱하면 1000이 됩니다."),
    makeQuestion("m2u1-repeat-03", "유한소수 판별", "repeat", "true-false", 2, "분모가 40인 기약분수는 항상 유한소수로 나타낼 수 있다.", ["O", "X"], "O", "40 = 2³×5이므로 분모의 소인수가 2와 5뿐입니다.", "40을 소인수분해하세요."),
    makeQuestion("m2u1-repeat-04", "순환소수 계산", "repeat", "multiple-choice", 2, "0.333… + 0.666…의 값은?", ["0.9", "0.99", "1", "1.1"], "1", "0.333… = 1/3, 0.666… = 2/3이므로 합은 1입니다.", "두 순환소수를 분수로 바꾸어보세요."),
    makeQuestion("m2u1-repeat-05", "유한소수 판별", "repeat", "multiple-choice", 2, "다음 중 순환소수로 나타나는 것은?", ["3/20", "7/25", "13/30", "9/40"], "13/30", "30 = 2×3×5로 분모에 소인수 3이 포함되어 있습니다.", "각 분모에 2와 5 이외의 소인수가 있는지 확인하세요."),

    makeQuestion("m2u1-application-01", "순환소수의 분수 표현", "application", "short-answer", 3, "x = 0.121212…일 때 x를 기약분수로 나타내세요.", null, "4/33", "100x - x = 12이므로 99x = 12, x = 4/33입니다.", "100x와 x를 빼서 순환 부분을 없애세요."),
    makeQuestion("m2u1-application-02", "순환소수의 분수 표현", "application", "multiple-choice", 3, "0.1666…을 기약분수로 나타낸 것은?", ["1/5", "1/6", "1/7", "1/9"], "1/6", "0.1666…은 1/6의 소수 표현입니다.", "10x와 100x를 이용해 반복되는 6을 없애보세요."),
    makeQuestion("m2u1-application-03", "순환소수 계산", "application", "short-answer", 3, "0.272727… + 0.727272…의 값을 구하세요.", null, "1", "각각 3/11, 8/11이므로 합은 11/11 = 1입니다.", "두 수의 같은 자리 숫자를 더해보세요."),
    makeQuestion("m2u1-application-04", "유리수의 대소 관계", "application", "multiple-choice", 3, "1/3보다 크고 1/2보다 작은 수는?", ["0.3", "0.4", "0.5", "0.6"], "0.4", "1/3은 약 0.333…, 1/2은 0.5이므로 0.4가 사이에 있습니다.", "두 분수를 소수로 바꾸어 비교하세요."),
    makeQuestion("m2u1-application-05", "유리수 계산", "application", "multiple-choice", 3, "0.125 + 0.333…의 값은?", ["7/24", "9/24", "11/24", "13/24"], "11/24", "0.125 = 1/8, 0.333… = 1/3이므로 합은 3/24 + 8/24 = 11/24입니다.", "두 소수를 각각 분수로 바꾸세요."),

    makeQuestion("m2u1-advanced-01", "순환마디", "advanced", "short-answer", 4, "0.123123123…을 기약분수로 나타내세요.", null, "41/333", "1000x - x = 123이므로 x = 123/999 = 41/333입니다.", "순환마디가 3자리이므로 1000을 곱하세요."),
    makeQuestion("m2u1-advanced-02", "무한소수", "advanced", "true-false", 4, "0.999…은 1과 같다.", ["O", "X"], "O", "x = 0.999…라 하면 10x - x = 9이므로 x = 1입니다.", "10x - x를 계산해보세요."),
    makeQuestion("m2u1-advanced-03", "순환소수의 분수 표현", "advanced", "fill-blank", 4, "x = 0.135135…일 때 빈칸을 채우세요: 999x = __", null, "135", "1000x = 135.135135…이고 x를 빼면 999x = 135입니다.", "순환마디의 길이는 3입니다."),
    makeQuestion("m2u1-advanced-04", "유리수의 대소 관계", "advanced", "multiple-choice", 4, "다음 중 가장 작은 수는?", ["7/15", "0.47", "8/17", "0.5"], "7/15", "7/15 = 0.4666…, 8/17은 약 0.4706이므로 7/15가 가장 작습니다.", "모두 소수로 바꾸어 소수 셋째 자리까지 비교하세요."),
    makeQuestion("m2u1-advanced-05", "순환소수 계산", "advanced", "multiple-choice", 5, "0.(18) - 0.1(6)의 값은? (괄호 안 숫자는 반복)", ["1/33", "1/66", "1/99", "1/6"], "1/66", "0.(18) = 2/11, 0.1(6) = 1/6이므로 차는 12/66 - 11/66 = 1/66입니다.", "두 순환소수를 먼저 기약분수로 바꾸세요."),

    makeQuestion("m2u1-past-01", "유한소수 판별", "past", "multiple-choice", 3, "[학교시험형] 다음 중 유한소수로 나타낼 수 있는 것은?", ["7/18", "11/24", "21/40", "13/45"], "21/40", "40 = 2³×5이므로 21/40만 분모의 소인수가 2와 5뿐입니다. 출제 포인트: 기약분수의 분모 확인.", "약분 여부와 분모의 소인수를 차례로 확인하세요."),
    makeQuestion("m2u1-past-02", "순환소수의 분수 표현", "past", "short-answer", 3, "[학교시험형] 0.363636…을 기약분수로 나타내세요.", null, "4/11", "100x - x = 36에서 x = 36/99 = 4/11입니다. 출제 포인트: 순환마디 길이에 맞는 10의 거듭제곱.", "순환마디는 36입니다."),
    makeQuestion("m2u1-past-03", "순환소수 계산", "past", "multiple-choice", 4, "[학교시험형] a = 0.272727…, b = 0.727272…일 때 a+b는?", ["9/11", "10/11", "1", "12/11"], "1", "a = 3/11, b = 8/11이므로 a+b = 1입니다. 출제 포인트: 순환소수의 분수 변환과 계산.", "각 수를 11을 분모로 하는 분수로 바꾸세요."),
    makeQuestion("m2u1-past-04", "순환마디", "past", "multiple-choice", 4, "[학교시험형] 7/12을 소수로 나타낼 때 소수점 아래 20번째 숫자는?", ["3", "5", "6", "8"], "3", "7/12 = 0.58333…이므로 소수점 아래 셋째 자리부터 3이 반복됩니다. 출제 포인트: 순환이 시작되는 위치.", "7을 12로 직접 나누어 반복 시작 위치를 찾으세요."),
    makeQuestion("m2u1-past-05", "유리수 계산", "past", "short-answer", 5, "[학교시험형] 0.1(6) × 0.6의 값을 기약분수로 나타내세요.", null, "1/10", "0.1(6) = 1/6, 0.6 = 3/5이므로 곱은 1/10입니다. 출제 포인트: 순환소수와 유한소수의 혼합 계산.", "두 수를 모두 분수로 바꾸어 곱하세요."),

    makeQuestion("m2u1-final-01", "유한소수", "final", "short-answer", 2, "11/16을 소수로 나타내세요.", null, "0.6875", "11 ÷ 16 = 0.6875입니다.", "분모를 10000으로 만들 수 있어요."),
    makeQuestion("m2u1-final-02", "유한소수 판별", "final", "true-false", 2, "분모가 75인 기약분수는 유한소수로 나타낼 수 있다.", ["O", "X"], "X", "75 = 3×5²이므로 소인수 3이 포함되어 순환소수가 됩니다.", "75를 소인수분해하세요."),
    makeQuestion("m2u1-final-03", "순환소수", "final", "short-answer", 3, "0.545454…를 기약분수로 나타내세요.", null, "6/11", "54/99를 약분하면 6/11입니다.", "100x - x를 이용하세요."),
    makeQuestion("m2u1-final-04", "순환소수의 분수 표현", "final", "multiple-choice", 4, "0.2777…을 기약분수로 나타낸 것은?", ["4/15", "5/18", "7/25", "3/10"], "5/18", "0.2777… = 0.2 + 0.0777… = 1/5 + 7/90 = 5/18입니다.", "반복되지 않는 2와 반복되는 7을 나누어 생각하세요."),
    makeQuestion("m2u1-final-05", "순환소수 계산", "final", "short-answer", 2, "0.333… + 0.666…의 값을 구하세요.", null, "1", "1/3 + 2/3 = 1입니다.", "각 수를 분수로 바꾸세요."),
    makeQuestion("m2u1-final-06", "유한소수 판별", "final", "true-false", 2, "9/25는 유한소수로 나타낼 수 있다.", ["O", "X"], "O", "25 = 5²이므로 유한소수로 나타낼 수 있습니다.", "분모의 소인수를 확인하세요."),
    makeQuestion("m2u1-final-07", "순환마디", "final", "fill-blank", 3, "x = 0.125125…일 때 빈칸을 채우세요: 999x = __", null, "125", "1000x - x = 125이므로 999x = 125입니다.", "순환마디는 3자리입니다."),
    makeQuestion("m2u1-final-08", "유리수의 대소 관계", "final", "multiple-choice", 4, "다음 중 가장 작은 수는?", ["5/12", "0.42", "3/7", "7/16"], "5/12", "5/12는 약 0.4167로 나머지 수보다 작습니다.", "모두 소수로 바꾸어 비교하세요."),
    makeQuestion("m2u1-final-09", "유리수 계산", "final", "multiple-choice", 4, "0.1(6) + 0.08(3)의 값은?", ["1/5", "1/4", "1/3", "5/12"], "1/4", "0.1(6) = 1/6, 0.08(3) = 1/12이므로 합은 1/4입니다.", "두 순환소수를 분수로 바꾸세요."),
    makeQuestion("m2u1-final-10", "순환소수 계산", "final", "short-answer", 4, "0.222… × 0.333…의 값을 기약분수로 나타내세요.", null, "2/27", "0.222… = 2/9, 0.333… = 1/3이므로 곱은 2/27입니다.", "각 수를 분수로 바꾼 뒤 곱하세요."),
  ];

  window.STUDY_LEARNING_CONTENT = {
    subjects: {
      mathematics: {
        id: "mathematics",
        name: "수학",
        tracks: {
          middle2_semester1: {
            id: "middle2_semester1",
            grade: "중2",
            semester: "상",
            title: "수학 중2-상",
            units: [
              {
                id: "unit1",
                order: 1,
                title: "유리수와 순환소수",
                concepts: ["유리수", "유한소수 판별", "순환마디", "순환소수의 분수 표현", "유리수 계산"],
                slides: [
                  { title: "유리수란?", body: "두 정수 a, b를 이용해 a/b 꼴로 나타낼 수 있는 수를 유리수라고 해요. 단, b는 0이 아니에요.", formula: "유리수 = a / b  (b ≠ 0)", example: "-0.75 = -3/4이므로 유리수" },
                  { title: "유한소수 판별", body: "기약분수의 분모를 소인수분해했을 때 2와 5만 남으면 유한소수로 나타낼 수 있어요.", formula: "분모 = 2ᵐ × 5ⁿ", example: "7/40, 3/25는 유한소수" },
                  { title: "순환소수와 순환마디", body: "소수점 아래에서 일정한 숫자 배열이 한없이 반복되는 소수를 순환소수라고 해요. 반복되는 가장 짧은 부분이 순환마디예요.", formula: "0.272727… → 순환마디 27", example: "1/3 = 0.333…" },
                  { title: "순환소수를 분수로", body: "반복되는 자릿수만큼 10의 거듭제곱을 곱한 식에서 원래 식을 빼면 순환 부분을 없앨 수 있어요.", formula: "x=0.2727… → 100x-x=27", example: "99x=27 → x=3/11" },
                ],
                stages: [
                  { id: "concept", title: "📖 단원학습", type: "concept", passScore: 70, questionIds: questions.filter((item) => item.stage === "concept").map((item) => item.id) },
                  { id: "basic", title: "✏️ 기본", type: "quiz", passScore: 70, questionIds: questions.filter((item) => item.stage === "basic").map((item) => item.id) },
                  { id: "repeat", title: "📚 유형 (무한)", type: "quiz", passScore: 80, questionIds: questions.filter((item) => item.stage === "repeat").map((item) => item.id) },
                  { id: "application", title: "🔥 심화 (무한)", type: "quiz", passScore: 70, questionIds: questions.filter((item) => item.stage === "application").map((item) => item.id) },
                  { id: "advanced", title: "📝 서술형 (무한)", type: "quiz", passScore: 60, questionIds: questions.filter((item) => item.stage === "advanced").map((item) => item.id) },
                  { id: "past", title: "🎯 기출 (무한)", type: "quiz", passScore: 70, questionIds: questions.filter((item) => item.stage === "past").map((item) => item.id) },
                  { id: "final", title: "🏆 단원평가", type: "test", passScore: 80, questionIds: questions.filter((item) => item.stage === "final").map((item) => item.id) },
                ],
                questions,
              },
            ],
          },
        },
      },
    },
  };
})();
