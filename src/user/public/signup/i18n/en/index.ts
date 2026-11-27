export const translations = {
  bounceSync: {
    title: "Sync signup delivery failures",
    description:
      "Check the system inbox for failed signup confirmation emails.",
    marked: "Signups updated",
    result: "Signups updated: {{count}}",
    productionOnly: "Signup delivery sync runs on production only.",
    mailboxUnavailable:
      "Could not check the system inbox for failed signup emails.",
  },
  events: {
    started: "Signup started",
    emailSent: "Confirmation email sent",
    sendFailed: "Confirmation email failed",
    bounced: "Confirmation email bounced",
    expired: "Confirmation expired",
    confirmed: "Email confirmed",
    reminderSent: "Reminder sent",
  },
  reminder: {
    subject: "Your {{appName}} account is one click away",
    hint: "You started signing up but never confirmed your email. Confirm now and get {{credits}} free credits every month. This code and the button below work for 24 hours and replace the ones from the first email.",
    button: "Confirm and sign in",
    ignore:
      "Didn’t sign up? Ignore this email. Without a click, no account is created.",
  },
  confirmation: {
    linkSent:
      "We sent a new confirmation email. Open it and follow the link to sign in.",
    bouncedTitle: "We couldn’t deliver your confirmation email",
    changeAddress: "Change email address",
    description: "Finish signup with the code or link from your email.",
    title: "Check your inbox",
    sent: "Enter the code we sent to {{email}}. It expires in 30 minutes.",
    code: "6-digit code",
    confirm: "Confirm and sign in",
    change: "Wrong address? Change it",
    resend: "Resend code",
    countdown: "Resend in {{seconds}}s",
    save: "Send to this address",
    cancel: "Cancel",
    email: "Email address",
    hint: "Enter this code to finish creating your account, or use the link below within 30 minutes.",
    bounce:
      "We couldn’t deliver the confirmation email to {{email}}. Check the address or use a different one.",
    bouncePolicy:
      "Your email provider blocked our message. School and work accounts often reject outside email. Use a different address.",
    bounceMailboxMissing:
      "Your email provider says {{email}} doesn’t exist. Check the spelling or use a different address.",
    bounceMailboxFull:
      "The mailbox for {{email}} is full. Free up space and resend the code, or use a different address.",
    invalid: "This code or link is invalid or has expired. Request a new code.",
    cooldown: "Too many requests. Wait before asking for another code.",
    domain: "This domain cannot receive email. Check the address.",
    sendFailed:
      "We could not send the email to {{email}}. Check the address or try sending again.",
    done: "Email confirmed. You are signed in.",
    newsletter:
      "Confirming also signs you up for the newsletter you requested.",
    link: "Confirm my email",
    pendingId: "Signup reference",
    token: "Email confirmation link token",
    callback: "Return path",
    suggestion: "Did you mean {{email}}?",
    expired: "This signup has expired. Start again to get a new code.",
    retry: "Start signup again",
    subject: "{{code}} is your {{appName}} code",
    wrongCode: "Wrong code. Use the code from the newest email and try again.",
    staleLink:
      "This link is from an older email. Open the newest one, or enter its code.",
    alreadyConfirmed: "This email is already confirmed. Log in to continue.",
    login: "Log in",
  },
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
    privacy:
      "Email only for login. No phone, no card, no third-party trackers.",
  },
  actions: {
    submit: "Send confirmation code",
    submitting: "Sending code…",
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
        "Confirm your address to activate the monthly newsletter bonus.",
      checkboxLabel:
        "Join the newsletter: +{{credits}} free credits every month",
      hint: "New models and product news every few weeks. Unsubscribe anytime.",
      tooltip:
        "Confirm your email to get {{credits}} extra credits each month, {{total}} in total, for as long as you stay subscribed.",
    },
    acceptTerms: {
      label: "I accept the terms",
      description: "Our terms and privacy policy respect your freedom.",
      termsLink: "terms",
      conditionsLink: "privacy policy",
      descriptionPrefix: "Our",
      descriptionAnd: "and",
      descriptionSuffix: "respect your freedom.",
      validation: {
        required: "You must accept the terms and conditions to continue",
      },
    },
    referralCode: {
      label: "Referral code (optional)",
      description: "Got a code from a friend? They earn when you subscribe.",
      placeholder: "Enter code",
      labelPrefilled: "Referral code",
      subscriptionBonus:
        "+{{credits}} bonus credits with your first subscription.",
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
        "You added skills by independent creators to your favorites. Pick one to support: they get +5% of your subscriptions. You can change this anytime.",
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
    subnetSignupLimit: {
      title: "Too Many Signups From Your Network",
      detail:
        "Too many accounts were created from your network today. Try again tomorrow, or log in to an existing account.",
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
    title: "Check your inbox",
    description: "Enter the code from your email.",
  },
  admin_notification: {
    title: "New User Signup",
    subject: "New user signup: {{privateName}}",
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
    subject: "You're in. {{appName}} is ready for you",
    previewText:
      "Hey {{privateName}}, your account is ready. Chat with Claude, GPT, Gemini, DeepSeek and {{modelCount}} more. Free, no card needed.",
    headline: "Your AI is waiting.",
    greeting: "Hey {{privateName}},",
    intro:
      "Welcome to {{appName}}. Everything you like about ChatGPT, plus open-source models and models without content filters. One account, one place.",
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
      uncensored: "Uncensored models that actually answer your questions",
      chatModes: "Private, Incognito, Shared, and Public chat modes",
      noCard: "No credit card required. Ever.",
    },
    verify: {
      note: "Your free credits switch on when you confirm this address.",
      cta: "Confirm email, get {{freeCreditsSignedIn}} credits",
    },
    ctaButton: "Start Chatting Now",
    upgrade: {
      title: "Want more?",
      desc: "Plans start at {{subscriptionPrice}}/month for {{subscriptionCredits}} credits and go up to {{ultraCredits}} credits for {{ultraPrice}}. Subscribers can top up with packs that never expire.",
      cta: "See the plans",
    },
    signoff: "Happy chatting,\nThe {{appName}} Team",
    ps: "P.S. Use Incognito mode to keep conversations on your device only. We never store them on our servers (generated media is stored temporarily for technical reasons).",
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
