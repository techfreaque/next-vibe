import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à NanoGPT : IA à l'usage et non censurée (2026)",
    description:
      "NanoGPT a plafonné PRO, augmenté son prix et révélé des fuites de données chez ses fournisseurs. Comparez {{appName}}, OpenRouter, Venice, Featherless, Arli AI, Infermatic et d'autres.",
    category: "Comparatif",
    imageAlt:
      "Les alternatives à NanoGPT pour le paiement à l'usage et les modèles non censurés",
    keywords:
      "alternatives à NanoGPT, alternative à NanoGPT, alternative nano-gpt, sites comme NanoGPT, NanoGPT vs OpenRouter, IA en paiement à l'usage, API IA non censurée, API de modèles abliterated, alternative à Featherless, NanoGPT PRO, NanoGPT alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title:
      "Alternatives à NanoGPT pour le paiement à l'usage et les modèles non censurés",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées d'après leurs pages de tarifs, de confidentialité et de modèles, vérifiées le {{date}}.",
  },
  intro: {
    lead: "NanoGPT fait une chose très bien : tous les modèles, en paiement à l'usage, dès dix centimes. En 2026, il a aussi plafonné son offre PRO, augmenté le prix, suspendu une fois les inscriptions et révélé des expositions de prompts chez plusieurs fournisseurs en amont.",
    p2: "En toute transparence : nous achetons chez NanoGPT. {{appName}} fait passer {{nanoGptModels}} modèles par NanoGPT aujourd'hui, dont {{nanoGptUncensored}} non censurés. Voici les alternatives, vérifiées le {{date}}, et là où NanoGPT garde l'avantage.",
  },
  subject: {
    title: "NanoGPT aujourd'hui",
    intro:
      "D'après ses pages de tarifs, de conditions, de confidentialité et son blog.",
    plans:
      "Prix : paiement à l'usage dès $0.10 en crypto ou $1 par carte. PRO : {{plans}}, avec 60M tokens d'entrée par semaine sur une sélection de modèles ouverts et 100 images par jour. Claude, GPT, Gemini et Grok sont facturés sur votre solde.",
    filter:
      "Filtre : 18+, sans interdiction générale du contenu adulte. Les conditions interdisent les contenus sexuels impliquant des mineurs et les deepfakes de personnes réelles.",
    privacy:
      "Confidentialité : historique dans votre navigateur par défaut, synchronisation chiffrée en option. NanoGPT dit ne pas journaliser les prompts en usage normal, mais certaines routes autorisent l'entraînement.",
    extra:
      "Frais : la plupart des modèles au prix catalogue. Choisir un fournisseur, le Private Mode ou votre propre clé ajoute environ 5 %.",
  },
  why: {
    title: "Pourquoi chercher ailleurs",
    intro: "Quatre raisons, chacune tirée d'une source publique.",
    exposure:
      "Des fuites chez les fournisseurs. En novembre 2026, NanoGPT a révélé que des prompts et des réponses avaient été exposés chez plusieurs fournisseurs en amont pendant des semaines, voire des mois, et a abandonné ces routes.",
    caps: "Des plafonds. PRO est passé d'une entrée illimitée à 60M tokens d'entrée par semaine en février 2026, avec en plus des limites de rafale.",
    paused:
      "Inscriptions suspendues. Les nouvelles inscriptions PRO ont été stoppées en mars 2026 pour cause d'abus et d'instabilité.",
    reliability:
      "La fiabilité. Des avis se plaignent d'appels d'outils échoués qui coûtent quand même de l'argent.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions tranchent.",
    one: "Facturation : au token, au message, forfait fixe, et la recharge minimale.",
    two: "Modèles : combien de non censurés et d'abliterated, et retrouvez-vous aussi Claude, GPT et Gemini ?",
    three:
      "Confidentialité : qui journalise les prompts, quelles routes autorisent l'entraînement, ce qui reste sur votre appareil.",
    four: "API : format OpenAI ou Anthropic, et quel abonnement la débloque.",
    five: "Médias : images, vidéo, voix et musique sur le même solde.",
  },
  table: {
    title: "Tous côte à côte",
  },
  us: {
    title: "{{appName}} : tous les types de modèles, un seul solde",
    intro:
      "{{modelCount}} modèles dans un seul chat. Vous choisissez le niveau de filtre à chaque message.",
    models:
      "Modèles : {{uncensored}} non censurés à côté de {{mainstream}} grand public et {{open}} ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    fit: "NanoGPT à l'intérieur : {{nanoGptModels}} de nos modèles passent par NanoGPT, dont {{nanoGptExamples}}. Plus {{imageModels}} modèles d'image, {{videoModels}} de vidéo et {{musicModels}} de musique sur le même solde.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Abonnements : {{planList}}. Les packs de crédits complètent un abonnement actif et n'expirent jamais.",
    api: "API : des endpoints compatibles OpenAI et Anthropic. N'importe quel achat la débloque.",
    weak: "Là où nous sommes plus faibles : NanoGPT référence bien plus de modèles et facture la plupart au prix catalogue. Nous ajoutons une marge de {{markup}} % et il faut un abonnement avant d'acheter des packs de crédits.",
    ownLink: "Voir {{ownModel}}",
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
  },
  list: {
    title: "Les alternatives documentées, une par une",
    intro:
      "Les plateformes qui ont un profil complet dans nos données de comparaison, vérifiées sur leurs propres pages. Les hébergeurs de modèles à forfait et les passerelles figurent dans le tableau ci-dessus.",
    heading: "{{number}}. {{name}} : {{kind}}",
    models: "Modèles :",
    filter: "Filtre :",
    price: "Prix :",
    priceValue: "Offre gratuite : {{free}}. Payant : {{plans}}.",
    pro: "Point fort :",
    con: "Revers :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} vs {{name}} : comparaison complète",
    visit: "Visiter {{name}}",
  },
  stay: {
    title: "Quand NanoGPT reste le bon choix",
    intro: "Parfois, l'original est la meilleure affaire.",
    one: "Vous voulez la plus large liste de modèles au prix catalogue, sans aucun abonnement.",
    two: "Vous payez de petits montants en crypto, dès dix centimes, ou voulez payer l'API sans compte.",
    three:
      "Vous vivez sur les modèles ouverts et le quota de tokens PRO couvre votre mois.",
    versusLink: "{{appName}} vs NanoGPT : le comparatif complet",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à NanoGPT ?",
      a: "Pour les développeurs en paiement au token : OpenRouter. Pour la confidentialité et une appli créative : Venice. Pour des modèles ouverts et non censurés à forfait : Featherless ou Arli AI. Pour des modèles non censurés, ouverts et grand public, plus les médias, dans un seul chat avec un seul solde : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à NanoGPT ?",
      a: "OpenRouter a des limites quotidiennes sur ses modèles gratuits. LM Studio et Ollama sont gratuits sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte.",
    },
    filter: {
      q: "Quelles alternatives proposent des modèles non censurés ?",
      a: "Venice, uncensored.ai, Featherless, Arli AI, Infermatic et {{appName}} proposent tous des modèles non censurés ou abliterated. OpenRouter en a peu. Sur {{appName}}, ils se débloquent après une confirmation 18+ unique.",
    },
    privacy: {
      q: "Quelle alternative est la plus sûre pour des prompts privés ?",
      a: "Un outil local comme LM Studio ou Ollama garde les prompts sur votre machine. Côté hébergé, vérifiez quels fournisseurs en amont un service utilise et s'il journalise. Tout modèle hébergé voit le prompt auquel il répond.",
    },
    move: {
      q: "Puis-je changer sans réécrire mon code ?",
      a: "En grande partie. NanoGPT, OpenRouter et {{appName}} parlent le format OpenAI : vous changez l'URL de base, la clé et l'identifiant du modèle. {{appName}} parle aussi le format Anthropic.",
    },
  },
  cta: {
    title: "Tous les modèles. Un seul solde.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Démarrez en incognito et choisissez n'importe quel modèle.",
    start: "Lancer un chat incognito",
    models: "Comparer tous les modèles",
  },
};
