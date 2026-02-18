export const translations = {
  get: {
    title: "View SMTP Account",
    description: "Retrieve SMTP account details",
    container: {
      title: "SMTP Account Details",
      description: "View SMTP account configuration",
    },
  },
  put: {
    title: "Edit SMTP Account",
    description: "Edit existing SMTP account",
    container: {
      title: "SMTP Account Settings",
      description: "Update SMTP account configuration",
    },
    updates: {
      title: "Update Fields",
      description: "Fields to update",
    },
  },
  fields: {
    id: {
      label: "Account ID",
      description: "The unique identifier for the SMTP account",
    },
    name: {
      label: "Account Name",
      description: "The name of the SMTP account",
      placeholder: "Enter account name",
    },
    description: {
      label: "Description",
      description: "Optional description of the SMTP account",
      placeholder: "Enter description",
    },
    host: {
      label: "SMTP Host",
      description: "The SMTP server hostname",
      placeholder: "smtp.example.com",
    },
    port: {
      label: "Port",
      description: "The SMTP server port",
      placeholder: "587",
    },
    securityType: {
      label: "Security Type",
      description: "The security protocol to use",
      placeholder: "Select security type",
    },
    username: {
      label: "Username",
      description: "The SMTP authentication username",
      placeholder: "Enter username",
    },
    password: {
      label: "Password",
      description:
        "Leave empty to keep current password, or enter new password to change it",
      placeholder: "Enter new password (optional)",
    },
    fromEmail: {
      label: "From Email",
      description: "The default sender email address",
      placeholder: "noreply@example.com",
    },
    priority: {
      label: "Priority",
      description: "Account priority (1-100)",
      placeholder: "10",
    },
    campaignTypes: {
      label: "Campaign Types",
      description: "Types of email campaigns this account can send",
      placeholder: "Select campaign types",
    },
    emailJourneyVariants: {
      label: "Journey Variants",
      description: "Email journey variants this account supports",
      placeholder: "Select journey variants",
    },
    emailCampaignStages: {
      label: "Campaign Stages",
      description: "Campaign stages this account handles",
      placeholder: "Select campaign stages",
    },
    countries: {
      label: "Countries",
      description: "Countries this account can send to",
      placeholder: "Select countries",
    },
    languages: {
      label: "Languages",
      description: "Languages supported by this account",
      placeholder: "Select languages",
    },
  },
  response: {
    account: {
      title: "SMTP Account",
      description: "SMTP account details",
      id: "Account ID",
      name: "Account Name",
      fields: {
        description: "Description",
      },
      host: "SMTP Host",
      port: "Port",
      securityType: "Security Type",
      username: "Username",
      fromEmail: "From Email",
      status: "Account Status",
      healthCheckStatus: "Health Check Status",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      lastUsedAt: "Last Used At",
      createdAt: "Created At",
      updatedAt: "Updated At",
      campaignTypes: "Campaign Types",
      emailJourneyVariants: "Journey Variants",
      emailCampaignStages: "Campaign Stages",
      countries: "Countries",
      languages: "Languages",
    },
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
      description: "Access denied",
    },
    notFound: {
      title: "Not Found",
      description: "SMTP account not found",
    },
    conflict: {
      title: "Conflict",
      description: "Data conflict occurred",
    },
    server: {
      title: "Server Error",
      description: "Internal server error occurred",
    },
    networkError: {
      title: "Network Error",
      description: "Network communication failed",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "You have unsaved changes",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unknown error occurred",
    },
  },
  success: {
    title: "Success",
    description: "Operation completed successfully",
  },
  actions: {
    back: "Back",
    cancel: "Cancel",
  },
  notFound: "Account not found",
  widget: {
    put: {
      title: "Edit SMTP Account",
      container: {
        title: "Edit SMTP Account",
      },
    },
    fields: {
      host: {
        label: "Host",
      },
      username: {
        label: "Username",
      },
      fromEmail: {
        label: "From Email",
      },
    },
  },
};
