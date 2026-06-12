export const translations = {
  category: "Estimates",
  tags: {
    payment: "payment",
    estimate: "estimate",
    list: "list",
  },
  get: {
    title: "Estimates",
    titleShort: "Estimates",
    description: "Get a paginated list of estimates for a company",
    form: {
      title: "Estimate Filters",
      description: "Filter and paginate estimates",
    },
    response: {
      totalCount: "Total count",
      id: "Estimate ID",
      estimateNumber: "Estimate Number",
      status: "Status",
      customerId: "Customer ID",
      customerName: "Customer Name",
      currency: "Currency",
      total: "Total",
      validUntil: "Valid Until",
      lineCount: "Line Count",
      createdAt: "Created At",
      updatedAt: "Updated At",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid parameters",
      },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      notFound: { title: "Not Found", description: "Company not found" },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Estimates retrieved",
    },
  },
  companyId: {
    label: "Company ID",
    description: "Filter by company",
    placeholder: "Enter company ID",
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
    label: "Page Size",
    description: "Items per page",
  },
  widget: {
    back: "Back",
    title: "Estimates",
    newEstimate: "New Estimate",
    loading: "Loading estimates...",
    noEstimates: "No estimates yet.",
    noEstimatesHint: "Create your first estimate to get started.",
    empty: {
      title: "No estimates yet.",
      hint: "Create your first estimate to get started.",
      cta: "New Estimate",
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
