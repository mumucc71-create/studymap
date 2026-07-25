# 중3 영어·수학 Elite 기준 모델 v2 검수 보고서

## 1. 전체 판정 요약

- 검수 대상: 수학 42문항, 영어 40문항, 합계 82문항
- 최종 데이터 판정: 82문항 `APPROVED`
- 실질 중복 판정: 82문항 `DISTINCT`
- 재작성: 75문항
- 승인 구조 보존 및 재검수: 7문항
- 런타임 연결: 하지 않음
- UI·Firebase·일반 레벨테스트·학습 연결: 변경하지 않음
- 과학·한자·독서·중3 이차함수 기능: 변경하지 않음

이 보고서의 승인은 데이터 기준 모델에 대한 승인이다. 실제 Elite 런타임 연결이나 학생 화면의 제품 승인을 뜻하지 않는다.

## 2. 재작성 범위

보존한 7개 구조는 다음과 같다.

- `elite-m3-math-rad-h01`
- `elite-m3-math-rad-h03`
- `elite-m3-math-fac-h01`
- `elite-m3-math-qfn-h02`
- `elite-m3-math-cir-h03`
- `elite-m3-eng-h13`
- `elite-m3-eng-h20`

나머지 75문항은 같은 `problemId`와 기존 답안형 분포를 유지하되, 문제 구조·조건·풀이 전략·오답 선택지를 새로 작성했다. 교체 문항은 `contentVersion=m3-elite-rewrite-v2`, 보존·재검수 문항은 `contentVersion=m3-elite-reviewed-v2`이다.

## 3. 수학 42문항 구성

- 영역: 제곱근과 실수, 인수분해, 이차방정식, 이차함수, 삼각비, 원의 성질, 통계
- 각 영역: HIGH 3문항 + TOP 3문항
- 전체: HIGH 21문항 + TOP 21문항
- 답안형: 객관식 14, 단답형 7, 수식형 7, 과정형 7, 서술형 7
- 각 영역 TOP 3문항은 객관식 1, 과정형 1, 서술형 1로 구성했다.

## 4. 영어 40문항 구성

- 전체: HIGH 20문항 + TOP 20문항
- 답안형: 객관식 29, 서술형 11
- 11개 과업 유형을 유지했다.
- 문맥 어휘·복합 문법·긴 문장·빈칸·삽입·순서·요지·추론·태도는 각 4문항이다.
- 왜곡 판별·근거 설명은 각 2문항이다.

## 5. 수학 정답 독립 검산

42문항의 정답과 풀이를 문제 문장부터 다시 계산했다. 특히 다음 유형은 코드 완전탐색으로도 독립 검증했다.

- `rad-h02`: `n=4,36,484`, 합 `524`
- `fac-t01`: `(7,17),(8,15),(10,12)`, 합 `69`
- `qeq-t02`: `n=5,14,18,33,39,60,68,95`
- `qfn-t03`: 다섯 기록 중 `(0,7)`만 유일하게 불일치하며 수정값 `5`
- `tri-t02`: `(5,20,10),(9,16,12)`만 가능
- `cir-t03`: `(AP,CP)=(5,4)`만 가능

사람 검산 중 접선-현 각도, 직각삼각형 사영 방향, 순서쌍 대칭 조건, 원주각의 목표 각, 이차방정식 풀이의 범위 표현을 다시 확인하고 승인 전 수정했다.

## 6. 영어 정답·근거 검수

모든 영어 문항은 `evidenceSentences`가 실제 지문 또는 제시 선택지에 존재한다. 정답은 외부 지식 없이 해당 근거를 연결해 결정할 수 있다.

- 문맥 어휘: 대조·양보·인과로 의미와 강도를 제한한다.
- 문법: 도치·호응·관계절·간접의문문을 문장 의미와 함께 검증한다.
- 독해: 한 문장만 베끼지 않고 둘 이상의 근거를 연결한다.
- TOP: HIGH에 조건 하나를 덧붙인 형태가 아니라 표본·시간·분모·측정 방식·대안 설명 등 서로 다른 전략을 사용한다.

## 7. 오답 선택지 검수

수학·영어 객관식 43문항은 모두 정답이 선택지에 정확히 한 번 존재하며 오답 선택지 3개가 서로 다르다. 각 오답은 `distractorErrorMap`에 허용된 오류 코드와 실제 사고 오류 설명을 가진다.

- 수학: 경우 누락, 조건 누락, 부호 오류, 사영 방향 오류, 분산 중심 이동 누락 등 실제 계산 경로에서 나오는 값
- 영어: 범위 확대, 인과 확정, 지시 대상 오독, 연결어 선행 정보 누락, 표본과 전체 혼동 등 실제 독해 오류

임의 숫자나 지문과 관계없는 영어 선택지는 승인하지 않았다.

## 8. HIGH 절대 난이도 판정

HIGH는 최소 4개의 의미 있는 사고 단계와 5분 이상의 예상 사고시간을 요구한다. 실제 데이터는 대부분 5단계 이상이다. 직접 공식 대입, 용어 암기, 숫자만 바꾼 대표 유형은 `directFormulaSubstitution=false` 조건만으로 승인하지 않고 문제·풀이·함정을 함께 읽어 판정했다.

## 9. TOP 절대 난이도 판정

TOP는 최소 5개의 의미 있는 사고 단계와 10분 이상의 예상 사고시간을 요구한다. 문항별로 조건 변환, 경우 분류, 역추론, 전략 선택, 결과 검증 중 여러 요소를 포함했다. 수학 각 영역은 서로 다른 3개 TOP 구조를 사용하고, 영어 TOP은 동일한 지문 논리를 이름만 바꾸어 반복하지 않는다.

## 10. 과정형 7문항 검수

수학 과정형은 답만 맞아도 완전 정답으로 처리하지 않는다.

- `elite-m3-math-rad-t01`: 두 근호 조건의 후보 교집합과 원식 검증
- `elite-m3-math-fac-t01`: 곱셈식 변환, 인수쌍 생성, 차 조건 필터
- `elite-m3-math-qeq-t01`: 완전제곱 구조, 정수 조건, 양의 해 범위
- `elite-m3-math-qfn-t01`: 정수 매개변수 두 경우의 완전 분류
- `elite-m3-math-tri-t01`: 깃대 위치의 경우 나누기와 세 번째 관측 검증
- `elite-m3-math-cir-t01`: 접선-현, 각의 이등분, 내접사각형을 연쇄 적용
- `elite-m3-math-stat-t01`: 대칭 평균, 편차제곱합, 정수 제곱쌍 분류

## 11. 서술형 검수

수학 서술형 7문항은 모든 후보가 빠짐없다는 증명 또는 조건 탈락 이유를 요구한다. 영어 서술형 11문항은 근거와 추론을 분리해 부분점수를 줄 수 있다.

- 가짜 서술형 없음
- 정답 문장만 길게 쓰게 한 단답형 없음
- `answerRubric`에 필수 근거와 부분점수 기준 존재
- 영어는 복수 근거 또는 근거+한계+후속 검증을 요구

## 12. 교육과정 범위

수학은 2015 개정 중3 범위 안에서 해결한다.

- 이차방정식에서 근과 계수의 관계 및 판별식 용어를 요구하지 않는다.
- 이차함수에서 최댓값·최솟값 및 두 그래프의 위치 관계를 요구하지 않는다.
- 고등학교 공식이나 미적분·확률 개념을 요구하지 않는다.

영어는 중3 문맥·문법·담화·독해 범위이며 전문 배경지식 없이 지문만으로 해결한다.

## 13. 실질 중복 검수

82개 `problemId`, `structureSignature`, `solutionPathSignature`가 모두 고유하다. 숫자만 변경, 조건 순서만 변경, 동일한 첫 식, 동일한 핵심 풀이 전략을 별도로 비교했다. 자동 문자열 고유성뿐 아니라 문제 구조와 첫 전략을 사람이 다시 읽어 전부 `DISTINCT`로 판정했다.

## 14. 수학 42문항 목록

| problemId | level | answerType | 정답 | 판정 |
|---|---|---|---|---|
| elite-m3-math-rad-h01 | HIGH | MULTIPLE_CHOICE | 970 | APPROVED · DISTINCT |
| elite-m3-math-rad-h02 | HIGH | SHORT_ANSWER | 524 | APPROVED · DISTINCT |
| elite-m3-math-rad-h03 | HIGH | EXPRESSION | 15 | APPROVED · DISTINCT |
| elite-m3-math-rad-t01 | TOP | PROCESS | n=4 | APPROVED · DISTINCT |
| elite-m3-math-rad-t02 | TOP | WRITTEN | (m,n)=(16,100), (400,484) | APPROVED · DISTINCT |
| elite-m3-math-rad-t03 | TOP | MULTIPLE_CHOICE | 202 | APPROVED · DISTINCT |
| elite-m3-math-fac-h01 | HIGH | MULTIPLE_CHOICE | 64 | APPROVED · DISTINCT |
| elite-m3-math-fac-h02 | HIGH | SHORT_ANSWER | 4097 | APPROVED · DISTINCT |
| elite-m3-math-fac-h03 | HIGH | EXPRESSION | (a-b)(a-c)(b-c) | APPROVED · DISTINCT |
| elite-m3-math-fac-t01 | TOP | PROCESS | 69 | APPROVED · DISTINCT |
| elite-m3-math-fac-t02 | TOP | WRITTEN | n=-1 | APPROVED · DISTINCT |
| elite-m3-math-fac-t03 | TOP | MULTIPLE_CHOICE | 38 | APPROVED · DISTINCT |
| elite-m3-math-qeq-h01 | HIGH | MULTIPLE_CHOICE | 5m | APPROVED · DISTINCT |
| elite-m3-math-qeq-h02 | HIGH | SHORT_ANSWER | 30km/h | APPROVED · DISTINCT |
| elite-m3-math-qeq-h03 | HIGH | EXPRESSION | 52 | APPROVED · DISTINCT |
| elite-m3-math-qeq-t01 | TOP | PROCESS | 150 | APPROVED · DISTINCT |
| elite-m3-math-qeq-t02 | TOP | WRITTEN | n=5,14,18,33,39,60,68,95 | APPROVED · DISTINCT |
| elite-m3-math-qeq-t03 | TOP | MULTIPLE_CHOICE | 76 | APPROVED · DISTINCT |
| elite-m3-math-qfn-h01 | HIGH | MULTIPLE_CHOICE | 4 | APPROVED · DISTINCT |
| elite-m3-math-qfn-h02 | HIGH | SHORT_ANSWER | 5 | APPROVED · DISTINCT |
| elite-m3-math-qfn-h03 | HIGH | EXPRESSION | 46 | APPROVED · DISTINCT |
| elite-m3-math-qfn-t01 | TOP | PROCESS | 10 | APPROVED · DISTINCT |
| elite-m3-math-qfn-t02 | TOP | WRITTEN | y=3(x-2)²+8 | APPROVED · DISTINCT |
| elite-m3-math-qfn-t03 | TOP | MULTIPLE_CHOICE | 5 | APPROVED · DISTINCT |
| elite-m3-math-tri-h01 | HIGH | MULTIPLE_CHOICE | 150 | APPROVED · DISTINCT |
| elite-m3-math-tri-h02 | HIGH | SHORT_ANSWER | 10m | APPROVED · DISTINCT |
| elite-m3-math-tri-h03 | HIGH | EXPRESSION | 40 | APPROVED · DISTINCT |
| elite-m3-math-tri-t01 | TOP | PROCESS | 높이 5m, O는 B와 C 사이에서 B로부터 10m | APPROVED · DISTINCT |
| elite-m3-math-tri-t02 | TOP | WRITTEN | (5,20,10), (9,16,12), 넓이 합 275 | APPROVED · DISTINCT |
| elite-m3-math-tri-t03 | TOP | MULTIPLE_CHOICE | 375 | APPROVED · DISTINCT |
| elite-m3-math-cir-h01 | HIGH | MULTIPLE_CHOICE | 10 | APPROVED · DISTINCT |
| elite-m3-math-cir-h02 | HIGH | SHORT_ANSWER | 85° | APPROVED · DISTINCT |
| elite-m3-math-cir-h03 | HIGH | EXPRESSION | 20° | APPROVED · DISTINCT |
| elite-m3-math-cir-t01 | TOP | PROCESS | 12° | APPROVED · DISTINCT |
| elite-m3-math-cir-t02 | TOP | WRITTEN | (8,10), (9,7) | APPROVED · DISTINCT |
| elite-m3-math-cir-t03 | TOP | MULTIPLE_CHOICE | 9 | APPROVED · DISTINCT |
| elite-m3-math-stat-h01 | HIGH | MULTIPLE_CHOICE | 32 | APPROVED · DISTINCT |
| elite-m3-math-stat-h02 | HIGH | SHORT_ANSWER | 35/3 | APPROVED · DISTINCT |
| elite-m3-math-stat-h03 | HIGH | EXPRESSION | 41/3 | APPROVED · DISTINCT |
| elite-m3-math-stat-t01 | TOP | PROCESS | a=3, b=5 | APPROVED · DISTINCT |
| elite-m3-math-stat-t02 | TOP | WRITTEN | 12 | APPROVED · DISTINCT |
| elite-m3-math-stat-t03 | TOP | MULTIPLE_CHOICE | 61 | APPROVED · DISTINCT |

## 15. 영어 40문항 목록

| problemId | level | answerType | 정답 요약 | 판정 |
|---|---|---|---|---|
| elite-m3-eng-h01 | HIGH | MULTIPLE_CHOICE | carefully limited rather than strongly confident | APPROVED · DISTINCT |
| elite-m3-eng-h02 | HIGH | MULTIPLE_CHOICE | Not until ... did it understand ... | APPROVED · DISTINCT |
| elite-m3-eng-h03 | HIGH | MULTIPLE_CHOICE | Students without a calm study place relied on it. | APPROVED · DISTINCT |
| elite-m3-eng-h04 | HIGH | MULTIPLE_CHOICE | a continuous supply of blooms | APPROVED · DISTINCT |
| elite-m3-eng-h05 | HIGH | MULTIPLE_CHOICE | after (1) | APPROVED · DISTINCT |
| elite-m3-eng-h06 | HIGH | MULTIPLE_CHOICE | C-A-B | APPROVED · DISTINCT |
| elite-m3-eng-h07 | HIGH | MULTIPLE_CHOICE | visible improvement can hide costs elsewhere | APPROVED · DISTINCT |
| elite-m3-eng-h08 | HIGH | MULTIPLE_CHOICE | ratings may overstate all arriving visitors' experience | APPROVED · DISTINCT |
| elite-m3-eng-h09 | HIGH | MULTIPLE_CHOICE | cautiously supportive | APPROVED · DISTINCT |
| elite-m3-eng-h10 | HIGH | MULTIPLE_CHOICE | “guarantees ... every subject” is distorted | APPROVED · DISTINCT |
| elite-m3-eng-h11 | HIGH | MULTIPLE_CHOICE | limited by a reservation | APPROVED · DISTINCT |
| elite-m3-eng-h12 | HIGH | MULTIPLE_CHOICE | The set ... shows ... | APPROVED · DISTINCT |
| elite-m3-eng-h13 | HIGH | WRITTEN | 인터넷 접근 부족 집단의 낮은 참여로 생긴 대표성 우려 | APPROVED · DISTINCT |
| elite-m3-eng-h14 | HIGH | MULTIPLE_CHOICE | points out problems without doing decisions | APPROVED · DISTINCT |
| elite-m3-eng-h15 | HIGH | MULTIPLE_CHOICE | after (2) | APPROVED · DISTINCT |
| elite-m3-eng-h16 | HIGH | MULTIPLE_CHOICE | C-B-A | APPROVED · DISTINCT |
| elite-m3-eng-h17 | HIGH | WRITTEN | 평가 지표가 선택 행동을 바꿀 수 있음 | APPROVED · DISTINCT |
| elite-m3-eng-h18 | HIGH | MULTIPLE_CHOICE | surviving diaries represent wealthy travel more fully | APPROVED · DISTINCT |
| elite-m3-eng-h19 | HIGH | WRITTEN | 옥상 정원에 대한 신중한 조건부 지지 | APPROVED · DISTINCT |
| elite-m3-eng-h20 | HIGH | WRITTEN | 상관은 인과를 증명하지 않으며 추가 통제가 필요 | APPROVED · DISTINCT |
| elite-m3-eng-t01 | TOP | MULTIPLE_CHOICE | reduced in effect by an opposing cost | APPROVED · DISTINCT |
| elite-m3-eng-t02 | TOP | MULTIPLE_CHOICE | Only after ... did the committee revise ... | APPROVED · DISTINCT |
| elite-m3-eng-t03 | TOP | WRITTEN | best-of-two와 single result 비교의 비대칭 | APPROVED · DISTINCT |
| elite-m3-eng-t04 | TOP | MULTIPLE_CHOICE | limited trial that reduces uncertainty | APPROVED · DISTINCT |
| elite-m3-eng-t05 | TOP | MULTIPLE_CHOICE | after (3) | APPROVED · DISTINCT |
| elite-m3-eng-t06 | TOP | MULTIPLE_CHOICE | C-A-B-D | APPROVED · DISTINCT |
| elite-m3-eng-t07 | TOP | MULTIPLE_CHOICE | normal efficiency loss can buy resilience | APPROVED · DISTINCT |
| elite-m3-eng-t08 | TOP | MULTIPLE_CHOICE | classification changed more than participation | APPROVED · DISTINCT |
| elite-m3-eng-t09 | TOP | MULTIPLE_CHOICE | reluctant acceptance with environmental condition | APPROVED · DISTINCT |
| elite-m3-eng-t10 | TOP | MULTIPLE_CHOICE | “every visitor ... made” is distorted | APPROVED · DISTINCT |
| elite-m3-eng-t11 | TOP | MULTIPLE_CHOICE | accepted one opposing point, kept overall position | APPROVED · DISTINCT |
| elite-m3-eng-t12 | TOP | MULTIPLE_CHOICE | Neither ... recording ... explains ... | APPROVED · DISTINCT |
| elite-m3-eng-t13 | TOP | WRITTEN | post-peak 표본 조건 때문에 개선 해석이 어려움 | APPROVED · DISTINCT |
| elite-m3-eng-t14 | TOP | MULTIPLE_CHOICE | measure should be checked against intended outcome | APPROVED · DISTINCT |
| elite-m3-eng-t15 | TOP | WRITTEN | (3) 뒤, field no-change와 gate drop 지시 | APPROVED · DISTINCT |
| elite-m3-eng-t16 | TOP | WRITTEN | B-D-A-C | APPROVED · DISTINCT |
| elite-m3-eng-t17 | TOP | WRITTEN | 수집 방법이 무엇을 보이게 하는지 결정 | APPROVED · DISTINCT |
| elite-m3-eng-t18 | TOP | MULTIPLE_CHOICE | adaptation/exposure, not necessarily quieter source | APPROVED · DISTINCT |
| elite-m3-eng-t19 | TOP | WRITTEN | 개선 인정 후 증거 공백에 회의적 유보 | APPROVED · DISTINCT |
| elite-m3-eng-t20 | TOP | WRITTEN | 관찰 증가, 인과 한계 2개, 후속 비교 | APPROVED · DISTINCT |

## 16. 자동 품질 테스트

전용 테스트는 다음을 검증한다.

- 75 재작성 + 7 보존 버전
- 과목·레벨·영역·답안형 분포
- 82문항 공통 스키마
- 82개 ID·구조·풀이 경로 고유성
- 수학 42 정답 키
- 대표 정수 조건 6종 독립 완전탐색
- 객관식 정답 유일성과 오답별 오류 코드
- 영어 근거 문장의 실제 지문 존재
- 영어 서술형 부분점수 가능성
- 교육과정 금지 범위 부재
- 런타임·UI 미연결

## 17. 변경하지 않은 영역

다음은 이 작업에서 수정하지 않았다.

- `elite-test.js`
- `index.html`
- `styles.css`
- Firebase 저장 구조
- 일반 레벨테스트
- 학습 화면과 학습 연결
- 과학·한자·독서
- 중3 이차함수 학습 기능
- 기존 로그인·설정 변경

## 18. 남은 위험과 다음 단계

### 남은 위험

- 이 승인은 정적 기준 데이터와 자동·사람 검수에 대한 것이다.
- 실제 학생 풀이 시간과 정답률로 HIGH/TOP 경계가 재보정될 수 있다.
- 런타임 연결 전에는 답안형별 입력·채점 UI 호환성을 별도 검증해야 한다.

### 다음 단계 권고

현재 82문항을 기준 모델로 동결한 뒤, 별도 작업에서만 Elite 런타임 어댑터와 학생 사용성 검증을 진행한다. 본 작업에서는 연결하지 않는다.

## 최종 판정

중3 영어·수학 Elite 기준 데이터 품질 승인
