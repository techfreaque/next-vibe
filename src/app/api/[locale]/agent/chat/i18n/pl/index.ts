import { translations as creditsTranslations } from "../../../../credits/i18n/pl";
import { translations as aiStreamTranslations } from "../../../ai-stream/i18n/pl";
import { translations as braveSearchTranslations } from "../../../brave-search/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as memoriesTranslations } from "../../memories/i18n/pl";
import { translations as personasTranslations } from "../../personas/i18n/pl";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/pl";
import { translations as threadsTranslations } from "../../threads/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    threads: "Wątki",
    folders: "Foldery",
    messages: "Wiadomości",
    personas: "Persony",
    memories: "Wspomnienia",
    credits: "Kredyty",
    balance: "Saldo",
    permissions: "Uprawnienia",
    hotkey: "Skrót klawiszowy",
    cli: "CLI",
    speech: "Mowa",
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
  common: {
    newChat: "Nowy czat",
    privateChats: "Prywatne czaty",
    search: "Szukaj",
    delete: "Usuń",
    cancel: "Anuluj",
    save: "Zapisz",
    edit: "Edytuj",
    settings: "Ustawienia",
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
    personaSelector: {
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
            placeholder: "Zdefiniuj, jak zachowuje się persona...",
          },
          category: {
            label: "Kategoria",
          },
          suggestedPrompts: {
            label: "Sugerowane prompty (opcjonalne)",
            description:
              "Dodaj do 4 przykładowych promptów, aby pomóc użytkownikom rozpocząć",
            placeholder: "Przykładowy prompt {{number}}",
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
  folders: foldersTranslations,
  memories: memoriesTranslations,
  personas: personasTranslations,
  threads: {
    ...threadsTranslations,
    messages: messagesTranslations,
  },
  tools: {
    braveSearch: braveSearchTranslations,
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
    },
  },
};
