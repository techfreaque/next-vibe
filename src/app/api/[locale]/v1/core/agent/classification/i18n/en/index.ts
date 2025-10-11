export const translations = {
  post: {
    title: "Email Agent Classification",
    description:
      "Manually trigger email classification through the agent pipeline",
    form: {
      title: "Classification Parameters",
      description: "Configure email classification processing options",
    },
    emailIds: {
      label: "Email IDs",
      description: "Specific email IDs to classify (one per line)",
      placeholder: "Enter email UUIDs, one per line",
    },
    accountIds: {
      label: "Account IDs",
      description: "Email account IDs to process (one per line)",
      placeholder: "Enter account UUIDs, one per line",
    },
    maxEmailsPerRun: {
      label: "Max Emails Per Run",
      description: "Maximum number of emails to process in this run",
    },
    enableHardRules: {
      label: "Enable Hard Rules",
      description:
        "Apply hard rule processing (bounce detection, spam filtering)",
    },
    enableAiProcessing: {
      label: "Enable AI Processing",
      description: "Apply AI-based classification and analysis",
    },
    priorityFilter: {
      label: "Priority Filter",
      description: "Only process emails with these priority levels",
    },
    forceReprocess: {
      label: "Force Reprocess",
      description: "Reprocess emails even if already classified",
    },
    dryRun: {
      label: "Dry Run",
      description: "Simulate processing without making changes",
    },
    response: {
      title: "Classification Results",
      description: "Email classification processing results",
      emailsProcessed: "Emails processed",
      hardRulesApplied: "Hard rules applied",
      aiProcessingCompleted: "AI processing completed",
      confirmationRequestsCreated: "Confirmation requests created",
      errors: {
        item: "Error Item",
        emailId: "Email ID",
        stage: "Processing stage",
        error: "Error details",
      },
      summary: {
        title: "Processing summary",
        description: "Overall classification results summary",
        totalProcessed: "Total emails processed",
        pendingCount: "Pending count",
        completedCount: "Completed count",
        failedCount: "Failed count",
        awaitingConfirmationCount: "Awaiting confirmation count",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to trigger email classification",
      },
      validation: {
        title: "Validation Failed",
        description: "Invalid classification parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Failed to trigger email classification",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during classification",
      },
      network: {
        title: "Network Error",
        description: "Network communication failed",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Requested resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Email classification triggered successfully",
    },
  },
  error: {
    execution_failed: "Classification execution failed",
    server: {
      description: "Server error occurred during email classification",
    },
    emails_not_found: "Emails not found for classification",
    validation_failed: "Validation failed for classification parameters",
    processing_records_failed:
      "Failed to process email records for classification",
  },
  imapErrors: {
    agent: {
      classification: {
        error: {
          execution_failed: "Email classification execution failed",
          server: {
            description: "Failed to process email classification",
          },
          emails_not_found: "No emails found matching criteria",
          validation_failed: "Invalid classification parameters provided",
          processing_records_failed:
            "Failed to process email classification records",
        },
      },
    },
  },
  api: {
    agent: {
      classification: {
        execution: {
          failed: "Classification execution failed",
        },
        emails: {
          not: {
            found: "Emails not found for classification",
          },
        },
        validation: {
          failed: "Validation failed for classification parameters",
        },
      },
    },
  },
};
