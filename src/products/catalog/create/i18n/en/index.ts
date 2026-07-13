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
    create: "Create",
  },
  post: {
    title: "Create Product",
    titleShort: "Create Product",
    description: "Add a product or service to your catalog.",
    name: {
      label: "Product Name",
      description: "Name of the product or service",
      placeholder: "Web Design Package",
    },
    productDescription: {
      label: "Description",
      description: "Short description of what the product or service includes",
      placeholder: "Full website design including up to 5 pages",
    },
    sku: {
      label: "SKU",
      description: "Stock keeping unit — your internal product code",
      placeholder: "WD-001",
    },
    type: {
      label: "Product Type",
      description: "Whether this is a service, physical good, or digital item",
      placeholder: "Select type",
    },
    unit: {
      label: "Unit",
      description: "Billing unit (e.g. hour, piece, license)",
      placeholder: "hour",
    },
    basePrice: {
      label: "Base Price",
      description: "Default price in the selected currency",
      placeholder: "150.00",
    },
    currency: {
      label: "Currency",
      description: "3-letter ISO currency code",
      placeholder: "EUR",
    },
    defaultTaxRate: {
      label: "Default Tax Rate",
      description: "Default VAT/tax rate as a decimal (e.g. 0.19 for 19%)",
      placeholder: "0.19",
    },
    companyId: {
      label: "Company",
      description: "Associate this product with a company",
    },
    categoryId: {
      label: "Category",
      description: "Product category",
    },
    imageUrl: {
      label: "Image URL",
      description: "URL to a product image",
      placeholder: "https://example.com/product.jpg",
    },
    isSubscription: {
      label: "Subscription product",
      description: "Charge customers on a recurring basis",
    },
    billingInterval: {
      label: "Billing interval",
      description: "How often customers are charged",
      placeholder: "Select interval",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the form fields and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to create a product",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to create this product",
      },
      conflict: {
        title: "Already Exists",
        description: "A product with this SKU already exists",
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
      title: "Product Created",
      description: "Your product is now in the catalog.",
    },
    response: {
      id: "Product ID",
      name: "Product Name",
    },
    widget: {
      viewProduct: "View Product",
      backToList: "Back to Products",
      back: "Back",
    },
  },
};
