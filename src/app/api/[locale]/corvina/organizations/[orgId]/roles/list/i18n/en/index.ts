export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Roles",
  },
  get: {
    title: "List Org Roles",
    description: "Lists all roles defined in a Corvina organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    page: {
      label: "Page",
      description: "Zero-based page number.",
    },
    pageSize: {
      label: "Page Size",
      description: "Number of roles per page (max 100).",
    },
    response: {
      roles: {
        id: "ID",
        name: "Name",
        label: "Label",
        resourceId: "Resource ID",
        description: "Description",
        type: "Type",
        owner: "Owner",
        enabled: "Enabled",
        defaultStar: "Default",
        deleted: "Deleted",
        createdAt: "Created At",
        updatedAt: "Updated At",
        deviceGeneralPermission: "Device Permission",
        vpnGeneralPermission: "VPN Permission",
        orgResourceId: "Org Resource ID",
      },
      totalElements: "Total Roles",
      totalPages: "Total Pages",
      last: "Last Page",
    },
    widget: {
      title: "Roles",
      emptyState: "No roles found.",
      badges: {
        enabled: "Enabled",
        disabled: "Disabled",
        defaultRole: "Default",
      },
    },
    enums: {
      roleType: {
        application: "Application",
        device: "Device",
        undefined: "Undefined",
      },
      roleOwner: {
        system: "System",
        organization: "Organization",
        application: "Application",
      },
      permissionLevel: {
        none: "None",
        regularUser: "Regular User",
        administrator: "Administrator",
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
        description: "The API key does not have access to list roles.",
      },
      notFound: {
        title: "Not Found",
        description: "No organization with that ID exists.",
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
      description: "Roles fetched successfully.",
    },
  },
};
