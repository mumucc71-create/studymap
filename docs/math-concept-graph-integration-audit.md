# 수학 통합 개념망 레벨테스트·추천·학생 화면 연결 감사

## 범위

이번 단계는 학년별 레벨테스트 결과를 canonical concept evidence로 변환하고, 별도 그래프 저장 상태를 추천과 학생 화면에 연결한다. 승인된 문제·설명 콘텐츠, 기존 7개 World 데이터, 단원별 저장 key와 런타임 상태는 변경하지 않는다.

## 신규 모듈

- `math-level-test-concept-mapper.js`: 문제의 세부 ID·alias·한국어 단원명을 canonical conceptId 또는 unit-level alias evidence로 변환한다.
- `math-concept-graph-storage.js`: `mathConceptGraphLearningV1` / `studyCoinMathConceptGraphLearningV1` 전용 저장, 사용자 분리, remote-wins, revision 충돌 차단, 빈 상태 덮어쓰기 차단을 담당한다.
- `math-concept-graph-ui.js`: FINAL 증거 반영, 반복 오류에 따른 보충 진입, 보충 완료 후 복귀, 학생용 다섯 상태와 자연스러운 콘텐츠 준비 안내를 제공한다.

## 레벨테스트와 실제 학습의 분리

학년 선택과 `selectedGrade`는 기존 레벨테스트 범위 및 호환 정보로 유지한다. 문제별 결과는 `canonicalConceptId`, 정오 결과, 오류 태그, 구조·풀이 경로 서명, 시험 학년대, 난이도, 시각으로 변환한다. 광역 단원 ID는 세부 개념 전체로 펼치지 않고 unit-level evidence로만 저장한다. 최초 학습은 부분 이해, 실제 증거, `COMPLETE_SPRING` 및 `DEDICATED_SPRING`, 중3 중심 경로 근접성을 차례로 고려한다.

## 추천 연결

그래프 추천 유형은 `CONTINUE_CURRENT`, `REVIEW_PREREQUISITE`, `START_REMEDIAL`, `RETURN_TO_ORIGINAL`, `PROMOTE_TO_NEXT`, `ENTRY_CHECK`, `BLOCKED_NO_CONTENT`, `MAXIMUM_REACHED`다. 그래프의 최근 결정, 현재 개념, recovery stack, 대기 보충, 상승 후보 순서로 구성하고 기존 World 추천은 fallback으로 남긴다. 상승 후보는 추천만 표시하며 강제 전환하지 않는다.

## FINAL 증거 연결

공통 중3 단원 UI factory가 인수분해·이차방정식·삼각비·원의 성질·통계의 FINAL을 전달하고, 제곱근·이차함수 전용 UI도 같은 이벤트를 전달한다. 필드는 conceptId, problemId, structureSignature, solutionPathSignature, stage, result, misconceptionTags, independentCheck, finalSubmission, submissionId, timestamp다. 동일 submissionId는 그래프 런타임에서 한 번만 반영한다. `REVIEW_REQUIRED`는 숙달·승급 정답 증거에서 제외한다.

## 학생 문구

학생 화면은 `현재 학습`, `먼저 복습할 개념`, `기초 보충`, `다음 도전`, `원래 학습으로 돌아가기`만 사용한다. internalGradeBand, scopeId, canonical ID, cloud key, 런타임 상태 코드는 표시하지 않는다. 자동 진입할 콘텐츠가 없을 때는 “준비 중인 개념입니다. 현재 가능한 가장 가까운 학습으로 안내합니다.”라고 표시한다.

## 보존 계약

- 단원별 문제 풀이와 저장 상태는 기존 런타임이 계속 소유한다.
- 그래프는 이동 결정과 별도 증거만 저장한다.
- 기존 단원 key, 이차함수 계약, World sourceRoute, 레벨테스트 원본을 변경하지 않는다.
- 초4 아래 및 고3 위 이동은 그래프 런타임 경계 규칙을 그대로 사용한다.

## 자동 검증

신규 테스트는 세부/광역/alias/unknown 매핑, 최초 위치, 콘텐츠 진입 제한, 중복 증거, remote-wins, revision 충돌, 로그인 사용자 분리, 반복 오류 보충, 학생 문구 비노출, 추천 우선순위, 7개 단원 FINAL 이벤트, 별도 저장 key, 스크립트 순서, 기존 콘텐츠 SHA-256 생성을 검사한다. 브라우저·모바일·사용자 수동 테스트는 이번 범위에 포함하지 않는다.
