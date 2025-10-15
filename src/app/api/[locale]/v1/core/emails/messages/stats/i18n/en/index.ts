export const translations = {
  get: {
    title: "Get Email Statistics",
    description: "Retrieve comprehensive email statistics and metrics",
    form: {
      title: "Email Statistics Request",
      description: "Parameters for querying email statistics",
    },
    startDate: {
      label: "Start Date",
      description: "Start date for the statistics period",
    },
    endDate: {
      label: "End Date",
      description: "End date for the statistics period",
    },
    accountId: {
      label: "Account ID",
      description: "Filter statistics by specific account",
    },
    type: {
      label: "Email Type",
      description: "Filter by email type",
      options: {
        all: "All",
        sent: "Sent",
        received: "Received",
        draft: "Draft",
        trash: "Trash",
      },
    },
    groupBy: {
      label: "Group By",
      description: "How to group the statistics",
      options: {
        day: "By Day",
        week: "By Week",
        month: "By Month",
        account: "By Account",
        type: "By Type",
      },
    },
    includeDetails: {
      label: "Include Details",
      description: "Include detailed breakdown in results",
    },
    status: {
      label: "Email Status",
      description: "Filter by email status",
    },
    search: {
      label: "Search",
      description: "Search emails by subject or recipient",
    },
    timePeriod: {
      label: "Time Period",
      description: "Time period granularity for historical data",
    },
    dateRangePreset: {
      label: "Date Range Preset",
      description: "Predefined date range for filtering",
    },
    dateFrom: {
      label: "Start Date",
      description: "Filter emails from this date",
    },
    dateTo: {
      label: "End Date",
      description: "Filter emails up to this date",
    },
    chartType: {
      label: "Chart Type",
      description: "Visualization type for charts",
    },
    includeComparison: {
      label: "Include Comparison",
      description: "Include comparison with previous period",
    },
    sortBy: {
      label: "Sort By",
      description: "Field to sort emails by",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Order of sorting (ascending or descending)",
    },
    response: {
      title: "Email Statistics Response",
      description: "Comprehensive email statistics and metrics data",
      totalEmails: "Total Emails",
      sentEmails: "Sent Emails",
      deliveredEmails: "Delivered Emails",
      openedEmails: "Opened Emails",
      clickedEmails: "Clicked Emails",
      bouncedEmails: "Bounced Emails",
      failedEmails: "Failed Emails",
      draftEmails: "Draft Emails",
      openRate: "Open Rate",
      clickRate: "Click Rate",
      deliveryRate: "Delivery Rate",
      bounceRate: "Bounce Rate",
      failureRate: "Failure Rate",
      emailsByProvider: "Emails by Provider",
      emailsByTemplate: "Emails by Template",
      emailsByStatus: "Emails by Status",
      emailsByType: "Emails by Type",
      emailsWithUserId: "Emails with User ID",
      emailsWithoutUserId: "Emails without User ID",
      emailsWithLeadId: "Emails with Lead ID",
      emailsWithoutLeadId: "Emails without Lead ID",
      emailsWithErrors: "Emails with Errors",
      emailsWithoutErrors: "Emails without Errors",
      averageRetryCount: "Average Retry Count",
      maxRetryCount: "Maximum Retry Count",
      averageProcessingTime: "Average Processing Time",
      averageDeliveryTime: "Average Delivery Time",
      historicalData: "Historical Data",
      groupedStats: "Grouped Statistics",
      generatedAt: "Generated At",
      dataRange: "Data Range",
      recentActivity: "Recent Activity",
      topPerformingTemplates: "Top Performing Templates",
      topPerformingProviders: "Top Performing Providers",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to access email statistics",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters provided",
      },
      server: {
        title: "Server Error",
        description:
          "Internal server error occurred while retrieving statistics",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while retrieving statistics",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to email statistics is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Email statistics not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred while retrieving statistics",
      },
    },
    success: {
      title: "Success",
      description: "Email statistics retrieved successfully",
    },
  },
};
