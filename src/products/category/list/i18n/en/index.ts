export const translations = {
  tags: {
    products: "Products",
    category: "Category",
    list: "List",
  },
  get: {
    title: "Categories",
    titleShort: "Categories",
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
      label: "Per page",
      description: "Results per page (max 100)",
    },
    errors: {
      validation: {
        title: "Check the form",
        description: "Check the filter parameters and try again",
      },
      unauthorized: {
        title: "Not signed in",
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
        description: "No categories found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Categories retrieved",
      description: "Product categories are listed below.",
    },
    response: {
      id: "Category ID",
      name: "Category name",
      parentId: "Parent category",
      sortOrder: "Sort order",
      isActive: "Active",
      createdAt: "Created",
      total: "Total",
    },
    widget: {
      addCategory: "Add category",
      active: "Active",
      inactive: "Inactive",
      emptyTitle: "No categories yet",
      empty: "Group products by category to filter the catalog faster.",
      back: "Back",
      count: "{{count}} categories",
      columnName: "Category",
      columnOrder: "Sort order",
      columnStatus: "Status",
      inParent: "In {{parent}}",
    },
  },
};
