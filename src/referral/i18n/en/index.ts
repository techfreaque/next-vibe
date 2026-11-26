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
    titleShort: "Get Code",
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
    titleShort: "Create Code",
    description: "Create a new referral code",
    form: {
      title: "New referral code",
      description:
        "One code per audience. Discord, blog, friends. Each tracked on its own.",
    },
    submit: {
      label: "Create code",
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
      titleShort: "Link Referral",
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
        title: "Referral earnings",
        titleShort: "Referral earnings",
        description:
          "Browse referral commissions. Platform administrators can view all partners.",
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
        loading: "Loading your codes...",
        empty: "You don't have any referral codes yet",
        emptyHint:
          "Create your first code below. Your link is ready instantly.",
        copied: "Copied!",
        copy: "Copy Link",
        visitors: "Visitors",
        signups: "Signups",
        revenue: "Revenue",
        earnings: "Earnings",
        inactive: "This referral code is inactive",
        conversionHint:
          "Every {{examplePrice}}/mo subscriber earns you {{exampleEarning}}/mo - recurring",
        linkGen: "Custom Link",
        linkGenPlaceholder: "Paste any page URL...",
        linkGenHint:
          "Paste any unbottled page URL to create a tracked referral link",
        linkGenCopy: "Copy",
        linkGenCopied: "Copied!",
      },
    },
  },

  // Stats endpoint
  stats: {
    get: {
      title: "Referral Statistics",
      titleShort: "Stats",
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
    widget: {
      emptyAdminMessage:
        "Open the overview to see activity across the entire program.",
      loading: "Loading referral statistics",
      loadError: "Referral statistics could not load",
      retry: "Try again",
      emptyTitle: "No referral activity yet",
      openCodes: "Open referral codes",
      revenueCoverage:
        "Original purchase amounts recorded for {{measured}} of {{total}} purchases.",
      revenueUnavailable: "Unavailable",
      walletUnits: "{{amount}} credits",
      adminNotice:
        "These figures cover your referrals. Open the overview for program totals.",
      openOverview: "Open Referral Overview",
      emptyMessage:
        "Share a referral code to start tracking signups and commissions.",
    },
    fields: {
      totalSignups: "Total Signups",
      totalSignupsDescription:
        "Number of users who signed up using your referral code",
      totalRevenue: "Recorded purchase value",
      totalRevenueDescription:
        "Original USD purchase amounts linked to your commissions.",
      totalEarned: "Total Earned",
      totalEarnedDescription:
        "Credits earned, including those in the refund window.",
      availableBalance: "Available Balance",
      availableBalanceDescription:
        "Wallet credits available after payout reservations.",
      availableBalanceDescriptionLow:
        "Wallet credits available after payout reservations. Minimum payout: {{minPayout}} credits.",
      totalRevenueCredits: "Total Revenue (Credits)",
      totalEarnedCredits: "Total Earned (Credits)",
      totalPaidOutCredits: "Total Paid Out (Credits)",
      availableCredits: "Available Credits",
    },
  },

  // Earnings List endpoint
  earnings: {
    confirm: {
      post: {
        title: "Confirm Referral Earnings",
        titleShort: "Confirm Earnings",
        description:
          "Unlock referral earnings whose refund window has passed. Runs daily.",
        container: {
          title: "Earnings Confirmation",
          description: "Pending earnings past the refund window",
        },
        response: {
          confirmedCount: "Confirmed",
          failedCount: "Failed",
        },
        success: {
          title: "Earnings Confirmed",
          description: "Matured referral earnings are now spendable",
        },
      },
      task: {
        description:
          "Turns referral earnings older than the refund window into earned credits",
      },
    },
    list: {
      get: {
        title: "Referral earnings",
        titleShort: "Referral earnings",
        description:
          "Browse referral commissions. Platform administrators can view all partners.",
        form: {
          title: "Your Referral Earnings",
          description: "View your earnings from referrals",
          targetUserId: "Partner account",
          personal: "Only my earnings",
          limit: {
            label: "Rows per page",
            description: "How many earnings to show per page",
          },
          offset: {
            label: "Start at",
            description: "Number of earnings to skip",
          },
        },
        widget: {
          subtitle:
            "Commission from payments of users you referred. Each one is on hold until the refund window passes.",
          platformSubtitle:
            "Referral commissions across all partners. Pending commissions are held until the refund window closes.",
          platformEmptyHint:
            "Commissions will appear here when referred customers pay.",
          direct: "Direct referral",
          level: "Level {{level}} referral",
          empty: "No earnings yet",
          emptyHint:
            "When someone you referred pays, your commission shows up here.",
          loading: "Loading earnings…",
          loadFailed: "Earnings could not load",
          retry: "Try again",
          showing: "{{from}} to {{to}} of {{total}}",
          previous: "Previous",
          next: "Next",
          pageTotal: "Total on this page ({{currency}})",
          col: {
            partner: "Partner",
            date: "Date",
            source: "Source",
            status: "Status",
            amount: "Commission",
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
        label: "Code",
        description: "What people type or see in your link. 3-50 characters.",
        placeholder: "e.g. ALEX10",
      },
      label: {
        label: "Label (only you see it)",
        description: "Where you'll share it.",
        placeholder: "e.g. YouTube bio",
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
      "🎉 Your referral code is ready! Copy the link below and start earning {{directPct}} commission on every subscription - plus bonus earnings from their referrals.",
    message: "Message",
  },

  // Admin payout management
  admin: {
    payouts: {
      get: {
        title: "Payout requests",
        titleShort: "Payout requests",
        description: "Manage referral payout requests",
      },
      post: {
        title: "Process Payout",
        titleShort: "Process Payout",
        description: "Approve, reject, or complete a payout request",
      },
      fields: {
        search: {
          label: "Partner email",
          description: "Search by full or partial email address.",
        },
        userId: {
          label: "Partner account",
        },
        page: {
          label: "Page",
        },
        limit: {
          label: "Results per page",
        },
        status: {
          all: "All statuses",
          label: "Status Filter",
          description: "Filter by payout status",
        },
        currency: {
          label: "Payout method",
          description: "Filter by payout method",
          all: "All methods",
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
          label: "Rejection reason",
          description: "Reason for rejecting the payout request",
        },
      },
      widget: {
        empty: "No payout requests match these filters",
        emptyHint: "Try another email, status or method.",
        results: "{{count}} results",
        clear: "Clear filters",
        refresh: "Refresh",
        loading: "Loading payout requests…",
        amount: "{{credits}} earned credits · {{value}} USD value",
        openPartner: "Open partner",
        actionFor: "{{action}} payout for {{email}}",
        previous: "Previous page",
        next: "Next page",
        page: "Page {{page}} of {{total}}",
        confirmAction: "Confirm action",
        lookupFailed: "Unable to load the payout request.",
        state: "Status",
        valueLabel: "Requested value",
        destinationLabel: "Destination",
        actionSaved: "Payout action saved.",
        approveDetail:
          "Approval keeps the earned credits reserved for this payout.",
        rejectDetail:
          "Rejection releases the earned credits reserved for this payout.",
        completeDetail:
          "Mark the payout complete after sending the transfer. This deducts the corresponding earned credits.",
        approve: "Approve",
        reject: "Reject",
        complete: "Complete",
        overBalanceSingle:
          "This request is {{amount}}, but only {{available}} is confirmed and unpaid. Do not approve it.",
        partnerNoCodes: "No own code · referred users: {{referred}}",
        overBalance:
          "{{count}} open requests total {{open}}, but only {{available}} is confirmed and unpaid. Do not approve all of them.",
        possibleDuplicate:
          "Possible duplicate: {{count}} more open request(s) with the same amount and wallet.",
        overBalanceShort:
          "Over the confirmed balance (see the first request of this partner).",
        approveOverBalance: "Approve anyway",
        subtitle:
          "Partner withdrawals. Approve, send the transfer, then mark it complete.",
        tabAll: "All",
        searchPlaceholder: "Search partner email",
        flagOver: "Over confirmed balance",
        flagDuplicate: "Possible duplicate ({{count}})",
        moreFor: "More actions for {{email}}",
        rejectEllipsis: "Reject…",
        freeLabel: "Free after open requests",
        earnedLabel: "Earned",
        earnedValue: "{{confirmed}} confirmed · {{pending}} on hold",
        paidLabel: "Paid out so far",
        codesLabel: "Codes",
        codesValue: "{{codes}} · {{referred}} referred users",
        updatedLabel: "Last update",
        copy: "Copy",
        copied: "Copied",
        reference: "Request reference",
        compactMeta: "{{method}} · {{date}}",
        showDetails: "Details",
        hideDetails: "Hide details",
        partnerScope: "Requests of {{email}}",
        showAllPartners: "Show all partners",
        loadFailed: "Payout requests could not load",
        retry: "Try again",
        emptyAll: "No payout requests yet",
        emptyAllHint:
          "Partners request payouts from their earnings page. New requests land here for review.",
        showing: "{{from}} to {{to}} of {{total}}",
        cancel: "Cancel",
        confirmApprove: "Approve payout",
        confirmReject: "Reject payout",
        confirmComplete: "Mark payout complete",
        col: {
          partner: "Partner",
          requested: "Requested",
          method: "Method",
          status: "Status",
          amount: "Amount",
          actions: "Actions",
        },
        nextStep: {
          failed:
            "The transfer could not be completed and no credits were deducted. The partner can submit a new request.",
          processing:
            "Transfer in progress. It completes or fails on its own; no action needed.",
          credits:
            "Credits payouts convert when requested, so a pending one is stuck. Reject it to release the earnings; the partner can request again.",
        },
        prepareBill: "Prepare supplier bill",
        codeReport: "Code report",
      },
    },
  },

  // Payout endpoint + errors
  payout: {
    get: {
      title: "Your Earnings",
      titleShort: "My Earnings",
      description: "View your referral earnings and payout history",
    },
    post: {
      title: "Request Payout",
      titleShort: "Request Payout",
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
      step2Title: "Share your link - or a skill link",
      step2Body:
        "Referral link: {{directPct}} of every payment from that user, forever. Your skill shared by others: {{skillBonusPct}} of every payment from those users - income from links you never posted.",
      step3Title: "Get paid",
      step3Body:
        "Earnings unlock {{holdDays}} days after each payment - the refund window. Then use them as chat credits or withdraw to crypto.",
      withdrawTitle: "Withdraw Your Earnings",
      withdrawDescription: "Multiple ways to use your referral earnings",
      useAsCredits: "Use as Chat Credits",
      useAsCreditsDesc:
        "Instantly convert earnings to chat credits for AI conversations.",
      cryptoPayout: "Withdraw to Crypto",
      cryptoPayoutDesc: "Request payout in BTC or USDC to your wallet address.",
      minimumNote:
        "Minimum payout: {{minPayout}}. Crypto payouts are processed within {{cryptoPayoutHours}} hours after approval.",
      progressLabel: "Progress to payout",
      unlockedOf: "unlocked of",
      viewHistory: "View History",
      historyEmpty: "Your payouts will appear here",
      pendingTitle: "{{amount}} pending",
      pendingNote:
        "Unlocks {{holdDays}} days after each payment - the refund window. Refunded payments cancel their earnings.",
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
          "We have received your payout request. Crypto payouts are processed within {{cryptoPayoutHours}} hours after admin approval.",
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
      minimumAmount: "Minimum payout amount is {{minPayout}}",
      walletRequired: "Wallet address is required for crypto payouts",
      insufficientBalance: "Insufficient balance for payout",
      conversionFailed:
        "Conversion failed. Your earnings are untouched - try again in a minute.",
      notFound: "Payout request not found",
      invalidStatus: "Invalid payout request status for this operation",
    },
    success: {
      creditsConverted: "Credits converted successfully",
      payoutRequested:
        "Payout request submitted - processing within {{hours}} hours",
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
      detail: "Something broke on our end: {{error}}",
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
