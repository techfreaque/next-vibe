import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à Claude : avec et sans filtre (2026)",
    description:
      "Claude bute sur ses limites d'usage et refuse la fiction. Comparez {{appName}}, ChatGPT, Gemini, Grok, DeepSeek, Kimi, Venice, NanoGPT, OpenRouter et les applis locales : prix et filtres.",
    category: "Comparatif",
    imageAlt: "Les alternatives à Claude, avec et sans filtre, comparées",
    keywords:
      "alternatives à Claude, alternative à Claude, alternative à Claude AI, sites comme Claude, alternative à Claude sans limite, alternative à Claude sans filtre, alternative non censurée à Claude, Claude vs ChatGPT, Claude vs Gemini, alternative à Claude Pro, Claude alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "10 min de lecture",
    title: "Alternatives à Claude, avec et sans filtre",
    subtitle:
      "{{count}} alternatives et {{appName}}, des assistants grand public aux modèles non censurés. Vérifiées sur leurs propres pages le {{date}}.",
  },
  intro: {
    lead: "Claude compte parmi les meilleurs pour écrire et coder. Il tombe aussi à court de messages au pire moment, et sa politique d'utilisation interdit le chat érotique sur toutes les offres.",
    p2: "Il existe donc deux sortes d'alternatives : d'autres assistants grand public pour quand vous atteignez la limite, et des modèles non censurés pour ce que Claude refuse. Voici les deux, vérifiées le {{date}}. Nous faisons aussi tourner Claude, alors nous disons où il garde l'avantage.",
  },
  subject: {
    title: "Claude aujourd'hui",
    intro:
      "D'après les pages de tarifs, de politique d'utilisation et de confidentialité d'Anthropic.",
    plans:
      "Prix : gratuit avec des limites qui se réinitialisent toutes les 5 heures et chaque semaine. Payant : {{plans}}. Anthropic ne publie aucun nombre exact de messages, et a confirmé resserrer les limites aux heures de pointe en semaine.",
    filter:
      "Filtre : la politique d'utilisation interdit le contenu sexuellement explicite et le chat érotique, ainsi que le contenu qui glorifie la violence graphique. Il n'existe pas d'offre adulte.",
    privacy:
      "Confidentialité : vous choisissez si vos chats entraînent le modèle. Entraînement activé, les chats anonymisés sont conservés jusqu'à cinq ans. Désactivé, 30 jours.",
    extra:
      "Médias : pas de génération d'images ni de vidéo. Claude dessine des graphiques et des diagrammes à partir de code et dispose d'un mode vocal.",
  },
  why: {
    title: "Pourquoi chercher ailleurs",
    intro: "Quatre raisons, chacune tirée d'une source publique.",
    limits:
      "Les limites d'usage. Anthropic a confirmé en mars 2026 raccourcir les limites de 5 heures aux heures de pointe.",
    refusals:
      "Les refus. Les modèles Claude récents résistent aux prémisses de fiction et se trompent sur l'intention.",
    adult:
      "Pas d'offre adulte. Le chat érotique est interdit sur toutes les offres, dans toutes les applis.",
    price: "Le prix. Plus d'usage, c'est Max à $100 ou Ultra à $200 par mois.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions tranchent.",
    one: "Qualité : rédaction, code et raisonnement sur vos propres tâches, pas sur des benchmarks.",
    two: "Limites : plafonds de messages, fenêtres de réinitialisation, ou paiement à l'usage sans plafond.",
    three:
      "Filtre : ce que le modèle refuse, et si vous pouvez en choisir un autre.",
    four: "Confidentialité : réglages d'entraînement, durée de conservation, et ce qui reste sur votre appareil.",
    five: "Extras : images, vidéo, recherche web, une API, et le prix de chacun.",
  },
  table: {
    title: "Tous côte à côte",
  },
  us: {
    title: "{{appName}} : Claude, plus des modèles sans ses règles",
    intro:
      "{{modelCount}} modèles dans un seul chat, Claude compris. Vous changez de modèle à chaque message et gardez le fil.",
    models:
      "Modèles : {{uncensored}} non censurés à côté de {{mainstream}} grand public et {{open}} ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    fit: "Pas de fenêtre de 5 heures : vous payez au message sur un seul solde, donc vous continuez tant que vous avez des crédits. Images, vidéo et musique utilisent le même solde.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Abonnements : {{planList}}.",
    api: "API : des endpoints compatibles OpenAI et Anthropic, Claude compris. N'importe quel achat la débloque.",
    weak: "Là où Claude gagne : Claude Code, Projects et Cowork sont les applis d'Anthropic, et un usage quotidien intensif de Claude lui-même coûte moins cher avec un abonnement Claude qu'au message avec notre marge de {{markup}} %. Sur {{appName}}, Claude suit aussi la politique d'Anthropic.",
    ownLink: "Voir {{ownModel}}",
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
  },
  list: {
    title: "Les alternatives documentées, une par une",
    intro:
      "Les plateformes qui ont un profil complet dans nos données de comparaison, vérifiées sur leurs propres pages. ChatGPT, Gemini, Grok et les autres assistants figurent dans le tableau ci-dessus.",
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
    title: "Quand Claude reste le bon choix",
    intro: "Pour beaucoup de travail, c'est le cas.",
    one: "Vous codez toute la journée dans Claude Code et l'abonnement le couvre.",
    two: "Vous vivez dans Projects et voulez les applis d'Anthropic sur tous vos appareils.",
    three:
      "Vos textes ne touchent jamais au contenu que sa politique interdit.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à Claude ?",
      a: "Pour un assistant généraliste : ChatGPT ou Gemini. Pour des recherches avec sources : Perplexity. Pour des modèles ouverts qui refusent moins : Kimi, GLM ou DeepSeek. Pour des modèles non censurés à côté de Claude dans le même fil : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Claude ?",
      a: "ChatGPT, Gemini, Grok, DeepSeek et Mistral ont tous une offre gratuite avec des limites. LM Studio et Ollama sont gratuits sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, Claude compris.",
    },
    filter: {
      q: "Existe-t-il un Claude non censuré ?",
      a: "Non. Les poids de Claude sont fermés et sa politique s'applique partout. Ce qui marche, c'est un autre modèle pour les scènes que Claude refuse. Sur {{appName}}, {{uncensored}} modèles non censurés se débloquent après une confirmation 18+ unique, dans le même fil que Claude.",
    },
    privacy: {
      q: "Quelle alternative à Claude est la plus privée ?",
      a: "Un modèle local dans LM Studio ou Ollama n'envoie votre prompt nulle part. Côté hébergé, cherchez une option de refus de l'entraînement et une conservation courte. Le mode incognito de {{appName}} garde l'historique dans votre navigateur.",
    },
    move: {
      q: "Puis-je continuer à utiliser Claude après avoir changé ?",
      a: "Oui. {{appName}}, OpenRouter, NanoGPT et Poe proposent tous les modèles Claude. Utilisez Claude pour ce qu'il fait le mieux et changez de modèle pour le reste.",
    },
  },
  cta: {
    title: "Gardez Claude. Faites tomber les murs.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Claude et des modèles non censurés dans un seul chat.",
    start: "Lancer un chat incognito",
    models: "Comparer tous les modèles",
  },
};
