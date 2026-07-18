(function () {
  const curriculum = window.ENGLISH_MASTER_CURRICULUM;
  const levels = window.ENGLISH_MASTER_LEVELS;
  if (!curriculum || !levels || !window.STUDY_SUBJECT_CONTENT) return;

  const extractVocabularyWord = (problem) => {
    const directAnswer = String(problem.correctAnswer || "").trim();
    if (/^[A-Za-z][A-Za-z'-]+$/.test(directAnswer)) return directAnswer;
    const prompt = String(problem.prompt || "");
    const promptWord = prompt.match(/([A-Za-z][A-Za-z'-]*)(?:과 뜻|의 뜻)/)?.[1]
      || prompt.match(/([A-Za-z][A-Za-z'-]*)(?:을|를|은|는|이|가)\s/)?.[1]
      || "";
    const ignoredWords = new Set(["what", "where", "when", "who", "why", "how", "which"]);
    if (promptWord && !ignoredWords.has(promptWord.toLowerCase())) return promptWord;
    return (problem.acceptedAnswers || []).find((answer) => /^[A-Za-z][A-Za-z'-]+$/.test(String(answer))) || "";
  };

  const englishLearningView = (problem, stage) => {
    const prompt = String(problem.prompt || "");
    const word = extractVocabularyWord(problem);
    const stageType = String(stage?.stageType || "");
    const level = Number(String(problem.questionId || "").match(/^EN-L(\d{2})-/)?.[1] || 0);
    const viewSeed = [...String(problem.questionId || "")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    if (!/[가-힣]/.test(prompt) || !level || !["grammar", "practice", "reading"].includes(stageType)) return null;
    const originalEnglishChoices = (problem.choices || []).filter((choice) => /^[A-Za-z][A-Za-z'-]+$/.test(String(choice)));
    if (level >= 6 && level <= 10) {
      const answerPhrase = String(problem.correctAnswer || "").trim();
      const phraseChoices = (problem.choices || []).filter((choice) => /^[A-Za-z][A-Za-z' -]+$/.test(String(choice)));
      const blankSentence = prompt.match(/([A-Z][^가-힣“”]*_{2,}[^가-힣“”]*[.!?])/u)?.[1]?.trim();
      if (blankSentence && /^[A-Za-z][A-Za-z' -]+$/.test(answerPhrase) && phraseChoices.includes(answerPhrase)) {
        return { question: blankSentence, choices: phraseChoices, answer: answerPhrase };
      }
      const quotedSentence = prompt.match(/[“"]([^”"]+)[”"]/)?.[1]?.trim();
      if (stageType === "reading" && quotedSentence && /[가-힣]/.test(answerPhrase)) {
        const subject = quotedSentence.match(/^(.+?)\s+(?=(?:is|are|was|were|has|have|had|can|could|will|would|should|may|might|must)\b)/i)?.[1] || quotedSentence.split(/\s+/)[0];
        const predicate = quotedSentence.slice(subject.length).trim().replace(/[.!?]+$/, "");
        const subjectChoices = [...new Set((problem.choices || []).map((choice) => String(choice).match(/^([A-Za-z][A-Za-z' ]+?)(?=는|은|이|가)/)?.[1]?.trim()).filter(Boolean))];
        const choices = [...new Set([subject, ...subjectChoices, "He", "She", "We", "They"])].slice(0, 4);
        return { passage: quotedSentence, question: `Who ${predicate}?`, choices, answer: subject };
      }
      return null;
    }
    if (level >= 11 && stageType === "reading" && !problem.passage && !problem.readingPassage && problem.choices?.length) {
      const answer = String(problem.correctAnswer || "").trim();
      if (level <= 12) {
        const quotedWord = prompt.match(/[“"]([A-Za-z][A-Za-z'-]+)[”"]/)?.[1];
        const englishSentences = prompt.match(/(?:Each|The|A|An|Researchers|Students|People)\s+[A-Za-z][^가-힣]*[.!?]/g) || [];
        let coreSentence = englishSentences[0] || "";
        if (coreSentence && answer) coreSentence = coreSentence.replace(new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"), "____");
        if (!coreSentence.includes("____") && quotedWord) coreSentence = `The report explains how a new method can ____ the result.`;
        if (!coreSentence.includes("____")) coreSentence = `The sentence needs the word ____ to express its main idea.`;
        const levelElevenContexts = [
          "The writer compares the situation before and after the change.", "A later example shows how the result changes.",
          "The report checks the effect with new evidence.", "The final paragraph returns to the same key idea.",
          "A second case gives the reader more context.", "The author uses the verb to connect cause and result.",
        ];
        const levelTwelveContexts = [
          "The surrounding sentences help the reader check the grammar.", "The next sentence uses the same subject correctly.",
          "A second example confirms the number of the subject.", "The paragraph keeps the subject and verb consistent.",
          "The reader can compare the singular and plural forms.", "The final sentence follows the same grammar rule.",
        ];
        const contextSentence = (level === 11 ? levelElevenContexts : levelTwelveContexts)[viewSeed % 6];
        return { passage: `${coreSentence} ${contextSentence}`, question: "Which word completes the text?", choices: problem.choices, answer };
      }
      if (level === 19) {
        const advisorQuestion = /advisor/i.test(prompt);
        const topic = answer.match(/evidence about ([A-Za-z -]+?) must/i)?.[1] || "the main topic";
        const advisorDetails = ["The deadline is Friday.", "The corrected form needs one signature.", "The student brings the missing page the next morning.", "The advisor checks the online record.", "The temporary hold lasts two days.", "The office sends a confirmation email."];
        const lectureDetails = ["The professor compares two studies.", "One example comes from a recent survey.", "The class examines a limitation in the evidence.", "A student asks whether the result can be generalized.", "The speaker contrasts two possible explanations.", "The final example shows why context matters."];
        const passage = advisorQuestion
          ? `A student visits an advisor because a registration form is incomplete. The advisor keeps the registration active for a short time. The student must submit a corrected form. ${advisorDetails[viewSeed % 6]}`
          : `The lecture discusses ${topic}. The speaker explains that evidence must be interpreted with its conditions. A single result may not apply in every situation. ${lectureDetails[viewSeed % 6]}`;
        return { passage, question: prompt.replace(/^.*?·\s*문항\s*\d+:\s*/u, ""), choices: problem.choices, answer };
      }
    }
    if (level > 5) return null;
    const peopleWords = ["mother", "father", "sister", "brother", "family", "baby", "friend", "teacher", "girl", "boy"];
    const generalWords = ["book", "school", "apple", "water", "happy", "play", "read", "write"];
    const fullSentenceAnswer = String(problem.correctAnswer || "").trim();
    const sentenceChoices = (problem.choices || []).filter((choice) => /^[A-Za-z].*[.!?]$/.test(String(choice)));
    if (!word && /^[A-Za-z].*[.!?]$/.test(fullSentenceAnswer) && sentenceChoices.length) {
      if (stageType === "reading") {
        const sentenceWord = fullSentenceAnswer.match(/\b([A-Za-z]+)[.!?]$/)?.[1] || "student";
        return {
          passage: `${fullSentenceAnswer} The ${sentenceWord} has a yellow bag. The ${sentenceWord} is at school.`,
          question: "What color is the bag?",
          choices: ["yellow", "blue", "red", "green"],
          answer: "yellow",
          word: sentenceWord,
        };
      }
      return { question: fullSentenceAnswer.replace(/\s+/g, " / ").replace(/\s\/\s([.!?])$/, "$1"), choices: problem.choices, answer: fullSentenceAnswer };
    }
    const missingLetter = prompt.match(/([A-Za-z]+)_([A-Za-z]+)/);
    if (!word && missingLetter && /^[A-Za-z]$/.test(fullSentenceAnswer)) {
      return { question: missingLetter[0], answer: fullSentenceAnswer, word: `${missingLetter[1]}${fullSentenceAnswer}${missingLetter[2]}` };
    }
    if (!word) return null;
    const ambiguousGroup = ["girl", "sister"].includes(word.toLowerCase())
      ? new Set(["girl", "sister"])
      : ["boy", "brother"].includes(word.toLowerCase())
        ? new Set(["boy", "brother"])
        : new Set();
    const unambiguousChoices = [...originalEnglishChoices, ...peopleWords, ...generalWords]
      .filter((choice) => choice.toLowerCase() === word.toLowerCase() || !ambiguousGroup.has(choice.toLowerCase()));
    const choices = [...new Set([word, ...unambiguousChoices])].slice(0, 4);
    if (!choices.includes(word)) choices[0] = word;
    const personWord = peopleWords.includes(word.toLowerCase());
    const lowerWord = word.toLowerCase();
    const sentenceSets = {
      mother: ["This is my ____.", "I see my ____.", "She is my ____."],
      father: ["This is my ____.", "I see my ____.", "He is my ____."],
      sister: ["This is my ____.", "I see my ____.", "She is my ____."],
      brother: ["This is my ____.", "I see my ____.", "He is my ____."],
      family: ["This is my ____.", "I love my ____.", "I see my ____."],
      baby: ["This is a ____.", "I see a ____.", "The ____ is here."],
      teacher: ["This is my ____.", "I see my ____.", "She is my ____."],
      girl: ["This is a ____.", "I see a ____.", "The ____ is here."],
      boy: ["This is a ____.", "I see a ____.", "The ____ is here."],
      friend: ["This is my ____.", "I see my ____.", "My ____ is here."],
    };
    const templates = sentenceSets[lowerWord] || ["I can see the ____.", "The ____ is here.", "We use the ____ every day."];
    const questionSeed = [...String(problem.questionId || word)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const grammarSentence = templates[questionSeed % templates.length];
    if (stageType === "reading") {
      const familyWords = ["mother", "father", "sister", "brother", "family", "friend", "teacher"];
      const isMyWord = familyWords.includes(lowerWord);
      const familyReadingSets = [
        { passage: `I am at home with my ${word}. We read a book. The book is blue. We are happy.`, question: "What color is the book?", choices: ["blue", "red", "green", "yellow"], answer: "blue" },
        { passage: `My ${word} and I are in the park. We walk together. We play with a ball.`, question: "Where are they?", choices: ["in the park", "at school", "at home", "in the store"], answer: "in the park" },
        { passage: `This is my ${word}. We eat lunch together. We have rice and an apple.`, question: "What do they eat?", choices: ["rice and an apple", "bread and milk", "cake and juice", "fish and soup"], answer: "rice and an apple" },
        { passage: `My ${word} has a small dog. The dog is brown. It likes to run.`, question: "What color is the dog?", choices: ["brown", "white", "black", "gray"], answer: "brown" },
      ];
      const personReadingSets = [
        { passage: `A ${word} is at school. The ${word} has a red bag and a book.`, question: "What color is the bag?", choices: ["red", "blue", "green", "black"], answer: "red" },
        { passage: `A ${word} is in the park. The ${word} runs with a small dog.`, question: "Where is the person?", choices: ["in the park", "at home", "at school", "in the store"], answer: "in the park" },
        { passage: `A ${word} has an apple and water. The ${word} eats the apple first.`, question: "What does the person eat?", choices: ["an apple", "bread", "rice", "cake"], answer: "an apple" },
        { passage: `A ${word} reads a book in the morning. The book is about a cat.`, question: "What is the book about?", choices: ["a cat", "a dog", "a school", "a family"], answer: "a cat" },
      ];
      const thingReadingSets = [
        { passage: `The ${word} is on the desk. It is next to a blue book.`, question: "Where is it?", choices: ["on the desk", "under the bed", "in the bag", "by the door"], answer: "on the desk" },
        { passage: `I use the ${word} in the morning. I put it in my bag after lunch.`, question: "When do I use it?", choices: ["in the morning", "at night", "after dinner", "on Sunday"], answer: "in the morning" },
        { passage: `The ${word} is small and green. My friend likes it, too.`, question: "What color is it?", choices: ["green", "red", "blue", "yellow"], answer: "green" },
      ];
      const readingSets = isMyWord ? familyReadingSets : personWord ? personReadingSets : thingReadingSets;
      const reading = readingSets[questionSeed % readingSets.length];
      return {
        passage: reading.passage,
        question: reading.question,
        choices: reading.choices,
        answer: reading.answer,
      };
    }
    return {
      question: grammarSentence,
      choices,
      answer: word,
    };
  };

  const readingFallbackView = (problem, stage) => {
    if (stage?.stageType !== "reading" || problem.passage || problem.readingPassage) return null;
    const prompt = String(problem.prompt || "");
    const answer = String(problem.correctAnswer ?? problem.choices?.[problem.answerIndex] ?? "").trim();
    const level = Number(String(problem.questionId || "").match(/^EN-L(\d{2})-/)?.[1] || 0);
    const seed = [...String(problem.questionId || "")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const blankSentence = prompt.match(/([A-Z][^가-힣“”]*_{1,}[^가-힣“”]*[.!?])/u)?.[1]?.trim();
    if (blankSentence && answer) {
      const basicSupport = ["The picture gives one clue.", "The next sentence adds a detail.", "The words around the blank show the meaning.", "The subject gives an important clue.", "The last word helps complete the idea.", "The sentence describes one clear situation."];
      const middleSupport = ["The surrounding sentence shows the time and situation.", "The subject determines the correct verb form.", "The time phrase limits the possible tense.", "The next detail confirms the action.", "The context shows whether the action is complete.", "The sentence pattern identifies the needed phrase."];
      const support = (level <= 5 ? basicSupport : middleSupport)[seed % 6];
      return { passage: `${blankSentence} ${support}`, question: "Which choice completes the text?", choices: problem.choices, answer };
    }
    const letterSequence = prompt.match(/([A-Za-z],\s*_{1,},\s*[A-Za-z])/u)?.[1];
    if (letterSequence && answer) {
      return { passage: `The letters are ${letterSequence}. They are in alphabetical order.`, question: "Which letter is missing?", answer };
    }
    const incompleteWord = prompt.match(/(?:[A-Za-z]+_[A-Za-z_]*|[A-Za-z_]*_[A-Za-z]+)/)?.[0];
    if (incompleteWord && answer) {
      return { passage: `Complete the word: ${incompleteWord}. One letter is missing.`, question: "Which letter is missing?", answer };
    }
    const sourceSentence = prompt.match(/[“"]([^”"]+)[”"]/)?.[1]?.trim()
      || prompt.match(/:\s*([A-Z][^가-힣]+[.!?])\s*$/u)?.[1]?.trim();
    if (sourceSentence && /^[OX]$/.test(answer)) {
      const action = sourceSentence.match(/\b(?:is|are|was|were)\s+([A-Za-z]+ing)\b/i)?.[1];
      if (action) {
        const actions = [...new Set([action, "reading", "playing", "sleeping", "studying"])].slice(0, 4);
        return { passage: `${sourceSentence} The action continues for a short time.`, question: "What is happening?", choices: actions, answer: action };
      }
    }
    if (sourceSentence && problem.choices?.length && answer) {
      return { passage: `${sourceSentence} Read the sentence carefully and check its main detail.`, question: "Which choice matches the text?", choices: problem.choices, answer };
    }
    if (/^[A-Za-z].*[.!?]$/.test(answer) && problem.choices?.length) {
      return { passage: `${answer} The sentence gives the main information clearly.`, question: "Which sentence matches the text?", choices: problem.choices, answer };
    }
    if (problem.choices?.length && answer) {
      const genericPassages = [
        "A short text introduces one person. The next sentence has a missing part: ____.",
        "The first line describes a place. One key word is missing from the second line: ____.",
        "Two people are talking about their day. Complete the final idea: ____.",
        "The writer gives one detail and then leaves a blank: ____. Read both parts together.",
        "A simple story begins with an action. The missing part completes what happens next: ____.",
        "The paragraph describes an object. Choose the expression that fits the last blank: ____.",
      ];
      return { passage: genericPassages[seed % 6], question: "Which choice completes the text?", choices: problem.choices, answer };
    }
    return null;
  };

  const toQuestion = (problem, stage) => {
    const primaryView = englishLearningView(problem, stage);
    const fallbackView = stage?.stageType === "reading" && !primaryView?.passage && !problem.passage && !problem.readingPassage
      ? readingFallbackView(problem, stage)
      : null;
    const learningView = primaryView && fallbackView ? { ...primaryView, ...fallbackView } : primaryView || fallbackView;
    return ({
    id: problem.questionId || problem.id,
    type: problem.type === "pronunciationPrompt" ? "speaking" : ["fillBlank", "spelling", "dictation"].includes(problem.type) ? "fill-blank" : problem.type,
    question: learningView?.question || problem.prompt,
    choices: learningView?.choices || (problem.choices?.length ? problem.choices : undefined),
    answer: learningView?.answer || (problem.correctAnswer ?? problem.choices?.[problem.answerIndex]),
    explanation: problem.explanation,
    hint: "이 스테이지의 학습 목표를 확인해 보세요.",
    acceptedAnswers: problem.acceptedAnswers || [],
    audioText: problem.audioText || "",
    mediaRequired: problem.mediaRequired || "none",
    skill: problem.skill,
    sourceObjective: problem.sourceObjective,
    passage: learningView?.passage || problem.passage || "",
    evidenceSentence: problem.evidenceSentence || "",
    evidenceStart: problem.evidenceStart,
    evidenceEnd: problem.evidenceEnd,
    timeLimitSeconds: problem.timeLimitSeconds || 0,
    paragraphStructure: problem.paragraphStructure || "",
    academicField: problem.academicField || "",
    vocabularyFocus: problem.vocabularyFocus || "",
    summaryKeywords: problem.summaryKeywords || [],
    questionCategory: problem.questionCategory || "",
    readingSkill: problem.readingSkill || "",
    transcript: problem.transcript || problem.listeningTranscript || "",
    speakers: problem.speakers || [],
    segments: problem.segments || [],
    conversationType: problem.conversationType || "",
    noteTakingTargets: problem.noteTakingTargets || [],
    readingPassage: problem.readingPassage || "",
    listeningTranscript: problem.listeningTranscript || "",
    preparationSeconds: problem.preparationSeconds || 0,
    responseSeconds: problem.responseSeconds || 0,
    speakingTaskType: problem.speakingTaskType || "",
    responseFramework: problem.responseFramework || [],
    requiredPoints: problem.requiredPoints || [],
    scoringRubric: problem.scoringRubric || {},
    sampleResponse: problem.sampleResponse || "",
    professorPrompt: problem.professorPrompt || "",
    studentResponses: problem.studentResponses || [],
    minimumWordTarget: problem.minimumWordTarget || 0,
    maximumWordTarget: problem.maximumWordTarget || 0,
    outlineGuide: problem.outlineGuide || [],
    checklist: problem.checklist || [],
    userInputRequired: Boolean(problem.userInputRequired),
    recordingRequired: Boolean(problem.recordingRequired),
    vocabularyWord: problem.vocabularyWord || learningView?.word || extractVocabularyWord(problem),
    koreanMeaning: problem.koreanMeaning || "",
    exampleSentence: problem.exampleSentence || "",
    exampleTranslation: problem.exampleTranslation || "",
    partOfSpeech: problem.partOfSpeech || "",
    grammarFocus: problem.grammarFocus || "",
    vocabularyTopic: problem.vocabularyTopic || "",
    });
  };

  const stages = curriculum.courses.map((course) => ({
    id: course.courseId,
    levelId: course.levelId,
    levelTitle: course.levelTitle,
    title: course.courseTitle,
    description: course.description,
    difficulty: course.difficulty,
    cefrApprox: course.cefrApprox,
    learningObjectives: course.learningObjectives,
    prerequisiteCourseIds: course.prerequisiteCourseIds,
    assessmentType: course.assessmentType,
    passMode: "perfect",
    intro: {
      title: course.courseTitle,
      body: course.learningObjectives.join(" "),
      example: `${course.stages.length}개 기본 스테이지 · 최대 10개까지 확장 가능`,
    },
    courseStages: course.stages.map((stage) => {
      const externalQuestions = window.ENGLISH_LV1_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV2_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV3_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV4_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV5_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV6_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV7_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV8_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV9_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV10_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV11_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV12_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV13_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV14_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV15_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV16_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV17_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV18_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV19_QUESTIONS?.[stage.stageId] || window.ENGLISH_LV20_QUESTIONS?.[stage.stageId];
      const sourceQuestions = externalQuestions || stage.sampleProblems || [];
      return { ...stage, contentStatus:sourceQuestions.length ? "ready" : "curriculum-only", questions:sourceQuestions.map((problem) => toQuestion(problem, stage)) };
    }),
    questions: course.sampleProblems.map((problem) => toQuestion(problem, null)),
    curriculumOnly: course.stages.every((stage) => !(window.ENGLISH_LV1_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV2_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV3_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV4_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV5_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV6_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV7_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV8_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV9_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV10_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV11_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV12_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV13_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV14_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV15_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV16_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV17_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV18_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV19_QUESTIONS?.[stage.stageId]?.length || window.ENGLISH_LV20_QUESTIONS?.[stage.stageId]?.length || stage.sampleProblems?.length)),
  }));

  window.STUDY_SUBJECT_CONTENT.english = {
    name: "영어",
    eyebrow: "기초 · 수능 · TOEFL 통합 로드맵",
    color: "#d9a91a",
    levelOrder: levels.map((level) => level.levelId),
    levelSummaries: levels,
    stages,
  };
})();
