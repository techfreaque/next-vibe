export const translations = {
  category: "System",

  errors: {
    readFailed: "Failed to read system settings",
    writeFailed: "Failed to write settings to .env file",
    readOnly: "Configuration is read-only in this environment",
    defaultPasswordDetected: "Default admin password detected",
    passwordNotConfigured: "Admin password not configured",
  },

  messages: {
    settingsUpdated: "Settings updated",
  },

  get: {
    title: "System Settings",
    description: "View and manage environment configuration grouped by module",
    tags: {
      settings: "Settings",
    },
    response: {
      modules: {
        title: "Configuration Modules",
      },
      isWritable: {
        title: "Writable",
      },
      isDevMode: {
        title: "Dev Mode",
      },
      needsOnboarding: {
        title: "Needs Onboarding",
      },
      onboardingIssues: {
        title: "Onboarding Issues",
      },
      wizardSteps: {
        title: "Setup Wizard Steps",
      },
    },
    success: {
      title: "Settings Loaded",
      description: "Environment settings retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Settings not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to load settings",
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
  },

  patch: {
    title: "Update Settings",
    description: "Update environment configuration values in the .env file",
    tags: {
      settings: "Settings",
    },
    fields: {
      settings: {
        label: "Settings",
        description: "Key-value pairs to update",
      },
    },
    response: {
      updated: {
        title: "Updated Keys",
      },
      needsRestart: {
        title: "Needs Restart",
      },
      resultMessage: {
        title: "Settings updated",
      },
    },
    success: {
      title: "Settings Saved",
      description: "Environment settings updated successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid settings values",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Settings not found",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      server: {
        title: "Server Error",
        description: "Failed to save settings",
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
  },

  widget: {
    title: "System Configuration",
    subtitle: "Environment variables grouped by module",
    readOnlyBanner:
      "Configuration is read-only. Edit the .env file directly or use the CLI.",
    onboardingBanner:
      "Setup required - configure the highlighted fields to get started.",
    defaultPasswordWarning:
      "Default admin password detected! Change it immediately.",
    cancel: "Cancel",
    save: "Save Changes",
    saving: "Saving...",
    apply: "Apply & Restart",
    applying: "Applying...",
    saved: "Settings saved successfully",
    restartRequired:
      "Settings saved. A restart is required to apply the changes.",
    devRestartHint:
      "Restart the dev server (Ctrl+C then run vibe dev) to apply changes.",
    notSet: "not set",
    configured: "Configured",
    partial: "Partial",
    notConfigured: "Not Configured",
    required: "Required",
    selectPlaceholder: "Select...",
    boolTrue: "on",
    boolFalse: "off",
    logPathDisabled: "file logging disabled",
    restartWizard: "Setup Wizard",
    exportProd: "Export for Production",
    generate: "Generate",
    editConfirmHint: "[Enter] confirm  [Esc] cancel",
    editSettings: "Edit settings",
    loading: "Loading settings...",
    moduleLabels: {
      env: "Core",
      agent: "AI Providers",
      leadsCampaigns: "Lead Campaigns",
      messenger: "Messenger / SMTP",
      imap: "IMAP",
      payment: "Payments",
      sms: "SMS",
      serverSystem: "Server / Platform",
    },
  },

  wizard: {
    title: "Welcome to Vibe Setup",
    subtitle: "Let's get your instance configured in a few steps.",
    alreadyConfigured: "Already configured",
    stepOf: "Step {{step}} of {{total}}",
    next: "Next",
    back: "Back",
    skip: "Skip this step",
    finish: "Finish Setup",
    restart: "Restart Wizard",
    done: "Setup Complete",
    doneSubtitle:
      "Your instance is ready. You can always update settings later.",
    goToSettings: "Go to Full Settings",
    viewAllSettings: "View all settings",
    encryptionNote:
      "This value will be encrypted and stored securely - it will never be readable in plain text.",
    autoGeneratedNote:
      "Auto-generated - safe to use as-is, or replace with your own value.",
    steps: {
      admin: "Admin Account",
      database: "Database",
      security: "Security Keys",
      ai: "AI Provider",
    },
    ai: {
      claudeCodeTitle: "Claude Code (Auto-detected)",
      claudeCodeDescription:
        "Uses your local Claude CLI session - no API key needed. Add OpenRouter below to access 200+ additional models.",
      claudeDetected:
        "Claude CLI detected! Make sure you're logged in with `claude login`.",
      claudeNotDetected:
        "Claude CLI not found. Install it from claude.ai/code, then run `claude login`. Or skip and use OpenRouter below.",
      claudeInstallHint:
        "Optional - you can use OpenRouter or other providers instead.",
      openRouterTitle: "OpenRouter API Key",
      openRouterDescription:
        "Access 200+ AI models (GPT-4, Claude, Llama, and more). Works alongside Claude Code or on its own.",
      openRouterHint:
        "Get your free API key at openrouter.ai/keys - no credit card required for free models.",
      unbottledTitle: "Unbottled AI Cloud",
      unbottledDescription:
        "Sign in to unbottled.ai to access all AI models without managing API keys. Your self-hosted instance relays through the cloud.",
      unbottledConnected: "Connected to {{url}}",
      unbottledDisconnected: "Not connected",
      unbottledSignIn: "Sign In",
      unbottledSigningIn: "Signing in...",
      unbottledDisconnect: "Disconnect",
      unbottledEmail: "Email",
      unbottledPassword: "Password",
      unbottledRemoteUrl: "Cloud URL",
      unbottledLoginFailed: "Login failed - check your email and password.",
      unbottledConnectionError: "Could not reach the server. Check the URL.",
    },
  },

  export: {
    title: "Export for Production",
    subtitle:
      "Generate a .env file ready to deploy on your server. Sensitive values are shown in plain text - keep this file secure.",
    copyButton: "Copy to Clipboard",
    copied: "Copied!",
    downloadButton: "Download .env.prod",
    instructions:
      "Copy this file to your server:\n  scp .env.prod user@yourserver:/app/.env\nOr paste manually:\n  ssh user@yourserver && nano /app/.env",
    checklist: "Deployment Checklist",
    close: "Close",
  },
};
