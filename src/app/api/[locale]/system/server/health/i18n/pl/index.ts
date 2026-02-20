import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Zdrowie",
  get: {
    title: "Sprawdzenie Zdrowia",
    description: "Pobierz status zdrowia serwera i diagnostykę",
    form: {
      title: "Opcje sprawdzania zdrowia",
      description: "Skonfiguruj parametry sprawdzania zdrowia",
    },
    fields: {
      detailed: {
        title: "Szczegółowy raport",
        description: "Dołącz szczegółowe informacje systemowe",
      },
      includeDatabase: {
        title: "Dołącz bazę danych",
        description: "Dołącz sprawdzanie zdrowia bazy danych",
      },
      includeTasks: {
        title: "Dołącz zadania",
        description: "Dołącz sprawdzanie zdrowia task runnera",
      },
      includeSystem: {
        title: "Dołącz system",
        description: "Dołącz informacje o zasobach systemowych",
      },
    },
    response: {
      status: {
        title: "Status",
        description: "Ogólny status zdrowia",
      },
      timestamp: {
        title: "Znacznik czasu",
        description: "Czas sprawdzenia zdrowia",
      },
      uptime: {
        title: "Czas działania",
        description: "Czas działania serwera w sekundach",
      },
      environment: {
        title: "Środowisko",
        description: "Informacje o środowisku serwera",
        name: {
          title: "Nazwa środowiska",
        },
        nodeEnv: {
          title: "Środowisko Node",
        },
        platform: {
          title: "Platforma",
        },
        supportsTaskRunners: {
          title: "Obsługuje task-runnery",
        },
      },
      database: {
        title: "Status bazy danych",
        description: "Status połączenia z bazą danych",
        status: {
          title: "Status połączenia",
        },
        responseTime: {
          title: "Czas odpowiedzi (ms)",
        },
        error: {
          title: "Komunikat błędu",
        },
      },
      tasks: {
        title: "Status zadań",
        description: "Status task runnera",
        runnerStatus: {
          title: "Status uruchamiania",
        },
        activeTasks: {
          title: "Aktywne zadania",
        },
        totalTasks: {
          title: "Łączne zadania",
        },
        errors: {
          title: "Liczba błędów",
        },
        lastError: {
          title: "Ostatni błąd",
        },
      },
      system: {
        title: "Informacje systemowe",
        description: "Informacje o zasobach systemowych",
        memory: {
          title: "Użycie pamięci",
          description: "Informacje o pamięci systemowej",
          used: {
            title: "Używana pamięć",
          },
          total: {
            title: "Całkowita pamięć",
          },
          percentage: {
            title: "Użycie pamięci %",
          },
        },
        cpu: {
          title: "Użycie CPU",
          description: "Informacje o CPU systemowym",
          usage: {
            title: "Użycie CPU %",
          },
          loadAverage: {
            title: "Średnie obciążenie",
          },
        },
        disk: {
          title: "Użycie dysku",
          description: "Informacje o dysku systemowym",
          available: {
            title: "Dostępne miejsce",
          },
          total: {
            title: "Całkowite miejsce",
          },
          percentage: {
            title: "Użycie dysku %",
          },
        },
      },
      checks: {
        title: "Kontrole zdrowia",
        description: "Kontrole zdrowia poszczególnych komponentów",
        item: {
          title: "Kontrola zdrowia",
          description: "Wynik indywidualnej kontroli zdrowia",
          name: {
            title: "Nazwa kontroli",
          },
          status: {
            title: "Status kontroli",
          },
          message: {
            title: "Komunikat kontroli",
          },
          duration: {
            title: "Czas trwania (ms)",
          },
        },
      },
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
      server: {
        title: "Błąd serwera",
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
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Sprawdzenie zdrowia zakończone pomyślnie",
    },
  },
};
