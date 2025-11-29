import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Alle generieren",
    description: "Alle Code-Generatoren ausführen",
    container: {
      title: "Konfiguration für Alle generieren",
      description: "Generierungsparameter konfigurieren",
    },
    fields: {
      rootDir: {
        label: "Stammverzeichnis",
        description: "Stammverzeichnis für die Generierung",
      },
      outputDir: {
        label: "Ausgabeverzeichnis",
        description: "Ausgabeverzeichnis für generierte Dateien",
      },
      verbose: {
        label: "Ausführliche Ausgabe",
        description: "Ausführliche Protokollierung aktivieren",
      },
      skipEndpoints: {
        label: "Endpunkte überspringen",
        description: "Endpunktgenerierung überspringen",
      },
      skipSeeds: {
        label: "Seeds überspringen",
        description: "Seed-Generierung überspringen",
      },
      skipTaskIndex: {
        label: "Task-Index überspringen",
        description: "Task-Index-Generierung überspringen",
      },
      skipTrpc: {
        label: "TRPC überspringen",
        description: "TRPC-Router-Generierung überspringen",
      },
      success: {
        title: "Erfolg",
      },
      generationCompleted: {
        title: "Generierung abgeschlossen",
      },
      output: {
        title: "Ausgabe",
      },
      generationStats: {
        title: "Generierungsstatistiken",
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
        description: "Interner Serverfehler aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
