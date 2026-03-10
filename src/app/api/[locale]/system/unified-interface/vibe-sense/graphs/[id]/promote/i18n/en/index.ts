export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Promote to System",
    description: "Promote an admin graph to system-owned (read-only, shared)",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
    },
    response: {
      promotedId: "Graph ID",
    },
    widget: {
      confirmDescription:
        "Promoting this graph will make it system-owned and shared with all users. The current system version for this slug will be deactivated. This can be reversed by promoting a different version.",
      promotedIdLabel: "Promoted ID:",
      viewButton: "View",
    },
    success: {
      title: "Graph promoted",
      description: "Graph promoted to system successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "Failed to promote graph",
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
