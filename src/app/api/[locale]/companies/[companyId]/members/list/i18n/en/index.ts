export const translations = {
  tags: {
    companies: "Companies",
    members: "Members",
    list: "List",
  },
  get: {
    title: "Team Members",
    titleShort: "Team Members",
    description: "List all members of this company",
    companyId: {
      label: "Company ID",
      description: "The company whose members to list",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid company ID",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to view company members",
      },
      forbidden: {
        title: "Access Denied",
        description: "You are not a member of this company",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict",
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
        title: "Company Not Found",
        description: "This company does not exist",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Members Loaded",
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
      title: "Team Members",
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
