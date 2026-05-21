export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  post: {
    title: "Move Device",
    description: "Moves a Corvina device to a different organization.",
    orgId: {
      label: "Organization ID",
      description: "Source Corvina organization ID.",
    },
    deviceId: {
      label: "Device HW ID",
      description: "Hardware ID (hwId) of the device to move.",
    },
    organizationImportToken: {
      label: "Organization Import Token",
      description: "Import token of the destination organization.",
      placeholder: "tok_abc123",
    },
    response: {
      id: "Device ID",
      label: "Label",
      hwId: "HW ID",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      successTitle: "Device Moved",
      successDescription: "The device was moved to the target organization.",
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
        description: "No move access for this device.",
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
    success: { title: "Success", description: "Device moved." },
  },
};
