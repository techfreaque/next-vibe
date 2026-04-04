// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    image: "Image",
    vision: "Vision",
    ai: "AI",
  },
  post: {
    title: "Describe Image",
    dynamicTitle: "Describe: {{filename}}",
    description: "Describe the contents of an image using a vision AI model",
    fileUrl: {
      label: "Image URL",
      description: "URL of the image to describe",
    },
    context: {
      label: "Context",
      description: "Optional context to guide the description",
      placeholder: "Describe this image focusing on...",
    },
    submitButton: {
      label: "Describe Image",
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
        description: "Please provide a valid image URL",
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
        description: "The image was not found",
      },
      server_error: {
        title: "Server Error",
        description: "An unexpected error occurred during image description",
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
      noVisionModel: "No image vision model is configured",
      descriptionFailed: "Failed to describe the image",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      creditsFailed: "Failed to deduct credits",
    },
    success: {
      title: "Image Described",
      description: "The image has been described successfully",
    },
  },
} as const;
