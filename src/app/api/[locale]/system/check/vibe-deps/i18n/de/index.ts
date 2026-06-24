import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Deps",
  description:
    "Abhängigkeitsanalyse für Definition-Dateien. Erstellt Import-Graphen auf Datei- und Kategorieebene: Wer hängt von was ab, ungenutzte Exports, Kandidaten für gemeinsame Bibliotheken. Mit --focus auf ein Modul zoomen, --mode=categories für einen Überblick, --mode=unused für toten Code.",
  category: "Entwicklungstools",
  tag: "analyse",

  mode: {
    files: "Dateien",
    categories: "Kategorien",
    unused: "Ungenutzt",
  },

  container: {
    title: "Abhängigkeitsanalyse",
    description: "Umfang und Modus der Abhängigkeitsprüfung konfigurieren",
  },

  fields: {
    focus: {
      label: "Fokus-Pfad",
      description:
        "Auf eine bestimmte Datei oder ein Verzeichnis einschränken (z. B. 'agent/ai-stream' oder 'user'). Leer lassen für die gesamte Codebasis.",
      placeholder: "z. B. agent/ai-stream oder user",
    },
    mode: {
      label: "Modus",
      description:
        "files: Datei-Importgraph. categories: Zusammengefasst nach Top-Level-Verzeichnis. unused: Dateien ohne Importeure.",
    },
    depth: {
      label: "Tiefe",
      description:
        "Wie viele Ebenen transitiver Abhängigkeiten einbezogen werden (Standard: 1, nur direkte). 0 = unbegrenzt.",
    },
    limit: {
      label: "Limit",
      description: "Maximale Anzahl zurückgegebener Einträge (Standard: 100).",
    },
  },

  response: {
    success: "Abhängigkeitsanalyse abgeschlossen",
    entries: {
      title: "Abhängigkeitseinträge",
      emptyState: {
        description: "Keine Dateien für den angegebenen Filter gefunden.",
      },
      importedBy: "importiert von",
    },
    summary: {
      title: "Zusammenfassung",
      totalFiles: "Gesamtzahl geprüfter Dateien",
      totalEdges: "Gesamtzahl Import-Kanten",
      unusedCount: "Ungenutzte Exports",
    },
  },

  errors: {
    validation: {
      title: "Ungültige Parameter",
      description: "Die Abhängigkeitsanalyse-Parameter sind ungültig",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Bei der Abhängigkeitsanalyse ist ein interner Fehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, die Abhängigkeitsanalyse auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf die Abhängigkeitsanalyse ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Der angegebene Fokus-Pfad wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Serverfehler während der Abhängigkeitsanalyse aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Abhängigkeitsanalyse aufgetreten",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Während der Abhängigkeitsanalyse ist ein Konflikt aufgetreten",
    },
  },

  success: {
    title: "Analyse abgeschlossen",
    description: "Abhängigkeitsanalyse erfolgreich abgeschlossen",
  },
};
