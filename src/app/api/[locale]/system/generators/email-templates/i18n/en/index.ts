export const translations = {
  post: {
    title: "Generate Email Templates",
    description: "Generate email template registry with lazy loading",
    container: {
      title: "Email Template Generator Configuration",
    },
    success: {
      title: "Generation Complete",
      description: "Email templates generated successfully",
    },
    fields: {
      outputFile: {
        label: "Output File",
        description: "Path to generated registry file",
      },
      dryRun: {
        label: "Dry Run",
        description: "Preview changes without writing files",
      },
      success: {
        title: "Success",
      },
      message: {
        title: "Result Message",
      },
      templatesFound: {
        title: "Templates Found",
      },
      duration: {
        title: "Generation Duration (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid email template generator parameters",
      },
      network: {
        title: "Network Error",
        description: "Network error during template generation",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to generate templates",
      },
      forbidden: {
        title: "Forbidden",
        description: "Template generation is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Template directory not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to generate email templates",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during generation",
      },
    },
  },
  success: {
    generated: "Email template registry generated successfully",
  },
};
