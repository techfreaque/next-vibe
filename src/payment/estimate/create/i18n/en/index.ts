export const translations = {
  category: "Estimates",
  tags: {
    payment: "payment",
    estimate: "estimate",
    ar: "accounts-receivable",
  },
  post: {
    title: "Create estimate",
    titleShort: "Create estimate",
    description: "Create a new sales estimate or quote in draft status",
    form: {
      title: "New estimate",
      description: "Fill in the estimate details",
    },
    response: {
      success: "Estimate created",
      message: "Status message",
      estimate: {
        title: "Estimate",
        subtitle: "Created estimate",
        id: "Estimate ID",
        companyId: "Company ID",
        estimateNumber: "Estimate number",
        status: "Status",
        customerId: "Customer ID",
        customerEmail: "Customer email",
        customerName: "Customer name",
        currency: "Currency",
        validUntil: "Valid until",
        title_field: "Title",
        notes: "Notes",
        terms: "Terms",
        subtotal: "Subtotal",
        taxAmount: "Tax amount",
        total: "Total",
        invoiceId: "Invoice ID",
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
        description: "Invalid estimate parameters",
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
        description: "Must be an admin or accountant of this company",
      },
      notFound: {
        title: "Not found",
        description: "Company not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Estimate created in draft status",
    },
    widget: {
      otherRate: "Other rate",
      item: "Description",
      quantity: "Quantity",
      price: "Unit price",
      vatRate: "VAT %",
      add: "Add line",
      remove: "Remove line",
      empty: "Add the goods or services you are quoting.",
      summary: "Summary",

      back: "Back",
      submit: "Create estimate",
      viewButton: "View estimate",
    },
  },
  companyId: {
    label: "Company ID",
    description: "The company issuing this estimate",
    placeholder: "Enter company ID",
  },
  customerId: {
    label: "Customer ID",
    description: "Optional: UUID of the customer",
    placeholder: "Enter customer ID",
  },
  customerEmail: {
    label: "Customer email",
    description: "Customer email address",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "Customer name",
    description: "Customer name",
    placeholder: "Enter customer name",
  },
  currency: {
    code: "{{code}}",
    label: "Currency",
    description: "Estimate currency",
    placeholder: "Company currency",
  },
  validUntil: {
    label: "Valid until",
    description: "Date until which this estimate is valid",
    placeholder: "Select expiry date",
  },
  title: {
    label: "Title",
    description: "Short title for this estimate",
    placeholder: "e.g. Website Redesign Estimate",
  },
  notes: {
    label: "Notes",
    description: "Optional notes visible on the estimate",
    placeholder: "e.g. Prices valid for 30 days",
  },
  terms: {
    label: "Terms",
    description: "Payment or delivery terms",
    placeholder: "e.g. 50% upfront, 50% on delivery",
  },
  lines: {
    label: "Line items",
    description: "Items included in this estimate",
  },
};
