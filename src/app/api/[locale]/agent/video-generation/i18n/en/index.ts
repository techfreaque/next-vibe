// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    video: "Video",
    generation: "Generation",
    ai: "AI",
  },
  post: {
    title: "Generate Video",
    dynamicTitle: "Video: {{prompt}}",
    description: "Generate a video from a text prompt using AI",
    form: {
      title: "Video Generation",
      description: "Enter a prompt to generate a video",
    },
    prompt: {
      label: "Prompt",
      description: "Describe the video you want to generate",
      placeholder: "A cinematic shot of a mountain lake at sunset...",
    },
    model: {
      label: "Model",
      description: "Select a video generation model",
    },
    duration: {
      label: "Duration",
      description: "Length of the generated video clip",
      short: "Short (~5s)",
      medium: "Medium (~10s)",
      long: "Long (~15s)",
    },
    download: "Download",
    generatingNote: "Video generation can take 1–3 minutes",
    backButton: {
      label: "Back",
    },
    submitButton: {
      text: "Generate Video",
      label: "Generate Video",
      loadingText: "Generating...",
    },
    response: {
      videoUrl: "Generated video URL",
      creditCost: "Credits used",
      durationSeconds: "Duration in seconds",
      jobId: "Async job ID",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "Please check your prompt and settings",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to connect to video generation service",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Please sign in to generate videos",
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
        description: "An unexpected error occurred during video generation",
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
        description: "A conflict occurred during video generation",
      },
      notAVideoModel:
        "The selected model does not support video generation. Please select a video model.",
      notConfigured:
        "{{label}} is not configured. Add {{envKey}} to your .env file. Get your key at {{url}}",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      generationFailed: "Video generation failed: {{error}}",
      providerError: "Video provider error: {{error}}",
      noVideoUrl: "No video URL returned from provider",
      creditsFailed: "Failed to deduct credits for video generation",
    },
    success: {
      title: "Video Generated",
      description: "Your video has been generated successfully",
    },
  },
} as const;
