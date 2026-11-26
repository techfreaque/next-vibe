export const translations = {
  category: "Companies",
  tags: {
    companies: "Companies",
    create: "Create",
    list: "List",
    get: "Get",
    update: "Update",
    members: "Members",
    invite: "Invite",
    management: "Management",
  },
  endpointCategories: {
    companies: "Companies",
    companyManagement: "Company Management",
    companyMembers: "Company Members",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Individual",
    },
    companyMemberRole: {
      owner: "Owner",
      admin: "Admin",
      member: "Member",
      accountant: "Accountant",
      viewer: "Viewer",
    },
  },

  // Shared auth/repository error messages
  auth: {
    errors: {
      forbidden: {
        title: "Access denied",
        description: "You do not have permission to perform this action",
      },
      notFound: {
        title: "Company not found",
        description: "This company does not exist",
      },
      server: {
        title: "Server error",
        description: "Something went wrong. Try again.",
      },
      patchNotFound: {
        title: "Company not found",
        description: "Could not find company to update",
      },
      patchServer: {
        title: "Server error",
        description: "Failed to update company",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Update member role",
      titleShort: "Update role",
      description: "Change a member's role. Owner only.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: { label: "Member ID", description: "The member to update" },
      role: {
        label: "New role",
        description: "Role to assign to this member",
        placeholder: "Select role",
      },
      errors: {
        validation: { title: "Validation error", description: "Invalid input" },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to update member roles",
        },
        forbidden: {
          title: "Owner only",
          description: "Only the company Owner can change member roles",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server error",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Member not found",
          description: "This member does not exist in the company",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Role updated",
        description: "Member role changed successfully",
      },
      response: {
        memberId: "Member ID",
        role: "New Role",
      },
      widget: {
        back: "Back to Members",
        successLabel: "Role updated",
        title: "Change member role",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Remove member",
      titleShort: "Remove member",
      description:
        "Remove a member from the company. Cannot remove the last Owner.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: { label: "Member ID", description: "The member to remove" },
      errors: {
        validation: { title: "Validation error", description: "Invalid input" },
        unauthorized: {
          title: "Not signed in",
          description: "Sign in to remove members",
        },
        forbidden: {
          title: "Access denied",
          description:
            "Owner or Admin role required. Cannot remove the last Owner.",
        },
        conflict: {
          title: "Last owner",
          description: "Cannot remove the last Owner of the company",
        },
        server: {
          title: "Server error",
          description: "Something went wrong. Try again.",
        },
        unknown: {
          title: "Unknown error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Member not found",
          description: "This member does not exist in the company",
        },
        unsavedChanges: {
          title: "Unsaved changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Member removed",
        description: "Member has been removed from the company",
      },
      response: {
        removedMemberId: "Removed Member ID",
      },
      widget: {
        back: "Back to Members",
        successLabel: "Member removed",
        confirmTitle: "Remove this member?",
        confirmDescription:
          "They will lose access to this company immediately. This cannot be undone.",
        confirmButton: "Yes, remove member",
        cancelButton: "Cancel",
      },
    },
  },
};
