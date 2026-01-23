import { translations as _componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: _componentsTranslations,
  title: "User Signup",
  description: "User registration endpoint",
  tag: "Authentication",
  form: {
    title: "Create Your Account",
    description: "Join the community for uncensored AI conversations",
  },
  actions: {
    submit: "Create Account",
    submitting: "Creating Account...",
  },
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
      description: "Your full name (visible only to you)",
      placeholder: "Enter your name",
      help: "Enter your private name for internal use",
      validation: {
        required: "Private name is required",
        minLength: "Name must be at least 2 characters",
        maxLength: "Name must be less than 100 characters",
      },
    },
    publicName: {
      label: "Display Name",
      description: "Your public display name",
      placeholder: "Enter display name",
      help: "Enter your public name as it will be displayed to others",
      validation: {
        required: "Display name is required",
        minLength: "Display name must be at least 2 characters",
        maxLength: "Display name must be less than 100 characters",
      },
    },
    email: {
      label: "Email",
      description: "Your email address",
      placeholder: "Enter email address",
      help: "This will be your login email and primary contact method",
      validation: {
        required: "Email is required",
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Password",
      description: "Create a secure password",
      placeholder: "Enter password",
      help: "Password must be at least 8 characters with uppercase, lowercase, and number",
      validation: {
        required: "Password is required",
        minLength: "Password must be at least 8 characters",
        complexity: "Password must contain uppercase, lowercase, and a number",
      },
    },
    confirmPassword: {
      label: "Confirm Password",
      description: "Confirm your password",
      placeholder: "Re-enter password",
      help: "Re-enter your password to confirm it matches",
      validation: {
        required: "Please confirm your password",
        minLength: "Password must be at least 8 characters",
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
    referralCode: {
      label: "Referral Code",
      description: "Optional referral code from a friend",
      placeholder: "Enter referral code (optional)",
      help: "If you have a referral code, enter it here to get started",
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
  footer: {
    alreadyHaveAccount: "Already have an account? Sign in",
  },
  errors: {
    title: "Signup Error",
    validation: {
      title: "Validation Error",
      description: "Please check your input and try again",
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
      description: "An unexpected error occurred",
    },
    conflict: {
      title: "Account Conflict",
      description: "An account with this email already exists",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access denied",
    },
    network: {
      title: "Network Error",
      description: "Network error occurred",
    },
    notFound: {
      title: "Not Found",
      description: "Resource not found",
    },
    unsaved: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    internal: {
      title: "Internal Error",
      description: "An internal error occurred",
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
    direct_signup: "Direct Signup",
    newsletter: "Newsletter",
    subscribed: "Subscribed",
    not_subscribed: "Not Subscribed",
    signup_details: "Signup Details",
    signup_date: "Signup Date",
    user_id: "User ID",
    recommended_next_steps: "Recommended Next Steps",
    direct_recommendation: "Review user profile and payment setup",
    contact_user: "Contact User",
    footer: "This is an automated notification from {{appName}}",
  },
  email: {
    title: "Welcome to {{appName}}, {{privateName}}!",
    subject: "Welcome to {{appName}} - Your Uncensored AI Awaits",
    previewText:
      "Access 38 AI models without filters or restrictions. Start chatting now with 20 free credits!",
    welcomeMessage: "You're In! Welcome to Uncensored AI",
    description:
      "Your account is ready. You have 20 free credits to start chatting with any of our 38 AI models—including Claude Sonnet 4.5, GPT-5.2 Pro, Gemini 3 Pro, Kimi K2, DeepSeek R1, and exclusive uncensored models like UncensoredLM v1.2, FreedomGPT Liberty, and Grok 4. No filters. No restrictions. Just honest AI conversations.",
    ctaTitle: "Start Chatting Now",
    ctaButton: "Launch AI Chat",
    whatYouGet: "What You Get (100% Free)",
    feature1: "20 credits per month—forever",
    feature2: "Access to all 38 AI models",
    feature3: "Uncensored models that won't refuse to answer",
    feature4: "Private, Incognito, Shared, and Public chat modes",
    feature5: "Community forum with other AI enthusiasts",
    needMore: "Ready for Unlimited Conversations?",
    needMoreDesc:
      "Get 40× more credits—800/month for just €8! That's unlimited access to all 38 models with no daily limits. Perfect for serious AI users. Plus, subscribe and unlock the ability to buy credit packs that never expire—ideal for power users who need extra credits on demand.",
    viewPlans: "Upgrade to Unlimited Now",
    signoff: "Welcome to the future of AI conversations,\nThe {{appName}} Team",
    ps: "P.S. Your privacy matters. Choose Incognito mode to keep conversations on your device only—never sent to our servers.",
  },
};
