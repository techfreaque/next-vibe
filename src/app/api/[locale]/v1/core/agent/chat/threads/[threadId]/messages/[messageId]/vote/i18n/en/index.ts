export const translations = {
  post: {
    title: "Vote on Message",
    description: "Upvote or downvote a message",
    container: {
      title: "Vote",
      description: "Cast your vote on this message",
    },
    form: {
      title: "Vote on Message",
      description: "Upvote, downvote, or remove your vote",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread containing the message",
    },
    messageId: {
      label: "Message ID",
      description: "ID of the message to vote on",
    },
    vote: {
      label: "Vote",
      description: "Your vote: upvote, downvote, or remove",
      placeholder: "Select vote type...",
      options: {
        upvote: "Upvote",
        downvote: "Downvote",
        remove: "Remove Vote",
      },
    },
    response: {
      title: "Vote Result",
      description: "Updated vote counts",
      upvotes: {
        content: "Upvotes",
      },
      downvotes: {
        content: "Downvotes",
      },
      userVote: {
        content: "Your Vote",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid vote data provided",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to vote on messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to vote on this message",
      },
      notFound: {
        title: "Not Found",
        description: "Message not found",
      },
      server: {
        title: "Server Error",
        description: "Failed to record vote",
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
        description: "Vote conflict occurred",
      },
    },
    success: {
      title: "Vote Recorded",
      description: "Your vote has been recorded successfully",
    },
  },
};
