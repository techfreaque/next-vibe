export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Products",
  },
  get: {
    title: "Get Product",
    description: "Fetches a single product by ID from the Corvina platform.",
    productId: {
      label: "Product ID",
      description: "Numeric product ID.",
    },
    response: {
      id: "Product ID",
      code: "Code",
      type: "Type",
      label: "Name",
      dealer: "Dealer",
      trial: "Trial",
      creationDate: "Created",
      lastModified: "Updated",
      autorenewDefault: "Auto-Renew Default",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      title: "Product Details",
      back: "Back",
      noData: "Product not found.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The product ID is invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to access this product.",
      },
      notFound: {
        title: "Not Found",
        description: "No product with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Product Retrieved",
      description: "Product fetched successfully.",
    },
  },
  put: {
    title: "Update Product",
    description: "Updates a product by ID.",
    productId: { label: "Product ID", description: "Numeric product ID." },
    code: { label: "Code", description: "Unique product code identifier." },
    type: { label: "Type", description: "Product type (e.g. STANDARD)." },
    productLabel: {
      label: "Name",
      description: "Human-readable product name.",
    },
    trial: { label: "Trial", description: "Whether this is a trial product." },
    autorenewDefault: {
      label: "Auto-Renew Default",
      description: "Default auto-renew setting for new licenses.",
    },
    submitButton: { label: "Save Changes", loadingText: "Saving..." },
    widget: { back: "Back", title: "Update Product" },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The update request is invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to update this product.",
      },
      notFound: {
        title: "Not Found",
        description: "No product with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Product Updated",
      description: "Product updated successfully.",
    },
  },
  delete: {
    title: "Delete Product",
    description: "Permanently deletes a product by ID.",
    productId: {
      label: "Product ID",
      description: "Numeric product ID to delete.",
    },
    widget: { back: "Back", title: "Delete Product" },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The delete request is invalid.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No permission to delete this product.",
      },
      notFound: {
        title: "Not Found",
        description: "No product with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Product Deleted",
      description: "Product deleted successfully.",
    },
  },
};
