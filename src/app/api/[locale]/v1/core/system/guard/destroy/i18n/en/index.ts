export const translations = {
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
      description: "Preview what would be destroyed without actually destroying",
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
};
