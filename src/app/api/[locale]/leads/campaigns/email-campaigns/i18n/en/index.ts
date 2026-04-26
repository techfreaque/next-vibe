export const translations = {
  category: "Campaign Management",
  tag: "Email Campaigns",
  task: {
    description:
      "Send automated email campaigns to leads based on their stage and timing",
  },
  errors: {
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
  post: {
    title: "Email Campaigns",
    description: "Process email campaigns for leads",
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
    fields: {
      batchSize: {
        label: "Batch Size",
        description: "Number of leads to process per batch",
      },
      maxEmailsPerRun: {
        label: "Max Emails Per Run",
        description: "Maximum number of emails to send per run",
      },
      dryRun: {
        label: "Dry Run",
        description: "Run without sending emails",
      },
    },
    response: {
      emailsScheduled: "Emails Scheduled",
      emailsSent: "Emails Sent",
      emailsFailed: "Emails Failed",
      leadsProcessed: "Leads Processed",
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  get: {
    title: "Get Email Campaigns Config",
    description: "Retrieve email campaigns background task configuration",
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
    success: {
      title: "Config Retrieved Successfully",
      description: "Email campaigns configuration retrieved successfully",
    },
  },
  put: {
    title: "Email Campaigns Config",
    description: "Update email campaigns background task configuration",
    enabled: {
      label: "Enabled",
      description: "Enable or disable the email campaigns background task",
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
      description:
        "Maximum number of emails to send per background run (1–1000)",
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
    success: {
      title: "Config Saved",
      description: "Email campaigns configuration saved successfully",
    },
  },
  priority: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    background: "Background",
  },
  widget: {
    title: "Email Campaigns Configuration",
    titleSaved: "Configuration Saved",
    saving: "Saving...",
    save: "Save Settings",
    guidanceTitle: "Configure Email Campaigns Background Task",
    guidanceDescription:
      "Enable or disable the email campaigns cron task and configure its schedule, batch size, and execution settings.",
    runButton: "Run Now",
    running: "Running...",
    done: "Done",
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
