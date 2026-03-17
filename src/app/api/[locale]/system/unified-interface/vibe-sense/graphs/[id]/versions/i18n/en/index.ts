export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Graph Version History",
    description:
      "Get the version chain for a graph (ancestor walk via parentVersionId)",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph" },
      versions: {
        label: "Versions",
        description: "Ordered list of ancestor versions (oldest first)",
        id: { label: "Version ID", description: "UUID of the version" },
        name: { label: "Name", description: "Graph name at this version" },
        createdAt: {
          label: "Created At",
          description: "When this version was created",
        },
        isActive: {
          label: "Active",
          description: "Whether this is the currently active version",
        },
      },
    },
    success: {
      title: "Version history loaded",
      description: "Version chain retrieved successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Cannot access this graph",
      },
      server: {
        title: "Server error",
        description: "Failed to load version history",
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
