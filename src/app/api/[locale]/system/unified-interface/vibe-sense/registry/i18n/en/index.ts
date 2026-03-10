export const translations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },
  get: {
    title: "Indicator Registry",
    description: "List all registered indicators available for graph building",
    container: {
      title: "Indicators",
      description: "All registered indicators",
    },
    response: {
      indicators: "Indicators",
      indicator: {
        id: "ID",
        domain: "Domain",
        description: "Description",
        resolution: "Resolution",
        persist: "Persist",
        lookback: "Lookback",
        inputs: {
          item: "Input",
        },
        isDerived: "Derived",
        isMultiValue: "Multi-Value",
      },
    },
    success: {
      title: "Registry loaded",
      description: "Indicator registry retrieved successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Failed to load registry",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request",
      },
      notFound: { title: "Not found", description: "Registry not found" },
      conflict: { title: "Conflict", description: "Resource conflict" },
      network: {
        title: "Network error",
        description: "Network request failed",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "Save changes first",
      },
    },
  },
};
