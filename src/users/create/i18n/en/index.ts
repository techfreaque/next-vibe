import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

export const translations = {
  category: "Users",
  tags: {
    create: "Create",
    admin: "Admin",
  },
  post: {
    title: "Create user",
    titleShort: "Create user",
    description: "Create a new user account",
    form: {
      title: "User creation form",
      description: "Fill in the details to create a new user",
    },
    email: {
      label: "Email address",
      description: "User's email address for login and communication",
    },
    password: {
      label: "Password",
      description: "Use at least 8 characters.",
    },
    privateName: {
      label: "Private name",
      description: "User's full legal name (visible only to admins)",
    },
    publicName: {
      label: "Public name",
      description: "User's display name (visible to all users)",
    },
    firstName: {
      label: "First name",
      description: "User's first name",
    },
    lastName: {
      label: "Last name",
      description: "User's last name",
    },
    company: {
      label: "Company",
      description: "User's company or organization",
    },
    phone: {
      label: "Phone number",
      description: "User's contact phone number",
    },
    preferredContactMethod: {
      label: "Preferred contact method",
      description: "How the user prefers to be contacted",
    },
    roles: {
      label: "User roles",
      placeholder: "Assign roles",
      description: "Assign roles to the user",
    },
    imageUrl: {
      label: "Profile image URL",
      description: "URL to the user's profile image",
    },
    bio: {
      label: "Biography",
      description: "Brief description about the user",
    },
    website: {
      label: "Website",
      description: "User's personal or company website",
    },
    jobTitle: {
      label: "Job title",
      description: "User's job title or position",
    },
    emailVerified: {
      label: "Email verified",
      description: "Whether the user's email is verified",
    },
    isActive: {
      label: "Active status",
      description: "Whether the user account is active",
    },
    leadId: {
      label: "Lead ID",
      description: "Associated lead identifier",
    },
    country: {
      label: "Country",
      placeholder: "Choose a country",
      description: "User's country of residence",
    },
    language: {
      label: "Language",
      placeholder: "Choose a language",
      description: "User's preferred language",
    },
    response: {
      title: "User created",
      description: "Details of the newly created user",
      id: {
        content: "User ID",
      },
      leadId: {
        content: "Associated lead ID",
      },
      country: {
        label: "Country",
        description: "User's country of residence",
      },
      language: {
        label: "Language",
        description: "User's preferred language",
      },
      email: {
        content: "Email address",
      },
      privateName: {
        content: "Private name",
      },
      publicName: {
        content: "Public name",
      },
      firstName: {
        content: "First name",
      },
      lastName: {
        content: "Last name",
      },
      company: {
        content: "Company",
      },
      phone: {
        content: "Phone number",
      },
      preferredContactMethod: {
        content: "Preferred contact method",
      },
      imageUrl: {
        content: "Profile image",
      },
      bio: {
        content: "Biography",
      },
      website: {
        content: "Website",
      },
      jobTitle: {
        content: "Job title",
      },
      emailVerified: {
        content: "Email verified",
      },
      isActive: {
        content: "Active status",
      },
      stripeCustomerId: {
        content: "Stripe customer ID",
      },
      userRoles: {
        content: "User roles",
        id: {
          content: "Role ID",
        },
        role: {
          content: "Role",
        },
      },
      createdAt: {
        content: "Created at",
      },
      updatedAt: {
        content: "Updated at",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized access",
        description: "You must be logged in to create users",
      },
      validation: {
        title: "Validation failed",
        description: "Please check the form data and try again",
      },
      server: {
        title: "Server error",
        description: "Unable to create user due to server error",
      },
      unknown: {
        title: "Unknown error",
        description: "An unexpected error occurred while creating user",
      },
      network: {
        title: "Network error",
        description: "Network connection failed during user creation",
      },
      forbidden: {
        title: "Access forbidden",
        description: "You don't have permission to create users",
      },
      notFound: {
        title: "Resource not found",
        description: "Required resource not found for user creation",
      },
      conflict: {
        title: "User already exists",
        description: "A user with this email already exists",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes that will be lost",
      },
      internal: {
        title: "Internal Error: {{details}}",
        description: "An internal error occurred while creating the user",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS welcome failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS verification failed",
          description: "Failed to send verification SMS to the user",
        },
      },
    },
    success: {
      title: "User created successfully",
      description: "The new user account has been created",
      message: {
        content: "User created successfully",
      },
      created: {
        content: "Created",
      },
    },
  },
  widget: {
    headerCreated: "User created",
    headerCreate: "New user",
    headerSubtitle:
      "Add an admin or customer account. They can sign in right away.",
    activeBadge: "Active",
    verifiedBadge: "Verified",
    copiedTooltip: "Copied!",
    copyUserIdTooltip: "Copy user ID",
    copyIdButton: "Copy ID",
    copiedButton: "Copied!",
    viewUserButton: "View user",
    fullProfileButton: "Full profile",
    creditHistoryButton: "Credit history",
    createAnotherButton: "Create another user",
    createdPrefix: "Created",
    createButton: "Create user",
    sections: {
      signIn: "Sign-in",
      profile: "Profile",
      access: "Access",
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "Welcome to our platform, {{firstName}}!",
        preview: "Your account has been successfully created",
        subject: "Welcome to {{companyName}} - Your Account is Ready!",
        introduction:
          "Hi {{firstName}}, we're excited to have you on board! Your account has been successfully created and you can now access all our features.",
        accountDetails: "Account details",
        email: "Email",
        name: "Name",
        publicName: "Display name",
        company: "Company",
        phone: "Phone",
        nextSteps: "Next steps",
        loginButton: "Login to Your Account",
        support:
          "If you have any questions, our support team is here to help. Contact us anytime!",
      },
      admin: {
        newUser: "New user created",
        preview: "A new user {{firstName}} {{lastName}} has been created",
        subject: "New User Account Created - {{firstName}} {{lastName}}",
        notification:
          "A new user account has been created in the system. Here are the details:",
        userDetails: "User details",
        viewUser: "View user profile",
      },
      errors: {
        missing_data: "Required user data is missing for email template",
      },
      error: {
        general: {
          internal_server_error: "An internal server error occurred",
        },
      },
      labels: {
        id: "ID:",
        email: "Email:",
        name: "Name:",
        privateName: "Full name:",
        publicName: "Display name:",
        company: "Company:",
        created: "Created:",
        leadId: "Lead ID:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "Welcome {{firstName}}! Your account has been successfully created. Visit us at {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, your verification code is: {{code}}. Enter code within 10 minutes.",
    },
    errors: {
      welcome_failed: {
        title: "SMS welcome failed",
        description: "Failed to send welcome SMS to the user",
      },
      verification_failed: {
        title: "SMS verification failed",
        description: "Failed to send verification SMS to the user",
      },
    },
  },
  countries: {
    ...regionalCountryNames("en"),
    global: "Global",
    de: "Germany",
    pl: "Poland",
    fr: "France",
    us: "United States",
  },
  languages: {
    it: "Italian",
    es: "Spanish",
    sk: "Slovak",
    en: "English",
    de: "German",
    pl: "Polish",
    fr: "French",
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Customer",
      partnerAdmin: "Partner admin",
      partnerEmployee: "Partner employee",
      admin: "Admin",
      cliOff: "CLI disabled",
      cliAuthBypass: "CLI auth bypass",
      aiToolOff: "AI tool disabled",
      webOff: "Web disabled",
      mcpOff: "MCP disabled",
      mcpVisible: "MCP visible",
      productionOff: "Production disabled",
      skillOff: "Skill disabled",
    },
  },
};
