export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "accounts-receivable",
  },
  post: {
    title: "Create AR Invoice",
    titleShort: "Create Invoice",
    description: "Create a new accounts receivable invoice for a customer",
    form: {
      title: "New Invoice",
      description: "Fill in the invoice details",
    },
    response: {
      success: "Invoice created",
      message: "Status message",
      invoice: {
        title: "Invoice",
        subtitle: "Created invoice",
        id: "Invoice ID",
        companyId: "Company ID",
        customerId: "Customer ID",
        invoiceSequenceNumber: "Invoice Number",
        currency: "Currency",
        status: "Status",
        dueDate: "Due Date",
        notes: "Notes",
        amount: "Amount",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid invoice parameters",
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
        description: "Must be an admin or accountant of this company",
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
      title: "Invoice Created",
      description: "Invoice created in draft status",
    },
    widget: {
      back: "Back",
      submit: "Create Invoice",
      viewButton: "View Invoice",
    },
  },
  companyId: {
    label: "Company ID",
    description: "The company issuing this invoice",
    placeholder: "Enter company ID",
  },
  customerId: {
    label: "Customer ID",
    description: "Optional: UUID of the customer (soft reference to user)",
    placeholder: "Enter customer ID",
  },
  dueDate: {
    label: "Due Date",
    description: "When this invoice is due",
    placeholder: "Select due date",
  },
  currency: {
    label: "Currency",
    description: "Invoice currency",
    placeholder: "EUR",
  },
  notes: {
    label: "Notes",
    description: "Optional notes visible on the invoice",
    placeholder: "e.g. Payment terms: 30 days",
  },
};
