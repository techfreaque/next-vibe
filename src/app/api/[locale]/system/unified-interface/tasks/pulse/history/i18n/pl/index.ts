export const translations = {
  get: {
    title: "Historia wykonań Pulse",
    description: "Przeglądaj historyczne cykle wykonań Pulse",
    fields: {
      startDate: {
        label: "Data początkowa",
        description: "Filtruj cykle Pulse po tej dacie",
      },
      endDate: {
        label: "Data końcowa",
        description: "Filtruj cykle Pulse przed tą datą",
      },
      status: {
        label: "Status",
        description: "Filtruj według statusu wykonania",
        placeholder: "Wszystkie statusy",
      },
      limit: {
        label: "Limit wyników",
        description: "Maksymalna liczba zwracanych wyników",
        placeholder: "50",
      },
      offset: {
        label: "Przesunięcie wyników",
        description: "Liczba wyników do pominięcia przy paginacji",
        placeholder: "0",
      },
    },
    response: {
      executions: { title: "Wykonania Pulse" },
      totalCount: { title: "Łączna liczba" },
      hasMore: { title: "Więcej wyników" },
      summary: { title: "Podsumowanie wykonań" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Błąd sieci podczas pobierania historii Pulse",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do przeglądania historii Pulse",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do historii Pulse jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Rekord wykonania Pulse nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Historia pobrana",
      description: "Historia wykonań Pulse pobrana pomyślnie",
    },
  },
  widget: {
    title: "Historia Pulse",
    empty: "Nie znaleziono wykonań Pulse",
    details: "Szczegóły",
    discovered: "{{count}} wykrytych",
    due: "{{count}} do wykonania",
    succeeded: "{{count}} ok",
    failed: "{{count}} nieudanych",
    tasksExecuted: "Wykonane",
    tasksSucceeded: "Zakończone sukcesem",
    tasksFailed: "Nieudane",
    tasksSkipped: "Pominięte",
    header: {
      cronHistory: "Historia Cron",
      stats: "Statystyki",
      refresh: "Odśwież",
    },
    summary: {
      total: "Łącznie",
      successful: "Udane",
      failed: "Nieudane",
      successRate: "Wskaźnik sukcesu",
      avgDuration: "Śr. czas trwania",
    },
    filter: {
      all: "Wszystkie",
      success: "Udane",
      failure: "Nieudane",
      timeout: "Timeout",
    },
    pagination: {
      info: "Strona {{page}} z {{totalPages}} ({{total}} łącznie)",
      prev: "Poprzednia",
      next: "Następna",
    },
  },
};
