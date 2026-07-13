export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate", lines: "lines" },
  post: {
    title: "Remove Estimate Line",
    titleShort: "Remove Line",
    description: "Remove a line item from a draft estimate",
    form: {
      title: "Remove Estimate Line",
      description: "Remove this line item from the estimate",
    },
    response: { success: "Success", message: "Status message" },
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
      notFound: { title: "Not Found", description: "Line item not found" },
      conflict: {
        title: "Conflict",
        description: "Estimate must be in DRAFT status to remove lines",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Line Removed",
      description: "Line item removed from the estimate",
    },
  },
  lineId: { label: "Line ID", description: "The line item to remove" },
  widget: {
    back: "Back",
    submit: "Remove Line",
    removed: "Line item removed from estimate.",
    confirmTitle: "Remove this line item?",
    confirmDescription:
      "This will permanently remove the line item from the estimate. Totals will be recalculated.",
    confirmButton: "Remove",
    cancelButton: "Cancel",
  },
};
