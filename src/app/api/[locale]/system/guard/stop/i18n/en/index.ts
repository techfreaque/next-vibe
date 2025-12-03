export const translations = {
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
};
