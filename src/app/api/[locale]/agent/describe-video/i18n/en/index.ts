// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    video: "Video",
    vision: "Vision",
    ai: "AI",
  },
  post: {
    title: "Describe Video",
    dynamicTitle: "Describe: {{filename}}",
    description: "Describe the contents of a video using a vision AI model",
    fileUrl: {
      label: "Video URL",
      description: "URL of the video to describe",
    },
    context: {
      label: "Context",
      description: "Optional context to guide the description",
      placeholder: "Describe this video focusing on...",
    },
    submitButton: {
      label: "Describe Video",
      loadingText: "Describing...",
    },
    response: {
      text: "Description",
      model: "Model used",
      creditCost: "Credits used",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "Please provide a valid video URL",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to connect to vision service",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Please sign in to use this feature",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to use this feature",
      },
      not_found: {
        title: "Not Found",
        description: "The video was not found",
      },
      server_error: {
        title: "Server Error",
        description: "An unexpected error occurred during video description",
      },
      unknown_error: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved_changes: {
        title: "Unsaved Changes",
        description: "Please save your changes before describing",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      noVisionModel: "No video vision model is configured",
      descriptionFailed: "Failed to describe the video",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      creditsFailed: "Failed to deduct credits",
    },
    success: {
      title: "Video Described",
      description: "The video has been described successfully",
    },
  },
} as const;
