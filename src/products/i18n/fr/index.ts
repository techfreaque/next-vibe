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
    "Nous proposons une formule gratuite (sans compte : {{freeCredits}} crédits/mois, avec un compte gratuit : {{freeCreditsSignedIn}}, compte + newsletter : {{freeCreditsMax}}) et quatre formules mensuelles : {{subPrice}} pour {{subCredits}} crédits, {{plusPrice}} pour {{plusCredits}}, {{proPrice}} pour {{proCredits}} et {{ultraPrice}} pour {{ultraCredits}}. Les abonnés rechargent quand ils veulent avec des packs de crédits ({{packPrice}} pour {{packCredits}} crédits) qui n'expirent jamais.",

  // Free tier product
  free: {
    name: "Formule gratuite",
    description: "Commencez avec des crédits gratuits, sans carte bancaire",
  },

  // Subscription product
  subscription: {
    name: "Starter",
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

  // Higher subscription tiers (credits and prices come from config)
  subscriptionPlus: {
    name: "Plus",
  },
  subscriptionPro: {
    name: "Pro",
  },
  subscriptionUltra: {
    name: "Ultra",
  },

  // Credit pack product
  creditPack: {
    name: "Pack de crédits",
    description: "Rechargez votre formule. Les crédits n'expirent jamais.",
    longDescription:
      "Plus assez de crédits avant le renouvellement ? Ajoutez un pack. Les packs s'ajoutent à vos crédits mensuels et n'expirent jamais.",
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
