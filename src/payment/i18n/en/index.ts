export const translations = {
  // Import sub-domain translations
  checkout: {
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
        title: "Invoice Configuration",
        description: "Configure invoice parameters",
      },
      response: {
        success: "Invoice created successfully",
        message: "Status message",
        invoice: {
          title: "Invoice Details",
          description: "Generated invoice information",
          id: "Invoice ID",
          userId: "User ID",
          stripeInvoiceId: "Stripe Invoice ID",
          invoiceNumber: "Invoice Number",
          amount: "Amount",
          currency: "Currency",
          status: "Status",
          invoiceUrl: "Invoice URL",
          invoicePdf: "Invoice PDF",
          dueDate: "Due Date",
          paidAt: "Paid At",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
      label: "Due Date",
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
      title: "Customer Portal",
      description: "Create customer portal session for billing management",
      form: {
        title: "Portal Configuration",
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
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access forbidden",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
    title: "Process Refund",
    description: "Process a refund for a payment transaction",
    category: "Payment Refunds",

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
      title: "Refund Form",
      description: "Enter refund details",
      fields: {
        transactionId: {
          label: "Transaction ID",
          description: "ID of the transaction to refund",
          placeholder: "Enter transaction ID",
        },
        amount: {
          label: "Refund Amount",
          description: "Amount to refund (optional, defaults to full amount)",
          placeholder: "Enter amount",
        },
        reason: {
          label: "Refund Reason",
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
      title: "Process Refund",
      description: "Process a payment refund",
      response: {
        success: "Refund processed successfully",
        message: "Status message",
        refund: {
          title: "Refund Details",
          description: "Processed refund information",
          id: "Refund ID",
          userId: "User ID",
          transactionId: "Transaction ID",
          stripeRefundId: "Stripe Refund ID",
          amount: "Refund Amount",
          currency: "Currency",
          status: "Refund Status",
          reason: "Refund Reason",
          createdAt: "Created At",
          updatedAt: "Updated At",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
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
          title: "Not Found",
          description: "Transaction not found",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        network: {
          title: "Network Error",
          description: "Network connection error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        conflict: {
          title: "Conflict",
          description: "Refund conflict detected",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
            paymentIntentSucceeded: "Payment Intent Succeeded",
            paymentIntentFailed: "Payment Intent Failed",
            subscriptionCreated: "Subscription Created",
            subscriptionUpdated: "Subscription Updated",
            invoicePaymentSucceeded: "Invoice Payment Succeeded",
            invoicePaymentFailed: "Invoice Payment Failed",
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
          description:
            "Please check your Stripe CLI configuration and try again",
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
          description:
            "An error occurred while processing the Stripe operation",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred with Stripe CLI",
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
        notConfigured: {
          title: "Stripe Not Configured",
          description:
            "Stripe is not configured - set STRIPE_SECRET_KEY in your .env",
        },
        stripeCliNotInstalled: "Stripe CLI is not installed",
        listenerFailed: "Failed to start Stripe webhook listener",
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
          title: "User Not Found",
          description: "The specified user could not be found",
        },
        customerCreationFailed: {
          title: "Customer Creation Failed",
          description: "Failed to ensure NOWPayments customer: {error}",
        },
        productNotFound: {
          title: "Product Not Found",
          description: "The specified product could not be found: {productId}",
        },
        userEmailRequired: {
          title: "User Email Required",
          description: "User email is required for subscriptions: {userId}",
        },
        checkoutCreationFailed: {
          title: "Checkout Creation Failed",
          description: "Failed to create NOWPayments checkout session: {error}",
        },
        invoiceCreationFailed: {
          title: "Invoice Creation Failed",
          description: "Failed to create NOWPayments invoice: {error}",
        },
        invalidApiKey: {
          title: "Invalid API Key",
          description:
            "Invalid NOWPayments API key. Please check your configuration and ensure you have a valid API key from https://nowpayments.io/app/dashboard",
        },
        planCreationFailed: {
          title: "Plan Creation Failed",
          description:
            "Failed to create NOWPayments subscription plan: {error}",
        },
        subscriptionCreationFailed: {
          title: "Subscription Creation Failed",
          description: "Failed to create NOWPayments subscription: {error}",
        },
        subscriptionRetrievalFailed: {
          title: "Subscription Retrieval Failed",
          description: "Failed to retrieve NOWPayments subscription: {error}",
        },
        subscriptionCancellationFailed: {
          title: "Subscription Cancellation Failed",
          description: "Failed to cancel NOWPayments subscription: {error}",
        },
        subscriptionListFailed: {
          title: "Subscription List Failed",
          description: "Failed to list NOWPayments subscriptions: {error}",
        },
        notConfigured: {
          title: "NOWPayments Not Configured",
          description:
            "NOWPayments is not configured - set NOWPAYMENTS_API_KEY and NOWPAYMENTS_IPN_SECRET in your .env",
        },
        webhookVerificationFailed: {
          title: "Webhook Verification Failed",
          description:
            "Failed to verify NOWPayments webhook signature: {error}",
        },
        paymentStatusFailed: {
          title: "Payment Status Retrieval Failed",
          description:
            "Failed to retrieve payment status from NOWPayments: {error}",
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
    },
  },

  // Main payment domain
  category: "Billing",

  // Main form configuration
  form: {
    title: "Payment Configuration",
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
    title: "Create Payment Session",
    titleShort: "Create Session",
    description: "Create a new payment session with Stripe",
    form: {
      title: "Payment Configuration",
      description: "Configure payment session parameters",
    },
    paymentMethodTypes: {
      label: "Payment Methods",
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
      label: "Customer Email",
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
        title: "Validation Error",
        description: "Invalid payment parameters",
      },
      internal: {
        title: "Internal Error",
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
        title: "Not Found",
        description: "Payment session not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
    title: "Get Payment Information",
    titleShort: "Payments",
    description: "Retrieve payment transactions and methods",
    form: {
      title: "Payment Query",
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
        title: "Validation Error",
        description: "Invalid query parameters",
      },
      internal: {
        title: "Internal Error",
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
        title: "Not Found",
        description: "Payment information not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network connection error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
      title: "Validation Error",
      description: "Invalid payment parameters",
    },
    notFound: {
      title: "Not Found",
      description: "Payment not found",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Permission denied",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Payment conflict detected",
    },
    notImplemented: {
      title: "Not Implemented",
      description: "This payment provider feature is not yet implemented",
    },
    customerCreationFailed: "Failed to create Stripe customer",
    customerNotFound: "Stripe customer not found",
    localMode: "Payment is disabled in local development mode",
    webhookVerificationFailed: "Webhook signature verification failed",
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
    label: "Payment Mode",
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
    label: "Payment Provider",
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
      bankTransfer: "Bank Transfer",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA Direct Debit",
    },
    paymentIntentStatus: {
      requiresPaymentMethod: "Requires Payment Method",
      requiresConfirmation: "Requires Confirmation",
      requiresAction: "Requires Action",
      processing: "Processing",
      requiresCapture: "Requires Capture",
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
      needsResponse: "Needs Response",
      underReview: "Under Review",
      chargeRefunded: "Charge Refunded",
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
      requiresLocation: "Requires Location",
    },
    paymentInterval: {
      month: "Monthly",
      year: "Yearly",
      one_time: "One-time",
    },
    manualPaymentMethod: {
      cash: "Cash",
      bankTransfer: "Bank Transfer",
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
