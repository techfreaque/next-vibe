import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Lista Wiadomości",
  get: {
    title: "Lista wiadomości IMAP",
    description:
      "Pobierz podzieloną na strony listę wiadomości IMAP z filtrowaniem i sortowaniem",
    container: {
      title: "Zapytanie wiadomości",
      description: "Skonfiguruj parametry listowania wiadomości",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginacji",
    },
    limit: {
      label: "Limit",
      description: "Liczba wiadomości na stronę",
    },
    accountId: {
      label: "ID konta",
      description: "Identyfikator konta IMAP",
      placeholder: "Wybierz konto IMAP",
    },
    folderId: {
      label: "ID folderu",
      description: "Identyfikator folderu IMAP (opcjonalny)",
      placeholder: "Wybierz folder",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj wiadomości według tematu, nadawcy lub treści",
      placeholder: "Wprowadź wyszukiwane terminy...",
    },
    status: {
      label: "Status",
      description: "Filtruj wiadomości według statusu",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole do sortowania wiadomości",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kierunek sortowania (rosnąco lub malejąco)",
    },
    dateFrom: {
      label: "Data od",
      description: "Filtruj wiadomości od tej daty",
    },
    dateTo: {
      label: "Data do",
      description: "Filtruj wiadomości do tej daty",
    },
    response: {
      message: {
        title: "Wiadomość",
        description: "Szczegóły wiadomości IMAP",
        id: "ID wiadomości",
        subject: "Temat",
        senderEmail: "E-mail nadawcy",
        senderName: "Nazwa nadawcy",
        isRead: "Status przeczytania",
        isFlagged: "Status oflagowania",
        hasAttachments: "Ma załączniki",
        sentAt: "Wysłano o",
        headers: "Nagłówki e-mail",
      },
      total: "Łączna liczba wiadomości",
      page: "Bieżąca strona",
      limit: "Limit strony",
      totalPages: "Łączna liczba stron",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry listy wiadomości",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do listowania wiadomości",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do wiadomości jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Wiadomości lub konto nie zostało znalezione",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Żądanie listy wiadomości jest w konflikcie z istniejącymi danymi",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas listowania wiadomości",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas listowania wiadomości",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany na liście wiadomości",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas listowania wiadomości",
      },
    },
    success: {
      title: "Wiadomości zostały pomyślnie wylistowane",
      description: "Wiadomości zostały pomyślnie pobrane",
    },
  },
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
};
