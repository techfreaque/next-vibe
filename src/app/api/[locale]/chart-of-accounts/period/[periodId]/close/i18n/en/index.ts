export const translations = {
  post: {
    title: "Close Period",
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
        title: "Validation Error",
        description: "Invalid period ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "Accountant role required to close periods",
      },
      server: { title: "Server Error", description: "Could not close period" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Draft Entries Exist",
        description: "All journal entries must be posted before closing",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not Found", description: "Period not found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Period Closed",
      description: "The accounting period has been closed",
    },
    widget: {
      closedLabel: "Closed",
      failedLabel: "Failed",
      confirmTitle: "Close Accounting Period?",
      confirmDescription:
        "Closing this period is permanent. No new journal entries can be posted to a closed period.",
      confirmButton: "Yes, Close Period",
      cancelButton: "Cancel",
    },
  },
  title: "Close Period",
  description: "Close an accounting period",
  category: "Chart of Accounts",
  tag: "Period",
};
