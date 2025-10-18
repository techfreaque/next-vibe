import { translations as aiStreamTranslations } from "../../ai-stream/i18n/en";
import { translations as creditsTranslations } from "../../credits/i18n/en";
import { translations as foldersTranslations } from "../../folders/i18n/en";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/en";
import { translations as threadsTranslations } from "../../threads/i18n/en";

export const translations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Folders",
    messages: "Messages",
    credits: "Credits",
    balance: "Balance",
  },
  enums: {
    role: {
      user: "User",
      assistant: "Assistant",
      system: "System",
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
  threads: {
    ...threadsTranslations,
    messages: messagesTranslations,
  },
};
