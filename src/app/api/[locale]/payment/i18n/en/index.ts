import { translations as checkoutTranslations } from "../../checkout/i18n/en";
import { translations as invoiceTranslations } from "../../invoice/i18n/en";
import { translations as portalTranslations } from "../../portal/i18n/en";
import { translations as nowpaymentsProviderTranslations } from "../../providers/nowpayments/i18n/en";
import { translations as stripeProviderTranslations } from "../../providers/stripe/i18n/en";
import { translations as refundTranslations } from "../../refund/i18n/en";

export const translations = {
  // Import sub-domain translations
  checkout: checkoutTranslations,
  invoice: invoiceTranslations,
  portal: portalTranslations,
  refund: refundTranslations,
  providers: {
    stripe: stripeProviderTranslations,
    nowpayments: nowpaymentsProviderTranslations,
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
  },
};
