import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Waliduj integrację tRPC",
  description: "Waliduj integrację routera tRPC z punktami końcowymi API",
  category: "Punkt końcowy API",
  tags: {
    trpc: "tRPC",
    validation: "Walidacja",
  },
  operations: {
    validateIntegration: "Waliduj integrację",
    validateRouteFile: "Waliduj plik trasy",
    generateReport: "Generuj raport",
    fixRoutes: "Napraw trasy",
    checkRouterExists: "Sprawdź router",
  },
  severity: {
    error: "Błąd",
    warning: "Ostrzeżenie",
    info: "Info",
  },
  fields: {
    operation: {
      label: "Operacja",
      description: "Operacja walidacji do wykonania",
      placeholder: "Wybierz operację walidacji",
    },
    filePath: {
      label: "Ścieżka pliku",
      description: "Opcjonalna konkretna ścieżka pliku do walidacji",
      placeholder: "Wprowadź ścieżkę pliku",
    },
    options: {
      label: "Opcje",
      description: "Opcje walidacji",
      placeholder: "Wprowadź opcje",
    },
  },
  response: {
    success: {
      label: "Sukces",
    },
    operation: {
      label: "Operacja",
    },
    result: {
      label: "Wynik",
    },
  },
  errors: {
    executionFailed: {
      title: "Walidacja TRPC nie powiodła się",
    },
  },
};
