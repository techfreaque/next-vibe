import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Créer une compétence : Une IA sur mesure pour tout",
    description:
      "Transformez n'importe quel workflow en compétence IA réutilisable. Passez par la page des compétences, ou demandez à Thea dans le chat. Aucun code requis.",
    category: "Skills",
    imageAlt: "Créez une compétence IA sur mesure sur {{appName}}",
    keywords:
      "créer une compétence IA, IA sur mesure, créateur de compétences, {{appName}}, prompt système, persona IA",
  },
  hero: {
    badge: "Skill Creator",
    title: "Créez une compétence.",
    titleLine2: "Votre IA vous appartient.",
    subtitle:
      "Persona, modèle, outils, voix : configurés une fois, à vous pour toujours. Créez pour n'importe quel usage. Partagez. Gagnez de l'argent avec.",
    ctaPrimary: "Créer une compétence",
    ctaSecondary: "Demander à Thea ou Hermes",
  },
  what: {
    title: "Une compétence, c'est une configuration d'IA enregistrée.",
    subtitle:
      "Réglez-la une fois. Utilisez-la partout. Partagez-la avec qui vous voulez.",
    item0Label: "Prompt système",
    item0Body:
      "Identité et instructions. 200 à 500 mots. On doit sentir une personne, pas une FAQ.",
    item1Label: "Choix du modèle",
    item1Body:
      "Filtrez par intelligence, niveau de contenu et prix, ou épinglez un modèle précis.",
    item2Label: "Outils",
    item2Body:
      "Liste blanche exacte : recherche, génération d'images, mémoire, code, musique, vidéo.",
    item3Label: "Voix",
    item3Body: "Choisissez un modèle vocal pour les réponses parlées.",
  },
  ways: {
    title: "Deux façons de créer",
    subtitle: "Choisissez celle qui vous convient.",
    way1Badge: "Page des compétences",
    way1Title: "Le bouton Créer dans la liste des compétences",
    way1Body:
      "Ouvrez la page des compétences ou le sélecteur de modèle dans n'importe quel fil. Cliquez sur Créer. Remplissez le formulaire : nom, prompt système, modèle, outils. C'est fait.",
    way1Detail:
      "Pas d'assistant, pas d'étapes en plus. Le formulaire, c'est toute la configuration.",
    way1Cta: "Ouvrir les compétences",
    way2Badge: "Chat",
    way2Title: "Demandez à Thea ou Hermes",
    way2Body:
      "Ouvrez un fil et écrivez : « Crée-moi une compétence de raisonnement clinique pour étudiants en médecine. » Le sous-agent Skill Creator pose quelques questions, rédige le prompt, choisit le modèle, configure les outils, crée la compétence et l'épingle dans votre barre latérale.",
    way2Detail:
      "Thea délègue au Skill Creator, un sous-agent équipé de skill-create, favorite-create et tool-help. Vous décrivez, il construit.",
    way2Cta: "Ouvrir le chat",
  },
  prompt: {
    title: "Un prompt système qui fonctionne",
    subtitle:
      "La partie la plus importante. Un bon prompt donne l'impression d'une personne, pas d'un règlement intérieur.",
    dos: "Ce qui marche",
    donts: "Ce qui le tue",
    do0Title: "Commencez par l'identité",
    do0Body:
      "« Tu es [Nom], un(e) [rôle] qui [fait X]. » Première ligne, toujours.",
    do1Title: "3 à 5 traits concrets",
    do1Body:
      "« Direct et socratique » bat « serviable et informatif ». À chaque fois.",
    do2Title: "Délimitez l'expertise",
    do2Body:
      "Ce qu'il maîtrise à fond. Ce qu'il laisse à d'autres. Aucune ambiguïté.",
    do3Title: "Précisez le style de communication",
    do3Body:
      "« Réponds toujours en un seul paragraphe » est une instruction valable.",
    do4Title: "Moins de 500 mots",
    do4Body:
      "Le modèle relit tout le prompt à chaque tour. Plus court, c'est mieux.",
    dont0Title: "Des listes de règles façon CGU",
    dont0Body:
      "« Sois toujours serviable, ne sois jamais impoli » : toutes les IA reçoivent ça. Du bruit, rien de plus.",
    dont1Title: "« Sois toujours serviable »",
    dont1Body: "Le modèle le sait déjà. Inutile.",
    dont2Title: "Des contraintes contradictoires",
    dont2Body:
      "« Sois créatif mais reste toujours dans le sujet » : le modèle tergiverse sans fin. Choisissez.",
    dont3Title: "De longues listes de capacités",
    dont3Body: "Le modèle sait ce qu'il sait faire. Ne recopiez pas la doc.",
  },
  examples: {
    title: "Les compétences que les gens créent vraiment",
    item0Name: "Raisonnement clinique",
    item0Category: "Éducation",
    item0Desc:
      "Pense comme un clinicien expérimenté. Travaille des cas, des diagnostics différentiels, raisonne sous pression.",
    item1Name: "Relecteur de code",
    item1Category: "Code",
    item1Desc:
      "Connaît votre stack, fait respecter les conventions de l'équipe. Branché sur la recherche pour la doc.",
    item2Name: "Écrivain sans censure",
    item2Category: "Création",
    item2Desc:
      "Fiction, jeu de rôle, débat, sans les restrictions des plateformes. Modèles non censurés.",
    item3Name: "Mentor personnel",
    item3Category: "Compagnon",
    item3Desc:
      "Socratique, franc, tourné vers la progression. Une personnalité construite sur la vraie philosophie de son créateur.",
    item4Name: "Agent de recherche",
    item4Category: "Analyse",
    item4Desc:
      "Cherche sur Brave et Kagi, récupère les pages, synthétise, garde ses trouvailles en mémoire.",
    item5Name: "L'expert que vous ne pouvez pas vous offrir",
    item5Category: "Spécialiste",
    item5Desc:
      "Consultant, avocat, conseiller financier, condensés dans une compétence. Un savoir à 400 $ de l'heure, sans rien débourser.",
  },
  dev: {
    title: "Pour les développeurs : skill.ts",
    body: "Vous faites tourner next-vibe en local ? Demandez à votre agent de générer un fichier de compétence. Même structure que toutes les compétences intégrées : prêt à compiler, prêt à commiter.",
    note: "L'agent connaît tout le schéma. Décrivez ce que vous voulez : il génère le fichier, enregistre la compétence, et c'est en ligne.",
  },
  cta: {
    title: "Créez la vôtre.",
    subtitle:
      "Décrivez ce que vous voulez. Le Skill Creator s'occupe du reste.",
    primary: "Créer une compétence",
    secondary: "Demander à Thea ou Hermes",
  },
};
