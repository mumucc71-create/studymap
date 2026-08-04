(function (root, factory) {
  const api = factory(root?.STUDY_ENGLISH_CONTENT_BUILDER || (typeof require === "function" ? require("./english-learning-content-builder.js") : null));
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_LEVEL3_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function (builder) {
  "use strict";
  if (!builder) throw new Error("ENGLISH_CONTENT_BUILDER_REQUIRED");
  const c = (source) => builder.buildCompactLesson({ estimatedDuration: 16, ...source });
  const cycles = [
    c({
      cycleId:"EN-L3-CYCLE-01", title:"Asking Questions", theme:"asking for information", contextDomain:"communication",
      targetVocabularyIds:["explain","question","answer","clearly"], reviewVocabularyIds:["guide","schedule"], targetGrammarIds:["do_questions","wh_questions"], reviewGrammarIds:["simple_present"], prerequisiteCycleIds:["EN-L2-CYCLE-10"], nextCycleIds:["EN-L3-CYCLE-02"],
      words:[
        ["explain","Choose the verb that means ‘make an idea easier to understand.’","Can you ___ this rule again?","Explain means to make meaning clear."],
        ["question","","Mina asks a ___ about the homework.","A question requests information."],
        ["answer","","Please write your ___ below the problem.","An answer responds to a question."],
        ["clearly","","The teacher speaks slowly and ___.","Clearly means in an understandable way."],
      ],
      passage:"Joon does not understand the science instructions. He asks, ‘Which liquid do we add first?’ His partner explains the first step clearly. Joon then answers the next question by himself. Both students finish the experiment safely.",
      tasks:{
        grammar:["___ you understand the first step?",["Do","Does","Did","Are"],0,"Use do with the subject you in a present question.",["question","explain"],["do_questions"],["SUBJECT_AUXILIARY_AGREEMENT","TENSE_ERROR","BE_DO_CONFUSION"]],
        sentence:["Choose the correct question.",["Why she needs help?","Why does she need help?","Why does she needs help?","Why do she need help?"],1,"A present wh-question uses does + subject + base verb.",["question","answer"],["wh_questions"],["AUXILIARY_OMISSION","VERB_FORM_AFTER_AUXILIARY","SUBJECT_AUXILIARY_AGREEMENT"]],
        expansion:["Choose the question that asks about a reason.",["Where does the class meet?","Why does the class meet early?","When does the class meet?","Who meets the class?"],1,"Why asks for a reason.",["question","clearly"],["wh_questions"],["PLACE_QUESTION_CONFUSION","TIME_QUESTION_CONFUSION","PERSON_QUESTION_CONFUSION"]],
        connection:["Choose the best word. I did not hear the answer, ___ I asked her to repeat it.",["so","although","unless","before"],0,"So connects the problem with the response.",["answer","clearly"],["cause_effect"]],
        detail:["What does Joon ask about?",["The first liquid","The final answer","The class schedule","The weather"],0,"He asks which liquid to add first.",["question","explain"],["wh_questions"]],
        relation:["What happens after Joon's partner explains the step?",["Joon leaves the room.","Joon answers another question.","The experiment is canceled.","The teacher changes the subject."],1,"Joon next answers a question by himself.",["answer","clearly"],["sequence_words"]],
        readingVocabulary:["What does ‘clearly’ suggest about the explanation?",["It is easy to understand.","It is very quiet.","It is written in code.","It avoids the question."],0,"The clear explanation helps Joon continue.",["clearly","explain"],["context_meaning"]],
        transfer:["Choose the best word. A graph can ___ how prices changed.",["question","clearly","explain","answer"],2,"A graph can explain or show a change.",["explain"],["academic_transfer"]],
        independent:["Choose the correct question and answer pair.",["Does Mina understand? — Yes, she does.","Do Mina understand? — Yes, she do.","Does Mina understands? — Yes, she is.","Is Mina understand? — Yes, she does."],0,"Does takes the base verb, and the short answer repeats does.",["explain","question","answer","clearly"],["do_questions","wh_questions"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-02", title:"Making Plans", theme:"planning together", contextDomain:"plans",
      targetVocabularyIds:["arrange","available","decide","cancel"], reviewVocabularyIds:["explain","question"], targetGrammarIds:["future_will","may_possibility"], reviewGrammarIds:["do_questions"], prerequisiteCycleIds:["EN-L3-CYCLE-01"], nextCycleIds:["EN-L3-CYCLE-03"],
      words:[
        ["arrange","Choose the verb that means ‘organize the details of an event.’","We need to ___ a time for the meeting.","Arrange means to organize plans."],
        ["available","","Is the gym ___ after four o'clock?","Available means free and ready to be used."],
        ["decide","","The team will ___ which project to choose.","Decide means to make a choice."],
        ["cancel","","Heavy snow may ___ tomorrow's practice.","Cancel means to decide that an event will not happen."],
      ],
      passage:"The art club wants to arrange a weekend workshop. The school hall is available on Saturday but not on Sunday. Members may invite a local artist to teach them. They will decide by Thursday after checking the cost. If the artist cannot come, they will not cancel the workshop; a teacher will lead it instead.",
      tasks:{
        grammar:["The artist ___ be available on Saturday, but she is not sure.",["must","may","did","has"],1,"May expresses an uncertain possibility.",["available","arrange"],["may_possibility"],["CERTAINTY_MODAL_ERROR","TENSE_ERROR","AUXILIARY_ERROR"]],
        sentence:["Choose the correct future sentence.",["We will decides tomorrow.","We will decide tomorrow.","We will deciding tomorrow.","We are will decide tomorrow."],1,"Will is followed by the base verb decide.",["decide","cancel"],["future_will"],["VERB_FORM_AFTER_MODAL","VERB_FORM_ERROR","DOUBLE_AUXILIARY_ERROR"]],
        expansion:["Choose the sentence that adds a condition to ‘We will meet outside.’",["We will meet outside at noon.","We will meet outside if the weather is mild.","We will meet outside quietly.","We will meet outside with the artist."],1,"If introduces the condition for meeting outside.",["arrange","available"],["basic_condition"]],
        connection:["Choose the best word. The hall is unavailable, ___ we must arrange another place.",["so","although","before","unless"],0,"So introduces the necessary result.",["available","arrange"],["cause_effect"]],
        detail:["When is the hall available?",["Saturday","Sunday","Thursday","Friday"],0,"The hall is available on Saturday.",["available","arrange"],["time_detail"]],
        relation:["What will happen if the artist cannot come?",["The club will cancel everything.","A teacher will lead the workshop.","The hall will close permanently.","Members will meet on Sunday."],1,"The teacher is the stated alternative.",["cancel","decide"],["basic_condition"]],
        readingVocabulary:["What does ‘arrange’ mean in the passage?",["Organize the workshop details","Paint the school hall","Refuse every invitation","Pay the artist immediately"],0,"The club organizes a time, place, and leader.",["arrange","decide"],["context_meaning"]],
        transfer:["Choose the best word. The airline may ___ the flight during the storm.",["arrange","available","decide","cancel"],3,"A dangerous storm may cause a flight cancellation.",["cancel"],["may_possibility"]],
        independent:["Choose the correct plan.",["We may change the date, but we will not cancel the event.","We may to change the date, but we will not canceled the event.","We may changing the date, but we not will cancel the event.","We are may change the date, but we will not cancels the event."],0,"Both may and will take base verbs.",["arrange","available","decide","cancel"],["may_possibility","future_will"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-03", title:"School Clubs", theme:"club participation", contextDomain:"school_clubs",
      targetVocabularyIds:["member","join","activity","organize"], reviewVocabularyIds:["arrange","decide"], targetGrammarIds:["infinitive_gerund","must_obligation"], reviewGrammarIds:["future_will"], prerequisiteCycleIds:["EN-L3-CYCLE-02"], nextCycleIds:["EN-L3-CYCLE-04"],
      words:[
        ["member","Choose the word for a person who belongs to a group.","Each club ___ has a different job.","A member belongs to a group."],
        ["join","","I want to ___ the school newspaper club.","Join means to become part of a group."],
        ["activity","","Photography is our most popular club ___.","An activity is something people do."],
        ["organize","","Students ___ the books by topic.","Organize means to arrange things in an orderly way."],
      ],
      passage:"Lena wants to join the school gardening club. Every member must attend a short safety lesson before using tools. The club enjoys growing vegetables behind the science room. This month, students plan to organize a plant sale. The activity will raise money for new gardening gloves.",
      tasks:{
        grammar:["Every member must ___ the safety lesson.",["attends","attended","attend","attending"],2,"Must is followed by the base verb.",["member","join"],["must_obligation"]],
        sentence:["Choose the correct sentence.",["Lena enjoys grow vegetables.","Lena enjoys growing vegetables.","Lena enjoys to growing vegetables.","Lena enjoy grows vegetables."],1,"Enjoy is followed by a gerund.",["activity","organize"],["infinitive_gerund"],["INFINITIVE_GERUND_ERROR","DOUBLE_NONFINITE_ERROR","AGREEMENT_AND_FORM_ERROR"]],
        expansion:["Choose the sentence that adds a purpose to ‘Students organize a sale.’",["Students organize a large sale.","Students organize a sale to buy new gloves.","Students carefully organize a sale.","Students organize a sale behind the school."],1,"To buy new gloves states the purpose.",["organize","activity"],["purpose_infinitive"]],
        connection:["Choose the best word. Tools can be dangerous, ___ members must attend the lesson.",["so","although","before","unless"],0,"So introduces the safety requirement as a result.",["member","activity"],["cause_effect"]],
        detail:["What does the club grow?",["Vegetables","Newspapers","Sports equipment","Science tools"],0,"The club grows vegetables.",["activity","join"],["reading_detail"]],
        relation:["Why will students organize a plant sale?",["To choose a club leader","To buy gardening gloves","To cancel the safety lesson","To move the science room"],1,"The sale will raise money for gloves.",["organize","member"],["purpose_infinitive"]],
        readingVocabulary:["Who is a ‘member’ here?",["A student in the gardening club","A customer at the plant sale","A science teacher outside the club","A person who repairs the tools"],0,"A member belongs to the club.",["member","join"],["context_meaning"]],
        transfer:["Choose the best word. The librarian will ___ returned books by subject.",["activity","member","organize","join"],2,"Organize means put items into an orderly system.",["organize"],["academic_transfer"]],
        independent:["Choose the correct club rule.",["Members must attend the lesson before using tools.","Members must to attend the lesson before use tools.","Members must attending the lesson before used tools.","Member must attends the lesson before using tools."],0,"Must takes attend, and before can be followed by using.",["member","join","activity","organize"],["must_obligation","infinitive_gerund"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-04", title:"Sports and Practice", theme:"improving through practice", contextDomain:"sports",
      targetVocabularyIds:["improve","coach","effort","regular"], reviewVocabularyIds:["member","organize"], targetGrammarIds:["comparison","should_advice"], reviewGrammarIds:["must_obligation"], prerequisiteCycleIds:["EN-L3-CYCLE-03"], nextCycleIds:["EN-L3-CYCLE-05"],
      words:[
        ["improve","Choose the verb that means ‘become better.’","Daily practice can ___ your balance.","Improve means to make progress."],
        ["coach","","Our ___ shows us a safer way to land.","A coach teaches and trains athletes."],
        ["effort","","Your strong ___ matters more than one score.","Effort is the energy used to do something well."],
        ["regular","","___ practice happens at the same times each week.","Regular means repeated in a consistent pattern."],
      ],
      passage:"Dae's first volleyball serve rarely crossed the net. His coach asked him to practice a shorter movement. Dae made a regular practice plan and recorded ten serves each day. After two weeks, his serves were stronger and more accurate. The coach praised his effort, not only the better score.",
      tasks:{
        grammar:["Dae's serves are ___ than they were last week.",["strong","stronger","strongest","more stronger"],1,"Use the comparative stronger with than.",["improve","regular"],["comparison"],["COMPARATIVE_FORM_ERROR","SUPERLATIVE_ERROR","DOUBLE_COMPARATIVE_ERROR"]],
        sentence:["Choose the correct advice.",["He should practices regularly.","He should practice regularly.","He should to practice regularly.","He is should practice regularly."],1,"Should takes the base verb practice.",["coach","effort"],["should_advice"],["VERB_FORM_AFTER_MODAL","MODAL_TO_ERROR","DOUBLE_AUXILIARY_ERROR"]],
        expansion:["Choose the sentence that adds a comparison to ‘This exercise is useful.’",["This exercise is very useful.","This exercise is more useful than the old one.","This useful exercise is short.","This exercise is useful today."],1,"More useful than adds a comparison.",["improve","regular"],["comparison"]],
        connection:["Choose the best word. Dae changed his movement, ___ his serves became more accurate.",["so","although","unless","before"],0,"So introduces the improvement as a result.",["improve","coach"],["cause_effect"]],
        detail:["What did Dae record each day?",["Ten serves","His coach's score","Two volleyball games","One long movement"],0,"He recorded ten serves.",["regular","effort"],["reading_detail"]],
        relation:["Why did the coach praise Dae?",["He bought a new ball.","He showed effort and improved.","He stopped recording serves.","He became the tallest player."],1,"The passage connects his effort with improvement.",["effort","improve"],["cause_effect"]],
        readingVocabulary:["What does ‘accurate’ suggest about the serves?",["They landed closer to the intended place.","They moved more slowly every day.","They used a larger volleyball.","They required no practice."],0,"Accurate serves reach the intended area more reliably.",["coach","improve"],["context_meaning"]],
        transfer:["Choose the best word. Reading feedback can help writers ___.",["coach","regular","improve","effort"],2,"Writers can improve by using feedback.",["improve"],["academic_transfer"]],
        independent:["Choose the correct comparison and advice.",["This plan is better, so we should use it regularly.","This plan is more better, so we should uses it regular.","This plan better is, so we should to use it regularly.","This plan is best than before, so we are should use it."],0,"Better is the comparative form, and should takes use.",["improve","coach","effort","regular"],["comparison","should_advice"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-05", title:"Comparing Things", theme:"careful comparisons", contextDomain:"comparison",
      targetVocabularyIds:["similar","different","feature","compare"], reviewVocabularyIds:["improve","effort"], targetGrammarIds:["comparative_superlative","comparison_clauses"], reviewGrammarIds:["comparison"], prerequisiteCycleIds:["EN-L3-CYCLE-04"], nextCycleIds:["EN-L3-CYCLE-06"],
      words:[
        ["similar","Choose the adjective that means ‘almost the same.’","The two phones look ___, but their cameras differ.","Similar things share important qualities."],
        ["different","","These shoes are ___ in color and size.","Different things are not the same."],
        ["feature","","A long battery life is the tablet's best ___.","A feature is an important part or quality."],
        ["compare","","We ___ the two maps before choosing a route.","Compare means examine similarities and differences."],
      ],
      passage:"Our class compared two reusable bottles. Bottle A was lighter and cheaper, while Bottle B kept water cold longer. Both bottles had a similar size, but their lids were different. Students said temperature control was the most useful feature. They chose Bottle B even though it cost more.",
      tasks:{
        grammar:["Bottle B is ___ expensive than Bottle A.",["most","more","much","many"],1,"Use more before a longer adjective in a comparison.",["compare","feature"],["comparative_superlative"],["SUPERLATIVE_ERROR","QUANTIFIER_ERROR","COUNTABILITY_ERROR"]],
        sentence:["Choose the correct superlative sentence.",["This is the more useful feature of all.","This is the most useful feature of all.","This is the usefulest feature of all.","This feature is most useful than that one."],1,"Use the most useful when comparing all items.",["feature","similar"],["comparative_superlative"],["COMPARATIVE_SUPERLATIVE_CONFUSION","SUPERLATIVE_FORM_ERROR","THAN_WITH_SUPERLATIVE"]],
        expansion:["Choose the sentence that adds a contrast to ‘The bags are similar.’",["The bags are very similar.","The bags are similar, but their pockets are different.","The similar bags are on sale.","The bags are similar today."],1,"But introduces a contrasting difference.",["similar","different"],["contrast_clause"]],
        connection:["Choose the best word. Bottle B costs more, ___ it keeps water cold longer.",["but","so","because","before"],0,"But contrasts the higher cost with the advantage.",["compare","feature"],["contrast_clause"]],
        detail:["Which bottle is lighter?",["Bottle A","Bottle B","Both bottles","Neither bottle"],0,"The passage says Bottle A is lighter.",["compare","similar"],["reading_detail"]],
        relation:["Why did students choose Bottle B?",["It was the cheapest.","It kept water cold longer.","It had the smallest lid.","It was lighter than Bottle A."],1,"Temperature control was their most useful feature.",["feature","different"],["cause_effect"]],
        readingVocabulary:["What does ‘feature’ mean here?",["An important quality of a product","The price paid for a product","A person who sells bottles","A mistake in the comparison"],0,"Temperature control is a useful product quality.",["feature","compare"],["context_meaning"]],
        transfer:["Choose the best word. Scientists ___ results from two experiments.",["similar","different","compare","feature"],2,"Scientists compare evidence to identify patterns.",["compare"],["academic_transfer"]],
        independent:["Choose the correct comparison.",["The cameras are similar, but this one has the best battery life.","The cameras are similarly, but this one has the better battery life of all.","The cameras is similar, but this one has most best battery life.","The cameras are similar than, but this one has the more good battery."],0,"Similar is an adjective, and best is the superlative of good.",["similar","different","feature","compare"],["comparative_superlative","contrast_clause"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-06", title:"Feelings and Advice", theme:"responding to feelings", contextDomain:"wellbeing",
      targetVocabularyIds:["worried","confident","suggest","relax"], reviewVocabularyIds:["similar","compare"], targetGrammarIds:["should_advice","because_so"], reviewGrammarIds:["comparative_superlative"], prerequisiteCycleIds:["EN-L3-CYCLE-05"], nextCycleIds:["EN-L3-CYCLE-07"],
      words:[
        ["worried","Choose the adjective for feeling nervous about a possible problem.","I felt ___ before my first speech.","Worried means anxious about what may happen."],
        ["confident","","After practicing, Nari felt ___ about the test.","Confident means sure of your ability."],
        ["suggest","","I ___ taking a short break before you continue.","Suggest means offer an idea or plan."],
        ["relax","","Slow breathing can help you ___.","Relax means become calmer and less tense."],
      ],
      passage:"Min felt worried about speaking in front of the class. His friend suggested practicing with a small group first. Min rehearsed twice and learned to relax by breathing slowly. Because he knew the opening well, he felt more confident. His speech was not perfect, but he finished every part.",
      tasks:{
        grammar:["You look tired. You ___ take a short break.",["should","should to","are should","should taking"],0,"Should is followed by the base verb take.",["suggest","relax"],["should_advice"],["MODAL_TO_ERROR","DOUBLE_AUXILIARY_ERROR","VERB_FORM_AFTER_MODAL"]],
        sentence:["Choose the correct sentence.",["I was worried, so I practiced more.","I was worry, because so I practiced more.","I worried was, so practiced I more.","I was worried, so I practicing more."],0,"So correctly introduces the response to being worried.",["worried","confident"],["because_so"],["ADJECTIVE_FORM_ERROR","WORD_ORDER_ERROR","VERB_FORM_ERROR"]],
        expansion:["Choose the sentence that adds advice to ‘You feel nervous.’",["You feel very nervous.","You feel nervous, so you should breathe slowly.","You feel nervous before class.","You feel nervous about the speech."],1,"The second clause gives advice.",["relax","suggest"],["should_advice"]],
        connection:["Choose the best word. Hana feels confident ___ she practiced several times.",["because","although","unless","before"],0,"Because gives the reason for her confidence.",["confident","worried"],["because_so"]],
        detail:["What did Min practice?",["A class speech","A volleyball serve","A cooking recipe","A travel route"],0,"He practiced speaking in front of the class.",["worried","confident"],["reading_detail"]],
        relation:["How did slow breathing help Min?",["It made the speech longer.","It helped him relax.","It changed the class schedule.","It gave him a new topic."],1,"The passage links slow breathing with relaxation.",["relax","suggest"],["cause_effect"]],
        readingVocabulary:["What does ‘confident’ mean here?",["Sure he could speak successfully","Certain the class would leave","Angry about the assignment","Unwilling to practice again"],0,"Practice made Min feel sure of his ability.",["confident","worried"],["context_meaning"]],
        transfer:["Choose the best word. The report ___ that daily walking may improve sleep.",["relaxes","worries","suggests","confident"],2,"Suggests can mean indicates a possible conclusion.",["suggest"],["academic_transfer"]],
        independent:["Choose the best advice sentence.",["If you are worried, you should practice and relax your breathing.","If you worried, you should to practice and relaxing your breathing.","If you are worry, you are should practice and relaxes your breathing.","If you were worried, you should practiced and relax your breathes."],0,"The condition, adjective, and modal forms are correct.",["worried","confident","suggest","relax"],["should_advice","basic_condition"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-07", title:"Learning New Skills", theme:"skill development", contextDomain:"learning",
      targetVocabularyIds:["attempt","method","progress","patient"], reviewVocabularyIds:["confident","suggest"], targetGrammarIds:["infinitive_gerund","present_perfect_intro"], reviewGrammarIds:["should_advice"], prerequisiteCycleIds:["EN-L3-CYCLE-06"], nextCycleIds:["EN-L3-CYCLE-08"],
      words:[
        ["attempt","Choose the noun for an effort to do something difficult.","My first ___ at drawing the bicycle looked uneven.","An attempt is an effort to achieve something."],
        ["method","","This study ___ uses short daily practice.","A method is a particular way of doing something."],
        ["progress","","Keeping a journal helps me see my ___.","Progress is movement toward improvement."],
        ["patient","","Be ___ when a new skill takes time.","Patient means able to wait calmly."],
      ],
      passage:"Sumi has started learning sign language. Her first attempt was difficult because she moved too quickly. She found a method that uses five signs each day and enjoys practicing with a friend. After three weeks, she can see clear progress. She has learned to be patient when a sign is hard to remember.",
      tasks:{
        grammar:["Sumi enjoys ___ with a friend.",["practice","to practicing","practicing","practiced"],2,"Enjoy is followed by a gerund.",["method","progress"],["infinitive_gerund"],["INFINITIVE_GERUND_ERROR","DOUBLE_NONFINITE_ERROR","TENSE_ERROR"]],
        sentence:["Choose the correct sentence.",["She has learn ten signs.","She has learned ten signs.","She have learned ten signs.","She has learning ten signs."],1,"Has is followed by the past participle learned.",["attempt","patient"],["present_perfect_intro"],["PARTICIPLE_FORM_ERROR","SUBJECT_AUXILIARY_AGREEMENT","VERB_FORM_ERROR"]],
        expansion:["Choose the sentence that adds a learning method to ‘I study vocabulary.’",["I study difficult vocabulary.","I study vocabulary by using picture cards.","I study vocabulary after school.","I quietly study vocabulary."],1,"By using picture cards adds a method.",["method","progress"],["by_gerund"]],
        connection:["Choose the best word. Progress was slow, ___ Sumi remained patient.",["but","so","because","before"],0,"But contrasts slow progress with patience.",["progress","patient"],["contrast_clause"]],
        detail:["How many signs does Sumi study each day?",["Five","Ten","Three","Twenty"],0,"Her method uses five signs each day.",["method","attempt"],["reading_detail"]],
        relation:["Why was Sumi's first attempt difficult?",["She had no friend.","She moved too quickly.","She studied too few signs.","She lost her journal."],1,"The passage directly gives her speed as the reason.",["attempt","patient"],["cause_effect"]],
        readingVocabulary:["What does ‘progress’ mean here?",["Improvement over time","A new sign-language teacher","A mistake in one sign","A plan to stop learning"],0,"Sumi can see that her ability is improving.",["progress","method"],["context_meaning"]],
        transfer:["Choose the best word. Researchers tested a new ___ for cleaning water.",["attempt","patient","method","progress"],2,"A method is a systematic way to do something.",["method"],["academic_transfer"]],
        independent:["Choose the correct sentence about learning.",["I have made progress because I kept practicing patiently.","I have make progress because I kept to practicing patient.","I has made progresses because I keeping practice patiently.","I have making progress because I kept practiced patient."],0,"The present perfect, gerund, and adverb forms are correct.",["attempt","method","progress","patient"],["present_perfect_intro","infinitive_gerund"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-08", title:"Travel Problems", theme:"solving travel problems", contextDomain:"travel",
      targetVocabularyIds:["miss","replace","contact","solution"], reviewVocabularyIds:["method","progress"], targetGrammarIds:["simple_past","could_suggestion"], reviewGrammarIds:["present_perfect_intro"], prerequisiteCycleIds:["EN-L3-CYCLE-07"], nextCycleIds:["EN-L3-CYCLE-09"],
      words:[
        ["miss","Choose the verb meaning ‘fail to catch or attend something.’","We left late and ___ the first train.","Miss can mean fail to catch transport."],
        ["replace","","The airline will ___ my damaged suitcase.","Replace means provide another item instead."],
        ["contact","","Please ___ the hotel if your arrival time changes.","Contact means communicate with someone."],
        ["solution","","Taking the next bus was the simplest ___.","A solution answers or fixes a problem."],
      ],
      passage:"Kai missed his bus to the airport because the subway stopped unexpectedly. He contacted the airline and explained the delay. An agent suggested a later flight and replaced his seat reservation without a fee. Kai accepted the solution and arrived that evening. He now leaves extra travel time for important trips.",
      tasks:{
        grammar:["Kai ___ the bus yesterday.",["miss","misses","missed","missing"],2,"Yesterday requires missed.",["miss","contact"],["simple_past"],["TENSE_ERROR","TENSE_ERROR","VERB_FORM_ERROR"]],
        sentence:["Choose the correct suggestion.",["He could contacts the airline.","He could contact the airline.","He could to contact the airline.","He is could contact the airline."],1,"Could takes the base verb contact.",["contact","solution"],["could_suggestion"],["VERB_FORM_AFTER_MODAL","MODAL_TO_ERROR","DOUBLE_AUXILIARY_ERROR"]],
        expansion:["Choose the sentence that adds a solution to ‘Our train was canceled.’",["Our long train was canceled.","Our train was canceled, so we took a bus.","Our train was canceled yesterday.","Our train to Seoul was canceled."],1,"Taking a bus provides a solution.",["solution","replace"],["cause_effect"]],
        connection:["Choose the best word. The hotel replaced the broken key, ___ we could enter our room.",["so","although","unless","before"],0,"So introduces the successful result.",["replace","solution"],["cause_effect"]],
        detail:["Whom did Kai contact?",["The airline","The bus driver","The hotel","The subway office"],0,"He contacted the airline.",["contact","miss"],["reading_detail"]],
        relation:["How did the agent solve Kai's problem?",["By repairing the subway","By arranging a later flight","By paying for a hotel","By replacing his luggage"],1,"The agent suggested a later flight and changed the reservation.",["solution","replace"],["means_relation"]],
        readingVocabulary:["What does ‘missed’ mean here?",["Failed to catch","Felt sad about","Could not remember","Avoided contacting"],0,"Kai failed to catch the bus.",["miss","contact"],["multiple_meaning"]],
        transfer:["Choose the best word. A password reset may be the easiest ___ to the login problem.",["contact","replace","solution","miss"],2,"A solution fixes a problem in any domain.",["solution"],["academic_transfer"]],
        independent:["Choose the correct problem-and-solution sentence.",["We missed the train, so we contacted the station and found another route.","We miss the train yesterday, so we contacts the station and find another route.","We were missed the train, so us contacted the station and finding another route.","We missing the train, so we could to contacted the station."],0,"All past forms and the cause-result link are correct.",["miss","replace","contact","solution"],["simple_past","could_suggestion"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-09", title:"Technology at Home", theme:"responsible technology", contextDomain:"technology",
      targetVocabularyIds:["device","connect","privacy","update"], reviewVocabularyIds:["contact","solution"], targetGrammarIds:["passive_intro","must_obligation"], reviewGrammarIds:["could_suggestion"], prerequisiteCycleIds:["EN-L3-CYCLE-08"], nextCycleIds:["EN-L3-CYCLE-10"],
      words:[
        ["device","Choose the word for an electronic tool such as a phone or tablet.","This small ___ controls the lights.","A device is a tool made for a particular purpose."],
        ["connect","","Use this cable to ___ the speaker to the computer.","Connect means join things so they can work together."],
        ["privacy","","A strong password helps protect your ___.","Privacy is control over personal information."],
        ["update","","The app needs an ___ to fix a security problem.","An update is a newer version or improvement."],
      ],
      passage:"Mira's family uses one tablet to control several home devices. The tablet is connected to the lights and the front-door camera. Last week, an update improved the camera's security. Mira's parents explained that privacy must be protected with strong passwords. They also review which apps can use the camera.",
      tasks:{
        grammar:["The tablet ___ connected to the lights.",["is","does","has","being"],0,"The passive form is connected uses be plus a past participle.",["device","connect"],["passive_intro"],["AUXILIARY_ERROR","PERFECT_PASSIVE_CONFUSION","NONFINITE_FORM_ERROR"]],
        sentence:["Choose the correct safety rule.",["Users must protects their privacy.","Users must protect their privacy.","Users must to protect their privacy.","Users are must protect their privacy."],1,"Must takes the base verb protect.",["privacy","update"],["must_obligation"],["VERB_FORM_AFTER_MODAL","MODAL_TO_ERROR","DOUBLE_AUXILIARY_ERROR"]],
        expansion:["Choose the sentence that adds a purpose to ‘Install the update.’",["Install the large update.","Install the update to improve security.","Install the update tonight.","Install the update on the tablet."],1,"To improve security adds purpose.",["update","privacy"],["purpose_infinitive"]],
        connection:["Choose the best word. The old password was weak, ___ Mira changed it.",["so","although","before","unless"],0,"So introduces the security response.",["privacy","connect"],["cause_effect"]],
        detail:["Which devices does the tablet control?",["Lights and a camera","A train and a bus","A stove and a refrigerator","A phone and a printer"],0,"The passage names lights and the front-door camera.",["device","connect"],["reading_detail"]],
        relation:["Why did the camera receive an update?",["To make it heavier","To improve security","To remove every app","To change the front door"],1,"The update improved security.",["update","privacy"],["purpose_relation"]],
        readingVocabulary:["What does ‘privacy’ refer to?",["Control over personal information","The brightness of the lights","The price of the tablet","The size of the camera"],0,"Passwords and app permissions protect personal information.",["privacy","device"],["context_meaning"]],
        transfer:["Choose the best word. The new bridge will ___ two neighborhoods.",["device","privacy","connect","update"],2,"Connect can mean join physical places as well as electronics.",["connect"],["multiple_meaning"]],
        independent:["Choose the correct technology sentence.",["The device is connected securely, and users must protect their privacy.","The device does connected secure, and users must protects their privacy.","The device is connect securely, and users must to protect their privacy.","The device being connected security, and users are must protect privacy."],0,"The passive form and modal structure are correct.",["device","connect","privacy","update"],["passive_intro","must_obligation"]],
      }
    }),
    c({
      cycleId:"EN-L3-CYCLE-10", title:"Community Events", theme:"community event", contextDomain:"community",
      targetVocabularyIds:["community","announce","participate","local"], reviewVocabularyIds:["privacy","update"], targetGrammarIds:["basic_condition","sentence_connection"], reviewGrammarIds:["passive_intro"], prerequisiteCycleIds:["EN-L3-CYCLE-09"], nextCycleIds:["EN-L4-CYCLE-01"],
      words:[
        ["community","Choose the word for people who live or work in the same area.","The whole ___ helped clean the riverbank.","A community is a group connected by place or shared life."],
        ["announce","","The mayor will ___ the event date tomorrow.","Announce means make information public."],
        ["participate","","More than fifty students will ___ in the race.","Participate means take part in an activity."],
        ["local","","A ___ bakery donated bread from our town.","Local means connected with a nearby area."],
      ],
      passage:"The local library announced a community reading day. If the weather is dry, families will meet in the park; if it rains, the event will move indoors. Students can participate by reading a short story aloud. Several local shops will provide snacks. Organizers hope the event will help neighbors meet one another.",
      tasks:{
        grammar:["If it ___, the event will move indoors.",["rain","rains","will rain","rained"],1,"A basic future condition uses present tense after if.",["announce","community"],["basic_condition"],["SUBJECT_VERB_AGREEMENT","WILL_IN_IF_CLAUSE","TENSE_ERROR"]],
        sentence:["Choose the correct sentence.",["Students can participate by read aloud.","Students can participate by reading aloud.","Students can participates by reading aloud.","Students are can participate by reading aloud."],1,"By is followed by a gerund, and can takes participate.",["participate","local"],["infinitive_gerund","can_ability"],["GERUND_FORM_ERROR","VERB_FORM_AFTER_MODAL","DOUBLE_AUXILIARY_ERROR"]],
        expansion:["Choose the sentence that adds a condition to ‘Families will meet in the park.’",["Families will happily meet in the park.","Families will meet in the park if the weather is dry.","Local families will meet in the park.","Families will meet in the park at noon."],1,"If the weather is dry adds a condition.",["community","local"],["basic_condition"]],
        connection:["Choose the best word. Many neighbors joined, ___ the event helped people meet.",["so","although","before","unless"],0,"So introduces the result of participation.",["participate","community"],["sentence_connection"]],
        detail:["Where will families meet if it rains?",["Inside the library","In the park","At a bakery","Beside the river"],0,"Rain moves the event indoors at the library.",["local","announce"],["basic_condition"]],
        relation:["How can students participate?",["By selling tickets","By reading a story aloud","By closing local shops","By changing the weather"],1,"The passage states they can read aloud.",["participate","community"],["means_relation"]],
        readingVocabulary:["What does ‘local’ mean in the passage?",["From the nearby area","Known around the world","Open only online","Owned by the library"],0,"The shops and library belong to the nearby community.",["local","community"],["context_meaning"]],
        transfer:["Choose the best word. The study will ___ its results at a public meeting.",["community","participate","announce","local"],2,"Announce means make information public.",["announce"],["academic_transfer"]],
        independent:["Choose the correct community sentence.",["If local students participate, the event will reach more families.","If local students will participate, the event reaches more families tomorrow.","If local students participates, the event will reaching more families.","If local student participate, the event is will reach more families."],0,"The if-clause uses present tense, and the result uses will.",["community","announce","participate","local"],["basic_condition","sentence_connection"]],
      }
    }),
  ];
  return builder.buildLevel({ version:"english-level3-quality-v1", level:3, cycles });
});
