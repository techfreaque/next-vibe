export const translations = {
  tags: {
    music: "Music",
    generation: "Generation",
    ai: "AI",
  },
  post: {
    title: "Generate Music",
    titleShort: "Generate Music",
    dynamicTitle: "Music: {{prompt}}",
    description:
      "Generate music from a text prompt. Use list-models with modelType=audio to see available music models. Pass model id to select a specific model, or leave blank for the user's default. Optionally pass inputMediaUrl for audio-to-audio style transfer. Returns audioUrl and durationSeconds.",
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
      description:
        "Music generation model id. Leave blank for user default. Use list-models (modelType=audio) to browse available models.",
    },
    duration: {
      label: "Duration",
      description: "Length of the generated audio clip",
      short: "Short (~8s)",
      medium: "Medium (~20s)",
      long: "Long (~30s)",
    },
    inputMediaUrl: {
      label: "Reference Audio URL",
      description:
        "Audio URL for style transfer or remix. The model uses this as a starting point. Only works with models that support audio input.",
      placeholder: "https://example.com/audio.mp3",
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
      noModelConfigured:
        "No music model configured. Set a music model in your favorite settings.",
      notAnAudioModel:
        "The selected model does not support music generation. Please select a music model.",
      notConfigured:
        "{{label}} is not configured. Add {{envKey}} to your .env file. Get your key at {{url}}",
      providerUnsupported: "{{label}} is not supported yet",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      unsupportedDuration:
        "Model {{model}} does not support duration {{duration}}. Supported durations: {{supported}}",
      generationFailed: "Music generation failed",
      providerError: "Music provider error: {{error}}",
      noAudioUrl: "No audio URL returned from provider",
      creditsFailed: "Failed to deduct credits for music generation",
      apiKeyNotConfigured: "API key not configured",
      externalServiceError: "External service error: {{message}}",
      requestAborted: "Request was aborted",
      requestTimedOut: "Request timed out waiting for music generation",
      requestFailed: "Request failed: {{message}}",
      pollFailed: "Poll request failed with status {{status}}",
    },
    success: {
      title: "Music Generated",
      description: "Your music has been generated successfully",
    },
  },
  models: {
    names: {
      MUSICGEN_STEREO: "MusicGen Stereo",
      MUSIC_GEN: "ModelsLab Music Gen",
      ELEVENLABS_MUSIC: "ElevenLabs Music",
      CASSETTE_MUSIC: "CassetteAI Music",
      SONAUTO_SONG: "Sonauto Song",
      LYRIA_3: "Lyria 3",
    },
  },
};
