import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Podstawowy strumień",
    description:
      "Strumieniuj wiadomości progresywnie z możliwością dostosowania parametrów",
    form: {
      title: "Konfiguracja strumienia",
      description: "Skonfiguruj parametry strumienia",
    },
    count: {
      label: "Liczba wiadomości",
      description: "Liczba wiadomości do przesłania strumieniowo (1-100)",
    },
    delay: {
      label: "Opóźnienie (ms)",
      description: "Opóźnienie między wiadomościami w milisekundach (100-5000)",
    },
    prefix: {
      label: "Prefiks wiadomości",
      description: "Prefiks dla każdej wiadomości",
    },
    includeTimestamp: {
      label: "Dołącz znacznik czasu",
      description: "Dodaj znacznik czasu do każdej wiadomości",
    },
    includeCounter: {
      label: "Dołącz licznik",
      description: "Dodaj licznik do każdej wiadomości",
    },
    response: {
      title: "Odpowiedź strumieniowa",
      description: "Metadane odpowiedzi strumieniowej",
      success: "Strumień zakończony pomyślnie",
      totalMessages: "Łączna liczba wysłanych wiadomości",
      duration: "Czas trwania strumienia (ms)",
      completed: "Status zakończenia strumienia",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do strumieniowania",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas strumieniowania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do strumieniowania jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono punktu końcowego strumieniowania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas strumieniowania",
      },
    },
    success: {
      title: "Sukces",
      description: "Strumień zakończony pomyślnie",
    },
  },
  streamingErrors: {
    basicStream: {
      error: {
        processing: "Błąd przetwarzania strumienia",
        initialization: "Nie udało się zainicjować strumienia",
      },
    },
  },
};
