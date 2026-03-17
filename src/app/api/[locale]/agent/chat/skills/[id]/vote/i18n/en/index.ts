export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  post: {
    title: "Vote for Skill",
    description:
      "Toggle upvote on a community skill. Idempotent — call again to remove your vote.",
    dynamicTitle: "Vote: {{name}}",
    errors: {
      validation: { title: "Validation Error", description: "Invalid request" },
      network: {
        title: "Network Error",
        description: "Failed to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to vote",
      },
      forbidden: {
        title: "Forbidden",
        description: "You cannot vote on this skill",
      },
      notFound: { title: "Not Found", description: "Skill not found" },
      server: {
        title: "Server Error",
        description: "An error occurred while processing your vote",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: { title: "Conflict", description: "A conflict occurred" },
    },
    success: {
      title: "Vote Recorded",
      description: "Your vote has been updated",
    },
    response: {
      voted: { content: "Voted" },
      voteCount: { content: "Vote Count" },
      trustLevel: { content: "Trust Level" },
    },
    button: {
      vote: "Upvote",
      unvote: "Remove Vote",
      loading: "Saving...",
    },
    badge: {
      verified: "Verified",
    },
  },
};
