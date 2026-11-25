import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Nouveaux modèles et fournisseurs d'IA non censurée | {{appName}}",
    description:
      "Claude 5.5, GPT-6, Gemini 4 Argon, Grok 4.7 et de nouveaux modèles ouverts. Plus NanoGPT, plus de Venice et les premiers modèles d'images non censurés.",
    category: "Mise à jour des modèles",
    imageAlt: "{{appName}} : mise à jour des modèles, novembre 2026",
    keywords:
      "{{appName}}, Claude Opus 5.5, GPT-6, Gemini 4 Argon, Grok 4.7, IA non censurée, Venice, NanoGPT, Lustify, Chroma",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Mise à jour des modèles",
    readTime: "5 min de lecture",
    title:
      "Les modèles les plus récents sont là. Le non-censuré passe à la vitesse supérieure.",
    subtitle:
      "Chaque grande famille a pris une génération. Un deuxième fournisseur non censuré nous a rejoints. Et pour la première fois, vous pouvez générer des images non censurées.",
  },
  intro: {
    lead: "En bref : le catalogue est de nouveau à jour. {{modelCount}} modèles sont disponibles en ce moment, dont {{uncensoredCount}} non censurés.",
    p2: "Vous n'avez rien à faire. Vous aviez épinglé un ancien modèle ? Vos discussions passent d'elles-mêmes à son successeur.",
  },
  filter: {
    title: "Ce que « non censuré » veut dire ici",
    intro: "Trois niveaux. C'est vous qui choisissez.",
    p1: "Chaque modèle a un niveau de contenu. Les modèles grand public gardent les filtres de leur fournisseur. Les modèles open source sont plus souples. Les modèles non censurés répondent sans faire la morale. Ils sont de deux sortes. La plupart sont des modèles existants dont on a retiré les refus : même entraînement, même vision du monde, ils arrêtent simplement d'esquiver. UncensoredLM est l'autre sorte : entraîné sur des livres et des documents bannis de l'internet grand public, avec sa propre vision du monde.",
    p2: "Personne ne choisit le niveau à votre place. Prenez un modèle grand public pour le travail, un modèle non censuré pour la question à laquelle personne d'autre ne répondra. Même chat, même compte.",
    mainstream: "Grand public",
    open: "Open source",
    uncensored: "Non censuré",
    mainstreamBody:
      "Filtres du fournisseur actifs. Le choix sûr pour le travail.",
    openBody: "Moins de refus, quelques garde-fous quand même.",
    uncensoredBody: "Pas de sermon, pas de refus de façade. C'est votre choix.",
    countLabel: "{{count}} disponibles",
  },
  lineup: {
    title: "La nouvelle gamme",
    intro:
      "Regroupés par famille. Les anciens choix de ces familles pointent désormais vers les nouvelles versions.",
    claude: "Claude",
    claudeNote:
      "La nouvelle génération d'Anthropic, du raisonnement approfondi aux réponses rapides.",
    gpt: "GPT",
    gptNote: "La famille GPT-6 d'OpenAI. Chaque niveau a une variante Pro.",
    gemini: "Gemini",
    geminiNote:
      "Le modèle phare de Google, plus un cheval de trait rapide et bon marché.",
    grok: "Grok",
    grokNote: "Le dernier de xAI, classé open source, pas grand public.",
    openModels: "Modèles open source",
    openModelsNote:
      "Kimi, DeepSeek, GLM et MiniMax : solides et moins filtrés.",
  },
  uncensored: {
    title: "Le non-censuré a eu droit à une vraie mise à niveau",
    intro: "Plus de modèles, deux fournisseurs, et des images.",
    veniceTitle: "Venice : la colonne vertébrale, élargie",
    veniceBody:
      "Venice fait tourner la majeure partie de notre catalogue non censuré. Son modèle phare est passé à {{veniceModel}}, et toute une gamme a fait son entrée :",
    nanoTitle: "NanoGPT : une deuxième voie",
    nanoBody:
      "Nouveau fournisseur. Il apporte {{glm}} et {{glmFlash}} avec un contexte de 1M de tokens, et sert {{deepseek}} en parallèle de Venice, plus {{mimoAbliterated}}, qui lui est propre. Si un fournisseur flanche, l'autre prend le relais.",
    imagesTitle: "Les premiers modèles d'images non censurés",
    imagesBody:
      "{{lustify}} et {{chroma}}, via Venice. Un crédit par image. Tous les modèles d'images précédents étaient grand public ou open source.",
    warning:
      "{{model}} est le modèle le moins restreint que nous ayons jamais proposé. Il se trouve derrière le niveau de contenu non censuré : vous n'y avez accès que si vous le choisissez.",
  },
  underTheHood: {
    title: "Sous le capot",
    intro:
      "Pour ceux qui veulent savoir comment le remplacement fonctionne vraiment.",
    successorsTitle: "Les anciens choix suivent leur successeur",
    successorsBody:
      "Les anciens identifiants de modèles sont désormais marqués comme obsolètes : masqués du sélecteur, mais toujours résolus. Les choix épinglés et les compétences enregistrées suivent une table de successeurs vers le modèle actuel, mais seulement si ce successeur peut réellement vous être servi. Sinon, votre choix d'origine reste. Aucun remplacement silencieux par un modèle sans rapport.",
    pricesTitle: "Des prix toujours à jour",
    pricesBody:
      "De nouveaux récupérateurs de prix sans clé pour Venice et NanoGPT tiennent à jour les prix, les fenêtres de contexte et les modalités. C'est justement faute de données de prix que l'ancien modèle Venice s'était désactivé tout seul : ça ne peut plus arriver en silence.",
    toolsTitle: "Les appels d'outils, en toute honnêteté",
    toolsBody:
      "Les modèles NanoGPT ont des appels d'outils natifs. Venice Uncensored ignorait les outils natifs lors de nos tests : il garde donc une voie d'outils par prompt engineering, qui, elle, fonctionne.",
  },
  cta: {
    title: "Choisissez un modèle. Réglez votre filtre.",
    subtitle:
      "Tous les modèles ci-dessus sont disponibles dans le chat. Comparez-les côte à côte, ou commencez simplement à discuter.",
    chat: "Lancer une discussion",
    models: "Parcourir tous les modèles",
  },
};
