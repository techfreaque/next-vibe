export const translations = {
  get: {
    title: "Subscriptions",
    titleShort: "Sub List",
    description: "Browse all subscriptions",
    form: {
      title: "Subscription Management",
      description: "Filter and browse subscriptions",
    },
    searchFilters: {
      title: "Search & Filters",
      description: "Filter subscriptions",
    },
    search: {
      label: "Search",
      description: "Search by user email or name",
      placeholder: "Search subscriptions...",
    },
    status: {
      label: "Status",
      description: "Filter by subscription status",
      placeholder: "Select status...",
    },
    interval: {
      label: "Billing Interval",
      description: "Filter by billing interval",
      placeholder: "Any interval",
    },
    provider: {
      label: "Provider",
      description: "Filter by payment provider",
      placeholder: "Any provider",
    },
    dateFrom: {
      label: "From",
      description: "Start date filter",
    },
    dateTo: {
      label: "To",
      description: "End date filter",
    },
    sortingOptions: {
      title: "Sorting",
      description: "Configure result sorting",
    },
    sortBy: {
      label: "Sort By",
      description: "Sort field",
      placeholder: "Select sort field...",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Sort direction",
      placeholder: "Select order...",
    },
    response: {
      title: "Subscriptions",
      description: "Matching subscriptions",
      subscriptions: {
        id: "ID",
        userEmail: "Email",
        userName: "Name",
        planId: "Plan",
        billingInterval: "Interval",
        status: "Status",
        createdAt: "Started",
        currentPeriodEnd: "Period End",
        cancelAtPeriodEnd: "Cancel at End",
        canceledAt: "Canceled At",
        cancellationReason: "Cancel Reason",
        provider: "Provider",
        providerSubscriptionId: "Provider ID",
      },
      totalCount: "Total Subscriptions",
      pageCount: "Total Pages",
    },
    page: { label: "Page" },
    limit: { label: "Per Page" },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Login required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server Error",
        description: "Unable to retrieve subscriptions",
      },
      unknown: {
        title: "Unknown Error",
        description: "Unexpected error",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Unable to connect",
      },
      notFound: {
        title: "Not Found",
        description: "No subscriptions found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: { title: "Success", description: "Subscriptions retrieved" },
  },
  widget: {
    noSubscriptions: "No subscriptions found.",
    noMatchingSubscriptions: "No subscriptions match your filters.",
    searchPlaceholder: "Search by email or name...",
    refresh: "Refresh",
    viewStats: "Statistics",
  },
  enums: {
    subscriptionStatusFilter: {
      all: "All",
      active: "Active",
      trialing: "Trialing",
      pastDue: "Past Due",
      canceled: "Canceled",
      unpaid: "Unpaid",
      paused: "Paused",
    },
    billingIntervalFilter: {
      any: "Any",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    providerFilter: {
      any: "Any",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      createdAt: "Created At",
      status: "Status",
      interval: "Interval",
      userEmail: "User Email",
    },
    sortOrder: {
      asc: "Ascending",
      desc: "Descending",
    },
  },
};
