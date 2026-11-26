export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Accept estimate",
    titleShort: "Accept estimate",
    description: "Mark estimate as accepted by customer",
    form: {
      title: "Accept estimate",
      description: "Mark estimate as accepted by customer",
    },
    response: { success: "Success", message: "Status message" },
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
      notFound: { title: "Not found", description: "Estimate not found" },
      conflict: {
        title: "Conflict",
        description: "Cannot perform action in current status",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Mark estimate as accepted by customer",
    },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to act on" },
  widget: {
    cancel: "Cancel",
    loading: "Loading estimate",
    unavailable: "Only sent estimates can be accepted.",
    total: "Total",
    back: "Back",
    submit: "Accept estimate",
    accepted: "Estimate marked as accepted.",
    confirmMessage: "This will mark the estimate as accepted by the customer.",
  },
};
