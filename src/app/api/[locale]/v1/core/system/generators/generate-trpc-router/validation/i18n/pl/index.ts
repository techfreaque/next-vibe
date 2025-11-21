import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
