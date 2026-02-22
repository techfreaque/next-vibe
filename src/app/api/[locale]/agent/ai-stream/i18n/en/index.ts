export const translations = {
  run: {
    post: {
      title: "Run AI Agent",
      description:
        "Execute pre-calls to gather data, then run a headless AI prompt and return the assistant's response. Ideal for automating tasks, summarising results, or chaining tool outputs into an AI answer.",
      container: {
        title: "AI Agent Run",
        description: "Configure pre-calls and prompt for headless AI execution",
      },
      fields: {
        model: {
          label: "Model",
          description: "AI model to use for generating the response",
        },
        character: {
          label: "Character",
          description: "Character persona to use (e.g. 'default')",
          placeholder: "default",
        },
        prompt: {
          label: "Prompt",
          description: "The user prompt to send to the AI",
          placeholder: "Enter your prompt...",
        },
        instructions: {
          label: "Extra Instructions",
          description: "Optional extra system instructions for this run",
          placeholder: "Be concise. One paragraph max.",
        },
        preCalls: {
          label: "Pre-Calls",
          description:
            "Routes to execute before the AI prompt. Results are injected as context.",
          routeId: {
            label: "Route ID",
            description:
              "Endpoint alias or full path (e.g. agent_chat_characters_GET)",
            placeholder: "agent_chat_characters_GET",
          },
          args: {
            label: "Arguments",
            description:
              "Merged flat args (urlPathParams + data) for this route",
          },
        },
        activeTools: {
          label: "Active Tools",
          description:
            "Tools the AI is allowed to execute. Leave empty to allow all tools.",
          toolId: {
            label: "Tool ID",
            description: "Tool identifier",
          },
          requiresConfirmation: {
            label: "Requires Confirmation",
            description:
              "Whether this tool requires user confirmation before execution",
          },
        },
        tools: {
          label: "Visible Tools",
          description: "Tools loaded into the AI context window",
          toolId: {
            label: "Tool ID",
            description: "Tool identifier",
          },
          requiresConfirmation: {
            label: "Requires Confirmation",
            description:
              "Whether this tool requires user confirmation before execution",
          },
        },
        maxTurns: {
          label: "Max Turns",
          description: "Maximum number of tool-calling turns before stopping",
        },
        appendThreadId: {
          label: "Thread ID (append)",
          description:
            "Continue an existing thread by ID. Omit to start a new one.",
          placeholder: "uuid",
        },
        rootFolderId: {
          label: "Root Folder",
          description:
            "Where to store the thread. Use 'incognito' for no persistence, 'cron' (default) for persisted.",
          placeholder: "cron",
        },
        subFolderId: {
          label: "Sub Folder ID",
          description: "Optional sub-folder UUID within the root folder",
          placeholder: "uuid",
        },
      },
      response: {
        text: "Assistant response text (think-tags stripped)",
        promptTokens: "Number of prompt tokens used",
        completionTokens: "Number of completion tokens generated",
        threadId:
          "Thread ID where the conversation was stored (null if incognito)",
        lastAiMessageId: "ID of the final assistant message",
        threadTitle: "Auto-generated thread title",
        threadCreatedAt: "Thread creation timestamp (ISO 8601)",
        preCallResults: "Results from pre-call route executions",
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
      invalidRequestData: "Invalid request data",
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
    description: "Stream AI-powered chat responses using OpenAI GPT-4o",
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
      description: "Thread ID (null to create new thread)",
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
    activeTool: {
      label: "Active Tools",
      description:
        "Tools the model is allowed to execute. Null means all tools are allowed.",
      toolId: {
        label: "Tool ID",
        description: "Unique identifier for the AI tool",
      },
    },
    tools: {
      label: "Visible Tools",
      description:
        "Tools loaded into the AI context window. The model can see and directly call these.",
      toolId: {
        label: "Tool ID",
        description: "Unique identifier for the AI tool",
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
        description: "Select voice type for text-to-speech",
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
  errorTypes: {
    streamError: "Stream Error",
  },
  errorThread: {
    title: "Error",
  },
  error: {
    title: "Stream Error",
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
      /**
       * Thrown when runHeadlessAiStream() is called without a resolvable model+character.
       * Either pass model+character directly, or pass favoriteId pointing to a favorite
       * that has a MANUAL or FILTERS modelSelection (not CHARACTER_BASED with no character).
       */
      missingModelOrCharacter:
        "model and character are required — pass them directly or provide a favoriteId with a resolvable model selection",
      favoriteNotFound: "Favorite not found or does not belong to this user",
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
