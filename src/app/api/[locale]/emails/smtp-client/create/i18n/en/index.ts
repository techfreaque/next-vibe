export const translations = {
  title: "Create SMTP Account",
  description: "Create a new SMTP account for email sending",
  container: {
    title: "SMTP Account Configuration",
    description: "Configure SMTP account settings",
  },
  name: {
    label: "Account Name",
    description: "Unique name for this SMTP account",
    placeholder: "Enter account name",
  },
  accountDescription: {
    label: "Description",
    description: "Optional description for this SMTP account",
    placeholder: "Enter description",
  },
  host: {
    label: "SMTP Host",
    description: "SMTP server hostname or IP address",
    placeholder: "smtp.example.com",
  },
  port: {
    label: "Port",
    description: "SMTP server port number",
    placeholder: "587",
  },
  securityType: {
    label: "Security Type",
    description: "SMTP security protocol",
    placeholder: "Select security type",
  },
  username: {
    label: "Username",
    description: "SMTP authentication username",
    placeholder: "Enter username",
  },
  password: {
    label: "Password",
    description: "SMTP authentication password",
    placeholder: "Enter password",
  },
  fromEmail: {
    label: "From Email",
    description: "Email address to send from",
    placeholder: "sender@example.com",
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
  response: {
    account: {
      title: "SMTP Account Created",
      description: "Successfully created SMTP account",
      id: "Account ID",
      name: "Account Name",
      accountDescription: "Account Description",
      host: "SMTP Host",
      port: "Port",
      securityType: "Security Type",
      username: "Username",
      fromEmail: "From Email",
      status: "Account Status",
      healthCheckStatus: "Health Check Status",
      priority: "Priority",
      totalEmailsSent: "Total Emails Sent",
      createdAt: "Created At",
      updatedAt: "Updated At",
      campaignTypes: "Campaign Types",
      emailJourneyVariants: "Journey Variants",
      emailCampaignStages: "Campaign Stages",
      countries: "Countries",
      languages: "Languages",
    },
    accountSummary: {
      title: "Account Summary",
      description: "Basic account information",
    },
    connectionDetails: {
      title: "Connection Details",
      description: "SMTP server connection configuration",
    },
    performanceMetrics: {
      title: "Performance Metrics",
      description: "Account performance and usage statistics",
    },
  },
  errors: {
    validation: {
      title: "Validation Error",
      description: "Invalid SMTP account parameters",
    },
    unauthorized: {
      title: "Unauthorized",
      description: "Admin access required to create SMTP accounts",
    },
    conflict: {
      title: "Account Exists",
      description: "An SMTP account with this name already exists",
    },
    server: {
      title: "Server Error",
      description: "Failed to create SMTP account",
    },
    unknown: {
      title: "Unknown Error",
      description: "An unexpected error occurred",
    },
    forbidden: {
      title: "Forbidden",
      description: "Access to this resource is forbidden",
    },
    network: {
      title: "Network Error",
      description: "A network error occurred",
    },
    notFound: {
      title: "Not Found",
      description: "The requested resource was not found",
    },
    unsavedChanges: {
      title: "Unsaved Changes",
      description: "There are unsaved changes",
    },
  },
  success: {
    title: "SMTP Account Created",
    description: "Successfully created SMTP account",
  },
  widget: {
    container: {
      title: "New SMTP Account",
    },
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
};
