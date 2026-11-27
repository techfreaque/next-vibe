export const translations = {
  post: {
    title: "Deactivate account",
    titleShort: "Deactivate",
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
        title: "Validation error",
        description: "Invalid account ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "System accounts cannot be deactivated",
      },
      server: {
        title: "Server error",
        description: "Could not deactivate account",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Has transactions",
        description:
          "Cannot deactivate an account that has journal entry lines",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not found", description: "Account not found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Account deactivated",
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
  title: "Deactivate account",
  description: "Soft-deactivate an account",
  category: "Chart of Accounts",
  tag: "Account",
};
