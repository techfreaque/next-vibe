export const translations = {
  title: "Change Password",
  description: "Update your account password securely",
  tag: "password-change",
  groups: {
    currentCredentials: {
      title: "Current Password",
      description: "Verify your current password to proceed",
    },
    newCredentials: {
      title: "New Password",
      description: "Choose a strong new password for your account",
    },
  },
  currentPassword: {
    label: "Current Password",
    description: "Enter your current password",
    placeholder: "Enter current password",
    help: "Enter your current password to verify your identity before changing it",
  },
  newPassword: {
    label: "New Password",
    description: "Enter your new password (minimum 8 characters)",
    placeholder: "Enter new password",
    help: "Choose a strong password with at least 8 characters including letters, numbers, and symbols",
  },
  confirmPassword: {
    label: "Confirm Password",
    description: "Confirm your new password",
    placeholder: "Confirm new password",
    help: "Re-enter your new password to ensure it was typed correctly",
  },
  response: {
    title: "Password Change Response",
    description: "Response for password change operation",
    success: "Password Changed",
    message: "Status Message",
    securityTip: "Security Tip",
    nextSteps: {
      item: "Next Steps",
    },
  },
  validation: {
    currentPassword: {
      minLength: "Current password must be at least 8 characters",
    },
    newPassword: {
      minLength: "New password must be at least 8 characters",
    },
    confirmPassword: {
      minLength: "Password confirmation must be at least 8 characters",
    },
    passwords: {
      mismatch: "Passwords do not match",
    },
  },
  errors: {
    invalid_request: {
      title: "Invalid Request",
      description: "The password change request is invalid",
    },
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "You must be logged in to change your password",
    },
    server: {
      title: "Server Error",
      description: "Failed to update password due to server error",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred while updating password",
    },
    network: {
      title: "Network Error",
      description: "Network connection failed",
    },
    forbidden: {
      title: "Access Forbidden",
      description: "You don't have permission to perform this action",
    },
    notFound: {
      title: "User Not Found",
      description: "User account could not be found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes that will be lost",
    },
    conflict: {
      title: "Data Conflict",
      description: "A conflict occurred while updating the password",
    },
  },
  success: {
    title: "Password Updated",
    description: "Your password has been successfully updated",
  },
  update: {
    success: {
      title: "Password Updated",
      description: "Your password has been successfully updated",
    },
    errors: {
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while updating password",
      },
    },
  },
};
