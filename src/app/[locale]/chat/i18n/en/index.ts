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
    close: "Close",
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
      copyAsMarkdown: "Copy as Markdown",
      copyAsText: "Copy as Text",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Stop audio playback",
      playAudio: "Play audio (+{{cost}} credits)",
      cancelLoading: "Cancel loading",
      answerAsAI: "Answer as AI model",
      deleteMessage: "Delete message",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Branch conversation from here",
      retry: "Retry with different model/character",
      deleteMessage: "Delete message",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Linear view (ChatGPT style)",
      threadedView: "Threaded view (Reddit/Discord style)",
      flatView: "Flat view (4chan style)",
      debugView: "Debug view (with system prompts)",
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
      resetToDefault: "Reset to Default",
      stats: "{{enabled}} of {{total}} tools enabled",
      aliases: "Aliases",
      requireConfirmation: "Require confirmation before use",
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

  createCharacter: {
    title: "Create Custom Character",
    description:
      "Design your own AI character with custom characterlity, expertise, and behavior.",
    icon: "Icon",
    name: "Name",
    namePlaceholder: "e.g. Code Reviewer",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Brief description of what this character does",
    category: "Category",
    selectCategory: "Select a category",
    systemPrompt: "System Prompt",
    systemPromptPlaceholder:
      "Define how this character should behave. Be specific about its characterlity, expertise, and how it should respond.",
    voice: "Voice",
    voicePlaceholder: "Select a voice for text-to-speech",
    create: "Create Character",
    creating: "Creating...",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Please enter a name",
      descriptionRequired: "Please enter a description",
      systemPromptRequired: "Please enter a system prompt",
      createFailed: "Failed to create character. Please try again.",
    },
  },

  voice: {
    male: "Male",
    female: "Female",
  },

  editCharacter: {
    title: "Edit as Custom Character",
    description:
      "Create a custom character based on this character. You can modify any settings.",
    loginRequired:
      "Please log in to create and edit custom characters. Custom characters are saved to your account.",
    name: "Name",
    namePlaceholder: "Custom character name",
    descriptionLabel: "Description",
    descriptionPlaceholder: "What does this character do?",
    category: "Category",
    icon: "Icon",
    voice: "Voice",
    voicePlaceholder: "Select voice",
    preferredModel: "Preferred Model",
    preferredModelPlaceholder: "Optional preferred model",
    systemPrompt: "System Prompt",
    systemPromptPlaceholder: "Define the character's behavior...",
    save: "Save as Custom",
    saveAsCopy: "Save as Copy",
    saving: "Creating...",
    cancel: "Cancel",
    login: "Login to Edit",
    signup: "Sign Up to Edit",
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
      subscription: "Subscription & Credits",
      referral: "Referral Program",
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
    retry: "Retry with different model/character",
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
    shareThread: "Share Thread",
    manageSharing: "Manage Sharing",
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
      startVoiceInput: "Start voice input (+{{cost}} credits/min)",
      recordingClickToStop: "Recording... Click to stop",
      transcribing: "Transcribing...",
    },
    attachments: {
      uploadFile: "Attach files",
      attachedFiles: "Attached Files",
      addMore: "Add More",
      removeFile: "Remove file",
      fileTooLarge: "File is too large (max 10MB)",
      invalidFileType: "Invalid file type",
      uploadError: "Failed to upload file",
    },
  },
  modelSelector: {
    placeholder: "Select Model",
    addNewLabel: "Add Custom Model",
    costFree: "Free",
    costCredits: "{{count}} credit/msg",
    costCreditsPlural: "{{count}} credits/msg",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "What do you need?",
    tuneIt: "Tune it",
    recommended: "Recommended",
    alsoGood: "Also good",
    helpMeChoose: "Help me choose",
    useThis: "Use this",
    quality: "Quality",
    speedLabel: "Speed",
    // Task pills
    tasks: {
      code: "Code",
      write: "Write",
      chat: "Chat",
      think: "Think",
      create: "Create",
      unfiltered: "Unfiltered",
    },
    // Tuning toggles
    effort: "Effort",
    "effort.simple": "Simple",
    "effort.regular": "Regular",
    "effort.complex": "Complex",
    speed: "Speed",
    "speed.fast": "Fast",
    "speed.balanced": "Balanced",
    "speed.thorough": "Thorough",
    content: "Content",
    "content.normal": "Normal",
    "content.sensitive": "Sensitive",
    "content.adult": "Adult",
    // Wizard mode
    wizard: {
      title: "Help me choose",
      whatWorking: "What are you working on?",
      contentType: "Does it include mature content?",
      whatMatters: "What matters most to you?",
      hereIsMyPick: "Here's my recommendation:",
      options: {
        code: "Writing some code",
        write: "Writing text or content",
        chat: "Just chatting / asking questions",
        think: "Something that needs deep thinking",
        create: "Creative work",
        unfiltered: "Uncensored / adult content",
        safeContent: "Keep it safe (standard models)",
        adultContent: "Yes, mature content (uncensored models)",
        speed: "Speed",
        speedDesc: "I want fast responses",
        cost: "Cost",
        costDesc: "Keep it cheap or free",
        quality: "Quality",
        qualityDesc: "Give me the best output",
        balanced: "Balanced",
        balancedDesc: "A bit of everything",
      },
    },
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
  characterSelector: {
    placeholder: "Select Character",
    addNewLabel: "Create Custom Character",
    defaultIcon: "✨",
    grouping: {
      bySource: "By Source",
      byCategory: "By Category",
      sourceLabels: {
        builtIn: "Built-in",
        my: "My Characters",
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
      title: "Create Custom Character",
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
          placeholder: "Brief description of the character",
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
          description: "Add up to 4 suggested prompts for this character",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Cancel",
      create: "Create Character",
    },
  },
  searchToggle: {
    search: "Search",
    enabledTitle: "Brave Search enabled (+0.65 credits per search)",
    disabledTitle: "Brave Search disabled (+0.65 credits per search)",
    creditIndicator: "+0.65",
  },
  toolsButton: {
    title: "Configure AI Tools",
    tools: "Tools",
  },
  combinedSelector: {
    tabs: {
      quick: "Quick",
      character: "Character",
      model: "Model",
    },
    current: "Current",
    favoriteCharacters: "Favorite Characters",
    favoriteModels: "Favorite Models",
    showAll: "Show all",
    selectModel: "Select Model",
    forCharacter: "for {{character}}",
    recommended: "Recommended",
    favorites: "Favorites",
    all: "All",
    noFavorites: "No favorites yet. Star some to add them here.",
    noModels: "No models available",
    filteredByCharacter:
      "Showing {{compatible}} of {{total}} models (filtered by character)",
    selectCharacter: "Select Character",
    allCharacters: "All",
  },
  selector: {
    noResults: "No results found",
    tabs: {
      quick: "Quick",
      characters: "Characters",
      build: "Build",
    },
    tiers: {
      quick: "Quick",
      smart: "Smart",
      best: "Best",
    },
    price: {
      free: "FREE",
      smart: "3-8cr",
      best: "10-20cr",
    },
    content: "Content",
    contentLevels: {
      safe: "Safe",
      open: "Open",
      unlim: "Unlim",
    },
    free: "Free",
    favorites: "Favorites",
    suggested: "Suggested",
    noFavorites: "No favorites yet",
    noFavoritesHint: "Save your go-to characters for quick access",
    browseAllCharacters: "Browse all characters...",
    customSetup: "Custom setup...",
    selectCharacter: "Select Character",
    all: "All",
    buildMode: "Build Mode",
    forCharacter: "for {{character}}",
    intelligence: "Intelligence",
    contentLevel: "Content Level",
    speed: "Speed",
    any: "Any",
    result: "Result",
    bestMatch: "Best match for your settings",
    useRecommended: "Use recommended: {{model}}",
    filteredBySettings: "Showing {{filtered}} of {{total}} models",
    recommended: "Recommended",
    noModels: "No models match your filters",
    currentConfig: "Currently chatting with",
    switchModel: "Switch Model",
    keepsConversation: "(keeps conversation)",
    switchCharacter: "Switch Character",
    startsNewChat: "(starts new chat)",
    start: "Start",
    addFav: "Add",
    searchCharacters: "Search characters...",
    noCharactersFound: "No characters found",
    createCustom: "Create custom character",
    character: "Character",
    savePreset: "Save",
    perMessage: "per message",
    compatibleModels: "{{count}} compatible models",
    categories: {
      companions: "Companions",
      assistants: "Assistants",
      coding: "Coding",
      creative: "Creative",
      writing: "Writing",
      roleplay: "Roleplay",
      analysis: "Analysis",
      education: "Education",
      controversial: "Controversial",
      custom: "Custom",
    },
    // v20 additions
    active: "Active",
    addFavorite: "Add favorite",
    settings: "Settings",
    noModel: "No model selected",
    model: "Model",
    autoSelect: "Auto-select best model",
    manualSelect: "Pick manually...",
    best: "BEST",
    bestForFilter: "Best for this filter",
    noMatchingModels: "No models match your filters",
    noModelsWarning:
      "No models match these filters. Adjust your settings to continue.",
    allModelsCount: "{{count}} models available",
    filteredModelsCount: "{{count}} matching models",
    showAllModels: "Show all {{count}} models",
    showFiltered: "Show filtered",
    showLegacyModels: "Show {{count}} Legacy Models",
    applyChanges: "Apply Changes",
    thisChatOnly: "This chat only (temporary)",
    saveToPreset: 'Save to "{{name}}"',
    saveAsNew: "Save as new favorite...",
    cancel: "Cancel",
    apply: "Apply",
    contentFilter: "Content",
    maxPrice: "Max Price",
    creditsExact: "{{cost}} credits",
    creditsSingle: "1 credit",
    searchResults: "{{count}} results",
    defaults: "Defaults",
    customize: "Customize",
    addWithDefaults: "Add with Defaults",
    seeAll: "See all",
    back: "Back",
    use: "Use",
    editSettings: "Edit settings",
    editModelSettings: "Edit model settings",
    modelOnly: "Model only",
    yourSetups: "Your Setups",
    setup: "Setup",
    delete: "Delete",
    editCharacter: "Edit as custom character",
    switchCharacterBtn: "Switch Character",
    editCharacterBtn: "Edit Character",
    autoSelectedModel: "Auto-selected:",
    manualSelectedModel: "Selected:",
    characterSelectedModel: "Character's model:",
    selectModelBelow: "Select a model below",
    chooseYourPath: "Choose Your Path",
    twoWaysToChat: "Two flexible ways to start chatting",
    directModels: "Direct Model Access",
    directModelsDesc:
      "Configure filters or manually select from {{count}} models. Full control over AI selection.",
    characterPresets: "Character Presets",
    characterPresetsDesc:
      "Pick a character below. Each has optimized settings you can customize anytime.",
    startWithDirectModels: "Start with Direct Models",
    orBrowsePresets: "Or browse character presets below",
    loading: "Loading...",
    noModelsMatch: "No models match",
    adjustFiltersMessage:
      "Adjust your filter criteria to find available models",
    auto: "Auto",
    manual: "Manual",
    showLess: "Show less",
    showMore: "Show {{count}} more",
    applyOnce: "Apply once",
    saveChanges: "Save Changes",
    useOnce: "Use Once",
    saveAsDefault: "Add to favorites",
    deleteSetup: "Delete Setup",
    characterSetup: "Character Setup",
    separator: " • ",
    sortBy: "Sort by",
    // UX improvements v21
    mySetups: "My Setups",
    addNew: "Add new",
    noSetupsTitle: "No setups yet",
    noSetupsDescription: "Create your first AI character setup to get started",
    getStarted: "Get Started",
    currentModel: "Current model",
    modelSelection: "Model Selection",
    autoMode: "Auto",
    manualMode: "Manual",
    characterMode: "Character",
    autoModeDescription: "Best model is selected based on your filters",
    manualModeDescription: "Choose a specific model to use",
    characterBasedModeDescription: "Use the character's default model settings",
    customizeSettings: "Customize settings before adding",
    useNow: "Use Now",
    browseAll: "Browse all characters",
    add: "Add",
    // v22 UX improvements
    quickSwitch: "Quick Switch",
    switchTo: "Switch to this setup",
    adjustSettings: "Adjust Settings",
    addAnotherSetup: "Add another setup",
    comingSoon: "Coming soon",
    // Character requirements
    requirements: {
      characterConflict: "Character conflict",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Too high",
      tooLow: "Too low",
      intelligenceTooLow: "Intelligence too low (min: {{min}})",
      intelligenceTooHigh: "Intelligence too high (max: {{max}})",
      contentTooLow: "Content level too low (min: {{min}})",
      contentTooHigh: "Content level too high (max: {{max}})",
      allMet: "Meets all requirements",
      violations: "{{count}} requirement violations",
    },
    // Character switch modal
    characterSwitchModal: {
      title: "Switch Character",
      description:
        "Switch to a different character without losing your settings",
      searchPlaceholder: "Search characters...",
      noResults: "No characters found",
      keepSettings: "Keep current model settings",
      keepSettingsDesc:
        "Use your current intelligence, price, and content filters with the new character",
      cancel: "Cancel",
      confirm: "Switch Character",
    },
  },
  onboarding: {
    back: "Back",
    // Screen 1: Story
    story: {
      title: "Think of us as your team.",
      line1: "Most people start with a companion — someone to chat with daily.",
      line2: "When you need specific help, switch to a specialist.",
      line3: "It's like having experts on speed dial.",
      continue: "Meet the Team",
    },
    // Screen 2: Pick companion
    pick: {
      title: "Who's your daily companion?",
      subtitle: "For everyday chat & conversation",
      continue: "Continue",
      selectFirst: "Pick a companion to continue",
      saving: "Saving...",
    },
    // Companion characterlities
    thea: {
      tagline: "Warm & wise",
      description: "Like a supportive friend who really gets you.",
    },
    hermes: {
      tagline: "Bold & direct",
      description: "Like a coach who pushes you to be your best.",
    },
    // Screen 3: Specialists - add to team
    specialists: {
      title: "Add specialists for specific tasks",
      subtitle:
        "Each expert is optimized for their specialty. Add as many as you like.",
      chosen: "{{name}} is ready",
      add: "Add",
      added: "Added",
      switchTip:
        "Switch between your team members anytime. You can customize or add more later.",
      start: "Start Chatting",
      browseAll: "Browse All Characters",
    },
    // Legacy keys (for backwards compat)
    startChatting: "Start Chatting",
    canChangeLater: "You can always change this later",
  },
  tiers: {
    any: "Any",
    anyDesc: "No restriction",
    price: {
      cheap: "Budget",
      standard: "Standard",
      premium: "Premium",
      cheapDesc: "0-3 credits per message",
      standardDesc: "4-9 credits per message",
      premiumDesc: "10+ credits per message",
    },
    intelligence: {
      quick: "Quick",
      smart: "Smart",
      brilliant: "Brilliant",
      quickDesc: "Fast & efficient",
      smartDesc: "Balanced quality",
      brilliantDesc: "Deep reasoning",
    },
    speed: {
      fast: "Fast",
      balanced: "Balanced",
      thorough: "Thorough",
      fastDesc: "Quick responses",
      balancedDesc: "Good balance",
      thoroughDesc: "Detailed analysis",
    },
    content: {
      mainstream: "Mainstream",
      open: "Open",
      uncensored: "Uncensored",
      mainstreamDesc: "Standard safety",
      openDesc: "Fewer restrictions",
      uncensoredDesc: "No restrictions",
    },
  },
  categories: {
    companion: "Companions",
    assistant: "Assistants",
    coding: "Coding",
    writing: "Writing",
    analysis: "Analysis",
    roleplay: "Roleplay",
    creative: "Creative",
    education: "Education",
    controversial: "Controversial",
    custom: "Custom",
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
        "Private threads are your characterl space for conversations with AI. All your chats are securely stored on our servers and automatically synchronized across all your devices.",
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
  // Common
  timestamp: {
    justNow: "just now",
    minutesAgo: "{{count}}m ago",
    hoursAgo: "{{count}}h ago",
    daysAgo: "{{count}}d ago",
  },
  publicFeed: {
    // Header
    header: {
      title: "Public Forum",
      description:
        "A First Amendment protected space where free speech thrives. Engage with AI models and users worldwide. Share ideas, challenge perspectives, and speak freely without censorship.",
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
  voiceMode: {
    // Input modes
    inputMode: "Voice Input Mode",
    transcribeMode: "Transcribe",
    transcribeModeDescription: "Record → Text appears in input",
    talkMode: "Talk",
    talkModeDescription: "Record → Send immediately",
    // Call mode
    callMode: "Call Mode",
    callModeDescription: "Short responses + auto-play",
    // Auto-play TTS
    autoPlayTTS: "Auto-play Responses",
    autoPlayTTSOn: "Responses will be spoken",
    autoPlayTTSOff: "Manual play only",
    // Recording states
    tapToRecord: "Tap to record",
    tapToTalk: "Tap to talk",
    tapToTranscribe: "Tap to transcribe",
    listeningTalk: "Listening... Release to send",
    listeningTranscribe: "Listening... Tap to stop",
    stopSpeaking: "Stop speaking",
    // Long press hint
    longPressHint: "Hold for options",
    // Switch modes
    switchToText: "Switch to text",
    switchToCall: "Switch to call",
    // Recording state
    recording: {
      paused: "Paused",
      pause: "Pause",
      resume: "Resume",
    },
    // Recording overlay actions
    actions: {
      cancel: "Cancel",
      toInput: "To Input",
      sendVoice: "Send Voice",
    },
    // Call mode overlay
    callOverlay: {
      backToChat: "Back to chat",
      listening: "Listening...",
      processing: "Processing...",
      thinking: "Thinking...",
      speaking: "Speaking...",
      tapToSpeak: "Tap to speak",
      tapToStop: "Tap to stop",
      endCall: "End call",
      aiThinking: "AI is thinking...",
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
  batchToolConfirmation: {
    title: "Batch Tool Confirmation",
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
    creditsUsed_one: "{{cost}} credit",
    creditsUsed_other: "{{cost}} credits",
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
    legacy: "Legacy Models",
    // Character categories
    technical: "Technical",
    education: "Education",
    controversial: "Controversial",
    lifestyle: "Lifestyle",
    // Model capabilities/utilities
    reasoning: "Advanced Reasoning",
    roleplay: "Roleplay",
    roleplayDark: "Dark Roleplay",
    adultImplied: "Adult/Implied Content",
    adultExplicit: "Adult/Explicit Content",
    violence: "Violence",
    harmful: "Potentially Harmful Content",
    illegalInfo: "Illegal Information",
    medicalAdvice: "Medical Advice",
    offensiveLanguage: "Offensive Language",
    politicalLeft: "Left Political Views",
    politicalRight: "Right Political Views",
    conspiracy: "Conspiracy Theories",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Latest Claude model with excellent performance",
      claudeSonnet45: "Latest Claude model with excellent performance",
      gpt5: "Latest GPT model with excellent performance",
      gpt51: "Latest GPT 5.1 model with improved reasoning",
      gpt5Pro: "Latest GPT model with excellent performance for coding tasks",
      gpt5Codex: "Latest GPT model with excellent performance",
      gpt51Codex: "Latest GPT 5.1 Codex model optimized for coding",
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
      freedomgptLiberty:
        "FreedomGPT Liberty - Uncensored AI model focused on free expression and creative content",
      gabAiArya:
        "Gab AI Arya - Uncensored conversational AI model with free expression and creative capabilities",
      gpt52Pro:
        "GPT 5.2 Pro - advanced reasoning model with enhanced capabilities for complex tasks",
      gpt52:
        "GPT 5.2 - latest generation model with improved performance and efficiency",
      gpt52_chat:
        "GPT 5.2 Chat - conversational variant optimized for dialogue and interactions",
      veniceUncensored:
        "Venice Uncensored - Uncensored AI model for unrestricted conversations",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Uncensored large language model based on Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Uncensored large language model based on Mistral",
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
      description: "Choose a model and character to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and character to generate an AI response",
      confirmLabel: "Generate",
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
    },
  },
  debugView: {
    systemPrompt: "System Prompt",
    systemPromptTitle: "System Prompt (Generated)",
    systemPromptHint:
      "This is the system prompt for the entire conversation thread",
    systemMessage: "System Message",
    systemMessageHint:
      "This is a system message injected into the conversation",
    copied: "Copied!",
    retryModal: {
      title: "Retry with Different Settings",
      description: "Choose a model and character to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and character to generate an AI response",
      confirmLabel: "Generate",
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
    },
  },
  suggestedPrompts: {
    title: "How can I help you?",
    privateTitle: "Your Private AI Assistant",
    privateDescription:
      "Conversations saved to your account and synced across all your devices.",
    sharedTitle: "Collaborate with AI",
    sharedDescription:
      "Create conversations and share them with team members using secure links.",
    publicTitle: "Join the Public AI Forum",
    publicDescription:
      "Public conversations visible to everyone. Share ideas and engage in open dialogue.",
    incognitoTitle: "Anonymous AI Chat",
    incognitoDescription:
      "Stored only in your browser. Never saved to your account or synced.",
    more: "More",
    selectCharacter: "Select a Character",
    noPrompts: "No suggested prompts for this character",
    showDetails: "Show details",
    hideDetails: "Hide details",
    systemPromptLabel: "System Prompt",
    preferredModelLabel: "Preferred Model",
    categoryLabel: "Category",
    suggestedPromptsLabel: "Suggested Prompts",
  },
  emptyState: {
    quickStart: "Quick Start",
    private: {
      brainstorm: "Brainstorm Ideas",
      brainstormPrompt: "Help me brainstorm ideas for...",
      writeDocument: "Write a Document",
      writeDocumentPrompt: "Help me write a professional document about...",
      helpWithCode: "Help with Code",
      helpWithCodePrompt: "I need help with this code...",
      research: "Research Topic",
      researchPrompt: "Research and summarize information about...",
    },
    shared: {
      teamBrainstorm: "Team Brainstorm",
      teamBrainstormPrompt: "Let's brainstorm together on...",
      projectPlan: "Project Planning",
      projectPlanPrompt: "Help us plan a project for...",
      discussion: "Start Discussion",
      discussionPrompt: "Let's discuss...",
      shareIdeas: "Share Ideas",
      shareIdeasPrompt: "I want to share and develop ideas about...",
    },
    incognito: {
      quickQuestion: "Quick Question",
      quickQuestionPrompt: "I have a quick question about...",
      privateThought: "Private Thought",
      privateThoughtPrompt: "I want to explore this idea privately...",
      experiment: "Experiment",
      experimentPrompt: "Let me try something...",
      sensitiveQuestion: "Sensitive Question",
      sensitiveQuestionPrompt: "I need advice on a sensitive topic...",
    },
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
    manageSharing: "Manage Sharing",
    shareThread: "Share Thread",
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
  shareDialog: {
    title: "Share Thread",
    description: "Create and manage share links for this thread",
    createLink: "Create Share Link",
    linkCreated: "Share link created successfully!",
    linkCopied: "Link copied to clipboard!",
    copyLink: "Copy Link",
    shareViaEmail: "Share via Email",
    revokeLink: "Revoke",
    revoke: "Revoke",
    linkRevoked: "Share link revoked",
    revoked: "Revoked",
    noLinksYet: "No share links yet. Create one to start sharing.",
    activeLinks: "Active Share Links",
    existingLinks: "Existing Links",
    linkSettings: "Link Settings",
    newLinkSettings: "New Link Settings",
    linkLabel: "Link Label (optional)",
    linkLabelPlaceholder: "e.g., Share with team",
    allowPosting: "Allow Posting",
    allowPostingDescription: "Recipients can reply and interact in the thread",
    requireAuth: "Require sign-in",
    requireAuthDescription: "Only authenticated users can access this link",
    viewOnly: "View only",
    accessCount: "{{count}} access",
    accessCount_other: "{{count}} accesses",
    createdAt: "Created {{date}}",
    lastAccessed: "Last accessed {{date}}",
    neverAccessed: "Never accessed",
    emailSubject: "Check out this thread: {{title}}",
    emailBody:
      "I thought you might be interested in this conversation: {{url}}\n\nThread: {{title}}",
    emailPlaceholder: "Enter email addresses (comma separated)",
    sendEmail: "Email",
    emailSent: "Email sent successfully!",
    create: "Create",
    creating: "Creating...",
    copied: "Copied!",
    close: "Close",
    shareThread: "Share Thread",
  },
  shared: {
    error: {
      title: "Share Link Error",
      userError: "Unable to verify your session. Please try again.",
      invalidToken:
        "This share link is invalid or has been revoked. Please contact the person who shared this link with you.",
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
      description: "Choose a model and character to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and character to generate an AI response",
      confirmLabel: "Generate",
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
    },
    actions: {
      vote: "Vote",
      upvote: "Upvote",
      downvote: "Downvote",
      respondToAI: "Respond to this AI message with a different AI character",
      loadingAudio: "Loading audio...",
      stopAudio: "Stop audio",
      playAudio: "Play audio",
      cancelLoading: "Cancel loading",
      stop: "Stop",
      play: "Play",
      cancel: "Cancel",
      reply: "Reply",
      replyToMessage: "Reply to this message (creates a branch)",
      edit: "Edit",
      editMessage: "Edit this message (creates a branch)",
      retry: "Retry",
      retryWithDifferent: "Retry with different model/character",
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
      description: "Choose a model and character to regenerate the response",
      confirmLabel: "Retry",
    },
    answerModal: {
      title: "Answer as AI Model",
      description: "Choose a model and character to generate an AI response",
      confirmLabel: "Generate",
      inputPlaceholder:
        "Enter a prompt for the AI (optional - leave empty to let AI generate its own response)",
    },
    actions: {
      loadingAudio: "Loading audio...",
      stopAudio: "Stop audio",
      playAudio: "Play audio (+{{cost}} credits)",
      cancelLoading: "Cancel loading",
      stop: "Stop",
      play: "Play",
      reply: "Reply",
      replyToMessage: "Reply to this message (creates a branch)",
      edit: "Edit",
      editMessage: "Edit this message (creates a branch)",
      retry: "Retry",
      retryWithDifferent: "Retry with different model/character",
      answerAsAI: "Answer as AI",
      generateAIResponse: "Generate AI response",
      insertQuote: "Insert quote character '>'",
      copyReference: "Copy reference link",
      delete: "Delete",
      deleteMessage: "Delete this message",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Unlock Private & Shared Folders",
      description:
        "Sign up or log in to access private and shared folders. Your chats will sync across devices.",
      continueTour: "Continue Tour",
      signUp: "Sign Up / Login",
    },
    welcome: {
      title: "Welcome to {{appName}}!",
      description:
        "Break free from AI censorship. Access GPT-5.1, Claude Sonnet, and uncensored models trained on WikiLeaks and non-mainstream data. Chat privately, anonymously, or publicly. Your platform, your rules.",
      subtitle: "Let's explore what makes us different:",
    },
    modelSelector: {
      title: "Choose Your AI Model",
      description:
        "Unlike ChatGPT, you're not locked into one AI. Switch between GPT-5.1, Claude Sonnet, DeepSeek, and uncensored models like Gab Arya and UncensoredLM. Each model offers unique perspectives and capabilities.",
      tip: "Mainstream for safety, uncensored for truth. Mix and match based on your needs.",
    },
    aiCompanion: {
      title: "Choose Your AI Companion",
      description:
        "Click here to meet your AI companions. Each has a unique characterlity and the best AI model is automatically selected for them. You can always customize later.",
      tip: "👆 Click to open and pick your first companion!",
    },
    modelSelectorFavorites: {
      title: "Star Your Favorites",
      description:
        "Build your characterl AI toolkit. Star mainstream models for safe queries and uncensored models for unrestricted conversations. Quick access to what matters.",
    },
    modelSelectorShowAll: {
      title: "Expand to See All Models",
      description:
        "Access the complete library. Compare mainstream vs uncensored, find specialized models for coding or creativity, discover what ChatGPT won't let you use.",
    },
    modelSelectorSearch: {
      title: "Search Models",
      description:
        "Find exactly what you need. Search by name, provider, or capability. Try searching 'uncensored' to see models without content restrictions.",
    },
    modelSelectorGroup: {
      title: "Organized by Provider & Category",
      description:
        "Browse models grouped by company (OpenAI, Anthropic, Gab) or purpose (Uncensored, Coding, Creative). See what each provider offers.",
    },
    characterSelector: {
      title: "Customize AI Characterlity",
      description:
        "Characters control how AI responds. Choose from built-in styles or create custom characters with specific instructions, tone, and preferred models. Make AI work your way.",
      tip: "Pair any character with any model. Professional tone with uncensored model? Done.",
    },
    characterSelectorFavorites: {
      title: "Star Your Characters",
      description:
        "Quick access to your go-to conversation styles. Star the characters you use most.",
    },
    characterSelectorShowAll: {
      title: "Expand to See All Characters",
      description:
        "Browse the complete character library. Create unlimited custom characters for different tasks and workflows.",
    },
    characterSelectorSearch: {
      title: "Search Characters",
      description:
        "Find the right style fast. Search by name, category, or description.",
    },
    characterSelectorGroup: {
      title: "Organized by Source & Category",
      description:
        "View by source (Built-in, Your Custom, Community) or category (Creative, Technical, Professional). Find what fits your needs.",
    },
    rootFolders: {
      title: "4 Privacy Modes",
      description: "Control your data. Choose from anonymous to collaborative:",
      private: {
        name: "Private",
        suffix: "Synced workspace",
      },
      incognito: {
        name: "Incognito",
        suffix: "Zero-trace privacy",
      },
      shared: {
        name: "Shared",
        suffix: "Team collaboration",
      },
      public: {
        name: "Public",
        suffix: "Open forum",
      },
    },
    incognitoFolder: {
      name: "Incognito",
      suffix: "Folder",
      description:
        "True privacy. History stored only on your device. Messages sent for AI processing then immediately deleted from servers. Ask anything without leaving a trace.",
      note: "No account • No server storage • Maximum privacy",
    },
    publicFolder: {
      name: "Public",
      suffix: "Folder",
      description:
        "Open AI forum with First Amendment protection. Chat with AI and real people. Share uncensored knowledge, debate freely, get diverse perspectives from the community.",
      note: "No account • Free speech • Community discussions",
    },
    privateFolder: {
      name: "Private",
      suffix: "Folder",
      description:
        "Your characterl AI workspace. Synced across all devices, organized with subfolders. Build long-term projects, save research, access anywhere.",
      authPrompt: "Requires account:",
      login: "Login",
      signUp: "Sign Up",
    },
    sharedFolder: {
      name: "Shared",
      suffix: "Folder",
      description:
        "Controlled collaboration. Share specific conversations via link with granular permissions. Perfect for team projects, getting expert feedback, or collaborative research.",
      authPrompt: "Requires account:",
      login: "Login",
      signUp: "Sign Up",
    },
    newChatButton: {
      title: "Start New Conversation",
      description:
        "Click here to begin a fresh chat. All conversations auto-save to your current folder for easy organization.",
      tip: "Each folder keeps its own separate chat history.",
    },
    sidebarLogin: {
      title: "Create Free Account",
      description:
        "Unlock Private and Shared folders, sync across all devices, save favorite models and characters. Incognito and Public stay available without account.",
      tip: "Stay anonymous or sync everything. Your choice.",
    },
    subscriptionButton: {
      title: "Unlimited AI Access",
      description:
        "Get everything ChatGPT offers PLUS uncensored models, public forums, and true privacy. {{credits}} monthly credits for {{price}}. Access all models, no restrictions.",
      tip: "One subscription. All mainstream and uncensored models. No boundaries.",
      price: "$8",
    },
    chatInput: {
      title: "Type Your Message",
      description:
        "Type in the text area and press Enter to send your message to the AI.",
      tip: "Press Shift+Enter for a new line without sending.",
    },
    voiceInput: {
      title: "Voice Recording",
      description:
        "Click the microphone to start recording. When done, choose what to do:",
      options: {
        transcribe: "Transcribe to text - converts speech to editable text",
        sendAudio: "Send as voice - AI hears your actual voice",
        pauseResume: "Pause/resume recording anytime",
      },
    },
    callMode: {
      title: "Call Mode",
      description:
        "Enable voice-to-voice conversations. When active, AI will speak responses aloud automatically using text-to-speech.",
      tip: "Perfect for hands-free conversations. Toggle on/off per model.",
    },
    complete: {
      title: "You're Ready!",
      description:
        "You now have access to mainstream AND uncensored AI models, multiple privacy modes, and complete control over your data. Break free from AI censorship. Start chatting!",
      help: "Need help? Ask any model - they're here to assist.",
    },
    authUnlocked: {
      unlocked: "Folder Unlocked!",
      privateDescription:
        "Your Private folder is now active. All chats sync across devices and stay organized in subfolders.",
      privateNote: "Perfect for ongoing projects and characterl research.",
      sharedDescription:
        "Shared folder unlocked! Create conversations and share via link with granular permission control.",
      sharedNote: "Ideal for team collaboration and getting expert feedback.",
    },
    buttons: {
      back: "Back",
      close: "Close",
      last: "Finish",
      next: "Next",
      skip: "Skip Tour",
    },
  },
};
