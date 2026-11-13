/**
 * English translations for credits endpoints
 */

export const translations = {
  category: "Credits",
  tags: {
    credits: "credits",
    balance: "balance",
  },
  repository: {
    bonusCreditsAdded: "Added {{amount}} bonus credits",
    tts: "Text-to-Speech",
    stt: "Speech-to-Text",
    search: "Search",
    sttHotkey: "Speech-to-Text (Hotkey)",
  },
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
      otherDevices: "Used on another device",
      referralEarning: "Referral Earning",
      referralPayout: "Referral Payout",
    },
    packType: {
      subscription: "Subscription",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Earned",
    },
  },
  historyLabels: {
    sharedLimit: "Linked devices share one monthly limit",
    monthly: "Monthly free credits",
    monthlyGuest: "Monthly free credits (no account)",
    monthlyAccount: "Monthly free credits (free account)",
    monthlyAccountNewsletter: "Monthly free credits (account + newsletter)",
    freeGuest: "Free credits (no account)",
    accountUpgrade: "Free account bonus",
    newsletterBonus: "Newsletter bonus",
    otherDevices: "Used on another device",
    linkedAccount: "Used by the linked account",
  },
  expire: {
    post: {
      title: "Expire Credits",
      titleShort: "Expire Credits",
      description: "Expire old subscription credits (called by cron)",
      tag: "expire",
      container: {
        title: "Expire Credits",
        description: "Credits expiration results",
      },
      response: {
        expiredCount: "Expired Count",
      },
      success: {
        title: "Credits Expired",
        description: "Old subscription credits expired successfully",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        server: {
          title: "Server Error",
          description: "Failed to expire credits",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
      },
    },
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
    insufficientCredits:
      "Insufficient credits. You need {{cost}} credits to use this feature.",
    deductionFailed: "Failed to deduct {{cost}} credits. Please try again.",
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
    addEarnedCreditsFailed: "Failed to add earned credits",
    getEarnedBalanceFailed: "Failed to get earned credits balance",
    insufficientEarnedCredits: "Insufficient earned credits for this operation",
    deductEarnedCreditsFailed: "Failed to deduct earned credits",
    getReferralTransactionsFailed: "Failed to get referral transactions",
  },
  get: {
    title: "Get Credit Balance",
    titleShort: "Balance",
    description: "Retrieve current user's credit balance with breakdown",
    response: {
      title: "Credit Balance",
      description: "Your current credit balance and breakdown",
    },
    balance: {
      subscribe: "See plans",
      freePlanHint:
        "{{count}} free credits a month, {{max}} with the newsletter. Subscribe for {{subCredits}}, or just buy a pack. No subscription needed.",
      lowBalance: {
        title: "{{count}} credits left",
        emptyTitle: "You're out of credits",
        hint: "Top up with {{packCredits}} credits for {{packPrice}}. They never expire. No subscription needed.",
        cta: "Top up credits",
      },
      freePlan: "You're on the free plan",
      guestPlan: "Guest balance",
      signUp: "Sign up free",
      loadFailed: "Balance didn't load.",
      retry: "Retry",
      title: "Your credits",
      adminTitle: "Spending Limit",
      description: "One balance for all {{modelCount}} models.",
      adminDescription:
        "Credits act as a spending cap - control how much AI usage is allowed across all users.",
      credit: "{{count}} credit",
      credits: "{{count}} credits",
      expiring: {
        title: "Expiring Credits",
        description: "{{subCredits}} new credits per subscription cycle",
        adminDescription: "Time-limited credits (subscription cycle)",
      },
      permanent: {
        title: "Permanent Credits",
        description: "Never expire - yours to keep",
        adminDescription: "Permanent credits - never expire",
      },
      free: {
        title: "Free Credits",
        description: "{{count}} free every month, {{max}} with the newsletter",
        descriptionGuest:
          "{{guest}} free every month. Sign up for {{signedIn}}, {{max}} with the newsletter.",
        adminDescription:
          "Free cap per pool/month (shared across devices): {{guest}} guest, {{signedIn}} signed in, {{max}} signed in + newsletter",
      },
      earned: {
        title: "Earned Credits",
        description: "Earned via referrals - click to invite friends",
      },
      spending: {
        title: "Your Earned Credits",
        adminDescription: "Your personal referral earnings (not instance-wide)",
      },
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
    earned: {
      content: "Earned Credits (Referrals)",
    },
    expiresAt: {
      content: "Expires At",
    },
    capacity: {
      content: "Total Capacity",
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
      emptyHint: "Every credit in and out lands here.",
      title: "Get Credit History",
      titleShort: "Credit History",
      description: "Retrieve paginated credit transaction history",
      container: {
        title: "Credit History",
        description: "View your credit transaction history",
      },
      emptyState: "No transactions yet",
      balance: "Balance after: {{count}}",
      limit: {
        label: "Limit",
        description: "Maximum number of transactions to return (1-100)",
      },
      offset: {
        label: "Offset",
        description: "Number of transactions to skip for pagination",
      },
      targetUserId: {
        label: "Target User ID",
      },
      targetLeadId: {
        label: "Target Lead ID",
      },
      id: "Transaction ID",
      amount: "Amount",
      type: "Type",
      modelId: "Model",
      messageId: "Message ID",
      createdAt: "Date",
      transactions: {
        title: "Transactions",
        description: "List of credit transactions",
      },
      paginationInfo: {
        total: "Total Transactions",
        totalPages: "Total Pages",
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
  adminAdd: {
    post: {
      title: "Add Credits",
      titleShort: "Add Credits",
      description: "Add credit packs to a user account (admin only)",
      tag: "admin",
      container: {
        title: "Add Credits to User",
        description: "Grant bonus credits to a specific user account",
        selfTitle: "Add Credits to Your Account",
        selfDescription: "Grant yourself bonus credits",
      },
      targetUserId: {
        label: "Target User ID",
        description: "The user to add credits to",
      },
      amount: {
        label: "Amount",
        description: "Number of credits to add",
        placeholder: "Enter credit amount...",
      },
      packType: {
        label: "Pack Type",
        description: "Type of credit pack to add",
      },
      response: {
        message: {
          content: "Result",
        },
      },
      backButton: {
        label: "Back",
      },
      submitButton: {
        label: "Add Credits",
        loadingText: "Adding...",
      },
      success: {
        title: "Credits Added",
        description: "Credits have been added to the user account",
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
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        notFound: {
          title: "Not Found",
          description: "User not found",
        },
        server: {
          title: "Server Error",
          description: "Failed to add credits",
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
  email: {
    creditPack: {
      user: {
        subject: "Your credit pack is ready - {{appName}}",
        title: "Credits added to your account",
        previewText: "{{credits}} credits have been added to your account",
        greeting: "Hi {{privateName}},",
        body: "Your credit pack purchase was successful. {{credits}} permanent credits have been added to your account and are ready to use.",
        cta: "Start using your credits",
        signoff: "Thank you for your purchase!\n\nThe {{appName}} Team",
      },
      admin: {
        subject: "[{{appName}}] Credit pack purchased - {{credits}} credits",
        title: "Credit Pack Purchase",
        preview: "A user purchased a credit pack",
        body: "A user has purchased a credit pack.",
        labelUser: "User",
        labelCredits: "Credits",
        footer: "Automated notification from {{appName}}",
      },
    },
  },
};
