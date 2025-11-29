export const translations = {
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
      streamCreationFailed: "Failed to create stream",
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
    persona: {
      label: "Persona",
      description: "Optional persona to use for the AI",
    },
    temperature: {
      label: "Temperature",
      description: "Controls randomness (0-2)",
    },
    maxTokens: {
      label: "Max Tokens",
      description: "Maximum tokens to generate",
    },
    systemPrompt: {
      label: "System Prompt",
      description: "Optional system instructions",
      placeholder: "Enter system prompt...",
    },
    enableSearch: {
      label: "Enable Web Search",
      description: "Allow AI to search the web for current information",
    },
    tools: {
      label: "AI Tools",
      description: "List of AI tool IDs to enable for this conversation",
    },
    enabledToolIds: {
      label: "Enabled Tool IDs",
      description: "List of AI tool IDs to enable for this conversation",
    },
    toolConfirmation: {
      label: "Tool Confirmation",
      description: "Tool confirmation response from user",
      success: "Tool confirmation processed successfully",
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
  providers: {
    uncensoredHandler: {
      errors: {
        apiError: "Uncensored.ai API error ({{status}}): {{errorText}}",
      },
    },
  },
};
