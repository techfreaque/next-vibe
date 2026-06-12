import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Generatory",

  title: "Generuj router tRPC",
  titleShort: "Router tRPC",
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
};
