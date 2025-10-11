import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz Konfigurację Startera Kampanii",
    description: "Pobierz konfigurację startera kampanii",
    form: {
      title: "Żądanie Konfiguracji Startera Kampanii",
      description: "Żądaj konfiguracji startera kampanii",
    },
    response: {
      title: "Odpowiedź Konfiguracji",
      description: "Dane konfiguracji startera kampanii",
      dryRun: "Tryb Testowy",
      minAgeHours: "Minimalny Wiek w Godzinach",
      enabledDays: "Włączone Dni",
      enabledHours: "Włączone Godziny",
      leadsPerWeek: "Leady na Tydzień",
      schedule: "Harmonogram",
      enabled: "Włączone",
      priority: "Priorytet",
      timeout: "Timeout",
      retries: "Ponowne Próby",
      retryDelay: "Opóźnienie Ponownej Próby",
    },
    success: {
      title: "Konfiguracja Pobrana Pomyślnie",
      description: "Konfiguracja startera kampanii pobrana pomyślnie",
    },
  },
  post: {
    title: "Konfiguracja Startera Kampanii",
    description: "Endpoint konfiguracji startera kampanii",
    form: {
      title: "Konfiguracja Startera Kampanii",
      description: "Skonfiguruj parametry startera kampanii",
    },
    dryRun: {
      label: "Tryb Testowy",
      description: "Włącz tryb testowy do testowania",
    },
    minAgeHours: {
      label: "Minimalny Wiek w Godzinach",
      description: "Minimalny wiek w godzinach przed przetwarzaniem leadów",
    },
    enabledDays: {
      label: "Włączone Dni",
      description: "Dni tygodnia, w których kampanie są włączone",
    },
    enabledHours: {
      label: "Włączone Godziny",
      description: "Godziny dnia, w których kampanie są włączone",
    },
    leadsPerWeek: {
      label: "Leady na Tydzień",
      description: "Maksymalna liczba leadów do przetworzenia na tydzień",
    },
    schedule: {
      label: "Harmonogram",
      description: "Harmonogram wykonywania kampanii",
    },
    enabled: {
      label: "Włączone",
      description: "Włącz lub wyłącz starter kampanii",
    },
    priority: {
      label: "Priorytet",
      description: "Poziom priorytetu dla wykonywania kampanii",
    },
    timeout: {
      label: "Timeout",
      description: "Wartość timeout w sekundach",
    },
    retries: {
      label: "Ponowne Próby",
      description: "Liczba prób ponowienia",
    },
    retryDelay: {
      label: "Opóźnienie Ponownej Próby",
      description: "Opóźnienie między próbami ponowienia w sekundach",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi konfiguracji startera kampanii",
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
