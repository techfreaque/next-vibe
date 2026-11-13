export const translations = {
  // Product category
  category: "Products",

  // Enums
  enums: {
    productType: {
      service: "Service",
      physical: "Physical",
      digital: "Digital",
    },
  },

  // Product summary (single source of truth)
  summary:
    "We offer Free ({{freeCredits}} credits/month as a guest, {{freeCreditsSignedIn}} signed in, +{{freeCreditsNewsletterBonus}} with the newsletter), Monthly Subscription ({{subCurrency}}{{subPrice}}/month for {{subCredits}} credits), and Credit Packs ({{packCurrency}}{{packPrice}} for {{packCredits}} credits) that anyone can buy without a subscription.",

  // Free tier product
  free: {
    name: "Free Tier",
    description: "Get started with free credits - no card required",
  },

  // Subscription product
  subscription: {
    name: "Monthly Subscription",
    description:
      "{{subCredits}} credits per month with all {{modelCount}} AI models",
    longDescription:
      "Monthly subscription with {{subCredits}} credits for all {{modelCount}} uncensored AI models",
    price: "Monthly subscription pricing",
    cta: "Subscribe Now",
    features: {
      credits: "{{subCredits}} credits per month",
      allModels: "All {{modelCount}} AI models",
      allFeatures: "All features included",
      cancel: "Cancel anytime",
    },
  },

  // Credit pack product
  creditPack: {
    name: "Credit Pack",
    description: "Pay as you go. No subscription. Credits never expire.",
    longDescription:
      "Buy credits when you need them. No subscription required. Stack packs on top of a plan or use them alone.",
    features: {
      credits: "{{packCredits}} credits per pack",
      allModels: "All {{modelCount}} AI models included",
      allFeatures: "All features included",
      multiple: "Buy multiple packs",
      permanent: "Credits never expire",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "Large Credit Pack (retired)",
    description: "No longer sold. Credits already bought stay valid.",
  },
};
