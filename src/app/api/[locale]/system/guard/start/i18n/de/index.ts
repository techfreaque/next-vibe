import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Guard Starten",
  description: "Guard-Umgebungen für VSCode-Projekte starten",
  tag: "Starten",
  category: "Guard",
  container: {
    title: "Start-Konfiguration",
    description: "Guard-Startparameter konfigurieren",
  },
  fields: {
    projectPath: {
      title: "Projektpfad",
      description: "Pfad zum VSCode-Projekt",
      placeholder: "/home/user/projects/mein-projekt",
    },
    guardId: {
      title: "Guard-ID",
      description: "Eindeutiger Bezeichner für die Guard-Umgebung",
      placeholder: "guard_mein_projekt_abc123",
    },
    startAll: {
      title: "Alle Guards Starten",
      description: "Alle verfügbaren Guard-Umgebungen starten",
    },
    totalStarted: {
      title: "Gesamt Gestartet",
    },
    output: {
      title: "Ausgabe",
    },
    startedGuards: {
      columns: {
        username: "Benutzername",
        projectPath: "Projektpfad",
      },
    },
    summary: {
      title: "Zusammenfassung",
    },
    status: {
      title: "Status",
    },
    hasIssues: {
      title: "Hat Probleme",
    },
  },
  errors: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    internal: {
      title: "Interner Fehler",
      description: "Interner Serverfehler aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Guard-Umgebung nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Guard-Umgebung bereits gestartet",
    },
  },
  success: {
    title: "Erfolg",
    description: "Guard erfolgreich gestartet",
  },
};
