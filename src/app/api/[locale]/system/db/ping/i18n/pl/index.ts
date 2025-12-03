import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",
  tag: "baza danych",
  post: {
    title: "Ping bazy danych",
    description: "Sprawdź połączenie i stan bazy danych",
    form: {
      title: "Konfiguracja ping",
      description: "Skonfiguruj parametry pingu bazy danych",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi ping",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja do operacji bazodanowych",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania ping",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera podczas pingu bazy danych",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas pingu bazy danych",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas łączenia z bazą danych",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony - niewystarczające uprawnienia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób bazy danych nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych podczas operacji",
      },
    },
    success: {
      title: "Ping bazy danych zakończony sukcesem",
      description: "Pomyślnie połączono z bazą danych",
    },
  },
  fields: {
    silent: {
      title: "Tryb cichy",
      description: "Wykonaj ping bez komunikatów wyjściowych",
    },
    keepConnectionOpen: {
      title: "Pozostaw połączenie otwarte",
      description: "Pozostaw połączenie z bazą danych otwarte po pingu",
    },
    success: {
      title: "Status sukcesu",
      content: "Sukces",
    },
    isAccessible: {
      title: "Baza danych dostępna",
      content: "Dostępna",
    },
    output: {
      title: "Komunikat wyjściowy",
      content: "Wyjście",
    },
    connectionInfo: {
      title: "Informacje o połączeniu",
      totalConnections: {
        content: "Wszystkie połączenia",
      },
      idleConnections: {
        content: "Bezczynne połączenia",
      },
      waitingClients: {
        content: "Oczekujący klienci",
      },
    },
  },
  status: {
    success: "Sukces",
    failed: "Niepowodzenie",
    timeout: "Przekroczenie czasu",
    error: "Błąd",
  },
  connectionType: {
    primary: "Główny",
    replica: "Replika",
    cache: "Pamięć podręczna",
  },
};
