export const translations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Listen for Stripe webhooks locally",
  category: "Payment Integration",
  tags: {
    stripe: "Stripe",
    cli: "Command Line",
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
    not_authenticated: "Not authenticated — run 'stripe login'",
    not_installed: "Stripe CLI is not installed",
  },

  errors: {
    validation: {
      title: "Invalid Configuration",
      description: "Check your Stripe CLI configuration and try again",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to Stripe",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You don't have permission to perform this operation",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "This operation is not allowed for your account",
    },
    notFound: {
      title: "Not Found",
      description: "Stripe CLI is not installed",
    },
    serverError: {
      title: "Server Error",
      description: "An error occurred while running the Stripe listener",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    customerRetrievalFailed: {
      title: "Customer Retrieval Failed",
      description: "Failed to retrieve Stripe customer information",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved configuration changes",
    },
    conflict: {
      title: "Operation Conflict",
      description: "Another Stripe operation is currently in progress",
    },
    execution_failed: "Stripe CLI operation failed",
    userNotFound: {
      title: "User Not Found",
      description: "The specified user was not found",
    },
    customerCreationFailed: {
      title: "Customer Creation Failed",
      description: "Failed to create Stripe customer",
    },
    checkoutCreationFailed: {
      title: "Checkout Creation Failed",
      description: "Failed to create Stripe checkout session",
    },
    webhookVerificationFailed: {
      title: "Webhook Verification Failed",
      description: "Failed to verify webhook signature",
    },
    subscriptionRetrievalFailed: {
      title: "Subscription Retrieval Failed",
      description: "Failed to retrieve subscription from Stripe",
    },
    subscriptionCancellationFailed: {
      title: "Subscription Cancellation Failed",
      description: "Failed to cancel subscription in Stripe",
    },
    priceCreationFailed: {
      title: "Price Creation Failed",
      description: "Failed to create price in Stripe",
    },
    notConfigured: {
      title: "Stripe Not Configured",
      description: "Set STRIPE_SECRET_KEY in your .env",
    },
    stripeCliNotInstalled: "Stripe CLI is not installed",
    listenerFailed: "Failed to start Stripe webhook listener",
  },

  success: {
    title: "Listener Started",
    description: "Stripe CLI is listening for webhooks",
  },
};
