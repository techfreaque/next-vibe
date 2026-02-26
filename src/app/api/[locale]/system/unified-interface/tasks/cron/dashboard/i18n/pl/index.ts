import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie zadaniami",

  errors: {
    fetchDashboard: "Nie udało się pobrać panelu zadań",
    repositoryInternalError: "Wystąpił błąd wewnętrzny",
  },

  get: {
    tags: {
      tasks: "Zadania",
      monitoring: "Monitorowanie",
    },
    title: "Panel zadań",
    description:
      "Ujednolicony widok wszystkich zaplanowanych zadań z ostatnią historią wykonania, alertami awarii i stanem systemu.",
    fields: {
      limit: {
        label: "Limit zadań",
        description: "Maksymalna liczba zwracanych zadań",
      },
      historyDepth: {
        label: "Głębokość historii",
        description: "Liczba ostatnich wykonań na zadanie",
      },
    },
    response: {
      tasks: { title: "Zadania z ostatnimi wykonaniami" },
      alerts: {
        title: "Alerty awarii dla zadań o krytycznym/wysokim priorytecie",
      },
      stats: { title: "Zagregowane statystyki" },
    },
    success: {
      title: "Panel załadowany",
      description: "Dane panelu zadań pobrane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono danych panelu",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
  },
};
