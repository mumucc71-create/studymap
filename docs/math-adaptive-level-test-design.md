# 초4 시작 적응형 수학 레벨테스트 설계

## 범위

기본 진단은 `ADAPTIVE_FROM_G4` 모드로 항상 초4 핵심 게이트에서 시작한다. 기존 `math-level-test-grade-banks.js`의 학년별 라우팅은 삭제하거나 변경하지 않았으며, 특정 학년 범위를 검사하는 보조 모드로 계속 사용할 수 있다. 이번 단계는 순수 런타임과 자동 테스트만 구현했으므로 화면 버튼과 저장소는 연결하지 않았다.

## 파일과 역할

- `math-adaptive-level-test-state.js`: 불변 상태 생성, revision 증가, 직렬화·복원
- `math-adaptive-level-test-grade-gates.js`: 초4~중3 게이트 순서와 영역별 canonical concept 묶음
- `math-adaptive-level-test-question-selector.js`: 미출제·미중복 구조 문제 선택, 확인·선수·그래프 경계 문제 구분
- `math-adaptive-level-test-runtime.js`: 증거 기록, 영역 판정, 게이트 상승, 직접 선수 진단, 중3 이후 graph 위임, 종료 판정
- `math-adaptive-level-test-result.js`: 내부 ID나 학년 이동 표현이 없는 학생용 결과

## 상태 계약

필수 상태는 `currentGradeGate`, `currentDomain`, `activeConceptId`, `testedConceptIds`, `evidenceByConcept`, `passedGradeGates`, `failedGradeGates`, `prerequisiteGaps`, `upperBoundaryConcepts`, `lowerBoundaryConcepts`, `recommendedStartConceptIds`, `blockedNoContentConceptIds`, `totalQuestions`, `estimatedDuration`, `confidenceByDomain`이다. 여기에 게이트별 영역 상태, 확인 문제, 직접 선수 확인, graph state, 중복 방지 ID·구조, 결정 기록, revision을 별도로 둔다.

모든 변경은 새 상태를 반환하고 revision을 1 증가시킨다. Date와 난수를 직접 호출하지 않으며 timestamp는 제출이나 호출자가 주입한다. 진단 상태는 기존 단원 학습 상태를 읽거나 수정하지 않는다.

## 게이트

| 게이트 | 영역 수 | 핵심 영역 |
|---|---:|---|
| 초4 시작 | 5 | 큰 수와 자릿값, 곱셈·나눗셈, 분수·소수 계산, 각도·도형, 표·그래프 |
| 다음 게이트 | 5 | 혼합 계산, 약수·배수, 분수 계산, 넓이·대칭, 평균·자료 |
| 다음 게이트 | 5 | 분수·소수 나눗셈, 비와 비율, 비례식, 원·입체도형, 경우의 수·자료 |
| 다음 게이트 | 5 | 정수와 유리수, 문자와 식, 일차방정식, 좌표·비례, 기본도형·통계 |
| 다음 게이트 | 5 | 식의 계산, 연립방정식, 일차함수, 경우의 수·확률, 삼각형·닮음 |
| 중3 핵심 | 7 | 제곱근, 인수분해, 이차방정식, 이차함수, 피타고라스·삼각비, 원, 통계 |

내부 게이트 표시는 라우팅용이며 학생 결과에는 노출하지 않는다.

## 판정 규칙

- 서로 다른 `structureSignature` 2개가 모두 정답이면 그 영역을 통과한다.
- 1개 정답과 1개 오답이면 서로 다른 구조의 제3 확인 문제를 낸다.
- 서로 다른 구조 2개가 모두 오답이거나 확인 문제까지 다수 오답이면 직접 선수 개념을 진단한다.
- 한 번의 오답은 하강 근거가 아니다.
- 한 영역의 통과는 다른 영역을 통과시키지 않는다.
- 동일 problemId 또는 동일 structureSignature는 질문 수와 증거에 다시 세지 않는다.

직접 선수 후보는 `misconceptionRemediationMap`, `remedialConceptIds`, `prerequisiteConceptIds` 순서로 찾는다. 현재 학년 게이트는 유지하므로 학년 전체 하강은 없다. 초4 시작 노드 아래의 결손은 초4 노드 내부 기초 확인으로 처리한다. 직접 선수의 서로 다른 구조 2개를 맞히면 원래 영역의 확인 상태로 복귀한다.

## 중3 이후와 경계

중3의 7개 영역을 통과하면 기존 `math-concept-graph-runtime.js` 상태를 생성한다. 이후 증거와 보충 후보, 다음·전이 후보, 콘텐츠 차단 여부는 기존 canonical graph에 위임한다. `COMPLETE_SPRING`이 아닌 후보는 `blockedNoContentConceptIds`에 기록하며 자동 학습 상태를 변경하지 않는다. 최저 경계는 G4, 최고 경계는 H3이고 H3 노드에서 대학 수학으로 이어지는 `nextConceptIds`는 허용하지 않는다.

## 세션 종료

진단 경계는 여러 세션에 걸쳐 이어질 수 있다. 한 세션은 24문항·20분 이후 현재 경계가 확인되면 종료할 수 있고, 늦어도 36문항 또는 30분에 종료한다. 진단 콘텐츠가 없는 graph 경계도 24문항 이후 종료 사유가 된다. 종료해도 직렬화된 상태를 다음 세션에서 복원하여 이어간다.

## 학생용 결과

결과 공개 항목은 `잘 이해한 개념`, `지금 시작할 학습`, `먼저 보충할 개념`, `다음에 도전할 개념`, `영역별 진단 신뢰도`뿐이다. canonical ID, gradeBand, scopeId와 “몇 학년으로 상승·하강” 문구는 만들지 않는다.

## 자동 검증

테스트는 초4 시작, 게이트 순차 상승, 중3 이후 graph 전환, 혼합 결과의 제3 문제, 반복 오류의 직접 선수 진단, 영역 독립, 초4·고3 경계, 중복 증거 차단, 상태 불변성·복원, 학생용 결과 비노출, 기존 학년별 보조 라우팅 유지, 승인 콘텐츠 파일 비변경을 검사한다.
