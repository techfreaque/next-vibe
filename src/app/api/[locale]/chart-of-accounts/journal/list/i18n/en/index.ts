export const translations = {
  get: {
    title: "Journal Entries",
    description:
      "List journal entries with filters for company, period, status, source type, and date range",
    companyId: {
      label: "Company ID",
      description: "Filter by company",
      placeholder: "Company UUID",
    },
    periodId: {
      label: "Period ID",
      description: "Filter by accounting period",
      placeholder: "Period UUID (optional)",
    },
    status: {
      label: "Status",
      description: "Filter by entry status",
      placeholder: "Any status",
    },
    sourceType: {
      label: "Source Type",
      description: "Filter by originating source",
      placeholder: "Any source",
    },
    dateFrom: {
      label: "From",
      description: "Start of date range",
      placeholder: "",
    },
    dateTo: { label: "To", description: "End of date range", placeholder: "" },
    response: {
      entries: "Entries",
      id: "ID",
      entryNumber: "Entry #",
      date: "Date",
      description: "Description",
      status: "Status",
      sourceType: "Source",
      postedAt: "Posted At",
    },
    errors: {
      unauthorized: { title: "Unauthorized", description: "Login required" },
      validation: {
        title: "Validation Error",
        description: "Check filter parameters",
      },
      forbidden: {
        title: "Forbidden",
        description: "Insufficient permissions",
      },
      server: {
        title: "Server Error",
        description: "Could not load journal entries",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: { title: "Conflict", description: "Data conflict" },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      notFound: { title: "Not Found", description: "No entries found" },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Entries Loaded",
      description: "Journal entries retrieved",
    },
  },
  title: "Journal List",
  description: "List journal entries",
  category: "Chart of Accounts",
  tag: "Journal",
};
