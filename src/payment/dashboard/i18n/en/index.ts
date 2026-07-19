export const translations = {
  tags: {
    payment: "payment",
    dashboard: "dashboard",
  },
  get: {
    title: "Payment Dashboard",
    titleShort: "Dashboard",
    description: "Overview of invoices, bills, and payment activity",
    form: {
      title: "Dashboard",
      description: "Payment overview for your company",
    },
    response: {
      openInvoices: "Open Invoices",
      overdueInvoices: "Overdue",
      unpaidBills: "Unpaid Bills",
      draftInvoices: "Draft Invoices",
      currency: "Currency",
      recentInvoices: "Recent Invoices",
      openCount: "Open count",
      openTotal: "Open total",
      overdueCount: "Overdue count",
      overdueTotal: "Overdue total",
      unpaidCount: "Unpaid count",
      unpaidTotal: "Unpaid total",
      draftCount: "Draft count",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Network connection error",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Must be a member of this company",
      },
      notFound: {
        title: "Not Found",
        description: "Company not found",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Dashboard data loaded",
    },
  },
  companyId: {
    label: "Company ID",
    description: "The company to show dashboard data for",
    placeholder: "Enter company ID",
  },
  widget: {
    loading: "Loading dashboard...",
    noData: "No company selected.",
    noDataHint: "Select a company to see payment overview.",
    openInvoices: "Open Invoices",
    overdue: "Overdue",
    unpaidBills: "Unpaid Bills",
    draftInvoices: "Drafts",
    quickActions: "Quick Actions",
    newInvoice: "New Invoice",
    allInvoices: "All Invoices",
    newEstimate: "New Estimate",
    allEstimates: "Estimates",
    allBills: "Bills",
    recentInvoices: "Recent Invoices",
    noRecentInvoices: "No recent invoices.",
    view: "View",
    due: "Due",
    status: {
      draft: "Draft",
      open: "Open",
      paid: "Paid",
      void: "Void",
      uncollectible: "Uncollectible",
    },
  },
};
