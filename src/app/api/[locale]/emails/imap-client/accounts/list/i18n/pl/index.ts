import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista kont IMAP",
  description: "Pobierz paginowaną listę kont IMAP z filtrowaniem",
  container: {
    title: "Lista kont IMAP",
    description: "Skonfiguruj parametry listy kont IMAP i wyświetl wyniki",
  },
  fields: {
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
      description: "Szukaj kont po nazwie lub e-mailu",
      placeholder: "Szukaj kont...",
    },
    status: {
      label: "Status",
      description: "Filtruj po statusie konta",
      placeholder: "Wybierz status",
    },
    enabled: {
      label: "Włączony",
      description: "Filtruj po statusie aktywacji",
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
  },
  response: {
    accounts: {
      title: "Konta IMAP",
      emptyState: {
        title: "Nie znaleziono kont",
        description: "Brak kont IMAP pasujących do bieżących filtrów",
      },
      item: {
        title: "Konto IMAP",
        description: "Szczegóły konta IMAP",
        id: "ID",
        name: "Nazwa",
        email: "E-mail",
        host: "Host",
        port: "Port",
        secure: "Bezpieczny",
        username: "Nazwa użytkownika",
        authMethod: "Metoda uwierzytelniania",
        connectionTimeout: "Limit czasu połączenia",
        keepAlive: "Utrzymuj połączenie",
        enabled: "Włączony",
        syncInterval: "Interwał synchronizacji",
        maxMessages: "Maks. wiadomości",
        syncFolders: "Foldery synchronizacji",
        lastSyncAt: "Ostatnia synchronizacja",
        syncStatus: "Status synchronizacji",
        syncError: "Błąd synchronizacji",
        isConnected: "Jest połączony",
        createdAt: "Utworzono o",
        updatedAt: "Zaktualizowano o",
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
    description: "Konta IMAP pobrane pomyślnie",
  },
};
