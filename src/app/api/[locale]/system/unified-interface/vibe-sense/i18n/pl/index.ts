import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 Minuta",
      "3m": "3 Minuty",
      "5m": "5 Minut",
      "15m": "15 Minut",
      "30m": "30 Minut",
      "1h": "1 Godzina",
      "4h": "4 Godziny",
      "1d": "1 Dzień",
      "1w": "1 Tydzień",
      "1M": "1 Miesiąc",
    },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analityka",
    pipeline: "potok",
  },
  registry: {
    get: {
      title: "Rejestr wskaźników",
      description:
        "Lista wszystkich zarejestrowanych wskaźników dostępnych do budowania grafu",
      container: {
        title: "Wskaźniki",
        description: "Wszystkie zarejestrowane wskaźniki",
      },
      response: { indicators: "Wskaźniki" },
      success: {
        title: "Rejestr załadowany",
        description: "Rejestr wskaźników pobrany pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować rejestru",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Rejestr nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
  },
  graphs: {
    list: {
      title: "Grafy potoków",
      description:
        "Lista wszystkich grafów widocznych dla bieżącego użytkownika",
      container: { title: "Grafy", description: "Wszystkie grafy potoków" },
      response: { graphs: "Grafy" },
      success: {
        title: "Grafy załadowane",
        description: "Grafy potoków pobrane pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować grafów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono grafów",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    create: {
      title: "Utwórz graf",
      description: "Utwórz nowy graf potoku",
      fields: {
        name: {
          label: "Nazwa",
          description: "Nazwa wyświetlana grafu",
          placeholder: "Mój graf",
        },
        slug: {
          label: "Slug",
          description: "Unikalny identyfikator",
          placeholder: "moj-graf",
        },
        description: {
          label: "Opis",
          description: "Opcjonalny opis",
          placeholder: "",
        },
        config: {
          label: "Konfiguracja",
          description: "Konfiguracja DAG grafu",
        },
      },
      response: { id: "ID grafu" },
      success: {
        title: "Graf utworzony",
        description: "Graf potoku utworzony pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się utworzyć grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja grafu",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasób nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Slug grafu już istnieje" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    get: {
      title: "Pobierz graf",
      description: "Pobierz określony graf według ID",
      fields: { id: { label: "ID grafu", description: "UUID wersji grafu" } },
      response: { graph: "Graf" },
      success: {
        title: "Graf załadowany",
        description: "Graf pobrany pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się załadować grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    edit: {
      title: "Edytuj graf",
      description:
        "Rozgałęź i edytuj graf (tworzy nową wersję, nigdy nie mutuje)",
      fields: {
        id: { label: "ID grafu", description: "UUID wersji do rozgałęzienia" },
        config: {
          label: "Konfiguracja",
          description: "Zaktualizowana konfiguracja grafu",
        },
        name: { label: "Nazwa", description: "Zaktualizowana nazwa" },
        description: { label: "Opis", description: "Zaktualizowany opis" },
      },
      response: { id: "ID nowej wersji" },
      success: {
        title: "Graf rozgałęziony",
        description: "Nowa wersja grafu utworzona pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się edytować grafu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowa konfiguracja",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    promote: {
      title: "Awansuj do systemu",
      description: "Awansuj graf administratora do właściciela systemu",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu do awansu" },
      },
      response: { id: "ID grafu" },
      success: {
        title: "Graf awansowany",
        description: "Graf pomyślnie awansowany do systemu",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: { title: "Błąd serwera", description: "Awans nie powiódł się" },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe ID",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    trigger: {
      title: "Uruchom graf",
      description: "Ręcznie uruchom wykonanie grafu na żądanie",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu do uruchomienia" },
        rangeFrom: { label: "Od", description: "Początek zakresu (data ISO)" },
        rangeTo: { label: "Do", description: "Koniec zakresu (data ISO)" },
      },
      response: {
        nodeCount: "Wykonane węzły",
        errorCount: "Błędy",
        errors: "Błędy",
      },
      success: {
        title: "Graf wykonany",
        description: "Graf wykonany pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Wykonanie grafu nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    backtest: {
      title: "Uruchom backtest",
      description:
        "Uruchom backtest na historycznym zakresie (akcje symulowane)",
      fields: {
        id: { label: "ID grafu", description: "UUID wersji grafu" },
        rangeFrom: {
          label: "Od",
          description: "Początek zakresu backtestowego",
        },
        rangeTo: { label: "Do", description: "Koniec zakresu backtestowego" },
        resolution: {
          label: "Rozdzielczość",
          description: "Ramy czasowe do oceny",
        },
      },
      response: {
        runId: "ID przebiegu",
        eligible: "Kwalifikuje się",
        ineligibleNodes: "Niekwalifikujące węzły",
      },
      success: {
        title: "Backtest zakończony",
        description: "Backtest przeprowadzony pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Backtest nie powiódł się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    data: {
      title: "Dane grafu",
      description: "Pobierz dane szeregów czasowych dla grafu",
      fields: {
        id: { label: "ID grafu", description: "UUID grafu" },
        rangeFrom: { label: "Od", description: "Początek zakresu" },
        rangeTo: { label: "Do", description: "Koniec zakresu" },
      },
      response: { series: "Serie", signals: "Sygnały" },
      success: {
        title: "Dane załadowane",
        description: "Dane grafu pobrane pomyślnie",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się pobrać danych",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Graf nie znaleziony",
        },
        conflict: { title: "Konflikt", description: "Konflikt zasobów" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
  },
  cleanup: {
    post: {
      title: "Czyszczenie Vibe Sense",
      description: "Uruchom czyszczenie retencji dla punktów danych",
      success: {
        title: "Czyszczenie zakończone",
        description: "Czyszczenie retencji zakończone",
      },
      response: {
        nodesProcessed: "Przetworzone węzły",
        totalDeleted: "Usunięte wiersze",
        snapshotsDeleted: "Usunięte migawki",
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Wymagany dostęp administratora",
        },
        server: {
          title: "Błąd serwera",
          description: "Czyszczenie nie powiodło się",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie",
        },
        notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
        conflict: { title: "Konflikt", description: "Konflikt" },
        network: {
          title: "Błąd sieci",
          description: "Żądanie sieciowe nie powiodło się",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Najpierw zapisz zmiany",
        },
      },
    },
    name: "Czyszczenie Vibe Sense",
    description: "Usuwa stare punkty danych i wygasa pamięć podręczną migawek",
  },
};
