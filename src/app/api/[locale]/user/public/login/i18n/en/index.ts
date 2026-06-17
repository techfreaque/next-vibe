export const translations = {
  category: "Users",
  title: "Welcome Back",
  titleShort: "Sign In",
  description: "Access uncensored AI models and your conversation history.",
  tag: "Authentication",
  options: {
    category: "Users",

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
  },
  actions: {
    submit: "Login",
    submitting: "Logging in...",
  },
  fields: {
    email: {
      label: "Your Email",
      description: "The email you signed up with.",
      placeholder: "Enter your email",
      validation: {
        required: "Email is required",
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Your Password",
      description: "Enter the password you set during signup.",
      placeholder: "Enter your password",
      help: "Enter your account password",
      validation: {
        required: "Password is required",
        minLength: "Password must be at least 8 characters long",
      },
    },
    rememberMe: {
      label: "Keep me logged in",
    },
  },
  groups: {
    credentials: {
      title: "Login Credentials",
      description: "Enter your login information",
    },
    options: {
      title: "Login Options",
      description: "Additional login preferences and settings",
    },
    preferences: {
      title: "Login Preferences",
      description: "Additional login options",
    },
    advanced: {
      title: "Advanced Options",
      description: "Advanced login settings",
    },
  },
  footer: {
    forgotPassword: "Forgot password?",
    createAccount: "Don't have an account? Sign up",
  },
  response: {
    title: "Login Response",
    description: "Login response data",
    success: "Login Successful",
    message: "Status Message",
    user: {
      title: "User Details",
      description: "Logged in user information",
      id: "User ID",
      email: "Email Address",
      firstName: "First Name",
      lastName: "Last Name",
      privateName: "Private Name",
      publicName: "Public Name",
      imageUrl: "Profile Image",
    },
    sessionInfo: {
      title: "Session Information",
      description: "User session details",
      expiresAt: "Session Expires",
      rememberMeActive: "Remember Me Status",
      loginLocation: "Login Location",
    },
    nextSteps: {
      title: "Next Steps",
      item: "Next Steps",
    },
  },
  errors: {
    title: "Login Error",
    account_locked: "Account is locked",
    accountLocked: "Account is locked",
    accountLockedDescription:
      "Your account has been locked. Please contact support.",
    invalid_credentials: "Invalid email or password",
    two_factor_required: "Two-factor authentication required",
    auth_error: "Authentication error occurred",
    user_not_found: "User not found",
    session_creation_failed: "Failed to create session",
    token_save_failed: "Failed to save authentication token",
    validation: {
      title: "Validation Failed",
      description: "Please check your input",
    },
    unauthorized: {
      title: "Login Failed",
      description: "Invalid credentials",
    },
    unknown: {
      title: "Login Error",
      description: "An error occurred during login",
    },
    network: {
      title: "Network Error",
      description: "Connection failed",
    },
    forbidden: {
      title: "Access Denied",
      description: "Login not allowed",
    },
    notFound: {
      title: "User Not Found",
      description: "User account not found",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "Changes were not saved",
    },
    conflict: {
      title: "Login Conflict",
      description: "Login conflict detected",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
  },
  success: {
    title: "Login Successful",
    description: "You have been logged in",
    message: "Welcome back! You have successfully logged in.",
  },
  token: {
    save: {
      failed: "Failed to save authentication token",
      success: "Authentication token saved successfully",
    },
  },
  process: {
    failed: "Login process failed",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
  dev: {
    quickLogin: "Dev Quick Login",
  },
};
