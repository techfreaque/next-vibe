import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Interaktiven Frame erfassen",
    titleShort: "Frame erfassen",
    description:
      "Aktuellen gerenderten Frame einer laufenden interaktiven Vibe-Sitzung auslesen",
    form: {
      fields: {
        pid: {
          label: "Sitzungs-PID",
          description:
            "PID der interaktiven Sitzung. Automatische Erkennung wenn leer.",
        },
      },
    },
    response: {
      fields: {
        content: "Frame-Inhalt",
        logs: "Fehlerprotokolle",
        pid: "Sitzungs-PID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Keine Sitzung",
        description: "Keine aktive interaktive Sitzung gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Sitzungskonflikt",
      },
    },
    success: {
      title: "Frame erfasst",
      description: "Aktueller Frame erfolgreich abgerufen",
    },
  },
  sendKeys: {
    title: "Tasten an interaktive Sitzung senden",
    titleShort: "Tasten senden",
    description:
      "Tastatureingaben in eine laufende interaktive Vibe-Sitzung einspeisen und aktualisierten Frame zurückgeben",
    form: {
      fields: {
        keys: {
          label: "Tasten",
          description:
            "Taste: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space oder Freitext",
        },
        pid: {
          label: "Sitzungs-PID",
          description:
            "PID der interaktiven Sitzung. Automatische Erkennung wenn leer.",
        },
        waitMs: {
          label: "Wartezeit (ms)",
          description:
            "Millisekunden Wartezeit nach Tasteneingabe vor Frame-Abruf. Standard 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Frame-Inhalt",
        logs: "Fehlerprotokolle",
        pid: "Sitzungs-PID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Keine Sitzung",
        description: "Keine aktive interaktive Sitzung gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Sitzungskonflikt",
      },
    },
    success: {
      title: "Tasten gesendet",
      description: "Tastatureingaben gesendet und Frame aktualisiert",
    },
  },
};
