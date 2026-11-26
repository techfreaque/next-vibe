export const translations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Listen for Stripe webhooks locally",
  category: "Payment integration",
  tags: {
    stripe: "Stripe",
    cli: "Command line",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Forward Stripe webhook events to your local server",
    fields: {
      port: {
        label: "Port",
        description: "Local port to forward webhooks to (default: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Authenticated and ready",
    not_authenticated: "Not authenticated. Run 'stripe login'.",
    not_installed: "Stripe CLI is not installed. {{instructions}}",
  },

  errors: {
    validation: {
      title: "Invalid configuration",
      description: "Check your Stripe CLI configuration and try again",
    },
    network: {
      title: "Network error",
      description: "Unable to connect to Stripe",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to perform this operation",
    },
    forbidden: {
      title: "Access forbidden",
      description: "This operation is not allowed for your account",
    },
    notFound: {
      title: "Not found",
      description: "Stripe CLI is not installed",
    },
    serverError: {
      detail: "Stripe CLI listener failed: {{error}}",
      title: "Server error",
      description: "An error occurred while running the Stripe listener",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred",
    },
    customerRetrievalFailed: {
      detail:
        "Could not load your Stripe customer record: {{error}} (user {{userId}})",
      title: "Customer retrieval failed",
      description: "Failed to retrieve Stripe customer information",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved configuration changes",
    },
    conflict: {
      title: "Operation conflict",
      description: "Another Stripe operation is currently in progress",
    },
    execution_failed: "Stripe CLI operation failed",
    userNotFound: {
      detail: "No account found for user {{userId}}",
      title: "User not found",
      description: "The specified user was not found",
    },
    customerCreationFailed: {
      detail:
        "Could not create your Stripe customer record: {{error}} (user {{userId}})",
      title: "Customer creation failed",
      description: "Failed to create Stripe customer",
    },
    checkoutCreationFailed: {
      detail: "Could not start checkout: {{error}}",
      title: "Checkout creation failed",
      description: "Failed to create Stripe checkout session",
    },
    webhookVerificationFailed: {
      detail: "Could not verify the Stripe webhook: {{error}}",
      title: "Webhook verification failed",
      description: "Failed to verify webhook signature",
    },
    subscriptionRetrievalFailed: {
      detail: "Could not load the subscription from Stripe: {{error}}",
      title: "Subscription retrieval failed",
      description: "Failed to retrieve subscription from Stripe",
    },
    subscriptionCancellationFailed: {
      detail: "Could not cancel the subscription: {{error}}",
      title: "Subscription cancellation failed",
      description: "Failed to cancel subscription in Stripe",
    },
    priceCreationFailed: {
      detail:
        "Could not create the Stripe price: {{error}} (product {{productId}})",
      title: "Price creation failed",
      description: "Failed to create price in Stripe",
    },
    notConfigured: {
      title: "Stripe not configured",
      description: "Set STRIPE_SECRET_KEY in your .env",
    },
    stripeCliNotInstalled: "Stripe CLI is not installed",
    listenerFailed: "Failed to start Stripe webhook listener",
  },

  success: {
    title: "Listener started",
    description: "Stripe CLI is listening for webhooks",
  },
};
