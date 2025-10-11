import { translations as optionsTranslations } from "../../options/i18n/en";

export const translations = {
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
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
};
