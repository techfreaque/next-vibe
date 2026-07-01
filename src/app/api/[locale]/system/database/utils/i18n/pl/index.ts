import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",

  dockerOperations: {
    title: "Operacje Docker",
    description: "Wykonywanie poleceń Docker i zarządzanie kontenerami",
    category: "Docker",
    tags: {
      docker: "Docker",
      utils: "Narzędzia",
      dockeroperations: "Operacje Docker",
    },
    container: {
      title: "Operacje Docker",
      description: "Wykonywanie poleceń Docker z właściwą obsługą błędów",
    },
    fields: {
      command: {
        label: "Polecenie Docker",
        description: "Polecenie Docker do wykonania",
        placeholder: "docker ps",
      },
      options: {
        label: "Opcje wykonania",
        description: "Opcje konfiguracji dla wykonania polecenia",
        placeholder: "Skonfiguruj opcje timeout i logowania",
      },
    },
    response: {
      success: {
        label: "Polecenie pomyślne",
      },
      output: {
        label: "Wynik polecenia",
      },
      error: {
        label: "Szczegóły błędu",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry polecenia Docker",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie dla operacji Docker",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia dla operacji Docker",
      },
      internal: {
        title: "Błąd Docker",
        description: "Wykonanie polecenia Docker nie powiodło się",
      },
      timeout: {
        title: "Timeout polecenia",
        description: "Polecenie Docker przekroczyło limit czasu",
      },
      executionFailed: {
        title: "Wykonanie nie powiodło się",
        description: "Wykonanie polecenia Docker nie powiodło się",
      },
      composeDownFailed: {
        title: "Compose Down nie powiodło się",
        description: "Operacja Docker Compose down nie powiodła się",
      },
      composeUpFailed: {
        title: "Compose Up nie powiodło się",
        description: "Operacja Docker Compose up nie powiodła się",
      },
    },
    success: {
      title: "Polecenie Docker pomyślne",
      description: "Polecenie Docker wykonane pomyślnie",
    },
    messages: {
      executingCommand: "Wykonywanie polecenia Docker: {command}",
      timeoutError:
        "Polecenie Docker przekroczyło limit czasu po {timeout}ms: {command}",
      commandFailed:
        "Polecenie Docker nie powiodło się z kodem {code}: {command}",
      executionFailed: "Nie udało się wykonać polecenia Docker: {command}",
      commandError: "Błąd polecenia Docker: {error}",
    },
  },
  title: "Narzędzia bazy danych",
  titleShort: "Narzędzia DB",
  description: "Funkcje pomocnicze do operacji bazy danych",
  tag: "utils",
  includeDetails: {
    title: "Uwzględnij szczegóły",
    description: "Uwzględnij szczegółowe informacje w odpowiedzi",
  },
  checkConnections: {
    title: "Sprawdź połączenia",
    description: "Sprawdź status połączenia z bazą danych",
  },
  status: {
    title: "Status zdrowia",
  },
  timestamp: {
    title: "Znacznik czasu",
  },
  connections: {
    title: "Status połączenia",
    primary: "Połączenie główne",
    replica: "Połączenie repliki",
  },
  details: {
    title: "Szczegóły bazy danych",
    version: "Wersja",
    uptime: "Czas działania (sekundy)",
    activeConnections: "Aktywne połączenia",
    maxConnections: "Maksymalna liczba połączeń",
  },
  errors: {
    health_check_failed: "Sprawdzenie stanu bazy danych nie powiodło się",
    connection_failed: "Połączenie z bazą danych nie powiodło się",
    stats_failed: "Nie udało się pobrać statystyk bazy danych",
    docker_check_failed: "Sprawdzenie dostępności Docker nie powiodło się",
    reset_failed: "Operacja resetowania bazy danych nie powiodła się",
    manage_failed: "Operacja zarządzania bazą danych nie powiodła się",
    reset_operation_failed: "Operacja resetowania nie powiodła się",
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry narzędzi bazy danych",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uwierzytelnienie dla narzędzi bazy danych",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Operacja narzędzia bazy danych nie powiodła się",
    },
  },
  success: {
    title: "Narzędzia bazy danych pomyślne",
    description: "Operacje narzędzi bazy danych zakończone pomyślnie",
  },
  docker: {
    executing_command: "Wykonywanie polecenia Docker: {{command}}",
    command_timeout:
      "Polecenie Docker przekroczyło czas {{timeout}}ms: {{command}}",
    command_failed:
      "Polecenie Docker nie powiodło się z kodem {{code}}: {{command}}",
    execution_failed: "Nie udało się wykonać polecenia Docker: {{command}}",
    command_error: "Błąd polecenia Docker: {{error}}",
    stopping_containers: "Zatrzymywanie kontenerów Docker...",
    starting_containers: "Uruchamianie kontenerów Docker...",
  },
};
