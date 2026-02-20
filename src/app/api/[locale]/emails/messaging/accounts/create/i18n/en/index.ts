export const translations = {
  title: "Create Messaging Account",
  description: "Add a new SMS, WhatsApp, or Telegram provider account",

  fields: {
    name: {
      label: "Account Name",
      description: "A unique name for this account",
      placeholder: "e.g. Twilio SMS Production",
    },
    description: {
      label: "Description",
      description: "Optional description",
      placeholder: "Optional description...",
    },
    channel: {
      label: "Channel",
      description: "Messaging channel (SMS, WhatsApp, Telegram)",
    },
    provider: {
      label: "Provider",
      description: "Messaging provider",
    },
    fromId: {
      label: "From / Phone Number ID",
      description: "Sender ID or phone number ID",
      placeholder: "e.g. +1234567890",
    },
    apiToken: {
      label: "API Token / SID",
      description: "Primary API credential",
      placeholder: "API token or Account SID",
    },
    apiSecret: {
      label: "API Secret / Auth Token",
      description: "Secondary API credential",
      placeholder: "API secret or auth token",
    },
    priority: {
      label: "Priority",
      description: "Account priority (0 = lowest)",
    },
  },

  response: {
    id: "ID",
    status: "Status",
    createdAt: "Created",
  },

  errors: {
    validation: { title: "Validation Error", description: "Invalid input" },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not Found", description: "Resource not found" },
    conflict: {
      title: "Name Already Exists",
      description: "An account with this name already exists",
    },
    server: { title: "Server Error", description: "Failed to create account" },
    networkError: { title: "Network Error", description: "Network error" },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
  },

  success: {
    title: "Account Created",
    description: "Messaging account created successfully",
  },
};
