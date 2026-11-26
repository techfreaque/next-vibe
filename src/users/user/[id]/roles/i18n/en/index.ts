export const translations = {
  category: "Users",

  roles: {
    widget: {
      added: "Role granted: {{role}}",
      removed: "Role removed: {{role}}",
      removeWarning:
        "The user loses every permission this role grants on their next request.",
      addHint: "Takes effect on the user's next request.",
    },
    post: {
      title: "Add user role",
      titleShort: "Add role",
      description: "Grant a role to a specific user account",
      container: {
        title: "Add role",
        description: "Select a role to grant to this user",
      },
      id: {
        label: "User",
        description: "Unique identifier of the user to grant the role to",
        placeholder: "Enter user ID...",
      },
      role: {
        label: "Role",
        description: "The role to grant to the user",
        placeholder: "Select a role...",
      },
      submit: {
        label: "Add role",
      },
      response: {
        roleId: {
          content: "Role assignment ID",
        },
        userId: {
          content: "User ID",
        },
        assignedRole: {
          content: "Assigned role",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to manage user roles",
        },
        validation: {
          title: "Validation failed",
          description: "Please provide a valid user ID and role",
        },
        forbidden: {
          title: "Access forbidden",
          description: "Only administrators can manage user roles",
        },
        notFound: {
          title: "User not found",
          description: "The specified user could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Role already assigned",
          description: "This user already has the specified role",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server error",
          description: "Unable to add role due to server error",
          detail: "Could not grant the {{role}} role to user {{userId}}.",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while adding the role",
        },
      },
      success: {
        title: "Role added",
        description: "The role has been successfully granted to the user",
      },
    },
    delete: {
      title: "Remove user role",
      titleShort: "Remove role",
      description: "Revoke a role from a specific user account",
      container: {
        title: "Remove role",
        description: "Select a role to revoke from this user",
      },
      id: {
        label: "User",
        description: "Unique identifier of the user to revoke the role from",
        placeholder: "Enter user ID...",
      },
      role: {
        label: "Role",
        description: "The role to revoke from the user",
        placeholder: "Select a role...",
      },
      submit: {
        label: "Remove role",
      },
      response: {
        success: {
          content: "Role removed",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to manage user roles",
        },
        validation: {
          title: "Validation failed",
          description: "Please provide a valid user ID and role",
        },
        forbidden: {
          title: "Access forbidden",
          description: "Only administrators can manage user roles",
        },
        notFound: {
          title: "User not found",
          description: "The specified user could not be found",
          detail: "No user found with ID {{userId}}.",
        },
        conflict: {
          title: "Conflict error",
          description: "Unable to remove role due to existing dependencies",
        },
        network: {
          title: "Network error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server error",
          description: "Unable to remove role due to server error",
          detail: "Could not remove the {{role}} role from user {{userId}}.",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred while removing the role",
        },
      },
      success: {
        title: "Role removed",
        description: "The role has been successfully revoked from the user",
      },
    },
  },
  enums: {
    userRole: {
      public: "Public",
      customer: "Customer",
      partnerAdmin: "Partner admin",
      partnerEmployee: "Partner employee",
      admin: "Admin",
      cliOff: "CLI disabled",
      cliAuthBypass: "CLI auth bypass",
      aiToolOff: "AI tool disabled",
      webOff: "Web disabled",
      mcpOff: "MCP disabled",
      mcpVisible: "MCP visible",
      productionOff: "Production disabled",
      skillOff: "Skill disabled",
    },
  },
};
