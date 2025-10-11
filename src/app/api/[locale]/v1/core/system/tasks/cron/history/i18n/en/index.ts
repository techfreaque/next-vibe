export const translations = {
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
};
