export const translations = {
  category: "Estimates",
  tags: {
    payment: "payment",
    estimate: "estimate",
    list: "list",
  },
  get: {
    title: "Sales estimates",
    titleShort: "Sales estimates",
    description:
      "Search estimates by reference, customer, email, title or estimate ID, and filter by company or status.",
    form: {
      title: "Estimate filters",
      description: "Filter and paginate estimates",
    },
    response: {
      totalCount: "Total count",
      id: "Estimate ID",
      estimateNumber: "Estimate number",
      status: "Status",
      customerId: "Customer ID",
      customerName: "Customer name",
      currency: "Currency",
      total: "Total",
      validUntil: "Valid until",
      lineCount: "Line count",
      createdAt: "Created at",
      updatedAt: "Updated at",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid parameters",
      },
      server: { title: "Server error", description: "Internal server error" },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      notFound: { title: "Not found", description: "Company not found" },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Estimates retrieved",
    },
  },
  enums: {
    estimateStatus: {
      DRAFT: "Draft",
      SENT: "Sent",
      ACCEPTED: "Accepted",
      DECLINED: "Declined",
      EXPIRED: "Expired",
      CONVERTED: "Converted",
    },
  },
  companyId: {
    label: "Company ID",
    description: "Filter by company",
    placeholder: "Enter company ID",
  },
  search: {
    label: "Search documents",
    description:
      "Search estimates by reference, customer, email, title or estimate ID, and filter by company or status.",
    placeholder: "Estimate number, customer or title",
  },
  status: {
    label: "Status",
    description: "Filter by status",
    placeholder: "All statuses",
  },
  customerId: {
    label: "Customer ID",
    description: "Filter by customer",
    placeholder: "Enter customer ID",
  },
  page: {
    label: "Page",
    description: "Page number",
  },
  pageSize: {
    label: "Page size",
    description: "Items per page",
  },
  widget: {
    filters: "Filters",
    pageCount: "Total pages",
    back: "Back",
    title: "Sales estimates",
    newEstimate: "New estimate",
    loading: "Loading estimates...",
    noEstimates: "No estimates yet.",
    noEstimatesHint: "Create your first estimate to get started.",
    empty: {
      title: "No estimates yet.",
      hint: "Create your first estimate to get started.",
      cta: "New estimate",
    },
    valid: "Valid",
    lines: "lines",
    line: "line",
    view: "View",
    status: {
      draft: "Draft",
      sent: "Sent",
      accepted: "Accepted",
      declined: "Declined",
      expired: "Expired",
      converted: "Converted",
    },
  },
};
