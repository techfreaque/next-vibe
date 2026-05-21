export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  delete: {
    title: "Delete Device Tags",
    description: "Deletes historical tag data for a Corvina device.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device.",
    },
    modelPath: {
      label: "Model Path",
      description: "Tag model path filter. Use ** to match all tags.",
      placeholder: "**",
    },
    since: {
      label: "Since",
      description: "Start of time range to delete (ISO 8601 or timestamp).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "To",
      description: "End of time range to delete (ISO 8601 or timestamp).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    filterCondition: {
      label: "Filter Condition",
      description: "Additional filter expression.",
      placeholder: "value > 0",
    },
    response: {
      deletedCount: "Deleted Count",
    },
    widget: {
      title: "Tags Deleted",
      deletedMessage: "deleted",
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
        description: "No delete access to this device.",
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
    success: { title: "Success", description: "Tag data deleted." },
  },
};
