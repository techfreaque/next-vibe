export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "Remove invoice line",
    titleShort: "Remove line",
    description: "Remove a line item from a draft invoice",
    form: {
      title: "Remove line",
      description: "Permanently removes this line from the invoice",
    },
    response: {
      invoiceId: "Invoice",
      success: "Line removed",
      message: "Status message",
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
        description: "Line item not found",
      },
      conflict: {
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Line item removed from invoice",
    },
  },
  lineId: {
    label: "Line ID",
    description: "ID of the line item to remove",
    placeholder: "Enter line ID",
  },
  widget: {
    lineActions: "Actions",
    remove: "Remove",
    removeNamed: "Remove line {{description}}",
    cancel: "Cancel",
    lineTotal: "Line total",
    back: "Back",
    submit: "Remove line",
    warning: "This will permanently remove the line item from the invoice.",
    confirm: "Remove line",
    removed: "Line item removed",
  },
};
