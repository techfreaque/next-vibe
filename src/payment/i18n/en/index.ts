export const translations = {
  // Import sub-domain translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Create subscription checkout",
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
          title: "Already subscribed",
          description: "You already have an active subscription",
        },
        validation: {
          title: "Validation error",
          description: "Invalid checkout parameters",
          reason: {
            enterpriseCustomPricing: "ENTERPRISE plan requires custom pricing",
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
          title: "Not found",
          description: "Checkout session not found",
        },
        server: {
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

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Monthly",
      yearly: "Yearly",
    },
  },
  invoice: {
    category: "Billing",
    tags: {
      payment: "payment",
      invoice: "invoice",
      transactions: "transactions",
    },
    defaultItem: "Invoice item",
    success: {
      created: "Invoice created successfully",
    },
    post: {
      title: "Invoice",
      description: "Invoice endpoint",
      form: {
        title: "Invoice configuration",
        description: "Configure invoice parameters",
      },
      response: {
        success: "Invoice created successfully",
        message: "Status message",
        invoice: {
          title: "Invoice details",
          description: "Generated invoice information",
          id: "Invoice ID",
          userId: "User ID",
          stripeInvoiceId: "Stripe invoice ID",
          invoiceNumber: "Invoice number",
          amount: "Amount",
          currency: "Currency",
          status: "Status",
          invoiceUrl: "Invoice URL",
          invoicePdf: "Invoice PDF",
          dueDate: "Due date",
          paidAt: "Paid at",
          createdAt: "Created at",
          updatedAt: "Updated at",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
      widget: {
        back: "Back",
      },
    },
    customerId: {
      label: "Customer ID",
      description: "Stripe customer identifier",
      placeholder: "Enter customer ID",
    },
    amount: {
      label: "Amount",
      description: "Invoice amount",
      placeholder: "Enter amount",
    },
    currency: {
      label: "Currency",
      description: "Currency code",
      placeholder: "Select currency",
      usd: "US Dollar (USD)",
      eur: "Euro (EUR)",
      pln: "Polish Zloty (PLN)",
    },
    description: {
      label: "Description",
      description: "Invoice description",
      placeholder: "Enter description",
    },
    dueDate: {
      label: "Due date",
      description: "Payment due date",
      placeholder: "Select due date",
    },
    metadata: {
      label: "Metadata",
      description: "Additional metadata",
      placeholder: "Enter metadata as JSON",
    },
  },
  portal: {
    success: {
      created: "Customer portal session created successfully",
    },
    post: {
      title: "Customer portal",
      description: "Create customer portal session for billing management",
      form: {
        title: "Portal configuration",
        description: "Configure customer portal parameters",
      },
      returnUrl: {
        label: "Return URL",
        description: "URL to redirect to after portal session",
        placeholder: "https://example.com/dashboard",
      },
      response: {
        success: "Portal session created successfully",
        message: "Status message",
        customerPortalUrl: "Customer portal URL",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  refund: {
    title: "Process refund",
    description: "Process a refund for a payment transaction",
    category: "Payment refunds",

    tags: {
      refund: "refund",
      transaction: "transaction",
    },

    success: {
      created: "Refund processed successfully",
    },

    reason: {
      requestedByCustomer: "Requested by customer",
    },

    form: {
      title: "Refund form",
      description: "Enter refund details",
      fields: {
        transactionId: {
          label: "Transaction ID",
          description: "ID of the transaction to refund",
          placeholder: "Enter transaction ID",
        },
        amount: {
          label: "Refund amount",
          description: "Amount to refund (optional, defaults to full amount)",
          placeholder: "Enter amount",
        },
        reason: {
          label: "Refund reason",
          description: "Reason for the refund",
          placeholder: "Enter reason",
        },
        metadata: {
          label: "Metadata",
          description: "Additional refund metadata",
          placeholder: "Enter metadata as JSON",
        },
      },
    },

    post: {
      title: "Process refund",
      description: "Process a payment refund",
      response: {
        success: "Refund processed successfully",
        message: "Status message",
        refund: {
          title: "Refund details",
          description: "Processed refund information",
          id: "Refund ID",
          userId: "User ID",
          transactionId: "Transaction ID",
          stripeRefundId: "Stripe refund ID",
          amount: "Refund amount",
          currency: "Currency",
          status: "Refund status",
          reason: "Refund reason",
          createdAt: "Created at",
          updatedAt: "Updated at",
        },
      },
      errors: {
        validation: {
          title: "Validation error",
          description: "Invalid refund parameters",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Permission denied",
        },
        notFound: {
          title: "Not found",
          description: "Transaction not found",
        },
        server: {
          title: "Server error",
          description: "Internal server error occurred",
        },
        network: {
          title: "Network error",
          description: "Network connection error",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Conflict",
          description: "Refund conflict detected",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "There are unsaved changes",
        },
      },
      success: {
        title: "Success",
        description: "Refund processed successfully",
      },
    },
  },
  providers: {
    stripe: {
      title: "Stripe CLI integration",
      description: "Manage Stripe CLI operations and webhook listening",
      category: "Payment integration",
      tags: {
        stripe: "Stripe",
        cli: "Command line",
        webhook: "Webhook",
      },

      operations: {
        check: "Check installation",
        install: "Install Stripe CLI",
        listen: "Start webhook listener",
        login: "Login to Stripe",
        status: "Check status",
      },

      form: {
        title: "Stripe CLI configuration",
        description: "Configure Stripe CLI operations and webhook settings",
        fields: {
          operation: {
            label: "Operation type",
            description: "Select the Stripe CLI operation to perform",
            placeholder: "Choose an operation...",
          },
          port: {
            label: "Port number",
            description: "Port number for webhook forwarding (1000-65535)",
            placeholder: "4242",
          },
          events: {
            label: "Webhook events",
            description: "Select Stripe events to listen for",
            placeholder: "Select events to monitor...",
            paymentIntentSucceeded: "Payment intent succeeded",
            paymentIntentFailed: "Payment intent failed",
            subscriptionCreated: "Subscription created",
            subscriptionUpdated: "Subscription updated",
            invoicePaymentSucceeded: "Invoice payment succeeded",
            invoicePaymentFailed: "Invoice payment failed",
          },
          forwardTo: {
            label: "Forward to URL",
            description: "Local endpoint to forward webhook events",
            placeholder: "localhost:3000/api/webhooks/stripe",
          },
          skipSslVerify: {
            label: "Skip SSL verification",
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
          title: "Invalid configuration",
          description:
            "Please check your Stripe CLI configuration and try again",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to Stripe services",
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
          title: "Resource not found",
          description: "The requested Stripe resource was not found",
        },
        serverError: {
          title: "Server error",
          description:
            "An error occurred while processing the Stripe operation",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred with Stripe CLI",
        },
        customerRetrievalFailed: {
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
        execution_failed: "Stripe CLI operation failed to execute properly",
        userNotFound: {
          title: "User not found",
          description: "The specified user was not found",
        },
        customerCreationFailed: {
          title: "Customer creation failed",
          description: "Failed to create Stripe customer",
        },
        checkoutCreationFailed: {
          title: "Checkout creation failed",
          description: "Failed to create Stripe checkout session",
        },
        webhookVerificationFailed: {
          title: "Webhook verification failed",
          description: "Failed to verify webhook signature",
        },
        subscriptionRetrievalFailed: {
          title: "Subscription retrieval failed",
          description: "Failed to retrieve subscription from Stripe",
        },
        subscriptionCancellationFailed: {
          title: "Subscription cancellation failed",
          description: "Failed to cancel subscription in Stripe",
        },
        priceCreationFailed: {
          title: "Price creation failed",
          description: "Failed to create price in Stripe",
        },
        notConfigured: {
          title: "Stripe not configured",
          description:
            "Stripe is not configured - set STRIPE_SECRET_KEY in your .env",
        },
        stripeCliNotInstalled: "Stripe CLI is not installed",
        listenerFailed: "Failed to start Stripe webhook listener",
      },

      success: {
        title: "Operation successful",
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
            title: "Using scoop",
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
    },
    nowpayments: {
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
            title: "NOWPayments CLI operations",
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
              title: "Validation error",
              description: "Invalid operation or parameters",
            },
            networkError: {
              title: "Network error",
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
              title: "Not found",
              description: "Resource not found",
            },
            serverError: {
              title: "Server error",
              description: "Failed to execute operation",
            },
            unknownError: {
              title: "Unknown error",
              description: "An unknown error occurred",
            },
            unsavedChanges: {
              title: "Unsaved changes",
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
          title: "User not found",
          description: "The specified user could not be found",
        },
        customerCreationFailed: {
          title: "Customer creation failed",
          description: "Failed to ensure NOWPayments customer: {error}",
        },
        productNotFound: {
          title: "Product not found",
          description: "The specified product could not be found: {productId}",
        },
        userEmailRequired: {
          title: "User email required",
          description: "User email is required for subscriptions: {userId}",
        },
        checkoutCreationFailed: {
          title: "Checkout creation failed",
          description: "Failed to create NOWPayments checkout session: {error}",
        },
        invoiceCreationFailed: {
          title: "Invoice creation failed",
          description: "Failed to create NOWPayments invoice: {error}",
        },
        invalidApiKey: {
          title: "Invalid API key",
          description:
            "Invalid NOWPayments API key. Please check your configuration and ensure you have a valid API key from https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Plan creation failed",
          description:
            "Failed to create NOWPayments subscription plan: {error}",
        },
        subscriptionCreationFailed: {
          title: "Subscription creation failed",
          description: "Failed to create NOWPayments subscription: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Subscription retrieval failed",
          description: "Failed to retrieve NOWPayments subscription: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Subscription cancellation failed",
          description: "Failed to cancel NOWPayments subscription: {error}",
        },
        subscriptionListFailed: {
          title: "Subscription list failed",
          description: "Failed to list NOWPayments subscriptions: {error}",
        },
        notConfigured: {
          title: "NOWPayments not configured",
          description:
            "NOWPayments is not configured - set NOWPAYMENTS_API_KEY and NOWPAYMENTS_IPN_SECRET in your .env",
        },
        webhookVerificationFailed: {
          title: "Webhook verification failed",
          description:
            "Failed to verify NOWPayments webhook signature: {error}",
        },
        paymentStatusFailed: {
          title: "Payment status retrieval failed",
          description:
            "Failed to retrieve payment status from NOWPayments: {error}",
        },
      },

      success: {
        invoiceCreated: {
          title: "Invoice created",
          description: "NOWPayments invoice created successfully",
        },
        webhookVerified: {
          title: "Webhook verified",
          description: "NOWPayments webhook verified successfully",
        },
        paymentStatusRetrieved: {
          title: "Payment status retrieved",
          description: "NOWPayments payment status retrieved successfully",
        },
      },
    },
  },

  // Main payment domain
  category: "Billing",

  // Main form configuration
  form: {
    title: "Payment configuration",
    description: "Configure payment parameters",
  },

  // Tags
  tags: {
    payment: "payment",
    stripe: "stripe",
    checkout: "checkout",
    list: "list",
    transactions: "transactions",
    info: "info",
  },

  // Create payment endpoint
  create: {
    title: "Create payment session",
    titleShort: "Create session",
    description: "Create a new payment session with Stripe",
    form: {
      title: "Payment configuration",
      description: "Configure payment session parameters",
    },
    paymentMethodTypes: {
      label: "Payment methods",
      description: "Select accepted payment methods",
    },
    successUrl: {
      label: "Success URL",
      description: "URL to redirect after successful payment",
      placeholder: "https://example.com/success",
    },
    cancelUrl: {
      label: "Cancel URL",
      description: "URL to redirect if payment is canceled",
      placeholder: "https://example.com/cancel",
    },
    customerEmail: {
      label: "Customer email",
      description: "Customer email address for the payment",
      placeholder: "customer@example.com",
    },
    response: {
      success: "Payment session created successfully",
      sessionId: "Stripe session ID",
      sessionUrl: "Stripe session URL",
      checkoutUrl: "Checkout URL",
      message: "Status message",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Invalid payment parameters",
      },
      internal: {
        title: "Internal error",
        description: "An internal error occurred",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Permission denied",
      },
      notFound: {
        detail: "No account found for user {{userId}}",
        title: "Not found",
        description: "Payment session not found",
      },
      server: {
        detail: "Could not create the payment session: {{error}}",
        stripeNotConfigured:
          "Stripe is not set up yet. Add STRIPE_SECRET_KEY to your environment.",
        title: "Server error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Payment conflict detected",
      },
    },
    success: {
      title: "Success",
      description: "Payment session created successfully",
      message: "Payment session created successfully",
    },
  },

  // Get payment endpoint
  get: {
    title: "Your payments",
    titleShort: "Payments",
    description: "Up to ten recent payment records for your account.",
    summary: {
      empty: "No payments yet",
      emptyDescription: "Your payment records will appear here.",
      loading: "Loading your payments…",
      error: "Could not load your payments",
      retry: "Try again",
      amountUnavailable: "Amount unavailable",
    },
    form: {
      title: "Payment query",
      description: "Query payment information",
    },
    response: {
      success: "Payment data retrieved successfully",
      sessionUrl: "Payment session URL",
      sessionId: "Payment session ID",
      message: "Status message",
      transactions: "Payment transactions",
      paymentMethods: "Payment methods",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Invalid query parameters",
      },
      internal: {
        title: "Internal error",
        description: "An internal error occurred",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Permission denied",
      },
      notFound: {
        title: "Not found",
        description: "Payment information not found",
      },
      server: {
        detail: "Could not load your payment information: {{error}}",
        title: "Server error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Payment conflict detected",
      },
    },
    success: {
      title: "Success",
      description: "Payment information retrieved successfully",
    },
  },

  // Top-level error handling
  errors: {
    validation: {
      title: "Validation error",
      description: "Invalid payment parameters",
    },
    notFound: {
      title: "Not found",
      description: "Payment not found",
    },
    unauthorized: {
      signInRequired: "Sign in to manage payments",
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Permission denied",
    },
    server: {
      detail: "Payment webhook could not be processed: {{error}}",
      title: "Server error",
      description: "Internal server error occurred",
    },
    network: {
      title: "Network error",
      description: "Network connection error",
    },
    unknown: {
      title: "Unknown error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "There are unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Payment conflict detected",
    },
    notImplemented: {
      title: "Not implemented",
      description: "This payment provider feature is not yet implemented",
    },
    customerCreationFailed: "Failed to create Stripe customer",
    customerNotFound: "Stripe customer not found",
    localMode: "Payment is disabled in local development mode.",
    webhookVerificationFailed:
      "Webhook signature verification failed: {{error}}",
  },

  // Top-level success
  success: {
    title: "Success",
    description: "Operation completed successfully",
    sessionCreated: "Payment session created successfully",
    infoRetrieved: "Payment information retrieved successfully",
  },

  // Field labels and descriptions
  amount: {
    label: "Amount",
    description: "Payment amount in the specified currency",
    placeholder: "Enter amount",
  },
  currency: {
    label: "Currency",
    description: "Payment currency",
    placeholder: "Select currency",
    usd: "US Dollar (USD)",
    eur: "Euro (EUR)",
    pln: "Polish Zloty (PLN)",
  },
  mode: {
    label: "Payment mode",
    description: "Type of payment session",
    placeholder: "Select payment mode",
  },
  successUrl: {
    label: "Success URL",
    description: "URL to redirect after successful payment",
    placeholder: "https://example.com/success",
  },
  cancelUrl: {
    label: "Cancel URL",
    description: "URL to redirect if payment is canceled",
    placeholder: "https://example.com/cancel",
  },
  metadata: {
    label: "Metadata",
    description: "Additional metadata for the payment session",
    placeholder: "Enter metadata as JSON",
  },
  paymentId: {
    label: "Payment ID",
    description: "Specific payment ID to retrieve",
    placeholder: "Enter payment ID",
  },
  sessionId: {
    label: "Session ID",
    description: "Stripe session ID to query",
    placeholder: "Enter session ID",
  },
  limit: {
    label: "Limit",
    description: "Maximum number of results to return",
    placeholder: "20",
  },
  offset: {
    label: "Offset",
    description: "Number of results to skip",
    placeholder: "0",
  },
  priceId: {
    label: "Price ID",
    description: "Stripe price identifier for the product",
    placeholder: "price_1234567890",
  },
  provider: {
    label: "Payment provider",
    description: "Choose your payment method",
    placeholder: "Select payment provider",
  },

  // Enum translations
  enums: {
    paymentProvider: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
    },
    paymentStatus: {
      pending: "Pending",
      processing: "Processing",
      succeeded: "Succeeded",
      failed: "Failed",
      canceled: "Canceled",
      refunded: "Refunded",
    },
    paymentMethodType: {
      card: "Credit/Debit Card",
      bankTransfer: "Bank transfer",
      paypal: "PayPal",
      applePay: "Apple pay",
      googlePay: "Google pay",
      sepaDebit: "SEPA direct debit",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Requires payment method",
      requiresConfirmation: "Requires confirmation",
      requiresAction: "Requires action",
      processing: "Processing",
      requiresCapture: "Requires capture",
      canceled: "Canceled",
      succeeded: "Succeeded",
    },
    checkoutMode: {
      payment: "Payment",
      subscription: "Subscription",
      setup: "Setup",
    },
    refundStatus: {
      pending: "Pending",
      succeeded: "Succeeded",
      failed: "Failed",
      canceled: "Canceled",
    },
    disputeStatus: {
      warningNeedsResponse: "Warning - Needs Response",
      warningUnderReview: "Warning - Under Review",
      warningClosed: "Warning - Closed",
      needsResponse: "Needs response",
      underReview: "Under review",
      chargeRefunded: "Charge refunded",
      won: "Won",
      lost: "Lost",
    },
    invoiceStatus: {
      draft: "Draft",
      open: "Open",
      paid: "Paid",
      void: "Void",
      uncollectible: "Uncollectible",
    },
    taxStatus: {
      complete: "Complete",
      failed: "Failed",
      requiresLocation: "Requires location",
    },
    paymentInterval: {
      month: "Monthly",
      year: "Yearly",
      one_time: "One-time",
    },
    manualPaymentMethod: {
      cash: "Cash",
      bankTransfer: "Bank transfer",
      other: "Other",
    },
    billStatus: {
      DRAFT: "Draft",
      RECEIVED: "Received",
      APPROVED: "Approved",
      PAID: "Paid",
      DISPUTED: "Disputed",
    },
    estimateStatus: {
      DRAFT: "Draft",
      SENT: "Sent",
      ACCEPTED: "Accepted",
      DECLINED: "Declined",
      EXPIRED: "Expired",
      CONVERTED: "Converted",
    },
  },
};
