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
    invite: "Invite",
  },
  post: {
    title: "Invite member",
    titleShort: "Invite member",
    description: "Invite a registered user to the company by email",
    companyId: {
      label: "Company ID",
      description: "The company to invite the user to",
    },
    email: {
      label: "User email",
      description: "Email of the registered user to invite",
      placeholder: "colleague@company.com",
    },
    role: {
      label: "Role",
      description: "The role to assign to the new member",
      placeholder: "Select role",
    },
    errors: {
      validation: {
        title: "Validation error",
        description: "Check the email and try again",
      },
      unauthorized: {
        title: "Not signed in",
        description: "Sign in to invite members",
      },
      forbidden: {
        title: "Access denied",
        description: "Admin or Owner role required to invite members",
      },
      conflict: {
        title: "Already a member",
        description: "This user is already a member of the company",
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
        title: "User not found",
        description: "No registered user found with this email",
      },
      unsavedChanges: {
        title: "Unsaved changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Member invited",
      description: "The user has been added to the company",
    },
    response: {
      memberId: "Member ID",
      userId: "User ID",
      role: "Role",
    },
    widget: {
      back: "Back to Members",
      invited: "Member invited",
    },
  },
};
