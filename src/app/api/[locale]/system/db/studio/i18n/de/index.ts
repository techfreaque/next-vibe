import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "studio",
  post: {
    title: "Datenbank-Studio",
    description: "Datenbank-Studio für visuelle Datenbankverwaltung öffnen",
    form: {
      title: "Studio-Konfiguration",
      description: "Datenbank-Studio-Parameter konfigurieren",
    },
    response: {
      title: "Studio-Antwort",
      description: "Datenbank-Studio-Startergebnisse",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Datenbank-Studio erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Studio-Parameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Studio-Start",
      },
      internal: {
        title: "Interner Fehler",
        description: "Datenbank-Studio-Start fehlgeschlagen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Studio-Start aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Studio-Start",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für Datenbank-Studio",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Studio-Ressourcen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Studio-Port-Konflikt erkannt",
      },
    },
    success: {
      title: "Studio gestartet",
      description: "Datenbank-Studio erfolgreich gestartet",
    },
  },
  fields: {
    port: {
      title: "Port",
      description: "Portnummer für Datenbank-Studio (1024-65535)",
    },
    openBrowser: {
      title: "Browser öffnen",
      description: "Studio automatisch im Browser öffnen",
    },
    success: {
      title: "Erfolgsstatus",
    },
    url: {
      title: "Studio-URL",
    },
    portUsed: {
      title: "Tatsächlich verwendeter Port",
    },
    output: {
      title: "Start-Ausgabe",
    },
    duration: {
      title: "Start-Dauer",
    },
  },
};
