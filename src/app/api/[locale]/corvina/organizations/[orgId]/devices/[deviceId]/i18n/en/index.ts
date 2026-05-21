export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  get: {
    title: "Device",
    description: "Fetches a single Corvina device by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: { label: "Device ID", description: "Numeric Corvina device ID." },
    response: {
      orgId: "Organization ID",
      deviceId: "Device ID",
      label: "Label",
      hwId: "Hardware ID",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      edit: "Edit",
      tags: "Tags",
      sections: {
        identity: "Identity",
      },
      labels: {
        label: "Label",
        hwId: "Hardware ID",
        orgResourceId: "Org Resource ID",
      },
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
    success: { title: "Success", description: "Device fetched." },
  },
  patch: {
    title: "Edit Device",
    info: "Updates label, description and serial number of a Corvina device.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: { label: "Device ID", description: "Numeric Corvina device ID." },
    label: {
      label: "Label",
      description: "Display label for this device.",
      placeholder: "My Device",
    },
    description: {
      label: "Description",
      description: "Optional description for this device.",
      placeholder: "A short description",
    },
    serialNumber: {
      label: "Serial Number",
      description: "Physical serial number of this device.",
      placeholder: "SN-123456",
    },
    submitButton: { label: "Save changes", loadingText: "Saving…" },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update.",
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
    success: { title: "Saved", description: "Device updated successfully." },
  },
};
