export const translations = {
  get: {
    title: "Get Cron Task",
    description: "Retrieve a single cron task by ID",
    container: {
      title: "Cron Task Details",
      description: "View details of a specific cron task",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Unique identifier of the task",
      },
    },
    response: {
      task: {
        title: "Task",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided task ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to view this task",
      },
      notFound: {
        title: "Task Not Found",
        description: "The requested task could not be found",
      },
      internal: {
        title: "Internal Server Error",
        description: "An error occurred while retrieving the task",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to access this task",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      retrieved: {
        title: "Task Retrieved",
        description: "Task retrieved successfully",
      },
    },
  },
  put: {
    title: "Update Cron Task",
    description: "Update an existing cron task",
    container: {
      title: "Update Cron Task",
      description: "Modify task settings",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Unique identifier of the task",
      },
      name: {
        label: "Task Name",
        description: "Name of the task",
        placeholder: "Enter task name",
      },
      description: {
        label: "Description",
        description: "Task description",
        placeholder: "Enter task description",
      },
      schedule: {
        label: "Schedule",
        description: "Cron schedule expression",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Enabled",
        description: "Whether the task is enabled",
      },
      priority: {
        label: "Priority",
        description: "Task priority level",
        placeholder: "Select priority",
      },
      category: {
        label: "Category",
        description: "Task category",
        placeholder: "Select category",
      },
      timeout: {
        label: "Timeout",
        description: "Maximum execution time in seconds",
        placeholder: "3600",
      },
      retries: {
        label: "Retries",
        description: "Number of retry attempts on failure",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Retry Attempts",
        description: "Number of retry attempts on failure",
      },
      retryDelay: {
        label: "Retry Delay",
        description: "Delay between retries in seconds",
      },
    },
    response: {
      task: {
        title: "Updated Task",
      },
      success: {
        title: "Success",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to update this task",
      },
      notFound: {
        title: "Task Not Found",
        description: "The task to update could not be found",
      },
      internal: {
        title: "Internal Server Error",
        description: "An error occurred while updating the task",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to update this task",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred while updating the task",
      },
    },
    success: {
      updated: {
        title: "Task Updated",
        description: "Task updated successfully",
      },
    },
  },
  delete: {
    title: "Delete Cron Task",
    description: "Delete a cron task",
    container: {
      title: "Delete Cron Task",
      description: "Remove a task from the system",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Unique identifier of the task to delete",
      },
    },
    response: {
      success: {
        title: "Success",
      },
      message: {
        title: "Message",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "The provided task ID is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to delete this task",
      },
      notFound: {
        title: "Task Not Found",
        description: "The task to delete could not be found",
      },
      internal: {
        title: "Internal Server Error",
        description: "An error occurred while deleting the task",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to delete this task",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "Cannot delete task due to a conflict",
      },
    },
    success: {
      deleted: {
        title: "Task Deleted",
        description: "Task deleted successfully",
      },
    },
  },
};

