export const translations = {
  category: "API Endpoint",
  tags: {
    tasks: "Tasks",
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
};
