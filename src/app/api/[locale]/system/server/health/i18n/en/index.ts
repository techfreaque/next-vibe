export const translations = {
  tag: "Health",
  get: {
    title: "Health Check",
    description: "Get server health status and diagnostics",
    form: {
      title: "Health Check Options",
      description: "Configure health check parameters",
    },
    fields: {
      detailed: {
        title: "Detailed Report",
        description: "Include detailed system information",
      },
      includeDatabase: {
        title: "Include Database",
        description: "Include database health checks",
      },
      includeTasks: {
        title: "Include Tasks",
        description: "Include task runner health checks",
      },
      includeSystem: {
        title: "Include System",
        description: "Include system resource information",
      },
    },
    response: {
      status: {
        title: "Status",
        description: "Overall health status",
      },
      timestamp: {
        title: "Timestamp",
        description: "Time of health check",
      },
      uptime: {
        title: "Uptime",
        description: "Server uptime in seconds",
      },
      environment: {
        title: "Environment",
        description: "Server environment information",
        name: {
          title: "Environment Name",
        },
        nodeEnv: {
          title: "Node Environment",
        },
        platform: {
          title: "Platform",
        },
        supportsSideTasks: {
          title: "Supports Side Tasks",
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
        title: "System Info",
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
            title: "Memory Usage %",
          },
        },
        cpu: {
          title: "CPU Usage",
          description: "System CPU information",
          usage: {
            title: "CPU Usage %",
          },
          loadAverage: {
            title: "Load Average",
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
        title: "Health Checks",
        description: "Individual component health checks",
        item: {
          title: "Health Check",
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
