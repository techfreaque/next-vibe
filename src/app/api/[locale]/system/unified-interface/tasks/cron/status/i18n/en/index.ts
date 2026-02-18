export const translations = {
  title: "Cron System Status",
  description: "Get cron system status and task information",
  category: "API Endpoint",
  tags: {
    status: "Status",
  },
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
  success: {
    title: "Success",
    content: "Success",
  },
  errors: {
    validation: {
      title: "Validation Failed",
      description: "Invalid request parameters",
    },
    network: {
      title: "Network Error",
      description: "Network connection failed",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "Cron job not found",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while retrieving cron status",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
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
  widget: {
    title: "System Status",
    loading: "Loading status...",
    uptime: "Uptime",
    tasks: "Tasks",
    emptyTasks: "No tasks found",
    status: {
      healthy: "Healthy",
      warning: "Warning",
      critical: "Critical",
      unknown: "Unknown",
    },
    stats: {
      activeTasks: "Active Tasks",
      totalTasks: "Total Tasks",
      systemHealth: "System Health",
    },
    task: {
      lastRun: "Last:",
      nextRun: "Next:",
    },
    actions: {
      tasks: "Tasks",
      history: "History",
      stats: "Stats",
      refresh: "Refresh",
    },
  },
};
