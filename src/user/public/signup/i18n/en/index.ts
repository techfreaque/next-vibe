export const translations = {
  category: "Users",

  _components: {
    passwordStrength: {
      label: "Password Strength",
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
      requirement: {
        minLength: {
          icon: "✗",
          text: "At least 8 characters",
        },
        uppercase: {
          icon: "✗",
          text: "At least one uppercase letter",
        },
        lowercase: {
          icon: "✗",
          text: "At least one lowercase letter",
        },
        number: {
          icon: "✗",
          text: "At least one number",
        },
        special: {
          icon: "!",
          text: "Special character (optional, improves strength)",
        },
      },
    },
    post: {
      title: "_components",
      description: "_components endpoint",
      form: {
        title: "_components Configuration",
        description: "Configure _components parameters",
      },
      response: {
        title: "Response",
        description: "_components response data",
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
  title: "User Signup",
  titleShort: "Sign Up",
  description: "User registration endpoint",
  tag: "Authentication",
  form: {
    title: "Create your account",
    description: "Every model. Your rules. Free to start.",
  },
  actions: {
    submit: "Create Account",
    submitting: "Creating Account...",
  },
  fields: {
    privateName: {
      label: "Private name",
      description: "What the AI calls you. Never shown to anyone else.",
      placeholder: "e.g. Alex",
      validation: {
        required: "Private name is required",
        minLength: "Name must be at least 2 characters",
        maxLength: "Name must be less than 100 characters",
      },
    },
    publicName: {
      label: "Public name",
      description: "Shown in shared chats and forums.",
      placeholder: "e.g. alex_builds",
      validation: {
        required: "Display name is required",
        minLength: "Display name must be at least 2 characters",
        maxLength: "Display name must be less than 100 characters",
      },
    },
    email: {
      label: "Email",
      description: "For login only. Never shared.",
      placeholder: "you@example.com",
      help: "This will be your login email and primary contact method",
      validation: {
        required: "Email is required",
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Password",
      description:
        "8+ characters with upper, lower and a number. Store it safe: end-to-end encryption is coming, and a reset will then wipe your history.",
      placeholder: "Create a password",
      validation: {
        required: "Password is required",
        minLength: "Password must be at least 8 characters",
        complexity: "Password must contain uppercase, lowercase, and a number",
      },
    },
    confirmPassword: {
      label: "Confirm password",
      validation: {
        required: "Please confirm your password",
        minLength: "Password must be at least 8 characters",
        mismatch: "Passwords do not match",
      },
    },
    subscribeToNewsletter: {
      label: "Join the newsletter for bonus free credits every month",
      description:
        "Adds the account email to the newsletter. Once the verification email link is clicked, the account gets bonus free credits every month while subscribed. One bonus per account.",
      checkboxLabel:
        "Join the newsletter: +{{credits}} free credits every month",
      hint: "New models and product news every few weeks. Your verification email confirms it. Unsubscribe anytime.",
      tooltip:
        "Tick it and we add you to the newsletter. Once you click the link in your verification email, your account gets {{credits}} extra free credits every month, {{total}} in total, for as long as you stay subscribed. One bonus per account.",
    },
    acceptTerms: {
      label: "I accept the terms",
      description: "Our terms and conditions respect your freedom and privacy.",
      termsLink: "terms",
      conditionsLink: "conditions",
      descriptionPrefix: "Our",
      descriptionAnd: "and",
      descriptionSuffix: "respect your freedom and privacy.",
      validation: {
        required: "You must accept the terms and conditions to continue",
      },
    },
    referralCode: {
      label: "Referral code (optional)",
      description: "Got a code from a friend? They earn when you subscribe.",
      placeholder: "Enter code",
      labelPrefilled: "Referral code",
      descriptionPrefilled:
        "Your friend gets rewarded when you create your account.",
      validation: {
        invalid:
          "That referral code doesn't exist or is no longer active. Fix it or clear the field.",
      },
    },
    supportedSkillId: {
      label: "Support a Creator",
      description:
        "Your signup supports the creator of this skill with a +5% bonus on your subscriptions.",
      selectorTitle: "Support a Creator",
      selectorDescription:
        "You added skills by independent creators to your favorites. Pick one to support - they get +5% from your subscriptions. You can change this anytime.",
      selectorNone: "None (skip)",
    },
    localFavorites: {
      label: "Local Favorites",
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
      detail: "An account with this email already exists. Log in instead.",
    },
    disposableEmail: {
      title: "Permanent Email Required",
      detail: "Throwaway inboxes can't sign up. Use a permanent email address.",
    },
    userNotFound: "No account found for {{email}}",
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
    autoLoginFailed:
      "Account created, but we couldn't sign you in. Log in with your new password.",
    internal: {
      title: "Signup failed for {{email}}: {{error}}",
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
        title: "Could not check {{email}}: {{error}}",
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
    locale: "Language",
    creditBalance: "Credit Balance",
    leadCreditBalance: "Lead Credit Balance",
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
      credits:
        "{{freeCreditsSignedIn}} free credits every month, +{{freeCreditsNewsletterBonus}} with the newsletter. No card needed",
      allModels: "Access to all {{modelCount}} AI models",
      uncensored: "4 uncensored models that actually answer your questions",
      chatModes: "Private, Incognito, Shared, and Public chat modes",
      noCard: "No credit card required - ever",
    },
    ctaButton: "Start Chatting Now",
    upgrade: {
      title: "Want more?",
      desc: "{{subscriptionPrice}}/month gets you {{subscriptionCredits}} credits - that's 40× more. Plus you can buy extra credit packs that never expire. Perfect if you use AI daily.",
      cta: "Upgrade to Pro",
    },
    signoff: "Happy chatting,\nThe {{appName}} Team",
    ps: "P.S. Use Incognito mode to keep conversations on your device only - we never store them on our servers.",
  },
  emailTemplates: {
    welcome: {
      name: "Signup Welcome Email",
      description: "Welcome email sent to users after successful registration",
      category: "Authentication",
      preview: {
        privateName: {
          label: "Private Name",
          description: "The user's private name",
        },
        userId: {
          label: "User ID",
          description: "The user's unique identifier",
        },
        leadId: {
          label: "Lead ID",
          description: "The user's lead identifier",
        },
      },
    },
    adminSignup: {
      name: "Admin Signup Notification Email",
      description: "Email sent to admins when a new user registers",
      category: "Administration",
      preview: {
        privateName: {
          label: "Private Name",
        },
        publicName: {
          label: "Public Name",
        },
        email: {
          label: "Email Address",
        },
        userId: {
          label: "User ID",
        },
        subscribeToNewsletter: {
          label: "Newsletter Subscription",
        },
      },
    },
  },
};
