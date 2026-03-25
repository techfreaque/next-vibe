// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    image: "Image",
    generation: "Generation",
    ai: "AI",
  },
  post: {
    title: "Generate Image",
    description: "Generate an image from a text prompt using AI",
    form: {
      title: "Image Generation",
      description: "Enter a prompt to generate an image",
    },
    prompt: {
      label: "Prompt",
      description: "Describe the image you want to generate",
      placeholder: "A sunset over a mountain lake, photorealistic...",
    },
    model: {
      label: "Model",
      description: "Select an image generation model",
    },
    size: {
      label: "Size",
      description: "Select output image dimensions",
      square1024: "Square (1024×1024)",
      landscape1792: "Landscape (1792×1024)",
      portrait1792: "Portrait (1024×1792)",
    },
    quality: {
      label: "Quality",
      description: "Select output image quality",
      standard: "Standard",
      hd: "HD",
    },
    submitButton: {
      text: "Generate Image",
      loadingText: "Generating...",
    },
    response: {
      imageUrl: "Generated image URL",
      creditCost: "Credits used",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "Please check your prompt and settings",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to connect to image generation service",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Please sign in to generate images",
      },
      forbidden: {
        title: "Forbidden",
        description: "You do not have permission to use this feature",
      },
      not_found: {
        title: "Not Found",
        description: "The requested model was not found",
      },
      server_error: {
        title: "Server Error",
        description: "An unexpected error occurred during image generation",
      },
      unknown_error: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      unsaved_changes: {
        title: "Unsaved Changes",
        description: "Please save your changes before generating",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred during image generation",
      },
      notAnImageModel:
        "The selected model does not support image generation. Please select an image model.",
      notConfigured:
        "{{label}} is not configured. Add {{envKey}} to your .env file. Get your key at {{url}}",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      generationFailed: "Image generation failed: {{error}}",
      providerError: "Image provider error: {{error}}",
      noImageUrl: "No image URL returned from provider",
      creditsFailed: "Failed to deduct credits for image generation",
    },
    success: {
      title: "Image Generated",
      description: "Your image has been generated successfully",
    },
  },
} as const;
