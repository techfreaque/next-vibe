export const translations = {
  errors: {
    unexpectedError:
      "An unexpected error occurred: {{error}}. Please try again.",
  },
  post: {
    title: "Revival",
    titleShort: "Revival",
    description:
      "Continues an existing thread after an async task completes (callbackMode=wait or wakeUp). Scheduled as a one-shot cron task by TaskCompletion.handle; the cron pulse executes it on the correct instance.",
    fields: {
      threadId: {
        title: "Thread ID",
        description: "UUID of the thread to continue.",
      },
      favoriteId: {
        title: "Favorite ID",
        description: "Saved favorite to load model and skill from.",
      },
      modelId: {
        title: "Model ID",
        description: "AI model for the resumed turn.",
      },
      skillId: {
        title: "Skill ID",
        description: "Skill/persona for the resumed turn.",
      },
      callbackMode: {
        title: "Callback Mode",
        description: "wait or wakeUp — determines revival behavior.",
      },
      wakeUpToolMessageId: {
        title: "Tool Message ID",
        description:
          "Original tool call message ID with the backfilled result.",
      },
      wakeUpTaskId: {
        title: "WakeUp Task ID",
        description: "Originating wakeUp cron task, deleted after revival.",
      },
      resumeTaskId: {
        title: "Revival Task ID",
        description: "This revival cron task itself, deleted after revival.",
      },
      resumed: {
        title: "Resumed",
        description: "Whether the thread was successfully continued.",
      },
      lastAiMessageId: {
        title: "Last AI Message ID",
        description: "UUID of the final assistant message generated.",
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid parameters — threadId must be a valid UUID.",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required.",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access denied.",
      },
      notFound: {
        title: "Not Found",
        description: "Thread or model not found.",
      },
      internal: {
        title: "Server Error",
        description: "Internal error during stream revival.",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred.",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred.",
      },
      unsaved: {
        title: "Unsaved Changes",
        description: "Conflict with unsaved changes.",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred.",
      },
    },
    success: {
      title: "Thread Revived",
      description: "The AI thread was successfully continued.",
    },
  },
};
