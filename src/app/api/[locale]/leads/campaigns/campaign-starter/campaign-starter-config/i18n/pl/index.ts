import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz konfigurację uruchamiacza kampanii",
    description: "Załaduj konfigurację uruchamiacza kampanii",
    form: {
      title: "Żądanie konfiguracji uruchamiacza kampanii",
      description: "Zażądaj konfiguracji uruchamiacza kampanii",
    },
    response: {
      title: "Odpowiedź konfiguracji",
      description: "Dane konfiguracji uruchamiacza kampanii",
      dryRun: "Tryb próbny",
      minAgeHours: "Minimalny wiek w godzinach",
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
    success: {
      title: "Konfiguracja załadowana pomyślnie",
      description: "Konfiguracja uruchamiacza kampanii załadowana pomyślnie",
    },
  },
  post: {
    title: "Konfiguracja uruchamiacza kampanii",
    description: "Endpoint konfiguracji uruchamiacza kampanii",
    form: {
      title: "Konfiguracja uruchamiacza kampanii",
      description: "Konfiguruj parametry uruchamiacza kampanii",
    },
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
      description: "Włącz lub wyłącz uruchamiacz kampanii",
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
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi konfiguracji uruchamiacza kampanii",
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
        description: "Zasób nie znaleziony",
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
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  widget: {
    title: "Konfiguracja uruchamiacza kampanii",
    titleSaved: "Konfiguracja zapisana",
    saving: "Zapisywanie...",
    guidanceTitle: "Skonfiguruj uruchamiacz kampanii",
    guidanceDescription:
      "Ustaw harmonogram, aktywne dni/godziny, cele leadów na tydzień i ustawienia zadań cron. Po zapisaniu użyj przycisków akcji, aby wyświetlić statystyki lub natychmiast uruchomić kampanię.",
    successTitle: "Konfiguracja zapisana pomyślnie",
    successDescription:
      "Uruchamiacz kampanii zastosuje te ustawienia przy następnym zaplanowanym uruchomieniu.",
    savedSettings: "Zapisane ustawienia",
    scheduleCron: "Harmonogram (cron)",
    enabled: "Włączono",
    dryRun: "Próbny przebieg",
    minLeadAge: "Minimalny wiek leada",
    activeDays: "Aktywne dni",
    activeHours: "Aktywne godziny",
    priority: "Priorytet",
    timeout: "Limit czasu",
    retries: "Ponowne próby",
    retryDelay: "Opóźnienie ponownej próby",
    leadsPerWeek: "Leady na tydzień",
    viewStats: "Wyświetl statystyki",
    viewCurrentConfig: "Wyświetl bieżącą konfigurację",
    yes: "Tak",
    no: "Nie",
    yesNoEmailsSent: "Tak (bez wysyłania e-maili)",
    dayMon: "Pon",
    dayTue: "Wt",
    dayWed: "Śr",
    dayThu: "Czw",
    dayFri: "Pt",
    daySat: "Sob",
    daySun: "Ndz",
  },
};
