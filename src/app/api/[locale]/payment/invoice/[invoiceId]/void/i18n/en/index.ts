export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Void Invoice",
    titleShort: "Void Invoice",
    description:
      "Cancel a draft or open invoice. Paid invoices cannot be voided. If a journal entry exists, it is reversed.",
    form: {
      title: "Void Invoice",
      description: "This action cannot be undone.",
    },
    response: {
      success: "Invoice voided",
      message: "Status message",
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
        title: "Cannot Void",
        description: "Paid invoices cannot be voided",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Invoice voided successfully",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "ID of the invoice to void",
    placeholder: "Enter invoice ID",
  },
  widget: {
    back: "Back",
    submit: "Void Invoice",
    warning:
      "This action cannot be undone. The invoice will be permanently cancelled.",
    confirm: "Void Invoice",
    voided: "Invoice voided",
    backToList: "Back to Invoices",
  },
};
