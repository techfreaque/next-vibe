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
      name: "Name",
      label: "Label",
      status: "Status",
      serialNumber: "Serial Number",
      firmwareVersion: "Firmware",
      connected: "Connected",
      lastSeen: "Last Seen",
      vpnEnabled: "VPN Enabled",
      dataEnabled: "Data Enabled",
    },
    widget: {
      edit: "Edit",
      tags: "Tags",
      sections: {
        identity: "Identity",
        network: "Network",
      },
      labels: {
        name: "Name",
        label: "Label",
        serialNumber: "Serial Number",
        firmwareVersion: "Firmware",
        lastSeen: "Last Seen",
      },
      badges: {
        connected: "Online",
        disconnected: "Offline",
        vpnOn: "VPN On",
        vpnOff: "VPN Off",
        dataOn: "Data On",
        dataOff: "Data Off",
      },
      cli: {
        firmwarePrefix: " · fw ",
        lastSeenPrefix: "last seen ",
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
  put: {
    title: "Edit Device",
    description: "Updates a Corvina device.",
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
    vpnEnabled: {
      label: "VPN Enabled",
      description: "Enable VPN for this device.",
    },
    dataEnabled: {
      label: "Data Enabled",
      description: "Enable data services for this device.",
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
