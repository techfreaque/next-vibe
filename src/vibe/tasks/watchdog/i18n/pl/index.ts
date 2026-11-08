import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Strażnik zadań",
  tags: {
    taskWatchdog: "straznik-zadan",
    vibeSense: "vibe-sense",
    budget: "budzet",
  },
  enums: {
    incidentType: {
      all: "Wszystkie incydenty",
      timeout: "Przekroczenie czasu",
      loop: "Pętla",
      budget: "Budżet",
      transientRetryExhausted: "Wyczerpane ponowienia",
      watchdogCancel: "Anulowanie przez strażnika",
    },
    budgetScope: {
      task: "Na uruchomienie zadania",
      day: "Na dzień (wszystkie zadania)",
      goal: "Na cel, na dzień",
    },
    spendKind: {
      model: "Tura modelu",
      tool: "Wywołanie narzędzia",
    },
    healthMetric: {
      started: "Uruchomione zadania",
      completed: "Ukończone zadania",
      failed: "Nieudane zadania",
      watchdogCancelled: "Zadania anulowane przez strażnika",
      avgDuration: "Średni czas trwania (sekundy)",
      p95Duration: "95. percentyl czasu trwania (sekundy)",
      creditSpend: "Kredyty wydane przez zadania",
      incidents: "Incydenty",
    },
  },
  sweep: {
    post: {
      title: "Przegląd strażnika zadań",
      titleShort: "Przegląd strażnika",
      description:
        "Wyszukuje zawieszone, zapętlone i osierocone zadania w tle, zatrzymuje je z zapisanym powodem i otwiera incydent. Działa co minutę.",
      container: {
        title: "Wynik przeglądu",
        description: "Co strażnik znalazł i zrobił w tym przebiegu",
      },
      response: {
        checked: "Sprawdzone działające zadania",
        cancelled: "Anulowane (przekroczony limit)",
        orphaned: "Odzyskane osierocone uruchomienia",
        loops: "Wyłączone zapętlone zadania",
        incidents: "Otwarte incydenty",
      },
    },
    task: {
      description:
        "Zatrzymuje zadania, które trwają za długo, zapętlają się lub straciły proces. Każde zatrzymanie otwiera incydent.",
    },
  },
  health: {
    get: {
      title: "Kondycja zadań",
      titleShort: "Kondycja zadań",
      description:
        "Działające zadania z wiekiem, turami i wydatkami, ostatnie błędy i otwarte incydenty. Stąd anulujesz zadanie.",
      response: {
        running: "Działające zadania",
        failures: "Ostatnie błędy",
        incidents: "Otwarte incydenty",
        daySpent: "Kredyty wydane dziś",
        dayCap: "Limit dzienny",
      },
      widget: {
        title: "Kondycja zadań",
        subtitle: "Każde uruchomienie jest pod kontrolą. Zawieszone giną.",
        refresh: "Odśwież",
        loading: "Wczytywanie kondycji zadań…",
        spendToday: "{{spent}} z {{cap}} kredytów wydanych dziś przez zadania",
        running: {
          title: "Działa teraz",
          empty: "Nic nie działa.",
        },
        failures: {
          title: "Ostatnie błędy",
          empty: "Brak błędów w ostatnich 24 godzinach.",
        },
        incidents: {
          title: "Otwarte incydenty",
          empty: "Brak otwartych incydentów.",
        },
        age: "Wiek",
        turns: "Tury",
        toolCalls: "Wywołania narzędzi",
        spend: "Wydano",
        goal: "Cel {{goal}}",
        limit: "limit {{limit}}",
        lastError: "Ostatni błąd",
        noError: "Brak zapisanego błędu",
        cancel: "Anuluj",
        cancelling: "Anulowanie…",
        resolve: "Załatwione",
        credits: "{{amount}} kr",
      },
    },
  },
  cancel: {
    post: {
      title: "Anuluj zadanie",
      titleShort: "Anuluj zadanie",
      description:
        "Zatrzymuje działające zadanie (razem z pętlą AI) i zapisuje anulowanie albo oznacza incydent jako załatwiony.",
      fields: {
        taskId: {
          label: "ID zadania",
          description: "Działające zadanie do zatrzymania",
          placeholder: "ID zadania",
        },
        incidentId: {
          label: "ID incydentu",
          description: "Incydent do oznaczenia jako załatwiony",
        },
      },
      response: {
        cancelled: "Zadanie anulowane",
        resolved: "Incydent załatwiony",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Limity budżetu zadań",
      titleShort: "Limity budżetu",
      description:
        "Limity kredytów, które zatrzymują zadania w tle: na uruchomienie, na dzień i na cel.",
      response: {
        rows: "Limity",
        daySpent: "Kredyty wydane dziś",
      },
      widget: {
        title: "Limity budżetu zadań",
        subtitle:
          "Zadanie, które osiągnie limit, zatrzymuje się czysto. Limit dzienny to twardy sufit dla wszystkich uruchomień bez nadzoru.",
        refresh: "Odśwież",
        add: "Ustaw limit",
        loading: "Wczytywanie limitów…",
        empty: {
          title: "Brak limitów",
          hint: "Obowiązują wartości domyślne: 100 kredytów na uruchomienie, 1000 na dzień, 500 na cel.",
          cta: "Ustaw pierwszy limit",
        },
        spentToday: "{{spent}} kredytów wydanych dziś",
        enabled: "Aktywny",
        disabled: "Wyłączony",
        credits: "{{amount}} kredytów",
        none: "brak",
      },
    },
    post: {
      title: "Ustaw limit budżetu zadań",
      titleShort: "Ustaw limit",
      description:
        "Utwórz lub zmień limit kredytów. Jeden limit na zakres i klucz. Klucz zadania * to wartość domyślna dla każdego zadania.",
      fields: {
        scope: {
          label: "Zakres",
          description: "Co limit ogranicza",
        },
        key: {
          label: "Klucz",
          description:
            "Zadanie: ID zadania lub *. Dzień: global. Cel: nazwa celu lub * (tag goal:<nazwa> na zadaniu)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Maks. kredytów",
          description:
            "Wydatek na tym poziomie lub wyżej zatrzymuje zadanie. 0 blokuje je.",
        },
        enabled: {
          label: "Aktywny",
          description: "Wyłączony zostaje w bazie, ale jest ignorowany",
        },
        note: {
          label: "Notatka",
          description: "Po co jest ten limit",
          placeholder: "Nocni agenci badawczy",
        },
      },
      response: {
        id: "ID limitu",
      },
      widget: {
        back: "Wstecz",
        hint: "Limit zatrzymuje zadanie, gdy wydatek go osiągnie. Limit dzienny obowiązuje zawsze.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: { label: "Rozdzielczość", description: "Rozmiar przedziału" },
      range: { label: "Zakres", description: "Zakres czasu do zapytania" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
      metric: {
        label: "Miara",
        description:
          "Uruchomione, ukończone, nieudane, anulowane przez strażnika zadania, czas trwania, wydatek kredytów lub incydenty",
      },
      incidentType: {
        label: "Typ incydentu",
        description: "Tylko dla miary incydentów. Domyślnie wszystkie typy",
      },
    },
    taskHealth: {
      post: {
        title: "Kondycja zadań",
        titleShort: "Kondycja zadań",
        description:
          "Uruchomienia zadań w tle, czas trwania, wydatek kredytów i incydenty strażnika na przedział",
        fields: {
          result: {
            label: "Wartość",
            description: "Wartość miary na przedział",
          },
        },
      },
    },
  },
  errors: {
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź zaznaczone pola",
    },
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się jako admin",
    },
    forbidden: {
      title: "Tylko dla adminów",
      description: "Narzędzia strażnika zadań wymagają roli admina",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "To zadanie lub incydent nie istnieje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Wpis zmienił się w międzyczasie, odśwież i spróbuj ponownie",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie udało się zrealizować żądania",
    },
    network: {
      title: "Błąd sieci",
      description: "Żądanie nie dotarło do serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Coś nieoczekiwanego się nie powiodło",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Najpierw zapisz lub odrzuć zmiany",
    },
    nothingToDo:
      "Podaj ID zadania do anulowania albo ID incydentu do załatwienia",
    taskNotRunning: "Zadanie {{taskId}} nie działa",
    incidentNotFound: "Incydent {{incidentId}} nie istnieje",
    invalidCap: "Limit wymaga kwoty od 0 i klucza",
  },
  success: {
    title: "Gotowe",
    description: "Zapisano",
  },
};
