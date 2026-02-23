export const translations = {
  category: "Campaign Management",

  tag: "Email Campaigns",
  task: {
    description:
      "Send automated email campaigns to leads based on their stage and timing",
  },
  post: {
    title: "Email Campaigns",
    description: "Email Campaigns endpoint",
    form: {
      title: "Email Campaigns Configuration",
      description: "Configure email campaigns parameters",
    },
    container: {
      title: "Email Campaigns Configuration",
      description: "Configure email campaigns parameters",
    },
    fields: {
      batchSize: {
        label: "Batch Size",
        description: "Number of leads to process per batch",
      },
      maxEmailsPerRun: {
        label: "Max Emails Per Run",
        description: "Maximum number of emails to send per run",
      },
      dryRun: {
        label: "Dry Run",
        description: "Run without sending emails",
      },
    },
    response: {
      title: "Response",
      description: "Email Campaigns response data",
      emailsScheduled: "Emails Scheduled",
      emailsSent: "Emails Sent",
      emailsFailed: "Emails Failed",
      leadsProcessed: "Leads Processed",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
