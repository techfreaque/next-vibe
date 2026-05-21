export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  put: {
    title: "Update Device License",
    description:
      "Updates serial number, client name, notes, and VPN settings of a device license.",
    deviceLicenseId: {
      label: "Device License ID",
      description: "Numeric device license ID.",
    },
    serialNumber: {
      label: "Serial Number",
      description: "Hardware serial number of the device.",
    },
    clientName: {
      label: "Client Name",
      description: "Name of the client owning this device license.",
    },
    notes: {
      label: "Notes",
      description: "Free-text notes about this device license.",
    },
    vpnStartDate: {
      label: "VPN Start Date",
      description: "Date when VPN access begins.",
    },
    vpnEndDate: {
      label: "VPN End Date",
      description: "Date when VPN access expires.",
    },
    vpnValidityMonths: {
      label: "VPN Validity (months)",
      description: "Number of months VPN access remains valid.",
    },
    vpnAccountingDisabled: {
      label: "Disable VPN Accounting",
      description: "When enabled, VPN usage is not accounted.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Logical ID",
      gatewayLogicalId: "Gateway Logical ID",
      label: "Label",
      apiKey: "API Key",
      platformPairingApiUrl: "Platform Pairing API URL",
      vpnPairingApiUrl: "VPN Pairing API URL",
      brokerUrls: "Broker URLs",
      orgResourceId: "Org Resource ID",
      vpnKey: "VPN Key",
      fromDateVpn: "VPN From Date",
      toDateVpn: "VPN To Date",
      numOfSecondsAutoRenewVpn: "VPN Auto-Renew (seconds)",
      activationDate: "Activation Date",
      vpnValidityMonths: "VPN Validity (months)",
      vpnAccountingDisabled: "VPN Accounting Disabled",
      serialNumber: "Serial Number",
      activationKey: "Activation Key",
      used: "In Use",
      usedInTrial: "Used in Trial",
      deleted: "Deleted",
      clientName: "Client Name",
      notes: "Notes",
      vpnOtpRequired: "VPN OTP Required",
      vpnPairingMode: "VPN Pairing Mode",
      vpnLastAttempt: "VPN Last Attempt",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
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
        description:
          "The API key does not have permission to update device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No device license with that ID exists.",
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
      title: "Updated",
      description: "Device license updated successfully.",
    },
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving...",
    },
    widget: {
      back: "Back",
    },
  },
  delete: {
    title: "Delete Device License",
    description: "Permanently deletes a device license by ID.",
    deviceLicenseId: {
      label: "Device License ID",
      description: "Numeric device license ID to delete.",
    },
    deleteOrgResourceId: {
      label: "Org Resource ID",
      description: "Filter deletion by org.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request to Corvina was malformed.",
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
        description:
          "The API key does not have permission to delete device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No device license with that ID exists.",
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
      title: "Deleted",
      description: "Device license deleted successfully.",
    },
    submitButton: {
      label: "Delete Device License",
      loadingText: "Deleting...",
    },
    widget: {
      back: "Back",
      deletedDevice: "Deleted device",
      activationKey: "Activation key",
    },
  },
};
