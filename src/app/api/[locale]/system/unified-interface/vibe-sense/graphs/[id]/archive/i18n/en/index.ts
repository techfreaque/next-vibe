export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Archive Graph",
    description: "Soft-delete a graph (deactivate and mark as archived)",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph to archive" },
    },
    response: {
      archivedId: "Archived Graph ID",
    },
    widget: {
      confirmDescription:
        "This will deactivate the graph and mark it as archived. It will no longer run on schedule. This can be undone.",
      archivedIdLabel: "Archived ID:",
      backToList: "Back to graphs",
    },
    success: {
      title: "Graph archived",
      description: "Graph has been archived successfully",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Cannot archive system graphs",
      },
      server: {
        title: "Server error",
        description: "Failed to archive graph",
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
