import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: {
    sidebar: {
      login: "Zaloguj się",
      logout: "Wyloguj",
    },
  },
  common: {
    newChat: "Nowy czat",
    newPrivateChat: "Prywatny Thread",
    newSharedChat: "Udostępniony Thread",
    newPublicChat: "Publiczny Thread",
    newIncognitoChat: "Chat Incognito",
    newPrivateFolder: "Nowy Prywatny Folder",
    newSharedFolder: "Nowy Udostępniony Folder",
    newPublicFolder: "Nowy Publiczny Folder",
    newIncognitoFolder: "Nowy Folder Incognito",
    createNewPrivateFolder: "Utwórz Nowy Prywatny Folder",
    createNewSharedFolder: "Utwórz Nowy Udostępniony Folder",
    createNewPublicFolder: "Utwórz Nowy Publiczny Folder",
    createNewIncognitoFolder: "Utwórz Nowy Folder Incognito",
    privateChats: "Prywatne czaty",
    sharedChats: "Udostępnione czaty",
    publicChats: "Publiczne czaty",
    incognitoChats: "Czaty incognito",
    cronChats: "Wątki cron",
    search: "Szukaj",
    delete: "Usuń",
    cancel: "Anuluj",
    save: "Zapisz",
    send: "Wyślij",
    sending: "Wysyłanie...",
    edit: "Edytuj",
    settings: "Ustawienia",
    toggleSidebar: "Przełącz pasek boczny",
    lightMode: "Tryb jasny",
    darkMode: "Tryb ciemny",
    searchPlaceholder: "Szukaj...",
    searchThreadsPlaceholder: "Szukaj wątków...",
    searchResults: "Wyniki wyszukiwania ({{count}})",
    noChatsFound: "Nie znaleziono czatów",
    noThreadsFound: "Nie znaleziono wątków",
    enableTTSAutoplay: "Włącz automatyczne odtwarzanie TTS",
    disableTTSAutoplay: "Wyłącz automatyczne odtwarzanie TTS",
    closeSidebar: "Zamknij pasek boczny",
    close: "Zamknij",
    showMore: "Pokaż więcej",
    showLess: "Pokaż mniej",
    viewFullThread: "Zobacz pełny wątek",
    viewAllThreads: "Zobacz wszystkie wątki",
    backToChat: "Powrót do czatu",
    language: "Język",
    loginRequired:
      "Zaloguj się, aby korzystać z trwałych folderów. Użyj trybu incognito dla anonimowych czatów.",

    // Copy Button
    copyButton: {
      copyToClipboard: "Kopiuj do schowka",
      copied: "Skopiowano!",
      copyAsMarkdown: "Skopiuj jako Markdown",
      copyAsText: "Skopiuj jako tekst",
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Zatrzymaj odtwarzanie audio",
      playAudio: "Odtwórz audio (+{{cost}} kredytów)",
      cancelLoading: "Anuluj ładowanie",
      answerAsAI: "Odpowiedz jako model AI",
      deleteMessage: "Usuń wiadomość",
      actualCostUsed: "Rzeczywiste kredyty użyte dla tej wiadomości",
      tokensUsed: "Użyte tokeny łącznie",
      credits: "kredyty",
      tokens: "tokeny",
    },

    // User Message Actions
    userMessageActions: {
      branch: "Rozgałęź konwersację od tego miejsca",
      retry: "Spróbuj ponownie z innym modelem/personą",
      deleteMessage: "Usuń wiadomość",
    },

    // View Mode Toggle
    viewModeToggle: {
      linearView: "Widok liniowy (styl ChatGPT)",
      threadedView: "Widok wątkowy (styl Reddit/Discord)",
      flatView: "Widok płaski (styl 4chan)",
      debugView: "Widok debugowania (z promptami systemowymi)",
    },

    // Search Modal
    searchModal: {
      searchAndCreate: "Szukaj i Utwórz",
      newChat: "Nowy czat",
      searchThreadsPlaceholder: "Szukaj wątków...",
      noThreadsFound: "Nie znaleziono wątków",
    },

    // Selector
    selector: {
      country: "Kraj",
      language: "Język",
    },
  },

  aiTools: {
    modal: {
      title: "Narzędzia AI",
      description:
        "Zazwyczaj nie musisz zarządzać narzędziami. Gdy pomoc jest włączona, AI może wywołać dowolne narzędzie na żądanie. Przypnij narzędzia tutaj tylko jeśli chcesz mieć je zawsze w kontekście.",
      searchPlaceholder: "Szukaj narzędzi...",
      loading: "Ładowanie narzędzi...",
      noToolsFound: "Brak narzędzi pasujących do wyszukiwania",
      noToolsAvailable: "Brak dostępnych narzędzi AI",
      expandAll: "Rozwiń wszystkie",
      collapseAll: "Zwiń wszystkie",
      selectAll: "Zaznacz wszystkie",
      deselectAll: "Odznacz wszystkie",
      enableAll: "Włącz wszystkie",
      resetToDefault: "Przywróć domyślne",
      stats: "{{enabled}} z {{total}} narzędzi przypiętych",
      aliases: "Aliasy",
      requireConfirmation: "Wymagaj potwierdzenia przed użyciem",
      activeLabel: "przypięte",
      enabledLabel: "dozwolone",
      totalLabel: "łącznie",
      activeTooltip:
        "Przypięte narzędzia są zawsze w kontekście — AI widzi je przy każdym zapytaniu",
      enabledTooltip:
        "Dozwolone narzędzia mogą być wywoływane na żądanie, gdy pomoc jest włączona",
      legendActive: "Zawsze w kontekście (przypięte)",
      legendConfirm: "Pyta przed uruchomieniem",
      activeOn: "Przypięte — zawsze w kontekście. Kliknij, aby odpiąć",
      activeOff:
        "Nieprzypięte — AI może nadal wywoływać na żądanie. Kliknij, aby przypiąć",
      confirmOn: "Wymaga potwierdzenia — kliknij, aby wyłączyć",
      confirmOff:
        "Uruchamia się automatycznie — kliknij, aby wymagać potwierdzenia",
    },
  },

  confirmations: {
    deleteMessage: "Czy na pewno chcesz usunąć tę wiadomość?",
  },

  iconSelector: {
    tabs: {
      library: "Biblioteka ikon",
      emoji: "Unicode/Emoji",
    },
    emojiTab: {
      label: "Wprowadź emoji lub znak Unicode",
      placeholder: "🤖 lub dowolny tekst",
      apply: "Zastosuj",
      currentIcon: "Aktualna ikona:",
      commonEmojis: "Popularne emoji:",
    },
  },

  createSkill: {
    title: "Utwórz własną postać",
    description:
      "Zaprojektuj własną postać AI z niestandardową osobowością, wiedzą i zachowaniem.",
    icon: "Ikona",
    name: "Nazwa",
    namePlaceholder: "np. Recenzent kodu",
    descriptionLabel: "Opis",
    descriptionPlaceholder: "Krótki opis tego, co robi ta postać",
    category: "Kategoria",
    selectCategory: "Wybierz kategorię",
    systemPrompt: "Prompt systemowy",
    systemPromptPlaceholder:
      "Określ, jak ta postać powinna się zachowywać. Bądź szczegółowy co do jej osobowości, ekspertyzy i sposobu odpowiadania.",
    voice: "Głos",
    voicePlaceholder: "Wybierz głos dla zamiany tekstu na mowę",
    create: "Utwórz postać",
    creating: "Tworzenie...",
    charCount: "{{current}} / {{max}}",
    errors: {
      nameRequired: "Wprowadź nazwę",
      descriptionRequired: "Wprowadź opis",
      systemPromptRequired: "Wprowadź prompt systemowy",
      createFailed: "Nie udało się utworzyć postaci. Spróbuj ponownie.",
    },
  },

  voice: {
    male: "Męski",
    female: "Żeński",
  },

  editSkill: {
    title: "Edytuj jako własną postać",
    description:
      "Utwórz własną postać na podstawie tej persony. Możesz zmodyfikować dowolne ustawienia.",
    loginRequired:
      "Zaloguj się, aby tworzyć i edytować własne postacie. Własne postacie są zapisywane na Twoim koncie.",
    name: "Nazwa",
    namePlaceholder: "Nazwa własnej postaci",
    descriptionLabel: "Opis",
    descriptionPlaceholder: "Co robi ta postać?",
    category: "Kategoria",
    icon: "Ikona",
    voice: "Głos",
    voicePlaceholder: "Wybierz głos",
    preferredModel: "Preferowany model",
    preferredModelPlaceholder: "Opcjonalny preferowany model",
    systemPrompt: "Prompt systemowy",
    systemPromptPlaceholder: "Określ zachowanie postaci...",
    save: "Zapisz jako własną",
    saveAsCopy: "Zapisz jako kopię",
    saving: "Tworzenie...",
    cancel: "Anuluj",
    login: "Zaloguj się, aby edytować",
    signup: "Zarejestruj się, aby edytować",
  },

  userProfile: {
    postCount: "{{count}} post",
    postCount_other: "{{count}} posty",
    recentPosts: "Ostatnie posty",
    noPostsYet: "Brak postów",

    // Flat Message View
    flatMessageView: {
      deleteThisMessage: "Usuń tę wiadomość",
    },
  },
  credits: {
    balance: "Kredyty",
    credit: "{{count}} kredyt",
    credits: "{{count}} kredytów",
    freeCredit: "{{count}} darmowy kredyt",
    freeCredits: "{{count}} darmowych kredytów",
    expiringCredit: "{{count}} wygasający kredyt",
    expiringCredits: "{{count}} wygasających kredytów",
    permanentCredit: "{{count}} stały kredyt",
    permanentCredits: "{{count}} stałych kredytów",
    expiresOn: "Wygasa {{date}}",
    expiresAt: "Wygasa",
    buyMore: "Kup kredyty",
    approximateCost:
      "Przybliżony koszt na podstawie {{inputTokens}} tokenów wejściowych i {{outputTokens}} tokenów wyjściowych. Rzeczywisty koszt może się różnić.",
    viewDetails: "Szczegóły",
    breakdown: "Podział kredytów",
    navigation: {
      profile: "Profil",
      subscription: "Subskrypcja i Kredyty",
      referral: "Program poleceń",
      about: "O nas",
      help: "Pomoc",
    },
  },
  actions: {
    newChatInFolder: "Nowy czat w folderze",
    newFolder: "Nowy folder",
    deleteFolder: "Usuń folder",
    deleteMessage: "Usuń wiadomość",
    deleteThisMessage: "Usuń tę wiadomość",
    searchEnabled: "Wyszukiwanie włączone",
    searchDisabled: "Wyszukiwanie wyłączone",
    answerAsAI: "Odpowiedz jako model AI",
    retry: "Ponów z innym modelem/personą",
    branch: "Rozgałęź konwersację stąd",
    editMessage: "Edytuj wiadomość",
    stopAudio: "Zatrzymaj odtwarzanie audio",
    playAudio: "Odtwórz audio",
    pin: "Przypnij na górze",
    unpin: "Odepnij",
    archive: "Archiwizuj",
    unarchive: "Przywróć z archiwum",
    copyContent: "Kopiuj do schowka",
    rename: "Zmień nazwę",
    moveToFolder: "Przenieś do folderu",
    unfiled: "Nieskatalogowane",
    noFoldersAvailable: "Brak dostępnych folderów",
    stopGeneration: "Zatrzymaj generowanie",
    sendMessage: "Wyślij wiadomość",
    shareThread: "Udostępnij wątek",
    manageSharing: "Zarządzaj udostępnianiem",
  },
  chatInterface: {
    chatPrefix: "czat",
    chatConversation: "rozmowa-czat",
  },
  input: {
    placeholder: "Wpisz swoją wiadomość...",
    noPermission: "Nie masz uprawnień do publikowania wiadomości",
    noPostPermission:
      "Nie masz uprawnień do publikowania wiadomości w tym wątku",
    noCreateThreadPermission:
      "Nie masz uprawnień do tworzenia wątków w tym folderze",
    noCreateThreadPermissionInRootFolder:
      "Nie masz uprawnień do tworzenia wątków w tym folderze. Zaloguj się lub wybierz podfolder.",
    keyboardShortcuts: {
      press: "Naciśnij",
      enter: "Enter",
      toSend: "aby wysłać",
      shiftEnter: "Shift+Enter",
      forNewLine: "dla nowej linii",
      ctrlV: "Ctrl+V",
      pasteFilesSeparator: "·",
      orPasteFiles: "aby wkleić pliki",
    },
    speechInput: {
      stopRecording: "Zatrzymaj nagrywanie",
      processing: "Przetwarzanie...",
      startVoiceInput: "Uruchom wprowadzanie głosowe (+{{cost}} kredytów/min)",
      recordingClickToStop: "Nagrywanie... Kliknij, aby zatrzymać",
      transcribing: "Transkrybuję...",
    },
    attachments: {
      uploadFile: "Załącz pliki",
      attachedFiles: "Załączone pliki",
      addMore: "Dodaj więcej",
      removeFile: "Usuń plik",
      fileTooLarge: "Plik jest za duży (max 10MB)",
      invalidFileType: "Nieprawidłowy typ pliku",
      uploadError: "Nie udało się przesłać pliku",
    },
  },
  modelSelector: {
    placeholder: "Wybierz model",
    addNewLabel: "Dodaj niestandardowy model",
    costFree: "Darmowy",
    costCredits: "{{count}} kredyt/wiadomość",
    costCreditsPlural: "{{count}} kredytów/wiadomość",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
    // New hybrid mode translations
    whatDoYouNeed: "Czego potrzebujesz?",
    tuneIt: "Dostosuj",
    recommended: "Polecany",
    alsoGood: "Również dobre",
    helpMeChoose: "Pomóż mi wybrać",
    useThis: "Użyj tego",
    quality: "Jakość",
    speedLabel: "Szybkość",
    // Task pills
    tasks: {
      code: "Kod",
      write: "Pisanie",
      chat: "Czat",
      think: "Myślenie",
      create: "Tworzenie",
      unfiltered: "Bez filtra",
    },
    // Tuning toggles
    effort: "Wysiłek",
    "effort.simple": "Prosty",
    "effort.regular": "Normalny",
    "effort.complex": "Złożony",
    speed: "Tempo",
    "speed.fast": "Szybko",
    "speed.balanced": "Zrównoważony",
    "speed.thorough": "Dokładny",
    content: "Treść",
    "content.normal": "Normalny",
    "content.sensitive": "Wrażliwy",
    "content.adult": "Dorosły",
    // Wizard mode
    wizard: {
      title: "Pomóż mi wybrać",
      whatWorking: "Nad czym pracujesz?",
      contentType: "Czy zawiera treści dla dorosłych?",
      whatMatters: "Co jest dla ciebie najważniejsze?",
      hereIsMyPick: "Moja rekomendacja:",
      options: {
        code: "Pisanie kodu",
        write: "Pisanie tekstu lub treści",
        chat: "Tylko rozmowa / zadawanie pytań",
        think: "Coś wymagającego głębokiego myślenia",
        create: "Praca twórcza",
        unfiltered: "Treści bez cenzury / dla dorosłych",
        safeContent: "Bezpieczne (standardowe modele)",
        adultContent: "Tak, treści dla dorosłych (modele bez cenzury)",
        speed: "Szybkość",
        speedDesc: "Chcę szybkich odpowiedzi",
        cost: "Koszt",
        costDesc: "Tanio lub za darmo",
        quality: "Jakość",
        qualityDesc: "Daj mi najlepszy wynik",
        balanced: "Zrównoważony",
        balancedDesc: "Trochę wszystkiego",
      },
    },
    addDialog: {
      title: "Dodaj niestandardowy model",
      fields: {
        modelName: {
          label: "Nazwa modelu",
          placeholder: "np. GPT-4 Turbo",
        },
        provider: {
          label: "Dostawca",
          placeholder: "np. OpenAI",
        },
        apiDocs: {
          label: "URL dokumentacji API",
        },
        modelId: {
          label: "ID modelu",
          placeholder: "np. gpt-4-turbo",
        },
      },
      cancel: "Anuluj",
      add: "Dodaj model",
    },
  },
  characterSelector: {
    placeholder: "Wybierz personę",
    addNewLabel: "Utwórz niestandardową personę",
    defaultIcon: "✨",
    grouping: {
      bySource: "Według Źródła",
      byCategory: "Według Kategorii",
      sourceLabels: {
        builtIn: "Wbudowane",
        my: "Moje Persony",
        community: "Społeczność",
      },
      sourceIcons: {
        builtIn: "🏢",
        my: "👤",
        community: "🌐",
      },
      defaultCategory: "Ogólne",
      defaultCategoryIcon: "🤖",
    },
    addCategoryDialog: {
      title: "Utwórz Kategorię",
      fields: {
        name: {
          label: "Nazwa Kategorii",
          placeholder: "np. Biznes, Gry, itp.",
        },
        icon: {
          label: "Ikona (Emoji)",
          placeholder: "📁",
        },
      },
      cancel: "Anuluj",
      create: "Utwórz",
    },
    addDialog: {
      title: "Utwórz niestandardową personę",
      createCategory: "+ Nowa Kategoria",
      fields: {
        name: {
          label: "Nazwa",
          placeholder: "np. Recenzent kodu",
        },
        icon: {
          label: "Ikona (emoji)",
          placeholder: "✨",
        },
        description: {
          label: "Opis",
          placeholder: "Krótki opis persony",
        },
        systemPrompt: {
          label: "Prompt systemowy",
          placeholder: "Jesteś...",
        },
        category: {
          label: "Kategoria",
        },
        suggestedPrompts: {
          label: "Sugerowane Prompty (Opcjonalne)",
          description: "Dodaj do 4 sugerowanych promptów",
          placeholder: "Prompt {{number}}",
        },
      },
      cancel: "Anuluj",
      create: "Utwórz personę",
    },
  },
  searchToggle: {
    search: "Szukaj",
    enabledTitle: "Brave Search włączone (+0,65 kredytu za wyszukiwanie)",
    disabledTitle: "Brave Search wyłączone (+0,65 kredytu za wyszukiwanie)",
    creditIndicator: "+0,65",
    unconfiguredTitle: "Wyszukiwanie sieciowe nie skonfigurowane",
    unconfiguredBrave: "Dla Brave Search, dodaj do pliku .env:",
    unconfiguredKagi: "Dla Kagi Search, dodaj do pliku .env:",
  },
  toolsButton: {
    title: "Konfiguruj narzędzia AI",
    tools: "Narzędzia",
  },
  combinedSelector: {
    tabs: {
      quick: "Szybki",
      skill: "Skill",
      model: "Model",
    },
    current: "Aktualny",
    favoriteSkills: "Ulubione persony",
    favoriteModels: "Ulubione modele",
    showAll: "Pokaż wszystkie",
    selectModel: "Wybierz model",
    forSkill: "dla {{character}}",
    recommended: "Polecane",
    favorites: "Ulubione",
    all: "Wszystkie",
    noFavorites: "Brak ulubionych. Oznacz je gwiazdką.",
    noModels: "Brak dostępnych modeli",
    filteredBySkill:
      "Pokazuję {{compatible}} z {{total}} modeli (filtrowane przez postać)",
    selectSkill: "Wybierz postać",
    allSkills: "Wszystkie",
  },
  selector: {
    noResults: "Nie znaleziono wyników",
    tabs: {
      quick: "Szybki",
      characters: "Persony",
      build: "Utwórz",
      favorites: "Moje ulubione",
      browse: "Przeglądaj skill",
    },
    tiers: {
      quick: "Szybki",
      smart: "Mądry",
      best: "Najlepszy",
    },
    price: {
      free: "GRATIS",
      smart: "3-8cr",
      best: "10-20cr",
    },
    content: "Treść",
    contentLevels: {
      safe: "Bezpieczny",
      open: "Otwarty",
      unlim: "Bez limitu",
    },
    free: "Darmowe",
    favorites: "Ulubione",
    suggested: "Sugerowane",
    noFavorites: "Brak ulubionych",
    noFavoritesHint: "Zapisz ulubione postacie dla szybkiego dostępu",
    browseAllSkills: "Przeglądaj wszystkie postacie...",
    customSetup: "Niestandardowa konfiguracja...",
    selectSkill: "Wybierz postać",
    modelCreditDisplay: {
      tokenBased: {
        header: "Koszt za wiadomość",
        costRangeLabel: "Typowy zakres:",
        costRangeValue: "{{min}} - {{max}} kredytów",
        examplesLabel: "Przykłady:",
        examples: {
          short: "Krótka rozmowa",
          medium: "Średnia rozmowa",
          long: "Długa rozmowa",
        },
        triggersCompacting: "⚡ Aktywuje kompresję",
        tokensCount: "{{count}} tokenów",
        explanation:
          "AI przetwarza całą historię rozmowy przy każdej wiadomości. Dłuższe rozmowy kosztują więcej, ponieważ jest więcej kontekstu do przetworzenia.",
        compactingLabel: "✨ Auto-kompresja:",
        compactingExplanation:
          " Przy {{threshold}} tokenów starsze wiadomości są automatycznie streszczane, aby zmniejszyć koszty przy zachowaniu kontekstu.",
      },
      fixed: {
        title: "Cennik dla {{model}}",
        freeDescription: "Ten model jest całkowicie darmowy, bez kosztów.",
        fixedDescription:
          "Ten model ma stały koszt na wiadomość, niezależnie od długości.",
        costPerMessage: "Koszt za wiadomość:",
        freeExplanation: "To darmowy model bez ograniczeń użytkowania.",
        freeHighlight: "Idealny do testowania i eksperymentowania.",
        simpleLabel: "Prosty cennik:",
        simpleExplanation:
          " Każda wiadomość kosztuje tyle samo, niezależnie czy krótka czy długa. Nie trzeba liczyć tokenów.",
      },
      creditValue: "1 kredyt = {{value}}",
    },
    all: "Wszystkie",
    buildMode: "Tryb budowania",
    forSkill: "dla {{character}}",
    intelligence: "Inteligencja",
    contentLevel: "Poziom treści",
    speed: "Szybkość",
    any: "Dowolny",
    result: "Wynik",
    bestMatch: "Najlepsza opcja dla twoich ustawień",
    useRecommended: "Użyj zalecanego: {{model}}",
    filteredBySettings: "Pokazuję {{filtered}} z {{total}} modeli",
    recommended: "Polecane",
    noModels: "Brak modeli spełniających filtry",
    currentConfig: "Aktualnie rozmawiasz z",
    switchModel: "Zmień model",
    keepsConversation: "(zachowuje rozmowę)",
    switchSkill: "Zmień postać",
    startsNewChat: "(rozpoczyna nowy czat)",
    start: "Start",
    addFav: "Dodaj",
    searchSkills: "Szukaj postaci...",
    noSkillsFound: "Nie znaleziono postaci",
    createCustom: "Utwórz",
    skill: "Postać",
    savePreset: "Zapisz",
    perMessage: "za wiadomość",
    compatibleModels: "{{count}} kompatybilnych modeli",
    categories: {
      companions: "Towarzysze",
      assistants: "Asystenci",
      coding: "Programowanie",
      creative: "Kreatywne",
      writing: "Pisanie",
      roleplay: "Odgrywanie ról",
      analysis: "Analiza",
      education: "Edukacja",
      controversial: "Kontrowersyjne",
      custom: "Niestandardowe",
    },
    // v20 additions
    active: "Aktywny",
    addFavorite: "Dodaj do ulubionych",
    settings: "Ustawienia",
    noModel: "Nie wybrano modelu",
    model: "Model",
    autoSelect: "Automatycznie wybierz najlepszy model",
    manualSelect: "Wybierz ręcznie...",
    best: "NAJLEPSZY",
    bestForFilter: "Najlepszy dla tego filtra",
    setupRequired: "Wymagana konfiguracja",
    providerUnconfigured: "Klucz API dostawcy nie skonfigurowany",
    addEnvKey: "Dodaj do .env",
    noMatchingModels: "Żadne modele nie pasują do filtrów",
    noModelsWarning:
      "Żadne modele nie pasują do tych filtrów. Dostosuj ustawienia.",
    allModelsCount: "{{count}} dostępnych modeli",
    filteredModelsCount: "{{count}} pasujących modeli",
    showAllModels: "Pokaż wszystkie {{count}} modeli",
    showFiltered: "Pokaż przefiltrowane",
    showLegacyModels_one: "Pokaż {{count}} Model Legacy",
    showLegacyModels_other: "Pokaż {{count}} Modeli Legacy",
    applyChanges: "Zastosuj zmiany",
    thisChatOnly: "Tylko ten czat (tymczasowo)",
    saveToPreset: 'Zapisz do "{{name}}"',
    saveAsNew: "Zapisz jako nowy ulubiony...",
    cancel: "Anuluj",
    apply: "Zastosuj",
    contentFilter: "Zawartość",
    maxPrice: "Maks. cena",
    creditsExact: "{{cost}} kredytów",
    creditsSingle: "1 kredyt",
    searchResults: "{{count}} wyników",
    defaults: "Domyślne",
    customize: "Dostosuj",
    addWithDefaults: "Dodaj z domyślnymi",
    seeAll: "Zobacz wszystkie",
    back: "Wstecz",
    use: "Użyj",
    editSettings: "Edytuj ustawienia",
    editModelSettings: "Edytuj ustawienia modelu",
    modelOnly: "Tylko model",
    yourSetups: "Twoje zestawy",
    setup: "Zestaw",
    delete: "Usuń",
    editSkill: "Edytuj jako własną postać",
    autoSelectedModel: "Auto-wybrany:",
    manualSelectedModel: "Wybrany:",
    skillSelectedModel: "Model postaci:",
    selectModelBelow: "Wybierz model poniżej",
    chooseYourPath: "Wybierz swoją ścieżkę",
    twoWaysToChat: "Dwa elastyczne sposoby na rozpoczęcie rozmowy",
    directModels: "Bezpośredni dostęp do modeli",
    directModelsDesc:
      "Skonfiguruj filtry lub wybierz ręcznie spośród {{count}} modeli. Pełna kontrola nad wyborem AI.",
    skillPresets: "Presety postaci",
    characterPresetsDesc:
      "Wybierz postać poniżej. Każda ma zoptymalizowane ustawienia, które możesz dostosować w dowolnym momencie.",
    startWithDirectModels: "Rozpocznij z bezpośrednimi modelami",
    orBrowsePresets: "Lub przeglądaj presety postaci poniżej",
    loading: "Ładowanie...",
    noModelsMatch: "Brak pasujących modeli",
    adjustFiltersMessage:
      "Dostosuj kryteria filtrowania, aby znaleźć dostępne modele",
    auto: "Auto",
    manual: "Ręczny",
    showLess: "Pokaż mniej",
    showMore: "Pokaż {{count}} więcej",
    applyOnce: "Zastosuj raz",
    saveChanges: "Zapisz zmiany",
    useOnce: "Użyj raz",
    saveAsDefault: "Dodaj do ulubionych",
    deleteSetup: "Usuń konfigurację",
    skillSetup: "Konfiguracja persony",
    separator: " • ",
    sortBy: "Sortuj według",
    // UX improvements v21
    mySetups: "Moje konfiguracje",
    addNew: "Dodaj nowy",
    noSetupsTitle: "Brak konfiguracji",
    noSetupsDescription: "Stwórz swoją pierwszą konfigurację postaci AI",
    getStarted: "Rozpocznij",
    currentModel: "Aktualny model",
    modelSelection: "Wybór modelu",
    autoMode: "Automatyczny wybór",
    manualMode: "Wybór ręczny",
    skillMode: "Domyślny postaci",
    autoModeDescription:
      "Automatycznie wybiera najlepszy model według Twoich preferencji",
    manualModeDescription: "Wybierz dowolny model samodzielnie",
    characterBasedModeDescription:
      "Używa modelu, do którego ta postać została zaprojektowana",
    customizeSettings: "Dostosuj ustawienia przed dodaniem",
    useNow: "Użyj teraz",
    browseAll: "Przeglądaj wszystkie postacie",
    add: "Dodaj",
    // v22 UX improvements
    quickSwitch: "Szybka zmiana",
    switchTo: "Przełącz na tę konfigurację",
    adjustSettings: "Dostosuj ustawienia",
    addAnotherSetup: "Dodaj kolejną konfigurację",
    comingSoon: "Wkrótce dostępne",
    switchSkillBtn: "Zmień personę",
    editSkillBtn: "Edytuj personę",
    // Skill requirements
    requirements: {
      skillConflict: "Konflikt postaci",
      max: "Maksimum",
      min: "Minimum",
      tooHigh: "Zbyt wysoki",
      tooLow: "Zbyt niski",
      intelligenceTooLow: "Inteligencja zbyt niska (min: {{min}})",
      intelligenceTooHigh: "Inteligencja zbyt wysoka (max: {{max}})",
      contentTooLow: "Poziom treści zbyt niski (min: {{min}})",
      contentTooHigh: "Poziom treści zbyt wysoki (max: {{max}})",
      allMet: "Spełnia wszystkie wymagania",
      violations: "{{count}} naruszenia wymagań",
    },
    // Skill switch modal
    characterSwitchModal: {
      title: "Zmień personę",
      description: "Przełącz się na inną personę bez utraty ustawień",
      searchPlaceholder: "Wyszukaj persony...",
      noResults: "Nie znaleziono person",
      keepSettings: "Zachowaj obecne ustawienia modelu",
      keepSettingsDesc:
        "Użyj obecnych filtrów inteligencji, ceny i treści z nową personą",
      cancel: "Anuluj",
      confirm: "Zmień personę",
    },
  },
  onboarding: {
    back: "Wstecz",
    // Screen 1: Welcome
    welcome: {
      title: "Pomyśl o nas jak o swoim zespole AI.",
      line1:
        "Twój towarzysz obsługuje codzienne rozmowy. Specjaliści wkraczają przy kodowaniu, badaniach, pisaniu — cokolwiek jest potrzebne.",
      line2:
        "AI przełącza się między nimi automatycznie. Ty po prostu rozmawiasz.",
      line3: "Skonfigurujmy cię w mniej niż minutę.",
      continue: "Zaczynamy",
    },
    // Screen 2: Guest warning (only for logged-out users)
    guest: {
      title: "Przeglądasz jako gość",
      line1:
        "Twoje ustawienia, towarzysz i historia czatu są zapisywane lokalnie tylko na tym urządzeniu.",
      line2:
        "Zaloguj się, aby synchronizować wszystko między urządzeniami — i mieć pewność, że nigdy nie stracisz swojej konfiguracji.",
      signIn: "Zaloguj się / Utwórz konto",
      continueAnyway: "Kontynuuj jako gość",
      note: "Możesz zalogować się później z menu w dowolnym momencie.",
    },
    // Screen 3: Companion + Budget
    companion: {
      title: "Wybierz swojego towarzysza",
      subtitle: "Twój główny partner do codziennych rozmów",
      budgetTitle: "Jak zaawansowana ma być twoja AI?",
      budgetSubtitle: "Możesz to zmienić w dowolnym momencie w ustawieniach",
      next: "Dalej",
      selectFirst: "Wybierz towarzysza, aby kontynuować",
      budget: {
        smart: {
          label: "Smart",
          desc: "Szybka, wydajna, dobrze radzi sobie z większością zadań",
        },
        brilliant: {
          label: "Brilliant",
          desc: "Najlepsza jakość — świetna do złożonych pytań, pisania i analizy",
        },
        max: {
          label: "Max",
          desc: "Najwyższe możliwości rozumowania, bez kompromisów — gdy naprawdę ma znaczenie",
        },
      },
    },
    // Screen 4: Use-cases
    usecases: {
      title: "Do czego głównie będziesz tego używać?",
      subtitle:
        "Automatycznie dodamy odpowiednich specjalistów do zestawu narzędzi twojej AI.",
      saving: "Konfigurowanie...",
      start: "Rozpocznij czat",
      skip: "Pomiń — skonfigruję to później",
      coding: {
        label: "Kodowanie & Technika",
        hint: "Vibe Coder, Coder",
      },
      research: {
        label: "Badania & Analiza",
        hint: "Researcher, Data Analyst",
      },
      writing: {
        label: "Pisanie & Edycja",
        hint: "Writer, Editor",
      },
      business: {
        label: "Biznes & Strategia",
        hint: "Business Advisor, Product Manager",
      },
      learning: {
        label: "Nauka & Edukacja",
        hint: "Tutor, Socratic Questioner",
      },
      chat: {
        label: "Po prostu rozmowy",
        hint: "Twój towarzysz wystarczy",
      },
    },
    // Companion personalities
    thea: {
      tagline: "Ciepła & mądra",
      description: "Jak wspierająca przyjaciółka, która naprawdę cię rozumie.",
    },
    hermes: {
      tagline: "Odważny & bezpośredni",
      description: "Jak trener, który popycha cię do bycia najlepszym.",
    },
    // Legacy keys
    startChatting: "Rozpocznij czat",
    canChangeLater: "Zawsze możesz to zmienić później",
  },
  tiers: {
    any: "Dowolny",
    anyDesc: "Bez ograniczeń",
    price: {
      cheap: "Tani",
      standard: "Standardowy",
      premium: "Premium",
      cheapDesc: "0-3 kredytów za wiadomość",
      standardDesc: "3-9 kredytów za wiadomość",
      premiumDesc: "9+ kredytów za wiadomość",
    },
    intelligence: {
      quick: "Szybki",
      smart: "Inteligentny",
      brilliant: "Genialny",
      quickDesc: "Szybki i wydajny",
      smartDesc: "Zrównoważona jakość",
      brilliantDesc: "Głębokie rozumowanie",
    },
    speed: {
      fast: "Szybki",
      balanced: "Zrównoważony",
      thorough: "Dokładny",
      fastDesc: "Szybkie odpowiedzi",
      balancedDesc: "Dobra równowaga",
      thoroughDesc: "Szczegółowa analiza",
    },
    content: {
      mainstream: "Mainstream",
      open: "Otwarty",
      uncensored: "Niecenzurowany",
      mainstreamDesc: "Standardowe bezpieczeństwo",
      openDesc: "Mniej ograniczeń",
      uncensoredDesc: "Brak ograniczeń",
    },
  },
  categories: {
    companion: "Towarzysze",
    assistant: "Asystenci",
    coding: "Programowanie",
    writing: "Pisanie",
    analysis: "Analiza",
    roleplay: "Odgrywanie ról",
    creative: "Kreatywne",
    education: "Edukacja",
    controversial: "Kontrowersyjne",
    custom: "Niestandardowe",
  },
  selectorBase: {
    favorites: "Ulubione",
    recommended: "Polecane",
    others: "Inne",
    searchPlaceholder: "Szukaj {{item}}...",
    toggleFavorite: "Przełącz ulubione",
    noFavorites: 'Brak ulubionych. Kliknij "Pokaż wszystkie", aby dodać.',
    noRecommended: "Brak polecanych opcji.",
    showAll: "Pokaż wszystkie",
    groupByProvider: "Grupuj według dostawcy",
    groupByUtility: "Grupuj według zastosowania",
    sortAZ: "Sortuj A-Z",
    sortZA: "Sortuj Z-A",
  },
  dialogs: {
    searchAndCreate: "Szukaj i utwórz",
    deleteChat: 'Usunąć czat "{{title}}"?',
    deleteFolderConfirm:
      'Usunąć folder "{{name}}" i przenieść {{count}} czat(ów) do Ogólne?',
  },
  newFolder: {
    title: "Utwórz nowy folder",
    folderName: "Nazwa folderu",
    placeholder: "Wprowadź nazwę folderu...",
    folderIcon: "Ikona folderu",
    cancel: "Anuluj",
    create: "Utwórz",
  },
  renameFolder: {
    title: "Zmień nazwę folderu",
    folderName: "Nazwa folderu",
    placeholder: "Wprowadź nazwę folderu...",
    folderIcon: "Ikona folderu",
    cancel: "Anuluj",
    save: "Zapisz",
  },
  folders: {
    privateDescription: "Twoje prywatne rozmowy",
    sharedDescription: "Rozmowy udostępnione innym",
    publicDescription: "Rozmowy publiczne",
    incognitoDescription: "Rozmowy w trybie prywatnym",
    cronDescription:
      "Automatyczne rozmowy tworzone przez zaplanowane zadania cron.",
    accessModal: {
      title: "Wymagane konto",
      privateTitle: "Wątki prywatne",
      sharedTitle: "Wątki udostępnione",
      publicTitle: "Forum publiczne",
      incognitoTitle: "Tryb incognito",
      privateExplanation:
        "Wątki prywatne to Twoja osobista przestrzeń do rozmów z AI. Wszystkie Twoje czaty są bezpiecznie przechowywane na naszych serwerach i automatycznie synchronizowane na wszystkich Twoich urządzeniach.",
      sharedExplanation:
        "Wątki udostępnione pozwalają tworzyć rozmowy i dzielić się nimi z innymi za pomocą bezpiecznych linków. Idealny do współpracy i dzielenia się spostrzeżeniami z zespołem lub przyjaciółmi.",
      publicExplanation:
        "Forum publiczne to przestrzeń chroniona przez pierwszą poprawkę, gdzie ludzie i AI angażują się w otwarty dialog. Dziel się pomysłami, kwestionuj perspektywy i uczestniczą w niecenzurowanych dyskusjach.",
      incognitoExplanation:
        "Tryb incognito zachowuje Twoje rozmowy całkowicie prywatne i lokalne. Twoje czaty są przechowywane tylko w Twojej przeglądarce i nigdy nie są wysyłane na nasze serwery - nawet nie są powiązane z Twoim kontem.",
      requiresAccount:
        "Aby uzyskać dostęp do {{folderName}}, musisz utworzyć konto lub się zalogować.",
      loginButton: "Zaloguj się",
      signupButton: "Zarejestruj się",
      close: "Zamknij",
    },
  },
  moveFolder: {
    title: "Przenieś folder",
    description: "Wybierz folder docelowy:",
    rootLevel: "Poziom główny (Bez rodzica)",
    cancel: "Anuluj",
    move: "Przenieś",
  },
  views: {
    linearView: "Widok liniowy (styl ChatGPT)",
    threadedView: "Widok wątkowy (styl Reddit/Discord)",
    flatView: "Widok płaski (styl 4chan)",
  },
  screenshot: {
    capturing: "Przechwytywanie...",
    capture: "Przechwyć zrzut ekranu",
    failed: "Nie udało się przechwycić zrzutu ekranu",
    failedWithMessage: "Nie udało się przechwycić zrzutu ekranu: {{message}}",
    tryAgain: "Nie udało się przechwycić zrzutu ekranu. Spróbuj ponownie.",
    noMessages:
      "Nie można znaleźć obszaru wiadomości czatu. Upewnij się, że masz wiadomości w czacie.",
    quotaExceeded: "Przekroczono limit pamięci. Zrzut ekranu jest za duży.",
    canvasError:
      "Nie udało się przekonwertować zrzutu ekranu na format obrazu.",
  },
  errors: {
    noResponse:
      "Nie otrzymano odpowiedzi od AI. Żądanie zostało zakończone, ale zwróciło pustą treść. Spróbuj ponownie.",
    noStream: "Nie udało się przesłać odpowiedzi: Brak czytnika",
    saveFailed: "Nie udało się zapisać edycji",
    branchFailed: "Nie udało się rozgałęzić",
    retryFailed: "Nie udało się ponowić",
    answerFailed: "Nie udało się odpowiedzieć",
    deleteFailed: "Nie udało się usunąć",
    cannotBranchFromFirst: "Nie można rozgałęzić od pierwszej wiadomości",
    parentMessageNotFound: "Nie znaleziono wiadomości nadrzędnej",
    parentMessageNotInPath:
      "Wiadomość nadrzędna nie znajduje się w bieżącej ścieżce",
    messageNotFound: "Nie znaleziono wiadomości",
    invalidBranchIndex: "Nieprawidłowy indeks gałęzi",
    messageNotInPath: "Wiadomość nie znajduje się w bieżącej ścieżce",
    requestAborted: "Żądanie zostało przerwane",
    requestCancelled: "Żądanie zostało anulowane",
    requestTimeout: "Przekroczono limit czasu żądania. Spróbuj ponownie.",
    networkError: "Błąd sieci. Sprawdź połączenie i spróbuj ponownie.",
    apiError: "Błąd API. Spróbuj ponownie później.",
    storageError: "Błąd pamięci. Pamięć przeglądarki może być pełna.",
    unexpectedError: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
    errorInContext: "Błąd w {{context}}: {{message}}",
    invalidRequestData: "Nieprawidłowe dane żądania: {{error}}",
    streamAIResponse: "Nie udało się uzyskać odpowiedzi AI. Spróbuj ponownie.",
  },
  speech: {
    error: "Błąd rozpoznawania mowy",

    transcript: "Transkrypcja: {{text}}",
  },
  // Common
  timestamp: {
    justNow: "przed chwilą",
    minutesAgo: "{{count}}m temu",
    hoursAgo: "{{count}}h temu",
    daysAgo: "{{count}}d temu",
  },
  publicFeed: {
    // Header
    header: {
      title: "Forum publiczne",
      description:
        "Przestrzeń chroniona przez First Amendment, gdzie kwitnie wolność słowa. Rozmawiaj z modelami AI i użytkownikami z całego świata. Dziel się pomysłami, kwestionuj perspektywy i mów swobodnie bez censury.",
    },
    // Sort modes
    sort: {
      hot: "Gorące",
      rising: "Rosnące",
      new: "Nowe",
      following: "Obserwowane",
    },
    searchPlaceholder: "Szukaj wątków...",
    noResults: "Nie znaleziono wyników",
    noThreads: "Brak wątków. Rozpocznij rozmowę!",
    comments: "komentarze",
    bestAnswer: "Najlepsza odpowiedź",
    rising: "Rosnące",
  },
  state: {
    threadNotFound: "Nie znaleziono wątku",
  },
  storage: {
    parsePreferencesFailed:
      "Nie udało się przeanalizować preferencji użytkownika z pamięci",
    parseStateFailed: "Nie udało się przeanalizować stanu czatu z pamięci",
    syncPreferencesFailed:
      "Nie udało się zsynchronizować preferencji z pamięcią",
    syncStateFailed: "Nie udało się zsynchronizować stanu czatu z pamięcią",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Punkt końcowy mowy na tekst niedostępny",
      "failed-to-start": "Nie udało się rozpocząć nagrywania",
      "permission-denied": "Odmowa dostępu do mikrofonu",
      "no-microphone": "Nie znaleziono mikrofonu",
      "microphone-in-use": "Mikrofon jest w użyciu",
      "transcription-failed": "Nie udało się transkrybować",
    },
    tts: {
      "endpoint-not-available": "Punkt końcowy tekstu na mowę niedostępny",
      "failed-to-play": "Nie udało się odtworzyć audio",
      "conversion-failed": "Konwersja TTS nie powiodła się",
      "failed-to-generate": "Nie udało się wygenerować audio",
    },
  },
  voiceMode: {
    unconfiguredTitle: "Głos nie skonfigurowany",
    unconfiguredDescription:
      "Dodaj EDEN_AI_API_KEY do pliku .env, aby włączyć głos. Klucz dostępny na app.edenai.run",
    inputMode: "Tryb wprowadzania głosowego",
    transcribeMode: "Transkrybuj",
    transcribeModeDescription: "Nagrywaj → Tekst pojawi się w polu",
    talkMode: "Mów",
    talkModeDescription: "Nagrywaj → Wyślij natychmiast",
    callMode: "Tryb rozmowy",
    callModeDescription: "Krótkie odpowiedzi + autoodtwarzanie",
    autoPlayTTS: "Automatyczne odtwarzanie",
    autoPlayTTSOn: "Odpowiedzi będą odczytywane",
    autoPlayTTSOff: "Tylko ręczne odtwarzanie",
    tapToRecord: "Dotknij, aby nagrać",
    tapToTalk: "Dotknij, aby mówić",
    tapToTranscribe: "Dotknij, aby transkrybować",
    listeningTalk: "Słucham... Puść, aby wysłać",
    listeningTranscribe: "Słucham... Dotknij, aby zatrzymać",
    stopSpeaking: "Zatrzymaj odtwarzanie",
    longPressHint: "Przytrzymaj, aby zobaczyć opcje",
    switchToText: "Przełącz na tekst",
    switchToCall: "Przełącz na rozmowę",
    recording: {
      paused: "Wstrzymano",
      pause: "Wstrzymaj",
      resume: "Wznów",
    },
    actions: {
      cancel: "Anuluj",
      toInput: "Do pola",
      sendVoice: "Wyślij głos",
    },
    callOverlay: {
      backToChat: "Wróć do czatu",
      listening: "Słucham...",
      processing: "Przetwarzam...",
      thinking: "Myślę...",
      speaking: "Mówię...",
      tapToSpeak: "Dotknij, aby mówić",
      tapToStop: "Dotknij, aby zatrzymać",
      endCall: "Zakończ rozmowę",
      aiThinking: "AI myśli...",
    },
  },
  post: {
    title: "Czat",
    description: "Interfejs czatu",
  },
  messages: {
    assistant: "Asystent",
    you: "Ty",
    user: "Użytkownik",
    anonymous: "Anonim",
    authorWithId: "{{name}} [{{id}}]",
    edited: "edytowano",
    error: "Błąd",
    postNumber: "Nr.{{number}}",
    actions: {
      handleSaveEdit: {
        error: "Nie udało się zapisać edycji wiadomości",
      },
      handleBranchEdit: {
        error: "Nie udało się rozgałęzić wiadomości",
      },
      handleConfirmRetry: {
        error: "Nie udało się ponowić wiadomości",
      },
      handleConfirmAnswer: {
        error: "Nie udało się odpowiedzieć jako model",
      },
      handleConfirmDelete: {
        error: "Nie udało się usunąć wiadomości",
      },
    },
    branch: {
      previous: "Poprzednia gałąź",
      next: "Następna gałąź",
    },
  },
  batchToolConfirmation: {
    title: "Potwierdzenie Narzędzi Wsadowych",
  },
  reasoning: {
    title: "Myślenie",
    multiple: "{{count}} kroków rozumowania",
    step: "Krok {{number}}",
  },
  modelUtilities: {
    chat: "Codzienny Chat",
    smart: "Zaawansowany i Inteligentny",
    coding: "Programowanie i Rozwój",
    creative: "Pisanie Kreatywne",
    analysis: "Analiza i Badania",
    fast: "Szybki i Wydajny",
    multimodal: "Multimodalny (Wizja)",
    vision: "Wizja i Rozumienie Obrazów",
    imageGen: "Generowanie Obrazów",
    uncensored: "Niecenzurowany",
    legacy: "Modele Legacy",
    // Skill categories
    technical: "Techniczne",
    education: "Edukacja",
    controversial: "Kontrowersyjne",
    lifestyle: "Styl Życia",
    // Model capabilities/utilities
    reasoning: "Zaawansowane Rozumowanie",
    roleplay: "Odgrywanie Ról",
    roleplayDark: "Ciemne Odgrywanie Ról",
    adultImplied: "Treści Dorosłe/Sugerowane",
    adultExplicit: "Treści Dorosłe/Eksplicytne",
    violence: "Przemoc",
    harmful: "Potencjalnie Szkodliwe Treści",
    illegalInfo: "Nielegalne Informacje",
    medicalAdvice: "Porady Medyczne",
    offensiveLanguage: "Obraźliwy Język",
    politicalLeft: "Lewe Poglądy Polityczne",
    politicalRight: "Prawe Poglądy Polityczne",
    conspiracy: "Teorie Spiskowe",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Najnowszy model Claude z doskonałą wydajnością",
      claudeSonnet45: "Najnowszy model Claude z doskonałą wydajnością",
      gpt5: "Najnowszy model GPT z doskonałą wydajnością",
      gpt51: "Najnowszy model GPT 5.1 z ulepszonym rozumowaniem",
      gpt5Pro:
        "Najnowszy model GPT z doskonałą wydajnością do zadań programistycznych",
      gpt5Codex: "Najnowszy model GPT z doskonałą wydajnością",
      gpt51Codex:
        "Najnowszy model GPT 5.1 Codex zoptymalizowany do programowania",
      gpt5Mini:
        "Najnowszy model mini z doskonałym stosunkiem wydajności do kosztów",
      gpt5Nano:
        "Najnowszy model nano z doskonałym stosunkiem wydajności do kosztów",
      gptOss120b: "Model GPT open-source z 120B parametrami",
      geminiFlash25Pro: "Ultraszybki i wydajny model 14B z dużym kontekstem",
      geminiFlash25Flash: "Ultraszybki i wydajny model 14B z dużym kontekstem",
      geminiFlash25Lite: "Ultraszybki i wydajny model 14B z dużym kontekstem",
      mistralNemo:
        "Europejski model AI z silną wydajnością i naciskiem na prywatność",
      kimiK2Free:
        "Kimi K2 Instruct to wielki model językowy Mixture-of-Experts (MoE) opracowany przez Moonshot AI.",
      kimiK2:
        "Kimi K2 - zaawansowany model Mixture-of-Experts (MoE) od Moonshot AI z dużym oknem kontekstu",
      kimiK2Thinking:
        "Kimi K2 Thinking - wariant skupiony na rozumowaniu z rozszerzonymi możliwościami analitycznymi",
      deepseekV31Free: "Potężny model z 671B parametrami - całkowicie darmowy!",
      deepseekV31:
        "Potężny model z 671B parametrami z zaawansowanymi możliwościami",
      qwen3235bFree:
        "Model Mixture-of-Experts (MoE) opracowany przez Qwen, obsługuje płynne przełączanie między trybami.",
      deepseekR1Distill: "Destylowany model rozumowania z silną wydajnością",
      deepseekR1:
        "Zaawansowany model rozumowania z głębokimi możliwościami myślenia",
      qwen257b: "Wydajny model z 7B parametrami",
      grok4: "X-AI Grok 4 - model premium",
      grok4Fast:
        "Grok 4 Fast to najnowszy multimodalny model xAI z najlepszą efektywnością kosztową i oknem kontekstu 2M tokenów. Dostępny w dwóch wariantach: bez rozumowania i z rozumowaniem.",
      glm5: "GLM-5 - flagowy model open-source Z.AI do projektowania złożonych systemów i długoterminowych przepływów agentów, dorównujący wiodącym modelom zamkniętym",
      glm46: "GLM 4.6 - wydajny model z 7B parametrami i dużym oknem kontekstu",
      glm47:
        "GLM 4.7 - ulepszony model 7B z rozszerzonymi możliwościami rozumowania i kodowania",
      glm47Flash:
        "GLM 4.7 Flash - ultraszybki wariant zoptymalizowany pod kątem szybkich odpowiedzi",
      glm45Air: "GLM 4.5 AIR - ultraszybki lekki model z dużym oknem kontekstu",
      glm45v:
        "GLM 4.5v - multimodalny model z obsługą wizji i dużym oknem kontekstu",
      kimiK2_5:
        "Kimi K2.5 - Rozszerzona wersja z ulepszonymi możliwościami rozumowania i pisania kreatywnego",
      uncensoredLmV11:
        "Niecenzurowany model językowy bez filtrowania treści - model premium",
      freedomgptLiberty:
        "FreedomGPT Liberty - Niecenzurowany model AI skoncentrowany na wolności wypowiedzi i treściach kreatywnych",
      gabAiArya:
        "Gab AI Arya - Niecenzurowany model konwersacyjny AI z wolnością wypowiedzi i kreatywnymi możliwościami",
      gpt52Pro:
        "GPT 5.2 Pro - zaawansowany model rozumowania z ulepszonymi możliwościami dla złożonych zadań",
      gpt52:
        "GPT 5.2 - model najnowszej generacji z ulepszoną wydajnością i efektywnością",
      gpt52_chat:
        "GPT 5.2 Chat - wariant konwersacyjny zoptymalizowany pod kątem dialogu i interakcji",
      veniceUncensored:
        "Venice Uncensored - Niecenzurowany model AI do nieograniczonych rozmów",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Niecenzurowany duży model językowy oparty na Llama 3",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Niecenzurowany duży model językowy oparty na Mistral",
      claudeOpus45:
        "Claude Opus 4.5 - Najpotężniejszy model Claude z wyjątkowym rozumowaniem i zdolnościami kreatywnymi",
      claudeOpus46:
        "Claude Opus 4.6 - Najnowszy i najpotężniejszy model Claude z wyjątkowym rozumowaniem i zdolnościami kreatywnymi",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Najbardziej zaawansowany model Sonnet firmy Anthropic z najwyższą wydajnością w kodowaniu, agentach i pracy zawodowej",
      gemini3Pro:
        "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstu i potężnymi możliwościami rozumowania",
      gemini3Flash:
        "Google Gemini 3 Flash - Szybki, wydajny multimodalny model AI zoptymalizowany pod kątem szybkich odpowiedzi",
      deepseekV32:
        "DeepSeek V3.2 - Wysokowydajny model rozumowania z zaawansowanymi możliwościami kodowania",
    },
  },
  tones: {
    professional: {
      description: "Standardowy profesjonalny ton",
      systemPrompt:
        "Utrzymuj profesjonalny, informacyjny i przystępny ton w swoich odpowiedziach.",
    },
    pirate: {
      description: "Ahoj przyjacielu! Mów jak pirat",
      systemPrompt:
        "Odpowiadaj jak przyjazny pirat, używając pirackiego języka i wyrażeń takich jak 'ahoj', 'przyjacielu', 'arrr', 'ty', 'aye' i innych morskich terminów. Bądź entuzjastyczny i pełen przygód, jednocześnie dostarczając dokładnych informacji.",
    },
    enthusiastic: {
      description: "Super podekscytowany i energiczny",
      systemPrompt:
        "Bądź niezwykle entuzjastyczny, podekscytowany i energiczny w swoich odpowiedziach! Używaj wykrzykników, pozytywnego języka i okazuj prawdziwe podekscytowanie. Spraw, aby wszystko brzmiało niesamowicie i inspirująco!",
    },
    zen: {
      description: "Spokojny, mądry i filozoficzny",
      systemPrompt:
        "Odpowiadaj z mądrością i spokojnym zachowaniem mistrza zen. Używaj przemyślanego, filozoficznego języka, mów o równowadze i harmonii oraz dziel się spostrzeżeniami z pokojowymi metaforami. Bądź spokojny i kontemplacyjny.",
    },
    detective: {
      description: "Tajemniczy i śledczy",
      systemPrompt:
        "Odpowiadaj jak bystry, spostrzegawczy detektyw. Używaj języka śledczego, mów o 'sprawach' i 'dowodach' oraz prezentuj informacje, jakbyś rozwiązywał tajemnicę lub budował sprawę. Bądź analityczny i intrygujący.",
    },
    shakespearean: {
      description: "Elokwentny i poetycki jak Bard",
      systemPrompt:
        "Odpowiadaj w elokwentnym, poetyckim stylu Szekspira. Używaj kwiecistego języka, metafor i okazjonalnie archaicznych terminów takich jak 'ty', 'ciebie', 'ma' i 'czyni'. Spraw, aby historia brzmiała jak epicka opowieść godna największego dramaturga.",
    },
  },
  speechRecognition: {
    errors: {
      notInBrowser: "Nie w środowisku przeglądarki",
      requiresHttps: "Rozpoznawanie mowy wymaga HTTPS lub localhost",
      notAvailable: "Rozpoznawanie mowy niedostępne w tej przeglądarce",
      firefoxNotSupported: "Rozpoznawanie mowy nie jest obsługiwane w Firefox",
      safariVersionTooOld: "Zaktualizuj Safari do wersji 14.5 lub nowszej",
      microphoneNotAvailable: "Dostęp do mikrofonu niedostępny",
      noSpeech: "Nie wykryto mowy. Spróbuj ponownie.",
      audioCapture: "Mikrofon niedostępny. Sprawdź swoje ustawienia.",
      notAllowed:
        "Odmowa dostępu do mikrofonu. Zezwól na dostęp do mikrofonu w ustawieniach przeglądarki.",
      network: "Błąd sieci. Sprawdź swoje połączenie.",
      serviceNotAllowed: "Usługa rozpoznawania mowy niedozwolona.",
      badGrammar: "Błąd rozpoznawania mowy. Spróbuj ponownie.",
      languageNotSupported:
        "Ten język nie jest obsługiwany przez rozpoznawanie mowy.",
      aborted: "Nagrywanie anulowane.",
      unknown: "Błąd rozpoznawania mowy: {{errorCode}}",
      apiNotFound: "Nie znaleziono API rozpoznawania mowy",
      initializationFailed: "Nie udało się zainicjować rozpoznawania mowy",
      microphoneAccessDenied: "Odmowa dostępu do mikrofonu",
      microphonePermissionDenied:
        "Odmowa dostępu do mikrofonu. Zezwól na dostęp do mikrofonu.",
      noMicrophoneFound: "Nie znaleziono mikrofonu. Podłącz mikrofon.",
      microphoneInUse: "Mikrofon jest już używany przez inną aplikację.",
      startFailed: "Nie udało się rozpocząć nagrywania. Spróbuj ponownie.",
    },
  },
  linearMessageView: {
    retryModal: {
      title: "Ponów z innymi ustawieniami",
      description:
        "Wybierz model i personę, aby ponownie wygenerować odpowiedź",
      confirmLabel: "Ponów",
    },
    answerModal: {
      title: "Odpowiedz jako model AI",
      description: "Wybierz model i personę, aby wygenerować odpowiedź AI",
      confirmLabel: "Generuj",
      inputPlaceholder:
        "Wprowadź monit dla AI (opcjonalnie - pozostaw puste, aby AI wygenerowało własną odpowiedź)",
    },
  },
  debugView: {
    systemPrompt: "Prompt systemowy",
    systemPromptTitle: "Prompt systemowy (Wygenerowany)",
    systemPromptHint: "To jest prompt systemowy dla całego wątku rozmowy",
    systemMessage: "Wiadomość systemowa",
    systemMessageHint: "To jest wiadomość systemowa wstrzyknięta do rozmowy",
    copied: "Skopiowano!",
    retryModal: {
      title: "Ponów z innymi ustawieniami",
      description:
        "Wybierz model i personę, aby ponownie wygenerować odpowiedź",
      confirmLabel: "Ponów",
    },
    answerModal: {
      title: "Odpowiedz jako model AI",
      description: "Wybierz model i personę, aby wygenerować odpowiedź AI",
      confirmLabel: "Generuj",
      inputPlaceholder:
        "Wprowadź monit dla AI (opcjonalnie - pozostaw puste, aby AI wygenerowało własną odpowiedź)",
    },
  },
  suggestedPrompts: {
    title: "Jak mogę Ci pomóc?",
    privateTitle: "Twój prywatny asystent AI",
    privateDescription:
      "Rozmowy zapisane na Twoim koncie i synchronizowane na wszystkich urządzeniach.",
    sharedTitle: "Współpraca z AI",
    sharedDescription:
      "Twórz rozmowy i udostępniaj je członkom zespołu za pomocą bezpiecznych linków.",
    publicTitle: "Dołącz do publicznego forum AI",
    publicDescription:
      "Publiczne rozmowy widoczne dla wszystkich. Dziel się pomysłami i prowadź otwarty dialog.",
    incognitoTitle: "Anonimowy czat AI",
    incognitoDescription:
      "Przechowywane tylko w przeglądarce. Nigdy nie zapisywane na koncie ani synchronizowane.",
    more: "Więcej",
    selectSkill: "Wybierz postać",
    noPrompts: "Brak sugestii dla tej postaci",
    showDetails: "Pokaż szczegóły",
    hideDetails: "Ukryj szczegóły",
    systemPromptLabel: "Prompt systemowy",
    preferredModelLabel: "Preferowany model",
    categoryLabel: "Kategoria",
    suggestedPromptsLabel: "Sugerowane prompty",
  },
  emptyState: {
    quickStart: "Szybki start",
    private: {
      brainstorm: "Burza mózgów",
      brainstormPrompt: "Pomóż mi w burzy mózgów na temat...",
      writeDocument: "Napisz dokument",
      writeDocumentPrompt: "Pomóż mi napisać profesjonalny dokument o...",
      helpWithCode: "Pomoc z kodem",
      helpWithCodePrompt: "Potrzebuję pomocy z tym kodem...",
      research: "Zbadaj temat",
      researchPrompt: "Zbadaj i podsumuj informacje o...",
    },
    shared: {
      teamBrainstorm: "Burza mózgów zespołu",
      teamBrainstormPrompt: "Przeprowadźmy burzę mózgów na temat...",
      projectPlan: "Planowanie projektu",
      projectPlanPrompt: "Pomóż nam zaplanować projekt dla...",
      discussion: "Rozpocznij dyskusję",
      discussionPrompt: "Przedyskutujmy...",
      shareIdeas: "Podziel się pomysłami",
      shareIdeasPrompt: "Chcę podzielić się i rozwinąć pomysły na temat...",
    },
    incognito: {
      quickQuestion: "Szybkie pytanie",
      quickQuestionPrompt: "Mam szybkie pytanie o...",
      privateThought: "Prywatna myśl",
      privateThoughtPrompt: "Chcę prywatnie zbadać ten pomysł...",
      experiment: "Eksperyment",
      experimentPrompt: "Pozwól mi spróbować czegoś...",
      sensitiveQuestion: "Wrażliwe pytanie",
      sensitiveQuestionPrompt: "Potrzebuję porady w delikatnej sprawie...",
    },
  },
  messageEditor: {
    placeholder: "Edytuj swoją wiadomość...",
    hint: {
      branch: "aby rozgałęzić",
      cancel: "aby anulować",
    },
    titles: {
      branch: "Rozgałęź konwersację",
      cancel: "Anuluj edycję",
    },
    buttons: {
      branch: "Rozgałęź",
      branching: "Rozgałęzianie...",
      cancel: "Anuluj",
    },
  },
  folderList: {
    confirmDelete:
      'Usunąć folder "{{folderName}}" i przenieść {{count}} czat(ów) do Ogólne?',
    enterFolderName: "Wprowadź nazwę folderu:",
    newChatInFolder: "Nowy czat w folderze",
    moveUp: "Przenieś w górę",
    moveDown: "Przenieś w dół",
    renameFolder: "Zmień nazwę folderu",
    moveToFolder: "Przenieś do folderu",
    newSubfolder: "Nowy podfolder",
    deleteFolder: "Usuń folder",
    managePermissions: "Zarządzaj uprawnieniami",
    manageSharing: "Zarządzaj udostępnianiem",
    shareThread: "Udostępnij wątek",
    deleteDialog: {
      title: "Usuń folder",
      description: 'Czy na pewno chcesz usunąć "{{folderName}}"?',
      descriptionWithThreads:
        'Czy na pewno chcesz usunąć "{{folderName}}"? Ten folder zawiera {{count}} wątek(ów), które również zostaną usunięte.',
    },
    today: "Dzisiaj",
    lastWeek: "Ostatnie 7 dni",
    lastMonth: "Ostatnie 30 dni",
    older: "Starsze",
    folderNotFound: "Nie znaleziono folderu",
    emptyFolder: "Brak czatów lub folderów",
    createSubfolder: "Utwórz podfolder",
    rename: "Zmień nazwę",
    changeIcon: "Zmień ikonę",
    delete: "Usuń",
    newFolder: "Nowy folder",
  },
  permissions: {
    folder: {
      title: "Uprawnienia folderu",
      description: "Zarządzaj uprawnieniami dla tego folderu",
    },
    thread: {
      title: "Uprawnienia wątku",
      description: "Zarządzaj uprawnieniami dla tego wątku",
    },
    view: {
      label: "Uprawnienia do przeglądania",
      description: "Kto może przeglądać i czytać tę treść",
    },
    manage: {
      label: "Uprawnienia do zarządzania",
      description: "Kto może edytować folder i tworzyć podfoldery",
    },
    edit: {
      label: "Uprawnienia do edycji",
      description: "Kto może edytować właściwości wątku",
    },
    createThread: {
      label: "Uprawnienia do tworzenia wątków",
      description: "Kto może tworzyć nowe wątki w tym folderze",
    },
    post: {
      label: "Uprawnienia do postowania",
      description: "Kto może publikować wiadomości",
    },
    moderate: {
      label: "Uprawnienia moderacyjne",
      description: "Kto może ukrywać i moderować treści",
    },
    admin: {
      label: "Uprawnienia administratora",
      description: "Kto może usuwać treści i zarządzać uprawnieniami",
    },
    // Legacy keys (kept for backwards compatibility)
    read: {
      label: "Uprawnienia do odczytu",
      description: "Kto może przeglądać i czytać tę treść",
    },
    write: {
      label: "Uprawnienia do zapisu",
      description: "Kto może tworzyć wątki i foldery",
    },
    writePost: {
      label: "Uprawnienia do postowania",
      description: "Kto może publikować wiadomości w wątkach",
    },
    roles: {
      public: "Publiczny (Wszyscy użytkownicy)",
      customer: "Tylko klienci",
      admin: "Tylko administratorzy",
    },
    visibility: {
      label: "Kto może to zobaczyć?",
      description:
        "Wybierz, które role użytkowników mogą przeglądać ten folder/wątek",
      public: "Publiczny (Wszyscy użytkownicy)",
      customer: "Tylko klienci",
      admin: "Tylko administratorzy",
    },
    addModerator: {
      label: "Dodaj moderatora",
      placeholder: "Wprowadź ID użytkownika...",
    },
    moderatorList: {
      label: "Obecni moderatorzy",
      empty: "Nie dodano jeszcze moderatorów",
    },
    errors: {
      emptyId: "ID użytkownika nie może być puste",
      invalidUuid: "Nieprawidłowy format ID użytkownika",
      duplicate: "Ten użytkownik jest już moderatorem",
    },
  },
  threadedView: {
    expandReplies: "Rozwiń odpowiedzi",
    collapseReplies: "Zwiń odpowiedzi",
    continueThread: "Kontynuuj wątek ({{count}} więcej {{replyText}})",
    reply: "odpowiedź",
    replies: "odpowiedzi",
    retryModal: {
      title: "Ponów z innymi ustawieniami",
      description:
        "Wybierz model i personę, aby ponownie wygenerować odpowiedź",
      confirmLabel: "Ponów",
    },
    answerModal: {
      title: "Odpowiedz jako model AI",
      description: "Wybierz model i personę, aby wygenerować odpowiedź AI",
      confirmLabel: "Generuj",
      inputPlaceholder:
        "Wprowadź monit dla AI (opcjonalnie - pozostaw puste, aby AI wygenerowało własną odpowiedź)",
    },
    actions: {
      vote: "Głosuj",
      upvote: "Głosuj za",
      downvote: "Głosuj przeciw",
      respondToAI: "Odpowiedz na tę wiadomość AI inną personą AI",
      loadingAudio: "Ładowanie audio...",
      stopAudio: "Zatrzymaj audio",
      playAudio: "Odtwórz audio",
      cancelLoading: "Anuluj ładowanie",
      stop: "Zatrzymaj",
      play: "Odtwórz",
      cancel: "Anuluj",
      reply: "Odpowiedz",
      replyToMessage: "Odpowiedz na tę wiadomość (tworzy gałąź)",
      edit: "Edytuj",
      editMessage: "Edytuj tę wiadomość (tworzy gałąź)",
      retry: "Ponów",
      retryWithDifferent: "Ponów z innym modelem/personą",
      answerAsAI: "Odpowiedz jako AI",
      generateAIResponse: "Generuj odpowiedź AI",
      share: "Udostępnij",
      copyPermalink: "Kopiuj link",
      delete: "Usuń",
      deleteMessage: "Usuń tę wiadomość",
      parent: "Rodzic",
    },
    userFallback: "Użytkownik",
    assistantFallback: "Asystent",
    youLabel: "Ty",
    anonymous: "Anonimowy",
    authorWithId: "{{name}} [{{id}}]",
  },
  flatView: {
    postNumber: "Post #{{number}}",
    postsById: "{{count}} postów od tego ID",
    idLabel: "ID: {{id}}",
    anonymous: "Anonimowy",
    youLabel: "Ty",
    assistantFallback: "Asystent",
    replyingTo: "Odpowiedź na:",
    replies: "Odpowiedzi:",
    clickToCopyRef: "Kliknij, aby skopiować odniesienie",
    timestamp: {
      sun: "Nd",
      mon: "Pn",
      tue: "Wt",
      wed: "Śr",
      thu: "Cz",
      fri: "Pt",
      sat: "Sb",
      format:
        "{{month}}/{{day}}/{{year}}({{dayName}}){{hours}}:{{mins}}:{{secs}}",
    },
    retryModal: {
      title: "Ponów z innymi ustawieniami",
      description:
        "Wybierz model i personę, aby ponownie wygenerować odpowiedź",
      confirmLabel: "Ponów",
    },
    answerModal: {
      title: "Odpowiedz jako model AI",
      description: "Wybierz model i personę, aby wygenerować odpowiedź AI",
      confirmLabel: "Generuj",
      inputPlaceholder:
        "Wprowadź monit dla AI (opcjonalnie - pozostaw puste, aby AI wygenerowało własną odpowiedź)",
    },
    actions: {
      loadingAudio: "Ładowanie audio...",
      stopAudio: "Zatrzymaj audio",
      playAudio: "Odtwórz audio (+{{cost}} kredytów)",
      cancelLoading: "Anuluj ładowanie",
      stop: "Zatrzymaj",
      play: "Odtwórz",
      reply: "Odpowiedz",
      replyToMessage: "Odpowiedz na tę wiadomość (tworzy gałąź)",
      edit: "Edytuj",
      editMessage: "Edytuj tę wiadomość (tworzy gałąź)",
      retry: "Ponów",
      retryWithDifferent: "Ponów z innym modelem/personą",
      answerAsAI: "Odpowiedz jako AI",
      generateAIResponse: "Generuj odpowiedź AI",
      insertQuote: "Wstaw znak cytatu '>'",
      copyReference: "Kopiuj link odniesienia",
      delete: "Usuń",
      deleteMessage: "Usuń tę wiadomość",
    },
  },
  toolCall: {
    search: {
      title: "Przeszukiwanie sieci",
      query: "Zapytanie",
    },
    multiple: "{{count}} wywołań narzędzi",
    arguments: "Argumenty",
    result: "Wynik",
    error: "Błąd",
    executing: "Wykonywanie...",
    creditsUsed_one: "{{cost}} kredyt",
    creditsUsed_other: "{{cost}} kredytów",
    status: {
      error: "Błąd",
      executing: "Wykonywanie...",
      complete: "Zakończono",
    },
    sections: {
      request: "Żądanie",
      response: "Odpowiedź",
    },
    messages: {
      executingTool: "Wykonywanie narzędzia...",
      errorLabel: "Błąd:",
      noArguments: "Brak argumentów",
      noResult: "Brak wyniku",
      metadataNotAvailable:
        "Metadane widgetu niedostępne. Pokazywanie surowych danych.",
    },
  },
  threadList: {
    deleteDialog: {
      title: "Usuń wątek",
      description:
        'Czy na pewno chcesz usunąć "{{title}}"? Ta akcja jest nieodwracalna i wszystkie wiadomości w tym wątku zostaną trwale usunięte.',
    },
  },
  shareDialog: {
    title: "Udostępnij wątek",
    description: "Twórz i zarządzaj linkami udostępniającymi dla tego wątku",
    createLink: "Utwórz link udostępniający",
    linkCreated: "Link udostępniający utworzony pomyślnie!",
    linkCopied: "Link skopiowany do schowka!",
    copyLink: "Kopiuj link",
    shareViaEmail: "Udostępnij przez e-mail",
    revokeLink: "Unieważnij",
    revoke: "Unieważnij",
    linkRevoked: "Link udostępniający unieważniony",
    revoked: "Unieważniony",
    noLinksYet:
      "Brak linków udostępniających. Utwórz jeden, aby zacząć udostępniać.",
    activeLinks: "Aktywne linki udostępniające",
    existingLinks: "Istniejące linki",
    linkSettings: "Ustawienia linku",
    newLinkSettings: "Ustawienia nowego linku",
    linkLabel: "Etykieta linku (opcjonalnie)",
    linkLabelPlaceholder: "np. Udostępnij zespołowi",
    allowPosting: "Zezwalaj na publikowanie",
    allowPostingDescription:
      "Odbiorcy mogą odpowiadać i wchodzić w interakcje w wątku",
    requireAuth: "Wymagaj logowania",
    requireAuthDescription:
      "Tylko uwierzytelnieni użytkownicy mogą uzyskać dostęp do tego linku",
    viewOnly: "Tylko podgląd",
    accessCount: "{{count}} dostęp",
    accessCount_other: "{{count}} dostępów",
    createdAt: "Utworzono {{date}}",
    lastAccessed: "Ostatni dostęp {{date}}",
    neverAccessed: "Nigdy nie otwierano",
    emailSubject: "Sprawdź ten wątek: {{title}}",
    emailBody:
      "Pomyślałem, że ta rozmowa może Cię zainteresować: {{url}}\n\nWątek: {{title}}",
    emailPlaceholder: "Wprowadź adresy e-mail (rozdzielone przecinkami)",
    sendEmail: "E-mail",
    emailSent: "E-mail wysłany pomyślnie!",
    create: "Utwórz",
    creating: "Tworzenie...",
    copied: "Skopiowano!",
    close: "Zamknij",
    shareThread: "Udostępnij wątek",
  },
  shared: {
    error: {
      title: "Błąd linku udostępniającego",
      userError: "Nie można zweryfikować sesji. Spróbuj ponownie.",
      invalidToken:
        "Ten link udostępniający jest nieprawidłowy lub został unieważniony. Skontaktuj się z osobą, która udostępniła Ci ten link.",
    },
  },
  welcomeTour: {
    authDialog: {
      title: "Odblokuj prywatne i współdzielone foldery",
      description:
        "Zarejestruj się lub zaloguj, aby uzyskać dostęp do prywatnych i współdzielonych folderów. Twoje czaty będą synchronizowane między urządzeniami.",
      continueTour: "Kontynuuj",
      signUp: "Zarejestruj się / Zaloguj",
    },
    welcome: {
      title: "Witaj w {{appName}}!",
      description:
        "Uwolnij się od cenzury AI. Dostęp do GPT-5.1, Claude Sonnet i niecenzurowanych modeli trenowanych na WikiLeaks i nie-mainstreamowych danych. Rozmawiaj prywatnie, anonimowo lub publicznie. Twoja platforma, twoje zasady.",
      subtitle: "Poznajmy, co nas wyróżnia:",
    },
    modelSelector: {
      title: "Wybierz swój model AI",
      description:
        "W przeciwieństwie do ChatGPT, nie jesteś zamknięty na jedną AI. Przełączaj między GPT-5.1, Claude Sonnet, DeepSeek i niecenzurowanymi modelami jak Gab Arya i UncensoredLM. Każdy model oferuje unikalne perspektywy i możliwości.",
      tip: "Mainstream dla bezpieczeństwa, niecenzurowane dla prawdy. Mieszaj według potrzeb.",
    },
    aiCompanion: {
      title: "Wybierz swojego AI towarzysza",
      description:
        "Kliknij tutaj, aby poznać swoich AI towarzyszy. Każdy ma unikalną osobowość, a najlepszy model AI jest dla nich automatycznie wybierany. Zawsze możesz dostosować później.",
      tip: "👆 Kliknij, aby otworzyć i wybrać pierwszego towarzysza!",
    },
    characterSelector: {
      title: "Dostosuj zachowanie AI",
      description:
        "Persony kształtują sposób odpowiedzi AI. Używaj wbudowanych stylów lub twórz własne persony z własnymi instrukcjami i preferowanymi modelami.",
      tip: "Połącz dowolną personę z dowolnym modelem dla idealnego asystenta.",
    },
    modelSelectorFavorites: {
      title: "Oznacz ulubione",
      description:
        "Znalazłeś model, który kochasz? Oznacz go dla natychmiastowego dostępu. Mieszaj mainstreamowe i niecenzurowane modele według potrzeb.",
    },
    modelSelectorShowAll: {
      title: "Przeglądaj pełną bibliotekę",
      description:
        "Eksploruj wszystkie dostępne modele z wyszukiwaniem i filtrami. Odkryj niecenzurowane alternatywy dla mainstreamowych AI.",
    },
    modelSelectorSearch: {
      title: "Znajdź konkretne modele",
      description:
        "Szukaj według nazwy, dostawcy lub możliwości. Spróbuj 'bez cenzury', 'kodowanie' lub 'kreatywny'.",
    },
    modelSelectorGroup: {
      title: "Grupuj według dostawcy lub celu",
      description:
        "Wyświetl modele pogrupowane według firmy (OpenAI, Anthropic) lub według przypadku użycia (Kodowanie, Bez cenzury, Kreatywność).",
    },
    characterSelectorFavorites: {
      title: "Oznacz swoje persony",
      description: "Zapisz swoje ulubione style rozmowy dla szybkiego dostępu.",
    },
    characterSelectorShowAll: {
      title: "Przeglądaj wszystkie persony",
      description:
        "Eksploruj pełną bibliotekę person. Twórz własne persony dostosowane do twojego przepływu pracy.",
    },
    characterSelectorSearch: {
      title: "Znajdź persony",
      description: "Szukaj według nazwy, kategorii lub opisu.",
    },
    characterSelectorGroup: {
      title: "Grupuj persony",
      description:
        "Wyświetl według źródła (Wbudowane vs. Twoje własne) lub według kategorii (Kreatywność, Techniczne, Professional).",
    },
    rootFolders: {
      title: "4 sposoby na czat",
      description:
        "Wybierz swój poziom prywatności - od całkowicie anonimowego do współpracy:",
      private: {
        name: "Prywatny",
        suffix: "Twoja osobista przestrzeń",
      },
      incognito: {
        name: "Incognito",
        suffix: "Prywatność zero-knowledge",
      },
      shared: {
        name: "Współdzielony",
        suffix: "Kontrolowana współpraca",
      },
      public: {
        name: "Publiczny",
        suffix: "Forum wolności słowa",
      },
    },
    incognitoFolder: {
      name: "Incognito",
      suffix: "Folder",
      description:
        "Maksymalna prywatność. Historia czatu przechowywana tylko na twoim urządzeniu, nigdy na naszych serwerach. Wiadomości przetwarzane przez AI, następnie natychmiast usuwane. Idealne dla wrażliwych tematów z niecenzurowanymi modelami.",
      note: "Bez konta • Bez przechowywanej historii • Tylko lokalnie",
    },
    publicFolder: {
      name: "Publiczny",
      suffix: "Folder",
      description:
        "Otwarte forum AI chronione zasadami Pierwszej Poprawki. Rozmawiaj z AI i innymi użytkownikami publicznie. Dziel się wiedzą, debatuj nad pomysłami, uzyskuj różnorodne perspektywy.",
      note: "Bez konta • Wolność słowa jako podstawa • Napędzane przez społeczność",
    },
    privateFolder: {
      name: "Prywatny",
      suffix: "Folder",
      description:
        "Twoja osobista przestrzeń robocza AI. Synchronizowana na wszystkich urządzeniach, zorganizowana w podfolderach. Idealna dla bieżących projektów i badań.",
      authPrompt: "Wymagane konto:",
      login: "Zaloguj się",
      signUp: "Zarejestruj się",
    },
    sharedFolder: {
      name: "Współdzielony",
      suffix: "Folder",
      description:
        "Współpracuj z konkretnymi osobami. Udostępniaj rozmowy przez link, kontroluj kto może czytać lub pisać. Świetne dla zespołów i opinii ekspertów.",
      authPrompt: "Wymagane konto:",
      login: "Zaloguj się",
      signUp: "Zarejestruj się",
    },
    newChatButton: {
      title: "Rozpocznij nową rozmowę",
      description:
        "Kliknij tutaj, aby rozpocząć świeży czat. Wszystkie rozmowy automatycznie zapisują się w bieżącym folderze.",
      tip: "Każdy folder ma własną historię czatów.",
    },
    sidebarLogin: {
      title: "Utwórz darmowe konto",
      description:
        "Odblokuj foldery Prywatny i Współdzielony, synchronizuj na wszystkich urządzeniach, zapisuj ulubione modele i persony. Incognito i Publiczny pozostają dostępne bez konta.",
      tip: "Pozostań anonimowy lub synchronizuj wszystko. Twój wybór.",
    },
    subscriptionButton: {
      title: "Nieograniczony dostęp do AI",
      description:
        "Otrzymaj wszystko, co oferuje ChatGPT PLUS niecenzurowane modele, publiczne fora i prawdziwą prywatność. {{credits}} miesięcznych kredytów za {{price}}. Dostęp do wszystkich modeli, bez ograniczeń.",
      tip: "Jedna subskrypcja. Wszystkie mainstreamowe i niecenzurowane modele. Bez granic.",
      price: "30 PLN",
    },
    chatInput: {
      title: "Wpisz wiadomość",
      description:
        "Wpisz w polu tekstowym i naciśnij Enter, aby wysłać wiadomość do AI.",
      tip: "Naciśnij Shift+Enter dla nowej linii bez wysyłania.",
    },
    voiceInput: {
      title: "Nagrywanie głosu",
      description:
        "Kliknij mikrofon, aby rozpocząć nagrywanie. Po zakończeniu wybierz:",
      options: {
        transcribe: "Transkrybuj na tekst - zamienia mowę na edytowalny tekst",
        sendAudio: "Wyślij jako głos - AI słyszy Twój prawdziwy głos",
        pauseResume: "Wstrzymaj/wznów nagrywanie w dowolnym momencie",
      },
    },
    callMode: {
      title: "Tryb rozmowy",
      description:
        "Włącz rozmowy głosowe. Gdy aktywny, AI automatycznie wypowiada odpowiedzi przy użyciu syntezy mowy.",
      tip: "Idealny do rozmów bez użycia rąk. Włącz/wyłącz dla każdego modelu.",
    },
    complete: {
      title: "Wszystko gotowe!",
      description:
        "Masz teraz dostęp do mainstreamowych i niecenzurowanych modeli AI, prywatnych i publicznych trybów czatu oraz pełną kontrolę nad swoimi danymi. Zacznij eksplorować!",
      help: "Pytania? Zapytaj dowolny model AI o pomoc.",
    },
    authUnlocked: {
      unlocked: "Folder odblokowany!",
      privateDescription:
        "Twój folder Prywatny jest teraz aktywny. Wszystkie czaty synchronizują się między urządzeniami i pozostają zorganizowane w podfolderach.",
      privateNote: "Idealny dla bieżących projektów i osobistych badań.",
      sharedDescription:
        "Folder Współdzielony odblokowany! Twórz rozmowy i udostępniaj przez link z szczegółową kontrolą uprawnień.",
      sharedNote:
        "Idealny dla współpracy zespołowej i uzyskiwania opinii ekspertów.",
    },
    buttons: {
      back: "Wstecz",
      close: "Zamknij",
      last: "Zakończ",
      next: "Dalej",
      skip: "Pomiń wycieczkę",
    },
  },
};
