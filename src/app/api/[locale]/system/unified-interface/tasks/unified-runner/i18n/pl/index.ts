import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  description: "Wykonuje zadania cron i zarządza zadaniami bocznymi",
  common: {
    taskName: "Nazwa zadania",
    taskNamesDescription: "Nazwy zadań do filtrowania",
    detailed: "Szczegółowe",
    detailedDescription: "Uwzględnij szczegółowe informacje",
    active: "Aktywne",
    total: "Razem",
    uptime: "Czas działania",
    id: "ID",
    status: "Status",
    lastRun: "Ostatnie uruchomienie",
    nextRun: "Następne uruchomienie",
    schedule: "Harmonogram",
  },
  post: {
    title: "Ujednolicony Runner Zadań",
    description: "Zarządzaj ujednoliconym runnerem zadań dla zadań cron i zadań pobocznych",
    container: {
      title: "Zarządzanie Ujednoliconym Runnerem Zadań",
      description:
        "Kontroluj ujednolicony runner zadań, który zarządza zarówno zadaniami cron, jak i zadaniami pobocznymi",
    },
    fields: {
      action: {
        label: "Akcja",
        description: "Akcja do wykonania na runnerze zadań",
        options: {
          start: "Uruchom Runner",
          stop: "Zatrzymaj Runner",
          status: "Pobierz Status",
          restart: "Uruchom ponownie Runner",
        },
      },
      taskFilter: {
        label: "Filtr Zadań",
        description: "Filtruj zadania według typu",
        options: {
          all: "Wszystkie Zadania",
          cron: "Tylko Zadania Cron",
          side: "Tylko Zadania Poboczne",
        },
      },
      dryRun: {
        label: "Próbny Przebieg",
        description: "Wykonaj próbny przebieg bez wprowadzania rzeczywistych zmian",
      },
    },
    response: {
      success: "Sukces",
      actionResult: "Wynik akcji",
      message: "Wiadomość",
      timestamp: "Znacznik czasu",
    },
    reasons: {
      previousInstanceRunning: "Poprzednia instancja nadal działa",
    },
    messages: {
      taskSkipped: "Zadanie zostało pominięte",
      taskCompleted: "Zadanie zakończone pomyślnie",
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
      internal: {
        title: "Błąd wewnętrzny",
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
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      execution: {
        title: "Błąd wykonania zadania",
        description: "Nie udało się wykonać zadania",
      },
      taskAlreadyRunning: {
        title: "Zadanie już działa",
        description: "Określone zadanie już działa",
      },
      sideTaskExecution: {
        title: "Błąd wykonania zadania bocznego",
        description: "Nie udało się wykonać zadania bocznego",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
