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
        title: "Access Denied",
        description: "You do not have permission to perform this action",
      },
      notFound: {
        title: "Company Not Found",
        description: "This company does not exist",
      },
      server: {
        title: "Server Error",
        description: "Something went wrong — try again",
      },
      patchNotFound: {
        title: "Company Not Found",
        description: "Could not find company to update",
      },
      patchServer: {
        title: "Server Error",
        description: "Failed to update company",
      },
    },
  },

  // update-role endpoint translations
  updateRole: {
    patch: {
      title: "Update Member Role",
      titleShort: "Update Role",
      description: "Change a member's role. Owner only.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: { label: "Member ID", description: "The member to update" },
      role: {
        label: "New Role",
        description: "Role to assign to this member",
        placeholder: "Select role",
      },
      errors: {
        validation: { title: "Validation Error", description: "Invalid input" },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to update member roles",
        },
        forbidden: {
          title: "Owner Only",
          description: "Only the company Owner can change member roles",
        },
        conflict: { title: "Conflict", description: "Data conflict" },
        server: {
          title: "Server Error",
          description: "Something went wrong — try again",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Member Not Found",
          description: "This member does not exist in the company",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Role Updated",
        description: "Member role changed successfully",
      },
      response: {
        memberId: "Member ID",
        role: "New Role",
      },
      widget: {
        back: "Back to Members",
        successLabel: "Role updated",
        title: "Change Member Role",
      },
    },
  },

  // remove endpoint translations
  removeMember: {
    post: {
      title: "Remove Member",
      titleShort: "Remove Member",
      description:
        "Remove a member from the company. Cannot remove the last Owner.",
      companyId: { label: "Company ID", description: "Company" },
      memberId: { label: "Member ID", description: "The member to remove" },
      errors: {
        validation: { title: "Validation Error", description: "Invalid input" },
        unauthorized: {
          title: "Not Signed In",
          description: "Sign in to remove members",
        },
        forbidden: {
          title: "Access Denied",
          description:
            "Owner or Admin role required. Cannot remove the last Owner.",
        },
        conflict: {
          title: "Last Owner",
          description: "Cannot remove the last Owner of the company",
        },
        server: {
          title: "Server Error",
          description: "Something went wrong — try again",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        network: {
          title: "Network Error",
          description: "Check your connection and try again",
        },
        notFound: {
          title: "Member Not Found",
          description: "This member does not exist in the company",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
      },
      success: {
        title: "Member Removed",
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
