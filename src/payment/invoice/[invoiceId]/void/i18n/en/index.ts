export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "ar",
  },
  post: {
    title: "Void invoice",
    titleShort: "Void invoice",
    description:
      "Cancel a draft or open invoice. Paid invoices cannot be voided. If a journal entry exists, it is reversed.",
    form: {
      title: "Void invoice",
      description: "This action cannot be undone.",
    },
    response: {
      success: "Invoice voided",
      message: "Status message",
    },
    errors: {
      appliedPayments:
        "An invoice with payments or credits applied cannot be voided.",
      reversalPosting:
        "Check the original posting and an open accounting period before voiding.",
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
        title: "Cannot void",
        description: "Paid invoices cannot be voided",
      },
      unsavedChanges: {
        title: "Unsaved changes",
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
    invoice: "Invoice",
    total: "Invoice total",
    customer: "Customer",
    openInvoice: "Open invoice",
    retry: "Retry",
    loading: "Loading invoice…",
    unavailable: "Invoice unavailable",
    reversal: "A reversal dated today clears the outstanding receivable.",
    cancelOnly: "The invoice will be cancelled.",
    ineligible: "Only a draft or an unpaid, unapplied invoice can be voided.",
    back: "Back",
    submit: "Void invoice",
    warning:
      "This action cannot be undone. The invoice will be permanently cancelled.",
    confirm: "Void invoice",
    voided: "Invoice voided",
    backToList: "Back to invoices",
  },
};
