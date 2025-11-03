export const translations = {
  // Product category
  category: "Products",

  // Product summary (single source of truth)
  summary:
    "We offer Free ({{freeCredits}} credits/month), Monthly Subscription ({{subCurrency}}{{subPrice}}/month for {{subCredits}} credits), and Credit Packs ({{packCurrency}}{{packPrice}} for {{packCredits}} credits, requires subscription).",

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
    description: "Extra credits for subscribers - never expire",
    longDescription:
      "Buy additional credit packs when you need more than your monthly {{subCredits}} credits. Requires active subscription.",
    features: {
      credits: "{{packCredits}} credits per pack",
      allModels: "All {{modelCount}} AI models included",
      allFeatures: "All features included",
      multiple: "Buy multiple packs",
      permanent: "Credits never expire",
    },
  },
};
