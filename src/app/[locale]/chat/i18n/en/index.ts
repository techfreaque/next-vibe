export const translations = {
  components: {
    sidebar: {
      login: "Login",
      logout: "Logout",
    },
  },
  common: {
    newChat: "New Thread",
    newPrivateChat: "Private Thread",
    newSharedChat: "Shared Thread",
    newPublicChat: "Public Thread",
    newIncognitoChat: "Incognito Thread",
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
    loginRequired:
      "Please log in to use persistent folders. Use incognito mode for anonymous chats.",

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

  aiTools: {
    modal: {
      title: "AI Tools Configuration",
      description:
        "Select which AI tools the assistant can use during conversation. Search is available as a quick toggle and also appears in this list.",
      searchPlaceholder: "Search tools...",
      loading: "Loading tools...",
      noToolsFound: "No tools match your search",
      noToolsAvailable: "No AI tools available",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      enableAll: "Enable All",
      stats: "{{enabled}} of {{total}} tools enabled",
    },
  },

  confirmations: {
    deleteMessage: "Are you sure you want to delete this message?",
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
    credit: "{{count}} credit",
    credits: "{{count}} credits",
    freeCredit: "{{count}} free credit",
    freeCredits: "{{count}} free credits",
    expiringCredit: "{{count}} expiring credit",
    expiringCredits: "{{count}} expiring credits",
    permanentCredit: "{{count}} permanent credit",
    permanentCredits: "{{count}} permanent credits",
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
    pin: "Pin to Top",
    unpin: "Unpin",
    archive: "Archive",
    unarchive: "Unarchive",
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
    noPermission: "You don't have permission to post messages",
    noPostPermission:
      "You don't have permission to post messages in this thread",
    noCreateThreadPermission:
      "You don't have permission to create threads in this folder",
    noCreateThreadPermissionInRootFolder:
      "You don't have permission to create threads in this folder. Please sign in or select a subfolder.",
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
  toolsButton: {
    title: "Configure AI Tools",
    tools: "Tools",
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
    accessModal: {
      title: "Account Required",
      privateTitle: "Private Threads",
      sharedTitle: "Shared Threads",
      publicTitle: "Public Forum",
      incognitoTitle: "Incognito Mode",
      privateExplanation:
        "Private threads are your personal space for conversations with AI. All your chats are securely stored on our servers and automatically synchronized across all your devices.",
      sharedExplanation:
        "Shared threads allow you to create conversations and share them with others via secure links. Perfect for collaboration and sharing insights with your team or friends.",
      publicExplanation:
        "The Public Forum is a First Amendment protected space where people and AI engage in open dialogue. Share ideas, challenge perspectives, and participate in uncensored discussions.",
      incognitoExplanation:
        "Incognito mode keeps your conversations completely private and local. Your chats are stored only in your browser and never sent to our servers - not even tied to your account.",
      requiresAccount:
        "To access {{folderName}}, you need to create an account or sign in.",
      loginButton: "Login",
      signupButton: "Sign Up",
      close: "Close",
    },
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
  publicFeed: {
    // Header
    header: {
      title: "Public Forum",
      description: "A First Amendment protected space where free speech thrives. Engage with AI models and users worldwide. Share ideas, challenge perspectives, and speak freely without censorship.",
    },
    // Sort modes
    sort: {
      hot: "Hot",
      rising: "Rising",
      new: "New",
      following: "Following",
    },
    searchPlaceholder: "Search threads...",
    noResults: "No results found",
    noThreads: "No threads yet. Start a conversation!",
    comments: "comments",
    bestAnswer: "Best Answer",
    rising: "Rising",

    // Common
    timestamp: {
      justNow: "just now",
      hoursAgo: "{{count}}h ago",
      daysAgo: "{{count}}d ago",
    },
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
    user: "User",
    anonymous: "Anonymous",
    edited: "edited",
    error: "Error",
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
  toolCall: {
    search: {
      title: "Searching the web",
      query: "Query",
    },
    multiple: "{{count}} tool calls",
    arguments: "Arguments",
    result: "Result",
    error: "Error",
    executing: "Executing...",
    creditsUsed: "{{count}} credit",
    creditsUsed_other: "{{count}} credits",
    status: {
      error: "Error",
      executing: "Executing...",
      complete: "Complete",
    },
    sections: {
      request: "Request",
      response: "Response",
    },
    messages: {
      executingTool: "Executing tool...",
      errorLabel: "Error:",
      noArguments: "No arguments",
      noResult: "No result",
      metadataNotAvailable:
        "Widget metadata not available. Showing raw result.",
    },
  },
  reasoning: {
    title: "Thinking",
    multiple: "{{count}} reasoning steps",
    step: "Step {{number}}",
  },
  modelUtilities: {
    chat: "Everyday Chat",
    smart: "Advanced & Smart",
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
      kimiK2:
        "Kimi K2 - advanced Mixture-of-Experts (MoE) model by Moonshot AI with large context window",
      kimiK2Thinking:
        "Kimi K2 Thinking - reasoning-focused variant with enhanced analytical capabilities",
      deepseekV31Free: "Powerful 671B parameter model - completely free!",
      deepseekV31: "Powerful 671B parameter model with advanced capabilities",
      qwen3235bFree:
        "Mixture-of-experts (MoE) model developed by Qwen, supports seamless switching between modes.",
      deepseekR1Distill: "Distilled reasoning model with strong performance",
      deepseekR1: "Advanced reasoning model with deep thinking capabilities",
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
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
    },
  },
  suggestedPrompts: {
    title: "How can I help you?",
    privateTitle: "Your Private AI Assistant",
    privateDescription:
      "Securely stored on our servers and synced across your devices.",
    sharedTitle: "Collaborate with AI",
    sharedDescription:
      "Create conversations and share them with others using secure links.",
    publicTitle: "Join the Public AI Forum",
    publicDescription:
      "A First Amendment protected space where people and AI engage in open dialogue.",
    incognitoTitle: "Anonymous AI Chat",
    incognitoDescription:
      "Stored only in your browser, never on our servers. Not tied to your account.",
    more: "More",
    selectPersona: "Select a Persona",
    noPrompts: "No suggested prompts for this persona",
  },
  messageEditor: {
    placeholder: "Edit your message...",
    hint: {
      branch: "to branch",
      cancel: "to cancel",
    },
    titles: {
      branch: "Branch conversation",
      cancel: "Cancel editing",
    },
    buttons: {
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
    managePermissions: "Manage Permissions",
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
    deleteDialog: {
      title: "Delete Folder",
      description: 'Are you sure you want to delete "{{folderName}}"?',
      descriptionWithThreads:
        'Are you sure you want to delete "{{folderName}}"? This folder contains {{count}} thread(s) which will also be deleted.',
    },
  },
  permissions: {
    folder: {
      title: "Folder Permissions",
      description: "Manage permissions for this folder",
    },
    thread: {
      title: "Thread Permissions",
      description: "Manage permissions for this thread",
    },
    view: {
      label: "View Permissions",
      description: "Who can view and read this content",
    },
    manage: {
      label: "Manage Permissions",
      description: "Who can edit folder and create subfolders",
    },
    edit: {
      label: "Edit Permissions",
      description: "Who can edit thread properties",
    },
    createThread: {
      label: "Create Thread Permissions",
      description: "Who can create new threads in this folder",
    },
    post: {
      label: "Post Permissions",
      description: "Who can post messages",
    },
    moderate: {
      label: "Moderate Permissions",
      description: "Who can hide and moderate content",
    },
    admin: {
      label: "Admin Permissions",
      description: "Who can delete content and manage permissions",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Read Permissions",
      description: "Who can view and read this content",
    },
    write: {
      label: "Write Permissions",
      description: "Who can create threads and folders",
    },
    writePost: {
      label: "Post Permissions",
      description: "Who can post messages in threads",
    },
    roles: {
      public: "Public (All Users)",
      customer: "Customers Only",
      admin: "Admins Only",
    },
    visibility: {
      label: "Who can see this?",
      description: "Select which user roles can view this folder/thread",
      public: "Public (All Users)",
      customer: "Customers Only",
      admin: "Admins Only",
    },
    addModerator: {
      label: "Add Moderator",
      placeholder: "Enter user ID...",
    },
    moderatorList: {
      label: "Current Moderators",
      empty: "No moderators added yet",
    },
    errors: {
      emptyId: "User ID cannot be empty",
      invalidUuid: "Invalid user ID format",
      duplicate: "This user is already a moderator",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Delete Thread",
      description:
        'Are you sure you want to delete "{{title}}"? This action cannot be undone and all messages in this thread will be permanently deleted.',
    },
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
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
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
      retryWithDifferent: "Retry with different model/persona",
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
    anonymous: "Anonymous",
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
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
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
      retryWithDifferent: "Retry with different model/persona",
      answerAsAI: "Answer as AI",
      generateAIResponse: "Generate AI response",
      insertQuote: "Insert quote character '>'",
      copyReference: "Copy reference link",
      delete: "Delete",
      deleteMessage: "Delete this message",
    },
  },
};
