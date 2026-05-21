export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Users",
  },
  post: {
    title: "Create User",
    description: "Creates a new user in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    username: {
      label: "Username",
      description: "Unique username (min 3 characters).",
      placeholder: "jdoe",
    },
    email: {
      label: "Email",
      description: "User email address.",
      placeholder: "jdoe@example.com",
    },
    firstName: {
      label: "First Name",
      description: "User's given name.",
      placeholder: "John",
    },
    lastName: {
      label: "Last Name",
      description: "User's family name.",
      placeholder: "Doe",
    },
    password: {
      label: "Password",
      description: "Initial password (min 8 characters). Leave empty to skip.",
      placeholder: "••••••••",
    },
    temporaryPassword: {
      label: "Temporary Password",
      description: "Force user to change password on first login.",
    },
    passwordChangeInvitation: {
      label: "Send Invitation",
      description: "Send a password change invitation email.",
    },
    serviceAccount: {
      label: "Service Account",
      description: "Mark this user as a non-human service account.",
    },
    emailVerified: {
      label: "Email Verified",
      description: "Mark the email address as already verified.",
    },
    response: {
      id: "ID",
      username: "Username",
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      serviceAccount: "Service Account",
      mfaEnabled: "MFA",
      owner: "Owner",
    },
    submitButton: {
      label: "Create User",
      loadingText: "Creating…",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "The API key does not have permission to create users.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "A user with that username or email already exists.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Created",
      description: "User created successfully.",
    },
  },
};
