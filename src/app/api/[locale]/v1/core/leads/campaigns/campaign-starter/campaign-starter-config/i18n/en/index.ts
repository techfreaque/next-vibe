export const translations = {
  get: {
    title: "Get Campaign Starter Config",
    description: "Retrieve campaign starter configuration",
    form: {
      title: "Campaign Starter Config Request",
      description: "Request campaign starter configuration",
    },
    response: {
      title: "Configuration Response",
      description: "Campaign starter configuration data",
      dryRun: "Dry Run Mode",
      minAgeHours: "Minimum Age Hours",
      enabledDays: "Enabled Days",
      enabledHours: "Enabled Hours",
      leadsPerWeek: "Leads Per Week",
      schedule: "Schedule",
      enabled: "Enabled",
      priority: "Priority",
      timeout: "Timeout",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    success: {
      title: "Config Retrieved Successfully",
      description: "Campaign starter configuration retrieved successfully",
    },
  },
  post: {
    title: "Campaign Starter Config",
    description: "Campaign Starter Config endpoint",
    form: {
      title: "Campaign Starter Config Configuration",
      description: "Configure campaign starter config parameters",
    },
    dryRun: {
      label: "Dry Run Mode",
      description: "Enable dry run mode for testing",
    },
    minAgeHours: {
      label: "Minimum Age Hours",
      description: "Minimum age in hours before processing leads",
    },
    enabledDays: {
      label: "Enabled Days",
      description: "Days of the week when campaigns are enabled",
    },
    enabledHours: {
      label: "Enabled Hours",
      description: "Hours of the day when campaigns are enabled",
    },
    leadsPerWeek: {
      label: "Leads Per Week",
      description: "Maximum number of leads to process per week",
    },
    schedule: {
      label: "Schedule",
      description: "Campaign execution schedule",
    },
    enabled: {
      label: "Enabled",
      description: "Enable or disable the campaign starter",
    },
    priority: {
      label: "Priority",
      description: "Priority level for campaign execution",
    },
    timeout: {
      label: "Timeout",
      description: "Timeout value in seconds",
    },
    retries: {
      label: "Retries",
      description: "Number of retry attempts",
    },
    retryDelay: {
      label: "Retry Delay",
      description: "Delay between retry attempts in seconds",
    },
    response: {
      title: "Response",
      description: "Campaign Starter Config response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
