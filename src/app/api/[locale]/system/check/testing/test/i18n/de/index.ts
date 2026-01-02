import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Tests ausführen",
  description: "Test-Suite mit optionalen Konfigurationen ausführen",
  category: "Tests",
  tag: "Test",

  container: {
    title: "Test-Konfiguration",
    description: "Parameter für die Testausführung konfigurieren",
  },

  fields: {
    path: {
      label: "Test-Pfad",
      description: "Pfad zu Testdateien oder Verzeichnis",
      placeholder: "src/",
    },
    verbose: {
      label: "Ausführliche Ausgabe",
      description: "Detaillierte Testausgabe aktivieren",
    },
    watch: {
      label: "Watch-Modus",
      description: "Tests im Watch-Modus für Dateiänderungen ausführen",
    },
    coverage: {
      label: "Coverage-Bericht",
      description: "Test-Coverage-Bericht generieren",
    },
  },

  response: {
    success: "Test-Ausführungsstatus",
    output: "Testausgabe und Ergebnisse",
    duration: "Test-Ausführungsdauer (ms)",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Test-Konfigurationsparameter",
    },
    internal: {
      title: "Interner Fehler",
      description: "Testausführung aufgrund eines internen Fehlers fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Berechtigung für Testausführung verweigert",
    },
    forbidden: {
      title: "Verboten",
      description: "Testausführung ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Testdateien oder Verzeichnis nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Serverfehler während der Testausführung",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen, die Tests beeinflussen könnten",
    },
    conflict: {
      title: "Konflikt",
      description: "Test-Ausführungskonflikt erkannt",
    },
  },

  success: {
    title: "Tests abgeschlossen",
    description: "Testausführung erfolgreich abgeschlossen",
  },
};
