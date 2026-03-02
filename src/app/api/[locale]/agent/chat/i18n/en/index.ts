import { translations as creditsTranslations } from "../../../../credits/i18n/en";
import { translations as aiStreamTranslations } from "../../../ai-stream/stream/i18n/en";
import { translations as fetchUrlContentTranslations } from "../../../fetch-url-content/i18n/en";
import { translations as charactersTranslations } from "../../characters/i18n/en";
import { translations as favoritesTranslations } from "../../favorites/i18n/en";
import { translations as foldersTranslations } from "../../folders/i18n/en";
import { translations as memoriesTranslations } from "../../memories/i18n/en";
import { translations as settingsTranslations } from "../../settings/i18n/en";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/en";
import { translations as threadsTranslations } from "../../threads/i18n/en";

export const translations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Folders",
    files: "Files",
    messages: "Messages",
    characters: "Characters",
    memories: "Memories",
    favorites: "Favorites",
    credits: "Credits",
    balance: "Balance",
    permissions: "Permissions",
    hotkey: "Hotkey",
    cli: "CLI",
    speech: "Speech",
    sharing: "Sharing",
    settings: "Settings",
  },
  config: {
    appName: "unbottled.ai",
    folders: {
      private: "Private",
      shared: "Shared",
      public: "Public",
      incognito: "Incognito",
      cron: "Cron",
    },
    foldersShort: {
      private: "Private",
      shared: "Shared",
      public: "Public",
      incognito: "Incognito",
      cron: "Cron",
    },
  },
  enums: {
    role: {
      user: "User",
      assistant: "Assistant",
      system: "System",
      tool: "Tool",
      error: "Error",
    },
    threadStatus: {
      active: "Active",
      archived: "Archived",
      deleted: "Deleted",
    },
    viewMode: {
      linear: "Linear",
      threaded: "Threaded",
      flat: "Flat",
      debug: "Debug",
    },
  },
  components: {
    sidebar: {
      login: "Login",
      logout: "Logout",
      footer: {
        account: "Account",
        profile: "Profile",
        balance: "Balance",
        buy: "Buy",
        freeCreditsLeft: "Free credits",
      },
    },
    credits: {
      credit: "{{count}} credit",
      credits: "{{count}} credits",
    },
    navigation: {
      subscription: "Subscription & Credits",
      referral: "Referral Program",
      help: "Help",
      about: "About",
    },
    confirmations: {
      deleteMessage: "Are you sure you want to delete this message?",
    },
    welcomeTour: {
      authDialog: {
        title: "Unlock Private & Shared Folders",
        description:
          "Sign up or log in to access private and shared folders. Your chats will sync across devices.",
        continueTour: "Continue Tour",
        signUp: "Sign Up / Login",
      },
      buttons: {
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      },
      welcome: {
        title: "Welcome to {{appName}}!",
        description:
          "Your privacy-first AI platform with 40+ models, user-controlled content filtering, and free speech principles.",
        subtitle: "Let's take a quick tour to get you started.",
      },
      aiCompanion: {
        title: "Choose Your AI Companion",
        description:
          "Select from 40+ AI models including mainstream, open-source, and uncensored options.",
        tip: "Click to open the model selector and pick your companion.",
      },
      rootFolders: {
        title: "Your Chat Folders",
        description:
          "Organize your chats in different folders, each with unique privacy settings:",
        private: {
          name: "Private",
          suffix: "— encrypted, only you can see",
        },
        incognito: {
          name: "Incognito",
          suffix: "— no history saved",
        },
        shared: {
          name: "Shared",
          suffix: "— collaborate with others",
        },
        public: {
          name: "Public",
          suffix: "— visible to everyone",
        },
      },
      privateFolder: {
        name: "Private",
        suffix: "Folder",
        description:
          "Your private chats are encrypted and only visible to you. Perfect for sensitive topics.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Chat without saving history. When you close the session, all messages are gone.",
        note: "No data is stored on our servers during incognito sessions.",
      },
      sharedFolder: {
        name: "Shared",
        suffix: "Folder",
        description:
          "Collaborate with specific people by sharing access to this folder.",
      },
      publicFolder: {
        name: "Public",
        suffix: "Folder",
        description:
          "Share your AI conversations with the world. Others can view and fork your threads.",
        note: "Everything in Public is visible to all users and search engines.",
      },
      newChatButton: {
        title: "Start a New Chat",
        description: "Click here to start a fresh conversation in any folder.",
        tip: "You can also use keyboard shortcut Ctrl+K to quickly start a new chat.",
      },
      sidebarLogin: {
        title: "Sign In to Unlock More",
        description:
          "Create a free account to access Private and Shared folders, sync across devices, and save your conversation history.",
        tip: "It's free to sign up! You get 100 free credits to start.",
      },
      subscriptionButton: {
        title: "Credits & Subscription",
        description:
          "Get {{credits}} credits/month with a Pro subscription for just {{price}}.",
        price: "$9.99",
        tip: "Credits are used for AI model interactions. Free users get limited monthly credits.",
      },
      chatInput: {
        title: "Type Your Message",
        description:
          "Type your message here and press Enter or click Send to chat with your AI companion.",
        tip: "Use Shift+Enter for a new line. You can also attach files and images.",
      },
      voiceInput: {
        title: "Voice Input",
        description: "Use your microphone to speak to your AI companion:",
        options: {
          transcribe: "Transcribe speech to text",
          sendAudio: "Send audio directly to the AI",
          pauseResume: "Pause and resume recording",
        },
      },
      callMode: {
        title: "Call Mode",
        description:
          "Enable Call Mode for a hands-free, voice-driven conversation experience with real-time AI responses.",
        tip: "Perfect for when you're on the go or prefer speaking over typing.",
      },
      complete: {
        title: "You're All Set!",
        description:
          "You've completed the tour! Start chatting with your AI companion now.",
        help: "Need help? Click the question mark icon in the sidebar anytime.",
      },
      authUnlocked: {
        unlocked: "Unlocked!",
        privateDescription:
          "Your private folder is now available. All chats here are encrypted and only visible to you.",
        privateNote:
          "Private chats sync across all your devices automatically.",
        sharedDescription:
          "Your shared folder is now available. Invite others to collaborate on AI conversations.",
        sharedNote:
          "You control who has access to your shared folders and threads.",
      },
    },
  },
  selector: {
    loading: "Loading...",
    best: "Best Match",
    free: "FREE",
    creditsSingle: "1 credit",
    creditsExact: "{{cost}} credits",
    modelOnly: "Model Only",
    editModelSettings: "Edit model settings",
    editSettings: "Edit settings",
    switchCharacter: "Switch Character",
    editCharacter: "Edit Character",
    delete: "Delete",
    autoSelectedModel: "AUTO-SELECTED",
    manualSelectedModel: "MANUALLY SELECTED",
    intelligence: "Intelligence",
    contentFilter: "Content",
    maxPrice: "Max Price",
    modelSelection: "Model Selection",
    autoModeDescription: "Best model is selected based on your filters",
    manualModeDescription: "Choose a specific model manually",
    autoMode: "Auto",
    manualMode: "Manual",
    allModelsCount: "All {{count}} models",
    filteredModelsCount: "{{count}} models match filters",
    showFiltered: "Show filtered",
    showAllModels: "Show all models",
    showLess: "Show less",
    showMore: "Show {{remaining}} more",
    showLegacyModels_one: "Show {{count}} Legacy Model",
    showLegacyModels_other: "Show {{count}} Legacy Models",
    noMatchingModels: "No matching models",
    noModelsWarning: "No models match your filters",
    useOnce: "Use Once",
    saveAsDefault: "Add to favorites",
    deleteSetup: "Delete Setup",
    content: "Search content...",
    characterSetup: "Character Setup",
    noResults: "No results",
    add: "Add to favorites",
    added: "Added",
    addNew: "Add New",
    searchCharacters: "Search characters...",
    createCustom: "Create Custom",
    customizeSettings: "Customize Settings",
    requirements: {
      characterConflict: "Character requirement conflicts",
      tooLow: "too low",
      tooHigh: "too high",
      min: "min",
      max: "max",
    },
  },
  common: {
    newChat: "New Chat",
    privateChats: "Private Chats",
    search: "Search",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    settings: "Settings",
    close: "Close",
    toggleSidebar: "Toggle sidebar",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    searchPlaceholder: "Search...",
    searchThreadsPlaceholder: "Search threads...",
    searchResults: "Search Results",
    noChatsFound: "No chats found",
    noThreadsFound: "No threads found",
    enableTTSAutoplay: "Enable TTS Autoplay",
    disableTTSAutoplay: "Disable TTS Autoplay",
    selector: {
      country: "Country",
      language: "Language",
    },
    copyButton: {
      copied: "Copied!",
      copyToClipboard: "Copy to clipboard",
      copyAsMarkdown: "Copy as Markdown",
      copyAsText: "Copy as Text",
    },
    assistantMessageActions: {
      cancelLoading: "Cancel loading",
      stopAudio: "Stop audio",
      playAudio: "Play audio",
      answerAsAI: "Answer as AI model",
      deleteMessage: "Delete message",
    },
    characterSelector: {
      placeholder: "Select character",
      addNewLabel: "Create custom character",
      grouping: {
        bySource: "By Source",
        byCategory: "By Category",
        sourceLabels: {
          builtIn: "Built-in",
          my: "My Characters",
          community: "Community",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Create Custom Character",
        fields: {
          name: {
            label: "Name",
            placeholder: "Enter character name",
          },
          icon: {
            label: "Icon (emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Description",
            placeholder: "Brief description of the character",
          },
          systemPrompt: {
            label: "System Prompt",
            placeholder: "Define how the character behaves...",
          },
          category: {
            label: "Category",
          },
        },
        createCategory: "Create Category",
        cancel: "Cancel",
        create: "Create Character",
      },
      addCategoryDialog: {
        title: "Create Category",
        fields: {
          name: {
            label: "Category Name",
            placeholder: "Enter category name",
          },
          icon: {
            label: "Icon (emoji)",
            placeholder: "📁",
          },
        },
        cancel: "Cancel",
        create: "Create Category",
      },
    },
  },
  actions: {
    newChatInFolder: "New chat in folder",
    newFolder: "New Folder",
    deleteFolder: "Delete Folder",
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
  },
  dialogs: {
    searchAndCreate: "Search & Create",
    deleteChat: 'Delete chat "{{title}}"?',
    deleteFolderConfirm:
      'Delete folder "{{name}}" and move {{count}} chat(s) to General?',
  },
  views: {
    linearView: "Linear view (ChatGPT style)",
    threadedView: "Threaded view (Reddit/Discord style)",
    flatView: "Flat view (4chan style)",
    debugView: "Debug view (with system prompts)",
  },

  screenshot: {
    capturing: "Capturing...",
    capture: "Capture Screenshot",
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
    retryFailed: "Failed to retry",
    answerFailed: "Failed to answer",
    deleteFailed: "Failed to delete",
  },
  errorTypes: {
    streamError: "Stream error",
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
  aiStream: aiStreamTranslations,
  credits: creditsTranslations,
  folders: foldersTranslations,
  memories: memoriesTranslations,
  characters: charactersTranslations,
  favorites: {
    ...favoritesTranslations,
  },
  settings: settingsTranslations,
  threads: {
    ...threadsTranslations,
    messages: messagesTranslations,
  },
  tools: {
    fetchUrl: fetchUrlContentTranslations,
  },
  models: {
    descriptions: {
      uncensoredLmV11:
        "Uncensored AI model for creative and unrestricted conversations",
      freedomgptLiberty:
        "FreedomGPT Liberty - Uncensored AI model focused on free expression and creative content",
      gabAiArya:
        "Gab AI Arya - Uncensored conversational AI model with free expression and creative capabilities",
      gemini3Pro:
        "Google Gemini 3 Pro - Advanced multimodal AI model with large context window and powerful reasoning capabilities",
      gemini3Flash:
        "Google Gemini 3 Flash - Fast, efficient multimodal AI model optimized for quick responses",
      deepseekV32:
        "DeepSeek V3.2 - High-performance reasoning model with advanced coding capabilities",
      gpt52Pro:
        "GPT-5.2 Pro - Advanced OpenAI model with enhanced reasoning and coding capabilities",
      gpt52:
        "GPT-5.2 - High-performance OpenAI model for complex tasks and analysis",
      gpt52_chat:
        "GPT-5.2 Chat - Optimized OpenAI model for conversational interactions",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Uncensored large language model based on Mistral",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Uncensored large language model based on Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Most uncensored AI model with tool calling support. Designed for maximum creative freedom and authentic interaction. Ideal for open-ended exploration, roleplay, and unfiltered dialogue with minimal content restrictions.",
      claudeOpus45:
        "Claude Opus 4.5 - Most powerful Claude model with exceptional reasoning and creative capabilities",
      claudeOpus46:
        "Claude Opus 4.6 - Latest and most powerful Claude model with exceptional reasoning and creative capabilities",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropic's most capable Sonnet-class model with frontier performance across coding, agents, and professional work",
      claudeHaiku45:
        "Claude Haiku 4.5 - Fast and efficient Claude model optimized for speed and cost-effectiveness",
      glm5: "GLM-5 - Z.AI's flagship open-source foundation model engineered for complex systems design and long-horizon agent workflows, rivaling leading closed-source models",
      glm46:
        "GLM-4 6B - Efficient Chinese-English bilingual AI model with strong general capabilities",
      glm47:
        "GLM-4 7B - Advanced Chinese-English bilingual model with improved reasoning and coding abilities",
      glm47Flash:
        "GLM-4 7B Flash - Ultra-fast Chinese-English model optimized for quick responses",
      kimiK2:
        "Kimi K2 - Powerful Chinese AI model with excellent context understanding",
      kimiK2_5:
        "Kimi K2.5 - Enhanced Chinese AI model with improved reasoning and creative capabilities",
      claudeSonnet45:
        "Claude Sonnet 4.5 - Anthropic's previous-generation Sonnet model with strong coding and analytical capabilities",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Autonomous AI agent powered by Claude Sonnet via Anthropic's Agent SDK. Executes tools independently with built-in reasoning.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Fast autonomous AI agent powered by Claude Haiku via Anthropic's Agent SDK. Optimized for speed with tool execution.",
      claudeAgentOpus:
        "Claude Agent Opus - Most powerful autonomous AI agent powered by Claude Opus via Anthropic's Agent SDK. Maximum intelligence with tool execution.",
      grok4:
        "Grok 4 - xAI's flagship reasoning model with vision and web search capabilities",
      grok4Fast:
        "Grok 4 Fast - xAI's high-speed model with 2M token context optimized for quick responses",
      gpt5Pro:
        "GPT-5 Pro - OpenAI's premium model with top-tier reasoning and advanced coding capabilities",
      gpt5Codex:
        "GPT-5 Codex - OpenAI's specialized coding model with exceptional programming and technical capabilities",
      gpt51Codex:
        "GPT 5.1 Codex - Updated OpenAI coding model with improved creative and programming capabilities",
      gpt51:
        "GPT 5.1 - OpenAI's efficient general-purpose model with strong reasoning and analysis",
      gpt5: "GPT-5 - OpenAI's flagship model with broad intelligence and versatile capabilities",
      gpt5Mini:
        "GPT-5 Mini - OpenAI's lightweight fast model for quick everyday tasks",
      gpt5Nano:
        "GPT-5 Nano - OpenAI's smallest and most affordable model for simple conversational tasks",
      gptOss120b:
        "GPT-OSS 120B - OpenAI's open-source 120B parameter model with strong coding capabilities",
      kimiK2Thinking:
        "Kimi K2 Thinking - Kimi's reasoning-focused model with enhanced analytical and step-by-step thinking",
      glm45Air:
        "GLM 4.5 AIR - Z.AI's ultra-fast lightweight model for quick conversational interactions",
      glm45v:
        "GLM 4.5v - Z.AI's vision-capable model with image understanding and chat capabilities",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Google's entry-level Gemini model with large context and fast responses",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Google's efficient multimodal model with 1M token context for fast tasks",
      geminiFlash25Pro:
        "Gemini 2.5 Flash Pro - Google's previous-generation Pro model with large context and strong reasoning",
      deepseekV31:
        "DeepSeek V3.1 - DeepSeek's previous-generation model with strong coding and analysis capabilities",
      deepseekR1:
        "DeepSeek R1 - DeepSeek's reasoning-focused model with advanced step-by-step problem solving",
      qwen3235bFree:
        "Qwen3 235B - Alibaba's large open model with 235B parameters for complex coding and reasoning tasks",
      deepseekR1Distill:
        "DeepSeek R1 Distill - Compact distilled version of DeepSeek R1 with efficient reasoning capabilities",
      qwen257b:
        "Qwen 2.5 7B - Alibaba's compact 7B model for fast and affordable conversational tasks",
    },
  },
  modelUtilities: {
    adultExplicit: "Adult/Explicit Content",
    adultImplied: "Adult/Implied Content",
    analysis: "Analysis",
    chat: "Chat",
    coding: "Coding",
    conspiracy: "Conspiracy Theories",
    controversial: "Controversial Topics",
    creative: "Creative Writing",
    fast: "Fast",
    harmful: "Potentially Harmful Content",
    illegalInfo: "Illegal Information",
    imageGen: "Image Generation",
    legacy: "Legacy",
    medicalAdvice: "Medical Advice",
    offensiveLanguage: "Offensive Language",
    politicalLeft: "Left Political Views",
    politicalRight: "Right Political Views",
    reasoning: "Advanced Reasoning",
    roleplay: "Roleplay",
    roleplayDark: "Dark Roleplay",
    smart: "Smart",
    uncensored: "Uncensored",
    violence: "Violence",
    vision: "Vision",
  },
  input: {
    attachments: {
      uploadFile: "Attach files",
      attachedFiles: "Attached Files",
      addMore: "Add More",
    },
  },
};
