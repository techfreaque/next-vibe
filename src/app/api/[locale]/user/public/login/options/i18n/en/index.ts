export const translations = {
  title: "Login Options",
  description: "Login configuration options",
  tag: "login-options",
  container: {
    title: "Login Configuration",
    description: "Configure login settings and options",
  },
  fields: {
    email: {
      label: "Email Address",
      description: "Enter your email address",
      placeholder: "your@email.com",
    },
    allowPasswordAuth: {
      label: "Allow Password Authentication",
      description: "Enable password-based authentication",
    },
    allowSocialAuth: {
      label: "Allow Social Authentication",
      description: "Enable social provider authentication",
    },
    maxAttempts: {
      label: "Maximum Login Attempts",
      description: "Maximum number of login attempts allowed",
    },
    requireTwoFactor: {
      label: "Require Two-Factor Authentication",
      description: "Require 2FA for user login",
    },
    socialProviders: {
      label: "Social Providers",
      description: "Available social authentication providers",
    },
    socialProvider: {
      title: "Social Provider",
      description: "Social authentication provider configuration",
      enabled: {
        label: "Enabled",
        description: "Whether this provider is enabled",
      },
      name: {
        label: "Provider Name",
        description: "Name of the social provider",
      },
      providers: {
        label: "Provider Options",
        description: "Available social provider options",
      },
    },
  },
  response: {
    title: "Login Options Response",
    description: "Available login configuration options",
    success: {
      badge: "Success",
    },
    message: {
      content: "Status Message",
    },
    forUser: {
      content: "Email Address",
    },
    loginMethods: {
      title: "Login Methods",
      description: "Available authentication methods",
      password: {
        title: "Password Login",
        description: "Standard password authentication",
        enabled: {
          badge: "Enabled",
        },
      },
      social: {
        title: "Social Login",
        description: "Social media authentication options",
        enabled: {
          badge: "Enabled",
        },
        providers: {
          item: {
            title: "Social Provider",
            description: "Social authentication provider",
          },
          name: {
            content: "Provider Name",
          },
          id: {
            content: "Provider ID",
          },
          enabled: {
            badge: "Available",
          },
          description: "Provider Description",
        },
      },
    },
    security: {
      title: "Security Settings",
      description: "Authentication security requirements",
      maxAttempts: {
        content: "Maximum Login Attempts",
      },
      requireTwoFactor: {
        badge: "2FA Required",
      },
    },
    recommendations: {
      item: "Recommended Login Option",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid request parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Authentication required",
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
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "Changes were not saved",
    },
  },
  success: {
    title: "Success",
    description: "Login options retrieved successfully",
  },
  post: {
    title: "Login Options",
    description: "Get available login options",
    response: {
      title: "Login Options Response",
      description: "Available login configuration options",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
    },
    success: {
      description: "Login options retrieved successfully",
    },
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  messages: {
    successMessage: "Login options retrieved successfully",
    passwordAuthDescription: "Log in with your email and password",
    socialAuthDescription: "Log in with your social media accounts",
    continueWithProvider: "Continue with {{provider}}",
    twoFactorRequired: "Enhanced security: 2FA required",
    standardSecurity: "Standard security requirements",
    tryPasswordFirst: "Try password login first",
    useSocialLogin: "Use social login",
    socialLoginFaster: "Social login is faster for new users",
  },
};
