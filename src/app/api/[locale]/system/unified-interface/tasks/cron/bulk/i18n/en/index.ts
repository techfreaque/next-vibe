export const translations = {
  category: "API Endpoint",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    bulk: "Bulk",
  },
  post: {
    title: "Bulk Task Action",
    description:
      "Perform a bulk action (delete, enable, disable, run) on multiple cron tasks",
    fields: {
      ids: {
        label: "Task IDs",
        description: "List of task IDs to act upon",
      },
      action: {
        label: "Action",
        description: "The action to perform on the selected tasks",
        options: {
          delete: "Delete",
          enable: "Enable",
          disable: "Disable",
          run: "Run Now",
        },
      },
      succeeded: {
        label: "Succeeded",
        description: "Number of tasks successfully processed",
      },
      failed: {
        label: "Failed",
        description: "Number of tasks that failed to process",
      },
      errors: {
        label: "Errors",
        description: "List of per-task errors",
      },
    },
    errors: {
      fetchFailed: "Failed to retrieve task IDs for bulk action",
      validation: {
        title: "Validation failed",
        description: "The provided bulk action data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to perform bulk actions",
      },
      internal: {
        title: "Internal error",
        description: "An error occurred while performing the bulk action",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while processing the bulk action",
      },
      network: {
        title: "Network error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      notFound: {
        title: "Not found",
        description: "One or more tasks were not found",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      completed: {
        title: "Bulk action completed",
        description: "The bulk action has been applied to the selected tasks",
      },
    },
  },
};
