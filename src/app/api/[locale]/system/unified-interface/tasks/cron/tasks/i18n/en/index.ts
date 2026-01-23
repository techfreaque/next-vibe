export const translations = {
  category: "API Endpoint",
  tags: {
    tasks: "Tasks",
  },
  list: {
    columns: {
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
  },
  get: {
    title: "List Cron Tasks",
    description: "Retrieve a list of cron tasks with optional filtering",
    container: {
      title: "Cron Tasks List",
      description: "Filter and view cron tasks",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filter by task status",
        placeholder: "Select status...",
      },
      priority: {
        label: "Priority",
        description: "Filter by task priority",
        placeholder: "Select priority...",
      },
      category: {
        label: "Category",
        description: "Filter by task category",
        placeholder: "Select category...",
      },
      enabled: {
        label: "Enabled",
        description: "Filter by enabled status",
      },
      limit: {
        label: "Limit",
        description: "Maximum number of tasks to return",
      },
      offset: {
        label: "Offset",
        description: "Number of tasks to skip",
      },
    },
    response: {
      tasks: {
        title: "Tasks",
      },
      task: {
        title: "Task",
        description: "Individual task information",
        id: "Task ID",
        name: "Task Name",
        taskDescription: "Description",
        schedule: "Schedule",
        enabled: "Enabled",
        priority: "Priority",
        status: "Status",
        category: "Category",
        lastRun: "Last Run",
        nextRun: "Next Run",
        version: "Version",
        timezone: "Timezone",
        timeout: "Timeout (ms)",
        retries: "Retries",
        retryDelay: "Retry Delay (ms)",
        lastExecutedAt: "Last Executed At",
        lastExecutionStatus: "Last Execution Status",
        lastExecutionError: "Last Execution Error",
        lastExecutionDuration: "Last Execution Duration (ms)",
        nextExecutionAt: "Next Execution At",
        executionCount: "Execution Count",
        successCount: "Success Count",
        errorCount: "Error Count",
        averageExecutionTime: "Average Execution Time (ms)",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
      totalTasks: "Total Tasks",
    },
    errors: {
      internal: {
        title: "Internal server error occurred while retrieving tasks",
        description:
          "An unexpected error occurred while fetching the task list",
      },
      unauthorized: {
        title: "Unauthorized access to task list",
        description: "You do not have permission to view the task list",
      },
      validation: {
        title: "Invalid request parameters",
        description: "The provided request parameters are invalid",
      },
      forbidden: {
        title: "Access forbidden",
        description: "Access to this resource is forbidden",
      },
      notFound: {
        title: "Tasks not found",
        description: "No tasks were found matching the criteria",
      },
      network: {
        title: "Network error",
        description: "A network error occurred while retrieving tasks",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "There are unsaved changes that need to be addressed",
      },
      conflict: {
        title: "Conflict error",
        description: "A conflict occurred while processing the request",
      },
    },
    success: {
      retrieved: {
        title: "Tasks retrieved successfully",
        description: "The task list has been retrieved successfully",
      },
    },
  },
  post: {
    title: "Create Cron Task",
    description: "Create a new cron task",
    container: {
      title: "Create Task",
      description: "Configure a new cron task",
    },
    fields: {
      name: {
        label: "Task Name",
        description: "Unique name for the task",
        placeholder: "Enter task name...",
      },
      description: {
        label: "Description",
        description: "Task description",
        placeholder: "Enter description...",
      },
      schedule: {
        label: "Schedule",
        description: "Cron schedule expression",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priority",
        description: "Task priority level",
      },
      category: {
        label: "Category",
        description: "Task category",
      },
      enabled: {
        label: "Enabled",
        description: "Enable or disable the task",
      },
      timeout: {
        label: "Timeout (ms)",
        description: "Maximum execution time in milliseconds",
      },
      retries: {
        label: "Retries",
        description: "Number of retry attempts",
      },
      retryDelay: {
        label: "Retry Delay (ms)",
        description: "Delay between retries in milliseconds",
      },
    },
    response: {
      task: {
        title: "Created Task",
      },
    },
    errors: {
      validation: {
        title: "Validation failed",
        description: "The provided task data is invalid",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You do not have permission to create tasks",
      },
      internal: {
        title: "Internal error",
        description: "An error occurred while creating the task",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this resource is forbidden",
      },
      conflict: {
        title: "Conflict",
        description: "A task with this name already exists",
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
        description: "The requested resource was not found",
      },
      unsaved: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      created: {
        title: "Task created",
        description: "The task has been created successfully",
      },
    },
  },
};
