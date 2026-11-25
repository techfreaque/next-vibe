import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "Gagnez avec {{appName}} : des revenus de parrainage récurrents",
    category: "Gagner",
    description:
      "Partagez {{appName}} et touchez {{directPct}} de chaque paiement de vos filleuls, tant qu'ils paient. Publiez une compétence : {{skillBonusPct}} sur les autres apports.",
    imageAlt: "Gagnez avec {{appName}}",
    keywords:
      "{{appName}}, programme de parrainage, affiliation, commission récurrente, compétences IA, revenu passif",
  },
  hero: {
    eyebrow: "Gagner",
    title: "Partagez ce que vous utilisez. Soyez payé chaque mois.",
    subtitle:
      "{{directPct}} de chaque paiement des personnes que vous amenez. Pas une fois : chaque mois où elles paient. Publiez une compétence et touchez {{skillBonusPct}} chaque fois que quelqu'un d'autre la partage.",
    ctaPrimary: "Obtenir mon lien",
    ctaSecondary: "Créer une compétence",
  },
  start: {
    label: "En partant de zéro",
    title: "Trois étapes. Aucune audience requise.",
    intro:
      "Pas besoin d'être influenceur. Un seul ami qui reste vous rapporte de l'argent chaque mois.",
    step1: {
      title: "Obtenez votre lien",
      body: "Créez un compte gratuit et ouvrez la page de parrainage. Votre lien personnel est prêt en quelques secondes.",
    },
    step2: {
      title: "Partagez-le, ou partagez une compétence",
      body: "Collez le lien dans un chat, un README, une vidéo. Ou publiez une compétence : son lien de partage contient automatiquement votre parrainage.",
    },
    step3: {
      title: "Touchez une part de chaque paiement",
      body: "{{directPct}} de tout ce qu'ils paient, chaque mois. Quand un autre membre amène quelqu'un via votre compétence, vous touchez aussi {{skillBonusPct}} sur cet utilisateur.",
    },
  },
  split: {
    label: "La répartition",
    title: "Où va chaque paiement",
    perUser: "Par utilisateur à {{examplePrice}}/mois",
  },
  facts: {
    direct: "par filleul, chaque mois",
    skill: "en tant que créateur de la compétence, quand d'autres la partagent",
    payout: "retrait crypto minimum",
    hours: "traitement des versements crypto",
    hoursValue: "{{cryptoPayoutHours}} h",
  },
  cta: {
    title: "Votre lien est à un clic.",
    subtitle:
      "Compte gratuit. Aucune dépense minimale. Vos gains deviennent des crédits après la période de remboursement de {{holdDays}} jours. Retirez-les en BTC ou USDC dès {{minPayout}}.",
    primary: "Obtenir mon lien",
    secondary: "Lire le guide débutant",
    partners: "Pour les créateurs et les newsletters",
  },
};
