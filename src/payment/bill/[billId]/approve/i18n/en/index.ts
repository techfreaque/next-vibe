export const translations = {
  receiveBill: "Mark bill received",
  supplierDocument: {
    confirmMissing: "Confirm no supplier document is available",
    confirmSeparate: "Confirm this is a separate charge",
    missingHelp:
      "Check the bank evidence. Approval records the gross cost without deductible VAT.",
    required:
      "Link the supplier document or confirm that it is unavailable. A bank-only approval requires the verified gross amount and no VAT entry.",
    possibleDuplicate:
      "A bank draft or supplier document has matching details. Link the document or confirm this is a separate charge.",
  },
  reverseCharge: {
    title: "Reverse charge (optional)",
    base: "Taxable base in bill currency",
    rate: "VAT rate (%)",
    help: "For a received German small-business bill, enter both values only after confirming that reverse charge applies. The charge is booked as a cost and VAT payable.",
    invalid:
      "Enter a confirmed base and rate on a received bill under the German small-business regime.",
    cost: "Non-deductible reverse-charge VAT",
  },
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
    title: "Review bill status",
    titleShort: "Review bill status",
    description: "Updates the status of a draft or received supplier bill.",
    billId: { label: "Bill ID", description: "The bill to approve" },
    errors: {
      existingPosting:
        "Reconcile the existing posting for this bill before approving it.",
      lineTotalsReview:
        "The lines differ from the recorded net, VAT or gross total. Review the original supplier document before approving.",
      billLines:
        "Add bill lines with a positive total and use active expense accounts from this company.",
      posting:
        "Check the bill totals, company currency, accounting period and posting accounts.",
      validation: { title: "Validation error", description: "Invalid bill ID" },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to approve bills",
      },
      forbidden: {
        title: "Access denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Already approved",
        description: "Bill is already approved or paid",
      },
      server: {
        title: "Server error",
        description: "Could not approve the bill",
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
    success: {
      title: "Bill approved",
      description: "Bill status advanced successfully",
    },
    response: {
      status: "New status",
      journalEntryId: "Journal entry ID",
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
