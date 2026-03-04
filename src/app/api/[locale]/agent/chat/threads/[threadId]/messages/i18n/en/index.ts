export const translations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  loadingOlderMessages: "Loading older messages...",
  scrollUpForOlderMessages: "Scroll up for older messages",
  showOlderMessages: "Show older messages",
  transcribing: "Transcribing audio...",
  errorCode: "Error Code",
  compacting: {
    title: "History Compacted",
    loading: "Compacting history...",
    failed: "Compacting failed",
  },
  get: {
    title: "List Thread Messages",
    description: "Retrieve all messages in a chat thread",
    container: {
      title: "Messages",
      description: "Thread message list",
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to retrieve messages from",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    response: {
      title: "Messages Response",
      description: "List of messages in the thread",
      messages: {
        message: {
          title: "Message",
          id: {
            content: "Message ID",
          },
          threadId: {
            content: "Thread ID",
          },
          role: {
            content: "Role",
          },
          content: {
            content: "Content",
          },
          parentId: {
            content: "Parent Message ID",
          },
          depth: {
            content: "Depth",
          },
          authorId: {
            content: "Author ID",
          },
          isAI: {
            content: "Is AI",
          },
          model: {
            content: "Model",
          },
          character: {
            content: "Character",
          },
          tokens: {
            content: "Tokens",
          },
          sequenceId: {
            content: "Sequence ID",
          },

          toolCalls: {
            content: "Tool Calls",
          },
          createdAt: {
            content: "Created At",
          },
          updatedAt: {
            content: "Updated At",
          },
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to view messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to view these messages",
        incognitoNotAllowed:
          "Incognito threads cannot be accessed on the server",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Messages retrieved successfully",
    },
  },
  post: {
    title: "Create Message",
    description: "Create a new message in a chat thread",
    form: {
      title: "New Message",
      description: "Create a message in the thread",
    },
    sections: {
      message: {
        title: "Message Details",
        description: "Message content and settings",
      },
    },
    threadId: {
      label: "Thread ID",
      description: "ID of the thread to add message to",
    },
    rootFolderId: {
      label: "Root Folder",
      description: "Root folder of the thread (used for client routing)",
    },
    id: {
      label: "Message ID",
      description: "Client-generated message ID",
    },
    content: {
      label: "Content",
      description: "Message content",
      placeholder: "Enter message content...",
    },
    role: {
      label: "Role",
      description: "Message role (user, assistant, system)",
    },
    parentId: {
      label: "Parent Message",
      description: "Parent message ID for branching",
    },
    model: {
      label: "Model",
      description: "AI model to use for response",
    },
    character: {
      label: "Character",
      description: "AI character/persona for the message",
    },
    metadata: {
      label: "Metadata",
      description: "Message metadata (attachments, tokens, etc.)",
    },
    response: {
      title: "Created Message",
      description: "Newly created message details",
      message: {
        title: "Message",
        id: {
          content: "Message ID",
        },
        threadId: {
          content: "Thread ID",
        },
        role: {
          content: "Role",
        },
        content: {
          content: "Content",
        },
        parentId: {
          content: "Parent Message ID",
        },
        depth: {
          content: "Depth",
        },
        createdAt: {
          content: "Created At",
        },
        updatedAt: {
          content: "Updated At",
        },
      },
    },
    errors: {
      validation: {
        title: "Validation Error",
        description: "Invalid message data provided",
      },
      network: {
        title: "Network Error",
        description: "Unable to connect to the server",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You must be logged in to create messages",
      },
      forbidden: {
        title: "Forbidden",
        description: "You don't have permission to create messages",
        incognitoNotAllowed:
          "Incognito threads cannot be accessed on the server",
      },
      notFound: {
        title: "Not Found",
        description: "Thread not found",
      },
      server: {
        title: "Server Error",
        description: "An internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "You have unsaved changes",
      },
      conflict: {
        title: "Conflict",
        description: "A conflict occurred",
      },
      createFailed: {
        title: "Failed to create message",
        description: "An error occurred while creating the message",
      },
    },
    success: {
      title: "Success",
      description: "Message created successfully",
    },
  },
  enums: {
    role: {
      user: "User",
      assistant: "Assistant",
    },
  },
  debugView: {
    systemPromptTitle: "System Prompt",
    copied: "Copied!",
    systemMessageHint: "System message (hidden from users)",
  },
  widget: {
    common: {
      send: "Send",
      sending: "Sending...",
      cancel: "Cancel",
      close: "Close",
      copyButton: {
        copied: "Copied!",
        copyToClipboard: "Copy to clipboard",
        copyAsMarkdown: "Copy as Markdown",
        copyAsText: "Copy as plain text",
      },
      viewModeToggle: {
        linearView: "Linear View",
        threadedView: "Threaded View",
        flatView: "Flat View",
        debugView: "Debug View",
      },
      userMessageActions: {
        branch: "Branch",
        retry: "Retry",
        deleteMessage: "Delete message",
      },
      assistantMessageActions: {
        answerAsAI: "Answer as AI",
        cancelLoading: "Cancel loading",
        stopAudio: "Stop audio",
        playAudio: "Play audio ({{cost}} credits)",
        actualCostUsed: "Actual cost used",
        credits: "Credits",
        tokens: "Tokens",
        tokensUsed: "Tokens used",
        deleteMessage: "Delete message",
      },
    },
    messages: {
      assistant: "Assistant",
      anonymous: "Anonymous",
      you: "You",
      edited: "edited",
      branch: {
        previous: "Previous branch",
        next: "Next branch",
      },
      authorWithId: "{{author}} ({{id}})",
    },
    linearView: {
      answerModal: {
        title: "Answer as AI",
        description: "Generate an AI response to this message",
        inputPlaceholder: "Add context for the AI...",
        confirmLabel: "Generate",
      },
      retryModal: {
        title: "Retry with different model",
        description: "Regenerate this response with a different model",
        confirmLabel: "Retry",
      },
    },
    threadedView: {
      actions: {
        reply: "Reply",
        replyToMessage: "Reply to this message",
        edit: "Edit",
        editMessage: "Edit message",
        retry: "Retry",
        retryWithDifferent: "Retry with different model",
        answerAsAI: "Answer as AI",
        generateAIResponse: "Generate AI response",
        respondToAI: "Respond to AI",
        cancelLoading: "Cancel loading",
        stop: "Stop",
        stopAudio: "Stop audio",
        playAudio: "Play audio ({{cost}} credits)",
        delete: "Delete",
        deleteMessage: "Delete message",
        share: "Share",
        copyPermalink: "Copy permalink",
        upvote: "Upvote",
        downvote: "Downvote",
        play: "Play",
        cancel: "Cancel",
        parent: "Go to parent",
      },
      answerModal: {
        title: "Answer as AI",
        description: "Generate an AI response to this message",
        inputPlaceholder: "Add context for the AI...",
        confirmLabel: "Generate",
      },
      retryModal: {
        title: "Retry with different model",
        description: "Regenerate this response with a different model",
        confirmLabel: "Retry",
      },
      anonymous: "Anonymous",
      assistantFallback: "Assistant",
      userFallback: "User",
      youLabel: "You",
      authorWithId: "{{name}} ({{id}})",
      reply: "reply",
      replies: "replies",
      expandReplies: "Expand replies",
      collapseReplies: "Collapse replies",
      continueThread: "Continue thread ({{count}} {{replyText}})",
    },
    flatView: {
      actions: {
        reply: "Reply",
        replyToMessage: "Reply to this message",
        edit: "Edit",
        editMessage: "Edit message",
        retry: "Retry",
        retryWithDifferent: "Retry with different model",
        answerAsAI: "Answer as AI",
        generateAIResponse: "Generate AI response",
        delete: "Delete",
        deleteMessage: "Delete message",
        copyReference: "Copy reference",
      },
      answerModal: {
        title: "Answer as AI",
        description: "Generate an AI response to this message",
        inputPlaceholder: "Add context for the AI...",
        confirmLabel: "Generate",
      },
      retryModal: {
        title: "Retry with different model",
        description: "Regenerate this response with a different model",
        confirmLabel: "Retry",
      },
      anonymous: "Anonymous",
      assistantFallback: "Assistant",
      youLabel: "You",
      replyingTo: "Replying to",
      replies: "Replies:",
      clickToCopyRef: "Click to copy reference",
      postsById: "{{count}} posts by this ID",
      idLabel: "ID: {{id}}",
    },
    debugView: {
      systemMessageHint: "System message (hidden from users)",
    },
    userProfile: {
      recentPosts: "Recent posts",
      noPostsYet: "No posts yet",
      postCount: "{{count}} posts",
    },
    screenshot: {
      capture: "Capture screenshot",
      capturing: "Capturing...",
    },
    shareDialog: {
      title: "Share thread",
    },
    messageEditor: {
      titles: {
        branch: "Edit & branch",
        cancel: "Cancel",
      },
      hint: {
        branch: "Editing creates a new branch",
      },
    },
    input: {
      keyboardShortcuts: {
        press: "Press",
        enter: "Enter",
        shiftEnter: "Shift+Enter",
        forNewLine: "for new line",
      },
    },
    voiceMode: {
      callMode: "Call mode",
      callModeDescription: "AI will respond with voice",
      tapToRecord: "Tap to record",
    },
    batchToolConfirmation: {
      title: "Confirm batch tool calls",
    },
  },
};
