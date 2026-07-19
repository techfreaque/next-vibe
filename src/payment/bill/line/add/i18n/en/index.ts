export const translations = {
  tags: { payment: "payment", bill: "bill", ap: "accounts-payable" },
  post: {
    title: "Add Bill Line",
    titleShort: "Add Line",
    description: "Add an expense line item to a draft supplier bill",
    form: {
      title: "New Bill Line",
      description: "Enter the details of the expense",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check all fields",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to add bill lines",
      },
      forbidden: {
        title: "Access Denied",
        description: "Accountant or Admin role required",
      },
      conflict: {
        title: "Bill Not Editable",
        description: "Only DRAFT bills can have lines added",
      },
      server: { title: "Server Error", description: "Could not add the line" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: { title: "Network Error", description: "Check your connection" },
      notFound: {
        title: "Bill Not Found",
        description: "This bill does not exist",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Line Added",
      description: "Expense line added to the bill",
    },
    response: {
      success: "Success",
      message: "Message",
      line: {
        title: "Line Details",
        subtitle: "Added line item",
        id: "Line ID",
        billId: "Bill ID",
        lineDescription: "Description",
        productId: "Product ID",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        taxRate: "Tax Rate",
        taxAmount: "Tax Amount",
        lineTotal: "Line Total",
        expenseAccountId: "Expense Account",
        sortOrder: "Sort Order",
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
    label: "Unit Price",
    description: "Price per unit",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Tax Rate",
    description: "VAT/tax rate (0–1, e.g. 0.19 for 19%)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "Expense Account",
    description: "Which expense account this posts to",
    placeholder: "Account UUID",
  },
  widget: {
    submit: "Add Line",
    searchProduct: "Search Product",
    searchPlaceholder: "Product name or SKU…",
    searchButton: "Search",
    clearProduct: "Clear",
    noProductResults: "No products found.",
    orManual: "or enter manually",
    multiplier: "×",
    taxLabel: "tax",
    linePreview: "Line total (preview)",
    addAnotherLine: "Add Another Line",
    viewBill: "View Bill",
  },
};
