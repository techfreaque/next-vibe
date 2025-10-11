export const translations = {
  post: {
    title: "[id]",
    description: "[id] endpoint",
    form: {
      title: "[id] Configuration",
      description: "Configure [id] parameters",
    },
    response: {
      title: "Response",
      description: "[id] response data",
      account: {
        title: "SMTP Account",
        description: "Updated SMTP account details",
        id: "Account ID",
        name: "Account Name",
        host: "SMTP Host",
        port: "Port",
        securityType: "Security Type",
        username: "Username",
        fromEmail: "From Email",
        status: "Account Status",
        healthCheckStatus: "Health Check Status",
        priority: "Priority",
        totalEmailsSent: "Total Emails Sent",
        lastUsedAt: "Last Used At",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },
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
