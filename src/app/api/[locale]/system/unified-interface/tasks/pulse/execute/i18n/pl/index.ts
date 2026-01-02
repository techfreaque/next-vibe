import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Wykonanie Pulse",
  tags: {
    execute: "Wykonaj",
  },
  post: {
    title: "Wykonaj Pulse",
    description: "Wykonaj monitorowanie zdrowia pulse i wykonywanie zadań",
    container: {
      title: "Wykonanie Pulse",
      description: "Wykonaj monitorowanie pulse i uruchom zaplanowane zadania",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Wykonaj próbny przebieg bez wprowadzania rzeczywistych zmian",
      },
      taskNames: {
        label: "Nazwy zadań",
        description: "Konkretne nazwy zadań do wykonania (opcjonalne)",
      },
      force: {
        label: "Wymuś wykonanie",
        description: "Wymuś wykonanie nawet jeśli zadania nie są wymagane",
      },
      success: {
        title: "Sukces",
      },
      message: {
        title: "Wiadomość",
      },
    },
    response: {
      pulseId: "ID Pulse",
      executedAt: "Wykonano o",
      totalTasksDiscovered: "Łączna liczba odkrytych zadań",
      tasksDue: "Zadania wymagane",
      tasksExecuted: "Zadania wykonane",
      tasksSucceeded: "Zadania udane",
      tasksFailed: "Zadania nieudane",
      tasksSkipped: "Zadania pominięte",
      totalExecutionTimeMs: "Całkowity czas wykonania (ms)",
      errors: "Błędy",
      summary: "Podsumowanie wykonania",
      results: "Wyniki",
      resultsDescription: "Wyniki wykonania zadań",
      taskName: "Nazwa zadania",
      success: "Sukces",
      duration: "Czas trwania",
      message: "Wiadomość",
      executionFailed: "Wykonanie nie powiodło się",
      dryRunSuccess: "Próbne uruchomienie zakończone pomyślnie",
      executionSuccess: "Wykonanie zakończone pomyślnie",
    },
    examples: {
      basic: {
        title: "Podstawowe wykonanie Pulse",
      },
      dryRun: {
        title: "Wykonanie próbnego przebiegu",
      },
      success: {
        title: "Udane wykonanie",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd wewnętrzny serwera",
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
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
