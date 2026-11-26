export const translations = {
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  post: {
    title: "Add bill line",
    titleShort: "Add line",
    description: "Add an expense line item to a draft supplier bill",
    form: {
      title: "New bill line",
      description: "Enter the details of the expense",
    },
    errors: {
      evidenceReview:
        "Review the original supplier document before changing its allocation.",
      validation: {
        title: "Validation error",
        description: "Check all fields",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to add bill lines",
      },
      forbidden: {
        title: "Access denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Bill not editable",
        description: "Only DRAFT bills can have lines added",
      },
      server: { title: "Server error", description: "Could not add the line" },
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
      title: "Line added",
      description: "Expense line added to the bill",
    },
    response: {
      success: "Success",
      message: "Message",
      line: {
        currency: "Currency",
        title: "Line details",
        subtitle: "Added line item",
        id: "Line ID",
        billId: "Bill ID",
        lineDescription: "Description",
        productId: "Product ID",
        quantity: "Quantity",
        unitPrice: "Unit price",
        taxRate: "Tax rate",
        taxAmount: "Tax amount",
        lineTotal: "Line total",
        expenseAccountId: "Expense account",
        sortOrder: "Sort order",
        createdAt: "Created",
        updatedAt: "Updated",
      },
    },
  },
  billId: {
    label: "Bill ID",
    description: "The bill to add this line to",
    placeholder: "Bill UUID",
  },
  description: {
    label: "Description",
    description: "What was purchased",
    placeholder: "Office supplies",
  },
  productId: {
    label: "Product ID",
    description: "Optional product reference",
    placeholder: "Product UUID",
  },
  quantity: {
    label: "Quantity",
    description: "Number of units",
    placeholder: "1",
  },
  unitPrice: {
    label: "Unit price",
    description: "Price per unit",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Tax rate",
    description: "VAT/tax rate (0–1, e.g. 0.19 for 19%)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "Expense account",
    description: "Which expense account this posts to",
    placeholder: "Select expense account",
  },
  widget: {
    submit: "Add line",
    searchProduct: "Search product",
    searchPlaceholder: "Product name or SKU…",
    searchButton: "Search",
    clearProduct: "Clear",
    noProductResults: "No products found.",
    orManual: "or enter manually",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "Line total (preview)",
    addAnotherLine: "Add another line",
    viewBill: "View bill",
  },
};
