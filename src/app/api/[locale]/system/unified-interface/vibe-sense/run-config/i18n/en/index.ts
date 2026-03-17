export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Run Graph Config",
    description:
      "Execute a graph from an inline config without requiring a saved graph",
    fields: {
      config: {
        label: "Graph Config",
        description: "Inline graph configuration (nodes, edges, trigger)",
      },
      rangeFrom: {
        label: "From",
        description: "Range start (ISO datetime)",
      },
      rangeTo: {
        label: "To",
        description: "Range end (ISO datetime)",
      },
    },
    response: {
      nodeCount: "Nodes executed",
      errorCount: "Errors",
      errors: "Error details",
    },
    success: {
      title: "Config executed",
      description: "Graph config ran successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      server: {
        title: "Server error",
        description: "Graph execution failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid graph config or parameters",
      },
      notFound: {
        title: "Not found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Resource conflict",
      },
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
