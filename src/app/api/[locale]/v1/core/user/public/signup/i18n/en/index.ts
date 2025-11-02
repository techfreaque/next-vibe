
import { translations as _componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: _componentsTranslations,
  title: "User Signup",
  description: "User registration endpoint",
  tag: "Authentication",
  fields: {
    firstName: {
      label: "First Name",
      description: "User's first name",
      placeholder: "Enter first name",
      help: "Enter your first name as it should appear on your profile",
    },
    lastName: {
      label: "Last Name",
      description: "User's last name",
      placeholder: "Enter last name",
      help: "Enter your last name as it should appear on your profile",
    },
    privateName: {
      label: "Private Name",
      description: "User's private name",
      placeholder: "Enter private name",
      help: "Enter your private name for internal use",
    },
    publicName: {
      label: "Public Name",
      description: "User's public name",
      placeholder: "Enter public name",
      help: "Enter your public name as it will be displayed to others",
    },
    email: {
      label: "Email",
      description: "User's email address",
      placeholder: "Enter email address",
      help: "This will be your login email and primary contact method",
    },
    password: {
      label: "Password",
      description: "User's password",
      placeholder: "Enter password",
      help: "Password must be at least 8 characters",
    },
    confirmPassword: {
      label: "Confirm Password",
      description: "Confirm your password",
      placeholder: "Re-enter password",
      help: "Re-enter your password to confirm it matches",
      validation: {
        mismatch: "Passwords do not match",
      },
    },
    phone: {
      label: "Phone Number",
      description: "User's phone number",
      placeholder: "Enter phone number",
      help: "Phone number for account recovery and notifications (optional)",
    },
    company: {
      label: "Company",
      description: "User's company name",
      placeholder: "Enter company name",
      help: "Your company or organization name (optional)",
    },
    leadId: {
      label: "Lead ID",
      description: "Lead identifier for tracking",
      placeholder: "Enter lead ID",
      help: "Internal lead identifier (optional)",
    },
    preferredContactMethod: {
      label: "Preferred Contact Method",
      description: "How you prefer to be contacted",
      placeholder: "Select contact method",
      help: "Choose how you'd like us to reach you",
    },
    signupType: {
      label: "Signup Source",
      description: "Where you signed up from",
      placeholder: "Select signup source",
      help: "How did you find us?",
    },
    acceptTerms: {
      label: "Accept Terms",
      description: "Accept our terms and conditions",
      placeholder: "I accept the terms and conditions",
      help: "Please review and accept our terms and conditions to continue",
      validation: {
        required: "You must accept the terms and conditions to continue",
      },
    },
    subscribeToNewsletter: {
      label: "Subscribe to Newsletter",
      description: "Receive updates and news via email",
      placeholder: "Subscribe to our newsletter",
      help: "Get the latest updates, tips, and exclusive offers delivered to your inbox",
    },
    imageUrl: {
      label: "Profile Image URL",
      description: "URL for your profile picture",
      placeholder: "Enter image URL",
      help: "Optional: Provide a URL for your profile picture",
    },
  },
  groups: {
    personalInfo: {
      title: "Personal Information",
      description: "Enter your personal details",
    },
    security: {
      title: "Security",
      description: "Set up your account security",
    },
    businessInfo: {
      title: "Business Information",
      description: "Enter your business details",
    },
    preferences: {
      title: "Preferences",
      description: "Set your communication preferences",
    },
    consent: {
      title: "Terms and Consent",
      description: "Review and accept our terms and conditions",
    },
    advanced: {
      title: "Advanced Options",
      description: "Additional configuration options",
    },
  },
  errors: {
    title: "Signup Error",
    conflict: {
      title: "Account Conflict",
      description: "Account already exists",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred",
    },
    network: {
      title: "Network Error",
      description: "Network error occurred",
    },
  },
  emailCheck: {
    title: "Email Availability Check",
    description: "Check if email is available for registration",
    tag: "Email Check",
    fields: {
      email: {
        label: "Email Address",
        description: "Email to check",
        placeholder: "Enter email address",
        validation: {
          invalid: "Invalid email format",
        },
      },
    },
    response: {
      title: "Email Check Response",
      description: "Email availability check result",
      available: "Email Available",
      message: "Availability Message",
    },
    errors: {
      validation: {
        title: "Invalid Email",
        description: "Please enter a valid email address",
      },
      internal: {
        title: "Email Check Error",
        description: "Error checking email availability",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      conflict: {
        title: "Email Already Taken",
        description: "This email is already registered",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to check this email",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while checking email",
      },
      notFound: {
        title: "Service Not Found",
        description: "Email check service is not available",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required to check email",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Email Check Complete",
      description: "Email availability checked successfully",
    },
  },
  post: {
    title: "Signup",
    description: "Signup endpoint",
    form: {
      title: "Signup Configuration",
      description: "Configure signup parameters",
    },
    response: {
      title: "Response",
      description: "Signup response data",
      success: "Signup Successful",
      message: "Status Message",
      userId: "User ID",
      nextSteps: "Next Steps",
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
      unsaved: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
      processing: "Processing signup successfully",
    },
  },
  response: {
    title: "Response",
    description: "Signup response data",
    success: "Signup Successful",
    message: "Status Message",
    user: {
      id: "User ID",
      email: "Email Address",
      firstName: "First Name",
      lastName: "Last Name",
      privateName: "Private Name",
      publicName: "Public Name",
      imageUrl: "Profile Image URL",
      verificationRequired: "Verification Required",
    },
    verificationInfo: {
      title: "Email Verification",
      description: "Details about the email verification process",
      emailSent: "Email Sent",
      expiresAt: "Verification Expires At",
      checkSpamFolder: "Check Spam Folder",
    },
    nextSteps: "Next Steps",
  },
  success: {
    title: "Signup Successful",
    description: "Your account has been created successfully",
  },
  enums: {
    signupType: {
      meeting: "Meeting Signup",
      pricing: "Pricing Signup",
    },
  },
  admin_notification: {
    title: "New User Signup",
    subject: "New User Signup - {{privateName}}",
    preview: "New user {{privateName}} has signed up",
    message: "A new user has signed up for {{appName}}",
    privateName: "Private Name",
    publicName: "Public Name",
    email: "Email",
    signup_preferences: "Signup Preferences",
    user_details: "User Details",
    basic_information: "Basic Information",
    signup_type: "Signup Type",
    consultation_first: "Consultation First",
    direct_signup: "Direct Signup",
    newsletter: "Newsletter",
    subscribed: "Subscribed",
    not_subscribed: "Not Subscribed",
    signup_details: "Signup Details",
    signup_date: "Signup Date",
    user_id: "User ID",
    recommended_next_steps: "Recommended Next Steps",
    consultation_recommendation: "Schedule a consultation call",
    direct_recommendation: "Review user profile and payment setup",
    contact_user: "Contact User",
    footer: "This is an automated notification from {{appName}}",
  },
  email: {
    title: "Welcome to {{appName}}!",
    subject: "Welcome to {{appName}}!",
    previewText: "Welcome to {{appName}}! Start your AI chat experience.",
    welcomeMessage: "Welcome to {{appName}}!",
    description: "You're now ready to start chatting with AI and joining our community forum.",
    ctaTitle: "Get Started",
    ctaButton: "Go to Subscription",
    signoff: "Best regards,\nThe {{appName}} Team",
  },
};
