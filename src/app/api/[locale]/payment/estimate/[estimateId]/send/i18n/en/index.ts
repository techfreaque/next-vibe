export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Send Estimate",
    titleShort: "Send Estimate",
    description: "Mark estimate as sent to customer",
    form: {
      title: "Send Estimate",
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
    submit: "Send Estimate",
    sent: "Estimate marked as sent to customer.",
    sendNote:
      "The estimate status will be updated to Sent. The customer can then accept or decline it.",
  },
};
