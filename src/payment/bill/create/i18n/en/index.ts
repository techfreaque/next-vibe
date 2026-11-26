export const translations = {
  tags: {
    payment: "payment",
    bill: "bill",
    ap: "accounts-payable",
  },
  post: {
    title: "New supplier bill",
    titleShort: "New supplier bill",
    description: "Record the supplier and lines, then save a draft.",
    form: {
      title: "New supplier bill",
      description: "Enter the details of the bill you received",
    },
    errors: {
      vendor: "Choose an active supplier from this company.",
      supplier: "Enter a supplier name or choose a supplier.",
      dates: "Enter a valid bill date and due date.",
      amounts:
        "Check the line values and keep the bill total within the supported amount.",
      expenseAccount: "Choose an active expense account from this company.",

      validation: {
        title: "Validation error",
        description: "Check all fields and try again",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to create bills",
      },
      forbidden: {
        title: "Access denied",
        description: "You need Accountant or Admin role",
      },
      conflict: {
        title: "Conflict",
        description:
          "A bill already uses this supplier and invoice number. Check the existing bill before creating another.",
      },
      server: {
        title: "Server error",
        description: "Could not create the bill. Try again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network error",
        description: "Check your connection and try again",
      },
      notFound: { title: "Not found", description: "Resource not found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Bill created",
      description: "Supplier bill recorded successfully",
    },
    widget: {
      supplier: "Supplier",
      dates: "Dates and currency",
      items: "Bill lines",
      itemsDescription:
        "Optional lines. Enter the VAT rate as a decimal from 0 to 1.",
      itemsHint: "Add the goods or services on this bill.",
      item: "Description",
      quantity: "Quantity",
      unitPrice: "Unit price",
      manualTaxRate: "Other rate",
      taxRate: "VAT %",
      lineTotal: "Line total",
      addItem: "Add line",
      removeItem: "Remove line",
      itemError: "Check the description, quantity, price and VAT rate.",
      supplierTotalReview:
        "Compare this total with the supplier’s invoice. If it differs, review the original document before saving.",
      summary: "Bill summary",
      net: "Net",
      tax: "VAT",
      total: "Total",
      chooseVendor: "Choose supplier",
      vendorSource: "From the supplier directory",
      terms: "Use supplier terms",
      manualVendor: "Enter supplier manually",
      selectCompanyFirst:
        "Select a company before choosing a directory supplier.",

      back: "Back",
      submit: "Save draft",
      viewButton: "View bill",
      addAnotherButton: "Add another",
    },
    response: {
      id: "Bill ID",
      companyId: "Company ID",
      supplierName: "Supplier",
      billNumber: "Bill number",
      billDate: "Bill date",
      dueDate: "Due date",
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
  vendorId: {
    label: "Choose supplier",
    description: "From the supplier directory",
  },
  supplierName: {
    label: "Supplier name",
    description: "Name of the supplier who sent this bill",
    placeholder: "Acme GmbH",
  },
  supplierVatNumber: {
    label: "Supplier VAT number",
    description: "Supplier VAT/tax identification number",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Bill number",
    description: "Supplier's invoice/bill reference number",
    placeholder: "INV-2024-001",
  },
  billDate: {
    label: "Bill date",
    description: "Date the bill was issued",
    placeholder: "Choose bill date",
  },
  dueDate: {
    label: "Due date",
    description: "Payment due date",
    placeholder: "Choose due date",
  },
  currency: {
    code: "{{code}}",
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
