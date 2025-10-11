/**
 * Template Stats API translations for English
 */

export const translations = {
  // Common category and tags (shared from main template API)
  category: "Template API",
  tags: {
    statistics: "Statistics",
    analytics: "Analytics",
  },

  // Main stats endpoint
  title: "Get Template Statistics",
  description: "Retrieve basic template statistics and analytics",
  form: {
    title: "Statistics Parameters",
    description: "Configure filters for template statistics",
  },

  // Field labels
  status: {
    label: "Status Filter",
    description: "Filter templates by their status",
    placeholder: "Select one or more statuses",
  },
  tagFilter: {
    label: "Tag Filter",
    description: "Filter templates by tags",
    placeholder: "Select one or more tags",
  },
  dateFrom: {
    label: "Start Date",
    description: "Start date for the statistics period",
    placeholder: "Select start date",
  },
  dateTo: {
    label: "End Date",
    description: "End date for the statistics period",
    placeholder: "Select end date",
  },

  // Response
  response: {
    title: "Statistics Results",
    description: "Template statistics for the selected period",
  },

  // Errors
  errors: {
    validation: {
      title: "Invalid Parameters",
      description: "The provided filter parameters are invalid",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You do not have permission to view template statistics",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "Access to template statistics is forbidden",
    },
    notFound: {
      title: "Not Found",
      description: "The requested statistics could not be found",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while retrieving template statistics",
    },
    network: {
      title: "Network Error",
      description: "Unable to connect to the statistics service",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while processing your request",
    },
  },

  // Success
  success: {
    title: "Statistics Retrieved",
    description: "Template statistics retrieved successfully",
  },
};
