export const translations = {
  category: "Pulse execution",
  tags: {
    execute: "Execute",
  },
  errors: {
    executePulse: "Failed to execute pulse",
  },
  post: {
    title: "Execute pulse",
    titleShort: "Execute pulse",
    description: "Execute pulse health monitoring and task execution",
    container: {
      title: "Pulse execution",
      description: "Execute pulse monitoring and run scheduled tasks",
    },
    fields: {
      dryRun: {
        label: "Dry run",
        description: "Perform a dry run without making actual changes",
      },
      taskNames: {
        label: "Task aliases",
        description:
          "Enter an endpoint alias and press Enter. Leave blank to include all eligible tasks.",
      },
      force: {
        label: "Force execution",
        description: "Force execution even if tasks are not due",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
    },
    response: {
      pulseId: "Pulse ID",
      executedAt: "Executed at",
      totalTasksDiscovered: "Total Tasks Discovered",
      tasksDue: "Tasks Due",
      tasksExecuted: "Tasks executed",
      tasksSucceeded: "Tasks Succeeded",
      tasksFailed: "Tasks Failed",
      tasksSkipped: "Tasks Skipped",
      totalExecutionTimeMs: "Total Execution Time (ms)",
      errors: "Errors",
      summary: "Execution Summary",
      results: "Results",
      resultsDescription: "Task execution results",
      taskName: "Task Name",
      success: "Success",
      duration: "Duration",
      message: "Message",
      executionFailed: "Execution failed",
      dryRunSuccess: "Dry run completed successfully",
      executionSuccess: "Execution completed successfully",
    },
    examples: {
      basic: {
        title: "Basic Pulse Execution",
      },
      dryRun: {
        title: "Dry Run Execution",
      },
      success: {
        title: "Successful Execution",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      internal: {
        title: "Internal Error",
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
      unsaved: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
