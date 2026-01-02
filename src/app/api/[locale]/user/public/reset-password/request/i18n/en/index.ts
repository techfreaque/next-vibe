import { translations as componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: componentsTranslations,
  title: "Reset Password Request",
  description: "Request password reset",
  tag: "Password Reset",
  email: {
    title: "Reset Your {{appName}} Password",
    subject: "Password Reset Request - {{appName}}",
    previewText:
      "Reset your password to regain access to your {{appName}} account and continue chatting with 38 AI models.",
    greeting: "Hello,",
    requestInfo:
      "We received a request to reset the password for your {{appName}} account.",
    instructions:
      "Click the button below to create a new password. This link is valid for 24 hours and can only be used once.",
    buttonText: "Reset My Password",
    expirationInfo: "This secure link expires in 24 hours for your protection.",
    securityInfo:
      "For your security, this password reset was requested from {{ipAddress}} on {{requestTime}}.",
    didntRequest: "Didn't Request This?",
    didntRequestInfo:
      "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged, and your account is secure.",
    needHelp: "Need Help?",
    needHelpInfo:
      "If you're having trouble resetting your password or accessing your account, our support team is here to help.",
    supportButton: "Contact Support",
    signoff: "Stay secure,\nThe {{appName}} Team",
    footer: "This is an automated security notification from {{appName}}",
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
      expiresAt: "24 hours from now",
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
};
