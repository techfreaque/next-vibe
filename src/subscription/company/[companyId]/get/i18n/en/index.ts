export const translations = {
  tags: {
    subscription: "Subscription",
    company: "Company",
    get: "Get",
  },
  view: {
    empty: "No owner subscription",
    emptyHelp: "There is no subscription on your account.",
    status: "Status",
    interval: "Billing interval",
    periodStart: "Current period starts",
    periodEnd: "Current period ends",
    unavailable: "Not recorded",
    provider: "Payment provider",
    cancellation: "Cancellation",
    endOfPeriod: "At the end of the period",
    scheduled: "Scheduled cancellation",
    canceled: "Canceled on",
    ended: "Ended on",
    open: "Open subscription details",
    list: "Back to subscriptions",
  },
  get: {
    title: "Owner’s subscription",
    titleShort: "Owner’s subscription",
    description: "View the company owner’s own subscription.",
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
        description: "Something went wrong. try again",
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
