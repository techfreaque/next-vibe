import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Guard Stoppen",
  description: "Guard-Umgebungen für VSCode-Projekte stoppen",
  tag: "guard",

  container: {
    title: "Guard Stopp-Konfiguration",
    description: "Parameter zum Stoppen von Guard-Umgebungen konfigurieren",
  },

  fields: {
    projectPath: {
      title: "Projektpfad",
      description: "Pfad zum Projektverzeichnis",
      placeholder: "/pfad/zu/ihrem/projekt",
    },
    guardId: {
      title: "Guard-ID",
      description: "Spezifische Guard-ID zum Stoppen",
      placeholder: "guard_projekt_abc123",
    },
    username: {
      title: "Benutzername",
    },
    wasRunning: {
      title: "War aktiv",
    },
    nowRunning: {
      title: "Jetzt aktiv",
    },
    pid: {
      title: "Prozess-ID",
    },
    forceStopped: {
      title: "Erzwungener Stopp",
    },
    stopAll: {
      title: "Alle Guards Stoppen",
      description: "Alle laufenden Guard-Umgebungen stoppen",
    },
    force: {
      title: "Erzwungen Stoppen",
      description: "Erzwungen stoppen, auch wenn Guard nicht reagiert",
    },
    success: {
      title: "Operation Erfolgreich",
    },
    output: {
      title: "Befehlsausgabe",
    },
    stoppedGuards: {
      title: "Gestoppte Guards",
    },
    totalStopped: {
      title: "Gesamt Gestoppt",
    },
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    internal: {
      title: "Interner Fehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
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
    description: "Guard Stopp-Operation erfolgreich abgeschlossen",
  },
};
