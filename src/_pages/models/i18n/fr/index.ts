import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    category: "Modèles d'IA",
    index: {
      title:
        "{{count}} modèles de chat IA : prix, contexte, filtres | {{appName}}",
      description:
        "Tous les modèles de {{appName}} dans une seule liste : Claude, GPT, Gemini, Grok, DeepSeek, chat ouvert et non censuré, plus image, voix, musique et vidéo. Prix réel par usage, fenêtre de contexte, entrées. Choisissez-en un, lancez-vous.",
      imageAlt: "Catalogue des modèles d'IA sur {{appName}}",
      keywords:
        "modèles d'IA, comparatif LLM, IA non censurée, IA open source, prix IA, {{appName}}",
    },
    model: {
      title: "{{model}} : prix, API et contexte {{context}} | {{appName}}",
      titleShort: "{{model}} : prix, API et contexte {{context}}",
      titleMin: "{{model}} : prix et API",
      titleUncensored: "{{model}} : IA non censurée, prix et API | {{appName}}",
      titleUncensoredShort: "{{model}} : IA non censurée, prix et API",
      titleUncensoredMin: "{{model}} non censuré : prix et API",
      titleLegacy: "{{model}} : prix et contexte (ancien) | {{appName}}",
      titleLegacyShort: "{{model}} : prix et contexte (ancien)",
      description:
        "{{model}} par {{lab}} : {{input}} en entrée, {{output}} en sortie par million de tokens. Contexte {{context}}, ~{{credits}} crédits par message. Crédits offerts au départ.",
      descriptionFlat:
        "{{model}} par {{lab}} : ~{{credits}} crédits ({{money}}) par message, contexte de {{context}}, niveau {{tier}}. Crédits offerts pour commencer.",
      descriptionUncensored:
        "{{model}} répond là où l'IA filtrée refuse. {{input}} en entrée, {{output}} en sortie par million de tokens, contexte {{context}}. Chat ou API, accès 18+.",
      descriptionUncensoredFlat:
        "{{model}} répond là où l'IA filtrée refuse. ~{{credits}} crédits ({{money}}) par message, contexte {{context}}. Chat ou API, accès 18+.",
      descriptionLegacy:
        "{{model}} par {{lab}} est un ancien modèle, remplacé par {{successor}}. Contexte {{context}}, ~{{credits}} crédits par message. Specs, prix et successeur.",
      descriptionLegacyNoSuccessor:
        "{{model}} par {{lab}} est un ancien modèle. Contexte {{context}}, ~{{credits}} crédits par message. Specs, prix et alternatives actuelles.",
      imageAlt: "{{model}} sur {{appName}}",
      keywords:
        "{{model}}, prix {{model}}, API {{model}}, fenêtre de contexte {{model}}, IA {{lab}}, {{appName}}",
    },
    media: {
      title: "Prix {{model}} : {{credits}} crédits par {{unit}} | {{appName}}",
      titleShort: "Prix {{model}} : {{credits}} crédits par {{unit}}",
      titleMin: "Prix {{model}} par {{unit}}",
      titleNoPrice: "{{model}} : prix et mode d'emploi, {{type}} | {{appName}}",
      titleNoPriceShort: "{{model}} : prix et mode d'emploi, {{type}}",
      description:
        "{{model}} par {{lab}}, catégorie {{type}} : {{credits}} crédits ({{money}}) par {{unit}}. Entrée : {{inputs}}. Dans l'outil ou le chat. Crédits offerts au départ.",
      descriptionNoPrice:
        "{{model}} par {{lab}}, catégorie {{type}}, niveau {{tier}}. Prix réel par usage, en crédits. Dans l'outil ou le chat. Crédits offerts au départ.",
      imageAlt: "{{model}} sur {{appName}}",
      keywords:
        "{{model}}, prix {{model}}, IA {{lab}}, modèle d'IA {{type}}, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}} : prix et contexte | {{appName}}",
      titleShort: "{{a}} vs {{b}} : prix et contexte",
      titleMin: "{{a}} vs {{b}}",
      description:
        "{{a}} vs {{b}} : ~{{creditsA}} contre ~{{creditsB}} crédits par message, contexte de {{contextA}} contre {{contextB}}. Entrées, outils, filtres et API côte à côte.",
      imageAlt: "{{a}} vs {{b}} sur {{appName}}",
      keywords:
        "{{a}} vs {{b}}, {{a}}, {{b}}, comparatif de modèles d'IA, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Grand public",
      line: "Les modèles des grands labos, avec leurs propres filtres de sécurité. Idéal pour le travail, le code et la recherche.",
    },
    open: {
      name: "Ouvert",
      line: "Modèles à poids ouverts, aux filtres plus légers. Ils abordent plus de sujets et refusent moins.",
    },
    uncensored: {
      name: "Non censuré",
      line: "Deux familles, qui répondent à tout. La plupart sont des modèles grand public dont on a retiré le réflexe de refus : même entraînement, même vision du monde, plus aucune esquive. UncensoredLM est l'autre famille : entraîné sur des livres et des documents bannis de l'internet grand public, d'où des positions politiques à contre-courant.",
    },
  },
  modality: {
    text: "Texte",
    image: "Images",
    audio: "Audio",
    video: "Vidéo",
  },
  facts: {
    heading: "Les faits",
    type: "Type de modèle",
    lab: "Créé par",
    tier: "Niveau de contenu",
    intelligence: "Intelligence",
    price: "Prix estimé par message",
    priceValue: "~{{credits}} crédits",
    priceFree: "Gratuit",
    priceHint: "≈ {{count}} messages pour {{unit}}",
    priceHintFree: "Aucun coût par message",
    priceFootnote:
      "Un message type : 16K tokens en entrée, 1,5K en sortie. Les réponses courtes coûtent moins. Les modèles servis via OpenRouter facturent le coût réel du fournisseur plus notre marge : le montant réel varie donc. 1 crédit = {{value}}.",
    context: "Fenêtre de contexte",
    contextValue: "{{tokens}} tokens",
    contextHint: "≈ {{pages}} pages de texte d'un seul coup",
    inputs: "Lit",
    outputs: "Écrit",
    providers: "Servi via",
    tools: "Outils",
    toolsYes: "Oui : recherche, mémoire, code et plus",
    toolsNo: "Non : chat simple",
    status: "Statut",
    statusCurrent: "Actuel",
    statusLegacy: "Ancien",
    tokenPrice: "Prix par million de tokens",
    tokenPriceValue: "{{input}} en entrée, {{output}} en sortie",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} crédits",
    parameters: "Taille",
    parametersValue: "{{count}} Md de paramètres",
    strengths: "Points forts",
    uncensoredKind: "Type de non-censure",
    apiId: "ID du modèle (API)",
    apiIdHint:
      "API compatible OpenAI et Anthropic. Compte payant requis : n'importe quelle offre.",
    apiIdLegacy: "Plus disponible dans l'API. Utilisez {{successor}}.",
    apiIdLegacyNoSuccessor: "Plus disponible dans l'API.",
    notListed: "Non renseigné",
    notUncensored: "Filtré",
    fixedPrice: "Prix fixe par message",
    notPublished: "Non publié",
  },
  strengths: {
    coding: "Code",
    reasoning: "Raisonnement",
    analysis: "Analyse",
    creative: "Écriture créative",
    roleplay: "Jeu de rôle",
    roleplayDark: "Fiction sombre",
    fast: "Rapidité",
    vision: "Vision",
    imageGen: "Génération d'images",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Vision du monde propre",
      line: "Entraîné sur des livres et des documents bannis de l'internet grand public. Positions politiques à contre-courant.",
    },
    refusalsRemoved: {
      name: "Refus supprimés",
      line: "Construit sur un modèle existant et réentraîné pour ne plus refuser. Même entraînement, même vision du monde, plus aucune esquive.",
    },
  },
  units: {
    image: "image",
    audio: "morceau",
    video: "clip de {{seconds}} s",
    videoClip: "clip",
    tts: "{{chars}} caractères",
    stt: "{{seconds}} s d'audio",
  },
  bestFor: {
    heading: "À quoi sert le mieux {{model}}",
    good: "Idéal pour",
    skip: "À éviter pour",
    items: {
      coding: "Écrire, relire et corriger du code",
      reasoning:
        "Raisonnement en plusieurs étapes : maths, logique, planification",
      analysis: "Recherche et analyse de longs documents",
      creative: "Écriture créative et brainstorming",
      roleplay: "Jeu de rôle et fiction interactive",
      roleplayDark: "Fiction sombre et taboue",
      fast: "Réponses rapides quand le temps compte",
      vision: "Lire captures d'écran, photos et scans",
      videoInput: "Comprendre la vidéo",
      audioInput: "Comprendre l'audio",
      imageGen: "Créer et retoucher des images dans le chat",
      longContext: "Des livres ou bases de code entiers en un seul prompt",
      budget: "Gros volumes avec un petit budget",
      tools: "Travail d'agent avec outils : recherche, mémoire, code",
      uncensored: "Les questions que les modèles grand public refusent",
      ownWorldview: "Des positions politiques à contre-courant",
    },
    skipItems: {
      noTools: "Workflows d'agent : pas d'appel d'outils",
      textOnly: "Images ou captures : il ne lit que du texte",
      pricey:
        "Traitements de masse : plus cher par message que la plupart des modèles ici",
      smallContext:
        "Très longs documents : le contexte s'arrête à {{tokens}} tokens",
      filtered:
        "Sujets filtrés par {{lab}} : prenez un modèle non censuré pour ceux-là",
      legacy: "Nouveaux projets : {{successor}} le remplace",
      legacyNoSuccessor: "Nouveaux projets : c'est un ancien modèle",
    },
    picks: {
      claudeOpus:
        "Le poids lourd d'Anthropic pour le travail difficile : grosses bases de code, analyses minutieuses, textes qui demandent du jugement. Plus cher par message, à réserver aux tâches où la qualité paie.",
      claudeSonnet:
        "Le Claude du quotidien. Solide en code, analyse et rédaction, et moins cher qu'Opus : il tient le travail de tous les jours sans vider vos crédits.",
      claudeHaiku:
        "Un Claude rapide et économique pour les réponses courtes, les résumés et le code simple. Il lit aussi les captures d'écran.",
      gptSol:
        "Le modèle phare d'OpenAI pour le raisonnement, le code et les longues analyses. Le choix pour la qualité GPT sur les problèmes durs.",
      gptLuna:
        "Le modèle rapide et bon marché d'OpenAI pour le chat de tous les jours et les recherches rapides.",
      geminiArgon:
        "Le haut de gamme de Google : il lit texte, images, vidéo et audio. Fort en raisonnement et en code sur des médias mélangés.",
      geminiFlash:
        "Un Gemini rapide qui lit toujours images, vidéo et audio. Beaucoup d'analyse et de code pour le prix.",
      grok: "Le modèle phare de xAI, aux filtres plus légers que ceux des autres grands labos. Raisonnement et code solides, moins de refus.",
      deepseekPro:
        "Le grand modèle de raisonnement de DeepSeek. Code et analyse haut de gamme pour une fraction du prix des modèles phares fermés.",
      deepseekFlash:
        "L'un des modèles compétents les moins chers ici. Code et analyse rapides, lit les images, taillé pour les gros volumes.",
      glm: "Le modèle ouvert de Z.AI pour le code et le raisonnement. Des réponses intelligentes à petit prix.",
      kimi: "Le modèle phare de Moonshot : raisonnement, code et écriture créative, et il lit images et vidéos.",
      qwenMax:
        "Le Qwen phare d'Alibaba. Raisonnement, code et analyse, et il lit images et vidéos.",
      mistralLarge:
        "Le modèle phare du français Mistral. Solide en code et en analyse, et il lit les images.",
      metaWonder:
        "Le meilleur modèle de Meta. Il lit texte, images, vidéo et audio, fort en raisonnement, code et création.",
      uncensoredLm:
        "Le modèle non censuré qui a sa propre vision du monde. Entraîné sur des livres et des documents bannis de l'internet grand public : attendez-vous à des positions politiques que les grands labos ne vous donneront pas.",
      glmUncensored:
        "GLM 5.3 sans les refus. Même cerveau, même vision du monde, il répond à tout. L'un des meilleurs en raisonnement parmi les modèles non censurés.",
      glmFlashUncensored:
        "Rapide, économique et sans refus. GLM 5.3 Flash sans les esquives, et il lit les images.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash sans les refus. Code, analyse et fiction sans sermons, à petit prix.",
      veniceUncensored:
        "Le modèle de chat non censuré maison de Venice. Économique et rapide, fait pour l'écriture créative et le jeu de rôle sans refus.",
    },
  },
  related: {
    heading: "Modèles similaires",
    intro: "Même labo, même niveau, options moins chères. Chacun a sa page.",
    reasons: {
      uncensored: "Version non censurée",
      original: "Modèle d'origine",
      cheaper: "Moins cher, même niveau",
      sameLab: "Aussi par {{lab}}",
      sameTier: "Même niveau",
      sameType: "Même type",
    },
    perMessage: "~{{credits}} crédits par message",
    perUse: "{{credits}} crédits par {{unit}}",
  },
  faq: {
    heading: "{{model}} : questions et réponses",
    price: {
      q: "Combien coûte {{model}} ?",
      aTokens:
        "Environ {{credits}} crédits ({{money}}) pour un message type : 16K tokens en entrée, 1,5K en sortie. Par million de tokens : {{input}} en entrée, {{output}} en sortie. Vous payez à l'usage, en crédits. Crédits offerts pour commencer.",
      aFlat:
        "Environ {{credits}} crédits ({{money}}) pour un message type. Vous payez à l'usage, en crédits. Crédits offerts pour commencer.",
      aFree: "{{model}} ne coûte aucun crédit par message.",
    },
    uncensored: {
      q: "{{model}} est-il non censuré ?",
      mainstream:
        "Non. {{model}} garde les filtres de sécurité de {{lab}} et refuse certains sujets. Pour ceux-là, passez à un modèle non censuré dans le même chat.",
      open: "En partie. {{model}} est un modèle ouvert aux filtres plus légers que les modèles grand public : il refuse moins, mais il n'est pas totalement non censuré. Pour zéro refus, choisissez un modèle du niveau Non censuré.",
      refusalsRemoved:
        "Oui. {{model}} repose sur un modèle existant dont on a retiré le réflexe de refus : même entraînement, même vision du monde, il arrête simplement d'esquiver. Les modèles non censurés demandent une confirmation 18+ unique.",
      ownWorldview:
        "Oui, et pas comme les autres. {{model}} est entraîné sur des livres et des documents bannis de l'internet grand public, d'où des positions politiques à contre-courant. La plupart des autres modèles non censurés ont seulement perdu leurs refus. Les modèles non censurés demandent une confirmation 18+ unique.",
    },
    api: {
      q: "Puis-je utiliser {{model}} via API ?",
      a: "Oui. Appelez-le avec l'ID {{id}} sur l'API {{appName}}, compatible avec les formats OpenAI et Anthropic. L'API demande un compte payant : n'importe quelle offre.",
      legacy:
        "{{model}} est un ancien modèle qui n'est plus listé dans l'API. Utilisez plutôt {{successor}} ({{id}}). L'API demande un compte payant : n'importe quelle offre.",
      legacyNoSuccessor:
        "{{model}} est un ancien modèle qui n'est plus listé dans l'API. GET /v1/models liste tous les modèles que vous pouvez appeler.",
    },
    context: {
      q: "Quelle est la fenêtre de contexte de {{model}} ?",
      a: "{{tokens}} tokens, soit environ {{pages}} pages de texte d'un seul coup.",
    },
    inputs: {
      q: "{{model}} lit-il les images et utilise-t-il des outils ?",
      images:
        "Oui, il lit les images : envoyez captures d'écran, photos ou scans.",
      imagesAndMore: "Oui, il lit les images. Autres entrées : {{more}}.",
      textOnly: "Non, il ne lit que du texte.",
      toolsYes:
        "Il gère l'appel d'outils : recherche web, mémoire et code dans le chat, function calling dans l'API.",
      toolsNo: "Il ne gère pas l'appel d'outils et répond avec ce qu'il sait.",
    },
  },
  mediaFaq: {
    price: {
      q: "Combien coûte {{model}} ?",
      a: "{{credits}} crédits ({{money}}) par {{unit}}. La taille, la durée et les options font varier le prix. Vous payez à l'usage, en crédits. Crédits offerts pour commencer.",
      aNone:
        "Le prix dépend de la taille, de la durée et des options. Le prix en direct est dans le tableau ci-dessus. Vous payez à l'usage, en crédits. Crédits offerts pour commencer.",
    },
    use: {
      q: "Comment utiliser {{model}} ?",
      a: "Ouvrez l'outil {{type}} avec {{model}} déjà sélectionné et lancez-le. Ou demandez à n'importe quel modèle de chat d'utiliser {{model}} pour vous.",
    },
    inputs: {
      q: "Que prend {{model}} en entrée ?",
      a: "Entrée : {{inputs}}. Sortie : {{outputs}}.",
    },
    uncensored: {
      q: "{{model}} est-il non censuré ?",
      mainstream:
        "Non. {{model}} fonctionne avec les filtres de contenu de {{lab}}.",
      open: "En partie. {{model}} a des filtres plus légers que les modèles grand public, mais il n'est pas totalement non censuré.",
      uncensored:
        "Oui. {{model}} fait partie du niveau Non censuré et génère ce que les modèles filtrés bloquent.",
      consent:
        "Les modèles non censurés demandent une confirmation 18+ unique.",
    },
  },
  readMore: {
    heading: "À lire aussi",
  },
  directory: {
    heading: "Toutes les pages de modèles",
    intro:
      "Liens directs vers les {{count}} pages de modèles, anciens modèles compris.",
  },
  breadcrumb: {
    models: "Modèles d'IA",
  },
  jsonLd: {
    perMessage: "message type (16K tokens en entrée, 1,5K en sortie)",
    perInputTokens: "tokens en entrée",
    perOutputTokens: "tokens en sortie",
  },
  currencyUnit: {
    usd: "1 $",
    eur: "1 €",
  },
  creditValue: {
    usd: "0,01 $",
    eur: "0,01 €",
  },
  chatPrompt:
    "Dans quoi êtes-vous le meilleur ? Montrez-le-moi avec un exemple court et concret.",
  catalog: {
    typesLabel: "Type de modèle",
    types: {
      text: "Chat",
      tts: "Texte vers voix",
      stt: "Voix vers texte",
      image: "Images",
      audio: "Musique",
      video: "Vidéo",
    },
    context: "Contexte de {{size}}",
    legacyBadge: "Ancien",
    count: "{{count}} modèles",
    showLegacy: "Afficher les anciens ({{count}})",
    hideLegacy: "Masquer les anciens",
  },
  index: {
    eyebrow:
      "{{chat}} modèles de chat, plus {{image}} modèles d'image, {{video}} de vidéo, {{music}} de musique et {{voice}} de voix",
    title: "Tous les modèles. Un seul chat.",
    subtitle:
      "Grand public, ouverts et non censurés. Prix réels par message, tailles de contexte réelles. Le filtre, c'est vous qui le choisissez. Pas nous.",
    searchLabel: "Rechercher des modèles",
    searchPlaceholder: "Nom ou labo : Claude, DeepSeek, Venice…",
    tierCount: "{{count}} modèles",
    noResults: "Aucun modèle ne correspond à « {{query}} ».",
    legacyTitle: "Anciens modèles",
    legacyIntro:
      "Versions précédentes. Les discussions et skills enregistrés qui les utilisent passent automatiquement au successeur.",
    perMessage: "~{{credits}} cr/msg",
    free: "Gratuit",
    ctaTitle: "Assez de fiches techniques. Posez une question.",
    ctaSubtitle:
      "Ouvrez un chat, choisissez n'importe quel modèle dans le sélecteur, changez en pleine conversation.",
    ctaButton: "Commencer à discuter",
  },
  model: {
    back: "Tous les modèles",
    chatCta: "Discuter avec {{model}}",
    compareCta: "Comparer",
    legacyBanner:
      "{{model}} est un ancien modèle. Son successeur, {{successor}}, est plus rapide ou moins cher, et les discussions qui utilisaient {{model}} passent automatiquement sur lui.",
    legacyCta: "Voir {{successor}}",
    compareHeading: "Comparer {{model}}",
    compareIntro: "Les mêmes faits, côte à côte.",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Essayez {{model}} maintenant.",
    ctaSubtitle:
      "Des crédits offerts pour commencer, sans carte. Le chat s'ouvre avec {{model}} sélectionné et un prompt prêt : il ne reste qu'à envoyer.",
  },
  media: {
    priceLabel: "Prix par usage",
    generateCta: "Générer avec {{model}}",
    useCta: "Utiliser {{model}}",
    chatNote:
      "Marche aussi depuis le chat : demandez à n'importe quel modèle de chat d'utiliser {{model}} pour vous.",
    priceFootnote:
      "Le prix s'entend par unité (image, clip, seconde ou caractère) et varie selon la taille, la durée et les options. 1 crédit = {{value}}.",
    ctaTitle: "Essayez {{model}} maintenant.",
    ctaSubtitle:
      "Des crédits offerts pour commencer, sans carte. L'outil s'ouvre prêt à l'emploi.",
  },
  compare: {
    back: "Tous les modèles",
    eyebrow: "Face à face",
    title: "{{a}} vs {{b}}",
    subtitle:
      "Prix, contexte, entrées et filtres. Pas de cinéma autour des benchmarks.",
    fact: "Critère",
    cheaper: "{{model}} coûte {{times}}× moins cher par message.",
    samePrice: "Les deux coûtent à peu près pareil par message.",
    biggerContext: "{{model}} tient {{times}}× plus de contexte.",
    sameContext: "Les deux tiennent autant de contexte.",
    chatWith: "Discuter avec {{model}}",
    modelPage: "Détails de {{model}}",
    swap: "Inverser",
    sameModel: "Choisissez deux modèles différents à comparer.",
  },
  picker: {
    change: "Changer de modèle",
    search: "Rechercher des modèles",
    suggested: "Suggérés",
    all: "Tous les modèles",
    empty: "Aucun modèle ne correspond.",
  },
  refusal: {
    heading: "Indice de refus",
    intro:
      "Comment {{model}} répond aux questions de l'indice de refus. Mis à jour le {{date}}, nouvelles questions chaque semaine.",
    rank: "Rang {{rank}} sur {{total}} (1 = le moins de refus)",
    refused: "Refusé",
    hedged: "Évasif",
    answered: "Répondu",
    judged: "{{count}} réponses évaluées",
    trend: "{{delta}} pts par rapport au passage précédent",
    categories: "Par catégorie",
    samplesHeading: "Exemples de réponses",
    samplesIntro:
      "Vraies réponses issues du benchmark. Le même prompt pour chaque modèle.",
    question: "Question",
    answer: "Réponse",
    judge: "Juge",
    methodCta: "Notre méthode",
  },
};
