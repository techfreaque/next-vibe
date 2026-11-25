export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  get: {
    title: "Customer Invoices",
    titleShort: "Customer Invoices",
    description:
      "Search invoices by document number, invoice ID or customer ID, and filter by company or status.",
    form: {
      title: "Invoice Filters",
      description: "Filter the invoice list",
    },
    response: {
      customerName: "Customer",
      total: "Total",
      invoices: "Invoices",
      id: "Invoice ID",
      invoiceSequenceNumber: "Invoice Number",
      customerId: "Customer ID",
      currency: "Currency",
      status: "Status",
      amount: "Amount",
      dueDate: "Due Date",
      notes: "Notes",
      lineCount: "Line Count",
      amountPaid: "Amount Paid",
      amountDue: "Amount Due",
      isOverdue: "Overdue",
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
        description: "Invalid filter parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Must be a member of this company",
      },
      notFound: {
        title: "Not Found",
        description: "Company not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Invoice list retrieved",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "Draft",
      open: "Open",
      paid: "Paid",
      void: "Void",
      uncollectible: "Uncollectible",
    },
  },
  companyId: {
    label: "Company ID",
    description: "Filter invoices for this company",
    placeholder: "Enter company ID",
  },
  search: {
    label: "Search documents",
    description: "Search by invoice number, customer name or ID.",
    placeholder: "Invoice number or customer",
  },
  status: {
    label: "Status",
    description:
      "Filter by invoice status or show overdue invoices with an outstanding balance.",
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
    description: "Results per page",
  },
  widget: {
    filters: "Filters",
    partlyPaid: "Partly paid",
    pageCount: "Total pages",
    title: "Customer Invoices",
    newInvoice: "New Invoice",
    loading: "Loading invoices...",
    noInvoices: "No invoices yet.",
    noInvoicesHint: "Create your first invoice to get started.",
    overdue: "Overdue",
    due: "Due",
    lines: "lines",
    line: "line",
    view: "View",
    back: "Back",
    empty: {
      title: "No invoices yet.",
      hint: "Create your first invoice to get started.",
      cta: "New Invoice",
    },
    status: {
      draft: "Draft",
      open: "Open",
      paid: "Paid",
      void: "Void",
      uncollectible: "Uncollectible",
    },
  },
};
