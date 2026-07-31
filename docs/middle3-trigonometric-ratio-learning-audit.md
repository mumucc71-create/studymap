# 중3 「삼각비」 스프링 학습 콘텐츠 구현 감사

## 1. 작업 범위

이번 작업은 다음 신규 파일 네 개에만 한정했다.

- `middle3-trigonometric-ratio-learning-model.js`
- `middle3-trigonometric-ratio-learning-content.js`
- `tests/middle3-trigonometric-ratio-learning-quality.test.js`
- `docs/middle3-trigonometric-ratio-learning-audit.md`

UI, World, 추천 경로, Firebase, 기존 문제, 기존 validator는 수정하지 않았다. `m3_trig_special_angles`는 신규 모델·설명 콘텐츠 안에서만 정의했다.

## 2. 콘텐츠 수량

| 항목 | 결과 |
|---|---:|
| 전체 문항 | 144 |
| conceptId | 6 |
| conceptId당 문항 | 24 |
| BASIC~A5 각 단계 | 24 |
| conceptId·단계별 | 4 |
| 학습 문제 | 108 |
| 혼자 풀기 | 36 |
| 설명 콘텐츠 | 36 |
| 힌트 | 288 |
| geometryData 포함 문항 | 144 |

대상 conceptId:

1. `m3_trig_meaning`
2. `m3_trig_sine`
3. `m3_trig_cosine`
4. `m3_trig_tangent`
5. `m3_trig_special_angles`
6. `m3_trig_length`

## 3. 답안형 분포

| answerType | 문항 수 |
|---|---:|
| MULTIPLE_CHOICE | 12 |
| SHORT_ANSWER | 48 |
| EXPRESSION_INPUT | 36 |
| STEP_ORDER | 24 |
| WRITTEN_RESPONSE | 24 |

객관식은 BASIC의 일부 확인 문제로 제한했다. 과정형은 실제 도형 판별·비 선택·비례식·단위 검산의 순서가 필요한 문제에만 사용했다. 서술형은 모두 `REVIEW_REQUIRED`이며 필수 논점과 부분답안 기준을 제공한다.

## 4. 저작 방식

기존 진단·레벨테스트·Elite 문제를 재사용하지 않았다. 6개 개념, 6개 단계, 단계별 네 역할을 먼저 설계한 뒤 각 칸에 서로 다른 상황·목표·풀이 경로를 배정하는 명시적 저작 매트릭스를 사용했다.

- 각 단계의 네 번째 문항만 혼자 풀기다.
- 혼자 풀기 문항은 같은 conceptId·stage의 학습 문항과 다른 `structureSignature`, `solutionPathSignature`를 가진다.
- 숫자만 바꾼 레거시 복제는 없다.
- A3는 기준각·변 대응·삼각비 선택·비례식·검산 중 두 요소 이상을 연결한다.
- A4는 숨은 기준각, 역추론, 경우 분류, 단위 변환, 범위 검산을 조합한다.
- A5는 오류 분석, 필요충분조건, 일반화, 반례, 모든 경우 분류, 측정 검증을 조합한다.

## 5. geometry 계약

`geometryAnswerContract`는 각 문제의 최상위 필드에만 두었다. `geometryData` 안에는 중복 저장하지 않았다.

모든 도형 문항의 `geometryData`는 다음을 가진다.

- `diagramType`
- `vertices`
- `edges`
- `rightAngleVertex`
- `referenceAngleVertex`
- `sideLabels`
- `sideLengths`
- `hypotenuse`
- `oppositeSide`
- `adjacentSide`
- `angleDegrees`
- `unknownTarget`
- `diagramDescription`

`validateGeometryData`는 다음을 검사한다.

- 직각점의 맞은편 변과 빗변 일치
- 기준각의 맞은편 변 일치
- 기준각에 닿는 직각변과 이웃한 변 일치
- 빗변·맞은편 변·이웃한 변의 중복 금지
- 변 라벨이 실제 edge에 존재하는지 확인

3-4-5 직각삼각형에서 기준각 B와 C를 바꾼 두 데이터를 비교하여 빗변은 유지되고 맞은편 변과 이웃한 변만 교환되는 것도 자동 검증했다.

## 6. 삼각비 표기와 대수 validator

기존 `math-algebra-validator.js`는 수정하지 않고 읽기 전용으로 호출한다.

신규 모델의 `normalizeTrigInput`은 다음 표기를 같은 값으로 바꾼다.

- `sin30`
- `sin 30`
- `sin(30)`
- `sin30°`
- `sin(30°)`
- `\sin 30^\circ`
- cos, tan의 같은 형식

특수각 표준값:

- `sin30°`, `cos60°` → `1/2`
- `sin45°`, `cos45°` → `sqrt(2)/2`
- `sin60°`, `cos30°` → `sqrt(3)/2`
- `tan30°` → `sqrt(3)/3`
- `tan45°` → `1`
- `tan60°` → `sqrt(3)`

정규화 뒤 `sqrt(3)/3`과 `1/sqrt(3)`, `sqrt(2)/2`와 `sqrt(8)/4` 같은 수치·근호 동치는 기존 대수 validator로 판정한다.

## 7. 단위 계약

| unitPolicy | 문항 수 |
|---|---:|
| REQUIRED | 13 |
| OPTIONAL | 3 |
| FORBIDDEN | 128 |

숫자·수식과 단위를 분리하고 `m↔cm`, `km↔m`의 같은 길이 단위 계열만 변환한다.

- REQUIRED: 단위가 없으면 `UNIT_REQUIRED`
- OPTIONAL: 단위 유무와 관계없이 값이 같으면 허용
- FORBIDDEN: 단위가 있으면 `UNIT_FORBIDDEN`
- 지원하지 않는 단위: `UNSUPPORTED_UNIT`

과도한 범용 단위 엔진은 만들지 않았다.

## 8. STEP_ORDER 계약

사용 가능한 action:

- `IDENTIFY_RIGHT_ANGLE`
- `IDENTIFY_REFERENCE_ANGLE`
- `IDENTIFY_HYPOTENUSE`
- `IDENTIFY_OPPOSITE`
- `IDENTIFY_ADJACENT`
- `SELECT_TRIG_RATIO`
- `BUILD_PROPORTION`
- `SOLVE_LENGTH`
- `CHECK_UNIT`
- `VERIFY_RANGE`

각 문항에는 실제 풀이에 필요한 action만 저장했다. `validateGeometryStepOrder`는 기대 순서 자체가 논리 순서를 따르는지 먼저 검사하고, 제출 답의 역순·누락·불필요한 추가를 차단한다.

## 9. 대표 A3~A5 구조

### A3

- 기준각을 먼저 복원한 뒤 맞은편·이웃한 변을 정하고 알맞은 삼각비로 값을 계산
- 특수각의 같은 값 관계를 선택하고 근호 동치로 검산
- 높이·거리 문제에서 특수각과 비례식을 연결하고 단위·길이 범위를 확인

### A4

- 관측 위치 설명만으로 숨은 기준각을 복원한 뒤 여러 삼각비 중 필요한 비를 선택
- cm와 m를 통일한 뒤 길이를 역추론
- 기준각 B와 C의 두 경우를 분류하여 변 역할의 교환과 빗변의 불변성을 설명

### A5

- 잘못된 기준각과 잘못된 삼각비 선택을 함께 찾는 풀이 감사
- sin·cos·tan 정의에 대한 필요충분조건과 반례 제시
- 특수각 값표를 최소 정보로 복원하는 일반화
- 서로 다른 관측 결과가 같은 실제 길이를 나타내는 조건과 단위·범위 검증

## 10. 자동 품질 검사

신규 품질 테스트는 다음을 전수 검사한다.

1. 144문항과 모든 분포
2. 필수 필드와 공개 모델 계약
3. 144개 geometryData의 위상 일관성
4. 잘못된 빗변·맞은편 변·이웃한 변 차단
5. 기준각 변경에 따른 변 역할 교환
6. 삼각비 입력 표기 정규화
7. 특수각과 분수·근호 동치
8. REQUIRED·OPTIONAL·FORBIDDEN 단위 계약
9. 모든 자동채점 정답 수용
10. 객관식 정답 유일성
11. STEP_ORDER 역순·누락·추가 차단
12. 서술형 rubric
13. ID·prompt·structureSignature·solutionPathSignature 중복 0
14. 혼자 풀기 전략 signature 중복 0
15. A3~A5 연결 조건
16. 직각삼각형 피타고라스 일관성
17. 설명 콘텐츠 36개
18. 2015 개정 중3 범위 위반 0

## 11. 범위 확인

포함:

- 직각삼각형의 삼각비
- sin·cos·tan
- 기준각에 따른 변 대응
- 30°·45°·60°의 삼각비
- 길이·높이·거리
- 단위와 결과 검산

제외:

- 사인법칙·코사인법칙
- 일반각·단위원·라디안
- 삼각함수 그래프·삼각방정식
- 고등 항등식·벡터·미적분

## 12. 실행 제한 준수

- UI 연결: 하지 않음
- World·추천 경로 연결: 하지 않음
- Firebase 신규 key: 만들지 않음
- 사용자 수동·브라우저·모바일 테스트: 요구하거나 실행하지 않음
- stage·commit·push: 하지 않음

## 13. 최종 자동 검증 결과

| 검사 | 통과 | 실패 |
|---|---:|---:|
| 삼각비 신규 품질 테스트 | 22 | 0 |
| 전체 회귀 테스트 | 351 | 0 |
| `node --check` 대상 JS 3개 | 3 | 0 |
| 신규 파일 후행 공백 검사 | 4 | 0 |
| `git diff --check` | 통과 | 0 |

추가 집계:

- geometryData 오류: 0
- 기준각·변 대응 오류: 0
- 특수각 표준값 오류: 0
- 자동채점 모델 정답 실패: 0
- 객관식 복수 정답: 0
- STEP_ORDER 역순·누락·추가 허용: 0
- ID·prompt·structureSignature·solutionPathSignature 중복: 0
- 혼자 풀기 signature 중복: 0
- 2015 개정 중3 범위 위반: 0
