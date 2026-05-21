export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
  },
  post: {
    title: "Create Sub-Organization",
    description:
      "Creates a child organization under an existing Corvina organization.",
    orgId: {
      label: "Parent Organization ID",
      description: "Numeric ID of the parent Corvina organization.",
    },
    name: {
      label: "Name",
      description:
        "Lowercase slug identifier (letters, numbers, hyphens, underscores).",
      placeholder: "my-sub-org",
    },
    label: {
      label: "Display Label",
      description: "Human-readable display name shown in the Corvina UI.",
      placeholder: "My Sub Org",
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
    hostname: {
      label: "Custom Hostname",
      description: "Optional custom hostname for this sub-organization.",
      placeholder: "https://sub.example.com",
    },
    allowHostname: {
      label: "Allow Custom Hostname",
      description: "Enable the custom hostname field.",
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
    },
    submitButton: {
      label: "Create Sub-Organization",
      loadingText: "Creating…",
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
          "The API key does not have permission to create sub-organizations.",
      },
      notFound: {
        title: "Not Found",
        description: "No parent organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "An organization with that name already exists.",
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
      description: "Sub-organization created successfully.",
    },
  },
};
