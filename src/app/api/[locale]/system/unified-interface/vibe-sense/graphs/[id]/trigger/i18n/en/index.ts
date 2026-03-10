export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Trigger Graph",
    description: "Manually trigger on-demand graph execution",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
      rangeFrom: { label: "From", description: "Range start (ISO date)" },
      rangeTo: { label: "To", description: "Range end (ISO date)" },
    },
    response: {
      nodeCount: "Nodes executed",
      errorCount: "Errors",
    },
    widget: {
      nodesExecuted: "Nodes Executed",
      errors: "Errors",
      errorDetails: "Error details",
      nodeLabel: "Node",
    },
    success: {
      title: "Graph executed",
      description: "Graph ran successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
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
        description: "Invalid parameters",
      },
      notFound: { title: "Not found", description: "Graph not found" },
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
