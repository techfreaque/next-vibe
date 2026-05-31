import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    taskSync: "Synchronizacja zadań",
  },
  get: {
    title: "Ustawienia synchronizacji zadań",
    description: "Pobierz aktualne ustawienia synchronizacji zadań",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować ustawień synchronizacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zadanie nie znalezione",
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
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
    },
    success: {
      title: "Ustawienia załadowane",
      description: "Ustawienia synchronizacji zadań pobrane",
    },
  },
  patch: {
    title: "Aktualizuj ustawienia synchronizacji",
    description: "Włącz lub wyłącz zadanie cron synchronizacji",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować ustawień synchronizacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zadanie nie znalezione",
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
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
    },
    success: {
      title: "Ustawienia zaktualizowane",
      description: "Ustawienia synchronizacji zadań zapisane",
    },
    syncEnabled: {
      label: "Auto-synchronizacja włączona",
      description:
        "Gdy włączone, zadania i wspomnienia synchronizują się co minutę ze wszystkimi połączonymi zdalnymi instancjami",
    },
  },
};
