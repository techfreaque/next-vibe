export const translations = {
  category: "Zarządzanie kampaniami",
  tags: {
    leads: "Leady",
    campaigns: "Kampanie",
  },
  get: {
    title: "Pobierz konfigurację procesora odrzuceń",
    description: "Pobierz konfigurację zadania cron procesora odrzuceń",
    form: {
      title: "Konfiguracja procesora odrzuceń",
      description: "Dane konfiguracyjne procesora odrzuceń",
    },
    response: {
      title: "Odpowiedź konfiguracyjna",
      description: "Dane konfiguracyjne procesora odrzuceń",
      enabled: "Włączone",
      dryRun: "Tryb testowy",
      batchSize: "Rozmiar partii",
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
      description: "Konfiguracja procesora odrzuceń pobrana pomyślnie",
    },
  },
  post: {
    title: "Konfiguracja procesora odrzuceń",
    description: "Skonfiguruj zadanie cron procesora odrzuceń",
    form: {
      title: "Konfiguracja procesora odrzuceń",
      description: "Ustaw parametry konfiguracyjne",
    },
    enabled: {
      label: "Włączone",
      description: "Włącz lub wyłącz zadanie cron procesora odrzuceń",
    },
    dryRun: {
      label: "Tryb testowy",
      description: "Skanuj odrzucenia bez aktualizacji statusu leadów",
    },
    batchSize: {
      label: "Rozmiar partii",
      description: "Maksymalna liczba e-maili odrzuconych na przebieg (1–500)",
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
      description: "Dane odpowiedzi konfiguracji procesora odrzuceń",
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
      description: "Konfiguracja procesora odrzuceń zapisana pomyślnie",
    },
  },
  widget: {
    title: "Konfiguracja procesora odrzuceń",
    titleSaved: "Konfiguracja zapisana",
    saving: "Zapisywanie...",
    save: "Zapisz ustawienia",
    guidanceTitle: "Skonfiguruj cron procesora odrzuceń",
    guidanceDescription:
      "Włącz lub wyłącz zadanie cron i skonfiguruj harmonogram i ustawienia partii.",
    sections: {
      general: "Ogólne",
      generalDescription:
        "Kontrola główna włączania zadania i trybu testowego.",
      schedule: "Harmonogram",
      scheduleDescription: "Ustaw harmonogram cron dla przetwarzania odrzuceń.",
      processing: "Przetwarzanie",
      processingDescription:
        "Skonfiguruj liczbę e-maili odrzuconych na przebieg.",
      advanced: "Zaawansowane",
      advancedDescription:
        "Priorytet, limity czasu i zachowanie ponownych prób.",
    },
  },
};
