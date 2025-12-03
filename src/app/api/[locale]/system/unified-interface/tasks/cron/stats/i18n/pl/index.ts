import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz Statystyki Zadań Cron",
    description: "Pobierz kompleksowe statystyki i metryki zadań cron",
    tag: "Statystyki Cron",
    form: {
      title: "Żądanie Statystyk Cron",
      description: "Skonfiguruj parametry do pobierania statystyk zadań cron",
    },
    fields: {
      period: {
        title: "Okres Czasu",
        description: "Okres czasu dla agregacji statystyk",
      },
      type: {
        title: "Typ Statystyk",
        description: "Typ statystyk do pobrania",
      },
      taskId: {
        title: "ID Zadania",
        description: "Opcjonalne konkretne ID zadania do filtrowania statystyk",
      },
      limit: {
        title: "Limit Wyników",
        description: "Maksymalna liczba wyników do zwrócenia",
      },
      timePeriod: {
        title: "Okres Czasu",
      },
      dateRangePreset: {
        title: "Wstępnie Ustawiony Zakres Dat",
      },
      taskName: {
        title: "Nazwa Zadania",
      },
      taskStatus: {
        title: "Status Zadania",
      },
      taskPriority: {
        title: "Priorytet Zadania",
      },
      healthStatus: {
        title: "Status Zdrowia",
      },
      minDuration: {
        title: "Minimalny Czas Trwania",
      },
      maxDuration: {
        title: "Maksymalny Czas Trwania",
      },
      includeDisabled: {
        title: "Uwzględnij Wyłączone",
      },
      includeSystemTasks: {
        title: "Uwzględnij Zadania Systemowe",
      },
      hasRecentFailures: {
        title: "Ma Ostatnie Błędy",
      },
      hasTimeout: {
        title: "Ma Timeout",
      },
      search: {
        title: "Szukaj",
      },
    },
    period: {
      hour: "Godzinowe",
      day: "Dzienne",
      week: "Tygodniowe",
      month: "Miesięczne",
    },
    type: {
      overview: "Przegląd",
      performance: "Wydajność",
      errors: "Analiza Błędów",
      trends: "Analiza Trendów",
    },
    response: {
      success: {
        title: "Status Powodzenia Żądania",
      },
      data: {
        title: "Dane Statystyczne",
      },
    },
    errors: {
      server: {
        title: "Błąd Serwera",
        description:
          "Wystąpił wewnętrzny błąd serwera podczas pobierania statystyk",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Podane parametry są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do dostępu do statystyk",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Niewystarczające uprawnienia do dostępu do statystyk",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądane statystyki nie mogły zostać znalezione",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas pobierania statystyk",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany, które wymagają uwagi",
      },
    },
    success: {
      title: "Statystyki Pobrane",
      description: "Statystyki zadań cron pomyślnie pobrane",
    },
  },
};
