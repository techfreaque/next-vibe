export const translations = {
  pages: {
    error: {
      title: "Something went wrong!",
      message: "We're sorry, but something unexpected happened.",
      errorId: "Error ID: {{id}}",
      error_message: "Error: {{message}}",
      stackTrace: "Stack Trace: {{stack}}",
      tryAgain: "Try Again",
      backToHome: "Back to Home",
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      goBack: "Go Back",
      goHome: "Go Home",
    },
  },
  meta: {
    title: "404 - Page Not Found",
    category: "Error",
    description: "The page you're looking for doesn't exist",
    imageAlt: "404 Not Found",
    keywords: "404, not found, error",
  },
  post: {
    title: "[...notFound]",
    description: "[...notFound] endpoint",
    form: {
      title: "[...notFound] Configuration",
      description: "Configure [...notfound] parameters",
    },
    response: {
      title: "Response",
      description: "[...notFound] response data",
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
