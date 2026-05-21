export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Roles",
  },
  post: {
    title: "Create Role",
    description: "Creates a new role in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    name: {
      label: "Name",
      description: "Role name (min 2 characters).",
      placeholder: "my-role",
    },
    label: {
      label: "Display Label",
      description: "Human-readable label shown in the UI.",
      placeholder: "My Role",
    },
    descriptionField: {
      label: "Description",
      description: "Optional description of what this role grants.",
      placeholder: "Grants access to...",
    },
    type: {
      label: "Role Type",
      description: "Type of resource this role applies to.",
    },
    enabled: {
      label: "Enabled",
      description: "Enable this role immediately after creation.",
    },
    defaultStar: {
      label: "Default Role",
      description: "Automatically assign this role to new users.",
    },
    deviceGeneralPermission: {
      label: "Device Permission",
      description: "General permission level for device access.",
    },
    vpnGeneralPermission: {
      label: "VPN Permission",
      description: "General permission level for VPN access.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Label",
      type: "Type",
      enabled: "Enabled",
    },
    submitButton: {
      label: "Create Role",
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
        description: "The API key does not have permission to create roles.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "A role with that name already exists.",
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
      description: "Role created successfully.",
    },
  },
};
