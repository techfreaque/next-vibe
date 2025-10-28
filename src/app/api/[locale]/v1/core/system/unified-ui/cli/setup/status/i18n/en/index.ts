export const translations = {
  post: {
    title: "CLI Installation Status",
    description: "Check the current installation status of the Vibe CLI",
    form: {
      title: "Status Configuration",
      description: "Configure status parameters",
    },
    response: {
      title: "Installation Status",
      description: "Current CLI installation details",
      fields: {
        success: "Operation Status",
        installed: "Installed",
        version: "CLI Version",
        path: "Installation Path",
        message: "Status Message",
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
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
