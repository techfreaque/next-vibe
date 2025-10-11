/**
 * Enhanced Template Stats API translations for English
 */

export const translations = {
  // Common category and tags (shared from main template API)
  category: "Template API",
  tags: {
    analytics: "Analytics",
    statistics: "Statistics",
        label: "Tags",
    description: "Filter by template tags",
    placeholder: "Select tags",
  },

  // Main enhanced-stats endpoint
  title: "Get Enhanced Template Statistics",
  description: "Retrieve comprehensive template statistics with advanced filtering",
  form: {
    title: "Statistics Request",
    description: "Configure parameters for template statistics",
  },

  // Time period options
  timePeriod: {
    label: "Time Period",
    description: "Select time period for statistics",
    placeholder: "Choose time periods",
    // Enum translations for TimePeriod values
    day: "Day",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    year: "Year",
  },

  // Date range preset options
  dateRangePreset: {
    label: "Date Range Preset",
    description: "Select predefined date range",
    placeholder: "Choose date range",
    // Enum translations for DateRangePreset values
    last_7_days: "Last 7 Days",
    last_30_days: "Last 30 Days",
    last_90_days: "Last 90 Days",
    last_12_months: "Last 12 Months",
    this_month: "This Month",
    last_month: "Last Month",
    this_quarter: "This Quarter",
    last_quarter: "Last Quarter",
    this_year: "This Year",
    last_year: "Last Year",
  },

  // Chart type options
  chartType: {
    label: "Chart Type",
    description: "Select visualization type",
    placeholder: "Choose chart types",
    line: "Line Chart",
    bar: "Bar Chart",
    pie: "Pie Chart",
  },

  // Date filters
  dateFrom: {
    label: "From Date",
    description: "Start date for statistics",
    placeholder: "Select start date",
  },
  dateTo: {
    label: "To Date",
    description: "End date for statistics",
    placeholder: "Select end date",
  },

  // Status filter
  status: {
    label: "Template Status",
    description: "Filter by template status",
    placeholder: "Select statuses",
  },

  // User filter
  userId: {
    label: "User ID",
    description: "Filter by specific user",
    placeholder: "Enter user ID",
  },


  // Content filters
  hasDescription: {
    label: "Has Description",
    description: "Filter templates with descriptions",
  },
  hasContent: {
    label: "Has Content",
    description: "Filter templates with content",
  },
  contentLengthMin: {
    label: "Minimum Content Length",
    description: "Minimum number of characters",
    placeholder: "Enter minimum length",
  },
  contentLengthMax: {
    label: "Maximum Content Length",
    description: "Maximum number of characters",
    placeholder: "Enter maximum length",
  },

  // Date range filters
  createdAfter: {
    label: "Created After",
    description: "Templates created after this date",
    placeholder: "Select date",
  },
  createdBefore: {
    label: "Created Before",
    description: "Templates created before this date",
    placeholder: "Select date",
  },
  updatedAfter: {
    label: "Updated After",
    description: "Templates updated after this date",
    placeholder: "Select date",
  },
  updatedBefore: {
    label: "Updated Before",
    description: "Templates updated before this date",
    placeholder: "Select date",
  },

  // Search and display
  search: {
    label: "Search",
    description: "Search in template names and descriptions",
    placeholder: "Enter search term",
  },
  includeComparison: {
    label: "Include Comparison",
    description: "Compare with previous period",
  },
  comparisonPeriod: {
    label: "Comparison Period",
    description: "Period to compare against",
    placeholder: "Select comparison period",
  },

  // Response
  response: {
    title: "Template Statistics",
    description: "Comprehensive template usage statistics",
  },

  // Errors
  errors: {
    validation: {
      title: "Invalid Parameters",
      description: "The provided parameters are not valid",
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You don't have permission to view statistics",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You are not allowed to access these statistics",
    },
    server: {
      title: "Server Error",
      description: "Failed to generate statistics",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the server",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    conflict: {
      title: "Conflict Error",
      description: "The operation conflicts with the current state",
    },
  },

  // Success
  success: {
    title: "Statistics Generated",
    description: "Template statistics generated successfully",
  },
};