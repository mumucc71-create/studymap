# 중3 통계 스프링 학습 콘텐츠 구현 감사

## 범위

- 교육과정: 2015 개정 중학교 3학년 수학
- 신규 conceptId: `m3_statistics_mean`, `m3_statistics_median_mode`, `m3_statistics_representative_range`, `m3_statistics_frequency_graphs`, `m3_statistics_variance`, `m3_statistics_standard_deviation`
- 단계: BASIC, A1, A2, A3, A4, A5
- 기존 통계 39문항과 인접 확률 8문항은 읽기만 했으며 수정·복제·삭제하지 않았다.
- UI, 표·히스토그램 렌더러, 추천 경로, Firebase, World는 연결하지 않았다.

## 신규 파일

1. `middle3-statistics-learning-model.js`
2. `middle3-statistics-learning-content.js`
3. `tests/middle3-statistics-learning-quality.test.js`
4. `docs/middle3-statistics-learning-audit.md`

## 콘텐츠 집계

| 항목 | 결과 |
|---|---:|
| 총 문항 | 144 |
| conceptId별 | 각 24 |
| 단계별 | 각 24 |
| 학습 문제 | 108 |
| 혼자 풀기 | 36 |
| 설명 수업 | 36 |
| 힌트 | 288 |
| statisticsData 포함 | 144 |

답안형 분포:

| 답안형 | 수 |
|---|---:|
| MULTIPLE_CHOICE | 12 |
| SHORT_ANSWER | 48 |
| EXPRESSION_INPUT | 36 |
| STEP_ORDER | 24 |
| WRITTEN_RESPONSE | 24 |

단위 정책 분포:

| 정책 | 수 |
|---|---:|
| OPTIONAL | 122 |
| REQUIRED | 16 |
| FORBIDDEN | 6 |

## 구현 계약

- `statisticsAnswerContract`는 모든 문제의 최상위 필드에 두었고 `statisticsData` 안에는 중복하지 않았다.
- 평균·중앙값·최빈값·범위·편차·분산·표준편차는 원자료에서 독립 재계산한다.
- 분산은 `DIVIDE_BY_N`만 허용하며 n-1 계산을 오답으로 처리한다.
- 복수 최빈값은 순서 없는 집합으로 비교하고, 최빈값 없음은 `NONE`, `없음`, `최빈값 없음`을 정규화한다.
- 도수표는 계급별 도수 순서와 총도수를, 히스토그램은 bin과 막대 높이의 대응을 검사한다.
- 상대도수 합은 허용 오차 안에서 1인지 확인한다.
- 반올림은 문항별 정책과 허용 오차를 사용한다.
- 분산은 제곱 단위, 평균·중앙값·최빈값·범위·표준편차는 원자료 단위를 사용한다.
- STEP_ORDER는 실제 필요한 action만 포함하고 누락·역순을 차단한다.
- WRITTEN_RESPONSE는 `REVIEW_REQUIRED`, 필수 논점 3개 이상과 부분답안 기준을 유지한다.
- 혼자 풀기는 같은 conceptId·단계의 학습 문항과 구조 및 풀이 경로 서명을 분리하고 힌트·풀이를 FINAL 전 잠근다.

## 저작 방식과 난이도

무작위 생성이나 기존 문항 변형은 사용하지 않았다. 6개 개념, 6개 단계, 4개 역할을 고정한 결정적 저작 매트릭스로 144개 문제 객체를 구성했다. 각 객체는 독립 ID, prompt, `structureSignature`, `solutionPathSignature`를 가진다.

- A3: 자료 후보 확인, 통계량 선택, 조건 필터와 원자료 검산을 연결한다.
- A4: 숨은 자료, 경우 분류, 표·그래프 표현 전환, 반올림 조건을 연결한다.
- A5: 계산 주장 감사, 필요조건, 반례, 일반화와 결과 해석을 요구하며 서술형 rubric으로 검토한다.

## 자동 검증 결과

- 신규 품질 테스트: 25/25 통과
- 전체 `tests/*.test.js` 회귀: 416/416 통과
- 문항 수·분포: 통과
- ID·prompt·숫자 제거 구조·구조 서명·풀이 서명 중복: 0
- statisticsData 필수 필드 및 독립 재계산: 통과
- 객관식 정답 유일성: 통과
- 평균·중앙값·최빈값·범위: 통과
- 편차 합 0, 분산 n 나눗셈, 표준편차 양수: 통과
- 도수 합, 상대도수 합 1, 히스토그램 bin 대응: 통과
- 반올림·단위 계약: 통과
- STEP_ORDER 누락·역순 차단: 통과
- 서술형 rubric: 통과
- 혼자 풀기 구조·풀이 서명 중복: 0
- 금지 교육과정 키워드: 0

## 범위 확인

포함 범위는 평균, 중앙값, 최빈값, 대푯값 선택, 범위, 편차, 분산, 표준편차, 두 집단 비교와 결과 해석이다. 도수분포표, 히스토그램, 상대도수는 선수 개념 복습 도구로 제한했다. 확률분포, 정규분포, 상관계수, 회귀분석, 추정·검정, 고등학교 통계, 미적분 기반 통계는 포함하지 않았다.

## 변경 통제

- 기존 대수 validator는 읽기 전용으로 호출했다.
- 기존 파일은 수정하지 않았다.
- stage, commit, push를 수행하지 않았다.
