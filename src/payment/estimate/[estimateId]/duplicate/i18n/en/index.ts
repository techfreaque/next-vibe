export const translations = {
  category: "Estimates",
  tags: { payment: "payment", estimate: "estimate" },
  post: {
    title: "Duplicate estimate",
    titleShort: "Duplicate estimate",
    description: "Clone this estimate to a new draft",
    form: {
      title: "Duplicate estimate",
      description: "Clone this estimate to a new draft",
    },
    response: {
      success: "Success",
      message: "Status message",
      newEstimateId: "New estimate",
      estimateNumber: "New estimate number",
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
      title: "Estimate duplicated",
      description: "A new draft estimate has been created",
    },
  },
  estimateId: {
    label: "Estimate ID",
    description: "The estimate to duplicate",
  },
  widget: {
    cancel: "Cancel",
    loading: "Loading estimate",
    total: "Total",
    created: "Draft {{number}} created with the same lines.",
    back: "Back",
    submit: "Duplicate estimate",
    viewDuplicate: "Open the copy",
    duplicateNote:
      "A new draft estimate will be created with the same lines and details.",
  },
};
