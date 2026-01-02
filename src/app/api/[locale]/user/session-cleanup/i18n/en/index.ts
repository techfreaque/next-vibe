export const translations = {
  task: {
    description: "Clean up expired user sessions to maintain system security",
    purpose: "Removes expired sessions to maintain security and performance",
    impact: "Improves system performance and security by removing stale session data",
    rollback: "Rollback not applicable for cleanup operations",
  },
  errors: {
    default: "An error occurred during session cleanup",
    execution_failed: {
      title: "Session Cleanup Failed",
      description: "Failed to clean up expired sessions",
    },
    partial_failure: {
      title: "Partial Session Cleanup Failure",
      description: "Some sessions could not be cleaned up",
    },
    unknown_error: {
      title: "Unknown Session Cleanup Error",
      description: "An unknown error occurred during session cleanup",
    },
    invalid_session_retention: {
      title: "Invalid Session Retention",
      description: "Invalid session retention period specified",
    },
    invalid_token_retention: {
      title: "Invalid Token Retention",
      description: "Invalid token retention period specified",
    },
    invalid_batch_size: {
      title: "Invalid Batch Size",
      description: "Invalid batch size specified for cleanup",
    },
    validation_failed: {
      title: "Validation Failed",
      description: "Session cleanup configuration validation failed",
    },
  },
  success: {
    title: "Session Cleanup Completed",
    description: "Successfully cleaned up expired sessions",
  },
  monitoring: {
    alertTrigger: "Session cleanup task failed",
  },
  documentation: {
    overview:
      "This task removes expired user sessions from the system to maintain security and performance",
  },
};
