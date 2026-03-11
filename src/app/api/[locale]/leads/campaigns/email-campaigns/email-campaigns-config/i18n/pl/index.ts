export const translations = {
  category: "Zarządzanie kampaniami",
  tags: {
    leads: "Leady",
    campaigns: "Kampanie",
  },
  get: {
    title: "Pobierz konfigurację kampanii e-mail",
    description: "Pobierz konfigurację zadania cron kampanii e-mail",
    form: {
      title: "Konfiguracja kampanii e-mail",
      description: "Dane konfiguracyjne kampanii e-mail",
    },
    response: {
      title: "Odpowiedź konfiguracyjna",
      description: "Dane konfiguracyjne kampanii e-mail",
      enabled: "Włączone",
      dryRun: "Tryb testowy",
      batchSize: "Rozmiar partii",
      maxEmailsPerRun: "Maks. e-maili na przebieg",
      schedule: "Harmonogram",
      priority: "Priorytet",
      timeout: "Limit czasu",
      retries: "Ponowne próby",
      retryDelay: "Opóźnienie ponownej próby",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
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
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
    },
    success: {
      title: "Konfiguracja pobrana",
      description: "Konfiguracja kampanii e-mail pobrana pomyślnie",
    },
  },
  post: {
    title: "Konfiguracja kampanii e-mail",
    description: "Skonfiguruj zadanie cron kampanii e-mail",
    form: {
      title: "Konfiguracja kampanii e-mail",
      description: "Ustaw parametry konfiguracyjne",
    },
    enabled: {
      label: "Włączone",
      description: "Włącz lub wyłącz zadanie cron kampanii e-mail",
    },
    dryRun: {
      label: "Tryb testowy",
      description: "Przetwarzaj e-maile bez ich wysyłania",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Liczba leadów na partię (1–100)",
    },
    maxEmailsPerRun: {
      label: "Maks. e-maili na przebieg",
      description: "Maksymalna liczba e-maili na przebieg cron (1–1000)",
    },
    schedule: {
      label: "Harmonogram",
      description: "Wyrażenie cron dla harmonogramu wykonania",
    },
    priority: {
      label: "Priorytet",
      description: "Poziom priorytetu wykonania zadania",
    },
    timeout: {
      label: "Limit czasu (ms)",
      description: "Maksymalny czas wykonania w milisekundach",
    },
    retries: {
      label: "Ponowne próby",
      description: "Liczba prób ponowienia przy błędzie",
    },
    retryDelay: {
      label: "Opóźnienie ponownej próby (ms)",
      description: "Opóźnienie między próbami ponowienia",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi konfiguracji kampanii e-mail",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      forbidden: { title: "Zabronione", description: "Dostęp zabroniony" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Konfiguracja kampanii e-mail zapisana pomyślnie",
    },
  },
  widget: {
    title: "Konfiguracja kampanii e-mail",
    titleSaved: "Konfiguracja zapisana",
    saving: "Zapisywanie...",
    save: "Zapisz ustawienia",
    guidanceTitle: "Skonfiguruj cron kampanii e-mail",
    guidanceDescription:
      "Włącz lub wyłącz zadanie cron i skonfiguruj harmonogram, rozmiar partii i ustawienia wykonania.",
    sections: {
      general: "Ogólne",
      generalDescription:
        "Kontrola główna włączania zadania i trybu testowego.",
      schedule: "Harmonogram",
      scheduleDescription: "Ustaw harmonogram cron dla wysyłania e-maili.",
      processing: "Przetwarzanie",
      processingDescription: "Skonfiguruj liczbę leadów i e-maili na przebieg.",
      advanced: "Zaawansowane",
      advancedDescription:
        "Priorytet, limity czasu i zachowanie ponownych prób.",
    },
  },
};
