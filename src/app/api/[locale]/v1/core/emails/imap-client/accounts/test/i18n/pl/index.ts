import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Testuj konto IMAP",
  description: "Test połączenia z kontem IMAP",
  container: {
    title: "Test połączenia IMAP",
    description: "Przetestuj połączenie z kontem IMAP",
  },
  accountId: {
    label: "ID konta",
    description: "ID konta IMAP do przetestowania",
    placeholder: "Wprowadź ID konta",
  },
  response: {
    success: "Połączenie udane",
    connectionStatus: "Status połączenia",
    message: "Wiadomość testowa",
    details: {
      title: "Szczegóły połączenia",
      description: "Szczegółowe informacje o połączeniu",
      host: "Host",
      port: "Port",
      secure: "Bezpieczne połączenie",
      authMethod: "Metoda uwierzytelniania",
      responseTime: "Czas odpowiedzi",
      serverCapabilities: "Możliwości serwera",
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
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
    conflict: {
      title: "Błąd konfliktu",
      description: "Wystąpił konflikt danych",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany",
    },
  },
  success: {
    title: "Sukces",
    description: "Test konta IMAP zakończony pomyślnie",
  },
  post: {
    title: "Test",
    description: "Endpoint testowy",
    form: {
      title: "Konfiguracja testowa",
      description: "Skonfiguruj parametry testowe",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi testowej",
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
