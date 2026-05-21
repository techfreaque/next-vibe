export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  post: {
    title: "Activate Device License",
    description:
      "Activates a device license in the Corvina platform using an activation key.",
    activationKey: {
      label: "Activation Key",
      description: "Unique activation key for the device license.",
    },
    alias: {
      label: "Alias",
      description: "Optional alias for this device license.",
    },
    deviceSerialNumber: {
      label: "Device Serial Number",
      description:
        "Serial number of the device to associate with this license.",
    },
    activateDescription: {
      label: "Description",
      description: "Free-form description for this device license.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Organization resource ID to assign the license to.",
    },
    logicalId: {
      label: "Logical ID",
      description: "Logical identifier for the device.",
    },
    numOfSecondsVpn: {
      label: "VPN Duration (seconds)",
      description: "Number of seconds for VPN validity.",
    },
    autorenewVpn: {
      label: "Auto-Renew VPN",
      description: "Automatically renew VPN access when it expires.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Logical ID",
      gatewayLogicalId: "Gateway Logical ID",
      label: "Label",
      apiKey: "API Key",
      platformPairingApiUrl: "Platform Pairing URL",
      vpnPairingApiUrl: "VPN Pairing URL",
      brokerUrls: "Broker URLs",
      orgResourceId: "Org Resource ID",
      vpnKey: "VPN Key",
      fromDateVpn: "VPN Start Date",
      toDateVpn: "VPN End Date",
      numOfSecondsAutoRenewVpn: "VPN Auto-Renew (s)",
      activationDate: "Activation Date",
      vpnValidityMonths: "VPN Validity (months)",
      vpnAccountingDisabled: "VPN Accounting Disabled",
      serialNumber: "Serial Number",
      activationKey: "Activation Key",
      used: "Used",
      usedInTrial: "Used in Trial",
      deleted: "Deleted",
      clientName: "Client Name",
      notes: "Notes",
      vpnOtpRequired: "VPN OTP Required",
      vpnPairingMode: "VPN Pairing Mode",
      vpnLastAttempt: "VPN Last Attempt",
    },
    widget: {
      title: "Activate Device License",
      back: "Back",
      result: "Activated",
      noResult: "Enter an activation key to activate the device license.",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The activation request is malformed.",
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
          "The API key does not have permission to activate device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "The activation key or target resource was not found.",
      },
      conflict: {
        title: "Conflict",
        description:
          "A device license with this activation key is already active.",
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
      title: "Activated",
      description: "Device license activated successfully.",
    },
    submitButton: {
      label: "Activate License",
      loadingText: "Activating...",
    },
  },
};
