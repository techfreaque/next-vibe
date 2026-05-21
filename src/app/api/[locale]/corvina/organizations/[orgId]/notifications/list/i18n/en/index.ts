export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Notifications",
  },
  get: {
    title: "List Notification Configs",
    description:
      "Lists all notification configurations for a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of configs per page (max 100).",
    },
    response: {
      configs: {
        id: "ID",
        organizationId: "Organization ID",
        event: "Event",
        beforeDays: "Before Days",
        afterDays: "After Days",
        emailBcc: "Email BCC",
        lastCheck: "Last Check",
      },
      totalElements: "Total Configs",
      totalPages: "Total Pages",
      last: "Last Page",
    },
    widget: {
      title: "Notification Configs",
      emptyState: "No notification configurations found.",
      labels: {
        bcc: "bcc",
        before: "before",
        after: "after",
      },
    },
    enums: {
      notificationEvent: {
        standardLicenseExpiration: "Standard License Expiration",
        plusLicenseExpiration: "Plus License Expiration",
        trialLicenseExpiration: "Trial License Expiration",
        vpnConsumptionsLevel0: "VPN Consumptions Level 0",
        vpnConsumptionsLevel1: "VPN Consumptions Level 1",
        vpnConsumptionsLevel2: "VPN Consumptions Level 2",
        vpnConsumptionsLevel3: "VPN Consumptions Level 3",
        iotConsumptionsLevel0: "IoT Consumptions Level 0",
        iotConsumptionsLevel1: "IoT Consumptions Level 1",
        iotConsumptionsLevel2: "IoT Consumptions Level 2",
        iotConsumptionsLevel3: "IoT Consumptions Level 3",
      },
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
          "The API key does not have access to list notification configs.",
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
      title: "Success",
      description: "Notification configs fetched successfully.",
    },
  },
  post: {
    title: "Create Notification Config",
    description:
      "Creates a new notification configuration for an organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    event: {
      label: "Event",
      description: "The notification event type.",
    },
    beforeDays: {
      label: "Before Days",
      description: "Trigger notification this many days before the event.",
    },
    afterDays: {
      label: "After Days",
      description: "Trigger notification this many days after the event.",
    },
    emailBcc: {
      label: "Email BCC",
      description: "Additional BCC email address for notifications.",
      placeholder: "bcc@example.com",
    },
    response: {
      id: "ID",
      organizationId: "Organization ID",
      event: "Event",
      beforeDays: "Before Days",
      afterDays: "After Days",
      emailBcc: "Email BCC",
      lastCheck: "Last Check",
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
          "The API key does not have access to create notification configs.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "A notification config with this event already exists.",
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
      title: "Created",
      description: "Notification config created successfully.",
    },
    submitButton: {
      label: "Create Config",
      loadingText: "Creating...",
    },
  },
};
