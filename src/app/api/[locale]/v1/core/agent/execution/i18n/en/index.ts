export const translations = {
  tags: {
    execution: "Execution",
  },
  post: {
    title: "Execute Agent Actions",
    description:
      "Manually trigger execution of approved actions and tool calls",
    form: {
      title: "Execution Configuration",
      description: "Configure agent action execution parameters",
    },
    confirmationIds: {
      label: "Confirmation IDs",
      description: "List of specific confirmation IDs to execute (optional)",
      placeholder: "Enter confirmation IDs separated by commas",
    },
    maxActionsPerRun: {
      label: "Max Actions per Run",
      description: "Maximum number of actions to execute in one run (1-100)",
    },
    enableToolExecution: {
      label: "Enable Tool Execution",
      description: "Enable execution of approved tool calls",
    },
    enableConfirmationCleanup: {
      label: "Enable Confirmation Cleanup",
      description: "Clean up expired confirmations during execution",
    },
    confirmationExpiryHours: {
      label: "Confirmation Expiry Hours",
      description: "Hours after which confirmations expire (1-168)",
    },
    dryRun: {
      label: "Dry Run",
      description: "Preview execution without making actual changes",
    },
    response: {
      title: "Execution Results",
      description: "Agent action execution results and statistics",
      actionsExecuted: "Actions Executed",
      confirmationsProcessed: "Confirmations Processed",
      expiredConfirmationsCleanedUp: "Expired Confirmations Cleaned",
      toolCallsExecuted: "Tool Calls Executed",
      errors: {
        item: "Error Item",
        confirmationId: "Confirmation ID",
        emailId: "Email ID",
        action: "Action",
        error: "Error",
      },
      summary: {
        title: "Execution Summary",
        description: "Summary of execution results",
        totalProcessed: "Total Processed",
        successfulExecutions: "Successful Executions",
        failedExecutions: "Failed Executions",
        pendingConfirmations: "Pending Confirmations",
        expiredConfirmations: "Expired Confirmations",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to execute agent actions",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid execution parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred during execution",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during execution",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while executing actions",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to agent execution is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Agent execution endpoint not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Execution Conflict",
        description: "Execution conflict occurred",
      },
    },
    success: {
      title: "Execution Complete",
      description: "Agent action execution completed successfully",
    },
  },
  emails: {
    agent: {
      execution: {
        error: {
          execution_failed: "Agent execution failed",
          server: {
            description: "Failed to execute agent actions",
          },
          confirmations_not_found: "Confirmations not found",
          validation_failed: "Validation failed",
          confirmation_not_approved: "Confirmation not approved",
          confirmation_already_executed: "Confirmation already executed",
          marking_failed: "Failed to mark confirmations for execution",
        },
      },
    },
  },
  imapErrors: {
    agent: {
      execution: {
        error: {
          execution_failed: "Agent execution failed",
          server: {
            description: "Failed to execute agent actions",
          },
          confirmations_not_found: "Confirmations not found for execution",
          validation_failed: "Invalid execution parameters provided",
          confirmation_not_approved: "Confirmation not approved for execution",
          confirmation_already_executed: "Confirmation already executed",
          marking_failed: "Failed to mark confirmations for execution",
        },
      },
    },
  },
};
