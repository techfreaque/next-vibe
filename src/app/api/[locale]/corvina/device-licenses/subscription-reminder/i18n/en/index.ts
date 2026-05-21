export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
    reminder: "Subscription Reminder",
  },
  post: {
    title: "Send Subscription Reminders",
    description:
      "Checks all devices expiring within 30 days and sends a reminder email to the client and admin. Runs once per expiration cycle per device.",
    response: {
      checked: "Devices Checked",
      reminded: "Reminders Sent",
      errors: { item: "Error" },
    },
    widget: {
      title: "Subscription Reminders",
      run: "Run Now",
      runAgain: "Run Again",
      loading: "Sending reminders…",
      result: "Reminder run complete.",
    },
    errors: {
      validation: { title: "Invalid Request", description: "Bad request." },
      network: {
        title: "Network Error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: { title: "Forbidden", description: "Not allowed." },
      notFound: { title: "Not Found", description: "Not found." },
      conflict: { title: "Conflict", description: "Conflict." },
      server: { title: "Server Error", description: "Internal server error." },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes.",
      },
      unknown: { title: "Unknown Error", description: "Unknown error." },
    },
    success: {
      title: "Done",
      description: "Reminder run completed.",
    },
  },
  email: {
    subject: "Your device subscription expires in {days} days",
    greeting: "Subscription expiry notice",
    body: "The subscription for device {label} ({logicalId}) in organization {org} expires on {date}.",
    cta: "Contact us to renew",
    adminSubject: "[Admin] Subscription expiring: {label}",
    adminBody:
      "Device {label} ({logicalId}) in org {org} expires on {date}. Client email: {clientEmail}.",
  },
};
