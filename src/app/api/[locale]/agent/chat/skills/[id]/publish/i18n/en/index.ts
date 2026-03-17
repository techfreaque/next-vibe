export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  patch: {
    title: "Publish Skill",
    description:
      "Publish or unpublish a custom skill. PUBLISHED makes it visible in the community store.",
    dynamicTitle: "Publish: {{name}}",
    status: {
      label: "Status",
      description:
        "Set to PUBLISHED to make visible in the store, DRAFT to hide, UNLISTED for link-only access.",
    },
    changeNote: {
      label: "Change Note",
      description: "Optional note describing what changed in this version.",
      placeholder: "e.g. Improved system prompt clarity",
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to publish",
      },
      forbidden: {
        title: "Forbidden",
        description: "You can only publish your own skills",
      },
      notFound: { title: "Not Found", description: "Skill not found" },
      server: {
        title: "Server Error",
        description: "An error occurred while publishing",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
    },
    success: {
      title: "Skill Published",
      description: "Your skill is now visible in the community store",
    },
    response: {
      status: { content: "Status" },
      publishedAt: { content: "Published At" },
    },
    button: {
      submit: "Save Status",
      loading: "Saving...",
    },
  },
};
