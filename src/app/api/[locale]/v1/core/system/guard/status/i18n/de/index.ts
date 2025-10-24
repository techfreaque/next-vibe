import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard",
  post: {
    title: "Guard-Status",
    description: "Guard-Umgebungsstatus prüfen",
    tag: "Status",
    container: {
      title: "Guard-Status-Konfiguration",
      description: "Statusprüfungsparameter konfigurieren",
    },
    fields: {
      projectPath: {
        title: "Projektpfad",
        description: "Pfad zum Guard-Projekt",
        placeholder: "/pfad/zum/projekt",
      },
      guardId: {
        title: "Guard-ID",
        description: "Eindeutige Kennung für den Guard",
        placeholder: "guard-123",
      },
      listAll: {
        title: "Alle Guards auflisten",
        description: "Alle Guard-Umgebungen auflisten",
      },
      success: {
        title: "Erfolg",
      },
      output: {
        title: "Ausgabe",
      },
      guards: {
        title: "Guards",
      },
      totalGuards: {
        title: "Gesamt Guards",
      },
      activeGuards: {
        title: "Aktive Guards",
      },
    },
    form: {
      title: "Statuskonfiguration",
      description: "Statusparameter konfigurieren",
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
      internal: {
        title: "Interner Fehler",
        description: "Interner Serverfehler ist aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
