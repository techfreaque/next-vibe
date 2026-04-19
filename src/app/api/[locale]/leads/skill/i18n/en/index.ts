export const translations = {
  category: "Leads",
  tags: {
    leads: "Leads",
    skill: "Skill",
  },

  patch: {
    title: "Set Lead Skill",
    description:
      "Record which skill brought this lead (first-touch attribution)",
    skillId: {
      label: "Skill ID",
      description: "UUID of the custom skill to attribute to this lead",
    },
    errors: {
      validation: {
        title: "Invalid skill ID",
        description: "Must be a valid UUID of a custom skill",
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
  },
};
