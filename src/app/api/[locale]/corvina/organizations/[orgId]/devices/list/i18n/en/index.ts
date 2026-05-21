export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    devices: "Devices",
  },
  get: {
    title: "Devices",
    description: "Lists all devices in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "The numeric Corvina organization ID.",
    },
    response: {
      devices: {
        id: "ID",
        label: "Label",
        hwId: "Hardware ID",
        orgResourceId: "Org Resource ID",
        groups: "Groups",
        connected: "Connected",
        subscriptionStatus: "Subscription",
        daysUntilExpiry: "Days Left",
        trialStartDate: "Trial Start",
        subscriptionEndDate: "Sub End",
      },
      total: "Total",
      totalPages: "Pages",
      currentPage: "Current Page",
    },
    widget: {
      title: "Devices",
      noDevicesFound: "No devices found.",
      noDevicesHint: "No devices registered for this organization.",
      add: "Add",
      registerDevice: "Register a device",
      loading: "Loading devices…",
      onlineCount: "online",
      subscribedCount: "subscribed",
      noSub: "no sub",
      manageSubscription: "Subscription",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
      },
      network: {
        title: "Network Error",
        description: "Could not reach the Corvina API.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No read access to this organization.",
      },
      notFound: { title: "Not Found", description: "Organization not found." },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
    success: { title: "Success", description: "Devices fetched." },
  },
};
