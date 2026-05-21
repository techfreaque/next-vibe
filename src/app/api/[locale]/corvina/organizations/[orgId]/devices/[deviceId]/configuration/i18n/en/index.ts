export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    devices: "Devices",
    configuration: "Configuration",
  },
  get: {
    title: "Get Device Configuration",
    description: "Fetches the full configuration of a device as raw JSON.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: { label: "Device ID", description: "Numeric device ID." },
    response: {
      configJson: "Configuration JSON",
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
        description: "Corvina rejected the API key.",
      },
      forbidden: {
        title: "Forbidden",
        description: "No access to device configuration.",
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
    success: {
      title: "Success",
      description: "Device configuration fetched successfully.",
    },
  },
};
