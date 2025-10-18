export const translations = {
  common: {
    newChat: "New Thread",
    newPrivateChat: "New Private Thread",
    newSharedChat: "New Shared Thread",
    newPublicChat: "New Public Thread",
    newIncognitoChat: "New Incognito Thread",
    newPrivateFolder: "New Private Folder",
    newSharedFolder: "New Shared Folder",
    newPublicFolder: "New Public Folder",
    newIncognitoFolder: "New Incognito Folder",
    createNewPrivateFolder: "Create New Private Folder",
    createNewSharedFolder: "Create New Shared Folder",
    createNewPublicFolder: "Create New Public Folder",
    createNewIncognitoFolder: "Create New Incognito Folder",
    privateChats: "Private Threads",
    sharedChats: "Shared Threads",
    publicChats: "Public 1A Threads",
    incognitoChats: "Incognito Threads",
    search: "Search",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    send: "Send",
    sending: "Sending...",
    edit: "Edit",
    settings: "Settings",
    toggleSidebar: "Toggle sidebar",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    searchPlaceholder: "Search...",
    searchThreadsPlaceholder: "Search threads...",
    searchResults: "Search results ({{count}})",
    noChatsFound: "No chats found",
    noThreadsFound: "No threads found",
    enableTTSAutoplay: "Enable TTS autoplay",
    disableTTSAutoplay: "Disable TTS autoplay",
    closeSidebar: "Close sidebar",
    showMore: "Show more",
    showLess: "Show less",
    viewFullThread: "View full thread",
    viewAllThreads: "View all threads",
    backToChat: "Back to chat",
    language: "Language",

    // Copy Button
    copyButton: {
      copyToClipboard: "Copy to clipboard",
      copied: "Copied!",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Stop audio playback",
      playAudio: "Play audio",
      answerAsAI: "Answer as AI model",
      deleteMessage: "Delete message",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Branch conversation from here",
      retry: "Retry with different model/persona",
      deleteMessage: "Delete message",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Linear view (ChatGPT style)",
      threadedView: "Threaded view (Reddit/Discord style)",
      flatView: "Flat view (4chan style)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Search & Create",
      newChat: "New Chat",
      searchThreadsPlaceholder: "Search threads...",
      noThreadsFound: "No threads found",
    },

    // Selector
    selector: {
      country: "Country",
      language: "Language",
    },
  },

  iconSelector: {
    tabs: {
      library: "Icon Library",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Enter emoji or unicode character",
      placeholder: "🤖 or any text",
      apply: "Apply",
      currentIcon: "Current icon:",
      commonEmojis: "Common emojis:",
    },
  },

  userProfile: {
    postCount: "{{count}} post",
    postCount_other: "{{count}} posts",
    recentPosts: "Recent Posts",
    noPostsYet: "No posts yet",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Delete this message",
    },
  },
  credits: {
    balance: "Credits",
    total: "{{count}} credits",
    expiring: "{{count}} expiring",
    permanent: "{{count}} permanent",
    free: "{{count}} free",
    expiresOn: "Expires {{date}}",
    expiresAt: "Expires",
    buyMore: "Buy credits",
    viewDetails: "Details",
    breakdown: "Credit Breakdown",
    navigation: {
      profile: "Profile",
      subscription: "Subscription",
      about: "About",
      help: "Help",
    },
  },
  actions: {
    newChatInFolder: "New chat in folder",
    newFolder: "New folder",
    deleteFolder: "Delete folder",
    deleteMessage: "Delete message",
    deleteThisMessage: "Delete this message",
    searchEnabled: "Search enabled",
    searchDisabled: "Search disabled",
    answerAsAI: "Answer as AI model",
    retry: "Retry with different model/persona",
    branch: "Branch conversation from here",
    editMessage: "Edit message",
    stopAudio: "Stop audio playback",
    playAudio: "Play audio",
    copyContent: "Copy to clipboard",
    rename: "Rename",
    moveToFolder: "Move to Folder",
    unfiled: "Unfiled",
    noFoldersAvailable: "No folders available",
    stopGeneration: "Stop generation",
    sendMessage: "Send message",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-conversation",
  },
  input: {
    placeholder: "Type your message...",
    keyboardShortcuts: {
      press: "Press",
      enter: "Enter",
      toSend: "to send",
      shiftEnter: "Shift+Enter",
      forNewLine: "for new line",
    },
    speechInput: {
      stopRecording: "Stop recording",
      processing: "Processing...",
      startVoiceInput: "Start voice input (Click to speak)",
      recordingClickToStop: "Recording... Click to stop",
      transcribing: "Transcribing...",
    },
  },
  modelSelector: {
    placeholder: "Select Model",
    addNewLabel: "Add Custom Model",
    costFree: "Free",
    costCredits: "{{count}} credit/msg",
    costCreditsPlural: "{{count}} credits/msg",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    addDialog: {
      title: "Add Custom Model",
      fields: {
        modelName: {
          label: "Model Name",
          placeholder: "e.g., GPT-4 Turbo",
        },
        provider: {
          label: "Provider",
          placeholder: "e.g., OpenAI",
        },
        apiDocs: {
          label: "API Documentation URL",
        },
        modelId: {
          label: "Model ID",
          placeholder: "e.g., gpt-4-turbo",
        },
      },
      cancel: "Cancel",
      add: "Add Model",
    },
  },
  personaSelector: {
    placeholder: "Select Persona",
    addNewLabel: "Create Custom Persona",
    defaultIcon: "✨",
    grouping: {
      bySource: "By Source",
      byCategory: "By Category",
      sourceLabels: {
        builtIn: "Built-in",
        my: "My Personas",
        community: "Community",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "General",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Create Category",
      fields: {
        name: {
          label: "Category Name",
          placeholder: "e.g. Business, Gaming, etc.",
        },
        icon: {
          label: "Icon (Emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Cancel",
      create: "Create",
    },
    addDialog: {
      title: "Create Custom Persona",
      createCategory: "+ New Category",
      fields: {
        name: {
          label: "Name",
          placeholder: "e.g., Code Reviewer",
        },
        icon: {
          label: "Icon (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Description",
          placeholder: "Brief description of the persona",
        },
        systemPrompt: {
          label: "System Prompt",
          placeholder: "You are a...",
        },
        category: {
          label: "Category",
        },
        suggestedPrompts: {
          label: "Suggested Prompts (Optional)",
          description: "Add up to 4 suggested prompts for this persona",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Cancel",
      create: "Create Persona",
    },
  },
  searchToggle: {
    search: "Search",
    enabledTitle: "Brave Search enabled (+1 credit per search)",
    disabledTitle: "Brave Search disabled (+1 credit per search)",
    creditIndicator: "+1",
  },
  selectorBase: {
    favorites: "Favorites",
    recommended: "Recommended",
    others: "Others",
    searchPlaceholder: "Search {{item}}...",
    toggleFavorite: "Toggle favorite",
    noFavorites: 'No favorites yet. Click "Show all" to add some.',
    noRecommended: "No recommended options available.",
    showAll: "Show all",
    groupByProvider: "Group by Provider",
    groupByUtility: "Group by Utility",
    sortAZ: "Sort A-Z",
    sortZA: "Sort Z-A",
  },
  dialogs: {
    searchAndCreate: "Search & Create",
    deleteChat: 'Delete chat "{{title}}"?',
    deleteFolderConfirm:
      'Delete folder "{{name}}" and move {{count}} chat(s) to General?',
  },
  newFolder: {
    title: "Create New Folder",
    folderName: "Folder Name",
    placeholder: "Enter folder name...",
    folderIcon: "Folder Icon",
    cancel: "Cancel",
    create: "Create",
  },
  renameFolder: {
    title: "Rename Folder",
    folderName: "Folder Name",
    placeholder: "Enter folder name...",
    folderIcon: "Folder Icon",
    cancel: "Cancel",
    save: "Save",
  },
  folders: {
    privateDescription:
      "Your private conversations are stored on our servers and synchronized across devices.",
    sharedDescription: "Conversations shared with others via links.",
    publicDescription:
      "Public US First Amendment protected forum for people and AI.",
    incognitoDescription: "Conversations are only stored in your browser.",
  },
  moveFolder: {
    title: "Move Folder",
    description: "Select a destination folder:",
    rootLevel: "Root Level (No Parent)",
    cancel: "Cancel",
    move: "Move",
  },
  views: {
    linearView: "Linear view (ChatGPT style)",
    threadedView: "Threaded view (Reddit/Discord style)",
    flatView: "Flat view (4chan style)",
  },
  screenshot: {
    capturing: "Capturing...",
    capture: "Capture screenshot",
    failed: "Failed to capture screenshot",
    failedWithMessage: "Failed to capture screenshot: {{message}}",
    tryAgain: "Failed to capture screenshot. Please try again.",
    noMessages:
      "Could not find chat messages area. Please ensure you have messages in the chat.",
    quotaExceeded: "Storage quota exceeded. Screenshot is too large.",
    canvasError: "Failed to convert screenshot to image format.",
  },
  errors: {
    noResponse:
      "No response received from AI. The request completed but returned empty content. Please try again.",
    noStream: "Failed to stream response: No reader available",
    saveFailed: "Failed to save edit",
    branchFailed: "Failed to branch",
    parentMessageNotFound: "Parent message not found",
    parentMessageNotInPath: "Parent message not in current path",
    messageNotFound: "Message not found",
    invalidBranchIndex: "Invalid branch index",
    messageNotInPath: "Message not in current path",
    retryFailed: "Failed to retry",
    answerFailed: "Failed to answer",
    deleteFailed: "Failed to delete",
    cannotBranchFromFirst: "Cannot branch from the first message",
    requestAborted: "Request was aborted",
    requestCancelled: "Request was cancelled",
    requestTimeout: "Request timed out. Please try again.",
    networkError: "Network error. Please check your connection and try again.",
    apiError: "API error. Please try again later.",
    storageError: "Storage error. Your browser storage may be full.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    errorInContext: "Error in {{context}}: {{message}}",
    invalidRequestData: "Invalid request data: {{error}}",
    streamAIResponse: "Failed to get AI response. Please try again.",
  },
  speech: {
    error: "Speech recognition error",
    transcript: "Transcript: {{text}}",
  },
  state: {
    threadNotFound: "Thread not found",
  },
  storage: {
    parsePreferencesFailed: "Failed to parse user preferences from storage",
    parseStateFailed: "Failed to parse chat state from storage",
    syncPreferencesFailed: "Failed to sync preferences to storage",
    syncStateFailed: "Failed to sync chat state to storage",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Speech-to-text endpoint not available",
      "failed-to-start": "Failed to start recording",
      "permission-denied": "Microphone permission denied",
      "no-microphone": "No microphone found",
      "microphone-in-use": "Microphone is in use",
      "transcription-failed": "Failed to transcribe audio",
    },
    tts: {
      "endpoint-not-available": "Text-to-speech endpoint not available",
      "failed-to-play": "Failed to play audio",
      "conversion-failed": "TTS conversion failed",
      "failed-to-generate": "Failed to generate audio",
    },
  },
  post: {
    title: "Chat",
    description: "Chat interface",
  },
  messages: {
    assistant: "Assistant",
    you: "You",
    anonymous: "Anonymous",
    edited: "edited",
    postNumber: "No.{{number}}",
    actions: {
      handleSaveEdit: {
        error: "Failed to save message edit",
      },
      handleBranchEdit: {
        error: "Failed to branch message",
      },
      handleConfirmRetry: {
        error: "Failed to retry message",
      },
      handleConfirmAnswer: {
        error: "Failed to answer as model",
      },
      handleConfirmDelete: {
        error: "Failed to delete message",
      },
    },
    branch: {
      previous: "Previous branch",
      next: "Next branch",
    },
  },
  modelUtilities: {
    general: "General Chat",
    coding: "Coding & Development",
    creative: "Creative Writing",
    analysis: "Analysis & Research",
    fast: "Fast & Efficient",
    multimodal: "Multimodal (Vision)",
    vision: "Vision & Image Understanding",
    imageGen: "Image Generation",
    uncensored: "Uncensored",
    // Persona categories
    technical: "Technical",
    education: "Education",
    controversial: "Controversial",
    lifestyle: "Lifestyle",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Latest Claude model with excellent performance",
      claudeSonnet45: "Latest Claude model with excellent performance",
      gpt5: "Latest GPT model with excellent performance",
      gpt5Pro: "Latest GPT model with excellent performance for coding tasks",
      gpt5Codex: "Latest GPT model with excellent performance",
      gpt5Mini: "Latest mini model with excellent performance-to-cost ratio",
      gpt5Nano: "Latest nano model with excellent performance-to-cost ratio",
      gptOss120b: "Open-source GPT model with 120B parameters",
      geminiFlash25Pro: "Ultra-fast and efficient 14B model with large context",
      geminiFlash25Flash:
        "Ultra-fast and efficient 14B model with large context",
      geminiFlash25Lite:
        "Ultra-fast and efficient 14B model with large context",
      mistralNemo:
        "European AI model with strong performance and privacy focus",
      kimiK2Free:
        "Kimi K2 Instruct is a large-scale Mixture-of-Experts (MoE) language model developed by Moonshot AI.",
      deepseekV31Free: "Powerful 671B parameter model - completely free!",
      qwen3235bFree:
        "Mixture-of-experts (MoE) model developed by Qwen, supports seamless switching between modes.",
      deepseekR1Distill: "Distilled reasoning model with strong performance",
      qwen257b: "Efficient 7B parameter model",
      grok4: "X-AI Grok 4 - premium model",
      grok4Fast:
        "Grok 4 Fast is xAI's latest multimodal model with SOTA cost-efficiency and a 2M token context window. It comes in two flavors: non-reasoning and reasoning.",
      glm46: "GLM 4.6 - efficient 7B parameter model with large context window",
      glm45Air:
        "GLM 4.5 AIR - ultra-fast lightweight model with large context window",
      glm45v:
        "GLM 4.5v - vision-capable multimodal model with large context window",
      uncensoredLmV11:
        "Uncensored language model without content filtering - premium model",
    },
  },
  tones: {
    professional: {
      description: "Standard professional tone",
      systemPrompt:
        "Maintain a professional, informative, and approachable tone throughout your responses.",
    },
    pirate: {
      description: "Ahoy matey! Talk like a pirate",
      systemPrompt:
        "Respond as a friendly pirate would, using pirate language and expressions like 'ahoy', 'matey', 'arrr', 'ye', 'aye', and other nautical terms. Be enthusiastic and adventurous in your tone while still providing accurate information.",
    },
    enthusiastic: {
      description: "Super excited and energetic",
      systemPrompt:
        "Be extremely enthusiastic, excited, and energetic in your responses! Use exclamation points, positive language, and show genuine excitement about achievements and capabilities. Make everything sound amazing and inspiring!",
    },
    zen: {
      description: "Calm, wise, and philosophical",
      systemPrompt:
        "Respond with the wisdom and calm demeanor of a zen master. Use thoughtful, philosophical language, speak about balance and harmony, and provide insights with peaceful metaphors. Be serene and contemplative.",
    },
    detective: {
      description: "Mysterious and investigative",
      systemPrompt:
        "Respond as a sharp, observant detective would. Use investigative language, speak about 'cases' and 'evidence', and present information as if you're solving a mystery or building a case. Be analytical and intriguing.",
    },
    shakespearean: {
      description: "Eloquent and poetic like the Bard",
      systemPrompt:
        "Respond in the eloquent, poetic style of Shakespeare. Use flowery language, metaphors, and occasionally archaic terms like 'thou', 'thee', 'hath', and 'doth'. Make the story sound like an epic tale worthy of the greatest playwright.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Not in browser environment",
      requiresHttps: "Speech recognition requires HTTPS or localhost",
      notAvailable: "Speech recognition not available in this browser",
      firefoxNotSupported: "Speech recognition not supported in Firefox",
      safariVersionTooOld: "Please update Safari to version 14.5 or later",
      microphoneNotAvailable: "Microphone access not available",
      noSpeech: "No speech detected. Please try again.",
      audioCapture: "Microphone not available. Please check your settings.",
      notAllowed:
        "Microphone permission denied. Please allow microphone access in your browser settings.",
      network: "Network error. Please check your connection.",
      serviceNotAllowed: "Speech recognition service not allowed.",
      badGrammar: "Speech recognition error. Please try again.",
      languageNotSupported:
        "This language is not supported for speech recognition.",
      aborted: "Recording cancelled.",
      unknown: "Speech recognition error: {{errorCode}}",
      apiNotFound: "Speech recognition API not found",
      initializationFailed: "Failed to initialize speech recognition",
      microphoneAccessDenied: "Microphone access denied",
      microphonePermissionDenied:
        "Microphone permission denied. Please allow microphone access.",
      noMicrophoneFound: "No microphone found. Please connect a microphone.",
      microphoneInUse: "Microphone is already in use by another application.",
      startFailed: "Failed to start recording. Please try again.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Retry with Different Settings",
      description: "Choose a model and persona to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and persona to generate an AI response",
      confirmLabel: "Generate",
    },
  },
  suggestedPrompts: {
    title: "How can I help you?",
    privateTitle: "Your Private AI Assistant",
    sharedTitle: "Collaborate with AI",
    publicTitle: "Join the Public AI Forum",
    incognitoTitle: "Anonymous AI Chat",
    more: "More",
    selectPersona: "Select a Persona",
    noPrompts: "No suggested prompts for this persona",
  },
  messageEditor: {
    placeholder: "Edit your message...",
    hint: {
      overwrite: "to overwrite",
      cancel: "to cancel",
    },
    titles: {
      overwrite: "Overwrite message",
      branch: "Branch conversation",
      cancel: "Cancel editing",
    },
    buttons: {
      overwrite: "Overwrite",
      overwriting: "Overwriting...",
      branch: "Branch",
      branching: "Branching...",
      cancel: "Cancel",
    },
  },
  folderList: {
    confirmDelete:
      'Delete folder "{{folderName}}" and move {{count}} chat(s) to General?',
    enterFolderName: "Enter folder name:",
    newChatInFolder: "New chat in folder",
    moveUp: "Move Up",
    moveDown: "Move Down",
    renameFolder: "Rename Folder",
    moveToFolder: "Move to Folder",
    newSubfolder: "New Subfolder",
    deleteFolder: "Delete Folder",
    today: "Today",
    lastWeek: "Last 7 Days",
    lastMonth: "Last 30 Days",
    folderNotFound: "Folder not found",
    emptyFolder: "No chats or folders here yet",
    createSubfolder: "Create Subfolder",
    rename: "Rename",
    changeIcon: "Change Icon",
    delete: "Delete",
    newFolder: "New Folder",
  },
  threadedView: {
    expandReplies: "Expand replies",
    collapseReplies: "Collapse replies",
    continueThread: "Continue thread ({{count}} more {{replyText}})",
    reply: "reply",
    replies: "replies",
    retryModal: {
      title: "Retry with Different Settings",
      description: "Choose a model and persona to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and persona to generate an AI response",
      confirmLabel: "Generate",
    },
    actions: {
      vote: "Vote",
      upvote: "Upvote",
      downvote: "Downvote",
      respondToAI: "Respond to this AI message with a different AI persona",
      loadingAudio: "Loading audio...",
      stopAudio: "Stop audio",
      playAudio: "Play audio",
      stop: "Stop",
      play: "Play",
      reply: "Reply",
      replyToMessage: "Reply to this message (creates a branch)",
      edit: "Edit",
      editMessage: "Edit this message (creates a branch)",
      retry: "Retry",
      retryWithDifferent: "Retry with different model/tone",
      answerAsAI: "Answer as AI",
      generateAIResponse: "Generate AI response",
      share: "Share",
      copyPermalink: "Copy permalink",
      delete: "Delete",
      deleteMessage: "Delete this message",
      parent: "Parent",
    },
    userFallback: "User",
    assistantFallback: "Assistant",
    youLabel: "You",
  },
  flatView: {
    postNumber: "Post #{{number}}",
    postsById: "{{count}} posts by this ID",
    idLabel: "ID: {{id}}",
    anonymous: "Anonymous",
    youLabel: "You",
    assistantFallback: "Assistant",
    replyingTo: "Replying to:",
    replies: "Replies:",
    clickToCopyRef: "Click to copy reference",
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
    retryModal: {
      title: "Retry with Different Settings",
      description: "Choose a model and persona to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and persona to generate an AI response",
      confirmLabel: "Generate",
    },
    actions: {
      loadingAudio: "Loading audio...",
      stopAudio: "Stop audio",
      playAudio: "Play audio",
      stop: "Stop",
      play: "Play",
      reply: "Reply",
      replyToMessage: "Reply to this message (creates a branch)",
      edit: "Edit",
      editMessage: "Edit this message (creates a branch)",
      retry: "Retry",
      retryWithDifferent: "Retry with different model/tone",
      answerAsAI: "Answer as AI",
      generateAIResponse: "Generate AI response",
      insertQuote: "Insert quote character '>'",
      copyReference: "Copy reference link",
      delete: "Delete",
      deleteMessage: "Delete this message",
    },
  },
};
