import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Alternatives à Venice AI : privées, non censurées, comparées (2026)",
    description:
      "Les alternatives à Venice AI comparées d'après leurs propres pages de tarifs, de confidentialité et de filtre : NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter, LM Studio et {{appName}}. Modèles, API, offres gratuites et pour qui.",
    category: "Comparatif",
    imageAlt: "Les alternatives à Venice AI comparées côte à côte",
    keywords:
      "alternatives à Venice AI, alternative à Venice AI, sites comme Venice AI, alternative Venice.ai, IA privée non censurée, alternative de chat IA non censuré, Venice AI vs NanoGPT, Venice AI vs FreedomGPT, IA non censurée avec API, chat IA privé, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title: "Alternatives à Venice AI. Privées, non censurées, vérifiées.",
    subtitle:
      "{{count}} alternatives et {{appName}}, comparées d'après ce que disent leurs propres pages de tarifs, de confidentialité et de filtre. Vérifié le {{date}}.",
  },
  intro: {
    lead: "Venice s'est fait un nom sur deux promesses : privé et non censuré. Il tient une bonne partie des deux. Mais l'offre gratuite est serrée, le filtre adulte exige Pro, et tout le monde ne veut pas d'une couche de staking crypto à côté de son chat.",
    p2: "Voici donc les alternatives, vérifiées le {{date}} sur leurs propres pages de tarifs, de confidentialité et de filtre. En toute transparence : nous achetons chez Venice. {{appName}} fait passer {{veniceModels}} modèles par Venice aujourd'hui, dont {{veniceUncensored}} non censurés. Nous disons aussi où Venice gagne.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions tranchent.",
    privacy:
      "Confidentialité : où vivent vos conversations, et quelqu'un s'entraîne-t-il dessus ? Sur l'appareil, sur le serveur, ou utilisées pour améliorer les modèles.",
    models:
      "Modèles : combien de non censurés, de quel type, et retrouvez-vous Claude, GPT et Gemini au même endroit ?",
    filter:
      "Filtre : ce qui est permis en gratuit, ce qui exige un abonnement, et s'il y a une vérification d'âge.",
    price:
      "Prix : quota gratuit, abonnement ou paiement à l'usage. Et ce qui se passe une fois la limite atteinte.",
    api: "API : pouvez-vous appeler les mêmes modèles depuis votre code, et dans quel format ?",
  },
  table: {
    title: "Tous côte à côte",
    intro:
      "Faites défiler sur le côté sur mobile. Données des concurrents vérifiées le {{date}} sur leurs propres pages. Données de {{appName}} lues en direct dans notre configuration. Venice clôt le tableau comme référence.",
  },
  us: {
    title: "{{appName}} : un seul chat, tous les types de modèles",
    intro:
      "{{modelCount}} modèles dans un seul chat avec un seul solde. Vous choisissez le niveau de filtre à chaque message.",
    models:
      "Modèles : {{uncensored}} non censurés à côté de {{mainstream}} grand public et {{open}} ouverts. Changez en pleine conversation. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    venice:
      "Venice à l'intérieur : {{veniceModels}} de nos modèles passent par Venice, dont {{veniceExamples}}. Les mêmes modèles, un seul compte avec tous les autres.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte. Les chats privés sont enregistrés uniquement dans votre compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Abonnements à partir de {{subPrice}} par mois. Les packs de crédits complètent un abonnement actif et n'expirent jamais.",
    api: "API : les mêmes modèles via des endpoints compatibles OpenAI et Anthropic. N'importe quel abonnement à partir de {{apiSubPrice}} par mois la débloque.",
    weak: "Là où nous sommes plus faibles : le catalogue de Venice est plus grand, et sur ses propres modèles Venice est moins cher au token, car nous ajoutons une marge à notre prix d'achat. Pas de couche de staking comme VVV ou DIEM.",
    directoryLink: "Tous les modèles abliterated, avec contexte et prix",
    ownLink: "Voir {{ownModel}}",
  },
  list: {
    title: "Les {{count}} alternatives, une par une",
    intro:
      "D'après leurs propres pages, vérifiées le {{date}}. Ce que chacune est, quels modèles elle propose, ce que son filtre permet et ce que deviennent vos conversations.",
    heading: "{{number}}. {{name}} : {{kind}}",
    models: "Modèles :",
    filter: "Filtre :",
    privacy: "Confidentialité :",
    price: "Prix :",
    priceValue: "Offre gratuite : {{free}}. Payant : {{plans}}.",
    pro: "Point fort :",
    con: "Revers :",
    forWho: "Choisissez-la si :",
    versusLink: "{{appName}} vs {{name}} : comparaison complète",
    visit: "Visiter {{name}}",
  },
  privacy: {
    title: "Confidentialité : la meilleure carte de Venice",
    intro:
      "La plupart des gens regardent Venice pour la confidentialité. Voici comment les autres se comparent.",
    us: "Sur {{appName}}, les chats incognito vivent dans le stockage local de votre navigateur, pas sur nos serveurs. Effacez les données du navigateur et ils disparaissent.",
    transit:
      "Tout modèle hébergé voit malgré tout votre prompt. Venice, NanoGPT, nous : le message doit atteindre le serveur qui fait tourner le modèle. Seul un outil local le garde sur votre machine.",
    callout:
      "Un historique sur l'appareil garde vos conversations hors des serveurs d'une entreprise. Il ne les cache pas au modèle qui rédige les réponses.",
  },
  stay: {
    title: "Quand Venice reste le bon choix",
    intro: "Parfois, l'original est la meilleure affaire.",
    crypto:
      "Vous détenez du VVV ou du DIEM, ou vous voulez payer des appels d'API sans compte. Personne d'autre dans cette liste ne le fait de la même façon.",
    versusLink: "{{appName}} vs Venice : le comparatif complet",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à Venice AI ?",
      a: "Tout dépend de la raison du départ. Paiement à l'usage et immense liste de modèles : NanoGPT. Confidentialité totale : LM Studio sur votre propre machine. Un modèle franc avec sa propre vision du monde : uncensored.ai. Modèles non censurés, ouverts et grand public, plus les médias, dans un seul chat avec un seul solde : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Venice AI ?",
      a: "Oui. FreedomGPT démarre gratuitement sans compte. LM Studio est gratuit sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, modèles non censurés compris après une confirmation 18+ unique.",
    },
    private: {
      q: "Quelle alternative à Venice est la plus privée ?",
      a: "Un outil local comme LM Studio : le modèle tourne sur votre appareil et les prompts ne le quittent jamais. Parmi les options hébergées, NanoGPT et le mode incognito de {{appName}} gardent l'historique dans votre navigateur. Tout modèle hébergé voit malgré tout le prompt auquel il répond.",
    },
    api: {
      q: "Quelle alternative propose une API non censurée ?",
      a: "NanoGPT, uncensored.ai, Gab AI, OpenRouter et {{appName}} proposent tous une API compatible OpenAI. L'offre de modèles non censurés varie beaucoup : OpenRouter en a peu, NanoGPT beaucoup. Sur {{appName}}, n'importe quel abonnement à partir de {{apiSubPrice}} par mois débloque l'API.",
    },
    same: {
      q: "Puis-je utiliser les modèles de Venice ailleurs ?",
      a: "Certains. {{appName}} fait tourner {{veniceModels}} modèles via Venice, dont {{veniceExamples}}, dans le même chat que Claude, GPT et les autres. OpenRouter et NanoGPT proposent aussi Venice Uncensored.",
    },
    account: {
      q: "Faut-il un compte pour essayer ?",
      a: "Pas sur {{appName}} : le chat incognito fonctionne sans compte. Un compte gratuit garde vos conversations sur tous vos appareils et porte le quota gratuit à {{freeCredits}} crédits par mois.",
    },
    noGpuLink: "Un LLM non censuré en ligne, sans GPU",
    apiLink: "API LLM non censurée : identifiants, code et limites",
  },
  cta: {
    title: "Privé quand vous voulez. Non censuré quand il le faut.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Démarrez en incognito et choisissez n'importe quel modèle.",
    start: "Lancer un chat incognito",
    models: "Comparer tous les modèles",
  },
};
