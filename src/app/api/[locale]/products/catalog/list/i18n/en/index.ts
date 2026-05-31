export const translations = {
  tags: {
    products: "Products",
    catalog: "Catalog",
    list: "List",
  },
  enums: {
    productType: {
      service: "Service",
      physical: "Physical",
      digital: "Digital",
    },
  },
  get: {
    title: "List Catalog Products",
    description:
      "Retrieve all products in your catalog. Filter by company, category, type, or active status.",
    companyId: {
      label: "Company ID",
      description: "Filter products belonging to this company",
    },
    categoryId: {
      label: "Category ID",
      description: "Filter products in this category",
    },
    type: {
      label: "Product Type",
      description: "Filter by service, physical, or digital",
      placeholder: "All types",
    },
    isActive: {
      label: "Active Only",
      description: "Show only active products",
    },
    page: {
      label: "Page",
      description: "Page number (starts at 1)",
    },
    pageSize: {
      label: "Per Page",
      description: "Results per page (max 100)",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the filter parameters and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view your catalog",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view this catalog",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong on our end — try again",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network Error",
        description: "Check your connection and try again",
      },
      notFound: {
        title: "Not Found",
        description: "No products found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Products Retrieved",
      description: "Your catalog products are listed below.",
    },
    response: {
      id: "Product ID",
      name: "Product Name",
      type: "Type",
      sku: "SKU",
      basePrice: "Base Price",
      currency: "Currency",
      unit: "Unit",
      isActive: "Active",
      isSubscription: "Subscription",
      billingInterval: "Billing Interval",
      categoryId: "Category",
      createdAt: "Created",
      total: "Total",
    },
    widget: {
      addProduct: "Add Product",
      active: "Active",
      inactive: "Inactive",
      empty: "No products found. Adjust filters or add a new product.",
      columnProduct: "Product",
      columnTypePrice: "Type / Price / Status",
      filterLoad: "Load",
      filterAllTypes: "All types",
      filterActiveOnly: "Active only",
      filterAllStatus: "All status",
      recurring: "Recurring",
      billingMonthly: "Monthly",
      billingYearly: "Yearly",
      navCategories: "Categories",
      navTaxRates: "Tax Rates",
      back: "Back",
    },
  },
};
