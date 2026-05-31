export const translations = {
  get: {
    title: "Subscription Overview",
    description: "Your subscription at a glance",
    errors: {
      unauthorized: {
        title: "Sign In Required",
        description: "Please sign in to view your subscription",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to view this",
      },
      server: {
        title: "Server Error",
        description: "Unable to load subscription data",
      },
      unknown: {
        title: "Unknown Error",
        description: "Something unexpected happened",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Connection Error",
        description: "Check your internet connection",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Loaded",
      description: "Subscription data loaded",
    },
    response: {
      activeCount: "Active",
      cancelingCount: "Canceling",
      trialCount: "Trial",
      totalCount: "Total",
    },
  },
  widget: {
    actions: "Quick Actions",
    mySubscription: "My Subscription",
    manage: "Manage",
    refresh: "Refresh",
    noData: "No subscription data available",
  },
};
