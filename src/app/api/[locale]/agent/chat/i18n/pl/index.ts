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
    folders: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      incognito: "Incognito",
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
        "Google Gemini 3 Pro - Zaawansowany multimodalny model AI z dużym oknem kontekstowym",
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
        "Venice Uncensored - Niecenzurowany model AI dla nieograniczonych rozmów",
      claudeOpus45:
        "Claude Opus 4.5 - Najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeOpus46:
        "Claude Opus 4.6 - Najnowszy i najpotężniejszy model Claude z wyjątkowymi możliwościami rozumowania i kreatywnymi",
      claudeHaiku45:
        "Claude Haiku 4.5 - Szybki i wydajny model Claude zoptymalizowany pod kątem szybkości i opłacalności",
    },
  },
  modelUtilities: {
    adultExplicit: "Treści dla dorosłych/Jednoznaczne",
    adultImplied: "Treści dla dorosłych/Sugerowane",
    conspiracy: "Teorie spiskowe",
    harmful: "Potencjalnie szkodliwe treści",
    illegalInfo: "Nielegalne informacje",
    medicalAdvice: "Porady medyczne",
    offensiveLanguage: "Obraźliwy język",
    politicalLeft: "Lewicowe poglądy polityczne",
    politicalRight: "Prawicowe poglądy polityczne",
    reasoning: "Zaawansowane rozumowanie",
    roleplay: "Odgrywanie ról",
    roleplayDark: "Mroczne odgrywanie ról",
    violence: "Przemoc",
  },
  input: {
    attachments: {
      uploadFile: "Załącz pliki",
      attachedFiles: "Załączone pliki",
      addMore: "Dodaj więcej",
    },
  },
};
