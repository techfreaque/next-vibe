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
    title: "Products",
    titleShort: "Products",
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
      label: "Product type",
      description: "Filter by service, physical, or digital",
      placeholder: "All types",
    },
    isActive: {
      label: "Active only",
      description: "Show only active products",
    },
    page: {
      label: "Page",
      description: "Page number (starts at 1)",
    },
    pageSize: {
      label: "Per page",
      description: "Results per page (max 100)",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Check the filter parameters and try again",
      },
      unauthorized: {
        title: "Not signed in",
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
        title: "Server error",
        description: "Something went wrong on our end. Try again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      network: {
        title: "Network error",
        description: "Check your connection and try again",
      },
      notFound: {
        title: "Not found",
        description: "No products found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Products retrieved",
      description: "Your catalog products are listed below.",
    },
    response: {
      id: "Product ID",
      name: "Product name",
      type: "Type",
      sku: "SKU",
      basePrice: "Base price",
      currency: "Currency",
      unit: "Unit",
      isActive: "Active",
      isSubscription: "Subscription",
      billingInterval: "Billing interval",
      categoryId: "Category",
      createdAt: "Created",
      total: "Total",
    },
    widget: {
      checkout: "Platform checkout offers",
      checkoutHint:
        "Review the plans and packs sold by platform checkout at prices for this market. To link a sale to the books, choose a company product below and configure its processor offer.",
      checkoutReference: "Checkout reference",
      checkoutCredits: "Credits included",
      oneTime: "One-time price",
      searchPage: "Search by name or SKU",
      noMatches: "No matching products on this page",
      retry: "Try again",
      previous: "Previous",
      next: "Next",
      status: "Status",
      addProduct: "Add product",
      active: "Active",
      inactive: "Inactive",
      empty: "No products found. Adjust filters or add a new product.",
      columnProduct: "Product",
      columnTypePrice: "Type / Price / Status",
      filterLoad: "Load",
      filterAllTypes: "All types",
      filterActiveOnly: "Active only",
      filterAllStatus: "All statuses",
      recurring: "Recurring",
      billingMonthly: "Monthly",
      billingYearly: "Yearly",
      navCategories: "Categories",
      navTaxRates: "Tax rates",
      back: "Back",
      count: "{{count}} products",
      columnSku: "SKU",
      columnPrice: "Price",
      emptyTitle: "No products yet",
      emptyMessage:
        "Products and services you sell live here. Invoices, POS and purchasing pick them up with price, unit and VAT.",
      clearFilters: "Clear filters",
    },
  },
};
