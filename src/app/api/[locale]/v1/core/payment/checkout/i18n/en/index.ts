export const translations = {
  // Main checkout titles and descriptions
  title: "Create Subscription Checkout",
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
    title: "Checkout Configuration",
    description: "Configure checkout session parameters",
    fields: {
      planId: {
        label: "Subscription Plan",
        description: "Select the subscription plan",
        placeholder: "Choose a plan",
      },
      billingInterval: {
        label: "Billing Interval",
        description: "Select billing frequency",
        placeholder: "Choose billing interval",
      },
      provider: {
        label: "Payment Provider",
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
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    network: {
      title: "Network Error",
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
      title: "Not Found",
      description: "Resource not found",
    },
    serverError: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
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
    title: "Create Checkout Session",
    description: "Create a new subscription checkout session",
    form: {
      title: "Checkout Session Configuration",
      description: "Configure the checkout session parameters",
    },
    response: {
      title: "Checkout Response",
      description: "Checkout session response data",
    },
    errors: {
      alreadySubscribed: {
        title: "Already Subscribed",
        description: "You already have an active subscription",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid checkout parameters",
        reason: {
          enterpriseCustomPricing: "ENTERPRISE plan requires custom pricing",
        },
      },
      network: {
        title: "Network Error",
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
        title: "Not Found",
        description: "Checkout session not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
};
