export const translations = {
  title: "Validate Reset Password Token",
  description: "Validate password reset token endpoint",
  tag: "Password Reset Validation",
  groups: {
    tokenInput: {
      title: "Token Validation",
      description: "Enter the password reset token to validate",
    },
  },
  fields: {
    token: {
      label: "Reset Token",
      description: "Password reset token from email",
      placeholder: "Enter reset token",
      help: "Enter the token you received in your email",
    },
  },
  response: {
    title: "Validation Result",
    description: "Token validation response",
    valid: "Token Valid",
    message: "Validation Message",
    validationMessage: "Reset token validation completed",
    userId: "User ID",
    expiresAt: "Token Expires At",
    nextSteps: {
      item: "Next Steps After Validation",
      steps: [
        "Proceed to set your new password",
        "Choose a strong, unique password",
      ],
    },
  },
  errors: {
    title: "Error",
    validation: {
      title: "Validation Error",
      description: "Token validation failed",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Invalid or expired token",
    },
    internal: {
      title: "Internal Error",
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
      description: "Token not found",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "Unsaved changes detected",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
  },
  success: {
    title: "Token Valid",
    description: "Password reset token is valid",
  },
  post: {
    title: "Validate",
    description: "Validate endpoint",
    form: {
      title: "Validate Configuration",
      description: "Configure validate parameters",
    },
    response: {
      title: "Response",
      description: "Validate response data",
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
