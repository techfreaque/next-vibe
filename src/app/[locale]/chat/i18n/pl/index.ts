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
    },

    // Assistant Message Actions
    assistantMessageActions: {
      stopAudio: "Zatrzymaj odtwarzanie audio",
      playAudio: "Odtwórz audio",
      answerAsAI: "Odpowiedz jako model AI",
      deleteMessage: "Usuń wiadomość",
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
      title: "Konfiguracja narzędzi AI",
      description:
        "Wybierz, które narzędzia AI asystent może używać podczas rozmowy. Narzędzia zapewniają funkcje takie jak wyszukiwanie w sieci, obliczenia i dostęp do danych.",
      searchPlaceholder: "Szukaj narzędzi...",
      loading: "Ładowanie narzędzi...",
      noToolsFound: "Brak narzędzi pasujących do wyszukiwania",
      noToolsAvailable:
        "Nie znaleziono jeszcze narzędzi AI. Narzędzia pojawią się tutaj automatycznie, gdy zostaną zarejestrowane w systemie.",
      expandAll: "Rozwiń wszystkie",
      collapseAll: "Zwiń wszystkie",
      selectAll: "Zaznacz wszystkie",
      deselectAll: "Odznacz wszystkie",
      enableAll: "Włącz wszystkie",
      stats: "{{enabled}} z {{total}} narzędzi włączonych",
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
    viewDetails: "Szczegóły",
    breakdown: "Podział kredytów",
    navigation: {
      profile: "Profil",
      subscription: "Subskrypcja",
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
    },
    speechInput: {
      stopRecording: "Zatrzymaj nagrywanie",
      processing: "Przetwarzanie...",
      startVoiceInput: "Uruchom wprowadzanie głosowe (Kliknij, aby mówić)",
      recordingClickToStop: "Nagrywanie... Kliknij, aby zatrzymać",
      transcribing: "Transkrybuję...",
    },
  },
  modelSelector: {
    placeholder: "Wybierz model",
    addNewLabel: "Dodaj niestandardowy model",
    costFree: "Darmowy",
    costCredits: "{{count}} kredyt/wiadomość",
    costCreditsPlural: "{{count}} kredytów/wiadomość",
    tooltip: "{{provider}} - {{name}} ({{cost}})",
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
  personaSelector: {
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
    enabledTitle: "Brave Search włączone (+1 kredyt za wyszukiwanie)",
    disabledTitle: "Brave Search wyłączone (+1 kredyt za wyszukiwanie)",
    creditIndicator: "+1",
  },
  toolsButton: {
    title: "Konfiguruj narzędzia AI",
    tools: "Narzędzia",
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
  post: {
    title: "Czat",
    description: "Interfejs czatu",
  },
  messages: {
    assistant: "Asystent",
    you: "Ty",
    user: "Użytkownik",
    anonymous: "Anonim",
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
  reasoning: {
    title: "Myślenie",
    multiple: "{{count}} kroków rozumowania",
    step: "Krok {{number}}",
  },
  modelUtilities: {
    general: "Ogólny Chat",
    coding: "Programowanie i Rozwój",
    creative: "Pisanie Kreatywne",
    analysis: "Analiza i Badania",
    fast: "Szybki i Wydajny",
    multimodal: "Multimodalny (Wizja)",
    vision: "Wizja i Rozumienie Obrazów",
    imageGen: "Generowanie Obrazów",
    uncensored: "Niecenzurowany",
    // Persona categories
    technical: "Techniczne",
    education: "Edukacja",
    controversial: "Kontrowersyjne",
    lifestyle: "Styl Życia",
  },
  models: {
    descriptions: {
      claudeHaiku45: "Najnowszy model Claude z doskonałą wydajnością",
      claudeSonnet45: "Najnowszy model Claude z doskonałą wydajnością",
      gpt5: "Najnowszy model GPT z doskonałą wydajnością",
      gpt5Pro:
        "Najnowszy model GPT z doskonałą wydajnością do zadań programistycznych",
      gpt5Codex: "Najnowszy model GPT z doskonałą wydajnością",
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
      glm46: "GLM 4.6 - wydajny model z 7B parametrami i dużym oknem kontekstu",
      glm45Air: "GLM 4.5 AIR - ultraszybki lekki model z dużym oknem kontekstu",
      glm45v:
        "GLM 4.5v - multimodalny model z obsługą wizji i dużym oknem kontekstu",
      uncensoredLmV11:
        "Niecenzurowany model językowy bez filtrowania treści - model premium",
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
  suggestedPrompts: {
    title: "Jak mogę Ci pomóc?",
    privateTitle: "Twój prywatny asystent AI",
    sharedTitle: "Współpraca z AI",
    publicTitle: "Dołącz do publicznego forum AI",
    incognitoTitle: "Anonimowy czat AI",
    more: "Więcej",
    selectPersona: "Wybierz personę",
    noPrompts: "Brak sugestii dla tej persony",
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
    deleteDialog: {
      title: "Usuń folder",
      description: 'Czy na pewno chcesz usunąć "{{folderName}}"?',
      descriptionWithThreads:
        'Czy na pewno chcesz usunąć "{{folderName}}"? Ten folder zawiera {{count}} wątek(ów), które również zostaną usunięte.',
    },
    today: "Dzisiaj",
    lastWeek: "Ostatnie 7 dni",
    lastMonth: "Ostatnie 30 dni",
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
      stop: "Zatrzymaj",
      play: "Odtwórz",
      reply: "Odpowiedz",
      replyToMessage: "Odpowiedz na tę wiadomość (tworzy gałąź)",
      edit: "Edytuj",
      editMessage: "Edytuj tę wiadomość (tworzy gałąź)",
      retry: "Ponów",
      retryWithDifferent: "Ponów z innym modelem/tonem",
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
      playAudio: "Odtwórz audio",
      stop: "Zatrzymaj",
      play: "Odtwórz",
      reply: "Odpowiedz",
      replyToMessage: "Odpowiedz na tę wiadomość (tworzy gałąź)",
      edit: "Edytuj",
      editMessage: "Edytuj tę wiadomość (tworzy gałąź)",
      retry: "Ponów",
      retryWithDifferent: "Ponów z innym modelem/tonem",
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
};
