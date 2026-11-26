export const translations = {
  category: "Tax",
  endpointCategories: {
    tax: "Tax",
    taxRates: "Tax rates",
    taxReports: "Tax reports",
  },

  rate: {
    details: "Rate details",
    create: {
      title: "Add tax rate",
      titleShort: "Add tax rate",
      description: "Add a tax rate for your company",
      widget: {
        save: "Create tax rate",
        backToList: "Back to tax rates",
      },
      companyId: {
        label: "Company",
        description: "The company this tax rate belongs to",
        placeholder: "Company ID",
      },
      name: {
        label: "Name",
        description: "Descriptive name for the tax rate",
        placeholder: "e.g. VAT 20%",
      },
      code: {
        label: "Code",
        description: "Short identifier for this tax rate",
        placeholder: "e.g. AT-VAT20",
      },
      type: {
        label: "Tax type",
        description: "The category of tax",
        placeholder: "Select tax type",
      },
      rate: {
        label: "Rate",
        description: "Tax rate as a decimal (0.2 = 20%)",
        placeholder: "0.2000",
      },
      country: {
        label: "Country",
        description: "Country where this tax rate applies (optional)",
        placeholder: "e.g. AT",
      },
      region: {
        label: "Region",
        description: "Region or state where this rate applies (optional)",
        placeholder: "e.g. Vienna",
      },
      isDefault: {
        label: "Default rate",
        description: "Use this rate as the default for new items",
      },
      response: {
        id: "Tax Rate ID",
        code: "Tax Rate Code",
        name: "Tax Rate Name",
      },
      success: {
        title: "Tax rate added",
        description: "The tax rate has been added to your company",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check your inputs and try again",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to manage tax rates",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        conflict: {
          title: "Code already in use",
          description: "A tax rate with this code already exists",
        },
        server: {
          title: "Server Error",
          description: "An internal error occurred",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
    },
    list: {
      title: "Tax rates",
      titleShort: "Tax rates",
      description: "All tax rates configured for your company",
      widget: {
        actions: "Actions",
        retry: "Try again",
        previous: "Previous",
        next: "Next",
        addRate: "Add rate",
        labelDefault: "Default",
        labelActive: "Active",
        labelInactive: "Inactive",
        labelEdit: "Edit",
        labelDelete: "Deactivate",
        labelCompound: "Compound",
        empty: "No tax rates configured. Add your first rate to get started.",
        emptySetup: "Set up the tax rates your company uses on invoices.",
        columnRate: "Tax rate",
        columnTypeRateActions: "Type / Rate / Status",
        backToCatalog: "← Products",
      },
      companyId: {
        label: "Company",
        description: "Company to list tax rates for",
        placeholder: "Company ID",
      },
      country: {
        label: "Country Filter",
        description: "Filter by country code (optional)",
        placeholder: "e.g. AT",
      },
      type: {
        label: "Type Filter",
        description: "Filter by tax type (optional)",
        placeholder: "Select tax type",
      },
      page: {
        label: "Page",
        description: "Page number (starts at 1)",
      },
      pageSize: {
        label: "Per Page",
        description: "Results per page (max 100)",
      },
      response: {
        total: "Total",
        rates: "Tax Rates",
        rate: {
          id: "ID",
          company: "Company",
          name: "Name",
          code: "Code",
          type: "Type",
          rate: "Rate",
          country: "Country",
          region: "Region",
          isDefault: "Default",
          isActive: "Active",
          isCompound: "Compound",
          createdAt: "Created",
          updatedAt: "Updated",
        },
      },
      success: {
        title: "Tax Rates Loaded",
        description: "Tax rates retrieved successfully",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check your inputs and try again",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to view tax rates",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        conflict: { title: "Conflict", description: "A conflict occurred" },
        server: {
          title: "Server Error",
          description: "An internal error occurred",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
    },
    update: {
      title: "Edit tax rate",
      titleShort: "Edit tax rate",
      description: "Modify an existing tax rate",
      widget: {
        save: "Save tax rate",
        backToList: "Back to tax rates",
        failed: "Tax rate not saved",
        subtitle: "{{company}} · {{code}}",
        notFoundTitle: "This tax rate no longer exists",
        notFoundMessage:
          "It was deleted, or it belongs to a company you cannot open. Pick a rate from the list.",
        loadErrorTitle: "The tax rate could not load",
      },
      rateId: {
        label: "Tax Rate ID",
        description: "The ID of the tax rate to update",
        placeholder: "Tax rate UUID",
      },
      name: {
        label: "Name",
        description: "Updated name for the tax rate",
        placeholder: "e.g. VAT 20%",
      },
      rate: {
        label: "Rate",
        description: "Updated tax rate as a decimal (0.2 = 20%)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "Default rate",
        description: "Use this rate as the default for new items",
      },
      isActive: {
        label: "Active",
        description: "Whether this tax rate is currently active",
      },
      response: {
        updated: "Updated",
      },
      success: {
        title: "Tax rate saved",
        description: "The tax rate has been updated",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check your inputs and try again",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to manage tax rates",
        },
        notFound: { title: "Not Found", description: "Tax rate not found" },
        conflict: { title: "Conflict", description: "A conflict occurred" },
        server: {
          title: "Server Error",
          description: "An internal error occurred",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
    },
    delete: {
      title: "Deactivate tax rate",
      titleShort: "Deactivate rate",
      description: "Deactivate a tax rate",
      widget: {
        backToList: "Back to tax rates",
        warning:
          "This will deactivate the tax rate. This action cannot be undone.",
        confirmTitle: "Deactivate this tax rate?",
        confirmDescription:
          "Deactivated rates can no longer be applied to invoices. Existing invoice lines are not affected.",
        confirmButton: "Yes, deactivate",
        cancelButton: "Cancel",
      },
      rateId: {
        label: "Tax Rate ID",
        description: "The ID of the tax rate to deactivate",
        placeholder: "Tax rate UUID",
      },
      response: {
        deleted: "Deactivated",
      },
      success: {
        title: "Tax rate deactivated",
        description: "The tax rate has been deactivated",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check your inputs and try again",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in",
        },
        forbidden: {
          title: "Forbidden",
          description: "You do not have permission to manage tax rates",
        },
        notFound: { title: "Not Found", description: "Tax rate not found" },
        conflict: { title: "Conflict", description: "A conflict occurred" },
        server: {
          title: "Server Error",
          description: "An internal error occurred",
        },
        network: {
          title: "Network Error",
          description: "A network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
    },
  },

  report: {
    title: "Tax by rate",
    titleShort: "Tax by rate",
    description:
      "Review recorded tax on sales invoices, credit notes, supplier bills, and till sales.",
    widget: {
      retry: "Run report again",
      scope:
        "Invoices use their linked ledger date or their creation date. Purchases use the bill date. Till sales use their UTC completion date and include lines with a positive rate or recorded tax. When an issued invoice shares a ledger entry with a till sale, the invoice represents the sale.",
      empty:
        "Issued invoices, credit notes, supplier bills and till sales with tax show up here, grouped by rate.",
      range: "{{from}} to {{to}}",
      total: "Total",
      previousMonth: "Show previous month",
      unknownRate: "Rate unavailable",
      run: "Run report",
      running: "Running report…",
      scopeHint:
        "Compare sales and purchase tax by rate for one company and period.",
      selectCompany: "Select the company for this report.",
      subtitle: "{{company}} · {{from}} to {{to}}",
      errorTitle: "The tax report could not load",
      emptyTitle: "No taxed documents in this period",
      period: {
        label: "Period",
        thisMonth: "This month",
        lastMonth: "Last month",
        thisQuarter: "This quarter",
        thisYear: "This year",
        custom: "Custom",
      },
      kpi: {
        salesTax: "Tax on sales",
        salesBase: "Taxable sales",
        purchaseTax: "Tax on purchases",
        purchaseBase: "Taxable purchases",
      },
    },
    currency: {
      label: "Currency",
      placeholder: "Company currency",
      description: "Defaults to the company currency.",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "Company",
      description: "Company to generate the tax report for",
      placeholder: "Company ID",
    },
    dateFrom: {
      label: "From",
      description: "Start date for the report period",
      placeholder: "Start of this month",
    },
    dateTo: {
      label: "To",
      description: "End date for the report period",
      placeholder: "Today",
    },
    response: {
      rows: "Report Rows",
      row: {
        direction: "Document type",
        rate: "Tax rate",
        taxableAmount: "Taxable amount",
        taxAmount: "Tax",
      },
    },
    success: {
      title: "Tax Report Generated",
      description: "Tax report retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Choose an end date on or after the start date.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view tax reports",
      },
      notFound: { title: "Not Found", description: "Company not found" },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      server: {
        title: "Server Error",
        description: "An internal error occurred",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
  },

  enums: {
    reportDirection: {
      nonDeductible: "Non-deductible supplier VAT",
      reverseCharge: "Reverse-charge VAT payable",
      posSales: "Till sales",
      sales: "Sales invoices",
      creditNotes: "Sales credit notes",
      purchases: "Supplier bills",
    },
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "Sales tax",
      withholding: "Withholding tax",
      none: "No Tax / Exempt",
    },
  },

  tags: {
    tax: "tax",
    rate: "rate",
    create: "create",
    list: "list",
    update: "update",
    delete: "delete",
    report: "report",
  },
};
