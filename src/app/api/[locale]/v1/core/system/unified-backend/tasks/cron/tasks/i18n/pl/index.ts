import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    tasks: "Tasks",
  },
  list: {
    columns: {
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  get: {
    title: "Lista zadań Cron",
    description: "Pobierz listę zadań cron z opcjonalnym filtrowaniem",
    container: {
      title: "Lista zadań Cron",
      description: "Filtruj i wyświetlaj zadania cron",
    },
    fields: {
      status: {
        label: "Status",
        description: "Filtruj według statusu zadania",
        placeholder: "Wybierz status...",
      },
      priority: {
        label: "Priorytet",
        description: "Filtruj według priorytetu zadania",
        placeholder: "Wybierz priorytet...",
      },
      category: {
        label: "Kategoria",
        description: "Filtruj według kategorii zadania",
        placeholder: "Wybierz kategorię...",
      },
      enabled: {
        label: "Włączone",
        description: "Filtruj według statusu włączenia",
      },
      limit: {
        label: "Limit",
        description: "Maksymalna liczba zadań do zwrócenia",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba zadań do pominięcia",
      },
    },
    response: {
      tasks: {
        title: "Zadania",
      },
      task: {
        title: "Zadanie",
        description: "Informacje o indywidualnym zadaniu",
        id: "ID zadania",
        name: "Nazwa zadania",
        taskDescription: "Opis",
        schedule: "Harmonogram",
        enabled: "Włączone",
        priority: "Priorytet",
        status: "Status",
        category: "Kategoria",
        lastRun: "Ostatnie uruchomienie",
        nextRun: "Następne uruchomienie",
        version: "Wersja",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
      totalTasks: "Łączna liczba zadań",
    },
    errors: {
      internal: {
        title: "Wystąpił błąd wewnętrzny serwera podczas pobierania zadań",
        description:
          "Wystąpił nieoczekiwany błąd podczas pobierania listy zadań",
      },
      unauthorized: {
        title: "Nieautoryzowany dostęp do listy zadań",
        description: "Nie masz uprawnień do wyświetlania listy zadań",
      },
      validation: {
        title: "Nieprawidłowe parametry żądania",
        description: "Podane parametry żądania są nieprawidłowe",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      notFound: {
        title: "Zadania nie znalezione",
        description: "Nie znaleziono zadań spełniających kryteria",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania zadań",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany, które wymagają uwagi",
      },
      conflict: {
        title: "Błąd konfliktu",
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      retrieved: {
        title: "Zadania pobrane pomyślnie",
        description: "Lista zadań została pomyślnie pobrana",
      },
    },
  },
  post: {
    title: "Utwórz zadanie Cron",
    description: "Utwórz nowe zadanie cron",
    container: {
      title: "Utwórz zadanie",
      description: "Skonfiguruj nowe zadanie cron",
    },
    fields: {
      name: {
        label: "Nazwa zadania",
        description: "Unikalna nazwa zadania",
        placeholder: "Wprowadź nazwę zadania...",
      },
      description: {
        label: "Opis",
        description: "Opis zadania",
        placeholder: "Wprowadź opis...",
      },
      schedule: {
        label: "Harmonogram",
        description: "Wyrażenie harmonogramu Cron",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priorytet",
        description: "Poziom priorytetu zadania",
      },
      category: {
        label: "Kategoria",
        description: "Kategoria zadania",
      },
      enabled: {
        label: "Włączone",
        description: "Włącz lub wyłącz zadanie",
      },
      timeout: {
        label: "Limit czasu (ms)",
        description: "Maksymalny czas wykonania w milisekundach",
      },
      retries: {
        label: "Ponowne próby",
        description: "Liczba prób ponowienia",
      },
      retryDelay: {
        label: "Opóźnienie ponowienia (ms)",
        description: "Opóźnienie między ponownymi próbami w milisekundach",
      },
    },
    response: {
      task: {
        title: "Utworzone zadanie",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podane dane zadania są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do tworzenia zadań",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas tworzenia zadania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      conflict: {
        title: "Konflikt",
        description: "Zadanie o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      created: {
        title: "Zadanie utworzone",
        description: "Zadanie zostało pomyślnie utworzone",
      },
    },
  },
};
