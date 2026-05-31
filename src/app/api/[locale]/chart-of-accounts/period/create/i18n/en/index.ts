export const translations = {
  post: {
    title: "Open Accounting Period",
    description: "Create a new accounting period for a company",
    companyId: {
      label: "Company ID",
      description: "Company to open the period for",
      placeholder: "Company UUID",
    },
    name: {
      label: "Period Name",
      description: "e.g. January 2026",
      placeholder: "January 2026",
    },
    startDate: {
      label: "Start Date",
      description: "Period start date",
      placeholder: "",
    },
    endDate: {
      label: "End Date",
      description: "Period end date",
      placeholder: "",
    },
    response: { id: "Period ID", name: "Name" },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation Error",
        description: "Check start/end dates",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      server: { title: "Server Error", description: "Could not create period" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Overlap",
        description: "Date range overlaps with existing period",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not Found", description: "Company not found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Period Created",
      description: "Accounting period opened",
    },
    widget: {
      viewButton: "View Period",
      back: "Back",
    },
  },
  title: "Create Period",
  description: "Open a new accounting period",
  category: "Chart of Accounts",
  tag: "Period",
};
