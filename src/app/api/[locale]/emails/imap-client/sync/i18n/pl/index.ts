import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Synchronizacja IMAP",
  description: "Usługa synchronizacji IMAP",
  container: {
    title: "Konfiguracja synchronizacji IMAP",
    description: "Skonfiguruj parametry synchronizacji IMAP",
  },
  accountIds: {
    label: "ID kont",
    description: "ID kont IMAP do synchronizacji",
    placeholder: "Wprowadź ID kont oddzielone przecinkami",
  },
  force: {
    label: "Wymuś synchronizację",
    description: "Wymuś synchronizację nawet jeśli niedawno była przeprowadzona",
  },
  dryRun: {
    label: "Test uruchomienia",
    description: "Wykonaj test bez wprowadzania zmian",
  },
  maxMessages: {
    label: "Maks. wiadomości",
    description: "Maksymalna liczba wiadomości do synchronizacji na folder",
    placeholder: "Wprowadź maksymalną liczbę wiadomości",
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
      result: {
        title: "Wyniki synchronizacji",
        description: "Szczegółowe wyniki synchronizacji",
        accountsProcessed: "Przetworzone konta",
        foldersProcessed: "Przetworzone foldery",
        messagesProcessed: "Przetworzone wiadomości",
        messagesAdded: "Dodane wiadomości",
        messagesUpdated: "Zaktualizowane wiadomości",
        messagesDeleted: "Usunięte wiadomości",
        duration: "Czas trwania",
      },
      errors: {
        error: {
          title: "Błąd synchronizacji",
          description: "Szczegóły błędu",
          code: "Kod błędu",
          message: "Komunikat błędu",
        },
      },
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
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
  },
  success: {
    title: "Sukces",
    description: "Operacja zakończona pomyślnie",
  },
};
