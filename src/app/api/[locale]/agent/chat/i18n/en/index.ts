import { translations as creditsTranslations } from "../../../../credits/i18n/en";
import { translations as aiStreamTranslations } from "../../../ai-stream/i18n/en";
import { translations as braveSearchTranslations } from "../../../brave-search/i18n/en";
import { translations as foldersTranslations } from "../../folders/i18n/en";
import { translations as memoriesTranslations } from "../../memories/i18n/en";
import { translations as personasTranslations } from "../../personas/i18n/en";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/en";
import { translations as threadsTranslations } from "../../threads/i18n/en";

export const translations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Folders",
    messages: "Messages",
    personas: "Personas",
    memories: "Memories",
    credits: "Credits",
    balance: "Balance",
    permissions: "Permissions",
    hotkey: "Hotkey",
    cli: "CLI",
    speech: "Speech",
  },
  config: {
    folders: {
      private: "Private",
      shared: "Shared",
      public: "Public",
      incognito: "Incognito",
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
  common: {
    newChat: "New Chat",
    privateChats: "Private Chats",
    search: "Search",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    settings: "Settings",
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
    personaSelector: {
      placeholder: "Select persona",
      addNewLabel: "Create custom persona",
      grouping: {
        bySource: "By Source",
        byCategory: "By Category",
        sourceLabels: {
          builtIn: "Built-in",
          my: "My Personas",
          community: "Community",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Create Custom Persona",
        fields: {
          name: {
            label: "Name",
            placeholder: "Enter persona name",
          },
          icon: {
            label: "Icon (emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Description",
            placeholder: "Brief description of the persona",
          },
          systemPrompt: {
            label: "System Prompt",
            placeholder: "Define how the persona behaves...",
          },
          category: {
            label: "Category",
          },
          suggestedPrompts: {
            label: "Suggested Prompts (optional)",
            description: "Add up to 4 example prompts to help users get started",
            placeholder: "Example prompt {{number}}",
          },
        },
        createCategory: "Create Category",
        cancel: "Cancel",
        create: "Create Persona",
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
    retry: "Retry with different model/persona",
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
  personas: personasTranslations,
  threads: {
    ...threadsTranslations,
    messages: messagesTranslations,
  },
  tools: {
    braveSearch: braveSearchTranslations,
  },
  models: {
    descriptions: {
      uncensoredLmV11:
        "Uncensored AI model for creative and unrestricted conversations",
      freedomgptLiberty:
        "FreedomGPT Liberty - Uncensored AI model focused on free expression and creative content",
      gabAiArya:
        "Gab AI Arya - Uncensored conversational AI model with free expression and creative capabilities",
    },
  },
};
