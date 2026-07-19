export const translations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  get: {
    title: "AP Bills",
    titleShort: "AP Bills",
    description: "List supplier bills for a company",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check filter parameters",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view bills",
      },
      forbidden: {
        title: "Access Denied",
        description: "You are not a member of this company",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      server: { title: "Server Error", description: "Could not load bills" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network Error", description: "Check your connection" },
      notFound: { title: "Not Found", description: "Company not found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: { title: "Bills Loaded", description: "Supplier bills retrieved" },
    response: {
      totalCount: "Total",
      id: "ID",
      supplierName: "Supplier",
      billNumber: "Bill #",
      billDate: "Bill Date",
      dueDate: "Due Date",
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
  status: {
    label: "Status",
    description: "Filter by bill status",
    placeholder: "Any status",
  },
  page: { label: "Page", description: "Page number" },
  pageSize: { label: "Per Page", description: "Results per page" },
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
    back: "Back",
    title: "Supplier Bills",
    newBill: "Record Bill",
    loading: "Loading bills...",
    empty: {
      title: "No supplier bills",
      hint: "Record a bill when you receive an invoice from a supplier.",
      cta: "Record Bill",
    },
    company: {
      select: "Select Company",
      selected: "Company Selected",
    },
    due: "Due",
    overdue: "Overdue",
    view: "View",
  },
};
