export const translations = {
  category: "AI",

  tags: {
    api: "OpenAI-compatible API",
  },

  openai: {
    missingKey:
      "Missing API key. Send it as 'Authorization: Bearer <key>'. Create a key under Settings > API keys.",
    invalidKey:
      "Invalid or revoked API key. Check the key or create a new one under Settings > API keys.",
    modelNotFound:
      "The model '{{model}}' does not exist or is not available to you. List your models with GET /v1/models.",
    toolsUnsupported:
      "Tool and function calling is not supported on this API yet.",
    nUnsupported: "Only n=1 is supported.",
    badImageUrl: "image_url must be an http(s) URL or a base64 data: URL.",
    insufficientCredits:
      "Insufficient credits. This call needs about {{cost}}, you have {{balance}}. Top up to continue.",
    rateLimited:
      "Rate limit reached: {{limit}} requests per minute for this key. Retry in {{seconds}}s.",
    upstreamFailed: "The model provider failed: {{error}}",
    balanceCheckFailed:
      "Could not verify your credit balance. Nothing was run. Try again.",
  },

  models: {
    get: {
      title: "OpenAI-compatible models",
      titleShort: "v1 models",
      description:
        "List the models your API key can call. OpenAI list format. Authenticate with Authorization: Bearer <key>.",
      response: { object: "Object type" },
      success: {
        title: "Models listed",
        description: "The models available to this API key",
      },
    },
  },

  completions: {
    post: {
      title: "OpenAI-compatible chat completions",
      titleShort: "v1 chat completions",
      description:
        "Call any model with the OpenAI chat completions format. Billed against your credits at chat prices. Supports stream: true.",
      fields: {
        model: {
          label: "Model",
          description: "Model ID from GET /v1/models",
        },
        messages: {
          label: "Messages",
          description: "OpenAI messages array (system, user, assistant)",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as server-sent events",
        },
        streamOptions: {
          label: "Stream options",
          description: "{ include_usage: true } adds a final usage chunk",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Upper bound on generated tokens",
        },
        maxCompletionTokens: {
          label: "Max completion tokens",
          description: "Same as max_tokens; takes precedence",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature, 0 to 2",
        },
        topP: {
          label: "Top P",
          description: "Nucleus sampling, 0 to 1",
        },
        stop: {
          label: "Stop",
          description: "Stop sequence or list of them",
        },
        n: {
          label: "Choices",
          description: "Only 1 is supported",
        },
        tools: {
          label: "Tools",
          description: "Not supported yet",
        },
      },
      response: { object: "Object type" },
      success: {
        title: "Completion created",
        description: "The model answered",
      },
    },
  },

  errors: {
    validation: { title: "Validation error", description: "Invalid request" },
    unauthorized: {
      title: "Unauthorized",
      description: "A valid API key is required",
    },
    server: {
      title: "Server error",
      description: "Internal server error",
    },
    unknown: {
      title: "Unknown error",
      description: "An unknown error occurred",
    },
    network: { title: "Network error", description: "Network error occurred" },
    forbidden: { title: "Forbidden", description: "Access denied" },
    notFound: { title: "Not found", description: "Model not found" },
    conflict: {
      title: "Conflict",
      description: "Request conflicts with state",
    },
  },
};
