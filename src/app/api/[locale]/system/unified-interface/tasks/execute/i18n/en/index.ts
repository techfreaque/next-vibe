export const translations = {
  category: "Task Execution",
  tags: {
    execute: "Execute",
  },
  errors: {
    executeTask: "Failed to execute task",
    forbidden: "You do not have permission to execute this task",
    alreadyRunning: "Task is already running",
    notFound: "Task not found",
  },
  post: {
    title: "Execute Task",
    description:
      "Trigger a single task by ID and receive the result synchronously",
    container: {
      title: "Task Execution",
      description: "Execute a specific task and wait for its result",
    },
    fields: {
      taskId: {
        label: "Task ID",
        description: "The ID of the task to execute",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
    },
    response: {
      taskId: "Task ID",
      taskName: "Task Name",
      executedAt: "Executed At",
      duration: "Duration (ms)",
      status: "Status",
      output: "Output",
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
        description: "You do not have permission to execute this task",
      },
      notFound: {
        title: "Not Found",
        description: "Task not found",
      },
      conflict: {
        title: "Conflict",
        description: "Task is already running",
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
    submitButton: {
      label: "Run Task",
      loadingText: "Running...",
    },
    success: {
      title: "Success",
      description: "Task executed successfully",
    },
  },
};
