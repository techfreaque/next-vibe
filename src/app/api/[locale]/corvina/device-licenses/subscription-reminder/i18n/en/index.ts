export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Subscriptions",
    reminder: "Expiry Reminders",
  },
  post: {
    title: "Send Expiry Reminders",
    description:
      "Scans all devices expiring within 30 days and sends a reminder email to the contact address on record. Each device is notified once per expiry cycle.",
    response: {
      checked: "Devices Scanned",
      reminded: "Reminders Sent",
      errors: { item: "Error" },
    },
    widget: {
      title: "Send Expiry Reminders",
      back: "Back",
      description:
        "Checks all active device subscriptions. Sends an email to the contact address for every device expiring within 30 days. Safe to run multiple times — each device only gets one email per cycle.",
      run: "Run Now",
      runAgain: "Run Again",
      loading: "Scanning devices and sending reminders…",
      result: "Run complete.",
      noErrors: "No errors.",
      sections: {
        about: "What this does",
        results: "Results",
      },
      scanNote: "Scans all devices expiring within 30 days",
      safeNote: "Safe to run multiple times — one email per device per cycle",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Bad request.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the server.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required.",
      },
      notFound: {
        title: "Not Found",
        description: "Not found.",
      },
      conflict: {
        title: "Conflict",
        description: "Conflict.",
      },
      server: {
        title: "Server Error",
        description: "Internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "Unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "Unknown error.",
      },
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
