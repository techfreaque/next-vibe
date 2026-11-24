export const translations = {
  category: "Users",

  post: {
    title: "Signup Reminder",
    titleShort: "Signup Reminder",
    description:
      "Send one reminder to people who started signing up but never confirmed their email. The reminder carries a fresh code and a link valid for 24 hours.",
    tag: "Signup Reminder",
    container: {
      title: "Signup Reminder",
      description:
        "Pending signups last mailed 2 to 24 hours ago, never confirmed",
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
      candidates: "Unconfirmed signups in window",
      sent: "Reminders sent",
      skipped: "Skipped",
      failed: "Failed",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "You must be an admin to send signup reminders",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      server: {
        title: "Server Error",
        description: "Sending signup reminders failed",
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
      description: "Signup reminders processed",
    },
  },
  task: {
    name: "Signup Reminder",
    description:
      "Every 30 minutes: one reminder to signups still unconfirmed 2 hours after their last email",
  },
};
