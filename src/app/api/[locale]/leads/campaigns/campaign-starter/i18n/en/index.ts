export const translations = {
  category: "Campaign Management",
  tag: "Campaign Starter",
  task: {
    description:
      "Start campaigns for new leads by transitioning them to PENDING status",
  },
  errors: {
    server: {
      title: "Server Error",
      description:
        "An error occurred while processing the campaign starter request",
    },
    invalidTransition: "Invalid status transition for campaign start",
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network error occurred",
    },
    notFound: {
      title: "Not Found",
      description: "Resource not found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },
  post: {
    title: "Campaign Starter",
    description: "Start campaigns for new leads",
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while starting campaigns",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      notFound: { title: "Not Found", description: "Resource not found" },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    fields: {
      dryRun: {
        label: "Dry Run",
        description: "Run without making changes",
      },
      force: {
        label: "Force",
        description: "Bypass day/hour schedule restrictions",
      },
    },
    response: {
      leadsProcessed: "Leads Processed",
      leadsStarted: "Leads Started",
      leadsSkipped: "Leads Skipped",
      executionTimeMs: "Execution Time (ms)",
      errors: "Errors",
      quotaDetails: "Quota Details",
    },
    success: {
      title: "Campaign Starter Completed",
      description: "Campaign starter ran successfully",
    },
  },
  get: {
    title: "Get Campaign Starter Config",
    description: "Retrieve campaign starter configuration",
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
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
      notFound: { title: "Not Found", description: "Resource not found" },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    response: {
      dryRun: "Dry Run Mode",
      minAgeHours: "Minimum Age Hours",
      enabledDays: "Enabled Days",
      enabledHours: "Enabled Hours",
      localeConfig: "Locale Configuration",
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
  put: {
    title: "Campaign Starter Config",
    description: "Update campaign starter configuration",
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
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
    enabledHours: {
      label: "Enabled Hours",
      description: "Hours of the day when campaigns are enabled",
      start: {
        label: "Start Hour",
        description: "Hour of the day when campaigns start (0-23)",
      },
      end: {
        label: "End Hour",
        description: "Hour of the day when campaigns end (0-23)",
      },
    },
    localeConfig: {
      label: "Locale Configuration",
      description:
        "Per-locale settings: leads per week, active days, and active hours",
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
      description: "Timeout value in milliseconds",
    },
    retries: {
      label: "Retries",
      description: "Number of retry attempts",
    },
    retryDelay: {
      label: "Retry Delay",
      description: "Delay between retry attempts in milliseconds",
    },
    success: {
      title: "Config Saved",
      description: "Campaign starter configuration saved successfully",
    },
  },
  priority: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    background: "Background",
    filter: {
      all: "All Priorities",
      highAndAbove: "High and Above",
      mediumAndAbove: "Medium and Above",
    },
  },
  widget: {
    title: "Campaign Starter",
    titleSaved: "Configuration Saved",
    description:
      "Start campaigns for new leads that are ready to be contacted.",
    saving: "Saving...",
    save: "Save Settings",
    addLocale: "+ Add locale",
    guidanceTitle: "Configure the Campaign Starter",
    guidanceDescription:
      "Set the schedule, active days/hours, leads-per-week targets, and cron task settings.",
    runButton: "Start Campaigns",
    running: "Running...",
    done: "Done",
    sections: {
      general: "General",
      generalDescription:
        "Master controls for enabling the campaign starter and dry run mode.",
      schedule: "Schedule",
      scheduleDescription:
        "When should campaigns run? Set the cron schedule, active days, and hours.",
      hoursTimezoneNote:
        "Hours in your browser timezone ({{offset}}). Stored as UTC on the server.",
      quotas: "Quotas",
      quotasDescription:
        "How many leads to process per week, broken down by locale.",
      advanced: "Advanced",
      advancedDescription:
        "Task execution settings like priority, timeouts, and retry behavior.",
    },
  },
};
