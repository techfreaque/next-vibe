import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista e-maili",
  description: "Pobierz paginowaną listę e-maili z filtrowaniem i paginacją",
  container: {
    title: "Lista e-maili",
    description: "Skonfiguruj parametry listy e-maili i wyświetl wyniki",
  },
  filters: {
    title: "Filtry",
    description: "Filtruj i wyszukuj e-maile",
  },
  displayOptions: {
    title: "Opcje wyświetlania",
  },
  fields: {
    dateRange: {
      title: "Zakres dat",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginacji",
      placeholder: "Wprowadź numer strony",
    },
    limit: {
      label: "Limit",
      description: "Liczba elementów na stronę",
      placeholder: "Wprowadź limit",
    },
    search: {
      label: "Szukaj",
      description: "Szukaj e-maili po temacie, odbiorcy lub nadawcy",
      placeholder: "Szukaj e-maili...",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie e-maila",
      placeholder: "Wybierz status",
    },
    type: {
      label: "Typ",
      description: "Filtruj po typie e-maila",
      placeholder: "Wybierz typ",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole do sortowania",
      placeholder: "Wybierz pole sortowania",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kierunek sortowania",
      placeholder: "Wybierz kolejność sortowania",
    },
    dateFrom: {
      label: "Data od",
      description: "Filtruj e-maile od tej daty",
      placeholder: "Wybierz datę początkową",
    },
    dateTo: {
      label: "Data do",
      description: "Filtruj e-maile do tej daty",
      placeholder: "Wybierz datę końcową",
    },
  },
  response: {
    emails: {
      title: "E-maile",
      emptyState: {
        title: "Nie znaleziono e-maili",
        description: "Brak e-maili pasujących do bieżących filtrów",
      },
      item: {
        title: "E-mail",
        description: "Szczegóły e-maila",
        id: "ID",
        subject: "Temat",
        recipientEmail: "E-mail odbiorcy",
        recipientName: "Nazwa odbiorcy",
        senderEmail: "E-mail nadawcy",
        senderName: "Nazwa nadawcy",
        type: "Typ",
        status: "Status",
        templateName: "Nazwa szablonu",
        emailProvider: "Dostawca e-maila",
        externalId: "ID zewnętrzne",
        sentAt: "Wysłano o",
        deliveredAt: "Dostarczono o",
        openedAt: "Otwarto o",
        clickedAt: "Kliknięto o",
        retryCount: "Liczba ponownych prób",
        error: "Błąd",
        userId: "ID użytkownika",
        leadId: "ID potencjalnego klienta",
        createdAt: "Utworzono o",
        updatedAt: "Zaktualizowano o",
        emailCore: {
          title: "Podstawowe informacje",
        },
        emailParties: {
          title: "Nadawca i odbiorca",
        },
        emailMetadata: {
          title: "Metadane",
        },
        emailEngagement: {
          title: "Śledzenie zaangażowania",
        },
        technicalDetails: {
          title: "Szczegóły techniczne",
        },
        associatedIds: {
          title: "Powiązane ID",
        },
        timestamps: {
          title: "Znaczniki czasu",
        },
      },
    },
    pagination: {
      title: "Paginacja",
      description: "Informacje o paginacji",
      page: "Bieżąca strona",
      limit: "Elementów na stronę",
      total: "Całkowita liczba elementów",
      totalPages: "Całkowita liczba stron",
    },
    filters: {
      title: "Zastosowane filtry",
      description: "Aktualnie zastosowane filtry",
      status: "Filtr statusu",
      type: "Filtr typu",
      search: "Zapytanie wyszukiwania",
      dateFrom: "Data początkowa",
      dateTo: "Data końcowa",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podane parametry są nieprawidłowe",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Musisz być uwierzytelniony, aby uzyskać dostęp do tego zasobu",
    },
    forbidden: {
      title: "Zabronione",
      description: "Nie masz uprawnień do dostępu do tego zasobu",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Żądanie jest w konflikcie z bieżącym stanem",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci",
    },
  },
  success: {
    title: "Sukces",
    description: "E-maile pobrane pomyślnie",
  },
};
