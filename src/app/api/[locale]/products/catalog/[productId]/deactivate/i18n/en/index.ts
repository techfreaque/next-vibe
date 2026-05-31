export const translations = {
  tags: {
    products: "Products",
    catalog: "Catalog",
    deactivate: "Deactivate",
  },
  post: {
    title: "Deactivate Product",
    description:
      "Soft-delete a catalog product by marking it inactive. The product data is retained.",
    productId: {
      label: "Product ID",
      description: "The ID of the product to deactivate",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the product ID and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to deactivate a product",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to deactivate this product",
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
        description: "Product not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Product Deactivated",
      description: "The product has been removed from the active catalog.",
    },
    response: {
      id: "Product ID",
      isActive: "Active Status",
    },
    widget: {
      backToList: "Back to Products",
      back: "Back",
      warning:
        "This will deactivate the product and remove it from the active catalog. The data is retained.",
    },
  },
};
