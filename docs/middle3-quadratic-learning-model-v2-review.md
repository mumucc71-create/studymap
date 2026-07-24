# 중3 이차함수 기준 모델 v2 사람 검수 보고서

## 1. 전체 판정

- 총 문항: 108
- 유지: 48
- 수정: 5
- 전면 교체: 55
- 단계 분포: BASIC 18, A1 18, A2 18, A3 18, A4 18, A5 18
- 답안 형식: 객관식 23, 단답형 27, 수식 입력형 34, 과정형 12, 서술형 12
- OUT_OF_CURRICULUM: 0
- AMBIGUOUS: 0
- INVALID: 0
- 실질 중복: 0
- 수학 오류: 0
- 자동 테스트: 123/123 통과

## 2. 감사 오류 5건 조치

1. `area-model`: 정사각형 넓이에서 4를 빼는 조건, 식 `y=x²+4x`, 정의역 `x>-2`를 일치시켰다.
2. `model-selection-process`: 고정 넓이 모순을 제거하고, 두 넓이의 차에서 이차항이 소거되어 일차함수가 되는 판정 과정으로 교체했다.
3. `ordered-values`: 실제 함수값이 아니라 절댓값을 비교하도록 질문과 정답을 일치시켰다.
4. `moving-line-intersections`: 중3 범위 밖 접선·중근 구조를 제거하고 정수 높이 단면의 경우 분류 문제로 교체했다.
5. `integrated-profit-model`: 인상 횟수의 정수 정의역과 구간별 인원 감소식을 명시하고 두 구간 최대를 직접 비교하도록 교체했다.

## 3. 대표 36문항 상세

### 1. m3-qf-learning-1-a3-1-table-reconstruction

- conceptId: `m3_quadratic_function_meaning`
- stage: A3
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: x=-1,0,1,2일 때 이차함수 y=ax²+bx+c의 함수값이 차례로 6,1,0,k이다. k와 함수의 식을 구하세요.

**정답**

k=3,y=2x^2-3x+1

**전체 풀이**

1. x=0에서 c=1을 얻는다.
2. x=-1,1 조건으로 a-b=5, a+b=-1을 세운다.
3. 두 식을 풀어 a=2,b=-3을 구한다.
4. x=2를 대입해 k=3을 구하고 네 값을 검산한다.

**필수 사고 단계/채점 근거**

- x=0에서 c=1을 얻는다.
- x=-1,1 조건으로 a-b=5, a+b=-1을 세운다.
- 두 식을 풀어 a=2,b=-3을 구한다.
- x=2를 대입해 k=3을 구하고 네 값을 검산한다.

- 난이도 기준 대응: 조건 4개를 연결하고, 4단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=4; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=quadratic-table-coefficients; 전략=가장 단순한 x=0을 먼저 사용하고 대칭 위치 두 식을 연립; 조건 변환=표→세 계수식→미지 함수값; 그래프/상황=four-value-table; 목표=formula-and-missing-value

### 2. m3-qf-learning-1-a4-1-single-error-table

- conceptId: `m3_quadratic_function_meaning`
- stage: A4
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: x=-2,-1,0,1,2에서 어떤 이차함수의 값을 측정했더니 11,6,3,2,4였다. 정확한 자료는 2차 차이가 일정하고 측정값 하나만 1만큼 크게 기록되었다. 잘못 기록된 x와 올바른 값을 구하세요.

**정답**

x=2,3

**전체 풀이**

1. 다섯 값의 1차 차이와 2차 차이를 계산해 불일치 위치를 좁힌다.
2. 마지막 값 4를 1 줄인 3으로 두고 1차 차이 -5,-3,-1,1을 다시 계산한다.
3. 2차 차이가 모두 2가 됨을 확인한다.
4. 다른 한 값을 1 줄이는 경우에는 세 2차 차이가 일치하지 않으므로 x=2만 가능함을 검증한다.

**필수 사고 단계/채점 근거**

- 다섯 값의 1차 차이와 2차 차이를 계산해 불일치 위치를 좁힌다.
- 마지막 값 4를 1 줄인 3으로 두고 1차 차이 -5,-3,-1,1을 다시 계산한다.
- 2차 차이가 모두 2가 됨을 확인한다.
- 다른 한 값을 1 줄이는 경우에는 세 2차 차이가 일치하지 않으므로 x=2만 가능함을 검증한다.

- 난이도 기준 대응: 복합 조건 5개와 4단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=4; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=one-error-finite-difference; 전략=오류 위치를 가정별로 바꾸어 2차 차이 일관성을 역검증; 조건 변환=자료→차분→오류 후보별 재계산; 그래프/상황=corrupted-data-table; 목표=impossibility-diagnosis

### 3. m3-qf-learning-1-a4-2-model-selection-process

- conceptId: `m3_quadratic_function_meaning`
- stage: A4
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: 한 변이 x+3인 정사각형에서 가로 x, 세로 x+1인 직사각형을 잘라 냈다. 남은 넓이 y가 이차함수인지 판정하는 풀이 과정을 배열하세요.

**정답**

1. 전체 넓이 (x+3)²과 잘라 낸 넓이 x(x+1)을 세운다
2. 남은 넓이 y=(x+3)²-x(x+1)을 세운다
3. 두 식을 전개해 y=5x+9로 정리한다
4. x²항이 소거되어 최고차항이 일차임을 확인한다
5. 길이 조건 x>0에서 y는 이차함수가 아니라 일차함수라고 결론낸다

**전체 풀이**

1. 두 도형의 넓이를 각각 식으로 변환한다.
2. 남은 넓이를 차로 나타낸다.
3. 전개 과정에서 이차항이 소거되는지 계산한다.
4. 최고차항으로 함수의 차수를 판정한다.
5. 길이 정의역과 최종 결론을 함께 확인한다.

**필수 사고 단계/채점 근거**

- 두 넓이 모델 설정 (2점, 근거: (x+3)² / x(x+1))
- 남은 넓이 관계식 (2점, 근거: y=(x+3)²-x(x+1) / y=(x+3)^2-x(x+1))
- 전개와 소거 계산 (2점, 근거: y=5x+9 / x²항이 소거)
- 최고차항으로 차수 판정 (2점, 근거: 일차함수 / 이차함수가 아니다)
- 길이 조건과 결론 검증 (2점, 근거: x>0)

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=difference-of-areas; 전략=두 이차식의 차에서 최고차항 소거 여부를 직접 확인; 조건 변환=도형 두 개→넓이 차→차수 판정; 그래프/상황=composite-area-model; 목표=scored-classification-process

### 4. m3-qf-learning-1-a5-1-parameter-cancellation-symmetry

- conceptId: `m3_quadratic_function_meaning`
- stage: A5
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: F_t(x)=(t+1)(x-2)²-t(x+1)²+x²이다. F_t(0)=F_t(4)를 만족하도록 하는 t와 그때 F_t(x)를 구하세요.

**정답**

t=2/3,F_t(x)=2x^2-8x+6

**전체 풀이**

1. 세 항의 x²계수를 합해 t와 관계없이 2임을 확인한다.
2. 식을 2x²+(-6t-4)x+(3t+4)로 정리한다.
3. F_t(0)=F_t(4)를 함수값 식으로 바꾸거나 축이 x=2임을 이용한다.
4. t=2/3을 구해 식 2x²-8x+6을 완성한다.
5. x=0,4에서 함수값이 모두 6인지 검산한다.

**필수 사고 단계/채점 근거**

- 세 항의 x²계수를 합해 t와 관계없이 2임을 확인한다.
- 식을 2x²+(-6t-4)x+(3t+4)로 정리한다.
- F_t(0)=F_t(4)를 함수값 식으로 바꾸거나 축이 x=2임을 이용한다.
- t=2/3을 구해 식 2x²-8x+6을 완성한다.
- x=0,4에서 함수값이 모두 6인지 검산한다.

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 4개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=parameterized-composite-quadratic; 전략=계수 소거 구조를 먼저 분석하고 같은 함수값을 축 조건으로 역변환; 조건 변환=복합식→계수 정리→대칭 조건→매개변수; 그래프/상황=parameter-family-with-fixed-leading-term; 목표=parameter-and-expanded-form

### 5. m3-qf-learning-1-a5-2-corrupted-symmetric-data

- conceptId: `m3_quadratic_function_meaning`
- stage: A5
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 축이 x=0인 이차함수의 측정표가 x=-2,-1,0,1,2에서 11,5,3,5,12로 기록되었다. 정확히 한 값만 잘못되었다. 잘못된 항목을 고치고 함수식을 구하세요.

**정답**

x=2의 12를 11로 고치고 y=2x^2+3

**전체 풀이**

1. 축이 x=0이므로 f(-x)=f(x)여야 함을 사용한다.
2. f(-1)=f(1)=5와 f(0)=3에서 y=ax²+3으로 놓고 a=2를 구한다.
3. 후보식 y=2x²+3에서 f(-2)=f(2)=11을 계산한다.
4. 따라서 x=2의 12만 11로 고쳐야 함을 찾는다.
5. 다섯 점과 '오류 한 개' 조건을 모두 다시 검증한다.

**필수 사고 단계/채점 근거**

- 축이 x=0이므로 f(-x)=f(x)여야 함을 사용한다.
- f(-1)=f(1)=5와 f(0)=3에서 y=ax²+3으로 놓고 a=2를 구한다.
- 후보식 y=2x²+3에서 f(-2)=f(2)=11을 계산한다.
- 따라서 x=2의 12만 11로 고쳐야 함을 찾는다.
- 다섯 점과 '오류 한 개' 조건을 모두 다시 검증한다.

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=one-error-symmetric-table; 전략=정상 대칭쌍으로 식을 먼저 복원한 뒤 남은 쌍의 오류를 판별; 조건 변환=축→대칭쌍→계수→오류 위치; 그래프/상황=corrupted-symmetric-table; 목표=repair-and-formula

### 6. m3-qf-learning-1-a5-3-difference-of-squares-family

- conceptId: `m3_quadratic_function_meaning`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: m은 2보다 큰 자연수이다. 한 변의 길이가 각각 x+m, x-m인 두 정사각형의 넓이 차에 (m-2)x²을 더해 G_m(x)=(x+m)²-(x-m)²+(m-2)x²을 만들었다. 두 정사각형의 변은 모두 양수이다. G_m의 축이 x=-6일 때 m, 함수식, 가능한 x의 범위를 구하고 G_m이 이차함수인 이유를 설명하세요.

**정답**

전개하면 G_m(x)=(m-2)x²+4mx이다. m>2이므로 이차항의 계수가 0이 아니다. 따라서 G_m은 이차함수이다. 축이 -2m/(m-2)=-6이므로 m=3이다. 길이 x-m이 양수여야 하므로 x>3이다. 결론은 m=3, G_3(x)=x²+12x, x>3이다.

**전체 풀이**

1. 넓이 차를 전개해 G_m(x)=(m-2)x²+4mx로 정리한다.
2. m>2이므로 이차항 계수가 0이 아니어서 이차함수임을 확인한다.
3. 축의 식 -2m/(m-2)=-6을 세운다.
4. m=3을 구하고 G_3(x)=x²+12x를 얻는다.
5. x-m>0에서 x>3을 찾고 축·식·정의역을 각각 검증한다.

**필수 사고 단계/채점 근거**

- 주장: (m-2)x²+4mx / (m-2)x^2+4mx (2점)
- 주장: m>2이므로 m-2는 0이 아니다 / 이차항의 계수가 0이 아니다 (2점)
- 관계: 축 / -2m/(m-2) → -6 (2점)
- 관계: x-m / x-3 → 양수 / x>3 (2점)
- 계산: m=3 (2점)
- 계산: G_3(x)=x²+12x / G3(x)=x^2+12x (2점)
- 결론: m=3, G_3(x)=x²+12x, x>3 / m=3이고 함수식은 x²+12x이며 x>3 (2점)

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=parameterized-area-difference; 전략=도형식의 최고차항을 분석한 뒤 축 조건을 매개변수 방정식으로 역추론; 조건 변환=넓이 차→계수→축→자연수→정의역; 그래프/상황=geometric-parameter-family; 목표=proof-parameter-formula-domain

### 7. m3-qf-learning-2-a3-1-difference-determines-shape

- conceptId: `m3_quadratic_graph_shape`
- stage: A3
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: f(x)=ax²에서 f(3)-f(1)=16이다. a, f(2)를 구하고 그래프의 폭을 y=3x²과 비교하세요.

**정답**

a=2,f(2)=8,y=3x^2보다 넓다

**전체 풀이**

1. f(3)-f(1)=9a-a=8a로 바꾼다.
2. 8a=16에서 a=2를 구하고 f(2)=8을 계산한다.
3. 두 계수가 모두 양수이고 |2|<|3|이므로 f의 그래프가 더 넓다고 판단한다.

**필수 사고 단계/채점 근거**

- f(3)-f(1)=9a-a=8a로 바꾼다.
- 8a=16에서 a=2를 구하고 f(2)=8을 계산한다.
- 두 계수가 모두 양수이고 |2|<|3|이므로 f의 그래프가 더 넓다고 판단한다.

- 난이도 기준 대응: 조건 3개를 연결하고, 3단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=3; linkedConditions=3; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=function-value-difference; 전략=두 함수값의 차에서 계수를 분리한 뒤 폭으로 해석; 조건 변환=함수값 차→계수→그래프 폭; 그래프/상황=origin-parabola-comparison; 목표=coefficient-value-width

### 8. m3-qf-learning-2-a4-1-symmetric-chord-area

- conceptId: `m3_quadratic_graph_shape`
- stage: A4
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: y=ax²의 그래프 위 점 P(-2,4a), Q(2,4a)와 원점 O가 만드는 삼각형 OPQ의 넓이가 16이다. 그래프가 아래쪽으로 열릴 때 a를 구하고 y=-3x²과 폭을 비교하세요.

**정답**

a=-2,y=-3x^2보다 넓다

**전체 풀이**

1. PQ가 수평이고 길이가 4임을 확인한다.
2. 원점에서 PQ까지의 높이가 |4a|이므로 넓이가 8|a|임을 세운다.
3. 8|a|=16에서 |a|=2를 구하고 아래 방향에서 a=-2를 고른다.
4. |-2|<|-3|이므로 주어진 그래프가 y=-3x²보다 넓다고 결론낸다.
5. P,Q의 위치가 아래쪽 그래프와 일치하는지 검증한다.

**필수 사고 단계/채점 근거**

- PQ가 수평이고 길이가 4임을 확인한다.
- 원점에서 PQ까지의 높이가 |4a|이므로 넓이가 8|a|임을 세운다.
- 8|a|=16에서 |a|=2를 구하고 아래 방향에서 a=-2를 고른다.
- |-2|<|-3|이므로 주어진 그래프가 y=-3x²보다 넓다고 결론낸다.
- P,Q의 위치가 아래쪽 그래프와 일치하는지 검증한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=symmetric-chord-triangle-area; 전략=그래프 위 대칭점의 현을 삼각형 밑변으로 해석해 |a| 복원; 조건 변환=좌표→길이·높이→넓이→부호; 그래프/상황=origin-parabola-with-chord; 목표=coefficient-and-width

### 9. m3-qf-learning-2-a4-2-integer-height-cases

- conceptId: `m3_quadratic_graph_shape`
- stage: A4
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: y=a(x-1)²-3에서 a는 양의 정수이고 그래프는 y=2x²보다 폭이 좁다. y=5인 그래프 위 점의 x좌표가 정수일 때 a와 가능한 x를 모두 구하세요.

**정답**

a=8,x=0,2

**전체 풀이**

1. y=5를 대입해 a(x-1)²=8을 세운다.
2. 폭 조건에서 a>2이고 a가 8의 양의 약수임을 찾는다.
3. (x-1)²이 정수의 제곱이어야 하므로 a=8 또는 2를 경우 나눈다.
4. a=2는 폭 조건을 만족하지 않아 제외하고 a=8을 남긴다.
5. (x-1)²=1에서 x=0,2를 구하고 두 점을 검산한다.

**필수 사고 단계/채점 근거**

- y=5를 대입해 a(x-1)²=8을 세운다.
- 폭 조건에서 a>2이고 a가 8의 양의 약수임을 찾는다.
- (x-1)²이 정수의 제곱이어야 하므로 a=8 또는 2를 경우 나눈다.
- a=2는 폭 조건을 만족하지 않아 제외하고 a=8을 남긴다.
- (x-1)²=1에서 x=0,2를 구하고 두 점을 검산한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=integer-horizontal-section; 전략=정수 계수와 정수 좌표를 약수·제곱수 경우로 분류; 조건 변환=높이 조건→곱 8→약수 경우→폭 필터; 그래프/상황=shifted-parabola-horizontal-level; 목표=integer-coefficient-and-points

### 10. m3-qf-learning-2-a5-1-integrated-two-parabolas

- conceptId: `m3_quadratic_graph_shape`
- stage: A5
- 답안 형식: 객관식 (`MULTIPLE_CHOICE`)
- 문제: G:y=ax²는 아래쪽으로 열리고, 그래프 위 P(-2,4a), Q(2,4a)와 원점이 만드는 삼각형의 넓이가 16이다. H는 G와 폭이 같고 반대 방향으로 열리며 H(1)=H(5)=5이다. H의 식은?

**정답**

y=2(x-3)²-3

**전체 풀이**

1. 삼각형 넓이 8|a|=16에서 |a|=2를 얻고 G의 방향으로 a=-2를 정한다.
2. H는 같은 폭·반대 방향이므로 이차항 계수가 2임을 찾는다.
3. H(1)=H(5)에서 축이 두 x좌표의 중점 x=3임을 찾는다.
4. H:y=2(x-3)²+q에 (1,5)를 대입해 q=-3을 구한다.
5. 두 점, 방향, 폭을 모두 재검증해 첫 번째 식을 고른다.

**필수 사고 단계/채점 근거**

- 삼각형 넓이 8|a|=16에서 |a|=2를 얻고 G의 방향으로 a=-2를 정한다.
- H는 같은 폭·반대 방향이므로 이차항 계수가 2임을 찾는다.
- H(1)=H(5)에서 축이 두 x좌표의 중점 x=3임을 찾는다.
- H:y=2(x-3)²+q에 (1,5)를 대입해 q=-3을 구한다.
- 두 점, 방향, 폭을 모두 재검증해 첫 번째 식을 고른다.

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=area-to-width-to-symmetry; 전략=첫 그래프의 기하 정보로 폭을 복원해 대칭 자료가 있는 둘째 그래프로 전달; 조건 변환=삼각형 넓이→|a|·부호→H 계수→축→q; 그래프/상황=coupled-parabolas; 목표=formula-selection

### 11. m3-qf-learning-2-a5-2-cross-section-reconstruction

- conceptId: `m3_quadratic_graph_shape`
- stage: A5
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: 위로 열린 포물선의 최솟값은 -4이다. 높이 y=5인 두 점의 x좌표가 -1,7이고, 그래프는 y=x²보다 폭이 넓다. 함수식을 복원하고 모든 조건을 검증하는 과정을 배열하세요.

**정답**

1. 같은 높이의 두 x좌표 중점에서 축 x=3을 찾는다
2. 최솟값 -4를 이용해 꼭짓점 (3,-4)를 정한다
3. y=a(x-3)²-4에 점 (-1,5)를 대입한다
4. 9=16a에서 a=9/16을 구한다
5. |a|<1과 점 (7,5)를 확인해 폭과 대칭 조건을 검증한다

**전체 풀이**

1. 수평 단면의 중점으로 축을 구한다.
2. 축과 최솟값으로 꼭짓점을 정한다.
3. 한 점을 식에 대입해 계수 방정식을 세운다.
4. 계수를 계산해 식을 완성한다.
5. 다른 점과 폭 조건으로 독립 검산한다.

**필수 사고 단계/채점 근거**

- 두 x좌표의 중점으로 축 계산 (2점, 근거: 축 x=3 / (-1+7)/2=3)
- 최솟값으로 꼭짓점 결정 (2점, 근거: 꼭짓점 (3,-4))
- 점 대입 계수식 (2점, 근거: 9=16a)
- 계수와 함수식 계산 (2점, 근거: a=9/16 / y=9/16(x-3)²-4)
- 폭·대칭점 검산 (2점, 근거: 9/16<1 / (7,5))

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=horizontal-cross-section-reconstruction; 전략=수평 단면 중점과 최솟값을 결합하고 남은 단면점으로 검산; 조건 변환=같은 높이→축→꼭짓점→계수→폭; 그래프/상황=horizontal-section-parabola; 목표=scored-reconstruction-process

### 12. m3-qf-learning-2-a5-3-paired-values-uniqueness

- conceptId: `m3_quadratic_graph_shape`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: 위로 열린 이차함수 f가 f(-2)=f(4)=15, f(-1)=5를 만족하고 최솟값을 갖는다. f의 식이 하나로 정해지는 과정을 설명하고 그래프의 방향과 폭을 y=x²과 비교하세요.

**정답**

f(-2)=f(4)인 같은 함수값의 두 x좌표 중점이 1이므로 축 x=1이다. f=a(x-1)²+q로 두면 9a+q=15, 4a+q=5이고 a=2,q=-3이다. 따라서 f(x)=2(x-1)²-3이며 a=2이므로 위로 열리고 y=x²보다 좁다.

**전체 풀이**

1. 같은 함수값 쌍에서 축 x=1을 찾는다.
2. f=a(x-1)²+q로 표현한다.
3. 두 거리 조건으로 9a+q=15, 4a+q=5를 세운다.
4. a=2,q=-3을 구한다.
5. 세 점, 최솟값, 방향과 폭을 모두 검증하고 유일성을 설명한다.

**필수 사고 단계/채점 근거**

- 주장: 축은 x=1 / 중점이 1 (2점)
- 주장: f=a(x-1)²+q / f=a(x-1)^2+q (2점)
- 관계: f(-2)=f(4) / 같은 함수값 → 축 x=1 / 중점 1 (2점)
- 관계: a=2 → 위로 / y=x²보다 좁 (2점)
- 계산: 9a+q=15 / 4a+q=5 (2점)
- 계산: a=2 / q=-3 (2점)
- 결론: f(x)=2(x-1)²-3 / y=2(x-1)^2-3 (2점)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=paired-values-vertex-form; 전략=대칭쌍으로 축을 먼저 고정하고 서로 다른 거리의 값으로 모양을 유일화; 조건 변환=같은 값→축→두 거리식→계수·폭; 그래프/상황=paired-levels-shifted-parabola; 목표=uniqueness-and-shape-proof

### 13. m3-qf-learning-3-a3-1-equal-values-and-sum

- conceptId: `m3_quadratic_vertex_axis`
- stage: A3
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: f(x)=x²+bx+c에서 f(-1)=f(5)이고 f(0)+f(4)=10이다. f의 식과 꼭짓점을 구하세요.

**정답**

f(x)=x^2-4x+5,꼭짓점(2,1)

**전체 풀이**

1. f(-1)=f(5)에서 -1과 5의 중점 2가 축임을 찾는다.
2. 계수가 1인 일반식의 축 -b/2=2에서 b=-4를 구한다.
3. 축 대칭으로 f(0)=f(4)이므로 각 값이 5이고 c=5이다.
4. f(x)=(x-2)²+1로 바꾸어 꼭짓점 (2,1)을 검산한다.

**필수 사고 단계/채점 근거**

- f(-1)=f(5)에서 -1과 5의 중점 2가 축임을 찾는다.
- 계수가 1인 일반식의 축 -b/2=2에서 b=-4를 구한다.
- 축 대칭으로 f(0)=f(4)이므로 각 값이 5이고 c=5이다.
- f(x)=(x-2)²+1로 바꾸어 꼭짓점 (2,1)을 검산한다.

- 난이도 기준 대응: 조건 3개를 연결하고, 4단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=4; linkedConditions=3; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=equal-values-plus-sum; 전략=같은 함수값으로 축을 찾고 대칭쌍의 합을 개별 값으로 환원; 조건 변환=같은 값→축→b, 대칭합→c; 그래프/상황=monic-general-parabola; 목표=formula-and-vertex

### 14. m3-qf-learning-3-a4-1-two-paired-levels

- conceptId: `m3_quadratic_vertex_axis`
- stage: A4
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 이차함수 f가 f(-1)=f(5)=11, f(0)=f(4)=3을 만족한다. f의 꼭짓점과 f(3)을 구하세요.

**정답**

꼭짓점(2,-17/5),f(3)=-9/5

**전체 풀이**

1. 두 대칭쌍의 공통 중점에서 축 x=2를 찾는다.
2. f(x)=a(x-2)²+q로 둔다.
3. 거리 3과 2인 값에서 9a+q=11, 4a+q=3을 세운다.
4. a=8/5,q=-17/5를 구해 꼭짓점을 정한다.
5. f(3)=a+q=-9/5를 계산하고 네 자료로 검산한다.

**필수 사고 단계/채점 근거**

- 두 대칭쌍의 공통 중점에서 축 x=2를 찾는다.
- f(x)=a(x-2)²+q로 둔다.
- 거리 3과 2인 값에서 9a+q=11, 4a+q=3을 세운다.
- a=8/5,q=-17/5를 구해 꼭짓점을 정한다.
- f(3)=a+q=-9/5를 계산하고 네 자료로 검산한다.

- 난이도 기준 대응: 복합 조건 5개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=two-paired-heights; 전략=서로 다른 두 대칭쌍의 거리 차로 a와 꼭짓점 높이를 분리; 조건 변환=두 쌍→공통 축→거리 제곱 연립; 그래프/상황=four-point-symmetric-table; 목표=vertex-and-new-value

### 15. m3-qf-learning-3-a4-2-vertex-on-relation

- conceptId: `m3_quadratic_vertex_axis`
- stage: A4
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: 이차함수 y=a(x-p)²+q의 꼭짓점 (p,q)는 q=2p-3을 만족한다. 그래프가 점 (-1,12), (5,12)를 지날 때 p,q,a를 구하세요.

**정답**

p=2,q=1,a=11/9

**전체 풀이**

1. 같은 높이의 두 점에서 축의 x좌표 p=2를 찾는다.
2. 꼭짓점 관계 q=2p-3에 대입해 q=1을 구한다.
3. 점 (-1,12)를 대입해 12=9a+1을 세운다.
4. a=11/9를 구해 식을 완성한다.
5. 점 (5,12), 꼭짓점 관계, 열린 방향을 모두 검증한다.

**필수 사고 단계/채점 근거**

- 같은 높이의 두 점에서 축의 x좌표 p=2를 찾는다.
- 꼭짓점 관계 q=2p-3에 대입해 q=1을 구한다.
- 점 (-1,12)를 대입해 12=9a+1을 세운다.
- a=11/9를 구해 식을 완성한다.
- 점 (5,12), 꼭짓점 관계, 열린 방향을 모두 검증한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=vertex-coordinate-relation; 전략=대칭점으로 p를 고정한 뒤 꼭짓점 좌표 관계와 한 점을 연쇄 사용; 조건 변환=같은 높이→p→q 관계→a; 그래프/상황=vertex-constrained-parabola; 목표=three-parameters

### 16. m3-qf-learning-3-a5-1-sum-of-symmetric-values

- conceptId: `m3_quadratic_vertex_axis`
- stage: A5
- 답안 형식: 객관식 (`MULTIPLE_CHOICE`)
- 문제: 위로 열린 이차함수 f는 f(-1)=f(5)=10이고 f(0)+f(4)=8이다. f의 꼭짓점은?

**정답**

(2,-4/5)

**전체 풀이**

1. 첫 같은 함수값 쌍에서 축 x=2를 찾는다.
2. 축 대칭으로 f(0)=f(4)이므로 두 값이 각각 4임을 찾는다.
3. f(x)=a(x-2)²+q로 두고 9a+q=10, 4a+q=4를 세운다.
4. a=6/5,q=-4/5를 구한다.
5. 위로 열린 조건과 세 함수값 조건을 검증해 꼭짓점 (2,-4/5)를 고른다.

**필수 사고 단계/채점 근거**

- 첫 같은 함수값 쌍에서 축 x=2를 찾는다.
- 축 대칭으로 f(0)=f(4)이므로 두 값이 각각 4임을 찾는다.
- f(x)=a(x-2)²+q로 두고 9a+q=10, 4a+q=4를 세운다.
- a=6/5,q=-4/5를 구한다.
- 위로 열린 조건과 세 함수값 조건을 검증해 꼭짓점 (2,-4/5)를 고른다.

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=symmetric-pair-plus-sum; 전략=대칭을 이용해 합 조건을 개별 높이로 바꾼 뒤 거리별 연립; 조건 변환=같은 값→축→합의 반분→a,q; 그래프/상황=mixed-symmetric-data; 목표=vertex-choice

### 17. m3-qf-learning-3-a5-2-vertex-error-correction

- conceptId: `m3_quadratic_vertex_axis`
- stage: A5
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: 표에 f(-2)=14, f(0)=2, f(2)=-2, f(4)=2, f(6)=14가 주어졌다. 학생이 f(0)=f(4)이므로 꼭짓점이 (2,2)라고 했다. 오류를 고치고 함수식을 구하는 과정을 배열하세요.

**정답**

1. f(0)=f(4)와 f(-2)=f(6)의 공통 중점에서 축 x=2를 확인한다
2. 같은 함수값은 축만 정할 뿐 꼭짓점의 y좌표를 바로 주지 않음을 지적한다
3. 표에 x=2의 값 -2가 있으므로 꼭짓점 후보 (2,-2)를 세운다
4. f(x)=a(x-2)²-2에 (0,2)를 대입해 a=1을 구한다
5. f(x)=(x-2)²-2가 다섯 값을 모두 만족하는지 검증한다

**전체 풀이**

1. 두 대칭쌍으로 축을 확정한다.
2. 학생의 논리 오류를 정확히 분리한다.
3. 축 위 실제 함수값으로 꼭짓점을 정한다.
4. 한 점으로 계수를 계산한다.
5. 전체 표로 식과 결론을 검증한다.

**필수 사고 단계/채점 근거**

- 두 대칭쌍의 공통 중점 (2점, 근거: 축 x=2 / 공통 중점 2)
- 같은 값은 축만 결정함을 설명 (2점, 근거: 꼭짓점 y좌표는 정해지지 않는다 / 축만 정한다)
- 축 위 값으로 꼭짓점 결정 (2점, 근거: 꼭짓점 (2,-2))
- 계수 계산 (2점, 근거: 2=4a-2 / a=1)
- 다섯 점 전체 검증 (2점, 근거: f(x)=(x-2)²-2 / 다섯 값을 만족)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=multi-pair-error-correction; 전략=대칭이 주는 정보와 주지 않는 정보를 분리한 뒤 축 위 자료로 꼭짓점 복원; 조건 변환=두 대칭쌍→축→오류 분석→꼭짓점→계수; 그래프/상황=five-value-symmetric-table; 목표=scored-error-analysis

### 18. m3-qf-learning-3-a5-3-parameterized-vertex-family

- conceptId: `m3_quadratic_vertex_axis`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: 이차함수 f(x)=a(x-p)²+q가 (p-2,9), (p+2,9), (p,1)을 지난다. 먼저 p가 이 세 조건만으로 정해지지 않는 이유를 설명하라. 추가로 f(0)=3이고 꼭짓점이 y축 오른쪽에 있을 때 p,a,q를 구하세요.

**정답**

점 (p,1)이 꼭짓점이므로 q=1이고 9=4a+1에서 a=2이다. 세 점이 p를 기준으로 함께 평행이동할 수 있기 때문에 p는 처음 세 조건만으로 정해지지 않는다. f(0)=2p²+1=3에서 p=±1이고, 꼭짓점이 y축 오른쪽이므로 p>0인 p=1을 택한다. 따라서 p=1, a=2, q=1이다.

**전체 풀이**

1. 점 (p,1)에서 q=1을 찾는다.
2. 거리 2인 점에서 9=4a+1로 a=2를 구한다.
3. 세 점이 p와 함께 평행이동하므로 처음 조건만으로 p가 자유임을 설명한다.
4. f(0)=3을 2p²+1=3으로 바꾸어 p=±1을 구한다.
5. 꼭짓점이 y축 오른쪽이라는 조건으로 p=1을 선택하고 모든 점을 검증한다.

**필수 사고 단계/채점 근거**

- 주장: q=1 / a=2 (2점)
- 주장: p는 처음 세 조건만으로 정해지지 않는다 / p는 자유 (2점)
- 관계: 세 점 / 그래프 → 함께 평행이동 / 절대 위치가 없다 (2점)
- 관계: p=±1 / p=1 또는 -1 → y축 오른쪽 / p>0 (2점)
- 계산: 9=4a+1 / a=2 (2점)
- 계산: 2p²+1=3 / p=±1 (2점)
- 결론: p=1,a=2,q=1 / p=1, a=2, q=1 (2점)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=translated-parameter-family-with-side-condition; 전략=자유 매개변수를 먼저 식별하고 추가 함수값에서 나온 두 경우를 위치 조건으로 걸러냄; 조건 변환=상대좌표→a,q→자유도→p² 방정식→부호 선택; 그래프/상황=movable-vertex-family; 목표=underdetermination-and-case-proof

### 19. m3-qf-learning-4-a3-1-mapped-point-and-extra-point

- conceptId: `m3_quadratic_translation`
- stage: A3
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: G:y=ax²의 점 P(-1,a)를 평행이동한 점이 H 위의 Q(2,4)이다. 같은 평행이동으로 얻은 H가 점 R(5,13)을 지날 때 a와 H의 식을 구하세요.

**정답**

a=3,H:y=3(x-3)^2+1

**전체 풀이**

1. P에서 Q로의 이동 벡터를 (3,4-a)로 나타낸다.
2. G의 꼭짓점 (0,0)이 H의 꼭짓점 (3,4-a)로 이동하므로 H:y=a(x-3)²+4-a로 둔다.
3. R(5,13)을 대입해 13=4a+4-a를 세운다.
4. a=3을 구해 H:y=3(x-3)²+1을 완성하고 P→Q를 검산한다.

**필수 사고 단계/채점 근거**

- P에서 Q로의 이동 벡터를 (3,4-a)로 나타낸다.
- G의 꼭짓점 (0,0)이 H의 꼭짓점 (3,4-a)로 이동하므로 H:y=a(x-3)²+4-a로 둔다.
- R(5,13)을 대입해 13=4a+4-a를 세운다.
- a=3을 구해 H:y=3(x-3)²+1을 완성하고 P→Q를 검산한다.

- 난이도 기준 대응: 조건 4개를 연결하고, 4단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=4; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=mapped-point-with-unknown-height-shift; 전략=대응점의 이동 벡터를 a로 표현해 꼭짓점형에 넣고 추가 점으로 a 결정; 조건 변환=대응점→매개 이동 벡터→H 식→추가 점; 그래프/상황=translated-origin-parabola; 목표=coefficient-and-translated-formula

### 20. m3-qf-learning-4-a4-1-unlabeled-corresponding-points

- conceptId: `m3_quadratic_translation`
- stage: A4
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: G:y=2x²의 두 점 P(1,2), Q(2,8)가 평행이동 후 H의 두 점 A(4,-1), B(5,5)가 되었다. P,Q와 A,B의 대응을 결정하고 이동 벡터와 H의 식을 구하세요.

**정답**

P→A,Q→B,벡터(3,-3),H:y=2(x-3)^2-3

**전체 풀이**

1. 평행이동은 두 점 사이의 벡터를 보존하므로 Q-P=(1,6)을 계산한다.
2. B-A=(1,6)이 같고 A-B는 다르므로 P→A, Q→B임을 정한다.
3. A-P=(3,-3)에서 이동 벡터를 구한다.
4. 원래 꼭짓점에 벡터를 적용해 H:y=2(x-3)²-3을 세운다.
5. A와 B를 모두 H에 대입해 대응과 식을 검증한다.

**필수 사고 단계/채점 근거**

- 평행이동은 두 점 사이의 벡터를 보존하므로 Q-P=(1,6)을 계산한다.
- B-A=(1,6)이 같고 A-B는 다르므로 P→A, Q→B임을 정한다.
- A-P=(3,-3)에서 이동 벡터를 구한다.
- 원래 꼭짓점에 벡터를 적용해 H:y=2(x-3)²-3을 세운다.
- A와 B를 모두 H에 대입해 대응과 식을 검증한다.

- 난이도 기준 대응: 복합 조건 5개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=unlabeled-point-correspondence; 전략=점 사이 상대 벡터 보존으로 대응을 먼저 판별한 뒤 이동 벡터 계산; 조건 변환=두 점쌍→상대벡터 비교→대응→이동; 그래프/상황=translated-point-pairs; 목표=correspondence-vector-formula

### 21. m3-qf-learning-4-a4-2-parameter-vector-recovery

- conceptId: `m3_quadratic_translation`
- stage: A4
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: G:y=ax²을 (u,v)만큼 평행이동해 H를 만들었다. G의 점 (1,a)는 H의 점 (4,5)로 옮겨졌고 H의 꼭짓점 (u,v)는 u+v=1을 만족한다. H가 점 (5,26)을 지날 때 a,u,v를 구하세요.

**정답**

a=7,u=3,v=-2

**전체 풀이**

1. 대응점의 x좌표에서 u=4-1=3을 구한다.
2. u+v=1에서 v=-2를 구한다.
3. 대응점의 y이동 5-a=v에 대입해 a=7을 구한다.
4. H:y=7(x-3)²-2를 세운다.
5. H(5)=26과 대응점 조건을 모두 검증한다.

**필수 사고 단계/채점 근거**

- 대응점의 x좌표에서 u=4-1=3을 구한다.
- u+v=1에서 v=-2를 구한다.
- 대응점의 y이동 5-a=v에 대입해 a=7을 구한다.
- H:y=7(x-3)²-2를 세운다.
- H(5)=26과 대응점 조건을 모두 검증한다.

- 난이도 기준 대응: 복합 조건 5개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=parameterized-translation-vector; 전략=대응점의 두 좌표와 꼭짓점 좌표 관계를 연쇄해 a,u,v 복원; 조건 변환=x이동→u→꼭짓점 관계→v→y이동→a; 그래프/상황=unknown-vector-family; 목표=three-parameter-recovery

### 22. m3-qf-learning-4-a5-1-unknown-correspondence-vector

- conceptId: `m3_quadratic_translation`
- stage: A5
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: G:y=ax²(a>0)의 점 P(-1,a), Q(2,4a)가 평행이동되어 H 위의 두 점 A(2,1), B(5,13)가 되었다. 어느 점끼리 대응하는지 밝히고 a, 이동 벡터, H의 식을 구하세요.

**정답**

P→A,Q→B,a=4,벡터(3,-3),H:y=4(x-3)^2-3

**전체 풀이**

1. Q-P=(3,3a)이고 B-A=(3,12)임을 비교해 P→A, Q→B만 가능함을 찾는다.
2. 3a=12에서 a=4를 구한다.
3. A-P=(3,1-a)=(3,-3)으로 이동 벡터를 구한다.
4. 꼭짓점 이동과 계수 보존으로 H:y=4(x-3)²-3을 세운다.
5. A,B 두 점과 a>0 조건을 모두 검증한다.

**필수 사고 단계/채점 근거**

- Q-P=(3,3a)이고 B-A=(3,12)임을 비교해 P→A, Q→B만 가능함을 찾는다.
- 3a=12에서 a=4를 구한다.
- A-P=(3,1-a)=(3,-3)으로 이동 벡터를 구한다.
- 꼭짓점 이동과 계수 보존으로 H:y=4(x-3)²-3을 세운다.
- A,B 두 점과 a>0 조건을 모두 검증한다.

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=parameterized-unlabeled-correspondence; 전략=상대 벡터의 두 성분을 비교해 대응과 계수를 동시에 결정; 조건 변환=점쌍 상대벡터→대응→a→이동벡터→식; 그래프/상황=unknown-correspondence-translation; 목표=full-translation-reconstruction

### 23. m3-qf-learning-4-a5-2-two-route-consistency

- conceptId: `m3_quadratic_translation`
- stage: A5
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: H:y=x²-4x+1을 y=x²의 평행이동으로 해석한다. 완전제곱 경로와 대칭 자료 경로를 각각 사용해 같은 이동 벡터를 얻고, 학생의 주장 '왼쪽 2, 아래 3'을 반박하는 과정을 배열하세요.

**정답**

1. 완전제곱해 H:y=(x-2)²-3에서 벡터 (2,-3)을 얻는다
2. H(0)=H(4)=1에서 축 x=2를 찾는다
3. H(2)=-3을 계산해 대칭 자료 경로에서도 꼭짓점 (2,-3)을 얻는다
4. 원점이 (2,-3)으로 이동하므로 오른쪽 2, 아래 3임을 확인한다
5. 원래 점 (1,1)의 이동점 (3,-2)가 H 위에 있음을 검산해 학생 주장을 반박한다

**전체 풀이**

1. 대수 경로로 이동 벡터를 구한다.
2. 함수값 대칭 경로로 축을 구한다.
3. 축 위 함수값으로 같은 꼭짓점을 복원한다.
4. 두 경로의 결론을 비교한다.
5. 대응점 검산으로 잘못된 방향을 반박한다.

**필수 사고 단계/채점 근거**

- 완전제곱 경로 (2점, 근거: (x-2)²-3 / 벡터 (2,-3))
- 같은 함수값으로 축 계산 (2점, 근거: H(0)=H(4) / 축 x=2)
- 축 위 값으로 꼭짓점 계산 (2점, 근거: H(2)=-3 / 꼭짓점 (2,-3))
- 두 경로 일치와 방향 판정 (2점, 근거: 오른쪽 2, 아래 3)
- 대응점으로 학생 주장 반박 (2점, 근거: (3,-2) / H(3)=-2)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=dual-route-translation-proof; 전략=완전제곱과 대칭 함수값이라는 독립 경로를 교차 검증; 조건 변환=일반식→꼭짓점형 / 함수값쌍→축→꼭짓점; 그래프/상황=two-proof-paths-one-translation; 목표=scored-route-comparison

### 24. m3-qf-learning-4-a5-3-uniqueness-and-consistency

- conceptId: `m3_quadratic_translation`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: G:y=2x²을 평행이동한 H가 A(1,3), B(3,3)을 지나고 H(0)=9를 만족한다고 한다. A,B만으로 H가 유일하게 정해지는 이유를 설명하고 H의 식을 구한 뒤 H(0)=9 조건의 일관성을 검증하세요.

**정답**

A와 B는 같은 높이이므로 두 x좌표의 중점이 2이다. 따라서 축은 x=2, 즉 축 x=2이다. 평행이동에서는 계수 2가 유지되어 H=2(x-2)²+q이고, 3=2(1-2)²+q에서 q=1이다. 축, 계수, q가 모두 정해져 H:y=2(x-2)²+1로 유일하다. H(0)=2(0-2)²+1=9이므로 추가 조건도 일치한다.

**전체 풀이**

1. 같은 높이 A,B의 중점에서 축 x=2를 찾는다.
2. 평행이동으로 계수 2가 유지됨을 사용한다.
3. H=2(x-2)²+q에 A를 대입해 q=1을 구한다.
4. 축과 계수가 고정된 뒤 q도 하나여서 유일함을 설명한다.
5. B와 H(0)=9를 각각 대입해 모든 조건의 일관성을 검증한다.

**필수 사고 단계/채점 근거**

- 주장: 축은 x=2 / A와 B의 중점은 2 (2점)
- 주장: 계수 2가 유지 / 평행이동이므로 a=2 (2점)
- 관계: 같은 높이 / y좌표가 같다 → 축 x=2 (2점)
- 관계: 축 / 계수 / q → 하나 / 유일 (2점)
- 계산: 3=2(1-2)²+q / q=1 (2점)
- 계산: H(0)=9 / 2(0-2)²+1=9 (2점)
- 결론: H:y=2(x-2)²+1 / H=2(x-2)^2+1 (2점)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=translation-uniqueness-consistency; 전략=평행이동 불변량과 대칭점을 결합해 자유도를 하나씩 제거하고 추가 조건 검증; 조건 변환=같은 높이→축, 불변 계수→q→독립 조건; 그래프/상황=translated-parabola-with-redundant-check; 목표=uniqueness-and-consistency-proof

### 25. m3-qf-learning-5-a3-1-axis-and-two-values

- conceptId: `m3_quadratic_find_formula`
- stage: A3
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 축이 x=-1이고 f(0)=2, f(2)=18인 이차함수의 식을 구하고 꼭짓점의 y좌표를 쓰세요.

**정답**

f(x)=2(x+1)^2,꼭짓점y=0

**전체 풀이**

1. 축 조건으로 f(x)=a(x+1)²+q로 둔다.
2. f(0)=2, f(2)=18에서 a+q=2, 9a+q=18을 세운다.
3. 두 식을 풀어 a=2,q=0을 구한다.
4. 두 함수값을 다시 대입해 식과 꼭짓점 높이를 검증한다.

**필수 사고 단계/채점 근거**

- 축 조건으로 f(x)=a(x+1)²+q로 둔다.
- f(0)=2, f(2)=18에서 a+q=2, 9a+q=18을 세운다.
- 두 식을 풀어 a=2,q=0을 구한다.
- 두 함수값을 다시 대입해 식과 꼭짓점 높이를 검증한다.

- 난이도 기준 대응: 조건 3개를 연결하고, 4단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=4; linkedConditions=3; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=axis-plus-two-values; 전략=축을 꼭짓점형에 고정하고 거리 다른 두 함수값을 연립; 조건 변환=축→꼭짓점형→두 값 연립; 그래프/상황=axis-known-two-point-parabola; 목표=formula-and-vertex-height

### 26. m3-qf-learning-5-a4-1-vertex-root-mixed

- conceptId: `m3_quadratic_find_formula`
- stage: A4
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 이차함수 f의 축은 x=1이고 f(-1)=8, f(0)=2이다. f의 식을 구한 뒤 x축과 만나는 점을 모두 구하세요.

**정답**

f(x)=2(x-1)^2,교점(1,0)

**전체 풀이**

1. 축 조건으로 f(x)=a(x-1)²+q로 둔다.
2. f(-1)=8, f(0)=2에서 4a+q=8, a+q=2를 세운다.
3. a=2,q=0을 구해 f(x)=2(x-1)²을 얻는다.
4. f(x)=0을 풀어 x=1 하나를 구한다.
5. 꼭짓점이 x축 위이고 두 함수값을 만족하는지 검증한다.

**필수 사고 단계/채점 근거**

- 축 조건으로 f(x)=a(x-1)²+q로 둔다.
- f(-1)=8, f(0)=2에서 4a+q=8, a+q=2를 세운다.
- a=2,q=0을 구해 f(x)=2(x-1)²을 얻는다.
- f(x)=0을 풀어 x=1 하나를 구한다.
- 꼭짓점이 x축 위이고 두 함수값을 만족하는지 검증한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=axis-values-then-root; 전략=축에 맞는 표현으로 식을 복원한 뒤 완전제곱 구조에서 x절편을 해석; 조건 변환=축→두 값 연립→식→x축 조건; 그래프/상황=vertex-on-x-axis; 목표=formula-and-axis-intersection

### 27. m3-qf-learning-5-a4-2-mixed-condition-process

- conceptId: `m3_quadratic_find_formula`
- stage: A4
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: 이차함수 f는 f(-1)=f(5)=0이고 f(1)=-12이며 아래로 열리지 않는다. f의 식과 최솟값을 구하는 과정을 배열하세요.

**정답**

1. 두 영점으로 f(x)=a(x+1)(x-5)로 둔다
2. f(1)=-12를 대입해 -8a=-12를 세운다
3. a=3/2를 구하고 위로 열리는 조건과 일치함을 확인한다
4. 두 영점의 중점 x=2에서 최솟값을 구한다
5. f(2)=-27/2를 계산하고 세 조건을 검증한다

**전체 풀이**

1. 영점에 적합한 인수형을 선택한다.
2. 추가 점으로 계수 방정식을 세운다.
3. 계수와 열린 방향을 검증한다.
4. 대칭축 위치를 구한다.
5. 최솟값과 원조건을 최종 검산한다.

**필수 사고 단계/채점 근거**

- 두 영점으로 인수형 설정 (2점, 근거: a(x+1)(x-5))
- 추가 점 대입 (2점, 근거: -8a=-12)
- 계수와 방향 (2점, 근거: a=3/2 / 위로 열린다)
- 영점 중점으로 축 계산 (2점, 근거: 축 x=2 / (-1+5)/2=2)
- 최솟값 계산과 검산 (2점, 근거: -27/2 / f(2)=-27/2)

- 난이도 기준 대응: 복합 조건 5개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=root-form-point-extreme; 전략=두 영점으로 인수형을 선택한 뒤 계수·축·극값을 서로 다른 조건으로 검증; 조건 변환=영점→인수형→점→a→축→최솟값; 그래프/상황=two-root-upward-parabola; 목표=scored-formula-extreme-process

### 28. m3-qf-learning-5-a5-1-symmetric-sum-reconstruction

- conceptId: `m3_quadratic_find_formula`
- stage: A5
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 이차함수 f는 f(0)+f(6)=20, f(1)=f(5)=2를 만족하고 축의 x좌표는 정수이며 1<x<5이다. f의 식과 최솟값을 구하세요.

**정답**

f(x)=8/5(x-3)^2-22/5,최솟값-22/5

**전체 풀이**

1. f(1)=f(5)에서 축이 두 x좌표의 중점 x=3임을 찾고 정수 범위 조건과 확인한다.
2. 축 대칭으로 f(0)=f(6)이므로 합 20에서 두 값이 각각 10임을 찾는다.
3. f(x)=a(x-3)²+q로 두고 4a+q=2, 9a+q=10을 세운다.
4. a=8/5,q=-22/5를 구한다.
5. a>0이므로 최솟값이 q임을 확인하고 네 함수값을 검산한다.

**필수 사고 단계/채점 근거**

- f(1)=f(5)에서 축이 두 x좌표의 중점 x=3임을 찾고 정수 범위 조건과 확인한다.
- 축 대칭으로 f(0)=f(6)이므로 합 20에서 두 값이 각각 10임을 찾는다.
- f(x)=a(x-3)²+q로 두고 4a+q=2, 9a+q=10을 세운다.
- a=8/5,q=-22/5를 구한다.
- a>0이므로 최솟값이 q임을 확인하고 네 함수값을 검산한다.

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=sum-and-equal-value-reconstruction; 전략=같은 값으로 축을 찾은 뒤 대칭을 이용해 합 조건을 개별 조건으로 분해; 조건 변환=같은 값→축→대칭합 반분→거리별 연립→극값; 그래프/상황=mixed-sum-symmetry-data; 목표=formula-and-minimum

### 29. m3-qf-learning-5-a5-2-multi-representation-verification

- conceptId: `m3_quadratic_find_formula`
- stage: A5
- 답안 형식: 과정형 (`STEP_ORDER`)
- 문제: f(1)=f(5)=0, f(2)=f(4)=-6인 이차함수 f의 식과 최솟값을 인수형과 꼭짓점형 두 표현으로 교차 검증하는 과정을 배열하세요.

**정답**

1. 두 영점에서 f(x)=a(x-1)(x-5)로 둔다
2. f(2)=-6을 대입해 -3a=-6에서 a=2를 구한다
3. f(x)=2(x-1)(x-5)를 완성한다
4. 영점의 중점 3을 축으로 잡아 f(3)=-8을 계산하고 f(x)=2(x-3)²-8로 바꾼다
5. f(4)=-6과 두 표현의 전개 결과가 같은지 검증한다

**전체 풀이**

1. 영점 조건에 맞는 표현을 선택한다.
2. 다른 높이의 점으로 계수를 구한다.
3. 인수형을 완성한다.
4. 축과 극값을 이용해 꼭짓점형으로 변환한다.
5. 남은 점과 두 표현의 동치성을 검증한다.

**필수 사고 단계/채점 근거**

- 영점으로 인수형 설정 (2점, 근거: a(x-1)(x-5))
- 추가 높이로 a 계산 (2점, 근거: -3a=-6 / a=2)
- 인수형 완성 (1점, 근거: 2(x-1)(x-5))
- 축·최솟값과 꼭짓점형 (3점, 근거: 축 x=3 / f(3)=-8 / 2(x-3)²-8)
- 남은 점과 표현 동치 검증 (2점, 근거: f(4)=-6 / 두 식이 같다)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=root-form-to-vertex-form; 전략=인수형으로 계수를 정한 뒤 대칭축을 통해 꼭짓점형을 독립 구성해 교차 검증; 조건 변환=영점→인수형→a→축·극값→꼭짓점형; 그래프/상황=two-roots-two-levels; 목표=scored-dual-representation-process

### 30. m3-qf-learning-5-a5-3-minimal-data-strategy

- conceptId: `m3_quadratic_find_formula`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: 표에서 f(-1)=9, f(1)=1, f(3)=1, f(5)=9이고, 이 중 어느 값도 중복 측정이 아니다. 최소 계산으로 f(x)를 구하는 전략, 식의 유일성, 사용하지 않은 자료의 검산 역할을 설명하세요.

**정답**

같은 함수값 쌍의 공통 중점이 2이므로 축은 x=2이다. 축에서 거리 1과 3인 점 하나씩, 즉 대표점 (1,1)과 (-1,9) 두 개만 골라 f=a(x-2)²+q에 대입하면 a+q=1, 9a+q=9이다. 이를 풀어 a=1,q=0을 얻으므로 축과 서로 다른 두 거리 조건으로 식이 유일하게 정해진다. 따라서 f(x)=(x-2)²이다. 사용하지 않은 점 (3,1),(5,9)은 남은 자료로서 대칭과 식을 독립 검산하는 역할을 한다.

**전체 풀이**

1. 두 같은 값 쌍의 공통 중점에서 축 x=2를 찾는다.
2. 거리가 1과 3인 대표점 하나씩만 선택한다.
3. a+q=1, 9a+q=9를 세워 a=1,q=0을 구한다.
4. 축과 두 독립 거리 조건이 a,q를 하나로 정하므로 유일함을 설명한다.
5. 사용하지 않은 짝점들을 대입해 대칭과 식을 독립 검산한다.

**필수 사고 단계/채점 근거**

- 주장: 축은 x=2 / 공통 중점 2 (2점)
- 주장: 거리 1과 3인 점 하나씩 / 대표점 두 개만 (2점)
- 관계: 축 / 두 거리 조건 / a,q → 유일 / 하나로 정 (2점)
- 관계: 사용하지 않은 점 / 남은 자료 → 검산 / 대칭 확인 (2점)
- 계산: a+q=1 / 9a+q=9 (2점)
- 계산: a=1 / q=0 (2점)
- 결론: f(x)=(x-2)² / f(x)=(x-2)^2 (2점)

- 난이도 기준 대응: 서로 연결된 개념 2개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=minimal-symmetric-data-strategy; 전략=중복 대칭 자료에서 독립 정보만 선별하고 나머지를 검산용으로 분리; 조건 변환=두 대칭쌍→축→독립 거리 선택→유일성→잔여 검산; 그래프/상황=redundant-symmetric-table; 목표=strategy-uniqueness-verification-proof

### 31. m3-qf-learning-6-a3-1-parameter-from-equal-endpoint-maxima

- conceptId: `m3_quadratic_max_min`
- stage: A3
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: -2≤x≤4에서 f(x)=(x-k)²+2의 최솟값이 2이고 최댓값 11을 양 끝점에서 모두 갖는다. k와 최댓값·최솟값의 차를 구하세요.

**정답**

k=1,차=9

**전체 풀이**

1. 양 끝점의 함수값이 같으므로 (-2-k)²=(4-k)²을 세운다.
2. 두 끝점의 중점에서 k=1을 구한다.
3. k=1이 구간 안이므로 최솟값 2를 갖는지 확인한다.
4. 끝점 함수값 11과 최솟값 2의 차 9를 구한다.

**필수 사고 단계/채점 근거**

- 양 끝점의 함수값이 같으므로 (-2-k)²=(4-k)²을 세운다.
- 두 끝점의 중점에서 k=1을 구한다.
- k=1이 구간 안이므로 최솟값 2를 갖는지 확인한다.
- 끝점 함수값 11과 최솟값 2의 차 9를 구한다.

- 난이도 기준 대응: 조건 4개를 연결하고, 4단계로 식 설정·전략 선택·검증을 수행한다. 직접 공식 대입만으로 끝나지 않는다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, EQUATION_SETUP, STRATEGY_SELECTION; meaningfulSteps=4; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=equal-endpoint-extrema; 전략=두 끝점 최대가 같다는 조건을 축의 위치로 역추론; 조건 변환=끝점 극값→거리 등식→k→범위; 그래프/상황=moving-axis-on-closed-interval; 목표=parameter-and-range

### 32. m3-qf-learning-6-a4-1-rectangle-with-side-gap

- conceptId: `m3_quadratic_max_min`
- stage: A4
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 둘레가 20인 직사각형에서 긴 변은 짧은 변보다 적어도 2 길다. 가능한 직사각형의 넓이의 최댓값과 그때 두 변을 구하세요.

**정답**

최댓값24,변4와6

**전체 풀이**

1. 짧은 변을 x, 긴 변을 10-x로 두고 0<x≤5로 정한다.
2. 10-x≥x+2에서 x≤4를 얻어 정의역을 0<x≤4로 좁힌다.
3. 넓이 A=x(10-x)=-(x-5)²+25로 나타낸다.
4. 꼭짓점 x=5는 정의역 밖이고 0<x≤4에서 A가 증가하므로 끝점 x=4를 선택한다.
5. 두 변 4,6과 넓이 24가 둘레·차이 조건을 만족하는지 검증한다.

**필수 사고 단계/채점 근거**

- 짧은 변을 x, 긴 변을 10-x로 두고 0<x≤5로 정한다.
- 10-x≥x+2에서 x≤4를 얻어 정의역을 0<x≤4로 좁힌다.
- 넓이 A=x(10-x)=-(x-5)²+25로 나타낸다.
- 꼭짓점 x=5는 정의역 밖이고 0<x≤4에서 A가 증가하므로 끝점 x=4를 선택한다.
- 두 변 4,6과 넓이 24가 둘레·차이 조건을 만족하는지 검증한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=perimeter-area-with-gap; 전략=변 길이 차 조건으로 꼭짓점을 정의역 밖으로 밀어 경계 최적값 선택; 조건 변환=둘레→한 변수, 차이→제한, 넓이→꼭짓점형; 그래프/상황=truncated-area-parabola; 목표=constrained-maximum-dimensions

### 33. m3-qf-learning-6-a4-2-parameter-equal-endpoints

- conceptId: `m3_quadratic_max_min`
- stage: A4
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: -1≤x≤5에서 f_k(x)=(x-k)²+k의 최댓값이 양 끝점에서 같고 최솟값이 구간 안에서 생긴다. k와 최댓값, 최솟값을 구하세요.

**정답**

k=2,최댓값11,최솟값2

**전체 풀이**

1. 양 끝점의 함수값이 같다는 식 (-1-k)²+k=(5-k)²+k를 세운다.
2. 두 끝점의 중점에서 k=2를 구한다.
3. 축 x=2가 구간 안에 있어 최솟값 f(2)=2를 구한다.
4. 끝점 함수값 f(-1)=f(5)=11을 계산한다.
5. 구간과 두 극값 조건을 모두 검증한다.

**필수 사고 단계/채점 근거**

- 양 끝점의 함수값이 같다는 식 (-1-k)²+k=(5-k)²+k를 세운다.
- 두 끝점의 중점에서 k=2를 구한다.
- 축 x=2가 구간 안에 있어 최솟값 f(2)=2를 구한다.
- 끝점 함수값 f(-1)=f(5)=11을 계산한다.
- 구간과 두 극값 조건을 모두 검증한다.

- 난이도 기준 대응: 복합 조건 4개와 5단계 추론을 사용한다. 역추론·경우 분류·표현 연결 중 하나 이상이 핵심이며 마지막 조건 검증이 필요하다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, REPRESENTATION; meaningfulSteps=5; linkedConditions=4; linkedConcepts=2
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=parameterized-equal-endpoint-extrema; 전략=끝점 동률로 이동 축을 결정하고 내부 꼭짓점과 양끝 극값을 분리; 조건 변환=끝점 동률→k→내부 최소→끝점 최대; 그래프/상황=parameter-shifted-interval-parabola; 목표=parameter-max-min

### 34. m3-qf-learning-6-a5-1-integer-parameter-optimization

- conceptId: `m3_quadratic_max_min`
- stage: A5
- 답안 형식: 단답형 (`SHORT_ANSWER`)
- 문제: m은 자연수이고 정수 x가 0≤x≤2m+1일 때 y=-x²+(2m+1)x의 최댓값이 72이다. m과 최댓값을 만드는 모든 x를 구하세요.

**정답**

m=8,x=8,9

**전체 풀이**

1. 연속 범위에서 축이 x=m+1/2임을 찾는다.
2. x가 정수이므로 축에서 같은 거리인 x=m,m+1이 최대 후보임을 정한다.
3. 두 점의 함수값이 m(m+1)임을 계산한다.
4. m(m+1)=72를 풀어 자연수 m=8을 구한다.
5. 정의역과 이웃 정수값을 확인해 x=8,9만 최대임을 검증한다.

**필수 사고 단계/채점 근거**

- 연속 범위에서 축이 x=m+1/2임을 찾는다.
- x가 정수이므로 축에서 같은 거리인 x=m,m+1이 최대 후보임을 정한다.
- 두 점의 함수값이 m(m+1)임을 계산한다.
- m(m+1)=72를 풀어 자연수 m=8을 구한다.
- 정의역과 이웃 정수값을 확인해 x=8,9만 최대임을 검증한다.

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 5개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=5; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=reverse-integer-vertex-optimization; 전략=반정수 축의 두 정수 최대 후보를 일반식으로 만든 뒤 최대값에서 매개변수 역산; 조건 변환=연속 축→정수 후보쌍→최대식→m 방정식; 그래프/상황=integer-lattice-parameter-parabola; 목표=parameter-and-all-maximizers

### 35. m3-qf-learning-6-a5-2-modular-fence-optimization

- conceptId: `m3_quadratic_max_min`
- stage: A5
- 답안 형식: 수식 입력형 (`EXPRESSION_INPUT`)
- 문제: 길이 24m의 울타리로 벽을 한 변으로 하는 직사각형의 나머지 세 변을 두른다. 벽과 나란한 변에는 폭 2m의 출입구를 두어 그 부분에는 울타리를 쓰지 않는다. 두 변의 길이는 자연수이고 벽과 나란한 변은 4의 배수이다. 최대 넓이와 두 변을 구하세요.

**정답**

최대84m^2,수직7m,평행12m

**전체 풀이**

1. 벽에 수직인 변을 x, 평행한 변을 y로 두고 2x+(y-2)=24를 세운다.
2. y=26-2x, 넓이 A=x(26-2x)=-2(x-6.5)²+84.5로 나타낸다.
3. x,y가 자연수이고 y가 4의 배수이므로 x는 홀수임을 찾는다.
4. 축 6.5에 가까운 허용 홀수 x=5,7을 비교한다.
5. A(5)=80, A(7)=84이므로 x=7,y=12를 고르고 울타리 길이와 배수 조건을 검증한다.

**필수 사고 단계/채점 근거**

- 벽에 수직인 변을 x, 평행한 변을 y로 두고 2x+(y-2)=24를 세운다.
- y=26-2x, 넓이 A=x(26-2x)=-2(x-6.5)²+84.5로 나타낸다.
- x,y가 자연수이고 y가 4의 배수이므로 x는 홀수임을 찾는다.
- 축 6.5에 가까운 허용 홀수 x=5,7을 비교한다.
- A(5)=80, A(7)=84이므로 x=7,y=12를 고르고 울타리 길이와 배수 조건을 검증한다.

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 6개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=6; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=fence-with-gap-and-divisibility; 전략=연속 꼭짓점 근처 후보를 자연수·배수 조건으로 걸러 이산 최적화; 조건 변환=울타리→관계식→이차함수→합동 조건→후보 비교; 그래프/상황=discrete-constrained-area-parabola; 목표=integer-dimensions-and-maximum

### 36. m3-qf-learning-6-a5-3-piecewise-profit-model

- conceptId: `m3_quadratic_max_min`
- stage: A5
- 답안 형식: 서술형 (`WRITTEN_RESPONSE`)
- 문제: 공연 입장료가 10천 원일 때 100명이 온다. 가격을 1천 원씩 올릴 때, 5회 인상까지는 매회 5명씩 줄고 6회부터 10회까지는 5회 인상 때의 인원에서 추가 인상 1회마다 8명씩 줄어든다. 인상 횟수는 0부터 10까지의 정수이다. 수입을 최대로 하는 가격과 최대 수입을 두 구간으로 나누어 설명하세요.

**정답**

x는 0부터 10까지의 정수이다. 0≤x≤5에서는 R1=(10+x)(100-5x)=-5(x-5)²+1125이므로 첫 구간의 최대는 x=5에서 1125이다. 6≤x≤10에서는 인원이 75-8(x-5)=115-8x이고 R2=(10+x)(115-8x)이므로 둘째 구간의 최대는 x=6에서 1072이다. 1125가 1072보다 더 크므로 가격은 15천 원, 최대 수입은 1125천 원이다.

**전체 풀이**

1. 인상 횟수 x의 정수 정의역을 두 구간 0≤x≤5, 6≤x≤10으로 나눈다.
2. 첫 구간의 인원과 수입 R1=(10+x)(100-5x)를 세워 x=5에서 1125를 얻는다.
3. 둘째 구간의 인원 75-8(x-5)=115-8x와 수입 R2를 세운다.
4. R2의 축이 둘째 구간 왼쪽에 있어 이 구간에서는 x=6이 최대 후보임을 판단하고 1072를 계산한다.
5. 두 구간 최대를 비교해 가격 15천 원·수입 1125천 원을 결론내고 정수 이웃값을 검산한다.

**필수 사고 단계/채점 근거**

- 주장: x는 0부터 10까지의 정수 / x∈{0,1,…,10} / 두 구간 0≤x≤5, 6≤x≤10 (2점)
- 주장: 두 구간으로 나눈다 / R1 / R2 (2점)
- 관계: R1 / 첫 구간 → x=5 / 1125 (2점)
- 관계: R2 / 둘째 구간 → x=6 / 1072 (2점)
- 관계: 1125 / 1072 → 1125 / 15천 원 (2점)
- 계산: (10+x)(100-5x) / -5(x-5)²+1125 (2점)
- 계산: 75-8(x-5) / 115-8x / (10+x)(115-8x) (2점)
- 결론: 가격은 15천 원, 최대 수입은 1125천 원 / 15천원,1125천원 (2점)

- 난이도 기준 대응: 서로 연결된 개념 3개, 조건 7개, 5단계를 사용한다. 전략 선택과 설명·검증이 필수이고 구조 참신도는 HIGH이다.
- 해당 단계인 이유: reasoningGoals=CONDITION_READING, CONCEPT_SELECTION, MULTI_CONCEPT_LINK, STRATEGY_SELECTION, EXPLANATION, REPRESENTATION, EQUATION_SETUP, RESULT_VALIDATION; meaningfulSteps=5; linkedConditions=7; linkedConcepts=3
- 중3 범위 근거: 중3 이차함수의 식·그래프·축·꼭짓점·평행이동·최대·최소와 중학교 대수만 사용
- 기존 문항과 다른 핵심 구조: 첫 식=piecewise-integer-profit; 전략=변화율이 바뀌는 두 이차수입 모델을 별도 최적화한 뒤 전역 비교; 조건 변환=가격 정책→두 인원식→두 수입함수→구간별 최대→전역 최대; 그래프/상황=piecewise-discrete-downward-parabolas; 목표=written-global-optimization

## 4. 검수 결론

- A3 적정: 18/18
- A4 적정: 18/18
- A5 적정: 18/18
- 실제 과정형: 12/12
- 실제 서술형: 12/12
- 세 구조 판정: 36개 concept-stage 그룹 모두 DISTINCT
- 수학·범위·정답·보기·정의역·채점 rubric 검증: 통과

**중3 이차함수 문제 기준 완성**

