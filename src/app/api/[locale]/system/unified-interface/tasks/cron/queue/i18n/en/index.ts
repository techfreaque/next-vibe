export const translations = {
  category: "API Endpoint",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    scheduling: "Scheduling",
    queue: "Queue",
  },
  errors: {
    fetchQueue: "Failed to fetch task queue",
  },
  get: {
    title: "Task Queue",
    description:
      "View the upcoming task execution queue sorted by next run time",
    fields: {
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
      hidden: {
        label: "Visibility",
        description:
          "Include hidden tasks (default: all tasks including hidden)",
        placeholder: "All tasks",
      },
      search: {
        label: "Search",
        description: "Filter tasks by name, route, or category",
        placeholder: "Search queue...",
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
        title: "Queued Tasks",
      },
      task: {
        title: "Task",
        description: "Individual task information",
        id: "Task ID",
        routeId: "Route ID",
        displayName: "Name",
        taskDescription: "Description",
        schedule: "Schedule",
        enabled: "Enabled",
        hidden: "Hidden",
        priority: "Priority",
        status: "Status",
        category: "Category",
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
        consecutiveFailures: "Consecutive Failures",
        successCount: "Success Count",
        errorCount: "Error Count",
        averageExecutionTime: "Average Execution Time (ms)",
        createdAt: "Created At",
        updatedAt: "Updated At",
        userId: "User ID",
        outputMode: "Output Mode",
      },
      totalTasks: "Total Tasks",
    },
    errors: {
      internal: {
        title: "Internal server error while retrieving queue",
        description:
          "An unexpected error occurred while fetching the task queue",
      },
      unauthorized: {
        title: "Unauthorized access to task queue",
        description: "You do not have permission to view the task queue",
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
        title: "Queue not found",
        description: "No tasks were found in the queue",
      },
      network: {
        title: "Network error",
        description: "A network error occurred while retrieving the queue",
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
        title: "Queue retrieved successfully",
        description: "The task queue has been retrieved successfully",
      },
    },
  },
  widget: {
    title: "Task Queue",
    loading: "Loading queue...",
    header: {
      tasks: "All Tasks",
      history: "History",
      stats: "Stats",
      create: "New Task",
      refresh: "Refresh",
    },
    filter: {
      visible: "Visible",
      hiddenOnly: "Hidden",
      allTasks: "All Tasks",
      allPriorities: "All Priorities",
      allCategories: "All Categories",
    },
    search: {
      placeholder: "Search queue...",
    },
    queue: {
      position: "#",
      nextRun: "Next run",
      lastRun: "Last run",
      never: "Never",
      notScheduled: "Not scheduled",
      in: "in",
      ago: "ago",
      justNow: "just now",
      overdue: "overdue",
      hiddenBadge: "Hidden",
      owner: {
        system: "System",
        user: "User",
      },
    },
    action: {
      view: "View details",
      history: "View history",
      edit: "Edit task",
      run: "Run now",
    },
    bulk: {
      selected: "{count} selected",
      selectAll: "Select all",
      clearSelection: "Clear selection",
      enable: "Enable",
      disable: "Disable",
      runNow: "Run now",
      delete: "Delete",
      confirmDeleteTitle: "Delete tasks?",
      confirmDelete: "Delete {count} task(s)? This cannot be undone.",
      cancel: "Cancel",
      success: "{succeeded} succeeded, {failed} failed",
    },
    empty: {
      noTasks: "Queue is empty",
      noTasksDesc: "No enabled tasks with scheduled runs",
      noMatches: "No tasks match your filters",
      noMatchesDesc: "Try adjusting your search or filter criteria",
      clearFilters: "Clear Filters",
    },
  },
};
