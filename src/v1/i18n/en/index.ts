export const translations = {
  category: "AI",

  tags: {
    api: "OpenAI-compatible API",
  },

  openai: {
    missingKey:
      "Missing API key. Send it as 'Authorization: Bearer <key>' or 'x-api-key: <key>'. Create a key under Settings > API keys.",
    invalidKey:
      "Invalid or revoked API key. Check the key or create a new one under Settings > API keys.",
    authUnavailable:
      "Could not verify your API key right now. Your key was not rejected. Retry in {{seconds}}s.",
    modelNotFound:
      "The model '{{model}}' does not exist or is not available to you. List your models with GET /v1/models.",
    paidRequired:
      "The API is available on paid plans. Subscribe or buy credits to call /v1: see Settings > API keys.",
    toolsUnsupportedByModel:
      "This model does not support tool calling. Pick a model with tool support or remove 'tools'.",
    badToolArguments:
      "The arguments of tool call '{{name}}' are not valid JSON.",
    toolChoiceUnknown: "tool_choice names '{{name}}', which is not in 'tools'.",
    toolMessageNeedsId: "Tool message {{param}} needs a tool_call_id.",
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
          description:
            "OpenAI function tools the model may call: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Tool choice",
          description:
            "none, auto, required, or {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Parallel tool calls",
          description: "Accepted for compatibility; the model decides",
        },
      },
      response: { object: "Object type" },
      success: {
        title: "Completion created",
        description: "The model answered",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id is not supported: responses are not stored. Send the full conversation in 'input' with store: false (Codex CLI does this by default).",
    badInputItem:
      "{{param}} is not usable: images must be http(s) or base64 data: URLs and tool items need a call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 responses",
      description:
        "Call any model with the OpenAI Responses format, the one Codex CLI speaks. Stateless: send the full conversation in input. Supports streaming, function, custom and local_shell tools, and reasoning items.",
      fields: {
        model: { label: "Model", description: "Model ID from GET /v1/models" },
        input: {
          label: "Input",
          description:
            "A string, or the conversation as Responses items (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instructions",
          description: "System instructions for the model",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as Responses server-sent events",
        },
        tools: {
          label: "Tools",
          description:
            "function, custom and local_shell tools. Hosted tools (web_search, ...) are skipped.",
        },
        toolChoice: {
          label: "Tool choice",
          description: "none, auto, required, or {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Parallel tool calls",
          description: "Accepted for compatibility; the model decides",
        },
        maxOutputTokens: {
          label: "Max output tokens",
          description: "Upper bound on generated tokens",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature, 0 to 2",
        },
        topP: { label: "Top P", description: "Nucleus sampling, 0 to 1" },
        reasoning: {
          label: "Reasoning",
          description:
            "Accepted for compatibility. Reasoning models return reasoning items either way.",
        },
        text: {
          label: "Text format",
          description:
            "{format:{type:'json_schema', schema}} asks for JSON output",
        },
        store: {
          label: "Store",
          description: "Responses are never stored; send false",
        },
        previousResponseId: {
          label: "Previous response ID",
          description: "Not supported: send the full conversation instead",
        },
        include: {
          label: "Include",
          description:
            "Accepted for compatibility. Reasoning items always carry encrypted_content for replay.",
        },
      },
      response: { object: "Object type" },
      success: {
        title: "Response created",
        description: "The model answered",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} has a content block we cannot use: images must be base64 or http(s) URLs.",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 messages",
      description:
        "Call any model with the Anthropic Messages format, the one Claude Code speaks. Key as x-api-key or Authorization: Bearer. Supports streaming, tools and thinking blocks.",
      fields: {
        model: {
          label: "Model",
          description:
            "Model ID from GET /v1/models. Claude ids like claude-sonnet-4-5-20250929 map to our matching Claude model.",
        },
        messages: {
          label: "Messages",
          description:
            "Anthropic messages: user and assistant turns with text, image, tool_use, tool_result and thinking blocks",
        },
        system: {
          label: "System",
          description: "System prompt: a string or text blocks",
        },
        maxTokens: {
          label: "Max tokens",
          description: "Upper bound on generated tokens",
        },
        stream: {
          label: "Stream",
          description: "Send the answer as Anthropic server-sent events",
        },
        tools: {
          label: "Tools",
          description:
            "Client tools: [{name, description, input_schema}]. Server tools (web_search, ...) are skipped.",
        },
        toolChoice: {
          label: "Tool choice",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Stop sequences",
          description: "Strings that end the answer",
        },
        temperature: {
          label: "Temperature",
          description: "Sampling temperature",
        },
        topP: { label: "Top P", description: "Nucleus sampling, 0 to 1" },
        thinking: {
          label: "Thinking",
          description:
            "Accepted for compatibility. Reasoning models return thinking blocks either way.",
        },
      },
      response: { type: "Object type" },
      success: { title: "Message created", description: "The model answered" },
    },
  },

  countTokens: {
    post: {
      title: "Anthropic token count",
      titleShort: "v1 count tokens",
      description:
        "Estimate the input tokens of an Anthropic Messages request. Free: no model call, no credits.",
      fields: {
        action: { label: "Action", description: "Always count_tokens" },
        model: { label: "Model", description: "Model ID" },
        messages: { label: "Messages", description: "Anthropic messages" },
        system: { label: "System", description: "System prompt" },
        tools: { label: "Tools", description: "Tool definitions" },
      },
      response: { inputTokens: "Input tokens" },
      success: {
        title: "Tokens counted",
        description: "Estimated input tokens",
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
