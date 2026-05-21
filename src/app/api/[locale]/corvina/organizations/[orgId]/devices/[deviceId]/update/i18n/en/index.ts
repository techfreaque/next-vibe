export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  patch: {
    title: "Update Device",
    description:
      "Updates label, description, or serial number of a Corvina device.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device.",
    },
    label: {
      label: "Label",
      description: "Human-readable label for the device.",
      placeholder: "My Device",
    },
    descriptionField: {
      label: "Description",
      description: "Optional description for the device.",
      placeholder: "Production sensor unit",
    },
    serialNumber: {
      label: "Serial Number",
      description: "Device serial number.",
      placeholder: "SN-12345",
    },
    response: {
      id: "Device ID",
      label: "Label",
      hwId: "HW ID",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      successTitle: "Device Updated",
      successDescription: "The device was updated successfully.",
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
        description: "No edit access to this device.",
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
    success: { title: "Success", description: "Device updated." },
  },
};
