export const translations = {
  category: "Chat",
  tags: {
    moderation: "Moderation",
  },
  post: {
    title: "Report Content",
    titleShort: "Report",
    description:
      "Report a public post or shared thread. Reports from enough people hide it until an admin reviews it.",
    reason: {
      label: "Reason",
      description: "What is wrong with this content?",
    },
    note: {
      label: "Details",
      description: "Optional. Add context for the reviewer.",
      placeholder: "What should the reviewer know?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illegal content",
      abuse: "Abuse or harassment",
      csamFlag: "Child safety concern",
      other: "Other",
    },
    messageId: {
      label: "Message ID",
      description: "Specific message being reported (optional)",
    },
    errors: {
      validation: { title: "Validation Error", description: "Pick a reason" },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You cannot report this content",
      },
      forbidden: {
        title: "Forbidden",
        description: "You cannot report your own content",
      },
      notFound: {
        title: "Not Found",
        description: "This content is gone or not available",
      },
      server: {
        title: "Server Error",
        description: "Your report could not be submitted",
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
        description: "You already reported this content",
      },
      rateLimited: {
        title: "Too many reports",
        description: "You are reporting too fast. Try again later.",
      },
    },
    success: {
      title: "Report Submitted",
      description: "Thank you. We review every report.",
    },
    response: {
      reported: { content: "Reported" },
      reportCount: { content: "Report Count" },
      hidden: { content: "Hidden" },
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
