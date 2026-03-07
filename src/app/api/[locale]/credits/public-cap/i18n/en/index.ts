export const translations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    title: "Get Public Free-Tier Cap",
    description: "View today's global free-tier credit spend and cap",
    container: {
      title: "Public Free-Tier Daily Cap",
      description: "Global daily spend limit for non-paying users",
    },
    spendToday: {
      content: "Spent Today",
    },
    capAmount: {
      content: "Daily Cap",
    },
    remainingToday: {
      content: "Remaining Today",
    },
    percentUsed: {
      content: "Percent Used",
    },
    lastResetAt: {
      content: "Last Reset At",
    },
    capExceeded: {
      content: "Cap Exceeded",
    },
    success: {
      title: "Cap Status Retrieved",
      description: "Public free-tier cap status retrieved successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Cap configuration not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to retrieve cap status",
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
        description: "Resource conflict occurred",
      },
    },
  },
  post: {
    title: "Update Public Free-Tier Cap",
    description:
      "Update the global daily credit spend cap for non-paying users",
    capAmount: {
      label: "Daily Cap (credits)",
      description:
        "Maximum credits non-paying users can collectively spend per day",
      placeholder: "e.g. 500",
    },
    message: {
      content: "Result",
    },
    success: {
      title: "Cap Updated",
      description: "Daily cap updated successfully",
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Cap amount must be a positive number",
      },
      network: {
        title: "Network Error",
        description: "Network connection failed",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      forbidden: {
        title: "Forbidden",
        description: "Admin access required",
      },
      notFound: {
        title: "Not Found",
        description: "Cap configuration not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to update cap",
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
        description: "Resource conflict occurred",
      },
    },
  },
  repository: {
    capExceeded:
      "Free tier daily limit reached. Please sign up or try again tomorrow.",
    getCapFailed: "Failed to retrieve free-tier cap configuration",
    updateCapFailed: "Failed to update free-tier cap",
    incrementFailed: "Failed to record free-tier spend",
  },
};
