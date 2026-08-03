export const translations = {
  get: {
    title: "Subscription Statistics",
    titleShort: "Admin Stats",
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
        detail: "Could not build the statistics: {{error}}",
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
    filters: "Filters",
  },
  stats: {
    timePeriod: {
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    },
    dateRange: {
      today: "Today",
      yesterday: "Yesterday",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      thisWeek: "This Week",
      lastWeek: "Last Week",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      thisQuarter: "This Quarter",
      lastQuarter: "Last Quarter",
      thisYear: "This Year",
      lastYear: "Last Year",
      custom: "Custom",
    },
  },
};
