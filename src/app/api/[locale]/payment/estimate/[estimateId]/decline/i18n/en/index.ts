export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Decline Estimate",
    titleShort: "Decline Estimate",
    description: "Mark estimate as declined by customer",
    form: {
      title: "Decline Estimate",
      description: "Mark estimate as declined by customer",
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
      notFound: { title: "Not Found", description: "Estimate not found" },
      conflict: {
        title: "Conflict",
        description: "Cannot perform action in current status",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Mark estimate as declined by customer",
    },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to act on" },
  widget: {
    back: "Back",
    submit: "Decline Estimate",
    declined: "Estimate marked as declined.",
    confirmTitle: "Decline this estimate?",
    confirmDescription:
      "This will mark the estimate as declined. This action cannot be undone.",
    confirmButton: "Decline",
    cancelButton: "Cancel",
  },
};
