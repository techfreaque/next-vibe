export const translations = {
  dashboard: {
    get: {
      title: "Purchasing Overview",
      description:
        "Live snapshot of purchase orders and supplier activity for your company.",
      widget: {
        kpiDraft: "Drafts",
        kpiConfirmed: "Confirmed",
        kpiAwaitingReceipt: "Awaiting Receipt",
        kpiActiveVendors: "Active Vendors",
        warningDueThisWeek:
          "{{count}} purchase order due this week — check delivery dates",
        warningDueThisWeekPlural:
          "{{count}} purchase orders due this week — check delivery dates",
        navNewPo: "New Purchase Order",
        navAllPos: "All Purchase Orders",
        navVendors: "Vendors",
        navNewVendor: "New Vendor",
        loading: "Loading…",
      },
      companyId: {
        label: "Company",
        description: "Company to show purchasing stats for (optional)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view purchasing overview",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load purchasing overview",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard Loaded",
        description: "Purchasing overview retrieved",
      },
      response: {
        draftCount: "Draft Purchase Orders",
        confirmedCount: "Confirmed Purchase Orders",
        awaitingReceiptCount: "Awaiting Receipt",
        activeVendorCount: "Active Vendors",
        dueThisWeekCount: "Due This Week",
      },
    },
  },
};
