export const translations = {
  enums: {
    country: {
      AT: "AT — ÖKR",
      DE: "DE — SKR03",
      XX: "XX — IFRS Generic",
    },
  },
  post: {
    title: "Initialize Chart of Accounts",
    titleShort: "Setup",
    description:
      "Set up a company's chart of accounts from a country-specific template. Idempotent — safe to run multiple times.",
    companyId: {
      label: "Company ID",
      description: "The company to initialize the chart of accounts for",
      placeholder: "Enter company UUID",
    },
    country: {
      label: "Country",
      description:
        "Country standard to use (AT = ÖKR, DE = SKR03, XX = IFRS Generic)",
      placeholder: "Select country",
    },
    response: {
      created: "Accounts created",
      skipped: "Accounts skipped (already existed)",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to set up a chart of accounts",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid input — check company ID and country",
      },
      forbidden: {
        title: "Forbidden",
        description: "Only company owners and admins can set up accounts",
      },
      server: {
        title: "Server Error",
        description: "Setup failed — please try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Already Initialized",
        description: "This company already has a chart of accounts",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: {
        title: "Template Not Found",
        description: "No chart of accounts template found for this country",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Chart of Accounts Ready",
      description: "All accounts have been created for the company",
    },
    widget: {
      viewAccounts: "View Account List",
    },
  },
  title: "Chart of Accounts Setup",
  description: "Initialize company accounts from template",
  category: "Chart of Accounts",
  tag: "Setup",
};
