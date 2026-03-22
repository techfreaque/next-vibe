export const translations = {
  // Main referral domain
  category: "Referral",

  // Tags
  tags: {
    referral: "referral",
    codes: "codes",
    earnings: "earnings",
    get: "get",
    create: "create",
    list: "list",
  },

  // GET endpoint (get referral code)
  get: {
    title: "Get Referral Code",
    description: "Retrieve referral code details",
    form: {
      title: "Referral Code Details",
      description: "View referral code information",
      limit: {
        label: "Limit",
        description: "Maximum number of results to return",
      },
      offset: {
        label: "Offset",
        description: "Number of results to skip",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "Earner User ID",
        sourceUserId: "Source User ID",
        transactionId: "Transaction ID",
        level: "Level",
        amountCents: "Amount (Cents)",
        currency: "Currency",
        status: "Status",
        createdAt: "Created At",
      },
      totalCount: "Total Count",
    },
  },

  // POST endpoint (create referral code)
  post: {
    title: "Create Referral Code",
    description: "Create a new referral code",
    form: {
      title: "Create Referral Code",
      description: "Generate a new referral code to share with others",
    },
    submit: {
      label: "Create Code",
      loading: "Creating...",
    },
  },

  // PUT endpoint (update referral code)
  put: {
    title: "Update Referral Code",
    description: "Update referral code settings",
    form: {
      title: "Update Referral Code",
      description: "Modify referral code properties",
    },
  },

  // DELETE endpoint (deactivate referral code)
  delete: {
    title: "Deactivate Referral Code",
    description: "Deactivate a referral code",
    form: {
      title: "Deactivate Referral Code",
      description: "Disable this referral code",
    },
  },

  // Link to Lead endpoint
  linkToLead: {
    post: {
      title: "Link Referral to Lead",
      description: "Link a referral code to a lead before signup",
      form: {
        title: "Link Referral Code",
        description: "Associate referral code with your session",
      },
    },
    success: {
      title: "Referral Linked",
      description: "Referral code successfully linked to your session",
    },
  },

  // Codes List endpoint
  codes: {
    list: {
      get: {
        title: "List Referral Codes",
        description: "Get all your referral codes with statistics",
        form: {
          title: "Your Referral Codes",
          description: "View and manage your referral codes",
        },
        response: {
          codes: {
            id: "ID",
            code: "Code",
            label: "Label",
            currentVisitors: "Current Visitors",
            isActive: "Active",
            createdAt: "Created At",
            totalSignups: "Total Signups",
            totalRevenueCents: "Total Revenue (Cents)",
            totalEarningsCents: "Total Earnings (Cents)",
          },
        },
      },
      success: {
        title: "Codes Retrieved",
        description: "Successfully retrieved your referral codes",
      },
      widget: {
        empty: "You don't have any referral codes yet",
        copied: "Copied!",
        copy: "Copy Link",
        visitors: "Visitors",
        signups: "Signups",
        revenue: "Revenue",
        earnings: "Earnings",
        inactive: "This referral code is inactive",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Referral Statistics",
      description: "Get your referral program statistics",
      form: {
        title: "Your Referral Stats",
        description: "View your referral performance metrics",
      },
    },
    success: {
      title: "Stats Retrieved",
      description: "Successfully retrieved your referral statistics",
    },
    fields: {
      totalSignups: "Total Signups",
      totalSignupsDescription:
        "Number of users who signed up using your referral code",
      totalRevenue: "Total Revenue",
      totalRevenueDescription: "Total revenue generated from your referrals",
      totalEarned: "Total Earned",
      totalEarnedDescription: "Total commission earned from referrals",
      availableBalance: "Available Balance",
      availableBalanceDescription: "Available balance ready for payout",
      availableBalanceDescriptionLow:
        "Spend on AI chats — other credits used first. Earn $40 to unlock withdrawal.",
      totalRevenueCredits: "Total Revenue (Credits)",
      totalEarnedCredits: "Total Earned (Credits)",
      totalPaidOutCredits: "Total Paid Out (Credits)",
      availableCredits: "Available Credits",
    },
  },

  // Earnings List endpoint
  earnings: {
    list: {
      get: {
        title: "List Referral Earnings",
        description: "Get your referral earnings history",
        form: {
          title: "Your Referral Earnings",
          description: "View your earnings from referrals",
        },
        response: {
          earnings: {
            id: "ID",
            earnerUserId: "Earner User ID",
            sourceUserId: "Source User ID",
            transactionId: "Transaction ID",
            level: "Level",
            amountCents: "Amount (Cents)",
            currency: "Currency",
            status: "Status",
            createdAt: "Created At",
          },
        },
      },
      success: {
        title: "Earnings Retrieved",
        description: "Successfully retrieved your referral earnings",
      },
    },
  },

  // Form fields
  form: {
    fields: {
      code: {
        label: "Referral Code",
        description: "Unique referral code",
        placeholder: "Enter code",
      },
      label: {
        label: "Label",
        description: "Optional label for this code",
        placeholder: "My referral code",
      },
      description: {
        label: "Description",
        description: "Optional description",
        placeholder: "Enter description",
      },
      maxUses: {
        label: "Maximum Uses",
        description: "Maximum number of times this code can be used",
        placeholder: "Leave empty for unlimited",
      },
      expiresAt: {
        label: "Expiration Date",
        description: "When this code expires",
        placeholder: "Select date",
      },
      isActive: {
        label: "Active",
        description: "Whether this code is currently active",
      },
    },
  },

  // Response fields
  response: {
    id: "ID",
    code: "Code",
    label: "Label",
    description: "Description",
    ownerUserId: "Owner User ID",
    maxUses: "Maximum Uses",
    currentUses: "Current Uses",
    expiresAt: "Expires At",
    isActive: "Active",
    createdAt: "Created At",
    updatedAt: "Updated At",
    referralCode: "Referral Code",
    success:
      "🎉 Your referral code is ready! Copy the link below and start earning 20% commission on every subscription.",
    message: "Message",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Payout Requests",
        description: "Manage referral payout requests",
      },
      post: {
        title: "Process Payout",
        description: "Approve, reject, or complete a payout request",
      },
      fields: {
        status: {
          label: "Status Filter",
          description: "Filter by payout status",
        },
        requestId: {
          label: "Request ID",
          description: "Payout request identifier",
        },
        action: {
          label: "Action",
          description: "Action to perform on the payout request",
        },
        adminNotes: {
          label: "Admin Notes",
          description: "Optional notes for this action",
        },
        rejectionReason: {
          label: "Rejection Reason",
          description: "Reason for rejecting the payout request",
        },
      },
      widget: {
        empty: "No payout requests found",
        approve: "Approve",
        reject: "Reject",
        complete: "Complete",
        credits: "credits",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Your Earnings",
      description: "View your referral earnings and payout history",
    },
    post: {
      title: "Request Payout",
      description: "Withdraw your referral earnings",
    },
    fields: {
      amountCents: {
        label: "Amount (credits)",
        description: "Amount to withdraw in credits",
        placeholder: "e.g. 5000",
      },
      currency: {
        label: "Payout Method",
        description: "How you want to receive your earnings",
      },
      walletAddress: {
        label: "Wallet Address",
        description: "Required for BTC or USDC payouts",
        placeholder: "Your wallet address",
      },
    },
    widget: {
      totalEarned: "Total Earned",
      available: "Available",
      locked: "Locked",
      credits: "credits",
      readyForPayout: "ready for payout",
      moreToUnlock: "more to unlock",
      pendingConfirmation: "pending confirmation",
      requestPayout: "Request Payout",
      payoutHistory: "Payout History",
      noPayout: "No payout requests yet",
      howItWorksTitle: "How It Works",
      step1Title: "Create referral codes",
      step1Body:
        "Generate unique codes for different audiences - friends, social media, or campaigns.",
      step2Title: "Share your link",
      step2Body:
        "When someone signs up using your link and subscribes, you earn commission.",
      step3Title: "Get paid",
      step3Body:
        "Earnings are instant. Use them as chat credits or withdraw to crypto.",
      withdrawTitle: "Withdraw Your Earnings",
      withdrawDescription: "Multiple ways to use your referral earnings",
      useAsCredits: "Use as Chat Credits",
      useAsCreditsDesc:
        "Instantly convert earnings to chat credits for AI conversations.",
      cryptoPayout: "Withdraw to Crypto",
      cryptoPayoutDesc: "Request payout in BTC or USDC to your wallet address.",
      minimumNote:
        "Minimum payout: $40. Crypto payouts are processed within 48 hours after approval.",
      progressLabel: "Progress to payout",
      unlockedOf: "unlocked of",
      viewHistory: "View History",
    },
    email: {
      user: {
        subjectCrypto: "Payout request received",
        subjectCredits: "Credits converted",
        titleCrypto: "Your Payout Request",
        titleCredits: "Credits Converted",
        previewCrypto: "Your payout request is being processed",
        previewCredits: "Your credits have been converted",
        bodyCrypto:
          "We have received your payout request. Crypto payouts are processed within 48 hours after admin approval.",
        bodyCredits:
          "Your referral earnings have been instantly converted to chat credits and added to your account.",
        followUpCrypto:
          "You will receive another email once your payout has been processed.",
        labelAmount: "Amount",
        labelMethod: "Method",
        labelWallet: "Wallet",
        credits: "credits",
      },
      admin: {
        subject: "New payout request",
        title: "New Payout Request",
        preview: "Payout request submitted",
        body: "A user has submitted a payout request.",
        footer: "Please review and process this request in the admin panel.",
        labelUser: "User",
        labelAmount: "Amount",
        labelCurrency: "Currency",
        labelWallet: "Wallet",
        credits: "credits",
      },
    },
    errors: {
      minimumAmount: "Minimum payout amount is $40",
      walletRequired: "Wallet address is required for crypto payouts",
      insufficientBalance: "Insufficient balance for payout",
      notFound: "Payout request not found",
      invalidStatus: "Invalid payout request status for this operation",
    },
  },

  // Error types
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid referral code parameters",
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
      description: "Referral code not found",
    },
    not_found: "Referral code not found",
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
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
      description: "Referral code already exists",
    },
    code_exists: "This referral code already exists",
    code_expired: "This referral code has expired",
    code_inactive: "This referral code is not active",
    max_uses_reached: "This referral code has reached its maximum uses",
    invalid_code: "Invalid referral code",
  },

  // Success types
  success: {
    title: "Success",
    description: "Operation completed successfully",
    code_created: "Referral code created successfully",
    code_updated: "Referral code updated successfully",
    code_deactivated: "Referral code deactivated successfully",
  },

  // Enum translations
  enums: {
    sourceType: {
      subscription: "Subscription",
      creditPack: "Credit Pack",
    },
    earningStatus: {
      pending: "Pending",
      confirmed: "Confirmed",
      canceled: "Canceled",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "Credits",
    },
    payoutStatus: {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      rejected: "Rejected",
      approved: "Approved",
    },
  },
};
