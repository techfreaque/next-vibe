export const translations = {
  category: "System",
  tags: {
    remoteSync: "Remote Sync",
  },
  taskReport: {
    post: {
      title: "Task Report",
      titleShort: "Report",
      description: "Accept task execution results from remote instances.",
      taskId: {
        label: "Task ID",
        description: "ID of the task being reported",
      },
      executionId: {
        label: "Execution ID",
        description: "ID of the specific execution run",
      },
      status: {
        label: "Status",
        description: "Final status of the task execution",
      },
      durationMs: {
        label: "Duration (ms)",
        description: "Execution duration in milliseconds",
      },
      summary: {
        label: "Summary",
        description: "Human-readable summary of the execution result",
      },
      error: {
        label: "Error",
        description: "Error message if execution failed",
      },
      serverTimezone: {
        label: "Server Timezone",
        description: "Timezone of the executing server",
      },
      executedByInstance: {
        label: "Executed By",
        description: "Instance ID that executed the task",
      },
      output: {
        label: "Output",
        description: "Structured output data from the task",
      },
      startedAt: {
        label: "Started At",
        description: "ISO timestamp when execution started",
      },
      wakeUpContext: {
        label: "Revival Context",
        description:
          "Thread revival context echoed back from the dispatch request — lets the caller revive without a local task record",
      },
      processed: {
        label: "Processed",
        description: "Whether the report was accepted",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid report payload",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        internal: {
          title: "Processing Error",
          description: "An error occurred while processing the report",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to submit reports",
        },
        notFound: {
          title: "Not Found",
          description: "Task not found",
        },
        network: {
          title: "Network Error",
          description: "Could not reach the report endpoint",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "There are unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Report conflict detected",
        },
      },
      success: {
        title: "Report Accepted",
        description: "Task report processed successfully",
      },
    },
  },
};
