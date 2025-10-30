import { translations as hooksTranslations } from "../hooks/i18n/en";

export const translations = {
  hooks: hooksTranslations,
  store: {
    errors: {
      validation_failed: "Validation failed",
      request_failed: "Request failed",
      mutation_failed: "Mutation failed",
      unexpected_failure: "Unexpected failure",
      refetch_failed: "Refetch failed",
    },
    status: {
      loading_data: "Loading data...",
      cached_data: "Using cached data",
      success: "Success",
      mutation_pending: "Mutation pending...",
      mutation_success: "Mutation successful",
    },
  },
  widgets: {
    container: {
      noContent: "No content",
    },
    dataTable: {
      showing: "Showing",
      of: "of",
      results: "results",
    },
    linkList: {
      noResults: "No results found",
    },
    link: {
      invalidData: "Invalid link data",
    },
    markdown: {
      noContent: "No content",
    },
    errorBoundary: {
      title: "Widget Error",
      errorDetails: "Error Details",
      defaultMessage: "An error occurred while rendering this widget",
    },
  },
  post: {
    title: "Next",
    description: "Next endpoint",
    form: {
      title: "Next Configuration",
      description: "Configure next parameters",
    },
    response: {
      title: "Response",
      description: "Next response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
