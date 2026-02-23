import { translations as validationTranslations } from "../../validation/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  validation: validationTranslations,
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
