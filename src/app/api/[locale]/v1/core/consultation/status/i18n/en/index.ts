/**
 * Consultation Status subdomain translations for English
 */

export const translations = {
  title: "Get Consultation Status",
  description: "Retrieve the current status of your consultation booking",
  category: "Consultation",
  tag: "Status",
  container: {
    title: "Consultation Status",
    description: "View your consultation booking status and details",
  },
  response: {
    title: "Status Details",
    description: "Current consultation status information",
    isScheduled: "Is Scheduled",
    scheduledAt: "Scheduled At",
    consultant: "Consultant",
    status: "Status",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "The request parameters are invalid",
    },
    notFound: {
      title: "Not Found",
      description: "No consultation found for your account",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to check consultation status",
    },
    forbidden: {
      title: "Access Denied",
      description: "You do not have permission to view this consultation",
    },
    server: {
      title: "Server Error",
      description: "An error occurred while retrieving consultation status",
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
      description: "You have unsaved changes that will be lost if you continue",
    },
    conflict: {
      title: "Conflict",
      description: "There is a conflict with the current consultation state",
    },
    internal: {
      title: "Internal Server Error",
      description:
        "An internal server error occurred while processing your request",
    },
    database: {
      title: "Database Error",
      description: "Failed to retrieve consultation data from the database",
    },
  },
  success: {
    title: "Status Retrieved",
    description: "Successfully retrieved your consultation status",
  },
};
