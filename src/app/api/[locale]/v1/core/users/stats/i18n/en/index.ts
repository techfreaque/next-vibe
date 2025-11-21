export const translations = {
  title: "User Statistics",
  description: "Comprehensive user analytics and statistics",
  category: "Users",
  tag: "Statistics",
  container: {
    title: "User Statistics Dashboard",
    description: "View comprehensive user analytics and statistics",
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
  },
  response: {
    overviewStats: {
      title: "Overview Statistics",
      description: "General user statistics overview",
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
    },
    emailStats: {
      title: "Email Statistics",
      description: "User email verification statistics",
      emailVerifiedUsers: {
        content: "Email Verified Users",
      },
      emailUnverifiedUsers: {
        content: "Email Unverified Users",
      },
      verificationRate: {
        content: "Email Verification Rate",
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
    integrationStats: {
      title: "Integration Statistics",
      description: "External service integration statistics",
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
    },
    roleStats: {
      title: "Role Statistics",
      description: "User role distribution statistics",
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
    },
    timeStats: {
      title: "Time-based Statistics",
      description: "User creation and growth statistics over time",
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
    },
    performanceRates: {
      title: "Performance Rates",
      description: "User performance and conversion metrics",
      growthRate: {
        content: "Growth Rate",
      },
      leadToUserConversionRate: {
        content: "Lead to User Conversion Rate",
      },
      retentionRate: {
        content: "User Retention Rate",
      },
    },
    businessInsights: {
      title: "Business Insights",
      description: "Business intelligence and analytics",
      uniqueCompanies: {
        content: "Unique Companies",
      },
      generatedAt: {
        content: "Statistics Generated At",
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
  success: {
    title: "Statistics Generated Successfully",
    description: "User statistics have been generated successfully",
  },
};
