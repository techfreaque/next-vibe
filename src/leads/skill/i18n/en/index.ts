export const translations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    skill: "Skill",
  },

  patch: {
    title: "Attribute a skill",
    titleShort: "Skill attribution",
    description:
      "Record which skill brought this lead (first-touch attribution)",
    skillId: {
      label: "Skill",
      description: "Choose a published community skill.",
    },
    errors: {
      validation: {
        title: "Choose a skill",
        description: "Choose a published skill from the community.",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server. Please try again.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to update this.",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to update this lead.",
      },
      notFound: {
        title: "Not found",
        description: "The lead was not found.",
      },
      server: {
        title: "Server error",
        description: "An internal error occurred. Please try again.",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred.",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes.",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred.",
      },
    },
    success: {
      title: "Skill attributed",
      description: "The skill has been recorded for this lead.",
    },
    skipped: {
      title: "Not recorded",
      description:
        "The visitor’s first skill stays recorded. Start a new session if you need to verify a different skill.",
    },
    submit: "Attribute skill",
  },
};
