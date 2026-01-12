export const translations = {
  description: "Executes cron tasks and manages side tasks",
  common: {
    taskName: "Task Name",
    taskNamesDescription: "Names of tasks to filter",
    detailed: "Detailed",
    detailedDescription: "Include detailed information",
    active: "Active",
    total: "Total",
    uptime: "Uptime",
    id: "ID",
    status: "Status",
    lastRun: "Last Run",
    nextRun: "Next Run",
    schedule: "Schedule",
  },
  post: {
    title: "Unified Task Runner",
    description: "Manage unified task runner for cron tasks and side tasks",
    container: {
      title: "Unified Task Runner Management",
      description:
        "Control the unified task runner that manages both cron tasks and side tasks",
    },
    fields: {
      action: {
        label: "Action",
        description: "Action to perform on the task runner",
        options: {
          start: "Start Runner",
          stop: "Stop Runner",
          status: "Get Status",
          restart: "Restart Runner",
        },
      },
      taskFilter: {
        label: "Task Filter",
        description: "Filter tasks by type",
        options: {
          all: "All Tasks",
          cron: "Cron Tasks Only",
          side: "Side Tasks Only",
        },
      },
      dryRun: {
        label: "Dry Run",
        description: "Perform a dry run without making actual changes",
      },
    },
    response: {
      success: "Operation Success",
      actionResult: "Action Result",
      message: "Response Message",
      timestamp: "Timestamp",
    },
    reasons: {
      previousInstanceRunning: "Previous instance is still running",
    },
    messages: {
      taskSkipped: "Task was skipped",
      taskCompleted: "Task completed successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
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
      execution: {
        title: "Task Execution Error",
        description: "Failed to execute task",
      },
      taskAlreadyRunning: {
        title: "Task Already Running",
        description: "The specified task is already running",
      },
      sideTaskExecution: {
        title: "Side Task Execution Error",
        description: "Failed to execute side task",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
