const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const schema = require("../elite-problem-schema.js");
const mathModel = require("../middle3-elite-math-model.js");
const englishModel = require("../middle3-elite-english-model.js");

const mathProblems = mathModel.problems;
const englishProblems = englishModel.problems;
const allProblems = [...mathProblems, ...englishProblems];

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function mathProblem(suffix) {
  return mathProblems.find((problem) => problem.problemId === `elite-m3-math-${suffix}`);
}

test("공통 Elite 스키마가 두 과목의 절대 난이도 필드를 제공한다", () => {
  assert.deepEqual(schema.ELITE_LEVELS, ["HIGH", "TOP"]);
  assert.deepEqual(schema.SUBJECTS, ["수학", "영어"]);
  assert.equal(schema.MATH_ERROR_CODES.length, 12);
  assert.equal(schema.ENGLISH_ERROR_CODES.length, 12);
  assert.ok(schema.ANSWER_TYPES.includes("PROCESS"));
  assert.ok(schema.ANSWER_TYPES.includes("WRITTEN"));
  assert.ok(schema.CONTENT_ROLES.includes("ELITE_CEILING"));
});

test("재작성 버전은 75문항을 교체하고 승인된 핵심 구조 7문항을 보존한다", () => {
  assert.equal(allProblems.length, 82);
  assert.deepEqual(countBy(allProblems, "contentVersion"), {
    "m3-elite-reviewed-v2": 7,
    "m3-elite-rewrite-v2": 75,
  });
  assert.deepEqual(
    allProblems.filter((problem) => problem.contentVersion === "m3-elite-reviewed-v2").map((problem) => problem.problemId),
    [
      "elite-m3-math-rad-h01",
      "elite-m3-math-rad-h03",
      "elite-m3-math-fac-h01",
      "elite-m3-math-qfn-h02",
      "elite-m3-math-cir-h03",
      "elite-m3-eng-h13",
      "elite-m3-eng-h20",
    ]
  );
});

test("중3 수학은 7개 영역마다 HIGH 3문항과 TOP 3문항이다", () => {
  assert.equal(mathProblems.length, 42);
  assert.deepEqual(countBy(mathProblems, "eliteLevel"), { HIGH: 21, TOP: 21 });
  assert.equal(mathModel.domains.length, 7);
  mathModel.domains.forEach((domain) => {
    const domainProblems = mathProblems.filter((problem) => problem.domain === domain);
    assert.equal(domainProblems.length, 6, domain);
    assert.deepEqual(countBy(domainProblems, "eliteLevel"), { HIGH: 3, TOP: 3 }, domain);
    assert.equal(
      domainProblems.filter((problem) => problem.eliteLevel === "TOP" && ["PROCESS", "WRITTEN"].includes(problem.answerType)).length,
      2,
      `${domain}: TOP 과정형·서술형`
    );
  });
});

test("중3 수학의 다섯 답안형 분포를 고정한다", () => {
  assert.deepEqual(countBy(mathProblems, "answerType"), {
    MULTIPLE_CHOICE: 14,
    SHORT_ANSWER: 7,
    EXPRESSION: 7,
    PROCESS: 7,
    WRITTEN: 7,
  });
});

test("중3 영어는 HIGH 20, TOP 20과 기존 답안형 분포를 유지한다", () => {
  assert.equal(englishProblems.length, 40);
  assert.deepEqual(countBy(englishProblems, "eliteLevel"), { HIGH: 20, TOP: 20 });
  assert.deepEqual(countBy(englishProblems, "answerType"), { MULTIPLE_CHOICE: 29, WRITTEN: 11 });
  const taskDistribution = countBy(englishProblems, "englishTaskType");
  englishModel.requiredTaskTypes.forEach((taskType) => {
    assert.ok(taskDistribution[taskType] > 0, taskType);
  });
  assert.equal(taskDistribution.DISTORTION_RECOGNITION, 2);
  assert.equal(taskDistribution.EVIDENCE_WRITING, 2);
  Object.entries(taskDistribution)
    .filter(([taskType]) => !["DISTORTION_RECOGNITION", "EVIDENCE_WRITING"].includes(taskType))
    .forEach(([, count]) => assert.equal(count, 4));
});

test("82문항 모두 공통 스키마와 사람 승인 상태를 통과한다", () => {
  allProblems.forEach((problem) => {
    assert.deepEqual(schema.validateEliteProblem(problem), [], problem.problemId);
    assert.equal(problem.humanReviewStatus, "APPROVED", problem.problemId);
    assert.equal(problem.duplicateVerdict, "DISTINCT", problem.problemId);
    assert.equal(problem.directFormulaSubstitution, false, problem.problemId);
    assert.ok(problem.independentVerification, problem.problemId);
  });
});

test("문제 ID·구조·풀이 경로는 82개가 모두 고유하다", () => {
  assert.equal(new Set(allProblems.map((problem) => problem.problemId)).size, 82);
  assert.equal(new Set(allProblems.map((problem) => problem.structureSignature)).size, 82);
  assert.equal(new Set(allProblems.map((problem) => problem.solutionPathSignature)).size, 82);
  assert.deepEqual(schema.auditProblemSet(mathProblems), []);
  assert.deepEqual(schema.auditProblemSet(englishProblems), []);
});

test("HIGH와 TOP의 최소 사고 단계·시간·근거 밀도를 충족한다", () => {
  allProblems.forEach((problem) => {
    const minimumSteps = problem.eliteLevel === "TOP" ? 5 : 4;
    const minimumMinutes = problem.eliteLevel === "TOP" ? 10 : 5;
    assert.ok(problem.estimatedMeaningfulSteps >= minimumSteps, problem.problemId);
    assert.ok(problem.expectedThinkingMinutes >= minimumMinutes, problem.problemId);
    assert.ok(problem.reasoningGoals.length >= 4, problem.problemId);
    assert.ok(problem.trapTypes.length >= 3, problem.problemId);
    assert.ok(problem.levelRationale.length >= 20, problem.problemId);
    assert.ok(problem.explanation.length >= 45, problem.problemId);
  });
});

test("모든 객관식은 정답 하나와 실제 오독·오산 기반 오답 세 개를 가진다", () => {
  allProblems.filter((problem) => problem.answerType === "MULTIPLE_CHOICE").forEach((problem) => {
    assert.equal(problem.choices.length, 4, problem.problemId);
    assert.equal(new Set(problem.choices).size, 4, problem.problemId);
    assert.equal(problem.choices.filter((choice) => choice === problem.correctAnswer).length, 1, problem.problemId);
    const allowed = new Set(problem.subject === "수학" ? schema.MATH_ERROR_CODES : schema.ENGLISH_ERROR_CODES);
    const wrongChoices = problem.choices.filter((choice) => choice !== problem.correctAnswer);
    assert.equal(Object.keys(problem.distractorErrorMap).length, 3, problem.problemId);
    wrongChoices.forEach((choice) => {
      const detail = problem.distractorErrorMap[choice];
      assert.ok(detail, `${problem.problemId}:${choice}`);
      assert.ok(allowed.has(detail.code), `${problem.problemId}:${choice}:${detail.code}`);
      assert.ok(detail.explanation.length >= 10, `${problem.problemId}:${choice}`);
    });
  });
});

test("수학 42문항의 재작성 정답 키를 독립 목록과 대조한다", () => {
  const expectedAnswers = {
    "elite-m3-math-rad-h01": "970",
    "elite-m3-math-rad-h02": "524",
    "elite-m3-math-rad-h03": "15",
    "elite-m3-math-rad-t01": "n=4",
    "elite-m3-math-rad-t02": "(m,n)=(16,100), (400,484)",
    "elite-m3-math-rad-t03": "202",
    "elite-m3-math-fac-h01": "64",
    "elite-m3-math-fac-h02": "4097",
    "elite-m3-math-fac-h03": "(a-b)(a-c)(b-c)",
    "elite-m3-math-fac-t01": "69",
    "elite-m3-math-fac-t02": "n=-1",
    "elite-m3-math-fac-t03": "38",
    "elite-m3-math-qeq-h01": "5m",
    "elite-m3-math-qeq-h02": "30km/h",
    "elite-m3-math-qeq-h03": "52",
    "elite-m3-math-qeq-t01": "150",
    "elite-m3-math-qeq-t02": "n=5,14,18,33,39,60,68,95",
    "elite-m3-math-qeq-t03": "76",
    "elite-m3-math-qfn-h01": "4",
    "elite-m3-math-qfn-h02": "5",
    "elite-m3-math-qfn-h03": "46",
    "elite-m3-math-qfn-t01": "10",
    "elite-m3-math-qfn-t02": "y=3(x-2)²+8",
    "elite-m3-math-qfn-t03": "5",
    "elite-m3-math-tri-h01": "150",
    "elite-m3-math-tri-h02": "10m",
    "elite-m3-math-tri-h03": "40",
    "elite-m3-math-tri-t01": "높이 5m, O는 B와 C 사이에서 B로부터 10m",
    "elite-m3-math-tri-t02": "(AD,DB,CD)=(5,20,10),(9,16,12), 넓이의 합 275",
    "elite-m3-math-tri-t03": "375",
    "elite-m3-math-cir-h01": "10",
    "elite-m3-math-cir-h02": "85°",
    "elite-m3-math-cir-h03": "20°",
    "elite-m3-math-cir-t01": "12°",
    "elite-m3-math-cir-t02": "(a,b)=(8,10),(9,7)",
    "elite-m3-math-cir-t03": "9",
    "elite-m3-math-stat-h01": "32",
    "elite-m3-math-stat-h02": "35/3",
    "elite-m3-math-stat-h03": "41/3",
    "elite-m3-math-stat-t01": "a=3, b=5",
    "elite-m3-math-stat-t02": "12",
    "elite-m3-math-stat-t03": "61",
  };
  assert.equal(Object.keys(expectedAnswers).length, 42);
  mathProblems.forEach((problem) => {
    assert.equal(problem.correctAnswer, expectedAnswers[problem.problemId], problem.problemId);
  });
});

test("근호 정수 조건은 독립 완전탐색 결과와 일치한다", () => {
  const candidates = [];
  for (let n = 1; n <= 1000; n += 1) {
    const difference = Math.sqrt(n + 45) - Math.sqrt(n);
    if (Math.abs(difference - Math.round(difference)) < 1e-10) candidates.push(n);
  }
  assert.deepEqual(candidates, [4, 36, 484]);
  assert.equal(candidates.reduce((sum, value) => sum + value, 0).toString(), mathProblem("rad-h02").correctAnswer);
});

test("인수분해 정수 조건은 독립 완전탐색으로 후보와 합을 재검증한다", () => {
  const pairs = [];
  for (let x = 1; x <= 174; x += 1) {
    for (let y = x + 1; y <= 174; y += 1) {
      if (x * y + 3 * x + 2 * y === 174 && y - x <= 20) pairs.push([x, y]);
    }
  }
  assert.deepEqual(pairs, [[7, 17], [8, 15], [10, 12]]);
  assert.equal(pairs.reduce((sum, [x, y]) => sum + x + y, 0).toString(), mathProblem("fac-t01").correctAnswer);
});

test("이차방정식 정수근 조건은 n=4..100 완전탐색과 일치한다", () => {
  const values = [];
  for (let n = 4; n <= 100; n += 1) {
    const discriminantRoot = Math.sqrt(16 * n + 1);
    const first = (2 * n + 1 - discriminantRoot) / 2;
    const second = (2 * n + 1 + discriminantRoot) / 2;
    if (Number.isInteger(first) && Number.isInteger(second) && first > 0 && first !== second) values.push(n);
  }
  assert.deepEqual(values, [5, 14, 18, 33, 39, 60, 68, 95]);
  assert.equal(`n=${values.join(",")}`, mathProblem("qeq-t02").correctAnswer);
});

test("이차함수 표의 잘못된 값은 네 점 일치 조건으로 유일하다", () => {
  const points = [[-1, 15], [0, 7], [2, -3], [4, 5], [5, 15]];
  const solutions = [];
  for (let omitted = 0; omitted < points.length; omitted += 1) {
    for (let p = -20; p <= 20; p += 1) {
      const used = points.filter((_, index) => index !== omitted);
      const [x1, y1] = used[0];
      const [x2, y2] = used[1];
      const denominator = (x1 - p) ** 2 - (x2 - p) ** 2;
      if (denominator === 0) continue;
      const a = (y1 - y2) / denominator;
      const q = y1 - a * (x1 - p) ** 2;
      if (a !== 0 && used.every(([x, y]) => a * (x - p) ** 2 + q === y)) {
        solutions.push({ omitted, corrected: a * (points[omitted][0] - p) ** 2 + q });
      }
    }
  }
  assert.deepEqual(solutions, [{ omitted: 1, corrected: 5 }]);
  assert.equal(solutions[0].corrected.toString(), mathProblem("qfn-t03").correctAnswer);
});

test("직각삼각형 정수 사영은 가능한 두 경우만 남는다", () => {
  const triples = [];
  for (let ad = 1; ad < 25 - ad; ad += 1) {
    const db = 25 - ad;
    const cd = Math.sqrt(ad * db);
    if (Number.isInteger(cd)) triples.push([ad, db, cd]);
  }
  assert.deepEqual(triples, [[5, 20, 10], [9, 16, 12]]);
  assert.equal(triples.reduce((sum, [, , cd]) => sum + 25 * cd / 2, 0), 275);
});

test("교차하는 두 현의 정수 분할은 유일하다", () => {
  const pairs = [];
  for (let ap = 1; ap < 13 - ap; ap += 1) {
    for (let cp = 1; cp < 14 - cp; cp += 1) {
      if (ap * (13 - ap) === cp * (14 - cp)) pairs.push([ap, cp]);
    }
  }
  assert.deepEqual(pairs, [[5, 4]]);
  assert.equal((pairs[0][0] + pairs[0][1]).toString(), mathProblem("cir-t03").correctAnswer);
});

test("수학의 금지된 범위는 해당 영역의 문제·풀이에 등장하지 않는다", () => {
  const quadraticEquations = mathProblems.filter((problem) => problem.domain === "이차방정식");
  const quadraticFunctions = mathProblems.filter((problem) => problem.domain === "이차함수");
  quadraticEquations.forEach((problem) => {
    assert.doesNotMatch(`${problem.prompt} ${problem.explanation}`, /근과 계수의 관계|판별식/, problem.problemId);
  });
  quadraticFunctions.forEach((problem) => {
    assert.doesNotMatch(`${problem.prompt} ${problem.explanation}`, /최댓값|최솟값|두 그래프의 위치 관계/, problem.problemId);
  });
});

test("영어 근거 문장은 실제 지문에 있고 TOP 지문은 복수 근거를 요구한다", () => {
  englishProblems.forEach((problem) => {
    assert.ok(problem.evidenceSentences.length >= 2, problem.problemId);
    const visibleText = `${problem.prompt} ${problem.choices.join(" ")}`.toLowerCase();
    problem.evidenceSentences.forEach((evidence) => {
      assert.ok(visibleText.includes(evidence.toLowerCase()), `${problem.problemId}:${evidence}`);
    });
    if (problem.eliteLevel === "TOP") {
      assert.ok(problem.evidenceSentences.length >= 2, problem.problemId);
      assert.ok(visibleText.length >= 180, problem.problemId);
    }
  });
});

test("영어 서술형 11문항은 근거와 추론을 분리 채점할 수 있다", () => {
  const written = englishProblems.filter((problem) => problem.answerType === "WRITTEN");
  assert.equal(written.length, 11);
  written.forEach((problem) => {
    assert.ok(problem.answerRubric.length >= 45, problem.problemId);
    assert.match(problem.answerRubric, /점/, problem.problemId);
    assert.ok(problem.correctAnswer.length >= 35, problem.problemId);
    assert.ok(problem.reasoningGoals.length >= 4, problem.problemId);
  });
});

test("승인된 기준 모델은 새 Elite 런타임에만 연결된다", () => {
  const indexSource = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const runtimeSource = fs.readFileSync(path.join(__dirname, "..", "elite-test.js"), "utf8");
  ["elite-problem-schema.js", "middle3-elite-math-model.js", "middle3-elite-english-model.js"].forEach((fileName) => {
    const pattern = new RegExp(fileName.replaceAll(".", "\\."));
    assert.match(indexSource, pattern, fileName);
    assert.doesNotMatch(runtimeSource, pattern, fileName);
  });
  assert.match(runtimeSource, /STUDY_ELITE_UI\?\.mount/);
});

test("검수 문서는 82개 ID와 재작성 판정 항목을 공개한다", () => {
  const reportPath = path.join(__dirname, "..", "docs", "middle3-elite-model-audit.md");
  assert.ok(fs.existsSync(reportPath), reportPath);
  const report = fs.readFileSync(reportPath, "utf8");
  allProblems.forEach((problem) => assert.match(report, new RegExp(problem.problemId), problem.problemId));
  [
    "전체 판정 요약",
    "수학 42문항",
    "영어 40문항",
    "정답 독립 검산",
    "오답 선택지",
    "교육과정 범위",
    "실질 중복",
    "과정형",
    "서술형",
    "남은 위험",
  ].forEach((heading) => assert.match(report, new RegExp(heading), heading));
});
