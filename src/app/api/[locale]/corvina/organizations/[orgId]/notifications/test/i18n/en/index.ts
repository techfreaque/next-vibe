export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Notifications",
  },
  post: {
    title: "Test Notification",
    description: "Sends a test notification email for an organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    type: {
      label: "Notification Type",
      description: "The type of notification to test.",
    },
    emailTo: {
      label: "Email To",
      description: "Recipient email address for the test notification.",
      placeholder: "recipient@example.com",
    },
    emailBcc: {
      label: "Email BCC",
      description: "BCC email address for the test notification.",
      placeholder: "bcc@example.com",
    },
    subject: {
      label: "Subject",
      description: "Custom subject line for the test email.",
      placeholder: "Test notification",
    },
    response: {
      message: "Message",
    },
    enums: {
      notificationMailEventType: {
        alarmNotification: "Alarm Notification",
        userCreation: "User Creation",
        standardLicenseExpiration: "Standard License Expiration",
        plusLicenseExpiration: "Plus License Expiration",
        trialLicenseExpiration: "Trial License Expiration",
        standardLicenseExpired: "Standard License Expired",
        plusLicenseExpired: "Plus License Expired",
        trialLicenseExpired: "Trial License Expired",
        vpnCreditsConsumptions: "VPN Credits Consumptions",
        vpnCreditsConsumptionsOver: "VPN Credits Consumptions Over",
        iotCreditsConsumptions: "IoT Credits Consumptions",
        iotCreditsConsumptionsOver: "IoT Credits Consumptions Over",
      },
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The API key does not have access to send test notifications.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred.",
      },
    },
    success: {
      title: "Sent",
      description: "Test notification sent successfully.",
    },
    submitButton: {
      label: "Send Test",
      loadingText: "Sending...",
    },
  },
};
