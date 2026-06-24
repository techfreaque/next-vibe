export const translations = {
  tags: {
    awaitTask: "Await Task",
  },
  post: {
    title: "Await Task",
    titleShort: "Await Task",
    description:
      "Wait on a dispatched background task. Returns immediately if already done, or pauses the AI stream until the task finishes.",
    fields: {
      taskId: {
        label: "Task ID",
        description:
          "The task ID returned by execute-tool (detach or wakeUp mode).",
      },
      status: {
        title: "Status",
        description: "Current task status.",
      },
      result: {
        title: "Result",
        description: "Tool output (present when completed).",
      },
      waiting: {
        title: "Waiting",
        description: "True when the stream is paused waiting for the task.",
      },
      originalToolName: {
        title: "Tool",
        description: "The tool that was dispatched.",
      },
      originalArgs: {
        title: "Arguments",
        description: "The dispatched tool's input arguments.",
      },
    },
    widget: {
      noToolName: "No tool name available.",
      resolving: "Resolving tool...",
      unknownTool: "Unknown tool: {{toolName}}",
    },
    status: {
      waiting: "Waiting",
      complete: "Complete",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid taskId",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      internal: {
        title: "Internal Error",
        description: "Failed to register waiter on the task",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to await this task",
      },
      notFound: {
        title: "Not Found",
        description: "Task not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Task state conflict",
      },
    },
    success: {
      title: "Done",
      description: "Task completed",
    },
  },
};
