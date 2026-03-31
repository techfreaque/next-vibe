export const translations = {
  post: {
    title: "Purchase Credits",
    description: "Create Stripe checkout session for credit pack purchase",
    container: {
      title: "Purchase Credits",
      description: "Buy credit packs to use AI features",
    },
    quantity: {
      label: "Quantity",
      description: "Number of credit packs to purchase (1-10)",
      placeholder: "Enter quantity (1-10)",
    },
    provider: {
      label: "Choose Payment Method",
      description: "Select how you want to pay for your credit pack",
      placeholder: "Select payment provider",
      stripe: "Credit / Debit Card",
      stripeDescription: "Pay securely with Stripe",
      nowpayments: "Cryptocurrency",
      nowpaymentsDescription: "Pay with Bitcoin, Ethereum, and more",
      cryptoMinimumDisabled:
        "Minimum {{min}} packs required for crypto payments",
    },
    checkoutUrl: {
      content: "Checkout URL",
    },
    sessionId: {
      content: "Session ID",
    },
    totalAmount: {
      content: "Total Amount (cents)",
    },
    totalCredits: {
      content: "Total Credits",
    },
    pack: {
      title: "Credit Pack",
      description: "One-time credit pack for AI usage",
      perPack: "/ pack",
      features: {
        credits: "{{count}} credits included",
        expiry: "Credits never expire",
        bestFor: "Best for occasional usage",
      },
      requiresSubscription:
        "An active subscription is required to purchase credit packs",
      totalSummary: "{{totalCredits}} credits total · {{totalPrice}} total",
    },
    submit: {
      text: "Buy Credit Pack",
      loading: "Processing...",
    },
    redirecting: "Redirecting to checkout...",
    openCheckout: "Open Checkout",
    backButton: {
      label: "Back",
    },
    submitButton: {
      label: "Purchase Credits",
      loadingText: "Processing...",
    },
    success: {
      title: "Checkout Created",
      description: "Stripe checkout session created successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid purchase quantity",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to purchase credits",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to purchase credits",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to create checkout session",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
      noActiveSubscription: {
        title: "Active Subscription Required",
        description:
          "You must have an active subscription to purchase credit packs",
      },
    },
  },
  errors: {
    userNotFound: {
      title: "User not found",
      description: "The user account could not be found",
    },
    checkoutFailed: {
      title: "Checkout failed",
      description: "Failed to create checkout session for credit purchase",
    },
  },
};
