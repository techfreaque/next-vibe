export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    bill: "bill",
    lines: "lines",
  },
  post: {
    title: "Remove bill line",
    titleShort: "Remove line",
    description: "Remove a line from a supplier bill draft",
    form: {
      title: "Remove line",
      description: "Removes this line from the draft.",
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
        title: "Validation error",
        description: "Invalid parameters",
      },
      server: {
        title: "Server error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not found",
        description: "Line item not found",
      },
      conflict: {
        title: "Conflict",
        description:
          "This line can only be removed from an editable supplier bill draft.",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "The bill line was removed.",
    },
  },
  billId: {
    label: "Supplier bill",
    description: "Bill whose line will be removed",
  },
  lineId: {
    label: "Line ID",
    description: "ID of the line item to remove",
    placeholder: "Enter line ID",
  },
  widget: {
    verifying: "Checking the selected line…",
    unavailable:
      "This line is no longer available to remove. Reopen the draft and check its current lines.",
    lineGross: "Line gross: {{amount}}",

    back: "Back",
    submit: "Remove line",
    warning:
      "This permanently removes the line and recalculates the draft total.",
    confirm: "Remove line",
    removed: "Line item removed",
  },
};
