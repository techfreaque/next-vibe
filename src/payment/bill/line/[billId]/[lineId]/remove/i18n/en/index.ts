export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    bill: "bill",
    lines: "lines",
  },
  post: {
    title: "Remove bill line",
    titleShort: "Remove Line",
    description: "Remove a line from a supplier bill draft",
    form: {
      title: "Remove Line",
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
        title: "Validation Error",
        description: "Invalid parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Line item not found",
      },
      conflict: {
        title: "Conflict",
        description:
          "This line can only be removed from an editable supplier bill draft.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
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
    submit: "Remove Line",
    warning:
      "This permanently removes the line and recalculates the draft total.",
    confirm: "Remove Line",
    removed: "Line item removed",
  },
};
