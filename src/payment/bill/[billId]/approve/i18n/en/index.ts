export const translations = {
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  enums: {
    billStatus: {
      DRAFT: "Draft",
      RECEIVED: "Received",
      APPROVED: "Approved",
      PAID: "Paid",
      DISPUTED: "Disputed",
    },
  },
  post: {
    title: "Approve Bill",
    titleShort: "Approve Bill",
    description:
      "Advance bill status: DRAFT→RECEIVED→APPROVED and post journal entry",
    billId: { label: "Bill ID", description: "The bill to approve" },
    errors: {
      validation: { title: "Validation Error", description: "Invalid bill ID" },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to approve bills",
      },
      forbidden: {
        title: "Access Denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Already Approved",
        description: "Bill is already approved or paid",
      },
      server: {
        title: "Server Error",
        description: "Could not approve the bill",
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
    success: {
      title: "Bill Approved",
      description: "Bill status advanced successfully",
    },
    response: {
      status: "New Status",
      journalEntryId: "Journal Entry ID",
    },
    widget: {
      back: "Back",
      submit: "Approve Bill",
      confirmTitle: "Approve this bill?",
      confirmDescription:
        "This will advance the bill status. Once approved, a journal entry will be posted.",
      confirmButton: "Yes, Approve",
      cancelButton: "Cancel",
      approved: "Bill approved",
    },
  },
};
