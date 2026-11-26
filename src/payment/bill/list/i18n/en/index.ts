export const translations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  get: {
    title: "Supplier bills",
    titleShort: "Supplier bills",
    description:
      "Search accounts payable by bill number, supplier name or bill ID, and filter by company or status.",
    errors: {
      validation: {
        title: "Validation error",
        description: "Check filter parameters",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to view bills",
      },
      forbidden: {
        title: "Access denied",
        description: "You are not a member of this company",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      server: { title: "Server error", description: "Could not load bills" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network error", description: "Check your connection" },
      notFound: { title: "Not found", description: "Company not found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: { title: "Bills loaded", description: "Supplier bills retrieved" },
    response: {
      totalCount: "Total",
      id: "ID",
      supplierName: "Supplier",
      billNumber: "Bill #",
      billDate: "Bill date",
      dueDate: "Due date",
      currency: "Currency",
      billTotal: "Amount",
      status: "Status",
      createdAt: "Created",
    },
  },
  companyId: {
    label: "Company",
    description: "Filter by company",
    placeholder: "Company UUID",
  },
  search: {
    label: "Search documents",
    description:
      "Search accounts payable by bill number, supplier name or bill ID, and filter by company or status.",
    placeholder: "Bill number or supplier",
  },
  status: {
    label: "Status",
    description: "Filter by bill status",
    placeholder: "Any status",
  },
  page: { label: "Page", description: "Page number" },
  pageSize: { label: "Per page", description: "Results per page" },
  enums: {
    billStatus: {
      DRAFT: "Draft",
      RECEIVED: "Received",
      APPROVED: "Approved",
      PAID: "Paid",
      DISPUTED: "Disputed",
    },
  },
  widget: {
    filters: "Filters",
    pageCount: "Total pages",
    back: "Back",
    title: "Supplier bills",
    newBill: "Record bill",
    loading: "Loading bills...",
    empty: {
      title: "No supplier bills",
      hint: "Record a bill when you receive an invoice from a supplier.",
      cta: "Record bill",
    },
    company: {
      select: "Select company",
      selected: "Company selected",
    },
    due: "Due",
    overdue: "Overdue",
    view: "View",
  },
};
