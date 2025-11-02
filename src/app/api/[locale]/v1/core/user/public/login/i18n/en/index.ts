import { translations as optionsTranslations } from "../../options/i18n/en";
import { translations as _componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: _componentsTranslations,
  title: "Login",
  description: "User login endpoint",
  tag: "Authentication",
  options: optionsTranslations,
  fields: {
    email: {
      label: "Email",
      description: "User email address",
      placeholder: "Enter your email",
      help: "Enter the email address associated with your account",
      validation: {
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Password",
      description: "User password",
      placeholder: "Enter your password",
      help: "Enter your account password",
      validation: {
        minLength: "Password must be at least 8 characters long",
      },
    },
    rememberMe: {
      label: "Remember Me",
      description: "Keep me logged in",
      placeholder: "Remember me",
      help: "Stay logged in on this device for easier access",
    },
    leadId: {
      label: "Lead ID",
      description: "Optional lead identifier",
      placeholder: "Enter lead ID",
      help: "Optional lead identifier for tracking",
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
};
