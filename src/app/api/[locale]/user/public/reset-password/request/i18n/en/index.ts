export const translations = {
  category: "Users",
  title: "Reset Password Request",
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
      "Reset your {{appName}} password — link valid for {{hours}} hours.",
    greeting: "Hey {{name}},",
    requestInfo:
      "Someone requested a password reset for your {{appName}} account. If that was you, click the button below.",
    buttonText: "Reset My Password",
    expirationInfo:
      "Link expires in {{hours}} hours. If you didn't request this, ignore this email — your password is unchanged.",
    signoff: "— The {{appName}} Team",
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
};
