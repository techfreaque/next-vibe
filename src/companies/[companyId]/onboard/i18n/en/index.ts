export const translations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Germany (DE)",
      XX: "Generic chart (set tax rates manually)",
      SK: "Slovakia (SK)",
    },
  },
  tags: { companies: "companies", onboard: "onboard", setup: "setup" },
  post: {
    title: "Set up accounting",
    titleShort: "Set up accounting",
    description:
      "Install your chart of accounts and prepare cash and bank accounts for posting.",
    companyId: { label: "Company", description: "Company" },
    country: {
      genericPreview:
        "Adds a generic chart. Set tax rates before issuing invoices.",
      regionalPreview: "Uses the country’s chart of accounts and VAT presets.",
      label: "Accounting template",
      description:
        "Choose Austria or Germany for a company registered there. Choose the generic chart for other countries.",
      placeholder: "Choose a template",
    },
    period: {
      title: "First accounting period",
      open: "Open this period during setup",
      description:
        "The default is this month. Change the dates to use a custom or annual period.",
      name: "Period name",
      start: "Start date",
      end: "End date",
      proposal: "Proposed period {{name}}, {{start}} to {{end}}",
      kept: "Your existing fiscal calendar stays in place.",
      invalid:
        "Enter a period name and an end date on or after the start date.",
      opened: "{{name}} is open for posting.",
      view: "View accounting periods",
      viewHint: "Review your fiscal calendar.",
      createHint: "Choose dates before posting the first entry.",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Check all fields",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to onboard a company",
      },
      forbidden: { title: "Access denied", description: "Admin role required" },
      conflict: {
        title: "The existing chart uses a different country template",
        description:
          "Review the existing chart before changing the accounting template.",
      },
      profileMismatch:
        "Choose the accounting template for the country on the company profile.",
      server: {
        title: "Server error",
        description: "Could not complete onboarding",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network error", description: "Check your connection" },
      notFound: {
        title: "Company not found",
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Accounting setup complete",
      description:
        "The chart is ready. You can open a period and start creating documents.",
    },
    widget: {
      books: "Books setup",
      setupCounts:
        "Chart accounts ready {{accounts}} · Tax rates added {{rates}}",
      invoiceHint:
        "Prepare a draft for this company. You can review it before issuing.",
      submit: "Set up accounting",
      company: "Company: {{name}}",
      back: "Back",
      cashAndBankReady: "Cash and bank accounts are ready for posting.",
      nextHint: "Open an accounting period before posting entries.",
      period: "Create a period",
      invoice: "Create an invoice draft",
    },
    response: {
      accountsCreated: "Accounts added",
      accountsSkipped: "Existing accounts",
      taxRatesCreated: "Tax rates added",
      cashAccountId: "Cash Account ID",
      bankAccountId: "Bank Account ID",
      success: "Success",
    },
  },
};
