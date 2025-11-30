/**
 * English translations for credits endpoints
 */

export const translations = {
  enums: {
    creditType: {
      userSubscription: "User Subscription Credits",
      leadFree: "Lead Free Tier Credits",
    },
    transactionType: {
      purchase: "Purchase",
      subscription: "Subscription",
      usage: "Usage",
      expiry: "Expiry",
      freeTier: "Free Tier",
      monthlyReset: "Monthly Reset",
      freeGrant: "Free Grant",
      freeReset: "Free Reset",
      refund: "Refund",
      transfer: "Transfer",
      otherDevices: "Spending from other devices",
    },
  },
  expire: {
    task: {
      description: "Expires old subscription credits daily",
      error: "Failed to expire credits",
    },
  },
  cleanup: {
    task: {
      description: "Cleans up orphaned lead wallets weekly",
      error: "Failed to cleanup orphaned wallets",
    },
  },
  errors: {
    getBalanceFailed: "Failed to get credit balance",
    getLeadBalanceFailed: "Failed to get lead credit balance",
    getOrCreateLeadFailed: "Failed to get or create lead",
    addCreditsFailed: "Failed to add credits",
    deductCreditsFailed: "Failed to deduct credits",
    insufficientCredits: "Insufficient credits",
    getTransactionsFailed: "Failed to get credit transactions",
    invalidIdentifier: "Invalid user or lead identifier",
    userNotFound: "User not found",
    noLeadFound: "No lead found for user",
    getCreditIdentifierFailed: "Failed to get credit identifier",
    noCreditSource: "No credit source available",
    stripeCustomerFailed: "Failed to create Stripe customer",
    checkoutFailed: "Failed to create checkout session",
    mergeFailed: "Failed to merge lead credits",
    mergeLeadWalletsFailed: "Failed to merge lead wallets into user account",
    cleanupOrphanedFailed: "Failed to cleanup orphaned lead wallets",
    monthlyResetFailed: "Failed to reset monthly credits",
    noLeadsToMerge: "No leads provided to merge",
    oldestLeadNotFound: "Could not find oldest lead in cluster",
    transactionFailed: "Failed to create transaction record",
    not_implemented_on_native:
      "{{method}} is not implemented on native platform. Please use the web version for this operation.",
    expireCreditsFailed: "Failed to expire credits",
    invalidAmount: "Credit amount must be a positive number",
    walletNotFound: "Wallet not found",
    walletCreationFailed: "Failed to create wallet",
  },
  get: {
    title: "Get Credit Balance",
    description: "Retrieve current user's credit balance with breakdown",
    response: {
      title: "Credit Balance",
      description: "Your current credit balance and breakdown",
    },
    total: {
      content: "Total Credits",
    },
    expiring: {
      content: "Expiring Credits (Subscription)",
    },
    permanent: {
      content: "Permanent Credits (Packs)",
    },
    free: {
      content: "Free Tier Credits",
    },
    expiresAt: {
      content: "Expires At",
    },
    success: {
      title: "Balance Retrieved",
      description: "Credit balance retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view your credit balance",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to access this resource",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve credit balance",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      noActiveSubscription: {
        title: "Active Subscription Required",
        description:
          "You must have an active subscription to purchase credit packs",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
      no_active_subscription: {
        title: "Active Subscription Required",
        description:
          "You must have an active subscription to purchase credit packs",
      },
    },
  },
  history: {
    get: {
      title: "Get Credit History",
      description: "Retrieve paginated credit transaction history",
      container: {
        title: "Credit History",
        description: "View your credit transaction history",
      },
      limit: {
        label: "Limit",
        description: "Maximum number of transactions to return (1-100)",
      },
      offset: {
        label: "Offset",
        description: "Number of transactions to skip for pagination",
      },
      transactions: {
        title: "Transactions",
        description: "List of credit transactions",
      },
      totalCount: {
        content: "Total Count",
      },
      transaction: {
        id: {
          content: "Transaction ID",
        },
        amount: {
          content: "Amount",
        },
        balanceAfter: {
          content: "Balance After",
        },
        type: {
          content: "Type",
        },
        modelId: {
          content: "Model",
        },
        messageId: {
          content: "Message ID",
        },
        createdAt: {
          content: "Date",
        },
      },
      success: {
        title: "History Retrieved",
        description: "Credit history retrieved successfully",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        network: {
          title: "Network Error",
          description: "Network connection failed",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to view your credit history",
        },
        forbidden: {
          title: "Forbidden",
          description: "You don't have permission to access this resource",
        },
        notFound: {
          title: "Not Found",
          description: "Resource not found",
        },
        server: {
          title: "Server Error",
          description: "Failed to retrieve credit history",
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
  },
  purchase: {
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
        label: "Payment Provider",
        description: "Choose how you want to pay",
        placeholder: "Select payment provider",
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
          description: "You have unsaved Changes",
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
  },
};
