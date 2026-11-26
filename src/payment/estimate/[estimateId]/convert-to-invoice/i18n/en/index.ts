export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate", invoice: "invoice" },
  post: {
    title: "Convert estimate to invoice",
    titleShort: "Convert to invoice",
    description: "Convert an accepted estimate into a draft invoice",
    form: {
      title: "Convert to invoice",
      description: "Convert this estimate to an invoice",
    },
    response: {
      success: "Converted to invoice",
      message: "Status message",
      invoiceId: "Created invoice ID",
    },
    errors: {
      reconcile:
        "The saved items and estimate total disagree. Duplicate the estimate to review and correct the draft.",
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid parameters",
      },
      server: { title: "Server error", description: "Internal server error" },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      notFound: { title: "Not found", description: "Estimate not found" },
      conflict: {
        title: "Conflict",
        description: "Estimate must be in SENT or ACCEPTED status to convert",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: { title: "Success", description: "Estimate converted to invoice" },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to convert" },
  widget: {
    back: "Back",
    submit: "Convert to invoice",
    converted: "Invoice created from this estimate.",
    savedDraftNumber: "Draft invoice #{{number}} created",
    savedDraft: "Draft invoice created",
    convertedNumber: "Converted from estimate {{number}}.",
    viewInvoice: "Open draft invoice",
    convertNote:
      "A draft invoice will be created with the same line items. The estimate will be marked as converted.",
  },
};
