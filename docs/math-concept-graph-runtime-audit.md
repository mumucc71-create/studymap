# 초4~고3 통합 수학 개념망 오케스트레이터 감사

## 범위

- 런타임 버전: `math-concept-graph-runtime-v1`
- 상태 버전: `math-concept-graph-runtime-state-v1`
- 입력 그래프: `math-concept-graph-v1`
- 입력 alias: `math-concept-aliases-v1`
- 구현 범위는 순수 상태·결정 런타임과 자동 테스트뿐이다.
- UI, `learning.js`, 추천 엔진, 레벨테스트 migration, Firebase, `index.html`은 연결하지 않았다.
- 기존 중3 단원 런타임은 문제 채점과 단원 내부 진행을 계속 담당하며, 새 런타임은 진입·보충·복귀·상승 대상만 결정한다.

## 신규 파일

1. `math-concept-graph-runtime.js`
2. `math-concept-graph-runtime-state.js`
3. `tests/math-concept-graph-runtime.test.js`
4. `docs/math-concept-graph-runtime-audit.md`

## 공개 함수

- `createInitialGraphState`
- `normalizeConceptId`
- `recordEvidence`
- `evaluateConceptStatus`
- `selectRemedialConcept`
- `beginRemediation`
- `evaluateRemediationCompletion`
- `returnToCheckpoint`
- `evaluateMastery`
- `selectPromotionConcept`
- `promoteConcept`
- `getAvailableNextConcepts`
- `getAvailableRemedialConcepts`
- `getStudentFacingStatus`
- `serializeGraphState`
- `hydrateGraphState`

내부 테스트와 명시적 상태 전환을 위한 `markMastered`도 제공하지만, 일반 흐름은 증거를 기록한 뒤 `evaluateMastery`와 `promoteConcept`를 사용한다.

## 상태 계약

상태에는 `graphVersion`, `activeConceptId`, `activeUnitName`, `activePath`, `masteryByConcept`, `evidenceByConcept`, `misconceptionEvidence`, `recoveryStack`, `returnCheckpoint`, `pendingRemedialConceptIds`, `completedRemedialConceptIds`, `promotionCandidates`, `blockedCandidates`, `lastDecision`, `decisionHistory`, `revision`, `updatedAt`을 저장한다.

개념별 숙달 상태는 다음을 포함한다.

- `status`
- `basicProgress`, `advancedProgress`
- `independentCheckPassed`
- 정답 구조·풀이 경로 ID
- 오답 구조 ID
- 오류별 횟수와 복구 완료 오류
- 포기 횟수
- 마지막 시도 시각

모든 상태 객체는 새 객체로 생성하고 깊게 동결한다. 실제 상태 변경은 `revision`을 1 증가시키며, 시각은 입력 증거 또는 호출 옵션으로 주입한다. 동일 입력에는 난수나 시스템 시각을 사용하지 않는다.

## 증거 처리

- 런타임은 정답을 채점하지 않고 단원 런타임의 FINAL 증거만 받는다.
- `problemId + conceptId + FINAL/DRAFT` fingerprint가 같은 증거는 다시 계산하지 않는다.
- `CORRECT` FINAL만 숙달 정답 증거로 사용한다.
- `REVIEW_REQUIRED`는 기록하지만 숙달·승급에는 사용하지 않는다.
- `INCORRECT`와 `GIVEUP`은 오류 증거와 하강 판정에 사용한다.
- 알 수 없는 ID는 `UNKNOWN_CONCEPT` 결정으로 남기고 기존 학습 위치와 증거를 바꾸지 않는다.

## 하강 규칙

다음 중 하나가 성립할 때만 보충 후보를 찾는다.

1. 같은 오류 태그가 서로 다른 구조 2개에서 반복됨
2. 서로 다른 풀이 경로 3개 중 정답이 1개 이하
3. `GIVEUP` 뒤 직접 연결된 보충 후보가 확인됨

후보는 오류별 map, `remedialConceptIds`, `prerequisiteConceptIds` 순서로 수집한다. 같은 후보군에서는 COMPLETE_SPRING, 낮은 숙달 증거, 안정적인 conceptId 순으로 선택한다.

- COMPLETE_SPRING + DEDICATED_SPRING은 자동 스프링 보충에 사용한다.
- LEGACY_ONLY는 자동 상승 대상으로 사용하지 않는다.
- 다만 오류 map이 직접 지정하고 `LEGACY_RUNTIME`이 실제 존재하는 경우에는 `LEGACY_REMEDIATION` 보충 경로로만 사용할 수 있다.
- WORLD_CONTENT_ONLY와 NO_CONTENT는 자동 스프링 진입에 사용하지 않는다.
- 초4 시작 노드 아래로 내려가야 하는 상황은 `FOUNDATION_SUPPORT`로 처리해 현재 개념 내부의 기초 설명·보조 문제로 남긴다.

## recoveryStack과 복귀

- 보충 진입 전에 원래 conceptId, return 조건, 증거 위치, 오답 구조, 오류 태그를 frame에 저장한다.
- 최대 중첩 깊이는 5다.
- 중첩 보충은 LIFO로 복귀한다.
- 같은 from/to 보충 pair는 최대 2회로 제한한다.
- 같은 frame을 연속 중복 push하지 않는다.

보충 완료 조건:

- 서로 다른 정답 구조 3개
- 서로 다른 정답 풀이 경로 2개 이상
- 정답 2문항 이상
- GIVEUP 없음
- 혼자 풀기 통과

원래 개념 복귀 확인 조건:

- 기존 오답과 다른 정답 구조 3개
- 정답 2문항 이상
- 동일 오류 태그 재발 없음
- 혼자 풀기 또는 return checkpoint 통과

복귀 확인에서 같은 오류가 재발하면 직전 보충으로 즉시 재진입하지 않는다. 다른 직접 후보를 `alternativeRemedialConceptIds`로 제시하고, 후보가 없으면 `REMEDIATE_IN_PLACE`를 기록한다.

## 숙달과 상승

숙달에는 서로 다른 정답 구조 3개, 서로 다른 풀이 경로 3개, 혼자 풀기 통과, GIVEUP 없음, 반복 오류 없음, 미완료 recovery 없음이 모두 필요하다.

상승 후보는 direct `nextConceptIds`를 우선하고 `transferConceptIds`를 다음으로 사용한다. `parallelConceptIds`는 자동 상승에 사용하지 않는다.

자동 상승 대상은 다음을 모두 만족해야 한다.

- COMPLETE_SPRING
- DEDICATED_SPRING
- 직접 선수 개념 숙달
- 현재 개념과 직접 next 또는 transfer 연결

학년 전체 완료 여부는 보지 않는다. H3 노드가 숙달되면 `MAXIMUM_REACHED`로 전환하고 대학 수학으로 이동하지 않는다.

## 콘텐츠 없는 노드

- COMPLETE_SPRING: 자동 진입 가능
- LEGACY_ONLY: 자동 상승 차단, 직접 오류 보충은 실제 legacy runtime이 있을 때만 허용
- WORLD_CONTENT_ONLY: source route 후보로만 남기고 자동 스프링 진입 차단
- NO_CONTENT: 진입 금지 및 blocked 후보 기록

자동 진입 후보의 필수 선수에 콘텐츠가 없고 숙달 증거도 없으면 `entryCheckRequiredConceptIds`에 기록한다. 이 선수 관계를 건너뛰어 승급하지 않고, 다음 UI 단계에서 현재 개념 내부 진입 확인 문제로 대체할 수 있게 한다.

## alias 처리

- direct alias는 즉시 canonical conceptId로 바꾼다.
- unit alias는 `detailConceptId`, `canonicalConceptId`, `distributionConceptId` 중 해당 단원 세부 ID가 있을 때만 분배한다.
- 세부 근거가 없는 unit alias 증거는 `@unit:<aliasId>` 아래 별도 저장한다.
- 광역 ID 정답 하나로 세부 concept 전체를 숙달 처리하지 않는다.

## 학생용 상태

`getStudentFacingStatus`는 다음 다섯 한국어 key만 반환한다.

- 현재 학습
- 먼저 복습할 개념
- 기초 보충
- 다음 도전
- 원래 학습으로 돌아가기

내부 `gradeBand`, `scopeId`, 학년 코드는 반환하지 않는다.

## 자동 검사

신규 테스트는 필수 24개 시나리오를 포함해 29개다.

- 첫 오답 하강 차단
- 반복 오류별 직접 보충
- 이차방정식→인수분해→문자식 중첩 LIFO
- 보충 완료와 2단계 복귀 확인
- 복귀 실패 재진입 방지
- 이차방정식에서 이차함수 전이
- 삼각비·피타고라스·통계·근호 오류 routing
- NO_CONTENT 및 LEGACY_ONLY 자동 진입 차단
- 콘텐츠 없는 선수의 entry check 표시
- G4 하한과 H3 상한
- 증거 중복·REVIEW_REQUIRED 차단
- direct/unit/unknown alias 처리
- 순환 없는 active path
- 보충 반복 한도
- serialize/hydrate 동치
- revision과 이전 상태 불변성
- 학생용 표시 정보 제한
- 기존 중3 런타임 존재 및 승인 모델 SHA-256 불변

## 다음 단계 계약

향후 UI·추천·저장 연결은 이 런타임의 결정 객체와 직렬화 상태만 사용한다. 단원 런타임의 문제 채점, 문제 선택, FINAL 잠금, Firebase 저장 계약은 변경하지 않는다. 실제 연결 전에 unit alias 세부 분배 근거와 `entryCheckRequiredConceptIds`를 만드는 진입 확인 문제 공급자를 별도로 연결해야 한다.
