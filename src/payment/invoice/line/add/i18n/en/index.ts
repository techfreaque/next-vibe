export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    lines: "lines",
  },
  post: {
    title: "Add invoice line",
    titleShort: "Add line",
    description: "Add a line item to a draft invoice",
    form: {
      title: "Line item",
      description: "Define the billable item to add",
    },
    response: {
      success: "Line added",
      message: "Status message",
      line: {
        currency: "Currency",
        title: "Line details",
        subtitle: "Created invoice line",
        id: "Line ID",
        invoiceId: "Invoice ID",
        lineDescription: "Description",
        productId: "Product ID",
        quantity: "Quantity",
        unitPrice: "Unit price",
        taxRate: "Tax rate",
        taxAmount: "Tax amount",
        lineTotal: "Line total",
        sortOrder: "Sort order",
        createdAt: "Created at",
        updatedAt: "Updated at",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation error",
        description: "Invalid line item parameters",
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
        description: "Invoice not found",
      },
      conflict: {
        title: "Conflict",
        description: "Invoice is not in draft status",
      },
      unsavedChanges: {
        title: "Unsaved changes",
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
    label: "Unit price",
    description: "Price per unit",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tax rate",
    description: "Tax rate as a decimal (e.g. 0.23 for 23%)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Search product catalog",
    searchPlaceholder: "Name or SKU…",
    searchButton: "Search",
    clearProduct: "Clear",
    noProductResults: "No matches. Enter the item details below.",
    orManual: "Or enter manually",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "Line total",
    lineAdded: "Line added",
    addAnotherLine: "Add another line",
    viewInvoice: "View invoice",
    submit: "Add line",
  },
};
