export const translations = {
  category: "Server Management",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Rebuild & Restart",
    description:
      "Rebuild the application and hot-restart the running Next.js server without full downtime",
    form: {
      title: "Rebuild Configuration",
      description: "Configure rebuild and restart options",
    },
    fields: {
      generate: {
        title: "Generate Code",
        description: "Run code generation before building",
      },
      nextBuild: {
        title: "Next.js Build",
        description: "Run Next.js production build",
      },
      migrate: {
        title: "Run Migrations",
        description: "Run database migrations after build",
      },
      seed: {
        title: "Run Seeding",
        description: "Run database seeding after migrations",
      },
      restart: {
        title: "Restart Server",
        description:
          "Send SIGUSR1 to the running vibe start process to hot-restart Next.js",
      },
      force: {
        title: "Force Rebuild",
        description: "Continue rebuild even if errors occur",
      },
      success: {
        title: "Rebuild Successful",
      },
      output: {
        title: "Rebuild Output",
      },
      duration: {
        title: "Rebuild Duration (ms)",
      },
      errors: {
        title: "Rebuild Errors",
      },
      restarted: {
        title: "Server Restarted",
      },
    },
    errors: {
      validation: {
        title: "Validation Failed",
        description: "Invalid rebuild parameters provided",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed during rebuild",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to rebuild the application",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to rebuild the application",
      },
      notFound: {
        title: "Not Found",
        description: "Rebuild resources not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred during rebuild",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred during rebuild",
      },
      conflict: {
        title: "Conflict",
        description: "A rebuild is already in progress",
      },
    },
    success: {
      title: "Rebuild Complete",
      description: "Application rebuilt and server restarted successfully",
    },
  },
};
