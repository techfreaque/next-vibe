/**
 * Stripe API translations for English
 */

export const translations = {
  title: "Stripe CLI Integration",
  description: "Manage Stripe CLI operations and webhook listening",
  category: "Payment Integration",
  tags: {
    stripe: "Stripe",
    cli: "Command Line",
    webhook: "Webhook",
  },

  operations: {
    check: "Check Installation",
    install: "Install Stripe CLI",
    listen: "Start Webhook Listener",
    login: "Login to Stripe",
    status: "Check Status",
  },

  form: {
    title: "Stripe CLI Configuration",
    description: "Configure Stripe CLI operations and webhook settings",
    fields: {
      operation: {
        label: "Operation Type",
        description: "Select the Stripe CLI operation to perform",
        placeholder: "Choose an operation...",
      },
      port: {
        label: "Port Number",
        description: "Port number for webhook forwarding (1000-65535)",
        placeholder: "4242",
      },
      events: {
        label: "Webhook Events",
        description: "Select Stripe events to listen for",
        placeholder: "Select events to monitor...",
      },
      forwardTo: {
        label: "Forward To URL",
        description: "Local endpoint to forward webhook events",
        placeholder: "localhost:3000/api/webhooks/stripe",
      },
      skipSslVerify: {
        label: "Skip SSL Verification",
        description: "Skip SSL certificate verification for development",
      },
    },
  },

  response: {
    success: "Operation completed successfully",
    installed: "Stripe CLI installation status",
    version: "Installed Stripe CLI version",
    status: "Current operation status",
    output: "Command output and logs",
    instructions: "Next steps and instructions",
    webhookEndpoint: "Webhook endpoint URL",
  },

  login: {
    instructions:
      "To authenticate with Stripe, run 'stripe login' in your terminal and follow the instructions to connect your Stripe account.",
  },

  status: {
    authenticated: "Authenticated and ready",
    not_authenticated: "Not authenticated - run 'stripe login'",
    not_installed: "Stripe CLI is not installed",
  },

  errors: {
    validation: {
      title: "Invalid Configuration",
      description: "Please check your Stripe CLI configuration and try again",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to Stripe services",
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
      title: "Resource Not Found",
      description: "The requested Stripe resource was not found",
    },
    serverError: {
      title: "Server Error",
      description: "An error occurred while processing the Stripe operation",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred with Stripe CLI",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved configuration changes",
    },
    conflict: {
      title: "Operation Conflict",
      description: "Another Stripe operation is currently in progress",
    },
    execution_failed: "Stripe CLI operation failed to execute properly",
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
  },

  success: {
    title: "Operation Successful",
    description: "Stripe CLI operation completed successfully",
  },

  installInstructions: {
    documentation:
      "Please install Stripe CLI following the official documentation at: https://docs.stripe.com/stripe-cli",
    quickInstallation: "Quick installation options:",
    macOS: {
      title: "macOS (using Homebrew):",
      command: "brew install stripe/stripe-cli/stripe",
    },
    linux: {
      title: "Linux (using package manager):",
      debian: {
        title: "Debian/Ubuntu",
      },
      fedora: {
        title: "CentOS/RHEL/Fedora",
      },
    },
    windows: {
      title: "Windows:",
      scoop: {
        title: "Using Scoop",
      },
      github: {
        title: "Or download directly from GitHub releases:",
        url: "https://github.com/stripe/stripe-cli/releases",
      },
    },
    authentication: {
      title: "After installation, authenticate with:",
      command: "stripe login",
    },
  },
};
