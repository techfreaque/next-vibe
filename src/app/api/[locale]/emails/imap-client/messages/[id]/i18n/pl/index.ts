import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Shared translation keys
  tag: "Wiadomość IMAP",

  // GET endpoint translations
  get: {
    title: "Pobierz wiadomość IMAP",
    description: "Pobierz szczegóły wiadomości IMAP według ID",
    container: {
      title: "Szczegóły wiadomości",
      description: "Informacje o indywidualnej wiadomości IMAP",
    },
    id: {
      label: "ID wiadomości",
      description: "Unikalny identyfikator wiadomości IMAP",
      placeholder: "Wprowadź UUID wiadomości",
    },
    response: {
      title: "Odpowiedź wiadomości",
      description: "Szczegóły wiadomości IMAP i metadane",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID wiadomości lub parametry żądania",
      },
      notFound: {
        title: "Wiadomość nie znaleziona",
        description: "Żądana wiadomość IMAP nie została znaleziona",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do dostępu do wiadomości IMAP",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tej wiadomości IMAP",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas pobierania wiadomości",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieznany błąd podczas pobierania wiadomości",
      },
      conflict: {
        title: "Błąd konfliktu",
        description:
          "Pobieranie wiadomości jest w konflikcie z istniejącymi danymi",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas pobierania wiadomości",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które muszą zostać najpierw zapisane",
      },
    },
    success: {
      title: "Wiadomość pobrana",
      description: "Wiadomość IMAP została pomyślnie pobrana",
    },
  },

  // PATCH endpoint translations
  patch: {
    title: "Aktualizuj wiadomość IMAP",
    description:
      "Aktualizuj właściwości wiadomości IMAP (status przeczytania, flagi, itp.)",
    container: {
      title: "Aktualizuj wiadomość",
      description: "Zmodyfikuj właściwości wiadomości IMAP",
    },
    id: {
      label: "ID wiadomości",
      description: "Unikalny identyfikator wiadomości IMAP do aktualizacji",
      placeholder: "Wprowadź UUID wiadomości",
    },
    isRead: {
      label: "Status przeczytania",
      description: "Oznacz wiadomość jako przeczytaną lub nieprzeczytaną",
    },
    isFlagged: {
      label: "Status flagi",
      description: "Oznacz wiadomość jako oflagowaną lub nieoflagowaną",
    },
    subject: {
      label: "Temat",
      description: "Aktualizuj temat wiadomości",
      placeholder: "Wprowadź temat wiadomości",
    },
    response: {
      title: "Zaktualizowana wiadomość",
      description: "Zaktualizowane szczegóły wiadomości IMAP",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry aktualizacji lub ID wiadomości",
      },
      notFound: {
        title: "Wiadomość nie znaleziona",
        description: "Wiadomość IMAP do aktualizacji nie została znaleziona",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do aktualizacji wiadomości IMAP",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tej wiadomości IMAP",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas aktualizacji wiadomości",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Nieznany błąd podczas aktualizacji wiadomości",
      },
      conflict: {
        title: "Błąd konfliktu",
        description:
          "Aktualizacja wiadomości jest w konflikcie z istniejącymi danymi",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas aktualizacji wiadomości",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które muszą zostać najpierw zapisane",
      },
    },
    success: {
      title: "Wiadomość zaktualizowana",
      description: "Wiadomość IMAP została pomyślnie zaktualizowana",
    },
  },

  // Legacy POST endpoint translations (keeping for compatibility)
  post: {
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
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
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  widget: {
    title: "Wiadomość IMAP",
    notFound: "Wiadomość nie znaleziona",
    parties: "Strony",
    from: "Od",
    to: "Do",
    timestamps: "Znaczniki czasu",
    sentAt: "Wysłano",
    receivedAt: "Odebrano",
    flagged: "Oznaczona",
    unread: "Nieprzeczytana",
    hasAttachments: "Ma załączniki",
    body: "Treść wiadomości",
  },
};
