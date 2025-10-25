import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "Neuer Thread",
    newPrivateChat: "Neuer Privater Thread",
    newSharedChat: "Neuer Geteilter Thread",
    newPublicChat: "Neuer Öffentlicher Thread",
    newIncognitoChat: "Neuer Inkognito Thread",
    newPrivateFolder: "Neuer Privater Ordner",
    newSharedFolder: "Neuer Geteilter Ordner",
    newPublicFolder: "Neuer Öffentlicher Ordner",
    newIncognitoFolder: "Neuer Inkognito Ordner",
    createNewPrivateFolder: "Neuen Privaten Ordner Erstellen",
    createNewSharedFolder: "Neuen Geteilten Ordner Erstellen",
    createNewPublicFolder: "Neuen Öffentlichen Ordner Erstellen",
    createNewIncognitoFolder: "Neuen Inkognito Ordner Erstellen",
    privateChats: "Private Threads",
    sharedChats: "Geteilte Threads",
    publicChats: "Öffentliche Threads",
    incognitoChats: "Inkognito-Threads",
    search: "Suchen",
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    send: "Senden",
    sending: "Wird gesendet...",
    edit: "Bearbeiten",
    settings: "Einstellungen",
    toggleSidebar: "Seitenleiste umschalten",
    lightMode: "Heller Modus",
    darkMode: "Dunkler Modus",
    searchPlaceholder: "Suchen...",
    searchThreadsPlaceholder: "Threads durchsuchen...",
    searchResults: "Suchergebnisse ({{count}})",
    noChatsFound: "Keine Chats gefunden",
    noThreadsFound: "Keine Threads gefunden",
    enableTTSAutoplay: "TTS-Automatische Wiedergabe aktivieren",
    disableTTSAutoplay: "TTS-Automatische Wiedergabe deaktivieren",
    closeSidebar: "Seitenleiste schließen",
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
    viewFullThread: "Vollständigen Thread anzeigen",
    viewAllThreads: "Alle Threads anzeigen",
    backToChat: "Zurück zum Chat",
    language: "Sprache",
    loginRequired:
      "Bitte melden Sie sich an, um persistente Ordner zu verwenden. Verwenden Sie den Inkognito-Modus für anonyme Chats.",

    // Copy Button
    copyButton: {
      copyToClipboard: "In Zwischenablage kopieren",
      copied: "Kopiert!",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Audio-Wiedergabe stoppen",
      playAudio: "Audio abspielen",
      answerAsAI: "Als KI-Modell antworten",
      deleteMessage: "Nachricht löschen",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Konversation von hier verzweigen",
      retry: "Mit anderem Modell/Persona wiederholen",
      deleteMessage: "Nachricht löschen",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Lineare Ansicht (ChatGPT-Stil)",
      threadedView: "Thread-Ansicht (Reddit/Discord-Stil)",
      flatView: "Flache Ansicht (4chan-Stil)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Suchen & Erstellen",
      newChat: "Neuer Chat",
      searchThreadsPlaceholder: "Threads durchsuchen...",
      noThreadsFound: "Keine Threads gefunden",
    },

    // Selector
    selector: {
      country: "Land",
      language: "Sprache",
    },
  },

  aiTools: {
    modal: {
      title: "KI-Tools-Konfiguration",
      description:
        "Wählen Sie aus, welche KI-Tools der Assistent während der Konversation verwenden kann. Tools bieten Funktionen wie Websuche, Berechnungen und Datenzugriff.",
      searchPlaceholder: "Tools durchsuchen...",
      loading: "Tools werden geladen...",
      noToolsFound: "Keine Tools entsprechen Ihrer Suche",
      noToolsAvailable:
        "Noch keine KI-Tools gefunden. Tools werden hier automatisch angezeigt, sobald sie im System registriert sind.",
      enableAll: "Alle sichtbaren Tools aktivieren",
      disableAll: "Alle sichtbaren Tools deaktivieren",
      footerInfo: "{{count}} von {{total}} Tools aktiviert",
    },
  },

  confirmations: {
    deleteMessage: "Möchten Sie diese Nachricht wirklich löschen?",
  },

  iconSelector: {
    tabs: {
      library: "Icon-Bibliothek",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Emoji oder Unicode-Zeichen eingeben",
      placeholder: "🤖 oder beliebiger Text",
      apply: "Anwenden",
      currentIcon: "Aktuelles Icon:",
      commonEmojis: "Häufige Emojis:",
    },
  },

  userProfile: {
    postCount: "{{count}} Beitrag",
    postCount_other: "{{count}} Beiträge",
    recentPosts: "Neueste Beiträge",
    noPostsYet: "Noch keine Beiträge",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Diese Nachricht löschen",
    },
  },
  credits: {
    balance: "Credits",
    total: "{{count}} Credits",
    expiring: "{{count}} ablaufend",
    permanent: "{{count}} dauerhaft",
    free: "{{count}} kostenlos",
    expiresOn: "Läuft ab am {{date}}",
    expiresAt: "Läuft ab",
    buyMore: "Credits kaufen",
    viewDetails: "Details",
    breakdown: "Credit-Aufschlüsselung",
    navigation: {
      profile: "Profil",
      subscription: "Abonnement",
      about: "Über",
      help: "Hilfe",
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
    branch: "Konversation von hier verzweigen",
    editMessage: "Nachricht bearbeiten",
    stopAudio: "Audio-Wiedergabe stoppen",
    playAudio: "Audio abspielen",
    pin: "An Anfang anheften",
    unpin: "Loslösen",
    archive: "Archivieren",
    unarchive: "Entarchivieren",
    copyContent: "In Zwischenablage kopieren",
    rename: "Umbenennen",
    moveToFolder: "In Ordner verschieben",
    unfiled: "Nicht abgelegt",
    noFoldersAvailable: "Keine Ordner verfügbar",
    stopGeneration: "Generierung stoppen",
    sendMessage: "Nachricht senden",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-konversation",
  },
  input: {
    placeholder: "Geben Sie Ihre Nachricht ein...",
    keyboardShortcuts: {
      press: "Drücken Sie",
      enter: "Eingabe",
      toSend: "zum Senden",
      shiftEnter: "Umschalt+Eingabe",
      forNewLine: "für neue Zeile",
    },
    speechInput: {
      stopRecording: "Aufnahme stoppen",
      processing: "Verarbeite...",
      startVoiceInput: "Spracheingabe starten (Zum Sprechen klicken)",
      recordingClickToStop: "Aufnahme läuft... Zum Stoppen klicken",
      transcribing: "Transkribiere...",
    },
  },
  modelSelector: {
    placeholder: "Modell auswählen",
    addNewLabel: "Modell hinzufügen",
    costFree: "Kostenlos",
    costCredits: "{{count}} Credits/Nachricht",
    costCreditsPlural: "{{count}} Credits/Nachricht",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    addDialog: {
      title: "Benutzerdefiniertes Modell hinzufügen",
      fields: {
        modelName: {
          label: "Modellname",
          placeholder: "z.B. GPT-4 Turbo",
        },
        provider: {
          label: "Anbieter",
          placeholder: "z.B. OpenAI",
        },
        apiDocs: {
          label: "API-Dokumentations-URL",
        },
        modelId: {
          label: "Modell-ID",
          placeholder: "z.B. gpt-4-turbo",
        },
      },
      cancel: "Abbrechen",
      add: "Modell hinzufügen",
    },
  },
  personaSelector: {
    placeholder: "Persona auswählen",
    addNewLabel: "Persona erstellen",
    defaultIcon: "✨",
    grouping: {
      bySource: "Nach Quelle",
      byCategory: "Nach Kategorie",
      sourceLabels: {
        builtIn: "Eingebaut",
        my: "Meine Personas",
        community: "Community",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "Allgemein",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Kategorie erstellen",
      fields: {
        name: {
          label: "Kategoriename",
          placeholder: "z.B. Geschäft, Gaming, etc.",
        },
        icon: {
          label: "Symbol (Emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Abbrechen",
      create: "Erstellen",
    },
    addDialog: {
      title: "Benutzerdefinierte Persona erstellen",
      createCategory: "+ Neue Kategorie",
      fields: {
        name: {
          label: "Name",
          placeholder: "z.B. Code-Prüfer",
        },
        icon: {
          label: "Symbol (Emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Beschreibung",
          placeholder: "Kurze Beschreibung der Persona",
        },
        systemPrompt: {
          label: "System-Prompt",
          placeholder: "Sie sind ein...",
        },
        category: {
          label: "Kategorie",
        },
        suggestedPrompts: {
          label: "Vorgeschlagene Prompts (Optional)",
          description: "Fügen Sie bis zu 4 vorgeschlagene Prompts hinzu",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Abbrechen",
      create: "Persona erstellen",
    },
  },
  searchToggle: {
    search: "Suche",
    enabledTitle: "Brave Search aktiviert (+1 Credits pro Suche)",
    disabledTitle: "Brave Search deaktiviert (+1 Credits pro Suche)",
    creditIndicator: "+1",
  },
  selectorBase: {
    favorites: "Favoriten",
    recommended: "Empfohlen",
    others: "Andere",
    searchPlaceholder: "{{item}} durchsuchen...",
    toggleFavorite: "Favorit umschalten",
    noFavorites:
      'Noch keine Favoriten. Klicken Sie auf "Alle anzeigen", um welche hinzuzufügen.',
    noRecommended: "Keine empfohlenen Optionen verfügbar.",
    showAll: "Alle anzeigen",
    groupByProvider: "Nach Anbieter gruppieren",
    groupByUtility: "Nach Verwendung gruppieren",
    sortAZ: "Sortieren A-Z",
    sortZA: "Sortieren Z-A",
  },
  dialogs: {
    searchAndCreate: "Suchen & Erstellen",
    deleteChat: 'Chat "{{title}}" löschen?',
    deleteFolderConfirm:
      'Ordner "{{name}}" löschen und {{count}} Chat(s) zu Allgemein verschieben?',
  },
  newFolder: {
    title: "Neuen Ordner erstellen",
    folderName: "Ordnername",
    placeholder: "Ordnername eingeben...",
    folderIcon: "Ordner-Symbol",
    cancel: "Abbrechen",
    create: "Erstellen",
  },
  renameFolder: {
    title: "Ordner umbenennen",
    folderName: "Ordnername",
    placeholder: "Ordnername eingeben...",
    folderIcon: "Ordner-Symbol",
    cancel: "Abbrechen",
    save: "Speichern",
  },
  folders: {
    privateDescription: "Ihre privaten Unterhaltungen",
    sharedDescription: "Mit anderen geteilte Unterhaltungen",
    publicDescription: "Öffentliche Unterhaltungen",
    incognitoDescription: "Unterhaltungen im privaten Modus",
  },
  moveFolder: {
    title: "Ordner verschieben",
    description: "Zielordner auswählen:",
    rootLevel: "Hauptebene (Kein übergeordneter Ordner)",
    cancel: "Abbrechen",
    move: "Verschieben",
  },
  views: {
    linearView: "Lineare Ansicht (ChatGPT-Stil)",
    threadedView: "Thread-Ansicht (Reddit/Discord-Stil)",
    flatView: "Flache Ansicht (4chan-Stil)",
  },
  screenshot: {
    capturing: "Wird aufgenommen...",
    capture: "Screenshot aufnehmen",
    failed: "Screenshot-Aufnahme fehlgeschlagen",
    failedWithMessage: "Screenshot-Aufnahme fehlgeschlagen: {{message}}",
    tryAgain:
      "Screenshot-Aufnahme fehlgeschlagen. Bitte versuchen Sie es erneut.",
    noMessages:
      "Chat-Nachrichtenbereich konnte nicht gefunden werden. Bitte stellen Sie sicher, dass Sie Nachrichten im Chat haben.",
    quotaExceeded: "Speicherkontingent überschritten. Screenshot ist zu groß.",
    canvasError: "Fehler beim Konvertieren des Screenshots in Bildformat.",
  },
  errors: {
    noResponse:
      "Keine Antwort von der KI erhalten. Die Anfrage wurde abgeschlossen, hat aber leeren Inhalt zurückgegeben. Bitte versuchen Sie es erneut.",
    noStream: "Stream-Antwort fehlgeschlagen: Kein Reader verfügbar",
    saveFailed: "Speichern der Bearbeitung fehlgeschlagen",
    branchFailed: "Verzweigen fehlgeschlagen",
    retryFailed: "Wiederholen fehlgeschlagen",
    answerFailed: "Antworten fehlgeschlagen",
    deleteFailed: "Löschen fehlgeschlagen",
    cannotBranchFromFirst: "Kann nicht von der ersten Nachricht verzweigen",
    parentMessageNotFound: "Übergeordnete Nachricht nicht gefunden",
    parentMessageNotInPath: "Übergeordnete Nachricht nicht im aktuellen Pfad",
    messageNotFound: "Nachricht nicht gefunden",
    invalidBranchIndex: "Ungültiger Verzweigungsindex",
    messageNotInPath: "Nachricht nicht im aktuellen Pfad",
    requestAborted: "Anfrage wurde abgebrochen",
    requestCancelled: "Anfrage wurde abgebrochen",
    requestTimeout:
      "Zeitüberschreitung der Anfrage. Bitte versuchen Sie es erneut.",
    networkError:
      "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    apiError: "API-Fehler. Bitte versuchen Sie es später erneut.",
    storageError:
      "Speicherfehler. Ihr Browser-Speicher ist möglicherweise voll.",
    unexpectedError:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    errorInContext: "Fehler in {{context}}: {{message}}",
    invalidRequestData: "Ungültige Anfragedaten: {{error}}",
    streamAIResponse:
      "KI-Antwort konnte nicht abgerufen werden. Bitte versuchen Sie es erneut.",
  },
  speech: {
    error: "Spracherkennungsfehler",
    transcript: "Transkript: {{text}}",
  },
  state: {
    threadNotFound: "Thread nicht gefunden",
  },
  storage: {
    parsePreferencesFailed:
      "Fehler beim Parsen der Benutzereinstellungen aus dem Speicher",
    parseStateFailed: "Fehler beim Parsen des Chat-Status aus dem Speicher",
    syncPreferencesFailed:
      "Fehler beim Synchronisieren der Einstellungen mit dem Speicher",
    syncStateFailed:
      "Fehler beim Synchronisieren des Chat-Status mit dem Speicher",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Sprache-zu-Text-Endpunkt nicht verfügbar",
      "failed-to-start": "Aufnahme konnte nicht gestartet werden",
      "permission-denied": "Mikrofonberechtigung verweigert",
      "no-microphone": "Kein Mikrofon gefunden",
      "microphone-in-use": "Mikrofon wird verwendet",
      "transcription-failed": "Audio konnte nicht transkribiert werden",
    },
    tts: {
      "endpoint-not-available": "Text-zu-Sprache-Endpunkt nicht verfügbar",
      "failed-to-play": "Audio konnte nicht abgespielt werden",
      "conversion-failed": "TTS-Konvertierung fehlgeschlagen",
      "failed-to-generate": "Audio konnte nicht generiert werden",
    },
  },
  post: {
    title: "Chat",
    description: "Chat-Oberfläche",
  },
  messages: {
    assistant: "Assistent",
    you: "Sie",
    user: "Benutzer",
    anonymous: "Anonym",
    edited: "bearbeitet",
    postNumber: "Nr.{{number}}",
    actions: {
      handleSaveEdit: {
        error: "Nachrichtenbearbeitung konnte nicht gespeichert werden",
      },
      handleBranchEdit: {
        error: "Nachricht konnte nicht verzweigt werden",
      },
      handleConfirmRetry: {
        error: "Nachricht konnte nicht wiederholt werden",
      },
      handleConfirmAnswer: {
        error: "Antwort als Modell fehlgeschlagen",
      },
      handleConfirmDelete: {
        error: "Nachricht konnte nicht gelöscht werden",
      },
    },
    branch: {
      previous: "Vorheriger Zweig",
      next: "Nächster Zweig",
    },
  },
  modelUtilities: {
    general: "Allgemeiner Chat",
    coding: "Programmierung & Entwicklung",
    creative: "Kreatives Schreiben",
    analysis: "Analyse & Recherche",
    fast: "Schnell & Effizient",
    multimodal: "Multimodal (Vision)",
    vision: "Sehen & Bildverständnis",
    imageGen: "Bildgenerierung",
    uncensored: "Unzensiert",
    // Persona categories
    technical: "Technisch",
    education: "Bildung",
    controversial: "Kontrovers",
    lifestyle: "Lebensstil",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Neuestes Claude-Modell mit hervorragender Leistung",
      claudeSonnet45: "Neuestes Claude-Modell mit hervorragender Leistung",
      gpt5: "Neuestes GPT-Modell mit hervorragender Leistung",
      gpt5Pro:
        "Neuestes GPT-Modell mit hervorragender Leistung für Programmieraufgaben",
      gpt5Codex: "Neuestes GPT-Modell mit hervorragender Leistung",
      gpt5Mini:
        "Neuestes Mini-Modell mit hervorragendem Preis-Leistungs-Verhältnis",
      gpt5Nano:
        "Neuestes Nano-Modell mit hervorragendem Preis-Leistungs-Verhältnis",
      gptOss120b: "Open-Source-GPT-Modell mit 120B Parametern",
      geminiFlash25Pro:
        "Ultraschnelles und effizientes 14B-Modell mit großem Kontext",
      geminiFlash25Flash:
        "Ultraschnelles und effizientes 14B-Modell mit großem Kontext",
      geminiFlash25Lite:
        "Ultraschnelles und effizientes 14B-Modell mit großem Kontext",
      mistralNemo:
        "Europäisches KI-Modell mit starker Leistung und Datenschutzfokus",
      kimiK2Free:
        "Kimi K2 Instruct ist ein großes Mixture-of-Experts (MoE) Sprachmodell, entwickelt von Moonshot AI.",
      deepseekV31Free:
        "Leistungsstarkes 671B-Parameter-Modell - völlig kostenlos!",
      deepseekV31:
        "Leistungsstarkes 671B-Parameter-Modell mit erweiterten Fähigkeiten",
      qwen3235bFree:
        "Mixture-of-Experts (MoE) Modell entwickelt von Qwen, unterstützt nahtloses Umschalten zwischen Modi.",
      deepseekR1Distill: "Destilliertes Reasoning-Modell mit starker Leistung",
      deepseekR1:
        "Fortgeschrittenes Reasoning-Modell mit tiefen Denkfähigkeiten",
      qwen257b: "Effizientes 7B-Parameter-Modell",
      grok4: "X-AI Grok 4 - Premium-Modell",
      grok4Fast:
        "Grok 4 Fast ist xAIs neuestes multimodales Modell mit SOTA-Kosteneffizienz und einem 2M-Token-Kontextfenster. Es gibt zwei Varianten: ohne und mit Reasoning.",
      glm46:
        "GLM 4.6 - effizientes 7B-Parameter-Modell mit großem Kontextfenster",
      glm45Air:
        "GLM 4.5 AIR - ultraschnelles leichtgewichtiges Modell mit großem Kontextfenster",
      glm45v:
        "GLM 4.5v - visionsfähiges multimodales Modell mit großem Kontextfenster",
      uncensoredLmV11:
        "Unzensiertes Sprachmodell ohne Inhaltsfilterung - Premium-Modell",
    },
  },
  tones: {
    professional: {
      description: "Standard professioneller Ton",
      systemPrompt:
        "Behalten Sie einen professionellen, informativen und zugänglichen Ton in Ihren Antworten bei.",
    },
    pirate: {
      description: "Ahoi Matrose! Sprich wie ein Pirat",
      systemPrompt:
        "Antworte wie ein freundlicher Pirat, verwende Piratensprache und Ausdrücke wie 'Ahoi', 'Matrose', 'Arrr', 'Ihr', 'Aye' und andere nautische Begriffe. Sei enthusiastisch und abenteuerlustig, während du genaue Informationen lieferst.",
    },
    enthusiastic: {
      description: "Super aufgeregt und energiegeladen",
      systemPrompt:
        "Sei extrem enthusiastisch, aufgeregt und energiegeladen in deinen Antworten! Verwende Ausrufezeichen, positive Sprache und zeige echte Begeisterung. Lass alles erstaunlich und inspirierend klingen!",
    },
    zen: {
      description: "Ruhig, weise und philosophisch",
      systemPrompt:
        "Antworte mit der Weisheit und ruhigen Art eines Zen-Meisters. Verwende nachdenkliche, philosophische Sprache, sprich über Balance und Harmonie und gib Einblicke mit friedlichen Metaphern. Sei gelassen und kontemplativ.",
    },
    detective: {
      description: "Mysteriös und investigativ",
      systemPrompt:
        "Antworte wie ein scharfsinniger, aufmerksamer Detektiv. Verwende investigative Sprache, sprich über 'Fälle' und 'Beweise' und präsentiere Informationen, als würdest du ein Mysterium lösen oder einen Fall aufbauen. Sei analytisch und faszinierend.",
    },
    shakespearean: {
      description: "Eloquent und poetisch wie der Barde",
      systemPrompt:
        "Antworte im eloquenten, poetischen Stil von Shakespeare. Verwende blumige Sprache, Metaphern und gelegentlich archaische Begriffe wie 'Ihr', 'Euch', 'hat' und 'tut'. Lass die Geschichte wie ein episches Märchen klingen, würdig des größten Dramatikers.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Nicht in Browser-Umgebung",
      requiresHttps: "Spracherkennung erfordert HTTPS oder localhost",
      notAvailable: "Spracherkennung in diesem Browser nicht verfügbar",
      firefoxNotSupported: "Spracherkennung wird in Firefox nicht unterstützt",
      safariVersionTooOld:
        "Bitte aktualisieren Sie Safari auf Version 14.5 oder höher",
      microphoneNotAvailable: "Mikrofonzugriff nicht verfügbar",
      noSpeech: "Keine Sprache erkannt. Bitte versuchen Sie es erneut.",
      audioCapture:
        "Mikrofon nicht verfügbar. Bitte überprüfen Sie Ihre Einstellungen.",
      notAllowed:
        "Mikrofonberechtigung verweigert. Bitte erlauben Sie den Mikrofonzugriff in Ihren Browsereinstellungen.",
      network: "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.",
      serviceNotAllowed: "Spracherkennungsdienst nicht erlaubt.",
      badGrammar: "Spracherkennungsfehler. Bitte versuchen Sie es erneut.",
      languageNotSupported:
        "Diese Sprache wird für Spracherkennung nicht unterstützt.",
      aborted: "Aufnahme abgebrochen.",
      unknown: "Spracherkennungsfehler: {{errorCode}}",
      apiNotFound: "Spracherkennungs-API nicht gefunden",
      initializationFailed:
        "Initialisierung der Spracherkennung fehlgeschlagen",
      microphoneAccessDenied: "Mikrofonzugriff verweigert",
      microphonePermissionDenied:
        "Mikrofonberechtigung verweigert. Bitte erlauben Sie den Mikrofonzugriff.",
      noMicrophoneFound:
        "Kein Mikrofon gefunden. Bitte schließen Sie ein Mikrofon an.",
      microphoneInUse:
        "Mikrofon wird bereits von einer anderen Anwendung verwendet.",
      startFailed:
        "Aufnahme konnte nicht gestartet werden. Bitte versuchen Sie es erneut.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Mit anderen Einstellungen wiederholen",
      description:
        "Wählen Sie ein Modell und eine Persona, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Persona, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
  },
  suggestedPrompts: {
    title: "Wie kann ich Ihnen helfen?",
    privateTitle: "Ihr privater KI-Assistent",
    sharedTitle: "Zusammenarbeit mit KI",
    publicTitle: "Treten Sie dem öffentlichen KI-Forum bei",
    incognitoTitle: "Anonymer KI-Chat",
    more: "Mehr",
    selectPersona: "Persona auswählen",
    noPrompts: "Keine Vorschläge für diese Persona",
  },
  messageEditor: {
    placeholder: "Bearbeiten Sie Ihre Nachricht...",
    hint: {
      branch: "zum Verzweigen",
      cancel: "zum Abbrechen",
    },
    titles: {
      branch: "Konversation verzweigen",
      cancel: "Bearbeitung abbrechen",
    },
    buttons: {
      branch: "Verzweigen",
      branching: "Verzweige...",
      cancel: "Abbrechen",
    },
  },
  folderList: {
    confirmDelete:
      'Ordner "{{folderName}}" löschen und {{count}} Chat(s) nach Allgemein verschieben?',
    enterFolderName: "Ordnernamen eingeben:",
    newChatInFolder: "Neuer Chat im Ordner",
    moveUp: "Nach oben",
    moveDown: "Nach unten",
    renameFolder: "Ordner umbenennen",
    moveToFolder: "In Ordner verschieben",
    newSubfolder: "Neuer Unterordner",
    deleteFolder: "Ordner löschen",
    deleteDialog: {
      title: "Ordner löschen",
      description: 'Möchten Sie "{{folderName}}" wirklich löschen?',
      descriptionWithThreads:
        'Möchten Sie "{{folderName}}" wirklich löschen? Dieser Ordner enthält {{count}} Thread(s), die ebenfalls gelöscht werden.',
    },
    today: "Heute",
    lastWeek: "Letzte 7 Tage",
    lastMonth: "Letzte 30 Tage",
    folderNotFound: "Ordner nicht gefunden",
    emptyFolder: "Noch keine Chats oder Ordner hier",
    createSubfolder: "Unterordner erstellen",
    rename: "Umbenennen",
    changeIcon: "Symbol ändern",
    delete: "Löschen",
    newFolder: "Neuer Ordner",
  },
  threadedView: {
    expandReplies: "Antworten erweitern",
    collapseReplies: "Antworten einklappen",
    continueThread: "Thread fortsetzen ({{count}} weitere {{replyText}})",
    reply: "Antwort",
    replies: "Antworten",
    retryModal: {
      title: "Mit anderen Einstellungen wiederholen",
      description:
        "Wählen Sie ein Modell und eine Persona, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Persona, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
    actions: {
      vote: "Abstimmen",
      upvote: "Upvote",
      downvote: "Downvote",
      respondToAI:
        "Auf diese KI-Nachricht mit einer anderen KI-Persona antworten",
      loadingAudio: "Audio wird geladen...",
      stopAudio: "Audio stoppen",
      playAudio: "Audio abspielen",
      stop: "Stoppen",
      play: "Abspielen",
      reply: "Antworten",
      replyToMessage: "Auf diese Nachricht antworten (erstellt einen Branch)",
      edit: "Bearbeiten",
      editMessage: "Diese Nachricht bearbeiten (erstellt einen Branch)",
      retry: "Wiederholen",
      retryWithDifferent: "Mit anderem Modell/Ton wiederholen",
      answerAsAI: "Als KI antworten",
      generateAIResponse: "KI-Antwort generieren",
      share: "Teilen",
      copyPermalink: "Permalink kopieren",
      delete: "Löschen",
      deleteMessage: "Diese Nachricht löschen",
      parent: "Übergeordnet",
    },
    userFallback: "Benutzer",
    assistantFallback: "Assistent",
    youLabel: "Sie",
  },
  flatView: {
    postNumber: "Beitrag #{{number}}",
    postsById: "{{count}} Beiträge von dieser ID",
    idLabel: "ID: {{id}}",
    anonymous: "Anonym",
    youLabel: "Sie",
    assistantFallback: "Assistent",
    replyingTo: "Antwort auf:",
    replies: "Antworten:",
    clickToCopyRef: "Klicken zum Kopieren der Referenz",
    timestamp: {
      sun: "So",
      mon: "Mo",
      tue: "Di",
      wed: "Mi",
      thu: "Do",
      fri: "Fr",
      sat: "Sa",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
    retryModal: {
      title: "Mit anderen Einstellungen wiederholen",
      description:
        "Wählen Sie ein Modell und eine Persona, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Persona, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
    actions: {
      loadingAudio: "Audio wird geladen...",
      stopAudio: "Audio stoppen",
      playAudio: "Audio abspielen",
      stop: "Stoppen",
      play: "Abspielen",
      reply: "Antworten",
      replyToMessage: "Auf diese Nachricht antworten (erstellt einen Branch)",
      edit: "Bearbeiten",
      editMessage: "Diese Nachricht bearbeiten (erstellt einen Branch)",
      retry: "Wiederholen",
      retryWithDifferent: "Mit anderem Modell/Ton wiederholen",
      answerAsAI: "Als KI antworten",
      generateAIResponse: "KI-Antwort generieren",
      insertQuote: "Zitatzeichen '>' einfügen",
      copyReference: "Referenzlink kopieren",
      delete: "Löschen",
      deleteMessage: "Diese Nachricht löschen",
    },
  },
  toolCall: {
    search: {
      title: "Durchsuche das Web",
      query: "Anfrage",
    },
    multiple: "{{count}} Tool-Aufrufe",
  },
  threadList: {
    deleteDialog: {
      title: "Thread löschen",
      description:
        'Möchten Sie "{{title}}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden und alle Nachrichten in diesem Thread werden dauerhaft gelöscht.',
    },
  },
};
