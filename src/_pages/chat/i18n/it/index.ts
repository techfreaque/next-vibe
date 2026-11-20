import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Accedi",
      logout: "Esci",
    },
  },
  common: {
    newChat: "Nuova conversazione",
    newPrivateChat: "Conversazione privata",
    newSharedChat: "Conversazione condivisa",
    newPublicChat: "Conversazione pubblica",
    newIncognitoChat: "Conversazione in incognito",
    newPrivateFolder: "Nuova cartella privata",
    newSharedFolder: "Nuova cartella condivisa",
    newPublicFolder: "Nuova cartella pubblica",
    newIncognitoFolder: "Nuova cartella di Incognito",
    createNewPrivateFolder: "Crea nuova cartella privata",
    createNewSharedFolder: "Crea nuova cartella condivisa",
    createNewPublicFolder: "Crea nuova cartella pubblica",
    createNewIncognitoFolder: "Crea nuova cartella Incognito",
    privateChats: "Filosofia privata",
    sharedChats: "Filetti condivisi",
    publicChats: "Filosofia 1A pubblica",
    incognitoChats: "Incognito filetti",
    cronChats: "Filetti di sfondo",
    backgroundChats: "Sfondo",
    remoteChats: "Telecomando",
    search: "Cerca",
    delete: "Elimina",
    cancel: "Annulla",
    save: "Salva",
    send: "Invia",
    sending: "Invio in corso…",
    edit: "Modifica",
    settings: "Impostazioni",
    toggleSidebar: "Mostra o nascondi la barra laterale",
    lightMode: "Modalità di luce",
    darkMode: "Modalità oscura",
    searchPlaceholder: "Cerca...",
    searchThreadsPlaceholder: "Ricerca di filetti...",
    searchResults: "Risultati della ricerca ({{count}})",
    noChatsFound: "Nessuna chat trovata",
    noThreadsFound: "Nessun thread trovato",
    enableTTSAutoplay: "Abilita l'autoplay TTS",
    disableTTSAutoplay: "Disattiva l'autoplay TTS",
    closeSidebar: "Barra laterale chiusa",
    close: "Chiudi",
    showMore: "Mostra di più",
    showLess: "Mostra meno",
    viewFullThread: "Visualizza tutta la conversazione",
    viewAllThreads: "Visualizza tutti i fili",
    backToChat: "Torna alla chat",
    language: "Lingua",
    loginRequired:
      "Si prega di accedere per utilizzare cartelle persistenti. Utilizzare la modalità incognito per chat anonime.",

    // Copy Button
    copyButton: {
      copyToClipboard: "Copia a clipboard",
      copied: "Copiato!",
      copyAsMarkdown: "Copia come Markdown",
      copyAsText: "Copia come testo",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Interrompere la riproduzione audio",
      playAudio: "Audio di riproduzione (+ crediti {{cost}})",
      cancelLoading: "Annulla carico",
      answerAsAI: "Rispondi come modello IA",
      deleteMessage: "Cancella messaggio",
      actualCostUsed: "Crediti effettivi utilizzati per questo messaggio",
      tokensUsed: "Token totali utilizzati",
      credits: "crediti",
      tokens: "token",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Conversazione di Branch da qui",
      retry: "Riprova con un altro modello o un’altra skill",
      deleteMessage: "Cancella messaggio",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Vista lineare (stile ChatGPT)",
      threadedView: "Vista filettata (Stile Reddit/ Discord)",
      flatView: "Vista piana (4chan style)",
      debugView: "Vista del debito (con istruzioni di sistema)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Ricerca e Creare",
      newChat: "Nuova chat",
      searchThreadsPlaceholder: "Ricerca di filetti...",
      noThreadsFound: "Nessun thread trovato",
    },

    // Selector
    selector: {
      country: "Paese",
      language: "Lingua",
    },
  },

  aiTools: {
    modal: {
      title: "Strumenti AI",
      description:
        "Di solito non è necessario gestire gli strumenti. Quando l'aiuto è abilitato, AI può chiamare qualsiasi strumento a richiesta. Pin strumenti qui solo se li vuoi sempre in contesto.",
      searchPlaceholder: "Strumenti di ricerca...",
      loading: "Strumenti di caricamento...",
      noToolsFound: "Nessun strumento corrisponde alla tua ricerca",
      noToolsAvailable: "Strumenti AI disponibili",
      expandAll: "Espandere tutti",
      collapseAll: "Tutti i risultati",
      selectAll: "Seleziona tutto",
      deselectAll: "Deselect Tutti",
      enableAll: "Abilita tutto",
      resetToDefault: "Ripristino di default",
      stats: "{{enabled}} di strumenti {{total}} pinned",
      aliases: "Aliasi",
      requireConfirmation: "Richiedete la conferma prima dell'uso",
      activeLabel: "a spillo",
      enabledLabel: "permesso",
      totalLabel: "totale totale",
      activeTooltip:
        "Gli strumenti Pinned sono sempre in contesto - lo AI li vede ogni volta",
      enabledTooltip:
        "Gli strumenti consentiti possono essere chiamati su richiesta quando l'aiuto è abilitato",
      legendActive: "Sempre in contesto (arrotolato)",
      legendConfirm: "Chiede prima di correre",
      activeOn: "Pinned - sempre in contesto. Fare clic su unpin",
      activeOff:
        "Non pinned - AI può ancora chiamare su richiesta. Fare clic su perno",
      confirmOn: "Richiede conferma - clicca per disabilitare",
      confirmOff: "Esegue automaticamente - clicca per richiedere la conferma",
    },
  },

  confirmations: {
    deleteMessage: "Vuoi eliminare questo messaggio?",
  },

  iconSelector: {
    tabs: {
      library: "Biblioteca di Icona",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Inserisci il carattere emoji o unicode",
      placeholder: " ⁇  o qualsiasi testo",
      apply: "Applicare",
      currentIcon: "Icona attuale:",
      commonEmojis: "Emoji comuni:",
    },
  },

  createSkill: {
    title: "Crea una skill personalizzata",
    description:
      "Progetta la tua abilità AI con personalità, competenza e comportamento personalizzati.",
    icon: "Icona",
    name: "Nome",
    namePlaceholder: "ad es. Recensione del codice",
    descriptionLabel: "Designazione",
    descriptionPlaceholder: "Breve descrizione di ciò che questa abilità fa",
    category: "Categoria",
    selectCategory: "Seleziona una categoria",
    systemPrompt: "Prompt di sistema",
    systemPromptPlaceholder:
      "Definire come questa abilità dovrebbe comportarsi. Sii specifico sulla sua personalità, competenza e come dovrebbe rispondere.",
    voice: "Voce",
    voicePlaceholder: "Selezionare una voce per testo-speech",
    create: "Crea skill",
    creating: "Creare...",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Inserisci un nome",
      descriptionRequired: "Si prega di inserire una descrizione",
      systemPromptRequired: "Si prega di inserire un prompt del sistema",
      createFailed:
        "Non sono riuscito a creare abilità. Per favore, riprovate.",
    },
  },

  voice: {
    male: "Maschio",
    female: "Femmina",
  },

  editSkill: {
    title: "Modifica come skill personalizzata",
    description:
      "Creare un'abilità personalizzata in base a questa abilità. È possibile modificare tutte le impostazioni.",
    loginRequired:
      "Si prega di accedere per creare e modificare competenze personalizzate. Le competenze personalizzate vengono salvate sul tuo account.",
    name: "Nome",
    namePlaceholder: "Nome della skill personalizzata",
    descriptionLabel: "Designazione",
    descriptionPlaceholder: "Che cosa fa questa abilità?",
    category: "Categoria",
    icon: "Icona",
    voice: "Voce",
    voicePlaceholder: "Seleziona la voce",
    preferredModel: "Modello preferito",
    preferredModelPlaceholder: "Modello preferito opzionale",
    systemPrompt: "Prompt di sistema",
    systemPromptPlaceholder: "Definire il comportamento dell'abilità...",
    save: "Salvare come personalizzato",
    saveAsCopy: "Salvare come copia",
    saving: "Creare...",
    cancel: "Annulla",
    login: "Accedi a Modifica",
    signup: "Iscriviti a Modifica",
  },

  userProfile: {
    postCount: "{{count}} post",
    postCount_other: "{{count}} messaggi",
    recentPosts: "Post recenti",
    noPostsYet: "Nessun post",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Eliminare questo messaggio",
    },
  },
  credits: {
    balance: "Crediti",
    credit: "{{count}} credito",
    credits: "{{count}} crediti",
    freeCredit: "{{count}} credito gratuito",
    freeCredits: "Crediti gratuiti {{count}}",
    expiringCredit: "Credito di scadenza {{count}}",
    expiringCredits: "Crediti di espulsione {{count}}",
    permanentCredit: "Credito permanente {{count}}",
    permanentCredits: "Crediti permanenti {{count}}",
    expiresOn: "Scade {{date}}",
    expiresAt: "Scadenze",
    buyMore: "Comprare crediti",
    viewDetails: "Dettagli",
    breakdown: "Ripartizione del credito",
    approximateCost:
      "Costo approssimativo basato sui token di ingresso {{inputTokens}} e di uscita {{outputTokens}}. I costi effettivi possono variare.",
    navigation: {
      profile: "Profilo",
      subscription: "Abbonamento e crediti",
      referral: "Programma inviti",
      about: "Chi siamo",
      help: "Aiuto",
    },
  },
  actions: {
    newChatInFolder: "Nuova chat nella cartella",
    newFolder: "Nuova cartella",
    deleteFolder: "Elimina la cartella",
    deleteMessage: "Cancella messaggio",
    deleteThisMessage: "Eliminare questo messaggio",
    searchEnabled: "Ricerca abilitata",
    searchDisabled: "Ricerca per disabili",
    answerAsAI: "Rispondi come modello IA",
    retry: "Riprova con un altro modello o un’altra skill",
    branch: "Conversazione di Branch da qui",
    editMessage: "Modifica messaggio",
    stopAudio: "Interrompere la riproduzione audio",
    playAudio: "Gioca audio",
    copyContent: "Copia a clipboard",
    rename: "Rinomina",
    pin: "Fissa in alto",
    unpin: "Rimuovi dall’alto",
    archive: "Archivia",
    unarchive: "Ripristina dall’archivio",
    moveToFolder: "Sposta nella cartella",
    unfiled: "Non filtrato",
    noFoldersAvailable: "Nessuna cartella disponibile",
    stopGeneration: "Arresto della generazione",
    cancellingGeneration: "Cancelliere...",
    sendMessage: "Invia messaggio",
    shareThread: "Condividi la conversazione",
    manageSharing: "Gestisci condivisione",
  },
  chatInterface: {
    chatPrefix: "chat",
    chatConversation: "chat-conversation",
  },
  input: {
    placeholder: "Digitare il messaggio...",
    imagePlaceholder: "Descrivi l'immagine che vuoi generare...",
    audioPlaceholder: "Descrivi la musica o il suono per generare...",
    noPermission: "Non hai il permesso di inviare messaggi",
    noPostPermission:
      "Non hai il permesso di inviare messaggi in questo thread",
    noCreateThreadPermission:
      "Non hai il permesso di creare filetti in questa cartella",
    noCreateThreadPermissionInRootFolder:
      "Non hai il permesso di creare filetti in questa cartella. Si prega di effettuare l'accesso o selezionare una sottocartella.",
    keyboardShortcuts: {
      press: "Rassegna",
      enter: "Inserisci",
      toSend: "per l'invio",
      shiftEnter: "Shift+Enter",
      forNewLine: "per la nuova linea",
      ctrlV: "Ctrl+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "per incollare i file",
    },
    speechInput: {
      stopRecording: "Smettere di registrare",
      processing: "Elaborazione in corso…",
      startVoiceInput: "Iniziare l'ingresso vocale (+ crediti {{cost}}/min)",
      recordingClickToStop: "Registrazione... Fare clic per arrestare",
      transcribing: "Transcribing...",
    },
    attachments: {
      uploadFile: "File di aggancio",
      attachedFiles: "File allegati",
      addMore: "Aggiungi altro",
      removeFile: "Rimuovi file",
      fileTooLarge: "File è troppo grande (max 10MB)",
      invalidFileType: "Tipo di file non valido",
      uploadError: "Non è riuscito a caricare file",
    },
  },
  imageGen: {
    sizeSquare: "Piazza 1024×1024",
    sizeLandscape: "paesaggio 1792×1024",
    sizePortrait: "Ritratto 1024×1792",
    qualityStandard: "Standard",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "- 8.",
    durationMedium: "- 20.",
    durationLong: "- 30.",
  },
  modelSelector: {
    placeholder: "Selezionare il modello",
    addNewLabel: "Aggiungi il modello personalizzato",
    costFree: "Gratis",
    costCredits: "Credito {{count}}/msg",
    costCreditsPlural: "Crediti {{count}}/msg",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "Di cosa hai bisogno?",
    tuneIt: "Tune!",
    recommended: "Consigliato",
    alsoGood: "Anche bene",
    helpMeChoose: "Aiutami a scegliere",
    useThis: "Usa questo",
    quality: "Qualità",
    speedLabel: "Velocità",
    // Task pills
    tasks: {
      code: "Codice",
      write: "Scrivere",
      chat: "Chat",
      think: "Pensateci",
      create: "Creare",
      unfiltered: "Non filtrato",
    },
    // Tuning toggles
    effort: "Sforzo",
    "effort.simple": "Semplice",
    "effort.regular": "Regolare",
    "effort.complex": "Complesso",
    speed: "Velocità",
    "speed.fast": "Rapido",
    "speed.balanced": "Equilibrio",
    "speed.thorough": "Tossico",
    content: "Contenuti",
    "content.normal": "Normal",
    "content.sensitive": "Sensibile",
    "content.adult": "Adulto",
    // Wizard mode
    wizard: {
      title: "Aiutami a scegliere",
      whatWorking: "A cosa stai lavorando?",
      contentType: "Include contenuti maturi?",
      whatMatters: "Cosa ti importa di piu'?",
      hereIsMyPick: "Ecco la mia raccomandazione:",
      options: {
        code: "Scrivere un codice",
        write: "Scrivere testo o contenuto",
        chat: "Basta chattare / fare domande",
        think: "Qualcosa che ha bisogno di un pensiero profondo",
        create: "Lavoro creativo",
        unfiltered: "Senza censura / contenuti per adulti",
        safeContent: "Mantenerlo sicuro (modelli standard)",
        adultContent: "Sì, contenuto maturo (modelli non censurati)",
        speed: "Velocità",
        speedDesc: "Voglio risposte rapide",
        cost: "Costo",
        costDesc: "Tienilo a buon mercato o gratis",
        quality: "Qualità",
        qualityDesc: "Dammi il miglior output",
        balanced: "Equilibrio",
        balancedDesc: "Un po' di tutto",
      },
    },
    addDialog: {
      title: "Aggiungi il modello personalizzato",
      fields: {
        modelName: {
          label: "Nome del modello",
          placeholder: "ad esempio, GPT-4 Turbo",
        },
        provider: {
          label: "Fornitore",
          placeholder: "ad esempio, OpenAI",
        },
        apiDocs: {
          label: "Documentazione API URL",
        },
        modelId: {
          label: "Modello ID",
          placeholder: "ad esempio, gpt-4-turbo",
        },
      },
      cancel: "Annulla",
      add: "Aggiungi il modello",
    },
  },
  characterSelector: {
    placeholder: "Seleziona skill",
    addNewLabel: "Crea una skill personalizzata",
    defaultIcon: "✨",
    grouping: {
      bySource: "Per la fonte",
      byCategory: "Per categoria",
      sourceLabels: {
        builtIn: "Costruito",
        my: "Le mie abilità",
        community: "Comunità europea",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "Generale",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Creare Categoria",
      fields: {
        name: {
          label: "Nome della categoria",
          placeholder: "ad esempio. Affari, giochi, ecc.",
        },
        icon: {
          label: "Icona (Emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Annulla",
      create: "Creare",
    },
    addDialog: {
      title: "Crea una skill personalizzata",
      createCategory: "+ Nuova categoria",
      fields: {
        name: {
          label: "Nome",
          placeholder: "ad esempio, Code Reviewer",
        },
        icon: {
          label: "Icona (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Designazione",
          placeholder: "Breve descrizione dell'abilità",
        },
        systemPrompt: {
          label: "Prompt di sistema",
          placeholder: "Tu sei...",
        },
        category: {
          label: "Categoria",
        },
        suggestedPrompts: {
          label: "Prompts consigliati (opzionale)",
          description: "Aggiungi fino a 4 suggerimenti per questa abilità",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Annulla",
      create: "Crea skill",
    },
  },
  searchToggle: {
    search: "Cerca",
    enabledTitle: "Brave Ricerca attivata (+0,65 crediti per ricerca)",
    disabledTitle: "Brave Ricerca disabilitata (+0,65 crediti per ricerca)",
    creditIndicator: "+0.65",
    unconfiguredTitle: "Ricerca Web non configurata",
    unconfiguredBrave: "Per la ricerca Brave, aggiungi al tuo.env:",
    unconfiguredKagi: "Per la ricerca Kagi, aggiungi al tuo.env:",
  },
  toolsButton: {
    title: "Configurare gli strumenti AI",
    tools: "Strumenti",
  },
  combinedSelector: {
    tabs: {
      quick: "Rapido",
      skill: "Skill",
      model: "Modello",
    },
    current: "Corrente",
    favoriteSkills: "Abilità preferite",
    favoriteModels: "Modelli preferiti",
    showAll: "Mostra tutto",
    selectModel: "Selezionare il modello",
    forSkill: "per {{character}}",
    recommended: "Consigliato",
    favorites: "Preferiti",
    all: "Tutti",
    noFavorites:
      "Non ci sono ancora favoriti. Mettine un po' per aggiungerli qui.",
    noModels: "Nessun modello disponibile",
    filteredBySkill:
      "Mostrando {{compatible}} di modelli {{total}} (filtrati per abilità)",
    selectSkill: "Seleziona skill",
    allSkills: "Tutti",
  },
  selector: {
    noResults: "Nessun risultato",
    tabs: {
      quick: "Rapido",
      characters: "Skill",
      build: "Compilazione",
      favorites: "I miei preferiti",
      browse: "Sfoglia le competenze",
    },
    tiers: {
      quick: "Rapido",
      smart: "Intelligente",
      best: "Migliore",
    },
    price: {
      free: "FREE",
      smart: "3-8.",
      best: "10-20c",
    },
    content: "Contenuti",
    contentLevels: {
      safe: "Sicuro",
      open: "Aperto",
      unlim: "Un'altra volta.",
    },
    free: "Gratis",
    favorites: "Preferiti",
    suggested: "Suggerito",
    noFavorites: "Nessun favorito ancora",
    noFavoritesHint: "Salvare le tue abilità di accesso rapido",
    browseAllSkills: "Sfoglia tutte le abilità...",
    customSetup: "Configurazione personalizzata...",
    selectSkill: "Seleziona skill",
    modelCreditDisplay: {
      tokenBased: {
        header: "Costo per messaggio",
        costRangeLabel: "Intervallo tipico:",
        costRangeValue: "Da {{min}} a {{max}} crediti",
        examplesLabel: "Esempi:",
        examples: {
          short: "Conversazione breve",
          medium: "Conversazione media",
          long: "Conversazione lunga",
        },
        triggersCompacting: "⚡ Avvia la sintesi",
        tokensCount: "{{count}} token",
        explanation:
          "Lo AI elabora tutta la cronologia delle conversazioni con ogni messaggio. Le conversazioni più lunghe costano di più perché c'è più contesto per elaborare.",
        compactingLabel: "✨ Sintesi automatica:",
        compactingExplanation:
          " A {{threshold}} token riassumiamo i messaggi più vecchi per ridurre i costi e mantenere il contesto.",
      },
      fixed: {
        title: "Prezzi per {{model}}",
        freeDescription: "Questo modello è gratuito e non consuma crediti.",
        fixedDescription:
          "Il modello ha un costo fisso per messaggio, a prescindere dalla lunghezza.",
        costPerMessage: "Costo per messaggio:",
        freeExplanation: "Usa questo modello gratis e senza limiti.",
        freeHighlight: "Provalo e fai tutti gli esperimenti che vuoi.",
        simpleLabel: "Prezzo fisso:",
        simpleExplanation:
          " Tutti i messaggi costano uguale, brevi o lunghi. Non serve contare i token.",
      },
      creditValue: "1 credito = {{value}}",
    },
    all: "Tutti",
    buildMode: "Modalità di costruzione",
    forSkill: "per {{character}}",
    intelligence: "Intelligenza",
    contentLevel: "Livello di contenuto",
    speed: "Velocità",
    any: "Qualsiasi",
    result: "Risultato",
    bestMatch: "La migliore corrispondenza per le impostazioni",
    useRecommended: "Usa consigliato: {{model}}",
    filteredBySettings: "Mostrando {{filtered}} dei modelli {{total}}",
    recommended: "Consigliato",
    noModels: "Nessun modello corrisponde ai filtri",
    currentConfig: "Attualmente chattare con",
    switchModel: "Cambia modello",
    keepsConversation: "(conversazione dei cani)",
    switchSkill: "Cambia skill",
    startsNewChat: "(avvicina la nuova chat)",
    start: "Inizio",
    addFav: "Aggiungi",
    searchSkills: "Competenze di ricerca...",
    noSkillsFound: "Nessuna abilità trovata",
    createCustom: "Creare abilità personalizzate",
    skill: "Skill",
    savePreset: "Salva",
    perMessage: "per messaggio",
    compatibleModels: "Modelli compatibili con {{count}}",
    categories: {
      companions: "Compagni",
      assistants: "Assistenti",
      coding: "Programmazione",
      creative: "Creativo",
      writing: "Scrivere",
      roleplay: "Gioco di ruolo",
      analysis: "Analisi",
      education: "Istruzione",
      controversial: "Controversia",
      custom: "Personalizzato",
    },
    // v20 additions
    active: "Attivo",
    addFavorite: "Aggiungi il tuo preferito",
    settings: "Impostazioni",
    noModel: "Nessun modello selezionato",
    model: "Modello",
    autoSelect: "Selezione basata sui filtri",
    manualSelect: "Scegli manualmente...",
    best: "BEST",
    bestForFilter: "Ideale per questo filtro",
    setupRequired: "Configurazione necessaria",
    providerUnconfigured: "Chiave API del fornitore non configurata",
    addEnvKey: "Aggiungi a.env",
    noMatchingModels: "Nessun modello corrisponde ai filtri",
    noModelsWarning:
      "Nessun modello corrisponde a questi filtri. Modifica le impostazioni per continuare.",
    allModelsCount: "{{count}} modelli disponibili",
    filteredModelsCount: "{{count}} modelli corrispondenti",
    showAllModels: "Mostra tutti i {{count}} modelli",
    showFiltered: "Mostra solo i risultati filtrati",
    showLegacyModels_one: "Mostra il modello Legacy {{count}}",
    showLegacyModels_other: "Mostra {{count}} modelli precedenti",
    applyChanges: "Applicare modifiche",
    thisChatOnly: "Questa chat solo (temporanea)",
    saveToPreset: 'Salvare a " {{name}} "',
    saveAsNew: "Salva come nuovo preferito...",
    cancel: "Annulla",
    apply: "Applicare",
    contentFilter: "Contenuti",
    maxPrice: "Prezzo massimo",
    creditsExact: "{{cost}} crediti",
    creditsSingle: "1 credito",
    searchResults: "Risultati {{count}}",
    defaults: "Predefiniti",
    customize: "Personalizzarsi",
    addWithDefaults: "Aggiungi con i default",
    seeAll: "Vedi tutto",
    back: "Indietro",
    use: "Uso",
    editSettings: "Modifica delle impostazioni",
    editModelSettings: "Modifica delle impostazioni del modello",
    modelOnly: "Modello solo",
    yourSetups: "Le tue configurazioni",
    setup: "Configurazione iniziale",
    delete: "Elimina",
    editSkill: "Modifica come abilità personalizzata",
    switchSkillBtn: "Cambia skill",
    editSkillBtn: "Modifica skill",
    autoSelectedModel: "In base ai filtri:",
    manualSelectedModel: "Selezionato:",
    skillSelectedModel: "Modello della skill:",
    selectModelBelow: "Seleziona un modello qui sotto",
    chooseYourPath: "Scegli il tuo percorso",
    twoWaysToChat: "Due modi flessibili per iniziare a chattare",
    directModels: "Accesso diretto al modello",
    directModelsDesc:
      "Configura filtri o seleziona manualmente dai modelli {{count}}. Controllo completo sulla selezione AI.",
    skillPresets: "Preimpostazioni di abilità",
    characterPresetsDesc:
      "Scegli un'abilità qui sotto. Ognuno ha impostazioni ottimizzate è possibile personalizzare in qualsiasi momento.",
    startWithDirectModels: "Avviare con i modelli diretti",
    orBrowsePresets: "O sfogliare le impostazioni di abilità qui sotto",
    loading: "Caricamento...",
    noModelsMatch: "Nessuna corrispondenza dei modelli",
    adjustFiltersMessage:
      "Regolare i criteri del filtro per trovare i modelli disponibili",
    auto: "Automatico",
    manual: "Manuale",
    showLess: "Mostra meno",
    showMore: "Mostra altri {{count}}",
    applyOnce: "Applicare una volta",
    saveChanges: "Salvare le modifiche",
    useOnce: "Usare una volta",
    saveAsDefault: "Aggiungi ai preferiti",
    deleteSetup: "Eliminare Impostazione",
    skillSetup: "Configurazione della skill",
    separator: " • ",
    sortBy: "Ordina per",
    // UX improvements v21
    mySetups: "Le mie configurazioni",
    addNew: "Aggiungi nuovo",
    noSetupsTitle: "Nessun setup ancora",
    noSetupsDescription:
      "Crea la tua prima configurazione di abilità AI per iniziare",
    getStarted: "Iniziare",
    currentModel: "Modello attuale",
    modelSelection: "Selezione del modello",
    autoMode: "Auto-Select",
    manualMode: "Scelta manuale",
    skillMode: "Predefinito della skill",
    autoModeDescription:
      "Scegli automaticamente il modello migliore in base alle tue preferenze",
    manualModeDescription: "Scegli il modello che vuoi",
    characterBasedModeDescription:
      "Usa il modello per cui è stata progettata la skill",
    customizeSettings: "Personalizzare le impostazioni prima di aggiungere",
    useNow: "Usa ora",
    browseAll: "Sfoglia tutte le competenze",
    add: "Aggiungi",
    // v22 UX improvements
    quickSwitch: "Interruttore rapido",
    switchTo: "Passare a questa configurazione",
    adjustSettings: "Regolare le impostazioni",
    addAnotherSetup: "Aggiungi un'altra configurazione",
    comingSoon: "Arrivo presto",
    // Skill requirements
    requirements: {
      skillConflict: "conflitto di abilità",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Troppo alto.",
      tooLow: "Troppo basso",
      intelligenceTooLow: "Intelligenza troppo bassa (min: {{min}})",
      intelligenceTooHigh: "Intelligenza troppo alta (max: {{max}})",
      contentTooLow: "Livello di contenuto troppo basso (min: {{min}})",
      contentTooHigh: "Livello di contenuto troppo alto (max: {{max}})",
      allMet: "Soddisfa tutti i requisiti",
      violations: "{{count}} violazioni dei requisiti",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Cambia skill",
      description:
        "Passare a una diversa abilità senza perdere le impostazioni",
      searchPlaceholder: "Competenze di ricerca...",
      noResults: "Nessuna abilità trovata",
      keepSettings: "Tenere le impostazioni del modello corrente",
      keepSettingsDesc:
        "Utilizzare i filtri di intelligenza, prezzo e contenuto attuali con la nuova abilità",
      cancel: "Annulla",
      confirm: "Cambia skill",
    },
  },
  onboarding: {
    back: "Indietro",
    // Screen 1: Welcome
    welcome: {
      title: "Pensa a noi come la tua squadra AI.",
      line1:
        "Un compagno per la conversazione quotidiana. Specialisti per codifica, ricerca, scrittura - si sceglie uno quando il compito lo richiede.",
      line2:
        "Stessa chiacchierata. Se cambia quando conta. Ci vogliono secondi.",
      line3: "Facciamo in modo che tu ti metta in mezzo tra un minuto.",
      continue: "Iniziare",
    },
    // Screen 2: Guest warning (logged-out users only)
    guest: {
      title: "Stai navigando come ospite",
      line1:
        "Le impostazioni, il compagno e la cronologia delle chat vengono salvate localmente solo su questo dispositivo.",
      line2:
        "Iscriviti per mantenere tutto sincronizzato tra i dispositivi e assicurarsi di non perdere mai la configurazione.",
      signIn: "Accedi / Crea account",
      continueAnyway: "Continuare come ospite",
      note: "È possibile accedere più tardi dal menu in qualsiasi momento.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Scegli il tuo compagno",
      subtitle: "Il tuo partner principale per la chat di uso quotidiano",
      budgetTitle: "Quanto puo' essere capace il tuo AI?",
      budgetSubtitle:
        "È possibile modificare questo in qualsiasi momento nelle impostazioni",
      next: "Avanti",
      selectFirst: "Scegli un compagno per continuare",
      budget: {
        smart: {
          label: "Intelligente",
          desc: "Veloce, efficiente, gestisce la maggior parte delle cose bene",
        },
        brilliant: {
          label: "Brillante",
          desc: "Migliore qualità - grande per domande complesse, scrittura e analisi",
        },
        max: {
          label: "Massimo",
          desc: "Il ragionamento più alto, nessun compromesso - per quando è davvero importante",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "Per cosa lo userai per lo più?",
      subtitle:
        "Aggiungiamo automaticamente gli specialisti giusti al toolkit di AI.",
      saving: "Prepararsi...",
      start: "Avviare la chat",
      skip: "Skip - Lo preparerò più tardi",
      coding: {
        label: "Codifica e tecnologia",
        hint: "Vibe Coder, Coder",
      },
      research: {
        label: "Ricerca e analisi",
        hint: "Ricercatore, Data Analyst",
      },
      writing: {
        label: "Scrivere e modificare",
        hint: "Scrittore, Editor",
      },
      business: {
        label: "Affari &amp; Strategia",
        hint: "Business Advisor, Product Manager",
      },
      learning: {
        label: "Imparare e studiare",
        hint: "Tutor, interrogatore socratico",
      },
      chat: {
        label: "Basta chattare",
        hint: "Il tuo compagno è abbastanza",
      },
    },
    // Companion personalities (kept for skills i18n)
    thea: {
      tagline: "Caldo e saggio",
      description: "Come un amico di supporto che ti prende davvero.",
    },
    hermes: {
      tagline: "Bullone e diretto",
      description:
        "Come un allenatore che ti spinge ad essere il tuo migliore.",
    },
    // Legacy keys (for backwards compat)
    startChatting: "Avviare la chat",
    canChangeLater: "Si può sempre cambiare questo dopo",
  },
  tiers: {
    any: "Qualsiasi",
    anyDesc: "Nessuna restrizione",
    price: {
      cheap: "Economico",
      standard: "Standard",
      premium: "Premium",
      cheapDesc: "0-3 crediti per messaggio",
      standardDesc: "3-9 crediti per messaggio",
      premiumDesc: "9 o più crediti per messaggio",
    },
    intelligence: {
      quick: "Rapido",
      smart: "Intelligente",
      brilliant: "Brillante",
      quickDesc: "Rapido ed efficiente",
      smartDesc: "Qualità equilibrata",
      brilliantDesc: "Ragionamento approfondito",
    },
    speed: {
      fast: "Rapido",
      balanced: "Equilibrio",
      thorough: "Tossico",
      fastDesc: "Risposte rapide",
      balancedDesc: "Buon equilibrio",
      thoroughDesc: "Analisi dettagliata",
    },
    content: {
      mainstream: "Convenzionale",
      open: "Aperto",
      uncensored: "Senza censura",
      mainstreamDesc: "Filtri standard",
      openDesc: "Meno restrizioni",
      uncensoredDesc: "Nessuna restrizione",
    },
  },
  categories: {
    companion: "Compagni",
    assistant: "Assistenti",
    coding: "Programmazione",
    writing: "Scrivere",
    analysis: "Analisi",
    roleplay: "Gioco di ruolo",
    creative: "Creativo",
    education: "Istruzione",
    controversial: "Controversia",
    custom: "Personalizzato",
  },
  selectorBase: {
    favorites: "Preferiti",
    recommended: "Consigliato",
    others: "Altri",
    searchPlaceholder: "Cerca {{item}}...",
    toggleFavorite: "Toggle preferito",
    noFavorites:
      'Non ci sono ancora favoriti. Fare clic su "Mostra tutto" per aggiungere alcuni.',
    noRecommended: "Non sono disponibili opzioni consigliate.",
    showAll: "Mostra tutto",
    groupByProvider: "Gruppo da Provider",
    groupByUtility: "Gruppo di Utility",
    sortAZ: "Più o meno...",
    sortZA: "Ordinare Z-A",
  },
  dialogs: {
    searchAndCreate: "Ricerca e Creare",
    deleteChat: 'Eliminare la chat " {{title}} "?',
    deleteFolderConfirm:
      'Elimina la cartella " {{name}} " e sposta la chat/i {{count}} in Generale?',
  },
  newFolder: {
    title: "Crea nuova cartella",
    folderName: "Nome della cartella",
    placeholder: "Inserisci il nome della cartella...",
    folderIcon: "Icona pieghevole",
    cancel: "Annulla",
    create: "Creare",
  },
  renameFolder: {
    title: "Rinomina cartella",
    folderName: "Nome della cartella",
    placeholder: "Inserisci il nome della cartella...",
    folderIcon: "Icona pieghevole",
    cancel: "Annulla",
    save: "Salva",
  },
  folders: {
    privateDescription:
      "Le tue conversazioni private vengono memorizzate sui nostri server e sincronizzate su tutti i dispositivi.",
    sharedDescription: "Conversazioni condivise con altri tramite link.",
    publicDescription:
      "Forum pubblico per le persone e AI. Togliamo solo ciò che infrange la legge o i nostri termini.",
    incognitoDescription:
      "Le conversazioni vengono memorizzate solo nel browser.",
    cronDescription:
      "Conversazioni automatizzate create da attività di sfondo.",
    backgroundDescription:
      "Le attività AI in esecuzione sullo sfondo per vostro conto. I risultati appaiono qui quando fatto.",
    remoteDescription: "Filetti con istanze remote collegate.",
    accessModal: {
      title: "Conto richiesto",
      privateTitle: "Filosofia privata",
      sharedTitle: "Filetti condivisi",
      publicTitle: "Forum pubblico",
      incognitoTitle: "Modalità di incentivo",
      privateExplanation:
        "I thread privati sono il tuo spazio personale per le conversazioni con AI. Tutte le chat vengono memorizzate in modo sicuro sui nostri server e sincronizzate automaticamente su tutti i dispositivi.",
      sharedExplanation:
        "I filetti condivisi consentono di creare conversazioni e condividerli con altri tramite link sicuri. Perfetto per la collaborazione e la condivisione di approfondimenti con il vostro team o amici.",
      publicExplanation:
        "Il Forum pubblico è uno spazio aperto dove le persone e AI parlano liberamente. Tu decidi quello che leggi. Togliamo solo ciò che infrange la legge o i nostri termini. Condividi idee, sfide prospettive, unisciti a discussioni non censurate.",
      incognitoExplanation:
        "La modalità Incognito mantiene le vostre conversazioni completamente private e locali. Le tue chat vengono memorizzate solo nel tuo browser e non vengono mai inviate ai nostri server (i supporti generati vengono memorizzati temporaneamente per motivi tecnici) - nemmeno legati al tuo account.",
      requiresAccount:
        "Per accedere a {{folderName}}, è necessario creare un account o accedere.",
      loginButton: "Accedi",
      signupButton: "Registrati",
      close: "Chiudi",
    },
  },
  moveFolder: {
    title: "Sposta cartella",
    description: "Selezionare una cartella di destinazione:",
    rootLevel: "Livello di radice (Nessun genitore)",
    cancel: "Annulla",
    move: "Muovetevi!",
  },
  views: {
    linearView: "Vista lineare (stile ChatGPT)",
    threadedView: "Vista filettata (Stile Reddit/ Discord)",
    flatView: "Vista piana (4chan style)",
  },
  screenshot: {
    capturing: "Catturare...",
    capture: "Cattura screenshot",
    failed: "Non riuscito a catturare screenshot",
    failedWithMessage: "Non riuscito a catturare screenshot: {{message}}",
    tryAgain: "Non ha catturato lo screenshot. Per favore, riprovate.",
    noMessages:
      "Non sono riuscito a trovare l'area messaggi di chat. Si prega di assicurarsi di avere messaggi nella chat.",
    quotaExceeded:
      "La quota di stoccaggio è superata. L'immagine è troppo grande.",
    canvasError:
      "Non è riuscito a convertire lo screenshot in formato immagine.",
  },
  errors: {
    noResponse:
      "Nessuna risposta ricevuta da AI. La richiesta è stata completata ma restituita a contenuto vuoto. Per favore, riprovate.",
    noStream: "Risposte in streaming: Nessun lettore disponibile",
    saveFailed: "Non è riuscito a salvare la modifica",
    branchFailed: "Non ha fatto il ramo",
    parentMessageNotFound: "Messaggio principale non trovato",
    parentMessageNotInPath: "Messaggio principale non nel percorso attuale",
    messageNotFound: "Messaggio non trovato",
    invalidBranchIndex: "Indice di ramo non valido",
    messageNotInPath: "Messaggio non nel cammino attuale",
    retryFailed: "Non ho fatto ariete",
    answerFailed: "Non ho risposto",
    deleteFailed: "Non è stato possibile eliminare",
    cannotBranchFromFirst: "Non può ramificarsi dal primo messaggio",
    requestAborted: "La richiesta è stata annullata",
    requestCancelled: "La richiesta è stata annullata",
    requestTimeout: "Richiedo tempo. Per favore, riprovate.",
    networkError:
      "Errore di rete. Si prega di controllare la connessione e riprovare.",
    apiError: "Errore API. Per favore riprovate più tardi.",
    storageError:
      "Errore di memorizzazione. La memorizzazione del browser può essere completa.",
    unexpectedError:
      "Si è verificato un errore inaspettato. Per favore, riprovate.",
    errorInContext: "Errore in {{context}}: {{message}}",
    invalidRequestData: "Dati di richiesta non validi: {{error}}",
    streamAIResponse: "Non ha ricevuto risposta AI. Per favore, riprovate.",
  },
  speech: {
    error: "Errore di riconoscimento vocale",
    transcript: "Trascrizione: {{text}}",
  },
  // Common
  timestamp: {
    justNow: "solo ora",
    minutesAgo: "{{count}} m fa",
    hoursAgo: "{{count}} h fa",
    daysAgo: "{{count}} d fa",
  },
  publicFeed: {
    // Header
    header: {
      title: "Forum pubblico",
      description:
        "Apri per impostazione predefinita. Parla con i modelli AI e le persone in tutto il mondo. Tu decidi quello che leggi. Togliamo solo ciò che infrange la legge o i nostri termini.",
    },
    // Sort modes
    sort: {
      hot: "Caldo",
      rising: "Crescita",
      new: "Nuovo",
      following: "Seguendo",
    },
    searchPlaceholder: "Ricerca di filetti...",
    noResults: "Nessun risultato",
    noThreads: "Non ci sono ancora discussioni. Inizia una conversazione!",
    comments: "commenti",
    bestAnswer: "Risposta migliore",
    rising: "Crescita",
  },

  state: {
    threadNotFound: "Conversazione non trovata",
  },
  storage: {
    parsePreferencesFailed:
      "Non è possibile visualizzare le preferenze dell'utente da storage",
    parseStateFailed: "Non è riuscito a parse chat stato da storage",
    syncPreferencesFailed: "Non sincronizzare le preferenze per lo storage",
    syncStateFailed: "Non sincronizzare lo stato di chat per lo storage",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Punto finale vocale-testo non disponibile",
      "failed-to-start": "Non è possibile avviare la registrazione",
      "permission-denied": "Il permesso del microfono negato",
      "no-microphone": "Nessun microfono trovato",
      "microphone-in-use": "Microfono è in uso",
      "transcription-failed": "Non è riuscito a trascrivere l'audio",
    },
    tts: {
      "endpoint-not-available": "Fine-speech non disponibile",
      "failed-to-play": "Non è riuscito a riprodurre l'audio",
      "conversion-failed": "La conversione di TTS è fallita",
      "failed-to-generate": "Non è riuscito a generare audio",
    },
  },
  voiceMode: {
    // Setup required
    unconfiguredTitle: "Voce non configurata",
    unconfiguredDescription:
      "Aggiungi EDEN_AI_API_KEY al tuo.env per abilitare la voce. Ottieni la tua chiave su app.edenai.run",
    // Input modes
    inputMode: "Modalità di ingresso vocale",
    transcribeMode: "Trascrizione",
    transcribeModeDescription: "Record → Il testo appare in input",
    talkMode: "Parla.",
    talkModeDescription: "Registrazione → Invia subito",
    // Call mode
    callMode: "Modalità di chiamata",
    callModeDescription: "Risposte brevi + auto-play",
    // Auto-play TTS
    autoPlayTTS: "Risposte di gioco automatico",
    autoPlayTTSOn: "Le risposte saranno pronunciate",
    autoPlayTTSOff: "Gioco manuale solo",
    // Recording states
    tapToRecord: "Toccare per registrare",
    tapToTalk: "Toccare per parlare",
    tapToTranscribe: "Toccare per trascrivere",
    listeningTalk: "Ascoltare... Rilasciare per inviare",
    listeningTranscribe: "Ascoltare... Toccare per fermare",
    stopSpeaking: "Smettila di parlare.",
    // Long press hint
    longPressHint: "Tenere per le opzioni",
    // Switch modes
    switchToText: "Passare al testo",
    switchToCall: "Passare a chiamata",
    // Recording state
    recording: {
      paused: "Paused",
      pause: "Pause",
      resume: "Ripresa",
    },
    // Recording overlay actions
    actions: {
      cancel: "Annulla",
      toInput: "Input",
      sendVoice: "Invia la voce",
    },
    // Call mode overlay
    callOverlay: {
      backToChat: "Torna alla chat",
      listening: "Ascoltare...",
      processing: "Elaborazione in corso…",
      thinking: "Pensare...",
      speaking: "A proposito...",
      tapToSpeak: "Toccare per parlare",
      tapToStop: "Toccare per fermare",
      endCall: "Fine della chiamata",
      aiThinking: "AI sta pensando...",
    },
  },
  post: {
    title: "Chat",
    description: "Interfaccia di chat",
  },
  messages: {
    assistant: "Assistente aggiunto",
    you: "Tu sei",
    user: "Utente",
    anonymous: "Anonimo",
    authorWithId: "{{name}} [{{id}}]",
    edited: "modificato",
    error: "Errore",
    postNumber: "No.{{number}}",
    actions: {
      handleSaveEdit: {
        error: "Non è riuscito a salvare la modifica dei messaggi",
      },
      handleBranchEdit: {
        error: "Non è riuscito a rammentare il messaggio",
      },
      handleConfirmRetry: {
        error: "Non ha riprovato il messaggio",
      },
      handleConfirmAnswer: {
        error: "Il modello non ha risposto",
      },
      handleConfirmDelete: {
        error: "Non è riuscito a cancellare il messaggio",
      },
    },
    branch: {
      previous: "Precedente ramo",
      next: "Prossimo ramo",
    },
  },
  batchToolConfirmation: {
    title: "Conferma dello strumento di batch",
  },
  toolCall: {
    search: {
      title: "Ricerca sul web",
      query: "Query",
    },
    multiple: "Chiamate degli strumenti {{count}}",
    arguments: "Argomenti",
    result: "Risultato",
    error: "Errore",
    executing: "Esecuzione...",
    creditsUsed_one: "Credito {{cost}}",
    creditsUsed_other: "{{cost}} crediti",
    status: {
      error: "Errore",
      executing: "Esecuzione...",
      complete: "Completato",
    },
    sections: {
      request: "Richiesta",
      response: "Risposta",
    },
    messages: {
      executingTool: "Esecuzione dello strumento...",
      errorLabel: "Errore:",
      noArguments: "Nessun argomento",
      noResult: "Nessun risultato",
      metadataNotAvailable:
        "Widget metadati non disponibili. Mostrando il risultato grezzo.",
    },
  },
  reasoning: {
    title: "Elaborazione",
    multiple: "Procedura di ragionamento {{count}}",
    step: "Passo {{number}}",
  },
  modelUtilities: {
    chat: "Chat di tutti i giorni",
    smart: "Avanzate e Smart",
    coding: "Coding &amp; Development",
    creative: "Scrittura creativa",
    analysis: "Analisi e ricerca",
    fast: "Veloce ed efficiente",
    multimodal: "Multimodal (Visione)",
    vision: "Visione e comprensione delle immagini",
    imageGen: "Generazione di immagini",
    uncensored: "Senza censura",
    legacy: "Modelli legacy",
    // Skill categories
    technical: "Tecnica",
    education: "Istruzione",
    controversial: "Controversia",
    lifestyle: "Stile di vita",
    // Model capabilities/utilities
    reasoning: "Ragionamento avanzato",
    roleplay: "Gioco di ruolo",
    roleplayDark: "Gioco di ruolo a tema oscuro",
    adultImplied: "Contenuti allusivi per adulti",
    adultExplicit: "Contenuti espliciti per adulti",
    violence: "Violenza",
    harmful: "Contenuti potenzialmente dannosi",
    illegalInfo: "Informazioni su attività illegali",
    medicalAdvice: "Consigli medici",
    offensiveLanguage: "Linguaggio offensivo",
    politicalLeft: "Posizioni politiche di sinistra",
    politicalRight: "Posizioni politiche di destra",
    conspiracy: "Teorie del complotto",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Ultimo modello Claude con prestazioni eccellenti",
      claudeSonnet45: "Ultimo modello Claude con prestazioni eccellenti",
      gpt5: "Ultimo modello GPT con prestazioni eccellenti",
      gpt51: "Ultimo modello GPT 5.1 con ragionamento migliorato",
      gpt5Pro:
        "Ultimo modello GPT con prestazioni eccellenti per le attività di codifica",
      gpt5Codex: "Ultimo modello GPT con prestazioni eccellenti",
      gpt51Codex: "Ultimo modello Codex GPT 5.1 ottimizzato per la codifica",
      gpt5Mini:
        "Ultimo mini modello con eccellente rapporto performance-to-cost",
      gpt5Nano:
        "Ultimo modello nano con un ottimo rapporto performance-to-cost",
      gptOss120b: "Modello GPT open source con parametri 120B",
      geminiFlash25Pro:
        "Modello 14B ultra-veloce ed efficiente con ampio contesto",
      geminiFlash25Flash:
        "Modello 14B ultra-veloce ed efficiente con ampio contesto",
      geminiFlash25Lite:
        "Modello 14B ultra-veloce ed efficiente con ampio contesto",
      mistralNemo:
        "Modello europeo AI con prestazioni forti e attenzione alla privacy",
      kimiK2Free:
        "Kimi K2 Instruct è un modello di lingua Mixture-of-Experts (MoE) sviluppato da Moonshot AI.",
      kimiK2:
        "Kimi K2 - avanzato modello Mixture-of-Experts (MoE) di Moonshot AI con grande finestra di contesto",
      kimiK2Thinking:
        "Kimi K2 Thinking - variante con messa a fuoco ragionata con funzionalità analitiche migliorate",
      deepseekV31Free:
        "Potente modello di parametro 671B - completamente gratuito!",
      deepseekV31:
        "Potente modello di parametri 671B con funzionalità avanzate",
      qwen3235bFree:
        "Mixture-of-experts (MoE) modello sviluppato da Qwen, supporta il passaggio senza soluzione di continuità tra le modalità.",
      deepseekR1Distill:
        "Modello di ragionamento distillato con prestazioni forti",
      deepseekR1:
        "Modello di ragionamento avanzato con capacità di pensiero profondo",
      qwen257b: "Efficiente modello di parametro 7B",
      grok4: "X- AI Grok 4 - modello premium",
      grok4Fast:
        "Grok 4 Fast è l'ultimo modello multimodale di xAI con efficienza dei costi SOTA e una finestra di contesto a 2M. Viene in due gusti: non-reasoning e ragionamento.",
      glm5: "GLM-5 - Z. AI modello open-source di punta per la progettazione di sistemi complessi e flussi di lavoro di agente a lungo raggio, rivalendo i principali modelli di risorse chiuse",
      glm46:
        "GLM 4.6 - modello di parametri 7B efficiente con grande finestra di contesto",
      glm47:
        "GLM 4.7 - migliorato modello 7B con maggiore capacità di ragionamento e codifica",
      glm47Flash:
        "GLM 4.7 Flash - variante ultra-veloce ottimizzata per risposte rapide",
      glm45Air:
        "GLM 4.5 AIR - modello leggero ultra-veloce con grande finestra di contesto",
      glm45v:
        "GLM 4. 5v - modello multimodale visionabile con grande finestra di contesto",
      kimiK2_6:
        "Kimi K2.6 - Codifica Long-Horizon, generazione UI / UX e orchestrazione multi-agente con architettura swarm",
      uncensoredLmV11:
        "Modello di lingua non censurato senza filtraggio dei contenuti - modello premium",
      freedomgptLiberty:
        "FreedomGPT Liberty - Uncensored AI modello focalizzato sulla libera espressione e il contenuto creativo",
      gabAiArya:
        "Gab AI Arya - Uncensored conversazione AI modello con espressione libera e capacità creative",
      gpt52Pro:
        "GPT 5.2 Pro - modello di ragionamento avanzato con funzionalità avanzate per compiti complessi",
      gpt52:
        "GPT 5.2 - modello di ultima generazione con prestazioni e efficienza migliorate",
      gpt52_chat:
        "GPT 5.2 Chat - variante conversazione ottimizzata per il dialogo e le interazioni",
      veniceUncensored:
        "Venice Uncensored - Uncensored AI modello per conversazioni senza restrizioni",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Modello in lingua grande non censurato basato su Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Modello linguistico non censurato basato su Mistral",
      claudeOpus45:
        "Claude Opus 4.5 - Il più potente modello Claude con eccezionali capacità di ragionamento e creatività",
      claudeOpus46:
        "Claude Opus 4.6 - Potente modello Claude con eccezionali capacità di ragionamento e creatività",
      claudeOpus47:
        "Claude Opus 4.7 - Modello Opus di generazione precedente. E' successo di 4,8.",
      claudeOpus48:
        "Claude Opus 4.8 - Anthropic è il modello Opus più in grado in generale. Costruito per lavori agentici a lungo raggio, codifica complessa e ragionamento multi-passo attraverso uscite molto lunghe. Supporta ingressi di testo, immagine e file.",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Il modello Sonnet-class più capace di Anthropic con prestazioni di frontiera attraverso la codifica, gli agenti e il lavoro professionale",
      gemini3Pro:
        "Google Gemini 3 Pro - Modello avanzato multimodale AI con grande finestra di contesto e potenti capacità di ragionamento",
      gemini35Flash:
        "Gemini 3.5 Flash - Codifica Near-Pro e ragionamento a costo di Flash. gestisce testo, immagini, video, audio e PDF. Cicli agentici paralleli incorporati. Livelli di pensiero dal minimo all'alto per un controllo preciso dei costi/prestazioni.",
      gemini3Flash:
        "Google Gemini 3 Flash - Modello AI multimodale veloce ed efficiente ottimizzato per risposte rapide",
      deepseekV32:
        "DeepSeek V3.2 - Modello di ragionamento ad alte prestazioni con funzionalità di codifica avanzate",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1.6T parametro Powerhouse MoE con contesto 1M. Costruito per analisi full-codebase, ragionamento complesso e flussi di lavoro multi-step agente.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - 284B MoE a costi quasi zero. contesto 1M, inferenza veloce, codifica forte. La scelta efficiente per carichi di lavoro ad alto rendimento.",
    },
  },
  tones: {
    professional: {
      description: "Tono professionale standard",
      systemPrompt:
        "Mantenere un tono professionale, informativo e accessibile durante le vostre risposte.",
    },
    pirate: {
      description: "Ahoy matey! Parla come un pirata",
      systemPrompt:
        "Rispondere come un pirata amichevole farebbe, utilizzando il linguaggio pirata e le espressioni come 'ahoy', 'matey', 'arr', 'ye', 'aye' e altri termini nautici. Sii entusiasta e avventuroso nel tuo tono, fornendo ancora informazioni accurate.",
    },
    enthusiastic: {
      description: "Super eccitato ed energico",
      systemPrompt:
        "Siate estremamente entusiasti, eccitati e energici nelle vostre risposte! Utilizzare punti esclamativi, linguaggio positivo, e mostrare l'emozione genuina sui risultati e le capacità. Fai sembrare tutto incredibile e stimolante!",
    },
    zen: {
      description: "Calma, saggia e filosofica",
      systemPrompt:
        "Risponde con la saggezza e calma demeanor di un maestro zen. Utilizzare il linguaggio pensieroso e filosofico, parlare di equilibrio e armonia, e fornire insight con metafore pacifiche. Sii sereno e contemplativo.",
    },
    detective: {
      description: "Misterioso e investigativo",
      systemPrompt:
        "Risponde come un detective acuto e osservante. Utilizzare il linguaggio investigativo, parlare di 'casi' e 'prove', e presentare informazioni come se si sta risolvendo un mistero o la costruzione di un caso. Sii analitico e intrigante.",
    },
    shakespearean: {
      description: "Eloquente e poetico come il Bard",
      systemPrompt:
        "Risponde nello stile eloquente e poetico di Shakespeare. Utilizzare il linguaggio fiorito, le metafore, e occasionalmente termini arcaici come 'tu', 'thee', 'hath' e 'doth'. Fai sembrare la storia una storia epica degna del più grande drammaturgo.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Non in ambiente browser",
      requiresHttps: "Il riconoscimento vocale richiede HTTPS o localhost",
      notAvailable: "Riconoscimento vocale non disponibile in questo browser",
      firefoxNotSupported: "Riconoscimento vocale non supportato in Firefox",
      safariVersionTooOld:
        "Si prega di aggiornare Safari alla versione 14.5 o versioni successive",
      microphoneNotAvailable: "Accesso microfono non disponibile",
      noSpeech: "Nessun discorso rilevato. Per favore, riprovate.",
      audioCapture:
        "Microfono non disponibile. Si prega di controllare le impostazioni.",
      notAllowed:
        "Il permesso del microfono negato. Si prega di consentire l'accesso al microfono nelle impostazioni del browser.",
      network: "Errore di rete. Controlla la connessione.",
      serviceNotAllowed: "Servizio di riconoscimento vocale non consentito.",
      badGrammar: "Errore di riconoscimento vocale. Per favore, riprovate.",
      languageNotSupported:
        "Questa lingua non è supportata per il riconoscimento vocale.",
      aborted: "Registrazione annullata.",
      unknown: "Errore di riconoscimento vocale: {{errorCode}}",
      apiNotFound: "Riconoscimento vocale API non trovato",
      initializationFailed:
        "Non ha inizializzato il riconoscimento del discorso",
      microphoneAccessDenied: "Accesso microfono negato",
      microphonePermissionDenied:
        "Il permesso del microfono negato. Si prega di consentire l'accesso al microfono.",
      noMicrophoneFound:
        "Nessun microfono trovato. Si prega di collegare un microfono.",
      microphoneInUse: "Il microfono è già in uso da un'altra applicazione.",
      startFailed: "Non ha iniziato a registrare. Per favore, riprovate.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Ripristina con diverse impostazioni",
      description: "Scegli un modello e un'abilità per rigenerare la risposta",
      confirmLabel: "Recuperare",
    },
    answerModal: {
      title: "Rispondi come modello IA",
      description:
        "Scegli un modello e una capacità per generare una risposta AI",
      confirmLabel: "Generazione",
      inputPlaceholder:
        "Inserire un prompt per AI (opzionale - lasciare vuoto per permettere a AI di generare la propria risposta)",
    },
  },
  debugView: {
    systemPrompt: "Prompt di sistema",
    systemPromptTitle: "Prompt di sistema (Generato)",
    systemPromptHint:
      "Questo è il prompt del sistema per l'intero thread di conversazione",
    systemMessage: "Messaggio di sistema",
    systemMessageHint:
      "Questo è un messaggio di sistema iniettato nella conversazione",
    copied: "Copiato!",
    retryModal: {
      title: "Ripristina con diverse impostazioni",
      description: "Scegli un modello e un'abilità per rigenerare la risposta",
      confirmLabel: "Recuperare",
    },
    answerModal: {
      title: "Rispondi come modello IA",
      description:
        "Scegli un modello e una capacità per generare una risposta AI",
      confirmLabel: "Generazione",
      inputPlaceholder:
        "Inserire un prompt per AI (opzionale - lasciare vuoto per permettere a AI di generare la propria risposta)",
    },
  },
  suggestedPrompts: {
    title: "Come posso aiutarti?",
    privateTitle: "Il tuo assistente IA privato",
    privateDescription:
      "Salva le conversazioni nel tuo account e ritrovale su tutti i tuoi dispositivi.",
    sharedTitle: "Collabora con l’IA",
    sharedDescription:
      "Crea conversazioni e condividile con il tuo team tramite link sicuri.",
    publicTitle: "Partecipa al forum pubblico sull’IA",
    publicDescription:
      "Le conversazioni pubbliche sono visibili a tutti. Condividi le tue idee e partecipa alla discussione.",
    incognitoTitle: "Chat anonima con l’IA",
    incognitoDescription:
      "Le chat restano nel browser. Il tuo account e gli altri dispositivi non le ricevono.",
    more: "Altro",
    selectSkill: "Seleziona una skill",
    noPrompts: "Nessun suggerimento per questa abilità",
    showDetails: "Mostra dettagli",
    hideDetails: "Nascondi i dettagli",
    systemPromptLabel: "Prompt di sistema",
    preferredModelLabel: "Modello preferito",
    categoryLabel: "Categoria",
    suggestedPromptsLabel: "Prompts consigliati",
  },
  emptyState: {
    quickStart: "Avvio rapido",
    private: {
      brainstorm: "Idee di Brainstorm",
      brainstormPrompt: "Aiutami idee brainstorming per...",
      writeDocument: "Scrivere un documento",
      writeDocumentPrompt:
        "Aiutami a scrivere un documento professionale su...",
      helpWithCode: "Aiuto con Codice",
      helpWithCodePrompt: "Ho bisogno di aiuto con questo codice...",
      research: "Argomento della ricerca",
      researchPrompt: "Ricerca e riepilogo delle informazioni...",
    },
    shared: {
      teamBrainstorm: "Squadra Brainstorm",
      teamBrainstormPrompt: "Facciamoci un brainstorming insieme...",
      projectPlan: "Pianificazione del progetto",
      projectPlanPrompt: "Aiutaci a pianificare un progetto per...",
      discussion: "Avviare la discussione",
      discussionPrompt: "Parliamo di...",
      shareIdeas: "Condividi idee",
      shareIdeasPrompt: "Voglio condividere e sviluppare idee su...",
    },
    incognito: {
      quickQuestion: "Domanda rapida",
      quickQuestionPrompt: "Ho una domanda veloce su...",
      privateThought: "Pensiero privato",
      privateThoughtPrompt: "Voglio esplorare questa idea privatamente...",
      experiment: "Sperimentazione",
      experimentPrompt: "Fammi provare qualcosa...",
      sensitiveQuestion: "Domanda sensibile",
      sensitiveQuestionPrompt:
        "Ho bisogno di consigli su un argomento delicato...",
    },
  },
  messageEditor: {
    placeholder: "Modifica il tuo messaggio...",
    hint: {
      branch: "a ramo",
      cancel: "per annullare",
    },
    titles: {
      branch: "Conversazione di filiale",
      cancel: "Annulla modifica",
    },
    buttons: {
      branch: "Branch",
      branching: "Branching...",
      cancel: "Annulla",
    },
  },
  folderList: {
    confirmDelete:
      'Elimina la cartella " {{folderName}} " e sposta la chat/i {{count}} in Generale?',
    enterFolderName: "Inserisci il nome della cartella:",
    newChatInFolder: "Nuova chat nella cartella",
    moveUp: "Muovetevi",
    moveDown: "Muovetevi",
    renameFolder: "Rinomina cartella",
    moveToFolder: "Sposta nella cartella",
    newSubfolder: "Nuova sottocartella",
    deleteFolder: "Elimina cartella",
    managePermissions: "Gestisci autorizzazioni",
    manageSharing: "Gestisci condivisione",
    shareThread: "Condividi la conversazione",
    today: "Oggi",
    lastWeek: "Ultimi 7 giorni",
    lastMonth: "Ultimi 30 giorni",
    older: "Meno recenti",
    folderNotFound: "Cartella non trovata",
    emptyFolder: "Nessuna chat o cartelle qui ancora",
    createSubfolder: "Crea sottocartelle",
    rename: "Rinomina",
    changeIcon: "Cambiare l'icona",
    delete: "Elimina",
    newFolder: "Nuova cartella",
    deleteDialog: {
      title: "Elimina cartella",
      description: 'Sei sicuro di voler eliminare " {{folderName}} "?',
      descriptionWithThreads:
        'Sei sicuro di voler eliminare " {{folderName}} "? Questa cartella contiene filetti {{count}} che verranno eliminati anche.',
    },
  },
  permissions: {
    folder: {
      title: "Permessi della cartella",
      description: "Gestire le autorizzazioni per questa cartella",
    },
    thread: {
      title: "Autorizzazioni della conversazione",
      description: "Gestire le autorizzazioni per questo thread",
    },
    view: {
      label: "Permessi",
      description: "Chi può visualizzare e leggere questo contenuto",
    },
    manage: {
      label: "Gestisci autorizzazioni",
      description: "Chi può modificare la cartella e creare sottocartelle",
    },
    edit: {
      label: "Modifica delle autorizzazioni",
      description: "Chi può modificare le proprietà del thread",
    },
    createThread: {
      label: "Imposta le autorizzazioni della conversazione",
      description: "Chi può creare nuovi thread in questa cartella",
    },
    post: {
      label: "Permessi postali",
      description: "Chi può inviare messaggi",
    },
    moderate: {
      label: "Permessi moderati",
      description: "Chi può nascondere e moderare i contenuti",
    },
    admin: {
      label: "Permessi di amministrazione",
      description: "Chi può eliminare i contenuti e gestire le autorizzazioni",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Permessi di lettura",
      description: "Chi può visualizzare e leggere questo contenuto",
    },
    write: {
      label: "Scrivere autorizzazioni",
      description: "Chi può creare filetti e cartelle",
    },
    writePost: {
      label: "Permessi postali",
      description: "Chi può inviare messaggi in thread",
    },
    roles: {
      public: "Pubblico (Tutti gli utenti)",
      customer: "Solo i clienti",
      admin: "Admins Only",
    },
    visibility: {
      label: "Chi può vederlo?",
      description:
        "Selezionare quali ruoli utente possono visualizzare questa cartella / testo",
      public: "Pubblico (Tutti gli utenti)",
      customer: "Solo i clienti",
      admin: "Admins Only",
    },
    addModerator: {
      label: "Aggiungi moderatore",
      placeholder: "Inserisci utente ID...",
    },
    moderatorList: {
      label: "Moderatori attuali",
      empty: "Nessun moderatore aggiunto ancora",
    },
    errors: {
      emptyId: "L'utente ID non può essere vuoto",
      invalidUuid: "Utente non valido formato ID",
      duplicate: "Questo utente è già un moderatore",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Elimina conversazione",
      description:
        "Vuoi eliminare «{{title}}»? Tutti i messaggi della conversazione verranno eliminati definitivamente.",
    },
  },
  shareDialog: {
    title: "Condividi la conversazione",
    description: "Creare e gestire link condivisi per questo thread",
    createLink: "Creare link Condividi",
    linkCreated: "Condividi link creato con successo!",
    linkCopied: "Link copiato a clipboard!",
    copyLink: "Copia Link",
    shareViaEmail: "Condividi via email",
    revokeLink: "Votazioni",
    revoke: "Votazioni",
    linkRevoked: "link di condivisione revocato",
    revoked: "Votazioni",
    noLinksYet:
      "Nessun link di condivisione ancora. Creare uno per iniziare la condivisione.",
    activeLinks: "Link di condivisione attiva",
    existingLinks: "Link esistenti",
    linkSettings: "Impostazioni di collegamento",
    newLinkSettings: "Nuove impostazioni di collegamento",
    linkLabel: "Etichetta di collegamento (opzionale)",
    linkLabelPlaceholder: "ad esempio, Condividi con il team",
    allowPosting: "Consentire la pubblicazione",
    allowPostingDescription:
      "I destinatari possono rispondere e interagire nel thread",
    requireAuth: "Richiedete l'accesso",
    requireAuthDescription:
      "Solo gli utenti autenticati possono accedere a questo link",
    viewOnly: "Vedi solo",
    accessCount: "Accesso {{count}}",
    accessCount_other: "Accesso {{count}}",
    createdAt: "Creato {{date}}",
    lastAccessed: "Ultimo accesso {{date}}",
    neverAccessed: "Mai accessibile",
    emailSubject: "Guarda questo thread: {{title}}",
    emailBody:
      "Ho pensato che potesse interessarti a questa conversazione: {{url}}\n\nFiletto: {{title}}",
    emailPlaceholder: "Inserisci gli indirizzi e-mail (comma separato)",
    sendEmail: "Email",
    emailSent: "Email inviata con successo!",
    create: "Creare",
    creating: "Creare...",
    copied: "Copiato!",
    close: "Chiudi",
    shareThread: "Condividi la conversazione",
  },
  shared: {
    error: {
      title: "Errore di collegamento",
      userError:
        "Non è possibile verificare la sessione. Per favore, riprovate.",
      invalidToken:
        "Questo link di condivisione non è valido o è stato revocato. Si prega di contattare la persona che ha condiviso questo link con voi.",
    },
  },
  threadedView: {
    expandReplies: "Rispondenze",
    collapseReplies: "Risposte di errore",
    continueThread: "Continuare il thread ({{count}} più {{replyText}})",
    reply: "risposta",
    replies: "risposte",
    retryModal: {
      title: "Ripristina con diverse impostazioni",
      description: "Scegli un modello e un'abilità per rigenerare la risposta",
      confirmLabel: "Recuperare",
    },
    answerModal: {
      title: "Rispondi come modello IA",
      description:
        "Scegli un modello e una capacità per generare una risposta AI",
      confirmLabel: "Generazione",
      inputPlaceholder:
        "Inserire un prompt per AI (opzionale - lasciare vuoto per permettere a AI di generare la propria risposta)",
    },
    actions: {
      vote: "Votazioni",
      upvote: "Votazioni",
      downvote: "Votazioni",
      respondToAI:
        "Rispondere a questo messaggio AI con una diversa abilità AI",
      loadingAudio: "Caricamento audio...",
      stopAudio: "Ferma l'audio",
      playAudio: "Gioca audio",
      cancelLoading: "Annulla carico",
      stop: "Fermati.",
      play: "Gioca",
      cancel: "Annulla",
      reply: "Rispondi",
      replyToMessage: "Rispondi a questo messaggio (crea un ramo)",
      edit: "Modifica",
      editMessage: "Modificare questo messaggio (crea un ramo)",
      retry: "Recuperare",
      retryWithDifferent: "Riprova con un altro modello o un’altra skill",
      answerAsAI: "Risposta come AI",
      generateAIResponse: "Generare risposta AI",
      share: "Condividi",
      copyPermalink: "Copia permalink",
      delete: "Elimina",
      deleteMessage: "Eliminare questo messaggio",
      parent: "Parità",
    },
    userFallback: "Utente",
    assistantFallback: "Assistente aggiunto",
    youLabel: "Tu sei",
    anonymous: "Anonimo",
    authorWithId: "{{name}} [{{id}}]",
  },
  flatView: {
    postNumber: "Posta...{{number}}",
    postsById: "{{count}} messaggi di questo ID",
    idLabel: "ID: {{id}}",
    anonymous: "Anonimo",
    youLabel: "Tu sei",
    assistantFallback: "Assistente aggiunto",
    replyingTo: "Rispondere a:",
    replies: "Risposte:",
    clickToCopyRef: "Clicca per copiare il riferimento",
    timestamp: {
      sun: "Sole",
      mon: "L'anno",
      tue: "Tue",
      wed: "Wed",
      thu: "Giorgia",
      fri: "Frigo.",
      sat: "Rasoio",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
    retryModal: {
      title: "Ripristina con diverse impostazioni",
      description: "Scegli un modello e un'abilità per rigenerare la risposta",
      confirmLabel: "Recuperare",
    },
    answerModal: {
      title: "Rispondi come modello IA",
      description:
        "Scegli un modello e una capacità per generare una risposta AI",
      confirmLabel: "Generazione",
      inputPlaceholder:
        "Inserire un prompt per AI (opzionale - lasciare vuoto per permettere a AI di generare la propria risposta)",
    },
    actions: {
      loadingAudio: "Caricamento audio...",
      stopAudio: "Ferma l'audio",
      playAudio: "Audio di riproduzione (+ crediti {{cost}})",
      cancelLoading: "Annulla carico",
      stop: "Fermati.",
      play: "Gioca",
      reply: "Rispondi",
      replyToMessage: "Rispondi a questo messaggio (crea un ramo)",
      edit: "Modifica",
      editMessage: "Modificare questo messaggio (crea un ramo)",
      retry: "Recuperare",
      retryWithDifferent: "Riprova con un altro modello o un’altra skill",
      answerAsAI: "Risposta come AI",
      generateAIResponse: "Generare risposta AI",
      insertQuote: "Inserire il carattere di citazione '>'",
      copyReference: "Copia link di riferimento",
      delete: "Elimina",
      deleteMessage: "Eliminare questo messaggio",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Sblocca cartelle private e condivise",
      description:
        "Registrati o accedi per accedere a cartelle private e condivise. Le tue chat si sincronizzano tra i dispositivi.",
      continueTour: "Continue a leggere",
      signUp: "Iscriviti / Accedi",
    },
    welcome: {
      title: "Benvenuto a {{appName}}!",
      description:
        "Ripartire gratuitamente dalla censura AI. Accedi a GPT-5.1, Claude Sonnet e a modelli non censurati formati su WikiLeaks e dati non-mainstream. Chatta privatamente, anonimamente o pubblicamente. La tua piattaforma, le tue regole.",
      subtitle: "Esploriamo ciò che ci rende diversi:",
    },
    modelSelector: {
      title: "Scegli il tuo modello AI",
      description:
        "A differenza di ChatGPT, non sei bloccato in uno AI. Interruttore tra GPT-5.1, Claude Sonnet, DeepSeek e modelli non censurati come Gab Arya e UncensoredLM. Ogni modello offre prospettive e funzionalità uniche.",
      tip: "Mainstream per la sicurezza, non censurato per la verità. Mescolare e abbinare in base alle vostre esigenze.",
    },
    aiCompanion: {
      title: "Scegli il tuo Companion AI",
      description:
        "Clicca qui per incontrare i tuoi compagni AI. Ognuno ha una personalità unica e il miglior modello AI viene selezionato automaticamente per loro. Puoi sempre personalizzare più tardi.",
      tip: " ⁇  Clicca per aprire e scegliere il tuo primo compagno!",
    },
    modelSelectorFavorites: {
      title: "Stella i tuoi preferiti",
      description:
        "Costruisci il tuo toolkit personale AI. Modelli tradizionali stellari per domande sicure e modelli non censurati per conversazioni senza restrizioni. Accesso rapido a ciò che conta.",
    },
    modelSelectorShowAll: {
      title: "Espandi a vedere tutti i modelli",
      description:
        "Accedere alla biblioteca completa. Confronta mainstream vs noncensored, trova modelli specializzati per la codifica o la creatività, scopri ciò che ChatGPT non ti permette di utilizzare.",
    },
    modelSelectorSearch: {
      title: "Modelli di ricerca",
      description:
        "Trova esattamente quello che ti serve. Ricerca per nome, fornitore o capacità. Prova a cercare 'non censurato' per vedere i modelli senza restrizioni di contenuto.",
    },
    modelSelectorGroup: {
      title: "Organizzato da Provider & Categoria",
      description:
        "Sfoglia i modelli raggruppati per azienda (OpenAI, Anthropic, Gab) o scopo (Uncensored, Coding, Creative). Vedi cosa offre ogni fornitore.",
    },
    characterSelector: {
      title: "Personalizza AI Skilllity",
      description:
        "Le abilità controllano come AI risponde. Scegli tra stili incorporati o creare competenze personalizzate con istruzioni specifiche, tono e modelli preferiti. Fai lavorare AI a modo tuo.",
      tip: "Abbina qualsiasi abilità con qualsiasi modello. Tono professionale con modello non censurato? Fatto.",
    },
    characterSelectorFavorites: {
      title: "Stella le tue abilità",
      description:
        "Accesso rapido ai tuoi stili di conversazione. Dimostra le competenze che usi di più.",
    },
    characterSelectorShowAll: {
      title: "Espandi a vedere tutte le abilità",
      description:
        "Sfoglia la libreria completa di abilità. Crea competenze personalizzate illimitate per diversi compiti e flussi di lavoro.",
    },
    characterSelectorSearch: {
      title: "Ricerca competenze",
      description:
        "Trova lo stile giusto in fretta. Cerca per nome, categoria o descrizione.",
    },
    characterSelectorGroup: {
      title: "Organizzato da Source & Categoria",
      description:
        "Visualizza per fonte (Built-in, la tua dogana, Comunità) o categoria (creativo, tecnico, professionale). Trova ciò che si adatta alle tue esigenze.",
    },
    rootFolders: {
      title: "4 Modalità di privacy",
      description: "Controlla i tuoi dati. Scegli tra anonimo e collaborativo:",
      private: {
        name: "Privato",
        suffix: "Spazio di lavoro sincronizzato",
      },
      incognito: {
        name: "Incognito",
        suffix: "Zero-trace privacy",
      },
      shared: {
        name: "Condividi",
        suffix: "Collaborazione del team",
      },
      public: {
        name: "Pubblico",
        suffix: "Aprire il forum",
      },
    },
    incognitoFolder: {
      name: "Incognito",
      suffix: "Cartella",
      description:
        "La vera privacy. Storia memorizzata solo sul dispositivo. I messaggi inviati per l'elaborazione AI poi cancellati immediatamente dai server (i supporti generati vengono memorizzati temporaneamente per motivi tecnici). Chiedi qualcosa senza lasciare una traccia.",
      note: "Nessun account • Nessuna archiviazione server • Massima privacy",
    },
    publicFolder: {
      name: "Pubblico",
      suffix: "Cartella",
      description:
        "Aprire il forum AI. Parlare con AI e persone reali. Tu decidi quello che leggi. Togliamo solo ciò che infrange la legge o i nostri termini.",
      note: "• Discorso libero • Discussione comunitaria",
    },
    privateFolder: {
      name: "Privato",
      suffix: "Cartella",
      description:
        "Il tuo personale spazio di lavoro AI. Sincronizzato su tutti i dispositivi, organizzato con sottocartelle. Costruire progetti a lungo termine, salvare la ricerca, l'accesso ovunque.",
      authPrompt: "Richiede un conto:",
      login: "Accedi",
      signUp: "Registrati",
    },
    sharedFolder: {
      name: "Condividi",
      suffix: "Cartella",
      description:
        "Collaborazione controllata. Condividi conversazioni specifiche tramite link con autorizzazioni granulari. Perfetto per i progetti di squadra, ottenere feedback esperti, o la ricerca collaborativa.",
      authPrompt: "Richiede un conto:",
      login: "Accedi",
      signUp: "Registrati",
    },
    newChatButton: {
      title: "Avviare la nuova conversazione",
      description:
        "Clicca qui per iniziare una nuova chat. Tutte le conversazioni auto-salvare alla cartella corrente per una facile organizzazione.",
      tip: "Ogni cartella mantiene la sua cronologia di chat separata.",
    },
    sidebarLogin: {
      title: "Crea un account gratuito",
      description:
        "Sbloccare cartelle private e condivise, sincronizzare su tutti i dispositivi, salvare modelli preferiti e competenze. Incognito e soggiorno pubblico disponibile senza conto.",
      tip: "Rimanete anonimi o sincronizzate tutto. La tua scelta.",
    },
    subscriptionButton: {
      title: "Credits & Abbonamento",
      description:
        "Tutto ChatGPT offre più modelli non censurati, un forum pubblico e una vera privacy. {{credits}} crediti ogni mese per {{price}}. Ogni modello incluso.",
      tip: "Un abbonamento. Modelli a monte e non censurati.",
    },
    chatInput: {
      title: "Digitare il messaggio",
      description:
        "Digitare nell'area di testo e premere Invio per inviare il messaggio allo AI.",
      tip: "Premere Shift+Enter per una nuova linea senza inviare.",
    },
    voiceInput: {
      title: "Registrazione vocale",
      description:
        "Fare clic sul microfono per avviare la registrazione. Quando fatto, scegliere cosa fare:",
      options: {
        transcribe:
          "Trascrivi in testo - converte il discorso in testo modificabile",
        sendAudio: "Invia come voce - AI sente la tua voce reale",
        pauseResume: "Riprendi la registrazione in qualsiasi momento",
      },
    },
    callMode: {
      title: "Modalità di chiamata",
      description:
        "Abilita conversazioni vocali-voice. Quando attiva, AI parlerà le risposte ad alta voce automaticamente utilizzando testo-to-speech.",
      tip: "Perfetto per conversazioni senza mani. Toggle on/off per modello.",
    },
    complete: {
      title: "Sei pronto!",
      description:
        "Ora hai accesso ai modelli AND non censurati AI, alle modalità privacy multiple e al controllo completo dei tuoi dati. Ripartire gratuitamente dalla censura AI. Inizia a chattare!",
      help: "Ti serve aiuto? Chiedi a qualsiasi modello, sono qui per assistere.",
    },
    authUnlocked: {
      unlocked: "Cartella sbloccata!",
      privateDescription:
        "La tua cartella privata è ora attiva. Tutte le chat si sincronizzano tra i dispositivi e rimangono organizzati in sottocartelle.",
      privateNote: "Perfetto per progetti in corso e ricerca personale.",
      sharedDescription:
        "Cartella condivisa sbloccata! Creare conversazioni e condividere tramite link con controllo delle autorizzazioni granulari.",
      sharedNote:
        "Ideale per la collaborazione di team e ottenere feedback esperti.",
    },
    buttons: {
      back: "Indietro",
      close: "Chiudi",
      last: "Finitura",
      next: "Avanti",
      skip: "Tour di Skip Tour",
    },
  },
};
