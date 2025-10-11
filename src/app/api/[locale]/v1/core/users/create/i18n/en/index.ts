export const translations = {
  category: "Users",
  tags: {
    create: "Create",
    admin: "Admin",
  },
  post: {
    title: "Create User",
    description: "Create a new user account",
    form: {
      title: "User Creation Form",
      description: "Fill in the details to create a new user",
    },
    email: {
      label: "Email Address",
      description: "User's email address for login and communication",
    },
    password: {
      label: "Password",
      description: "Secure password for the user account",
    },
    firstName: {
      label: "First Name",
      description: "User's first name",
    },
    lastName: {
      label: "Last Name",
      description: "User's last name",
    },
    company: {
      label: "Company",
      description: "User's company or organization",
    },
    phone: {
      label: "Phone Number",
      description: "User's contact phone number",
    },
    preferredContactMethod: {
      label: "Preferred Contact Method",
      description: "How the user prefers to be contacted",
    },
    roles: {
      label: "User Roles",
      description: "Assign roles to the user",
    },
    imageUrl: {
      label: "Profile Image URL",
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
      label: "Job Title",
      description: "User's job title or position",
    },
    emailVerified: {
      label: "Email Verified",
      description: "Whether the user's email is verified",
    },
    isActive: {
      label: "Active Status",
      description: "Whether the user account is active",
    },
    leadId: {
      label: "Lead ID",
      description: "Associated lead identifier",
    },
    response: {
      title: "User Created",
      description: "Details of the newly created user",
      id: {
        content: "User ID",
      },
      leadId: {
        content: "Associated Lead ID",
      },
      email: {
        content: "Email Address",
      },
      firstName: {
        content: "First Name",
      },
      lastName: {
        content: "Last Name",
      },
      company: {
        content: "Company",
      },
      phone: {
        content: "Phone Number",
      },
      preferredContactMethod: {
        content: "Preferred Contact Method",
      },
      imageUrl: {
        content: "Profile Image",
      },
      bio: {
        content: "Biography",
      },
      website: {
        content: "Website",
      },
      jobTitle: {
        content: "Job Title",
      },
      emailVerified: {
        content: "Email Verified",
      },
      isActive: {
        content: "Active Status",
      },
      stripeCustomerId: {
        content: "Stripe Customer ID",
      },
      userRoles: {
        content: "User Roles",
      },
      createdAt: {
        content: "Created At",
      },
      updatedAt: {
        content: "Updated At",
      },
    },
    errors: {
      unauthorized: {
        title: "Unauthorized Access",
        description: "You must be logged in to create users",
      },
      validation: {
        title: "Validation Failed",
        description: "Please check the form data and try again",
      },
      server: {
        title: "Server Error",
        description: "Unable to create user due to server error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred while creating user",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed during user creation",
      },
      forbidden: {
        title: "Access Forbidden",
        description: "You don't have permission to create users",
      },
      notFound: {
        title: "Resource Not Found",
        description: "Required resource not found for user creation",
      },
      conflict: {
        title: "User Already Exists",
        description: "A user with this email already exists",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes that will be lost",
      },
      internal: {
        title: "Internal Error",
        description: "An internal error occurred while creating the user",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS Welcome Failed",
          description: "Failed to send welcome SMS to the user",
        },
        verification_failed: {
          title: "SMS Verification Failed",
          description: "Failed to send verification SMS to the user",
        },
      },
    },
    success: {
      title: "User Created Successfully",
      description: "The new user account has been created",
      message: {
        content: "User created successfully",
      },
      created: {
        content: "Created",
      },
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
        accountDetails: "Account Details",
        email: "Email",
        name: "Name",
        company: "Company",
        phone: "Phone",
        nextSteps: "Next Steps",
        loginButton: "Login to Your Account",
        support:
          "If you have any questions, our support team is here to help. Contact us anytime!",
      },
      admin: {
        newUser: "New User Created",
        preview: "A new user {{firstName}} {{lastName}} has been created",
        subject: "New User Account Created - {{firstName}} {{lastName}}",
        notification:
          "A new user account has been created in the system. Here are the details:",
        userDetails: "User Details",
        viewUser: "View User Profile",
      },
      errors: {
        missing_data: "Required user data is missing for email template",
      },
      labels: {
        id: "ID:",
        email: "Email:",
        name: "Name:",
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
        title: "SMS Welcome Failed",
        description: "Failed to send welcome SMS to the user",
      },
      verification_failed: {
        title: "SMS Verification Failed",
        description: "Failed to send verification SMS to the user",
      },
    },
  },
};
