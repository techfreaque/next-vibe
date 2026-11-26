export const translations = {
  category: "Billing",
  tags: {
    payment: "payment",
    invoice: "invoice",
    ar: "accounts-receivable",
  },
  post: {
    title: "New invoice",
    titleShort: "New invoice",
    description: "Prepare an invoice for your customer.",
    form: {
      title: "New invoice",
      description: "Fill in the invoice details",
    },
    response: {
      success: "Invoice created",
      message: "Status message",
      invoice: {
        title: "Invoice",
        subtitle: "Created invoice",
        id: "Invoice ID",
        companyId: "Company ID",
        customerId: "Customer ID",
        invoiceSequenceNumber: "Invoice number",
        currency: "Currency",
        status: "Status",
        dueDate: "Due date",
        notes: "Notes",
        amount: "Amount",
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
        description: "Invalid invoice parameters",
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
      title: "Invoice created",
      description: "Invoice created in draft status",
    },
    widget: {
      draftSaved: "Draft invoice saved",
      draftSavedNumber: "Draft invoice #{{number}} saved",
      details: "Invoice details",
      draftHint: "Save a draft to review before issuing.",
      items: "Line items",
      itemsDescription:
        "Optional draft lines. Use a decimal VAT rate from 0 to 1.",
      itemsHint: "Add goods or services to calculate your invoice total.",
      item: "Description",
      quantity: "Quantity",
      unitPrice: "Unit price",
      manualTaxRate: "Other rate",
      taxRate: "VAT %",
      addItem: "Add item",
      removeItem: "Remove item",
      itemError:
        "Enter a description, a positive quantity, a price and a VAT rate from 0 to 100%.",
      itemsTotalError: "The total is too large for one invoice.",
      summary: "Summary",
      net: "Net",
      tax: "VAT",
      total: "Total",
      customerSelected: "Customer selected",
      clearCustomer: "Clear customer",
      lineTotal: "Line total",
      companyCurrencyValue: "Company currency: {{currency}}",
      companyCurrency: "Uses the company currency unless you select one.",
      back: "Back",
      submit: "Save draft",
      saving: "Saving draft…",
      retrySave: "Save draft again",
      saveFailed: "Could not save the invoice draft",
      saveFailedHint:
        "Your entries are still here. Review them, then save the draft again.",
      viewButton: "View invoice",
    },
  },
  companyId: {
    label: "Company",
    description: "The company issuing this invoice",
    placeholder: "Enter company ID",
  },
  customerId: {
    label: "Customer",
    description: "Find a customer by name.",
    placeholder: "Enter customer ID",
  },
  dueDate: {
    label: "Due date",
    description: "When this invoice is due",
    placeholder: "Select due date",
  },
  currency: {
    code: "{{code}}",
    label: "Currency",
    description: "Invoice currency",
    placeholder: "Company currency",
  },
  notes: {
    label: "Notes",
    description: "Optional notes visible on the invoice",
    placeholder: "e.g. Payment terms: 30 days",
  },
  supplyDate: {
    label: "Supply date",
    description:
      "Day the goods or services were delivered. Defaults to the issue date.",
  },
  vatTreatment: {
    label: "VAT treatment",
    description:
      "Domestic VAT, reverse charge or an exemption. Reverse charge and EU supplies need the customer VAT ID.",
    options: {
      DOMESTIC: "Domestic sale with VAT",
      REVERSE_CHARGE_DOMESTIC: "Domestic reverse charge",
      EU_SERVICES_REVERSE_CHARGE: "Services to an EU business (reverse charge)",
      EU_GOODS_EXEMPT: "Goods to an EU business (exempt)",
      EXPORT_EXEMPT: "Export outside the EU (exempt)",
      EXEMPT: "VAT exempt supply",
    },
  },
};
