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
      "Generate a video from a text prompt. Use the models tool (modelType=video) to see all video models with their capabilities: supportedDurations (valid clip lengths in seconds), supportedAspectRatios, supportedFrameImages (first_frame/last_frame = image-to-video support). Pass frameReferences to steer the video: role 'first' pins the opening frame and role 'last' pins the closing frame — both MUST be image URLs (only on models with last_frame support); role 'reference' (or no role) feeds a guiding image, audio, or video asset. Pass negativePrompt on models that support it. Returns videoUrl.",
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
        "Video model id. Leave blank for user default. Use the models tool (modelType=video) to browse models and their capabilities.",
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
      referenceNotImage:
        "The link on {{host}} opens a web page, not an image file. Use a direct image link (right-click the picture, copy image address) or upload the image.",
      referenceUnreachable:
        "The image link on {{host}} does not load (HTTP {{status}}). Check the link or upload the image instead. You were not charged.",
      modelDiscontinued:
        "{{model}} was retired by its provider and no longer generates. Pick another video model. You were not charged.",
      referenceStagingFailed:
        "The video provider could not receive the input image. Try again or pick another video model. You were not charged.",
      referenceUnavailable:
        "The input image is not available. It was deleted, or it belongs to a chat you cannot open. Use an image from this chat or upload it again.",
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
      modelUnavailable:
        "This model is temporarily unavailable. Pick another model.",
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
      contentRejected:
        "Refused by the video provider's content filter: {{error}}. This is a refusal, not an outage. Rephrase the prompt or pick a less filtered model. You were not charged.",
      providerOutage:
        "The video provider is down or overloaded right now: {{error}}. This is an outage, not a refusal. Try again in a minute or pick another model. You were not charged.",
      consentRequired:
        "The video provider wants a consent confirmation for real faces in the input: {{error}}. Use an image without a real person's face, or pick another video model. You were not charged.",
      storageFailed:
        "The video was generated but could not be saved. You were not charged. Try again.",
      creditsFailed: "Failed to deduct credits for video generation",
      imageRequiredForModel:
        "{{model}} animates an image. Add a start image, then generate again.",
      inputMediaRequired:
        "This model requires an input image URL. Paste an image link to animate it.",
      imageInputUnsupported:
        "The video model {{model}} rejected the input image - it likely does not support image-to-video. Retry generate_video WITHOUT the model parameter (the default model animates images), or drop the image.",
      noImageCapableModel:
        "No video model here takes a reference image. Drop the image to generate from the prompt alone.",
    },
    success: {
      title: "Video Generated",
      description: "Your video has been generated successfully",
    },
  },
};
