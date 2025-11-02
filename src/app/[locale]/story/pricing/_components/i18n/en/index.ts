export const translations = {
  creditPricing: {
    badge: "Simple Credit-Based Pricing",
    title: "Pay As You Go AI Chat",
    subtitle:
 "Choose between monthly credits or one-time credit packs. Full cost transparency for all AI models and features.",

    subscription: {
      badge: "Accessible for Everyone",
      title: "Monthly Subscription",
      price: "€{{price}}",
      perMonth: "/month",
      description: "{{credits}} credits per month (expire monthly)",
      expiryInfo:
 "€10/month for 1000 credits. Affordable AI access for everyone!",
      features: {
        credits: "{{credits}} credits monthly",
        allModels: "Access to all AI models (free and paid)",
        allFeatures: "Brave search, TTS, and STT features",
        cancel: "Cancel anytime, no commitment",
      },
      button: "Subscribe Now",
    },

    creditPack: {
      badge: "For Power Users",
      title: "Credit Pack",
      price: "€{{price}}",
      description: "{{credits}} credits (never expire)",
      permanentInfo:
 "Need more? €5 for 500 credits that never expire. Perfect for power users needing extra capacity.",
      quantityLabel: "Quantity (1-10 packs)",
      pricePerPack: "€{{price}} per {{credits}} credits",
      features: {
        credits: "{{credits}} permanent credits",
        allModels: "Access to all AI models (free and paid)",
        allFeatures: "Brave search, TTS, and STT features",
        multiple: "Buy multiple packs anytime",
      },
      button: "Buy {{quantity}} Pack",
      buttonPlural: "Buy {{quantity}} Packs",
    },

    common: {
      processing: "Processing...",
    },

    costTransparency: {
      title: "Cost Transparency",
      card: {
        title: "AI Model Costs",
        description: "Clear pricing for every AI model and feature",
      },
      table: {
        provider: "Provider",
        model: "Model",
        costPerMessage: "Cost per Message",
        features: "Features",
        braveSearch: "Brave Search",
        braveSearchCost: "+1 credit per search",
        tts: "Text-to-Speech (TTS)",
        ttsCost: "1 credit per minute",
        stt: "Speech-to-Text (STT)",
        sttCost: "1 credit per minute",
        free: "Free",
        credits: "{{count}} credit",
        creditsPlural: "{{count}} credits",
        parameters: "{{count}}B parameters",
      },
    },

    calculator: {
      title: "Credit Calculator",
      card: {
        title: "Estimate Your Monthly Credits",
        description:
 "Calculate how many credits you'll need based on your usage",
      },
      messagesLabel: "Messages per month",
      estimates: {
        free: "With Free Models (0 credits):",
        freeCredits: "0 credits",
        basic: "With Basic Models (1 credit/msg):",
        basicCredits: "{{count}} credits",
        pro: "With Pro Models (2 credits/msg):",
        proCredits: "{{count}} credits",
        premium: "With Premium Models (5 credits/msg):",
        premiumCredits: "{{count}} credits",
      },
      recommendation: {
        title: "Recommendation:",
        freeTier: "Start with the free tier (20 credits) to try the service!",
        subscription:
 "The Monthly Subscription ({{credits}} credits) is perfect for your usage!",
        additionalPacks:
 "Consider buying {{packs}} Credit Pack(s) in addition to the subscription, or use free models more often.",
      },
    },

    freeTier: {
      title: "Free Tier Available",
      description:
 "Start with 20 free credits (tracked by IP/leadId). No credit card required. Many models are completely free!",
      button: "Start Free Now",
    },
  },
};
