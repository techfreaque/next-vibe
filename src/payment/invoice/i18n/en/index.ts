export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    transactions: "transactions",
  },
  defaultItem: "Invoice item",
  success: {
    created: "Invoice created successfully",
  },
  post: {
    title: "Create Stripe invoice",
    titleShort: "Stripe invoice",
    description: "Create a Stripe invoice for a customer",
    form: {
      title: "Invoice details",
      description: "Enter the amount, currency, and due date",
    },
    response: {
      success: "Invoice created successfully",
      message: "Status message",
      invoice: {
        title: "Invoice details",
        description: "Generated invoice information",
        id: "Invoice ID",
        userId: "User ID",
        stripeInvoiceId: "Stripe invoice ID",
        invoiceNumber: "Invoice number",
        amount: "Amount",
        currency: "Currency",
        status: "Status",
        invoiceUrl: "Invoice URL",
        invoicePdf: "Invoice PDF",
        dueDate: "Due date",
        paidAt: "Paid at",
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
        description: "Invalid request parameters",
      },
      server: {
        detail: "Could not create the invoice: {{error}}",
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
        noStripeCustomer: "No Stripe customer record exists for your account",
        title: "Not found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "There are unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
    widget: {
      back: "Back",
    },
  },
  customerId: {
    label: "Customer ID",
    description: "Stripe customer identifier",
    placeholder: "Enter customer ID",
  },
  amount: {
    label: "Amount",
    description: "Invoice amount",
    placeholder: "Enter amount",
  },
  currency: {
    label: "Currency",
    description: "Currency code",
    placeholder: "Select currency",
    usd: "US Dollar (USD)",
    eur: "Euro (EUR)",
    pln: "Polish Zloty (PLN)",
  },
  description: {
    label: "Description",
    description: "Invoice description",
    placeholder: "Enter description",
  },
  dueDate: {
    label: "Due date",
    description: "Payment due date",
    placeholder: "Select due date",
  },
  metadata: {
    label: "Metadata",
    description: "Additional metadata",
    placeholder: "Enter metadata as JSON",
  },
};
