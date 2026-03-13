export const translations = {
  category: "Campaign Management",
  tags: {
    leads: "Leads",
    campaigns: "Campaigns",
  },

  get: {
    title: "Get Bounce Processor Config",
    description: "Retrieve bounce processor cron task configuration",
    form: {
      title: "Bounce Processor Config",
      description: "Bounce processor configuration data",
    },
    response: {
      title: "Configuration Response",
      description: "Bounce processor configuration data",
      enabled: "Enabled",
      dryRun: "Dry Run Mode",
      batchSize: "Batch Size",
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
      description: "Bounce processor configuration retrieved successfully",
    },
  },

  post: {
    title: "Bounce Processor Config",
    description: "Configure bounce processor cron task",
    form: {
      title: "Bounce Processor Configuration",
      description: "Configure bounce processor cron task parameters",
    },
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
    response: {
      title: "Response",
      description: "Bounce Processor Config response data",
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
      "Enable or disable the bounce processor cron task and configure its schedule and batch settings. When disabled, the cron task is removed from the scheduler.",
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
