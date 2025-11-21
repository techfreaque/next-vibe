export const translations = {
  common: {
    sideTasksActionLabel: "Action",
    sideTasksActionDescription: "Select the action to perform",
    sideTasksActionList: "List Tasks",
    sideTasksActionGet: "Get Task",
    sideTasksActionCreate: "Create Task",
    sideTasksActionUpdate: "Update Task",
    sideTasksActionDelete: "Delete Task",
    sideTasksActionStats: "Task Statistics",
    sideTasksActionExecutions: "Task Executions",
    sideTasksActionHealthCheck: "Health Check",
    sideTasksIdLabel: "Task ID",
    sideTasksIdDescription: "The unique identifier of the task",
    sideTasksNameLabel: "Task Name",
    sideTasksNameDescription: "The name of the task",
    sideTasksLimitLabel: "Limit",
    sideTasksLimitDescription: "Maximum number of results to return",
    sideTasksDataLabel: "Task Data",
    sideTasksDataDescription: "Additional data for the task",
    sideTasksRepositoryFetchAllFailed: "Failed to fetch all side tasks",
    sideTasksRepositoryFetchByIdFailed: "Failed to fetch side task by ID",
    sideTasksRepositoryCreateFailed: "Failed to create side task",
  },
  post: {
    title: "Side Tasks Management",
    description: "Manage side tasks operations",
    category: "System Tasks",
    container: {
      title: "Side Tasks",
      description: "Configure side task operations",
    },
  },
  get: {
    title: "Get Side Task",
    description: "Retrieve side task information",
    container: {
      title: "Side Task Details",
      description: "View side task details",
    },
    response: {
      healthyTasks: {
        title: "Healthy Tasks",
      },
      unhealthyTasks: {
        title: "Unhealthy Tasks",
      },
      runningTasks: {
        title: "Running Tasks",
      },
      totalTasks: {
        title: "Total Tasks",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to view side tasks",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      serverError: {
        title: "Server Error",
        description: "An error occurred while retrieving side tasks",
      },
      unknownError: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Side tasks retrieved successfully",
    },
  },
  tasks: {
    side: {
      response: {
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        data: {
          title: "Data",
        },
        count: {
          title: "Count",
        },
      },
    },
  },
  category: "API Endpoint",
  tags: {
    sidetasks: "Side Tasks",
  },
  errors: {
    fetchByNameFailed: "Failed to fetch side task by name",
    updateTaskFailed: "Failed to update side task",
    deleteTaskFailed: "Failed to delete side task",
    createExecutionFailed: "Failed to create side task execution",
    updateExecutionFailed: "Failed to update side task execution",
    fetchExecutionsFailed: "Failed to fetch side task executions",
    fetchRecentExecutionsFailed: "Failed to fetch recent side task executions",
    createHealthCheckFailed: "Failed to create side task health check",
    fetchLatestHealthCheckFailed: "Failed to fetch latest health check",
    fetchHealthCheckHistoryFailed: "Failed to fetch health check history",
    fetchStatisticsFailed: "Failed to fetch side task statistics",
    taskNotFound: "Side task not found",
    executionNotFound: "Side task execution not found",
  },
};
