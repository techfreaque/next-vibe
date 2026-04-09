export const translations = {
  list: {
    title: "Captured Leads",
    description: "Everyone who submitted your lead magnet form",
    tag: "lead-magnet-captures",
    response: {
      items: "Leads",
      total: "Total",
      page: "Page",
      pageSize: "Page size",
    },
    success: {
      title: "Leads loaded",
      description: "Your captured leads",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Check your input",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Log in to continue",
      },
      forbidden: { title: "Forbidden", description: "Access denied" },
      notFound: { title: "Not found", description: "No leads found" },
      conflict: { title: "Conflict", description: "A conflict occurred" },
      network: {
        title: "Network error",
        description: "A network error occurred",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
      internal: {
        title: "Server error",
        description: "An internal error occurred",
      },
      unknown: {
        title: "Unknown error",
        description: "An unknown error occurred",
      },
    },
  },
  widget: {
    empty:
      "No leads captured yet. Share your skill page to start collecting leads.",
    exportCsv: "Export CSV",
    columns: {
      date: "Date",
      name: "Name",
      email: "Email",
      status: "Status",
    },
    statusSuccess: "Captured",
    statusFailed: "Failed",
  },
};
