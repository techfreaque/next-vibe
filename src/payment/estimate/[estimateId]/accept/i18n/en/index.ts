export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Accept Estimate",
    titleShort: "Accept Estimate",
    description: "Mark estimate as accepted by customer",
    form: {
      title: "Accept Estimate",
      description: "Mark estimate as accepted by customer",
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
      description: "Mark estimate as accepted by customer",
    },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to act on" },
  widget: {
    back: "Back",
    submit: "Accept Estimate",
    accepted: "Estimate marked as accepted.",
    confirmMessage: "This will mark the estimate as accepted by the customer.",
  },
};
