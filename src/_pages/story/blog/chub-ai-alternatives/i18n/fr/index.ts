import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Alternatives à Chub AI : personnages, lorebooks et prix (2026)",
    description:
      "Chub AI ne prend plus que la crypto et plafonne le chat gratuit. Comparez {{appName}}, Janitor AI, SillyTavern, RisuAI, SpicyChat, CrushOn : prix, filtres.",
    category: "Comparatif",
    imageAlt:
      "Les alternatives à Chub AI pour le jeu de rôle avec des personnages, comparées",
    keywords:
      "alternatives à Chub AI, alternative à Chub AI, sites comme Chub AI, alternative chub.ai, alternative à Chub Venus, chat avec fiches de personnage, cartes de personnage, IA de personnages non censurée, jeu de rôle avec lorebook, alternative à l'appli Chub AI, Janitor AI vs Chub, Chub AI alternatives, {{appName}}",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Comparatif",
    readTime: "9 min de lecture",
    title: "Alternatives à Chub AI pour le jeu de rôle",
    subtitle:
      "{{count}} alternatives et {{appName}}, vérifiées le {{date}} sur leurs propres pages de tarifs, de filtre et d'aide.",
  },
  intro: {
    lead: "Chub possède la plus grande bibliothèque ouverte de fiches de personnage du web. Depuis l'été 2026, il a aussi un paywall payable uniquement en crypto, un petit quota gratuit quotidien et aucune appli iPhone officielle.",
    p2: "Voici donc où emmener vos personnages. Chaque option ci-dessous a été vérifiée sur ses propres pages le {{date}}. Nous en faisons partie, et nous disons où Chub garde l'avantage.",
  },
  subject: {
    title: "Chub AI aujourd'hui",
    intro:
      "Ce que dit la documentation de Chub, plus ce que rapportent des testeurs indépendants sur le paywall.",
    plans:
      "Prix : {{plans}} pour ses propres modèles avec messages illimités, selon la documentation de Chub. Des testeurs rapportent que le paiement par carte a disparu en 2026 et que l'abonnement se règle en crypto.",
    filter:
      "Filtre : Chub se dit non censuré et ne restreint pas les personnages. Les fiches sont marquées SFW ou NSFW, et la recherche NSFW est bloquée dans certaines régions.",
    privacy:
      "Confidentialité : Chub affirme que ses modèles Mars n'ont pas été entraînés sur les chats de Chub. Avec votre propre backend, c'est la politique de ce fournisseur qui s'applique à tout ce que vous envoyez.",
    extra:
      "Voie gratuite : quelques messages d'essai et un petit quota quotidien sur un modèle de base, ou bien votre propre clé d'API ou un modèle local.",
  },
  why: {
    title: "Pourquoi chercher ailleurs",
    intro: "Trois raisons reviennent sans cesse.",
    paywall:
      "Le paywall a bougé. Le palier Mercury, moins cher, a été supprimé, le chat gratuit est plafonné par jour avec les swipes comptés, et le paiement ne passe plus que par la crypto.",
    mobile:
      "Pas d'appli officielle. La fiche iOS de Chub a disparu et des applis copiées utilisent désormais son nom.",
    setup:
      "Une prise en main exigeante. Une bonne session suppose toujours de maîtriser presets, modèles et réglages de contexte.",
  },
  criteria: {
    title: "Ce qu'il faut comparer avant de changer",
    intro: "Cinq questions décident où atterrissent vos personnages.",
    one: "Fiches : pouvez-vous importer les fiches PNG ou JSON de Chub, ou faut-il les reconstruire ?",
    two: "Mémoire : lorebooks, faits épinglés ou résumés qui gardent une longue histoire cohérente.",
    three:
      "Filtre : le contenu adulte permis à chaque palier, et s'il y a une vérification d'âge.",
    four: "Prix : quota gratuit, forfait fixe ou paiement au message, et les moyens de paiement acceptés.",
    five: "Appareils : navigateur, appli mobile ou installation locale que vous entretenez vous-même.",
  },
  table: {
    title: "Tous côte à côte",
  },
  us: {
    title: "{{appName}} : vos personnages sur n'importe quel modèle",
    intro:
      "{{modelCount}} modèles dans un seul chat. Votre personnage reste, le modèle derrière lui peut changer à chaque message.",
    models:
      "Modèles : {{uncensored}} non censurés à côté de {{mainstream}} grand public et {{open}} ouverts. {{ownModel}} est entraîné sur des livres et des documents bannis de l'internet grand public, avec pour résultat un modèle aux opinions politiques à contre-courant.",
    fit: "Personnages : lancez la compétence Jeu de rôle ou créez votre propre personnage sous forme de compétence, puis partagez-le ou gardez-le privé. La mémoire transporte les faits d'un chat à l'autre.",
    privacy:
      "Confidentialité : les chats incognito restent dans le stockage local de votre navigateur, sans compte.",
    price:
      "Prix : {{guestCredits}} crédits gratuits par mois sans compte, {{freeCredits}} avec un compte. Abonnements : {{planList}}, payables par carte ou en crypto. Les packs de crédits complètent un abonnement actif.",
    api: "API : les mêmes modèles via des endpoints compatibles OpenAI et Anthropic. N'importe quel achat la débloque.",
    weak: "Là où Chub gagne : sa bibliothèque de fiches est bien plus grande, et il a des lorebooks avec déclencheurs par mots-clés. Nous n'importons pas encore les fiches Chub : vous collez la description du personnage dans une nouvelle compétence.",
    ownLink: "Voir {{ownModel}}",
    skillLink: "Lancer la compétence Jeu de rôle",
  },
  list: {
    title: "Les alternatives documentées, une par une",
    intro:
      "Les plateformes qui ont un profil complet dans nos données de comparaison, vérifiées sur leurs propres pages. Les autres figurent dans le tableau ci-dessus.",
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
    title: "Quand Chub reste le bon choix",
    intro: "Parfois, l'original est la meilleure affaire.",
    one: "Vous voulez la plus grande bibliothèque publique de fiches et de lorebooks de la communauté, au même endroit.",
    two: "Vous faites déjà tourner votre propre backend. Chub sert alors d'interface gratuite.",
    three:
      "Vous payez déjà en crypto et voulez des messages illimités avec un seul forfait fixe.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "Quelle est la meilleure alternative à Chub AI ?",
      a: "Tout dépend de ce qui vous manque. Une grande bibliothèque de personnages dans le navigateur : Janitor AI ou Character Tavern. Le contrôle total avec vos propres fiches et lorebooks : SillyTavern ou RisuAI. Un compagnon qui se souvient de vous : Kindroid ou Nomi. Des personnages sur des modèles non censurés, ouverts et grand public, avec un seul solde : {{appName}}.",
    },
    free: {
      q: "Existe-t-il une alternative gratuite à Chub AI ?",
      a: "Oui. Perchance et Character Tavern sont gratuits dans le navigateur. SillyTavern, RisuAI et KoboldCpp sont des logiciels gratuits : vous ne payez que le modèle, ou vous le faites tourner en local. {{appName}} offre {{guestCredits}} crédits gratuits par mois sans compte et {{freeCredits}} avec un compte.",
    },
    filter: {
      q: "Quelles alternatives à Chub autorisent le jeu de rôle NSFW ?",
      a: "Janitor AI, CrushOn, SpicyChat et Venice autorisent le texte adulte selon leurs propres règles, le plus souvent après une vérification d'âge. Character.AI, non. Sur {{appName}}, les modèles non censurés se débloquent après une confirmation 18+ unique. Tous les services interdisent toujours les contenus impliquant des mineurs.",
    },
    privacy: {
      q: "Quelle alternative garde mon jeu de rôle privé ?",
      a: "Une installation locale : SillyTavern ou KoboldCpp avec un modèle sur votre propre PC n'envoie jamais un mot à l'extérieur. Côté hébergé, les chats incognito de {{appName}} restent dans le stockage local de votre navigateur. Tout modèle hébergé voit malgré tout les messages auxquels il répond.",
    },
    move: {
      q: "Puis-je transférer mes personnages Chub ?",
      a: "Téléchargez la fiche depuis Chub. SillyTavern, RisuAI et Agnaistic l'importent telle quelle. Sur {{appName}}, créez une compétence et collez-y la description, la personnalité et le premier message.",
    },
  },
  cta: {
    title: "Vos personnages. N'importe quel modèle.",
    subtitle:
      "{{guestCredits}} crédits gratuits par mois, sans compte. Lancez un jeu de rôle et changez de modèle quand l'histoire l'exige.",
    start: "Lancer un jeu de rôle",
    chat: "Ouvrir un chat incognito",
  },
};
