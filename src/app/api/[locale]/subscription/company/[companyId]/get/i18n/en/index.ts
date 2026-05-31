export const translations = {
  tags: {
    subscription: "Subscription",
    company: "Company",
    get: "Get",
  },
  get: {
    title: "Company Subscription",
    description: "Get the active subscription for a company",
    companyId: {
      label: "Company ID",
      description: "The company whose subscription to retrieve",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid company ID",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view company subscriptions",
      },
      forbidden: {
        title: "Access Denied",
        description: "You do not have access to this company's subscription",
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
        title: "No Subscription Found",
        description: "This company has no subscription",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Subscription Loaded",
      description: "Company subscription retrieved",
    },
  },
};
