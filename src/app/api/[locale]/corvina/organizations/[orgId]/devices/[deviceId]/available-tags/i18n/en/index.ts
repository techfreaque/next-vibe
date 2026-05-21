export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  get: {
    title: "Available Tags",
    description:
      "Lists all available tag names and types for a Corvina device.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device.",
    },
    response: {
      tags: {
        name: "Tag Name",
        type: "Tag Type",
      },
    },
    widget: {
      title: "Available Tags",
      noTagsFound: "No available tags found.",
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
        description: "No read access to this device.",
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
    success: { title: "Success", description: "Available tags fetched." },
  },
};
