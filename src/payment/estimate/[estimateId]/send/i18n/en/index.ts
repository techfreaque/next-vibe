export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Mark estimate as sent",
    titleShort: "Mark estimate as sent",
    description: "Mark estimate as sent to customer",
    form: {
      title: "Mark estimate as sent",
      description: "Mark estimate as sent to customer",
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
      description: "Mark estimate as sent to customer",
    },
  },
  estimateId: { label: "Estimate ID", description: "The estimate to act on" },
  widget: {
    back: "Back",
    submit: "Mark as sent",
    sent: "Estimate marked as sent to customer.",
    sendNote: "Confirm that you have sent this estimate to the customer.",
  },
};
