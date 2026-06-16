export const translations = {
  endpointCategories: {
    ai: "AI",
  },
  tags: {
    ai: "AI",
    streaming: "Streaming",
  },
  post: {
    title: "WS Provider Stream",
    titleShort: "WS Stream",
    description:
      "Start an AI stream for a remote WS Provider client. The client sends a message, model, and optional tool definitions. AI events are streamed via the standard WebSocket channel. Client-provided tools pause the stream until the client sends back tool results.",
    fields: {
      content: {
        label: "Message",
        description: "The user message to send to the AI model",
        placeholder: "Enter your message...",
      },
      model: {
        label: "Model",
        description: "AI model to use for generation",
      },
      threadId: {
        label: "Thread ID",
        description:
          "UUID of an existing thread to continue. Omit to start a new thread.",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      rootFolderId: {
        label: "Root Folder",
        description:
          "Folder to create the thread in. Defaults to 'private'. Use 'support' for support sessions.",
      },
      skill: {
        label: "Skill",
        description:
          "Skill ID or 'default'. Defines the AI persona and system prompt.",
      },
      systemPrompt: {
        label: "System Prompt",
        description:
          "Optional system instructions from the remote client, appended to the skill system prompt.",
        placeholder: "Enter system instructions...",
      },
      instanceId: {
        label: "Instance ID",
        description:
          "Remote instance identifier. Used as sub-folder for thread organisation.",
      },
      threadMirrorMode: {
        label: "Thread Mirror Mode",
        description:
          "Where the thread is stored: both sides, caller only, provider only, or nowhere. 'both'/'cloud' make this instance persist the thread under REMOTE/<caller instance>.",
      },
      userMessageId: {
        label: "User Message ID",
        description:
          "The caller-assigned id for the user message. Persisted as-is so the thread sync round-trip stays idempotent.",
      },
      parentMessageId: {
        label: "Parent Message ID",
        description:
          "The caller's prior-leaf message id. The new user message chains off it so the synced thread is one linked list.",
      },
      tools: {
        title: "Client Tools",
        description:
          "Tool definitions provided by the remote client. When the AI calls one, execution pauses until the client sends the result.",
        name: {
          label: "Tool Name",
          description: "Unique name for this tool",
        },
        toolDescription: {
          label: "Tool Description",
          description: "Description of what the tool does (shown to the AI)",
        },
        parameters: {
          label: "Parameters Schema",
          description:
            "JSON Schema object describing the tool's input parameters",
        },
      },
      timezone: {
        label: "Timezone",
        description: "Client timezone for cache-stable timestamps",
      },
      toolConfirmations: {
        title: "Tool Confirmations",
        description:
          "Approve or deny tool calls that paused waiting for confirmation. The stream resumes with the confirmed tool result.",
        messageId: {
          label: "Message ID",
          description: "ID of the tool message awaiting confirmation",
        },
        confirmed: {
          label: "Confirmed",
          description: "True to approve and execute, false to deny",
        },
        updatedArgs: {
          label: "Updated Arguments",
          description: "Optional edited tool arguments to use on execution",
        },
      },
      confirmationOverrides: {
        title: "Confirmation Overrides",
        description:
          "Per-tool confirmation gates from the caller's favorite/skill, applied to this loop's execute-tool gate.",
        toolId: {
          label: "Tool ID",
          description: "The tool the confirmation gate applies to",
        },
        requiresConfirmation: {
          label: "Requires Confirmation",
          description: "True if the tool must pause for user confirmation",
        },
      },
      attachments: {
        title: "Attachments",
        description:
          "Files attached to the user message, base64-encoded for transport.",
        filename: {
          label: "Filename",
          description: "Original file name",
        },
        mimeType: {
          label: "MIME Type",
          description: "File content type",
        },
        data: {
          label: "Data",
          description: "Base64-encoded file content",
        },
      },
      messageHistory: {
        label: "Message History",
        description:
          "Conversation context from the calling instance. The provider holds no thread state, so the caller supplies prior messages on every turn.",
      },
    },
    response: {
      responseThreadId: "Thread ID of the conversation",
      messageId: "Message ID of the AI assistant message",
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
        description: "Resource not found",
      },
      internal: {
        title: "Server Error",
        description: "Internal server error during stream",
      },
      network: {
        title: "Network Error",
        description: "Network error during stream",
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
      title: "Stream Started",
      description: "The AI stream was started successfully",
    },
  },
};
