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
  scripts: {
    invalidPackageJson: "Nieprawidłowy format package.json w {{path}}",
    testsFailed: "Testy nie powiodły się w {{path}}",
    lintFailed: "Linting nie powiódł się w {{path}}",
    typecheckFailed: "Sprawdzanie typów nie powiodło się w {{path}}",
    buildFailed: "Build nie powiódł się w {{path}}",
    packageJsonNotFound: "Nie znaleziono package.json w {{path}}",
  },
  snyk: {
    cliNotFound: "Nie znaleziono Snyk CLI dla {{packageName}}",
    testFailed: "Test podatności Snyk nie powiódł się dla {{packageName}}",
    tokenRequired:
      "Wymagana zmienna środowiskowa SNYK_TOKEN dla {{packageName}}",
    orgKeyRequired:
      "Wymagana zmienna środowiskowa SNYK_ORG_KEY dla {{packageName}}",
    monitorFailed: "Monitor Snyk nie powiódł się dla {{packageName}}",
  },
};
