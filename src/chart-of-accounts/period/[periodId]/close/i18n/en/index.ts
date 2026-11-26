export const translations = {
  post: {
    title: "Close period",
    titleShort: "Close period",
    description:
      "Close an accounting period. Requires no DRAFT journal entries in the period.",
    periodId: {
      label: "Period ID",
      description: "The period to close",
      placeholder: "Period UUID",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation error",
        description: "Invalid period ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "Accountant role required to close periods",
      },
      server: { title: "Server error", description: "Could not close period" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Draft entries exist",
        description: "All journal entries must be posted before closing",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not found", description: "Period not found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Period closed",
      description: "The accounting period has been closed",
    },
    widget: {
      closeNamed: "Close {{name}}",
      draftCount: "Draft journal entries",
      closedLabel: "Closed",
      failedLabel: "Failed",
      confirmTitle: "Close Accounting Period?",
      confirmDescription:
        "Closing this period is permanent. No new journal entries can be posted to a closed period.",
      confirmButton: "Yes, Close Period",
      cancelButton: "Cancel",
    },
  },
  title: "Close period",
  description: "Close an accounting period",
  category: "Chart of Accounts",
  tag: "Period",
};
