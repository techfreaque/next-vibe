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
    errorUpdatingDeps: "Fehler beim Aktualisieren der Abhängigkeiten für {{directory}}",
    errorUpdatingVersion: "Fehler beim Aktualisieren der Paketversion für {{directory}}",
  },
};
