export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate", lines: "lines" },
  post: {
    title: "Remove estimate line",
    titleShort: "Remove line",
    description: "Remove a line item from a draft estimate",
    form: {
      title: "Remove estimate line",
      description: "Remove this line item from the estimate",
    },
    response: {
      estimateId: "Estimate",
      success: "Success",
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
      notFound: { title: "Not found", description: "Line item not found" },
      conflict: {
        title: "Conflict",
        description: "Estimate must be in DRAFT status to remove lines",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Line removed",
      description: "Line item removed from the estimate",
    },
  },
  lineId: { label: "Line ID", description: "The line item to remove" },
  widget: {
    lineTotal: "Line total",
    back: "Back",
    submit: "Remove line",
    removed: "Line item removed from estimate.",
    confirmTitle: "Remove this line item?",
    confirmDescription:
      "This will permanently remove the line item from the estimate. Totals will be recalculated.",
    confirmButton: "Remove",
    cancelButton: "Cancel",
  },
};
