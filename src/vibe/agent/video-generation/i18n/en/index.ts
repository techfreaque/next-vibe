export const translations = {
  tags: {
    video: "Video",
    generation: "Generation",
    ai: "AI",
  },
  post: {
    title: "Generate Video",
    titleShort: "Generate Video",
    dynamicTitle: "Video: {{prompt}}",
    description:
      "Generate a video from a text prompt. Use list-models (modelType=video) to see all video models with their capabilities: supportedDurations (valid clip lengths in seconds), supportedAspectRatios, supportedFrameImages (first_frame/last_frame = image-to-video support). Pass frameReferences to steer the video: role 'first' pins the opening frame and role 'last' pins the closing frame — both MUST be image URLs (only on models with last_frame support); role 'reference' (or no role) feeds a guiding image, audio, or video asset. Pass negativePrompt on models that support it. Returns videoUrl.",
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
      description:
        "Video model id. Leave blank for user default. Use list-models (modelType=video) to browse models and their capabilities.",
    },
    duration: {
      label: "Duration",
      description: "Length of the generated video clip",
      short: "Short (~5s)",
      medium: "Medium (~10s)",
      long: "Long (~15s)",
    },
    aspectRatio: {
      label: "Aspect Ratio",
      description: "Output video aspect ratio",
    },
    resolution: {
      label: "Resolution",
      description: "Output video resolution",
    },
    frameReferences: {
      label: "Frame References",
      description:
        "Reference assets that steer the video. Each entry is { url, role }. role 'first' pins the exact opening frame and role 'last' pins the exact closing frame (needs last_frame support) — bookend frames are IMAGES ONLY, so both MUST be image URLs. role 'reference' (or no role) is a guiding asset that can be an image, audio, or video URL; its kind is auto-detected from the URL (.mp4/.webm/.mov as video, audio files as audio, everything else as image). A first or reference image switches the server to the cheapest image-capable model when needed.",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "Negative Prompt",
      description:
        "What to exclude from the video. Only sent to models that accept negative_prompt or negativePrompt — ignored otherwise.",
      placeholder: "blurry, low quality, distorted...",
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
      providerUnsupported: "{{label}} is not supported yet",
      insufficientCredits:
        "Insufficient credits. Balance: {{balance}}, required: {{minimum}}",
      balanceCheckFailed: "Failed to check your credit balance",
      unsupportedDuration:
        "Model {{model}} does not support duration {{duration}}. Supported durations: {{supported}}",
      unsupportedAspectRatio:
        "Model {{model}} does not support aspect ratio {{aspectRatio}}. Supported ratios: {{supported}}",
      unsupportedResolution:
        "Model {{model}} does not support resolution {{resolution}}. Supported resolutions: {{supported}}",
      generationFailed: "Video generation failed: {{error}}",
      providerError: "Video provider error: {{error}}",
      noVideoUrl: "No video URL returned from provider",
      generationFailedUnknown:
        "Video generation failed and the provider gave no reason",
      providerErrorUnknown: "Video provider failed without an error message",
      nonJsonResponse:
        "Video provider returned a non-JSON response (HTTP {{status}}): {{body}}",
      providerHttpError: "Video provider returned HTTP {{status}}: {{body}}",
      jobFailedStatus: "Video job ended with status: {{status}}",
      requestAborted: "Video generation was aborted",
      requestTimedOut: "Timed out waiting for video generation",
      creditsFailed: "Failed to deduct credits for video generation",
      inputMediaRequired:
        "This model requires an input image URL. Paste an image link to animate it.",
      imageInputUnsupported:
        "The video model {{model}} rejected the input image - it likely does not support image-to-video. Retry generate_video WITHOUT the model parameter (the default model animates images), or drop the image.",
    },
    success: {
      title: "Video Generated",
      description: "Your video has been generated successfully",
    },
  },
};
