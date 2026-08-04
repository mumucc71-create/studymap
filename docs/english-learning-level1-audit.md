# 영어 1단계 학습 콘텐츠 감사

## 원인

기존 `englishOnlyFallbackView()`가 한국어가 섞인 레거시 문제를 영어 표면으로 바꾸는 과정에서 정상 문장의 첫 단어, 어순, 앞부분을 기계적으로 복제했다. 이 경로가 일반 영어 학습에도 사용되어 `I I see my friend.`, `see my friend I.`, `I see see my friend.`가 실제 선택지로 노출됐다.

운영 1단계는 이 fallback에 의존하지 않고 `english-learning-content-level1.js`의 수동 저작 사이클을 직접 사용한다. 레거시 20레벨 문제은행은 삭제하지 않았으며 뒤쪽 콘텐츠로 보존했다. fallback의 일반 문장 중복·역순 생성 분기는 제거했다.

## 콘텐츠 구조

| 사이클 | 주제 | 목표 어휘 | 목표 문법 | 문항 |
|---|---|---|---|---:|
| 01 | School Day | classroom, teacher, lesson, library | be동사, 일반현재 | 12 |
| 02 | Good Friends | friend, share, help, kind | 일반현재, 주어·동사 일치 | 12 |
| 03 | My Family | family, parents, brother, cook | have/has, 일반현재 | 12 |
| 04 | Food and Lunch | lunch, hungry, fresh, choose | 일반현재, 주어·동사 일치 | 12 |
| 05 | Everyday Routine | wake, usually, early, prepare | 빈도부사, 일반현재 | 12 |
| 06 | Free-Time Hobbies | hobby, practice, collect, enjoy | enjoy+동명사, 일반현재 | 12 |
| 07 | Changing Weather | weather, cloudy, umbrella, temperature | be동사, will | 12 |
| 08 | A Short Trip | trip, station, ticket, arrive | 과거시제, 시간 전치사 | 12 |
| 09 | Healthy Choices | healthy, exercise, rest, energy | should, 일반현재 | 12 |
| 10 | Animals and Nature | animal, forest, protect, habitat | can, 일반현재 | 12 |

각 사이클은 어휘 의미, 문맥 어휘 2문항, 문법, 자연스러운 문장, 문장 확장, 문장 연결, 짧은 독해 3문항, 새 문맥 전이, 혼자 풀기 순서로 구성된다. 각 목표 어휘는 서로 다른 문장 family에서 최소 세 번 다뤄진다.

## 자동 검증

`english-learning-quality-validator.js`는 필수 필드, ID·구조 중복, 정답 유일성, 빈·중복 선택지, 인접 단어 복제, 정답 어순 뒤집기, 영어+한국어 조사 혼합, 오답 태그, 정답 위치 분포, 선택지 길이, 어휘 문맥 노출, 독해·혼자 풀기, 문법 목표, 설명을 전수 검사한다.

120문항의 정답 위치는 0~3번에 각각 30문항씩 배치했다. 모든 오답은 정답이 아닌 misconception tag를 가지며 내부 태그와 ID는 학생 DOM에 표시하지 않는다.
