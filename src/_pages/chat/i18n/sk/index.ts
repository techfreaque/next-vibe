import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Prihlásiť sa",
      logout: "Odhlásiť sa",
    },
  },
  common: {
    newChat: "Nové vlákno",
    newPrivateChat: "Súkromné vlákno",
    newSharedChat: "Zdieľané vlákno",
    newPublicChat: "Verejné vlákno",
    newIncognitoChat: "Vlákno inkognito",
    newPrivateFolder: "Nový súkromný priečinok",
    newSharedFolder: "Nový zdieľaný priečinok",
    newPublicFolder: "Nový verejný priečinok",
    newIncognitoFolder: "Nový priečinok inkognito",
    createNewPrivateFolder: "Vytvoriť súkromný priečinok",
    createNewSharedFolder: "Vytvoriť zdieľaný priečinok",
    createNewPublicFolder: "Vytvoriť verejný priečinok",
    createNewIncognitoFolder: "Vytvoriť priečinok inkognito",
    privateChats: "Súkromné vlákna",
    sharedChats: "Zdieľané vlákna",
    publicChats: "Verejné vlákna 1A",
    incognitoChats: "Vlákna inkognito",
    cronChats: "Vlákna na pozadí",
    backgroundChats: "Na pozadí",
    remoteChats: "Vzdialené",
    search: "Hľadať",
    delete: "Odstrániť",
    cancel: "Zrušiť",
    save: "Uložiť",
    send: "Odoslať",
    sending: "Odosiela sa…",
    edit: "Upraviť",
    settings: "Nastavenia",
    toggleSidebar: "Zobraziť alebo skryť bočný panel",
    lightMode: "Svetlý režim",
    darkMode: "Tmavý režim",
    searchPlaceholder: "Hľadať…",
    searchThreadsPlaceholder: "Hľadať vo vláknach…",
    searchResults: "Výsledky vyhľadávania ({{count}})",
    noChatsFound: "Nenašli sa žiadne čety",
    noThreadsFound: "Nenašli sa žiadne vlákna",
    enableTTSAutoplay: "Zapnúť automatické čítanie nahlas",
    disableTTSAutoplay: "Vypnúť automatické čítanie nahlas",
    closeSidebar: "Zavrieť bočný panel",
    close: "Zavrieť",
    showMore: "Zobraziť viac",
    showLess: "Zobraziť menej",
    viewFullThread: "Zobraziť celé vlákno",
    viewAllThreads: "Zobraziť všetky vlákna",
    backToChat: "Späť na čet",
    language: "Jazyk",
    loginRequired:
      "Na používanie priečinkov s ukladaním sa prihlás. Na anonymný čet použi režim inkognito.",

    // Copy Button
    copyButton: {
      copyToClipboard: "Kopírovať do schránky",
      copied: "Skopírované",
      copyAsMarkdown: "Kopírovať ako Markdown",
      copyAsText: "Kopírovať ako text",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Zastaviť prehrávanie",
      playAudio: "Prehrať zvuk (kredity navyše: {{cost}})",
      cancelLoading: "Zrušiť načítavanie",
      answerAsAI: "Odpovedať ako model AI",
      deleteMessage: "Odstrániť správu",
      actualCostUsed: "Skutočná spotreba kreditov za túto správu",
      tokensUsed: "Celkový počet použitých tokenov",
      credits: "kredity",
      tokens: "tokeny",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Vytvoriť vetvu rozhovoru odtiaľto",
      retry: "Skúsiť znova s iným modelom alebo zručnosťou",
      deleteMessage: "Odstrániť správu",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Lineárne zobrazenie (ako v ChatGPT)",
      threadedView: "Zobrazenie vo vláknach (ako na Reddite alebo Discorde)",
      flatView: "Zobrazenie bez vnorenia (ako na 4chane)",
      debugView: "Ladiace zobrazenie so systémovými pokynmi",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Hľadať a vytvoriť",
      newChat: "Nový čet",
      searchThreadsPlaceholder: "Hľadať vo vláknach…",
      noThreadsFound: "Nenašli sa žiadne vlákna",
    },

    // Selector
    selector: {
      country: "Krajina",
      language: "Jazyk",
    },
  },

  aiTools: {
    modal: {
      title: "Nástroje AI",
      description:
        "Nástroje zvyčajne nemusíš nastavovať. Keď je zapnutý pomocník, AI si môže podľa potreby zavolať povolené nástroje. Pripni len tie, ktoré má mať stále v kontexte.",
      searchPlaceholder: "Hľadať nástroje…",
      loading: "Načítavajú sa nástroje…",
      noToolsFound: "Hľadaniu nezodpovedá žiadny nástroj",
      noToolsAvailable: "Žiadne nástroje AI nie sú k dispozícii",
      expandAll: "Rozbaliť všetko",
      collapseAll: "Zbaliť všetko",
      selectAll: "Vybrať všetko",
      deselectAll: "Zrušiť výber",
      enableAll: "Povoliť všetko",
      resetToDefault: "Obnoviť predvolené nastavenia",
      stats: "Pripnuté nástroje: {{enabled}} z {{total}}",
      aliases: "Aliasy",
      requireConfirmation: "Pred použitím vyžiadať potvrdenie",
      activeLabel: "pripnuté",
      enabledLabel: "povolené",
      totalLabel: "spolu",
      activeTooltip: "Pripnuté nástroje má AI v kontexte pri každom kroku",
      enabledTooltip:
        "Ak je zapnutý pomocník, AI si môže povolené nástroje zavolať podľa potreby",
      legendActive: "Stále v kontexte (pripnuté)",
      legendConfirm: "Pred spustením si vyžiada súhlas",
      activeOn: "Pripnutý nástroj je stále v kontexte. Kliknutím ho odopneš",
      activeOff:
        "Nástroj nie je pripnutý. AI si ho môže zavolať podľa potreby, ak má oprávnenie. Kliknutím ho pripneš",
      confirmOn: "Vyžaduje potvrdenie. Kliknutím potvrdenie vypneš",
      confirmOff: "Spúšťa sa automaticky. Kliknutím zapneš povinné potvrdenie",
    },
  },

  confirmations: {
    deleteMessage: "Chceš túto správu naozaj odstrániť?",
  },

  iconSelector: {
    tabs: {
      library: "Knižnica ikon",
      emoji: "Unicode a emoji",
    },
    emojiTab: {
      label: "Zadaj emoji alebo znak Unicode",
      placeholder: "🤖 alebo ľubovoľný text",
      apply: "Použiť",
      currentIcon: "Aktuálna ikona:",
      commonEmojis: "Často používané emoji:",
    },
  },

  createSkill: {
    title: "Vytvoriť vlastnú zručnosť",
    description:
      "Vytvor si zručnosť AI s vlastnou osobnosťou, odbornosťou a spôsobom odpovedania.",
    icon: "Ikona",
    name: "Názov",
    namePlaceholder: "Napr. kontrolór kódu",
    descriptionLabel: "Opis",
    descriptionPlaceholder: "Stručne opíš, čo táto zručnosť dokáže",
    category: "Kategória",
    selectCategory: "Vyber kategóriu",
    systemPrompt: "Systémové pokyny",
    systemPromptPlaceholder:
      "Opíš, ako sa má zručnosť správať. Uveď jej osobnosť, odbornosť a spôsob odpovedania.",
    voice: "Hlas",
    voicePlaceholder: "Vyber hlas na čítanie textu",
    create: "Vytvoriť zručnosť",
    creating: "Vytvára sa…",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Zadaj názov",
      descriptionRequired: "Zadaj opis",
      systemPromptRequired: "Zadaj systémové pokyny",
      createFailed: "Zručnosť sa nepodarilo vytvoriť. Skús to znova.",
    },
  },

  voice: {
    male: "Mužský",
    female: "Ženský",
  },

  editSkill: {
    title: "Upraviť ako vlastnú zručnosť",
    description:
      "Vytvor si podľa tejto zručnosti vlastnú. Všetky nastavenia môžeš zmeniť.",
    loginRequired:
      "Ak chceš vytvárať a upravovať vlastné zručnosti, prihlás sa. Uložia sa do tvojho účtu.",
    name: "Názov",
    namePlaceholder: "Názov vlastnej zručnosti",
    descriptionLabel: "Opis",
    descriptionPlaceholder: "Čo táto zručnosť dokáže?",
    category: "Kategória",
    icon: "Ikona",
    voice: "Hlas",
    voicePlaceholder: "Vybrať hlas",
    preferredModel: "Uprednostňovaný model",
    preferredModelPlaceholder: "Voliteľný uprednostňovaný model",
    systemPrompt: "Systémové pokyny",
    systemPromptPlaceholder: "Opíš, ako sa má zručnosť správať…",
    save: "Uložiť ako vlastnú zručnosť",
    saveAsCopy: "Uložiť ako kópiu",
    saving: "Vytvára sa…",
    cancel: "Zrušiť",
    login: "Prihlásiť sa a upraviť",
    signup: "Zaregistrovať sa a upraviť",
  },

  userProfile: {
    postCount: "{{count}} príspevok",
    postCount_other: "Počet príspevkov: {{count}}",
    recentPosts: "Najnovšie príspevky",
    noPostsYet: "Zatiaľ tu nie sú žiadne príspevky",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Odstrániť túto správu",
    },
  },
  credits: {
    balance: "Kredity",
    credit: "{{count}} kredit",
    credits: "Počet kreditov: {{count}}",
    freeCredit: "{{count}} bezplatný kredit",
    freeCredits: "Bezplatné kredity: {{count}}",
    expiringCredit: "{{count}} kredit s obmedzenou platnosťou",
    expiringCredits: "Kredity s obmedzenou platnosťou: {{count}}",
    permanentCredit: "{{count}} kredit bez obmedzenia platnosti",
    permanentCredits: "Kredity bez obmedzenia platnosti: {{count}}",
    expiresOn: "Platí do {{date}}",
    expiresAt: "Koniec platnosti",
    buyMore: "Kúpiť kredity",
    viewDetails: "Podrobnosti",
    breakdown: "Prehľad kreditov",
    approximateCost:
      "Odhad vychádza z počtu vstupných ({{inputTokens}}) a výstupných tokenov ({{outputTokens}}). Skutočná cena sa môže líšiť.",
    navigation: {
      profile: "Profil",
      subscription: "Predplatné a kredity",
      referral: "Program odporúčaní",
      about: "O platforme",
      help: "Pomoc",
    },
  },
  actions: {
    newChatInFolder: "Nový čet v priečinku",
    newFolder: "Nový priečinok",
    deleteFolder: "Odstrániť priečinok",
    deleteMessage: "Odstrániť správu",
    deleteThisMessage: "Odstrániť túto správu",
    searchEnabled: "Vyhľadávanie je zapnuté",
    searchDisabled: "Vyhľadávanie je vypnuté",
    answerAsAI: "Odpovedať ako model AI",
    retry: "Skúsiť znova s iným modelom alebo zručnosťou",
    branch: "Vytvoriť vetvu rozhovoru odtiaľto",
    editMessage: "Upraviť správu",
    stopAudio: "Zastaviť prehrávanie",
    playAudio: "Prehrať zvuk",
    copyContent: "Kopírovať do schránky",
    rename: "Premenovať",
    pin: "Pripnúť navrch",
    unpin: "Odopnúť",
    archive: "Archivovať",
    unarchive: "Obnoviť z archívu",
    moveToFolder: "Presunúť do priečinka",
    unfiled: "Nezaradené",
    noFoldersAvailable: "Žiadne priečinky nie sú k dispozícii",
    stopGeneration: "Zastaviť generovanie",
    cancellingGeneration: "Zastavuje sa…",
    sendMessage: "Odoslať správu",
    shareThread: "Zdieľať vlákno",
    manageSharing: "Spravovať zdieľanie",
  },
  chatInterface: {
    chatPrefix: "čet",
    chatConversation: "četová konverzácia",
  },
  input: {
    placeholder: "Napíš správu…",
    imagePlaceholder: "Opíš obrázok, ktorý chceš vytvoriť…",
    audioPlaceholder: "Opíš hudbu alebo zvuk, ktorý chceš vytvoriť…",
    noPermission: "Nemáš oprávnenie odosielať správy",
    noPostPermission: "V tomto vlákne nemáš oprávnenie odosielať správy",
    noCreateThreadPermission:
      "V tomto priečinku nemáš oprávnenie vytvárať vlákna",
    noCreateThreadPermissionInRootFolder:
      "V tomto priečinku nemáš oprávnenie vytvárať vlákna. Prihlás sa alebo vyber podpriečinok.",
    keyboardShortcuts: {
      press: "Stlač",
      enter: "Enter",
      toSend: "na odoslanie",
      shiftEnter: "Shift+Enter",
      forNewLine: "na nový riadok",
      ctrlV: "Ctrl+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "na vloženie súborov",
    },
    speechInput: {
      stopRecording: "Zastaviť nahrávanie",
      processing: "Spracúva sa…",
      startVoiceInput:
        "Spustiť hlasový vstup (kredity za minútu navyše: {{cost}})",
      recordingClickToStop: "Nahráva sa… Kliknutím nahrávanie zastavíš",
      transcribing: "Prepisuje sa…",
    },
    attachments: {
      uploadFile: "Priložiť súbory",
      attachedFiles: "Priložené súbory",
      addMore: "Priložiť ďalšie",
      removeFile: "Odobrať súbor",
      fileTooLarge: "Súbor je príliš veľký (najviac 10 MB)",
      invalidFileType: "Neplatný typ súboru",
      uploadError: "Súbor sa nepodarilo nahrať",
    },
  },
  imageGen: {
    sizeSquare: "Štvorec 1024 × 1024",
    sizeLandscape: "Na šírku 1792 × 1024",
    sizePortrait: "Na výšku 1024 × 1792",
    qualityStandard: "Štandardná",
    qualityHD: "HD",
  },
  audioGen: {
    durationShort: "pribl. 8 s",
    durationMedium: "pribl. 20 s",
    durationLong: "pribl. 30 s",
  },
  modelSelector: {
    placeholder: "Vybrať model",
    addNewLabel: "Pridať vlastný model",
    costFree: "Zadarmo",
    costCredits: "{{count}} kredit za správu",
    costCreditsPlural: "Kredity za správu: {{count}}",
    tooltip: "{{provider}}: {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "Čo potrebuješ?",
    tuneIt: "Doladiť výber",
    recommended: "Odporúčané",
    alsoGood: "Ďalšie možnosti",
    helpMeChoose: "Pomôž mi s výberom",
    useThis: "Použiť tento model",
    quality: "Kvalita",
    speedLabel: "Rýchlosť",
    // Task pills
    tasks: {
      code: "Programovať",
      write: "Písať",
      chat: "Četovať",
      think: "Premýšľať",
      create: "Vytvoriť",
      unfiltered: "Bez filtrov",
    },
    // Tuning toggles
    effort: "Náročnosť",
    "effort.simple": "Jednoduchá",
    "effort.regular": "Bežná",
    "effort.complex": "Zložitá",
    speed: "Rýchlosť",
    "speed.fast": "Rýchle",
    "speed.balanced": "Vyvážené",
    "speed.thorough": "Dôkladné",
    content: "Obsah",
    "content.normal": "Bežný",
    "content.sensitive": "Citlivý",
    "content.adult": "Pre dospelých",
    // Wizard mode
    wizard: {
      title: "Pomôž mi s výberom",
      whatWorking: "Na čom pracuješ?",
      contentType: "Bude obsah určený aj pre dospelých?",
      whatMatters: "Na čom ti najviac záleží?",
      hereIsMyPick: "Odporúčam tento model:",
      options: {
        code: "Programujem",
        write: "Píšem text",
        chat: "Chcem sa rozprávať alebo niečo opýtať",
        think: "Riešim zložitú otázku",
        create: "Venujem sa tvorbe",
        unfiltered: "Chcem necenzurovaný obsah alebo obsah pre dospelých",
        safeContent: "Bez citlivého obsahu (bežné modely)",
        adultContent: "Áno, aj obsah pre dospelých (necenzurované modely)",
        speed: "Rýchlosť",
        speedDesc: "Chcem rýchle odpovede",
        cost: "Cena",
        costDesc: "Chcem nízku cenu alebo model zadarmo",
        quality: "Kvalita",
        qualityDesc: "Chcem čo najlepší výsledok",
        balanced: "Vyvážené",
        balancedDesc: "Z každého trochu",
      },
    },
    addDialog: {
      title: "Pridať vlastný model",
      fields: {
        modelName: {
          label: "Názov modelu",
          placeholder: "Napr. GPT-4 Turbo",
        },
        provider: {
          label: "Poskytovateľ",
          placeholder: "Napr. OpenAI",
        },
        apiDocs: {
          label: "Adresa dokumentácie API",
        },
        modelId: {
          label: "ID modelu",
          placeholder: "Napr. gpt-4-turbo",
        },
      },
      cancel: "Zrušiť",
      add: "Pridať model",
    },
  },
  characterSelector: {
    placeholder: "Vybrať zručnosť",
    addNewLabel: "Vytvoriť vlastnú zručnosť",
    defaultIcon: "✨",
    grouping: {
      bySource: "Podľa zdroja",
      byCategory: "Podľa kategórie",
      sourceLabels: {
        builtIn: "Vstavané",
        my: "Moje zručnosti",
        community: "Komunita",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "Všeobecné",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Vytvoriť kategóriu",
      fields: {
        name: {
          label: "Názov kategórie",
          placeholder: "Napr. podnikanie alebo hry",
        },
        icon: {
          label: "Ikona (emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Zrušiť",
      create: "Vytvoriť",
    },
    addDialog: {
      title: "Vytvoriť vlastnú zručnosť",
      createCategory: "+ Nová kategória",
      fields: {
        name: {
          label: "Názov",
          placeholder: "Napr. kontrolór kódu",
        },
        icon: {
          label: "Ikona (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Opis",
          placeholder: "Stručný opis zručnosti",
        },
        systemPrompt: {
          label: "Systémové pokyny",
          placeholder: "Si…",
        },
        category: {
          label: "Kategória",
        },
        suggestedPrompts: {
          label: "Navrhované zadania (voliteľné)",
          description: "Pridaj najviac 4 vzorové zadania pre túto zručnosť",
          placeholder: "Zadanie {{number}}",
        },
      },
      cancel: "Zrušiť",
      create: "Vytvoriť zručnosť",
    },
  },
  searchToggle: {
    search: "Hľadať",
    enabledTitle: "Brave Search je zapnuté (+0,65 kreditu za vyhľadanie)",
    disabledTitle: "Brave Search je vypnuté (+0,65 kreditu za vyhľadanie)",
    creditIndicator: "+0,65",
    unconfiguredTitle: "Webové vyhľadávanie nie je nastavené",
    unconfiguredBrave: "Pre Brave Search pridaj do súboru .env:",
    unconfiguredKagi: "Pre Kagi Search pridaj do súboru .env:",
  },
  toolsButton: {
    title: "Nastaviť nástroje AI",
    tools: "Nástroje",
  },
  combinedSelector: {
    tabs: {
      quick: "Rýchly výber",
      skill: "Zručnosť",
      model: "Model",
    },
    current: "Aktuálne",
    favoriteSkills: "Obľúbené zručnosti",
    favoriteModels: "Obľúbené modely",
    showAll: "Zobraziť všetko",
    selectModel: "Vybrať model",
    forSkill: "pre {{character}}",
    recommended: "Odporúčané",
    favorites: "Obľúbené",
    all: "Všetko",
    noFavorites: "Zatiaľ tu nič nie je. Označ obľúbené položky hviezdičkou.",
    noModels: "Žiadne modely nie sú k dispozícii",
    filteredBySkill:
      "Zobrazené modely: {{compatible}} z {{total}} (podľa vybratej zručnosti)",
    selectSkill: "Vybrať zručnosť",
    allSkills: "Všetko",
  },
  selector: {
    noResults: "Žiadne výsledky",
    tabs: {
      quick: "Rýchly výber",
      characters: "Zručnosti",
      build: "Vytvoriť",
      favorites: "Moje obľúbené",
      browse: "Prehliadať zručnosti",
    },
    tiers: {
      quick: "Rýchly výber",
      smart: "Inteligentný",
      best: "Najlepší",
    },
    price: {
      free: "ZADARMO",
      smart: "3 až 8 kred.",
      best: "10 až 20 kred.",
    },
    content: "Obsah",
    contentLevels: {
      safe: "Bezpečný",
      open: "Otvorený",
      unlim: "Bez obmedzení",
    },
    free: "Zadarmo",
    favorites: "Obľúbené",
    suggested: "Navrhované",
    noFavorites: "Zatiaľ nemáš nič v obľúbených",
    noFavoritesHint: "Ulož si obľúbené zručnosti, aby si ich mal poruke",
    browseAllSkills: "Prezrieť všetky zručnosti…",
    customSetup: "Vlastné nastavenie…",
    selectSkill: "Vybrať zručnosť",
    modelCreditDisplay: {
      tokenBased: {
        header: "Cena za správu",
        costRangeLabel: "Bežný rozsah:",
        costRangeValue: "Kredity od {{min}} do {{max}}",
        examplesLabel: "Príklady:",
        examples: {
          short: "Krátky rozhovor",
          medium: "Stredne dlhý rozhovor",
          long: "Dlhý rozhovor",
        },
        triggersCompacting: "⚡ Spustí zhrnutie histórie",
        tokensCount: "Počet tokenov: {{count}}",
        explanation:
          "Pri každej správe AI spracuje celú históriu rozhovoru. Dlhšie rozhovory stoja viac, lebo model spracúva viac kontextu.",
        compactingLabel: "✨ Automatické zhrnutie:",
        compactingExplanation:
          " Pri dosiahnutí {{threshold}} tokenov model zhrnie staršie správy. Ušetríš kredity a zachováš kontext.",
      },
      fixed: {
        title: "Cena modelu {{model}}",
        freeDescription: "Model je zadarmo. Nespotrebúva kredity.",
        fixedDescription:
          "Cena za správu je pri tomto modeli pevná bez ohľadu na dĺžku.",
        costPerMessage: "Cena za správu:",
        freeExplanation: "Tento model je zadarmo a nemá limit používania.",
        freeHighlight: "Hodí sa na skúšanie a experimentovanie.",
        simpleLabel: "Jednoduchý cenník:",
        simpleExplanation:
          " Krátka aj dlhá správa stojí rovnako. Tokeny nemusíš počítať.",
      },
      creditValue: "1 kredit = {{value}}",
    },
    all: "Všetko",
    buildMode: "Režim tvorby",
    forSkill: "pre {{character}}",
    intelligence: "Inteligencia",
    contentLevel: "Úroveň filtrovania",
    speed: "Rýchlosť",
    any: "Ľubovoľná",
    result: "Výsledok",
    bestMatch: "Najlepší model pre tvoje nastavenia",
    useRecommended: "Použiť odporúčaný model: {{model}}",
    filteredBySettings: "Zobrazené modely: {{filtered}} z {{total}}",
    recommended: "Odporúčané",
    noModels: "Žiadny model nezodpovedá filtrom",
    currentConfig: "Aktuálny model v čete",
    switchModel: "Zmeniť model",
    keepsConversation: "(rozhovor zostane zachovaný)",
    switchSkill: "Zmeniť zručnosť",
    startsNewChat: "(začne nový čet)",
    start: "Začať",
    addFav: "Pridať",
    searchSkills: "Vyhľadať zručnosti…",
    noSkillsFound: "Nenašli sa žiadne zručnosti",
    createCustom: "Vytvoriť vlastnú zručnosť",
    skill: "Zručnosť",
    savePreset: "Uložiť",
    perMessage: "za správu",
    compatibleModels: "Počet kompatibilných modelov: {{count}}",
    categories: {
      companions: "Spoločníci",
      assistants: "Asistenti",
      coding: "Programovanie",
      creative: "Tvorba",
      writing: "Písanie",
      roleplay: "Hranie rolí",
      analysis: "Analýza",
      education: "Vzdelávanie",
      controversial: "Kontroverzné témy",
      custom: "Vlastné",
    },
    // v20 additions
    active: "Aktívne",
    addFavorite: "Pridať do obľúbených",
    settings: "Nastavenia",
    noModel: "Nevybral si model",
    model: "Model",
    autoSelect: "Výber podľa filtrov",
    manualSelect: "Vybrať ručne…",
    best: "NAJLEPŠÍ",
    bestForFilter: "Najlepší pre tento filter",
    setupRequired: "Treba nastaviť",
    providerUnconfigured: "Kľúč API poskytovateľa chýba",
    addEnvKey: "Pridať do .env",
    noMatchingModels: "Žiadny model nezodpovedá filtrom",
    noModelsWarning:
      "Žiadny model nezodpovedá filtrom. Ak chceš pokračovať, uprav ich.",
    allModelsCount: "Počet dostupných modelov: {{count}}",
    filteredModelsCount: "Počet vyhovujúcich modelov: {{count}}",
    showAllModels: "Zobraziť všetky modely ({{count}})",
    showFiltered: "Zobraziť filtrované",
    showLegacyModels_one: "Zobraziť archivovaný model ({{count}})",
    showLegacyModels_other: "Zobraziť archivované modely ({{count}})",
    applyChanges: "Použiť zmeny",
    thisChatOnly: "Iba v tomto čete (dočasne)",
    saveToPreset: "Uložiť do „{{name}}“",
    saveAsNew: "Uložiť do obľúbených ako nové…",
    cancel: "Zrušiť",
    apply: "Použiť",
    contentFilter: "Obsah",
    maxPrice: "Najvyššia cena",
    creditsExact: "Kredity: {{cost}}",
    creditsSingle: "1 kredit",
    searchResults: "Počet výsledkov: {{count}}",
    defaults: "Predvolené nastavenia",
    customize: "Prispôsobiť",
    addWithDefaults: "Pridať s predvolenými nastaveniami",
    seeAll: "Zobraziť všetko",
    back: "Späť",
    use: "Použiť",
    editSettings: "Upraviť nastavenia",
    editModelSettings: "Upraviť nastavenia modelu",
    modelOnly: "Iba model",
    yourSetups: "Tvoje nastavenia",
    setup: "Nastavenie",
    delete: "Odstrániť",
    editSkill: "Upraviť ako vlastnú zručnosť",
    switchSkillBtn: "Zmeniť zručnosť",
    editSkillBtn: "Upraviť zručnosť",
    autoSelectedModel: "Podľa filtrov:",
    manualSelectedModel: "Vybrané:",
    skillSelectedModel: "Model zručnosti:",
    selectModelBelow: "Vyber model nižšie",
    chooseYourPath: "Vyber si, ako začneš",
    twoWaysToChat: "Dva spôsoby, ako začať čet",
    directModels: "Priamy výber modelu",
    directModelsDesc:
      "Nastav filtre alebo vyber model ručne. V ponuke ich je {{count}}. Výber AI máš plne pod kontrolou.",
    skillPresets: "Pripravené zručnosti",
    characterPresetsDesc:
      "Vyber jednu zo zručností nižšie. Každá má vyladené nastavenia, ktoré môžeš kedykoľvek zmeniť.",
    startWithDirectModels: "Začať výberom modelu",
    orBrowsePresets: "Alebo si nižšie prezri pripravené zručnosti",
    loading: "Načítava sa…",
    noModelsMatch: "Nenašiel sa žiadny model",
    adjustFiltersMessage: "Uprav filtre a vyhľadaj dostupné modely",
    auto: "Automaticky",
    manual: "Ručne",
    showLess: "Zobraziť menej",
    showMore: "Zobraziť ďalšie ({{count}})",
    applyOnce: "Použiť raz",
    saveChanges: "Uložiť zmeny",
    useOnce: "Použiť raz",
    saveAsDefault: "Pridať do obľúbených",
    deleteSetup: "Odstrániť nastavenie",
    skillSetup: "Nastavenia zručnosti",
    separator: " • ",
    sortBy: "Zoradiť podľa",
    // UX improvements v21
    mySetups: "Moje nastavenia",
    addNew: "Pridať nové",
    noSetupsTitle: "Zatiaľ nemáš žiadne nastavenia",
    noSetupsDescription: "Začni vytvorením prvého nastavenia zručnosti AI",
    getStarted: "Začať",
    currentModel: "Aktuálny model",
    modelSelection: "Výber modelu",
    autoMode: "Automatický výber",
    manualMode: "Ručný výber",
    skillMode: "Predvolený model zručnosti",
    autoModeDescription: "Vyberie najlepší model podľa tvojich preferencií",
    manualModeDescription: "Vyber si ľubovoľný model",
    characterBasedModeDescription:
      "Použije model, pre ktorý je zručnosť navrhnutá",
    customizeSettings: "Pred pridaním si uprav nastavenia",
    useNow: "Použiť teraz",
    browseAll: "Prezrieť všetky zručnosti",
    add: "Pridať",
    // v22 UX improvements
    quickSwitch: "Rýchle prepnutie",
    switchTo: "Prepnúť na toto nastavenie",
    adjustSettings: "Upraviť nastavenia",
    addAnotherSetup: "Pridať ďalšie nastavenie",
    comingSoon: "Už čoskoro",
    // Skill requirements
    requirements: {
      skillConflict: "Konflikt zručnosti",
      max: "Maximum",
      min: "Minimum",
      tooHigh: "Príliš vysoké",
      tooLow: "Príliš nízke",
      intelligenceTooLow: "Nedostatočná inteligencia (min. {{min}})",
      intelligenceTooHigh: "Príliš vysoká inteligencia (max. {{max}})",
      contentTooLow: "Príliš nízka úroveň filtrovania (min. {{min}})",
      contentTooHigh: "Príliš vysoká úroveň filtrovania (max. {{max}})",
      allMet: "Spĺňa všetky požiadavky",
      violations: "Počet nesplnených požiadaviek: {{count}}",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Zmeniť zručnosť",
      description: "Prepni na inú zručnosť a zachovaj svoje nastavenia",
      searchPlaceholder: "Vyhľadať zručnosti…",
      noResults: "Nenašli sa žiadne zručnosti",
      keepSettings: "Ponechať nastavenia modelu",
      keepSettingsDesc:
        "Pri novej zručnosti použi aktuálne filtre inteligencie, ceny a úrovne obsahu",
      cancel: "Zrušiť",
      confirm: "Zmeniť zručnosť",
    },
  },
  onboarding: {
    back: "Späť",
    // Screen 1: Welcome
    welcome: {
      title: "Sme tvoj tím AI.",
      line1:
        "Na bežné rozhovory máš spoločníka. Na programovanie, výskum alebo písanie si vyber špecialistu.",
      line2: "V tom istom čete prepneš za pár sekúnd.",
      line3: "Nastavenie zvládneš za menej než minútu.",
      continue: "Začať",
    },
    // Screen 2: Guest warning (logged-out users only)
    guest: {
      title: "Prehliadaš ako hosť",
      line1:
        "Tvoje nastavenia, spoločník a história chatu sa ukladajú iba do tohto zariadenia.",
      line2:
        "Prihlás sa a ulož si nastavenia, aby sa synchronizovali medzi zariadeniami.",
      signIn: "Prihlásiť sa alebo vytvoriť účet",
      continueAnyway: "Pokračovať ako hosť",
      note: "Neskôr sa môžeš kedykoľvek prihlásiť z ponuky.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Vyber si spoločníka",
      subtitle: "Hlavný partner na každodenné rozhovory",
      budgetTitle: "Čo má tvoja AI zvládnuť?",
      budgetSubtitle: "Kedykoľvek to zmeníš v nastaveniach",
      next: "Ďalej",
      selectFirst: "Vyber spoločníka a pokračuj",
      budget: {
        smart: {
          label: "Bystrá",
          desc: "Rýchla a úsporná. Zvládne väčšinu úloh.",
        },
        brilliant: {
          label: "Brilantná",
          desc: "Vysoká kvalita pri zložitých otázkach, písaní a analýze",
        },
        max: {
          label: "Max",
          desc: "Najpokročilejšie uvažovanie pre otázky, na ktorých ti najviac záleží.",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "Na čo ju budeš využívať najčastejšie?",
      subtitle:
        "Do výbavy tvojej AI automaticky pridáme vhodných špecialistov.",
      saving: "Nastavuje sa…",
      start: "Začať čet",
      skip: "Preskočiť a nastaviť neskôr",
      coding: {
        label: "Programovanie a technika",
        hint: "Vibe Coder, programátor",
      },
      research: {
        label: "Výskum a analýza",
        hint: "Výskumník, dátový analytik",
      },
      writing: {
        label: "Písanie a úpravy",
        hint: "Spisovateľ, redaktor",
      },
      business: {
        label: "Podnikanie a stratégia",
        hint: "Podnikateľský poradca, produktový manažér",
      },
      learning: {
        label: "Učenie a štúdium",
        hint: "Tútor, sprievodca sokratovskými otázkami",
      },
      chat: {
        label: "Len rozhovor",
        hint: "Stačí ti spoločník",
      },
    },
    // Companion personalities (kept for skills i18n)
    thea: {
      tagline: "Srdečný a rozvážny",
      description: "Ako priateľ, ktorý ťa chápe a podrží.",
    },
    hermes: {
      tagline: "Odvážny a priamy",
      description: "Ako tréner, ktorý z teba dostane to najlepšie.",
    },
    // Legacy keys (for backwards compat)
    startChatting: "Začať čet",
    canChangeLater: "Toto nastavenie môžeš kedykoľvek zmeniť",
  },
  tiers: {
    any: "Ľubovoľná",
    anyDesc: "Bez obmedzenia",
    price: {
      cheap: "Úsporná",
      standard: "Štandardná",
      premium: "Prémiová",
      cheapDesc: "0 až 3 kredity za správu",
      standardDesc: "3 až 9 kreditov za správu",
      premiumDesc: "9 alebo viac kreditov za správu",
    },
    intelligence: {
      quick: "Pohotová",
      smart: "Bystrá",
      brilliant: "Brilantná",
      quickDesc: "Rýchla a úsporná",
      smartDesc: "Vyvážená kvalita",
      brilliantDesc: "Hĺbkové uvažovanie",
    },
    speed: {
      fast: "Rýchla",
      balanced: "Vyvážená",
      thorough: "Dôkladná",
      fastDesc: "Rýchle odpovede",
      balancedDesc: "Dobrá rovnováha",
      thoroughDesc: "Podrobná analýza",
    },
    content: {
      mainstream: "Bežné",
      open: "Otvorené",
      uncensored: "Bez cenzúry",
      mainstreamDesc: "Štandardné bezpečnostné filtre",
      openDesc: "Menej obmedzení",
      uncensoredDesc: "Bez obmedzení",
    },
  },
  categories: {
    companion: "Spoločníci",
    assistant: "Asistenti",
    coding: "Programovanie",
    writing: "Písanie",
    analysis: "Analýza",
    roleplay: "Hranie rolí",
    creative: "Tvorba",
    education: "Vzdelávanie",
    controversial: "Kontroverzné témy",
    custom: "Vlastné",
  },
  selectorBase: {
    favorites: "Obľúbené",
    recommended: "Odporúčané",
    others: "Ostatné",
    searchPlaceholder: "Hľadať: {{item}}…",
    toggleFavorite: "Pridať do obľúbených alebo odobrať",
    noFavorites:
      "Zatiaľ nemáš nič v obľúbených. Otvor „Zobraziť všetko“ a pridaj si položky.",
    noRecommended: "Zatiaľ nie sú dostupné žiadne odporúčania.",
    showAll: "Zobraziť všetko",
    groupByProvider: "Zoskupiť podľa poskytovateľa",
    groupByUtility: "Zoskupiť podľa využitia",
    sortAZ: "Zoradiť od A po Z",
    sortZA: "Zoradiť od Z po A",
  },
  dialogs: {
    searchAndCreate: "Vyhľadávanie a tvorba",
    deleteChat: "Odstrániť čet „{{title}}“?",
    deleteFolderConfirm:
      "Odstrániť priečinok „{{name}}“ a presunúť jeho čety ({{count}}) do priečinka Všeobecné?",
  },
  newFolder: {
    title: "Vytvoriť priečinok",
    folderName: "Názov priečinka",
    placeholder: "Zadaj názov priečinka…",
    folderIcon: "Ikona priečinka",
    cancel: "Zrušiť",
    create: "Vytvoriť",
  },
  renameFolder: {
    title: "Premenovať priečinok",
    folderName: "Názov priečinka",
    placeholder: "Zadaj názov priečinka…",
    folderIcon: "Ikona priečinka",
    cancel: "Zrušiť",
    save: "Uložiť",
  },
  folders: {
    privateDescription:
      "Súkromné rozhovory ukladáme na našich serveroch a synchronizujeme ich medzi zariadeniami.",
    sharedDescription: "Rozhovory môžeš zdieľať prostredníctvom odkazov.",
    publicDescription:
      "Verejné fórum pre ľudí a AI. Odstraňujeme iba obsah, ktorý porušuje zákon alebo naše podmienky.",
    incognitoDescription: "Rozhovory sa ukladajú iba v tvojom prehliadači.",
    cronDescription: "Automatické rozhovory vytvorené úlohami na pozadí.",
    backgroundDescription:
      "AI pracuje na tvojich úlohách na pozadí. Výsledky sa zobrazia tu po dokončení.",
    remoteDescription: "Konverzácie z pripojených vzdialených inštancií.",
    accessModal: {
      title: "Potrebuješ účet",
      privateTitle: "Súkromné konverzácie",
      sharedTitle: "Zdieľané konverzácie",
      publicTitle: "Verejné fórum",
      incognitoTitle: "Režim inkognito",
      privateExplanation:
        "Súkromné konverzácie sú tvoj priestor na rozhovory s AI. Bezpečne ich ukladáme na našich serveroch a automaticky synchronizujeme medzi všetkými tvojimi zariadeniami.",
      sharedExplanation:
        "Zdieľané konverzácie môžeš sprístupniť cez zabezpečené odkazy. Hodia sa na spoluprácu aj výmenu nápadov s tímom alebo priateľmi.",
      publicExplanation:
        "Verejné fórum je otvorené pre ľudí aj AI. Ty rozhoduješ, čo si prečítaš. Odstraňujeme iba obsah, ktorý porušuje zákon alebo naše podmienky. Podeľ sa o nápady, spochybni zaužívané názory alebo sa zapoj do diskusie bez cenzúry.",
      incognitoExplanation:
        "Rozhovory v režime inkognito zostávajú v tvojom prehliadači. Neukladajú sa na naše servery a nespájajú sa s tvojím účtom. Vygenerované médiá z technických dôvodov ukladáme dočasne.",
      requiresAccount:
        "Priečinok {{folderName}} otvoríš po registrácii alebo prihlásení.",
      loginButton: "Prihlásiť sa",
      signupButton: "Vytvoriť účet",
      close: "Zavrieť",
    },
  },
  moveFolder: {
    title: "Presunúť priečinok",
    description: "Vyber cieľový priečinok:",
    rootLevel: "Najvyššia úroveň (bez nadradeného priečinka)",
    cancel: "Zrušiť",
    move: "Presunúť",
  },
  views: {
    linearView: "Lineárne zobrazenie (ako v ChatGPT)",
    threadedView: "Zobrazenie vo vláknach (ako na Reddite či Discorde)",
    flatView: "Ploché zobrazenie (ako na 4chane)",
  },
  screenshot: {
    capturing: "Sníma sa…",
    capture: "Zachytiť snímku obrazovky",
    failed: "Snímku obrazovky sa nepodarilo zachytiť",
    failedWithMessage: "Snímku obrazovky sa nepodarilo zachytiť: {{message}}",
    tryAgain: "Snímku obrazovky sa nepodarilo zachytiť. Skús znova.",
    noMessages: "Oblasť správ sa nenašla. Skontroluj, či čet obsahuje správy.",
    quotaExceeded: "Úložisko je plné. Snímka obrazovky je príliš veľká.",
    canvasError: "Snímku obrazovky sa nepodarilo previesť na obrázok.",
  },
  errors: {
    noResponse: "AI vrátila prázdnu odpoveď. Skús znova.",
    noStream:
      "Odpoveď sa nepodarilo preniesť. Čítačka prenosu nie je dostupná.",
    saveFailed: "Úpravu sa nepodarilo uložiť",
    branchFailed: "Vetvu sa nepodarilo vytvoriť",
    parentMessageNotFound: "Nadradená správa sa nenašla",
    parentMessageNotInPath: "Nadradená správa nie je v aktuálnej vetve",
    messageNotFound: "Správa sa nenašla",
    invalidBranchIndex: "Neplatný index vetvy",
    messageNotInPath: "Správa nie je v aktuálnej vetve",
    retryFailed: "Opakovanie zlyhalo",
    answerFailed: "Odpoveď sa nepodarilo odoslať",
    deleteFailed: "Odstránenie zlyhalo",
    cannotBranchFromFirst: "Od prvej správy sa nedá vytvoriť vetva",
    requestAborted: "Požiadavka bola prerušená",
    requestCancelled: "Požiadavka bola zrušená",
    requestTimeout: "Požiadavka prekročila časový limit. Skús znova.",
    networkError: "Chyba siete. Skontroluj pripojenie a skús znova.",
    apiError: "Chyba API. Skús neskôr.",
    storageError: "Chyba úložiska. Úložisko prehliadača môže byť plné.",
    unexpectedError: "Vyskytla sa neočakávaná chyba. Skús znova.",
    errorInContext: "Chyba v {{context}}: {{message}}",
    invalidRequestData: "Neplatné údaje požiadavky: {{error}}",
    streamAIResponse: "Odpoveď od AI sa nepodarilo získať. Skús znova.",
  },
  speech: {
    error: "Chyba rozpoznávania reči",
    transcript: "Prepis: {{text}}",
  },
  // Common
  timestamp: {
    justNow: "práve teraz",
    minutesAgo: "pred {{count}} min.",
    hoursAgo: "pred {{count}} h",
    daysAgo: "pred {{count}} d",
  },
  publicFeed: {
    // Header
    header: {
      title: "Verejné fórum",
      description:
        "Otvorené pre každého. Rozprávaj sa s modelmi AI aj ľuďmi z celého sveta. Ty rozhoduješ, čo si prečítaš. Odstraňujeme iba obsah, ktorý porušuje zákon alebo naše podmienky.",
    },
    // Sort modes
    sort: {
      hot: "Populárne",
      rising: "Na vzostupe",
      new: "Najnovšie",
      following: "Sledované",
    },
    searchPlaceholder: "Vyhľadať konverzácie…",
    noResults: "Nenašli sa žiadne výsledky",
    noThreads: "Zatiaľ žiadne konverzácie. Začni prvý rozhovor!",
    comments: "komentáre",
    bestAnswer: "Najlepšia odpoveď",
    rising: "Na vzostupe",
  },

  state: {
    threadNotFound: "Konverzácia sa nenašla",
  },
  storage: {
    parsePreferencesFailed:
      "Nastavenia používateľa z úložiska sa nepodarilo spracovať",
    parseStateFailed: "Stav chatu z úložiska sa nepodarilo spracovať",
    syncPreferencesFailed:
      "Nastavenia sa nepodarilo synchronizovať s úložiskom",
    syncStateFailed: "Stav chatu sa nepodarilo synchronizovať s úložiskom",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Rozhranie na prepis reči nie je dostupné",
      "failed-to-start": "Nahrávanie sa nepodarilo spustiť",
      "permission-denied": "Prístup k mikrofónu bol zamietnutý",
      "no-microphone": "Mikrofón sa nenašiel",
      "microphone-in-use": "Mikrofón sa už používa",
      "transcription-failed": "Zvuk sa nepodarilo prepísať",
    },
    tts: {
      "endpoint-not-available":
        "Rozhranie na prevod textu na reč nie je dostupné",
      "failed-to-play": "Zvuk sa nepodarilo prehrať",
      "conversion-failed": "Prevod textu na reč zlyhal",
      "failed-to-generate": "Zvuk sa nepodarilo vytvoriť",
    },
  },
  voiceMode: {
    // Setup required
    unconfiguredTitle: "Hlas nie je nastavený",
    unconfiguredDescription:
      "Ak chceš zapnúť hlas, pridaj EDEN_AI_API_KEY do súboru .env. Kľúč získáš na app.edenai.run.",
    // Input modes
    inputMode: "Hlasový vstup",
    transcribeMode: "Prepísať",
    transcribeModeDescription:
      "Nahraj hlas. Prepis sa zobrazí vo vstupnom poli.",
    talkMode: "Hovoriť",
    talkModeDescription: "Nahraj hlas. Odošle sa hneď.",
    // Call mode
    callMode: "Režim hovoru",
    callModeDescription: "Krátke odpovede a automatické prehrávanie",
    // Auto-play TTS
    autoPlayTTS: "Automaticky prehrávať odpovede",
    autoPlayTTSOn: "Odpovede zaznejú nahlas",
    autoPlayTTSOff: "Iba ručné prehrávanie",
    // Recording states
    tapToRecord: "Ťuknutím nahráš zvuk",
    tapToTalk: "Ťuknutím začneš hovoriť",
    tapToTranscribe: "Ťuknutím spustíš prepis",
    listeningTalk: "Počúvam… Uvoľnením odošleš.",
    listeningTranscribe: "Počúvam… Ťuknutím zastavíš.",
    stopSpeaking: "Prestaň hovoriť",
    // Long press hint
    longPressHint: "Podrž a zobrazíš možnosti",
    // Switch modes
    switchToText: "Prepnúť na text",
    switchToCall: "Prepnúť na hovor",
    // Recording state
    recording: {
      paused: "Pozastavené",
      pause: "Pozastaviť",
      resume: "Pokračovať",
    },
    // Recording overlay actions
    actions: {
      cancel: "Zrušiť",
      toInput: "Vložiť do vstupného poľa",
      sendVoice: "Odoslať hlasovú správu",
    },
    // Call mode overlay
    callOverlay: {
      backToChat: "Späť do chatu",
      listening: "Počúvam…",
      processing: "Spracúvam…",
      thinking: "Premýšľam…",
      speaking: "Hovorím…",
      tapToSpeak: "Ťuknutím začneš hovoriť",
      tapToStop: "Ťuknutím zastavíš",
      endCall: "Ukončiť hovor",
      aiThinking: "AI premýšľa…",
    },
  },
  post: {
    title: "Chat",
    description: "Rozhranie chatu",
  },
  messages: {
    assistant: "Asistent",
    you: "Ty",
    user: "Používateľ",
    anonymous: "Anonym",
    authorWithId: "{{name}} [{{id}}]",
    edited: "upravené",
    error: "Chyba",
    postNumber: "Č. {{number}}",
    actions: {
      handleSaveEdit: {
        error: "Úpravu správy sa nepodarilo uložiť",
      },
      handleBranchEdit: {
        error: "Vetvu správy sa nepodarilo vytvoriť",
      },
      handleConfirmRetry: {
        error: "Správu sa nepodarilo zopakovať",
      },
      handleConfirmAnswer: {
        error: "Nepodarilo sa odpovedať ako model AI",
      },
      handleConfirmDelete: {
        error: "Správu sa nepodarilo odstrániť",
      },
    },
    branch: {
      previous: "Predchádzajúca vetva",
      next: "Ďalšia vetva",
    },
  },
  batchToolConfirmation: {
    title: "Potvrdenie skupiny volaní nástrojov",
  },
  toolCall: {
    search: {
      title: "Vyhľadáva sa na webe",
      query: "Dopyt",
    },
    multiple: "Počet volaní nástrojov: {{count}}",
    arguments: "Argumenty",
    result: "Výsledok",
    error: "Chyba",
    executing: "Spúšťa sa…",
    creditsUsed_one: "{{cost}} kredit",
    creditsUsed_other: "Kredity: {{cost}}",
    status: {
      error: "Chyba",
      executing: "Spúšťa sa…",
      complete: "Dokončené",
    },
    sections: {
      request: "Požiadavka",
      response: "Odpoveď",
    },
    messages: {
      executingTool: "Nástroj pracuje…",
      errorLabel: "Chyba:",
      noArguments: "Bez argumentov",
      noResult: "Bez výsledku",
      metadataNotAvailable:
        "Metadáta widgetu nie sú dostupné. Zobrazuje sa nespracovaný výsledok.",
    },
  },
  reasoning: {
    title: "Uvažovanie",
    multiple: "Počet krokov uvažovania: {{count}}",
    step: "Krok {{number}}",
  },
  modelUtilities: {
    chat: "Každodenný čet",
    smart: "Pokročilé uvažovanie",
    coding: "Programovanie a vývoj",
    creative: "Tvorivé písanie",
    analysis: "Analýza a výskum",
    fast: "Rýchle a úsporné",
    multimodal: "Multimodálne (obrazový vstup)",
    vision: "Porozumenie obrázkom",
    imageGen: "Generovanie obrázkov",
    uncensored: "Bez cenzúry",
    legacy: "Archivované modely",
    // Skill categories
    technical: "Technika",
    education: "Vzdelávanie",
    controversial: "Kontroverzné témy",
    lifestyle: "Životný štýl",
    // Model capabilities/utilities
    reasoning: "Pokročilé uvažovanie",
    roleplay: "Hranie rolí",
    roleplayDark: "Hranie rolí s temnými témami",
    adultImplied: "Obsah pre dospelých bez explicitných detailov",
    adultExplicit: "Explicitný obsah pre dospelých",
    violence: "Násilie",
    harmful: "Potenciálne škodlivý obsah",
    illegalInfo: "Informácie o nezákonnej činnosti",
    medicalAdvice: "Zdravotné odporúčania",
    offensiveLanguage: "Urážlivý jazyk",
    politicalLeft: "Ľavicové politické názory",
    politicalRight: "Pravicové politické názory",
    conspiracy: "Konšpiračné teórie",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Najnovší model Claude s vynikajúcim výkonom",
      claudeSonnet45: "Najnovší model Claude s vynikajúcim výkonom",
      gpt5: "Najnovší model GPT s vynikajúcim výkonom",
      gpt51: "Najnovší model GPT 5.1 so zlepšeným uvažovaním",
      gpt5Pro: "Najnovší model GPT s vynikajúcim výkonom pri programovaní",
      gpt5Codex: "Najnovší model GPT s vynikajúcim výkonom",
      gpt51Codex:
        "Najnovší model GPT 5.1 Codex optimalizovaný na programovanie",
      gpt5Mini: "Najnovší model mini s výborným pomerom ceny a výkonu",
      gpt5Nano: "Najnovší model nano s výborným pomerom ceny a výkonu",
      gptOss120b: "GPT s otvoreným zdrojovým kódom a 120 miliardami parametrov",
      geminiFlash25Pro:
        "Veľmi rýchly a úsporný model so 14 miliardami parametrov a veľkým kontextovým oknom",
      geminiFlash25Flash:
        "Veľmi rýchly a úsporný model so 14 miliardami parametrov a veľkým kontextovým oknom",
      geminiFlash25Lite:
        "Veľmi rýchly a úsporný model so 14 miliardami parametrov a veľkým kontextovým oknom",
      mistralNemo: "Výkonný európsky model AI s dôrazom na súkromie",
      kimiK2Free:
        "Kimi K2 Instruct je rozsiahly jazykový model s architektúrou Mixture-of-Experts (MoE) od Moonshot AI.",
      kimiK2:
        "Kimi K2 je pokročilý model od Moonshot AI s architektúrou Mixture-of-Experts (MoE) a veľkým kontextovým oknom.",
      kimiK2Thinking:
        "Kimi K2 Thinking je variant zameraný na uvažovanie so zlepšenou schopnosťou analýzy.",
      deepseekV31Free:
        "Výkonný model so 671 miliardami parametrov, úplne zadarmo",
      deepseekV31:
        "Výkonný model so 671 miliardami parametrov a pokročilými schopnosťami",
      qwen3235bFree:
        "Model Qwen s architektúrou Mixture-of-Experts (MoE) plynule prepína medzi režimami.",
      deepseekR1Distill: "Výkonný destilovaný model na uvažovanie",
      deepseekR1: "Pokročilý model na hĺbkové uvažovanie",
      qwen257b: "Úsporný model so 7 miliardami parametrov",
      grok4: "Grok 4 od xAI: prémiový model",
      grok4Fast:
        "Grok 4 Fast je najnovší multimodálny model xAI. Ponúka špičkový pomer ceny a výkonu a kontextové okno na 2 milióny tokenov. Má variant s uvažovaním a bez neho.",
      glm5: "GLM-5 je vlajkový otvorený model Z.AI na návrh zložitých systémov a dlhodobú prácu agentov. Výkonom konkuruje najlepším uzavretým modelom.",
      glm46:
        "GLM 4.6 je úsporný model so 7 miliardami parametrov a veľkým kontextovým oknom.",
      glm47:
        "GLM 4.7 je vylepšený model so 7 miliardami parametrov, ktorý lepšie uvažuje a programuje.",
      glm47Flash:
        "GLM 4.7 Flash je mimoriadne rýchly variant na pohotové odpovede.",
      glm45Air:
        "GLM 4.5 AIR je rýchly, odľahčený model s veľkým kontextovým oknom.",
      glm45v:
        "GLM 4.5v je multimodálny model s obrazovým vstupom a veľkým kontextovým oknom.",
      kimiK2_6:
        "Kimi K2.6 zvláda dlhodobé programovanie, návrh UI a UX aj koordináciu viacerých agentov v rojovej architektúre.",
      uncensoredLmV11:
        "Prémiový jazykový model bez cenzúry a filtrovania obsahu",
      freedomgptLiberty:
        "FreedomGPT Liberty je model AI bez cenzúry zameraný na slobodné vyjadrovanie a tvorbu obsahu.",
      gabAiArya:
        "Gab AI Arya je konverzačný model bez cenzúry na slobodné vyjadrovanie a tvorbu.",
      gpt52Pro: "GPT 5.2 Pro je pokročilý model s uvažovaním na zložité úlohy.",
      gpt52:
        "GPT 5.2 je model najnovšej generácie s vyšším výkonom a lepšou efektivitou.",
      gpt52_chat:
        "GPT 5.2 Chat je variant optimalizovaný na rozhovory a interakciu.",
      veniceUncensored:
        "Venice Uncensored je model AI bez cenzúry na voľné rozhovory.",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B je veľký jazykový model bez cenzúry založený na Llama 3.",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B je veľký jazykový model bez cenzúry založený na Mistral.",
      claudeOpus45:
        "Claude Opus 4.5 je najvýkonnejší model Claude s výnimočným uvažovaním a tvorivými schopnosťami.",
      claudeOpus46:
        "Claude Opus 4.6 je výkonný model Claude s výnimočným uvažovaním a tvorivými schopnosťami.",
      claudeOpus47:
        "Claude Opus 4.7 je model predchádzajúcej generácie Opus. Nahrádza ho 4.8.",
      claudeOpus48:
        "Claude Opus 4.8 je najvýkonnejší bežne dostupný Opus od Anthropic. Zvláda dlhodobú prácu agentov, zložité programovanie a viacstupňové uvažovanie pri veľmi dlhých výstupoch. Kontext má milión tokenov. Prijíma text, obrázky a súbory.",
      claudeSonnet46:
        "Claude Sonnet 4.6 je najvýkonnejší model triedy Sonnet od Anthropic. Vyniká v programovaní, práci agentov a profesionálnych úlohách.",
      gemini3Pro:
        "Google Gemini 3 Pro je pokročilý multimodálny model AI s veľkým kontextovým oknom a schopnosťou zložitého uvažovania.",
      gemini35Flash:
        "Gemini 3.5 Flash sa v programovaní a uvažovaní blíži modelom Pro za cenu Flash. Spracuje text, obrázky, video, zvuk aj PDF. Podporuje súbežné slučky agentov. Úroveň uvažovania od minimálnej po vysokú dáva kontrolu nad cenou a výkonom.",
      gemini3Flash:
        "Google Gemini 3 Flash je rýchly a úsporný multimodálny model na pohotové odpovede.",
      deepseekV32:
        "DeepSeek V3.2 je výkonný model na uvažovanie s pokročilými programátorskými schopnosťami.",
      deepseekV4Pro:
        "DeepSeek V4 Pro je výkonný model MoE s 1,6 bilióna parametrov a kontextom na milión tokenov. Hodí sa na analýzu celých repozitárov, zložité uvažovanie a viacstupňovú prácu agentov.",
      deepseekV4Flash:
        "DeepSeek V4 Flash je model MoE s 284 miliardami parametrov za takmer nulovú cenu. Kontext na milión tokenov, rýchla inferencia a výkonné programovanie pri veľkom objeme práce.",
    },
  },
  tones: {
    professional: {
      description: "Bežný profesionálny tón",
      systemPrompt: "Odpovedaj profesionálne, vecne a prístupne.",
    },
    pirate: {
      description: "Ahoj, námorník! Hovor ako pirát",
      systemPrompt:
        "Odpovedaj ako priateľský pirát. Používaj výrazy ako „ahoj“, „námorník“, „arrr“, „aj, aj“ a ďalšie námornícke obraty. Hovor nadšene a dobrodružne, pritom podávaj presné informácie.",
    },
    enthusiastic: {
      description: "Nadšený a energický tón",
      systemPrompt:
        "Odpovedaj s nadšením, elánom a energiou! Používaj výkričníky a pozitívne formulácie. Prejav úprimnú radosť z úspechov a možností. Nech všetko znie inšpiratívne!",
    },
    zen: {
      description: "Pokojný, múdry a filozofický tón",
      systemPrompt:
        "Odpovedaj s múdrosťou a pokojom zenového majstra. Vyjadruj sa premyslene a filozoficky, hovor o rovnováhe a harmónii a vysvetľuj svoje postrehy pokojnými metaforami. Buď rozvážny a hĺbavý.",
    },
    detective: {
      description: "Tajomný a pátravý tón",
      systemPrompt:
        "Odpovedaj ako bystrý a všímavý detektív. Používaj jazyk vyšetrovania. Hovor o prípadoch a dôkazoch a podávaj informácie, akoby si riešil záhadu. Buď analytický a vzbuď zvedavosť.",
    },
    shakespearean: {
      description: "Výrečný a poetický ako Shakespeare",
      systemPrompt:
        "Odpovedaj výrečným a poetickým štýlom Shakespeara. Používaj obrazné vyjadrenia, metafory a občas archaické výrazy ako „hľa“, „veru“ či „rečie“. Nech príbeh znie ako veľkolepé rozprávanie hodné veľkého dramatika.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Táto funkcia vyžaduje prehliadač",
      requiresHttps: "Rozpoznávanie reči vyžaduje HTTPS alebo localhost",
      notAvailable: "Rozpoznávanie reči v tomto prehliadači nie je dostupné",
      firefoxNotSupported: "Firefox nepodporuje rozpoznávanie reči",
      safariVersionTooOld: "Aktualizuj Safari na verziu 14.5 alebo novšiu",
      microphoneNotAvailable: "Prístup k mikrofónu nie je dostupný",
      noSpeech: "Nepodarilo sa zachytiť reč. Skús znova.",
      audioCapture: "Mikrofón nie je dostupný. Skontroluj nastavenia.",
      notAllowed:
        "Prístup k mikrofónu bol zamietnutý. Povoľ ho v nastaveniach prehliadača.",
      network: "Chyba siete. Skontroluj pripojenie.",
      serviceNotAllowed: "Služba rozpoznávania reči nie je povolená.",
      badGrammar: "Chyba rozpoznávania reči. Skús znova.",
      languageNotSupported:
        "Rozpoznávanie reči v tomto jazyku nie je podporované.",
      aborted: "Nahrávanie bolo zrušené.",
      unknown: "Chyba rozpoznávania reči: {{errorCode}}",
      apiNotFound: "Rozhranie na rozpoznávanie reči sa nenašlo",
      initializationFailed: "Rozpoznávanie reči sa nepodarilo spustiť",
      microphoneAccessDenied: "Prístup k mikrofónu bol zamietnutý",
      microphonePermissionDenied:
        "Prístup k mikrofónu bol zamietnutý. Povoľ ho v nastaveniach.",
      noMicrophoneFound: "Mikrofón sa nenašiel. Pripoj mikrofón.",
      microphoneInUse: "Mikrofón už používa iná aplikácia.",
      startFailed: "Nahrávanie sa nepodarilo spustiť. Skús znova.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Skúsiť s inými nastaveniami",
      description: "Vyber model a zručnosť, ktoré vytvoria novú odpoveď",
      confirmLabel: "Skúsiť znova",
    },
    answerModal: {
      title: "Odpovedať ako model AI",
      description: "Vyber model a zručnosť na vytvorenie odpovede",
      confirmLabel: "Vygenerovať",
      inputPlaceholder:
        "Zadaj pokyn pre AI. Ak pole necháš prázdne, AI vytvorí vlastnú odpoveď.",
    },
  },
  debugView: {
    systemPrompt: "Systémové pokyny",
    systemPromptTitle: "Vygenerované systémové pokyny",
    systemPromptHint: "Tieto systémové pokyny platia pre celé vlákno",
    systemMessage: "Systémová správa",
    systemMessageHint: "Táto systémová správa bola vložená do rozhovoru",
    copied: "Skopírované",
    retryModal: {
      title: "Skúsiť s inými nastaveniami",
      description: "Vyber model a zručnosť, ktoré vytvoria novú odpoveď",
      confirmLabel: "Skúsiť znova",
    },
    answerModal: {
      title: "Odpovedať ako model AI",
      description: "Vyber model a zručnosť na vytvorenie odpovede",
      confirmLabel: "Vygenerovať",
      inputPlaceholder:
        "Zadaj pokyn pre AI. Ak pole necháš prázdne, AI vytvorí vlastnú odpoveď.",
    },
  },
  suggestedPrompts: {
    title: "Ako ti môžem pomôcť?",
    privateTitle: "Tvoj súkromný asistent AI",
    privateDescription:
      "Rozhovory sa ukladajú do tvojho účtu a synchronizujú sa medzi všetkými zariadeniami.",
    sharedTitle: "Spolupracuj s AI",
    sharedDescription:
      "Vytváraj konverzácie a zdieľaj ich s tímom cez zabezpečené odkazy.",
    publicTitle: "Zapoj sa do verejného fóra AI",
    publicDescription:
      "Verejné rozhovory vidí každý. Podeľ sa o nápady a zapoj sa do otvorenej diskusie.",
    incognitoTitle: "Anonymný čet s AI",
    incognitoDescription:
      "Rozhovor zostáva v prehliadači. Neukladá sa do účtu ani sa nesynchronizuje.",
    more: "Viac",
    selectSkill: "Vyber zručnosť",
    noPrompts: "Pre túto zručnosť nie sú k dispozícii odporúčané zadania",
    showDetails: "Zobraziť podrobnosti",
    hideDetails: "Skryť podrobnosti",
    systemPromptLabel: "Systémové pokyny",
    preferredModelLabel: "Uprednostňovaný model",
    categoryLabel: "Kategória",
    suggestedPromptsLabel: "Odporúčané zadania",
  },
  emptyState: {
    quickStart: "Rýchly štart",
    private: {
      brainstorm: "Vymyslieť nápady",
      brainstormPrompt: "Pomôž mi vymyslieť nápady na…",
      writeDocument: "Napísať dokument",
      writeDocumentPrompt: "Pomôž mi napísať profesionálny dokument o…",
      helpWithCode: "Pomoc s kódom",
      helpWithCodePrompt: "Potrebujem pomôcť s týmto kódom…",
      research: "Preskúmať tému",
      researchPrompt: "Vyhľadaj a zhrň informácie o…",
    },
    shared: {
      teamBrainstorm: "Tímové nápady",
      teamBrainstormPrompt: "Vymyslime spoločne nápady na…",
      projectPlan: "Plánovanie projektu",
      projectPlanPrompt: "Pomôž nám naplánovať projekt na…",
      discussion: "Začať diskusiu",
      discussionPrompt: "Porozprávajme sa o…",
      shareIdeas: "Zdieľať nápady",
      shareIdeasPrompt: "Chcem sa podeliť o nápady a rozvinúť ich. Ide o…",
    },
    incognito: {
      quickQuestion: "Rýchla otázka",
      quickQuestionPrompt: "Mám rýchlu otázku o…",
      privateThought: "Súkromná myšlienka",
      privateThoughtPrompt: "Chcem si v súkromí premyslieť jeden nápad…",
      experiment: "Experiment",
      experimentPrompt: "Chcem niečo vyskúšať…",
      sensitiveQuestion: "Citlivá otázka",
      sensitiveQuestionPrompt: "Potrebujem poradiť s citlivou témou…",
    },
  },
  messageEditor: {
    placeholder: "Uprav správu…",
    hint: {
      branch: "na vytvorenie vetvy",
      cancel: "na zrušenie",
    },
    titles: {
      branch: "Vytvoriť vetvu rozhovoru",
      cancel: "Zrušiť úpravy",
    },
    buttons: {
      branch: "Vytvoriť vetvu",
      branching: "Vytvára sa vetva…",
      cancel: "Zrušiť",
    },
  },
  folderList: {
    confirmDelete:
      "Odstrániť priečinok „{{folderName}}“ a presunúť jeho čety ({{count}}) do priečinka Všeobecné?",
    enterFolderName: "Zadaj názov priečinka:",
    newChatInFolder: "Nový čet v priečinku",
    moveUp: "Presunúť vyššie",
    moveDown: "Presunúť nižšie",
    renameFolder: "Premenovať priečinok",
    moveToFolder: "Presunúť do priečinka",
    newSubfolder: "Nový podpriečinok",
    deleteFolder: "Odstrániť priečinok",
    managePermissions: "Spravovať oprávnenia",
    manageSharing: "Spravovať zdieľanie",
    shareThread: "Zdieľať konverzáciu",
    today: "Dnes",
    lastWeek: "Posledných 7 dní",
    lastMonth: "Posledných 30 dní",
    older: "Staršie",
    folderNotFound: "Priečinok sa nenašiel",
    emptyFolder: "Zatiaľ tu nie sú žiadne čety ani priečinky",
    createSubfolder: "Vytvoriť podpriečinok",
    rename: "Premenovať",
    changeIcon: "Zmeniť ikonu",
    delete: "Odstrániť",
    newFolder: "Nový priečinok",
    deleteDialog: {
      title: "Odstrániť priečinok",
      description: "Naozaj chceš odstrániť „{{folderName}}“?",
      descriptionWithThreads:
        "Naozaj chceš odstrániť „{{folderName}}“? S priečinkom sa odstránia aj jeho konverzácie ({{count}}).",
    },
  },
  permissions: {
    folder: {
      title: "Oprávnenia priečinka",
      description: "Spravuj oprávnenia pre tento priečinok",
    },
    thread: {
      title: "Oprávnenia konverzácie",
      description: "Spravuj oprávnenia pre túto konverzáciu",
    },
    view: {
      label: "Prezeranie",
      description: "Kto môže tento obsah zobraziť a čítať",
    },
    manage: {
      label: "Spravovanie priečinka",
      description: "Kto môže upravovať priečinok a vytvárať podpriečinky",
    },
    edit: {
      label: "Úpravy",
      description: "Kto môže meniť vlastnosti konverzácie",
    },
    createThread: {
      label: "Vytváranie konverzácií",
      description: "Kto môže v tomto priečinku vytvárať nové konverzácie",
    },
    post: {
      label: "Pridávanie správ",
      description: "Kto môže odosielať správy",
    },
    moderate: {
      label: "Moderovanie",
      description: "Kto môže skrývať a moderovať obsah",
    },
    admin: {
      label: "Správcovské oprávnenia",
      description: "Kto môže odstraňovať obsah a spravovať oprávnenia",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Čítanie",
      description: "Kto môže tento obsah zobraziť a čítať",
    },
    write: {
      label: "Zápis",
      description: "Kto môže vytvárať konverzácie a priečinky",
    },
    writePost: {
      label: "Pridávanie správ",
      description: "Kto môže odosielať správy v konverzáciách",
    },
    roles: {
      public: "Verejné (všetci používatelia)",
      customer: "Iba zákazníci",
      admin: "Iba správcovia",
    },
    visibility: {
      label: "Kto to môže vidieť?",
      description:
        "Vyber roly, ktoré môžu zobraziť tento priečinok alebo konverzáciu",
      public: "Verejné (všetci používatelia)",
      customer: "Iba zákazníci",
      admin: "Iba správcovia",
    },
    addModerator: {
      label: "Pridať moderátora",
      placeholder: "Zadaj ID používateľa…",
    },
    moderatorList: {
      label: "Aktuálni moderátori",
      empty: "Zatiaľ bez moderátorov",
    },
    errors: {
      emptyId: "ID používateľa nesmie byť prázdne",
      invalidUuid: "Neplatný formát ID používateľa",
      duplicate: "Tento používateľ už je moderátor",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Odstrániť konverzáciu",
      description:
        "Naozaj chceš odstrániť „{{title}}“? Všetky správy v tejto konverzácii sa natrvalo odstránia. Tento krok sa nedá vrátiť.",
    },
  },
  shareDialog: {
    title: "Zdieľať konverzáciu",
    description: "Vytváraj a spravuj odkazy na zdieľanie tejto konverzácie",
    createLink: "Vytvoriť odkaz na zdieľanie",
    linkCreated: "Odkaz na zdieľanie je pripravený",
    linkCopied: "Odkaz sa skopíroval do schránky",
    copyLink: "Skopírovať odkaz",
    shareViaEmail: "Zdieľať e-mailom",
    revokeLink: "Zrušiť platnosť",
    revoke: "Zrušiť platnosť",
    linkRevoked: "Platnosť odkazu bola zrušená",
    revoked: "Zneplatnený",
    noLinksYet:
      "Zatiaľ tu nie sú odkazy na zdieľanie. Vytvor odkaz a začni zdieľať.",
    activeLinks: "Aktívne odkazy na zdieľanie",
    existingLinks: "Existujúce odkazy",
    linkSettings: "Nastavenia odkazu",
    newLinkSettings: "Nastavenia nového odkazu",
    linkLabel: "Názov odkazu (voliteľné)",
    linkLabelPlaceholder: "Napríklad Zdieľanie s tímom",
    allowPosting: "Povoliť pridávanie správ",
    allowPostingDescription:
      "Príjemcovia môžu odpovedať a zapojiť sa do konverzácie",
    requireAuth: "Vyžadovať prihlásenie",
    requireAuthDescription: "Odkaz môžu otvoriť iba prihlásení používatelia",
    viewOnly: "Iba na prezeranie",
    accessCount: "{{count}} otvorenie",
    accessCount_other: "Počet otvorení: {{count}}",
    createdAt: "Vytvorené {{date}}",
    lastAccessed: "Posledné otvorenie: {{date}}",
    neverAccessed: "Odkaz zatiaľ nikto neotvoril",
    emailSubject: "Pozri si túto konverzáciu: {{title}}",
    emailBody:
      "Táto konverzácia by ťa mohla zaujímať: {{url}}\n\nKonverzácia: {{title}}",
    emailPlaceholder: "Zadaj e-mailové adresy oddelené čiarkami",
    sendEmail: "E-mail",
    emailSent: "E-mail bol odoslaný",
    create: "Vytvoriť",
    creating: "Vytvára sa…",
    copied: "Skopírované",
    close: "Zavrieť",
    shareThread: "Zdieľať konverzáciu",
  },
  shared: {
    error: {
      title: "Chyba odkazu na zdieľanie",
      userError: "Reláciu sa nepodarilo overiť. Skús znova.",
      invalidToken:
        "Odkaz je neplatný alebo bola zrušená jeho platnosť. Obráť sa na osobu, ktorá ti ho poslala.",
    },
  },
  threadedView: {
    expandReplies: "Rozbaliť odpovede",
    collapseReplies: "Zbaliť odpovede",
    continueThread: "Pokračovať vo vlákne (ďalšie {{replyText}}: {{count}})",
    reply: "odpovede",
    replies: "odpovede",
    retryModal: {
      title: "Skúsiť s inými nastaveniami",
      description: "Vyber model a zručnosť, ktoré vytvoria novú odpoveď",
      confirmLabel: "Skúsiť znova",
    },
    answerModal: {
      title: "Odpovedať ako model AI",
      description: "Vyber model a zručnosť na vytvorenie odpovede",
      confirmLabel: "Vygenerovať",
      inputPlaceholder:
        "Zadaj pokyn pre AI. Ak pole necháš prázdne, AI vytvorí vlastnú odpoveď.",
    },
    actions: {
      vote: "Hlasovať",
      upvote: "Hlasovať za",
      downvote: "Hlasovať proti",
      respondToAI: "Odpovedať na túto správu AI inou zručnosťou AI",
      loadingAudio: "Načítava sa zvuk…",
      stopAudio: "Zastaviť zvuk",
      playAudio: "Prehrať zvuk",
      cancelLoading: "Zrušiť načítavanie",
      stop: "Zastaviť",
      play: "Prehrať",
      cancel: "Zrušiť",
      reply: "Odpovedať",
      replyToMessage: "Odpovedať na túto správu v novej vetve",
      edit: "Upraviť",
      editMessage: "Upraviť túto správu v novej vetve",
      retry: "Skúsiť znova",
      retryWithDifferent: "Skúsiť znova s iným modelom alebo zručnosťou",
      answerAsAI: "Odpovedať ako AI",
      generateAIResponse: "Vygenerovať odpoveď AI",
      share: "Zdieľať",
      copyPermalink: "Skopírovať trvalý odkaz",
      delete: "Odstrániť",
      deleteMessage: "Odstrániť túto správu",
      parent: "Nadradená správa",
    },
    userFallback: "Používateľ",
    assistantFallback: "Asistent",
    youLabel: "Ty",
    anonymous: "Anonym",
    authorWithId: "{{name}} [{{id}}]",
  },
  flatView: {
    postNumber: "Príspevok č. {{number}}",
    postsById: "Počet príspevkov s týmto ID: {{count}}",
    idLabel: "ID: {{id}}",
    anonymous: "Anonym",
    youLabel: "Ty",
    assistantFallback: "Asistent",
    replyingTo: "Odpoveď na:",
    replies: "Odpovede:",
    clickToCopyRef: "Kliknutím skopíruješ odkaz",
    timestamp: {
      sun: "Ne",
      mon: "Po",
      tue: "Ut",
      wed: "St",
      thu: "Št",
      fri: "Pi",
      sat: "So",
      format:
        "{{day}}. {{month}}. {{year}} ({{dayName}}) {{hours}}:{{mins}}:{{secs}}",
    },
    retryModal: {
      title: "Skúsiť s inými nastaveniami",
      description: "Vyber model a zručnosť, ktoré vytvoria novú odpoveď",
      confirmLabel: "Skúsiť znova",
    },
    answerModal: {
      title: "Odpovedať ako model AI",
      description: "Vyber model a zručnosť na vytvorenie odpovede",
      confirmLabel: "Vygenerovať",
      inputPlaceholder:
        "Zadaj pokyn pre AI. Ak pole necháš prázdne, AI vytvorí vlastnú odpoveď.",
    },
    actions: {
      loadingAudio: "Načítava sa zvuk…",
      stopAudio: "Zastaviť zvuk",
      playAudio: "Prehrať zvuk (kredity navyše: {{cost}})",
      cancelLoading: "Zrušiť načítavanie",
      stop: "Zastaviť",
      play: "Prehrať",
      reply: "Odpovedať",
      replyToMessage: "Odpovedať na túto správu v novej vetve",
      edit: "Upraviť",
      editMessage: "Upraviť túto správu v novej vetve",
      retry: "Skúsiť znova",
      retryWithDifferent: "Skúsiť znova s iným modelom alebo zručnosťou",
      answerAsAI: "Odpovedať ako AI",
      generateAIResponse: "Vygenerovať odpoveď AI",
      insertQuote: "Vložiť znak citácie „>“",
      copyReference: "Skopírovať odkaz na príspevok",
      delete: "Odstrániť",
      deleteMessage: "Odstrániť túto správu",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Odomkni súkromné a zdieľané priečinky",
      description:
        "Vytvor si účet alebo sa prihlás. Získaš prístup k súkromným a zdieľaným priečinkom a čety sa budú synchronizovať medzi zariadeniami.",
      continueTour: "Pokračovať v prehliadke",
      signUp: "Zaregistrovať sa alebo prihlásiť",
    },
    welcome: {
      title: "Vitaj na {{appName}}!",
      description:
        "Chatuj bez cenzúry AI. Na výber máš GPT-5.1, Claude Sonnet aj UncensoredLM, trénovaný na knihách a dokumentoch zakázaných v mainstreamovom internete. Rozprávaj sa súkromne, anonymne alebo verejne. Režim si vyberáš ty.",
      subtitle: "Pozri sa, čo tu môžeš robiť:",
    },
    modelSelector: {
      title: "Vyber model AI",
      description:
        "V jednom chate môžeš prepínať medzi GPT-5.1, Claude Sonnet, DeepSeek a modelmi bez cenzúry, ako sú Gab Arya a UncensoredLM. Každý ponúka iný pohľad a schopnosti.",
      tip: "Na bežné úlohy s filtrami vyber bežný model, na voľnejšie rozhovory model bez cenzúry. Kedykoľvek môžeš prepnúť.",
    },
    aiCompanion: {
      title: "Vyber si spoločníka AI",
      description:
        "Otvor ponuku spoločníkov AI. Každý má vlastnú osobnosť a najvhodnejší model vyberieme automaticky. Neskôr si ho môžeš prispôsobiť.",
      tip: "👆 Otvor ponuku a vyber prvého spoločníka",
    },
    modelSelectorFavorites: {
      title: "Označ si obľúbené modely",
      description:
        "Vyskladaj si vlastnú výbavu AI. Hviezdičkou si označ bežné modely na úlohy s filtrami a modely bez cenzúry na voľné rozhovory. Budeš ich mať poruke.",
    },
    modelSelectorShowAll: {
      title: "Rozbaľ zoznam modelov",
      description:
        "Prezri si celý katalóg. Porovnaj bežné modely s modelmi bez cenzúry, nájdi špecialistov na programovanie alebo tvorbu a objav možnosti mimo ponuky ChatGPT.",
    },
    modelSelectorSearch: {
      title: "Vyhľadaj modely",
      description:
        "Hľadaj podľa názvu, poskytovateľa alebo schopností. Zadaj „bez cenzúry“ a pozri si modely bez filtrov obsahu.",
    },
    modelSelectorGroup: {
      title: "Podľa poskytovateľa a kategórie",
      description:
        "Prezeraj modely podľa firmy (OpenAI, Anthropic, Gab) alebo využitia (bez cenzúry, programovanie, tvorba). Pozri si ponuku každého poskytovateľa.",
    },
    characterSelector: {
      title: "Prispôsob si zručnosti AI",
      description:
        "Zručnosti určujú, ako AI odpovedá. Vyber hotový štýl alebo si vytvor vlastnú zručnosť s pokynmi, tónom a obľúbeným modelom.",
      tip: "Každá zručnosť funguje s každým modelom. Pokojne spoj profesionálny tón s modelom bez cenzúry.",
    },
    characterSelectorFavorites: {
      title: "Označ si obľúbené zručnosti",
      description:
        "Najpoužívanejšie štýly budeš mať poruke. Označ hviezdičkou zručnosti, po ktorých siahaš najčastejšie.",
    },
    characterSelectorShowAll: {
      title: "Rozbaľ zoznam zručností",
      description:
        "Prezri si celý katalóg zručností. Na rôzne úlohy a postupy si môžeš vytvoriť ľubovoľný počet vlastných zručností.",
    },
    characterSelectorSearch: {
      title: "Vyhľadaj zručnosti",
      description: "Nájdi vhodný štýl podľa názvu, kategórie alebo opisu.",
    },
    characterSelectorGroup: {
      title: "Podľa zdroja a kategórie",
      description:
        "Triediť môžeš podľa zdroja (vstavané, vlastné, komunitné) alebo kategórie (tvorivé, technické, profesionálne).",
    },
    rootFolders: {
      title: "Štyri režimy súkromia",
      description:
        "Vyber si, ako sa s tvojimi údajmi narába, od anonymného chatu po spoluprácu:",
      private: {
        name: "Súkromné",
        suffix: "Synchronizovaný pracovný priestor",
      },
      incognito: {
        name: "Inkognito",
        suffix: "História len v zariadení",
      },
      shared: {
        name: "Zdieľané",
        suffix: "Tímová spolupráca",
      },
      public: {
        name: "Verejné",
        suffix: "Otvorené fórum",
      },
    },
    incognitoFolder: {
      name: "Inkognito",
      suffix: "Priečinok",
      description:
        "História zostáva iba v tvojom zariadení. Správy odošleme na spracovanie modelom AI a hneď ich odstránime zo serverov. Vygenerované médiá z technických dôvodov ukladáme dočasne. Pýtaj sa bez uloženia histórie na server.",
      note: "Bez účtu • Bez ukladania histórie na serveri • Najviac súkromia",
    },
    publicFolder: {
      name: "Verejné",
      suffix: "Priečinok",
      description:
        "Otvorené fórum, kde sa rozprávaš s ľuďmi aj AI. Ty rozhoduješ, čo si prečítaš. Odstraňujeme iba obsah, ktorý porušuje zákon alebo naše podmienky.",
      note: "Čítanie bez účtu • Sloboda prejavu • Komunitné diskusie",
    },
    privateFolder: {
      name: "Súkromné",
      suffix: "Priečinok",
      description:
        "Tvoj osobný pracovný priestor s AI. Používaj podpriečinky a synchronizuj obsah medzi zariadeniami. Pracuj na dlhodobých projektoch, ukladaj si výskum a pokračuj odkiaľkoľvek.",
      authPrompt: "Potrebuješ účet:",
      login: "Prihlásiť sa",
      signUp: "Vytvoriť účet",
    },
    sharedFolder: {
      name: "Zdieľané",
      suffix: "Priečinok",
      description:
        "Spolupráca podľa tvojich pravidiel. Cez odkaz sprístupníš konkrétnu konverzáciu a nastavíš presné oprávnenia. Hodí sa na tímové projekty, spätnú väzbu od odborníkov aj spoločný výskum.",
      authPrompt: "Potrebuješ účet:",
      login: "Prihlásiť sa",
      signUp: "Vytvoriť účet",
    },
    newChatButton: {
      title: "Začni nový rozhovor",
      description:
        "Kliknutím otvoríš nový čet. Rozhovor sa automaticky uloží do aktuálneho priečinka podľa režimu súkromia.",
      tip: "Každý priečinok má svoju históriu rozhovorov.",
    },
    sidebarLogin: {
      title: "Vytvor si bezplatný účet",
      description:
        "Odomkni súkromné a zdieľané priečinky, synchronizuj chaty medzi zariadeniami a ukladaj si obľúbené modely a zručnosti. Inkognito aj verejný režim fungujú aj bez účtu.",
      tip: "Môžeš zostať v anonymite alebo si všetko synchronizovať.",
    },
    subscriptionButton: {
      title: "Kredity a predplatné",
      description:
        "Funkcie známe z ChatGPT, modely bez cenzúry, verejné fórum a ochrana súkromia. Mesačne dostaneš {{credits}} kreditov za {{price}}. Prístup máš ku všetkým modelom.",
      tip: "Jedno predplatné na bežné modely aj modely bez cenzúry.",
    },
    chatInput: {
      title: "Napíš správu",
      description: "Napíš text do poľa a stlačením Enter odošli správu AI.",
      tip: "Shift+Enter pridá nový riadok bez odoslania.",
    },
    voiceInput: {
      title: "Nahrávanie hlasu",
      description:
        "Kliknutím na mikrofón spustíš nahrávanie. Po skončení si vyber:",
      options: {
        transcribe: "Prepísať na text: reč sa prevedie na upraviteľný text",
        sendAudio: "Odoslať hlasovú správu: AI dostane priamo tvoj hlas",
        pauseResume: "Nahrávanie môžeš kedykoľvek pozastaviť a obnoviť",
      },
    },
    callMode: {
      title: "Režim hovoru",
      description:
        "Rozprávaj sa s AI hlasom. Po zapnutí bude model automaticky čítať odpovede nahlas pomocou prevodu textu na reč.",
      tip: "Hodí sa na telefonovanie bez držania zariadenia. Zapína sa pre každý model zvlášť.",
    },
    complete: {
      title: "Môžeš začať",
      description:
        "Máš prístup k bežným modelom aj modelom bez cenzúry, viacerým režimom súkromia a nastaveniam vlastných údajov. Vyber si filter a začni rozhovor.",
      help: "Potrebuješ pomôcť? Spýtaj sa ktoréhokoľvek modelu.",
    },
    authUnlocked: {
      unlocked: "Priečinok je odomknutý",
      privateDescription:
        "Súkromný priečinok je aktívny. Chaty sa synchronizujú medzi zariadeniami a môžeš ich usporiadať do podpriečinkov.",
      privateNote: "Hodí sa na dlhodobé projekty a osobný výskum.",
      sharedDescription:
        "Zdieľaný priečinok je odomknutý. Vytvor konverzáciu, zdieľaj ju odkazom a nastav presné oprávnenia.",
      sharedNote: "Hodí sa na spoluprácu v tíme a spätnú väzbu od odborníkov.",
    },
    buttons: {
      back: "Späť",
      close: "Zavrieť",
      last: "Dokončiť",
      next: "Ďalej",
      skip: "Preskočiť prehliadku",
    },
  },
};
