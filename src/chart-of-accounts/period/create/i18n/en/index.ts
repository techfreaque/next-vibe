export const translations = {
  post: {
    title: "Open accounting period",
    titleShort: "New period",
    description: "Create a new accounting period for a company",
    companyId: {
      label: "Company",
      description: "Company to open the period for",
      placeholder: "Choose a company",
    },
    name: {
      label: "Period name",
      description: "e.g. January 2026",
      placeholder: "January 2026",
    },
    startDate: {
      label: "Start date",
      description: "Period start date",
      placeholder: "",
    },
    endDate: {
      label: "End date",
      description: "Period end date",
      placeholder: "",
    },
    response: { id: "Period ID", name: "Name" },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation error",
        description: "Check start/end dates",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      server: { title: "Server error", description: "Could not create period" },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Overlap",
        description: "Date range overlaps with existing period",
      },
      network: {
        title: "Network error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not found", description: "Company not found" },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Period created",
      description: "Accounting period opened",
    },
    widget: {
      viewButton: "View Period",
      back: "Back",
    },
  },
  title: "Create period",
  description: "Open a new accounting period",
  category: "Chart of Accounts",
  tag: "Period",
};
