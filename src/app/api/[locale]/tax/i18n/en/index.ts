export const translations = {
  category: "Tax",
  endpointCategories: {
    tax: "Tax",
    taxRates: "Tax Rates",
    taxReports: "Tax Reports",
  },

  rate: {
    create: {
      title: "Create Tax Rate",
      description: "Add a tax rate for your company",
      widget: {
        backToList: "Back to Tax Rates",
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
        label: "Tax Type",
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
        label: "Default Rate",
        description: "Use this rate as the default for new items",
      },
      response: {
        id: "Tax Rate ID",
        code: "Tax Rate Code",
        name: "Tax Rate Name",
      },
      success: {
        title: "Tax Rate Created",
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
          title: "Duplicate Code",
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
      title: "Tax Rates",
      description: "All tax rates configured for your company",
      widget: {
        addRate: "Add Rate",
        labelDefault: "Default",
        labelActive: "Active",
        labelInactive: "Inactive",
        labelEdit: "Edit",
        labelDelete: "Delete",
        labelCompound: "Compound",
        empty: "No tax rates configured. Add your first rate to get started.",
        emptySetup:
          "No tax rates set up. Every invoice needs a tax rate — configure yours now.",
        columnRate: "Tax Rate",
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
      title: "Update Tax Rate",
      description: "Modify an existing tax rate",
      widget: {
        backToList: "Back to Tax Rates",
        failed: "Failed",
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
        label: "Default Rate",
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
        title: "Tax Rate Updated",
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
      title: "Delete Tax Rate",
      description: "Deactivate a tax rate",
      widget: {
        backToList: "Back to Tax Rates",
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
        title: "Tax Rate Deactivated",
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
    title: "Tax Report",
    description: "Tax collected by rate and period",
    widget: {
      columnRate: "Rate",
      total: "Total",
      empty: "No tax data found for this period.",
    },
    companyId: {
      label: "Company",
      description: "Company to generate the tax report for",
      placeholder: "Company ID",
    },
    dateFrom: {
      label: "From",
      description: "Start date for the report period",
      placeholder: "2024-01-01",
    },
    dateTo: {
      label: "To",
      description: "End date for the report period",
      placeholder: "2024-12-31",
    },
    response: {
      rows: "Report Rows",
      row: {
        taxRateCode: "Tax Rate Code",
        taxRateName: "Tax Rate Name",
        taxableAmount: "Taxable Amount",
        taxAmount: "Tax Amount",
        period: "Period",
      },
    },
    success: {
      title: "Tax Report Generated",
      description: "Tax report retrieved successfully",
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
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "Sales Tax",
      withholding: "Withholding Tax",
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
