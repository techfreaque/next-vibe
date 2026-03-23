export const translations = {
  category: "Electron",
  tags: {
    electronStart: "Electron Start",
  },
  post: {
    title: "Start Electron App",
    description:
      "Compile main/preload and launch the Electron desktop window (dev mode - no packaging)",
    form: {
      title: "Electron Start Configuration",
      description: "Configure how the Electron app starts",
    },
    response: {
      title: "Response",
      description: "Start response data",
    },
    fields: {
      port: {
        title: "Port",
        description: "Port the vibe server runs on (default: 3000)",
      },
      vibeStart: {
        title: "Run vibe start",
        description:
          "Spawn vibe start in the background before opening the window",
      },
      success: {
        title: "Success",
      },
      output: {
        title: "Output",
      },
      duration: {
        title: "Duration (ms)",
      },
      errors: {
        title: "Errors",
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
      description: "Electron app started",
    },
  },
};
