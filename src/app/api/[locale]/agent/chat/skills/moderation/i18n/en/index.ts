export const translations = {
  category: "AI Skills",
  tags: {
    moderation: "Moderation",
  },
  get: {
    title: "Reported Skills",
    description: "List skills with reports, sorted by report count",
    fields: {
      minReports: {
        label: "Min Reports",
        description: "Minimum report count to include (default: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maximum number of skills to return",
      },
      offset: {
        label: "Offset",
        description: "Number of skills to skip for pagination",
      },
    },
    response: {
      skills: {
        id: { content: "Skill ID" },
        name: { content: "Name" },
        ownerAuthorId: { content: "Owner ID" },
        status: { content: "Status" },
        reportCount: { content: "Reports" },
        voteCount: { content: "Votes" },
        trustLevel: { content: "Trust Level" },
        publishedAt: { content: "Published At" },
        updatedAt: { content: "Updated At" },
      },
      totalCount: { content: "Total" },
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Connection failed" },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      notFound: { title: "Not Found", description: "No skills found" },
      server: {
        title: "Server Error",
        description: "Failed to load reported skills",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
    },
    success: {
      title: "Skills Loaded",
      description: "Reported skills retrieved successfully",
    },
    empty: "No reported skills - community looks healthy!",
    action: {
      moderate: "Moderate",
    },
    backButton: {
      label: "Back",
    },
  },
  patch: {
    title: "Moderate Skill",
    description: "Hide a reported skill or clear its reports",
    fields: {
      id: {
        label: "Skill ID",
        description: "ID of the skill to moderate",
      },
      action: {
        label: "Action",
        description:
          "hide = set status to UNLISTED, clear = reset report count to 0",
      },
    },
    response: {
      id: { content: "Skill ID" },
      status: { content: "New Status" },
      reportCount: { content: "Report Count" },
    },
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: { title: "Network Error", description: "Connection failed" },
      unauthorized: {
        title: "Unauthorized",
        description: "Admin access required",
      },
      forbidden: { title: "Forbidden", description: "Admin access required" },
      notFound: { title: "Not Found", description: "Skill not found" },
      server: {
        title: "Server Error",
        description: "Failed to moderate skill",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "Data conflict occurred" },
    },
    success: {
      title: "Skill Moderated",
      description: "Action applied successfully",
    },
  },
};
