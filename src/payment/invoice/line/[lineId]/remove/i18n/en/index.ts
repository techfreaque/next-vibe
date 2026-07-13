export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "Remove Invoice Line",
    titleShort: "Remove Line",
    description: "Remove a line item from a draft invoice",
    form: {
      title: "Remove Line",
      description: "Permanently removes this line from the invoice",
    },
    response: {
      success: "Line removed",
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
        description: "Line item not found",
      },
      conflict: {
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
    back: "Back",
    submit: "Remove Line",
    warning: "This will permanently remove the line item from the invoice.",
    confirm: "Remove Line",
    removed: "Line item removed",
  },
};
