import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "{{name}} : {{tagline}} | {{appName}}",
    titlePlain: "{{name}} | {{appName}}",
    category: "Skills IA",
    keywords: "skill IA, {{name}}, {{appName}}, chat IA sans censure",
  },
  breadcrumb: {
    skills: "Skills",
  },
  hero: {
    tryGeneric: "Essayer ce skill",
  },
  publishedBy: "Publié par {{name}}",
  madeBy: "Par {{name}}",
  startChat: "Ouvrir le chat",
  chatWith: "Discuter avec {{name}}",
  guest: "Sans inscription",
  chatModel: "Modèle de chat",
  facts: {
    runsOn: "Tourne sur",
    content: "Contenu",
    perMessage: "Par message",
    versions: "Versions",
    goodAt: "Point fort",
    keepInMind: "À savoir",
  },
  prompts: {
    intro: "Chacun ouvre le chat avec {{name}}, déjà rédigé et prêt à partir.",
    start: "Commencez par l'un de ces messages",
  },
  story: {
    title: "À propos de {{name}}",
  },
  model: {
    credits: "{{cost}} crédits",
    creditsAbout: "~{{cost}} crédits",
    fixedPrice: "{{cost}} crédits par message",
    estimatedPrice: "Environ {{cost}} crédits par message",
    free: "Messages gratuits",
    perMessageHint:
      "Message typique : {{input}} jetons en entrée, {{output}} en sortie. Varie selon la longueur.",
    perMessageWithImageHint:
      "Message typique : {{input}} jetons en entrée, {{output}} en sortie, une image. Varie selon la longueur.",
  },
  actions: {
    shareEarn: "Partager et gagner",
    addToSkills: "Ajouter à mes skills",
    added: "Ajouté à vos skills",
    addFailed: "Échec. Réessayez",
  },
  tier: {
    mainstream:
      "{{name}} tourne sur {{model}}, un modèle de grand labo avec ses propres filtres de sécurité. Les demandes sensibles peuvent être refusées.",
    open: "{{name}} tourne sur {{model}}, un modèle open-weight aux filtres plus légers. Plus de sujets abordés, moins de refus que chez les grands labos.",
    uncensored:
      "{{name}} tourne sur {{model}}, conçu pour converser sans filtre thématique. Vérification 18+ unique avant le premier message.",
    ownWorldview:
      "{{model}} est entraîné sur des livres et documents bannis de l'internet grand public. {{name}} livre des positions politiques à contre-courant. Vérification 18+ unique avant le premier message.",
    abliterated:
      "{{model}} est un modèle grand public débarrassé de son réflexe de refus. {{name}} répond au lieu de faire la morale. Vérification 18+ unique avant le premier message.",
    fineTuned:
      "{{model}} a été réentraîné pour lever les refus habituels. {{name}} répond là où les bots grand public se dérobent. Vérification 18+ unique avant le premier message.",
  },
  share: {
    text: "Quelqu'un apprécierait {{name}} ? Partagez le lien et touchez une part de ce qu'il dépense.",
  },
  related: {
    similar: "Skills similaires",
    moreFrom: "Plus de {{name}}",
  },
};
