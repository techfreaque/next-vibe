export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  post: {
    title: "Connect to Remote Account",
    description:
      "Connect your account to a remote instance to sync memories and use AI tools from anywhere",
    instanceId: {
      label: "Instance ID",
      description:
        "A short unique ID for this machine (letters, numbers, hyphens only)",
      placeholder: "hermes",
      validation: {
        invalid: "Use only lowercase letters, numbers, and hyphens",
      },
    },
    friendlyName: {
      label: "Display Name",
      description: "A friendly name shown in the UI (e.g. My Work Laptop)",
      placeholder: "My Work Laptop",
    },
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
};
