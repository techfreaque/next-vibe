import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Deux façons de gagner. Inutile de choisir.",
    description:
      "Le programme de parrainage {{appName}} expliqué simplement. Partagez un lien et gagnez 10 %. Créez une compétence et gagnez 5 % en passif, même quand d'autres la partagent. Aucune expérience requise.",
    category: "Programme d'affiliation",
    imageAlt: "Une personne qui partage un lien et gagne de l'argent en passif",
    keywords:
      "programme de parrainage, affiliation débutant, revenu passif IA, revenus de compétences IA",
  },
  hero: {
    backToBlog: "Retour au blog",
    category: "Pour les débutants",
    readTime: "5 min de lecture",
    title: "Deux façons de gagner. Inutile de choisir.",
    subtitle:
      "Partagez un lien. Ou créez une compétence. Ou les deux. Voici exactement comment ça marche.",
    quote:
      "« Moi non plus, je ne savais pas ce qu'était un programme de parrainage. Voici comment je l'expliquerais à ma mère. »",
  },
  intro: {
    title: "Partons de zéro",
    p1: "Il y a deux façons de gagner sur {{appName}}. Vous pouvez utiliser l'une, l'autre ou les deux. Aucune ne demande d'expérience.",
    p2: "La première : partager un lien. Quand quelqu'un s'abonne par ce lien, vous touchez 10 % de chacun de ses paiements. Pas seulement le premier mois : chaque mois, pour toujours, tant qu'il reste abonné. La seconde : créer une compétence. Une compétence, c'est une configuration d'IA personnalisée que vous réglez et publiez. Quand quelqu'un s'inscrit via le lien de votre compétence, vous touchez 5 % de plus sur ses paiements, de façon permanente. Encore mieux : ces 5 % vous reviennent en tant qu'auteur de la compétence, même quand quelqu'un d'autre la partage. Vous la créez une fois, elle continue de travailler.",
  },
  different: {
    title: "Ponctuel ou récurrent : pourquoi ça compte",
    p1: "La plupart des programmes de parrainage paient une seule fois. Celui de {{appName}} paie pour toujours. Voici ce que ça donne concrètement :",
    tableHeaderType: "Type",
    tableHeaderYouEarn: "Vous gagnez",
    tableHeaderWhen: "Quand",
    row1Type: "Bonus unique (ex. bon d'achat au restaurant)",
    row1Earn: "Récompense fixe",
    row1When: "Une fois",
    row2Type: "Affiliation à la vente (ex. Amazon)",
    row2Earn: "~3–10 % de la vente",
    row2When: "Une fois par achat",
    row3Type: "Parrainage {{appName}}",
    row3Earn: "10 % de l'abonnement",
    row3When: "Chaque mois, pour toujours",
    p2: "Vous parrainez quelqu'un en janvier. S'il est toujours abonné en décembre, il vous a rapporté 12 fois. Vous n'avez fait le travail qu'une fois.",
  },
  skillAngle: {
    title: "La voie de la compétence : un revenu passif à construire une fois",
    p1: "Une compétence, c'est un personnage d'IA que vous configurez : un nom, une personnalité, un prompt système. Ensuite, vous la publiez. Tout le monde peut la trouver et l'utiliser, et quand quelqu'un s'inscrit via le lien d'un autre membre vers votre compétence, vous touchez 5 % de ses paiements, pour toujours. Votre propre lien de compétence vous rapporte les 10 % directs complets.",
    p2: "Ce que la plupart des débutants ratent : ces 5 % sont liés à vous en tant qu'auteur, pas à la personne qui a partagé le lien. Si quelqu'un découvre votre compétence dans l'annuaire et la partage avec un ami, et que cet ami s'inscrit, vous êtes quand même crédité. La plateforme suit qui a créé la compétence, pas qui l'a diffusée. Votre compétence gagne pour vous même quand vous ne la promouvez pas.",
    p3: "Créer une compétence est gratuit. Aucune formule payante requise. Commencez simple : une compétence pour votre loisir, votre métier, votre langue maternelle. Publiez-la. Ajoutez son lien partout où vous parlez déjà d'IA. Chaque inscription via votre propre lien vous rapporte 10 %, pour toujours. Chaque inscription qu'un autre amène vers votre compétence vous rapporte 5 %.",
  },
  multilevel: {
    title: "Il y a aussi une chaîne : voici comment elle marche",
    p1: "C'est la partie qui a l'air compliquée, mais qui ne l'est pas. Quand vos filleuls parrainent à leur tour, vous touchez aussi une petite part de ces paiements. Le détail exact :",
    explanation:
      "Vous parrainez Alice. Alice s'abonne : vous touchez 10 % de ses paiements, pour toujours. Alice parraine Bob. Bob s'abonne : vous touchez environ 5 % des paiements de Bob (la moitié de 10 %, car il est un niveau plus bas). Bob parraine Carole : vous touchez environ 2,5 % des paiements de Carole. Et ainsi de suite, jusqu'à 5 niveaux. Chaque niveau vous rapporte la moitié du niveau au-dessus.",
    p2: "En pratique : presque tous vos revenus viendront des 10 % directs sur les personnes que vous parrainez vous-même. Les bonus de chaîne existent, mais ils sont faibles. Ne comptez pas dessus : voyez-les comme un bonus.",
    p3: "Pour démarrer, vous n'avez pas besoin de penser à la chaîne. Créez un lien, partagez-le, touchez 10 % sur chaque inscription.",
  },
  expectations: {
    title: "Des attentes réalistes, sans battage",
    p1: "Le calcul honnête :",
    scenario1Label: "Abonné à la formule",
    scenario1Spend: "Formule à {{planPrice}}/mois",
    scenario1Earn: "= {{planEarn}}/mois par filleul",
    scenario2Label: "Gros utilisateur (agents, API, image et vidéo)",
    scenario2Spend:
      "Formule à {{planPrice}} + {{powerPacks}} packs de crédits à {{packPrice}} = {{powerSpend}}/mois",
    scenario2Earn: "= {{powerEarn}}/mois par filleul",
    note: "Un seul gros utilisateur vous rapporte autant que {{powerVsPlan}} abonnés à la formule. Les développeurs qui font tourner des agents et l'API consomment beaucoup de crédits et résilient rarement. Ce sont eux, la cible à forte valeur.",
    example:
      "Parrainez 10 abonnés à la formule : {{tenPlanEarn}}/mois pour vous. Ça ne change pas une vie. Mais c'est de l'argent gagné en disant ce que vous auriez dit de toute façon.",
  },
  firststeps: {
    title: "Vos premiers pas (5 minutes)",
    step1Title: "Créer un compte gratuit",
    step1Body:
      "Aucune formule payante requise. Le programme de parrainage est ouvert à tous.",
    step2Title: "Ouvrir votre tableau de bord de parrainage",
    step2Link: "Ouvrez la page de parrainage.",
    step2Suffix:
      " Créez un code, n'importe quel nom facile à retenir fait l'affaire.",
    step3Title: "Partager votre lien, ou publier une compétence",
    step3Body:
      "Lien de parrainage : publiez-le partout où vous parleriez naturellement d'outils d'IA. Lien de compétence : créez d'abord une compétence simple, puis partagez son lien. Les deux fonctionnent. Les deux rapportent.",
    step4Title: "Suivre votre tableau de bord",
    step4Body:
      "Visiteurs, inscriptions et gains se mettent à jour en temps réel. Aucune dépense minimale pour commencer le suivi.",
  },
  close: {
    title: "C'est vraiment tout",
    p1: "Pas besoin de blog. Pas besoin d'abonnés. Pas besoin de comprendre les calculs multiniveaux. Il suffit de parler d'un outil que vous utilisez vraiment, et si vous le souhaitez, de créer une compétence simple qui rapporte toute seule.",
    p2: "Pour aller plus loin, comprendre la structure des commissions, trouver les meilleurs angles de promotion ou demander aux autres comment ils s'y prennent, rejoignez notre Discord.",
    createCode: "Obtenir votre code de parrainage",
    joinDiscord: "Rejoindre le Discord",
  },
};
