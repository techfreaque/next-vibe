export const translations = {
  enums: {
    country: {
      AT: "Austria (ÖKR)",
      DE: "Germany (SKR03)",
      XX: "Generic IFRS",
      SK: "Slovakia (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "Set up the chart of accounts",
    titleShort: "Set up the chart of accounts",
    description:
      "Add the accounts your company needs from a standard template.",
    companyId: {
      label: "Company",
      description: "Choose the company to set up.",
      placeholder: "Choose a company",
    },
    country: {
      label: "Accounting template",
      description: "Choose the account structure to add.",
      placeholder: "Choose a template",
    },
    response: {
      created: "Accounts created",
      skipped: "Existing accounts kept",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to set up a chart of accounts",
      },
      validation: {
        title: "Validation error",
        description: "Check the company and accounting template.",
      },
      forbidden: {
        title: "Forbidden",
        description: "Only company owners and admins can set up accounts",
      },
      server: {
        title: "Server error",
        description: "Try applying the template again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Review setup",
        description:
          "Reload the company’s current accounts before applying the template.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: {
        title: "Template not found",
        description: "No chart of accounts template found for this country",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Chart of accounts ready",
      description:
        "The template was applied. Review the new and existing accounts below.",
    },
    widget: {
      review: "Review the account setup",
      previewLoading: "Looking up existing accounts…",
      previewFailed: "The current account count is unavailable.",
      existing: "Existing accounts: {{count}}.",
      empty: "This company has no accounts yet.",
      consequences:
        "Setup adds missing account codes from the template and preserves existing records.",
      submit: "Add accounts from template",
      back: "Back",
      viewAccounts: "Open chart of accounts",
      viewPeriods: "View accounting periods",
    },
  },
  title: "Chart of accounts setup",
  description: "Initialize company accounts from template",
  category: "Chart of Accounts",
  tag: "Setup",
};
