export const translations = {
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  post: {
    title: "Pay Bill",
    titleShort: "Pay Bill",
    description:
      "Mark an approved bill as paid and post the payment journal entry",
    billId: { label: "Bill ID", description: "The bill to mark as paid" },
    errors: {
      validation: { title: "Validation Error", description: "Invalid input" },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to pay bills",
      },
      forbidden: {
        title: "Access Denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Invalid Status",
        description: "Bill must be APPROVED before payment",
      },
      server: {
        title: "Server Error",
        description: "Could not record the payment",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network Error", description: "Check your connection" },
      notFound: {
        title: "Bill Not Found",
        description: "This bill does not exist",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: { title: "Bill Paid", description: "Bill marked as paid" },
    response: {
      status: "Status",
      paidAt: "Paid At",
    },
    widget: {
      back: "Back",
      submit: "Mark as Paid",
      paymentRecorded: "Payment recorded",
    },
  },
  accountNodeId: {
    label: "Bank / Cash Account",
    description: "Account node used to pay (Bank or Cash)",
    placeholder: "Account UUID",
  },
  paidAt: {
    label: "Payment Date",
    description: "Date the payment was made",
    placeholder: "2024-01-31",
  },
};
