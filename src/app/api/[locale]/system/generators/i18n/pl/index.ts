import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",
  clientRoutesIndex: {
    category: "Generatory",

    post: {
      title: "Generuj indeks tras klienta",
      description: "Automatycznie generuj plik indeksu tras klienta",
      container: {
        title: "Generator indeksu tras klienta",
      },
      fields: {
        outputFile: {
          label: "Plik wyjściowy",
          description: "Ścieżka do pliku wyjściowego",
        },
        dryRun: {
          label: "Uruchomienie próbne",
          description: "Podgląd zmian bez zapisu do pliku",
        },
        success: {
          title: "Sukces",
        },
        message: {
          title: "Wiadomość",
        },
        routesFound: {
          title: "Znalezione trasy",
        },
        duration: {
          title: "Czas trwania (ms)",
        },
      },
      errors: {
        validation: {
          title: "Nieprawidłowe dane",
          description: "Sprawdź konfigurację i spróbuj ponownie",
        },
        network: {
          title: "Błąd połączenia",
          description: "Nie udało się wygenerować indeksu. Spróbuj ponownie",
        },
        unauthorized: {
          title: "Wymagane logowanie",
          description: "Zaloguj się, aby użyć tego generatora",
        },
        forbidden: {
          title: "Brak dostępu",
          description: "Nie masz uprawnień do użycia tego generatora",
        },
        notFound: {
          title: "Nie znaleziono tras",
          description: "Nie można znaleźć tras do wygenerowania",
        },
        server: {
          title: "Generowanie nie powiodło się",
          description: "Nie udało się wygenerować indeksu. Spróbuj ponownie",
        },
        unknown: {
          title: "Nieoczekiwany błąd",
          description: "Coś nieoczekiwanego się wydarzyło. Spróbuj ponownie",
        },
        conflict: {
          title: "Konflikt pliku",
          description: "Plik indeksu ma konflikty. Rozwiąż je najpierw",
        },
      },
      success: {
        title: "Indeks wygenerowany",
        description: "Indeks tras klienta został pomyślnie wygenerowany",
      },
    },
  },
  emailTemplates: {
    category: "Generatory",

    post: {
      title: "Generate Email Templates",
      description: "Generate email template registry with lazy loading",
      container: {
        title: "Email Template Generator Configuration",
      },
      success: {
        title: "Generation Complete",
        description: "Email templates generated successfully",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to generated registry file",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Result Message",
        },
        templatesFound: {
          title: "Templates Found",
        },
        duration: {
          title: "Generation Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry generatora szablonów e-mail",
        },
        network: {
          title: "Błąd sieci",
          description: "Błąd sieci podczas generowania szablonów",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Nie masz uprawnień do generowania szablonów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Generowanie szablonów jest zabronione",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono katalogu szablonów",
        },
        server: {
          title: "Błąd serwera",
          description: "Nie udało się wygenerować szablonów e-mail",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Masz niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt podczas generowania",
        },
      },
    },
    success: {
      generated: "Email template registry generated successfully",
    },
  },
  endpoint: {
    category: "Generatory",

    post: {
      title: "Endpoint Generator",
      description: "Generate endpoint.ts with dynamic imports",
      container: {
        title: "Endpoint Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output endpoint.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        endpointsFound: {
          title: "Endpoints Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Endpoint generator completed successfully",
        generated: "Endpoint file generated successfully",
      },
    },
  },
  env: {
    category: "Generatory",

    post: {
      title: "Generator Srodowiska",
      description: "Generuje skonsolidowane pliki konfiguracji srodowiska",
      form: {
        title: "Konfiguracja Srodowiska",
        description: "Skonfiguruj parametry generowania srodowiska",
      },
      fields: {
        outputDir: {
          label: "Katalog wyjsciowy",
          description: "Katalog do zapisu wygenerowanych plikow",
        },
        verbose: {
          label: "Szczegolowo",
          description: "Pokaz szczegolowe dane wyjsciowe",
        },
        dryRun: {
          label: "Probny przebieg",
          description: "Podglad bez zapisywania plikow",
        },
        success: {
          label: "Sukces",
        },
        message: {
          label: "Wiadomosc",
        },
        serverEnvFiles: {
          label: "Pliki Env serwera",
        },
        clientEnvFiles: {
          label: "Pliki Env klienta",
        },
        duration: {
          label: "Czas trwania",
        },
        outputPaths: {
          label: "Sciezki wyjsciowe",
        },
      },
      errors: {
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Wymagane uwierzytelnienie",
        },
        validation: {
          title: "Blad walidacji",
          description: "Wykryto nieprawidlowe eksporty plikow env",
        },
        server: {
          title: "Blad serwera",
          description: "Wystapil wewnetrzny blad serwera",
        },
        unknown: {
          title: "Nieznany blad",
          description: "Wystapil nieznany blad",
        },
        network: {
          title: "Blad sieci",
          description: "Wystapil blad sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostep zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zasob nie znaleziony",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystapil konflikt danych",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Sa niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Pliki srodowiska wygenerowane pomyslnie",
      },
    },
    tags: {
      env: "srodowisko",
    },
    error: {
      validation_failed: "Walidacja pliku env nie powiodla sie",
      generation_failed: "Generowanie env nie powiodlo sie",
      noValidFiles: "Nie znaleziono żadnych ważnych plików środowiskowych",
    },
    success: {
      generated: "Pliki srodowiska wygenerowane pomyslnie",
    },
  },
  generateAll: {
    category: "Generatory",

    post: {
      title: "Generuj wszystko",
      description: "Uruchom wszystkie generatory kodu",
      container: {
        title: "Konfiguracja Generuj wszystko",
        description: "Skonfiguruj parametry generowania",
      },
      fields: {
        rootDir: {
          label: "Katalog główny",
          description: "Katalog główny do generowania",
        },
        outputDir: {
          label: "Katalog wyjściowy",
          description: "Katalog wyjściowy dla wygenerowanych plików",
        },
        verbose: {
          label: "Szczegółowe wyjście",
          description: "Włącz szczegółowe logowanie",
        },
        skipEndpoints: {
          label: "Pomiń punkty końcowe",
          description: "Pomiń generowanie punktów końcowych",
        },
        skipSeeds: {
          label: "Pomiń seedy",
          description: "Pomiń generowanie seedów",
        },
        skipTaskIndex: {
          label: "Pomiń indeks zadań",
          description: "Pomiń generowanie indeksu zadań",
        },
        enableTrpc: {
          label: "Włącz tRPC",
          description: "Generuj router tRPC (opt-in)",
        },
        skipTanstack: {
          label: "Pomiń TanStack",
          description: "Pomiń generowanie tras TanStack",
        },
        force: {
          label: "Wymuś",
          description: "Ignoruj cache i uruchom wszystkie generatory",
        },
        success: {
          title: "Sukces",
        },
        generationCompleted: {
          title: "Generowanie zakończone",
        },
        output: {
          title: "Wyjście",
        },
        generationStats: {
          title: "Statystyki generowania",
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
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
  generateTrpcRouter: {
    category: "Generatory",

    title: "Generuj router tRPC",
    description: "Generuj router tRPC z endpointów API",
    tag: "tRPC",
    container: {
      title: "Generowanie routera tRPC",
      description: "Generuj konfigurację routera tRPC",
    },
    fields: {
      apiDir: {
        title: "Katalog API",
        description: "Katalog zawierający pliki tras API",
      },
      outputFile: {
        title: "Plik wyjściowy",
        description: "Ścieżka do wygenerowanego pliku routera tRPC",
      },
      includeWarnings: {
        title: "Uwzględnij ostrzeżenia",
        description: "Uwzględnij komunikaty ostrzegawcze w wyniku",
      },
      excludePatterns: {
        title: "Wzorce wykluczenia",
        description: "Wzorce do wykluczenia z generowania routera tRPC",
      },
      success: {
        title: "Sukces",
      },
      generationCompleted: {
        title: "Generowanie zakończone",
      },
      output: {
        title: "Wynik",
      },
      generationStats: {
        title: "Statystyki generowania",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry generowania routera tRPC",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas generowania routera tRPC",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Brak uprawnień do generowania routera tRPC",
      },
    },
    success: {
      title: "Router tRPC wygenerowany",
      description: "Router tRPC został pomyślnie wygenerowany",
    },
    validation: {
      title: "Walidacja TRPC",
      description: "Waliduj integrację TRPC w plikach tras",
      category: "Generatory",
      tags: {
        trpc: "tRPC",
        validation: "Walidacja",
      },
      operations: {
        validateIntegration: "Waliduj integrację",
        validateRouteFile: "Waliduj plik trasy",
        generateReport: "Generuj raport",
        fixRoutes: "Napraw trasy",
        checkRouterExists: "Sprawdź czy router istnieje",
      },
      severity: {
        error: "Błąd",
        warning: "Ostrzeżenie",
        info: "Informacja",
      },
      fields: {
        operation: {
          label: "Operacja",
          description: "Wybierz operację walidacji",
          placeholder: "Wybierz operację",
        },
        filePath: {
          label: "Ścieżka pliku",
          description: "Konkretna ścieżka pliku trasy do walidacji",
          placeholder: "Wprowadź ścieżkę pliku",
        },
        options: {
          label: "Opcje",
          description: "Opcje walidacji",
          placeholder: "Wprowadź opcje",
        },
      },
      response: {
        operation: {
          label: "Operacja",
        },
        success: {
          label: "Sukces",
        },
        result: {
          label: "Wynik",
        },
      },
      success: {
        title: "Walidacja TRPC zakończona sukcesem",
        description: "Walidacja TRPC zakończona pomyślnie",
      },
      errors: {
        validation: {
          title: "Walidacja nie powiodła się",
          description: "Walidacja TRPC nie powiodła się",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Nie masz uprawnień do wykonania tej akcji",
        },
        forbidden: {
          title: "Zabronione",
          description: "Nie masz uprawnień do wykonania tej akcji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Żądany zasób nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        unsavedChanges: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wystąpił konflikt",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        executionFailed: {
          title: "Wykonanie nieudane",
          description: "Operacja walidacji TRPC nie powiodła się",
        },
      },
    },
    trpcValidator: {
      apiDirectoryNotFound: "Katalog API nie znaleziony: {{resolvedApiDir}}",
      foundRouteFiles: "Znaleziono {{count}} plików tras do walidacji",
      validationComplete: "Walidacja zakończona: {{status}}",
      passed: "ZALICZONE",
      failed: "NIEZALICZONE",
      errorsSummary: "Błędy: {{errorCount}}, Ostrzeżenia: {{warningCount}}",
      validationFailed: "Walidacja nie powiodła się: {{message}}",
      definitionImportFrom: "./definition",
      definitionImportFromTs: "./definition.ts",
      enhancedApiHandlerCall: "enhancedApiHandler(",
      exportConstTrpc: "export const trpc",
      routerNotFound:
        "Plik routera tRPC nie znaleziony. Uruchom 'vibe generate-trpc', aby go utworzyć.",
      routeHasDefinitionNoHandler:
        "Trasa ma definicję, ale nie używa enhancedApiHandler",
      routeHasHandlerNoTrpc:
        "Trasa używa enhancedApiHandler, ale brakuje eksportu tRPC",
      routeMissingNextExports:
        "Trasa nie ma eksportów Next.js (potrzebne dla wsparcia React Native)",
      apiHandlerOld: "apiHandler(",
      routeUsesOldHandler:
        "Trasa nadal używa starego apiHandler, powinno zostać zmigrowane do enhancedApiHandler",
      autoFixNotImplemented:
        "Automatyczna naprawa jeszcze nie zaimplementowana. Uruchom skrypt migracji ręcznie.",
      failedToReadRoute: "Nie udało się odczytać pliku trasy: {{message}}",
      reportTitle: "# Raport Walidacji Integracji tRPC",
      reportStatus: "**Status:** {{status}}",
      reportStatusPassed: "✅ ZALICZONE",
      reportStatusFailed: "❌ NIEZALICZONE",
      reportRouteFiles: "**Pliki tras:** {{count}}",
      reportErrors: "**Błędy:** {{count}}",
      reportWarnings: "**Ostrzeżenia:** {{count}}",
      errorsSection: "## Błędy",
      warningsSection: "## Ostrzeżenia",
      routeFileDetails: "## Szczegóły plików tras",
      definitionField: "- Definicja: {{status}}",
      enhancedHandlerField: "- Enhanced Handler: {{status}}",
      trpcExportField: "- Eksport tRPC: {{status}}",
      nextExportField: "- Eksport Next.js: {{status}}",
      errorsList: "**Błędy:**",
      warningsList: "**Ostrzeżenia:**",
      checkmark: "✅",
      crossmark: "❌",
      warningIcon: "⚠️",
      directoriesSkip: {
        trpc: "trpc",
        generated: "generated",
        nodeModules: "node_modules",
      },
      routeFileName: "route.ts",
    },
  },
  routeHandlers: {
    category: "Generatory",

    post: {
      title: "Route Handlers Generator",
      description: "Generate route-handlers.ts with dynamic imports",
      container: {
        title: "Route Handlers Generator Configuration",
      },
      fields: {
        outputFile: {
          label: "Output File",
          description: "Path to the output route-handlers.ts file",
          title: "Output File",
        },
        dryRun: {
          label: "Dry Run",
          description: "Preview changes without writing files",
          title: "Dry Run",
        },
        success: {
          title: "Success",
        },
        message: {
          title: "Message",
        },
        routesFound: {
          title: "Routes Found",
        },
        duration: {
          title: "Duration (ms)",
        },
      },
      errors: {
        validation: {
          title: "Validation Error",
          description: "Invalid request parameters",
        },
        server: {
          title: "Server Error",
          description: "Internal server error occurred",
        },
      },
      success: {
        title: "Success",
        description: "Route handlers generator completed successfully",
        generated: "Route handlers file generated successfully",
      },
    },
  },
  seeds: {
    category: "Generatory",

    post: {
      title: "Tytuł",
      description: "Opis endpointu",
      form: {
        title: "Konfiguracja",
        description: "Skonfiguruj parametry",
      },
      response: {
        title: "Odpowiedź",
        description: "Dane odpowiedzi",
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
        description: "Operacja zakończona pomyślnie",
        generated: "Seeds wygenerowane pomyślnie",
      },
    },
    error: {
      generation_failed: "Generowanie seeds nie powiodło się",
    },
    success: {
      generated: "Seeds wygenerowane pomyślnie",
    },
  },
  taskIndex: {
    category: "Generatory",

    post: {
      title: "Generuj indeks zadań",
      description: "Generuj pliki indeksu zadań",
      container: {
        title: "Generowanie indeksu zadań",
        description: "Skonfiguruj parametry generowania indeksu zadań",
      },
      fields: {
        outputDir: {
          label: "Katalog wyjściowy",
          description: "Katalog dla wygenerowanych plików indeksu zadań",
        },
        verbose: {
          label: "Szczegółowe wyjście",
          description: "Włącz szczegółowe logowanie",
        },
        duration: {
          title: "Czas trwania",
        },
        success: {
          title: "Sukces",
        },
        message: {
          title: "Wiadomość",
        },
        tasksFound: {
          title: "Znalezione zadania",
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
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił wewnętrzny błąd serwera",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Operacja zakończona pomyślnie",
      },
    },
  },
};
