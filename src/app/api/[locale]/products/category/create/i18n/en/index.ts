export const translations = {
  tags: {
    products: "Products",
    category: "Category",
    create: "Create",
  },
  post: {
    title: "Create Product Category",
    titleShort: "Create Category",
    description: "Add a category to organize your catalog products.",
    name: {
      label: "Category Name",
      description: "Name of the product category",
      placeholder: "Design Services",
    },
    companyId: {
      label: "Company",
      description: "Associate this category with a company",
    },
    parentId: {
      label: "Parent Category",
      description: "Optional parent category for hierarchical organization",
    },
    sortOrder: {
      label: "Sort Order",
      description: "Display order — lower numbers appear first",
      placeholder: "0",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the form fields and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to create a category",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to create this category",
      },
      conflict: {
        title: "Already Exists",
        description: "A category with this name already exists",
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
        description: "Resource not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Category Created",
      description: "Your product category is ready.",
    },
    response: {
      id: "Category ID",
      name: "Category Name",
    },
    widget: {
      backToList: "Back to Categories",
      back: "Back",
    },
  },
};
