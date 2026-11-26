export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
  },
  get: {
    title: "Customer invoices",
    titleShort: "Customer invoices",
    description:
      "Search invoices by document number, invoice ID or customer ID, and filter by company or status.",
    form: {
      title: "Invoice filters",
      description: "Filter the invoice list",
    },
    response: {
      customerName: "Customer",
      total: "Total",
      invoices: "Invoices",
      id: "Invoice ID",
      invoiceSequenceNumber: "Invoice number",
      customerId: "Customer ID",
      currency: "Currency",
      status: "Status",
      amount: "Amount",
      dueDate: "Due date",
      notes: "Notes",
      lineCount: "Line count",
      amountPaid: "Amount paid",
      amountDue: "Amount due",
      isOverdue: "Overdue",
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
        description: "Invalid filter parameters",
      },
      server: {
        title: "Server error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Must be a member of this company",
      },
      notFound: {
        title: "Not found",
        description: "Company not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
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
    label: "Page size",
    description: "Results per page",
  },
  widget: {
    creditNote: "Credit note",
    creditable: "Select an invoice to credit",
    noCreditable: "No invoices have credit available.",
    filters: "Filters",
    partlyPaid: "Partly paid",
    pageCount: "Total pages",
    title: "Customer invoices",
    newInvoice: "New invoice",
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
      cta: "New invoice",
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
