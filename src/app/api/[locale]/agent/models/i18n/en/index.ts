export const translations = {
  selector: {
    bestForFilter: "Best for this filter",
    setupRequired: "Setup required",
    providerUnconfigured: "Provider API key not configured",
    addEnvKey: "Add to .env",
    noMatchingModels: "No models match your filters",
    noModelsWarning:
      "No models match these filters. Adjust your settings to continue.",
    allModelsCount: "{{count}} models available",
    filteredModelsCount: "{{count}} matching models",
    showAllModels: "Show all {{count}} models",
    showFiltered: "Show filtered",
    creditsExact: "{{cost}} credits",
    creditsSingle: "1 credit",
    free: "Free",
    autoSelectedModel: "Auto-selected:",
    manualSelectedModel: "Selected:",
    characterSelectedModel: "Character's model:",
    selectModelBelow: "Select a model below",
    sortBy: "Sort by",
    showLess: "Show less",
    showMore: "Show {{count}} more",
    showLegacyModels: "Show {{count}} Legacy Models",
    autoMode: "Auto-Select",
    manualMode: "Manual Pick",
    characterMode: "Character Default",
    autoModeDescription:
      "Automatically picks the best model based on your preferences",
    manualModeDescription: "Choose any model you want",
    characterBasedModeDescription:
      "Uses the model this character was designed for",
  },
  tiers: {
    intelligence: {
      quick: "Quick",
      smart: "Smart",
      brilliant: "Brilliant",
      quickDesc: "Fast & efficient",
      smartDesc: "Balanced quality",
      brilliantDesc: "Deep reasoning",
    },
    price: {
      cheap: "Budget",
      standard: "Standard",
      premium: "Premium",
      cheapDesc: "0-3 credits per message",
      standardDesc: "3-9 credits per message",
      premiumDesc: "9+ credits per message",
    },
    content: {
      mainstream: "Mainstream",
      open: "Open",
      uncensored: "Uncensored",
      mainstreamDesc: "Standard safety",
      openDesc: "Fewer restrictions",
      uncensoredDesc: "No restrictions",
    },
    speed: {
      fast: "Fast",
      balanced: "Balanced",
      thorough: "Thorough",
      fastDesc: "Quick responses",
      balancedDesc: "Good balance",
      thoroughDesc: "Detailed analysis",
    },
  },
  sort: {
    intelligence: "Intelligence",
    price: "Price",
    speed: "Speed",
    content: "Content",
  },
  ranges: {
    intelligenceRange: {
      minLabel: "Min Intelligence",
      maxLabel: "Max Intelligence",
    },
    priceRange: {
      minLabel: "Min Price",
      maxLabel: "Max Price",
    },
    contentRange: {
      minLabel: "Min Content",
      maxLabel: "Max Content",
    },
    speedRange: {
      minLabel: "Min Speed",
      maxLabel: "Max Speed",
    },
  },
  credits: {
    credit: "{{count}} credit",
    credits: "{{count}} credits",
  },
  creditDisplay: {
    tokenBased: {
      header: "Cost per message",
      costRangeLabel: "Typical range:",
      costRangeValue: "{{min}} - {{max}} credits",
      examplesLabel: "Examples:",
      examples: {
        short: "Short conversation",
        medium: "Medium conversation",
        long: "Long conversation",
      },
      triggersCompacting: "⚡ Triggers compacting",
      tokensCount: "{{count}} tokens",
      explanation:
        "The AI processes your entire conversation history with each message. Longer conversations cost more because there's more context to process.",
      compactingLabel: "✨ Auto-compacting:",
      compactingExplanation:
        " At {{threshold}} tokens, older messages are automatically summarized to reduce costs while preserving context.",
    },
    fixed: {
      title: "Pricing for {{model}}",
      freeDescription: "This model is completely free with no credit cost.",
      fixedDescription:
        "This model has a fixed cost per message, regardless of length.",
      costPerMessage: "Cost per message:",
      freeExplanation: "This is a free model with no usage limits.",
      freeHighlight: "Perfect for testing and experimentation.",
      simpleLabel: "Simple pricing:",
      simpleExplanation:
        " Every message costs the same, whether short or long. No token counting needed.",
    },
    creditValue: "1 credit = {{value}}",
  },
} as const;
