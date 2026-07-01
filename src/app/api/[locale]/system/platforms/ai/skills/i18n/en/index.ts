export const translations = {
  agent: {
    get: {
      title: "Agent Skill Manifest (AGENT.md)",
      description:
        "Returns a markdown document listing all AI tools available to unauthenticated agents",
      response: {
        title: "Skill Manifest",
        description: "Markdown document with all available agent tools",
      },
      success: {
        title: "Skill manifest fetched",
        description: "Agent skill manifest rendered successfully",
      },
      errors: {
        server: {
          title: "Server Error",
          description: "Failed to generate agent skill manifest",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Skill manifest not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
    },
  },
  publicUser: {
    get: {
      title: "Public User Skill Manifest (PUBLIC_USER_SKILL.md)",
      description:
        "Returns a markdown document listing all AI tools available to authenticated users",
      response: {
        title: "Skill Manifest",
        description: "Markdown document with tools for signed-in users",
      },
      success: {
        title: "Skill manifest fetched",
        description: "Public user skill manifest rendered successfully",
      },
      errors: {
        server: {
          title: "Server Error",
          description: "Failed to generate public user skill manifest",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Skill manifest not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
    },
  },
  userWithAccount: {
    get: {
      title: "User With Account Skill Manifest (USER_WITH_ACCOUNT_SKILL.md)",
      description:
        "Returns a markdown document listing tools that require an authenticated account",
      response: {
        title: "Skill Manifest",
        description: "Markdown document with account-required tools",
      },
      success: {
        title: "Skill manifest fetched",
        description: "User with account skill manifest rendered successfully",
      },
      errors: {
        server: {
          title: "Server Error",
          description: "Failed to generate user with account skill manifest",
        },
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        network: {
          title: "Network Error",
          description: "Failed to connect to the server",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Skill manifest not found",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsavedChanges: {
          title: "Unsaved Changes",
          description: "You have unsaved changes",
        },
        conflict: {
          title: "Conflict",
          description: "A conflict occurred",
        },
      },
    },
  },
  category: "AI Skills",
  tags: {
    skills: "skills",
    manifest: "manifest",
    agent: "agent",
  },
};
