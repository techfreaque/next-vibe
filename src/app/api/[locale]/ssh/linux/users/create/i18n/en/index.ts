export const translations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "No login shell",
    },
  },

  errors: {
    localModeOnly: {
      title: "Local Mode Only",
    },
    invalidUsername:
      "Invalid username: must start with a letter, then lowercase letters, digits, or hyphens (max 32 chars)",
    userAlreadyExists: "A user with that username already exists",
    connectionNotFound: "SSH connection not found",
    encryptionFailed: "Encryption failed — SSH_SECRET_KEY may be invalid",
    connectTimeout: "Connection timed out",
    sshAuthFailed: "SSH authentication failed",
    sshConnectionFailed: "SSH connection failed",
    sudoAuthFailed:
      "Sudo authentication failed — wrong password or insufficient sudo privileges",
    permissionDenied:
      "Permission denied: provide your sudo password to create OS users",
    fingerprintMismatch:
      "Host fingerprint has changed. Potential MITM attack. Acknowledge to proceed.",
  },

  post: {
    title: "Create Linux User",
    description:
      "Create a new OS user account. Runs useradd on the target host. Admin only.",
    fields: {
      connectionId: {
        label: "SSH Connection",
        description:
          "Which server to create the user on. Leave empty to use the default connection or local mode.",
        placeholder: "Select a connection…",
      },
      username: {
        label: "Username",
        description:
          "Must start with a letter, then lowercase letters, digits, or hyphens. Max 32 characters.",
        placeholder: "alice",
      },
      groups: {
        label: "Additional Groups",
        description:
          "Optional extra groups to add the user to (comma-separated). Example: docker, www-data.",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Login Shell",
        description:
          "The shell that opens when this user logs in interactively.",
      },
      homeDir: {
        label: "Home Directory",
        description:
          "Path for the user's home directory. Defaults to /home/<username> if left empty.",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Grant Sudo Access",
        description:
          "Add the user to the sudo group so they can run commands as root. Use with caution.",
      },
      sudoPassword: {
        label: "Sudo Password",
        description:
          "Your sudo password to run useradd with elevated privileges. Leave empty if passwordless sudo is configured.",
        placeholder: "Enter sudo password…",
      },
    },
    response: {
      ok: { title: "Success" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "Home Directory" },
      shell: { title: "Shell" },
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
        description: "Local mode is not enabled on this server",
      },
      server: {
        title: "Server Error",
        description: "Failed to create the user account",
      },
      notFound: {
        title: "Not Found",
        description: "SSH connection not found",
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
        title: "Username Already Exists",
        description: "A user with this username already exists on the server",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server",
      },
      timeout: { title: "Timeout", description: "Request timed out" },
    },
    success: {
      title: "User Created",
      description: "OS user account created successfully",
    },
    submitButton: {
      text: "Create User",
      loadingText: "Creating…",
    },
  },
  widget: {
    title: "Create Linux User",
    createButton: "Create User",
    creating: "Creating…",
    sudoWarning:
      "Granting sudo access gives the user root-level privileges. Only do this if you trust this user completely.",
  },
};
