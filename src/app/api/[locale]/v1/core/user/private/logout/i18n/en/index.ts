export const translations = {
  title: "User Logout",
  description: "Logs out the current user and invalidates their session",
  category: "User Management",
  tag: "logout",
  response: {
    title: "Logout Response",
    description: "Response indicating successful logout",
    success: "Success",
    message: "Message",
    sessionsCleaned: "Sessions Cleaned",
    nextSteps: "Recommended next steps after logout",
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "The logout request contains invalid data",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to logout",
    },
    internal: {
      title: "Internal Server Error",
      description: "An internal error occurred while logging out",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred during logout",
    },
    session_deletion_failed: {
      title: "Session Deletion Failed",
      description: "Failed to delete the user session",
    },
    conflict: {
      title: "Logout Conflict",
      description: "A conflict occurred during logout",
    },
    forbidden: {
      title: "Forbidden",
      description: "Logout action is forbidden",
    },
    network_error: {
      title: "Network Error",
      description: "Network error during logout",
    },
    not_found: {
      title: "Not Found",
      description: "Session not found",
    },
    server_error: {
      title: "Server Error",
      description: "Internal server error during logout",
    },
    unsaved_changes: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
    invalid_user: {
      title: "Invalid User",
      description: "The user is not valid or does not exist",
    },
  },
  success: {
    title: "Logout Successful",
    description: "You have been logged out successfully",
    message: "User logged out successfully",
  },
};
