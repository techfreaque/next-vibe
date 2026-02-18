import { translations as _componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  _components: _componentsTranslations,
  title: "User Signup",
  description: "User registration endpoint",
  tag: "Authentication",
  form: {
    title: "Welcome to Uncensored AI",
    description:
      "Help build uncensored, privacy-first, and truly independent AI. unbottled.ai is open source and community-driven, your signup supports the development of AI technology that respects your freedom.",
  },
  actions: {
    submit: "Create Account",
    submitting: "Creating Account...",
  },
  fields: {
    privateName: {
      label: "Your Private Name",
      description:
        "How the AI will address you in private conversations. This stays between you and the AI - completely private.",
      placeholder: "Enter your name",
      validation: {
        required: "Private name is required",
        minLength: "Name must be at least 2 characters",
        maxLength: "Name must be less than 100 characters",
      },
    },
    publicName: {
      label: "Your Public Name",
      description:
        "Your identity in public chats and forums. Other users and AIs will see this name. Choose wisely - it represents you in the community.",
      placeholder: "Enter display name",
      validation: {
        required: "Display name is required",
        minLength: "Display name must be at least 2 characters",
        maxLength: "Display name must be less than 100 characters",
      },
    },
    email: {
      label: "Your Email",
      description:
        "Your login credentials and contact method. Kept private - never shared with other users or AIs.",
      placeholder: "Enter email address",
      help: "This will be your login email and primary contact method",
      validation: {
        required: "Email is required",
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Your Password",
      description:
        "Strong passwords protect your account. We're implementing end-to-end encryption soon - at that point, password resets will clear your message history since only you hold the decryption key. Save it somewhere safe.",
      placeholder: "Enter password",
      validation: {
        required: "Password is required",
        minLength: "Password must be at least 8 characters",
        complexity: "Password must contain uppercase, lowercase, and a number",
      },
    },
    confirmPassword: {
      label: "Confirm Your Password",
      validation: {
        required: "Please confirm your password",
        minLength: "Password must be at least 8 characters",
        mismatch: "Passwords do not match",
      },
    },
    subscribeToNewsletter: {
      label: "Subscribe to Newsletter",
      description:
        "Occasional updates about new models and features. No spam, just what matters.",
    },
    acceptTerms: {
      label: "Accept Terms & Conditions",
      description: "Our terms and conditions respect your freedom and privacy.",
      validation: {
        required: "You must accept the terms and conditions to continue",
      },
    },
    referralCode: {
      label: "Referral Code (optional)",
      description:
        "Have a friend on unbottled.ai? Enter their code to support them. They get rewarded for bringing you in.",
      placeholder: "Enter referral code (optional)",
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
    subject: "You're in - {{appName}} is ready for you",
    previewText:
      "Hey {{privateName}}, your account is ready. Chat with Claude, GPT, Gemini, DeepSeek, and {{modelCount}} more - free, no card needed.",
    headline: "Your AI is waiting.",
    greeting: "Hey {{privateName}},",
    intro:
      "Welcome to {{appName}}. You just unlocked access to the most complete AI chat platform out there - everything you love about ChatGPT, plus open-source models, and models without content filters.",
    models: {
      title: "{{modelCount}} models across 3 categories",
      mainstream: "Mainstream",
      open: "Open Source",
      uncensored: "Uncensored",
    },
    free: {
      title: "What you get for free, forever:",
      credits: "20 credits per month - no card, no expiry",
      allModels: "Access to all {{modelCount}} AI models",
      uncensored: "4 uncensored models that actually answer your questions",
      chatModes: "Private, Incognito, Shared, and Public chat modes",
      noCard: "No credit card required - ever",
    },
    ctaButton: "Start Chatting Now",
    upgrade: {
      title: "Want more?",
      desc: "€8/month gets you 800 credits - that's 40× more. Plus you can buy extra credit packs that never expire. Perfect if you use AI daily.",
      cta: "See Unlimited Plan",
    },
    signoff: "Happy chatting,\nThe {{appName}} Team",
    ps: "P.S. Use Incognito mode to keep conversations on your device only - we never store them on our servers.",
  },
};
