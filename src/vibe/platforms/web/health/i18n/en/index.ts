export const translations = {
  category: "Server Management",

  tag: "Health",
  get: {
    title: "Health check",
    titleShort: "Health check",
    description: "Get server health status and diagnostics",
    form: {
      title: "Health check options",
      description: "Configure health check parameters",
    },
    fields: {
      detailed: {
        title: "Detailed report",
        description: "Include detailed system information",
      },
      includeDatabase: {
        title: "Include database",
        description: "Include database health checks",
      },
      includeTasks: {
        title: "Include tasks",
        description: "Include task runner health checks",
      },
      includeSystem: {
        title: "Include system",
        description: "Include system resource information",
      },
    },
    widget: {
      refresh: "Run health check",
      health: {
        healthy: "Healthy",
        warning: "Warning",
        critical: "Critical",
        unknown: "Unknown",
      },
      results: {
        pass: "Passed",
        warn: "Warning",
        fail: "Failed",
      },
      checks: {
        traffic: "Traffic readiness",
        process: "Server process",
      },
      messages: {
        draining: "Draining. {{count}} streams still active.",
        accepting: "Accepting traffic. {{count}} active streams.",
        memory: "High memory use ({{usage}}).",
        processOk: "Server is running normally.",
        databaseOk: "Database connection succeeded.",
        databaseFailed: "Database connection failed.",
        tasksDisabled: "The task runner is disabled in this environment.",
        tasksOk: "The task runner is available.",
        systemOk: "System resources are healthy.",
      },
    },
    response: {
      status: {
        title: "Status",
        description: "Overall health status",
      },
      timestamp: {
        title: "Checked at",
        description: "Time of health check",
      },
      uptime: {
        title: "Uptime",
        description: "Time since the server process started",
      },
      revision: {
        title: "Build commit",
      },
      environment: {
        title: "Environment",
        description: "Server environment information",
        name: {
          title: "Environment name",
        },
        nodeEnv: {
          title: "Node environment",
        },
        platform: {
          title: "Platform",
        },
        supportsTaskRunners: {
          title: "Supports Task Runners",
        },
      },
      database: {
        title: "Database Status",
        description: "Database connection status",
        status: {
          title: "Connection Status",
        },
        responseTime: {
          title: "Response Time (ms)",
        },
        error: {
          title: "Error Message",
        },
      },
      tasks: {
        title: "Task Status",
        description: "Task runner status",
        runnerStatus: {
          title: "Runner Status",
        },
        activeTasks: {
          title: "Active Tasks",
        },
        totalTasks: {
          title: "Total Tasks",
        },
        errors: {
          title: "Error Count",
        },
        lastError: {
          title: "Last Error",
        },
      },
      system: {
        title: "System info",
        description: "System resource information",
        memory: {
          title: "Memory Usage",
          description: "System memory information",
          used: {
            title: "Used Memory",
          },
          total: {
            title: "Total Memory",
          },
          percentage: {
            title: "Memory usage %",
          },
        },
        cpu: {
          title: "CPU Usage",
          description: "System CPU information",
          usage: {
            title: "CPU Usage %",
          },
          loadAverage: {
            title: "Load average",
          },
        },
        disk: {
          title: "Disk Usage",
          description: "System disk information",
          available: {
            title: "Available Space",
          },
          total: {
            title: "Total Space",
          },
          percentage: {
            title: "Disk Usage %",
          },
        },
      },
      checks: {
        title: "Health checks",
        description: "Individual component health checks",
        item: {
          title: "Health check",
          description: "Individual health check result",
          name: {
            title: "Check Name",
          },
          status: {
            title: "Check Status",
          },
          message: {
            title: "Check Message",
          },
          duration: {
            title: "Duration (ms)",
          },
        },
      },
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
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
        checkFailed: "Health check failed: {{error}}",
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
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Health check completed successfully",
    },
  },
};
