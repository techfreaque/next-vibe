export const translations = {
  category: "Account",
  tags: {
    remoteConnection: "Remote Connection",
  },
  widget: {
    signInDescription: "Sign in to connect to a remote account.",
    // Customer benefits (non-admin)
    benefit1:
      "Memories sync automatically - everything you teach the AI here carries over",
    benefit2: "Access cloud AI models and tools from your local instance",
    benefit3: "Context travels with you across devices",
    // Admin benefits
    adminBenefit1: "Memories sync bidirectionally, automatically",
    adminBenefit2:
      "Cloud AI discovers and runs your local tools (SSH, files, code execution)",
    adminBenefit3:
      "Delegate tasks from cloud to this machine - Claude Code executes locally",
    adminBenefit4:
      "Capabilities snapshot sent every sync - Thea always knows what this instance can do",
  },
  post: {
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
    token: {
      label: "Token",
      description: "JWT token from the remote instance (set automatically)",
      validation: {
        required: "Login to the remote instance first",
      },
    },
    leadId: {
      label: "Lead ID",
      description: "Lead ID from the remote instance (set automatically)",
    },
    credentialWarning:
      "Your credentials go directly from your browser to the remote server. However, the token stored here grants the operator of this server full access to your remote account - they can do anything you can do there. Only connect on servers you fully trust.",
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
        description:
          "You are already connected to a remote instance with this instance ID",
      },
      instanceIdConflict: {
        title: "Instance ID Already Registered",
        description:
          "An instance with this ID is already registered on the remote. Choose a different instance ID.",
      },
      noLeadId: {
        title: "Connection Error",
        description: "Could not establish a session with the remote server",
      },
      invalidUrl: {
        title: "Invalid Remote URL",
        description:
          "The remote URL must point to a public server, not a local or private address",
      },
    },
    success: {
      title: "Connected!",
      description: "Your account is now connected to the remote instance",
    },
  },
};
