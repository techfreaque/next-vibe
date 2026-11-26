export const translations = {
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
  tags: {
    companies: "Companies",
    members: "Members",
    list: "List",
  },
  get: {
    title: "Team members",
    titleShort: "Team members",
    description: "List all members of this company",
    companyId: {
      label: "Company ID",
      description: "The company whose members to list",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Invalid company ID",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to view company members",
      },
      forbidden: {
        title: "Access denied",
        description: "You are not a member of this company",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
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
        title: "Company not found",
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Members loaded",
      description: "Member list retrieved",
    },
    response: {
      id: "Member ID",
      userId: "User ID",
      email: "Email",
      name: "Name",
      role: "Role",
      isActive: "Active",
      joinedAt: "Joined",
    },
    widget: {
      back: "Back",
      loading: "Loading members...",
      title: "Team members",
      memberSingular: "member",
      memberPlural: "members",
      invite: "Invite Member",
      updateRole: "Change Role",
      remove: "Remove",
      active: "Active",
      inactive: "Inactive",
      empty: {
        title: "No team members yet",
        hint: "Invite colleagues to collaborate on this company's accounting and operations.",
        cta: "Invite first member",
      },
    },
  },
};
