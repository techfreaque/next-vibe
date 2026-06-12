export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "Add Invoice Line",
    titleShort: "Add Line",
    description: "Add a line item to a draft invoice",
    form: {
      title: "Line Item",
      description: "Define the billable item to add",
    },
    response: {
      success: "Line added",
      message: "Status message",
      line: {
        title: "Line Details",
        subtitle: "Created invoice line",
        id: "Line ID",
        invoiceId: "Invoice ID",
        lineDescription: "Description",
        productId: "Product ID",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        taxRate: "Tax Rate",
        taxAmount: "Tax Amount",
        lineTotal: "Line Total",
        sortOrder: "Sort Order",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid line item parameters",
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
        description: "Invoice not found",
      },
      conflict: {
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Line item added to invoice",
    },
  },
  invoiceId: {
    label: "Invoice ID",
    description: "The draft invoice to add this line to",
    placeholder: "Enter invoice ID",
  },
  description: {
    label: "Description",
    description: "What this line item represents",
    placeholder: "e.g. Web development - 10 hours",
  },
  productId: {
    label: "Product ID",
    description: "Optional product reference",
    placeholder: "Enter product ID",
  },
  quantity: {
    label: "Quantity",
    description: "Number of units",
    placeholder: "1",
  },
  unitPrice: {
    label: "Unit Price",
    description: "Price per unit",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tax Rate",
    description: "Tax rate as a decimal (e.g. 0.23 for 23%)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Search product catalog",
    searchPlaceholder: "Name or SKU…",
    searchButton: "Search",
    clearProduct: "Clear",
    noProductResults: "No matches — enter manually below.",
    orManual: "Or enter manually",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "Line total",
    lineAdded: "Line added",
    addAnotherLine: "Add Another Line",
    viewInvoice: "View Invoice",
    submit: "Add Line",
  },
};
