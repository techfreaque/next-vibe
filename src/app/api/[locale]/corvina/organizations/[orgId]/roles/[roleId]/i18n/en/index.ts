export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Roles",
  },
  get: {
    title: "Get Role",
    description: "Fetches a single Corvina organization role by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    roleId: {
      label: "Role ID",
      description: "Numeric Corvina role ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Label",
      resourceId: "Resource ID",
      description: "Description",
      type: "Type",
      owner: "Owner",
      enabled: "Enabled",
      defaultStar: "Default",
      deviceGeneralPermission: "Device Permission",
      vpnGeneralPermission: "VPN Permission",
      orgResourceId: "Org Resource ID",
    },
    widget: {
      edit: "Edit",
      delete: "Delete",
      sections: {
        identity: "Identity",
        permissions: "Permissions",
      },
      labels: {
        name: "Name",
        label: "Label",
        resourceId: "Resource ID",
        description: "Description",
        type: "Type",
        owner: "Owner",
      },
      badges: {
        enabled: "Enabled",
        disabled: "Disabled",
        defaultRole: "Default",
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
        description: "The API key does not have access to this role.",
      },
      notFound: {
        title: "Not Found",
        description: "No role with that ID exists.",
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
      description: "Role fetched successfully.",
    },
  },
  put: {
    title: "Update Role",
    description: "Updates an existing Corvina organization role.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    roleId: {
      label: "Role ID",
      description: "Numeric Corvina role ID to update.",
    },
    label: {
      label: "Display Label",
      description: "Human-readable label shown in the UI.",
      placeholder: "My Role",
    },
    descriptionField: {
      label: "Description",
      description: "Description of what this role grants.",
      placeholder: "Grants access to...",
    },
    type: {
      label: "Role Type",
      description: "Type of resource this role applies to.",
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
    submitButton: {
      label: "Save Changes",
      loadingText: "Saving…",
    },
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
        description: "The API key does not have write access to this role.",
      },
      notFound: {
        title: "Not Found",
        description: "No role with that ID exists.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict for this update.",
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
      description: "Role updated successfully.",
    },
  },
  delete: {
    title: "Delete Role",
    description: "Permanently deletes a Corvina organization role.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    roleId: {
      label: "Role ID",
      description: "Numeric Corvina role ID to delete.",
    },
    widget: {
      warning: "This action is permanent and cannot be undone.",
      confirmButton: "Delete Role",
      cancelButton: "Cancel",
      deletedTitle: "Role Deleted",
      deletedDescription: "The role has been permanently removed.",
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
          "The API key does not have permission to delete this role.",
      },
      notFound: {
        title: "Not Found",
        description: "No role with that ID exists.",
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
      description: "Role deleted successfully.",
    },
  },
};
