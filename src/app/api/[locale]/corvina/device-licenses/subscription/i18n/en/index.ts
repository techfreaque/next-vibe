export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
    subscription: "Subscription",
  },
  get: {
    title: "Device Subscription",
    description: "Fetch subscription details for a specific device.",
    logicalId: {
      label: "Device ID",
      description: "Corvina logical ID of the device.",
    },
    response: {
      logicalId: "Device ID",
      orgResourceId: "Org Resource ID",
      clientEmail: "Client Email",
      trialStartDate: "Trial Start Date",
      subscriptionEndDate: "Subscription End Date",
      effectiveStartDate: "Effective Start",
      effectiveEndDate: "Effective End",
      status: "Status",
      daysUntilExpiry: "Days Until Expiry",
    },
    status: {
      trial: "Trial",
      active: "Active",
      expiringSoon: "Expiring Soon",
      expired: "Expired",
      noSubscription: "No Subscription",
    },
    widget: {
      title: "Subscription",
      editButton: "Edit",
      requestLicense: "Request License",
      notFound:
        "No subscription record found. Default 30-day trial applies from activation date.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The device ID is required.",
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
        description: "You do not have permission to view subscription data.",
      },
      notFound: {
        title: "Not Found",
        description: "No subscription record found for this device.",
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
      description: "Subscription details fetched.",
    },
  },
  post: {
    title: "Update Device Subscription",
    description:
      "Set or update the subscription period and client email for a device.",
    logicalId: {
      label: "Device ID",
      description: "Corvina logical ID of the device.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Organization resource ID for this device.",
    },
    clientEmail: {
      label: "Client Email",
      description: "Email address to send subscription reminders to.",
    },
    trialStartDate: {
      label: "Trial Start Date",
      description:
        "Override the trial start date. Leave blank to use device activation date.",
    },
    subscriptionEndDate: {
      label: "Subscription End Date",
      description:
        "Override the subscription end date. Leave blank to use start date + 30 days.",
    },
    widget: {
      title: "Edit Subscription",
      back: "Back",
      result: {
        title: "Subscription Updated",
      },
    },
    submitButton: {
      label: "Save Subscription",
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
        description: "You do not have permission to update subscription data.",
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
      title: "Updated",
      description: "Subscription updated successfully.",
    },
  },
};
