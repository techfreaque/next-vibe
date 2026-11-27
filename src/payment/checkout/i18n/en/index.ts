export const translations = {
  // Main checkout titles and descriptions
  title: "Create subscription checkout",
  titleShort: "Checkout",
  description: "Create a Stripe checkout session for subscription",
  category: "Subscription",

  // Tags
  tags: {
    subscription: "subscription",
    checkout: "checkout",
    stripe: "stripe",
  },

  // Form configuration
  form: {
    title: "Checkout configuration",
    description: "Configure checkout session parameters",
    fields: {
      planId: {
        label: "Subscription plan",
        description: "Select the subscription plan",
        placeholder: "Choose a plan",
      },
      billingInterval: {
        label: "Billing interval",
        description: "Select billing frequency",
        placeholder: "Choose billing interval",
      },
      provider: {
        label: "Payment provider",
        description: "Choose how you want to pay",
        placeholder: "Select payment provider",
      },
      metadata: {
        label: "Metadata",
        description: "Additional metadata for the checkout session",
        placeholder: "Enter metadata as JSON",
      },
    },
  },

  // Response fields
  response: {
    success: "Checkout session created successfully",
    sessionId: "Stripe session ID",
    checkoutUrl: "Checkout URL",
    message: "Status message",
  },

  // Error types
  errors: {
    validation: {
      title: "Validation error",
      description: "Invalid request parameters",
    },
    network: {
      title: "Network error",
      description: "Network connection error",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not found",
      description: "Resource not found",
    },
    serverError: {
      title: "Server error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },

  // Success types
  success: {
    title: "Success",
    description: "Checkout session created successfully",
  },

  // POST endpoint specific translations
  post: {
    title: "Create checkout session",
    description: "Create a new subscription checkout session",
    form: {
      title: "Checkout session configuration",
      description: "Configure the checkout session parameters",
    },
    response: {
      title: "Checkout response",
      description: "Checkout session response data",
    },
    errors: {
      alreadySubscribed: {
        detail: "You already have an active subscription (user {{userId}})",
        title: "Already subscribed",
        description: "You already have an active subscription",
      },
      validation: {
        title: "Validation error",
        description: "Invalid checkout parameters",
        reason: {
          yearlyNotAvailable:
            "Yearly billing is only available for the {{plan}} plan. Pick monthly.",
        },
      },
      network: {
        title: "Network error",
        description: "Network connection error",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        detail: "No account found for user {{userId}}",
        title: "Not found",
        description: "Checkout session not found",
      },
      server: {
        detail: "Checkout could not be started: {{error}}",
        title: "Server error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Checkout session created successfully",
    },
  },

  // General error message
  error: "An error occurred during checkout",
  errorDetail: "Checkout failed: {{error}}",

  // Subscription plan labels
  plans: {
    starter: {
      title: "Starter",
    },
    plus: {
      title: "Plus",
    },
    pro: {
      title: "Pro",
    },
    ultra: {
      title: "Ultra",
    },
  },

  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
      whop: "Whop",
    },
  },

  // Billing interval labels
  billing: {
    monthly: "Monthly",
    yearly: "Yearly",
  },
  availability: {
    whopCardLabel: "Card",
    whopCardDescription: "Visa, Mastercard and more. Secure checkout by Whop.",
    cardPaused: "Card payments are paused for now. Crypto works right away.",
    cardPausedError:
      "Card payments are paused for now. Pick crypto to finish checkout.",
    nowpaymentsCardLabel: "Card or crypto (NOWPayments)",
    nowpaymentsCardDescription:
      "Visa, Mastercard, Apple Pay, Google Pay, or Bitcoin, Ethereum and more",
    cryptoAmountBelowMinimum:
      "This amount is below the crypto minimum. Add a pack or pick a bigger plan.",
  },
};
