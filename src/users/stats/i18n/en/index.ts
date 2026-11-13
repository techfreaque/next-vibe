export const translations = {
  title: "Business Stats",
  titleShort: "User Stats",
  description:
    "Signups, active and paying users, MRR, revenue, credit spend, signup-to-paid conversion and D7 retention. Every number against the previous window, plus trend chart, channels and top spenders.",
  category: "Users",
  tag: "Statistics",
  fields: {
    range: {
      label: "Window",
      description:
        "Reporting window, compared to the window of equal length before it",
    },
    from: {
      label: "From",
      description: "First day (UTC). Overrides the window start",
    },
    to: {
      label: "To",
      description: "Last day (UTC). Overrides the window end",
    },
    granularity: {
      label: "Chart buckets",
      description: "Day, week or month. Auto picks by window length",
    },
    includeInternal: {
      label: "Include admins",
      description: "Count internal admin accounts and their payments",
    },
  },
  response: {
    period: "Period",
    kpis: "KPIs",
    series: "Time series",
    channels: "Signup channels",
    revenueByCurrency: "Revenue by currency",
    subscriptionsByStatus: "Subscriptions by status",
    topSpenders: "Top spenders",
    generatedAt: "Generated at",
  },
  enums: {
    range: {
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
      last12Months: "Last 12 months",
      thisMonth: "This month",
      lastMonth: "Last month",
      allTime: "All time",
      custom: "Custom dates",
    },
    granularity: {
      auto: "Auto",
      day: "Day",
      week: "Week",
      month: "Month",
    },
  },
  kpi: {
    revenue: "Revenue",
    revenueHint: "Succeeded payments, USD",
    refundsHint: "{{amount}} refunded",
    mrr: "MRR",
    mrrHint: "{{active}} active subs, {{pastDue}} past due",
    payingUsers: "Paying users",
    payingAllTimeHint: "{{count}} paid ever",
    creditsSpent: "Credits spent",
    creditsHint: "about {{usd}} of usage",
    newUsers: "Signups",
    totalUsersHint: "{{count}} users total",
    activeUsers: "Active users",
    anonymousHint: "+{{count}} anonymous visitors spending",
    signupToPaid: "Signup to paid",
    ratioHint: "{{converted}} of {{cohort}} new signups paid",
    retentionD7: "D7 retention",
    retentionHint: "{{converted}} of {{cohort}} came back after day 7",
    activeSubscribers: "Active subscribers",
    pastDue: "Past due",
    totalUsers: "Total users",
    payingAllTime: "Paid ever",
    revenueAllTime: "Revenue all time",
    refunds: "Refunds",
    anonymousActive: "Anonymous spenders",
  },
  series: {
    signups: "Signups",
    activeUsers: "Active",
    payingUsers: "Paying",
    revenueUsd: "Revenue",
    creditsSpent: "Credits",
  },
  sections: {
    trend: "Trend",
    channels: "Signup channels",
    subscriptions: "Subscriptions now",
    currencies: "Revenue by currency",
    topSpenders: "Top spenders in window",
  },
  table: {
    channel: "Channel",
    signups: "Signups",
    paying: "Paid",
    conversion: "Conv.",
    user: "User",
    creditsSpent: "Credits spent",
    lifetimePaid: "Lifetime paid",
  },
  widget: {
    times: "{{count}}x",
    loading: "Crunching numbers...",
    users: "Users",
    refresh: "Refresh",
    new: "new",
    noData: "No data in this window.",
    chartTotal: "Total {{total}}",
    period:
      "{{from}} to {{to}} ({{days}} days, UTC). Changes compare to the {{days}} days before.",
    definitions:
      "Active = spent credits (own or linked lead wallet). Paying = succeeded payment in window. Revenue in USD at static FX. MRR = live subscriptions priced by their last payment. Admin accounts excluded unless included above.",
    text: {
      header: "{{from}} to {{to}} ({{days}} days, UTC)",
      metric: "Metric",
      current: "Now",
      previous: "Before",
      change: "Change",
      bucket: "Bucket",
      paying: "{{count}} paid",
      footer:
        "Windows: --range=enums.range.last7Days|last90Days|last12Months|allTime. Users: vibe users-list",
    },
  },
  errors: {
    validation: {
      title: "Invalid stats request",
      description: "Check the window and dates",
    },
    unauthorized: {
      title: "Sign in required",
      description: "Sign in to view stats",
    },
    forbidden: {
      title: "Admins only",
      description: "You need the admin role to view stats",
    },
    notFound: {
      title: "No data",
      description: "Nothing to report for this window",
    },
    server: {
      title: "Could not compute stats",
      description: "The server failed to compute user statistics",
    },
    network: {
      title: "Network error",
      description: "Could not reach the server",
    },
    unknown: {
      title: "Unexpected error",
      description: "Something went wrong computing stats",
    },
    unsavedChanges: {
      title: "Unsaved changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "The request conflicts with current data",
    },
  },
  success: {
    title: "Stats ready",
    description: "User statistics computed",
  },
};
