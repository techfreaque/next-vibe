export const translations = {
  dashboard: {
    get: {
      title: "Inventory Overview",
      description:
        "Live snapshot of stock health, pending transfers, and warehouse counts.",
      widget: {
        kpiInStock: "In Stock",
        kpiOutOfStock: "Out of Stock",
        kpiLowStock: "Low Stock",
        kpiWarehouses: "Warehouses",
        alertOutOfStock: "{{count}} product out of stock",
        alertOutOfStockPlural: "{{count}} products out of stock",
        navStockLevels: "Stock Levels",
        navTransfers: "Transfers",
        navWarehouses: "Warehouses",
        loading: "Loading…",
        pendingTransfers: "{{count}} transfer in transit",
        pendingTransfersPlural: "{{count}} transfers in transit",
      },
      companyId: {
        label: "Company",
        description: "Company to show inventory stats for (optional)",
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Check required fields",
        },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to view inventory overview",
        },
        forbidden: {
          title: "Access Denied",
          description: "No access to this company",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Failed to load inventory overview",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: { title: "Not Found", description: "Company not found" },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Dashboard Loaded",
        description: "Inventory overview retrieved",
      },
      response: {
        inStockCount: "In Stock",
        outOfStockCount: "Out of Stock",
        lowStockCount: "Low Stock",
        pendingTransferCount: "Pending Transfers",
        warehouseCount: "Warehouses",
      },
    },
  },
};
