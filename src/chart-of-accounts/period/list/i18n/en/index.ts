export const translations = {
  get: {
    title: "Accounting periods",
    titleShort: "Periods",
    description: "List all accounting periods for a company",
    companyId: {
      label: "Company ID",
      description: "Company whose periods to list",
      placeholder: "Enter company UUID",
    },
    response: {
      periods: "Periods",
      id: "ID",
      name: "Name",
      startDate: "Start",
      endDate: "End",
      status: "Status",
      closedAt: "Closed At",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation error",
        description: "Invalid company ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      server: { title: "Server error", description: "Could not load periods" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not found", description: "No periods found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Periods loaded",
      description: "Accounting periods retrieved",
    },
    widget: {
      loading: "Loading periods...",
      empty: "No accounting periods found.",
      createButton: "Create Period",
    },
  },
  enums: {
    periodStatus: {
      OPEN: "Open",
      CLOSED: "Closed",
      LOCKED: "Locked",
    },
  },
  title: "Period list",
  description: "List accounting periods",
  category: "Chart of Accounts",
  tag: "Period",
};
