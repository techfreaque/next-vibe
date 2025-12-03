export const translations = {
  category: "Release-Tool",
  config: {
    fileNotFound: "Konfigurationsdatei nicht gefunden: {{path}}",
    invalidFormat:
      "Ungültiges Konfigurationsformat. Stellen Sie sicher, dass die Konfiguration ein Standardobjekt mit einem 'packages'-Array exportiert. Weitere Informationen finden Sie in der Dokumentation.",
    errorLoading: "Fehler beim Laden der Konfiguration",
  },
  packageJson: {
    notFound: "Package.json nicht gefunden: {{path}}",
    invalidFormat: "Ungültiges package.json-Format: {{path}}",
    errorReading: "Fehler beim Lesen von package.json",
    errorUpdatingDeps:
      "Fehler beim Aktualisieren der Abhängigkeiten für {{directory}}",
    errorUpdatingVersion:
      "Fehler beim Aktualisieren der Paketversion für {{directory}}",
  },
  scripts: {
    invalidPackageJson: "Ungültiges package.json-Format in {{path}}",
    testsFailed: "Tests fehlgeschlagen in {{path}}",
    lintFailed: "Linting fehlgeschlagen in {{path}}",
    typecheckFailed: "Typprüfung fehlgeschlagen in {{path}}",
    buildFailed: "Build fehlgeschlagen in {{path}}",
    packageJsonNotFound: "Package.json nicht gefunden in {{path}}",
  },
  snyk: {
    cliNotFound: "Snyk CLI nicht gefunden für {{packageName}}",
    testFailed: "Snyk Schwachstellentest fehlgeschlagen für {{packageName}}",
    tokenRequired:
      "SNYK_TOKEN Umgebungsvariable erforderlich für {{packageName}}",
    orgKeyRequired:
      "SNYK_ORG_KEY Umgebungsvariable erforderlich für {{packageName}}",
    monitorFailed: "Snyk Monitor fehlgeschlagen für {{packageName}}",
  },
};
