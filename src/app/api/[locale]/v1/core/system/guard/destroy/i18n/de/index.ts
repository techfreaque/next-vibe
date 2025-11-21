import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Guard zerstören",
  description: "Guard-Umgebungen zerstören und Ressourcen bereinigen",
  tag: "guard-verwaltung",
  container: {
    title: "Guard-Zerstörungskonfiguration",
    description: "Parameter zum Zerstören von Guard-Umgebungen konfigurieren",
  },
  fields: {
    projectPath: {
      title: "Projektpfad",
      description: "Pfad zum Projektverzeichnis",
      placeholder: "/home/user/projects/mein-projekt",
    },
    guardId: {
      title: "Guard-ID",
      description: "Eindeutige Kennung für den Guard",
      placeholder: "guard_mein_projekt_abc123",
    },
    force: {
      title: "Erzwingen",
      description: "Zerstörung erzwingen, auch wenn Guard läuft",
    },
    cleanupFiles: {
      title: "Dateien bereinigen",
      description: "Alle Guard-bezogenen Dateien entfernen",
    },
    dryRun: {
      title: "Probelauf",
      description:
        "Vorschau, was zerstört würde, ohne tatsächlich zu zerstören",
    },
    success: {
      title: "Erfolg",
    },
    output: {
      title: "Ausgabe",
    },
    destroyedGuards: {
      title: "Zerstörte Guards",
    },
    warnings: {
      title: "Warnungen",
    },
    totalDestroyed: {
      title: "Gesamt zerstört",
    },
    username: {
      title: "Benutzername",
    },
    wasRunning: {
      title: "War aktiv",
    },
    filesRemoved: {
      title: "Dateien entfernt",
    },
    userRemoved: {
      title: "Benutzer entfernt",
    },
  },
  form: {
    title: "Konfiguration",
    description: "Parameter konfigurieren",
  },
  response: {
    title: "Antwort",
    description: "Antwortdaten",
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
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    destruction_failed: {
      title: "Guard-Zerstörung fehlgeschlagen",
      description: "Guard-Umgebung konnte nicht zerstört werden",
    },
    guard_not_found: {
      title: "Guard nicht gefunden",
      description: "Keine Guard-Umgebung für das angegebene Projekt gefunden",
    },
  },
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
  },
};
