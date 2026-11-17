import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "Produits",

  // Enums
  enums: {
    productType: {
      service: "Service",
      physical: "Physique",
      digital: "Numérique",
    },
  },

  // Product summary (single source of truth)
  summary:
    "Nous proposons une formule gratuite (sans compte : {{freeCredits}} crédits/mois, avec un compte gratuit : {{freeCreditsSignedIn}}, compte + newsletter : {{freeCreditsMax}}), un abonnement mensuel ({{subPrice}} {{subCurrency}}/mois pour {{subCredits}} crédits) et des packs de crédits ({{packPrice}} {{packCurrency}} pour {{packCredits}} crédits) que tout le monde peut acheter sans abonnement.",

  // Free tier product
  free: {
    name: "Formule gratuite",
    description: "Commencez avec des crédits gratuits, sans carte bancaire",
  },

  // Subscription product
  subscription: {
    name: "Abonnement mensuel",
    description:
      "{{subCredits}} crédits par mois, {{modelCount}} modèles d'IA inclus",
    longDescription:
      "Abonnement mensuel avec {{subCredits}} crédits pour les {{modelCount}} modèles d'IA non censurés",
    price: "Tarif de l'abonnement mensuel",
    cta: "S'abonner",
    features: {
      credits: "{{subCredits}} crédits par mois",
      allModels: "Les {{modelCount}} modèles d'IA",
      allFeatures: "Toutes les fonctionnalités incluses",
      cancel: "Résiliable à tout moment",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Pack de crédits",
    description:
      "Payez à l'usage. Sans abonnement. Les crédits n'expirent jamais.",
    longDescription:
      "Achetez des crédits quand vous en avez besoin. Aucun abonnement requis. Cumulez les packs avec une formule ou utilisez-les seuls.",
    features: {
      credits: "{{packCredits}} crédits par pack",
      allModels: "Les {{modelCount}} modèles d'IA inclus",
      allFeatures: "Toutes les fonctionnalités incluses",
      multiple: "Achetez plusieurs packs",
      permanent: "Les crédits n'expirent jamais",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "Grand pack de crédits (retiré)",
    description: "Plus en vente. Les crédits déjà achetés restent valables.",
  },
};
