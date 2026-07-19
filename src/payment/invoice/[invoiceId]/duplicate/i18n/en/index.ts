export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Duplicate Invoice",
    titleShort: "Duplicate Invoice",
    description:
      "Clone an existing invoice into a new DRAFT. Copies all line items, customer, company, and currency. Gets a new invoice number and today's date.",
    form: {
      title: "Duplicate Invoice",
      description: "Creates a new draft invoice from this one",
    },
    response: {
      success: "Invoice duplicated",
      message: "Status message",
      invoice: {
        title: "New Invoice",
        subtitle: "Duplicated draft invoice",
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
        description: "Invalid parameters",
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
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Invoice not found",
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
      description: "Invoice duplicated as a new draft",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to duplicate",
    placeholder: "Enter invoice ID",
  },
  widget: {
    back: "Back",
    submit: "Duplicate Invoice",
    duplicated: "Invoice duplicated",
    invoiceNumber: "Invoice #",
    viewDuplicate: "View Duplicate",
  },
};
