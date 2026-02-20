export const translations = {
  get: {
    title: "Messaging Account",
    description: "View messaging account details",
  },
  put: {
    title: "Edit Messaging Account",
    description: "Update messaging account settings",
    success: {
      title: "Account Updated",
      description: "Messaging account updated successfully",
    },
  },

  fields: {
    id: { label: "ID", description: "Account ID" },
    name: {
      label: "Account Name",
      description: "Name for this account",
      placeholder: "e.g. Twilio SMS Production",
    },
    description: {
      label: "Description",
      description: "Optional description",
      placeholder: "Optional description...",
    },
    channel: { label: "Channel", description: "Messaging channel" },
    provider: { label: "Provider", description: "Messaging provider" },
    fromId: {
      label: "From / Phone Number ID",
      description: "Sender ID or phone number ID",
      placeholder: "e.g. +1234567890",
    },
    apiToken: {
      label: "API Token / SID",
      description: "Leave blank to keep current token",
      placeholder: "New API token (leave blank to keep current)",
    },
    apiSecret: {
      label: "API Secret / Auth Token",
      description: "Leave blank to keep current secret",
      placeholder: "New API secret (leave blank to keep current)",
    },
    priority: { label: "Priority", description: "Account priority" },
    status: { label: "Status", description: "Account status" },
  },

  response: {
    account: {
      name: "Name",
      description: "Description",
      channel: "Channel",
      provider: "Provider",
      fromId: "From",
      status: "Status",
      priority: "Priority",
      messagesSentTotal: "Total Sent",
      lastUsedAt: "Last Used",
      createdAt: "Created",
      updatedAt: "Updated",
    },
  },

  errors: {
    validation: { title: "Validation Error", description: "Invalid input" },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required",
    },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: {
      title: "Account Not Found",
      description: "The messaging account was not found",
    },
    conflict: {
      title: "Name Already Exists",
      description: "An account with this name already exists",
    },
    server: { title: "Server Error", description: "Failed to update account" },
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
    title: "Account Retrieved",
    description: "Messaging account retrieved successfully",
  },
};
