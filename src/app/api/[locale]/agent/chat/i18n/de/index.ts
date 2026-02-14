import { translations as creditsTranslations } from "../../../../credits/i18n/de";
import { translations as aiStreamTranslations } from "../../../ai-stream/i18n/de";
import { translations as fetchUrlContentTranslations } from "../../../fetch-url-content/i18n/de";
import { translations as charaktersTranslations } from "../../characters/i18n/de";
import { translations as favoritesTranslations } from "../../favorites/i18n/de";
import { translations as filesTranslations } from "../../files/[threadId]/[filename]/i18n/de";
import { translations as foldersTranslations } from "../../folders/i18n/de";
import { translations as memoriesTranslations } from "../../memories/i18n/de";
import { translations as settingsTranslations } from "../../settings/i18n/de";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/de";
import { translations as threadsTranslations } from "../../threads/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Threads",
    folders: "Ordner",
    files: "Dateien",
    messages: "Nachrichten",
    characters: "Charaktere",
    memories: "Erinnerungen",
    favorites: "Favoriten",
    credits: "Credits",
    balance: "Guthaben",
    permissions: "Berechtigungen",
    hotkey: "Hotkey",
    cli: "CLI",
    speech: "Sprache",
    sharing: "Teilen",
    settings: "Einstellungen",
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
  components: {
    sidebar: {
      login: "Anmelden",
      logout: "Abmelden",
      footer: {
        account: "Konto",
        profile: "Profil",
        balance: "Guthaben",
        buy: "Kaufen",
        freeCreditsLeft: "Kostenlose Credits",
      },
    },
  },
  selector: {
    loading: "Laden...",
    best: "Beste Übereinstimmung",
    free: "KOSTENLOS",
    creditsSingle: "1 Credit",
    creditsExact: "{{cost}} Credits",
    modelOnly: "Nur Modell",
    editModelSettings: "Modelleinstellungen bearbeiten",
    editSettings: "Einstellungen bearbeiten",
    switchCharacter: "Charakter wechseln",
    editCharacter: "Charakter bearbeiten",
    delete: "Löschen",
    autoSelectedModel: "AUTO-AUSGEWÄHLT",
    manualSelectedModel: "MANUELL AUSGEWÄHLT",
    intelligence: "Intelligenz",
    contentFilter: "Inhalt",
    maxPrice: "Maximalpreis",
    modelSelection: "Modellauswahl",
    autoModeDescription:
      "Bestes Modell wird basierend auf Ihren Filtern ausgewählt",
    manualModeDescription: "Wählen Sie ein bestimmtes Modell manuell aus",
    autoMode: "Auto",
    manualMode: "Manuell",
    allModelsCount: "Alle {{count}} Modelle",
    filteredModelsCount: "{{count}} Modelle entsprechen den Filtern",
    showFiltered: "Gefilterte anzeigen",
    showAllModels: "Alle Modelle anzeigen",
    showLess: "Weniger anzeigen",
    showMore: "{{remaining}} weitere anzeigen",
    showLegacyModels_one: "{{count}} Legacy-Modell anzeigen",
    showLegacyModels_other: "{{count}} Legacy-Modelle anzeigen",
    noMatchingModels: "Keine passenden Modelle",
    noModelsWarning: "Keine Modelle entsprechen Ihren Filtern",
    useOnce: "Einmal verwenden",
    saveAsDefault: "Zu Favoriten hinzufügen",
    deleteSetup: "Setup löschen",
    content: "Inhalte durchsuchen...",
    characterSetup: "Charakter-Setup",
    noResults: "Keine Ergebnisse",
    add: "Zu Favoriten hinzufügen",
    added: "Hinzugefügt",
    addNew: "Neu hinzufügen",
    searchCharacters: "Charaktere suchen...",
    createCustom: "Benutzerdefiniert erstellen",
    customizeSettings: "Einstellungen anpassen",
    requirements: {
      characterConflict: "Charakter-Anforderungskonflikte",
      tooLow: "zu niedrig",
      tooHigh: "zu hoch",
      min: "min",
      max: "max",
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
    close: "Schließen",
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
    characterSelector: {
      placeholder: "Charakter auswählen",
      addNewLabel: "Benutzerdefinierte Charakter erstellen",
      grouping: {
        bySource: "Nach Quelle",
        byCategory: "Nach Kategorie",
        sourceLabels: {
          builtIn: "Integriert",
          my: "Meine Charakters",
          community: "Community",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Benutzerdefinierte Charakter erstellen",
        fields: {
          name: {
            label: "Name",
            placeholder: "Charakter-Name eingeben",
          },
          icon: {
            label: "Symbol (Emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Beschreibung",
            placeholder: "Kurze Beschreibung der Charakter",
          },
          systemPrompt: {
            label: "System-Prompt",
            placeholder: "Definieren Sie, wie sich die Charakter verhält...",
          },
          category: {
            label: "Kategorie",
          },
        },
        createCategory: "Kategorie erstellen",
        cancel: "Abbrechen",
        create: "Charakter erstellen",
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
    retry: "Mit anderem Modell/Charakter wiederholen",
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
  files: filesTranslations,
  folders: foldersTranslations,
  memories: memoriesTranslations,
  characters: charaktersTranslations,
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
        "Unzensiertes KI-Modell für kreative und uneingeschränkte Konversationen",
      freedomgptLiberty:
        "FreedomGPT Liberty - Unzensiertes KI-Modell mit Fokus auf freie Meinungsäußerung und kreative Inhalte",
      gabAiArya:
        "Gab AI Arya - Unzensiertes Konversations-KI-Modell mit freier Meinungsäußerung und kreativen Fähigkeiten",
      gemini3Pro:
        "Google Gemini 3 Pro - Fortgeschrittenes multimodales KI-Modell mit großem Kontextfenster und leistungsstarken Reasoning-Fähigkeiten",
      gemini3Flash:
        "Google Gemini 3 Flash - Schnelles, effizientes multimodales KI-Modell optimiert für schnelle Antworten",
      deepseekV32:
        "DeepSeek V3.2 - Hochleistungs-Reasoning-Modell mit erweiterten Coding-Fähigkeiten",
      gpt52Pro:
        "GPT-5.2 Pro - Fortgeschrittenes OpenAI-Modell mit verbessertem Reasoning und Coding-Fähigkeiten",
      gpt52:
        "GPT-5.2 - Hochleistungs-OpenAI-Modell für komplexe Aufgaben und Analyse",
      gpt52_chat:
        "GPT-5.2 Chat - Optimiertes OpenAI-Modell für Konversationsinteraktionen",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Unzensiertes großes Sprachmodell basierend auf Mistral",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Unzensiertes großes Sprachmodell basierend auf Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Das unzensierteste KI-Modell mit Tool-Calling-Unterstützung. Entwickelt für maximale kreative Freiheit und authentische Interaktion. Ideal für offene Erkundung, Rollenspiele und ungefilterten Dialog mit minimalen Inhaltsbeschränkungen.",
      claudeOpus45:
        "Claude Opus 4.5 - Leistungsstärkstes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
      claudeOpus46:
        "Claude Opus 4.6 - Neuestes und leistungsstärkstes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
      claudeHaiku45:
        "Claude Haiku 4.5 - Schnelles und effizientes Claude-Modell optimiert für Geschwindigkeit und Kosteneffizienz",
      glm46:
        "GLM-4 6B - Effizientes chinesisch-englisches bilinguales KI-Modell mit starken allgemeinen Fähigkeiten",
      glm47:
        "GLM-4 7B - Fortgeschrittenes chinesisch-englisches bilinguales Modell mit verbesserten Reasoning- und Coding-Fähigkeiten",
      glm47Flash:
        "GLM-4 7B Flash - Ultraschnelles chinesisch-englisches Modell optimiert für schnelle Antworten",
      kimiK2:
        "Kimi K2 - Leistungsstarkes chinesisches KI-Modell mit ausgezeichnetem Kontextverständnis",
      kimiK2_5:
        "Kimi K2.5 - Erweitertes chinesisches KI-Modell mit verbesserten Reasoning- und kreativen Fähigkeiten",
    },
  },
  modelUtilities: {
    adultExplicit: "Explizite Erwachseneninhalte",
    adultImplied: "Angedeutete Erwachseneninhalte",
    conspiracy: "Verschwörungstheorien",
    harmful: "Potenziell schädliche Inhalte",
    illegalInfo: "Illegale Informationen",
    medicalAdvice: "Medizinische Beratung",
    offensiveLanguage: "Beleidigende Sprache",
    politicalLeft: "Linke politische Ansichten",
    politicalRight: "Rechte politische Ansichten",
    reasoning: "Fortgeschrittenes Denkvermögen",
    roleplay: "Rollenspiel",
    roleplayDark: "Dunkles Rollenspiel",
    violence: "Gewalt",
  },
  input: {
    attachments: {
      uploadFile: "Dateien anhängen",
      attachedFiles: "Angehängte Dateien",
      addMore: "Mehr hinzufügen",
    },
  },
};
