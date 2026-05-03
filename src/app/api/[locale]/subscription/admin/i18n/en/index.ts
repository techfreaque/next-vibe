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
      title: "Subscription Statistics",
      description: "Revenue, subscription, credit and referral metrics",
      form: {
        title: "Statistics Dashboard",
        description: "Aggregate business metrics",
      },
      timePeriodOptions: {
        title: "Time Period",
        description: "Configure time range",
      },
      timePeriod: {
        label: "Period",
        description: "Grouping interval",
      },
      dateRangePreset: {
        label: "Date Range",
        description: "Predefined date range",
      },
      response: {
        revenueStats: {
          title: "Revenue",
          description: "Revenue metrics",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "Total Revenue" },
          avgOrderValue: { label: "Avg Order" },
        },
        subscriptionStats: {
          title: "Subscriptions",
          description: "Subscription counts",
          activeCount: { label: "Active" },
          trialingCount: { label: "Trialing" },
          canceledCount: { label: "Canceled" },
          churnRate: { label: "Churn Rate" },
        },
        intervalStats: {
          title: "Billing Intervals",
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
          packsSold: { label: "Packs Sold" },
          avgPackSize: { label: "Avg Pack Size" },
        },
        referralStats: {
          title: "Referrals",
          description: "Referral program metrics",
          totalReferrals: { label: "Total Referrals" },
          conversionRate: { label: "Conversion" },
          totalEarned: { label: "Total Earned" },
          pendingPayouts: { label: "Pending Payouts" },
        },
        growthMetrics: {
          title: "Growth",
          description: "Revenue and subscription trends",
          revenueChart: {
            label: "Revenue Over Time",
            description: "Revenue trend",
          },
          subscriptionChart: {
            label: "Subscription Growth",
            description: "Active subscription trend",
          },
        },
        businessInsights: {
          title: "Insights",
          description: "Generated metrics",
          generatedAt: { label: "Generated At" },
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required to view statistics",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server Error",
          description: "Unable to generate statistics",
        },
        unknown: {
          title: "Unknown Error",
          description: "Unexpected error occurred",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not Found",
          description: "Statistics unavailable",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: { title: "Success", description: "Statistics generated" },
    },
    widget: {
      refresh: "Refresh",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "Subscriptions List",
      description: "Browse all subscriptions",
      form: {
        title: "Subscription Management",
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
        label: "Billing Interval",
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
        label: "Sort By",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort Order",
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
          currentPeriodEnd: "Period End",
          cancelAtPeriodEnd: "Cancel at End",
          canceledAt: "Canceled At",
          cancellationReason: "Cancel Reason",
          provider: "Provider",
          providerSubscriptionId: "Provider ID",
        },
        totalCount: "Total Subscriptions",
        pageCount: "Total Pages",
      },
      page: { label: "Page" },
      limit: { label: "Per Page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server Error",
          description: "Unable to retrieve subscriptions",
        },
        unknown: {
          title: "Unknown Error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not Found",
          description: "No subscriptions found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "Credit Purchases",
      description: "Credit pack purchase history",
      form: {
        title: "Purchase History",
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
        label: "Pack Type",
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
        label: "Sort By",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort Order",
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
        totalCount: "Total Purchases",
        pageCount: "Total Pages",
      },
      page: { label: "Page" },
      limit: { label: "Per Page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server Error",
          description: "Unable to retrieve purchases",
        },
        unknown: {
          title: "Unknown Error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not Found",
          description: "No purchases found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
      title: "Referral Dashboard",
      description: "Referral codes, earnings and payouts",
      form: {
        title: "Referral Management",
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
        label: "Payout Status",
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
        label: "Sort By",
        description: "Sort field",
        placeholder: "Select sort field...",
      },
      sortOrder: {
        label: "Sort Order",
        description: "Sort direction",
        placeholder: "Select order...",
      },
      response: {
        title: "Referrals",
        description: "Referral program data",
        summary: {
          title: "Summary",
          description: "Aggregate referral stats",
          totalCodes: { label: "Total Codes" },
          totalSignups: { label: "Total Signups" },
          totalEarned: { label: "Total Earned" },
          totalPaidOut: { label: "Total Paid Out" },
          pendingPayouts: { label: "Pending Payouts" },
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
          rejectionReason: "Rejection Reason",
          createdAt: "Requested",
          processedAt: "Processed",
        },
        totalCount: "Total",
        pageCount: "Total Pages",
      },
      page: { label: "Page" },
      limit: { label: "Per Page" },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "Login required",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server Error",
          description: "Unable to retrieve referrals",
        },
        unknown: {
          title: "Unknown Error",
          description: "Unexpected error",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        network: {
          title: "Network Error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not Found",
          description: "No referral data found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "Unsaved changes",
        },
      },
      success: { title: "Success", description: "Referrals retrieved" },
    },
    post: {
      title: "Payout Action",
      description: "Approve, reject, or complete a payout request",
      form: {
        title: "Payout Action",
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
        label: "Admin Notes",
        description: "Optional notes",
        placeholder: "Add notes...",
      },
      rejectionReason: {
        label: "Rejection Reason",
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
          title: "Validation Error",
          description: "Invalid parameters",
        },
        forbidden: {
          title: "Forbidden",
          description: "Admin access required",
        },
        server: {
          title: "Server Error",
          description: "Unable to process payout",
        },
        unknown: {
          title: "Unknown Error",
          description: "Unexpected error",
        },
        conflict: {
          title: "Conflict",
          description: "Payout already processed",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect",
        },
        notFound: {
          title: "Not Found",
          description: "Payout request not found",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
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
      sectionCodes: "Referral Codes",
      sectionPayouts: "Payout Requests",
      refresh: "Refresh",
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      all: "All",
      active: "Active",
      trialing: "Trialing",
      pastDue: "Past Due",
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
      createdAt: "Created At",
      status: "Status",
      interval: "Interval",
      userEmail: "User Email",
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
      stripePurchase: "Stripe Purchase",
      stripeSubscription: "Subscription Grant",
      adminGrant: "Admin Grant",
      referralEarning: "Referral Earning",
    },
    purchaseSortField: {
      createdAt: "Created At",
      amount: "Amount",
      type: "Type",
      userEmail: "User Email",
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
      createdAt: "Created At",
      earnings: "Total Earnings",
      signups: "Signups",
    },
    payoutAction: {
      approve: "Approve",
      reject: "Reject",
      complete: "Complete",
    },
  },
};
