export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate", invoice: "invoice" },
  post: {
    title: "Convert Estimate to Invoice",
    titleShort: "Convert to Invoice",
    description: "Convert an accepted estimate into a draft invoice",
    form: {
      title: "Convert to Invoice",
      description: "Convert this estimate to an invoice",
    },
    response: {
      success: "Converted to invoice",
      message: "Status message",
      invoiceId: "Created Invoice ID",
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
      notFound: { title: "Not Found", description: "Estimate not found" },
      conflict: {
        title: "Conflict",
        description: "Estimate must be in SENT or ACCEPTED status to convert",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: { title: "Success", description: "Estimate converted to invoice" },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to convert" },
  widget: {
    back: "Back",
    submit: "Convert to Invoice",
    converted: "Invoice created from this estimate.",
    viewInvoice: "View Invoice",
    convertNote:
      "A draft invoice will be created with the same line items. The estimate will be marked as converted.",
  },
};
