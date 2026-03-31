export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  post: {
    title: "Report Skill",
    description:
      "Report a community skill for moderation. Idempotent - one report per user per skill.",
    dynamicTitle: "Report: {{name}}",
    reason: {
      label: "Reason",
      description: "Why are you reporting this skill?",
      placeholder: "Describe the issue...",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please provide a reason",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to report",
      },
      forbidden: {
        title: "Forbidden",
        description: "You cannot report this skill",
      },
      notFound: { title: "Not Found", description: "Skill not found" },
      server: {
        title: "Server Error",
        description: "An error occurred while submitting your report",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Already Reported",
        description: "You have already reported this skill",
      },
    },
    success: {
      title: "Report Submitted",
      description: "Thank you for helping keep the community safe",
    },
    response: {
      reported: { content: "Reported" },
      reportCount: { content: "Report Count" },
    },
    backButton: {
      label: "Back",
    },
    button: {
      submit: "Submit Report",
      loading: "Submitting...",
    },
  },
};
