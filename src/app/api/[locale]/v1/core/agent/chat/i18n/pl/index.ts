import { translations as aiStreamTranslations } from "../../ai-stream/i18n/pl";
import { translations as creditsTranslations } from "../../credits/i18n/pl";
import { translations as foldersTranslations } from "../../folders/i18n/pl";
import { translations as personasTranslations } from "../../personas/i18n/pl";
import { translations as messagesTranslations } from "../../threads/[threadId]/messages/i18n/pl";
import { translations as threadsTranslations } from "../../threads/i18n/pl";
import { translations as braveSearchTranslations } from "../../tools/brave-search/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    threads: "Wątki",
    folders: "Foldery",
    messages: "Wiadomości",
    personas: "Persony",
    credits: "Kredyty",
    balance: "Saldo",
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
  personas: personasTranslations,
  threads: {
    ...threadsTranslations,
    messages: messagesTranslations,
  },
  tools: {
    braveSearch: braveSearchTranslations,
  },
};
