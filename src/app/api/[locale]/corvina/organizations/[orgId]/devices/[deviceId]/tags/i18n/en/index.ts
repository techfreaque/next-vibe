export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  get: {
    title: "Device Tags",
    description: "Fetches telemetry tags for a Corvina device.",
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
        modelPath: "Model Path",
        latestValue: "Latest Value",
        latestTimestamp: "Timestamp",
      },
      total: "Total",
    },
    widget: { title: "Tags", noTagsFound: "No tags found.", noData: "no data" },
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
    success: { title: "Success", description: "Tags fetched." },
  },
  post: {
    title: "Set Tag Value",
    description: "Writes a new value to a Corvina device tag.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device.",
    },
    modelPath: {
      label: "Tag Path",
      description: "Full model path of the tag.",
      placeholder: "ABC:1/Tag9",
    },
    v: {
      label: "New Value",
      description: "Value to write to the tag.",
      placeholder: "e.g. 42 or hello",
    },
    response: { message: "Result" },
    widget: {
      currentValue: "Current value",
      submitButton: "Write Value",
      successTitle: "Value Written",
      successDescription: "The tag was updated successfully.",
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
        description: "No write access to this device.",
      },
      notFound: { title: "Not Found", description: "Device or tag not found." },
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
    success: { title: "Success", description: "Tag value written." },
  },
};
