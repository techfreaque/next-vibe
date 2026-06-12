export const translations = {
  category: "Payments",
  tags: { payment: "payment", invoice: "invoice" },
  get: {
    title: "View Invoice",
    titleShort: "View Invoice",
    description: "Public invoice view via secure token link",
    form: {
      title: "Invoice",
      description: "View your invoice details",
    },
    response: {
      id: "Invoice ID",
      invoiceNumber: "Invoice Number",
      currency: "Currency",
      status: "Status",
      amount: "Amount",
      dueDate: "Due Date",
      notes: "Notes",
      createdAt: "Issue Date",
      companyName: "Company",
      companyEmail: "Company Email",
      lineId: "Line ID",
      lineDescription: "Description",
      productId: "Product",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      taxRate: "Tax Rate",
      taxAmount: "Tax",
      lineTotal: "Line Total",
      sortOrder: "Order",
      lineCreatedAt: "Created",
      lineUpdatedAt: "Updated",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Invalid Link",
        description: "The invoice link is invalid or malformed",
      },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Access Denied",
        description: "Invalid or expired invoice link",
      },
      notFound: { title: "Not Found", description: "Invoice not found" },
      conflict: { title: "Conflict", description: "Invoice state conflict" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: { title: "Invoice", description: "Your invoice details" },
  },
  invoiceId: { label: "Invoice ID", description: "The invoice to view" },
  token: {
    label: "View Token",
    description: "Secure access token from your invoice email",
  },
  widget: {
    submit: "View Invoice",
  },
};
