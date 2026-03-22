import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie kampaniami",
  tag: "Przetwarzanie zwrotów",
  task: {
    description:
      "Skanuj skrzynkę IMAP w poszukiwaniu powiadomień o zwrotach i aktualizuj status leada na BOUNCED",
  },
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
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
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany",
    },
  },
  post: {
    title: "Przetwarzanie zwrotów",
    description: "Przetwarzaj powiadomienia o zwrotach e-mail z IMAP",
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Błąd podczas przetwarzania zwrotów",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wprowadzania zmian",
      },
      batchSize: {
        label: "Rozmiar partii",
        description: "Maksymalna liczba e-maili ze zwrotami na przebieg",
      },
    },
    response: {
      bouncesFound: "Znalezione zwroty",
      leadsUpdated: "Zaktualizowane leady",
      campaignsCancelled: "Anulowane kampanie",
    },
    success: {
      title: "Przetwarzanie zwrotów zakończone",
      description: "Powiadomienia o zwrotach przetworzone pomyślnie",
    },
  },
  get: {
    title: "Pobierz konfigurację przetwarzania zwrotów",
    description: "Załaduj konfigurację cron przetwarzania zwrotów",
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    response: {
      enabled: "Włączono",
      dryRun: "Tryb próbny",
      batchSize: "Rozmiar partii",
      schedule: "Harmonogram",
      priority: "Priorytet",
      timeout: "Limit czasu",
      retries: "Ponowne próby",
      retryDelay: "Opóźnienie ponownej próby",
    },
    success: {
      title: "Konfiguracja załadowana pomyślnie",
      description: "Konfiguracja przetwarzania zwrotów załadowana pomyślnie",
    },
  },
  put: {
    title: "Konfiguracja przetwarzania zwrotów",
    description: "Zaktualizuj konfigurację cron przetwarzania zwrotów",
    enabled: {
      label: "Włączono",
      description: "Włącz lub wyłącz zadanie cron przetwarzania zwrotów",
    },
    dryRun: {
      label: "Tryb próbny",
      description: "Szukaj zwrotów bez aktualizowania statusu leadów",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Maksymalna liczba e-maili ze zwrotami na przebieg (1–500)",
    },
    schedule: {
      label: "Harmonogram",
      description: "Wyrażenie cron dla przetwarzania zwrotów",
    },
    priority: {
      label: "Priorytet",
      description: "Poziom priorytetu wykonywania zadania",
    },
    timeout: {
      label: "Limit czasu (ms)",
      description: "Maksymalny czas wykonywania w milisekundach",
    },
    retries: {
      label: "Ponowne próby",
      description: "Liczba prób ponowienia przy błędzie",
    },
    retryDelay: {
      label: "Opóźnienie ponownej próby (ms)",
      description: "Opóźnienie między próbami ponowienia w milisekundach",
    },
    success: {
      title: "Konfiguracja zapisana",
      description: "Konfiguracja przetwarzania zwrotów zapisana pomyślnie",
    },
  },
  priority: {
    critical: "Krytyczny",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
    background: "Tło",
  },
  widget: {
    title: "Konfiguracja przetwarzania zwrotów",
    titleSaved: "Konfiguracja zapisana",
    saving: "Zapisywanie...",
    save: "Zapisz ustawienia",
    guidanceTitle: "Skonfiguruj cron przetwarzania zwrotów",
    guidanceDescription:
      "Włącz/wyłącz zadanie cron przetwarzania zwrotów i skonfiguruj harmonogram oraz ustawienia partii.",
    runButton: "Uruchom teraz",
    running: "Uruchamianie...",
    done: "Gotowe",
    sections: {
      general: "Ogólne",
      generalDescription:
        "Główne kontrolki dla zadania przetwarzania zwrotów i trybu próbnego.",
      schedule: "Harmonogram",
      scheduleDescription: "Ustaw harmonogram cron dla przetwarzania zwrotów.",
      processing: "Przetwarzanie",
      processingDescription:
        "Skonfiguruj ile e-maili ze zwrotami przetwarzać na przebieg.",
      advanced: "Zaawansowane",
      advancedDescription:
        "Ustawienia wykonywania zadań, takie jak priorytet, limity czasu i zachowanie ponownych prób.",
    },
  },
};
