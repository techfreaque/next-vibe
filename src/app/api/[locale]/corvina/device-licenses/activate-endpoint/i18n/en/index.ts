export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  post: {
    title: "Activate Endpoint Device License",
    description: "Activates a device license for an endpoint device.",
    activationKey: {
      label: "Activation Key",
      description: "The device activation key.",
      placeholder: "0123-4567-89AB-CDEF",
    },
    alias: {
      label: "Alias",
      description: "Device alias.",
      placeholder: "my-device",
    },
    deviceSerialNumber: {
      label: "Serial Number",
      description: "Device serial number.",
      placeholder: "1234567890",
    },
    endpointDescription: {
      label: "Description",
      description: "Device description.",
      placeholder: "My endpoint device",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Target organization.",
      placeholder: "org.resource.id",
    },
    logicalId: {
      label: "Logical ID",
      description: "Optional logical ID (base64 URL-safe).",
      placeholder: "",
    },
    numOfSecondsVpn: {
      label: "VPN Seconds",
      description: "Seconds to add to VPN subscription.",
      placeholder: "2592000",
    },
    autorenewVpn: {
      label: "VPN Auto-Renew",
      description: "Whether VPN will auto-renew.",
    },
    gatewayId: {
      label: "Gateway ID",
      description: "Logical ID of the gateway device.",
      placeholder: "",
    },
    response: {
      id: "ID",
      logicalId: "Logical ID",
      serialNumber: "Serial Number",
      clientName: "Client Name",
      orgResourceId: "Org Resource ID",
      activationKey: "Activation Key",
      fromDateVpn: "VPN From",
      toDateVpn: "VPN To",
      activationDate: "Activated",
      vpnValidityMonths: "VPN Validity (months)",
      numOfSecondsAutoRenewVpn: "Auto-Renew Seconds",
      used: "Used",
      deleted: "Deleted",
    },
    widget: {
      title: "Activate Endpoint",
      back: "Back",
    },
    submitButton: {
      label: "Activate Endpoint",
      loadingText: "Activating...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request is invalid. Check activationKey and alias.",
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
        description: "No permission to activate endpoint device license.",
      },
      notFound: {
        title: "Not Found",
        description: "Device license or activation key not found.",
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
      title: "Endpoint Activated",
      description: "Endpoint device license activated successfully.",
    },
  },
};
