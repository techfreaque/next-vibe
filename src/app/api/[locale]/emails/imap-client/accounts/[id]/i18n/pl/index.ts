import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz konto IMAP",
    description: "Pobierz określone konto IMAP według ID",
    container: {
      title: "Szczegóły konta IMAP",
      description: "Wyświetl i zarządzaj informacjami o koncie IMAP",
    },
    id: {
      label: "ID konta",
      description: "Unikalny identyfikator konta IMAP",
    },
    response: {
      account: {
        title: "Informacje o koncie IMAP",
        description: "Szczegółowe informacje o koncie IMAP",
        id: "ID konta",
        name: "Nazwa konta",
        email: "Adres e-mail",
        host: "Host serwera IMAP",
        port: "Port serwera IMAP",
        secure: "Bezpieczne połączenie",
        username: "Nazwa użytkownika",
        authMethod: "Metoda uwierzytelniania",
        connectionTimeout: "Limit czasu połączenia (ms)",
        keepAlive: "Utrzymuj połączenie",
        enabled: "Konto włączone",
        syncInterval: "Interwał synchronizacji (sekundy)",
        maxMessages: "Maksymalna liczba wiadomości",
        syncFolders: "Synchronizowane foldery",
        lastSyncAt: "Ostatnia synchronizacja",
        syncStatus: "Status synchronizacji",
        syncError: "Błąd synchronizacji",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe ID konta",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do dostępu do tego konta",
      },
      notFound: {
        title: "Konto nie znalezione",
        description: "Żądane konto IMAP nie zostało znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Błąd konfliktu",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieciowy",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Konto IMAP zostało pomyślnie pobrane",
    },
  },
  post: {
    title: "Aktualizuj konto IMAP",
    description: "Aktualizuj istniejące konto IMAP",
    form: {
      title: "Aktualizuj konfigurację konta",
      description: "Skonfiguruj parametry konta IMAP",
      name: {
        label: "Nazwa konta",
        description: "Nazwa wyświetlana dla konta IMAP",
      },
      email: {
        label: "Adres e-mail",
        description: "Adres e-mail dla konta IMAP",
      },
      host: {
        label: "Host serwera IMAP",
        description: "Nazwa hosta lub adres IP serwera IMAP",
      },
      port: {
        label: "Port serwera IMAP",
        description: "Numer portu serwera IMAP (zwykle 143 lub 993)",
      },
      secure: {
        label: "Użyj bezpiecznego połączenia",
        description: "Włącz szyfrowanie SSL/TLS dla połączenia",
      },
      username: {
        label: "Nazwa użytkownika",
        description: "Nazwa użytkownika do uwierzytelniania IMAP",
      },
      password: {
        label: "Hasło",
        description: "Hasło do uwierzytelniania IMAP",
      },
      authMethod: {
        label: "Metoda uwierzytelniania",
        description: "Metoda używana do uwierzytelniania IMAP",
      },
      enabled: {
        label: "Konto włączone",
        description: "Włącz lub wyłącz to konto IMAP",
      },
      connectionTimeout: {
        label: "Limit czasu połączenia",
        description: "Limit czasu połączenia w milisekundach",
      },
      keepAlive: {
        label: "Utrzymuj połączenie",
        description: "Utrzymuj połączenie między żądaniami",
      },
      syncInterval: {
        label: "Interwał synchronizacji",
        description: "Interwał synchronizacji w sekundach",
      },
      maxMessages: {
        label: "Maksymalna liczba wiadomości",
        description: "Maksymalna liczba wiadomości do synchronizacji",
      },
      syncFolders: {
        label: "Synchronizowane foldery",
        description: "Foldery do synchronizacji (oddzielone przecinkami)",
      },
    },
    response: {
      title: "Zaktualizowane konto",
      description: "Dane odpowiedzi konta IMAP",
      account: {
        id: "ID konta",
        name: "Nazwa konta",
        email: "Adres e-mail",
        host: "Host serwera IMAP",
        port: "Port serwera IMAP",
        secure: "Bezpieczne połączenie",
        username: "Nazwa użytkownika",
        authMethod: "Metoda uwierzytelniania",
        enabled: "Konto włączone",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
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
        description: "Wystąpił błąd sieciowy",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  delete: {
    title: "Usuń konto IMAP",
    description: "Usuń istniejące konto IMAP",
    container: {
      title: "Usuń konto",
      description: "Trwale usuń to konto IMAP",
    },
    response: {
      message: "Konto zostało pomyślnie usunięte",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
      },
      notFound: {
        title: "Konto nie znalezione",
        description: "Konto IMAP nie zostało znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      conflict: {
        title: "Konflikt",
        description: "Nie można usunąć konta z aktywnymi połączeniami",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas usuwania konta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas usuwania",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Nie można usunąć konta z niezapisanymi zmianami",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowy ID konta",
      },
    },
    success: {
      title: "Sukces",
      description: "Konto zostało pomyślnie usunięte",
    },
  },
  widget: {
    put: {
      title: "Edytuj konto IMAP",
      basicInfo: "Informacje podstawowe",
      server: "Połączenie z serwerem",
      auth: "Uwierzytelnianie",
      sync: "Konfiguracja synchronizacji",
    },
  },
};
