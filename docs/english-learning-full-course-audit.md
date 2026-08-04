# English learning full-course audit

Date: 2026-08-03

## Outcome

The authored quality route now contains 50 cycles and 600 base multiple-choice problems. Levels 1–5 each contain 10 cycles and 120 base problems. Supplemental spaced-review assignments are kept outside the 600 base count.

| Level | Cycles | Base problems | Target vocabulary | Grammar targets | Passages | Average passage words |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 10 | 120 | 40 | 11 | 10 | 28 |
| 2 | 10 | 120 | 40 | 13 | 10 | 37 |
| 3 | 10 | 120 | 40 | 17 | 10 | 49 |
| 4 | 10 | 120 | 40 | 13 | 10 | 73 |
| 5 | 10 | 120 | 40 | 7 composite targets | 10 original articles | 179 |

Level 5 provides 40 TOEFL-style reading tasks. Its final six articles contain 213–214 words and use an original headline, lead, evidence or quotation/data, response, and outlook structure.

## Review and remediation

- The review planner creates 920 supplemental assignments covering same-cycle late review, +1, +3, +7, and next-level review where a next level exists.
- `lunch`, `trip`, and `arrive` are included in the same review contract and transfer beyond their original reading contexts.
- All 600 base problems have two eligible different-family remediation candidates.
- A first error requests a different-family check. Repeated evidence across two families begins remediation. Two correct, different-family remediation results return to the saved cycle checkpoint.
- The failed problem ID is never inserted as its own remediation item.

## Quality validation

- Required-field omissions: 0
- Duplicate problem IDs: 0
- Duplicate structure signatures: 0
- Adjacent mechanical word duplication detected: 0
- English word plus Korean particle mixing detected: 0
- Punctuation-only distractors: 0
- Distractors: 1,800
- Distractors with misconception tags: 1,800
- Correct-answer distribution: 150 / 150 / 150 / 150
- Article passages: 10
- TOEFL-style items: 40

The validator checks structural and surface contracts. Mathematical-style proof of semantic uniqueness is not possible for natural language, so authored answers and distractor rationales remain the semantic source of truth.

## Runtime routing

`english-master-curriculum.js` loads the five authored levels before the preserved legacy curriculum. `subject-learning.js` uses the 50 authored cycles for the active quality roadmap and keeps the legacy banks available without using them as fallback where authored content exists.

Placement results are stored as pending recommendations. They are merged into the English learning start only when the student chooses “이어서 공부하기”. General English and English Elite retain separate state; Elite is an optional recommendation only after stable upper-level grammar, article reading, and inference evidence.

## Protection

No math, science, Hanja, reading, authentication, or Math Elite content was intentionally changed for this work. No external news article was copied; all level-5 articles are original authored passages.
