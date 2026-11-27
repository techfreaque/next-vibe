import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à SillyTavern : jeu de rôle sans installation",
    description:
      "SillyTavern est gratuit mais exige Node.js, un backend, et ne tourne pas sur iPhone. Comparez {{appName}}, RisuAI, Agnaistic, KoboldCpp, Janitor AI.",
    category: "Comparatif",
    imageAlt: "Les alternatives à SillyTavern, hébergées et locales, comparées",
    keywords:
      "alternatives à SillyTavern, alternative à SillyTavern, applis comme SillyTavern, SillyTavern sur iPhone, SillyTavern en ligne, SillyTavern sans installation, RisuAI vs SillyTavern, KoboldCpp, Agnaistic, interface de jeu de rôle IA, SillyTavern alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title: "Alternatives à SillyTavern, sans la configuration",
    subtitle:
      "{{count}} alternatives et {{appName}}, des autres interfaces open source aux chats hébergés. Vérifiées sur leurs propres pages le {{date}}.",
  },
  intro: {
    lead: "SillyTavern est l'outil des experts du jeu de rôle IA. Gratuit, open source, configurable à l'infini. Il réclame aussi Node.js, un backend de modèle, un fichier de configuration et, sur téléphone, Termux.",
    p2: "Certains adorent ça. D'autres veulent juste écrire. Voici les alternatives, des clones open source qui lisent les mêmes fiches aux applis hébergées sans rien à installer, vérifiées le {{date}}.",
  },
  subject: {
    title: "SillyTavern aujourd'hui",
    intro:
      "La version 1.19.1 est sortie le 19 novembre 2026. Voici ce que dit la documentation du projet.",
    plans:
      "Prix : gratuit et open source (AGPL-3.0). Les développeurs ne proposent aucun service hébergé : vous payez l'API de modèle que vous branchez, ou rien avec un modèle local.",
    filter:
      "Filtre : aucun qui lui soit propre. Le modèle ou le fournisseur connecté décide de ce qui est permis.",
    privacy:
      "Confidentialité : les chats vivent dans le dossier de données de votre propre installation. Tout ce que vous envoyez à une API cloud suit la politique de ce fournisseur.",
    extra:
      "Installation : Node.js 20 ou plus récent, Git, puis un backend. Sur Android, il tourne via Termux. Sur iPhone, impossible de l'installer. L'accès à distance exige une liste blanche ou un mot de passe, et la documentation déconseille de l'exposer à internet.",
  },
  why: {
    title: "Pourquoi chercher ailleurs",
    intro: "Les quatre mêmes reproches, dans les mots du projet lui-même.",
    setup:
      "La configuration du backend. Les backends locaux peuvent être complexes, et l'équipe ne les prend pas en charge.",
    mobile:
      "Le mobile. Android exige Termux et peut tuer le serveur en arrière-plan. Sur iPhone, aucune installation possible.",
    security:
      "La sécurité est votre affaire. La version 1.19.1 a corrigé des scripts qui s'exécutaient depuis des fiches de personnage et des chats importés.",
    cost: "Payer deux fois. Un hébergeur géré facture l'hébergement seul, et l'API du modèle s'ajoute par-dessus.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions font le tri.",
    one: "Installation : navigateur, appli de bureau ou serveur que vous faites tourner et mettez à jour.",
    two: "Fiches : importe-t-il les fiches PNG ou JSON et les lorebooks de SillyTavern et de Chub ?",
    three:
      "Modèles : votre propre clé d'API, exécution en local, ou modèles inclus.",
    four: "Fonctions : chats de groupe, lorebooks, génération d'images et voix.",
    five: "Coût : logiciel gratuit plus frais d'API, forfait fixe ou paiement au message.",
  },
  table: {
    title: "Tous côte à côte",
  },
  us: {
    title: "{{appName}} : rien à installer, modèles inclus",
    intro:
      "Ouvrez un navigateur sur n'importe quel appareil, iPhone compris. {{modelCount}} modèles sont déjà connectés : aucune clé d'API à coller.",
    models:
      "Modèles : {{uncensored}} non censurés à côté de {{mainstream}} grand public et {{open}} ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    fit: "Personnages : la compétence Jeu de rôle ou votre propre personnage sous forme de compétence. La mémoire garde les faits d'un chat à l'autre, et {{imageModels}} modèles d'image illustrent une scène dans le même fil.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte, {{maxCredits}} avec la newsletter. Abonnements : {{planList}}. Un seul solde pour tous les modèles.",
    api: "API : des endpoints compatibles OpenAI et Anthropic, vous pouvez donc toujours brancher SillyTavern sur nos modèles. N'importe quel achat la débloque.",
    weak: "Là où SillyTavern gagne : le contrôle total des prompts, des presets et des extensions, les chats de groupe, les lorebooks et l'import de fiches. Le nôtre est open source aussi, mais c'est une plateforme, pas une boîte à outils de jeu de rôle.",
    ownLink: "Voir {{ownModel}}",
    skillLink: "Lancer la compétence Jeu de rôle",
  },
  list: {
    title: "Les alternatives documentées, une par une",
    intro:
      "Les plateformes qui ont un profil complet dans nos données de comparaison, vérifiées sur leurs propres pages. Les interfaces open source figurent dans le tableau ci-dessus.",
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
    title: "Quand SillyTavern reste le bon choix",
    intro: "Pour beaucoup d'utilisateurs avancés, c'est le cas.",
    one: "Vous faites tourner vos modèles en local et voulez que rien ne quitte votre machine.",
    two: "Vous vivez dans les extensions, les presets, les règles regex et les chats de groupe.",
    three:
      "Vous avez déjà des clés d'API et voulez une seule interface pour toutes. La nôtre peut être l'une de ces clés.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à SillyTavern ?",
      a: "Le clone le plus proche : RisuAI, open source avec lorebooks, chats de groupe et une version web. Local et simple : KoboldCpp ou LM Studio. Une bibliothèque de personnages hébergée : Janitor AI ou Chub. Rien à installer, modèles inclus : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à SillyTavern ?",
      a: "RisuAI, Agnaistic, KoboldCpp et Talemate sont des logiciels gratuits. Vous payez quand même le modèle, sauf à le faire tourner sur votre propre matériel. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte, {{maxCredits}} avec la newsletter, modèles inclus.",
    },
    filter: {
      q: "Quelles alternatives autorisent le jeu de rôle non censuré ?",
      a: "Les interfaces héritent des règles du modèle : choisissez donc un modèle non censuré. En local, KoboldCpp ou LM Studio font tourner des modèles abliterated. Côté hébergé, {{appName}} propose {{uncensored}} modèles non censurés après une confirmation 18+ unique. Janitor AI et Chub autorisent le jeu de rôle adulte selon leurs propres règles.",
    },
    privacy: {
      q: "Une alternative hébergée est-elle aussi privée que SillyTavern ?",
      a: "Pas tout à fait. Un modèle local garde tout sur votre machine. Un modèle hébergé voit toujours le prompt auquel il répond. Le mode incognito de {{appName}} garde l'historique dans votre navigateur plutôt que sur un serveur.",
    },
    move: {
      q: "Peut-on utiliser SillyTavern sur iPhone ?",
      a: "Pas directement. Vous l'hébergez sur un PC ou un serveur et l'ouvrez dans Safari, ce qui implique de configurer l'accès à distance. Une appli web comme {{appName}} ou Janitor AI fonctionne sur iPhone sans cette étape.",
    },
  },
  cta: {
    title: "Oubliez la configuration. Gardez l'histoire.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte ni clé d'API.",
    start: "Lancer un jeu de rôle",
    chat: "Ouvrir un chat incognito",
  },
};
