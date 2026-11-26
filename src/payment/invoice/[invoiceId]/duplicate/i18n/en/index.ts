export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Duplicate invoice",
    titleShort: "Duplicate invoice",
    description:
      "Clone an existing invoice into a new DRAFT. Copies all line items, customer, company, and currency. Gets a new invoice number and today's date.",
    form: {
      title: "Duplicate invoice",
      description: "Creates a new draft invoice from this one",
    },
    response: {
      success: "Invoice duplicated",
      message: "Status message",
      invoice: {
        title: "New invoice",
        subtitle: "Duplicated draft invoice",
        id: "Invoice",
        companyId: "Company",
        customerId: "Customer",
        invoiceSequenceNumber: "Invoice number",
        currency: "Currency",
        status: "Status",
        dueDate: "Due date",
        notes: "Notes",
        amount: "Amount",
        createdAt: "Created",
        updatedAt: "Updated",
      },
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
        description: "Access forbidden",
      },
      notFound: {
        title: "Not found",
        description: "Invoice not found",
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
      description: "Invoice duplicated as a new draft",
    },
  },
  invoiceId: {
    label: "Invoice",
    description: "ID of the invoice to duplicate",
    placeholder: "Enter invoice ID",
  },
  widget: {
    duplicate: "Duplicate",
    cancel: "Cancel",
    loading: "Loading invoice",
    total: "Total",
    duplicateNote:
      "A new draft is created with the same customer, currency and lines. It gets its own number when you issue it.",
    back: "Back",
    submit: "Duplicate invoice",
    duplicated: "Invoice duplicated",
    invoiceNumber: "Invoice #",
    viewDuplicate: "Open the copy",
  },
};
