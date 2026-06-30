export const translations = {
  category: "AI Tools",
  tags: {
    skills: "skills",
  },
  post: {
    title: "Vote for Skill",
    titleShort: "Vote Skill",
    description:
      "Vote up or down on a community skill. Re-sending your current direction removes the vote; sending the opposite flips it.",
    dynamicTitle: "Vote: {{name}}",
    direction: {
      label: "Direction",
      description: "Vote direction: up (helpful) or down (not helpful).",
      up: "Upvote",
      down: "Downvote",
    },
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
      userVote: { content: "Your Vote" },
      voteCount: { content: "Score" },
      upCount: { content: "Upvotes" },
      downCount: { content: "Downvotes" },
      trustLevel: { content: "Trust Level" },
    },
    backButton: {
      label: "Back",
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
