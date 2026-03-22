import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Kampaniami",
  tag: "Kampanie e-mailowe",
  task: {
    description:
      "Wysyła automatyczne kampanie e-mailowe do leadów na podstawie ich etapu i harmonogramu",
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
    title: "Kampanie e-mailowe",
    description: "Przetwarzaj kampanie e-mailowe dla leadów",
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
    fields: {
      batchSize: {
        label: "Rozmiar partii",
        description: "Liczba leadów do przetworzenia na partię",
      },
      maxEmailsPerRun: {
        label: "Maks. e-maili na przebieg",
        description: "Maksymalna liczba e-maili do wysłania na przebieg",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wysyłania e-maili",
      },
    },
    response: {
      emailsScheduled: "Zaplanowane e-maile",
      emailsSent: "Wysłane e-maile",
      emailsFailed: "Nieudane e-maile",
      leadsProcessed: "Przetworzone leady",
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  get: {
    title: "Pobierz konfigurację kampanii e-mailowych",
    description: "Załaduj konfigurację cron kampanii e-mailowych",
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
      maxEmailsPerRun: "Maks. e-maili na przebieg",
      schedule: "Harmonogram",
      priority: "Priorytet",
      timeout: "Limit czasu",
      retries: "Ponowne próby",
      retryDelay: "Opóźnienie ponownej próby",
    },
    success: {
      title: "Konfiguracja załadowana pomyślnie",
      description: "Konfiguracja kampanii e-mailowych załadowana pomyślnie",
    },
  },
  put: {
    title: "Konfiguracja kampanii e-mailowych",
    description: "Zaktualizuj konfigurację cron kampanii e-mailowych",
    enabled: {
      label: "Włączono",
      description: "Włącz lub wyłącz zadanie cron kampanii e-mailowych",
    },
    dryRun: {
      label: "Tryb próbny",
      description: "Przetwarzaj e-maile bez ich wysyłania",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Liczba leadów do przetworzenia na partię (1–100)",
    },
    maxEmailsPerRun: {
      label: "Maks. e-maili na przebieg",
      description:
        "Maksymalna liczba e-maili do wysłania na przebieg cron (1–1000)",
    },
    schedule: {
      label: "Harmonogram",
      description: "Wyrażenie cron dla kampanii e-mailowych",
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
      description: "Konfiguracja kampanii e-mailowych zapisana pomyślnie",
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
    title: "Konfiguracja kampanii e-mailowych",
    titleSaved: "Konfiguracja zapisana",
    saving: "Zapisywanie...",
    save: "Zapisz ustawienia",
    guidanceTitle: "Skonfiguruj cron kampanii e-mailowych",
    guidanceDescription:
      "Włącz/wyłącz zadanie cron kampanii e-mailowych i skonfiguruj harmonogram oraz rozmiar partii.",
    runButton: "Uruchom teraz",
    running: "Uruchamianie...",
    done: "Gotowe",
    sections: {
      general: "Ogólne",
      generalDescription:
        "Główne kontrolki dla zadania kampanii e-mailowych i trybu próbnego.",
      schedule: "Harmonogram",
      scheduleDescription: "Ustaw harmonogram cron dla wysyłania e-maili.",
      processing: "Przetwarzanie",
      processingDescription:
        "Skonfiguruj ile leadów i e-maili przetwarzać na przebieg.",
      advanced: "Zaawansowane",
      advancedDescription:
        "Ustawienia wykonywania zadań, takie jak priorytet, limity czasu i zachowanie ponownych prób.",
    },
  },
};
