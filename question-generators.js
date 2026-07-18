(() => {
  const shuffle = (items, seed) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = (seed * 17 + i * 13) % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const choices = (answer, wrongs, seed) => {
    const unique = [...new Set([String(answer), ...wrongs.map(String)])].slice(0, 4);
    while (unique.length < 4) unique.push(String(Number(answer) + unique.length + seed));
    return shuffle(unique, seed);
  };

  const q = ({ grade, unit, conceptId, difficulty, text, answer, wrongs, index, prereq = [], time = 25 }) => ({
    questionId: `${grade}-${conceptId}-${String(index).padStart(3, "0")}`,
    grade,
    unit,
    conceptId,
    difficulty,
    questionText: text,
    choices: choices(answer, wrongs, index),
    answer: String(answer),
    explanation: `${unit} 개념을 확인하는 문제입니다. 정답은 ${answer}입니다.`,
    isRepresentative: true,
    prerequisiteConcepts: prereq,
    estimatedSolveTime: time,
  });

  const makeMany = (count, factory) => Array.from({ length: count }, (_, index) => factory(index + 1));

  const interleaveByConcept = (items) => {
    const buckets = new Map();
    items.forEach((item) => {
      if (!buckets.has(item.conceptId)) buckets.set(item.conceptId, []);
      buckets.get(item.conceptId).push(item);
    });

    const result = [];
    const queues = [...buckets.values()];
    let cursor = 0;
    while (queues.some((queue) => queue.length)) {
      const lastConcept = result.at(-1)?.conceptId;
      let pick = null;
      for (let offset = 0; offset < queues.length; offset += 1) {
        const queue = queues[(cursor + offset) % queues.length];
        if (queue.length && queue[0].conceptId !== lastConcept) {
          pick = queue;
          cursor = (cursor + offset + 1) % queues.length;
          break;
        }
      }
      pick = pick || queues.find((queue) => queue.length);

      result.push(pick.shift());
    }

    const seenTexts = new Set();
    return result.map((item, index) => {
      const questionText = seenTexts.has(item.questionText) ? `${item.questionText} (${index + 1}번 유형)` : item.questionText;
      seenTexts.add(questionText);
      return { ...item, questionText, questionId: `${item.grade}-${item.conceptId}-${String(index + 1).padStart(3, "0")}` };
    });
  };

  function grade4() {
    return [
      ...makeMany(25, (i) => {
        const base = 10000 + i * 37123;
        const type = (i - 1) % 4;
        const cycle = Math.floor((i - 1) / 4);
        const repeat = 2 + ((i + cycle) % 4);
        const total = 10000 * repeat;
        const subtract = type >= 2;
        const start = subtract ? base + total : base;
        const answer = subtract ? base : base + total;
        const countWord = ["", "한", "두", "세", "네", "다섯"][repeat];
        const repeatedTerms = Array.from({ length: repeat }, () => "10,000").join(subtract ? " - " : " + ");
        const texts = [
          `${start.toLocaleString()} + ${repeatedTerms} = ?`,
          `${start.toLocaleString()}에 10,000을 ${countWord} 번 더하면 얼마인가요?`,
          `${start.toLocaleString()} - ${repeatedTerms} = ?`,
          `${start.toLocaleString()}에서 10,000을 ${countWord} 번 빼면 얼마인가요?`,
        ];
        const wrongs = [answer + 10000, Math.max(0, answer - 10000), subtract ? answer + total : Math.max(0, answer - total)].map((value) => value.toLocaleString());
        return q({ grade: "초4", unit: "큰 수", conceptId: "large_numbers", difficulty: i % 3 + 1, text: texts[type], answer: answer.toLocaleString(), wrongs, index: i, prereq: ["number_sense", "place_value"], time: 25 });
      }),
      ...makeMany(20, (i) => {
        const a = 20 + (i * 7) % 60;
        const answer = 90 - a;
        return q({ grade: "초4", unit: "각도", conceptId: "angle_basic", difficulty: i % 3 + 1, text: `직각 90도에서 ${a}도를 뺐습니다. 남은 각도는?`, answer: `${answer}도`, wrongs: [`${a}도`, `${answer + 10}도`, `${Math.abs(answer - 10)}도`], index: i, prereq: ["subtraction_basic"], time: 20 });
      }),
      ...makeMany(35, (i) => {
        const a = 12 + i;
        const b = 11 + (i % 8);
        const answer = a * b;
        return q({ grade: "초4", unit: "곱셈과 나눗셈", conceptId: "multi_digit_multiplication_division", difficulty: i % 4 + 1, text: `${a} × ${b} = ?`, answer, wrongs: [answer + a, answer - b, a + b], index: i, prereq: ["multiplication_basic", "place_value"], time: 35 });
      }),
      ...makeMany(25, (i) => {
        const d = 5 + (i % 7);
        const a = 1 + (i % (d - 2));
        const b = 1 + ((i + 2) % (d - 1));
        const answer = `${a + b}/${d}`;
        return q({ grade: "초4", unit: "분수의 덧셈과 뺄셈", conceptId: "fraction_add_sub", difficulty: i % 3 + 2, text: `${a}/${d} + ${b}/${d} = ?`, answer, wrongs: [`${a + b}/${d + 1}`, `${Math.abs(a - b)}/${d}`, `${a + b + 1}/${d}`], index: i, prereq: ["fraction_basic"], time: 30 });
      }),
      ...makeMany(25, (i) => {
        const a = (20 + i) / 10;
        const b = (10 + (i % 9)) / 10;
        const answer = (a + b).toFixed(1);
        return q({ grade: "초4", unit: "소수의 덧셈과 뺄셈", conceptId: "decimal_add_sub", difficulty: i % 3 + 2, text: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`, answer, wrongs: [(a + b + 0.1).toFixed(1), (a + b - 0.1).toFixed(1), String(Math.round(a + b))], index: i, prereq: ["decimal_basic", "place_value"], time: 30 });
      }),
      ...makeMany(10, (i) => {
        const a = 8 + i;
        const b = 5 + (i % 5);
        return q({ grade: "초4", unit: "막대그래프", conceptId: "bar_graph", difficulty: 2, text: `사과 ${a}개, 배 ${b}개입니다. 사과가 배보다 몇 개 더 많나요?`, answer: a - b, wrongs: [a + b, Math.abs(a - b) + 1, b], index: i, prereq: ["subtraction_basic", "data_interpretation"], time: 25 });
      }),
      ...makeMany(10, (i) => q({ grade: "초4", unit: "평면도형의 이동", conceptId: "shape_transformation", difficulty: i % 3 + 2, text: `도형을 오른쪽으로 ${i % 4 + 1}칸, 위로 ${i % 3 + 1}칸 옮겼습니다. 어떤 이동인가요?`, answer: "평행이동", wrongs: ["뒤집기", "돌리기", "확대"], index: i, prereq: ["shape_basic"], time: 25 })),
    ];
  }

  function grade5() {
    return [
      ...makeMany(20, (i) => q({ grade: "초5", unit: "자연수의 혼합 계산", conceptId: "mixed_calculation", difficulty: i % 3 + 2, text: `${10 + i} + ${2 + i % 7} × ${3 + i % 5} = ?`, answer: 10 + i + (2 + i % 7) * (3 + i % 5), wrongs: [(10 + i + 2 + i % 7) * (3 + i % 5), 10 + i + 2 + i % 7, 10 + i], index: i, prereq: ["addition_basic", "multiplication_basic"], time: 30 })),
      ...makeMany(25, (i) => { const n = 18 + i; return q({ grade: "초5", unit: "약수와 배수", conceptId: "factor_multiple", difficulty: i % 3 + 2, text: `${n}의 약수가 아닌 것은?`, answer: n + 1, wrongs: [1, n, n % 2 === 0 ? 2 : 3], index: i, prereq: ["multiplication_basic", "division_basic"], time: 30 }); }),
      ...makeMany(25, (i) => q({ grade: "초5", unit: "약분과 통분", conceptId: "reduction_common_denominator", difficulty: i % 3 + 2, text: `${2 * (i % 5 + 2)}/${3 * (i % 5 + 2)}을 약분하면?`, answer: "2/3", wrongs: ["3/2", "4/6", "1/3"], index: i, prereq: ["fraction_basic", "factor_multiple"], time: 35 })),
      ...makeMany(30, (i) => q({ grade: "초5", unit: "분수의 덧셈과 뺄셈", conceptId: "fraction_add_sub_advanced", difficulty: i % 3 + 3, text: `1/3 + ${i % 2 + 1}/6 = ?`, answer: i % 2 ? "2/3" : "1/2", wrongs: ["2/9", "3/6", "5/6"], index: i, prereq: ["fraction_basic", "reduction_common_denominator"], time: 40 })),
      ...makeMany(25, (i) => q({ grade: "초5", unit: "분수의 곱셈", conceptId: "fraction_multiplication", difficulty: i % 4 + 2, text: `${i % 4 + 1}/5 × ${i % 3 + 2} = ?`, answer: `${(i % 4 + 1) * (i % 3 + 2)}/5`, wrongs: [`${i % 4 + 1}/${5 * (i % 3 + 2)}`, `${i % 3 + 2}/5`, "1/5"], index: i, prereq: ["fraction_basic", "multiplication_basic"], time: 35 })),
      ...makeMany(25, (i) => q({ grade: "초5", unit: "다각형의 둘레와 넓이", conceptId: "polygon_area_perimeter", difficulty: i % 3 + 2, text: `가로 ${5 + i}cm, 세로 ${3 + i % 8}cm인 직사각형의 넓이는?`, answer: `${(5 + i) * (3 + i % 8)}㎠`, wrongs: [`${2 * ((5 + i) + (3 + i % 8))}cm`, `${5 + i + 3 + i % 8}㎠`, `${(5 + i) * 2}㎠`], index: i, prereq: ["multiplication_basic", "shape_basic"], time: 35 })),
      ...makeMany(15, (i) => q({ grade: "초5", unit: "수의 범위와 어림하기", conceptId: "rounding_range", difficulty: i % 3 + 2, text: `${3400 + i * 17}을 백의 자리에서 반올림하면?`, answer: String(Math.round((3400 + i * 17) / 100) * 100), wrongs: [3400 + i * 17, Math.floor((3400 + i * 17) / 100) * 100, Math.ceil((3400 + i * 17) / 10) * 10], index: i, prereq: ["number_sense"], time: 30 })),
      ...makeMany(10, (i) => q({ grade: "초5", unit: "평균과 가능성", conceptId: "average_probability_intro", difficulty: i % 3 + 2, text: `${70 + i}, ${80 + i}, ${90 + i}의 평균은?`, answer: 80 + i, wrongs: [70 + i, 90 + i, 240 + i], index: i, prereq: ["addition_basic", "division_basic"], time: 30 })),
      ...makeMany(10, (i) => q({ grade: "초5", unit: "합동과 대칭", conceptId: "congruence_symmetry", difficulty: i % 3 + 2, text: `정사각형의 대칭축은 몇 개인가요?`, answer: "4개", wrongs: ["1개", "2개", "3개"], index: i, prereq: ["shape_basic"], time: 25 })),
    ];
  }

  function grade6() {
    return [
      ...makeMany(30, (i) => q({ grade: "초6", unit: "분수의 나눗셈", conceptId: "fraction_division", difficulty: i % 4 + 2, text: `${i % 4 + 2}/${i % 5 + 5} ÷ ${i % 3 + 2} = ?`, answer: `${i % 4 + 2}/${(i % 5 + 5) * (i % 3 + 2)}`, wrongs: [`${(i % 4 + 2) * (i % 3 + 2)}/${i % 5 + 5}`, `${i % 4 + 2}/${i % 5 + 5}`, "1/2"], index: i, prereq: ["fraction_basic", "fraction_multiplication"], time: 40 })),
      ...makeMany(25, (i) => q({ grade: "초6", unit: "소수의 나눗셈", conceptId: "decimal_division", difficulty: i % 3 + 2, text: `${(6 + i / 10).toFixed(1)} ÷ 0.5 = ?`, answer: ((6 + i / 10) / 0.5).toFixed(1), wrongs: [(6 + i / 10 + 0.5).toFixed(1), ((6 + i / 10) * 0.5).toFixed(1), "0.5"], index: i, prereq: ["decimal_basic", "division_basic"], time: 35 })),
      ...makeMany(25, (i) => q({ grade: "초6", unit: "비와 비율", conceptId: "ratio", difficulty: i % 3 + 2, text: `남학생 ${8 + i}명, 여학생 ${12 + i}명입니다. 남학생:여학생의 비는?`, answer: `${8 + i}:${12 + i}`, wrongs: [`${12 + i}:${8 + i}`, `${8 + i}/${20 + i * 2}`, `${20 + i * 2}:${8 + i}`], index: i, prereq: ["fraction_basic", "division_basic"], time: 35 })),
      ...makeMany(25, (i) => q({ grade: "초6", unit: "비례식", conceptId: "proportion", difficulty: i % 4 + 2, text: `3:4 = ${3 * (i % 5 + 2)}:?`, answer: 4 * (i % 5 + 2), wrongs: [3 * (i % 5 + 2), 7 * (i % 5 + 2), 4 + (i % 5 + 2)], index: i, prereq: ["ratio", "fraction_division"], time: 40 })),
      ...makeMany(20, (i) => q({ grade: "초6", unit: "원의 넓이", conceptId: "circle_area", difficulty: i % 3 + 2, text: `반지름이 ${3 + i % 8}cm인 원의 넓이는? (원주율 3.14)`, answer: `${(3.14 * (3 + i % 8) ** 2).toFixed(2)}㎠`, wrongs: [`${(2 * 3.14 * (3 + i % 8)).toFixed(2)}cm`, `${((3 + i % 8) ** 2).toFixed(0)}㎠`, `${(3.14 * (3 + i % 8)).toFixed(2)}㎠`], index: i, prereq: ["multiplication_basic"], time: 40 })),
      ...makeMany(20, (i) => q({ grade: "초6", unit: "각기둥과 원기둥", conceptId: "prism_cylinder", difficulty: i % 3 + 2, text: `원기둥에서 서로 평행한 두 면은 어떤 모양인가요?`, answer: "원", wrongs: ["삼각형", "사각형", "오각형"], index: i, prereq: ["solid_geometry"], time: 25 })),
      ...makeMany(15, (i) => q({ grade: "초6", unit: "경우의 수", conceptId: "counting", difficulty: i % 3 + 2, text: `상의 ${2 + i % 4}벌, 하의 ${2 + i % 3}벌을 입는 방법은?`, answer: (2 + i % 4) * (2 + i % 3), wrongs: [(2 + i % 4) + (2 + i % 3), (2 + i % 4) * 2, (2 + i % 3) * 2], index: i, prereq: ["multiplication_basic"], time: 35 })),
      ...makeMany(10, (i) => q({ grade: "초6", unit: "평균과 자료 해석", conceptId: "average_data", difficulty: i % 3 + 2, text: `${60 + i}, ${70 + i}, ${80 + i}, ${90 + i}의 평균은?`, answer: 75 + i, wrongs: [70 + i, 80 + i, 300 + i], index: i, prereq: ["average_probability_intro"], time: 35 })),
      ...makeMany(10, (i) => q({ grade: "초6", unit: "정비례의 기초", conceptId: "proportional_relationship", difficulty: i % 4 + 2, text: `사과 1개가 800원입니다. ${2 + i}개의 가격은?`, answer: `${800 * (2 + i)}원`, wrongs: [`${800 + (2 + i)}원`, `${400 * (2 + i)}원`, `${1000 * (2 + i)}원`], index: i, prereq: ["ratio"], time: 35 })),
    ];
  }

  function middle1() {
    const units = [
      ["소인수분해", "prime_factorization", 20, (i) => [`${36 + i}를 소인수분해할 때 필요한 개념은?`, "소수", ["소수점", "분수", "각도"]]],
      ["정수와 유리수", "integers_rationals", 30, (i) => [`${-10 + i} + ${12 + i} = ?`, (-10 + i) + (12 + i), [2 * i, -2, 22 + i]]],
      ["문자와 식", "algebra_expression", 25, (i) => [`${i}x + ${i + 2}x = ?`, `${2 * i + 2}x`, [`${i + i + 2}`, `${i}x`, `${i + 2}x`]]],
      ["일차방정식", "linear_equation", 35, (i) => [`x + ${i + 3} = ${i + 10}일 때 x는?`, 7, [i + 3, i + 10, 10]]],
      ["좌표평면", "coordinate_plane", 15, (i) => [`점 (${i % 5 + 1}, ${i % 4 + 2})의 x좌표는?`, i % 5 + 1, [i % 4 + 2, 0, i]]],
      ["정비례와 반비례", "direct_inverse", 20, (i) => [`y=${i % 5 + 2}x에서 x=3일 때 y는?`, (i % 5 + 2) * 3, [3, i % 5 + 2, (i % 5 + 2) + 3]]],
      ["기본도형", "basic_geometry", 15, () => ["삼각형의 세 내각의 합은?", "180도", ["90도", "120도", "360도"]]],
      ["평면도형", "plane_geometry", 15, () => ["평행한 두 직선이 만나서 이루는 동위각의 크기는?", "같다", ["다르다", "두 배", "절반"]]],
      ["입체도형", "solid_geometry", 10, () => ["정육면체의 면의 개수는?", "6개", ["4개", "8개", "12개"]]],
      ["자료의 정리와 해석", "statistics_intro", 15, (i) => [`${70 + i}, ${80 + i}, ${90 + i}의 평균은?`, 80 + i, [70 + i, 90 + i, 240 + i]]],
    ];

    let offset = 0;
    return units.flatMap(([unit, conceptId, count, factory]) => makeMany(count, (i) => {
      const [text, answer, wrongs] = factory(i);
      offset += 1;
      return q({ grade: "중1", unit, conceptId, difficulty: i % 4 + 1, text, answer, wrongs, index: offset, prereq: ["factor_multiple"], time: 35 });
    }));
  }

  function middle2() {
    const items = [];

    makeMany(40, (i) => {
      const a = i % 7 + 2;
      const b = i % 5 + 3;
      const c = i % 4 + 1;
      const templates = [
        () => [`${a}x+${b}x-${c}x = ?`, `${a + b - c}x`, [`${a + b + c}x`, `${a - b - c}x`, `${a + b - c}`], 1],
        () => [`${a}(x+${b})-${c} = ?`, `${a}x+${a * b - c}`, [`${a}x+${b - c}`, `${a + b}x-${c}`, `${a}x+${a * b + c}`], 2],
        () => [`(${a}x+${b})+(${c}x-${a}) = ?`, `${a + c}x+${b - a}`, [`${a + c}x+${b + a}`, `${a - c}x+${b - a}`, `${a + c}`], 2],
        () => [`(${a + b}x-${b})-(${c}x+${a}) = ?`, `${a + b - c}x-${a + b}`, [`${a + b + c}x-${b}`, `${a + b - c}x+${a + b}`, `${a + b - c}`], 2],
        () => [`${a}(${b}x-${c}) = ?`, `${a * b}x-${a * c}`, [`${a + b}x-${c}`, `${a * b}x-${c}`, `${a * b}x+${a * c}`], 2],
        () => [`a^${a} × a^${b} = ?`, `a^${a + b}`, [`a^${a * b}`, `a^${Math.abs(a - b)}`, `${a + b}a`], 3],
        () => [`${a}(x+${b})-(${c}x-${b}) = ?`, `${a - c}x+${a * b + b}`, [`${a + c}x+${a * b - b}`, `${a - c}x+${b}`, `${a * c}x+${a * b + b}`], 4],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "식의 계산", conceptId: "expression", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["algebra_expression", "integers_rationals"], time: 35 }));
    });

    makeMany(40, (i) => {
      const x = i % 8 + 1;
      const y = i % 6 + 2;
      const s = x + y;
      const d = x - y;
      const a = i % 4 + 2;
      const b = i % 5 + 2;
      const templates = [
        () => [`x+y=${s}, x-y=${d}일 때 x는?`, x, [y, s, d], 2],
        () => [`y=${a}x, x+y=${x + a * x}일 때 x는?`, x, [a, a * x, x + a], 2],
        () => [`${a}x+${b}y=${a * x + b * y}, x+y=${s}일 때 y는?`, y, [x, s, a * x], 3],
        () => [`닭과 토끼가 모두 ${s}마리, 다리는 ${2 * x + 4 * y}개입니다. 토끼는 몇 마리인가요?`, y, [x, s, y + 2], 4],
        () => [`두 직선 y=x+${y}와 y=-x+${s}의 교점 x좌표는?`, x, [y, s, d], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "연립일차방정식", conceptId: "system_equation", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["linear_equation", "algebra_expression"], time: 45 }));
    });

    makeMany(40, (i) => {
      const m = i % 7 - 3 || 2;
      const n = i % 9 + 1;
      const x1 = i % 5 + 1;
      const x2 = x1 + 2;
      const y1 = m * x1 + n;
      const y2 = m * x2 + n;
      const templates = [
        () => [`y=${m}x+${n}의 기울기는?`, m, [n, -m, m + n], 2],
        () => [`y=${m}x+${n}의 y절편은?`, n, [m, -n, m + n], 2],
        () => [`두 점 (${x1}, ${y1}), (${x2}, ${y2})를 지나는 일차함수의 기울기는?`, m, [n, x2 - x1, y2 - y1], 3],
        () => [`x가 1 증가할 때 y가 ${m}씩 변하는 그래프의 기울기는?`, m, [1, -m, m + 1], 3],
        () => [`y=${m}x+${n}와 평행한 직선의 기울기는?`, m, [-m, n, 1 / m], 4],
        () => [`기본요금 ${n * 1000}원, 1시간마다 ${Math.abs(m) * 1000}원씩 늘어납니다. ${x1}시간 비용은?`, `${n * 1000 + Math.abs(m) * 1000 * x1}원`, [`${n * 1000}원`, `${Math.abs(m) * 1000 * x1}원`, `${(n + x1) * 1000}원`], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "일차함수", conceptId: "linear_function", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["coordinate_plane", "direct_inverse", "linear_equation"], time: 45 }));
    });

    makeMany(30, (i) => {
      const a = i % 5 + 2;
      const b = i % 4 + 2;
      const c = i % 6 + 3;
      const templates = [
        () => [`상의 ${a}벌, 하의 ${b}벌을 고르는 방법은?`, a * b, [a + b, a, b], 2],
        () => [`버스 ${a}가지 또는 지하철 ${b}가지를 고르는 방법은?`, a + b, [a * b, a, b], 2],
        () => [`음료 ${a}종류와 메뉴 ${b}종류를 하나씩 고르는 방법은?`, a * b, [a + b, a * b + 1, a + b + 1], 3],
        () => [`서로 다른 ${a}명 중 2명을 순서 있게 세우는 방법은?`, a * (a - 1), [a + 2, a * 2, a * (a - 1) / 2], 4],
        () => [`비밀번호 첫 자리는 ${a}개, 둘째 자리는 ${b}개, 셋째 자리는 ${c}개 중 고릅니다. 가능한 비밀번호 수는?`, a * b * c, [a + b + c, a * b + c, a + b * c], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "경우의 수", conceptId: "counting", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["multiplication_basic"], time: 35 }));
    });

    makeMany(30, (i) => {
      const red = i % 5 + 2;
      const blue = i % 4 + 3;
      const total = red + blue;
      const templates = [
        () => ["동전 1개를 던져 앞면이 나올 확률은?", "1/2", ["1/4", "1/3", "1"], 1],
        () => [`주사위 1개를 던져 ${i % 6 + 1}이 나올 확률은?`, "1/6", ["1/2", "1/3", "1/4"], 2],
        () => ["카드 A,B,C,D 중 A를 뽑을 확률은?", "1/4", ["1/2", "1/3", "3/4"], 3],
        () => [`빨간 공 ${red}개, 파란 공 ${blue}개 중 빨간 공을 뽑을 확률은?`, `${red}/${total}`, [`${blue}/${total}`, `${red}/${blue}`, `${total}/${red}`], 3],
        () => [`상의 ${red}벌, 하의 ${blue}벌 중 특정 조합 1개가 나올 확률은?`, `1/${red * blue}`, [`1/${red + blue}`, `${red}/${blue}`, `${blue}/${red}`], 4],
        () => [`서로 다른 공 ${total}개 중 당첨 공 ${red}개가 있습니다. 당첨 확률은?`, `${red}/${total}`, [`${blue}/${total}`, `1/${total}`, `${total}/${red}`], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "확률", conceptId: "probability", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["counting", "fraction_basic"], time: 35 }));
    });

    makeMany(20, (i) => {
      const a = 40 + (i % 5) * 5;
      const b = 50 + (i % 4) * 5;
      const c = 180 - a - b;
      const templates = [
        () => [`삼각형의 두 내각이 ${a}도, ${b}도입니다. 나머지 각은?`, `${c}도`, [`${a + b}도`, `${Math.abs(a - b)}도`, "180도"], 2],
        () => [`삼각형의 두 내각이 ${a}도, ${b}도일 때 나머지 내각의 외각은?`, `${a + b}도`, [`${c}도`, `${180 - a}도`, `${180 - b}도`], 2],
        () => [`이등변삼각형의 꼭지각이 ${a}도입니다. 한 밑각은?`, `${(180 - a) / 2}도`, [`${a}도`, `${180 - a}도`, `${(180 + a) / 2}도`], 3],
        () => ["직각삼각형에서 직각을 제외한 두 각의 합은?", "90도", ["45도", "100도", "180도"], 3],
        () => ["삼각형의 합동 조건이 아닌 것은?", "AAA", ["SSS", "SAS", "ASA"], 4],
        () => ["두 삼각형에서 대응하는 두 변과 그 끼인각이 같으면 어떤 합동 조건인가요?", "SAS", ["SSS", "ASA", "AAA"], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중2", unit: "삼각형의 성질", conceptId: "triangle", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["basic_geometry", "angle_basic"], time: 40 }));
    });

    return items;
  }

  function middle3() {
    const items = [];

    makeMany(30, (i) => {
      const root = i % 9 + 2;
      const square = root * root;
      const a = i % 5 + 2;
      const b = i % 4 + 3;
      const templates = [
        () => [`√${square} = ?`, root, [root + 1, root - 1, square], 1],
        () => [`√${a * a} + √${b * b} = ?`, a + b, [a * b, Math.abs(a - b), a + b + 1], 2],
        () => ["다음 중 무리수는?", "√2", ["4", "0.5", "1/3"], 2],
        () => [`√${a * a} × √${b * b} = ?`, a * b, [a + b, `${a}√${b}`, `${b}√${a}`], 3],
        () => [`2√${a * a} + 3√${b * b} = ?`, 2 * a + 3 * b, [2 * a + b, a + 3 * b, 5 * (a + b)], 4],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "실수와 제곱근", conceptId: "real_numbers", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["integers_rationals"], time: 35 }));
    });

    makeMany(35, (i) => {
      const a = i % 6 + 2;
      const b = i % 7 + 1;
      const c = i % 5 + 3;
      const templates = [
        () => [`${a}x(x+${b}) = ?`, `${a}x²+${a * b}x`, [`${a}x+${a * b}`, `${a}x²+${b}x`, `${a + b}x²`], 1],
        () => [`(x+${a})(x+${b}) = ?`, `x²+${a + b}x+${a * b}`, [`x²+${a * b}x+${a + b}`, `x²+${a + b}`, `x²-${a + b}x+${a * b}`], 2],
        () => [`${a}x+${a * b}를 인수분해하면?`, `${a}(x+${b})`, [`x(${a}+${b})`, `${b}(x+${a})`, `${a}x(x+${b})`], 2],
        () => [`x²+${a + b}x+${a * b}를 인수분해하면?`, `(x+${a})(x+${b})`, [`(x-${a})(x-${b})`, `(x+${a + b})(x+1)`, `(x+${a})(x-${b})`], 3],
        () => [`x²+${a + c}x+${a * c}=0의 좌변을 인수분해하면?`, `(x+${a})(x+${c})`, [`(x-${a})(x-${c})`, `(x+${a + c})(x+1)`, `(x+${a})(x-${c})`], 4],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "다항식의 곱셈과 인수분해", conceptId: "factorization", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["expression"], time: 40 }));
    });

    makeMany(35, (i) => {
      const a = i % 7 + 2;
      const b = i % 5 + 1;
      const templates = [
        () => [`x²-${a * a}=0의 양의 해는?`, a, [-a, a * a, 0], 2],
        () => [`(x-${a})²=0의 해는?`, a, [-a, 0, a * 2], 3],
        () => [`x²-${a + b}x+${a * b}=0의 두 해는?`, `${a}, ${b}`, [`${-a}, ${-b}`, `${a + b}, ${a * b}`, `${a}, ${a + b}`], 4],
        () => [`어떤 수 x와 ${a}의 곱이 ${a * b}이고 x는 양수입니다. x는?`, b, [a, a + b, a * b], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "이차방정식", conceptId: "quadratic_equation", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["factorization", "linear_equation"], time: 45 }));
    });

    makeMany(35, (i) => {
      const p = i % 6 + 1;
      const qv = i % 5 - 2;
      const a = i % 3 + 1;
      const templates = [
        () => [`y=x²-${2 * p}x+${p * p + qv}의 꼭짓점은?`, `(${p}, ${qv})`, [`(${-p}, ${qv})`, `(${p}, ${p * p})`, `(0, ${qv})`], 2],
        () => [`y=x²-${2 * p}x+${p * p + qv}의 축은?`, `x=${p}`, [`x=${-p}`, `y=${p}`, `x=${qv}`], 2],
        () => [`y=${a}x²의 그래프는 x=0에서 어떤 값을 가지나요?`, "0", [String(a), "1", "-1"], 3],
        () => [`y=(x-${p})²+${qv}의 최솟값은?`, qv, [p, p + qv, 0], 4],
        () => [`높이 h=-t²+${2 * p}t입니다. 최고 높이에 도달하는 t는?`, p, [2 * p, -p, 0], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "이차함수", conceptId: "quadratic_function", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["quadratic_equation", "coordinate_plane"], time: 45 }));
    });

    makeMany(25, (i) => {
      const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25]];
      const [a, b, c] = triples[i % triples.length];
      const templates = [
        () => [`직각삼각형의 두 직각변이 ${a}, ${b}일 때 빗변은?`, c, [a + b, c - 1, c + 1], 2],
        () => [`빗변이 ${c}, 한 직각변이 ${a}일 때 다른 변은?`, b, [a, c - a, b + 1], 2],
        () => [`${a}, ${b}, ${c}은 직각삼각형의 세 변이 될 수 있나요?`, "예", ["아니오", "항상 아님", "판단 불가"], 3],
        () => [`좌표평면에서 (0,0)과 (${a},${b}) 사이의 거리는?`, c, [a + b, Math.abs(a - b), c + 2], 4],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "피타고라스 정리", conceptId: "pythagorean", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["basic_geometry", "square_root"], time: 40 }));
    });

    makeMany(25, (i) => {
      const a = i % 5 + 3;
      const b = i % 6 + 4;
      const c = Math.sqrt(a * a + b * b).toFixed(1);
      const templates = [
        () => ["직각삼각형에서 sin은?", "높이/빗변", ["밑변/빗변", "높이/밑변", "빗변/높이"], 2],
        () => ["직각삼각형에서 cos은?", "밑변/빗변", ["높이/빗변", "높이/밑변", "빗변/밑변"], 2],
        () => ["직각삼각형에서 tan은?", "높이/밑변", ["밑변/빗변", "높이/빗변", "빗변/높이"], 3],
        () => [`밑변 ${a}, tan값이 ${b}/${a}이면 높이는?`, b, [a, a + b, c], 4],
        () => [`높이 ${b}, 밑변 ${a}인 직각삼각형에서 tan은?`, `${b}/${a}`, [`${a}/${b}`, `${b}/${c}`, `${a}/${c}`], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "삼각비", conceptId: "trigonometric_ratio", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["pythagorean", "ratio"], time: 40 }));
    });

    makeMany(20, (i) => {
      const a = 30 + (i % 6) * 10;
      const templates = [
        () => ["반지름과 접선이 만나는 각은?", "90도", ["45도", "60도", "180도"], 2],
        () => ["원의 중심에서 현에 내린 수선은 현을 어떻게 나누나요?", "이등분", ["두 배", "삼등분", "나누지 않음"], 2],
        () => [`중심각이 ${a}도일 때 같은 호의 원주각은?`, `${a / 2}도`, [`${a}도`, `${a * 2}도`, "90도"], 3],
        () => [`원주각이 ${a / 2}도이면 같은 호의 중심각은?`, `${a}도`, [`${a / 2}도`, `${a * 2}도`, "180도"], 3],
        () => ["같은 호에 대한 원주각들의 크기는?", "같다", ["다르다", "두 배", "절반"], 4],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "원의 성질", conceptId: "circle", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["basic_geometry", "angle_basic"], time: 40 }));
    });

    makeMany(20, (i) => {
      const a = 60 + i;
      const b = 70 + i;
      const c = 80 + i;
      const templates = [
        () => [`${a}, ${b}, ${c}의 평균은?`, b, [a, c, a + b + c], 2],
        () => ["자료가 평균에서 흩어진 정도를 나타내는 값은?", "분산", ["평균", "중앙값", "최빈값"], 3],
        () => ["표준편차는 분산의 무엇인가요?", "제곱근", ["제곱", "합", "평균"], 4],
        () => [`동전 2개를 던져 앞면이 2개 나올 확률은?`, "1/4", ["1/2", "1/3", "3/4"], 4],
        () => ["자료 해석에서 이상치가 있으면 평균은 어떻게 될 수 있나요?", "크게 영향받음", ["항상 같음", "사라짐", "계산 불가"], 5],
      ];
      const [text, answer, wrongs, difficulty] = templates[(i - 1) % templates.length]();
      items.push(q({ grade: "중3", unit: "통계와 확률", conceptId: "statistics_probability", difficulty, text, answer, wrongs, index: items.length + 1, prereq: ["statistics_intro", "probability"], time: 40 }));
    });

    return items;
  }

  const generatedConceptBanks = {
    g4: interleaveByConcept(grade4()),
    g5: interleaveByConcept(grade5()),
    g6: interleaveByConcept(grade6()),
    m1: interleaveByConcept(middle1()),
    m2: interleaveByConcept(middle2()),
    m3: interleaveByConcept(middle3()),
  };

  console.log("[level-test-bank] generated", Object.fromEntries(Object.entries(generatedConceptBanks).map(([bank, items]) => [bank, items.length])));
  console.log("[level-test-bank] first10", Object.fromEntries(Object.entries(generatedConceptBanks).map(([bank, items]) => [bank, items.slice(0, 10).map((item) => item.unit)])));

  window.generatedConceptBanks = generatedConceptBanks;
})();
