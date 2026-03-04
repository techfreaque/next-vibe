import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Electron Starten",
  },
  post: {
    title: "Electron-App starten",
    description:
      "Main/Preload kompilieren und Electron-Desktop-Fenster starten (Dev-Modus — kein Paketieren)",
    form: {
      title: "Electron Start Konfiguration",
      description: "Konfigurieren wie die Electron-App startet",
    },
    response: {
      title: "Antwort",
      description: "Start-Antwortdaten",
    },
    fields: {
      port: {
        title: "Port",
        description: "Port auf dem der vibe-Server läuft (Standard: 3000)",
      },
      vibeStart: {
        title: "vibe start ausführen",
        description:
          "vibe start im Hintergrund starten bevor das Fenster geöffnet wird",
      },
      success: {
        title: "Erfolgreich",
      },
      output: {
        title: "Ausgabe",
      },
      duration: {
        title: "Dauer (ms)",
      },
      errors: {
        title: "Fehler",
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
    },
    success: {
      title: "Erfolg",
      description: "Electron-App gestartet",
    },
  },
};
