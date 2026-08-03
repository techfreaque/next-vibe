export const translations = {
  name: "NOWPayments",
  description: "Cryptocurrency payment provider with subscription support",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "Manage NOWPayments webhook tunneling with ngrok",
      category: "Payment",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Check",
        install: "Install",
        tunnel: "Tunnel",
        status: "Status",
      },
      form: {
        title: "NOWPayments CLI Operations",
        description:
          "Configure and manage ngrok tunnel for NOWPayments webhooks",
        fields: {
          operation: {
            label: "Operation",
            description: "Select the operation to perform",
            placeholder: "Choose an operation",
          },
          port: {
            label: "Port",
            description: "Local port to tunnel (default: 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Validation Error",
          description: "Invalid operation or parameters",
        },
        networkError: {
          title: "Network Error",
          description: "Network connection failed",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        serverError: {
          title: "Server Error",
          description: "Failed to execute operation",
        },
        unknownError: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Resource conflict",
        },
      },
      response: {
        title: "Response",
        description: "Operation result",
        fields: {
          success: "Success",
          installed: "Installed",
          version: "Version",
          status: "Status",
          output: "Output",
          instructions: "Instructions",
          tunnelUrl: "Tunnel URL",
          webhookUrl: "Webhook URL",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },

  errors: {
    userNotFound: {
      detail: "No account found for user {{userId}}",
      title: "User Not Found",
      description: "The specified user could not be found",
    },
    customerCreationFailed: {
      detail:
        "Could not set up your NOWPayments customer record: {{error}} (user {{userId}})",
      title: "Customer Creation Failed",
      description: "Failed to ensure NOWPayments customer: {{error}}",
    },
    productNotFound: {
      detail: "No such product: {{productId}}",
      title: "Product Not Found",
      description: "The specified product could not be found: {{productId}}",
    },
    userEmailRequired: {
      title: "User Email Required",
      description: "User email is required for subscriptions: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "Could not start crypto checkout: {{error}}",
      title: "Checkout Creation Failed",
      description: "Failed to create NOWPayments checkout session: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "Could not create the NOWPayments invoice: {{error}}",
      title: "Invoice Creation Failed",
      description: "Failed to create NOWPayments invoice: {{error}}",
    },
    invalidApiKey: {
      detail:
        "Invalid NOWPayments API key. Check NOWPAYMENTS_API_KEY in your environment and confirm the key at https://nowpayments.io/app/dashboard",
      title: "Invalid API Key",
      description:
        "Invalid NOWPayments API key. Please check your configuration and ensure you have a valid API key from https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Plan Creation Failed",
      description: "Failed to create NOWPayments subscription plan: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Subscription Creation Failed",
      description: "Failed to create NOWPayments subscription: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "Could not load the NOWPayments subscription: {{error}}",
      title: "Subscription Retrieval Failed",
      description: "Failed to retrieve NOWPayments subscription: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "Could not cancel the NOWPayments subscription: {{error}}",
      title: "Subscription Cancellation Failed",
      description: "Failed to cancel NOWPayments subscription: {{error}}",
    },
    subscriptionListFailed: {
      detail: "Could not list NOWPayments subscriptions: {{error}}",
      title: "Subscription List Failed",
      description: "Failed to list NOWPayments subscriptions: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments Not Configured",
      description:
        "NOWPayments is not configured - set NOWPAYMENTS_API_KEY and NOWPAYMENTS_IPN_SECRET in your .env",
    },
    webhookVerificationFailed: {
      detail: "Could not verify the NOWPayments webhook: {{error}}",
      invalidSignature: "Webhook signature does not match",
      title: "Webhook Verification Failed",
      description: "Failed to verify NOWPayments webhook signature: {{error}}",
    },
    paymentStatusFailed: {
      detail: "Could not read the payment status from NOWPayments: {{error}}",
      title: "Payment Status Retrieval Failed",
      description:
        "Failed to retrieve payment status from NOWPayments: {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Invoice Created",
      description: "NOWPayments invoice created successfully",
    },
    webhookVerified: {
      title: "Webhook Verified",
      description: "NOWPayments webhook verified successfully",
    },
    paymentStatusRetrieved: {
      title: "Payment Status Retrieved",
      description: "NOWPayments payment status retrieved successfully",
    },
  },
};
