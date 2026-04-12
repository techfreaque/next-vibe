import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Anmelden",
      logout: "Abmelden",
    },
  },
  common: {
    newChat: "Neuer Thread",
    newPrivateChat: "Privater Thread",
    newSharedChat: "Geteilter Thread",
    newPublicChat: "Öffentlicher Thread",
    newIncognitoChat: "Inkognito Thread",
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
    cronChats: "Cron-Threads",
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
    close: "Schließen",
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
      copyAsMarkdown: "Als Markdown kopieren",
      copyAsText: "Als Text kopieren",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Audio-Wiedergabe stoppen",
      playAudio: "Audio abspielen (+{{cost}} Credits)",
      cancelLoading: "Laden abbrechen",
      answerAsAI: "Als KI-Modell antworten",
      deleteMessage: "Nachricht löschen",
      actualCostUsed: "Tatsächlich verwendete Credits für diese Nachricht",
      tokensUsed: "Verwendete Tokens insgesamt",
      credits: "Credits",
      tokens: "Tokens",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Konversation von hier verzweigen",
      retry: "Mit anderem Modell/Skill wiederholen",
      deleteMessage: "Nachricht löschen",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Lineare Ansicht (ChatGPT-Stil)",
      threadedView: "Thread-Ansicht (Reddit/Discord-Stil)",
      flatView: "Flache Ansicht (4chan-Stil)",
      debugView: "Debug-Ansicht (mit System-Prompts)",
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
      title: "KI-Tools",
      description:
        "Normalerweise müssen Sie keine Tools verwalten. Wenn Hilfe aktiviert ist, kann die KI jedes Tool bei Bedarf aufrufen. Pinnen Sie Tools hier nur, wenn Sie sie immer im Kontext haben möchten.",
      searchPlaceholder: "Tools durchsuchen...",
      loading: "Tools werden geladen...",
      noToolsFound: "Keine Tools entsprechen Ihrer Suche",
      noToolsAvailable: "Keine KI-Tools verfügbar",
      expandAll: "Alle erweitern",
      collapseAll: "Alle einklappen",
      selectAll: "Alle auswählen",
      deselectAll: "Alle abwählen",
      enableAll: "Alle aktivieren",
      resetToDefault: "Auf Standard zurücksetzen",
      stats: "{{enabled}} von {{total}} Tools angepinnt",
      aliases: "Aliase",
      requireConfirmation: "Bestätigung vor Verwendung erforderlich",
      activeLabel: "angepinnt",
      enabledLabel: "erlaubt",
      totalLabel: "gesamt",
      activeTooltip:
        "Angepinnte Tools sind immer im Kontext - die KI sieht sie bei jeder Anfrage",
      enabledTooltip:
        "Erlaubte Tools können bei Bedarf aufgerufen werden, wenn Hilfe aktiviert ist",
      legendActive: "Immer im Kontext (angepinnt)",
      legendConfirm: "Fragt vor dem Ausführen",
      activeOn: "Angepinnt - immer im Kontext. Klicken zum Lösen",
      activeOff:
        "Nicht angepinnt - KI kann trotzdem bei Bedarf aufrufen. Klicken zum Anpinnen",
      confirmOn: "Fragt nach Bestätigung - klicken zum Deaktivieren",
      confirmOff: "Läuft automatisch - klicken um Bestätigung zu verlangen",
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

  createSkill: {
    title: "Benutzerdefinierten Charakter erstellen",
    description:
      "Gestalte deinen eigenen KI-Charakter mit individueller Persönlichkeit, Expertise und Verhalten.",
    icon: "Icon",
    name: "Name",
    namePlaceholder: "z.B. Code Reviewer",
    descriptionLabel: "Beschreibung",
    descriptionPlaceholder: "Kurze Beschreibung, was dieser Charakter tut",
    category: "Kategorie",
    selectCategory: "Kategorie auswählen",
    systemPrompt: "System-Prompt",
    systemPromptPlaceholder:
      "Definiere, wie sich dieser Charakter verhalten soll. Sei spezifisch über seine Persönlichkeit, Expertise und wie er antworten soll.",
    voice: "Stimme",
    voicePlaceholder: "Wähle eine Stimme für Text-to-Speech",
    create: "Charakter erstellen",
    creating: "Erstelle...",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Bitte gib einen Namen ein",
      descriptionRequired: "Bitte gib eine Beschreibung ein",
      systemPromptRequired: "Bitte gib einen System-Prompt ein",
      createFailed:
        "Charakter konnte nicht erstellt werden. Bitte versuche es erneut.",
    },
  },

  voice: {
    male: "Männlich",
    female: "Weiblich",
  },

  editSkill: {
    title: "Als benutzerdefinierten Charakter bearbeiten",
    description:
      "Erstelle einen benutzerdefinierten Charakter basierend auf dieser Skill. Du kannst alle Einstellungen ändern.",
    loginRequired:
      "Bitte melde dich an, um benutzerdefinierte Charaktere zu erstellen und zu bearbeiten. Benutzerdefinierte Charaktere werden in deinem Konto gespeichert.",
    name: "Name",
    namePlaceholder: "Name des benutzerdefinierten Charakters",
    descriptionLabel: "Beschreibung",
    descriptionPlaceholder: "Was macht dieser Charakter?",
    category: "Kategorie",
    icon: "Icon",
    voice: "Stimme",
    voicePlaceholder: "Stimme auswählen",
    preferredModel: "Bevorzugtes Modell",
    preferredModelPlaceholder: "Optionales bevorzugtes Modell",
    systemPrompt: "System-Prompt",
    systemPromptPlaceholder: "Definiere das Verhalten des Charakters...",
    save: "Als benutzerdefiniert speichern",
    saveAsCopy: "Als Kopie speichern",
    saving: "Erstelle...",
    cancel: "Abbrechen",
    login: "Anmelden zum Bearbeiten",
    signup: "Registrieren zum Bearbeiten",
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
    credit: "{{count}} Credit",
    credits: "{{count}} Credits",
    freeCredit: "{{count}} kostenloses Credit",
    freeCredits: "{{count}} kostenlose Credits",
    expiringCredit: "{{count}} ablaufendes Credit",
    expiringCredits: "{{count}} ablaufende Credits",
    permanentCredit: "{{count}} dauerhaftes Credit",
    permanentCredits: "{{count}} dauerhafte Credits",
    expiresOn: "Läuft ab am {{date}}",
    expiresAt: "Läuft ab",
    approximateCost:
      "Ungefähre Kosten basierend auf {{inputTokens}} Eingabe- und {{outputTokens}} Ausgabe-Tokens. Tatsächliche Kosten können variieren.",
    buyMore: "Credits kaufen",
    viewDetails: "Details",
    breakdown: "Credit-Aufschlüsselung",
    navigation: {
      profile: "Profil",
      subscription: "Abonnement & Credits",
      referral: "Empfehlungsprogramm",
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
    retry: "Mit anderem Modell/Skill wiederholen",
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
    cancellingGeneration: "Wird abgebrochen...",
    sendMessage: "Nachricht senden",
    shareThread: "Thread teilen",
    manageSharing: "Freigabe verwalten",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-konversation",
  },
  input: {
    placeholder: "Geben Sie Ihre Nachricht ein...",
    imagePlaceholder: "Beschreiben Sie das Bild, das Sie generieren möchten...",
    audioPlaceholder:
      "Beschreiben Sie die Musik oder den Klang, den Sie generieren möchten...",
    noPermission: "Sie haben keine Berechtigung, Nachrichten zu posten",
    noPostPermission:
      "Sie haben keine Berechtigung, Nachrichten in diesem Thread zu posten",
    noCreateThreadPermission:
      "Sie haben keine Berechtigung, Threads in diesem Ordner zu erstellen",
    noCreateThreadPermissionInRootFolder:
      "Sie haben keine Berechtigung, Threads in diesem Ordner zu erstellen. Bitte melden Sie sich an oder wählen Sie einen Unterordner.",
    keyboardShortcuts: {
      press: "Drücken Sie",
      enter: "Eingabe",
      toSend: "zum Senden",
      shiftEnter: "Umschalt+Eingabe",
      forNewLine: "für neue Zeile",
      ctrlV: "Strg+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "zum Dateien einfügen",
    },
    speechInput: {
      stopRecording: "Aufnahme stoppen",
      processing: "Verarbeite...",
      startVoiceInput: "Spracheingabe starten (+{{cost}} Credits/Min)",
      recordingClickToStop: "Aufnahme läuft... Zum Stoppen klicken",
      transcribing: "Transkribiere...",
    },
    attachments: {
      uploadFile: "Dateien anhängen",
      attachedFiles: "Angehängte Dateien",
      addMore: "Mehr hinzufügen",
      removeFile: "Datei entfernen",
      fileTooLarge: "Datei ist zu groß (max 10MB)",
      invalidFileType: "Ungültiger Dateityp",
      uploadError: "Fehler beim Hochladen der Datei",
    },
  },
  imageGen: {
    sizeSquare: "Quadrat 1024×1024",
    sizeLandscape: "Querformat 1792×1024",
    sizePortrait: "Hochformat 1024×1792",
    qualityStandard: "Standard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "~8s",
    durationMedium: "~20s",
    durationLong: "~30s",
  },
  modelSelector: {
    placeholder: "Modell auswählen",
    addNewLabel: "Modell hinzufügen",
    costFree: "Kostenlos",
    costCredits: "{{count}} Credits/Nachricht",
    costCreditsPlural: "{{count}} Credits/Nachricht",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "Was brauchst du?",
    tuneIt: "Anpassen",
    recommended: "Empfohlen",
    alsoGood: "Auch gut",
    helpMeChoose: "Hilf mir wählen",
    useThis: "Dieses nutzen",
    quality: "Qualität",
    speedLabel: "Geschwindigkeit",
    // Task pills
    tasks: {
      code: "Code",
      write: "Schreiben",
      chat: "Chat",
      think: "Denken",
      create: "Erstellen",
      unfiltered: "Ungefiltert",
    },
    // Tuning toggles
    effort: "Aufwand",
    "effort.simple": "Einfach",
    "effort.regular": "Normal",
    "effort.complex": "Komplex",
    speed: "Tempo",
    "speed.fast": "Schnell",
    "speed.balanced": "Ausgewogen",
    "speed.thorough": "Gründlich",
    content: "Inhalt",
    "content.normal": "Normal",
    "content.sensitive": "Sensibel",
    "content.adult": "Erwachsen",
    // Wizard mode
    wizard: {
      title: "Hilf mir wählen",
      whatWorking: "Woran arbeitest du?",
      contentType: "Enthält es nicht jugendfreie Inhalte?",
      whatMatters: "Was ist dir am wichtigsten?",
      hereIsMyPick: "Meine Empfehlung:",
      options: {
        code: "Code schreiben",
        write: "Text oder Inhalte schreiben",
        chat: "Einfach chatten / Fragen stellen",
        think: "Etwas das tiefes Nachdenken erfordert",
        create: "Kreative Arbeit",
        unfiltered: "Unzensierte / Erwachseneninhalte",
        safeContent: "Sicher halten (Standard-Modelle)",
        adultContent: "Ja, nicht jugendfreie Inhalte (unzensierte Modelle)",
        speed: "Geschwindigkeit",
        speedDesc: "Ich möchte schnelle Antworten",
        cost: "Kosten",
        costDesc: "Günstig oder kostenlos",
        quality: "Qualität",
        qualityDesc: "Gib mir die beste Ausgabe",
        balanced: "Ausgewogen",
        balancedDesc: "Ein bisschen von allem",
      },
    },
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
  characterSelector: {
    placeholder: "Skill auswählen",
    addNewLabel: "Skill erstellen",
    defaultIcon: "✨",
    grouping: {
      bySource: "Nach Quelle",
      byCategory: "Nach Kategorie",
      sourceLabels: {
        builtIn: "Eingebaut",
        my: "Meine Skills",
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
      title: "Benutzerdefinierte Skill erstellen",
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
          placeholder: "Kurze Beschreibung der Skill",
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
      create: "Skill erstellen",
    },
  },
  searchToggle: {
    search: "Suche",
    enabledTitle: "Brave Search aktiviert (+0,65 Credits pro Suche)",
    disabledTitle: "Brave Search deaktiviert (+0,65 Credits pro Suche)",
    creditIndicator: "+0,65",
    unconfiguredTitle: "Websuche nicht konfiguriert",
    unconfiguredBrave: "Für Brave Search, füge zu deiner .env hinzu:",
    unconfiguredKagi: "Für Kagi Search, füge zu deiner .env hinzu:",
  },
  toolsButton: {
    title: "KI-Tools konfigurieren",
    tools: "Tools",
  },
  combinedSelector: {
    tabs: {
      quick: "Schnell",
      skill: "Skill",
      model: "Modell",
    },
    current: "Aktuell",
    favoriteSkills: "Lieblings-Skills",
    favoriteModels: "Lieblings-Modelle",
    showAll: "Alle anzeigen",
    selectModel: "Modell auswählen",
    forSkill: "für {{character}}",
    recommended: "Empfohlen",
    favorites: "Favoriten",
    all: "Alle",
    noFavorites: "Noch keine Favoriten. Markiere welche mit einem Stern.",
    noModels: "Keine Modelle verfügbar",
    filteredBySkill:
      "Zeige {{compatible}} von {{total}} Modellen (nach Skill gefiltert)",
    selectSkill: "Skill auswählen",
    allSkills: "Alle",
  },
  selector: {
    noResults: "Keine Ergebnisse gefunden",
    tabs: {
      quick: "Schnell",
      characters: "Skills",
      build: "Erstellen",
      favorites: "Meine Favoriten",
      browse: "Skills durchsuchen",
    },
    tiers: {
      quick: "Schnell",
      smart: "Klug",
      best: "Beste",
    },
    price: {
      free: "GRATIS",
      smart: "3-8cr",
      best: "10-20cr",
    },
    content: "Inhalt",
    contentLevels: {
      safe: "Sicher",
      open: "Offen",
      unlim: "Unlim",
    },
    free: "Kostenlos",
    favorites: "Favoriten",
    suggested: "Vorgeschlagen",
    noFavorites: "Noch keine Favoriten",
    noFavoritesHint: "Speichere deine Lieblings-Skills für schnellen Zugriff",
    browseAllSkills: "Alle Skills durchsuchen...",
    customSetup: "Benutzerdefinierte Einrichtung...",
    selectSkill: "Skill auswählen",
    modelCreditDisplay: {
      tokenBased: {
        header: "Kosten pro Nachricht",
        costRangeLabel: "Typischer Bereich:",
        costRangeValue: "{{min}} - {{max}} Credits",
        examplesLabel: "Beispiele:",
        examples: {
          short: "Kurzes Gespräch",
          medium: "Mittleres Gespräch",
          long: "Langes Gespräch",
        },
        triggersCompacting: "⚡ Aktiviert Komprimierung",
        tokensCount: "{{count}} Tokens",
        explanation:
          "Die KI verarbeitet bei jeder Nachricht den gesamten Gesprächsverlauf. Längere Gespräche kosten mehr, weil mehr Kontext verarbeitet werden muss.",
        compactingLabel: "✨ Auto-Komprimierung:",
        compactingExplanation:
          " Bei {{threshold}} Tokens werden ältere Nachrichten automatisch zusammengefasst, um Kosten zu reduzieren und gleichzeitig den Kontext zu bewahren.",
      },
      fixed: {
        title: "Preise für {{model}}",
        freeDescription:
          "Dieses Modell ist vollständig kostenlos ohne Credit-Kosten.",
        fixedDescription:
          "Dieses Modell hat fixe Kosten pro Nachricht, unabhängig von der Länge.",
        costPerMessage: "Kosten pro Nachricht:",
        freeExplanation:
          "Dies ist ein kostenloses Modell ohne Nutzungsbeschränkungen.",
        freeHighlight: "Perfekt zum Testen und Experimentieren.",
        simpleLabel: "Einfache Preise:",
        simpleExplanation:
          " Jede Nachricht kostet gleich viel, egal ob kurz oder lang. Kein Token-Zählen erforderlich.",
      },
      creditValue: "1 Credit = {{value}}",
    },
    all: "Alle",
    buildMode: "Erstellungsmodus",
    forSkill: "für {{character}}",
    intelligence: "Intelligenz",
    contentLevel: "Inhaltsstufe",
    speed: "Geschwindigkeit",
    any: "Beliebig",
    result: "Ergebnis",
    bestMatch: "Beste Übereinstimmung für deine Einstellungen",
    useRecommended: "Empfohlen verwenden: {{model}}",
    filteredBySettings: "Zeige {{filtered}} von {{total}} Modellen",
    recommended: "Empfohlen",
    noModels: "Keine Modelle entsprechen deinen Filtern",
    currentConfig: "Aktuell im Gespräch mit",
    switchModel: "Modell wechseln",
    keepsConversation: "(behält Gespräch)",
    switchSkill: "Skill wechseln",
    startsNewChat: "(startet neuen Chat)",
    start: "Starten",
    addFav: "Hinzufügen",
    searchSkills: "Skills suchen...",
    noSkillsFound: "Keine Skills gefunden",
    createCustom: "Erstellen",
    skill: "Skill",
    savePreset: "Speichern",
    perMessage: "pro Nachricht",
    compatibleModels: "{{count}} kompatible Modelle",
    categories: {
      companions: "Begleiter",
      assistants: "Assistenten",
      coding: "Programmierung",
      creative: "Kreativ",
      writing: "Schreiben",
      roleplay: "Rollenspiel",
      analysis: "Analyse",
      education: "Bildung",
      controversial: "Kontrovers",
      custom: "Benutzerdefiniert",
    },
    // v20 additions
    active: "Aktiv",
    addFavorite: "Favorit hinzufügen",
    settings: "Einstellungen",
    noModel: "Kein Modell ausgewählt",
    model: "Modell",
    autoSelect: "Filterbasierte Auswahl",
    manualSelect: "Manuell auswählen...",
    best: "BESTE",
    bestForFilter: "Bestes für diesen Filter",
    setupRequired: "Einrichtung erforderlich",
    providerUnconfigured: "Anbieter-API-Schlüssel nicht konfiguriert",
    addEnvKey: "Zur .env hinzufügen",
    noMatchingModels: "Keine Modelle entsprechen deinen Filtern",
    noModelsWarning:
      "Keine Modelle entsprechen diesen Filtern. Passe deine Einstellungen an.",
    allModelsCount: "{{count}} Modelle verfügbar",
    filteredModelsCount: "{{count}} passende Modelle",
    showAllModels: "Alle {{count}} Modelle zeigen",
    showFiltered: "Gefiltert zeigen",
    showLegacyModels_one: "{{count}} Legacy-Modell anzeigen",
    showLegacyModels_other: "{{count}} Legacy-Modelle anzeigen",
    applyChanges: "Änderungen anwenden",
    thisChatOnly: "Nur dieser Chat (temporär)",
    saveToPreset: 'Speichern unter "{{name}}"',
    saveAsNew: "Als neuen Favorit speichern...",
    cancel: "Abbrechen",
    apply: "Anwenden",
    contentFilter: "Inhalt",
    maxPrice: "Max. Preis",
    creditsExact: "{{cost}} Credits",
    creditsSingle: "1 Credit",
    searchResults: "{{count}} Ergebnisse",
    defaults: "Standard",
    customize: "Anpassen",
    addWithDefaults: "Mit Standardwerten hinzufügen",
    seeAll: "Alle anzeigen",
    back: "Zurück",
    use: "Verwenden",
    editSettings: "Einstellungen bearbeiten",
    editModelSettings: "Modelleinstellungen bearbeiten",
    modelOnly: "Nur Modell",
    yourSetups: "Deine Setups",
    setup: "Setup",
    delete: "Löschen",
    editSkill: "Als benutzerdefinierten Charakter bearbeiten",
    switchSkillBtn: "Charakter wechseln",
    editSkillBtn: "Charakter bearbeiten",
    autoSelectedModel: "Filterbasiert:",
    manualSelectedModel: "Ausgewählt:",
    skillSelectedModel: "Charakter-Modell:",
    selectModelBelow: "Wählen Sie unten ein Modell aus",
    chooseYourPath: "Wählen Sie Ihren Weg",
    twoWaysToChat: "Zwei flexible Möglichkeiten zum Chatten",
    directModels: "Direkter Modell-Zugriff",
    directModelsDesc:
      "Konfigurieren Sie Filter oder wählen Sie manuell aus {{count}} Modellen. Volle Kontrolle über die KI-Auswahl.",
    skillPresets: "Charakter-Voreinstellungen",
    characterPresetsDesc:
      "Wählen Sie unten einen Charakter. Jeder hat optimierte Einstellungen, die Sie jederzeit anpassen können.",
    startWithDirectModels: "Mit direkten Modellen starten",
    orBrowsePresets: "Oder Charakter-Voreinstellungen durchsuchen",
    loading: "Laden...",
    noModelsMatch: "Keine Modelle gefunden",
    adjustFiltersMessage:
      "Passen Sie Ihre Filterkriterien an, um verfügbare Modelle zu finden",
    auto: "Auto",
    manual: "Manuell",
    showLess: "Weniger anzeigen",
    showMore: "{{count}} weitere anzeigen",
    applyOnce: "Einmal anwenden",
    saveChanges: "Änderungen speichern",
    useOnce: "Einmal verwenden",
    saveAsDefault: "Zu Favoriten hinzufügen",
    deleteSetup: "Setup löschen",
    skillSetup: "Charakter-Setup",
    separator: " • ",
    sortBy: "Sortieren nach",
    // UX improvements v21
    mySetups: "Meine Setups",
    addNew: "Neu hinzufügen",
    noSetupsTitle: "Noch keine Setups",
    noSetupsDescription: "Erstelle dein erstes KI-Charakter-Setup",
    getStarted: "Loslegen",
    currentModel: "Aktuelles Modell",
    modelSelection: "Modellauswahl",
    autoMode: "Automatisch",
    manualMode: "Manuell wählen",
    skillMode: "Charakter-Standard",
    autoModeDescription:
      "Wählt automatisch das beste Modell basierend auf deinen Einstellungen",
    manualModeDescription: "Wähle selbst ein beliebiges Modell aus",
    characterBasedModeDescription:
      "Nutzt das Modell, für das dieser Charakter entwickelt wurde",
    customizeSettings: "Einstellungen vor dem Hinzufügen anpassen",
    useNow: "Jetzt verwenden",
    browseAll: "Alle Charaktere durchsuchen",
    add: "Hinzufügen",
    // v22 UX improvements
    quickSwitch: "Schnellwechsel",
    switchTo: "Zu diesem Setup wechseln",
    adjustSettings: "Einstellungen anpassen",
    addAnotherSetup: "Weiteres Setup hinzufügen",
    comingSoon: "Demnächst verfügbar",
    // Skill requirements
    requirements: {
      skillConflict: "Skill-Konflikt",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Zu hoch",
      tooLow: "Zu niedrig",
      intelligenceTooLow: "Intelligenz zu niedrig (min: {{min}})",
      intelligenceTooHigh: "Intelligenz zu hoch (max: {{max}})",
      contentTooLow: "Inhaltsebene zu niedrig (min: {{min}})",
      contentTooHigh: "Inhaltsebene zu hoch (max: {{max}})",
      allMet: "Erfüllt alle Anforderungen",
      violations: "{{count}} Anforderungsverletzungen",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Skill wechseln",
      description:
        "Wechsle zu einer anderen Skill ohne deine Einstellungen zu verlieren",
      searchPlaceholder: "Skills durchsuchen...",
      noResults: "Keine Skills gefunden",
      keepSettings: "Aktuelle Modelleinstellungen beibehalten",
      keepSettingsDesc:
        "Verwende deine aktuellen Intelligenz-, Preis- und Inhaltsfilter mit der neuen Skill",
      cancel: "Abbrechen",
      confirm: "Skill wechseln",
    },
  },
  onboarding: {
    back: "Zurück",
    // Screen 1: Welcome
    welcome: {
      title: "Stell dir uns als dein KI-Team vor.",
      line1:
        "Ein Begleiter für alltägliche Gespräche. Spezialisten für Coding, Recherche, Schreiben - du wählst einen, wenn die Aufgabe es verlangt.",
      line2:
        "Gleicher Chat. Du wechselst, wenn es drauf ankommt. Dauert Sekunden.",
      line3: "Lass uns dich in unter einer Minute einrichten.",
      continue: "Los geht's",
    },
    // Screen 2: Guest warning (only for logged-out users)
    guest: {
      title: "Du surfst als Gast",
      line1:
        "Deine Einstellungen, dein Begleiter und dein Chatverlauf werden nur lokal auf diesem Gerät gespeichert.",
      line2:
        "Melde dich an, um alles geräteübergreifend zu synchronisieren - und dein Setup nie zu verlieren.",
      signIn: "Anmelden / Konto erstellen",
      continueAnyway: "Als Gast fortfahren",
      note: "Du kannst dich jederzeit über das Menü anmelden.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Wähle deinen Begleiter",
      subtitle: "Dein täglicher Gesprächspartner",
      budgetTitle: "Wie leistungsfähig soll deine KI sein?",
      budgetSubtitle: "Du kannst das jederzeit in den Einstellungen ändern",
      next: "Weiter",
      selectFirst: "Wähle einen Begleiter zum Fortfahren",
      budget: {
        smart: {
          label: "Smart",
          desc: "Schnell, effizient, bewältigt die meisten Aufgaben gut",
        },
        brilliant: {
          label: "Brilliant",
          desc: "Beste Qualität - ideal für komplexe Fragen, Schreiben und Analysen",
        },
        max: {
          label: "Max",
          desc: "Höchstes Denkvermögen, keine Kompromisse - für wenn es wirklich darauf ankommt",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "Wofür wirst du es hauptsächlich nutzen?",
      subtitle:
        "Wir fügen automatisch die richtigen Spezialisten zu deinem KI-Toolkit hinzu.",
      saving: "Einrichtung...",
      start: "Chat starten",
      skip: "Überspringen - ich richte es später ein",
      coding: {
        label: "Coding & Technik",
        hint: "Vibe Coder, Coder",
      },
      research: {
        label: "Recherche & Analyse",
        hint: "Researcher, Data Analyst",
      },
      writing: {
        label: "Schreiben & Bearbeiten",
        hint: "Writer, Editor",
      },
      business: {
        label: "Business & Strategie",
        hint: "Business Advisor, Product Manager",
      },
      learning: {
        label: "Lernen & Studium",
        hint: "Tutor, Socratic Questioner",
      },
      chat: {
        label: "Einfach chatten",
        hint: "Dein Begleiter reicht aus",
      },
    },
    // Companion personalities
    thea: {
      tagline: "Warmherzig & weise",
      description: "Wie eine unterstützende Freundin, die dich versteht.",
    },
    hermes: {
      tagline: "Mutig & direkt",
      description: "Wie ein Coach, der dich zu deinem Besten antreibt.",
    },
    // Legacy keys
    startChatting: "Chat starten",
    canChangeLater: "Du kannst dies später jederzeit ändern",
  },
  tiers: {
    any: "Beliebig",
    anyDesc: "Keine Einschränkung",
    price: {
      cheap: "Günstig",
      standard: "Standard",
      premium: "Premium",
      cheapDesc: "0-3 Credits pro Nachricht",
      standardDesc: "3-9 Credits pro Nachricht",
      premiumDesc: "9+ Credits pro Nachricht",
    },
    intelligence: {
      quick: "Schnell",
      smart: "Intelligent",
      brilliant: "Brillant",
      quickDesc: "Schnell & effizient",
      smartDesc: "Ausgewogene Qualität",
      brilliantDesc: "Tiefes Denken",
    },
    speed: {
      fast: "Schnell",
      balanced: "Ausgewogen",
      thorough: "Gründlich",
      fastDesc: "Schnelle Antworten",
      balancedDesc: "Gute Balance",
      thoroughDesc: "Detaillierte Analyse",
    },
    content: {
      mainstream: "Mainstream",
      open: "Offen",
      uncensored: "Unzensiert",
      mainstreamDesc: "Standard-Sicherheit",
      openDesc: "Weniger Einschränkungen",
      uncensoredDesc: "Keine Einschränkungen",
    },
  },
  categories: {
    companion: "Begleiter",
    assistant: "Assistenten",
    coding: "Programmierung",
    writing: "Schreiben",
    analysis: "Analyse",
    roleplay: "Rollenspiel",
    creative: "Kreativ",
    education: "Bildung",
    controversial: "Kontrovers",
    custom: "Benutzerdefiniert",
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
    cronDescription:
      "Automatisierte Unterhaltungen durch geplante Cron-Aufgaben.",
    accessModal: {
      title: "Konto erforderlich",
      privateTitle: "Private Threads",
      sharedTitle: "Geteilte Threads",
      publicTitle: "Öffentliches Forum",
      incognitoTitle: "Inkognito-Modus",
      privateExplanation:
        "Private Threads sind Ihr persönlicher Bereich für Gespräche mit KI. Alle Ihre Chats werden sicher auf unseren Servern gespeichert und automatisch auf allen Ihren Geräten synchronisiert.",
      sharedExplanation:
        "Geteilte Threads ermöglichen es Ihnen, Gespräche zu erstellen und sie mit anderen über sichere Links zu teilen. Perfekt für die Zusammenarbeit und das Teilen von Erkenntnissen mit Ihrem Team oder Freunden.",
      publicExplanation:
        "Das öffentliche Forum ist ein durch den ersten Verfassungszusatz geschützter Raum, in dem Menschen und KI in offenen Dialog treten. Teilen Sie Ideen, hinterfragen Sie Perspektiven und nehmen Sie an unzensierten Diskussionen teil.",
      incognitoExplanation:
        "Der Inkognito-Modus hält Ihre Gespräche völlig privat und lokal. Ihre Chats werden nur in Ihrem Browser gespeichert und niemals an unsere Server gesendet - nicht einmal mit Ihrem Konto verknüpft.",
      requiresAccount:
        "Um auf {{folderName}} zuzugreifen, müssen Sie ein Konto erstellen oder sich anmelden.",
      loginButton: "Anmelden",
      signupButton: "Registrieren",
      close: "Schließen",
    },
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
  // Common
  timestamp: {
    justNow: "gerade eben",
    minutesAgo: "vor {{count}}m",
    hoursAgo: "vor {{count}}h",
    daysAgo: "vor {{count}}d",
  },
  publicFeed: {
    // Header
    header: {
      title: "Öffentliches Forum",
      description:
        "Ein durch den First Amendment geschützter Raum, in dem freie Meinungsäußerung gedeiht. Diskutieren Sie mit KI-Modellen und Nutzern weltweit. Teilen Sie Ideen, hinterfragen Sie Perspektiven und sprechen Sie frei ohne Zensur.",
    },
    // Sort modes
    sort: {
      hot: "Beliebt",
      rising: "Aufsteigend",
      new: "Neu",
      following: "Folge ich",
    },
    searchPlaceholder: "Threads durchsuchen...",
    noResults: "Keine Ergebnisse gefunden",
    noThreads: "Noch keine Threads. Starten Sie ein Gespräch!",
    comments: "Kommentare",
    bestAnswer: "Beste Antwort",
    rising: "Aufsteigend",
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
  voiceMode: {
    unconfiguredTitle: "Sprache nicht konfiguriert",
    unconfiguredDescription:
      "Füge EDEN_AI_API_KEY zu deiner .env hinzu, um Sprache zu aktivieren. Schlüssel unter app.edenai.run",
    inputMode: "Spracheingabemodus",
    transcribeMode: "Transkribieren",
    transcribeModeDescription: "Aufnehmen → Text erscheint im Eingabefeld",
    talkMode: "Sprechen",
    talkModeDescription: "Aufnehmen → Sofort senden",
    callMode: "Anrufmodus",
    callModeDescription: "Kurze Antworten + Autoplay",
    autoPlayTTS: "Antworten automatisch abspielen",
    autoPlayTTSOn: "Antworten werden gesprochen",
    autoPlayTTSOff: "Nur manuelles Abspielen",
    tapToRecord: "Tippen zum Aufnehmen",
    tapToTalk: "Tippen zum Sprechen",
    tapToTranscribe: "Tippen zum Transkribieren",
    listeningTalk: "Höre zu... Loslassen zum Senden",
    listeningTranscribe: "Höre zu... Tippen zum Stoppen",
    stopSpeaking: "Sprechen stoppen",
    longPressHint: "Gedrückt halten für Optionen",
    switchToText: "Zu Text wechseln",
    switchToCall: "Zu Anruf wechseln",
    recording: {
      paused: "Pausiert",
      pause: "Pause",
      resume: "Fortsetzen",
    },
    actions: {
      cancel: "Abbrechen",
      toInput: "Zur Eingabe",
      sendVoice: "Stimme senden",
    },
    callOverlay: {
      backToChat: "Zurück zum Chat",
      listening: "Höre zu...",
      processing: "Verarbeite...",
      thinking: "Denke nach...",
      speaking: "Spreche...",
      tapToSpeak: "Tippen zum Sprechen",
      tapToStop: "Tippen zum Stoppen",
      endCall: "Anruf beenden",
      aiThinking: "KI denkt nach...",
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
    authorWithId: "{{name}} [{{id}}]",
    edited: "bearbeitet",
    error: "Fehler",
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
  batchToolConfirmation: {
    title: "Stapel-Tool-Bestätigung",
  },
  reasoning: {
    title: "Denken",
    multiple: "{{count}} Denkschritte",
    step: "Schritt {{number}}",
  },
  modelUtilities: {
    chat: "Alltäglicher Chat",
    smart: "Erweitert & Intelligent",
    coding: "Programmierung & Entwicklung",
    creative: "Kreatives Schreiben",
    analysis: "Analyse & Recherche",
    fast: "Schnell & Effizient",
    multimodal: "Multimodal (Vision)",
    vision: "Sehen & Bildverständnis",
    imageGen: "Bildgenerierung",
    uncensored: "Unzensiert",
    legacy: "Legacy-Modelle",
    // Skill categories
    technical: "Technisch",
    education: "Bildung",
    controversial: "Kontrovers",
    lifestyle: "Lebensstil",
    // Model capabilities/utilities
    reasoning: "Erweitertes Denkvermögen",
    roleplay: "Rollenspiel",
    roleplayDark: "Dunkles Rollenspiel",
    adultImplied: "Erwachsene/Angedeutete Inhalte",
    adultExplicit: "Erwachsene/Explizite Inhalte",
    violence: "Gewalt",
    harmful: "Potenziell schädliche Inhalte",
    illegalInfo: "Illegale Informationen",
    medicalAdvice: "Medizinische Beratung",
    offensiveLanguage: "Anstößige Sprache",
    politicalLeft: "Linke politische Ansichten",
    politicalRight: "Rechte politische Ansichten",
    conspiracy: "Verschwörungstheorien",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Neuestes Claude-Modell mit hervorragender Leistung",
      claudeSonnet45: "Neuestes Claude-Modell mit hervorragender Leistung",
      gpt5: "Neuestes GPT-Modell mit hervorragender Leistung",
      gpt51: "Neuestes GPT 5.1-Modell mit verbessertem Denkvermögen",
      gpt5Pro:
        "Neuestes GPT-Modell mit hervorragender Leistung für Programmieraufgaben",
      gpt5Codex: "Neuestes GPT-Modell mit hervorragender Leistung",
      gpt51Codex: "Neuestes GPT 5.1 Codex-Modell optimiert für Programmierung",
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
      kimiK2:
        "Kimi K2 - fortgeschrittenes Mixture-of-Experts (MoE) Modell von Moonshot AI mit großem Kontextfenster",
      kimiK2Thinking:
        "Kimi K2 Thinking - Reasoning-fokussierte Variante mit erweiterten analytischen Fähigkeiten",
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
      glm5: "GLM-5 - Z.AIs Flaggschiff-Open-Source-Modell für komplexes Systemdesign und langfristige Agenten-Workflows, vergleichbar mit führenden Closed-Source-Modellen",
      glm46:
        "GLM 4.6 - effizientes 7B-Parameter-Modell mit großem Kontextfenster",
      glm47:
        "GLM 4.7 - verbessertes 7B-Modell mit erweiterten Reasoning- und Coding-Fähigkeiten",
      glm47Flash:
        "GLM 4.7 Flash - ultraschnelle Variante optimiert für schnelle Antworten",
      glm45Air:
        "GLM 4.5 AIR - ultraschnelles leichtgewichtiges Modell mit großem Kontextfenster",
      glm45v:
        "GLM 4.5v - visionsfähiges multimodales Modell mit großem Kontextfenster",
      kimiK2_5:
        "Kimi K2.5 - Erweiterte Version mit verbessertem Reasoning und kreativen Schreibfähigkeiten",
      uncensoredLmV11:
        "Unzensiertes Sprachmodell ohne Inhaltsfilterung - Premium-Modell",
      freedomgptLiberty:
        "FreedomGPT Liberty - Unzensiertes KI-Modell mit Fokus auf freie Meinungsäußerung und kreative Inhalte",
      gabAiArya:
        "Gab AI Arya - Unzensiertes Konversations-KI-Modell mit freier Meinungsäußerung und kreativen Fähigkeiten",
      gpt52Pro:
        "GPT 5.2 Pro - fortgeschrittenes Reasoning-Modell mit erweiterten Fähigkeiten für komplexe Aufgaben",
      gpt52:
        "GPT 5.2 - Modell der neuesten Generation mit verbesserter Leistung und Effizienz",
      gpt52_chat:
        "GPT 5.2 Chat - Konversationsvariante optimiert für Dialog und Interaktionen",
      veniceUncensored:
        "Venice Uncensored - Unzensiertes KI-Modell für uneingeschränkte Gespräche",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Unzensiertes großes Sprachmodell basierend auf Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Unzensiertes großes Sprachmodell basierend auf Mistral",
      claudeOpus45:
        "Claude Opus 4.5 - Leistungsfähigstes Claude-Modell mit außergewöhnlichem Denkvermögen und kreativen Fähigkeiten",
      claudeOpus46:
        "Claude Opus 4.6 - Neuestes und leistungsfähigstes Claude-Modell mit außergewöhnlichem Denkvermögen und kreativen Fähigkeiten",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Anthropics leistungsfähigstes Sonnet-Modell mit Frontier-Leistung in Coding, Agenten und professioneller Arbeit",
      gemini3Pro:
        "Google Gemini 3 Pro - Fortschrittliches multimodales KI-Modell mit großem Kontextfenster und leistungsstarken Reasoning-Fähigkeiten",
      gemini3Flash:
        "Google Gemini 3 Flash - Schnelles, effizientes multimodales KI-Modell für schnelle Antworten",
      deepseekV32:
        "DeepSeek V3.2 - Hochleistungs-Reasoning-Modell mit erweiterten Coding-Fähigkeiten",
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
        "Wählen Sie ein Modell und eine Skill, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Skill, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
  },
  debugView: {
    systemPrompt: "System-Prompt",
    systemPromptTitle: "System-Prompt (Generiert)",
    systemPromptHint:
      "Dies ist der System-Prompt für den gesamten Konversationsthread",
    systemMessage: "Systemnachricht",
    systemMessageHint:
      "Dies ist eine in die Konversation eingefügte Systemnachricht",
    copied: "Kopiert!",
    retryModal: {
      title: "Mit anderen Einstellungen wiederholen",
      description:
        "Wählen Sie ein Modell und eine Skill, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Skill, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
  },
  suggestedPrompts: {
    title: "Wie kann ich Ihnen helfen?",
    privateTitle: "Ihr privater KI-Assistent",
    privateDescription:
      "Gespräche in Ihrem Konto gespeichert und auf allen Geräten synchronisiert.",
    sharedTitle: "Zusammenarbeit mit KI",
    sharedDescription:
      "Erstellen Sie Gespräche und teilen Sie sie mit Teammitgliedern über sichere Links.",
    publicTitle: "Treten Sie dem öffentlichen KI-Forum bei",
    publicDescription:
      "Öffentliche Gespräche für alle sichtbar. Teilen Sie Ideen und führen Sie offene Dialoge.",
    incognitoTitle: "Anonymer KI-Chat",
    incognitoDescription:
      "Nur im Browser gespeichert. Niemals in Ihrem Konto gespeichert oder synchronisiert.",
    more: "Mehr",
    selectSkill: "Skill auswählen",
    noPrompts: "Keine Vorschläge für diese Skill",
    showDetails: "Details anzeigen",
    hideDetails: "Details ausblenden",
    systemPromptLabel: "System-Prompt",
    preferredModelLabel: "Bevorzugtes Modell",
    categoryLabel: "Kategorie",
    suggestedPromptsLabel: "Vorgeschlagene Prompts",
  },
  emptyState: {
    quickStart: "Schnellstart",
    private: {
      brainstorm: "Ideen sammeln",
      brainstormPrompt: "Hilf mir, Ideen zu sammeln für...",
      writeDocument: "Dokument schreiben",
      writeDocumentPrompt:
        "Hilf mir, ein professionelles Dokument zu schreiben über...",
      helpWithCode: "Hilfe mit Code",
      helpWithCodePrompt: "Ich brauche Hilfe mit diesem Code...",
      research: "Thema recherchieren",
      researchPrompt: "Recherchiere und fasse Informationen zusammen über...",
    },
    shared: {
      teamBrainstorm: "Team-Brainstorming",
      teamBrainstormPrompt: "Lass uns gemeinsam Ideen sammeln zu...",
      projectPlan: "Projektplanung",
      projectPlanPrompt: "Hilf uns, ein Projekt zu planen für...",
      discussion: "Diskussion starten",
      discussionPrompt: "Lass uns diskutieren über...",
      shareIdeas: "Ideen teilen",
      shareIdeasPrompt: "Ich möchte Ideen teilen und entwickeln über...",
    },
    incognito: {
      quickQuestion: "Schnelle Frage",
      quickQuestionPrompt: "Ich habe eine schnelle Frage zu...",
      privateThought: "Privater Gedanke",
      privateThoughtPrompt: "Ich möchte diese Idee privat erkunden...",
      experiment: "Experiment",
      experimentPrompt: "Lass mich etwas ausprobieren...",
      sensitiveQuestion: "Sensible Frage",
      sensitiveQuestionPrompt: "Ich brauche Rat zu einem sensiblen Thema...",
    },
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
    managePermissions: "Berechtigungen verwalten",
    manageSharing: "Freigabe verwalten",
    shareThread: "Thread teilen",
    deleteDialog: {
      title: "Ordner löschen",
      description: 'Möchten Sie "{{folderName}}" wirklich löschen?',
      descriptionWithThreads:
        'Möchten Sie "{{folderName}}" wirklich löschen? Dieser Ordner enthält {{count}} Thread(s), die ebenfalls gelöscht werden.',
    },
    today: "Heute",
    lastWeek: "Letzte 7 Tage",
    lastMonth: "Letzte 30 Tage",
    older: "Älter",
    folderNotFound: "Ordner nicht gefunden",
    emptyFolder: "Noch keine Chats oder Ordner hier",
    createSubfolder: "Unterordner erstellen",
    rename: "Umbenennen",
    changeIcon: "Symbol ändern",
    delete: "Löschen",
    newFolder: "Neuer Ordner",
  },
  permissions: {
    folder: {
      title: "Ordnerberechtigungen",
      description: "Berechtigungen für diesen Ordner verwalten",
    },
    thread: {
      title: "Thread-Berechtigungen",
      description: "Berechtigungen für diesen Thread verwalten",
    },
    view: {
      label: "Anzeigeberechtigungen",
      description: "Wer kann diesen Inhalt ansehen und lesen",
    },
    manage: {
      label: "Verwaltungsberechtigungen",
      description: "Wer kann Ordner bearbeiten und Unterordner erstellen",
    },
    edit: {
      label: "Bearbeitungsberechtigungen",
      description: "Wer kann Thread-Eigenschaften bearbeiten",
    },
    createThread: {
      label: "Thread-Erstellungsberechtigungen",
      description: "Wer kann neue Threads in diesem Ordner erstellen",
    },
    post: {
      label: "Beitragsberechtigungen",
      description: "Wer kann Nachrichten posten",
    },
    moderate: {
      label: "Moderationsberechtigungen",
      description: "Wer kann Inhalte ausblenden und moderieren",
    },
    admin: {
      label: "Admin-Berechtigungen",
      description: "Wer kann Inhalte löschen und Berechtigungen verwalten",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Leseberechtigungen",
      description: "Wer kann diesen Inhalt ansehen und lesen",
    },
    write: {
      label: "Schreibberechtigungen",
      description: "Wer kann Threads und Ordner erstellen",
    },
    writePost: {
      label: "Beitragsberechtigungen",
      description: "Wer kann Nachrichten in Threads posten",
    },
    roles: {
      public: "Öffentlich (Alle Benutzer)",
      customer: "Nur Kunden",
      admin: "Nur Administratoren",
    },
    visibility: {
      label: "Wer kann das sehen?",
      description:
        "Wählen Sie aus, welche Benutzerrollen diesen Ordner/Thread sehen können",
      public: "Öffentlich (Alle Benutzer)",
      customer: "Nur Kunden",
      admin: "Nur Administratoren",
    },
    addModerator: {
      label: "Moderator hinzufügen",
      placeholder: "Benutzer-ID eingeben...",
    },
    moderatorList: {
      label: "Aktuelle Moderatoren",
      empty: "Noch keine Moderatoren hinzugefügt",
    },
    errors: {
      emptyId: "Benutzer-ID darf nicht leer sein",
      invalidUuid: "Ungültiges Benutzer-ID-Format",
      duplicate: "Dieser Benutzer ist bereits ein Moderator",
    },
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
        "Wählen Sie ein Modell und eine Skill, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Skill, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
    actions: {
      vote: "Abstimmen",
      upvote: "Upvote",
      downvote: "Downvote",
      respondToAI:
        "Auf diese KI-Nachricht mit einer anderen KI-Skill antworten",
      loadingAudio: "Audio wird geladen...",
      stopAudio: "Audio stoppen",
      playAudio: "Audio abspielen",
      cancelLoading: "Laden abbrechen",
      stop: "Stoppen",
      play: "Abspielen",
      cancel: "Abbrechen",
      reply: "Antworten",
      replyToMessage: "Auf diese Nachricht antworten (erstellt einen Branch)",
      edit: "Bearbeiten",
      editMessage: "Diese Nachricht bearbeiten (erstellt einen Branch)",
      retry: "Wiederholen",
      retryWithDifferent: "Mit anderem Modell/Skill wiederholen",
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
    anonymous: "Anonym",
    authorWithId: "{{name}} [{{id}}]",
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
        "Wählen Sie ein Modell und eine Skill, um die Antwort neu zu generieren",
      confirmLabel: "Wiederholen",
    },
    answerModal: {
      title: "Als KI-Modell antworten",
      description:
        "Wählen Sie ein Modell und eine Skill, um eine KI-Antwort zu generieren",
      confirmLabel: "Generieren",
      inputPlaceholder:
        "Geben Sie eine Eingabeaufforderung für die KI ein (optional - leer lassen, damit die KI ihre eigene Antwort generiert)",
    },
    actions: {
      loadingAudio: "Audio wird geladen...",
      stopAudio: "Audio stoppen",
      playAudio: "Audio abspielen (+{{cost}} Credits)",
      cancelLoading: "Laden abbrechen",
      stop: "Stoppen",
      play: "Abspielen",
      reply: "Antworten",
      replyToMessage: "Auf diese Nachricht antworten (erstellt einen Branch)",
      edit: "Bearbeiten",
      editMessage: "Diese Nachricht bearbeiten (erstellt einen Branch)",
      retry: "Wiederholen",
      retryWithDifferent: "Mit anderem Modell/Skill wiederholen",
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
    arguments: "Argumente",
    result: "Ergebnis",
    error: "Fehler",
    executing: "Wird ausgeführt...",
    creditsUsed_one: "{{cost}} Guthaben",
    creditsUsed_other: "{{cost}} Guthaben",
    status: {
      error: "Fehler",
      executing: "Wird ausgeführt...",
      complete: "Abgeschlossen",
    },
    sections: {
      request: "Anfrage",
      response: "Antwort",
    },
    messages: {
      executingTool: "Tool wird ausgeführt...",
      errorLabel: "Fehler:",
      noArguments: "Keine Argumente",
      noResult: "Kein Ergebnis",
      metadataNotAvailable: "Widget-Metadaten nicht verfügbar. Zeige Rohdaten.",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Thread löschen",
      description:
        'Möchten Sie "{{title}}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden und alle Nachrichten in diesem Thread werden dauerhaft gelöscht.',
    },
  },
  shareDialog: {
    title: "Thread teilen",
    description: "Teilen-Links für diesen Thread erstellen und verwalten",
    createLink: "Teilen-Link erstellen",
    linkCreated: "Teilen-Link erfolgreich erstellt!",
    linkCopied: "Link in Zwischenablage kopiert!",
    copyLink: "Link kopieren",
    shareViaEmail: "Per E-Mail teilen",
    revokeLink: "Widerrufen",
    revoke: "Widerrufen",
    linkRevoked: "Teilen-Link widerrufen",
    revoked: "Widerrufen",
    noLinksYet: "Noch keine Teilen-Links. Erstellen Sie einen, um zu teilen.",
    activeLinks: "Aktive Teilen-Links",
    existingLinks: "Bestehende Links",
    linkSettings: "Link-Einstellungen",
    newLinkSettings: "Neue Link-Einstellungen",
    linkLabel: "Link-Beschriftung (optional)",
    linkLabelPlaceholder: "z.B. Mit Team teilen",
    allowPosting: "Posten erlauben",
    allowPostingDescription:
      "Empfänger können antworten und im Thread interagieren",
    requireAuth: "Anmeldung erforderlich",
    requireAuthDescription:
      "Nur authentifizierte Benutzer können auf diesen Link zugreifen",
    viewOnly: "Nur ansehen",
    accessCount: "{{count}} Zugriff",
    accessCount_other: "{{count}} Zugriffe",
    createdAt: "Erstellt {{date}}",
    lastAccessed: "Zuletzt aufgerufen {{date}}",
    neverAccessed: "Nie aufgerufen",
    emailSubject: "Schauen Sie sich diesen Thread an: {{title}}",
    emailBody:
      "Ich dachte, diese Konversation könnte Sie interessieren: {{url}}\n\nThread: {{title}}",
    emailPlaceholder: "E-Mail-Adressen eingeben (durch Komma getrennt)",
    sendEmail: "E-Mail",
    emailSent: "E-Mail erfolgreich gesendet!",
    create: "Erstellen",
    creating: "Erstellen...",
    copied: "Kopiert!",
    close: "Schließen",
    shareThread: "Thread teilen",
  },
  shared: {
    error: {
      title: "Teilen-Link-Fehler",
      userError:
        "Ihre Sitzung konnte nicht verifiziert werden. Bitte versuchen Sie es erneut.",
      invalidToken:
        "Dieser Teilen-Link ist ungültig oder wurde widerrufen. Bitte kontaktieren Sie die Person, die diesen Link mit Ihnen geteilt hat.",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Private & Geteilte Ordner freischalten",
      description:
        "Registriere dich oder melde dich an, um auf private und geteilte Ordner zuzugreifen. Deine Chats werden über Geräte synchronisiert.",
      continueTour: "Tour fortsetzen",
      signUp: "Registrieren / Einloggen",
    },
    welcome: {
      title: "Willkommen bei {{appName}}!",
      description:
        "Befreie dich von KI-Zensur. Zugriff auf GPT-5.1, Claude Sonnet und unzensierte Modelle, trainiert auf WikiLeaks und nicht-mainstream Daten. Privat, anonym oder öffentlich chatten. Deine Plattform, deine Regeln.",
      subtitle: "Lass uns erkunden, was uns anders macht:",
    },
    modelSelector: {
      title: "Wähle dein KI-Modell",
      description:
        "Im Gegensatz zu ChatGPT bist du nicht an eine KI gebunden. Wechsle zwischen GPT-5.1, Claude Sonnet, DeepSeek und unzensierten Modellen wie Gab Arya und UncensoredLM. Jedes Modell bietet einzigartige Perspektiven und Fähigkeiten.",
      tip: "Mainstream für Sicherheit, unzensiert für Wahrheit. Mische nach Bedarf.",
    },
    aiCompanion: {
      title: "Wähle deinen KI-Begleiter",
      description:
        "Klicke hier, um deine KI-Begleiter kennenzulernen. Jeder hat eine einzigartige Persönlichkeit und das beste KI-Modell wird automatisch ausgewählt. Du kannst später alles anpassen.",
      tip: "👆 Klicke, um zu öffnen und deinen ersten Begleiter zu wählen!",
    },
    characterSelector: {
      title: "Passe KI-Verhalten an",
      description:
        "Skills formen, wie die KI antwortet. Nutze integrierte Stile oder erstelle eigene Skills mit deinen Anweisungen und bevorzugten Modellen.",
      tip: "Kombiniere jede Skill mit jedem Modell für den perfekten Assistenten.",
    },
    modelSelectorFavorites: {
      title: "Markiere deine Favoriten",
      description:
        "Modell gefunden, das du liebst? Markiere es für sofortigen Zugriff. Mische Mainstream und unzensierte Modelle nach Bedarf.",
    },
    modelSelectorShowAll: {
      title: "Durchsuche vollständige Bibliothek",
      description:
        "Erkunde alle verfügbaren Modelle mit Suche und Filtern. Entdecke unzensierte Alternativen zu Mainstream-KIs.",
    },
    modelSelectorSearch: {
      title: "Finde spezifische Modelle",
      description:
        "Suche nach Name, Anbieter oder Fähigkeit. Probiere 'unzensiert', 'coding' oder 'kreativ'.",
    },
    modelSelectorGroup: {
      title: "Gruppiere nach Anbieter oder Zweck",
      description:
        "Zeige Modelle gruppiert nach Firma (OpenAI, Anthropic) oder nach Anwendungsfall (Coding, Unzensiert, Kreativ).",
    },
    characterSelectorFavorites: {
      title: "Markiere deine Skills",
      description:
        "Speichere deine Lieblings-Gesprächsstile für schnellen Zugriff.",
    },
    characterSelectorShowAll: {
      title: "Durchsuche alle Skills",
      description:
        "Erkunde die vollständige Skill-Bibliothek. Erstelle eigene Skills für deinen Workflow.",
    },
    characterSelectorSearch: {
      title: "Finde Skills",
      description: "Suche nach Name, Kategorie oder Beschreibung.",
    },
    characterSelectorGroup: {
      title: "Gruppiere Skills",
      description:
        "Zeige nach Quelle (Integriert vs. Deine Eigenen) oder nach Kategorie (Kreativ, Technisch, Professional).",
    },
    rootFolders: {
      title: "4 Wege zu chatten",
      description:
        "Wähle dein Privatsphäre-Level - von völlig anonym bis kollaborativ:",
      private: {
        name: "Privat",
        suffix: "Dein persönlicher Workspace",
      },
      incognito: {
        name: "Inkognito",
        suffix: "Zero-Knowledge-Privatsphäre",
      },
      shared: {
        name: "Geteilt",
        suffix: "Kontrollierte Zusammenarbeit",
      },
      public: {
        name: "Öffentlich",
        suffix: "Meinungsfreiheits-Forum",
      },
    },
    incognitoFolder: {
      name: "Inkognito",
      suffix: "Ordner",
      description:
        "Maximale Privatsphäre. Chat-Verlauf nur auf deinem Gerät gespeichert, nie auf unseren Servern. Nachrichten von KI verarbeitet, dann sofort verworfen. Perfekt für sensible Themen mit unzensierten Modellen.",
      note: "Kein Konto • Kein Verlauf gespeichert • Nur lokal",
    },
    publicFolder: {
      name: "Öffentlich",
      suffix: "Ordner",
      description:
        "Offenes KI-Forum geschützt durch Meinungsfreiheits-Prinzipien. Chatte mit KI und anderen Nutzern öffentlich. Teile Wissen, debattiere Ideen, erhalte diverse Perspektiven.",
      note: "Kein Konto • Meinungsfreiheit als Basis • Community-getrieben",
    },
    privateFolder: {
      name: "Privat",
      suffix: "Ordner",
      description:
        "Dein persönlicher KI-Workspace. Über alle Geräte synchronisiert, mit Unterordnern organisiert. Perfekt für laufende Projekte und Recherchen.",
      authPrompt: "Konto erforderlich:",
      login: "Anmelden",
      signUp: "Registrieren",
    },
    sharedFolder: {
      name: "Geteilt",
      suffix: "Ordner",
      description:
        "Arbeite mit bestimmten Personen zusammen. Teile Konversationen per Link, kontrolliere wer lesen oder schreiben kann. Ideal für Teams und Experten-Feedback.",
      authPrompt: "Konto erforderlich:",
      login: "Anmelden",
      signUp: "Registrieren",
    },
    newChatButton: {
      title: "Neue Konversation starten",
      description:
        "Klicke hier, um einen frischen Chat zu beginnen. Alle Konversationen werden automatisch im aktuellen Ordner gespeichert.",
      tip: "Jeder Ordner hat seinen eigenen Chat-Verlauf.",
    },
    sidebarLogin: {
      title: "Kostenloses Konto erstellen",
      description:
        "Schalte Private und Geteilte Ordner frei, synchronisiere über alle Geräte, speichere Lieblings-Modelle und Skills. Inkognito und Öffentlich bleiben ohne Konto verfügbar.",
      tip: "Bleibe anonym oder synchronisiere alles. Deine Wahl.",
    },
    subscriptionButton: {
      title: "Unbegrenzter KI-Zugang",
      description:
        "Erhalte alles, was ChatGPT bietet PLUS unzensierte Modelle, öffentliche Foren und echte Privatsphäre. {{credits}} monatliche Credits für {{price}}. Zugriff auf alle Modelle, keine Einschränkungen.",
      tip: "Ein Abo. Alle Mainstream- und unzensierten Modelle. Keine Grenzen.",
      price: "8€",
    },
    chatInput: {
      title: "Nachricht eingeben",
      description:
        "Tippe im Textfeld und drücke Enter, um deine Nachricht an die KI zu senden.",
      tip: "Drücke Shift+Enter für eine neue Zeile ohne zu senden.",
    },
    voiceInput: {
      title: "Sprachaufnahme",
      description:
        "Klicke auf das Mikrofon, um die Aufnahme zu starten. Wenn fertig, wähle:",
      options: {
        transcribe: "In Text umwandeln - wandelt Sprache in bearbeitbaren Text",
        sendAudio: "Als Sprache senden - KI hört deine echte Stimme",
        pauseResume: "Aufnahme jederzeit pausieren/fortsetzen",
      },
    },
    callMode: {
      title: "Anruf-Modus",
      description:
        "Aktiviere Sprache-zu-Sprache Gespräche. Wenn aktiv, spricht die KI Antworten automatisch mit Text-zu-Sprache.",
      tip: "Perfekt für freihändige Gespräche. Pro Modell ein-/ausschaltbar.",
    },
    complete: {
      title: "Alles bereit!",
      description:
        "Du hast jetzt Zugriff auf Mainstream und unzensierte KI-Modelle, private und öffentliche Chat-Modi und volle Kontrolle über deine Daten. Fang an zu erkunden!",
      help: "Fragen? Frag jedes KI-Modell um Hilfe.",
    },
    authUnlocked: {
      unlocked: "Ordner freigeschaltet!",
      privateDescription:
        "Dein Privater Ordner ist jetzt aktiv. Alle Chats synchronisieren über Geräte und bleiben in Unterordnern organisiert.",
      privateNote: "Perfekt für laufende Projekte und persönliche Recherchen.",
      sharedDescription:
        "Geteilter Ordner freigeschaltet! Erstelle Konversationen und teile per Link mit granularer Berechtigungskontrolle.",
      sharedNote: "Ideal für Team-Zusammenarbeit und Experten-Feedback.",
    },
    buttons: {
      back: "Zurück",
      close: "Schließen",
      last: "Fertig",
      next: "Weiter",
      skip: "Tour überspringen",
    },
  },
};
