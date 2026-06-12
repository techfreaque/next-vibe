export const translations = {
  get: {
    title: "Credit Purchases",
    titleShort: "Admin Purchases",
    description: "Credit pack purchase history",
    form: {
      title: "Purchase History",
      description: "Browse credit pack purchases",
    },
    searchFilters: {
      title: "Search & Filters",
      description: "Filter purchases",
    },
    search: {
      label: "Search",
      description: "Search by user email",
      placeholder: "Search purchases...",
    },
    packType: {
      label: "Pack Type",
      description: "Filter by credit pack type",
      placeholder: "Any type",
    },
    source: {
      label: "Source",
      description: "Filter by purchase source",
      placeholder: "Any source",
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
      title: "Purchases",
      description: "Credit pack purchase history",
      purchases: {
        id: "ID",
        userEmail: "Email",
        userName: "Name",
        packType: "Type",
        source: "Source",
        originalAmount: "Amount",
        remaining: "Remaining",
        expiresAt: "Expires",
        createdAt: "Purchased",
      },
      totalCount: "Total Purchases",
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
        description: "Unable to retrieve purchases",
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
        description: "No purchases found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes",
      },
    },
    success: { title: "Success", description: "Purchases retrieved" },
  },
  widget: {
    noPurchases: "No credit pack purchases found.",
    noMatchingPurchases: "No purchases match your filters.",
    searchPlaceholder: "Search by email...",
    refresh: "Refresh",
    expired: "Expired",
    neverExpires: "Never",
  },
};
