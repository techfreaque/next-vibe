export const translations = {
  category: "Subscriptions",
  tags: {
    admin: "Admin",
    stats: "Statistics",
    list: "List",
    purchases: "Purchases",
    referrals: "Referrals",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "Subscription statistics",
      description: "Revenue, subscription, credit and referral metrics",
      form: {
        title: "Statistics dashboard",
        description: "Aggregate business metrics",
      },
      timePeriodOptions: {
        title: "Time period",
        description: "Configure time range",
      },
      timePeriod: {
        label: "Period",
        description: "Grouping interval",
      },
      dateRangePreset: {
        label: "Date range",
        description: "Predefined date range",
      },
      response: {
        revenueStats: {
          title: "Revenue",
          description: "Revenue metrics",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Total revenue" },
          avgOrderValue: { label: "Avg order" },
        },
        subscriptionStats: {
          title: "Subscriptions",
          description: "Subscription counts",
          activeCount: { label: "Active" },
          trialingCount: { label: "Trialing" },
          canceledCount: { label: "Canceled" },
          churnRate: { label: "Churn rate" },
        },
        intervalStats: {
          title: "Billing intervals",
          description: "Monthly vs yearly split",
          monthlyCount: { label: "Monthly" },
          yearlyCount: { label: "Yearly" },
          yearlyRevenuePct: { label: "% Yearly Revenue" },
        },
        creditStats: {
          title: "Credits",
          description: "Credit pack metrics",
          totalPurchased: { label: "Purchased" },
          totalSpent: { label: "Spent" },
          packsSold: { label: "Packs sold" },
          avgPackSize: { label: "Avg pack size" },
        },
        referralStats: {
          title: "Referrals",
          description: "Referral program metrics",
          totalReferrals: { label: "Total referrals" },
          conversionRate: { label: "Conversion" },
          totalEarned: { label: "Total earned" },
          pendingPayouts: { label: "Pending payouts" },
        },
        growthMetrics: {
          title: "Growth",
          description: "Revenue and subscription trends",
          revenueChart: {
            label: "Revenue over time",
            description: "Revenue trend",
          },
          subscriptionChart: {
            label: "Subscription growth",
            description: "Active subscription trend",
          },
        },
        businessInsights: {
          title: "Insights",
          description: "Generated metrics",
          generatedAt: { label: "Generated at" },
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required to view statistics",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server error",
          description: "Unable to generate statistics",
        },
        unknown: {
          title: "Unknown error",
          description: "Unexpected error occurred",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not found",
          description: "Statistics unavailable",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Success", description: "Statistics generated" },
    },
    widget: {
      refresh: "Refresh",
      filters: "Filters",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Subscriptions list",
      description: "Browse all subscriptions",
      form: {
        title: "Subscription management",
        description: "Filter and browse subscriptions",
      },
      searchFilters: {
        title: "Search & Filters",
        description: "Filter subscriptions",
      },
      search: {
        label: "Search",
        description: "Search by user email or name",
        placeholder: "Search subscriptions...",
      },
      status: {
        label: "Status",
        description: "Filter by subscription status",
        placeholder: "Select status...",
      },
      interval: {
        label: "Billing interval",
        description: "Filter by billing interval",
        placeholder: "Any interval",
      },
      provider: {
        label: "Provider",
        description: "Filter by payment provider",
        placeholder: "Any provider",
      },
      dateFrom: {
        label: "From",
        description: "Start date filter",
      },
      dateTo: {
        label: "To",
        description: "End date filter",
      },
      sortingOptions: {
        title: "Sorting",
        description: "Configure result sorting",
      },
      sortBy: {
        label: "Sort by",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort order",
        description: "Sort direction",
        placeholder: "Select order...",
      },
      response: {
        title: "Subscriptions",
        description: "Matching subscriptions",
        subscriptions: {
          id: "ID",
          userEmail: "Email",
          userName: "Name",
          planId: "Plan",
          billingInterval: "Interval",
          status: "Status",
          createdAt: "Started",
          currentPeriodEnd: "Period end",
          cancelAtPeriodEnd: "Cancel at end",
          canceledAt: "Canceled at",
          cancellationReason: "Cancel reason",
          provider: "Provider",
          providerSubscriptionId: "Provider ID",
        },
        totalCount: "Total subscriptions",
        pageCount: "Total pages",
      },
      page: { label: "Page" },
      limit: { label: "Per page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server error",
          description: "Unable to retrieve subscriptions",
        },
        unknown: {
          title: "Unknown error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not found",
          description: "No subscriptions found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Unsaved changes",
        },
      },
      success: { title: "Success", description: "Subscriptions retrieved" },
    },
    widget: {
      noSubscriptions: "No subscriptions found.",
      noMatchingSubscriptions: "No subscriptions match your filters.",
      searchPlaceholder: "Search by email or name...",
      refresh: "Refresh",
      viewStats: "Statistics",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Credit purchases",
      description: "Credit pack purchase history",
      form: {
        title: "Purchase history",
        description: "Browse credit pack purchases",
      },
      searchFilters: {
        title: "Search & Filters",
        description: "Filter purchases",
      },
      search: {
        label: "Search",
        description: "Search by user email",
        placeholder: "Search purchases...",
      },
      packType: {
        label: "Pack type",
        description: "Filter by credit pack type",
        placeholder: "Any type",
      },
      source: {
        label: "Source",
        description: "Filter by purchase source",
        placeholder: "Any source",
      },
      dateFrom: {
        label: "From",
        description: "Start date filter",
      },
      dateTo: {
        label: "To",
        description: "End date filter",
      },
      sortingOptions: {
        title: "Sorting",
        description: "Configure result sorting",
      },
      sortBy: {
        label: "Sort by",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort order",
        description: "Sort direction",
        placeholder: "Select order...",
      },
      response: {
        title: "Purchases",
        description: "Credit pack purchase history",
        purchases: {
          id: "ID",
          userEmail: "Email",
          userName: "Name",
          packType: "Type",
          source: "Source",
          originalAmount: "Amount",
          remaining: "Remaining",
          expiresAt: "Expires",
          createdAt: "Purchased",
        },
        totalCount: "Total purchases",
        pageCount: "Total pages",
      },
      page: { label: "Page" },
      limit: { label: "Per page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server error",
          description: "Unable to retrieve purchases",
        },
        unknown: {
          title: "Unknown error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not found",
          description: "No purchases found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Unsaved changes",
        },
      },
      success: { title: "Success", description: "Purchases retrieved" },
    },
    widget: {
      noPurchases: "No credit pack purchases found.",
      noMatchingPurchases: "No purchases match your filters.",
      searchPlaceholder: "Search by email...",
      refresh: "Refresh",
      expired: "Expired",
      neverExpires: "Never",
    },
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "Referral dashboard",
      description: "Referral codes, earnings and payouts",
      form: {
        title: "Referral management",
        description: "Manage referral program",
      },
      searchFilters: {
        title: "Search & Filters",
        description: "Filter referral data",
      },
      search: {
        label: "Search",
        description: "Search by user email",
        placeholder: "Search referrals...",
      },
      payoutStatus: {
        label: "Payout status",
        description: "Filter by payout request status",
        placeholder: "Any status",
      },
      dateFrom: {
        label: "From",
        description: "Start date filter",
      },
      dateTo: {
        label: "To",
        description: "End date filter",
      },
      sortingOptions: {
        title: "Sorting",
        description: "Configure result sorting",
      },
      sortBy: {
        label: "Sort by",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort order",
        description: "Sort direction",
        placeholder: "Select order...",
      },
      response: {
        title: "Referrals",
        description: "Referral program data",
        summary: {
          title: "Summary",
          description: "Aggregate referral stats",
          totalCodes: { label: "Total codes" },
          totalSignups: { label: "Total signups" },
          totalEarned: { label: "Total earned" },
          totalPaidOut: { label: "Total paid out" },
          pendingPayouts: { label: "Pending payouts" },
        },
        codes: {
          code: "Code",
          ownerEmail: "Owner",
          ownerName: "Name",
          currentUses: "Clicks",
          totalSignups: "Signups",
          totalEarned: "Earned",
          isActive: "Active",
          createdAt: "Created",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "User",
          amountCents: "Amount",
          currency: "Currency",
          status: "Status",
          walletAddress: "Wallet",
          adminNotes: "Notes",
          rejectionReason: "Rejection reason",
          createdAt: "Requested",
          processedAt: "Processed",
        },
        totalCount: "Total",
        pageCount: "Total pages",
      },
      page: { label: "Page" },
      limit: { label: "Per page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server error",
          description: "Unable to retrieve referrals",
        },
        unknown: {
          title: "Unknown error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not found",
          description: "No referral data found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Unsaved changes",
        },
      },
      success: { title: "Success", description: "Referrals retrieved" },
    },
    post: {
      title: "Payout action",
      description: "Approve, reject, or complete a payout request",
      form: {
        title: "Payout action",
        description: "Process a payout request",
      },
      requestId: {
        label: "Request ID",
        description: "Payout request to process",
        placeholder: "Enter request ID...",
      },
      action: {
        label: "Action",
        description: "Action to take",
        placeholder: "Select action...",
      },
      adminNotes: {
        label: "Admin notes",
        description: "Optional notes",
        placeholder: "Add notes...",
      },
      rejectionReason: {
        label: "Rejection reason",
        description: "Required when rejecting",
        placeholder: "Enter reason...",
      },
      response: {
        title: "Result",
        description: "Action result",
        success: "Success",
        message: "Message",
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server error",
          description: "Unable to process payout",
        },
        unknown: {
          title: "Unknown error",
          description: "Unexpected error",
        },
        conflict: {
          title: "Conflict",
          description: "Payout already processed",
        },
        network: {
          title: "Network error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not found",
          description: "Payout request not found",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "Unsaved changes",
        },
      },
      success: { title: "Success", description: "Payout processed" },
    },
    widget: {
      noReferrals: "No referral codes found.",
      noPayouts: "No payout requests.",
      approve: "Approve",
      reject: "Reject",
      complete: "Complete",
      sectionCodes: "Referral codes",
      sectionPayouts: "Payout requests",
      refresh: "Refresh",
      codeActive: "Active",
      codeInactive: "Inactive",
      clicks: "clicks",
      signups: "signups",
      earned: "earned",
      confirm: {
        title: "Confirm payout action",
        description:
          "Are you sure you want to proceed with this payout action? This cannot be undone.",
        cancel: "Cancel",
        proceed: "Proceed",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      incomplete: "Incomplete",
      incompleteExpired: "Incomplete expired",
      all: "All",
      active: "Active",
      trialing: "Trialing",
      pastDue: "Past due",
      canceled: "Canceled",
      unpaid: "Unpaid",
      paused: "Paused",
    },
    billingIntervalFilter: {
      any: "Any",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    providerFilter: {
      any: "Any",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "Period end",
      createdAt: "Created at",
      status: "Status",
      interval: "Interval",
      userEmail: "User email",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
    creditPackTypeFilter: {
      any: "Any",
      subscription: "Subscription",
      permanent: "Permanent",
      bonus: "Bonus",
      earned: "Earned",
    },
    creditPackSourceFilter: {
      any: "Any",
      stripePurchase: "Stripe purchase",
      stripeSubscription: "Subscription grant",
      adminGrant: "Admin grant",
      referralEarning: "Referral earning",
    },
    purchaseSortField: {
      createdAt: "Created at",
      amount: "Amount",
      type: "Type",
      userEmail: "User email",
    },
    payoutStatusFilter: {
      all: "All",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
    },
    referralSortField: {
      createdAt: "Created at",
      earnings: "Total earnings",
      signups: "Signups",
    },
    payoutAction: {
      approve: "Approve",
      reject: "Reject",
      complete: "Complete",
    },
  },
};
