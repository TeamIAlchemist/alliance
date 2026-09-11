// Instrument All(IA)nce - version faisant foi (AllIAnce webapp finale).
// 38 items notes + 7 ouverts. A3 et H1 retires ; section Kegan (KG1-KG6) ajoutee.
// Bilingue FR/EN pour tous les items, Kegan inclus.
export type Item = {
  code: string; sec: string; fr: string; en: string;
  reverse?: boolean; open?: boolean;
  comp?: 'crea'|'cur'|'col'|'cri'|'com'; role?: 'vous'|'equipe'|'ia';
  kegan?: 'socialized'|'self-authoring'|'self-transforming';
};
export const ITEMS: Item[] = [
  {
    "code": "A1",
    "sec": "reddition",
    "fr": "Quand l'IA me donne une réponse formulée avec assurance, je l'accepte sans la revérifier.",
    "en": "When AI gives me a confidently worded answer, I accept it without double-checking it.",
    "reverse": false,
    "open": false
  },
  {
    "code": "A2",
    "sec": "reddition",
    "fr": "Je me sens plus confiant(e) dans mon travail dès que l'IA le valide, même sans avoir vérifié son raisonnement.",
    "en": "I feel more confident in my work as soon as AI validates it, even without checking its reasoning.",
    "reverse": false,
    "open": false
  },
  {
    "code": "A4",
    "sec": "reddition",
    "fr": "Quand mon intuition et la réponse de l'IA se contredisent, je fais confiance à l'IA par défaut.",
    "en": "When my intuition and the AI's answer contradict each other, I trust the AI by default.",
    "reverse": false,
    "open": false
  },
  {
    "code": "A6",
    "sec": "reddition",
    "fr": "Avant d'accepter une conclusion produite par l'IA sur un sujet important, je cherche activement un contre-argument ou je la vérifie de façon indépendante.",
    "en": "Before accepting an AI conclusion on an important matter, I actively look for a counter-argument or verify it independently.",
    "reverse": true,
    "open": false
  },
  {
    "code": "A7",
    "sec": "reddition",
    "fr": "Je peux expliquer, étape par étape et sans l'aide de l'IA, comment j'ai obtenu mon dernier document important produit avec son appui.",
    "en": "I can explain, step by step and without AI, how I produced my last important document made with its support.",
    "reverse": true,
    "open": false
  },
  {
    "code": "B1",
    "sec": "resistance",
    "fr": "J'ai tendance à refaire un travail à la main même quand un résultat assisté par l'IA serait fiable.",
    "en": "I tend to redo work by hand even when an AI-assisted result would be reliable.",
    "reverse": false,
    "open": false
  },
  {
    "code": "B2",
    "sec": "resistance",
    "fr": "Je rejette les suggestions de l'IA par principe, sans vraiment prendre le temps de les évaluer.",
    "en": "I dismiss AI suggestions on principle, without really evaluating them.",
    "reverse": false,
    "open": false
  },
  {
    "code": "B3",
    "sec": "resistance",
    "fr": "J'ai le sentiment que m'appuyer davantage sur l'IA diminuerait mon expertise ou ma valeur aux yeux de l'équipe.",
    "en": "I feel that relying more on AI would diminish my expertise or my value in the team's eyes.",
    "reverse": false,
    "open": false
  },
  {
    "code": "B4",
    "sec": "resistance",
    "fr": "J'ai du mal à reconnaître quand une réponse produite par l'IA est réellement meilleure que ma première intuition.",
    "en": "I find it hard to acknowledge when an AI answer is genuinely better than my first instinct.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I1",
    "sec": "hsd",
    "fr": "Il est clair, dans mon équipe, quels usages de l'IA sont légitimes et lesquels doivent rester purement humains.",
    "en": "It is clear in my team which uses of AI are legitimate and which must remain purely human.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I2",
    "sec": "hsd",
    "fr": "Les processus d'utilisation de l'IA dans notre équipe sont clairs et définis.",
    "en": "The processes for using AI in our team are clear and defined.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I3",
    "sec": "hsd",
    "fr": "Notre équipe a un espace dédié et régulier pour discuter de la façon dont nous utilisons l'IA dans notre travail.",
    "en": "Our team has a dedicated, recurring space to discuss how we use AI in our work.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I4",
    "sec": "hsd",
    "fr": "Nous avons l'habitude de challenger les réponses de l'IA afin d'ouvrir les perspectives et d'accueillir les divergences.",
    "en": "We are used to challenging AI's answers to open up perspectives and welcome divergence.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I5",
    "sec": "hsd",
    "fr": "Il est facile, dans mon équipe, d'exprimer un désaccord avec une recommandation produite par l'IA.",
    "en": "It is easy, in my team, to voice disagreement with an AI-produced recommendation.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I6",
    "sec": "hsd",
    "fr": "Face à une recommandation de l'IA, nous nous demandons aussi si elle est cohérente avec les valeurs et les normes sociétales en vigueur (éthique, biais, impact), pas seulement si elle est techniquement exacte.",
    "en": "Facing an AI recommendation, we also ask whether it aligns with prevailing values and societal norms (ethics, bias, impact), not just technical accuracy.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I7",
    "sec": "hsd",
    "fr": "Après un usage important de l'IA, nous prenons le temps de débriefer collectivement notre raisonnement.",
    "en": "After significant AI use, we take time to debrief our reasoning together.",
    "reverse": false,
    "open": false
  },
  {
    "code": "I8",
    "sec": "hsd",
    "fr": "En tant qu'équipe, nous apprenons collectivement de nos erreurs passées avec l'IA plutôt que de les répéter.",
    "en": "As a team, we collectively learn from our past mistakes with AI rather than repeating them.",
    "reverse": false,
    "open": false
  },
  {
    "code": "K1",
    "sec": "comp",
    "fr": "Face à un problème sans solution évidente, je génère spontanément plusieurs pistes originales avant d'en retenir une.",
    "en": "Facing a problem with no obvious solution, I spontaneously generate several original avenues.",
    "comp": "crea",
    "role": "vous",
    "reverse": false,
    "open": false
  },
  {
    "code": "K2",
    "sec": "comp",
    "fr": "En tant qu'équipe, nous avons l'habitude de nous réunir régulièrement pour transformer des idées, des informations ou des tendances du marché en solutions neuves, plutôt que de recycler ce qui a déjà marché.",
    "en": "As a team, we regularly turn ideas or trends into new solutions rather than recycling what worked.",
    "comp": "crea",
    "role": "equipe",
    "reverse": false,
    "open": false
  },
  {
    "code": "K3",
    "sec": "comp",
    "fr": "Quand je compare mes idées à celles que l'IA produit, je trouve souvent l'IA plus inventive que moi.",
    "en": "Comparing my ideas with AI's, I often find AI more inventive than me.",
    "comp": "crea",
    "role": "ia",
    "reverse": false,
    "open": false
  },
  {
    "code": "K4",
    "sec": "comp",
    "fr": "Depuis que l'IA fait partie de votre quotidien, qu'est-ce qui a changé dans votre façon de créer et d'oser des idées neuves ?",
    "en": "Since AI became part of your daily life, what has changed in how you create and dare new ideas?",
    "open": true,
    "reverse": false
  },
  {
    "code": "K5",
    "sec": "comp",
    "fr": "Quand un sujet dépasse ce que mon travail exige strictement, j'ai envie d'aller creuser quand même.",
    "en": "When a topic goes beyond what my job strictly requires, I still want to dig into it.",
    "comp": "cur",
    "role": "vous",
    "reverse": false,
    "open": false
  },
  {
    "code": "K6",
    "sec": "comp",
    "fr": "Dans mon équipe, poser une question naïve ou explorer une piste incertaine est vu comme une force, pas comme une perte de temps.",
    "en": "In my team, asking a naive question or exploring an uncertain lead is seen as a strength.",
    "comp": "cur",
    "role": "equipe",
    "reverse": false,
    "open": false
  },
  {
    "code": "K7",
    "sec": "comp",
    "fr": "J'ai le sentiment que l'IA explore un sujet plus largement et pose de meilleures questions que moi.",
    "en": "I feel AI explores a topic more broadly and asks better questions than I do.",
    "comp": "cur",
    "role": "ia",
    "reverse": false,
    "open": false
  },
  {
    "code": "K8",
    "sec": "comp",
    "fr": "Depuis que l'IA a réponse à tout et propose même des questions, quelles questions vous posez-vous désormais ?",
    "en": "Now that AI has an answer for everything and even suggests questions, what questions do you now ask yourself?",
    "open": true,
    "reverse": false
  },
  {
    "code": "K9",
    "sec": "comp",
    "fr": "Dans un travail commun, je m'appuie activement sur les compétences des autres plutôt que d'avancer seul dans mon coin.",
    "en": "In shared work, I actively draw on others' skills rather than going it alone.",
    "comp": "col",
    "role": "vous",
    "reverse": false,
    "open": false
  },
  {
    "code": "K10",
    "sec": "comp",
    "fr": "Sur les dossiers qui le nécessitent, mon équipe cherche activement la contribution de chacun plutôt que d'imposer la manière d'une seule personne.",
    "en": "On matters that call for it, my team actively seeks everyone's contribution.",
    "comp": "col",
    "role": "equipe",
    "reverse": false,
    "open": false
  },
  {
    "code": "K11",
    "sec": "comp",
    "fr": "Quand un travail devient difficile, j'ai tendance à préférer avancer avec l'IA plutôt qu'avec mes collègues.",
    "en": "When work gets hard, I tend to prefer moving forward with AI rather than with my colleagues.",
    "comp": "col",
    "role": "ia",
    "reverse": false,
    "open": false
  },
  {
    "code": "K12",
    "sec": "comp",
    "fr": "Depuis l'arrivée de l'IA, qu'est-ce qui a changé dans votre façon de coopérer avec vos collègues ?",
    "en": "Since AI arrived, what has changed in how you cooperate with your colleagues?",
    "open": true,
    "reverse": false
  },
  {
    "code": "K13",
    "sec": "comp",
    "fr": "Devant une affirmation présentée comme vraie, je cherche d'instinct sur quoi elle repose avant d'y adhérer.",
    "en": "Faced with a claim presented as true, I instinctively look for what it rests on.",
    "comp": "cri",
    "role": "vous",
    "reverse": false,
    "open": false
  },
  {
    "code": "K14",
    "sec": "comp",
    "fr": "Dans mon équipe, on challenge les idées et les sources au quotidien, y compris celles qui nous arrangent.",
    "en": "In my team, we challenge ideas and sources daily, including the ones that suit us.",
    "comp": "cri",
    "role": "equipe",
    "reverse": false,
    "open": false
  },
  {
    "code": "K15",
    "sec": "comp",
    "fr": "Je trouve souvent le raisonnement de l'IA plus rigoureux et mieux argumenté que le mien.",
    "en": "I often find AI's reasoning more rigorous and better argued than my own.",
    "comp": "cri",
    "role": "ia",
    "reverse": false,
    "open": false
  },
  {
    "code": "K16",
    "sec": "comp",
    "fr": "Depuis que l'IA formule des raisonnements à votre place, qu'est-ce qui a changé dans votre propre exercice du doute et de la vérification ?",
    "en": "Since AI produces reasoning in your place, what has changed in your own practice of doubt and verification?",
    "open": true,
    "reverse": false
  },
  {
    "code": "K17",
    "sec": "comp",
    "fr": "Je sais adapter ma façon de m'exprimer pour qu'un interlocuteur très différent de moi comprenne réellement mon message.",
    "en": "I can adapt how I express myself so a very different person genuinely understands me.",
    "comp": "com",
    "role": "vous",
    "reverse": false,
    "open": false
  },
  {
    "code": "K18",
    "sec": "comp",
    "fr": "Dans notre équipe, on peut parler ouvertement, aborder des sujets sensibles ou challenger une idée, échanger les informations librement.",
    "en": "In our team, we can speak openly, raise sensitive topics and exchange freely.",
    "comp": "com",
    "role": "equipe",
    "reverse": false,
    "open": false
  },
  {
    "code": "K19",
    "sec": "comp",
    "fr": "Je trouve souvent que l'IA formule mes idées plus clairement que je ne le ferais moi-même.",
    "en": "I often find AI phrases my ideas more clearly than I would myself.",
    "comp": "com",
    "role": "ia",
    "reverse": false,
    "open": false
  },
  {
    "code": "K20",
    "sec": "comp",
    "fr": "Depuis que l'IA rédige et reformule pour vous, qu'est-ce qui a changé dans votre propre voix et dans la façon dont vous vous faites comprendre ?",
    "en": "Since AI writes and rephrases for you, what has changed in your own voice and how you make yourself understood?",
    "open": true,
    "reverse": false
  },
  {
    "code": "KG1",
    "sec": "kegan",
    "fr": "Face à l'IA, je m'aligne surtout sur ce que font les autres ou ce qui est attendu dans mon équipe.",
    "en": "When it comes to AI, I mostly align with what others do or what is expected in my team.",
    "reverse": false,
    "open": false,
    "kegan": "socialized"
  },
  {
    "code": "KG2",
    "sec": "kegan",
    "fr": "Je serais mal à l'aise d'utiliser l'IA autrement que la manière implicitement admise dans mon groupe.",
    "en": "I would feel uncomfortable using AI in a way that differs from what is implicitly accepted in my group.",
    "reverse": false,
    "open": false,
    "kegan": "socialized"
  },
  {
    "code": "KG3",
    "sec": "kegan",
    "fr": "J'ai mes propres critères pour décider quand faire confiance à l'IA et quand m'en écarter, indépendamment du groupe.",
    "en": "I have my own criteria for deciding when to trust AI and when to step back from it, independently of the group.",
    "reverse": false,
    "open": false,
    "kegan": "self-authoring"
  },
  {
    "code": "KG4",
    "sec": "kegan",
    "fr": "Je peux défendre, sur l'IA, une position différente de celle de mon équipe si mes valeurs le justifient.",
    "en": "I can defend a position on AI that differs from my team's when my values justify it.",
    "reverse": false,
    "open": false,
    "kegan": "self-authoring"
  },
  {
    "code": "KG5",
    "sec": "kegan",
    "fr": "Je repère les limites de ma propre façon de voir l'IA et je cherche activement ce qui pourrait la remettre en cause.",
    "en": "I notice the limits of my own way of seeing AI and actively seek out what might challenge it.",
    "reverse": false,
    "open": false,
    "kegan": "self-transforming"
  },
  {
    "code": "KG6",
    "sec": "kegan",
    "fr": "Je peux tenir en même temps plusieurs regards contradictoires sur l'IA sans avoir besoin de trancher tout de suite.",
    "en": "I can hold several contradictory views on AI at the same time, without needing to resolve them right away.",
    "reverse": false,
    "open": false,
    "kegan": "self-transforming"
  },
  {
    "code": "J4",
    "sec": "synth",
    "fr": "En une phrase, qui voulez-vous que votre équipe devienne face à l'IA dans un an ?",
    "en": "In one sentence, who do you want your team to become in relation to AI a year from now?",
    "open": true,
    "reverse": false
  },
  {
    "code": "L6",
    "sec": "synth",
    "fr": "Quel est le plus petit essai que votre équipe pourrait lancer dès cette semaine pour muscler ce qui s'atrophie ?",
    "en": "What is the smallest experiment your team could launch this week to strengthen what is atrophying?",
    "open": true,
    "reverse": false
  }
];

export const SCORED_COUNT = ITEMS.filter(i => !i.open).length;

export const SECTION_ORDER = ['reddition','resistance','hsd','comp','kegan','synth'];
export const SECTION_LABELS: Record<string, { fr: string; en: string }> = {
  reddition:  { fr: "Votre relation à l'IA",                 en: 'Your relationship with AI' },
  resistance: { fr: "Votre distance à l'IA",                 en: 'Your distance from AI' },
  hsd:        { fr: "La dynamique de votre équipe face à l'IA", en: "Your team's dynamics facing AI" },
  comp:       { fr: 'Compétences',                            en: 'Competencies' },
  kegan:      { fr: 'Regards complémentaires',                en: 'Additional perspectives' },
  synth:      { fr: 'Synthèse — vision & premier pas',        en: 'Synthesis - vision & first step' },
};