export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Device Licenses",
  },
  get: {
    title: "List Device Licenses",
    description: "Fetches paginated device licenses from the Corvina platform.",
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of device licenses per page.",
    },
    orgResourceId: {
      label: "Org Resource ID",
      description: "Filter device licenses by organization resource ID.",
    },
    response: {
      total: "Total",
      totalPages: "Total Pages",
      currentPage: "Current Page",
      deviceLicenses: {
        id: "ID",
        serialNumber: "Serial Number",
        realm: "Realm",
        logicalId: "Logical ID",
        label: "Label",
        apiKey: "API Key",
        orgResourceId: "Org Resource ID",
        vpnKey: "VPN Key",
        fromDateVpn: "VPN Start Date",
        toDateVpn: "VPN End Date",
        numOfSecondsAutoRenewVpn: "VPN Auto-Renew (s)",
        activationDate: "Activation Date",
        used: "Used",
        deleted: "Deleted",
        activationKey: "Activation Key",
        clientName: "Client Name",
        notes: "Notes",
        vpnEnabled: "VPN Enabled",
        vpnValidityMonths: "VPN Validity (months)",
      },
    },
    widget: {
      title: "Device Licenses",
      noItemsFound: "No device licenses found.",
      back: "Back",
      refresh: "Refresh",
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
          "The API key does not have access to list device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "No device licenses found for the given parameters.",
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
      title: "Success",
      description: "Device licenses fetched successfully.",
    },
  },
  post: {
    title: "Create Device License",
    description: "Creates a new device license in the Corvina platform.",
    serialNumber: {
      label: "Serial Number",
      description: "Device serial number to associate with this license.",
    },
    activationKey: {
      label: "Activation Key",
      description: "Unique activation key for the device license.",
    },
    clientName: {
      label: "Client Name",
      description: "Name of the client or customer for this license.",
    },
    notes: {
      label: "Notes",
      description: "Free-form notes about this device license.",
    },
    vpnEnabled: {
      label: "VPN Enabled",
      description: "Whether VPN is enabled for this device.",
    },
    dataEnabled: {
      label: "Data Enabled",
      description: "Whether data transfer is enabled for this device.",
    },
    vpnStartDate: {
      label: "VPN Start Date",
      description: "Date from which VPN access is valid.",
    },
    vpnEndDate: {
      label: "VPN End Date",
      description: "Date until which VPN access is valid.",
    },
    vpnValidityMonths: {
      label: "VPN Validity (months)",
      description: "Number of months the VPN subscription is valid.",
    },
    vpnAccountingDisabled: {
      label: "VPN Accounting Disabled",
      description: "Disable VPN usage accounting for this device.",
    },
    widget: {
      title: "Create Device License",
      back: "Back",
      result: {
        title: "License Created",
      },
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
          "The API key does not have permission to create device licenses.",
      },
      notFound: {
        title: "Not Found",
        description: "The target organization or device was not found.",
      },
      conflict: {
        title: "Conflict",
        description:
          "A device license with this activation key already exists.",
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
      title: "Created",
      description: "Device license created successfully.",
    },
    submitButton: {
      label: "Create License",
      loadingText: "Creating...",
    },
  },
};
