export const translations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "NOT",
    description:
      "Inverts a signal stream — fired becomes not-fired and vice versa",
    fields: {
      signal: { label: "Signal", description: "Input signal stream to invert" },
      result: { label: "Result", description: "Inverted output signal events" },
    },
    success: {
      title: "NOT evaluated",
      description: "Inverted signal events returned",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      server: {
        title: "Server error",
        description: "NOT evaluation failed",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      validation: {
        title: "Validation failed",
        description: "Invalid request parameters",
      },
      notFound: { title: "Not found", description: "Not found" },
      conflict: { title: "Conflict", description: "Conflict" },
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
