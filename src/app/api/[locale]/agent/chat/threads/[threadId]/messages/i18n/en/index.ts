export const translations = {
  category: "Chat",
  tags: {
    messages: "Messages",
  },
  loadingOlderMessages: "Loading older messages...",
  loadingNewerMessages: "Loading newer messages...",
  scrollUpForOlderMessages: "Scroll up for older messages",
  showOlderMessages: "Show older messages",
  showNewerMessages: "Show newer messages",
  transcribing: "Transcribing audio...",
  uploadingAttachments: "Uploading files...",
  gapFill: {
    transcribingAudio: "Transcribing audio…",
    analyzingImage: "Analyzing image…",
    describingVideo: "Describing video…",
    variantUsing: "via {{model}}",
    variantCost: "{{cost}} credits",
    transcription: "Transcription",
    imageDescription: "Image description",
    videoDescription: "Video description",
    showAnalysis: "Show analysis",
    hideAnalysis: "Hide analysis",
  },
  errorCode: "Error Code",
  errorFeedback: {
    autoReported: "Error reported automatically",
    helpFix: "Help us fix this",
    autoContext: "[Auto-generated error report]",
    errorLabel: "Error",
    causeLabel: "Cause",
    userContextLabel: "Add more context here (optional)",
    separator: "·",
  },
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
    leafMessageId: {
      label: "Leaf Message ID",
      description: "Current branch leaf message ID",
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
          authorId: {
            content: "Author ID",
          },
          isAI: {
            content: "Is AI",
          },
          model: {
            content: "Model",
          },
          skill: {
            content: "Skill",
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
    skill: {
      label: "Skill",
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
    systemPromptLabel: "system prompt · leading · cached",
    upcomingContextLabel: "upcoming assistant context · last message",
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
        cancelLoading: "Cancel loading",
        stopAudio: "Stop audio",
        playAudio: "Play audio ({{cost}} credits)",
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
        inputTokens: "Input",
        outputTokens: "Output",
        cachedTokens: "Cached",
        cachedPercent: "{{percent}}% cached",
        cachedPercentTitle:
          "{{percent}}% of input tokens were served from cache, reducing cost",
        cached: "cached",
        pipeline: "Pipeline",
        timeToFirstToken: "{{seconds}}s to first token",
        timeToFirstTokenTitle: "Time to first token",
        streamingTime: "{{seconds}}s streaming",
        streamingTimeTitle: "Total streaming duration",
        cacheWriteTokens: "Cache write",
        cacheWrite: "{{tokens}} written to cache",
        cacheWriteTitle:
          "{{tokens}} tokens written to cache this request (billed at cache write rate)",
        deleteMessage: "Delete message",
        upvote: "Upvote",
        downvote: "Downvote",
      },
      generatedMediaActions: {
        copy: "Copy",
        copied: "Copied",
        download: "Download",
        showPrompt: "Show prompt",
        hidePrompt: "Hide prompt",
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
      authorWithId: "{{name}} ({{id}})",
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
      replyModal: {
        title: "Reply",
        description: "Send a message in reply to this post",
        inputPlaceholder: "Write your reply...",
        confirmLabel: "Reply",
      },
      actions: {
        reply: "Reply",
        replyToMessage: "Reply to this message",
        branch: "Branch",
        branchMessage: "Edit & branch",
        retry: "Retry",
        retryWithDifferent: "Retry with different model",
        answerAsAI: "Answer as AI",
        generateAIResponse: "Generate AI response",
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
      replyModal: {
        title: "Reply",
        description: "Send a message in reply to this post",
        inputPlaceholder: "Write your reply...",
        confirmLabel: "Reply",
      },
      actions: {
        reply: "Reply",
        replyToMessage: "Reply to this message",
        branch: "Branch",
        branchMessage: "Edit & branch",
        retry: "Retry",
        retryWithDifferent: "Retry with different model",
        answerAsAI: "Answer as AI",
        generateAIResponse: "Generate AI response",
        delete: "Delete",
        deleteMessage: "Delete message",
        copyReference: "Copy reference",
        upvote: "Upvote",
        downvote: "Downvote",
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
        reply: "Reply",
        cancel: "Cancel",
      },
      hint: {
        branch: "Editing creates a new branch",
        reply: "Write your reply",
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
    queue: {
      badge: "Queued",
      cancelTooltip: "Remove from queue and restore to input",
    },
  },
  flatView: {
    timestamp: {
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
  },
};
