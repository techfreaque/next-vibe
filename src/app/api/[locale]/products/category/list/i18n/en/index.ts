export const translations = {
  tags: {
    products: "Products",
    category: "Category",
    list: "List",
  },
  get: {
    title: "List Product Categories",
    description: "Retrieve product categories for a company or owner.",
    companyId: {
      label: "Company ID",
      description: "Filter categories belonging to this company",
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
        description: "Sign in to view categories",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to view these categories",
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
        description: "No categories found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Categories Retrieved",
      description: "Product categories are listed below.",
    },
    response: {
      id: "Category ID",
      name: "Category Name",
      parentId: "Parent Category",
      sortOrder: "Sort Order",
      isActive: "Active",
      createdAt: "Created",
      total: "Total",
    },
    widget: {
      addCategory: "Add Category",
      active: "Active",
      inactive: "Inactive",
      empty: "No categories found. Add your first category.",
      viewProducts: "View products →",
      backToCatalog: "← Products",
      back: "Back",
    },
  },
};
