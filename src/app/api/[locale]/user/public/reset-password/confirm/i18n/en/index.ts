export const translations = {
  title: "Confirm Password Reset",
  description: "Confirm your password reset with a new password",
  tag: "Password Reset",
  email: {
    title: "Password Reset Successful",
    subject: "Your Password Has Been Reset",
    previewText: "Your password has been reset successfully",
    greeting: "Hello,",
    confirmationMessage: "Your password has been successfully reset.",
    successMessage: "Your password has been successfully reset.",
    loginInstructions: "You can now log in with your new password.",
    securityWarning:
      "If you did not make this change, please contact support immediately.",
    securityTip:
      "For your security, we recommend using a strong, unique password.",
    securityNote:
      "If you did not make this change, please contact support immediately.",
  },
  groups: {
    verification: {
      title: "Verification",
      description: "Verify your password reset request",
    },
    newPassword: {
      title: "New Password",
      description: "Set your new password",
    },
  },
  fields: {
    token: {
      label: "Reset Token",
      description: "The password reset token from your email",
      placeholder: "Enter reset token",
      help: "Check your email for the password reset token and enter it here",
      validation: {
        required: "Reset token is required",
      },
    },
    email: {
      label: "Email Address",
      description: "Your email address",
      placeholder: "Enter your email address",
      validation: {
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "New Password",
      description: "Your new password",
      placeholder: "Enter new password",
      help: "Choose a strong password with at least 8 characters including letters, numbers, and symbols",
      validation: {
        minLength: "Password must be at least 8 characters long",
      },
    },
    confirmPassword: {
      label: "Confirm Password",
      description: "Confirm your new password",
      placeholder: "Confirm new password",
      validation: {
        minLength: "Password must be at least 8 characters long",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Passwords do not match",
    },
  },
  response: {
    title: "Password Reset Response",
    description: "Password reset confirmation response",
    message: {
      label: "Message",
      description: "Response message",
    },
    securityTip:
      "Consider enabling two-factor authentication for better security",
    nextSteps: [
      "Log in with your new password",
      "Update saved passwords in your browser",
      "Consider enabling 2FA for added security",
    ],
  },
  errors: {
    title: "Password Reset Error",
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
      passwordsDoNotMatch: "Passwords do not match",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Invalid or expired reset token",
    },
    internal: {
      title: "Server Error",
      description: "An internal server error occurred",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network connection error",
    },
    forbidden: {
      title: "Access Denied",
      description: "You do not have permission to perform this action",
    },
    notFound: {
      title: "Not Found",
      description: "Reset token not found or expired",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
    conflict: {
      title: "Conflict",
      description: "A conflict occurred while processing your request",
    },
  },
  success: {
    title: "Password Reset Successful",
    description: "Your password has been successfully reset",
    message: "Password has been reset successfully",
    password_reset: "Your password has been successfully reset",
  },
};
