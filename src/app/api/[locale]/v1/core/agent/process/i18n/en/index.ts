export const translations = {
  post: {
    title: "Process Email Agent Queue",
    description: "Trigger email processing through the agent pipeline",
    form: {
      title: "Email Processing Configuration",
      description: "Configure email processing parameters and options",
    },
    emailIds: {
      label: "Email IDs",
      description: "List of specific email IDs to process (optional)",
      placeholder: "Enter email IDs separated by commas",
    },
    accountIds: {
      label: "Account IDs",
      description: "List of account IDs to process all emails for (optional)",
      placeholder: "Enter account IDs separated by commas",
    },
    forceReprocess: {
      label: "Force Reprocess",
      description: "Force reprocessing of already processed emails",
    },
    skipHardRules: {
      label: "Skip Hard Rules",
      description: "Skip hard rules processing (bounce/spam detection)",
    },
    skipAiProcessing: {
      label: "Skip AI Processing",
      description: "Skip AI-powered analysis and recommendations",
    },
    dryRun: {
      label: "Dry Run",
      description: "Preview processing without making actual changes",
    },
    priority: {
      label: "Processing Priority",
      description: "Priority level for processing queue",
    },
    response: {
      title: "Processing Results",
      description: "Email processing results and statistics",
      item: "Item",
      processedEmails: "Processed Emails",
      hardRulesResults: {
        title: "Hard Rules Results",
        description:
          "Results from hard rules processing (bounce/spam detection)",
        item: {
          title: "Hard Rule Result",
        },
        emailId: "Email ID",
        result: "Result",
      },
      aiProcessingResults: {
        title: "AI Processing Results",
        description: "Results from AI-powered analysis and recommendations",
        item: {
          title: "AI Processing Result",
        },
        emailId: "Email ID",
        result: "Result",
      },
      confirmationRequests: {
        title: "Confirmation Requests",
        description: "Human confirmations required for processing",
        id: "Confirmation ID",
        actionType: "Action Type",
        status: "Status",
      },
      errors: {
        title: "Processing Errors",
        description: "Errors that occurred during processing",
        item: {
          title: "Processing Error",
        },
        emailId: "Email ID",
        error: "Error",
        stage: "Stage",
      },
      summary: {
        title: "Processing Summary",
        description: "Overall processing statistics and results",
        totalProcessed: "Total Processed",
        hardRulesApplied: "Hard Rules Applied",
        aiProcessingCompleted: "AI Processing Completed",
        aiActionsRecommended: "AI Actions Recommended",
        errorsEncountered: "Errors Encountered",
        confirmationsGenerated: "Confirmations Generated",
        confirmationsRequired: "Confirmations Required",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to trigger email processing",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid processing parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during processing",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during processing",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while processing emails",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to email processing is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Email processing endpoint not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Processing Conflict",
        description: "Email processing conflict occurred",
      },
    },
    success: {
      title: "Processing Complete",
      description: "Email processing completed successfully",
    },
  },
  enums: {
    priority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent",
    },
  },
  imapErrors: {
    agent: {
      processing: {
        error: {
          server: {
            description: "Failed to process emails",
          },
        },
      },
    },
  },
};
