export const translations = {
  patch: {
    title: "Edit account",
    titleShort: "Edit account",
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
      label: "Account name",
      description: "Display name for this account",
      placeholder: "e.g. Accounts Receivable",
    },
    accountDescription: {
      label: "Description",
      description: "Optional notes about this account's purpose",
      placeholder: "e.g. Tracks amounts owed by customers",
    },
    sortOrder: {
      label: "Sort order",
      description: "Lower numbers appear first within the parent group",
      placeholder: "e.g. 10",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation error",
        description: "Check all fields",
      },
      forbidden: {
        title: "Forbidden",
        description: "Cannot modify system account fields",
      },
      server: {
        title: "Server error",
        description: "Could not update account",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
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
    success: { title: "Account updated", description: "Changes saved" },
    widget: {
      savedLabel: "Saved",
      failedLabel: "Failed",
      back: "Back",
      submit: "Save changes",
      sectionDetails: "Details",
      viewAccount: "Open account",
      successTitle: "Changes saved",
      successDesc: "The account has been updated.",
      systemNotice: "System account: type and subtype are locked.",
      inactiveNotice: "This account is inactive.",
      selectPrompt: "Choose an account to edit",
    },
  },
  title: "Edit account",
  description: "Edit account details",
  category: "Chart of Accounts",
  tag: "Account",
};
