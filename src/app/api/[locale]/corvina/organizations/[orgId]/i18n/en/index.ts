export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  get: {
    title: "Get Corvina Organization",
    description: "Fetches a single customer organization by id.",
    container: {
      title: "Organization",
      description: "Full details of one Corvina organization.",
    },
    id: {
      label: "Organization ID",
      description: "Numeric or name-based Corvina organization id.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Label",
      status: "Status",
      resourceId: "Resource ID",
      privateAccess: "Private Access",
      allowDisablePrivateAccess: "Allow Disable Private Access",
      hostname: "Hostname",
      hostnameAllowed: "Hostname Allowed",
      dataEnabled: "Data Enabled",
      vpnEnabled: "VPN Enabled",
      vpnPairingMode: "VPN Pairing Mode",
      vpnOtpRequired: "VPN OTP Required",
      ipAddressesWhitelist: "IP Whitelist",
      userCanAccess: "User Can Access",
      storeEnabled: "Store Enabled",
      dataTemporarilyDisabled: "Data Temporarily Disabled",
      mfaRequired: "MFA Required",
    },
    widget: {
      edit: "Edit",
      devices: "Devices",
      apps: "Apps",
      sections: {
        identity: "Identity",
        network: "Network",
        securityServices: "Security & Services",
      },
      labels: {
        name: "Name",
        label: "Label",
        resourceId: "Resource ID",
        hostname: "Hostname",
      },
      cli: {
        hostnameLabel: "hostname: ",
      },
      badges: {
        dataOn: "Data On",
        dataOff: "Data Off",
        vpnOn: "VPN On",
        vpnOff: "VPN Off",
        private: "Private",
        public: "Public",
        customHostname: "Custom Hostname",
        mfaRequired: "MFA Required",
        mfaOff: "MFA Off",
        vpnOtp: "VPN OTP",
        noOtp: "No OTP",
        storeOn: "Store On",
        storeOff: "Store Off",
        userAccess: "User Access",
        noUserAccess: "No User Access",
        dataTemporarilyDisabled: "Data Temporarily Disabled",
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
        description: "Corvina rejected the API key. Check CORVINA_API_KEY.",
      },
      forbidden: {
        title: "Forbidden",
        description:
          "The API key does not have read access to this organization.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that id exists.",
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
    enums: {
      orgStatus: {
        new: "New",
        provisioning: "Provisioning",
        done: "Active",
        deleting: "Deleting",
        deleted: "Deleted",
      },
    },
    success: {
      title: "Success",
      description: "Organization fetched successfully.",
    },
  },
  put: {
    title: "Update Corvina Organization",
    description: "Updates the configuration of a Corvina organization.",
    container: {
      title: "Edit Organization",
      description: "Change the label, network settings, and feature flags.",
    },
    id: {
      label: "Organization ID",
      description: "Numeric or name-based Corvina organization id to update.",
    },
    label: {
      label: "Label",
      description: "Human-readable display label shown in the Corvina UI.",
      placeholder: "My Organization",
    },
    hostname: {
      label: "Custom Hostname",
      description:
        "Custom hostname for this organization (leave blank to clear).",
      placeholder: "https://org.example.com",
    },
    ipAddressesWhitelist: {
      label: "IP Whitelist",
      description:
        "Comma-separated list of allowed IP addresses (leave blank to allow all).",
      placeholder: "127.0.0.1, 10.0.0.0/8",
    },
    privateAccess: {
      label: "Private Access",
      description: "Restrict access to VPN-connected users only.",
    },
    allowDisablePrivateAccess: {
      label: "Allow Disable Private Access",
      description:
        "Allow users to temporarily disable private access restriction.",
    },
    allowHostname: {
      label: "Allow Custom Hostname",
      description: "Enable the custom hostname field above.",
    },
    dataEnabled: {
      label: "Data Enabled",
      description: "Enable data services for this organization.",
    },
    vpnEnabled: {
      label: "VPN Enabled",
      description: "Enable VPN access for this organization.",
    },
    storeEnabled: {
      label: "Store Enabled",
      description: "Enable the Corvina store for this organization.",
    },
    mfaRequired: {
      label: "MFA Required",
      description: "Enforce multi-factor authentication for all users.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Label",
      status: "Status",
      resourceId: "Resource ID",
      privateAccess: "Private Access",
      allowDisablePrivateAccess: "Allow Disable Private Access",
      hostname: "Hostname",
      hostnameAllowed: "Hostname Allowed",
      dataEnabled: "Data Enabled",
      vpnEnabled: "VPN Enabled",
      vpnPairingMode: "VPN Pairing Mode",
      vpnOtpRequired: "VPN OTP Required",
      ipAddressesWhitelist: "IP Whitelist",
      userCanAccess: "User Can Access",
      storeEnabled: "Store Enabled",
      dataTemporarilyDisabled: "Data Temporarily Disabled",
      mfaRequired: "MFA Required",
    },
    submitButton: { label: "Save changes", loadingText: "Saving…" },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update payload.",
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
          "The API key does not have write access to this organization.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that id exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reports a conflict for this update.",
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
      title: "Saved",
      description: "Organization updated successfully.",
    },
  },
};
