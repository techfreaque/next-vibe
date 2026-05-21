export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  get: {
    title: "Sync Device Status",
    description: "Triggers a status synchronization for a Corvina device.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device.",
    },
    response: {
      message: "Result",
    },
    widget: {
      successTitle: "Status Synced",
      successDescription: "Device status synchronization triggered.",
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
        description: "No access to this device.",
      },
      notFound: { title: "Not Found", description: "Device not found." },
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
    success: { title: "Success", description: "Status sync triggered." },
  },
};
