export const translations = {
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
  },
  post: {
    title: "Purchase Credits",
    titleShort: "Buy Credits",
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
    productId: {
      label: "Credit pack",
      description: "Pick the pack size to buy",
      placeholder: "Select pack",
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
      qtyCredits: "{{count}} credits",
      title: "Credit Pack",
      description:
        "Pay as you go. No subscription. Card or crypto. Credits never expire.",
      perPack: "/ pack",
      features: {
        credits: "{{count}} credits included",
        expiry: "Credits never expire",
        bestFor: "Stack on top of your monthly credits",
      },
      noSubscriptionNeeded: "Pay as you go. No subscription needed.",
      logIn: "Log in",
      signUp: "Sign up",
      signInToBuy: "Create a free account to buy credits. Card or crypto.",
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
        detail: "Checkout could not be started: {{error}}",
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
