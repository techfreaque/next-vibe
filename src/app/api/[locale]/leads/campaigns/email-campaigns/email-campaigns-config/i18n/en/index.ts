export const translations = {
  category: "Campaign Management",
  tags: {
    leads: "Leads",
    campaigns: "Campaigns",
  },

  get: {
    title: "Get Email Campaigns Config",
    description: "Retrieve email campaigns cron task configuration",
    form: {
      title: "Email Campaigns Config",
      description: "Email campaigns configuration data",
    },
    response: {
      title: "Configuration Response",
      description: "Email campaigns configuration data",
      enabled: "Enabled",
      dryRun: "Dry Run Mode",
      batchSize: "Batch Size",
      maxEmailsPerRun: "Max Emails Per Run",
      schedule: "Schedule",
      priority: "Priority",
      timeout: "Timeout",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Config Retrieved Successfully",
      description: "Email campaigns configuration retrieved successfully",
    },
  },

  post: {
    title: "Email Campaigns Config",
    description: "Configure email campaigns cron task",
    form: {
      title: "Email Campaigns Configuration",
      description: "Configure email campaigns cron task parameters",
    },
    enabled: {
      label: "Enabled",
      description: "Enable or disable the email campaigns cron task",
    },
    dryRun: {
      label: "Dry Run Mode",
      description: "Process emails without actually sending them",
    },
    batchSize: {
      label: "Batch Size",
      description: "Number of leads to process per batch (1–100)",
    },
    maxEmailsPerRun: {
      label: "Max Emails Per Run",
      description: "Maximum number of emails to send per cron run (1–1000)",
    },
    schedule: {
      label: "Schedule",
      description: "Cron expression for when to run email campaigns",
    },
    priority: {
      label: "Priority",
      description: "Priority level for task execution",
    },
    timeout: {
      label: "Timeout (ms)",
      description: "Maximum execution time in milliseconds",
    },
    retries: {
      label: "Retries",
      description: "Number of retry attempts on failure",
    },
    retryDelay: {
      label: "Retry Delay (ms)",
      description: "Delay between retry attempts in milliseconds",
    },
    response: {
      title: "Response",
      description: "Email Campaigns Config response data",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Email campaigns configuration saved successfully",
    },
  },

  widget: {
    title: "Email Campaigns Configuration",
    titleSaved: "Configuration Saved",
    saving: "Saving...",
    save: "Save Settings",
    guidanceTitle: "Configure Email Campaigns Cron",
    guidanceDescription:
      "Enable or disable the email campaigns cron task and configure its schedule, batch size, and execution settings. When disabled, the cron task is removed from the scheduler.",
    sections: {
      general: "General",
      generalDescription:
        "Master controls for enabling the email campaigns task and dry run mode.",
      schedule: "Schedule",
      scheduleDescription: "Set the cron schedule for when emails are sent.",
      processing: "Processing",
      processingDescription:
        "Configure how many leads and emails to process per run.",
      advanced: "Advanced",
      advancedDescription:
        "Task execution settings like priority, timeouts, and retry behavior.",
    },
  },
};
