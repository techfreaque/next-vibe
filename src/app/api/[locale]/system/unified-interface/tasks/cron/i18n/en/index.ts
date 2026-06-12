export const translations = {
  history: {
    category: "Task Management",

    errors: {
      cronTaskNotFound: "Cron task not found",
      repositoryInternalError: "An internal error occurred",
      fetchCronTaskHistory: "Failed to fetch cron task history",
    },

    get: {
      tags: {
        tasks: "Tasks",
        monitoring: "Monitoring",
      },
      title: "Task Execution History",
      description: "View historical execution records for cron tasks",
      fields: {
        taskId: {
          label: "Task ID",
          description: "Filter by specific task ID",
          placeholder: "Enter task ID",
        },
        taskName: {
          label: "Task Name",
          description: "Filter by task name (partial match)",
          placeholder: "Enter task name",
        },
        status: {
          label: "Execution Status",
          description: "Filter by execution status",
          placeholder: "Select statuses",
          options: {
            PENDING: "Pending",
            SCHEDULED: "Scheduled",
            RUNNING: "Running",
            COMPLETED: "Completed",
            FAILED: "Failed",
            ERROR: "Error",
            TIMEOUT: "Timeout",
            SKIPPED: "Skipped",
            CANCELLED: "Cancelled",
            STOPPED: "Stopped",
            BLOCKED: "Blocked",
          },
        },
        priority: {
          label: "Task Priority",
          description: "Filter by task priority level",
          placeholder: "Select priorities",
          options: {
            LOW: "Low",
            MEDIUM: "Medium",
            HIGH: "High",
            CRITICAL: "Critical",
          },
        },
        startDate: {
          label: "Start Date",
          description: "Filter executions after this date",
        },
        endDate: {
          label: "End Date",
          description: "Filter executions before this date",
        },
        limit: {
          label: "Results Limit",
          description: "Maximum number of results to return",
          placeholder: "50",
        },
        offset: {
          label: "Results Offset",
          description: "Number of results to skip for pagination",
          placeholder: "0",
        },
      },
      response: {
        title: "Task History Response",
        description: "Historical execution data for cron tasks",
        executions: {
          title: "Execution Records",
        },
        totalCount: {
          title: "Total Count",
        },
        hasMore: {
          title: "Has More Results",
        },
        statusCounts: {
          title: "Status Counts",
        },
        summary: {
          title: "Execution Summary",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters provided",
        },
        internal: {
          title: "Internal Server Error",
          description: "Failed to retrieve task history",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You do not have permission to view task history",
        },
        notFound: {
          title: "Not Found",
          description: "Task or execution record not found",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred while fetching task history",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access to task history is forbidden",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          titleChanges: "Unsaved Changes",
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "History Retrieved",
        description: "Task execution history retrieved successfully",
      },
      log: {
        fetchSuccess: "Successfully fetched {{count}} execution records",
        fetchError: "Failed to fetch task execution history",
      },
      request: {
        title: "Request Parameters",
        description: "Filter task execution history",
      },
      unknownTask: "Unknown Task",
    },
    widget: {
      title: "Task Execution History",
      loading: "Loading history...",
      header: {
        tasks: "Tasks",
        stats: "Stats",
        pulse: "Pulse",
        refresh: "Refresh",
      },
      summary: {
        total: "Total",
        successful: "Successful",
        failed: "Failed",
        successRate: "Success Rate",
        avgDuration: "Avg Duration",
      },
      search: {
        placeholder: "Search tasks...",
      },
      filter: {
        all: "All",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
        timeout: "Timeout",
        cancelled: "Cancelled",
      },
      col: {
        taskName: "Task Name",
        status: "Status",
        duration: "Duration",
        started: "Started",
        completed: "Completed",
        environment: "Environment",
        error: "Error",
      },
      empty: "No execution history found",
      result: "Result",
      error: {
        collapse: "Collapse error",
        label: "Error",
      },
      pagination: {
        info: "Page {{page}} of {{totalPages}} ({{total}} total)",
        prev: "Previous",
        next: "Next",
      },
    },
  },
  stats: {
    category: "Task Management",

    errors: {
      fetchCronTaskStats: "Failed to fetch cron task statistics",
    },

    get: {
      title: "Get Cron Task Statistics",
      description:
        "Retrieve comprehensive statistics and metrics for cron tasks",
      tag: "Cron Statistics",
      form: {
        title: "Cron Statistics Request",
        description: "Configure parameters for retrieving cron task statistics",
      },
      fields: {
        period: {
          title: "Time Period",
          description: "Time period for statistics aggregation",
        },
        type: {
          title: "Statistics Type",
          description: "Type of statistics to retrieve",
        },
        taskId: {
          title: "Task ID",
          description: "Optional specific task ID to filter statistics",
        },
        limit: {
          title: "Result Limit",
          description: "Maximum number of results to return",
        },
        timePeriod: {
          title: "Time Period",
        },
        dateRangePreset: {
          title: "Date Range Preset",
        },
        taskName: {
          title: "Task Name",
        },
        taskStatus: {
          title: "Task Status",
        },
        taskPriority: {
          title: "Task Priority",
        },
        healthStatus: {
          title: "Health Status",
        },
        minDuration: {
          title: "Minimum Duration",
        },
        maxDuration: {
          title: "Maximum Duration",
        },
        includeDisabled: {
          title: "Include Disabled",
        },
        includeSystemTasks: {
          title: "Include System Tasks",
        },
        hasRecentFailures: {
          title: "Has Recent Failures",
        },
        hasTimeout: {
          title: "Has Timeout",
        },
        search: {
          title: "Search",
        },
      },
      period: {
        hour: "Hourly",
        day: "Daily",
        week: "Weekly",
        month: "Monthly",
      },
      type: {
        overview: "Overview",
        performance: "Performance",
        errors: "Error Analysis",
        trends: "Trend Analysis",
      },
      response: {
        totalTasks: { title: "Total Tasks" },
        executedTasks: { title: "Executed Tasks" },
        successfulTasks: { title: "Successful Tasks" },
        failedTasks: { title: "Failed Tasks" },
        averageExecutionTime: { title: "Avg Execution Time (ms)" },
        totalExecutions: { title: "Total Executions" },
        executionsLast24h: { title: "Executions Last 24h" },
        successRate: { title: "Success Rate (%)" },
        successfulExecutions: { title: "Successful Executions" },
        failedExecutions: { title: "Failed Executions" },
        failureRate: { title: "Failure Rate (%)" },
        avgExecutionTime: { title: "Avg Execution Time (ms)" },
        minExecutionTime: { title: "Min Execution Time (ms)" },
        maxExecutionTime: { title: "Max Execution Time (ms)" },
        medianExecutionTime: { title: "Median Execution Time (ms)" },
        pendingExecutions: { title: "Pending Executions" },
        runningExecutions: { title: "Running Executions" },
        activeTasks: { title: "Active Tasks" },
        systemStatus: { title: "System Status" },
        uptime: { title: "Uptime" },
        healthyTasks: { title: "Healthy Tasks" },
        degradedTasks: { title: "Degraded Tasks" },
        systemLoad: { title: "System Load (%)" },
        queueSize: { title: "Queue Size" },
      },
      errors: {
        server: {
          title: "Server Error",
          description:
            "An internal server error occurred while retrieving statistics",
        },
        validation: {
          title: "Validation Error",
          description: "The provided parameters are invalid",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required to access statistics",
        },
        forbidden: {
          title: "Forbidden",
          description: "Insufficient permissions to access statistics",
        },
        notFound: {
          title: "Not Found",
          description: "The requested statistics could not be found",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred while processing the request",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred while retrieving statistics",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unknown error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "There are unsaved changes that need to be addressed",
        },
      },
      success: {
        title: "Statistics Retrieved",
        description: "Cron task statistics retrieved successfully",
      },
    },
    priority: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      background: "Background",
    },
    widget: {
      title: "Cron Statistics",
      loading: "Loading statistics...",
      viewTasks: "Tasks",
      viewHistory: "History",
      viewPulse: "Pulse",
      refresh: "Refresh",
      totalTasks: "Total Tasks",
      executedTasks: "Executed Tasks",
      successfulTasks: "Successful",
      failedTasks: "Failed",
      successRate: "Success Rate",
      avgDuration: "Avg Duration",
      overallSuccessRate: "Overall Success Rate",
      activeTasks: "Active Tasks",
      runningExecutions: "Running",
      pendingExecutions: "Pending",
      healthyTasks: "Healthy Tasks",
      degradedTasks: "Degraded Tasks",
      systemLoad: "System Load",
      queueSize: "Queue Size",
      executionsLast24h: "Last 24h",
      tasksByStatus: "Tasks by Status",
      tasksByPriority: "Tasks by Priority",
      topPerforming: "Top Performing Tasks",
      problemTasks: "Problem Tasks",
      recentActivity: "Recent Activity",
      dailyStats: "Daily Statistics",
      systemStatus: {
        healthy: "Healthy",
        warning: "Warning",
        critical: "Critical",
        unknown: "Unknown",
      },
      uptime: "Uptime",
      col: {
        rank: "#",
        taskName: "Task Name",
        executions: "Executions",
        avgDuration: "Avg Duration",
        failures: "Failures",
        failureRate: "Failure Rate",
        date: "Date",
        successes: "Successes",
        uniqueTasks: "Unique Tasks",
      },
    },
  },
  task: {
    category: "System",
    tags: {
      cron: "Cron",
      scheduling: "Scheduling",
    },
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
        displayName: {
          label: "Display Name",
          description: "Human-readable label for this task",
          placeholder: "Enter display name",
        },
        outputMode: {
          label: "Output Mode",
          description: "When to send notifications after execution",
          placeholder: "Select output mode",
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
          label: "Timeout (ms)",
          description:
            "Maximum execution time in milliseconds (e.g. 300000 = 5 minutes)",
          placeholder: "300000",
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
          label: "Retry Delay (ms)",
          description:
            "Delay between retries in milliseconds (e.g. 5000 = 5 seconds)",
          placeholder: "5000",
        },
        taskInput: {
          label: "Task Input",
          description: "JSON input data for the task",
        },
        hidden: {
          label: "Hidden",
          description:
            "Hide this task from AI system prompts and default task listings",
        },
        runOnce: {
          label: "Run Once",
          description: "Run this task only once and then disable it",
        },
        targetInstance: {
          label: "Target Instance",
          description:
            "Instance ID this task should run on. Leave empty to run only on the host instance.",
          placeholder: "e.g. hermes, thea-prod",
        },
        lastExecutionStatus: {
          label: "Execution Status",
          description:
            "Override the last execution status. Use to reset a stuck 'running' task.",
          placeholder: "Select status",
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
      submitButton: {
        label: "Save Task",
        loadingText: "Saving...",
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
    priority: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      background: "Cron",
    },
    status: {
      pending: "Pending",
      running: "Running",
      completed: "Completed",
      failed: "Failed",
      timeout: "Timeout",
      cancelled: "Cancelled",
      skipped: "Skipped",
      blocked: "Blocked",
      scheduled: "Scheduled",
      stopped: "Stopped",
      error: "Error",
    },
    taskCategory: {
      development: "Development",
      build: "Build",
      watch: "Watch",
      generator: "Generator",
      test: "Test",
      maintenance: "Maintenance",
      database: "Database",
      system: "System",
      monitoring: "Monitoring",
    },
    outputMode: {
      storeOnly: "Store Only",
      notifyOnFailure: "Notify on Failure",
      notifyAlways: "Notify Always",
    },
    widget: {
      notFound: "Task not found",
      never: "Never",
      history: "History",
      edit: "Edit",
      delete: "Delete",
      enabled: "Enabled",
      disabled: "Disabled",
      identity: "Identity",
      id: "Task ID",
      routeId: "Route ID",
      displayName: "Display Name",
      version: "Version",
      category: "Category",
      priority: "Priority",
      schedule: "Schedule",
      timezone: "Timezone",
      createdAt: "Created",
      updatedAt: "Updated",
      owner: "Owner",
      ownerSystem: "System",
      ownerUser: "User",
      outputMode: "Output Mode",
      outputModes: {
        storeOnly: "Store Only",
        notifyOnFailure: "Notify on Failure",
        notifyAlways: "Notify Always",
      },
      stats: {
        totalExecutions: "Total Executions",
        successful: "Successful",
        errors: "Errors",
        successRate: "Success Rate",
      },
      timingSection: "Timing",
      timing: {
        avgDuration: "Avg Duration",
        lastDuration: "Last Duration",
        lastRun: "Last Run",
        nextRun: "Next Run",
        timeout: "Timeout",
        retries: "Retries",
        retryDelay: "Retry Delay",
      },
      lastExecutionError: "Last Error",
      run: "Run Now",
      runSuccess: "Task executed successfully",
      running: "Running...",
      refresh: "Refresh",
      taskInput: {
        title: "Task Input",
        loading: "Loading endpoint definition...",
        notFound: "Endpoint definition not found for this task",
        empty: "No input parameters configured",
        editTitle: "Task Input Parameters",
        editDescription:
          "Configure the input parameters for this task endpoint",
      },
      scheduleAutocomplete: {
        customBadge: "Custom",
        noSchedulesFound: "No schedules found",
        useCustomSchedule: "Use custom schedule",
        commonSchedules: "Common Schedules",
      },
      schedulePicker: {
        selectPlaceholder: "Select schedule...",
        customOption: "Custom...",
        presets: {
          title: "Quick Presets",
          everyMinute: "Every minute",
          every5m: "Every 5 minutes",
          every15m: "Every 15 minutes",
          every30m: "Every 30 minutes",
          everyHour: "Every hour",
          every2h: "Every 2 hours",
          every4h: "Every 4 hours",
          every6h: "Every 6 hours",
          every12h: "Every 12 hours",
          dailyMidnight: "Daily at midnight",
          daily6am: "Daily at 6 AM",
          dailyNoon: "Daily at noon",
          daily6pm: "Daily at 6 PM",
          weeklyMon: "Weekly on Monday",
          weeklySun: "Weekly on Sunday",
          monthlyFirst: "1st of every month",
        },
        custom: {
          title: "Custom Schedule",
          repeatEvery: "Run every",
          at: "At",
          onDays: "On",
          preview: "→ {{description}}",
          nextRun: "Next: {{time}}",
          nextRunMultiple: "Next: {{first}}, then {{second}}",
          unit: {
            minutes: "minutes",
            hours: "hours",
            days: "days",
            weeks: "weeks",
            months: "months",
          },
          days: {
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
            sun: "Sun",
          },
          advanced: "Advanced expression",
          advancedPlaceholder: "e.g. 0 9 * * 1-5",
          advancedInvalid: "Invalid cron expression",
        },
      },
    },
  },
  tasks: {
    category: "API Endpoint",
    tags: {
      tasks: "Tasks",
      cron: "Cron",
      scheduling: "Scheduling",
    },
    errors: {
      fetchCronTasks: "Failed to fetch cron tasks",
      createCronTask: "Failed to create cron task",
      invalidTaskInput:
        "Task input does not match the endpoint's request schema",
      endpointNotFound: "Endpoint not found for the given route ID",
      targetInstanceForbidden:
        "Only administrators can set the target instance for tasks",
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
          label: "Status",
          description: "Filter by enabled status",
          placeholder: "All tasks",
        },
        hidden: {
          label: "Visibility",
          description: "Filter by hidden status (default: visible only)",
          placeholder: "Visible tasks",
        },
        search: {
          label: "Search",
          description: "Filter tasks by name, route, description, or category",
          placeholder: "Search tasks...",
        },
        sort: {
          label: "Sort",
          description: "Sort order for the task list",
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
          hidden: "Hidden",
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
        id: {
          label: "Task ID",
          description:
            "Unique, stable identifier for this task (e.g. 'db-health')",
          placeholder: "Enter task ID...",
        },
        routeId: {
          label: "Route ID",
          description:
            "Handler identifier: task name, endpoint alias, or 'cron-steps'",
          placeholder: "Enter route ID...",
        },
        displayName: {
          label: "Display Name",
          description: "Human-readable label for this task",
          placeholder: "Enter display name...",
        },
        outputMode: {
          label: "Output Mode",
          description: "When to send notifications after execution",
          placeholder: "Select output mode...",
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
        hidden: {
          label: "Hidden",
          description:
            "Hide this task from AI system prompts and default task listings",
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
        taskInput: {
          label: "Task Input",
          description: "JSON input data for the task",
        },
        runOnce: {
          label: "Run Once",
          description: "Run this task only once and then disable it",
        },
        targetInstance: {
          label: "Target Instance",
          description:
            "Instance ID this task should run on (e.g. 'hermes', 'thea-prod'). Leave empty to run only on the host instance.",
          placeholder: "Leave empty for host only",
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
    widget: {
      title: "Cron Tasks",
      loading: "Loading tasks...",
      header: {
        stats: "Stats",
        graphs: "Graphs",
        history: "History",
        queue: "Queue",
        refresh: "Refresh",
        create: "New Task",
      },
      filter: {
        all: "All",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
        pending: "Pending",
        disabled: "Disabled",
        allPriorities: "All Priorities",
        allCategories: "All Categories",
        visible: "Visible",
        hiddenOnly: "Hidden",
        allTasks: "All Tasks",
      },
      search: {
        placeholder: "Search tasks...",
      },
      sort: {
        nameAsc: "Name A-Z",
        nameDesc: "Name Z-A",
        schedule: "Schedule",
        lastRunNewest: "Last Run (newest)",
        executionsMost: "Most Executions",
      },
      task: {
        executions: "Executions:",
        lastRun: "Last run:",
        never: "Never",
        nextRun: "Next run:",
        notScheduled: "Not scheduled",
        routeId: "Route ID",
        hiddenBadge: "Hidden",
        owner: {
          system: "System",
          user: "User",
        },
        outputMode: {
          storeOnly: "Store Only",
          notifyOnFailure: "Notify on Failure",
          notifyAlways: "Notify Always",
        },
      },
      action: {
        view: "View details",
        history: "View history",
        edit: "Edit task",
        delete: "Delete task",
        runNow: "Run Now",
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
        noTasks: "No cron tasks",
        noTasksDesc: "Create your first cron task to get started",
        noMatches: "No tasks match your filters",
        noMatchesDesc: "Try adjusting your search or filter criteria",
        clearFilters: "Clear Filters",
      },
    },
  },
  errors: {
    fetch_all_failed: "Failed to fetch cron tasks",
    fetch_by_id_failed: "Failed to fetch cron task by ID",
    fetch_by_name_failed: "Failed to fetch cron task by name",
    create_failed: "Failed to create cron task",
    update_failed: "Failed to update cron task",
    delete_failed: "Failed to delete cron task",
    not_found: "Cron task not found",
    execution_create_failed: "Failed to create cron task execution",
    execution_update_failed: "Failed to update cron task execution",
    execution_not_found: "Cron task execution not found",
    executions_fetch_failed: "Failed to fetch cron task executions",
    recent_executions_fetch_failed: "Failed to fetch recent cron executions",
    schedules_fetch_failed: "Failed to fetch cron task schedules",
    schedule_update_failed: "Failed to update cron task schedule",
    schedule_not_found: "Cron task schedule not found",
    statistics_fetch_failed: "Failed to fetch cron task statistics",
  },
};
