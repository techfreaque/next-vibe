export const translations = {
  category: "Estimates",
  tags: {
    payment: "payment",
    estimate: "estimate",
    ar: "accounts-receivable",
  },
  post: {
    title: "Create Estimate",
    titleShort: "Create Estimate",
    description: "Create a new sales estimate or quote in draft status",
    form: {
      title: "New Estimate",
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
        estimateNumber: "Estimate Number",
        status: "Status",
        customerId: "Customer ID",
        customerEmail: "Customer Email",
        customerName: "Customer Name",
        currency: "Currency",
        validUntil: "Valid Until",
        title_field: "Title",
        notes: "Notes",
        terms: "Terms",
        subtotal: "Subtotal",
        taxAmount: "Tax Amount",
        total: "Total",
        invoiceId: "Invoice ID",
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
        description: "Invalid estimate parameters",
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
        description: "Must be an admin or accountant of this company",
      },
      notFound: {
        title: "Not Found",
        description: "Company not found",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Estimate created in draft status",
    },
    widget: {
      back: "Back",
      submit: "Create Estimate",
      viewButton: "View Estimate",
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
    label: "Customer Email",
    description: "Customer email address",
    placeholder: "customer@example.com",
  },
  customerName: {
    label: "Customer Name",
    description: "Customer name",
    placeholder: "Enter customer name",
  },
  currency: {
    label: "Currency",
    description: "Estimate currency",
    placeholder: "EUR",
  },
  validUntil: {
    label: "Valid Until",
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
    label: "Line Items",
    description: "Items included in this estimate",
  },
};
