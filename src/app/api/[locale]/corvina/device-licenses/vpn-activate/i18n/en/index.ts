export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  post: {
    title: "Activate Device VPN",
    description: "Activates VPN for a device license.",
    logicalId: {
      label: "Logical ID",
      description: "The logical ID of the device to activate VPN for.",
      placeholder: "device-logical-id",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "The organization in which to perform the activation.",
      placeholder: "org.resource.id",
    },
    numOfSeconds: {
      label: "Duration (seconds)",
      description: "Number of seconds for the VPN period.",
      placeholder: "2592000",
    },
    autorenew: {
      label: "Auto-Renew Enabled",
      description: "Whether VPN will auto-renew when it expires.",
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
      title: "Activate VPN",
      back: "Back",
    },
    submitButton: {
      label: "Activate VPN",
      loadingText: "Activating...",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description:
          "The request is invalid. Check logicalId and numOfSeconds.",
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
        description: "No permission to activate device VPN.",
      },
      notFound: {
        title: "Not Found",
        description: "Device license not found.",
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
      title: "VPN Activated",
      description: "VPN activated successfully for the device license.",
    },
  },
};
