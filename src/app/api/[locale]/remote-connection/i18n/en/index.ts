export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  widget: {
    title: "Remote Connection",
    signInDescription: "Sign in to configure your remote connection",
    connected: {
      title: "Connected to cloud account",
      badge: "Active",
      description:
        "Your memories and AI tools sync automatically with your cloud account.",
      connectedTo: "Connected to",
      lastSynced: "Last synced",
      refresh: "Refresh",
    },
    notConnected: {
      title: "Connect your cloud account",
      description:
        "Connect to your cloud account (e.g. unbottled.ai) to sync your memories and use AI tools from your terminal - from anywhere.",
      benefit1:
        "Your memories automatically sync between this device and your cloud account",
      benefit2: "Run AI tools from the command line with",
      benefit2Code: "vibe --remote",
      benefit3: "Your cloud account and local instance stay in sync",
    },
  },
  get: {
    title: "Remote Connection",
    description: "Get your current remote connection status",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to view your remote connection",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to view this",
      },
      notFound: {
        title: "Not Connected",
        description: "No remote connection configured",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while retrieving your connection",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Connection Retrieved",
      description: "Remote connection status retrieved successfully",
    },
  },
  connect: {
    title: "Connect to Remote Account",
    description:
      "Connect your account to a remote instance to sync memories and use AI tools from anywhere",
    remoteUrl: {
      label: "Remote URL",
      description:
        "The web address of your remote account (e.g. https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Please enter the remote URL",
        invalid: "Please enter a valid URL (e.g. https://unbottled.ai)",
      },
    },
    email: {
      label: "Email",
      description: "Your email address on the remote instance",
      placeholder: "you@example.com",
      validation: {
        required: "Please enter your email",
        invalid: "Please enter a valid email address",
      },
    },
    password: {
      label: "Password",
      description: "Your password on the remote instance",
      placeholder: "••••••••",
      validation: {
        required: "Please enter your password",
      },
    },
    actions: {
      submit: "Connect",
      submitting: "Connecting...",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Please check your details and try again",
      },
      network: {
        title: "Connection Failed",
        description:
          "Could not reach the remote server. Check the URL and try again",
      },
      unauthorized: {
        title: "Login Failed",
        description: "Incorrect email or password for the remote account",
      },
      forbidden: {
        title: "Access Denied",
        description: "Your account doesn't have permission to connect",
      },
      notFound: {
        title: "Not Found",
        description: "Could not find the remote server at that URL",
      },
      server: {
        title: "Remote Server Error",
        description: "The remote server encountered an error",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Already Connected",
        description: "You are already connected to a remote instance",
      },
      noLeadId: {
        title: "Connection Error",
        description: "Could not establish a session with the remote server",
      },
    },
    success: {
      title: "Connected!",
      description: "Your account is now connected to the remote instance",
    },
  },
  disconnect: {
    title: "Disconnect",
    description: "Disconnect from your remote instance",
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request",
      },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Not Logged In",
        description: "You must be logged in to disconnect",
      },
      forbidden: {
        title: "Access Denied",
        description: "You don't have permission to disconnect",
      },
      notFound: {
        title: "Not Connected",
        description: "No remote connection to disconnect",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while disconnecting",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Disconnected",
      description: "Your remote connection has been removed",
    },
  },
};
