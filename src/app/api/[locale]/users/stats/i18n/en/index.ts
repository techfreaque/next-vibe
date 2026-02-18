export const translations = {
  title: "User Statistics",
  description: "Comprehensive user analytics and statistics",
  category: "Users",
  tag: "Statistics",
  container: {
    title: "User Statistics Dashboard",
    description: "View comprehensive user analytics and statistics",
  },
  actions: {
    refresh: "Refresh",
    refreshing: "Refreshing...",
  },
  basicFilters: {
    title: "Basic Filters",
    description: "Filter users by status and role",
  },
  subscriptionFilters: {
    title: "Subscription Filters",
    description: "Filter by subscription and payment",
  },
  locationFilters: {
    title: "Location Filters",
    description: "Filter by country and language",
  },
  timePeriodOptions: {
    title: "Time Period Options",
    description: "Configure time period and chart settings",
  },
  sections: {
    filterOptions: {
      title: "Filter Options",
      description: "Configure filters for user statistics",
    },
  },
  fields: {
    status: {
      label: "Status Filter",
      description: "Filter statistics by user status",
    },
    role: {
      label: "Role Filter",
      description: "Filter statistics by user role",
    },
    country: {
      label: "Country Filter",
      description: "Filter statistics by country",
      placeholder: "Select country...",
    },
    language: {
      label: "Language Filter",
      description: "Filter statistics by language",
      placeholder: "Select language...",
    },
    search: {
      label: "Search",
      description: "Search users for statistics",
      placeholder: "Enter search term...",
    },
    chartType: {
      label: "Chart Type",
      description: "Select the type of chart to display",
    },
    dateRangePreset: {
      label: "Date Range Preset",
      description: "Select a predefined date range",
    },
    includeComparison: {
      label: "Include Comparison",
      description: "Include comparison with previous period",
    },
    timePeriod: {
      label: "Time Period",
      description: "Select the time period for statistics",
    },
    subscriptionStatus: {
      label: "Subscription Status",
      description: "Filter by subscription status",
    },
    paymentMethod: {
      label: "Payment Method",
      description: "Filter by payment method",
    },
  },
  response: {
    overviewStats: {
      title: "Overview Statistics",
      description: "General user statistics overview",
      totalUsers: {
        label: "Total Users",
      },
      activeUsers: {
        label: "Active Users",
      },
      inactiveUsers: {
        label: "Inactive Users",
      },
      newUsers: {
        label: "New Users",
      },
    },
    emailStats: {
      title: "Email Statistics",
      description: "User email verification statistics",
      emailVerifiedUsers: {
        label: "Verified Emails",
      },
      emailUnverifiedUsers: {
        label: "Unverified Emails",
      },
      verificationRate: {
        label: "Verification Rate",
      },
    },
    profileStats: {
      title: "Profile Statistics",
      description: "User profile completion statistics",
      complete: {
        title: "Profile Completion",
        description: "Detailed profile completion metrics",
        usersWithPhone: {
          content: "Users with Phone",
        },
        usersWithBio: {
          content: "Users with Biography",
        },
        usersWithWebsite: {
          content: "Users with Website",
        },
        usersWithJobTitle: {
          content: "Users with Job Title",
        },
        usersWithImage: {
          content: "Users with Profile Image",
        },
        completionRate: {
          content: "Profile Completion Rate",
        },
      },
    },
    subscriptionStats: {
      title: "Subscription Statistics",
      description: "User subscription distribution statistics",
      activeSubscriptions: {
        label: "Active",
      },
      canceledSubscriptions: {
        label: "Canceled",
      },
      expiredSubscriptions: {
        label: "Expired",
      },
      noSubscription: {
        label: "No Subscription",
      },
      subscriptionChart: {
        label: "Subscription Distribution",
        description: "Visual breakdown of subscription statuses",
      },
    },
    paymentStats: {
      title: "Payment Statistics",
      description: "Revenue and transaction statistics",
      totalRevenue: {
        label: "Total Revenue",
      },
      transactionCount: {
        label: "Transactions",
      },
      averageOrderValue: {
        label: "Avg. Order Value",
      },
      refundRate: {
        label: "Refund Rate",
      },
    },
    roleStats: {
      title: "Role Statistics",
      description: "User role distribution statistics",
      publicUsers: {
        label: "Public",
      },
      customerUsers: {
        label: "Customers",
      },
      partnerAdminUsers: {
        label: "Partner Admins",
      },
      partnerEmployeeUsers: {
        label: "Partner Staff",
      },
      adminUsers: {
        label: "Admins",
      },
      roleChart: {
        label: "Role Distribution",
        description: "Visual breakdown of users by role",
      },
    },
    timeStats: {
      title: "Time-based Statistics",
      description: "User creation and growth statistics over time",
      usersCreatedToday: {
        label: "Today",
      },
      usersCreatedThisWeek: {
        label: "This Week",
      },
      usersCreatedThisMonth: {
        label: "This Month",
      },
      usersCreatedLastMonth: {
        label: "Last Month",
      },
      growthRate: {
        label: "Growth Rate",
      },
    },
    companyStats: {
      title: "Company Statistics",
      description: "Company-related user statistics",
      uniqueCompanies: {
        content: "Unique Companies",
      },
    },
    // Keep the flat structure for backward compatibility
    totalUsers: {
      content: "Total Users",
    },
    activeUsers: {
      content: "Active Users",
    },
    inactiveUsers: {
      content: "Inactive Users",
    },
    newUsers: {
      content: "New Users",
    },
    emailVerifiedUsers: {
      content: "Email Verified Users",
    },
    emailUnverifiedUsers: {
      content: "Email Unverified Users",
    },
    verificationRate: {
      content: "Email Verification Rate",
    },
    usersWithPhone: {
      content: "Users with Phone",
    },
    usersWithBio: {
      content: "Users with Biography",
    },
    usersWithWebsite: {
      content: "Users with Website",
    },
    usersWithJobTitle: {
      content: "Users with Job Title",
    },
    usersWithImage: {
      content: "Users with Profile Image",
    },
    usersWithStripeId: {
      content: "Users with Stripe ID",
    },
    usersWithoutStripeId: {
      content: "Users without Stripe ID",
    },
    stripeIntegrationRate: {
      content: "Stripe Integration Rate",
    },
    usersWithLeadId: {
      content: "Users with Lead ID",
    },
    usersWithoutLeadId: {
      content: "Users without Lead ID",
    },
    leadAssociationRate: {
      content: "Lead Association Rate",
    },
    publicUsers: {
      content: "Public Users",
    },
    customerUsers: {
      content: "Customer Users",
    },
    partnerAdminUsers: {
      content: "Partner Admin Users",
    },
    partnerEmployeeUsers: {
      content: "Partner Employee Users",
    },
    adminUsers: {
      content: "Admin Users",
    },
    uniqueCompanies: {
      content: "Unique Companies",
    },
    usersCreatedToday: {
      content: "Users Created Today",
    },
    usersCreatedThisWeek: {
      content: "Users Created This Week",
    },
    usersCreatedThisMonth: {
      content: "Users Created This Month",
    },
    usersCreatedLastMonth: {
      content: "Users Created Last Month",
    },
    growthRate: {
      content: "Growth Rate",
    },
    leadToUserConversionRate: {
      content: "Lead to User Conversion Rate",
    },
    retentionRate: {
      content: "User Retention Rate",
    },
    generatedAt: {
      content: "Statistics Generated At",
    },
    growthMetrics: {
      title: "Growth Metrics",
      description: "User growth and conversion metrics",
      growthChart: {
        label: "User Growth Over Time",
        description: "Visual representation of user creation trends",
      },
    },
    performanceRates: {
      title: "Performance Rates",
      description: "User performance and conversion metrics",
      growthRate: {
        label: "Growth Rate",
      },
      leadToUserConversionRate: {
        label: "Lead Conversion",
      },
      retentionRate: {
        label: "Retention Rate",
      },
    },
    businessInsights: {
      title: "Business Insights",
      description: "Business intelligence and analytics",
      uniqueCompanies: {
        label: "Unique Companies",
      },
      generatedAt: {
        label: "Generated At",
      },
    },
  },
  errors: {
    validation: {
      title: "Validation Failed",
      description: "Invalid statistics parameters provided",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You must be logged in to view statistics",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You don't have permission to view statistics",
    },
    notFound: {
      title: "Statistics Not Found",
      description: "The requested statistics could not be found",
    },
    conflict: {
      title: "Conflict Error",
      description: "Unable to generate statistics due to existing conflicts",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    server: {
      title: "Server Error",
      description: "Unable to generate statistics due to server error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred while generating statistics",
    },
  },
  enums: {
    subscriptionStatusFilter: {
      all: "All",
      active: "Active",
      trialing: "Trialing",
      pastDue: "Past Due",
      canceled: "Canceled",
      unpaid: "Unpaid",
      paused: "Paused",
      noSubscription: "No Subscription",
    },
    paymentMethodFilter: {
      all: "All",
      card: "Card",
      bankTransfer: "Bank Transfer",
      paypal: "PayPal",
      applePay: "Apple Pay",
      googlePay: "Google Pay",
      sepaDebit: "SEPA Debit",
      crypto: "Cryptocurrency",
      noPaymentMethod: "No Payment Method",
    },
  },
  success: {
    title: "Statistics Generated Successfully",
    description: "User statistics have been generated successfully",
  },
  widget: {
    headerTitle: "Users Statistics",
    refresh: "Refresh",
    labelTotalUsers: "Total Users",
    labelActiveUsers: "Active Users",
    labelNewToday: "New Today",
    labelNewThisWeek: "New This Week",
    labelNewThisMonth: "New This Month",
    labelTotalRevenue: "Total Revenue",
    labelAvgRevenuePerUser: "Avg Revenue / User",
    labelEmailVerified: "Email Verified",
    labelVerificationRate: "Verification Rate",
    labelEmailUnverified: "Email Unverified",
    labelGrowthRate: "Growth Rate",
    labelLeadUserCvr: "Lead \u2192 User CVR",
    labelRetentionRate: "Retention Rate",
    chartByRole: "By Role",
    chartBySubscriptionStatus: "By Subscription Status",
    chartGrowthOverTime: "Growth Over Time",
    recentSignupsSummary: "Recent Signups Summary",
    rowToday: "Today",
    rowThisWeek: "This Week",
    rowThisMonth: "This Month",
    rowLastMonth: "Last Month",
    generatedAt: "Generated at:",
  },
};
