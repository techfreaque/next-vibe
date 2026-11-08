export const translations = {
  category: "Account",
  get: {
    title: "Export My Data",
    titleShort: "Export data",
    description:
      "Download everything we hold about you: profile, chats, memories, skills, credits, referrals, newsletter, addresses. JSON plus a readable summary.",
    tags: { export: "Data Export" },
    response: {
      json: { title: "Full data (JSON)" },
      jsonFilename: { title: "JSON filename" },
      markdown: { title: "Summary (Markdown)" },
      markdownFilename: { title: "Summary filename" },
    },
    success: {
      title: "Export ready",
      description: "Your data archive was generated",
    },
    md: {
      heading: "Your data export",
      generated: "Generated",
      account: "Account",
      email: "Email",
      name: "Name",
      memberSince: "Member since",
      contents: "Contents",
      records: "records",
      note: "Full details are in the JSON file. This export only contains data tied to your account.",
    },
    widget: {
      intro:
        "Get a copy of your data. You receive a complete JSON file and a readable Markdown summary. Only your own data is included.",
      downloadJson: "Download JSON",
      downloadMarkdown: "Download summary",
      generate: "Prepare export",
      preparing: "Preparing...",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Log in to export your data",
      },
      forbidden: {
        title: "Forbidden",
        description: "You cannot export this data",
      },
      notFound: {
        title: "Not Found",
        description: "Account not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Export failed",
        description: "We could not generate your export. Try again later.",
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
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
  },
};
