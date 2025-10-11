/**
 * Consultation List endpoint translations for English
 */

export const translations = {
  title: "List Consultations",
  description: "Retrieve a list of consultations with filtering and pagination",
  category: "Consultation",

  form: {
    title: "Consultation Filters",
    description: "Configure filters to find specific consultations",
  },

  search: {
    label: "Search",
    description: "Search consultations by message content or details",
    placeholder: "Enter search terms...",
  },

  userId: {
    label: "User ID",
    description: "Filter consultations by specific user ID",
    placeholder: "Enter user ID...",
  },

  status: {
    label: "Status",
    description: "Filter by consultation status (multi-select)",
    placeholder: "Select status(es)...",
  },

  dateFrom: {
    label: "Date From",
    description: "Start date for consultation date range filter",
    placeholder: "Select start date...",
  },

  dateTo: {
    label: "Date To",
    description: "End date for consultation date range filter",
    placeholder: "Select end date...",
  },

  sortBy: {
    label: "Sort By",
    description: "Choose fields to sort by (multi-select)",
    placeholder: "Select sort field(s)...",
  },

  sortOrder: {
    label: "Sort Order",
    description: "Choose sort direction (multi-select)",
    placeholder: "Select sort order(s)...",
  },

  limit: {
    label: "Limit",
    description: "Maximum number of consultations to return",
    placeholder: "Enter limit...",
  },

  offset: {
    label: "Offset",
    description: "Number of consultations to skip",
    placeholder: "Enter offset...",
  },

  columns: {
    id: "ID",
    userId: "User ID",
    status: "Status",
  },

  item: {
    title: "Consultation Item",
    description: "Individual consultation details",
    id: "Consultation ID",
    userId: "User ID",
    preferredDate: "Preferred Date",
    preferredTime: "Preferred Time",
    status: "Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
  },

  total: {
    title: "Total Consultations",
  },

  errors: {
    validation: {
      title: "Validation Error",
      description: "The filter parameters are invalid",
    },
    notFound: {
      title: "Not Found",
      description: "No consultations found with the specified filters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to list consultations",
    },
    forbidden: {
      title: "Access Denied",
      description: "You do not have permission to view these consultations",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while retrieving consultations",
    },
    network: {
      title: "Network Error",
      description:
        "Unable to connect to the server. Please check your internet connection",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred. Please try again later",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description:
        "You have unsaved filter changes that will be lost if you continue",
    },
    conflict: {
      title: "Conflict",
      description: "There is a conflict with the current consultation filters",
    },
  },

  success: {
    title: "Consultations Retrieved",
    description: "Successfully retrieved the consultation list",
  },
};
