import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz zadanie Cron",
    description: "Pobierz pojedyncze zadanie cron według ID",
    container: {
      title: "Szczegóły zadania Cron",
      description: "Wyświetl szczegóły konkretnego zadania cron",
    },
    fields: {
      id: {
        label: "ID zadania",
        description: "Unikalny identyfikator zadania",
      },
    },
    response: {
      task: {
        title: "Zadanie",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID zadania jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do wyświetlenia tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Żądane zadanie nie zostało znalezione",
      },
      internal: {
        title: "Wewnętrzny błąd serwera",
        description: "Wystąpił błąd podczas pobierania zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tego zadania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      retrieved: {
        title: "Zadanie pobrane",
        description: "Zadanie pobrane pomyślnie",
      },
    },
  },
  put: {
    title: "Aktualizuj zadanie Cron",
    description: "Zaktualizuj istniejące zadanie cron",
    container: {
      title: "Aktualizuj zadanie Cron",
      description: "Zmodyfikuj ustawienia zadania",
    },
    fields: {
      id: {
        label: "ID zadania",
        description: "Unikalny identyfikator zadania",
      },
      name: {
        label: "Nazwa zadania",
        description: "Nazwa zadania",
        placeholder: "Wprowadź nazwę zadania",
      },
      description: {
        label: "Opis",
        description: "Opis zadania",
        placeholder: "Wprowadź opis zadania",
      },
      schedule: {
        label: "Harmonogram",
        description: "Wyrażenie harmonogramu cron",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Włączone",
        description: "Czy zadanie jest włączone",
      },
      priority: {
        label: "Priorytet",
        description: "Poziom priorytetu zadania",
        placeholder: "Wybierz priorytet",
      },
      category: {
        label: "Kategoria",
        description: "Kategoria zadania",
        placeholder: "Wybierz kategorię",
      },
      timeout: {
        label: "Limit czasu",
        description: "Maksymalny czas wykonania w sekundach",
        placeholder: "3600",
      },
      retries: {
        label: "Ponowienia",
        description: "Liczba prób ponowienia w przypadku niepowodzenia",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Próby ponowienia",
        description: "Liczba prób ponowienia w przypadku niepowodzenia",
      },
      retryDelay: {
        label: "Opóźnienie ponowienia",
        description: "Opóźnienie między ponowieniami w sekundach",
      },
    },
    response: {
      task: {
        title: "Zaktualizowane zadanie",
      },
      success: {
        title: "Sukces",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do aktualizacji tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Zadanie do aktualizacji nie zostało znalezione",
      },
      internal: {
        title: "Wewnętrzny błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego zadania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas aktualizacji zadania",
      },
    },
    success: {
      updated: {
        title: "Zadanie zaktualizowane",
        description: "Zadanie zaktualizowane pomyślnie",
      },
    },
  },
  delete: {
    title: "Usuń zadanie Cron",
    description: "Usuń zadanie cron",
    container: {
      title: "Usuń zadanie Cron",
      description: "Usuń zadanie z systemu",
    },
    fields: {
      id: {
        label: "ID zadania",
        description: "Unikalny identyfikator zadania do usunięcia",
      },
    },
    response: {
      success: {
        title: "Sukces",
      },
      message: {
        title: "Wiadomość",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID zadania jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Nie masz uprawnień do usunięcia tego zadania",
      },
      notFound: {
        title: "Zadanie nie znalezione",
        description: "Zadanie do usunięcia nie zostało znalezione",
      },
      internal: {
        title: "Wewnętrzny błąd serwera",
        description: "Wystąpił błąd podczas usuwania zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego zadania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Nie można usunąć zadania z powodu konfliktu",
      },
    },
    success: {
      deleted: {
        title: "Zadanie usunięte",
        description: "Zadanie usunięte pomyślnie",
      },
    },
  },
  widget: {
    notFound: "Nie znaleziono zadania",
    never: "Nigdy",
    history: "Historia",
    edit: "Edytuj",
    delete: "Usuń",
    enabled: "Włączone",
    disabled: "Wyłączone",
    identity: "Tożsamość",
    id: "ID zadania",
    version: "Wersja",
    category: "Kategoria",
    priority: "Priorytet",
    schedule: "Harmonogram",
    timezone: "Strefa czasowa",
    createdAt: "Utworzono",
    updatedAt: "Zaktualizowano",
    stats: {
      totalExecutions: "Łączne wykonania",
      successful: "Pomyślne",
      errors: "Błędy",
      successRate: "Wskaźnik sukcesu",
    },
    timingSection: "Czas",
    timing: {
      avgDuration: "Śr. czas trwania",
      lastDuration: "Ostatni czas trwania",
      lastRun: "Ostatnie uruchomienie",
      nextRun: "Następne uruchomienie",
      timeout: "Limit czasu",
      retries: "Ponowienia",
      retryDelay: "Opóźnienie ponowienia",
    },
    lastExecutionError: "Ostatni błąd",
    refresh: "Odśwież",
  },
};
