// eslint-disable-next-line i18next/no-literal-string
export const translations = {
  tags: {
    music: "Music",
    generation: "Generation",
    ai: "AI",
  },
  post: {
    title: "Generate Music",
    dynamicTitle: "Music: {{prompt}}",
    description: "Generate music from a text prompt using AI",
    form: {
      title: "Music Generation",
      description: "Enter a prompt to generate music",
    },
    prompt: {
      label: "Prompt",
      description: "Describe the music you want to generate",
      placeholder: "Upbeat electronic music with a catchy melody...",
    },
    model: {
      label: "Model",
      description: "Select a music generation model",
    },
    duration: {
      label: "Duration",
      description: "Length of the generated audio clip",
      short: "Short (~8s)",
      medium: "Medium (~20s)",
      long: "Long (~30s)",
    },
    download: "Download",
    separator: "·",
    backButton: {
      label: "Back",
    },
    submitButton: {
      text: "Generate Music",
      label: "Generate Music",
      loadingText: "Generating...",
    },
    response: {
      audioUrl: "Generated audio URL",
      creditCost: "Credits used",
      durationSeconds: "Duration in seconds",
      inputRef: "Input media reference",
      jobId: "Async job ID",
    },
    errors: {
      validation_failed: {
        title: "Validation Error",
        description: "Please check your prompt and settings",
      },
      network_error: {
        title: "Network Error",
        description: "Failed to connect to music generation service",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "Please sign in to generate music",
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
        description: "An unexpected error occurred during music generation",
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
        description: "A conflict occurred during music generation",
      },
      notAnAudioModel:
        "The selected model does not support music generation. Please select a music model.",
      notConfigured:
        "{{label}} is not configured. Add {{envKey}} to your .env file. Get your key at {{url}}",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      generationFailed: "Music generation failed: {{error}}",
      providerError: "Music provider error: {{error}}",
      noAudioUrl: "No audio URL returned from provider",
      creditsFailed: "Failed to deduct credits for music generation",
    },
    success: {
      title: "Music Generated",
      description: "Your music has been generated successfully",
    },
  },
} as const;
