# 맞춤형 수학 진단 UI·저장 통합 감사

## 구현 범위

- 기본 수학 진단 버튼은 `ADAPTIVE_CONCEPT_DIAGNOSIS` 모드로 시작한다.
- 첫 상태는 `G4`의 첫 게이트 영역이며, 실제 초4 문제은행에서 첫 문제를 선택한다.
- 기존 학년 선택형 `resetLevelTest()` 및 학년별 문제은행 라우팅은 `학년별 범위 진단` 보조 모드로 유지한다.
- 문제 표시, 답 제출, 포기, 다음 문제 선택, 중단, 재개, 종료 결과를 기존 레벨테스트 화면에 연결했다.
- 진단 결과는 학생이 `이어서 공부하기`를 누를 때에만 본 학습 concept graph로 전달한다.

## 신규 모듈

### `math-adaptive-level-test-storage.js`

- cloud key: `mathAdaptiveLevelTestV1`
- local key: `studyCoinMathAdaptiveLevelTestV1:{userId}`
- 사용자별 분리, remote-wins, revision 충돌 보호, 빈 상태 덮어쓰기 차단을 적용한다.
- 현재 문제, 게이트, 영역, 증거, 질문 수, 남은 경로, 제출 ID, 결과와 완료 이력을 저장한다.

### `math-adaptive-level-test-ui.js`

- `MULTIPLE_CHOICE`, `SHORT_ANSWER`, `EXPRESSION_INPUT`, `STEP_ORDER`, `WRITTEN_RESPONSE`를 렌더링한다.
- 학생 화면에는 개념명과 자연스러운 한국어 안내만 표시한다.
- 학년 상승·하강 표현, `gradeGate`, canonical ID, scope ID는 표시하지 않는다.
- 동일 `submissionId`는 한 번만 반영한다.

## 실제 앱 연결

- `index.html`: 맞춤형 진단/학년별 범위 진단 버튼과 신규 모듈 로딩을 추가했다.
- `script.js`: 맞춤형 진단 controller, 실제 문제은행 catalog, 제출, 중단·재개, 결과 렌더링, 학습 시작 전달을 연결했다.
- `level-test-engine.js`: 공통 모드 상수 `ADAPTIVE_CONCEPT_DIAGNOSIS`를 공개한다.
- `tests/middle3-level-test.test.js`: `startSubjectLevelTest`의 선택적 모드 인자를 허용하도록 기존 정적 계약만 갱신했다.

## 중단·재개

1. 화면 이탈 전에 controller를 `PAUSED`로 만들고 로컬 및 가능한 경우 원격에 저장한다.
2. 재접속 시 사용자별 원격 상태를 우선 hydrate한다.
3. 진행 중 또는 중단 상태면 이어하기 화면을 보여준다.
4. 복원 시 저장된 `currentQuestion`을 그대로 사용하며 새 문제를 중복 선택하지 않는다.
5. 완료 세션은 재개하지 않고 새 진단 시작 시 history로 보존할 수 있다.

## 종료와 본 학습 연결

- 런타임의 24~36문항, 20~30분, 경계 확인, 진입 가능한 콘텐츠 여부 종료 계약을 그대로 사용한다.
- 결과 화면은 잘 이해한 개념, 지금 시작할 학습, 먼저 보충할 개념, 다음에 도전할 개념, 영역별 신뢰도를 표시한다.
- `COMPLETE_SPRING`이며 전용 런타임이 있는 개념을 학습 시작 후보로 우선한다.
- 진단 도중에는 `mathConceptGraphLearningV1` 상태를 변경하지 않는다.
- 학생이 학습 시작 버튼을 누를 때만 canonical evidence 완료 이벤트를 전달한다.

## 미완성 문제은행 처리

- 고등 문제은행을 중3 문제로 대체하지 않는다.
- 선택 가능한 문제가 없으면 `TEST_BANK_NOT_READY` 또는 `BLOCKED_NO_CONTENT`로 종료하고 자연스러운 준비 안내를 표시한다.
- 진단 결과와 누적 증거는 그대로 보존한다.

## 자동 검증

- 저장·복원·remote-wins·revision·사용자 분리: `tests/math-adaptive-level-test-storage.test.js`
- 다섯 답안형·문구·결과·중복 제출: `tests/math-adaptive-level-test-ui.test.js`
- 기본 버튼·첫 초4 문제·중단 재개·본 학습 분리·보조 모드: `tests/math-adaptive-level-test-e2e.test.js`
- 신규 통합 테스트 29개 통과.
- 전체 회귀 테스트 573개 통과, 실패 0.
- 브라우저·모바일·사용자 수동 테스트는 수행하지 않았다.
- stage, commit, push는 수행하지 않았다.
