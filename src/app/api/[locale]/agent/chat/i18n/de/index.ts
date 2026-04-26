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
      background: "Hintergrund",
      support: "Support",
    },
    foldersShort: {
      private: "Privat",
      shared: "Geteilt",
      public: "Öffentlich",
      incognito: "Inkognito",
      background: "Hintergrund",
      support: "Support",
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
          "Ihre datenschutzorientierte KI-Plattform mit {{modelCount}} Modellen, benutzergesteuerter Inhaltsfilterung und freier Meinungsfreiheit.",
        subtitle: "Machen Sie eine kurze Tour, um loszulegen.",
      },
      aiCompanion: {
        title: "Wählen Sie Ihren KI-Begleiter",
        description:
          "Wählen Sie aus {{modelCount}} KI-Modellen, darunter Mainstream, Open-Source und zensurfreie Optionen.",
        tip: "Klicken Sie, um den Modellselektor zu öffnen und Ihren Begleiter auszuwählen.",
      },
      rootFolders: {
        title: "Ihre Chat-Ordner",
        description:
          "Organisieren Sie Ihre Chats in verschiedenen Ordnern, jeder mit einzigartigen Datenschutzeinstellungen:",
        private: {
          name: "Privat",
          suffix: "— nur Sie können es sehen",
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
          "Ihre privaten Chats sind nur für Sie sichtbar. Perfekt für sensible Themen.",
      },
      incognitoFolder: {
        name: "Inkognito",
        suffix: "Ordner",
        description:
          "Chatten Sie ohne Speicherung auf dem Server. Nachrichten werden lokal in Ihrem Browser gespeichert und bleiben erhalten, bis Sie sie löschen.",
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
      },
      sidebarLogin: {
        title: "Anmelden, um mehr freizuschalten",
        description:
          "Erstellen Sie ein kostenloses Konto, um auf private und geteilte Ordner zuzugreifen, geräteübergreifend zu synchronisieren und die KI Dinge über Sie merken zu lassen.",
        tip: "Die Registrierung ist kostenlos!",
      },
      subscriptionButton: {
        title: "Credits & Abonnement",
        description:
          "Erhalten Sie {{credits}} Credits/Monat mit einem Abonnement für nur {{price}}/Monat. Kostenlose Nutzer erhalten {{freeCredits}} Credits/Monat.",
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
          "Ihr privater Ordner ist jetzt verfügbar. Alle Chats hier sind nur für Sie sichtbar.",
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
    switchSkill: "Charakter wechseln",
    editSkill: "Charakter bearbeiten",
    delete: "Löschen",
    autoSelectedModel: "FILTERBASIERT",
    manualSelectedModel: "MANUELL AUSGEWÄHLT",
    intelligence: "Intelligenz",
    contentFilter: "Inhalt",
    maxPrice: "Maximalpreis",
    modelSelection: "Modellauswahl",
    autoModeDescription:
      "Bestes Modell wird basierend auf Ihren Filtern ausgewählt",
    manualModeDescription: "Wählen Sie ein bestimmtes Modell manuell aus",
    autoMode: "Filterbasiert",
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
    searchSkills: "Charaktere suchen...",
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
      "permission-denied":
        "Mikrofon-Zugriff blockiert. Erlaube das Mikrofon in den Browser-Einstellungen und lade die Seite neu.",
      "permission-denied-ios":
        "Mikrofon blockiert. Gehe zu Einstellungen → Safari → Mikrofon und erlaube den Zugriff für diese Seite.",
      "permission-denied-android":
        "Mikrofon blockiert. Tippe auf das Schloss-Symbol in der Adressleiste → Website-Einstellungen → Mikrofon → Zulassen.",
      "permission-denied-mac":
        "Mikrofon blockiert. Öffne Systemeinstellungen → Datenschutz & Sicherheit → Mikrofon und aktiviere deinen Browser.",
      "permission-denied-windows":
        "Mikrofon blockiert. Öffne Einstellungen → Datenschutz → Mikrofon und stelle sicher, dass dein Browser zugelassen ist.",
      "no-microphone":
        "Kein Mikrofon gefunden. Schließe ein Mikrofon oder Headset an und versuche es erneut.",
      "microphone-in-use":
        "Dein Mikrofon wird von einer anderen App verwendet. Schließe sie und versuche es erneut.",
      "not-supported":
        "Dein Browser unterstützt keinen Mikrofon-Zugriff. Versuche Chrome, Firefox oder Safari.",
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
  models: {
    descriptions: {
      uncensoredLmV11:
        "Unzensiertes KI-Modell für kreative und uneingeschränkte Konversationen",
      freedomgptLiberty:
        "FreedomGPT Liberty - Unzensiertes KI-Modell mit Fokus auf freie Meinungsäußerung und kreative Inhalte",
      gabAiArya:
        "Gab AI Arya - Unzensiertes Konversations-KI-Modell mit freier Meinungsäußerung und kreativen Fähigkeiten",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools) - Gemini-3.1-Pro-Variante mit verbesserter Werkzeugauswahl für Coding-Agenten und komplexe Multi-Tool-Workflows",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Googles multimodales Modell, das Bilder direkt aus Textprompts generiert und Text- sowie Bildausgabe in einem Gespräch unterstützt",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview - Googles hocheffizienztes Modell für Hochvolumen-Anwendungen mit Verbesserungen bei Audio, RAG-Ranking, Übersetzung und Code-Vervollständigung",
      gemini3Pro:
        "Google Gemini 3 Pro - Fortgeschrittenes multimodales KI-Modell mit großem Kontextfenster und leistungsstarken Reasoning-Fähigkeiten",
      gemini3Flash:
        "Google Gemini 3 Flash - Schnelles, effizientes multimodales KI-Modell optimiert für schnelle Antworten",
      deepseekV32:
        "DeepSeek V3.2 - Hochleistungs-Reasoning-Modell mit erweiterten Coding-Fähigkeiten",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1,6T Parameter MoE-Modell mit 1M Kontext. Für komplette Codebase-Analysen, komplexes Denken und mehrstufige Agenten-Workflows.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - 284B MoE zu minimalem Preis. 1M Kontext, schnelle Inferenz, starkes Coding. Die effiziente Wahl für leistungsstarke Workloads.",
      gpt55:
        "GPT-5.5 - OpenAIs Frontier-Modell für komplexe Profi-Workloads. Stärkeres Reasoning, höhere Zuverlässigkeit, bessere Token-Effizienz. 1M+ Kontext mit Text- und Bildeingaben.",
      gpt55Pro:
        "GPT-5.5 Pro - OpenAIs leistungsstärkstes Modell für tiefes Reasoning bei komplexen Hochrisiko-Aufgaben. 1M+ Kontext, langfristiges Problemlösen, agentisches Coding, präzise Mehrschritt-Ausführung.",
      gpt54Pro:
        "GPT-5.4 Pro - OpenAIs fortschrittlichstes Modell mit erweitertem Reasoning, 1M+ Kontextfenster und überlegener Leistung für komplexe Aufgaben",
      gpt54:
        "GPT-5.4 - OpenAIs neuestes Frontier-Modell, das Codex und GPT vereint, mit 1M+ Kontextfenster für kontextreiche Analyse und Codierung",
      gpt53Codex:
        "GPT-5.3-Codex - OpenAIs fortschrittlichstes agentisches Coding-Modell für lang laufende Tool-Workflows und komplexe Entwicklungsaufgaben",
      gpt53Chat:
        "GPT-5.3 Chat - Aktualisiertes ChatGPT-Konversationsmodell mit präziseren Antworten und deutlich weniger unnötigen Einschränkungen",
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
        "Claude Opus 4.6 - Leistungsstarkes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
      claudeOpus47:
        "Claude Opus 4.7 - Neuestes und leistungsstärkstes Claude-Modell mit außergewöhnlichen Reasoning- und kreativen Fähigkeiten",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropics leistungsfähigstes Sonnet-Modell mit frontier-Leistung in Coding, Agenten und professioneller Arbeit",
      claudeHaiku45:
        "Claude Haiku 4.5 - Schnelles und effizientes Claude-Modell optimiert für Geschwindigkeit und Kosteneffizienz",
      glm5_1:
        "GLM-5.1 - Z.AIs Coding-Modell der nächsten Generation für langfristige Aufgaben. Arbeitet über 8 Stunden autonom an einer einzigen Aufgabe - plant, führt aus und verbessert sich selbst, bis vollständige Engineering-Ergebnisse vorliegen.",
      glm5: "GLM-5 - Z.AIs Flaggschiff-Open-Source-Basismodell für komplexes Systemdesign und langfristige Agenten-Workflows, vergleichbar mit führenden Closed-Source-Modellen",
      glm5Turbo:
        "GLM-5 Turbo - Z.AIs Modell der nächsten Generation, tief optimiert für agentische Umgebungen mit schneller Inferenz, verbesserter Instruktionsverarbeitung und erweiterter Aufgabenstabilität",
      glm46:
        "GLM-4 6B - Effizientes chinesisch-englisches bilinguales KI-Modell mit starken allgemeinen Fähigkeiten",
      glm47:
        "GLM-4 7B - Fortgeschrittenes chinesisch-englisches bilinguales Modell mit verbesserten Reasoning- und Coding-Fähigkeiten",
      glm47Flash:
        "GLM-4 7B Flash - Ultraschnelles chinesisch-englisches Modell optimiert für schnelle Antworten",
      kimiK2:
        "Kimi K2 - Leistungsstarkes chinesisches KI-Modell mit ausgezeichnetem Kontextverständnis",
      kimiK2_6:
        "Kimi K2.6 - Moonshot AIs Multimodal-Modell der nächsten Generation für langfristige Coding-Aufgaben, UI/UX-Generierung aus Prompts und Bildern sowie Multi-Agenten-Orchestrierung mit Agentenschwarm-Architektur für Hunderte paralleler Unteragenten",
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
      grok420Beta:
        "Grok 4.20 Beta - xAIs neuestes Flaggschiff-Modell mit branchenführender Geschwindigkeit, agentischem Tool-Calling, niedrigster Halluzinationsrate und 2M-Token-Kontext",
      gpt5Pro:
        "GPT-5 Pro - OpenAIs Premium-Modell mit erstklassigem Reasoning und fortgeschrittenen Coding-Fähigkeiten",
      gpt5Codex:
        "GPT-5 Codex - OpenAIs spezialisiertes Coding-Modell mit außergewöhnlichen Programmier- und technischen Fähigkeiten",
      gpt51Codex:
        "GPT 5.1 Codex - Aktualisiertes OpenAI-Coding-Modell mit verbesserten kreativen und Programmierfähigkeiten",
      gpt51:
        "GPT 5.1 - OpenAIs effizientes Allzweck-Modell mit starkem Reasoning und Analyse",
      gpt5: "GPT-5 - OpenAIs Flaggschiff-Modell mit breiter Intelligenz und vielseitigen Fähigkeiten",
      gpt54Mini:
        "GPT-5.4 Mini - OpenAIs effizienter GPT-5.4-Ableger für Hochdurchsatz-Workloads mit starkem Reasoning, Coding und Tool-Nutzung bei reduziertem Kostenpunkt",
      gpt54Nano:
        "GPT-5.4 Nano - OpenAIs leichtestes und kostengünstigstes Modell für geschwindigkeitskritische Aufgaben wie Klassifizierung, Datenextraktion und Sub-Agent-Ausführung",
      gpt5Mini:
        "GPT-5 Mini - OpenAIs leichtes schnelles Modell für schnelle alltägliche Aufgaben",
      gpt5Nano:
        "GPT-5 Nano - OpenAIs kleinstes und günstigstes Modell für einfache Konversationsaufgaben",
      gptOss120b:
        "GPT-OSS 120B - OpenAIs Open-Source-120B-Parameter-Modell mit starken Coding-Fähigkeiten",
      kimiK2Thinking:
        "Kimi K2 Thinking - Kimis Reasoning-fokussiertes Modell mit verbessertem analytischem und schrittweisem Denken",
      minimaxM27:
        "MiniMax M2.7 - MiniMaxs agentisches Modell der nächsten Generation für autonome Produktivität, Multi-Agenten-Zusammenarbeit und Produktions-Workflows inkl. Code-Debugging, Finanzmodellierung und Dokumenterstellung",
      mimoV2Pro:
        "MiMo V2 Pro - Xiaomis Flaggschiff-Modell mit 1T+ Parametern und 1M Kontext, tief optimiert für Agenten-Orchestrierung, komplexe Workflow-Automatisierung und Produktions-Engineering",
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
      dallE3:
        "DALL-E 3 - OpenAIs Bildgenerierungsmodell für hochwertige, detaillierte Bilder aus Textbeschreibungen",
      gptImage1:
        "GPT-Image-1 - OpenAIs schnelles und erschwingliches Bildgenerierungsmodell",
      fluxSchnell:
        "Flux Schnell - Black Forest Labs' schnelles Bildgenerierungsmodell, optimiert für Geschwindigkeit",
      fluxPro:
        "Flux Pro 1.1 - Black Forest Labs' professionelles Bildgenerierungsmodell mit überlegener Qualität",
      flux2Max:
        "FLUX.2 Max - Black Forest Labs' hochwertigstes Bildmodell mit maximaler Bildqualität, Prompt-Verständnis und Bearbeitungskonsistenz",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Black Forest Labs' schnellstes und kosteneffizientestes Bildmodell, optimiert für hohen Durchsatz",
      riverflowV2Pro:
        "Riverflow V2 Pro - Sourcefuls leistungsstärkstes Bildgenerierungsmodell mit erstklassiger Steuerung und perfekter Textwiedergabe",
      riverflowV2Fast:
        "Riverflow V2 Fast - Sourcefuls schnellstes Bildgenerierungsmodell, optimiert für Produktionsumgebungen und latenzempfindliche Workflows",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview - Sourcefuls leistungsstärkstes Preview-Modell, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview - Sourcefuls Standard-Preview-Variante mit verbesserter Leistung gegenüber der Riverflow 1-Familie",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - Sourcefuls schnellste Preview-Variante, vereinheitlichtes Text-zu-Bild- und Bild-zu-Bild-Modell zum günstigsten Preis",
      flux2Flex:
        "FLUX.2 Flex - Black Forest Labs' Bildmodell mit hervorragender Text- und Typografiewiedergabe sowie Multi-Referenz-Bearbeitung in einer einheitlichen Architektur",
      flux2Pro:
        "FLUX.2 Pro - Black Forest Labs' hochwertiges Bildgenerierungs- und Bearbeitungsmodell mit erstklassiger Bildqualität, starker Prompt-Treue und konsistenter Charakterwiedergabe",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview) - Googles fortschrittlichstes Bildgenerierungsmodell mit verbessertem multimodalem Reasoning, Weltverständnis und branchenführender Textwiedergabe",
      gpt5ImageMini:
        "GPT-5 Image Mini - OpenAIs effizientes multimodales Bildgenerierungsmodell, das GPT-5 Mini-Sprachfähigkeiten mit schneller, kostengünstiger Bildgenerierung kombiniert",
      gpt5Image:
        "GPT-5 Image - OpenAIs Flaggschiff-Multimodal-Modell, das GPT-5-Sprachfähigkeiten mit modernster Bildgenerierung und -bearbeitung kombiniert",
      gpt54Image2:
        "GPT-5.4 Image 2 - OpenAIs Multimodal-Modell der nächsten Generation, das GPT-5.4-Reasoning mit GPT Image 2 verbindet. Wechselt nahtlos zwischen Coding, Analyse und visueller Erstellung in einem Gespräch.",
      seedream45:
        "Seedream 4.5 - ByteDances neuestes Bildgenerierungsmodell mit umfassenden Verbesserungen bei Bearbeitungskonsistenz, Porträtverfeinerung und Mehrbildkomposition",
      sdxl: "Stable Diffusion XL - Stability AIs hochwertiges Open-Source-Bildgenerierungsmodell",
      musicgenStereo:
        "MusicGen Stereo - Metas Open-Source-Stereo-Musikgenerierungsmodell via Replicate",
      stableAudio:
        "Stable Audio - Stability AIs Musik- und Audiogenerierungsmodell für hochwertige Clips",
      udioV2:
        "Udio v2 - Hochwertige KI-Musikgenerierung mit Gesang und vollständiger Produktionsqualität",
      modelsLabMusicGen:
        "ModelsLab Music Gen - KI-Musikgenerierung aus Textbeschreibungen mit MP3/WAV/FLAC-Ausgabe",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - Hochwertige Musikgenerierung mit ElevenLabs über ModelsLab",
      modelsLabSonautoSong:
        "Sonauto Song - Vollständige Songgenerierung mit Gesang, verschiedene Genres bis zu 4:45 Min.",
      modelsLabLyria3:
        "Lyria 3 - Googles fortschrittliches Musikgenerierungsmodell für originale 30-Sekunden-Tracks aus Text",
      modelsLabCogVideoX:
        "CogVideoX - ModelsLabs Text-zu-Video-Modell für kurze Videoclips",
      modelsLabWanx: "Wanx - ModelsLabs Text-zu-Video-Generierungsmodell",
      modelsLabWan22:
        "Wan 2.2 Ultra - ModelsLabs hochqualitatives Text-zu-Video-Modell",
      modelsLabWan21:
        "Wan 2.1 Ultra - ModelsLabs Text-zu-Video-Modell mit verbesserter Qualität",
      modelsLabWan25T2V:
        "Wan 2.5 T2V - ModelsLabs Wan 2.5 Text-zu-Video-Generierungsmodell",
      modelsLabWan25I2V:
        "Wan 2.5 I2V - ModelsLabs Wan 2.5 Bild-zu-Video-Generierungsmodell",
      modelsLabWan27T2V:
        "Wan 2.7 T2V - Alibabas neuestes Wan 2.7 Text-zu-Video-Modell mit flexiblen Seitenverhältnissen und 1080p-Ausgabe",
      modelsLabWan26T2V:
        "Wan 2.6 T2V - ModelsLabs Wan 2.6 Text-zu-Video-Generierungsmodell",
      modelsLabWan26I2V:
        "Wan 2.6 I2V - ModelsLabs Wan 2.6 Bild-zu-Video-Generierungsmodell",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - ModelsLabs schnelles Wan 2.6 Bild-zu-Video-Generierungsmodell",
      modelsLabSeedanceT2V:
        "Seedance T2V - BytePlus Text-zu-Video-Generierungsmodell",
      modelsLabSeedanceI2V:
        "Seedance I2V - BytePlus Bild-zu-Video-Generierungsmodell",
      modelsLabOmnihuman: "Omnihuman - BytePlus Human-Video-Generierungsmodell",
      modelsLabSeedance1ProI2V:
        "Seedance 1.0 Pro I2V - BytePlus professionelles Bild-zu-Video-Modell",
      modelsLabSeedance1ProFastI2V:
        "Seedance 1.0 Pro Fast I2V - BytePlus schnelles professionelles Bild-zu-Video-Modell",
      modelsLabSeedance1ProFastT2V:
        "Seedance 1.0 Pro Fast T2V - BytePlus schnelles professionelles Text-zu-Video-Modell",
      modelsLabOmnihuman15:
        "Omnihuman 1.5 - BytePlus verbessertes Human-Video-Generierungsmodell",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - BytePlus fortschrittliches Video-Generierungsmodell",
      modelsLabVeo2:
        "Veo 2 - Googles hochwertiges Video-Generierungsmodell via ModelsLab",
      modelsLabVeo3:
        "Veo 3 - Googles neuestes Video-Generierungsmodell via ModelsLab",
      modelsLabVeo3Fast:
        "Veo 3 Fast - Googles schnelles Video-Generierungsmodell via ModelsLab",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - Googles schnelles Video-Generierungs-Preview-Modell via ModelsLab",
      modelsLabVeo31:
        "Veo 3.1 - Googles verbessertes Veo 3 Video-Generierungsmodell via ModelsLab",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - Googles schnelles Veo 3.1 Video-Generierungsmodell via ModelsLab",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Kling AIs Bild-zu-Video-Modell Version 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Kling AIs Turbo-Bild-zu-Video-Modell Version 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Kling AIs Turbo-Text-zu-Video-Modell Version 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Kling AIs Master-Qualität Text-zu-Video-Modell",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Kling AIs Master-Qualität Bild-zu-Video-Modell",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Kling AIs Master-Qualität Text-zu-Video-Modell v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Kling AIs Master-Qualität Bild-zu-Video-Modell v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Kling AIs Multi-Bild-zu-Video-Modell Version 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Kling AIs Text-zu-Video-Modell Version 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - LTXs professionelles Text-zu-Video-Generierungsmodell",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - LTXs professionelles Bild-zu-Video-Generierungsmodell",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - LTXs verbessertes professionelles Bild-zu-Video-Modell",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - MiniMax Text-zu-Video-Generierungsmodell Version 2.3",
      modelsLabHailuo02T2V:
        "Hailuo 02 T2V - MiniMax Text-zu-Video-Generierungsmodell 02",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - MiniMax Bild-zu-Video-Generierungsmodell Version 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V - MiniMax schnelles Bild-zu-Video-Modell Version 2.3",
      modelsLabHailuo02I2V:
        "Hailuo 02 I2V - MiniMax Bild-zu-Video-Generierungsmodell 02",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - MiniMax Start-End-Frame Video-Generierungsmodell",
      modelsLabSora2:
        "Sora 2 - OpenAIs Sora 2 Video-Generierungsmodell via ModelsLab",
      modelsLabSora2Pro:
        "Sora 2 Pro - OpenAIs Sora 2 Pro Video-Generierungsmodell via ModelsLab",
      modelsLabGen4Aleph:
        "Gen4 Aleph - Runways Gen4 Aleph Video-Generierungsmodell via ModelsLab",
      modelsLabLipsync2:
        "Lipsync 2 - Syncs Lippensynchronisations-Video-Generierungsmodell",
      modelsLabGrokT2V:
        "Grok T2V - xAIs Grok Text-zu-Video-Generierungsmodell via ModelsLab",
      modelsLabGrokI2V:
        "Grok I2V - xAIs Grok Bild-zu-Video-Generierungsmodell via ModelsLab",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - Runways schnelles Text-zu-Bild-Generierungsmodell via ModelsLab",
      modelsLabGen4Image:
        "Gen4 Image - Runways Gen4 Text-zu-Bild-Generierungsmodell via ModelsLab",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - Alibabas Wan 2.7 Text-zu-Bild-Modell via ModelsLab",
      modelsLabGrokT2I:
        "Grok Imagine T2I - xAIs Grok Text-zu-Bild-Modell via ModelsLab",
      modelsLabZImageBase:
        "Z Image Base - ModelsLabs schnelles und günstiges Text-zu-Bild-Modell",
      modelsLabZImageTurbo:
        "Z Image Turbo - ModelsLabs ultraschnelles Text-zu-Bild-Modell",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - Black Forest Labs Flux 2 Max Text-zu-Bild via ModelsLab",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - Black Forest Labs Flux Pro Ultra via ModelsLab",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - Black Forest Labs Flux Pro 1.1 Text-zu-Bild via ModelsLab",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - Black Forest Labs Flux 2 Pro Text-zu-Bild via ModelsLab",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - Black Forest Labs Flux 2 Dev Text-zu-Bild via ModelsLab",
      modelsLabFluxT2I:
        "Flux T2I - Black Forest Labs Flux Text-zu-Bild via ModelsLab",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - ByteDances Seedream 4.5 Text-zu-Bild via ModelsLab",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - ByteDances Seedream 4.0 Text-zu-Bild via ModelsLab",
      modelsLabSeedreamT2I:
        "Seedream T2I - ByteDances Seedream Text-zu-Bild via ModelsLab",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - Googles höchste Qualität Bildgenerierung via ModelsLab",
      modelsLabImagen4:
        "Imagen 4 - Googles Imagen 4 Text-zu-Bild via ModelsLab",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - Googles schnelles Imagen 4 Text-zu-Bild via ModelsLab",
      modelsLabImagen3:
        "Imagen 3 - Googles Imagen 3 Text-zu-Bild via ModelsLab",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - Hochwertige Bildgenerierung via ModelsLab",
      modelsLabNanoBanana: "Nano Banana - Bildgenerierung via ModelsLab",
      modelsLabQwenT2I: "Qwen T2I - Alibabas Qwen Text-zu-Bild via ModelsLab",
      modelsLabRealtimeT2I:
        "Realtime T2I - ModelsLabs ultraschnelles Echtzeit Text-zu-Bild-Modell",
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
