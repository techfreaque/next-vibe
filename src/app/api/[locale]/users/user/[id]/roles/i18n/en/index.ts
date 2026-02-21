export const translations = {
  roles: {
    post: {
      title: "Add User Role",
      description: "Grant a role to a specific user account",
      container: {
        title: "Add Role",
        description: "Select a role to grant to this user",
      },
      id: {
        label: "User ID",
        description: "Unique identifier of the user to grant the role to",
        placeholder: "Enter user ID...",
      },
      role: {
        label: "Role",
        description: "The role to grant to the user",
        placeholder: "Select a role...",
      },
      submit: {
        label: "Add Role",
      },
      response: {
        roleId: {
          content: "Role Assignment ID",
        },
        userId: {
          content: "User ID",
        },
        assignedRole: {
          content: "Assigned Role",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to manage user roles",
        },
        validation: {
          title: "Validation Failed",
          description: "Please provide a valid user ID and role",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "Only administrators can manage user roles",
        },
        notFound: {
          title: "User Not Found",
          description: "The specified user could not be found",
        },
        conflict: {
          title: "Role Already Assigned",
          description: "This user already has the specified role",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server Error",
          description: "Unable to add role due to server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while adding the role",
        },
      },
      success: {
        title: "Role Added",
        description: "The role has been successfully granted to the user",
      },
    },
    delete: {
      title: "Remove User Role",
      description: "Revoke a role from a specific user account",
      container: {
        title: "Remove Role",
        description: "Select a role to revoke from this user",
      },
      id: {
        label: "User ID",
        description: "Unique identifier of the user to revoke the role from",
        placeholder: "Enter user ID...",
      },
      role: {
        label: "Role",
        description: "The role to revoke from the user",
        placeholder: "Select a role...",
      },
      submit: {
        label: "Remove Role",
      },
      response: {
        success: {
          content: "Role Removed",
        },
      },
      errors: {
        unauthorized: {
          title: "Unauthorized",
          description: "You must be logged in to manage user roles",
        },
        validation: {
          title: "Validation Failed",
          description: "Please provide a valid user ID and role",
        },
        forbidden: {
          title: "Access Forbidden",
          description: "Only administrators can manage user roles",
        },
        notFound: {
          title: "User Not Found",
          description: "The specified user could not be found",
        },
        conflict: {
          title: "Conflict Error",
          description: "Unable to remove role due to existing dependencies",
        },
        network: {
          title: "Network Error",
          description: "Unable to connect to the server",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes that will be lost",
        },
        server: {
          title: "Server Error",
          description: "Unable to remove role due to server error",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred while removing the role",
        },
      },
      success: {
        title: "Role Removed",
        description: "The role has been successfully revoked from the user",
      },
    },
  },
};
