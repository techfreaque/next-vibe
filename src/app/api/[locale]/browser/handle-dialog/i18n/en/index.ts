/**
 * Handle Dialog Tool translations (English)
 */

export const translations = {
  title: "Handle Dialog",
  description: "Handle a browser dialog (alert, confirm, prompt)",

  form: {
    label: "Handle Browser Dialog",
    description: "Accept or dismiss a browser dialog",
    fields: {
      action: {
        label: "Action",
        description: "Whether to dismiss or accept the dialog",
        placeholder: "Select action",
        options: {
          accept: "Accept",
          dismiss: "Dismiss",
        },
      },
      promptText: {
        label: "Prompt Text",
        description: "Optional prompt text to enter into the dialog",
        placeholder: "Enter prompt text (optional)",
      },
    },
  },

  response: {
    success: "Dialog handling operation successful",
    result: "Dialog handling result",
    error: "Error message",
    executionId: "Execution ID for tracking",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    network: {
      title: "Network Error",
      description:
        "A network error occurred during the dialog handling operation",
    },
    unauthorized: {
      title: "Unauthorized",
      description:
        "You are not authorized to perform dialog handling operations",
    },
    forbidden: {
      title: "Forbidden",
      description: "Dialog handling operation is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    serverError: {
      title: "Server Error",
      description:
        "An internal server error occurred during the dialog handling operation",
    },
    unknown: {
      title: "Unknown Error",
      description:
        "An unknown error occurred during the dialog handling operation",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that may be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred during the dialog handling operation",
    },
  },

  success: {
    title: "Dialog Handling Successful",
    description: "The browser dialog was handled successfully",
  },
};
