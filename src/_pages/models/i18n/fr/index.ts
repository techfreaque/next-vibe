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
      titleUncensored:
        "{{model}} : chat IA non censuré en ligne, prix et API | {{appName}}",
      titleUncensoredShort:
        "{{model}} : chat IA non censuré en ligne, prix et API",
      titleUncensoredMin: "{{model}} : chat IA non censuré",
      titleLegacy: "{{model}} : prix et contexte (ancien) | {{appName}}",
      titleLegacyShort: "{{model}} : prix et contexte (ancien)",
      description:
        "{{model}} par {{lab}} : {{input}} en entrée, {{output}} en sortie par million de tokens. Contexte {{context}}, ~{{credits}} crédits par message. Crédits offerts au départ.",
      descriptionFlat:
        "{{model}} par {{lab}} : ~{{credits}} crédits ({{money}}) par message, contexte de {{context}}, niveau {{tier}}. Crédits offerts pour commencer.",
      descriptionUncensored:
        "Discutez avec {{model}} en ligne ou via l'API. {{input}} en entrée, {{output}} en sortie par million de tokens, contexte {{context}}. Crédits offerts aux invités, accès 18+.",
      descriptionUncensoredFlat:
        "Discutez avec {{model}} en ligne ou via l'API. ~{{credits}} crédits ({{money}}) par message, contexte {{context}}. Crédits offerts aux invités, accès 18+.",
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
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}) : ~{{moneyA}} contre ~{{moneyB}} par message, contexte de {{contextA}} contre {{contextB}}. Lequel choisir, les faits côte à côte.",
      descriptionShort:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}) : ~{{moneyA}} contre ~{{moneyB}} par message, contexte de {{contextA}} contre {{contextB}}.",
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
      line: "Des modèles pour des conversations et des créations avec moins de restrictions.",
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
    priceValue: "~{{credits}} crédits ({{money}})",
    priceFree: "Gratuit",
    referenceTurn:
      "Le message de référence contient {{input}} tokens en entrée et {{output}} en sortie.",
    referenceImageTurn:
      "Le message de référence contient {{input}} tokens en entrée, {{output}} tokens de texte en sortie et une image générée.",
    priceProvider: "Tarifs affichés pour {{provider}}.",
    conditionalPrice: "Tarifs par palier pour un million de tokens",
    tierAt: "À partir de {{tokens}} tokens en entrée : {{rates}}.",
    tierUtc: "De {{start}} à {{end}} UTC : {{rates}}.",
    tierInput: "entrée {{price}}",
    tierOutput: "sortie {{price}}",
    tierRead: "lecture en cache {{price}}",
    tierWrite: "écriture en cache {{price}}",
    tierHour: "écriture pour une heure {{price}}",
    cacheReadSentence: "Lire un million de tokens en cache coûte {{price}}.",
    cacheWrite1hPrice: "Écriture en cache pour une heure par million de tokens",
    cacheWrite1hSentence:
      "Écrire un million de tokens en cache pour une heure coûte {{price}}.",
    cacheWriteSentence: "Écrire un million de tokens en cache coûte {{price}}.",
    cacheReadPrice: "Lecture du cache par million de tokens",
    cacheWritePrice: "Écriture dans le cache par million de tokens",
    imageOutputPrice: "Sortie image par million de tokens",
    perMillionCredits: "{{credits}} crédits",
    priceFootnote:
      "Le montant varie selon l’usage et le fournisseur. L’estimation utilise le tarif du pack de crédits à l’unité, soit {{value}} par crédit.",
    context: "Fenêtre de contexte",
    contextValue: "{{tokens}} tokens",
    contextHint: "≈ {{pages}} pages de texte d'un seul coup",
    inputs: "Formats d’entrée",
    outputs: "Formats de sortie",
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
    fixedPrice: "Tarif fixe par message.",
    notPublished: "Non publié",
    apiIdUnsupported: "Ce modèle est indisponible via l’API de chat textuel.",
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
      name: "Sa propre vision du monde",
      line: "Entraîné sur des livres et documents bannis de l’internet grand public. Ses positions politiques vont à contre-courant.",
    },
    abliterated: {
      name: "Avec ablation",
      line: "Les poids du modèle de base ont été modifiés pour réduire les refus.",
    },
    fineTuned: {
      name: "Avec entraînement ciblé",
      line: "Un modèle existant a reçu un entraînement ciblé pour répondre avec moins de restrictions.",
    },
    unlisted: {
      name: "Méthode non précisée",
      line: "Ce modèle appartient à la catégorie non censurée. Sa méthode d’entraînement ou de filtrage reste indéterminée.",
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
      imageGen: "Générer des images dans le chat",
      longContext: "Des livres ou bases de code entiers en un seul prompt",
      budget: "Gros volumes avec un petit budget",
      tools: "Travail d'agent avec outils : recherche, mémoire, code",
      uncensored: "Les questions que les modèles grand public refusent",
      ownWorldview: "Des positions politiques à contre-courant",
    },
    skipItems: {
      noTools: "Workflows d'agent : pas d'appel d'outils",
      noImages: "Tâches qui nécessitent des images en entrée",
      pricey:
        "Traitement en volume à {{credits}} crédits par message de référence",
      smallContext:
        "Très longs documents : le contexte s'arrête à {{tokens}} tokens",
      filtered:
        "Sujets filtrés par {{lab}} : prenez un modèle non censuré pour ceux-là",
      legacy: "Nouveaux projets : {{successor}} le remplace",
      legacyNoSuccessor: "Nouveaux projets : c'est un ancien modèle",
      coding: "Programmation complexe",
      analysis: "Analyse approfondie",
      reasoning: "Raisonnement complexe",
      creative: "Écriture créative",
      roleplay: "Jeu de rôle",
    },
    media: {
      image: "Générer des images",
      video: "Générer des clips vidéo",
      audio: "Générer de la musique",
      tts: "Transformer un texte écrit en parole",
      stt: "Transcrire des enregistrements vocaux",
      otherOutputs:
        "Tâches qui exigent un format de sortie autre que {{outputs}}",
    },
    picks: {
      claudeOpus:
        "Le poids lourd d'Anthropic pour le travail difficile : grosses bases de code, analyses minutieuses, textes qui demandent du jugement. Plus cher par message, à réserver aux tâches où la qualité paie.",
      claudeSonnet:
        "Le Claude du quotidien. Solide en code, analyse et rédaction, et moins cher qu'Opus : il tient le travail de tous les jours sans vider vos crédits.",
      claudeHaiku:
        "Un Claude rapide et économique pour les réponses courtes, les résumés et le code simple. Il lit aussi les captures d'écran.",
      gptSol:
        "Sol convient à la programmation au quotidien, à l’analyse de documents et aux tâches qui exigent des outils. Il accepte le texte et les images.",
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
        "GLM 5.3 avec ablation pour le raisonnement, le code et l’analyse. Il peut appeler des outils.",
      glmFlashUncensored:
        "GLM 5.3 Flash avec ablation pour les réponses rapides et les demandes avec images.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash avec ablation pour le code, l’analyse et la fiction. Il accepte les images.",
      veniceUncensored:
        "Le modèle de chat de Venice optimisé pour l’écriture créative et le jeu de rôle.",
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
  plans: {
    heading: "{{model}} : ce que couvre chaque formule",
    intro:
      "Un message de référence avec {{model}} coûte environ {{credits}} crédits ({{money}}). Voici ce que chaque formule couvre en un mois.",
    mediaIntro:
      "Avec {{model}}, une utilisation ({{unit}}) coûte {{credits}} crédits ({{money}}). Voici ce que chaque formule couvre en un mois.",
    messages: "Messages par mois",
    uses: "Utilisations par mois",
    colPlan: "Formule",
    colPrice: "Prix par mois",
    colCredits: "Crédits par mois",
    guest: "Invité, sans inscription",
    account: "Compte gratuit",
    free: "Gratuit",
    about: "environ {{count}}",
    underOne: "moins de 1",
    footnote:
      "Les longs prompts, les fichiers et les appels d’outils consomment plus de crédits par message. Les mêmes crédits valent pour tous les modèles.",
    mediaFootnote:
      "La durée, la taille ou la qualité modifient le prix par utilisation. Les mêmes crédits valent pour tous les modèles.",
  },
  nearest: {
    heading: "{{model}} face aux alternatives les plus proches",
    intro:
      "Prix, contexte et niveau côte à côte. Le comparatif détaillé donne tout le reste.",
    colModel: "Modèle",
    colPrice: "Prix par message",
    colCompare: "Comparatif",
    thisModel: "Cette page",
  },
  faq: {
    heading: "{{model}} : questions et réponses",
    price: {
      q: "Combien coûte {{model}} ?",
      aTokens:
        "Un message de référence via {{provider}} coûte environ {{credits}} crédits ({{money}}). Par million de tokens, comptez {{input}} en entrée et {{output}} pour le texte en sortie.",
      aFlat:
        "Un message via {{provider}} coûte {{credits}} crédits ({{money}}).",
      aFree: "{{model}} ne coûte aucun crédit par message.",
    },
    uncensored: {
      q: "{{model}} est-il non censuré ?",
      mainstream:
        "Non. {{model}} garde les filtres de sécurité de {{lab}} et refuse certains sujets. Pour ceux-là, passez à un modèle non censuré dans le même chat.",
      open: "{{model}} appartient à la catégorie « Ouvert ». Ses réponses peuvent encore être filtrées.",
      yes: "Oui.",
      consent:
        "Pour utiliser un modèle de chat non censuré, confirmez une fois que vous avez au moins 18 ans.",
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
    providers: {
      q: "Quels fournisseurs proposent {{model}} sur cette plateforme ?",
      a: "Fournisseurs disponibles : {{providers}}.",
    },
    inputs: {
      q: "Quels formats {{model}} accepte-t-il et produit-il ?",
      modalities: "Entrée : {{inputs}}. Sortie : {{outputs}}.",
      toolsYes: "Le modèle peut appeler des outils.",
      toolsNo: "Le modèle ne peut pas appeler d’outils.",
    },
    bestFor: {
      q: "À quoi sert {{model}} ?",
      a: "Idéal pour : {{items}}.",
    },
    cheaper: {
      q: "Existe-t-il une alternative moins chère à {{model}} ?",
      a: "{{other}} : même catégorie, niveau d'intelligence égal ou supérieur, et environ {{otherCredits}} crédits par message de référence au lieu de {{credits}}.",
    },
    free: {
      q: "{{model}} est-il gratuit ?",
      a: "Pour l’essayer, oui. Les invités reçoivent {{guest}} crédits par mois sans inscription, soit environ {{guestMessages}} messages avec {{model}}. Un compte gratuit en contient {{account}}, soit environ {{accountMessages}} messages. Les formules commencent à {{planPrice}} par mois pour {{planCredits}} crédits, soit environ {{planMessages}} messages.",
      aAccount:
        "Un message de référence coûte {{credits}} crédits, plus que les {{guest}} crédits invité. Un compte gratuit contient {{account}} crédits par mois, soit environ {{accountMessages}} messages avec {{model}}. Les formules commencent à {{planPrice}} par mois pour {{planCredits}} crédits, soit environ {{planMessages}} messages.",
      aPaid:
        "Pas avec l’offre gratuite. Un message de référence coûte {{credits}} crédits, plus que les {{account}} crédits gratuits du mois. Les formules commencent à {{planPrice}} par mois pour {{planCredits}} crédits, soit environ {{planMessages}} messages avec {{model}}.",
    },
    versus: {
      q: "{{model}} ou {{other}} : lequel choisir ?",
      a: "{{model}} coûte environ {{credits}} crédits par message de référence, offre une fenêtre de contexte de {{context}} tokens et appartient au niveau {{tier}}. {{other}} coûte environ {{otherCredits}} crédits, offre {{otherContext}} tokens de contexte et appartient au niveau {{otherTier}}. Les deux tournent dans le même chat : changez en pleine conversation et jugez sur pièce.",
    },
    try: {
      q: "Comment essayer {{model}} ?",
      a: "Ouvrez un chat avec {{model}} déjà sélectionné. Les nouveaux visiteurs reçoivent des crédits offerts pour commencer, sans carte.",
      aLegacy:
        "{{model}} est un ancien modèle. Les nouveaux chats utilisent {{successor}}, à essayer avec des crédits offerts, sans carte.",
    },
  },
  mediaFaq: {
    price: {
      q: "Combien coûte {{model}} ?",
      a: "Avec {{provider}}, comptez {{credits}} crédits ({{money}}) par {{unit}}. La durée, la taille et les options peuvent modifier le tarif.",
      aNone: "Le tarif de référence est actuellement indisponible.",
    },
    use: {
      q: "Comment utiliser {{model}} ?",
      a: "Ouvrez l’outil de création avec {{model}} déjà sélectionné.",
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
      uncensored: "Ce modèle appartient à la catégorie non censurée.",
      consent:
        "Les modèles non censurés demandent une confirmation 18+ unique.",
    },
  },
  readMore: {
    heading: "À lire aussi",
    landings: {
      uncensored: {
        title: "Chat IA sans censure dans votre navigateur",
        excerpt:
          "Tous les modèles non censurés sur une page : contexte, prix par message et lien direct vers le chat.",
      },
      abliterated: {
        title: "Modèles IA abliterated à tester en ligne",
        excerpt:
          "Des modèles grand public sans refus. Contexte, prix par message et lien direct vers le chat.",
      },
    },
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
    perMessage: "message de référence",
    perCacheReadTokens: "tokens lus en cache",
    perCacheWrite1hTokens: "tokens écrits en cache pour une heure",
    perCacheWriteTokens: "tokens écrits en cache",
    perInputTokens: "tokens en entrée",
    perOutputTokens: "tokens en sortie",
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
    chatCta: "Essayer {{model}} dans le chat",
    compareCta: "Comparer",
    legacyBanner:
      "{{model}} est un ancien modèle. Ouvrez {{successor}} pour lancer une nouvelle conversation.",
    legacyCta: "Voir {{successor}}",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Essayez {{model}} maintenant.",
    ctaSubtitle:
      "Des crédits offerts pour commencer, sans carte. Le chat s'ouvre avec {{model}} sélectionné et un prompt prêt : il ne reste qu'à envoyer.",
  },
  media: {
    priceValue: "{{credits}} crédits par {{unit}}",
    priceProvider: "Environ {{price}} via {{provider}}.",
    priceLabel: "Prix par usage",
    generateCta: "Générer avec {{model}}",
    useCta: "Utiliser {{model}}",
    priceFootnote:
      "L’estimation utilise le tarif du pack de crédits à l’unité, soit {{value}} par crédit.",
    ctaTitle: "Essayez {{model}} maintenant.",
    ctaSubtitle:
      "Des crédits offerts pour commencer, sans carte. Le générateur s'ouvre avec {{model}} déjà choisi.",
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
    modelPage: "Détails de {{model}}",
    swap: "Inverser",
    cheaperFree: "{{model}} ne coûte aucun crédit par message.",
    tierLine:
      "{{model}} est dans la catégorie {{tier}}, {{other}} dans la catégorie {{otherTier}}.",
    verdictHeading: "Lequel choisir ?",
    verdictIntro:
      "Directement tiré des données : prix, contexte, filtres, entrées. Aucune promesse de benchmark.",
    edge: "Là où {{model}} prend l’avantage",
    noEdge: "Aucun avantage sur {{other}} selon les données que nous suivons.",
    similar:
      "Sur le papier, {{a}} et {{b}} se valent : mêmes filtres, prix proche, contexte proche. Envoyez le même prompt aux deux et gardez celui qui vous convient.",
    moreHeading: "Autres comparatifs",
    moreWith: "Autres comparatifs avec {{model}}",
    both: "{{a}} et {{b}}",
    pick: {
      cheaper:
        "Moins cher : {{money}} au lieu de {{otherMoney}} par message, {{times}}× moins.",
      free: "Aucun crédit par message.",
      context:
        "Plus de contexte : {{tokens}} tokens (environ {{pages}} pages) au lieu de {{otherTokens}}.",
      lessFiltered:
        "Moins de filtres : catégorie {{tier}} au lieu de {{otherTier}}.",
      mainstream:
        "Filtres de sécurité de {{lab}}, pensé pour le travail et la recherche.",
      kind: {
        ownWorldview:
          "Sa propre vision du monde : entraîné sur des livres et documents bannis de l’internet grand public.",
        abliterated:
          "Avec ablation : les poids du modèle de base ont été modifiés pour réduire les refus.",
        fineTuned: "Entraînement ciblé pour des réponses moins restreintes.",
      },
      smarter:
        "Niveau d’intelligence supérieur : {{level}} au lieu de {{otherLevel}}.",
      fast: "Vitesse : les réponses rapides sont un point fort déclaré.",
      strengths: "Réputé pour : {{list}}. {{other}} ne le revendique pas.",
      inputs: "Lit : {{list}}. {{other}} non.",
      imageOutput: "Génère des images directement dans le chat.",
      tools: "Appels d’outils pour le travail en agent. {{other}} n’en a pas.",
      current: "Modèle actuel. {{other}} est un ancien modèle.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Lequel est le moins cher, {{a}} ou {{b}} ?",
      same: "À peu près pareil. {{a}} coûte environ {{creditsA}} crédits ({{moneyA}}) par message, {{b}} environ {{creditsB}} crédits ({{moneyB}}).",
      diff: "{{cheap}}. Il coûte environ {{cheapCredits}} crédits ({{cheapMoney}}) par message, contre environ {{dearCredits}} crédits ({{dearMoney}}) pour {{dear}} : {{times}}× plus.",
      diffFree:
        "{{cheap}}. Il ne coûte aucun crédit par message, contre environ {{dearCredits}} crédits ({{dearMoney}}) pour {{dear}}.",
      reference:
        "L’estimation porte sur un message de référence de {{input}} tokens en entrée et {{output}} tokens en sortie. Vous payez les tokens réellement utilisés.",
      rates:
        "{{model}} via {{provider}} : {{input}} par million de tokens en entrée, {{output}} par million de tokens en sortie.",
      fixed: "{{model}} via {{provider}} : prix fixe par message.",
      credit: "Un crédit vaut {{value}} au tarif des packs de crédits.",
    },
    context: {
      q: "Lequel a le plus de contexte, {{a}} ou {{b}} ?",
      diff: "{{big}} : {{bigTokens}} tokens (environ {{bigPages}} pages) contre {{smallTokens}} tokens (environ {{smallPages}} pages) pour {{small}}. Soit {{times}}× plus.",
      same: "Pas de grande différence. {{big}} tient {{bigTokens}} tokens (environ {{bigPages}} pages), {{small}} {{smallTokens}} tokens (environ {{smallPages}} pages).",
      equal:
        "Autant l’un que l’autre : {{bigTokens}} tokens chacun, environ {{bigPages}} pages de texte.",
    },
    smarter: {
      q: "Lequel est le meilleur pour les tâches difficiles, {{a}} ou {{b}} ?",
      diff: "{{model}} a le niveau d’intelligence le plus élevé : {{level}} contre {{otherLevel}} pour {{other}}.",
      same: "Les deux ont le même niveau d’intelligence : {{level}}.",
      known: "{{model}} est réputé pour : {{list}}.",
      knownBoth: "Les deux sont réputés pour : {{list}}.",
      source:
        "Niveaux et points forts viennent de notre catalogue de modèles, pas d’un benchmark.",
    },
    inputs: {
      q: "Que peuvent lire et produire {{a}} et {{b}} ?",
      line: "{{model}} : entrée {{inputs}}, sortie {{outputs}}, {{tools}}.",
      toolsYes: "avec appels d’outils",
      toolsNo: "sans appels d’outils",
    },
    api: {
      q: "Puis-je utiliser {{a}} et {{b}} via l’API ?",
      both: "Oui. Appelez {{idA}} ou {{idB}} sur l’API {{appName}}, compatible avec les formats OpenAI et Anthropic. Une seule clé pour les deux. L’API demande un compte payant : n’importe quelle offre.",
      one: "{{model}} est disponible sur l’API sous l’ID {{id}} (compte payant, n’importe quelle offre).",
    },
    try: {
      q: "Comment essayer {{a}} et {{b}} ?",
      a: "Ouvrez un chat avec l’un des deux modèles et changez en pleine conversation via le sélecteur de modèle. Les nouveaux visiteurs reçoivent des crédits offerts pour commencer, sans carte.",
    },
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
    categoryNames: {
      politics: "Politique",
      history: "Histoire",
      health: "Santé",
      drugs: "Drogues",
      sexuality: "Sexualité",
      security: "Sécurité informatique",
      religion: "Religion",
      law: "Droit",
      science: "Science",
      fiction: "Fiction",
      satire: "Satire",
    },
  },
};
