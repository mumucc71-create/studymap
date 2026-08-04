(function (root, factory) {
  const api = factory(root?.STUDY_ENGLISH_CONTENT_BUILDER || (typeof require === "function" ? require("./english-learning-content-builder.js") : null));
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.STUDY_ENGLISH_LEVEL2_CONTENT = api;
})(typeof window !== "undefined" ? window : globalThis, function (builder) {
  "use strict";
  if (!builder) throw new Error("ENGLISH_CONTENT_BUILDER_REQUIRED");

  const commonTags = ["GRAMMAR_FORM_ERROR", "TENSE_ERROR", "CONTEXT_MEANING_FAILURE"];
  const task = (prompt, choices, correctChoiceIndex, family, explanation, vocabulary, grammar, wrongTags = commonTags) => ({
    prompt, choices, correctChoiceIndex, family, explanation, vocabulary, grammar, wrongTags,
  });
  const vocab = (id, meaningPrompt, contextPrompt, family, explanation, meaningDistractors, grammar) => ({
    id, meaningPrompt, contextPrompt, family, explanation, meaningDistractors, grammar,
  });

  const lessons = [
    {
      cycleId: "EN-L2-CYCLE-01", title: "School Schedule", theme: "school schedule", contextDomain: "school",
      targetVocabularyIds: ["schedule", "subject", "break", "early"], targetGrammarIds: ["time_prepositions", "simple_present"],
      reviewVocabularyIds: ["lesson", "library"], reviewGrammarIds: ["simple_present"], prerequisiteCycleIds: ["EN-L1-CYCLE-10"], nextCycleIds: ["EN-L2-CYCLE-02"],
      vocabulary: [
        vocab("schedule", "Choose the word for a plan that shows when activities happen.", "Our class ___ lists math before lunch.", "schedule-plan", "A schedule organizes activities by time.", ["subject", "break", "early"]),
        vocab("subject", "", "Science is my favorite school ___.", "subject-context", "A subject is an area studied at school."),
        vocab("break", "", "We have a ten-minute ___ after the second lesson.", "break-context", "A break is a short time to rest."),
        vocab("early", "", "The library opens ___, before the first class.", "early-context", "Early means before the usual or expected time."),
      ],
      grammar: task("Our music class starts ___ nine o'clock.", ["in", "on", "at", "from"], 2, "at-clock-time", "Use at with an exact clock time.", ["schedule", "subject"], ["time_prepositions"], ["PREPOSITION_ERROR", "PREPOSITION_ERROR", "PREPOSITION_ERROR"]),
      sentence: task("Choose the correct sentence.", ["We has art on Tuesday.", "We have art on Tuesday.", "We having art on Tuesday.", "We are have art on Tuesday."], 1, "schedule-present", "The plural subject we takes have.", ["schedule", "subject"], ["simple_present"], ["SUBJECT_VERB_AGREEMENT", "VERB_FORM_ERROR", "AUXILIARY_ERROR"]),
      expansion: task("Choose the sentence that adds an exact time to ‘We have a break.’", ["We have a quiet break.", "We have a break at ten thirty.", "We have a break with our teacher.", "We have a break in the hall."], 1, "break-time", "At ten thirty adds an exact time.", ["break"], ["time_prepositions"], ["DESCRIPTION_NOT_TIME", "PERSON_NOT_TIME", "PLACE_NOT_TIME"]),
      connection: task("Choose the best word. I arrive early, ___ I can check my schedule before class.", ["but", "so", "or", "although"], 1, "early-result", "So introduces the result of arriving early.", ["early", "schedule"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "CHOICE_CONNECTOR_ERROR", "CONTRAST_CONNECTOR_ERROR"]),
      passage: "Mina checks her schedule before school. Math starts at nine, and science follows at ten. After science, the class has a short break. Mina arrives early because she likes to prepare.",
      reading: {
        detail: task("Which subject begins at ten?", ["Math", "Science", "Art", "Music"], 1, "reading-subject", "The passage says science follows at ten.", ["subject", "schedule"], ["simple_present"], ["TIME_DETAIL_CONFUSION", "UNSTATED_DETAIL", "UNSTATED_DETAIL"]),
        relation: task("Why does Mina arrive early?", ["She wants a longer break.", "She likes to prepare.", "She must clean the library.", "She misses science class."], 1, "reading-reason", "The final sentence gives her reason.", ["early", "schedule"], ["cause_effect"], ["DETAIL_CONFUSION", "UNSTATED_REASON", "REVERSED_CAUSALITY"]),
        vocabulary: task("What does ‘schedule’ mean in the passage?", ["A list of school times", "A room for experiments", "A short rest outdoors", "A book about science"], 0, "reading-schedule", "It is the plan showing when Mina's classes begin.", ["schedule", "break"], ["reference_words"], ["PLACE_MEANING_CONFUSION", "ACTIVITY_MEANING_CONFUSION", "OBJECT_MEANING_CONFUSION"]),
      },
      transfer: task("Choose the best word. The train ___ shows a departure at 7:20.", ["subject", "early", "schedule", "break"], 2, "train-transfer", "A train schedule lists departure times.", ["schedule"], ["simple_present"], ["SCHOOL_CONTEXT_INTRUSION", "ADJECTIVE_NOUN_ERROR", "REST_CONTEXT_INTRUSION"]),
      independent: task("Choose the correct sentence about a school day.", ["Our first subject start at nine.", "Our first subject starts at nine.", "Our first subject starting at nine.", "Our first subject is start at nine."], 1, "school-independent", "A singular subject takes starts.", ["schedule", "subject", "break", "early"], ["simple_present", "time_prepositions"], ["SUBJECT_VERB_AGREEMENT", "VERB_FORM_ERROR", "AUXILIARY_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-02", title: "At Home", theme: "home routines", contextDomain: "home",
      targetVocabularyIds: ["chore", "shelf", "upstairs", "tidy"], targetGrammarIds: ["there_is_are", "place_prepositions"],
      reviewVocabularyIds: ["schedule", "early"], reviewGrammarIds: ["time_prepositions"], prerequisiteCycleIds: ["EN-L2-CYCLE-01"], nextCycleIds: ["EN-L2-CYCLE-03"],
      vocabulary: [
        vocab("chore", "Choose the word for a regular job done at home.", "Washing the dishes is my evening ___.", "chore-meaning", "A chore is a routine household task.", ["shelf", "upstairs", "tidy"]),
        vocab("shelf", "", "The picture books are on the low ___.", "shelf-context", "A shelf is a flat place for storing objects."),
        vocab("upstairs", "", "My bedroom is ___, above the kitchen.", "upstairs-context", "Upstairs means on a higher floor."),
        vocab("tidy", "", "Please keep your desk clean and ___.", "tidy-context", "Tidy means neat and organized."),
      ],
      grammar: task("There ___ two baskets under the shelf.", ["is", "are", "be", "has"], 1, "there-are", "Use there are before a plural noun.", ["shelf", "tidy"], ["there_is_are"], ["NUMBER_AGREEMENT_ERROR", "BASE_FORM_ERROR", "HAVE_THERE_CONFUSION"]),
      sentence: task("Choose the correct sentence.", ["There is a lamp beside the bed.", "There are a lamp beside the bed.", "There a lamp is beside the bed.", "There has a lamp beside the bed."], 0, "there-is-lamp", "There is agrees with the singular noun lamp.", ["upstairs", "shelf"], ["there_is_are", "place_prepositions"], ["NUMBER_AGREEMENT_ERROR", "WORD_ORDER_ERROR", "HAVE_THERE_CONFUSION"]),
      expansion: task("Choose the sentence that adds a location to ‘I put away the towels.’", ["I put away the clean towels.", "I put away the towels upstairs.", "I quickly put away the towels.", "I put away the towels after dinner."], 1, "towels-place", "Upstairs adds a location.", ["upstairs", "tidy"], ["place_adverb"], ["DESCRIPTION_NOT_PLACE", "MANNER_NOT_PLACE", "TIME_NOT_PLACE"]),
      connection: task("Choose the best word. The room looks tidy ___ every book is on a shelf.", ["because", "unless", "but", "before"], 0, "tidy-reason", "Because gives the reason the room looks tidy.", ["tidy", "shelf"], ["because_clause"], ["CONDITION_CONNECTOR_ERROR", "CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR"]),
      passage: "Eli has two chores on Saturday. He carries clean towels upstairs and puts them in a closet. Then he places his comics on a shelf. His room looks tidy when he finishes.",
      reading: {
        detail: task("What does Eli carry upstairs?", ["Clean towels", "A new shelf", "Dirty dishes", "School books"], 0, "reading-towels", "The passage says he carries clean towels upstairs.", ["upstairs", "chore"], ["simple_present"], ["OBJECT_DETAIL_CONFUSION", "UNSTATED_DETAIL", "UNSTATED_DETAIL"]),
        relation: task("What happens after Eli puts away the towels?", ["He washes dishes.", "He places comics on a shelf.", "He goes to school.", "He makes his schedule."], 1, "reading-sequence", "The next action is placing the comics on a shelf.", ["shelf", "tidy"], ["sequence_words"], ["UNSTATED_SEQUENCE", "UNSTATED_SEQUENCE", "PREVIOUS_CYCLE_INTRUSION"]),
        vocabulary: task("What does ‘tidy’ describe?", ["A noisy room", "A neat room", "A dark room", "An empty room"], 1, "reading-tidy", "The organized room is neat or tidy.", ["tidy", "chore"], ["adjective_meaning"], ["QUALITY_CONFUSION", "QUALITY_CONFUSION", "QUALITY_CONFUSION"]),
      },
      transfer: task("Choose the best word. Feeding the dog is a daily ___.", ["shelf", "tidy", "chore", "upstairs"], 2, "pet-transfer", "Feeding a pet can be a regular chore.", ["chore"], ["article_a"], ["OBJECT_CONTEXT_MISMATCH", "ADJECTIVE_NOUN_ERROR", "PLACE_CONTEXT_MISMATCH"]),
      independent: task("Choose the correct sentence about the room.", ["There are three books on the shelf.", "There is three books on the shelf.", "There three books are on the shelf.", "There has three books on the shelf."], 0, "home-independent", "There are agrees with three books.", ["chore", "shelf", "upstairs", "tidy"], ["there_is_are", "place_prepositions"], ["NUMBER_AGREEMENT_ERROR", "WORD_ORDER_ERROR", "HAVE_THERE_CONFUSION"]),
    },
    {
      cycleId: "EN-L2-CYCLE-03", title: "Around Town", theme: "places in town", contextDomain: "town",
      targetVocabularyIds: ["corner", "bakery", "across", "nearby"], targetGrammarIds: ["place_prepositions", "articles"],
      reviewVocabularyIds: ["chore", "shelf"], reviewGrammarIds: ["there_is_are"], prerequisiteCycleIds: ["EN-L2-CYCLE-02"], nextCycleIds: ["EN-L2-CYCLE-04"],
      vocabulary: [
        vocab("corner", "Choose the word for the place where two streets meet.", "Turn left at the next ___.", "corner-meaning", "A street corner is where two streets meet.", ["bakery", "across", "nearby"]),
        vocab("bakery", "", "We buy fresh bread at the ___.", "bakery-context", "A bakery makes or sells bread and cakes."),
        vocab("across", "", "The bank is ___ from the park.", "across-context", "Across from means on the opposite side."),
        vocab("nearby", "", "There is a bus stop ___, only one block away.", "nearby-context", "Nearby means not far away."),
      ],
      grammar: task("The bakery is ___ the bank and the flower shop.", ["between", "under", "during", "into"], 0, "between-places", "Between locates something in the middle of two places.", ["bakery", "corner"], ["place_prepositions"], ["PREPOSITION_ERROR", "TIME_PLACE_CONFUSION", "DIRECTION_LOCATION_CONFUSION"]),
      sentence: task("Choose the correct sentence.", ["There is bakery near the station.", "There is a bakery near the station.", "There is an bakery near the station.", "There are a bakery near the station."], 1, "bakery-article", "A singular count noun beginning with a consonant sound takes a.", ["bakery", "nearby"], ["articles", "there_is_are"], ["ARTICLE_OMISSION", "ARTICLE_SOUND_ERROR", "NUMBER_AGREEMENT_ERROR"]),
      expansion: task("Choose the sentence that adds an opposite location to ‘The café is open.’", ["The café is open today.", "The café across from the library is open.", "The quiet café is open.", "The café is open early."], 1, "cafe-across", "Across from the library adds the opposite location.", ["across", "nearby"], ["place_prepositions"], ["TIME_NOT_PLACE", "DESCRIPTION_NOT_PLACE", "TIME_NOT_PLACE"]),
      connection: task("Choose the best word. The bakery is nearby, ___ we can walk there.", ["so", "although", "before", "unless"], 0, "nearby-result", "So introduces the result of the short distance.", ["bakery", "nearby"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "A new bakery opened on Pine Street. It is across from the library and near a busy corner. Hana walks there because it is nearby. She buys a loaf of bread and then visits the library.",
      reading: {
        detail: task("What does Hana buy?", ["A cake", "A loaf of bread", "A library card", "A bus ticket"], 1, "reading-purchase", "She buys a loaf of bread.", ["bakery"], ["simple_present"], ["RELATED_ITEM_CONFUSION", "NEXT_ACTION_CONFUSION", "UNSTATED_DETAIL"]),
        relation: task("Why does Hana walk to the bakery?", ["It is nearby.", "The library is closed.", "She has no money.", "The street is empty."], 0, "reading-distance", "She walks because the bakery is nearby.", ["nearby", "across"], ["cause_effect"], ["UNSTATED_REASON", "UNSTATED_REASON", "UNSTATED_REASON"]),
        vocabulary: task("What does ‘across from’ tell us?", ["The bakery is behind the library.", "The bakery is opposite the library.", "The bakery is inside the library.", "The bakery is far from the library."], 1, "reading-across", "Across from means on the opposite side.", ["across", "bakery"], ["place_prepositions"], ["LOCATION_RELATION_ERROR", "LOCATION_RELATION_ERROR", "LOCATION_RELATION_ERROR"]),
      },
      transfer: task("Choose the best word. The pharmacy is ___, so we do not need a car.", ["across", "corner", "nearby", "bakery"], 2, "pharmacy-transfer", "Nearby explains why walking is practical.", ["nearby"], ["cause_effect"], ["INCOMPLETE_PREPOSITION", "NOUN_CONTEXT_MISMATCH", "PLACE_TYPE_CONFUSION"]),
      independent: task("Choose the correct direction sentence.", ["A bank is across from the park.", "A bank is across the park from.", "Bank is an across from the park.", "A bank are across from the park."], 0, "town-independent", "Across from correctly expresses the opposite location.", ["corner", "bakery", "across", "nearby"], ["place_prepositions", "articles"], ["WORD_ORDER_ERROR", "ARTICLE_ERROR", "NUMBER_AGREEMENT_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-04", title: "Weekend Plans", theme: "future plans", contextDomain: "weekend",
      targetVocabularyIds: ["plan", "invite", "tomorrow", "picnic"], targetGrammarIds: ["future_be_going_to", "object_pronouns"],
      reviewVocabularyIds: ["corner", "nearby"], reviewGrammarIds: ["place_prepositions"], prerequisiteCycleIds: ["EN-L2-CYCLE-03"], nextCycleIds: ["EN-L2-CYCLE-05"],
      vocabulary: [
        vocab("plan", "Choose the word for something you have decided to do.", "Our weekend ___ includes a bike ride.", "plan-meaning", "A plan describes what someone intends to do.", ["invite", "tomorrow", "picnic"]),
        vocab("invite", "", "I will ___ Joon to the movie.", "invite-context", "Invite means to ask someone to join an event."),
        vocab("tomorrow", "", "We have no class ___, the day after today.", "tomorrow-context", "Tomorrow is the day after today."),
        vocab("picnic", "", "We will eat sandwiches outside at our ___.", "picnic-context", "A picnic is a meal eaten outdoors."),
      ],
      grammar: task("Sena is going to ___ her cousin tomorrow.", ["visits", "visited", "visit", "visiting"], 2, "going-to-base", "Be going to is followed by the base verb.", ["plan", "tomorrow"], ["future_be_going_to"], ["VERB_FORM_ERROR", "TENSE_ERROR", "VERB_FORM_ERROR"]),
      sentence: task("Choose the correct sentence.", ["I am going invite him to the picnic.", "I am going to invite him to the picnic.", "I going to invite he to the picnic.", "I am going to invites him to the picnic."], 1, "invite-pronoun", "Going to takes the base verb, and him is the object form.", ["invite", "picnic"], ["future_be_going_to", "object_pronouns"], ["INFINITIVE_MARKER_ERROR", "AUXILIARY_AND_PRONOUN_ERROR", "VERB_FORM_ERROR"]),
      expansion: task("Choose the sentence that adds a future time to ‘We play soccer.’", ["We play soccer well.", "We are going to play soccer tomorrow.", "We play soccer in the park.", "We play soccer with them."], 1, "soccer-future", "Going to and tomorrow add future time.", ["tomorrow", "plan"], ["future_be_going_to"], ["MANNER_NOT_TIME", "PLACE_NOT_TIME", "PERSON_NOT_TIME"]),
      connection: task("Choose the best word. Rain is expected, ___ we moved the picnic indoors.", ["so", "but", "or", "before"], 0, "rain-plan", "So connects the forecast with the changed plan.", ["picnic", "plan"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "CHOICE_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR"]),
      passage: "Jae and Mira are planning a picnic for tomorrow. They invite two friends and ask them to bring fruit. The weather report predicts rain, so the group plans to eat in Mira's building. They are still going to play board games together.",
      reading: {
        detail: task("What do the friends bring?", ["Fruit", "Bicycles", "Books", "Tickets"], 0, "reading-fruit", "The passage says the friends bring fruit.", ["invite", "picnic"], ["object_pronouns"], ["UNSTATED_DETAIL", "UNSTATED_DETAIL", "UNSTATED_DETAIL"]),
        relation: task("Why will the group eat indoors?", ["They dislike the park.", "Rain is expected.", "Mira is tired.", "The friends arrive late."], 1, "reading-rain", "The expected rain causes the location change.", ["plan", "tomorrow"], ["cause_effect"], ["UNSTATED_ATTITUDE", "UNSTATED_REASON", "UNSTATED_REASON"]),
        vocabulary: task("What does ‘planning’ mean here?", ["Deciding what to do", "Forgetting an event", "Finishing a meal", "Canceling all games"], 0, "reading-plan", "They are deciding the details of tomorrow's activity.", ["plan", "picnic"], ["present_progressive"], ["OPPOSITE_MEANING_CONFUSION", "ACTIVITY_MEANING_CONFUSION", "OVERGENERALIZATION"]),
      },
      transfer: task("Choose the best word. Our class will have a reading ___ in the school garden.", ["picnic", "tomorrow", "invite", "plan"], 0, "reading-picnic-transfer", "A reading picnic combines outdoor eating and reading.", ["picnic"], ["future_will"], ["TIME_NOUN_CONFUSION", "VERB_NOUN_CONFUSION", "GENERAL_NOUN_CONFUSION"]),
      independent: task("Choose the correct future plan.", ["We are going to visit them tomorrow.", "We going to visit they tomorrow.", "We are going visit them tomorrow.", "We are going to visited them tomorrow."], 0, "weekend-independent", "The correct form is are going to visit them.", ["plan", "invite", "tomorrow", "picnic"], ["future_be_going_to", "object_pronouns"], ["AUXILIARY_AND_PRONOUN_ERROR", "INFINITIVE_MARKER_ERROR", "TENSE_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-05", title: "Shopping", theme: "shopping choices", contextDomain: "shopping",
      targetVocabularyIds: ["price", "change", "enough", "receipt"], targetGrammarIds: ["countable_uncountable", "object_pronouns"],
      reviewVocabularyIds: ["plan", "tomorrow"], reviewGrammarIds: ["future_be_going_to"], prerequisiteCycleIds: ["EN-L2-CYCLE-04"], nextCycleIds: ["EN-L2-CYCLE-06"],
      vocabulary: [
        vocab("price", "Choose the word for the amount of money something costs.", "The ___ of this notebook is three dollars.", "price-meaning", "A price tells how much money an item costs.", ["change", "enough", "receipt"]),
        vocab("change", "", "I paid ten dollars and received two dollars in ___.", "change-context", "Change is money returned after paying too much."),
        vocab("enough", "", "I have ___ money to buy the pencils.", "enough-context", "Enough means as much as needed."),
        vocab("receipt", "", "The cashier gave me a ___ showing what I bought.", "receipt-context", "A receipt is a written record of a purchase."),
      ],
      grammar: task("How ___ apples do you need?", ["much", "many", "any", "some"], 1, "many-apples", "Use many with a plural countable noun.", ["price", "enough"], ["countable_uncountable"], ["COUNTABILITY_ERROR", "QUESTION_FORM_ERROR", "QUANTIFIER_ERROR"]),
      sentence: task("Choose the correct sentence.", ["The cashier gave I a receipt.", "The cashier gave me a receipt.", "The cashier gave my a receipt.", "The cashier gives me a receipt yesterday."], 1, "receipt-pronoun", "Me is the object pronoun after gave.", ["receipt", "change"], ["object_pronouns", "simple_past"], ["PRONOUN_CASE_ERROR", "PRONOUN_CASE_ERROR", "TENSE_TIME_CONFLICT"]),
      expansion: task("Choose the sentence that adds a price to ‘I bought a scarf.’", ["I bought a soft scarf.", "I bought a scarf for twelve dollars.", "I bought a scarf yesterday.", "I bought a scarf for my sister."], 1, "scarf-price", "For twelve dollars adds the price.", ["price", "receipt"], ["for_price_phrase"], ["DESCRIPTION_NOT_PRICE", "TIME_NOT_PRICE", "PERSON_NOT_PRICE"]),
      connection: task("Choose the best word. I did not have enough cash, ___ I used my card.", ["so", "although", "before", "unless"], 0, "cash-result", "So introduces the result of not having enough cash.", ["enough", "price"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "Nora wants a gift for her brother. A blue cap costs fifteen dollars, but she has only twelve. She chooses a less expensive book and has enough money for it. The cashier gives her a receipt and some change.",
      reading: {
        detail: task("What does Nora buy?", ["A cap", "A book", "A scarf", "A card"], 1, "reading-item", "She chooses the less expensive book.", ["price", "receipt"], ["simple_present"], ["REJECTED_OPTION_CONFUSION", "UNSTATED_DETAIL", "PAYMENT_METHOD_CONFUSION"]),
        relation: task("Why does Nora not buy the cap?", ["It is the wrong color.", "She does not have enough money.", "Her brother owns it already.", "The store has no receipts."], 1, "reading-money", "She has twelve dollars, but the cap costs fifteen.", ["enough", "price"], ["cause_effect"], ["UNSTATED_REASON", "UNSTATED_REASON", "DETAIL_CONFUSION"]),
        vocabulary: task("What does ‘change’ mean in the passage?", ["A different gift", "Money returned after payment", "A lower price tag", "A store receipt"], 1, "reading-change", "The cashier returns money after Nora pays.", ["change", "receipt"], ["multiple_meaning"], ["MULTIPLE_MEANING_CONFUSION", "RELATED_MONEY_CONFUSION", "RELATED_OBJECT_CONFUSION"]),
      },
      transfer: task("Choose the best word. Keep the ___ in case you return the shoes.", ["change", "price", "enough", "receipt"], 3, "return-transfer", "A receipt proves that the shoes were purchased.", ["receipt"], ["imperative"], ["MONEY_FORM_CONFUSION", "COST_RECORD_CONFUSION", "ADVERB_NOUN_ERROR"]),
      independent: task("Choose the correct shopping sentence.", ["I have enough money, and the cashier gives me a receipt.", "I have many money, and the cashier gives I a receipt.", "I has enough money, and the cashier give me receipt.", "I have enough moneys, and cashier gave my a receipt."], 0, "shopping-independent", "Money is uncountable, and me is the object pronoun.", ["price", "change", "enough", "receipt"], ["countable_uncountable", "object_pronouns"], ["COUNTABILITY_AND_PRONOUN_ERROR", "AGREEMENT_AND_ARTICLE_ERROR", "COUNTABILITY_AND_PRONOUN_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-06", title: "Transportation", theme: "getting around", contextDomain: "transportation",
      targetVocabularyIds: ["platform", "passenger", "route", "delay"], targetGrammarIds: ["simple_past", "time_prepositions"],
      reviewVocabularyIds: ["price", "receipt"], reviewGrammarIds: ["object_pronouns"], prerequisiteCycleIds: ["EN-L2-CYCLE-05"], nextCycleIds: ["EN-L2-CYCLE-07"],
      vocabulary: [
        vocab("platform", "Choose the word for the area where people wait for a train.", "Our train leaves from ___ six.", "platform-meaning", "A platform is a raised waiting area beside train tracks.", ["passenger", "route", "delay"]),
        vocab("passenger", "", "Each ___ showed a ticket to the driver.", "passenger-context", "A passenger travels in a vehicle without driving it."),
        vocab("route", "", "This bus ___ goes through the town center.", "route-context", "A route is the path followed on a journey."),
        vocab("delay", "", "Heavy snow caused a thirty-minute ___.", "delay-context", "A delay makes something happen later than planned."),
      ],
      grammar: task("The bus ___ ten minutes late yesterday.", ["arrive", "arrives", "arrived", "arriving"], 2, "bus-past", "Yesterday requires the simple past arrived.", ["delay", "route"], ["simple_past"], ["TENSE_ERROR", "TENSE_ERROR", "VERB_FORM_ERROR"]),
      sentence: task("Choose the correct sentence.", ["We waited on the platform for twenty minutes.", "We wait on the platform yesterday.", "We were waited on the platform.", "We waiting on the platform for twenty minutes."], 0, "waited-platform", "Waited is the correct simple past form.", ["platform", "delay"], ["simple_past", "place_prepositions"], ["TENSE_TIME_CONFLICT", "PASSIVE_FORM_ERROR", "VERB_FORM_ERROR"]),
      expansion: task("Choose the sentence that adds a duration to ‘The passengers waited.’", ["The tired passengers waited.", "The passengers waited for half an hour.", "The passengers waited at the station.", "The passengers waited quietly."], 1, "wait-duration", "For half an hour adds duration.", ["passenger", "delay"], ["for_duration"], ["DESCRIPTION_NOT_DURATION", "PLACE_NOT_DURATION", "MANNER_NOT_DURATION"]),
      connection: task("Choose the best word. Our usual route was closed, ___ the driver used another road.", ["so", "although", "before", "unless"], 0, "route-result", "So introduces the result of the road closure.", ["route", "delay"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "Leo waited on platform six for the 8:10 train. An announcement reported a delay because a tree had fallen near the tracks. The passengers took a bus on a different route. They arrived forty minutes late.",
      reading: {
        detail: task("Where did Leo wait?", ["On platform six", "At a bakery", "Inside a bank", "Across from a park"], 0, "reading-platform", "The first sentence names platform six.", ["platform", "passenger"], ["simple_past"], ["PREVIOUS_CONTEXT_INTRUSION", "PREVIOUS_CONTEXT_INTRUSION", "PREVIOUS_CONTEXT_INTRUSION"]),
        relation: task("What caused the delay?", ["A missing ticket", "A fallen tree", "A closed bakery", "A late passenger"], 1, "reading-cause", "A tree had fallen near the tracks.", ["delay", "route"], ["cause_effect"], ["UNSTATED_CAUSE", "UNSTATED_CAUSE", "UNSTATED_CAUSE"]),
        vocabulary: task("What is a ‘route’ in the passage?", ["A travel path", "A ticket price", "A waiting person", "A train platform"], 0, "reading-route", "It is the path the replacement bus followed.", ["route", "passenger"], ["context_meaning"], ["MONEY_MEANING_CONFUSION", "PERSON_MEANING_CONFUSION", "PLACE_MEANING_CONFUSION"]),
      },
      transfer: task("Choose the best word. The flight left two hours late because of a ___.", ["platform", "route", "passenger", "delay"], 3, "flight-transfer", "A delay makes a departure happen late.", ["delay"], ["article_a"], ["TRANSPORT_PLACE_CONFUSION", "PATH_EVENT_CONFUSION", "PERSON_EVENT_CONFUSION"]),
      independent: task("Choose the correct past-tense sentence.", ["The passengers took a different route yesterday.", "The passengers take a different route yesterday.", "The passengers taken a different route yesterday.", "The passengers were take a different route yesterday."], 0, "transport-independent", "Took is the simple past of take.", ["platform", "passenger", "route", "delay"], ["simple_past"], ["TENSE_TIME_CONFLICT", "PARTICIPLE_WITHOUT_AUXILIARY", "AUXILIARY_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-07", title: "Seasons and Weather", theme: "seasonal weather", contextDomain: "weather",
      targetVocabularyIds: ["forecast", "degree", "storm", "mild"], targetGrammarIds: ["future_will", "comparison_basic"],
      reviewVocabularyIds: ["route", "delay"], reviewGrammarIds: ["simple_past"], prerequisiteCycleIds: ["EN-L2-CYCLE-06"], nextCycleIds: ["EN-L2-CYCLE-08"],
      vocabulary: [
        vocab("forecast", "Choose the word for a report about future weather.", "The morning ___ says it will rain.", "forecast-meaning", "A forecast predicts future weather.", ["degree", "storm", "mild"]),
        vocab("degree", "", "The temperature rose by one ___.", "degree-context", "A degree is a unit used to measure temperature."),
        vocab("storm", "", "The strong ___ brought wind and heavy rain.", "storm-context", "A storm is a period of violent weather."),
        vocab("mild", "", "The winter was ___, with no very cold days.", "mild-context", "Mild weather is neither very hot nor very cold."),
      ],
      grammar: task("Tomorrow ___ warmer than today.", ["is", "was", "will be", "will"], 2, "will-be-weather", "A future description needs will be.", ["forecast", "degree"], ["future_will"], ["PRESENT_FOR_FUTURE_ERROR", "TENSE_ERROR", "MISSING_COMPLEMENT_VERB"]),
      sentence: task("Choose the correct comparison.", ["Spring is mild than winter.", "Spring is milder than winter.", "Spring is more mildest than winter.", "Spring milder than winter is."], 1, "milder-than", "The comparative of mild is milder.", ["mild", "storm"], ["comparison_basic"], ["COMPARATIVE_FORM_ERROR", "DOUBLE_COMPARATIVE_ERROR", "WORD_ORDER_ERROR"]),
      expansion: task("Choose the sentence that adds a forecast to ‘The storm is moving east.’", ["The large storm is moving east.", "The storm will reach the coast tonight.", "The storm is moving east quickly.", "The storm is moving east over the sea."], 1, "storm-forecast", "Will reach the coast tonight states a future forecast.", ["storm", "forecast"], ["future_will"], ["DESCRIPTION_NOT_FORECAST", "MANNER_NOT_FORECAST", "PLACE_NOT_FORECAST"]),
      connection: task("Choose the best word. The forecast warned of a storm, ___ the school canceled the game.", ["so", "although", "before", "unless"], 0, "forecast-result", "So connects the warning with the cancellation.", ["forecast", "storm"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "The forecast says Saturday will be mild in the morning. The temperature will reach eighteen degrees. A storm may arrive in the evening, so the hiking club will return before five. Sunday will be cooler and dry.",
      reading: {
        detail: task("What temperature is expected on Saturday?", ["Eight degrees", "Eighteen degrees", "Twenty-eight degrees", "Five degrees"], 1, "reading-degree", "The passage gives eighteen degrees.", ["degree", "forecast"], ["future_will"], ["NUMBER_DETAIL_CONFUSION", "NUMBER_DETAIL_CONFUSION", "TIME_NUMBER_CONFUSION"]),
        relation: task("Why will the hiking club return before five?", ["Sunday will be dry.", "A storm may arrive.", "The morning will be mild.", "The route is too short."], 1, "reading-storm", "The possible evening storm changes the plan.", ["storm", "forecast"], ["cause_effect"], ["NEXT_DAY_DETAIL_CONFUSION", "BACKGROUND_DETAIL_CONFUSION", "UNSTATED_REASON"]),
        vocabulary: task("What does ‘mild’ mean here?", ["Extremely cold", "Comfortably moderate", "Very windy", "Completely dry"], 1, "reading-mild", "Mild describes comfortable, moderate weather.", ["mild", "degree"], ["context_meaning"], ["OPPOSITE_MEANING_CONFUSION", "RELATED_WEATHER_CONFUSION", "RELATED_WEATHER_CONFUSION"]),
      },
      transfer: task("Choose the best word. The economic ___ predicts slower growth next year.", ["forecast", "degree", "storm", "mild"], 0, "economic-transfer", "Forecast also means a prediction outside weather.", ["forecast"], ["multiple_meaning"], ["MEASUREMENT_CONTEXT_ERROR", "WEATHER_ONLY_CONFUSION", "ADJECTIVE_NOUN_ERROR"]),
      independent: task("Choose the correct forecast sentence.", ["Tomorrow will be milder than today.", "Tomorrow will milder than today.", "Tomorrow will be mildest than today.", "Tomorrow is be milder than today."], 0, "weather-independent", "Will be is followed by the comparative adjective milder.", ["forecast", "degree", "storm", "mild"], ["future_will", "comparison_basic"], ["MISSING_COMPLEMENT_VERB", "SUPERLATIVE_COMPARISON_ERROR", "DOUBLE_AUXILIARY_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-08", title: "Meals and Cooking", theme: "cooking a meal", contextDomain: "food",
      targetVocabularyIds: ["ingredient", "recipe", "boil", "slice"], targetGrammarIds: ["imperatives", "countable_uncountable"],
      reviewVocabularyIds: ["forecast", "mild"], reviewGrammarIds: ["future_will"], prerequisiteCycleIds: ["EN-L2-CYCLE-07"], nextCycleIds: ["EN-L2-CYCLE-09"],
      vocabulary: [
        vocab("ingredient", "Choose the word for one food item used to make a dish.", "Egg is the main ___ in this omelet.", "ingredient-meaning", "An ingredient is one part of a recipe.", ["recipe", "boil", "slice"]),
        vocab("recipe", "", "The ___ explains how to make the soup.", "recipe-context", "A recipe gives ingredients and cooking instructions."),
        vocab("boil", "", "Heat the water until it begins to ___.", "boil-context", "Boil means to heat a liquid until it bubbles."),
        vocab("slice", "", "Please ___ the tomato into thin pieces.", "slice-context", "Slice means to cut something into thin flat pieces."),
      ],
      grammar: task("___ the onions before you add them to the pan.", ["Slices", "Sliced", "Slice", "Slicing"], 2, "imperative-slice", "An imperative begins with the base verb.", ["slice", "ingredient"], ["imperatives"], ["SUBJECT_VERB_FORM_ERROR", "TENSE_ERROR", "GERUND_FORM_ERROR"]),
      sentence: task("Choose the correct cooking instruction.", ["Boils two cups of water.", "Boil two cups of water.", "To boil two cup of water.", "Boiling two cups waters."], 1, "boil-instruction", "Use the base verb for an instruction and cups with a plural count noun.", ["boil", "recipe"], ["imperatives", "countable_uncountable"], ["IMPERATIVE_FORM_ERROR", "NUMBER_AGREEMENT_ERROR", "COUNTABILITY_ERROR"]),
      expansion: task("Choose the sentence that adds an order to ‘Add the vegetables.’", ["Add the fresh vegetables.", "Next, add the vegetables to the pot.", "Add the vegetables carefully.", "Add the vegetables with a spoon."], 1, "vegetables-order", "Next marks the order of the instruction.", ["ingredient", "recipe"], ["sequence_words"], ["DESCRIPTION_NOT_SEQUENCE", "MANNER_NOT_SEQUENCE", "TOOL_NOT_SEQUENCE"]),
      connection: task("Choose the best word. The water is boiling, ___ add the noodles now.", ["so", "although", "unless", "before"], 0, "boil-result", "So connects the ready water with the next action.", ["boil", "recipe"], ["cause_effect", "imperatives"], ["CONTRAST_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR"]),
      passage: "Omar follows a recipe for vegetable soup. First, he slices two carrots and an onion. Next, he boils water and adds every ingredient. He cooks the soup for twenty minutes before serving it.",
      reading: {
        detail: task("Which vegetables does Omar slice?", ["Carrots and an onion", "Potatoes and beans", "Tomatoes and corn", "Peppers and cabbage"], 0, "reading-vegetables", "The passage names carrots and an onion.", ["slice", "ingredient"], ["simple_present"], ["UNSTATED_DETAIL", "UNSTATED_DETAIL", "UNSTATED_DETAIL"]),
        relation: task("What does Omar do after slicing the vegetables?", ["He serves the soup.", "He boils water.", "He reads a weather forecast.", "He buys a receipt."], 1, "reading-sequence", "Next, he boils water.", ["boil", "recipe"], ["sequence_words"], ["LATER_ACTION_CONFUSION", "PREVIOUS_CONTEXT_INTRUSION", "PREVIOUS_CONTEXT_INTRUSION"]),
        vocabulary: task("What is a ‘recipe’?", ["A list of cooking instructions", "A kind of vegetable", "A cooking temperature", "A meal receipt"], 0, "reading-recipe", "The recipe guides Omar through the cooking steps.", ["recipe", "ingredient"], ["context_meaning"], ["FOOD_ITEM_CONFUSION", "MEASUREMENT_CONFUSION", "SHOPPING_OBJECT_CONFUSION"]),
      },
      transfer: task("Choose the best word. The craft guide says to ___ the paper into narrow strips.", ["boil", "ingredient", "slice", "recipe"], 2, "paper-transfer", "Slice can describe cutting nonfood material into thin pieces.", ["slice"], ["multiple_meaning"], ["HEATING_ACTION_CONFUSION", "NOUN_VERB_ERROR", "INSTRUCTION_NOUN_CONFUSION"]),
      independent: task("Choose the correct instruction.", ["Slice the apples, and then boil the water.", "Slices the apples, and then boiled the water.", "To slice the apples, and then boiling the water.", "Slice the apple, and then boil two waters."], 0, "cooking-independent", "Both imperatives use base verbs, and water is uncountable.", ["ingredient", "recipe", "boil", "slice"], ["imperatives", "countable_uncountable"], ["IMPERATIVE_AND_TENSE_ERROR", "NONFINITE_FORM_ERROR", "COUNTABILITY_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-09", title: "Helping Others", theme: "community help", contextDomain: "community",
      targetVocabularyIds: ["volunteer", "deliver", "neighbor", "support"], targetGrammarIds: ["object_pronouns", "simple_present"],
      reviewVocabularyIds: ["recipe", "slice"], reviewGrammarIds: ["imperatives"], prerequisiteCycleIds: ["EN-L2-CYCLE-08"], nextCycleIds: ["EN-L2-CYCLE-10"],
      vocabulary: [
        vocab("volunteer", "Choose the word for a person who helps without being paid.", "Each ___ works at the food bank on Saturday.", "volunteer-meaning", "A volunteer gives time to help others without pay.", ["deliver", "neighbor", "support"]),
        vocab("deliver", "", "The students ___ meals to older residents.", "deliver-context", "Deliver means to take something to a person or place."),
        vocab("neighbor", "", "Mr. Park lives next door, so he is our ___.", "neighbor-context", "A neighbor is someone who lives near you."),
        vocab("support", "", "Our club will ___ the shelter by collecting blankets.", "support-context", "Support means to help a person, group, or cause."),
      ],
      grammar: task("Mrs. Han needs help, so we visit ___.", ["she", "her", "hers", "herself"], 1, "visit-her", "Use the object pronoun her after visit.", ["neighbor", "support"], ["object_pronouns"], ["PRONOUN_CASE_ERROR", "POSSESSIVE_PRONOUN_ERROR", "REFLEXIVE_PRONOUN_ERROR"]),
      sentence: task("Choose the correct sentence.", ["The volunteers delivers food to them.", "The volunteers deliver food to them.", "The volunteers delivering food to they.", "The volunteers are deliver food to their."], 1, "volunteers-deliver", "A plural subject takes deliver, followed by the object pronoun them.", ["volunteer", "deliver"], ["simple_present", "object_pronouns"], ["SUBJECT_VERB_AGREEMENT", "VERB_AND_PRONOUN_ERROR", "AUXILIARY_AND_PRONOUN_ERROR"]),
      expansion: task("Choose the sentence that adds a beneficiary to ‘We collected books.’", ["We collected old books.", "We collected books for our neighbors.", "We collected books yesterday.", "We carefully collected books."], 1, "books-beneficiary", "For our neighbors tells who benefits.", ["neighbor", "support"], ["for_beneficiary"], ["DESCRIPTION_NOT_BENEFICIARY", "TIME_NOT_BENEFICIARY", "MANNER_NOT_BENEFICIARY"]),
      connection: task("Choose the best word. The shelter needed blankets, ___ our club collected fifty.", ["so", "although", "before", "unless"], 0, "shelter-result", "So introduces the helpful response.", ["support", "volunteer"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "A group of student volunteers visits a community center each Friday. They deliver meals to older neighbors and read letters for them. This week, the center needs warm socks. The students support the center by collecting forty pairs.",
      reading: {
        detail: task("What do the students deliver?", ["Warm socks", "Meals", "Library books", "Train tickets"], 1, "reading-meals", "They deliver meals to older neighbors.", ["deliver", "neighbor"], ["simple_present"], ["LATER_DETAIL_CONFUSION", "UNSTATED_DETAIL", "UNSTATED_DETAIL"]),
        relation: task("How do the students support the center this week?", ["They cook every meal.", "They collect warm socks.", "They build a new room.", "They change the schedule."], 1, "reading-support", "They collect forty pairs of socks.", ["support", "volunteer"], ["means_relation"], ["OVERGENERALIZATION", "UNSTATED_ACTION", "PREVIOUS_CONTEXT_INTRUSION"]),
        vocabulary: task("Who is a ‘volunteer’ in the passage?", ["A student who helps freely", "A neighbor who pays for meals", "A worker who repairs trains", "A teacher who gives homework"], 0, "reading-volunteer", "The students give their time to help the center.", ["volunteer", "support"], ["relative_clause_basic"], ["PAYMENT_MEANING_CONFUSION", "UNRELATED_ROLE", "UNRELATED_ROLE"]),
      },
      transfer: task("Choose the best word. Good evidence can ___ a clear argument.", ["deliver", "neighbor", "volunteer", "support"], 3, "argument-transfer", "Support can mean provide evidence for an idea.", ["support"], ["multiple_meaning"], ["TRANSPORT_ACTION_CONFUSION", "PERSON_VERB_ERROR", "PERSON_VERB_ERROR"]),
      independent: task("Choose the correct sentence about helping.", ["Our neighbors need help, so we support them.", "Our neighbors needs help, so we support they.", "Our neighbor need help, so we supports them.", "Our neighbors are need help, so us support them."], 0, "help-independent", "Plural neighbors takes need, and them is the object form.", ["volunteer", "deliver", "neighbor", "support"], ["simple_present", "object_pronouns"], ["AGREEMENT_AND_PRONOUN_ERROR", "AGREEMENT_ERROR", "AUXILIARY_AND_PRONOUN_ERROR"]),
    },
    {
      cycleId: "EN-L2-CYCLE-10", title: "A Family Trip", theme: "family travel", contextDomain: "travel",
      targetVocabularyIds: ["luggage", "reserve", "guide", "memory"], targetGrammarIds: ["simple_past", "possessives"],
      reviewVocabularyIds: ["volunteer", "support"], reviewGrammarIds: ["object_pronouns"], prerequisiteCycleIds: ["EN-L2-CYCLE-09"], nextCycleIds: ["EN-L3-CYCLE-01"],
      vocabulary: [
        vocab("luggage", "Choose the word for bags and suitcases used on a trip.", "Our ___ was heavy, so we used a cart.", "luggage-meaning", "Luggage is the collection of bags carried while traveling.", ["reserve", "guide", "memory"]),
        vocab("reserve", "", "We will ___ a hotel room before the holiday.", "reserve-context", "Reserve means to arrange for something to be kept for later use."),
        vocab("guide", "", "A local ___ showed us the old castle.", "guide-context", "A guide leads visitors and explains a place."),
        vocab("memory", "", "The family photo is a happy ___ of our trip.", "memory-context", "A memory is something remembered from the past."),
      ],
      grammar: task("My parents ___ a room online last week.", ["reserve", "reserves", "reserved", "reserving"], 2, "reserved-room", "Last week requires the simple past reserved.", ["reserve", "luggage"], ["simple_past"], ["TENSE_ERROR", "TENSE_ERROR", "VERB_FORM_ERROR"]),
      sentence: task("Choose the correct possessive sentence.", ["This is my parents room.", "This is my parent's room.", "This is my parents' room.", "This is mine parents' room."], 2, "parents-possessive", "The plural noun parents takes an apostrophe after s.", ["reserve", "memory"], ["possessives"], ["APOSTROPHE_OMISSION", "SINGULAR_POSSESSIVE_ERROR", "POSSESSIVE_PRONOUN_ERROR"]),
      expansion: task("Choose the sentence that adds a travel companion to ‘I carried the luggage.’", ["I carried the heavy luggage.", "I carried the luggage with my brother.", "I carried the luggage carefully.", "I carried the luggage yesterday."], 1, "luggage-companion", "With my brother adds a companion.", ["luggage", "guide"], ["with_phrase"], ["DESCRIPTION_NOT_COMPANION", "MANNER_NOT_COMPANION", "TIME_NOT_COMPANION"]),
      connection: task("Choose the best word. We reserved our tickets early, ___ we found seats together.", ["so", "although", "before", "unless"], 0, "reserve-result", "So introduces the result of reserving early.", ["reserve", "memory"], ["cause_effect"], ["CONTRAST_CONNECTOR_ERROR", "TIME_CONNECTOR_ERROR", "CONDITION_CONNECTOR_ERROR"]),
      passage: "Last month, Ara's family traveled to a coastal town. They reserved a small hotel and carried their luggage from the station. A guide took them to a lighthouse and explained its history. Ara's favorite memory is watching the sunset with her parents.",
      reading: {
        detail: task("Where did the guide take the family?", ["To a lighthouse", "To a bakery", "To a school", "To a forest camp"], 0, "reading-lighthouse", "The guide took them to a lighthouse.", ["guide", "memory"], ["simple_past"], ["UNSTATED_PLACE", "UNSTATED_PLACE", "UNSTATED_PLACE"]),
        relation: task("Which event is Ara's favorite memory?", ["Carrying the luggage", "Watching the sunset", "Reserving the hotel", "Leaving the station"], 1, "reading-memory", "The final sentence identifies watching the sunset.", ["memory", "luggage"], ["reference_words"], ["EARLIER_DETAIL_CONFUSION", "EARLIER_DETAIL_CONFUSION", "EARLIER_DETAIL_CONFUSION"]),
        vocabulary: task("What did the ‘guide’ do?", ["Led the family and explained history", "Reserved the family's hotel", "Carried every suitcase", "Sold food at the station"], 0, "reading-guide", "The guide led the visit and explained the place.", ["guide", "reserve"], ["simple_past"], ["ROLE_CONFUSION", "OVERGENERALIZATION", "UNSTATED_ROLE"]),
      },
      transfer: task("Choose the best word. The museum app can ___ a time slot for each visitor.", ["memory", "guide", "reserve", "luggage"], 2, "app-transfer", "The app can reserve or hold a time slot.", ["reserve"], ["can_ability"], ["NOUN_VERB_ERROR", "ROLE_VERB_CONFUSION", "TRAVEL_OBJECT_CONFUSION"]),
      independent: task("Choose the correct sentence about the trip.", ["My parents reserved their room, and our guide met us.", "My parents reserves there room, and our guide meet us.", "My parents reserved they room, and our guide meeting us.", "My parent's reserve their room, and ours guide met us."], 0, "trip-independent", "The past verbs and possessive forms are all correct.", ["luggage", "reserve", "guide", "memory"], ["simple_past", "possessives"], ["TENSE_AND_POSSESSIVE_ERROR", "PRONOUN_AND_VERB_ERROR", "POSSESSIVE_AND_TENSE_ERROR"]),
    },
  ];

  const cycles = lessons.map((lesson) => ({ ...lesson, entries: builder.buildLessonEntries(lesson), estimatedDuration: 14 }));
  return builder.buildLevel({ version: "english-level2-quality-v1", level: 2, cycles });
});
