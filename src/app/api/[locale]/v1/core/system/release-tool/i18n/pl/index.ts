export const translations = {
  category: "Narzędzie Wydań",
  config: {
    fileNotFound: "Nie znaleziono pliku konfiguracyjnego: {{path}}",
    invalidFormat:
      "Nieprawidłowy format konfiguracji. Upewnij się, że konfiguracja eksportuje domyślny obiekt z tablicą 'packages'. Sprawdź dokumentację, aby uzyskać więcej informacji.",
    errorLoading: "Błąd ładowania konfiguracji",
  },
  packageJson: {
    notFound: "Nie znaleziono package.json: {{path}}",
    invalidFormat: "Nieprawidłowy format package.json: {{path}}",
    errorReading: "Błąd odczytu package.json",
    errorUpdatingDeps: "Błąd aktualizacji zależności dla {{directory}}",
    errorUpdatingVersion: "Błąd aktualizacji wersji pakietu dla {{directory}}",
  },
};
