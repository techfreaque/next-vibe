export const translations = {
  category: "Campaign Management",
  tag: "Bounce Processor",
  task: {
    description:
      "Scan IMAP inbox for bounce notifications and update lead status to BOUNCED",
  },
  post: {
    title: "Bounce Processor",
    description: "Process email bounce notifications from IMAP",
    container: {
      title: "Bounce Processor",
      description:
        "Scans IMAP for bounce notifications and suppresses bounced leads",
    },
    fields: {
      dryRun: {
        label: "Dry Run",
        description: "Run without making changes",
      },
      batchSize: {
        label: "Batch Size",
        description: "Maximum number of bounce emails to process per run",
      },
    },
    response: {
      bouncesFound: "Bounces Found",
      leadsUpdated: "Leads Updated",
      campaignsCancelled: "Campaigns Cancelled",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      server: {
        title: "Server Error",
        description: "An error occurred while processing bounces",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
    },
    success: {
      title: "Bounce Processing Completed",
      description: "Bounce notifications processed successfully",
    },
  },
};
