export const translations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "Delete Graph",
    titleShort: "Delete Graph",
    description: "Permanently delete a graph. Gone for good.",
    fields: {
      id: { label: "Graph ID", description: "UUID of the graph to delete" },
    },
    response: {
      deletedId: "Deleted Graph ID",
    },
    widget: {
      confirmDescription:
        "Permanent. The graph and its config are erased — no undo. Only works when the graph holds no data; otherwise archive it instead.",
      deletedIdLabel: "Deleted ID:",
      backToList: "Back to graphs",
    },
    success: {
      title: "Graph deleted",
      description: "The graph was permanently removed",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "You can't delete this graph",
      },
      server: {
        title: "Server error",
        description: "Failed to delete graph",
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
      conflict: {
        title: "Has data",
        description: "Graph holds datapoints — archive it instead of deleting",
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
