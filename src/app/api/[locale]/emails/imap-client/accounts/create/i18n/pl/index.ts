import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Utwórz konto IMAP",
  description: "Utwórz nowe konto IMAP do zarządzania e-mailami",
  category: "Zarządzanie IMAP",
  tags: {
    create: "Utwórz",
  },
  container: {
    title: "Nowe konto IMAP",
    description: "Skonfiguruj nowe konto IMAP do synchronizacji e-maili",
  },
  name: {
    label: "Nazwa konta",
    description: "Nazwa wyświetlana dla konta IMAP",
    placeholder: "Wprowadź nazwę konta",
  },
  email: {
    label: "Adres e-mail",
    description: "Adres e-mail dla konta IMAP",
    placeholder: "uzytkownik@przykład.pl",
  },
  host: {
    label: "Host serwera IMAP",
    description: "Nazwa hosta lub adres IP serwera IMAP",
    placeholder: "imap.przykład.pl",
  },
  port: {
    label: "Port serwera IMAP",
    description: "Numer portu serwera IMAP (zwykle 143 lub 993)",
    placeholder: "993",
  },
  secure: {
    label: "Użyj bezpiecznego połączenia",
    description: "Włącz szyfrowanie SSL/TLS dla połączenia",
    placeholder: "true",
  },
  username: {
    label: "Nazwa użytkownika",
    description: "Nazwa użytkownika do uwierzytelniania IMAP",
    placeholder: "Wprowadź nazwę użytkownika",
  },
  password: {
    label: "Hasło",
    description: "Hasło do uwierzytelniania IMAP",
    placeholder: "Wprowadź hasło",
  },
  authMethod: {
    label: "Metoda uwierzytelniania",
    description: "Metoda używana do uwierzytelniania IMAP",
    placeholder: "Wybierz metodę uwierzytelniania",
  },
  connectionTimeout: {
    label: "Limit czasu połączenia",
    description: "Limit czasu połączenia w milisekundach",
    placeholder: "30000",
  },
  keepAlive: {
    label: "Utrzymuj połączenie",
    description: "Utrzymuj połączenie między żądaniami",
  },
  enabled: {
    label: "Konto włączone",
    description: "Włącz lub wyłącz to konto IMAP",
  },
  syncInterval: {
    label: "Interwał synchronizacji",
    description: "Interwał synchronizacji w sekundach",
    placeholder: "300",
  },
  maxMessages: {
    label: "Maksymalna liczba wiadomości",
    description: "Maksymalna liczba wiadomości do synchronizacji",
    placeholder: "1000",
  },
  syncFolders: {
    label: "Synchronizowane foldery",
    description: "Foldery do synchronizacji (oddzielone przecinkami)",
    placeholder: "INBOX, Wysłane, Kopie robocze",
  },
  response: {
    title: "Utworzone konto",
    description: "Odpowiedź tworzenia konta IMAP",

    accountSummary: {
      title: "Podsumowanie konta",
      description: "Podstawowe informacje o koncie",
    },

    connectionDetails: {
      title: "Szczegóły połączenia",
      description: "Ustawienia połączenia z serwerem IMAP",
    },

    syncConfiguration: {
      title: "Konfiguracja synchronizacji",
      description: "Ustawienia synchronizacji e-maili",
    },

    id: {
      title: "ID konta",
      label: "ID",
    },
    name: {
      title: "Nazwa konta",
      label: "Nazwa",
    },
    email: {
      title: "Adres e-mail",
      label: "E-mail",
    },
    host: {
      title: "Host serwera IMAP",
      label: "Host",
    },
    port: {
      title: "Port serwera IMAP",
      label: "Port",
    },
    secure: {
      title: "Bezpieczne połączenie",
      label: "Bezpieczne",
    },
    username: {
      title: "Nazwa użytkownika",
      label: "Użytkownik",
    },
    authMethod: {
      title: "Metoda uwierzytelniania",
      label: "Metoda auth",
    },
    connectionTimeout: {
      title: "Limit czasu połączenia (ms)",
      label: "Timeout",
    },
    keepAlive: {
      title: "Utrzymuj połączenie",
      label: "Keep Alive",
    },
    enabled: {
      title: "Konto włączone",
      label: "Włączone",
    },
    syncStatus: {
      title: "Status synchronizacji",
      label: "Status",
    },
    syncInterval: {
      title: "Interwał synchronizacji (sekundy)",
      label: "Interwał",
    },
    maxMessages: {
      title: "Maksymalna liczba wiadomości",
      label: "Maks wiadomości",
    },
    syncFolders: {
      title: "Synchronizowane foldery",
      label: "Foldery",
    },
    lastSyncAt: "Ostatnia synchronizacja",
    syncError: "Błąd synchronizacji",
    isConnected: "Status połączenia",
    createdAt: "Utworzono",
    updatedAt: "Zaktualizowano",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autentykacja",
    },
    conflict: {
      title: "Błąd konfliktu",
      description: "Konto z tą konfiguracją już istnieje",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    network: {
      title: "Błąd sieci",
      description: "Połączenie sieciowe nie powiodło się",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany",
    },
  },
  success: {
    title: "Sukces",
    description: "Konto IMAP zostało pomyślnie utworzone",
  },
  widget: {
    title: "Utwórz konto IMAP",
    basicInfo: "Informacje podstawowe",
    serverConnection: "Połączenie z serwerem",
    authentication: "Uwierzytelnianie",
    syncConfiguration: "Konfiguracja synchronizacji",
  },
};
