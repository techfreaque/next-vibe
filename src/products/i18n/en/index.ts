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
    "We offer Free (no account: {{freeCredits}} credits/month, free account: {{freeCreditsSignedIn}}, account + newsletter: {{freeCreditsMax}}) and four monthly plans: {{subPrice}} for {{subCredits}} credits, {{plusPrice}} for {{plusCredits}}, {{proPrice}} for {{proCredits}} and {{ultraPrice}} for {{ultraCredits}}. Subscribers can top up any time with credit packs ({{packPrice}} for {{packCredits}} credits) that never expire.",

  // Free tier product
  free: {
    name: "Free Tier",
    description: "Get started with free credits - no card required",
  },

  // Subscription product
  subscription: {
    name: "Starter",
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
    name: "Credit Pack",
    description: "Top up your plan. Credits never expire.",
    longDescription:
      "Run low before your plan renews? Add a pack. Packs stack on top of your monthly credits and never expire.",
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
