export const translations = {
  enums: {
    country: {
      AT: "Austria (AT)",
      DE: "Germany (DE)",
      XX: "Generic (XX)",
    },
  },
  tags: { companies: "companies", onboard: "onboard", setup: "setup" },
  post: {
    title: "Onboard Company",
    titleShort: "Onboard",
    description:
      "Set up a new company: chart of accounts, tax rates, and default bank account",
    companyId: { label: "Company ID", description: "The company to set up" },
    country: {
      label: "Country",
      description:
        "Country determines the tax rates and chart of accounts template",
      placeholder: "DE",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check all fields",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to onboard a company",
      },
      forbidden: { title: "Access Denied", description: "Admin role required" },
      conflict: {
        title: "Already Onboarded",
        description: "Company has already been set up",
      },
      server: {
        title: "Server Error",
        description: "Could not complete onboarding",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network Error", description: "Check your connection" },
      notFound: {
        title: "Company Not Found",
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Company Ready",
      description: "Company set up successfully",
    },
    response: {
      accountsCreated: "Accounts Created",
      accountsSkipped: "Accounts Skipped",
      taxRatesCreated: "Tax Rates Created",
      cashAccountId: "Cash Account ID",
      bankAccountId: "Bank Account ID",
      success: "Success",
    },
  },
};
