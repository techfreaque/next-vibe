export const translations = {
  category: "System Guard",
  destroy: {
    category: "System Guard",

    title: "Destroy Guard",
    description: "Destroy guard environments and clean up resources",
    tag: "guard-management",
    container: {
      title: "Destroy Guard Configuration",
      description: "Configure parameters for destroying guard environments",
    },
    fields: {
      projectPath: {
        title: "Project Path",
        description: "Path to the project directory",
        placeholder: "/home/user/projects/my-project",
      },
      guardId: {
        title: "Guard ID",
        description: "Unique identifier for the guard",
        placeholder: "guard_my_project_abc123",
      },
      force: {
        title: "Force Destroy",
        description: "Force destroy even if guard is running",
      },
      cleanupFiles: {
        title: "Cleanup Files",
        description: "Remove all guard-related files",
      },
      dryRun: {
        title: "Dry Run",
        description:
          "Preview what would be destroyed without actually destroying",
      },
      success: {
        title: "Success",
      },
      output: {
        title: "Output",
      },
      destroyedGuards: {
        title: "Destroyed Guards",
      },
      warnings: {
        title: "Warnings",
      },
      totalDestroyed: {
        title: "Total Destroyed",
      },
      username: {
        title: "Username",
      },
      wasRunning: {
        title: "Was Running",
      },
      filesRemoved: {
        title: "Files Removed",
      },
      userRemoved: {
        title: "User Removed",
      },
    },
    form: {
      title: "Destroy Configuration",
      description: "Configure destroy parameters",
    },
    response: {
      title: "Response",
      description: "Destroy response data",
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
      internal: {
        title: "Internal Error",
        description: "An internal error occurred",
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
      destruction_failed: {
        title: "Guard Destruction Failed",
        description: "Failed to destroy the guard environment",
      },
      guard_not_found: {
        title: "Guard Not Found",
        description: "No guard environment found for the specified project",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
  start: {
    title: "Start Guard",
    description: "Start guard environments for VSCode projects",
    tag: "Start",
    category: "Guard",
    container: {
      title: "Start Configuration",
      description: "Configure guard start parameters",
    },
    fields: {
      projectPath: {
        title: "Project Path",
        description: "Path to the VSCode project",
        placeholder: "/home/user/projects/my-project",
      },
      guardId: {
        title: "Guard ID",
        description: "Unique identifier for the guard environment",
        placeholder: "guard_my_project_abc123",
      },
      startAll: {
        title: "Start All Guards",
        description: "Start all available guard environments",
      },
      totalStarted: {
        title: "Total Started",
      },
      output: {
        title: "Output",
      },
      startedGuards: {
        columns: {
          username: "Username",
          projectPath: "Project Path",
        },
      },
      summary: {
        title: "Summary",
      },
      status: {
        title: "Status",
      },
      hasIssues: {
        title: "Has Issues",
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
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
      },
      notFound: {
        title: "Not Found",
        description: "Guard environment not found",
      },
      conflict: {
        title: "Conflict",
        description: "Guard environment already started",
      },
    },
    success: {
      title: "Success",
      description: "Guard started successfully",
    },
  },
  status: {
    category: "Guard",
    post: {
      title: "Guard Status",
      description: "Check guard environment status",
      tag: "Status",
      container: {
        title: "Guard Status Configuration",
        description: "Configure status check parameters",
      },
      fields: {
        projectPath: {
          title: "Project Path",
          description: "Path to the guard project",
          placeholder: "/path/to/project",
        },
        guardId: {
          title: "Guard ID",
          description: "Unique identifier for the guard",
          placeholder: "guard-123",
        },
        username: {
          title: "Username",
        },
        status: {
          title: "Status",
        },
        createdAt: {
          title: "Created At",
        },
        securityLevel: {
          title: "Security Level",
        },
        isolationMethod: {
          title: "Isolation Method",
        },
        isRunning: {
          title: "Is Running",
        },
        userHome: {
          title: "User Home",
        },
        listAll: {
          title: "List All Guards",
          description: "List all guard environments",
        },
        success: {
          title: "Success",
        },
        output: {
          title: "Output",
        },
        guards: {
          title: "Guards",
        },
        totalGuards: {
          title: "Total Guards",
        },
        activeGuards: {
          title: "Active Guards",
        },
      },
      form: {
        title: "Status Configuration",
        description: "Configure status parameters",
      },
      response: {
        title: "Response",
        description: "Status response data",
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
        internal: {
          title: "Internal Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Operation completed successfully",
      },
    },
  },
  stop: {
    category: "System Guard",

    title: "Stop Guard",
    description: "Stop guard environments for VSCode projects",
    tag: "guard",

    container: {
      title: "Stop Guard Configuration",
      description: "Configure parameters to stop guard environments",
    },

    fields: {
      projectPath: {
        title: "Project Path",
        description: "Path to the project directory",
        placeholder: "/path/to/your/project",
      },
      guardId: {
        title: "Guard ID",
        description: "Specific guard ID to stop",
        placeholder: "guard_project_abc123",
      },
      username: {
        title: "Username",
      },
      wasRunning: {
        title: "Was Running",
      },
      nowRunning: {
        title: "Now Running",
      },
      pid: {
        title: "Process ID",
      },
      forceStopped: {
        title: "Force Stopped",
      },
      stopAll: {
        title: "Stop All Guards",
        description: "Stop all running guard environments",
      },
      force: {
        title: "Force Stop",
        description: "Force stop even if guard is not responding",
      },
      success: {
        title: "Operation Success",
      },
      output: {
        title: "Command Output",
      },
      stoppedGuards: {
        title: "Stopped Guards",
      },
      totalStopped: {
        title: "Total Stopped",
      },
    },

    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error occurred",
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
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },

    success: {
      title: "Success",
      description: "Guard stop operation completed successfully",
    },
  },
  operations: {
    create: "Create",
    setup: "Setup",
    start: "Start",
    stop: "Stop",
    destroy: "Destroy",
    status: "Status",
    list: "List",
  },
  security: {
    minimal: "Minimal Security",
    standard: "Standard Security",
    strict: "Strict Security",
    maximum: "Maximum Security",
  },
  userTypes: {
    projectUser: "Project User",
    restrictedUser: "Restricted User",
    chrootUser: "Chroot User",
  },
  statusValues: {
    created: "Created",
    running: "Running",
    stopped: "Stopped",
    error: "Error",
    destroyed: "Destroyed",
  },
  isolation: {
    rbash: "Restricted Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
