export const translations = {
  confirm: {
    category: "Users",

    title: "Confirm Password Reset",
    titleShort: "Confirm Reset",
    description: "Confirm your password reset with a new password",
    tag: "Password Reset",
    email: {
      title: "Password Reset Successful",
      subject: "Password Successfully Reset - {{appName}}",
      previewText:
        "Your {{appName}} password has been reset. Log in and start chatting with {{modelCount}} AI models.",
      greeting: "Hey {{name}},",
      successMessage:
        "Your password has been reset. You're all set - log in and pick up where you left off.",
      loginButton: "Log In to {{appName}}",
      promoText: "{{modelCount}} AI models. No filters. No lectures.",
      securityWarning:
        "Didn't reset your password? Contact support immediately - your account may be at risk.",
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
      no_email: "No account found with that email address",
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
    actions: {
      requestNewLink: "Request a New Reset Link",
    },
    emailTemplates: {
      confirm: {
        name: "Password Reset Confirmation Email",
        description:
          "Email sent to users after their password has been successfully reset",
        category: "Authentication",
        preview: {
          publicName: {
            label: "Public Name",
            description: "The user's public display name",
          },
          userId: {
            label: "User ID",
            description: "The user's unique identifier",
          },
        },
      },
    },
  },
  request: {
    category: "Users",
    title: "Reset Password Request",
    titleShort: "Reset Password",
    description: "Request password reset",
    tag: "Password Reset",
    ui: {
      title: "Reset Your Password",
      subtitle:
        "Enter your email address and we'll send you a link to reset your password",
      sendResetLink: "Send Reset Link",
      alreadyHaveAccount: "Already have an account? Sign in",
    },
    actions: {
      submitting: "Sending...",
    },
    email: {
      title: "Reset Your {{appName}} Password",
      subject: "Password Reset Request - {{appName}}",
      previewText:
        "Reset your {{appName}} password - link valid for {{hours}} hours.",
      greeting: "Hey {{name}},",
      requestInfo:
        "Someone requested a password reset for your {{appName}} account. If that was you, click the button below.",
      buttonText: "Reset My Password",
      expirationInfo:
        "Link expires in {{hours}} hours. If you didn't request this, ignore this email - your password is unchanged.",
      signoff: "The {{appName}} Team",
      promoText: "{{modelCount}} AI models. No filters. No lectures.",
    },
    groups: {
      emailInput: {
        title: "Email Input",
        description: "Enter your email address to receive reset instructions",
      },
    },
    fields: {
      email: {
        label: "Email Address",
        description: "Enter your email address",
        placeholder: "your@email.com",
        help: "Enter the email address associated with your account",
        validation: {
          invalid: "Please enter a valid email address",
        },
      },
    },
    response: {
      title: "Reset Request Response",
      description: "Password reset request response",
      success: {
        message: "Password reset link sent successfully",
      },
      deliveryInfo: {
        estimatedTime: "within 5 minutes",
        expiresAt: "4 hours from now",
      },
      nextSteps: {
        checkEmail: "Check your email inbox and spam folder",
        clickLink: "Click the reset link in the email",
        createPassword: "Create a new secure password",
      },
    },
    errors: {
      title: "Error",
      validation: {
        title: "Validation Error",
        description: "Invalid input provided",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Request not authorized",
      },
      internal: {
        title: "Internal Error",
        description: "Internal server error",
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
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "Changes were not saved",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
      no_email: "No account found with that email address",
      email_generation_failed: "Failed to generate email",
    },
    success: {
      title: "Request Sent",
      description: "Password reset request sent successfully",
    },
    post: {
      title: "Request",
      description: "Request endpoint",
      form: {
        title: "Request Configuration",
        description: "Configure request parameters",
      },
      response: {
        title: "Response",
        description: "Request response data",
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
    emailTemplates: {
      request: {
        name: "Password Reset Request Email",
        description: "Email sent to users with a link to reset their password",
        category: "Authentication",
        preview: {
          publicName: {
            label: "Public Name",
            description: "The user's public display name",
          },
          userId: {
            label: "User ID",
            description: "The user's unique identifier",
          },
          passwordResetUrl: {
            label: "Password Reset URL",
            description: "The URL for resetting the password",
          },
        },
      },
    },
  },
  validate: {
    category: "Users",

    title: "Validate Reset Password Token",
    titleShort: "Validate Token",
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
        validation: {
          required: "Reset token is required",
        },
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
  },
  actions: {
    back: "Back",
    submit: "Submit",
    submitting: "Submitting...",
  },
  success: {
    password_reset: "Your password has been successfully reset.",
  },
  errors: {
    tokenValidationFailed: "Token validation failed",
    userLookupFailed: "Failed to lookup user",
    tokenDeletionFailed: "Failed to delete token",
    userDeletionFailed: "Failed to delete user",
    resetFailed: "Password reset failed",
    tokenCreationFailed: "Failed to create reset token",
    noDataReturned: "No data returned from database",
    tokenInvalid: "Reset token is invalid",
    tokenExpired: "Reset token has expired",
    tokenVerificationFailed: "Token verification failed",
    userNotFound: "User not found",
    passwordUpdateFailed: "Failed to update password",
    passwordResetFailed: "Password reset failed",
    requestFailed: "Reset request failed",
    emailMismatch: "Email does not match",
    confirmationFailed: "Password reset confirmation failed",
  },
};
