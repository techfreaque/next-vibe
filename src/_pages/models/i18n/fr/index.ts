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
      title:
        "{{model}} par {{lab}} : prix, contexte, mode d'emploi | {{appName}}",
      description:
        "{{model}} par {{lab}} : niveau {{tier}}, {{context}} tokens de contexte, environ {{price}} crédits par message. Discutez avec lui sur {{appName}}, sans abonnement.",
      imageAlt: "{{model}} sur {{appName}}",
      keywords:
        "{{model}}, prix {{model}}, fenêtre de contexte {{model}}, IA {{lab}}, {{appName}}",
    },
    media: {
      title:
        "{{model}} par {{lab}} : prix {{type}}, mode d'emploi | {{appName}}",
      description:
        "{{model}} par {{lab}} : modèle {{type}}, niveau {{tier}}. Prix réel par usage, en crédits. Utilisez-le sur {{appName}}, sans abonnement.",
      imageAlt: "{{model}} sur {{appName}}",
      keywords:
        "{{model}}, prix {{model}}, IA {{lab}}, modèle d'IA {{type}}, {{appName}}",
    },
    compare: {
      title:
        "{{a}} vs {{b}} : prix, contexte et entrées comparés | {{appName}}",
      description:
        "{{a}} vs {{b}}, côte à côte : prix par message, fenêtre de contexte, entrées, sorties, fournisseurs et niveau de contenu. Essayez les deux sur {{appName}}.",
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
      line: "Deux familles, qui répondent à tout. La plupart sont des modèles grand public dont on a retiré le réflexe de refus : même entraînement, même vision du monde, plus aucune esquive. UncensoredLM est l'autre famille : son propre entraînement, sa propre vision du monde, des positions politiques à contre-courant.",
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
      "Sans abonnement. Des crédits offerts pour commencer. Le chat s'ouvre avec {{model}} sélectionné et un prompt prêt : il ne reste qu'à envoyer.",
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
      "Sans abonnement. Des crédits offerts pour commencer. L'outil s'ouvre prêt à l'emploi.",
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
      "Comment {{model}} a traité la série de questions fixe lors du dernier passage hebdomadaire ({{date}}).",
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
