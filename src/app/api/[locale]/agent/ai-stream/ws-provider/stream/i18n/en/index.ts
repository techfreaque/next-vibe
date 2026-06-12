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
