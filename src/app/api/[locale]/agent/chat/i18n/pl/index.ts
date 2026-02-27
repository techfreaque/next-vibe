import { translations as creditsTranslations } from "../../../../credits/i18n/pl";
import { translations as aiStreamTranslations } from "../../../ai-stream/i18n/pl";
import { translations as fetchUrlContentTranslations } from "../../../fetch-url-content/i18n/pl";
import { translations as postaćsTranslations } from "../../characters/i18n/pl";
import { translations as favoritesTranslations } from "../../favorites/i18n/pl";
import { translations as filesTranslations } from "../../files/[threadId]/[filename]/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as memoriesTranslations } from "../../memories/i18n/pl";
import { translations as settingsTranslations } from "../../settings/i18n/pl";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/pl";
import { translations as threadsTranslations } from "../../threads/i18n/pl";
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
      cron: "Cron",
    },
    foldersShort: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      incognito: "Incognito",
      cron: "Cron",
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
          "Twoja platforma AI zorientowana na prywatność z ponad 40 modelami, kontrolą treści przez użytkownika i zasadami wolności słowa.",
        subtitle: "Zrób szybką wycieczkę, aby zacząć.",
      },
      aiCompanion: {
        title: "Wybierz swojego towarzysza AI",
        description:
          "Wybieraj spośród ponad 40 modeli AI, w tym głównonurtowych, open-source i bez cenzury.",
        tip: "Kliknij, aby otworzyć selektor modeli i wybrać towarzysza.",
      },
      rootFolders: {
        title: "Twoje foldery czatów",
        description:
          "Organizuj swoje czaty w różnych folderach, każdy z unikalnymi ustawieniami prywatności:",
        private: {
          name: "Prywatny",
          suffix: "— zaszyfrowany, tylko Ty możesz zobaczyć",
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
          "Twoje prywatne czaty są zaszyfrowane i widoczne tylko dla Ciebie. Idealne do wrażliwych tematów.",
      },
      incognitoFolder: {
        name: "Incognito",
        suffix: "Folder",
        description:
          "Rozmawiaj bez zapisywania historii. Po zamknięciu sesji wszystkie wiadomości znikają.",
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
        tip: "Możesz też użyć skrótu klawiszowego Ctrl+K, aby szybko rozpocząć nowy czat.",
      },
      sidebarLogin: {
        title: "Zaloguj się, aby odblokować więcej",
        description:
          "Utwórz darmowe konto, aby uzyskać dostęp do folderów prywatnych i udostępnionych, synchronizować między urządzeniami i zapisywać historię rozmów.",
        tip: "Rejestracja jest bezpłatna! Otrzymujesz 100 darmowych kredytów na start.",
      },
      subscriptionButton: {
        title: "Kredyty i subskrypcja",
        description:
          "Otrzymuj {{credits}} kredytów/miesiąc z subskrypcją Pro za jedyne {{price}}.",
        price: "9,99 zł",
        tip: "Kredyty są używane do interakcji z modelami AI. Bezpłatni użytkownicy otrzymują ograniczone miesięczne kredyty.",
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
          "Twój prywatny folder jest teraz dostępny. Wszystkie czaty są zaszyfrowane i widoczne tylko dla Ciebie.",
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
    switchCharacter: "Zmień postać",
    editCharacter: "Edytuj postać",
    delete: "Usuń",
    autoSelectedModel: "AUTO-WYBRANE",
    manualSelectedModel: "WYBRANE RĘCZNIE",
    intelligence: "Inteligencja",
    contentFilter: "Treść",
    maxPrice: "Maksymalna cena",
    modelSelection: "Wybór modelu",
    autoModeDescription:
      "Najlepszy model jest wybierany na podstawie Twoich filtrów",
    manualModeDescription: "Wybierz konkretny model ręcznie",
    autoMode: "Auto",
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
    searchCharacters: "Szukaj person...",
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
      "permission-denied": "Odmowa dostępu do mikrofonu",
      "no-microphone": "Nie znaleziono mikrofonu",
      "microphone-in-use": "Mikrofon jest w użyciu",
      "transcription-failed": "Nie udało się transkrybować audio",
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
  aiStream: aiStreamTranslations,
  credits: creditsTranslations,
  files: filesTranslations,
  folders: foldersTranslations,
  memories: memoriesTranslations,
  characters: postaćsTranslations,
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
        "Niecenzurowany model AI dla kreatywnych i nieograniczonych rozmów",
      freedomgptLiberty:
        "FreedomGPT Liberty - Niecenzurowany model AI skoncentrowany na wolności wypowiedzi i treściach kreatywnych",
      gabAiArya:
        "Gab AI Arya - Niecenzurowany model konwersacyjny AI z wolnością wypowiedzi i kreatywnymi możliwościami",
      gemini3Pro:
        "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstowym i potężnymi możliwościami rozumowania",
      gemini3Flash:
        "Google Gemini 3 Flash - Szybki, wydajny multimodalny model AI zoptymalizowany dla szybkich odpowiedzi",
      deepseekV32:
        "DeepSeek V3.2 - Wysokowydajny model rozumowania z zaawansowanymi możliwościami kodowania",
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
        "Claude Opus 4.6 - Najnowszy i najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeSonnet46:
        "Claude Sonnet 4.6 - Najpotężniejszy model Sonnet od Anthropic z najwyższą wydajnością w kodowaniu, agentach i pracy profesjonalnej",
      claudeHaiku45:
        "Claude Haiku 4.5 - Szybki i wydajny model Claude zoptymalizowany pod kątem szybkości i opłacalności",
      glm5: "GLM-5 - flagowy model open-source Z.AI zaprojektowany do projektowania złożonych systemów i długoterminowych przepływów agentów, dorównujący wiodącym modelom zamkniętym",
      glm46:
        "GLM-4 6B - Wydajny dwujęzyczny model AI chińsko-angielski z silnymi ogólnymi możliwościami",
      glm47:
        "GLM-4 7B - Zaawansowany dwujęzyczny model chińsko-angielski z ulepszonymi możliwościami rozumowania i kodowania",
      glm47Flash:
        "GLM-4 7B Flash - Ultraszybki model chińsko-angielski zoptymalizowany dla szybkich odpowiedzi",
      kimiK2:
        "Kimi K2 - Potężny chiński model AI z doskonałym zrozumieniem kontekstu",
      kimiK2_5:
        "Kimi K2.5 - Rozszerzony chiński model AI z ulepszonymi możliwościami rozumowania i kreatywnymi",
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
      gpt5Pro:
        "GPT-5 Pro - Premium model OpenAI z najwyższym poziomem rozumowania i zaawansowanymi możliwościami kodowania",
      gpt5Codex:
        "GPT-5 Codex - Wyspecjalizowany model kodowania OpenAI z wyjątkowymi możliwościami programistycznymi i technicznymi",
      gpt51Codex:
        "GPT 5.1 Codex - Zaktualizowany model kodowania OpenAI z ulepszonymi możliwościami kreatywnymi i programistycznymi",
      gpt51:
        "GPT 5.1 - Wydajny model ogólnego przeznaczenia OpenAI z silnym rozumowaniem i analizą",
      gpt5: "GPT-5 - Flagowy model OpenAI z szeroką inteligencją i wszechstronnymi możliwościami",
      gpt5Mini: "GPT-5 Mini - Lekki szybki model OpenAI do codziennych zadań",
      gpt5Nano:
        "GPT-5 Nano - Najmniejszy i najbardziej przystępny cenowo model OpenAI do prostych rozmów",
      gptOss120b:
        "GPT-OSS 120B - Model open-source OpenAI z 120B parametrami z silnymi możliwościami kodowania",
      kimiK2Thinking:
        "Kimi K2 Thinking - Model Kimi skoncentrowany na rozumowaniu z ulepszoną analizą krok po kroku",
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
