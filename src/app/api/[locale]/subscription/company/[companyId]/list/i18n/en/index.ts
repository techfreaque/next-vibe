export const translations = {
  tags: {
    subscription: "Subscription",
    company: "Company",
    list: "List",
  },
  get: {
    title: "Company Subscriptions",
    description: "List all subscriptions for a company",
    companyId: {
      label: "Company ID",
      description: "The company whose subscriptions to list",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid company ID",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to list company subscriptions",
      },
      forbidden: {
        title: "Access Denied",
        description: "You do not have access to this company's subscriptions",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Check your connection and try again",
      },
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
      title: "Subscriptions Loaded",
      description: "Company subscriptions retrieved",
    },
  },
};
