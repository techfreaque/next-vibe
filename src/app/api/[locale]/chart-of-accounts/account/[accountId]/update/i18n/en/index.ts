export const translations = {
  patch: {
    title: "Edit Account",
    description:
      "Update account name, description, or sort order. Type and subtype cannot be changed on system accounts.",
    accountId: {
      label: "Account",
      description: "The account to edit",
      placeholder: "Account UUID",
    },
    code: {
      label: "Code",
      description: "Account code",
    },
    type: {
      label: "Type",
      description: "Account type",
    },
    subtype: {
      label: "Subtype",
      description: "Account subtype",
    },
    isSystem: {
      label: "System account",
      description: "Whether this is a system account",
    },
    isActive: {
      label: "Active",
      description: "Whether this account is active",
    },
    name: {
      label: "Account Name",
      description: "Display name for this account",
      placeholder: "e.g. Accounts Receivable",
    },
    accountDescription: {
      label: "Description",
      description: "Optional notes about this account's purpose",
      placeholder: "e.g. Tracks amounts owed by customers",
    },
    sortOrder: {
      label: "Sort Order",
      description:
        "Display order within the parent group — lower numbers appear first",
      placeholder: "e.g. 10",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation Error",
        description: "Check all fields",
      },
      forbidden: {
        title: "Forbidden",
        description: "Cannot modify system account fields",
      },
      server: {
        title: "Server Error",
        description: "Could not update account",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
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
    success: { title: "Account Updated", description: "Changes saved" },
    widget: {
      savedLabel: "Saved",
      failedLabel: "Failed",
      back: "Back",
      submit: "Save Changes",
      viewAccount: "View Account",
      successTitle: "Changes saved",
      successDesc: "The account has been updated.",
      systemNotice: "System account — type and subtype are locked.",
      inactiveNotice: "This account is inactive.",
      selectPrompt: "Choose an account to edit",
    },
  },
  title: "Edit Account",
  description: "Edit account details",
  category: "Chart of Accounts",
  tag: "Account",
};
