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
    appName: "unbottled.ai",
    folders: {
      private: "Privat",
      shared: "Geteilt",
      public: "Öffentlich",
      incognito: "Inkognito",
      cron: "Cron",
    },
    foldersShort: {
      private: "Privat",
      shared: "Geteilt",
      public: "Öffentlich",
      incognito: "Inkognito",
      cron: "Cron",
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
    credits: {
      credit: "{{count}} Credit",
      credits: "{{count}} Credits",
    },
    navigation: {
      subscription: "Abonnement & Credits",
      referral: "Empfehlungsprogramm",
      help: "Hilfe",
      about: "Über uns",
    },
    confirmations: {
      deleteMessage: "Möchten Sie diese Nachricht wirklich löschen?",
    },
    welcomeTour: {
      authDialog: {
        title: "Private & geteilte Ordner freischalten",
        description:
          "Melden Sie sich an oder erstellen Sie ein Konto, um auf private und geteilte Ordner zuzugreifen. Ihre Chats werden geräteübergreifend synchronisiert.",
        continueTour: "Tour fortsetzen",
        signUp: "Registrieren / Anmelden",
      },
      buttons: {
        back: "Zurück",
        close: "Schließen",
        last: "Fertig",
        next: "Weiter",
        skip: "Überspringen",
      },
      welcome: {
        title: "Willkommen bei {{appName}}!",
        description:
          "Ihre datenschutzorientierte KI-Plattform mit 40+ Modellen, benutzergesteuerter Inhaltsfilterung und freier Meinungsfreiheit.",
        subtitle: "Machen Sie eine kurze Tour, um loszulegen.",
      },
      aiCompanion: {
        title: "Wählen Sie Ihren KI-Begleiter",
        description:
          "Wählen Sie aus 40+ KI-Modellen, darunter Mainstream, Open-Source und zensurfreie Optionen.",
        tip: "Klicken Sie, um den Modellselektor zu öffnen und Ihren Begleiter auszuwählen.",
      },
      rootFolders: {
        title: "Ihre Chat-Ordner",
        description:
          "Organisieren Sie Ihre Chats in verschiedenen Ordnern, jeder mit einzigartigen Datenschutzeinstellungen:",
        private: {
          name: "Privat",
          suffix: "— verschlüsselt, nur Sie können es sehen",
        },
        incognito: {
          name: "Inkognito",
          suffix: "— kein Verlauf gespeichert",
        },
        shared: {
          name: "Geteilt",
          suffix: "— mit anderen zusammenarbeiten",
        },
        public: {
          name: "Öffentlich",
          suffix: "— für alle sichtbar",
        },
      },
      privateFolder: {
        name: "Privat",
        suffix: "Ordner",
        description:
          "Ihre privaten Chats sind verschlüsselt und nur für Sie sichtbar. Perfekt für sensible Themen.",
      },
      incognitoFolder: {
        name: "Inkognito",
        suffix: "Ordner",
        description:
          "Chatten Sie ohne Verlaufsspeicherung. Wenn Sie die Sitzung schließen, sind alle Nachrichten weg.",
        note: "Während Inkognito-Sitzungen werden keine Daten auf unseren Servern gespeichert.",
      },
      sharedFolder: {
        name: "Geteilt",
        suffix: "Ordner",
        description:
          "Arbeiten Sie mit bestimmten Personen zusammen, indem Sie den Zugriff auf diesen Ordner teilen.",
      },
      publicFolder: {
        name: "Öffentlich",
        suffix: "Ordner",
        description:
          "Teilen Sie Ihre KI-Gespräche mit der Welt. Andere können Ihre Threads ansehen und forken.",
        note: "Alles im öffentlichen Bereich ist für alle Benutzer und Suchmaschinen sichtbar.",
      },
      newChatButton: {
        title: "Einen neuen Chat starten",
        description:
          "Klicken Sie hier, um ein neues Gespräch in einem beliebigen Ordner zu starten.",
        tip: "Sie können auch den Tastaturkürzel Strg+K verwenden, um schnell einen neuen Chat zu starten.",
      },
      sidebarLogin: {
        title: "Anmelden, um mehr freizuschalten",
        description:
          "Erstellen Sie ein kostenloses Konto, um auf private und geteilte Ordner zuzugreifen, geräteübergreifend zu synchronisieren und Ihren Gesprächsverlauf zu speichern.",
        tip: "Die Registrierung ist kostenlos! Sie erhalten 100 kostenlose Credits zum Starten.",
      },
      subscriptionButton: {
        title: "Credits & Abonnement",
        description:
          "Erhalten Sie {{credits}} Credits/Monat mit einem Pro-Abonnement für nur {{price}}.",
        price: "9,99 €",
        tip: "Credits werden für KI-Modellinteraktionen verwendet. Kostenlose Benutzer erhalten begrenzte monatliche Credits.",
      },
      chatInput: {
        title: "Ihre Nachricht eingeben",
        description:
          "Geben Sie Ihre Nachricht hier ein und drücken Sie Enter oder klicken Sie Senden, um mit Ihrem KI-Begleiter zu chatten.",
        tip: "Verwenden Sie Umschalt+Enter für eine neue Zeile. Sie können auch Dateien und Bilder anhängen.",
      },
      voiceInput: {
        title: "Spracheingabe",
        description:
          "Verwenden Sie Ihr Mikrofon, um mit Ihrem KI-Begleiter zu sprechen:",
        options: {
          transcribe: "Sprache in Text transkribieren",
          sendAudio: "Audio direkt an die KI senden",
          pauseResume: "Aufnahme pausieren und fortsetzen",
        },
      },
      callMode: {
        title: "Anrufmodus",
        description:
          "Aktivieren Sie den Anrufmodus für ein freihändiges, sprachgesteuertes Gesprächserlebnis mit Echtzeit-KI-Antworten.",
        tip: "Perfekt für unterwegs oder wenn Sie lieber sprechen als tippen.",
      },
      complete: {
        title: "Alles erledigt!",
        description:
          "Sie haben die Tour abgeschlossen! Beginnen Sie jetzt, mit Ihrem KI-Begleiter zu chatten.",
        help: "Brauchen Sie Hilfe? Klicken Sie jederzeit auf das Fragezeichen-Symbol in der Seitenleiste.",
      },
      authUnlocked: {
        unlocked: "Freigeschaltet!",
        privateDescription:
          "Ihr privater Ordner ist jetzt verfügbar. Alle Chats hier sind verschlüsselt und nur für Sie sichtbar.",
        privateNote:
          "Private Chats werden automatisch auf allen Ihren Geräten synchronisiert.",
        sharedDescription:
          "Ihr geteilter Ordner ist jetzt verfügbar. Laden Sie andere ein, an KI-Gesprächen zusammenzuarbeiten.",
        sharedNote:
          "Sie kontrollieren, wer Zugang zu Ihren geteilten Ordnern und Threads hat.",
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
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropics leistungsfähigstes Sonnet-Modell mit frontier-Leistung in Coding, Agenten und professioneller Arbeit",
      claudeHaiku45:
        "Claude Haiku 4.5 - Schnelles und effizientes Claude-Modell optimiert für Geschwindigkeit und Kosteneffizienz",
      glm5: "GLM-5 - Z.AIs Flaggschiff-Open-Source-Basismodell für komplexes Systemdesign und langfristige Agenten-Workflows, vergleichbar mit führenden Closed-Source-Modellen",
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
      claudeSonnet45:
        "Claude Sonnet 4.5 - Anthropics Vorgänger-Sonnet-Modell mit starken Coding- und Analysefähigkeiten",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Autonomer KI-Agent mit Claude Sonnet über Anthropics Agent SDK. Führt Tools selbstständig mit integriertem Reasoning aus.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Schneller autonomer KI-Agent mit Claude Haiku über Anthropics Agent SDK. Optimiert für Geschwindigkeit mit Tool-Ausführung.",
      claudeAgentOpus:
        "Claude Agent Opus - Leistungsstärkster autonomer KI-Agent mit Claude Opus über Anthropics Agent SDK. Maximale Intelligenz mit Tool-Ausführung.",
      grok4:
        "Grok 4 - xAIs Flaggschiff-Reasoning-Modell mit Vision- und Web-Suchfähigkeiten",
      grok4Fast:
        "Grok 4 Fast - xAIs Hochgeschwindigkeitsmodell mit 2M-Token-Kontext optimiert für schnelle Antworten",
      gpt5Pro:
        "GPT-5 Pro - OpenAIs Premium-Modell mit erstklassigem Reasoning und fortgeschrittenen Coding-Fähigkeiten",
      gpt5Codex:
        "GPT-5 Codex - OpenAIs spezialisiertes Coding-Modell mit außergewöhnlichen Programmier- und technischen Fähigkeiten",
      gpt51Codex:
        "GPT 5.1 Codex - Aktualisiertes OpenAI-Coding-Modell mit verbesserten kreativen und Programmierfähigkeiten",
      gpt51:
        "GPT 5.1 - OpenAIs effizientes Allzweck-Modell mit starkem Reasoning und Analyse",
      gpt5: "GPT-5 - OpenAIs Flaggschiff-Modell mit breiter Intelligenz und vielseitigen Fähigkeiten",
      gpt5Mini:
        "GPT-5 Mini - OpenAIs leichtes schnelles Modell für schnelle alltägliche Aufgaben",
      gpt5Nano:
        "GPT-5 Nano - OpenAIs kleinstes und günstigstes Modell für einfache Konversationsaufgaben",
      gptOss120b:
        "GPT-OSS 120B - OpenAIs Open-Source-120B-Parameter-Modell mit starken Coding-Fähigkeiten",
      kimiK2Thinking:
        "Kimi K2 Thinking - Kimis Reasoning-fokussiertes Modell mit verbessertem analytischem und schrittweisem Denken",
      glm45Air:
        "GLM 4.5 AIR - Z.AIs ultraschnelles leichtgewichtiges Modell für schnelle Konversationsinteraktionen",
      glm45v:
        "GLM 4.5v - Z.AIs Vision-fähiges Modell mit Bildverständnis und Chat-Fähigkeiten",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Googles Einstiegs-Gemini-Modell mit großem Kontext und schnellen Antworten",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Googles effizientes multimodales Modell mit 1M-Token-Kontext für schnelle Aufgaben",
      geminiFlash25Pro:
        "Gemini 2.5 Flash Pro - Googles Vorgänger-Pro-Modell mit großem Kontext und starkem Reasoning",
      deepseekV31:
        "DeepSeek V3.1 - DeepSeeks Vorgänger-Modell mit starken Coding- und Analysefähigkeiten",
      deepseekR1:
        "DeepSeek R1 - DeepSeeks Reasoning-fokussiertes Modell mit fortgeschrittenem schrittweisem Problemlösen",
      qwen3235bFree:
        "Qwen3 235B - Alibabas großes offenes Modell mit 235B Parametern für komplexe Coding- und Reasoning-Aufgaben",
      deepseekR1Distill:
        "DeepSeek R1 Distill - Kompakte destillierte Version von DeepSeek R1 mit effizienten Reasoning-Fähigkeiten",
      qwen257b:
        "Qwen 2.5 7B - Alibabas kompaktes 7B-Modell für schnelle und günstige Konversationsaufgaben",
    },
  },
  modelUtilities: {
    adultExplicit: "Explizite Erwachseneninhalte",
    adultImplied: "Angedeutete Erwachseneninhalte",
    analysis: "Analyse",
    chat: "Chat",
    coding: "Programmierung",
    conspiracy: "Verschwörungstheorien",
    controversial: "Kontroverse Themen",
    creative: "Kreatives Schreiben",
    fast: "Schnell",
    harmful: "Potenziell schädliche Inhalte",
    illegalInfo: "Illegale Informationen",
    imageGen: "Bildgenerierung",
    legacy: "Veraltet",
    medicalAdvice: "Medizinische Beratung",
    offensiveLanguage: "Beleidigende Sprache",
    politicalLeft: "Linke politische Ansichten",
    politicalRight: "Rechte politische Ansichten",
    reasoning: "Fortgeschrittenes Denkvermögen",
    roleplay: "Rollenspiel",
    roleplayDark: "Dunkles Rollenspiel",
    smart: "Intelligent",
    uncensored: "Unzensiert",
    violence: "Gewalt",
    vision: "Bildverarbeitung",
  },
  input: {
    attachments: {
      uploadFile: "Dateien anhängen",
      attachedFiles: "Angehängte Dateien",
      addMore: "Mehr hinzufügen",
    },
  },
};
