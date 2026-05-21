export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizations",
    userGroups: "User Groups",
  },
  get: {
    title: "Get User Group",
    description: "Fetches a single user group by ID.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    groupId: {
      label: "Group ID",
      description: "Numeric user group ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organization ID",
      type: "Type",
      owner: "Owner",
      membershipRole: "Membership Role",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
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
        description: "No access to this user group.",
      },
      notFound: {
        title: "Not Found",
        description: "No user group with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
      description: "User group fetched successfully.",
    },
    widget: { prefix: "Group" },
  },
  put: {
    title: "Update User Group",
    description: "Updates members and roles of a user group.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    groupId: {
      label: "Group ID",
      description: "Numeric user group ID.",
    },
    membersId: {
      label: "Member IDs",
      description: "Comma-separated list of user IDs to assign as members.",
      placeholder: "1, 2, 3",
    },
    rolesId: {
      label: "Role IDs",
      description: "Comma-separated list of role IDs to assign.",
      placeholder: "10, 20",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organization ID",
      type: "Type",
      owner: "Owner",
      membershipRole: "Membership Role",
    },
    submitButton: { label: "Save changes", loadingText: "Saving…" },
    errors: {
      validation: {
        title: "Invalid Update",
        description: "Corvina rejected the update.",
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
        description: "No write access to this group.",
      },
      notFound: {
        title: "Not Found",
        description: "No user group with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
      description: "User group updated successfully.",
    },
    widget: { prefix: "Updated group" },
  },
  delete: {
    title: "Delete User Group",
    description: "Deletes a user group from the organization.",
    orgId: {
      label: "Organization ID",
      description: "Numeric Corvina organization ID.",
    },
    groupId: {
      label: "Group ID",
      description: "Numeric user group ID to delete.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organization ID",
      type: "Type",
      owner: "Owner",
      membershipRole: "Membership Role",
    },
    errors: {
      validation: {
        title: "Invalid Request",
        description: "The request was malformed.",
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
        description: "No access to delete this group.",
      },
      notFound: {
        title: "Not Found",
        description: "No user group with that ID.",
      },
      conflict: {
        title: "Conflict",
        description: "Corvina reported a conflict.",
      },
      server: {
        title: "Server Error",
        description: "Corvina returned a server error.",
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
      description: "User group deleted successfully.",
    },
    widget: { prefix: "Deleted group" },
  },
};
