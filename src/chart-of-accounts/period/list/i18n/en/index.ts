export const translations = {
  get: {
    title: "Accounting Periods",
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
        title: "Validation Error",
        description: "Invalid company ID",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      server: { title: "Server Error", description: "Could not load periods" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not Found", description: "No periods found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Periods Loaded",
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
  title: "Period List",
  description: "List accounting periods",
  category: "Chart of Accounts",
  tag: "Period",
};
