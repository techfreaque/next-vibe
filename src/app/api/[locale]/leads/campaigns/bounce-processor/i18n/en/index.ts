export const translations = {
  category: "Campaign Management",
  tag: "Bounce Processor",
  task: {
    description:
      "Scan IMAP inbox for bounce notifications and update lead status to BOUNCED",
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
    title: "Bounce Processor",
    description: "Process email bounce notifications from IMAP",
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
        description: "An error occurred while processing bounces",
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
      batchSize: {
        label: "Batch Size",
        description: "Maximum number of bounce emails to process per run",
      },
    },
    response: {
      bouncesFound: "Bounces Found",
      leadsUpdated: "Leads Updated",
      campaignsCancelled: "Campaigns Cancelled",
    },
    success: {
      title: "Bounce Processing Completed",
      description: "Bounce notifications processed successfully",
    },
  },
  get: {
    title: "Get Bounce Processor Config",
    description: "Retrieve bounce processor cron task configuration",
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
      schedule: "Schedule",
      priority: "Priority",
      timeout: "Timeout",
      retries: "Retries",
      retryDelay: "Retry Delay",
    },
    success: {
      title: "Config Retrieved Successfully",
      description: "Bounce processor configuration retrieved successfully",
    },
  },
  put: {
    title: "Bounce Processor Config",
    description: "Update bounce processor cron task configuration",
    enabled: {
      label: "Enabled",
      description: "Enable or disable the bounce processor cron task",
    },
    dryRun: {
      label: "Dry Run Mode",
      description: "Scan for bounces without updating lead status",
    },
    batchSize: {
      label: "Batch Size",
      description: "Maximum number of bounce emails to process per run (1–500)",
    },
    schedule: {
      label: "Schedule",
      description: "Cron expression for when to run the bounce processor",
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
      description: "Bounce processor configuration saved successfully",
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
    title: "Bounce Processor Configuration",
    titleSaved: "Configuration Saved",
    saving: "Saving...",
    save: "Save Settings",
    guidanceTitle: "Configure Bounce Processor Cron",
    guidanceDescription:
      "Enable or disable the bounce processor cron task and configure its schedule and batch settings.",
    runButton: "Run Now",
    running: "Running...",
    done: "Done",
    sections: {
      general: "General",
      generalDescription:
        "Master controls for enabling the bounce processor task and dry run mode.",
      schedule: "Schedule",
      scheduleDescription:
        "Set the cron schedule for when bounces are processed.",
      processing: "Processing",
      processingDescription:
        "Configure how many bounce emails to process per run.",
      advanced: "Advanced",
      advancedDescription:
        "Task execution settings like priority, timeouts, and retry behavior.",
    },
  },
};
