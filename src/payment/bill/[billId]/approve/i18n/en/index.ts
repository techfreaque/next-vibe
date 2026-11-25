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
    title: "Review Bill Status",
    titleShort: "Review Bill Status",
    description: "Updates the status of a draft or received supplier bill.",
    billId: { label: "Bill ID", description: "The bill to approve" },
    errors: {
      existingPosting:
        "Reconcile the existing posting for this bill before approving it.",
      billLines:
        "Add bill lines with a positive total and use active expense accounts from this company.",
      posting:
        "Check the bill totals, company currency, accounting period and posting accounts.",
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
      submit: "Confirm status change",
      confirmTitle: "Approve this bill?",
      confirmDescription:
        "A draft moves to Received. Approving a received bill posts a journal entry.",
      confirmButton: "Yes, Approve",
      cancelButton: "Cancel",
      approved: "Bill status updated",
    },
  },
};
