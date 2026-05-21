export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Subscriptions",
    subscription: "Subscription",
  },
  get: {
    title: "Device Subscription Status",
    description:
      "Trial and paid subscription dates for a Corvina device. Shows current status, days remaining, and contact email for renewal reminders.",
    logicalId: {
      label: "Device ID",
      description: "Corvina logical ID of the device.",
    },
    response: {
      logicalId: "Device ID",
      orgResourceId: "Organization",
      clientEmail: "Contact Email",
      trialStartDate: "Trial Start",
      subscriptionEndDate: "Subscription End",
      effectiveStartDate: "Active From",
      effectiveEndDate: "Active Until",
      status: "Status",
      daysUntilExpiry: "Days Remaining",
    },
    status: {
      trial: "Trial",
      active: "Active",
      expiringSoon: "Expiring Soon",
      expired: "Expired",
      noSubscription: "No Subscription",
    },
    widget: {
      title: "Device Subscription",
      editButton: "Edit",
      requestRenewal: "Request Renewal",
      notFound:
        "No subscription record. Default 30-day trial runs from activation date.",
      daysLeft: "d left",
      daysAgo: "d ago",
      loading: "Loading subscription…",
      noSubscription: "No subscription",
      noSubscriptionHint:
        "Default 30-day trial runs from device activation date.",
      sections: {
        subscription: "Subscription",
      },
      effectiveFrom: "Active from",
      effectiveUntil: "Active until",
      trialStart: "Trial start",
      subscriptionEnd: "Subscription end",
      clientEmail: "Contact email",
      organization: "Organization",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Device ID is required.",
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
        description: "No permission to view subscription data.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription record for this device.",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred.",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred.",
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
      description: "Subscription status loaded.",
    },
  },
  post: {
    title: "Set Device Subscription",
    description:
      "Set or override trial start and subscription end dates for a device. Assign a contact email for expiry reminders.",
    logicalId: {
      label: "Device ID",
      description: "Corvina logical ID of the device.",
    },
    orgResourceId: {
      label: "Organization",
      description: "Organization resource ID for this device.",
    },
    clientEmail: {
      label: "Contact Email",
      description: "Email address for subscription expiry reminders.",
    },
    trialStartDate: {
      label: "Trial Start",
      description: "Override trial start. Leave blank to use activation date.",
    },
    subscriptionEndDate: {
      label: "Subscription End",
      description:
        "Set paid subscription end date. Leave blank for trial-only (start + 30 days).",
    },
    widget: {
      title: "Edit Subscription",
      back: "Back",
      result: {
        title: "Subscription Saved",
      },
      sections: {
        identity: "Device",
        subscription: "Subscription dates",
      },
    },
    submitButton: {
      label: "Save",
      loadingText: "Saving...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Please check the form fields.",
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
        description: "No permission to update subscription data.",
      },
      notFound: {
        title: "Not Found",
        description: "Device not found.",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred.",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred.",
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
      title: "Saved",
      description: "Subscription updated.",
    },
  },
};
