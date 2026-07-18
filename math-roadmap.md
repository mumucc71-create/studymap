# 수학 개념 연결 로드맵 설계

이 파일은 `math-roadmap.js`의 데이터 구조를 앱에서 어떻게 사용할지 설명합니다. 기존 앱 파일은 수정하지 않았고, 새 데이터 파일만 추가했습니다.

## 설계 목표

수학을 학년 목차가 아니라 개념 그래프로 다룹니다. 학생이 특정 문제를 틀리거나 오래 걸리면, 그 문제의 개념에서 `prerequisites`를 거슬러 올라가 부족한 선수학습을 찾습니다.

예를 들어 `이차방정식`에서 막히면 다음 경로를 추적합니다.

`이차방정식 → 인수분해 → 다항식 계산 → 문자식 → 정수와 유리수`

## 데이터 구성

`mathConceptRoadmap`은 다음 필드를 가집니다.

- `domains`: 수와 연산, 도형, 자료·확률·통계 영역별 흐름
- `gradeUnits`: 초1부터 고등 선택과목까지 학년별 단원 목록
- `concepts`: 앱 진단에 사용할 핵심 개념 노드
- `diagnosisChains`: 대표 오답 상황에서 선수개념으로 역추적하는 규칙
- `levelTestDesign`: 레벨테스트 채점, 배치, 결과 스키마
- `graph.nodes`, `graph.edges`: React 개념 지도 시각화용 노드/엣지
- `sampleDiagnosisResult`: 레벨테스트 결과 예시

## 개념 데이터 필드

각 개념은 다음 정보를 포함합니다.

- `id`
- `conceptName`
- `schoolLevel`
- `grade`
- `domain`
- `description`
- `prerequisites`
- `nextConcepts`
- `difficultyLevel`
- `relatedUnits`
- `levelTestQuestionCount`
- `testQuestionTypes`
- `minimumPassScore`
- `masteryCriteria`
- `commonMistakes`
- `diagnosisRules`
- `recommendedReviewConcepts`
- `levelTestDifficulty`

## 레벨테스트 사용 방식

1. 학생의 학년은 테스트 범위의 상한으로만 사용합니다.
2. 실제 시작점은 개념별 진단 결과로 결정합니다.
3. 오답이 나오면 해당 개념의 `diagnosisRules`와 `prerequisites`를 따라 원인을 추적합니다.
4. 시간이 오래 걸렸지만 맞힌 경우는 오답이 아니라 `slowButCorrect`로 처리합니다.
5. `모름`은 해당 개념을 약점 후보로 강하게 표시합니다.

## 적응형 레벨테스트 정책

전체 문항은행은 크게 만들되, 학생에게 모든 문제를 풀게 하지 않습니다. 앱은 학생의 응답을 보며 다음 문항을 고르는 적응형 테스트를 사용합니다.

권장 문항은행 규모:

- 초1: 100문항
- 초2: 120문항
- 초3: 150문항
- 초4: 150문항
- 초5: 180문항
- 초6: 180문항
- 중1: 200문항
- 중2: 200문항
- 중3: 220문항
- 공통수학: 250문항
- 수학Ⅰ: 250문항
- 수학Ⅱ: 250문항
- 미적분: 300문항
- 확률과 통계: 200문항
- 기하: 200문항

대표 레벨테스트 문항 수는 전체 약 224문항이지만, 실제 앱에서는 평균 40~60문항만 출제합니다.

적응형 흐름 예시:

1. 초4 대표 문제 10문항 출제
2. 80% 이상이면 초6 대표 문제로 점프
3. 초6도 80% 이상이면 중2 대표 문제로 점프
4. 중2에서 약점이 발견되면 관련 선수개념만 역추적 검사
5. 최종적으로 영역별 수준과 추천 시작 개념을 산출

AI가 따로 산출해야 하는 능력:

- 계산 능력
- 수 감각
- 분수
- 소수
- 비율
- 문자식
- 방정식
- 함수
- 도형
- 삼각비
- 확률
- 통계
- 논리적 사고력
- 응용 문제 해결 능력

각 문제는 최소한 다음 필드를 가져야 합니다.

```js
{
  questionId: "q_m2_linear_function_001",
  conceptId: "linear_function",
  schoolLevel: "중등",
  grade: "중2",
  unit: "일차함수",
  difficulty: 3,
  questionType: "그래프해석",
  answer: "정답",
  explanation: "풀이 설명",
  prerequisiteConcepts: ["coordinate_plane", "linear_equation"],
  nextConcepts: ["quadratic_function"],
  estimatedSolveTime: 45,
  commonMistakes: ["기울기와 절편 혼동"],
  diagnosisRule: {
    ifWrong: ["coordinate_plane", "linear_equation"],
    ifSlow: ["linear_function"],
    ifUnknown: ["linear_function", "coordinate_plane"]
  }
}
```

## React 시각화 방식

`mathConceptRoadmap.graph.nodes`와 `mathConceptRoadmap.graph.edges`를 사용하면 개념 지도를 만들 수 있습니다.

노드 예시:

```js
{ id: "linear_equation", label: "일차방정식", grade: "중1", domain: "문자와 식" }
```

엣지 예시:

```js
{ from: "algebraic_expression", to: "linear_equation", relation: "선수학습" }
```

결과 화면에서는 다음 버킷으로 나눠 표시할 수 있습니다.

- 강한 개념
- 약한 개념
- 아직 시작하면 안 되는 개념
- 지금 바로 공부해야 하는 개념
- 복습 추천 개념
- 다음 진도 개념

## 대표 진단 예시

```js
{
  studentLevel: "중1",
  recommendedStartConcept: "fraction_operations",
  weakConcepts: ["분수 계산", "비율", "문자식"],
  readyConcepts: ["자연수 계산", "기본 도형"],
  blockedConcepts: ["일차방정식", "일차함수"],
  recommendation: "중1 진도 시작 전 초등 5~6학년의 분수·비율 단원을 먼저 복습해야 합니다."
}
```
