import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Kampaniami",
  tag: "Starter kampanii",
  task: {
    description:
      "Uruchamia kampanie dla nowych leadów, przenosząc je do statusu OCZEKUJĄCE",
  },
  errors: {
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił błąd podczas przetwarzania żądania startera kampanii",
    },
    invalidTransition: "Nieprawidłowe przejście statusu dla startu kampanii",
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Wymagane uwierzytelnienie",
    },
    forbidden: {
      title: "Zabroniony",
      description: "Dostęp zabroniony",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
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
      description: "Zasób nie znaleziony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
  },
  post: {
    title: "Starter kampanii",
    description: "Uruchom kampanie dla nowych leadów",
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas uruchamiania kampanii",
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
        description: "Zasób nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    fields: {
      timezone: {
        label: "Strefa czasowa",
        description: "Strefa czasowa przeglądarki do przeliczania godzin",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wprowadzania zmian",
      },
      force: {
        label: "Wymuś",
        description: "Pomiń ograniczenia harmonogramu dni/godzin",
      },
    },
    response: {
      leadsProcessed: "Przetworzone leady",
      leadsStarted: "Uruchomione leady",
      leadsSkipped: "Pominięte leady",
      executionTimeMs: "Czas wykonania (ms)",
      errors: "Błędy",
      quotaDetails: "Szczegóły limitu",
    },
    success: {
      title: "Starter kampanii zakończony",
      description: "Starter kampanii został uruchomiony pomyślnie",
    },
  },
  get: {
    title: "Pobierz konfigurację startera kampanii",
    description: "Załaduj konfigurację startera kampanii",
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: { title: "Zabroniony", description: "Dostęp zabroniony" },
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
        description: "Zasób nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
    },
    fields: {
      timezone: {
        label: "Strefa czasowa",
        description: "Strefa czasowa przeglądarki do przeliczania godzin",
      },
    },
    response: {
      dryRun: "Tryb próbny",
      minAgeHours: "Minimalny wiek w godzinach",
      localeConfig: "Konfiguracja języków",
      enabledDays: "Aktywne dni tygodnia",
      enabledHours: "Aktywne godziny",
      leadsPerWeek: "Leady na tydzień",
      schedule: "Harmonogram",
      enabled: "Włączono",
      priority: "Priorytet",
      timeout: "Limit czasu",
      retries: "Ponowne próby",
      retryDelay: "Opóźnienie ponownej próby",
    },
    success: {
      title: "Konfiguracja załadowana pomyślnie",
      description: "Konfiguracja startera kampanii załadowana pomyślnie",
    },
  },
  put: {
    title: "Konfiguracja startera kampanii",
    description: "Zaktualizuj konfigurację startera kampanii",
    dryRun: {
      label: "Tryb próbny (Dry Run)",
      description: "Włącz tryb próbny bez wysyłania prawdziwych e-maili",
    },
    minAgeHours: {
      label: "Minimalny wiek w godzinach",
      description: "Minimalny wiek w godzinach przed przetworzeniem leadów",
    },
    enabledDays: {
      label: "Aktywne dni tygodnia",
      description: "Dni tygodnia, gdy kampanie są aktywne",
      monday: "Poniedziałek",
      tuesday: "Wtorek",
      wednesday: "Środa",
      thursday: "Czwartek",
      friday: "Piątek",
      saturday: "Sobota",
      sunday: "Niedziela",
    },
    enabledHours: {
      label: "Aktywne godziny",
      description: "Godziny dnia, gdy kampanie są aktywne",
      start: {
        label: "Godzina startowa",
        description: "Godzina dnia, o której kampanie się zaczynają (0-23)",
      },
      end: {
        label: "Godzina końcowa",
        description: "Godzina dnia, o której kampanie się kończą (0-23)",
      },
    },
    localeConfig: {
      label: "Konfiguracja języków",
      description:
        "Ustawienia dla każdego języka: leady na tydzień, aktywne dni i aktywne godziny",
    },
    leadsPerWeek: {
      label: "Leady na tydzień",
      description: "Maksymalna liczba leadów do przetworzenia tygodniowo",
    },
    schedule: {
      label: "Harmonogram",
      description: "Harmonogram wykonywania kampanii",
    },
    enabled: {
      label: "Włączono",
      description: "Włącz lub wyłącz starter kampanii",
    },
    priority: {
      label: "Priorytet",
      description: "Poziom priorytetu wykonywania kampanii",
    },
    timeout: {
      label: "Limit czasu",
      description: "Wartość limitu czasu w milisekundach",
    },
    retries: {
      label: "Ponowne próby",
      description: "Liczba prób ponowienia",
    },
    retryDelay: {
      label: "Opóźnienie ponownej próby",
      description: "Opóźnienie między próbami ponowienia w milisekundach",
    },
    success: {
      title: "Konfiguracja zapisana",
      description: "Konfiguracja startera kampanii zapisana pomyślnie",
    },
  },
  priority: {
    critical: "Krytyczny",
    high: "Wysoki",
    medium: "Średni",
    low: "Niski",
    background: "Tło",
    filter: {
      all: "Wszystkie priorytety",
      highAndAbove: "Wysoki i wyżej",
      mediumAndAbove: "Średni i wyżej",
    },
  },
  widget: {
    title: "Konfiguracja startera kampanii",
    titleSaved: "Konfiguracja zapisana",
    description:
      "Uruchamia kampanie dla nowych leadów, które są gotowe do kontaktu.",
    saving: "Zapisywanie...",
    save: "Zapisz ustawienia",
    addLocale: "+ Dodaj język",
    guidanceTitle: "Skonfiguruj starter kampanii",
    guidanceDescription:
      "Ustaw harmonogram, aktywne dni/godziny i cele leadów na tydzień.",
    runButton: "Uruchom kampanie",
    running: "Uruchamianie...",
    done: "Gotowe",
    perRunBudget:
      "~{{perRunBudget}} leadów/uruchomienie · {{totalRunsPerWeek}} uruchomień/tydzień",
    perRunBudgetFractional:
      "{{exactBudget}}/uruchomienie · {{totalRunsPerWeek}} uruchomień/tydz. (ułamkowe — akumuluje między uruchomieniami)",
    perRunBudgetZeroHint:
      "— zwiększ liczbę leadów/tydzień lub zmniejsz częstotliwość harmonogramu",
    sections: {
      general: "Ogólne",
      generalDescription:
        "Główne kontrolki do włączania startera kampanii i trybu próbnego.",
      schedule: "Harmonogram",
      scheduleDescription:
        "Kiedy kampanie powinny działać? Ustaw harmonogram cron, aktywne dni i godziny.",
      hoursTimezoneNote:
        "Godziny w strefie czasowej przeglądarki ({{offset}}). Przechowywane jako UTC na serwerze.",
      quotas: "Limity",
      quotasDescription:
        "Ile leadów przetwarzać tygodniowo, w podziale na język.",
      advanced: "Zaawansowane",
      advancedDescription:
        "Ustawienia wykonywania zadań, takie jak priorytet, limity czasu i zachowanie ponownych prób.",
    },
  },
};
