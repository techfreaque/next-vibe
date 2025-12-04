import { translations as creditsTranslations } from "../../../../credits/i18n/de";
import { translations as aiStreamTranslations } from "../../../ai-stream/i18n/de";
import { translations as braveSearchTranslations } from "../../../brave-search/i18n/de";
import { translations as foldersTranslations } from "../../folders/i18n/de";
import { translations as memoriesTranslations } from "../../memories/i18n/de";
import { translations as personasTranslations } from "../../personas/i18n/de";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/de";
import { translations as threadsTranslations } from "../../threads/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Ordner",
    messages: "Nachrichten",
    personas: "Personas",
    memories: "Erinnerungen",
    credits: "Credits",
    balance: "Guthaben",
    permissions: "Berechtigungen",
    hotkey: "Hotkey",
    cli: "CLI",
    speech: "Sprache",
  },
  config: {
    folders: {
      private: "Privat",
      shared: "Geteilt",
      public: "Öffentlich",
      incognito: "Inkognito",
    },
  },
  enums: {
    role: {
      user: "Benutzer",
      assistant: "Assistent",
      system: "System",
      tool: "Werkzeug",
      error: "Fehler",
    },
    threadStatus: {
      active: "Aktiv",
      archived: "Archiviert",
      deleted: "Gelöscht",
    },
    viewMode: {
      linear: "Linear",
      threaded: "Threaded",
      flat: "Flach",
      debug: "Debug",
    },
  },
  common: {
    newChat: "Neuer Chat",
    privateChats: "Private Chats",
    search: "Suchen",
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    edit: "Bearbeiten",
    settings: "Einstellungen",
    toggleSidebar: "Seitenleiste umschalten",
    lightMode: "Heller Modus",
    darkMode: "Dunkler Modus",
    searchPlaceholder: "Suchen...",
    searchThreadsPlaceholder: "Threads durchsuchen...",
    searchResults: "Suchergebnisse",
    noChatsFound: "Keine Chats gefunden",
    noThreadsFound: "Keine Threads gefunden",
    enableTTSAutoplay: "TTS-Autoplay aktivieren",
    disableTTSAutoplay: "TTS-Autoplay deaktivieren",
    selector: {
      country: "Land",
      language: "Sprache",
    },
    copyButton: {
      copied: "Kopiert!",
      copyToClipboard: "In Zwischenablage kopieren",
      copyAsMarkdown: "Als Markdown kopieren",
      copyAsText: "Als Text kopieren",
    },
    assistantMessageActions: {
      cancelLoading: "Laden abbrechen",
      stopAudio: "Audio stoppen",
      playAudio: "Audio abspielen",
      answerAsAI: "Als KI-Modell antworten",
      deleteMessage: "Nachricht löschen",
    },
    personaSelector: {
      placeholder: "Persona auswählen",
      addNewLabel: "Benutzerdefinierte Persona erstellen",
      grouping: {
        bySource: "Nach Quelle",
        byCategory: "Nach Kategorie",
        sourceLabels: {
          builtIn: "Integriert",
          my: "Meine Personas",
          community: "Community",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Benutzerdefinierte Persona erstellen",
        fields: {
          name: {
            label: "Name",
            placeholder: "Persona-Name eingeben",
          },
          icon: {
            label: "Symbol (Emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Beschreibung",
            placeholder: "Kurze Beschreibung der Persona",
          },
          systemPrompt: {
            label: "System-Prompt",
            placeholder: "Definieren Sie, wie sich die Persona verhält...",
          },
          category: {
            label: "Kategorie",
          },
          suggestedPrompts: {
            label: "Vorgeschlagene Prompts (optional)",
            description: "Fügen Sie bis zu 4 Beispiel-Prompts hinzu, um Benutzern den Einstieg zu erleichtern",
            placeholder: "Beispiel-Prompt {{number}}",
          },
        },
        createCategory: "Kategorie erstellen",
        cancel: "Abbrechen",
        create: "Persona erstellen",
      },
      addCategoryDialog: {
        title: "Kategorie erstellen",
        fields: {
          name: {
            label: "Kategoriename",
            placeholder: "Kategorienamen eingeben",
          },
          icon: {
            label: "Symbol (Emoji)",
            placeholder: "📁",
          },
        },
        cancel: "Abbrechen",
        create: "Kategorie erstellen",
      },
    },
  },
  actions: {
    newChatInFolder: "Neuer Chat im Ordner",
    newFolder: "Neuer Ordner",
    deleteFolder: "Ordner löschen",
    deleteMessage: "Nachricht löschen",
    deleteThisMessage: "Diese Nachricht löschen",
    searchEnabled: "Suche aktiviert",
    searchDisabled: "Suche deaktiviert",
    answerAsAI: "Als KI-Modell antworten",
    retry: "Mit anderem Modell/Persona wiederholen",
    branch: "Konversation von hier abzweigen",
    editMessage: "Nachricht bearbeiten",
    stopAudio: "Audio-Wiedergabe stoppen",
    playAudio: "Audio abspielen",
    copyContent: "In Zwischenablage kopieren",
  },
  dialogs: {
    searchAndCreate: "Suchen & Erstellen",
    deleteChat: 'Chat "{{title}}" löschen?',
    deleteFolderConfirm:
      'Ordner "{{name}}" löschen und {{count}} Chat(s) nach Allgemein verschieben?',
  },
  views: {
    linearView: "Lineare Ansicht (ChatGPT-Stil)",
    threadedView: "Thread-Ansicht (Reddit/Discord-Stil)",
    flatView: "Flache Ansicht (4chan-Stil)",
    debugView: "Debug-Ansicht (mit Systemprompts)",
  },
  screenshot: {
    capturing: "Erfassen...",
    capture: "Screenshot aufnehmen",
    failed: "Screenshot konnte nicht aufgenommen werden",
    failedWithMessage:
      "Screenshot konnte nicht aufgenommen werden: {{message}}",
    tryAgain:
      "Screenshot konnte nicht aufgenommen werden. Bitte versuchen Sie es erneut.",
    noMessages:
      "Chat-Nachrichtenbereich konnte nicht gefunden werden. Bitte stellen Sie sicher, dass Sie Nachrichten im Chat haben.",
    quotaExceeded: "Speicherplatz überschritten. Screenshot ist zu groß.",
    canvasError: "Fehler beim Konvertieren des Screenshots in Bildformat.",
  },
  errors: {
    noResponse:
      "Keine Antwort von der KI erhalten. Die Anfrage wurde abgeschlossen, gab aber leeren Inhalt zurück. Bitte versuchen Sie es erneut.",
    noStream: "Fehler beim Streamen der Antwort: Kein Reader verfügbar",
    saveFailed: "Fehler beim Speichern der Bearbeitung",
    branchFailed: "Fehler beim Abzweigen",
    retryFailed: "Fehler beim Wiederholen",
    answerFailed: "Fehler beim Antworten",
    deleteFailed: "Fehler beim Löschen",
  },
  errorTypes: {
    streamError: "Stream-Fehler",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Sprache-zu-Text-Endpunkt nicht verfügbar",
      "failed-to-start": "Fehler beim Starten der Aufnahme",
      "permission-denied": "Mikrofon-Berechtigung verweigert",
      "no-microphone": "Kein Mikrofon gefunden",
      "microphone-in-use": "Mikrofon wird verwendet",
      "transcription-failed": "Fehler beim Transkribieren des Audios",
    },
    tts: {
      "endpoint-not-available": "Text-zu-Sprache-Endpunkt nicht verfügbar",
      "failed-to-play": "Fehler beim Abspielen des Audios",
      "conversion-failed": "TTS-Konvertierung fehlgeschlagen",
      "failed-to-generate": "Fehler beim Generieren des Audios",
    },
  },
  post: {
    title: "Chat",
    description: "Chat-Oberfläche",
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
        "Unzensiertes KI-Modell für kreative und uneingeschränkte Konversationen",
      freedomgptLiberty:
        "FreedomGPT Liberty - Unzensiertes KI-Modell mit Fokus auf freie Meinungsäußerung und kreative Inhalte",
      gabAiArya:
        "Gab AI Arya - Unzensiertes Konversations-KI-Modell mit freier Meinungsäußerung und kreativen Fähigkeiten",
    },
  },
};
