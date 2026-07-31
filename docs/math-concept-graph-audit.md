# 초4~고3 통합 수학 canonical concept graph 1단계 감사

## 범위와 원칙

- 버전: `math-concept-graph-v1`
- 최저 내부 경계: `G4`
- 최고 내부 경계: `H3`
- 기존 7개 World는 `sourceRoutes` 호환에만 사용한다.
- World의 선형 `prerequisiteIds`는 수학적 선수 관계로 가져오지 않았다.
- 평가 70개, Master 7개, 단원평가·종합평가·안내 노드는 canonical 학습 graph에서 제외했다.
- 기존 파일, 승인된 중3 문제·설명, World 데이터는 수정하지 않았다.

## 집계

| 항목 | 수 |
|---|---:|
| canonical 노드 | 104 |
| concept alias | 11 |
| unit alias | 11 |
| alias 전체 | 22 |
| prerequisite/next 간선 | 134 |
| remedial 참조 | 266 |
| parallel 쌍 | 19 |
| transfer 방향 간선 | 15 |
| 끊긴 참조 | 0 |
| 자기 참조 | 0 |
| prerequisite 순환 | 0 |

## internalGradeBand 분포

| G4 | G5 | G6 | M1 | M2 | M3 | H1 | H2 | H3 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 7 | 9 | 9 | 10 | 5 | 46 | 6 | 10 | 2 |

M3 46개는 승인된 7개 단원 41개와 통합망의 직접 선수로 사용하는 피타고라스 세부 5개다.

## 영역별 분포

| 영역 | 노드 수 |
|---|---:|
| NUMBER_OPERATIONS | 21 |
| ALGEBRA | 19 |
| FUNCTIONS | 15 |
| GEOMETRY | 29 |
| STATISTICS_PROBABILITY | 16 |
| CALCULUS | 4 |

## contentAvailability와 runtimeAvailability

| 콘텐츠 상태 | 수 | 런타임 원칙 |
|---|---:|---|
| COMPLETE_SPRING | 41 | DEDICATED_SPRING |
| LEGACY_ONLY | 45 | LEGACY_RUNTIME |
| WORLD_CONTENT_ONLY | 16 | WORLD_RUNTIME |
| LEVEL_TEST_ONLY | 0 | 현재 없음 |
| NO_CONTENT | 2 | NO_RUNTIME |

`trigonometric_function`, `probability_distribution`은 상위 연결을 보존하기 위한 canonical 노드지만 현재 정확한 전용 콘텐츠와 런타임이 없어 `NO_CONTENT/NO_RUNTIME`이다. 다음 런타임 단계에서 이 노드로 자동 승급하면 안 된다.

## alias 통합 판단

### 하나의 canonical 개념으로 해석한 경우

| canonical | alias | 근거 |
|---|---|---|
| integers_rationals | integer_rational | 같은 정수·유리수 개념의 단수/복수 ID 차이 |
| algebra_expression | algebraic_expression | 같은 중1 문자식 개념의 명명 차이 |
| system_equation | simultaneous_equation | 같은 연립일차방정식 명명 차이 |
| ratio | ratio_basic | 같은 비와 비율 기초 개념 |
| counting | counting_cases | 같은 경우의 수 광역 개념 |
| probability | probability_basic, m3_probability_basic | 승인 중3 통계와 분리된 확률 광역 개념 |
| large_numbers | place_value | 초4 하한에서 자리값 결손을 큰 수 노드 내부에서 처리 |
| fraction_add_sub_advanced | fraction_operations | 분수 계산 광역 ID를 준비된 세부 계산 노드에 연결 |
| decimal_add_sub | decimal_basic | 초4 하한 내 소수 기초 대표 노드 |
| expression | polynomial_operation | 중2 식의 계산 및 다항식 계산 광역 ID |

### unit alias로 유지한 경우

`real_numbers`, `factorization`, `quadratic_equation`, `quadratic_function`, `pythagorean`, `trigonometric_ratio`, `m3-trigonometric-ratio`, `m3_trigonometric_ratio`, `circle`, `statistics_basic`, `statistics_probability`은 여러 세부 개념을 대표한다. 이 ID의 숙달 증거를 한 세부 노드에 합치지 않고 `targetConceptIds` 배열로만 해석한다.

### 같은 이름이어도 별도 유지한 경우

- `algebra_expression`과 `expression`: 중1 문자식의 의미와 중2 식의 계산은 선수·후속이 다른 별도 개념이다.
- `statistics_intro`, `average_data`, 중3 통계 6개: 자료 정리, 평균·자료 해석, 대푯값·산포도는 각각 다른 증거가 필요하다.
- `counting`과 `probability`: 경우의 수는 확률의 선수지만 동일 개념이 아니다.
- 중3 광역 단원 ID와 `m3_*` 세부 ID: 광역 ID는 unit alias이고 실제 숙달은 세부 ID에 저장한다.

## 승인 중3 41개 중심 연결표

| 단원 | canonical 세부 순서·분기 | 직접 아래 선수 | 직접 위 후속·전이 |
|---|---|---|---|
| 제곱근과 실수 | `m3_sqrt_meaning` → `m3_sqrt_value` / `m3_irrational_number` → `m3_radical_simplification` → `m3_radical_operations` | `integers_rationals`, `prime_factorization`, `expression` | 이차방정식 제곱근 풀이·근의 공식, 피타고라스, 표준편차, 고등 다항식·유리식 |
| 다항식·인수분해 | `m3_polynomial_multiplication` → `m3_multiplication_formula`; `m3_common_factor`; 공식에서 완전제곱·제곱의 차·합과 곱으로 분기 | `expression`, `factor_multiple`, `integers_rationals` | 이차방정식의 인수분해 풀이, 고등 다항식·유리식 |
| 이차방정식 | `m3_quadratic_meaning`에서 인수분해·제곱근·근의 공식 풀이로 병렬 분기 → `m3_quadratic_root_meaning` → `m3_quadratic_word_setup` | 일차방정식, 식의 계산, 인수분해, 제곱근·근호 간소화 | 이차함수, 고등 방정식 |
| 이차함수 | 뜻 → 그래프 모양 → 꼭짓점·축 → 평행이동 → 식 구하기·최대최소 | 좌표평면, 일차함수, 이차방정식 해의 의미 | 고등 함수, 좌표기하, 극한 전이 |
| 삼각비 | 뜻에서 sin·cos·tan으로 병렬 분기 → 특수각 → 길이 | 비·비례식, 피타고라스 | 고등 삼각함수, 좌표기하, 벡터 |
| 원의 성질 | 기본 요소에서 현·접선·중심각으로 분기; 접선→두 접선, 중심각→같은 호·반원 | 기본 도형, 각과 삼각형, 피타고라스 보충 | 좌표기하 전이 |
| 통계 | 평균 → 중앙값·최빈값 → 대푯값·범위; 표·그래프 → 도수표·히스토그램; 평균 → 분산 → 표준편차 | 평균·자료 해석, 자료 정리, 표와 그래프, 제곱근 | 고등 통계·통계적 추정 |

확률과 조건부확률은 중3 통계 6개 노드의 `prerequisiteConceptIds`에 포함하지 않았다.

## misconceptionRemediationMap 원칙

- 하나의 오류 태그는 실제 존재하는 가장 가까운 canonical 노드 1~3개만 가리킨다.
- 단순 오답 한 번으로 전체 학년 또는 단원 전체를 복습시키는 연결은 없다.
- `remedialConceptIds`는 각 노드의 `misconceptionRemediationMap` 대상 합집합이다.
- 대표 연결:
  - 이차방정식 인수분해 실패 → 인수분해 세부 개념
  - 삼각비 변 역할 혼동 → 삼각비의 뜻 또는 기본 도형
  - 원 접점 혼동 → 원의 기본 요소
  - 통계 분산 과정 실패 → 평균 또는 편차·분산
  - 근호 오류 → 제곱근 값·근호 계산

## 초4 하한 처리

- 모든 노드의 `minimumGradeBand`는 `G4`다.
- G4 노드는 `entryEvidence.startNode=true`로 레벨테스트 최초 진입을 허용한다.
- 자리값처럼 초4 이전부터 이어지는 ID는 새 저학년 노드를 만들지 않고 `large_numbers` alias 및 해당 노드 내부 보조 설명으로 처리한다.
- 통합 런타임은 G4 아래로 recovery stack을 확장하면 안 된다.

## 고3 상한 처리

- 모든 노드의 `maximumGradeBand`는 `H3`다.
- `statistical_inference`, `calculus_applications`가 현재 최상단 canonical 노드다.
- H3 이후 대학 수학 노드는 생성하지 않았다.
- 최상단 숙달 후에는 승급 대신 심화·전이·간격 복습을 사용한다.

## sourceRoute 계약

- `sourceRoutes`는 기존 World ID, chapter ID, 화면용 world/topic index를 보존한다.
- World의 기존 `prerequisiteIds`는 복사하지 않았다.
- 104개 노드의 모든 non-empty source route가 기존 7개 World와 실제 chapter로 해석되는지 자동 검사한다.
- 중3 전용 UI가 있는 노드는 기존 `mapView`를 함께 보존한다.

## 다음 런타임 구현 단계 계약

1. graph 데이터는 읽기 전용으로 로드한다.
2. 레벨테스트 ID는 alias registry를 통해 canonical 증거로 변환한다.
3. `prerequisiteConceptIds`는 진입 준비도 판단에만 사용한다.
4. 반복 오류가 있을 때만 `misconceptionRemediationMap`으로 보충 노드를 고른다.
5. `parallelConceptIds`는 선후 관계로 해석하지 않는다.
6. `transferConceptIds`는 선택 학습이며 승급 필수 조건이 아니다.
7. `runtimeAvailability=NO_RUNTIME`인 노드에는 자동 진입하지 않는다.
8. 기존 중3 단원별 저장 key와 콘텐츠 해시는 변경하지 않는다.
9. 자동 상승·하강·복귀, migration, 추천·UI·Firebase 연결은 2단계 이후에 구현한다.

## 자동 검증 결과

`tests/math-concept-graph-quality.test.js`에서 canonical 계약, alias 단일 배정, 참조 무결성, 자기 참조, DAG, 역방향 간선, parallel 양방향, G4~H3 경계, 평가·Master 제외, 승인 41개, 신규 중3 4개, 오류 보충, 통계 선수 관계, content/runtime 상태, sourceRoute, World 해시, 중3 콘텐츠 14개 해시를 검사한다.
