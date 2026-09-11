// Grilles de lecture & textes d'analyse All(IA)nce, bilingues FR/EN.
// A=reddition, B=resistance, POL=polarite, C5IND=competences individuelles, C5SIG='IA percue superieure',
// ATR=ecart d'atrophie, HSD=Container/Difference/Exchange, PRES=presencing (inactif : H1 retire), KEGAN=3 stades.
export type Band = 'low' | 'mid' | 'high';
export const EXPL = {
"fr": {
"A": {
"low": {
"t": "Délégation saine : vous gardez l'autorité de jugement — vous vérifiez, reformulez, expliquez votre raisonnement.",
"c": "Rien à corriger : nommez ce pattern gagnant pour le rendre reproductible en équipe (HSD)."
},
"mid": {
"t": "Point de bascule : la confiance monte plus vite que les preuves, la vérification s'espace.",
"c": "Travaillez la juste distance avec l'outil — ni fusion ni rejet (Malarewicz) ; objectivez la relation équipe-IA en réunion (ORSC)."
},
"high": {
"t": "Reddition cognitive : les réponses de l'IA sont adoptées sans réexamen, le jugement délégué sans qu'on s'en aperçoive.",
"c": "Restaurez un rituel de délibération sans IA avant toute décision à fort enjeu (retour au Système 2)."
}
},
"B": {
"low": {
"t": "Refus faible : vous accueillez l'IA sans la sur-croire — c'est une force.",
"c": "À nommer comme un « bien » sur cet axe ; vérifiez que ce n'est pas une simple conformité à une norme d'équipe (Kegan)."
},
"mid": {
"t": "Refus modéré : l'autre pôle de la même polarité que la reddition.",
"c": "L'objectif n'est pas zéro refus, mais savoir quand il relève du jugement plutôt que du réflexe (B. Johnson) ; demandez ce que le refus protège."
},
"high": {
"t": "Refus rigide : l'IA tenue à distance, parfois au prix de la charge de travail et de l'apprentissage.",
"c": "Recadrez le refus comme un choix discutable, pas une identité ; surveillez le balancier — il bascule souvent en sur-adoption soudaine (énantiodromie)."
}
},
"POL": {
"healthy": "Zone cible — mais pas un état stable : à entretenir comme une pratique vivante (Action Adaptative HSD : Quoi ? Et alors ? Et maintenant ?).",
"over": "Priorité : reconstruire le muscle du jugement indépendant avant d'optimiser davantage l'usage de l'IA.",
"rigid": "Priorité : nommer la peur ou le coût identitaire sous le refus avant de pousser l'adoption.",
"erratic": "Alternance confiance facile / méfiance facile sans construire la capacité sous-jacente — archétype « Shifting the Burden ». Cartographiez la boucle avant d'accompagner (Senge).",
"watch": "Zone de transition : ni clairement dans un pôle ni dans un autre. La relation à l'IA n'est pas encore stabilisée — bon moment pour la clarifier et nommer où l'équipe veut aller."
},
"C5IND": {
"low": {
"t": "Compétences humaines jugées fragiles : c'est là que la tentation de tout confier à l'IA est la plus forte.",
"c": "Ciblez la compétence la plus basse et renforcez-la AVANT de l'outiller à l'IA, sinon l'outil masque la lacune (Amabile)."
},
"mid": {
"t": "Présentes mais inégales : elles se renforcent quand on les sollicite, s'érodent quand l'IA les remplace par défaut.",
"c": "Créez des occasions régulières de les exercer sans IA."
},
"high": {
"t": "Solidement ancrées : ressource clé pour garder la main là où l'IA ne doit pas décider seule.",
"c": "Rendez-les explicites et transmissibles au reste de l'équipe."
}
},
"C5SIG": {
"low": {
"t": "L'IA n'est pas perçue comme supérieure : confiance humaine saine. Déléguer reste un choix.",
"c": ""
},
"mid": {
"t": "Sur certaines compétences, l'IA est jugée meilleure que soi — terreau psychologique de la reddition.",
"c": "Nommez l'écart perçu : est-il réel, ou l'IA est-elle simplement plus rapide ?"
},
"high": {
"t": "IA largement perçue comme supérieure. Souvent l'IA n'est pas meilleure, elle est plus rapide — deux choses différentes.",
"c": "Derrière « l'IA fait mieux que moi » se cache souvent un enjeu identitaire à travailler (Kegan)."
}
},
"ATR": {
"sain": {
"t": "Écart sain : vous ne vous en remettez pas à l'IA plus vite que vous n'entretenez vos compétences.",
"c": ""
},
"vigil": {
"t": "Vigilance : appui sur l'IA un peu plus rapide que le renforcement des compétences.",
"c": "À rééquilibrer avant que la dépendance ne s'auto-renforce."
},
"prob": {
"t": "Report du fardeau (Senge) : vous vous en remettez à l'IA nettement plus que vous n'entretenez vos compétences.",
"c": "Le réflexe « moins d'IA » échoue : gardez l'IA sur le symptôme ET planifiez un entraînement délibéré (une tâche/semaine sans IA, débriefée)."
}
},
"HSD": {
"container": {
"t": "Container (cadre & rôles) : qui décide quoi au sujet de l'IA ?",
"c": "Un système sans frontière claire régule mal ses tensions — nommer les rôles est un acte de leadership systémique (Malarewicz)."
},
"difference": {
"t": "Difference (divergence & éthique) : les avis divergents sont-ils recherchés, l'IA challengée aussi sur les valeurs ?",
"c": "La variété interne est la 1re ressource contre la reddition collective ; ajoutez le critère sociétal, pas seulement l'exactitude technique."
},
"exchange": {
"t": "Exchange (débrief & apprentissage) : l'équipe métabolise-t-elle ses erreurs avec l'IA ?",
"c": "C'est l'indicateur le plus prédictif de la résilience à 12 mois (ORSC)."
}
},
"PRES": {
"low": {
"t": "Téléchargement du passé : l'IA sert surtout à aller plus vite vers la réponse déjà connue.",
"c": "Protégez un temps APRÈS la réponse de l'IA pour demander « quelle question cela fait émerger ? » (Théorie U, Scharmer)."
},
"mid": {
"t": "Émergence partielle : parfois une vraie question neuve surgit, souvent non.",
"c": "Ritualisez la question d'émergence après chaque usage important."
},
"high": {
"t": "Presencing : vos échanges IA font émerger des questions réellement nouvelles.",
"c": "Nommez et rendez reproductible ce qui produit cette émergence."
}
},
"KEGAN": {
"socialized": {
"t": "Votre rapport à l'IA est surtout défini par les attentes du groupe — vous adoptez ou refusez l'IA selon ce qui se fait autour de vous, et exprimer un désaccord coûte. C'est le terreau développemental de la reddition collective : le consensus de l'équipe devient le vôtre sans être réexaminé.",
"c": "Aidez la personne à distinguer sa propre voix de celle du groupe ; sécurisez le désaccord (lien HSD Difference). La question n'est plus « que pense l'équipe ? » mais « que penses-tu, toi, même si ça détonne ? »"
},
"selfAuthoring": {
"t": "Vous jugez l'IA selon vos propres critères, indépendamment du groupe — une autonomie plus solide, moins sujette à la reddition par conformité. Le revers : le cadre que vous vous êtes donné peut se refermer — sur-confiance dans votre système, ou refus rigide au nom de votre expertise.",
"c": "Valorisez l'autonomie, puis testez le cadre : se met-il à jour avec les faits, ou se défend-il comme une identité ? (lien refus rigide / coût identitaire — B. Johnson)"
},
"selfTransforming": {
"t": "Vous tenez plusieurs cadres à la fois, voyez les limites du vôtre, et vivez la relation à l'IA comme provisoire et révisable. C'est le profil le moins vulnérable à la fois à la reddition et au refus rigide — et le plus rare.",
"c": "Appuyez-vous sur cette personne comme passeur du sens collectif de l'équipe face à l'IA : elle sait tenir la polarité sans la trancher (Théorie U, Scharmer)."
}
}
},
"en": {
"A": {
"low": {
"t": "Healthy delegation: you keep the authority of judgement — you verify, rephrase, explain your reasoning.",
"c": "Nothing to fix: name this winning pattern to make it repeatable across the team (HSD)."
},
"mid": {
"t": "Tipping point: confidence rises faster than evidence, verification thins out.",
"c": "Work the right distance with the tool — neither fusion nor rejection (Malarewicz); objectify the team-AI relationship in meetings (ORSC)."
},
"high": {
"t": "Cognitive surrender: AI answers are adopted without re-examination, judgement delegated unnoticed.",
"c": "Restore a no-AI deliberation ritual before any high-stakes decision (back to System 2)."
}
},
"B": {
"low": {
"t": "Low refusal: you welcome AI without over-trusting it — a strength.",
"c": "Name it as \"good\" on this axis; check it isn't mere conformity to a team norm (Kegan)."
},
"mid": {
"t": "Moderate refusal: the other pole of the same polarity as surrender.",
"c": "The goal isn't zero refusal, but knowing when it is judgement vs reflex (B. Johnson); ask what the refusal protects."
},
"high": {
"t": "Rigid refusal: AI kept at arm's length, sometimes at the cost of workload and learning.",
"c": "Reframe refusal as a debatable choice, not an identity; watch the pendulum — it often flips to sudden over-adoption (enantiodromia)."
}
},
"POL": {
"healthy": "Target zone — but not a stable state: keep it alive as a practice (HSD Adaptive Action: What? So what? Now what?).",
"over": "Priority: rebuild the muscle of independent judgement before optimising AI use further.",
"rigid": "Priority: name the fear or identity cost under the refusal before pushing adoption.",
"erratic": "Swings between easy trust and easy distrust without building the underlying capacity — a \"Shifting the Burden\" archetype. Map the loop before coaching (Senge).",
"watch": "Transition zone: neither clearly in one pole nor the other. The relationship with AI hasn't settled — a good moment to clarify it and name where the team wants to go."
},
"C5IND": {
"low": {
"t": "Human competencies rated fragile: exactly where the temptation to hand everything to AI is strongest.",
"c": "Target the lowest competency and strengthen it BEFORE tooling it with AI, or the tool masks the gap (Amabile)."
},
"mid": {
"t": "Present but uneven: they strengthen when used consciously, erode when AI replaces them by default.",
"c": "Create regular occasions to exercise them without AI."
},
"high": {
"t": "Firmly anchored: a key resource to keep human hands where AI must not decide alone.",
"c": "Make them explicit and transferable to the rest of the team."
}
},
"C5SIG": {
"low": {
"t": "AI not seen as superior: healthy human confidence. Delegating stays a choice.",
"c": ""
},
"mid": {
"t": "On some competencies, AI is judged better than oneself — the psychological seedbed of surrender.",
"c": "Name the perceived gap: is it real, or is AI simply faster?"
},
"high": {
"t": "AI largely seen as superior. Often AI isn't better, it's faster — two different things.",
"c": "Behind \"AI does it better than me\" often hides an identity issue worth working (Kegan)."
}
},
"ATR": {
"sain": {
"t": "Healthy gap: you are not leaning on AI faster than you maintain your competencies.",
"c": ""
},
"vigil": {
"t": "Watch: leaning on AI slightly faster than strengthening competencies.",
"c": "Rebalance before dependence self-reinforces."
},
"prob": {
"t": "Shifting the burden (Senge): you lean on AI markedly more than you maintain your competencies.",
"c": "The \"less AI\" reflex fails: keep AI on the symptom AND plan deliberate practice (one task/week without AI, debriefed)."
}
},
"HSD": {
"container": {
"t": "Container (frame & roles): who decides what about AI?",
"c": "A system without a clear boundary regulates tension poorly — naming roles is systemic leadership (Malarewicz)."
},
"difference": {
"t": "Difference (divergence & ethics): are dissenting views sought, is AI challenged on values too?",
"c": "Internal variety is the #1 resource against collective surrender; add the societal criterion, not just technical accuracy."
},
"exchange": {
"t": "Exchange (debrief & learning): does the team metabolise its AI mistakes?",
"c": "The most predictive indicator of 12-month resilience (ORSC)."
}
},
"PRES": {
"low": {
"t": "Downloading the past: AI mostly used to reach the already-known answer faster.",
"c": "Protect time AFTER the AI answer to ask \"what question does this surface?\" (Theory U, Scharmer)."
},
"mid": {
"t": "Partial emergence: sometimes a genuinely new question arises, often not.",
"c": "Ritualise the emergence question after each significant use."
},
"high": {
"t": "Presencing: your AI exchanges surface genuinely new questions.",
"c": "Name and make repeatable whatever produces that emergence."
}
},
"KEGAN": {
"socialized": {
"t": "Your relationship with AI is mostly defined by the group's expectations — you adopt or refuse AI according to what's done around you, and voicing disagreement is costly. This is the developmental soil of collective surrender: the team's consensus becomes yours, unexamined.",
"c": "Help the person tell their own voice apart from the group's; make dissent safe (links to HSD Difference). The question shifts from \"what does the team think?\" to \"what do you think, even if it clashes?\""
},
"selfAuthoring": {
"t": "You judge AI by your own criteria, independently of the group — sturdier autonomy, less prone to conformity-driven surrender. The flip side: the frame you've built can close in on itself — over-trust in your own system, or rigid refusal in the name of your expertise.",
"c": "Honour the autonomy, then test the frame: is it updated by evidence, or defended as an identity? (links to rigid refusal / identity cost — B. Johnson)"
},
"selfTransforming": {
"t": "You hold several frames at once, see the limits of your own, and treat your AI stance as provisional and revisable. This is the profile least vulnerable to both surrender and rigid refusal — and the rarest.",
"c": "Lean on this person as a steward of the team's collective sense-making about AI: they can hold the polarity without collapsing it (Theory U, Scharmer)."
}
}
}
} as const;

export const POL_LABELS = { fr:{over:'Reddition cognitive',rigid:'Refus rigide',healthy:'Integration saine',erratic:'Jugement oscillant',watch:'Zone de transition'}, en:{over:'Cognitive surrender',rigid:'Rigid refusal',healthy:'Healthy integration',erratic:'Oscillating judgement',watch:'Transition zone'} } as const;
export const COMP_LABELS = { fr:{crea:'Creativite',cur:'Curiosite',col:'Collaboration',cri:'Esprit critique',com:'Communication'}, en:{crea:'Creativity',cur:'Curiosity',col:'Collaboration',cri:'Critical thinking',com:'Communication'} } as const;
export const KEGAN_LABELS = { fr:{socialized:'Esprit socialise',selfAuthoring:'Esprit auteur de soi',selfTransforming:'Esprit auto-transformateur'}, en:{socialized:'Socialized mind',selfAuthoring:'Self-authoring mind',selfTransforming:'Self-transforming mind'} } as const;