export const translations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "No token in cookies",
    },
  },
  errors: {
    session_not_found: "Session not found for token {{token}}",
    session_token_missing: "No session token found ({{reason}})",
    session_lookup_failed: "Failed to look up session {{token}}: {{error}}",
    current_session_failed: "Failed to read the current session: {{error}}",
    expired_sessions_delete_failed: "Failed to delete expired sessions",
    session_creation_failed: "Failed to create session for user {{userId}}",
    session_creation_database_error:
      "Database error creating session for user {{userId}}: {{error}}",
    user_sessions_delete_failed:
      "Failed to delete session {{sessionId}}: {{error}}",
    expired: "Session expired at {{expiresAt}}",
  },
  post: {
    title: "Session",
    description: "Session endpoint",
    form: {
      title: "Session Configuration",
      description: "Configure session parameters",
    },
    response: {
      title: "Response",
      description: "Session response data",
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
