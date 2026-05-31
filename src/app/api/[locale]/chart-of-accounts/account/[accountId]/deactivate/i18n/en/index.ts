export const translations = {
  post: {
    title: "Deactivate Account",
    description:
      "Soft-deactivate an account. Cannot deactivate system accounts or accounts with posted journal entry lines.",
    accountId: {
      label: "Account ID",
      description: "The account to deactivate",
      placeholder: "Account UUID",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation Error",
        description: "Invalid account ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "System accounts cannot be deactivated",
      },
      server: {
        title: "Server Error",
        description: "Could not deactivate account",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Has Transactions",
        description:
          "Cannot deactivate an account that has journal entry lines",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not Found", description: "Account not found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Account Deactivated",
      description: "The account is now inactive",
    },
    widget: {
      confirmWarning:
        "This account will be deactivated. This action cannot be undone for accounts with posted transactions.",
      doneLabel: "Done",
      confirmTitle: "Deactivate Account?",
      confirmDescription:
        "This account will be deactivated and can no longer be used for new journal entries. Existing entries are not affected.",
      confirmButton: "Yes, Deactivate",
      cancelButton: "Cancel",
    },
  },
  title: "Deactivate Account",
  description: "Soft-deactivate an account",
  category: "Chart of Accounts",
  tag: "Account",
};
