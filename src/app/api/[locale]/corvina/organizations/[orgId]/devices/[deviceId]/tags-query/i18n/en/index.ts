export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  post: {
    title: "Tag Query History",
    description: "Queries historical tag data for a Corvina device.",
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
      description: "Tag model path filter. Wildcards supported.",
      placeholder: "** or Test_Model:1/Tag",
    },
    since: {
      label: "Since",
      description: "Start of time range (ISO 8601 or timestamp).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "To",
      description: "End of time range (ISO 8601 or timestamp).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    limit: {
      label: "Limit",
      description: "Maximum number of rows to return.",
      placeholder: "100",
    },
    mode: {
      label: "Mode",
      description: "Tag access mode filter.",
    },
    filterCondition: {
      label: "Filter Condition",
      description: "Additional filter expression.",
      placeholder: "value > 0",
    },
    response: {
      deviceId: "Device ID",
      modelPath: "Model Path",
      rowCount: "Row Count",
      latestValue: "Latest Value",
      latestTimestamp: "Latest Timestamp",
    },
    widget: {
      title: "Tag Query Results",
      noResultsFound: "No tag data found.",
      rows: "rows",
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
    success: { title: "Success", description: "Tag history retrieved." },
  },
};
