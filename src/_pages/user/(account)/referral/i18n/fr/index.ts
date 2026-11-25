import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  backToChat: "Retour au chat",
  title:
    "Partagez votre lien. Touchez {{directPct}} de chaque paiement. À vie.",
  description:
    "Chaque inscrit via votre lien vous reverse {{directPct}} de ses paiements. Sans expiration ni plafond. Publiez une compétence : {{skillBonusPct}} sur les autres apports.",
  tagline: "Parrainage et compétences",

  hero: {
    directEarning: "Vous touchez",
    directNote: "sur vos filleuls, à vie",
    bonusEarning: "En tant que créateur de compétence",
    bonusNote: "quand d'autres partagent votre compétence, récurrent et à vie",
  },

  commissionTable: {
    youLabel: "Vous",
    perMonth: "/ mois",
    colLevel: "Bénéficiaire",
    colCut: "Part",
    alwaysYours: "toujours à vous",
    heroLabel: "sur chaque paiement",
    heroSub: "Récurrent. À vie.",
    chainTitle: "10 abonnés. Ce que vous touchez par mois.",
    chainSubtitle:
      "Chaque niveau vaut la moitié du précédent. Établi une fois à l'inscription, versé à vie.",
    whoLabel0: "Vous : la personne qui les a parrainés directement",
    whoLabel1:
      "Le créateur de la compétence (s'il est différent) ou votre parrain",
    whoLabel2: "Le parrain de leur parrain",
    whoLabel3: "Niveau 4",
    whoLabel4: "Niveau 5",
    whoLabel5: "Niveau 6",
    tableNote:
      "Lien de parrainage : {{directPct}} par utilisateur. Votre compétence partagée par quelqu'un d'autre : {{skillBonusPct}} par utilisateur. Les deux sont récurrents, à vie.",
  },

  // Story scenario section
  story: {
    title: "Comment la chaîne s'additionne",
    subtitle:
      "Les mêmes 10 abonnés. Chaque niveau activé s'ajoute à votre total, à vie.",
    totalLabel: "Total / mois",
    addedLabel: "+{{amount}} grâce à ce niveau",
    levelLabel: "Niveau {{n}} actif",
    level1Desc: "Vos 10 abonnés directs. {{directPct}} chacun.",
    level2Desc:
      "Vos filleuls parrainent quelqu'un. Vous touchez aussi une part.",
    level3Desc: "Leurs filleuls parrainent à leur tour. La chaîne grandit.",
    level4Desc: "Quatrième degré. Toujours rémunéré.",
    level5Desc: "Cinquième degré.",
    level6Desc: "Sixième degré. Chaque centime, à vie.",
    noob: {
      label: "Premiers pas",
      earning: "~{{story_noob_earning}}/mois",
      desc: "{{story_noob_users}} abonnés payants via votre lien de parrainage. {{directPct}} chacun : un revenu passif grâce à un seul tweet ou article de blog.",
    },
    mid: {
      label: "Audience en croissance",
      earning: "~{{story_mid_earning}}/mois",
      desc: "{{story_mid_users}} abonnés, entre liens de parrainage et liens de compétence. Certains de leurs amis se sont inscrits aussi. La chaîne se construit toute seule.",
    },
    pro: {
      label: "Créateur établi",
      earning: "~{{story_pro_earning}}/mois",
      desc: "{{story_pro_users}} abonnés via liens de parrainage et de compétence, plus les gains sur les personnes qu'ils ont parrainées. Effet cumulé à plein.",
    },
  },

  overview: {
    title: "Vos gains",
    subtitle: "Statistiques en direct. Mises à jour à chaque paiement.",
  },

  howItWorks: {
    title: "Comment ça marche",
    step1Title: "Créez un code de parrainage",
    step1Body:
      "Créez des codes distincts pour chaque audience : amis, Discord, un article de blog. Chacun est suivi séparément.",
    step2Title: "Partagez votre lien",
    step2Body:
      "Lien de parrainage → {{directPct}} par utilisateur, à vie. Votre compétence partagée par d'autres → {{skillBonusPct}} par utilisateur. Deux sources, zéro effort en plus.",
    step3Title: "Recevez vos gains",
    step3Body:
      "Les gains se débloquent {{holdDays}} jours après chaque paiement, le délai de remboursement. Utilisez-les ensuite en crédits ou retirez-les en BTC/USDC dès {{minPayout}}.",
  },

  manage: {
    codesSubtitle: "Copiez un lien, partagez-le, regardez-le rapporter.",
  },
  myCodes: {
    title: "Vos liens",
  },
  cta: {
    title: "Créez un compte pour commencer à gagner",
    description:
      "Obtenez votre lien de parrainage. {{directPct}} sur chaque paiement, récurrent, sans expiration. Publiez une compétence et touchez {{skillBonusPct}} quand d'autres la partagent.",
    signUp: "Créer un compte",
    logIn: "Se connecter",
    pitch1:
      "{{directPct}} de commission de parrainage, récurrente, sans expiration",
    pitch2:
      "Publiez une compétence → {{skillBonusPct}} sur chaque utilisateur que d'autres lui apportent",
    pitch3:
      "Débloqué {{holdDays}} jours après le paiement. Retraits en BTC/USDC dès {{minPayout}}.",
  },
  payout: {
    title: "Retirer vos gains",
    description: "Deux façons d'utiliser ce que vous avez gagné",
    useAsCredits: "Utiliser comme crédits de chat",
    useAsCreditsDesc:
      "Immédiat. Sans minimum. Converti 1:1 en crédits de conversation IA.",
    cryptoPayout: "Retirer en crypto",
    cryptoPayoutDesc: "BTC ou USDC vers l'adresse de votre portefeuille.",
    minimumNote:
      "Minimum : {{minPayout}}. Traité sous {{cryptoPayoutHours}} heures après validation.",
  },
  audienceCallout: {
    title: "Deux façons de gagner",
    newTitle: "Lien de parrainage : {{directPct}} par utilisateur",
    newBody:
      "Partagez votre code. Chaque personne qui s'inscrit et paie vous reverse {{directPct}} de chaque paiement, chaque mois, à vie. Publiez-le une fois. Gagnez à vie.",
    newCta: "Obtenir votre lien de parrainage",
    proTitle: "Créateur de compétence : {{skillBonusPct}} par utilisateur",
    proBody:
      "Créez une compétence. Partagez son lien. Chaque personne inscrite via votre propre lien vous reverse {{directPct}}, de façon récurrente. L'effet multiplicateur : quand quelqu'un d'autre partage votre compétence avec son lien, vous touchez quand même {{skillBonusPct}} en tant qu'auteur. La plateforme suit l'auteur de chaque compétence : une attribution passive, sans effort en plus.",
    proCta: "Créer une compétence",
  },
  discord: {
    title: "Rejoignez la communauté",
    description:
      "Partagez vos stratégies, posez vos questions, échangez avec d'autres affiliés.",
    cta: "Rejoindre Discord",
  },
};
