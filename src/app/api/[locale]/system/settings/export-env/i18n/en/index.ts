export const translations = {
  category: "System",
  get: {
    title: "Export Production Env",
    description:
      "Generate a production-ready .env file with decrypted values, deployment instructions, and a checklist",
    tags: {
      exportEnv: "Export Env",
    },
    response: {
      content: {
        title: "Env File Content",
      },
      filename: {
        title: "Filename",
      },
    },
    success: {
      title: "Env Exported",
      description: "Production env file generated successfully",
    },
    widget: {
      copy: "Copy to clipboard",
      copied: "Copied!",
      download: "Download .env.prod",
      instructions:
        "Copy this file to your server and restart the application.",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Settings not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to generate env file",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
};
