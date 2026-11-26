export const translations = {
  enums: {
    productType: {
      service: "Service",
      physical: "Physical",
      digital: "Digital",
    },
  },
  tags: {
    products: "Products",
    catalog: "Catalog",
    update: "Update",
  },
  patch: {
    title: "Update product",
    titleShort: "Update product",
    description: "Update fields on an existing catalog product.",
    productId: {
      label: "Product ID",
      description: "The ID of the product to update",
    },
    name: {
      label: "Product name",
      description: "Updated name for the product",
      placeholder: "Web design package",
    },
    productDescription: {
      label: "Description",
      description: "Updated product description",
      placeholder: "Full website design including up to 5 pages",
    },
    sku: {
      label: "SKU",
      description: "Updated stock keeping unit code",
      placeholder: "WD-001",
    },
    type: {
      label: "Product type",
      description: "Updated product type",
      placeholder: "Select type",
    },
    unit: {
      label: "Unit",
      description: "Updated billing unit",
      placeholder: "hour",
    },
    basePrice: {
      label: "Base price",
      description: "Updated base price",
      placeholder: "150.00",
    },
    currency: {
      label: "Currency",
      description: "Updated 3-letter ISO currency code",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Default tax rate",
      description: "Updated default tax rate as a decimal",
      placeholder: "0.19",
    },
    categoryId: {
      label: "Category",
      description: "Updated product category",
    },
    imageUrl: {
      label: "Image URL",
      description: "Updated product image URL",
      placeholder: "https://example.com/product.jpg",
    },
    isActive: {
      label: "Active",
      description: "Whether the product is available in the catalog",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Check the fields and try again",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to update a product",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to update this product",
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
        description: "Product not found",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Product updated",
      description: "Product details have been saved.",
    },
    response: {
      id: "Product ID",
      name: "Product name",
    },
    widget: {
      catalogCompany: "Catalog company",
      billingCadence: "Billing cadence",
      oneTime: "One-time purchase",
      personalCatalog: "Personal catalog",
      companyUnavailable: "Company name unavailable",
      couldNotLoad: "Could not load the product.",
      retry: "Retry",
      backToList: "Back to products",
      back: "Back",
    },
  },
};
