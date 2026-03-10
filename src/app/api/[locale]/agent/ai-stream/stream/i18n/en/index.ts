export const translations = {
  category: "Agent",
  tags: {
    streaming: "Streaming",
    chat: "Chat",
    ai: "AI",
  },

  run: {
    task: {
      name: "AI Heartbeat",
      description:
        "Background AI agent that checks system health, works through tasks, and contacts the human when needed",
    },
    post: {
      title: "Run AI Agent",
      dynamicTitle: "AI Run{{suffix}}: {{prompt}}",
      description:
        "Run a headless AI agent and get back the full text response. Pass favoriteId to load character + model + tools in one shot (recommended), or set model + character + allowedTools explicitly. For tool access, add allowedTools: [{toolId:'execute-tool'},{toolId:'tool-help'}]. Use tool-help to discover available tools. Credits consumed based on model.",
      container: {
        title: "AI Agent Run",
        description: "Configure pre-calls and prompt for headless AI execution",
      },
      fields: {
        favoriteId: {
          label: "Favorite ID",
          description:
            "UUID of a saved favorite to load character, model, and tool configuration from. When set, the favorite's character, model (from modelSelection), and tool config (activeTools/visibleTools) are used as defaults. Explicit character, model, tools, or allowedTools fields in this request override the favorite's values. Use agent_chat_favorites_GET to list available favorites.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        model: {
          label: "Model",
          description:
            "AI model to use. Optional when favoriteId or character is provided (resolved from their modelSelection). Fast & cheap: claude-haiku-4.5, gemini-2.5-flash. Balanced: claude-sonnet-4.6, gpt-5. Powerful: claude-opus-4.6, gpt-5-pro. Free: qwen3_235b-free, gpt-oss-120b-free. Overrides the model from favoriteId or character when set.",
        },
        character: {
          label: "Character",
          description:
            "Character ID (UUID) or 'default'. Optional when favoriteId is provided (resolved from the favorite). Characters define the AI persona, system prompt, and default model. Overrides the character from favoriteId when set. Use agent_chat_characters_GET to list available characters.",
          placeholder: "default",
        },
        prompt: {
          label: "Prompt",
          description:
            "The main instruction or question for the AI. Be specific — the AI will use preCalls results as context if provided.",
          placeholder: "Enter your prompt...",
        },
        instructions: {
          label: "Extra System Instructions",
          description:
            "Optional extra instructions appended to the system prompt. Use to constrain format, tone, or output length (e.g. 'Be concise. JSON only.').",
          placeholder: "Be concise. One paragraph max.",
        },
        preCalls: {
          label: "Pre-Calls",
          description:
            "Tool calls to execute before the prompt. Results are injected as context. Use tool-help to discover available tools and their args.",
          routeId: {
            label: "Tool ID",
            description:
              "Alias or full tool name to call (e.g. 'web-search', 'agent_chat_characters_GET'). Use tool-help to discover tools.",
            placeholder: "web-search",
          },
          args: {
            label: "Arguments",
            description:
              'Flat key-value args for the tool — merge urlPathParams and body fields into one object (e.g. {"query": "latest news", "maxResults": 5}).',
          },
        },
        allowedTools: {
          label: "Allowed to Execute",
          description:
            "Execution permission gate — controls which tools the AI is actually allowed to run. null = all tools permitted. Array = restrict to listed tools only (any other call is blocked with 'disabled by user'). Standard agentic setup: [{toolId:'execute-tool'},{toolId:'tool-help'}] — execute-tool dispatches any registered endpoint, tool-help lets the agent discover available tools. No need to repeat tools already listed in the tools field.",
          toolId: {
            label: "Tool ID",
            description:
              "Alias or full tool name the AI is permitted to execute (e.g. 'execute-tool', 'tool-help', 'web-search')",
          },
          requiresConfirmation: {
            label: "Requires Confirmation",
            description:
              "If true, execution pauses and waits for user confirmation before running this tool. Use for destructive or expensive actions.",
          },
        },
        tools: {
          label: "In Context (model sees these)",
          description:
            "Tools loaded into the model's context window — what the AI knows about and can reason over. null = use the user's default tool set (recommended). Provide an array only if you need a focused, minimal context. Note: allowedTools controls what can actually execute — this field only affects what the model sees.",
          toolId: {
            label: "Tool ID",
            description:
              "Alias or full tool name to load into the model's context (e.g. 'execute-tool', 'tool-help')",
          },
          requiresConfirmation: {
            label: "Requires Confirmation",
            description:
              "Whether this tool requires user confirmation before execution",
          },
        },
        maxTurns: {
          label: "Max Turns",
          description:
            "Maximum agentic turns (tool-call cycles) before stopping. Default: unlimited. Set to 1 for a single prompt+response with no tool calls.",
        },
        appendThreadId: {
          label: "Thread ID (continue)",
          description:
            "UUID of an existing thread to continue. The new message is appended to that conversation. Omit to start a fresh thread.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        rootFolderId: {
          label: "Storage Folder",
          description:
            "Where to persist the thread. 'cron' (default) = persisted agent runs. 'incognito' = no storage, no history. 'private' = user's private folder. 'shared' = team-accessible.",
          placeholder: "cron",
          options: {
            cron: "Cron (agent runs)",
            private: "Private",
            shared: "Shared",
            incognito: "Incognito (no storage)",
          },
        },
        subFolderId: {
          label: "Sub-folder ID",
          description:
            "Optional UUID of a sub-folder within the root folder for organising runs.",
          placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        },
        excludeMemories: {
          label: "Exclude Memories",
          description:
            "When true, the AI will not see the user's stored memories in its context. Use this for public bots and isolated tasks that should not inherit personal context. Default: false (memories included).",
        },
      },
      response: {
        text: "The AI's response text (think-tags stripped). Null if the model produced no output.",
        promptTokens: "Prompt tokens consumed (input cost)",
        completionTokens: "Completion tokens generated (output cost)",
        threadId:
          "Thread UUID where the run was stored. Null if rootFolderId was 'incognito'. Use this to continue the conversation via appendThreadId.",
        lastAiMessageId:
          "UUID of the final assistant message. Useful for branching or referencing the response.",
        threadTitle: "Auto-generated title for this thread",
        threadCreatedAt: "Thread creation timestamp (ISO 8601)",
        preCallResults: {
          title: "Pre-call Results",
          routeId: "Tool that was called",
          succeeded: "Whether the call succeeded",
          errorMessage: "Error message if the call failed",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid parameters provided",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Route or resource not found",
        },
        internal: {
          title: "Server Error",
          description: "Internal server error during AI run",
        },
        network: {
          title: "Network Error",
          description: "Network error during AI run",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes conflict",
        },
        conflict: {
          title: "Conflict",
          description: "Data conflict occurred",
        },
      },
      success: {
        title: "AI Run Complete",
        description: "The AI agent completed successfully",
      },
    },
  },
  route: {
    debug: {
      userObject: "AI Stream Route: User object",
      extracted: "AI Stream Route: Extracted values",
    },
    errors: {
      invalidJson: "Invalid JSON in request body",
      invalidRequestData: "Invalid request data ({{issue}})",
      uncensoredApiKeyMissing: "Uncensored.ai API key not configured",
      openrouterApiKeyMissing: "OpenRouter API key not configured",
      streamCreationFailed:
        "Failed to connect to the AI service. Please try again.",
      unknownError: "An error occurred",
      creditValidationFailed: "Failed to validate credit balance",
      noIdentifier: "No user or lead identifier provided",
      insufficientCredits: "Insufficient credits to complete this request",
      noResponseBody: "No response body received from stream",
      authenticationRequired:
        "Please log in to use persistent folders. Use incognito mode for anonymous chats.",
    },
  },
  post: {
    title: "AI Stream Chat",
    description:
      "Stream AI-powered chat responses using 40+ models (Claude, GPT, Gemini, Llama, and more). Supports text, voice, file attachments, and agentic tool use.",
    form: {
      title: "AI Chat Configuration",
      description: "Configure AI chat parameters and messages",
    },
    operation: {
      label: "Operation",
      description: "Type of message operation to perform",
      options: {
        send: "Send Message",
        retry: "Retry Message",
        edit: "Edit Message",
        answerAsAi: "Answer as AI",
      },
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder context for the message",
    },
    subFolderId: {
      label: "Subfolder",
      description: "Optional subfolder within the root folder",
    },
    threadId: {
      label: "Thread ID",
      description:
        "UUID of the thread to send this message to. Must be a valid UUID — create a thread first if you don't have one.",
    },
    userMessageId: {
      label: "User Message ID",
      description: "Client-generated user message ID",
    },
    parentMessageId: {
      label: "Parent Message ID",
      description: "Parent message ID for branching/threading",
    },
    messageHistory: {
      label: "Message History",
      description: "Optional message history for incognito mode",
      item: {
        title: "Message",
        description: "Chat message in history",
        role: {
          label: "Role",
        },
        content: {
          label: "Content",
        },
        metadata: {
          toolCall: {
            toolName: {
              label: "Tool Name",
            },
            args: {
              label: "Tool Arguments",
            },
            result: {
              label: "Tool Result",
            },
            error: {
              label: "Tool Error",
            },
            executionTime: {
              label: "Execution Time (ms)",
            },
            creditsUsed: {
              label: "Credits Used",
            },
          },
        },
      },
    },
    content: {
      label: "Message Content",
      description: "Content of the message to send",
      placeholder: "Enter your message...",
    },
    role: {
      label: "Role",
      description: "Role of the message sender",
      options: {
        user: "User",
        assistant: "Assistant",
        system: "System",
      },
    },
    model: {
      label: "Model",
      description: "AI model to use for generation",
    },
    character: {
      label: "Character",
      description: "Optional character to use for the AI",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "Optional system instructions",
      placeholder: "Enter system prompt...",
      now: "now",
      minutesAgo: "{{minutes}}m ago",
      hoursAgo: "{{hours}}h ago",
      daysAgo: "{{days}}d ago",
    },
    enableSearch: {
      label: "Enable Web Search",
      description: "Allow AI to search the web for current information",
    },
    timezone: {
      label: "Timezone",
      description: "User timezone for cache-stable timestamps",
    },
    activeTool: {
      label: "Allowed to Execute",
      description:
        "Execution permission gate — which tools the AI is actually allowed to run. null = all tools permitted. Array = restrict to listed tools only.",
      toolId: {
        label: "Tool ID",
        description: "Alias or full tool name the AI is permitted to execute",
      },
    },
    tools: {
      label: "In Context (model sees these)",
      description:
        "Tools loaded into the model's context window — what the AI knows about. null = user's default set. allowedTools controls what can actually execute.",
      toolId: {
        label: "Tool ID",
        description: "Alias or full tool name to load into the model's context",
      },
      requiresConfirmation: {
        label: "Requires Confirmation",
        description:
          "Whether this tool requires user confirmation before execution",
      },
    },
    enabledToolIds: {
      label: "Enabled Tool IDs",
      description: "List of AI tool IDs to enable for this conversation",
    },
    toolConfirmation: {
      label: "Tool Confirmation",
      description: "Tool confirmation response from user",
      success: "Tool confirmation processed successfully",
      messageId: {
        label: "Message ID",
        description: "ID of the message containing the tool call",
      },
      confirmed: {
        label: "Confirmed",
        description: "Whether the user confirmed the tool execution",
      },
      updatedArgs: {
        label: "Updated Arguments",
        description: "Optional updated arguments for the tool call",
      },
      errors: {
        messageNotFound: "Tool message not found",
        toolCallMissing: "ToolCall metadata missing",
        toolNotFound: "Tool not found",
      },
    },
    resumeToken: {
      label: "Resume Token",
      description: "Token for resuming interrupted streams",
    },
    voiceMode: {
      label: "Voice Mode",
      description: "Configuration for voice-based interaction",
      enabled: {
        label: "Enable Voice Mode",
        description: "Enable voice-based interaction with text-to-speech",
      },
      voice: {
        label: "Voice",
        description:
          'Select voice type for text-to-speech. Pass "voices.MALE" for a male voice or "voices.FEMALE" (default) for a female voice.',
        male: "Male Voice",
        female: "Female Voice",
      },
    },
    audioInput: {
      title: "Audio Input",
      description: "Upload audio file for voice-to-voice mode",
      file: {
        label: "Audio File",
        description: "Audio file to transcribe and process",
      },
    },
    attachments: {
      label: "File Attachments",
      description: "Files attached to the message (images, documents, etc.)",
    },
    response: {
      title: "Stream Response",
      description: "AI-generated streaming response",
      success: "Stream completed successfully",
      messageId: "Message ID",
      threadId: "Thread ID",
      totalTokens: "Total tokens used",
      finishReason: "Completion reason",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required for AI streaming",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters provided",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred while streaming",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to AI streaming is forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "AI streaming endpoint not found",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that need to be saved first",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred during streaming",
      },
    },
    success: {
      title: "Success",
      description: "AI stream generated successfully",
    },
  },
  enums: {
    role: {
      user: "User",
      assistant: "Assistant",
      system: "System",
    },
  },
  streamingErrors: {
    aiStream: {
      error: {
        apiKey: {
          missing: "OpenAI API key is missing",
          invalid: "OpenAI API key is invalid",
        },
        configuration: "AI streaming configuration error",
        processing: "Error processing AI stream",
      },
    },
  },
  debugView: {
    systemPromptTitle: "System Prompt",
    copied: "Copied!",
  },
  errorTypes: {
    streamError: "Stream Error",
  },
  errorThread: {
    title: "Error",
  },
  error: {
    title: "Stream Error",
  },
  wakeUp: {
    revivalPrompt:
      "The async task you dispatched has completed. The result is in the tool message above. Please summarise what the task returned for me.",
    revivalInstructions:
      "WAKE-UP REVIVAL MODE: An async task has completed and the result is in the thread. Respond to the user's last message by summarising the tool result — 1-3 sentences only. Do NOT call any tools. Do NOT re-execute the original user request.",
  },
  info: {
    streamInterrupted:
      "Generation was stopped. Partial response has been saved.",
  },
  errors: {
    toolExecutionError: "A tool failed to execute properly. Please try again.",
    toolExecutionFailed: "Tool execution failed. Please try again.",
    toolDisabledByUser:
      "This tool has been disabled by the user. Do not attempt to call it again.",
    userDeclinedTool: "Tool execution was cancelled.",
    streamError: "The AI response failed to complete. Please try again.",
    streamProcessingError:
      "Failed to process the AI response. Please try again.",
    timeout:
      "The AI took too long to respond (timeout after {{maxDuration}} seconds). Please try again with a shorter message.",
    noResponse: "The AI did not generate a response. Please try again.",
    modelUnavailable:
      "The selected AI model is currently unavailable. Please try a different model.",
    rateLimitExceeded: "Too many requests. Please wait a moment and try again.",
    insufficientCredits: "Not enough credits to complete this request.",
    connectionFailed:
      "Failed to connect to the AI service. Please check your connection and try again.",
    invalidRequest: "Invalid request. Please check your input and try again.",
    compactingStreamError:
      "Error during history compacting: {{error}}. Your conversation was not compacted.",
    compactingException:
      "Failed to compact conversation history: {{error}}. Please try again.",
    compactingRebuildFailed:
      "Failed to rebuild conversation after compacting. Please try again.",
    unexpectedError:
      "An unexpected error occurred: {{error}}. Please try again.",
  },
  headless: {
    errors: {
      // Thrown when runHeadlessAiStream() is called without a resolvable model+character.
      // Either pass model+character directly, or pass favoriteId pointing to a favorite
      // that has a MANUAL or FILTERS modelSelection (not CHARACTER_BASED with no character).
      missingModelOrCharacter:
        "model and character are required — pass them directly or provide a favoriteId with a resolvable model selection",
      favoriteNotFound: "Favorite not found or does not belong to this user",
    },
  },
  resumeStream: {
    post: {
      title: "Resume AI Stream",
      description:
        "Continue an existing thread by running a headless AI turn. Used after an async remote task completes (callbackMode=wait or wakeUp). Pass favoriteId to load model+character in one shot, or set modelId+characterId explicitly.",
      fields: {
        threadId: {
          title: "Thread ID",
          description: "UUID of the existing thread to continue.",
        },
        favoriteId: {
          title: "Favorite ID",
          description:
            "UUID of a saved favorite to load model and character from. Overrides modelId/characterId when both are set.",
        },
        modelId: {
          title: "Model ID",
          description:
            "AI model to use for the resumed turn. Optional when favoriteId is provided.",
        },
        characterId: {
          title: "Character ID",
          description:
            "Character/persona for the resumed turn. Optional when favoriteId is provided.",
        },
        wakeUpToolMessageId: {
          title: "WakeUp Tool Message ID",
          description:
            "ID of the original wakeUp tool call message. When provided, a deferred result message is injected into the thread before the headless append.",
        },
        resumed: {
          title: "Resumed",
          description: "Whether the thread was successfully continued.",
        },
        lastAiMessageId: {
          title: "Last AI Message ID",
          description:
            "UUID of the final assistant message generated. Null if no message was produced.",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid parameters — threadId must be a valid UUID",
        },
        unauthorized: {
          title: "Unauthorized",
          description: "Authentication required",
        },
        forbidden: {
          title: "Forbidden",
          description: "Access denied",
        },
        notFound: {
          title: "Not Found",
          description: "Thread or model not found",
        },
        internal: {
          title: "Server Error",
          description: "Internal error during stream resume",
        },
        network: {
          title: "Network Error",
          description: "Network error occurred",
        },
        unknown: {
          title: "Unknown Error",
          description: "An unexpected error occurred",
        },
        unsaved: {
          title: "Unsaved Changes",
          description: "Unsaved changes conflict",
        },
        conflict: {
          title: "Conflict",
          description: "Conflict occurred",
        },
      },
      success: {
        title: "Stream Resumed",
        description: "The AI thread was successfully continued",
      },
    },
  },
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API error ({{status}}): {{errorText}}",
      },
    },
  },
};
