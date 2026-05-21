export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  get: {
    title: "Look Up Device License",
    description:
      "Retrieves a device license by serial number and activation key.",
    serialNumber: {
      label: "Serial Number",
      description: "Serial number of the device that activated the license.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Activation Key",
      description: "Activation key of the license.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Logical ID",
      gatewayLogicalId: "Gateway Logical ID",
      label: "Label",
      apiKey: "API Key",
      orgResourceId: "Org Resource ID",
      vpnKey: "VPN Key",
      fromDateVpn: "VPN From",
      toDateVpn: "VPN To",
      numOfSecondsAutoRenewVpn: "Auto-Renew (Seconds)",
      activationDate: "Activation Date",
      vpnValidityMonths: "VPN Validity (Months)",
      vpnAccountingDisabled: "VPN Accounting Disabled",
    },
    widget: {
      title: "Device License Lookup",
      back: "Back",
    },
    submitButton: {
      label: "Look Up",
      loadingText: "Looking up...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check serial number and activation key.",
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
        description: "No permission to look up device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No device license found for those credentials.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
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
      title: "Device License Found",
      description: "Device license retrieved successfully.",
    },
  },
  post: {
    title: "Look Up Device License (POST)",
    description:
      "Retrieves a device license by serial number and activation key via POST body.",
    serialNumber: {
      label: "Serial Number",
      description: "Serial number of the device that activated the license.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Activation Key",
      description: "Activation key of the license.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Logical ID",
      gatewayLogicalId: "Gateway Logical ID",
      label: "Label",
      apiKey: "API Key",
      orgResourceId: "Org Resource ID",
      vpnKey: "VPN Key",
      fromDateVpn: "VPN From",
      toDateVpn: "VPN To",
      numOfSecondsAutoRenewVpn: "Auto-Renew (Seconds)",
      activationDate: "Activation Date",
      vpnValidityMonths: "VPN Validity (Months)",
      vpnAccountingDisabled: "VPN Accounting Disabled",
    },
    widget: {
      title: "Device License Lookup (POST)",
      back: "Back",
    },
    submitButton: {
      label: "Look Up",
      loadingText: "Looking up...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "Check serial number and activation key.",
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
        description: "No permission to look up device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No device license found for those credentials.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned an internal server error.",
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
      title: "Device License Found",
      description: "Device license retrieved successfully.",
    },
  },
};
