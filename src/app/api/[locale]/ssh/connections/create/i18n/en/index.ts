export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Password",
      privateKey: "Private Key (PEM)",
      keyAgent: "SSH Agent",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "SSH_SECRET_KEY env var not set. Add a 32-byte hex value to enable SSH mode.",
    encryptionFailed: "Encryption failed - SSH_SECRET_KEY may be invalid",
    noRowReturned: "No row returned from insert",
  },

  post: {
    title: "Create SSH Connection",
    description:
      "Save a new SSH connection. Credentials are encrypted at rest using AES-256-GCM.",
    fields: {
      label: {
        label: "Label",
        description: "A friendly name to identify this connection",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostname / IP",
        description: "The SSH server hostname or IP address",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "SSH server port (default: 22)",
        placeholder: "22",
      },
      username: {
        label: "Username",
        description: "The SSH user to authenticate as",
        placeholder: "deploy",
      },
      authType: {
        label: "Authentication Method",
        description:
          "How to authenticate. Password: simple password login. Private Key: PEM key file. SSH Agent: use the system SSH agent (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Password / Private Key",
        description:
          "For Password auth: the password. For Private Key: paste the full PEM key (-----BEGIN ... KEY-----). Leave empty for SSH Agent.",
        placeholder: "",
      },
      passphrase: {
        label: "Key Passphrase",
        description:
          "If your private key is passphrase-protected, enter it here. Leave empty if the key is unencrypted.",
        placeholder: "",
      },
      isDefault: {
        label: "Set as Default Connection",
        description:
          "Use this connection by default for AI sessions, the terminal, and exec commands when no connection is specified.",
      },
      notes: {
        label: "Notes",
        description: "Optional internal notes about this connection",
        placeholder: "VPS behind NAT, jump host required",
      },
    },
    response: {
      id: { title: "Connection ID" },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Check the form fields and try again",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to create connections",
      },
      server: {
        title: "Server Error",
        description: "Failed to save the connection",
      },
      notFound: { title: "Not Found", description: "Resource not found" },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Label Already Exists",
        description: "A connection with this label already exists",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "Connection Saved",
      description: "SSH connection saved successfully",
    },
    submitButton: {
      text: "Save Connection",
      loadingText: "Saving...",
    },
  },
  widget: {
    title: "New SSH Connection",
    createButton: "Save Connection",
    creating: "Saving...",
    testFirst: "Test the connection before saving",
  },
};
