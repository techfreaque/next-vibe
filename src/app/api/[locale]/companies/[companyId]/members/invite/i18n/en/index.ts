export const translations = {
  tags: {
    companies: "Companies",
    members: "Members",
    invite: "Invite",
  },
  post: {
    title: "Invite Member",
    description: "Invite a registered user to the company by email",
    companyId: {
      label: "Company ID",
      description: "The company to invite the user to",
    },
    email: {
      label: "User Email",
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
        title: "Validation Error",
        description: "Check the email and try again",
      },
      unauthorized: {
        title: "Not Signed In",
        description: "Sign in to invite members",
      },
      forbidden: {
        title: "Access Denied",
        description: "Admin or Owner role required to invite members",
      },
      conflict: {
        title: "Already a Member",
        description: "This user is already a member of the company",
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
        title: "User Not Found",
        description: "No registered user found with this email",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
    },
    success: {
      title: "Member Invited",
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
