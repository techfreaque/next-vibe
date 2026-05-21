export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Devices" },
  post: {
    title: "Add Device",
    description: "Adds a new device to a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    name: {
      label: "Device Name",
      description: "Unique machine-readable name.",
      placeholder: "my-device-01",
    },
    label: {
      label: "Label",
      description: "Human-readable display name.",
      placeholder: "My Device",
    },
    response: {
      deviceId: "Device ID",
      name: "Name",
      label: "Label",
    },
    submitButton: { label: "Add device", loadingText: "Adding…" },
    backButton: { label: "Cancel" },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check the device name format.",
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
        description: "No write access to this organization.",
      },
      notFound: { title: "Not Found", description: "Organization not found." },
      conflict: {
        title: "Already Exists",
        description: "A device with that name already exists.",
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
    widget: {
      added: "Device added",
    },
    success: {
      title: "Device added",
      description: "The device was created successfully.",
    },
  },
};
