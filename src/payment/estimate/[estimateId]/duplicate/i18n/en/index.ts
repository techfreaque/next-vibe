export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Duplicate Estimate",
    titleShort: "Duplicate Estimate",
    description: "Clone this estimate to a new draft",
    form: {
      title: "Duplicate Estimate",
      description: "Clone this estimate to a new draft",
    },
    response: {
      success: "Success",
      message: "Status message",
      newEstimateId: "New estimate ID",
      estimateNumber: "New estimate number",
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
      title: "Estimate Duplicated",
      description: "A new draft estimate has been created",
    },
  },
  estimateId: {
    label: "Estimate ID",
    description: "The estimate to duplicate",
  },
  widget: {
    back: "Back",
    submit: "Duplicate Estimate",
    viewDuplicate: "View Duplicate",
    duplicateNote:
      "A new draft estimate will be created with the same lines and details.",
  },
};
