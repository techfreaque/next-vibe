export const translations = {
  category: "Users",

  post: {
    title: "Verify-Email Reminder",
    titleShort: "Verify Reminder",
    description:
      "Send one reminder to accounts that did not confirm their email 24 hours after signup. Free credits need a confirmed email.",
    tag: "Verify Reminder",
    container: {
      title: "Verify-Email Reminder",
      description: "Accounts created 24-25 hours ago that are still unverified",
    },
    fields: {
      batchSize: {
        label: "Batch Size",
        description: "Maximum reminders per run",
      },
      dryRun: {
        label: "Dry Run",
        description: "Count who would get a reminder without sending",
      },
    },
    response: {
      candidates: "Unverified accounts in window",
      sent: "Reminders sent",
      skipped: "Skipped",
      failed: "Failed",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be an admin to send verify reminders",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      server: {
        title: "Server Error",
        description: "Sending verify reminders failed",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid reminder settings",
      },
    },
    success: {
      title: "Reminders Processed",
      description: "Verify-email reminders processed",
    },
  },
  task: {
    name: "Email Verification Reminder",
    description:
      "Hourly: one reminder to accounts still unverified 24 hours after signup",
  },
};
