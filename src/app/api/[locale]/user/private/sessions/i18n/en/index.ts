export const translations = {
  list: {
    title: "My Sessions",
    description: "List all active sessions for your account",
    tag: "Sessions",
    response: {
      sessions: "Sessions",
    },
    success: {
      title: "Sessions retrieved",
      description: "Your active sessions have been retrieved",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: { title: "Validation Error", description: "Invalid request" },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "Resource not found" },
      conflict: { title: "Conflict", description: "Data conflict" },
    },
  },
  create: {
    title: "Create Session Token",
    description: "Create a named session token for programmatic access",
    tag: "Sessions",
    form: {
      name: "Token Name",
      namePlaceholder: "e.g. My agent bot",
    },
    response: {
      token: "Token",
      id: "Session ID",
      name: "Name",
      message: "Copy this token — it will not be shown again",
    },
    success: {
      title: "Session created",
      description: "Your session token has been created",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: { title: "Validation Error", description: "Invalid request" },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "Resource not found" },
      conflict: { title: "Conflict", description: "Data conflict" },
    },
  },
  revoke: {
    title: "Revoke Session",
    description: "Revoke a session token by ID",
    tag: "Sessions",
    response: {
      message: "Session revoked",
    },
    success: {
      title: "Session revoked",
      description: "The session has been revoked",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: { title: "Validation Error", description: "Invalid request" },
      server: { title: "Server Error", description: "Internal server error" },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: { title: "Forbidden", description: "Access forbidden" },
      notFound: { title: "Not Found", description: "Session not found" },
      conflict: { title: "Conflict", description: "Data conflict" },
    },
  },
};
