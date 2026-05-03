import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    threads: "Wątki",
    folders: "Foldery",
    files: "Pliki",
    messages: "Wiadomości",
    characters: "Persony",
    memories: "Wspomnienia",
    favorites: "Ulubione",
    credits: "Kredyty",
    balance: "Saldo",
    permissions: "Uprawnienia",
    hotkey: "Skrót klawiszowy",
    cli: "CLI",
    speech: "Mowa",
    sharing: "Udostępnianie",
    settings: "Ustawienia",
  },
  config: {
    appName: "unbottled.ai",
    folders: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      incognito: "Incognito",
      background: "W tle",
      support: "Wsparcie",
    },
    foldersShort: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      incognito: "Incognito",
      background: "W tle",
      support: "Wsparcie",
    },
  },
  enums: {
    role: {
      user: "Użytkownik",
      assistant: "Asystent",
      system: "System",
      tool: "Narzędzie",
      error: "Błąd",
    },
    threadStatus: {
      active: "Aktywny",
      archived: "Zarchiwizowany",
      deleted: "Usunięty",
    },
    viewMode: {
      linear: "Liniowy",
      threaded: "Wątkowy",
      flat: "Płaski",
      debug: "Debug",
    },
  },
  components: {
    sidebar: {
      login: "Zaloguj się",
      logout: "Wyloguj się",
      footer: {
        account: "Konto",
        profile: "Profil",
        balance: "Saldo",
        buy: "Kup",
        freeCreditsLeft: "Darmowe kredyty",
      },
    },
    credits: {
      credit: "{{count}} kredyt",
      credits: "{{count}} kredytów",
    },
    navigation: {
      subscription: "Subskrypcja i Kredyty",
      referral: "Program Poleceń",
      help: "Pomoc",
      about: "O nas",
    },
    confirmations: {
      deleteMessage: "Czy na pewno chcesz usunąć tę wiadomość?",
    },
    welcomeTour: {
      authDialog: {
        title: "Odblokuj prywatne i udostępnione foldery",
        description:
          "Zarejestruj się lub zaloguj, aby uzyskać dostęp do prywatnych i udostępnionych folderów. Twoje czaty będą synchronizowane między urządzeniami.",
        continueTour: "Kontynuuj wycieczkę",
        signUp: "Zarejestruj się / Zaloguj",
      },
      buttons: {
        back: "Wstecz",
        close: "Zamknij",
        last: "Zakończ",
        next: "Dalej",
        skip: "Pomiń",
      },
      welcome: {
        title: "Witaj w {{appName}}!",
        description:
          "Twoja platforma AI zorientowana na prywatność z ponad {{modelCount}} modelami, kontrolą treści przez użytkownika i zasadami wolności słowa.",
        subtitle: "Zrób szybką wycieczkę, aby zacząć.",
      },
      aiCompanion: {
        title: "Wybierz swojego towarzysza AI",
        description:
          "Wybieraj spośród ponad {{modelCount}} modeli AI, w tym głównonurtowych, open-source i bez cenzury.",
        tip: "Kliknij, aby otworzyć selektor modeli i wybrać towarzysza.",
      },
      rootFolders: {
        title: "Twoje foldery czatów",
        description:
          "Organizuj swoje czaty w różnych folderach, każdy z unikalnymi ustawieniami prywatności:",
        private: {
          name: "Prywatny",
          suffix: "— tylko Ty możesz zobaczyć",
        },
        incognito: {
          name: "Incognito",
          suffix: "— historia nie jest zapisywana",
        },
        shared: {
          name: "Udostępniony",
          suffix: "— współpracuj z innymi",
        },
        public: {
          name: "Publiczny",
          suffix: "— widoczny dla wszystkich",
        },
      },
      privateFolder: {
        name: "Prywatny",
        suffix: "Folder",
        description:
          "Twoje prywatne czaty są widoczne tylko dla Ciebie. Idealne do wrażliwych tematów.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Rozmawiaj bez zapisywania historii na serwerze. Wiadomości są przechowywane lokalnie w przeglądarce i pozostają do momentu ich usunięcia.",
        note: "Żadne dane nie są przechowywane na naszych serwerach podczas sesji incognito.",
      },
      sharedFolder: {
        name: "Udostępniony",
        suffix: "Folder",
        description:
          "Współpracuj z konkretnymi osobami, udostępniając im dostęp do tego folderu.",
      },
      publicFolder: {
        name: "Publiczny",
        suffix: "Folder",
        description:
          "Udostępniaj swoje rozmowy AI światu. Inni mogą przeglądać i forkować Twoje wątki.",
        note: "Wszystko w folderze publicznym jest widoczne dla wszystkich użytkowników i wyszukiwarek.",
      },
      newChatButton: {
        title: "Rozpocznij nowy czat",
        description:
          "Kliknij tutaj, aby rozpocząć nową rozmowę w dowolnym folderze.",
      },
      sidebarLogin: {
        title: "Zaloguj się, aby odblokować więcej",
        description:
          "Utwórz darmowe konto, aby uzyskać dostęp do folderów prywatnych i udostępnionych, synchronizować historię rozmów między urządzeniami i pozwolić AI zapamiętywać informacje o Tobie.",
        tip: "Rejestracja jest bezpłatna!",
      },
      subscriptionButton: {
        title: "Kredyty i subskrypcja",
        description:
          "Otrzymuj {{credits}} kredytów/miesiąc z subskrypcją za jedyne {{price}}/miesiąc. Bezpłatni użytkownicy otrzymują {{freeCredits}} kredytów/miesiąc.",
      },
      chatInput: {
        title: "Wpisz swoją wiadomość",
        description:
          "Wpisz swoją wiadomość tutaj i naciśnij Enter lub kliknij Wyślij, aby rozmawiać z towarzyszem AI.",
        tip: "Użyj Shift+Enter dla nowej linii. Możesz też załączać pliki i zdjęcia.",
      },
      voiceInput: {
        title: "Wprowadzanie głosowe",
        description: "Użyj mikrofonu, aby rozmawiać z towarzyszem AI:",
        options: {
          transcribe: "Transkrybuj mowę na tekst",
          sendAudio: "Wyślij audio bezpośrednio do AI",
          pauseResume: "Wstrzymaj i wznów nagrywanie",
        },
      },
      callMode: {
        title: "Tryb połączenia",
        description:
          "Włącz tryb połączenia dla bezobsługowej, głosowej rozmowy z odpowiedziami AI w czasie rzeczywistym.",
        tip: "Idealne, gdy jesteś w ruchu lub wolisz mówić niż pisać.",
      },
      complete: {
        title: "Gotowe!",
        description:
          "Ukończyłeś wycieczkę! Zacznij teraz rozmawiać z towarzyszem AI.",
        help: "Potrzebujesz pomocy? Kliknij ikonę znaku zapytania na pasku bocznym w dowolnym momencie.",
      },
      authUnlocked: {
        unlocked: "Odblokowany!",
        privateDescription:
          "Twój prywatny folder jest teraz dostępny. Wszystkie czaty są widoczne tylko dla Ciebie.",
        privateNote:
          "Prywatne czaty automatycznie synchronizują się na wszystkich Twoich urządzeniach.",
        sharedDescription:
          "Twój udostępniony folder jest teraz dostępny. Zaproś innych do współpracy przy rozmowach AI.",
        sharedNote:
          "Kontrolujesz, kto ma dostęp do Twoich udostępnionych folderów i wątków.",
      },
    },
  },
  selector: {
    loading: "Ładowanie...",
    best: "Najlepsze dopasowanie",
    free: "DARMOWE",
    creditsSingle: "1 kredyt",
    creditsExact: "{{cost}} kredytów",
    modelOnly: "Tylko model",
    editModelSettings: "Edytuj ustawienia modelu",
    editSettings: "Edytuj ustawienia",
    switchSkill: "Zmień postać",
    editSkill: "Edytuj postać",
    delete: "Usuń",
    autoSelectedModel: "FILTROWANE",
    manualSelectedModel: "WYBRANE RĘCZNIE",
    intelligence: "Inteligencja",
    contentFilter: "Treść",
    maxPrice: "Maksymalna cena",
    modelSelection: "Wybór modelu",
    autoModeDescription:
      "Najlepszy model jest wybierany na podstawie Twoich filtrów",
    manualModeDescription: "Wybierz konkretny model ręcznie",
    autoMode: "Filtrowanie",
    manualMode: "Ręczny",
    allModelsCount: "Wszystkie {{count}} modeli",
    filteredModelsCount: "{{count}} modeli pasuje do filtrów",
    showFiltered: "Pokaż przefiltrowane",
    showAllModels: "Pokaż wszystkie modele",
    showLess: "Pokaż mniej",
    showMore: "Pokaż {{remaining}} więcej",
    showLegacyModels_one: "Pokaż {{count}} Model Legacy",
    showLegacyModels_other: "Pokaż {{count}} Modeli Legacy",
    noMatchingModels: "Brak pasujących modeli",
    noModelsWarning: "Żaden model nie pasuje do Twoich filtrów",
    useOnce: "Użyj raz",
    saveAsDefault: "Dodaj do ulubionych",
    deleteSetup: "Usuń konfigurację",
    content: "Przeszukaj treść...",
    characterSetup: "Konfiguracja persony",
    noResults: "Brak wyników",
    add: "Dodaj do ulubionych",
    added: "Dodano",
    addNew: "Dodaj nowy",
    searchSkills: "Szukaj person...",
    createCustom: "Utwórz własną",
    customizeSettings: "Dostosuj ustawienia",
    requirements: {
      characterConflict: "Konflikty wymagań postaci",
      tooLow: "zbyt niski",
      tooHigh: "zbyt wysoki",
      min: "min",
      max: "max",
    },
  },
  common: {
    newChat: "Nowy czat",
    privateChats: "Prywatne czaty",
    search: "Szukaj",
    delete: "Usuń",
    cancel: "Anuluj",
    save: "Zapisz",
    edit: "Edytuj",
    settings: "Ustawienia",
    close: "Zamknij",
    toggleSidebar: "Przełącz pasek boczny",
    lightMode: "Tryb jasny",
    darkMode: "Tryb ciemny",
    searchPlaceholder: "Szukaj...",
    searchThreadsPlaceholder: "Przeszukaj wątki...",
    searchResults: "Wyniki wyszukiwania",
    noChatsFound: "Nie znaleziono czatów",
    noThreadsFound: "Nie znaleziono wątków",
    enableTTSAutoplay: "Włącz autoodtwarzanie TTS",
    disableTTSAutoplay: "Wyłącz autoodtwarzanie TTS",
    selector: {
      country: "Kraj",
      language: "Język",
    },
    copyButton: {
      copied: "Skopiowano!",
      copyToClipboard: "Skopiuj do schowka",
      copyAsMarkdown: "Skopiuj jako Markdown",
      copyAsText: "Skopiuj jako tekst",
    },
    assistantMessageActions: {
      cancelLoading: "Anuluj ładowanie",
      stopAudio: "Zatrzymaj audio",
      playAudio: "Odtwórz audio",
      answerAsAI: "Odpowiedz jako model AI",
      deleteMessage: "Usuń wiadomość",
    },
    characterSelector: {
      placeholder: "Wybierz personę",
      addNewLabel: "Utwórz własną personę",
      grouping: {
        bySource: "Według źródła",
        byCategory: "Według kategorii",
        sourceLabels: {
          builtIn: "Wbudowane",
          my: "Moje persony",
          community: "Społeczność",
        },
        sourceIcons: {
          builtIn: "sparkles",
          my: "user",
          community: "people",
        },
      },
      addDialog: {
        title: "Utwórz własną personę",
        fields: {
          name: {
            label: "Nazwa",
            placeholder: "Wprowadź nazwę persony",
          },
          icon: {
            label: "Ikona (emoji)",
            placeholder: "😊",
          },
          description: {
            label: "Opis",
            placeholder: "Krótki opis persony",
          },
          systemPrompt: {
            label: "Prompt systemowy",
            placeholder: "Zdefiniuj, jak zachowuje się postać...",
          },
          category: {
            label: "Kategoria",
          },
        },
        createCategory: "Utwórz kategorię",
        cancel: "Anuluj",
        create: "Utwórz personę",
      },
      addCategoryDialog: {
        title: "Utwórz kategorię",
        fields: {
          name: {
            label: "Nazwa kategorii",
            placeholder: "Wprowadź nazwę kategorii",
          },
          icon: {
            label: "Ikona (emoji)",
            placeholder: "📁",
          },
        },
        cancel: "Anuluj",
        create: "Utwórz kategorię",
      },
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
    copyContent: "Skopiuj do schowka",
  },
  dialogs: {
    searchAndCreate: "Szukaj i utwórz",
    deleteChat: 'Usunąć czat "{{title}}"?',
    deleteFolderConfirm:
      'Usunąć folder "{{name}}" i przenieść {{count}} czat(ów) do Ogólne?',
  },
  views: {
    linearView: "Widok liniowy (styl ChatGPT)",
    threadedView: "Widok wątkowy (styl Reddit/Discord)",
    flatView: "Widok płaski (styl 4chan)",
    debugView: "Widok debugowania (z promptami systemu)",
  },
  screenshot: {
    capturing: "Przechwytywanie...",
    capture: "Przechwyć zrzut ekranu",
    failed: "Nie udało się przechwycić zrzutu ekranu",
    failedWithMessage: "Nie udało się przechwycić zrzutu ekranu: {{message}}",
    tryAgain: "Nie udało się przechwycić zrzutu ekranu. Spróbuj ponownie.",
    noMessages:
      "Nie można znaleźć obszaru wiadomości czatu. Upewnij się, że masz wiadomości w czacie.",
    quotaExceeded: "Przekroczono limit miejsca. Zrzut ekranu jest za duży.",
    canvasError:
      "Nie udało się przekonwertować zrzutu ekranu na format obrazu.",
  },
  errors: {
    noResponse:
      "Nie otrzymano odpowiedzi od AI. Żądanie zostało zakończone, ale zwróciło pustą treść. Spróbuj ponownie.",
    noStream:
      "Nie udało się przesłać strumieniowo odpowiedzi: Brak dostępnego czytnika",
    saveFailed: "Nie udało się zapisać edycji",
    branchFailed: "Nie udało się rozgałęzić",
    retryFailed: "Nie udało się ponowić",
    answerFailed: "Nie udało się odpowiedzieć",
    deleteFailed: "Nie udało się usunąć",
  },
  errorTypes: {
    streamError: "Błąd strumienia",
  },
  hooks: {
    stt: {
      "endpoint-not-available": "Punkt końcowy mowy na tekst niedostępny",
      "failed-to-start": "Nie udało się rozpocząć nagrywania",
      "permission-denied":
        "Dostęp do mikrofonu zablokowany. Zezwól na mikrofon w ustawieniach przeglądarki i odśwież stronę.",
      "permission-denied-ios":
        "Mikrofon zablokowany. Przejdź do Ustawienia → Safari → Mikrofon i zezwól na dostęp dla tej strony.",
      "permission-denied-android":
        "Mikrofon zablokowany. Dotknij ikony kłódki na pasku adresu → Ustawienia witryny → Mikrofon → Zezwól.",
      "permission-denied-mac":
        "Mikrofon zablokowany. Otwórz Ustawienia systemowe → Prywatność i ochrona → Mikrofon i włącz przeglądarkę.",
      "permission-denied-windows":
        "Mikrofon zablokowany. Otwórz Ustawienia → Prywatność → Mikrofon i upewnij się, że przeglądarka ma dostęp.",
      "no-microphone":
        "Nie znaleziono mikrofonu. Podłącz mikrofon lub słuchawki z mikrofonem i spróbuj ponownie.",
      "microphone-in-use":
        "Mikrofon jest używany przez inną aplikację. Zamknij ją i spróbuj ponownie.",
      "not-supported":
        "Twoja przeglądarka nie obsługuje dostępu do mikrofonu. Spróbuj Chrome, Firefox lub Safari.",
      "transcription-failed": "Nie udało się transkrybować audio",
      "audio-too-short":
        "Nagranie za krótkie. Trzymaj mikrofon i mów wyraźnie, a następnie spróbuj ponownie.",
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
  models: {
    descriptions: {
      uncensoredLmV11:
        "Niecenzurowany model AI dla kreatywnych i nieograniczonych rozmów",
      freedomgptLiberty:
        "FreedomGPT Liberty - Niecenzurowany model AI skoncentrowany na wolności wypowiedzi i treściach kreatywnych",
      gabAiArya:
        "Gab AI Arya - Niecenzurowany model konwersacyjny AI z wolnością wypowiedzi i kreatywnymi możliwościami",
      gemini31ProPreviewCustomTools:
        "Gemini 3.1 Pro Preview (Custom Tools) - Wariant Gemini 3.1 Pro z ulepszoną selekcją narzędzi dla agentów kodowania i złożonych przepływów wielonarzędziowych",
      gemini31FlashImagePreview:
        "Gemini 3.1 Flash Image Preview - Multimodalny model Google generujący obrazy bezpośrednio z promptów tekstowych przez czat, obsługujący tekst i obraz w tej samej rozmowie",
      gemini31FlashLitePreview:
        "Gemini 3.1 Flash Lite Preview - Wysokowydajny model Google zoptymalizowany dla dużych wolumenów z ulepszeniami w audio, rankingu RAG, tłumaczeniu i uzupełnianiu kodu",
      gemini3Pro:
        "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstowym i potężnymi możliwościami rozumowania",
      gemini3Flash:
        "Google Gemini 3 Flash - Szybki, wydajny multimodalny model AI zoptymalizowany dla szybkich odpowiedzi",
      deepseekV32:
        "DeepSeek V3.2 - Wysokowydajny model rozumowania z zaawansowanymi możliwościami kodowania",
      deepseekV4Pro:
        "DeepSeek V4 Pro - 1,6T parametrów MoE z kontekstem 1M. Do analizy całych baz kodu, złożonego rozumowania i wieloetapowych agentów.",
      deepseekV4Flash:
        "DeepSeek V4 Flash - 284B MoE za grosze. Kontekst 1M, szybka inferecja, solidne kodowanie. Wydajny wybór do zadań wymagających wysokiej przepustowości.",
      gpt55:
        "GPT-5.5 - Frontier model OpenAI dla złożonych profesjonalnych zadań. Silniejsze rozumowanie, wyższa niezawodność, lepsza wydajność tokenów. Kontekst 1M+ z obsługą tekstu i obrazów.",
      gpt55Pro:
        "GPT-5.5 Pro - Najwydajniejszy model OpenAI do głębokiego rozumowania w złożonych, wysokostawkowych zadaniach. Kontekst 1M+, długohoryzontowe rozwiązywanie problemów, agentyczne kodowanie, precyzyjne wykonanie wieloetapowe.",
      gpt54Pro:
        "GPT-5.4 Pro - Najbardziej zaawansowany model OpenAI z ulepszonym rozumowaniem, oknem kontekstu 1M+ i doskonałą wydajnością dla złożonych zadań",
      gpt54:
        "GPT-5.4 - Najnowszy model frontier OpenAI łączący Codex i GPT, z oknem kontekstu 1M+ dla wielokontekstowego rozumowania i kodowania",
      gpt53Codex:
        "GPT-5.3-Codex - Najbardziej zaawansowany model agentyczny OpenAI do kodowania, zoptymalizowany dla długich przepływów z narzędziami i złożonych zadań deweloperskich",
      gpt53Chat:
        "GPT-5.3 Chat - Zaktualizowany model konwersacyjny ChatGPT z dokładniejszymi odpowiedziami i znacznie mniejszą liczbą zbędnych odmów",
      gpt52Pro:
        "GPT-5.2 Pro - Zaawansowany model OpenAI z ulepszonymi możliwościami rozumowania i kodowania",
      gpt52:
        "GPT-5.2 - Wysokowydajny model OpenAI do złożonych zadań i analizy",
      gpt52_chat:
        "GPT-5.2 Chat - Zoptymalizowany model OpenAI dla interakcji konwersacyjnych",
      dolphin3_0_r1_mistral_24b:
        "Dolphin 3.0 R1 Mistral 24B - Niecenzurowany duży model językowy oparty na Mistral",
      dolphinLlama3_70B:
        "Dolphin Llama 3 70B - Niecenzurowany duży model językowy oparty na Llama 3",
      veniceUncensored:
        "Venice Uncensored 1.1 - Najbardziej niecenzurowany model AI z obsługą wywoływania narzędzi. Zaprojektowany dla maksymalnej kreatywnej wolności i autentycznej interakcji. Idealny do otwartej eksploracji, gier fabularnych i niefiltrowanego dialogu z minimalnymi ograniczeniami treści.",
      claudeOpus45:
        "Claude Opus 4.5 - Najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeOpus46:
        "Claude Opus 4.6 - Potężny model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeOpus47:
        "Claude Opus 4.7 - Najnowszy i najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Najpotężniejszy model Sonnet od Anthropic z najwyższą wydajnością w kodowaniu, agentach i pracy profesjonalnej",
      claudeHaiku45:
        "Claude Haiku 4.5 - Szybki i wydajny model Claude zoptymalizowany pod kątem szybkości i opłacalności",
      glm5_1:
        "GLM-5.1 - model kodowania nowej generacji Z.AI stworzony do zadań długoterminowych. Pracuje autonomicznie ponad 8 godzin nad jednym zadaniem - planuje, wykonuje i doskonali się, aż dostarczy wyniki klasy inżynieryjnej.",
      glm5: "GLM-5 - flagowy model open-source Z.AI zaprojektowany do projektowania złożonych systemów i długoterminowych przepływów agentów, dorównujący wiodącym modelom zamkniętym",
      glm5Turbo:
        "GLM-5 Turbo - model nowej generacji Z.AI głęboko zoptymalizowany dla środowisk agentycznych z szybką inferencją, ulepszoną dekompozycją instrukcji i stabilnością długich zadań",
      glm46:
        "GLM-4 6B - Wydajny dwujęzyczny model AI chińsko-angielski z silnymi ogólnymi możliwościami",
      glm47:
        "GLM-4 7B - Zaawansowany dwujęzyczny model chińsko-angielski z ulepszonymi możliwościami rozumowania i kodowania",
      glm47Flash:
        "GLM-4 7B Flash - Ultraszybki model chińsko-angielski zoptymalizowany dla szybkich odpowiedzi",
      kimiK2:
        "Kimi K2 - Potężny chiński model AI z doskonałym zrozumieniem kontekstu",
      kimiK2_5:
        "Kimi K2.5 - Poprzednia generacja modelu Moonshot AI z silnym rozumowaniem w długim kontekście i możliwościami kodowania",
      kimiK2_6:
        "Kimi K2.6 - Model multimodalny nowej generacji Moonshot AI do długoterminowego kodowania, generowania UI/UX z promptów i obrazów oraz orkiestracji wielu agentów z architekturą roju agentów skalującą do setek równoległych podsystemów",
      claudeSonnet45:
        "Claude Sonnet 4.5 - Poprzednia generacja modelu Sonnet od Anthropic z silnymi możliwościami kodowania i analizy",
      claudeAgentSonnet:
        "Claude Agent Sonnet - Autonomiczny agent AI z Claude Sonnet przez Anthropic Agent SDK. Samodzielnie wykonuje narzędzia z wbudowanym rozumowaniem.",
      claudeAgentHaiku:
        "Claude Agent Haiku - Szybki autonomiczny agent AI z Claude Haiku przez Anthropic Agent SDK. Zoptymalizowany pod kątem szybkości z wykonywaniem narzędzi.",
      claudeAgentOpus:
        "Claude Agent Opus - Najpotężniejszy autonomiczny agent AI z Claude Opus przez Anthropic Agent SDK. Maksymalna inteligencja z wykonywaniem narzędzi.",
      grok4:
        "Grok 4 - Flagowy model rozumowania xAI z możliwościami wizji i wyszukiwania w sieci",
      grok4Fast:
        "Grok 4 Fast - Szybki model xAI z kontekstem 2M tokenów zoptymalizowany dla szybkich odpowiedzi",
      grok43:
        "Grok 4.3 - Model rozumowania xAI z kontekstem 1M tokenów, wysoką dokładnością faktograficzną i stałym trybem rozumowania dla agentycznych przepływów pracy i głębokich badań",
      grok420Beta:
        "Grok 4.20 (Legacy) - Poprzedni flagowy model xAI z agentycznym wywoływaniem narzędzi, niskim wskaźnikiem halucynacji i kontekstem 2M tokenów",
      gpt5Pro:
        "GPT-5 Pro - Premium model OpenAI z najwyższym poziomem rozumowania i zaawansowanymi możliwościami kodowania",
      gpt5Codex:
        "GPT-5 Codex - Wyspecjalizowany model kodowania OpenAI z wyjątkowymi możliwościami programistycznymi i technicznymi",
      gpt51Codex:
        "GPT 5.1 Codex - Zaktualizowany model kodowania OpenAI z ulepszonymi możliwościami kreatywnymi i programistycznymi",
      gpt51:
        "GPT 5.1 - Wydajny model ogólnego przeznaczenia OpenAI z silnym rozumowaniem i analizą",
      gpt5: "GPT-5 - Flagowy model OpenAI z szeroką inteligencją i wszechstronnymi możliwościami",
      gpt54Mini:
        "GPT-5.4 Mini - Wydajny wariant GPT-5.4 OpenAI zoptymalizowany dla dużej przepustowości z silnym rozumowaniem, kodowaniem i użyciem narzędzi przy niższym koszcie",
      gpt54Nano:
        "GPT-5.4 Nano - Najlżejszy i najbardziej ekonomiczny model OpenAI zoptymalizowany dla krytycznych pod względem szybkości zadań takich jak klasyfikacja, ekstrakcja danych i wykonywanie sub-agentów",
      gpt5Mini: "GPT-5 Mini - Lekki szybki model OpenAI do codziennych zadań",
      gpt5Nano:
        "GPT-5 Nano - Najmniejszy i najbardziej przystępny cenowo model OpenAI do prostych rozmów",
      gptOss120b:
        "GPT-OSS 120B - Model open-source OpenAI z 120B parametrami z silnymi możliwościami kodowania",
      kimiK2Thinking:
        "Kimi K2 Thinking - Model Kimi skoncentrowany na rozumowaniu z ulepszoną analizą krok po kroku",
      minimaxM27:
        "MiniMax M2.7 - Agentyczny model nowej generacji MiniMax przeznaczony do autonomicznej produktywności, współpracy wielu agentów i przepływów produkcyjnych w tym debugowania kodu, modelowania finansowego i generowania dokumentów",
      mimoV2Pro:
        "MiMo V2 Pro - Flagowy model Xiaomi z 1T+ parametrami i kontekstem 1M, głęboko zoptymalizowany do orkiestracji agentów, automatyzacji złożonych przepływów i zadań inżynieryjnych",
      glm45Air:
        "GLM 4.5 AIR - Ultraszybki lekki model Z.AI do szybkich interakcji konwersacyjnych",
      glm45v:
        "GLM 4.5v - Model wizyjny Z.AI z rozumieniem obrazów i możliwościami czatu",
      geminiFlash25Lite:
        "Gemini 2.5 Flash Lite - Podstawowy model Gemini Google z dużym kontekstem i szybkimi odpowiedziami",
      geminiFlash25Flash:
        "Gemini 2.5 Flash - Wydajny multimodalny model Google z kontekstem 1M tokenów dla szybkich zadań",
      geminiFlash25Pro:
        "Gemini 2.5 Flash Pro - Poprzedni model Pro Google z dużym kontekstem i silnym rozumowaniem",
      deepseekV31:
        "DeepSeek V3.1 - Poprzednia generacja modelu DeepSeek z silnymi możliwościami kodowania i analizy",
      deepseekR1:
        "DeepSeek R1 - Model DeepSeek skoncentrowany na rozumowaniu z zaawansowanym rozwiązywaniem problemów krok po kroku",
      qwen3235bFree:
        "Qwen3 235B - Duży otwarty model Alibaby z 235B parametrami do złożonych zadań kodowania i rozumowania",
      deepseekR1Distill:
        "DeepSeek R1 Distill - Kompaktowa zdestylowana wersja DeepSeek R1 z wydajnymi możliwościami rozumowania",
      qwen257b:
        "Qwen 2.5 7B - Kompaktowy model 7B Alibaby do szybkich i niedrogich zadań konwersacyjnych",
      dallE3:
        "DALL-E 3 - Model generowania obrazów OpenAI tworzący wysokiej jakości, szczegółowe obrazy z opisów tekstowych",
      gptImage1:
        "GPT-Image-1 - Szybki i przystępny cenowo model generowania obrazów OpenAI",
      fluxSchnell:
        "Flux Schnell - Szybki model generowania obrazów Black Forest Labs, zoptymalizowany pod kątem szybkości",
      fluxPro:
        "Flux Pro 1.1 - Profesjonalny model generowania obrazów Black Forest Labs z doskonałą jakością",
      flux2Max:
        "FLUX.2 Max - Flagowy model obrazów Black Forest Labs z najwyższą jakością obrazu, rozumieniem promptów i spójnością edycji",
      flux2Klein4b:
        "FLUX.2 Klein 4B - Najszybszy i najbardziej opłacalny model obrazów Black Forest Labs, zoptymalizowany pod kątem wysokiej przepustowości",
      riverflowV2Pro:
        "Riverflow V2 Pro - Najpotężniejszy model generowania obrazów Sourceful z najlepszą kontrolą i perfekcyjnym renderowaniem tekstu",
      riverflowV2Fast:
        "Riverflow V2 Fast - Najszybszy model generowania obrazów Sourceful, zoptymalizowany pod kątem wdrożeń produkcyjnych i przepływów wrażliwych na opóźnienia",
      riverflowV2MaxPreview:
        "Riverflow V2 Max Preview - Najpotężniejszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image",
      riverflowV2StandardPreview:
        "Riverflow V2 Standard Preview - Standardowy wariant podglądu Sourceful z ulepszoną wydajnością względem rodziny Riverflow 1",
      riverflowV2FastPreview:
        "Riverflow V2 Fast Preview - Najszybszy wariant podglądu Sourceful, zunifikowany model text-to-image i image-to-image w najniższej cenie",
      flux2Flex:
        "FLUX.2 Flex - Model obrazów Black Forest Labs doskonały w renderowaniu złożonego tekstu, typografii i edycji wielu referencji w jednolitej architekturze",
      flux2Pro:
        "FLUX.2 Pro - Zaawansowany model generowania i edycji obrazów Black Forest Labs z wysoką jakością wizualną, silną zgodnością z promptem i spójną reprodukcją postaci",
      gemini3ProImagePreview:
        "Nano Banana Pro (Gemini 3 Pro Image Preview) - Najbardziej zaawansowany model generowania obrazów Google z ulepszonym rozumowaniem multimodalnym, gruntowaniem w rzeczywistości i wiodącym renderowaniem tekstu",
      gpt5ImageMini:
        "GPT-5 Image Mini - Wydajny multimodalny model generowania obrazów OpenAI łączący możliwości językowe GPT-5 Mini z szybką i przystępną cenowo generacją obrazów",
      gpt5Image:
        "GPT-5 Image - Flagowy multimodalny model OpenAI łączący możliwości językowe GPT-5 z najnowocześniejszym generowaniem i edytowaniem obrazów",
      gpt54Image2:
        "GPT-5.4 Image 2 - Multimodalny model nowej generacji OpenAI łączący rozumowanie GPT-5.4 z generowaniem GPT Image 2. Płynnie przechodzi między kodowaniem, analizą i tworzeniem wizualnym w jednej rozmowie.",
      seedream45:
        "Seedream 4.5 - Najnowszy model generowania obrazów ByteDance z kompleksowymi ulepszeniami spójności edycji, retuszu portretów i kompozycji wielu obrazów",
      sdxl: "Stable Diffusion XL - Wysokiej jakości otwarty model generowania obrazów Stability AI",
      musicgenStereo:
        "MusicGen Stereo - Open-source'owy stereofoniczny model generowania muzyki Meta via Replicate",
      stableAudio:
        "Stable Audio - Model generowania muzyki i dźwięku Stability AI dla wysokiej jakości klipów",
      udioV2:
        "Udio v2 - Wysokiej jakości generowanie muzyki AI z wokalem i pełną jakością produkcji",
      modelsLabMusicGen:
        "ModelsLab Music Gen - Generowanie muzyki AI z opisów tekstowych, obsługuje MP3/WAV/FLAC",
      modelsLabElevenlabsMusic:
        "ElevenLabs Music - Wysokiej jakości generowanie muzyki z ElevenLabs przez ModelsLab",
      modelsLabSonautoSong:
        "Sonauto Song - Pełne generowanie piosenek z wokalem, różne gatunki do 4:45 min",
      modelsLabLyria3:
        "Lyria 3 - Zaawansowany model Google do generowania oryginalnych 30-sekundowych utworów z tekstu",
      modelsLabCogVideoX:
        "CogVideoX - Model tekst-na-wideo ModelsLab do generowania krótkich klipów",
      modelsLabWanx: "Wanx - Model generowania wideo z tekstu ModelsLab",
      modelsLabWan22:
        "Wan 2.2 Ultra - Wysokiej jakości model tekst-na-wideo ModelsLab",
      modelsLabWan21:
        "Wan 2.1 Ultra - Model tekst-na-wideo ModelsLab z ulepszoną jakością",
      modelsLabWan25T2V: "Wan 2.5 T2V - Model tekst-na-wideo Wan 2.5 ModelsLab",
      modelsLabWan25I2V: "Wan 2.5 I2V - Model obraz-na-wideo Wan 2.5 ModelsLab",
      modelsLabWan27T2V:
        "Wan 2.7 T2V - Najnowszy model tekst-na-wideo Wan 2.7 od Alibaba z elastycznymi proporcjami i wyjściem 1080p",
      modelsLabWan26T2V: "Wan 2.6 T2V - Model tekst-na-wideo Wan 2.6 ModelsLab",
      modelsLabWan26I2V: "Wan 2.6 I2V - Model obraz-na-wideo Wan 2.6 ModelsLab",
      modelsLabWan26I2VFlash:
        "Wan 2.6 I2V Flash - Szybki model obraz-na-wideo Wan 2.6 ModelsLab",
      modelsLabSeedanceT2V: "Seedance T2V - Model tekst-na-wideo BytePlus",
      modelsLabSeedanceI2V: "Seedance I2V - Model obraz-na-wideo BytePlus",
      modelsLabOmnihuman:
        "Omnihuman - Model generowania wideo z ludźmi BytePlus",
      modelsLabSeedance1ProI2V:
        "Seedance 1.0 Pro I2V - Profesjonalny model obraz-na-wideo BytePlus",
      modelsLabSeedance1ProFastI2V:
        "Seedance 1.0 Pro Fast I2V - Szybki profesjonalny model obraz-na-wideo BytePlus",
      modelsLabSeedance1ProFastT2V:
        "Seedance 1.0 Pro Fast T2V - Szybki profesjonalny model tekst-na-wideo BytePlus",
      modelsLabOmnihuman15:
        "Omnihuman 1.5 - Ulepszony model generowania wideo z ludźmi BytePlus",
      modelsLabSeedance15Pro:
        "Seedance 1.5 Pro - Zaawansowany model generowania wideo BytePlus",
      modelsLabVeo2:
        "Veo 2 - Wysokiej jakości model generowania wideo Google via ModelsLab",
      modelsLabVeo3:
        "Veo 3 - Najnowszy model generowania wideo Google via ModelsLab",
      modelsLabVeo3Fast:
        "Veo 3 Fast - Szybki model generowania wideo Google via ModelsLab",
      modelsLabVeo3FastPreview:
        "Veo 3 Fast Preview - Szybki model generowania wideo preview Google via ModelsLab",
      modelsLabVeo31:
        "Veo 3.1 - Ulepszony model generowania wideo Veo 3 Google via ModelsLab",
      modelsLabVeo31Fast:
        "Veo 3.1 Fast - Szybki model generowania wideo Veo 3.1 Google via ModelsLab",
      modelsLabKlingV21I2V:
        "Kling V2.1 I2V - Model obraz-na-wideo Kling AI wersja 2.1",
      modelsLabKlingV25TurboI2V:
        "Kling V2.5 Turbo I2V - Turbo model obraz-na-wideo Kling AI wersja 2.5",
      modelsLabKlingV25TurboT2V:
        "Kling V2.5 Turbo T2V - Turbo model tekst-na-wideo Kling AI wersja 2.5",
      modelsLabKlingV2MasterT2V:
        "Kling V2 Master T2V - Model tekst-na-wideo najwyższej jakości Kling AI",
      modelsLabKlingV2MasterI2V:
        "Kling V2 Master I2V - Model obraz-na-wideo najwyższej jakości Kling AI",
      modelsLabKlingV21MasterT2V:
        "Kling V2.1 Master T2V - Model tekst-na-wideo najwyższej jakości Kling AI v2.1",
      modelsLabKlingV21MasterI2V:
        "Kling V2.1 Master I2V - Model obraz-na-wideo najwyższej jakości Kling AI v2.1",
      modelsLabKlingV16MultiI2V:
        "Kling V1.6 Multi I2V - Model multi-obraz-na-wideo Kling AI wersja 1.6",
      modelsLabKling30T2V:
        "Kling 3.0 T2V - Model tekst-na-wideo Kling AI wersja 3.0",
      modelsLabLtx2ProT2V:
        "LTX 2 PRO T2V - Profesjonalny model tekst-na-wideo LTX",
      modelsLabLtx2ProI2V:
        "LTX 2 PRO I2V - Profesjonalny model obraz-na-wideo LTX",
      modelsLabLtx23ProI2V:
        "LTX 2.3 Pro I2V - Ulepszony profesjonalny model obraz-na-wideo LTX",
      modelsLabHailuo23T2V:
        "Hailuo 2.3 T2V - Model tekst-na-wideo MiniMax wersja 2.3",
      modelsLabHailuo02T2V: "Hailuo 02 T2V - Model tekst-na-wideo MiniMax 02",
      modelsLabHailuo23I2V:
        "Hailuo 2.3 I2V - Model obraz-na-wideo MiniMax wersja 2.3",
      modelsLabHailuo23FastI2V:
        "Hailuo 2.3 Fast I2V - Szybki model obraz-na-wideo MiniMax wersja 2.3",
      modelsLabHailuo02I2V: "Hailuo 02 I2V - Model obraz-na-wideo MiniMax 02",
      modelsLabHailuo02StartEnd:
        "Hailuo 02 Start/End - Model generowania wideo z klatkami początkowymi/końcowymi MiniMax",
      modelsLabSora2:
        "Sora 2 - Model generowania wideo Sora 2 OpenAI via ModelsLab",
      modelsLabSora2Pro:
        "Sora 2 Pro - Model generowania wideo Sora 2 Pro OpenAI via ModelsLab",
      modelsLabGen4Aleph:
        "Gen4 Aleph - Model generowania wideo Gen4 Aleph Runway via ModelsLab",
      modelsLabLipsync2:
        "Lipsync 2 - Model synchronizacji ust Sync do generowania wideo",
      modelsLabGrokT2V:
        "Grok T2V - Model tekst-na-wideo Grok xAI via ModelsLab",
      modelsLabGrokI2V:
        "Grok I2V - Model obraz-na-wideo Grok xAI via ModelsLab",
      modelsLabGen4T2ITurbo:
        "Gen4 T2I Turbo - Szybki model tekst-na-obraz Runway via ModelsLab",
      modelsLabGen4Image:
        "Gen4 Image - Model tekst-na-obraz Runway Gen4 via ModelsLab",
      modelsLabWan27T2I:
        "Wan 2.7 T2I - Model tekst-na-obraz Alibaba Wan 2.7 via ModelsLab",
      modelsLabGrokT2I:
        "Grok Imagine T2I - Model tekst-na-obraz xAI Grok via ModelsLab",
      modelsLabZImageBase:
        "Z Image Base - Szybki i tani model tekst-na-obraz ModelsLab",
      modelsLabZImageTurbo:
        "Z Image Turbo - Ultraszybki model tekst-na-obraz ModelsLab",
      modelsLabFlux2MaxT2I:
        "Flux 2 Max T2I - Black Forest Labs Flux 2 Max tekst-na-obraz via ModelsLab",
      modelsLabFluxPro11Ultra:
        "Flux Pro 1.1 Ultra - Black Forest Labs Flux Pro Ultra via ModelsLab",
      modelsLabFluxPro11:
        "Flux Pro 1.1 - Black Forest Labs Flux Pro 1.1 tekst-na-obraz via ModelsLab",
      modelsLabFlux2ProT2I:
        "Flux 2 Pro T2I - Black Forest Labs Flux 2 Pro tekst-na-obraz via ModelsLab",
      modelsLabFlux2DevT2I:
        "Flux 2 Dev T2I - Black Forest Labs Flux 2 Dev tekst-na-obraz via ModelsLab",
      modelsLabFluxT2I:
        "Flux T2I - Black Forest Labs Flux tekst-na-obraz via ModelsLab",
      modelsLabSeedream45T2I:
        "Seedream 4.5 T2I - ByteDance Seedream 4.5 tekst-na-obraz via ModelsLab",
      modelsLabSeedream40T2I:
        "Seedream 4.0 T2I - ByteDance Seedream 4.0 tekst-na-obraz via ModelsLab",
      modelsLabSeedreamT2I:
        "Seedream T2I - ByteDance Seedream tekst-na-obraz via ModelsLab",
      modelsLabImagen4Ultra:
        "Imagen 4 Ultra - Najwyższa jakość generowania obrazów Google via ModelsLab",
      modelsLabImagen4:
        "Imagen 4 - Google Imagen 4 tekst-na-obraz via ModelsLab",
      modelsLabImagen4Fast:
        "Imagen 4 Fast - Szybki Google Imagen 4 tekst-na-obraz via ModelsLab",
      modelsLabImagen3:
        "Imagen 3 - Google Imagen 3 tekst-na-obraz via ModelsLab",
      modelsLabNanoBananaPro:
        "Nano Banana Pro - Wysokiej jakości generowanie obrazów via ModelsLab",
      modelsLabNanoBanana: "Nano Banana - Generowanie obrazów via ModelsLab",
      modelsLabQwenT2I: "Qwen T2I - Alibaba Qwen tekst-na-obraz via ModelsLab",
      modelsLabRealtimeT2I:
        "Realtime T2I - Ultraszybki model tekst-na-obraz ModelsLab w czasie rzeczywistym",
    },
  },
  modelUtilities: {
    adultExplicit: "Treści dla dorosłych/Jednoznaczne",
    adultImplied: "Treści dla dorosłych/Sugerowane",
    analysis: "Analiza",
    chat: "Czat",
    coding: "Programowanie",
    conspiracy: "Teorie spiskowe",
    controversial: "Kontrowersyjne tematy",
    creative: "Twórcze pisanie",
    fast: "Szybki",
    harmful: "Potencjalnie szkodliwe treści",
    illegalInfo: "Nielegalne informacje",
    imageGen: "Generowanie obrazów",
    legacy: "Przestarzały",
    medicalAdvice: "Porady medyczne",
    offensiveLanguage: "Obraźliwy język",
    politicalLeft: "Lewicowe poglądy polityczne",
    politicalRight: "Prawicowe poglądy polityczne",
    reasoning: "Zaawansowane rozumowanie",
    roleplay: "Odgrywanie ról",
    roleplayDark: "Mroczne odgrywanie ról",
    smart: "Inteligentny",
    uncensored: "Niecenzurowany",
    violence: "Przemoc",
    vision: "Przetwarzanie obrazu",
  },
  input: {
    attachments: {
      uploadFile: "Załącz pliki",
      attachedFiles: "Załączone pliki",
      addMore: "Dodaj więcej",
    },
  },
};
