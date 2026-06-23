export const translations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  post: {
    title: "Create AP Bill",
    titleShort: "Create Bill",
    description: "Record a bill received from a supplier",
    form: {
      title: "New Supplier Bill",
      description: "Enter the details of the bill you received",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check all fields and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to create bills",
      },
      forbidden: {
        title: "Access Denied",
        description: "You need Accountant or Admin role",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      server: {
        title: "Server Error",
        description: "Could not create the bill — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Check your connection and try again",
      },
      notFound: { title: "Not Found", description: "Resource not found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Bill Created",
      description: "Supplier bill recorded successfully",
    },
    widget: {
      back: "Back",
      submit: "Record Bill",
      viewButton: "View Bill",
      addAnotherButton: "Add Another",
    },
    response: {
      id: "Bill ID",
      companyId: "Company ID",
      supplierName: "Supplier",
      billNumber: "Bill Number",
      billDate: "Bill Date",
      dueDate: "Due Date",
      currency: "Currency",
      subtotal: "Subtotal",
      taxAmount: "Tax",
      total: "Total",
      status: "Status",
      createdAt: "Created",
      updatedAt: "Updated",
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
  companyId: {
    label: "Company",
    description: "The company receiving this bill",
    placeholder: "Company UUID",
  },
  supplierName: {
    label: "Supplier Name",
    description: "Name of the supplier who sent this bill",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "Supplier VAT Number",
    description: "Supplier VAT/tax identification number",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Bill Number",
    description: "Supplier's invoice/bill reference number",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Bill Date",
    description: "Date the bill was issued",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Due Date",
    description: "Payment due date",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Currency",
    description: "Bill currency",
    placeholder: "EUR",
  },
  notes: {
    label: "Notes",
    description: "Internal notes about this bill",
    placeholder: "Optional notes",
  },
};
