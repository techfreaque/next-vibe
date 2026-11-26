export const translations = {
  tags: {
    products: "Products",
    catalog: "Catalog",
    deactivate: "Deactivate",
  },
  post: {
    title: "Deactivate product",
    titleShort: "Deactivate",
    description:
      "Soft-delete a catalog product by marking it inactive. The product data is retained.",
    productId: {
      label: "Product",
      description: "The ID of the product to deactivate",
    },
    errors: {
      validation: {
        title: "Check the request",
        description: "Check the product ID and try again",
      },
      unauthorized: {
        title: "Not signed in",
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
        title: "Product not found",
        description: "Product not found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Product deactivated",
      description: "The product has been removed from the active catalog.",
    },
    response: {
      id: "Product",
      isActive: "Active",
    },
    widget: {
      backToList: "Back to products",
      cancel: "Cancel",
      back: "Back",
      warning:
        "This will deactivate the product and remove it from the active catalog. The data is retained.",
    },
  },
};
