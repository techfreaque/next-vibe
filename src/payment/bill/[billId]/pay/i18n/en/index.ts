export const translations = {
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  post: {
    title: "Pay bill",
    titleShort: "Pay bill",
    description:
      "Mark an approved bill as paid and post the payment journal entry",
    billId: { label: "Bill", description: "The bill to mark as paid" },
    errors: {
      approvalPosting:
        "This bill needs a posted approval entry before payment.",
      paymentAccount:
        "Choose an active bank or cash account from this company.",
      paymentPosting:
        "Check the payment date, company currency and posting accounts.",
      validation: { title: "Validation error", description: "Invalid input" },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to pay bills",
      },
      forbidden: {
        title: "Access denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Bill cannot be paid",
        description: "Only approved bills can be marked as paid.",
      },
      server: {
        title: "Server error",
        description: "Could not record the payment",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network error", description: "Check your connection" },
      notFound: {
        title: "Bill not found",
        description: "This bill does not exist",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: { title: "Bill paid", description: "Bill marked as paid" },
    response: {
      status: "Status",
      paidAt: "Paid at",
    },
    widget: {
      back: "Back",
      details: "Payment details",
      loadingBill: "Loading bill…",
      retry: "Try again",
      submit: "Mark as paid",
      paymentRecorded: "Payment recorded",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Draft",
      RECEIVED: "Received",
      APPROVED: "Approved",
      PAID: "Paid",
      DISPUTED: "Disputed",
    },
  },
  accountNodeId: {
    label: "Bank or cash account",
    description: "Leave blank to use the default payment account.",
  },
  paidAt: {
    label: "Payment date",
    description: "Date the payment was made",
    placeholder: "2024-01-31",
  },
};
