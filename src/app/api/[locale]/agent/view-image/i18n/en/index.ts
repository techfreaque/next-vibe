export const translations = {
  post: {
    title: "View Image",
    description:
      "Fetch and display a previously captured image by its storage URL. Use this to re-examine a screenshot or image from an earlier turn.",
    dynamicTitle: "View: {{url}}",
    url: {
      label: "Image URL",
      description: "Storage URL of the image to view",
      placeholder: "https://...",
    },
    response: {
      url: "Image URL",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "The provided URL is invalid",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to fetch the image",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to view this image",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to this image is forbidden",
      },
      not_found: {
        title: "Image Not Found",
        description: "No image was found at the provided URL",
      },
      server_error: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown_error: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsaved_changes: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Image Loaded",
      description: "The image was successfully retrieved",
    },
  },
  tags: {
    vision: "Vision",
    ai: "AI",
  },
};
